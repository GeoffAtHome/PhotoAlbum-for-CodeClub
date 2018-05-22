const functions = require("firebase-functions");
const gcs = require('@google-cloud/storage')({ keyFilename: 'service-account-credentials.json' });
const admin = require('firebase-admin');
admin.initializeApp();
const os = require('os');
const fs = require('fs');
const path = require('path');
const spawn = require('child-process-promise').spawn;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.onFileChange = functions.storage.object('/upload/').onFinalize(event => {
    const filePath = event.name;
    // Only process files in the upload folder
    if (path.dirname(filePath) !== 'upload') {
        return Promise.resolve('OK');
    }

    if (!event.contentType.startsWith('image/')) {
        return Promise.resolve('Error');
    }

    const bucket = gcs.bucket(event.bucket);
    const srcFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const resizedFilePath = path.join(os.tmpdir(), '2-' + path.basename(filePath));
    const metadata = { contentType: event.contentType };

    const sizes = {
        // C: '60x60',
        // S: '140x140',
        M: '300x300',
        // L: '800x800',
        X: '1920x1920'
    };
    const files = [];

    return bucket.file(filePath).download({
        destination: srcFilePath
    }).then(() => {
        const promises = [];

        for (const size in sizes) {
            const destination = path.join('dl' + size, path.basename(filePath));
            files.push(destination);
            const p = ResizeImage(srcFilePath, resizedFilePath, bucket, metadata, destination, sizes[size])

            promises.push(p);
        }
        return Promise.all(promises);
    }).then(() => {
        // Once the image has been uploaded delete the local files to free up disk space.
        fs.unlinkSync(srcFilePath);
        fs.unlinkSync(resizedFilePath);

        const promises = [];

        const config = {
            action: 'read',
            expires: '03-01-2500',
        };
        for (const filename in files) {
            const file = bucket.file(filename);
            const p = file.getSignedUrl(config);
            promises.push(p)
        }
        return Promise.all(promises);
    }).then((results) => {
        const links = [];
        for (const r of results) {
            links.push(r);
        }
        const albumListRef = admin.database().ref('images');
        albumListRef.once("value", (snapshot) => {
            console.log("Updating snapshot");
            console.log(snapshot.val());
            if (snapshot.val() !== null) {
                snapshot.val().items.push({ title: "", description: "", links: links })
                return albumListRef.update(snapshot);
            }
            const document = { description: "", title: "", items: [] };
            document.items.push({ title: "", description: "", links: links })
            return albumListRef.update(document);

        }, (errorObject) => {
            console.log("The read failed: " + errorObject.code);
            const document = { description: "", title: "", items: [] };
            document.items.push({ title: "", description: "", links: links })
            return albumListRef.update(document);
        });

    });
});

function ResizeImage(srcFilePath, resizedFilePath, destBucket, metadata, destination, size) {
    return spawn('convert', [srcFilePath, '-auto-orient', '-resize', size, resizedFilePath]).then(() => {
        return destBucket.upload(resizedFilePath, {
            destination: destination,
            metadata: metadata
        });
    });
}
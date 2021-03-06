const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

export const onUserCreate = functions.database.ref("/users/{userId}/roles")
    .onCreate((snapshot, context) => {
        const userId = context.params.userId;
        console.log("Update user: " + userId + " claims: " + JSON.stringify(snapshot));

        return admin.auth().setCustomUserClaims(userId, snapshot);
    });


export const onUserUpdate = functions.database.ref("/users/{userId}/roles")
    .onUpdate((change, context) => {
        // Exit when the data is deleted.
        if (!change.after.exists()) {
            console.log("!Change.after.exists()");
            // return null;
        }
        const userId = context.params.userId;
        const after = change.after;
        console.log("Update user: " + userId + " claims: " + JSON.stringify(after));

        return admin.auth().setCustomUserClaims(userId, after);
    });


// New user added
export const onNewUserCreate = functions.database.ref("/newusers/{id}")
    .onCreate((snapshot, context) => {
        const id = context.params.id;
        const newUserStr = JSON.stringify(snapshot);
        console.log("Adding new user: " + newUserStr);
        const newuser = JSON.parse(newUserStr);
        const promises = [];
        promises.push(admin.auth().createUser(newuser)
            .then(function (userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log("Successfully created new user:", userRecord.uid);
            })
            .catch(function (error) {
                console.log("Error creating new user:", error);
            }));

        // Now delete the node
        const node = admin.database().ref("/newusers/" + id);
        promises.push(node.remove()
            .then(function () {
                // File deleted successfully
                console.log("Delete Good:" + id);
            }).catch(function (error) {
                // Uh-oh, an error occurred!
                console.log(error);
            }));

        return Promise.all(promises);

    });

// on sign up.
exports.processSignUp = functions.auth.user().onCreate(user => {
    console.log("Event: " + JSON.stringify(user));
    let customClaims = {};
    // check if user meets role criteria.
    if (user.email &&
        user.email.indexOf("usertwo@me.com") !== -1) {
        customClaims = {
            admin: true,
            reader: true,
            member: true,
        };
    }
    else {
        customClaims = {
            member: true,
        };
    }

    const promises = [];

    promises.push(
        admin.database().ref('users/' + user.uid).set({
            username: user.displayName,
            email: user.email,
            roles: customClaims
        }).then(details => {
            console.log(details);
        })
            .catch(e => {
                console.log(e);
            }));

    // set custom user claims on this newly created user.
    promises.push(admin.auth().setCustomUserClaims(user.uid, customClaims)
        .then(() => {
            // update real-time database to notify client to force refresh.
            const metadataRef = admin.database().ref("metadata/" + user.uid);
            // set the refresh time to the current UTC timestamp.
            // this will be captured on the client to force a token refresh.
            return metadataRef.set({ refreshTime: new Date().getTime() });
        })
        .catch(error => {
            console.log(error);
        }));

    return promises;
});

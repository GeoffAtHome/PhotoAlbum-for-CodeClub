const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

export const onUserCreate = functions.database.ref("/users/{userId}/roles/{roles}")
    .onCreate((snapshot, context) => {
        const userId = context.params.userId;
        const roles = context.params.roles;

        console.log("New user: ${userId} has roles ${roles}");
    });


export const onUserUpdate = functions.database.ref("/users/{userId}/roles/{roles}")
    .onUpdate((change, context) => {
        const userId = context.params.userId;
        const roles = context.params.roles;

        console.log("New user: ${userId} has roles ${roles}");
    });

// on sign up.
exports.processSignUp = functions.auth.user().onCreate(event => {
    const user = event.data; // the Firebase user.
    let customClaims;
    // check if user meets role criteria.
    if (user.email &&
        user.email.indexOf("usertwo@me.com") !== -1) {
        customClaims = {
            admin: true,
            reader: true,
        };
    }
    else {
        customClaims = {
            member: true,
        };
    }
    // set custom user claims on this newly created user.
    return admin.auth().setCustomUserClaims(user.uid, customClaims)
        .then(() => {
            // update real-time database to notify client to force refresh.
            const metadataRef = admin.database().ref("metadata/" + user.uid);
            // set the refresh time to the current UTC timestamp.
            // this will be captured on the client to force a token refresh.
            return metadataRef.set({ refreshTime: new Date().getTime() });
        })
        .catch(error => {
            console.log(error);
        });
};

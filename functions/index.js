//admin is to access data in firebase
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const createUser = require('create_user');
const serviceAccount = require('service_account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://servify-716c6.firebaseio.com"
});

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.createUser = functions.https.onRequest(createUser);
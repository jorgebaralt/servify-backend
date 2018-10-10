// admin is to access data in firebase
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./service_account.json');
const createUser = require('./create_user');
const postService = require('./post_service');
const getServices = require('./get_services');
const addUserdb = require('./add_user_db');
const getFavorite = require('./get_favorite');
const updateFavorite = require('./update_favorite');
const getServicesCount = require('./get_services_count');
const postFeedback = require('./post_feedback');
const deleteService = require('./delete_service');
const updateService = require('./update_service');
const getNearService = require('./get_near_services');
const postRating = require('./post_rating');
const getRatings = require('./get_ratings');
const deleteRating = require('./delete_rating');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://servify-716c6.firebaseio.com'
});

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.createUser = functions.https.onRequest(createUser);
exports.postService = functions.https.onRequest(postService);
exports.getServices = functions.https.onRequest(getServices);
exports.addUserdb = functions.https.onRequest(addUserdb);
exports.getFavorite = functions.https.onRequest(getFavorite);
exports.updateFavorite = functions.https.onRequest(updateFavorite);
exports.getServicesCount = functions.https.onRequest(getServicesCount);
exports.postFeedback = functions.https.onRequest(postFeedback);
exports.deleteService = functions.https.onRequest(deleteService);
exports.updateService = functions.https.onRequest(updateService);
exports.getNearService = functions.https.onRequest(getNearService);
exports.postRating = functions.https.onRequest(postRating);
exports.getRatings = functions.https.onRequest(getRatings);
exports.deleteRating = functions.https.onRequest(deleteRating);

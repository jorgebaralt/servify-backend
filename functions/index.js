const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const cors = require('cors')({ origin: true });
// Body parser to handle incoming form data
const Busboy = require('busboy');
// File system package (default node package)
const fs = require('fs');
// admin is to access data in firebase
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./service_account.json'); // It's on main folder
const createUser = require('./create_user');
const postService = require('./post_service');
const getServices = require('./get_services');
const addUserdb = require('./add_user_db');
const getFavorite = require('./get_favorite');
const addFavorite = require('./add_favorite');
const getServicesCount = require('./get_services_count');
const postFeedback = require('./post_feedback');
const deleteService = require('./delete_service');
const updateService = require('./update_service');
const getNearService = require('./get_near_services');
const postRating = require('./post_rating');
const getRatings = require('./get_ratings');
const deleteRating = require('./delete_rating');
const removeFavorite = require('./remove_favorite');
const getPopularCategories = require('./get_popular_categories');
const reportService = require('./report_service');
const getLocation = require('./get_location');
const deleteFile = require('./delete_file');
const uploadFile = require('./upload_file');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://servify-716c6.firebaseio.com',
	storageBucket: 'gs://servify-716c6.appspot.com'
});

exports.createUser = functions.https.onRequest(createUser);
exports.postService = functions.https.onRequest(postService);
exports.getServices = functions.https.onRequest(getServices);
exports.addUserdb = functions.https.onRequest(addUserdb);
exports.getFavorite = functions.https.onRequest(getFavorite);
exports.addFavorite = functions.https.onRequest(addFavorite);
exports.getServicesCount = functions.https.onRequest(getServicesCount);
exports.postFeedback = functions.https.onRequest(postFeedback);
exports.deleteService = functions.https.onRequest(deleteService);
exports.updateService = functions.https.onRequest(updateService);
exports.getNearService = functions.https.onRequest(getNearService);
exports.postRating = functions.https.onRequest(postRating);
exports.getRatings = functions.https.onRequest(getRatings);
exports.deleteRating = functions.https.onRequest(deleteRating);
exports.removeFavorite = functions.https.onRequest(removeFavorite);
exports.getPopularCategories = functions.https.onRequest(getPopularCategories);
exports.reportService = functions.https.onRequest(reportService);
// Location ipInfo
exports.getLocation = functions.https.onRequest(getLocation);
// File upload
exports.uploadFile = functions.https.onRequest(uploadFile);
// File delete
exports.deleteFile = functions.https.onRequest(deleteFile);

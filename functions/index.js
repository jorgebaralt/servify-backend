// Admin is to access data in firebase
const admin = require('firebase-admin');
const functions = require('firebase-functions');
// Key
const serviceAccount = require('./service_account.json');
// Routes
const createUser = require('./create_user');
const postService = require('./post_service');
const getServices = require('./get_services');
const addUserdb = require('./add_user_db');
const getFavorite = require('./get_favorite');
const addFavorite = require('./add_favorite');
const getServicesCount = require('./get_services_count');
const deleteService = require('./delete_service');
const updateService = require('./update_service');
const getNearService = require('./get_near_services');
const postServiceReview = require('./post_service_review');
const getServiceReviews = require('./get_service_reviews');
const deleteRating = require('./delete_rating');
const removeFavorite = require('./remove_favorite');
const getPopularCategories = require('./get_popular_categories');

const getLocation = require('./get_location');
const deleteFile = require('./delete_file');
const uploadFile = require('./upload_file');
const profileImageUpload = require('./profile_image_upload');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://servify-716c6.firebaseio.com',
	storageBucket: 'gs://servify-716c6.appspot.com'
});

// Old routes
exports.createUser = functions.https.onRequest(createUser);
exports.postService = functions.https.onRequest(postService);
exports.getServices = functions.https.onRequest(getServices);
exports.addUserdb = functions.https.onRequest(addUserdb);
exports.getFavorite = functions.https.onRequest(getFavorite);
exports.addFavorite = functions.https.onRequest(addFavorite);
exports.getServicesCount = functions.https.onRequest(getServicesCount);

exports.deleteService = functions.https.onRequest(deleteService);
exports.updateService = functions.https.onRequest(updateService);
exports.getNearService = functions.https.onRequest(getNearService);
exports.postServiceReview = functions.https.onRequest(postServiceReview);
exports.getServiceReviews = functions.https.onRequest(getServiceReviews);
exports.deleteRating = functions.https.onRequest(deleteRating);
exports.removeFavorite = functions.https.onRequest(removeFavorite);
exports.getPopularCategories = functions.https.onRequest(getPopularCategories);

// Location ipInfo
exports.getLocation = functions.https.onRequest(getLocation);
// images upload
exports.uploadFile = functions.https.onRequest(uploadFile);
exports.profileImageUpload = functions.https.onRequest(profileImageUpload);
// File delete
exports.deleteFile = functions.https.onRequest(deleteFile);


// RESTFUL ROUTES
const service = require('./service');
const services = require('./services');
const serviceImages = require('./images_service');
const profileImages = require('./images_profile');
const review = require('./review');
const report = require('./report');
const feedback = require('./feedback');
const favorites = require('./favorites');


// RESTFUL ROUTES
exports.service = functions.https.onRequest(service);
exports.services = functions.https.onRequest(services);
exports.images_service = functions.https.onRequest(serviceImages);
exports.images_profile = functions.https.onRequest(profileImages);
exports.review = functions.https.onRequest(review);
exports.report = functions.https.onRequest(report);
exports.feedback = functions.https.onRequest(feedback);
exports.favorites = functions.https.onRequest(favorites);

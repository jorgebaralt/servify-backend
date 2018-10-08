const admin = require('firebase-admin');

module.exports = function(req, res) {
	const db = admin.firestore();
	const Geopoint = admin.firestore.GeoPoint;
	const FieldValue = admin.firestore.FieldValue;
	const updatedService = req.body;
	const email = updatedService.email;
	const category = updatedService.category;
	let subcategory = '';

	if (updatedService.subcategory) {
		subcategory = updatedService.subcategory;
	}

	updatedService.timestamp = FieldValue.serverTimestamp();
	updatedService.location = new Geopoint(
		updatedService.geolocation.latitude,
		updatedService.geolocation.longitude
	);

	const documentName = email + '_' + category + '_' + subcategory;
	db.collection('services').doc(documentName).set(updatedService)
		.then((result) => {
			return res.send(result);
		})
		.catch((error) => {
			res.status(422).send({ error: error });
		});
};

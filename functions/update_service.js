const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

module.exports = function (req, res) {
	return cors(req, res, () => {
		const db = admin.firestore();
		const Geopoint = admin.firestore.GeoPoint;
		const FieldValue = admin.firestore.FieldValue;
		// const updatedService = req.body.updatedService;
		// const serviceId = req.body.serviceId;
		const { updatedService, serviceId } = req.body;
		// const email = updatedService.email;
		// const category = updatedService.category;
		// let subcategory = '';

		// if (updatedService.subcategory) {
		// 	subcategory = updatedService.subcategory;
		// }
		
		updatedService.lastUpdated = FieldValue.serverTimestamp();
		// Pointer protection
		if (updatedService.geolocation) {
			updatedService.location = new Geopoint(
				updatedService.geolocation.latitude,
				updatedService.geolocation.longitude
			);
		}

		// const documentName = email + '_' + category + '_' + subcategory;
		const serviceRef = db.collection('services').doc(serviceId);
		// Update the document with the new data by merging.
		serviceRef.set(updatedService, { merge: true })
			.then(() => {
				// Fetch updated document.
				serviceRef.get().then((doc) => {
					// Protection against null data just in case. If it exists, 
					// the function returns theh updated document.
					if (doc.exists) {
						console.log("Document data:", doc.data());
						res.status(200).send(doc.data());
					} else {
						// doc.data() will be undefined in this case
						res.status(200).send('No such document!');
					}
				}).catch((error) => {
					res.status(422).send({ error });
				});
			})
			.catch((error) => {
				res.status(422).send({ error });
			});
	});
};

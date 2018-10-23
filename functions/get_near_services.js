const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();
	const GeoPoint = admin.firestore.GeoPoint;
	const currentLocation = req.body.currentLocation;
	const distance = req.body.distance;

	const lat = 0.0144927536231884;
	const lon = 0.0181818181818182;

	const lowerLat = currentLocation.latitude - (lat * distance);
	const lowerLon = currentLocation.longitude - (lon * distance);
	const greaterLat = currentLocation.latitude + (lat * distance);
	const greaterLon = currentLocation.longitude + (lon * distance);

	const lesserGeopoint = new GeoPoint(lowerLat, lowerLon);
	const greaterGeopoint = new GeoPoint(greaterLat, greaterLon);

	db.collection('services')
		.where('location', '>=', lesserGeopoint)
		.where('location', '<=', greaterGeopoint)
		.get()
		.then(snapshot => {
			let query = [];
			snapshot.forEach(doc => {
				query.push(doc.data());
			});
			return res.send(query);
		})
		.catch(error => {
			res.status(422).send({ error });
		});
};

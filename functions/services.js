const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

module.exports = function (req, res) {
	return cors(req, res, () => {
		const db = admin.firestore();
		switch (req.method) {
			/**
			 * GET requests.
			 */
			case 'GET': {
				const {
					category,
					subcategory,
					email,
					zipCode,
					id,
					distance
				} = req.query;
				let currentLocation;

				if (req.query.currentLocation) {
					currentLocation = JSON.parse(req.query.currentLocation);
				}
				
				let field = '';
				let value = '';

				// Get near services
				if (currentLocation && distance) {
					const GeoPoint = admin.firestore.GeoPoint;
					// Get user location (lat and long)

					const lat = 0.0144927536231884;
					const lon = 0.0181818181818182;

					// Calculate geopoints according to distance that we want
					const lowerLat = currentLocation.latitude - lat * distance;
					const lowerLon = currentLocation.longitude - lon * distance;
					const greaterLat =						currentLocation.latitude + lat * distance;
					const greaterLon =						currentLocation.longitude + lon * distance;

					// Pass to GeoPoints
					const lesserGeopoint = new GeoPoint(lowerLat, lowerLon);
					const greaterGeopoint = new GeoPoint(
						greaterLat,
						greaterLon
					);

					// Get only what it is in between those geopoints (firebase compares geopoints)
					return db
						.collection('services')
						.where('location', '>=', lesserGeopoint)
						.where('location', '<=', greaterGeopoint)
						.get()
						.then((snapshot) => {
							const query = [];
							snapshot.forEach((doc) => {
								query.push(doc.data());
							});
							res.set(('Access-Control-Allow-Origin', '*'));
							return res.send(query);
						})
						.catch((error) => {
							return res.status(422).send({ error });
						});
				}

				if (subcategory) {
					field = 'subcategory';
					value = subcategory;
				} else if (category) {
					field = 'category';
					value = category;
				} else if (email) {
					field = 'email';
					value = email;
				} else if (zipCode) {
					field = 'zipCode';
					value = zipCode;
				} else if (id) {
					field = 'id';
					value = id;
				} else {
					return res.status(422).send({ error: 'nothing to query' });
				}
				/*
					get services for specific category/subcategory/email
					take snapshot data, and put it into array
					then return it
				*/
				return db
					.collection('services')
					.where(field, '==', value)
					.get()
					.then((snapshot) => {
						const query = [];
						snapshot.forEach((doc) => {
							query.push(doc.data());
						});
						return res.send(query);
					})
					.catch((error) => {
						res.status(422).send({ error });
					});
			}
			default:
				// Only accept the requests above
				return res.status(500).json({
					message: 'Not allowed'
				});
		}
	});
};

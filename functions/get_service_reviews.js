const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// required param: object containing serviceId: {serviceID}
module.exports = function (req, res) {
	return cors(req, res, () => {
		const db = admin.firestore();
		const { serviceId } = req.query;
		db.collection('reviews')
			.where('serviceId', '==', serviceId)
			.get()
			.then((snapshot) => {
				const query = [];
				snapshot.forEach((doc) => {
					query.push(doc.data());
				});
				return res.send(query);
			})
			.catch((e) => {
				res.status(422).send({ e });
			});
	});
};

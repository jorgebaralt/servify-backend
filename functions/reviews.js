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
				const { serviceId, uid } = req.query;
				// Get current user review, and all reviews except it
				// and returns them separetly
				if (uid) {
					return db
						.collection('reviews')
						.where('serviceId', '==', serviceId)
						.where('uid', '>', uid)
						.where('uid', '<', uid)
						.get()
						.then((snapshot) => {
							const reviews = [];
							snapshot.forEach((doc) => {
								reviews.push(doc.data());
							});
							db.collection('reviews')
								.where('serviceId', '==', serviceId)
								.where('uid', '==', uid)
								.get()
								.then((userSnapshot) => {
									let userReview;
									userSnapshot.forEach((doc) => {
										userReview = doc.data();
									});
									res.status(200).send({
										reviews,
										userReview
									});
								})
								.catch((e) => res.status(422).send({ e }));
						})
						.catch((e) => res.status(422).send({ e }));
				}
				// Get all reviews of a service
				return db
					.collection('reviews')
					.where('serviceId', '==', serviceId)
					.get()
					.then((snapshot) => {
						const query = [];
						snapshot.forEach((doc) => {
							query.push(doc.data());
						});
						return res.send(query);
					})
					.catch((e) => res.status(422).send({ e }));
			}

			default:
				// Only accept the requests above
				return res.status(500).json({
					message: 'Not allowed'
				});
		}
	});
};

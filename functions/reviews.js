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
				// Gets all of the reviews made by specific user
				// then returns them.
				if (uid && !serviceId) {
					return db.collection('reviews')
						.where('uid', '==', uid)
						.get()
						.then((reviewsSnapshot) => {
							const reviews = [];
							reviewsSnapshot.forEach((doc) => {
								reviews.push(doc.data());
							});
							res.status(200).send({
								reviews,
							});
						})
						.catch((e) => res.status(422).send({ e }));
				}
				// Get current user review of a specific service.
				if (uid && serviceId) {
					return db
						.collection('reviews')
						.where('serviceId', '==', serviceId)
						.get()
						.then((snapshot) => {
							const query = [];
							snapshot.forEach((doc) => {
								query.push(doc.data());
							});
							// Filtering the user review out of the array.
							// If there is an user review, then it will be sent as userReview.
							let userReview;
							const reviews = query.filter((review) => {
								if (uid === review.uid) {
									userReview = review;
								}
								return uid !== review.uid;
							});
							return res.status(200).send({
								userReview,
								reviews
							});
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

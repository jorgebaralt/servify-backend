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

			/**
			 * POST requests.
			 */

			case 'POST': {
				const FieldValue = admin.firestore.FieldValue;
				const { review, serviceId } = req.body;

				review.timestamp = FieldValue.serverTimestamp();
				const ref = db.collection('reviews').doc();
				review.id = ref.id;

				return ref.set(review).then(() => {
					db.collection('services')
						.doc(serviceId)
						.get()
						.then((doc) => {
							const ratingCount = doc.data().ratingCount;
							const ratingSum = doc.data().ratingSum;
							const priceCount = doc.data().priceCount;
							const priceSum = doc.data().priceSum;
							db.collection('services')
								.doc(serviceId)
								.update({
									ratingCount: (ratingCount || 0) + 1,
									ratingSum: (ratingSum || 0) + review.rating,
									rating:
										(ratingSum + review.rating
											|| review.rating)
										/ (ratingCount + 1 || 1),
									priceCount: (priceCount || 0) + 1,
									priceSum: (priceSum || 0) + review.price,
									price:
										(priceSum + review.price
											|| review.price)
										/ (priceCount + 1 || 1)
								})
								.then((result) => res.send(result))
								.catch((e) => res.status(422).send(e));
						})
						.catch((error) => {
							res.status(422).send({ error });
						});
				});
			}
			/**
			 * DELETE requests.
			 */

			case 'DELETE': {
				const { review } = req.body;
				return db
					.collection('reviews')
					.doc(review.id)
					.delete()
					.then(() => {
						db.collection('services')
							.doc(review.serviceId)
							.get()
							.then((doc) => {
								const ratingCount = doc.data().ratingCount;
								const ratingSum = doc.data().ratingSum;
								const priceCount = doc.data().priceCount;
								const priceSum = doc.data().priceSum;
								let price;
								let rating;
								// Avoid errors and going negative
								if (ratingCount - 1 <= 0) {
									rating = 0;
								} else {
									rating = ((ratingSum - review.rating) / (ratingCount - 1));
								}
								if (priceCount - 1 <= 0) {
									price = 0;
								} else {
									price =	((priceSum - review.price) / (priceCount - 1));
								}

								db.collection('services')
									.doc(review.serviceId)
									.update({
										ratingCount: ratingCount - 1,
										ratingSum: ratingSum - review.rating,
										rating,
										priceCount: priceCount - 1,
										priceSum: priceSum - review.price,
										price
									})
									.then((result) => res.send(result))
									.catch((e) => res.status(422).send(e));
							})
							.catch((error) => {
								res.status(422).send({ error });
							});
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

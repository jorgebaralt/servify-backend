const admin = require('firebase-admin');

// required params: object with review and serviceId {review, serviceId}
module.exports = function (req, res) {
	const db = admin.firestore();
	const FieldValue = admin.firestore.FieldValue;
	const review = req.body.review;
	const serviceId = req.body.serviceId;

	review.timestamp = FieldValue.serverTimestamp();
	const ref = db.collection('reviews').doc();
	review.id = ref.id;

	ref.set(review)
		.then(() => {
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
							rating: ((ratingSum + review.rating) || review.rating) / ((ratingCount + 1) || 1),
							priceCount: (priceCount || 0) + 1,
							priceSum: (priceSum || 0) + review.price,
							price: ((priceSum + review.price) || review.price) / ((priceCount + 1) || 1)
						})
						.then((result) => {
							return res.send(result);
						})
						.catch((e) => {
							return res.status(422).send(e);
						});
				})
				.catch((error) => {
					res.status(422).send({ error });
				});
		});
};

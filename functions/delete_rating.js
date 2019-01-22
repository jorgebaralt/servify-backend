const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();

	const { review } = req.body;

	db.collection('reviews')
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
						rating = (ratingSum - review.rating) / (ratingCount - 1);
					}
					if (priceCount - 1 <= 0) {
						price = 0;
					} else {
						price = (priceSum - review.prive) / (priceCount - 1);
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

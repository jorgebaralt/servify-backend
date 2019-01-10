const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();
	const FieldValue = admin.firestore.FieldValue;
	const data = req.body;
	const service = data.service;
	const review = data.review;
	let subcategory = '';

	if (service.subcategory) {
		subcategory = service.subcategory;
	}
	
	const documentName = service.email + '_' + service.category + '_' + subcategory;

	review.timestamp = FieldValue.serverTimestamp();

	db.collection('services')
		.doc(documentName)
		.collection('reviews')
		.doc(review.reviewerEmail)
		.set(review)
		.then(() => {
			db.collection('services')
				.doc(documentName)
				.get()
				.then((doc) => {
					const ratingCount = doc.data().ratingCount;
					const ratingSum = doc.data().ratingSum;
					const priceCount = doc.data().priceCount;
					const priceSum = doc.data().priceSum;
					db.collection('services')
						.doc(documentName)
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

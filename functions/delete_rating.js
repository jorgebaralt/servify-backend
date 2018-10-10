const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();

	const data = req.body;
	const service = data.service;
	const review = data.review;

	let subcategory = '';

	if (service.subcategory) {
		subcategory = service.subcategory;
	}

	const documentName = service.email + '_' + service.category + '_' + subcategory;

	db.collection('services')
		.doc(documentName)
		.collection('reviews')
		.doc(review.reviewerEmail)
		.delete()
		.then(() => {
			db.collection('services')
				.doc(documentName)
				.get()
				.then((doc) => {
					const ratingCount = doc.data().ratingCount;
					const ratingSum = doc.data().ratingSum;
					let rating;
					if (ratingCount - 1 === 0) {
						rating = 0;
					} else {
						rating = (ratingSum - review.rating) / (ratingCount - 1);
					}
					db.collection('services')
						.doc(documentName)
						.update({
							ratingCount: ratingCount - 1,
							ratingSum: ratingSum - review.rating,
							rating
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

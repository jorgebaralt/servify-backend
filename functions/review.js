const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

const calculateNewRatings = (oldRatings, review, bIsDelete, bIsPrice) => {
	// Object keys
	let average;
	let	sum;
	let	count;
	// Depending on the type of the rating the keys will change. The boolean bIsPrice
	// determines which type of rating object will be returned.
	if (bIsPrice) {
		average = 'price';
		sum = 'priceSum';
		count = 'priceCount';
	} else {
		average = 'rating';
		sum = 'ratingSum';
		count = 'ratingCount';
	}
	const ratings = {
		[average]: oldRatings[average] ? oldRatings[average] : 0,
		[sum]: oldRatings[sum] ? oldRatings[sum] : 0,
		[count]: oldRatings[count] ? oldRatings[count] : 0
	};
    // If it's delete then the count decreses by 1. Else it will add 1.
    if (bIsDelete) {
        ratings[count]--;
    } else {
        ratings[count]++;
    }
    // If it's a post, then sum. Else it will be a difference between the old sum
    // and the deleted review's rating.
    if (bIsDelete) {
        ratings[sum] -= review[average];
    } else {
        ratings[sum] += review[average];
    }
    ratings[average] = ( // Average
        (ratings[sum]) / (ratings[count])
    );
    return ratings;
};

const washRatings = (updatedRatings, bIsPrice) => {
	// Object keys
	let average;
	let	sum;
	let	count;
	// Depending on the type of the rating the keys will change. The boolean bIsPrice
	// determines which type of rating object will be returned.
	if (bIsPrice) {
		average = 'price';
		sum = 'priceSum';
		count = 'priceCount';
	} else {
		average = 'rating';
		sum = 'ratingSum';
		count = 'ratingCount';
	}
	const ratings = {
		[average]: updatedRatings[average] ? updatedRatings[average] : 0,
		[sum]: updatedRatings[sum] ? updatedRatings[sum] : 0,
		[count]: updatedRatings[count] ? updatedRatings[count] : 0
	};
	// Avoid errors and going negative.
	if (ratings[average] <= 0 || ratings[sum] <= 0 || ratings[count] <= 0) {
		ratings[average] = 0;
		ratings[sum] = 0;
		ratings[count] = 0;
	}
	return ratings;
};

module.exports = function (req, res) {
	return cors(req, res, () => {
		const db = admin.firestore();
		switch (req.method) {
			/**
			 * POST requests.
			 */

			case 'POST': {
				const FieldValue = admin.firestore.FieldValue;
				const { review, serviceId } = req.body;
				review.timestamp = FieldValue.serverTimestamp();
				// Checking if review exists under this service ID
				return db.collection('reviews')
					.where('uid', '==', review.uid)
					.where('serviceId', '==', serviceId)
					.get()
						.then((snapshot) => {
							// If it's empty, create the review.
							// Firestore generates new id if executing doc() with no arguments.
                            if (snapshot.empty) {
								const ref = db.collection('reviews').doc();
								review.id = ref.id;
								return ref.set(review).then(() => {
									db.collection('services')
										.doc(serviceId)
										.get()
										.then((doc) => {
											let newRatings = calculateNewRatings({
												ratingCount: doc.data().ratingCount,
												ratingSum: doc.data().ratingSum,
												rating: doc.data().rating
											}, review);
											let newPriceRatings = calculateNewRatings({
												priceCount: doc.data().priceCount,
												priceSum: doc.data().priceSum,
												price: doc.data().price
											}, review, false, true);
											// Avoid errors and going negative.
											newRatings = washRatings(newRatings);
											newPriceRatings = washRatings(newPriceRatings, true);
											console.log('newRatings', newRatings);
											console.log('newPriceRatings', newPriceRatings);
											console.log('review', review);
											db.collection('services')
												.doc(serviceId)
												.update({
													ratingCount: newRatings.ratingCount,
													ratingSum: newRatings.ratingSum,
													rating: newRatings.rating,
													priceCount: newPriceRatings.priceCount,
													priceSum: newPriceRatings.priceSum,
													price: newPriceRatings.price
												})
												.then(() => res.status(200).send(review))
												.catch((error) => {
													console.log(error); // Firebase log
													return res.status(422).send(error);
												});
										})
										.catch((error) => {
											console.log(error); // Firebase log
											return res.status(422).send(error);
										});
								});
							}
							return res.status(422).send({
								error: 'This account already has made a review to this service. Only 1 review per service is allowed.',
								type: 'warning'
							});
						})
						.catch((error) => {
							console.log(error); // Firebase log
							return res.status(422).send(error);
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
								let newRatings = calculateNewRatings({
									ratingCount: doc.data().ratingCount,
									ratingSum: doc.data().ratingSum,
									rating: doc.data().rating
								}, review, true);
								let newPriceRatings = calculateNewRatings({
									priceCount: doc.data().priceCount,
									priceSum: doc.data().priceSum,
									price: doc.data().price
								}, review, true, true);
								// Avoid errors and going negative.
								newRatings = washRatings(newRatings);
								newPriceRatings = washRatings(newPriceRatings, true);
								return db.collection('services')
									.doc(review.serviceId)
									.update({
										ratingCount: newRatings.ratingCount,
										ratingSum: newRatings.ratingSum,
										rating: newRatings.rating,
										priceCount: newPriceRatings.priceCount,
										priceSum: newPriceRatings.priceSum,
										price: newPriceRatings.price
									})
									.then((result) => res.status(200).send(result))
									.catch((error) => {
										console.log(error); // Firebase logging
										return res.status(422).send(error);
									});
							})
							.catch((error) => {
								console.log(error); // Firebase logging
								return res.status(422).send(error);
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

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
			 * GET requests.
			 */

			case 'GET': {
                const { collection, keywords, query } = req.query;
                // Checking for null variables.
                if (!collection || !keywords || !query) {
                    return res.status(422).json({
                        message: 'Invalid parameters.'
                    });
                }
                let limit = req.query.limit;
                if (!limit) { // Default limit if null in query.
                    limit = 5;
                }
				return;
			}
			default:
				// Only accept the requests above
				return res.status(500).json({
					message: 'Not allowed'
				});
		}
	});
};

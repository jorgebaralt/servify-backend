const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

module.exports = function (req, res) {
	cors(req, res, () => {
		const db = admin.firestore();
		const feedback = req.body;
		const feedbackRef = db.collection('feedbacks').doc();
		feedback.id = feedbackRef.id;
		feedbackRef
			.set(feedback)
			.then((result) => res.send(result))
			.catch((error) => {
				res.status(422).send({ error });
			});
	});
};

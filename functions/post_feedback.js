const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();

	db.collection('feedbacks').add(req.body)
		.then(result => {
			return res.send(result);
		}).catch(error => {
			res.status(422).send({ error });
		});
};
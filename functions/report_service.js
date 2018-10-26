const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();

	db.collection('reports').add(req.body).then((result) => {
		res.send(result);
	});
};

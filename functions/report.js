const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();
	const report = req.body;
	const reportRef = db.collection('reports').doc();
	report.id = reportRef.id;

	reportRef.set(report).then((result) => {
		res.send(result);
	}).catch(e => {
		res.status(422).send({ e });
	});
};

const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();
	const uid = req.body.uid;
	const serviceid = req.body.id;

	// const documentName = service.email + '_' + service.category + '_' + subcategory;

	db.collection('services')
		.doc(serviceid)
		.update({
			favUsers: admin.firestore.FieldValue.arrayRemove(uid)
		})
		.then((result) => {
			res.send(result);
		})
		.catch((error) => {
			res.status(422).send({ error });
		});
};

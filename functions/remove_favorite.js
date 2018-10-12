const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();
	const email = req.body.email;
	const service = req.body.service;
	let subcategory = '';
	if (service.subcategory) {
		subcategory = service.subcategory;
	}

	const documentName = service.email + '_' + service.category + '_' + subcategory;

	db.collection('services')
		.doc(documentName)
		.update({
			favUsers: admin.firestore.FieldValue.arrayRemove(email)
		})
		.then((result) => {
			res.send(result);
		})
		.catch((error) => {
			res.status(422).send({ error });
		});
};

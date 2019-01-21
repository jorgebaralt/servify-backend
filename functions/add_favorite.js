const admin = require('firebase-admin');

// required param: {id,uid}
module.exports = function (req, res) {
	const db = admin.firestore();
	const uid = req.body.uid;
	const id = req.body.id;

	// const documentName = service.email + '_' + service.category + '_' + subcategory;

	db.collection('services')
		.doc(id)
		.update({
			favUsers: admin.firestore.FieldValue.arrayUnion(uid)
		})
		.then((result) => {
			res.send(result);
		})
		.catch((error) => {
			res.status(422).send({ error });
		});
};

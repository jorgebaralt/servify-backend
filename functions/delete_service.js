const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();

	const service = req.body;
	let subcategory = '';

	if (service.subcategory) {
		subcategory = service.subcategory;
	}

	const docName = service.email + '_' + service.category + '_' + subcategory;

	db.collection('services').doc(docName).delete()
		.then(result => {
			return res.send(result);
		}).catch(error => {
			res.status(422).send({ error: error });
		});
	
}
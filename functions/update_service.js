const admin = require('firebase-admin');

module.exports = function(req, res) {
	const db = admin.firestore();
	const updatedService = req.body;
	const category = updatedService.category;
	const subcategory = updatedService.subcategory;
	const FieldValue = admin.firestore.FieldValue;
	let field, value = '';
	updatedService.timestamp = FieldValue.serverTimestamp();

	if (subcategory) {
		field = 'subcategory';
		value = subcategory;
	} else if (category) {
		field = 'category';
		value = category;
	}

	db.collection('services')
		.where('email', '==', updatedService.email)
		.where(field, '==', value)
		.get()
		.then((snapshot) => {
			snapshot.forEach(doc => {
				doc.ref.set(updatedService)
					.then(result => {
						return res.send(result);
					}).catch(error => {
						res.status(422).send({ error: error });
					});
			});
		})
		.catch((error) => {
			res.status(422).send(error);
		});
};

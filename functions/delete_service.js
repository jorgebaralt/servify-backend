const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();
	const category = req.query.category
	const subcategory = req.query.subcategory;
	const email = req.query.email;
	let field, value = '';

	if (subcategory) {
		field = 'subcategory';
		value = subcategory;
	} else if (category) {
		field = 'category';
		value = category;
	} 

	db.collection('services')
		.where('email', '==', email)
		.where(field, '==', value)
		.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				doc.ref.delete()
					.then(result => {
						return res.send(result);
					}).catch(error => {
						res.status(422).send({ error: error });
					});
			});
		}).catch(error => {
			return res.status(422).send(error);
		});
}
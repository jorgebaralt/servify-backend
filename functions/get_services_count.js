const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();
	const category = req.query.category;
	const subcategory = req.query.subcategory;
	const email = req.query.email;
	let field;
    let value = '';

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
		.then((snapshot) => {
			res.send(snapshot.empty);
		})
		.catch((error) => {
			res.status(422).send(error);
		});
};

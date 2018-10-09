const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();
	const service = req.query;
	let subcategory = '';
	if (service.subcategory) {
		subcategory = service.subcategory;
	}
	const documentName = service.email + '_' + service.category + '_' + subcategory;
	db.collection('services')
		.doc(documentName)
		.collection('reviews')
		.orderBy('timestamp')
		.get()
		.then((snapshot) => {
			const query = [];
			snapshot.forEach(doc => {
				query.push(doc.data());
			});
			return res.send(query);
		})
		.catch((e) => {
			res.status(422).send({ e });
		});
};

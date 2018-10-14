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
		.then(() => {
			db.collection('categories').doc(service.category).get()
				.then((doc) => {
					const serviceCount = doc.data().serviceCount - 1;
					db.collection('categories').doc(service.category).update({
						serviceCount
					}).then((result) => {
						return res.send(result);
					})
						.catch(e => {
							return res.status(422).send(e);
						});
				})
				.catch(e => {
					res.status(422).send(e);
				});
		})
		.catch(error => {
			res.status(422).send({ error });
		});
	
};
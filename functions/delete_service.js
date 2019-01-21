const admin = require('firebase-admin');

// Required params: service object with {id,category}
module.exports = function (req, res) {
	const db = admin.firestore();

	const service = req.body;
	const docName = service.id;

	db.collection('services')
		.doc(docName)
		.delete()
		.then(() => {
			db.collection('categories')
				.doc(service.category)
				.get()
				.then((doc) => {
					const serviceCount = doc.data().serviceCount - 1;
					db.collection('categories')
						.doc(service.category)
						.update({
							serviceCount
						})
						.then((result) => res.send(result))
						.catch((e) => res.status(422).send(e));
				})
				.catch((e) => {
					res.status(422).send(e);
				});
		})
		.catch((error) => {
			res.status(422).send({ error });
		});
};

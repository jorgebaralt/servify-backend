const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

module.exports = function (req, res) {
	return cors(req, res, () => {
		const db = admin.firestore();
		switch (req.method) {
			// creating a new categories to db
			case 'POST': {
				const { category } = req.body;

				if (!category.serviceCount) {
					category.serviceCount = 0;
				}

				return db
					.collection('categories')
					.doc(category.dbReference)
					.set(category)
					.then(() => {
						res.send('category added');
					})
					.catch((e) => {
						console.log(e);
						res.status(422).send(e);
					});
			}
			case 'GET': {
				return db
					.collection('categories')
					.orderBy('serviceCount', 'desc')
					.limit(3)
					.get()
					.then((snapshot) => {
						const query = [];
						snapshot.forEach((doc) => {
							query.push(doc.data());
						});
						return res.send(query);
					})
					.catch((e) => {
						res.status(422).send(e);
					});
			}
			default:
				return res.status(500).json({
					message: 'Not allowed'
				});
		}
	});
};

const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();

	db.collection('categories').orderBy('serviceCount', 'desc').limit(3).get()
		.then(snapshot => {
			let query = [];
			snapshot.forEach(doc => {
				query.push(doc.data());
			});
			return res.send(query);
		})
		.catch(e => {
			res.status(422).send(e);
		});
};
const admin = require('firebase-admin');

module.exports = function (req, res) {
	const db = admin.firestore();
	const FieldValue = admin.firestore.FieldValue;

	// check if user already exist
	db.collection('users')
		.doc(req.body.email)
		.get()
		.then((doc) => {
			if (!doc.exist) {
				const creationTime = FieldValue.serverTimestamp();
				db.collection('users')
					.doc(req.body.email)
					.set({
						uid: req.body.uid,
						email: req.body.email,
						fullName: req.body.displayName,
						creationTime,
						provider: req.body.provider,
						photoURL: req.body.photoURL,
						emailVerified: req.body.emailVerified
					})
					.then((result) => res.send(result))
					.catch((error) => {
						res.status(422).send({ error });
					});
			}
		})
		.catch((error) => {
			console.log(error);
			res.send(422).send({ error });
		});
	// if not, craete new user
};

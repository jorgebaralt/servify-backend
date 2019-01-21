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
				const creationDate = FieldValue.serverTimestamp();
				db.collection('users')
					.doc(req.body.email)
					.set({
						uid: req.body.uid,
						email: req.body.email,
						fullName: req.body.displayName,
						creationDate,
						provider: req.body.provider,
						emailVerified: req.body.emailVerified,
						imageInfo: req.body.imageInfo ? req.body.imageInfo : null,
						photoURL: req.body.photoURL ? req.body.photoURL : null
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

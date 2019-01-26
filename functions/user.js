/* eslint-disable object-shorthand */
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

module.exports = function (req, res) {
	return cors(req, res, () => {
		const db = admin.firestore();
		switch (req.method) {
			/**
			 * GET requests.
			 */
			case 'GET': {
				// Get user by UID
				const { uid } = req.query;
				return db.collection('users').doc(uid).get().then(doc => {
					if (doc.exists) {
						res.status(200).send(doc.data());
					} else {
						// doc.data() will be undefined in this case
						res.status(200).send('No such document!');
					}
				})
					.catch(e => {
						res.status(422).send({ e });
					});
			}

			/**
			 * POST requests.
			 */

			case 'POST': {
				const FieldValue = admin.firestore.FieldValue;
				const { user } = req.body;
				const {
					uid,
					email,
					displayName,
					provider,
					emailVerified,
					imageInfo,
					photoURL,
				} = user;
				// check if user already exist
				return db
					.collection('users')
					.doc(uid)
					.get()
					.then((doc) => {
						if (!doc.exist) {
							const creationDate = FieldValue.serverTimestamp();
							db.collection('users')
								.doc(uid)
								.set({
									uid,
									email,
									displayName,
									creationDate,
									provider,
									emailVerified,
									imageInfo: imageInfo,
									photoURL: photoURL
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
			}

			/**
			 * PUT requests.
			 */

			case 'PUT': {
				break;
			}

			/**
			 * DELETE requests.
			 */

			case 'DELETE': {
				break;
			}

			default:
				// Only accept the requests above
				return res.status(500).json({
					message: 'Not allowed'
				});
		}
	});
};

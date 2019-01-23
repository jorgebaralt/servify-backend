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
				break;
			}

			/**
			 * POST requests.
			 */

			case 'POST': {
				const FieldValue = admin.firestore.FieldValue;
				const { user } = req.body;
				// check if user already exist
				return db
					.collection('users')
					.doc(user.uid)
					.get()
					.then((doc) => {
						if (!doc.exist) {
							const creationDate = FieldValue.serverTimestamp();
							db.collection('users')
								.doc(user.uid)
								.set({
									uid: user.uid,
									email: user.email,
									fullName: user.displayName,
									creationDate,
									provider: user.provider,
									emailVerified: user.emailVerified,
									imageInfo: user.imageInfo
										? user.imageInfo
										: null,
									photoURL: user.photoURL
										? user.photoURL
										: null
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

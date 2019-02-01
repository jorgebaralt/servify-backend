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
				return db
					.collection('users')
					.doc(uid)
					.get()
					.then((doc) => {
						if (doc.exists) {
							const user = doc.data();
							user.email = null; // Avoid sending user email in response.
							res.status(200).send(user);
						} else {
							// doc.data() will be undefined in this case, send with error status 422.
							res.status(422).send('Document not found.');
						}
					})
					.catch((e) => {
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
					photoURL
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
				const { updatedUser, uid, bDeletePhotoURL } = req.body;
				return db
					.collection('users')
					.doc(uid)
					.update(updatedUser)
					.then(() => {
						if (updatedUser.imageInfo != null) {
							updatedUser.photoURL = updatedUser.imageInfo.url;
						} else if (bDeletePhotoURL) {
							updatedUser.photoURL = null;
						}
						delete updatedUser.imageInfo;
						admin
							.auth()
							.updateUser(uid, updatedUser)
							.then(() => db
									.collection('users')
									.doc(uid)
									.get()
									.then((doc) => {
										if (doc.exists) {
											res.status(200).send(doc.data());
										} else {
											// doc.data() will be undefined in this case
											res.status(200).send(
												'No such document!'
											);
										}
									})
									.catch((e) => {
										res.status(422).send({ e });
									}))
							.catch((e) => res.status(422).send(e));
					})
					.catch((e) => {
						console.log(e);
						res.status(422).send({ e });
					});
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

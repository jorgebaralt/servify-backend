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
				const { uid } = req.query;
                
				return db
					.collection('services')
					.where('favUsers', 'array-contains', uid)
					.get()
					.then((snapshot) => {
						const query = [];
						snapshot.forEach((doc) => {
							query.push(doc.data());
						});
						return res.send(query);
					})
					.catch((error) => {
						res.status(422).send({ error });
					});
			}

			/**
			 * POST requests.
			 */

			case 'POST': {
				const { uid, serviceId } = req.body;

				return db
					.collection('services')
					.doc(serviceId)
					.update({
						favUsers: admin.firestore.FieldValue.arrayUnion(uid)
					})
					.then((result) => {
						res.send(result);
					})
					.catch((error) => {
						res.status(422).send({ error });
					});
			}

			/**
			 * DELETE requests.
			 */

            case 'DELETE': {
                const { uid, serviceId } = req.body;
				return db
					.collection('services')
					.doc(serviceId)
					.update({
						favUsers: admin.firestore.FieldValue.arrayRemove(uid)
					})
					.then((result) => {
						res.send(result);
					})
					.catch((error) => {
						res.status(422).send({ error });
					});
			}

			default:
				// Only accept the requests above
				return res.status(500).json({
					message: 'Not allowed'
				});
		}
	});
};

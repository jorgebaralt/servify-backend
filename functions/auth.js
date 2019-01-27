const admin = require('firebase-admin');

module.exports = function (req, res) {
	switch (req.method) {
		/**
		 * POST requests.
		 */
		case 'POST': {
			return admin
				.auth()
				.createUser({
					email: req.body.email,
					password: req.body.password,
					displayName: req.body.username,
					photoURL: req.body.photoURL
				})
				.then((user) => res.send(user))
				.catch((error) => {
					console.log(error);
					res.status(422).send({ error });
				});
		}
		default:
			return res.status(500).json({
				message: 'Not allowed'
			});
	}
};

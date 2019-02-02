const admin = require('firebase-admin');

module.exports = function (req, res) {
	switch (req.method) {
		/**
		 * POST requests.
		 */
		case 'POST': {
			const newUser = req.body;
			if (newUser.photoURL == null) {
				delete newUser.photoURL;
			}
			return admin
				.auth()
				.createUser(newUser)
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

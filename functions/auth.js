const admin = require('firebase-admin');

module.exports = function (req, res) {
	const displayName = req.body.firstName + ' ' + req.body.lastName;

	admin
		.auth()
		.createUser({
			email: req.body.email,
			password: req.body.password,
			displayName,
		})
		.then((user) => res.send(user))
        .catch((error) => {
            console.log(error);
			res.status(422).send({ error });
		});
};

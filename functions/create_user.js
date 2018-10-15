const admin = require('firebase-admin');

module.exports = function (req, res){
    const displayName = req.body.firstName + ' ' + req.body.lastName;

    admin.auth().createUser({
        uid: req.body.email,
        email: req.body.email,
        password: req.body.password,
        displayName,
      }).then((user)=>{
        return res.send(user);
    }).catch((error) => {
        res.status(422).send({ error });
    });
};

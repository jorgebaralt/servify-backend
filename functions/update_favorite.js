const admin = require('firebase-admin');

module.exports = function (req, res){
    const db = admin.firestore();
    const email = req.body.email;
    const favArray = req.body.favorites;

    db.collection('users').doc(email).update({
        favorites: favArray
    }).then((result) => {
        res.send(result);
    })
        .catch((error) => {
            res.status(422).send({ error });
        });
};

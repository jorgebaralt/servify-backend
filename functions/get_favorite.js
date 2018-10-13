const admin = require('firebase-admin');

module.exports = function (req, res){
    const db = admin.firestore();
    const email = req.body.email;

    db.collection('services')
        .where('favUsers', 'array-contains', email)
        .get()
        .then(snapshot => {
            let query = [];
            snapshot.forEach(doc => {
                query.push(doc.data());
            });
            return res.send(query);
        })
        .catch(error => {
            res.status(422).send({ error });
        });
};

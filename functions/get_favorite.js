const admin = require('firebase-admin');

// required params: {uid}
module.exports = function (req, res){
    const db = admin.firestore();
    const uid = req.query.uid;

    db.collection('services')
        .where('favUsers', 'array-contains', uid)
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

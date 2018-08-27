const admin = require('firebase-admin');

module.exports = function(req,res){
    const db = admin.firestore();
    const email = req.body.email;

    db.collection('users').doc(email).get()
        .then(doc => {
            if(doc.exists){
                return res.send(doc.data().favorites);
            }
        }).catch(error => {
            return res.status(422).send({error: error});
        });
};

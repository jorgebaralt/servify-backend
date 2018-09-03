const admin = require('firebase-admin');

module.exports = function(req,res){
    const db = admin.firestore();
    const favorites = [];
    db.collection('users').doc(req.body.email).set({
        email: req.body.email,
        fullName: req.body.displayName,
        favorites: favorites
    }).then(result => {
        return res.send(result);
    }).catch((error)=>{
        res.status(422).send({error:error});
    })
};

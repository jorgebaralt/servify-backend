const admin = require('firebase-admin');

module.exports = function(req,res){
    const db = admin.firestore();
    const FieldValue = admin.firestore.FieldValue;
    const newPost = req.body;
    newPost.timestamp = FieldValue.serverTimestamp();
    db.collection('services').add(newPost).then(result =>{
        return res.send(result);
    }).catch(error => {
        res.status(422).send({ error: error });
    });
};

const admin = require('firebase-admin');

module.exports = function(req,res){
    const db = admin.firestore();

    //get all services for specific category
    if(req.query.category){
        db.collection('services').where('category', '==',req.query.category).get()
            .then(snapshot => {
                return res.send(snapshot);
            }).catch(error =>{
                return res.status(422).send(error)
            })
    }
    
};
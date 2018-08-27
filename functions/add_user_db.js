const admin = require('firebase-admin');

module.exports = function(req,res){
    const db = admin.firestore();
    let displayName;
    if(req.body.displayName.length > 0){
        displayName = req.body.displayName;
    } else {
        displayName = req.body.firstName + " " + req.body.lastName;
    }
    
    db.collection('users').doc(req.body.email).set({
        email: req.body.email,
        fullName: displayName
    }).then(result => {
        return res.send(result);
    }).catch((error)=>{
        res.status(422).send({error:error});
    })
};

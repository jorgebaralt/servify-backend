const admin = require('firebase-admin');

module.exports = function(req,res){
    const db = admin.firestore();
    const serviceTitle = req.body.serviceTitle;

    db.collection('services').doc(serviceTitle).set({
        category: req.body.category,
        subcategory: req.body.category,
        serviceTitle: serviceTitle,
        phone: req.body.phone,
        location: req.body.location,
        description: req.body.description
    }).then(result =>{
        return res.send(result);
    }).catch(error => {
        res.status(422).send({ error: error });
    });
};

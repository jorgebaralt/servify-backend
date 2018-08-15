const admin = require('firebase-admin');

module.exports = function(req,res){
    const db = admin.firestore();
    const params = req.url.split('/');
    const category = params[1];
    const subcategory = params[2];
    
    db.collection('services').get()
        .then(snapshot => {
            res.send(snapshot);
        }).catch(err => {
            res.send(err);
        });

    // get all services for specific category
    if(subcategory){
        db.collection('services').where('subcategory','==',subcategory).get()
            .then(result => {
                return res.send(result);
            }).catch(err => {
                return res.send(err);
            });
    } else if(category){
        db.collection('services').where('category','==',category).get()
            .then(result => {
                return res.send(result);
            }).catch(err => {
                return res.send(err);
            });
    }
};
const admin = require('firebase-admin');

module.exports = function(req,res){
    const db = admin.firestore();
    // return res.send(req.params);
    // const params = req.url.split('/');
    // const category = params[1];
    // const subcategory = params[2];

    var query = db.collection('services').get().then(console.log('worked'))

    // //get all services for specific category
    // if(subcategory){

    //     db.collection('services').get()
    //         .then(snapshot => {
    //             res.send(snapshot);
    //         })
    //         .catch(error =>{
    //         });
    // } else if(category){
    //     // console.log('just category');
    // }
};
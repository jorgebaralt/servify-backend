const admin = require('firebase-admin');

module.exports = function(req,res){
    const db = admin.firestore();
    const params = req.url.split('/');
    const category = params[1];
    const subcategory = params[2];
    let field,value = '';

    // decide category or subcategory
    if(subcategory){
        field = 'subcategory'
        value = subcategory
    } else if (category){
        field = 'category'
        value = category
    } else {
        return res.status(422).send({ error: 'nothing to query' });
    }

    /*
        get services for specific category/subcategory
        take snapshot data, and put it into array
        then return it
    */
    db.collection('services').where(field,'==',value).get()
        .then(snapshot => {
            var query = [];
            snapshot.forEach( doc => {
                query.push(doc.data());
            })
            return res.send(query);
        }).catch(error => {
            res.status(422).send({ error: error });
        });
};
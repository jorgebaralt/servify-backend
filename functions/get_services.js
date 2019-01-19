const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

module.exports = function (req, res) {
    return cors(req, res, () => {
        const db = admin.firestore();
        const category = req.query.category;
        const subcategory = req.query.subcategory;
        const email = req.query.email;
        const zipCode = req.query.zipCode;
        const id = req.query.id;
    
        let field = '';
        let value = '';

        if (subcategory) {
            field = 'subcategory';
            value = subcategory;
        } else if (category) {
            field = 'category';
            value = category;
        } else if (email) {
            field = 'email';
            value = email;
        } else if (zipCode) {
            field = 'zipCode';
            value = zipCode;
        } else if (id) {
            field = 'id';
            value = id;
        } else {
            return res.status(422).send({ error: 'nothing to query' });
        }

        /*
            get services for specific category/subcategory/email
            take snapshot data, and put it into array
            then return it
        */
        db.collection('services').where(field, '==', value).get()
            .then(snapshot => {
                const query = [];
                snapshot.forEach(doc => {
                    query.push(doc.data());
                });
                return res.send(query);
            })
            .catch(error => {
                res.status(422).send({ error });
            });
    });
};

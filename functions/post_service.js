const admin = require('firebase-admin');

module.exports = function (req, res) {
    const db = admin.firestore();
    const FieldValue = admin.firestore.FieldValue;
    const Geopoint = admin.firestore.GeoPoint;
    const newPost = req.body;
    const email = newPost.email;
    const category = newPost.category;
    let subcategory = '';
    if (newPost.subcategory) {
        subcategory = newPost.subcategory;
    }
    const documentName = email + '_' + category + '_' + subcategory;
    newPost.timestamp = FieldValue.serverTimestamp();
    newPost.location = new Geopoint(newPost.geolocation.latitude, newPost.geolocation.longitude);
    newPost.ratingCount = 0;
    newPost.ratingSum = 0;
    newPost.rating = 0;
    newPost.favUsers = [];
    
    db.collection('services').doc(documentName).set(newPost)
        .then(() => {
            db.collection('categories').doc(newPost.category).get()
                .then((doc) => {
                    let serviceCount = '';
                    if (!doc.data().serviceCount) {
                        serviceCount = 1;
                    } else {
                        serviceCount = doc.data().serviceCount + 1;
                    }
                    db.collection('categories').doc(newPost.category)
                        .update({
                            serviceCount
                        }).then((result) => {
                            return res.send(result);
                        })
                        .catch((e) => {
                            res.status(422).send(e);
                        });
                })
                .catch(e => {
                    res.status(422).send({ e });
                });
        })
        .catch(error => {
        res.status(422).send({ error });
     });
};

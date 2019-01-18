const admin = require('firebase-admin');

module.exports = function (req, res) {
    const db = admin.firestore();
    const FieldValue = admin.firestore.FieldValue;
    const Geopoint = admin.firestore.GeoPoint;
    const newPost = req.body;
    const email = newPost.email;
    const category = newPost.category;
    let subcategory = '';

    // check if there is subcategory
    if (newPost.subcategory) {
        subcategory = newPost.subcategory;
    }
    const documentName = email + '_' + category + '_' + subcategory;
    // Generates unique ID number in the following format: e.g. "2019-01-18T00:05:21.602Z_8197"
    newPost._id = [(new Date()).toISOString(), Number(Math.random().toFixed(4) * 9999).toFixed(0).padStart(4, '0')].join('_');
    // location geopoint, so we can compare locations with others.
    newPost.location = new Geopoint(newPost.geolocation.latitude, newPost.geolocation.longitude);
    newPost.ratingCount = 0;
    newPost.ratingSum = 0;
    newPost.rating = 0;
    newPost.price = 0;
    newPost.priceCount = 0;
    newPost.priceSum = 0;
    newPost.timestamp = FieldValue.serverTimestamp();
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

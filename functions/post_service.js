const admin = require('firebase-admin');

// required params: service object
module.exports = function (req, res) {
    const db = admin.firestore();
    const FieldValue = admin.firestore.FieldValue;
    const Geopoint = admin.firestore.GeoPoint;
    const newPost = req.body;
    // const documentName = email + '_' + category + '_' + subcategory;
    newPost.timestamp = FieldValue.serverTimestamp();
    newPost.lastUpdated = FieldValue.serverTimestamp();
    // location geopoint, so we can compare locations with others.
    newPost.location = new Geopoint(newPost.geolocation.latitude, newPost.geolocation.longitude);
    newPost.ratingCount = 0;
    newPost.ratingSum = 0;
    newPost.rating = 0;
    newPost.price = 0;
    newPost.priceCount = 0;
    newPost.priceSum = 0;
    newPost.favUsers = [];

    const ref = db.collection('services').doc();
    newPost.id = ref.id;
    ref.set(newPost)
        .then(() => {
            db.collection('categories').doc(newPost.category).get()
                .then((doc) => {
                    let serviceCount = '';
                    if (!doc.data().serviceCount || doc.data().serviceCount < 1) {
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

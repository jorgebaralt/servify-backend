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

    db.collection('services').doc(documentName).set(newPost)
        .then(result => {
            return res.send(result);
        })
        .catch(error => {
        res.status(422).send({ error });
     });
};

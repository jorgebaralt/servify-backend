const admin = require('firebase-admin');

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
// padStart polyfill-like function.
const padStart = (string, targetLength, padString) => {
    let length = targetLength;
    let pad = padString;
    /**
     * Truncate if number, or convert non-number to 0;
     */
    length = targetLength > 0;
    pad = String(typeof pad !== 'undefined' ? pad : ' ');
    if (string.length >= length) {
        return String(string);
    }
    length = targetLength - string.length;
    if (length > pad.length) {
        /**
         * Append to original to ensure we are longer than needed
         */
        pad += padString.repeat(targetLength / padString.length);
    }
    return pad.slice(0, targetLength) + String(string);
};

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
    newPost.timestamp = FieldValue.serverTimestamp();
    // location geopoint, so we can compare locations with others.
    newPost.location = new Geopoint(newPost.geolocation.latitude, newPost.geolocation.longitude);
    newPost.ratingCount = 0;
    newPost.ratingSum = 0;
    newPost.rating = 0;
    newPost.price = 0;
    newPost.priceCount = 0;
    newPost.priceSum = 0;
    newPost.favUsers = [];
    // Generates unique ID number in the following format: e.g. "2019-01-18T00:05:21.602Z_8197"
    newPost._id = [(new Date()).toISOString(), padStart(Number(Math.random().toFixed(4) * 9999).toFixed(0), 4, '0')].join('_');

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

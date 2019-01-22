const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

module.exports = function (req, res) {
	return cors(req, res, () => {
        const db = admin.firestore();
        switch (req.method) {
            /**
             * GET requests.
             */
            case 'GET': {
                const { serviceId } = req.query;
                const serviceRef = db.collection('services').doc(serviceId);
                // Update the document with the new data by merging.
                return serviceRef.get().then((doc) => {
                        // Protection against null data just in case. If it exists, 
                        // the function returns the updated document.
                        if (doc.exists) {
                            console.log("Document data:", doc.data());
                            res.status(200).send(doc.data());
                        } else {
                            // doc.data() will be undefined in this case
                            res.status(200).send('No such document!');
                        }
                    }).catch((error) => {
                        res.status(422).send({ error });
                    });
            }
            
            /**
             * POST requests.
             */   
            case 'POST': {
                // Body data
                const newPost = req.body;
                // Creation and lastUpdated timestamps
                const FieldValue = admin.firestore.FieldValue;
                newPost.timestamp = FieldValue.serverTimestamp();
                newPost.lastUpdated = FieldValue.serverTimestamp();

                // location geopoint, so we can compare locations with others.
                const Geopoint = admin.firestore.GeoPoint;
                newPost.location = new Geopoint(newPost.geolocation.latitude, newPost.geolocation.longitude);

                // Services data value key pairs
                newPost.ratingCount = 0;
                newPost.ratingSum = 0;
                newPost.rating = 0;
                newPost.price = 0;
                newPost.priceCount = 0;
                newPost.priceSum = 0;
                newPost.favUsers = [];

                // Firestore generates new id if executing doc() with no arguments.
                const serviceRef = db.collection('services').doc();
                newPost.id = serviceRef.id;
                // Setting the new service
                return serviceRef.set(newPost)
                    .then(() => {
                        db.collection('categories').doc(newPost.category).get()
                            .then((doc) => {
                                let serviceCount = '';
                                // Increasing the service count of the posted service's category.
                                if (!doc.data().serviceCount || doc.data().serviceCount < 1) {
                                    serviceCount = 1;
                                } else {
                                    serviceCount = doc.data().serviceCount + 1;
                                }
                                // Updating firestore
                                db.collection('categories').doc(newPost.category)
                                    .update({
                                        serviceCount
                                    }).then(() => {
                                        return res.status(200).send({ message: 'Service created successfully.' });
                                    })
                                    .catch((error) => {
                                        res.status(422).send(error);
                                    });
                            })
                            .catch(error => {
                                res.status(422).send({ error });
                            });
                    })
                    .catch(error => {
                    res.status(422).send({ error });
                });
            }

            /**
             * PUT requests.
             */  
            case 'PUT': {
                const { updatedService, serviceId } = req.body;
                // Last updated timestamp
                const FieldValue = admin.firestore.FieldValue;
                updatedService.lastUpdated = FieldValue.serverTimestamp();
                // Pointer protection
                if (updatedService.geolocation) {
                    // Geopoint constructor returns coordinates to calculate points between services,
                    // and current location of user to fetch close services and such
                    const Geopoint = admin.firestore.GeoPoint;
                    updatedService.location = new Geopoint(
                        updatedService.geolocation.latitude,
                        updatedService.geolocation.longitude
                    );
                }
                const serviceRef = db.collection('services').doc(serviceId);
                // Update the document with the new data by merging.
                return serviceRef.set(updatedService, { merge: true })
                    .then(() => {
                        // Fetch the updated document.
                        serviceRef.get().then((doc) => {
                            // Protection against null data just in case. If it exists, 
                            // the function returns the updated document.
                            if (doc.exists) {
                                console.log("Document data:", doc.data());
                                res.status(200).send(doc.data());
                            } else {
                                // doc.data() will be undefined in this case
                                res.status(200).send('No such document!');
                            }
                        }).catch((error) => {
                            res.status(422).send({ error });
                        });
                    })
                    .catch((error) => {
                        res.status(422).send({ error });
                    });
            }

            /**
             * DELETE requests.
             */ 
            case 'DELETE': {
                const { deletedService } = req.body;
                const serviceId = deletedService.id;
                const serviceRef = db.collection('services').doc(serviceId);
                return serviceRef.delete()
                    .then(() => {
                        db.collection('categories')
                            .doc(deletedService.category)
                            .get()
                            .then((doc) => {
                                const serviceCount = doc.data().serviceCount - 1;
                                db.collection('categories')
                                    .doc(deletedService.category)
                                    .update({
                                        serviceCount
                                    })
                                    .then((result) => res.send(result))
                                    .catch((e) => res.status(422).send(e));
                            })
                            .catch((e) => {
                                res.status(422).send(e);
                            });
                    })
                    .catch((error) => {
                        res.status(422).send({ error });
                    });
            }

            default: 
                // Only accept the requests above 
                return res.status(500).json({
                    message: 'Not allowed'
                });
        }
	});
};

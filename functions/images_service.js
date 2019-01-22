const admin = require('firebase-admin');
const os = require('os');
const path = require('path');
const cors = require('cors')({ origin: true });
// Body parser to handle incoming form data
const Busboy = require('busboy');
// File system package (default node package)
const fs = require('fs');

module.exports = (req, res) => {
	return cors(req, res, () => {
        const firestore = admin.firestore();
        switch (req.method) {
            /**
             * POST requests.
             */
			case 'POST': {
				const bucket = admin.storage().bucket();
				const folder = '/service_images/';
				if (req.method !== 'POST') {
					// Only accept POST requests
					return res.status(500).json({
						message: 'Not allowed'
					});
				}
				const busboy = new Busboy({ headers: req.headers });
				let uploadData = null;
				let fileName = '';
				const date = JSON.stringify(new Date()).replace('"', '').replace('"', '');
				// Handling form data
				busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
					fileName = filename;
					const filepath = path.join(os.tmpdir(), [date, filename].join('')); // Temporary directory (tmpdir), cleaned up after successfully uploaded
					uploadData = { file: filepath, type: mimetype };
					file.pipe(fs.createWriteStream(filepath)); // Stream the file content into a new file
				});
				busboy.on('finish', () => {
					bucket
						.upload(uploadData.file, {
							// upload init
							uploadType: 'media',
							metadata: {
								metadata: {
									contentType: uploadData.type
								}
							},
							destination: [folder, date, '_', fileName].join('')
						})
						.then((data) => {
							const file = bucket.file(data[0].name);
							file.getSignedUrl({
								action: 'read',
								expires: '03-09-5000'
							})
								.then((signedUrls) => {
									res.status(200).json({
										url: signedUrls[0],
										fileName: data[0].name
									});
								})
								.catch((err) => {
									res.status(500).json({
										error: err
									});
								});
						})
						.catch((err) => {
							res.status(500).json({
								error: err
							});
						});
				});
				// To trigger events
				busboy.end(req.rawBody);
				break;
			}
            /**
             * DELETE requests.
             */ 
            case 'DELETE': {
				if (!req.body) {
					return res.status(500).json({
						message: 'File name or service id can\'t be null.'
					});
				}
				const { Storage } = require('@google-cloud/storage');
				const storage = new Storage();
				const bucketName = 'servify-716c6.appspot.com';
				const { serviceId, fileName } = req.body;
				const serviceRef = firestore.collection('services').doc(serviceId);
                // Update the document with the new data by merging.
                return serviceRef.get().then((doc) => {
                        // Protection against null data just in case. If it exists, 
                        // the function returns the updated document.
                        if (doc.exists) {
							console.log("Document data:", doc.data());
							const serviceData = doc.data();
							const imagesArray = doc.data().imagesInfo;
							storage
								.bucket(bucketName)
								.file(fileName)
								.delete()
								.then(() => {
									const filteredArray = imagesArray.filter(image => {
										return image.fileName !== fileName;
									});
									serviceRef.set({
										imagesInfo: filteredArray
									}, { merge: true })
										.then(() => {
											// Updating the imagesInfo data before sending it.
											serviceData.imagesInfo = filteredArray;
											res.status(200).json(serviceData);
										})
										.catch(error => {
											console.log(error);
											res.status(500).send({ 
												error: JSON.stringify(error),
												message: 'Something went wrong.'
											});
										});
								})
								.catch((error) => {
									console.log(error);
									res.status(500).json({
										error: JSON.stringify(error),
										message: 'Something went wrong.'
									});
								});
                        } else {
                            // doc.data() will be undefined in this case
                            res.status(200).send('No such document!');
                        }
                    }).catch((error) => {
                        res.status(422).send({ error });
                    });
			}
			default:
				return res.status(500).json({
					message: 'Not allowed.'
				});
		}
	});
};

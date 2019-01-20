// To access database
const admin = require('firebase-admin');
// To access storage
const { Storage } = require('@google-cloud/storage');
const cors = require('cors')({ origin: true });

const storage = new Storage();

module.exports = (req, res) => {
	cors(req, res, () => {
		if (req.method !== 'DELETE' || !req.query.fileName) {
			// Only accept DELETE requests
			return res.status(500).json({
				message: 'Not allowed'
			});
		}
		const bucketName = 'servify-716c6.appspot.com';
		const fileName = req.query.fileName;
		if (!req.query.fileName) {
			return res.status(500).json({
				message: 'No file name found in query.'
			});
		}
		return storage
			.bucket(bucketName)
			.file(fileName)
			.delete()
			.then(() => {
				console.log(req.query.serviceId && req.query.imagesInfo);
				if (req.query.serviceId && req.query.imagesInfo) {
					const firebase = admin.firestore();
					const serviceId = req.query.serviceId;
					const imagesArray = req.query.imagesInfo;
					const filteredArray = imagesArray.filter(image => {
						return image.fileName !== fileName;
					});
					const serviceRef = firebase.collection('services').doc(serviceId);
					serviceRef.set({
						imagesInfo: filteredArray
					}, { merge: true })
						.then(() => {
							res.status(200).json({
								message: 'File deleted successfully.'
							});
						})
						.catch(error => {
							console.log(error);
							res.status(500).send({ 
								error: JSON.stringify(error),
								message: 'Something went wrong.'
							});
						});
				} else {
					res.status(200).json({
						message: 'File deleted successfully.'
					});
				}
				
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({
					error: JSON.stringify(error),
					message: 'Something went wrong.'
				});
			});
	});
};

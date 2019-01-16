const { Storage } = require('@google-cloud/storage');
const cors = require('cors')({ origin: true });

const storage = new Storage();

module.exports = (req, res) => {
	cors(req, res, () => {
		console.log(req.query);
		if (req.method !== 'DELETE' || !req.query.fileName) {
			// Only accept DELETE requests
			return res.status(500).json({
				message: 'Not allowed'
			});
		}
		let fileName;
		let folder = '/service_images';
		if (req.query.fileName != null) {
			fileName = req.query.fileName;
		}
		if (req.query.folder) {
			folder = req.query.folder;
		}
		const bucketName = 'servify-716c6.appspot.com/service_images';
        console.log(fileName);
		const path = [bucketName, folder].join('');
		console.log(path);
		return storage
			.bucket(bucketName)
			.file(fileName)
			.delete()
            .then((result) => {
                console.log(result);
                res.status(200).json({
                    message: 'file deleted successfully'
                });
            })
			.catch((error) => res.status(500).json({
					error,
					message: 'Something went wrong.'
				}));
	});
};

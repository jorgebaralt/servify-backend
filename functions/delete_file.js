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
		return (
			storage
			.bucket(bucketName)
			.file(fileName)
			.delete()
            .then(() => {
                return res.status(200).json({
                    message: 'File deleted successfully.'
                });
            })
			.catch((error) => {
				return res.status(500).json({
					error: error.message,
					message: 'Something went wrong.'
				});
			})
		);
	});
};

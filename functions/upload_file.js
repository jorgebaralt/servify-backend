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
	});
};

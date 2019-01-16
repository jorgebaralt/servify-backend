const firebase = require('firebase');
const cors = require('cors')({ origin: true });
// Body parser to handle incoming form data

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = firebase.storage();

// Create a storage reference from our storage service
const storageRef = storage.ref();

module.exports = (req, res) => {
	cors(req, res, () => {
		if (req.method !== 'DELETE' || !req.body.fileName) {
			// Only accept DELETE requests
			return res.status(500).json({
				message: 'Not allowed'
			});
		}
        let fileName;
        let folder = '/service_images/';
		if (req.body.fileName != null) {
			fileName = req.body.fileName;
		}
        if (req.body.folder) {
            folder = req.body.folder;
        }
        const path = [folder, fileName].join('');
		const deleteRef = storageRef.child(path);
        // Delete the file
        return deleteRef.delete().then(() => {
            // File deleted successfully
            return res.status(200).json({
                message: 'File deleted successfully.',
            });
        }).catch((error) => {
            // Uh-oh, an error occurred!
            return res.status(500).json({
                error,
                message: 'Something went wrong.',
            });
        });
	});
};
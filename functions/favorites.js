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
            }
            
            /**
             * POST requests.
             */   
            case 'POST': {

            }

            /**
             * PUT requests.
             */  
            case 'PUT': {

            }

            /**
             * DELETE requests.
             */ 
            case 'DELETE': {

            }

            default: 
                // Only accept the requests above 
                return res.status(500).json({
                    message: 'Not allowed'
                });
        }
	});
};

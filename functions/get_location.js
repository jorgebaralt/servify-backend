const ipInfo = require("ipinfo");
const cors = require('cors')({ origin: true });

module.exports = function (req, res) {
	return cors(req, res, () => {
		const id = req.query.id;
		ipInfo(id,(err, cLoc) => {
			res.send(err || cLoc);
		});
	});
};

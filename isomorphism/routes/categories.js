var shirts = require('../shared-modules/shirts.js');

exports.list = function (req, res) {
	res.send(shirts.getCategories());
};

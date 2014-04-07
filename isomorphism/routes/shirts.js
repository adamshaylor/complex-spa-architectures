var shirts = require('../shared-modules/shirts.js');

exports.list = function (req, res) {

	var categoryId = req.route.params.categoryId;

	res.send(shirts.getShirtsByCategory(categoryId));

};

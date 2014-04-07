var shirts = require('../shared-modules/shirts.js');

exports.list = function (req, res) {

	var shirtId = req.route.params.shirtId;

	res.send(shirts.getColorsByShirt(shirtId));

};

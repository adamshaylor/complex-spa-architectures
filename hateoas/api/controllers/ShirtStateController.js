/**
 * ShirtStateController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var _ = require('lodash'),
	data = {},
	stateToControls,
	controlsToState,
	categoryIdToShirtOptions,
	shirtIdToColorOptions;


data.categories = require('../../../example-data/shirt-categories.json');
data.shirts = require('../../../example-data/shirts.json');
data.colors = require('../../../example-data/shirt-colors.json');


categoryIdToShirtOptions = function (categoryId) {
	
	return _.chain(data.shirts)

		.select(function (shirt) {
			return shirt.categoryId === categoryId;
		})

		.map(function (shirt) {
			return {
				name: shirt.name,
				value: shirt.id
			};
		})

		.value();

};


shirtIdToColorOptions = function (shirtId) {

	return _.chain(data.colors)

		.select(function (color) {
			return color.shirtId === shirtId;
		})

		.map(function (color) {
			return {
				name: color.name,
				value: color.id
			};
		})

		.value();

};


stateToControls = function (state) {

	var controls = {},
		newShirtOptions,
		oldShirtInNewShirtOptions,
		newColorOptions,
		oldColorInNewColorOptions;

	controls.id = state.id;

	controls.category = {
		type: 'radio',
		value: state.categoryId,
		prompt: 'Select Category',
		options: _.map(data.categories, function (category) {
			return {
				name: category.name,
				value: category.id
			};
		})
	};
	
	newShirtOptions = categoryIdToShirtOptions(state.categoryId) || [];

	oldShirtInNewShirtOptions = _.any(newShirtOptions, function (shirtOption) {
		return shirtOption.value === state.shirtId;
	});

	controls.shirt = {
		type: 'dropdown',
		value: oldShirtInNewShirtOptions ? state.shirtId : null,
		prompt: 'Select Shirt',
		options: newShirtOptions,
	};

	newColorOptions = shirtIdToColorOptions(controls.shirt.value) || [];

	oldColorInNewColorOptions = _.any(newColorOptions, function (colorOption) {
		return colorOption.value === state.colorId;
	});

	controls.color = {
		type: 'dropdown',
		value: oldColorInNewColorOptions ? state.colorId : null,
		prompt: 'Select Color',
		options: newColorOptions,
	};

	return controls;

};


controlsToState = function (controls) {
	return {
		categoryId: controls.category.value,
		shirtId: controls.shirt.value,
		colorId: controls.color.value
	};
};


module.exports = {


	list: function (req, res) {

		ShirtState.find().exec(function (err, shirtStates) {

			if (err) {
				return res.send(err, 500);
			}

			res.json(_.map(shirtStates, stateToControls));

		});

	},


	create: function (req, res) {

		ShirtState.create({
			categoryId: null,
			shirtId: null,
			colorId: null
		}).exec(function (err, shirtState) {

			if (err) {
				return res.send(err, 500);
			}

			res.json(stateToControls(shirtState));

		});

	},
	
	
	retrieve: function (req, res) {

		ShirtState.findOne(req.param('id')).exec(function (err, shirtState) {

			if (err) {
				return res.send(err, 500);
			}

			if (!shirtState) {
				return res.send('We couldn\'t find that shirt design.', 404);
			}

			res.json(stateToControls(shirtState));

		});

	},


	update: function (req, res) {

		ShirtState.findOne(req.param('id')).exec(function (err, shirtState) {

			if (err) {
				return res.send(err, 500);
			}

			shirtState.categoryId = req.body.category.value;
			shirtState.shirtId = req.body.shirt.value;
			shirtState.colorId = req.body.color.value;

			shirtState.save(function (err) {
				if (err) {
					return res.send(err, 500);
				}
				res.json(stateToControls(shirtState));
			});

		});

	},


	delete: function (req, res) {

		ShirtState.destroy(req.param('id')).exec(function (err) {

			if (err) {
				return res.send(err, 500);
			}

			res.send('', 200);

		});

	},


	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to ShirtStateController)
	 */
	_config: {
		blueprints: {
			actions: false,
			rest: false
		}
	}

	
};

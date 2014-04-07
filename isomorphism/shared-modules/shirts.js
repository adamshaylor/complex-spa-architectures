var _ = require('lodash'),
	data = {},
	state = {};


data.categories = require('../../example-data/shirt-categories.json');
data.shirts = require('../../example-data/shirts.json');
data.colors = require('../../example-data/shirt-colors.json');


exports.getCategories = function () {
	return data.categories;
};


exports.getShirtsByCategory = function (requestedCategoryId) {
	return _.select(data.shirts, function (shirt) {
		return shirt.categoryId == requestedCategoryId;
	});
};


exports.getColorsByShirt = function (requestedShirtId) {
	return _.select(data.colors, function (color) {
		return color.shirtId == requestedShirtId;
	});
};


exports.getState = function () {
	return _.cloneDeep(state);
};


exports.setCategory = function (selectedCategoryId) {

	state.selectedCategory = _.find(data.categories, function (category) {
		return category.id === selectedCategoryId;
	});

	// In case selectedCategoryId is invalid
	if (state.selectedCategory) {
		state.availableShirts = exports.getShirtsByCategory(state.selectedCategory.id);
	}

	delete state.selectedShirt;
	delete state.selectedColor;
	state.availableColors = [];

	return exports.getState();

};


exports.setShirt = function (selectedShirtId) {

	state.selectedShirt = _.find(data.shirts, function (shirt) {
		return shirt.id === selectedShirtId;
	});

	if (state.selectedShirt) {
		state.availableColors = exports.getColorsByShirt(state.selectedShirt.id);
	}

	delete state.selectedColor;

	return exports.getState();

};


exports.setColor = function (selectedColorId) {

	state.selectedColor = _.find(data.colors, function (color) {
		return color.id === selectedColorId;
	});

	return exports.getState();

};


state.availableCategories = exports.getCategories();
state.availableShirts = [];
state.availableColors = [];

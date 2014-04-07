(function () {
	
	'use strict';

	angular.module('isomorphicApp', []);

	angular.module('isomorphicApp').controller('IsomorphicCtrl', function ($scope) {

		$scope.state = shirts.getState();

		$scope.setCategory = function (newCategory) {
			$scope.state = shirts.setCategory(newCategory.id);
		};

		$scope.setShirt = function (newShirt) {
			$scope.state = shirts.setShirt(newShirt.id);
		};

		$scope.setColor = function (newColor) {
			$scope.state = shirts.setColor(newColor.id);
		};

	});

})();

(function () {


	'use strict';


	angular.module('hateoasApp').controller('CrudCtrl', function ($scope, $rootScope, $http, $q) {


		$scope.list = function () {

			$http.get('/shirt-state').success(function (shirtStates) {
				$scope.shirtStates = shirtStates;
			});

		};


		$scope.create = function () {

			$http.post('/shirt-state').success(function () {
				$scope.list();
			});

		};


		$scope.destroy = function (shirtStateToDestroy) {

			if (typeof shirtStateToDestroy !== 'object') {
				return;
			}

			$http.delete('/shirt-state/' + shirtStateToDestroy.id);

			// We won't wait for the call to return because we're impatient
			_.remove($scope.shirtStates, function (shirtState) {
				return shirtState.id === shirtStateToDestroy.id;
			});

		};


		$scope.list();


		$rootScope.$on('hateoasUserInteraction', function (event, namespace, newControl, oldControl) {

			var selectedShirtStateAtTimeOfPut = $rootScope.selectedShirtState,
				putPromise;

			putPromise = $http.put('/shirt-state/' + $rootScope.selectedShirtState.id, $rootScope.selectedShirtState).success(function (serverShirtState) {
				_.assign(selectedShirtStateAtTimeOfPut, serverShirtState);
			});

			$rootScope.$broadcast('hateoasLoadPromise', putPromise);

		});
		

	});


})();

(function () {
	
	'use strict';

	angular.module('hateoasApp').directive('hateoasUiControl', function () {
		
		return {


			restrict: 'A',


			scope: {
				hateoasUiControl: '='
			},


			templateUrl: '/js/angular/hateoas-ui-control.html',


			link: function (scope, element, attributes) {

				scope.userSetValue = function (newValue) {
					var oldHateoasUiControl = _.cloneDeep(scope.hateoasUiControl);
					scope.hateoasUiControl.value = newValue;
					scope.$emit('hateoasUserInteraction', attributes.hateoasUiControl, scope.hateoasUiControl, oldHateoasUiControl);
				};

				scope.$watch('hateoasUiControl.value', function (newValue) {

					if (!scope.hateoasUiControl) {
						return;
					}

					scope.selectedOption = _.find(scope.hateoasUiControl.options, function (option) {
						return option.value === newValue;
					});

				});

				scope.$on('hateoasLoadPromise', function (event, loadPromise) {

					scope.loading = true;
					loadPromise.then(function () {
						scope.loading = false;
					});

				});

			}
			

		};

	});

})();

'use strict';

/**
 * @ngdoc function
 * @name daytaApp.controller:ResultPaneController
 * @description
 * # ResultPaneController
 * Result pane controller of the daytaApp
 */

(function() {
  var app = angular.module('resultPaneModule', []);

  app.controller('ResultPaneController', function($scope, CalProperties) {
    $scope.selectedCalculator = CalProperties.selectedCalculatorList[$scope.$index];
  });
})();
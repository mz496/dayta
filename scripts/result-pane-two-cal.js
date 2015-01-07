'use strict';

/**
 * @ngdoc function
 * @name daytaApp.controller:ResultPaneTwoCalController
 * @description
 * # ResultPaneTwoCalController
 * Result pane (showing results from two-calendar calculators) controller of the daytaApp
 */

(function() {
  var app = angular.module('resultPaneTwoCalModule', []);

  app.controller('ResultPaneTwoCalController', function($scope, CalProperties) {
    $scope.selectedCalculatorTwoCal = CalProperties.selectedCalculatorTwoCal;
  });
})();
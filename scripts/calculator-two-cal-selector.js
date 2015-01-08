'use strict';

/**
 * @ngdoc function
 * @name daytaApp.controller:CalculatorTwoCalController
 * @description
 * # CalculatorTwoCalController
 * Calculator selection (for two calendars) controller of the daytaApp
 */

(function() {
  var app = angular.module('calculatorTwoCalSelectorModule', []);

  app.controller('CalculatorTwoCalController', function($scope, CalProperties) {
    $scope.active = CalProperties.active;
    $scope.selectedCalculatorTwoCal = CalProperties.selectedCalculatorTwoCal;
    $scope.calculatorsTwoCal = [
      {
        nickname: 'allDays',
        value: 'All days between dates',
      },
      {
        nickname: 'weekendsWeekdays',
        value: 'Weekends/weekdays between dates',
      },
    ];

    $scope.showDropdown = CalProperties.active[0] && CalProperties.active[1];

    // this is changed by the calendars
    $scope.$watchCollection('active', function(newVal, oldVal) {
      console.log(newVal); console.log(oldVal);
      $scope.showDropdown = CalProperties.active[0] && CalProperties.active[1];

      // make sure nothing is selected when not visible
      if (!$scope.showDropdown) {
        $scope.selectedCalculatorTwoCal = null;
      }
    });

    // this is changed by the dropdown
    $scope.$watch('selectedCalculatorTwoCal', function(newVal, oldVal) {
      console.log(newVal); console.log(oldVal);
      CalProperties.selectedCalculatorTwoCal = $scope.selectedCalculatorTwoCal;
    });
  });
})();
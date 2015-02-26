'use strict';

/**
 * @ngdoc function
 * @name daytaApp.controller:CalculatorController
 * @description
 * # CalculatorController
 * Calculator selection controller of the daytaApp
 */

(function() {
  var app = angular.module('calculatorSelectorModule', []);

  app.controller('CalculatorController', function($scope, CalProperties) {
    var i = $scope.$index;

    // these three are in sync with factory
    $scope.active = CalProperties.active;
    $scope.selectedCalculator = CalProperties.selectedCalculatorList[i];
    $scope.calculators = [
      {
        nickname: 'yearPos',
        value: 'Position within selected year'
      },
      {
        nickname: 'addSubtract',
        value: 'Add or subtract time'
      },
      {
        nickname: 'countdown',
        value: 'Countdown to date'
      },
      {
        nickname: 'countup',
        value: 'Countup from date'
      },
    ];
    $scope.showDropdown = CalProperties.active[i];

    // this is changed by the corresponding calendar
    $scope.$watchCollection('active', function(newVal, oldVal) {
      console.log(newVal); console.log(oldVal);
      $scope.showDropdown = CalProperties.active[i];
      
      // make sure nothing is selected when not visible
      if (!$scope.showDropdown) {
        $scope.selectedCalculator = null;
      }
    });

    // this is changed by the dropdown
    $scope.$watch('selectedCalculator', function(newVal, oldVal) {
      console.log(newVal); console.log(oldVal);
      CalProperties.selectedCalculatorList[i] = $scope.selectedCalculator;
    });

  });
})();
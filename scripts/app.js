'use strict';

/**
 * @ngdoc overview
 * @name daytaApp
 * @description
 * # Dayta - calendar, time, and date data.
 *
 * Main module of the application.
 */

(function() {
  var app = angular.module('daytaApp', [
    'dateSelectorModule',
    'calculatorSelectorModule',
    'calculatorTwoCalSelectorModule',
    'resultPaneModule',
    'resultPaneTwoCalModule'
  ]);
  
  app.factory('CalProperties', function() {
    return {
      active: [false, false],
      selectedCalculatorList: [null, null],
      selectedCalculatorTwoCal: null
    };
  });

  app.factory('CalData', function() {
    return {
      0: {
        century: 0, // uninitialized values
        decade: 0,
        year: 0,
        month: 0,
        day: 0
      },
      1: {
        century: 0, // uninitialized values
        decade: 0,
        year: 0,
        month: 0,
        day: 0
      }
    };
  });

  app.controller('CalendarSetController', function($scope, CalProperties, CalData) {
    $scope.active = CalProperties.active;
    $scope.selectedCalculators = CalProperties.selectedCalculatorList;
    $scope.selectedCalculatorTwoCal = CalProperties.selectedCalculatorTwoCal;
    $scope.calData = [CalData[0],CalData[1]];
  });

  app.directive('dateSelectorElement', function() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/date-selector.html',
      controller: 'DateController'
    };
  });

  app.directive('calculatorSelectorElement', function() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/calculator-selector.html',
      controller: 'CalculatorController'
    };
  });

  app.directive('calculatorTwoCalSelectorElement', function() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/calculator-two-cal-selector.html',
      controller: 'CalculatorTwoCalController'
    };
  });

  app.directive('resultPane', function() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/result-pane.html',
      controller: 'ResultPaneController'
    };
  });

  app.directive('resultPaneTwoCal', function() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/result-pane-two-cal.html',
      controller: 'ResultPaneTwoCalController'
    };
  });

})();
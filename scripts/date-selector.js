'use strict';

/**
 * @ngdoc function
 * @name daytaApp.controller:DateController
 * @description
 * # DateController
 * Date selection controller of the daytaApp
 */

(function() {
  var app = angular.module('dateSelectorModule', []);

  app.controller('DateController', function($scope, CalData, CalProperties) {
    $scope.century = 0; // uninitialized values
    $scope.decade = 0;
    $scope.year = 0;
    $scope.month = 0;
    $scope.day = 0;
    var numDays = 0;

    $scope.decadesInView = false; // uninitialized values
    $scope.yearsInView = false;
    $scope.monthsInView = false;
    $scope.daysInView = false;

    $scope.initialized = false;
    $scope.finished = false;

    $scope.monthData = {
      1: {
        nickname: 'Jan',
        name: 'January',
        days: 31,
      },
      2: {
        nickname: 'Feb',
        name: 'February',
        days: 28,
      },
      3: {
        nickname: 'Mar',
        name: 'March',
        days: 31,
      },
      4: {
        nickname: 'Apr',
        name: 'April',
        days: 30,
      },
      5: {
        nickname: 'May',
        name: 'May',
        days: 31,
      },
      6: {
        nickname: 'Jun',
        name: 'June',
        days: 30,
      },
      7: {
        nickname: 'Jul',
        name: 'July',
        days: 31,
      },
      8: {
        nickname: 'Aug',
        name: 'August',
        days: 31,
      },
      9: {
        nickname: 'Sep',
        name: 'September',
        days: 30,
      },
      10: {
        nickname: 'Oct',
        name: 'October',
        days: 31,
      },
      11: {
        nickname: 'Nov',
        name: 'November',
        days: 30,
      },
      12: {
        nickname: 'Dec',
        name: 'December',
        days: 31,
      }
    };

    function generateTable(rows, cols) {
      var arr = [];
      for (var row = 0; row < rows; row++) {
        arr.push([]);
        for (var col = 0; col < cols; col++) {
          arr[row].push('');
        }
      }
      return arr;
    }

    function isLeap(yr) {
      return ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0);
    }

    $scope.decadesTable = generateTable(4,3);
    $scope.yearsTable = generateTable(4,3);
    $scope.monthsTable = generateTable(4,3);
    $scope.daysTable = generateTable(6,7);

    var row, col;

    // called upon assignment of some century
    $scope.selectCentury = function(century) {
      if (century !== '' && 1900 <= century && century <= 9900) {
        $scope.century = century;
        $scope.decadesInView = true;

        // fill decade table for correct century
        var decade = century; // starting value
        $scope.decadesTable[0][1] = decade; // center of first row
        decade += 10;
        for (row = 1; row < $scope.decadesTable.length; row++) {
          for (col = 0; col < $scope.decadesTable[0].length; col++) {
            $scope.decadesTable[row][col] = decade;
            decade += 10;
          }
        }
      }
    };

    // called upon assignment of some decade
    $scope.selectDecade = function(decade) {
      if (decade !== '') {
        $scope.decade = decade;
        $scope.decadesToYears();

        // fill year table for correct decade
        var year = decade; // starting value
        $scope.yearsTable[0][1] = year; // center of first row
        year += 1;
        for (row = 1; row < $scope.yearsTable.length; row++) {
          for (col = 0; col < $scope.yearsTable[0].length; col++) {
            $scope.yearsTable[row][col] = year;
            year += 1;
          }
        }
      }
    };

    // called upon assignment of some year
    $scope.selectYear = function(year) {
      if (year !== '') {
        $scope.year = year;
        $scope.yearsToMonths();

        // fill month table
        var month = 1; // starting value
        for (row = 0; row < $scope.monthsTable.length; row++) {
          for (col = 0; col < $scope.monthsTable[0].length; col++) {
            $scope.monthsTable[row][col] = month;
            month += 1;
          }
        }
      }
    };

    // called upon assignment of some month for *already selected year*
    $scope.selectMonth = function(month, year) {
      if (month !== '') {
        $scope.month = month;
        $scope.monthsToDays();
        numDays = $scope.monthData[month].days;
        if (isLeap(year) && month === 2) {
          numDays++; // 29 days in Feb
        }

        // fill day table for correct month+year
        // from http://en.wikipedia.org/wiki/Determination_of_the_day_of_the_week#Basic_method_for_mental_calculation

        // flush any previous data
        for (row = 0; row < $scope.daysTable.length; row++) {
          for (col = 0; col < $scope.daysTable[0].length; col++) {
            $scope.daysTable[row][col] = '';
          }
        }

        var firstDay = new Date(year, month-1, 1);
        var firstDayIndex = firstDay.getDay();
        // an index from 0=Sunday to 6=Saturday

        var day = 1;
        // place the first day in the correct spot in the first row
        for (col = firstDayIndex; col < $scope.daysTable[0].length; col++) {
          $scope.daysTable[0][col] = day;
          day++;
        }

        for (row = 1; row < $scope.daysTable.length; row++) {
          for (col = 0; col < $scope.daysTable[0].length; col++) {
            if (day <= numDays) {
              $scope.daysTable[row][col] = day;
              day++;
            }
          }
        }
      }
    };

    // called upon assignment of some day
    $scope.selectDay = function(day) {
      if (day !== '') {
        $scope.day = day;
        $scope.daysInView = false;
        
        $scope.updateData();
        $scope.finished = true; // date finished choosing ONLY when day is selected (final step)
        CalProperties.active[$scope.$index] = true;
      }
    };

    // functions for making the proper view
    $scope.yearsToDecades = function() {
      $scope.yearsInView = false;
      $scope.decadesInView = true;
    };
    $scope.monthsToYears = function() {
      $scope.monthsInView = false;
      $scope.yearsInView = true;
    };
    $scope.daysToMonths = function() {
      $scope.daysInView = false;
      $scope.monthsInView = true;
    };

    $scope.decadesToYears = function() {
      $scope.decadesInView = false;
      $scope.yearsInView = true;
    };
    $scope.yearsToMonths = function() {
      $scope.yearsInView = false;
      $scope.monthsInView = true;
    };
    $scope.monthsToDays = function() {
      $scope.monthsInView = false;
      $scope.daysInView = true;
    };

    $scope.reset = function() {
      $scope.century = 0; // uninitialized values
      $scope.decade = 0;
      $scope.year = 0;
      $scope.month = 0;
      $scope.day = 0;
      numDays = 0;

      $scope.decadesInView = false; // uninitialized values
      $scope.yearsInView = false;
      $scope.monthsInView = false;
      $scope.daysInView = false;

      CalProperties.active[$scope.$index] = false;
    };

    $scope.delete = function() {
      $scope.reset();
      $scope.initialized = false; // not initialized ONLY when calendar removed
      $scope.finished = false;
      $scope.updateData(); // send empty data to parent controller
    };

    $scope.add = function() {
      $scope.reset(); // safety measure?
      $scope.initialized = true; // initialized ONLY when calendar added
      $scope.finished = false;
      $scope.defaultInit();
    };

    $scope.defaultInit = function() {
      $scope.selectCentury(2000);
      $scope.selectDecade(2010);
    };

    $scope.updateData = function() {
      CalData[$scope.$index].century = $scope.century;
      CalData[$scope.$index].decade = $scope.decade;
      CalData[$scope.$index].year = $scope.year;
      CalData[$scope.$index].month = $scope.month;
      CalData[$scope.$index].day = $scope.day;
      CalProperties.selectedCalculatorList[$scope.$index] = null;
    };
  });
})();
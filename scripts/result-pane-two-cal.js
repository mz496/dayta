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

  app.controller('ResultPaneTwoCalController', function($scope, CalProperties, CalData) {
    function dateToSecs(date) { return date/1000; }
    function dateToMins(date) { return dateToSecs(date) / 60; }
    function dateToHours(date) { return dateToMins(date) / 60; }
    function dateToDays(date) { return dateToHours(date) / 24; }

    $scope.selectedCalculatorTwoCal = CalProperties.selectedCalculatorTwoCal;
    $scope.daysBetween = null;
    $scope.daysBetweenLongForm = null;
    $scope.weekendsBetween = null;
    $scope.hoursBetween = null;
    $scope.minsBetween = null;
    $scope.secsBetween = null;

    function countDaysBetween(year0, month0, day0, year1, month1, day1) {
      var date0 = new Date(Date.UTC(year0, month0, day0));
      var date1 = new Date(Date.UTC(year1, month1, day1));
      var msDiff = Math.abs(date0.getTime() - date1.getTime());

      return dateToDays(msDiff);
    }

    function countDaysBetweenLongForm(year0, month0, day0, year1, month1, day1) {
      var years = 0;
      var months = 0;
      var days = 0;

      var date0 = new Date(Date.UTC(year0, month0, day0));
      var date1 = new Date(Date.UTC(year1, month1, day1));

      if (date0.getTime() > date1.getTime()) {
        var temp = date0;
        date0 = date1;
        date1 = temp;
        // now date0 < date1
      }
      // else, negation of guard means date0 <= date1

      if (date0.getTime() !== date1.getTime()) {
        // date0 is earlier than date1
        years = date1.getUTCFullYear() - date0.getUTCFullYear();
        months = date1.getUTCMonth() - date0.getUTCMonth();
        if (months < 0) {
          // date1 is earlier in the year than date0; not a full year
          years--;
          months = 12 + months;
        }
        days = date1.getUTCDate() - date0.getUTCDate();
        if (days < 0) {
          // date1 is earlier in the month than date0; not a full month
          months--;
          // count days from a version of date0 that's less than 1 month behind date1
          var date0Temp = new Date(Date.UTC(year1, month1-1, day0));
          var msDiffTemp = date1.getTime() - date0Temp.getTime();
          days = dateToDays(msDiffTemp);
        }
      }

      return [years, months, days];
    }

    function countWeekendsBetween(year0, month0, day0, year1, month1, day1) {
      var weekendCount = 0;
      var date0 = new Date(Date.UTC(year0, month0, day0));
      var date1 = new Date(Date.UTC(year1, month1, day1));

      if (date0.getTime() > date1.getTime()) {
        var temp = date0;
        date0 = date1;
        date1 = temp;
        // now date0 < date1
      }
      // else, negation of guard means date0 <= date1

      if (date0.getTime() !== date1.getTime()) {
        // date0 is earlier than date1
        // prune range to a Sunday-Saturday range

        // count weekends in pruned part at front
        var day0Index = date0.getUTCDay();
        if (day0Index !== 0) {
          // if it's 0, it started on Sun, OK. else, there is one Sat
          weekendCount++;

          // subtract pruned part from range; push date0 7-day0Index days forward
          // OK if overflowed, Date.UTC will correct out-of-range values
          date0.setUTCDate(date0.getUTCDate() + (7-day0Index));
        }

        // count weekends in pruned part at back
        var day1Index = date1.getUTCDay();
        if (day1Index !== 6) {
          // may be one extra Sun
          weekendCount++;

          // push date1 day1Index days backward
          date1.setUTCDate(date1.getUTCDate() - (day1Index));
        }
      }

      var msDiff = Math.abs(date0.getTime() - date1.getTime());
      return weekendCount + (2/7)*dateToDays(msDiff);
    }

    $scope.$watch('selectedCalculatorTwoCal', function(newVal, oldVal) {
      console.log(newVal); console.log(oldVal);

      $scope.daysBetween = countDaysBetween(
        CalData[0].year,
        CalData[0].month-1,
        CalData[0].day,
        CalData[1].year,
        CalData[1].month-1,
        CalData[1].day
      );

      $scope.daysBetweenLongForm = countDaysBetweenLongForm(
        CalData[0].year,
        CalData[0].month-1,
        CalData[0].day,
        CalData[1].year,
        CalData[1].month-1,
        CalData[1].day
      );

      $scope.hoursBetween = $scope.daysBetween * 24;
      $scope.minsBetween = $scope.hoursBetween * 60;
      $scope.secsBetween = $scope.minsBetween * 60;

      $scope.weekendsBetween = countWeekendsBetween(
        CalData[0].year,
        CalData[0].month-1,
        CalData[0].day,
        CalData[1].year,
        CalData[1].month-1,
        CalData[1].day
      );

      /*if ($scope.selectedCalculatorTwoCal === null) {
        // clear everything
      }*/

    });
  });
})();
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

  app.controller('ResultPaneController', function($scope, $interval, CalProperties, CalData) {
    $scope.selectedCalculator = CalProperties.selectedCalculatorList[$scope.$index];
    var i = $scope.$index;
    $scope.dayNumber = null;
    $scope.weekNumber = null;

    $scope.promise = null;
    $scope.diffYear = null;
    $scope.diffMonth = null;
    $scope.diffDay = null;
    $scope.diffHour = null;
    $scope.diffMin = null;
    $scope.diffSec = null;

    function isLeap(yr) {
      return ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0);
    }

    function dateToSecs(date) { return date/1000; }
    function dateToMins(date) { return dateToSecs(date) / 60; }
    function dateToHours(date) { return dateToMins(date) / 60; }
    function dateToDays(date) { return dateToHours(date) / 24; }

    function countDaysBetween(year0, month0, day0, year1, month1, day1) {
      var date0 = new Date(Date.UTC(year0, month0, day0));
      var date1 = new Date(Date.UTC(year1, month1, day1));
      var msDiff = Math.abs(date0.getTime() - date1.getTime());

      return dateToDays(msDiff);
    }

    function getDayNumber(year, month, day) {
      return countDaysBetween(year, 0, 1, year, month, day) + 1;
      // include endpoint, e.g. Jan 1 is day 1, not day 0
    }

    function getWeekNumber(year, month, day) {
      // find the first Sat of the year, that's the end of week 1
      // won't have to check more than 7
      var firstSat = 1;
      for (var j = 1; j <= 7; j++) {
        var temp = new Date(Date.UTC(year, 0, j));
        if (temp.getUTCDay() === 6) {
          firstSat = temp.getUTCDate();
        }
      }
      return Math.ceil((getDayNumber(year, month, day) + firstSat + 1)/7);
    }

    function updateDiff(year1, month1, day1) {
      var now = new Date(Date.now());
      var diffList = countTimeBetween(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        year1,
        month1,
        day1
      );
      $scope.diffYear = diffList[0];
      $scope.diffMonth = diffList[1];
      $scope.diffDay = diffList[2];
      $scope.diffHour = diffList[3];
      $scope.diffMin = diffList[4];
      $scope.diffSec = diffList[5];
    }

    function innerInterval(year1, month1, day1) {
      $interval(function() {
        updateDiff(year1, month1, day1);
      }, 1000, 10);

    }

    function countTimeBetween(year0, month0, day0, hour0, min0, sec0, year1, month1, day1) {
      var years = 0;
      var months = 0;
      var days = 0;
      var hours = 0;
      var mins = 0;
      var secs = 0;

      var date0 = new Date(year0, month0, day0, hour0, min0, sec0);
      var date1 = new Date(year1, month1, day1);

      if (date0.getTime() > date1.getTime()) {
        var temp = date0;
        date0 = date1;
        date1 = temp;
        // now date0 < date1
      }
      // else, negation of guard means date0 <= date1

      if (date0.getTime() !== date1.getTime()) {
        // date0 is earlier than date1
        years = date1.getFullYear() - date0.getFullYear();
        months = date1.getMonth() - date0.getMonth();
        if (months <= 0) {
          // date1 is earlier in the year than date0; not a full year
          years--;
          months = 12 + months;
        }

        days = date1.getDate() - date0.getDate();
        if (days <= 0) {
          // date1 is earlier in the month than date0; not a full month
          months--;
          // count days from a version of date0 that's less than 1 month behind date1
          var date0Temp = new Date(date1.getFullYear(), date1.getMonth()-1, day0);
          var msDiffTemp = date1.getTime() - date0Temp.getTime();
          days = Math.floor(dateToDays(msDiffTemp));
        }

        hours = date1.getHours() - date0.getHours();
        if (hours < 0) {
          // not a complete day
          days--;
          hours = 24 + hours;
        }

        mins = date1.getMinutes() - date0.getMinutes();
        if (mins < 0) {
          hours--;
          mins = 60 + mins;
        }

        secs = date1.getSeconds() - date0.getSeconds();
        if (secs < 0) {
          mins--;
          secs = 60 + secs;
        }
      }

      return [years, months, days, hours, mins, secs];
    }

    $scope.$watch('selectedCalculator', function(newVal, oldVal) {
      //console.log(newVal); console.log(oldVal);

      $scope.dayNumber = getDayNumber(
        CalData[i].year,
        CalData[i].month-1,
        CalData[i].day
      );

      $scope.weekNumber = getWeekNumber(
        CalData[i].year,
        CalData[i].month-1,
        CalData[i].day
      );

      $scope.dayCount = isLeap(CalData[i].year) ? 366 : 365;

      if (newVal === 'countdown' || newVal === 'countup') {
        if ($scope.promise === null) {
          // before promise starts, and before preliminary starts

          updateDiff(
            CalData[i].year,
            CalData[i].month-1,
            CalData[i].day
          );
          innerInterval(
            CalData[i].year,
            CalData[i].month-1,
            CalData[i].day
          );
          /* since delays in execution are basically constant,
          outer one forces inner updates every 10 seconds to keep inner updates better in sync */
          $scope.promise = $interval(function() {
            innerInterval(
              CalData[i].year,
              CalData[i].month-1,
              CalData[i].day
            );}, 10000);
        }
      }
      else if (oldVal === 'countdown' || oldVal === 'countup') {
        if ($scope.promise !== null) {
          $interval.cancel($scope.promise);
          $scope.promise = null;
        }
      }


    });
  });
})();
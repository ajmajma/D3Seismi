'use strict';
/**
 * @ngdoc overview
 * @name dataRobot
 * @description
 * # dataRobot 
 * Dependancy injection and routes
 */
angular
  .module('dataRobot', [
    'ngRoute',
    'ngAria',
    'ngAnimate',
    'ngMaterial'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

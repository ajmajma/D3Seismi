'use strict';
/**
 * @ngdoc function
 * @name dataRobot.service:getData
 * @description
 * # service for fetching data, this would be where we would customize the api calls if they were not hard coded 
 */
angular.module('dataRobot')
  .service('getData', function ($http) {

   //next steps :
   //we would accept all filter variables and make a call for new data here

  	return {
  		default : function() {return $http.get("scripts/quakes/2011-01.json")},
  		change : function(url) {return $http.get(url)}
  	}
      	   
  });

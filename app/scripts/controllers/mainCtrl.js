'use strict';

/**
 * @ngdoc function
 * @name dataRobot.controller:MainCtrl
 * @description
 * # MainCtrl
 *
 */
angular.module('dataRobot')
  .controller('MainCtrl', function ($scope, $http, $filter, getData) {

    //grab defaults
    getData.default().then(function(response){
      $scope.myData = response.data;
    });

    //jsonp testing
    //****
    //It seems seismi does not have a JSONP formatted response, which would require me to fetch data server side. We cannot use jsonp :(
    //**
    //it would be nice to set node up to do this !!
    //  var url = "http://www.seismi.org/api/eqs/2011?callback=JSON_CALLBACK";
    // $http.jsonp(url)
    //     .success(function(data){
    //         console.log(data);
    //     });

  	//hardcoded for now, should be dynamic
  	$scope.monthSelect = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    $scope.yearSelect = ["2010", "2011"];

    //defaults
    $scope.currentMonth = "01";
    $scope.currentYear = "2011";

  	$scope.emptyMessage = "";

    $scope.magUsed = false;
    $scope.regUsed = false;


    $scope.done = function(value) {
       $scope.$apply(function () {
        $scope.myPick = value;
       });
    };


  	//Change Month
  	$scope.changeMonth = function(month, year){

    var newUrl = "scripts/quakes/" + year + "-" + month + ".json";

    getData.change(newUrl).then(function(response){
      $scope.myData = response.data;
      //reset 
      $scope.magnitudeSlide = "01";
      $scope.regionName = "";
      $scope.magUsed = "";
      $scope.regUsed = "";

      if($scope.myData.earthquakes.length){
          $scope.emptyMessage = "";
      }else{
          $scope.emptyMessage = "No Results.";
      }
    });

  	};

    //change year 
    $scope.changeYear = function(year){

      var yearUrl = "scripts/quakes/" + year + "-01.json";

      getData.change(yearUrl).then(function(response){
      $scope.myData = response.data;
      //reset 
      $scope.currentYear = year;
      $scope.currentMonth = "01";
      $scope.magnitudeSlide = "01";
      $scope.regionName = "";
      $scope.magUsed = "";
      $scope.regUsed = "";

      if($scope.myData.earthquakes.length){
          $scope.emptyMessage = "";
      }else{
          $scope.emptyMessage = "No Results.";
      }
    });

    }


	//change slide filtering by magnitude
  //some blanket if/else to handle multiple filters at once - this would be better off handled by a api request however we are stuck with hardcoded data for now
	$scope.slideChange = function(data){
        $scope.magUsed = data;

        if($scope.regUsed.length){
          $scope.dataCopy = angular.copy($scope.myData);
          //parseInt to remove decimals for filtering
          $scope.dataCopy.earthquakes = $scope.dataCopy.earthquakes.filter(function(eq) {
            return parseInt(eq.magnitude) === data;
          });
          $scope.dataCopy.earthquakes = $filter('filter')($scope.dataCopy.earthquakes, { region: $scope.regUsed })
          if($scope.dataCopy.earthquakes.length){
            $scope.emptyMessage = "";
          }else{
            $scope.emptyMessage = "No Results.";
          }
        }else{
          //make copy so we still have original for filtering
          $scope.dataCopy = angular.copy($scope.myData);
          //parseInt to remove decimals for filtering
          $scope.dataCopy.earthquakes = $scope.dataCopy.earthquakes.filter(function(eq) {
            return parseInt(eq.magnitude) === data;
          });
          if($scope.dataCopy.earthquakes.length){
            $scope.emptyMessage = "";
          }else{
            $scope.emptyMessage = "No Results.";
          }
      }

	}

  $scope.nameChange = function(data){
    $scope.regUsed = data;

    if($scope.magUsed.length){

      $scope.dataCopy = angular.copy($scope.myData);
      $scope.dataCopy.earthquakes = $filter('filter')($scope.dataCopy.earthquakes, { region: data });
       $scope.dataCopy.earthquakes = $scope.dataCopy.earthquakes.filter(function(eq) {
          return parseInt(eq.magnitude) === data;
        });
        if($scope.dataCopy.earthquakes.length){
          $scope.emptyMessage = "";
        }else{
          $scope.emptyMessage = "No Results.";
        }
    }else{
      $scope.dataCopy = angular.copy($scope.myData);
      $scope.dataCopy.earthquakes = $filter('filter')($scope.dataCopy.earthquakes, { region: data });
       if($scope.dataCopy.earthquakes.length){
          $scope.emptyMessage = "";
        }else{
          $scope.emptyMessage = "No Results.";
        }
    }  
  }



});

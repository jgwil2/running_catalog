var dataSource = angular.module('DataSource', []);

dataSource.factory('DataSource',['$http', 
	function($http){
		return {
           get: function(file, callback, transform){
                $http.get(
                    file,
                    {transformResponse:transform}
                ).
                success(function(data, status) {
                  console.log('success');
                  //console.log(data)
                  callback(data);
                }).
                error(function(data, status){
                  console.log('request failed ' + status);
                });
           }
       }
	}]);

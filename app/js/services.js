var dataSource = angular.module('DataSource', []);

dataSource.factory('DataSource',['$http', 
	function($http){
		return {
           get: function(file, callback){
                $http.get(
                    file,
                    {transformResponse:function(data){
                      console.log("transform data");
                      var x2js = new X2JS();
                      var json = x2js.xml_str2json(data);
                      return json.Products.Product;
                    }
                  }
                ).
                success(function(data, status) {
                  console.log('success');
                  callback(data);
                }).
                error(function(data, status){
                  console.log('request failed ' + status);
                });
           }
       }
	}]);

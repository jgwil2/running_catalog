var catalogControllers = angular.module('catalogControllers', []);

catalogControllers.controller('MainCtrl', ['$scope', 'DataSource', '$routeParams', '$location',
  function($scope, DataSource, $routeParams, $location) {

  	var SOURCE_FILE = '/app/src/data.xml';

  	xmlTransform = function(data) {
        console.log("transform data");
        var x2js = new X2JS();
        var json = x2js.xml_str2json(data);
        //console.log(JSON.stringify(json.Products))
        return json.Products.Product;
    };

    setData = function(data) {
        $scope.products = data;

        $scope.currentPage = 0; 
        $scope.pageSize = 75;

        $scope.setUrl = function(currentPage){
          //$location.search('page', toString(currentPage + 1))
          //console.log(currentPage)
          $scope.currentPage = currentPage
        }

        $scope.getNumberAsArray = function (num) {
          return new Array(num);
        }

        $scope.numberOfPages = function() {
          return Math.ceil($scope.products.length/ $scope.pageSize);
        }
    }

    DataSource.get(SOURCE_FILE, setData, xmlTransform);

  }]);
var catalogControllers = angular.module('catalogControllers', []);

catalogControllers.controller('MainCtrl', ['$scope', 'DataSource', '$routeParams', '$location',
  function($scope, DataSource, $routeParams, $location) {

    // Main page

    $scope.controller = 'Main Controller';

  	var SOURCE_FILE = '/app/src/data.xml';

    setData = function(data){
      $scope.products = data;

      $scope.currentPage = 0; 
      $scope.pageSize = 75;

      $scope.setUrl = function(currentPage){
        $scope.currentPage = currentPage;
      }

      $scope.getNumberAsArray = function(num){
        return new Array(num)
      }

      $scope.numberOfPages = function(){
        return Math.ceil($scope.products.length/ $scope.pageSize)
      }

      $scope.prevPage = function(){
        if($scope.currentPage > 0){
          $scope.currentPage--;
        }
      }

      $scope.nextPage = function(){
        if($scope.currentPage < $scope.numberOfPages() - 1){
          $scope.currentPage++;
        }
      }

    }

    DataSource.get(SOURCE_FILE, setData);

  }]);

catalogControllers.controller('CatCtrl', ['$scope', 'DataSource', '$routeParams', '$location',
  function($scope, DataSource, $routeParams, $location){

    // Category page

    $scope.category = $routeParams.category;

    $scope.categoryFilter = $scope.category;

    $scope.controller = 'Category Controller';

    var SOURCE_FILE = '/app/src/data.xml';

    setData = function(data){
      $scope.products = data;

      $scope.currentPage = 0; 
      $scope.pageSize = 75;

      $scope.setCurrentPage = function(currentPage){
        $scope.currentPage = currentPage;
      }

      $scope.getNumberAsArray = function(num){
        return new Array(num)
      }

      $scope.numberOfPages = function(){
        if($scope.cat){
          return Math.ceil($scope.cat.length/ $scope.pageSize)
        }
      }

      $scope.prevPage = function(){
        if($scope.currentPage > 0){
          $scope.currentPage--;
        }
      }

      $scope.nextPage = function(){
        if($scope.currentPage < $scope.numberOfPages() - 1){
          $scope.currentPage++;
        }
      }
    }

    DataSource.get(SOURCE_FILE, setData);

  }]);

catalogControllers.controller('ProdCtrl', ['$scope', 'DataSource', '$routeParams', '$location',
  function($scope, DataSource, $routeParams, $location){

    // Individual product

    $scope.productID = $routeParams.product;

    var SOURCE_FILE = '/app/src/data.xml';

    setData = function(data){
      $scope.products = data;

      for (var i = 0, n = $scope.products.length; i < n; i++) {
        if($scope.products[i]._ArticleNumber == $scope.productID){
          console.log($scope.products[i]);
          $scope.product = $scope.products[i];
        }
      }
    }

    DataSource.get(SOURCE_FILE, setData);

  }]);
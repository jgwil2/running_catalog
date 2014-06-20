var catalogControllers = angular.module('catalogControllers', []);

catalogControllers.controller('MainCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {

    // Main page

    $scope.controller = 'Main Controller';

    $scope.hommes = true;

    $scope.femmes = true;

    $scope.setGenderFilter = function(){
      if($scope.hommes && $scope.femmes){
        $scope.genderFilter = "";
      }
      else if($scope.femmes && !$scope.hommes){
        $scope.genderFilter = "femmes";
      }
      else if($scope.hommes && !$scope.femmes){
        $scope.genderFilter = "hommes";
      }
      else{
        $scope.genderFilter = "";
      }
    }

    $http.get('src/running.json').success(function(data){
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
        return Math.ceil($scope.cat.length/ $scope.pageSize)
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

    });

  }]);

catalogControllers.controller('CatCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http){

    // Category page

    $scope.category = $routeParams.category;

    $scope.categoryFilter = $scope.category;

    $scope.controller = 'Category Controller';

    $scope.hommes = true;

    $scope.femmes = true;

    $scope.setGenderFilter = function(){
      if($scope.hommes && $scope.femmes){
        $scope.genderFilter = "";
      }
      else if($scope.femmes && !$scope.hommes){
        $scope.genderFilter = "femmes";
      }
      else if($scope.hommes && !$scope.femmes){
        $scope.genderFilter = "hommes";
      }
      else{
        $scope.genderFilter = "";
      }
    }

    $http.get('src/running.json').success(function(data){
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
        return Math.ceil($scope.cat.length/ $scope.pageSize)
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

    });

  }]);

catalogControllers.controller('ProdCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http){

    // Individual product

    $http.get('src/articles/' + $routeParams.productID + '.json').success(function(data){
      $scope.product = data;
    })

  }]);
var catalogControllers = angular.module('catalogControllers', []);

catalogControllers.controller('CatCtrl', ['$scope', '$routeParams', '$http', 'CONFIG',
  function($scope, $routeParams, $http, CONFIG){
    
    // Main page

    $scope.controller = 'Catalog Controller';

    $http.get('data/running.json').success(function(data){
      $scope.products = data;
    });

    // If parameter is passed into route, set category by which to filter

    var brandsArray = CONFIG.brandsArray;

    if($routeParams.category){
      $scope.category = $routeParams.category;

      // If category is a brand, filter on Product.Details (Details.Title is location of brand name in data)
      // Otherwise filter on Product.CategoryPath (CategoryPath.ProductCategoryPath is location of category)

      $scope.getFilter = function(){
        if(brandsArray.indexOf($scope.category) !== -1){
          return {Details:$scope.category}
        }
        else{
          return {CategoryPath:$scope.category}
        }
      }
    }

    // Viewing both men's and women's items

    $scope.hommes = true;
    $scope.femmes = true;

    // Set current page and number of items per page

    $scope.currentPage = 0; 
    $scope.pageSize = CONFIG.pageSize;

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

    // Navigation

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

    // Set filter by gender and reset page to 0

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
      $scope.currentPage = 0;
    }

  }]);

catalogControllers.controller('ProdCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http){

    // Individual product

    $http.get('data/articles/' + $routeParams.productID + '.json').success(function(data){
      $scope.product = data;
    })

  }]);
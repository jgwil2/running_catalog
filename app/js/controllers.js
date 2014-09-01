"use strict";

var catalogControllers = angular.module('catalogControllers', []);

// Main controller

catalogControllers.controller('MainCtrl', ['$scope', 'Title',
  function($scope, Title){
    $scope.title = Title;
    $scope.status = "ready";
  }]);

// Catalog page

catalogControllers.controller('CatCtrl', ['$scope', '$routeParams', '$http', 'CONFIG', 'Title', 'Data',
  function($scope, $routeParams, $http, CONFIG, Title, Data){

    Title.setTitle('Boutique Course à Pied');

    $scope.controller = 'Catalog Controller';

    // Get products from Data service
    Data.async().then(function(data){
      $scope.products = data;
    });

    // Get brands/subcategories/sucategories to pluralize from config.js to populate template
    $scope.brandsArray = CONFIG.brandsArray;
    $scope.vetementsSubcatsArray = CONFIG.vetementsSubcatsArray;
    $scope.chaussuresSubcatsArray = CONFIG.chaussuresSubcatsArray;
    $scope.accessoiresSubcatsArray = CONFIG.accessoiresSubcatsArray;
    $scope.pluralizeArray = CONFIG.pluralizeArray;

    // Show all colors by default
    $scope.color = "";

    $scope.colorFunction = function(color){
      $scope.color = color;
      $scope.resetPage();
    }

    // If parameter is in pluralizeArray, return true
    $scope.isPlural = function(subcategory){
      if($scope.pluralizeArray.indexOf(subcategory) !== -1){
        return true;
      }
    }

    // If parameter is passed into route, set param as category by which to filter
    if($routeParams.category){
      $scope.category = $routeParams.category;

      Title.setTitle($scope.category);

      if($scope.brandsArray.indexOf($scope.category) !== -1){
        $scope.isBrand = true;
      }
    }

    // If second parameter is passed into route, set param as subcategory by which to filter
    if($routeParams.subcat){
      $scope.subcat = $routeParams.subcat;
      $scope.isSubcategory = true;

      Title.setTitle($scope.subcat + ($scope.isPlural($scope.subcat) ? 's' : ''));
    }

    // If parameter is a brand, filter by Title field, otherwise filter by Category field
    $scope.getField = function(){
      if($scope.isBrand){
        return {Title:$scope.category};
      }
      else{
        return {Category:$scope.category};
      }
    }

    // If subcategory is set, return the subcategory to the filter
    $scope.subcatFilter = function(){
      if($scope.isSubcategory){
        return $scope.subcat;
      }
    }

    // Pagination

    // Set current page and number of items per page (config.js)
    $scope.currentPage = 0; 
    $scope.pageSize = CONFIG.pageSize;

    $scope.setCurrentPage = function(currentPage){
      $scope.currentPage = currentPage;
    }

    $scope.getNumberAsArray = function(num){
      return new Array(num)
    }

    $scope.getNumberOfPages = function(){
      if($scope.cat){
        if($scope.cat.length == 0){
          $scope.noArticles = true;
        }
        else{
          $scope.noArticles = false;
        }
        return Math.ceil($scope.cat.length/$scope.pageSize)
      }
    }

    // Navigation
    $scope.prevPage = function(){
      if($scope.currentPage > 0){
        $scope.currentPage--;
      }
    }

    $scope.nextPage = function(){
      if($scope.currentPage < $scope.getNumberOfPages() - 1){
        $scope.currentPage++;
      }
    }

    $scope.resetPage = function(){
      $scope.currentPage = 0;
    }

    // Viewing both men's and women's items
    $scope.hommes = true;
    $scope.femmes = true;

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
      $scope.resetPage();
    }

  }]);

// Individual product

catalogControllers.controller('ProdCtrl', ['$scope', '$routeParams', '$http', 'Title', 'CONFIG', 'Data',
  function($scope, $routeParams, $http, Title, CONFIG, Data){

    // Get products from Data service
    Data.async().then(function(data){
      $scope.products = data;

      // Get product ID from route parameter and set to $scope.product
      $scope.setProduct($routeParams.productID);

      // Remove main product from product array
      for (var i = 0, j = $scope.products.length; i < j; i++) {
        if($scope.products[i] == $scope.product){
          $scope.products.splice(i, 1);
          break;
        }
      }

      // Set page title to product title
      Title.setTitle($scope.product.Title);

      // Set gender filter to product.Gender
      $scope.genderFilter = $scope.product.Gender;

      // Randomize products to display below main product
      $scope.products = $scope.shuffleArray($scope.products);
    });

    // Get brands/subcategories/sucategories to pluralize from config.js to populate template
    $scope.brandsArray = CONFIG.brandsArray;
    $scope.vetementsSubcatsArray = CONFIG.vetementsSubcatsArray;
    $scope.chaussuresSubcatsArray = CONFIG.chaussuresSubcatsArray;
    $scope.accessoiresSubcatsArray = CONFIG.accessoiresSubcatsArray;
    $scope.pluralizeArray = CONFIG.pluralizeArray;

    // Filter by category and subcategory if set (unless category is shoes!!)
    if($routeParams.subcat !== "subcat" && $routeParams.category !== "chaussures"){
      $scope.subcat = $routeParams.subcat;
    }

    if($routeParams.category !== "category"){
      $scope.category = $routeParams.category;
    }

    // If parameter is in pluralizeArray, return true
    $scope.isPlural = function(subcategory){
      if($scope.pluralizeArray.indexOf(subcategory) !== -1){
        return true;
      }
    }

    // Get product from list of products
    $scope.setProduct = function(productID){
      $scope.products.forEach(function(product){
        if(product._ArticleNumber == productID){
          $scope.product = product;
        }
      });
    }

    /**
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     */
    $scope.shuffleArray = function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

  }]);
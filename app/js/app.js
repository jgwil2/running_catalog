var runningCatalogApp = angular.module('runningCatalogApp', [
	'catalogConfig',
	'catalogControllers',
	'catalogFilters',
	'ngRoute',
	'Title',
	'Data'
]);

runningCatalogApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider){
		$locationProvider.hashPrefix('!');
		$routeProvider.
			when('/', {
				templateUrl: 'partials/list.html',
				controller: 'CatCtrl'
			}).
			when('/:category', {
				templateUrl: 'partials/list.html',
				controller: 'CatCtrl'
			}).
			when('/:category/:subcat', {
				templateUrl: 'partials/list.html',
				controller: 'CatCtrl'
			}).
			when('/:category/:subcat/:productID', {
				templateUrl: 'partials/product.html',
				controller: 'ProdCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);
var runningCatalogApp = angular.module('runningCatalogApp', [
	'DataSource',
	'catalogControllers',
	'catalogFilters',
	'ngRoute'
]);

runningCatalogApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/', {
				templateUrl: 'partials/list.html',
				controller: 'MainCtrl'
			}).
			when('/:category', {
				templateUrl: 'partials/list.html',
				controller: 'CatCtrl'
			}).
			when('/:category/:product', {
				templateUrl: 'partials/product.html',
				controller: 'ProdCtrl'
			}).
			otherwise({
				redirectTo: '/'
			})
	}])
var runningCatalogApp = angular.module('runningCatalogApp', [
	'DataSource',
	'catalogControllers',
	'catalogFilters',
	'ngRoute'
]);

runningCatalogApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/catalog', {
				templateUrl: 'partials/list.html',
				controller: 'MainCtrl',
				reloadOnSearch: false
			}).
			otherwise({
				redirectTo: '/catalog'
			})
	}])
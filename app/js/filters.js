var catalogFilters = angular.module('catalogFilters', [])

catalogFilters.filter('startFrom', function() {
    return function(input, start) {
    	if(input){
    	    return input.slice(start)
    	}
    }
}).filter('capitalize', function() {
    return function(input, scope) {
        return input.substring(0,1).toUpperCase()+input.substring(1).toLowerCase();
    }
});
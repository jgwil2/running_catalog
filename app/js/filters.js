angular.module('catalogFilters', []).filter('startFrom', function() {
    return function(input, start) {
    	//console.log(input)
    	if(input){
    	    return input.slice(start)
    	}
    }
});
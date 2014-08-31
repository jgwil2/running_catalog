angular.module('Title', []).factory('Title', function(){
	var title = '';
	return {
		getTitle: function() { return title; },
		setTitle: function(newTitle){ title = newTitle}
	}
});

angular.module('Data', []).factory('Data', function($http){
	var Data = {
		async: function(){
			var promise = $http.get('data/data.json', {cache: true}).then(function(response){
				return response.data;
			});
			return promise;
		}
	}
	return Data;
});
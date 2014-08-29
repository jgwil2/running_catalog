angular.module('Title', []).factory('Title', function(){
	var title = ''
	return {
		title: function() { return title; },
		setTitle: function(newTitle){ title = newTitle}
	}
})
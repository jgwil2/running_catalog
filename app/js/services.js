var Data = angular.module('Data', []);

Data.factory('Data',
	function(){
    var title = '';
		return {
      title: function() { return title; },
      setTitle: function(newTitle){ title = newTitle}
    }
	});

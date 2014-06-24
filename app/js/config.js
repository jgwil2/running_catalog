var catalogConfig = angular.module('catalogConfig', []);

catalogConfig.constant('CONFIG', {
	brandsArray : ['adidas', 'asics', 'mizuno', 'nathan', 'new balance', 'nike', 'polar', 'powerbar', 'saucony'],
	colorsArray : ['blanc', 'noir', 'lilas', 'rose', 'gris', 'jaune', 'orange', 'bleu', 'vert', 'rouge'],
	pageSize : 75
})
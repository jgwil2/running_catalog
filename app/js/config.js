var catalogConfig = angular.module('catalogConfig', []);

catalogConfig.constant('CONFIG', {
	brandsArray : ['adidas', 'asics', 'mizuno', 'nathan', 'new balance', 'nike', 'polar', 'powerbar', 'puma', 'saucony'],
	colorsArray : ['blanc', 'noir', 'lilas', 'rose', 'gris', 'jaune', 'orange', 'bleu', 'vert', 'rouge', 'argent'],
	vetementsSubcatsArray : ['veste', 'collant', 't-shirt', 'short', 'sous-vêtements & chaussettes', 'pantalon', 'casquette'],
	chaussuresSubcatsArray : ['trail', 'piste', 'compétition', 'stable', 'nature'],
	accessoiresSubcatsArray : ['sac à dos', 'cardio', 'bouteille', 'gilet', 'sac'],
	pluralizeArray : ['veste', 'collant', 't-shirt', 'short', 'pantalon', 'casquette', 'gilet', 'bouteille', 'sac'],
	pageSize : 75
})
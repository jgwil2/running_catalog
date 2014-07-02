<?php

ini_set('memory_limit', '256M');
echo(memory_get_usage()."\n");

$xml = simplexml_load_file('data.xml');

//print_r($xml->Product[67]->CategoryPath->ProductCategoryPath);

$array = (array) $xml;

//print_r($array['Product'][0]);

$counter = 0;
echo(memory_get_usage()."\n");

loopArray($array);

function loopArray($array){
	foreach($array['Product'] as $product){
		if(preg_match("/^Running/" , $product->CategoryPath->ProductCategoryPath)){
	        $list = $product;
	        writeFile($list);
		}
	}
}

function writeFile($list){
	$my_file = 'test.json';
	$handle = fopen($my_file, 'a') or die('Cannot open file:  '.$my_file);
	$data = json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
	fwrite($handle, $data);
	fclose($handle);
}






echo(memory_get_usage()."\n");
?>
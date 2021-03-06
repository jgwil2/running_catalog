<?php

if(($argv[1] != "data") && ($argv[1] != "seo")){
	if(!empty($argv[1])){
		echo "Incorrect argument!\n";
	}
	echo "* * *\nScript usage:\n\nArguments: 'php datascript.php data' ou 'php datascript.php seo'\n\n'data' : charger fichier XML, enregistrer son contenu, le convertir en JSON et enregistrer\n\n'seo' : parcourir toutes pages produits avec phantomjs, enregistrer fichiers HTML et fichier sitemap.xml\n* * *\n";
	exit();
}

date_default_timezone_set("Europe/Paris");
echo "Memory usage on script start: ".(memory_get_usage()/1048576)."M \n";

if($argv[1] == "data"){
	echo "Fetching XML document, hold on for just a moment...\n";
	file_put_contents("data.xml", file_get_contents("http://productdata-download.affili.net/affilinet_products_783_345425.XML?auth=D2w7sdMqv6PRa6jgotXy&type=XML"));
}

// $xml object loads contents of XML document
$xml = simplexml_load_file('data.xml');

// Convert $xml object to array (top-most level only, there are still objects within array)
$array = (array) $xml;

// Call function to iterate array
loopArray($array, $argv[1]);

function loopArray($array, $commandLineArg = null){
	$list = array();
	$counter = 0;
	$currentTitle = "";

	$sitemap = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');

	$categoryPages = array('chaussures', 'accessoires');

	$subcategoryPages = array('veste', 'collant', 't-shirt', 'short', 'pantalon', 'casquette', 'trail', 'piste', 'stable', 'nature', 'cardio', 'bouteille', 'gilet', 'sac');

	if($commandLineArg == "seo"){
		// Add each menu page to sitemap and take its snapshot
		foreach($categoryPages as $page){
			echo "Writing snapshot of page ".$page."\n";
			exec("phantomjs phantom/phantomjs-runner.js http://boutique.passionrunning.com/#\!/".$page." > phantom/snapshots/".$page.".html");
			$url = $sitemap->addChild('url');
			$url->addChild('loc', "http://boutique.passionrunning.com/#\!/".$page);
			$url->addChild('lastmod', date("Y-m-d"));
		}

		foreach($subcategoryPages as $page){
			echo "Writing snapshot of page ".$page."\n";
			exec("phantomjs phantom/phantomjs-runner.js http://boutique.passionrunning.com/#\!/category/".$page." > phantom/snapshots/".$page.".html");
			$url = $sitemap->addChild('url');
			$url->addChild('loc', "http://boutique.passionrunning.com/#\!/category/".$page);
			$url->addChild('lastmod', date("Y-m-d"));
		}
	}

	// Iterate the array corresponding to the XML file
	foreach($array['Product'] as $product){

		// If product category begins with "Running"...
		if(preg_match("/^Running/" , $product->CategoryPath->ProductCategoryPath)){

			// If first 20 characters of previous title do not match new title
			if(substr($currentTitle, 0, 20) !== substr($product->Details->Title, 0, 20)){

				// Set new title to current title
				$currentTitle = $product->Details->Title;

				// Current index of $list is an object
				$list[$counter] = new stdClass();

				// Convert objects corresponding to current product to strings and save at current index of $list
				$list[$counter]->_ArticleNumber = (string) $product['ArticleNumber'][0];
				$list[$counter]->Category = str_replace("Running > ", "", $product->CategoryPath->ProductCategoryPath);
				$list[$counter]->Price = (string) $product->Price->DisplayPrice;
				$list[$counter]->DescriptionShort = (string) $product->Details->DescriptionShort;
				$list[$counter]->ImageURL = (string) $product->Images->Img->URL;
				$list[$counter]->Gender = (string) $product->Properties->Property[4]['Text'];
				$list[$counter]->Color = (string) $product->Properties->Property[0]['Text'];
				$list[$counter]->Material = (string) $product->Properties->Property[6]['Text'];
				$list[$counter]->URL = (string) $product->Deeplinks->Product;
				
				// Remove gender and sizes from titles
				if(strstr($currentTitle, "Hommes", true) != ""){
					$list[$counter]->Title = strstr($currentTitle, " Hommes", true);
				}
				else if(strstr($currentTitle, "Femmes", true) != ""){
					$list[$counter]->Title = strstr($currentTitle, " Femmes", true);
				}
				else if(strstr($currentTitle, "Enfants", true) != ""){
					$list[$counter]->Title = strstr($currentTitle, " Enfants", true);
				}
				else{
					$pos = strposX($currentTitle, "-", 2);
					if($pos != ""){
						$list[$counter]->Title = substr_replace($currentTitle, "", $pos);
					}
					else{
						$list[$counter]->Title = (string) $currentTitle;
					}
				}

				if($commandLineArg == "seo"){
					echo "Writing snapshot number ".($counter+1)."\n";
					exec("phantomjs phantom/phantomjs-runner.js http://boutique.passionrunning.com/#\!/category/subcat/".$list[$counter]->_ArticleNumber." > phantom/snapshots/".$list[$counter]->_ArticleNumber.".html");

					$url = $sitemap->addChild('url');
					$url->addChild('loc', "http://boutique.passionrunning.com/#\!/category/subcat/".$list[$counter]->_ArticleNumber);
					$url->addChild('lastmod', date("Y-m-d"));
				}

				// Next index of $list
				$counter++;
			}
		}
	}

	if($commandLineArg == "data"){
		echo "Writing ".$counter." items to disk\n";
		writeJsonFile($list);
	}

	if($commandLineArg == "seo"){
		echo "Writing sitemap.xml\n";
		writeXmlFile($sitemap);
	}
}

function writeXmlFile($xml){
	$my_file = '../sitemap.xml';
	$handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file);
	$data = $xml->asXML();
	fwrite($handle, $data);
	fclose($handle);
}

// Convert array to JSON and write to file 
function writeJsonFile($list){
	$my_file = 'data.json';
	$handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file);
	$data = json_encode($list);
	fwrite($handle, $data);
	fclose($handle);
}

// Get position of Xth occurence of string
function strposX($haystack, $needle, $number){
    if($number == '1'){
        return strpos($haystack, $needle);
    }elseif($number > '1'){
        return strpos($haystack, $needle, strposX($haystack, $needle, $number - 1) + strlen($needle));
    }else{
        return error_log('Error: Value for parameter $number is out of range');
    }
}

echo "Using ".(memory_get_usage()/1048576)."M of ".ini_get('memory_limit')." allowed\n";
?>
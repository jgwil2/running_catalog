<?php

//ini_set('memory_limit', '256M');
echo "Memory usage on script start: ".(memory_get_usage()/1048576)."M \n";

echo "Fetching XML document, hold on for just a moment...\n";
file_put_contents("test.xml", file_get_contents("http://productdata-download.affili.net/affilinet_products_783_345425.XML?auth=D2w7sdMqv6PRa6jgotXy&type=XML"));

// $xml object loads contents of XML document
$xml = simplexml_load_file('test.xml');

// Convert $xml object to array (top-most level only, there are still objects within array)
$array = (array) $xml;

// Call function to iterate array
loopArray($array);


function loopArray($array){
	$list = array();
	$counter = 0;
	$currentTitle = "";

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
				// Next index of $list
				$counter++;
			}
		}
	}
	echo "Writing ".$counter." items to disk\n";
	writeFile($list);
}

// Convert array to JSON and write to file 
function writeFile($list){
	$my_file = 'test.json';
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
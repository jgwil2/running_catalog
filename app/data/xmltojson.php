<?php

echo "Preparing to update catalog...\n";

// from blog post at http://outlandish.com/blog/xml-to-json/

function xmlToArray($xml, $options = array()) {
    $defaults = array(
        'namespaceSeparator' => ':',//you may want this to be something other than a colon
        'attributePrefix' => '_',   //to distinguish between attributes and nodes with the same name
        'alwaysArray' => array(),   //array of xml tag names which should always become arrays
        'autoArray' => true,        //only create arrays for tags which appear more than once
        'textContent' => '$',       //key used for the text content of elements
        'autoText' => true,         //skip textContent key if node has no attributes or child nodes
        'keySearch' => false,       //optional search and replace on tag and attribute names
        'keyReplace' => false       //replace values for above search values (as passed to str_replace())
    );
    $options = array_merge($defaults, $options);
    $namespaces = $xml->getDocNamespaces();
    $namespaces[''] = null; //add base (empty) namespace
 
    //get attributes from all namespaces
    $attributesArray = array();
    foreach ($namespaces as $prefix => $namespace) {
        foreach ($xml->attributes($namespace) as $attributeName => $attribute) {
            //replace characters in attribute name
            if ($options['keySearch']) $attributeName =
                    str_replace($options['keySearch'], $options['keyReplace'], $attributeName);
            $attributeKey = $options['attributePrefix']
                    . ($prefix ? $prefix . $options['namespaceSeparator'] : '')
                    . $attributeName;
            $attributesArray[$attributeKey] = (string)$attribute;
        }
    }
 
    //get child nodes from all namespaces
    $tagsArray = array();
    foreach ($namespaces as $prefix => $namespace) {
        foreach ($xml->children($namespace) as $childXml) {
            //recurse into child nodes
            $childArray = xmlToArray($childXml, $options);
            list($childTagName, $childProperties) = each($childArray);
 
            //replace characters in tag name
            if ($options['keySearch']) $childTagName =
                    str_replace($options['keySearch'], $options['keyReplace'], $childTagName);
            //add namespace prefix, if any
            if ($prefix) $childTagName = $prefix . $options['namespaceSeparator'] . $childTagName;
 
            if (!isset($tagsArray[$childTagName])) {
                //only entry with this key
                //test if tags of this type should always be arrays, no matter the element count
                $tagsArray[$childTagName] =
                        in_array($childTagName, $options['alwaysArray']) || !$options['autoArray']
                        ? array($childProperties) : $childProperties;
            } elseif (
                is_array($tagsArray[$childTagName]) && array_keys($tagsArray[$childTagName])
                === range(0, count($tagsArray[$childTagName]) - 1)
            ) {
                //key already exists and is integer indexed array
                $tagsArray[$childTagName][] = $childProperties;
            } else {
                //key exists so convert to integer indexed array with previous value in position 0
                $tagsArray[$childTagName] = array($tagsArray[$childTagName], $childProperties);
            }
        }
    }
 
    //get text content of node
    $textContentArray = array();
    $plainText = trim((string)$xml);
    if ($plainText !== '') $textContentArray[$options['textContent']] = $plainText;
 
    //stick it all together
    $propertiesArray = !$options['autoText'] || $attributesArray || $tagsArray || ($plainText === '')
            ? array_merge($attributesArray, $tagsArray, $textContentArray) : $plainText;
 
    //return node as array
    return array(
        $xml->getName() => $propertiesArray
    );
}





$xmlNode = simplexml_load_file('data.xml');
$json = xmlToArray($xmlNode);

// Mouvement Etik code

$counter = 0;

$list = array();

// for each product associative array in json document

foreach($json['Products']['Product'] as $product){ 

    // first check that the product category is a string

    if(is_string($product['CategoryPath']['ProductCategoryPath'])){ 

        // if the product category starts with "Running" we will add 
        // relevant fields to new array and store in catalog file

        if(preg_match("/^Running/" , $product['CategoryPath']['ProductCategoryPath'])){ 

            //create new array with select fields from each product associative array in products array

            $list[$counter]['_ArticleNumber'] = $product['_ArticleNumber']; 
            $list[$counter]['CategoryPath']['ProductCategoryID'] = $product['CategoryPath']['ProductCategoryID'];
            $list[$counter]['CategoryPath']['ProductCategoryPath'] = $product['CategoryPath']['ProductCategoryPath'];
            $list[$counter]['Price']['DisplayPrice'] = $product['Price']['DisplayPrice'];
            $list[$counter]['Details']['Title'] = $product['Details']['Title'];
            $list[$counter]['Details']['DescriptionShort'] = $product['Details']['DescriptionShort'];
            $list[$counter]['Images']['Img']['URL'] = $product['Images']['Img']['URL'];
            $list[$counter]['Gender'] = $product['Properties']['Property'][1]['_Text'];

            // write individual product file with all fields of product associative array

            $file = 'articles/'.$product['_ArticleNumber'].'.json'; 
            $handle = fopen($file, 'w') or die('Cannot open file:  '.$file);
            $data = json_encode($product, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            fwrite($handle, $data);
            fclose($handle);

            $counter++;
        }
    }
}

// write catalog array to file

$my_file = 'running.json';
$handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file);
$data = json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
fwrite($handle, $data);
fclose($handle);

echo "Finished updating catalog!!\n"

?>
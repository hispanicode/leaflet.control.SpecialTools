<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

if (
        isset($_GET['query']) 
        && isset($_GET['type_site'])
        && isset($_GET['type_name'])
        && isset($_GET['type_country'])
    ) {
       
    $query = $_GET['query'];
    
    $type_site = $_GET['type_site'];
    
    $type_name = $_GET['type_name'];
    
    $type_country = $_GET['type_country'];
    
    $type_name = $type_name . '=' . $query;
    ($type_site === '') ? $type_site = '' : $type_site = '&typeid='.$type_site;
    ($type_country === '') ? $type_country = '' : $type_country = '&cc=' . $type_country;
    
    $params = $type_name . $type_site . $type_country;
  
    $objects = [];
    
    if (strlen($query) > 3) {
        
        $contents = file_get_contents('http://imperium.ahlfeldt.se/api/geojson.php?'.$params);
        $contents = json_decode($contents);
        $count = 0;
        
        foreach ($contents->features as $geojson) {

            array_push($objects, [
                
                "value" => $geojson->properties->name, 
                "geometry_type" => $geojson->geometry->type,
                "geojson" => json_encode($geojson)
                
            ]);

            if ($count === 10) {
                
                break;
                
            }
        }
    }
    
    echo json_encode($objects);
    
    exit();
    
} else {
    
    echo json_encode([]);
    
    exit();
    
}
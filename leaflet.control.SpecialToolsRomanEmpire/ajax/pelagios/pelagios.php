<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

if (isset($_GET['query']) && isset($_GET['filter'])) {
    
    $query = $_GET['query'];
    
    $files = explode(',', $_GET['filter']);
    
    $objects = [];
    
    $limit = 1;
    
    foreach ($files as $file) {
        
        $content = file_get_contents('data/'.$file.'.geojson');
        
        $contents = json_decode($content);
        
        foreach ($contents->features as $geojson) {
            
            foreach ($geojson->properties as $key => $val) {
                
                if (strlen($query) > 2 && $limit <= 10) {
                    
                    if (str_contains(strtolower(utf8_decode($val)), strtolower($query))) {
                        
                        $object = [
                            
                            "geometry_type" => $geojson->geometry->type,
                            
                            "file" => $file . '.geojson',
                            
                            "value" => utf8_decode($val),
                            
                            "geojson" => json_encode($geojson)
                            
                        ];
                        
                        array_push($objects, $object);
                        
                        $limit++;
                        
                        continue;
                        
                    }
                    
                }  else {
                        
                    $objects = ['empty' => true];
                        
                }
            }
        }
        
    }

} else {
    
    $objects = ['error' => true];
    
}

echo json_encode($objects);

exit();
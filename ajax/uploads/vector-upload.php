<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

if (
        
    isset($_POST['file_type']) 
    && isset($_FILES["file_upload"]) 
    && isset($_POST['route'])
            
    ) {
    
    $file_type = $_POST["file_type"];
    $file_upload = $_FILES["file_upload"];
    $route = $_POST["route"];

    
    if ($file_type === 'shape' && $file_upload["type"] === "application/zip") {
        
        if ($file_upload["size"] > 1500000) {
            
            $error = 'El archivo .zip no debe superar los 1500 kilobytes para no colapsar el navegador';
            
            $object = [
                
                'error' => $error
                    
            ];
            
            echo json_encode($object);
            
            exit();
        }
        
        $target_dir = "shape/";
        $target_file = $target_dir . $file_upload["name"];
        
        if (copy($file_upload["tmp_name"], $target_file)) {
            
            $object = [
                
                'path' => $target_file,
                'type' => $file_type
                    
            ];
            
            echo json_encode($object);
            
            exit();
            
        } else {
            
            $error = "Ha ocurrido un error al guardar el archivo shape .zip";
            
            $object = [
                
                'error' => $error
                    
            ];
            
            echo json_encode($object);
            
            exit();
            
        }
        
    } else if ($file_type === 'geojson' && $file_upload['type'] === 'application/geo+json') {
        
        if ($file_upload["size"] > 1500000) {
            
            $error = 'El archivo .geojson no debe superar los 1500 kilobytes';
            
            $object = [
                'error' => $error
            ];
            
            echo json_encode($object);
            
            exit();
            
        }
        
            $object = [
                'type' => $file_type,
                'geojson' => json_decode(file_get_contents($file_upload["tmp_name"]))
            ]; 
            
        echo json_encode($object);
        
        exit();
        
    }
    
    else if ($file_type === 'kml' && $file_upload['type'] === 'application/vnd.google-earth.kml+xml') {
        
        if ($file_upload["size"] > 1500000) {
            
            $error = 'El archivo .kml no debe superar los 1500 kilobytes';
            
            $object = [
                
                'error' => $error

            ];
            
            echo json_encode($object);
            
            exit();
            
        }
        
        $target_dir = "kml/";
        $target_file = $target_dir . $file_upload["name"];
        
        if (copy($file_upload["tmp_name"], $target_file)) {
            
            $object = [
                
                'path' => $target_file,
                'type' => $file_type,
                'kml' => file_get_contents($file_upload["tmp_name"])
                
            ];
            
            echo json_encode($object);
            
            exit();
            
        } else {
            
            $error = "Ha ocurrido un error al guardar el archivo .kml";
            
            $object = [
                
                'error' => $error
                    
            ];
            
            echo json_encode($object);
            
            exit();
        }
    }
}

$error = "Ha ocurrido un error inesperado";

$object = [
    
    'error' => $error

];

echo json_encode($object);

exit();



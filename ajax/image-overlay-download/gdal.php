<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

//sudo apt install python3
//sudo apt install pip
//sudo apt install gdal-bin python3-gdal
//pip install GDAL

if (
        isset($_POST["bounds"]) 
        && isset($_POST["url"]) 
        && isset($_POST["route"])
        && isset($_POST["raster_name"])
        
    ) {

    $bounds = $_POST["bounds"];
    $url = $_POST["url"];
    $route = $_POST["route"];
    
    $raster_name = urldecode($_POST['raster_name']);
    $raster_name = strip_tags($raster_name);
    $raster_name = str_replace(' ', '-', $raster_name);

    $im = file_get_contents($url);
    
    //$random = bin2hex(random_bytes(20));
    
    $blob_file = $raster_name . ".png";
    
    $new_file = $raster_name . ".tif";

    file_put_contents($blob_file, $im);

    sleep(3);
    
    //-1.714582 48.506161 -1.742703 48.477861
    
    shell_exec("gdal_translate -of GTiff -a_srs EPSG:4326 -a_ullr $bounds -outsize 100% 100% -co TILED=YES -co COMPRESS=LZW -co ALPHA=YES $blob_file $new_file"); 

    sleep(2);
    
    $zipArchive = new ZipArchive();
    $zipFile = "geotiff/" . $raster_name . ".zip";
    
    if ($zipArchive->open($zipFile, ZipArchive::CREATE) !== TRUE) {
        
    echo json_encode(
            [
                "success" => false
            ]
        );
    
        exit();
        
    }
    
    $zipArchive->addFile($new_file);
    $zipArchive->close();
    
    echo json_encode(
            [
                "success" => true,
                "zip" => $zipFile
            ]
        );
    
    unlink($blob_file);
    unlink($new_file);
    
    exit();

} else {

    echo json_encode(
            [
                "success" => false
            ]
        );
    
    exit();
}
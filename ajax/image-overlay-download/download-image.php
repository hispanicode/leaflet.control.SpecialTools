<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

if (
        
        isset($_POST["image_src"]) 
        && isset($_POST["image_type"]) 
        && isset($_POST["route"])
        && isset($_POST["raster_name"])
                
        ) {
    
    $img_src = $_POST["image_src"];
    $img_format = $_POST["image_type"];
    $route = $_POST["route"];
    
    $raster_name = urldecode($_POST['raster_name']);
    $raster_name = strip_tags($raster_name);
    $raster_name = str_replace(' ', '-', $raster_name);
    
    $im = file_get_contents($img_src);
    
    $new_file = $raster_name . '.' . $img_format;

    $blob_file = $new_file . ".png";
    
    file_put_contents($blob_file, $im);

    sleep(3);

    $image = new Imagick($blob_file);

    $image->setImageFormat($img_format);
    
    $image->setImageCompressionQuality(100);

    $image->writeImage($new_file);

    $image->clear();

    $image->destroy();
    
    $zipArchive = new ZipArchive();
    $zipFile = $img_format . "/" . $raster_name . ".zip";
    
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
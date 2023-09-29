<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

if (
        isset($_POST['file_type']) 
        && isset($_POST['raster_name'])
        && isset($_POST['tif_bounds'])
        && isset($_POST['dataUrl'])
    ) {
    
    $img_format = $_POST['file_type'];
    $raster_name = urldecode($_POST['raster_name']);
    $raster_name = strip_tags($raster_name);
    $raster_name = str_replace(' ', '-', $raster_name);
    
    $tif_bounds = $_POST['tif_bounds'];
    
    $img_src = $_POST['dataUrl'];
    
    if ($tif_bounds === 'null') {

        
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

        $im = file_get_contents($img_src);

        //$random = bin2hex(random_bytes(20));

        $blob_file = $raster_name . ".png";

        $new_file = $raster_name . ".tif";

        file_put_contents($blob_file, $im);

        sleep(3);

        //-1.714582 48.506161 -1.742703 48.477861

        shell_exec("gdal_translate -of GTiff -a_srs EPSG:4326 -a_ullr $tif_bounds -outsize 100% 100% -co TILED=YES -co COMPRESS=LZW -co ALPHA=YES $blob_file $new_file"); 

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
        
    }
    
} else {
    
    $object = [
        
      "success" => false  
        
    ];
    
    echo json_encode($object);
    
    exit();
    
}

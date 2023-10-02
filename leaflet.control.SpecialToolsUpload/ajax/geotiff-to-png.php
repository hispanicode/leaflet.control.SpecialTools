<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

if (isset($_POST["url"]) && isset($_POST["route"])) {
    
    $url = $_POST["url"];
    
    $route = $_POST["route"];
        
    $new_png = 'geotiff-to-png/geotiff-'.bin2hex(random_bytes(10)).'.png';
    
    $image = new Imagick($url);

    $image->setImageFormat('png');
    $image->setImageCompressionQuality(100);
    $image->writeImage($new_png);

    $image->clear();

    $image->destroy();
    
    echo $route . "/leaflet.control.SpecialToolsUpload/ajax/$new_png";
    
    exit();

}


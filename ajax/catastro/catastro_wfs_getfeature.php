<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

if (isset($_GET['url']) && isset($_GET['getneighbourparcel'])) {
    
    $url = $_GET['url'];
    
    $content = file_get_contents($url);

    $xml = simplexml_load_string($content);
    
    @$xpaths = $xml->xpath( '//gml:posList' );

    if (isset($xpaths[1]) && count($xpaths) > 0) {
    
        $elements = [];
        
        $reference = explode(' ', $xpaths[1]);
        
            for ($x = 0; $x < count($reference); $x++) {
                
                array_push($elements, [floatval($reference[$x]), floatval($reference[$x+1])]);
                
                $x++;
                
            }
            
        echo json_encode($elements);
        
        exit();
        
    } else {
        
        echo json_encode([]);
        
        exit();
        
    }
}

if (isset($_GET['url']) && isset($_GET['getparcel'])) {
    
    $url = $_GET['url'];
    
    $content = file_get_contents($url);

    $xml = simplexml_load_string($content);
    
    @$xpaths = $xml->xpath( '//gml:posList' );

    if (isset($xpaths[0]) && count($xpaths) > 0) {
    
        $elements = [];
        
        $reference = explode(' ', $xpaths[0]);
        
            for ($x = 0; $x < count($reference); $x++) {
                
                array_push($elements, [floatval($reference[$x]), floatval($reference[$x+1])]);
                
                $x++
                        ;
            }
            
        echo json_encode($elements);
        
        exit();
        
    } else {
        
        echo json_encode([]);
        
        exit();
        
    }
} else {
    
    echo json_encode([]);
    
    exit();
    
}
<?php

if (isset($_GET['id'])) {
    
    $id = $_GET['id'];
    
    $url = "https://raw.githubusercontent.com/ryanfb/pleiades-geojson/gh-pages/geojson/" . $id . ".geojson";
    
    $content = file_get_contents($url);
    
    echo json_encode($content);
}


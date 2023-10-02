<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

if (isset($_GET['url'])) {
    
    $url = $_GET['url'];
    
    $content = file_get_contents($url);
    
    echo $content;
    
    exit();
    
}


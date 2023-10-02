<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

if (isset($_GET['url'])) {
    
    $url = $_GET['url'];
    $content = file_get_contents($url);
    $content = str_replace('<?xml version="1.0" encoding="ISO-8859-1"?>', '', $content);
    $content = str_replace('<!DOCTYPE html ', '', $content);
    $content = str_replace('PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"', '', $content);
    $content = str_replace('"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">', '', $content);
    $content = str_replace('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="sp"  lang="sp" >', '', $content);
    $content = str_replace('<head><title>Informaci&oacute;n parcelas</title></head><body><p>Referencia catastral de la parcela:</p><p>', '', $content);
    $content = str_replace('</p></body></html>', '', $content);
   
    echo $content;
    
    exit();

}


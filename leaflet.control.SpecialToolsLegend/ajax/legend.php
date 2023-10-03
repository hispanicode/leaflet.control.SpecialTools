<?php 

if (isset($_GET['content'])) {
    
    $content = $_GET['content'];
    
    file_put_contents('legend.json', $content);
    
}

$content = json_encode($content);
$content = json_decode($content);
echo $content;
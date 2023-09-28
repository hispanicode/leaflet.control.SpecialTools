<?php
if(isset($_GET["type"]) && isset($_GET["value"])) {
    
    $type = htmlspecialchars($_GET["type"]);
    $value = htmlspecialchars($_GET["value"]);
    
    if ($type === 'name') {
        
        $pleiades_file = file_get_contents('pleiades.json');
        
        $pleiades_array = json_decode($pleiades_file);

        $limit = 1;
        $object = [];
        
        foreach ($pleiades_array as $index => $val) {
            
            if (strlen($value) > 2 && $limit <= 10) {
                
                if (str_contains(strtolower($val[0]), strtolower($value))) {
                    
                    array_push($object, ['name' => $val[0], 'id' => $val[1]]);
                    
                    $limit++;
                }
            }
        }       
    }
    
    if ($type === 'id') {
        
        $pleiades_file = file_get_contents('pleiades.json');
        
        $pleiades_array = json_decode($pleiades_file);
        
        $limit = 1;
        
        $object = [];
        
        foreach ($pleiades_array as $index => $val) {
            
            if ($val[1] == $value && $limit <= 10) {
                
                    array_push($object, ['name' => $val[0], 'id' => $val[1]]);
                    
                }
            }
        }
    
    echo json_encode($object);
}


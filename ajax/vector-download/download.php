<?php

/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

if (
        isset($_POST['route']) 
        && isset($_POST['vector_type']) 
        && isset($_POST['vector_name'])
        && isset($_POST['content'])
    ) {
    
    $route = $_POST['route'];
    
    $vector_type = $_POST['vector_type'];
    
    $vector_name = urldecode($_POST['vector_name']);
    $vector_name = strip_tags($vector_name);
    $vector_name = str_replace(' ', '-', $vector_name);
    
    $content = $_POST['content'];
    
    //$random = bin2hex(random_bytes(20));
    
    if ($vector_type === 'geojson') {
    
        $temporal_file = $vector_name . '.geojson';

        $fp = fopen($temporal_file, "w+");
        fwrite($fp, $content);
        fclose($fp);

        sleep(2);

        $zipArchive = new ZipArchive();
        $zipFile = "geojson/" . $vector_name . ".zip";

        if ($zipArchive->open($zipFile, ZipArchive::CREATE) !== TRUE) {

        echo json_encode(
                [
                    "success" => false
                ]
            );

            exit();

        }

        $zipArchive->addFile($temporal_file);
        $zipArchive->close();

        echo json_encode(
                [
                    "success" => true,
                    "zip" => $zipFile
                ]
            );

        unlink($temporal_file);

        exit();
        
    } else if ($vector_type === 'shp') {
        
        $temporal_geojson_file = $vector_name . '.geojson';
        $temporal_shape_file = $vector_name . '.' . $vector_type;
        $temporal_shx_file = $vector_name . '.shx';
        $temporal_prj_file = $vector_name . '.prj';
        $temporal_dbf_file = $vector_name . '.dbf';
        
        $fp = fopen($temporal_geojson_file, "w+");
        fwrite($fp, $content);
        fclose($fp);

        sleep(2);
        
        shell_exec("ogr2ogr -f 'ESRI ShapeFile' $temporal_shape_file $temporal_geojson_file");
        
        sleep(2);
        
        $zipArchive = new ZipArchive();
        $zipFile = $vector_type . "/" . $vector_name . ".zip";

        if ($zipArchive->open($zipFile, ZipArchive::CREATE) !== TRUE) {

        echo json_encode(
                [
                    "success" => false
                ]
            );

            exit();

        }

        $zipArchive->addFile($temporal_shape_file);
        $zipArchive->addFile($temporal_shx_file);
        $zipArchive->addFile($temporal_prj_file);
        $zipArchive->addFile($temporal_dbf_file);
        
        $zipArchive->close();
        
        echo json_encode(
                [
                    "success" => true,
                    "zip" => $zipFile
                ]
            );

        unlink($temporal_geojson_file);
        unlink($temporal_shape_file);
        unlink($temporal_shx_file);
        unlink($temporal_prj_file);
        unlink($temporal_dbf_file);

        exit();
        
    } else if ($vector_type === 'kml') {
        
        $temporal_geojson_file = $vector_name . '.geojson';
        $temporal_kml_file = $vector_name . '.' . $vector_type;
        
        $fp = fopen($temporal_geojson_file, "w+");
        fwrite($fp, $content);
        fclose($fp);

        sleep(2);
        
        shell_exec("ogr2ogr -f 'KML' $temporal_kml_file $temporal_geojson_file");
        
        sleep(2);
        
        $zipArchive = new ZipArchive();
        $zipFile = $vector_type . "/" . $vector_name . ".zip";

        if ($zipArchive->open($zipFile, ZipArchive::CREATE) !== TRUE) {

        echo json_encode(
                [
                    "success" => false
                ]
            );

            exit();

        }

        $zipArchive->addFile($temporal_kml_file);
        
        $zipArchive->close();
        
        echo json_encode(
                [
                    "success" => true,
                    "zip" => $zipFile
                ]
            );

        unlink($temporal_geojson_file);
        unlink($temporal_kml_file);

        exit();
        
    }
    
    
} else {

    echo json_encode(
            [
                "success" => false
            ]
        );
    
    exit();
}


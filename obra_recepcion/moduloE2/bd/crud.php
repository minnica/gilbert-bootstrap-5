<?php
    
include_once '../bd/conexion.php';
$objeto = new Conexion();
$conexion = $objeto->Conectar();

$marca = (isset($_POST['marca'])) ? $_POST['marca'] : '';
$recibido = (isset($_POST['recibido'])) ? $_POST['recibido'] : '';
$peso_unitario = (isset($_POST['peso_unitario'])) ? $_POST['peso_unitario'] : '';
$fecha_recepcion = (isset($_POST['fecha_recepcion'])) ? $_POST['fecha_recepcion'] : '';
$montaje = (isset($_POST['montaje'])) ? $_POST['montaje'] : '';
$fecha_montaje = (isset($_POST['fecha_montaje'])) ? $_POST['fecha_montaje'] : '';
$status_obra = (isset($_POST['status_obra'])) ? $_POST['status_obra'] : '';

$folio = (isset($_POST['folio'])) ? $_POST['folio'] : '';
$remision = (isset($_POST['remision'])) ? $_POST['remision'] : '';
$contratista_embarques = (isset($_POST['contratista_embarques'])) ? $_POST['contratista_embarques'] : '';

$tipo_obra = (isset($_POST['tipo_obra'])) ? $_POST['tipo_obra'] : '';

$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id_tabla = (isset($_POST['id_tabla'])) ? $_POST['id_tabla'] : '';



    switch($opcion){   
        case 2:        
        $consulta = "UPDATE tabla SET recibido='$recibido', fecha_recepcion=NOW(), montaje='$montaje', fecha_montaje=NOW(), contratista_embarques='$contratista_embarques', tipo_obra='$tipo_obra' WHERE id_tabla='$id_tabla' ";        
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();        

        $consulta = "SELECT * FROM tabla WHERE id_tabla='$id_tabla' ";       
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();
        $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
        break;
        case 3:        
        $consulta = "UPDATE tabla SET recibido = '', fecha_recepcion = '', montaje = '', fecha_montaje = '', contratista_embarques = '', tipo_obra = '' WHERE id_tabla='$id_tabla' ";     
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();                           
        break;
        case 4:    
        $consulta = "SELECT * FROM tabla WHERE ota = '3299-E2' ORDER BY fecha_liberado ASC ";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();        
        $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
        break;
    }



print json_encode($data, JSON_UNESCAPED_UNICODE);//envio el array final el formato json a AJAX
$conexion=null;
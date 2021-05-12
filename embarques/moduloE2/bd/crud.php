<?php
    
include_once '../bd/conexion.php';
$objeto = new Conexion();
$conexion = $objeto->Conectar();

$marca = (isset($_POST['marca'])) ? $_POST['marca'] : '';
$enviado = (isset($_POST['enviado'])) ? $_POST['enviado'] : '';
$peso_unitario = (isset($_POST['peso_unitario'])) ? $_POST['peso_unitario'] : '';
$fecha_enviado = (isset($_POST['fecha_enviado'])) ? $_POST['fecha_enviado'] : '';
$remision = (isset($_POST['remision'])) ? $_POST['remision'] : '';

$folio = (isset($_POST['folio'])) ? $_POST['folio'] : '';
$longitud = (isset($_POST['longitud'])) ? $_POST['longitud'] : '';

$fecha_remision = (isset($_POST['fecha_remision'])) ? $_POST['fecha_remision'] : '';
$comentarios_emb = (isset($_POST['comentarios_emb'])) ? $_POST['comentarios_emb'] : '';

$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id_tabla = (isset($_POST['id_tabla'])) ? $_POST['id_tabla'] : '';



    switch($opcion){
        case 2:        
        $consulta = "UPDATE tabla SET enviado='$enviado', fecha_enviado=NOW(), remision='$remision', fecha_remision='$fecha_remision', comentarios_emb='$comentarios_emb' WHERE id_tabla='$id_tabla' ";       
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();        

        $consulta = "SELECT * FROM tabla WHERE id_tabla='$id_tabla' ";       
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();
        $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
        break;
        case 3:        
        $consulta = "UPDATE tabla SET enviado = '', fecha_enviado = '', remision = '', fecha_remision = '', comentarios_emb = '' WHERE id_tabla='$id_tabla' ";     
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();                           
        break;
        case 4:    
        $consulta = "SELECT * FROM tabla WHERE ota = '3299-E2' ORDER BY fecha_liberado ASC";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();        
        $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
        break;
    }



print json_encode($data, JSON_UNESCAPED_UNICODE);//envio el array final el formato json a AJAX
$conexion=null;
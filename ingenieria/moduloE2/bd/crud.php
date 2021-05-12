<?php
include_once '../bd/conexion.php';
$objeto = new Conexion();
$conexion = $objeto->Conectar();

$taller = (isset($_POST['taller'])) ? $_POST['taller'] : '';
$revision = (isset($_POST['revision'])) ? $_POST['revision'] : '';
$marca = (isset($_POST['marca'])) ? $_POST['marca'] : '';
$cantidad = (isset($_POST['cantidad'])) ? $_POST['cantidad'] : '';
$nombre = (isset($_POST['nombre'])) ? $_POST['nombre'] : '';
$peso_unitario = (isset($_POST['peso_unitario'])) ? $_POST['peso_unitario'] : '';
$modulo = (isset($_POST['modulo'])) ? $_POST['modulo'] : '';
$remision_ing = (isset($_POST['remision_ing'])) ? $_POST['remision_ing'] : '';
$comentarios = (isset($_POST['comentarios'])) ? $_POST['comentarios'] : '';
$liberado_ingenieria = (isset($_POST['liberado_ingenieria'])) ? $_POST['liberado_ingenieria'] : '';


$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id_tabla = (isset($_POST['id_tabla'])) ? $_POST['id_tabla'] : '';


    switch($opcion){ 
        case 2:        
        $consulta = "UPDATE tabla SET taller='$taller', revision='$revision', marca='$marca', cantidad='$cantidad', nombre='$nombre', peso_unitario='$peso_unitario', remision_ing='$remision_ing', comentarios='$comentarios', liberado_ingenieria='$liberado_ingenieria' WHERE id_tabla='$id_tabla' ";      
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();        
        
        $consulta = "SELECT id_tabla, taller, revision, marca, cantidad, nombre, peso_unitario, remision_ing, comentarios, liberado_ingenieria FROM tabla WHERE id_tabla='$id_tabla' ";       
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();
        $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
        break;
        case 3:        
        $consulta = "DELETE FROM tabla WHERE id_tabla='$id_tabla' ";        
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();                           
        break;
        case 4:    
        $consulta = "SELECT * FROM tabla WHERE ota = '3299-E2' ";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();        
        $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
        break;
        case 5:    
        $consulta = "UPDATE tabla SET cancelados='SI' WHERE id_tabla='$id_tabla'";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();        
        break;
        case 6:    
        $consulta = "UPDATE tabla SET cancelados= '' WHERE id_tabla='$id_tabla'";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();        
        break;
    }

print json_encode($data, JSON_UNESCAPED_UNICODE);//envio el array final el formato json a AJAX
$conexion=null;
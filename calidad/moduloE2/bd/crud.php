<?php
include_once '../bd/conexion.php';
$objeto = new Conexion();
$conexion = $objeto->Conectar();

$marca = (isset($_POST['marca'])) ? $_POST['marca'] : '';
$armado = (isset($_POST['armado'])) ? $_POST['armado'] : '';
$peso_unitario = (isset($_POST['peso_unitario'])) ? $_POST['peso_unitario'] : '';
$soldadura = (isset($_POST['soldadura'])) ? $_POST['soldadura'] : '';
$limpieza = (isset($_POST['limpieza'])) ? $_POST['limpieza'] : '';
$pintura = (isset($_POST['pintura'])) ? $_POST['pintura'] : '';
$fecha_calidad = (isset($_POST['fecha_calidad'])) ? $_POST['fecha_calidad'] : '';
$status_calidad = (isset($_POST['status_calidad'])) ? $_POST['status_calidad'] : '';
$laboratorio = (isset($_POST['laboratorio'])) ? $_POST['laboratorio'] : '';
$folio = (isset($_POST['folio'])) ? $_POST['folio'] : '';

$fecha_armado = (isset($_POST['fecha_armado'])) ? $_POST['fecha_armado'] : '';
$fecha_soldadura = (isset($_POST['fecha_soldadura'])) ? $_POST['fecha_soldadura'] : '';
$fecha_limpieza = (isset($_POST['fecha_limpieza'])) ? $_POST['fecha_limpieza'] : '';
$fecha_pintura = (isset($_POST['fecha_pintura'])) ? $_POST['fecha_pintura'] : '';

$pendiente_calidad = (isset($_POST['pendiente_calidad'])) ? $_POST['pendiente_calidad'] : '';

$comentarios_calidad = (isset($_POST['comentarios_calidad'])) ? $_POST['comentarios_calidad'] : '';

$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id_tabla = (isset($_POST['id_tabla'])) ? $_POST['id_tabla'] : '';

switch($opcion){ 
    case 2:
    $consulta = "UPDATE tabla SET armado='$armado', soldadura='$soldadura', limpieza='$limpieza', pintura='$pintura',laboratorio='$laboratorio', fecha_calidad=NOW(), pendiente_calidad='$pendiente_calidad' , comentarios_calidad = '$comentarios_calidad' WHERE id_tabla='$id_tabla' ";
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();      
    $consulta = "SELECT * FROM tabla WHERE id_tabla='$id_tabla' ";       
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);    
    break;
    case 3:        
    $consulta = "UPDATE tabla SET armado = '', soldadura = '', limpieza = '', pintura = '', laboratorio = '', fecha_calidad = '', fecha_armado = '', fecha_soldadura = '', fecha_limpieza = '', fecha_pintura = '', pendiente_calidad = '' , comentarios_calidad = '' WHERE id_tabla='$id_tabla' ";     
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();                           
    break;
    case 4:    
    $consulta = "SELECT id_tabla, contratista, revision, marca, consecutivo, folio, cantidad, nombre, peso_unitario, armado, soldadura, limpieza, pintura, laboratorio, taller, DATE_FORMAT(fecha_armado, '%y-%m-%d') as fecha_armado, DATE_FORMAT(fecha_soldadura, '%y-%m-%d') as fecha_soldadura, DATE_FORMAT(fecha_limpieza, '%y-%m-%d') as fecha_limpieza, DATE_FORMAT(fecha_pintura, '%y-%m-%d') as fecha_pintura, pendiente_calidad, comentarios_calidad, status_calidad, cancelados FROM tabla WHERE ota = '3299-E2' ORDER BY fecha_liberado ASC";
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();        
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
    break;
}

print json_encode($data, JSON_UNESCAPED_UNICODE);//envio el array final el formato json a AJAX
$conexion=null;
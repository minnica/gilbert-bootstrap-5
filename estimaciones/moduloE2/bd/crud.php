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
$producto_terminado = (isset($_POST['producto_terminado'])) ? $_POST['producto_terminado'] : '';
$producto_suministrado = (isset($_POST['producto_suministrado'])) ? $_POST['producto_suministrado'] : '';
$producto_montado = (isset($_POST['producto_montado'])) ? $_POST['producto_montado'] : '';
$ept = (isset($_POST['ept'])) ? $_POST['ept'] : '';
$ept_fecha = (isset($_POST['ept_fecha'])) ? $_POST['ept_fecha'] : '';
$eps = (isset($_POST['eps'])) ? $_POST['eps'] : '';
$eps_fecha = (isset($_POST['eps_fecha'])) ? $_POST['eps_fecha'] : '';
$epm = (isset($_POST['epm'])) ? $_POST['epm'] : '';
$epm_fecha = (isset($_POST['epm_fecha'])) ? $_POST['epm_fecha'] : '';

$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id_tabla = (isset($_POST['id_tabla'])) ? $_POST['id_tabla'] : '';


switch($opcion){ 
    case 2:        
    $consulta = "UPDATE tabla SET ept='$ept', ept_fecha='$ept_fecha', eps='$eps', eps_fecha='$eps_fecha', epm='$epm', epm_fecha='$epm_fecha' WHERE id_tabla='$id_tabla'";      
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();        

    $consulta = "SELECT id_tabla, taller, revision, marca, cantidad, nombre, peso_unitario, producto_terminado, producto_suministrado,producto_montado,ept, ept_fecha, eps, eps_fecha, epm, epm_fecha FROM tabla WHERE id_tabla='$id_tabla' ";       
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
    break;
    case 3:        
    $consulta = "UPDATE tabla SET ept='', ept_fecha='', eps='', eps_fecha='', epm='', epm_fecha='' WHERE id_tabla='$id_tabla' ";        
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();                           
    break;
    case 4:    
    $consulta = "SELECT * FROM tabla WHERE ota = '3299-E2' ";
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();        
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
    break;
  
}

print json_encode($data, JSON_UNESCAPED_UNICODE);//envio el array final el formato json a AJAX
$conexion=null;
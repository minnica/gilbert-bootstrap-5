<?php

include_once '../bd/conexion.php';
$objeto = new Conexion();
$conexion = $objeto->Conectar();

$ota = (isset($_POST['ota'])) ? $_POST['ota'] : '';
$nom_pro = (isset($_POST['nom_pro'])) ? $_POST['nom_pro'] : '';
$direccion = (isset($_POST['direccion'])) ? $_POST['direccion'] : '';
$cliente = (isset($_POST['cliente'])) ? $_POST['cliente'] : '';
$peso_presupuestado = (isset($_POST['peso_presupuestado'])) ? $_POST['peso_presupuestado'] : '';
$enviado_presupuestos = (isset($_POST['enviado_presupuestos'])) ? $_POST['enviado_presupuestos'] : '';
$fechaenvio_presupuestos = (isset($_POST['fechaenvio_presupuestos'])) ? $_POST['fechaenvio_presupuestos'] : '';
$aceptado = (isset($_POST['aceptado'])) ? $_POST['aceptado'] : '';
$fecha_aceptado = (isset($_POST['fecha_aceptado'])) ? $_POST['fecha_aceptado'] : '';
$status_presupuestos = (isset($_POST['status_presupuestos'])) ? $_POST['status_presupuestos'] : '';

$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id_proyectos = (isset($_POST['id_proyectos'])) ? $_POST['id_proyectos'] : '';

switch($opcion){
    case 1:
    $consulta = "INSERT INTO proyectos (ota, nom_pro, direccion, cliente, peso_presupuestado,enviado_presupuestos,fechaenvio_presupuestos,aceptado,fecha_aceptado) VALUES('$ota', '$nom_pro', '$direccion', '$cliente', '$peso_presupuestado','$enviado_presupuestos','$fechaenvio_presupuestos', '$aceptado','$fecha_aceptado')";            
    $resultado = $conexion->prepare($consulta);
    $resultado->execute(); 
    
    $consulta = "SELECT id_proyectos, ota, nom_pro, direccion, cliente, peso_presupuestado, enviado_presupuestos,fechaenvio_presupuestos, aceptado, fecha_aceptado FROM proyectos ORDER BY id_proyectos DESC LIMIT 1";
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);       
    break;    
    case 2:        
    $consulta = "UPDATE proyectos SET ota='$ota', nom_pro='$nom_pro', direccion='$direccion', cliente='$cliente', peso_presupuestado='$peso_presupuestado', enviado_presupuestos='$enviado_presupuestos', fechaenvio_presupuestos='$fechaenvio_presupuestos', aceptado='$aceptado', fecha_aceptado='$fecha_aceptado' WHERE id_proyectos='$id_proyectos' ";      
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();        
    
    $consulta = "SELECT id_proyectos, ota, nom_pro, direccion, cliente, peso_presupuestado, enviado_presupuestos, fechaenvio_presupuestos, aceptado, fecha_aceptado FROM proyectos WHERE id_proyectos='$id_proyectos' ";       
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
    break;
    case 3:        
    $consulta = "DELETE FROM proyectos WHERE id_proyectos='$id_proyectos' ";        
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();                           
    break;
    case 4:    
    $consulta = "SELECT * FROM proyectos";
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();        
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
    break;
}

print json_encode($data, JSON_UNESCAPED_UNICODE);//envio el array final el formato json a AJAX
$conexion=null;
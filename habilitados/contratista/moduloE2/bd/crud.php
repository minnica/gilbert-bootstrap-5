<?php
include_once '../bd/conexion.php';
$objeto = new Conexion();
$conexion = $objeto->Conectar();

$ota = (isset($_POST['ota'])) ? $_POST['ota'] : '';
$id_ensamble = (isset($_POST['id_ensamble'])) ? $_POST['id_ensamble'] : '';
$ensamble = (isset($_POST['ensamble'])) ? $_POST['ensamble'] : '';
$num_ensamble = (isset($_POST['num_ensamble'])) ? $_POST['num_ensamble'] : '';
$marca = (isset($_POST['marca'])) ? $_POST['marca'] : '';
$colada = (isset($_POST['colada'])) ? $_POST['colada'] : '';
$tipo = (isset($_POST['tipo'])) ? $_POST['tipo'] : '';
$cantidad = (isset($_POST['cantidad'])) ? $_POST['cantidad'] : '';
$perfil = (isset($_POST['perfil'])) ? $_POST['perfil'] : '';
$espesor = (isset($_POST['espesor'])) ? $_POST['espesor'] : '';
$largo = (isset($_POST['largo'])) ? $_POST['largo'] : '';
$ancho = (isset($_POST['ancho'])) ? $_POST['ancho'] : '';
$peso = (isset($_POST['peso'])) ? $_POST['peso'] : '';
$fecha_captura = (isset($_POST['fecha_captura'])) ? $_POST['fecha_captura'] : '';




$cortado = (isset($_POST['cortado'])) ? $_POST['cortado'] : '';
$fecha_corte = (isset($_POST['fecha_corte'])) ? $_POST['fecha_corte'] : '';
$entregado = (isset($_POST['entregado'])) ? $_POST['entregado'] : '';
$ensamble = (isset($_POST['ensamble'])) ? $_POST['ensamble'] : '';
$fecha_entrega = (isset($_POST['fecha_entrega'])) ? $_POST['fecha_entrega'] : '';


$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id_habilitados = (isset($_POST['id_habilitados'])) ? $_POST['id_habilitados'] : '';

switch($opcion){
    case 1:
    $consulta = "INSERT INTO habilitados (cortado, fecha_corte, entregado,  fecha_entrega) VALUES('$cortado','$fecha_corte','$entregado','$fecha_entrega')";
    $resultado = $conexion->prepare($consulta);
    $resultado->execute(); 

    $consulta = "SELECT * FROM habilitados ORDER BY id_habilitados DESC LIMIT 1";
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);       
    break;    
    case 2:        
    $consulta = "UPDATE habilitados SET cortado='$cortado', fecha_corte='$fecha_corte', entregado='$entregado', fecha_entrega='$fecha_entrega' WHERE id_habilitados='$id_habilitados' ";      
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();        

    $consulta = "SELECT * FROM habilitados WHERE id_habilitados='$id_habilitados' ";       
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
    break;
    case 3:        
    $consulta = "UPDATE habilitados SET cortado='', fecha_corte='', entregado='', fecha_entrega='' WHERE id_habilitados='$id_habilitados' ";        
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();                           
    break;
    case 4:    
    $consulta = "SELECT * FROM habilitados";
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();        
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
    break;
}

print json_encode($data, JSON_UNESCAPED_UNICODE);//envio el array final el formato json a AJAX
$conexion=null;
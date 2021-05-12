<?php
include_once '../bd/conexion.php';
$objeto = new Conexion();
$conexion = $objeto->Conectar();


$id_habilitados = (isset($_POST['id_habilitados'])) ? $_POST['id_habilitados'] : '';
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



$revision_corte = (isset($_POST['revision_corte'])) ? $_POST['revision_corte'] : '';
$fecha_revision_corte = (isset($_POST['fecha_revision_corte'])) ? $_POST['fecha_revision_corte'] : '';
$status = (isset($_POST['status'])) ? $_POST['status'] : '';
$comentarios = (isset($_POST['comentarios'])) ? $_POST['comentarios'] : '';
$revision_entrega = (isset($_POST['revision_entrega'])) ? $_POST['revision_entrega'] : '';
$fecha_revision_entrega = (isset($_POST['fecha_revision_entrega'])) ? $_POST['fecha_revision_entrega'] : '';


$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';

switch($opcion){
    case 2:        
    $consulta = "UPDATE habilitados SET revision_corte='$revision_corte', fecha_revision_corte='$fecha_revision_corte', status='$status', fecha_status = NOW(), comentarios='$comentarios', revision_entrega='$revision_entrega', fecha_revision_entrega='$fecha_revision_entrega' WHERE id_habilitados='$id_habilitados' ";      
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();        


    $consulta2 = "INSERT INTO historial (id_habilitados, status, fecha_status, comentarios) VALUES ('$id_habilitados', '$status', NOW(), '$comentarios')";
    $resultado2 = $conexion->prepare($consulta2);
    $resultado2->execute();  


    $consulta = "SELECT * FROM habilitados WHERE id_habilitados='$id_habilitados' ";       
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
    break;
    case 3:        
    $consulta = "UPDATE habilitados SET revision_corte='', fecha_revision_corte='', status='', fecha_status = '', comentarios='', revision_entrega='', fecha_revision_entrega='' WHERE id_habilitados='$id_habilitados' ";        
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
<?php
include_once '../bd/conexion.php';
$objeto = new Conexion();
$conexion = $objeto->Conectar();

$pagado = (isset($_POST['pagado'])) ? $_POST['pagado'] : '';
$fecha_pagado = (isset($_POST['fecha_pagado'])) ? $_POST['fecha_pagado'] : '';

$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id_habilitados = (isset($_POST['id_habilitados'])) ? $_POST['id_habilitados'] : '';

switch($opcion){
    case 1:
    $consulta = "INSERT INTO habilitados (pagado, fecha_pagado) VALUES('$pagado','$fecha_pagado')";            
    $resultado = $conexion->prepare($consulta);
    $resultado->execute(); 

    $consulta = "SELECT * FROM habilitados ORDER BY id_habilitados DESC LIMIT 1";
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);       
    break;    
    case 2:        
    $consulta = "UPDATE habilitados SET pagado='$pagado', fecha_pagado='$fecha_pagado' WHERE id_habilitados='$id_habilitados' ";      
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();        

    $consulta = "SELECT * FROM habilitados WHERE id_habilitados='$id_habilitados' ";       
    $resultado = $conexion->prepare($consulta);
    $resultado->execute();
    $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
    break;
    case 3:        
    $consulta = "UPDATE habilitados SET pagado='', fecha_pagado='' WHERE id_habilitados='$id_habilitados' ";        
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
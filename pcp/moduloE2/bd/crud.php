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
$liberado = (isset($_POST['liberado'])) ? $_POST['liberado'] : '';
$fecha_liberado = (isset($_POST['fecha_liberado'])) ? $_POST['fecha_liberado'] : '';
$fecha_termino_programada = (isset($_POST['fecha_termino_programada'])) ? $_POST['fecha_termino_programada'] : '';
$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$id_tabla = (isset($_POST['id_tabla'])) ? $_POST['id_tabla'] : '';

switch($opcion){   
        case 2:        
        $consulta = "UPDATE tabla SET taller='$taller', liberado='$liberado', fecha_liberado= NOW(), fecha_termino_programada='$fecha_termino_programada' WHERE id_tabla='$id_tabla' ";     
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();        

        $consulta = "SELECT * FROM tabla WHERE id_tabla='$id_tabla' ";       
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();
        $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
        break;
        case 3:        
        $consulta = "UPDATE tabla SET liberado = '', fecha_liberado = '', fecha_termino_programada = '' WHERE id_tabla='$id_tabla' ";      
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();                           
        break;
        case 4:    
        $consulta = "SELECT * FROM tabla WHERE ota = '3299-E2' ORDER BY fecha_liberado DESC";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();        
        $data=$resultado->fetchAll(PDO::FETCH_ASSOC);
        break;
    }

print json_encode($data, JSON_UNESCAPED_UNICODE);
$conexion=null;
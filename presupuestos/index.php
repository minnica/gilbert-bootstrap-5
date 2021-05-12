<?php  
$conexion=mysqli_connect('localhost','root','','gilbert');
?>
<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!--admin -->
	<link href="css/app.css" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
	<!-- Bootstrap 5 CSS -->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
	<!-- Datatables CSS -->
	<link rel="stylesheet" href="https://cdn.datatables.net/1.10.24/css/dataTables.bootstrap5.min.css">
	<!-- Font Awesome -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
	<!-- CSS personalizado -->
	<link rel="stylesheet" href="style.css">
	<title>Presupuestos</title>
</head>
<body class="bg-light">
	<div class="wrapper">		
		<?php include 'nav.html'; ?>
		<div class="main bg-light">
			<nav class="navbar navbar-expand-lg navbar-light bg-light shadow-none">
				<a class="sidebar-toggle d-flex">
					<i class="hamburger align-self-center"></i>
				</a>
				<form class="d-none d-sm-inline-block">
					<div class="input-group input-group-navbar">						
						MENÚ
					</div>
				</form>
			</nav>
			<div class="container-fluid">	
				<header align="center">
					<h4>PRESUPUESTOS</h4> 
				</header>
				<div class="container">		
					<div class="row d-flex justify-content-center">
						<div class="col-xl-4 col-md-6 mb-4">
							<div class="card border-left-primary shadow h-60 bg-light">
								<div class="card-body">
									<div class="row no-gutters align-items-center">
										<div class="col mr-2">
											<div class="text-xs fw-bold text-primary text-uppercase mb-1 text-center">PROYECTOS TOTALES</div>
											<?php
											$sql="SELECT COUNT('nom_pro')as proyectos_totales FROM proyectos";
											$result=mysqli_query($conexion,$sql);
											while($mostrar=mysqli_fetch_array($result)){
												?>
												<div class="h5 mb-0 fw-bold text-gray-800 text-center"><?php echo $mostrar['proyectos_totales'] ?> </div>
											<?php } ?>
										</div>
										<div class="col-auto">
											<i class="fas fa-weight fa-3x"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-md-6 mb-4">
							<div class="card border-left-success shadow h-60 bg-light">
								<div class="card-body">
									<div class="row no-gutters align-items-center">
										<div class="col mr-2">
											<div class="text-xs fw-bold text-success text-uppercase mb-1 text-center">PROYECTOS ACTIVOS</div>
											<?php
											$sql2="SELECT COUNT('nom_pro')as proyectos_activos FROM `proyectos`WHERE status_presupuestos = 'ACEPTADO' ";          
											$result2=mysqli_query($conexion,$sql2);
											while($mostrar2=mysqli_fetch_array($result2)){
												?>
												<div class="h5 mb-0 fw-bold text-gray-800 text-center"><?php echo $mostrar2['proyectos_activos'] ?> </div>
											<?php } ?>
										</div>
										<div class="col-auto">
											<i class="fas fa-truck-loading fa-3x"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style="text-align: center" class="container mb-3">
					<button id="btnNuevo" type="button" class="btn btn-outline-dark" data-toggle="modal">Agregar</button>   
				</div> 	
				<center>
					<p id="table-filter">
						Filtrar: 
						<select id="color_me" class="btn btn-dark">
							<option class="btn btn-dark" value="">TODO</option>
							<option class="btn terminado" value="ACEPTADO">ACEPTADO</option>  
							<option class="btn pendiente text-white" value="PENDIENTE">PENDIENTE</option>
							<option class="btn proceso text-dark" value="ENVIADO">ENVIADO</option>            
							<option class="btn cancelado text-white" value="RECHAZADO">NO ACEPTADO</option>
						</select>
					</p>
				</center>
				<div class="container-fluid table-responsive">
					<table id="tablaUsuarios" class="table table-sm table-striped table-bordered" style="width:100%">
						<thead>
							<tr class="table-dark">
								<th>#</th>
								<th>OTA</th>
								<th>PROYECTO</th>
								<th>DIRECCION</th>
								<th>CLIENTE</th>
								<th>PESO PRE</th>   
								<th>ENVIADO</th>
								<th>F.ENV</th>
								<th>ACEPTADO</th>
								<th>F.ACEP</th>
								<th>STATUS</th>
								<th>ACCIONES</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
						<tfoot>
							<tr>
								<td></td> 
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</tfoot>
					</table>
				</div>
				<div class="modal fade" id="modalCRUD" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="exampleModalLabel"></h5>
								<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<form id="formUsuarios">    
								<div class="modal-body">
									<div class="row">
										<div class="col-lg-6">
											<div class="form-group">
												<label for="" class="col-form-label">OTA:</label>
												<input type="text" class="form-control" id="ota" name="ota">        
											</div>
										</div>
										<div class="col-lg-6">
											<div class="form-group">
												<label for="" class="col-form-label">PROYECTO:</label>
												<input type="text" class="form-control" id="nom_pro" name="nom_pro">
											</div> 
										</div>
									</div>
									<div class="row">
										<div class="col-lg-6">
											<div class="form-group">                    
												<label for="" class="col-form-label">DIRECCIÓN:</label>
												<input type="text" class="form-control" id="direccion" name="direccion">
											</div> 
										</div>    
										<div class="col-lg-6">
											<div class="form-group">
												<label for="" class="col-form-label">CLIENTE:</label>
												<input type="text" class="form-control" id="cliente" name="cliente">                    
											</div>               
										</div> 
									</div>
									<div class="row">
										<div class="col-lg-6">
											<div class="form-group">
												<label for="" class="col-form-label">PESO:</label>
												<input type="text" class="form-control" id="peso_presupuestado" name="peso_presupuestado">
											</div>               
										</div> 
										<div class="col-lg-6">
											<div class="form-group">
												<label for="" class="col-form-label">ENVIADO:</label>   
												<select name="enviado_presupuestos" id="enviado_presupuestos" class="form-select">
													<option value=""></option>
													<option value="NO">NO</option>
													<option value="SI">SÍ</option>
												</select>               
											</div>               
										</div> 
									</div>
									<div class="row">
										<div class="col-lg-6">
											<div class="form-group">
												<label for="" class="col-form-label">FECHA ENVIADO:</label>
												<input type="date" class="form-control" id="fechaenvio_presupuestos" name="fechaenvio_presupuestos">
											</div>               
										</div> 
										<div class="col-lg-6">
											<div class="form-group">
												<label for="" class="col-form-label">ACEPTADO:</label>
												<select name="aceptado" id="aceptado" class="form-select">
													<option value=""></option>
													<option value="NO">NO</option>
													<option value="SI">SÍ</option>
												</select>                 
											</div>               
										</div>
									</div> 
									<div class="row">
										<div class="col-lg-6">
											<div class="form-group">
												<label for="" class="col-form-label">FECHA ACEPTADO:</label>
												<input type="date" class="form-control" id="fecha_aceptado" name="fecha_aceptado">                    
											</div>               
										</div> 
									</div>						
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
									<button type="submit" id="btnGuardar" class="btn btn-dark">Guardar</button>
								</div>
							</form>    
						</div>
					</div>
				</div>				
			</div>
		</div>
	</div>
	<!-- Bootstrap 5 js -->
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossorigin="anonymous"></script>
	<!-- Datatables js -->
	<script src="https://code.jquery.com/jquery-3.5.1.js"></script>
	<script src="https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js"></script>
	<script src="https://cdn.datatables.net/1.10.24/js/dataTables.bootstrap5.min.js"></script> 
	<!-- scripts para botones de exportar datos -->
	<script src="https://cdn.datatables.net/buttons/1.6.5/js/dataTables.buttons.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
	<script src="https://cdn.datatables.net/buttons/1.6.5/js/buttons.html5.min.js"></script>
	<script src="https://cdn.datatables.net/buttons/1.6.5/js/buttons.print.min.js"></script>
	<!-- Main -->
	<script src="main.js"></script>
</body>
</html>
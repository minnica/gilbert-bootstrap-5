<?php   
$conexion=mysqli_connect('localhost','root','','gilbertm_prueba');
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
	<style>
		.excel {
			position: absolute !important;
		}
		.terminado {
			background-color: #00E700;
		}
		.pendiente {
			background-color: #FF0000;
		}
		.proceso {
			background-color: #FFFF00;
		}
		.todo{
			background-color: white;
		}
	</style>
	<title>ESTIMACIONES</title>
</head>
<body class="bg-light">
	<div class="wrapper">		
		
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
					<h4>ESTIMACIONES</h4>
					<div class="row d-flex justify-content-center">
						<div class="col-md-3">
							<h5 ><kbd>OTA</kbd>: 3299-E2</h5>
						</div>
						<div class="col-md-3">
							<h5><kbd>PROYECTO</kbd>: MÓDULO E2</h5>
						</div>
					</div>  
				</header>
				<div class="container">
					<div class="row">
						<div class="col-xl-3 col-md-6 mb-4">
							<div class="card border-left-primary shadow h-60 bg-light">
								<div class="card-body">
									<div class="row no-gutters align-items-center">
										<div class="col mr-2">
											<div class="text-xs fw-bold text-primary text-uppercase mb-1">PESO T. TERMINADO</div>
											<?php
											$sql="SELECT FORMAT(SUM(peso_unitario),2) as peso_total from tabla WHERE ota LIKE '%E2%' AND cancelados is null";
											$result=mysqli_query($conexion,$sql);
											while($mostrar=mysqli_fetch_array($result)){
												?>
												<div class="h5 mb-0 fw-bold text-gray-800"><?php echo $mostrar['peso_total'] ?> Kg.</div>
											<?php } ?>
										</div>
										<div class="col-auto">
											<i class="fas fa-weight fa-3x"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-3 col-md-6 mb-4">
							<div class="card border-left-warning shadow h-60 bg-light">
								<div class="card-body">
									<div class="row no-gutters align-items-center">
										<div class="col mr-2">
											<div class="text-xs fw-bold text-warning text-uppercase mb-1">PESO T. SUMINISTRADO</div>
											<?php
											$sql="SELECT FORMAT(SUM(peso_unitario),2) as peso_total from tabla WHERE ota LIKE '%E2%' AND cancelados is null";
											$result=mysqli_query($conexion,$sql);
											while($mostrar=mysqli_fetch_array($result)){
												?>
												<div class="h5 mb-0 fw-bold text-gray-800"><?php echo $mostrar['peso_total'] ?> Kg.</div>
											<?php } ?>
										</div>
										<div class="col-auto">
											<i class="fas fa-truck-loading fa-3x"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-3 col-md-6 mb-4">
							<div class="card border-left-success shadow h-60 bg-light">
								<div class="card-body">
									<div class="row no-gutters align-items-center">
										<div class="col mr-2">
											<div class="text-xs fw-bold text-success text-uppercase mb-1">PESO T. MONTADO</div>
											<?php
											$sql2="SELECT FORMAT(SUM(peso_unitario),2) as peso_liberado from tabla WHERE liberado='SI' AND ota LIKE '%E2%' AND cancelados is null";          
											$result2=mysqli_query($conexion,$sql2);
											while($mostrar2=mysqli_fetch_array($result2)){
												?>
												<div class="h5 mb-0 fw-bold text-gray-800"><?php echo $mostrar2['peso_liberado'] ?> Kg.</div>
											<?php } ?>
										</div>
										<div class="col-auto">
											<i class="fas fa-dolly-flatbed fa-3x"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-3 col-md-6 mb-4">
							<div class="card border-left-info shadow h-60 bg-light">
								<div class="card-body">
									<div class="row no-gutters align-items-center">
										<div class="col mr-2">
											<div class="text-xs fw-bold text-info text-uppercase mb-1">PORCENTAJE</div>
											<div class="row no-gutters align-items-center">
												<div class="col-auto">
													<?php                                
													$sql3="SELECT FORMAT(SUM(peso_unitario)/(SELECT SUM(peso_unitario) FROM tabla WHERE ota LIKE '%E2%' AND cancelados is null)*100,2) AS PORCENTAJE FROM tabla WHERE ota LIKE '%E2%' AND liberado='SI' AND cancelados is null";                                    
													$result3=mysqli_query($conexion,$sql3);
													while($mostrar3=mysqli_fetch_array($result3)){
														?>
														<div class="h5 mb-0 mr-3 fw-bold text-gray-800"><?php echo $mostrar3['PORCENTAJE'] ?>%</div>
													<?php } ?>
												</div>
												<div class="col">
													<div class="progress progress-sm mr-2">
														<?php 
														$sql3="SELECT FORMAT(SUM(peso_unitario)/(SELECT SUM(peso_unitario) FROM tabla WHERE ota LIKE '%E2%' AND cancelados is null)*100,2) AS PORCENTAJE FROM tabla WHERE ota LIKE '%E2%' AND liberado='SI' AND cancelados is null";                                    
														$result3=mysqli_query($conexion,$sql3);
														while($mostrar3=mysqli_fetch_array($result3)){
															?>
															<div class="progress-bar bg-info" role="progressbar" style="width:<?php echo $mostrar3['PORCENTAJE'] ?>%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
														<?php } ?>
													</div>
												</div>
											</div>
										</div>
										<div class="col-auto">
											<i class="fas fa-percentage fa-3x"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>	
				<center><p id="table-filter">
					Filtrar: 
					<select id="color_me" class="btn btn-dark">
						<option class="btn btn-dark" value="">TODO</option>
						<option class="btn pendiente text-white" value="PENDIENTE">EPT</option>   
						<option class="btn proceso" value="PROCESO">EPS</option>           
						<option class="btn terminado" value="TERMINADO">EPM</option>                
						<option class="btn btn-light" value="INDEFINIDO">PENDIENTE</option> 
						<option class="btn cancelado text-white" value="CANCELADO">CANCELADO</option>         
					</select>
				</p>
			</center>
			<div class="container-fluid table-responsive">
				<table id="tablaUsuarios" class="table table-sm table-striped table-bordered" style="width:100%">
					<thead>
						<tr class="table-dark">
							<th>#</th>
							<th>TALLER</th>
							<th>REVISIÓN</th>
							<th>MARCA</th>
							<th>CANTIDAD</th>
							<th>NOMBRE</th>
							<th>PESO UNITARIO</th>
							<th>PRO.T</th>
							<th>PRO.S</th>
							<th>PRO.M</th>
							<th>EPT</th>
							<th>EPT FECH</th>
							<th>EPS</th>
							<th>EPS FECH</th>
							<th>EPM</th>
							<th>EPM FECH</th>
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
							<h5 class="modal-title text-white" id="exampleModalLabel">
								<i class="nav-icon fas fa-file-invoice-dollar" style="color:#8CC01E"></i>
								ESTIMACIONES
							</h5>
							<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<form id="formUsuarios">    
							<div class="modal-body">
								<div class="row">
									<div class="col-lg-6">
										<div class="form-group">
											<label for="id_tabla" class="col-form-label">ID:</label>
											<input type="text" class="form-control" id="id_tabla" disabled="">        
										</div>
									</div>
								
								</div>
								<div class="row">
									<div class="col-lg-6">
										<div class="form-group">                    
											<label for="" class="col-form-label">EPT:</label>
											<input type="text" class="form-control" id="ept">
										</div> 
									</div>    
									<div class="col-lg-6">
										<div class="form-group">
											<label for="" class="col-form-label">FECHA EPT:</label>
											<input type="date" class="form-control" id="ept_fecha">                    
										</div>               
									</div> 
								</div>
								<div class="row">
									<div class="col-lg-6">
										<div class="form-group">
											<label for="" class="col-form-label">EPS:</label>
											<input type="text" class="form-control" id="eps">
										</div>               
									</div> 
									<div class="col-lg-6">
										<div class="form-group">
											<label for="" class="col-form-label">FECHA EPS:</label>
											<input type="date" class="form-control" id="eps_fecha">
										</div>               
									</div>
								</div>
								<div class="row">
									<div class="col-lg-6">
										<div class="form-group">
											<label for="" class="col-form-label">EPM:</label>
											<input type="text" class="form-control" id="epm">
										</div>               
									</div> 
									<div class="col-lg-6">
										<div class="form-group">
											<label for="" class="col-form-label">FECHA EPM:</label>
											<input type="date" class="form-control" id="epm_fecha">
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
$(document).ready(function() {
    var id_tabla, opcion;
    opcion = 4;
    tablaUsuarios = $('#tablaUsuarios').DataTable({
        createdRow: function(row, data) {
            if (data["status_estimaciones"] == 'TERMINADO') {
                $("td", row).closest('tr').css('background-color', '#00E700');
                $("td", row).closest('tr').css('color', 'black');
            } else if (data["status_estimaciones"] == 'PENDIENTE') {
                $("td", row).closest('tr').css('background-color', '#FF0000');
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').find('button').css('color', 'white');
            } else if (data["status_estimaciones"] == 'CANCELADO') {
                $("td", row).closest('tr').css('background-color', '#0000FF');
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').css('text-decoration', 'line-through');
                $("td", row).closest('tr').find('button').css('color', 'white');
                $("td", row).closest('tr').find('button').prop("disabled", true);
            } else if (data["status_estimaciones"] == 'PROCESO') {
                $("td", row).closest('tr').css('background-color', '#FFFF00');
                $("td", row).closest('tr').css('color', 'black');
            }
            else if (data['status_ingenieria']==='CANCELADO') {
                $("td", row).closest('tr').css('background-color', '#0000FF'); //AZUL
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').css('text-decoration', 'line-through');
                $("td", row).closest('tr').find('button').css('color', 'white');
            }
        },
        //filtro de busqueda sobre una columna
        initComplete: function(settings) {
            var api = new $.fn.dataTable.Api(settings);
            $('#table-filter select').on('change', function() {
                table
                .columns(16)
                .search(this.value)
                .draw();
            });
        },
        //bonotes exportar
        responsive: "true",
        dom: 'Bfrtilp',
        buttons: [{
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel"></i> ',
            titleAttr: 'Exportar a Excel',
            className: 'btn btn-success excel',
            exportOptions: {
                columns: [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
            }
        }],
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sSearch": "Busqueda general:",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "sProcessing": "Procesando...",
        },
        "ajax": {
            "url": "bd/crud.php",
            "method": 'POST',
            "data": {
                opcion: opcion
            },
            "dataSrc": ""
        },
        "columns": [{
            "data": "id_tabla"
        }, {
            "data": "taller"
        }, {
            "data": "revision"
        }, {
            "data": "marca"
        }, {
            "data": "cantidad"
        }, {
            "data": "nombre"
        }, {
            "data": "peso_unitario"
        }, {
            "data": "producto_terminado"
        }, {
            "data": "producto_suministrado"
        }, {
            "data": "producto_montado"
        }, {
            "data": "ept"
        }, {
            "data": "ept_fecha"
        }, {
            "data": "eps"
        }, {
            "data": "eps_fecha"
        }, {
            "data": "epm"
        }, {
            "data": "epm_fecha"
        }, {
            "data": "status_estimaciones"
        }, {
            "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-outline-dark btn-sm btnEditar'>Editar</button><button class='btn btn-outline-dark btn-sm btnBorrar'>Borrar</button></div></div>"
        }],
        "columnDefs": [{
            "targets": [16],
            "visible": false
        }]
    });
var fila;
$('#formUsuarios').submit(function(e) {
    e.preventDefault();
    taller = $.trim($('#taller').val());
    revision = $.trim($('#revision').val());
    marca = $.trim($('#marca').val());
    cantidad = $.trim($('#cantidad').val());
    nombre = $.trim($('#nombre').val());
    peso_unitario = $.trim($('#peso_unitario').val());
    producto_terminado = $.trim($('#producto_terminado').val());
    producto_suministrado = $.trim($('#producto_suministrado').val());
    producto_montado = $.trim($('#producto_montado').val());
    ept = $.trim($('#ept').val());
    ept_fecha = $.trim($('#ept_fecha').val());
    eps = $.trim($('#eps').val());
    eps_fecha = $.trim($('#eps_fecha').val());
    epm = $.trim($('#epm').val());
    epm_fecha = $.trim($('#epm_fecha').val());


    $.ajax({
        url: "bd/crud.php",
        type: "POST",
        datatype: "json",
        data: {
           id_tabla: id_tabla,
           taller: taller,
           revision: revision,
           marca: marca,
           cantidad: cantidad,
           nombre: nombre,
           peso_unitario: peso_unitario,
           producto_terminado: producto_terminado,
           producto_suministrado: producto_suministrado,
           producto_montado : producto_montado,
           ept : ept,
           ept_fecha : ept_fecha,
           eps : eps,
           eps_fecha : eps_fecha,
           epm : epm,
           epm_fecha : epm_fecha,
           opcion: opcion
       },
       success: function(data) {
        tablaUsuarios.ajax.reload(null, false);
    }
});
    $('#modalCRUD').modal('hide');
});
$("#btnNuevo").click(function() {
        opcion = 1; //alta           
        id_tabla = null;
        $("#formUsuarios").trigger("reset");
        $(".modal-header").addClass("bg-dark text-white");
        $('#modalCRUD').modal('show');
    });
$(document).on("click", ".btnEditar", function() {
    opcion = 2;
    fila = $(this).closest("tr");
    id_tabla = parseInt(fila.find('td:eq(0)').text());
    taller = fila.find('td:eq(1)').text();
    revision = fila.find('td:eq(2)').text();
    marca = fila.find('td:eq(3)').text();
    cantidad = fila.find('td:eq(4)').text();
    nombre = fila.find('td:eq(5)').text();
    peso_unitario = fila.find('td:eq(6)').text();
    producto_terminado = fila.find('td:eq(7)').text();
    producto_suministrado = fila.find('td:eq(8)').text();
    producto_montado = fila.find('td:eq(9)').text();
    ept = fila.find('td:eq(10)').text();
    ept_fecha = fila.find('td:eq(11)').text();
    eps = fila.find('td:eq(12)').text();
    eps_fecha = fila.find('td:eq(13)').text();
    epm = fila.find('td:eq(14)').text();
    epm_fecha = fila.find('td:eq(15)').text();



    $("#taller").val(taller);
    $("#revision").val(revision);
    $("#marca").val(marca);
    $("#cantidad").val(cantidad);
    $("#nombre").val(nombre);
    $("#peso_unitario").val(peso_unitario);
    $("#producto_terminado").val(producto_terminado);
    $("#producto_suministrado").val(producto_suministrado);
    $("#producto_montado").val(producto_montado);
    $("#ept").val(ept);
    $("#ept_fecha").val(ept_fecha);
    $("#eps").val(eps);
    $("#eps_fecha").val(eps_fecha);
    $("#epm").val(epm);
    $("#epm_fecha").val(epm_fecha);

    $(".modal-header").addClass("bg-dark text-white");
    $('#modalCRUD').modal('show');
});
$(document).on("click", ".btnBorrar", function() {
    fila = $(this);
    id_tabla = parseInt($(this).closest('tr').find('td:eq(0)').text());
    opcion = 3;
    var respuesta = confirm("¿Está seguro de borrar el registro " + id_tabla + "?");
    if (respuesta) {
        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            datatype: "json",
            data: {
                opcion: opcion,
                id_tabla: id_tabla
            },
            success: function() {
                tablaUsuarios.ajax.reload(null, false);
            }
        });
    }
});

$(document).on("click", "#btnCancelar", function() {
    fila = $(this);
    id_tabla = parseInt($(this).closest('tr').find('td:eq(0)').text());
    opcion = 6;
    var respuesta = confirm("¿Está seguro de HABILITAR el registro " + id_tabla + "?");
    if (respuesta) {
        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            datatype: "json",
            data: {
                opcion: opcion,
                id_tabla: id_tabla
            },
            success: function() {
                tablaUsuarios.ajax.reload(null, false);
            }
        });
    }
});

$(document).on("click", "#btnHabilitar", function() {
    fila = $(this);
    id_tabla = parseInt($(this).closest('tr').find('td:eq(0)').text());
    opcion = 5;
    var respuesta = confirm("¿Está seguro de CANCELAR el registro " + id_tabla + "?");
    if (respuesta) {
        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            datatype: "json",
            data: {
                opcion: opcion,
                id_tabla: id_tabla
            },
            success: function() {
                tablaUsuarios.ajax.reload(null, false);
            }
        });
    }
});
    //filtros encabezado
    var table = $('#tablaUsuarios').DataTable();
    $('#tablaUsuarios tfoot td').each(function() {
        var title = $(this).text();
        $(this).html('<input type="text" class="form-control form-control-sm bg-light" style="width:100%;" placeholder="Buscar"/>');
    });
    table.columns().every(function() {
        var that = this;
        $('input', this.footer()).on('keyup change', function() {
            if (that.search() !== this.value) {
                that.search(this.value).draw();
            }
        });
    });
    $('#tablaUsuarios tfoot tr').appendTo('#tablaUsuarios thead');
    //cambiar select a colores
    $("#color_me").change(function() {
        var color = $("option:selected", this).attr("class");
        $("#color_me").attr("class", color);
    });
});
$(document).ready(function() {
    var id_tabla, opcion;
    opcion = 4;
    tablaUsuarios = $('#tablaUsuarios').DataTable({
        createdRow: function(row, data) {
            if (data["status_calidad"] === 'TERMINADO') {
                $("td", row).closest('tr').css('background-color', '#00E700');
                $("td", row).closest('tr').css('color', 'black');
            } else if (data["status_calidad"] === 'EN ESPERA') {
                $("td", row).closest('tr').css('background-color', '#FF0000');
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').find('button').css('color', 'white');
            } else if (data["status_calidad"] === 'CANCELADO') {
                $("td", row).closest('tr').css('background-color', '#0000FF');
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').css('text-decoration', 'line-through');
                $("td", row).closest('tr').find('button').css('color', 'white');
                $("td", row).closest('tr').find('button').prop("disabled", true);
            } else if (data["status_calidad"] === 'PROCESO') {
                $("td", row).closest('tr').css('background-color', '#FFFF00');
                $("td", row).closest('tr').css('color', 'black');
            }
            else if (data["status_calidad"] === 'PENDIENTE') {
                $("td", row).closest('tr').css('background-color', '#00FFFF');
                $("td", row).closest('tr').css('color', 'black');
            }
            else if (data["status_calidad"] === 'INGENIERIA') {
                $("td", row).closest('tr').addClass("bg-transparent"); //TRANSPARENTE
                $("td", row).closest('tr').find('button').remove();
            }
        },
        //filtro de busqueda sobre una columna
        initComplete: function(settings) {
            var api = new $.fn.dataTable.Api(settings);
            $('#table-filter select').on('change', function() {
                table
                    .columns(22)
                    .search(this.value)
                    .draw();
            });
        },
        "aaSorting": [],
        //bonotes exportar
        responsive: "true",
        dom: 'Bfrtilp',
        buttons: [{
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel"></i> ',
            titleAttr: 'Exportar a Excel',
            className: 'btn btn-success excel',
            exportOptions: {
                columns: [0, 1]
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
                "sLast": "??ltimo",
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
            "data": "contratista"
        }, {
            "data": "revision"
        }, {
            "data": "marca"
        }, {
            "data": "consecutivo"
        }, {
            "data": "folio"
        }, {
            "data": "cantidad"
        }, {
            "data": "nombre"
        }, {
            "data": "peso_unitario"
        }, {
            "data": "armado"
        }, {
            "data": "fecha_armado"
        }, {
            "data": "soldadura"
        }, {
            "data": "fecha_soldadura"
        }, {
            "data": "limpieza"
        }, {
            "data": "fecha_limpieza"
        }, {
            "data": "pintura"
        }, {
            "data": "fecha_pintura"
        }, {
            "data": "laboratorio"
        }, {
            "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-outline-dark btn-sm btnEditar'>Editar</button><button class='btn btn-outline-dark btn-sm btnBorrar'>Borrar</button></div></div>"
        }, {
            "data": "taller"
        }, {
            "data": "pendiente_calidad"
        }, {
            "data": "comentarios_calidad"
        }, {
            "data": "status_calidad"
        }],
        //ocultar columna
        "columnDefs": [{
            "targets": [22],
            "visible": false
        },
        {
            "targets": [5],
            "visible": false
        }]
    });
    var fila;
    $('#formUsuarios').submit(function(e) {
        e.preventDefault();
        id_tabla = $.trim($('#id_tabla').val());
        contratista = $.trim($('#contratista').val());
        revision = $.trim($('#revision').val());
        marca = $.trim($('#marca').val());
        consecutivo = $.trim($('#consecutivo').val());
        folio = $.trim($('#folio').val());
        cantidad = $.trim($('#cantidad').val());
        nombre = $.trim($('#nombre').val());
        peso_unitario = $.trim($('#peso_unitario').val());
        armado = $.trim($('#armado').val());
        fecha_armado = $.trim($('#fecha_armado').val());
        soldadura = $.trim($('#soldadura').val());
        fecha_soldadura = $.trim($('#fecha_soldadura').val());
        limpieza = $.trim($('#limpieza').val());
        fecha_limpieza = $.trim($('#fecha_limpieza').val());
        pintura = $.trim($('#pintura').val());
        fecha_pintura = $.trim($('#fecha_pintura').val());
        laboratorio = $.trim($('#laboratorio').val());
        taller = $.trim($('#taller').val());
        pendiente_calidad = $.trim($('#pendiente_calidad').val());
        comentarios_calidad = $.trim($('#comentarios_calidad').val());
        status_calidad = $.trim($('#status_calidad').val());

        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            datatype: "json",
            data: {
                id_tabla: id_tabla,
                contratista: contratista,
                revision: revision,
                marca: marca,
                consecutivo: consecutivo,
                folio: folio,
                cantidad: cantidad,
                nombre: nombre,
                peso_unitario: peso_unitario,
                armado: armado,
                fecha_armado: fecha_armado,
                soldadura: soldadura,
                fecha_soldadura: fecha_soldadura,
                limpieza: limpieza,
                fecha_limpieza: fecha_limpieza,
                pintura: pintura,
                fecha_pintura: fecha_pintura,
                laboratorio: laboratorio,
                opcion: opcion,
                taller: taller,
                pendiente_calidad: pendiente_calidad,
                comentarios_calidad: comentarios_calidad,
                status_calidad: status_calidad
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
        $(".modal-title").text("Registro nuevo");
        $('#modalCRUD').modal('show');
    });
    $(document).on("click", ".btnEditar", function() {
        opcion = 2;
        fila = $(this).closest("tr");
        id_tabla = parseInt(fila.find('td:eq(0)').text());
        contratista = fila.find('td:eq(1)').text();
        revision = fila.find('td:eq(2)').text();
        marca = fila.find('td:eq(3)').text();
        consecutivo = fila.find('td:eq(4)').text();
        folio = fila.find('td:eq()').text();
        cantidad = fila.find('td:eq(5)').text();
        nombre = fila.find('td:eq(6)').text();
        peso_unitario = fila.find('td:eq(7)').text();
        armado = fila.find('td:eq(8)').text();
        fecha_armado = fila.find('td:eq(9)').text();
        soldadura = fila.find('td:eq(10)').text();
        fecha_soldadura = fila.find('td:eq(11)').text();
        limpieza = fila.find('td:eq(12)').text();
        fecha_limpieza = fila.find('td:eq(13)').text();
        pintura = fila.find('td:eq(14)').text();
        fecha_pintura = fila.find('td:eq(15)').text();
        laboratorio = fila.find('td:eq(16)').text();
        status_calidad = fila.find('td:eq()').text();
        taller = fila.find('td:eq(18)').text(); 
        pendiente_calidad = fila.find('td:eq(19)').text();
        comentarios_calidad = fila.find('td:eq(20)').text(); 


        $("#id_tabla").val(id_tabla);
        $("#contratista").val(contratista);
        $("#revision").val(revision);
        $("#marca").val(marca);
        $("#consecutivo").val(consecutivo);
        $("#folio").val(folio);
        $("#cantidad").val(cantidad);
        $("#nombre").val(nombre);
        $("#peso_unitario").val(peso_unitario);
        $("#armado").val(armado);
        $("#fecha_armado").val(fecha_armado);
        $("#soldadura").val(soldadura);
        $("#fecha_soldadura").val(fecha_soldadura);
        $("#limpieza").val(limpieza);
        $("#fecha_limpieza").val(fecha_limpieza);
        $("#pintura").val(pintura);
        $("#fecha_pintura").val(fecha_pintura);
        $("#laboratorio").val(laboratorio);
        $("#taller").val(taller); 
        $("#pendiente_calidad").val(pendiente_calidad);
        $("#comentarios_calidad").val(comentarios_calidad);       
        $("#status_calidad").val(status_calidad); 

        $(".modal-header").addClass("bg-dark text-white");
        $(".modal-title").text("Editar");
        $('#modalCRUD').modal('show');
    });
    $(document).on("click", ".btnBorrar", function() {
        fila = $(this);
        id_tabla = parseInt($(this).closest('tr').find('td:eq(0)').text());
        opcion = 3;
        var respuesta = confirm("??Est?? seguro de borrar el registro " + id_tabla + "?");
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
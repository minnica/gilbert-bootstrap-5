$(document).ready(function() {
    var id_tabla, opcion;
    opcion = 4;
    tablaUsuarios = $('#tablaUsuarios').DataTable({
        createdRow: function(row, data) {
            if (data["status_embarques"] == 'TERMINADO') {
                $("td", row).closest('tr').css('background-color', '#00E700');
            } else if (data["status_embarques"] == 'CANCELADO') {
                $("td", row).closest('tr').css('background-color', '#0000FF');
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').css('text-decoration', 'line-through');
                $("td", row).closest('tr').find('button').css('color', 'white');
                $("td", row).closest('tr').find('button').prop("disabled", true);
            } else if (data["status_embarques"] === 'EN ESPERA') {
                $("td", row).closest('tr').css('background-color', '#FF0000');
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').find('button').css('color', 'white');
            } else if (data["status_embarques"] === 'PROCESO'){
                $("td", row).closest('tr').css('background-color', '#FFFF00');
                $("td", row).closest('tr').css('color', 'black');
            } else if (data["status_embarques"] === 'PENDIENTE') {
                $("td", row).closest('tr').css('background-color', '#00FFFF'); //CYAN
                $("td", row).closest('tr').css('color', 'black');
            } else if (data["status_embarques"] === 'INGENIERIA') {
                $("td", row).closest('tr').addClass("bg-transparent"); //TRANSPARENTE
                $("td", row).closest('tr').find('button').remove();
            }
        },
        //filtro de busqueda sobre una columna
        initComplete: function(settings) {
            var api = new $.fn.dataTable.Api(settings);
            $('#table-filter select').on('change', function() {
                table
                    .columns(15)
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
            "data": "contratista"
        }, {
            "data": "revision"
        }, {
            "data": "marca"
        }, {
            "data": "folio"
        }, {
            "data": "cantidad"
        }, {
            "data": "nombre"
        }, {
            "data": "peso_unitario"
        }, {
            "data": "longitud"
        }, {
            "data": "enviado"
        }, {
            "data": "remision"
        }, {
            "data": "fecha_remision"
        }, {
            "data": "comentarios_emb"
        }, {
            "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-outline-dark btn-sm btnEditar'>Editar</button><button class='btn btn-outline-dark btn-sm btnBorrar'>Borrar</button></div></div>"
        }, {
            "data": "taller"
        }, {
            "data": "status_embarques"
        }],
         "columnDefs": [{
            "targets": [15],
            "visible": false
        },{
            "targets": [4],
            "visible": false
        }]

    });
    var fila;
    $('#formUsuarios').submit(function(e) {
        e.preventDefault();
        contratista = $.trim($('#contratista').val());
        revision = $.trim($('#revision').val());
        marca = $.trim($('#marca').val());
        folio = $.trim($('#folio').val());
        cantidad = $.trim($('#cantidad').val());
        nombre = $.trim($('#nombre').val());
        peso_unitario = $.trim($('#peso_unitario').val());
        longitud = $.trim($('#longitud').val());
        enviado = $.trim($('#enviado').val());
        remision = $.trim($('#remision').val());
        fecha_remision = $.trim($('#fecha_remision').val());
        comentarios_emb = $.trim($('#comentarios_emb').val());
        taller = $.trim($('#taller').val());
        status_embarques = $.trim($('#status_embarques').val());

        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            datatype: "json",
            data: {
                id_tabla: id_tabla,
                contratista: contratista,
                revision: revision,
                marca: marca,
                folio: folio,
                cantidad: cantidad,
                nombre: nombre,
                peso_unitario: peso_unitario,
                longitud: longitud,
                enviado: enviado,
                remision: remision,
                fecha_remision: fecha_remision,
                comentarios_emb: comentarios_emb,
                opcion: opcion,
                taller: taller,
                status_embarques: status_embarques
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
        folio = fila.find('td:eq()').text();
        cantidad = fila.find('td:eq(4)').text();
        nombre = fila.find('td:eq(5)').text();
        peso_unitario = fila.find('td:eq(6)').text();
        longitud = fila.find('td:eq(7)').text();
        enviado = fila.find('td:eq(8)').text();
        remision = fila.find('td:eq(9)').text();
        fecha_remision = fila.find('td:eq(10)').text();
        comentarios_emb = fila.find('td:eq(11)').text();
        taller = fila.find('td:eq(13)').text();
        status_embarques = fila.find('td:eq()').text(); //11


        $("#contratista").val(contratista);
        $("#revision").val(revision);
        $("#marca").val(marca);
        $("#folio").val(folio);
        $("#cantidad").val(cantidad);
        $("#nombre").val(nombre);
        $("#peso_unitario").val(peso_unitario);
        $("#longitud").val(longitud);
        $("#enviado").val(enviado);
        $("#remision").val(remision);
        $("#fecha_remision").val(fecha_remision);
        $("#comentarios_emb").val(comentarios_emb);
        $("#taller").val(taller);
        $("#status_embarques").val(status_embarques);

        $(".modal-header").addClass("bg-dark text-white");
        $(".modal-title").text("Editar");
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
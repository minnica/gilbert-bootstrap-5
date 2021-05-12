$(document).ready(function() {
    var id_tabla, opcion;
    opcion = 4;
    tablaUsuarios = $('#tablaUsuarios').DataTable({
        createdRow: function(row, data) {
            if (data["status_obra"] == 'TERMINADO') {
                $("td", row).closest('tr').css('background-color', '#00E700');
            } else if (data["status_obra"] == 'EN ESPERA') {
                $("td", row).closest('tr').css('background-color', '#FF0000');
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').find('button').css('color', 'white');
            } else if (data["status_obra"] == 'CANCELADO') {
                $("td", row).closest('tr').css('background-color', '#0000FF');
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').css('text-decoration', 'line-through');
                $("td", row).closest('tr').find('button').css('color', 'white');
                $("td", row).closest('tr').find('button').prop("disabled", true);
            } else if (data["status_obra"] == 'PROCESO') {
                $("td", row).closest('tr').css('background-color', '#FFFF00');
            } else if (data["status_obra"] === 'PENDIENTE') {
                $("td", row).closest('tr').css('background-color', '#00FFFF'); //CYAN
                $("td", row).closest('tr').css('color', 'black');
            } else if (data["status_obra"] === 'INGENIERIA') {
                $("td", row).closest('tr').addClass("bg-transparent"); //TRANSPARENTE
                $("td", row).closest('tr').find('button').remove();
            }
        },
        //filtro de busqueda sobre una columna
        initComplete: function(settings) {
            var api = new $.fn.dataTable.Api(settings);
            $('#table-filter select').on('change', function() {
                table
                    .columns(13)
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
            "data": "taller"
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
            "data": "remision"
        }, {
            "data": "recibido"
        }, {
            "data": "montaje"
        }, {
            "data": "contratista_embarques"
        }, {
            "data": "tipo_obra"
        }, {
            "data": "status_obra"
        }, {
            "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-outline-dark btn-sm btnEditar'>Editar</button><button class='btn btn-outline-dark btn-sm btnBorrar'>Borrar</button></div></div>"
        }],
          "columnDefs": [{
            "targets": [13],
            "visible": false
        },{
            "targets": [4],
            "visible": false
        }]

    });
    var fila;
    $('#formUsuarios').submit(function(e) {
        e.preventDefault();
        taller = $.trim($('#taller').val());
        revision = $.trim($('#revision').val());
        marca = $.trim($('#marca').val());
        folio = $.trim($('#folio').val());
        cantidad = $.trim($('#cantidad').val());
        nombre = $.trim($('#nombre').val());
        peso_unitario = $.trim($('#peso_unitario').val());
        remision = $.trim($('#remision').val());
        recibido = $.trim($('#recibido').val());
        montaje = $.trim($('#montaje').val());
        contratista_embarques = $.trim($('#contratista_embarques').val());
        tipo_obra = $.trim($('#tipo_obra').val());
        status_obra = $.trim($('#status_obra').val());

        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            datatype: "json",
            data: {
                id_tabla: id_tabla,
                taller: taller,
                revision: revision,
                marca: marca,
                folio: folio,
                cantidad: cantidad,
                nombre: nombre,
                peso_unitario: peso_unitario,
                remision: remision,
                recibido: recibido,
                montaje: montaje,
                contratista_embarques: contratista_embarques,
                tipo_obra: tipo_obra,
                status_obra: status_obra,
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
        $(".modal-title").text("Registro nuevo");
        $('#modalCRUD').modal('show');
    });
    $(document).on("click", ".btnEditar", function() {
        opcion = 2;
        fila = $(this).closest("tr");
        id_tabla = parseInt(fila.find('td:eq(0)').text()); //capturo el ID
        taller = fila.find('td:eq(1)').text();
        revision = fila.find('td:eq(2)').text();
        marca = fila.find('td:eq(3)').text();
        folio = fila.find('td:eq()').text();
        cantidad = fila.find('td:eq(4)').text();
        nombre = fila.find('td:eq(5)').text();
        peso_unitario = fila.find('td:eq(6)').text();
        remision = fila.find('td:eq(7)').text();
        recibido = fila.find('td:eq(8)').text();
        montaje = fila.find('td:eq(9)').text();
        contratista_embarques = fila.find('td:eq(10)').text();
        tipo_obra = fila.find('td:eq(11)').text();
        status_obra = fila.find('td:eq(12)').text();


        $("#taller").val(taller);
        $("#revision").val(revision);
        $("#marca").val(marca);
        $("#folio").val(folio);
        $("#cantidad").val(cantidad);
        $("#nombre").val(nombre);
        $("#peso_unitario").val(peso_unitario);
        $("#remision").val(remision);
        $("#recibido").val(recibido);
        $("#montaje").val(montaje);
        $("#contratista_embarques").val(contratista_embarques);
        $("#tipo_obra").val(tipo_obra);
        $("#status_obra").val(status_obra);

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
$(document).ready(function() {
    var id_proyectos, opcion;
    opcion = 4;
    tablaUsuarios = $('#tablaUsuarios').DataTable({
        createdRow: function(row, data) {
            if (data['status_presupuestos'] === 'ACEPTADO') {
               $("td", row).closest('tr').css('background-color', '#00E700');
               $("td", row).closest('tr').css('color', 'black');
           } else if (data['status_presupuestos'] === 'PENDIENTE') {
               $("td", row).closest('tr').css('background-color', '#FF0000');
               $("td", row).closest('tr').css('color', 'white');
           } else if (data['status_presupuestos'] === 'ENVIADO') {
               $("td", row).closest('tr').css('background-color', '#FFFF00');
               $("td", row).closest('tr').css('color', 'black');
           } else if (data['status_presupuestos'] === 'RECHAZADO') {
               $("td", row).closest('tr').css('background-color', '#0000FF');
               $("td", row).closest('tr').css('color', 'white');
           }
       },
        //filtro de busqueda sobre una columna
        initComplete: function(settings) {
            var api = new $.fn.dataTable.Api(settings);
            $('#table-filter select').on('change', function() {
                table
                    .columns(10)
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
            "data": "id_proyectos"
        }, {
            "data": "ota"
        }, {
            "data": "nom_pro"
        }, {
            "data": "direccion"
        }, {
            "data": "cliente"
        }, {
            "data": "peso_presupuestado",
            render: $.fn.dataTable.render.number(',', '.', 2)
        }, {
            "data": "enviado_presupuestos"
        }, {
            "data": "fechaenvio_presupuestos"
        }, {
            "data": "aceptado"
        }, {
            "data": "fecha_aceptado"
        }, {
            "data": "status_presupuestos"
        }, {
            "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-outline-dark btn-sm btnEditar'>Editar</button></div></div>"
        }],
        //ocultar columna
        "columnDefs": [{
            "targets": [10],
            "visible": false
        }]
    });
    var fila;
    $('#formUsuarios').submit(function(e) {
        e.preventDefault();
        ota = $.trim($('#ota').val());
        nom_pro = $.trim($('#nom_pro').val());
        direccion = $.trim($('#direccion').val());
        cliente = $.trim($('#cliente').val());
        peso_presupuestado = $.trim($('#peso_presupuestado').val());
        enviado_presupuestos = $.trim($('#enviado_presupuestos').val());
        fechaenvio_presupuestos = $.trim($('#fechaenvio_presupuestos').val());
        aceptado = $.trim($('#aceptado').val());
        fecha_aceptado = $.trim($('#fecha_aceptado').val());
        status_presupuestos = $.trim($('#status_presupuestos').val());

        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            datatype: "json",
            data: {
                id_proyectos: id_proyectos,
                ota: ota,
                nom_pro: nom_pro,
                direccion: direccion,
                cliente: cliente,
                peso_presupuestado: peso_presupuestado,
                enviado_presupuestos: enviado_presupuestos,
                fechaenvio_presupuestos: fechaenvio_presupuestos,
                aceptado: aceptado,
                fecha_aceptado: fecha_aceptado,
                status_presupuestos: status_presupuestos,
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
        id_proyectos = null;
        $("#formUsuarios").trigger("reset");
        $(".modal-header").addClass("bg-dark text-white");
        $(".modal-title").text("Registro nuevo");
        $('#modalCRUD').modal('show');
    });
    $(document).on("click", ".btnEditar", function() {
        opcion = 2;
        fila = $(this).closest("tr");
        id_proyectos = parseInt(fila.find('td:eq(0)').text());
        ota = fila.find('td:eq(1)').text();
        nom_pro = fila.find('td:eq(2)').text();
        direccion = fila.find('td:eq(3)').text();
        cliente = fila.find('td:eq(4)').text();
        peso_presupuestado = parseFloat(fila.find('td:eq(5)').text().replace(',', ''));
        enviado_presupuestos = fila.find('td:eq(6)').text();
        fechaenvio_presupuestos = fila.find('td:eq(7)').text();
        aceptado = fila.find('td:eq(8)').text();
        fecha_aceptado = fila.find('td:eq(9)').text();
        status_presupuestos = fila.find('td:eq(10)').text();


        $("#ota").val(ota);
        $("#nom_pro").val(nom_pro);
        $("#direccion").val(direccion);
        $("#cliente").val(cliente);
        $("#peso_presupuestado").val(peso_presupuestado);
        $("#enviado_presupuestos").val(enviado_presupuestos);
        $("#fechaenvio_presupuestos").val(fechaenvio_presupuestos);
        $("#aceptado").val(aceptado);
        $("#fecha_aceptado").val(fecha_aceptado);
        $("#status_presupuestos").val(status_presupuestos);

        $(".modal-header").addClass("bg-dark text-white");
        $(".modal-title").text("Editar");
        $('#modalCRUD').modal('show');
    });
    $(document).on("click", ".btnBorrar", function() {
        fila = $(this);
        id_proyectos = parseInt($(this).closest('tr').find('td:eq(0)').text());
        opcion = 3;
        var respuesta = confirm("¿Está seguro de borrar el registro " + id_proyectos + "?");
        if (respuesta) {
            $.ajax({
                url: "bd/crud.php",
                type: "POST",
                datatype: "json",
                data: {
                    opcion: opcion,
                    id_proyectos: id_proyectos
                },
                success: function() {
                    tablaUsuarios.row(fila.parents('tr')).remove().draw();
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
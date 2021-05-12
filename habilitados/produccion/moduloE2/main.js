$(document).ready(function() {
    var id_habilitados, opcion;
    opcion = 4;
    tablaUsuarios = $('#tablaUsuarios').DataTable({
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
            "data": "id_habilitados"
        }, {
            "data": "pagado"
        }, {
            "data": "fecha_pagado"
        }, {
            "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-outline-dark btn-sm btnEditar'>Editar</button><button class='btn btn-outline-dark btn-sm btnBorrar'>Borrar</button></div></div>"
        }]
    });
    var fila;
    $('#formUsuarios').submit(function(e) {
        e.preventDefault();
        id_habilitados = $.trim($('#id_habilitados').val());
        pagado = $.trim($('#pagado').val());
        fecha_pagado = $.trim($('#fecha_pagado').val());
        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            datatype: "json",
            data: {
                id_habilitados: id_habilitados,
                pagado: pagado,
                fecha_pagado: fecha_pagado,
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
        id_habilitados = null;
        $("#formUsuarios").trigger("reset");
        $(".modal-header").addClass("bg-dark text-white");
        $(".modal-title").text("Registro nuevo");
        $('#modalCRUD').modal('show');
    });
    $(document).on("click", ".btnEditar", function() {
        opcion = 2;
        fila = $(this).closest("tr");
        id_habilitados = parseInt(fila.find('td:eq(0)').text());
        pagado = fila.find('td:eq(1)').text();
        fecha_pagado = fila.find('td:eq(2)').text();

        $("#id_habilitados").val(id_habilitados);
        $("#pagado").val(pagado);
        $("#fecha_pagado").val(fecha_pagado);

        $(".modal-header").addClass("bg-dark text-white");
        $(".modal-title").text("Editar");
        $('#modalCRUD').modal('show');
    });
    $(document).on("click", ".btnBorrar", function() {
        fila = $(this);
        id_habilitados = parseInt($(this).closest('tr').find('td:eq(0)').text());
        opcion = 3;
        var respuesta = confirm("¿Está seguro de borrar el registro " + id_habilitados + "?");
        if (respuesta) {
            $.ajax({
                url: "bd/crud.php",
                type: "POST",
                datatype: "json",
                data: {
                    opcion: opcion,
                    id_habilitados: id_habilitados
                },
                success: function() {
                    tablaUsuarios.ajax.reload(null, false);
                }
            });
        }
    });

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
});
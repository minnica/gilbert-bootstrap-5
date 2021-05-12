$(document).ready(function() {
    var id_tabla, opcion;
    opcion = 4;
    tablaUsuarios = $('#tablaUsuarios').DataTable({
        createdRow: function(row, data) {
         if (data["status_materiales"] === 'EN ESPERA') {
                $("td", row).closest('tr').css('background-color', '#FF0000'); //ROJO
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').find('button').css('color', 'white');
            } else if (data["status_materiales"] === 'TERMINADO') {
                $("td", row).closest('tr').css('background-color', '#00E700'); //VERDE
            } else if (data["status_materiales"] === 'MATERIALES') {
                $("td", row).closest('tr').css('background-color', '#fcba03'); //NARANJA
                $("td", row).closest('tr').css('color', 'black');
            } else if (data["status_materiales"] === 'PROCESO') {
                $("td", row).closest('tr').css('background-color', '#FFFF00'); //AMARILLO
                $("td", row).closest('tr').css('color', 'black');
            }else if (data["status_materiales"] === 'PENDIENTE') {
                $("td", row).closest('tr').css('background-color', '#00FFFF'); //CYAN
                $("td", row).closest('tr').css('color', 'black');
            } else if (data["status_materiales"] == 'CANCELADO') {
                $("td", row).closest('tr').css('background-color', '#0000FF'); //AZUL
                $("td", row).closest('tr').css('color', 'white');
                $("td", row).closest('tr').css('text-decoration', 'line-through');
                $("td", row).closest('tr').find('button').css('color', 'white');
                $("td", row).closest('tr').find('button').prop("disabled", true);
            } else if (data["status_materiales"] === 'INGENIERIA') {
                $("td", row).closest('tr').addClass("bg-transparent"); //TRANSPARENTE
                $("td", row).closest('tr').find('button').remove();
            }
        },
        //filtro de busqueda sobre una columna
        initComplete: function(settings) {
            var api = new $.fn.dataTable.Api(settings);
            $('#table-filter select').on('change', function() {
                table
                    .columns(11)
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
            "data": "consecutivo"
        }, {
            "data": "cantidad"
        }, {
            "data": "nombre"
        }, {
            "data": "peso_unitario"
        }, {
            "data": "contratista"
        }, {
            "data": "perfil"
        }, {
            "data": "liberado_materiales"
        }, {
            "data": "status_materiales"
        }, {
            "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-outline-dark btn-sm btnEditar'>Editar</button><button class='btn btn-outline-dark btn-sm btnBorrar'>Borrar</button></div></div>"
        }],
        //ocultar columna
        "columnDefs": [{
            "targets": [11],
            "visible": false
        }]
    });
    var fila;
    $('#formUsuarios').submit(function(e) {
        e.preventDefault();
        id_tabla = $.trim($('#id_tabla').val());
        taller = $.trim($('#taller').val());
        revision = $.trim($('#revision').val());
        marca = $.trim($('#marca').val());
        consecutivo = $.trim($('#consecutivo').val());
        cantidad = $.trim($('#cantidad').val());
        nombre = $.trim($('#nombre').val());
        peso_unitario = $.trim($('#peso_unitario').val());
        contratista = $.trim($('#contratista').val());
        perfil = $.trim($('#perfil').val());
        liberado_materiales = $.trim($('#liberado_materiales').val());

        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            datatype: "json",
            data: {
                id_tabla: id_tabla,
                taller: taller,
                revision: revision,
                marca: marca,
                consecutivo: consecutivo,
                cantidad: cantidad,
                nombre: nombre,
                peso_unitario: peso_unitario,
                contratista: contratista,
                perfil: perfil,
                liberado_materiales: liberado_materiales,
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
        id_tabla = parseInt(fila.find('td:eq(0)').text());
        taller = fila.find('td:eq(1)').text();
        revision = fila.find('td:eq(2)').text();
        marca = fila.find('td:eq(3)').text();
        consecutivo = fila.find('td:eq(4)').text();
        cantidad = fila.find('td:eq(5)').text();
        nombre = fila.find('td:eq(6)').text();
        peso_unitario = fila.find('td:eq(7)').text();
        contratista = fila.find('td:eq(8)').text();
        perfil = fila.find('td:eq(9)').text();
        liberado_materiales = fila.find('td:eq(10)').text();


        $("#id_tabla").val(id_tabla);        
        $("#taller").val(taller);
        $("#revision").val(revision);
        $("#marca").val(marca);
        $("#consecutivo").val(consecutivo);
        $("#cantidad").val(cantidad);
        $("#nombre").val(nombre);
        $("#peso_unitario").val(peso_unitario);
        $("#contratista").val(contratista);
        $("#perfil").val(perfil);

        if (contratista !== '') {
            $("#liberado_materiales").val(liberado_materiales).prop("disabled", false);
        } else {
            $("#liberado_materiales").val(liberado_materiales).prop("disabled", true);

        }

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
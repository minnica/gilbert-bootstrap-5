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
            "data": "ota"
        }, {
            "data": "id_ensamble"
        }, {
            "data": "ensamble"
        }, {
            "data": "num_ensamble"
        }, {
            "data": "marca"
        }, {
            "data": "colada"
        }, {
            "data": "tipo"
        }, {
            "data": "cantidad"
        }, {
            "data": "perfil"
        }, {
            "data": "espesor"
        }, {
            "data": "largo"
        }, {
            "data": "ancho"
        }, {
            "data": "peso"
        }, {
            "data": "fecha_captura"
        }, {
            "data": "cortado"
        }, {
            "data": "fecha_corte"
        }, {
            "data": "entregado"
        }, {
            "data": "fecha_entrega"
        }, {
            "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-outline-dark btn-sm btnEditar'>Editar</button><button class='btn btn-outline-dark btn-sm btnBorrar'>Borrar</button></div></div>"
        }]
    });
    var fila;
    $('#formUsuarios').submit(function(e) {
        e.preventDefault();
        id_habilitados = $.trim($('#id_habilitados').val());
        ota = $.trim($('#ota').val());
        id_ensamble = $.trim($('#id_ensamble').val());
        ensamble = $.trim($('#ensamble').val());
        num_ensamble = $.trim($('#num_ensamble').val());
        marca = $.trim($('#marca').val());
        colada = $.trim($('#colada').val());
        tipo = $.trim($('#tipo').val());
        cantidad = $.trim($('#cantidad').val());
        perfil = $.trim($('#perfil').val());
        espesor = $.trim($('#espesor').val());
        largo = $.trim($('#largo').val());
        ancho = $.trim($('#ancho').val());
        peso = $.trim($('#peso').val());
        fecha_captura = $.trim($('#fecha_captura').val());



        cortado = $.trim($('#cortado').val());
        fecha_corte = $.trim($('#fecha_corte').val());
        entregado = $.trim($('#entregado').val());        
        fecha_entrega = $.trim($('#fecha_entrega').val());

        $.ajax({
            url: "bd/crud.php",
            type: "POST",
            datatype: "json",
            data: {
                id_habilitados: id_habilitados,
                ota: ota,
                id_ensamble: id_ensamble,
                ensamble: ensamble,
                num_ensamble: num_ensamble,
                marca: marca,
                colada: colada,
                tipo: tipo,
                cantidad: cantidad,
                perfil: perfil,
                espesor: espesor,
                largo: largo,
                ancho: ancho,
                peso: peso,
                fecha_captura: fecha_captura,


                cortado: cortado,
                fecha_corte: fecha_corte,
                entregado: entregado,                
                fecha_entrega: fecha_entrega,
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
        ota = fila.find('td:eq(1)').text();
        id_ensamble = fila.find('td:eq(2)').text();
        ensamble = fila.find('td:eq(3)').text();
        num_ensamble = fila.find('td:eq(4)').text();
        marca = fila.find('td:eq(5)').text();
        colada = fila.find('td:eq(6)').text();
        tipo = fila.find('td:eq(7)').text();
        cantidad = fila.find('td:eq(8)').text();
        perfil = fila.find('td:eq(9)').text();
        espesor = fila.find('td:eq(10)').text();
        largo = fila.find('td:eq(11)').text();
        ancho = fila.find('td:eq(12)').text();
        peso = fila.find('td:eq(13)').text();
        fecha_captura = fila.find('td:eq(14)').text();


        cortado = fila.find('td:eq(15)').text();
        fecha_corte = fila.find('td:eq(16)').text();
        entregado = fila.find('td:eq(17)').text();        
        fecha_entrega = fila.find('td:eq(18)').text();

        $("#id_habilitados").val(id_habilitados);
        $("#ota").val(ota);
        $("#id_ensamble").val(id_ensamble);
        $("#ensamble").val(ensamble);
        $("#num_ensamble").val(num_ensamble);
        $("#marca").val(marca);
        $("#colada").val(colada);
        $("#tipo").val(tipo);
        $("#cantidad").val(cantidad);
        $("#perfil").val(perfil);
        $("#espesor").val(espesor);
        $("#largo").val(largo);
        $("#ancho").val(ancho);
        $("#peso").val(peso);
        $("#fecha_captura").val(fecha_captura);


        $("#cortado").val(cortado);
        $("#fecha_corte").val(fecha_corte);
        $("#entregado").val(entregado);        
        $("#fecha_entrega").val(fecha_entrega);

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
var Models = (function () {
    //Приватная переменная хранящая путь до сервера, предоставляющего информацию для модуля
    var url = '/api/models/admin';
    //Приватная переменная хранящая корневой html элемент, в котором отрисовывается модуль
    var table = "#tableModels";
    var editForm = "#editModels";

    var init = function () {
        getData(url);
    };

    var getData = function (url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                render(data);
            }
        });
    };

    var render = function (data) {
        let models = JSON.parse(data);

        let html = "";
        html += '<table class="table table-bordered">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>Модель</th>';
        html += '<th>Стоимость ТО каждые 15 тыс. км.</th>';
        html += '<th>Стоимость ТО каждые 30 тыс. км.</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        for (var i in models) {
            html += '<tr>';
            html += '<td>' + models[i].name + '</td>';
            html += '<td>' + models[i].price + '</td>';
            html += '<td>' + models[i].maintenancePrice + '</td>';
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';

        $(table).html(html);


        html = "";
        html += '<label>Модель: </label>';
        html += '<div>';
        html += '<select id="selModel">';
        for (var i in models) {
            html += '<option value="' + models[i].id + '">' + models[i].name + '</option>';
        }
        html += '</select>';

        html += '<div class="form-group mt-5">';
        html += '<label for="serv15">' + "Стоимость ТО каждые 15 тыс. км." + '</label>';
        html += '<input type="text" class="form-control" id="serv15" name="serv15" value="' + models[0].price + '">';
        html += '</div>';
        html += '<div class="form-group">';
        html += '<label for="serv30">' + "Стоимость ТО каждые 30 тыс. км." + '</label>';
        html += '<input type="text" class="form-control" id="serv30" name="serv30" value="' + models[0].maintenancePrice + '">';
        html += '</div>';

        html += '<button type="button" class="btn btn-success btn-add" onclick="UpdateModel.update(document.getElementById(\'selModel\').value);">Изменить</button>';
        html += '</div>';

        $(editForm).html(html);
        $('#selModel').on('change', function () {
            for (var i in models) {
                if (models[i].id == $('#selModel').val()) {
                    $('#serv15').val(models[i].price)
                    $('#serv30').val(models[i].maintenancePrice)
                    break;
                }
            }
        })
    };

    return {
        init: init
    };
})();

var UpdateModel = (function () {

    var update = function (id) {
        var url = '/api/models';

        var name = $('#selModel option:selected').text();
        var price = $('#serv15').val();
        var maintenancePrice = $('#serv30').val();

        $.ajax({
            url: url + "/" + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                price: price,
                maintenancePrice: maintenancePrice
            }),
            success: function () {
                Models.init();
            },
            async: true
        });
    };

    return {
        update: update
    };
})();

var App = (function () {
    return {
        init: function () {
            Models.init();
        }
    }
})();

App.init();
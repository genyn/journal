var Models = (function () {
    //Приватная переменная хранящая путь до сервера, предоставляющего информацию для модуля
    var url = '/api/models/admin';
    //Приватная переменная хранящая корневой html элемент, в котором отрисовывается модуль
    var el = "#divModel";

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
        html += '<label>Модель: </label>';
        html += '<select id="selModel">';
        for (var i in models) {
            html += '<option value="' + models[i].id + '">' + models[i].name + '</option>';
        }
        html += '</select>';

        $(el).html(html);
        $('#selModel').on('change', function () {
            for (var i in models) {
                if (models[i].id == $('#selModel').val()) {
                    ModelOptions.init(models[i].id);
                    break;
                }
            }
        })
    };

    return {
        init: init
    };
})();

var ModelOptions = (function () {
    //Приватная переменная хранящая путь до сервера, предоставляющего информацию для модуля
    var url = '/api/services';
    //Приватная переменная хранящая корневой html элемент, в котором отрисовывается модуль
    var el = "#tableModelOptions";

    var init = function (id) {
        getData(url + '/' + id);
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
        let services = JSON.parse(data);
        let html = "";

        if (services.length > 0) {
            html += '<table class="table table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th>Опция</th>';
            html += '<th>Стоимость</th>';
            html += '<th>Действия</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (var i in services) {
                html += '<tr>';
                html += '<td>' + services[i].name + '</td>';
                html += '<td>' + services[i].price + '</td>';
                html += '<td>';
                html += '<div class="row">'
                html += '<div class="col-md-6">';
                html += '<button type = "button" class="btn btn-outline-primary btn-block" data-toggle="modal" data-target="#updateModal"  onclick="UpdateModal.open(' + services[i].id + ',\'' + services[i].name + '\',' + services[i].price + ')" > Изменить</button>';
                html += '</div>';
                html += '<div class="col-md-6">';
                html += '<button type="button" class="btn btn-outline-danger btn-block" onclick="Service.remove(' + services[i].id + ')">Удалить</button>';
                html += '</div>';
                html += '</div>';
                html += '</td>';
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
        }
        else {
            html += "<p>Услуги отсутствуют</p>";
        }

        $(el).html(html);
    };

    return {
        init: init
    };
})();

var CreateModal = (function () {

    var open = function () {
        var url = '/api/services/options';

        render();
        getOptions(url);
    };

    var getOptions = function (url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderOptions(data);
            }
        });
    };

    var render = function () {
        let html = "";

        html += '<label>Название</label>';
        html += '<div>';
        html += '<select id="selOptCreate">'
        html += '</select>'
        html += '</div>';

        html += '<div class="form-group mt-2">';
        html += '<label for="priceCreate">Стоимость</label>';
        html += '<input type="text" class="form-control" id="priceCreate" name="priceCreate">';
        html += '</div>';

        $("#createForm").html(html);

        html = '';

        html += '<button type="button" class="btn btn-primary" onclick="Service.create();">Добавить</button>';

        $("#divCreateFoot").html(html);
    };

    var renderOptions = function (data) {
        let options = JSON.parse(data);
        let html = "";
        for (var i in options) {
            html += '<option value="' + options[i].id + '">' + options[i].name + '</option>';
        }
        $("#selOptCreate").html(html);
    };

    return {
        open: open
    };
})();

var UpdateModal = (function () {

    var open = function (id, name, price) {
        var url = '/api/services/options';

        render(id, price);
        getOptions(url, name);
    };

    var getOptions = function (url, name) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderOptions(data, name);
            }
        });
    };

    var render = function (id, price) {
        let html = "";

        html += '<label>Название</label>';
        html += '<div>';
        html += '<select id="selOptUpdate">'
        html += '</select>'
        html += '</div>';

        html += '<div class="form-group mt-2">';
        html += '<label for="priceUpdate">Стоимость</label>';
        html += '<input type="text" class="form-control" id="priceUpdate" name="priceUpdate" value="'+ price +'">';
        html += '</div>';

        $("#UpdateForm").html(html);

        html = '';

        html += '<button type="button" class="btn btn-primary" onclick="Service.update(' + id + ');">Изменить</button>';

        $("#divUpdateFoot").html(html);
    };

    var renderOptions = function (data, name) {
        let options = JSON.parse(data);
        let html = "";
        for (var i in options) {
            if (options[i].name == name) {
                html += '<option selected value="' + options[i].id + '">' + options[i].name + '</option>';
            }
            else {
                html += '<option value="' + options[i].id + '">' + options[i].name + '</option>';
            }
        }
        $("#selOptUpdate").html(html);
    };

    return {
        open: open
    };
})();

var Service = (function () {

    var url = '/api/services/service/';

    var create = function () {
        createReq();
    };

    var update = function (id) {
        updateReq(id);
    };

    var remove = function (id) {
        removeReq(id);
    };

    var createReq = function () {
        let modelFk = $('#selModel').val();
        let name = $('#selOptCreate option:selected').text();
        let price = $('#priceCreate').val();

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                modelFk: modelFk,
                name: name,
                price: price
            }),
            complete: function (resp) {
                if (resp.status === 200) {
                    ModelOptions.init(modelFk);
                    $("#createModal").modal("hide");
                }
            }
        });
    };

    var updateReq = function (id) {
        let modelFk = $('#selModel').val();
        let name = $('#selOptUpdate option:selected').text();
        let price = $('#priceUpdate').val();

        $.ajax({
            url: url + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                modelFk: modelFk,
                name: name,
                price: price
            }),
            complete: function (resp) {
                if (resp.status === 204) {
                    ModelOptions.init(modelFk);
                    $("#updateModal").modal("hide");
                }
            }
        });
    };

    var removeReq = function (id) {
        let modelFk = $('#selModel').val();

        $.ajax({
            url: url + id,
            type: 'DELETE',
            dataType: 'HTML',
            complete: function (resp) {
                if (resp.status === 204) {
                    ModelOptions.init(modelFk);
                }
            }
        });
    };

    return {
        create: create,
        update: update,
        remove: remove
    };
})();

var App = (function () {
    return {
        init: function () {
            Models.init();
            ModelOptions.init(2);
        }
    }
})();

App.init();
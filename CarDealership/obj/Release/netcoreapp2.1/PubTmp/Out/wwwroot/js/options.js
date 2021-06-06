var Options = (function () {
    //Приватная переменная хранящая путь до сервера, предоставляющего информацию для модуля
    var url = '/api/services/options';
    //Приватная переменная хранящая корневой html элемент, в котором отрисовывается модуль
    var table = "#tableOptions";

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
        let options = JSON.parse(data);

        let html = "";
        html += '<table class="table table-bordered">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>Опция</th>';
        html += '<th>Действия</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        for (var i in options) {
            html += '<tr>';
            html += '<td>' + options[i].name + '</td>';
            html += '<td>';
            html += '<div class="row">'
            html += '<div class="col-md-6">';
            html += '<button type = "button" class="btn btn-outline-primary btn-block" data-toggle="modal" data-target="#updateModal"  onclick="UpdateModal.open(' + options[i].id + ',\'' + options[i].name +'\')" > Изменить</button>';
            html += '</div>';
            html += '<div class="col-md-6">';
            html += '<button type="button" class="btn btn-outline-danger btn-block" onclick="Option.remove(' + options[i].id +')">Удалить</button>';
            html += '</div>';
            html += '</div>';
            html += '</td>';
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';

        $(table).html(html);
    };

    return {
        init: init
    };
})();

var CreateModal = (function () {

    var open = function () {
        render();
    };

    var render = function () {
        let html = "";

        html += '<div class="form-group mt-2">';
        html += '<label for="nameCreate">Название</label>';
        html += '<input type="text" class="form-control" id="nameCreate" name="nameCreate">';
        html += '</div>';

        $("#createForm").html(html);

        html = '';

        html += '<button type="button" class="btn btn-primary" onclick="Option.create();">Добавить</button>';

        $("#divCreateFoot").html(html);
    };

    return {
        open: open
    };
})();

var UpdateModal = (function () {

    var open = function (id, name) {
        render(id, name);
    };

    var render = function (id, name) {
        let html = "";

        html += '<div class="form-group mt-2">';
        html += '<label for="nameUpdate">Название</label>';
        html += '<input type="text" class="form-control" id="nameUpdate" name="nameUpdate" value="'+ name +'">';
        html += '</div>';

        $("#UpdateForm").html(html);

        html = '';

        html += '<button type="button" class="btn btn-primary" onclick="Option.update('+ id +');">Изменить</button>';

        $("#divUpdateFoot").html(html);
    };

    return {
        open: open
    };
})();

var Option = (function () {

    var url = '/api/services/';

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
        let name = $('#nameCreate').val();

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name
            }),
            complete: function (resp) {
                if (resp.status === 200) {
                    Options.init();
                    $("#createModal").modal("hide");
                }
            }
        });
    };

    var updateReq = function (id) {
        let name = $('#nameUpdate').val();

        $.ajax({
            url: url + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name
            }),
            complete: function (resp) {
                if (resp.status === 204) {
                    Options.init();
                    $("#updateModal").modal("hide");
                }
            }
        });
    };

    var removeReq = function (id) {
        $.ajax({
            url: url + id,
            type: 'DELETE',
            dataType: 'HTML',
            complete: function (resp) {
                if (resp.status === 204) {
                    Options.init();
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
            Options.init();
        }
    }
})();

App.init();
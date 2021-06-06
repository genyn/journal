var Filter = (function () {

    var init = function () {
        getModels();
        getDealers();
    };

    var getModels = function () {
        $.ajax({
            url: '/api/models/admin',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderModels(data);
            }
        });
    };

    var getDealers = function () {
        $.ajax({
            url: '/api/dealers',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderDealers(data);
            }
        });
    };

    var renderModels = function (data) {
        let models = JSON.parse(data);

        let html = "";
        html += '<label>Владельцу моделей: </label>';

        html += '<div class="form-check">';
        html += '<label class="form-check-label" for="isAnyModel">';
        html += '<input type="checkbox" class="form-check-input" id="isAnyModel" name="isAnyModel" checked>Любой';
        html += '</label>';
        html += '</div>';

        html += '<select multiple disabled class="form-control" id="selModel">';
        for (var i in models) {
            html += '<option value="' + models[i].id + '">' + models[i].name + '</option>';
        }
        html += '</select>';

        $('#filterModels').html(html);

        $('#isAnyModel').on('change', function () {
            if ($('#isAnyModel').is(':checked')) {
                $('#selModel').attr('disabled', true);
            }
            else {
                $('#selModel').removeAttr("disabled");
            }
        })
    };

    var renderDealers = function (data) {
        let dealers = JSON.parse(data);

        let html = "";
        html += '<label>Клиенту ДЦ: </label>';

        html += '<div class="form-check">';
        html += '<label class="form-check-label" for="isAnyDealer">';
        html += '<input type="checkbox" class="form-check-input" id="isAnyDealer" name="isAnyDealer" checked>Любого';
        html += '</label>';
        html += '</div>';

        html += '<select multiple disabled class="form-control" id="selDealer">';
        for (var i in dealers) {
            html += '<option value="' + dealers[i].id + '">' + dealers[i].name + '</option>';
        }
        html += '</select>';

        $('#filterDealers').html(html);

        $('#isAnyDealer').on('change', function () {
            if ($('#isAnyDealer').is(':checked')) {
                $('#selDealer').attr('disabled', true);
            }
            else {
                $('#selDealer').removeAttr("disabled");
            }
        })
    };

    return {
        init: init
    };
})();

var Notifications = (function () {

    var init = function (url) {
        var url = '/api/notifications';

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
        let notifications = JSON.parse(data);
        let html = "";

        html += "<h2>История уведомлений</h2>";
        if (notifications.length > 0) {
            for (var i in notifications) {
                html += '<div class="card my-4">';
                html += '<div class="card-body">';

                html += '<div class="form-group">';
                html += '<p>Получатели:</p>';
                html += '<p>' + notifications[i].recipients + '</p>';
                html += '</div>';

                html += '<div class="form-group">';
                html += '<p>' + notifications[i].title + '</p>';
                html += '</div>';
                html += '<div class="form-group">';
                html += '<p>' + notifications[i].text + '</p>';
                html += '</div>';
                html += '</div>';
                html += '<div class="card-footer d-flex">';
                html += '<button type="button" class="btn btn-danger ml-auto" onclick="Notification.remove(' + notifications[i].id +')">Удалить</button>';
                html += '</div>';
                html += '</div>';
            }
        }
        else {
            html += "<p>История уведомлений пуста</p>";
        }

        $('#tableNotifications').html(html);
    };

    return {
        init: init
    };
})();

var Notification = (function () {

    var url = '/api/notifications/';

    var send = function () {
        createReq();
    };

    var remove = function (id) {
        removeReq(id);
    };

    var createReq = function () {
        var title = $('#title').val();
        var text = $('#text').val();

        var recipients = '';
        var isAnyModel;
        var ModelsIds = [];
        if ($('#isAnyModel').is(':checked')) {
            isAnyModel = true;

            recipients += 'Владельцы любых моделей; ';
        }
        else {
            isAnyModel = false;
            ModelsIds = $('#selModel').val();

            recipients += 'Владельцы моделей: ';
            for (var i in ModelsIds) {
                if (i < ModelsIds.length - 1) {
                    recipients += $("#selModel option[value='" + ModelsIds[i] + "']").text() + ', ';
                }
                else {
                    recipients += $("#selModel option[value='" + ModelsIds[i] + "']").text() + '; ';
                }
            }
        }

        var isAnyDealer;
        var DealersIds = [];
        if ($('#isAnyDealer').is(':checked')) {
            isAnyDealer = true;

            recipients += 'Клиенты любых ДЦ';
        }
        else {
            isAnyDealer = false;
            DealersIds = $('#selDealer').val();

            recipients += 'Клиенты ДЦ: ';
            for (var i in DealersIds) {
                if (i < DealersIds.length - 1) {
                    recipients += $("#selDealer option[value='" + DealersIds[i] + "']").text() + ', ';
                }
                else {
                    recipients += $("#selDealer option[value='" + DealersIds[i] + "']").text();
                }
            }
        }

        $.ajax({
            url: '/api/notifications',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                title: title,
                text: text,
                email: "",
                recipients: recipients,
                status: 1,
                isAnyModel: isAnyModel,
                ModelsIds: ModelsIds,
                isAnyDealer: isAnyDealer,
                DealersIds: DealersIds
            }),
            complete: function (resp) {
                if (resp.status === 200) {
                    Notifications.init();
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
                    Notifications.init();
                }
            }
        });
    };

    return {
        send: send,
        remove: remove
    };
})();

var App = (function () {
    return {
        init: function () {
            Filter.init();
            Notifications.init();
        }
    }
})();

App.init();
var Records = (function () {
    //Приватная переменная хранящая корневой html элемент, в котором отрисовывается модуль
    var el = "#tableMaintenance";

    var init = function () {
        getCurrentUser();
    };

    var getCurrentUser = function () {
        $.ajax({
            url: "/api/Account/isAuthenticated",
            type: 'POST',
            dataType: 'HTML',
            success: function (resp) {
                let str = JSON.parse(resp).user.userName;
                let id = str[str.length - 1];

                getData(id);
            }
        });
    };

    var getData = function (id) {
        var period = $('#selPeriod').val();

        $.ajax({
            url: '/api/maintenance/' + id + '/' + period,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                render(data);
            }
        });
    };

    var render = function (data) {
        let maintenance = JSON.parse(data);
        let html = "";

        if (maintenance.length > 0) {
            html += '<table class="table table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th>Тип</th>';
            html += '<th>Дата</th>';
            html += '<th>Время</th>';
            html += '<th>Модель</th>';
            html += '<th>Пробег</th>';
            html += '<th>Номер бокса</th>';
            html += '<th>Статус</th>';
            html += '<th>Комментарий</th>';
            html += '<th>Дополнительные услуги</th>';
            html += '<th>Стоимость</th>';
            html += '<th>Действия</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (var i in maintenance) {
                html += '<tr>';
                var type = (maintenance[i].serviceType == 1) ? 'ТО' : 'Ремонт';
                html += '<td>' + type + '</td>';
                html += '<td>' + maintenance[i].date + '</td>';
                html += '<td>' + maintenance[i].time + '</td>';
                html += '<td>' + maintenance[i].modelName + '</td>';
                html += '<td>' + maintenance[i].mileage + '</td>';
                html += '<td>' + maintenance[i].boxNum + '</td>';
                html += '<td>' + maintenance[i].status + '</td>';
                if (maintenance[i].serviceType == 1) {
                    html += '<td> - </td>';
                    if (maintenance[i].additionalServices.length > 0) {
                        html += '<td>';
                        for (var j in maintenance[i].additionalServices) {
                            html += '<p>' + maintenance[i].additionalServices[j].name + '</p>';
                        }
                        html += '</td>';
                    }
                    else {
                        html += '<td>Отсутствуют</td>';
                    }
                }
                else {
                    html += '<td>' + maintenance[i].comment + '</td>';
                    html += '<td> - </td>';
                }
                var price = (maintenance[i].price == 0) ? '-' : maintenance[i].price;
                html += '<td>' + price + '</td>';
                html += '<td>';
                if (maintenance[i].status == 'На рассмотрении') {
                    html += '<button type = "button" class="btn btn-outline-primary btn-sm btn-block" onclick="Maintenance.setStatus(2' + ',' + maintenance[i].id + ')">Подтвердить</button>';
                    html += '<button type = "button" class="btn btn-outline-danger btn-sm btn-block" onclick="Maintenance.setStatus(4' + ',' + maintenance[i].id + ')">Отменить</button>';
                }
                else if (maintenance[i].status == 'Подтверждена') {
                    html += '<button type = "button" class="btn btn-outline-primary btn-sm btn-block" onclick="Maintenance.setStatus(3' + ',' + maintenance[i].id + ')">Закрыть</button>';
                    html += '<button type = "button" class="btn btn-outline-danger btn-sm btn-block" onclick="Maintenance.setStatus(4' + ',' + maintenance[i].id + ')">Отменить</button>';;
                }
                else {
                    html += '<p>Нет</p>';
                }
                html += '</td>';
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
        }
        else {
            html += "<p>Записи отсутствуют</p>";
        }

        $(el).html(html);
    };

    return {
        init: init
    };
})();

var Maintenance = (function () {

    var url = '/api/maintenance/status/';

    var setStatus = function (sid, mid) {
        var st = '';
        switch (sid) {
            case 2: {
                st = 'Вы действительно хотите подтвердить заявку?';
                break;
            }
            case 3: {
                st = 'Вы действительно хотите закрыть заявку?';
                break;
            }
            case 4: {
                st = 'Вы действительно хотите отменить заявку?';
                break;
            }
        }

        var areYouSure = confirm(st);

        if (areYouSure == true) {
            switch (sid) {
                case 2: {
                    var price = prompt('Укажите стоимость услуг', '');
                    if (price != null) { update(sid, mid, "", Number.parseInt(price)); }
                    break;
                }
                case 3: {
                    var price = prompt('Укажите стоимость оказанных услуг', '');
                    if (price != null) { update(sid, mid, "", Number.parseInt(price)); }
                    break;
                }
                case 4: {
                    var reason = prompt('Укажите причину', '');
                    if (reason != null) { update(sid, mid, reason, 0); }
                    break;
                }
            }
        }
    };

    var update = function (sid, mid, reason, price) {
        $.ajax({
            url: url + sid + '/update/' + mid,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                text: reason,
                price: price
            }),
            success: function () {
                Records.init();
            }
        });
    }

    return {
        setStatus: setStatus
    };
})();

var App = (function () {
    return {
        init: function () {
            Records.init();

            $('#selPeriod').on('change', function () {
                Records.init();
            })
        }
    }
})();

App.init();
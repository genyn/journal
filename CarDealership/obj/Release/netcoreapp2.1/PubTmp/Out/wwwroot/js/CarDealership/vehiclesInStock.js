var Models = (function () {
    //Приватная переменная хранящая путь до сервера, предоставляющего информацию для модуля
    var url = '/api/models/';
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
        html += '<div>';
        html += '<select id="selModel">';
        html += '<option value="0">Все модели</option>';
        for (var i in models) {
            html += '<option value="' + models[i].id + '">' + models[i].name + '</option>';
        }
        html += '</select>';
        html += '</div>';

        $(el).html(html);
        $('#selModel').on('change', function () {
            Vehicles.init();
        })
    };

    return {
        init: init
    };
})();

var Vehicles = (function () {

    var url = '/api/vehicles/';
    var el = "#vehiclesDiv";

    var init = function () {
        var id = $('#selModel').val();
        if (id == 0 || id == undefined)
            getData(url);
        else
            getData(url + "model/" + id);
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
        let vehicles = "";
        let html = "";
        vehicles = JSON.parse(data);
        if (vehicles.length > 0) {
            for (var i in vehicles) {
                if (i == 0)
                    html += '<div class="row">';
                html += '<div class="col-lg-4 col-md-3 katalog panel panel - warning">';
                html += '<div class="panel-body">';
                //html += "<img src =\"" + URL.createObjectURL(vehicles[i].image) + "\"/>";
                html += '<h3>' + vehicles[i].model + '</h3>';
                html += '<p>Комплектация: ' + vehicles[i].kit + '</p>';
                html += '<p>Двигатель: ' + vehicles[i].engineName + ', ' + vehicles[i].engineType + '</p>';
                html += '<p>Мощность: ' + vehicles[i].enginePower + ' л.с.</p>';
                html += '<p>Цвет: ' + vehicles[i].color + '</p>';
                html += '<p>Стоимость: ' + vehicles[i].totalPrice + ' руб.</p>';
                html += '<button type="button" class="btn btn-primary btn-block innerBtn" data-toggle="modal" data-target="#viewModal" onclick="ViewModal.open(' + vehicles[i].vehicle.id + ');"> Подробнее </button>';
                html += '</div>';
                html += "</div>";
            }
        }
        else {
            html += '<div class="panel-body">'
            html += '<p>Список пуст</p>'
            html += '</div>';
        }
        html += "</div>";
        $(el).html(html);
    };

    return {
        init: init
    };
})();

var ViewModal = (function () {

    var vehId = "";
    let vehicle = "";

    var close = function () {
        $("#viewModal").modal("hide");
    }

    var open = function (vId) {
        vehId = vId;

        getVehicle();
    };

    var getVehicle = function () {
        $.ajax({
            url: '/api/vehicles/vehicle/' + vehId,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderVehicle(data);
            }
        });
    };

    var renderVehicle = function (data) {
        vehicle = JSON.parse(data);
        let html = "";

        html += '<div class="container childcontainer">';
        //html += "<img src =\"" + URL.createObjectURL(vehicles[i].image) + "\"/>";
        html += '<h3>' + vehicle.model + '</h3>';
        html += '<p><b>Комплектация: </b>' + vehicle.kit + '</p>';
        html += '<p><b>Двигатель: </b>' + vehicle.engineName + ', ' + vehicle.engineType + '</p>';
        html += '<p><b>Мощность: </b>' + vehicle.enginePower + ' л.с.</p>';
        html += '<p><b>Цвет: </b>' + vehicle.color + '</p>';
        html += '<p><b>Стоимость: </b>' + vehicle.totalPrice + ' руб.</p>';
        html += '<h5>Опции: </h5>';
        html += '<div class="scroll">';
        html += '<div class="container childcontainer">';
        for (var i in vehicle.options) {
            html += '<p>' + vehicle.options[i].name + '</p>';
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';

        $("#divViewBody").html(html);

        html = '';

        html += '<button type="button" class="btn btn-primary btn-block innerBtn" data-dismiss="modal" data-toggle="modal" data-target="#dealReqModal" onclick="ViewModal.close(); DealerReqModal.open('+ vehicle.vehicle.id +');"> Запрос дилеру </button>';

        $("#divViewFoot").html(html);
    };

    return {
        open: open,
        close: close
    };
})();

var CurrentUser = (function () {

    let user = "";

    var init = function () {
        get();
        return user;
    };

    var get = function () {
        $.ajax({
            url: '/api/Account/isAuthenticated',
            type: 'POST',
            success: function (xhr) {
                if (xhr.isAdmin == true) {
                    document.location.href = "index.html";
                }
                else if (xhr.message != "") {
                    user = JSON.stringify({
                        name: xhr.message,
                        email: xhr.email
                    })
                }
            }
        });
    };

    var remove = function () {
        name = "";
        email = ""
    }

    return {
        init: init,
        remove: remove
    };
})();

var DealerReqModal = (function () {

    var vehId = "";
    let vehicle = "";

    var addClient = function () {
        var name = $('#name').val();
        var phoneNum = $('#phoneNum').val();
        var email = $('#email').val();

        $.ajax({
            url: '/api/clients/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                phoneNumber: phoneNum,
                email: email
            }),
            success: function (xhr) {
                addContract(xhr.id);
            },
            async: true
        });
    }

    var addContract = function (id) {
        var total_Price = vehicle.totalPrice;
        let date = new Date(2020, 5, 27);
        var vehicleFK = vehId;
        var clientFK = id;

        $.ajax({
            url: '/api/contracts/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                total_Price: total_Price,
                date: date,
                vehicleFK: vehicleFK,
                clientFK: clientFK
            }),
            async: true
        });
    }

    var clear = function () {
        $('#name').val("");
        $('#email').val("");
        $('#phoneNum').val("");

        $("#err").html("");
    }

    var close = function () {
        if ($('#name').val() == "" || $('#email').val() == "" || $('#phoneNum').val() == "") {
            $('#err').html('<span class="badge badge-danger">Не все поля заполнены</span>');
        }
        else {
            addClient();
            clear();
            $("#dealReqModal").modal("hide");
        }
    }

    var open = function (vId) {
        vehId = vId;

        getVehicle();
    };

    var getVehicle = function () {
        $.ajax({
            url: '/api/vehicles/vehicle/' + vehId,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                render(data);
            }
        });
    }

    var render = function (data) {
        vehicle = JSON.parse(data);
        let html = "";

        html += '<div id="err"></div>';
        html += '<div class="container childcontainer">';
        //html += "<img src =\"" + URL.createObjectURL(vehicles[i].image) + "\"/>";
        html += '<h3>Автомобиль</h3>';
        html += '<div class="listEl">'
        html += '<h4>' + vehicle.model + '</h4>';
        html += '<p><b>Комплектация: </b>' + vehicle.kit + '</p>';
        html += '<p><b>Двигатель: </b>' + vehicle.engineName + ', ' + vehicle.engineType + '</p>';
        html += '<p><b>Мощность: </b>' + vehicle.enginePower + ' л.с.</p>';
        html += '<p><b>Цвет: </b>' + vehicle.color + '</p>';
        html += '<p><b>Стоимость: </b>' + vehicle.totalPrice + ' руб.</p>';
        html += '</div>'

        html += '<div class="panel-body">'
        html += '<h3>Ваши персональные данные</h3>';
        html += '<form>'
        html += '<div class="form-group listEl">';
        html += '<input type="text" class="form-control" id="name" placeholder="ФИО">';
        html += '<div>';

        html += '<div class="form-group listEl">';
        html += '<input type="text" class="form-control" id="email" placeholder="Email">';
        html += '<div>';

        html += '<div class="form-group listEl">';
        html += '<input type="text" class="form-control" id="phoneNum" placeholder="Телефон">';
        html += '<div>';
        html += '</form>'
        html += '</div>';
        html += '</div>';

        $("#divReqBody").html(html);

        html = '';

        html += '<button type="button" class="btn btn-primary btn-block innerBtn" onclick="DealerReqModal.close();"> Запрос дилеру </button>';

        $("#divReqFoot").html(html);

        fill();
    };

    var fill = function () {
        let user = CurrentUser.init();
        
        if (user.name != "" && user.email != "") {
            $('#name').val(CurrentUser.name);
            $('#email').val(CurrentUser.email);
        }
    }

    return {
        open: open,
        close: close,
        clear: clear
    };
})();



var App = (function () {
    //Тут можно определить приватные переменные и методы
    //Например
    var someArray = []; //Не будет доступен по ссылке App.someArray, не как либо еще вне объекта

    //Объект, содержащий публичное API
    return {
        init: function () {
            // Инициализация модуля. В ней мы инициализируем все остальные модули на странице
            CurrentUser.init();
            Models.init();
            Vehicles.init();
        }
    }
})();

App.init();

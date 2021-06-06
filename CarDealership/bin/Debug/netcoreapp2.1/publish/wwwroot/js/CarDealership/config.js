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

        html += '<h5>Модель: </h5>';
        html += '<div>';
        html += '<select id="selModel">';
        for (var i in models) {
            html += '<option value="' + models[i].id + '">' + models[i].name + '</option>';
        }
        html += '</select>';
        html += '</div>';

        $(el).html(html);
        $('#selModel').on('change', function () {
            Engines.init();
            Colors.init();
            Options.init();
        })
    };

    return {
        init: init
    };
})();

var Engines = (function () {

    var url = '/api/models/';
    var el = "#divEngine";

    var init = function () {
        var id = $('#selModel').val();
        if (id == undefined)
            getData(url + '2/engines/');
        else
            getData(url + id + '/engines/');
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
        let engines = JSON.parse(data);
        let html = "";

        html += '<h5>Двигатель: </h5>';
        for (var i in engines) {
            html += '<div class="form-check">';
            html += '<label class="form-check-label" id="engines' + i + '" for="engines' + i + '">';
            if (i == 0)
                html += '<input type="radio" class="form-check-input" name="engines" id="engines' + i + '" value="' + engines[i].id + '" checked><b>' + engines[i].name + '</b>';
            else
                html += '<input type="radio" class="form-check-input" name="engines" id="engines' + i + '" value="' + engines[i].id + '"><b>' + engines[i].name + '</b>';
            html += '</label>';
            html += '<div>' + engines[i].type + ', ' + engines[i].power + 'л.с.</div>';
            html += '<label>' + engines[i].price + '</label><label> руб.</label>';
            html += '</div>';
        }

        $(el).html(html);
    };

    return {
        init: init
    };
})();

var Colors = (function () {

    var url = '/api/models/';
    var el = "#divColor";

    var init = function () {
        var id = $('#selModel').val();
        if (id == undefined)
            getData(url + '2/colors/');
        else
            getData(url + id + '/colors/');
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
        let colors = JSON.parse(data);
        let html = "";

        html += '<h5>Цвет: </h5>';
        for (var i in colors) {
            html += '<div class="form-check">';
            html += '<label class="form-check-label" for="colors' + i + '">';
            if (i == 0)
                html += '<input type="radio" class="form-check-input" name="colors" id="colors' + i + '" value="' + colors[i].id + '" checked><b>' + colors[i].name + '</b>';
            else
                html += '<input type="radio" class="form-check-input" name="colors" id="colors' + i + '" value="' + colors[i].id + '"><b>' + colors[i].name + '</b>';
            html += '</label>';
            html += '<label class="lblprice">' + colors[i].price + '</label><label> руб.</label>';
            html += '</div>';
        }

        $(el).html(html);
    };

    return {
        init: init
    };
})();

var Options = (function () {
    //Приватная переменная хранящая путь до сервера, предоставляющего информацию для модуля
    var url = '/api/options/';

    var init = function () {
        var modId = $('#selModel').val();
        if (modId == undefined)
            modId = 2;

        getHeadlights(url + modId + '/1')
        getWheels(url + modId + '/2')
        getSeats(url + modId + '/5')
        getUpholsteries(url + modId + '/6')
        getSteerings(url + modId + '/7')
        getOthers(url + modId + '/11')
    };

    var getHeadlights = function (url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderHeadlights(data);
            }
        });
    };

    var renderHeadlights = function (data) {
        let headlights = JSON.parse(data);
        let html = "";

        html += '<h5>Фары</h5>';
        for (var i in headlights) {
            html += '<div class="form-check">';
            html += '<label class="form-check-label" for="headlights' + i + '">';
            if (i == 0)
                html += '<input type="radio" class="form-check-input" name="headlights" id="headlights' + i + '" value="' + headlights[i].id + '" checked><b>' + headlights[i].name + '</b>';
            else
                html += '<input type="radio" class="form-check-input" name="headlights" id="headlights' + i + '" value="' + headlights[i].id + '"><b>' + headlights[i].name + '</b>';
            html += '</label>';
            html += '<label class="lblprice">' + headlights[i].price + '</label><label> руб.</label>';
            html += '</div>';
        }

        $('#divHeadlights').html(html);
    };

    var getWheels = function (url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderWheels(data);
            }
        });
    }

    var renderWheels = function (data) {
        let wheels = JSON.parse(data);
        let html = "";

        html += '<h5>Диски</h5>';
        for (var i in wheels) {
            html += '<div class="form-check">';
            html += '<label class="form-check-label" for="wheels' + i + '">';
            if (i == 0)
                html += '<input type="radio" class="form-check-input" name="wheels" id="wheels' + i + '" value="' + wheels[i].id + '" checked><b>' + wheels[i].name + '</b>';
            else
                html += '<input type="radio" class="form-check-input" name="wheels" id="wheels' + i + '" value="' + wheels[i].id + '"><b>' + wheels[i].name + '</b>';
            html += '</label>';
            html += '<label class="lblprice">' + wheels[i].price + '</label><label> руб.</label>';
            html += '</div>';
        }

        $('#divWheels').html(html);
    };

    var getSeats = function (url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderSeats(data);
            }
        });
    }

    var renderSeats = function (data) {
        let seats = JSON.parse(data);
        let html = "";

        html += '<h5>Сидения</h5>';
        for (var i in seats) {
            html += '<div class="form-check">';
            html += '<label class="form-check-label" for="seats' + i + '">';
            if (i == 0)
                html += '<input type="radio" class="form-check-input" name="seats" id="seats' + i + '" value="' + seats[i].id + '" checked><b>' + seats[i].name + '</b>';
            else
                html += '<input type="radio" class="form-check-input" name="seats" id="seats' + i + '" value="' + seats[i].id + '"><b>' + seats[i].name + '</b>';
            html += '</label>';
            html += '<label class="lblprice">' + seats[i].price + '</label><label> руб.</label>';
            html += '</div>';
        }

        $('#divSeats').html(html);
    };

    var getUpholsteries = function (url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderUpholsteries(data);
            }
        });
    }

    var renderUpholsteries = function (data) {
        let upholsteries = JSON.parse(data);
        let html = "";

        html += '<h5>Обивка сидений</h5>';
        for (var i in upholsteries) {
            html += '<div class="form-check">';
            html += '<label class="form-check-label" for="upholsteries' + i + '">';
            if (i == 0)
                html += '<input type="radio" class="form-check-input" name="upholsteries" id="upholsteries' + i + '" value="' + upholsteries[i].id + '" checked><b>' + upholsteries[i].name + '</b>';
            else
                html += '<input type="radio" class="form-check-input" name="upholsteries" id="upholsteries' + i + '" value="' + upholsteries[i].id + '"><b>' + upholsteries[i].name + '</b>';
            html += '</label>';
            html += '<label class="lblprice">' + upholsteries[i].price + '</label><label> руб.</label>';
            html += '</div>';
        }

        $('#divUpholsteries').html(html);
    };

    var getSteerings = function (url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderSteerings(data);
            }
        });
    }

    var renderSteerings = function (data) {
        let steerings = JSON.parse(data);
        let html = "";

        html += '<h5>Руль</h5>';
        for (var i in steerings) {
            html += '<div class="form-check">';
            html += '<label class="form-check-label" for="steerings' + i + '">';
            if (i == 0)
                html += '<input type="radio" class="form-check-input" name="steerings" id="steerings' + i + '" value="' + steerings[i].id + '" checked><b>' + steerings[i].name + '</b>';
            else
                html += '<input type="radio" class="form-check-input" name="steerings" id="steerings' + i + '" value="' + steerings[i].id + '"><b>' + steerings[i].name + '</b>';
            html += '</label>';
            html += '<label class="lblprice">' + steerings[i].price + '</label><label> руб.</label>';
            html += '</div>';
        }

        $('#divSteerings').html(html);
    };

    var getOthers = function (url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderOthers(data);
            }
        });
    }

    var renderOthers = function (data) {
        let others = JSON.parse(data);
        let html = "";

        html += '<h5>Другие опции</h5>';
        for (var i in others) {
            html += '<div class="form-check">';
            html += '<label class="form-check-label" for="others' + i + '">';
            html += '<input type="checkbox" class="form-check-input" name="others" id="others' + i + '" value="' + others[i].id + '"><b>' + others[i].name + '</b>';
            html += '</label>';
            html += '<label class="lblprice">' + others[i].price + '</label><label> руб.</label>';
            html += '</div>';
        }

        $('#divOthers').html(html);
    };

    return {
        init: init
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

    var modprice = "0";

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
                addVehicle(xhr.id);
            }
        });
    }

    var addVehicle = function (cid) {
        let engine = $('input[name="engines"]:checked').val();
        var status = "3";
        let color = $('input[name="colors"]:checked').val();

        $.ajax({
            url: '/api/vehicles/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                vin: null,
                engineFK: engine,
                statusFK: status,
                kitFK: null,
                colorFK: color
            }),
            success: function (xhr) {
                addContract(xhr.id, cid);
            }
        });
    }

    var addContract = function (vid, cid) {
        var total_Price = parseInt($('#price').text().replace(/\D+/g, ""));
        let date = new Date(2020, 5, 27);
        var vehicleFK = vid;
        var clientFK = cid;

        $.ajax({
            url: '/api/contracts/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                total_Price: total_Price,
                date: date,
                vehicleFK: vehicleFK,
                clientFK: clientFK
            })
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

    var open = function () {
        render();
    };

    var getModPrice = function () {
        $.ajax({
            url: '/api/models/2',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                modprice = JSON.parse(data).price
            }
        });
    }

    var render = function () {
        var model = $("#selModel option:selected").text();
        if (model == undefined)
            model = "A5 Coupe";
        var engineName = $('input[name="engines"]:checked').parent().text();
        var color = $('input[name="colors"]:checked').parent().text();
        getModPrice();

        var totalprice = parseInt(modprice);
        totalprice += parseInt($('input[name="engines"]:checked').parent().next().next().text());
        totalprice += parseInt($('input[name="colors"]:checked').parent().next().text());
        totalprice += parseInt($('input[name="headlights"]:checked').parent().next().text());
        totalprice += parseInt($('input[name="wheels"]:checked').parent().next().text());
        totalprice += parseInt($('input[name="upholsteries"]:checked').parent().next().text());
        totalprice += parseInt($('input[name="steerings"]:checked').parent().next().text());
        totalprice += parseInt($('input[name="seats"]:checked').parent().next().text());
        var arr = $('input[name="others"]:checked');
        for (var i = 0; i < arr.length; i++)
            totalprice += parseInt($(arr[i]).parent().next().text())

        let html = "";

        html += '<div id="err"></div>';
        html += '<div class="container childcontainer">';
        //html += "<img src =\"" + URL.createObjectURL(vehicles[i].image) + "\"/>";
        html += '<h3>Автомобиль</h3>';
        html += '<div class="listEl">'
        html += '<h4>' + model + '</h4>';
        html += '<p><b>Двигатель: </b>' + engineName + '</p>';
        html += '<p><b>Цвет: </b>' + color + '</p>';
        html += '<p id="price"><b>Стоимость: </b>' + totalprice.toString() + ' руб.</p>';
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
            Engines.init();
            Colors.init();
            Options.init();
        }
    }
})();

App.init();
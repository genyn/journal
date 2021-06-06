var Subjects = (function () {
    var el = "#container";

    var init = function () {
        getData();
    };

    var getData = function () {
        $.ajax({
            url: '/api/subjects',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                render(data);
            }
        });
    };

    var render = function (data) {
        let subjects = JSON.parse(data);

        let html = '';

        html += '<h2 class="mb-3">Выбор предмета и группы</h2>';
        html += '<div id="accordion">';
        for (var i in subjects) {
            html += '<div class="card">';
            html += '<div class="card-header">';
            html += '<a class="card-link" data-toggle="collapse" href="#collapse' + subjects[i].id + '">';
            html += subjects[i].name;
            html += '</a>';
            html += '</div>';
            html += '<div id="collapse' + subjects[i].id + '" class="collapse" data-parent="#accordion">';
            html += '<div class="card-body">';
            html += '<ul class="nav flex-column">';
            for (var j in subjects[i].groups) {
                html += '<li class="nav-item mb-2">';
                html += '<a class="btn btn-outline-primary btn-block" href="#" onclick="Events.init(' + subjects[i].groups[j].id + ')">' + subjects[i].groups[j].course + '-' + subjects[i].groups[j].number + '</a>';
                html += '</li>';
            }
            html += '</ul>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';

        $(el).html(html);
    };

    return {
        init: init
    };
})();

var getEventName = function (type) {
    switch (type) {
        case 1: {
            return "Лекция";
        }
        case 3: {
            return "Лабораторная работа";
        }
        case 4: {
            return "Промежуточный контроль";
        }
        case 5: {
            return "Экзамен";
        }
        case 6: {
            return "Зачет";
        }
        case 7: {
            return "Зачет с оценкой";
        }
    }
}

var Events = (function () {
    var el = "#container";

    var init = function (id) {
        getEvents(id);
    };

    var getEvents = function (id) {
        $.ajax({
            url: '/api/events/' + id,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderEvents(data, id);
            }
        });
    };

    var renderEvents = function (data, groupId) {
        let events = JSON.parse(data);

        let html = '';
        html += '<h2 class="mb-3">Учебные мероприятия группы</h2>';
        html += '<a class="btn btn-outline-primary btn-block mb-3" href="#" onclick="Subjects.init()">Вернуться к выбору группы</a>';

        html += '<button type="button" class="btn btn-outline-success btn-block mb-3" data-toggle="modal" data-target="#createModal" onclick="CreateModal.open(' + groupId + ')">Добавить учебное мероприятие</button>';

        if (events.length > 0) {
            html += '<table class="table table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th>Тип мероприятия</th>';
            html += '<th>Название</th>';
            html += '<th>Дата проведения</th>';
            html += '<th>Действия</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (var i in events) {
                html += '<tr>';
                html += '<td>' + getEventName(events[i].type) + '</td>';
                html += '<td>' + events[i].name + '</td>';
                html += '<td>' + events[i].date.split('T')[0] + '</td>';

                html += '<td>';
                html += '<div class="row">'
                html += '<div class="col-md-6">';
                html += '<button type="button" class="btn btn-outline-primary btn-block" data-toggle="modal" data-target="#updateModal" onclick="UpdateModal.open(' + groupId + ',' + events[i].id + ')">Изменить</button>';
                html += '</div>';
                html += '<div class="col-md-6">';
                html += '<button type="button" class="btn btn-outline-danger btn-block" onclick="Event.remove(' + groupId + ',' + events[i].id + ')">Удалить</button>';
                html += '</div>';
                html += '</div>';
                html += '</td>';

                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
        }
        else {
            html += '<h4>Список пуст</h4>';
        }

        $(el).html(html);
    };

    return {
        init: init
    };
})();

var CreateModal = (function () {

    var open = function (groupId) {
        render(groupId);
    };

    var render = function (groupId) {
        let html = "";

        html += '<div class="form-group mt-2">';
        html += '<label>Тип:</label>';
        html += '<select id="selTypeCreate">';
        html += '<option value="1">' + getEventName(1) + '</option>';
        html += '<option value="3">' + getEventName(3) + '</option>';
        html += '<option value="4">' + getEventName(4) + '</option>';
        html += '<option value="5">' + getEventName(5) + '</option>';
        html += '<option value="6">' + getEventName(6) + '</option>';
        html += '<option value="7">' + getEventName(7) + '</option>';
        html += '</select>';
        html += '</div>';

        html += '<div class="form-group mt-2">';
        html += '<label for="nameCreate">Название:</label>';
        html += '<input type="text" class="form-control" id="nameCreate" name="nameCreate">';
        html += '</div>';

        html += '<div class="form-group mt-2">';
        html += '<label for="dateCreate">Дата:</label>';
        html += '<input type="date" class="form-control" id="dateCreate" name="dateCreate">';
        html += '</div>';

        $("#createForm").html(html);

        html = '';

        html += '<button type="button" class="btn btn-primary" onclick="Event.create(' + groupId + ',' + groupId + ');">Добавить</button>';

        $("#divCreateFoot").html(html);
    };

    return {
        open: open
    };
})();

var UpdateModal = (function () {

    var open = function (groupId, id) {
        getEvent(groupId, id);
    };

    var getEvent = function (groupId, id) {
        $.ajax({
            url: '/api/events/event/' + id,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                render(groupId, data);
            }
        });
    };

    var render = function (groupId, data) {
        var event = JSON.parse(data);
        let html = "";

        html += '<div class="form-group mt-2">';
        html += '<label for="nameUpdate">Название:</label>';
        html += '<input type="text" class="form-control" id="nameUpdate" name="nameUpdate" value="' + event.name + '">';
        html += '</div>';

        html += '<div class="form-group mt-2">';
        html += '<label for="dateUpdate">Дата:</label>';
        html += '<input type="date" class="form-control" id="dateUpdate" name="dateUpdate" value="' + event.date.split('T')[0] + '">';
        html += '</div>';

        $("#UpdateForm").html(html);

        html = '';

        html += '<button type="button" class="btn btn-primary" onclick="Event.update(' + groupId + ',' + event.id + ');">Изменить</button>';

        $("#divUpdateFoot").html(html);
    };

    return {
        open: open
    };
})();

var Event = (function () {

    var create = function (groupId) {
        createReq(groupId);
    };

    var update = function (groupId, id) {
        updateReq(groupId, id);
    };

    var remove = function (groupId, id) {
        removeReq(groupId, id);
    };

    var createReq = function (groupId) {
        var name = $('#nameCreate').val();
        var date = $('#dateCreate').val();
        var type = $('#selTypeCreate').val();

        $.ajax({
            url: '/api/events/' + groupId,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                date: date,
                type: type,
                groupFk: groupId
            }),
            complete: function (resp) {
                if (resp.status === 200) {
                    Events.init(groupId);
                    $("#createModal").modal("hide");
                }
            }
        });
    };

    var updateReq = function (groupId, id) {
        var name = $('#nameUpdate').val();
        var date = $('#dateUpdate').val();

        $.ajax({
            url: '/api/events/' + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                date: date,
            }),
            complete: function (resp) {
                if (resp.status === 204) {
                    Events.init(groupId);
                    $("#updateModal").modal("hide");
                }
            }
        });
    };

    var removeReq = function (groupId, id) {
        $.ajax({
            url: '/api/events/' + id,
            type: 'DELETE',
            dataType: 'HTML',
            complete: function (resp) {
                if (resp.status === 204) {
                    Events.init(groupId);
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
            Subjects.init();
        }
    }
})();

App.init();
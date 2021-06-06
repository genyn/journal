var Subjects = (function () {
    var el = "#container";

    var init = function () {
        getCurrentUser();
    };

    var getCurrentUser = function () {
        $.ajax({
            url: "/api/Account/isAuthenticated",
            type: 'POST',
            dataType: 'HTML',
            success: function (resp) {
                //let str = JSON.parse(resp).user.userName;
                //let id = str[str.length - 1];

                getData(JSON.parse(resp).user.userName);
            }
        });
    };

    var getData = function (user) {
        $.ajax({
            url: '/api/subjects/' + user,
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
                html += '<a class="btn btn-outline-primary btn-block" href="#" onclick="Events.init(' + subjects[i].groups[j].id + ')">' + subjects[i].groups[j].course + '-' + subjects[i].groups[j].number +'</a>';
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
                renderEvents(data);
            }
        });
    };

    var renderEvents = function (data) {
        let events = JSON.parse(data);

        let html = '';
        html += '<h2 class="mb-3">Заполнение ведомости</h2>';
        html += '<a class="btn btn-outline-primary btn-block mb-3" href="#" onclick="Subjects.init()">Вернуться к выбору группы</a>';
        html += '<label>Учебное мероприятие: </label>';
        html += '<div>';
        html += '<select id="selEvent">';
        for (var i in events) {
            html += '<option value="' + events[i].id + ',' + events[i].type + '">' + events[i].name + ' - ' + events[i].date.split('T')[0] + '</option>';
        }
        html += '</select>';

        html += '<div class="mt-4" id="tableEvents"></div>'

        $(el).html(html);
        getEventStudent(events[0].id, events[0].type);

        $('#selEvent').on('change', function () {
            var arr = $('#selEvent').val().split(',');
            getEventStudent(arr[0], arr[1]);
        })
    };

    var getEventStudent = function (id, type) {
        $.ajax({
            url: '/api/events/student/' + id,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderEventStudent(data, type);
            }
        });
    };

    var renderEventStudent = function (data, type) {
        let events = JSON.parse(data);

        let html = '';

        if (events.length > 0) {
            html += '<table class="table table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th>ФИО студента</th>';
            if (type < 4) {
                html += '<th>Отсутствует на занятии</th>';
            }
            if (type > 2) {
                html += '<th>Оценка</th>';
            }
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (var i in events) {
                html += '<tr>';
                html += '<td>' + events[i].student.name + '</td>';

                if (type < 4) {
                    html += '<td>';
                    html += '<div class="form-check">';
                    html += '<label class="form-check-label" for="N' + events[i].id + '">';
                    if (events[i].n == true) {
                        html += '<input type="checkbox" class="form-check-input" id="N' + events[i].id + '" name="N' + events[i].id + '" checked>Н';
                    }
                    else {
                        html += '<input type="checkbox" class="form-check-input" id="N' + events[i].id + '" name="N' + events[i].id + '">Н';
                    }
                    html += '</label>';
                    html += '</div>';
                    html += '</td>';
                }

                if (type > 2) {
                    html += '<td>';
                    if (type == 6) {
                        html += '<div class="form-check-inline">';
                        html += '<label class="form-check-label" for="Zmark' + events[i].id + '">';
                        if (events[i].mark == null || events[i].mark == 0) {
                            html += '<input type="radio" class="form-check-input" id="Zmark' + events[i].id + '" name="optradio">Зачет';
                        }
                        else {
                            html += '<input type="radio" class="form-check-input" id="Zmark' + events[i].id + '" name="optradio" checked>Зачет';
                        }
                        html += '</label>';
                        html += '</div>';
                        html += '<div class="form-check-inline">';
                        html += '<label class="form-check-label" for="Nmark' + events[i].id + '">';
                        if (events[i].mark == null || events[i].mark == 5) {
                            html += '<input type="radio" class="form-check-input" id="Nmark' + events[i].id + '" name="optradio">Незачет';
                        }
                        else {
                            html += '<input type="radio" class="form-check-input" id="Nmark' + events[i].id + '" name="optradio">Незачет';
                        }
                        html += '</label>';
                        html += '</div>';
                    }
                    else {
                        html += '<input type="text" class="form-control" id="mark' + events[i].id + '" value="' + events[i].mark + '">';
                    }
                    html += '</td>';
                }

                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
        }
        else {
            html += '<h4>Ведомость отсутствует</h4>';
        }

        $('#tableEvents').html(html);

        for (let i in events) {
            let id = events[i].id;

            if (type < 4) {
                $('#N' + id).on('change', function () {
                    var n = false;
                    if ($('#N' + id).is(':checked')) {
                        n = true;
                    }
                    var mark;
                    if ($('#mark' + id).val() != 'null') {
                        mark = parseInt($('#mark' + id).val());
                    }

                    saveEventStudent(id, n, mark);
                })
            }

            if (type > 2) {
                if (type == 6) {
                    $('#Zmark' + id).on('change', function () {
                        saveEventStudent(id, false, 5);
                    })

                    $('#Nmark' + id).on('change', function () {
                        saveEventStudent(id, false, 0);
                    })
                }
                else {
                    $('#mark' + id).on('change', function () {
                        var n = false;
                        if ($('#N' + id).is(':checked')) {
                            n = true;
                        }
                        var mark;
                        if ($('#mark' + id).val() != 'null') {
                            mark = parseInt($('#mark' + id).val());
                        }

                        saveEventStudent(id, n, mark);
                    })
                }
            }
        }
    };

    var saveEventStudent = function (id, n, mark) {
        $.ajax({
            url: '/api/events/update/' + id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                n: n,
                mark: mark
            }),
            success: function () {
                //Records.init();
            }
        });
    }

    return {
        init: init
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
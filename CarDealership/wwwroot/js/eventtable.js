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

        html += '<div class="container">';
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
                html += '<a class="btn btn-outline-primary btn-block" href="#" onclick="EventTable.init(' + subjects[i].groups[j].id + ',' + subjects[i].finalType + ')">' + subjects[i].groups[j].course + '-' + subjects[i].groups[j].number + '</a>';
                html += '</li>';
            }
            html += '</ul>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';

        $(el).html(html);
    };

    return {
        init: init
    };
})();

var EventTable = (function () {
    var el = "#container";

    var init = function (id, finalType) {
        renderEventTypes(id, finalType);
    };

    var renderEventTypes = function (id, finalType) {
        let html = '';

        html += '<div class="container">';
        html += '<h2 class="mb-3">Успеваемость студентов</h2>';
        html += '<a class="btn btn-outline-primary btn-block mb-3" href="#" onclick="Subjects.init()">Вернуться к выбору группы</a>';
        html += '<label>Тип мероприятия: </label>';
        html += '<div>';
        html += '<select id="selEventType">';

        html += '<option value="1">Лекции</option>';
        //html += '<option value="2">Семинары</option>';
        html += '<option value="3">Лабораторные работы</option>';
        html += '<option value="4">Промежуточные контроли</option>';
        switch (finalType) {
            case 1: {
                html += '<option value="5">Экзамен</option>';
                break;
            }
            case 2: {
                html += '<option value="6">Зачет</option>';
                break;
            }
            case 3: {
                html += '<option value="7">Зачет с оценкой</option>';
                break;
            }
        }

        html += '</select>';
        html += '</div>';
        html += '</div>';

        html += '<div class="mt-4 mx-5" id="tableEvents"></div>'

        $(el).html(html);
        getEvents(id, 1);

        $('#selEventType').on('change', function () {
            getEvents(id, $('#selEventType').val());
        })
    };

    var getEvents = function (id, type) {
        $.ajax({
            url: '/api/events/' + id + '/' + type,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                getEventTable(id, type, data);
            }
        });
    };

    var getEventTable = function (id, type, events) {
        $.ajax({
            url: '/api/events/table/' + id + '/' + type,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                renderEventTable(events, data, type);
            }
        });
    };

    var renderEventTable = function (events_, students_, type) {
        let events = JSON.parse(events_);
        let students = JSON.parse(students_);

        let mapMarkSum = new Map();
        let mapLabCount = new Map();
        let mapAllMarkSum = new Map();

        let html = '';

        if (events.length > 0 && students.length > 0) {
            html += '<table class="table table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th>ФИО студента</th>';
            if (type > 4) {
                html += '<th>Сумма баллов</th>';
            }
            for (var i in events) {
                html += '<th>';
                html += '<p>' + events[i].name + '</p>';
                html += '<p>' + events[i].date.split('T')[0] + '</p>';
                html += '</th>';
            }
            if (type < 4) {
                html += '<th>Пропуски</th>';
            }
            if (type == 3) {
                html += '<th>Сумма баллов</th>';
                html += '<th>Средняя оценка</th>';
                html += '<th>Количество защищенных работ</th>';
            }
            html += '</tr>';
            html += '</thead>';

            var n, markSum, labCount;

            html += '<tbody>';
            for (var i in students) {
                n = 0; markSum = 0; labCount = 0;

                html += '<tr>';
                html += '<td>' + students[i].name + '</td>';
                if (type > 4) {
                    html += '<td>' + students[i].markSum + '</td>';
                }
                for (var j in students[i].events) {
                    html += '<td>';
                    if (students[i].events[j].mark != null) {
                        html += students[i].events[j].mark;
                        markSum += students[i].events[j].mark;
                        labCount++;
                    }
                    else if (students[i].events[j].n == true) {
                        html += 'Н';
                        n++;
                    }
                    html += '</td>';
                }
                if (type < 4) {
                    html += '<th>' + n + '</th>';
                }
                if (type == 3) {
                    html += '<th>' + markSum + '</th>';
                    html += '<th>' + markSum / labCount + '</th>';
                    html += '<th>' + labCount + '</th>';
                }
                html += '</tr>';

                mapMarkSum.set(students[i].name, markSum);
                mapLabCount.set(students[i].name, labCount);
                mapAllMarkSum.set(students[i].name, students[i].markSum);
            }
            html += '</tbody>';
            html += '</table>';

            if (type == 3) {
                html += '<div class="mt-4 d-flex" id="labCount" style="width: 100%; height: 600px; justify-content: center;"></div>';
                html += '<div class="my-4 d-flex" id="markSum" style="width: 100%; height: 600px; justify-content: center;"></div>';
            }
            if (type > 4) {
                html += '<div class="my-4 d-flex" id="allMarkSum" style="width: 100%; height: 600px; justify-content: center;"></div>';
            }
        }
        else {
            html += '<h4>Ведомость отсутствует</h4>';
        }

        $('#tableEvents').html(html);

        if (type == 3) {
            renderLabCountDiagram(mapLabCount);
            renderMarkSumDiagram(mapMarkSum);
        }
        if (type > 4) {
            renderAllMarkSumDiagram(mapAllMarkSum);
        }
    };

    var renderLabCountDiagram = function (map) {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Студент');
            data.addColumn('number', 'Количество защищенных работ');
            map.forEach((value, key) => {
                data.addRow([key, value]);
            });

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                }]);

            var options = {
                title: "Количество защищенных работ",
                width: 1200,
                height: 600,
                bar: { groupWidth: "95%" },
                legend: { position: "none" },
            };

            var chart = new google.visualization.ColumnChart(document.getElementById("labCount"));
            chart.draw(view, options);
        }
    };

    var renderMarkSumDiagram = function (map) {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Студент');
            data.addColumn('number', 'Сумма баллов');
            map.forEach((value, key) => {
                data.addRow([key, value]);
            });

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                }]);

            var options = {
                title: "Сумма баллов за лабораторные работы",
                width: 1200,
                height: 600,
                bar: { groupWidth: "95%" },
                legend: { position: "none" },
            };

            var chart = new google.visualization.ColumnChart(document.getElementById("markSum"));
            chart.draw(view, options);
        }
    };

    var renderAllMarkSumDiagram = function (map) {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Студент');
            data.addColumn('number', 'Рейтинг');
            map.forEach((value, key) => {
                data.addRow([key, value]);
            });

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                }]);

            var options = {
                title: "Рейтинг",
                width: 1200,
                height: 600,
                bar: { groupWidth: "95%" },
                legend: { position: "none" },
            };

            var chart = new google.visualization.ColumnChart(document.getElementById("allMarkSum"));
            chart.draw(view, options);
        }
    };

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
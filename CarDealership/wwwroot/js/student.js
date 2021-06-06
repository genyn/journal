var Subjects = (function () {
    var el = "#container";

    var init = function () {
        getData();
    };

    var getData = function () {
        $.ajax({
            url: '/api/subjects/groups',
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                render(data);
            }
        });
    };

    var render = function (data) {
        let groups = JSON.parse(data);

        let html = '';

        html += '<div class="container">';
        html += '<h2 class="mb-3">Выбор типа учебного мероприятия</h2>';
        html += '<div id="accordion">';
        for (var i in groups) {
            html += '<div class="card">';
            html += '<div class="card-header">';
            html += '<a class="card-link" data-toggle="collapse" href="#collapse' + groups[i].id + '">';
            html += groups[i].subject.name;
            html += '</a>';
            html += '</div>';
            html += '<div id="collapse' + groups[i].id + '" class="collapse" data-parent="#accordion">';
            html += '<div class="card-body">';
            html += '<ul class="nav flex-column">';

            html += '<li class="nav-item mb-2">';
            html += '<a class="btn btn-outline-primary btn-block" href="#" id="a1" onclick="EventTable.init(' + groups[i].id + ',1)">Лекции</a>';
            html += '</li>';
            html += '<li class="nav-item mb-2">';
            html += '<a class="btn btn-outline-primary btn-block" href="#" id="a3" onclick="EventTable.init(' + groups[i].id + ',3)">Лабораторные работы</a>';
            html += '</li>';
            html += '<li class="nav-item mb-2">';
            html += '<a class="btn btn-outline-primary btn-block" href="#" id="a4" onclick="EventTable.init(' + groups[i].id + ',4)">Промежуточные контроли</a>';
            html += '</li>';
            switch (groups[i].subject.finalType) {
                case 1: {
                    html += '<li class="nav-item mb-2">';
                    html += '<a class="btn btn-outline-primary btn-block" id="a5" href="#" onclick="EventTable.init(' + groups[i].id + ',5)">Экзамен</a>';
                    html += '</li>';
                    break;
                }
                case 2: {
                    html += '<li class="nav-item mb-2">';
                    html += '<a class="btn btn-outline-primary btn-block" id="a6" href="#" onclick="EventTable.init(' + groups[i].id + ',6)">Зачет</a>';
                    html += '</li>';
                    break;
                }
                case 3: {
                    html += '<li class="nav-item mb-2">';
                    html += '<a class="btn btn-outline-primary btn-block" id="a7" href="#" onclick="EventTable.init(' + groups[i].id + ',7)">Зачет с оценкой</a>';
                    html += '</li>';
                    break;
                }
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

    var init = function (id, type) {
        renderEventTypes(id, type);
    };

    var renderEventTypes = function (id, type) {
        let html = '';

        html += '<div class="container">';
        html += '<h2 class="mb-3">'
        html += $('#a' + type).text();
        html += '</h2>';
        html += '<a class="btn btn-outline-primary btn-block mb-3" href="#" onclick="Subjects.init()">Вернуться к выбору типа учебного мероприятия</a>';
        html += '</div>';

        html += '<div class="mt-4 mx-5" id="tableEvents"></div>'

        $(el).html(html);
        getEvents(id, type);
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

                if (students[i].name == "Васильева В.В.") {
                    html += '<tr class="bg-light">';
                }
                else {
                    html += '<tr>';
                }
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
            data.addColumn('string', 'color');
            map.forEach((value, key) => {
                data.addRow([key, value, "blue"]);
            });

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: function (dataTable, rowIndex) {
                        if (dataTable.getValue(rowIndex, 0) == "Васильева В.В.") {
                            return 'color: orange;';
                        }
                    },
                    type: "string",
                    role: "style"
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
            data.addColumn('string', 'color');
            map.forEach((value, key) => {
                data.addRow([key, value, "blue"]);
            });

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: function (dataTable, rowIndex) {
                        if (dataTable.getValue(rowIndex, 0) == "Васильева В.В.") {
                            return 'color: orange;';
                        }
                    },
                    type: "string",
                    role: "style"
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
            data.addColumn('string', 'color');
            map.forEach((value, key) => {
                data.addRow([key, value, "blue"]);
            });

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: function (dataTable, rowIndex) {
                        if (dataTable.getValue(rowIndex, 0) == "Васильева В.В.") {
                            return 'color: orange;';
                        }
                    },
                    type: "string",
                    role: "style"
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
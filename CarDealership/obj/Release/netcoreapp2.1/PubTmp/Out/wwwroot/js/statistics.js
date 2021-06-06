var Filter = (function () {

    var init = function () {
        renderYears();
        getDealers();
        renderVariants();
    };

    var renderYears = function () {
        var id = '#stat1_years';
        var idSel = 'stat1_yearsSel';
        renderYear(id, idSel);
        $(id).on('change', function () {
            Stat1.init();
        })

        id = '#stat2_years1';
        idSel = 'stat2_years1Sel';
        renderYear(id, idSel);
        $(id).on('change', function () {
            Stat2.init();
        })

        id = '#stat2_years2';
        idSel = 'stat2_years2Sel';
        renderYear(id, idSel);
        $(id).on('change', function () {
            Stat2.init();
        })

        id = '#stat3_years';
        idSel = 'stat3_yearsSel';
        renderYear(id, idSel);
        $(id).on('change', function () {
            Stat3.init();
        })

        id = '#stat4_years';
        idSel = 'stat4_yearsSel';
        renderYear(id, idSel);
        $(id).on('change', function () {
            Stat4.init();
        })
    };

    var renderYear = function (id, idSel) {
        let html = "";
        html += '<label>Год: </label>';

        html += '<select class="form-control" id="'+ idSel +'">';
        html += '<option value="0">2020</option>';
        html += '<option value="1">2021</option>';
        html += '</select>';

        $(id).html(html);
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

    var renderDealers = function (data) {
        let dealers = JSON.parse(data);

        var id = '#stat1_dealers';
        var idSel = 'stat1_dealersSel';
        renderDealer(dealers, id, idSel);
        $(id).on('change', function () {
            Stat1.init();
        })
        Stat1.init();

        var id = '#stat2_dealers1';
        idSel = 'stat2_dealers1Sel';
        renderDealer(dealers, id, idSel);
        $(id).on('change', function () {
            Stat2.init();
        })

        var id = '#stat2_dealers2';
        idSel = 'stat2_dealers2Sel';
        renderDealer(dealers, id, idSel);
        $(id).on('change', function () {
            Stat2.init();
        })
        Stat2.init();
        Stat3.init();
        Stat4.init();
    };

    var renderDealer = function (dealers, id, idSel) {
        let html = "";
        html += '<label class="mt-2">ДЦ: </label>';

        html += '<select class="form-control" id="' + idSel +'">';
        html += '<option value="0">Все</option>';
        for (var i in dealers) {
            html += '<option value="' + dealers[i].id + '">' + dealers[i].name + '</option>';
        }
        html += '</select>';

        $(id).html(html);
    };

    var renderVariants = function () {
        var id = '#stat1_variants';
        var idSel = 'stat1_variantsSel';
        renderVariant(id, idSel);
        $(id).on('change', function () {
            Stat1.init();
        });

        var id = '#stat2_variants';
        idSel = 'stat2_variantsSel';
        renderVariant(id, idSel);
        $(id).on('change', function () {
            Stat2.init();
        });

        var id = '#stat3_variants';
        idSel = 'stat3_variantsSel';
        renderVariant(id, idSel);
        $(id).on('change', function () {
            Stat3.init();
        });
    };

    var renderVariant = function (id, idSel) {
        let html = "";
        html += '<label>Данные: </label>';

        html += '<select class="form-control" id="' + idSel +'">';
        html += '<option value="0">Количество записей</option>';
        html += '<option value="1">Прибыль</option>';
        html += '</select>';

        $(id).html(html);
    };

    return {
        init: init
    };
})();

var Stat1 = (function () {

    var init = function () {
        getData();
    };

    var getData = function () {
        var year = $('#stat1_yearsSel option:selected').text();
        var did = $('#stat1_dealersSel').val();
        var variant = $('#stat1_variantsSel').val();

        $.ajax({
            url: '/api/statistics/' + year + '/' + did + '/' + variant,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                render(data, variant);
            }
        });
    };

    var render = function (data, variant) {
        var statistics = JSON.parse(data);

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var variantName = (variant == 0) ? 'Количество записей' : 'Прибыль, руб.';
            var data_ = google.visualization.arrayToDataTable([
                ['Месяц', variantName],
                ['Янв', statistics[0]],
                ['Фев', statistics[1]],
                ['Мар', statistics[2]],
                ['Апр', statistics[3]],
                ['Май', statistics[4]],
                ['Июн', statistics[5]],
                ['Июл', statistics[6]],
                ['Авг', statistics[7]],
                ['Сен', statistics[8]],
                ['Окт', statistics[9]],
                ['Ноя', statistics[10]],
                ['Дек', statistics[11]]
            ]);

            var options = {
                title: '',
                hAxis: { title: 'Год', titleTextStyle: { color: '#333' } },
                vAxis: { minValue: 0 }
            };

            var chart = new google.visualization.AreaChart(document.getElementById('stat1'));
            chart.draw(data_, options);
        }
    };

    return {
        init: init
    };
})();

var Stat2 = (function () {

    var init = function () {
        getData1();
    };

    var getData1 = function () {
        var year = $('#stat2_years1Sel option:selected').text();
        var did = $('#stat2_dealers1Sel').val();
        var variant = $('#stat2_variantsSel').val();

        $.ajax({
            url: '/api/statistics/' + year + '/' + did + '/' + variant,
            type: 'GET',
            dataType: 'HTML',
            success: function (data1) {
                getData2(data1);
            }
        });
    };

    var getData2 = function (data1) {
        var year = $('#stat2_years2Sel option:selected').text();
        var did = $('#stat2_dealers2Sel').val();
        var variant = $('#stat2_variantsSel').val();

        $.ajax({
            url: '/api/statistics/' + year + '/' + did + '/' + variant,
            type: 'GET',
            dataType: 'HTML',
            success: function (data2) {
                render(data1, data2, variant);
            }
        });
    };

    var render = function (data1, data2, variant) {
        var statistics1 = JSON.parse(data1);
        var statistics2 = JSON.parse(data2);

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data_ = google.visualization.arrayToDataTable([
                ['Месяц', 'ДЦ1', 'ДЦ1'],
                ['Янв', statistics1[0], statistics2[0]],
                ['Фев', statistics1[1], statistics2[1]],
                ['Мар', statistics1[2], statistics2[2]],
                ['Апр', statistics1[3], statistics2[3]],
                ['Май', statistics1[4], statistics2[4]],
                ['Июн', statistics1[5], statistics2[5]],
                ['Июл', statistics1[6], statistics2[6]],
                ['Авг', statistics1[7], statistics2[7]],
                ['Сен', statistics1[8], statistics2[8]],
                ['Окт', statistics1[9], statistics2[9]],
                ['Ноя', statistics1[10], statistics2[10]],
                ['Дек', statistics1[11], statistics2[11]]
            ]);

            var variantName = (variant == 0) ? 'Количество записей' : 'Прибыль, руб.';
            var options = {
                title: '',
                hAxis: { title: 'Год', titleTextStyle: { color: '#333' } },
                vAxis: { title: variantName, minValue: 0 }
            };

            var chart = new google.visualization.AreaChart(document.getElementById('stat2'));
            chart.draw(data_, options);
        }
    };

    return {
        init: init
    };
})();

var Stat3 = (function () {

    var init = function () {
        getData();
    };

    var getData = function () {
        var year = $('#stat3_yearsSel option:selected').text();
        var variant = $('#stat3_variantsSel').val();

        $.ajax({
            url: '/api/statistics/' + year + '/' + variant,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                render(data, variant);
            }
        });
    };

    var render = function (data, variant) {
        var statistics = JSON.parse(data);

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var variantName = (variant == 0) ? 'Количество записей' : 'Прибыль, руб.';
            var data_ = google.visualization.arrayToDataTable([
                ['ДЦ', variantName, { role: "style" }],
                [$("#stat1_dealersSel option[value='1']").text(), statistics[0], "orange"],
                [$("#stat1_dealersSel option[value='2']").text(), statistics[1], "blue"],
                [$("#stat1_dealersSel option[value='3']").text(), statistics[2], "orange"],
                [$("#stat1_dealersSel option[value='4']").text(), statistics[3], "blue"],
                [$("#stat1_dealersSel option[value='5']").text(), statistics[4], "orange"],
                [$("#stat1_dealersSel option[value='6']").text(), statistics[5], "blue"],
                [$("#stat1_dealersSel option[value='7']").text(), statistics[6], "orange"],
                [$("#stat1_dealersSel option[value='8']").text(), statistics[7], "blue"],
                [$("#stat1_dealersSel option[value='9']").text(), statistics[8], "orange"],
                [$("#stat1_dealersSel option[value='10']").text(), statistics[9], "blue"]
            ]);

            var view = new google.visualization.DataView(data_);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                },
                2]);

            var options = {
                title: "",
                width: 1050,
                height: 600,
                bar: { groupWidth: "95%" },
                legend: { position: "none" },
            };

            var chart = new google.visualization.ColumnChart(document.getElementById("stat3"));
            chart.draw(view, options);
        }
    };

    return {
        init: init
    };
})();

var Stat4 = (function () {

    var init = function () {
        getData();
    };

    var getData = function () {
        var year = $('#stat4_yearsSel option:selected').text();

        $.ajax({
            url: '/api/statistics/' + year,
            type: 'GET',
            dataType: 'HTML',
            success: function (data) {
                render(data);
            }
        });
    };

    var render = function (data) {
        var statistics = JSON.parse(data);

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data_ = new google.visualization.DataTable();
            data_.addColumn('string', 'Модель');
            data_.addColumn('number', 'Количество');
            for (var i in statistics) {
                data_.addRow([statistics[i].name, statistics[i].count]);
            }

            var options = {
                title: ''
            };

            var chart = new google.visualization.PieChart(document.getElementById("stat4"));
            chart.draw(data_, options);
        }
    };

    return {
        init: init
    };
})();

var App = (function () {
    return {
        init: function () {
            Filter.init();
        }
    }
})();

App.init();
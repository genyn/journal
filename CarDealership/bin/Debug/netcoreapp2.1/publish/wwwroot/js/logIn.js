function logIn() {
    var login, password = "";
    // Считывание данных с формы
    login = document.getElementById("login").value;
    password = document.getElementById("password").value;

    var request = new XMLHttpRequest();
    request.open("POST", "/api/Account/Admin/Login");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    clearLogIn();
    request.onload = function () {
        // Очистка контейнера вывода сообщений
        // Обработка ответа от сервера
        if (request.responseText !== "") {
            var msg = JSON.parse(request.responseText);
            if (msg.message != "") {
                document.getElementById("msg").innerHTML = '<span class="badge badge-danger">' + msg.message + '</span>';
                // Вывод сообщений об ошибках
                if (typeof msg.error !== "undefined" && msg.error.length > 0) {
                    for (var i = 0; i < msg.error.length; i++) {
                        var ul = document.getElementById('formError');
                        var li = document.createElement("li");
                        li.appendChild(document.createTextNode(msg.error[i]));
                        ul.appendChild(li);
                    }
                }
                document.getElementById("Password").value = "";
            }
            else {
                if (msg.isMain == true) {
                    document.location.href = "models.html";
                }
                else {
                    document.location.href = "maintenance.html";
                }
            }
        }
    };

    // Запрос на сервер
    request.send(JSON.stringify({
        email: login,
        password: password
    }))
}

function logOff() {
    var request = new XMLHttpRequest();
    request.open("POST", "api/account/logoff");
    request.onload = function () {
        document.location.href = "login.html";
    };
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send();
}

function clearLogIn() {
    document.getElementById("msg").innerHTML = "";
    var mydiv = document.getElementById('formError');
    while (mydiv.firstChild) {
        mydiv.removeChild(mydiv.firstChild);
    }
}

function getCurrentUser() {
    let request = new XMLHttpRequest();
    request.open("POST", "/api/Account/isAuthenticated");
    request.onload = function () {
        let myObj = JSON.parse(request.responseText);
        let html = "";
        if (myObj.isMain) {
            document.location.href = "models.html";
        }
        else {
            document.location.href = "maintenance.html";
        }

    };
    request.send();
}
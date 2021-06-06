$(document).ready(getCurrentUser());

function logIn() {
    var email, password = "";
    var rememberme = false;
    // Считывание данных с формы
    email = document.getElementById("Email").value;
    password = document.getElementById("Password").value;
    if ($('#Remember').is(':checked')) {
        rememberme = true;
    }
    else {
        rememberme = false;
    }
    var request = new XMLHttpRequest();
    request.open("POST", "/api/Account/Login");
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
                $("#logInModal").modal("hide");
                getCurrentUser();

                if (msg.x == true)
                    document.location.href = "vehiclesInStock.html";
                else
                    document.location.href = "index.html";
            }
        }
    };

    // Запрос на сервер
    request.send(JSON.stringify({
        email: email,
        password: password,
        rememberme: rememberme
    }))
}

function logOff() {
    var request = new XMLHttpRequest();
    request.open("POST", "api/account/logoff");
    request.onload = function () {
        getCurrentUser();
        document.location.href = "vehiclesInStock.html";
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
        if (!myObj.user) {
            html += '<li class="nav-item"><a class="nav-link" id="loginBtn" data-toggle="modal" onclick="clearLogIn();" data-target="#logInModal" href ="#">Вход</a ></li ><li class="nav-item"><a class="nav-link" href="register.html">Регистрация</a></li>';
        }
        else {
            html += '<li class="nav-item"><a class="nav-link" href ="#">' + myObj.user.userName + '</a ></li ><li class="nav-item"><a class="nav-link" onclick="logOff();" href="#">Выход</a></li>';
        }
        document.getElementById("logIn").innerHTML = html;
    };
    request.send();
}
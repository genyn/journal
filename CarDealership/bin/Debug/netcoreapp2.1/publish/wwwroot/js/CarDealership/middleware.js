$(document).ready(getCurrentUser());

function getCurrentUser() {
    let request = new XMLHttpRequest();
    request.open("POST", "/api/Account/isAuthenticated");
    request.onload = function () {
        let myObj = JSON.parse(request.responseText);
        let html = "";
        if (myObj.isMain) {
            document.location.href = "vehiclesInStock.html";
        }
        else {
            document.location.href = "config.html";
        }

    };
    request.send();
}
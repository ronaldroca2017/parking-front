$(document).ready(function() {
    $.ajax({
        url: "http://127.0.0.1:8000/api/users"
    }).then(function(data) {
       $('.miname').append(data.name);
       $('.correo').append(data.email);
    });
});
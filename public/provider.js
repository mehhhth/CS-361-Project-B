// Switches the html to the create form
document.getElementById('yesCheck').addEventListener("click", function(){
    document.getElementById('ifYes').style.display = 'block';
    document.getElementById('ifNo').style.display = 'none';
});

// Switches the html to the update form
document.getElementById('noCheck').addEventListener("click", function(){
    document.getElementById('ifNo').style.display = 'block';
    document.getElementById('ifYes').style.display = 'none';
});

// Submits an AJAX request for create form
document.getElementById('submitCreate').addEventListener("click", function(event){
    event.preventDefault();
    
    // Creates the request
    var req = new XMLHttpRequest();
    req.open("POST", "/add-provider", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    // Notifies the user if the data was added to the database
    req.addEventListener("load", function() {
        var res_field = document.getElementById("response_text");
        var res = JSON.parse(req.responseText);
        if (res["no_error"] == "true")
            res_field.innerText = "Provider Added";
        else
            res_field.innerText = "Error: Provider Not Added\n" +
                "One of the following has happened:\n" +
                "**The name field was left blank OR \n" +
                "**The name was alreadt in the database OR \n" +
                "**Their was a server/ database error";
    });

    // Sends the request
    req.send(JSON.stringify({
        name: document.getElementById('createName').value,
        bedT: document.getElementById('createBedT').value,
        bedA: document.getElementById('createBedA').value
    }));
});

// Submits an AJAX request for update form
document.getElementById('submitUpdate').addEventListener("click", function(event){
    event.preventDefault();
    
    // Creates the request
    var req = new XMLHttpRequest();
    req.open("POST", "/update-provider", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    // Notifies the user if the data was updated in the database
    req.addEventListener("load", function() {
        var res_field = document.getElementById("response_text");
        var res = JSON.parse(req.responseText);
        if (res["no_error"] == "true")
            res_field.innerText = "Provider Update";
        else
            res_field.innerText = "Error";
    });

    // Gets the selected item from the drop down menu
    var dropDown = document.getElementById('updateID')
    var index = dropDown.selectedIndex;
    var selID = dropDown.options[index].value;

    // Sends the request
    req.send(JSON.stringify({
        ID: selID,
        bedT: document.getElementById('updateBedT').value,
        bedA: document.getElementById('updateBedA').value
    }));
});
document.getElementById('yesCheck').addEventListener("click", function(){
    document.getElementById('ifYes').style.display = 'block';
    document.getElementById('ifNo').style.display = 'none';
});

document.getElementById('noCheck').addEventListener("click", function(){
    console.log('working');
    document.getElementById('ifNo').style.display = 'block';
    document.getElementById('ifYes').style.display = 'none';
});

document.getElementById('submitCreate').addEventListener("click", addProvider);

function addProvider(event){
    event.preventDefault();
    var req = new XMLHttpRequest();
    req.open("POST", "/add-provider", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify({
        name: document.getElementById('createName').value,
        bedT: document.getElementById('createBedT').value,
        bedA: document.getElementById('createBedA').value
    }));
}
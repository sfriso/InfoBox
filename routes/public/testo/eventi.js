var urleventi = "http://localhost:5000/uploader/rispostaeventi";



function sendRequest(url, tipo){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
        var html = '';
        var evento;
        var i=0;
        var max;
        console.log(data[0]);
        data.forEach(function(){
            i++;
            max = i;
            html += '<h3 class="title">' + data[i].titolo + '</h3> <br>';
            html += '<p class="testo">' + data[i].testo + '</p> <br>';
            html += '<p class="data>' + data[i]. data + '</p> <br>';
        })
        var ins = document.getElementById(tipo);
        console.log("html");
		ins.innerHTML = html;
	}
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();    
}


window.onload = function() {
    console.log("windows onload");
    sendRequest(urleventi, "eventi");
}
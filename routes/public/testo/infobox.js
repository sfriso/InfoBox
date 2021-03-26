var APPID = "50bfe23e011f29bf49ebb01dcc8a53c7";
var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;
var lat = "44.4161";
var lon = "12.2018";
var icon_prima;


function loginmenu(){
	var el = document.getElementById('login');
	if(el.style.zIndex < 0){
	el.style.zIndex = 2;
	el.style.top = "0.5%";
}
	else{
		el.style.zIndex = -1;
	el.style.top = "-50%";
	}
}

function cambia(weather){
	
	var html = document.body;
	var elem = document.getElementsByClassName('elemento');
	// cambia colori
	// quando c'è il sole
	if( 800 == weather.code && !(800 == icon_prima)){
		console.log("sole");
		console.log(elem);
		html.style.backgroundColor = "rgb(202, 161, 47)";
			document.getElementById("background_video").src = "../background/sole.mp4";
		
		html.style.color = "rgb(95, 53, 19)";
		for(i = 0; i < elem.length  ; i++){
			console.log(elem[i]);
			elem[i].style.backgroundColor="rgba(220, 199, 170, 0.5)";

		}

	}
	
	// quando c'è la neve
	else if( ((600 <= weather.code && 622>= weather.code) || weather.code == 511) && !((600 <= icon_prima && 622>= icon_prima) || icon_prima == 511) ){
		console.log("neve");
		html.style.backgroundColor = "#adc9da";
		document.getElementById("background_video").src= "../background/neve.mp4";
		html.style.color = "white";
		for(i = 0; i < elem.length  ; i++){
			elem[i].style.backgroundColor="rgba(170, 170, 170, 0.5)";

		}

	}
	// quando c'è nuvoloso
	else if( (( weather.code == 803 || weather.code == 804) && !( icon_prima == 803 || icon_prima == 804))){
		console.log("nuvoloso o nebbia");
		html.style.backgroundColor = "#b9b9b9";
		document.getElementById("background_video").src = "../background/nuvole_scure.mp4";
		html.style.color = "black";
		for(i = 0; i < elem.length  ; i++){
			elem[i].style.backgroundColor="rgba(245, 245, 245, 0.5)";
			}
	
	}
	// quando c'è nuvolo con un po di sole

	else if( (801 <= weather.code &&  weather.code <= 802) && !(801 <= icon_prima && icon_prima <= 802)){
		console.log("nuvoloso o nebbia");
		html.style.backgroundColor = "#b9b9b9";
		document.getElementById("background_video").src = "../background/nuvoloso.mp4";
		html.style.color = "black";
		for(i = 0; i < elem.length  ; i++){
			elem[i].style.backgroundColor="rgba(245, 245, 245, 0.5)";
			}
	
	}

	//nebbia
	else if( ((701 <= weather.code && 781>= weather.code)) && !((701 <= icon_prima && 781>= icon_prima))){
		console.log("nuvoloso o nebbia");
		html.style.backgroundColor = "#b9b9b9";
		document.getElementById("background_video").src = "../background/nebbia.mp4";
		html.style.color = "black";
		for(i = 0; i < elem.length  ; i++){
			elem[i].style.backgroundColor="rgba(245, 245, 245, 0.5)";
			}
	
	}
	// quando piove
	else if( ((233 <= weather.code && 504>= weather.code) || (520 <= weather.code && 531>= weather.code)) && !((233 <= icon_prima && 504>= icon_prima) || (520 <= icon_prima && 531>= icon_prima))){
		console.log("piove");
		html.style.backgroud = "#141685";
		
		document.getElementById("background_video").src = "../background/pioggia.mp4";
		html.style.color = "black";
		for(i = 0; i < elem.length  ; i++){
			elem[i].style.backgroundColor="rgba(230, 229, 255, 0.5)";
			}
	
	}
	//temporale
	else if( ((200 <= weather.code && 232>= weather.code) && !((200 <= icon_prima && 232>= icon_prima)))){
		console.log("piove");
		html.style.backgroud = "#141685";
		
		document.getElementById("background_video").src = "../background/fulmini.mp4";
		html.style.color = "black";
		for(i = 0; i < elem.length -1 ; i++){
			elem[i].style.backgroundColor="rgba(116, 171, 235, 0.5)";
			}
	
	}
	icon_prima = weather.code;
}


function update(weather) {
    icon.src = "/weather/" + weather.code + ".png"
    humidity.innerHTML = weather.humidity;
    direction.innerHTML = weather.direction;
    loc.innerHTML = weather.location;
    temp.innerHTML = weather.temp;
	wind.innerHTML = weather.wind;
	cambia(weather);
}



function meteo() {
    temp = document.getElementById("temperature");
    loc = document.getElementById("location");
    icon = document.getElementById("icon");
    humidity = document.getElementById("humidity");
    wind = document.getElementById("wind");
    direction = document.getElementById("direction");
    updateByGeo(lat, lon);
	setTimeout(function(){
	    	meteo();
	    }, 5000);
	}

function updateByGeo(lat, lon){
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
	"lat=" + lat +
	"&lon=" + lon +
	"&APPID=" + APPID;
    sendRequestmeteo(url);    
}




function sendRequestmeteo(url){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
	    var weather = {};
	    weather.code = data.weather[0].id;
	    weather.humidity = data.main.humidity;
	    weather.wind = data.wind.speed;
	    weather.direction = degreesToDirection(data.wind.deg)
	    weather.location = data.name;
	   
	    weather.temp = K2C(data.main.temp);
      weather.wind = Mph2KmH(data.wind.speed);
		update(weather);
	}
    };

    xmlhttp.open("GET", url, true);
	xmlhttp.send();   
	console.log("inviato"); 
}

function degreesToDirection(degrees){
    var range = 360/16;
    var low = 360 - range/2;
    var high = (low + range) % 360;
    var angles = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    for( i in angles ) {
	if(degrees >= low && degrees < high){
	    return angles[i];
	    console.log("derp");
	}
	low = (low + range) % 360;
	high = (high + range) % 360;
    }
    return "N";
    
}

function K2F(k){
    return Math.round(k*(9/5)-459.67);
}

function K2C(k){
    return Math.round(k - 273.15);
}

function Mph2KmH(w){
	return parseFloat(Math.round(w * 100 * 0.621371) / 100).toFixed(2);
}


// ---------------------------------orologio------------------------------------


function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var d = today.getDate();
  var me = today.getMonth() + 1;
  var y = today.getFullYear();
  var orologio = '';

  var data;
  m = checkTime(m);
  s = checkTime(s);
  h = checkTime(h);
  d = checkTime(d);
  me = checkTime(me);
  
  orologio= 
  "<div id = 'data'>Data di oggi:<br>"+ d 
  + "/" + me + "/" + y + "</div>"+
  "<div id = 'ora'>Ora esatta:<br>" + h + ":" + m + ":" + s + "</div>" ;
  document.getElementById('orologio').innerHTML = orologio;
  data = document.getElementById("data");
  ora = document.getElementById("ora");
  data.style.textAlign = 'center'
  ora.style.textAlign = 'center'
  if((s%20) < 10){
    data.style.display = 'none';
    ora.style.display = 'block';
  
    var t = setTimeout(startTime, 500);  }
  else{

  data.style.display = 'block';
  ora.style.display = 'none';
    var t = setTimeout(startTime, 500);
  }
  
}

function checkTime(f){
  if(f < 10){
   f = '0' + f;
  }
   return f;
}

//--------------------------------ansa--------------------------------------

var appID = "518dca7c4766492b8e66fa2f1a47fd98"
var url = "https://newsapi.org/v2/top-headlines?"+
		"sources=ansa&apiKey=518dca7c4766492b8e66fa2f1a47fd98"
var titolo;
var desrzione;
var r;
var slideIndex;

	
	

 


function sendRequestn(url){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			data = JSON.parse(xmlhttp.responseText);
			var html = '';
			var i = 0;
			var article;
			var title;
			console.log(data);
			data.articles.forEach(function(){
				article = data.articles[i];
				i++;
				html += '<h3 class="title">'+article.title.replace(" - Ultima Ora", "")+'</h3> <br>';
				html += '<p class="description">'+article.description.replace("(ANSA)", "")+'</p> <br> ';
				

			});

			slideIndex = 1;
			var r = 0;
			var ins = document.getElementById("notizia")
			ins.innerHTML = html;
			showSlide(slideIndex, r);
		}
	}

	xmlhttp.open("GET",url, true);
	xmlhttp.send();
}

//--slider--


function showSlide(n, r){
	var i;
	var titolo = document.getElementsByClassName("title");
  	var descrizione = document.getElementsByClassName("description");
  	if (n > titolo.length) {slideIndex = 1}    
  	if (n < 1) {slideIndex = titolo.length}
  		slideIndex = n;
  	for (i = 0; i < titolo.length; i++) {
  		titolo[i].style.display = 'none'; 
  		descrizione[i].style.display = 'none'; 
  }
  	
  		
  	if(r < 10 - 1){ 
  		titolo[slideIndex - 1].style.display = 'block'; 
  		descrizione[slideIndex - 1].style.display = 'block';
  		r++;
		n++;
		
  		setTimeout(function(){
  			showSlide(n, r)
  		}, 10000);
  	}
  	else {
  		
  		titolo[slideIndex - 1].style.display = 'block'; 
  		descrizione[slideIndex - 1].style.display = 'block';
  		
  		setTimeout(function(){
  			sendRequestn(url);
  		}, 10000);
  	}
  		
}

//diseguito sono state implentate due funzioni per la gestione dei testi

function sendRequesttesto(url, tipo){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var cosa = JSON.parse(JSON.parse(xmlhttp.responseText));
			var html = '';
			var i = 0;
			console.log(cosa[0].titolo);
			cosa.forEach(function(){
				console.log(cosa[i].titolo);
				var t = cosa[i].titolo;
				html += '<h2 class="title'+tipo+'">'+ t +'</h2> <br>';
				html += '<p class="description'+tipo+'">'+ cosa[i].testo +'</p> <br>';
				html += '<p class="data'+tipo+'"> In data: '+ cosa[i].data.slice(0, -14) +'</p> <br>';
				
				i++;

			});

			var elemento = 0;
			var ins = document.getElementById(tipo);
			ins.innerHTML = html;
			Sliders(elemento, tipo);
		}
	}

	xmlhttp.open("GET",url, true);
	xmlhttp.send();
}

function Sliders(n, tipo){
	var i;
	var titolo = document.getElementsByClassName("title"+tipo);
	console.log("numero di elementi: "+titolo.length);
	console.log(titolo);
	console.log(titolo[0]);
	var descrizione = document.getElementsByClassName("description"+tipo);
	 var data = document.getElementsByClassName("data"+tipo); 
	  for(i=0; i <= titolo.length -1 ;i++){
  		titolo[i].style.display = 'none'; 
  		descrizione[i].style.display = 'none'; 
		  data[i].style.display = 'none'; 
		  
  };
  	//	console.log("numero di iterazioni"+i);
  	if(n < titolo.length-1 ){ 
  		titolo[n ].style.display = 'block'; 
		descrizione[n ].style.display = 'block';
  		data[n].style.display = 'block'; 
  		n++;
  		setTimeout(function(){
  			Sliders(n, tipo)
  		}, 5000);
  	}
  	else {
  		titolo[n].style.display = 'block'; 
		descrizione[n].style.display = 'block';
		data[n].style.display = 'block';
  		
  		setTimeout(function(){
  			sendRequesttesto("/uploader/risposta"+tipo, tipo);
  		}, 5000);
  	}
  		
}
//_____________________________________________________camanelle

function popolacampanella(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			console.log(xmlhttp.responseText);
			var ora = JSON.parse(xmlhttp.responseText);
			var campanella = document.getElementById("campanella");
			campanella.innerHTML = '<h2> Campanelle di oggi:</h2>';
			var i=0;
			console.log(ora)

			for(var i = 0; i < 11; i++){
				campanella.innerHTML += "<div class='testo_campanella'><strong><img src='/weather/bell.png' style='height: 20px; width: 20px;'>  "+ ora[i].ore +"</div></strong></img>";
				
			}
		}
			

		}
	
	xmlhttp.open("GET","/uploader/ritornacampanelle", true);
	xmlhttp.send();
	setTimeout(popolacampanella, 30000);
}


//___________________________________________SLIDESHOW


function videoevideo(video1, video2){
	//video1.onended = function(){
		video1.style.opacity=0;
		video2.play();
		video2.style.opacity=1;
		 video2.onended = function(){slider();}
	//}
}
function immagineevideo(image, video1){
	image.style.opacity=0;
    video1.play();
	video1.style.opacity=1;
	video1.onended = function(){ slider();}
}

function videoeimmagine(video, image){
		//video.onended = function(){
		video.style.opacity=0;
		image.style.opacity=1;
		window.setTimeout(function(){slider()}, 5000);
//	}
}
function immagineeimmagine(image1, image2){
	image1.style.opacity=0;
	image2.style.opacity=1;
	window.setTimeout( function(){slider()}, 5000)
}

function decide(prima, dopo){
	if(prima.className == 'video'){
		if(dopo.className == 'video'){
			videoevideo(prima, dopo);
		}
		if(dopo.className == 'image')
			videoeimmagine(prima, dopo);
	}
	if(prima.className == 'image'){
		if(dopo.className == 'video'){
			immagineevideo(prima, dopo);
		}
		if(dopo.className == 'image'){
			immagineeimmagine(prima, dopo);
		}
	}
	
	
}
var k = document.getElementsByClassName('video').length + document.getElementsByClassName('image').length -1;
var i = -1;
function slider(){
	i = k;
	k++;
	
	if(document.getElementById((k).toString()) == null){
		k= 0;
	}
	decide(document.getElementById(i.toString()), document.getElementById((k).toString()));
	
}

	
	
function tutto_schermo(){
	if(!(window.innerHeight == screen.height)){
	document.querySelector('html').requestFullscreen();
		}else{
			document.exitFullscreen();
			
	}
}


window.onload = function(){
	meteo();
	startTime();
	sendRequestn(url);
	

	sendRequesttesto("/uploader/rispostaeventi/", "eventi");
	sendRequesttesto("/uploader/rispostaattivita/", "attivita");
	sendRequesttesto("/uploader/rispostaavviso/", "avviso");
	popolacampanella();
	slider();

	//Sliders(0, "avviso");

}
var appID = "518dca7c4766492b8e66fa2f1a47fd98"
var url = "https://newsapi.org/v2/top-headlines?"+
		"sources=ansa&apiKey=518dca7c4766492b8e66fa2f1a47fd98"
var titolo;
var desrzione;
var r;
var slideIndex;



window.onload = function () {
	
	sendRequest(url);
}
 


function sendRequest(url){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			data = JSON.parse(xmlhttp.responseText);
			var html = '';
			var i = 0;
			var article;
			var title;
			data.articles.forEach(function(){
				article = data.articles[i];
				i++;
				html += '<h3 class="title">'+article.title+'</h3> <br>';
				html += '<p class="description">'+article.description+'</p> <br>';

			});

			slideIndex = 1;
			var r = 0;
			var ins = document.getElementById("notizie")
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
  		}, 3000);
  	}
  	else {
  		
  		titolo[slideIndex - 1].style.display = 'block'; 
  		descrizione[slideIndex - 1].style.display = 'block';
  		
  		setTimeout(function(){
  			sendRequest(url);
  		}, 2900);
  	}
  		
}



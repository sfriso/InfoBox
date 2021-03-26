const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
var mysql = require('mysql');

var message="";
var array;






var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "dashboard"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("conesso al database!");
});


const redirectLogin =(req, res, next) =>{
    console.log(JSON.stringify(req.session))
    if(!req.session.userId){

		console.log("sono dentro al controllo "+req.session.userId);
		res.redirect('/');
    }else{
        next();
    }
}

router.get('/',redirectLogin, function(req, res){

	res.render('uploader');
})

router.get('/multimedia',redirectLogin,function(req, res){
	
	fs.readdir(__dirname+"/public/uploaded/", function(err, items) {
		if(err){
			res.readdir('uploader/multimedia');
		}
		var array = items;
		console.log("sono quiiiiiiii");
		console.log();
		console.log(items);	
		console.log(JSON.stringify(items));				
		res.render('slideshow preview.ejs',  {message: message,
			array: array});
		}
	);
})

router.get('/multimedia/:data',redirectLogin,function(req, res){
	var data = req.params.data;
	
	fs.readdir(__dirname+"/public/uploaded/", function(err, items) {
		var array = items;
		console.log(JSON.parse('["'+array[data]+'"]'));
		res.render('slideshow preview.ejs',  {message: message, array: JSON.parse('["'+array[data]+'"]')});
	})
})
//router.get('/modifica',  (req, res) => res.send('pagina a caso'));
router.post('/modifica',redirectLogin, function(req, res){ // uploader delle imaggi e video con controllo
	message="";
	if(!req.file || req.file.mimetype == undefined){
		res.redirect('/uploader/multimedia');
	}
		console.log("path = " + __dirname + "/public/uploaded");
		console.log("mimetype: "+req.files.mimetype);
			
	if(req.files){
		var file = req.files.filename;
		var filename = file.name;
		console.log(file.mimetype);
		if(file.mimetype !='image/jpeg' && file.mimetype != "image/png" && file.mimetype != "video/avi" && file.mimetype !="video/mp4" ){ // se questo file non è uno dei file elencati non è possibile caricarlo
			console.log("non sono accettato");
			 message = "Questo file non è supportato!";
			 res.redirect('/uploader/multimedia');
				}

		
					else{
			//	con.query("INSERT INTO nome (nomefile) VALUES ('"+ filename + "')");//inserisco il nome del file nel databse
		file.mv( __dirname+"/public/uploaded/"+filename, function(err){
			
			if(err){
				console.log(err)
	//S			con.query("DELETE FROM nome WHERE nomefile = '"+ nomefile +"'and ID = (select count(*) from nome);"); // in caso di errore cancello dal database
		res.redirect('/uploader/multimedia')
			}
			// inserire il nome in un database, in modo tale che sappia il suo nome quando poi lo mettero nel html in modo dinamico
			else{
				
				
				res.end();;	
				
				
			}
		
		}
		)}
		
	
	}
}

	//fs.unlink cancella il file
	
	);

router.get('/delete/:data',redirectLogin, function(req, res){
	var data = req.params.data;
	console.log(req.params.data);
	fs.unlink(__dirname+"/public/uploaded/"+ data , (err) => {
		if (err) console.log(err);
	  });
	  console.log('cancellato il file '+ data);
		res.redirect('/uploader/multimedia');	
});
router.get("/campanelle",redirectLogin, function(req, res){
	var dat =[] ;
	var n = new Date();

	con.query("SELECT * FROM `globale` WHERE data<>'00-00-0000' and data='"+ n.getFullYear() + '-' + ('0'+  (n.getMonth() +1)).slice(-2) + '-' + ((('0'+  (n.getDate())).slice(-2)))+"' AND tipo= 'campanella' ", function(err, result, fields){
//ritorna le campanelle della data di oggi 		
		console.log("oggi è il: "+ n.getDate());
		
		if(err){
			console.log(err);
			var i, k = ((((Date.now() / 1000 | 0) + (2 * 60 * 60)) / (60 * 60 * 24) ) | 0 ) % 7;
	var giorni = ["giovedì", "venerdì", "sabato", "domenica", "lunedì", "martedì", "mercoledì"];
	console.log("il timestamp: "+ (giorni[k]));
	var date = giorni[k];
	
	res.redirect('/uploader/campanelle/'+date+"");
		}
		else{
			console.log("Sono quiiiiiiiiii");
			console.log(result);
			result = JSON.stringify(result);
			if(result == '[]'){
				console.log(result);
				var i, k = ((((Date.now() / 1000 | 0) + (2 * 60 * 60)) / (60 * 60 * 24) ) | 0 ) % 7;
				var giorni = ["giovedì", "venerdì", "sabato", "domenica", "lunedì", "martedì", "mercoledì"];
				console.log("nessun errore______________________________________________");
				var date = giorni[k];
				res.redirect('/uploader/campanelle/'+date+"");}
			else{
				var anno = n.getFullYear(), mese = ('0'+  (n.getMonth() +1)).slice(-2), giorno = ((('0'+  (n.getDate())).slice(-2)));
				res.redirect('/uploader/campanelle/'+anno+"-"+ ('0'+  (n.getMonth() +1)).slice(-2) + "-" + ((('0'+  (n.getDate())).slice(-2))));
			}
			}
			
		}
	)})


	router.get('/testo/:file' ,redirectLogin, function (req, res, next) {

		console.log('il file richiesto: ', req.params.file);
	
		var options = {
			root: __dirname + '/public/testo/',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			} 
		}
		console.log(__dirname + "/public/testo");
		var fileName = req.params.file;
	  res.sendFile(fileName, options, function (err) {
		if (err) {
		  next(err);
		} else {
		  console.log('Spedito:', fileName);
		}
	  }
	
	
	  );
	});

	

	// router che ritorna la pagina delle campanelle del giorno selezionato
router.get("/campanelle/:giorno",redirectLogin, function(req, res){
		var giorno = req.params.giorno;
		var or =[];
		var dat = [];
		var i;
		var n = new Date();
		console.log("anno "+ n.getFullYear() +"-"+ n.getMonth() +"-"+ n.getDate());
		
		con.query("DELETE FROM `globale` WHERE data<'"+ n.getFullYear() +"-"+ ('0'+  (n.getMonth() )).slice(-2) +"-"+ ('0'+  (n.getDate() )).slice(-2)+"' and data<>'0000-00-00'", function(err){
			console.log("questo è l'errore "+err);
		});
		// cancella le campanelle speciali del mese prima
		console.log("il giorno scelto");
		con.query("SELECT ore FROM `globale` WHERE data=? AND tipo='campanella' and data<>'00-00-0000' ORDER BY ORE ASC;",[giorno] , function (err, result, fields) {
		//seleziono le campanelle in ordine crescente di un dato giorno sia ordianrio che eccezionale
			//dopo aggiornamento ritonra solo i giorni se è una data eccezionale
			if (err) { console.log(err); }
			
			result= JSON.stringify(result);
			if(result!='[]'){
				result = JSON.parse(result);
			console.log(result);
				for(i = 0; i < result.length ; i++){
				or[i] = result[i].ore;
				console.log(or[i]);
			}}
			console.log('qui');
			if(result=="[]"){
				con.query("SELECT ore FROM `globale` WHERE tipo=? ORDER BY ore ASC;",[giorno] , function (err, result, fields){
				//dopo update ritorna le date 
					if (err) { console.log(err); }
			else{
			console.log(result);
				for(i=0 ; i < result.length ; i++){
				or[i] = result[i].ore;
				console.log(or[i]);
			}}
		})
			}
			con.query('SELECT DISTINCT data FROM `globale` WHERE tipo="campanella"' , function (err, resu, fields) {
			//	ritorna tutti i giorni delle campanelle
				
				
				if (err) { console.log(err); }
			else{
			console.log(resu);
				for(i = 0; i < resu.length ; i++){

					
				 dat[i] = resu[i].data;
				}
		}
				
				res.render('campanelle.ejs', {or: or, date: giorno, dat: dat});
			}
				
		  )})})
	  
	  
router.get('/cancella/:data/:giorno',redirectLogin, function(req, res){
	console.log("sono dentro cancella "+ req.params.data);
	var data = req.params.data;
	var giorno = req.params.giorno;
	var or =[];
	var i;
	console.log("stampo il giorno: "+ giorno);
	con.query("SELECT ore FROM `globale` WHERE data=? and tipo='campanella' ORDER BY ore ASC",[giorno], function (err, result, fields) {
		//ritorna una lista delle ore del giorno speciali
		if (err) {console.log(err)};
		result= result;
		console.log(result);
		if(JSON.stringify(result)!="[]"){
			console.log("sono un giorno speciale")
		console.log(result);
			for(i = 0; i < result.length ; i++){
			or[i] = result[i].ore;
		}
		console.log(or[data]);
		con.query("DELETE FROM `globale` WHERE  tipo='campanella' and data=? AND ore=?", [giorno, or[data]], function(err,result){
			console.log(result);
			console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------------")
		});// cancello l'ora del giorno "giorno" se una data speciale
		console.log("ho fatto");
		}
		else{
			console.log("sono un giorno ordinario");
			con.query("SELECT ore FROM `globale` WHERE tipo=? and tipo<>'eventi' and tipo<>'avviso' and tipo<>'attività' ORDER BY ore ASC",[giorno], function (err, result, fields) {
				//ritorna una lista delle ore del giorno giorno
				if (err)  {console.log(err)}
				else{
				console.log(result);
					for(i = 0; i < result.length ; i++){
					or[i] = result[i].ore;
					console.log(or[i]);
					console.log(typeof(or[i]));
					console.log("data da cancellare "+or[data]);
			
				
				
				con.query("delete FROM `globale` WHERE  tipo=? AND ore=?", [giorno, or[data]],function(err, result){
					if(err){console.log(err)};// cancello l'ora del giorno "giorno" se è uno giorno speciale
					console.log(giorno+ " " + or[data])
					console.log("ho fatto");
					console.log(result);})}}})
				
				}	
		 res.redirect('/uploader/campanelle/'+giorno+"");
})})

router.post('/campanelle/:giorno',redirectLogin, function(req, res){
	var ora = req.body.time;
	var giorno = req.params.giorno;

	console.log("lunghezzza ora : "+ req.body);
	console.log("print ora: " + ora);
	
	if(giorno == 'lunedì' || giorno == 'martedì' || giorno == 'mercoledì' ||
	giorno == 'giovedì' ||giorno == 'venerdì' ||giorno == 'sabato' ||giorno == 'domenica' ){
		console.log("tutto procede bene");	
			con.query("select count(*) from `globale` where `tipo`=?",[giorno], function(err, result){
				if(err) {console.log(err)};
				
			})
			con.query("INSERT IGNORE INTO `globale`(tipo, ore) values(?,?) ", [giorno, ora], function(err, resutl){
				//inserisco campanella del giorno della settimana se non esiste gia
				if(err){console.log(err);}
				else{
					res.redirect('/uploader/campanelle/'+giorno+"");}
				
				
			}
			)
	}else{
		if(giorno==undefined){
			res.redirect('/uploader/campanelle');
		}else{
			con.query("select count(*) from `globale` where `tipo`='campanella', `data`=?",[giorno], function(err, result){
				if(err) {console.log(err)};
				
			})
		con.query("INSERT IGNORE INTO `globale` SET `tipo`='campanella', `data`=?, `ore`=?", [giorno, ora], function(err, resutl){
			//inserisco campanelle di giorni non ordinari
			if(err){console.log(err);}
		})
	
	res.redirect('/uploader/campanelle/'+giorno+"");}
}})
	


// corretto spero fino a qui





//______________________________________________________________________
router.post("/nuovacampanella/",redirectLogin, function(req, res){
	var ora= req.body.time;
	var data = req.body.nuovacampanella;
	console.log(req.body);
	var n = new Date();
	if(data< (n.getFullYear() +"-"+ ('0'+  (n.getMonth() )).slice(-2) +"-"+ ('0'+  (n.getDate() )).slice(-2))){
		res.redirect('/uploader/campanelle');
	}
	//INSERT INTO `globale` (`tipo`, `titolo`, `data`, `testo`, `ore`) VALUES ('campanella', '', '2019-09-26', '', '')
	//crea un unovo giorno speciale per le campanelle
	else{
	con.query("INSERT INTO `globale` (`tipo`, `titolo`, `data`, `testo`, `ore`) VALUES ('campanella', '', ?, '', ?)",[data, ora], function (err, result, fields) {
		if (err) {
			console.log("errore nel creare il giorno");
			console.log(err);
			res.redirect('/uploader/campanelle/'+ data+ '');}
		else{
			res.redirect('/uploader/campanelle/'+ data+ '');
		}
})}});

router.get("/ritornacampanelle", function(req, res){
	var data = new Date(), della;
	var giorniSett = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];


	con.query("SELECT ore FROM globale WHERE tipo='campanella' AND data='"+data.getFullYear()+"-"+('0'+  (data.getMonth() +1)).slice(-2)+"-"+('0'+  data.getDate()).slice(-2)+"' and data<>'00-00-0000'",function(err, result){
		if(err){console.log(err)}
		console.log(typeof(result));
		console.log('-----------------------------------------------------------------------'+giorniSett[data.getDay()]);
		result= JSON.stringify(result);
		if(result=="[]"){
			con.query("SELECT ore FROM globale WHERE tipo='"+giorniSett[data.getDay()]+"'", function(err, risultato){
				if(err){
					console.log(err);
				}
				console.log(risultato);
				res.send(risultato);
			})

		}else{
			res.send(result);
		}
	})
})

router.get("/cancella_data/:data",redirectLogin, function(req, res){
	var data = new Date(req.params.data);
	//cacella una campanella speciale
	console.log(data.toString());
	con.query("DELETE FROM `globale` WHERE tipo='campanella' AND data=?",[data.getFullYear()+"-"+('0'+(data.getMonth()+1)).slice(-2)+"-"+('0'+(data.getDate())).slice(-2)], function(err, result, fields) {
		if(err){
			console.log(err);
		}
		res.redirect('/uploader/campanelle/');
	})
})


router.get("/testo",redirectLogin, function(req, res){
	res.render("modificatesti.ejs");
})

router.post("/testo",redirectLogin, function(req, res){
	var tipo = req.body.tipo;
	var titolo = req.body.title;
	var data = req.body.data_testo;
	var text = req.body.text;
	
	console.log(tipo);
	con.query(" INSERT INTO `globale` (`tipo`, `titolo`, `testo`, `data`) VALUES ( ?, ?, ?, ?);",[tipo, titolo, text, data] , function (err, result, fields) {
		if (err) {
			console.log("errore di un testo");
			console.log(err);
			res.redirect('/uploader/testo/');}	
		else{
			console.log("tutto bene fratello!");
			res.redirect('/uploader/testo');}
	})

})

router.get("/rispostaeventi",function(req, res){
	var date = new Date();
	con.query("DELETE FROM `globale` where tipo='eventi' AND data < ? ",[date.getFullYear()+"-"+('0'+(date.getMonth()+1)).slice(-2)+"-"+('0'+(date.getDate())).slice(-2)],function(err, result, fields){
		if(err){
			console.log(err);}})

	//riotorna tutti gli eventi 
	con.query("select * FROM `globale` WHERE tipo='eventi' ",function(err, result, fields){
		if(err){
			console.log(err);
		}else{
			result = JSON.stringify(result);
			res.json(result);
		}
	})
})
router.get("/rispostaavviso",function(req, res){
	var date = new Date();
	//riotorna tutti gli avvisi
	con.query("DELETE FROM `globale` where tipo='avviso' AND data < ? ",[date.getFullYear()+"-"+('0'+(date.getMonth()+1)).slice(-2)+"-"+('0'+(date.getDate())).slice(-2)],function(err, result, fields){
		if(err){
			console.log(err);}})
	con.query("select * FROM `globale` WHERE tipo='avviso' ",function(err, result, fields){
		if(err){
			console.log(err);
		}else{
			result = JSON.stringify(result);
			
			res.json(result);
		}
	})
})
router.get("/rispostaattivita",function(req, res){
	//riotorna tutti gli attività 
	var date = new Date();
	con.query("DELETE FROM `globale` where tipo='attività' AND data < ? ",[date.getFullYear()+"-"+('0'+(date.getMonth()+1)).slice(-2)+"-"+('0'+(date.getDate())).slice(-2)],function(err, result, fields){
		if(err){
			console.log(err);}})
	con.query("select * FROM `globale` WHERE tipo='attività' ",function(err, result, fields){
		if(err){
			console.log(err);
		}else{
			result = JSON.stringify(result);
			
			res.json(result);
		}
	})
})
router.get("/cancellaeventi/:data",redirectLogin, function(req, res){
	var data = req.params.data; // data dell'evento
	
	console.log("richiesta ricevuta da "+ data);
	//ritorna tutti gli eventi
	con.query("select * FROM `globale` WHERE tipo='eventi'",function(err, result, fields){
		if(err){
			console.log(err);
		}else{
			var titolo = result[data].titolo;
			var testo  = result[data].testo;
			var date = result[data].data;
			console.log(date);
			console.log(date.getFullYear()+"-"+('0'+(date.getMonth()+1)).slice(-2)+"-"+('0'+(date.getDate())).slice(-2));
			//cancella evento
			con.query("DELETE FROM `globale` where tipo='eventi' AND titolo = ? AND data = ? AND testo = ?",[titolo, date.getFullYear()+"-"+('0'+(date.getMonth()+1)).slice(-2)+"-"+('0'+(date.getDate())).slice(-2), testo],function(err, result, fields){
				if(err){
					console.log(err);}
					else{
						console.log("risultato query delete:");
						console.log(result);
						console.log(err);
						console.log(fields);
						res.redirect("/uploader/testo/");
					}


			})
		}})
})
router.get("/cancellaattivita/:data",redirectLogin, function(req, res){
	var data = req.params.data;
	con.query("select * FROM `globale` WHERE tipo='attività'",function(err, result, fields){
		if(err){
			console.log(err);
		}else{
			var titolo = result[data].titolo;
			var testo  = result[data].testo;
			var date = result[data].data;
			con.query("DELETE FROM `globale` where tipo='attività' AND titolo = ? AND data = ? AND testo = ?",[titolo, date.getFullYear()+"-"+('0'+(date.getMonth()+1)).slice(-2)+"-"+('0'+(date.getDate())).slice(-2), testo],function(err, result, fields){
				if(err){
					console.log(err);}
					else{
						res.redirect("/uploader/testo/");
					}


			})
		}})
})
router.get("/cancellaavviso/:data",redirectLogin, function(req, res){
	var data = req.params.data;
	con.query("select * FROM `globale` WHERE tipo='avviso'",function(err, result, fields){
		if(err){
			console.log(err);
		}else{
			var titolo = result[data].titolo;
			var testo  = result[data].testo;
			var date = result[data].data;
			con.query("DELETE FROM `globale` where tipo='avviso' AND titolo = ? AND data = ? AND testo = ?",[titolo, date.getFullYear()+"-"+('0'+(date.getMonth()+1)).slice(-2)+"-"+('0'+(date.getDate())).slice(-2), testo],function(err, result, fields){
				if(err){
					console.log(err);}
					else{
						res.redirect("/uploader/testo/");
					}


			})
		}})
})


//DROP TABLE IF EXISTS `2019-09-18`
module.exports = router;


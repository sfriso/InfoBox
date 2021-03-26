const express = require('express');
const router = express.Router();
const fs = require('fs');
var file;




router.get('/',  function(req, res){ 
	const { userId } = req.session;
	console.log("sono nel index");
	console.log();
	console.log(req.session);
	if(1){
	fs.readdir(__dirname+"/public/uploaded/", function(err, items) {
		console.log("questo è l'array:");
		console.log(JSON.stringify(items[0]));		
		var array = items;	
	//	console.log(array.length)
	if(req.session.userId){
        res.render('dashboardloggato',  {array: array});
    }else{			
		res.render('dashboard',  {array: array});
		}
	}
	
	);}


});

router.get('/slider/:file',  function(req,res){
	var options = {
		root: __dirname + '/public/uploaded/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		} 
	}
	var fileName = req.params.file;
	res.sendFile(fileName, options, function(err){
		if (err) {
		//	console.log("errore nel spedire un file " + err);
		  } else {
		//	console.log('Spedito:', fileName);
		  }
	})
})

router.get('/background/:file', function(req, res, next) {

	var options = {
		root: __dirname + '/public/background/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		} 
	}
	var fileName = req.params.file;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
  //    console.log('Spedito:', fileName);
    }
  })

})

router.get('/weather/:file' , function (req, res, next) {

//	console.log('il file richiesto: ', req.params.file);

	var options = {
		root: __dirname + '/public/icon/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		} 
	}

	var fileName = req.params.file;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
  //    console.log('Spedito:', fileName);
    }
  })

})

router.get('/testo/:file' , function (req, res, next) {

//	console.log('il file richiesto: ', req.params.file);

	var options = {
		root: __dirname + '/public/testo/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		} 
	}

	var fileName = req.params.file;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
 //     console.log('Spedito:', fileName);
    }
  }


  );
});

module.exports = router;
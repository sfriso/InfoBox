const express = require('express');
const fs = require('fs');
const upload = require('express-fileupload');
const session = require('express-session');

//const bodyParser = require('body-parser');

const {
	SESS_NAME = 'sid',
	SESS_LIFETIME = 1000 * 60 *60 /2, // mezz'ora
	SESS_SECRET = 'ssh!quiet,it//asecret!',
} = process.env



var app = express();

/*app.use(function(req, res, next){
  const {userId } = req.session
  if(userId){
    res.locals.user = users.find(
      user => user.id === userId
    )
  }
  
  next()
});*/



// sessione
app.use(session({
  
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  userId: undefined,
  secret: SESS_SECRET,
  cookie:{
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: false//true
  }}));



//ejs
app.set('view engine', 'ejs');


//upload
app.use(upload());




// parser

app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

//Routes

app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/uploader', require('./routes/uploader'));

const PORT = process.env.PORT || 5000;

///console.log("https: 5001");
app.listen(PORT, console.log('HTTP: ', PORT));


app.use(function(req, res, next) {
  return res.status(404).send({ message: 'Errore 404: pagina '+req.url+' non trovata.' });
});
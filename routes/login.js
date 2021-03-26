const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
//const app = express();
const router = express.Router();
var mysql = require('mysql');




const bcrypt = require('bcrypt');

const saltRounds = 10;

var valore = bcrypt.hashSync('admin', saltRounds);


const users = [
    {
        id: 1, name: 'admin', password: valore}
    
]



const reditectHome = (req, res, next) => {
    console.log("redirectHome");
    console.log("");
    console.log(req.session);
    if(req.session.userId){
        res.redirect('/');
    }else{
        next();
    }
}
const redirectLogin =(req, res, next) =>{
    console.log(JSON.stringify(req.session))
    if(!req.session.userId){

		console.log("sono dentro al controllo "+req.session.userId);
		res.redirect('/');
    }else{
        next();
    }
}



router.get('/',reditectHome, function(req, res){
    console.log(req.session.id);
    const { userId } = req.session;
    console.log("primissimo login");
    console.log(req.session);
	console.log(userId); // undefined perchè non c'è nessun log
	
    res.redirect('/');
})
router.post('/', reditectHome, function(req, res){ // TODO: validation
    var utente = req.body.username;
    var password = req.body.password;
    
    if(utente && password){
        const user = users.find(
            user => user.name === utente && (bcrypt.compareSync(password, user.password)) 
            
            
            // sarebbe meglio hashare la password per renderla piu sicura
        
            
            )
        if(user) {
            console.log("fino a qui");
            console.log('hashhhh:   '+ user.password);
            req.session.userId = user.id;
            console.log(req.session.userId)
            console.log("ti sei loggato belin!!");
            console.log(req.session);
            req.session.save(err =>{ if(err)console.log(err)});
            return res.redirect('/uploader');
        }
    }
    //con.query("Select password from accounts where ")
    res.redirect('/login');
})


router.post('/logout', redirectLogin, function(req, res){
	req.session.destroy(err => {
		if(err) {
            console.log("errore");
            console.log(err);
			return res.redirect('/');
		}
		else{
			console.log("ti sei sloggato belin!!");
			res.clearCookie('sid');
			console.log("ti sei sloggato belin!!");
			return res.riderct('/');
		}
	});
} )
router.get('/logout',redirectLogin, function(req, res){
	req.session.destroy(err => {
		if(err) {
            console.log("errore");
            console.log(err);
			return res.redirect('/');
		}
		else{
			console.log("ti sei sloggato belin!!");
			res.clearCookie('sid');
			console.log("ti sei sloggato belin!!");
			return res.redirect('/');
		}
	});
})



module.exports = router;
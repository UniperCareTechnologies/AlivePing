var request = require("request");
var dotenv = require('dotenv');

//Configure DOTENV
dotenv.config();

var LastDateSent = Date.now();
var LastDateFromLast = 0;
var LastError = '';
var TimeInterval = process.env.SERVERINTERVAL;
var TimerURL = process.env.SERVERPING;

var keepalive = {
  displaylastcall: function(req, res, next){
	LastDateFromLast = Date.now() - LastDateSent;
	res.send("Seconds Elapsed = " + Math.floor(LastDateFromLast/1000))
  },
  displaylasthtml: function(req, res, next){      
	LastDateFromLast = Date.now() - LastDateSent;
	var datestr = new Date(LastDateSent);
	res.render('index', { elapsedtime: Math.floor(LastDateFromLast/1000), lastcalldate: datestr.toDateString(), lastcalltime: datestr.toTimeString(), servername: process.env.SERVERNAME, lasterror: LastError } );
  },
  sendping: function(){
	request.post(TimerURL, 
		{
			body: { servername: process.env.SERVERNAME },
		   	form: { servername: process.env.SERVERNAME } 
		}, 
		function(err, response, body){
			if (err != null) {
			   LastError = err.code + ': ' + err.errno + ' (' + err.syscall + ')';
			}
			else {
			   LastError = 'Successfull';
			   LastDateSent = Date.now(); 
			}
		}); 
  },
  beginservice: function(){
    //Every 5 minutes (300 seconds)
    	keepalive.sendping();		//Send First Ping
	setInterval(function() { 
	   keepalive.sendping();	//Send Recurring Ping
	}, TimeInterval);
  } 
}

// Return the object
module.exports = keepalive;
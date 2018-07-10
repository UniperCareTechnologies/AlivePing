var request = require("request");
var dotEnv = require('dotenv');

//Configure DOTENV
dotEnv.config();

var lastDateSent = Date.now();
var lastDateFromLast = 0;
var lastError = '';
var timeInterval = process.env.SERVERINTERVAL;
var timerURL = process.env.SERVERPING;

var keepAlive = {
  displayLastCall: function(req, res, next){
		lastDateFromLast = Date.now() - lastDateSent;
		res.send("Seconds Elapsed = " + Math.floor(lastDateFromLast/1000))
  },
  displayLastHtml: function(req, res, next){      
		lastDateFromLast = Date.now() - lastDateSent;
		var datestr = new Date(lastDateSent);
		res.render('index', { elapsedtime: Math.floor(lastDateFromLast/1000), lastcalldate: datestr.toDateString(), lastcalltime: datestr.toTimeString(), servername: process.env.SERVERNAME, lasterror: lastError } );
  },
  sendPing: function(){
		request.post(timerURL, 
		{
			body: { servername: process.env.SERVERNAME },
			form: { servername: process.env.SERVERNAME } 
		}, 
		function(err, response, body){
			if (err != null) {
				lastError = err.code + ': ' + err.errno + ' (' + err.syscall + ')';
			}
			else {
				lastError = 'Successfull';
				lastDateSent = Date.now(); 
			}
		}); 
  },
  beginService: function(){
    //Every 5 minutes (300 seconds)
    	keepAlive.sendPing();		//Send First Ping
	setInterval(function() { 
			keepAlive.sendPing();	//Send Recurring Ping
	}, timeInterval);
  } 
}

// Return the object
module.exports = keepAlive;
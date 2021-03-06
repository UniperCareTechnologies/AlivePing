var request = require("request");
var dotEnv = require('dotenv');

//Configure DOTENV
dotEnv.config();

var lastDateSent = Date.now();
var lastDateFromLast = 0;
var lastError = '';
var timeInterval = parseFloat(process.env.SERVERINTERVAL);
var timerURL = process.env.SERVERPING;

var keepAlive = {
	displayLastCall: function(req, res, next) {
		lastDateFromLast = Date.now() - lastDateSent;
		res.send("Seconds Elapsed = " + Math.floor(lastDateFromLast/1000))
	},
	displayLastHtml: function(req, res, next) {      
		lastDateFromLast = Date.now() - lastDateSent;
		var datestr = new Date(lastDateSent);
		res.render('index', { elapsedtime: Math.floor(lastDateFromLast/1000), lastcalldate: datestr.toDateString(), lastcalltime: datestr.toTimeString(), servername: process.env.SERVERNAME, lasterror: lastError } );	
	},
	sendPing: function() {
		request.post(timerURL, 
		{
			body: { servername: process.env.SERVERNAME },
			form: { servername: process.env.SERVERNAME } 
		}, 
		function(err, response, body){
			if (!err) {
				lastError = 'Successfull';
				lastDateSent = Date.now(); 
			}
			else {
				lastError = err.code + ': ' + err.errno + ' (' + err.syscall + ')';
			}

			//console.log('Error: ' + JSON.stringify(err));
			//console.log('Body: ' + JSON.stringify(body));
		}); 
	},
	beginService: function(){
		//Every 5 minutes (300 seconds)
		var timePrepInterval = 0;
		if (timeInterval == 0) {
			timePrepInterval = 5 * 60 * 1000;
		}
		else {
			timePrepInterval = timeInterval;
		}

		keepAlive.sendPing();		//Send First Ping
		setInterval(function() { 
			keepAlive.sendPing();	//Send Recurring Ping
		}, timeInterval);
	} 
}

// Return the object
module.exports = keepAlive;
var 	express = require('express'),
	path = require('path'),
	ejs = require('ejs');
	aliveRouter = require('./aliveservice');

//Configure Express and Views
var app = express();

//I need to use the templates from EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Optional For HTML Engine
//app.engine("ejs", ejs.renderFile);
//app.set('view engine', 'html');
//app.use(express.static(path.join(__dirname, 'public')));

//Configure only two routes to display the last ping
app.get('/raw', aliveRouter.displayLastCall);
app.get('/', aliveRouter.displayLastHtml);

//Just render
app.get('/:pagename*', function(req, res, next) {
	var pagename = req.url;
	res.sendFile(path.join(__dirname,'/public/',pagename));
});

//Begin service
var server = app.listen(4012, function(){
	var port = server.address().port;
	
	//Begin timer
	aliveRouter.beginService();
	
	console.log("Alive Ping running on port " + port);
})
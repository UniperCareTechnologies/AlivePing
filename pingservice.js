var 	express = require('express'),
	path = require('path'),
	ejs = require('ejs');
	aliverouter = require('./aliveservice');

//Configure Express and Views
var app = express();

//I need to use the templates from EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Optional For HTML Engine
//app.engine("ejs", ejs.renderFile);
//app.set('view engine', 'html');
//app.use(express.static(path.join(__dirname, 'public')));

//Configure only two routes to display the last ping
app.get('/raw', aliverouter.displaylastcall);
app.get('/', aliverouter.displaylasthtml);

//Just render
app.get('/:pagename*', function(req, res, next) {
	var pagename = req.url;
	res.sendFile(__dirname+'/public/'+pagename);
});

//Begin service
var server = app.listen(4000, function(){
	var port = server.address().port;
	
	//Begin timer
	aliverouter.beginservice();
	
	console.log("Alive Ping running on port " + port);
})
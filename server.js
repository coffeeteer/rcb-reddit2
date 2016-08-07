var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');

global.db = require('./models');

var Posts = require('./models')['Posts']; //Matt's original option
Posts.sync();



var app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
	extended: false
}));

app.engine('handlebars', handlebars({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

//Home Page
app.get('/', function(req, res) {
	
	Posts.findAll({}).then(function(result){
		console.log(result);
		return res.render('index', {
			posts: result
		});
	});
	
});

app.get('/new-post', function(req, res) {
	res.render('new');
});

app.post('/new-post', function(req, res) {
	var body = req.body;
	
	// create the post in the database
	Posts.create({
		title: body.title,
		url: body.url,
		image: body.image,
		score: 0,
		description: body.description
	}).then(function(data){
		console.log('data', data);
		//redirect to the posts/:id page
		res.redirect('/posts/' + data.dataValues.id);
		console.log(data.dataValues.id);
		console.log(data.dataValues);
	});
});

app.get('/:posts/:id', function(req, res) {
	var id = req.params.id;
	Posts.findOne({
		where: {
			id: id
		}
	}).then(function(post) {
		console.log(post);
		res.render('post', {
			post: post
		});
	});
});

var port = process.env.PORT || 3000;
db.sequelize.sync().then(function(){
	app.listen(port, function() {
		console.log('connected to PORT' , port);
	});	
});
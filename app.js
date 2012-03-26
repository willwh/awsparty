
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , aws = require('aws-lib')
  , config = require('./config');

var ec2 = aws.createEC2Client(config.aws.access_key_id, config.aws.secret_access_key);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

// Dirty route as a test

app.get('/instances', function(req, res) {
  ec2.call('DescribeInstances', {}, function(err, result) {
    res.render('instances', {title: 'Instances', instances: JSON.stringify(result)});
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

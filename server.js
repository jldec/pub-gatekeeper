/*
 * pub-gatekeeper server.js
 * starts express, serves sessions, performs oauth for github and google
 * copyright 2015-2020, Jürgen Leschner - github.com/jldec - MIT license
 */

var debug = require('debug')('pub:gatekeeper');

var events = require('events');
var u = require('util');
var express = require('express');

u.inherits(gatekeeper, events.EventEmitter);

// normal startup: `node server.js`
if (require.main === module) { gatekeeper(); }

// cli api: require('pub-gatekeeper')(opts)
else { module.exports = gatekeeper; }

//--//--//--//--//--//--//--//--//--//--//--//--//

function gatekeeper(opts) {

  if (!(this instanceof gatekeeper)) return new gatekeeper(opts);
  events.EventEmitter.call(this);

  var server = this;

  if (!opts) {
    try { var optsPath = require.resolve('./pub-gatekeeper-config.js'); }
    catch(err) {}
    opts = optsPath ? require(optsPath) : {};
  }

  var log = opts.log = require('logger-emitter')().log;

  opts.production  = opts.production || (process.env.NODE_ENV === 'production');
  opts.port        = opts.port       || process.env.PORT || '3333';
  opts.appUrl      = opts.appUrl     || process.env.APP  || ('http://localhost:' + opts.port);

  debug(opts);

  server.opts = opts;
  server.app = express();
  server.http = require('http').Server(server.app);
  server.app.disable('x-powered-by');

  // see https://expressjs.com/en/guide/behind-proxies.html
  server.app.set('trust proxy', opts['trust proxy'] || false);

  log('starting up', opts.appUrl);

  server.sessions = require('pub-serve-sessions')(server);

  // if authenticated, make req.user available for authz on other requests
  server.app.all('*', function(req, res, next) {
    if (req.session && req.session.user && !req.user) {
        req.user = req.session.user;
    }
    next();
  });

  // default middleware
  var bodyParser = require('body-parser');
  server.app.use(bodyParser.json());
  server.app.use(bodyParser.urlencoded({ extended: false }));
  server.app.use(require('compression')());

  server.sessions.authorizeRoutes();

  // CORS including preflight
  server.app.all('*', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
  });

  require('pub-pkg-github-oauth')(server);

  server.app.use(express.static(__dirname + '/static'));

  require('./handle-errors')(server);

  server.http.listen(opts.port);
  log('listening on port', opts.port);

  process.on('SIGTERM', function() {
    log('shutting down');
    server.http.close(function() {
      server.emit('shutdown');
      process.exit();
    });
  });

  log.logger.noErrors = true; // don't throw once we're up and running
}

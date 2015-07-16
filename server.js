/*
 * pub-gatekeeper server.js
 * starts express, serves sessions, performs oauth for github and google
 * copyright 2015, Jurgen Leschner - github.com/jldec - MIT license
 */

var debug = require('debug')('pub:gatekeeper');

var path = require('path');
var events = require('events');
var u = require('util');

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
    try { opts = require(path.resolve('./pub-gatekeeper-config.js')); }
    catch(err) { opts = {}; }
  }

  var log = opts.log = require('logger-emitter')().log;

  opts.production  = opts.production || (process.env.NODE_ENV === 'production');
  opts.port        = opts.port       || process.env.PORT || '3333';
  opts.appUrl      = opts.appUrl     || process.env.APP  || ('http://localhost:' + opts.port);

  server.opts = opts;
  server.app = require('express')();
  server.http = require('http').Server(server.app);
  server.app.disable('x-powered-by');

  server.sessions = require('pub-serve-sessions')(server); // TODO: extract
  log('starting up', opts.appUrl);

  // default middleware
  var bodyParser = require('body-parser');
  server.app.use(bodyParser.json());
  server.app.use(bodyParser.urlencoded({ extended: false }));
  server.app.use(require('compression')());

  server.sessions.authorizeRoutes();

  require('pub-pkg-github-oauth')(server);

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

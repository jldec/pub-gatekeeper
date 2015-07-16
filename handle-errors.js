/*
 * pub-gatekeeper handle-errors.js
 *
 * copyright 2015, Jurgen Leschner - github.com/jldec - MIT license
 */

var debug = require('debug')('pub:gatekeeper');
var u = require('pub-util');

module.exports = function handleErrors(server) {

  // sugar
  var opts = server.opts;
  var log = opts.log;
  var app = server.app;

  app.use('/server/echo', testEcho);

  // dev/test routes
  if (!opts.production) {
    app.use('/admin/testthrow', testThrow);
    app.use('/admin/testerr',   testErr);
    app.use('/admin/testpost',  testPost);
    app.use('/admin/testget',   testGet);
  }

  // mount 404 and 500 handlers
  app.use(notFound);
  app.use(errHandler);

  return;

  //--//--//--//--//--//--//--//--//--//--//

  function notFound(req, res, next) {
    debug('404 %s', req.originalUrl);
    res.status(404).end();
  }

  function errHandler(err, req, res, next) {
    if (!err.status) { log(err); }
    error(err.status || 500, req, res, u.str(err));
  }

  // general purpose error response
  function error(status, req, res, msg) {
    debug('%s %s', status, req.originalUrl);
    res.status(status).send(u.escape(msg || ''));
  }

  function testThrow() {
    throw new Error('test throw');
  }

  function testErr(req, res) {
    log(new Error('test err'));
    error(403, req, res, '/admin/testerr');
  }

  function testPost(req, res) {
    log('/admin/testpost', req.body);
    res.status(200).send('OK');
  };

  function testGet(req, res) {
    log('/admin/testget', req.query);
    res.status(200).send('OK');
  }

  function testEcho(req, res) {
    res.send(echoreq(req));
  }

  function echoreq(req) {
    return {
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      query: req.query,
      params: req.params,
      body: req.body,
      now: Date(),
      user: req.user,
      sessionID: req.sessionID,
      session: req.session
    };
  }
}

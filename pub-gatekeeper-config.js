/*
 * SAMPLE pub-gatekeeper-config.js
 * this config is used when server is started via `node server`
 * most of these settings can also be controlled with environment variables
 */

module.exports =
{

/*
  port: 3333,
  production: false,
  appUrl: 'https://localhost:3333',

*/

  github: {
    url: '/server/auth/github',
    timeout: '4s',
    expire: '30s'
  },

  // comment this out if you're NOT using redis for session persistence
  redis: {
    prefix: 'sess-gatekeeper:',
    _log: 'log-gatekeeper:'
  }

}

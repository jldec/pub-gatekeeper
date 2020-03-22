/*
 * SAMPLE pub-gatekeeper-config.js
 * this config is used when server is started via `node server`
 * most of these settings can also be controlled with environment variables
 */

module.exports =
{
  port: process.env.PORT || 3333,
  production: false,
  appUrl: process.env.APP || 'https://localhost:3333',
  user: 'hello',

  github: {
    url: '/server/auth/github',
    timeout: '4s',
    expire: '30s'
  },

  session: {
    cookie: { maxAge: 60*60*1000 },
  }
}

if (process.env.REDIS) {
  opts.redis = {prefix: 'gatekeeper:', _log: 'log:'};
  opts.session.secret = process.env.SSC
}

if (process.env.AUTH) {
  opts.session.cookie.secure = true;
  opts["trust proxy"] = 1;
}

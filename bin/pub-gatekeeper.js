#!/usr/bin/env node

var pkg = require('../package.json');
console.log(pkg.name, 'v'+pkg.version);

require('../server')();

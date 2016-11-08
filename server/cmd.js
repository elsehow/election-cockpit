#!/Users/ffff/.nvm/versions/node/v6.9.0/bin/node
'use strict';
let argv = require('minimist')(process.argv.slice(2), {
  default: {
    update:30000,
    port: 9998,
  }
});
let server = require('.')
server(argv.port, argv.update)

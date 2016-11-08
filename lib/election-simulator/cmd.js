#!/Users/ffff/.nvm/versions/node/v6.9.0/bin/node
var argv = require('minimist')(process.argv.slice(2));
var simulator = require('.')
var dnode = require('dnode');
var server = dnode({
  simulate: function (probs, n, cb) {
    cb(simulator(probs, n))
  }
})
server.listen(argv.port)

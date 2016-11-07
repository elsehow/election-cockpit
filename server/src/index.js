let kefir = require('kefir')
let stateS = require('./stateS')
function server (port, update=30000) {
  var server = require('http').createServer();
  var io = require('socket.io')(server);
  let statesS = kefir
      .interval(update, 1)
      .toProperty(x => 1)
      .flatMap(stateS)
  io.on('connection', function(client){
    function emit (v) {
      client.emit('state', v)
    }
    statesS.onValue(emit)
    client.on('disconnect', () => stateS.offValue(emit))
  });
  server.listen(port)
  return server
}
module.exports = server

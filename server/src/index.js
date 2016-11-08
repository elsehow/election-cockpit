let kefir = require('kefir')
let stateS = require('./stateS')
function server (port, update=30000) {
  let last;
  let server = require('http').createServer();
  let io = require('socket.io')(server);
  let statesS = kefir
      .interval(update, 1)
      .toProperty(_ => 1)
      .flatMap(stateS)
  io.on('connection', function(client){
    function emit (v) {
      client.emit('state', v)
      last=v
    }
    if (last) emit(last)
    statesS.onValue(emit)
    client.on('disconnect', () => statesS.offValue(emit))
  });
  server.listen(port)
  return server
}
module.exports = server

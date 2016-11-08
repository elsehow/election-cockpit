var server = require('..')
var test = require('tape')

let s = server(9989)
console.log('started')

test('socket', t => {
  t.plan(5)
  var socket = require('socket.io-client')('http://localhost:9989');
  socket.on('connect', function () {
    t.ok(true, 'connected')
    socket.on('state', s => {
      t.ok(s['CA'], 'CA')
      t.ok(s['AL'], 'AL')
      t.ok(s['worst-case'], 'worst-case')
      t.ok(s['predictwise'],
           'predictwise ' + s['predictwise'])
    })
  })
})

test.onFinish(() => {
  s.close()
})

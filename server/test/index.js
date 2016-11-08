var server = require('..')
var test = require('tape')

let s = server(9989)
console.log('started')

test('socket', t => {
  var socket = require('socket.io-client')('http://localhost:9989');
  socket.on('connect', function () {
    t.ok(true, 'connected')
    socket.on('state', s => {
      t.ok(s['CA'], 'CA')
      t.ok(s['AL'], 'AL')
      t.ok(s['worst-case'], JSON.stringify(s['worst-case']))
      t.deepEquals(typeof(s['worst-case'].y),'number', 'worst-case')
      t.ok(s['predictwise'],
           'predictwise ' + s['predictwise'])
      t.ok(s['CA'].x,
           'CA has a timestamp on x')
      t.ok(s['CA'].y,
           'and a value on y')
      t.ok(s['predictwise'].x,
           'predictwise has a unix epoch on x ' + s['predictwise'].x)
      t.ok(s['predictwise'].y,
           'and a value on y ' + s['predictwise'].y)
      t.end()
    })
  })
})

test.onFinish(() => {
  s.close()
})

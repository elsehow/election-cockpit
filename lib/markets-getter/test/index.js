var test = require('tape')
var marketS = require('..')
test('get CA probability', t => {
  t.plan(1)
  marketS('CA').onValue(prb => t.ok(prb>0.9, prb))
  marketS('CA').onError(t.notOk)
})

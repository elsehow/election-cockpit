let test = require('tape')
test('get stateS', t => {
  let stateS = require('../src/stateS.js')()
  stateS.onError(t.notOk)
  stateS.onValue(v => {
    t.ok(v['CA'])
    t.ok(v['AK'])
    t.ok(v['worst-case'])
    t.end()
  })
})

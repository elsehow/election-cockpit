function app (url) {
  let socket = require('socket.io-client')(url)
  let appEl = document.createElement('pre')
  let graph = require('../../lib/probability-graph')
  let kefir = require('kefir')
  function graphable (abbrev, name=abbrev) {
    return { stream: stateS.map(v => v[abbrev]),
             name: name }
  }
  socket.on('connect', function () {
    stateS = kefir.fromEvents(socket, 'state')

    graph('states', appEl, [
      graphable('FL'),
      graphable('NC'),
      graphable('NV'),
      graphable('PA'),
      graphable('MI'),
      graphable('WI'),
      graphable('OH'),
      graphable('IA'),
    ])

    graph('forecasts', appEl, [
      graphable('worst-case', 'Nick\'s Worst Case&trade;'),
      graphable('predictwise', 'PredictWise (MSR)'),
    ])
    // stateS.onValue(s => {
    //   appEl.innerHTML=
    //     JSON.stringify(s,0,2)
    // })
  })
  return appEl
}
module.exports = app

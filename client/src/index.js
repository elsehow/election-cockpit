let level = require('level-browserify')
let hyperlog = require('hyperlog')
let kefir = require('kefir')
let graph = require('../../lib/probability-graph')
let hyphy = require('hyphy')

function app (url) {

  let socket = require('socket.io-client')(url)
  var db = level('./election-d')
  let log = hyperlog(db, {
    valueEncoding: 'json',
  })
  let appEl = document.createElement('div')

  socket.on('connect', function () {

    console.log('connected')
    stateS = kefir.fromEvents(socket, 'state')
    // save to hyperlog
    stateS.onValue(s => log.append(s))

    let logS = hyphy(log)
        .map(v => v.value)
        .throttle(25)

    function graphable (abbrev, name=abbrev) {
      return { stream: logS.map(v => v[abbrev]),
               name: name }
    }

    graph('states', appEl, [
      graphable('FL'),
      graphable('NC'),
      graphable('NV'),
      graphable('PA'),
      graphable('MI'),
      graphable('WI'),
      graphable('OH'),
      graphable('IA'),
      graphable('CO'),
    ], 'cool')

    graph('forecasts', appEl, [
      graphable('worst-case', 'Nick\'s Worst Case&trade;'),
      graphable('predictwise', 'PredictWise (MSR)'),
      graphable('fivethirtyeight', 'FiveThirtyEight'),
    ])
  })
  return appEl
}
module.exports = app

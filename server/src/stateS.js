let marketS = require('../../lib/markets-getter')
let zipObject = require('zip-object');
let request = require('request')
let kefir = require('kefir')
let truthy = x => !!x

let simulate_server = '../lib/election-simulator/cmd.js'
let spawn = require('child_process').spawn
let child = spawn(simulate_server,['--port=5004'])
let dnode = require('dnode')
let d = dnode({},{weak:false}).connect(5004)

let remote;

d.on('remote', function (rem) {
  remote = rem
  })

function simulate (probs) {
  if (remote)
    return kefir.fromCallback(cb => remote.simulate(probs, 10000, cb))
  return kefir.constant(null)
}

let states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

let get = require('simple-get')
let url =
    'http://projects.fivethirtyeight.com/2016-election-forecast/US.json'

function ft8S() {
  return kefir.stream(emitter => {
    get.concat(url, function (err, _, body) {
      if (err) emitter.emit(err)
      emitter.emit(body.toString())
    })
  }).map(JSON.parse).map(forecast => {
    return forecast.forecasts.latest.D.models.plus.winprob
  }).map(x => x/100)
}


function getS (url) {
  return kefir.stream(emitter => {
    request({
      url:url,
      encoding: null,
    }, function (err, res, body) {
      if (err) emitter.error(err)
      if (!res.statusCode) emitter.error('404')
      if (res.statusCode != 200) emitter.error(res)
      else emitter.emit(body)
      return
    })
  })
}

function pwS() {
  let url =
      'http://table-cache1.predictwise.com/history/table_1032.json'
  return getS(url)
    .map(JSON.parse)
    .map(t => t.latest)
    .map(f => f.filter(r => r[0]==='Democratic')[0])
    .map(f => f[1].split(' ')[0])
    .map(Number)
    .map(x => x/100)
}
/*
  stateS () { ..}

  returns a stream of objects with the form

    { 'CA': 0.96, ... 'worst-case': 0.878 }

  */
function stateS () {
  let probS = kefir
      .combine(states.map(marketS))
      .map(probs => zipObject(states, probs))
  let forecastS = probS.flatMap(simulate).filter(truthy)
  return kefir.combine([
    probS,
    forecastS,
    pwS(),
    ft8S(),
  ], function (prob, forecast, pw, ft8) {
    let epoch = Date.now()/1000
    prob['worst-case'] = forecast
    prob['predictwise'] = pw
    prob['fivethirtyeight'] = ft8
    // add timestamp (epoch) to everything, as x
    // and value as y
    // (imagine a timeseries plot)
    let res = {}
    Object.keys(prob).forEach(k => {
      res[k] = {
        x: epoch,
        y: prob[k],
      }
    })
    return res
  })
}

module.exports = stateS

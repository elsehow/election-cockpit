let marketS = require('../../lib/markets-getter')
let simulate = require('../../lib/election-simulator')
let zipObject = require('zip-object');
let request = require('request')
let kefir = require('kefir')

let states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

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
  let forecastS = probS.map(simulate)
  return kefir.combine([
    probS,
    forecastS,
    pwS(),
  ], function (prob, forecast, pw) {
    prob['worst-case'] = forecast
    prob['predictwise'] = pw
    return prob
  })
}
module.exports = stateS

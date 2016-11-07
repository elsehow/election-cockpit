let marketS = require('../../lib/markets-getter')
let simulate = require('../../lib/election-simulator')
let zipObject = require('zip-object');
let kefir = require('kefir')

let states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

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

  return probS.combine(forecastS, function (prob, forecast) {
    prob['worst-case'] = forecast
    return prob
  })
}
module.exports = stateS

let kefir = require('kefir')
let request = require('request-json')
let client = request.createClient(
  'https://www.predictit.org/api/marketdata/ticker/')

function getS (url) {
  return kefir.stream(emitter => {
    client.get(url, function (err, res, body) {
      if (err) emitter.error(err)
      if (res.statusCode != 200) emitter.error(res)
      else emitter.emit(body)
      return
    })
  })
}

function ticker (party, state) {
  return `${party}.${state}.USPREZ16`
}

function probability (contract, sellAttr, buyAttr) {
  let sell = contract[sellAttr]
  let buy = contract[buyAttr];
  let spread = buy-sell
  if (spread > 0.05)
    return contract['LastTradePrice']
  return (sell+buy)/2.0
}

function partyContract (contracts, party) {
  let matchTicker = c =>
      c.TickerSymbol.split('.')[0]===party
  return contracts
    .filter(matchTicker)[0]
}

function marketS (state) {
  let tick = ticker('DEM', state)
  return getS(tick)
    .map(r => r.Contracts)
    .map(contracts => {
      let demProb = probability(
        partyContract(contracts, 'DEM'),
        'BestSellYesCost',
        'BestBuyYesCost'
      )
      let gopProb = probability(
        partyContract(contracts, 'GOP'),
        'BestSellNoCost',
        'BestBuyNoCost'
      )
      return (demProb + gopProb)/2
    })
}

module.exports = marketS

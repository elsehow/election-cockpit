let random = require('random-js')
var randomNormal = require('random-normal');

let states_delegates = {'AL':9, 'AK':3, 'AZ':11, 'AR':6, 'CA':55, 'CO':9, 'CT':7    , 'DC':3, 'DE':3, 'FL':29, 'GA':16, 'HI':4, 'ID':4, 'IL':20, 'IN':11, 'IA':6    , 'KS':6, 'KY':8, 'LA':8, 'ME':4, 'MD':10, 'MA':11, 'MI':16, 'MN':10, 'MS':6    , 'MO':10, 'MT':3, 'NE':5, 'NV':6, 'NH':4, 'NJ':14, 'NM':5, 'NY':29, 'NC':15    , 'ND':3, 'OH':18, 'OK':7, 'OR':7, 'PA':20, 'RI':4, 'SC':9, 'SD':3, 'TN':11,     'TX':38, 'UT':6, 'VT':3, 'VA':13, 'WA':12, 'WV':5, 'WI':10, 'WY':3,}

function sum (arr) {
  return arr.reduce((acc, cur) => acc+=cur, 0)
}

let mt = random.engines.mt19937().autoSeed();

function decide (probability) {
  return random.bool(probability)(mt)
}

function bound (prob) {
  if (prob>0.98) return 1
  if (prob<0.02) return 0
  return prob
}

function outcome (temperature) {
  return function (state) {
    let offset = fromNormal(temperature, 0.3)
    let prob = bound(state['probability'] + offset)
    let delegates = decide(prob)*state.delegates
    return delegates
  }
}

function fromNormal (mean, dev) {
  return randomNormal({
    mean: mean, dev:dev,
  })
}

function simulate (stateProbMap) {
  let temperature = fromNormal(0, 0.3)
  let probStates = Object.keys(stateProbMap)
  // if (probStates.length-1 != 50)
  //   throw('there arent 50 states in this map!')
  let clintonDelegates = probStates.map(state => {
    return {
      state: state,
      probability: stateProbMap[state],
      delegates: states_delegates[state],
    }
  }).map(outcome(temperature))
  return sum(clintonDelegates) > 270
}


function simulateMany (stateProbMap, n=10000) {
  let last = simulate(stateProbMap)
  for (let i=0;i<n-1;i++) {
    last+=simulate(stateProbMap)
  }
  return last/n
}

module.exports = simulateMany

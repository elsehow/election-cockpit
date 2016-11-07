let state_probs = {'AL':0.6, 'AK':0.6, 'AZ':0.6, 'AR':0.6, 'CA':0.6, 'CO':0.6, 'CT':0.6, 'DC':0.6, 'DE':0.6, 'FL':0.6, 'GA':0.6, 'HI':0.6, 'ID':0.6, 'IL':0.6, 'IN':0.6, 'IA':0.6, 'KS':0.6, 'KY':0.6, 'LA':0.6, 'ME':0.6, 'MD':0.6, 'MA':0.6, 'MI':0.6, 'MN':0.6, 'MS':0.6, 'MO':0.6, 'MT':0.6, 'NE':0.6, 'NV':0.6, 'NH':0.6, 'NJ':0.6, 'NM':0.6, 'NY':0.6, 'NC':0.6, 'ND':0.6, 'OH':0.6, 'OK':0.6, 'OR':0.6, 'PA':0.6, 'RI':0.6, 'SC':0.6, 'SD':0.6, 'TN':0.6, 'TX':0.6, 'UT':0.6, 'VT':0.6, 'VA':0.6, 'WA':0.6, 'WV':0.6, 'WI':0.6, 'WY':0.6,}

var simulate = require('..')
let results = simulate(state_probs)

console.log(results)

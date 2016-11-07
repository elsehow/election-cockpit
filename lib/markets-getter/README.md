# market-getter

get an average market price (for clinton shares) for a given state

## example

```javascript
var marketS = require('../lib/market-getter')
marketS('CA').log()
// 0.9675
```

## API

### marketS(stateAbbreviation)

returns a kefir stream of average share price.

## license

BSD

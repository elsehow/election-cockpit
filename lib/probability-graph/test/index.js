let ud = require('ud')
let kefir = require('kefir')

let graph = require('..')

// everything in this function will get updated on change
var setup = ud.defn(module, function () {

  let targetEl = document.getElementById('chart_container')
  targetEl.innerHTML=''

  let probabilities = kefir.withInterval(100, emitter => {
    let prob = Math.abs(Math.sin(Date.now()))
    emitter.emit(prob)
  })

  let probabilities2 = kefir.withInterval(100, emitter => {
    let prob = Math.abs(Math.cos(Date.now()))
    emitter.emit(prob)
  })

  // probabilities
  //   .log('prob')

  graph('cool graph', targetEl, [
    {stream : probabilities, name: 'sin prob'},
    {stream : probabilities2, name: 'cos prob'},
  ], 'munin')
})

// will re-run setup() whenever method changes
setup()

let kefir = require('kefir')
let Rickshaw = require('rickshaw')
// let timestamp = require('monotonic-timestamp')

// function timestamp () {
//   let d = new Date()
//   return d.getTime()
// }

// TODO multiple series (streams)
function graph (title, el, streams, palette='classic9' ) {

  var palette = new Rickshaw.Color.Palette({ scheme: palette })

  let titleel = document.createElement('h2')
  titleel.innerHTML = title
  el.append(titleel)

  let chartel = document.createElement('div')
  chartel.className='chart'
  el.append(chartel)

  let previewel = document.createElement('div')
  el.append(previewel)

  let axisel = document.createElement('div')
  axisel.className = 'y_axis'
  el.append(axisel)

  let seriesData = streams.map(s => [{x:0, y:0}])

  let graph = new Rickshaw.Graph( {
    renderer: 'line',
    element: chartel,
    series: streams.map((s, i) => {
      return {
        color: palette.color(),
        data: seriesData[i],
        name: s.name,
      }
    })
  })
  graph.render()

  var preview = new Rickshaw.Graph.RangeSlider( {
	  graph: graph,
    element: previewel,
  });

  // x axis
  new Rickshaw.Graph.Axis.Time( {
    graph: graph,
    timeFixture: new Rickshaw.Fixtures.Time.Local(),
  }).render()

  // y axis
  // new Rickshaw.Graph.Axis.Y( {
  //   graph: graph,
  //   orientation: 'left',
  //   tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  // }).render()

  let hoverDetail = new Rickshaw.Graph.HoverDetail({
	  graph: graph
  })
  // var hoverDetail = new Rickshaw.Graph.HoverDetail( {
	//   graph: graph,
	//   // xFormatter: function(x) {
  //   //   return y//new Date(x * 1000).toLocaleTimeString();
	//   // }
  //   yFormatter: function (y) {
  //     return y
  //   }
  // } );

  let kstreams = streams.map(s => s.stream)
  kefir.combine(kstreams, function (...values) {
    return values
  }).onValue(values => {
    values.forEach((y,i) => {
      let x = seriesData[i].length
      let val =  {
        x: x,
        y:y,
      }
        seriesData[i].push(val)
    })
    graph.update()
  })
  return graph
}

module.exports = graph

let kefir = require('kefir')
let Rickshaw = require('rickshaw')
// let timestamp = require('monotonic-timestamp')

// function timestamp () {
//   let d = new Date()
//   return d.getTime()
// }

// TODO times?
// TODO better initial vals?
function graph (title, el, streams, palette='classic9' ) {

  var palette = new Rickshaw.Color.Palette({ scheme: palette })

  let containerel = document.createElement('div')
  el.append(containerel)

  let titleel = document.createElement('h2')
  titleel.innerHTML = title
  containerel.append(titleel)

  let chartel = document.createElement('div')
  chartel.className='chart'
  containerel.append(chartel)

  let previewel = document.createElement('div')
  containerel.append(previewel)

  let legendel = document.createElement('div')
  containerel.append(legendel)

  // let axisel = document.createElement('div')
  // axisel.className = 'y_axis'
  // el.append(axisel)

  let seriesData = streams.map(s => [])

  function newGraph () {
    let graph = new Rickshaw.Graph( {
      renderer: 'line',
      interpolation: 'linear',
      element: chartel,
      max: 1,
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


    let hoverDetail = new Rickshaw.Graph.HoverDetail({
	    graph: graph,
      xFormatter: function(x) {
        // convert form unix epoch to local string
        var d = new Date(0);
        d.setUTCSeconds(x)
        return d
      },
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
    var legend = new Rickshaw.Graph.Legend({
      graph: graph,
      element: legendel,
    });
    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
      graph: graph,
      legend: legend
    });
    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
      graph: graph,
      legend: legend
    });

    return graph
  }


  let graph;
  let kstreams = streams.map(s => s.stream)
  kefir.combine(kstreams, function (...values) {
    return values
  }).onValue(values => {
    values.forEach((y,i) => {
      let x = seriesData[i].length
      let val =  {
        x: Date.now()/1000,
        y: y,
      }
      seriesData[i].push(val)
    })

    if(!graph)
      graph = newGraph()

    graph.update()
  })
  return graph
}

module.exports = graph

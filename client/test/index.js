let ud = require('ud')
let app = require('..')

// everything in this function will get updated on change
var setup = ud.defn(module, function () {
  document.body.innerHTML=''
  let url = 'http://localhost:9998'
  // let url = 'http://8c7f97fc.ngrok.io'
  let el = app(url)
  document.body.appendChild(el)
})

// will re-run setup() whenever method changes
setup()

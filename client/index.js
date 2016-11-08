let app = require('.')
let url = 'verdigris.ischool.berkeley.edu:12047'
let el = app(url)
document.body.appendChild(el)
console.log('running')

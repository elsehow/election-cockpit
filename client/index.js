let app = require('.')
let url = 'ws://electionws.babiesarepsychic.net'
let el = app(url)
document.body.appendChild(el)
console.log('running')

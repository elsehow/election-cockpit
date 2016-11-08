# election-market-watcher

[WIP] watch predictit markets

## setup

    npm install

## use

to watch test/index.js, and its dependencies

    npm run dev

now you can open localhost:9999 in your browser, and edit test/index.js or src/index.js

## license

BSD

## TODO

integration
- buffer read from hyperlog
  - on add to graph, if it has length, concat rather than append. add(dataSeries[i], ...obs)

lib 2
- better graphing library
  - scaleable x- and y-axis
  - clickable legend

lib 1
- generic pluggable getter/Source
  - add with args in UI / remove
  - app-wide source list in a kv
  - predictit, betfair exs

dreaming
- distributed getting
 - with ssb, all assembling feeds
 - .. AND helping to get those feeds ourselves (?)
 - a hyperlog, or feed, of code, to collect data

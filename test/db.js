
var bundle = require('../bundle')
var fs = require('fs')

bundle(__dirname + '/../example.js', function (err, bundle) {
  if(err) throw err
  console.log('READY', bundle.length)
  ;(function () {
    var require = console.log
//    eval(bundle)({thing: true})
  })()
})

var mdeps  = require('module-deps')
var bpack  = require('browser-pack')
var bmeta  = require('bundle-metadata')
var toPull = require('stream-to-pull-stream')
var pull   = require('pull-stream')

var core = require('./core.json')
//var io   = require('./core-io.json')
var fs    = require('fs')

var prelude = fs.readFileSync(__dirname + '/prelude.js', 'utf-8')

var bundle = module.exports = function (dbFile, cb) {
  var s = mdeps(dbFile, {filter: function (e) {
    return  !~core.indexOf(e)
  }})
  .pipe(bmeta().on('meta', function (m) {
    s.emit('meta', m)
  }))
  .pipe(bpack({raw: true, prelude: prelude}))

  if(cb) {
    toPull(s).pipe(pull.collect(function (err, ary) {
      if(err) cb(err)
      else    cb(null, ary.join(''))
    }))
  }

  return s
}

if(!module.parent) {
  var opts = require('optimist').argv
  bundle(opts._[0])
  .pipe(process.stdout)
}


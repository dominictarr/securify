var mdeps  = require('module-deps')
var bpack  = require('browser-pack')
var bmeta  = require('bundle-metadata')
var toPull = require('stream-to-pull-stream')
var pull   = require('pull-stream')
var brfs   = require('brfs')
var insert = require('insert-module-globals')
var through = require('through')

var core = require('./core.json')
var fs    = require('fs')

var vars = {
  __filename: insert.vars.__filename,
  __dirname: insert.vars.__dirname
}



var prelude = fs.readFileSync(__dirname + '/prelude.js', 'utf-8')

var bundle = module.exports = function (dbFile, cb) {
  var s = mdeps(dbFile, {filter: function (e) {
      return  !~core.indexOf(e)
    }})
    .pipe(bmeta().on('meta', function (m) {
      s.emit('meta', m)
    }))
    .pipe(through(function (row) {
       if (/\.json$/.test(row.id)) {
            row.source = 'module.exports=' + row.source;
        }
        this.queue(row)
    }))
    .pipe(insert({vars: vars}))
    .pipe(brfs())
    .pipe(bpack({raw: true, prelude: prelude}))
    
  if(cb) {
    b = ''
    s.on('data', function (d) {
      b += d
    })
    .on('end', function () {
      cb(null, b)
    })
  }

  return s
}

if(!module.parent) {
  var opts = require('optimist').argv
  bundle(opts._[0])
  .pipe(process.stdout)
}


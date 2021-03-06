var vm = require('vm')
//var contextify = require('contextify')
var Domain = require('domain')
var coreIo = require('./core-io.json')

function createContext () {

  var domain = Domain.create()

  domain.on('error', function (err) {
    console.error('error inside context', err)
    domain.dispose()
    context.dispose()
  })

  var started = false

  function createDomain (run) {
    if(started) throw new Error('already started domain')
    started = true
    domain.run(run)
  }

  var intervals = []
  var context = {
    console: {
      log: console.log,
      error: console.error
    },
    setInterval: setInterval, 
    setTimeout: setTimeout,
    clearInterval: clearInterval,
    clearTimeout: clearTimeout,
    require: function (r) {
      if(~coreIo.indexOf(r))
        throw new Error('script *must not* access core io modules')
    }, 
    createDomain: createDomain,

    //TODO: make these safe...

    process: process
  }

  context.global = context

  return context
}

var inject = function (a, b, c) {
  return createDomain(function () {
    ;(
    BUNDLE
    )(a, b, c)
  })
}

var createFactory = module.exports = function (bundle) {
  return vm.runInNewContext(
    '('+inject.toString().replace('BUNDLE', bundle)+')'
  , createContext(), 'securify'
  )
}

if(!module.parent) {
  var fs = require('fs')
  var bundle = fs.readFileSync(process.argv[2], 'utf-8')
  console.log(createFactory(bundle)(require('levelup')(process.argv[3])))
}


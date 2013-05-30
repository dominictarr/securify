var vm = require('vm')
var Domain = require('domain')
var whitelist = require('./whitelist.json')

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
    return domain
  }

  var intervals = []
  var context = {
    console: {
      log: console.log,
      error: console.error
    },
    setInterval: function (fun, i) {
      console.error('setInterval', fun.name || fun.toString().substring(0, 100)+'...')
    
      var int = setInterval(fun, i)
      intervals.push(int)
      return int
    }, 
    setTimeout: setTimeout,
    clearInterval: clearInterval,
    clearTimeout: clearTimeout,
    setImmediate: setImmediate,
    require: function (r) {
      if(!~whitelist.indexOf(r))
        throw new Error('script *must not* access module: ' + r )
      return require(r)
    }, 
    createDomain: createDomain,

    //TODO: make these safe...

    process: process,
  }

  context.global = context
  context.window = context

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




module.exports = function (thing) {
  var pkg = JSON.parse(fs.readFileSync(__dirname +'/package.json', 'utf-8'))
  console.error(pkg)
  console.error(thing)
}

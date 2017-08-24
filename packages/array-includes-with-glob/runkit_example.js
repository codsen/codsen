const includesWithGlob = require('array-includes-with-glob')

var res1 = includesWithGlob(['xc', 'yc', 'zc'], '*c')
console.log('res1: ' + res1)
// => "res1: true"

var res2 = includesWithGlob(['xc', 'yc', 'zc'], '*a')
console.log('res2: ' + res2)
// => "res2: false" (because none were found)

var res3 = includesWithGlob(['something', 'anything', 'zzz'], 'some*')
console.log('res3: ' + res3)
// => "res3: true" (because we had 1 hit)

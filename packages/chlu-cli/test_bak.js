import fs from 'fs'
import test from 'ava'
import path from 'path'
import execa from 'execa'

test.beforeEach(t => {
  let seed = fs.readFileSync(path.join('test', 'seed.md'), 'utf8')
  fs.writeFileSync(path.join('test', 'changelog.md'), seed, 'utf8')
  execa.sync('./cli.js')
})

test('01', t => {
  t.is(
    fs.readFileSync(path.join('test', 'changelog.md'), 'utf8'),
    fs.readFileSync(path.join('test', 'intended.md'), 'utf8')
  )
})

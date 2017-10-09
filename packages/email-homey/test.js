import execa from 'execa'
import test from 'ava'
import homey from './'

test('reads ok', async (t) => {
  t.pass(homey('fixtures'))
})

'use strict'
/* eslint no-template-curly-in-string: 0 */
/* eslint padded-blocks: 0 */

const test = require('ava')

const c = require('..')
const {readFileSync} = require('fs')
const path = require('path')
const fixtures = path.join(__dirname, 'fixtures')

function compare (t, name) {
  const changelog = readFileSync(path.join(fixtures, `${name}_changelog.md`), 'utf8')
  const expected = readFileSync(path.join(fixtures, `${name}_changelog.expected.md`), 'utf8')
  const packageJson = readFileSync(path.join(fixtures, `${name}_package.json`), 'utf8')
  return t.deepEqual(c(changelog, packageJson), expected)
}

function throws (t, name) {
  const changelog = readFileSync(path.join(fixtures, `${name}_changelog.md`), 'utf8')
  const packageJson = readFileSync(path.join(fixtures, `${name}_package.json`), 'utf8')
  return t.throws(function () { c(changelog, packageJson) })
}

// -----------------------------------------------------------------------------

test('01. ascending order, with wrong package names', (t) => {
  return compare(t, '01_asc_order_wrong_package')
})

test('02. ascending order, with correct package names', (t) => {
  return compare(t, '02_asc_order_correct_package')
})

test('03. correct package names, no footer links at all', (t) => {
  return compare(t, '03_no_footer_links')
})

test('04. descending order, with wrong package names', (t) => {
  return compare(t, '04_desc_order_wrong_package')
})

test('05. descending order, with correct package names', (t) => {
  return compare(t, '05_desc_order_correct_package')
})

test('06. there are no linked titles', (t) => {
  return compare(t, '06_not_linked_titles')
})

test('07. non-GitHub package.json - throws', (t) => {
  return throws(t, '07_gitlab_package_json')
})

test('08. mid links missing in changelog.md', (t) => {
  return compare(t, '08_mid_links_missing')
})

test('09. if no input, will silently return indefined', (t) => {
  t.deepEqual(c(), undefined,
    '09.01'
  )
})

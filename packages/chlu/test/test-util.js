'use strict'
/* eslint no-template-curly-in-string: 0 */
/* eslint padded-blocks: 0 */

const test = require('ava')
// const { isTitle, isFooterLink, versionWithBracketsRegex, versionWithoutBracketsRegex, getPreviousVersion, getRow, setRow, getTitlesAndFooterLinks, getRepoInfo, setRepoInfo } = require('../util')
const { isTitle, isFooterLink, getPreviousVersion, aContainsB } = require('../util')

// isTitle
// -------

test('01.01 - isTitle() - negative result', function (t) {
  t.is(isTitle(''), false, '01.01.01')
  t.is(isTitle('a.a.a'), false, '01.01.02')
  t.is(isTitle('a.a.a.'), false, '01.01.03')
  t.is(isTitle('## a.a.a'), false, '01.01.04')
  t.is(isTitle('## [a.a.a] - 2017-04-24'), false, '01.01.05')
  t.is(isTitle('## [1.a.a] - 2017-04-24'), false, '01.01.06')
  t.is(isTitle('## [1.a.a](http://codsen.com)'), false, '01.01.07')
  t.is(isTitle('## [1.a.a]: http://codsen.com'), false, '01.01.08')
  t.is(isTitle('## [1.a.a]:http://codsen.com'), false, '01.01.09')
  t.is(isTitle('[1.a.a]:http://codsen.com'), false, '01.01.10')
  t.is(isTitle('1.a.a:http://codsen.com'), false, '01.01.11')
})

test('01.02 - isTitle() - positive result', function (t) {
  t.is(isTitle('## [1.2.0] - 2017-04-24'), true, '01.02.01')
  t.is(isTitle('## [1.2.0]'), true, '01.02.02')
  t.is(isTitle('## [1.2.0] aaa'), true, '01.02.03')
  t.is(isTitle('# [1.2.0]'), true, '01.02.04')
  t.is(isTitle('[1.2.0]'), true, '01.02.05')
  t.is(isTitle('[1.2.0] Text'), true, '01.02.06')
  t.is(isTitle('1.2.0 Text'), true, '01.02.07')
})

test('01.03 - isTitle() - non-semver, 2 digits only', function (t) {
  t.is(isTitle('## [1.2] - 2017-04-24'), true, '01.03.01')
  t.is(isTitle('## [1.2]'), true, '01.03.02')
  t.is(isTitle('## [1.2] aaa'), true, '01.03.03')
  t.is(isTitle('# [1.2]'), true, '01.03.04')
  t.is(isTitle('[1.2]'), true, '01.03.05')
  t.is(isTitle('[1.2] Text'), true, '01.03.06')
  t.is(isTitle('1.2 Text'), true, '01.03.07')
})

test('01.04 - isTitle() - three hashes, H3', function (t) {
  t.is(isTitle('### [1.2.0] - 2017-04-24'), true, '01.04.01')
  t.is(isTitle('### [1.2.0]'), true, '01.04.02')
  t.is(isTitle('### [1.2.0] aaa'), true, '01.04.03')
})

test('01.05 - isTitle() - four hashes, H4', function (t) {
  t.is(isTitle('#### [1.2.0] - 2017-04-24'), true, '01.05.01')
  t.is(isTitle('#### [1.2.0]'), true, '01.05.02')
  t.is(isTitle('#### [1.2.0] aaa'), true, '01.05.03')
})

test('01.05 - isTitle() - all kinds of throws', function (t) {
  t.throws(function () { isTitle(1) })
  t.throws(function () { isTitle(true) })
  t.throws(function () { isTitle(null) })
  t.notThrows(function () { isTitle(undefined) })
  t.notThrows(function () { isTitle('zzz') })
})

// isFooterLink
// ------------

test('02.01 - isFooterLink() - negative result', function (t) {
  t.is(isFooterLink(''), false, '02.01.01')
  t.is(isFooterLink(), false, '02.01.02')
  t.is(isFooterLink('[1.1.0](https://github.com)'), false, '02.01.03')
  t.is(isFooterLink('1.1.0: https://github.com'), false, '02.01.04')
  t.is(isFooterLink('[1.1.0](github.com)'), false, '02.01.05')
})

test('02.02 - isFooterLink() - positive result', function (t) {
  t.is(isFooterLink('[1.1.0]: https://github.com/code-and-send/wrong-lib/compare/v1.0.0...v1.1.0'), true, '02.02.01')
  t.is(isFooterLink('[1.1.0]: https://github.com'), true, '02.02.02')
})

test('02.03 - isFooterLink() - all kinds of throws', function (t) {
  t.throws(function () { isFooterLink(1) })
  t.throws(function () { isFooterLink(true) })
  t.throws(function () { isFooterLink(null) })
  t.notThrows(function () { isFooterLink(undefined) })
  t.notThrows(function () { isFooterLink('zzz') })
})

// getPreviousVersion
// ------------------

test('03.01 - getPreviousVersion() - various throws', function (t) {
  t.throws(function () { getPreviousVersion() })
  t.throws(function () { getPreviousVersion('zzz') })
  t.throws(function () { getPreviousVersion(1, ['zzz']) })
  t.throws(function () { getPreviousVersion(1, 1) })
  t.throws(function () { getPreviousVersion('zzz', 1) })
  t.throws(function () { getPreviousVersion('zzz', '1') })
  t.throws(function () { getPreviousVersion('zzz', ['yyy']) })
})

test('03.02 - getPreviousVersion() - BAU', function (t) {
  t.is(getPreviousVersion(
    '1.1.0',
    ['1.1.0', '1.2.0', '1.3.0', '1.0.0']
  ), '1.0.0',
  '03.02.01')
  t.is(getPreviousVersion(
    '3.0.0',
    ['1.0.0', '3.0.0', '2.0.0', '4.0.0']
  ), '2.0.0',
  '03.02.02')
})

// aContainsB
// ------------------

test('04.01 - aContainsB() - BAU', function (t) {
  t.is(aContainsB('aaaaaabcdddddd', 'bc'),
  true,
  '04.01.01')
  t.is(aContainsB('aaaaaabcdddddd', null),
  false,
  '04.01.02')
  t.is(aContainsB('aaaaaabcdddddd'),
  false,
  '04.01.03')
})

'use strict'

const cmp = require('semver-compare')
const clone = require('lodash.clonedeep')
const isNum = require('is-natural-number')
const trim = require('lodash.trim')

// REGEXES
// -----------------------------------------------------------------------------

var versionWithBracketsRegex = /\[\d+\.\d+(\.\d+)*\]/g
var versionWithoutBracketsRegex = /\d+\.\d+(\.\d)*/g

// FUNCTIONS
// -----------------------------------------------------------------------------

function existy (x) { return x != null }
function truthy (x) { return (x !== false) && existy(x) }
function isArr (something) { return Array.isArray(something) }
function isStr (something) { return typeof something === 'string' }
function aContainsB (a, b) {
  if (!truthy(a) || !truthy(b)) {
    return false
  }
  return a.indexOf(b) >= 0
}

function getTitlesAndFooterLinks (linesArr) {
  var titles = []
  var footerLinks = []
  var i, len, temp
  for (i = 0, len = linesArr.length; i < len; i++) {
    if (isTitle(linesArr[i])) {
      let firstEncounteredVersion = linesArr[i].match(versionWithoutBracketsRegex)[0]
      titles.push({
        version: firstEncounteredVersion,
        rowNum: i,
        linked: existy(linesArr[i].match(versionWithBracketsRegex)),
        content: linesArr[i],
        beforeVersion: linesArr[i].split(firstEncounteredVersion)[0],
        afterVersion: linesArr[i].split(firstEncounteredVersion)[1]
      })
    } else if (isFooterLink(linesArr[i])) {
      temp = linesArr[i].match(versionWithBracketsRegex)[0]
      footerLinks.push({
        version: temp.substring(1, temp.length - 1),
        rowNum: i,
        content: linesArr[i]
      })
    }
  }
  return {
    titles: titles,
    footerLinks: footerLinks
  }
}

// Is current string a title?
// For example, "## [1.2.0] - 2017-04-24" is.
// For example, "[1.1.0]: https://github.com/codsen/wrong-lib/compare/v1.0.1...v1.1.0" is not
function isTitle (str) {
  if (str === undefined) {
    return false
  } else if (!isStr(str)) {
    throw new TypeError('chlu/util.js/isTitle(): [THROW_ID_01] The input must be string')
  }
  var stringInFrontOfVersion
  if (existy(str.match(versionWithoutBracketsRegex))) {
    stringInFrontOfVersion = str.split(str.match(versionWithoutBracketsRegex)[0])
    if (stringInFrontOfVersion === null) {
      stringInFrontOfVersion = ''
    } else {
      stringInFrontOfVersion = stringInFrontOfVersion[0]
    }
  }
  return (
    (str.length > 0) &&
    existy(str.match(versionWithoutBracketsRegex)) &&
    !str.includes('http') &&
    !str.includes(']:') &&
    (trim(stringInFrontOfVersion, '[# \t') === '')
  )
}

function isFooterLink (str) {
  if (str === undefined) {
    return false
  } else if (!isStr(str)) {
    throw new TypeError('chlu/util.js/isFooterLink(): [THROW_ID_02] The input must be string')
  }
  return (
    (str.length > 0) &&
    existy(str.match(versionWithBracketsRegex)) &&
    aContainsB(str, ']:')
  )
}

function getPreviousVersion (currVers, versionsArr) {
  if (arguments.length < 2) {
    throw new Error('chlu/util.js/getPreviousVersion(): [THROW_ID_03] There must be two arguments, string and an array.')
  }
  if (!isStr(currVers)) {
    throw new Error('chlu/util.js/getPreviousVersion(): [THROW_ID_04] The first argument must be string. Currently it\'s ' + typeof currVers)
  }
  if (!isArr(versionsArr)) {
    throw new Error('chlu/util.js/getPreviousVersion(): [THROW_ID_05] The second argument must be array. Currently it\'s ' + typeof versionsArr)
  }
  versionsArr = versionsArr.sort(cmp)
  // first, check if it's the first version from the versions array.
  // in that case, there's no previous version, so we return null:
  if (currVers === versionsArr[0]) {
    return null
  }
  // next, iterate versions array and try to get the previous version:
  for (let i = 0, len = versionsArr.length; i < len; i++) {
    if ((versionsArr[i] === currVers) && existy(versionsArr[i - 1])) {
      return versionsArr[i - 1]
    }
  }
  // if nothing was found yet, throw:
  throw new Error('chlu/util.js/getPreviousVersion(): [THROW_ID_06] The given version (' + currVers + ') is not in the versions array (' + JSON.stringify(versionsArr, null, 4) + ')')
}

function setRow (rowsArray, index, content) {
  var res = clone(rowsArray)
  for (let i = 0, len = res.length; i < len; i++) {
    if (i === index) {
      res[i] = content
    }
  }
  return res
}

function getRow (rowsArray, index) {
  if (!existy(index) || !isNum(index)) {
    throw new TypeError('chlu/util.js/getRow(): [THROW_ID_07]: first input arg must be a natural number. Currently it\'s given as: ' + typeof index + ' and equal: ' + JSON.stringify(index, null, 4))
  }
  if (!existy(rowsArray) || !isArr(rowsArray)) {
    throw new TypeError('chlu/util.js/getRow(): [THROW_ID_08]: second input arg must be an rowsArrayay. Currently it\'s given as: ' + typeof rowsArray + ' and equal: ' + JSON.stringify(rowsArray, null, 4))
  }
  for (let i = 0, len = rowsArray.length; i < len; i++) {
    if (i === index) {
      return rowsArray[i]
    }
  }
  return null
}

// gets and sets various pieces in strings of the format:
// "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0"
function getSetFooterLink (str, o) {
  let mode
  if (existy(o)) { mode = 'set' } else { mode = 'get'; o = {} }
  if (
    (typeof str !== 'string') ||
    !str.includes('/')
  ) {
    return null
  }
  let split = str.split('/')
  let res = {}

  for (let i = 0, len = split.length; i < len; i++) {
    if (split[i] === 'github.com') {
      res.user = existy(o.user) ? o.user : split[i + 1]
      res.project = existy(o.project) ? o.project : split[i + 2]
    } else if (split[i] === 'compare') {
      if (split[i + 1].includes('...')) {
        let splitVersions = split[i + 1].split('...')
        res.versBefore = existy(o.versBefore) ? o.versBefore : trim(splitVersions[0], 'v')
        res.versAfter = existy(o.versAfter) ? o.versAfter : trim(splitVersions[1], 'v')
      } else {
        // incurance against broken compare links:
        return null
      }
    } else if (i === 0) {
      res.version = existy(o.version) ? o.version : split[i].match(versionWithoutBracketsRegex)[0]
    }
  }
  if (mode === 'get') {
    return res
  } else {
    return `[${res.version}]: https://github.com/${res.user}/${res.project}/compare/v${res.versBefore}...v${res.versAfter}`
  }
}

function versionSort (a, b) {
  return cmp(a.version, b.version)
}

function filterDate (someString) {
  let res = someString.trim()
  res = res.replace('.', ' ')
  res = res.replace(',', ' ')
  res = res.replace(';', ' ')
  res = res.replace('  ', ' ')
  res = res.replace('  ', ' ')
  res = trim(res, '[](),.- \u2013\u2014\t\u00A0')
  return res
}

// FIN
// -----------------------------------------------------------------------------

module.exports = {
  isTitle: isTitle,
  isFooterLink: isFooterLink,
  versionWithBracketsRegex: versionWithBracketsRegex,
  versionWithoutBracketsRegex: versionWithoutBracketsRegex,
  getPreviousVersion: getPreviousVersion,
  getRow: getRow,
  setRow: setRow,
  getTitlesAndFooterLinks: getTitlesAndFooterLinks,
  getSetFooterLink: getSetFooterLink,
  aContainsB: aContainsB,
  versionSort: versionSort,
  filterDate: filterDate
}

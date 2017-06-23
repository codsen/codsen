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
  return (
    (str.length > 0) &&
    existy(str.match(versionWithoutBracketsRegex)) &&
    !aContainsB(str, 'http') &&
    !aContainsB(str, ']:')
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
    aContainsB(str, ']: http')
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
  for (var i = 0, len = versionsArr.length; i < len; i++) {
    if ((versionsArr[i] === currVers) && existy(versionsArr[i - 1])) {
      return versionsArr[i - 1]
    }
  }
  throw new Error('chlu/util.js/getPreviousVersion(): [THROW_ID_06] The given version (' + currVers + ') is not in the versions array (' + JSON.stringify(versionsArr, null, 4) + ')')
}

function setRow (rowsArray, index, content) {
  var res = clone(rowsArray)
  for (var i = 0, len = res.length; i < len; i++) {
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
  for (var i = 0, len = rowsArray.length; i < len; i++) {
    if (i === index) {
      return rowsArray[i]
    }
  }
  return null
}

// consumes link strings like "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0"
// returns {user: "userName", project: "libName"}
function getRepoInfo (str) {
  var split = str.split('/')
  var res = {}
  // console.log('split = ' + JSON.stringify(split, null, 4))
  for (var i = 0, len = split.length; i < len; i++) {
    if (split[i] === 'github.com') {
      res.user = split[i + 1]
      res.project = split[i + 2]
      break
    }
  }
  return res
}

// consumes link strings like "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0"
// and user (substitute for "userName" above)
// and package name (substitute for "libName" above)
// then writes them over and returns the new string.
function setRepoInfo (str, newUser, newProject) {
  var split = str.split('/')
  for (var i = 0, len = split.length; i < len; i++) {
    if (split[i] === 'github.com') {
      split[i + 1] = existy(newUser) ? newUser : split[i + 1]
      split[i + 2] = existy(newProject) ? newProject : split[i + 2]
    }
  }
  return split.join('/')
}

function versionSort (a, b) {
  return cmp(a.version, b.version)
}

function filterDate (someString) {
  let res = someString.trim()
  res = trim(res, '- []()')
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
  getRepoInfo: getRepoInfo,
  setRepoInfo: setRepoInfo,
  aContainsB: aContainsB,
  versionSort: versionSort,
  filterDate: filterDate
}

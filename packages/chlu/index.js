'use strict'

const reverse = require('lodash.reverse')
const splitLines = require('split-lines')
const util = require('./util')
const getPkgRepo = require('get-pkg-repo')
const cmp = require('semver-compare')
const empty = require('posthtml-ast-contains-only-empty-space')
const insert = require('just-insert')
const clone = require('lodash.clonedeep')

// FUNCTIONS
// -----------------------------------------------------------------------------

function existy (x) { return x != null }
const getPreviousVersion = util.getPreviousVersion
const getTitlesAndFooterLinks = util.getTitlesAndFooterLinks
const getRepoInfo = util.getRepoInfo
const setRepoInfo = util.setRepoInfo
const setRow = util.setRow
const versionSort = util.versionSort

// ACTION
// -----------------------------------------------------------------------------

function chlu (changelogContents, packageJsonContents) {
  if ((arguments.length === 0) || !existy(changelogContents)) {
    return
  }

  var changelogMd = changelogContents

  // TODO - add measures against wrong/missing json
  var packageJson = getPkgRepo(packageJsonContents)

  if (packageJson.type !== 'github') {
    throw new Error('chlu/chlu(): [THROW_ID_01] Package JSON shows the library is not GitHub-based, but based on ' + packageJson.type)
  }

  var temp, i, len, start
  var titles = []
  var footerLinks = []
  var newLinesArr = []

  // ACTION
  // -----------------------------------------------------------------------------

  // =======
  // stage 1: iterate through all lines and:
  // - record all titles, like:
  //   "## [1.2.0] - 2017-04-24"
  // - record all url links at the bottom, like:
  //   "[1.1.0]: https://github.com/code-and-send/wrong-lib/compare/v1.0.1...v1.1.0"
  var linesArr = splitLines(changelogMd)

  titles = getTitlesAndFooterLinks(linesArr).titles
  footerLinks = getTitlesAndFooterLinks(linesArr).footerLinks

  // =======
  // stage 2: locate titles don't have footer links

  var missingFooterLinks = []
  for (i = 0, len = titles.length; i < len; i++) {
    if (titles[i].linked) {
      var linkFound = footerLinks.some(function (el) {
        return titles[i].version === el.version
      })
      if (!linkFound) {
        missingFooterLinks.push(titles[i])
      }
    }
  }

  // =======
  // stage 3: find out what is the order of footer links

  var ascendingFooterLinkCount = 0
  var descendingFooterLinkCount = 0

  if (footerLinks.length > 1) {
    for (i = 0, len = footerLinks.length; i < len - 1; i++) {
      if (cmp(footerLinks[i].version, footerLinks[i + 1].version) === 1) {
        descendingFooterLinkCount++
      } else {
        ascendingFooterLinkCount++
      }
    }
  }

  var ascending = true
  if (ascendingFooterLinkCount <= descendingFooterLinkCount) {
    ascending = false
  }

  // =======
  // stage 4: get the ordered array of all title versions

  var sortedTitlesArray = titles.map(function (el) {
    return el.version
  }).sort(cmp)

  // =======
  // stage 5: calculate what goes where

  var whereToPlaceIt
  // calculate the Where
  if (footerLinks.length === 0) {
    // count from the end of the file.
    // if last non-empty line has "]:" in it, place right after it.
    // otherwise, insert an empty line. This means there's content only and no links yet.
    for (i = linesArr.length - 1, start = 0; i >= start; i--) {
      if (existy(linesArr[i]) && !empty(linesArr[i])) {
        whereToPlaceIt = i + 2
        break
      }
      // TODO: Remember to add a blank line at the bottom!
    }
  } else {
    whereToPlaceIt = footerLinks[0].rowNum
  }

  // =======
  // stage 6: assemble the new chunk - array of new lines

  temp = []
  missingFooterLinks.forEach(function (key) {
    temp.push('[' + key.version + ']: https://github.com/' + packageJson.user + '/' + packageJson.project + '/compare/v' + getPreviousVersion(key.version, sortedTitlesArray) + '...v' + key.version)
  })
  if (ascending) {
    temp = reverse(temp)
  }

  // =======
  // stage 7: insert new rows into linesArr

  newLinesArr = insert(linesArr, temp, whereToPlaceIt)

  // =======
  // stage 8: prepare for checking are footerLinks correct.
  // calculate title and footeLinks again, this time including our additions

  temp = getTitlesAndFooterLinks(newLinesArr)
  titles = temp.titles
  footerLinks = temp.footerLinks

  // =======
  // stage 9: check all footerLinks

  for (i = 0, len = footerLinks.length; i < len; i++) {
    var extracted = getRepoInfo(footerLinks[i].content)
    if ((extracted.user !== packageJson.user) || (extracted.project !== packageJson.project)) {
      footerLinks[i].content = setRepoInfo(footerLinks[i].content, packageJson.user, packageJson.project)
      //
      // write over:
      //
      newLinesArr = setRow(newLinesArr, footerLinks[i].rowNum, footerLinks[i].content)
    }
  }

  // ========
  // stage 10: sort all footer links, depending on a current preference

  temp = clone(footerLinks).sort(versionSort)
  if (!ascending) {
    temp = temp.reverse()
  }

  footerLinks.forEach((footerLink, index) => {
    newLinesArr = setRow(newLinesArr, footerLink.rowNum, temp[index].content)
  })

  // add trailing empty line if it's missing:
  if (newLinesArr[newLinesArr.length - 1] !== '') {
    newLinesArr.push('')
  }
  return newLinesArr.join('\n')
}

module.exports = chlu

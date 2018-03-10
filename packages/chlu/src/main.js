/* eslint prefer-destructuring:0, no-loop-func:0, no-plusplus:0, consistent-return:0 */

import reverse from 'lodash.reverse'
import splitLines from 'split-lines'
import getPkgRepo from 'get-pkg-repo'
import serverCompare from 'semver-compare'
import empty from 'ast-contains-only-empty-space'
import insert from 'just-insert'
import clone from 'lodash.clonedeep'
import includes from 'lodash.includes'
import min from 'lodash.min'
import dd from 'dehumanize-date'

import {
  getPreviousVersion,
  getTitlesAndFooterLinks,
  getSetFooterLink,
  setRow,
  getRow,
  versionSort,
  filterDate,
} from './util'

// F'S
// -----------------------------------------------------------------------------

function existy(x) { return x != null }

// ACTION
// -----------------------------------------------------------------------------

function chlu(changelogContents, packageJsonContents) {
  if ((arguments.length === 0) || !existy(changelogContents)) {
    return
  }

  const changelogMd = changelogContents

  // TODO - add measures against wrong/missing json
  const packageJson = getPkgRepo(packageJsonContents)

  if (packageJson.type !== 'github') {
    throw new Error(`chlu/chlu(): [THROW_ID_01] Package JSON shows the library is not GitHub-based, but based on ${packageJson.type}`)
  }

  let temp
  let titles = []
  let footerLinks = []
  let newLinesArr = []

  // ACTION
  // -----------------------------------------------------------------------------

  // =======
  // stage 1: iterate through all lines and:
  // - record all titles, like:
  //   "## [1.2.0] - 2017-04-24"
  // - record all url links at the bottom, like:
  //   "[1.1.0]: https://github.com/codsen/wrong-lib/compare/v1.0.1...v1.1.0"
  const linesArr = splitLines(changelogMd)

  let titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr)
  titles = titlesAndFooterLinks.titles
  footerLinks = titlesAndFooterLinks.footerLinks
  // console.log('titlesAndFooterLinks = ' + JSON.stringify(titlesAndFooterLinks, null, 4))

  // =======
  // stage 2: remove any invalid footer links

  for (let i = 0, len = footerLinks.length; i < len; i++) {
    if (!existy(getSetFooterLink(footerLinks[i].content))) {
      linesArr.splice(footerLinks[i].rowNum, 1)
    }
  }

  // recalculate:
  titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr)
  titles = titlesAndFooterLinks.titles
  footerLinks = titlesAndFooterLinks.footerLinks

  // =======
  // stage 3: get the ordered array of all title versions

  const sortedTitlesArray = titles.map(el => el.version).sort(serverCompare)

  // =======
  // stage 4: find unused footer links

  let unusedFooterLinks = footerLinks
    .filter(link => !includes(titles.map(title => title.version), link.version))

  while (unusedFooterLinks.length > 0) {
    linesArr.splice(unusedFooterLinks[0].rowNum, 1)
    footerLinks = getTitlesAndFooterLinks(linesArr).footerLinks
    unusedFooterLinks = footerLinks
      .filter(link => !includes(titles.map(title => title.version), link.version))
  }

  // =======
  // stage 5: create footer links for all titles except the smallest version-one

  const missingFooterLinks = []
  for (let i = 0, len = titles.length; i < len; i++) {
    if ((len > 1) && (titles[i].version !== sortedTitlesArray[0])) {
      const linkFound = footerLinks.some(el => titles[i].version === el.version)
      if (!linkFound) {
        missingFooterLinks.push(titles[i])
      }
    }
  }

  // =======
  // stage 6: find out what is the order of footer links

  let ascendingFooterLinkCount = 0
  let descendingFooterLinkCount = 0

  if (footerLinks.length > 1) {
    for (let i = 0, len = footerLinks.length; i < len - 1; i++) {
      if (serverCompare(footerLinks[i].version, footerLinks[i + 1].version) === 1) {
        descendingFooterLinkCount++
      } else {
        ascendingFooterLinkCount++
      }
    }
  }

  let ascending = true
  if (ascendingFooterLinkCount <= descendingFooterLinkCount) {
    ascending = false
  }

  // =======
  // stage 7: calculate what goes where

  let whereToPlaceIt
  // calculate the Where
  if (footerLinks.length === 0) {
    // count from the end of the file.
    // if last non-empty line has "]:" in it, place right after it.
    // otherwise, insert an empty line. This means there's content only and no links yet.
    for (let i = linesArr.length - 1, start = 0; i >= start; i--) {
      if (existy(linesArr[i]) && !empty(linesArr[i])) {
        whereToPlaceIt = i + 2
        break
      }
    }
  } else {
    whereToPlaceIt = footerLinks[0].rowNum
  }

  // =======
  // stage 8: assemble the new chunk - array of new lines

  temp = []
  missingFooterLinks.forEach((key) => {
    temp.push(`[${key.version}]: https://github.com/${packageJson.user}/${packageJson.project}/compare/v${getPreviousVersion(key.version, sortedTitlesArray)}...v${key.version}`)
  })
  if (ascending) {
    temp = reverse(temp)
  }

  // =======
  // stage 9: insert new rows into linesArr

  newLinesArr = insert(linesArr, temp, whereToPlaceIt)

  // =======
  // stage 10: prepare for checking are footerLinks correct.
  // calculate title and footerLinks again, this time, including our additions

  temp = getTitlesAndFooterLinks(newLinesArr)
  titles = temp.titles
  footerLinks = temp.footerLinks

  for (let i = 0, len = footerLinks.length; i < len; i++) {
    const extracted = getSetFooterLink(footerLinks[i].content)
    if (
      extracted.versAfter !== extracted.version ||
      extracted.versAfter !== footerLinks[i].version
    ) {
      footerLinks[i].content = getSetFooterLink(footerLinks[i].content, {
        versAfter: extracted.version,
      })
    }
    // versBefore can't be lesser than the version of the previous title
    if (
      existy(getPreviousVersion(footerLinks[i].version, sortedTitlesArray)) &&
      serverCompare(
        extracted.versBefore,
        getPreviousVersion(footerLinks[i].version, sortedTitlesArray),
      ) < 0
    ) {
      footerLinks[i].content = getSetFooterLink(footerLinks[i].content, {
        versBefore: getPreviousVersion(extracted.version, sortedTitlesArray),
      })
    }
    if (extracted.user !== packageJson.user) {
      footerLinks[i].content = getSetFooterLink(footerLinks[i].content, {
        user: packageJson.user,
      })
    }
    if (extracted.project !== packageJson.project) {
      footerLinks[i].content = getSetFooterLink(footerLinks[i].content, {
        project: packageJson.project,
      })
    }
    // write over:
    newLinesArr = setRow(newLinesArr, footerLinks[i].rowNum, footerLinks[i].content)
  }

  // ========
  // stage 11: sort all footer links, depending on a current preference

  temp = clone(footerLinks).sort(versionSort)
  if (!ascending) {
    temp = temp.reverse()
  }

  footerLinks.forEach((footerLink, index) => {
    newLinesArr = setRow(newLinesArr, footerLink.rowNum, temp[index].content)
  })

  // ========
  // stage 12: delete empty rows between footer links:

  const firstRowWithFooterLink = min(footerLinks.map(link => link.rowNum))
  for (let i = firstRowWithFooterLink + 1, len = newLinesArr.length; i < len; i++) {
    if ((newLinesArr[i] === '') || ((newLinesArr[i] !== undefined) && (newLinesArr[i].trim() === ''))) {
      newLinesArr.splice(i, 1)
      i--
    }
  }

  // ========
  // stage 13: add trailing empty line if it's missing:

  if (newLinesArr[newLinesArr.length - 1] !== '') {
    newLinesArr.push('')
  }

  // ========
  // stage 14: add any missing line break before footer links

  titlesAndFooterLinks = getTitlesAndFooterLinks(newLinesArr)
  titles = titlesAndFooterLinks.titles
  footerLinks = titlesAndFooterLinks.footerLinks

  if (
    existy(footerLinks) &&
    (footerLinks.length > 0) &&
    !empty(getRow(newLinesArr, (footerLinks[0].rowNum - 1)))
  ) {
    newLinesArr.splice(footerLinks[0].rowNum, 0, '')
  }

  // ========
  // stage 15: normalise titles

  const gitStuffReadyYet = false

  if (gitStuffReadyYet) {
    // TODO: implement lookup against .git logs
  } else {
    titles.forEach((title) => {
      const fixedDate = dd(filterDate(title.afterVersion))

      if (fixedDate !== null) {
        newLinesArr = setRow(newLinesArr, title.rowNum, `## ${title.version !== sortedTitlesArray[0] ? '[' : ''}${title.version}${title.version !== sortedTitlesArray[0] ? ']' : ''} - ${fixedDate}`)
      } else {
        // if date is unrecogniseable leave it alone, fix the rest of the title
        newLinesArr = setRow(newLinesArr, title.rowNum, `## ${title.version !== sortedTitlesArray[0] ? '[' : ''}${title.version}${title.version !== sortedTitlesArray[0] ? ']' : ''} - ${filterDate(title.afterVersion)}`)
      }
    })
  }

  return newLinesArr.join('\n')
}

export default chlu

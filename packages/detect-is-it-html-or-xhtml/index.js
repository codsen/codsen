'use strict'

// ===================================
// F U N C T I O N S

function existy (x) { return x != null }

function detectIsItHTMLOrXhtml (input) {
  var i, len, allImageTagsArr, allBRTagsArr, allHRTagsArr, allConcernedTagsArr
  var slashCount = 0
  var metaTag = /<\s*!\s*doctype[^>]*>/im
  var imgTag = /<\s*img[^>]*>/ig
  var brTag = /<\s*br[^>]*>/ig
  var hrTag = /<\s*hr[^>]*>/ig
  var closingSlash = /\/\s*>/g
  var extractedMetaTag = null
  var res = null

  extractedMetaTag = metaTag.exec(input)

  if (existy(extractedMetaTag)) {
    // detect by doctype meta tag
    var xhtmlRegex = /xhtml/gi
    var svgRegex = /svg/gi
    if (extractedMetaTag[0].match(xhtmlRegex) || extractedMetaTag[0].match(svgRegex)) {
      res = 'xhtml'
    } else {
      res = 'html'
    }
  } else {
    // detect by scanning single tags
    allImageTagsArr = input.match(imgTag) || []
    allBRTagsArr = input.match(brTag) || []
    allHRTagsArr = input.match(hrTag) || []

    // join all found tags
    allConcernedTagsArr = allImageTagsArr.concat(allBRTagsArr).concat(allHRTagsArr)

    if (allConcernedTagsArr.length === 0) {
      return null
    }

    // count closing slashes
    for (i = 0, len = allConcernedTagsArr.length; i < len; i++) {
      if (existy(allConcernedTagsArr[i].match(closingSlash))) {
        slashCount++
      }
    }

    if (slashCount > (allConcernedTagsArr.length / 2)) {
      res = 'xhtml'
    } else {
      res = 'html'
    }
  }

  return res
}

module.exports = detectIsItHTMLOrXhtml

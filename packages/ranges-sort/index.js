const isNatNum = require('is-natural-number')
const ordinalSuffix = require('ordinal-number-suffix')
const checkTypes = require('check-types-mini')

const isArr = Array.isArray

//
//                              /\___/\
//                             ( o   o )
//                             (  =^=  )
//                             (        )
//                             (         )
//                             (          )))))))))))
//

// does this: [ [2, 5], [1, 6] ] => [ [1, 6], [2, 5] ]
// sorts first by first element, then by second. Retains possible third element.

function srt(arrOfRanges, originalOptions) {
  // arrOfRanges validation
  if (!isArr(arrOfRanges)) {
    throw new TypeError(`ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(arrOfRanges, null, 4)}`)
  }
  if (arrOfRanges.length === 0) {
    return arrOfRanges
  }

  // opts validation

  // declare defaults, so we can enforce types later:
  const defaults = {
    strictlyTwoElementsInRangeArrays: false,
  }
  // fill any settings with defaults if missing:
  const opts = Object.assign({}, defaults, originalOptions)
  // the check:
  checkTypes(opts, defaults, { msg: 'ranges-sort: [THROW_ID_02*]' })

  // arrOfRanges validation

  let culpritsIndex
  let culpritsLen

  if (opts.strictlyTwoElementsInRangeArrays) {
    // validate does every range consist of exactly two indexes:
    if (!arrOfRanges.every((rangeArr, indx) => {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx
        culpritsLen = rangeArr.length
        return false
      }
      return true
    })) {
      throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${ordinalSuffix(culpritsIndex)} range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) has not two but ${culpritsLen} elements!`)
    }
  }
  // validate are range indexes natural numbers:
  if (!arrOfRanges.every((rangeArr, indx) => {
    if (
      !isNatNum(rangeArr[0], { includeZero: true }) ||
      !isNatNum(rangeArr[1], { includeZero: true })
    ) {
      culpritsIndex = indx
      return false
    }
    return true
  })) {
    throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${ordinalSuffix(culpritsIndex)} range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) does not consist of only natural numbers!`)
  }
  return Array.from(arrOfRanges).sort((range1, range2) => {
    if (range1[0] === range2[0]) {
      if (range1[1] < range2[1]) {
        return -1
      }
      if (range1[1] > range2[1]) {
        return 1
      }
      return 0
    }
    if (range1[0] < range2[0]) {
      return -1
    }
    return 1
  })
}

module.exports = srt

const isInt = require('is-natural-number')
const isNumStr = require('is-natural-number-string')
const ordinal = require('ordinal-number-suffix')
const mergeRanges = require('ranges-merge')

function mandatory(i) {
  throw new Error(`string-slices-array-push/Slices/add(): [THROW_ID_01] Missing ${i}${ordinal(i)} parameter`)
}

// -----------------------------------------------------------------------------

class Slices {
  //

  // A D D ()
  // ==================
  add(originalFrom = mandatory(1), originalTo = mandatory(2), addVal, ...etc) {
    function existy(x) { return x != null }
    // validation
    const from = isNumStr(originalFrom) ? parseInt(originalFrom, 10) : originalFrom
    const to = isNumStr(originalTo) ? parseInt(originalTo, 10) : originalTo
    if (!isInt(from, { includeZero: true })) {
      throw new TypeError(`string-slices-array-push/Slices/add(): [THROW_ID_02] "from" value, first input argument, must be a natural number or zero! Currently it's equal to: ${JSON.stringify(from, null, 4)}`)
    }
    if (!isInt(to, { includeZero: true })) {
      throw new TypeError(`string-slices-array-push/Slices/add(): [THROW_ID_03] "to" value, second input argument, must be a natural number! Currently it's equal to: ${JSON.stringify(to, null, 4)}`)
    }
    if (existy(addVal) && (typeof addVal !== 'string')) {
      throw new TypeError(`string-slices-array-push/Slices/add(): [THROW_ID_04] "addVal" value, third input argument, must be a string! Currently it's equal to: ${JSON.stringify(addVal, null, 4)}`)
    }
    if (etc.length > 0) {
      throw new TypeError(`string-slices-array-push/Slices/add(): [THROW_ID_05] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ${JSON.stringify(etc, null, 4)}`)
    }

    // action

    // does the incoming "from" value match the existing last element's "to" value?
    if (
      (this.slices !== undefined) &&
      (from === this.last()[1])
    ) {
      // the incoming range is an exact extension of the last range, like
      // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
      this.last()[1] = to
      if (existy(addVal)) {
        this.last()[2] = (
          existy(this.last()[2]) && this.last()[2].length > 0
        ) ? this.last()[2] + addVal : addVal
      }
    } else {
      if (!this.slices) {
        this.slices = []
      }
      this.slices.push(addVal ? [from, to, addVal] : [from, to])
    }
  }

  // C U R R E N T ()
  // ==================
  current() {
    if (this.slices != null) { // != is intentional
      this.slices = mergeRanges(this.slices)
      return this.slices
    }
    return null
  }

  // W I P E ()
  // ==================
  wipe() {
    this.slices = undefined
  }

  // L A S T ()
  // ==================
  last() {
    if ((this.slices !== undefined) && Array.isArray(this.slices)) {
      return this.slices[this.slices.length - 1]
    }
    return null
  }
}

module.exports = Slices

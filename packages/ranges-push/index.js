'use strict'

const isInt = require('is-natural-number')
const isNumStr = require('is-natural-number-string')
const ordinal = require('ordinal-number-suffix')
const mergeRanges = require('./util').mergeRanges

function mandatory (i) {
  throw new Error(`string-slices-array-push/Slices/add(): [THROW_ID_01] Missing parameter ${i}${ordinal(i)}`)
}

class Slices {
  //

  // A D D ()
  // ==================
  add (from = mandatory(1), to = mandatory(2), addVal, ...etc) {
    function existy (x) { return x != null }
    // validation
    if (isNumStr(from)) { from = parseInt(from, 10) }
    if (isNumStr(to)) { to = parseInt(to, 10) }
    if (!isInt(from)) {
      throw new TypeError(`string-slices-array-push/Slices/add(): [THROW_ID_02] "from" value, first input argument, must be a natural number! Currently it's equal to: ${JSON.stringify(from, null, 4)}`)
    }
    if (!isInt(to)) {
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
        this.last()[2] = (existy(this.last()[2]) && this.last()[2].length > 0) ? this.last()[2] + addVal : addVal
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
  current () {
    function existy (x) { return x != null }
    if (existy(this.slices)) {
      return mergeRanges(this.slices)
    } else {
      return null
    }
  }

  // W I P E ()
  // ==================
  wipe () {
    this.slices = undefined
  }

  // L A S T ()
  // ==================
  last () {
    if ((this.slices !== undefined) && Array.isArray(this.slices)) {
      return this.slices[this.slices.length - 1]
    } else {
      return null
    }
  }
}

module.exports = Slices

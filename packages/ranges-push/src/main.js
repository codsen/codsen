import isInt from 'is-natural-number'
import isNumStr from 'is-natural-number-string'
import ordinal from 'ordinal-number-suffix'
import mergeRanges from 'ranges-merge'
import checkTypes from 'check-types-mini'
import collapseLeadingWhitespace from 'string-collapse-leading-whitespace'

function existy(x) { return x != null }
function mandatory(i) {
  throw new Error(`string-slices-array-push/Slices/add(): [THROW_ID_01] Missing ${ordinal(i)} parameter!`)
}

// -----------------------------------------------------------------------------

class Slices {
  //

  // O P T I O N S
  // ==================
  constructor(originalOpts) {
    // validation first:
    const defaults = {
      limitToBeAddedWhitespace: false,
    }
    const opts = Object.assign({}, defaults, originalOpts)
    checkTypes(
      opts, defaults,
      {
        msg: 'string-slices-array-push: [THROW_ID_00*]',
      },
    )
    // so it's correct, let's get it in:
    this.opts = opts
  }

  // A D D ()
  // ==================
  add(originalFrom = mandatory(1), originalTo = mandatory(2), addVal, ...etc) {
    // validation
    const from = isNumStr(originalFrom) ? parseInt(originalFrom, 10) : originalFrom
    const to = isNumStr(originalTo) ? parseInt(originalTo, 10) : originalTo
    if (!isInt(from, { includeZero: true })) {
      throw new TypeError(`string-slices-array-push/Slices/add(): [THROW_ID_02] "from" value, first input argument, must be a natural number or zero! Currently it's equal to: ${JSON.stringify(from, null, 4)}`)
    }
    if (!isInt(to, { includeZero: true })) {
      throw new TypeError(`string-slices-array-push/Slices/add(): [THROW_ID_03] "to" value, second input argument, must be a natural number! Currently it's equal to: ${JSON.stringify(to, null, 4)}`)
    }
    if (existy(addVal) && (typeof addVal !== 'string') && (addVal !== null)) {
      throw new TypeError(`string-slices-array-push/Slices/add(): [THROW_ID_04] "addVal" value, third input argument, must be a string (or null)! Currently it's equal to: ${JSON.stringify(addVal, null, 4)}`)
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
      // console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)
      if ((this.last()[2] !== null) && existy(addVal)) {
        let calculatedVal = (
          existy(this.last()[2]) &&
          this.last()[2].length > 0
        ) ? this.last()[2] + addVal : addVal
        if (this.opts.limitToBeAddedWhitespace) {
          calculatedVal = collapseLeadingWhitespace(calculatedVal)
        }
        this.last()[2] = calculatedVal
      }
    } else {
      if (!this.slices) {
        this.slices = []
      }
      this.slices.push(addVal !== undefined ? [
        from,
        to,
        this.opts.limitToBeAddedWhitespace ? collapseLeadingWhitespace(addVal) : addVal,
      ] : [from, to])
    }
  }

  // P U S H  ()  -  A L I A S   F O R   A D D ()
  // ==================
  push(originalFrom, originalTo, addVal, ...etc) {
    this.add(originalFrom, originalTo, addVal, ...etc)
  }

  // C U R R E N T () - kindof a getter
  // ==================
  current() {
    if (this.slices != null) { // != is intentional
      this.slices = mergeRanges(this.slices)
      if (this.opts.limitToBeAddedWhitespace) {
        return this.slices.map((val) => {
          if (
            existy(val[2])
          ) {
            return [val[0], val[1], collapseLeadingWhitespace(val[2])]
          }
          return val
        })
      }
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

export default Slices

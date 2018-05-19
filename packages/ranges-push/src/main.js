import isInt from "is-natural-number";
import isNumStr from "is-natural-number-string";
import ordinal from "ordinal-number-suffix";
import mergeRanges from "ranges-merge";
import checkTypes from "check-types-mini";
import collapseLeadingWhitespace from "string-collapse-leading-whitespace";

function existy(x) {
  return x != null;
}
const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function mandatory(i) {
  throw new Error(
    `string-slices-array-push/Slices/add(): [THROW_ID_01] Missing ${ordinal(
      i
    )} input parameter!`
  );
}
function prepNumStr(str) {
  return isNumStr(str, { includeZero: true }) ? parseInt(str, 10) : str;
}

// -----------------------------------------------------------------------------

class Slices {
  //

  // O P T I O N S
  // =============
  constructor(originalOpts) {
    // validation first:
    const defaults = {
      limitToBeAddedWhitespace: false
    };
    const opts = Object.assign({}, defaults, originalOpts);
    checkTypes(opts, defaults, {
      msg: "string-slices-array-push: [THROW_ID_02*]"
    });
    // so it's correct, let's get it in:
    this.opts = opts;
  }

  // A D D ()
  // ========
  add(originalFrom = mandatory(1), originalTo, addVal, ...etc) {
    if (etc.length > 0) {
      throw new TypeError(
        `string-slices-array-push/Slices/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ${JSON.stringify(
          etc,
          null,
          4
        )}`
      );
    }
    if (
      originalFrom === null &&
      originalTo === undefined &&
      addVal === undefined
    ) {
      return; // do nothing about it
    }
    const from = isNumStr(originalFrom, { includeZero: true })
      ? parseInt(originalFrom, 10)
      : originalFrom;
    const to = isNumStr(originalTo, { includeZero: true })
      ? parseInt(originalTo, 10)
      : originalTo;

    // validation
    if (isArr(originalFrom) && !existy(originalTo)) {
      // This means output of slices array might be given.
      // But validate that first.
      let culpritId;
      let culpritVal;
      if (originalFrom.length > 0) {
        if (
          originalFrom.every((thing, index) => {
            if (isArr(thing)) {
              return true;
            }
            culpritId = index;
            culpritVal = thing;
            return false;
          })
        ) {
          // So it's array full of arrays.
          // Let's validate the contents of those arrays and process them right away.
          originalFrom.forEach((arr, idx) => {
            if (isInt(prepNumStr(arr[0]), { includeZero: true })) {
              // good, continue
              if (isInt(prepNumStr(arr[1]), { includeZero: true })) {
                // good, continue
                if (!existy(arr[2]) || isStr(arr[2])) {
                  // push it into slices range
                  this.add(...arr);
                } else {
                  throw new TypeError(
                    `string-slices-array-push/Slices/add(): [THROW_ID_04] The ${ordinal(
                      idx
                    )} ranges array's "to add" value is not string but ${typeof arr[2]}! It's equal to: ${
                      arr[2]
                    }.`
                  );
                }
              } else {
                throw new TypeError(
                  `string-slices-array-push/Slices/add(): [THROW_ID_05] The ${ordinal(
                    idx
                  )} ranges array's ending range index, an element at its first index, is not a natural number! It's equal to: ${
                    arr[1]
                  }.`
                );
              }
            } else {
              throw new TypeError(
                `string-slices-array-push/Slices/add(): [THROW_ID_06] The ${ordinal(
                  idx
                )} ranges array's starting range index, an element at its zero'th index, is not a natural number! It's equal to: ${
                  arr[0]
                }.`
              );
            }
          });
        } else {
          throw new TypeError(
            `string-slices-array-push/Slices/add(): [THROW_ID_07] first argument was given as array but it contains not only range arrays. For example, at index ${culpritId} we have ${typeof culpritVal}-type value:\n${JSON.stringify(
              culpritVal,
              null,
              4
            )}.`
          );
        }
      }
    } else if (
      isInt(from, { includeZero: true }) &&
      isInt(to, { includeZero: true })
    ) {
      // This means two indexes were given as arguments. Business as usual.
      if (existy(addVal) && !isStr(addVal)) {
        throw new TypeError(
          `string-slices-array-push/Slices/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof addVal}, equal to:\n${JSON.stringify(
            addVal,
            null,
            4
          )}`
        );
      }
      // Does the incoming "from" value match the existing last element's "to" value?
      if (this.slices !== undefined && from === this.last()[1]) {
        // The incoming range is an exact extension of the last range, like
        // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
        this.last()[1] = to;
        // console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)
        if (this.last()[2] !== null && existy(addVal)) {
          let calculatedVal =
            existy(this.last()[2]) && this.last()[2].length > 0
              ? this.last()[2] + addVal
              : addVal;
          if (this.opts.limitToBeAddedWhitespace) {
            calculatedVal = collapseLeadingWhitespace(calculatedVal);
          }
          this.last()[2] = calculatedVal;
        }
      } else {
        if (!this.slices) {
          this.slices = [];
        }
        this.slices.push(
          addVal !== undefined
            ? [
                from,
                to,
                this.opts.limitToBeAddedWhitespace
                  ? collapseLeadingWhitespace(addVal)
                  : addVal
              ]
            : [from, to]
        );
      }
    } else {
      // Error somewhere!
      // Let's find out where.

      // is it first arg?
      if (!isInt(from, { includeZero: true })) {
        throw new TypeError(
          `string-slices-array-push/Slices/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof from}" equal to: ${JSON.stringify(
            from,
            null,
            4
          )}`
        );
      } else {
        // then it's second...
        throw new TypeError(
          `string-slices-array-push/Slices/add(): [THROW_ID_10] "to" value, the second input argument, must be a natural number or zero! Currently it's of a type "${typeof to}" equal to: ${JSON.stringify(
            to,
            null,
            4
          )}`
        );
      }
    }
  }

  // P U S H  ()  -  A L I A S   F O R   A D D ()
  // ============================================
  push(originalFrom, originalTo, addVal, ...etc) {
    this.add(originalFrom, originalTo, addVal, ...etc);
  }

  // C U R R E N T () - kindof a getter
  // ==================================
  current() {
    if (this.slices != null) {
      // != is intentional
      this.slices = mergeRanges(this.slices);
      if (this.opts.limitToBeAddedWhitespace) {
        return this.slices.map(val => {
          if (existy(val[2])) {
            return [val[0], val[1], collapseLeadingWhitespace(val[2])];
          }
          return val;
        });
      }
      return this.slices;
    }
    return null;
  }

  // W I P E ()
  // ==========
  wipe() {
    this.slices = undefined;
  }

  // L A S T ()
  // ==========
  last() {
    if (this.slices !== undefined && Array.isArray(this.slices)) {
      return this.slices[this.slices.length - 1];
    }
    return null;
  }
}

export default Slices;

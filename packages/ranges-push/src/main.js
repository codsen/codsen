import isInt from "is-natural-number";
import isNumStr from "is-natural-number-string";
import ordinal from "ordinal-number-suffix";
import mergeRanges from "ranges-merge";
import collapseLeadingWhitespace from "string-collapse-leading-whitespace";
import clone from "lodash.clonedeep";

function existy(x) {
  return x != null;
}
const isArr = Array.isArray;
const isNum = Number.isInteger;
function isStr(something) {
  return typeof something === "string";
}
function mandatory(i) {
  throw new Error(
    `ranges-push/Ranges/add(): [THROW_ID_01] Missing ${ordinal(
      i
    )} input parameter!`
  );
}
function prepNumStr(str) {
  return isNumStr(str, { includeZero: true }) ? parseInt(str, 10) : str;
}

// -----------------------------------------------------------------------------

class Ranges {
  //

  // O P T I O N S
  // =============
  constructor(originalOpts) {
    // validation first:
    const defaults = {
      limitToBeAddedWhitespace: false,
      limitLinebreaksCount: 1,
      mergeType: 1
    };
    const opts = Object.assign({}, defaults, originalOpts);
    if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
      if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
        opts.mergeType = 1;
      } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
        opts.mergeType = 2;
      } else {
        throw new Error(
          `ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(
            opts.mergeType,
            null,
            4
          )}`
        );
      }
    }
    // so it's correct, let's get it in:
    console.log(
      `059 ranges-push: USING opts = ${JSON.stringify(opts, null, 4)}`
    );
    this.opts = opts;
  }

  // A D D ()
  // ========
  add(originalFrom = mandatory(1), originalTo, addVal, ...etc) {
    console.log(`\n\n\n${`\u001b[${32}m${`=`.repeat(80)}\u001b[${39}m`}`);
    console.log(`068 ${`\u001b[${35}m${`ADD()`}\u001b[${39}m`} called`);
    if (etc.length > 0) {
      throw new TypeError(
        `ranges-push/Ranges/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ${JSON.stringify(
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
      console.log(`083 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} blank`);
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
      console.log(
        `096 ${`\u001b[${33}m${`CASE 1`}\u001b[${39}m`} - output of slices array might be given`
      );
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
                    `ranges-push/Ranges/add(): [THROW_ID_04] The ${ordinal(
                      idx
                    )} ranges array's "to add" value is not string but ${typeof arr[2]}! It's equal to: ${
                      arr[2]
                    }.`
                  );
                }
              } else {
                throw new TypeError(
                  `ranges-push/Ranges/add(): [THROW_ID_05] The ${ordinal(
                    idx
                  )} ranges array's ending range index, an element at its first index, is not a natural number! It's equal to: ${
                    arr[1]
                  }.`
                );
              }
            } else {
              throw new TypeError(
                `ranges-push/Ranges/add(): [THROW_ID_06] The ${ordinal(
                  idx
                )} ranges array's starting range index, an element at its zero'th index, is not a natural number! It's equal to: ${
                  arr[0]
                }.`
              );
            }
          });
        } else {
          throw new TypeError(
            `ranges-push/Ranges/add(): [THROW_ID_07] first argument was given as array but it contains not only range arrays. For example, at index ${culpritId} we have ${typeof culpritVal}-type value:\n${JSON.stringify(
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
      console.log(
        `166 ${`\u001b[${33}m${`CASE 2`}\u001b[${39}m`} - two indexes were given as arguments`
      );
      // This means two indexes were given as arguments. Business as usual.
      if (existy(addVal) && !isStr(addVal)) {
        throw new TypeError(
          `ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof addVal}, equal to:\n${JSON.stringify(
            addVal,
            null,
            4
          )}`
        );
      }
      // Does the incoming "from" value match the existing last element's "to" value?
      if (
        existy(this.slices) &&
        isArr(this.last()) &&
        from === this.last()[1]
      ) {
        console.log(
          `185 ${`\u001b[${32}m${`YES`}\u001b[${39}m`}, incoming "from" value match the existing last element's "to" value`
        );
        // The incoming range is an exact extension of the last range, like
        // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
        this.last()[1] = to;
        // console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)
        if (this.last()[2] !== null && existy(addVal)) {
          let calculatedVal =
            existy(this.last()[2]) &&
            this.last()[2].length > 0 &&
            (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1)
              ? this.last()[2] + addVal
              : addVal;
          if (this.opts.limitToBeAddedWhitespace) {
            calculatedVal = collapseLeadingWhitespace(
              calculatedVal,
              this.opts.limitLinebreaksCount
            );
          }
          if (!(isStr(calculatedVal) && !calculatedVal.length)) {
            // don't let the zero-length strings past
            this.last()[2] = calculatedVal;
          }
        }
      } else {
        console.log(
          `211 ${`\u001b[${31}m${`NO`}\u001b[${39}m`}, incoming "from" value does not match the existing last element's "to" value`
        );
        if (!this.slices) {
          this.slices = [];
        }
        const whatToPush =
          addVal !== undefined && !(isStr(addVal) && !addVal.length)
            ? [
                from,
                to,
                this.opts.limitToBeAddedWhitespace
                  ? collapseLeadingWhitespace(
                      addVal,
                      this.opts.limitLinebreaksCount
                    )
                  : addVal
              ]
            : [from, to];
        console.log(`229 PUSH whatToPush = "${whatToPush}"`);
        this.slices.push(whatToPush);
      }
    } else {
      console.log(
        `234 ${`\u001b[${33}m${`CASE 3`}\u001b[${39}m`} - error somewhere!`
      );
      // Error somewhere!
      // Let's find out where.

      // is it first arg?
      if (!isInt(from, { includeZero: true })) {
        throw new TypeError(
          `ranges-push/Ranges/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof from}" equal to: ${JSON.stringify(
            from,
            null,
            4
          )}`
        );
      } else {
        // then it's second...
        throw new TypeError(
          `ranges-push/Ranges/add(): [THROW_ID_10] "to" value, the second input argument, must be a natural number or zero! Currently it's of a type "${typeof to}" equal to: ${JSON.stringify(
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
      this.slices = mergeRanges(this.slices, {
        mergeType: this.opts.mergeType
      });
      if (this.opts.limitToBeAddedWhitespace) {
        return this.slices.map(val => {
          if (existy(val[2])) {
            return [
              val[0],
              val[1],
              collapseLeadingWhitespace(val[2], this.opts.limitLinebreaksCount)
            ];
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

  // R E P L A C E ()
  // ==========
  replace(givenRanges) {
    if (isArr(givenRanges) && givenRanges.length) {
      // Now, ranges can be array of arrays, correct format but also single
      // range, an array of two natural numbers might be given.
      // Let's put safety latch against such cases
      if (!(isArr(givenRanges[0]) && isNum(givenRanges[0][0]))) {
        throw new Error(
          `ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ${JSON.stringify(
            givenRanges[0],
            null,
            4
          )} should be an array and its first element should be an integer, a string index.`
        );
      } else {
        this.slices = clone(givenRanges);
      }
    } else {
      this.slices = undefined;
    }
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

export default Ranges;

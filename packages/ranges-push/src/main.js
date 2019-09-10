import isInt from "is-natural-number";
import isNumStr from "is-natural-number-string";
import mergeRanges from "ranges-merge";
import collapse from "string-collapse-white-space";
import clone from "lodash.clonedeep";
import trimSpacesOnly from "string-trim-spaces-only";

function existy(x) {
  return x != null;
}
const isArr = Array.isArray;
const isNum = Number.isInteger;
const nbsp = "\xA0";
function isStr(something) {
  return typeof something === "string";
}
function prepNumStr(str) {
  return isNumStr(str, { includeZero: true }) ? parseInt(str, 10) : str;
}
function canBeReplacedWithASpace(something) {
  return (
    isStr(something) &&
    something.length &&
    !something.trim().length &&
    !something.includes("\n") &&
    !something.includes("\r") &&
    !something.includes(nbsp)
  );
}
function specialTrim(something) {
  return trimSpacesOnly(something, {
    cr: false,
    lf: false,
    tab: true,
    space: true,
    nbsp: false
  }).res;
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
      `072 ranges-push: USING opts = ${JSON.stringify(opts, null, 4)}`
    );
    this.opts = opts;
  }

  // A D D ()
  // ========
  add(originalFrom, originalTo, addVal, ...etc) {
    console.log(`\n\n\n${`\u001b[${32}m${`=`.repeat(80)}\u001b[${39}m`}`);
    console.log(
      `082 ${`\u001b[${35}m${`ADD()`}\u001b[${39}m`} called; originalFrom = ${originalFrom}; originalTo = ${originalTo}; addVal = ${JSON.stringify(
        addVal,
        null,
        0
      )}`
    );
    if (etc.length > 0) {
      throw new TypeError(
        `ranges-push/Ranges/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ${JSON.stringify(
          etc,
          null,
          4
        )}`
      );
    }

    if (!existy(originalFrom) && !existy(originalTo)) {
      console.log(`099 nothing happens`);
      return;
    } else if (existy(originalFrom) && !existy(originalTo)) {
      if (isArr(originalFrom)) {
        if (originalFrom.length) {
          if (originalFrom.some(el => isArr(el))) {
            originalFrom.forEach(thing => {
              if (isArr(thing)) {
                // recursively feed this subarray, hopefully it's an array
                console.log(
                  `109 ██ RECURSIVELY CALLING ITSELF AGAIN WITH ${JSON.stringify(
                    thing,
                    null,
                    4
                  )}`
                );
                this.add(...thing);
                console.log("\n\n\n");
                console.log("117 ██ END OF RECURSION, BACK TO NORMAL FLOW");
                console.log("\n\n\n");
              }
              // just skip other cases
            });
            return;
          } else if (
            originalFrom.length > 1 &&
            isNum(prepNumStr(originalFrom[0])) &&
            isNum(prepNumStr(originalFrom[1]))
          ) {
            // recursively pass in those values
            console.log(
              `130 ██ RECURSIVELY CALLING ITSELF AGAIN WITH ${JSON.stringify(
                originalFrom,
                null,
                4
              )}`
            );
            this.add(...originalFrom);
            console.log("\n\n\n");
            console.log("138 ██ END OF RECURSION, BACK TO NORMAL FLOW");
            console.log("\n\n\n");
          }
        }
        // else,
        return;
      }
      throw new TypeError(
        `ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, "from" is set (${JSON.stringify(
          originalFrom,
          null,
          0
        )}) but second-one, "to" is not (${JSON.stringify(
          originalTo,
          null,
          0
        )})`
      );
    } else if (!existy(originalFrom) && existy(originalTo)) {
      throw new TypeError(
        `ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, "to" is set (${JSON.stringify(
          originalTo,
          null,
          0
        )}) but first-one, "from" is not (${JSON.stringify(
          originalFrom,
          null,
          0
        )})`
      );
    }
    const from = isNumStr(originalFrom, { includeZero: true })
      ? parseInt(originalFrom, 10)
      : originalFrom;
    const to = isNumStr(originalTo, { includeZero: true })
      ? parseInt(originalTo, 10)
      : originalTo;

    if (isNum(addVal)) {
      addVal = String(addVal);
    }

    // validation
    if (
      isInt(from, { includeZero: true }) &&
      isInt(to, { includeZero: true })
    ) {
      console.log(
        `186 ${`\u001b[${33}m${`CASE 2`}\u001b[${39}m`} - two indexes were given as arguments`
      );
      // This means two indexes were given as arguments. Business as usual.
      if (existy(addVal) && !isStr(addVal) && !isNum(addVal)) {
        throw new TypeError(
          `ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof addVal}, equal to:\n${JSON.stringify(
            addVal,
            null,
            4
          )}`
        );
      }
      console.log(
        `199 ${`\u001b[${33}m${`addVal`}\u001b[${39}m`} = ${JSON.stringify(
          addVal,
          null,
          4
        )} (${typeof addVal})`
      );
      // Does the incoming "from" value match the existing last element's "to" value?
      if (
        existy(this.slices) &&
        isArr(this.last()) &&
        from === this.last()[1]
      ) {
        console.log(
          `212 ${`\u001b[${32}m${`YES`}\u001b[${39}m`}, incoming "from" value match the existing last element's "to" value`
        );
        // The incoming range is an exact extension of the last range, like
        // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
        this.last()[1] = to;
        // console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)

        if (this.last()[2] === null || addVal === null) {
          console.log(`220 this.last()[2] = ${this.last()[2]}`);
          console.log(`221 addVal = ${JSON.stringify(addVal, null, 4)}`);
        }

        if (this.last()[2] !== null && existy(addVal)) {
          console.log(`225`);
          if (
            isStr(addVal) &&
            (addVal.includes("\n") || addVal.includes("\r"))
          ) {
            addVal = specialTrim(addVal);
            console.log(
              `232 special trim, SET addVal = ${JSON.stringify(
                addVal,
                null,
                0
              )}`
            );
          }

          let calculatedVal = addVal;
          if (
            existy(this.last()[2]) &&
            this.last()[2].length > 0 &&
            (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1)
          ) {
            calculatedVal = this.last()[2] + addVal;
            if (this.opts.limitToBeAddedWhitespace) {
              calculatedVal = collapse(calculatedVal, {
                trimStart: false,
                trimEnd: false,
                removeEmptyLines: true,
                limitConsecutiveEmptyLinesTo:
                  this.opts.limitLinebreaksCount - 1 < 0
                    ? 0
                    : this.opts.limitLinebreaksCount - 1
              });
            }
          }

          console.log(
            `261 ${`\u001b[${33}m${`calculatedVal`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
              calculatedVal,
              null,
              0
            )}`
          );
          console.log(
            `268 ${`\u001b[${36}m${`██ character-by-character list:`}\u001b[${39}m`} ${Array.from(
              calculatedVal
            ).reduce((acc, curr) => {
              return `${acc}\nchar "${curr}", charCodeAt: ${curr.charCodeAt(
                0
              )}`;
            }, "")}`
          );
          console.log(`${`\u001b[${36}m${`========`}\u001b[${39}m`}`);

          if (this.opts.limitToBeAddedWhitespace) {
            if (canBeReplacedWithASpace(calculatedVal)) {
              calculatedVal = " ";
              console.log(
                `282 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} calculatedVal = ${JSON.stringify(
                  calculatedVal,
                  null,
                  0
                )}`
              );
            } else {
              console.log(
                `290 ███████████████████████████████████████ call collapse with limit ${this
                  .opts.limitLinebreaksCount - 1}`
              );
              calculatedVal = collapse(calculatedVal, {
                trimStart: false,
                trimEnd: false,
                removeEmptyLines: true,
                limitConsecutiveEmptyLinesTo:
                  this.opts.limitLinebreaksCount - 1 < 0
                    ? 0
                    : this.opts.limitLinebreaksCount - 1
              });
              console.log(
                `303 collapse, ${`\u001b[${32}m${`SET`}\u001b[${39}m`} calculatedVal = ${JSON.stringify(
                  calculatedVal,
                  null,
                  0
                )}`
              );
              if (
                !calculatedVal.trim().length &&
                !calculatedVal.includes(nbsp)
              ) {
                calculatedVal = specialTrim(calculatedVal);
                console.log(
                  `312 special trim, ${`\u001b[${32}m${`SET`}\u001b[${39}m`} calculatedVal = ${JSON.stringify(
                    calculatedVal,
                    null,
                    0
                  )}`
                );
              }
            }
          }
          console.log(
            `322 ${`\u001b[${33}m${`calculatedVal`}\u001b[${39}m`} AFTER: ${JSON.stringify(
              calculatedVal,
              null,
              0
            )}`
          );
          console.log(
            `329 ${`\u001b[${36}m${`██ character-by-character list:`}\u001b[${39}m`} ${Array.from(
              calculatedVal
            ).reduce((acc, curr) => {
              return `${acc}\nchar "${curr}", charCodeAt: ${curr.charCodeAt(
                0
              )}`;
            }, "")}`
          );
          if (!(isStr(calculatedVal) && !calculatedVal.length)) {
            // don't let the zero-length strings past
            this.last()[2] = calculatedVal;
          }
        }
        console.log(`342`);
      } else {
        console.log(
          `345 ${`\u001b[${31}m${`NO`}\u001b[${39}m`}, incoming "from" value does not match the existing last element's "to" value`
        );
        if (!this.slices) {
          this.slices = [];
        }

        let insertValue = addVal;
        if (addVal != null && !(isStr(addVal) && !addVal.length)) {
          insertValue = this.opts.limitToBeAddedWhitespace
            ? collapse(addVal, {
                trimStart: false,
                trimEnd: false,
                removeEmptyLines: true,
                limitConsecutiveEmptyLinesTo:
                  this.opts.limitLinebreaksCount - 1 < 0
                    ? 0
                    : this.opts.limitLinebreaksCount - 1
              })
            : addVal;
        }

        if (this.opts.limitToBeAddedWhitespace) {
          if (canBeReplacedWithASpace(insertValue)) {
            insertValue = " ";
            console.log(
              `370 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} insertValue value to a single space`
            );
          } else if (
            isStr(insertValue) &&
            (insertValue.includes("\n") || insertValue.includes("\r"))
          ) {
            insertValue = specialTrim(insertValue);
            console.log(
              `378 special trim, ${`\u001b[${32}m${`SET`}\u001b[${39}m`} insertValue value to a single space`
            );
          }
        }

        const whatToPush =
          (isStr(insertValue) && insertValue.length) || insertValue === null
            ? [from, to, insertValue]
            : [from, to];
        console.log(
          `388 PUSH whatToPush = ${JSON.stringify(whatToPush, null, 0)}`
        );
        this.slices.push(whatToPush);
        console.log(
          `392 this.slices = ${JSON.stringify(this.slices, null, 4)};`
        );
      }
    } else {
      console.log(
        `397 ${`\u001b[${33}m${`CASE 3`}\u001b[${39}m`} - error somewhere!`
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
    console.log(`422`);
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
              collapse(val[2], {
                trimStart: false,
                trimEnd: false,
                removeEmptyLines: true,
                limitConsecutiveEmptyLinesTo:
                  this.opts.limitLinebreaksCount - 1 < 0
                    ? 0
                    : this.opts.limitLinebreaksCount - 1
              })
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

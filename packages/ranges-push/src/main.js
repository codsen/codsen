import collapseLeadingWhitespace from "string-collapse-leading-whitespace";
import mergeRanges from "ranges-merge";

function existy(x) {
  return x != null;
}
function isNum(something) {
  return Number.isInteger(something) && something >= 0;
}
function isStr(something) {
  return typeof something === "string";
}
function prepNumStr(str) {
  return /^\d*$/.test(str) ? parseInt(str, 10) : str;
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
      mergeType: 1,
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
      `049 ranges-push: USING opts = ${JSON.stringify(opts, null, 4)}`
    );
    this.opts = opts;
  }

  // A D D ()
  // ========
  add(originalFrom, originalTo, addVal, ...etc) {
    console.log(`\n\n\n${`\u001b[${32}m${`=`.repeat(80)}\u001b[${39}m`}`);
    console.log(
      `059 ${`\u001b[${35}m${`ADD()`}\u001b[${39}m`} called; originalFrom = ${originalFrom}; originalTo = ${originalTo}; addVal = ${addVal}`
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
      console.log(`072 nothing happens`);
      return;
    } else if (existy(originalFrom) && !existy(originalTo)) {
      if (Array.isArray(originalFrom)) {
        if (originalFrom.length) {
          if (originalFrom.some((el) => Array.isArray(el))) {
            originalFrom.forEach((thing) => {
              if (Array.isArray(thing)) {
                // recursively feed this subarray, hopefully it's an array
                console.log(
                  `082 ██ RECURSIVELY CALLING ITSELF AGAIN WITH ${JSON.stringify(
                    thing,
                    null,
                    4
                  )}`
                );
                this.add(...thing);
                console.log("\n\n\n");
                console.log("090 ██ END OF RECURSION, BACK TO NORMAL FLOW");
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
              `103 ██ RECURSIVELY CALLING ITSELF AGAIN WITH ${JSON.stringify(
                originalFrom,
                null,
                4
              )}`
            );
            this.add(...originalFrom);
            console.log("\n\n\n");
            console.log("111 ██ END OF RECURSION, BACK TO NORMAL FLOW");
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
    const from = /^\d*$/.test(originalFrom)
      ? parseInt(originalFrom, 10)
      : originalFrom;
    const to = /^\d*$/.test(originalTo) ? parseInt(originalTo, 10) : originalTo;

    if (isNum(addVal)) {
      addVal = String(addVal);
    }

    // validation
    if (isNum(from) && isNum(to)) {
      console.log(
        `154 ${`\u001b[${33}m${`CASE 2`}\u001b[${39}m`} - two indexes were given as arguments`
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
        `167 ${`\u001b[${33}m${`addVal`}\u001b[${39}m`} = ${JSON.stringify(
          addVal,
          null,
          4
        )} (${typeof addVal}, charCodeAt zero = ${
          isStr(addVal) ? addVal.charCodeAt(0) : "N/A"
        })`
      );
      // Does the incoming "from" value match the existing last element's "to" value?
      if (
        existy(this.slices) &&
        Array.isArray(this.last()) &&
        from === this.last()[1]
      ) {
        console.log(
          `182 ${`\u001b[${32}m${`YES`}\u001b[${39}m`}, incoming "from" value match the existing last element's "to" value`
        );
        // The incoming range is an exact extension of the last range, like
        // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
        this.last()[1] = to;
        // console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)

        if (this.last()[2] === null || addVal === null) {
          console.log(`190 this.last()[2] = ${this.last()[2]}`);
          console.log(`191 addVal = ${addVal}`);
        }

        if (this.last()[2] !== null && existy(addVal)) {
          console.log(`195`);
          let calculatedVal =
            existy(this.last()[2]) &&
            this.last()[2].length > 0 &&
            (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1)
              ? this.last()[2] + addVal
              : addVal;
          console.log(
            `203 ${`\u001b[${33}m${`calculatedVal`}\u001b[${39}m`} = ${JSON.stringify(
              calculatedVal,
              null,
              4
            )}`
          );
          if (this.opts.limitToBeAddedWhitespace) {
            calculatedVal = collapseLeadingWhitespace(
              calculatedVal,
              this.opts.limitLinebreaksCount
            );
          }
          console.log(
            `216 ${`\u001b[${33}m${`calculatedVal`}\u001b[${39}m`} = ${JSON.stringify(
              calculatedVal,
              null,
              4
            )}`
          );
          if (!(isStr(calculatedVal) && !calculatedVal.length)) {
            // don't let the zero-length strings past
            this.last()[2] = calculatedVal;
          }
        }
        console.log(`227`);
      } else {
        console.log(
          `230 ${`\u001b[${31}m${`NO`}\u001b[${39}m`}, incoming "from" value does not match the existing last element's "to" value`
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
                  : addVal,
              ]
            : [from, to];
        console.log(
          `249 PUSH whatToPush = ${JSON.stringify(whatToPush, null, 4)}`
        );
        this.slices.push(whatToPush);
        console.log(
          `253 this.slices = ${JSON.stringify(this.slices, null, 4)};`
        );
      }
    } else {
      console.log(
        `258 ${`\u001b[${33}m${`CASE 3`}\u001b[${39}m`} - error somewhere!`
      );
      // Error somewhere!
      // Let's find out where.

      // is it first arg?
      if (!(isNum(from) && from >= 0)) {
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
    console.log(`283`);
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
        mergeType: this.opts.mergeType,
      });
      if (this.opts.limitToBeAddedWhitespace) {
        return this.slices.map((val) => {
          if (existy(val[2])) {
            return [
              val[0],
              val[1],
              collapseLeadingWhitespace(val[2], this.opts.limitLinebreaksCount),
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
    if (Array.isArray(givenRanges) && givenRanges.length) {
      // Now, ranges can be array of arrays, correct format but also single
      // range, an array of two natural numbers might be given.
      // Let's put safety latch against such cases
      if (!(Array.isArray(givenRanges[0]) && isNum(givenRanges[0][0]))) {
        throw new Error(
          `ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ${JSON.stringify(
            givenRanges[0],
            null,
            4
          )} should be an array and its first element should be an integer, a string index.`
        );
      } else {
        this.slices = Array.from(givenRanges);
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

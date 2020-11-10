/**
 * ranges-push
 * Gather string index ranges
 * Version: 3.7.23
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-push/
 */

import collapseLeadingWhitespace from 'string-collapse-leading-whitespace';
import mergeRanges from 'ranges-merge';

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
class Ranges {
  constructor(originalOpts) {
    const defaults = {
      limitToBeAddedWhitespace: false,
      limitLinebreaksCount: 1,
      mergeType: 1,
    };
    const opts = { ...defaults, ...originalOpts };
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
    this.opts = opts;
  }
  add(originalFrom, originalTo, addVal, ...etc) {
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
      return;
    }
    if (existy(originalFrom) && !existy(originalTo)) {
      if (Array.isArray(originalFrom)) {
        if (originalFrom.length) {
          if (originalFrom.some((el) => Array.isArray(el))) {
            originalFrom.forEach((thing) => {
              if (Array.isArray(thing)) {
                this.add(...thing);
              }
            });
            return;
          }
          if (
            originalFrom.length > 1 &&
            isNum(prepNumStr(originalFrom[0])) &&
            isNum(prepNumStr(originalFrom[1]))
          ) {
            this.add(...originalFrom);
          }
        }
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
    if (isNum(from) && isNum(to)) {
      if (existy(addVal) && !isStr(addVal) && !isNum(addVal)) {
        throw new TypeError(
          `ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof addVal}, equal to:\n${JSON.stringify(
            addVal,
            null,
            4
          )}`
        );
      }
      if (
        existy(this.ranges) &&
        Array.isArray(this.last()) &&
        from === this.last()[1]
      ) {
        this.last()[1] = to;
        if (this.last()[2] === null || addVal === null) ;
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
            this.last()[2] = calculatedVal;
          }
        }
      } else {
        if (!this.ranges) {
          this.ranges = [];
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
        this.ranges.push(whatToPush);
      }
    } else {
      if (!(isNum(from) && from >= 0)) {
        throw new TypeError(
          `ranges-push/Ranges/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof from}" equal to: ${JSON.stringify(
            from,
            null,
            4
          )}`
        );
      } else {
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
  push(originalFrom, originalTo, addVal, ...etc) {
    this.add(originalFrom, originalTo, addVal, ...etc);
  }
  current() {
    if (this.ranges != null) {
      this.ranges = mergeRanges(this.ranges, {
        mergeType: this.opts.mergeType,
      });
      if (this.ranges && this.opts.limitToBeAddedWhitespace) {
        return this.ranges.map((val) => {
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
      return this.ranges;
    }
    return null;
  }
  wipe() {
    this.ranges = undefined;
  }
  replace(givenRanges) {
    if (Array.isArray(givenRanges) && givenRanges.length) {
      if (!(Array.isArray(givenRanges[0]) && isNum(givenRanges[0][0]))) {
        throw new Error(
          `ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ${JSON.stringify(
            givenRanges[0],
            null,
            4
          )} should be an array and its first element should be an integer, a string index.`
        );
      } else {
        this.ranges = Array.from(givenRanges);
      }
    } else {
      this.ranges = undefined;
    }
  }
  last() {
    if (this.ranges !== undefined && Array.isArray(this.ranges)) {
      return this.ranges[this.ranges.length - 1];
    }
    return null;
  }
}

export default Ranges;

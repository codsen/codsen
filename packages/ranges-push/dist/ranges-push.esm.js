/**
 * ranges-push
 * Manage the array of ranges referencing the index ranges within the string
 * Version: 3.6.15
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push
 */

import collapseLeadingWhitespace from 'string-collapse-leading-whitespace';
import isNumStr from 'is-natural-number-string';
import mergeRanges from 'ranges-merge';
import clone from 'lodash.clonedeep';

function existy(x) {
  return x != null;
}
const isArr = Array.isArray;
const isNum = Number.isInteger;
function isStr(something) {
  return typeof something === "string";
}
function prepNumStr(str) {
  return isNumStr(str, { includeZero: true }) ? parseInt(str, 10) : str;
}
class Ranges {
  constructor(originalOpts) {
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
    } else if (existy(originalFrom) && !existy(originalTo)) {
      if (isArr(originalFrom)) {
        if (originalFrom.length) {
          if (originalFrom.some(el => isArr(el))) {
            originalFrom.forEach(thing => {
              if (isArr(thing)) {
                this.add(...thing);
              }
            });
            return;
          } else if (
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
    const from = isNumStr(originalFrom, { includeZero: true })
      ? parseInt(originalFrom, 10)
      : originalFrom;
    const to = isNumStr(originalTo, { includeZero: true })
      ? parseInt(originalTo, 10)
      : originalTo;
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
        existy(this.slices) &&
        isArr(this.last()) &&
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
        this.slices.push(whatToPush);
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
    if (this.slices != null) {
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
  wipe() {
    this.slices = undefined;
  }
  replace(givenRanges) {
    if (isArr(givenRanges) && givenRanges.length) {
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
  last() {
    if (this.slices !== undefined && Array.isArray(this.slices)) {
      return this.slices[this.slices.length - 1];
    }
    return null;
  }
}

export default Ranges;

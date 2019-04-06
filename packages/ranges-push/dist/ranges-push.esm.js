/**
 * ranges-push
 * Manage the array of slices referencing the index ranges within the string
 * Version: 3.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push
 */

import isInt from 'is-natural-number';
import isNumStr from 'is-natural-number-string';
import ordinal from 'ordinal-number-suffix';
import mergeRanges from 'ranges-merge';
import checkTypes from 'check-types-mini';
import collapseLeadingWhitespace from 'string-collapse-leading-whitespace';

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
class Slices {
  constructor(originalOpts) {
    const defaults = {
      limitToBeAddedWhitespace: false,
      limitLinebreaksCount: 1
    };
    const opts = Object.assign({}, defaults, originalOpts);
    checkTypes(opts, defaults, {
      msg: "string-slices-array-push: [THROW_ID_02*]"
    });
    this.opts = opts;
  }
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
      return;
    }
    const from = isNumStr(originalFrom, { includeZero: true })
      ? parseInt(originalFrom, 10)
      : originalFrom;
    const to = isNumStr(originalTo, { includeZero: true })
      ? parseInt(originalTo, 10)
      : originalTo;
    if (isArr(originalFrom) && !existy(originalTo)) {
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
          originalFrom.forEach((arr, idx) => {
            if (isInt(prepNumStr(arr[0]), { includeZero: true })) {
              if (isInt(prepNumStr(arr[1]), { includeZero: true })) {
                if (!existy(arr[2]) || isStr(arr[2])) {
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
      if (existy(addVal) && !isStr(addVal)) {
        throw new TypeError(
          `string-slices-array-push/Slices/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof addVal}, equal to:\n${JSON.stringify(
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
        if (this.last()[2] !== null && existy(addVal)) {
          let calculatedVal =
            existy(this.last()[2]) && this.last()[2].length > 0
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
        this.slices.push(
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
            : [from, to]
        );
      }
    } else {
      if (!isInt(from, { includeZero: true })) {
        throw new TypeError(
          `string-slices-array-push/Slices/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof from}" equal to: ${JSON.stringify(
            from,
            null,
            4
          )}`
        );
      } else {
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
  push(originalFrom, originalTo, addVal, ...etc) {
    this.add(originalFrom, originalTo, addVal, ...etc);
  }
  current() {
    if (this.slices != null) {
      this.slices = mergeRanges(this.slices);
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
  last() {
    if (this.slices !== undefined && Array.isArray(this.slices)) {
      return this.slices[this.slices.length - 1];
    }
    return null;
  }
}

export default Slices;

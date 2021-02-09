/**
 * ranges-push
 * Gather string index ranges
 * Version: 5.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-push/
 */

import { collWhitespace } from 'string-collapse-leading-whitespace';
import { rMerge } from 'ranges-merge';

var version = "5.0.3";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
const version$1 = version;

function existy(x) {
  return x != null;
}

function isNum(something) {
  return Number.isInteger(something) && something >= 0;
}

function isStr(something) {
  return typeof something === "string";
}

const defaults = {
  limitToBeAddedWhitespace: false,
  limitLinebreaksCount: 1,
  mergeType: 1
}; // -----------------------------------------------------------------------------

class Ranges {
  //
  // O P T I O N S
  // =============
  constructor(originalOpts) {
    const opts = { ...defaults,
      ...originalOpts
    };

    if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
      if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
        opts.mergeType = 1;
      } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
        opts.mergeType = 2;
      } else {
        throw new Error(`ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(opts.mergeType, null, 4)}`);
      }
    } // so it's correct, let's get it in:
    this.opts = opts;
    this.ranges = [];
  }

  add(originalFrom, originalTo, addVal) {

    if (originalFrom == null && originalTo == null) {
      // absent ranges are marked as null - instead of array of arrays we can receive a null
      return;
    }

    if (existy(originalFrom) && !existy(originalTo)) {
      if (Array.isArray(originalFrom)) {
        if (originalFrom.length) {
          if (originalFrom.some(el => Array.isArray(el))) {
            originalFrom.forEach(thing => {
              if (Array.isArray(thing)) {
                // recursively feed this subarray, hopefully it's an array
                this.add(...thing);
              } // just skip other cases

            });
            return;
          }

          if (originalFrom.length && isNum(+originalFrom[0]) && isNum(+originalFrom[1])) {
            // recursively pass in those values
            this.add(...originalFrom);
          }
        } // else,


        return;
      }

      throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, "from" is set (${JSON.stringify(originalFrom, null, 0)}) but second-one, "to" is not (${JSON.stringify(originalTo, null, 0)})`);
    } else if (!existy(originalFrom) && existy(originalTo)) {
      throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, "to" is set (${JSON.stringify(originalTo, null, 0)}) but first-one, "from" is not (${JSON.stringify(originalFrom, null, 0)})`);
    }

    const from = +originalFrom;
    const to = +originalTo;

    if (isNum(addVal)) {
      // eslint-disable-next-line no-param-reassign
      addVal = String(addVal);
    } // validation


    if (isNum(from) && isNum(to)) { // This means two indexes were given as arguments. Business as usual.

      if (existy(addVal) && !isStr(addVal) && !isNum(addVal)) {
        throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof addVal}, equal to:\n${JSON.stringify(addVal, null, 4)}`);
      } // Does the incoming "from" value match the existing last element's "to" value?

      if (existy(this.ranges) && Array.isArray(this.last()) && from === this.last()[1]) { // The incoming range is an exact extension of the last range, like
        // [1, 100] gets added [100, 200] => you can merge into: [1, 200].

        this.last()[1] = to; // console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)

        if (this.last()[2] === null || addVal === null) ;

        if (this.last()[2] !== null && existy(addVal)) {
          let calculatedVal = this.last()[2] && this.last()[2].length > 0 && (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1) ? this.last()[2] + addVal : addVal;

          if (this.opts.limitToBeAddedWhitespace) {
            calculatedVal = collWhitespace(calculatedVal, this.opts.limitLinebreaksCount);
          }

          if (!(isStr(calculatedVal) && !calculatedVal.length)) {
            // don't let the zero-length strings past
            this.last()[2] = calculatedVal;
          }
        }
      } else {

        if (!this.ranges) {
          this.ranges = [];
        }

        const whatToPush = addVal !== undefined && !(isStr(addVal) && !addVal.length) ? [from, to, addVal && this.opts.limitToBeAddedWhitespace ? collWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to];
        this.ranges.push(whatToPush);
      }
    } else { // Error somewhere!
      // Let's find out where.
      // is it first arg?

      if (!(isNum(from) && from >= 0)) {
        throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof from}" equal to: ${JSON.stringify(from, null, 4)}`);
      } else {
        // then it's second...
        throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_10] "to" value, the second input argument, must be a natural number or zero! Currently it's of a type "${typeof to}" equal to: ${JSON.stringify(to, null, 4)}`);
      }
    }
  }

  push(originalFrom, originalTo, addVal) {
    this.add(originalFrom, originalTo, addVal);
  } // C U R R E N T () - kindof a getter
  // ==================================


  current() {

    if (Array.isArray(this.ranges) && this.ranges.length) {
      // beware, merging can return null
      this.ranges = rMerge(this.ranges, {
        mergeType: this.opts.mergeType
      });

      if (this.ranges && this.opts.limitToBeAddedWhitespace) {
        return this.ranges.map(val => {
          if (existy(val[2])) {
            return [val[0], val[1], collWhitespace(val[2], this.opts.limitLinebreaksCount)];
          }

          return val;
        });
      }
      return this.ranges;
    }

    return null;
  } // W I P E ()
  // ==========


  wipe() {
    this.ranges = [];
  } // R E P L A C E ()
  // ==========


  replace(givenRanges) {
    if (Array.isArray(givenRanges) && givenRanges.length) {
      // Now, ranges can be array of arrays, correct format but also single
      // range, an array of two natural numbers might be given.
      // Let's put safety latch against such cases
      if (!(Array.isArray(givenRanges[0]) && isNum(givenRanges[0][0]))) {
        throw new Error(`ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ${JSON.stringify(givenRanges[0], null, 4)} should be an array and its first element should be an integer, a string index.`);
      } else {
        this.ranges = Array.from(givenRanges);
      }
    } else {
      this.ranges = [];
    }
  } // L A S T ()
  // ==========


  last() {
    if (Array.isArray(this.ranges) && this.ranges.length) {
      return this.ranges[this.ranges.length - 1];
    }

    return null;
  }

}

export { Ranges, defaults, version$1 as version };

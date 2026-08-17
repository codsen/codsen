/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import {
  existy,
  formatDiagnosticValue,
  isInt,
  isNum,
  isPlainObject as isObj,
  isStr,
} from "codsen-utils";
import { collWhitespace } from "string-collapse-leading-whitespace";
import type { Range as RangeType } from "../../../ops/typedefs/common";
import { version as v } from "../package.json";
import { rMerge } from "./rMerge";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  limitToBeAddedWhitespace: boolean;
  limitLinebreaksCount: number;
  mergeType: 1 | 2 | "1" | "2" | undefined;
}

const defaults: Opts = {
  limitToBeAddedWhitespace: false,
  limitLinebreaksCount: 1,
  mergeType: 1,
};

// rMerge() throws away the ranges which cover nothing and insert nothing, so
// anything mimicking its output has to ignore them too
function isFutile(range: RangeType): boolean {
  return range[2] === undefined && range[0] === range[1];
}

// firstCovers() can read only the leading cluster while the ranges sit in
// non-descending "from" order - which is how add() receives them in practice
function isAscending(ranges: RangeType[]): boolean {
  let previousFrom = -1;
  for (let i = 0, len = ranges.length; i < len; i++) {
    const range = ranges[i];
    if (!Array.isArray(range)) {
      continue;
    }
    if (range[0] < previousFrom) {
      return false;
    }
    previousFrom = range[0];
  }
  return true;
}

// -----------------------------------------------------------------------------

class Ranges {
  //

  // O P T I O N S
  // =============
  constructor(originalOpts?: Partial<Opts>) {
    if (originalOpts != null && !isObj(originalOpts)) {
      throw new TypeError(
        `ranges-push/Ranges/constructor(): [THROW_ID_01] The options argument must be a plain object. It was given as ${formatDiagnosticValue(originalOpts, 4)} (type ${typeof originalOpts}).`,
      );
    }
    const opts: Opts = { ...defaults, ...originalOpts };
    if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
      if (isStr(opts.mergeType) && (opts.mergeType as string).trim() === "1") {
        opts.mergeType = 1;
      } else if (
        isStr(opts.mergeType) &&
        (opts.mergeType as string).trim() === "2"
      ) {
        opts.mergeType = 2;
      } else {
        throw new Error(
          `ranges-push/Ranges/constructor(): [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${formatDiagnosticValue(opts.mergeType, 4)}`,
        );
      }
    }
    // so it's correct, let's get it in:
    DEV &&
      console.log(`ranges-push: USING opts = ${JSON.stringify(opts, null, 4)}`);
    this.opts = opts;
    this.ranges = [];
    this.sorted = true;
  }

  ranges: RangeType[];
  opts: Opts;
  // true while "ranges" is known to be in non-descending "from" order; it lets
  // firstCovers() answer from the leading cluster alone instead of walking and
  // re-walking the whole accumulated array
  private sorted: boolean;

  // A D D ()
  // ========

  add(
    originalFrom: number,
    originalTo?: number,
    addVal?: undefined | null | string,
  ): void;
  add(originalFrom: RangeType[] | RangeType | null): void;
  add(originalFrom?: any, originalTo?: any, addVal?: any): void {
    DEV &&
      console.log(
        `\n\n\n${`\u001b[${32}m${`${`=`.repeat(80)}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${35}m${`ADD()`}\u001b[${39}m`} called; originalFrom = ${originalFrom}; originalTo = ${originalTo}; addVal = ${addVal}`,
      );

    if (originalFrom == null && originalTo == null) {
      // absent ranges are marked as null - instead of array of arrays we can receive a null
      DEV && console.log(`nothing happens`);
      return;
    }
    if (existy(originalFrom) && !existy(originalTo)) {
      if (Array.isArray(originalFrom)) {
        if (originalFrom.length) {
          if (originalFrom.some((el) => Array.isArray(el))) {
            originalFrom.forEach((thing) => {
              if (Array.isArray(thing)) {
                // recursively feed this subarray, hopefully it's an array
                DEV &&
                  console.log(
                    `██ RECURSIVELY CALLING ITSELF AGAIN WITH ${JSON.stringify(
                      thing,
                      null,
                      4,
                    )}`,
                  );
                (this as any).add(...thing);
                DEV && console.log("104\n\n\n");
                DEV && console.log("██ END OF RECURSION, BACK TO NORMAL FLOW");
                DEV && console.log("107\n\n\n");
              }
              // just skip other cases
            });
            return;
          }
          if (
            originalFrom.length &&
            isInt(+originalFrom[0]) &&
            isInt(+originalFrom[1])
          ) {
            // recursively pass in those values
            DEV &&
              console.log(
                `██ RECURSIVELY CALLING ITSELF AGAIN WITH ${JSON.stringify(
                  originalFrom,
                  null,
                  4,
                )}`,
              );
            (this as any).add(...originalFrom);
            DEV && console.log("128\n\n\n");
            DEV && console.log("██ END OF RECURSION, BACK TO NORMAL FLOW");
            DEV && console.log("130\n\n\n");
          }
        }
        // else,
        return;
      }
      throw new TypeError(
        `ranges-push/Ranges/add(): [THROW_ID_03] the first input argument, "from" is set (${formatDiagnosticValue(originalFrom)}) but second-one, "to" is not (${formatDiagnosticValue(originalTo)})`,
      );
    } else if (!existy(originalFrom) && existy(originalTo)) {
      throw new TypeError(
        `ranges-push/Ranges/add(): [THROW_ID_04] the second input argument, "to" is set (${formatDiagnosticValue(originalTo)}) but first-one, "from" is not (${formatDiagnosticValue(originalFrom)})`,
      );
    }
    const from = +originalFrom;
    const to = +originalTo;

    // validation
    if (isInt(from) && isInt(to)) {
      DEV &&
        console.log(
          `${`\u001b[${33}m${`CASE 2`}\u001b[${39}m`} - two indexes were given as arguments`,
        );
      // This means two indexes were given as arguments. Business as usual.
      if (existy(addVal) && !isStr(addVal) && !isNum(addVal)) {
        throw new TypeError(
          `ranges-push/Ranges/add(): [THROW_ID_05] The third argument, the value to add, was given not as string but ${typeof addVal}, equal to:\n${formatDiagnosticValue(addVal, 4)}`,
        );
      }
      DEV &&
        console.log(
          `${`\u001b[${33}m${`addVal`}\u001b[${39}m`} = ${JSON.stringify(
            addVal,
            null,
            4,
          )} (${typeof addVal}, charCodeAt zero = ${
            isStr(addVal) ? addVal.charCodeAt(0) : "N/A"
          })`,
        );
      // Does the incoming "from" value match the existing last element's "to" value?
      if (
        existy(this.ranges) &&
        Array.isArray(this.last()) &&
        from === (this.last() as RangeType)[1]
      ) {
        DEV &&
          console.log(
            `${`\u001b[${32}m${`YES`}\u001b[${39}m`}, incoming "from" value match the existing last element's "to" value`,
          );
        // The incoming range is an exact extension of the last range, like
        // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
        (this.last() as RangeType)[1] = to;
        // DEV && console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)

        if ((this.last() as RangeType)[2] === null || addVal === null) {
          DEV &&
            console.log(`this.last()[2] = ${(this.last() as RangeType)[2]}`);
          DEV && console.log(`addVal = ${addVal}`);
        }

        if ((this.last() as RangeType)[2] !== null && existy(addVal)) {
          DEV && console.log();
          let calculatedVal =
            (this.last() as RangeType)[2] &&
            ((this.last() as RangeType)[2] as string).length &&
            (!this.opts?.mergeType || this.opts.mergeType === 1)
              ? `${(this.last() as RangeType)[2]}${addVal}`
              : addVal;
          DEV &&
            console.log(
              `${`\u001b[${33}m${`calculatedVal`}\u001b[${39}m`} = ${JSON.stringify(
                calculatedVal,
                null,
                4,
              )} (type ${typeof calculatedVal})`,
            );
          if (this.opts.limitToBeAddedWhitespace) {
            calculatedVal = collWhitespace(
              calculatedVal as string,
              this.opts.limitLinebreaksCount,
            );
          }
          DEV &&
            console.log(
              `${`\u001b[${33}m${`calculatedVal`}\u001b[${39}m`} = ${JSON.stringify(
                calculatedVal,
                null,
                4,
              )}`,
            );
          if (!(isStr(calculatedVal) && !calculatedVal.length)) {
            // don't let the zero-length strings past
            (this.last() as RangeType)[2] = calculatedVal;
          }
        }
        DEV && console.log();
      } else {
        DEV &&
          console.log(
            `${`\u001b[${31}m${`NO`}\u001b[${39}m`}, incoming "from" value does not match the existing last element's "to" value`,
          );

        if (!this.ranges) {
          this.ranges = [];
        }
        const previous = this.last();
        if (previous && from < previous[0]) {
          // this range jumps backwards, so the leading-cluster shortcut in
          // firstCovers() no longer holds
          this.sorted = false;
        }
        let whatToPush: RangeType =
          addVal !== undefined && !(isStr(addVal) && !addVal.length)
            ? [
                from,
                to,
                addVal && this.opts.limitToBeAddedWhitespace
                  ? collWhitespace(addVal, this.opts.limitLinebreaksCount)
                  : addVal,
              ]
            : [from, to];
        DEV &&
          console.log(
            `PUSH whatToPush = ${JSON.stringify(whatToPush, null, 4)}`,
          );
        this.ranges.push(whatToPush);
        DEV &&
          console.log(`this.ranges = ${JSON.stringify(this.ranges, null, 4)};`);
      }
    } else {
      DEV &&
        console.log(
          `${`\u001b[${33}m${`CASE 3`}\u001b[${39}m`} - error somewhere!`,
        );
      // Error somewhere!
      // Let's find out where.

      // is it first arg?
      if (!isInt(from)) {
        throw new TypeError(
          `ranges-push/Ranges/add(): [THROW_ID_06] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof originalFrom}" equal to: ${formatDiagnosticValue(originalFrom, 4)}`,
        );
      } else {
        // then it's second...
        throw new TypeError(
          `ranges-push/Ranges/add(): [THROW_ID_07] "to" value, the second input argument, must be a natural number or zero! Currently it's of a type "${typeof originalTo}" equal to: ${formatDiagnosticValue(originalTo, 4)}`,
        );
      }
    }
    DEV && console.log();
  }

  // P U S H  ()  -  A L I A S   F O R   A D D ()
  // ============================================
  push(
    originalFrom: number,
    originalTo?: number,
    addVal?: undefined | null | string,
  ): void;
  push(originalFrom: RangeType[] | RangeType | null): void;
  push(originalFrom?: any, originalTo?: any, addVal?: any): void {
    this.add(originalFrom, originalTo, addVal);
  }

  // C U R R E N T () - kindof a getter
  // ==================================
  current(): null | RangeType[] {
    DEV &&
      console.log(
        `ranges-push/current(): ${`\u001b[${33}m${`this.ranges`}\u001b[${39}m`} = ${JSON.stringify(
          this.ranges,
          null,
          4,
        )}`,
      );
    if (Array.isArray(this.ranges) && this.ranges.length) {
      // beware, merging can return null
      this.ranges = rMerge(this.ranges, {
        mergeType: this.opts.mergeType,
      }) as RangeType[];
      // rMerge() hands back a sorted result, so the shortcut is usable again
      this.sorted = true;

      if (this.ranges && this.opts.limitToBeAddedWhitespace) {
        return this.ranges.map((val) => {
          if (existy(val[2])) {
            return [
              val[0],
              val[1],
              collWhitespace(val[2] as string, this.opts.limitLinebreaksCount),
            ];
          }
          return val;
        });
      }
      DEV &&
        console.log(
          `ranges-push/current(): ${`\u001b[${33}m${`this.ranges`}\u001b[${39}m`} = ${JSON.stringify(
            this.ranges,
            null,
            4,
          )}`,
        );
      return this.ranges;
    }
    return null;
  }

  // F I R S T C O V E R S ()
  // ========================

  // Does the first range - the one current() would report at index zero - start
  // at zero and reach the given index? current() can answer that, but it
  // re-merges, re-sorts and re-collapses the whole accumulated set to do it,
  // which is far too much work for a predicate consulted once per iteration of
  // a caller's character loop. This reads the ranges where they lie instead:
  // it never merges, sorts, collapses whitespace or allocates.
  firstCovers(index: number): boolean {
    if (!isInt(index)) {
      throw new TypeError(
        `ranges-push/Ranges/firstCovers(): [THROW_ID_08] the input argument must be a natural number or zero! It was given as ${formatDiagnosticValue(index, 4)} (type ${typeof index})`,
      );
    }
    if (!Array.isArray(this.ranges) || !this.ranges.length) {
      return false;
    }

    // how far the cluster of ranges anchored at index zero reaches; null while
    // nothing starts at zero, because then there is nothing to anchor it
    let end: null | number = null;

    if (this.sorted) {
      // ascending ranges mean the first merged range is simply the leading
      // cluster, so walk it and stop at the first gap
      for (let i = 0, len = this.ranges.length; i < len; i++) {
        const range = this.ranges[i];
        if (!Array.isArray(range) || isFutile(range)) {
          continue;
        }
        if (end === null) {
          if (range[0] !== 0) {
            // the leftmost range which survives merging misses index zero
            return false;
          }
          end = range[1];
        } else if (range[0] > end) {
          // a gap - whatever sits further right is a separate merged range
          break;
        } else if (range[1] > end) {
          end = range[1];
        }
        if (end >= index) {
          return true;
        }
      }
      return end !== null && end >= index;
    }

    // ranges arrived out of order, so a range anywhere in the array can extend
    // the cluster and let another one join it - repeat until it settles
    let extended = true;
    while (extended) {
      extended = false;
      for (let i = 0, len = this.ranges.length; i < len; i++) {
        const range = this.ranges[i];
        if (!Array.isArray(range) || isFutile(range)) {
          continue;
        }
        if (range[0] < 0) {
          // merging would put a negative index first, not zero
          return false;
        }
        if (end === null ? range[0] === 0 : range[0] <= end && range[1] > end) {
          end = range[1];
          extended = true;
        }
      }
    }
    return end !== null && end >= index;
  }

  // W I P E ()
  // ==========
  wipe(): void {
    this.ranges = [];
    this.sorted = true;
  }

  // R E P L A C E ()
  // ==========
  replace(givenRanges: RangeType[]): void {
    if (Array.isArray(givenRanges) && givenRanges.length) {
      // Now, ranges can be array of arrays, correct format but also single
      // range, an array of two natural numbers might be given.
      // Let's put safety latch against such cases
      if (!(Array.isArray(givenRanges[0]) && isInt(givenRanges[0][0]))) {
        throw new Error(
          `ranges-push/Ranges/replace(): [THROW_ID_09] Single range was given but we expected array of arrays! The first element, ${formatDiagnosticValue(givenRanges[0], 4)} should be an array and its first element should be an integer, a string index.`,
        );
      } else {
        this.ranges = Array.from(givenRanges);
        this.sorted = isAscending(this.ranges);
      }
    } else {
      this.ranges = [];
      this.sorted = true;
    }
  }

  // L A S T ()
  // ==========
  last(): RangeType | null {
    if (Array.isArray(this.ranges) && this.ranges.length) {
      return this.ranges[this.ranges.length - 1];
    }
    return null;
  }
}

export { defaults, Ranges, type RangeType as Range, version };

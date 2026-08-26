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
import { mergeInsertValues, rMerge } from "./rMerge";

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

type AddValue = string | number | null | undefined;
type ValidatedRange = [from: number, to: number, addValue?: AddValue];

interface NormalizedRanges {
  error?: string;
  ranges: ValidatedRange[];
}

function normalizeRangeInputs(args: unknown[]): NormalizedRanges {
  if (args.length > 3) {
    return {
      error: `expected at most three arguments but received ${args.length}`,
      ranges: [],
    };
  }

  if (args.length <= 1 && Array.isArray(args[0])) {
    const supplied = args[0];
    if (!supplied.length) {
      return { ranges: [] };
    }
    if (supplied.some((value) => Array.isArray(value))) {
      if (!supplied.every((value) => Array.isArray(value))) {
        return {
          error: `a ranges batch must contain only range arrays; received ${formatDiagnosticValue(supplied, 4)}`,
          ranges: [],
        };
      }
      args = supplied;
    } else {
      args = [supplied];
    }
  } else {
    args = [args];
  }

  const ranges: ValidatedRange[] = [];
  for (const value of args) {
    if (!Array.isArray(value)) {
      return {
        error: `a ranges batch must contain only range arrays; received ${formatDiagnosticValue(value, 4)}`,
        ranges: [],
      };
    }
    if (value.length > 3) {
      return {
        error: `a range must contain at most three values; received ${formatDiagnosticValue(value, 4)}`,
        ranges: [],
      };
    }

    const [originalFrom, originalTo, addValue] = value;
    if (originalFrom == null && originalTo == null) {
      continue;
    }
    if (originalFrom != null && originalTo == null) {
      return {
        error: `the first index is set (${formatDiagnosticValue(originalFrom)}) but the second index is not (${formatDiagnosticValue(originalTo)})`,
        ranges: [],
      };
    }
    if (originalFrom == null && originalTo != null) {
      return {
        error: `the second index is set (${formatDiagnosticValue(originalTo)}) but the first index is not (${formatDiagnosticValue(originalFrom)})`,
        ranges: [],
      };
    }

    const from =
      typeof originalFrom === "string" && /^\d+$/.test(originalFrom)
        ? Number(originalFrom)
        : originalFrom;
    const to =
      typeof originalTo === "string" && /^\d+$/.test(originalTo)
        ? Number(originalTo)
        : originalTo;
    if (!isInt(from)) {
      return {
        error: `the first index must be a natural number, zero, or a digit-only numeric string; received ${formatDiagnosticValue(originalFrom, 4)} (type ${typeof originalFrom})`,
        ranges: [],
      };
    }
    if (!isInt(to)) {
      return {
        error: `the second index must be a natural number, zero, or a digit-only numeric string; received ${formatDiagnosticValue(originalTo, 4)} (type ${typeof originalTo})`,
        ranges: [],
      };
    }
    if (existy(addValue) && !isStr(addValue) && !isNum(addValue)) {
      return {
        error: `the third value must be a string, number, null, or undefined; received ${formatDiagnosticValue(addValue, 4)} (type ${typeof addValue})`,
        ranges: [],
      };
    }
    if (from > to) {
      return {
        error: `the first index (${from}) must not be greater than the second index (${to})`,
        ranges: [],
      };
    }

    ranges.push(
      addValue !== undefined && !(isStr(addValue) && !addValue.length)
        ? [from, to, addValue]
        : [from, to],
    );
  }
  return { ranges };
}

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

  private addValidated(
    from: number,
    to: number,
    addVal?: string | number | null,
  ): void {
    DEV &&
      console.log(
        `${`\u001b[${33}m${`CASE 2`}\u001b[${39}m`} - two indexes were given as arguments`,
      );
    const lastRange = this.last();
    if (
      existy(this.ranges) &&
      Array.isArray(lastRange) &&
      from === lastRange[1]
    ) {
      DEV &&
        console.log(
          `${`\u001b[${32}m${`YES`}\u001b[${39}m`}, incoming "from" value match the existing last element's "to" value`,
        );
      lastRange[1] = to;

      if (addVal !== undefined && !(isStr(addVal) && !addVal.length)) {
        DEV && console.log();
        let calculatedVal = mergeInsertValues(
          lastRange[2],
          addVal,
          this.opts.mergeType === 2 && lastRange[0] === from,
        );
        DEV &&
          console.log(
            `${`\u001b[${33}m${`calculatedVal`}\u001b[${39}m`} = ${JSON.stringify(
              calculatedVal,
              null,
              4,
            )} (type ${typeof calculatedVal})`,
          );
        if (
          this.opts.limitToBeAddedWhitespace &&
          typeof calculatedVal === "string"
        ) {
          calculatedVal = collWhitespace(
            calculatedVal,
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
          lastRange[2] = calculatedVal;
        }
      }
      DEV && console.log();
      return;
    }

    DEV &&
      console.log(
        `${`\u001b[${31}m${`NO`}\u001b[${39}m`}, incoming "from" value does not match the existing last element's "to" value`,
      );
    if (!this.ranges) {
      this.ranges = [];
    }
    if (lastRange && from < lastRange[0]) {
      this.sorted = false;
    }
    const whatToPush = (
      addVal !== undefined
        ? [
            from,
            to,
            typeof addVal === "string" && this.opts.limitToBeAddedWhitespace
              ? collWhitespace(addVal, this.opts.limitLinebreaksCount)
              : addVal,
          ]
        : [from, to]
    ) as RangeType;
    DEV &&
      console.log(`PUSH whatToPush = ${JSON.stringify(whatToPush, null, 4)}`);
    this.ranges.push(whatToPush);
    DEV && console.log(`this.ranges = ${JSON.stringify(this.ranges, null, 4)};`);
  }

  // A D D ()
  // ========

  add(
    originalFrom: number,
    originalTo?: number,
    addVal?: undefined | null | string,
  ): void;
  add(originalFrom: RangeType[] | RangeType | null): void;
  add(...args: any[]): void {
    DEV &&
      console.log(
        `\n\n\n${`\u001b[${32}m${`${`=`.repeat(80)}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${35}m${`ADD()`}\u001b[${39}m`} called; args = ${JSON.stringify(args, null, 4)}`,
      );

    const normalized = normalizeRangeInputs(args);
    if (normalized.error) {
      throw new TypeError(
        `ranges-push/Ranges/add(): [THROW_ID_03] ${normalized.error}.`,
      );
    }
    for (const [from, to, addValue] of normalized.ranges) {
      this.addValidated(from, to, addValue);
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
  push(...args: any[]): void {
    (this.add as (...values: any[]) => void)(...args);
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
        `ranges-push/Ranges/firstCovers(): [THROW_ID_04] the input argument must be a natural number or zero! It was given as ${formatDiagnosticValue(index, 4)} (type ${typeof index})`,
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
  replace(givenRanges: RangeType[] | null): void {
    if (Array.isArray(givenRanges) && givenRanges.length) {
      // Now, ranges can be array of arrays, correct format but also single
      // range, an array of two natural numbers might be given.
      // Let's put safety latch against such cases
      if (!(Array.isArray(givenRanges[0]) && isInt(givenRanges[0][0]))) {
        throw new Error(
          `ranges-push/Ranges/replace(): [THROW_ID_05] Single range was given but we expected array of arrays! The first element, ${formatDiagnosticValue(givenRanges[0], 4)} should be an array.`,
        );
      } else {
        const normalized = normalizeRangeInputs([givenRanges]);
        if (normalized.error) {
          throw new TypeError(
            `ranges-push/Ranges/replace(): [THROW_ID_06] ${normalized.error}.`,
          );
        }
        this.ranges = normalized.ranges as RangeType[];
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

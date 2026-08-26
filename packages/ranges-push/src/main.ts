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
import { version as v } from "../package.json";
import { mergeInsertValues, rMerge } from "./rMerge";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  limitToBeAddedWhitespace: boolean | undefined;
  limitLinebreaksCount: number | undefined;
  mergeType: 1 | 2 | "1" | "2" | undefined;
}

interface ResolvedOpts {
  limitToBeAddedWhitespace: boolean;
  limitLinebreaksCount: number;
  mergeType: 1 | 2;
}

const defaults: Readonly<ResolvedOpts> = Object.freeze({
  limitToBeAddedWhitespace: false,
  limitLinebreaksCount: 1,
  mergeType: 1,
});

type AddValue = string | number | null | undefined;
type IndexInput = number | string;
type Range<InsertValue extends AddValue = AddValue> =
  | [from: number, to: number]
  | [from: number, to: number, addValue: InsertValue];
type RangeInput<InsertValue extends AddValue = AddValue> =
  | [from: IndexInput, to: IndexInput]
  | [from: IndexInput, to: IndexInput, addValue: InsertValue];
type ValidatedRange = Range;

interface NormalizedRanges {
  error?: string;
  ranges: ValidatedRange[];
}

interface CurrentCache<InsertValue extends AddValue> {
  rangesSnapshot: unknown[] | null;
  result: Range<InsertValue>[] | null;
  resultSnapshot: unknown[] | null;
}

function normalizeIndexInput(value: unknown): number | null {
  if (isInt(value)) {
    return value;
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const normalized = Number(value);
    return isInt(normalized) ? normalized : null;
  }
  return null;
}

function rangeInputError(value: unknown): string | undefined {
  if (!Array.isArray(value)) {
    return `a ranges batch must contain only range arrays; received ${formatDiagnosticValue(value, 4)}`;
  }
  if (value.length > 3) {
    return `a range must contain at most three values; received ${formatDiagnosticValue(value, 4)}`;
  }

  const [originalFrom, originalTo, addValue] = value;
  if (originalFrom == null && originalTo == null) {
    return undefined;
  }
  if (originalFrom != null && originalTo == null) {
    return `the first index is set (${formatDiagnosticValue(originalFrom)}) but the second index is not (${formatDiagnosticValue(originalTo)})`;
  }
  if (originalFrom == null && originalTo != null) {
    return `the second index is set (${formatDiagnosticValue(originalTo)}) but the first index is not (${formatDiagnosticValue(originalFrom)})`;
  }

  const from = normalizeIndexInput(originalFrom);
  const to = normalizeIndexInput(originalTo);
  if (from === null) {
    return `the first index must be a natural number, zero, or a digit-only numeric string; received ${formatDiagnosticValue(originalFrom, 4)} (type ${typeof originalFrom})`;
  }
  if (to === null) {
    return `the second index must be a natural number, zero, or a digit-only numeric string; received ${formatDiagnosticValue(originalTo, 4)} (type ${typeof originalTo})`;
  }
  if (existy(addValue) && !isStr(addValue) && !isNum(addValue)) {
    return `the third value must be a string, number, null, or undefined; received ${formatDiagnosticValue(addValue, 4)} (type ${typeof addValue})`;
  }
  if (from > to) {
    return `the first index (${from}) must not be greater than the second index (${to})`;
  }
  return undefined;
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
    args = Array.isArray(supplied[0]) ? supplied : [supplied];
  } else {
    args = [args];
  }

  const ranges: ValidatedRange[] = [];
  for (const value of args) {
    const error = rangeInputError(value);
    if (error) {
      return { error, ranges: [] };
    }
    const [originalFrom, originalTo, addValue] = value as unknown[];
    if (originalFrom == null && originalTo == null) {
      continue;
    }
    const from = normalizeIndexInput(originalFrom) as number;
    const to = normalizeIndexInput(originalTo) as number;

    ranges.push(
      addValue !== undefined && !(isStr(addValue) && !addValue.length)
        ? [from, to, addValue as AddValue]
        : [from, to],
    );
  }
  return { ranges };
}

// rMerge() throws away the ranges which cover nothing and insert nothing, so
// anything mimicking its output has to ignore them too
function isFutile(range: Range): boolean {
  return range[2] === undefined && range[0] === range[1];
}

// firstCovers() can read only the leading cluster while the ranges sit in
// non-descending "from" order - which is how add() receives them in practice
function isAscending(ranges: Range[]): boolean {
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

class Ranges<InsertValue extends AddValue = AddValue> {
  //

  // O P T I O N S
  // =============
  constructor(originalOpts?: Partial<Opts>) {
    if (originalOpts != null && !isObj(originalOpts)) {
      throw new TypeError(
        `ranges-push/Ranges/constructor(): [THROW_ID_01] The options argument must be a plain object. It was given as ${formatDiagnosticValue(originalOpts, 4)} (type ${typeof originalOpts}).`,
      );
    }
    if (originalOpts === undefined) {
      this.opts = defaults;
      this.ranges = [];
      return;
    }
    const supplied = originalOpts;
    const limitToBeAddedWhitespace =
      supplied.limitToBeAddedWhitespace === undefined
        ? defaults.limitToBeAddedWhitespace
        : supplied.limitToBeAddedWhitespace;
    const limitLinebreaksCount =
      supplied.limitLinebreaksCount === undefined
        ? defaults.limitLinebreaksCount
        : supplied.limitLinebreaksCount;
    const suppliedMergeType =
      supplied.mergeType === undefined ? defaults.mergeType : supplied.mergeType;
    const mergeType =
      suppliedMergeType === "1"
        ? 1
        : suppliedMergeType === "2"
          ? 2
          : suppliedMergeType;
    let optionError: string | undefined;
    if (typeof limitToBeAddedWhitespace !== "boolean") {
      optionError = `opts.limitToBeAddedWhitespace must be a boolean; received ${formatDiagnosticValue(limitToBeAddedWhitespace, 4)} (type ${typeof limitToBeAddedWhitespace})`;
    } else if (!isInt(limitLinebreaksCount)) {
      optionError = `opts.limitLinebreaksCount must be a natural number or zero; received ${formatDiagnosticValue(limitLinebreaksCount, 4)} (type ${typeof limitLinebreaksCount})`;
    } else if (mergeType !== 1 && mergeType !== 2) {
      optionError = `opts.mergeType must be 1, 2, "1", or "2"; received ${formatDiagnosticValue(suppliedMergeType, 4)} (type ${typeof suppliedMergeType})`;
    }
    if (optionError) {
      throw new TypeError(
        `ranges-push/Ranges/constructor(): [THROW_ID_02] ${optionError}.`,
      );
    }
    const opts: Readonly<ResolvedOpts> = Object.freeze({
      limitToBeAddedWhitespace,
      limitLinebreaksCount,
      mergeType,
    });
    // so it's correct, let's get it in:
    DEV &&
      console.log(`ranges-push: USING opts = ${JSON.stringify(opts, null, 4)}`);
    this.opts = opts;
    this.ranges = [];
  }

  ranges: Range<InsertValue>[] | null;
  opts: Readonly<ResolvedOpts>;
  private currentCache: CurrentCache<InsertValue> | null = null;

  private rangeListsMatch(
    left: Range<InsertValue>[] | null,
    snapshot: unknown[] | null,
  ): boolean {
    if (!Array.isArray(left)) {
      return snapshot === null;
    }
    if (!Array.isArray(snapshot) || left.length !== snapshot[0]) {
      return false;
    }
    let cursor = 1;
    for (let i = 0, len = left.length; i < len; i++) {
      const range = left[i];
      if (!Array.isArray(range)) {
        if (snapshot[cursor++] !== -1 || range !== snapshot[cursor++]) {
          return false;
        }
        continue;
      }
      if (range.length !== snapshot[cursor++]) {
        return false;
      }
      for (let y = 0; y < range.length; y++) {
        if (range[y] !== snapshot[cursor++]) {
          return false;
        }
      }
    }
    return cursor === snapshot.length;
  }

  private snapshotRanges(ranges: Range<InsertValue>[] | null): unknown[] | null {
    if (!Array.isArray(ranges)) {
      return null;
    }
    const snapshot = new Array<unknown>(1 + ranges.length * 4);
    snapshot[0] = ranges.length;
    let cursor = 1;
    for (let i = 0, len = ranges.length; i < len; i++) {
      const range = ranges[i];
      if (Array.isArray(range)) {
        snapshot[cursor++] = range.length;
        for (let y = 0; y < range.length; y++) {
          snapshot[cursor++] = range[y];
        }
      } else {
        snapshot[cursor++] = -1;
        snapshot[cursor++] = range;
      }
    }
    snapshot.length = cursor;
    return snapshot;
  }

  private currentStateMatchesSnapshot(): boolean {
    const cache = this.currentCache;
    return (
      cache !== null &&
      this.rangeListsMatch(this.ranges, cache.rangesSnapshot) &&
      this.rangeListsMatch(cache.result, cache.resultSnapshot)
    );
  }

  private recordCurrentSnapshot(
    result: Range<InsertValue>[] | null,
  ): void {
    const rangesSnapshot = this.snapshotRanges(this.ranges);
    this.currentCache = {
      rangesSnapshot,
      result,
      resultSnapshot:
        result === this.ranges
          ? rangesSnapshot
          : this.snapshotRanges(result),
    };
  }

  private invalidateCurrentCache(): void {
    this.currentCache = null;
  }

  private addValidated(
    from: number,
    to: number,
    addVal?: InsertValue,
  ): void {
    this.invalidateCurrentCache();
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
    ) as Range<InsertValue>;
    DEV &&
      console.log(`PUSH whatToPush = ${JSON.stringify(whatToPush, null, 4)}`);
    this.ranges.push(whatToPush);
    DEV && console.log(`this.ranges = ${JSON.stringify(this.ranges, null, 4)};`);
  }

  // A D D ()
  // ========

  add(
    originalFrom: IndexInput,
    originalTo: IndexInput,
    addVal?: InsertValue,
  ): void;
  add(originalFrom?: null, originalTo?: null, addVal?: null): void;
  add(
    originalFrom:
      | RangeInput<InsertValue>[]
      | RangeInput<InsertValue>
      | null
      | undefined,
  ): void;
  add(originalFrom?: any, originalTo?: any, addValue?: any): void {
    DEV &&
      console.log(
        `\n\n\n${`\u001b[${32}m${`${`=`.repeat(80)}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${35}m${`ADD()`}\u001b[${39}m`} called; originalFrom = ${JSON.stringify(originalFrom)}; originalTo = ${JSON.stringify(originalTo)}; addValue = ${JSON.stringify(addValue)}`,
      );

    // biome-ignore lint/complexity/noArguments: avoid allocating a rest array on every scalar add
    const argumentCount = arguments.length;
    let validationError: string | undefined;
    if (argumentCount > 3) {
      validationError = `expected at most three arguments but received ${argumentCount}`;
    } else if (argumentCount === 1 && Array.isArray(originalFrom)) {
      const values = Array.isArray(originalFrom[0])
        ? originalFrom
        : [originalFrom];
      for (let i = 0, len = values.length; i < len; i++) {
        validationError = rangeInputError(values[i]);
        if (validationError) {
          break;
        }
      }
      if (!validationError) {
        for (let i = 0, len = values.length; i < len; i++) {
          const [batchFrom, batchTo, batchAddValue] = values[i];
          if (batchFrom == null && batchTo == null) {
            continue;
          }
          this.addValidated(
            normalizeIndexInput(batchFrom) as number,
            normalizeIndexInput(batchTo) as number,
            (isStr(batchAddValue) && !batchAddValue.length
              ? undefined
              : batchAddValue) as InsertValue,
          );
        }
      }
    } else if (originalFrom == null && originalTo == null) {
      return;
    } else if (originalFrom != null && originalTo == null) {
      validationError = `the first index is set (${formatDiagnosticValue(originalFrom)}) but the second index is not (${formatDiagnosticValue(originalTo)})`;
    } else if (originalFrom == null && originalTo != null) {
      validationError = `the second index is set (${formatDiagnosticValue(originalTo)}) but the first index is not (${formatDiagnosticValue(originalFrom)})`;
    } else {
      const from = normalizeIndexInput(originalFrom);
      const to = normalizeIndexInput(originalTo);
      if (from === null) {
        validationError = `the first index must be a natural number, zero, or a digit-only numeric string; received ${formatDiagnosticValue(originalFrom, 4)} (type ${typeof originalFrom})`;
      } else if (to === null) {
        validationError = `the second index must be a natural number, zero, or a digit-only numeric string; received ${formatDiagnosticValue(originalTo, 4)} (type ${typeof originalTo})`;
      } else if (
        existy(addValue) &&
        !isStr(addValue) &&
        !isNum(addValue)
      ) {
        validationError = `the third value must be a string, number, null, or undefined; received ${formatDiagnosticValue(addValue, 4)} (type ${typeof addValue})`;
      } else if (from > to) {
        validationError = `the first index (${from}) must not be greater than the second index (${to})`;
      } else {
        this.addValidated(
          from,
          to,
          (isStr(addValue) && !addValue.length
            ? undefined
            : addValue) as InsertValue,
        );
      }
    }
    if (validationError) {
      throw new TypeError(
        `ranges-push/Ranges/add(): [THROW_ID_03] ${validationError}.`,
      );
    }
    DEV && console.log();
  }

  // P U S H  ()  -  A L I A S   F O R   A D D ()
  // ============================================
  push(
    originalFrom: IndexInput,
    originalTo: IndexInput,
    addVal?: InsertValue,
  ): void;
  push(originalFrom?: null, originalTo?: null, addVal?: null): void;
  push(
    originalFrom:
      | RangeInput<InsertValue>[]
      | RangeInput<InsertValue>
      | null
      | undefined,
  ): void;
  push(_originalFrom?: any, _originalTo?: any, _addValue?: any): void {
    // biome-ignore lint/complexity/noArguments: preserve exact arity without a rest-array allocation
    (this.add as (...values: any[]) => void).apply(this, arguments as any);
  }

  // C U R R E N T () - kindof a getter
  // ==================================
  current(): null | Range<InsertValue>[] {
    DEV &&
      console.log(
        `ranges-push/current(): ${`\u001b[${33}m${`this.ranges`}\u001b[${39}m`} = ${JSON.stringify(
          this.ranges,
          null,
          4,
        )}`,
      );
    if (this.currentStateMatchesSnapshot()) {
      return this.currentCache?.result ?? null;
    }
    if (Array.isArray(this.ranges) && this.ranges.length) {
      // beware, merging can return null
      this.ranges = rMerge(
        this.ranges as any,
        this.opts.mergeType === 1 ? undefined : { mergeType: 2 },
      ) as Range<InsertValue>[] | null;
      let result = this.ranges;
      if (result && this.opts.limitToBeAddedWhitespace) {
        result = result.map((val): Range<InsertValue> => {
          if (typeof val[2] === "string") {
            return [
              val[0],
              val[1],
              collWhitespace(
                val[2],
                this.opts.limitLinebreaksCount,
              ) as InsertValue,
            ];
          }
          return val;
        }) as Range<InsertValue>[];
      }
      this.recordCurrentSnapshot(result);
      DEV &&
        console.log(
          `ranges-push/current(): ${`\u001b[${33}m${`this.ranges`}\u001b[${39}m`} = ${JSON.stringify(
            this.ranges,
            null,
            4,
          )}`,
        );
      return result;
    }
    this.recordCurrentSnapshot(null);
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

    // Public views can be mutated without notifying the class, so verify the
    // ordering instead of trusting the add()/replace() bookkeeping flag. The
    // common ordered path remains allocation-free; arbitrary order is copied
    // and sorted once, giving this method an O(n log n) worst-case bound.
    const ranges = isAscending(this.ranges)
      ? this.ranges
      : this.ranges
          .filter((range) => Array.isArray(range))
          .slice()
          .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    let end: null | number = null;
    for (let i = 0, len = ranges.length; i < len; i++) {
      const range = ranges[i];
      if (!Array.isArray(range) || isFutile(range)) {
        continue;
      }
      if (end === null) {
        if (range[0] !== 0) {
          return false;
        }
        end = range[1];
      } else if (range[0] > end) {
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

  // W I P E ()
  // ==========
  wipe(): void {
    this.ranges = [];
    this.invalidateCurrentCache();
  }

  // R E P L A C E ()
  // ==========
  replace(
    givenRanges: RangeInput<InsertValue>[] | null | undefined,
  ): void {
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
        this.ranges = normalized.ranges as Range<InsertValue>[];
        this.invalidateCurrentCache();
      }
    } else {
      this.ranges = [];
      this.invalidateCurrentCache();
    }
  }

  // L A S T ()
  // ==========
  last(): Range<InsertValue> | null {
    if (Array.isArray(this.ranges) && this.ranges.length) {
      return this.ranges[this.ranges.length - 1];
    }
    return null;
  }
}

export { defaults, Ranges, type Range, type RangeInput, version };

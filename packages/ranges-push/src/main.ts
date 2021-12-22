/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { collWhitespace } from "string-collapse-leading-whitespace";

// eslint-disable-next-line import/extensions
import { rMerge } from "./rMerge";
import { version as v } from "../package.json";
// eslint-disable-next-line import/extensions
import { Range } from "../../../ops/typedefs/common";

const version: string = v;

function existy(x: any): boolean {
  return x != null;
}
function isNum(something: any): boolean {
  return Number.isInteger(something) && something >= 0;
}
function isStr(something: any): boolean {
  return typeof something === "string";
}

interface Opts {
  limitToBeAddedWhitespace: boolean;
  limitLinebreaksCount: number;
  mergeType: 1 | 2 | "1" | "2" | undefined;
}

const defaults: Opts = {
  limitToBeAddedWhitespace: false,
  limitLinebreaksCount: 1,
  mergeType: 1,
};

// -----------------------------------------------------------------------------

class Ranges {
  //

  // O P T I O N S
  // =============
  constructor(originalOpts?: Partial<Opts>) {
    let opts: Opts = { ...defaults, ...originalOpts };
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
      `064 ranges-push: USING opts = ${JSON.stringify(opts, null, 4)}`
    );
    this.opts = opts;
    this.ranges = [];
  }

  ranges: Range[];
  opts: Opts;

  // A D D ()
  // ========

  add(
    originalFrom: number,
    originalTo?: number,
    addVal?: undefined | null | string
  ): void;
  add(originalFrom: Range[] | Range | null): void;
  add(originalFrom?: any, originalTo?: any, addVal?: any): void {
    console.log(`\n\n\n${`\u001b[${32}m${`=`.repeat(80)}\u001b[${39}m`}`);
    console.log(
      `085 ${`\u001b[${35}m${`ADD()`}\u001b[${39}m`} called; originalFrom = ${originalFrom}; originalTo = ${originalTo}; addVal = ${addVal}`
    );

    if (originalFrom == null && originalTo == null) {
      // absent ranges are marked as null - instead of array of arrays we can receive a null
      console.log(`090 nothing happens`);
      return;
    }
    if (existy(originalFrom) && !existy(originalTo)) {
      if (Array.isArray(originalFrom)) {
        if (originalFrom.length) {
          if (originalFrom.some((el) => Array.isArray(el))) {
            originalFrom.forEach((thing) => {
              if (Array.isArray(thing)) {
                // recursively feed this subarray, hopefully it's an array
                console.log(
                  `101 ██ RECURSIVELY CALLING ITSELF AGAIN WITH ${JSON.stringify(
                    thing,
                    null,
                    4
                  )}`
                );
                (this as any).add(...thing);
                console.log("\n\n\n");
                console.log("109 ██ END OF RECURSION, BACK TO NORMAL FLOW");
                console.log("\n\n\n");
              }
              // just skip other cases
            });
            return;
          }
          if (
            originalFrom.length &&
            isNum(+originalFrom[0]) &&
            isNum(+originalFrom[1])
          ) {
            // recursively pass in those values
            console.log(
              `123 ██ RECURSIVELY CALLING ITSELF AGAIN WITH ${JSON.stringify(
                originalFrom,
                null,
                4
              )}`
            );
            (this as any).add(...originalFrom);
            console.log("\n\n\n");
            console.log("131 ██ END OF RECURSION, BACK TO NORMAL FLOW");
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
    let from = +(originalFrom as number);
    let to = +originalTo;

    if (isNum(addVal)) {
      // eslint-disable-next-line no-param-reassign
      addVal = String(addVal);
    }

    // validation
    if (isNum(from) && isNum(to)) {
      console.log(
        `173 ${`\u001b[${33}m${`CASE 2`}\u001b[${39}m`} - two indexes were given as arguments`
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
        `186 ${`\u001b[${33}m${`addVal`}\u001b[${39}m`} = ${JSON.stringify(
          addVal,
          null,
          4
        )} (${typeof addVal}, charCodeAt zero = ${
          isStr(addVal) ? (addVal as string).charCodeAt(0) : "N/A"
        })`
      );
      // Does the incoming "from" value match the existing last element's "to" value?
      if (
        existy(this.ranges) &&
        Array.isArray(this.last()) &&
        from === (this.last() as Range)[1]
      ) {
        console.log(
          `201 ${`\u001b[${32}m${`YES`}\u001b[${39}m`}, incoming "from" value match the existing last element's "to" value`
        );
        // The incoming range is an exact extension of the last range, like
        // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
        (this.last() as Range)[1] = to;
        // console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)

        if ((this.last() as Range)[2] === null || addVal === null) {
          console.log(`209 this.last()[2] = ${(this.last() as Range)[2]}`);
          console.log(`210 addVal = ${addVal}`);
        }

        if ((this.last() as Range)[2] !== null && existy(addVal)) {
          console.log(`214`);
          let calculatedVal =
            (this.last() as Range)[2] &&
            ((this.last() as Range)[2] as string).length > 0 &&
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1)
              ? `${(this.last() as Range)[2]}${addVal}`
              : addVal;
          console.log(
            `223 ${`\u001b[${33}m${`calculatedVal`}\u001b[${39}m`} = ${JSON.stringify(
              calculatedVal,
              null,
              4
            )}`
          );
          if (this.opts.limitToBeAddedWhitespace) {
            calculatedVal = collWhitespace(
              calculatedVal as string,
              this.opts.limitLinebreaksCount
            );
          }
          console.log(
            `236 ${`\u001b[${33}m${`calculatedVal`}\u001b[${39}m`} = ${JSON.stringify(
              calculatedVal,
              null,
              4
            )}`
          );
          if (!(isStr(calculatedVal) && !(calculatedVal as string).length)) {
            // don't let the zero-length strings past
            (this.last() as Range)[2] = calculatedVal;
          }
        }
        console.log(`247`);
      } else {
        console.log(
          `250 ${`\u001b[${31}m${`NO`}\u001b[${39}m`}, incoming "from" value does not match the existing last element's "to" value`
        );
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!this.ranges) {
          this.ranges = [];
        }
        let whatToPush: Range =
          addVal !== undefined && !(isStr(addVal) && !(addVal as string).length)
            ? [
                from,
                to,
                addVal && this.opts.limitToBeAddedWhitespace
                  ? collWhitespace(addVal, this.opts.limitLinebreaksCount)
                  : addVal,
              ]
            : [from, to];
        console.log(
          `267 PUSH whatToPush = ${JSON.stringify(whatToPush, null, 4)}`
        );
        this.ranges.push(whatToPush);
        console.log(
          `271 this.ranges = ${JSON.stringify(this.ranges, null, 4)};`
        );
      }
    } else {
      console.log(
        `276 ${`\u001b[${33}m${`CASE 3`}\u001b[${39}m`} - error somewhere!`
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
    console.log(`301`);
  }

  // P U S H  ()  -  A L I A S   F O R   A D D ()
  // ============================================
  push(
    originalFrom: number,
    originalTo?: number,
    addVal?: undefined | null | string
  ): void;
  push(originalFrom: Range[] | Range | null): void;
  push(originalFrom?: any, originalTo?: any, addVal?: any): void {
    this.add(originalFrom, originalTo, addVal);
  }

  // C U R R E N T () - kindof a getter
  // ==================================
  current(): null | Range[] {
    console.log(
      `320 ranges-push/current(): ${`\u001b[${33}m${`this.ranges`}\u001b[${39}m`} = ${JSON.stringify(
        this.ranges,
        null,
        4
      )}`
    );
    if (Array.isArray(this.ranges) && this.ranges.length) {
      // beware, merging can return null
      this.ranges = rMerge(this.ranges, {
        mergeType: this.opts.mergeType,
      }) as Range[];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
      console.log(
        `345 ranges-push/current(): ${`\u001b[${33}m${`this.ranges`}\u001b[${39}m`} = ${JSON.stringify(
          this.ranges,
          null,
          4
        )}`
      );
      return this.ranges;
    }
    return null;
  }

  // W I P E ()
  // ==========
  wipe(): void {
    this.ranges = [];
  }

  // R E P L A C E ()
  // ==========
  replace(givenRanges: Range[]): void {
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
        this.ranges = Array.from(givenRanges);
      }
    } else {
      this.ranges = [];
    }
  }

  // L A S T ()
  // ==========
  last(): Range | null {
    if (Array.isArray(this.ranges) && this.ranges.length) {
      return this.ranges[this.ranges.length - 1];
    }
    return null;
  }
}

export { Ranges, defaults, version, Range };

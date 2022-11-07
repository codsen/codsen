import stringifySafe from "json-stringify-safe";
import { deleteKey } from "object-delete-key";

// declare let DEV: boolean;

interface Obj {
  [key: string]: any;
}

export function prep(str: string, originalOpts?: Obj): Obj {
  // DEV &&
  //   console.log(
  //     `013 prep(): ${`\u001b[${32}m${`RECEIVED`}\u001b[${39}m`} >>>${str}<<<`
  //   );

  if (typeof str !== "string" || !str.length) {
    return {};
  }

  let defaults = {
    offset: 0,
  };
  let opts = { ...defaults, ...originalOpts };
  // DEV &&
  //   console.log(
  //     `026 prep(): final ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //       opts,
  //       null,
  //       4
  //     )}`
  //   );

  // So it's a non-empty string. Traverse!

  let digitsChunkStartsAt = null;
  let lastDigitAt: number | null = null;

  // DEV &&
  //   console.log(
  //     `040 prep(): ${`\u001b[${36}m${`traverse starts`}\u001b[${39}m`}`
  //   );
  for (let i = 0, len = str.length; i <= len; i++) {
    // DEV &&
    //   console.log(
    //     `045 prep(): ${`\u001b[${36}m${`======================== str[${i}]= ${`\u001b[${35}m${
    //       str[i]?.trim() ? str[i] : JSON.stringify(str[i], null, 4)
    //     }\u001b[${39}m`} ========================`}\u001b[${39}m`}`
    //   );

    // catch the end of the digit chunk
    // -------------------------------------------------------------------------
    if (
      // if chunk has been recorded as already started
      digitsChunkStartsAt !== null &&
      typeof lastDigitAt === "number" &&
      // and
      // a) it's not a whitespace
      ((str[i]?.trim().length &&
        // it's not a number
        !/\d/.test(str[i]) &&
        // and it's not a dot or hyphen
        !["."].includes(str[i])) ||
        // OR
        // b) we reached the end (we traverse up to and including str.length,
        // which is "undefined" character; notice i <= len in the loop above,
        // normally it would be i < len)
        !str[i])
    ) {
      // DEV &&
      //   console.log(
      //     `071 prep(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}: "${JSON.stringify(
      //       {
      //         start: opts.offset + digitsChunkStartsAt,
      //         end: opts.offset + lastDigitAt + 1,
      //         value: str.slice(digitsChunkStartsAt, lastDigitAt + 1),
      //       },
      //       null,
      //       4
      //     )}"`
      //   );
      return {
        start: opts.offset + digitsChunkStartsAt,
        end: opts.offset + lastDigitAt + 1,
        value: str.slice(digitsChunkStartsAt, lastDigitAt + 1),
      };
    }

    // catch digits
    // -------------------------------------------------------------------------
    if (/^\d*$/.test(str[i])) {
      // 1. note that
      lastDigitAt = i;

      // 2. catch the start of the first digit
      if (
        // if chunk hasn't been recorded yet
        digitsChunkStartsAt === null
      ) {
        digitsChunkStartsAt = i;
        // DEV &&
        //   console.log(
        //     `102 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitsChunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
        //       digitsChunkStartsAt,
        //       null,
        //       4
        //     )}`
        //   );
      }
    }

    // catch false scenario cases where letters precede numbers
    // -------------------------------------------------------------------------
    if (
      // chunk hasn't been detected yet:
      digitsChunkStartsAt === null &&
      // it's not whitespace:
      str[i] &&
      str[i].trim() &&
      // it's not dot or digit or some kind of quote:
      !/[\d.'"`]/.test(str[i])
    ) {
      // DEV && console.log(`122 ${`\u001b[${31}m${`early bail`}\u001b[${39}m`}`);
      return {};
    }

    // logging
    // -------------------------------------------------------------------------

    // DEV && console.log(" ");
    // DEV &&
    //   console.log(
    //     `${`\u001b[${90}m${`██ digitsChunkStartsAt = ${digitsChunkStartsAt}`}\u001b[${39}m`}`
    //   );
    // DEV &&
    //   console.log(
    //     `${`\u001b[${90}m${`██ lastDigitAt = ${lastDigitAt}`}\u001b[${39}m`}`
    //   );
    // DEV && console.log(`${`\u001b[${90}m${`----------------`}\u001b[${39}m`}`);
  }

  return {};
}

export const getNewValue = (
  subTestCount: string,
  testOrderNumber: string,
  counter2: number
): string =>
  subTestCount === "single"
    ? testOrderNumber
    : `${testOrderNumber}.${`${counter2}`.padStart(2, "0")}`;

// compiled from https://node-tap.org/docs/api/asserts/
export const messageIsSecondArg = new Set([
  "ok",
  "notOk",
  "true",
  "false",
  "assert",
  "assertNot",
  "error",
  "ifErr",
  "ifError",
  "rejects", // "rejects" message can be 2nd or 3rd arg!!!
  "resolves",
  "resolveMatchSnapshot",
  "throws", // "throws" message can be 2nd or 3rd arg!!!
  "throw", // "throw" message can be 2nd or 3rd arg!!!
  "doesNotThrow",
  "notThrow",
  "expectUncaughtException", // "expectUncaughtException" message can be 2nd or 3rd arg!!!
]);

// compiled from https://node-tap.org/docs/api/asserts/
export const messageIsThirdArg = new Set([
  "emits",
  "rejects", // "rejects" message can be 2nd or 3rd arg!!!
  "resolveMatch",
  "throws", // "throws" message can be 2nd or 3rd arg!!!
  "throw", // "throw" message can be 2nd or 3rd arg!!!
  "expectUncaughtException", // "expectUncaughtException" message can be 2nd or 3rd arg!!!
  "equal",
  "equals",
  "isEqual",
  "is",
  "strictEqual",
  "strictEquals",
  "strictIs",
  "isStrict",
  "isStrictly",
  "notEqual",
  "inequal",
  "notEqual",
  "notEquals",
  "notStrictEqual",
  "notStrictEquals",
  "isNotEqual",
  "isNot",
  "doesNotEqual",
  "isInequal",
  "same",
  "equivalent",
  "looseEqual",
  "looseEquals",
  "deepEqual",
  "deepEquals",
  "isLoose",
  "looseIs",
  "notSame",
  "inequivalent",
  "looseInequal",
  "notDeep",
  "deepInequal",
  "notLoose",
  "looseNot",
  "strictSame",
  "strictEquivalent",
  "strictDeepEqual",
  "sameStrict",
  "deepIs",
  "isDeeply",
  "isDeep",
  "strictDeepEquals",
  "strictNotSame",
  "strictInequivalent",
  "strictDeepInequal",
  "notSameStrict",
  "deepNot",
  "notDeeply",
  "strictDeepInequals",
  "notStrictSame",
  "hasStrict",
  "match",
  "has",
  "hasFields",
  "matches",
  "similar",
  "like",
  "isLike",
  "includes",
  "include",
  "contains",
  "notMatch",
  "dissimilar",
  "unsimilar",
  "notSimilar",
  "unlike",
  "isUnlike",
  "notLike",
  "isNotLike",
  "doesNotHave",
  "isNotSimilar",
  "isDissimilar",
  "type",
  "isa",
  "isA",
]);

export const stringify = (obj: Obj) => {
  // return stringifySafe(obj, null, 4);
  return JSON.stringify(
    deleteKey(
      deleteKey(JSON.parse(stringifySafe(obj)), {
        key: "parent",
      }),
      {
        key: "loc",
      }
    ),
    null,
    4
  );
};

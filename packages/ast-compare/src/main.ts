import { empty } from "ast-contains-only-empty-space";
import { hasOwnProp, isPlainObject as isObj, match } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

/* eslint no-use-before-define: 0 */
// From "type-fest" by Sindre Sorhus:
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;
export type JsonObject = { [Key in string]?: JsonValue };
export type JsonArray = JsonValue[];

export interface AnyObject {
  [key: string]: any;
}

declare let DEV: boolean;

// -----------------------------------------------------------------------------

/* c8 ignore next */
function isBlank(something: any): boolean {
  if (isObj(something)) {
    return !Object.keys(something).length;
  }
  if (Array.isArray(something) || typeof something === "string") {
    return !something.length;
  }
  return false;
}

function sameType(a: unknown, b: unknown): boolean {
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b);
  }
  return typeof a === typeof b;
}

function typeLabel(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "Array";
  if (isObj(value)) return "Object";
  return typeof value;
}

export interface Opts {
  arrayOrder: "ordered" | "any";
  hungryForWhitespace: boolean;
  matchStrictly: boolean;
  verboseWhenMismatches: boolean;
  useWildcards: boolean;
}

const defaults: Opts = {
  arrayOrder: "ordered",
  hungryForWhitespace: false,
  matchStrictly: false,
  verboseWhenMismatches: false,
  useWildcards: false,
};

// -----------------------------------------------------------------------------

// Legend:
// b - superset object; s - subset object

/**
 * Compare anything: AST, objects, arrays, strings and nested thereof
 */
function compare(
  b: JsonValue,
  s: JsonValue,
  opts?: Partial<Opts>,
): boolean | string {
  return compareInner(b, s, { ...defaults, ...opts });
}

function compareInner(
  b: JsonValue,
  s: JsonValue,
  resolvedOpts: Opts,
): boolean | string {
  DEV && console.log("091 \n███████████████████████████████████████\n ");
  DEV && console.log(`092 compare() CALLED`);

  let sKeys: string[];
  let bKeys: string[];
  let found: boolean;
  let bOffset = 0;

  DEV &&
    console.log(
      `101 compare(): ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}`,
    );

  // edge case when hungryForWhitespace=true, matchStrictly=true and matching against blank object:
  if (
    resolvedOpts.hungryForWhitespace &&
    resolvedOpts.matchStrictly &&
    isObj(b) &&
    empty(b) &&
    isObj(s) &&
    !Object.keys(s).length
  ) {
    DEV && console.log(`117 return true`);
    return true;
  }

  // instant (falsy) result
  if (
    ((!resolvedOpts.hungryForWhitespace ||
      (resolvedOpts.hungryForWhitespace && !empty(b) && empty(s))) &&
      isObj(b) &&
      Object.keys(b).length !== 0 &&
      isObj(s) &&
      Object.keys(s).length === 0) ||
    (!sameType(b, s) &&
      (!resolvedOpts.hungryForWhitespace ||
        (resolvedOpts.hungryForWhitespace && !empty(b))))
  ) {
    DEV && console.log(`133 return false`);
    return false;
  }

  // A C T I O N

  if (typeof b === "string" && typeof s === "string") {
    DEV &&
      console.log(
        `142 ${`\u001b[${33}m${`big`}\u001b[${39}m`}: ${JSON.stringify(
          b,
          null,
          4,
        )} (empty: ${empty(b)})`,
      );
    DEV &&
      console.log(
        `150 ${`\u001b[${33}m${`small`}\u001b[${39}m`}: ${JSON.stringify(
          s,
          null,
          4,
        )} (empty: ${empty(s)})`,
      );
    if (resolvedOpts.hungryForWhitespace && empty(b) && empty(s)) {
      DEV &&
        console.log(
          `159 ${`\u001b[${32}m${`return true, both empty`}\u001b[${39}m`}`,
        );
      return true;
    }
    const stringsMatch = resolvedOpts.useWildcards
      ? match(b, s, { caseSensitiveMatch: true })
      : b === s;
    if (resolvedOpts.verboseWhenMismatches) {
      DEV && console.log(`167 return ${stringsMatch}`);
      return stringsMatch
        ? true
        : `Given string ${s} is not matched! We have ${b} on the other end.`;
    }
    DEV && console.log(`172 return ${stringsMatch}`);
    return stringsMatch;
  }
  if (Array.isArray(b) && Array.isArray(s)) {
    DEV && console.log(`176 both arrays`);
    if (
      resolvedOpts.hungryForWhitespace &&
      empty(s) &&
      (!resolvedOpts.matchStrictly ||
        (resolvedOpts.matchStrictly && b.length === s.length))
    ) {
      DEV && console.log(`183 return true`);
      return true;
    }
    if (
      (!resolvedOpts.hungryForWhitespace && s.length > b.length) ||
      (resolvedOpts.matchStrictly && s.length !== b.length)
    ) {
      if (!resolvedOpts.verboseWhenMismatches) {
        DEV && console.log(`191 return false`);
        return false;
      }
      DEV && console.log(`194 return`);
      return `The length of a given array, ${JSON.stringify(s, null, 4)} is ${
        s.length
      } but the length of an array on the other end, ${JSON.stringify(
        b,
        null,
        4,
      )} is ${b.length}`;
    }
    if (s.length === 0) {
      if (b.length === 0) {
        DEV && console.log(`205 return true`);
        return true;
      }
      // so b is not zero-long, but s is.
      if (resolvedOpts.verboseWhenMismatches) {
        DEV && console.log(`210 return`);
        return `The given array has no elements, but the array on the other end, ${JSON.stringify(
          b,
          null,
          4,
        )} does have some`;
      }
      DEV && console.log(`217 return false`);
      return false;
    }
    if (resolvedOpts.arrayOrder === "any") {
      found = arraysMatchInAnyOrder(b, s, resolvedOpts);
    } else {
      found = true;
      for (let i = 0, sLen = s.length; i < sLen; i++) {
        found = false;
        for (let j = bOffset, bLen = b.length; j < bLen; j++) {
          bOffset += 1;
          DEV && console.log(`228 enter recursion`);
          if (compareInner(b[j], s[i], resolvedOpts) === true) {
            found = true;
            break;
          }
        }
        if (!found) {
          break;
        }
      }
    }
    if (!found) {
      if (!resolvedOpts.verboseWhenMismatches) {
        DEV && console.log(`241 return false`);
        return false;
      }
      DEV && console.log(`244 return`);
      return `The given array ${JSON.stringify(
        s,
        null,
        4,
      )} is not a subset of an array on the other end, ${JSON.stringify(
        b,
        null,
        4,
      )}`;
    }
  } else if (isObj(b) && isObj(s)) {
    sKeys = Object.keys(s);
    bKeys = Object.keys(b);
    if (resolvedOpts.matchStrictly && sKeys.length !== bKeys.length) {
      if (!resolvedOpts.verboseWhenMismatches) {
        DEV && console.log(`260 return false`);
        return false;
      }
      let sKeySet = new Set(sKeys);
      let bKeySet = new Set(bKeys);
      let uniqueKeysOnS = sKeys.filter((x) => !bKeySet.has(x));
      let sMessage = uniqueKeysOnS.length
        ? ` First object has unique keys: ${JSON.stringify(
            uniqueKeysOnS,
            null,
            4,
          )}.`
        : "";

      let uniqueKeysOnB = bKeys.filter((x) => !sKeySet.has(x));
      let bMessage = uniqueKeysOnB.length
        ? ` Second object has unique keys:
        ${JSON.stringify(uniqueKeysOnB, null, 4)}.`
        : "";

      DEV && console.log(`280 return`);
      return `When matching strictly, we found that both objects have different amount of keys.${sMessage}${bMessage}`;
    }

    DEV && console.log(`284 ${`\u001b[${36}m${`LOOP`}\u001b[${39}m`}`);

    for (const sKey of sKeys) {
      DEV &&
        console.log(`288 ${`\u001b[${35}m${`sKey = ${sKey}`}\u001b[${39}m`}`);
      if (!hasOwnProp(b, sKey)) {
        DEV && console.log(`290 case #1.`);
        if (
          !resolvedOpts.useWildcards ||
          (resolvedOpts.useWildcards && !sKey.includes("*"))
        ) {
          if (!resolvedOpts.verboseWhenMismatches) {
            DEV && console.log(`296 return false`);
            return false;
          }
          DEV && console.log(`299 return`);
          return `The given object has key "${sKey}" which the other-one does not have.`;
        }
        // so wildcards are on and sKeys[i] contains a wildcard
        if (
          bKeys.some((bKey) => match(bKey, sKey, { caseSensitiveMatch: true }))
        ) {
          // This wildcard key matched; keep checking the remaining subset keys.
          DEV && console.log(`307 continue`);
          continue;
        }
        if (!resolvedOpts.verboseWhenMismatches) {
          DEV && console.log(`311 return false`);
          return false;
        }
        DEV && console.log(`314 return`);
        return `The given object has key "${sKey}" which the other-one does not have.`;
      }
      if (b[sKey] != null && !sameType(b[sKey], s[sKey])) {
        DEV && console.log(`318 case #2.`);
        DEV && console.log(`319 types mismatch`);
        // Types mismatch. Probably falsy result, unless comparing with
        // empty/blank things. Let's check.
        // it might be blank array vs blank object:
        if (
          !(
            empty(b[sKey]) &&
            empty(s[sKey]) &&
            resolvedOpts.hungryForWhitespace
          )
        ) {
          if (!resolvedOpts.verboseWhenMismatches) {
            DEV && console.log(`331 return false`);
            return false;
          }
          DEV && console.log(`334 return`);
          return `The given key ${sKey} is of a different type on both objects. On the first-one, it's ${typeLabel(
            s[sKey],
          )}, on the second-one, it's ${typeLabel(b[sKey])}`;
        }
      } else if (compareInner(b[sKey], s[sKey], resolvedOpts) !== true) {
        DEV && console.log(`340 case #3. - recursion returned false`);
        DEV &&
          console.log(
            `343 ██ ${`\u001b[${33}m${`b[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
              b[sKey],
              null,
              4,
            )}`,
          );
        DEV &&
          console.log(
            `351 ██ ${`\u001b[${33}m${`s[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
              s[sKey],
              null,
              4,
            )}`,
          );
        DEV && console.log(`357 so key does exist and type matches`);
        if (!resolvedOpts.verboseWhenMismatches) {
          DEV && console.log(`359 return false`);
          return false;
        }
        DEV && console.log(`362 return`);
        return `The given piece ${JSON.stringify(
          s[sKey],
          null,
          4,
        )} and ${JSON.stringify(b[sKey], null, 4)} don't match.`;
      }
      DEV && console.log(`369 end reached, case #4.`);
    }
  } else {
    DEV && console.log(`372 else clauses`);
    if (
      resolvedOpts.hungryForWhitespace &&
      empty(b) &&
      empty(s) &&
      (!resolvedOpts.matchStrictly ||
        (resolvedOpts.matchStrictly && isBlank(s)))
    ) {
      DEV && console.log(`380 return true`);
      return true;
    }
    DEV && console.log(`383 return ${b === s}`);
    return b === s;
  }
  DEV && console.log(`386 return true`);
  return true;
}

/**
 * Find an injective match from the subset array into the superset array.
 * Reassigning an earlier match is necessary when wildcard or subset matches
 * make more than one pairing possible.
 */
function arraysMatchInAnyOrder(
  b: JsonArray,
  s: JsonArray,
  resolvedOpts: Opts,
): boolean {
  const candidateOpts = resolvedOpts.verboseWhenMismatches
    ? { ...resolvedOpts, verboseWhenMismatches: false }
    : resolvedOpts;
  const candidates = Array.from({ length: s.length }, (_, subsetIndex) =>
    Array.from(
      { length: b.length },
      (_, supersetIndex) =>
        compareInner(b[supersetIndex], s[subsetIndex], candidateOpts) === true,
    ),
  );
  const subsetIndexBySupersetIndex = new Array<number>(b.length).fill(-1);

  function assign(
    subsetIndex: number,
    visitedSupersetIndexes: boolean[],
  ): boolean {
    for (let supersetIndex = 0; supersetIndex < b.length; supersetIndex++) {
      if (
        !candidates[subsetIndex][supersetIndex] ||
        visitedSupersetIndexes[supersetIndex]
      ) {
        continue;
      }
      visitedSupersetIndexes[supersetIndex] = true;
      const previousSubsetIndex = subsetIndexBySupersetIndex[supersetIndex];
      if (
        previousSubsetIndex === -1 ||
        assign(previousSubsetIndex, visitedSupersetIndexes)
      ) {
        subsetIndexBySupersetIndex[supersetIndex] = subsetIndex;
        return true;
      }
    }
    return false;
  }

  for (let subsetIndex = 0; subsetIndex < s.length; subsetIndex++) {
    if (!assign(subsetIndex, new Array<boolean>(b.length).fill(false))) {
      return false;
    }
  }
  return true;
}

export { compare, defaults, version };

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
  hungryForWhitespace: boolean;
  matchStrictly: boolean;
  verboseWhenMismatches: boolean;
  useWildcards: boolean;
}

const defaults: Opts = {
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
  DEV && console.log("089 \n███████████████████████████████████████\n ");
  DEV && console.log(`090 compare() CALLED`);

  let sKeys: string[];
  let bKeys: string[];
  let found: boolean;
  let bOffset = 0;

  DEV &&
    console.log(
      `099 compare(): ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
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
    DEV && console.log(`115 return true`);
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
    DEV && console.log(`131 return false`);
    return false;
  }

  // A C T I O N

  if (typeof b === "string" && typeof s === "string") {
    DEV &&
      console.log(
        `140 ${`\u001b[${33}m${`big`}\u001b[${39}m`}: ${JSON.stringify(
          b,
          null,
          4,
        )} (empty: ${empty(b)})`,
      );
    DEV &&
      console.log(
        `148 ${`\u001b[${33}m${`small`}\u001b[${39}m`}: ${JSON.stringify(
          s,
          null,
          4,
        )} (empty: ${empty(s)})`,
      );
    if (resolvedOpts.hungryForWhitespace && empty(b) && empty(s)) {
      DEV &&
        console.log(
          `157 ${`\u001b[${32}m${`return true, both empty`}\u001b[${39}m`}`,
        );
      return true;
    }
    if (resolvedOpts.verboseWhenMismatches) {
      DEV && console.log(`162 return ${b === s}`);
      return b === s
        ? true
        : `Given string ${s} is not matched! We have ${b} on the other end.`;
    }
    DEV &&
      console.log(
        `169 return ${
          resolvedOpts.useWildcards
            ? match(b, s, { caseSensitiveMatch: true })
            : b === s
        }`,
      );
    return resolvedOpts.useWildcards
      ? match(b, s, { caseSensitiveMatch: true })
      : b === s;
  }
  if (Array.isArray(b) && Array.isArray(s)) {
    DEV && console.log(`180 both arrays`);
    if (
      resolvedOpts.hungryForWhitespace &&
      empty(s) &&
      (!resolvedOpts.matchStrictly ||
        (resolvedOpts.matchStrictly && b.length === s.length))
    ) {
      DEV && console.log(`187 return true`);
      return true;
    }
    if (
      (!resolvedOpts.hungryForWhitespace && s.length > b.length) ||
      (resolvedOpts.matchStrictly && s.length !== b.length)
    ) {
      if (!resolvedOpts.verboseWhenMismatches) {
        DEV && console.log(`195 return false`);
        return false;
      }
      DEV && console.log(`198 return`);
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
        DEV && console.log(`209 return true`);
        return true;
      }
      // so b is not zero-long, but s is.
      if (resolvedOpts.verboseWhenMismatches) {
        DEV && console.log(`214 return`);
        return `The given array has no elements, but the array on the other end, ${JSON.stringify(
          b,
          null,
          4,
        )} does have some`;
      }
      DEV && console.log(`221 return false`);
      return false;
    }
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
        if (!resolvedOpts.verboseWhenMismatches) {
          DEV && console.log(`236 return false`);
          return false;
        }
        DEV && console.log(`239 return`);
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
    }
  } else if (isObj(b) && isObj(s)) {
    sKeys = Object.keys(s);
    bKeys = Object.keys(b);
    if (resolvedOpts.matchStrictly && sKeys.length !== bKeys.length) {
      if (!resolvedOpts.verboseWhenMismatches) {
        DEV && console.log(`256 return false`);
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

      DEV && console.log(`276 return`);
      return `When matching strictly, we found that both objects have different amount of keys.${sMessage}${bMessage}`;
    }

    DEV && console.log(`280 ${`\u001b[${36}m${`LOOP`}\u001b[${39}m`}`);

    for (const sKey of sKeys) {
      DEV &&
        console.log(`284 ${`\u001b[${35}m${`sKey = ${sKey}`}\u001b[${39}m`}`);
      if (!hasOwnProp(b, sKey)) {
        DEV && console.log(`286 case #1.`);
        if (
          !resolvedOpts.useWildcards ||
          (resolvedOpts.useWildcards && !sKey.includes("*"))
        ) {
          if (!resolvedOpts.verboseWhenMismatches) {
            DEV && console.log(`292 return false`);
            return false;
          }
          DEV && console.log(`295 return`);
          return `The given object has key "${sKey}" which the other-one does not have.`;
        }
        // so wildcards are on and sKeys[i] contains a wildcard
        if (
          bKeys.some((bKey) => match(bKey, sKey, { caseSensitiveMatch: true }))
        ) {
          // This wildcard key matched; keep checking the remaining subset keys.
          DEV && console.log(`301 continue`);
          continue;
        }
        if (!resolvedOpts.verboseWhenMismatches) {
          DEV && console.log(`305 return false`);
          return false;
        }
        DEV && console.log(`308 return`);
        return `The given object has key "${sKey}" which the other-one does not have.`;
      }
      if (b[sKey] != null && !sameType(b[sKey], s[sKey])) {
        DEV && console.log(`312 case #2.`);
        DEV && console.log(`313 types mismatch`);
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
            DEV && console.log(`325 return false`);
            return false;
          }
          DEV && console.log(`328 return`);
          return `The given key ${sKey} is of a different type on both objects. On the first-one, it's ${typeLabel(
            s[sKey],
          )}, on the second-one, it's ${typeLabel(b[sKey])}`;
        }
      } else if (compareInner(b[sKey], s[sKey], resolvedOpts) !== true) {
        DEV && console.log(`334 case #3. - recursion returned false`);
        DEV &&
          console.log(
            `337 ██ ${`\u001b[${33}m${`b[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
              b[sKey],
              null,
              4,
            )}`,
          );
        DEV &&
          console.log(
            `345 ██ ${`\u001b[${33}m${`s[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
              s[sKey],
              null,
              4,
            )}`,
          );
        DEV && console.log(`351 so key does exist and type matches`);
        if (!resolvedOpts.verboseWhenMismatches) {
          DEV && console.log(`353 return false`);
          return false;
        }
        DEV && console.log(`356 return`);
        return `The given piece ${JSON.stringify(
          s[sKey],
          null,
          4,
        )} and ${JSON.stringify(b[sKey], null, 4)} don't match.`;
      }
      DEV && console.log(`363 end reached, case #4.`);
    }
  } else {
    DEV && console.log(`366 else clauses`);
    if (
      resolvedOpts.hungryForWhitespace &&
      empty(b) &&
      empty(s) &&
      (!resolvedOpts.matchStrictly ||
        (resolvedOpts.matchStrictly && isBlank(s)))
    ) {
      DEV && console.log(`374 return true`);
      return true;
    }
    DEV && console.log(`377 return ${b === s}`);
    return b === s;
  }
  DEV && console.log(`380 return true`);
  return true;
}

export { compare, defaults, version };

import typeDetect from "type-detect";
import { empty } from "ast-contains-only-empty-space";
import isObj from "lodash.isplainobject";
import { isMatch } from "matcher";

import { version as v } from "../package.json";

const version: string = v;

/* eslint no-use-before-define: 0 */
// From "type-fest" by Sindre Sorhus:
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = JsonValue[];

interface AnyObject {
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

interface Opts {
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
  opts?: Partial<Opts>
): boolean | string {
  DEV && console.log(" \n███████████████████████████████████████\n ");
  DEV && console.log(`063 compare() CALLED`);

  let sKeys: Set<string>;
  let bKeys: Set<string>;
  let found: boolean;
  let bOffset = 0;

  // prep resolvedOpts
  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV &&
    console.log(
      `074 compare(): ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4
      )}`
    );

  // edge case when hungryForWhitespace=true, matchStrictly=true and matching against blank object:
  if (
    resolvedOpts.hungryForWhitespace &&
    resolvedOpts.matchStrictly &&
    isObj(b) &&
    empty(b) &&
    isObj(s) &&
    !Object.keys(s as AnyObject).length
  ) {
    DEV && console.log(`090 return true`);
    return true;
  }

  // instant (falsey) result
  if (
    ((!resolvedOpts.hungryForWhitespace ||
      (resolvedOpts.hungryForWhitespace && !empty(b) && empty(s))) &&
      isObj(b) &&
      Object.keys(b as AnyObject).length !== 0 &&
      isObj(s) &&
      Object.keys(s as AnyObject).length === 0) ||
    (typeDetect(b) !== typeDetect(s) &&
      (!resolvedOpts.hungryForWhitespace ||
        (resolvedOpts.hungryForWhitespace && !empty(b))))
  ) {
    DEV && console.log(`106 return false`);
    return false;
  }

  // A C T I O N

  if (typeof b === "string" && typeof s === "string") {
    DEV &&
      console.log(
        `115 ${`\u001b[${33}m${`big`}\u001b[${39}m`}: ${JSON.stringify(
          b,
          null,
          4
        )} (empty: ${empty(b)})`
      );
    DEV &&
      console.log(
        `123 ${`\u001b[${33}m${`small`}\u001b[${39}m`}: ${JSON.stringify(
          s,
          null,
          4
        )} (empty: ${empty(s)})`
      );
    if (resolvedOpts.hungryForWhitespace && empty(b) && empty(s)) {
      DEV &&
        console.log(
          `132 ${`\u001b[${32}m${`return true, both empty`}\u001b[${39}m`}`
        );
      return true;
    }
    if (resolvedOpts.verboseWhenMismatches) {
      DEV && console.log(`137 return ${b === s}`);
      return b === s
        ? true
        : `Given string ${s} is not matched! We have ${b} on the other end.`;
    }
    DEV &&
      console.log(
        `144 return ${
          resolvedOpts.useWildcards
            ? isMatch(b, s, { caseSensitive: true })
            : b === s
        }`
      );
    return resolvedOpts.useWildcards
      ? isMatch(b, s, { caseSensitive: true })
      : b === s;
  }
  if (Array.isArray(b) && Array.isArray(s)) {
    DEV && console.log(`155 both arrays`);
    if (
      resolvedOpts.hungryForWhitespace &&
      empty(s) &&
      (!resolvedOpts.matchStrictly ||
        (resolvedOpts.matchStrictly && b.length === s.length))
    ) {
      DEV && console.log(`162 return true`);
      return true;
    }
    if (
      (!resolvedOpts.hungryForWhitespace && s.length > b.length) ||
      (resolvedOpts.matchStrictly && s.length !== b.length)
    ) {
      if (!resolvedOpts.verboseWhenMismatches) {
        DEV && console.log(`170 return false`);
        return false;
      }
      DEV && console.log(`173 return`);
      return `The length of a given array, ${JSON.stringify(s, null, 4)} is ${
        s.length
      } but the length of an array on the other end, ${JSON.stringify(
        b,
        null,
        4
      )} is ${b.length}`;
    }
    if (s.length === 0) {
      if (b.length === 0) {
        DEV && console.log(`184 return true`);
        return true;
      }
      // so b is not zero-long, but s is.
      if (resolvedOpts.verboseWhenMismatches) {
        DEV && console.log(`189 return`);
        return `The given array has no elements, but the array on the other end, ${JSON.stringify(
          b,
          null,
          4
        )} does have some`;
      }
      DEV && console.log(`196 return false`);
      return false;
    }
    for (let i = 0, sLen = s.length; i < sLen; i++) {
      found = false;
      for (let j = bOffset, bLen = b.length; j < bLen; j++) {
        bOffset += 1;
        DEV && console.log(`203 enter recursion`);
        if (compare(b[j], s[i], resolvedOpts) === true) {
          found = true;
          break;
        }
      }
      if (!found) {
        if (!resolvedOpts.verboseWhenMismatches) {
          DEV && console.log(`211 return false`);
          return false;
        }
        DEV && console.log(`214 return`);
        return `The given array ${JSON.stringify(
          s,
          null,
          4
        )} is not a subset of an array on the other end, ${JSON.stringify(
          b,
          null,
          4
        )}`;
      }
    }
  } else if (isObj(b) && isObj(s)) {
    sKeys = new Set(Object.keys(s as AnyObject));
    bKeys = new Set(Object.keys(b as AnyObject));
    if (resolvedOpts.matchStrictly && sKeys.size !== bKeys.size) {
      if (!resolvedOpts.verboseWhenMismatches) {
        DEV && console.log(`231 return false`);
        return false;
      }
      let uniqueKeysOnS = new Set([...sKeys].filter((x) => !bKeys.has(x)));
      let sMessage = uniqueKeysOnS.size
        ? ` First object has unique keys: ${JSON.stringify(
            uniqueKeysOnS,
            null,
            4
          )}.`
        : "";

      let uniqueKeysOnB = new Set([...bKeys].filter((x) => !sKeys.has(x)));
      let bMessage = uniqueKeysOnB.size
        ? ` Second object has unique keys:
        ${JSON.stringify(uniqueKeysOnB, null, 4)}.`
        : "";

      DEV && console.log(`249 return`);
      return `When matching strictly, we found that both objects have different amount of keys.${sMessage}${bMessage}`;
    }

    DEV && console.log(`253 ${`\u001b[${36}m${`LOOP`}\u001b[${39}m`}`);

    // eslint-disable-next-line
    for (const sKey of sKeys) {
      DEV &&
        console.log(`258 ${`\u001b[${35}m${`sKey = ${sKey}`}\u001b[${39}m`}`);
      if (!Object.prototype.hasOwnProperty.call(b, sKey)) {
        DEV && console.log(`260 case #1.`);
        if (
          !resolvedOpts.useWildcards ||
          (resolvedOpts.useWildcards && !sKey.includes("*"))
        ) {
          if (!resolvedOpts.verboseWhenMismatches) {
            DEV && console.log(`266 return false`);
            return false;
          }
          DEV && console.log(`269 return`);
          return `The given object has key "${sKey}" which the other-one does not have.`;
        }
        // so wildcards are on and sKeys[i] contains a wildcard
        if (
          Object.keys(b as AnyObject).some((bKey) =>
            isMatch(bKey, sKey, { caseSensitive: true })
          )
        ) {
          // so some keys do match. Return true
          DEV && console.log(`279 return true`);
          return true;
        }
        if (!resolvedOpts.verboseWhenMismatches) {
          DEV && console.log(`283 return false`);
          return false;
        }
        DEV && console.log(`286 return`);
        return `The given object has key "${sKey}" which the other-one does not have.`;
      }
      if (
        (b as AnyObject)[sKey] != null &&
        typeDetect((b as AnyObject)[sKey]) !==
          typeDetect((s as AnyObject)[sKey])
      ) {
        DEV && console.log(`294 case #2.`);
        DEV && console.log(`295 types mismatch`);
        // Types mismatch. Probably falsey result, unless comparing with
        // empty/blank things. Let's check.
        // it might be blank array vs blank object:
        if (
          !(
            empty((b as AnyObject)[sKey]) &&
            empty((s as AnyObject)[sKey]) &&
            resolvedOpts.hungryForWhitespace
          )
        ) {
          if (!resolvedOpts.verboseWhenMismatches) {
            DEV && console.log(`307 return false`);
            return false;
          }
          DEV && console.log(`310 return`);
          return `The given key ${sKey} is of a different type on both objects. On the first-one, it's ${typeDetect(
            (s as AnyObject)[sKey]
          )}, on the second-one, it's ${typeDetect((b as AnyObject)[sKey])}`;
        }
      } else if (
        compare(
          (b as AnyObject)[sKey],
          (s as AnyObject)[sKey],
          resolvedOpts
        ) !== true
      ) {
        DEV && console.log(`322 case #3. - recursion returned false`);
        DEV &&
          console.log(
            `325 ██ ${`\u001b[${33}m${`b[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
              (b as AnyObject)[sKey],
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `333 ██ ${`\u001b[${33}m${`s[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
              (s as AnyObject)[sKey],
              null,
              4
            )}`
          );
        DEV && console.log(`339 so key does exist and type matches`);
        if (!resolvedOpts.verboseWhenMismatches) {
          DEV && console.log(`341 return false`);
          return false;
        }
        DEV && console.log(`344 return`);
        return `The given piece ${JSON.stringify(
          (s as AnyObject)[sKey],
          null,
          4
        )} and ${JSON.stringify((b as AnyObject)[sKey], null, 4)} don't match.`;
      }
      DEV && console.log(`351 end reached, case #4.`);
    }
  } else {
    DEV && console.log(`354 else clauses`);
    if (
      resolvedOpts.hungryForWhitespace &&
      empty(b) &&
      empty(s) &&
      (!resolvedOpts.matchStrictly ||
        (resolvedOpts.matchStrictly && isBlank(s)))
    ) {
      DEV && console.log(`362 return true`);
      return true;
    }
    DEV && console.log(`365 return ${b === s}`);
    return b === s;
  }
  DEV && console.log(`368 return true`);
  return true;
}

export { compare, defaults, version };

import typeDetect from "type-detect";
import { empty } from "ast-contains-only-empty-space";
import isObj from "lodash.isplainobject";
import { isMatch } from "matcher";

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

/* istanbul ignore next */
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
  hungryForWhitespace?: boolean;
  matchStrictly?: boolean;
  verboseWhenMismatches?: boolean;
  useWildcards?: boolean;
}

// -----------------------------------------------------------------------------

// Legend:
// b - superset object; s - subset object

/**
 * Compare anything: AST, objects, arrays, strings and nested thereof
 */
function compare(
  b: JsonValue,
  s: JsonValue,
  originalOpts?: Opts
): boolean | string {
  DEV && console.log(" \n███████████████████████████████████████\n ");
  DEV && console.log(`052 compare() CALLED`);

  let sKeys: Set<string>;
  let bKeys: Set<string>;
  let found: boolean;
  let bOffset = 0;

  // prep opts
  let defaults: Opts = {
    hungryForWhitespace: false,
    matchStrictly: false,
    verboseWhenMismatches: false,
    useWildcards: false,
  };
  let opts = { ...defaults, ...originalOpts };
  DEV &&
    console.log(
      `069 compare(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );

  // edge case when hungryForWhitespace=true, matchStrictly=true and matching against blank object:
  if (
    opts.hungryForWhitespace &&
    opts.matchStrictly &&
    isObj(b) &&
    empty(b) &&
    isObj(s) &&
    !Object.keys(s as AnyObject).length
  ) {
    DEV && console.log(`085 return true`);
    return true;
  }

  // instant (falsey) result
  if (
    ((!opts.hungryForWhitespace ||
      (opts.hungryForWhitespace && !empty(b) && empty(s))) &&
      isObj(b) &&
      Object.keys(b as AnyObject).length !== 0 &&
      isObj(s) &&
      Object.keys(s as AnyObject).length === 0) ||
    (typeDetect(b) !== typeDetect(s) &&
      (!opts.hungryForWhitespace || (opts.hungryForWhitespace && !empty(b))))
  ) {
    DEV && console.log(`100 return false`);
    return false;
  }

  // A C T I O N

  if (typeof b === "string" && typeof s === "string") {
    DEV &&
      console.log(
        `109 ${`\u001b[${33}m${`big`}\u001b[${39}m`}: ${JSON.stringify(
          b,
          null,
          4
        )} (empty: ${empty(b)})`
      );
    DEV &&
      console.log(
        `117 ${`\u001b[${33}m${`small`}\u001b[${39}m`}: ${JSON.stringify(
          s,
          null,
          4
        )} (empty: ${empty(s)})`
      );
    if (opts.hungryForWhitespace && empty(b) && empty(s)) {
      DEV &&
        console.log(
          `126 ${`\u001b[${32}m${`return true, both empty`}\u001b[${39}m`}`
        );
      return true;
    }
    if (opts.verboseWhenMismatches) {
      DEV && console.log(`131 return ${b === s}`);
      return b === s
        ? true
        : `Given string ${s} is not matched! We have ${b} on the other end.`;
    }
    DEV &&
      console.log(
        `138 return ${
          opts.useWildcards ? isMatch(b, s, { caseSensitive: true }) : b === s
        }`
      );
    return opts.useWildcards ? isMatch(b, s, { caseSensitive: true }) : b === s;
  }
  if (Array.isArray(b) && Array.isArray(s)) {
    DEV && console.log(`145 both arrays`);
    if (
      opts.hungryForWhitespace &&
      empty(s) &&
      (!opts.matchStrictly || (opts.matchStrictly && b.length === s.length))
    ) {
      DEV && console.log(`151 return true`);
      return true;
    }
    if (
      (!opts.hungryForWhitespace && s.length > b.length) ||
      (opts.matchStrictly && s.length !== b.length)
    ) {
      if (!opts.verboseWhenMismatches) {
        DEV && console.log(`159 return false`);
        return false;
      }
      DEV && console.log(`162 return`);
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
        DEV && console.log(`173 return true`);
        return true;
      }
      // so b is not zero-long, but s is.
      if (opts.verboseWhenMismatches) {
        DEV && console.log(`178 return`);
        return `The given array has no elements, but the array on the other end, ${JSON.stringify(
          b,
          null,
          4
        )} does have some`;
      }
      DEV && console.log(`185 return false`);
      return false;
    }
    for (let i = 0, sLen = s.length; i < sLen; i++) {
      found = false;
      for (let j = bOffset, bLen = b.length; j < bLen; j++) {
        bOffset += 1;
        DEV && console.log(`192 enter recursion`);
        if (compare(b[j], s[i], opts) === true) {
          found = true;
          break;
        }
      }
      if (!found) {
        if (!opts.verboseWhenMismatches) {
          DEV && console.log(`200 return false`);
          return false;
        }
        DEV && console.log(`203 return`);
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
    if (opts.matchStrictly && sKeys.size !== bKeys.size) {
      if (!opts.verboseWhenMismatches) {
        DEV && console.log(`220 return false`);
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

      DEV && console.log(`238 return`);
      return `When matching strictly, we found that both objects have different amount of keys.${sMessage}${bMessage}`;
    }

    DEV && console.log(`242 ${`\u001b[${36}m${`LOOP`}\u001b[${39}m`}`);

    // eslint-disable-next-line
    for (const sKey of sKeys) {
      DEV &&
        console.log(`247 ${`\u001b[${35}m${`sKey = ${sKey}`}\u001b[${39}m`}`);
      if (!Object.prototype.hasOwnProperty.call(b, sKey)) {
        DEV && console.log(`249 case #1.`);
        if (!opts.useWildcards || (opts.useWildcards && !sKey.includes("*"))) {
          if (!opts.verboseWhenMismatches) {
            DEV && console.log(`252 return false`);
            return false;
          }
          DEV && console.log(`255 return`);
          return `The given object has key "${sKey}" which the other-one does not have.`;
        }
        // so wildcards are on and sKeys[i] contains a wildcard
        if (
          Object.keys(b as AnyObject).some((bKey) =>
            isMatch(bKey, sKey, { caseSensitive: true })
          )
        ) {
          // so some keys do match. Return true
          DEV && console.log(`265 return true`);
          return true;
        }
        if (!opts.verboseWhenMismatches) {
          DEV && console.log(`269 return false`);
          return false;
        }
        DEV && console.log(`272 return`);
        return `The given object has key "${sKey}" which the other-one does not have.`;
      }
      if (
        (b as AnyObject)[sKey] != null &&
        typeDetect((b as AnyObject)[sKey]) !==
          typeDetect((s as AnyObject)[sKey])
      ) {
        DEV && console.log(`280 case #2.`);
        DEV && console.log(`281 types mismatch`);
        // Types mismatch. Probably falsey result, unless comparing with
        // empty/blank things. Let's check.
        // it might be blank array vs blank object:
        if (
          !(
            empty((b as AnyObject)[sKey]) &&
            empty((s as AnyObject)[sKey]) &&
            opts.hungryForWhitespace
          )
        ) {
          if (!opts.verboseWhenMismatches) {
            DEV && console.log(`293 return false`);
            return false;
          }
          DEV && console.log(`296 return`);
          return `The given key ${sKey} is of a different type on both objects. On the first-one, it's ${typeDetect(
            (s as AnyObject)[sKey]
          )}, on the second-one, it's ${typeDetect((b as AnyObject)[sKey])}`;
        }
      } else if (
        compare((b as AnyObject)[sKey], (s as AnyObject)[sKey], opts) !== true
      ) {
        DEV && console.log(`304 case #3. - recursion returned false`);
        DEV &&
          console.log(
            `307 ██ ${`\u001b[${33}m${`b[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
              (b as AnyObject)[sKey],
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `315 ██ ${`\u001b[${33}m${`s[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
              (s as AnyObject)[sKey],
              null,
              4
            )}`
          );
        DEV && console.log(`321 so key does exist and type matches`);
        if (!opts.verboseWhenMismatches) {
          DEV && console.log(`323 return false`);
          return false;
        }
        DEV && console.log(`326 return`);
        return `The given piece ${JSON.stringify(
          (s as AnyObject)[sKey],
          null,
          4
        )} and ${JSON.stringify((b as AnyObject)[sKey], null, 4)} don't match.`;
      }
      DEV && console.log(`333 end reached, case #4.`);
    }
  } else {
    DEV && console.log(`336 else clauses`);
    if (
      opts.hungryForWhitespace &&
      empty(b) &&
      empty(s) &&
      (!opts.matchStrictly || (opts.matchStrictly && isBlank(s)))
    ) {
      DEV && console.log(`343 return true`);
      return true;
    }
    DEV && console.log(`346 return ${b === s}`);
    return b === s;
  }
  DEV && console.log(`349 return true`);
  return true;
}

export { compare };

import typeDetect from "type-detect";
import empty from "ast-contains-only-empty-space";
import matcher from "matcher";

// -----------------------------------------------------------------------------

const isArr = Array.isArray;

function existy(x) {
  return x != null;
}
function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isBool(something) {
  return typeof something === "boolean";
}
function isNull(something) {
  return something === null;
}
function isBlank(something) {
  if (isObj(something)) {
    return Object.keys(something).length === 0;
  } else if (isArr(something) || isStr(something)) {
    return something.length === 0;
  }
  return false;
}
function isTheTypeLegit(something) {
  // same as JSON spec:
  return (
    isObj(something) ||
    isStr(something) ||
    isNum(something) ||
    isBool(something) ||
    isArr(something) ||
    isNull(something)
  );
}

// -----------------------------------------------------------------------------

// bo = bigObject original; so = smallObject original
function compare(b, s, originalOpts) {
  console.log(" \n███████████████████████████████████████\n ");
  console.log(`054 compare() CALLED`);
  if (b === undefined) {
    throw new TypeError(
      "ast-compare/compare(): [THROW_ID_01] first argument is missing!"
    );
  }
  if (s === undefined) {
    throw new TypeError(
      "ast-compare/compare(): [THROW_ID_02] second argument is missing!"
    );
  }

  if (existy(b) && !isTheTypeLegit(b)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_03] first input argument is of a wrong type, ${typeDetect(
        b
      )}, equal to: ${JSON.stringify(b, null, 4)}`
    );
  }
  if (existy(s) && !isTheTypeLegit(s)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_04] second input argument is of a wrong type, ${typeDetect(
        s
      )}, equal to: ${JSON.stringify(s, null, 4)}`
    );
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError(
      `ast-compare/compare(): [THROW_ID_05] third argument, options object, must, well, be an object! Currently it's: ${typeDetect(
        originalOpts
      )} and equal to: ${JSON.stringify(originalOpts, null, 4)}`
    );
  }

  let sKeys;
  let bKeys;
  let found;
  let bOffset = 0;

  // prep opts
  const defaults = {
    hungryForWhitespace: false,
    matchStrictly: false,
    verboseWhenMismatches: false,
    useWildcards: false,
  };
  const opts = Object.assign({}, defaults, originalOpts);
  console.log(
    `102 compare(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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
    !Object.keys(s).length
  ) {
    console.log(`118 return true`);
    return true;
  }

  // instant (falsey) result
  if (
    ((!opts.hungryForWhitespace ||
      (opts.hungryForWhitespace && !empty(b) && empty(s))) &&
      isObj(b) &&
      Object.keys(b).length !== 0 &&
      isObj(s) &&
      Object.keys(s).length === 0) ||
    (typeDetect(b) !== typeDetect(s) &&
      (!opts.hungryForWhitespace || (opts.hungryForWhitespace && !empty(b))))
  ) {
    console.log(`133 return false`);
    return false;
  }

  // A C T I O N

  if (isStr(b) && isStr(s)) {
    console.log(
      `141 ${`\u001b[${33}m${`big`}\u001b[${39}m`}: ${JSON.stringify(
        b,
        null,
        4
      )} (empty: ${empty(b)})`
    );
    console.log(
      `148 ${`\u001b[${33}m${`small`}\u001b[${39}m`}: ${JSON.stringify(
        s,
        null,
        4
      )} (empty: ${empty(s)})`
    );
    if (opts.hungryForWhitespace && empty(b) && empty(s)) {
      console.log(
        `156 ${`\u001b[${32}m${`return true, both empty`}\u001b[${39}m`}`
      );
      return true;
    }
    if (opts.verboseWhenMismatches) {
      console.log(`161 return ${b === s}`);
      return b === s
        ? true
        : `Given string ${s} is not matched! We have ${b} on the other end.`;
    }
    console.log(
      `167 return ${
        opts.useWildcards
          ? matcher.isMatch(b, s, { caseSensitive: true })
          : b === s
      }`
    );
    return opts.useWildcards
      ? matcher.isMatch(b, s, { caseSensitive: true })
      : b === s;
  } else if (isArr(b) && isArr(s)) {
    console.log(`177 both arrays`);
    if (
      opts.hungryForWhitespace &&
      empty(s) &&
      (!opts.matchStrictly || (opts.matchStrictly && b.length === s.length))
    ) {
      console.log(`183 return true`);
      return true;
    }
    if (
      (!opts.hungryForWhitespace && s.length > b.length) ||
      (opts.matchStrictly && s.length !== b.length)
    ) {
      if (!opts.verboseWhenMismatches) {
        console.log(`191 return false`);
        return false;
      }
      console.log(`194 return`);
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
        console.log(`205 return true`);
        return true;
      }
      // so b is not zero-long, but s is.
      if (opts.verboseWhenMismatches) {
        console.log(`210 return`);
        return `The given array has no elements, but the array on the other end, ${JSON.stringify(
          b,
          null,
          4
        )} does have some`;
      }
      console.log(`217 return false`);
      return false;
    }
    for (let i = 0, sLen = s.length; i < sLen; i++) {
      found = false;
      for (let j = bOffset, bLen = b.length; j < bLen; j++) {
        bOffset += 1;
        console.log(`224 enter recursion`);
        if (compare(b[j], s[i], opts) === true) {
          found = true;
          break;
        }
      }
      if (!found) {
        if (!opts.verboseWhenMismatches) {
          console.log(`232 return false`);
          return false;
        }
        console.log(`235 return`);
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
    sKeys = new Set(Object.keys(s));
    bKeys = new Set(Object.keys(b));
    if (opts.matchStrictly && sKeys.size !== bKeys.size) {
      if (!opts.verboseWhenMismatches) {
        console.log(`252 return false`);
        return false;
      }
      const uniqueKeysOnS = new Set([...sKeys].filter((x) => !bKeys.has(x)));
      const sMessage = uniqueKeysOnS.size
        ? ` First object has unique keys: ${JSON.stringify(
            uniqueKeysOnS,
            null,
            4
          )}.`
        : "";

      const uniqueKeysOnB = new Set([...bKeys].filter((x) => !sKeys.has(x)));
      const bMessage = uniqueKeysOnB.size
        ? ` Second object has unique keys:
        ${JSON.stringify(uniqueKeysOnB, null, 4)}.`
        : "";

      console.log(`270 return`);
      return `When matching strictly, we found that both objects have different amount of keys.${sMessage}${bMessage}`;
    }

    console.log(`274 ${`\u001b[${36}m${`LOOP`}\u001b[${39}m`}`);
    for (const sKey of sKeys) {
      console.log(`276 ${`\u001b[${35}m${`sKey = ${sKey}`}\u001b[${39}m`}`);
      // if (!existy(b[sKey])) {
      if (!Object.prototype.hasOwnProperty.call(b, sKey)) {
        console.log(`279 case #1.`);
        if (!opts.useWildcards || (opts.useWildcards && !sKey.includes("*"))) {
          if (!opts.verboseWhenMismatches) {
            console.log(`282 return false`);
            return false;
          }
          console.log(`285 return`);
          return `The given object has key "${sKey}" which the other-one does not have.`;
        } // so wildcards are on and sKeys[i] contains a wildcard
        else if (
          Object.keys(b).some((bKey) =>
            matcher.isMatch(bKey, sKey, { caseSensitive: true })
          )
        ) {
          // so some keys do match. Return true
          console.log(`294 return true`);
          return true;
        }
        if (!opts.verboseWhenMismatches) {
          console.log(`298 return false`);
          return false;
        }
        console.log(`301 return`);
        return `The given object has key "${sKey}" which the other-one does not have.`;
      } else if (
        existy(b[sKey]) &&
        typeDetect(b[sKey]) !== typeDetect(s[sKey])
      ) {
        console.log(`307 case #2.`);
        console.log(`308 types mismatch`);
        // Types mismatch. Probably falsey result, unless comparing with
        // empty/blank things. Let's check.
        // it might be blank array vs blank object:
        if (!(empty(b[sKey]) && empty(s[sKey]) && opts.hungryForWhitespace)) {
          if (!opts.verboseWhenMismatches) {
            console.log(`314 return false`);
            return false;
          }
          console.log(`317 return`);
          return `The given key ${sKey} is of a different type on both objects. On the first-one, it's ${typeDetect(
            s[sKey]
          )}, on the second-one, it's ${typeDetect(b[sKey])}`;
        }
      } else if (compare(b[sKey], s[sKey], opts) !== true) {
        console.log(`323 case #3. - recursion returned false`);
        console.log(
          `325 ██ ${`\u001b[${33}m${`b[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
            b[sKey],
            null,
            4
          )}`
        );
        console.log(
          `332 ██ ${`\u001b[${33}m${`s[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
            s[sKey],
            null,
            4
          )}`
        );
        console.log(`338 so key does exist and type matches`);
        if (!opts.verboseWhenMismatches) {
          console.log(`340 return false`);
          return false;
        }
        console.log(`343 return`);
        return `The given piece ${JSON.stringify(
          s[sKey],
          null,
          4
        )} and ${JSON.stringify(b[sKey], null, 4)} don't match.`;
      }
      console.log(`350 end reached, case #4.`);
    }
  } else {
    console.log(`353 else clauses`);
    if (
      opts.hungryForWhitespace &&
      empty(b) &&
      empty(s) &&
      (!opts.matchStrictly || (opts.matchStrictly && isBlank(s)))
    ) {
      console.log(`360 return true`);
      return true;
    }
    console.log(`363 return ${b === s}`);
    return b === s;
  }
  console.log(`366 return true`);
  return true;
}

export default compare;

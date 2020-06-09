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
/* istanbul ignore next */
function isBlank(something) {
  if (isObj(something)) {
    return !Object.keys(something).length;
  }
  if (isArr(something) || isStr(something)) {
    return !something.length;
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
  console.log(`056 compare() CALLED`);
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
  const opts = { ...defaults, ...originalOpts };
  console.log(
    `104 compare(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(`120 return true`);
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
    console.log(`135 return false`);
    return false;
  }

  // A C T I O N

  if (isStr(b) && isStr(s)) {
    console.log(
      `143 ${`\u001b[${33}m${`big`}\u001b[${39}m`}: ${JSON.stringify(
        b,
        null,
        4
      )} (empty: ${empty(b)})`
    );
    console.log(
      `150 ${`\u001b[${33}m${`small`}\u001b[${39}m`}: ${JSON.stringify(
        s,
        null,
        4
      )} (empty: ${empty(s)})`
    );
    if (opts.hungryForWhitespace && empty(b) && empty(s)) {
      console.log(
        `158 ${`\u001b[${32}m${`return true, both empty`}\u001b[${39}m`}`
      );
      return true;
    }
    if (opts.verboseWhenMismatches) {
      console.log(`163 return ${b === s}`);
      return b === s
        ? true
        : `Given string ${s} is not matched! We have ${b} on the other end.`;
    }
    console.log(
      `169 return ${
        opts.useWildcards
          ? matcher.isMatch(b, s, { caseSensitive: true })
          : b === s
      }`
    );
    return opts.useWildcards
      ? matcher.isMatch(b, s, { caseSensitive: true })
      : b === s;
  }
  if (isArr(b) && isArr(s)) {
    console.log(`180 both arrays`);
    if (
      opts.hungryForWhitespace &&
      empty(s) &&
      (!opts.matchStrictly || (opts.matchStrictly && b.length === s.length))
    ) {
      console.log(`186 return true`);
      return true;
    }
    if (
      (!opts.hungryForWhitespace && s.length > b.length) ||
      (opts.matchStrictly && s.length !== b.length)
    ) {
      if (!opts.verboseWhenMismatches) {
        console.log(`194 return false`);
        return false;
      }
      console.log(`197 return`);
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
        console.log(`208 return true`);
        return true;
      }
      // so b is not zero-long, but s is.
      if (opts.verboseWhenMismatches) {
        console.log(`213 return`);
        return `The given array has no elements, but the array on the other end, ${JSON.stringify(
          b,
          null,
          4
        )} does have some`;
      }
      console.log(`220 return false`);
      return false;
    }
    for (let i = 0, sLen = s.length; i < sLen; i++) {
      found = false;
      for (let j = bOffset, bLen = b.length; j < bLen; j++) {
        bOffset += 1;
        console.log(`227 enter recursion`);
        if (compare(b[j], s[i], opts) === true) {
          found = true;
          break;
        }
      }
      if (!found) {
        if (!opts.verboseWhenMismatches) {
          console.log(`235 return false`);
          return false;
        }
        console.log(`238 return`);
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
        console.log(`255 return false`);
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

      console.log(`273 return`);
      return `When matching strictly, we found that both objects have different amount of keys.${sMessage}${bMessage}`;
    }

    console.log(`277 ${`\u001b[${36}m${`LOOP`}\u001b[${39}m`}`);

    // eslint-disable-next-line
    for (const sKey of sKeys) {
      console.log(`281 ${`\u001b[${35}m${`sKey = ${sKey}`}\u001b[${39}m`}`);
      // if (!existy(b[sKey])) {
      if (!Object.prototype.hasOwnProperty.call(b, sKey)) {
        console.log(`284 case #1.`);
        if (!opts.useWildcards || (opts.useWildcards && !sKey.includes("*"))) {
          if (!opts.verboseWhenMismatches) {
            console.log(`287 return false`);
            return false;
          }
          console.log(`290 return`);
          return `The given object has key "${sKey}" which the other-one does not have.`;
        }
        // so wildcards are on and sKeys[i] contains a wildcard
        if (
          Object.keys(b).some((bKey) =>
            matcher.isMatch(bKey, sKey, { caseSensitive: true })
          )
        ) {
          // so some keys do match. Return true
          console.log(`300 return true`);
          return true;
        }
        if (!opts.verboseWhenMismatches) {
          console.log(`304 return false`);
          return false;
        }
        console.log(`307 return`);
        return `The given object has key "${sKey}" which the other-one does not have.`;
      }
      if (existy(b[sKey]) && typeDetect(b[sKey]) !== typeDetect(s[sKey])) {
        console.log(`311 case #2.`);
        console.log(`312 types mismatch`);
        // Types mismatch. Probably falsey result, unless comparing with
        // empty/blank things. Let's check.
        // it might be blank array vs blank object:
        if (!(empty(b[sKey]) && empty(s[sKey]) && opts.hungryForWhitespace)) {
          if (!opts.verboseWhenMismatches) {
            console.log(`318 return false`);
            return false;
          }
          console.log(`321 return`);
          return `The given key ${sKey} is of a different type on both objects. On the first-one, it's ${typeDetect(
            s[sKey]
          )}, on the second-one, it's ${typeDetect(b[sKey])}`;
        }
      } else if (compare(b[sKey], s[sKey], opts) !== true) {
        console.log(`327 case #3. - recursion returned false`);
        console.log(
          `329 ██ ${`\u001b[${33}m${`b[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
            b[sKey],
            null,
            4
          )}`
        );
        console.log(
          `336 ██ ${`\u001b[${33}m${`s[sKey]`}\u001b[${39}m`} = ${JSON.stringify(
            s[sKey],
            null,
            4
          )}`
        );
        console.log(`342 so key does exist and type matches`);
        if (!opts.verboseWhenMismatches) {
          console.log(`344 return false`);
          return false;
        }
        console.log(`347 return`);
        return `The given piece ${JSON.stringify(
          s[sKey],
          null,
          4
        )} and ${JSON.stringify(b[sKey], null, 4)} don't match.`;
      }
      console.log(`354 end reached, case #4.`);
    }
  } else {
    console.log(`357 else clauses`);
    if (
      opts.hungryForWhitespace &&
      empty(b) &&
      empty(s) &&
      (!opts.matchStrictly || (opts.matchStrictly && isBlank(s)))
    ) {
      console.log(`364 return true`);
      return true;
    }
    console.log(`367 return ${b === s}`);
    return b === s;
  }
  console.log(`370 return true`);
  return true;
}

export default compare;

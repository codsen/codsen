import clone from "lodash.clonedeep";
import pullAll from "lodash.pullall";
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
    useWildcards: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
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
    Object.keys(s).length === 0
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
  } else if (isArr(b) && isArr(s)) {
    console.log(`179 both arrays`);
    if (
      opts.hungryForWhitespace &&
      empty(s) &&
      (!opts.matchStrictly || (opts.matchStrictly && b.length === s.length))
    ) {
      console.log(`185 return true`);
      return true;
    }
    if (
      (!opts.hungryForWhitespace && s.length > b.length) ||
      (opts.matchStrictly && s.length !== b.length)
    ) {
      if (!opts.verboseWhenMismatches) {
        console.log(`193 return false`);
        return false;
      }
      console.log(`196 return`);
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
        console.log(`207 return true`);
        return true;
      }
      // so b is not zero-long, but s is.
      if (opts.verboseWhenMismatches) {
        console.log(`212 return`);
        return `The given array has no elements, but the array on the other end, ${JSON.stringify(
          b,
          null,
          4
        )} does have some`;
      }
      console.log(`219 return false`);
      return false;
    }
    for (let i = 0, sLen = s.length; i < sLen; i++) {
      found = false;
      for (let j = bOffset, bLen = b.length; j < bLen; j++) {
        bOffset += 1;
        console.log(`226 enter recursion`);
        if (compare(b[j], s[i], opts) === true) {
          found = true;
          break;
        }
      }
      if (!found) {
        if (!opts.verboseWhenMismatches) {
          console.log(`234 return false`);
          return false;
        }
        console.log(`237 return`);
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
    sKeys = Object.keys(s);
    bKeys = Object.keys(b);
    if (opts.matchStrictly && sKeys.length !== bKeys.length) {
      if (!opts.verboseWhenMismatches) {
        console.log(`254 return false`);
        return false;
      }
      const uniqueKeysOnS = pullAll(clone(sKeys), clone(bKeys));
      const sMessage =
        uniqueKeysOnS.length > 0
          ? `First object has unique keys: ${JSON.stringify(
              uniqueKeysOnS,
              null,
              4
            )}.`
          : "";

      const uniqueKeysOnB = pullAll(clone(bKeys), clone(sKeys));
      const bMessage =
        uniqueKeysOnB.length > 0
          ? `Second object has unique keys:
        ${JSON.stringify(uniqueKeysOnB, null, 4)}.`
          : "";

      console.log(`274 return`);
      return `When matching strictly, we found that both objects have different amount of keys. ${sMessage} ${bMessage}`;
    }

    console.log(`278 ${`\u001b[${36}m${`LOOP`}\u001b[${39}m`}`);
    for (let i = 0, len = sKeys.length; i < len; i++) {
      console.log(
        `281 ${`\u001b[${35}m${`bKeys[${i}] = ${JSON.stringify(
          bKeys[i],
          null,
          4
        )}`}\u001b[${39}m`}`
      );
      console.log(
        `288 ${`\u001b[${35}m${`sKeys[${i}] = ${JSON.stringify(
          sKeys[i],
          null,
          4
        )}`}\u001b[${39}m`}`
      );
      if (!existy(b[sKeys[i]])) {
        console.log(`295 case #1.`);
        if (
          !opts.useWildcards ||
          (opts.useWildcards && !sKeys[i].includes("*"))
        ) {
          if (!opts.verboseWhenMismatches) {
            console.log(`301 return false`);
            return false;
          }
          console.log(`304 return`);
          return `The given object has key ${sKeys[i]} which the other-one does not have.`;
        } // so wildcards are on and sKeys[i] contains a wildcard
        else if (
          Object.keys(b).some(bKey =>
            matcher.isMatch(bKey, sKeys[i], { caseSensitive: true })
          )
        ) {
          // so some keys do match. Return true
          console.log(`313 return true`);
          return true;
        }
        if (!opts.verboseWhenMismatches) {
          console.log(`317 return false`);
          return false;
        }
        console.log(`320 return`);
        return `The given object has key ${sKeys[i]} which the other-one does not have.`;
      } else if (b[sKeys[i]] !== undefined && !isTheTypeLegit(b[sKeys[i]])) {
        console.log(`323 case #2.`);
        throw new TypeError(
          `ast-compare/compare(): [THROW_ID_07] The input ${JSON.stringify(
            b,
            null,
            4
          )} contains a value of a wrong type, ${typeDetect(
            b[sKeys[i]]
          )} at index ${i}, equal to: ${JSON.stringify(b[sKeys[i]], null, 4)}`
        );
      } else if (!isTheTypeLegit(s[sKeys[i]])) {
        console.log(`334 case #3.`);
        throw new TypeError(
          `ast-compare/compare(): [THROW_ID_08] The input ${JSON.stringify(
            s,
            null,
            4
          )} contains a value of a wrong type, ${typeDetect(
            s[sKeys[i]]
          )} at index ${i}, equal to: ${JSON.stringify(s[sKeys[i]], null, 4)}`
        );
      } else if (
        existy(b[sKeys[i]]) &&
        typeDetect(b[sKeys[i]]) !== typeDetect(s[sKeys[i]])
      ) {
        console.log(`348 case #3.`);
        console.log(`349 types mismatch`);
        // Types mismatch. Probably falsey result, unless comparing with
        // empty/blank things. Let's check.
        // it might be blank array vs blank object:
        if (
          !(
            empty(b[sKeys[i]]) &&
            empty(s[sKeys[i]]) &&
            opts.hungryForWhitespace
          )
        ) {
          if (!opts.verboseWhenMismatches) {
            console.log(`361 return false`);
            return false;
          }
          console.log(`364 return`);
          return `The given key ${
            sKeys[i]
          } is of a different type on both objects. On the first-one, it's ${typeDetect(
            s[sKeys[i]]
          )}, on the second-one, it's ${typeDetect(b[sKeys[i]])}`;
        }
      } else if (compare(b[sKeys[i]], s[sKeys[i]], opts) !== true) {
        console.log(`372 case #4. - recursion returned false`);
        console.log(
          `374 ██ ${`\u001b[${33}m${`b[sKeys[${i}]]`}\u001b[${39}m`} = ${JSON.stringify(
            b[sKeys[i]],
            null,
            4
          )}`
        );
        console.log(
          `381 ██ ${`\u001b[${33}m${`s[sKeys[${i}]]`}\u001b[${39}m`} = ${JSON.stringify(
            s[sKeys[i]],
            null,
            4
          )}`
        );
        console.log(`387 so key does exist and type matches`);
        if (!opts.verboseWhenMismatches) {
          console.log(`389 return false`);
          return false;
        }
        console.log(`392 return`);
        return `The given piece ${JSON.stringify(
          s[sKeys[i]],
          null,
          4
        )} and ${JSON.stringify(b[sKeys[i]], null, 4)} don't match.`;
      }
      console.log(`399 end reached, #5.`);
    }
  } else {
    console.log(`402 else clauses`);
    if (
      opts.hungryForWhitespace &&
      empty(b) &&
      empty(s) &&
      (!opts.matchStrictly || (opts.matchStrictly && isBlank(s)))
    ) {
      console.log(`409 return true`);
      return true;
    }
    console.log(`412 return ${b === s}`);
    return b === s;
  }
  console.log(`415 return true`);
  return true;
}

export default compare;

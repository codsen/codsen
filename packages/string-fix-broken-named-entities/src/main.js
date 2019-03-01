import rangesMerge from "ranges-merge";
import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";

/**
 * stringFixBrokenNamedEntities - fixes broken named HTML entities
 *
 * @param  {string} inputString
 * @return {array}  ranges array OR null
 */
function stringFixBrokenNamedEntities(str, originalOpts) {
  console.log(
    `014 ${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
      originalOpts,
      null,
      4
    )}`
  );
  function isNotaLetter(str) {
    return !(
      typeof str === "string" &&
      str.length === 1 &&
      str.toUpperCase() !== str.toLowerCase()
    );
  }

  // insurance:
  if (typeof str !== "string") {
    throw new Error(
      `string-fix-broken-named-entities: [THROW_ID_01] the first input argument must be string! It was given as:\n${JSON.stringify(
        str,
        null,
        4
      )} (${typeof str}-type)`
    );
  }
  const defaults = {
    decode: false,
    cb: null,
    progressFn: null
  };
  let opts;

  if (originalOpts != null) {
    if (!isObj(originalOpts)) {
      throw new Error(
        `string-fix-broken-named-entities: [THROW_ID_02] the second input argument must be a plain object! I was given as:\n${JSON.stringify(
          originalOpts,
          null,
          4
        )} (${typeof originalOpts}-type)`
      );
    } else {
      opts = Object.assign({}, defaults, originalOpts);
      console.log(
        `057 new ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
    }
  } else {
    opts = defaults;
  }
  if (opts.cb && typeof opts.cb !== "function") {
    throw new TypeError(
      `string-fix-broken-named-entities: [THROW_ID_03] opts.cb must be a function (or falsey)! Currently it's: ${typeof opts.cb}, equal to: ${JSON.stringify(
        opts.cb,
        null,
        4
      )}`
    );
  }
  if (opts.progressFn && typeof opts.progressFn !== "function") {
    throw new TypeError(
      `string-fix-broken-named-entities: [THROW_ID_04] opts.progressFn must be a function (or falsey)! Currently it's: ${typeof opts.progressFn}, equal to: ${JSON.stringify(
        opts.progressFn,
        null,
        4
      )}`
    );
  }

  // state flags

  // this one is to mark the exception when current character is not ampersand
  // where should be one, but it is not necessary to add an ampersand here.
  // For example, there was ampersand and bunch of rubbish in between it and
  // current character. Current character should have ampersand in front of it.
  // We don't add one though, because we consult with this flag.
  let state_AmpersandNotNeeded = false;

  // markers:
  // define defaults so that we can reset to objects with keys, not empty objects

  // * nbsp tracking:
  const nbspDefault = {
    nameStartsAt: null, // when we'll insert range, we'll use this or "this - 1"
    ampersandNecessary: null, // default is not Boolean, to mark the state it needs tending
    patience: 2, // one letter can be omitted from name
    matchedN: null, // set the index of the first catch
    matchedB: null, // set the index of the first catch
    matchedS: null, // set the index of the first catch
    matchedP: null, // set the index of the first catch
    matchedSemicol: null // set the index of the first catch
  };
  let nbsp = clone(nbspDefault);
  const nbspWipe = () => {
    nbsp = clone(nbspDefault);
  };

  // this is what we'll eventually return (or null):
  const rangesArr = [];

  let smallestCharFromTheSetAt;
  let largestCharFromTheSetAt;
  let matchedLettersCount;
  let setOfValues;
  let percentageDone;
  let lastPercentageDone;

  // allocate all 100 of progress to the main loop below
  const len = str.length + 1;
  let counter = 0;

  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //              T   H   E       L   O   O   P       S  T  A  R  T  S
  //                                      |
  //                                      |
  //                                 \    |     /
  //                                  \   |    /
  //                                   \  |   /
  //                                    \ |  /
  //                                     \| /
  //                                      V

  // differently from regex-based approach, we aim to traverse the string only once:
  outerloop: for (let i = 0; i < len; i++) {
    if (opts.progressFn) {
      percentageDone = Math.floor((counter / len) * 100);
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    //            |
    //            |
    //            |
    //            |
    //            |
    // PART 1. FRONTAL LOGGING
    //            |
    //            |
    //            |
    //            |
    //            |
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${`\u001b[${31}m${
        str[i]
          ? str[i].trim() === ""
            ? str[i] === null
              ? "null"
              : str[i] === "\n"
              ? "line break"
              : str[i] === "\t"
              ? "tab"
              : str[i] === " "
              ? "space"
              : "???"
            : str[i]
          : "undefined"
      }\u001b[${39}m`}`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m`
    );

    //            |
    //            |
    //            |
    //            |
    //            |
    // PART 3. RULES AT THE TOP
    //            |
    //            |
    //            |
    //            |
    //            |

    // Catch ending of an nbsp (or messed up set of its characters)
    // It's the character after semicolon or whatever is the last when semicolon
    // itself is missing.

    matchedLettersCount =
      (nbsp.matchedN !== null ? 1 : 0) +
      (nbsp.matchedB !== null ? 1 : 0) +
      (nbsp.matchedS !== null ? 1 : 0) +
      (nbsp.matchedP !== null ? 1 : 0);

    setOfValues = [
      nbsp.matchedN,
      nbsp.matchedB,
      nbsp.matchedS,
      nbsp.matchedP
    ].filter(val => val !== null);
    smallestCharFromTheSetAt = Math.min(...setOfValues);
    largestCharFromTheSetAt = Math.max(...setOfValues);
    console.log(
      `${`\u001b[${33}m${`smallestCharFromTheSetAt`}\u001b[${39}m`} = ${JSON.stringify(
        smallestCharFromTheSetAt,
        null,
        4
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`largestCharFromTheSetAt`}\u001b[${39}m`} = ${JSON.stringify(
        largestCharFromTheSetAt,
        null,
        4
      )}`
    );

    // in principle, there has to be either ampersand or semicolon on an entity.
    // There are requirements for the length between characters of a set n-b-s-p.
    // If both ampersand and semicolon is missing, on both sides there must be a
    // non-letter.

    // largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4
    if (
      nbsp.nameStartsAt !== null &&
      matchedLettersCount > 2 &&
      (nbsp.matchedSemicol !== null ||
        !nbsp.ampersandNecessary ||
        ((isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[i])) ||
          ((isNotaLetter(str[nbsp.nameStartsAt - 1]) || isNotaLetter(str[i])) &&
            largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4) ||
          (nbsp.matchedN !== null &&
            nbsp.matchedB !== null &&
            nbsp.matchedS !== null &&
            nbsp.matchedP !== null &&
            nbsp.matchedN + 1 === nbsp.matchedB &&
            nbsp.matchedB + 1 === nbsp.matchedS &&
            nbsp.matchedS + 1 === nbsp.matchedP))) &&
      (!str[i] ||
        (nbsp.matchedN !== null &&
          nbsp.matchedB !== null &&
          nbsp.matchedS !== null &&
          nbsp.matchedP !== null &&
          str[i] !== str[i - 1]) ||
        (str[i].toLowerCase() !== "n" &&
          str[i].toLowerCase() !== "b" &&
          str[i].toLowerCase() !== "s" &&
          str[i].toLowerCase() !== "p") ||
        str[i - 1] === ";") &&
      str[i] !== ";" &&
      (str[i + 1] === undefined || str[i + 1] !== ";")
    ) {
      if (str.slice(nbsp.nameStartsAt, i) !== "&nbsp;") {
        console.log(
          `234 \u001b[${32}m${`ENDING OF AN NBSP; PUSH [${
            nbsp.nameStartsAt
          }, ${i}, "&nbsp;"]`}\u001b[${39}m`
        );
        if (opts.cb) {
          rangesArr.push(
            opts.cb({
              fixName: "malformed &nbsp;",
              entityName: "nbsp",
              rangeFrom: nbsp.nameStartsAt,
              rangeTo: i,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0"
            })
          );
        } else {
          rangesArr.push([
            nbsp.nameStartsAt,
            i,
            opts.decode ? "\xA0" : "&nbsp;"
          ]);
        }
      }
      nbspWipe();
      console.log(`258 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
      continue outerloop;
    } // else {
    //   console.log(
    //     `\n\u001b[${32}m${`███████████████████████████████████████`}\u001b[${39}m`
    //   );
    //   console.log(
    //     `a1. nbsp.nameStartsAt !== null: ${nbsp.nameStartsAt !== null}`
    //   );
    //   console.log(`a2. matchedLettersCount > 2: ${matchedLettersCount > 2}`);
    //   console.log(
    //     `a3. (nbsp.matchedSemicol !== null ||...: ${nbsp.matchedSemicol !==
    //       null ||
    //       !nbsp.ampersandNecessary ||
    //       (isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[i]))}`
    //   );
    //   console.log(
    //     `a4 (!str[i] ||... :${!str[i] ||
    //       (nbsp.matchedN !== null &&
    //         nbsp.matchedB !== null &&
    //         nbsp.matchedS !== null &&
    //         nbsp.matchedP !== null &&
    //         str[i] !== str[i - 1]) ||
    //       (str[i].toLowerCase() !== "n" &&
    //         str[i].toLowerCase() !== "b" &&
    //         str[i].toLowerCase() !== "s" &&
    //         str[i].toLowerCase() !== "p")}`
    //   );
    //   console.log(`a5 str[i] !== ";": ${str[i] !== ";"}`);
    //   console.log(
    //     `a6 (str[i + 1] === undefined || str[i + 1] !== ";"): ${str[i + 1] ===
    //       undefined || str[i + 1] !== ";"}`
    //   );
    //   console.log(
    //     `\u001b[${32}m${`███████████████████████████████████████`}\u001b[${39}m\n`
    //   );
    // }

    // If semicolon was passed and tag is not closing, wipe:
    if (
      str[i] &&
      str[i - 1] === ";" &&
      str[i] !== ";" &&
      matchedLettersCount > 0
    ) {
      nbspWipe();
      console.log(`304 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
      continue outerloop;
    }

    //            |
    //            |
    //            |
    //            |
    //            |
    // PART 3. RULES AT THE MIDDLE
    //            |
    //            |
    //            |
    //            |
    //            |

    // catch ampersand
    if (str[i] === "&") {
      console.log("322 & caught");
      // 1. catch recursively-encoded cases. They're easy actually, the task will
      // be deleting sequence of repeated "amp;" between ampersand and letter.
      if (
        str[i + 1] === "a" &&
        str[i + 2] === "m" &&
        str[i + 3] === "p" &&
        str[i + 4] === ";"
      ) {
        // Mark the potential start of the nbsp. If following characters don't
        // match the nbsp pattern, we'll quickly wipe it.
        if (nbsp.nameStartsAt === null) {
          nbsp.nameStartsAt = i;
        }
        // activate the state:
        state_AmpersandNotNeeded = true;
        // catch all subsequent repetitions of "amp;"
        let endingOfAmpRepetition = i + 5;
        while (
          str[endingOfAmpRepetition] === "a" &&
          str[endingOfAmpRepetition + 1] === "m" &&
          str[endingOfAmpRepetition + 2] === "p" &&
          str[endingOfAmpRepetition + 3] === ";"
        ) {
          endingOfAmpRepetition += 4;
        }
        // after loop's ending, submit the rubbish repetitions for deletion
        if (opts.cb) {
          rangesArr.push(
            opts.cb({
              fixName: '"amp;" repetitions',
              entityName: "amp",
              rangeFrom: i + 1,
              rangeTo: endingOfAmpRepetition,
              rangeValEncoded: null,
              rangeValDecoded: null
            })
          );
        } else {
          rangesArr.push([i + 1, endingOfAmpRepetition]);
          console.log(
            `363 PUSH \u001b[${33}m${`[${i +
              1}, ${endingOfAmpRepetition}]`}\u001b[${39}m`
          );
        }
        // shift the index
        i = endingOfAmpRepetition - 1;
        continue outerloop;
      }

      // 2. mark the potential beginning of an nbsp:
      if (nbsp.nameStartsAt === null) {
        if (nbsp.ampersandNecessary === null) {
          // The check above is for not false but null because null means it's
          // not set false is set to false. Thus check can't be "if false".

          // mark the beginning
          nbsp.nameStartsAt = i;
          console.log(
            `381 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
              nbsp.nameStartsAt
            }`
          );
          nbsp.ampersandNecessary = false;
          console.log(
            `387 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
              nbsp.ampersandNecessary
            }`
          );
        }
      }

      // 3. catch some other named HTML entities without semicolons

      if (str[i + 1] === "a" && str[i + 2] === "n" && str[i + 3] === "g") {
        if (str[i + 4] !== "s" && str[i + 4] !== ";") {
          // add missing semicolon on &ang (not &angst)
          if (opts.cb) {
            rangesArr.push(
              opts.cb({
                fixName:
                  "missing semicolon on &ang; (don't confuse with &angst;)",
                entityName: "ang",
                rangeFrom: i,
                rangeTo: i + 4,
                rangeValEncoded: "&ang;",
                rangeValDecoded: "\u2220"
              })
            );
          } else {
            rangesArr.push([i, i + 4, opts.decode ? "\u2220" : "&ang;"]);
            console.log(
              `414 PUSH \u001b[${33}m${`[${i}, ${i +
                4}, "&ang;"]`}\u001b[${39}m`
            );
          }
          i += 3;
          continue outerloop;
        } else if (
          str[i + 4] === "s" &&
          str[i + 5] === "t" &&
          str[i + 6] !== ";"
        ) {
          // add missing semicolon on &angst
          if (opts.cb) {
            rangesArr.push(
              opts.cb({
                fixName:
                  "missing semicolon on &angst; (don't confuse with &ang;)",
                entityName: "angst",
                rangeFrom: i,
                rangeTo: i + 6,
                rangeValEncoded: "&angst;",
                rangeValDecoded: "\xC5"
              })
            );
          } else {
            rangesArr.push([i, i + 6, opts.decode ? "\xC5" : "&angst;"]);
            console.log(
              `441 PUSH \u001b[${33}m${`[${i}, ${i +
                6}, "&angst;"]`}\u001b[${39}m`
            );
          }
          i += 5;
          continue outerloop;
        }
      } else if (str[i + 1] === "p" && str[i + 2] === "i") {
        if (str[i + 3] !== "v" && str[i + 3] !== ";") {
          // add missing semicolon on &pi (not &piv)
          if (opts.cb) {
            rangesArr.push(
              opts.cb({
                fixName: "missing semicolon on &pi; (don't confuse with &piv;)",
                entityName: "pi",
                rangeFrom: i,
                rangeTo: i + 3,
                rangeValEncoded: "&pi;",
                rangeValDecoded: "\u03C0"
              })
            );
          } else {
            rangesArr.push([i, i + 3, opts.decode ? "\u03C0" : "&pi;"]);
            console.log(
              `465 PUSH \u001b[${33}m${`[${i}, ${i + 3}, "&pi;"]`}\u001b[${39}m`
            );
          }
          i += 3;
          continue outerloop;
        } else if (str[i + 3] === "v" && str[i + 4] !== ";") {
          // add missing semicolon on &piv
          if (opts.cb) {
            rangesArr.push(
              opts.cb({
                fixName: "missing semicolon on &piv; (don't confuse with &pi)",
                entityName: "piv",
                rangeFrom: i,
                rangeTo: i + 4,
                rangeValEncoded: "&piv;",
                rangeValDecoded: "\u03D6"
              })
            );
          } else {
            rangesArr.push([i, i + 4, opts.decode ? "\u03D6" : "&piv;"]);
            console.log(
              `486 PUSH \u001b[${33}m${`[${i}, ${i +
                4}, "&piv;"]`}\u001b[${39}m`
            );
          }
          i += 3;
          continue outerloop;
        }
      } else if (
        str[i + 1] === "P" &&
        str[i + 2] === "i" &&
        str[i + 3] !== ";"
      ) {
        // add missing semicolon on &Pi
        if (opts.cb) {
          rangesArr.push(
            opts.cb({
              fixName: "missing semicolon on &Pi; (don't confuse with &pi;)",
              entityName: "Pi",
              rangeFrom: i,
              rangeTo: i + 3,
              rangeValEncoded: "&Pi;",
              rangeValDecoded: "\u03A0"
            })
          );
        } else {
          rangesArr.push([i, i + 3, opts.decode ? "\u03A0" : "&Pi;"]);
          console.log(
            `513 PUSH \u001b[${33}m${`[${i}, ${i + 3}, "&Pi;"]`}\u001b[${39}m`
          );
        }
        i += 2;
        continue outerloop;
      } else if (str[i + 1] === "s") {
        if (
          str[i + 2] === "i" &&
          str[i + 3] === "g" &&
          str[i + 4] === "m" &&
          str[i + 5] === "a" &&
          str[i + 6] !== ";" &&
          str[i + 6] !== "f"
        ) {
          // add missing semicolon on &sigma (not &sigmaf)
          if (opts.cb) {
            rangesArr.push(
              opts.cb({
                fixName:
                  "missing semicolon on &sigma; (don't confuse with &sigmaf;)",
                entityName: "sigma",
                rangeFrom: i,
                rangeTo: i + 6,
                rangeValEncoded: "&sigma;",
                rangeValDecoded: "\u03C3"
              })
            );
          } else {
            rangesArr.push([i, i + 6, opts.decode ? "\u03C3" : "&sigma;"]);
            console.log(
              `543 PUSH \u001b[${33}m${`[${i}, ${i +
                6}, "&sigma;"]`}\u001b[${39}m`
            );
          }
          i += 5;
          continue outerloop;
        } else if (
          str[i + 2] === "u" &&
          str[i + 3] === "b" &&
          str[i + 4] !== ";" &&
          str[i + 4] !== "e"
        ) {
          // add missing semicolon on &sub (not &sube)
          if (opts.cb) {
            rangesArr.push(
              opts.cb({
                fixName:
                  "missing semicolon on &sub; (don't confuse with &sube;)",
                entityName: "sub",
                rangeFrom: i,
                rangeTo: i + 4,
                rangeValEncoded: "&sub;",
                rangeValDecoded: "\u2282"
              })
            );
          } else {
            rangesArr.push([i, i + 4, opts.decode ? "\u2282" : "&sub;"]);
            console.log(
              `571 PUSH \u001b[${33}m${`[${i}, ${i +
                4}, "&sub;"]`}\u001b[${39}m`
            );
          }
          i += 3;
          continue outerloop;
        } else if (
          str[i + 2] === "u" &&
          str[i + 3] === "p" &&
          str[i + 4] !== "f" &&
          str[i + 4] !== "e" &&
          str[i + 4] !== "1" &&
          str[i + 4] !== "2" &&
          str[i + 4] !== "3" &&
          str[i + 4] !== ";"
        ) {
          // add missing semicolon on &sup (not &supf, &supe, &sup1, &sup2 or &sup3)
          if (opts.cb) {
            rangesArr.push(
              opts.cb({
                fixName:
                  "missing semicolon on &sup; (don't confuse with &supf;, &supe;, &sup1;, &sup2; or &sup3;)",
                entityName: "sup",
                rangeFrom: i,
                rangeTo: i + 4,
                rangeValEncoded: "&sup;",
                rangeValDecoded: "\u2283"
              })
            );
          } else {
            rangesArr.push([i, i + 4, opts.decode ? "\u2283" : "&sup;"]);
            console.log(
              `603 PUSH \u001b[${33}m${`[${i}, ${i +
                4}, "&sup;"]`}\u001b[${39}m`
            );
          }
          i += 3;
          continue outerloop;
        }
      } else if (str[i + 1] === "t") {
        if (
          str[i + 2] === "h" &&
          str[i + 3] === "e" &&
          str[i + 4] === "t" &&
          str[i + 5] === "a" &&
          str[i + 6] !== "s" &&
          str[i + 6] !== ";"
        ) {
          // &theta (not &thetasym) without semicol
          if (opts.cb) {
            rangesArr.push(
              opts.cb({
                fixName:
                  "missing semicolon on &theta; (don't confuse with &thetasym;)",
                entityName: "theta",
                rangeFrom: i,
                rangeTo: i + 6,
                rangeValEncoded: "&theta;",
                rangeValDecoded: "\u03B8"
              })
            );
          } else {
            rangesArr.push([i, i + 6, opts.decode ? "\u03B8" : "&theta;"]);
            console.log(
              `635 PUSH \u001b[${33}m${`[${i}, ${i +
                6}, "&theta;"]`}\u001b[${39}m`
            );
          }
          i += 5;
          continue outerloop;
        } else if (
          str[i + 2] === "h" &&
          str[i + 3] === "i" &&
          str[i + 4] === "n" &&
          str[i + 5] === "s" &&
          str[i + 6] === "p" &&
          str[i + 7] !== ";"
        ) {
          // &thinsp without semicol
          if (opts.cb) {
            rangesArr.push(
              opts.cb({
                fixName: "missing semicolon on &thinsp;",
                entityName: "thinsp",
                rangeFrom: i,
                rangeTo: i + 7,
                rangeValEncoded: "&thinsp;",
                rangeValDecoded: "\u2009"
              })
            );
          } else {
            rangesArr.push([i, i + 7, opts.decode ? "\u2009" : "&thinsp;"]);
            console.log(
              `664 PUSH \u001b[${33}m${`[${i}, ${i +
                7}, "&thinsp;"]`}\u001b[${39}m`
            );
          }
          i += 6;
          continue outerloop;
        }
      }
    }

    // catch "n"
    if (str[i] && str[i].toLowerCase() === "n") {
      // failsafe
      if (str[i - 1] === "i" && str[i + 1] === "s") {
        console.log("678 pattern ...ins... detected - bail");
        nbspWipe();
        continue outerloop;
      }

      // action
      console.log("684 n caught");
      nbsp.matchedN = i;
      if (nbsp.nameStartsAt === null) {
        // 1. mark it
        nbsp.nameStartsAt = i;
        console.log(
          `690 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        // 2. tend the ampersand situation
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          // if by now there are signs of ampersand records, it must be added later:
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          // in all other cases, set it as not needed
          nbsp.ampersandNecessary = false;
        }
        console.log(
          `703 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
            nbsp.ampersandNecessary
          }`
        );
      }
    }

    // catch "b"
    if (str[i] && str[i].toLowerCase() === "b") {
      console.log("712 b caught");
      if (nbsp.nameStartsAt !== null) {
        // clean code, N was already detected
        nbsp.matchedB = i;
        console.log(
          `717 SET ${`\u001b[${33}m${`nbsp.matchedB`}\u001b[${39}m`} = ${
            nbsp.matchedB
          }`
        );
      } else if (nbsp.patience) {
        // dirty code case because ampersand or "n" are missing so far

        // 1. Patience is reduced for every single character missing. There can
        // be only one character missing out of n-b-s-p.
        nbsp.patience--;
        console.log(
          `728 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );

        // 2. mark the start
        nbsp.nameStartsAt = i;
        console.log(
          `736 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedB = i;
        console.log(
          `742 SET ${`\u001b[${33}m${`nbsp.matchedB`}\u001b[${39}m`} = true`
        );

        // 3. tend the ampersand situation
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          // if by now there are signs of ampersand records, it must be added later:
          nbsp.ampersandNecessary = true;
          console.log(
            `750 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          // in all other cases, set it as not needed
          nbsp.ampersandNecessary = false;
          console.log(
            `756 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        // wipe
        nbspWipe();
        console.log(`762 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        continue outerloop;
      }
    }

    // catch "s"
    if (str[i] && str[i].toLowerCase() === "s") {
      console.log("769 s caught");
      if (nbsp.nameStartsAt !== null) {
        // clean code
        nbsp.matchedS = i;
        console.log(
          `774 SET ${`\u001b[${33}m${`nbsp.matchedS`}\u001b[${39}m`} = ${
            nbsp.matchedS
          }`
        );
      } else if (nbsp.patience) {
        // dirty code case because ampersand or "n" are missing so far

        // 1. Patience is reduced for every single character missing. There can
        // be only one character missing out of n-b-s-p.
        nbsp.patience--;
        console.log(
          `785 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );

        // 2. mark the start
        nbsp.nameStartsAt = i;
        console.log(
          `793 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedS = i;
        console.log(
          `799 SET ${`\u001b[${33}m${`nbsp.matchedS`}\u001b[${39}m`} = true`
        );

        // 3. tend the ampersand situation
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          // if by now there are signs of ampersand records, it must be added later:
          nbsp.ampersandNecessary = true;
          console.log(
            `807 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          // in all other cases, set it as not needed
          nbsp.ampersandNecessary = false;
          console.log(
            `813 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        // wipe
        nbspWipe();
        console.log(`819 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        continue outerloop;
      }
    }

    // catch "p"
    if (str[i] && str[i].toLowerCase() === "p") {
      console.log("826 p caught");
      if (nbsp.nameStartsAt !== null) {
        // clean code
        nbsp.matchedP = i;
        console.log(
          `831 SET ${`\u001b[${33}m${`nbsp.matchedP`}\u001b[${39}m`} = ${
            nbsp.matchedP
          }`
        );
      } else if (nbsp.patience) {
        // dirty code case because ampersand or "n" are missing so far

        // 1. Patience is reduced for every single character missing. There can
        // be only one character missing out of n-b-s-p.
        nbsp.patience--;
        console.log(
          `842 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );

        // 2. mark the start
        nbsp.nameStartsAt = i;
        console.log(
          `850 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedP = i;
        console.log(
          `856 SET ${`\u001b[${33}m${`nbsp.matchedP`}\u001b[${39}m`} = true`
        );

        // 3. tend the ampersand situation
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          // if by now there are signs of ampersand records, it must be added later:
          nbsp.ampersandNecessary = true;
          console.log(
            `864 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          // in all other cases, set it as not needed
          nbsp.ampersandNecessary = false;
          console.log(
            `870 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        // wipe
        nbspWipe();
        console.log(`876 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        continue outerloop;
      }
    }

    // catch semicolon
    if (str[i] === ";") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedSemicol = i;
        console.log(
          `886 SET ${`\u001b[${33}m${`nbsp.matchedSemicol`}\u001b[${39}m`} = true`
        );
      }
    }

    // catch whitespace
    if (str[i] && str[i].trim().length === 0 && nbsp.nameStartsAt !== null) {
      nbspWipe();
      console.log(`894 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
    }

    //            |
    //            |
    //            |
    //            |
    //            |
    // PART 3. RULES AT THE BOTTOM
    //            |
    //            |
    //            |
    //            |
    //            |

    // the state state_AmpersandNotNeeded = true lasts only for a single
    // character, hence needs to be at the very bottom:
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
      console.log(
        `914 SET ${`\u001b[${33}m${`state_AmpersandNotNeeded`}\u001b[${39}m`} = ${JSON.stringify(
          state_AmpersandNotNeeded,
          null,
          4
        )}`
      );
    }

    // If ampersand is detected and next letter is not from
    // ["n", "b", "s", "p"] set, reduce "patience" for each character in a
    // sequence as long as it's not from the set.
    if (
      nbsp.nameStartsAt !== null &&
      i > nbsp.nameStartsAt &&
      str[i] &&
      str[i].toLowerCase() !== "n" &&
      str[i].toLowerCase() !== "b" &&
      str[i].toLowerCase() !== "s" &&
      str[i].toLowerCase() !== "p" &&
      str[i] !== "&" &&
      str[i] !== ";"
    ) {
      if (nbsp.patience) {
        nbsp.patience = nbsp.patience - 1;
        console.log(`938 nbsp.patience--, now equal to: ${nbsp.patience}`);
      } else {
        nbspWipe();
        console.log(`941 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        continue outerloop;
      }
    }

    //            |
    //            |
    //            |
    //            |
    //            |
    // PART 4. LOGGING:
    //            |
    //            |
    //            |
    //            |
    //            |
    console.log("---------------");
    console.log(`state_AmpersandNotNeeded = ${state_AmpersandNotNeeded}`);
    console.log(
      `${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} = ${JSON.stringify(
        nbsp,
        null,
        4
      )}${
        rangesArr.length
          ? `\n${`\u001b[${32}m${`rangesArr`}\u001b[${39}m`} = ${JSON.stringify(
              rangesArr,
              null,
              4
            )}`
          : ""
      }`
    );
    counter++;
  }

  //                                      ^
  //                                     /|\
  //                                    / | \
  //                                   /  |  \
  //                                  /   |   \
  //                                 /    |    \
  //                                      |
  //                                      |
  //              T   H   E       L   O   O   P       E   N   D   S
  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //                                      |

  console.log(
    `993 IN THE END, before merge rangesArr = ${JSON.stringify(
      rangesArr,
      null,
      4
    )}`
  );
  return rangesArr.length
    ? opts.cb
      ? rangesArr
      : rangesMerge(rangesArr)
    : null;
}

export default stringFixBrokenNamedEntities;

import isObj from "lodash.isplainobject";
import rangesMerge from "ranges-merge";
import clone from "lodash.clonedeep";
import allNamedEntities from "./allNamedEntities.json";
import { left, right, rightSeq, leftSeq } from "string-left-right";

/**
 * stringFixBrokenNamedEntities - fixes broken named HTML entities
 *
 * @param  {string} inputString
 * @return {array}  ranges array OR null
 */
function stringFixBrokenNamedEntities(str, originalOpts) {
  console.log(
    `015 ${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
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
  // ---------------------------------------------------------------------------
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
        `059 new ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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
  // ---------------------------------------------------------------------------

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
  // Alternate ranges array for callback-procesed ranges.
  // Idea is, we can't ranges-merge the processed ranges array
  // any more. The plan is to ranges-merge the "rangesArr" above
  // and then if any ranges were omitted (because of being
  // overlapped by other ranges), we will remove the same ranges
  // from rangesArr2 before returning.
  const rangesArr2 = [];

  let smallestCharFromTheSetAt;
  let largestCharFromTheSetAt;
  let matchedLettersCount;
  let setOfValues;
  let percentageDone;
  let lastPercentageDone;

  // allocate all 100 of progress to the main loop below
  const len = str.length + 1;
  let counter = 0;

  // doNothingUntil can be either falsey or truthy: index number or boolean true
  // If it's number, it's instruction to avoid actions until that index is
  // reached when traversing. If it's boolean, it means we don't know when we'll
  // stop, we just turn on the flag (permanently, for now).
  let doNothingUntil = null;

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
      }\u001b[${39}m`}`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m ${
        doNothingUntil && (doNothingUntil === true || doNothingUntil > i)
          ? `${`\u001b[${31}m${`██ doNothingUntil until ${doNothingUntil}`}\u001b[${39}m`}`
          : ""
      }`
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

    if (doNothingUntil) {
      if (doNothingUntil !== true && i >= doNothingUntil) {
        doNothingUntil = null;
        console.log(
          `219 RESET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = null`
        );
      } else {
        console.log(`222 continue`);
        continue;
      }
    }

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
      `246 ${`\u001b[${33}m${`smallestCharFromTheSetAt`}\u001b[${39}m`} = ${JSON.stringify(
        smallestCharFromTheSetAt,
        null,
        4
      )}`
    );
    console.log(
      `253 ${`\u001b[${33}m${`largestCharFromTheSetAt`}\u001b[${39}m`} = ${JSON.stringify(
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
        str[left(str, i)] === ";") &&
      str[i] !== ";" &&
      (str[i + 1] === undefined || str[right(str, i)] !== ";")
    ) {
      console.log(
        `296 ${`\u001b[${90}m${`within nbsp clauses`}\u001b[${39}m`}`
      );
      if (
        (nbsp.ampersandNecessary !== false &&
          str.slice(nbsp.nameStartsAt, i) !== "&nbsp;") ||
        (nbsp.ampersandNecessary === false &&
          str.slice(
            Math.min(
              nbsp.matchedN,
              nbsp.matchedB,
              nbsp.matchedS,
              nbsp.matchedP
            ),
            i
          ) !== "nbsp;")
      ) {
        console.log(
          `313 ${`\u001b[${90}m${`catching what's missing in nbsp`}\u001b[${39}m`}`
        );
        // catch the case where only semicol is missing and insert only that
        // missing semicolon, instead of overwriting whole &nbsp;
        if (
          nbsp.nameStartsAt != null &&
          i - nbsp.nameStartsAt === 5 &&
          str.slice(nbsp.nameStartsAt, i) === "&nbsp" &&
          !opts.decode
        ) {
          console.log("323 ██ only semicol missing!");
          if (opts.cb) {
            console.log(
              `326 push ${JSON.stringify(
                opts.cb({
                  ruleName: "bad-named-html-entity-missing-semicolon",
                  entityName: "nbsp",
                  rangeFrom: i,
                  rangeTo: i,
                  rangeValEncoded: ";",
                  rangeValDecoded: ";"
                }),
                null,
                4
              )}`
            );
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-missing-semicolon",
                entityName: "nbsp",
                rangeFrom: i,
                rangeTo: i,
                rangeValEncoded: ";",
                rangeValDecoded: ";"
              })
            );
          }
          // no cb, no decode - just insert the missing semicolon:
          rangesArr.push([i, i, ";"]);
          console.log(`352 pushed [${i}, ${i}, ";"]`);
        } else {
          console.log(`354 it's not just semicolon missing`);
          console.log(
            `356 ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
              nbsp.nameStartsAt,
              null,
              4
            )}`
          );

          if (opts.cb) {
            // in callback, replace all entity's characters, serve both values,
            // raw and encoded:
            console.log(
              `367 push ${JSON.stringify(
                opts.cb({
                  ruleName: "bad-named-html-entity-malformed-nbsp",
                  entityName: "nbsp",
                  rangeFrom: nbsp.nameStartsAt,
                  rangeTo: i,
                  rangeValEncoded: "&nbsp;",
                  rangeValDecoded: "\xA0"
                }),
                null,
                4
              )}`
            );
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-malformed-nbsp",
                entityName: "nbsp",
                rangeFrom: nbsp.nameStartsAt,
                rangeTo: i,
                rangeValEncoded: "&nbsp;",
                rangeValDecoded: "\xA0"
              })
            );
          }
          // if it's not callback, also replace all characters, but write
          // the value according to opts.decode:
          rangesArr.push([
            nbsp.nameStartsAt,
            i,
            opts.decode ? "\xA0" : "&nbsp;"
          ]);
          console.log(
            `399 pushed ${JSON.stringify(
              [nbsp.nameStartsAt, i, opts.decode ? "\xA0" : "&nbsp;"],
              null,
              4
            )}`
          );
        }
      }
      nbspWipe();
      console.log(`408 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
      continue outerloop;
    } else {
      console.log(
        `412 \n\u001b[${32}m${`███████████████████████████████████████`}\u001b[${39}m`
      );
      console.log(
        `a1. nbsp.nameStartsAt !== null: ${nbsp.nameStartsAt !== null}`
      );
      console.log(`a2. matchedLettersCount > 2: ${matchedLettersCount > 2}`);
      console.log(
        `a3. (nbsp.matchedSemicol !== null ||...: ${nbsp.matchedSemicol !==
          null ||
          !nbsp.ampersandNecessary ||
          (isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[i]))}`
      );
      console.log(
        `a4 (!str[i] ||... :${!str[i] ||
          (nbsp.matchedN !== null &&
            nbsp.matchedB !== null &&
            nbsp.matchedS !== null &&
            nbsp.matchedP !== null &&
            str[i] !== str[i - 1]) ||
          (str[i].toLowerCase() !== "n" &&
            str[i].toLowerCase() !== "b" &&
            str[i].toLowerCase() !== "s" &&
            str[i].toLowerCase() !== "p")}`
      );
      console.log(`a5 str[i] !== ";": ${str[i] !== ";"}`);
      console.log(
        `a6 (str[i + 1] === undefined || str[i + 1] !== ";"): ${str[i + 1] ===
          undefined || str[i + 1] !== ";"}`
      );
      console.log(
        `\u001b[${32}m${`███████████████████████████████████████`}\u001b[${39}m\n`
      );
    }

    // If semicolon was passed and tag is not closing, wipe:
    if (
      str[i] &&
      str[i - 1] === ";" &&
      !leftSeq(str, i - 1, "a", "m", "p") &&
      str[i] !== ";" &&
      matchedLettersCount > 0
    ) {
      nbspWipe();
      console.log(`455 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
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

    // catch amp;
    if (str[i] === "a") {
      console.log(`473 ${`\u001b[${90}m${`within a clauses`}\u001b[${39}m`}`);
      // // 1. catch recursively-encoded cases. They're easy actually, the task will
      // // be deleting sequence of repeated "amp;" between ampersand and letter.

      // For example, we have this:
      // text&   amp  ;  a  m   p   ;  nbsp;text
      // We start at the opening ampersand at index 4;
      const singleAmpOnTheRight = rightSeq(str, i, "m", "p", ";");
      if (singleAmpOnTheRight) {
        console.log(
          `483 ${`\u001b[${90}m${`confirmed amp; from index ${i} onwards`}\u001b[${39}m`}`
        );

        // if we had to delete all amp;amp;amp; and leave only ampersand, this
        // will be the index to delete up to:
        let toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        console.log(
          `490 SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`
        );

        // so one &amp; is confirmed.
        const nextAmpOnTheRight = rightSeq(
          str,
          singleAmpOnTheRight.rightmostChar,
          "a",
          "m",
          "p",
          ";"
        );
        if (nextAmpOnTheRight) {
          console.log(
            `504 ${`\u001b[${90}m${`confirmed another amp; on the right of index ${
              singleAmpOnTheRight.rightmostChar
            }`}\u001b[${39}m`}`
          );

          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          console.log(
            `511 SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`
          );

          let temp;
          do {
            console.log(
              `517 ${`\u001b[${36}m${`======== loop ========`}\u001b[${39}m`}`
            );
            temp = rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");
            console.log(
              `521 ${`\u001b[${36}m${`temp = ${JSON.stringify(
                temp,
                null,
                4
              )}`}\u001b[${39}m`}`
            );

            if (temp) {
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
              console.log(
                `531 ${`\u001b[${36}m${`another amp; confirmed! Now`}\u001b[${39}m`} ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
                  toDeleteAllAmpEndHere,
                  null,
                  4
                )};`
              );
            }
          } while (temp);

          console.log(
            `541 FINAL ${`\u001b[${32}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
              toDeleteAllAmpEndHere,
              null,
              4
            )}`
          );
        }

        // What we have is toDeleteAllAmpEndHere which marks where the last amp;
        // semicolon ends were we to delete the whole thing.
        // For example, in:
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // this would be index 49, the "n" from "nbsp;"

        const firstCharThatFollows = right(str, toDeleteAllAmpEndHere - 1);
        console.log(
          `557 SET initial ${`\u001b[${33}m${`firstCharThatFollows`}\u001b[${39}m`} = ${firstCharThatFollows}`
        );

        // If entity follows, for example,
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // we delete from first amptersand to the beginning of that entity.
        // Otherwise, we delete only repetitions of amp; + whitespaces in between.
        let matchedTemp;
        if (
          str[firstCharThatFollows] &&
          allNamedEntities.some(entity => {
            if (str.startsWith(`${entity};`, firstCharThatFollows)) {
              matchedTemp = entity;
              return true;
            }
          })
        ) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1;
          console.log(
            `576 ${`\u001b[${31}m${`██ ACTIVATE doNothingUntil = ${doNothingUntil}`}\u001b[${39}m`}`
          );

          console.log(
            `580 ENTITY ${`\u001b[${32}m${matchedTemp}\u001b[${39}m`} FOLLOWS`
          );
          // is there ampersand on the left if "i", the first amp;?
          const whatsOnTheLeft = left(str, i);

          if (str[whatsOnTheLeft] === "&") {
            console.log(`586 ampersand on the left`);
            // delete from this ampersand up to entity's start:
            if (opts.cb) {
              rangesArr2.push(
                opts.cb({
                  ruleName: "bad-named-html-entity-multiple-encoding",
                  entityName: "amp",
                  rangeFrom: whatsOnTheLeft + 1,
                  rangeTo: firstCharThatFollows,
                  rangeValEncoded: null,
                  rangeValDecoded: null
                })
              );
            }
            rangesArr.push([whatsOnTheLeft + 1, firstCharThatFollows]);
            console.log(
              `602 PUSH \u001b[${33}m${`[${whatsOnTheLeft +
                1}, ${firstCharThatFollows}]`}\u001b[${39}m`
            );
          } else if (whatsOnTheLeft) {
            // we need to add the ampersand as well. Now, another consideration
            // appears: whitespace and where exactly to put it. Algorithmically,
            // we put it one index to the right of the non-whitespace character
            // that's on the left from here.
            let rangeFrom = whatsOnTheLeft + 1;
            let spaceReplacement = "";
            if (!str[rangeFrom].trim().length) {
              if (str[rangeFrom] === " ") {
                rangeFrom++;
              } else if (!`\n\r`.includes(str[rangeFrom])) {
                spaceReplacement = " ";
                // rangeFrom--;
              } else {
                // if there are line breaks just bail and insert the missing
                // ampersand in front of amp;
                rangeFrom = i;
              }
            }
            console.log(
              `625 rangeFrom = ${rangeFrom}; firstCharThatFollows = ${firstCharThatFollows}`
            );
            if (opts.cb) {
              console.log(
                `629 push ${JSON.stringify(
                  opts.cb({
                    ruleName: "bad-named-html-entity-multiple-encoding",
                    entityName: "amp",
                    rangeFrom: rangeFrom,
                    rangeTo: firstCharThatFollows,
                    rangeValEncoded: `${spaceReplacement}&`,
                    rangeValDecoded: `${spaceReplacement}&`
                  }),
                  null,
                  4
                )}`
              );
              rangesArr2.push(
                opts.cb({
                  ruleName: "bad-named-html-entity-multiple-encoding",
                  entityName: "amp",
                  rangeFrom: rangeFrom,
                  rangeTo: firstCharThatFollows,
                  rangeValEncoded: `${spaceReplacement}&`,
                  rangeValDecoded: `${spaceReplacement}&`
                })
              );
            }
            rangesArr.push([
              rangeFrom,
              firstCharThatFollows,
              `${spaceReplacement}&`
            ]);
          }
        }
      }
    }

    // catch ampersand
    if (str[i] === "&") {
      console.log(`665 ${`\u001b[${90}m${`& caught`}\u001b[${39}m`}`);

      // 2. mark the potential beginning of an nbsp:
      if (nbsp.nameStartsAt === null) {
        if (nbsp.ampersandNecessary === null) {
          // The check above is for not false but null because null means it's
          // not set false is set to false. Thus check can't be "if false".

          // mark the beginning
          nbsp.nameStartsAt = i;
          console.log(
            `676 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
              nbsp.nameStartsAt
            }`
          );
          nbsp.ampersandNecessary = false;
          console.log(
            `682 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
              nbsp.ampersandNecessary
            }`
          );
        }
      } else if (!nbsp.ampersandNecessary) {
        // it's a duplicate ampersand
        let endingIndex = i + 1;

        const whatsOnTheRight = right(str, i);
        if (str[whatsOnTheRight] === "&") {
          // there are more ampersands repeated
          for (let y = whatsOnTheRight; y < len; y++) {
            if (str[y].trim().length && str[y] !== "&") {
              endingIndex = y;
              doNothingUntil = y;
              break;
            }
          }
        }

        if (opts.cb) {
          rangesArr2.push(
            opts.cb({
              ruleName: "bad-named-html-entity-duplicate-ampersand",
              entityName: "nbsp",
              rangeFrom: i,
              rangeTo: endingIndex,
              rangeValEncoded: null,
              rangeValDecoded: null
            })
          );
        }
        rangesArr.push([i, endingIndex]);
        console.log(
          `717 PUSH \u001b[${33}m${`[${i}, ${endingIndex}]`}\u001b[${39}m`
        );
      }

      // 3. catch some other named HTML entities without semicolons

      if (str[i + 1] === "a" && str[i + 2] === "n" && str[i + 3] === "g") {
        if (str[i + 4] !== "s" && str[i + 4] !== ";") {
          // add missing semicolon on &ang (not &angst)
          if (opts.cb) {
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-missing-semicolon",
                entityName: "ang",
                rangeFrom: i + 4,
                rangeTo: i + 4,
                rangeValEncoded: "&ang;",
                rangeValDecoded: "\u2220"
              })
            );
          }
          rangesArr.push([i, i + 4, opts.decode ? "\u2220" : "&ang;"]);
          console.log(
            `740 PUSH \u001b[${33}m${`[${i}, ${i + 4}, "&ang;"]`}\u001b[${39}m`
          );

          i += 3;
          continue outerloop;
        } else if (
          str[i + 4] === "s" &&
          str[i + 5] === "t" &&
          str[i + 6] !== ";"
        ) {
          // add missing semicolon on &angst
          if (opts.cb) {
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-missing-semicolon",
                entityName: "angst",
                rangeFrom: i + 6,
                rangeTo: i + 6,
                rangeValEncoded: "&angst;",
                rangeValDecoded: "\xC5"
              })
            );
          }
          rangesArr.push([i, i + 6, opts.decode ? "\xC5" : "&angst;"]);
          console.log(
            `765 PUSH \u001b[${33}m${`[${i}, ${i +
              6}, "&angst;"]`}\u001b[${39}m`
          );

          i += 5;
          continue outerloop;
        }
      } else if (str[i + 1] === "p" && str[i + 2] === "i") {
        if (str[i + 3] !== "v" && str[i + 3] !== ";") {
          // add missing semicolon on &pi (not &piv)
          if (opts.cb) {
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-missing-semicolon",
                entityName: "pi",
                rangeFrom: i + 3,
                rangeTo: i + 3,
                rangeValEncoded: "&pi;",
                rangeValDecoded: "\u03C0"
              })
            );
          }
          rangesArr.push([i, i + 3, opts.decode ? "\u03C0" : "&pi;"]);
          console.log(
            `789 PUSH \u001b[${33}m${`[${i}, ${i + 3}, "&pi;"]`}\u001b[${39}m`
          );

          i += 3;
          continue outerloop;
        } else if (str[i + 3] === "v" && str[i + 4] !== ";") {
          // add missing semicolon on &piv
          if (opts.cb) {
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-missing-semicolon",
                entityName: "piv",
                rangeFrom: i + 4,
                rangeTo: i + 4,
                rangeValEncoded: "&piv;",
                rangeValDecoded: "\u03D6"
              })
            );
          }
          rangesArr.push([i, i + 4, opts.decode ? "\u03D6" : "&piv;"]);
          console.log(
            `810 PUSH \u001b[${33}m${`[${i}, ${i + 4}, "&piv;"]`}\u001b[${39}m`
          );

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
          rangesArr2.push(
            opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "Pi",
              rangeFrom: i + 3,
              rangeTo: i + 3,
              rangeValEncoded: "&Pi;",
              rangeValDecoded: "\u03A0"
            })
          );
        }
        rangesArr.push([i, i + 3, opts.decode ? "\u03A0" : "&Pi;"]);
        console.log(
          `836 PUSH \u001b[${33}m${`[${i}, ${i + 3}, "&Pi;"]`}\u001b[${39}m`
        );

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
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-missing-semicolon",
                entityName: "sigma",
                rangeFrom: i + 6,
                rangeTo: i + 6,
                rangeValEncoded: "&sigma;",
                rangeValDecoded: "\u03C3"
              })
            );
          }
          rangesArr.push([i, i + 6, opts.decode ? "\u03C3" : "&sigma;"]);
          console.log(
            `865 PUSH \u001b[${33}m${`[${i}, ${i +
              6}, "&sigma;"]`}\u001b[${39}m`
          );

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
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-missing-semicolon",
                entityName: "sub",
                rangeFrom: i + 4,
                rangeTo: i + 4,
                rangeValEncoded: "&sub;",
                rangeValDecoded: "\u2282"
              })
            );
          }
          rangesArr.push([i, i + 4, opts.decode ? "\u2282" : "&sub;"]);
          console.log(
            `892 PUSH \u001b[${33}m${`[${i}, ${i + 4}, "&sub;"]`}\u001b[${39}m`
          );

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
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-missing-semicolon",
                entityName: "sup",
                rangeFrom: i + 4,
                rangeTo: i + 4,
                rangeValEncoded: "&sup;",
                rangeValDecoded: "\u2283"
              })
            );
          }
          rangesArr.push([i, i + 4, opts.decode ? "\u2283" : "&sup;"]);
          console.log(
            `922 PUSH \u001b[${33}m${`[${i}, ${i + 4}, "&sup;"]`}\u001b[${39}m`
          );

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
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-missing-semicolon",
                entityName: "theta",
                rangeFrom: i + 6,
                rangeTo: i + 6,
                rangeValEncoded: "&theta;",
                rangeValDecoded: "\u03B8"
              })
            );
          }
          rangesArr.push([i, i + 6, opts.decode ? "\u03B8" : "&theta;"]);
          console.log(
            `952 PUSH \u001b[${33}m${`[${i}, ${i +
              6}, "&theta;"]`}\u001b[${39}m`
          );

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
            rangesArr2.push(
              opts.cb({
                ruleName: "bad-named-html-entity-missing-semicolon",
                entityName: "thinsp",
                rangeFrom: i + 7,
                rangeTo: i + 7,
                rangeValEncoded: "&thinsp;",
                rangeValDecoded: "\u2009"
              })
            );
          }
          rangesArr.push([i, i + 7, opts.decode ? "\u2009" : "&thinsp;"]);
          console.log(
            `981 PUSH \u001b[${33}m${`[${i}, ${i +
              7}, "&thinsp;"]`}\u001b[${39}m`
          );

          i += 6;
          continue outerloop;
        }
      }
    }

    // catch "n"
    if (str[i] && str[i].toLowerCase() === "n") {
      // failsafe
      if (str[i - 1] === "i" && str[i + 1] === "s") {
        console.log("995 pattern ...ins... detected - bail");
        nbspWipe();
        continue outerloop;
      }

      // action
      console.log("1001 n caught");
      if (nbsp.matchedN === null) {
        nbsp.matchedN = i;
        console.log(
          `1005 SET ${`\u001b[${33}m${`nbsp.matchedN`}\u001b[${39}m`} = ${
            nbsp.matchedN
          }`
        );
      }
      if (nbsp.nameStartsAt === null) {
        // 1. mark it
        nbsp.nameStartsAt = i;
        console.log(
          `1014 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
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
          `1027 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
            nbsp.ampersandNecessary
          }`
        );
      }
    }

    // catch "b"
    if (str[i] && str[i].toLowerCase() === "b") {
      console.log("1036 b caught");
      if (nbsp.nameStartsAt !== null) {
        // clean code, N was already detected
        if (nbsp.matchedB === null) {
          nbsp.matchedB = i;
          console.log(
            `1042 SET ${`\u001b[${33}m${`nbsp.matchedB`}\u001b[${39}m`} = ${
              nbsp.matchedB
            }`
          );
        }
      } else if (nbsp.patience) {
        // dirty code case because ampersand or "n" are missing so far

        // 1. Patience is reduced for every single character missing. There can
        // be only one character missing out of n-b-s-p.
        nbsp.patience--;
        console.log(
          `1054 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );

        // 2. mark the start
        nbsp.nameStartsAt = i;
        console.log(
          `1062 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedB = i;
        console.log(
          `1068 SET ${`\u001b[${33}m${`nbsp.matchedB`}\u001b[${39}m`} = true`
        );

        // 3. tend the ampersand situation
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          // if by now there are signs of ampersand records, it must be added later:
          nbsp.ampersandNecessary = true;
          console.log(
            `1076 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          // in all other cases, set it as not needed
          nbsp.ampersandNecessary = false;
          console.log(
            `1082 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        // wipe
        nbspWipe();
        console.log(`1088 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        continue outerloop;
      }
    }

    // catch "s"
    if (str[i] && str[i].toLowerCase() === "s") {
      console.log("1095 s caught");
      if (nbsp.nameStartsAt !== null) {
        // clean code
        if (nbsp.matchedS === null) {
          nbsp.matchedS = i;
          console.log(
            `1101 SET ${`\u001b[${33}m${`nbsp.matchedS`}\u001b[${39}m`} = ${
              nbsp.matchedS
            }`
          );
        }
      } else if (nbsp.patience) {
        // dirty code case because ampersand or "n" are missing so far

        // 1. Patience is reduced for every single character missing. There can
        // be only one character missing out of n-b-s-p.
        nbsp.patience--;
        console.log(
          `1113 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );

        // 2. mark the start
        nbsp.nameStartsAt = i;
        console.log(
          `1121 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedS = i;
        console.log(
          `1127 SET ${`\u001b[${33}m${`nbsp.matchedS`}\u001b[${39}m`} = true`
        );

        // 3. tend the ampersand situation
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          // if by now there are signs of ampersand records, it must be added later:
          nbsp.ampersandNecessary = true;
          console.log(
            `1135 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          // in all other cases, set it as not needed
          nbsp.ampersandNecessary = false;
          console.log(
            `1141 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        // wipe
        nbspWipe();
        console.log(`1147 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        continue outerloop;
      }
    }

    // catch "p"
    if (str[i] && str[i].toLowerCase() === "p") {
      console.log("1154 p caught");
      if (nbsp.nameStartsAt !== null) {
        // clean code
        if (nbsp.matchedP === null) {
          nbsp.matchedP = i;
          console.log(
            `1160 SET ${`\u001b[${33}m${`nbsp.matchedP`}\u001b[${39}m`} = ${
              nbsp.matchedP
            }`
          );
        }
      } else if (nbsp.patience) {
        // dirty code case because ampersand or "n" are missing so far

        // 1. Patience is reduced for every single character missing. There can
        // be only one character missing out of n-b-s-p.
        nbsp.patience--;
        console.log(
          `1172 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );

        // 2. mark the start
        nbsp.nameStartsAt = i;
        console.log(
          `1180 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedP = i;
        console.log(
          `1186 SET ${`\u001b[${33}m${`nbsp.matchedP`}\u001b[${39}m`} = true`
        );

        // 3. tend the ampersand situation
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          // if by now there are signs of ampersand records, it must be added later:
          nbsp.ampersandNecessary = true;
          console.log(
            `1194 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          // in all other cases, set it as not needed
          nbsp.ampersandNecessary = false;
          console.log(
            `1200 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        // wipe
        nbspWipe();
        console.log(`1206 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        continue outerloop;
      }
    }

    // catch semicolon
    if (str[i] === ";") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedSemicol = i;
        console.log(
          `1216 SET ${`\u001b[${33}m${`nbsp.matchedSemicol`}\u001b[${39}m`} = ${
            nbsp.matchedSemicol
          }`
        );

        // ensure semicolon doesn't precede the n-b-s-p letters, but this applies
        // only if one letter is caught before the semicolon
        if (
          (nbsp.matchedN && // <---- just n
            !nbsp.matchedB &&
            !nbsp.matchedS &&
            !nbsp.matchedP) ||
          (!nbsp.matchedN &&
          nbsp.matchedB && // <---- just b
            !nbsp.matchedS &&
            !nbsp.matchedP) ||
          (!nbsp.matchedN &&
          !nbsp.matchedB &&
          nbsp.matchedS && // <---- just s
            !nbsp.matchedP) ||
          (!nbsp.matchedN && !nbsp.matchedB && !nbsp.matchedS && nbsp.matchedP) // <---- just p
        ) {
          nbspWipe();
          console.log(`1239 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        }
      }
    }

    // // catch whitespace
    // if (str[i] && str[i].trim().length === 0 && nbsp.nameStartsAt !== null) {
    //   nbspWipe();
    //   console.log(`1247 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
    // }

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
        `1267 SET ${`\u001b[${33}m${`state_AmpersandNotNeeded`}\u001b[${39}m`} = ${JSON.stringify(
          state_AmpersandNotNeeded,
          null,
          4
        )}`
      );

      // if there was at least one character caught from [n, b, s, p], activate
      // "forgetAboutAmpersand", marking that all is taken care of with regards
      // of ampersand and no need to worry. Imagine, otherwise, the markers
      // such as: "ampersand at 4", "n at 8", "b at 9", "s at 10" ... would
      // freak out the algorithm - what's that space between 4 and 8!!!
      if (
        nbsp.nameStartsAt &&
        (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)
      ) {
        nbsp.ampersandNecessary = false;
      }
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
      str[i] !== ";" &&
      str[i] !== " "
    ) {
      if (nbsp.patience) {
        nbsp.patience = nbsp.patience - 1;
        console.log(`1304 nbsp.patience--, now equal to: ${nbsp.patience}`);
      } else {
        nbspWipe();
        console.log(`1307 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
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
    `1360 IN THE END, before merge rangesArr = ${JSON.stringify(
      rangesArr,
      null,
      4
    )};\nrangesArr2 = ${JSON.stringify(rangesArr2, null, 4)}`
  );

  if (!rangesArr.length) {
    console.log(`1368 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} null`);
    return null;
  }

  if (opts.cb) {
    // we can't feed custom thing, "rangesArr2" into ranges-merge.
    // We need to delete ranges that are subsets of others.
    // For example, we have a double-encoding scenario:
    // [
    //     [
    //         5,
    //         9
    //     ],
    //     [
    //         4,
    //         14,
    //         "&nbsp;"
    //     ]
    // ]
    // Clearly [5, 9] is a subset and we need to remove it
    // We are not concerned about merging neighbouring or
    // partially overlapping ranges - that's different issues
    // anyway (which are to be reported separately) - we are
    // concerned about subset ranges, ranges inside other ranges.
    // When one error says delete this character and another
    // rule comes and sayd delete this and character and bunch of
    // stuff around.
    return rangesArr2.filter((el, i) => {
      if (
        rangesArr.some((range, i2) => {
          // don't compare oneself to oneself
          if (i === i2) {
            return false;
          }
          // "false" is good, "true" is bad, at least one "true"
          // will cause our Array.some to give "true" which will
          // cause this range to be removed.
          if (rangesArr[i][0] >= range[0] && rangesArr[i][1] <= range[1]) {
            console.log(`1406 removing ${JSON.stringify(range, null, 4)}`);
            return true;
          }
          return false;
        })
      ) {
        // remove subset ranges
        return false;
      }
      return true;
    });
  }
  console.log(
    `1419 return ${JSON.stringify(
      rangesMerge(rangesArr, { joinRangesThatTouchEdges: false }),
      null,
      4
    )}`
  );
  return rangesMerge(rangesArr, { joinRangesThatTouchEdges: false });
}

export default stringFixBrokenNamedEntities;

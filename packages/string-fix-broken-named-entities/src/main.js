import isObj from "lodash.isplainobject";
import clone from "lodash.clonedeep";
import {
  allNamedEntities,
  entStartsWith,
  entEndsWith,
  entStartsWithCaseInsensitive,
  brokenNamedEntities,
  decode,
  maxLength,
  uncertain,
} from "all-named-html-entities";
import { left, right, rightSeq, leftSeq, chompLeft } from "string-left-right";
const isArr = Array.isArray;

/**
 * stringFixBrokenNamedEntities - fixes broken named HTML entities
 *
 * @param  {string} inputString
 * @return {array}  ranges array OR null
 */
function stringFixBrokenNamedEntities(str, originalOpts) {
  console.log(
    `024 stringFixBrokenNamedEntities: ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
      str,
      null,
      0
    )};\n${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
      originalOpts,
      null,
      4
    )}`
  );
  function resemblesNumericEntity(str, from, to) {
    // plan: loop characters, count types, judge what's given
    let lettersCount = 0;
    let numbersCount = 0;
    let othersCount = 0;
    let hashesCount = 0;
    let whitespaceCount = 0;
    let numbersValue = "";
    let charTrimmed = "";

    for (let i = from; i < to; i++) {
      console.log(
        `046 stringFixBrokenNamedEntities: ${`\u001b[${36}m${`resemblesNumericEntity() loop: str[${i}] = "${str[i]}"`}\u001b[${39}m`}`
      );
      if (str[i].trim().length) {
        charTrimmed += str[i];
      } else {
        whitespaceCount++;
      }
      if (isLatinLetter(str[i])) {
        lettersCount++;
      } else if (isNumber(str[i])) {
        numbersCount++;
        numbersValue += String(str[i]);
      } else if (str[i] === "#") {
        hashesCount++;
      } else {
        othersCount++;
      }
    }
    // if there are more numbers than letters (or equal) then it's more likely
    // to be a numeric entity
    let probablyNumeric = false;

    console.log(
      `069 stringFixBrokenNamedEntities: ${`\u001b[${33}m${`charTrimmed[0]`}\u001b[${39}m`} = ${JSON.stringify(
        charTrimmed[0],
        null,
        4
      )}; ${`\u001b[${33}m${`charTrimmed[1]`}\u001b[${39}m`} = ${JSON.stringify(
        charTrimmed[1],
        null,
        4
      )}`
    );

    // if decimal-type, for example, &#999999;
    // but wide enough to include messed up cases
    if (!lettersCount && numbersCount > othersCount) {
      probablyNumeric = "deci";
    } else if (
      (numbersCount || lettersCount) &&
      ((charTrimmed[0] === "#" &&
        charTrimmed[1].toLowerCase() === "x" &&
        (isNumber(charTrimmed[2]) || isLatinLetter(charTrimmed[2]))) ||
        (charTrimmed[0].toLowerCase() === "x" && numbersCount && !othersCount))
    ) {
      // hexidecimal, for example, &#xA3;
      // but wide enough to include messed up cases
      probablyNumeric = "hexi";
    }

    return {
      probablyNumeric,
      lettersCount,
      numbersCount,
      numbersValue,
      hashesCount,
      othersCount,
      charTrimmed,
      whitespaceCount,
    };
  }
  function isNotaLetter(str) {
    return !(
      typeof str === "string" &&
      str.length === 1 &&
      str.toUpperCase() !== str.toLowerCase()
    );
  }
  function isStr(something) {
    return typeof something === "string";
  }
  function isLatinLetter(something) {
    return (
      typeof something === "string" &&
      ((something.charCodeAt(0) > 96 && something.charCodeAt(0) < 123) ||
        (something.charCodeAt(0) > 64 && something.charCodeAt(0) < 91))
    );
  }
  function isLatinLetterOrNumberOrHash(char) {
    // we mean:
    // - Latin letters a-z or
    // - numbers 0-9 or
    // - letters A-Z or
    // - #
    return (
      isStr(char) &&
      char.length === 1 &&
      ((char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123) ||
        (char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58) ||
        (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
        char.charCodeAt(0) === 35)
    );
  }
  function isNumber(something) {
    return (
      isStr(something) &&
      something.charCodeAt(0) > 47 &&
      something.charCodeAt(0) < 58
    );
  }

  // checks, are there any other non-whitespace characters besides n, b, s or p
  function onlyContainsNbsp(str, from, to) {
    for (let i = from; i < to; i++) {
      if (str[i].trim().length && !`nbsp`.includes(str[i].toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  function findLongest(temp1) {
    // we are filtering something like this:
    // [
    //   {
    //       "tempEnt": "acute",
    //       "tempRes": {
    //           "gaps": [],
    //           "leftmostChar": 2,
    //           "rightmostChar": 6
    //       }
    //   },
    //   {
    //       "tempEnt": "zacute",
    //       "tempRes": {
    //           "gaps": [],
    //           "leftmostChar": 0,
    //           "rightmostChar": 6
    //       }
    //   }
    // ]
    //
    // we find the object which represents the longest matched entity, that is,
    // object which "tempEnt" key value's length is the longest.

    if (isArr(temp1) && temp1.length) {
      if (temp1.length === 1) {
        // quick ending - only one value anyway
        return temp1[0];
      }
      // filter-out and return the longest-one
      return temp1.reduce((accum, tempObj) => {
        if (tempObj.tempEnt.length > accum.tempEnt.length) {
          return tempObj;
        }
        return accum;
      });
    }
    return temp1;
  }

  function removeGappedFromMixedCases(temp1) {
    // If there is one without gaps and all others with gaps, gapless
    // wins, regardless of length.
    // The longest of gapless-one wins, trumping all the ones with gaps.
    // If all are with gaps, the longest one wins.

    // [
    //   {
    //       "tempEnt": "acute",
    //       "tempRes": {
    //           "gaps": [],
    //           "leftmostChar": 2,
    //           "rightmostChar": 6
    //       }
    //   },
    //   {
    //       "tempEnt": "zacute",
    //       "tempRes": {
    //           "gaps": [
    //               [
    //                   1,
    //                   2
    //               ]
    //           ],
    //           "leftmostChar": 0,
    //           "rightmostChar": 6
    //       }
    //   }
    // ]

    // For example, entity "zacute" record above shows it has gaps, while the
    // "acute" does not have gaps. This is a mixed case scenario and we remove
    // all gapped entities, that is, in this case, "zacute".

    // Imagine we have string "zzzzzz acute; yyyyyy". That z on the left of
    // "acute" is legit. That's why we exclude matched gapped entities in
    // mixed cases.

    // But, semicolon also matters, for example, &acd; vs. &ac; in:
    // &ac d;
    // case picks &acd; as winner

    let copy;

    if (isArr(temp1) && temp1.length) {
      // prevent mutation:
      copy = Array.from(temp1);
      // 1. if some matches have semicolon to the right of rightmostChar and
      // some matches don't, exclude those that don't.
      // If at any moment we've left with one match, Bob's your uncle here's
      // the final result.
      // For example, we might be working on something like this:
      // [
      //     {
      //         "tempEnt": "ac",
      //         "tempRes": {
      //             "gaps": [],
      //             "leftmostChar": 1,
      //             "rightmostChar": 2
      //         }
      //     },
      //     {
      //         "tempEnt": "acd",
      //         "tempRes": {
      //             "gaps": [
      //                 [
      //                     3,
      //                     4
      //                 ]
      //             ],
      //             "leftmostChar": 1,
      //             "rightmostChar": 4
      //         }
      //     }
      // ]

      if (
        copy.length > 1 &&
        copy.some(
          (entityObj) =>
            str[right(str, entityObj.tempRes.rightmostChar)] === ";"
        ) &&
        copy.some(
          (entityObj) =>
            str[right(str, entityObj.tempRes.rightmostChar)] !== ";"
        )
      ) {
        // filter out those with semicolon to the right of the last character:
        copy = copy.filter(
          (entityObj) =>
            str[right(str, entityObj.tempRes.rightmostChar)] === ";"
        );
        console.log(
          `290 stringFixBrokenNamedEntities: we filtered only entities with semicolons to the right: ${JSON.stringify(
            copy,
            null,
            4
          )}`
        );
      }

      // 2. if still there is more than one match, first exclude gapped if
      // there is mix of gapped vs. gapless. Then, return longest.
      // If all are either gapped or gapless, return longest.
      if (
        !(
          copy.every(
            (entObj) =>
              !entObj ||
              !entObj.tempRes ||
              !entObj.tempRes.gaps ||
              !isArr(entObj.tempRes.gaps) ||
              !entObj.tempRes.gaps.length
          ) ||
          copy.every(
            (entObj) =>
              entObj &&
              entObj.tempRes &&
              entObj.tempRes.gaps &&
              isArr(entObj.tempRes.gaps) &&
              entObj.tempRes.gaps.length
          )
        )
      ) {
        // filter out entities with gaps, leave gapless-ones
        return findLongest(
          copy.filter(
            (entObj) =>
              !entObj.tempRes.gaps ||
              !isArr(entObj.tempRes.gaps) ||
              !entObj.tempRes.gaps.length
          )
        );
      }
    }
    // else if all entries don't have gaps, return longest
    return findLongest(temp1);
  }

  //
  //
  //
  //
  //
  //                              THE PROGRAM
  //
  //
  //
  //
  //

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
    cb: ({ rangeFrom, rangeTo, rangeValEncoded, rangeValDecoded }) =>
      rangeValDecoded || rangeValEncoded
        ? [rangeFrom, rangeTo, opts.decode ? rangeValDecoded : rangeValEncoded]
        : [rangeFrom, rangeTo],
    progressFn: null,
    entityCatcherCb: null,
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
        `382 stringFixBrokenNamedEntities: new ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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
  if (opts.entityCatcherCb && typeof opts.entityCatcherCb !== "function") {
    throw new TypeError(
      `string-fix-broken-named-entities: [THROW_ID_03] opts.entityCatcherCb must be a function (or falsey)! Currently it's: ${typeof opts.entityCatcherCb}, equal to: ${JSON.stringify(
        opts.entityCatcherCb,
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
  console.log(
    `420 stringFixBrokenNamedEntities: FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} used: ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

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
    patience: 1, // one letter can be omitted from name
    matchedN: null, // set the index of the first catch
    matchedB: null, // set the index of the first catch
    matchedS: null, // set the index of the first catch
    matchedP: null, // set the index of the first catch
    matchedSemicol: null, // set the index of the first catch
  };
  let nbsp = clone(nbspDefault);
  const nbspWipe = () => {
    nbsp = clone(nbspDefault);
  };

  // this is what we'll return, process by default callback or user's custom-one
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

  // catch letter sequences, possibly separated with whitespace. Non-letter
  // breaks the sequence. Main aim is to catch names of encoded HTML entities
  // for example, nbsp from "&nbsp;"
  let letterSeqStartAt = null;

  let brokenNumericEntityStartAt = null;

  const falsePositivesArr = ["&nspar;", "&prnsim;", "&subplus;"];

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
      `523 stringFixBrokenNamedEntities: \n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 4)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
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
          `546 stringFixBrokenNamedEntities: RESET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = null`
        );
      } else {
        console.log(`549 stringFixBrokenNamedEntities: continue`);
        counter++;
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
      nbsp.matchedP,
    ].filter((val) => val !== null);
    smallestCharFromTheSetAt = Math.min(...setOfValues);
    largestCharFromTheSetAt = Math.max(...setOfValues);
    console.log(
      `574 stringFixBrokenNamedEntities: ${`\u001b[${33}m${`smallestCharFromTheSetAt`}\u001b[${39}m`} = ${JSON.stringify(
        smallestCharFromTheSetAt,
        null,
        4
      )}`
    );
    console.log(
      `581 stringFixBrokenNamedEntities: ${`\u001b[${33}m${`largestCharFromTheSetAt`}\u001b[${39}m`} = ${JSON.stringify(
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
        (isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[i])) ||
        ((isNotaLetter(str[nbsp.nameStartsAt - 1]) || isNotaLetter(str[i])) &&
          largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4) ||
        (nbsp.matchedN !== null &&
          nbsp.matchedB !== null &&
          nbsp.matchedS !== null &&
          nbsp.matchedP !== null &&
          nbsp.matchedN + 1 === nbsp.matchedB &&
          nbsp.matchedB + 1 === nbsp.matchedS &&
          nbsp.matchedS + 1 === nbsp.matchedP)) &&
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
      (str[i + 1] === undefined || str[right(str, i)] !== ";") &&
      (nbsp.matchedB !== null ||
        (!(
          str[smallestCharFromTheSetAt].toLowerCase() === "n" &&
          str[left(str, smallestCharFromTheSetAt)] &&
          str[left(str, smallestCharFromTheSetAt)].toLowerCase() === "e"
        ) &&
          !(
            nbsp.matchedN !== null &&
            rightSeq(str, nbsp.matchedN, { i: true }, "s", "u", "p")
          ) &&
          str[right(str, nbsp.matchedN)].toLowerCase() !== "c")) &&
      (nbsp.matchedB === null ||
        onlyContainsNbsp(
          str,
          smallestCharFromTheSetAt,
          largestCharFromTheSetAt + 1
        ) ||
        !(
          str[smallestCharFromTheSetAt] &&
          str[largestCharFromTheSetAt] &&
          str[smallestCharFromTheSetAt].toLowerCase() === "n" &&
          str[largestCharFromTheSetAt].toLowerCase() === "b"
        ))
    ) {
      console.log(
        `648 stringFixBrokenNamedEntities: ${`\u001b[${90}m${`within nbsp clauses`}\u001b[${39}m`}`
      );

      console.log(
        `652 stringFixBrokenNamedEntities: ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
          nbsp.nameStartsAt,
          null,
          4
        )}`
      );
      // chomp all &amp; where ampersand is optional if sandwitched
      const chompedAmpFromLeft = chompLeft(
        str,
        nbsp.nameStartsAt,
        "&?",
        "a",
        "m",
        "p",
        ";?"
      );

      console.log(
        `670 stringFixBrokenNamedEntities: ${`\u001b[${33}m${`chompedAmpFromLeft`}\u001b[${39}m`} = ${JSON.stringify(
          chompedAmpFromLeft,
          null,
          4
        )}`
      );
      const beginningOfTheRange = chompedAmpFromLeft
        ? chompedAmpFromLeft
        : nbsp.nameStartsAt;

      console.log(
        `681 stringFixBrokenNamedEntities: ${`\u001b[${31}m${`██`}\u001b[${39}m`} beginningOfTheRange = ${JSON.stringify(
          beginningOfTheRange,
          null,
          4
        )}`
      );

      // if our nbsp has problems:
      if (
        !falsePositivesArr.some((val) =>
          str.slice(beginningOfTheRange).startsWith(val)
        ) &&
        str.slice(beginningOfTheRange, i) !== "&nbsp;"
      ) {
        console.log(
          `696 stringFixBrokenNamedEntities: ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
            {
              ruleName: "bad-named-html-entity-malformed-nbsp",
              entityName: "nbsp",
              rangeFrom: beginningOfTheRange,
              rangeTo: i,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0",
            },
            null,
            4
          )}`
        );
        rangesArr2.push({
          ruleName: "bad-named-html-entity-malformed-nbsp",
          entityName: "nbsp",
          rangeFrom: beginningOfTheRange,
          rangeTo: i,
          rangeValEncoded: "&nbsp;",
          rangeValDecoded: "\xA0",
        });
      } else {
        // also, if it must be decoded this healthy nbsp is wrong
        if (opts.decode) {
          console.log(
            `721 stringFixBrokenNamedEntities: ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              {
                ruleName: "encoded-html-entity-nbsp",
                entityName: "nbsp",
                rangeFrom: beginningOfTheRange,
                rangeTo: i,
                rangeValEncoded: "&nbsp;",
                rangeValDecoded: "\xA0",
              },
              null,
              4
            )}`
          );
          rangesArr2.push({
            ruleName: "encoded-html-entity-nbsp",
            entityName: "nbsp",
            rangeFrom: beginningOfTheRange,
            rangeTo: i,
            rangeValEncoded: "&nbsp;",
            rangeValDecoded: "\xA0",
          });
        } else if (opts.entityCatcherCb) {
          // call the general entity callback if it's given
          console.log(
            `745 stringFixBrokenNamedEntities: ${`\u001b[${32}m${`CALL`}\u001b[${39}m`} opts.entityCatcherCb(${`\u001b[${36}m${beginningOfTheRange}\u001b[${39}m`}, ${`\u001b[${36}m${i}\u001b[${39}m`})`
          );
          opts.entityCatcherCb(beginningOfTheRange, i);
        }
      }
      nbspWipe();
      console.log(
        `752 stringFixBrokenNamedEntities: WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`
      );
      counter++;

      // if we are on an ampersand currently, start a new record
      if (str[i] === "&" && str[i + 1] !== "&") {
        nbsp.nameStartsAt = i;
        console.log(
          `760 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.ampersandNecessary = false;
        console.log(
          `766 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
            nbsp.ampersandNecessary
          }`
        );
      }

      continue outerloop;
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
      console.log(
        `785 stringFixBrokenNamedEntities: WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`
      );
      counter++;
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

    // Catch the end of a latin letter sequence.
    if (
      letterSeqStartAt !== null &&
      (!str[i] ||
        (str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i])))
    ) {
      console.log(
        `810 stringFixBrokenNamedEntities: ${`\u001b[${36}m${`██ letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`
      );
      if (
        i > letterSeqStartAt + 1 &&
        str.slice(letterSeqStartAt - 1, i + 1) !== "&nbsp;"
      ) {
        const potentialEntity = str.slice(letterSeqStartAt, i);
        console.log(
          `818 stringFixBrokenNamedEntities: ${`\u001b[${35}m${`██ CARVED A SEQUENCE:\n${potentialEntity}`}\u001b[${39}m`}`
        );
        const whatsOnTheLeft = left(str, letterSeqStartAt);
        const whatsEvenMoreToTheLeft = whatsOnTheLeft
          ? left(str, whatsOnTheLeft)
          : "";

        //
        //
        //
        //
        // CASE 1 - CHECK FOR MISSING SEMICOLON
        //
        //
        //
        //

        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
          console.log(
            `837 ${`\u001b[${35}m${`semicol might be missing`}\u001b[${39}m`}`
          );
          // check, what's the index of the character to the right of
          // str[whatsOnTheLeft], is it any of the known named HTML entities.
          const firstChar = letterSeqStartAt;
          const secondChar = letterSeqStartAt
            ? right(str, letterSeqStartAt)
            : null;
          console.log(
            `846 firstChar = str[${firstChar}] = ${str[firstChar]}; secondChar = str[${secondChar}] = ${str[secondChar]}`
          );
          // we'll tap the "entStartsWith" from npm package "all-named-html-entities"
          // which gives a plain object of named entities, all grouped by first
          // and second character first. This reduces amount of matching needed.
          console.log(
            `852 ██ ${
              secondChar !== null &&
              Object.prototype.hasOwnProperty.call(
                entStartsWith,
                str[firstChar]
              ) &&
              Object.prototype.hasOwnProperty.call(
                entStartsWith[str[firstChar]],
                str[secondChar]
              )
            }`
          );
          // mind you, there can be overlapping variations of entities, for
          // example, &ang; and &angst;. Now, if you match "ang" from "&ang;",
          // starting from the left side (like we do using "entStartsWith"),
          // when there is "&angst;", answer will also be positive. And we can't
          // rely on semicolon being on the right because we are actually
          // catching MISSING semicolons here.
          // The only way around this is to match all entities that start here
          // and pick the one with the biggest character length.

          // TODO - set up case insensitive matching here:
          if (
            Object.prototype.hasOwnProperty.call(
              entStartsWith,
              str[firstChar]
            ) &&
            Object.prototype.hasOwnProperty.call(
              entStartsWith[str[firstChar]],
              str[secondChar]
            )
          ) {
            console.log(`884`);
            let tempEnt;
            let tempRes;

            let temp1 = entStartsWith[str[firstChar]][str[secondChar]].reduce(
              (gatheredSoFar, oneOfKnownEntities) => {
                // find all entities that match on the right of here
                // rightSeq could theoretically give positive answer, zero index,
                // but it's impossible here, so we're fine to match "if true".
                const tempRes = rightSeq(
                  str,
                  letterSeqStartAt - 1,
                  ...oneOfKnownEntities.split("")
                );
                if (tempRes && oneOfKnownEntities !== "nbsp") {
                  return gatheredSoFar.concat([
                    { tempEnt: oneOfKnownEntities, tempRes },
                  ]);
                }
                return gatheredSoFar;
              },
              []
            );
            console.log(
              `908 ${`\u001b[${35}m${`temp1 BEFORE filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            temp1 = removeGappedFromMixedCases(temp1);
            console.log(
              `916 ${`\u001b[${35}m${`temp1 AFTER filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
            console.log(
              `926 ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt}; ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                tempRes,
                null,
                4
              )}`
            );

            console.log(
              `934 ${`\u001b[${33}m${`["&"].includes(str[tempRes.rightmostChar + 1])`}\u001b[${39}m`} = ${
                tempRes && tempRes.rightmostChar
                  ? JSON.stringify(
                      ["&"].includes(str[tempRes.rightmostChar + 1]),
                      null,
                      4
                    )
                  : ""
              }`
            );
            if (
              tempEnt &&
              (!Object.keys(uncertain).includes(tempEnt) ||
                !str[tempRes.rightmostChar + 1] ||
                ["&"].includes(str[tempRes.rightmostChar + 1]) ||
                ((uncertain[tempEnt].addSemiIfAmpPresent === true ||
                  (uncertain[tempEnt].addSemiIfAmpPresent &&
                    (!str[tempRes.rightmostChar + 1] ||
                      !str[tempRes.rightmostChar + 1].trim().length))) &&
                  str[tempRes.leftmostChar - 1] === "&"))
            ) {
              console.log(
                `956 ${`\u001b[${35}m${`entity ${tempEnt} is indeed on the right of index ${i}, the situation is: ${JSON.stringify(
                  tempRes,
                  null,
                  4
                )}`}\u001b[${39}m`}`
              );

              const decodedEntity = decode(`&${tempEnt};`);

              console.log(
                `966 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  {
                    ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                    entityName: tempEnt,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: tempRes.rightmostChar + 1,
                    rangeValEncoded: `&${tempEnt};`,
                    rangeValDecoded: decodedEntity,
                  },
                  null,
                  4
                )}`
              );
              rangesArr2.push({
                ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                entityName: tempEnt,
                rangeFrom: whatsOnTheLeft,
                rangeTo: tempRes.rightmostChar + 1,
                rangeValEncoded: `&${tempEnt};`,
                rangeValDecoded: decodedEntity,
              });
            }
            // ELSE, it was just a legit ampersand
          }
        } else if (
          str[whatsOnTheLeft] !== "&" &&
          str[whatsEvenMoreToTheLeft] !== "&" &&
          str[i] === ";"
        ) {
          //
          //
          //
          //
          // CASE 2 - CHECK FOR MISSING AMPERSAND
          //
          //
          //
          //

          console.log(
            `1006 ${`\u001b[${35}m${`ampersand might be missing`}\u001b[${39}m`}`
          );
          // check, what's on the left of str[i], is it any of known named HTML
          // entities. There are two thousand of them so we'll match by last
          // two characters. For posterity, we assume there can be any amount of
          // whitespace between characters and we need to tackle it as well.
          const lastChar = left(str, i);
          const secondToLast = lastChar ? left(str, lastChar) : null;
          // we'll tap the "entEndsWith" from npm package "all-named-html-entities"
          // which gives a plain object of named entities, all grouped by first
          // and second character first. This reduces amount of matching needed.

          // TODO - match case-insensitive first, then match case-sensitive:
          if (
            secondToLast !== null &&
            Object.prototype.hasOwnProperty.call(entEndsWith, str[lastChar]) &&
            Object.prototype.hasOwnProperty.call(
              entEndsWith[str[lastChar]],
              str[secondToLast]
            )
          ) {
            console.log(`1027`);
            let tempEnt;
            let tempRes;

            let temp1 = entEndsWith[str[lastChar]][str[secondToLast]].reduce(
              (gatheredSoFar, oneOfKnownEntities) => {
                // find all entities that match on the right of here
                // rightSeq could theoretically give positive answer, zero index,
                // but it's impossible here, so we're fine to match "if true".
                const tempRes = leftSeq(
                  str,
                  i,
                  ...oneOfKnownEntities.split("")
                );
                if (
                  tempRes &&
                  oneOfKnownEntities !== "nbsp" &&
                  !(
                    oneOfKnownEntities === "block" &&
                    str[left(str, letterSeqStartAt)] === ":"
                  )
                ) {
                  return gatheredSoFar.concat([
                    { tempEnt: oneOfKnownEntities, tempRes },
                  ]);
                }
                return gatheredSoFar;
              },
              []
            );

            console.log(
              `1059 ${`\u001b[${35}m${`temp1 BEFORE filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            temp1 = removeGappedFromMixedCases(temp1);
            console.log(
              `1067 ${`\u001b[${35}m${`temp1 AFTER filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
            console.log(
              `1077 ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt} - ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                tempRes,
                null,
                4
              )}`
            );

            console.log(
              `1085 letterSeqStartAt = ${letterSeqStartAt}; str[letterSeqStartAt] = ${
                str[letterSeqStartAt]
              }; tempRes.leftmostChar = ${
                tempRes && tempRes.leftmostChar
                  ? tempRes.leftmostChar
                  : "undefined"
              }; str[tempRes.leftmostChar - 1] = ${
                tempRes && tempRes.leftmostChar
                  ? str[tempRes.leftmostChar - 1]
                  : "undefined"
              }`
            );
            if (
              tempEnt &&
              (!Object.keys(uncertain).includes(tempEnt) ||
                uncertain[tempEnt].addAmpIfSemiPresent === true ||
                (uncertain[tempEnt].addAmpIfSemiPresent &&
                  (!tempRes.leftmostChar ||
                    (isStr(str[tempRes.leftmostChar - 1]) &&
                      !str[tempRes.leftmostChar - 1].trim().length))))
            ) {
              console.log(
                `1107 ${`\u001b[${35}m${`entity ${tempEnt} is indeed on the left of index ${i}, the situation is: ${JSON.stringify(
                  tempRes,
                  null,
                  4
                )}`}\u001b[${39}m`}`
              );

              const decodedEntity = decode(`&${tempEnt};`);

              console.log(
                `1117 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  {
                    ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                    entityName: tempEnt,
                    rangeFrom: tempRes.leftmostChar,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${tempEnt};`,
                    rangeValDecoded: decodedEntity,
                  },
                  null,
                  4
                )}`
              );
              rangesArr2.push({
                ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                entityName: tempEnt,
                rangeFrom: tempRes.leftmostChar,
                rangeTo: i + 1,
                rangeValEncoded: `&${tempEnt};`,
                rangeValDecoded: decodedEntity,
              });
            } else {
              console.log(
                `1140 ${`\u001b[${31}m${`██`}\u001b[${39}m`} "${tempEnt}" is among uncertain entities`
              );
            }
          } else if (brokenNumericEntityStartAt !== null) {
            // we have a malformed numeric entity reference, like #x26; without
            // an ampersand but with the rest of characters

            // 1. push the issue:
            console.log(
              `1149 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${brokenNumericEntityStartAt}, ${
                i + 1
              }]`
            );
            rangesArr2.push({
              ruleName: "bad-malformed-numeric-character-entity",
              entityName: null,
              rangeFrom: brokenNumericEntityStartAt,
              rangeTo: i + 1,
              rangeValEncoded: null,
              rangeValDecoded: null,
            });

            // 2. reset marker:
            brokenNumericEntityStartAt = null;
            console.log(
              `1165 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} brokenNumericEntityStartAt = null`
            );
          }
        } else if (str[whatsOnTheLeft] === "&" && str[i] === ";") {
          //
          //
          //
          //
          // CASE 3 - CHECK FOR MESSY ENTITIES OR REQUESTED DECODING
          //
          //
          //
          //
          console.log(
            `1179 ${`\u001b[${32}m${`██ looks like some sort of HTML entitity!`}\u001b[${39}m`}`
          );
          // find out more: is it legit, unrecognised or numeric...

          if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) {
            console.log(
              `1185 ${`\u001b[${90}m${`so there are some characters in between: & and ;`}\u001b[${39}m`}`
            );

            // Maybe it's a numeric entity?
            // we can simply check, does entity start with a hash but that
            // would be naive because this is a tool to catch and fix errors
            // and hash might be missing or mis-typed

            // So, we have confirmed ampersand, something in between and then
            // confirmed semicolon.

            // First, we extracted the contents of all this, "situation.charTrimmed".

            // By the way, Character-trimmed string where String.trim() is
            // applied to each character. This is needed so that our tool could
            // recognise whitespace gaps anywhere in the input. Imagine, for
            // example, "&# 85;" with rogue space. Errors like that require
            // constant trimming on the algorithm side.

            // We are going to describe numeric entity as
            // * something that starts with ampersand
            // * ends with semicolon
            // - has no letter characters AND at least one number character OR
            // - has more numeric characters than letters

            const situation = resemblesNumericEntity(
              str,
              whatsOnTheLeft + 1,
              i
            );
            console.log(
              `1216 ${`\u001b[${33}m${`situation`}\u001b[${39}m`} = ${JSON.stringify(
                situation,
                null,
                4
              )}`
            );

            if (situation.probablyNumeric) {
              console.log(
                `1225 ${`\u001b[${32}m${`██ seems like a numeric HTML entity!`}\u001b[${39}m`}`
              );

              // 1. TACKLE HEALTHY DECIMAL NUMERIC CHARACTER REFERENCE ENTITIES:
              if (
                situation.probablyNumeric &&
                situation.charTrimmed[0] === "#" &&
                !situation.whitespaceCount &&
                // decimal:
                ((!situation.lettersCount &&
                  situation.numbersCount > 0 &&
                  !situation.othersCount) ||
                  // hexidecimal:
                  ((situation.numbersCount || situation.lettersCount) &&
                    situation.charTrimmed[1] === "x" &&
                    !situation.othersCount))
              ) {
                // if it's a healthy decimal numeric character reference:
                const decodedEntitysValue = String.fromCharCode(
                  parseInt(
                    situation.charTrimmed.slice(
                      situation.probablyNumeric === "deci" ? 1 : 2
                    ),
                    situation.probablyNumeric === "deci" ? 10 : 16
                  )
                );
                console.log(
                  `1252 ${`\u001b[${32}m${`██ it's a ${
                    situation.probablyNumeric === "hexi" ? "hexi" : ""
                  }decimal numeric entity reference: "${decodedEntitysValue}"`}\u001b[${39}m`}`
                );

                if (
                  situation.probablyNumeric === "deci" &&
                  parseInt(situation.numbersValue, 10) > 918015
                ) {
                  console.log(
                    `1262 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                      {
                        ruleName: `bad-malformed-numeric-character-entity`,
                        entityName: null,
                        rangeFrom: whatsOnTheLeft,
                        rangeTo: i + 1,
                        rangeValEncoded: null,
                        rangeValDecoded: null,
                      },
                      null,
                      4
                    )}`
                  );
                  rangesArr2.push({
                    ruleName: `bad-malformed-numeric-character-entity`,
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null,
                  });
                } else if (opts.decode) {
                  // unless decoding was requested, no further action is needed:
                  console.log(
                    `1286 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                      {
                        ruleName: `encoded-numeric-html-entity-reference`,
                        entityName: situation.charTrimmed,
                        rangeFrom: whatsOnTheLeft,
                        rangeTo: i + 1,
                        rangeValEncoded: `&${situation.charTrimmed};`,
                        rangeValDecoded: decodedEntitysValue,
                      },
                      null,
                      4
                    )}`
                  );
                  rangesArr2.push({
                    ruleName: `encoded-numeric-html-entity-reference`,
                    entityName: situation.charTrimmed,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${situation.charTrimmed};`,
                    rangeValDecoded: decodedEntitysValue,
                  });
                }
              } else {
                // RAISE A GENERIC ERROR
                console.log(
                  `1311 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                    {
                      ruleName: `bad-malformed-numeric-character-entity`,
                      entityName: null,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: null,
                      rangeValDecoded: null,
                    },
                    null,
                    4
                  )}`
                );
                rangesArr2.push({
                  ruleName: `bad-malformed-numeric-character-entity`,
                  entityName: null,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null,
                });
              }

              // also call the general entity callback if it's given
              if (opts.entityCatcherCb) {
                console.log(`1336 call opts.entityCatcherCb()`);
                opts.entityCatcherCb(whatsOnTheLeft, i + 1);
              }
            } else {
              // it's either named or some sort of messed up HTML entity

              //
              //
              //
              //
              //          NAMED ENTITIES CLAUSES BELOW
              //
              //
              //
              //

              // First, match against case-insensitive list

              // 1. check, maybe it's a known HTML entity
              const firstChar = letterSeqStartAt;
              const secondChar = letterSeqStartAt
                ? right(str, letterSeqStartAt)
                : null;
              console.log(
                `1360 firstChar = str[${firstChar}] = ${str[firstChar]}; secondChar = str[${secondChar}] = ${str[secondChar]}`
              );

              let tempEnt;

              if (
                Object.prototype.hasOwnProperty.call(
                  brokenNamedEntities,
                  situation.charTrimmed.toLowerCase()
                )
              ) {
                //
                //                          case I.
                //

                console.log(
                  `1376 ${`\u001b[${32}m${`██`}\u001b[${39}m`} known broken entity ${situation.charTrimmed.toLowerCase()} is indeed on the right`
                );

                console.log(
                  `1380 broken entity ${situation.charTrimmed.toLowerCase()} is indeed on the right`
                );
                tempEnt = situation.charTrimmed;

                const decodedEntity = decode(
                  `&${
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                  };`
                );

                console.log(
                  `1391 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                    {
                      ruleName: `bad-named-html-entity-malformed-${
                        brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                      }`,
                      entityName:
                        brokenNamedEntities[
                          situation.charTrimmed.toLowerCase()
                        ],
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: `&${
                        brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                      };`,
                      rangeValDecoded: decodedEntity,
                    },
                    null,
                    4
                  )}`
                );
                rangesArr2.push({
                  ruleName: `bad-named-html-entity-malformed-${
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                  }`,
                  entityName:
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()],
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: `&${
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                  };`,
                  rangeValDecoded: decodedEntity,
                });
              } else if (
                Object.prototype.hasOwnProperty.call(
                  entStartsWithCaseInsensitive,
                  str[firstChar].toLowerCase()
                ) &&
                Object.prototype.hasOwnProperty.call(
                  entStartsWithCaseInsensitive[str[firstChar].toLowerCase()],
                  str[secondChar].toLowerCase()
                )
              ) {
                //
                //                          case II.
                //

                let tempRes;
                console.log(
                  `1440 ${`\u001b[${90}m${`seems first two characters might be from an HTML entity...`}\u001b[${39}m`}`
                );

                let matchedEntity = entStartsWithCaseInsensitive[
                  str[firstChar].toLowerCase()
                ][str[secondChar].toLowerCase()].reduce(
                  (gatheredSoFar, oneOfKnownEntities) => {
                    // find all entities that match on the right of here
                    // rightSeq could theoretically give positive answer, zero index,
                    // but it's impossible here, so we're fine to match "if true".
                    const tempRes = rightSeq(
                      str,
                      letterSeqStartAt - 1,
                      {
                        i: true,
                      },
                      ...oneOfKnownEntities.split("")
                    );
                    if (tempRes && oneOfKnownEntities !== "nbsp") {
                      return gatheredSoFar.concat([
                        { tempEnt: oneOfKnownEntities, tempRes },
                      ]);
                    }
                    return gatheredSoFar;
                  },
                  []
                );

                console.log(
                  `1469 ${`\u001b[${35}m${`matchedEntity BEFORE filtering = ${JSON.stringify(
                    matchedEntity,
                    null,
                    4
                  )}`}\u001b[${39}m`}`
                );
                matchedEntity = removeGappedFromMixedCases(matchedEntity);
                console.log(
                  `1477 ${`\u001b[${35}m${`matchedEntity AFTER filtering = ${JSON.stringify(
                    matchedEntity,
                    null,
                    4
                  )}`}\u001b[${39}m`}`
                );
                if (matchedEntity) {
                  ({ tempEnt, tempRes } = matchedEntity);
                }
                console.log(
                  `1487 ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt}; ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                    tempRes,
                    null,
                    4
                  )}`
                );

                // The matching was case insensitive so if anything was found,
                // it could contain whitespace, or it could contain wrong case.
                // If no matches were found, it's definitely an unrecognised entity.
                //
                // Another consideration is chunks starting with entity's ampersand,
                // missing semicolon and chunk ends with legit semicolon:
                // "We spent &pound5;" -> "We spent &pound;5;"
                //                                        ^ ^
                //                                       /   \
                //                                 missing   legit semicol.
                //                                   added
                let entitysValue;
                if (tempEnt) {
                  console.log(
                    `1508 ${`\u001b[${32}m${`entity ${tempEnt} is indeed on the right of index ${letterSeqStartAt}, the situation is: ${JSON.stringify(
                      tempRes,
                      null,
                      4
                    )}`}\u001b[${39}m`}`
                  );

                  let issue = false;
                  const firstChar = tempRes.leftmostChar;
                  const secondChar = right(str, firstChar);
                  console.log(
                    `1519 ${`\u001b[${33}m${`firstChar`}\u001b[${39}m`}: str[${firstChar}] = ${
                      str[firstChar]
                    }; ${`\u001b[${33}m${`secondChar`}\u001b[${39}m`}: str[${secondChar}] = ${
                      str[secondChar]
                    }; ${`\u001b[${33}m${`potentialEntity`}\u001b[${39}m`} = "${potentialEntity}"`
                  );

                  // precaution against false positives

                  // catch the bail cases:
                  // if it's among uncertain entities, if there is whitespace
                  // around the entity's characters, bail, unless values
                  // un uncertain.json are set to true on that side (amp or
                  // semicol respectively).
                  if (
                    Object.keys(uncertain).includes(potentialEntity) &&
                    isStr(str[firstChar - 1]) &&
                    !str[firstChar - 1].trim().length &&
                    uncertain[potentialEntity].addAmpIfSemiPresent !== true
                  ) {
                    console.log(
                      `1540 ${`\u001b[${31}m${`██`}\u001b[${39}m`} CONTINUE - bail clauses`
                    );
                    letterSeqStartAt = null;
                    continue;
                  }

                  // 1. check case-insensitive matched entity "tempEnt"
                  // case-sensitively
                  if (
                    Object.prototype.hasOwnProperty.call(
                      entStartsWith,
                      str[firstChar]
                    ) &&
                    Object.prototype.hasOwnProperty.call(
                      entStartsWith[str[firstChar]],
                      str[secondChar]
                    ) &&
                    entStartsWith[str[firstChar]][str[secondChar]].includes(
                      situation.charTrimmed
                    )
                  ) {
                    entitysValue = situation.charTrimmed;
                    console.log(
                      `1563 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} entitysValue = ${entitysValue}`
                    );
                    console.log(
                      `1566 entity ${`\u001b[${32}m${
                        situation.charTrimmed
                      }\u001b[${39}m`} is matched case-wise stricly`
                    );
                    // so entity's case is right, but what about whitespace
                    // between characters?
                    console.log(
                      `1573 i=${i} - whatsOnTheLeft=${whatsOnTheLeft} => ${
                        i - whatsOnTheLeft
                      }`
                    );
                    console.log(`1577 tempEnt.length = ${tempEnt.length}`);
                    if (i - whatsOnTheLeft - 1 === tempEnt.length) {
                      console.log(
                        `1580 ${`\u001b[${32}m${`██`}\u001b[${39}m`} entity is healthy`
                      );
                      // but it's still an issue if decoding was requested:
                      if (opts.decode) {
                        issue = "encoded-html-entity";
                      }
                    } else {
                      console.log(
                        `1588 ${`\u001b[${31}m${`██ entity has correct characters but has whitespace`}\u001b[${39}m`}`
                      );
                      issue = "bad-named-html-entity-malformed";
                      console.log(
                        `1592 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} issue = ${JSON.stringify(
                          issue,
                          null,
                          0
                        )}`
                      );
                    }
                  } else {
                    // case is wrong
                    console.log(
                      `1602 entity ${situation.charTrimmed} not found case-wise stricly`
                    );
                    issue = "bad-named-html-entity-malformed";
                    console.log(
                      `1606 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`issue`}\u001b[${39}m`} = ${JSON.stringify(
                        issue,
                        null,
                        0
                      )};`
                    );

                    // entitysValue = potentialEntity;

                    // Now, we know that our entity "situation.charTrimmed" does exist but
                    // in different character case.
                    // Let's first gather entities that match case-insensitively,
                    // then pick the one that our matched resembles most.
                    const matchingEntities = Object.keys(
                      allNamedEntities
                    ).filter((entity) =>
                      situation.charTrimmed
                        .toLowerCase()
                        .startsWith(entity.toLowerCase())
                    );
                    console.log(
                      `1627 SET ${`\u001b[${33}m${`matchingEntities`}\u001b[${39}m`} = ${JSON.stringify(
                        matchingEntities,
                        null,
                        4
                      )}`
                    );

                    if (matchingEntities.length === 1) {
                      // if there is one match, Bob's your uncle here's your result
                      entitysValue = matchingEntities[0];
                      console.log(
                        `1638 SET ${`\u001b[${33}m${`entitysValue`}\u001b[${39}m`} = ${JSON.stringify(
                          entitysValue,
                          null,
                          4
                        )}`
                      );
                    } else {
                      // let's pick one.

                      // first, filter the longest entity by length:
                      const filterLongest = matchingEntities.reduce(
                        (accum, curr) => {
                          if (
                            !accum.length ||
                            curr.length === accum[0].length
                          ) {
                            return accum.concat([curr]);
                          }
                          if (curr.length > accum[0].length) {
                            return [curr];
                          }
                          return accum;
                        },
                        []
                      );
                      console.log(
                        `1664 SET ${`\u001b[${33}m${`filterLongest`}\u001b[${39}m`} = ${JSON.stringify(
                          filterLongest,
                          null,
                          4
                        )}`
                      );

                      if (filterLongest.length === 1) {
                        entitysValue = filterLongest[0];
                        console.log(
                          `1674 SET ${`\u001b[${33}m${`entitysValue`}\u001b[${39}m`} = ${JSON.stringify(
                            entitysValue,
                            null,
                            4
                          )}`
                        );
                      } else {
                        console.log("1681");
                        const missingLetters = filterLongest.map((entity) => {
                          let count = 0;
                          for (let z = 0, len = entity.length; z < len; z++) {
                            if (entity[z] !== situation.charTrimmed[z]) {
                              count++;
                            }
                          }
                          return count;
                        });
                        // catch ambiguous cases - if there are multiple cases of
                        // minimum missing letter matches, it's inconclusive.
                        // For example, &Aelig; can be either:
                        // * &AElig; accidentally with E in lowercase
                        // * &aelig; accidentally with A in uppercase
                        if (
                          missingLetters.filter(
                            (val) => val === Math.min(...missingLetters)
                          ).length > 1
                        ) {
                          console.log(
                            `1702 ${`\u001b[${31}m${`██ ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} unrecognised to rangesArr2[]`}\u001b[${39}m`}`
                          );
                          rangesArr2.push({
                            ruleName: `bad-named-html-entity-unrecognised`,
                            entityName: null,
                            rangeFrom: whatsOnTheLeft,
                            rangeTo:
                              tempRes.rightmostChar + 1 === i
                                ? i + 1
                                : tempRes.rightmostChar + 1,
                            rangeValEncoded: null,
                            rangeValDecoded: null,
                          });
                          issue = false;
                        }

                        console.log(
                          `1719 SET ${`\u001b[${33}m${`missingLetters`}\u001b[${39}m`} = ${JSON.stringify(
                            missingLetters,
                            null,
                            4
                          )}`
                        );
                        entitysValue =
                          filterLongest[
                            missingLetters.indexOf(Math.min(...missingLetters))
                          ];
                        console.log(
                          `1730 SET ${`\u001b[${33}m${`entitysValue`}\u001b[${39}m`} = ${JSON.stringify(
                            entitysValue,
                            null,
                            4
                          )}`
                        );
                      }
                    }
                  }

                  // let endingIdx = Math.max(i + 1, tempRes.rightmostChar + 1);
                  // was:
                  let endingIdx =
                    tempRes.rightmostChar + 1 === i
                      ? i + 1
                      : tempRes.rightmostChar + 1;

                  console.log(
                    `1748 SET ${`\u001b[${32}m${`endingIdx`}\u001b[${39}m`} = ${endingIdx}`
                  );

                  // 2. submit the issue
                  if (issue) {
                    console.log(
                      `1754 ${`\u001b[${90}m${`within issue clauses`}\u001b[${39}m`}`
                    );
                    const decodedEntity = decode(`&${entitysValue};`);

                    console.log(
                      `1759 ${`\u001b[${33}m${`███████████████████████████████████████`}\u001b[${39}m`}\ntempRes.rightmostChar + 1 = ${
                        tempRes.rightmostChar + 1
                      }; i = ${i}`
                    );

                    if (
                      str[endingIdx] &&
                      str[endingIdx] !== ";" &&
                      !str[endingIdx].trim().length &&
                      str[right(str, endingIdx)] === ";"
                    ) {
                      endingIdx = right(str, endingIdx) + 1;
                      console.log(
                        `1772 OFFSET ${`\u001b[${32}m${`endingIdx`}\u001b[${39}m`} = ${endingIdx}`
                      );
                    }

                    console.log(
                      `1777 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                        {
                          ruleName: `${issue}-${entitysValue}`,
                          entityName: entitysValue,
                          rangeFrom: whatsOnTheLeft,
                          rangeTo: endingIdx,
                          rangeValEncoded: `&${entitysValue};`,
                          rangeValDecoded: decodedEntity,
                        },
                        null,
                        4
                      )}`
                    );
                    rangesArr2.push({
                      ruleName: `${issue}-${entitysValue}`,
                      entityName: entitysValue,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: endingIdx,
                      rangeValEncoded: `&${entitysValue};`,
                      rangeValDecoded: decodedEntity,
                    });
                  }

                  // 3. ping the entity callback anyway
                  if (opts.entityCatcherCb) {
                    console.log(`1802 call opts.entityCatcherCb()`);
                    opts.entityCatcherCb(whatsOnTheLeft, endingIdx);
                  }
                }
              }

              // if "tempEnt" was not set by now, it is not a known HTML entity
              if (!tempEnt) {
                console.log(
                  `1811 ${`\u001b[${90}m${`so it's not one of known named HTML entities`}\u001b[${39}m`}`
                );
                console.log(
                  `1814 ${`\u001b[${90}m${`checking for broken recognised entities`}\u001b[${39}m`}`
                );

                // check case-insensitively, is it a known broken entity,
                // for example &poun; (instead of &pound;) - this comes from
                // an ad-hoc object "brokenNamedEntities" from
                // package "all-named-html-entities".
                if (situation.charTrimmed.toLowerCase() !== "&nbsp;") {
                  // it's an unrecognised entity:
                  console.log(
                    `1824 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} bad-named-html-entity-unrecognised [${whatsOnTheLeft}, ${
                      i + 1
                    }]`
                  );
                  rangesArr2.push({
                    ruleName: `bad-named-html-entity-unrecognised`,
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null,
                  });

                  // entity catcher is pinged only with healthy entities -
                  // it's either cb() with broken or catcher - not both.
                  // if (opts.entityCatcherCb) {
                  //   console.log(`1831 call opts.entityCatcherCb()`);
                  //   opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                  // }
                }
              }

              //
              //
              //
              //
              //          NAMED ENTITIES CLAUSES ABOVE
              //
              //
              //
              //
            }
          }
        } else if (
          str[whatsEvenMoreToTheLeft] === "&" &&
          str[i] === ";" &&
          i - whatsEvenMoreToTheLeft < maxLength
        ) {
          //
          //
          //
          //
          // CASE 4 - &*...;
          //
          //
          //
          //
          console.log(
            `1872 ${`\u001b[${32}m${`██`}\u001b[${39}m`} might be a messy entity. We have "${str.slice(
              whatsEvenMoreToTheLeft,
              i + 1
            )}"`
          );
          const situation = resemblesNumericEntity(
            str,
            whatsEvenMoreToTheLeft + 1,
            i
          );
          console.log(
            `1883 ${`\u001b[${32}m${`██ situation:`}\u001b[${39}m`}\n${JSON.stringify(
              situation,
              null,
              4
            )}`
          );

          // push the issue:
          console.log(
            `1892 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whatsEvenMoreToTheLeft}, ${
              i + 1
            }]`
          );

          rangesArr2.push({
            ruleName: `${
              situation.probablyNumeric
                ? "bad-malformed-numeric-character-entity"
                : "bad-named-html-entity-unrecognised"
            }`,
            entityName: null,
            rangeFrom: whatsEvenMoreToTheLeft,
            rangeTo: i + 1,
            rangeValEncoded: null,
            rangeValDecoded: null,
          });
        }
      }

      // one-character chunks or chunks ending with ampersand get wiped:
      letterSeqStartAt = null;
      console.log(
        `1915 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = null`
      );
    }

    // Catch the start of the sequence of latin letters. It's necessary to
    // tackle named HTML entity recognition, missing ampersands and semicolons.

    if (
      letterSeqStartAt === null &&
      isLatinLetterOrNumberOrHash(str[i]) &&
      str[i + 1]
    ) {
      letterSeqStartAt = i;
      console.log(
        `1929 SET ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = ${letterSeqStartAt}`
      );
    }

    // catch amp;
    if (str[i] === "a") {
      // TODO - rebase with chomp()

      console.log(`1937 ${`\u001b[${90}m${`within a clauses`}\u001b[${39}m`}`);
      // // 1. catch recursively-encoded cases. They're easy actually, the task will
      // // be deleting sequence of repeated "amp;" between ampersand and letter.

      // For example, we have this:
      // text&   amp  ;  a  m   p   ;  nbsp;text
      // We start at the opening ampersand at index 4;
      const singleAmpOnTheRight = rightSeq(str, i, "m", "p", ";");
      if (singleAmpOnTheRight) {
        console.log(
          `1947 ${`\u001b[${90}m${`confirmed amp; from index ${i} onwards`}\u001b[${39}m`}`
        );

        // if we had to delete all amp;amp;amp; and leave only ampersand, this
        // will be the index to delete up to:
        let toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        console.log(
          `1954 SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`
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
            `1968 ${`\u001b[${90}m${`confirmed another amp; on the right of index ${singleAmpOnTheRight.rightmostChar}`}\u001b[${39}m`}`
          );

          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          console.log(
            `1973 SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`
          );

          let temp;
          do {
            console.log(
              `1979 ${`\u001b[${36}m${`======== loop ========`}\u001b[${39}m`}`
            );
            temp = rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");
            console.log(
              `1983 ${`\u001b[${36}m${`temp = ${JSON.stringify(
                temp,
                null,
                4
              )}`}\u001b[${39}m`}`
            );

            if (temp) {
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
              console.log(
                `1993 ${`\u001b[${36}m${`another amp; confirmed! Now`}\u001b[${39}m`} ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
                  toDeleteAllAmpEndHere,
                  null,
                  4
                )};`
              );
            }
          } while (temp);

          console.log(
            `2003 FINAL ${`\u001b[${32}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
              toDeleteAllAmpEndHere,
              null,
              4
            )}`
          );
        }

        // What we have is toDeleteAllAmpEndHere which marks where the last amp;
        // semicolon ends (were we to delete the whole thing).
        // For example, in:
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // this would be index 49, the "n" from "nbsp;"

        const firstCharThatFollows = right(str, toDeleteAllAmpEndHere - 1);
        const secondCharThatFollows = firstCharThatFollows
          ? right(str, firstCharThatFollows)
          : null;
        console.log(
          `2022 SET initial ${`\u001b[${33}m${`firstCharThatFollows`}\u001b[${39}m`} = str[${firstCharThatFollows}] = ${
            str[firstCharThatFollows]
          }; ${`\u001b[${33}m${`secondCharThatFollows`}\u001b[${39}m`} = str[${secondCharThatFollows}] = ${
            str[secondCharThatFollows]
          }`
        );

        // If entity follows, for example,
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // we delete from the first ampersand to the beginning of that entity.
        // Otherwise, we delete only repetitions of amp; + whitespaces in between.
        let matchedTemp;
        let matchedVal;
        if (
          secondCharThatFollows &&
          Object.prototype.hasOwnProperty.call(
            entStartsWith,
            str[firstCharThatFollows]
          ) &&
          Object.prototype.hasOwnProperty.call(
            entStartsWith[str[firstCharThatFollows]],
            str[secondCharThatFollows]
          ) &&
          entStartsWith[str[firstCharThatFollows]][
            str[secondCharThatFollows]
          ].some((entity) => {
            // if (str.entStartsWith(`${entity};`, firstCharThatFollows)) {
            const matchEntityOnTheRight = rightSeq(
              str,
              toDeleteAllAmpEndHere - 1,
              ...entity.slice("")
            );
            if (matchEntityOnTheRight) {
              matchedTemp = entity;
              matchedVal = matchEntityOnTheRight;
              return true;
            }
          })
        ) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1;
          console.log(
            `2063 ${`\u001b[${31}m${`██ ACTIVATE doNothingUntil = ${doNothingUntil}`}\u001b[${39}m`}`
          );

          console.log(
            `2067 ENTITY ${`\u001b[${32}m${matchedTemp}\u001b[${39}m`} FOLLOWS`
          );
          // is there ampersand on the left of "i", the first amp;?
          const whatsOnTheLeft = left(str, i);

          if (str[whatsOnTheLeft] === "&") {
            console.log(`2073 ampersand on the left`);
            console.log(
              `2075 ${`\u001b[${33}m${`matchedTemp`}\u001b[${39}m`} = ${JSON.stringify(
                matchedTemp,
                null,
                4
              )}; ${`\u001b[${33}m${`matchedVal`}\u001b[${39}m`} = ${JSON.stringify(
                matchedVal,
                null,
                4
              )}`
            );
            console.log(
              `2086 push ${JSON.stringify(
                {
                  ruleName: "bad-named-html-entity-multiple-encoding",
                  entityName: matchedTemp,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: doNothingUntil,
                  rangeValEncoded: `&${matchedTemp};`,
                  rangeValDecoded: decode(`&${matchedTemp};`),
                },
                null,
                4
              )}`
            );
            rangesArr2.push({
              ruleName: "bad-named-html-entity-multiple-encoding",
              entityName: matchedTemp,
              rangeFrom: whatsOnTheLeft,
              rangeTo: doNothingUntil,
              rangeValEncoded: `&${matchedTemp};`,
              rangeValDecoded: decode(`&${matchedTemp};`),
            });
          } else if (whatsOnTheLeft) {
            // we need to add the ampersand as well. Now, another consideration
            // appears: whitespace and where exactly to put it. Algorithmically,
            // right here, at this first letter "a" from "amp;&<some-entity>;"
            const rangeFrom = i;
            console.log(`2112 rangeFrom = ${rangeFrom}`);
            const spaceReplacement = "";

            if (str[i - 1] === " ") {
              console.log(`2116`);
              // chomp spaces to the left, but otherwise, don't touch anything
              // TODO
            }
            console.log(`2120 final rangeFrom = ${rangeFrom}`);

            if (opts.cb) {
              console.log(
                `2124 push ${JSON.stringify(
                  {
                    ruleName: "bad-named-html-entity-multiple-encoding",
                    entityName: matchedTemp,
                    rangeFrom: rangeFrom,
                    rangeTo: doNothingUntil,
                    rangeValEncoded: `${spaceReplacement}&${matchedTemp};`,
                    rangeValDecoded: `${spaceReplacement}${decode(
                      `&${matchedTemp};`
                    )}`,
                  },
                  null,
                  4
                )}`
              );
              rangesArr2.push({
                ruleName: "bad-named-html-entity-multiple-encoding",
                entityName: matchedTemp,
                rangeFrom: rangeFrom,
                rangeTo: doNothingUntil,
                rangeValEncoded: `${spaceReplacement}&${matchedTemp};`,
                rangeValDecoded: `${spaceReplacement}${decode(
                  `&${matchedTemp};`
                )}`,
              });
            }
          }
        }
      }
    }

    // catch ampersand
    if (str[i] === "&") {
      console.log(`2157 ${`\u001b[${90}m${`& caught`}\u001b[${39}m`}`);

      // 1. Tackle false positives, where ampersand follows the caught characters
      if (
        nbsp.nameStartsAt &&
        nbsp.nameStartsAt < i &&
        (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)
      ) {
        console.log(
          `2166 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} nbsp markers because ampersand follows a tag beginning`
        );
        nbspWipe();
      }

      // 2. mark the potential beginning of an nbsp:
      // if (nbsp.nameStartsAt === null) {
      //   // 2-1. Tag beginning has not been marked.
      //   if (nbsp.ampersandNecessary === null) {
      //     // The check above is for not false but null.
      //
      //     // mark the beginning
      //     nbsp.nameStartsAt = i;
      //     console.log(
      //       `2170 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
      //         nbsp.nameStartsAt
      //       }`
      //     );
      //     nbsp.ampersandNecessary = false;
      //     console.log(
      //       `2176 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
      //         nbsp.ampersandNecessary
      //       }`
      //     );
      //   }
      // }

      nbsp.nameStartsAt = i;
      console.log(
        `2195 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
          nbsp.nameStartsAt
        }`
      );
      nbsp.ampersandNecessary = false;
      console.log(
        `2201 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
          nbsp.ampersandNecessary
        }`
      );
    }

    // catch "n"
    if (str[i] && str[i].toLowerCase() === "n") {
      // failsafe
      if (
        str[i - 1] &&
        str[i - 1].toLowerCase() === "i" &&
        str[i + 1] &&
        str[i + 1].toLowerCase() === "s"
      ) {
        console.log("2216 pattern ...ins... detected - bail");
        nbspWipe();
        counter++;
        continue outerloop;
      }

      // action
      console.log("2223 n caught");
      if (nbsp.matchedN === null) {
        nbsp.matchedN = i;
        console.log(
          `2227 SET ${`\u001b[${33}m${`nbsp.matchedN`}\u001b[${39}m`} = ${
            nbsp.matchedN
          }`
        );
      }
      if (nbsp.nameStartsAt === null) {
        // 1. mark it
        nbsp.nameStartsAt = i;
        console.log(
          `2236 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
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
          `2249 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
            nbsp.ampersandNecessary
          }`
        );
      }
    }

    // catch "b"
    if (str[i] && str[i].toLowerCase() === "b") {
      console.log("2258 b caught");
      if (nbsp.nameStartsAt !== null) {
        // clean code, N was already detected
        if (nbsp.matchedB === null) {
          nbsp.matchedB = i;
          console.log(
            `2264 SET ${`\u001b[${33}m${`nbsp.matchedB`}\u001b[${39}m`} = ${
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
          `2276 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );

        // 2. mark the start
        nbsp.nameStartsAt = i;
        console.log(
          `2284 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedB = i;
        console.log(
          `2290 SET ${`\u001b[${33}m${`nbsp.matchedB`}\u001b[${39}m`} = true`
        );

        // 3. tend the ampersand situation
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          // if by now there are signs of ampersand records, it must be added later:
          nbsp.ampersandNecessary = true;
          console.log(
            `2298 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          // in all other cases, set it as not needed
          nbsp.ampersandNecessary = false;
          console.log(
            `2304 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        // wipe
        nbspWipe();
        console.log(`2310 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        counter++;
        continue outerloop;
      }
    }

    // catch "s"
    if (str[i] && str[i].toLowerCase() === "s") {
      console.log("2318 s caught");
      if (nbsp.nameStartsAt !== null) {
        // clean code
        if (nbsp.matchedS === null) {
          nbsp.matchedS = i;
          console.log(
            `2324 SET ${`\u001b[${33}m${`nbsp.matchedS`}\u001b[${39}m`} = ${
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
          `2336 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );

        // 2. mark the start
        nbsp.nameStartsAt = i;
        console.log(
          `2344 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedS = i;
        console.log(
          `2350 SET ${`\u001b[${33}m${`nbsp.matchedS`}\u001b[${39}m`} = true`
        );

        // 3. tend the ampersand situation
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          // if by now there are signs of ampersand records, it must be added later:
          nbsp.ampersandNecessary = true;
          console.log(
            `2358 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          // in all other cases, set it as not needed
          nbsp.ampersandNecessary = false;
          console.log(
            `2364 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        // wipe
        nbspWipe();
        console.log(`2370 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        counter++;
        continue outerloop;
      }
    }

    // catch "p"
    if (str[i] && str[i].toLowerCase() === "p") {
      if (leftSeq(str, i, "t", "h", "i", "n", "s")) {
        nbspWipe();
        console.log(`2380 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
      } else if (nbsp.nameStartsAt !== null) {
        console.log("2382 p caught");
        // clean code
        if (nbsp.matchedP === null) {
          nbsp.matchedP = i;
          console.log(
            `2387 SET ${`\u001b[${33}m${`nbsp.matchedP`}\u001b[${39}m`} = ${
              nbsp.matchedP
            }`
          );
        }
      } else if (nbsp.patience) {
        console.log("2393 p caught");
        // dirty code case because ampersand or "n" are missing so far

        // 1. Patience is reduced for every single character missing. There can
        // be only one character missing out of n-b-s-p.
        nbsp.patience--;
        console.log(
          `2400 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );

        // 2. mark the start
        nbsp.nameStartsAt = i;
        console.log(
          `2408 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedP = i;
        console.log(
          `2414 SET ${`\u001b[${33}m${`nbsp.matchedP`}\u001b[${39}m`} = true`
        );

        // 3. tend the ampersand situation
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          // if by now there are signs of ampersand records, it must be added later:
          nbsp.ampersandNecessary = true;
          console.log(
            `2422 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          // in all other cases, set it as not needed
          nbsp.ampersandNecessary = false;
          console.log(
            `2428 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        // wipe
        nbspWipe();
        console.log(`2434 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        counter++;
        continue outerloop;
      }
    }

    // catch semicolon
    if (str[i] === ";") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedSemicol = i;
        console.log(
          `2445 SET ${`\u001b[${33}m${`nbsp.matchedSemicol`}\u001b[${39}m`} = ${
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
          console.log(`2468 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        }
      }
    }

    // catch #x of messed up entities without ampersand (like #x26;)
    if (
      str[i] === "#" &&
      right(str, i) &&
      str[right(str, i)].toLowerCase() === "x" &&
      (!str[i - 1] || !left(str, i) || str[left(str, i)] !== "&")
    ) {
      console.log(
        `2481 ${`\u001b[${31}m${`██`}\u001b[${39}m`} #x pattern caught`
      );
      if (isNumber(str[right(str, right(str, i))])) {
        brokenNumericEntityStartAt = i;
      }
    }

    // // catch whitespace
    // if (str[i] && str[i].trim().length === 0 && nbsp.nameStartsAt !== null) {
    //   nbspWipe();
    //   console.log(`2481 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
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
        `2511 SET ${`\u001b[${33}m${`state_AmpersandNotNeeded`}\u001b[${39}m`} = ${JSON.stringify(
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
        console.log(`2548 nbsp.patience--, now equal to: ${nbsp.patience}`);
      } else {
        nbspWipe();
        console.log(`2551 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        counter++;
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
    console.log(
      `2570 ${`\u001b[${90}m${`letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`
    );
    // console.log(`state_AmpersandNotNeeded = ${state_AmpersandNotNeeded}`);
    // console.log(
    //   `${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} = ${JSON.stringify(
    //     nbsp,
    //     null,
    //     4
    //   )}${
    //     Array.isArray(rangesArr2) && rangesArr2.length
    //       ? `\n${`\u001b[${32}m${`rangesArr2`}\u001b[${39}m`} = ${JSON.stringify(
    //           rangesArr2,
    //           null,
    //           4
    //         )}`
    //       : ""
    //   }`
    // );
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

  if (!rangesArr2.length) {
    console.log(`2608 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} empty array`);
    return [];
  }

  console.log(
    `2613 IN THE END, before merge rangesArr2 = ${JSON.stringify(
      rangesArr2,
      null,
      4
    )}`
  );

  // return rangesArr2.map(opts.cb);

  // if any two issue objects have identical "from" indexes, remove the one
  // which spans more. For example, [4, 8] and [4, 12] would end up [4, 12]
  // winning and [4, 8] removed. Obviously, it's not arrays, it's objects,
  // format for example
  // {
  //     "ruleName": "bad-named-html-entity-malformed-amp",
  //     "entityName": "amp",
  //     "rangeFrom": 4,
  //     "rangeTo": 8,
  //     "rangeValEncoded": "&amp;",
  //     "rangeValDecoded": "&"
  // },
  // so instead of [4, 8] that would be [rangeFrom, rangeTo]...
  const res = rangesArr2
    .filter((filteredRangeObj, i) => {
      return rangesArr2.every((oneOfEveryObj, y) => {
        return (
          i === y ||
          !(
            filteredRangeObj.rangeFrom >= oneOfEveryObj.rangeFrom &&
            filteredRangeObj.rangeTo < oneOfEveryObj.rangeTo
          )
        );
      });
    })
    .filter((filteredRangeObj, i, allRangesArr) => {
      if (
        filteredRangeObj.ruleName === "bad-named-html-entity-unrecognised" &&
        allRangesArr.some((oneRangeObj, y) => {
          return (
            i !== y && // prevent matching itself
            oneRangeObj.rangeFrom <= filteredRangeObj.rangeFrom &&
            oneRangeObj.rangeTo === filteredRangeObj.rangeTo
          );
        })
      ) {
        return false;
      }
      // ELSE
      return true;
    })
    .map(opts.cb);

  // filteredRangeObj.rangeFrom !== oneOfEveryObj.rangeFrom ||
  // filteredRangeObj.rangeTo > oneOfEveryObj.rangeTo

  console.log(
    `2669 RETURN ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export default stringFixBrokenNamedEntities;

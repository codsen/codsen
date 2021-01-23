/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 4.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-fix-broken-named-entities/
 */

import leven from 'leven';
import { entStartsWith, decode, uncertain, entEndsWith, maxLength, allNamedEntitiesSetOnlyCaseInsensitive, allNamedEntitiesSetOnly, brokenNamedEntities } from 'all-named-html-entities';
import { right, rightSeq, left, leftSeq } from 'string-left-right';

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

function isLatinLetterOrNumberOrHash(char) {
  // we mean:
  // - Latin letters a-z or
  // - numbers 0-9 or
  // - letters A-Z or
  // - #
  return isStr(char) && char.length === 1 && (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 || char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) === 35);
}

function isNumeric(something) {
  return isStr(something) && something.charCodeAt(0) > 47 && something.charCodeAt(0) < 58;
}

function isStr(something) {
  return typeof something === "string";
}

function isLatinLetter(something) {
  return typeof something === "string" && (something.charCodeAt(0) > 96 && something.charCodeAt(0) < 123 || something.charCodeAt(0) > 64 && something.charCodeAt(0) < 91);
}

function resemblesNumericEntity(str2, from, to) {
  // plan: loop characters, count types, judge what's given
  let lettersCount = 0;
  let numbersCount = 0;
  let othersCount = 0;
  let hashesCount = 0;
  let whitespaceCount = 0;
  let numbersValue = "";
  let charTrimmed = "";

  for (let i = from; i < to; i++) {

    if (str2[i].trim().length) {
      charTrimmed += str2[i];
    } else {
      whitespaceCount += 1;
    }

    if (isLatinLetter(str2[i])) {
      lettersCount += 1;
    } else if (isNumeric(str2[i])) {
      numbersCount += 1;
      numbersValue += String(str2[i]);
    } else if (str2[i] === "#") {
      hashesCount += 1;
    } else {
      othersCount += 1;
    }
  } // if there are more numbers than letters (or equal) then it's more likely
  // to be a numeric entity


  let probablyNumeric = false; // if decimal-type, for example, &#999999;
  // but wide enough to include messed up cases

  if (!lettersCount && numbersCount > othersCount) {
    probablyNumeric = "deci";
  } else if ((numbersCount || lettersCount) && (charTrimmed[0] === "#" && charTrimmed[1].toLowerCase() === "x" && (isNumeric(charTrimmed[2]) || isLatinLetter(charTrimmed[2])) || charTrimmed[0].toLowerCase() === "x" && numbersCount && !othersCount)) {
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
    whitespaceCount
  };
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
  if (Array.isArray(temp1) && temp1.length) {
    if (temp1.length === 1) {
      // quick ending - only one value anyway
      return temp1[0];
    } // filter-out and return the longest-one


    return temp1.reduce((accum, tempObj) => {
      if (tempObj.tempEnt.length > accum.tempEnt.length) {
        return tempObj;
      }

      return accum;
    });
  }

  return temp1;
}

function removeGappedFromMixedCases(str, temp1) {
  /* istanbul ignore if */
  if (arguments.length !== 2) {
    throw new Error("removeGappedFromMixedCases(): wrong amount of inputs!");
  } // If there is one without gaps and all others with gaps, gapless
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

  if (Array.isArray(temp1) && temp1.length) {
    // prevent mutation:
    copy = Array.from(temp1); // 1. if some matches have semicolon to the right of rightmostChar and
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

    /* istanbul ignore if */

    if (copy.length > 1 && copy.some(entityObj => str[right(str, entityObj.tempRes.rightmostChar)] === ";") && copy.some(entityObj => str[right(str, entityObj.tempRes.rightmostChar)] !== ";")) {
      // filter out those with semicolon to the right of the last character:
      copy = copy.filter(entityObj => str[right(str, entityObj.tempRes.rightmostChar)] === ";");
    } // 2. if still there is more than one match, first exclude gapped if
    // there is mix of gapped vs. gapless. Then, return longest.
    // If all are either gapped or gapless, return longest.


    if (!(copy.every(entObj => !entObj || !entObj.tempRes || !entObj.tempRes.gaps || !Array.isArray(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length) || copy.every(entObj => entObj && entObj.tempRes && entObj.tempRes.gaps && Array.isArray(entObj.tempRes.gaps) && entObj.tempRes.gaps.length))) {
      // filter out entities with gaps, leave gapless-ones
      return findLongest(copy.filter(entObj => !entObj.tempRes.gaps || !Array.isArray(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length));
    }
  } // else if all entries don't have gaps, return longest


  return findLongest(temp1);
}

var version = "4.0.1";

/* eslint @typescript-eslint/ban-ts-comment:1 */
const version$1 = version;

function fixEnt(str, originalOpts) { //
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
    throw new Error(`string-fix-broken-named-entities: [THROW_ID_01] the first input argument must be string! It was given as:\n${JSON.stringify(str, null, 4)} (${typeof str}-type)`);
  }

  const defaults = {
    decode: false,
    cb: ({
      rangeFrom,
      rangeTo,
      rangeValEncoded,
      rangeValDecoded
    }) => rangeValDecoded || rangeValEncoded ? [rangeFrom, rangeTo, isObj(originalOpts) && originalOpts.decode ? rangeValDecoded : rangeValEncoded] : [rangeFrom, rangeTo],
    progressFn: null,
    entityCatcherCb: null
  };

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(`string-fix-broken-named-entities: [THROW_ID_02] the second input argument must be a plain object! I was given as:\n${JSON.stringify(originalOpts, null, 4)} (${typeof originalOpts}-type)`);
  }

  const opts = { ...defaults,
    ...originalOpts
  };

  if (opts.cb && typeof opts.cb !== "function") {
    throw new TypeError(`string-fix-broken-named-entities: [THROW_ID_03] opts.cb must be a function (or falsey)! Currently it's: ${typeof opts.cb}, equal to: ${JSON.stringify(opts.cb, null, 4)}`);
  }

  if (opts.entityCatcherCb && typeof opts.entityCatcherCb !== "function") {
    throw new TypeError(`string-fix-broken-named-entities: [THROW_ID_04] opts.entityCatcherCb must be a function (or falsey)! Currently it's: ${typeof opts.entityCatcherCb}, equal to: ${JSON.stringify(opts.entityCatcherCb, null, 4)}`);
  }

  if (opts.progressFn && typeof opts.progressFn !== "function") {
    throw new TypeError(`string-fix-broken-named-entities: [THROW_ID_05] opts.progressFn must be a function (or falsey)! Currently it's: ${typeof opts.progressFn}, equal to: ${JSON.stringify(opts.progressFn, null, 4)}`);
  } // state flags
  // ---------------------------------------------------------------------------
  // this is what we'll return, process by default callback or user's custom-one

  const rangesArr2 = [];
  let percentageDone;
  let lastPercentageDone; // allocate all 100 of progress to the main loop below

  const len = str.length + 1;
  let counter = 0; // doNothingUntil can be either falsey or truthy: index number or boolean true
  // If it's number, it's instruction to avoid actions until that index is
  // reached when traversing. If it's boolean, it means we don't know when we'll
  // stop, we just turn on the flag (permanently, for now).

  let doNothingUntil = null; // catch letter sequences, possibly separated with whitespace. Non-letter
  // breaks the sequence. Main aim is to catch names of encoded HTML entities
  // for example, nbsp from "&nbsp;"

  let letterSeqStartAt = null;
  let brokenNumericEntityStartAt = null; //                                      |
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

  for (let i = 0; i < len; i++) {
    if (opts.progressFn) {
      percentageDone = Math.floor(counter / len * 100);
      /* istanbul ignore else */

      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    } //            |
    //            |
    //            |
    //            |
    //            |
    // PART 1. FRONTAL LOGGING
    //            |
    //            |
    //            |
    //            |
    //            | //            |
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
      if (typeof doNothingUntil === "number" && i >= doNothingUntil) {
        doNothingUntil = null;
      } else {
        counter += 1;
        continue;
      }
    } //            |
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
    // escape latch for text chunks


    if (letterSeqStartAt !== null && i - letterSeqStartAt > 50) {
      letterSeqStartAt = null;
    } // Catch the end of a latin letter sequence.


    if (letterSeqStartAt !== null && (!str[i] || str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i]))) {

      if (i > letterSeqStartAt + 1) {
        const potentialEntity = str.slice(letterSeqStartAt, i);
        const whatsOnTheLeft = left(str, letterSeqStartAt);
        const whatsEvenMoreToTheLeft = whatsOnTheLeft ? left(str, whatsOnTheLeft) : ""; //
        //
        //
        //
        // CASE 1 - CHECK FOR MISSING SEMICOLON
        //
        //
        //
        //

        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) { // check, what's the index of the character to the right of
          // str[whatsOnTheLeft], is it any of the known named HTML entities.

          const firstChar = letterSeqStartAt;
          /* istanbul ignore next */

          const secondChar = letterSeqStartAt ? right(str, letterSeqStartAt) : null; // we'll tap the "entStartsWith" from npm package "all-named-html-entities"
          // which gives a plain object of named entities, all grouped by first
          // and second character first. This reduces amount of matching needed. // mind you, there can be overlapping variations of entities, for
          // example, &ang; and &angst;. Now, if you match "ang" from "&ang;",
          // starting from the left side (like we do using "entStartsWith"),
          // when there is "&angst;", answer will also be positive. And we can't
          // rely on semicolon being on the right because we are actually
          // catching MISSING semicolons here.
          // The only way around this is to match all entities that start here
          // and pick the one with the biggest character length.
          // TODO - set up case insensitive matching here:

          /* istanbul ignore else */

          if (Object.prototype.hasOwnProperty.call(entStartsWith, str[firstChar]) && Object.prototype.hasOwnProperty.call(entStartsWith[str[firstChar]], str[secondChar])) {
            let tempEnt = "";
            let tempRes;
            let temp1 = entStartsWith[str[firstChar]][str[secondChar]].reduce((gatheredSoFar, oneOfKnownEntities) => {
              // find all entities that match on the right of here
              // rightSeq could theoretically give positive answer, zero index,
              // but it's impossible here, so we're fine to match "if true".
              tempRes = rightSeq(str, letterSeqStartAt - 1, ...oneOfKnownEntities.split(""));

              if (tempRes) {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes
                }]);
              }

              return gatheredSoFar;
            }, []);
            temp1 = removeGappedFromMixedCases(str, temp1);
            /* istanbul ignore else */

            if (temp1) {
              ({
                tempEnt,
                tempRes
              } = temp1);
            }

            if (tempEnt && (!Object.keys(uncertain).includes(tempEnt) || !str[tempRes.rightmostChar + 1] || ["&"].includes(str[tempRes.rightmostChar + 1]) || (uncertain[tempEnt].addSemiIfAmpPresent === true || uncertain[tempEnt].addSemiIfAmpPresent && (!str[tempRes.rightmostChar + 1] || !str[tempRes.rightmostChar + 1].trim().length)) && str[tempRes.leftmostChar - 1] === "&")) {
              const decodedEntity = decode(`&${tempEnt};`);
              rangesArr2.push({
                ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                entityName: tempEnt,
                rangeFrom: whatsOnTheLeft || 0,
                rangeTo: tempRes.rightmostChar + 1,
                rangeValEncoded: `&${tempEnt};`,
                rangeValDecoded: decodedEntity
              });
            } // ELSE, it was just a legit ampersand

          }
        } else if (str[whatsOnTheLeft] !== "&" && str[whatsEvenMoreToTheLeft] !== "&" && str[i] === ";") {
          //
          //
          //
          //
          // CASE 2 - CHECK FOR MISSING AMPERSAND
          //
          //
          //
          // // check, what's on the left of str[i], is it any of known named HTML
          // entities. There are two thousand of them so we'll match by last
          // two characters. For posterity, we assume there can be any amount of
          // whitespace between characters and we need to tackle it as well.

          const lastChar = left(str, i);
          const secondToLast = left(str, lastChar); // we'll tap the "entEndsWith" from npm package "all-named-html-entities"
          // which gives a plain object of named entities, all grouped by first
          // and second character first. This reduces amount of matching needed.

          if (secondToLast !== null && Object.prototype.hasOwnProperty.call(entEndsWith, str[lastChar]) && Object.prototype.hasOwnProperty.call(entEndsWith[str[lastChar]], str[secondToLast])) {
            let tempEnt = "";
            let tempRes;
            let temp1 = entEndsWith[str[lastChar]][str[secondToLast]].reduce((gatheredSoFar, oneOfKnownEntities) => {
              // find all entities that match on the right of here
              // rightSeq could theoretically give positive answer, zero index,
              // but it's impossible here, so we're fine to match "if true".
              tempRes = leftSeq(str, i, ...oneOfKnownEntities.split(""));

              if (tempRes && !(oneOfKnownEntities === "block" && str[left(str, letterSeqStartAt)] === ":")) {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes
                }]);
              }

              return gatheredSoFar;
            }, []);
            temp1 = removeGappedFromMixedCases(str, temp1);
            /* istanbul ignore else */

            if (temp1) {
              ({
                tempEnt,
                tempRes
              } = temp1);
            }

            if (tempEnt && (!Object.keys(uncertain).includes(tempEnt) || uncertain[tempEnt].addAmpIfSemiPresent === true || uncertain[tempEnt].addAmpIfSemiPresent && (!tempRes.leftmostChar || isStr(str[tempRes.leftmostChar - 1]) && !str[tempRes.leftmostChar - 1].trim().length))) {
              const decodedEntity = decode(`&${tempEnt};`);
              rangesArr2.push({
                ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                entityName: tempEnt,
                rangeFrom: tempRes.leftmostChar,
                rangeTo: i + 1,
                rangeValEncoded: `&${tempEnt};`,
                rangeValDecoded: decodedEntity
              });
            }
          } else if (brokenNumericEntityStartAt !== null) {
            // we have a malformed numeric entity reference, like #x26; without
            // an ampersand but with the rest of characters
            // 1. push the issue:
            rangesArr2.push({
              ruleName: "bad-malformed-numeric-character-entity",
              entityName: null,
              rangeFrom: brokenNumericEntityStartAt,
              rangeTo: i + 1,
              rangeValEncoded: null,
              rangeValDecoded: null
            }); // 2. reset marker:

            brokenNumericEntityStartAt = null;
          }
        } else if ((str[whatsOnTheLeft] === "&" || str[whatsOnTheLeft] === ";" && str[whatsEvenMoreToTheLeft] === "&") && str[i] === ";") {
          //
          //
          //
          //
          // CASE 3 - CHECK FOR MESSY ENTITIES OR REQUESTED DECODING
          //
          //
          //
          // // find out more: is it legit, unrecognised or numeric...

          /* istanbul ignore else */

          if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) { // Maybe it's a numeric entity?
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

            const situation = resemblesNumericEntity(str, whatsOnTheLeft + 1, i);

            if (situation.probablyNumeric) { // 1. TACKLE HEALTHY DECIMAL NUMERIC CHARACTER REFERENCE ENTITIES:

              if (
              /* istanbul ignore next */
              situation.probablyNumeric && situation.charTrimmed[0] === "#" && !situation.whitespaceCount && ( // decimal:
              !situation.lettersCount && situation.numbersCount > 0 && !situation.othersCount || // hexidecimal:
              (situation.numbersCount || situation.lettersCount) && situation.charTrimmed[1] === "x" && !situation.othersCount)) {
                // if it's a healthy decimal numeric character reference:
                const decodedEntitysValue = String.fromCharCode(parseInt(situation.charTrimmed.slice(situation.probablyNumeric === "deci" ? 1 : 2), situation.probablyNumeric === "deci" ? 10 : 16));

                if (situation.probablyNumeric === "deci" && parseInt(situation.numbersValue, 10) > 918015) {
                  rangesArr2.push({
                    ruleName: `bad-malformed-numeric-character-entity`,
                    entityName: null,
                    rangeFrom: whatsOnTheLeft || 0,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                } else if (opts.decode) {
                  // unless decoding was requested, no further action is needed:
                  rangesArr2.push({
                    ruleName: `encoded-numeric-html-entity-reference`,
                    entityName: situation.charTrimmed,
                    rangeFrom: whatsOnTheLeft || 0,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${situation.charTrimmed};`,
                    rangeValDecoded: decodedEntitysValue
                  });
                }
              } else {
                // RAISE A GENERIC ERROR
                rangesArr2.push({
                  ruleName: `bad-malformed-numeric-character-entity`,
                  entityName: null,
                  rangeFrom: whatsOnTheLeft || 0,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null
                });
              } // also call the general entity callback if it's given


              if (opts.entityCatcherCb) {
                opts.entityCatcherCb(whatsOnTheLeft, i + 1);
              }
            } else { //
              //
              //
              //
              //          NAMED ENTITIES CLAUSES BELOW
              //
              //
              //
              //
              // happy path:

              const potentialEntityOnlyNonWhitespaceChars = Array.from(potentialEntity).filter(char => char.trim().length).join("");

              if (potentialEntityOnlyNonWhitespaceChars.length <= maxLength && allNamedEntitiesSetOnlyCaseInsensitive.has(potentialEntityOnlyNonWhitespaceChars.toLowerCase())) {

                if ( // first, check is the letter case allright
                !allNamedEntitiesSetOnly.has(potentialEntityOnlyNonWhitespaceChars)) {
                  const matchingEntitiesOfCorrectCaseArr = [...allNamedEntitiesSetOnly].filter(ent => ent.toLowerCase() === potentialEntityOnlyNonWhitespaceChars.toLowerCase());

                  if (matchingEntitiesOfCorrectCaseArr.length === 1) {
                    rangesArr2.push({
                      ruleName: `bad-named-html-entity-malformed-${matchingEntitiesOfCorrectCaseArr[0]}`,
                      entityName: matchingEntitiesOfCorrectCaseArr[0],
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: `&${matchingEntitiesOfCorrectCaseArr[0]};`,
                      rangeValDecoded: decode(`&${matchingEntitiesOfCorrectCaseArr[0]};`)
                    });
                  } else {
                    rangesArr2.push({
                      ruleName: `bad-named-html-entity-unrecognised`,
                      entityName: null,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: null,
                      rangeValDecoded: null
                    });
                  }
                } else if ( // is it really healthy? measuring distance is a way to find out
                // any present whitespace characters will bloat the length...
                i - whatsOnTheLeft - 1 !== potentialEntityOnlyNonWhitespaceChars.length || str[whatsOnTheLeft] !== "&") {
                  const rangeFrom = str[whatsOnTheLeft] === "&" ? whatsOnTheLeft : whatsEvenMoreToTheLeft;

                  if ( // if it's a dubious entity
                  Object.keys(uncertain).includes(potentialEntityOnlyNonWhitespaceChars) && // and there's space after ampersand
                  !str[rangeFrom + 1].trim().length) {
                    letterSeqStartAt = null;
                    continue;
                  }
                  rangesArr2.push({
                    ruleName: `bad-named-html-entity-malformed-${potentialEntityOnlyNonWhitespaceChars}`,
                    entityName: potentialEntityOnlyNonWhitespaceChars,
                    rangeFrom: rangeFrom,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${potentialEntityOnlyNonWhitespaceChars};`,
                    rangeValDecoded: decode(`&${potentialEntityOnlyNonWhitespaceChars};`)
                  });
                } else if (opts.decode) { // last thing, if decode is required, we've got an error still...
                  rangesArr2.push({
                    ruleName: `encoded-html-entity-${potentialEntityOnlyNonWhitespaceChars}`,
                    entityName: potentialEntityOnlyNonWhitespaceChars,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${potentialEntityOnlyNonWhitespaceChars};`,
                    rangeValDecoded: decode(`&${potentialEntityOnlyNonWhitespaceChars};`)
                  });
                } else if (opts.entityCatcherCb) {
                  // it's healthy - so at least ping the entity catcher
                  opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                }
                letterSeqStartAt = null;
                continue;
              } // First, match against case-insensitive list
              /* istanbul ignore next */

              letterSeqStartAt ? right(str, letterSeqStartAt) : null;
              let tempEnt = "";
              let temp;

              if (Object.prototype.hasOwnProperty.call(brokenNamedEntities, situation.charTrimmed.toLowerCase())) {
                //
                //                          case I.
                //
                tempEnt = situation.charTrimmed;
                const decodedEntity = decode(`&${brokenNamedEntities[situation.charTrimmed.toLowerCase()]};`);
                rangesArr2.push({
                  ruleName: `bad-named-html-entity-malformed-${brokenNamedEntities[situation.charTrimmed.toLowerCase()]}`,
                  entityName: brokenNamedEntities[situation.charTrimmed.toLowerCase()],
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: `&${brokenNamedEntities[situation.charTrimmed.toLowerCase()]};`,
                  rangeValDecoded: decodedEntity
                });
              } else if ( // idea being, if length of suspected chunk is less or equal to
              // the length of the longest entity (add 1 for Levenshtein distance)
              // we still consider that whole chunk (from ampersand to semi)
              // might be a value of an entity
              potentialEntity.length < maxLength + 2 && ( // a) either one character is different:
              (temp = [...allNamedEntitiesSetOnly].filter(curr => leven(curr, potentialEntity) === 1)) && temp.length || //
              // OR
              //
              // b) two are different but entity is at least 4 chars long:
              (temp = [...allNamedEntitiesSetOnly].filter(curr =>
              /* istanbul ignore next */
              leven(curr, potentialEntity) === 2 && potentialEntity.length > 3)) && temp.length)) { // now the problem: what if there were multiple entities matched?

                if (temp.length === 1) {
                  [tempEnt] = temp;
                  rangesArr2.push({
                    ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                    entityName: tempEnt,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${tempEnt};`,
                    rangeValDecoded: decode(`&${tempEnt};`)
                  });
                }
              } // if "tempEnt" was not set by now, it is not a known HTML entity


              if (!tempEnt) { // it's an unrecognised entity:
                rangesArr2.push({
                  ruleName: `bad-named-html-entity-unrecognised`,
                  entityName: null,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null
                });
              } //
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
        } else if (str[whatsEvenMoreToTheLeft] === "&" && str[i] === ";" && i - whatsEvenMoreToTheLeft < maxLength) {
          //
          //
          //
          //
          // CASE 4 - &*...;
          //
          //
          //
          //
          const situation = resemblesNumericEntity(str, whatsEvenMoreToTheLeft + 1, i); // push the issue:
          rangesArr2.push({
            ruleName: `${
            /* istanbul ignore next */
            situation.probablyNumeric ? "bad-malformed-numeric-character-entity" : "bad-named-html-entity-unrecognised"}`,
            entityName: null,
            rangeFrom: whatsEvenMoreToTheLeft,
            rangeTo: i + 1,
            rangeValEncoded: null,
            rangeValDecoded: null
          });
        }
      } // one-character chunks or chunks ending with ampersand get wiped:


      letterSeqStartAt = null;
    } // Catch the start of the sequence of latin letters. It's necessary to
    // tackle named HTML entity recognition, missing ampersands and semicolons.


    if (letterSeqStartAt === null && isLatinLetterOrNumberOrHash(str[i]) && str[i + 1]) {
      letterSeqStartAt = i;
    } // catch amp;


    if (str[i] === "a") { // // 1. catch recursively-encoded cases. They're easy actually, the task will
      // // be deleting sequence of repeated "amp;" between ampersand and letter.
      // For example, we have this:
      // text&   amp  ;  a  m   p   ;  nbsp;text
      // We start at the opening ampersand at index 4;

      const singleAmpOnTheRight = rightSeq(str, i, "m", "p", ";");

      if (singleAmpOnTheRight) { // if we had to delete all amp;amp;amp; and leave only ampersand, this
        // will be the index to delete up to:

        let toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1; // so one &amp; is confirmed.

        const nextAmpOnTheRight = rightSeq(str, singleAmpOnTheRight.rightmostChar, "a", "m", "p", ";");

        if (nextAmpOnTheRight) {
          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          let temp;

          do {
            temp = rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");

            if (temp) {
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
            }
          } while (temp);
        } // What we have is toDeleteAllAmpEndHere which marks where the last amp;
        // semicolon ends (were we to delete the whole thing).
        // For example, in:
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // this would be index 49, the "n" from "nbsp;"


        const firstCharThatFollows = right(str, toDeleteAllAmpEndHere - 1);
        const secondCharThatFollows = firstCharThatFollows ? right(str, firstCharThatFollows) : null; // If entity follows, for example,
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // we delete from the first ampersand to the beginning of that entity.
        // Otherwise, we delete only repetitions of amp; + whitespaces in between.

        let matchedTemp = "";

        if (secondCharThatFollows && Object.prototype.hasOwnProperty.call(entStartsWith, str[firstCharThatFollows]) && Object.prototype.hasOwnProperty.call(entStartsWith[str[firstCharThatFollows]], str[secondCharThatFollows]) && entStartsWith[str[firstCharThatFollows]][str[secondCharThatFollows]].some(entity => {
          // if (str.entStartsWith(`${entity};`, firstCharThatFollows)) {
          const matchEntityOnTheRight = rightSeq(str, toDeleteAllAmpEndHere - 1, ...entity.split(""));
          /* istanbul ignore else */

          if (matchEntityOnTheRight) {
            matchedTemp = entity;
            return true;
          }
        })) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1; // is there ampersand on the left of "i", the first amp;?

          const whatsOnTheLeft = left(str, i);
          /* istanbul ignore else */

          if (str[whatsOnTheLeft] === "&") {
            rangesArr2.push({
              ruleName: "bad-named-html-entity-multiple-encoding",
              entityName: matchedTemp,
              rangeFrom: whatsOnTheLeft || 0,
              rangeTo: doNothingUntil,
              rangeValEncoded: `&${matchedTemp};`,
              rangeValDecoded: decode(`&${matchedTemp};`)
            });
          } else if (whatsOnTheLeft) {
            // we need to add the ampersand as well. Now, another consideration
            // appears: whitespace and where exactly to put it. Algorithmically,
            // right here, at this first letter "a" from "amp;&<some-entity>;"
            const rangeFrom = i;
            const spaceReplacement = "";

            if (str[i - 1] === " ") ;
            /* istanbul ignore else */

            if (typeof opts.cb === "function") {
              rangesArr2.push({
                ruleName: "bad-named-html-entity-multiple-encoding",
                entityName: matchedTemp,
                rangeFrom,
                rangeTo: doNothingUntil,
                rangeValEncoded: `${spaceReplacement}&${matchedTemp};`,
                rangeValDecoded: `${spaceReplacement}${decode(`&${matchedTemp};`)}`
              });
            }
          }
        }
      }
    } // catch #x of messed up entities without ampersand (like #x26;)


    if (str[i] === "#" && right(str, i) && str[right(str, i)].toLowerCase() === "x" && (!str[i - 1] || !left(str, i) || str[left(str, i)] !== "&")) {

      if (isNumeric(str[right(str, right(str, i))])) {
        brokenNumericEntityStartAt = i;
      }
    } //            |
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
    counter += 1;
  } //                                      ^
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
    return [];
  } // return rangesArr2.map(opts.cb);
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

  const res = rangesArr2.filter((filteredRangeObj, i) => {
    return rangesArr2.every((oneOfEveryObj, y) => {
      return i === y || !(filteredRangeObj.rangeFrom >= oneOfEveryObj.rangeFrom && filteredRangeObj.rangeTo < oneOfEveryObj.rangeTo);
    });
  }).map(opts.cb);
  return res;
}

export { fixEnt, version$1 as version };

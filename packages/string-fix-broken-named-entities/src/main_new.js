/* eslint no-unused-vars: 0, no-cond-assign: 0 */

import leven from "leven";
import {
  entStartsWith,
  entEndsWith,
  allNamedEntities,
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  brokenNamedEntities,
  decode,
  maxLength,
  uncertain,
} from "all-named-html-entities";
import { left, right, rightSeq, leftSeq } from "string-left-right";
import {
  isNumber,
  isLatinLetterOrNumberOrHash,
  isObj,
  isStr,
  resemblesNumericEntity,
  removeGappedFromMixedCases,
} from "./util";

/**
 * stringFixBrokenNamedEntities - fixes broken named HTML entities
 *
 * @param  {string} inputString
 * @return {array}  ranges array OR null
 */
function stringFixBrokenNamedEntities(str, originalOpts) {
  console.log(
    `033 stringFixBrokenNamedEntities: ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
      str,
      null,
      0
    )};\n${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
      originalOpts,
      null,
      4
    )}`
  );

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
        ? [
            rangeFrom,
            rangeTo,
            isObj(originalOpts) && originalOpts.decode
              ? rangeValDecoded
              : rangeValEncoded,
          ]
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
      opts = { ...defaults, ...originalOpts };
      console.log(
        `096 stringFixBrokenNamedEntities: new ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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
    `134 stringFixBrokenNamedEntities: FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} used: ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // state flags
  // ---------------------------------------------------------------------------

  // this is what we'll return, process by default callback or user's custom-one
  const rangesArr2 = [];

  let percentageDone;
  let lastPercentageDone;

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

  // first non-letter char breaks the streak but it does not necessarily
  // mean the ending of the entity, there can be rogue whitespace!
  let letterSeqEndAt = null;

  let brokenNumericEntityStartAt = null;

  function push(obj) {
    console.log(
      `172 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
        obj,
        null,
        4
      )}`
    );
    rangesArr2.push(obj);

    // reset
    letterSeqStartAt = null;
    letterSeqEndAt = null;
  }

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
  for (let i = 0; i < len; i++) {
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
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
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
          `246 stringFixBrokenNamedEntities: RESET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = null`
        );
      } else {
        console.log(`249 stringFixBrokenNamedEntities: continue`);
        counter += 1;
        continue;
      }
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
        `274 ${`\u001b[${32}m${`end of a latin letter sequence`}\u001b[${39}m`}`
      );
      console.log(
        `277 ${`\u001b[${36}m${`██ letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`
      );
      if (i > letterSeqStartAt + 1) {
        const potentialEntity = str.slice(letterSeqStartAt, i);
        console.log(
          `282 stringFixBrokenNamedEntities: ${`\u001b[${35}m${`██ CARVED A SEQUENCE: ${potentialEntity}`}\u001b[${39}m`}`
        );
        const whatsOnTheLeft = left(str, letterSeqStartAt);
        const whatsEvenMoreToTheLeft = whatsOnTheLeft
          ? left(str, whatsOnTheLeft)
          : "";

        if (str[whatsOnTheLeft] === "&" && str[i] === ";") {
          //
          //
          //
          //
          //
          // CASE 1 - both amp and semi are present.
          //          happy path goes here
          //
          //
          //
          //
          console.log(
            `302 ${`\u001b[${32}m${`██ looks like some sort of HTML entitity!`}\u001b[${39}m`}`
          );
          // find out more: is it legit, unrecognised or numeric...

          if (
            // if there are characters in this range
            str.slice(whatsOnTheLeft + 1, i).trim().length > 1 &&
            // and it's not too big (longest entity is 32 chars-long) but allow
            // for rogue whitespace (generously)
            i - whatsOnTheLeft < 40
          ) {
            console.log(
              `314 ${`\u001b[${90}m${`so there are some characters in between: & and ;`}\u001b[${39}m`}`
            );

            let temp;

            // entities don't have spaces in them, so remove all whitespace
            // characters from this chunk to make it easier to evaluate it:
            const entName = Array.from(str.slice(whatsOnTheLeft + 1, i))
              .filter((char) => char.trim().length)
              .join("");

            // Check happy path
            if (
              // if a Set of known entity names includes this chunk, happy days
              allNamedEntitiesSetOnly.has(entName)
            ) {
              console.log(
                `331 ${`\u001b[${32}m${`CONFIRMED`}\u001b[${39}m`}, the entity name "${entName}" is recognised`
              );

              // finally, check for presence of rogue whitespace, for example,
              // & nbsp; - or & amp \t\t;

              if (Object.keys(uncertain).includes(entName)) {
                // don't touch dubious entities

                // wipe
                letterSeqStartAt = null;

                // continue
                console.log(`344 WIPE and CONTINUE - it's an uncertain entity`);
                continue;
              } else if (i && i - whatsOnTheLeft - 1 === entName.length) {
                console.log(" ");
                console.log(" ");
                console.log(" ");
                console.log(
                  `351 ${`\u001b[${32}m${`██ HAPPY PATH ██`}\u001b[${39}m`}, NO PROBLEM IN THIS ENTITY "${`\u001b[${36}m${`&${str.slice(
                    whatsOnTheLeft + 1,
                    i
                  )};`}\u001b[${39}m`}"`
                );
                console.log(" ");
                console.log(" ");
                console.log(" ");

                // reset:
                letterSeqStartAt = null;

                console.log(
                  `364 ${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`}, so as not to waste the resources further`
                );
              } else {
                console.log(
                  `368 ${`\u001b[${31}m${`ROGUE WHITESPACE PRESENT`}\u001b[${39}m`}`
                );
                console.log(`370 PUSH`);
                push({
                  ruleName: `encoded-numeric-html-entity-reference`,
                  entityName: entName,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: `&${entName};`,
                  rangeValDecoded: decode(`&${entName};`),
                });
              }

              console.log(`381 CONTINUE`);
              counter += 1;
              continue;
            } else if (
              // idea being, if length of suspected chunk is less or equal to
              // the length of the longest entity (add 1 for Levenshtein distance)
              // we still consider that whole chunk (from ampersand to semi)
              // might be a value of an entity
              entName.length < maxLength + 2 &&
              // a) either one character is different:
              (((temp = [...allNamedEntitiesSetOnly].filter(
                (curr) => leven(curr, entName) === 1
              )) &&
                temp.length) ||
                //
                // OR
                //
                // b) two are different but entity is at least 4 chars long:
                ((temp = [...allNamedEntitiesSetOnly].filter(
                  (curr) => leven(curr, entName) === 2 && curr.length > 3
                )) &&
                  temp.length))
            ) {
              console.log(
                `405 ${`\u001b[${32}m${`LEVENSHTEIN DISTANCE=1 MATCHED`}\u001b[${39}m`}`
              );
              console.log(
                `408 ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
                  temp,
                  null,
                  4
                )}`
              );

              // TODO
            }

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
              `446 ${`\u001b[${33}m${`situation`}\u001b[${39}m`} = ${JSON.stringify(
                situation,
                null,
                4
              )}`
            );

            if (situation.probablyNumeric) {
              console.log(
                `455 ${`\u001b[${32}m${`██ seems like a numeric HTML entity!`}\u001b[${39}m`}`
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
                  `482 ${`\u001b[${32}m${`██ it's a ${
                    situation.probablyNumeric === "hexi" ? "hexi" : ""
                  }decimal numeric entity reference: "${decodedEntitysValue}"`}\u001b[${39}m`}`
                );

                if (
                  situation.probablyNumeric === "deci" &&
                  parseInt(situation.numbersValue, 10) > 918015
                ) {
                  console.log(`491 PUSH`);
                  push({
                    ruleName: `bad-malformed-numeric-character-entity`,
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null,
                  });
                } else if (opts.decode) {
                  // unless decoding was requested, no further action is needed:
                  console.log(`502 PUSH`);
                  push({
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
                console.log(`514 generic error`);
                console.log(`515 PUSH`);
                push({
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
                console.log(`528 call opts.entityCatcherCb()`);
                opts.entityCatcherCb(whatsOnTheLeft, i + 1);
              }
            } else {
              // it's either named or some sort of messed up HTML entity
              // First, match against case-insensitive list
              // 1. check, maybe it's a known HTML entity
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
          //
          // CASE 2 - &*...;
          //
          //
          //
          //
          console.log(
            `562 ${`\u001b[${32}m${`██`}\u001b[${39}m`} might be a messy entity. We have "${str.slice(
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
            `573 ${`\u001b[${32}m${`██ situation:`}\u001b[${39}m`}\n${JSON.stringify(
              situation,
              null,
              4
            )}`
          );

          // push the issue:
          console.log(`581 PUSH`);
          push({
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
        } else if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
          //
          //
          //
          //
          //
          // CASE 3 - CHECK FOR MISSING SEMICOLON
          //
          //
          //
          //
          console.log(
            `606 ${`\u001b[${31}m${`██ semicol might be missing`}\u001b[${39}m`}`
          );

          const suspectedEnt = str.slice(whatsOnTheLeft + 1, i);
          // first, match the whole thing, as it is:
          if (
            suspectedEnt.length &&
            // no point matching exactly strings longer than the longest
            // of all named entities:
            suspectedEnt.length <= maxLength &&
            // matching against the Set:
            allNamedEntitiesSetOnly.has(suspectedEnt)
          ) {
            console.log(
              `620 ${`\u001b[${32}m${`MATCHED EXACTLY "${suspectedEnt}"`}\u001b[${39}m`}`
            );
            // only exception - &ang&;ang;
            //                      |
            // if we're on ampersand,
            // and there is semi on the right, extend over that ampersand
            let calculatedEnding = i;
            if (str[right(str, i)] === ";") {
              calculatedEnding = right(str, i) + 1;
            }

            console.log(`631 PUSH`);
            push({
              ruleName: `encoded-numeric-html-entity-reference`,
              entityName: suspectedEnt,
              rangeFrom: whatsOnTheLeft,
              rangeTo: calculatedEnding,
              rangeValEncoded: `&${suspectedEnt};`,
              rangeValDecoded: decode(`&${suspectedEnt};`),
            });
          } else {
            console.log(
              `642 ${`\u001b[${32}m${`SEARCH THE BEGINNING OF "${suspectedEnt}"`}\u001b[${39}m`}`
            );
            // maybe semicolon is missing and entity starts at the beginning
            // of this chunk

            const firstChar = letterSeqStartAt;
            const secondChar = letterSeqStartAt
              ? right(str, letterSeqStartAt)
              : null;
            console.log(
              `652 ${`\u001b[${33}m${`firstChar`}\u001b[${39}m`} = str[${firstChar}] = ${
                str[firstChar]
              }; ${`\u001b[${33}m${`secondChar`}\u001b[${39}m`} = str[${secondChar}] = ${
                str[secondChar]
              }`
            );
            // we'll tap the "entStartsWith" from npm package "all-named-html-entities"
            // which gives a plain object of named entities, all grouped by first
            // and second character first. This reduces amount of matching needed.
            console.log(
              `662 ██ ${
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
              console.log(`695`);
              let tempEnt;
              let tempRes;

              let entitiesThatMatch = entStartsWith[str[firstChar]][
                str[secondChar]
              ].reduce((gatheredSoFar, oneOfKnownEntities) => {
                // find all entities that match on the right of here
                // rightSeq could theoretically give positive answer, zero index,
                // but it's impossible here, so we're fine to match "if true".
                tempRes = rightSeq(
                  str,
                  letterSeqStartAt - 1,
                  ...oneOfKnownEntities.split("")
                );
                if (tempRes) {
                  return gatheredSoFar.concat([
                    { tempEnt: oneOfKnownEntities, tempRes },
                  ]);
                }
                return gatheredSoFar;
              }, []);
              console.log(
                `718 ${`\u001b[${35}m${`entitiesThatMatch BEFORE filtering = ${JSON.stringify(
                  entitiesThatMatch,
                  null,
                  4
                )}`}\u001b[${39}m`}`
              );
              entitiesThatMatch = removeGappedFromMixedCases(
                str,
                entitiesThatMatch
              );
              console.log(
                `729 ${`\u001b[${35}m${`entitiesThatMatch AFTER filtering = ${JSON.stringify(
                  entitiesThatMatch,
                  null,
                  4
                )}`}\u001b[${39}m`}`
              );
              if (entitiesThatMatch) {
                ({ tempEnt, tempRes } = entitiesThatMatch);
              }
              console.log(
                `739 ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt}; ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                  tempRes,
                  null,
                  4
                )}`
              );

              console.log(
                `747 ${`\u001b[${33}m${`["&"].includes(str[tempRes.rightmostChar + 1])`}\u001b[${39}m`} = ${
                  tempRes && tempRes.rightmostChar
                    ? JSON.stringify(
                        ["&"].includes(str[tempRes.rightmostChar + 1]),
                        null,
                        4
                      )
                    : `""`
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
                  `769 ${`\u001b[${35}m${`entity ${tempEnt} is indeed on the right of index ${i}, the situation is: ${JSON.stringify(
                    tempRes,
                    null,
                    4
                  )}`}\u001b[${39}m`}`
                );

                const decodedEntity = decode(`&${tempEnt};`);

                push({
                  ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                  entityName: tempEnt,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: tempRes.rightmostChar + 1,
                  rangeValEncoded: `&${tempEnt};`,
                  rangeValDecoded: decodedEntity,
                });
              } else {
                console.log(
                  `788 ${`\u001b[${32}m${`it was just a legit ampersand`}\u001b[${39}m`}`
                );
              }
              // ELSE, it was just a legit ampersand
            }
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
          // CASE 4 - CHECK FOR MISSING AMPERSAND
          //
          //
          //
          //

          console.log(
            `810 ${`\u001b[${31}m${`██ ampersand might be missing`}\u001b[${39}m`}`
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
            console.log(`832`);
            let tempEnt;
            let tempRes;

            let temp1 = entEndsWith[str[lastChar]][str[secondToLast]].reduce(
              (gatheredSoFar, oneOfKnownEntities) => {
                // find all entities that match on the right of here
                // rightSeq could theoretically give positive answer, zero index,
                // but it's impossible here, so we're fine to match "if true".
                tempRes = leftSeq(str, i, ...oneOfKnownEntities.split(""));
                if (
                  tempRes &&
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
              `859 ${`\u001b[${35}m${`temp1 BEFORE filtering:`}\u001b[${39}m`} ${JSON.stringify(
                temp1,
                null,
                4
              )}`
            );
            temp1 = removeGappedFromMixedCases(str, temp1);
            console.log(
              `867 ${`\u001b[${35}m${`temp1 AFTER filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
            console.log(
              `877 ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt} - ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                tempRes,
                null,
                4
              )}`
            );

            console.log(
              `885 letterSeqStartAt = ${letterSeqStartAt}; str[letterSeqStartAt] = ${
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
                `907 ${`\u001b[${35}m${`entity ${tempEnt} is indeed on the left of index ${i}, the situation is: ${JSON.stringify(
                  tempRes,
                  null,
                  4
                )}`}\u001b[${39}m`}`
              );

              const decodedEntity = decode(`&${tempEnt};`);

              console.log(
                `917 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
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
                `940 ${`\u001b[${31}m${`██`}\u001b[${39}m`} "${tempEnt}" is among uncertain entities`
              );
            }
          } else if (brokenNumericEntityStartAt !== null) {
            // we have a malformed numeric entity reference, like #x26; without
            // an ampersand but with the rest of characters

            // 1. push the issue:
            console.log(
              `949 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${brokenNumericEntityStartAt}, ${
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
              `965 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} brokenNumericEntityStartAt = null`
            );
          }
        }
      }

      // one-character chunks or chunks ending with ampersand get wiped:
      letterSeqStartAt = null;
      console.log(
        `974 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = null`
      );
    }

    // Catch the start of the sequence of latin letters/hash.
    if (isLatinLetterOrNumberOrHash(str[i])) {
      if (letterSeqStartAt === null && str[i + 1]) {
        letterSeqStartAt = i;
        console.log(
          `983 SET ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = ${letterSeqStartAt}`
        );
      }
    } else if (letterSeqStartAt !== null) {
      // Catch the end of the sequence of latin letters/hash
      letterSeqEndAt = i;
      console.log(
        `990 SET ${`\u001b[${33}m${`letterSeqEndAt`}\u001b[${39}m`} = ${letterSeqEndAt}`
      );

      // quick wins - check, if sequence did start with an ampersand
      // maybe we have semicol missing right here?

      // consider there might be legit semicolon (ending of this entity)
      // on the right, for example, "&nbsp ;"
      if (
        str[letterSeqStartAt - 1] === "&" &&
        (!right(str, i) || str[right(str, i)] !== ";")
      ) {
        console.log(`1002 it does start with ampersand`);

        console.log(
          `1005 check "${`\u001b[${33}m${str.slice(
            letterSeqStartAt,
            i
          )}\u001b[${39}m`}", is it a known entity name`
        );

        const suspectedEnt = str.slice(letterSeqStartAt, i);
        if (allNamedEntitiesSetOnly.has(suspectedEnt)) {
          console.log(
            `1014 ${`\u001b[${31}m${`SEMICOLON IS MISSING`}\u001b[${39}m`}`
          );
          console.log(`1016 PUSH`);
          push({
            ruleName: `bad-named-html-entity-malformed-${suspectedEnt}`,
            entityName: suspectedEnt,
            rangeFrom: letterSeqStartAt - 1,
            rangeTo: i,
            rangeValEncoded: `&${suspectedEnt};`,
            rangeValDecoded: decode(`&${suspectedEnt};`),
          });
          // reset is done automatically within push()
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
        `1038 ${`\u001b[${31}m${`██`}\u001b[${39}m`} #x pattern caught`
      );
      if (isNumber(str[right(str, right(str, i))])) {
        brokenNumericEntityStartAt = i;
      }
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

    //

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
    console.log(" ");
    console.log(
      `${`\u001b[${90}m${`██ letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ letterSeqEndAt = ${letterSeqEndAt}`}\u001b[${39}m`}`
    );
    counter += 1;
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
    console.log(`1097 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} empty array`);
    return [];
  }

  console.log(
    `1102 IN THE END, before merge rangesArr2 = ${JSON.stringify(
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
    `1158 RETURN ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export default stringFixBrokenNamedEntities;

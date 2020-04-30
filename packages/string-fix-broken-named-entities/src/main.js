/* eslint no-cond-assign: 0 */

import leven from "leven";
import {
  allNamedEntities,
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  entStartsWith,
  entEndsWith,
  entStartsWithCaseInsensitive,
  brokenNamedEntities,
  decode,
  maxLength,
  uncertain,
} from "all-named-html-entities";
import { left, right, rightSeq, leftSeq } from "string-left-right";
import {
  isObj,
  isStr,
  isNumber,
  resemblesNumericEntity,
  removeGappedFromMixedCases,
  isLatinLetterOrNumberOrHash,
} from "./util";

/**
 * stringFixBrokenNamedEntities - fixes broken named HTML entities
 *
 * @param  {string} inputString
 * @return {array}  ranges array OR null
 */
function stringFixBrokenNamedEntities(str, originalOpts) {
  console.log(
    `034 stringFixBrokenNamedEntities: ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
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
        `097 stringFixBrokenNamedEntities: new ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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
    `135 stringFixBrokenNamedEntities: FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} used: ${JSON.stringify(
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
      `206 stringFixBrokenNamedEntities: \n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
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
          `229 stringFixBrokenNamedEntities: RESET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = null`
        );
      } else {
        console.log(`232 stringFixBrokenNamedEntities: continue`);
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
        `257 stringFixBrokenNamedEntities: ${`\u001b[${36}m${`██ letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`
      );
      if (i > letterSeqStartAt + 1) {
        const potentialEntity = str.slice(letterSeqStartAt, i);
        console.log(
          `262 stringFixBrokenNamedEntities: ${`\u001b[${35}m${`██ CARVED A SEQUENCE: ${potentialEntity}`}\u001b[${39}m`}`
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
            `281 ${`\u001b[${35}m${`semicol might be missing`}\u001b[${39}m`}`
          );
          // check, what's the index of the character to the right of
          // str[whatsOnTheLeft], is it any of the known named HTML entities.
          const firstChar = letterSeqStartAt;
          const secondChar = letterSeqStartAt
            ? right(str, letterSeqStartAt)
            : null;
          console.log(
            `290 firstChar = str[${firstChar}] = ${str[firstChar]}; secondChar = str[${secondChar}] = ${str[secondChar]}`
          );
          // we'll tap the "entStartsWith" from npm package "all-named-html-entities"
          // which gives a plain object of named entities, all grouped by first
          // and second character first. This reduces amount of matching needed.
          console.log(
            `296 ██ ${
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
            console.log(`328`);
            let tempEnt;
            let tempRes;

            let temp1 = entStartsWith[str[firstChar]][str[secondChar]].reduce(
              (gatheredSoFar, oneOfKnownEntities) => {
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
              },
              []
            );
            console.log(
              `352 ${`\u001b[${35}m${`temp1 BEFORE filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            temp1 = removeGappedFromMixedCases(str, temp1);
            console.log(
              `360 ${`\u001b[${35}m${`temp1 AFTER filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
            console.log(
              `370 ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt}; ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                tempRes,
                null,
                4
              )}`
            );

            console.log(
              `378 ${`\u001b[${33}m${`["&"].includes(str[tempRes.rightmostChar + 1])`}\u001b[${39}m`} = ${
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
                `400 ${`\u001b[${35}m${`entity ${tempEnt} is indeed on the right of index ${i}, the situation is: ${JSON.stringify(
                  tempRes,
                  null,
                  4
                )}`}\u001b[${39}m`}`
              );

              const decodedEntity = decode(`&${tempEnt};`);

              console.log(`409 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
            `437 ${`\u001b[${35}m${`ampersand might be missing`}\u001b[${39}m`}`
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
            console.log(`458`);
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
              `485 ${`\u001b[${35}m${`temp1 BEFORE filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            temp1 = removeGappedFromMixedCases(str, temp1);
            console.log(
              `493 ${`\u001b[${35}m${`temp1 AFTER filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
            console.log(
              `503 ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt} - ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                tempRes,
                null,
                4
              )}`
            );

            console.log(
              `511 letterSeqStartAt = ${letterSeqStartAt}; str[letterSeqStartAt] = ${
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
                `533 ${`\u001b[${35}m${`entity ${tempEnt} is indeed on the left of index ${i}, the situation is: ${JSON.stringify(
                  tempRes,
                  null,
                  4
                )}`}\u001b[${39}m`}`
              );

              const decodedEntity = decode(`&${tempEnt};`);

              console.log(`542 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
                `553 ${`\u001b[${31}m${`██`}\u001b[${39}m`} "${tempEnt}" is among uncertain entities`
              );
            }
          } else if (brokenNumericEntityStartAt !== null) {
            // we have a malformed numeric entity reference, like #x26; without
            // an ampersand but with the rest of characters

            // 1. push the issue:
            console.log(`561 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
              `574 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} brokenNumericEntityStartAt = null`
            );
          }
        } else if (
          (str[whatsOnTheLeft] === "&" ||
            (str[whatsOnTheLeft] === ";" &&
              str[whatsEvenMoreToTheLeft] === "&")) &&
          str[i] === ";"
        ) {
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
            `593 ${`\u001b[${32}m${`██ looks like some sort of HTML entitity!`}\u001b[${39}m`}`
          );
          // find out more: is it legit, unrecognised or numeric...

          if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) {
            console.log(
              `599 ${`\u001b[${90}m${`so there are some characters in between: & and ;`}\u001b[${39}m`}`
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
              `630 ${`\u001b[${33}m${`situation`}\u001b[${39}m`} = ${JSON.stringify(
                situation,
                null,
                4
              )}`
            );

            if (situation.probablyNumeric) {
              console.log(
                `639 ${`\u001b[${32}m${`██ seems like a numeric HTML entity!`}\u001b[${39}m`}`
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
                  `666 ${`\u001b[${32}m${`██ it's a ${
                    situation.probablyNumeric === "hexi" ? "hexi" : ""
                  }decimal numeric entity reference: "${decodedEntitysValue}"`}\u001b[${39}m`}`
                );

                if (
                  situation.probablyNumeric === "deci" &&
                  parseInt(situation.numbersValue, 10) > 918015
                ) {
                  console.log(`675 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
                  console.log(`686 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
                console.log(`698 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
                console.log(`711 call opts.entityCatcherCb()`);
                opts.entityCatcherCb(whatsOnTheLeft, i + 1);
              }
            } else {
              console.log(
                `716 ${`\u001b[${32}m${`it's either named or some sort of messed up HTML entity`}\u001b[${39}m`}`
              );

              //
              //
              //
              //
              //          NAMED ENTITIES CLAUSES BELOW
              //
              //
              //
              //

              // happy path:

              // we don't want to filter whole chapter of text...
              if (potentialEntity.length <= 50) {
                const potentialEntityOnlyNonWhitespaceChars = Array.from(
                  potentialEntity
                )
                  .filter((char) => char.trim().length)
                  .join("");

                if (
                  potentialEntityOnlyNonWhitespaceChars.length <= maxLength &&
                  allNamedEntitiesSetOnlyCaseInsensitive.has(
                    potentialEntityOnlyNonWhitespaceChars.toLowerCase()
                  )
                ) {
                  console.log(
                    `746 ${`\u001b[${32}m${`MATCHED HEALTHY "${potentialEntityOnlyNonWhitespaceChars}"!!!`}\u001b[${39}m`}`
                  );

                  console.log(
                    `750 FIY, ${`\u001b[${33}m${`whatsOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
                      whatsOnTheLeft,
                      null,
                      4
                    )}`
                  );

                  if (
                    // first, check is the letter case allright
                    !allNamedEntitiesSetOnly.has(
                      potentialEntityOnlyNonWhitespaceChars
                    )
                  ) {
                    console.log(
                      `764 ${`\u001b[${31}m${`a problem with letter case!`}\u001b[${39}m`}`
                    );
                    const matchingEntitiesOfCorrectCaseArr = [
                      ...allNamedEntitiesSetOnly,
                    ].filter(
                      (ent) =>
                        ent.toLowerCase() ===
                        potentialEntityOnlyNonWhitespaceChars.toLowerCase()
                    );

                    console.log(
                      `775 ${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`}: ${`\u001b[${33}m${`matchingEntitiesOfCorrectCaseArr`}\u001b[${39}m`} = ${JSON.stringify(
                        matchingEntitiesOfCorrectCaseArr,
                        null,
                        4
                      )}`
                    );

                    if (matchingEntitiesOfCorrectCaseArr.length === 1) {
                      console.log(
                        `784 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`
                      );
                      rangesArr2.push({
                        ruleName: `bad-named-html-entity-malformed-${matchingEntitiesOfCorrectCaseArr[0]}`,
                        entityName: matchingEntitiesOfCorrectCaseArr[0],
                        rangeFrom: whatsOnTheLeft,
                        rangeTo: i + 1,
                        rangeValEncoded: `&${matchingEntitiesOfCorrectCaseArr[0]};`,
                        rangeValDecoded: decode(
                          `&${matchingEntitiesOfCorrectCaseArr[0]};`
                        ),
                      });
                    } else {
                      console.log(
                        `798 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`
                      );
                      rangesArr2.push({
                        ruleName: `bad-named-html-entity-unrecognised`,
                        entityName: null,
                        rangeFrom: whatsOnTheLeft,
                        rangeTo: i + 1,
                        rangeValEncoded: null,
                        rangeValDecoded: null,
                      });
                    }
                  } else if (
                    // is it really healthy? measuring distance is a way to find out
                    // any present whitespace characters will bloat the length...
                    i - whatsOnTheLeft - 1 !==
                      potentialEntityOnlyNonWhitespaceChars.length ||
                    str[whatsOnTheLeft] !== "&"
                  ) {
                    console.log(
                      `817 ${`\u001b[${31}m${`whitespace present!`}\u001b[${39}m`}`
                    );

                    const rangeFrom =
                      str[whatsOnTheLeft] === "&"
                        ? whatsOnTheLeft
                        : whatsEvenMoreToTheLeft;

                    if (
                      // if it's a dubious entity
                      Object.keys(uncertain).includes(
                        potentialEntityOnlyNonWhitespaceChars
                      ) &&
                      // and there's space after ampersand
                      !str[rangeFrom + 1].trim().length
                    ) {
                      console.log(
                        `834 ${`\u001b[${31}m${`BAIL EARLY`}\u001b[${39}m`} - reset and continue - it's a known uncertain entity!`
                      );
                      letterSeqStartAt = null;
                      continue;
                    }

                    console.log(`840 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                    rangesArr2.push({
                      ruleName: `bad-named-html-entity-malformed-${potentialEntityOnlyNonWhitespaceChars}`,
                      entityName: potentialEntityOnlyNonWhitespaceChars,
                      rangeFrom,
                      rangeTo: i + 1,
                      rangeValEncoded: `&${potentialEntityOnlyNonWhitespaceChars};`,
                      rangeValDecoded: decode(
                        `&${potentialEntityOnlyNonWhitespaceChars};`
                      ),
                    });
                  } else if (opts.decode) {
                    console.log(
                      `853 ${`\u001b[${31}m${`decode requested!!!`}\u001b[${39}m`}`
                    );

                    // last thing, if decode is required, we've got an error still...
                    console.log(`857 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                    rangesArr2.push({
                      ruleName: `encoded-html-entity-${potentialEntityOnlyNonWhitespaceChars}`,
                      entityName: potentialEntityOnlyNonWhitespaceChars,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: `&${potentialEntityOnlyNonWhitespaceChars};`,
                      rangeValDecoded: decode(
                        `&${potentialEntityOnlyNonWhitespaceChars};`
                      ),
                    });
                  } else if (opts.entityCatcherCb) {
                    // it's healthy - so at least ping the entity catcher
                    console.log(`870 call opts.entityCatcherCb()`);
                    opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                  }

                  console.log(`874 reset and continue`);
                  letterSeqStartAt = null;
                  continue;
                } else {
                  console.log(
                    `879 ${`\u001b[${31}m${`not recognised "${potentialEntity}" - moving on`}\u001b[${39}m`}`
                  );
                }
              }

              // First, match against case-insensitive list

              // 1. check, maybe it's a known HTML entity
              const firstChar = letterSeqStartAt;
              const secondChar = letterSeqStartAt
                ? right(str, letterSeqStartAt)
                : null;
              console.log(
                `892 firstChar = str[${firstChar}] = ${str[firstChar]}; secondChar = str[${secondChar}] = ${str[secondChar]}`
              );

              let tempEnt;
              let temp;

              console.log(
                `899 FIY, situation.charTrimmed.toLowerCase() = "${situation.charTrimmed.toLowerCase()}"`
              );

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
                  `913 ${`\u001b[${32}m${`██`}\u001b[${39}m`} known broken entity ${situation.charTrimmed.toLowerCase()} is indeed on the right`
                );

                console.log(
                  `917 broken entity ${situation.charTrimmed.toLowerCase()} is indeed on the right`
                );
                tempEnt = situation.charTrimmed;

                const decodedEntity = decode(
                  `&${
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                  };`
                );

                console.log(`927 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
                // idea being, if length of suspected chunk is less or equal to
                // the length of the longest entity (add 1 for Levenshtein distance)
                // we still consider that whole chunk (from ampersand to semi)
                // might be a value of an entity
                potentialEntity.length < maxLength + 2 &&
                // a) either one character is different:
                (((temp = [...allNamedEntitiesSetOnly].filter(
                  (curr) => leven(curr, potentialEntity) === 1
                )) &&
                  temp.length) ||
                  //
                  // OR
                  //
                  // b) two are different but entity is at least 4 chars long:
                  ((temp = [...allNamedEntitiesSetOnly].filter(
                    (curr) =>
                      leven(curr, potentialEntity) === 2 && curr.length > 3
                  )) &&
                    temp.length))
              ) {
                console.log(
                  `963 ${`\u001b[${32}m${`LEVENSHTEIN DIFFERENCE CAUGHT malformed "${temp}"`}\u001b[${39}m`}`
                );

                // now the problem: what if there were multiple entities matched?

                if (temp.length === 1) {
                  [tempEnt] = temp;
                  console.log(`970 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                  rangesArr2.push({
                    ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                    entityName: tempEnt,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${tempEnt};`,
                    rangeValDecoded: decode(`&${tempEnt};`),
                  });
                } else {
                  // we've got problem
                  console.log(
                    `982 ${`\u001b[${31}m${`!!! multiple matched`}\u001b[${39}m`}: ${JSON.stringify(
                      temp,
                      null,
                      4
                    )}`
                  );

                  // find longest, drop all shorter than longest
                  const lengthOfLongestCaughtEnt = temp.reduce((acc, curr) => {
                    return curr.length > acc ? curr.length : acc;
                  }, 0);
                  console.log(
                    `994 ${`\u001b[${33}m${`lengthOfLongestCaughtEnt`}\u001b[${39}m`} = ${JSON.stringify(
                      lengthOfLongestCaughtEnt,
                      null,
                      4
                    )}`
                  );

                  // filter only max-length-ones
                  temp = temp.filter(
                    (ent) => ent.length === lengthOfLongestCaughtEnt
                  );

                  // again, if there's one left, Bob's your uncle here's the result
                  if (temp.length === 1) {
                    console.log(
                      `1009 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`
                    );
                    rangesArr2.push({
                      ruleName: `bad-named-html-entity-malformed-${temp[0]}`,
                      entityName: temp[0],
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: `&${temp[0]};`,
                      rangeValDecoded: decode(`&${temp[0]};`),
                    });
                  } else {
                    // TODO
                  }
                }
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
                  `1039 ${`\u001b[${90}m${`seems first two characters might be from an HTML entity...`}\u001b[${39}m`}`
                );

                let matchedEntity = entStartsWithCaseInsensitive[
                  str[firstChar].toLowerCase()
                ][str[secondChar].toLowerCase()].reduce(
                  (gatheredSoFar, oneOfKnownEntities) => {
                    // find all entities that match on the right of here
                    // rightSeq could theoretically give positive answer, zero index,
                    // but it's impossible here, so we're fine to match "if true".
                    tempRes = rightSeq(
                      str,
                      letterSeqStartAt - 1,
                      {
                        i: true,
                      },
                      ...oneOfKnownEntities.split("")
                    );
                    if (tempRes) {
                      return gatheredSoFar.concat([
                        { tempEnt: oneOfKnownEntities, tempRes },
                      ]);
                    }
                    return gatheredSoFar;
                  },
                  []
                );

                console.log(
                  `1068 ${`\u001b[${35}m${`matchedEntity BEFORE filtering = ${JSON.stringify(
                    matchedEntity,
                    null,
                    4
                  )}`}\u001b[${39}m`}`
                );
                matchedEntity = removeGappedFromMixedCases(str, matchedEntity);
                console.log(
                  `1076 ${`\u001b[${35}m${`matchedEntity AFTER filtering = ${JSON.stringify(
                    matchedEntity,
                    null,
                    4
                  )}`}\u001b[${39}m`}`
                );
                if (matchedEntity) {
                  ({ tempEnt, tempRes } = matchedEntity);
                }
                console.log(
                  `1086 ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt}; ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
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
                    `1107 ${`\u001b[${32}m${`entity ${tempEnt} is indeed on the right of index ${letterSeqStartAt}, the situation is: ${JSON.stringify(
                      tempRes,
                      null,
                      4
                    )}`}\u001b[${39}m`}`
                  );

                  let issue = false;
                  const firstChar2 = tempRes.leftmostChar;
                  const secondChar2 = right(str, firstChar2);
                  console.log(
                    `1118 ${`\u001b[${33}m${`firstChar2`}\u001b[${39}m`}: str[${firstChar2}] = ${
                      str[firstChar2]
                    }; ${`\u001b[${33}m${`secondChar2`}\u001b[${39}m`}: str[${secondChar2}] = ${
                      str[secondChar2]
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
                    isStr(str[firstChar2 - 1]) &&
                    !str[firstChar2 - 1].trim().length &&
                    uncertain[potentialEntity].addAmpIfSemiPresent !== true
                  ) {
                    console.log(
                      `1139 ${`\u001b[${31}m${`██`}\u001b[${39}m`} CONTINUE - bail clauses`
                    );
                    letterSeqStartAt = null;
                    continue;
                  }

                  // 1. check case-insensitive matched entity "tempEnt"
                  // case-sensitively
                  if (
                    Object.prototype.hasOwnProperty.call(
                      entStartsWith,
                      str[firstChar2]
                    ) &&
                    Object.prototype.hasOwnProperty.call(
                      entStartsWith[str[firstChar2]],
                      str[secondChar2]
                    ) &&
                    entStartsWith[str[firstChar2]][str[secondChar2]].includes(
                      situation.charTrimmed
                    )
                  ) {
                    entitysValue = situation.charTrimmed;
                    console.log(
                      `1162 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} entitysValue = ${entitysValue}`
                    );
                    console.log(
                      `1165 entity ${`\u001b[${32}m${
                        situation.charTrimmed
                      }\u001b[${39}m`} is matched case-wise stricly`
                    );
                    // so entity's case is right, but what about whitespace
                    // between characters?
                    console.log(
                      `1172 i=${i} - whatsOnTheLeft=${whatsOnTheLeft} => ${
                        i - whatsOnTheLeft
                      }`
                    );
                    console.log(`1176 tempEnt.length = ${tempEnt.length}`);
                    if (i - whatsOnTheLeft - 1 === tempEnt.length) {
                      console.log(
                        `1179 ${`\u001b[${32}m${`██`}\u001b[${39}m`} entity is healthy`
                      );
                      // but it's still an issue if decoding was requested:
                      if (opts.decode) {
                        issue = "encoded-html-entity";
                      }
                    } else {
                      console.log(
                        `1187 ${`\u001b[${31}m${`██ entity has correct characters but has whitespace`}\u001b[${39}m`}`
                      );
                      issue = "bad-named-html-entity-malformed";
                      console.log(
                        `1191 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} issue = ${JSON.stringify(
                          issue,
                          null,
                          0
                        )}`
                      );
                    }
                  } else {
                    // case is wrong
                    console.log(
                      `1201 entity ${situation.charTrimmed} not found case-wise stricly`
                    );
                    issue = "bad-named-html-entity-malformed";
                    console.log(
                      `1205 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`issue`}\u001b[${39}m`} = ${JSON.stringify(
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
                      `1226 SET ${`\u001b[${33}m${`matchingEntities`}\u001b[${39}m`} = ${JSON.stringify(
                        matchingEntities,
                        null,
                        4
                      )}`
                    );

                    if (matchingEntities.length === 1) {
                      // if there is one match, Bob's your uncle here's your result
                      entitysValue = matchingEntities[0];
                      console.log(
                        `1237 SET ${`\u001b[${33}m${`entitysValue`}\u001b[${39}m`} = ${JSON.stringify(
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
                        `1263 SET ${`\u001b[${33}m${`filterLongest`}\u001b[${39}m`} = ${JSON.stringify(
                          filterLongest,
                          null,
                          4
                        )}`
                      );

                      if (filterLongest.length === 1) {
                        entitysValue = filterLongest[0];
                        console.log(
                          `1273 SET ${`\u001b[${33}m${`entitysValue`}\u001b[${39}m`} = ${JSON.stringify(
                            entitysValue,
                            null,
                            4
                          )}`
                        );
                      } else {
                        console.log("1280");
                        const missingLetters = filterLongest.map((entity) => {
                          let count = 0;
                          for (let z = 0, len2 = entity.length; z < len2; z++) {
                            if (entity[z] !== situation.charTrimmed[z]) {
                              count += 1;
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
                            `1301 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`
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
                          `1318 SET ${`\u001b[${33}m${`missingLetters`}\u001b[${39}m`} = ${JSON.stringify(
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
                          `1329 SET ${`\u001b[${33}m${`entitysValue`}\u001b[${39}m`} = ${JSON.stringify(
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
                    `1347 SET ${`\u001b[${32}m${`endingIdx`}\u001b[${39}m`} = ${endingIdx}`
                  );

                  // 2. submit the issue
                  if (issue) {
                    console.log(
                      `1353 ${`\u001b[${90}m${`within issue clauses`}\u001b[${39}m`}`
                    );
                    const decodedEntity = decode(`&${entitysValue};`);

                    console.log(
                      `1358 ${`\u001b[${33}m${`███████████████████████████████████████`}\u001b[${39}m`}\ntempRes.rightmostChar + 1 = ${
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
                        `1371 OFFSET ${`\u001b[${32}m${`endingIdx`}\u001b[${39}m`} = ${endingIdx}`
                      );
                    }

                    console.log(
                      `1376 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`
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
                    console.log(`1390 call opts.entityCatcherCb()`);
                    opts.entityCatcherCb(whatsOnTheLeft, endingIdx);
                  }
                }
              }

              // if "tempEnt" was not set by now, it is not a known HTML entity
              if (!tempEnt) {
                console.log(
                  `1399 ${`\u001b[${90}m${`so it's not one of known named HTML entities`}\u001b[${39}m`}`
                );
                console.log(
                  `1402 ${`\u001b[${90}m${`checking for broken recognised entities`}\u001b[${39}m`}`
                );

                // it's an unrecognised entity:
                console.log(`1406 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                rangesArr2.push({
                  ruleName: `bad-named-html-entity-unrecognised`,
                  entityName: null,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null,
                });
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
            `1443 ${`\u001b[${32}m${`██`}\u001b[${39}m`} might be a messy entity. We have "${str.slice(
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
            `1454 ${`\u001b[${32}m${`██ situation:`}\u001b[${39}m`}\n${JSON.stringify(
              situation,
              null,
              4
            )}`
          );

          console.log(
            `1462 FIY, ${`\u001b[${33}m${`potentialEntity`}\u001b[${39}m`} = ${JSON.stringify(
              potentialEntity,
              null,
              4
            )}`
          );

          // push the issue:
          console.log(`1470 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
        `1489 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = null`
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
        `1503 SET ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = ${letterSeqStartAt}`
      );
    }

    // catch amp;
    if (str[i] === "a") {
      // TODO - rebase with chomp()

      console.log(`1511 ${`\u001b[${90}m${`within a clauses`}\u001b[${39}m`}`);
      // // 1. catch recursively-encoded cases. They're easy actually, the task will
      // // be deleting sequence of repeated "amp;" between ampersand and letter.

      // For example, we have this:
      // text&   amp  ;  a  m   p   ;  nbsp;text
      // We start at the opening ampersand at index 4;
      const singleAmpOnTheRight = rightSeq(str, i, "m", "p", ";");
      if (singleAmpOnTheRight) {
        console.log(
          `1521 ${`\u001b[${90}m${`confirmed amp; from index ${i} onwards`}\u001b[${39}m`}`
        );

        // if we had to delete all amp;amp;amp; and leave only ampersand, this
        // will be the index to delete up to:
        let toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        console.log(
          `1528 SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`
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
            `1542 ${`\u001b[${90}m${`confirmed another amp; on the right of index ${singleAmpOnTheRight.rightmostChar}`}\u001b[${39}m`}`
          );

          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          console.log(
            `1547 SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`
          );

          let temp;
          do {
            console.log(
              `1553 ${`\u001b[${36}m${`======== loop ========`}\u001b[${39}m`}`
            );
            temp = rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");
            console.log(
              `1557 ${`\u001b[${36}m${`temp = ${JSON.stringify(
                temp,
                null,
                4
              )}`}\u001b[${39}m`}`
            );

            if (temp) {
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
              console.log(
                `1567 ${`\u001b[${36}m${`another amp; confirmed! Now`}\u001b[${39}m`} ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
                  toDeleteAllAmpEndHere,
                  null,
                  4
                )};`
              );
            }
          } while (temp);

          console.log(
            `1577 FINAL ${`\u001b[${32}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
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
          `1596 SET initial ${`\u001b[${33}m${`firstCharThatFollows`}\u001b[${39}m`} = str[${firstCharThatFollows}] = ${
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
            `1637 ${`\u001b[${31}m${`██ ACTIVATE doNothingUntil = ${doNothingUntil}`}\u001b[${39}m`}`
          );

          console.log(
            `1641 ENTITY ${`\u001b[${32}m${matchedTemp}\u001b[${39}m`} FOLLOWS`
          );
          // is there ampersand on the left of "i", the first amp;?
          const whatsOnTheLeft = left(str, i);

          if (str[whatsOnTheLeft] === "&") {
            console.log(`1647 ampersand on the left`);
            console.log(
              `1649 ${`\u001b[${33}m${`matchedTemp`}\u001b[${39}m`} = ${JSON.stringify(
                matchedTemp,
                null,
                4
              )}; ${`\u001b[${33}m${`matchedVal`}\u001b[${39}m`} = ${JSON.stringify(
                matchedVal,
                null,
                4
              )}`
            );
            console.log(`1659 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
            console.log(`1673 rangeFrom = ${rangeFrom}`);
            const spaceReplacement = "";

            if (str[i - 1] === " ") {
              console.log(`1677`);
              // chomp spaces to the left, but otherwise, don't touch anything
              // TODO
            }
            console.log(`1681 final rangeFrom = ${rangeFrom}`);

            if (opts.cb) {
              console.log(`1684 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
              rangesArr2.push({
                ruleName: "bad-named-html-entity-multiple-encoding",
                entityName: matchedTemp,
                rangeFrom,
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

    // catch #x of messed up entities without ampersand (like #x26;)
    if (
      str[i] === "#" &&
      right(str, i) &&
      str[right(str, i)].toLowerCase() === "x" &&
      (!str[i - 1] || !left(str, i) || str[left(str, i)] !== "&")
    ) {
      console.log(
        `1709 ${`\u001b[${31}m${`██`}\u001b[${39}m`} #x pattern caught`
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

    console.log("---------------");
    console.log(
      `1730 ${`\u001b[${90}m${`letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`
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
    console.log(`1752 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} empty array`);
    return [];
  }

  console.log(
    `1757 IN THE END, before merge rangesArr2 = ${JSON.stringify(
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
    `1813 RETURN ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export default stringFixBrokenNamedEntities;

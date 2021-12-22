/* eslint-disable @typescript-eslint/restrict-plus-operands */
import leven from "leven";
import {
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  entStartsWith,
  entEndsWith,
  brokenNamedEntities,
  decode,
  maxLength,
  uncertain,
} from "all-named-html-entities";
import { left, right, rightSeq, leftSeq } from "string-left-right";

import {
  isObj,
  isStr,
  isNumeric,
  resemblesNumericEntity,
  removeGappedFromMixedCases,
  isLatinLetterOrNumberOrHash,
} from "./util";
import { version as v } from "../package.json";
import { Ranges } from "../../../ops/typedefs/common";

const version: string = v;

const allRules = [...allNamedEntitiesSetOnly]
  .map((ruleName) => `bad-html-entity-malformed-${ruleName}`)
  .concat(
    [...allNamedEntitiesSetOnly].map(
      (ruleName) => `bad-html-entity-encoded-${ruleName}`
    )
  )
  .concat([
    "bad-html-entity-unrecognised",
    "bad-html-entity-multiple-encoding",
    "bad-html-entity-encoded-numeric",
    "bad-html-entity-malformed-numeric",
    "bad-html-entity-other",
  ]);

interface Obj {
  [key: string]: any;
}
interface cbObj {
  rangeFrom: number;
  rangeTo: number;
  rangeValEncoded: string | null;
  rangeValDecoded: string | null;
  ruleName: string;
  entityName: string | null;
}
interface Opts {
  decode: boolean;
  cb: null | ((obj: cbObj) => void);
  entityCatcherCb: null | ((from: number, to: number) => void);
  textAmpersandCatcherCb: null | ((idx: number) => void);
  progressFn: null | ((percDone: number) => void);
}

function fixEnt(str: string, originalOpts?: Partial<Opts>): Ranges {
  console.log(
    `064 fixEnt: ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
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

  let defaults: Opts = {
    decode: false,
    cb: ({ rangeFrom, rangeTo, rangeValEncoded, rangeValDecoded }: cbObj) =>
      rangeValDecoded || rangeValEncoded
        ? [
            rangeFrom,
            rangeTo,
            isObj(originalOpts) && (originalOpts as Obj).decode
              ? rangeValDecoded
              : rangeValEncoded,
          ]
        : [rangeFrom, rangeTo],
    textAmpersandCatcherCb: null,
    progressFn: null,
    entityCatcherCb: null,
  };

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `string-fix-broken-named-entities: [THROW_ID_02] the second input argument must be a plain object! I was given as:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )} (${typeof originalOpts}-type)`
    );
  }

  let opts = { ...defaults, ...originalOpts };
  console.log(
    `128 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

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
      `string-fix-broken-named-entities: [THROW_ID_04] opts.entityCatcherCb must be a function (or falsey)! Currently it's: ${typeof opts.entityCatcherCb}, equal to: ${JSON.stringify(
        opts.entityCatcherCb,
        null,
        4
      )}`
    );
  }
  if (opts.progressFn && typeof opts.progressFn !== "function") {
    throw new TypeError(
      `string-fix-broken-named-entities: [THROW_ID_05] opts.progressFn must be a function (or falsey)! Currently it's: ${typeof opts.progressFn}, equal to: ${JSON.stringify(
        opts.progressFn,
        null,
        4
      )}`
    );
  }
  if (
    opts.textAmpersandCatcherCb &&
    typeof opts.textAmpersandCatcherCb !== "function"
  ) {
    throw new TypeError(
      `string-fix-broken-named-entities: [THROW_ID_06] opts.textAmpersandCatcherCb must be a function (or falsey)! Currently it's: ${typeof opts.textAmpersandCatcherCb}, equal to: ${JSON.stringify(
        opts.textAmpersandCatcherCb,
        null,
        4
      )}`
    );
  }
  console.log(
    `175 fixEnt: FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} used: ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // state flags
  // ---------------------------------------------------------------------------

  // this is what we'll return, process by default callback or user's custom-one
  let rangesArr2: cbObj[] = [];

  let percentageDone: number | undefined;
  let lastPercentageDone: number | undefined;

  // allocate all 100 of progress to the main loop below
  let len = str.length + 1;
  let counter = 0;

  // doNothingUntil can be either falsey or truthy: index number or boolean true
  // If it's number, it's instruction to avoid actions until that index is
  // reached when traversing. If it's boolean, it means we don't know when we'll
  // stop, we just turn on the flag (permanently, for now).
  let doNothingUntil: number | null | boolean = null;

  // catch letter sequences, possibly separated with whitespace. Non-letter
  // breaks the sequence. Main aim is to catch names of encoded HTML entities
  // for example, nbsp from "&nbsp;"
  let letterSeqStartAt: number | null = null;

  let brokenNumericEntityStartAt = null;

  let ampPositions: number[] = [];

  function pingAmps(untilIdx?: number, loopIndexI?: number): void {
    if (
      typeof opts.textAmpersandCatcherCb === "function" &&
      ampPositions.length
    ) {
      console.log(`215 loop`);
      while (ampPositions.length) {
        let currentAmp = ampPositions.shift() as number;
        console.log(
          `219 SET ${`\u001b[${36}m${`currentAmp`}\u001b[${39}m`} = ${JSON.stringify(
            currentAmp,
            null,
            4
          )}`
        );
        if (
          // batch dumping, cases like end of string reached:
          untilIdx === undefined ||
          // submit all ampersands caught up to this entity:
          currentAmp < untilIdx ||
          // also, we might on a new ampersand, for example:
          // <span>&&nbsp&</span>
          //             ^
          //      we're here
          currentAmp === loopIndexI
        ) {
          console.log(
            `237 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} opts.textAmpersandCatcherCb() with ${`\u001b[${35}m${currentAmp}\u001b[${39}m`}`
          );
          // ping each ampersand's index, starting from zero index:
          opts.textAmpersandCatcherCb(currentAmp);
        } // else, it gets discarded without action
      }
    }
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
  for (let i = 0; i <= len; i++) {
    if (opts.progressFn) {
      percentageDone = Math.floor((counter / len) * 100);
      /* istanbul ignore else */
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
      `285 fixEnt: \n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i]?.trim().length ? str[i] : JSON.stringify(str[i], null, 4)
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
      if (typeof doNothingUntil === "number" && i >= doNothingUntil) {
        doNothingUntil = null;
        console.log(
          `306 fixEnt: RESET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = null`
        );
      } else {
        console.log(`309 fixEnt: continue`);
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

    // escape latch for text chunks
    if (letterSeqStartAt !== null && i - letterSeqStartAt > 50) {
      letterSeqStartAt = null;
      console.log(
        `331 ${`\u001b[${31}m${`WIPE letterSeqStartAt`}\u001b[${39}m`}`
      );
    }

    // Catch the end of a latin letter sequence.
    if (
      letterSeqStartAt !== null &&
      (!str[i] ||
        (str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i])))
    ) {
      console.log(
        `342 fixEnt: ${`\u001b[${36}m${`██ letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`
      );
      if (i > letterSeqStartAt + 1) {
        let potentialEntity = str.slice(letterSeqStartAt, i);
        console.log(
          `347 fixEnt: ${`\u001b[${35}m${`██ CARVED A SEQUENCE: ${potentialEntity}`}\u001b[${39}m`}`
        );

        let whatsOnTheLeft = left(str, letterSeqStartAt);
        let whatsEvenMoreToTheLeft = whatsOnTheLeft
          ? left(str, whatsOnTheLeft)
          : null;

        //
        //
        //
        //
        // CASE 1 - CHECK FOR MISSING SEMICOLON
        //
        //
        //
        //

        if (
          str[whatsOnTheLeft as number] === "&" &&
          (!str[i] || str[i] !== ";")
        ) {
          console.log(
            `370 ${`\u001b[${35}m${`semicol might be missing`}\u001b[${39}m`}`
          );
          // check, what's the index of the character to the right of
          // str[whatsOnTheLeft], is it any of the known named HTML entities.
          let firstChar: number | null = letterSeqStartAt;
          /* istanbul ignore next */
          let secondChar: number | null = letterSeqStartAt
            ? right(str, letterSeqStartAt)
            : null;
          console.log(
            `380 firstChar = str[${firstChar}] = ${
              str[firstChar]
            }; secondChar = str[${secondChar}] = ${str[secondChar as number]}`
          );
          // we'll tap the "entStartsWith" from npm package "all-named-html-entities"
          // which gives a plain object of named entities, all grouped by first
          // and second character first. This reduces amount of matching needed.
          console.log(
            `388 ██ ${
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

          // TODO - set up the case-insensitive matching here:

          /* istanbul ignore else */
          if (
            Object.prototype.hasOwnProperty.call(
              entStartsWith,
              str[firstChar]
            ) &&
            Object.prototype.hasOwnProperty.call(
              entStartsWith[str[firstChar]],
              str[secondChar as number]
            )
          ) {
            console.log(`422`);
            let tempEnt = "";
            let tempRes;

            let temp1 = (entStartsWith as Obj)[str[firstChar]][
              str[secondChar as number]
            ].reduce((gatheredSoFar: any[], oneOfKnownEntities: string) => {
              // find all entities that match on the right of here
              // rightSeq could theoretically give positive answer, zero index,
              // but it's impossible here, so we're fine to match "if true".
              tempRes = rightSeq(
                str,
                (letterSeqStartAt as number) - 1,
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
              `445 ${`\u001b[${35}m${`temp1 BEFORE filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            temp1 = removeGappedFromMixedCases(str, temp1);
            console.log(
              `453 ${`\u001b[${35}m${`temp1 AFTER filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );

            /* istanbul ignore else */
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
            console.log(
              `465 ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt}; ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                tempRes,
                null,
                4
              )}`
            );

            console.log(
              `473 ${`\u001b[${33}m${`["&"].includes(str[tempRes.rightmostChar + 1])`}\u001b[${39}m`} = ${
                tempRes?.rightmostChar
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
                (((uncertain[tempEnt] as Obj).addSemiIfAmpPresent === true ||
                  ((uncertain[tempEnt] as Obj).addSemiIfAmpPresent &&
                    (!str[tempRes.rightmostChar + 1] ||
                      !str[tempRes.rightmostChar + 1].trim().length))) &&
                  str[tempRes.leftmostChar - 1] === "&"))
            ) {
              console.log(
                `495 ${`\u001b[${35}m${`entity ${tempEnt} is indeed on the left of index ${i}, the situation is: ${JSON.stringify(
                  tempRes,
                  null,
                  4
                )}`}\u001b[${39}m`}`
              );

              let decodedEntity = decode(`&${tempEnt};`);

              console.log(`504 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
              rangesArr2.push({
                ruleName: `bad-html-entity-malformed-${tempEnt}`,
                entityName: tempEnt,
                rangeFrom: whatsOnTheLeft || 0,
                rangeTo: tempRes.rightmostChar + 1,
                rangeValEncoded: `&${tempEnt};`,
                rangeValDecoded: decodedEntity as string,
              });

              // release all ampersands
              console.log(
                `516 ███████████████████████████████████████ release ampersands`
              );
              console.log(
                `519 FIY, ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                  tempRes,
                  null,
                  4
                )}`
              );
              pingAmps(whatsOnTheLeft || 0, i);
            } else {
              console.log(`527 ELSE, it was just a legit ampersand`);
            }
          }
        } else if (
          str[whatsOnTheLeft as number] !== "&" &&
          str[whatsEvenMoreToTheLeft as number] !== "&" &&
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
            `546 ${`\u001b[${35}m${`ampersand might be missing`}\u001b[${39}m`}`
          );
          // check, what's on the left of str[i], is it any of known named HTML
          // entities. There are two thousand of them so we'll match by last
          // two characters. For posterity, we assume there can be any amount of
          // whitespace between characters and we need to tackle it as well.
          let lastChar = left(str, i);
          let secondToLast = left(str, lastChar);
          // we'll tap the "entEndsWith" from npm package "all-named-html-entities"
          // which gives a plain object of named entities, all grouped by first
          // and second character first. This reduces amount of matching needed.

          if (
            secondToLast !== null &&
            Object.prototype.hasOwnProperty.call(
              entEndsWith,
              str[lastChar as number]
            ) &&
            Object.prototype.hasOwnProperty.call(
              entEndsWith[str[lastChar as number]],
              str[secondToLast]
            )
          ) {
            console.log(`569`);
            let tempEnt = "";
            let tempRes;

            let temp1 = (entEndsWith as Obj)[str[lastChar as number]][
              str[secondToLast]
            ].reduce((gatheredSoFar: any[], oneOfKnownEntities: string) => {
              // find all entities that match on the right of here
              // rightSeq could theoretically give positive answer, zero index,
              // but it's impossible here, so we're fine to match "if true".
              tempRes = leftSeq(str, i, ...oneOfKnownEntities.split(""));
              if (
                tempRes &&
                !(
                  oneOfKnownEntities === "block" &&
                  str[left(str, letterSeqStartAt) as number] === ":"
                )
              ) {
                return gatheredSoFar.concat([
                  { tempEnt: oneOfKnownEntities, tempRes },
                ]);
              }
              return gatheredSoFar;
            }, []);

            console.log(
              `595 ${`\u001b[${35}m${`temp1 BEFORE filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            temp1 = removeGappedFromMixedCases(str, temp1);
            console.log(
              `603 ${`\u001b[${35}m${`temp1 AFTER filtering = ${JSON.stringify(
                temp1,
                null,
                4
              )}`}\u001b[${39}m`}`
            );

            /* istanbul ignore else */
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
            console.log(
              `615 ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt} - ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                tempRes,
                null,
                4
              )}`
            );

            console.log(
              `623 letterSeqStartAt = ${letterSeqStartAt}; str[letterSeqStartAt] = ${
                str[letterSeqStartAt]
              }; tempRes.leftmostChar = ${
                tempRes?.leftmostChar ? tempRes.leftmostChar : "undefined"
              }; str[tempRes.leftmostChar - 1] = ${
                tempRes?.leftmostChar
                  ? str[tempRes.leftmostChar - 1]
                  : "undefined"
              }`
            );
            if (
              tempEnt &&
              (!Object.keys(uncertain).includes(tempEnt) ||
                (uncertain as Obj)[tempEnt].addAmpIfSemiPresent === true ||
                ((uncertain as Obj)[tempEnt].addAmpIfSemiPresent &&
                  (!tempRes.leftmostChar ||
                    (isStr(str[tempRes.leftmostChar - 1]) &&
                      !str[tempRes.leftmostChar - 1].trim().length))))
            ) {
              console.log(
                `643 ${`\u001b[${35}m${`entity ${tempEnt} is indeed on the left of index ${i}, the situation is: ${JSON.stringify(
                  tempRes,
                  null,
                  4
                )}`}\u001b[${39}m`}`
              );

              let decodedEntity = decode(`&${tempEnt};`);

              console.log(`652 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
              rangesArr2.push({
                ruleName: `bad-html-entity-malformed-${tempEnt}`,
                entityName: tempEnt,
                rangeFrom: tempRes.leftmostChar,
                rangeTo: i + 1,
                rangeValEncoded: `&${tempEnt};`,
                rangeValDecoded: decodedEntity as string,
              });
              pingAmps(tempRes.leftmostChar, i);
            } else {
              console.log(
                `664 ${`\u001b[${31}m${`██`}\u001b[${39}m`} "${tempEnt}" is among uncertain entities`
              );
            }
          } else if (brokenNumericEntityStartAt !== null) {
            // we have a malformed numeric entity reference, like #x26; without
            // an ampersand but with the rest of characters

            // 1. push the issue:
            console.log(`672 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
            rangesArr2.push({
              ruleName: "bad-html-entity-malformed-numeric",
              entityName: null,
              rangeFrom: brokenNumericEntityStartAt,
              rangeTo: i + 1,
              rangeValEncoded: null,
              rangeValDecoded: null,
            });
            pingAmps(brokenNumericEntityStartAt, i);

            // 2. reset marker:
            brokenNumericEntityStartAt = null;
            console.log(
              `686 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} brokenNumericEntityStartAt = null`
            );
          }
        } else if (
          str[i] === ";" &&
          (str[whatsOnTheLeft as number] === "&" ||
            (str[whatsOnTheLeft as number] === ";" &&
              str[whatsEvenMoreToTheLeft as number] === "&"))
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
            `705 ${`\u001b[${32}m${`██ looks like some sort of HTML entitity!`}\u001b[${39}m`}`
          );

          let startOfTheSeq = letterSeqStartAt - 1;
          console.log(
            `710 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`startOfTheSeq`}\u001b[${39}m`} = ${JSON.stringify(
              startOfTheSeq,
              null,
              4
            )}`
          );
          if (
            !str[letterSeqStartAt - 1].trim() &&
            str[whatsOnTheLeft as number] === "&"
          ) {
            startOfTheSeq = whatsOnTheLeft as number;
            console.log(
              `722 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`startOfTheSeq`}\u001b[${39}m`} = ${JSON.stringify(
                startOfTheSeq,
                null,
                4
              )}`
            );
          }

          // find out more: is it legit, unrecognised or numeric...

          /* istanbul ignore else */
          if (str.slice((whatsOnTheLeft as number) + 1, i).trim().length > 1) {
            console.log(
              `735 ${`\u001b[${90}m${`so there are some characters in between: & and ;`}\u001b[${39}m`}`
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

            let situation = resemblesNumericEntity(
              str,
              (whatsOnTheLeft as number) + 1,
              i
            );
            console.log(
              `766 ${`\u001b[${33}m${`situation`}\u001b[${39}m`} = ${JSON.stringify(
                situation,
                null,
                4
              )}`
            );

            if (situation.probablyNumeric) {
              console.log(
                `775 ${`\u001b[${32}m${`██ seems like a numeric HTML entity!`}\u001b[${39}m`}`
              );

              // 1. TACKLE HEALTHY DECIMAL NUMERIC CHARACTER REFERENCE ENTITIES:
              if (
                /* istanbul ignore next */
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
                let decodedEntitysValue = String.fromCharCode(
                  parseInt(
                    situation.charTrimmed.slice(
                      situation.probablyNumeric === "deci" ? 1 : 2
                    ),
                    situation.probablyNumeric === "deci" ? 10 : 16
                  )
                );
                console.log(
                  `803 ${`\u001b[${32}m${`██ it's a ${
                    situation.probablyNumeric === "hexi" ? "hexi" : ""
                  }decimal numeric entity reference: "${decodedEntitysValue}"`}\u001b[${39}m`}`
                );

                if (
                  situation.probablyNumeric === "deci" &&
                  parseInt(situation.numbersValue, 10) > 918015
                ) {
                  console.log(`812 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                  rangesArr2.push({
                    ruleName: `bad-html-entity-malformed-numeric`,
                    entityName: null,
                    rangeFrom: whatsOnTheLeft || 0,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null,
                  });
                } else if (opts.decode) {
                  // unless decoding was requested, no further action is needed:
                  console.log(`823 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                  rangesArr2.push({
                    ruleName: `bad-html-entity-encoded-numeric`,
                    entityName: situation.charTrimmed,
                    rangeFrom: whatsOnTheLeft || 0,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${situation.charTrimmed};`,
                    rangeValDecoded: decodedEntitysValue,
                  });
                }

                console.log(`834 pingAmps()`);
                pingAmps(whatsOnTheLeft || 0, i);
              } else {
                // RAISE A GENERIC ERROR
                console.log(`838 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                rangesArr2.push({
                  ruleName: `bad-html-entity-malformed-numeric`,
                  entityName: null,
                  rangeFrom: whatsOnTheLeft || 0,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null,
                });
                pingAmps(whatsOnTheLeft || 0, i);
              }

              // also call the general entity callback if it's given
              if (opts.entityCatcherCb) {
                console.log(`852 call opts.entityCatcherCb()`);
                opts.entityCatcherCb(whatsOnTheLeft as number, i + 1);
              }
            } else {
              console.log(
                `857 ${`\u001b[${32}m${`it's either named or some sort of messed up HTML entity`}\u001b[${39}m`}`
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

              let potentialEntityOnlyNonWhitespaceChars = Array.from(
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
                  `885 ${`\u001b[${32}m${`MATCHED HEALTHY "${potentialEntityOnlyNonWhitespaceChars}"!!!`}\u001b[${39}m`}`
                );

                console.log(
                  `889 FIY, ${`\u001b[${33}m${`ampPositions`}\u001b[${39}m`} = ${JSON.stringify(
                    ampPositions,
                    null,
                    4
                  )}`
                );

                console.log(
                  `897 FIY, ${`\u001b[${33}m${`whatsOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
                    whatsOnTheLeft,
                    null,
                    4
                  )}`
                );

                if (
                  // first, check is the letter case allright
                  typeof potentialEntityOnlyNonWhitespaceChars === "string" &&
                  !allNamedEntitiesSetOnly.has(
                    potentialEntityOnlyNonWhitespaceChars
                  )
                ) {
                  console.log(
                    `912 ${`\u001b[${31}m${`a problem with letter case!`}\u001b[${39}m`}`
                  );
                  let matchingEntitiesOfCorrectCaseArr = [
                    ...allNamedEntitiesSetOnly,
                  ].filter(
                    (ent) =>
                      ent.toLowerCase() ===
                      potentialEntityOnlyNonWhitespaceChars.toLowerCase()
                  );

                  console.log(
                    `923 ${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`}: ${`\u001b[${33}m${`matchingEntitiesOfCorrectCaseArr`}\u001b[${39}m`} = ${JSON.stringify(
                      matchingEntitiesOfCorrectCaseArr,
                      null,
                      4
                    )}`
                  );

                  if (matchingEntitiesOfCorrectCaseArr.length === 1) {
                    console.log(`931 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                    rangesArr2.push({
                      ruleName: `bad-html-entity-malformed-${matchingEntitiesOfCorrectCaseArr[0]}`,
                      entityName: matchingEntitiesOfCorrectCaseArr[0],
                      rangeFrom: whatsOnTheLeft as number,
                      rangeTo: i + 1,
                      rangeValEncoded: `&${matchingEntitiesOfCorrectCaseArr[0]};`,
                      rangeValDecoded: decode(
                        `&${matchingEntitiesOfCorrectCaseArr[0]};`
                      ),
                    });
                    pingAmps(whatsOnTheLeft as number, i);
                  } else {
                    console.log(`944 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                    rangesArr2.push({
                      ruleName: `bad-html-entity-unrecognised`,
                      entityName: null,
                      rangeFrom: whatsOnTheLeft as number,
                      rangeTo: i + 1,
                      rangeValEncoded: null,
                      rangeValDecoded: null,
                    });
                    pingAmps(whatsOnTheLeft as number, i);
                  }
                } else if (
                  // is it really healthy? measuring distance is a way to find out
                  // any present whitespace characters will bloat the length...
                  i - (whatsOnTheLeft as number) - 1 !==
                    potentialEntityOnlyNonWhitespaceChars.length ||
                  str[whatsOnTheLeft as number] !== "&"
                ) {
                  console.log(
                    `963 ${`\u001b[${31}m${`whitespace present!`}\u001b[${39}m`}`
                  );

                  let rangeFrom =
                    str[whatsOnTheLeft as number] === "&"
                      ? whatsOnTheLeft
                      : whatsEvenMoreToTheLeft;

                  if (
                    // if it's a dubious entity
                    Object.keys(uncertain).includes(
                      potentialEntityOnlyNonWhitespaceChars
                    ) &&
                    // and there's a space after ampersand
                    !str[(rangeFrom as number) + 1].trim().length
                  ) {
                    console.log(
                      `980 ${`\u001b[${31}m${`BAIL EARLY`}\u001b[${39}m`} - reset and continue - it's a known uncertain entity!`
                    );
                    letterSeqStartAt = null;
                    continue;
                  }

                  console.log(`986 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                  rangesArr2.push({
                    ruleName: `bad-html-entity-malformed-${potentialEntityOnlyNonWhitespaceChars}`,
                    entityName: potentialEntityOnlyNonWhitespaceChars,
                    rangeFrom: rangeFrom as number,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${potentialEntityOnlyNonWhitespaceChars};`,
                    rangeValDecoded: decode(
                      `&${potentialEntityOnlyNonWhitespaceChars};`
                    ),
                  });
                  pingAmps(rangeFrom as number, i);
                } else if (opts.decode) {
                  console.log(
                    `1000 ${`\u001b[${31}m${`decode requested!!!`}\u001b[${39}m`}`
                  );

                  // last thing, if decode is required, we've got an error still...
                  console.log(`1004 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                  rangesArr2.push({
                    ruleName: `bad-html-entity-encoded-${potentialEntityOnlyNonWhitespaceChars}`,
                    entityName: potentialEntityOnlyNonWhitespaceChars,
                    rangeFrom: whatsOnTheLeft as number,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${potentialEntityOnlyNonWhitespaceChars};`,
                    rangeValDecoded: decode(
                      `&${potentialEntityOnlyNonWhitespaceChars};`
                    ),
                  });
                  pingAmps(whatsOnTheLeft as number, i);
                } else if (
                  opts.entityCatcherCb ||
                  opts.textAmpersandCatcherCb
                ) {
                  // it's healthy - so at least ping the entity catcher

                  if (opts.entityCatcherCb) {
                    console.log(`1023 call opts.entityCatcherCb()`);
                    opts.entityCatcherCb(whatsOnTheLeft as number, i + 1);
                  }

                  if (opts.textAmpersandCatcherCb) {
                    console.log(`1028 call pingAmps()`);
                    pingAmps(whatsOnTheLeft as number, i);
                  }
                }

                console.log(`1033 reset and continue`);
                letterSeqStartAt = null;
                continue;
              } else {
                console.log(
                  `1038 ${`\u001b[${31}m${`not recognised "${potentialEntity}" - moving on`}\u001b[${39}m`}`
                );
              }

              // First, match against case-insensitive list

              // 1. check, maybe it's a known HTML entity
              let firstChar = letterSeqStartAt;
              /* istanbul ignore next */
              let secondChar = letterSeqStartAt
                ? right(str, letterSeqStartAt)
                : null;
              console.log(
                `1051 firstChar = str[${firstChar}] = ${
                  str[firstChar]
                }; secondChar = str[${secondChar}] = ${
                  str[secondChar as number]
                }`
              );

              let tempEnt = "";
              let temp: string[];

              console.log(
                `1062 FIY, situation.charTrimmed.toLowerCase() = "${situation.charTrimmed.toLowerCase()}"`
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
                  `1076 ${`\u001b[${32}m${`██`}\u001b[${39}m`} known broken entity ${situation.charTrimmed.toLowerCase()} is indeed on the right`
                );

                console.log(
                  `1080 broken entity ${situation.charTrimmed.toLowerCase()} is indeed on the right`
                );
                tempEnt = situation.charTrimmed;

                let decodedEntity = decode(
                  `&${
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                  };`
                );

                console.log(`1090 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                rangesArr2.push({
                  ruleName: `bad-html-entity-malformed-${
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                  }`,
                  entityName: brokenNamedEntities[
                    situation.charTrimmed.toLowerCase()
                  ] as string,
                  rangeFrom: whatsOnTheLeft as number,
                  rangeTo: i + 1,
                  rangeValEncoded: `&${
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                  };`,
                  rangeValDecoded: decodedEntity,
                });
                pingAmps(whatsOnTheLeft as number, i);
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
                      /* istanbul ignore next */
                      leven(curr, potentialEntity) === 2 &&
                      potentialEntity.length > 3
                  )) &&
                    temp.length))
              ) {
                console.log(
                  `1130 ${`\u001b[${32}m${`LEVENSHTEIN DIFFERENCE CAUGHT malformed "${temp}"`}\u001b[${39}m`}`
                );

                // now the problem: what if there were multiple entities matched?

                /* istanbul ignore else */
                if (temp.length === 1) {
                  [tempEnt] = temp;
                  console.log(`1138 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                  rangesArr2.push({
                    ruleName: `bad-html-entity-malformed-${tempEnt}`,
                    entityName: tempEnt,
                    rangeFrom: whatsOnTheLeft as number,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${tempEnt};`,
                    rangeValDecoded: decode(`&${tempEnt};`),
                  });
                  pingAmps(whatsOnTheLeft as number, i);
                } else if (temp) {
                  // For example, &rsqo; could be suspected as
                  // Lenshtein's distance &rsqb; and &rsquo;
                  // The last chance, count how many letters are
                  // absent in this malformed entity.
                  let missingLettersCount = temp.map((ent) => {
                    let splitStr = str.split("");
                    return ent.split("").reduce((acc, curr) => {
                      if (splitStr.includes(curr)) {
                        // remove that character from splitStr
                        // so that we count only once, repetitions need to
                        // be matched equally
                        splitStr.splice(splitStr.indexOf(curr), 1);
                        return acc + 1;
                      }
                      return acc;
                    }, 0);
                  });
                  console.log(
                    `1167 ███████████████████████████████████████ ${`\u001b[${33}m${`missingLettersCount`}\u001b[${39}m`} = ${JSON.stringify(
                      missingLettersCount,
                      null,
                      4
                    )}`
                  );
                  let maxVal = Math.max(...missingLettersCount);
                  console.log(
                    `1175 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`maxVal`}\u001b[${39}m`} = ${JSON.stringify(
                      maxVal,
                      null,
                      4
                    )}`
                  );
                  // if there's only one value with more characters matched
                  // than others, &rsqb; vs &rsquo; - latter would win matching
                  // against messed up &rsqo; - we pick that winning-one
                  if (
                    maxVal &&
                    missingLettersCount.filter((v2) => v2 === maxVal).length ===
                      1
                  ) {
                    for (
                      let z = 0, len2 = missingLettersCount.length;
                      z < len2;
                      z++
                    ) {
                      if (missingLettersCount[z] === maxVal) {
                        tempEnt = temp[z];
                        console.log(
                          `1197 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${JSON.stringify(
                            tempEnt,
                            null,
                            4
                          )}`
                        );
                        console.log(
                          `1204 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`
                        );
                        rangesArr2.push({
                          ruleName: `bad-html-entity-malformed-${tempEnt}`,
                          entityName: tempEnt,
                          rangeFrom: whatsOnTheLeft as number,
                          rangeTo: i + 1,
                          rangeValEncoded: `&${tempEnt};`,
                          rangeValDecoded: decode(`&${tempEnt};`),
                        });

                        pingAmps(whatsOnTheLeft as number, i);
                        break;
                      }
                    }
                  }
                }
              }

              // if "tempEnt" was not set by now, it is not a known HTML entity
              if (!tempEnt) {
                console.log(
                  `1226 ${`\u001b[${90}m${`so it's not one of known named HTML entities`}\u001b[${39}m`}`
                );
                console.log(
                  `1229 ${`\u001b[${90}m${`checking for broken recognised entities`}\u001b[${39}m`}`
                );

                // it's an unrecognised entity:
                console.log(`1233 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                rangesArr2.push({
                  ruleName: `bad-html-entity-unrecognised`,
                  entityName: null,
                  rangeFrom: whatsOnTheLeft as number,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null,
                });
                pingAmps(whatsOnTheLeft as number, i);
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
          str[whatsEvenMoreToTheLeft as number] === "&" &&
          str[i] === ";" &&
          i - (whatsEvenMoreToTheLeft as number) < maxLength
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
            `1271 ${`\u001b[${32}m${`██`}\u001b[${39}m`} might be a messy entity. We have "${str.slice(
              whatsEvenMoreToTheLeft as number,
              i + 1
            )}"`
          );
          let situation = resemblesNumericEntity(
            str,
            (whatsEvenMoreToTheLeft as number) + 1,
            i
          );
          console.log(
            `1282 ${`\u001b[${32}m${`██ situation:`}\u001b[${39}m`}\n${JSON.stringify(
              situation,
              null,
              4
            )}`
          );

          console.log(
            `1290 FIY, ${`\u001b[${33}m${`potentialEntity`}\u001b[${39}m`} = ${JSON.stringify(
              potentialEntity,
              null,
              4
            )}`
          );

          // push the issue:
          console.log(`1298 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          rangesArr2.push({
            ruleName: `${
              /* istanbul ignore next */
              situation.probablyNumeric
                ? "bad-html-entity-malformed-numeric"
                : "bad-html-entity-unrecognised"
            }`,
            entityName: null,
            rangeFrom: whatsEvenMoreToTheLeft as number,
            rangeTo: i + 1,
            rangeValEncoded: null,
            rangeValDecoded: null,
          });
          pingAmps(whatsEvenMoreToTheLeft as number, i);
        }
      }

      // one-character chunks or chunks ending with ampersand get wiped:
      letterSeqStartAt = null;
      console.log(
        `1319 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = null`
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
        `1333 SET ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = ${letterSeqStartAt}`
      );
    }

    // catch amp;
    if (str[i] === "a") {
      console.log(`1339 ${`\u001b[${90}m${`within a clauses`}\u001b[${39}m`}`);
      // 1. catch recursively-encoded cases. They're easy actually, the task will
      // be deleting sequence of repeated "amp;" between ampersand and letter.

      // For example, we have this:
      // text&   amp  ;  a  m   p   ;  nbsp;text
      // We start at the opening ampersand at index 4;
      let singleAmpOnTheRight = rightSeq(str, i, "m", "p", ";");
      if (singleAmpOnTheRight) {
        console.log(
          `1349 ${`\u001b[${90}m${`confirmed amp; from index ${i} onwards`}\u001b[${39}m`}`
        );

        // if we had to delete all amp;amp;amp; and leave only ampersand, this
        // will be the index to delete up to:
        let toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        console.log(
          `1356 SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`
        );

        // so one &amp; is confirmed.
        let nextAmpOnTheRight = rightSeq(
          str,
          singleAmpOnTheRight.rightmostChar,
          "a",
          "m",
          "p",
          ";"
        );
        if (nextAmpOnTheRight) {
          console.log(
            `1370 ${`\u001b[${90}m${`confirmed another amp; on the right of index ${singleAmpOnTheRight.rightmostChar}`}\u001b[${39}m`}`
          );

          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          console.log(
            `1375 SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`
          );

          let temp;
          do {
            console.log(
              `1381 ${`\u001b[${36}m${`======== loop ========`}\u001b[${39}m`}`
            );
            temp = rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");
            console.log(
              `1385 ${`\u001b[${36}m${`temp = ${JSON.stringify(
                temp,
                null,
                4
              )}`}\u001b[${39}m`}`
            );

            if (temp) {
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
              console.log(
                `1395 ${`\u001b[${36}m${`another amp; confirmed! Now`}\u001b[${39}m`} ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
                  toDeleteAllAmpEndHere,
                  null,
                  4
                )};`
              );
            }
          } while (temp);

          console.log(
            `1405 FINAL ${`\u001b[${32}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
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

        let firstCharThatFollows: number | null = right(
          str,
          toDeleteAllAmpEndHere - 1
        );
        let secondCharThatFollows = firstCharThatFollows
          ? right(str, firstCharThatFollows)
          : null;
        console.log(
          `1427 SET initial ${`\u001b[${33}m${`firstCharThatFollows`}\u001b[${39}m`} = str[${firstCharThatFollows}] = ${
            str[firstCharThatFollows as number]
          }; ${`\u001b[${33}m${`secondCharThatFollows`}\u001b[${39}m`} = str[${secondCharThatFollows}] = ${
            str[secondCharThatFollows as number]
          }`
        );

        // If entity follows, for example,
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // we delete from the first ampersand to the beginning of that entity.
        // Otherwise, we delete only repetitions of amp; + whitespaces in between.
        let matchedTemp = "";
        let matchedVal;
        if (
          secondCharThatFollows &&
          Object.prototype.hasOwnProperty.call(
            entStartsWith,
            str[firstCharThatFollows as number]
          ) &&
          Object.prototype.hasOwnProperty.call(
            entStartsWith[str[firstCharThatFollows as number]],
            str[secondCharThatFollows]
          ) &&
          (entStartsWith as Obj)[str[firstCharThatFollows as number]][
            str[secondCharThatFollows]
          ].some((entity: string) => {
            // if (str.entStartsWith(`${entity};`, firstCharThatFollows)) {
            let matchEntityOnTheRight = rightSeq(
              str,
              toDeleteAllAmpEndHere - 1,
              ...entity.split("")
            );
            if (matchEntityOnTheRight) {
              matchedTemp = entity;
              matchedVal = matchEntityOnTheRight;
              return true;
            }
            return false;
          })
        ) {
          doNothingUntil =
            (firstCharThatFollows as number) + matchedTemp.length + 1;
          console.log(
            `1470 ${`\u001b[${31}m${`██ ACTIVATE doNothingUntil = ${doNothingUntil}`}\u001b[${39}m`}`
          );

          console.log(
            `1474 ENTITY ${`\u001b[${32}m${matchedTemp}\u001b[${39}m`} FOLLOWS`
          );
          // is there ampersand on the left of "i", the first amp;?
          /* istanbul ignore next */
          let whatsOnTheLeft = left(str, i) || 0;

          /* istanbul ignore else */
          if (str[whatsOnTheLeft] === "&") {
            console.log(`1482 ampersand on the left`);
            console.log(
              `1484 ${`\u001b[${33}m${`matchedTemp`}\u001b[${39}m`} = ${JSON.stringify(
                matchedTemp,
                null,
                4
              )}; ${`\u001b[${33}m${`matchedVal`}\u001b[${39}m`} = ${JSON.stringify(
                matchedVal,
                null,
                4
              )}`
            );
            console.log(`1494 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
            rangesArr2.push({
              ruleName: "bad-html-entity-multiple-encoding",
              entityName: matchedTemp,
              rangeFrom: whatsOnTheLeft,
              rangeTo: doNothingUntil,
              rangeValEncoded: `&${matchedTemp};`,
              rangeValDecoded: decode(`&${matchedTemp};`),
            });
            pingAmps(whatsOnTheLeft, i);
          } else if (whatsOnTheLeft) {
            // we need to add the ampersand as well. Now, another consideration
            // appears: whitespace and where exactly to put it. Algorithmically,
            // right here, at this first letter "a" from "amp;&<some-entity>;"
            let rangeFrom = i;
            console.log(`1509 rangeFrom = ${rangeFrom}`);
            let spaceReplacement = "";

            if (str[i - 1] === " ") {
              console.log(`1513`);
              // chomp spaces to the left, but otherwise, don't touch anything
              // TODO
            }
            console.log(`1517 final rangeFrom = ${rangeFrom}`);

            /* istanbul ignore else */
            if (typeof opts.cb === "function") {
              console.log(`1521 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
              rangesArr2.push({
                ruleName: "bad-html-entity-multiple-encoding",
                entityName: matchedTemp,
                rangeFrom,
                rangeTo: doNothingUntil,
                rangeValEncoded: `${spaceReplacement}&${matchedTemp};`,
                rangeValDecoded: `${spaceReplacement}${decode(
                  `&${matchedTemp};`
                )}`,
              });
              pingAmps(rangeFrom, i);
            }
          }
        }
      }
    }

    // catch #x of messed up entities without ampersand (like #x26;)
    if (
      str[i] === "#" &&
      right(str, i) &&
      str[right(str, i) as number].toLowerCase() === "x" &&
      (!str[i - 1] || !left(str, i) || str[left(str, i) as number] !== "&")
    ) {
      console.log(
        `1547 ${`\u001b[${31}m${`██`}\u001b[${39}m`} #x pattern caught`
      );
      if (isNumeric(str[right(str, right(str, i) as number) as number])) {
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

    // ampersand catches are at the bottom to prevent current index
    // being tangled into the catch-logic of a previous entity
    if (str[i] === "&") {
      ampPositions.push(i);
      console.log(
        `1571 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`ampPositions`}\u001b[${39}m`} now = ${JSON.stringify(
          ampPositions,
          null,
          4
        )}`
      );
    }

    if (
      !str[i] &&
      typeof opts.textAmpersandCatcherCb === "function" &&
      ampPositions.length
    ) {
      console.log(
        `1585 ${`\u001b[${32}m${`PING last remaining amp indexes`}\u001b[${39}m`}`
      );
      pingAmps();
    }

    console.log("---------------");
    console.log(
      `1592 ${`\u001b[${90}m${`letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`
    );
    console.log(
      `1595 ${`\u001b[${90}m${`ampPositions = ${JSON.stringify(
        ampPositions,
        null,
        4
      )}`}\u001b[${39}m`}`
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
    console.log(`1621 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} empty array`);
    return [];
  }

  console.log(
    `1626 IN THE END, before merge rangesArr2 = ${JSON.stringify(
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
  //     "ruleName": "bad-html-entity-malformed-amp",
  //     "entityName": "amp",
  //     "rangeFrom": 4,
  //     "rangeTo": 8,
  //     "rangeValEncoded": "&amp;",
  //     "rangeValDecoded": "&"
  // },
  // so instead of [4, 8] that would be [rangeFrom, rangeTo]...
  let res: any = rangesArr2.filter((filteredRangeObj, i) =>
    rangesArr2.every(
      (oneOfEveryObj, y) =>
        i === y ||
        !(
          filteredRangeObj.rangeFrom >= oneOfEveryObj.rangeFrom &&
          filteredRangeObj.rangeTo < oneOfEveryObj.rangeTo
        )
    )
  );

  /* istanbul ignore else */
  if (typeof opts.cb === "function") {
    console.log(`1661 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} mapped`);
    return res.map(opts.cb);
  }

  console.log(
    `1666 RETURN ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  /* istanbul ignore next */
  return res;
}

export { fixEnt, version, allRules };

import {
  allNamedEntities,
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  brokenNamedEntities,
  entEndsWith,
  entStartsWith,
  maxLength,
  uncertain,
} from "all-named-html-entities";
import {
  formatDiagnosticValue,
  hasOwnProp,
  isPlainObject as isObj,
} from "codsen-utils";
import { left, leftSeq, right, rightSeq } from "string-left-right";
import { createMatcher, defaults as typoDefaults } from "string-typo-match";
import type { Ranges } from "../../../ops/typedefs/common";
import { version as v } from "../package.json";
import {
  isLatinLetterOrNumberOrHash,
  removeGappedFromMixedCases,
  resemblesNumericEntity,
} from "./util";

const version: string = v;

declare let DEV: boolean;

const entityNames = [...allNamedEntitiesSetOnly];
// Longer omissions can expose a competing interpretation even when they are
// too lossy to apply. Require one suggestion across this wider ambiguity check,
// then retain the normal omission-ratio limit for the actual replacement.
const entityTypoMatcher = createMatcher(entityNames, {
  minCostGap: typoDefaults.maxCost + 1,
  maxOmissionRatio: 1,
});
const entitiesByLowercase = new Map<string, string[]>();
for (const name of entityNames) {
  const lower = name.toLowerCase();
  const group = entitiesByLowercase.get(lower);
  if (group) {
    group.push(name);
  } else {
    entitiesByLowercase.set(lower, [name]);
  }
}

function matchEntityTypo(input: string): string | null {
  // This established repair is explicit entity policy, outside general scoring.
  if (input === "rsqo") {
    return "rsquo";
  }
  const result = entityTypoMatcher.match(input);
  if (result.bestMatch === null) {
    return null;
  }
  const match = result.matches[0];
  let omitted = 0;
  for (const operation of match.operations) {
    if (
      operation.kind === "missing-character" ||
      operation.kind === "omitted-block"
    ) {
      // HTML entity names are ASCII, so these offsets also count code points.
      omitted += operation.candidateTo - operation.candidateFrom;
    }
  }
  return omitted / match.candidate.length <= typoDefaults.maxOmissionRatio
    ? result.bestMatch
    : null;
}

function decodeName(name: string): string | null {
  const value = allNamedEntities[name];
  return typeof value === "string" ? value : null;
}

function matchAmp(str: string, index: number) {
  return (
    rightSeq(str, index, "a", "m", "p", ";") ||
    rightSeq(str, index, "A", "M", "P", ";")
  );
}

const allRules = entityNames
  .map((ruleName) => `bad-html-entity-malformed-${ruleName}`)
  .concat(entityNames.map((ruleName) => `bad-html-entity-encoded-${ruleName}`))
  .concat([
    "bad-html-entity-unrecognised",
    "bad-html-entity-multiple-encoding",
    "bad-html-entity-encoded-numeric",
    "bad-html-entity-malformed-numeric",
    "bad-html-entity-other",
  ]);
const uncertainEntityNames = new Set(Object.keys(uncertain));

export interface Obj {
  [key: string]: any;
}
export interface cbObj {
  rangeFrom: number;
  rangeTo: number;
  rangeValEncoded: string | null;
  rangeValDecoded: string | null;
  ruleName: string;
  entityName: string | null;
}
export interface Opts<T = unknown> {
  decode: boolean;
  cb: null | ((obj: cbObj) => T);
  entityCatcherCb: null | ((from: number, to: number) => void);
  textAmpersandCatcherCb: null | ((idx: number) => void);
  /** Reports increasing integer percentages, ending at 100 after result callbacks. */
  progressFn: null | ((percDone: number) => void);
}

function fixEnt<T>(
  str: string,
  opts: Partial<Opts<T>> & { cb: (obj: cbObj) => T },
): T[];
function fixEnt(
  str: string,
  opts: Partial<Opts> & { cb: null | undefined },
): cbObj[];
function fixEnt(
  str: string,
  opts?: Partial<Omit<Opts, "cb">> & { cb?: never },
): Ranges;
function fixEnt<T>(str: string, opts: Partial<Opts<T>>): Ranges | cbObj[] | T[];
function fixEnt(str: string, opts?: Partial<Opts>): unknown[] | null {
  DEV &&
    console.log(
      `fixEnt: ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        0,
      )};\n${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4,
      )}`,
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
      `string-fix-broken-named-entities/fixEnt(): [THROW_ID_01] the first input argument must be string! It was given as:\n${formatDiagnosticValue(str, 4)} (${typeof str}-type)`,
    );
  }

  let defaults: Opts = {
    decode: false,
    cb: ({ rangeFrom, rangeTo, rangeValEncoded, rangeValDecoded }: cbObj) =>
      rangeValDecoded || rangeValEncoded
        ? [rangeFrom, rangeTo, opts?.decode ? rangeValDecoded : rangeValEncoded]
        : [rangeFrom, rangeTo],
    textAmpersandCatcherCb: null,
    progressFn: null,
    entityCatcherCb: null,
  };

  if (opts && !isObj(opts)) {
    throw new Error(
      `string-fix-broken-named-entities/fixEnt(): [THROW_ID_02] the second input argument must be a plain object! I was given as:\n${formatDiagnosticValue(opts, 4)} (${typeof opts}-type)`,
    );
  }

  let resolvedOpts = { ...defaults, ...opts };
  DEV &&
    console.log(
      `${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}`,
    );

  if (resolvedOpts.cb && typeof resolvedOpts.cb !== "function") {
    throw new TypeError(
      `string-fix-broken-named-entities/fixEnt(): [THROW_ID_03] resolvedOpts.cb must be a function (or falsy)! Currently it's: ${typeof resolvedOpts.cb}, equal to: ${formatDiagnosticValue(resolvedOpts.cb, 4)}`,
    );
  }
  if (
    resolvedOpts.entityCatcherCb &&
    typeof resolvedOpts.entityCatcherCb !== "function"
  ) {
    throw new TypeError(
      `string-fix-broken-named-entities/fixEnt(): [THROW_ID_04] resolvedOpts.entityCatcherCb must be a function (or falsy)! Currently it's: ${typeof resolvedOpts.entityCatcherCb}, equal to: ${formatDiagnosticValue(resolvedOpts.entityCatcherCb, 4)}`,
    );
  }
  if (
    resolvedOpts.progressFn &&
    typeof resolvedOpts.progressFn !== "function"
  ) {
    throw new TypeError(
      `string-fix-broken-named-entities/fixEnt(): [THROW_ID_05] resolvedOpts.progressFn must be a function (or falsy)! Currently it's: ${typeof resolvedOpts.progressFn}, equal to: ${formatDiagnosticValue(resolvedOpts.progressFn, 4)}`,
    );
  }
  if (
    resolvedOpts.textAmpersandCatcherCb &&
    typeof resolvedOpts.textAmpersandCatcherCb !== "function"
  ) {
    throw new TypeError(
      `string-fix-broken-named-entities/fixEnt(): [THROW_ID_06] resolvedOpts.textAmpersandCatcherCb must be a function (or falsy)! Currently it's: ${typeof resolvedOpts.textAmpersandCatcherCb}, equal to: ${formatDiagnosticValue(resolvedOpts.textAmpersandCatcherCb, 4)}`,
    );
  }
  DEV &&
    console.log(
      `fixEnt: FINAL ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} used: ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}`,
    );

  // state flags
  // ---------------------------------------------------------------------------

  // this is what we'll return, process by default callback or user's custom-one
  let rangesArr2: cbObj[] = [];

  let percentageDone: number | undefined;
  let lastPercentageDone: number | undefined;

  // Reserve the final 5% for range cleanup and result callbacks.
  let len = str.length + 1;

  // doNothingUntil can be either falsy or truthy: index number or boolean true
  // If it's number, it's instruction to avoid actions until that index is
  // reached when traversing. If it's boolean, it means we don't know when we'll
  // stop, we just turn on the flag (permanently, for now).
  let doNothingUntil: number | null | boolean = null;

  // catch letter sequences, possibly separated with whitespace. Non-letter
  // breaks the sequence. Main aim is to catch names of encoded HTML entities
  // for example, nbsp from "&nbsp;"
  let letterSeqStartAt: number | null = null;
  // Only long candidates need content/whitespace bookkeeping. Keep the
  // ordinary short-name and prose paths free of per-character counters.
  type LongSequence = {
    start: number;
    scannedTo: number;
    meaningful: number;
    numeric: boolean;
    nextCheck: number;
  };
  let longSequence: LongSequence | null = null;

  let brokenNumericEntityStartAt: number | null = null;

  let ampPositions: number[] = [];

  function pingAmps(untilIdx?: number, loopIndexI?: number): void {
    if (
      typeof resolvedOpts.textAmpersandCatcherCb === "function" &&
      ampPositions.length
    ) {
      DEV && console.log(`loop`);
      for (const currentAmp of ampPositions) {
        DEV &&
          console.log(
            `SET ${`\u001b[${36}m${`currentAmp`}\u001b[${39}m`} = ${JSON.stringify(
              currentAmp,
              null,
              4,
            )}`,
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
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PING`}\u001b[${39}m`} resolvedOpts.textAmpersandCatcherCb() with ${`\u001b[${35}m${currentAmp}\u001b[${39}m`}`,
            );
          // ping each ampersand's index, starting from zero index:
          resolvedOpts.textAmpersandCatcherCb(currentAmp);
        } // else, it gets discarded without action
      }
      ampPositions.length = 0;
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
    if (resolvedOpts.progressFn) {
      percentageDone = Math.floor((i / len) * 95);
      /* c8 ignore next */
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        resolvedOpts.progressFn(percentageDone);
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
    DEV &&
      console.log(
        `fixEnt: \n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
          str[i]?.trim().length ? str[i] : JSON.stringify(str[i], null, 4)
        }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`,
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
        DEV &&
          console.log(
            `fixEnt: RESET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = null`,
          );
      } else {
        DEV && console.log(`fixEnt: continue`);
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

    // Bound meaningful name/prose content independently of whitespace gaps.
    // Inspect each long candidate incrementally, only when its current budget
    // expires. Numeric bodies retain arbitrary zero padding; unrelated prose
    // still abandons the candidate after 50 meaningful characters.
    if (letterSeqStartAt !== null && i - letterSeqStartAt > 50) {
      if (
        !longSequence ||
        (longSequence as LongSequence).start !== letterSeqStartAt
      ) {
        longSequence = {
          start: letterSeqStartAt,
          scannedTo: letterSeqStartAt + 1,
          meaningful: 1,
          numeric:
            str[letterSeqStartAt] === "#" &&
            str[left(str, letterSeqStartAt) as number] === "&",
          nextCheck: letterSeqStartAt + 50,
        };
      }
      if (
        longSequence.numeric &&
        str[i] &&
        str[i] !== ";" &&
        !/^[0-9a-fA-FxX]$/.test(str[i]) &&
        str[i].trim()
      ) {
        // Abandon an oversized numeric candidate at the first invalid
        // character so subsequent names keep their original scan boundary.
        longSequence.numeric = false;
        longSequence.nextCheck = i - 1;
      }
      if (i > longSequence.nextCheck || str[i] === ";") {
        for (; longSequence.scannedTo < i; longSequence.scannedTo++) {
          const char = str[longSequence.scannedTo];
          // The active sequence contains only ASCII name characters or
          // whitespace, so all its non-ASCII characters are whitespace.
          if (char > " " && char < "\x7f") {
            longSequence.meaningful++;
            if (longSequence.numeric && !/^[0-9a-fA-FxX]$/.test(char)) {
              longSequence.numeric = false;
            }
          }
        }
        if (longSequence.meaningful > 50 && !longSequence.numeric) {
          letterSeqStartAt = null;
          brokenNumericEntityStartAt = null;
          DEV &&
            console.log(
              `${`\u001b[${31}m${`WIPE letterSeqStartAt`}\u001b[${39}m`}`,
            );
        } else {
          longSequence.nextCheck =
            i + (longSequence.numeric ? 50 : 50 - longSequence.meaningful);
        }
      }
    }

    // Catch the end of a latin letter sequence.
    if (
      letterSeqStartAt !== null &&
      (!str[i] ||
        (str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i])))
    ) {
      DEV &&
        console.log(
          `fixEnt: ${`\u001b[${36}m${`██ letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`,
        );
      if (
        i > (letterSeqStartAt as number) + 1 ||
        (str[letterSeqStartAt] === "#" && str[i] === ";")
      ) {
        let potentialEntity = str.slice(letterSeqStartAt, i);
        DEV &&
          console.log(
            `fixEnt: ${`\u001b[${35}m${`██ CARVED A SEQUENCE: ${potentialEntity}`}\u001b[${39}m`}`,
          );

        let whatIsOnTheLeft = left(str, letterSeqStartAt);
        let whatIsEvenMoreToTheLeft = whatIsOnTheLeft
          ? left(str, whatIsOnTheLeft)
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
          str[whatIsOnTheLeft as number] === "&" &&
          (!str[i] || str[i] !== ";")
        ) {
          DEV &&
            console.log(
              `${`\u001b[${35}m${`semicolon might be missing`}\u001b[${39}m`}`,
            );
          // check, what's the index of the character to the right of
          // str[whatIsOnTheLeft], is it any of the known named HTML entities.
          let firstChar: number | null = letterSeqStartAt;
          /* c8 ignore next */
          let secondChar: number | null = letterSeqStartAt
            ? right(str, letterSeqStartAt)
            : null;
          DEV &&
            console.log(
              `firstChar = str[${firstChar}] = ${
                str[firstChar]
              }; secondChar = str[${secondChar}] = ${
                str[secondChar as number]
              }`,
            );
          // we'll tap the "entStartsWith" from npm package "all-named-html-entities"
          // which gives a plain object of named entities, all grouped by first
          // and second character first. This reduces amount of matching needed.
          DEV &&
            console.log(
              `██ ${
                secondChar !== null &&
                hasOwnProp(entStartsWith, str[firstChar]) &&
                hasOwnProp(entStartsWith[str[firstChar]], str[secondChar])
              }`,
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

          /* c8 ignore next */
          if (
            hasOwnProp(entStartsWith, str[firstChar]) &&
            hasOwnProp(entStartsWith[str[firstChar]], str[secondChar as number])
          ) {
            DEV && console.log();
            let tempEnt = "";
            let tempRes;

            const possibleMatches = [];
            for (const oneOfKnownEntities of entStartsWith[str[firstChar]][
              str[secondChar as number]
            ]) {
              // find all entities that match on the right of here
              // rightSeq could theoretically give positive answer, zero index,
              // but it's impossible here, so we're fine to match "if true".
              tempRes = rightSeq(
                str,
                (letterSeqStartAt as number) - 1,
                ...(oneOfKnownEntities.split("") as [string, ...string[]]),
              );
              if (tempRes) {
                possibleMatches.push({ tempEnt: oneOfKnownEntities, tempRes });
              }
            }
            DEV &&
              console.log(
                `${`\u001b[${35}m${`temp1 BEFORE filtering = ${JSON.stringify(
                  possibleMatches,
                  null,
                  4,
                )}`}\u001b[${39}m`}`,
              );
            const temp1 = removeGappedFromMixedCases(str, possibleMatches);
            DEV &&
              console.log(
                `${`\u001b[${35}m${`temp1 AFTER filtering = ${JSON.stringify(
                  temp1,
                  null,
                  4,
                )}`}\u001b[${39}m`}`,
              );

            /* c8 ignore next */
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
            DEV &&
              console.log(
                `${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt}; ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                  tempRes,
                  null,
                  4,
                )}`,
              );

            DEV &&
              console.log(
                `${`\u001b[${33}m${`str[tempRes.rightmostChar + 1] === "&"`}\u001b[${39}m`} = ${
                  tempRes?.rightmostChar
                    ? JSON.stringify(
                        str[tempRes.rightmostChar + 1] === "&",
                        null,
                        4,
                      )
                    : ""
                }`,
              );
            if (
              tempEnt &&
              tempRes &&
              (!uncertainEntityNames.has(tempEnt) ||
                !str[tempRes.rightmostChar + 1] ||
                str[tempRes.rightmostChar + 1] === "&" ||
                (((uncertain[tempEnt] as Obj).addSemiIfAmpPresent === true ||
                  ((uncertain[tempEnt] as Obj).addSemiIfAmpPresent &&
                    !str[tempRes.rightmostChar + 1]?.trim().length)) &&
                  str[tempRes.leftmostChar - 1] === "&"))
            ) {
              DEV &&
                console.log(
                  `${`\u001b[${35}m${`entity ${tempEnt} is indeed on the left of index ${i}, the situation is: ${JSON.stringify(
                    tempRes,
                    null,
                    4,
                  )}`}\u001b[${39}m`}`,
                );

              let decodedEntity = decodeName(tempEnt);

              DEV && console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
              rangesArr2.push({
                ruleName: `bad-html-entity-malformed-${tempEnt}`,
                entityName: tempEnt,
                rangeFrom: whatIsOnTheLeft || 0,
                rangeTo: tempRes.rightmostChar + 1,
                rangeValEncoded: `&${tempEnt};`,
                rangeValDecoded: decodedEntity,
              });

              // release all ampersands
              DEV &&
                console.log(
                  `███████████████████████████████████████ release ampersands`,
                );
              DEV &&
                console.log(
                  `FIY, ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                    tempRes,
                    null,
                    4,
                  )}`,
                );
              pingAmps(whatIsOnTheLeft || 0, i);
            } else {
              DEV && console.log(`ELSE, it was just a legit ampersand`);
            }
          }
        } else if (
          str[whatIsOnTheLeft as number] !== "&" &&
          str[whatIsEvenMoreToTheLeft as number] !== "&" &&
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

          DEV &&
            console.log(
              `${`\u001b[${35}m${`ampersand might be missing`}\u001b[${39}m`}`,
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
            brokenNumericEntityStartAt === null &&
            secondToLast !== null &&
            hasOwnProp(entEndsWith, str[lastChar as number]) &&
            hasOwnProp(entEndsWith[str[lastChar as number]], str[secondToLast])
          ) {
            DEV && console.log();
            let tempEnt = "";
            let tempRes;

            const possibleMatches = [];
            for (const oneOfKnownEntities of entEndsWith[
              str[lastChar as number]
            ][str[secondToLast]]) {
              // find all entities that match on the right of here
              // rightSeq could theoretically give positive answer, zero index,
              // but it's impossible here, so we're fine to match "if true".
              tempRes = leftSeq(
                str,
                i,
                ...(oneOfKnownEntities.split("") as [string, ...string[]]),
              );
              if (
                tempRes &&
                !(
                  oneOfKnownEntities === "block" &&
                  str[left(str, letterSeqStartAt) as number] === ":"
                )
              ) {
                possibleMatches.push({ tempEnt: oneOfKnownEntities, tempRes });
              }
            }

            DEV &&
              console.log(
                `${`\u001b[${35}m${`temp1 BEFORE filtering = ${JSON.stringify(
                  possibleMatches,
                  null,
                  4,
                )}`}\u001b[${39}m`}`,
              );
            const temp1 = removeGappedFromMixedCases(str, possibleMatches);
            DEV &&
              console.log(
                `${`\u001b[${35}m${`temp1 AFTER filtering = ${JSON.stringify(
                  temp1,
                  null,
                  4,
                )}`}\u001b[${39}m`}`,
              );

            /* c8 ignore next */
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
            DEV &&
              console.log(
                `${`\u001b[${33}m${`tempEnt`}\u001b[${39}m`} = ${tempEnt} - ${`\u001b[${33}m${`tempRes`}\u001b[${39}m`} = ${JSON.stringify(
                  tempRes,
                  null,
                  4,
                )}`,
              );

            DEV &&
              console.log(
                `letterSeqStartAt = ${letterSeqStartAt}; str[letterSeqStartAt] = ${
                  str[letterSeqStartAt]
                }; tempRes.leftmostChar = ${
                  tempRes?.leftmostChar ? tempRes.leftmostChar : "undefined"
                }; str[tempRes.leftmostChar - 1] = ${
                  tempRes?.leftmostChar
                    ? str[tempRes.leftmostChar - 1]
                    : "undefined"
                }`,
              );
            if (
              tempEnt &&
              tempRes &&
              (!uncertainEntityNames.has(tempEnt) ||
                uncertain[tempEnt].addAmpIfSemiPresent === true ||
                (uncertain[tempEnt].addAmpIfSemiPresent &&
                  (!tempRes.leftmostChar ||
                    (typeof str[tempRes.leftmostChar - 1] === "string" &&
                      !str[tempRes.leftmostChar - 1].trim().length))))
            ) {
              DEV &&
                console.log(
                  `${`\u001b[${35}m${`entity ${tempEnt} is indeed on the left of index ${i}, the situation is: ${JSON.stringify(
                    tempRes,
                    null,
                    4,
                  )}`}\u001b[${39}m`}`,
                );

              let decodedEntity = decodeName(tempEnt);

              DEV && console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
              rangesArr2.push({
                ruleName: `bad-html-entity-malformed-${tempEnt}`,
                entityName: tempEnt,
                rangeFrom: tempRes.leftmostChar,
                rangeTo: i + 1,
                rangeValEncoded: `&${tempEnt};`,
                rangeValDecoded: decodedEntity,
              });
              pingAmps(tempRes.leftmostChar, i);
            } else {
              DEV &&
                console.log(
                  `${`\u001b[${31}m${`██`}\u001b[${39}m`} "${tempEnt}" is among uncertain entities`,
                );
            }
          } else if (brokenNumericEntityStartAt !== null) {
            // we have a malformed numeric entity reference, like #x26; without
            // an ampersand but with the rest of characters

            // 1. push the issue:
            DEV && console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
            DEV &&
              console.log(
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} brokenNumericEntityStartAt = null`,
              );
          }
        } else if (
          str[i] === ";" &&
          (str[whatIsOnTheLeft as number] === "&" ||
            (str[whatIsOnTheLeft as number] === ";" &&
              str[whatIsEvenMoreToTheLeft as number] === "&"))
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
          DEV &&
            console.log(
              `${`\u001b[${32}m${`██ looks like some sort of HTML entity!`}\u001b[${39}m`}`,
            );

          const openingAmpersand =
            str[whatIsOnTheLeft as number] === "&"
              ? (whatIsOnTheLeft as number)
              : (whatIsEvenMoreToTheLeft as number);
          let startOfTheSeq = letterSeqStartAt - 1;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`startOfTheSeq`}\u001b[${39}m`} = ${JSON.stringify(
                startOfTheSeq,
                null,
                4,
              )}`,
            );
          if (
            !str[letterSeqStartAt - 1].trim() &&
            str[whatIsOnTheLeft as number] === "&"
          ) {
            startOfTheSeq = whatIsOnTheLeft as number;
            DEV &&
              console.log(
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`startOfTheSeq`}\u001b[${39}m`} = ${JSON.stringify(
                  startOfTheSeq,
                  null,
                  4,
                )}`,
              );
          }

          // find out more: is it legit, unrecognised or numeric...

          /* c8 ignore next */
          if (str.slice((whatIsOnTheLeft as number) + 1, i).trim().length) {
            DEV &&
              console.log(
                `${`\u001b[${90}m${`so there are some characters in between: & and ;`}\u001b[${39}m`}`,
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
              (whatIsOnTheLeft as number) + 1,
              i,
            );
            DEV &&
              console.log(
                `${`\u001b[${33}m${`situation`}\u001b[${39}m`} = ${JSON.stringify(
                  situation,
                  null,
                  4,
                )}`,
              );

            if (situation.probablyNumeric || situation.charTrimmed[0] === "#") {
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`██ seems like a numeric HTML entity!`}\u001b[${39}m`}`,
                );

              // Recognition is deliberately tolerant; decoding requires every
              // character to belong to one complete decimal or hexadecimal body.
              let numericValue = NaN;
              if (
                !situation.whitespaceCount &&
                /^#(?:[0-9]+|[xX][0-9a-fA-F]+)$/.test(situation.charTrimmed)
              ) {
                let hexadecimal =
                  situation.charTrimmed[1].toLowerCase() === "x";
                numericValue = parseInt(
                  situation.charTrimmed.slice(hexadecimal ? 2 : 1),
                  hexadecimal ? 16 : 10,
                );
              }

              // Keep the package's deletion policy for malformed references,
              // including null, surrogate, and out-of-range values. Other scalar
              // values decode directly, without HTML C1 control remapping.
              if (
                numericValue > 0 &&
                numericValue <= 0x10ffff &&
                !(numericValue >= 0xd800 && numericValue <= 0xdfff)
              ) {
                if (resolvedOpts.decode) {
                  let decodedEntityValue = String.fromCodePoint(numericValue);
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`██ it's a ${
                        situation.probablyNumeric === "hexi" ? "hexi" : ""
                      }decimal numeric entity reference: "${decodedEntityValue}"`}\u001b[${39}m`}`,
                    );
                  // unless decoding was requested, no further action is needed:
                  DEV &&
                    console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                  rangesArr2.push({
                    ruleName: `bad-html-entity-encoded-numeric`,
                    entityName: situation.charTrimmed,
                    rangeFrom: openingAmpersand,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${situation.charTrimmed};`,
                    rangeValDecoded: decodedEntityValue,
                  });
                }

                DEV && console.log(`pingAmps()`);
                pingAmps(openingAmpersand, i);

                if (resolvedOpts.entityCatcherCb) {
                  DEV && console.log(`call resolvedOpts.entityCatcherCb()`);
                  resolvedOpts.entityCatcherCb(openingAmpersand, i + 1);
                }
              } else {
                // RAISE A GENERIC ERROR
                DEV && console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                rangesArr2.push({
                  ruleName: `bad-html-entity-malformed-numeric`,
                  entityName: null,
                  rangeFrom: openingAmpersand,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null,
                });
                pingAmps(openingAmpersand, i);
              }
            } else {
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`it's either named or some sort of messed up HTML entity`}\u001b[${39}m`}`,
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
                potentialEntity,
              )
                .filter((char) => char.trim().length)
                .join("");

              if (
                potentialEntityOnlyNonWhitespaceChars.length <= maxLength &&
                allNamedEntitiesSetOnlyCaseInsensitive.has(
                  potentialEntityOnlyNonWhitespaceChars.toLowerCase(),
                )
              ) {
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`MATCHED HEALTHY "${potentialEntityOnlyNonWhitespaceChars}"!!!`}\u001b[${39}m`}`,
                  );

                DEV &&
                  console.log(
                    `FIY, ${`\u001b[${33}m${`ampPositions`}\u001b[${39}m`} = ${JSON.stringify(
                      ampPositions,
                      null,
                      4,
                    )}`,
                  );

                DEV &&
                  console.log(
                    `FIY, ${`\u001b[${33}m${`whatIsOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
                      whatIsOnTheLeft,
                      null,
                      4,
                    )}`,
                  );

                if (
                  // first, check is the letter case all right
                  typeof potentialEntityOnlyNonWhitespaceChars === "string" &&
                  !allNamedEntitiesSetOnly.has(
                    potentialEntityOnlyNonWhitespaceChars,
                  )
                ) {
                  DEV &&
                    console.log(
                      `${`\u001b[${31}m${`a problem with letter case!`}\u001b[${39}m`}`,
                    );
                  let matchingEntitiesOfCorrectCaseArr =
                    entitiesByLowercase.get(
                      potentialEntityOnlyNonWhitespaceChars.toLowerCase(),
                    ) || [];

                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`}: ${`\u001b[${33}m${`matchingEntitiesOfCorrectCaseArr`}\u001b[${39}m`} = ${JSON.stringify(
                        matchingEntitiesOfCorrectCaseArr,
                        null,
                        4,
                      )}`,
                    );

                  if (matchingEntitiesOfCorrectCaseArr.length === 1) {
                    DEV &&
                      console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                    rangesArr2.push({
                      ruleName: `bad-html-entity-malformed-${matchingEntitiesOfCorrectCaseArr[0]}`,
                      entityName: matchingEntitiesOfCorrectCaseArr[0],
                      rangeFrom: openingAmpersand,
                      rangeTo: i + 1,
                      rangeValEncoded: `&${matchingEntitiesOfCorrectCaseArr[0]};`,
                      rangeValDecoded: decodeName(
                        matchingEntitiesOfCorrectCaseArr[0],
                      ),
                    });
                    pingAmps(openingAmpersand, i);
                  } else {
                    DEV &&
                      console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                    rangesArr2.push({
                      ruleName: `bad-html-entity-unrecognised`,
                      entityName: null,
                      rangeFrom: openingAmpersand,
                      rangeTo: i + 1,
                      rangeValEncoded: null,
                      rangeValDecoded: null,
                    });
                    pingAmps(openingAmpersand, i);
                  }
                } else if (
                  // is it really healthy? measuring distance is a way to find out
                  // any present whitespace characters will bloat the length...
                  i - (whatIsOnTheLeft as number) - 1 !==
                    potentialEntityOnlyNonWhitespaceChars.length ||
                  str[whatIsOnTheLeft as number] !== "&"
                ) {
                  DEV &&
                    console.log(
                      `${`\u001b[${31}m${`whitespace present!`}\u001b[${39}m`}`,
                    );

                  let rangeFrom =
                    str[whatIsOnTheLeft as number] === "&"
                      ? whatIsOnTheLeft
                      : whatIsEvenMoreToTheLeft;

                  if (
                    // if it's a dubious entity
                    uncertainEntityNames.has(
                      potentialEntityOnlyNonWhitespaceChars,
                    ) &&
                    // and there's a space after ampersand
                    !str[(rangeFrom as number) + 1].trim().length
                  ) {
                    DEV &&
                      console.log(
                        `${`\u001b[${31}m${`BAIL EARLY`}\u001b[${39}m`} - reset and continue - it's a known uncertain entity!`,
                      );
                    letterSeqStartAt = null;
                    continue;
                  }

                  DEV &&
                    console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                  rangesArr2.push({
                    ruleName: `bad-html-entity-malformed-${potentialEntityOnlyNonWhitespaceChars}`,
                    entityName: potentialEntityOnlyNonWhitespaceChars,
                    rangeFrom: rangeFrom as number,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${potentialEntityOnlyNonWhitespaceChars};`,
                    rangeValDecoded: decodeName(
                      potentialEntityOnlyNonWhitespaceChars,
                    ),
                  });
                  pingAmps(rangeFrom as number, i);
                } else if (resolvedOpts.decode) {
                  DEV &&
                    console.log(
                      `${`\u001b[${31}m${`decode requested!!!`}\u001b[${39}m`}`,
                    );

                  // last thing, if decode is required, we've got an error still...
                  DEV &&
                    console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                  rangesArr2.push({
                    ruleName: `bad-html-entity-encoded-${potentialEntityOnlyNonWhitespaceChars}`,
                    entityName: potentialEntityOnlyNonWhitespaceChars,
                    rangeFrom: openingAmpersand,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${potentialEntityOnlyNonWhitespaceChars};`,
                    rangeValDecoded: decodeName(
                      potentialEntityOnlyNonWhitespaceChars,
                    ),
                  });
                  pingAmps(openingAmpersand, i);
                } else if (
                  resolvedOpts.entityCatcherCb ||
                  resolvedOpts.textAmpersandCatcherCb
                ) {
                  // it's healthy - so at least ping the entity catcher

                  if (resolvedOpts.entityCatcherCb) {
                    DEV && console.log(`call resolvedOpts.entityCatcherCb()`);
                    resolvedOpts.entityCatcherCb(
                      whatIsOnTheLeft as number,
                      i + 1,
                    );
                  }

                  if (resolvedOpts.textAmpersandCatcherCb) {
                    DEV && console.log(`call pingAmps()`);
                    pingAmps(openingAmpersand, i);
                  }
                }

                DEV && console.log(`reset and continue`);
                letterSeqStartAt = null;
                continue;
              } else {
                DEV &&
                  console.log(
                    `${`\u001b[${31}m${`not recognised "${potentialEntity}" - moving on`}\u001b[${39}m`}`,
                  );
              }

              // First, match against case-insensitive list

              // 1. check, maybe it's a known HTML entity
              if (DEV) {
                let firstChar = letterSeqStartAt;
                /* c8 ignore next */
                let secondChar = letterSeqStartAt
                  ? right(str, letterSeqStartAt)
                  : null;
                console.log(
                  `firstChar = str[${firstChar}] = ${
                    str[firstChar]
                  }; secondChar = str[${secondChar}] = ${
                    str[secondChar as number]
                  }`,
                );
              }
              let tempEnt = "";

              DEV &&
                console.log(
                  `FIY, situation.charTrimmed.toLowerCase() = "${situation.charTrimmed.toLowerCase()}"`,
                );

              if (
                hasOwnProp(
                  brokenNamedEntities,
                  situation.charTrimmed.toLowerCase(),
                )
              ) {
                //
                //                          case I.
                //

                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`██`}\u001b[${39}m`} known broken entity ${situation.charTrimmed.toLowerCase()} is indeed on the right`,
                  );

                DEV &&
                  console.log(
                    `broken entity ${situation.charTrimmed.toLowerCase()} is indeed on the right`,
                  );
                tempEnt = situation.charTrimmed;

                let decodedEntity = decodeName(
                  brokenNamedEntities[situation.charTrimmed.toLowerCase()],
                );

                DEV && console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                rangesArr2.push({
                  ruleName: `bad-html-entity-malformed-${
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                  }`,
                  entityName: brokenNamedEntities[
                    situation.charTrimmed.toLowerCase()
                  ] as string,
                  rangeFrom: openingAmpersand,
                  rangeTo: i + 1,
                  rangeValEncoded: `&${
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                  };`,
                  rangeValDecoded: decodedEntity,
                });
                pingAmps(openingAmpersand, i);
              } else {
                // Match only the isolated name; surrounding prose must not
                // influence which candidate wins. Curated repairs above remain
                // domain policy, independent of the general typo model.
                // Gaps are tolerated by the exact and curated paths too;
                // they do not consume the typo budget. Keep document offsets.
                tempEnt =
                  matchEntityTypo(potentialEntityOnlyNonWhitespaceChars) ?? "";
                if (tempEnt) {
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`TYPO MATCH`}\u001b[${39}m`} ${tempEnt}`,
                    );
                  rangesArr2.push({
                    ruleName: `bad-html-entity-malformed-${tempEnt}`,
                    entityName: tempEnt,
                    rangeFrom: openingAmpersand,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${tempEnt};`,
                    rangeValDecoded: decodeName(tempEnt),
                  });
                  pingAmps(openingAmpersand, i);
                }
                // An ambiguous or absent match reaches the existing
                // unrecognised diagnostic and deletion-range convention below.
              }

              // if "tempEnt" was not set by now, it is not a known HTML entity
              if (!tempEnt) {
                DEV &&
                  console.log(
                    `${`\u001b[${90}m${`so it's not one of known named HTML entities`}\u001b[${39}m`}`,
                  );
                DEV &&
                  console.log(
                    `${`\u001b[${90}m${`checking for broken recognised entities`}\u001b[${39}m`}`,
                  );

                // it's an unrecognised entity:
                DEV && console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
                rangesArr2.push({
                  ruleName: `bad-html-entity-unrecognised`,
                  entityName: null,
                  rangeFrom: openingAmpersand,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null,
                });
                pingAmps(openingAmpersand, i);
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
          str[whatIsEvenMoreToTheLeft as number] === "&" &&
          str[i] === ";" &&
          i - (whatIsEvenMoreToTheLeft as number) < maxLength
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
          DEV &&
            console.log(
              `${`\u001b[${32}m${`██`}\u001b[${39}m`} might be a messy entity. We have "${str.slice(
                whatIsEvenMoreToTheLeft as number,
                i + 1,
              )}"`,
            );
          let situation = resemblesNumericEntity(
            str,
            (whatIsEvenMoreToTheLeft as number) + 1,
            i,
          );
          DEV &&
            console.log(
              `${`\u001b[${32}m${`██ situation:`}\u001b[${39}m`}\n${JSON.stringify(
                situation,
                null,
                4,
              )}`,
            );

          DEV &&
            console.log(
              `FIY, ${`\u001b[${33}m${`potentialEntity`}\u001b[${39}m`} = ${JSON.stringify(
                potentialEntity,
                null,
                4,
              )}`,
            );

          // push the issue:
          DEV && console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          rangesArr2.push({
            ruleName: `${
              /* c8 ignore next */
              situation.probablyNumeric
                ? "bad-html-entity-malformed-numeric"
                : "bad-html-entity-unrecognised"
            }`,
            entityName: null,
            rangeFrom: whatIsEvenMoreToTheLeft as number,
            rangeTo: i + 1,
            rangeValEncoded: null,
            rangeValDecoded: null,
          });
          pingAmps(whatIsEvenMoreToTheLeft as number, i);
        }
      }

      // one-character chunks or chunks ending with ampersand get wiped:
      letterSeqStartAt = null;
      brokenNumericEntityStartAt = null;
      DEV &&
        console.log(
          `${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = null`,
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
      DEV &&
        console.log(
          `SET ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = ${letterSeqStartAt}`,
        );
    }

    // catch amp;
    if (str[i] === "a" || str[i] === "A") {
      DEV &&
        console.log(`${`\u001b[${90}m${`within a clauses`}\u001b[${39}m`}`);
      // 1. catch recursively-encoded cases. They're easy actually, the task will
      // be deleting sequence of repeated "amp;" between ampersand and letter.

      // For example, we have this:
      // text&   amp  ;  a  m   p   ;  nbsp;text
      // We start at the opening ampersand at index 4;
      let singleAmpOnTheRight =
        str[i] === "a"
          ? rightSeq(str, i, "m", "p", ";")
          : rightSeq(str, i, "M", "P", ";");
      if (singleAmpOnTheRight) {
        DEV &&
          console.log(
            `${`\u001b[${90}m${`confirmed amp; from index ${i} onwards`}\u001b[${39}m`}`,
          );

        // if we had to delete all amp;amp;amp; and leave only ampersand, this
        // will be the index to delete up to:
        let toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`,
          );

        // so one &amp; is confirmed.
        let nextAmpOnTheRight = matchAmp(
          str,
          singleAmpOnTheRight.rightmostChar,
        );
        let finalAmpName = "amp";
        if (nextAmpOnTheRight) {
          finalAmpName =
            str[nextAmpOnTheRight.leftmostChar] === "A" ? "AMP" : "amp";
          DEV &&
            console.log(
              `${`\u001b[${90}m${`confirmed another amp; on the right of index ${singleAmpOnTheRight.rightmostChar}`}\u001b[${39}m`}`,
            );

          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`,
            );

          let temp;
          do {
            DEV &&
              console.log(
                `${`\u001b[${36}m${`======== loop ========`}\u001b[${39}m`}`,
              );
            temp = matchAmp(str, toDeleteAllAmpEndHere - 1);
            DEV &&
              console.log(
                `${`\u001b[${36}m${`temp = ${JSON.stringify(
                  temp,
                  null,
                  4,
                )}`}\u001b[${39}m`}`,
              );

            if (temp) {
              finalAmpName = str[temp.leftmostChar] === "A" ? "AMP" : "amp";
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
              DEV &&
                console.log(
                  `${`\u001b[${36}m${`another amp; confirmed! Now`}\u001b[${39}m`} ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
                    toDeleteAllAmpEndHere,
                    null,
                    4,
                  )};`,
                );
            }
          } while (temp);

          DEV &&
            console.log(
              `FINAL ${`\u001b[${32}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
                toDeleteAllAmpEndHere,
                null,
                4,
              )}`,
            );
        }

        // What we have is toDeleteAllAmpEndHere which marks where the last amp;
        // semicolon ends (were we to delete the whole thing).
        // For example, in:
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // this would be index 49, the "n" from "nbsp;"

        let firstCharThatFollows: number | null = right(
          str,
          toDeleteAllAmpEndHere - 1,
        );
        let secondCharThatFollows = firstCharThatFollows
          ? right(str, firstCharThatFollows)
          : null;
        DEV &&
          console.log(
            `SET initial ${`\u001b[${33}m${`firstCharThatFollows`}\u001b[${39}m`} = str[${firstCharThatFollows}] = ${
              str[firstCharThatFollows as number]
            }; ${`\u001b[${33}m${`secondCharThatFollows`}\u001b[${39}m`} = str[${secondCharThatFollows}] = ${
              str[secondCharThatFollows as number]
            }`,
          );

        // If entity follows, for example,
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // we delete from the first ampersand to the beginning of that entity.
        // Otherwise, we delete only repetitions of amp; + whitespaces in between.
        let matchedTemp = "";
        let matchedEnd = 0;
        if (
          secondCharThatFollows !== null &&
          hasOwnProp(entStartsWith, str[firstCharThatFollows as number]) &&
          hasOwnProp(
            entStartsWith[str[firstCharThatFollows as number]],
            str[secondCharThatFollows],
          )
        ) {
          for (const entity of entStartsWith[
            str[firstCharThatFollows as number]
          ][str[secondCharThatFollows]]) {
            let matchEntityOnTheRight = rightSeq(
              str,
              toDeleteAllAmpEndHere - 1,
              ...(entity.split("") as [string, ...string[]]),
            );
            if (
              matchEntityOnTheRight &&
              entity.length > matchedTemp.length &&
              !isLatinLetterOrNumberOrHash(
                str[matchEntityOnTheRight.rightmostChar + 1],
              )
            ) {
              const nextNonWhitespace = right(
                str,
                matchEntityOnTheRight.rightmostChar,
              );
              const hasSemicolon =
                nextNonWhitespace !== null && str[nextNonWhitespace] === ";";
              const followingChar =
                str[matchEntityOnTheRight.rightmostChar + 1];
              if (
                !hasSemicolon &&
                uncertainEntityNames.has(entity) &&
                followingChar &&
                followingChar !== "&" &&
                uncertain[entity].addSemiIfAmpPresent !== true &&
                !(
                  uncertain[entity].addSemiIfAmpPresent && !followingChar.trim()
                )
              ) {
                continue;
              }
              matchedTemp = entity;
              // Names can contain gaps, and the semicolon can be absent.
              // Preserve the actual endpoint instead of assuming name.length.
              matchedEnd = hasSemicolon
                ? (nextNonWhitespace as number) + 1
                : matchEntityOnTheRight.rightmostChar + 1;
            }
          }
        }
        if (
          !matchedTemp &&
          toDeleteAllAmpEndHere > singleAmpOnTheRight.rightmostChar + 1
        ) {
          // In &amp;amp;, the final amp; is the encoded entity itself.
          matchedTemp = finalAmpName;
          matchedEnd = toDeleteAllAmpEndHere;
        }
        if (matchedTemp) {
          doNothingUntil = matchedEnd;
          letterSeqStartAt = null;
          brokenNumericEntityStartAt = null;
          DEV &&
            console.log(
              `${`\u001b[${31}m${`██ ACTIVATE doNothingUntil = ${doNothingUntil}`}\u001b[${39}m`}`,
            );

          DEV &&
            console.log(
              `ENTITY ${`\u001b[${32}m${matchedTemp}\u001b[${39}m`} FOLLOWS`,
            );
          const whatsOnTheLeft = left(str, i);
          const rangeFrom =
            whatsOnTheLeft !== null && str[whatsOnTheLeft] === "&"
              ? whatsOnTheLeft
              : i;
          DEV && console.log(`${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
          rangesArr2.push({
            ruleName: "bad-html-entity-multiple-encoding",
            entityName: matchedTemp,
            rangeFrom,
            rangeTo: matchedEnd,
            rangeValEncoded: `&${matchedTemp};`,
            rangeValDecoded: decodeName(matchedTemp),
          });
          pingAmps(rangeFrom, i);
        }
      }
    }

    // catch #x of messed up entities without ampersand (like #x26;)
    if (
      str[i] === "#" &&
      right(str, i) &&
      str[right(str, i) as number].toLowerCase() === "x" &&
      (!str[i - 1] || str[left(str, i) as number] !== "&")
    ) {
      DEV &&
        console.log(`${`\u001b[${31}m${`██`}\u001b[${39}m`} #x pattern caught`);
      if (/^[0-9a-fA-F]$/.test(str[right(str, right(str, i)) as number])) {
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
      DEV &&
        console.log(
          `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`ampPositions`}\u001b[${39}m`} now = ${JSON.stringify(
            ampPositions,
            null,
            4,
          )}`,
        );
    }

    if (
      !str[i] &&
      typeof resolvedOpts.textAmpersandCatcherCb === "function" &&
      ampPositions.length
    ) {
      DEV &&
        console.log(
          `${`\u001b[${32}m${`PING last remaining amp indexes`}\u001b[${39}m`}`,
        );
      pingAmps();
    }

    DEV && console.log("---------------");
    DEV &&
      console.log(
        `${`\u001b[${90}m${`letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`ampPositions = ${JSON.stringify(
          ampPositions,
          null,
          4,
        )}`}\u001b[${39}m`}`,
      );
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
    DEV &&
      console.log(`${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} empty array`);
    if (resolvedOpts.progressFn) {
      resolvedOpts.progressFn(100);
    }
    return [];
  }

  DEV &&
    console.log(
      `IN THE END, before merge rangesArr2 = ${JSON.stringify(
        rangesArr2,
        null,
        4,
      )}`,
    );

  let res: any = rangesArr2;
  if (rangesArr2.length > 1) {
    // Usually the scanner already emits ascending starts, longest first.
    // Sort a separate view only when needed; callbacks retain emission order.
    let ordered = rangesArr2;
    for (let i = 1; i < rangesArr2.length; i++) {
      const previous = rangesArr2[i - 1];
      const current = rangesArr2[i];
      if (
        previous.rangeFrom > current.rangeFrom ||
        (previous.rangeFrom === current.rangeFrom &&
          previous.rangeTo < current.rangeTo)
      ) {
        ordered = rangesArr2
          .slice()
          .sort((a, b) => a.rangeFrom - b.rangeFrom || b.rangeTo - a.rangeTo);
        break;
      }
    }
    let furthestEnd = -1;
    const contained = new Set<cbObj>();
    for (const range of ordered) {
      // The established rule is strict at the end: equal ends both survive,
      // including duplicates and ranges with different starts.
      if (range.rangeTo < furthestEnd) {
        contained.add(range);
      } else {
        furthestEnd = range.rangeTo;
      }
    }
    if (contained.size) {
      res = rangesArr2.filter((range) => !contained.has(range));
    }
  }

  /* c8 ignore next */
  if (typeof resolvedOpts.cb === "function") {
    DEV && console.log(`${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} mapped`);
    res = res.map(resolvedOpts.cb);
  }

  DEV &&
    console.log(
      `RETURN ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
        res,
        null,
        4,
      )}`,
    );
  if (resolvedOpts.progressFn) {
    resolvedOpts.progressFn(100);
  }
  return res;
}

export { allRules, fixEnt, type Ranges, version };

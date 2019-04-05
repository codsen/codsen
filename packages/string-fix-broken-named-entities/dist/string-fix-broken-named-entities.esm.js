/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 2.1.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
 */

import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';
import { entStartsWith, decode, entEndsWith } from 'all-named-html-entities';
import { left, right, chompLeft, leftSeq, rightSeq } from 'string-left-right';

const isArr = Array.isArray;
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
  function isStr(something) {
    return typeof something === "string";
  }
  function isLatinLetter(char) {
    return (
      isStr(char) &&
      char.length === 1 &&
      ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
        (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
    );
  }
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
    cb: ({ rangeFrom, rangeTo, rangeValEncoded, rangeValDecoded }) => [
      rangeFrom,
      rangeTo,
      opts.decode ? rangeValDecoded : rangeValEncoded
    ],
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
        `075 new ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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
  console.log(
    `104 FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} used: ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  let state_AmpersandNotNeeded = false;
  const nbspDefault = {
    nameStartsAt: null,
    ampersandNecessary: null,
    patience: 2,
    matchedN: null,
    matchedB: null,
    matchedS: null,
    matchedP: null,
    matchedSemicol: null
  };
  let nbsp = clone(nbspDefault);
  const nbspWipe = () => {
    nbsp = clone(nbspDefault);
  };
  const rangesArr2 = [];
  let smallestCharFromTheSetAt;
  let largestCharFromTheSetAt;
  let matchedLettersCount;
  let setOfValues;
  let percentageDone;
  let lastPercentageDone;
  const len = str.length + 1;
  let counter = 0;
  let doNothingUntil = null;
  let letterSeqStartAt = null;
  outerloop: for (let i = 0; i < len; i++) {
    if (opts.progressFn) {
      percentageDone = Math.floor((counter / len) * 100);
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
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
    if (doNothingUntil) {
      if (doNothingUntil !== true && i >= doNothingUntil) {
        doNothingUntil = null;
        console.log(
          `240 RESET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = null`
        );
      } else {
        console.log(`243 continue`);
        counter++;
        continue;
      }
    }
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
      `268 ${`\u001b[${33}m${`smallestCharFromTheSetAt`}\u001b[${39}m`} = ${JSON.stringify(
        smallestCharFromTheSetAt,
        null,
        4
      )}`
    );
    console.log(
      `275 ${`\u001b[${33}m${`largestCharFromTheSetAt`}\u001b[${39}m`} = ${JSON.stringify(
        largestCharFromTheSetAt,
        null,
        4
      )}`
    );
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
        `318 ${`\u001b[${90}m${`within nbsp clauses`}\u001b[${39}m`}`
      );
      if (
        str.slice(nbsp.nameStartsAt, i) !== "&nbsp;"
      ) {
        console.log(
          `336 ${`\u001b[${90}m${`catching what's missing in nbsp`}\u001b[${39}m`}`
        );
        if (
          nbsp.nameStartsAt != null &&
          i - nbsp.nameStartsAt === 5 &&
          str.slice(nbsp.nameStartsAt, i) === "&nbsp"
        ) {
          console.log("345 ██ only semicol missing!");
          console.log(
            `347 push ${JSON.stringify({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "nbsp",
              rangeFrom: nbsp.nameStartsAt,
              rangeTo: i,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0"
            })}`
          );
          rangesArr2.push({
            ruleName: "bad-named-html-entity-missing-semicolon",
            entityName: "nbsp",
            rangeFrom: nbsp.nameStartsAt,
            rangeTo: i,
            rangeValEncoded: "&nbsp;",
            rangeValDecoded: "\xA0"
          });
        } else {
          console.log(`365 it's not just semicolon missing`);
          console.log(
            `367 ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
              nbsp.nameStartsAt,
              null,
              4
            )}`
          );
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
            `384 ${`\u001b[${33}m${`chompedAmpFromLeft`}\u001b[${39}m`} = ${JSON.stringify(
              chompedAmpFromLeft,
              null,
              4
            )}`
          );
          const beginningOfTheRange = chompedAmpFromLeft
            ? chompedAmpFromLeft
            : nbsp.nameStartsAt;
          console.log(
            `394 beginningOfTheRange = ${JSON.stringify(
              beginningOfTheRange,
              null,
              4
            )}`
          );
          if (str.slice(beginningOfTheRange, i) !== "&nbsp;") {
            console.log(
              `402 push ${JSON.stringify({
                ruleName: "bad-named-html-entity-malformed-nbsp",
                entityName: "nbsp",
                rangeFrom: beginningOfTheRange,
                rangeTo: i,
                rangeValEncoded: "&nbsp;",
                rangeValDecoded: "\xA0"
              })}`
            );
            rangesArr2.push({
              ruleName: "bad-named-html-entity-malformed-nbsp",
              entityName: "nbsp",
              rangeFrom: beginningOfTheRange,
              rangeTo: i,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0"
            });
          }
        }
      }
      nbspWipe();
      console.log(`423 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
      counter++;
      continue outerloop;
    }
    if (
      str[i] &&
      str[i - 1] === ";" &&
      !leftSeq(str, i - 1, "a", "m", "p") &&
      str[i] !== ";" &&
      matchedLettersCount > 0
    ) {
      nbspWipe();
      console.log(`437 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
      counter++;
      continue outerloop;
    }
    if (
      letterSeqStartAt !== null &&
      (!str[i] || (str[i].trim().length && !isLatinLetter(str[i])))
    ) {
      console.log(
        `460 ${`\u001b[${36}m${`██ letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`
      );
      if (i > letterSeqStartAt + 1) {
        const potentialEntity = str.slice(letterSeqStartAt, i);
        console.log(
          `465 ${`\u001b[${35}m${`██ CARVED A SEQUENCE:\n${potentialEntity}`}\u001b[${39}m`}`
        );
        const whatsOnTheLeft = left(str, letterSeqStartAt);
        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
          console.log(
            `470 ${`\u001b[${35}m${`semicol might be missing`}\u001b[${39}m`}`
          );
          const firstChar = letterSeqStartAt;
          const secondChar = right(str, letterSeqStartAt);
          console.log(
            `477 firstChar = str[${firstChar}] = ${
              str[firstChar]
            }; secondChar = str[${secondChar}] = ${str[secondChar]}`
          );
          console.log(
            `485 ██ ${secondChar !== null &&
              entStartsWith.hasOwnProperty(str[firstChar]) &&
              entStartsWith[str[firstChar]].hasOwnProperty(str[secondChar])}`
          );
          if (
            entStartsWith.hasOwnProperty(str[firstChar]) &&
            entStartsWith[str[firstChar]].hasOwnProperty(str[secondChar])
          ) {
            let tempEnt;
            let tempRes;
            const temp1 = entStartsWith[str[firstChar]][str[secondChar]].reduce(
              (gatheredSoFar, oneOfKnownEntities) => {
                const tempRes = rightSeq(
                  str,
                  letterSeqStartAt - 1,
                  ...oneOfKnownEntities.split("")
                );
                if (tempRes && oneOfKnownEntities !== "nbsp") {
                  return gatheredSoFar.concat([
                    { tempEnt: oneOfKnownEntities, tempRes }
                  ]);
                }
                return gatheredSoFar;
              },
              []
            );
            if (isArr(temp1) && temp1.length) {
              ({ tempEnt, tempRes } = temp1.reduce(
                (gatheredSoFar, oneOfFilteredEntitiesObj) => {
                  if (
                    oneOfFilteredEntitiesObj.tempEnt.length >
                    gatheredSoFar.tempEnt.length
                  ) {
                    return oneOfFilteredEntitiesObj;
                  }
                  return gatheredSoFar;
                }
              ));
            }
            if (tempEnt) {
              console.log(
                `541 ${`\u001b[${35}m${`entity ${tempEnt} is indeed on the right of index ${i}, the situation is: ${JSON.stringify(
                  tempRes,
                  null,
                  4
                )}`}\u001b[${39}m`}`
              );
              const decodedEntity = decode(`&${tempEnt};`);
              console.log(
                `551 push ${JSON.stringify(
                  {
                    ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                    entityName: tempEnt,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: tempRes.rightmostChar + 1,
                    rangeValEncoded: `&${tempEnt};`,
                    rangeValDecoded: decodedEntity
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
                rangeValDecoded: decodedEntity
              });
            }
          }
        } else if (str[whatsOnTheLeft] !== "&" && str[i] && str[i] === ";") {
          console.log(
            `577 ${`\u001b[${35}m${`ampersand might be missing`}\u001b[${39}m`}`
          );
          const lastChar = left(str, i);
          const secondToLast = lastChar ? left(str, lastChar) : null;
          let tempEnt;
          let tempRes;
          console.log(
            `591 lastChar = ${lastChar}, secondToLast = ${secondToLast}`
          );
          if (
            secondToLast !== null &&
            entEndsWith.hasOwnProperty(str[lastChar]) &&
            entEndsWith[str[lastChar]].hasOwnProperty(str[secondToLast]) &&
            entEndsWith[str[lastChar]][str[secondToLast]].some(
              oneOfKnownEntities => {
                const temp = leftSeq(str, i, ...oneOfKnownEntities.split(""));
                if (temp && oneOfKnownEntities !== "nbsp") {
                  tempEnt = oneOfKnownEntities;
                  tempRes = temp;
                  return true;
                }
              }
            )
          ) {
            console.log(
              `609 ${`\u001b[${35}m${`entity ${tempEnt} is indeed on the left of index ${i}, the situation is: ${JSON.stringify(
                tempRes,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            const decodedEntity = decode(`&${tempEnt};`);
            console.log(
              `619 push ${JSON.stringify(
                {
                  ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                  entityName: tempEnt,
                  rangeFrom: tempRes.leftmostChar,
                  rangeTo: i + 1,
                  rangeValEncoded: `&${tempEnt};`,
                  rangeValDecoded: decodedEntity
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
              rangeValDecoded: decodedEntity
            });
          }
        }
      }
      letterSeqStartAt = null;
      console.log(
        `647 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = null`
      );
    }
    if (letterSeqStartAt === null && isLatinLetter(str[i])) {
      letterSeqStartAt = i;
      console.log(
        `657 SET ${`\u001b[${33}m${`letterSeqStartAt`}\u001b[${39}m`} = ${letterSeqStartAt}`
      );
    }
    if (str[i] === "a") {
      console.log(`665 ${`\u001b[${90}m${`within a clauses`}\u001b[${39}m`}`);
      const singleAmpOnTheRight = rightSeq(str, i, "m", "p", ";");
      if (singleAmpOnTheRight) {
        console.log(
          `675 ${`\u001b[${90}m${`confirmed amp; from index ${i} onwards`}\u001b[${39}m`}`
        );
        let toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        console.log(
          `682 SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`
        );
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
            `696 ${`\u001b[${90}m${`confirmed another amp; on the right of index ${
              singleAmpOnTheRight.rightmostChar
            }`}\u001b[${39}m`}`
          );
          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          console.log(
            `703 SET ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${toDeleteAllAmpEndHere}`
          );
          let temp;
          do {
            console.log(
              `709 ${`\u001b[${36}m${`======== loop ========`}\u001b[${39}m`}`
            );
            temp = rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");
            console.log(
              `713 ${`\u001b[${36}m${`temp = ${JSON.stringify(
                temp,
                null,
                4
              )}`}\u001b[${39}m`}`
            );
            if (temp) {
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
              console.log(
                `723 ${`\u001b[${36}m${`another amp; confirmed! Now`}\u001b[${39}m`} ${`\u001b[${33}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
                  toDeleteAllAmpEndHere,
                  null,
                  4
                )};`
              );
            }
          } while (temp);
          console.log(
            `733 FINAL ${`\u001b[${32}m${`toDeleteAllAmpEndHere`}\u001b[${39}m`} = ${JSON.stringify(
              toDeleteAllAmpEndHere,
              null,
              4
            )}`
          );
        }
        const firstCharThatFollows = right(str, toDeleteAllAmpEndHere - 1);
        const secondCharThatFollows = firstCharThatFollows
          ? right(str, firstCharThatFollows)
          : null;
        console.log(
          `752 SET initial ${`\u001b[${33}m${`firstCharThatFollows`}\u001b[${39}m`} = ${firstCharThatFollows}; ${`\u001b[${33}m${`secondCharThatFollows`}\u001b[${39}m`} = ${secondCharThatFollows}`
        );
        let matchedTemp;
        let matchedVal;
        if (
          secondCharThatFollows &&
          entStartsWith.hasOwnProperty(str[firstCharThatFollows]) &&
          entStartsWith[str[firstCharThatFollows]].hasOwnProperty(
            str[secondCharThatFollows]
          ) &&
          entStartsWith[str[firstCharThatFollows]][
            str[secondCharThatFollows]
          ].some(entity => {
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
            `785 ${`\u001b[${31}m${`██ ACTIVATE doNothingUntil = ${doNothingUntil}`}\u001b[${39}m`}`
          );
          console.log(
            `789 ENTITY ${`\u001b[${32}m${matchedTemp}\u001b[${39}m`} FOLLOWS`
          );
          const whatsOnTheLeft = left(str, i);
          if (str[whatsOnTheLeft] === "&") {
            console.log(`795 ampersand on the left`);
            console.log(
              `797 ${`\u001b[${33}m${`matchedTemp`}\u001b[${39}m`} = ${JSON.stringify(
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
              `808 push ${JSON.stringify(
                {
                  ruleName: "bad-named-html-entity-multiple-encoding",
                  entityName: matchedTemp,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: doNothingUntil,
                  rangeValEncoded: `&${matchedTemp};`,
                  rangeValDecoded: decode(`&${matchedTemp};`)
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
              rangeValDecoded: decode(`&${matchedTemp};`)
            });
          } else if (whatsOnTheLeft) {
            let rangeFrom = whatsOnTheLeft + 1;
            let spaceReplacement = "";
            if (!str[rangeFrom].trim().length) {
              if (str[rangeFrom] === " ") {
                rangeFrom++;
              } else if (!`\n\r`.includes(str[rangeFrom])) {
                spaceReplacement = " ";
              } else {
                rangeFrom = i;
              }
            }
            console.log(
              `849 rangeFrom = ${rangeFrom}; firstCharThatFollows = ${firstCharThatFollows}`
            );
            if (opts.cb) {
              console.log(
                `854 push ${JSON.stringify(
                  {
                    ruleName: "bad-named-html-entity-multiple-encoding",
                    entityName: matchedTemp,
                    rangeFrom: rangeFrom,
                    rangeTo: doNothingUntil,
                    rangeValEncoded: `${spaceReplacement}&${matchedTemp};`,
                    rangeValDecoded: `${spaceReplacement}${decode(
                      `&${matchedTemp};`
                    )}`
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
                )}`
              });
            }
          }
        }
      }
    }
    if (str[i] === "&") {
      console.log(`887 ${`\u001b[${90}m${`& caught`}\u001b[${39}m`}`);
      if (
        nbsp.nameStartsAt &&
        nbsp.nameStartsAt < i &&
        (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)
      ) {
        console.log(
          `896 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} nbsp markers because ampersand follows a tag beginning`
        );
        nbspWipe();
      }
      if (nbsp.nameStartsAt === null) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = i;
          console.log(
            `911 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
              nbsp.nameStartsAt
            }`
          );
          nbsp.ampersandNecessary = false;
          console.log(
            `917 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
              nbsp.ampersandNecessary
            }`
          );
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      if (str[i - 1] === "i" && str[i + 1] === "s") {
        console.log("929 pattern ...ins... detected - bail");
        nbspWipe();
        counter++;
        continue outerloop;
      }
      console.log("936 n caught");
      if (nbsp.matchedN === null) {
        nbsp.matchedN = i;
        console.log(
          `940 SET ${`\u001b[${33}m${`nbsp.matchedN`}\u001b[${39}m`} = ${
            nbsp.matchedN
          }`
        );
      }
      if (nbsp.nameStartsAt === null) {
        nbsp.nameStartsAt = i;
        console.log(
          `949 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
        console.log(
          `962 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
            nbsp.ampersandNecessary
          }`
        );
      }
    }
    if (str[i] && str[i].toLowerCase() === "b") {
      console.log("971 b caught");
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedB === null) {
          nbsp.matchedB = i;
          console.log(
            `977 SET ${`\u001b[${33}m${`nbsp.matchedB`}\u001b[${39}m`} = ${
              nbsp.matchedB
            }`
          );
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        console.log(
          `989 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );
        nbsp.nameStartsAt = i;
        console.log(
          `997 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedB = i;
        console.log(
          `1003 SET ${`\u001b[${33}m${`nbsp.matchedB`}\u001b[${39}m`} = true`
        );
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log(
            `1011 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
          console.log(
            `1017 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        nbspWipe();
        console.log(`1023 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        counter++;
        continue outerloop;
      }
    }
    if (str[i] && str[i].toLowerCase() === "s") {
      console.log("1031 s caught");
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedS === null) {
          nbsp.matchedS = i;
          console.log(
            `1037 SET ${`\u001b[${33}m${`nbsp.matchedS`}\u001b[${39}m`} = ${
              nbsp.matchedS
            }`
          );
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        console.log(
          `1049 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );
        nbsp.nameStartsAt = i;
        console.log(
          `1057 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedS = i;
        console.log(
          `1063 SET ${`\u001b[${33}m${`nbsp.matchedS`}\u001b[${39}m`} = true`
        );
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log(
            `1071 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
          console.log(
            `1077 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        nbspWipe();
        console.log(`1083 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        counter++;
        continue outerloop;
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      console.log("1091 p caught");
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedP === null) {
          nbsp.matchedP = i;
          console.log(
            `1097 SET ${`\u001b[${33}m${`nbsp.matchedP`}\u001b[${39}m`} = ${
              nbsp.matchedP
            }`
          );
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        console.log(
          `1109 MINUSMINUS ${`\u001b[${33}m${`nbsp.patience`}\u001b[${39}m`}, then it's ${
            nbsp.patience
          }`
        );
        nbsp.nameStartsAt = i;
        console.log(
          `1117 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        nbsp.matchedP = i;
        console.log(
          `1123 SET ${`\u001b[${33}m${`nbsp.matchedP`}\u001b[${39}m`} = true`
        );
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log(
            `1131 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = true`
          );
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
          console.log(
            `1137 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = false`
          );
        }
      } else {
        nbspWipe();
        console.log(`1143 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        counter++;
        continue outerloop;
      }
    }
    if (str[i] === ";") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedSemicol = i;
        console.log(
          `1154 SET ${`\u001b[${33}m${`nbsp.matchedSemicol`}\u001b[${39}m`} = ${
            nbsp.matchedSemicol
          }`
        );
        if (
          (nbsp.matchedN &&
            !nbsp.matchedB &&
            !nbsp.matchedS &&
            !nbsp.matchedP) ||
          (!nbsp.matchedN &&
          nbsp.matchedB &&
            !nbsp.matchedS &&
            !nbsp.matchedP) ||
          (!nbsp.matchedN &&
          !nbsp.matchedB &&
          nbsp.matchedS &&
            !nbsp.matchedP) ||
          (!nbsp.matchedN && !nbsp.matchedB && !nbsp.matchedS && nbsp.matchedP)
        ) {
          nbspWipe();
          console.log(`1177 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        }
      }
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
      console.log(
        `1205 SET ${`\u001b[${33}m${`state_AmpersandNotNeeded`}\u001b[${39}m`} = ${JSON.stringify(
          state_AmpersandNotNeeded,
          null,
          4
        )}`
      );
      if (
        nbsp.nameStartsAt &&
        (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)
      ) {
        nbsp.ampersandNecessary = false;
      }
    }
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
        console.log(`1242 nbsp.patience--, now equal to: ${nbsp.patience}`);
      } else {
        nbspWipe();
        console.log(`1245 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}`);
        counter++;
        continue outerloop;
      }
    }
    console.log("---------------");
    console.log(
      `1264 ${`\u001b[${90}m${`letterSeqStartAt = ${letterSeqStartAt}`}\u001b[${39}m`}`
    );
    counter++;
  }
  if (!rangesArr2.length) {
    console.log(`1302 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} null`);
    return null;
  }
  console.log(
    `1307 IN THE END, before merge rangesArr2 = ${JSON.stringify(
      rangesArr2,
      null,
      4
    )}`
  );
  const res = rangesArr2
    .filter((filteredRangeObj, i) => {
      return rangesArr2.every((oneOfEveryObj, y) => {
        return (
          i === y ||
          filteredRangeObj.rangeFrom !== oneOfEveryObj.rangeFrom ||
          filteredRangeObj.rangeTo > oneOfEveryObj.rangeTo
        );
      });
    })
    .map(opts.cb);
  console.log(
    `1341 RETURN ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export default stringFixBrokenNamedEntities;

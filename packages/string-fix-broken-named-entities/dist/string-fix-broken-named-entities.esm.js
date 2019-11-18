/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 2.4.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
 */

import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';
import { entStartsWith, uncertain, decode, entEndsWith, brokenNamedEntities, entStartsWithCaseInsensitive, allNamedEntities, maxLength } from 'all-named-html-entities';
import { left, right, rightSeq, chompLeft, leftSeq } from 'string-left-right';

const isArr = Array.isArray;
function stringFixBrokenNamedEntities(str, originalOpts) {
  function resemblesNumericEntity(str, from, to) {
    let lettersCount = 0;
    let numbersCount = 0;
    let othersCount = 0;
    let hashesCount = 0;
    let whitespaceCount = 0;
    let numbersValue = "";
    let charTrimmed = "";
    for (let i = from; i < to; i++) {
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
    let probablyNumeric = false;
    if (!lettersCount && numbersCount > othersCount) {
      probablyNumeric = "deci";
    } else if (
      (numbersCount || lettersCount) &&
      ((charTrimmed[0] === "#" &&
        charTrimmed[1].toLowerCase() === "x" &&
        (isNumber(charTrimmed[2]) || isLatinLetter(charTrimmed[2]))) ||
        (charTrimmed[0].toLowerCase() === "x" && numbersCount && !othersCount))
    ) {
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
  function onlyContainsNbsp(str, from, to) {
    for (let i = from; i < to; i++) {
      if (str[i].trim().length && !`nbsp`.includes(str[i].toLowerCase())) {
        return false;
      }
    }
    return true;
  }
  function findLongest(temp1) {
    if (isArr(temp1) && temp1.length) {
      if (temp1.length === 1) {
        return temp1[0];
      }
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
    let copy;
    if (isArr(temp1) && temp1.length) {
      copy = Array.from(temp1);
      if (
        copy.length > 1 &&
        copy.some(
          entityObj => str[right(str, entityObj.tempRes.rightmostChar)] === ";"
        ) &&
        copy.some(
          entityObj => str[right(str, entityObj.tempRes.rightmostChar)] !== ";"
        )
      ) {
        copy = copy.filter(
          entityObj => str[right(str, entityObj.tempRes.rightmostChar)] === ";"
        );
      }
      if (
        !(
          copy.every(
            entObj =>
              !entObj ||
              !entObj.tempRes ||
              !entObj.tempRes.gaps ||
              !isArr(entObj.tempRes.gaps) ||
              !entObj.tempRes.gaps.length
          ) ||
          copy.every(
            entObj =>
              entObj &&
              entObj.tempRes &&
              entObj.tempRes.gaps &&
              isArr(entObj.tempRes.gaps) &&
              entObj.tempRes.gaps.length
          )
        )
      ) {
        return findLongest(
          copy.filter(
            entObj =>
              !entObj.tempRes.gaps ||
              !isArr(entObj.tempRes.gaps) ||
              !entObj.tempRes.gaps.length
          )
        );
      }
    }
    return findLongest(temp1);
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
    cb: ({ rangeFrom, rangeTo, rangeValEncoded, rangeValDecoded }) =>
      rangeValDecoded || rangeValEncoded
        ? [rangeFrom, rangeTo, opts.decode ? rangeValDecoded : rangeValEncoded]
        : [rangeFrom, rangeTo],
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
  let state_AmpersandNotNeeded = false;
  const nbspDefault = {
    nameStartsAt: null,
    ampersandNecessary: null,
    patience: 1,
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
  let brokenNumericEntityStartAt = null;
  const falsePositivesArr = ["&nspar;", "&prnsim;", "&subplus;"];
  outerloop: for (let i = 0; i < len; i++) {
    if (opts.progressFn) {
      percentageDone = Math.floor((counter / len) * 100);
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    if (doNothingUntil) {
      if (doNothingUntil !== true && i >= doNothingUntil) {
        doNothingUntil = null;
      } else {
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
      const chompedAmpFromLeft = chompLeft(
        str,
        nbsp.nameStartsAt,
        "&?",
        "a",
        "m",
        "p",
        ";?"
      );
      const beginningOfTheRange = chompedAmpFromLeft
        ? chompedAmpFromLeft
        : nbsp.nameStartsAt;
      if (opts.entityCatcherCb) {
        opts.entityCatcherCb(beginningOfTheRange, i);
      }
      if (
        !falsePositivesArr.some(val =>
          str.slice(beginningOfTheRange).startsWith(val)
        ) &&
        str.slice(beginningOfTheRange, i) !== "&nbsp;"
      ) {
        rangesArr2.push({
          ruleName: "bad-named-html-entity-malformed-nbsp",
          entityName: "nbsp",
          rangeFrom: beginningOfTheRange,
          rangeTo: i,
          rangeValEncoded: "&nbsp;",
          rangeValDecoded: "\xA0"
        });
      } else if (opts.decode) {
        rangesArr2.push({
          ruleName: "encoded-html-entity-nbsp",
          entityName: "nbsp",
          rangeFrom: beginningOfTheRange,
          rangeTo: i,
          rangeValEncoded: "&nbsp;",
          rangeValDecoded: "\xA0"
        });
      }
      nbspWipe();
      counter++;
      if (str[i] === "&" && str[i + 1] !== "&") {
        nbsp.nameStartsAt = i;
        nbsp.ampersandNecessary = false;
      }
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
      counter++;
      continue outerloop;
    }
    if (
      letterSeqStartAt !== null &&
      (!str[i] ||
        (str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i])))
    ) {
      if (
        i > letterSeqStartAt + 1 &&
        str.slice(letterSeqStartAt - 1, i + 1) !== "&nbsp;"
      ) {
        const potentialEntity = str.slice(letterSeqStartAt, i);
        const whatsOnTheLeft = left(str, letterSeqStartAt);
        const whatsEvenMoreToTheLeft = whatsOnTheLeft
          ? left(str, whatsOnTheLeft)
          : "";
        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
          const firstChar = letterSeqStartAt;
          const secondChar = letterSeqStartAt
            ? right(str, letterSeqStartAt)
            : null;
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
            let tempEnt;
            let tempRes;
            let temp1 = entStartsWith[str[firstChar]][str[secondChar]].reduce(
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
            temp1 = removeGappedFromMixedCases(temp1);
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
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
              const decodedEntity = decode(`&${tempEnt};`);
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
        } else if (
          str[whatsOnTheLeft] !== "&" &&
          str[whatsEvenMoreToTheLeft] !== "&" &&
          str[i] === ";"
        ) {
          const lastChar = left(str, i);
          const secondToLast = lastChar ? left(str, lastChar) : null;
          if (
            secondToLast !== null &&
            Object.prototype.hasOwnProperty.call(entEndsWith, str[lastChar]) &&
            Object.prototype.hasOwnProperty.call(
              entEndsWith[str[lastChar]],
              str[secondToLast]
            )
          ) {
            let tempEnt;
            let tempRes;
            let temp1 = entEndsWith[str[lastChar]][str[secondToLast]].reduce(
              (gatheredSoFar, oneOfKnownEntities) => {
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
                    { tempEnt: oneOfKnownEntities, tempRes }
                  ]);
                }
                return gatheredSoFar;
              },
              []
            );
            temp1 = removeGappedFromMixedCases(temp1);
            if (temp1) {
              ({ tempEnt, tempRes } = temp1);
            }
            if (
              tempEnt &&
              (!Object.keys(uncertain).includes(tempEnt) ||
                uncertain[tempEnt].addAmpIfSemiPresent === true ||
                (uncertain[tempEnt].addAmpIfSemiPresent &&
                  (!tempRes.leftmostChar ||
                    (isStr(str[tempRes.leftmostChar - 1]) &&
                      !str[tempRes.leftmostChar - 1].trim().length))))
            ) {
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
            rangesArr2.push({
              ruleName: "bad-malformed-numeric-character-entity",
              entityName: null,
              rangeFrom: brokenNumericEntityStartAt,
              rangeTo: i + 1,
              rangeValEncoded: null,
              rangeValDecoded: null
            });
            brokenNumericEntityStartAt = null;
          }
        } else if (str[whatsOnTheLeft] === "&" && str[i] === ";") {
          if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) {
            const situation = resemblesNumericEntity(
              str,
              whatsOnTheLeft + 1,
              i
            );
            if (situation.probablyNumeric) {
              if (
                situation.probablyNumeric &&
                situation.charTrimmed[0] === "#" &&
                !situation.whitespaceCount &&
                ((!situation.lettersCount &&
                  situation.numbersCount > 0 &&
                  !situation.othersCount) ||
                  ((situation.numbersCount || situation.lettersCount) &&
                    situation.charTrimmed[1] === "x" &&
                    !situation.othersCount))
              ) {
                const decodedEntitysValue = String.fromCharCode(
                  parseInt(
                    situation.charTrimmed.slice(
                      situation.probablyNumeric === "deci" ? 1 : 2
                    ),
                    situation.probablyNumeric === "deci" ? 10 : 16
                  )
                );
                if (
                  situation.probablyNumeric === "deci" &&
                  parseInt(situation.numbersValue, 10) > 918015
                ) {
                  rangesArr2.push({
                    ruleName: `bad-malformed-numeric-character-entity`,
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                } else if (opts.decode) {
                  rangesArr2.push({
                    ruleName: `encoded-numeric-html-entity-reference`,
                    entityName: situation.charTrimmed,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${situation.charTrimmed};`,
                    rangeValDecoded: decodedEntitysValue
                  });
                }
              } else {
                rangesArr2.push({
                  ruleName: `bad-malformed-numeric-character-entity`,
                  entityName: null,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null
                });
              }
              if (opts.entityCatcherCb) {
                opts.entityCatcherCb(whatsOnTheLeft, i + 1);
              }
            } else {
              const firstChar = letterSeqStartAt;
              const secondChar = letterSeqStartAt
                ? right(str, letterSeqStartAt)
                : null;
              let tempEnt;
              if (
                Object.prototype.hasOwnProperty.call(
                  brokenNamedEntities,
                  situation.charTrimmed.toLowerCase()
                )
              ) {
                tempEnt = situation.charTrimmed;
                const decodedEntity = decode(
                  `&${
                    brokenNamedEntities[situation.charTrimmed.toLowerCase()]
                  };`
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
                  rangeValDecoded: decodedEntity
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
                let tempRes;
                let matchedEntity = entStartsWithCaseInsensitive[
                  str[firstChar].toLowerCase()
                ][str[secondChar].toLowerCase()].reduce(
                  (gatheredSoFar, oneOfKnownEntities) => {
                    const tempRes = rightSeq(
                      str,
                      letterSeqStartAt - 1,
                      {
                        i: true
                      },
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
                matchedEntity = removeGappedFromMixedCases(matchedEntity);
                if (matchedEntity) {
                  ({ tempEnt, tempRes } = matchedEntity);
                }
                let entitysValue;
                if (tempEnt) {
                  let issue = false;
                  const firstChar = tempRes.leftmostChar;
                  const secondChar = right(str, firstChar);
                  if (
                    Object.keys(uncertain).includes(potentialEntity) &&
                    isStr(str[firstChar - 1]) &&
                    !str[firstChar - 1].trim().length &&
                    uncertain[potentialEntity].addAmpIfSemiPresent !== true
                  ) {
                    letterSeqStartAt = null;
                    continue;
                  }
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
                    if (i - whatsOnTheLeft - 1 === tempEnt.length) {
                      if (opts.decode) {
                        issue = "encoded-html-entity";
                      }
                    } else {
                      issue = "bad-named-html-entity-malformed";
                    }
                  } else {
                    issue = "bad-named-html-entity-malformed";
                    const matchingEntities = Object.keys(
                      allNamedEntities
                    ).filter(entity =>
                      situation.charTrimmed
                        .toLowerCase()
                        .startsWith(entity.toLowerCase())
                    );
                    if (matchingEntities.length === 1) {
                      entitysValue = matchingEntities[0];
                    } else {
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
                      if (filterLongest.length === 1) {
                        entitysValue = filterLongest[0];
                      } else {
                        const missingLetters = filterLongest.map(entity => {
                          let count = 0;
                          for (let z = 0, len = entity.length; z < len; z++) {
                            if (entity[z] !== situation.charTrimmed[z]) {
                              count++;
                            }
                          }
                          return count;
                        });
                        if (
                          missingLetters.filter(
                            val => val === Math.min(...missingLetters)
                          ).length > 1
                        ) {
                          rangesArr2.push({
                            ruleName: `bad-named-html-entity-unrecognised`,
                            entityName: null,
                            rangeFrom: whatsOnTheLeft,
                            rangeTo:
                              tempRes.rightmostChar + 1 === i
                                ? i + 1
                                : tempRes.rightmostChar + 1,
                            rangeValEncoded: null,
                            rangeValDecoded: null
                          });
                          issue = false;
                        }
                        entitysValue =
                          filterLongest[
                            missingLetters.indexOf(Math.min(...missingLetters))
                          ];
                      }
                    }
                  }
                  let endingIdx =
                    tempRes.rightmostChar + 1 === i
                      ? i + 1
                      : tempRes.rightmostChar + 1;
                  if (issue) {
                    const decodedEntity = decode(`&${entitysValue};`);
                    if (
                      str[endingIdx] &&
                      str[endingIdx] !== ";" &&
                      !str[endingIdx].trim().length &&
                      str[right(str, endingIdx)] === ";"
                    ) {
                      endingIdx = right(str, endingIdx) + 1;
                    }
                    rangesArr2.push({
                      ruleName: `${issue}-${entitysValue}`,
                      entityName: entitysValue,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: endingIdx,
                      rangeValEncoded: `&${entitysValue};`,
                      rangeValDecoded: decodedEntity
                    });
                  }
                  if (opts.entityCatcherCb) {
                    opts.entityCatcherCb(whatsOnTheLeft, endingIdx);
                  }
                }
              }
              if (!tempEnt) {
                if (situation.charTrimmed.toLowerCase() !== "&nbsp;") {
                  rangesArr2.push({
                    ruleName: `bad-named-html-entity-unrecognised`,
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                  if (opts.entityCatcherCb) {
                    opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                  }
                }
              }
            }
          }
        } else if (
          str[whatsEvenMoreToTheLeft] === "&" &&
          str[i] === ";" &&
          i - whatsEvenMoreToTheLeft < maxLength
        ) {
          const situation = resemblesNumericEntity(
            str,
            whatsEvenMoreToTheLeft + 1,
            i
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
            rangeValDecoded: null
          });
        }
      }
      letterSeqStartAt = null;
    }
    if (
      letterSeqStartAt === null &&
      isLatinLetterOrNumberOrHash(str[i]) &&
      str[i + 1]
    ) {
      letterSeqStartAt = i;
    }
    if (str[i] === "a") {
      const singleAmpOnTheRight = rightSeq(str, i, "m", "p", ";");
      if (singleAmpOnTheRight) {
        let toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        const nextAmpOnTheRight = rightSeq(
          str,
          singleAmpOnTheRight.rightmostChar,
          "a",
          "m",
          "p",
          ";"
        );
        if (nextAmpOnTheRight) {
          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          let temp;
          do {
            temp = rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");
            if (temp) {
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
            }
          } while (temp);
        }
        const firstCharThatFollows = right(str, toDeleteAllAmpEndHere - 1);
        const secondCharThatFollows = firstCharThatFollows
          ? right(str, firstCharThatFollows)
          : null;
        let matchedTemp;
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
          ].some(entity => {
            const matchEntityOnTheRight = rightSeq(
              str,
              toDeleteAllAmpEndHere - 1,
              ...entity.slice("")
            );
            if (matchEntityOnTheRight) {
              matchedTemp = entity;
              return true;
            }
          })
        ) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1;
          const whatsOnTheLeft = left(str, i);
          if (str[whatsOnTheLeft] === "&") {
            rangesArr2.push({
              ruleName: "bad-named-html-entity-multiple-encoding",
              entityName: matchedTemp,
              rangeFrom: whatsOnTheLeft,
              rangeTo: doNothingUntil,
              rangeValEncoded: `&${matchedTemp};`,
              rangeValDecoded: decode(`&${matchedTemp};`)
            });
          } else if (whatsOnTheLeft) {
            const rangeFrom = i;
            const spaceReplacement = "";
            if (str[i - 1] === " ") ;
            if (opts.cb) {
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
      if (
        nbsp.nameStartsAt &&
        nbsp.nameStartsAt < i &&
        (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)
      ) {
        nbspWipe();
      }
      nbsp.nameStartsAt = i;
      nbsp.ampersandNecessary = false;
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      if (
        str[i - 1] &&
        str[i - 1].toLowerCase() === "i" &&
        str[i + 1] &&
        str[i + 1].toLowerCase() === "s"
      ) {
        nbspWipe();
        counter++;
        continue outerloop;
      }
      if (nbsp.matchedN === null) {
        nbsp.matchedN = i;
      }
      if (nbsp.nameStartsAt === null) {
        nbsp.nameStartsAt = i;
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "b") {
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedB === null) {
          nbsp.matchedB = i;
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        nbsp.nameStartsAt = i;
        nbsp.matchedB = i;
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
      } else {
        nbspWipe();
        counter++;
        continue outerloop;
      }
    }
    if (str[i] && str[i].toLowerCase() === "s") {
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedS === null) {
          nbsp.matchedS = i;
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        nbsp.nameStartsAt = i;
        nbsp.matchedS = i;
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
      } else {
        nbspWipe();
        counter++;
        continue outerloop;
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      if (leftSeq(str, i, "t", "h", "i", "n", "s")) {
        nbspWipe();
      } else if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedP === null) {
          nbsp.matchedP = i;
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        nbsp.nameStartsAt = i;
        nbsp.matchedP = i;
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
      } else {
        nbspWipe();
        counter++;
        continue outerloop;
      }
    }
    if (str[i] === ";") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedSemicol = i;
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
        }
      }
    }
    if (
      str[i] === "#" &&
      right(str, i) &&
      str[right(str, i)].toLowerCase() === "x" &&
      (!str[i - 1] || !left(str, i) || str[left(str, i)] !== "&")
    ) {
      if (isNumber(str[right(str, right(str, i))])) {
        brokenNumericEntityStartAt = i;
      }
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
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
      } else {
        nbspWipe();
        counter++;
        continue outerloop;
      }
    }
    counter++;
  }
  if (!rangesArr2.length) {
    return [];
  }
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
            i !== y &&
            oneRangeObj.rangeFrom <= filteredRangeObj.rangeFrom &&
            oneRangeObj.rangeTo === filteredRangeObj.rangeTo
          );
        })
      ) {
        return false;
      }
      return true;
    })
    .map(opts.cb);
  return res;
}

export default stringFixBrokenNamedEntities;

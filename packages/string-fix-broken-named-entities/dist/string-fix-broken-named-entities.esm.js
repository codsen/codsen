/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 3.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
 */

import leven from 'leven';
import { entStartsWith, decode, uncertain, entEndsWith, maxLength, allNamedEntitiesSetOnlyCaseInsensitive, allNamedEntitiesSetOnly, brokenNamedEntities } from 'all-named-html-entities';
import { right, rightSeq, left, leftSeq } from 'string-left-right';

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
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
function resemblesNumericEntity(str2, from, to) {
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
    } else if (isNumber(str2[i])) {
      numbersCount += 1;
      numbersValue += String(str2[i]);
    } else if (str2[i] === "#") {
      hashesCount += 1;
    } else {
      othersCount += 1;
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
    whitespaceCount,
  };
}
function findLongest(temp1) {
  if (Array.isArray(temp1) && temp1.length) {
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
function removeGappedFromMixedCases(str, temp1) {
  /* istanbul ignore if */
  if (arguments.length !== 2) {
    throw new Error("removeGappedFromMixedCases(): wrong amount of inputs!");
  }
  let copy;
  if (Array.isArray(temp1) && temp1.length) {
    copy = Array.from(temp1);
    /* istanbul ignore if */
    if (
      copy.length > 1 &&
      copy.some(
        (entityObj) => str[right(str, entityObj.tempRes.rightmostChar)] === ";"
      ) &&
      copy.some(
        (entityObj) => str[right(str, entityObj.tempRes.rightmostChar)] !== ";"
      )
    ) {
      copy = copy.filter(
        (entityObj) => str[right(str, entityObj.tempRes.rightmostChar)] === ";"
      );
    }
    if (
      !(
        copy.every(
          (entObj) =>
            !entObj ||
            !entObj.tempRes ||
            !entObj.tempRes.gaps ||
            !Array.isArray(entObj.tempRes.gaps) ||
            !entObj.tempRes.gaps.length
        ) ||
        copy.every(
          (entObj) =>
            entObj &&
            entObj.tempRes &&
            entObj.tempRes.gaps &&
            Array.isArray(entObj.tempRes.gaps) &&
            entObj.tempRes.gaps.length
        )
      )
    ) {
      return findLongest(
        copy.filter(
          (entObj) =>
            !entObj.tempRes.gaps ||
            !Array.isArray(entObj.tempRes.gaps) ||
            !entObj.tempRes.gaps.length
        )
      );
    }
  }
  return findLongest(temp1);
}

function stringFixBrokenNamedEntities(str, originalOpts) {
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
  const rangesArr2 = [];
  let percentageDone;
  let lastPercentageDone;
  const len = str.length + 1;
  let counter = 0;
  let doNothingUntil = null;
  let letterSeqStartAt = null;
  let brokenNumericEntityStartAt = null;
  for (let i = 0; i < len; i++) {
    if (opts.progressFn) {
      percentageDone = Math.floor((counter / len) * 100);
      /* istanbul ignore else */
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    if (doNothingUntil) {
      if (doNothingUntil !== true && i >= doNothingUntil) {
        doNothingUntil = null;
      } else {
        counter += 1;
        continue;
      }
    }
    if (letterSeqStartAt !== null && i - letterSeqStartAt > 50) {
      letterSeqStartAt = null;
    }
    if (
      letterSeqStartAt !== null &&
      (!str[i] ||
        (str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i])))
    ) {
      if (i > letterSeqStartAt + 1) {
        const potentialEntity = str.slice(letterSeqStartAt, i);
        const whatsOnTheLeft = left(str, letterSeqStartAt);
        const whatsEvenMoreToTheLeft = whatsOnTheLeft
          ? left(str, whatsOnTheLeft)
          : "";
        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
          const firstChar = letterSeqStartAt;
          /* istanbul ignore next */
          const secondChar = letterSeqStartAt
            ? right(str, letterSeqStartAt)
            : null;
          /* istanbul ignore else */
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
            temp1 = removeGappedFromMixedCases(str, temp1);
            /* istanbul ignore else */
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
                rangeValDecoded: decodedEntity,
              });
            }
          }
        } else if (
          str[whatsOnTheLeft] !== "&" &&
          str[whatsEvenMoreToTheLeft] !== "&" &&
          str[i] === ";"
        ) {
          const lastChar = left(str, i);
          const secondToLast = left(str, lastChar);
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
            temp1 = removeGappedFromMixedCases(str, temp1);
            /* istanbul ignore else */
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
                rangeValDecoded: decodedEntity,
              });
            }
          } else if (brokenNumericEntityStartAt !== null) {
            rangesArr2.push({
              ruleName: "bad-malformed-numeric-character-entity",
              entityName: null,
              rangeFrom: brokenNumericEntityStartAt,
              rangeTo: i + 1,
              rangeValEncoded: null,
              rangeValDecoded: null,
            });
            brokenNumericEntityStartAt = null;
          }
        } else if (
          (str[whatsOnTheLeft] === "&" ||
            (str[whatsOnTheLeft] === ";" &&
              str[whatsEvenMoreToTheLeft] === "&")) &&
          str[i] === ";"
        ) {
          /* istanbul ignore else */
          if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) {
            const situation = resemblesNumericEntity(
              str,
              whatsOnTheLeft + 1,
              i
            );
            if (situation.probablyNumeric) {
              if (
                /* istanbul ignore next */
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
                    rangeValDecoded: null,
                  });
                } else if (opts.decode) {
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
                rangesArr2.push({
                  ruleName: `bad-malformed-numeric-character-entity`,
                  entityName: null,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null,
                });
              }
              if (opts.entityCatcherCb) {
                opts.entityCatcherCb(whatsOnTheLeft, i + 1);
              }
            } else {
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
                if (
                  !allNamedEntitiesSetOnly.has(
                    potentialEntityOnlyNonWhitespaceChars
                  )
                ) {
                  const matchingEntitiesOfCorrectCaseArr = [
                    ...allNamedEntitiesSetOnly,
                  ].filter(
                    (ent) =>
                      ent.toLowerCase() ===
                      potentialEntityOnlyNonWhitespaceChars.toLowerCase()
                  );
                  if (matchingEntitiesOfCorrectCaseArr.length === 1) {
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
                  i - whatsOnTheLeft - 1 !==
                    potentialEntityOnlyNonWhitespaceChars.length ||
                  str[whatsOnTheLeft] !== "&"
                ) {
                  const rangeFrom =
                    str[whatsOnTheLeft] === "&"
                      ? whatsOnTheLeft
                      : whatsEvenMoreToTheLeft;
                  if (
                    Object.keys(uncertain).includes(
                      potentialEntityOnlyNonWhitespaceChars
                    ) &&
                    !str[rangeFrom + 1].trim().length
                  ) {
                    letterSeqStartAt = null;
                    continue;
                  }
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
                  opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                }
                letterSeqStartAt = null;
                continue;
              }
              /* istanbul ignore next */
              const secondChar = letterSeqStartAt
                ? right(str, letterSeqStartAt)
                : null;
              let tempEnt;
              let temp;
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
                  rangeValDecoded: decodedEntity,
                });
              } else if (
                potentialEntity.length < maxLength + 2 &&
                (((temp = [...allNamedEntitiesSetOnly].filter(
                  (curr) => leven(curr, potentialEntity) === 1
                )) &&
                  temp.length) ||
                  ((temp = [...allNamedEntitiesSetOnly].filter(
                    (curr) =>
                      /* istanbul ignore next */
                      leven(curr, potentialEntity) === 2 &&
                      potentialEntity.length > 3
                  )) &&
                    temp.length))
              ) {
                if (temp.length === 1) {
                  [tempEnt] = temp;
                  rangesArr2.push({
                    ruleName: `bad-named-html-entity-malformed-${tempEnt}`,
                    entityName: tempEnt,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: `&${tempEnt};`,
                    rangeValDecoded: decode(`&${tempEnt};`),
                  });
                }
              }
              if (!tempEnt) {
                rangesArr2.push({
                  ruleName: `bad-named-html-entity-unrecognised`,
                  entityName: null,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null,
                });
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
              /* istanbul ignore next */
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
          ].some((entity) => {
            const matchEntityOnTheRight = rightSeq(
              str,
              toDeleteAllAmpEndHere - 1,
              ...entity.slice("")
            );
            /* istanbul ignore else */
            if (matchEntityOnTheRight) {
              matchedTemp = entity;
              return true;
            }
          })
        ) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1;
          const whatsOnTheLeft = left(str, i);
          /* istanbul ignore else */
          if (str[whatsOnTheLeft] === "&") {
            rangesArr2.push({
              ruleName: "bad-named-html-entity-multiple-encoding",
              entityName: matchedTemp,
              rangeFrom: whatsOnTheLeft,
              rangeTo: doNothingUntil,
              rangeValEncoded: `&${matchedTemp};`,
              rangeValDecoded: decode(`&${matchedTemp};`),
            });
          } else if (whatsOnTheLeft) {
            const rangeFrom = i;
            const spaceReplacement = "";
            if (str[i - 1] === " ") ;
            if (opts.cb) {
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
    counter += 1;
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
    .map(opts.cb);
  return res;
}

export default stringFixBrokenNamedEntities;

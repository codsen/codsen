/**
 * @name string-fix-broken-named-entities
 * @fileoverview Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * @version 5.3.1
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-fix-broken-named-entities/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var leven = require('leven');
var allNamedHtmlEntities = require('all-named-html-entities');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);
var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var leven__default = /*#__PURE__*/_interopDefaultLegacy(leven);

function isObj(something) {
  return something && _typeof__default['default'](something) === "object" && !Array.isArray(something);
}
function isLatinLetterOrNumberOrHash(_char) {
  return isStr(_char) && _char.length === 1 && (_char.charCodeAt(0) > 96 && _char.charCodeAt(0) < 123 || _char.charCodeAt(0) > 47 && _char.charCodeAt(0) < 58 || _char.charCodeAt(0) > 64 && _char.charCodeAt(0) < 91 || _char.charCodeAt(0) === 35);
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
  var lettersCount = 0;
  var numbersCount = 0;
  var othersCount = 0;
  var hashesCount = 0;
  var whitespaceCount = 0;
  var numbersValue = "";
  var charTrimmed = "";
  for (var i = from; i < to; i++) {
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
  }
  var probablyNumeric = false;
  if (!lettersCount && numbersCount > othersCount) {
    probablyNumeric = "deci";
  } else if ((numbersCount || lettersCount) && (charTrimmed[0] === "#" && charTrimmed[1].toLowerCase() === "x" && (isNumeric(charTrimmed[2]) || isLatinLetter(charTrimmed[2])) || charTrimmed[0].toLowerCase() === "x" && numbersCount && !othersCount)) {
    probablyNumeric = "hexi";
  }
  return {
    probablyNumeric: probablyNumeric,
    lettersCount: lettersCount,
    numbersCount: numbersCount,
    numbersValue: numbersValue,
    hashesCount: hashesCount,
    othersCount: othersCount,
    charTrimmed: charTrimmed,
    whitespaceCount: whitespaceCount
  };
}
function findLongest(temp1) {
  if (Array.isArray(temp1) && temp1.length) {
    if (temp1.length === 1) {
      return temp1[0];
    }
    return temp1.reduce(function (accum, tempObj) {
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
  var copy;
  if (Array.isArray(temp1) && temp1.length) {
    copy = Array.from(temp1);
    /* istanbul ignore if */
    if (copy.length > 1 && copy.some(function (entityObj) {
      return str[stringLeftRight.right(str, entityObj.tempRes.rightmostChar)] === ";";
    }) && copy.some(function (entityObj) {
      return str[stringLeftRight.right(str, entityObj.tempRes.rightmostChar)] !== ";";
    })) {
      copy = copy.filter(function (entityObj) {
        return str[stringLeftRight.right(str, entityObj.tempRes.rightmostChar)] === ";";
      });
    }
    if (!(copy.every(function (entObj) {
      return !entObj || !entObj.tempRes || !entObj.tempRes.gaps || !Array.isArray(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
    }) || copy.every(function (entObj) {
      return entObj && entObj.tempRes && entObj.tempRes.gaps && Array.isArray(entObj.tempRes.gaps) && entObj.tempRes.gaps.length;
    }))) {
      return findLongest(copy.filter(function (entObj) {
        return !entObj.tempRes.gaps || !Array.isArray(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
      }));
    }
  }
  return findLongest(temp1);
}

var version$1 = "5.3.1";

var version = version$1;
var allRules = _toConsumableArray__default['default'](allNamedHtmlEntities.allNamedEntitiesSetOnly).map(function (ruleName) {
  return "bad-html-entity-malformed-".concat(ruleName);
}).concat(_toConsumableArray__default['default'](allNamedHtmlEntities.allNamedEntitiesSetOnly).map(function (ruleName) {
  return "bad-html-entity-encoded-".concat(ruleName);
})).concat(["bad-html-entity-unrecognised", "bad-html-entity-multiple-encoding", "bad-html-entity-encoded-numeric", "bad-html-entity-malformed-numeric", "bad-html-entity-other"]);
function fixEnt(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error("string-fix-broken-named-entities: [THROW_ID_01] the first input argument must be string! It was given as:\n".concat(JSON.stringify(str, null, 4), " (").concat(_typeof__default['default'](str), "-type)"));
  }
  var defaults = {
    decode: false,
    cb: function cb(_ref) {
      var rangeFrom = _ref.rangeFrom,
          rangeTo = _ref.rangeTo,
          rangeValEncoded = _ref.rangeValEncoded,
          rangeValDecoded = _ref.rangeValDecoded;
      return rangeValDecoded || rangeValEncoded ? [rangeFrom, rangeTo, isObj(originalOpts) && originalOpts.decode ? rangeValDecoded : rangeValEncoded] : [rangeFrom, rangeTo];
    },
    textAmpersandCatcherCb: null,
    progressFn: null,
    entityCatcherCb: null
  };
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("string-fix-broken-named-entities: [THROW_ID_02] the second input argument must be a plain object! I was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (").concat(_typeof__default['default'](originalOpts), "-type)"));
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (opts.cb && typeof opts.cb !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_03] opts.cb must be a function (or falsey)! Currently it's: ".concat(_typeof__default['default'](opts.cb), ", equal to: ").concat(JSON.stringify(opts.cb, null, 4)));
  }
  if (opts.entityCatcherCb && typeof opts.entityCatcherCb !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_04] opts.entityCatcherCb must be a function (or falsey)! Currently it's: ".concat(_typeof__default['default'](opts.entityCatcherCb), ", equal to: ").concat(JSON.stringify(opts.entityCatcherCb, null, 4)));
  }
  if (opts.progressFn && typeof opts.progressFn !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_05] opts.progressFn must be a function (or falsey)! Currently it's: ".concat(_typeof__default['default'](opts.progressFn), ", equal to: ").concat(JSON.stringify(opts.progressFn, null, 4)));
  }
  if (opts.textAmpersandCatcherCb && typeof opts.textAmpersandCatcherCb !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_06] opts.textAmpersandCatcherCb must be a function (or falsey)! Currently it's: ".concat(_typeof__default['default'](opts.textAmpersandCatcherCb), ", equal to: ").concat(JSON.stringify(opts.textAmpersandCatcherCb, null, 4)));
  }
  var rangesArr2 = [];
  var percentageDone;
  var lastPercentageDone;
  var len = str.length + 1;
  var counter = 0;
  var doNothingUntil = null;
  var letterSeqStartAt = null;
  var brokenNumericEntityStartAt = null;
  var ampPositions = [];
  function pingAmps(untilIdx, loopIndexI) {
    if (typeof opts.textAmpersandCatcherCb === "function" && ampPositions.length) {
      while (ampPositions.length) {
        var currentAmp = ampPositions.shift();
        if (
        untilIdx === undefined ||
        currentAmp < untilIdx ||
        currentAmp === loopIndexI) {
          opts.textAmpersandCatcherCb(currentAmp);
        }
      }
    }
  }
  var _loop = function _loop(i) {
    if (opts.progressFn) {
      percentageDone = Math.floor(counter / len * 100);
      /* istanbul ignore else */
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    if (doNothingUntil) {
      if (typeof doNothingUntil === "number" && i >= doNothingUntil) {
        doNothingUntil = null;
      } else {
        counter += 1;
        return "continue";
      }
    }
    if (letterSeqStartAt !== null && i - letterSeqStartAt > 50) {
      letterSeqStartAt = null;
    }
    if (letterSeqStartAt !== null && (!str[i] || str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i]))) {
      if (i > letterSeqStartAt + 1) {
        var potentialEntity = str.slice(letterSeqStartAt, i);
        var whatsOnTheLeft = stringLeftRight.left(str, letterSeqStartAt);
        var whatsEvenMoreToTheLeft = whatsOnTheLeft ? stringLeftRight.left(str, whatsOnTheLeft) : null;
        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
          var firstChar = letterSeqStartAt;
          /* istanbul ignore next */
          var secondChar = letterSeqStartAt ? stringLeftRight.right(str, letterSeqStartAt) : null;
          /* istanbul ignore else */
          if (Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith, str[firstChar]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith[str[firstChar]], str[secondChar])) {
            var tempEnt = "";
            var tempRes;
            var temp1 = allNamedHtmlEntities.entStartsWith[str[firstChar]][str[secondChar]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
              tempRes = stringLeftRight.rightSeq.apply(void 0, [str, letterSeqStartAt - 1].concat(_toConsumableArray__default['default'](oneOfKnownEntities.split(""))));
              if (tempRes) {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes: tempRes
                }]);
              }
              return gatheredSoFar;
            }, []);
            temp1 = removeGappedFromMixedCases(str, temp1);
            /* istanbul ignore else */
            if (temp1) {
              var _temp = temp1;
              tempEnt = _temp.tempEnt;
              tempRes = _temp.tempRes;
            }
            if (tempEnt && (!Object.keys(allNamedHtmlEntities.uncertain).includes(tempEnt) || !str[tempRes.rightmostChar + 1] || ["&"].includes(str[tempRes.rightmostChar + 1]) || (allNamedHtmlEntities.uncertain[tempEnt].addSemiIfAmpPresent === true || allNamedHtmlEntities.uncertain[tempEnt].addSemiIfAmpPresent && (!str[tempRes.rightmostChar + 1] || !str[tempRes.rightmostChar + 1].trim().length)) && str[tempRes.leftmostChar - 1] === "&")) {
              var decodedEntity = allNamedHtmlEntities.decode("&".concat(tempEnt, ";"));
              rangesArr2.push({
                ruleName: "bad-html-entity-malformed-".concat(tempEnt),
                entityName: tempEnt,
                rangeFrom: whatsOnTheLeft || 0,
                rangeTo: tempRes.rightmostChar + 1,
                rangeValEncoded: "&".concat(tempEnt, ";"),
                rangeValDecoded: decodedEntity
              });
              pingAmps(whatsOnTheLeft || 0, i);
            }
          }
        } else if (str[whatsOnTheLeft] !== "&" && str[whatsEvenMoreToTheLeft] !== "&" && str[i] === ";") {
          var lastChar = stringLeftRight.left(str, i);
          var secondToLast = stringLeftRight.left(str, lastChar);
          if (secondToLast !== null && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entEndsWith, str[lastChar]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entEndsWith[str[lastChar]], str[secondToLast])) {
            var _tempEnt = "";
            var _tempRes;
            var _temp2 = allNamedHtmlEntities.entEndsWith[str[lastChar]][str[secondToLast]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
              _tempRes = stringLeftRight.leftSeq.apply(void 0, [str, i].concat(_toConsumableArray__default['default'](oneOfKnownEntities.split(""))));
              if (_tempRes && !(oneOfKnownEntities === "block" && str[stringLeftRight.left(str, letterSeqStartAt)] === ":")) {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes: _tempRes
                }]);
              }
              return gatheredSoFar;
            }, []);
            _temp2 = removeGappedFromMixedCases(str, _temp2);
            /* istanbul ignore else */
            if (_temp2) {
              var _temp3 = _temp2;
              _tempEnt = _temp3.tempEnt;
              _tempRes = _temp3.tempRes;
            }
            if (_tempEnt && (!Object.keys(allNamedHtmlEntities.uncertain).includes(_tempEnt) || allNamedHtmlEntities.uncertain[_tempEnt].addAmpIfSemiPresent === true || allNamedHtmlEntities.uncertain[_tempEnt].addAmpIfSemiPresent && (!_tempRes.leftmostChar || isStr(str[_tempRes.leftmostChar - 1]) && !str[_tempRes.leftmostChar - 1].trim().length))) {
              var _decodedEntity = allNamedHtmlEntities.decode("&".concat(_tempEnt, ";"));
              rangesArr2.push({
                ruleName: "bad-html-entity-malformed-".concat(_tempEnt),
                entityName: _tempEnt,
                rangeFrom: _tempRes.leftmostChar,
                rangeTo: i + 1,
                rangeValEncoded: "&".concat(_tempEnt, ";"),
                rangeValDecoded: _decodedEntity
              });
              pingAmps(_tempRes.leftmostChar, i);
            }
          } else if (brokenNumericEntityStartAt !== null) {
            rangesArr2.push({
              ruleName: "bad-html-entity-malformed-numeric",
              entityName: null,
              rangeFrom: brokenNumericEntityStartAt,
              rangeTo: i + 1,
              rangeValEncoded: null,
              rangeValDecoded: null
            });
            pingAmps(brokenNumericEntityStartAt, i);
            brokenNumericEntityStartAt = null;
          }
        } else if (str[i] === ";" && (str[whatsOnTheLeft] === "&" || str[whatsOnTheLeft] === ";" && str[whatsEvenMoreToTheLeft] === "&")) {
          if (!str[letterSeqStartAt - 1].trim() && str[whatsOnTheLeft] === "&") ;
          /* istanbul ignore else */
          if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) {
            var situation = resemblesNumericEntity(str, whatsOnTheLeft + 1, i);
            if (situation.probablyNumeric) {
              if (
              /* istanbul ignore next */
              situation.probablyNumeric && situation.charTrimmed[0] === "#" && !situation.whitespaceCount && (
              !situation.lettersCount && situation.numbersCount > 0 && !situation.othersCount ||
              (situation.numbersCount || situation.lettersCount) && situation.charTrimmed[1] === "x" && !situation.othersCount)) {
                var decodedEntitysValue = String.fromCharCode(parseInt(situation.charTrimmed.slice(situation.probablyNumeric === "deci" ? 1 : 2), situation.probablyNumeric === "deci" ? 10 : 16));
                if (situation.probablyNumeric === "deci" && parseInt(situation.numbersValue, 10) > 918015) {
                  rangesArr2.push({
                    ruleName: "bad-html-entity-malformed-numeric",
                    entityName: null,
                    rangeFrom: whatsOnTheLeft || 0,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                } else if (opts.decode) {
                  rangesArr2.push({
                    ruleName: "bad-html-entity-encoded-numeric",
                    entityName: situation.charTrimmed,
                    rangeFrom: whatsOnTheLeft || 0,
                    rangeTo: i + 1,
                    rangeValEncoded: "&".concat(situation.charTrimmed, ";"),
                    rangeValDecoded: decodedEntitysValue
                  });
                }
                pingAmps(whatsOnTheLeft || 0, i);
              } else {
                rangesArr2.push({
                  ruleName: "bad-html-entity-malformed-numeric",
                  entityName: null,
                  rangeFrom: whatsOnTheLeft || 0,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null
                });
                pingAmps(whatsOnTheLeft || 0, i);
              }
              if (opts.entityCatcherCb) {
                opts.entityCatcherCb(whatsOnTheLeft, i + 1);
              }
            } else {
              var potentialEntityOnlyNonWhitespaceChars = Array.from(potentialEntity).filter(function (_char) {
                return _char.trim().length;
              }).join("");
              if (potentialEntityOnlyNonWhitespaceChars.length <= allNamedHtmlEntities.maxLength && allNamedHtmlEntities.allNamedEntitiesSetOnlyCaseInsensitive.has(potentialEntityOnlyNonWhitespaceChars.toLowerCase())) {
                if (
                typeof potentialEntityOnlyNonWhitespaceChars === "string" && !allNamedHtmlEntities.allNamedEntitiesSetOnly.has(potentialEntityOnlyNonWhitespaceChars)) {
                  var matchingEntitiesOfCorrectCaseArr = _toConsumableArray__default['default'](allNamedHtmlEntities.allNamedEntitiesSetOnly).filter(function (ent) {
                    return ent.toLowerCase() === potentialEntityOnlyNonWhitespaceChars.toLowerCase();
                  });
                  if (matchingEntitiesOfCorrectCaseArr.length === 1) {
                    rangesArr2.push({
                      ruleName: "bad-html-entity-malformed-".concat(matchingEntitiesOfCorrectCaseArr[0]),
                      entityName: matchingEntitiesOfCorrectCaseArr[0],
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: "&".concat(matchingEntitiesOfCorrectCaseArr[0], ";"),
                      rangeValDecoded: allNamedHtmlEntities.decode("&".concat(matchingEntitiesOfCorrectCaseArr[0], ";"))
                    });
                    pingAmps(whatsOnTheLeft, i);
                  } else {
                    rangesArr2.push({
                      ruleName: "bad-html-entity-unrecognised",
                      entityName: null,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: null,
                      rangeValDecoded: null
                    });
                    pingAmps(whatsOnTheLeft, i);
                  }
                } else if (
                i - whatsOnTheLeft - 1 !== potentialEntityOnlyNonWhitespaceChars.length || str[whatsOnTheLeft] !== "&") {
                  var rangeFrom = str[whatsOnTheLeft] === "&" ? whatsOnTheLeft : whatsEvenMoreToTheLeft;
                  if (
                  Object.keys(allNamedHtmlEntities.uncertain).includes(potentialEntityOnlyNonWhitespaceChars) &&
                  !str[rangeFrom + 1].trim().length) {
                    letterSeqStartAt = null;
                    return "continue";
                  }
                  rangesArr2.push({
                    ruleName: "bad-html-entity-malformed-".concat(potentialEntityOnlyNonWhitespaceChars),
                    entityName: potentialEntityOnlyNonWhitespaceChars,
                    rangeFrom: rangeFrom,
                    rangeTo: i + 1,
                    rangeValEncoded: "&".concat(potentialEntityOnlyNonWhitespaceChars, ";"),
                    rangeValDecoded: allNamedHtmlEntities.decode("&".concat(potentialEntityOnlyNonWhitespaceChars, ";"))
                  });
                  pingAmps(rangeFrom, i);
                } else if (opts.decode) {
                  rangesArr2.push({
                    ruleName: "bad-html-entity-encoded-".concat(potentialEntityOnlyNonWhitespaceChars),
                    entityName: potentialEntityOnlyNonWhitespaceChars,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: "&".concat(potentialEntityOnlyNonWhitespaceChars, ";"),
                    rangeValDecoded: allNamedHtmlEntities.decode("&".concat(potentialEntityOnlyNonWhitespaceChars, ";"))
                  });
                  pingAmps(whatsOnTheLeft, i);
                } else if (opts.entityCatcherCb || opts.textAmpersandCatcherCb) {
                  if (opts.entityCatcherCb) {
                    opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                  }
                  if (opts.textAmpersandCatcherCb) {
                    pingAmps(whatsOnTheLeft, i);
                  }
                }
                letterSeqStartAt = null;
                return "continue";
              }
              /* istanbul ignore next */
              letterSeqStartAt ? stringLeftRight.right(str, letterSeqStartAt) : null;
              var _tempEnt2 = "";
              var temp;
              if (Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.brokenNamedEntities, situation.charTrimmed.toLowerCase())) {
                _tempEnt2 = situation.charTrimmed;
                var _decodedEntity2 = allNamedHtmlEntities.decode("&".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()], ";"));
                rangesArr2.push({
                  ruleName: "bad-html-entity-malformed-".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()]),
                  entityName: allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()],
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: "&".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()], ";"),
                  rangeValDecoded: _decodedEntity2
                });
                pingAmps(whatsOnTheLeft, i);
              } else if (
              potentialEntity.length < allNamedHtmlEntities.maxLength + 2 && (
              (temp = _toConsumableArray__default['default'](allNamedHtmlEntities.allNamedEntitiesSetOnly).filter(function (curr) {
                return leven__default['default'](curr, potentialEntity) === 1;
              })) && temp.length ||
              (temp = _toConsumableArray__default['default'](allNamedHtmlEntities.allNamedEntitiesSetOnly).filter(function (curr) {
                return (
                  /* istanbul ignore next */
                  leven__default['default'](curr, potentialEntity) === 2 && potentialEntity.length > 3
                );
              })) && temp.length)) {
                /* istanbul ignore else */
                if (temp.length === 1) {
                  var _temp4 = temp;
                  var _temp5 = _slicedToArray__default['default'](_temp4, 1);
                  _tempEnt2 = _temp5[0];
                  rangesArr2.push({
                    ruleName: "bad-html-entity-malformed-".concat(_tempEnt2),
                    entityName: _tempEnt2,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: "&".concat(_tempEnt2, ";"),
                    rangeValDecoded: allNamedHtmlEntities.decode("&".concat(_tempEnt2, ";"))
                  });
                  pingAmps(whatsOnTheLeft, i);
                } else if (temp) {
                  var missingLettersCount = temp.map(function (ent) {
                    var splitStr = str.split("");
                    return ent.split("").reduce(function (acc, curr) {
                      if (splitStr.includes(curr)) {
                        splitStr.splice(splitStr.indexOf(curr), 1);
                        return acc + 1;
                      }
                      return acc;
                    }, 0);
                  });
                  var maxVal = Math.max.apply(Math, _toConsumableArray__default['default'](missingLettersCount));
                  if (maxVal && missingLettersCount.filter(function (v) {
                    return v === maxVal;
                  }).length === 1) {
                    for (var z = 0, _len = missingLettersCount.length; z < _len; z++) {
                      if (missingLettersCount[z] === maxVal) {
                        _tempEnt2 = temp[z];
                        rangesArr2.push({
                          ruleName: "bad-html-entity-malformed-".concat(_tempEnt2),
                          entityName: _tempEnt2,
                          rangeFrom: whatsOnTheLeft,
                          rangeTo: i + 1,
                          rangeValEncoded: "&".concat(_tempEnt2, ";"),
                          rangeValDecoded: allNamedHtmlEntities.decode("&".concat(_tempEnt2, ";"))
                        });
                        pingAmps(whatsOnTheLeft, i);
                        break;
                      }
                    }
                  }
                }
              }
              if (!_tempEnt2) {
                rangesArr2.push({
                  ruleName: "bad-html-entity-unrecognised",
                  entityName: null,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null
                });
                pingAmps(whatsOnTheLeft, i);
              }
            }
          }
        } else if (str[whatsEvenMoreToTheLeft] === "&" && str[i] === ";" && i - whatsEvenMoreToTheLeft < allNamedHtmlEntities.maxLength) {
          var _situation = resemblesNumericEntity(str, whatsEvenMoreToTheLeft + 1, i);
          rangesArr2.push({
            ruleName: "".concat(
            /* istanbul ignore next */
            _situation.probablyNumeric ? "bad-html-entity-malformed-numeric" : "bad-html-entity-unrecognised"),
            entityName: null,
            rangeFrom: whatsEvenMoreToTheLeft,
            rangeTo: i + 1,
            rangeValEncoded: null,
            rangeValDecoded: null
          });
          pingAmps(whatsEvenMoreToTheLeft, i);
        }
      }
      letterSeqStartAt = null;
    }
    if (letterSeqStartAt === null && isLatinLetterOrNumberOrHash(str[i]) && str[i + 1]) {
      letterSeqStartAt = i;
    }
    if (str[i] === "a") {
      var singleAmpOnTheRight = stringLeftRight.rightSeq(str, i, "m", "p", ";");
      if (singleAmpOnTheRight) {
        var toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        var nextAmpOnTheRight = stringLeftRight.rightSeq(str, singleAmpOnTheRight.rightmostChar, "a", "m", "p", ";");
        if (nextAmpOnTheRight) {
          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          var _temp6;
          do {
            _temp6 = stringLeftRight.rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");
            if (_temp6) {
              toDeleteAllAmpEndHere = _temp6.rightmostChar + 1;
            }
          } while (_temp6);
        }
        var firstCharThatFollows = stringLeftRight.right(str, toDeleteAllAmpEndHere - 1);
        var secondCharThatFollows = firstCharThatFollows ? stringLeftRight.right(str, firstCharThatFollows) : null;
        var matchedTemp = "";
        if (secondCharThatFollows && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith, str[firstCharThatFollows]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith[str[firstCharThatFollows]], str[secondCharThatFollows]) && allNamedHtmlEntities.entStartsWith[str[firstCharThatFollows]][str[secondCharThatFollows]].some(function (entity) {
          var matchEntityOnTheRight = stringLeftRight.rightSeq.apply(void 0, [str, toDeleteAllAmpEndHere - 1].concat(_toConsumableArray__default['default'](entity.split(""))));
          /* istanbul ignore else */
          if (matchEntityOnTheRight) {
            matchedTemp = entity;
            return true;
          }
        })) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1;
          /* istanbul ignore next */
          var _whatsOnTheLeft = stringLeftRight.left(str, i) || 0;
          /* istanbul ignore else */
          if (str[_whatsOnTheLeft] === "&") {
            rangesArr2.push({
              ruleName: "bad-html-entity-multiple-encoding",
              entityName: matchedTemp,
              rangeFrom: _whatsOnTheLeft,
              rangeTo: doNothingUntil,
              rangeValEncoded: "&".concat(matchedTemp, ";"),
              rangeValDecoded: allNamedHtmlEntities.decode("&".concat(matchedTemp, ";"))
            });
            pingAmps(_whatsOnTheLeft, i);
          } else if (_whatsOnTheLeft) {
            var _rangeFrom = i;
            var spaceReplacement = "";
            if (str[i - 1] === " ") ;
            /* istanbul ignore else */
            if (typeof opts.cb === "function") {
              rangesArr2.push({
                ruleName: "bad-html-entity-multiple-encoding",
                entityName: matchedTemp,
                rangeFrom: _rangeFrom,
                rangeTo: doNothingUntil,
                rangeValEncoded: "".concat(spaceReplacement, "&").concat(matchedTemp, ";"),
                rangeValDecoded: "".concat(spaceReplacement).concat(allNamedHtmlEntities.decode("&".concat(matchedTemp, ";")))
              });
              pingAmps(_rangeFrom, i);
            }
          }
        }
      }
    }
    if (str[i] === "#" && stringLeftRight.right(str, i) && str[stringLeftRight.right(str, i)].toLowerCase() === "x" && (!str[i - 1] || !stringLeftRight.left(str, i) || str[stringLeftRight.left(str, i)] !== "&")) {
      if (isNumeric(str[stringLeftRight.right(str, stringLeftRight.right(str, i))])) {
        brokenNumericEntityStartAt = i;
      }
    }
    if (str[i] === "&") {
      ampPositions.push(i);
    }
    if (!str[i] && typeof opts.textAmpersandCatcherCb === "function" && ampPositions.length) {
      pingAmps();
    }
    counter += 1;
  };
  for (var i = 0; i <= len; i++) {
    var _ret = _loop(i);
    if (_ret === "continue") continue;
  }
  if (!rangesArr2.length) {
    return [];
  }
  var res = rangesArr2.filter(function (filteredRangeObj, i) {
    return rangesArr2.every(function (oneOfEveryObj, y) {
      return i === y || !(filteredRangeObj.rangeFrom >= oneOfEveryObj.rangeFrom && filteredRangeObj.rangeTo < oneOfEveryObj.rangeTo);
    });
  });
  /* istanbul ignore else */
  if (typeof opts.cb === "function") {
    return res.map(opts.cb);
  }
  /* istanbul ignore next */
  return res;
}

exports.allRules = allRules;
exports.fixEnt = fixEnt;
exports.version = version;

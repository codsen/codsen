/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 2.6.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var leven = _interopDefault(require('leven'));
var allNamedHtmlEntities = require('all-named-html-entities');
var stringLeftRight = require('string-left-right');

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function isLatinLetterOrNumberOrHash(char) {
  return isStr(char) && char.length === 1 && (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 || char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) === 35);
}
function isNumber(something) {
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
    } else if (isNumber(str2[i])) {
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
  } else if ((numbersCount || lettersCount) && (charTrimmed[0] === "#" && charTrimmed[1].toLowerCase() === "x" && (isNumber(charTrimmed[2]) || isLatinLetter(charTrimmed[2])) || charTrimmed[0].toLowerCase() === "x" && numbersCount && !othersCount)) {
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
  if (arguments.length !== 2) {
    throw new Error("removeGappedFromMixedCases(): wrong amount of inputs!");
  }
  var copy;
  if (Array.isArray(temp1) && temp1.length) {
    copy = Array.from(temp1);
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

function stringFixBrokenNamedEntities(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error("string-fix-broken-named-entities: [THROW_ID_01] the first input argument must be string! It was given as:\n".concat(JSON.stringify(str, null, 4), " (").concat(_typeof(str), "-type)"));
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
    progressFn: null,
    entityCatcherCb: null
  };
  var opts;
  if (originalOpts != null) {
    if (!isObj(originalOpts)) {
      throw new Error("string-fix-broken-named-entities: [THROW_ID_02] the second input argument must be a plain object! I was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (").concat(_typeof(originalOpts), "-type)"));
    } else {
      opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
    }
  } else {
    opts = defaults;
  }
  if (opts.cb && typeof opts.cb !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_03] opts.cb must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.cb), ", equal to: ").concat(JSON.stringify(opts.cb, null, 4)));
  }
  if (opts.entityCatcherCb && typeof opts.entityCatcherCb !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_03] opts.entityCatcherCb must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.entityCatcherCb), ", equal to: ").concat(JSON.stringify(opts.entityCatcherCb, null, 4)));
  }
  if (opts.progressFn && typeof opts.progressFn !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_04] opts.progressFn must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.progressFn), ", equal to: ").concat(JSON.stringify(opts.progressFn, null, 4)));
  }
  var rangesArr2 = [];
  var percentageDone;
  var lastPercentageDone;
  var len = str.length + 1;
  var counter = 0;
  var doNothingUntil = null;
  var letterSeqStartAt = null;
  var brokenNumericEntityStartAt = null;
  var _loop = function _loop(i) {
    if (opts.progressFn) {
      percentageDone = Math.floor(counter / len * 100);
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
        return "continue";
      }
    }
    if (letterSeqStartAt !== null && (!str[i] || str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i]))) {
      if (i > letterSeqStartAt + 1) {
        var potentialEntity = str.slice(letterSeqStartAt, i);
        var whatsOnTheLeft = stringLeftRight.left(str, letterSeqStartAt);
        var whatsEvenMoreToTheLeft = whatsOnTheLeft ? stringLeftRight.left(str, whatsOnTheLeft) : "";
        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
          var firstChar = letterSeqStartAt;
          var secondChar = letterSeqStartAt ? stringLeftRight.right(str, letterSeqStartAt) : null;
          if (Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith, str[firstChar]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith[str[firstChar]], str[secondChar])) {
            var tempEnt;
            var tempRes;
            var temp1 = allNamedHtmlEntities.entStartsWith[str[firstChar]][str[secondChar]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
              tempRes = stringLeftRight.rightSeq.apply(void 0, [str, letterSeqStartAt - 1].concat(_toConsumableArray(oneOfKnownEntities.split(""))));
              if (tempRes) {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes: tempRes
                }]);
              }
              return gatheredSoFar;
            }, []);
            temp1 = removeGappedFromMixedCases(str, temp1);
            if (temp1) {
              var _temp = temp1;
              tempEnt = _temp.tempEnt;
              tempRes = _temp.tempRes;
            }
            if (tempEnt && (!Object.keys(allNamedHtmlEntities.uncertain).includes(tempEnt) || !str[tempRes.rightmostChar + 1] || ["&"].includes(str[tempRes.rightmostChar + 1]) || (allNamedHtmlEntities.uncertain[tempEnt].addSemiIfAmpPresent === true || allNamedHtmlEntities.uncertain[tempEnt].addSemiIfAmpPresent && (!str[tempRes.rightmostChar + 1] || !str[tempRes.rightmostChar + 1].trim().length)) && str[tempRes.leftmostChar - 1] === "&")) {
              var decodedEntity = allNamedHtmlEntities.decode("&".concat(tempEnt, ";"));
              rangesArr2.push({
                ruleName: "bad-named-html-entity-malformed-".concat(tempEnt),
                entityName: tempEnt,
                rangeFrom: whatsOnTheLeft,
                rangeTo: tempRes.rightmostChar + 1,
                rangeValEncoded: "&".concat(tempEnt, ";"),
                rangeValDecoded: decodedEntity
              });
            }
          }
        } else if (str[whatsOnTheLeft] !== "&" && str[whatsEvenMoreToTheLeft] !== "&" && str[i] === ";") {
          var lastChar = stringLeftRight.left(str, i);
          var secondToLast = lastChar ? stringLeftRight.left(str, lastChar) : null;
          if (secondToLast !== null && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entEndsWith, str[lastChar]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entEndsWith[str[lastChar]], str[secondToLast])) {
            var _tempEnt;
            var _tempRes;
            var _temp2 = allNamedHtmlEntities.entEndsWith[str[lastChar]][str[secondToLast]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
              _tempRes = stringLeftRight.leftSeq.apply(void 0, [str, i].concat(_toConsumableArray(oneOfKnownEntities.split(""))));
              if (_tempRes && !(oneOfKnownEntities === "block" && str[stringLeftRight.left(str, letterSeqStartAt)] === ":")) {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes: _tempRes
                }]);
              }
              return gatheredSoFar;
            }, []);
            _temp2 = removeGappedFromMixedCases(str, _temp2);
            if (_temp2) {
              var _temp3 = _temp2;
              _tempEnt = _temp3.tempEnt;
              _tempRes = _temp3.tempRes;
            }
            if (_tempEnt && (!Object.keys(allNamedHtmlEntities.uncertain).includes(_tempEnt) || allNamedHtmlEntities.uncertain[_tempEnt].addAmpIfSemiPresent === true || allNamedHtmlEntities.uncertain[_tempEnt].addAmpIfSemiPresent && (!_tempRes.leftmostChar || isStr(str[_tempRes.leftmostChar - 1]) && !str[_tempRes.leftmostChar - 1].trim().length))) {
              var _decodedEntity = allNamedHtmlEntities.decode("&".concat(_tempEnt, ";"));
              rangesArr2.push({
                ruleName: "bad-named-html-entity-malformed-".concat(_tempEnt),
                entityName: _tempEnt,
                rangeFrom: _tempRes.leftmostChar,
                rangeTo: i + 1,
                rangeValEncoded: "&".concat(_tempEnt, ";"),
                rangeValDecoded: _decodedEntity
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
        } else if ((str[whatsOnTheLeft] === "&" || str[whatsOnTheLeft] === ";" && str[whatsEvenMoreToTheLeft] === "&") && str[i] === ";") {
          if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) {
            var situation = resemblesNumericEntity(str, whatsOnTheLeft + 1, i);
            if (situation.probablyNumeric) {
              if (situation.probablyNumeric && situation.charTrimmed[0] === "#" && !situation.whitespaceCount && (
              !situation.lettersCount && situation.numbersCount > 0 && !situation.othersCount ||
              (situation.numbersCount || situation.lettersCount) && situation.charTrimmed[1] === "x" && !situation.othersCount)) {
                var decodedEntitysValue = String.fromCharCode(parseInt(situation.charTrimmed.slice(situation.probablyNumeric === "deci" ? 1 : 2), situation.probablyNumeric === "deci" ? 10 : 16));
                if (situation.probablyNumeric === "deci" && parseInt(situation.numbersValue, 10) > 918015) {
                  rangesArr2.push({
                    ruleName: "bad-malformed-numeric-character-entity",
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                } else if (opts.decode) {
                  rangesArr2.push({
                    ruleName: "encoded-numeric-html-entity-reference",
                    entityName: situation.charTrimmed,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: "&".concat(situation.charTrimmed, ";"),
                    rangeValDecoded: decodedEntitysValue
                  });
                }
              } else {
                rangesArr2.push({
                  ruleName: "bad-malformed-numeric-character-entity",
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
              if (potentialEntity.length <= 50) {
                var potentialEntityOnlyNonWhitespaceChars = Array.from(potentialEntity).filter(function (char) {
                  return char.trim().length;
                }).join("");
                if (potentialEntityOnlyNonWhitespaceChars.length <= allNamedHtmlEntities.maxLength && allNamedHtmlEntities.allNamedEntitiesSetOnlyCaseInsensitive.has(potentialEntityOnlyNonWhitespaceChars.toLowerCase())) {
                  if (
                  !allNamedHtmlEntities.allNamedEntitiesSetOnly.has(potentialEntityOnlyNonWhitespaceChars)) {
                    var matchingEntitiesOfCorrectCaseArr = _toConsumableArray(allNamedHtmlEntities.allNamedEntitiesSetOnly).filter(function (ent) {
                      return ent.toLowerCase() === potentialEntityOnlyNonWhitespaceChars.toLowerCase();
                    });
                    if (matchingEntitiesOfCorrectCaseArr.length === 1) {
                      rangesArr2.push({
                        ruleName: "bad-named-html-entity-malformed-".concat(matchingEntitiesOfCorrectCaseArr[0]),
                        entityName: matchingEntitiesOfCorrectCaseArr[0],
                        rangeFrom: whatsOnTheLeft,
                        rangeTo: i + 1,
                        rangeValEncoded: "&".concat(matchingEntitiesOfCorrectCaseArr[0], ";"),
                        rangeValDecoded: allNamedHtmlEntities.decode("&".concat(matchingEntitiesOfCorrectCaseArr[0], ";"))
                      });
                    } else {
                      rangesArr2.push({
                        ruleName: "bad-named-html-entity-unrecognised",
                        entityName: null,
                        rangeFrom: whatsOnTheLeft,
                        rangeTo: i + 1,
                        rangeValEncoded: null,
                        rangeValDecoded: null
                      });
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
                      ruleName: "bad-named-html-entity-malformed-".concat(potentialEntityOnlyNonWhitespaceChars),
                      entityName: potentialEntityOnlyNonWhitespaceChars,
                      rangeFrom: rangeFrom,
                      rangeTo: i + 1,
                      rangeValEncoded: "&".concat(potentialEntityOnlyNonWhitespaceChars, ";"),
                      rangeValDecoded: allNamedHtmlEntities.decode("&".concat(potentialEntityOnlyNonWhitespaceChars, ";"))
                    });
                  } else if (opts.decode) {
                    rangesArr2.push({
                      ruleName: "encoded-html-entity-".concat(potentialEntityOnlyNonWhitespaceChars),
                      entityName: potentialEntityOnlyNonWhitespaceChars,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: "&".concat(potentialEntityOnlyNonWhitespaceChars, ";"),
                      rangeValDecoded: allNamedHtmlEntities.decode("&".concat(potentialEntityOnlyNonWhitespaceChars, ";"))
                    });
                  } else if (opts.entityCatcherCb) {
                    opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                  }
                  letterSeqStartAt = null;
                  return "continue";
                }
              }
              var _firstChar = letterSeqStartAt;
              var _secondChar = letterSeqStartAt ? stringLeftRight.right(str, letterSeqStartAt) : null;
              var _tempEnt2;
              var temp;
              if (Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.brokenNamedEntities, situation.charTrimmed.toLowerCase())) {
                _tempEnt2 = situation.charTrimmed;
                var _decodedEntity2 = allNamedHtmlEntities.decode("&".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()], ";"));
                rangesArr2.push({
                  ruleName: "bad-named-html-entity-malformed-".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()]),
                  entityName: allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()],
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: "&".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()], ";"),
                  rangeValDecoded: _decodedEntity2
                });
              } else if (
              potentialEntity.length < allNamedHtmlEntities.maxLength + 2 && (
              (temp = _toConsumableArray(allNamedHtmlEntities.allNamedEntitiesSetOnly).filter(function (curr) {
                return leven(curr, potentialEntity) === 1;
              })) && temp.length ||
              (temp = _toConsumableArray(allNamedHtmlEntities.allNamedEntitiesSetOnly).filter(function (curr) {
                return leven(curr, potentialEntity) === 2 && potentialEntity.length > 3;
              })) && temp.length)) {
                if (temp.length === 1) {
                  var _temp4 = temp;
                  var _temp5 = _slicedToArray(_temp4, 1);
                  _tempEnt2 = _temp5[0];
                  rangesArr2.push({
                    ruleName: "bad-named-html-entity-malformed-".concat(_tempEnt2),
                    entityName: _tempEnt2,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: "&".concat(_tempEnt2, ";"),
                    rangeValDecoded: allNamedHtmlEntities.decode("&".concat(_tempEnt2, ";"))
                  });
                } else {
                  var lengthOfLongestCaughtEnt = temp.reduce(function (acc, curr) {
                    return curr.length > acc ? curr.length : acc;
                  }, 0);
                  temp = temp.filter(function (ent) {
                    return ent.length === lengthOfLongestCaughtEnt;
                  });
                  if (temp.length === 1) {
                    rangesArr2.push({
                      ruleName: "bad-named-html-entity-malformed-".concat(temp[0]),
                      entityName: temp[0],
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: "&".concat(temp[0], ";"),
                      rangeValDecoded: allNamedHtmlEntities.decode("&".concat(temp[0], ";"))
                    });
                  }
                }
              } else if (Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWithCaseInsensitive, str[_firstChar].toLowerCase()) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWithCaseInsensitive[str[_firstChar].toLowerCase()], str[_secondChar].toLowerCase())) {
                var _tempRes2;
                var matchedEntity = allNamedHtmlEntities.entStartsWithCaseInsensitive[str[_firstChar].toLowerCase()][str[_secondChar].toLowerCase()].reduce(function (gatheredSoFar, oneOfKnownEntities) {
                  _tempRes2 = stringLeftRight.rightSeq.apply(void 0, [str, letterSeqStartAt - 1, {
                    i: true
                  }].concat(_toConsumableArray(oneOfKnownEntities.split(""))));
                  if (_tempRes2) {
                    return gatheredSoFar.concat([{
                      tempEnt: oneOfKnownEntities,
                      tempRes: _tempRes2
                    }]);
                  }
                  return gatheredSoFar;
                }, []);
                matchedEntity = removeGappedFromMixedCases(str, matchedEntity);
                if (matchedEntity) {
                  var _matchedEntity = matchedEntity;
                  _tempEnt2 = _matchedEntity.tempEnt;
                  _tempRes2 = _matchedEntity.tempRes;
                }
                var entitysValue;
                if (_tempEnt2) {
                  var issue = false;
                  var firstChar2 = _tempRes2.leftmostChar;
                  var secondChar2 = stringLeftRight.right(str, firstChar2);
                  if (Object.keys(allNamedHtmlEntities.uncertain).includes(potentialEntity) && isStr(str[firstChar2 - 1]) && !str[firstChar2 - 1].trim().length && allNamedHtmlEntities.uncertain[potentialEntity].addAmpIfSemiPresent !== true) {
                    letterSeqStartAt = null;
                    return "continue";
                  }
                  if (Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith, str[firstChar2]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith[str[firstChar2]], str[secondChar2]) && allNamedHtmlEntities.entStartsWith[str[firstChar2]][str[secondChar2]].includes(situation.charTrimmed)) {
                    entitysValue = situation.charTrimmed;
                    if (i - whatsOnTheLeft - 1 === _tempEnt2.length) {
                      if (opts.decode) {
                        issue = "encoded-html-entity";
                      }
                    } else {
                      issue = "bad-named-html-entity-malformed";
                    }
                  } else {
                    issue = "bad-named-html-entity-malformed";
                    var matchingEntities = Object.keys(allNamedHtmlEntities.allNamedEntities).filter(function (entity) {
                      return situation.charTrimmed.toLowerCase().startsWith(entity.toLowerCase());
                    });
                    if (matchingEntities.length === 1) {
                      entitysValue = matchingEntities[0];
                    } else {
                      var filterLongest = matchingEntities.reduce(function (accum, curr) {
                        if (!accum.length || curr.length === accum[0].length) {
                          return accum.concat([curr]);
                        }
                        if (curr.length > accum[0].length) {
                          return [curr];
                        }
                        return accum;
                      }, []);
                      if (filterLongest.length === 1) {
                        entitysValue = filterLongest[0];
                      } else {
                        var missingLetters = filterLongest.map(function (entity) {
                          var count = 0;
                          for (var z = 0, len2 = entity.length; z < len2; z++) {
                            if (entity[z] !== situation.charTrimmed[z]) {
                              count += 1;
                            }
                          }
                          return count;
                        });
                        if (missingLetters.filter(function (val) {
                          return val === Math.min.apply(Math, _toConsumableArray(missingLetters));
                        }).length > 1) {
                          rangesArr2.push({
                            ruleName: "bad-named-html-entity-unrecognised",
                            entityName: null,
                            rangeFrom: whatsOnTheLeft,
                            rangeTo: _tempRes2.rightmostChar + 1 === i ? i + 1 : _tempRes2.rightmostChar + 1,
                            rangeValEncoded: null,
                            rangeValDecoded: null
                          });
                          issue = false;
                        }
                        entitysValue = filterLongest[missingLetters.indexOf(Math.min.apply(Math, _toConsumableArray(missingLetters)))];
                      }
                    }
                  }
                  var endingIdx = _tempRes2.rightmostChar + 1 === i ? i + 1 : _tempRes2.rightmostChar + 1;
                  if (issue) {
                    var _decodedEntity3 = allNamedHtmlEntities.decode("&".concat(entitysValue, ";"));
                    if (str[endingIdx] && str[endingIdx] !== ";" && !str[endingIdx].trim().length && str[stringLeftRight.right(str, endingIdx)] === ";") {
                      endingIdx = stringLeftRight.right(str, endingIdx) + 1;
                    }
                    rangesArr2.push({
                      ruleName: "".concat(issue, "-").concat(entitysValue),
                      entityName: entitysValue,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: endingIdx,
                      rangeValEncoded: "&".concat(entitysValue, ";"),
                      rangeValDecoded: _decodedEntity3
                    });
                  }
                  if (opts.entityCatcherCb) {
                    opts.entityCatcherCb(whatsOnTheLeft, endingIdx);
                  }
                }
              }
              if (!_tempEnt2) {
                rangesArr2.push({
                  ruleName: "bad-named-html-entity-unrecognised",
                  entityName: null,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null
                });
              }
            }
          }
        } else if (str[whatsEvenMoreToTheLeft] === "&" && str[i] === ";" && i - whatsEvenMoreToTheLeft < allNamedHtmlEntities.maxLength) {
          var _situation = resemblesNumericEntity(str, whatsEvenMoreToTheLeft + 1, i);
          rangesArr2.push({
            ruleName: "".concat(_situation.probablyNumeric ? "bad-malformed-numeric-character-entity" : "bad-named-html-entity-unrecognised"),
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
        var matchedTemp;
        if (secondCharThatFollows && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith, str[firstCharThatFollows]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith[str[firstCharThatFollows]], str[secondCharThatFollows]) && allNamedHtmlEntities.entStartsWith[str[firstCharThatFollows]][str[secondCharThatFollows]].some(function (entity) {
          var matchEntityOnTheRight = stringLeftRight.rightSeq.apply(void 0, [str, toDeleteAllAmpEndHere - 1].concat(_toConsumableArray(entity.slice(""))));
          if (matchEntityOnTheRight) {
            matchedTemp = entity;
            return true;
          }
        })) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1;
          var _whatsOnTheLeft = stringLeftRight.left(str, i);
          if (str[_whatsOnTheLeft] === "&") {
            rangesArr2.push({
              ruleName: "bad-named-html-entity-multiple-encoding",
              entityName: matchedTemp,
              rangeFrom: _whatsOnTheLeft,
              rangeTo: doNothingUntil,
              rangeValEncoded: "&".concat(matchedTemp, ";"),
              rangeValDecoded: allNamedHtmlEntities.decode("&".concat(matchedTemp, ";"))
            });
          } else if (_whatsOnTheLeft) {
            var _rangeFrom = i;
            var spaceReplacement = "";
            if (str[i - 1] === " ") ;
            if (opts.cb) {
              rangesArr2.push({
                ruleName: "bad-named-html-entity-multiple-encoding",
                entityName: matchedTemp,
                rangeFrom: _rangeFrom,
                rangeTo: doNothingUntil,
                rangeValEncoded: "".concat(spaceReplacement, "&").concat(matchedTemp, ";"),
                rangeValDecoded: "".concat(spaceReplacement).concat(allNamedHtmlEntities.decode("&".concat(matchedTemp, ";")))
              });
            }
          }
        }
      }
    }
    if (str[i] === "#" && stringLeftRight.right(str, i) && str[stringLeftRight.right(str, i)].toLowerCase() === "x" && (!str[i - 1] || !stringLeftRight.left(str, i) || str[stringLeftRight.left(str, i)] !== "&")) {
      if (isNumber(str[stringLeftRight.right(str, stringLeftRight.right(str, i))])) {
        brokenNumericEntityStartAt = i;
      }
    }
    counter += 1;
  };
  for (var i = 0; i < len; i++) {
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
  }).filter(function (filteredRangeObj, i, allRangesArr) {
    if (filteredRangeObj.ruleName === "bad-named-html-entity-unrecognised" && allRangesArr.some(function (oneRangeObj, y) {
      return i !== y &&
      oneRangeObj.rangeFrom <= filteredRangeObj.rangeFrom && oneRangeObj.rangeTo === filteredRangeObj.rangeTo;
    })) {
      return false;
    }
    return true;
  }).map(opts.cb);
  return res;
}

module.exports = stringFixBrokenNamedEntities;

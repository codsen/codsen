/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 2.1.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));
var allNamedHtmlEntities = require('all-named-html-entities');
var stringLeftRight = require('string-left-right');

function _typeof(obj) {
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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var isArr = Array.isArray;
function stringFixBrokenNamedEntities(str, originalOpts) {
  function isNotaLetter(str) {
    return !(typeof str === "string" && str.length === 1 && str.toUpperCase() !== str.toLowerCase());
  }
  function isStr(something) {
    return typeof something === "string";
  }
  function isLatinLetter(char) {
    return isStr(char) && char.length === 1 && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
  }
  function findLongest(temp1) {
    if (isArr(temp1) && temp1.length) {
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
  function removeGappedFromMixedCases(temp1) {
    if (isArr(temp1) && temp1.length) {
      if (!(temp1.every(function (entObj) {
        return !entObj || !entObj.tempRes || !entObj.tempRes.gaps || !isArr(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
      }) || temp1.every(function (entObj) {
        return entObj && entObj.tempRes && entObj.tempRes.gaps && isArr(entObj.tempRes.gaps) && entObj.tempRes.gaps.length;
      }))) {
        return findLongest(temp1.filter(function (entObj) {
          return !entObj.tempRes.gaps || !isArr(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
        }));
      }
    }
    return findLongest(temp1);
  }
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
      return [rangeFrom, rangeTo, opts.decode ? rangeValDecoded : rangeValEncoded];
    },
    progressFn: null
  };
  var opts;
  if (originalOpts != null) {
    if (!isObj(originalOpts)) {
      throw new Error("string-fix-broken-named-entities: [THROW_ID_02] the second input argument must be a plain object! I was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (").concat(_typeof(originalOpts), "-type)"));
    } else {
      opts = Object.assign({}, defaults, originalOpts);
    }
  } else {
    opts = defaults;
  }
  if (opts.cb && typeof opts.cb !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_03] opts.cb must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.cb), ", equal to: ").concat(JSON.stringify(opts.cb, null, 4)));
  }
  if (opts.progressFn && typeof opts.progressFn !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_04] opts.progressFn must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.progressFn), ", equal to: ").concat(JSON.stringify(opts.progressFn, null, 4)));
  }
  var state_AmpersandNotNeeded = false;
  var nbspDefault = {
    nameStartsAt: null,
    ampersandNecessary: null,
    patience: 2,
    matchedN: null,
    matchedB: null,
    matchedS: null,
    matchedP: null,
    matchedSemicol: null
  };
  var nbsp = clone(nbspDefault);
  var nbspWipe = function nbspWipe() {
    nbsp = clone(nbspDefault);
  };
  var rangesArr2 = [];
  var smallestCharFromTheSetAt;
  var largestCharFromTheSetAt;
  var matchedLettersCount;
  var setOfValues;
  var percentageDone;
  var lastPercentageDone;
  var len = str.length + 1;
  var counter = 0;
  var doNothingUntil = null;
  var letterSeqStartAt = null;
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
        counter++;
        return "continue";
      }
    }
    matchedLettersCount = (nbsp.matchedN !== null ? 1 : 0) + (nbsp.matchedB !== null ? 1 : 0) + (nbsp.matchedS !== null ? 1 : 0) + (nbsp.matchedP !== null ? 1 : 0);
    setOfValues = [nbsp.matchedN, nbsp.matchedB, nbsp.matchedS, nbsp.matchedP].filter(function (val) {
      return val !== null;
    });
    smallestCharFromTheSetAt = Math.min.apply(Math, _toConsumableArray(setOfValues));
    largestCharFromTheSetAt = Math.max.apply(Math, _toConsumableArray(setOfValues));
    if (nbsp.nameStartsAt !== null && matchedLettersCount > 2 && (nbsp.matchedSemicol !== null || !nbsp.ampersandNecessary || isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[i]) || (isNotaLetter(str[nbsp.nameStartsAt - 1]) || isNotaLetter(str[i])) && largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4 || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && nbsp.matchedN + 1 === nbsp.matchedB && nbsp.matchedB + 1 === nbsp.matchedS && nbsp.matchedS + 1 === nbsp.matchedP) && (!str[i] || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && str[i] !== str[i - 1] || str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" || str[stringLeftRight.left(str, i)] === ";") && str[i] !== ";" && (str[i + 1] === undefined || str[stringLeftRight.right(str, i)] !== ";")) {
      if (str.slice(nbsp.nameStartsAt, i) !== "&nbsp;"
      ) {
          if (nbsp.nameStartsAt != null && i - nbsp.nameStartsAt === 5 && str.slice(nbsp.nameStartsAt, i) === "&nbsp") {
            rangesArr2.push({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "nbsp",
              rangeFrom: nbsp.nameStartsAt,
              rangeTo: i,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0"
            });
          } else {
            var chompedAmpFromLeft = stringLeftRight.chompLeft(str, nbsp.nameStartsAt, "&?", "a", "m", "p", ";?");
            var beginningOfTheRange = chompedAmpFromLeft ? chompedAmpFromLeft : nbsp.nameStartsAt;
            if (str.slice(beginningOfTheRange, i) !== "&nbsp;") {
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
      counter++;
      return "continue|outerloop";
    }
    if (str[i] && str[i - 1] === ";" && !stringLeftRight.leftSeq(str, i - 1, "a", "m", "p") && str[i] !== ";" && matchedLettersCount > 0) {
      nbspWipe();
      counter++;
      return "continue|outerloop";
    }
    if (letterSeqStartAt !== null && (!str[i] || str[i].trim().length && !isLatinLetter(str[i]))) {
      if (i > letterSeqStartAt + 1) {
        var potentialEntity = str.slice(letterSeqStartAt, i);
        var whatsOnTheLeft = stringLeftRight.left(str, letterSeqStartAt);
        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
          var firstChar = letterSeqStartAt;
          var secondChar = stringLeftRight.right(str, letterSeqStartAt);
          if (allNamedHtmlEntities.entStartsWith.hasOwnProperty(str[firstChar]) && allNamedHtmlEntities.entStartsWith[str[firstChar]].hasOwnProperty(str[secondChar])) {
            var tempEnt;
            var tempRes;
            var temp1 = allNamedHtmlEntities.entStartsWith[str[firstChar]][str[secondChar]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
              var tempRes = stringLeftRight.rightSeq.apply(void 0, [str, letterSeqStartAt - 1].concat(_toConsumableArray(oneOfKnownEntities.split(""))));
              if (tempRes && oneOfKnownEntities !== "nbsp") {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes: tempRes
                }]);
              }
              return gatheredSoFar;
            }, []);
            temp1 = removeGappedFromMixedCases(temp1);
            if (temp1) {
              var _temp = temp1;
              tempEnt = _temp.tempEnt;
              tempRes = _temp.tempRes;
            }
            if (tempEnt) {
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
        } else if (str[whatsOnTheLeft] !== "&" && str[i] && str[i] === ";") {
          var lastChar = stringLeftRight.left(str, i);
          var secondToLast = lastChar ? stringLeftRight.left(str, lastChar) : null;
          if (secondToLast !== null && allNamedHtmlEntities.entEndsWith.hasOwnProperty(str[lastChar]) && allNamedHtmlEntities.entEndsWith[str[lastChar]].hasOwnProperty(str[secondToLast])) {
            var _tempEnt;
            var _tempRes;
            var _temp2 = allNamedHtmlEntities.entEndsWith[str[lastChar]][str[secondToLast]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
              var tempRes = stringLeftRight.leftSeq.apply(void 0, [str, i].concat(_toConsumableArray(oneOfKnownEntities.split(""))));
              if (tempRes && oneOfKnownEntities !== "nbsp") {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes: tempRes
                }]);
              }
              return gatheredSoFar;
            }, []);
            _temp2 = removeGappedFromMixedCases(_temp2);
            if (_temp2) {
              var _temp3 = _temp2;
              _tempEnt = _temp3.tempEnt;
              _tempRes = _temp3.tempRes;
            }
            if (_tempEnt) {
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
          }
        }
      }
      letterSeqStartAt = null;
    }
    if (letterSeqStartAt === null && isLatinLetter(str[i])) {
      letterSeqStartAt = i;
    }
    if (str[i] === "a") {
      var singleAmpOnTheRight = stringLeftRight.rightSeq(str, i, "m", "p", ";");
      if (singleAmpOnTheRight) {
        var toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        var nextAmpOnTheRight = stringLeftRight.rightSeq(str, singleAmpOnTheRight.rightmostChar, "a", "m", "p", ";");
        if (nextAmpOnTheRight) {
          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          var temp;
          do {
            temp = stringLeftRight.rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");
            if (temp) {
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
            }
          } while (temp);
        }
        var firstCharThatFollows = stringLeftRight.right(str, toDeleteAllAmpEndHere - 1);
        var secondCharThatFollows = firstCharThatFollows ? stringLeftRight.right(str, firstCharThatFollows) : null;
        var matchedTemp;
        if (secondCharThatFollows && allNamedHtmlEntities.entStartsWith.hasOwnProperty(str[firstCharThatFollows]) && allNamedHtmlEntities.entStartsWith[str[firstCharThatFollows]].hasOwnProperty(str[secondCharThatFollows]) && allNamedHtmlEntities.entStartsWith[str[firstCharThatFollows]][str[secondCharThatFollows]].some(function (entity) {
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
            var rangeFrom = _whatsOnTheLeft + 1;
            var spaceReplacement = "";
            if (!str[rangeFrom].trim().length) {
              if (str[rangeFrom] === " ") {
                rangeFrom++;
              } else if (!"\n\r".includes(str[rangeFrom])) {
                spaceReplacement = " ";
              } else {
                rangeFrom = i;
              }
            }
            if (opts.cb) {
              rangesArr2.push({
                ruleName: "bad-named-html-entity-multiple-encoding",
                entityName: matchedTemp,
                rangeFrom: rangeFrom,
                rangeTo: doNothingUntil,
                rangeValEncoded: "".concat(spaceReplacement, "&").concat(matchedTemp, ";"),
                rangeValDecoded: "".concat(spaceReplacement).concat(allNamedHtmlEntities.decode("&".concat(matchedTemp, ";")))
              });
            }
          }
        }
      }
    }
    if (str[i] === "&") {
      if (nbsp.nameStartsAt && nbsp.nameStartsAt < i && (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)) {
        nbspWipe();
      }
      if (nbsp.nameStartsAt === null) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = i;
          nbsp.ampersandNecessary = false;
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      if (str[i - 1] === "i" && str[i + 1] === "s") {
        nbspWipe();
        counter++;
        return "continue|outerloop";
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
        return "continue|outerloop";
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
        return "continue|outerloop";
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      if (stringLeftRight.leftSeq(str, i, "t", "h", "i", "n", "s")) {
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
        return "continue|outerloop";
      }
    }
    if (str[i] === ";") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedSemicol = i;
        if (nbsp.matchedN &&
        !nbsp.matchedB && !nbsp.matchedS && !nbsp.matchedP || !nbsp.matchedN && nbsp.matchedB &&
        !nbsp.matchedS && !nbsp.matchedP || !nbsp.matchedN && !nbsp.matchedB && nbsp.matchedS &&
        !nbsp.matchedP || !nbsp.matchedN && !nbsp.matchedB && !nbsp.matchedS && nbsp.matchedP
        ) {
            nbspWipe();
          }
      }
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
      if (nbsp.nameStartsAt && (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)) {
        nbsp.ampersandNecessary = false;
      }
    }
    if (nbsp.nameStartsAt !== null && i > nbsp.nameStartsAt && str[i] && str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" && str[i] !== "&" && str[i] !== ";" && str[i] !== " ") {
      if (nbsp.patience) {
        nbsp.patience = nbsp.patience - 1;
      } else {
        nbspWipe();
        counter++;
        return "continue|outerloop";
      }
    }
    counter++;
  };
  outerloop: for (var i = 0; i < len; i++) {
    var _ret = _loop(i);
    switch (_ret) {
      case "continue":
        continue;
      case "continue|outerloop":
        continue outerloop;
    }
  }
  if (!rangesArr2.length) {
    return null;
  }
  var res = rangesArr2.filter(function (filteredRangeObj, i) {
    return rangesArr2.every(function (oneOfEveryObj, y) {
      return i === y || filteredRangeObj.rangeFrom !== oneOfEveryObj.rangeFrom || filteredRangeObj.rangeTo > oneOfEveryObj.rangeTo;
    });
  }).map(opts.cb);
  return res;
}

module.exports = stringFixBrokenNamedEntities;

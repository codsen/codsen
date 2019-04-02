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
var rangesMerge = _interopDefault(require('ranges-merge'));
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

function isStr(something) {
  return typeof something === "string";
}
function isLatinLetter(char) {
  return isStr(char) && char.length === 1 && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
}
function stringFixBrokenNamedEntities(str, originalOpts) {
  function isNotaLetter(str) {
    return !(typeof str === "string" && str.length === 1 && str.toUpperCase() !== str.toLowerCase());
  }
  if (typeof str !== "string") {
    throw new Error("string-fix-broken-named-entities: [THROW_ID_01] the first input argument must be string! It was given as:\n".concat(JSON.stringify(str, null, 4), " (").concat(_typeof(str), "-type)"));
  }
  var defaults = {
    decode: false,
    cb: null,
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
  var rangesArr = [];
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
  var _loop = function _loop(_i) {
    if (opts.progressFn) {
      percentageDone = Math.floor(counter / len * 100);
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    if (doNothingUntil) {
      if (doNothingUntil !== true && _i >= doNothingUntil) {
        doNothingUntil = null;
      } else {
        i = _i;
        return "continue";
      }
    }
    matchedLettersCount = (nbsp.matchedN !== null ? 1 : 0) + (nbsp.matchedB !== null ? 1 : 0) + (nbsp.matchedS !== null ? 1 : 0) + (nbsp.matchedP !== null ? 1 : 0);
    setOfValues = [nbsp.matchedN, nbsp.matchedB, nbsp.matchedS, nbsp.matchedP].filter(function (val) {
      return val !== null;
    });
    smallestCharFromTheSetAt = Math.min.apply(Math, _toConsumableArray(setOfValues));
    largestCharFromTheSetAt = Math.max.apply(Math, _toConsumableArray(setOfValues));
    if (nbsp.nameStartsAt !== null && matchedLettersCount > 2 && (nbsp.matchedSemicol !== null || !nbsp.ampersandNecessary || isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[_i]) || (isNotaLetter(str[nbsp.nameStartsAt - 1]) || isNotaLetter(str[_i])) && largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4 || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && nbsp.matchedN + 1 === nbsp.matchedB && nbsp.matchedB + 1 === nbsp.matchedS && nbsp.matchedS + 1 === nbsp.matchedP) && (!str[_i] || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && str[_i] !== str[_i - 1] || str[_i].toLowerCase() !== "n" && str[_i].toLowerCase() !== "b" && str[_i].toLowerCase() !== "s" && str[_i].toLowerCase() !== "p" || str[stringLeftRight.left(str, _i)] === ";") && str[_i] !== ";" && (str[_i + 1] === undefined || str[stringLeftRight.right(str, _i)] !== ";")) {
      if (nbsp.ampersandNecessary !== false && str.slice(nbsp.nameStartsAt, _i) !== "&nbsp;" || nbsp.ampersandNecessary === false && str.slice(Math.min(nbsp.matchedN, nbsp.matchedB, nbsp.matchedS, nbsp.matchedP), _i) !== "nbsp;") {
        if (nbsp.nameStartsAt != null && _i - nbsp.nameStartsAt === 5 && str.slice(nbsp.nameStartsAt, _i) === "&nbsp" && !opts.decode) {
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "nbsp",
              rangeFrom: _i,
              rangeTo: _i,
              rangeValEncoded: ";",
              rangeValDecoded: ";"
            }));
          }
          rangesArr.push([_i, _i, ";"]);
        } else {
          var chompedAmpFromLeft = stringLeftRight.chompLeft(str, nbsp.nameStartsAt, "&?", "a", "m", "p", ";?");
          var beginningOfTheRange = chompedAmpFromLeft ? chompedAmpFromLeft : nbsp.nameStartsAt;
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-malformed-nbsp",
              entityName: "nbsp",
              rangeFrom: beginningOfTheRange,
              rangeTo: _i,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0"
            }));
          }
          rangesArr.push([beginningOfTheRange, _i, opts.decode ? "\xA0" : "&nbsp;"]);
        }
      }
      nbspWipe();
      i = _i;
      return "continue|outerloop";
    }
    if (str[_i] && str[_i - 1] === ";" && !stringLeftRight.leftSeq(str, _i - 1, "a", "m", "p") && str[_i] !== ";" && matchedLettersCount > 0) {
      nbspWipe();
      i = _i;
      return "continue|outerloop";
    }
    if (letterSeqStartAt !== null && (!str[_i] || str[_i].trim().length && !isLatinLetter(str[_i]))) {
      if (_i > letterSeqStartAt + 1 && str[_i] !== "&") {
        var potentialEntity = str.slice(letterSeqStartAt, _i);
        var whatsOnTheLeft = str[stringLeftRight.left(str, letterSeqStartAt)];
        if (whatsOnTheLeft === "&" && (!str[_i] || str[_i] !== ";")) ; else if (whatsOnTheLeft !== "&" && str[_i] && str[_i] === ";") {
          var lastChar = stringLeftRight.left(str, _i);
          var secondToLast = lastChar ? stringLeftRight.left(str, lastChar) : null;
          var tempEnt;
          var tempRes;
          if (secondToLast !== null && allNamedHtmlEntities.entEndsWith.hasOwnProperty(str[lastChar]) && allNamedHtmlEntities.entEndsWith[str[lastChar]].hasOwnProperty(str[secondToLast]) && allNamedHtmlEntities.entEndsWith[str[lastChar]][str[secondToLast]].some(function (oneOfKnownEntities) {
            var temp = stringLeftRight.leftSeq.apply(void 0, [str, _i].concat(_toConsumableArray(oneOfKnownEntities.split(""))));
            if (temp && oneOfKnownEntities !== "nbsp") {
              tempEnt = oneOfKnownEntities;
              tempRes = temp;
              i = _i;
              return true;
            }
          })) {
            var decodedEntity = allNamedHtmlEntities.decode("&".concat(tempEnt, ";"));
            if (opts.cb) {
              rangesArr2.push(opts.cb({
                ruleName: "bad-named-html-entity-malformed-".concat(tempEnt),
                entityName: tempEnt,
                rangeFrom: tempRes.leftmostChar,
                rangeTo: _i + 1,
                rangeValEncoded: "&".concat(tempEnt, ";"),
                rangeValDecoded: decodedEntity
              }));
            }
            rangesArr.push([tempRes.leftmostChar, _i + 1, opts.decode ? decodedEntity : "&".concat(tempEnt, ";")]);
          }
        }
      }
      letterSeqStartAt = null;
    }
    if (letterSeqStartAt === null && isLatinLetter(str[_i])) {
      letterSeqStartAt = _i;
    }
    if (str[_i] === "a") {
      var singleAmpOnTheRight = stringLeftRight.rightSeq(str, _i, "m", "p", ";");
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
          if (str.startsWith("".concat(entity, ";"), firstCharThatFollows)) {
            matchedTemp = entity;
            i = _i;
            return true;
          }
        })) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1;
          var _whatsOnTheLeft = stringLeftRight.left(str, _i);
          if (str[_whatsOnTheLeft] === "&") {
            if (opts.cb) {
              rangesArr2.push(opts.cb({
                ruleName: "bad-named-html-entity-multiple-encoding",
                entityName: "amp",
                rangeFrom: _whatsOnTheLeft + 1,
                rangeTo: firstCharThatFollows,
                rangeValEncoded: null,
                rangeValDecoded: null
              }));
            }
            rangesArr.push([_whatsOnTheLeft + 1, firstCharThatFollows]);
          } else if (_whatsOnTheLeft) {
            var rangeFrom = _whatsOnTheLeft + 1;
            var spaceReplacement = "";
            if (!str[rangeFrom].trim().length) {
              if (str[rangeFrom] === " ") {
                rangeFrom++;
              } else if (!"\n\r".includes(str[rangeFrom])) {
                spaceReplacement = " ";
              } else {
                rangeFrom = _i;
              }
            }
            if (opts.cb) {
              rangesArr2.push(opts.cb({
                ruleName: "bad-named-html-entity-multiple-encoding",
                entityName: "amp",
                rangeFrom: rangeFrom,
                rangeTo: firstCharThatFollows,
                rangeValEncoded: "".concat(spaceReplacement, "&"),
                rangeValDecoded: "".concat(spaceReplacement, "&")
              }));
            }
            rangesArr.push([rangeFrom, firstCharThatFollows, "".concat(spaceReplacement, "&")]);
          }
        }
      }
    }
    if (str[_i] === "&") {
      if (nbsp.nameStartsAt && nbsp.nameStartsAt < _i && (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)) {
        nbspWipe();
      }
      if (nbsp.nameStartsAt === null) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = _i;
          nbsp.ampersandNecessary = false;
        }
      } else {
        if (!nbsp.ampersandNecessary) {
          var endingIndex = _i + 1;
          var whatsOnTheRight = stringLeftRight.right(str, _i);
          if (str[whatsOnTheRight] === "&") {
            for (var y = whatsOnTheRight; y < len; y++) {
              if (str[y].trim().length && str[y] !== "&") {
                endingIndex = y;
                doNothingUntil = y;
                break;
              }
            }
          }
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-duplicate-ampersand",
              entityName: "nbsp",
              rangeFrom: _i,
              rangeTo: endingIndex,
              rangeValEncoded: null,
              rangeValDecoded: null
            }));
          }
          rangesArr.push([_i, endingIndex]);
        }
      }
      if (str[_i + 1] === "a" && str[_i + 2] === "n" && str[_i + 3] === "g") {
        if (str[_i + 4] !== "s" && str[_i + 4] !== ";") {
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "ang",
              rangeFrom: _i + 4,
              rangeTo: _i + 4,
              rangeValEncoded: "&ang;",
              rangeValDecoded: "\u2220"
            }));
          }
          rangesArr.push([_i, _i + 4, opts.decode ? "\u2220" : "&ang;"]);
          _i += 3;
          i = _i;
          return "continue|outerloop";
        } else if (str[_i + 4] === "s" && str[_i + 5] === "t" && str[_i + 6] !== ";") {
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "angst",
              rangeFrom: _i + 6,
              rangeTo: _i + 6,
              rangeValEncoded: "&angst;",
              rangeValDecoded: "\xC5"
            }));
          }
          rangesArr.push([_i, _i + 6, opts.decode ? "\xC5" : "&angst;"]);
          _i += 5;
          i = _i;
          return "continue|outerloop";
        }
      } else if (str[_i + 1] === "p" && str[_i + 2] === "i") {
        if (str[_i + 3] !== "v" && str[_i + 3] !== ";") {
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "pi",
              rangeFrom: _i + 3,
              rangeTo: _i + 3,
              rangeValEncoded: "&pi;",
              rangeValDecoded: "\u03C0"
            }));
          }
          rangesArr.push([_i, _i + 3, opts.decode ? "\u03C0" : "&pi;"]);
          _i += 3;
          i = _i;
          return "continue|outerloop";
        } else if (str[_i + 3] === "v" && str[_i + 4] !== ";") {
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "piv",
              rangeFrom: _i + 4,
              rangeTo: _i + 4,
              rangeValEncoded: "&piv;",
              rangeValDecoded: "\u03D6"
            }));
          }
          rangesArr.push([_i, _i + 4, opts.decode ? "\u03D6" : "&piv;"]);
          _i += 3;
          i = _i;
          return "continue|outerloop";
        }
      } else if (str[_i + 1] === "P" && str[_i + 2] === "i" && str[_i + 3] !== ";") {
        if (opts.cb) {
          rangesArr2.push(opts.cb({
            ruleName: "bad-named-html-entity-missing-semicolon",
            entityName: "Pi",
            rangeFrom: _i + 3,
            rangeTo: _i + 3,
            rangeValEncoded: "&Pi;",
            rangeValDecoded: "\u03A0"
          }));
        }
        rangesArr.push([_i, _i + 3, opts.decode ? "\u03A0" : "&Pi;"]);
        _i += 2;
        i = _i;
        return "continue|outerloop";
      } else if (str[_i + 1] === "s") {
        if (str[_i + 2] === "i" && str[_i + 3] === "g" && str[_i + 4] === "m" && str[_i + 5] === "a" && str[_i + 6] !== ";" && str[_i + 6] !== "f") {
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "sigma",
              rangeFrom: _i + 6,
              rangeTo: _i + 6,
              rangeValEncoded: "&sigma;",
              rangeValDecoded: "\u03C3"
            }));
          }
          rangesArr.push([_i, _i + 6, opts.decode ? "\u03C3" : "&sigma;"]);
          _i += 5;
          i = _i;
          return "continue|outerloop";
        } else if (str[_i + 2] === "u" && str[_i + 3] === "b" && str[_i + 4] !== ";" && str[_i + 4] !== "e") {
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "sub",
              rangeFrom: _i + 4,
              rangeTo: _i + 4,
              rangeValEncoded: "&sub;",
              rangeValDecoded: "\u2282"
            }));
          }
          rangesArr.push([_i, _i + 4, opts.decode ? "\u2282" : "&sub;"]);
          _i += 3;
          i = _i;
          return "continue|outerloop";
        } else if (str[_i + 2] === "u" && str[_i + 3] === "p" && str[_i + 4] !== "f" && str[_i + 4] !== "e" && str[_i + 4] !== "1" && str[_i + 4] !== "2" && str[_i + 4] !== "3" && str[_i + 4] !== ";") {
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "sup",
              rangeFrom: _i + 4,
              rangeTo: _i + 4,
              rangeValEncoded: "&sup;",
              rangeValDecoded: "\u2283"
            }));
          }
          rangesArr.push([_i, _i + 4, opts.decode ? "\u2283" : "&sup;"]);
          _i += 3;
          i = _i;
          return "continue|outerloop";
        }
      } else if (str[_i + 1] === "t") {
        if (str[_i + 2] === "h" && str[_i + 3] === "e" && str[_i + 4] === "t" && str[_i + 5] === "a" && str[_i + 6] !== "s" && str[_i + 6] !== ";") {
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "theta",
              rangeFrom: _i + 6,
              rangeTo: _i + 6,
              rangeValEncoded: "&theta;",
              rangeValDecoded: "\u03B8"
            }));
          }
          rangesArr.push([_i, _i + 6, opts.decode ? "\u03B8" : "&theta;"]);
          _i += 5;
          i = _i;
          return "continue|outerloop";
        } else if (str[_i + 2] === "h" && str[_i + 3] === "i" && str[_i + 4] === "n" && str[_i + 5] === "s" && str[_i + 6] === "p" && str[_i + 7] !== ";") {
          if (opts.cb) {
            rangesArr2.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "thinsp",
              rangeFrom: _i + 7,
              rangeTo: _i + 7,
              rangeValEncoded: "&thinsp;",
              rangeValDecoded: "\u2009"
            }));
          }
          rangesArr.push([_i, _i + 7, opts.decode ? "\u2009" : "&thinsp;"]);
          _i += 6;
          i = _i;
          return "continue|outerloop";
        }
      }
    }
    if (str[_i] && str[_i].toLowerCase() === "n") {
      if (str[_i - 1] === "i" && str[_i + 1] === "s") {
        nbspWipe();
        i = _i;
        return "continue|outerloop";
      }
      if (nbsp.matchedN === null) {
        nbsp.matchedN = _i;
      }
      if (nbsp.nameStartsAt === null) {
        nbsp.nameStartsAt = _i;
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
      }
    }
    if (str[_i] && str[_i].toLowerCase() === "b") {
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedB === null) {
          nbsp.matchedB = _i;
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        nbsp.nameStartsAt = _i;
        nbsp.matchedB = _i;
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
      } else {
        nbspWipe();
        i = _i;
        return "continue|outerloop";
      }
    }
    if (str[_i] && str[_i].toLowerCase() === "s") {
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedS === null) {
          nbsp.matchedS = _i;
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        nbsp.nameStartsAt = _i;
        nbsp.matchedS = _i;
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
      } else {
        nbspWipe();
        i = _i;
        return "continue|outerloop";
      }
    }
    if (str[_i] && str[_i].toLowerCase() === "p") {
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedP === null) {
          nbsp.matchedP = _i;
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        nbsp.nameStartsAt = _i;
        nbsp.matchedP = _i;
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
      } else {
        nbspWipe();
        i = _i;
        return "continue|outerloop";
      }
    }
    if (str[_i] === ";") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedSemicol = _i;
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
    if (nbsp.nameStartsAt !== null && _i > nbsp.nameStartsAt && str[_i] && str[_i].toLowerCase() !== "n" && str[_i].toLowerCase() !== "b" && str[_i].toLowerCase() !== "s" && str[_i].toLowerCase() !== "p" && str[_i] !== "&" && str[_i] !== ";" && str[_i] !== " ") {
      if (nbsp.patience) {
        nbsp.patience = nbsp.patience - 1;
      } else {
        nbspWipe();
        i = _i;
        return "continue|outerloop";
      }
    }
    counter++;
    i = _i;
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
  if (!rangesArr.length) {
    return null;
  }
  if (opts.cb) {
    return rangesArr2.filter(function (el, i) {
      if (rangesArr.some(function (range, i2) {
        if (i === i2) {
          return false;
        }
        if (rangesArr[i][0] >= range[0] && rangesArr[i][1] <= range[1]) {
          return true;
        }
        return false;
      })) {
        return false;
      }
      return true;
    });
  }
  return rangesMerge(rangesArr, {
    joinRangesThatTouchEdges: false
  });
}

module.exports = stringFixBrokenNamedEntities;

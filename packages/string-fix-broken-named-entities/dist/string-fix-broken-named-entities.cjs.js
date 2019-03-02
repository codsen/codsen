/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 1.6.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));
var rangesMerge = _interopDefault(require('ranges-merge'));
var clone = _interopDefault(require('lodash.clonedeep'));

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
  var smallestCharFromTheSetAt;
  var largestCharFromTheSetAt;
  var matchedLettersCount;
  var setOfValues;
  var percentageDone;
  var lastPercentageDone;
  var len = str.length + 1;
  var counter = 0;
  outerloop: for (var i = 0; i < len; i++) {
    if (opts.progressFn) {
      percentageDone = Math.floor(counter / len * 100);
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    matchedLettersCount = (nbsp.matchedN !== null ? 1 : 0) + (nbsp.matchedB !== null ? 1 : 0) + (nbsp.matchedS !== null ? 1 : 0) + (nbsp.matchedP !== null ? 1 : 0);
    setOfValues = [nbsp.matchedN, nbsp.matchedB, nbsp.matchedS, nbsp.matchedP].filter(function (val) {
      return val !== null;
    });
    smallestCharFromTheSetAt = Math.min.apply(Math, _toConsumableArray(setOfValues));
    largestCharFromTheSetAt = Math.max.apply(Math, _toConsumableArray(setOfValues));
    if (nbsp.nameStartsAt !== null && matchedLettersCount > 2 && (nbsp.matchedSemicol !== null || !nbsp.ampersandNecessary || isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[i]) || (isNotaLetter(str[nbsp.nameStartsAt - 1]) || isNotaLetter(str[i])) && largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4 || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && nbsp.matchedN + 1 === nbsp.matchedB && nbsp.matchedB + 1 === nbsp.matchedS && nbsp.matchedS + 1 === nbsp.matchedP) && (!str[i] || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && str[i] !== str[i - 1] || str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" || str[i - 1] === ";") && str[i] !== ";" && (str[i + 1] === undefined || str[i + 1] !== ";")) {
      if (str.slice(nbsp.nameStartsAt, i) !== "&nbsp;") {
        if (nbsp.nameStartsAt != null && i - nbsp.nameStartsAt === 5 && str.slice(nbsp.nameStartsAt, i) === "&nbsp" && !opts.decode) {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "nbsp",
              rangeFrom: i,
              rangeTo: i,
              rangeValEncoded: ";",
              rangeValDecoded: ";"
            }));
          } else {
            rangesArr.push([i, i, ";"]);
          }
        } else {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-malformed-nbsp",
              entityName: "nbsp",
              rangeFrom: nbsp.nameStartsAt,
              rangeTo: i,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0"
            }));
          } else {
            rangesArr.push([nbsp.nameStartsAt, i, opts.decode ? "\xA0" : "&nbsp;"]);
          }
        }
      }
      nbspWipe();
      continue outerloop;
    }
    if (str[i] && str[i - 1] === ";" && str[i] !== ";" && matchedLettersCount > 0) {
      nbspWipe();
      continue outerloop;
    }
    if (str[i] === "&") {
      if (str[i + 1] === "a" && str[i + 2] === "m" && str[i + 3] === "p" && str[i + 4] === ";") {
        if (nbsp.nameStartsAt === null) {
          nbsp.nameStartsAt = i;
        }
        state_AmpersandNotNeeded = true;
        var endingOfAmpRepetition = i + 5;
        while (str[endingOfAmpRepetition] === "a" && str[endingOfAmpRepetition + 1] === "m" && str[endingOfAmpRepetition + 2] === "p" && str[endingOfAmpRepetition + 3] === ";") {
          endingOfAmpRepetition += 4;
        }
        if (opts.cb) {
          rangesArr.push(opts.cb({
            ruleName: "bad-named-html-entity-amp-repetitions",
            entityName: "amp",
            rangeFrom: i + 1,
            rangeTo: endingOfAmpRepetition,
            rangeValEncoded: null,
            rangeValDecoded: null
          }));
        } else {
          rangesArr.push([i + 1, endingOfAmpRepetition]);
        }
        i = endingOfAmpRepetition - 1;
        continue outerloop;
      }
      if (nbsp.nameStartsAt === null) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = i;
          nbsp.ampersandNecessary = false;
        }
      }
      if (str[i + 1] === "a" && str[i + 2] === "n" && str[i + 3] === "g") {
        if (str[i + 4] !== "s" && str[i + 4] !== ";") {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "ang",
              rangeFrom: i + 4,
              rangeTo: i + 4,
              rangeValEncoded: "&ang;",
              rangeValDecoded: "\u2220"
            }));
          } else {
            rangesArr.push([i, i + 4, opts.decode ? "\u2220" : "&ang;"]);
          }
          i += 3;
          continue outerloop;
        } else if (str[i + 4] === "s" && str[i + 5] === "t" && str[i + 6] !== ";") {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "angst",
              rangeFrom: i + 6,
              rangeTo: i + 6,
              rangeValEncoded: "&angst;",
              rangeValDecoded: "\xC5"
            }));
          } else {
            rangesArr.push([i, i + 6, opts.decode ? "\xC5" : "&angst;"]);
          }
          i += 5;
          continue outerloop;
        }
      } else if (str[i + 1] === "p" && str[i + 2] === "i") {
        if (str[i + 3] !== "v" && str[i + 3] !== ";") {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "pi",
              rangeFrom: i + 3,
              rangeTo: i + 3,
              rangeValEncoded: "&pi;",
              rangeValDecoded: "\u03C0"
            }));
          } else {
            rangesArr.push([i, i + 3, opts.decode ? "\u03C0" : "&pi;"]);
          }
          i += 3;
          continue outerloop;
        } else if (str[i + 3] === "v" && str[i + 4] !== ";") {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "piv",
              rangeFrom: i + 4,
              rangeTo: i + 4,
              rangeValEncoded: "&piv;",
              rangeValDecoded: "\u03D6"
            }));
          } else {
            rangesArr.push([i, i + 4, opts.decode ? "\u03D6" : "&piv;"]);
          }
          i += 3;
          continue outerloop;
        }
      } else if (str[i + 1] === "P" && str[i + 2] === "i" && str[i + 3] !== ";") {
        if (opts.cb) {
          rangesArr.push(opts.cb({
            ruleName: "bad-named-html-entity-missing-semicolon",
            entityName: "Pi",
            rangeFrom: i + 3,
            rangeTo: i + 3,
            rangeValEncoded: "&Pi;",
            rangeValDecoded: "\u03A0"
          }));
        } else {
          rangesArr.push([i, i + 3, opts.decode ? "\u03A0" : "&Pi;"]);
        }
        i += 2;
        continue outerloop;
      } else if (str[i + 1] === "s") {
        if (str[i + 2] === "i" && str[i + 3] === "g" && str[i + 4] === "m" && str[i + 5] === "a" && str[i + 6] !== ";" && str[i + 6] !== "f") {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "sigma",
              rangeFrom: i + 6,
              rangeTo: i + 6,
              rangeValEncoded: "&sigma;",
              rangeValDecoded: "\u03C3"
            }));
          } else {
            rangesArr.push([i, i + 6, opts.decode ? "\u03C3" : "&sigma;"]);
          }
          i += 5;
          continue outerloop;
        } else if (str[i + 2] === "u" && str[i + 3] === "b" && str[i + 4] !== ";" && str[i + 4] !== "e") {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "sub",
              rangeFrom: i + 4,
              rangeTo: i + 4,
              rangeValEncoded: "&sub;",
              rangeValDecoded: "\u2282"
            }));
          } else {
            rangesArr.push([i, i + 4, opts.decode ? "\u2282" : "&sub;"]);
          }
          i += 3;
          continue outerloop;
        } else if (str[i + 2] === "u" && str[i + 3] === "p" && str[i + 4] !== "f" && str[i + 4] !== "e" && str[i + 4] !== "1" && str[i + 4] !== "2" && str[i + 4] !== "3" && str[i + 4] !== ";") {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "sup",
              rangeFrom: i + 4,
              rangeTo: i + 4,
              rangeValEncoded: "&sup;",
              rangeValDecoded: "\u2283"
            }));
          } else {
            rangesArr.push([i, i + 4, opts.decode ? "\u2283" : "&sup;"]);
          }
          i += 3;
          continue outerloop;
        }
      } else if (str[i + 1] === "t") {
        if (str[i + 2] === "h" && str[i + 3] === "e" && str[i + 4] === "t" && str[i + 5] === "a" && str[i + 6] !== "s" && str[i + 6] !== ";") {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "theta",
              rangeFrom: i + 6,
              rangeTo: i + 6,
              rangeValEncoded: "&theta;",
              rangeValDecoded: "\u03B8"
            }));
          } else {
            rangesArr.push([i, i + 6, opts.decode ? "\u03B8" : "&theta;"]);
          }
          i += 5;
          continue outerloop;
        } else if (str[i + 2] === "h" && str[i + 3] === "i" && str[i + 4] === "n" && str[i + 5] === "s" && str[i + 6] === "p" && str[i + 7] !== ";") {
          if (opts.cb) {
            rangesArr.push(opts.cb({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "thinsp",
              rangeFrom: i + 7,
              rangeTo: i + 7,
              rangeValEncoded: "&thinsp;",
              rangeValDecoded: "\u2009"
            }));
          } else {
            rangesArr.push([i, i + 7, opts.decode ? "\u2009" : "&thinsp;"]);
          }
          i += 6;
          continue outerloop;
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      if (str[i - 1] === "i" && str[i + 1] === "s") {
        nbspWipe();
        continue outerloop;
      }
      nbsp.matchedN = i;
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
        nbsp.matchedB = i;
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
        continue outerloop;
      }
    }
    if (str[i] && str[i].toLowerCase() === "s") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedS = i;
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
        continue outerloop;
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedP = i;
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
        continue outerloop;
      }
    }
    if (str[i] === ";") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedSemicol = i;
      }
    }
    if (str[i] && str[i].trim().length === 0 && nbsp.nameStartsAt !== null) {
      nbspWipe();
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
    }
    if (nbsp.nameStartsAt !== null && i > nbsp.nameStartsAt && str[i] && str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" && str[i] !== "&" && str[i] !== ";") {
      if (nbsp.patience) {
        nbsp.patience = nbsp.patience - 1;
      } else {
        nbspWipe();
        continue outerloop;
      }
    }
    counter++;
  }
  return rangesArr.length ? opts.cb ? rangesArr : rangesMerge(rangesArr) : null;
}

module.exports = stringFixBrokenNamedEntities;

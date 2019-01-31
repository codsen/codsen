/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 1.6.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rangesMerge = _interopDefault(require('ranges-merge'));
var clone = _interopDefault(require('lodash.clonedeep'));
var isObj = _interopDefault(require('lodash.isplainobject'));

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
    decode: false
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
  outerloop: for (var i = 0, len = str.length + 1; i < len; i++) {
    matchedLettersCount = (nbsp.matchedN !== null ? 1 : 0) + (nbsp.matchedB !== null ? 1 : 0) + (nbsp.matchedS !== null ? 1 : 0) + (nbsp.matchedP !== null ? 1 : 0);
    setOfValues = [nbsp.matchedN, nbsp.matchedB, nbsp.matchedS, nbsp.matchedP].filter(function (val) {
      return val !== null;
    });
    smallestCharFromTheSetAt = Math.min.apply(Math, _toConsumableArray(setOfValues));
    largestCharFromTheSetAt = Math.max.apply(Math, _toConsumableArray(setOfValues));
    if (nbsp.nameStartsAt !== null && matchedLettersCount > 2 && (nbsp.matchedSemicol !== null || !nbsp.ampersandNecessary || isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[i]) || (isNotaLetter(str[nbsp.nameStartsAt - 1]) || isNotaLetter(str[i])) && largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4 || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && nbsp.matchedN + 1 === nbsp.matchedB && nbsp.matchedB + 1 === nbsp.matchedS && nbsp.matchedS + 1 === nbsp.matchedP) && (!str[i] || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && str[i] !== str[i - 1] || str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" || str[i - 1] === ";") && str[i] !== ";" && (str[i + 1] === undefined || str[i + 1] !== ";")) {
      if (str.slice(nbsp.nameStartsAt, i) !== "&nbsp;") {
        rangesArr.push([nbsp.nameStartsAt, i, opts.decode ? "\xA0" : "&nbsp;"]);
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
        rangesArr.push([i + 1, endingOfAmpRepetition]);
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
          rangesArr.push([i, i + 4, opts.decode ? "\u2220" : "&ang;"]);
          i += 3;
          continue outerloop;
        } else if (str[i + 4] === "s" && str[i + 5] === "t" && str[i + 6] !== ";") {
          rangesArr.push([i, i + 6, opts.decode ? "\xC5" : "&angst;"]);
          i += 5;
          continue outerloop;
        }
      } else if (str[i + 1] === "p" && str[i + 2] === "i") {
        if (str[i + 3] !== "v" && str[i + 3] !== ";") {
          rangesArr.push([i, i + 3, opts.decode ? "\u03C0" : "&pi;"]);
          i += 3;
          continue outerloop;
        } else if (str[i + 3] === "v" && str[i + 4] !== ";") {
          rangesArr.push([i, i + 4, opts.decode ? "\u03D6" : "&piv;"]);
          i += 3;
          continue outerloop;
        }
      } else if (str[i + 1] === "P" && str[i + 2] === "i" && str[i + 3] !== ";") {
        rangesArr.push([i, i + 3, opts.decode ? "\u03A0" : "&Pi;"]);
        i += 2;
        continue outerloop;
      } else if (str[i + 1] === "s") {
        if (str[i + 2] === "i" && str[i + 3] === "g" && str[i + 4] === "m" && str[i + 5] === "a" && str[i + 6] !== ";" && str[i + 6] !== "f") {
          rangesArr.push([i, i + 6, opts.decode ? "\u03C3" : "&sigma;"]);
          i += 5;
          continue outerloop;
        } else if (str[i + 2] === "u" && str[i + 3] === "b" && str[i + 4] !== ";" && str[i + 4] !== "e") {
          rangesArr.push([i, i + 4, opts.decode ? "\u2282" : "&sub;"]);
          i += 3;
          continue outerloop;
        } else if (str[i + 2] === "u" && str[i + 3] === "p" && str[i + 4] !== "f" && str[i + 4] !== "e" && str[i + 4] !== "1" && str[i + 4] !== "2" && str[i + 4] !== "3" && str[i + 4] !== ";") {
          rangesArr.push([i, i + 4, opts.decode ? "\u2283" : "&sup;"]);
          i += 3;
          continue outerloop;
        }
      } else if (str[i + 1] === "t") {
        if (str[i + 2] === "h" && str[i + 3] === "e" && str[i + 4] === "t" && str[i + 5] === "a" && str[i + 6] !== "s" && str[i + 6] !== ";") {
          rangesArr.push([i, i + 6, opts.decode ? "\u03B8" : "&theta;"]);
          i += 5;
          continue outerloop;
        } else if (str[i + 2] === "h" && str[i + 3] === "i" && str[i + 4] === "n" && str[i + 5] === "s" && str[i + 6] === "p" && str[i + 7] !== ";") {
          rangesArr.push([i, i + 7, opts.decode ? "\u2009" : "&thinsp;"]);
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
  }
  return rangesArr.length ? rangesMerge(rangesArr) : null;
}

module.exports = stringFixBrokenNamedEntities;

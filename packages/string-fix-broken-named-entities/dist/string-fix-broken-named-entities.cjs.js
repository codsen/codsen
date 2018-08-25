'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rangesMerge = _interopDefault(require('ranges-merge'));

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

function stringFixBrokenNamedEntities(str) {
  var state_AmpersandNotNeeded = false;
  var nbspDefault = {
    nameStartsAt: null,
    ampersandNecessary: null,
    patience: 1,
    matchedN: false,
    matchedB: false,
    matchedS: false,
    matchedP: false
  };
  var nbsp = Object.assign({}, nbspDefault);
  var nbspWipe = function nbspWipe() {
    nbsp = nbspDefault;
  };
  if (typeof str !== "string") {
    throw new Error("string-fix-broken-named-entities: [THROW_ID_01] the input must be string! Currently we've been given ".concat(_typeof(str), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
  }
  var rangesArr = [];
  outerloop: for (var i = 0, len = str.length + 1; i < len; i++) {
    if (nbsp.nameStartsAt && nbsp.matchedN && nbsp.matchedB && nbsp.matchedS && nbsp.matchedP && str[i] !== ";") {
      rangesArr.push([nbsp.nameStartsAt, i, "&nbsp;"]);
      nbspWipe();
    }
    if (str[i] === "&") {
      if (str[i + 1] === "a" && str[i + 2] === "m" && str[i + 3] === "p" && str[i + 4] === ";") {
        state_AmpersandNotNeeded = true;
        var endingOfAmpRepetition = i + 5;
        while (str[endingOfAmpRepetition] === "a" && str[endingOfAmpRepetition + 1] === "m" && str[endingOfAmpRepetition + 2] === "p" && str[endingOfAmpRepetition + 3] === ";") {
          endingOfAmpRepetition += 4;
        }
        rangesArr.push([i + 1, endingOfAmpRepetition]);
        i = endingOfAmpRepetition - 1;
        continue outerloop;
      }
      if (!nbsp.nameStartsAt) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = i;
          nbsp.ampersandNecessary = false;
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      nbsp.matchedN = true;
      if (!nbsp.nameStartsAt) {
        nbsp.nameStartsAt = i;
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "b") {
      if (nbsp.nameStartsAt) {
        nbsp.matchedB = true;
      }
    }
    if (str[i] && str[i].toLowerCase() === "s") {
      if (nbsp.nameStartsAt) {
        nbsp.matchedS = true;
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      if (nbsp.nameStartsAt) {
        nbsp.matchedP = true;
      }
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
    }
  }
  return rangesArr.length ? rangesMerge(rangesArr) : null;
}

module.exports = stringFixBrokenNamedEntities;

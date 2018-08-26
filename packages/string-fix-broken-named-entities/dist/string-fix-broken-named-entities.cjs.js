'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

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
  var nbsp = clone(nbspDefault);
  var nbspWipe = function nbspWipe() {
    nbsp = clone(nbspDefault);
  };
  if (typeof str !== "string") {
    throw new Error("string-fix-broken-named-entities: [THROW_ID_01] the input must be string! Currently we've been given ".concat(_typeof(str), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
  }
  var rangesArr = [];
  outerloop: for (var i = 0, len = str.length + 1; i < len; i++) {
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(i, " ] = ", "\x1B[".concat(31, "m", str[i] ? str[i].trim() === "" ? str[i] === null ? "null" : str[i] === "\n" ? "line break" : str[i] === "\t" ? "tab" : str[i] === " " ? "space" : "???" : str[i] : "undefined", "\x1B[", 39, "m")), "\x1B[", 39, "m \x1B[", 36, "m", "===============================", "\x1B[", 39, "m"));
    if (nbsp.nameStartsAt !== null && nbsp.matchedN && nbsp.matchedB && nbsp.matchedS && nbsp.matchedP && str[i] !== ";") {
      console.log("\x1B[".concat(32, "m", "130 ENDING OF AN NBSP; PUSH [".concat(nbsp.nameStartsAt, ", ").concat(i, ", \"&nbsp;\"]"), "\x1B[", 39, "m"));
      rangesArr.push([nbsp.nameStartsAt, i, "&nbsp;"]);
      nbspWipe();
      console.log("137 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m"), ", now = ", JSON.stringify(nbsp, null, 4)));
    }
    if (str[i] === "&") {
      console.log("159 & caught");
      if (str[i + 1] === "a" && str[i + 2] === "m" && str[i + 3] === "p" && str[i + 4] === ";") {
        state_AmpersandNotNeeded = true;
        var endingOfAmpRepetition = i + 5;
        while (str[endingOfAmpRepetition] === "a" && str[endingOfAmpRepetition + 1] === "m" && str[endingOfAmpRepetition + 2] === "p" && str[endingOfAmpRepetition + 3] === ";") {
          endingOfAmpRepetition += 4;
        }
        rangesArr.push([i + 1, endingOfAmpRepetition]);
        console.log("183 PUSH \x1B[".concat(33, "m", "[".concat(i + 1, ", ").concat(endingOfAmpRepetition, "]"), "\x1B[", 39, "m"));
        i = endingOfAmpRepetition - 1;
        continue outerloop;
      }
      if (nbsp.nameStartsAt === null) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = i;
          console.log("200 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
          nbsp.ampersandNecessary = false;
          console.log("206 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = ", nbsp.ampersandNecessary));
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      console.log("216 n caught");
      nbsp.matchedN = true;
      if (nbsp.nameStartsAt === null) {
        nbsp.nameStartsAt = i;
        console.log("222 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log("231 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = ", nbsp.ampersandNecessary));
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "b") {
      console.log("241 b caught");
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedB = true;
        console.log("246 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedB", "\x1B[", 39, "m"), " = ", nbsp.matchedB));
      }
    }
    if (str[i] && str[i].toLowerCase() === "s") {
      console.log("255 s caught");
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedS = true;
        console.log("260 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedS", "\x1B[", 39, "m"), " = ", nbsp.matchedS));
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      console.log("269 p caught");
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedP = true;
        console.log("274 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedP", "\x1B[", 39, "m"), " = ", nbsp.matchedP));
      }
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
      console.log("298 SET ".concat("\x1B[".concat(33, "m", "state_AmpersandNotNeeded", "\x1B[", 39, "m"), " = ", JSON.stringify(state_AmpersandNotNeeded, null, 4)));
    }
    console.log("---------------");
    console.log("state_AmpersandNotNeeded = ".concat(state_AmpersandNotNeeded));
    console.log("".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m"), " = ", JSON.stringify(nbsp, null, 4)));
  }
  return rangesArr.length ? rangesMerge(rangesArr) : null;
}

module.exports = stringFixBrokenNamedEntities;

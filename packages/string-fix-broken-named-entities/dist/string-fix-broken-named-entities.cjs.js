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
    var matchedLettersCount = (nbsp.matchedN ? 1 : 0) + (nbsp.matchedB ? 1 : 0) + (nbsp.matchedS ? 1 : 0) + (nbsp.matchedP ? 1 : 0);
    if (nbsp.nameStartsAt !== null && matchedLettersCount > 2 && (!str[i] || str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p") && str[i] !== ";") {
      console.log("\x1B[".concat(32, "m", "140 ENDING OF AN NBSP; PUSH [".concat(nbsp.nameStartsAt, ", ").concat(i, ", \"&nbsp;\"]"), "\x1B[", 39, "m"));
      rangesArr.push([nbsp.nameStartsAt, i, "&nbsp;"]);
      nbspWipe();
      console.log("147 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m"), ", now = ", JSON.stringify(nbsp, null, 4)));
    }
    if (str[i] === "&") {
      console.log("169 & caught");
      if (str[i + 1] === "a" && str[i + 2] === "m" && str[i + 3] === "p" && str[i + 4] === ";") {
        state_AmpersandNotNeeded = true;
        var endingOfAmpRepetition = i + 5;
        while (str[endingOfAmpRepetition] === "a" && str[endingOfAmpRepetition + 1] === "m" && str[endingOfAmpRepetition + 2] === "p" && str[endingOfAmpRepetition + 3] === ";") {
          endingOfAmpRepetition += 4;
        }
        rangesArr.push([i + 1, endingOfAmpRepetition]);
        console.log("193 PUSH \x1B[".concat(33, "m", "[".concat(i + 1, ", ").concat(endingOfAmpRepetition, "]"), "\x1B[", 39, "m"));
        i = endingOfAmpRepetition - 1;
        continue outerloop;
      }
      if (nbsp.nameStartsAt === null) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = i;
          console.log("210 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
          nbsp.ampersandNecessary = false;
          console.log("216 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = ", nbsp.ampersandNecessary));
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      console.log("226 n caught");
      nbsp.matchedN = true;
      if (nbsp.nameStartsAt === null) {
        nbsp.nameStartsAt = i;
        console.log("232 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log("241 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = ", nbsp.ampersandNecessary));
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "b") {
      console.log("251 b caught");
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedB = true;
        console.log("256 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedB", "\x1B[", 39, "m"), " = ", nbsp.matchedB));
      }
    }
    if (str[i] && str[i].toLowerCase() === "s") {
      console.log("265 s caught");
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedS = true;
        console.log("270 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedS", "\x1B[", 39, "m"), " = ", nbsp.matchedS));
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      console.log("279 p caught");
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedP = true;
        console.log("284 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedP", "\x1B[", 39, "m"), " = ", nbsp.matchedP));
      }
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
      console.log("308 SET ".concat("\x1B[".concat(33, "m", "state_AmpersandNotNeeded", "\x1B[", 39, "m"), " = ", JSON.stringify(state_AmpersandNotNeeded, null, 4)));
    }
    console.log("---------------");
    console.log("state_AmpersandNotNeeded = ".concat(state_AmpersandNotNeeded));
    console.log("".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m"), " = ", JSON.stringify(nbsp, null, 4)));
  }
  return rangesArr.length ? rangesMerge(rangesArr) : null;
}

module.exports = stringFixBrokenNamedEntities;

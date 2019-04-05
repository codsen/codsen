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
  console.log("015 ".concat("\x1B[".concat(33, "m", "originalOpts", "\x1B[", 39, "m"), " = ", JSON.stringify(originalOpts, null, 4)));
  function isNotaLetter(str) {
    return !(typeof str === "string" && str.length === 1 && str.toUpperCase() !== str.toLowerCase());
  }
  function isStr(something) {
    return typeof something === "string";
  }
  function isLatinLetter(char) {
    return isStr(char) && char.length === 1 && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
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
      console.log("075 new ".concat("\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " = ", JSON.stringify(opts, null, 4)));
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
  console.log("104 FINAL ".concat("\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " used: ", JSON.stringify(opts, null, 4)));
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
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(i, " ] = ", "\x1B[".concat(31, "m", str[i] ? str[i].trim() === "" ? str[i] === null ? "null" : str[i] === "\n" ? "line break" : str[i] === "\t" ? "tab" : str[i] === " " ? "space" : "???" : str[i] : "undefined", "\x1B[", 39, "m")), "\x1B[", 39, "m \x1B[", 36, "m", "===============================", "\x1B[", 39, "m ", doNothingUntil && (doNothingUntil === true || doNothingUntil > i) ? "".concat("\x1B[".concat(31, "m", "\u2588\u2588 doNothingUntil until ".concat(doNothingUntil), "\x1B[", 39, "m")) : ""));
    if (doNothingUntil) {
      if (doNothingUntil !== true && i >= doNothingUntil) {
        doNothingUntil = null;
        console.log("240 RESET ".concat("\x1B[".concat(33, "m", "doNothingUntil", "\x1B[", 39, "m"), " = null"));
      } else {
        console.log("243 continue");
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
    console.log("268 ".concat("\x1B[".concat(33, "m", "smallestCharFromTheSetAt", "\x1B[", 39, "m"), " = ", JSON.stringify(smallestCharFromTheSetAt, null, 4)));
    console.log("275 ".concat("\x1B[".concat(33, "m", "largestCharFromTheSetAt", "\x1B[", 39, "m"), " = ", JSON.stringify(largestCharFromTheSetAt, null, 4)));
    if (nbsp.nameStartsAt !== null && matchedLettersCount > 2 && (nbsp.matchedSemicol !== null || !nbsp.ampersandNecessary || isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[i]) || (isNotaLetter(str[nbsp.nameStartsAt - 1]) || isNotaLetter(str[i])) && largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4 || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && nbsp.matchedN + 1 === nbsp.matchedB && nbsp.matchedB + 1 === nbsp.matchedS && nbsp.matchedS + 1 === nbsp.matchedP) && (!str[i] || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && str[i] !== str[i - 1] || str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" || str[stringLeftRight.left(str, i)] === ";") && str[i] !== ";" && (str[i + 1] === undefined || str[stringLeftRight.right(str, i)] !== ";")) {
      console.log("318 ".concat("\x1B[".concat(90, "m", "within nbsp clauses", "\x1B[", 39, "m")));
      if (str.slice(nbsp.nameStartsAt, i) !== "&nbsp;"
      ) {
          console.log("336 ".concat("\x1B[".concat(90, "m", "catching what's missing in nbsp", "\x1B[", 39, "m")));
          if (nbsp.nameStartsAt != null && i - nbsp.nameStartsAt === 5 && str.slice(nbsp.nameStartsAt, i) === "&nbsp") {
            console.log("345 ██ only semicol missing!");
            console.log("347 push ".concat(JSON.stringify({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "nbsp",
              rangeFrom: nbsp.nameStartsAt,
              rangeTo: i,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0"
            })));
            rangesArr2.push({
              ruleName: "bad-named-html-entity-missing-semicolon",
              entityName: "nbsp",
              rangeFrom: nbsp.nameStartsAt,
              rangeTo: i,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0"
            });
          } else {
            console.log("365 it's not just semicolon missing");
            console.log("367 ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", JSON.stringify(nbsp.nameStartsAt, null, 4)));
            var chompedAmpFromLeft = stringLeftRight.chompLeft(str, nbsp.nameStartsAt, "&?", "a", "m", "p", ";?");
            console.log("384 ".concat("\x1B[".concat(33, "m", "chompedAmpFromLeft", "\x1B[", 39, "m"), " = ", JSON.stringify(chompedAmpFromLeft, null, 4)));
            var beginningOfTheRange = chompedAmpFromLeft ? chompedAmpFromLeft : nbsp.nameStartsAt;
            console.log("394 beginningOfTheRange = ".concat(JSON.stringify(beginningOfTheRange, null, 4)));
            if (str.slice(beginningOfTheRange, i) !== "&nbsp;") {
              console.log("402 push ".concat(JSON.stringify({
                ruleName: "bad-named-html-entity-malformed-nbsp",
                entityName: "nbsp",
                rangeFrom: beginningOfTheRange,
                rangeTo: i,
                rangeValEncoded: "&nbsp;",
                rangeValDecoded: "\xA0"
              })));
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
      console.log("423 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
      counter++;
      return "continue|outerloop";
    }
    if (str[i] && str[i - 1] === ";" && !stringLeftRight.leftSeq(str, i - 1, "a", "m", "p") && str[i] !== ";" && matchedLettersCount > 0) {
      nbspWipe();
      console.log("437 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
      counter++;
      return "continue|outerloop";
    }
    if (letterSeqStartAt !== null && (!str[i] || str[i].trim().length && !isLatinLetter(str[i]))) {
      console.log("460 ".concat("\x1B[".concat(36, "m", "\u2588\u2588 letterSeqStartAt = ".concat(letterSeqStartAt), "\x1B[", 39, "m")));
      if (i > letterSeqStartAt + 1) {
        var potentialEntity = str.slice(letterSeqStartAt, i);
        console.log("465 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 CARVED A SEQUENCE:\n".concat(potentialEntity), "\x1B[", 39, "m")));
        var whatsOnTheLeft = stringLeftRight.left(str, letterSeqStartAt);
        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
          console.log("470 ".concat("\x1B[".concat(35, "m", "semicol might be missing", "\x1B[", 39, "m")));
          var firstChar = letterSeqStartAt;
          var secondChar = stringLeftRight.right(str, letterSeqStartAt);
          console.log("477 firstChar = str[".concat(firstChar, "] = ").concat(str[firstChar], "; secondChar = str[").concat(secondChar, "] = ").concat(str[secondChar]));
          console.log("485 \u2588\u2588 ".concat(secondChar !== null && allNamedHtmlEntities.entStartsWith.hasOwnProperty(str[firstChar]) && allNamedHtmlEntities.entStartsWith[str[firstChar]].hasOwnProperty(str[secondChar])));
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
            if (isArr(temp1) && temp1.length) {
              var _temp1$reduce = temp1.reduce(function (gatheredSoFar, oneOfFilteredEntitiesObj) {
                if (oneOfFilteredEntitiesObj.tempEnt.length > gatheredSoFar.tempEnt.length) {
                  return oneOfFilteredEntitiesObj;
                }
                return gatheredSoFar;
              });
              tempEnt = _temp1$reduce.tempEnt;
              tempRes = _temp1$reduce.tempRes;
            }
            if (tempEnt) {
              console.log("541 ".concat("\x1B[".concat(35, "m", "entity ".concat(tempEnt, " is indeed on the right of index ").concat(i, ", the situation is: ").concat(JSON.stringify(tempRes, null, 4)), "\x1B[", 39, "m")));
              var decodedEntity = allNamedHtmlEntities.decode("&".concat(tempEnt, ";"));
              console.log("551 push ".concat(JSON.stringify({
                ruleName: "bad-named-html-entity-malformed-".concat(tempEnt),
                entityName: tempEnt,
                rangeFrom: whatsOnTheLeft,
                rangeTo: tempRes.rightmostChar + 1,
                rangeValEncoded: "&".concat(tempEnt, ";"),
                rangeValDecoded: decodedEntity
              }, null, 4)));
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
          console.log("577 ".concat("\x1B[".concat(35, "m", "ampersand might be missing", "\x1B[", 39, "m")));
          var lastChar = stringLeftRight.left(str, i);
          var secondToLast = lastChar ? stringLeftRight.left(str, lastChar) : null;
          var _tempEnt;
          var _tempRes;
          console.log("591 lastChar = ".concat(lastChar, ", secondToLast = ").concat(secondToLast));
          if (secondToLast !== null && allNamedHtmlEntities.entEndsWith.hasOwnProperty(str[lastChar]) && allNamedHtmlEntities.entEndsWith[str[lastChar]].hasOwnProperty(str[secondToLast]) && allNamedHtmlEntities.entEndsWith[str[lastChar]][str[secondToLast]].some(function (oneOfKnownEntities) {
            var temp = stringLeftRight.leftSeq.apply(void 0, [str, i].concat(_toConsumableArray(oneOfKnownEntities.split(""))));
            if (temp && oneOfKnownEntities !== "nbsp") {
              _tempEnt = oneOfKnownEntities;
              _tempRes = temp;
              return true;
            }
          })) {
            console.log("609 ".concat("\x1B[".concat(35, "m", "entity ".concat(_tempEnt, " is indeed on the left of index ").concat(i, ", the situation is: ").concat(JSON.stringify(_tempRes, null, 4)), "\x1B[", 39, "m")));
            var _decodedEntity = allNamedHtmlEntities.decode("&".concat(_tempEnt, ";"));
            console.log("619 push ".concat(JSON.stringify({
              ruleName: "bad-named-html-entity-malformed-".concat(_tempEnt),
              entityName: _tempEnt,
              rangeFrom: _tempRes.leftmostChar,
              rangeTo: i + 1,
              rangeValEncoded: "&".concat(_tempEnt, ";"),
              rangeValDecoded: _decodedEntity
            }, null, 4)));
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
      letterSeqStartAt = null;
      console.log("647 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "letterSeqStartAt", "\x1B[", 39, "m"), " = null"));
    }
    if (letterSeqStartAt === null && isLatinLetter(str[i])) {
      letterSeqStartAt = i;
      console.log("657 SET ".concat("\x1B[".concat(33, "m", "letterSeqStartAt", "\x1B[", 39, "m"), " = ", letterSeqStartAt));
    }
    if (str[i] === "a") {
      console.log("665 ".concat("\x1B[".concat(90, "m", "within a clauses", "\x1B[", 39, "m")));
      var singleAmpOnTheRight = stringLeftRight.rightSeq(str, i, "m", "p", ";");
      if (singleAmpOnTheRight) {
        console.log("675 ".concat("\x1B[".concat(90, "m", "confirmed amp; from index ".concat(i, " onwards"), "\x1B[", 39, "m")));
        var toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        console.log("682 SET ".concat("\x1B[".concat(33, "m", "toDeleteAllAmpEndHere", "\x1B[", 39, "m"), " = ", toDeleteAllAmpEndHere));
        var nextAmpOnTheRight = stringLeftRight.rightSeq(str, singleAmpOnTheRight.rightmostChar, "a", "m", "p", ";");
        if (nextAmpOnTheRight) {
          console.log("696 ".concat("\x1B[".concat(90, "m", "confirmed another amp; on the right of index ".concat(singleAmpOnTheRight.rightmostChar), "\x1B[", 39, "m")));
          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          console.log("703 SET ".concat("\x1B[".concat(33, "m", "toDeleteAllAmpEndHere", "\x1B[", 39, "m"), " = ", toDeleteAllAmpEndHere));
          var temp;
          do {
            console.log("709 ".concat("\x1B[".concat(36, "m", "======== loop ========", "\x1B[", 39, "m")));
            temp = stringLeftRight.rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");
            console.log("713 ".concat("\x1B[".concat(36, "m", "temp = ".concat(JSON.stringify(temp, null, 4)), "\x1B[", 39, "m")));
            if (temp) {
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
              console.log("723 ".concat("\x1B[".concat(36, "m", "another amp; confirmed! Now", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "toDeleteAllAmpEndHere", "\x1B[", 39, "m"), " = ", JSON.stringify(toDeleteAllAmpEndHere, null, 4), ";"));
            }
          } while (temp);
          console.log("733 FINAL ".concat("\x1B[".concat(32, "m", "toDeleteAllAmpEndHere", "\x1B[", 39, "m"), " = ", JSON.stringify(toDeleteAllAmpEndHere, null, 4)));
        }
        var firstCharThatFollows = stringLeftRight.right(str, toDeleteAllAmpEndHere - 1);
        var secondCharThatFollows = firstCharThatFollows ? stringLeftRight.right(str, firstCharThatFollows) : null;
        console.log("752 SET initial ".concat("\x1B[".concat(33, "m", "firstCharThatFollows", "\x1B[", 39, "m"), " = ", firstCharThatFollows, "; ", "\x1B[".concat(33, "m", "secondCharThatFollows", "\x1B[", 39, "m"), " = ").concat(secondCharThatFollows));
        var matchedTemp;
        var matchedVal;
        if (secondCharThatFollows && allNamedHtmlEntities.entStartsWith.hasOwnProperty(str[firstCharThatFollows]) && allNamedHtmlEntities.entStartsWith[str[firstCharThatFollows]].hasOwnProperty(str[secondCharThatFollows]) && allNamedHtmlEntities.entStartsWith[str[firstCharThatFollows]][str[secondCharThatFollows]].some(function (entity) {
          var matchEntityOnTheRight = stringLeftRight.rightSeq.apply(void 0, [str, toDeleteAllAmpEndHere - 1].concat(_toConsumableArray(entity.slice(""))));
          if (matchEntityOnTheRight) {
            matchedTemp = entity;
            matchedVal = matchEntityOnTheRight;
            return true;
          }
        })) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1;
          console.log("785 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 ACTIVATE doNothingUntil = ".concat(doNothingUntil), "\x1B[", 39, "m")));
          console.log("789 ENTITY ".concat("\x1B[".concat(32, "m", matchedTemp, "\x1B[", 39, "m"), " FOLLOWS"));
          var _whatsOnTheLeft = stringLeftRight.left(str, i);
          if (str[_whatsOnTheLeft] === "&") {
            console.log("795 ampersand on the left");
            console.log("797 ".concat("\x1B[".concat(33, "m", "matchedTemp", "\x1B[", 39, "m"), " = ", JSON.stringify(matchedTemp, null, 4), "; ", "\x1B[".concat(33, "m", "matchedVal", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(matchedVal, null, 4)));
            console.log("808 push ".concat(JSON.stringify({
              ruleName: "bad-named-html-entity-multiple-encoding",
              entityName: matchedTemp,
              rangeFrom: _whatsOnTheLeft,
              rangeTo: doNothingUntil,
              rangeValEncoded: "&".concat(matchedTemp, ";"),
              rangeValDecoded: allNamedHtmlEntities.decode("&".concat(matchedTemp, ";"))
            }, null, 4)));
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
            console.log("849 rangeFrom = ".concat(rangeFrom, "; firstCharThatFollows = ").concat(firstCharThatFollows));
            if (opts.cb) {
              console.log("854 push ".concat(JSON.stringify({
                ruleName: "bad-named-html-entity-multiple-encoding",
                entityName: matchedTemp,
                rangeFrom: rangeFrom,
                rangeTo: doNothingUntil,
                rangeValEncoded: "".concat(spaceReplacement, "&").concat(matchedTemp, ";"),
                rangeValDecoded: "".concat(spaceReplacement).concat(allNamedHtmlEntities.decode("&".concat(matchedTemp, ";")))
              }, null, 4)));
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
      console.log("887 ".concat("\x1B[".concat(90, "m", "& caught", "\x1B[", 39, "m")));
      if (nbsp.nameStartsAt && nbsp.nameStartsAt < i && (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)) {
        console.log("896 ".concat("\x1B[".concat(31, "m", "WIPE", "\x1B[", 39, "m"), " nbsp markers because ampersand follows a tag beginning"));
        nbspWipe();
      }
      if (nbsp.nameStartsAt === null) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = i;
          console.log("911 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
          nbsp.ampersandNecessary = false;
          console.log("917 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = ", nbsp.ampersandNecessary));
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      if (str[i - 1] === "i" && str[i + 1] === "s") {
        console.log("929 pattern ...ins... detected - bail");
        nbspWipe();
        counter++;
        return "continue|outerloop";
      }
      console.log("936 n caught");
      if (nbsp.matchedN === null) {
        nbsp.matchedN = i;
        console.log("940 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedN", "\x1B[", 39, "m"), " = ", nbsp.matchedN));
      }
      if (nbsp.nameStartsAt === null) {
        nbsp.nameStartsAt = i;
        console.log("949 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
        console.log("962 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = ", nbsp.ampersandNecessary));
      }
    }
    if (str[i] && str[i].toLowerCase() === "b") {
      console.log("971 b caught");
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedB === null) {
          nbsp.matchedB = i;
          console.log("977 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedB", "\x1B[", 39, "m"), " = ", nbsp.matchedB));
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        console.log("989 MINUSMINUS ".concat("\x1B[".concat(33, "m", "nbsp.patience", "\x1B[", 39, "m"), ", then it's ", nbsp.patience));
        nbsp.nameStartsAt = i;
        console.log("997 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
        nbsp.matchedB = i;
        console.log("1003 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedB", "\x1B[", 39, "m"), " = true"));
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log("1011 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = true"));
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
          console.log("1017 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = false"));
        }
      } else {
        nbspWipe();
        console.log("1023 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
        counter++;
        return "continue|outerloop";
      }
    }
    if (str[i] && str[i].toLowerCase() === "s") {
      console.log("1031 s caught");
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedS === null) {
          nbsp.matchedS = i;
          console.log("1037 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedS", "\x1B[", 39, "m"), " = ", nbsp.matchedS));
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        console.log("1049 MINUSMINUS ".concat("\x1B[".concat(33, "m", "nbsp.patience", "\x1B[", 39, "m"), ", then it's ", nbsp.patience));
        nbsp.nameStartsAt = i;
        console.log("1057 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
        nbsp.matchedS = i;
        console.log("1063 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedS", "\x1B[", 39, "m"), " = true"));
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log("1071 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = true"));
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
          console.log("1077 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = false"));
        }
      } else {
        nbspWipe();
        console.log("1083 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
        counter++;
        return "continue|outerloop";
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      console.log("1091 p caught");
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedP === null) {
          nbsp.matchedP = i;
          console.log("1097 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedP", "\x1B[", 39, "m"), " = ", nbsp.matchedP));
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        console.log("1109 MINUSMINUS ".concat("\x1B[".concat(33, "m", "nbsp.patience", "\x1B[", 39, "m"), ", then it's ", nbsp.patience));
        nbsp.nameStartsAt = i;
        console.log("1117 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
        nbsp.matchedP = i;
        console.log("1123 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedP", "\x1B[", 39, "m"), " = true"));
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log("1131 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = true"));
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
          console.log("1137 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = false"));
        }
      } else {
        nbspWipe();
        console.log("1143 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
        counter++;
        return "continue|outerloop";
      }
    }
    if (str[i] === ";") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedSemicol = i;
        console.log("1154 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedSemicol", "\x1B[", 39, "m"), " = ", nbsp.matchedSemicol));
        if (nbsp.matchedN &&
        !nbsp.matchedB && !nbsp.matchedS && !nbsp.matchedP || !nbsp.matchedN && nbsp.matchedB &&
        !nbsp.matchedS && !nbsp.matchedP || !nbsp.matchedN && !nbsp.matchedB && nbsp.matchedS &&
        !nbsp.matchedP || !nbsp.matchedN && !nbsp.matchedB && !nbsp.matchedS && nbsp.matchedP
        ) {
            nbspWipe();
            console.log("1177 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
          }
      }
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
      console.log("1205 SET ".concat("\x1B[".concat(33, "m", "state_AmpersandNotNeeded", "\x1B[", 39, "m"), " = ", JSON.stringify(state_AmpersandNotNeeded, null, 4)));
      if (nbsp.nameStartsAt && (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)) {
        nbsp.ampersandNecessary = false;
      }
    }
    if (nbsp.nameStartsAt !== null && i > nbsp.nameStartsAt && str[i] && str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" && str[i] !== "&" && str[i] !== ";" && str[i] !== " ") {
      if (nbsp.patience) {
        nbsp.patience = nbsp.patience - 1;
        console.log("1242 nbsp.patience--, now equal to: ".concat(nbsp.patience));
      } else {
        nbspWipe();
        console.log("1245 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
        counter++;
        return "continue|outerloop";
      }
    }
    console.log("---------------");
    console.log("1264 ".concat("\x1B[".concat(90, "m", "letterSeqStartAt = ".concat(letterSeqStartAt), "\x1B[", 39, "m")));
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
    console.log("1302 ".concat("\x1B[".concat(32, "m", "RETURN", "\x1B[", 39, "m"), " null"));
    return null;
  }
  console.log("1307 IN THE END, before merge rangesArr2 = ".concat(JSON.stringify(rangesArr2, null, 4)));
  var res = rangesArr2.filter(function (filteredRangeObj, i) {
    return rangesArr2.every(function (oneOfEveryObj, y) {
      return i === y || filteredRangeObj.rangeFrom !== oneOfEveryObj.rangeFrom || filteredRangeObj.rangeTo > oneOfEveryObj.rangeTo;
    });
  }).map(opts.cb);
  console.log("1341 RETURN ".concat("\x1B[".concat(33, "m", "res", "\x1B[", 39, "m"), " = ", JSON.stringify(res, null, 4)));
  return res;
}

module.exports = stringFixBrokenNamedEntities;

/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 2.4.2
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
  console.log("0024 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(33, "m", "str", "\x1B[", 39, "m"), " = ", JSON.stringify(str, null, 0), ";\n", "\x1B[".concat(33, "m", "originalOpts", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(originalOpts, null, 4)));
  function resemblesNumericEntity(str, from, to) {
    var lettersCount = 0;
    var numbersCount = 0;
    var othersCount = 0;
    var hashesCount = 0;
    var whitespaceCount = 0;
    var numbersValue = "";
    var charTrimmed = "";
    for (var i = from; i < to; i++) {
      console.log("0046 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(36, "m", "resemblesNumericEntity() loop: str[".concat(i, "] = \"").concat(str[i], "\""), "\x1B[", 39, "m")));
      if (str[i].trim().length) {
        charTrimmed += str[i];
      } else {
        whitespaceCount++;
      }
      if (isLatinLetter(str[i])) {
        lettersCount++;
      } else if (isNumber(str[i])) {
        numbersCount++;
        numbersValue += String(str[i]);
      } else if (str[i] === "#") {
        hashesCount++;
      } else {
        othersCount++;
      }
    }
    var probablyNumeric = false;
    console.log("0069 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(33, "m", "charTrimmed[0]", "\x1B[", 39, "m"), " = ", JSON.stringify(charTrimmed[0], null, 4), "; ", "\x1B[".concat(33, "m", "charTrimmed[1]", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(charTrimmed[1], null, 4)));
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
  function isNotaLetter(str) {
    return !(typeof str === "string" && str.length === 1 && str.toUpperCase() !== str.toLowerCase());
  }
  function isStr(something) {
    return typeof something === "string";
  }
  function isLatinLetter(something) {
    return typeof something === "string" && (something.charCodeAt(0) > 96 && something.charCodeAt(0) < 123 || something.charCodeAt(0) > 64 && something.charCodeAt(0) < 91);
  }
  function isLatinLetterOrNumberOrHash(_char) {
    return isStr(_char) && _char.length === 1 && (_char.charCodeAt(0) > 96 && _char.charCodeAt(0) < 123 || _char.charCodeAt(0) > 47 && _char.charCodeAt(0) < 58 || _char.charCodeAt(0) > 64 && _char.charCodeAt(0) < 91 || _char.charCodeAt(0) === 35);
  }
  function isNumber(something) {
    return isStr(something) && something.charCodeAt(0) > 47 && something.charCodeAt(0) < 58;
  }
  function onlyContainsNbsp(str, from, to) {
    for (var i = from; i < to; i++) {
      if (str[i].trim().length && !"nbsp".includes(str[i].toLowerCase())) {
        return false;
      }
    }
    return true;
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
    var copy;
    if (isArr(temp1) && temp1.length) {
      copy = Array.from(temp1);
      if (copy.length > 1 && copy.some(function (entityObj) {
        return str[stringLeftRight.right(str, entityObj.tempRes.rightmostChar)] === ";";
      }) && copy.some(function (entityObj) {
        return str[stringLeftRight.right(str, entityObj.tempRes.rightmostChar)] !== ";";
      })) {
        copy = copy.filter(function (entityObj) {
          return str[stringLeftRight.right(str, entityObj.tempRes.rightmostChar)] === ";";
        });
        console.log("0287 stringFixBrokenNamedEntities: we filtered only entities with semicolons to the right: ".concat(JSON.stringify(copy, null, 4)));
      }
      if (!(copy.every(function (entObj) {
        return !entObj || !entObj.tempRes || !entObj.tempRes.gaps || !isArr(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
      }) || copy.every(function (entObj) {
        return entObj && entObj.tempRes && entObj.tempRes.gaps && isArr(entObj.tempRes.gaps) && entObj.tempRes.gaps.length;
      }))) {
        return findLongest(copy.filter(function (entObj) {
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
      return rangeValDecoded || rangeValEncoded ? [rangeFrom, rangeTo, opts.decode ? rangeValDecoded : rangeValEncoded] : [rangeFrom, rangeTo];
    },
    progressFn: null
  };
  var opts;
  if (originalOpts != null) {
    if (!isObj(originalOpts)) {
      throw new Error("string-fix-broken-named-entities: [THROW_ID_02] the second input argument must be a plain object! I was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (").concat(_typeof(originalOpts), "-type)"));
    } else {
      opts = Object.assign({}, defaults, originalOpts);
      console.log("0378 stringFixBrokenNamedEntities: new ".concat("\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " = ", JSON.stringify(opts, null, 4)));
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
  console.log("0416 stringFixBrokenNamedEntities: FINAL ".concat("\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " used: ", JSON.stringify(opts, null, 4)));
  var state_AmpersandNotNeeded = false;
  var nbspDefault = {
    nameStartsAt: null,
    ampersandNecessary: null,
    patience: 1,
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
  var brokenNumericEntityStartAt = null;
  var falsePositivesArr = ["&nspar;", "&prnsim;", "&subplus;"];
  var _loop = function _loop(i) {
    if (opts.progressFn) {
      percentageDone = Math.floor(counter / len * 100);
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    console.log("0519 stringFixBrokenNamedEntities: \n\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(i, " ] = ").concat(str[i] && str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 4)), "\x1B[", 39, "m \x1B[", 36, "m", "===============================", "\x1B[", 39, "m\n"));
    if (doNothingUntil) {
      if (doNothingUntil !== true && i >= doNothingUntil) {
        doNothingUntil = null;
        console.log("0542 stringFixBrokenNamedEntities: RESET ".concat("\x1B[".concat(33, "m", "doNothingUntil", "\x1B[", 39, "m"), " = null"));
      } else {
        console.log("0545 stringFixBrokenNamedEntities: continue");
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
    console.log("0570 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(33, "m", "smallestCharFromTheSetAt", "\x1B[", 39, "m"), " = ", JSON.stringify(smallestCharFromTheSetAt, null, 4)));
    console.log("0577 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(33, "m", "largestCharFromTheSetAt", "\x1B[", 39, "m"), " = ", JSON.stringify(largestCharFromTheSetAt, null, 4)));
    if (nbsp.nameStartsAt !== null && matchedLettersCount > 2 && (nbsp.matchedSemicol !== null || !nbsp.ampersandNecessary || isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[i]) || (isNotaLetter(str[nbsp.nameStartsAt - 1]) || isNotaLetter(str[i])) && largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4 || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && nbsp.matchedN + 1 === nbsp.matchedB && nbsp.matchedB + 1 === nbsp.matchedS && nbsp.matchedS + 1 === nbsp.matchedP) && (!str[i] || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && str[i] !== str[i - 1] || str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" || str[stringLeftRight.left(str, i)] === ";") && str[i] !== ";" && (str[i + 1] === undefined || str[stringLeftRight.right(str, i)] !== ";") && (nbsp.matchedB !== null || !(str[smallestCharFromTheSetAt].toLowerCase() === "n" && str[stringLeftRight.left(str, smallestCharFromTheSetAt)] && str[stringLeftRight.left(str, smallestCharFromTheSetAt)].toLowerCase() === "e") && !(nbsp.matchedN !== null && stringLeftRight.rightSeq(str, nbsp.matchedN, {
      i: true
    }, "s", "u", "p")) && str[stringLeftRight.right(str, nbsp.matchedN)].toLowerCase() !== "c") && (nbsp.matchedB === null || onlyContainsNbsp(str, smallestCharFromTheSetAt, largestCharFromTheSetAt + 1) || !(str[smallestCharFromTheSetAt] && str[largestCharFromTheSetAt] && str[smallestCharFromTheSetAt].toLowerCase() === "n" && str[largestCharFromTheSetAt].toLowerCase() === "b"))) {
      console.log("0644 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(90, "m", "within nbsp clauses", "\x1B[", 39, "m")));
      console.log("0648 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", JSON.stringify(nbsp.nameStartsAt, null, 4)));
      var chompedAmpFromLeft = stringLeftRight.chompLeft(str, nbsp.nameStartsAt, "&?", "a", "m", "p", ";?");
      console.log("0665 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(33, "m", "chompedAmpFromLeft", "\x1B[", 39, "m"), " = ", JSON.stringify(chompedAmpFromLeft, null, 4)));
      var beginningOfTheRange = chompedAmpFromLeft ? chompedAmpFromLeft : nbsp.nameStartsAt;
      console.log("0675 stringFixBrokenNamedEntities: beginningOfTheRange = ".concat(JSON.stringify(beginningOfTheRange, null, 4)));
      if (opts.entityCatcherCb) {
        console.log("0685 stringFixBrokenNamedEntities: call opts.entityCatcherCb()");
        opts.entityCatcherCb(beginningOfTheRange, i);
      }
      if (!falsePositivesArr.some(function (val) {
        return str.slice(beginningOfTheRange).startsWith(val);
      }) && str.slice(beginningOfTheRange, i) !== "&nbsp;") {
        console.log("0698 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
          ruleName: "bad-named-html-entity-malformed-nbsp",
          entityName: "nbsp",
          rangeFrom: beginningOfTheRange,
          rangeTo: i,
          rangeValEncoded: "&nbsp;",
          rangeValDecoded: "\xA0"
        }, null, 4)));
        rangesArr2.push({
          ruleName: "bad-named-html-entity-malformed-nbsp",
          entityName: "nbsp",
          rangeFrom: beginningOfTheRange,
          rangeTo: i,
          rangeValEncoded: "&nbsp;",
          rangeValDecoded: "\xA0"
        });
      } else if (opts.decode) {
        console.log("0721 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
          ruleName: "encoded-html-entity-nbsp",
          entityName: "nbsp",
          rangeFrom: beginningOfTheRange,
          rangeTo: i,
          rangeValEncoded: "&nbsp;",
          rangeValDecoded: "\xA0"
        }, null, 4)));
        rangesArr2.push({
          ruleName: "encoded-html-entity-nbsp",
          entityName: "nbsp",
          rangeFrom: beginningOfTheRange,
          rangeTo: i,
          rangeValEncoded: "&nbsp;",
          rangeValDecoded: "\xA0"
        });
      }
      nbspWipe();
      console.log("0745 stringFixBrokenNamedEntities: WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
      counter++;
      return "continue|outerloop";
    }
    if (str[i] && str[i - 1] === ";" && !stringLeftRight.leftSeq(str, i - 1, "a", "m", "p") && str[i] !== ";" && matchedLettersCount > 0) {
      nbspWipe();
      console.log("0761 stringFixBrokenNamedEntities: WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
      counter++;
      return "continue|outerloop";
    }
    if (letterSeqStartAt !== null && (!str[i] || str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i]))) {
      console.log("0786 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(36, "m", "\u2588\u2588 letterSeqStartAt = ".concat(letterSeqStartAt), "\x1B[", 39, "m")));
      if (i > letterSeqStartAt + 1 && str.slice(letterSeqStartAt - 1, i + 1) !== "&nbsp;") {
        var potentialEntity = str.slice(letterSeqStartAt, i);
        console.log("0794 stringFixBrokenNamedEntities: ".concat("\x1B[".concat(35, "m", "\u2588\u2588 CARVED A SEQUENCE:\n".concat(potentialEntity), "\x1B[", 39, "m")));
        var whatsOnTheLeft = stringLeftRight.left(str, letterSeqStartAt);
        var whatsEvenMoreToTheLeft = whatsOnTheLeft ? stringLeftRight.left(str, whatsOnTheLeft) : "";
        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
          console.log("0813 ".concat("\x1B[".concat(35, "m", "semicol might be missing", "\x1B[", 39, "m")));
          var firstChar = letterSeqStartAt;
          var secondChar = letterSeqStartAt ? stringLeftRight.right(str, letterSeqStartAt) : null;
          console.log("0822 firstChar = str[".concat(firstChar, "] = ").concat(str[firstChar], "; secondChar = str[").concat(secondChar, "] = ").concat(str[secondChar]));
          console.log("0828 \u2588\u2588 ".concat(secondChar !== null && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith, str[firstChar]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith[str[firstChar]], str[secondChar])));
          if (Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith, str[firstChar]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith[str[firstChar]], str[secondChar])) {
            console.log("0858");
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
            console.log("0882 ".concat("\x1B[".concat(35, "m", "temp1 BEFORE filtering = ".concat(JSON.stringify(temp1, null, 4)), "\x1B[", 39, "m")));
            temp1 = removeGappedFromMixedCases(temp1);
            console.log("0890 ".concat("\x1B[".concat(35, "m", "temp1 AFTER filtering = ".concat(JSON.stringify(temp1, null, 4)), "\x1B[", 39, "m")));
            if (temp1) {
              var _temp = temp1;
              tempEnt = _temp.tempEnt;
              tempRes = _temp.tempRes;
            }
            console.log("0900 ".concat("\x1B[".concat(33, "m", "tempEnt", "\x1B[", 39, "m"), " = ", tempEnt, "; ", "\x1B[".concat(33, "m", "tempRes", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(tempRes, null, 4)));
            console.log("0908 ".concat("\x1B[".concat(33, "m", "[\"&\"].includes(str[tempRes.rightmostChar + 1])", "\x1B[", 39, "m"), " = ", JSON.stringify(["&"].includes(str[tempRes.rightmostChar + 1]), null, 4)));
            if (tempEnt && (!Object.keys(allNamedHtmlEntities.uncertain).includes(tempEnt) || !str[tempRes.rightmostChar + 1] || ["&"].includes(str[tempRes.rightmostChar + 1]) || (allNamedHtmlEntities.uncertain[tempEnt].addSemiIfAmpPresent === true || allNamedHtmlEntities.uncertain[tempEnt].addSemiIfAmpPresent && (!str[tempRes.rightmostChar + 1] || !str[tempRes.rightmostChar + 1].trim().length)) && str[tempRes.leftmostChar - 1] === "&")) {
              console.log("0926 ".concat("\x1B[".concat(35, "m", "entity ".concat(tempEnt, " is indeed on the right of index ").concat(i, ", the situation is: ").concat(JSON.stringify(tempRes, null, 4)), "\x1B[", 39, "m")));
              var decodedEntity = allNamedHtmlEntities.decode("&".concat(tempEnt, ";"));
              console.log("0936 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
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
        } else if (str[whatsOnTheLeft] !== "&" && str[whatsEvenMoreToTheLeft] !== "&" && str[i] === ";") {
          console.log("0976 ".concat("\x1B[".concat(35, "m", "ampersand might be missing", "\x1B[", 39, "m")));
          var lastChar = stringLeftRight.left(str, i);
          var secondToLast = lastChar ? stringLeftRight.left(str, lastChar) : null;
          if (secondToLast !== null && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entEndsWith, str[lastChar]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entEndsWith[str[lastChar]], str[secondToLast])) {
            console.log("0997");
            var _tempEnt;
            var _tempRes;
            var _temp2 = allNamedHtmlEntities.entEndsWith[str[lastChar]][str[secondToLast]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
              var tempRes = stringLeftRight.leftSeq.apply(void 0, [str, i].concat(_toConsumableArray(oneOfKnownEntities.split(""))));
              if (tempRes && oneOfKnownEntities !== "nbsp" && !(oneOfKnownEntities === "block" && str[stringLeftRight.left(str, letterSeqStartAt)] === ":")) {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes: tempRes
                }]);
              }
              return gatheredSoFar;
            }, []);
            console.log("1029 ".concat("\x1B[".concat(35, "m", "temp1 BEFORE filtering = ".concat(JSON.stringify(_temp2, null, 4)), "\x1B[", 39, "m")));
            _temp2 = removeGappedFromMixedCases(_temp2);
            console.log("1037 ".concat("\x1B[".concat(35, "m", "temp1 AFTER filtering = ".concat(JSON.stringify(_temp2, null, 4)), "\x1B[", 39, "m")));
            if (_temp2) {
              var _temp3 = _temp2;
              _tempEnt = _temp3.tempEnt;
              _tempRes = _temp3.tempRes;
            }
            console.log("1047 ".concat("\x1B[".concat(33, "m", "tempEnt", "\x1B[", 39, "m"), " = ", _tempEnt, " - ", "\x1B[".concat(33, "m", "tempRes", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(_tempRes, null, 4)));
            console.log("1055 letterSeqStartAt = ".concat(letterSeqStartAt, "; str[letterSeqStartAt] = ").concat(str[letterSeqStartAt], "; tempRes.leftmostChar = ").concat(_tempRes.leftmostChar, "; str[tempRes.leftmostChar - 1] = ").concat(str[_tempRes.leftmostChar - 1]));
            if (_tempEnt && (!Object.keys(allNamedHtmlEntities.uncertain).includes(_tempEnt) || allNamedHtmlEntities.uncertain[_tempEnt].addAmpIfSemiPresent === true || allNamedHtmlEntities.uncertain[_tempEnt].addAmpIfSemiPresent && (!_tempRes.leftmostChar || isStr(str[_tempRes.leftmostChar - 1]) && !str[_tempRes.leftmostChar - 1].trim().length))) {
              console.log("1073 ".concat("\x1B[".concat(35, "m", "entity ".concat(_tempEnt, " is indeed on the left of index ").concat(i, ", the situation is: ").concat(JSON.stringify(_tempRes, null, 4)), "\x1B[", 39, "m")));
              var _decodedEntity = allNamedHtmlEntities.decode("&".concat(_tempEnt, ";"));
              console.log("1083 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
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
            } else {
              console.log("1106 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " \"", _tempEnt, "\" is among uncertain entities"));
            }
          } else if (brokenNumericEntityStartAt !== null) {
            console.log("1115 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", brokenNumericEntityStartAt, ", ").concat(i + 1, "]"));
            rangesArr2.push({
              ruleName: "bad-malformed-numeric-character-entity",
              entityName: null,
              rangeFrom: brokenNumericEntityStartAt,
              rangeTo: i + 1,
              rangeValEncoded: null,
              rangeValDecoded: null
            });
            brokenNumericEntityStartAt = null;
            console.log("1130 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " brokenNumericEntityStartAt = null"));
          }
        } else if (str[whatsOnTheLeft] === "&" && str[i] === ";") {
          console.log("1144 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 looks like some sort of HTML entitity!", "\x1B[", 39, "m")));
          if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) {
            console.log("1150 ".concat("\x1B[".concat(90, "m", "so there are some characters in between: & and ;", "\x1B[", 39, "m")));
            var situation = resemblesNumericEntity(str, whatsOnTheLeft + 1, i);
            console.log("1181 ".concat("\x1B[".concat(33, "m", "situation", "\x1B[", 39, "m"), " = ", JSON.stringify(situation, null, 4)));
            if (situation.probablyNumeric) {
              console.log("1190 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 seems like a numeric HTML entity!", "\x1B[", 39, "m")));
              if (situation.probablyNumeric && situation.charTrimmed[0] === "#" && !situation.whitespaceCount && (
              !situation.lettersCount && situation.numbersCount > 0 && !situation.othersCount ||
              (situation.numbersCount || situation.lettersCount) && situation.charTrimmed[1] === "x" && !situation.othersCount)) {
                var decodedEntitysValue = String.fromCharCode(parseInt(situation.charTrimmed.slice(situation.probablyNumeric === "deci" ? 1 : 2), situation.probablyNumeric === "deci" ? 10 : 16));
                console.log("1217 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 it's a ".concat(situation.probablyNumeric === "hexi" ? "hexi" : "", "decimal numeric entity reference: \"").concat(decodedEntitysValue, "\""), "\x1B[", 39, "m")));
                if (situation.probablyNumeric === "deci" && parseInt(situation.numbersValue, 10) > 918015) {
                  console.log("1227 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
                    ruleName: "bad-malformed-numeric-character-entity",
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  }, null, 4)));
                  rangesArr2.push({
                    ruleName: "bad-malformed-numeric-character-entity",
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                } else if (opts.decode) {
                  console.log("1251 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
                    ruleName: "encoded-numeric-html-entity-reference",
                    entityName: situation.charTrimmed,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: "&".concat(situation.charTrimmed, ";"),
                    rangeValDecoded: decodedEntitysValue
                  }, null, 4)));
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
                console.log("1276 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
                  ruleName: "bad-malformed-numeric-character-entity",
                  entityName: null,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null
                }, null, 4)));
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
                console.log("1301 call opts.entityCatcherCb()");
                opts.entityCatcherCb(whatsOnTheLeft, i + 1);
              }
            } else {
              var _firstChar = letterSeqStartAt;
              var _secondChar = letterSeqStartAt ? stringLeftRight.right(str, letterSeqStartAt) : null;
              console.log("1325 firstChar = str[".concat(_firstChar, "] = ").concat(str[_firstChar], "; secondChar = str[").concat(_secondChar, "] = ").concat(str[_secondChar]));
              var _tempEnt2;
              if (Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.brokenNamedEntities, situation.charTrimmed.toLowerCase())) {
                console.log("1341 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " known broken entity ", situation.charTrimmed.toLowerCase(), " is indeed on the right"));
                console.log("1345 broken entity ".concat(situation.charTrimmed.toLowerCase(), " is indeed on the right"));
                _tempEnt2 = situation.charTrimmed;
                var _decodedEntity2 = allNamedHtmlEntities.decode("&".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()], ";"));
                console.log("1356 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
                  ruleName: "bad-named-html-entity-malformed-".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()]),
                  entityName: allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()],
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: "&".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()], ";"),
                  rangeValDecoded: _decodedEntity2
                }, null, 4)));
                rangesArr2.push({
                  ruleName: "bad-named-html-entity-malformed-".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()]),
                  entityName: allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()],
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: "&".concat(allNamedHtmlEntities.brokenNamedEntities[situation.charTrimmed.toLowerCase()], ";"),
                  rangeValDecoded: _decodedEntity2
                });
              } else if (Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWithCaseInsensitive, str[_firstChar].toLowerCase()) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWithCaseInsensitive[str[_firstChar].toLowerCase()], str[_secondChar].toLowerCase())) {
                var _tempRes2;
                console.log("1405 ".concat("\x1B[".concat(90, "m", "seems first two characters might be from an HTML entity...", "\x1B[", 39, "m")));
                var matchedEntity = allNamedHtmlEntities.entStartsWithCaseInsensitive[str[_firstChar].toLowerCase()][str[_secondChar].toLowerCase()].reduce(function (gatheredSoFar, oneOfKnownEntities) {
                  var tempRes = stringLeftRight.rightSeq.apply(void 0, [str, letterSeqStartAt - 1, {
                    i: true
                  }].concat(_toConsumableArray(oneOfKnownEntities.split(""))));
                  if (tempRes && oneOfKnownEntities !== "nbsp") {
                    return gatheredSoFar.concat([{
                      tempEnt: oneOfKnownEntities,
                      tempRes: tempRes
                    }]);
                  }
                  return gatheredSoFar;
                }, []);
                console.log("1434 ".concat("\x1B[".concat(35, "m", "matchedEntity BEFORE filtering = ".concat(JSON.stringify(matchedEntity, null, 4)), "\x1B[", 39, "m")));
                matchedEntity = removeGappedFromMixedCases(matchedEntity);
                console.log("1442 ".concat("\x1B[".concat(35, "m", "matchedEntity AFTER filtering = ".concat(JSON.stringify(matchedEntity, null, 4)), "\x1B[", 39, "m")));
                if (matchedEntity) {
                  var _matchedEntity = matchedEntity;
                  _tempEnt2 = _matchedEntity.tempEnt;
                  _tempRes2 = _matchedEntity.tempRes;
                }
                console.log("1452 ".concat("\x1B[".concat(33, "m", "tempEnt", "\x1B[", 39, "m"), " = ", _tempEnt2, "; ", "\x1B[".concat(33, "m", "tempRes", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(_tempRes2, null, 4)));
                var entitysValue;
                if (_tempEnt2) {
                  console.log("1473 ".concat("\x1B[".concat(32, "m", "entity ".concat(_tempEnt2, " is indeed on the right of index ").concat(letterSeqStartAt, ", the situation is: ").concat(JSON.stringify(_tempRes2, null, 4)), "\x1B[", 39, "m")));
                  var issue = false;
                  var _firstChar2 = _tempRes2.leftmostChar;
                  var _secondChar2 = stringLeftRight.right(str, _firstChar2);
                  console.log("1484 ".concat("\x1B[".concat(33, "m", "firstChar", "\x1B[", 39, "m"), ": str[", _firstChar2, "] = ").concat(str[_firstChar2], "; ", "\x1B[".concat(33, "m", "secondChar", "\x1B[", 39, "m"), ": str[").concat(_secondChar2, "] = ").concat(str[_secondChar2], "; ", "\x1B[".concat(33, "m", "potentialEntity", "\x1B[", 39, "m"), " = \"").concat(potentialEntity, "\""));
                  if (Object.keys(allNamedHtmlEntities.uncertain).includes(potentialEntity) && isStr(str[_firstChar2 - 1]) && !str[_firstChar2 - 1].trim().length && allNamedHtmlEntities.uncertain[potentialEntity].addAmpIfSemiPresent !== true) {
                    console.log("1505 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " CONTINUE - bail clauses"));
                    letterSeqStartAt = null;
                    return "continue";
                  }
                  if (Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith, str[_firstChar2]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith[str[_firstChar2]], str[_secondChar2]) && allNamedHtmlEntities.entStartsWith[str[_firstChar2]][str[_secondChar2]].includes(situation.charTrimmed)) {
                    entitysValue = situation.charTrimmed;
                    console.log("1528 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " entitysValue = ", entitysValue));
                    console.log("1531 entity ".concat("\x1B[".concat(32, "m", situation.charTrimmed, "\x1B[", 39, "m"), " is matched case-wise stricly"));
                    console.log("1538 i=".concat(i, " - whatsOnTheLeft=").concat(whatsOnTheLeft, " => ").concat(i - whatsOnTheLeft));
                    console.log("1541 tempEnt.length = ".concat(_tempEnt2.length));
                    if (i - whatsOnTheLeft - 1 === _tempEnt2.length) {
                      console.log("1544 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " entity is healthy"));
                      if (opts.decode) {
                        issue = "encoded-html-entity";
                      }
                    } else {
                      console.log("1552 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 entity has correct characters but has whitespace", "\x1B[", 39, "m")));
                      issue = "bad-named-html-entity-malformed";
                      console.log("1556 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " issue = ", JSON.stringify(issue, null, 0)));
                    }
                  } else {
                    console.log("1566 entity ".concat(situation.charTrimmed, " not found case-wise stricly"));
                    issue = "bad-named-html-entity-malformed";
                    console.log("1570 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "issue", "\x1B[", 39, "m"), " = ", JSON.stringify(issue, null, 0), ";"));
                    var matchingEntities = Object.keys(allNamedHtmlEntities.allNamedEntities).filter(function (entity) {
                      return situation.charTrimmed.toLowerCase().startsWith(entity.toLowerCase());
                    });
                    console.log("1591 SET ".concat("\x1B[".concat(33, "m", "matchingEntities", "\x1B[", 39, "m"), " = ", JSON.stringify(matchingEntities, null, 4)));
                    if (matchingEntities.length === 1) {
                      entitysValue = matchingEntities[0];
                      console.log("1602 SET ".concat("\x1B[".concat(33, "m", "entitysValue", "\x1B[", 39, "m"), " = ", JSON.stringify(entitysValue, null, 4)));
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
                      console.log("1628 SET ".concat("\x1B[".concat(33, "m", "filterLongest", "\x1B[", 39, "m"), " = ", JSON.stringify(filterLongest, null, 4)));
                      if (filterLongest.length === 1) {
                        entitysValue = filterLongest[0];
                        console.log("1638 SET ".concat("\x1B[".concat(33, "m", "entitysValue", "\x1B[", 39, "m"), " = ", JSON.stringify(entitysValue, null, 4)));
                      } else {
                        console.log("1645");
                        var missingLetters = filterLongest.map(function (entity) {
                          var count = 0;
                          for (var z = 0, _len = entity.length; z < _len; z++) {
                            if (entity[z] !== situation.charTrimmed[z]) {
                              count++;
                            }
                          }
                          return count;
                        });
                        if (missingLetters.filter(function (val) {
                          return val === Math.min.apply(Math, _toConsumableArray(missingLetters));
                        }).length > 1) {
                          console.log("1666 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " unrecognised to rangesArr2[]"), "\x1B[", 39, "m")));
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
                        console.log("1683 SET ".concat("\x1B[".concat(33, "m", "missingLetters", "\x1B[", 39, "m"), " = ", JSON.stringify(missingLetters, null, 4)));
                        entitysValue = filterLongest[missingLetters.indexOf(Math.min.apply(Math, _toConsumableArray(missingLetters)))];
                        console.log("1694 SET ".concat("\x1B[".concat(33, "m", "entitysValue", "\x1B[", 39, "m"), " = ", JSON.stringify(entitysValue, null, 4)));
                      }
                    }
                  }
                  var endingIdx = _tempRes2.rightmostChar + 1 === i ? i + 1 : _tempRes2.rightmostChar + 1;
                  console.log("1712 SET ".concat("\x1B[".concat(32, "m", "endingIdx", "\x1B[", 39, "m"), " = ", endingIdx));
                  if (issue) {
                    console.log("1718 ".concat("\x1B[".concat(90, "m", "within issue clauses", "\x1B[", 39, "m")));
                    var _decodedEntity3 = allNamedHtmlEntities.decode("&".concat(entitysValue, ";"));
                    console.log("1723 ".concat("\x1B[".concat(33, "m", "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588", "\x1B[", 39, "m"), "\ntempRes.rightmostChar + 1 = ", _tempRes2.rightmostChar + 1, "; i = ").concat(i));
                    if (str[endingIdx] && str[endingIdx] !== ";" && !str[endingIdx].trim().length && str[stringLeftRight.right(str, endingIdx)] === ";") {
                      endingIdx = stringLeftRight.right(str, endingIdx) + 1;
                      console.log("1735 OFFSET ".concat("\x1B[".concat(32, "m", "endingIdx", "\x1B[", 39, "m"), " = ", endingIdx));
                    }
                    console.log("1740 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
                      ruleName: "".concat(issue, "-").concat(entitysValue),
                      entityName: entitysValue,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: endingIdx,
                      rangeValEncoded: "&".concat(entitysValue, ";"),
                      rangeValDecoded: _decodedEntity3
                    }, null, 4)));
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
                    console.log("1765 call opts.entityCatcherCb()");
                    opts.entityCatcherCb(whatsOnTheLeft, endingIdx);
                  }
                }
              }
              if (!_tempEnt2) {
                console.log("1774 ".concat("\x1B[".concat(90, "m", "so it's not one of known named HTML entities", "\x1B[", 39, "m")));
                console.log("1777 ".concat("\x1B[".concat(90, "m", "checking for broken recognised entities", "\x1B[", 39, "m")));
                if (situation.charTrimmed.toLowerCase() !== "&nbsp;") {
                  console.log("1787 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " bad-named-html-entity-unrecognised [", whatsOnTheLeft, ", ").concat(i + 1, "]"));
                  rangesArr2.push({
                    ruleName: "bad-named-html-entity-unrecognised",
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                  if (opts.entityCatcherCb) {
                    console.log("1801 call opts.entityCatcherCb()");
                    opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                  }
                }
              }
            }
          }
        } else if (str[whatsEvenMoreToTheLeft] === "&" && str[i] === ";" && i - whatsEvenMoreToTheLeft < allNamedHtmlEntities.maxLength) {
          console.log("1833 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " might be a messy entity. We have \"", str.slice(whatsEvenMoreToTheLeft, i + 1), "\""));
          var _situation = resemblesNumericEntity(str, whatsEvenMoreToTheLeft + 1, i);
          console.log("1844 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 situation:", "\x1B[", 39, "m"), "\n", JSON.stringify(_situation, null, 4)));
          console.log("1853 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", whatsEvenMoreToTheLeft, ", ").concat(i + 1, "]"));
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
      console.log("1875 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "letterSeqStartAt", "\x1B[", 39, "m"), " = null"));
    }
    if (letterSeqStartAt === null && isLatinLetterOrNumberOrHash(str[i]) && str[i + 1]) {
      letterSeqStartAt = i;
      console.log("1889 SET ".concat("\x1B[".concat(33, "m", "letterSeqStartAt", "\x1B[", 39, "m"), " = ", letterSeqStartAt));
    }
    if (str[i] === "a") {
      console.log("1897 ".concat("\x1B[".concat(90, "m", "within a clauses", "\x1B[", 39, "m")));
      var singleAmpOnTheRight = stringLeftRight.rightSeq(str, i, "m", "p", ";");
      if (singleAmpOnTheRight) {
        console.log("1907 ".concat("\x1B[".concat(90, "m", "confirmed amp; from index ".concat(i, " onwards"), "\x1B[", 39, "m")));
        var toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
        console.log("1914 SET ".concat("\x1B[".concat(33, "m", "toDeleteAllAmpEndHere", "\x1B[", 39, "m"), " = ", toDeleteAllAmpEndHere));
        var nextAmpOnTheRight = stringLeftRight.rightSeq(str, singleAmpOnTheRight.rightmostChar, "a", "m", "p", ";");
        if (nextAmpOnTheRight) {
          console.log("1928 ".concat("\x1B[".concat(90, "m", "confirmed another amp; on the right of index ".concat(singleAmpOnTheRight.rightmostChar), "\x1B[", 39, "m")));
          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
          console.log("1933 SET ".concat("\x1B[".concat(33, "m", "toDeleteAllAmpEndHere", "\x1B[", 39, "m"), " = ", toDeleteAllAmpEndHere));
          var temp;
          do {
            console.log("1939 ".concat("\x1B[".concat(36, "m", "======== loop ========", "\x1B[", 39, "m")));
            temp = stringLeftRight.rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");
            console.log("1943 ".concat("\x1B[".concat(36, "m", "temp = ".concat(JSON.stringify(temp, null, 4)), "\x1B[", 39, "m")));
            if (temp) {
              toDeleteAllAmpEndHere = temp.rightmostChar + 1;
              console.log("1953 ".concat("\x1B[".concat(36, "m", "another amp; confirmed! Now", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "toDeleteAllAmpEndHere", "\x1B[", 39, "m"), " = ", JSON.stringify(toDeleteAllAmpEndHere, null, 4), ";"));
            }
          } while (temp);
          console.log("1963 FINAL ".concat("\x1B[".concat(32, "m", "toDeleteAllAmpEndHere", "\x1B[", 39, "m"), " = ", JSON.stringify(toDeleteAllAmpEndHere, null, 4)));
        }
        var firstCharThatFollows = stringLeftRight.right(str, toDeleteAllAmpEndHere - 1);
        var secondCharThatFollows = firstCharThatFollows ? stringLeftRight.right(str, firstCharThatFollows) : null;
        console.log("1982 SET initial ".concat("\x1B[".concat(33, "m", "firstCharThatFollows", "\x1B[", 39, "m"), " = str[", firstCharThatFollows, "] = ").concat(str[firstCharThatFollows], "; ", "\x1B[".concat(33, "m", "secondCharThatFollows", "\x1B[", 39, "m"), " = str[").concat(secondCharThatFollows, "] = ").concat(str[secondCharThatFollows]));
        var matchedTemp;
        var matchedVal;
        if (secondCharThatFollows && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith, str[firstCharThatFollows]) && Object.prototype.hasOwnProperty.call(allNamedHtmlEntities.entStartsWith[str[firstCharThatFollows]], str[secondCharThatFollows]) && allNamedHtmlEntities.entStartsWith[str[firstCharThatFollows]][str[secondCharThatFollows]].some(function (entity) {
          var matchEntityOnTheRight = stringLeftRight.rightSeq.apply(void 0, [str, toDeleteAllAmpEndHere - 1].concat(_toConsumableArray(entity.slice(""))));
          if (matchEntityOnTheRight) {
            matchedTemp = entity;
            matchedVal = matchEntityOnTheRight;
            return true;
          }
        })) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1;
          console.log("2023 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 ACTIVATE doNothingUntil = ".concat(doNothingUntil), "\x1B[", 39, "m")));
          console.log("2027 ENTITY ".concat("\x1B[".concat(32, "m", matchedTemp, "\x1B[", 39, "m"), " FOLLOWS"));
          var _whatsOnTheLeft = stringLeftRight.left(str, i);
          if (str[_whatsOnTheLeft] === "&") {
            console.log("2033 ampersand on the left");
            console.log("2035 ".concat("\x1B[".concat(33, "m", "matchedTemp", "\x1B[", 39, "m"), " = ", JSON.stringify(matchedTemp, null, 4), "; ", "\x1B[".concat(33, "m", "matchedVal", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(matchedVal, null, 4)));
            console.log("2046 push ".concat(JSON.stringify({
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
            var rangeFrom = i;
            console.log("2072 rangeFrom = ".concat(rangeFrom));
            var spaceReplacement = "";
            if (str[i - 1] === " ") {
              console.log("2076");
            }
            console.log("2080 final rangeFrom = ".concat(rangeFrom));
            if (opts.cb) {
              console.log("2084 push ".concat(JSON.stringify({
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
      console.log("2117 ".concat("\x1B[".concat(90, "m", "& caught", "\x1B[", 39, "m")));
      if (nbsp.nameStartsAt && nbsp.nameStartsAt < i && (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)) {
        console.log("2126 ".concat("\x1B[".concat(31, "m", "WIPE", "\x1B[", 39, "m"), " nbsp markers because ampersand follows a tag beginning"));
        nbspWipe();
      }
      if (nbsp.nameStartsAt === null) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = i;
          console.log("2141 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
          nbsp.ampersandNecessary = false;
          console.log("2147 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = ", nbsp.ampersandNecessary));
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      if (str[i - 1] && str[i - 1].toLowerCase() === "i" && str[i + 1] && str[i + 1].toLowerCase() === "s") {
        console.log("2164 pattern ...ins... detected - bail");
        nbspWipe();
        counter++;
        return "continue|outerloop";
      }
      console.log("2171 n caught");
      if (nbsp.matchedN === null) {
        nbsp.matchedN = i;
        console.log("2175 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedN", "\x1B[", 39, "m"), " = ", nbsp.matchedN));
      }
      if (nbsp.nameStartsAt === null) {
        nbsp.nameStartsAt = i;
        console.log("2184 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
        }
        console.log("2197 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = ", nbsp.ampersandNecessary));
      }
    }
    if (str[i] && str[i].toLowerCase() === "b") {
      console.log("2206 b caught");
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedB === null) {
          nbsp.matchedB = i;
          console.log("2212 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedB", "\x1B[", 39, "m"), " = ", nbsp.matchedB));
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        console.log("2224 MINUSMINUS ".concat("\x1B[".concat(33, "m", "nbsp.patience", "\x1B[", 39, "m"), ", then it's ", nbsp.patience));
        nbsp.nameStartsAt = i;
        console.log("2232 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
        nbsp.matchedB = i;
        console.log("2238 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedB", "\x1B[", 39, "m"), " = true"));
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log("2246 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = true"));
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
          console.log("2252 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = false"));
        }
      } else {
        nbspWipe();
        console.log("2258 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
        counter++;
        return "continue|outerloop";
      }
    }
    if (str[i] && str[i].toLowerCase() === "s") {
      console.log("2266 s caught");
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.matchedS === null) {
          nbsp.matchedS = i;
          console.log("2272 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedS", "\x1B[", 39, "m"), " = ", nbsp.matchedS));
        }
      } else if (nbsp.patience) {
        nbsp.patience--;
        console.log("2284 MINUSMINUS ".concat("\x1B[".concat(33, "m", "nbsp.patience", "\x1B[", 39, "m"), ", then it's ", nbsp.patience));
        nbsp.nameStartsAt = i;
        console.log("2292 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
        nbsp.matchedS = i;
        console.log("2298 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedS", "\x1B[", 39, "m"), " = true"));
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log("2306 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = true"));
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
          console.log("2312 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = false"));
        }
      } else {
        nbspWipe();
        console.log("2318 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
        counter++;
        return "continue|outerloop";
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      if (stringLeftRight.leftSeq(str, i, "t", "h", "i", "n", "s")) {
        nbspWipe();
        console.log("2328 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
      } else if (nbsp.nameStartsAt !== null) {
        console.log("2330 p caught");
        if (nbsp.matchedP === null) {
          nbsp.matchedP = i;
          console.log("2335 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedP", "\x1B[", 39, "m"), " = ", nbsp.matchedP));
        }
      } else if (nbsp.patience) {
        console.log("2341 p caught");
        nbsp.patience--;
        console.log("2348 MINUSMINUS ".concat("\x1B[".concat(33, "m", "nbsp.patience", "\x1B[", 39, "m"), ", then it's ", nbsp.patience));
        nbsp.nameStartsAt = i;
        console.log("2356 SET ".concat("\x1B[".concat(33, "m", "nbsp.nameStartsAt", "\x1B[", 39, "m"), " = ", nbsp.nameStartsAt));
        nbsp.matchedP = i;
        console.log("2362 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedP", "\x1B[", 39, "m"), " = true"));
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log("2370 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = true"));
        } else if (nbsp.ampersandNecessary !== true) {
          nbsp.ampersandNecessary = false;
          console.log("2376 SET ".concat("\x1B[".concat(33, "m", "nbsp.ampersandNecessary", "\x1B[", 39, "m"), " = false"));
        }
      } else {
        nbspWipe();
        console.log("2382 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
        counter++;
        return "continue|outerloop";
      }
    }
    if (str[i] === ";") {
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedSemicol = i;
        console.log("2393 SET ".concat("\x1B[".concat(33, "m", "nbsp.matchedSemicol", "\x1B[", 39, "m"), " = ", nbsp.matchedSemicol));
        if (nbsp.matchedN &&
        !nbsp.matchedB && !nbsp.matchedS && !nbsp.matchedP || !nbsp.matchedN && nbsp.matchedB &&
        !nbsp.matchedS && !nbsp.matchedP || !nbsp.matchedN && !nbsp.matchedB && nbsp.matchedS &&
        !nbsp.matchedP || !nbsp.matchedN && !nbsp.matchedB && !nbsp.matchedS && nbsp.matchedP
        ) {
            nbspWipe();
            console.log("2416 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
          }
      }
    }
    if (str[i] === "#" && stringLeftRight.right(str, i) && str[stringLeftRight.right(str, i)].toLowerCase() === "x" && (!str[i - 1] || !stringLeftRight.left(str, i) || str[stringLeftRight.left(str, i)] !== "&")) {
      console.log("2429 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " #x pattern caught"));
      if (isNumber(str[stringLeftRight.right(str, stringLeftRight.right(str, i))])) {
        brokenNumericEntityStartAt = i;
      }
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
      console.log("2459 SET ".concat("\x1B[".concat(33, "m", "state_AmpersandNotNeeded", "\x1B[", 39, "m"), " = ", JSON.stringify(state_AmpersandNotNeeded, null, 4)));
      if (nbsp.nameStartsAt && (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)) {
        nbsp.ampersandNecessary = false;
      }
    }
    if (nbsp.nameStartsAt !== null && i > nbsp.nameStartsAt && str[i] && str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" && str[i] !== "&" && str[i] !== ";" && str[i] !== " ") {
      if (nbsp.patience) {
        nbsp.patience = nbsp.patience - 1;
        console.log("2496 nbsp.patience--, now equal to: ".concat(nbsp.patience));
      } else {
        nbspWipe();
        console.log("2499 WIPE ".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m")));
        counter++;
        return "continue|outerloop";
      }
    }
    console.log("---------------");
    console.log("2518 ".concat("\x1B[".concat(90, "m", "letterSeqStartAt = ".concat(letterSeqStartAt), "\x1B[", 39, "m")));
    console.log("".concat("\x1B[".concat(33, "m", "nbsp", "\x1B[", 39, "m"), " = ", JSON.stringify(nbsp, null, 4)).concat(Array.isArray(rangesArr2) && rangesArr2.length ? "\n".concat("\x1B[".concat(32, "m", "rangesArr2", "\x1B[", 39, "m"), " = ", JSON.stringify(rangesArr2, null, 4)) : ""));
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
    console.log("2556 ".concat("\x1B[".concat(32, "m", "RETURN", "\x1B[", 39, "m"), " empty array"));
    return [];
  }
  console.log("2561 IN THE END, before merge rangesArr2 = ".concat(JSON.stringify(rangesArr2, null, 4)));
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
  console.log("2617 RETURN ".concat("\x1B[".concat(33, "m", "res", "\x1B[", 39, "m"), " = ", JSON.stringify(res, null, 4)));
  return res;
}

module.exports = stringFixBrokenNamedEntities;

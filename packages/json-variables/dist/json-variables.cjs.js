/**
 * @name json-variables
 * @fileoverview Resolves custom-marked, cross-referenced paths in parsed JSON
 * @version 10.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/json-variables/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var astMonkeyTraverse = require('ast-monkey-traverse');
var matcher = require('matcher');
var objectPath = require('object-path');
var arrayiffyIfString = require('arrayiffy-if-string');
var stringFindHeadsTails = require('string-find-heads-tails');
var astGetValuesByKey = require('ast-get-values-by-key');
var rangesPush = require('ranges-push');
var rangesApply = require('ranges-apply');
var stringRemoveDuplicateHeadsTails = require('string-remove-duplicate-heads-tails');
var stringMatchLeftRight = require('string-match-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);
var objectPath__default = /*#__PURE__*/_interopDefaultLegacy(objectPath);

var version$1 = "10.0.14";

var version = version$1;
var has = Object.prototype.hasOwnProperty;
var defaults = {
  heads: "%%_",
  tails: "_%%",
  headsNoWrap: "%%-",
  tailsNoWrap: "-%%",
  lookForDataContainers: true,
  dataContainerIdentifierTails: "_data",
  wrapHeadsWith: "",
  wrapTailsWith: "",
  dontWrapVars: [],
  preventDoubleWrapping: true,
  wrapGlobalFlipSwitch: true,
  noSingleMarkers: false,
  resolveToBoolIfAnyValuesContainBool: true,
  resolveToFalseIfAnyValuesContainBool: true,
  throwWhenNonStringInsertedInString: false,
  allowUnresolved: false
};
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isBool(something) {
  return typeof something === "boolean";
}
function isNull(something) {
  return something === null;
}
function isObj(something) {
  return something && _typeof__default['default'](something) === "object" && !Array.isArray(something);
}
function existy(x) {
  return x != null;
}
function trimIfString(something) {
  return isStr(something) ? something.trim() : something;
}
function getTopmostKey(str) {
  if (typeof str === "string" && str.length > 0 && str.indexOf(".") !== -1) {
    for (var i = 0, len = str.length; i < len; i++) {
      if (str[i] === ".") {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
function withoutTopmostKey(str) {
  if (typeof str === "string" && str.length > 0 && str.indexOf(".") !== -1) {
    for (var i = 0, len = str.length; i < len; i++) {
      if (str[i] === ".") {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
function goLevelUp(str) {
  if (typeof str === "string" && str.length > 0 && str.indexOf(".") !== -1) {
    for (var i = str.length; i--;) {
      if (str[i] === ".") {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
function getLastKey(str) {
  if (typeof str === "string" && str.length > 0 && str.indexOf(".") !== -1) {
    for (var i = str.length; i--;) {
      if (str[i] === ".") {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
function containsHeadsOrTails(str, opts) {
  if (typeof str !== "string" || !str.trim()) {
    return false;
  }
  if (str.includes(opts.heads) || str.includes(opts.tails) || isStr(opts.headsNoWrap) && opts.headsNoWrap.length > 0 && str.includes(opts.headsNoWrap) || isStr(opts.tailsNoWrap) && opts.tailsNoWrap.length > 0 && str.includes(opts.tailsNoWrap)) {
    return true;
  }
  return false;
}
function removeWrappingHeadsAndTails(str, heads, tails) {
  var tempFrom;
  var tempTo;
  if (typeof str === "string" && str.length > 0 && stringMatchLeftRight.matchRightIncl(str, 0, heads, {
    trimBeforeMatching: true,
    cb: function cb(_c, _t, index) {
      tempFrom = index;
      return true;
    }
  }) && stringMatchLeftRight.matchLeftIncl(str, str.length - 1, tails, {
    trimBeforeMatching: true,
    cb: function cb(_c, _t, index) {
      tempTo = index + 1;
      return true;
    }
  })) {
    return str.slice(tempFrom, tempTo);
  }
  return str;
}
function wrap(placementValue, opts) {
  var dontWrapTheseVars = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var oldVarName = arguments.length > 5 ? arguments[5] : undefined;
  if (!opts.wrapHeadsWith) {
    opts.wrapHeadsWith = "";
  }
  if (!opts.wrapTailsWith) {
    opts.wrapTailsWith = "";
  }
  if (isStr(placementValue) && !dontWrapTheseVars && opts.wrapGlobalFlipSwitch && !opts.dontWrapVars.some(function (val) {
    return matcher__default['default'].isMatch(oldVarName, val);
  }) && (
  !opts.preventDoubleWrapping || opts.preventDoubleWrapping && isStr(placementValue) && !placementValue.includes(opts.wrapHeadsWith) && !placementValue.includes(opts.wrapTailsWith))) {
    return opts.wrapHeadsWith + placementValue + opts.wrapTailsWith;
  }
  if (dontWrapTheseVars) {
    if (!isStr(placementValue)) {
      return placementValue;
    }
    var tempValue = stringRemoveDuplicateHeadsTails.remDup(placementValue, {
      heads: opts.wrapHeadsWith,
      tails: opts.wrapTailsWith
    });
    if (!isStr(tempValue)) {
      return tempValue;
    }
    return removeWrappingHeadsAndTails(tempValue, opts.wrapHeadsWith, opts.wrapTailsWith);
  }
  return placementValue;
}
function findValues(input, varName, path, opts) {
  var resolveValue;
  if (path.indexOf(".") !== -1) {
    var currentPath = path;
    var handBrakeOff = true;
    if (opts.lookForDataContainers && typeof opts.dataContainerIdentifierTails === "string" && opts.dataContainerIdentifierTails.length > 0 && !currentPath.endsWith(opts.dataContainerIdentifierTails)) {
      var gotPath = objectPath__default['default'].get(input, currentPath + opts.dataContainerIdentifierTails);
      if (isObj(gotPath) && objectPath__default['default'].get(gotPath, varName)) {
        resolveValue = objectPath__default['default'].get(gotPath, varName);
        handBrakeOff = false;
      }
    }
    while (handBrakeOff && currentPath.indexOf(".") !== -1) {
      currentPath = goLevelUp(currentPath);
      if (getLastKey(currentPath) === varName) {
        throw new Error("json-variables/findValues(): [THROW_ID_20] While trying to resolve: \"".concat(varName, "\" at path \"").concat(path, "\", we encountered a closed loop. The parent key \"").concat(getLastKey(currentPath), "\" is called the same as the variable \"").concat(varName, "\" we're looking for."));
      }
      if (opts.lookForDataContainers && typeof opts.dataContainerIdentifierTails === "string" && opts.dataContainerIdentifierTails.length > 0 && !currentPath.endsWith(opts.dataContainerIdentifierTails)) {
        var _gotPath = objectPath__default['default'].get(input, currentPath + opts.dataContainerIdentifierTails);
        if (isObj(_gotPath) && objectPath__default['default'].get(_gotPath, varName)) {
          resolveValue = objectPath__default['default'].get(_gotPath, varName);
          handBrakeOff = false;
        }
      }
      if (resolveValue === undefined) {
        var _gotPath2 = objectPath__default['default'].get(input, currentPath);
        if (isObj(_gotPath2) && objectPath__default['default'].get(_gotPath2, varName)) {
          resolveValue = objectPath__default['default'].get(_gotPath2, varName);
          handBrakeOff = false;
        }
      }
    }
  }
  if (resolveValue === undefined) {
    var _gotPath3 = objectPath__default['default'].get(input, varName);
    if (_gotPath3 !== undefined) {
      resolveValue = _gotPath3;
    }
  }
  if (resolveValue === undefined) {
    if (varName.indexOf(".") === -1) {
      var gotPathArr = astGetValuesByKey.getByKey(input, varName);
      if (gotPathArr.length > 0) {
        for (var y = 0, len2 = gotPathArr.length; y < len2; y++) {
          if (isStr(gotPathArr[y].val) || isBool(gotPathArr[y].val) || isNull(gotPathArr[y].val)) {
            resolveValue = gotPathArr[y].val;
            break;
          } else if (isNum(gotPathArr[y].val)) {
            resolveValue = String(gotPathArr[y].val);
            break;
          } else if (Array.isArray(gotPathArr[y].val)) {
            resolveValue = gotPathArr[y].val.join("");
            break;
          } else {
            throw new Error("json-variables/findValues(): [THROW_ID_21] While trying to resolve: \"".concat(varName, "\" at path \"").concat(path, "\", we actually found the key named ").concat(varName, ", but it was not equal to a string but to:\n").concat(JSON.stringify(gotPathArr[y], null, 4), "\nWe can't resolve a string with that! It should be a string."));
          }
        }
      }
    } else {
      var _gotPath4 = astGetValuesByKey.getByKey(input, getTopmostKey(varName));
      if (_gotPath4.length > 0) {
        for (var _y = 0, _len = _gotPath4.length; _y < _len; _y++) {
          var temp = objectPath__default['default'].get(_gotPath4[_y].val, withoutTopmostKey(varName));
          if (temp && isStr(temp)) {
            resolveValue = temp;
          }
        }
      }
    }
  }
  return resolveValue;
}
function resolveString(input, string, path, opts) {
  var incomingBreadCrumbPath = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  if (incomingBreadCrumbPath.includes(path)) {
    var extra = "";
    if (incomingBreadCrumbPath.length > 1) {
      var separator = " →\n";
      extra = incomingBreadCrumbPath.reduce(function (accum, curr, idx) {
        return accum + (idx === 0 ? "" : separator) + (curr === path ? "💥 " : "  ") + curr;
      }, " Here's the path we travelled up until we hit the recursion:\n\n");
      extra += "".concat(separator, "\uD83D\uDCA5 ").concat(path);
    }
    throw new Error("json-variables/resolveString(): [THROW_ID_19] While trying to resolve: \"".concat(string, "\" at path \"").concat(path, "\", we encountered a closed loop, the key is referencing itself.\"").concat(extra));
  }
  var secretResolvedVarsStash = {};
  var breadCrumbPath = Array.from(incomingBreadCrumbPath);
  breadCrumbPath.push(path);
  var finalRangesArr = new rangesPush.Ranges();
  function processHeadsAndTails(arr, dontWrapTheseVars, wholeValueIsVariable) {
    for (var i = 0, len = arr.length; i < len; i++) {
      var obj = arr[i];
      var varName = string.slice(obj.headsEndAt, obj.tailsStartAt);
      if (varName.length === 0) {
        finalRangesArr.push(obj.headsStartAt,
        obj.tailsEndAt
        );
      } else if (has.call(secretResolvedVarsStash, varName) && isStr(secretResolvedVarsStash[varName])) {
        finalRangesArr.push(obj.headsStartAt,
        obj.tailsEndAt,
        secretResolvedVarsStash[varName]
        );
      } else {
        var resolvedValue = findValues(input,
        varName.trim(),
        path,
        opts
        );
        if (resolvedValue === undefined) {
          if (opts.allowUnresolved === true) {
            resolvedValue = "";
          } else if (typeof opts.allowUnresolved === "string") {
            resolvedValue = opts.allowUnresolved;
          } else {
            throw new Error("json-variables/processHeadsAndTails(): [THROW_ID_18] We couldn't find the value to resolve the variable ".concat(string.slice(obj.headsEndAt, obj.tailsStartAt), ". We're at path: \"").concat(path, "\"."));
          }
        }
        if (!wholeValueIsVariable && opts.throwWhenNonStringInsertedInString && !isStr(resolvedValue)) {
          throw new Error("json-variables/processHeadsAndTails(): [THROW_ID_23] While resolving the variable ".concat(string.slice(obj.headsEndAt, obj.tailsStartAt), " at path ").concat(path, ", it resolved into a non-string value, ").concat(JSON.stringify(resolvedValue, null, 4), ". This is happening because options setting \"throwWhenNonStringInsertedInString\" is active (set to \"true\")."));
        }
        if (isBool(resolvedValue)) {
          if (opts.resolveToBoolIfAnyValuesContainBool) {
            finalRangesArr.wipe();
            if (!opts.resolveToFalseIfAnyValuesContainBool) {
              return resolvedValue;
            }
            return false;
          }
          resolvedValue = "";
        } else if (isNull(resolvedValue) && wholeValueIsVariable) {
          finalRangesArr.wipe();
          return resolvedValue;
        } else if (Array.isArray(resolvedValue)) {
          resolvedValue = String(resolvedValue.join(""));
        } else if (isNull(resolvedValue)) {
          resolvedValue = "";
        } else {
          resolvedValue = String(resolvedValue);
        }
        var newPath = path.includes(".") ? "".concat(goLevelUp(path), ".").concat(varName) : varName;
        if (containsHeadsOrTails(resolvedValue, opts)) {
          var replacementVal = wrap(resolveString(
          input, resolvedValue, newPath, opts, breadCrumbPath), opts, dontWrapTheseVars, breadCrumbPath, newPath, varName.trim());
          if (isStr(replacementVal)) {
            finalRangesArr.push(obj.headsStartAt,
            obj.tailsEndAt,
            replacementVal);
          }
        } else {
          secretResolvedVarsStash[varName] = resolvedValue;
          var _replacementVal = wrap(resolvedValue, opts, dontWrapTheseVars, breadCrumbPath, newPath, varName.trim());
          if (isStr(_replacementVal)) {
            finalRangesArr.push(obj.headsStartAt,
            obj.tailsEndAt,
            _replacementVal);
          }
        }
      }
    }
    return undefined;
  }
  var foundHeadsAndTails;
  try {
    foundHeadsAndTails = stringFindHeadsTails.strFindHeadsTails(string, opts.heads, opts.tails, {
      source: "",
      throwWhenSomethingWrongIsDetected: false
    });
  } catch (error) {
    throw new Error("json-variables/resolveString(): [THROW_ID_17] While trying to resolve string: \"".concat(string, "\" at path ").concat(path, ", something wrong with heads and tails was detected! Here's the internal error message:\n").concat(error));
  }
  var wholeValueIsVariable = false;
  if (foundHeadsAndTails.length === 1 && rangesApply.rApply(string, [[foundHeadsAndTails[0].headsStartAt, foundHeadsAndTails[0].tailsEndAt]]).trim() === "") {
    wholeValueIsVariable = true;
  }
  var temp1 = processHeadsAndTails(foundHeadsAndTails, false, wholeValueIsVariable);
  if (isBool(temp1)) {
    return temp1;
  }
  if (isNull(temp1)) {
    return temp1;
  }
  try {
    foundHeadsAndTails = stringFindHeadsTails.strFindHeadsTails(string, opts.headsNoWrap, opts.tailsNoWrap, {
      source: "",
      throwWhenSomethingWrongIsDetected: false
    });
  } catch (error) {
    throw new Error("json-variables/resolveString(): [THROW_ID_22] While trying to resolve string: \"".concat(string, "\" at path ").concat(path, ", something wrong with no-wrap heads and no-wrap tails was detected! Here's the internal error message:\n").concat(error));
  }
  if (foundHeadsAndTails.length === 1 && rangesApply.rApply(string, [[foundHeadsAndTails[0].headsStartAt, foundHeadsAndTails[0].tailsEndAt]]).trim() === "") {
    wholeValueIsVariable = true;
  }
  var temp2 = processHeadsAndTails(foundHeadsAndTails, true, wholeValueIsVariable);
  if (isBool(temp2)) {
    return temp2;
  }
  if (isNull(temp2)) {
    return temp2;
  }
  if (finalRangesArr && finalRangesArr.current()) {
    return rangesApply.rApply(string, finalRangesArr.current());
  }
  return string;
}
function jVar(input, originalOpts) {
  if (!arguments.length) {
    throw new Error("json-variables/jVar(): [THROW_ID_01] Alas! Inputs are missing!");
  }
  if (!isObj(input)) {
    throw new TypeError("json-variables/jVar(): [THROW_ID_02] Alas! The input must be a plain object! Currently it's: ".concat(Array.isArray(input) ? "array" : _typeof__default['default'](input)));
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError("json-variables/jVar(): [THROW_ID_03] Alas! An Optional Options Object must be a plain object! Currently it's: ".concat(Array.isArray(originalOpts) ? "array" : _typeof__default['default'](originalOpts)));
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (!opts.dontWrapVars) {
    opts.dontWrapVars = [];
  } else if (!Array.isArray(opts.dontWrapVars)) {
    opts.dontWrapVars = arrayiffyIfString.arrayiffy(opts.dontWrapVars);
  }
  var culpritVal;
  var culpritIndex;
  if (opts.dontWrapVars.length > 0 && !opts.dontWrapVars.every(function (el, idx) {
    if (!isStr(el)) {
      culpritVal = el;
      culpritIndex = idx;
      return false;
    }
    return true;
  })) {
    throw new Error("json-variables/jVar(): [THROW_ID_05] Alas! All variable names set in opts.dontWrapVars should be of a string type. Computer detected a value \"".concat(culpritVal, "\" at index ").concat(culpritIndex, ", which is not string but ").concat(Array.isArray(culpritVal) ? "array" : _typeof__default['default'](culpritVal), "!"));
  }
  if (opts.heads === "") {
    throw new Error("json-variables/jVar(): [THROW_ID_06] Alas! opts.heads are empty!");
  }
  if (opts.tails === "") {
    throw new Error("json-variables/jVar(): [THROW_ID_07] Alas! opts.tails are empty!");
  }
  if (opts.lookForDataContainers && opts.dataContainerIdentifierTails === "") {
    throw new Error("json-variables/jVar(): [THROW_ID_08] Alas! opts.dataContainerIdentifierTails is empty!");
  }
  if (opts.heads === opts.tails) {
    throw new Error("json-variables/jVar(): [THROW_ID_09] Alas! opts.heads and opts.tails can't be equal!");
  }
  if (opts.heads === opts.headsNoWrap) {
    throw new Error("json-variables/jVar(): [THROW_ID_10] Alas! opts.heads and opts.headsNoWrap can't be equal!");
  }
  if (opts.tails === opts.tailsNoWrap) {
    throw new Error("json-variables/jVar(): [THROW_ID_11] Alas! opts.tails and opts.tailsNoWrap can't be equal!");
  }
  if (opts.headsNoWrap === "") {
    throw new Error("json-variables/jVar(): [THROW_ID_12] Alas! opts.headsNoWrap is an empty string!");
  }
  if (opts.tailsNoWrap === "") {
    throw new Error("json-variables/jVar(): [THROW_ID_13] Alas! opts.tailsNoWrap is an empty string!");
  }
  if (opts.headsNoWrap === opts.tailsNoWrap) {
    throw new Error("json-variables/jVar(): [THROW_ID_14] Alas! opts.headsNoWrap and opts.tailsNoWrap can't be equal!");
  }
  var current;
  return astMonkeyTraverse.traverse(input, function (key, val, innerObj) {
    if (existy(val) && containsHeadsOrTails(key, opts)) {
      throw new Error("json-variables/jVar(): [THROW_ID_15] Alas! Object keys can't contain variables!\nPlease check the following key: ".concat(key));
    }
    if (val !== undefined) {
      current = val;
    } else {
      current = key;
    }
    if (current === "") {
      return current;
    }
    if (opts.heads.length !== 0 && trimIfString(current) === trimIfString(opts.heads) || opts.tails.length !== 0 && trimIfString(current) === trimIfString(opts.tails) || opts.headsNoWrap.length !== 0 && trimIfString(current) === trimIfString(opts.headsNoWrap) || opts.tailsNoWrap.length !== 0 && trimIfString(current) === trimIfString(opts.tailsNoWrap)) {
      if (!opts.noSingleMarkers) {
        return current;
      }
      throw new Error("json-variables/jVar(): [THROW_ID_16] Alas! While processing the input, we stumbled upon ".concat(trimIfString(current), " which is equal to ").concat(trimIfString(current) === trimIfString(opts.heads) ? "heads" : "").concat(trimIfString(current) === trimIfString(opts.tails) ? "tails" : "").concat(isStr(opts.headsNoWrap) && trimIfString(current) === trimIfString(opts.headsNoWrap) ? "headsNoWrap" : "").concat(isStr(opts.tailsNoWrap) && trimIfString(current) === trimIfString(opts.tailsNoWrap) ? "tailsNoWrap" : "", ". If you wouldn't have set opts.noSingleMarkers to \"true\" this error would not happen and computer would have left the current element (").concat(trimIfString(current), ") alone"));
    }
    if (isStr(current) && containsHeadsOrTails(current, opts)) {
      return resolveString(input, current, innerObj.path, opts);
    }
    return current;
  });
}

exports.defaults = defaults;
exports.jVar = jVar;
exports.version = version;

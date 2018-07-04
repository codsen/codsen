'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var traverse = _interopDefault(require('ast-monkey-traverse'));
var matcher = _interopDefault(require('matcher'));
var objectPath = _interopDefault(require('object-path'));
var checkTypes = _interopDefault(require('check-types-mini'));
var arrayiffyIfString = _interopDefault(require('arrayiffy-if-string'));
var strFindHeadsTails = _interopDefault(require('string-find-heads-tails'));
var get = _interopDefault(require('ast-get-values-by-key'));
var Ranges = _interopDefault(require('ranges-push'));
var rangesApply = _interopDefault(require('ranges-apply'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var removeDuplicateHeadsTails = _interopDefault(require('string-remove-duplicate-heads-tails'));
var stringMatchLeftRight = require('string-match-left-right');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var isArr = Array.isArray;
var has = Object.prototype.hasOwnProperty;
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
  if (typeof str !== "string" || str.trim().length === 0) {
    return false;
  }
  if (str.includes(opts.heads) || str.includes(opts.tails) || isStr(opts.headsNoWrap) && opts.headsNoWrap.length > 0 && str.includes(opts.headsNoWrap) || isStr(opts.tailsNoWrap) && opts.tailsNoWrap.length > 0 && str.includes(opts.tailsNoWrap)) {
    return true;
  }
  return false;
}
function removeWrappingHeadsAndTails(str, heads, tails) {
  var tempFrom = void 0;
  var tempTo = void 0;
  if (typeof str === "string" && str.length > 0 && stringMatchLeftRight.matchRightIncl(str, 0, heads, {
    trimBeforeMatching: true,
    cb: function cb(char, theRemainderOfTheString, index) {
      tempFrom = index;
      return true;
    }
  }) && stringMatchLeftRight.matchLeftIncl(str, str.length - 1, tails, {
    trimBeforeMatching: true,
    cb: function cb(char, theRemainderOfTheString, index) {
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
  var oldVarName = arguments[5];
  if (isStr(placementValue) && !dontWrapTheseVars && opts.wrapGlobalFlipSwitch && !opts.dontWrapVars.some(function (val) {
    return matcher.isMatch(oldVarName, val);
  }) && (
  !opts.preventDoubleWrapping || opts.preventDoubleWrapping && isStr(placementValue) && !placementValue.includes(opts.wrapHeadsWith) && !placementValue.includes(opts.wrapTailsWith))) {
    return opts.wrapHeadsWith + placementValue + opts.wrapTailsWith;
  } else if (dontWrapTheseVars) {
    if (!isStr(placementValue)) {
      return placementValue;
    }
    var tempValue = removeDuplicateHeadsTails(placementValue, {
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
  var resolveValue = void 0;
  if (path.indexOf(".") !== -1) {
    var currentPath = path;
    var handBrakeOff = true;
    if (opts.lookForDataContainers && typeof opts.dataContainerIdentifierTails === "string" && opts.dataContainerIdentifierTails.length > 0 && !currentPath.endsWith(opts.dataContainerIdentifierTails)) {
      var gotPath = objectPath.get(input, currentPath + opts.dataContainerIdentifierTails);
      if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
        resolveValue = objectPath.get(gotPath, varName);
        handBrakeOff = false;
      }
    }
    while (handBrakeOff && currentPath.indexOf(".") !== -1) {
      currentPath = goLevelUp(currentPath);
      if (getLastKey(currentPath) === varName) {
        throw new Error("json-variables/findValues(): [THROW_ID_20] While trying to resolve: \"" + varName + "\" at path \"" + path + "\", we encountered a closed loop. The parent key \"" + getLastKey(currentPath) + "\" is called the same as the variable \"" + varName + "\" we're looking for.");
      }
      if (opts.lookForDataContainers && typeof opts.dataContainerIdentifierTails === "string" && opts.dataContainerIdentifierTails.length > 0 && !currentPath.endsWith(opts.dataContainerIdentifierTails)) {
        var _gotPath = objectPath.get(input, currentPath + opts.dataContainerIdentifierTails);
        if (isObj(_gotPath) && objectPath.get(_gotPath, varName)) {
          resolveValue = objectPath.get(_gotPath, varName);
          handBrakeOff = false;
        }
      }
      if (resolveValue === undefined) {
        var _gotPath2 = objectPath.get(input, currentPath);
        if (isObj(_gotPath2) && objectPath.get(_gotPath2, varName)) {
          resolveValue = objectPath.get(_gotPath2, varName);
          handBrakeOff = false;
        }
      }
    }
  }
  if (resolveValue === undefined) {
    var _gotPath3 = objectPath.get(input, varName);
    if (_gotPath3 !== undefined) {
      resolveValue = _gotPath3;
    }
  }
  if (resolveValue === undefined) {
    if (varName.indexOf(".") === -1) {
      var _gotPath4 = get(input, varName);
      if (_gotPath4.length > 0) {
        for (var y = 0, len2 = _gotPath4.length; y < len2; y++) {
          if (isStr(_gotPath4[y]) || isBool(_gotPath4[y]) || isNull(_gotPath4[y])) {
            resolveValue = _gotPath4[y];
            break;
          } else if (isNum(_gotPath4[y])) {
            resolveValue = String(_gotPath4[y]);
            break;
          } else if (isArr(_gotPath4[y])) {
            resolveValue = _gotPath4[y].join("");
            break;
          } else {
            throw new Error("json-variables/findValues(): [THROW_ID_21] While trying to resolve: \"" + varName + "\" at path \"" + path + "\", we actually found the key named " + varName + ", but it was not equal to a string but to:\n" + JSON.stringify(_gotPath4[y], null, 4) + "\nWe can't resolve a string with that! It should be a string.");
          }
        }
      }
    } else {
      var _gotPath5 = get(input, getTopmostKey(varName));
      if (_gotPath5.length > 0) {
        for (var _y = 0, _len = _gotPath5.length; _y < _len; _y++) {
          var temp = objectPath.get(_gotPath5[_y], withoutTopmostKey(varName));
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
      extra += separator + "\uD83D\uDCA5 " + path;
    }
    throw new Error("json-variables/resolveString(): [THROW_ID_19] While trying to resolve: \"" + string + "\" at path \"" + path + "\", we encountered a closed loop, the key is referencing itself.\"" + extra);
  }
  var secretResolvedVarsStash = {};
  var breadCrumbPath = clone(incomingBreadCrumbPath);
  breadCrumbPath.push(path);
  var slices = new Ranges();
  function processHeadsAndTails(arr, dontWrapTheseVars, wholeValueIsVariable) {
    for (var i = 0, len = arr.length; i < len; i++) {
      var obj = arr[i];
      var varName = string.slice(obj.headsEndAt, obj.tailsStartAt);
      if (varName.length === 0) {
        slices.push(obj.headsStartAt,
        obj.tailsEndAt
        );
      } else if (has.call(secretResolvedVarsStash, varName) && isStr(secretResolvedVarsStash[varName])) {
        slices.push(obj.headsStartAt,
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
          throw new Error("json-variables/processHeadsAndTails(): [THROW_ID_18] We couldn't find the value to resolve the variable " + string.slice(obj.headsEndAt, obj.tailsStartAt) + ". We're at path: \"" + path + "\".");
        }
        if (!wholeValueIsVariable && opts.throwWhenNonStringInsertedInString && !isStr(resolvedValue)) {
          throw new Error("json-variables/processHeadsAndTails(): [THROW_ID_23] While resolving the variable " + string.slice(obj.headsEndAt, obj.tailsStartAt) + " at path " + path + ", it resolved into a non-string value, " + JSON.stringify(resolvedValue, null, 4) + ". This is happening because options setting \"throwWhenNonStringInsertedInString\" is active (set to \"true\").");
        }
        if (isBool(resolvedValue)) {
          if (opts.resolveToBoolIfAnyValuesContainBool) {
            slices = undefined;
            if (!opts.resolveToFalseIfAnyValuesContainBool) {
              return resolvedValue;
            }
            return false;
          }
          resolvedValue = "";
        } else if (isNull(resolvedValue) && wholeValueIsVariable) {
          slices = undefined;
          return resolvedValue;
        } else if (isArr(resolvedValue)) {
          resolvedValue = String(resolvedValue.join(""));
        } else if (isNull(resolvedValue)) {
          resolvedValue = "";
        } else {
          resolvedValue = String(resolvedValue);
        }
        var newPath = path.includes(".") ? goLevelUp(path) + "." + varName : varName;
        if (containsHeadsOrTails(resolvedValue, opts)) {
          var replacementVal = wrap(resolveString(
          input, resolvedValue, newPath, opts, breadCrumbPath), opts, dontWrapTheseVars, breadCrumbPath, newPath, varName.trim());
          if (isStr(replacementVal)) {
            slices.push(obj.headsStartAt,
            obj.tailsEndAt,
            replacementVal);
          }
        } else {
          secretResolvedVarsStash[varName] = resolvedValue;
          var _replacementVal = wrap(resolvedValue, opts, dontWrapTheseVars, breadCrumbPath, newPath, varName.trim());
          if (isStr(_replacementVal)) {
            slices.push(obj.headsStartAt,
            obj.tailsEndAt,
            _replacementVal);
          }
        }
      }
    }
    return undefined;
  }
  var foundHeadsAndTails = void 0;
  try {
    foundHeadsAndTails = strFindHeadsTails(string, opts.heads, opts.tails, {
      source: "",
      throwWhenSomethingWrongIsDetected: false
    });
  } catch (error) {
    throw new Error("json-variables/resolveString(): [THROW_ID_17] While trying to resolve string: \"" + string + "\" at path " + path + ", something wrong with heads and tails was detected! Here's the internal error message:\n" + error);
  }
  var wholeValueIsVariable = false;
  if (foundHeadsAndTails.length === 1 && rangesApply(string, [foundHeadsAndTails[0].headsStartAt, foundHeadsAndTails[0].tailsEndAt]).trim() === "") {
    wholeValueIsVariable = true;
  }
  var temp1 = processHeadsAndTails(foundHeadsAndTails, false, wholeValueIsVariable);
  if (isBool(temp1)) {
    return temp1;
  } else if (isNull(temp1)) {
    return temp1;
  }
  try {
    foundHeadsAndTails = strFindHeadsTails(string, opts.headsNoWrap, opts.tailsNoWrap, { source: "", throwWhenSomethingWrongIsDetected: false });
  } catch (error) {
    throw new Error("json-variables/resolveString(): [THROW_ID_22] While trying to resolve string: \"" + string + "\" at path " + path + ", something wrong with no-wrap heads and no-wrap tails was detected! Here's the internal error message:\n" + error);
  }
  if (foundHeadsAndTails.length === 1 && rangesApply(string, [foundHeadsAndTails[0].headsStartAt, foundHeadsAndTails[0].tailsEndAt]).trim() === "") {
    wholeValueIsVariable = true;
  }
  var temp2 = processHeadsAndTails(foundHeadsAndTails, true, wholeValueIsVariable);
  if (isBool(temp2)) {
    return temp2;
  } else if (isNull(temp2)) {
    return temp2;
  }
  if (slices && slices.current()) {
    return rangesApply(string, slices.current());
  }
  return string;
}
function jsonVariables(inputOriginal) {
  var originalOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (arguments.length === 0) {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_01] Alas! Inputs are missing!");
  }
  if (!isObj(inputOriginal)) {
    throw new TypeError("json-variables/jsonVariables(): [THROW_ID_02] Alas! The input must be a plain object! Currently it's: " + (Array.isArray(inputOriginal) ? "array" : typeof inputOriginal === "undefined" ? "undefined" : _typeof(inputOriginal)));
  }
  if (!isObj(originalOpts)) {
    throw new TypeError("json-variables/jsonVariables(): [THROW_ID_03] Alas! An Optional Options Object must be a plain object! Currently it's: " + (Array.isArray(originalOpts) ? "array" : typeof originalOpts === "undefined" ? "undefined" : _typeof(originalOpts)));
  }
  var input = clone(inputOriginal);
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
    throwWhenNonStringInsertedInString: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (!opts.dontWrapVars) {
    opts.dontWrapVars = [];
  } else if (!isArr(opts.dontWrapVars)) {
    opts.dontWrapVars = arrayiffyIfString(opts.dontWrapVars);
  }
  checkTypes(opts, defaults, {
    msg: "json-variables/jsonVariables(): [THROW_ID_04*]",
    schema: {
      headsNoWrap: ["string", "null", "undefined"],
      tailsNoWrap: ["string", "null", "undefined"]
    }
  });
  var culpritVal = void 0;
  var culpritIndex = void 0;
  if (opts.dontWrapVars.length > 0 && !opts.dontWrapVars.every(function (el, idx) {
    if (!isStr(el)) {
      culpritVal = el;
      culpritIndex = idx;
      return false;
    }
    return true;
  })) {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_05] Alas! All variable names set in opts.dontWrapVars should be of a string type. Computer detected a value \"" + culpritVal + "\" at index " + culpritIndex + ", which is not string but " + (Array.isArray(culpritVal) ? "array" : typeof culpritVal === "undefined" ? "undefined" : _typeof(culpritVal)) + "!");
  }
  if (opts.heads === "") {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_06] Alas! opts.heads are empty!");
  }
  if (opts.tails === "") {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_07] Alas! opts.tails are empty!");
  }
  if (opts.lookForDataContainers && opts.dataContainerIdentifierTails === "") {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_08] Alas! opts.dataContainerIdentifierTails is empty!");
  }
  if (opts.heads === opts.tails) {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_09] Alas! opts.heads and opts.tails can't be equal!");
  }
  if (opts.heads === opts.headsNoWrap) {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_10] Alas! opts.heads and opts.headsNoWrap can't be equal!");
  }
  if (opts.tails === opts.tailsNoWrap) {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_11] Alas! opts.tails and opts.tailsNoWrap can't be equal!");
  }
  if (opts.headsNoWrap === "") {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_12] Alas! opts.headsNoWrap is an empty string!");
  }
  if (opts.tailsNoWrap === "") {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_13] Alas! opts.tailsNoWrap is an empty string!");
  }
  if (opts.headsNoWrap === opts.tailsNoWrap) {
    throw new Error("json-variables/jsonVariables(): [THROW_ID_14] Alas! opts.headsNoWrap and opts.tailsNoWrap can't be equal!");
  }
  var current = void 0;
  return traverse(input, function (key, val, innerObj) {
    if (existy(val) && containsHeadsOrTails(key, opts)) {
      throw new Error("json-variables/jsonVariables(): [THROW_ID_15] Alas! Object keys can't contain variables!\nPlease check the following key: " + key);
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
      throw new Error("json-variables/jsonVariables(): [THROW_ID_16] Alas! While processing the input, we stumbled upon " + trimIfString(current) + " which is equal to " + (trimIfString(current) === trimIfString(opts.heads) ? "heads" : "") + (trimIfString(current) === trimIfString(opts.tails) ? "tails" : "") + (isStr(opts.headsNoWrap) && trimIfString(current) === trimIfString(opts.headsNoWrap) ? "headsNoWrap" : "") + (isStr(opts.tailsNoWrap) && trimIfString(current) === trimIfString(opts.tailsNoWrap) ? "tailsNoWrap" : "") + ". If you wouldn't have set opts.noSingleMarkers to \"true\" this error would not happen and computer would have left the current element (" + trimIfString(current) + ") alone");
    }
    if (isStr(current) && containsHeadsOrTails(current, opts)) {
      return resolveString(input, current, innerObj.path, opts);
    }
    return current;
  });
}

module.exports = jsonVariables;

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var traverse = _interopDefault(require('ast-monkey-traverse'));
var matcher = _interopDefault(require('matcher'));
var objectPath = _interopDefault(require('object-path'));
var checkTypes = _interopDefault(require('check-types-mini'));
var arrayiffyIfString = _interopDefault(require('arrayiffy-if-string'));
var strFindHeadsTails = _interopDefault(require('string-find-heads-tails'));
var get = _interopDefault(require('posthtml-ast-get-values-by-key'));
var Slices = _interopDefault(require('string-slices-array-push'));
var replaceSlicesArr = _interopDefault(require('string-replace-slices-array'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var removeDuplicateHeadsTails = _interopDefault(require('string-remove-duplicate-heads-tails'));
var stringMatchLeftRight = require('string-match-left-right');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// const DEBUG = 0

var isArr = Array.isArray;
var has = Object.prototype.hasOwnProperty;

// -----------------------------------------------------------------------------
//                       H E L P E R   F U N C T I O N S
// -----------------------------------------------------------------------------

function isStr(something) {
  return typeof something === 'string';
}
function isNum(something) {
  return typeof something === 'number';
}
function isBool(something) {
  return typeof something === 'boolean';
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
  if (typeof str === 'string' && str.length > 0 && str.indexOf('.') !== -1) {
    for (var i = 0, len = str.length; i < len; i++) {
      if (str[i] === '.') {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
function withoutTopmostKey(str) {
  if (typeof str === 'string' && str.length > 0 && str.indexOf('.') !== -1) {
    for (var i = 0, len = str.length; i < len; i++) {
      if (str[i] === '.') {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
function goLevelUp(str) {
  if (typeof str === 'string' && str.length > 0 && str.indexOf('.') !== -1) {
    for (var i = str.length; i--;) {
      if (str[i] === '.') {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
function getLastKey(str) {
  if (typeof str === 'string' && str.length > 0 && str.indexOf('.') !== -1) {
    for (var i = str.length; i--;) {
      if (str[i] === '.') {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
function containsHeadsOrTails(str, opts) {
  if (typeof str !== 'string' || str.trim().length === 0) {
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
  if (typeof str === 'string' && str.length > 0 && stringMatchLeftRight.matchRightIncl(str, 0, heads, {
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

  // if (DEBUG) { console.log(`\n>>>>>>>>>> WRAP(): placementValue = ${JSON.stringify(placementValue, null, 4)}`) }
  // if (DEBUG) { console.log(`>>>>>>>>>> WRAP(): breadCrumbPath = ${JSON.stringify(breadCrumbPath, null, 4)}`) }
  // if (DEBUG) { console.log(`>>>>>>>>>> WRAP(): newPath = ${JSON.stringify(newPath, null, 4)}`) }
  // if (DEBUG) { console.log(`>>>>>>>>>> WRAP(): oldVarName = ${JSON.stringify(oldVarName, null, 4)}\n`) }
  if (isStr(placementValue) && !dontWrapTheseVars && opts.wrapGlobalFlipSwitch && !opts.dontWrapVars.some(function (val) {
    return matcher.isMatch(oldVarName, val);
  }) && ( // considering double-wrapping prevention setting:
  !opts.preventDoubleWrapping || opts.preventDoubleWrapping && isStr(placementValue) && !placementValue.includes(opts.wrapHeadsWith) && !placementValue.includes(opts.wrapTailsWith))) {
    // if (DEBUG) { console.log('+++ WE GONNA WRAP THIS!') }
    return opts.wrapHeadsWith + placementValue + opts.wrapTailsWith;
  } else if (dontWrapTheseVars) {
    // if (DEBUG) { console.log('\n\n\n💥💥💥💥💥💥 !!! dontWrapTheseVars is ON!!!\n\n\n') }
    // if (DEBUG) { console.log(`placementValue = ${JSON.stringify(placementValue, null, 4)}`) }
    // if (DEBUG) { console.log(`opts.wrapHeadsWith = ${JSON.stringify(opts.wrapHeadsWith, null, 4)}`) }
    // if (DEBUG) { console.log(`opts.wrapTailsWith = ${JSON.stringify(opts.wrapTailsWith, null, 4)}`) }

    // if (DEBUG) { console.log(`about to return:\n${JSON.stringify(removeDuplicateHeadsTails(placementValue, { heads: opts.wrapHeadsWith, tails: opts.wrapTailsWith }), null, 4)}`) }
    // if (DEBUG) { console.log(`\u001b[${36}m placementValue = ${JSON.stringify(placementValue, null, 4)}\u001b[${39}m`) }
    return removeWrappingHeadsAndTails(removeDuplicateHeadsTails(placementValue, {
      heads: opts.wrapHeadsWith,
      tails: opts.wrapTailsWith
    }), opts.wrapHeadsWith, opts.wrapTailsWith);
  }
  // if (DEBUG) { console.log('+++ NO WRAP') }
  return placementValue;
}
function findValues(input, varName, path, opts) {
  // if (DEBUG) { console.log(`136 findValues(): looking for varName = ${JSON.stringify(varName, null, 4)}`) }
  // if (DEBUG) { console.log(`137 path = ${JSON.stringify(path, null, 4)}\n\n`) }
  var resolveValue = void 0;
  // 1.1. first, traverse up to root level, looking for key right at that level
  // or within data store, respecting the config
  if (path.indexOf('.') !== -1) {
    var currentPath = path;
    // traverse upwards:
    var handBrakeOff = true;

    // first, check the current level's datastore:
    if (opts.lookForDataContainers && typeof opts.dataContainerIdentifierTails === 'string' && opts.dataContainerIdentifierTails.length > 0 && !currentPath.endsWith(opts.dataContainerIdentifierTails)) {
      // 1.1.1. first check data store
      // if (DEBUG) { console.log('1.1.0.') }
      // if (DEBUG) { console.log(`\n159 * datastore = ${JSON.stringify(currentPath + opts.dataContainerIdentifierTails, null, 4)}`) }
      var gotPath = objectPath.get(input, currentPath + opts.dataContainerIdentifierTails);
      // if (DEBUG) { console.log(`161 * gotPath = ${JSON.stringify(gotPath, null, 4)}`) }
      if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
        // if (DEBUG) { console.log(`163 FOUND!\n${gotPath[varName]}`) }
        resolveValue = objectPath.get(gotPath, varName);
        handBrakeOff = false;
      }
    }

    // then, start traversing up:
    while (handBrakeOff && currentPath.indexOf('.') !== -1) {
      currentPath = goLevelUp(currentPath);
      if (getLastKey(currentPath) === varName) {
        throw new Error('json-variables/findValues(): [THROW_ID_20] While trying to resolve: "' + varName + '" at path "' + path + '", we encountered a closed loop. The parent key "' + getLastKey(currentPath) + '" is called the same as the variable "' + varName + '" we\'re looking for.');
      }
      // if (DEBUG) { console.log(`175 traversing up. Currently at: ${currentPath}`) }

      // first, check the current level's datastore:
      if (opts.lookForDataContainers && typeof opts.dataContainerIdentifierTails === 'string' && opts.dataContainerIdentifierTails.length > 0 && !currentPath.endsWith(opts.dataContainerIdentifierTails)) {
        // 1.1.1. first check data store
        // if (DEBUG) { console.log('1.1.1.') }
        // if (DEBUG) { console.log(`\n186 * datastore = ${JSON.stringify(currentPath + opts.dataContainerIdentifierTails, null, 4)}`) }
        var _gotPath = objectPath.get(input, currentPath + opts.dataContainerIdentifierTails);
        // if (DEBUG) { console.log(`188 * gotPath = ${JSON.stringify(gotPath, null, 4)}`) }
        if (isObj(_gotPath) && objectPath.get(_gotPath, varName)) {
          // if (DEBUG) { console.log(`190 FOUND!\n${gotPath[varName]}`) }
          resolveValue = objectPath.get(_gotPath, varName);
          handBrakeOff = false;
        }
      }

      if (resolveValue === undefined) {
        // if (DEBUG) { console.log('1.1.2.') }
        // 1.1.2. second check for key straight in parent level
        var _gotPath2 = objectPath.get(input, currentPath);
        // if (DEBUG) { console.log(`200 gotPath = ${JSON.stringify(gotPath, null, 4)}`) }
        if (isObj(_gotPath2) && objectPath.get(_gotPath2, varName)) {
          // if (DEBUG) { console.log(`202 SUCCESS! currentPath = ${JSON.stringify(currentPath, null, 4)} has key ${varName}`) }
          resolveValue = objectPath.get(_gotPath2, varName);
          handBrakeOff = false;
        }
      }
    }
  }
  // 1.2. Reading this point means that maybe we were already at the root level,
  // maybe we traversed up to root and couldn't resolve anything.
  // Either way, let's check keys and data store at the root level:
  if (resolveValue === undefined) {
    // if (DEBUG) { console.log('192 check the root') }
    var _gotPath3 = objectPath.get(input, varName);
    // if (DEBUG) { console.log(`194 ROOT's gotPath = ${JSON.stringify(gotPath, null, 4)}`) }
    if (_gotPath3 !== undefined) {
      // if (DEBUG) { console.log(`196 setting resolveValue = ${JSON.stringify(gotPath, null, 4)}`) }
      resolveValue = _gotPath3;
    }
  }
  // 1.3. Last resort, just look for key ANYWHERE, as long as it's named as
  // our variable name's topmost key (if it's a path with dots) or equal to key entirely (no dots)
  if (resolveValue === undefined) {
    // if (DEBUG) { console.log(`203 search for key: ${getTopmostKey(varName)}`) }
    // 1.3.1. It depends, does the varName we're looking for have dot or not.
    // - Because if it does, it's a path and we'll have to split the search into two
    // parts: first find topmost key, then query it's children path part via
    // object-path.
    // - If it does not have a dot, it's straightforward, pick first string
    // finding out of get().

    // it's not a path (does not contain dots)
    if (varName.indexOf('.') === -1) {
      var _gotPath4 = get(input, varName);
      // if (DEBUG) { console.log(`\n214*** gotPath = ${JSON.stringify(gotPath, null, 4)}`) }
      if (_gotPath4.length > 0) {
        for (var y = 0, len2 = _gotPath4.length; y < len2; y++) {
          if (isStr(_gotPath4[y]) || isBool(_gotPath4[y]) || isNull(_gotPath4[y])) {
            resolveValue = _gotPath4[y];
            // if (DEBUG) { console.log(`219 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`) }
            break;
          } else if (isNum(_gotPath4[y])) {
            resolveValue = String(_gotPath4[y]);
            // if (DEBUG) { console.log(`223 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`) }
            break;
          } else if (isArr(_gotPath4[y])) {
            resolveValue = _gotPath4[y].join('');
            // if (DEBUG) { console.log(`227 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`) }
            break;
          } else {
            throw new Error('json-variables/findValues(): [THROW_ID_21] While trying to resolve: "' + varName + '" at path "' + path + '", we actually found the key named ' + varName + ', but it was not equal to a string but to:\n' + JSON.stringify(_gotPath4[y], null, 4) + '\nWe can\'t resolve a string with that! It should be a string.');
          }
        }
      }
    } else {
      // it's a path (contains dots)
      var _gotPath5 = get(input, getTopmostKey(varName));
      // if (DEBUG) { console.log(`\n237*** gotPath = ${JSON.stringify(gotPath, null, 4)}`) }
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
  // if (DEBUG) { console.log(`248 findValues(): FINAL RETURN: ${resolveValue}\n`) }
  return resolveValue;
}

// Explanation of the resolveString() function's inputs.

// Heads or tails were detected in the "string", which is located in the "path"
// within "input" (JSON object normally, an AST). All the settings are in "opts".
// Since this function will be called recursively, we have to keep a breadCrumbPath -
// all keys visited so far and always check, was the current key not been
// traversed already (present in breadCrumbPath). Otherwise, we might get into a
// closed loop.
function resolveString(input, string, path, opts) {
  var incomingBreadCrumbPath = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  // if (DEBUG) { console.log(`\u001b[${33}m${`\n\n261 CALLED resolveString() on "${string}". Path = "${path}"`}\u001b[${39}m`) }

  // if (DEBUG) { console.log(`263 incomingBreadCrumbPath = ${JSON.stringify(incomingBreadCrumbPath, null, 4)}`) }
  // precautions from recursion
  if (incomingBreadCrumbPath.includes(path)) {
    var extra = '';
    if (incomingBreadCrumbPath.length > 1) {
      // extra = ` Here's the path we travelled up until we hit the recursion: ${incomingBreadCrumbPath.join(' - ')}.`

      var separator = ' →\n';
      extra = incomingBreadCrumbPath.reduce(function (accum, curr, idx) {
        return accum + (idx === 0 ? '' : separator) + (curr === path ? '💥 ' : '  ') + curr;
      }, ' Here\'s the path we travelled up until we hit the recursion:\n\n');
      extra += separator + '\uD83D\uDCA5 ' + path;
    }
    throw new Error('json-variables/resolveString(): [THROW_ID_19] While trying to resolve: "' + string + '" at path "' + path + '", we encountered a closed loop, the key is referencing itself."' + extra);
  }

  // The Secret Data Stash, a way to cache previously resolved values and reuse the
  // values, saving resources. It can't be on the root because it would get retained
  // between different calls on the library, potentially giving wrong results (from
  // the previous resolved variable, from the previous function call).
  var secretResolvedVarsStash = {};

  // if (DEBUG) { console.log(`=============================\n279 string = ${JSON.stringify(string, null, 4)}`) }

  // 0. Add current path into breadCrumbPath
  // =======================================

  var breadCrumbPath = clone(incomingBreadCrumbPath);
  breadCrumbPath.push(path);

  // 1. First, extract all vars
  // ==========================

  var slices = new Slices();

  function processHeadsAndTails(arr, dontWrapTheseVars, wholeValueIsVariable) {
    for (var i = 0, len = arr.length; i < len; i++) {
      var obj = arr[i];
      // if (DEBUG) { console.log(`\u001b[${33}m${`299 obj = ${JSON.stringify(obj, null, 4)}`}\u001b[${39}m`) }
      var varName = string.slice(obj.headsEndAt, obj.tailsStartAt);
      if (varName.length === 0) {
        slices.push(obj.headsStartAt, // replace from index
        obj.tailsEndAt // replace upto index - no third argument, just deletion of heads/tails
        );
      } else if (has.call(secretResolvedVarsStash, varName)) {
        // check, maybe the value was already resolved before and present in secret stash:
        // if (DEBUG) { console.log('308 Yay! Value taken from stash!') }
        slices.push(obj.headsStartAt, // replace from index
        obj.tailsEndAt, // replace upto index
        secretResolvedVarsStash[varName] // replacement value
        );
      } else {
        // it's not in the stash unfortunately, so let's search for it then:
        var resolvedValue = findValues(input, // input
        varName.trim(), // varName
        path, // path
        opts // opts
        );
        if (resolvedValue === undefined) {
          throw new Error('json-variables/processHeadsAndTails(): [THROW_ID_18] We couldn\'t find the value to resolve the variable ' + string.slice(obj.headsEndAt, obj.tailsStartAt) + '. We\'re at path: "' + path + '".');
        }
        if (!wholeValueIsVariable && opts.throwWhenNonStringInsertedInString && !isStr(resolvedValue)) {
          throw new Error('json-variables/processHeadsAndTails(): [THROW_ID_23] While resolving the variable ' + string.slice(obj.headsEndAt, obj.tailsStartAt) + ' at path ' + path + ', it resolved into a non-string value, ' + JSON.stringify(resolvedValue, null, 4) + '. Here are current opts:\n' + JSON.stringify(opts, null, 4));
        }

        if (isBool(resolvedValue)) {
          if (opts.resolveToBoolIfAnyValuesContainBool) {
            slices = undefined;
            if (!opts.resolveToFalseIfAnyValuesContainBool) {
              return resolvedValue;
            }
            return false;
          }
          resolvedValue = '';
        } else if (isNull(resolvedValue) && wholeValueIsVariable) {
          slices = undefined;
          return resolvedValue;
        } else if (isArr(resolvedValue)) {
          resolvedValue = String(resolvedValue.join(''));
        } else if (isNull(resolvedValue)) {
          resolvedValue = '';
        } else {
          resolvedValue = String(resolvedValue);
        }

        // if (DEBUG) { console.log(`* 326 resolvedValue = ${JSON.stringify(resolvedValue, null, 4)}`) }
        // if (DEBUG) { console.log(`* 327 path = ${JSON.stringify(path, null, 4)}`) }
        // if (DEBUG) { console.log(`* 328 varName = ${JSON.stringify(varName, null, 4)}`) }

        var newPath = path.includes('.') ? goLevelUp(path) + '.' + varName : varName;
        // if (DEBUG) { console.log(`* 331 newPath = ${JSON.stringify(newPath, null, 4)}`) }
        if (containsHeadsOrTails(resolvedValue, opts)) {
          slices.push(obj.headsStartAt, // replace from index
          obj.tailsEndAt, // replace upto index
          wrap(resolveString( // replacement value    <--------- R E C U R S I O N
          input, resolvedValue, newPath, opts, breadCrumbPath), opts, dontWrapTheseVars, breadCrumbPath, newPath, varName.trim()));
        } else {
          // 1. store it in the stash for the future
          secretResolvedVarsStash[varName] = resolvedValue;
          // 2. add it for replacement later
          slices.push(obj.headsStartAt, // replace from index
          obj.tailsEndAt, // replace upto index
          wrap(resolvedValue, opts, dontWrapTheseVars, breadCrumbPath, newPath, varName.trim()) // replacement value
          );
        }
      }
    }
    return undefined;
  }

  var foundHeadsAndTails = void 0; // reusing same var as container for both wrapping- and non-wrapping types

  // 1. normal (possibly wrapping-type) heads and tails
  try {
    // strFindHeadsTails() can throw as well if there's mismatch in heads and tails,
    // for example, so it needs to be contained:
    foundHeadsAndTails = strFindHeadsTails(string, opts.heads, opts.tails, { source: '', throwWhenSomethingWrongIsDetected: false });
  } catch (error) {
    throw new Error('json-variables/resolveString(): [THROW_ID_17] While trying to resolve string: "' + string + '" at path ' + path + ', something wrong with heads and tails was detected! Here\'s the internal error message:\n' + error);
  }
  // if (DEBUG) { console.log(`${`\u001b[${36}m${'385 foundHeadsAndTails = '}\u001b[${39}m`} ${JSON.stringify(foundHeadsAndTails, null, 4)}`) }
  // if (DEBUG) { console.log(`\u001b[${36}m${`string.length = ${string.length}`}\u001b[${39}m`) }

  // if heads and tails array has only one range inside and it spans whole string's
  // length, this means key is equal to a whole variable, like {a: '%%_b_%%'}.
  // In those cases, there are extra considerations when value is null, because
  // null among string characters is resolved to empty string, but null as a whole
  // value is retained as null. This means, we need to pass this as a flag to
  // processHeadsAndTails() so it can resolve properly...

  var wholeValueIsVariable = false; // we'll reuse it for non-wrap heads/tails too

  if (foundHeadsAndTails.length === 1 && replaceSlicesArr(string, [foundHeadsAndTails[0].headsStartAt, foundHeadsAndTails[0].tailsEndAt]).trim() === '') {
    wholeValueIsVariable = true;
  }

  var temp1 = processHeadsAndTails(foundHeadsAndTails, false, wholeValueIsVariable);
  if (isBool(temp1)) {
    return temp1;
  } else if (isNull(temp1)) {
    return temp1;
  }

  // 2. Process opts.headsNoWrap, opts.tailsNoWrap as well
  try {
    // strFindHeadsTails() can throw as well if there's mismatch in heads and tails,
    // for example, so it needs to be contained:
    foundHeadsAndTails = strFindHeadsTails(string, opts.headsNoWrap, opts.tailsNoWrap, { source: '', throwWhenSomethingWrongIsDetected: false });
  } catch (error) {
    throw new Error('json-variables/resolveString(): [THROW_ID_22] While trying to resolve string: "' + string + '" at path ' + path + ', something wrong with no-wrap heads and no-wrap tails was detected! Here\'s the internal error message:\n' + error);
  }

  if (foundHeadsAndTails.length === 1 && replaceSlicesArr(string, [foundHeadsAndTails[0].headsStartAt, foundHeadsAndTails[0].tailsEndAt]).trim() === '') {
    wholeValueIsVariable = true;
  }

  var temp2 = processHeadsAndTails(foundHeadsAndTails, true, wholeValueIsVariable);
  if (isBool(temp2)) {
    return temp2;
  } else if (isNull(temp2)) {
    return temp2;
  }

  // if (DEBUG) { console.log(`temp2 = ${JSON.stringify(temp2, null, 4)}`) }

  // 3. Then, work the slices list
  // ================================
  // if (DEBUG && slices) { console.log(`\u001b[${33}m${`\n389 END OF replaceSlicesArr: slices.current() = ${JSON.stringify(slices.current(), null, 4)}`}\u001b[${39}m`) }
  // if (DEBUG) { console.log(`\u001b[${33}m${`\n390 string was = ${JSON.stringify(string, null, 4)}`}\u001b[${39}m`) }
  //

  if (slices && slices.current()) {
    return replaceSlicesArr(string, slices.current());
  }
  return string;
}

// -----------------------------------------------------------------------------
//                         M A I N   F U N C T I O N
// -----------------------------------------------------------------------------

function jsonVariables(inputOriginal) {
  var originalOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (arguments.length === 0) {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_01] Alas! Inputs are missing!');
  }
  if (!isObj(inputOriginal)) {
    throw new TypeError('json-variables/jsonVariables(): [THROW_ID_02] Alas! The input must be a plain object! Currently it\'s: ' + (Array.isArray(inputOriginal) ? 'array' : typeof inputOriginal === 'undefined' ? 'undefined' : _typeof(inputOriginal)));
  }
  if (!isObj(originalOpts)) {
    throw new TypeError('json-variables/jsonVariables(): [THROW_ID_03] Alas! An Optional Options Object must be a plain object! Currently it\'s: ' + (Array.isArray(originalOpts) ? 'array' : typeof originalOpts === 'undefined' ? 'undefined' : _typeof(originalOpts)));
  }

  var input = clone(inputOriginal);
  var defaults = {
    heads: '%%_',
    tails: '_%%',
    headsNoWrap: '%%-',
    tailsNoWrap: '-%%',
    lookForDataContainers: true,
    dataContainerIdentifierTails: '_data',
    wrapHeadsWith: '',
    wrapTailsWith: '',
    dontWrapVars: [],
    preventDoubleWrapping: true,
    wrapGlobalFlipSwitch: true, // is wrap function on?
    noSingleMarkers: false, // if value has only and exactly heads or tails,
    // don't throw mismatched marker error.
    resolveToBoolIfAnyValuesContainBool: true, // if variable is resolved into
    // anything that contains or is equal to Boolean false, set the whole thing to false
    resolveToFalseIfAnyValuesContainBool: true, // resolve whole value to false,
    // even if some values contain Boolean true. Otherwise, the whole value will
    // resolve to the first encountered Boolean.
    throwWhenNonStringInsertedInString: false
  };
  var opts = Object.assign({}, defaults, originalOpts);

  if (!opts.dontWrapVars) {
    opts.dontWrapVars = [];
  } else if (!isArr(opts.dontWrapVars)) {
    opts.dontWrapVars = arrayiffyIfString(opts.dontWrapVars);
  }

  checkTypes(opts, defaults, {
    msg: 'json-variables/jsonVariables(): [THROW_ID_04*]',
    schema: {
      headsNoWrap: ['string', 'null', 'undefined'],
      tailsNoWrap: ['string', 'null', 'undefined']
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
    throw new Error('json-variables/jsonVariables(): [THROW_ID_05] Alas! All variable names set in opts.dontWrapVars should be of a string type. Computer detected a value "' + culpritVal + '" at index ' + culpritIndex + ', which is not string but ' + (Array.isArray(culpritVal) ? 'array' : typeof culpritVal === 'undefined' ? 'undefined' : _typeof(culpritVal)) + '!');
  }

  if (opts.heads === '') {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_06] Alas! opts.heads are empty!');
  }
  if (opts.tails === '') {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_07] Alas! opts.tails are empty!');
  }
  if (opts.lookForDataContainers && opts.dataContainerIdentifierTails === '') {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_08] Alas! opts.dataContainerIdentifierTails is empty!');
  }
  if (opts.heads === opts.tails) {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_09] Alas! opts.heads and opts.tails can\'t be equal!');
  }
  if (opts.heads === opts.headsNoWrap) {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_10] Alas! opts.heads and opts.headsNoWrap can\'t be equal!');
  }
  if (opts.tails === opts.tailsNoWrap) {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_11] Alas! opts.tails and opts.tailsNoWrap can\'t be equal!');
  }
  if (opts.headsNoWrap === '') {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_12] Alas! opts.headsNoWrap is an empty string!');
  }
  if (opts.tailsNoWrap === '') {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_13] Alas! opts.tailsNoWrap is an empty string!');
  }
  if (opts.headsNoWrap === opts.tailsNoWrap) {
    throw new Error('json-variables/jsonVariables(): [THROW_ID_14] Alas! opts.headsNoWrap and opts.tailsNoWrap can\'t be equal!');
  }

  var current = void 0;

  // console.log('======== JSON VARIABLES START ========')
  // console.log(`input = ${JSON.stringify(input, null, 4)}`)
  // console.log(`opts = ${JSON.stringify(opts, null, 4)}`)
  // console.log('======== JSON VARIABLES END ========')

  //
  // ===============================================
  //                        1.
  // Let's compile the list of all the vars to resolve
  // ===============================================
  //

  // we return the result of the traversal:
  return traverse(input, function (key, val, innerObj) {
    // if (DEBUG) { console.log('\n========================================') }
    if (existy(val) && containsHeadsOrTails(key, opts)) {
      throw new Error('json-variables/jsonVariables(): [THROW_ID_15] Alas! Object keys can\'t contain variables!\nPlease check the following key: ' + key);
    }
    // * * *
    // Get the current values which are being traversed by ast-monkey:
    // If it's an array, val will not exist, only key.
    if (val !== undefined) {
      // if it's object currently being traversed, we'll get both key and value
      current = val;
    } else {
      // if it's an array being traversed currently, we'll get only key
      current = key;
    }

    // * * *
    // In short, ast-monkey works in such way, that what we return will get written
    // over the current element, which is at the moment "current". If we don't want
    // to mutate it, we return "current". If we want to mutate it, we return a new
    // value (which will get written onto that node, previously equal to "current").

    // if (DEBUG) { console.log(`current = ${JSON.stringify(current, null, 4)}`) }

    // *
    // Instantly skip empty strings:
    if (current === '') {
      return current;
    }

    // *
    // If the "current" that monkey brought us is equal to whole heads or tails:
    if (opts.heads.length !== 0 && trimIfString(current) === trimIfString(opts.heads) || opts.tails.length !== 0 && trimIfString(current) === trimIfString(opts.tails) || opts.headsNoWrap.length !== 0 && trimIfString(current) === trimIfString(opts.headsNoWrap) || opts.tailsNoWrap.length !== 0 && trimIfString(current) === trimIfString(opts.tailsNoWrap)) {
      if (!opts.noSingleMarkers) {
        return current;
      }
      throw new Error('json-variables/jsonVariables(): [THROW_ID_16] Alas! While processing the input, we stumbled upon ' + trimIfString(current) + ' which is equal to ' + (trimIfString(current) === trimIfString(opts.heads) ? 'heads' : '') + (trimIfString(current) === trimIfString(opts.tails) ? 'tails' : '') + (isStr(opts.headsNoWrap) && trimIfString(current) === trimIfString(opts.headsNoWrap) ? 'headsNoWrap' : '') + (isStr(opts.tailsNoWrap) && trimIfString(current) === trimIfString(opts.tailsNoWrap) ? 'tailsNoWrap' : '') + '. If you wouldn\'t have set opts.noSingleMarkers to "true" this error would not happen and computer would have left the current element (' + trimIfString(current) + ') alone');
    }

    // if (DEBUG) { console.log(`\ncurrent = ${JSON.stringify(current, null, 4)}`) }

    // *
    // Process the current node if it's a string and it contains heads / tails /
    // headsNoWrap / tailsNoWrap:
    if (isStr(current) && containsHeadsOrTails(current, opts)) {
      // breadCrumbPath, the fifth argument is not passed as there're no previous paths
      return resolveString(input, current, innerObj.path, opts);
    }

    // otherwise, just return as it is. We're not going to touch plain objects/arrays,numbers/bools etc.
    return current;

    // END OF MONKEY'S TRAVERSE
    // -------------------------------------------------------------------------
  });
}

module.exports = jsonVariables;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var setAllValuesTo = _interopDefault(require('object-set-all-values-to'));
var flattenAllArrays = _interopDefault(require('object-flatten-all-arrays'));
var mergeAdvanced = _interopDefault(require('object-merge-advanced'));
var fillMissingKeys = _interopDefault(require('object-fill-missing-keys'));
var nnk = _interopDefault(require('object-no-new-keys'));
var clone = _interopDefault(require('lodash.clonedeep'));
var includes = _interopDefault(require('lodash.includes'));
var typ = _interopDefault(require('type-detect'));
var checkTypes = _interopDefault(require('check-types-mini'));
var sortKeys = _interopDefault(require('sort-keys'));
var pReduce = _interopDefault(require('p-reduce'));
var pOne = _interopDefault(require('p-one'));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// -----------------------------------------------------------------------------

function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
}
function isObj(something) {
  return typ(something) === 'Object';
}
function isArr(something) {
  return Array.isArray(something);
}
function isStr(something) {
  return typ(something) === 'string';
}

// -----------------------------------------------------------------------------
// SORT THEM THINGIES

function sortAllObjectsSync(input) {
  if (isObj(input) || isArr(input)) {
    return sortKeys(input, { deep: true });
  }
  return input;
}

// -----------------------------------------------------------------------------

function getKeyset(arrOfPromises, originalOpts) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/getKeyset(): [THROW_ID_11] Inputs missing!');
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError('json-comb-core/getKeysetSync(): [THROW_ID_12] Options object must be a plain object! Currently it\'s: ' + typ(originalOpts) + ', equal to: ' + JSON.stringify(originalOpts, null, 4));
  }
  var defaults = {
    placeholder: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: 'json-comb-core/getKeyset(): [THROW_ID_10*]',
    schema: {
      placeholder: ['null', 'number', 'string', 'boolean', 'object']
    }
  });
  var culpritIndex = void 0;
  var culpritVal = void 0;

  return new Promise(function (resolve, reject) {
    // Map over input array of promises. If any resolve to non-plain-object,
    // final returned promise will resolve to true. Otherwise, false.
    pOne(arrOfPromises, function (element, index) {
      if (!isObj(element)) {
        culpritIndex = index;
        culpritVal = element;
        return true;
      }
      return false;
    }).then(function (res) {
      // truthy option means previous check detected a promise within
      // "arrOfPromises" which doesn't resolve to a plain object
      if (res) {
        return reject(Error('json-comb-core/getKeyset(): [THROW_ID_13] Oops! ' + culpritIndex + 'th element resolved not to a plain object but to a ' + (typeof culpritVal === 'undefined' ? 'undefined' : _typeof(culpritVal)) + '\n' + JSON.stringify(culpritVal, null, 4)));
      }
      return pReduce(arrOfPromises, // input
      function (previousValue, currentValue) {
        return mergeAdvanced(flattenAllArrays(previousValue, { flattenArraysContainingStringsToBeEmpty: true }), flattenAllArrays(currentValue, { flattenArraysContainingStringsToBeEmpty: true }), { mergeArraysContainingStringsToBeEmpty: true });
      }, // reducer
      {} // initialValue
      ).then(function (res2) {
        resolve(setAllValuesTo(res2, opts.placeholder));
      });
    });
  });
}

// -----------------------------------------------------------------------------

function getKeysetSync(arrOriginal, originalOpts) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/getKeysetSync(): [THROW_ID_21] Inputs missing!');
  }
  if (!isArr(arrOriginal)) {
    throw new Error('json-comb-core/getKeysetSync(): [THROW_ID_22] Input must be array! Currently it\'s: ' + typ(arrOriginal));
  }
  if (arrOriginal.length === 0) {
    throw new Error('json-comb-core/getKeysetSync(): [THROW_ID_23] Input array is empty!');
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError('json-comb-core/getKeysetSync(): [THROW_ID_24] Options object must be a plain object! Currently it\'s: ' + typ(originalOpts) + ', equal to: ' + JSON.stringify(originalOpts, null, 4));
  }

  var schemaObj = {};
  var arr = clone(arrOriginal);
  var defaults = {
    placeholder: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: 'json-comb-core/getKeysetSync(): [THROW_ID_20*]',
    schema: {
      placeholder: ['null', 'number', 'string', 'boolean', 'object']
    }
  });

  var fOpts = {
    flattenArraysContainingStringsToBeEmpty: true
  };

  arr.forEach(function (obj, i) {
    if (!isObj(obj)) {
      throw new TypeError('json-comb-core/getKeysetSync(): [THROW_ID_25] Non-object (' + typ(obj) + ') detected within an array! It\'s the ' + i + 'th element: ' + JSON.stringify(obj, null, 4));
    }
    schemaObj = mergeAdvanced(flattenAllArrays(schemaObj, fOpts), flattenAllArrays(obj, fOpts), { mergeArraysContainingStringsToBeEmpty: true });
  });
  schemaObj = sortAllObjectsSync(setAllValuesTo(schemaObj, opts.placeholder));
  return schemaObj;
}

// -----------------------------------------------------------------------------

function enforceKeyset(obj, schemaKeyset, originalOpts) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_31] Inputs missing!');
  }
  if (arguments.length === 1) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_32] Second arg missing!');
  }
  var defaults = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: 'json-comb-core/enforceKeyset(): [THROW_ID_30*]',
    schema: {
      placeholder: ['null', 'number', 'string', 'boolean', 'object']
    }
  });
  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(function (val) {
    return isStr(val);
  })) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_33] Array opts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n' + JSON.stringify(opts.doNotFillThesePathsIfTheyContainPlaceholders, null, 4));
  }
  return new Promise(function (resolve, reject) {
    Promise.all([obj, schemaKeyset]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          objResolved = _ref2[0],
          schemaKeysetResolved = _ref2[1];

      if (!isObj(obj)) {
        return reject(Error('json-comb-core/enforceKeyset(): [THROW_ID_34] Input must resolve to a plain object! Currently it\'s: ' + typ(obj) + ', equal to: ' + JSON.stringify(obj, null, 4)));
      }
      if (!isObj(schemaKeyset)) {
        return reject(Error('json-comb-core/enforceKeyset(): [THROW_ID_35] Schema, 2nd arg, must resolve to a plain object! Currently it\'s resolving to: ' + typ(schemaKeyset) + ', equal to: ' + JSON.stringify(schemaKeyset, null, 4)));
      }
      return resolve(sortAllObjectsSync(clone(fillMissingKeys(clone(objResolved), clone(schemaKeysetResolved), opts))));
    });
  });
}

// -----------------------------------------------------------------------------

function enforceKeysetSync(obj, schemaKeyset, originalOpts) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/enforceKeysetSync(): [THROW_ID_41] Inputs missing!');
  }
  if (arguments.length === 1) {
    throw new Error('json-comb-core/enforceKeysetSync(): [THROW_ID_42] Second arg missing!');
  }
  if (!isObj(obj)) {
    throw new Error('json-comb-core/enforceKeysetSync(): [THROW_ID_43] Input must be a plain object! Currently it\'s: ' + typ(obj) + ', equal to: ' + JSON.stringify(obj, null, 4));
  }
  if (!isObj(schemaKeyset)) {
    throw new Error('json-comb-core/enforceKeysetSync(): [THROW_ID_44] Schema object must be a plain object! Currently it\'s: ' + typ(schemaKeyset) + ', equal to: ' + JSON.stringify(schemaKeyset, null, 4));
  }
  var defaults = {
    doNotFillThesePathsIfTheyContainPlaceholders: [],
    placeholder: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: 'json-comb-core/enforceKeysetSync(): [THROW_ID_40*]',
    schema: {
      placeholder: ['null', 'number', 'string', 'boolean', 'object']
    }
  });
  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(function (val) {
    return isStr(val);
  })) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_45] Array opts.doNotFillThesePathsIfTheyContainPlaceholders contains non-string values:\n' + JSON.stringify(opts.doNotFillThesePathsIfTheyContainPlaceholders, null, 4));
  }
  return sortAllObjectsSync(fillMissingKeys(clone(obj), schemaKeyset, opts));
}

// -----------------------------------------------------------------------------

// no news is good news - when keyset is ok, empty array is returned
// when there are rogue keys, array of paths is returned
function noNewKeysSync(obj, schemaKeyset) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/noNewKeysSync(): [THROW_ID_51] All inputs missing!');
  }
  if (arguments.length === 1) {
    throw new Error('json-comb-core/noNewKeysSync(): [THROW_ID_52] Schema object is missing!');
  }
  if (!isObj(obj)) {
    throw new Error('json-comb-core/noNewKeysSync(): [THROW_ID_53] Main input (1st arg.) must be a plain object! Currently it\'s: ' + typ(obj) + ', equal to: ' + JSON.stringify(obj, null, 4));
  }
  if (!isObj(schemaKeyset)) {
    throw new Error('json-comb-core/noNewKeysSync(): [THROW_ID_54] Schema input (2nd arg.) must be a plain object! Currently it\'s: ' + typ(schemaKeyset) + ', equal to: ' + JSON.stringify(schemaKeyset, null, 4));
  }
  return nnk(obj, schemaKeyset);
}

// -----------------------------------------------------------------------------

function findUnusedSync(arrOriginal, originalOpts) {
  //
  // PREPARATIONS AND TYPE CHECKS
  // ============================

  if (isArr(arrOriginal)) {
    if (arrOriginal.length === 0) {
      return [];
    }
  } else {
    throw new TypeError('json-comb-core/findUnusedSync(): [THROW_ID_61] The first argument should be an array. Currently it\'s: ' + typ(arrOriginal));
  }
  if (arguments.length > 1 && !isObj(originalOpts)) {
    throw new TypeError('json-comb-core/findUnusedSync(): [THROW_ID_62] The second argument, options object, must be a plain object, not ' + typ(originalOpts));
  }
  var defaults = {
    placeholder: false,
    comments: '__comment__'
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (opts.comments === 1 || opts.comments === '1') {
    throw new TypeError('json-comb-core/findUnusedSync(): [THROW_ID_63] opts.comments was set to Number 1, but it does not make sense. Either it\'s string or falsey. Please fix.');
  }
  if (opts.comments === true || opts.comments === 'true') {
    throw new TypeError('json-comb-core/findUnusedSync(): [THROW_ID_63] opts.comments was set to Boolean "true", but it does not make sense. Either it\'s string or falsey. Please fix.');
  }
  if (!truthy(opts.comments) || opts.comments === 0) {
    opts.comments = false;
  }
  checkTypes(opts, defaults, {
    msg: 'json-comb-core/findUnusedSync(): [THROW_ID_60]',
    schema: {
      placeholder: ['null', 'number', 'string', 'boolean'],
      comments: ['string', 'boolean']
    }
  });
  if (opts.comments === '') {
    opts.comments = false;
  }
  var arr = clone(arrOriginal);

  // ---------------------------------------------------------------------------

  function removeLeadingDot(something) {
    return something.map(function (finding) {
      return finding.charAt(0) === '.' ? finding.slice(1) : finding;
    });
  }

  function findUnusedSyncInner(arr1, opts1, res, path) {
    if (isArr(arr1) && arr1.length === 0) {
      return res;
    }
    if (res === undefined) {
      res = [];
    }
    if (path === undefined) {
      path = '';
    }
    var keySet = void 0;
    if (arr1.every(function (el) {
      return typ(el) === 'Object';
    })) {
      var _ref3;

      keySet = getKeysetSync(arr1);
      //
      // ------ PART 1 ------
      // iterate all objects within given arr1ay, find unused keys
      //
      if (arr1.length > 1) {
        var unusedKeys = Object.keys(keySet).filter(function (key) {
          return arr1.every(function (obj) {
            return (obj[key] === opts1.placeholder || obj[key] === undefined) && (!opts1.comments || !includes(key, opts1.comments));
          });
        });
        // console.log(`unusedKeys = ${JSON.stringify(unusedKeys, null, 4)}`)
        res = res.concat(unusedKeys.map(function (el) {
          return path + '.' + el;
        }));
        // console.log(`res = ${JSON.stringify(res, null, 4)}`)
      }
      // ------ PART 2 ------
      // no matter how many objects are there within our array, if any values
      // contain objects or arrays, traverse them recursively
      //
      var keys = (_ref3 = []).concat.apply(_ref3, _toConsumableArray(Object.keys(keySet).filter(function (key) {
        return isObj(keySet[key]) || isArr(keySet[key]);
      })));
      var keysContents = keys.map(function (key) {
        return typ(keySet[key]);
      });

      // can't use map() because we want to prevent nulls being written.
      // hence the reduce() contraption
      var extras = keys.map(function (el) {
        var _ref4;

        return (_ref4 = []).concat.apply(_ref4, _toConsumableArray(arr1.reduce(function (res1, obj) {
          if (existy(obj[el]) && obj[el] !== opts1.placeholder) {
            if (!opts1.comments || !includes(obj[el], opts1.comments)) {
              res1.push(obj[el]);
            }
          }
          return res1;
        }, [])));
      });
      var appendix = '';
      var innerDot = '';

      if (extras.length > 0) {
        extras.forEach(function (singleExtra, i) {
          if (keysContents[i] === 'Array') {
            appendix = '[' + i + ']';
          }
          innerDot = '.';
          res = findUnusedSyncInner(singleExtra, opts1, res, path + innerDot + keys[i] + appendix);
        });
      }
    } else if (arr1.every(function (el) {
      return typ(el) === 'Array';
    })) {
      arr1.forEach(function (singleArray, i) {
        res = findUnusedSyncInner(singleArray, opts1, res, path + '[' + i + ']');
      });
    } // else if (arr1.every(el => typ(el) === 'string')) {
    // }

    return removeLeadingDot(res);
  }

  return findUnusedSyncInner(arr, opts);
}

exports.getKeysetSync = getKeysetSync;
exports.getKeyset = getKeyset;
exports.enforceKeyset = enforceKeyset;
exports.enforceKeysetSync = enforceKeysetSync;
exports.sortAllObjectsSync = sortAllObjectsSync;
exports.noNewKeysSync = noNewKeysSync;
exports.findUnusedSync = findUnusedSync;

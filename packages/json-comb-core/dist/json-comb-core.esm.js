import setAllValuesTo from 'object-set-all-values-to';
import flattenAllArrays from 'object-flatten-all-arrays';
import mergeAdvanced from 'object-merge-advanced';
import fillMissingKeys from 'object-fill-missing-keys';
import nnk from 'object-no-new-keys';
import clone from 'lodash.clonedeep';
import includes from 'lodash.includes';
import type from 'type-detect';
import checkTypes from 'check-types-mini';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type$$1, value) {
      switch (type$$1) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

















































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// -----------------------------------------------------------------------------

function existy(x) {
  return x != null;
}
function isObj(something) {
  return type(something) === 'Object';
}
function isArr(something) {
  return Array.isArray(something);
}

function sortIfObject(obj) {
  if (isObj(obj)) {
    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
  }
  return obj;
}

// -----------------------------------------------------------------------------

function getKeyset(arrOriginal, opts) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/getKeyset(): [THROW_ID_11] Inputs missing!');
  }
  if (!isArr(arrOriginal)) {
    throw new Error('json-comb-core/getKeyset(): [THROW_ID_12] Input must be array! Currently it\'s: ' + type(arrOriginal));
  }
  if (arrOriginal.length === 0) {
    throw new Error('json-comb-core/getKeyset(): [THROW_ID_13] Input array is empty!');
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError('json-comb-core/getKeyset(): [THROW_ID_14] Options object must be a plain object! Currently it\'s: ' + type(opts) + ', equal to: ' + JSON.stringify(opts, null, 4));
  }

  var schemaObj = {};
  var arr = clone(arrOriginal);
  var defaults$$1 = {
    placeholder: false
  };
  opts = Object.assign(clone(defaults$$1), opts);
  checkTypes(opts, defaults$$1, {
    msg: 'json-comb-core/getKeyset(): [THROW_ID_10*]',
    schema: {
      placeholder: ['null', 'number', 'string', 'boolean', 'object']
    }
  });

  var fOpts = {
    flattenArraysContainingStringsToBeEmpty: true
  };

  arr.forEach(function (obj, i) {
    if (!isObj(obj)) {
      throw new TypeError('json-comb-core/getKeyset(): [THROW_ID_15] Non-object (' + type(obj) + ') detected within an array! It\'s the ' + i + 'th element: ' + JSON.stringify(obj, null, 4));
    }
    schemaObj = mergeAdvanced(flattenAllArrays(schemaObj, fOpts), flattenAllArrays(obj, fOpts), { mergeArraysContainingStringsToBeEmpty: true });
  });
  schemaObj = sortIfObject(setAllValuesTo(schemaObj, opts.placeholder));
  return schemaObj;
}

// -----------------------------------------------------------------------------

function enforceKeyset(obj, schemaKeyset) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_21] Inputs missing!');
  }
  if (arguments.length === 1) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_22] Second arg missing!');
  }
  if (!isObj(obj)) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_23] Input must be a plain object! Currently it\'s: ' + type(obj) + ', equal to: ' + JSON.stringify(obj, null, 4));
  }
  if (!isObj(schemaKeyset)) {
    throw new Error('json-comb-core/enforceKeyset(): [THROW_ID_24] Schema object must be a plain object! Currently it\'s: ' + type(schemaKeyset) + ', equal to: ' + JSON.stringify(schemaKeyset, null, 4));
  }
  return sortIfObject(fillMissingKeys(clone(obj), schemaKeyset));
}

// -----------------------------------------------------------------------------

// no news is good news - when keyset is ok, empty array is returned
// when there are rogue keys, array of paths is returned
function noNewKeys(obj, schemaKeyset) {
  if (arguments.length === 0) {
    throw new Error('json-comb-core/noNewKeys(): [THROW_ID_31] All inputs missing!');
  }
  if (arguments.length === 1) {
    throw new Error('json-comb-core/noNewKeys(): [THROW_ID_32] Schema object is missing!');
  }
  if (!isObj(obj)) {
    throw new Error('json-comb-core/noNewKeys(): [THROW_ID_33] Main input (1st arg.) must be a plain object! Currently it\'s: ' + type(obj) + ', equal to: ' + JSON.stringify(obj, null, 4));
  }
  if (!isObj(schemaKeyset)) {
    throw new Error('json-comb-core/noNewKeys(): [THROW_ID_34] Schema input (2nd arg.) must be a plain object! Currently it\'s: ' + type(schemaKeyset) + ', equal to: ' + JSON.stringify(schemaKeyset, null, 4));
  }
  return nnk(obj, schemaKeyset);
}

// -----------------------------------------------------------------------------

function findUnused(arrOriginal, opts) {
  //
  // PREPARATIONS AND TYPE CHECKS
  // ============================

  if (isArr(arrOriginal)) {
    if (arrOriginal.length === 0) {
      return [];
    }
  } else {
    throw new TypeError('json-comb-core/findUnused(): [THROW_ID_41] The first argument should be an array. Currently it\'s: ' + type(arrOriginal));
  }
  if (arguments.length > 1 && !isObj(opts)) {
    throw new TypeError('json-comb-core/findUnused(): [THROW_ID_42] The second argument, options object, must be a plain object, not ' + type(opts));
  }
  var defaults$$1 = {
    placeholder: false,
    comments: '__comment__'
  };
  opts = Object.assign({}, defaults$$1, opts);
  checkTypes(opts, defaults$$1, {
    msg: 'json-comb-core/findUnused(): [THROW_ID_40]',
    schema: {
      placeholder: ['null', 'number', 'string', 'boolean'],
      comments: ['string', 'boolean']
    }
  });
  if (opts.comments === true) {
    throw new TypeError('json-comb-core/findUnused(): [THROW_ID_43] opts.comments was set to Boolean "true", but it does not make sense. Either it\'s Boolean false or a string value. Please fix.');
  }
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

  function findUnusedInner(arr1, opts1, res, path) {
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
      return type(el) === 'Object';
    })) {
      var _ref;

      keySet = getKeyset(arr1);
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
      // no matter how many objects are there within our arr1ay, if any values
      // contain objects or arr1ays, traverse them recursively
      //
      var keys = (_ref = []).concat.apply(_ref, toConsumableArray(Object.keys(keySet).filter(function (key) {
        return isObj(keySet[key]) || isArr(keySet[key]);
      })));
      var keysContents = keys.map(function (key) {
        return type(keySet[key]);
      });

      // can't use map() because we want to prevent nulls being written.
      // hence the reduce() contraption
      var extras = keys.map(function (el) {
        var _ref2;

        return (_ref2 = []).concat.apply(_ref2, toConsumableArray(arr1.reduce(function (res1, obj) {
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
          res = findUnusedInner(singleExtra, opts1, res, path + innerDot + keys[i] + appendix);
        });
      }
    } else if (arr1.every(function (el) {
      return type(el) === 'Array';
    })) {
      arr1.forEach(function (singleArray, i) {
        res = findUnusedInner(singleArray, opts1, res, path + '[' + i + ']');
      });
    } // else if (arr1.every(el => type(el) === 'string')) {
    // }

    return removeLeadingDot(res);
  }

  return findUnusedInner(arr, opts);
}

// -----------------------------------------------------------------------------

var main = {
  getKeyset: getKeyset,
  enforceKeyset: enforceKeyset,
  sortIfObject: sortIfObject,
  noNewKeys: noNewKeys,
  findUnused: findUnused
};

export default main;

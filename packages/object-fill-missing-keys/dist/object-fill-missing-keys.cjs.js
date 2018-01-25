'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var merge = _interopDefault(require('object-merge-advanced'));
var checkTypes = _interopDefault(require('check-types-mini'));
var arrayiffyIfString = _interopDefault(require('arrayiffy-if-string'));
var allValuesEqualTo = _interopDefault(require('object-all-values-equal-to'));
var isObj = _interopDefault(require('lodash.isplainobject'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint no-prototype-builtins:0, max-len:0, no-param-reassign:0 */

// ===================================
// V A R S

// ===================================
// I N T E R N A L   F U N C T I O N S

function isArr(something) {
  return Array.isArray(something);
}
function typ(something) {
  if (isObj(something)) {
    return 'plain object';
  } else if (isArr(something)) {
    return 'array';
  }
  return typeof something === 'undefined' ? 'undefined' : _typeof(something);
}
function isStr(something) {
  return typeof something === 'string';
}

// this function does the job, but it is not exposed because its first argument
// requirements are loose - it can be anything since it will be calling itself recursively
// with potentially AST contents (objects containing arrays containing objects etc.)
function fillMissingKeys(incompleteOriginal, schema, opts) {
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  var incomplete = clone(incompleteOriginal);
  if (!(path.length && opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(path) && allValuesEqualTo(incomplete, opts.placeholder))) {
    if (isObj(schema) && isObj(incomplete)) {
      // traverse the keys on schema and add them onto incomplete
      Object.keys(schema).forEach(function (key) {
        // calculate the path for current key
        var currentPath = '' + (path ? path + '.' : '') + key;

        if (!(opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(currentPath) && allValuesEqualTo(incomplete[key], opts.placeholder))) {
          incomplete[key] = fillMissingKeys(incomplete[key], schema[key], opts, currentPath);
        }
      });
    } else if (isArr(schema) && isArr(incomplete)) {
      if (incomplete.length === 0) {
        return schema;
      }
      if (schema.length > 0) {
        for (var i = incomplete.length; i--;) {
          var currentPath = (path ? path + '.' : '') + '0';
          if (isObj(schema[0]) || isArr(schema[0])) {
            incomplete[i] = fillMissingKeys(incomplete[i], schema[0], opts, currentPath);
          }
        }
      }
    } else {
      return merge(schema, incomplete);
    }
  }
  return incomplete;
}

// =================================================
// T H E   E X P O S E D   F U N C T I O N

function fillMissingKeysWrapper(originalIncompleteWrapper, originalSchemaWrapper, originalOptsWrapper) {
  // first argument must be an object. However, we're going to call recursively,
  // so we have to wrap the main function with another, wrapper-one, and perform
  // object-checks only on that wrapper. This way, only objects can come in,
  // but inside there can be whatever data structures.
  //
  // Also, wrapper function will shield the fourth argument from the outside API
  //
  if (arguments.length === 0) {
    throw new Error('object-fill-missing-keys: [THROW_ID_01] All arguments are missing!');
  }
  if (!isObj(originalIncompleteWrapper)) {
    throw new Error('object-fill-missing-keys: [THROW_ID_02] First argument, input object must be a plain object. Currently it\'s type is "' + typ(originalIncompleteWrapper) + '" and it\'s equal to: ' + JSON.stringify(originalIncompleteWrapper, null, 4));
  }
  if (!isObj(originalSchemaWrapper)) {
    throw new Error('object-fill-missing-keys: [THROW_ID_03] Second argument, schema object, must be a plain object. Currently it\'s type is "' + typ(originalSchemaWrapper) + '" and it\'s equal to: ' + JSON.stringify(originalSchemaWrapper, null, 4));
  }
  if (originalOptsWrapper !== undefined && originalOptsWrapper !== null && !isObj(originalOptsWrapper)) {
    throw new Error('object-fill-missing-keys: [THROW_ID_04] Third argument, schema object, must be a plain object. Currently it\'s type is "' + typ(originalOptsWrapper) + '" and it\'s equal to: ' + JSON.stringify(originalOptsWrapper, null, 4));
  }
  if (originalOptsWrapper === null) {
    originalOptsWrapper = {};
  }

  var defaults = {
    placeholder: false, // value which is being used as a placeholder
    doNotFillThesePathsIfTheyContainPlaceholders: []
    // fill any settings with defaults if missing:
  };var opts = Object.assign({}, defaults, originalOptsWrapper);

  opts.doNotFillThesePathsIfTheyContainPlaceholders = arrayiffyIfString(opts.doNotFillThesePathsIfTheyContainPlaceholders);

  // the check:
  checkTypes(opts, defaults, {
    msg: 'object-fill-missing-keys: [THROW_ID_05*]',
    schema: {
      placeholder: ['object', 'array', 'string', 'null', 'boolean', 'number']
    }
  });
  var culpritsVal = null;
  var culpritsIndex = null;
  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(function (key, idx) {
    if (!isStr(key)) {
      culpritsVal = key;
      culpritsIndex = idx;
      return false;
    }
    return true;
  })) {
    throw new Error('object-fill-missing-keys: [THROW_ID_06] opts.doNotFillThesePathsIfTheyContainPlaceholders element with an index number "' + culpritsIndex + '" is not a string! It\'s ' + typ(culpritsVal) + ', equal to:\n' + JSON.stringify(culpritsVal, null, 4));
  }

  return fillMissingKeys(clone(originalIncompleteWrapper), clone(originalSchemaWrapper), opts);
}

module.exports = fillMissingKeysWrapper;

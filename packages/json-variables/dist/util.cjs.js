'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var typ = _interopDefault(require('type-detect'));
var search = _interopDefault(require('str-indexes-of-plus'));
var slice = _interopDefault(require('string-slice'));
var strLen = _interopDefault(require('string-length'));
var trim = _interopDefault(require('lodash.trim'));
var includes = _interopDefault(require('lodash.includes'));
var clone = _interopDefault(require('lodash.clonedeep'));
var numSort = _interopDefault(require('num-sort'));
var astMonkey = require('ast-monkey');
var arrayiffyIfString = _interopDefault(require('arrayiffy-if-string'));

/* eslint padded-blocks: 0, no-param-reassign:0, no-loop-func:0 */

function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
}

function aContainsB(a, b) {
  if (arguments.length < 2) {
    return false;
  }
  return String(a).indexOf(String(b)) >= 0;
}

function aStartsWithB(a, b) {
  if (!truthy(a) || !truthy(b)) {
    return false;
  }
  return a.indexOf(b) === 0;
}

function isStr(something) {
  return typ(something) === 'string';
}

function findLastInArray(array, val) {
  var res = null;
  if (!existy(val)) {
    return res;
  }
  array.forEach(function (el, i) {
    if (array[i] === val) {
      res = i;
    }
  });
  return res;
}

// since v.1.1 str can be equal to heads or tails - there won't be any results
// though (result will be empty array)
function extractVarsFromString(str, heads, tails) {
  if (arguments.length === 0) {
    throw new Error('json-variables/util.js/extractVarsFromString(): inputs missing!');
  }
  var res = [];
  if (typ(str) !== 'string') {
    throw new Error('json-variables/util.js/extractVarsFromString(): first arg must be string-type. Currently it\'s: ' + typ(str));
  }
  if (heads === undefined) {
    heads = ['%%_'];
  }
  if (tails === undefined) {
    tails = ['_%%'];
  }
  if (typ(heads) !== 'string' && typ(heads) !== 'Array') {
    throw new Error('json-variables/util.js/extractVarsFromString(): second arg must be a string or an array of strings. Currently it\'s: ' + typ(heads));
  }
  if (typ(tails) !== 'string' && typ(tails) !== 'Array') {
    throw new Error('json-variables/util.js/extractVarsFromString(): third arg must be a string or an array of strings. Currently it\'s: ' + typ(tails));
  }
  heads = arrayiffyIfString(clone(heads));
  tails = arrayiffyIfString(clone(tails));
  if (includes(heads, str) || includes(tails, str)) {
    return [];
  }
  if (str.length === 0) {
    return res;
  }
  // var foundHeads = search(str, heads)
  // var foundTails = search(str, tails)
  var foundHeads = heads.reduce(function (acc, val) {
    return acc.concat(search(str, val));
  }, []).sort(numSort.asc);

  var foundTails = tails.reduce(function (acc, val) {
    return acc.concat(search(str, val));
  }, []).sort(numSort.asc);

  if (foundHeads.length !== foundTails.length && !includes(heads, str) && !includes(tails, str)) {
    throw new Error('json-variables/util.js/extractVarsFromString(): Mismatching heads and tails in the input:' + str);
  }

  var to = void 0;
  var from = void 0;
  var currentHeadLength = void 0;

  var _loop = function _loop(i, len) {
    heads.forEach(function (el) {
      if (aStartsWithB(slice(str, foundHeads[i]), el)) {
        currentHeadLength = strLen(el);
      }
    });
    from = foundHeads[i] + currentHeadLength;
    to = foundTails[i];
    res.push(trim(slice(str, from, to)));
  };

  for (var i = 0, len = foundHeads.length; i < len; i++) {
    _loop(i, len);
  }
  return res;
}

// accepts array, where elements are arrays, containing integers or null.
// for example:
// [ [1, 3], [5, null], [null, 16] ]
//
// it's for internal use, so there is no input type validation
function fixOffset(whatever, position, amount) {
  whatever = astMonkey.traverse(whatever, function (key, val) {
    var current = existy(val) ? val : key;
    if (val === undefined && typeof key === 'number') {
      if (existy(amount) && amount !== 0 && key > position) {
        return key + amount;
      }
    }
    return current;
  });
  return whatever;
}

// extracts all the characters from the front of a string until finds "." or "[".
function front(str) {
  if (!isStr(str)) {
    return str;
  }
  return existy(str.match(/\b[^.[]+/)) ? str.match(/\b[^.[]+/)[0] : '';
}

// splits object-path notation into array: "aaa.bbb[ccc]" => ["aaa", "bbb", "ccc"]
function splitObjectPath(str) {
  // console.log('str = ' + JSON.stringify(str, null, 4))
  var re = /\s*[[.*\]]\s*/;
  if (!isStr(str)) {
    return str;
  }
  var res = str.split(re).filter(function (n) {
    return existy(n) && n.length > 0;
  }).map(Function.prototype.call, String.prototype.trim);
  // console.log('res = ' + JSON.stringify(res, null, 4))
  return res;
}

exports.aContainsB = aContainsB;
exports.aStartsWithB = aStartsWithB;
exports.extractVarsFromString = extractVarsFromString;
exports.findLastInArray = findLastInArray;
exports.fixOffset = fixOffset;
exports.front = front;
exports.splitObjectPath = splitObjectPath;

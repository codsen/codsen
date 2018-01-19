import checkTypes from 'check-types-mini';
import isObj from 'lodash.isplainobject';
import arrayiffy from 'arrayiffy-if-string';
import findht from 'string-find-heads-tails';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint no-mixed-operators:0, no-param-reassign:0 */

function removeDuplicateHeadsTails(str) {
  var originalOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  function existy(x) {
    return x != null;
  }
  var has = Object.prototype.hasOwnProperty;
  function isStr(something) {
    return typeof something === 'string';
  }
  if (str === undefined) {
    throw new Error('string-remove-duplicate-heads-tails: [THROW_ID_01] The input is missing!');
  }
  if (typeof str !== 'string') {
    throw new Error('string-remove-duplicate-heads-tails: [THROW_ID_02] The input is not string but ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)));
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error('string-remove-duplicate-heads-tails: [THROW_ID_03] The given options are not a plain object but ' + (typeof originalOpts === 'undefined' ? 'undefined' : _typeof(originalOpts)) + '!');
  }
  if (existy(originalOpts) && has.call(originalOpts, 'heads')) {
    if (!arrayiffy(originalOpts.heads).every(function (val) {
      return isStr(val);
    })) {
      throw new Error('string-remove-duplicate-heads-tails: [THROW_ID_05] The opts.heads contains elements which are not string-type!');
    } else if (isStr(originalOpts.heads)) {
      originalOpts.heads = arrayiffy(originalOpts.heads);
    }
  }
  if (existy(originalOpts) && has.call(originalOpts, 'tails')) {
    if (!arrayiffy(originalOpts.tails).every(function (val) {
      return isStr(val);
    })) {
      throw new Error('string-remove-duplicate-heads-tails: [THROW_ID_06] The opts.tails contains elements which are not string-type!');
    } else if (isStr(originalOpts.tails)) {
      originalOpts.tails = arrayiffy(originalOpts.tails);
    }
  }

  // early ending:
  if (str.trim() === '') {
    return str;
  }

  var defaults = {
    heads: ['{{'],
    tails: ['}}']
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, { msg: 'string-remove-duplicate-heads-tails: [THROW_ID_04*]' });

  // ===================== the action =====================

  // if at least one head and one tail was not found, bail early:
  if (!opts.heads.some(function (head) {
    return str.includes(head.trim());
  }) && !opts.tails.some(function (tail) {
    return str.includes(tail.trim());
  })) {
    return str;
  }

  var allVarsResolved = true;

  try {
    findht(str, opts.heads.map(function (val) {
      return val.trim();
    }), opts.tails.map(function (val) {
      return val.trim();
    }));
  } catch (e) {
    allVarsResolved = false;
  }

  var foundHead = void 0;
  var foundTail = void 0;

  // console.log(`allVarsResolved = ${JSON.stringify(allVarsResolved, null, 4)}`)

  if (!allVarsResolved && opts.heads.some(function (head) {
    // console.log('1')
    var res = str.trim().startsWith(head.trim());
    if (res) {
      foundHead = head.trim();
      return true;
    }
    // console.log('2')
    return false;
  }) && opts.tails.some(function (tail) {
    // console.log('3')
    var res = str.trim().endsWith(tail.trim());
    if (res) {
      foundTail = tail.trim();
      return true;
    }
    // console.log('4')
    return false;
  })) {
    var from = foundHead.length;
    var to = str.trim().length - foundTail.length;

    return str.trim().slice(from, to).trim();
  }

  return str;
}

export default removeDuplicateHeadsTails;

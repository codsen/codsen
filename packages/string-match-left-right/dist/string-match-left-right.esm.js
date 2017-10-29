import isNaturalNumber from 'is-natural-number';
import checkTypes from 'check-types-mini';
import isObj from 'lodash.isplainobject';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint no-param-reassign:0, default-case:0, consistent-return:0 */

function isStr(something) {
  return typeof something === 'string';
}

function main(mode, str, position, whatToMatch, opts) {
  function existy(x) {
    return x != null;
  }
  if (!isStr(str)) {
    throw new Error('string-match-left-right/' + mode + '(): [THROW_ID_01] the first argument should be a string. Currently it\'s of a type: ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)) + ', equal to:\n' + JSON.stringify(str, null, 4));
  }
  if (!isNaturalNumber(position, { includeZero: true })) {
    throw new Error('string-match-left-right/' + mode + '(): [THROW_ID_02] the second argument should be a natural number. Currently it\'s of a type: ' + (typeof position === 'undefined' ? 'undefined' : _typeof(position)) + ', equal to:\n' + JSON.stringify(position, null, 4));
  }
  if (isStr(whatToMatch)) {
    whatToMatch = [whatToMatch];
  }
  if (!existy(whatToMatch) || whatToMatch.length === 0) {
    throw new Error('string-match-left-right/' + mode + '(): [THROW_ID_03] there\'s nothing to match! Third argument (and onwards) is missing!');
  }
  if (existy(opts) && !isObj(opts)) {
    throw new Error('string-match-left-right/' + mode + '(): [THROW_ID_04] the third argument, options object, should be a plain object. Currently it\'s of a type "' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)) + '", and equal to:\n' + JSON.stringify(str, null, 4));
  }
  var defaults = {
    i: false
  };
  opts = Object.assign({}, defaults, opts);
  checkTypes(opts, defaults, {
    msg: 'string-match-left-right: [THROW_ID_05*]',
    schema: {
      cbLeft: ['null', 'undefined', 'function'],
      cbRight: ['null', 'undefined', 'function']
    }
  });

  switch (mode) {
    case 'matchLeftIncl':
      return whatToMatch.some(function (el) {
        var temp = str.slice(position - el.length + 1, position + 1);
        if (opts.i) {
          return temp === el.toLowerCase() && (opts.cbLeft ? opts.cbLeft(str[position - el.length]) : true);
        }
        return temp === el && (opts.cbLeft ? opts.cbLeft(str[position - el.length]) : true);
      });
    case 'matchLeft':
      return whatToMatch.some(function (el) {
        var temp = str.slice(position - el.length, position);
        if (opts.i) {
          return temp === el.toLowerCase() && (opts.cbLeft ? opts.cbLeft(str[position - el.length - 1]) : true);
        }
        return temp === el && (opts.cbLeft ? opts.cbLeft(str[position - el.length - 1]) : true);
      });
    case 'matchRightIncl':
      return whatToMatch.some(function (el) {
        var temp = str.slice(position, position + el.length);
        if (opts.i) {
          return temp === el.toLowerCase() && (opts.cbRight ? opts.cbRight(str[position + el.length]) : true);
        }
        return temp === el && (opts.cbRight ? opts.cbRight(str[position + el.length]) : true);
      });
    case 'matchRight':
      return whatToMatch.some(function (el) {
        var temp = str.slice(position + 1, position + el.length + 1);
        if (opts.i) {
          return temp === el.toLowerCase() && (opts.cbRight ? opts.cbRight(str[position + el.length + 1]) : true);
        }
        return temp === el && (opts.cbRight ? opts.cbRight(str[position + el.length + 1]) : true);
      });
  }
}

function matchLeftIncl(str, position, whatToMatch, opts) {
  return main('matchLeftIncl', str, position, whatToMatch, opts);
}

function matchLeft(str, position, whatToMatch, opts) {
  return main('matchLeft', str, position, whatToMatch, opts);
}

function matchRightIncl(str, position, whatToMatch, opts) {
  return main('matchRightIncl', str, position, whatToMatch, opts);
}

function matchRight(str, position, whatToMatch, opts) {
  return main('matchRight', str, position, whatToMatch, opts);
}

export { matchLeftIncl, matchRightIncl, matchLeft, matchRight };

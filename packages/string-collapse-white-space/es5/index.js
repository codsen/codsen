'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var checkTypes = require('check-types-mini/es5');
var isObj = require('lodash.isplainobject');
var replaceSlicesArr = require('string-replace-slices-array/es5');
var Slices = require('string-slices-array-push/es5');

function collapse(str, opts) {
  if (typeof str !== 'string') {
    throw new Error('string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)) + ', equal to: ' + JSON.stringify(str, null, 4));
  }
  if (opts !== undefined && opts !== null && !isObj(opts)) {
    throw new Error('string-collapse-white-space/collapse(): [THROW_ID_02] The opts is not a plain object but ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)) + ', equal to:\n' + JSON.stringify(str, null, 4));
  }
  if (str.length === 0) {
    return '';
  }

  var DEBUG = 0;
  var finalIndexesToDelete = new Slices();

  // declare defaults, so we can enforce types later:
  var defaults = {
    trimStart: true, // otherwise, leading whitespace will be collapsed to a single space
    trimEnd: true // otherwise, trailing whitespace will be collapsed to a single space


    // fill any settings with defaults if missing:
  };opts = Object.assign({}, defaults, opts);

  // the check:
  checkTypes(opts, defaults, { msg: 'string-collapse-white-space/collapse(): [THROW_ID_03*]' });

  // -----------------------------------------------------------------------------

  var res;
  var spacesEndAt = null;
  var whiteSpaceEndsAt = null;

  // looping backwards for better efficiency
  for (var i = str.length; i--;) {
    if (DEBUG) {
      console.log('------------------------------- str[' + i + '] = ' + (str[i].trim() !== '' ? str[i] : 'space'));
    }

    // space clauses
    if (str[i] === ' ') {
      // it's a space character
      if (spacesEndAt === null) {
        spacesEndAt = i;
        if (DEBUG) {
          console.log('START spacesEndAt = ' + JSON.stringify(spacesEndAt, null, 4));
        }
      }
    } else {
      // it's not a space character
      // if we have a sequence of spaces, this character terminates that sequence
      if (spacesEndAt !== null) {
        if (i + 1 !== spacesEndAt) {
          if (DEBUG) {
            console.log('!!! adding range (' + (i + 1) + ',' + spacesEndAt + ')');
          }
          finalIndexesToDelete.add(i + 1, spacesEndAt);
        }
        if (DEBUG) {
          console.log('STOP spacesEndAt');
        }
        spacesEndAt = null;
      }
    }

    // white space clauses
    if (str[i].trim() === '') {
      // it's some sort of white space character
      if (whiteSpaceEndsAt === null) {
        whiteSpaceEndsAt = i;
        if (DEBUG) {
          console.log('START whiteSpaceEndsAt = ' + JSON.stringify(whiteSpaceEndsAt, null, 4));
        }
      }
    } else {
      // it's not white space character
      if (whiteSpaceEndsAt !== null) {
        if (DEBUG) {
          console.log('\n* whiteSpaceEndsAt = ' + JSON.stringify(whiteSpaceEndsAt, null, 4));
        }
        if (DEBUG) {
          console.log('* str.length - 1 = ' + JSON.stringify(str.length - 1, null, 4));
        }
        if (DEBUG) {
          console.log('');
        }
        if (i + 1 !== whiteSpaceEndsAt + 1 && whiteSpaceEndsAt === str.length - 1 && opts.trimEnd) {
          if (DEBUG) {
            console.log('!!!* adding range (' + (i + 1) + ',' + (whiteSpaceEndsAt + 1) + ')');
          }
          finalIndexesToDelete.add(i + 1, whiteSpaceEndsAt + 1);
        }
        if (DEBUG) {
          console.log('STOP whiteSpaceEndsAt');
        }
        whiteSpaceEndsAt = null;
      }
    }

    // this chunk could be ported to the (str[i].trim() === '') clause for example,
    // but it depends on the flags that it's else is setting, (whiteSpaceEndsAt !== null)
    // therefore it's less code if we put zero index clauses here.
    if (i === 0) {
      if (whiteSpaceEndsAt !== null && opts.trimStart) {
        if (DEBUG) {
          console.log('2!!! adding range (0,' + whiteSpaceEndsAt + ')');
        }
        finalIndexesToDelete.add(0, whiteSpaceEndsAt + 1);
      } else if (spacesEndAt !== null) {
        if (DEBUG) {
          console.log('1!!! adding range (' + (i + 1) + ',' + (spacesEndAt + 1) + ')');
        }
        finalIndexesToDelete.add(i + 1, spacesEndAt + 1);
      }
    }
  }

  if (DEBUG) {
    console.log('\n\n====\n\n\nfinalIndexesToDelete.current() = ' + JSON.stringify(finalIndexesToDelete.current(), null, 4));
  }

  // apply the ranges
  if (finalIndexesToDelete.current()) {
    res = replaceSlicesArr(str, finalIndexesToDelete.current());
    finalIndexesToDelete.wipe();
    finalIndexesToDelete = undefined; // putting up our class for garbage collector
    if (DEBUG) {
      console.log('\n\n\nres = >>>' + JSON.stringify(res, null, 4) + '<<<\n\n\n');
    }
    return res;
  } else {
    return str;
  }
}

module.exports = collapse;
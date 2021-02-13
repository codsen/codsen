/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse AST, reports upcoming values
 * Version: 2.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse-with-lookahead/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var clone = require('lodash.clonedeep');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version = "2.0.4";

var version$1 = version;

function traverse(tree1, cb1, lookahead) {
  if (lookahead === void 0) {
    lookahead = 0;
  }

  function trimFirstDot(str) {
    if (typeof str === "string" && str[0] === ".") {
      return str.slice(1);
    }

    return str;
  }
  var stop1 = {
    now: false
  }; // that's where we stash the arguments that the callback function tries
  // to ping; we keep them until enough of them is gathered to set them as
  // "future" values:

  var stash = []; // ^ LIFO STACK
  //
  // traverseInner() needs a wrapper to shield the internal arguments and simplify external API.
  //

  function traverseInner(tree, callback, innerObj, stop) {
    innerObj = _objectSpread__default['default']({}, innerObj);
    innerObj.depth += 1;

    if (Array.isArray(tree)) {

      for (var i = 0, len = tree.length; i < len; i++) {

        if (stop.now) {
          break;
        }

        var path = innerObj.path + "." + i;
        innerObj.parent = clone__default['default'](tree);
        innerObj.parentType = "array"; // innerObj.path = `${innerObj.path}[${i}]`

        callback(tree[i], undefined, _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
          path: trimFirstDot(path)
        }), stop);
        traverseInner(tree[i], callback, _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
          path: trimFirstDot(path)
        }), stop);
      }
    } else if (isObj__default['default'](tree)) { // eslint-disable-next-line

      for (var key in tree) {

        if (stop.now && key != null) {
          break;
        }

        var _path = innerObj.path + "." + key;

        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }

        innerObj.parent = clone__default['default'](tree);
        innerObj.parentType = "object";
        callback(key, tree[key], _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
          path: trimFirstDot(_path)
        }), stop);
        traverseInner(tree[key], callback, _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
          path: trimFirstDot(_path)
        }), stop);
      }
    }
    return tree;
  } // for DRY purposes, we extract the function which reports the first element
  // from the stash and removes that element.


  function reportFirstFromStash() { // start to assemble node we're report to the callback cb1()

    var currentElem = stash.shift(); // ^ shift removes it from stash
    // now we need the "future" nodes, as many as "lookahead" of them
    // that's the container where they'll sit:

    currentElem[2].next = [];

    for (var i = 0; i < lookahead; i++) { // we want as many as "lookahead" from stash but there might be not enough

      if (stash[i]) {
        currentElem[2].next.push(clone__default['default']([stash[i][0], stash[i][1], stash[i][2]]));
      } else {
        break;
      }
    } // finally, ping the callback with assembled element:
    cb1.apply(void 0, currentElem);
  } // used to buffer "lookahead"-amount of results and report them as "future"
  // nodes


  function intermediary() {
    for (var _len = arguments.length, incoming = new Array(_len), _key = 0; _key < _len; _key++) {
      incoming[_key] = arguments[_key];
    } // 1. put the incoming things into stash.
    // We need to delete the "now" element, the last-one in here,
    // because it's for internal use

    stash.push([].concat(incoming)); // 2. if there are enough things gathered in stash, report the first one
    // from the stash:

    if (stash.length > lookahead) { // the following function has "stash" in its scope and it will mutate
      // the stash:

      reportFirstFromStash();
    }
  }

  traverseInner(tree1, intermediary, {
    depth: -1,
    path: ""
  }, stop1); // once the end is reached, clean up the stash - that's the remaining elements
  // that will have less "future" reported in them, compared to what was
  // requested by "lookahead"

  if (stash.length) {

    for (var i = 0, len = stash.length; i < len; i++) {
      reportFirstFromStash();
    }
  }
} // -----------------------------------------------------------------------------

exports.traverse = traverse;
exports.version = version$1;

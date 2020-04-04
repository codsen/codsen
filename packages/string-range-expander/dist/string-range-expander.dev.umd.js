/**
 * string-range-expander
 * Expands string index ranges within whitespace boundaries until letters are met
 * Version: 1.10.57
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-range-expander
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.stringRangeExpander = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** `Object#toString` result references. */
  var objectTag = '[object Object]';
  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */

  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;

    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }

    return result;
  }
  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */


  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }
  /** Used for built-in method references. */


  var funcProto = Function.prototype,
      objectProto = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /** Used to infer the `Object` constructor. */

  var objectCtorString = funcToString.call(Object);
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString = objectProto.toString;
  /** Built-in value references. */

  var getPrototype = overArg(Object.getPrototypeOf, Object);
  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */

  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }
  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */


  function isPlainObject(value) {
    if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
      return false;
    }

    var proto = getPrototype(value);

    if (proto === null) {
      return true;
    }

    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }

  var lodash_isplainobject = isPlainObject;

  var isArr = Array.isArray;

  function expander(originalOpts) {
    var letterOrDigit = /^[0-9a-zA-Z]+$/; // Internal functions
    // ---------------------------------------------------------------------------

    function isWhitespace(_char) {
      if (!_char || typeof _char !== "string") {
        return false;
      }

      return _char.trim().length === 0;
    }

    function isStr(something) {
      return typeof something === "string";
    } // Sanitise the inputs
    // ---------------------------------------------------------------------------


    if (!lodash_isplainobject(originalOpts)) {
      var supplementalString;

      if (originalOpts === undefined) {
        supplementalString = "but it is missing completely.";
      } else if (originalOpts === null) {
        supplementalString = "but it was given as null.";
      } else {
        supplementalString = "but it was given as ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4), ".");
      }

      throw new Error("string-range-expander: [THROW_ID_01] Input must be a plain object ".concat(supplementalString));
    } else if (lodash_isplainobject(originalOpts) && Object.keys(originalOpts).length === 0) {
      throw new Error("string-range-expander: [THROW_ID_02] Input must be a plain object but it was given as a plain object without any keys and computer doesn't know what to expand.");
    }

    if (typeof originalOpts.from !== "number") {
      throw new Error("string-range-expander: [THROW_ID_03] The input's \"from\" value opts.from, is not a number! Currently it's given as ".concat(_typeof(originalOpts.from), ", equal to ").concat(JSON.stringify(originalOpts.from, null, 0)));
    }

    if (typeof originalOpts.to !== "number") {
      throw new Error("string-range-expander: [THROW_ID_04] The input's \"to\" value opts.to, is not a number! Currently it's given as ".concat(_typeof(originalOpts.to), ", equal to ").concat(JSON.stringify(originalOpts.to, null, 0)));
    }

    if (!originalOpts.str[originalOpts.from] && originalOpts.from !== originalOpts.to) {
      throw new Error("string-range-expander: [THROW_ID_05] The given input string opts.str (\"".concat(originalOpts.str, "\") must contain the character at index \"from\" (\"").concat(originalOpts.from, "\")"));
    }

    if (!originalOpts.str[originalOpts.to - 1]) {
      throw new Error("string-range-expander: [THROW_ID_06] The given input string, opts.str (\"".concat(originalOpts.str, "\") must contain the character at index before \"to\" (\"").concat(originalOpts.to - 1, "\")"));
    }

    if (originalOpts.from > originalOpts.to) {
      throw new Error("string-range-expander: [THROW_ID_07] The given \"from\" index, \"".concat(originalOpts.from, "\" is greater than \"to\" index, \"").concat(originalOpts.to, "\". That's wrong!"));
    }

    if (isStr(originalOpts.extendToOneSide) && originalOpts.extendToOneSide !== "left" && originalOpts.extendToOneSide !== "right" || !isStr(originalOpts.extendToOneSide) && originalOpts.extendToOneSide !== undefined && originalOpts.extendToOneSide !== false) {
      throw new Error("string-range-expander: [THROW_ID_08] The opts.extendToOneSide value is not recogniseable! It's set to: \"".concat(originalOpts.extendToOneSide, "\" (").concat(_typeof(originalOpts.extendToOneSide), "). It has to be either Boolean \"false\" or strings \"left\" or \"right\""));
    } // Prepare the opts
    // ---------------------------------------------------------------------------


    var defaults = {
      str: "",
      from: 0,
      to: 0,
      ifLeftSideIncludesThisThenCropTightly: "",
      ifLeftSideIncludesThisCropItToo: "",
      ifRightSideIncludesThisThenCropTightly: "",
      ifRightSideIncludesThisCropItToo: "",
      extendToOneSide: false,
      wipeAllWhitespaceOnLeft: false,
      wipeAllWhitespaceOnRight: false,
      addSingleSpaceToPreventAccidentalConcatenation: false
    };
    var opts = Object.assign({}, defaults, originalOpts);

    if (isArr(opts.ifLeftSideIncludesThisThenCropTightly)) {
      var culpritsIndex;
      var culpritsValue;

      if (opts.ifLeftSideIncludesThisThenCropTightly.every(function (val, i) {
        if (!isStr(val)) {
          culpritsIndex = i;
          culpritsValue = val;
          return false;
        }

        return true;
      })) {
        opts.ifLeftSideIncludesThisThenCropTightly = opts.ifLeftSideIncludesThisThenCropTightly.join("");
      } else {
        throw new Error("string-range-expander: [THROW_ID_09] The opts.ifLeftSideIncludesThisThenCropTightly was set to an array:\n".concat(JSON.stringify(opts.ifLeftSideIncludesThisThenCropTightly, null, 4), ". Now, that array contains not only string elements. For example, an element at index ").concat(culpritsIndex, " is of a type ").concat(_typeof(culpritsValue), " (equal to ").concat(JSON.stringify(culpritsValue, null, 0), ")."));
      }
    } // Real deal
    // ---------------------------------------------------------------------------


    var str = opts.str; // convenience

    var from = opts.from;
    var to = opts.to; // 1. expand the given range outwards and leave a single space or
    // {single-of-whatever-there-was} (like line break, tab etc) on each side

    if (opts.extendToOneSide !== "right" && (isWhitespace(str[from - 1]) && (isWhitespace(str[from - 2]) || opts.ifLeftSideIncludesThisCropItToo.includes(str[from - 2])) || str[from - 1] && opts.ifLeftSideIncludesThisCropItToo.includes(str[from - 1]) || opts.wipeAllWhitespaceOnLeft && isWhitespace(str[from - 1]))) {
      // loop backwards
      for (var i = from; i--;) {
        if (!opts.ifLeftSideIncludesThisCropItToo.includes(str[i])) {
          if (str[i].trim().length) {
            if (opts.wipeAllWhitespaceOnLeft || opts.ifLeftSideIncludesThisCropItToo.includes(str[i + 1])) {
              from = i + 1;
            } else {
              from = i + 2;
            }

            break;
          } else if (i === 0) {
            if (opts.wipeAllWhitespaceOnLeft) {
              from = 0;
            } else {
              from = 1;
            }

            break;
          }
        }
      }
    } // 2. expand forward


    if (opts.extendToOneSide !== "left" && (isWhitespace(str[to]) && (opts.wipeAllWhitespaceOnRight || isWhitespace(str[to + 1])) || opts.ifRightSideIncludesThisCropItToo.includes(str[to]))) {
      // loop forward
      for (var _i = to, len = str.length; _i < len; _i++) {
        if (!opts.ifRightSideIncludesThisCropItToo.includes(str[_i]) && (str[_i] && str[_i].trim().length || str[_i] === undefined)) {
          if (opts.wipeAllWhitespaceOnRight || opts.ifRightSideIncludesThisCropItToo.includes(str[_i - 1])) {
            to = _i;
          } else {
            to = _i - 1;
          }

          break;
        }
      }
    } // 3. tight crop adjustments


    if (opts.extendToOneSide !== "right" && isStr(opts.ifLeftSideIncludesThisThenCropTightly) && opts.ifLeftSideIncludesThisThenCropTightly.length && (str[from - 2] && opts.ifLeftSideIncludesThisThenCropTightly.includes(str[from - 2]) || str[from - 1] && opts.ifLeftSideIncludesThisThenCropTightly.includes(str[from - 1])) || opts.extendToOneSide !== "left" && isStr(opts.ifRightSideIncludesThisThenCropTightly) && opts.ifRightSideIncludesThisThenCropTightly.length && (str[to + 1] && opts.ifRightSideIncludesThisThenCropTightly.includes(str[to + 1]) || str[to] && opts.ifRightSideIncludesThisThenCropTightly.includes(str[to]))) {
      if (opts.extendToOneSide !== "right" && isWhitespace(str[from - 1]) && !opts.wipeAllWhitespaceOnLeft) {
        from--;
      }

      if (opts.extendToOneSide !== "left" && isWhitespace(str[to]) && !opts.wipeAllWhitespaceOnRight) {
        to++;
      }
    }

    if (opts.addSingleSpaceToPreventAccidentalConcatenation && str[from - 1] && str[from - 1].trim().length && str[to] && str[to].trim().length && (!opts.ifLeftSideIncludesThisThenCropTightly && !opts.ifRightSideIncludesThisThenCropTightly || !((!opts.ifLeftSideIncludesThisThenCropTightly || opts.ifLeftSideIncludesThisThenCropTightly.includes(str[from - 1])) && (!opts.ifRightSideIncludesThisThenCropTightly || str[to] && opts.ifRightSideIncludesThisThenCropTightly.includes(str[to])))) && (letterOrDigit.test(str[from - 1]) || letterOrDigit.test(str[to]))) {
      return [from, to, " "];
    }

    return [from, to];
  }

  return expander;

})));

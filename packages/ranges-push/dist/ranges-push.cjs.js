/**
 * ranges-push
 * Manage the array of slices referencing the index ranges within the string
 * Version: 3.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isInt = _interopDefault(require('is-natural-number'));
var isNumStr = _interopDefault(require('is-natural-number-string'));
var ordinal = _interopDefault(require('ordinal-number-suffix'));
var mergeRanges = _interopDefault(require('ranges-merge'));
var checkTypes = _interopDefault(require('check-types-mini'));
var collapseLeadingWhitespace = _interopDefault(require('string-collapse-leading-whitespace'));

function _typeof(obj) {
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function existy(x) {
  return x != null;
}
var isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function mandatory(i) {
  throw new Error("string-slices-array-push/Slices/add(): [THROW_ID_01] Missing ".concat(ordinal(i), " input parameter!"));
}
function prepNumStr(str) {
  return isNumStr(str, {
    includeZero: true
  }) ? parseInt(str, 10) : str;
}
var Slices =
function () {
  function Slices(originalOpts) {
    _classCallCheck(this, Slices);
    var defaults = {
      limitToBeAddedWhitespace: false,
      limitLinebreaksCount: 1
    };
    var opts = Object.assign({}, defaults, originalOpts);
    checkTypes(opts, defaults, {
      msg: "string-slices-array-push: [THROW_ID_02*]"
    });
    this.opts = opts;
  }
  _createClass(Slices, [{
    key: "add",
    value: function add() {
      var _this = this;
      var originalFrom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory(1);
      var originalTo = arguments.length > 1 ? arguments[1] : undefined;
      var addVal = arguments.length > 2 ? arguments[2] : undefined;
      for (var _len = arguments.length, etc = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        etc[_key - 3] = arguments[_key];
      }
      if (etc.length > 0) {
        throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ".concat(JSON.stringify(etc, null, 4)));
      }
      if (originalFrom === null && originalTo === undefined && addVal === undefined) {
        return;
      }
      var from = isNumStr(originalFrom, {
        includeZero: true
      }) ? parseInt(originalFrom, 10) : originalFrom;
      var to = isNumStr(originalTo, {
        includeZero: true
      }) ? parseInt(originalTo, 10) : originalTo;
      if (isArr(originalFrom) && !existy(originalTo)) {
        var culpritId;
        var culpritVal;
        if (originalFrom.length > 0) {
          if (originalFrom.every(function (thing, index) {
            if (isArr(thing)) {
              return true;
            }
            culpritId = index;
            culpritVal = thing;
            return false;
          })) {
            originalFrom.forEach(function (arr, idx) {
              if (isInt(prepNumStr(arr[0]), {
                includeZero: true
              })) {
                if (isInt(prepNumStr(arr[1]), {
                  includeZero: true
                })) {
                  if (!existy(arr[2]) || isStr(arr[2])) {
                    _this.add.apply(_this, _toConsumableArray(arr));
                  } else {
                    throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_04] The ".concat(ordinal(idx), " ranges array's \"to add\" value is not string but ").concat(_typeof(arr[2]), "! It's equal to: ").concat(arr[2], "."));
                  }
                } else {
                  throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_05] The ".concat(ordinal(idx), " ranges array's ending range index, an element at its first index, is not a natural number! It's equal to: ").concat(arr[1], "."));
                }
              } else {
                throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_06] The ".concat(ordinal(idx), " ranges array's starting range index, an element at its zero'th index, is not a natural number! It's equal to: ").concat(arr[0], "."));
              }
            });
          } else {
            throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_07] first argument was given as array but it contains not only range arrays. For example, at index ".concat(culpritId, " we have ").concat(_typeof(culpritVal), "-type value:\n").concat(JSON.stringify(culpritVal, null, 4), "."));
          }
        }
      } else if (isInt(from, {
        includeZero: true
      }) && isInt(to, {
        includeZero: true
      })) {
        if (existy(addVal) && !isStr(addVal)) {
          throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ".concat(_typeof(addVal), ", equal to:\n").concat(JSON.stringify(addVal, null, 4)));
        }
        if (existy(this.slices) && isArr(this.last()) && from === this.last()[1]) {
          this.last()[1] = to;
          if (this.last()[2] !== null && existy(addVal)) {
            var calculatedVal = existy(this.last()[2]) && this.last()[2].length > 0 ? this.last()[2] + addVal : addVal;
            if (this.opts.limitToBeAddedWhitespace) {
              calculatedVal = collapseLeadingWhitespace(calculatedVal, this.opts.limitLinebreaksCount);
            }
            if (!(isStr(calculatedVal) && !calculatedVal.length)) {
              this.last()[2] = calculatedVal;
            }
          }
        } else {
          if (!this.slices) {
            this.slices = [];
          }
          this.slices.push(addVal !== undefined && !(isStr(addVal) && !addVal.length) ? [from, to, this.opts.limitToBeAddedWhitespace ? collapseLeadingWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to]);
        }
      } else {
        if (!isInt(from, {
          includeZero: true
        })) {
          throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_09] \"from\" value, the first input argument, must be a natural number or zero! Currently it's of a type \"".concat(_typeof(from), "\" equal to: ").concat(JSON.stringify(from, null, 4)));
        } else {
          throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_10] \"to\" value, the second input argument, must be a natural number or zero! Currently it's of a type \"".concat(_typeof(to), "\" equal to: ").concat(JSON.stringify(to, null, 4)));
        }
      }
    }
  }, {
    key: "push",
    value: function push(originalFrom, originalTo, addVal) {
      for (var _len2 = arguments.length, etc = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        etc[_key2 - 3] = arguments[_key2];
      }
      this.add.apply(this, [originalFrom, originalTo, addVal].concat(etc));
    }
  }, {
    key: "current",
    value: function current() {
      var _this2 = this;
      if (this.slices != null) {
        this.slices = mergeRanges(this.slices);
        if (this.opts.limitToBeAddedWhitespace) {
          return this.slices.map(function (val) {
            if (existy(val[2])) {
              return [val[0], val[1], collapseLeadingWhitespace(val[2], _this2.opts.limitLinebreaksCount)];
            }
            return val;
          });
        }
        return this.slices;
      }
      return null;
    }
  }, {
    key: "wipe",
    value: function wipe() {
      this.slices = undefined;
    }
  }, {
    key: "last",
    value: function last() {
      if (this.slices !== undefined && Array.isArray(this.slices)) {
        return this.slices[this.slices.length - 1];
      }
      return null;
    }
  }]);
  return Slices;
}();

module.exports = Slices;

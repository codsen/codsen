/**
 * ranges-push
 * Manage the array of ranges referencing the index ranges within the string
 * Version: 3.6.15
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var collapseLeadingWhitespace = _interopDefault(require('string-collapse-leading-whitespace'));
var isNumStr = _interopDefault(require('is-natural-number-string'));
var mergeRanges = _interopDefault(require('ranges-merge'));
var clone = _interopDefault(require('lodash.clonedeep'));

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
var isNum = Number.isInteger;
function isStr(something) {
  return typeof something === "string";
}
function prepNumStr(str) {
  return isNumStr(str, {
    includeZero: true
  }) ? parseInt(str, 10) : str;
}
var Ranges =
function () {
  function Ranges(originalOpts) {
    _classCallCheck(this, Ranges);
    var defaults = {
      limitToBeAddedWhitespace: false,
      limitLinebreaksCount: 1,
      mergeType: 1
    };
    var opts = Object.assign({}, defaults, originalOpts);
    if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
      if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
        opts.mergeType = 1;
      } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
        opts.mergeType = 2;
      } else {
        throw new Error("ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.mergeType), "\", equal to ").concat(JSON.stringify(opts.mergeType, null, 4)));
      }
    }
    this.opts = opts;
  }
  _createClass(Ranges, [{
    key: "add",
    value: function add(originalFrom, originalTo, addVal) {
      var _this = this;
      for (var _len = arguments.length, etc = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        etc[_key - 3] = arguments[_key];
      }
      if (etc.length > 0) {
        throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ".concat(JSON.stringify(etc, null, 4)));
      }
      if (!existy(originalFrom) && !existy(originalTo)) {
        return;
      } else if (existy(originalFrom) && !existy(originalTo)) {
        if (isArr(originalFrom)) {
          if (originalFrom.length) {
            if (originalFrom.some(function (el) {
              return isArr(el);
            })) {
              originalFrom.forEach(function (thing) {
                if (isArr(thing)) {
                  _this.add.apply(_this, _toConsumableArray(thing));
                }
              });
              return;
            } else if (originalFrom.length > 1 && isNum(prepNumStr(originalFrom[0])) && isNum(prepNumStr(originalFrom[1]))) {
              this.add.apply(this, _toConsumableArray(originalFrom));
            }
          }
          return;
        }
        throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, \"from\" is set (".concat(JSON.stringify(originalFrom, null, 0), ") but second-one, \"to\" is not (").concat(JSON.stringify(originalTo, null, 0), ")"));
      } else if (!existy(originalFrom) && existy(originalTo)) {
        throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, \"to\" is set (".concat(JSON.stringify(originalTo, null, 0), ") but first-one, \"from\" is not (").concat(JSON.stringify(originalFrom, null, 0), ")"));
      }
      var from = isNumStr(originalFrom, {
        includeZero: true
      }) ? parseInt(originalFrom, 10) : originalFrom;
      var to = isNumStr(originalTo, {
        includeZero: true
      }) ? parseInt(originalTo, 10) : originalTo;
      if (isNum(addVal)) {
        addVal = String(addVal);
      }
      if (isNum(from) && isNum(to)) {
        if (existy(addVal) && !isStr(addVal) && !isNum(addVal)) {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ".concat(_typeof(addVal), ", equal to:\n").concat(JSON.stringify(addVal, null, 4)));
        }
        if (existy(this.slices) && isArr(this.last()) && from === this.last()[1]) {
          this.last()[1] = to;
          if (this.last()[2] === null || addVal === null) ;
          if (this.last()[2] !== null && existy(addVal)) {
            var calculatedVal = existy(this.last()[2]) && this.last()[2].length > 0 && (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1) ? this.last()[2] + addVal : addVal;
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
          var whatToPush = addVal !== undefined && !(isStr(addVal) && !addVal.length) ? [from, to, this.opts.limitToBeAddedWhitespace ? collapseLeadingWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to];
          this.slices.push(whatToPush);
        }
      } else {
        if (!(isNum(from) && from >= 0)) {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_09] \"from\" value, the first input argument, must be a natural number or zero! Currently it's of a type \"".concat(_typeof(from), "\" equal to: ").concat(JSON.stringify(from, null, 4)));
        } else {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_10] \"to\" value, the second input argument, must be a natural number or zero! Currently it's of a type \"".concat(_typeof(to), "\" equal to: ").concat(JSON.stringify(to, null, 4)));
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
        this.slices = mergeRanges(this.slices, {
          mergeType: this.opts.mergeType
        });
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
    key: "replace",
    value: function replace(givenRanges) {
      if (isArr(givenRanges) && givenRanges.length) {
        if (!(isArr(givenRanges[0]) && isNum(givenRanges[0][0]))) {
          throw new Error("ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ".concat(JSON.stringify(givenRanges[0], null, 4), " should be an array and its first element should be an integer, a string index."));
        } else {
          this.slices = clone(givenRanges);
        }
      } else {
        this.slices = undefined;
      }
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
  return Ranges;
}();

module.exports = Ranges;

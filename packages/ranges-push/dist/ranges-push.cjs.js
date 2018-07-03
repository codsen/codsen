'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isInt = _interopDefault(require('is-natural-number'));
var isNumStr = _interopDefault(require('is-natural-number-string'));
var ordinal = _interopDefault(require('ordinal-number-suffix'));
var mergeRanges = _interopDefault(require('ranges-merge'));
var checkTypes = _interopDefault(require('check-types-mini'));
var collapseLeadingWhitespace = _interopDefault(require('string-collapse-leading-whitespace'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function existy(x) {
  return x != null;
}
var isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function mandatory(i) {
  throw new Error("string-slices-array-push/Slices/add(): [THROW_ID_01] Missing " + ordinal(i) + " input parameter!");
}
function prepNumStr(str) {
  return isNumStr(str, { includeZero: true }) ? parseInt(str, 10) : str;
}
var Slices = function () {
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
      var originalFrom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory(1);
      var _this = this;
      var originalTo = arguments[1];
      var addVal = arguments[2];
      for (var _len = arguments.length, etc = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        etc[_key - 3] = arguments[_key];
      }
      if (etc.length > 0) {
        throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: " + JSON.stringify(etc, null, 4));
      }
      if (originalFrom === null && originalTo === undefined && addVal === undefined) {
        return;
      }
      var from = isNumStr(originalFrom, { includeZero: true }) ? parseInt(originalFrom, 10) : originalFrom;
      var to = isNumStr(originalTo, { includeZero: true }) ? parseInt(originalTo, 10) : originalTo;
      if (isArr(originalFrom) && !existy(originalTo)) {
        var culpritId = void 0;
        var culpritVal = void 0;
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
              if (isInt(prepNumStr(arr[0]), { includeZero: true })) {
                if (isInt(prepNumStr(arr[1]), { includeZero: true })) {
                  if (!existy(arr[2]) || isStr(arr[2])) {
                    _this.add.apply(_this, _toConsumableArray(arr));
                  } else {
                    throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_04] The " + ordinal(idx) + " ranges array's \"to add\" value is not string but " + _typeof(arr[2]) + "! It's equal to: " + arr[2] + ".");
                  }
                } else {
                  throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_05] The " + ordinal(idx) + " ranges array's ending range index, an element at its first index, is not a natural number! It's equal to: " + arr[1] + ".");
                }
              } else {
                throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_06] The " + ordinal(idx) + " ranges array's starting range index, an element at its zero'th index, is not a natural number! It's equal to: " + arr[0] + ".");
              }
            });
          } else {
            throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_07] first argument was given as array but it contains not only range arrays. For example, at index " + culpritId + " we have " + (typeof culpritVal === "undefined" ? "undefined" : _typeof(culpritVal)) + "-type value:\n" + JSON.stringify(culpritVal, null, 4) + ".");
          }
        }
      } else if (isInt(from, { includeZero: true }) && isInt(to, { includeZero: true })) {
        if (existy(addVal) && !isStr(addVal)) {
          throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but " + (typeof addVal === "undefined" ? "undefined" : _typeof(addVal)) + ", equal to:\n" + JSON.stringify(addVal, null, 4));
        }
        if (this.slices !== undefined && from === this.last()[1]) {
          this.last()[1] = to;
          if (this.last()[2] !== null && existy(addVal)) {
            var calculatedVal = existy(this.last()[2]) && this.last()[2].length > 0 ? this.last()[2] + addVal : addVal;
            if (this.opts.limitToBeAddedWhitespace) {
              calculatedVal = collapseLeadingWhitespace(calculatedVal, this.opts.limitLinebreaksCount);
            }
            this.last()[2] = calculatedVal;
          }
        } else {
          if (!this.slices) {
            this.slices = [];
          }
          this.slices.push(addVal !== undefined ? [from, to, this.opts.limitToBeAddedWhitespace ? collapseLeadingWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to]);
        }
      } else {
        if (!isInt(from, { includeZero: true })) {
          throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_09] \"from\" value, the first input argument, must be a natural number or zero! Currently it's of a type \"" + (typeof from === "undefined" ? "undefined" : _typeof(from)) + "\" equal to: " + JSON.stringify(from, null, 4));
        } else {
          throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_10] \"to\" value, the second input argument, must be a natural number or zero! Currently it's of a type \"" + (typeof to === "undefined" ? "undefined" : _typeof(to)) + "\" equal to: " + JSON.stringify(to, null, 4));
        }
      }
    }
  }, {
    key: "push",
    value: function push(originalFrom, originalTo, addVal) {
      for (var _len2 = arguments.length, etc = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
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

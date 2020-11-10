/**
 * ranges-push
 * Gather string index ranges
 * Version: 3.7.23
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-push/
 */

'use strict';

var collapseLeadingWhitespace = require('string-collapse-leading-whitespace');
var mergeRanges = require('ranges-merge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var collapseLeadingWhitespace__default = /*#__PURE__*/_interopDefaultLegacy(collapseLeadingWhitespace);
var mergeRanges__default = /*#__PURE__*/_interopDefaultLegacy(mergeRanges);

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function existy(x) {
  return x != null;
}
function isNum(something) {
  return Number.isInteger(something) && something >= 0;
}
function isStr(something) {
  return typeof something === "string";
}
function prepNumStr(str) {
  return /^\d*$/.test(str) ? parseInt(str, 10) : str;
}
var Ranges = function () {
  function Ranges(originalOpts) {
    _classCallCheck(this, Ranges);
    var defaults = {
      limitToBeAddedWhitespace: false,
      limitLinebreaksCount: 1,
      mergeType: 1
    };
    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
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
      }
      if (existy(originalFrom) && !existy(originalTo)) {
        if (Array.isArray(originalFrom)) {
          if (originalFrom.length) {
            if (originalFrom.some(function (el) {
              return Array.isArray(el);
            })) {
              originalFrom.forEach(function (thing) {
                if (Array.isArray(thing)) {
                  _this.add.apply(_this, _toConsumableArray(thing));
                }
              });
              return;
            }
            if (originalFrom.length > 1 && isNum(prepNumStr(originalFrom[0])) && isNum(prepNumStr(originalFrom[1]))) {
              this.add.apply(this, _toConsumableArray(originalFrom));
            }
          }
          return;
        }
        throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, \"from\" is set (".concat(JSON.stringify(originalFrom, null, 0), ") but second-one, \"to\" is not (").concat(JSON.stringify(originalTo, null, 0), ")"));
      } else if (!existy(originalFrom) && existy(originalTo)) {
        throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, \"to\" is set (".concat(JSON.stringify(originalTo, null, 0), ") but first-one, \"from\" is not (").concat(JSON.stringify(originalFrom, null, 0), ")"));
      }
      var from = /^\d*$/.test(originalFrom) ? parseInt(originalFrom, 10) : originalFrom;
      var to = /^\d*$/.test(originalTo) ? parseInt(originalTo, 10) : originalTo;
      if (isNum(addVal)) {
        addVal = String(addVal);
      }
      if (isNum(from) && isNum(to)) {
        if (existy(addVal) && !isStr(addVal) && !isNum(addVal)) {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ".concat(_typeof(addVal), ", equal to:\n").concat(JSON.stringify(addVal, null, 4)));
        }
        if (existy(this.ranges) && Array.isArray(this.last()) && from === this.last()[1]) {
          this.last()[1] = to;
          if (this.last()[2] === null || addVal === null) ;
          if (this.last()[2] !== null && existy(addVal)) {
            var calculatedVal = existy(this.last()[2]) && this.last()[2].length > 0 && (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1) ? this.last()[2] + addVal : addVal;
            if (this.opts.limitToBeAddedWhitespace) {
              calculatedVal = collapseLeadingWhitespace__default['default'](calculatedVal, this.opts.limitLinebreaksCount);
            }
            if (!(isStr(calculatedVal) && !calculatedVal.length)) {
              this.last()[2] = calculatedVal;
            }
          }
        } else {
          if (!this.ranges) {
            this.ranges = [];
          }
          var whatToPush = addVal !== undefined && !(isStr(addVal) && !addVal.length) ? [from, to, this.opts.limitToBeAddedWhitespace ? collapseLeadingWhitespace__default['default'](addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to];
          this.ranges.push(whatToPush);
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
      if (this.ranges != null) {
        this.ranges = mergeRanges__default['default'](this.ranges, {
          mergeType: this.opts.mergeType
        });
        if (this.ranges && this.opts.limitToBeAddedWhitespace) {
          return this.ranges.map(function (val) {
            if (existy(val[2])) {
              return [val[0], val[1], collapseLeadingWhitespace__default['default'](val[2], _this2.opts.limitLinebreaksCount)];
            }
            return val;
          });
        }
        return this.ranges;
      }
      return null;
    }
  }, {
    key: "wipe",
    value: function wipe() {
      this.ranges = undefined;
    }
  }, {
    key: "replace",
    value: function replace(givenRanges) {
      if (Array.isArray(givenRanges) && givenRanges.length) {
        if (!(Array.isArray(givenRanges[0]) && isNum(givenRanges[0][0]))) {
          throw new Error("ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ".concat(JSON.stringify(givenRanges[0], null, 4), " should be an array and its first element should be an integer, a string index."));
        } else {
          this.ranges = Array.from(givenRanges);
        }
      } else {
        this.ranges = undefined;
      }
    }
  }, {
    key: "last",
    value: function last() {
      if (this.ranges !== undefined && Array.isArray(this.ranges)) {
        return this.ranges[this.ranges.length - 1];
      }
      return null;
    }
  }]);
  return Ranges;
}();

module.exports = Ranges;

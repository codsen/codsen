/**
 * @name ranges-push
 * @fileoverview Gather string index ranges
 * @version 5.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-push/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _typeof = require('@babel/runtime/helpers/typeof');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var stringCollapseLeadingWhitespace = require('string-collapse-leading-whitespace');
var rangesMerge = require('ranges-merge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);

var version$1 = "5.1.0";

var version = version$1;
function existy(x) {
  return x != null;
}
function isNum(something) {
  return Number.isInteger(something) && something >= 0;
}
function isStr(something) {
  return typeof something === "string";
}
var defaults = {
  limitToBeAddedWhitespace: false,
  limitLinebreaksCount: 1,
  mergeType: 1
};
var Ranges = function () {
  function Ranges(originalOpts) {
    _classCallCheck__default['default'](this, Ranges);
    var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
    if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
      if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
        opts.mergeType = 1;
      } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
        opts.mergeType = 2;
      } else {
        throw new Error("ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"".concat(_typeof__default['default'](opts.mergeType), "\", equal to ").concat(JSON.stringify(opts.mergeType, null, 4)));
      }
    }
    this.opts = opts;
    this.ranges = [];
  }
  _createClass__default['default'](Ranges, [{
    key: "add",
    value: function add(originalFrom, originalTo, addVal) {
      var _this = this;
      if (originalFrom == null && originalTo == null) {
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
                  _this.add.apply(_this, _toConsumableArray__default['default'](thing));
                }
              });
              return;
            }
            if (originalFrom.length && isNum(+originalFrom[0]) && isNum(+originalFrom[1])) {
              this.add.apply(this, _toConsumableArray__default['default'](originalFrom));
            }
          }
          return;
        }
        throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, \"from\" is set (".concat(JSON.stringify(originalFrom, null, 0), ") but second-one, \"to\" is not (").concat(JSON.stringify(originalTo, null, 0), ")"));
      } else if (!existy(originalFrom) && existy(originalTo)) {
        throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, \"to\" is set (".concat(JSON.stringify(originalTo, null, 0), ") but first-one, \"from\" is not (").concat(JSON.stringify(originalFrom, null, 0), ")"));
      }
      var from = +originalFrom;
      var to = +originalTo;
      if (isNum(addVal)) {
        addVal = String(addVal);
      }
      if (isNum(from) && isNum(to)) {
        if (existy(addVal) && !isStr(addVal) && !isNum(addVal)) {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ".concat(_typeof__default['default'](addVal), ", equal to:\n").concat(JSON.stringify(addVal, null, 4)));
        }
        if (existy(this.ranges) && Array.isArray(this.last()) && from === this.last()[1]) {
          this.last()[1] = to;
          if (this.last()[2] === null || addVal === null) ;
          if (this.last()[2] !== null && existy(addVal)) {
            var calculatedVal = this.last()[2] && this.last()[2].length > 0 && (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1) ? this.last()[2] + addVal : addVal;
            if (this.opts.limitToBeAddedWhitespace) {
              calculatedVal = stringCollapseLeadingWhitespace.collWhitespace(calculatedVal, this.opts.limitLinebreaksCount);
            }
            if (!(isStr(calculatedVal) && !calculatedVal.length)) {
              this.last()[2] = calculatedVal;
            }
          }
        } else {
          if (!this.ranges) {
            this.ranges = [];
          }
          var whatToPush = addVal !== undefined && !(isStr(addVal) && !addVal.length) ? [from, to, addVal && this.opts.limitToBeAddedWhitespace ? stringCollapseLeadingWhitespace.collWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to];
          this.ranges.push(whatToPush);
        }
      } else {
        if (!(isNum(from) && from >= 0)) {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_09] \"from\" value, the first input argument, must be a natural number or zero! Currently it's of a type \"".concat(_typeof__default['default'](from), "\" equal to: ").concat(JSON.stringify(from, null, 4)));
        } else {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_10] \"to\" value, the second input argument, must be a natural number or zero! Currently it's of a type \"".concat(_typeof__default['default'](to), "\" equal to: ").concat(JSON.stringify(to, null, 4)));
        }
      }
    }
  }, {
    key: "push",
    value: function push(originalFrom, originalTo, addVal) {
      this.add(originalFrom, originalTo, addVal);
    }
  }, {
    key: "current",
    value: function current() {
      var _this2 = this;
      if (Array.isArray(this.ranges) && this.ranges.length) {
        this.ranges = rangesMerge.rMerge(this.ranges, {
          mergeType: this.opts.mergeType
        });
        if (this.ranges && this.opts.limitToBeAddedWhitespace) {
          return this.ranges.map(function (val) {
            if (existy(val[2])) {
              return [val[0], val[1], stringCollapseLeadingWhitespace.collWhitespace(val[2], _this2.opts.limitLinebreaksCount)];
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
      this.ranges = [];
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
        this.ranges = [];
      }
    }
  }, {
    key: "last",
    value: function last() {
      if (Array.isArray(this.ranges) && this.ranges.length) {
        return this.ranges[this.ranges.length - 1];
      }
      return null;
    }
  }]);
  return Ranges;
}();

exports.Ranges = Ranges;
exports.defaults = defaults;
exports.version = version;

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isInt = require('is-natural-number');
var isNumStr = require('is-natural-number-string');
var ordinal = require('ordinal-number-suffix');
var mergeRanges = require('ranges-merge');

function mandatory(i) {
  throw new Error('string-slices-array-push/Slices/add(): [THROW_ID_01] Missing ' + i + ordinal(i) + ' parameter');
}

// -----------------------------------------------------------------------------

var Slices = function () {
  function Slices() {
    _classCallCheck(this, Slices);
  }

  _createClass(Slices, [{
    key: 'add',

    //

    // A D D ()
    // ==================
    value: function add() {
      var originalFrom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory(1);
      var originalTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mandatory(2);
      var addVal = arguments[2];

      function existy(x) {
        return x != null;
      }
      // validation
      var from = isNumStr(originalFrom) ? parseInt(originalFrom, 10) : originalFrom;
      var to = isNumStr(originalTo) ? parseInt(originalTo, 10) : originalTo;
      if (!isInt(from, { includeZero: true })) {
        throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_02] "from" value, first input argument, must be a natural number or zero! Currently it\'s equal to: ' + JSON.stringify(from, null, 4));
      }
      if (!isInt(to, { includeZero: true })) {
        throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_03] "to" value, second input argument, must be a natural number! Currently it\'s equal to: ' + JSON.stringify(to, null, 4));
      }
      if (existy(addVal) && typeof addVal !== 'string') {
        throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_04] "addVal" value, third input argument, must be a string! Currently it\'s equal to: ' + JSON.stringify(addVal, null, 4));
      }

      for (var _len = arguments.length, etc = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        etc[_key - 3] = arguments[_key];
      }

      if (etc.length > 0) {
        throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_05] Please don\'t overload the add() method. From the 4th input argument onwards we see these redundant arguments: ' + JSON.stringify(etc, null, 4));
      }

      // action

      // does the incoming "from" value match the existing last element's "to" value?
      if (this.slices !== undefined && from === this.last()[1]) {
        // the incoming range is an exact extension of the last range, like
        // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
        this.last()[1] = to;
        if (existy(addVal)) {
          this.last()[2] = existy(this.last()[2]) && this.last()[2].length > 0 ? this.last()[2] + addVal : addVal;
        }
      } else {
        if (!this.slices) {
          this.slices = [];
        }
        this.slices.push(addVal ? [from, to, addVal] : [from, to]);
      }
    }

    // C U R R E N T ()
    // ==================

  }, {
    key: 'current',
    value: function current() {
      if (this.slices != null) {
        // != is intentional
        this.slices = mergeRanges(this.slices);
        return this.slices;
      }
      return null;
    }

    // W I P E ()
    // ==================

  }, {
    key: 'wipe',
    value: function wipe() {
      this.slices = undefined;
    }

    // L A S T ()
    // ==================

  }, {
    key: 'last',
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

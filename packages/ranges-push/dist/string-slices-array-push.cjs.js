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
  return typeof something === 'string';
}
function mandatory(i) {
  throw new Error('string-slices-array-push/Slices/add(): [THROW_ID_01] Missing ' + ordinal(i) + ' input parameter!');
}
function prepNumStr(str) {
  return isNumStr(str, { includeZero: true }) ? parseInt(str, 10) : str;
}

// -----------------------------------------------------------------------------

var Slices = function () {
  //

  // O P T I O N S
  // =============
  function Slices(originalOpts) {
    _classCallCheck(this, Slices);

    // validation first:
    var defaults = {
      limitToBeAddedWhitespace: false
    };
    var opts = Object.assign({}, defaults, originalOpts);
    checkTypes(opts, defaults, {
      msg: 'string-slices-array-push: [THROW_ID_02*]'
    });
    // so it's correct, let's get it in:
    this.opts = opts;
  }

  // A D D ()
  // ========


  _createClass(Slices, [{
    key: 'add',
    value: function add() {
      var originalFrom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mandatory(1);

      var _this = this;

      var originalTo = arguments[1];
      var addVal = arguments[2];

      for (var _len = arguments.length, etc = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        etc[_key - 3] = arguments[_key];
      }

      if (etc.length > 0) {
        throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_03] Please don\'t overload the add() method. From the 4th input argument onwards we see these redundant arguments: ' + JSON.stringify(etc, null, 4));
      }
      var from = isNumStr(originalFrom, { includeZero: true }) ? parseInt(originalFrom, 10) : originalFrom;
      var to = isNumStr(originalTo, { includeZero: true }) ? parseInt(originalTo, 10) : originalTo;

      // validation
      if (isArr(originalFrom) && !existy(originalTo)) {
        // This means output of slices array might be given.
        // But validate that first.
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
            // So it's array full of arrays.
            // Let's validate the contents of those arrays and process them right away.
            originalFrom.forEach(function (arr, idx) {
              if (isInt(prepNumStr(arr[0]), { includeZero: true })) {
                // good, continue
                if (isInt(prepNumStr(arr[1]), { includeZero: true })) {
                  // good, continue
                  if (!existy(arr[2]) || isStr(arr[2])) {
                    // push it into slices range
                    _this.add.apply(_this, _toConsumableArray(arr));
                  } else {
                    throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_04] The ' + ordinal(idx) + ' ranges array\'s "to add" value is not string but ' + _typeof(arr[2]) + '! It\'s equal to: ' + arr[2] + '.');
                  }
                } else {
                  throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_05] The ' + ordinal(idx) + ' ranges array\'s ending range index, an element at its first index, is not a natural number! It\'s equal to: ' + arr[1] + '.');
                }
              } else {
                throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_06] The ' + ordinal(idx) + ' ranges array\'s starting range index, an element at its zero\'th index, is not a natural number! It\'s equal to: ' + arr[0] + '.');
              }
            });
          } else {
            throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_07] first argument was given as array but it contains not only range arrays. For example, at index ' + culpritId + ' we have ' + (typeof culpritVal === 'undefined' ? 'undefined' : _typeof(culpritVal)) + '-type value:\n' + JSON.stringify(culpritVal, null, 4) + '.');
          }
        }
      } else if (isInt(from, { includeZero: true }) && isInt(to, { includeZero: true })) {
        // This means two indexes were given as arguments. Business as usual.
        if (existy(addVal) && !isStr(addVal)) {
          throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ' + (typeof addVal === 'undefined' ? 'undefined' : _typeof(addVal)) + ', equal to:\n' + JSON.stringify(addVal, null, 4));
        }
        // Does the incoming "from" value match the existing last element's "to" value?
        if (this.slices !== undefined && from === this.last()[1]) {
          // The incoming range is an exact extension of the last range, like
          // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
          this.last()[1] = to;
          // console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)
          if (this.last()[2] !== null && existy(addVal)) {
            var calculatedVal = existy(this.last()[2]) && this.last()[2].length > 0 ? this.last()[2] + addVal : addVal;
            if (this.opts.limitToBeAddedWhitespace) {
              calculatedVal = collapseLeadingWhitespace(calculatedVal);
            }
            this.last()[2] = calculatedVal;
          }
        } else {
          if (!this.slices) {
            this.slices = [];
          }
          this.slices.push(addVal !== undefined ? [from, to, this.opts.limitToBeAddedWhitespace ? collapseLeadingWhitespace(addVal) : addVal] : [from, to]);
        }
      } else {
        // Throw error
        throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_09] "from" value, first input argument, must be a natural number or zero! Currently it\'s equal to: ' + JSON.stringify(from, null, 4));
      }
    }

    // P U S H  ()  -  A L I A S   F O R   A D D ()
    // ============================================

  }, {
    key: 'push',
    value: function push(originalFrom, originalTo, addVal) {
      for (var _len2 = arguments.length, etc = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        etc[_key2 - 3] = arguments[_key2];
      }

      this.add.apply(this, [originalFrom, originalTo, addVal].concat(etc));
    }

    // C U R R E N T () - kindof a getter
    // ==================================

  }, {
    key: 'current',
    value: function current() {
      if (this.slices != null) {
        // != is intentional
        this.slices = mergeRanges(this.slices);
        if (this.opts.limitToBeAddedWhitespace) {
          return this.slices.map(function (val) {
            if (existy(val[2])) {
              return [val[0], val[1], collapseLeadingWhitespace(val[2])];
            }
            return val;
          });
        }
        return this.slices;
      }
      return null;
    }

    // W I P E ()
    // ==========

  }, {
    key: 'wipe',
    value: function wipe() {
      this.slices = undefined;
    }

    // L A S T ()
    // ==========

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

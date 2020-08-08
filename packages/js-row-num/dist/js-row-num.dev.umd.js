/**
 * js-row-num
 * Update all row numbers in all console.logs in JS code
 * Version: 2.7.21
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.jsRowNum = factory());
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

  /**
   * string-collapse-leading-whitespace
   * Collapse the leading and trailing whitespace of a string
   * Version: 2.0.21
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
   */
  var rawNbsp = "\xA0";

  function push(arr) {
    var leftSide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var charToPush = arguments.length > 2 ? arguments[2] : undefined;

    if (!charToPush.trim() && (!arr.length || charToPush === "\n" || charToPush === rawNbsp || (leftSide ? arr[arr.length - 1] : arr[0]) !== " ") && (!arr.length || (leftSide ? arr[arr.length - 1] : arr[0]) !== "\n" || charToPush === "\n" || charToPush === rawNbsp)) {
      if (leftSide) {
        if ((charToPush === "\n" || charToPush === rawNbsp) && arr.length && arr[arr.length - 1] === " ") {
          while (arr.length && arr[arr.length - 1] === " ") {
            arr.pop();
          }
        }

        arr.push(charToPush === rawNbsp || charToPush === "\n" ? charToPush : " ");
      } else {
        if ((charToPush === "\n" || charToPush === rawNbsp) && arr.length && arr[0] === " ") {
          while (arr.length && arr[0] === " ") {
            arr.shift();
          }
        }

        arr.unshift(charToPush === rawNbsp || charToPush === "\n" ? charToPush : " ");
      }
    }
  }

  function collapseLeadingWhitespace(str, originalLimitLinebreaksCount) {
    if (typeof str === "string" && str.length) {
      var windowsEol = false;

      if (str.includes("\r\n")) {
        windowsEol = true;
      }

      var limitLinebreaksCount;

      if (!originalLimitLinebreaksCount || typeof originalLimitLinebreaksCount !== "number") {
        limitLinebreaksCount = 1;
      } else {
        limitLinebreaksCount = originalLimitLinebreaksCount;
      }

      var limit;

      if (str.trim() === "") {
        var resArr = [];
        limit = limitLinebreaksCount;
        Array.from(str).forEach(function (char) {
          if (char !== "\n" || limit) {
            if (char === "\n") {
              limit -= 1;
            }

            push(resArr, true, char);
          }
        });

        while (resArr.length > 1 && resArr[resArr.length - 1] === " ") {
          resArr.pop();
        }

        return resArr.join("");
      }

      var startCharacter = [];
      limit = limitLinebreaksCount;

      if (str[0].trim() === "") {
        for (var i = 0, len = str.length; i < len; i++) {
          if (str[i].trim()) {
            break;
          } else if (str[i] !== "\n" || limit) {
            if (str[i] === "\n") {
              limit -= 1;
            }

            push(startCharacter, true, str[i]);
          }
        }
      }

      var endCharacter = [];
      limit = limitLinebreaksCount;

      if (str.slice(-1).trim() === "") {
        for (var _i = str.length; _i--;) {
          if (str[_i].trim()) {
            break;
          } else if (str[_i] !== "\n" || limit) {
            if (str[_i] === "\n") {
              limit -= 1;
            }

            push(endCharacter, false, str[_i]);
          }
        }
      }

      if (!windowsEol) {
        return startCharacter.join("") + str.trim() + endCharacter.join("");
      }

      return "".concat(startCharacter.join("")).concat(str.trim()).concat(endCharacter.join("")).replace(/\n/g, "\r\n");
    }

    return str;
  }

  /**
   * ranges-sort
   * Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
   * Version: 3.12.1
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
   */
  function rangesSort(arrOfRanges, originalOptions) {
    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return arrOfRanges;
    }

    var defaults = {
      strictlyTwoElementsInRangeArrays: false,
      progressFn: null
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions);

    var culpritsIndex;
    var culpritsLen;

    if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every(function (rangeArr, indx) {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") has not two but ").concat(culpritsLen, " elements!"));
    }

    if (!arrOfRanges.every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") does not consist of only natural numbers!"));
    }

    var maxPossibleIterations = arrOfRanges.length * arrOfRanges.length;
    var counter = 0;
    return Array.from(arrOfRanges).sort(function (range1, range2) {
      if (opts.progressFn) {
        counter += 1;
        opts.progressFn(Math.floor(counter * 100 / maxPossibleIterations));
      }

      if (range1[0] === range2[0]) {
        if (range1[1] < range2[1]) {
          return -1;
        }

        if (range1[1] > range2[1]) {
          return 1;
        }

        return 0;
      }

      if (range1[0] < range2[0]) {
        return -1;
      }

      return 1;
    });
  }

  function mergeRanges(arrOfRanges, originalOpts) {
    function isStr(something) {
      return typeof something === "string";
    }

    function isObj(something) {
      return something && _typeof(something) === "object" && !Array.isArray(something);
    }

    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return arrOfRanges;
    }

    var defaults = {
      mergeType: 1,
      progressFn: null,
      joinRangesThatTouchEdges: true
    };
    var opts;

    if (originalOpts) {
      if (isObj(originalOpts)) {
        opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

        if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
          opts.progressFn = null;
        } else if (opts.progressFn && typeof opts.progressFn !== "function") {
          throw new Error("ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: \"".concat(_typeof(opts.progressFn), "\", equal to ").concat(JSON.stringify(opts.progressFn, null, 4)));
        }

        if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
          if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
            opts.mergeType = 1;
          } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
            opts.mergeType = 2;
          } else {
            throw new Error("ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.mergeType), "\", equal to ").concat(JSON.stringify(opts.mergeType, null, 4)));
          }
        }

        if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
          throw new Error("ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.joinRangesThatTouchEdges), "\", equal to ").concat(JSON.stringify(opts.joinRangesThatTouchEdges, null, 4)));
        }
      } else {
        throw new Error("emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
      }
    } else {
      opts = _objectSpread2({}, defaults);
    }

    var filtered = arrOfRanges.map(function (subarr) {
      return _toConsumableArray(subarr);
    }).filter(function (rangeArr) {
      return rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1];
    });
    var sortedRanges;
    var lastPercentageDone;
    var percentageDone;

    if (opts.progressFn) {
      sortedRanges = rangesSort(filtered, {
        progressFn: function progressFn(percentage) {
          percentageDone = Math.floor(percentage / 5);

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;
            opts.progressFn(percentageDone);
          }
        }
      });
    } else {
      sortedRanges = rangesSort(filtered);
    }

    var len = sortedRanges.length - 1;

    for (var i = len; i > 0; i--) {
      if (opts.progressFn) {
        percentageDone = Math.floor((1 - i / len) * 78) + 21;

        if (percentageDone !== lastPercentageDone && percentageDone > lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      }

      if (sortedRanges[i][0] <= sortedRanges[i - 1][0] || !opts.joinRangesThatTouchEdges && sortedRanges[i][0] < sortedRanges[i - 1][1] || opts.joinRangesThatTouchEdges && sortedRanges[i][0] <= sortedRanges[i - 1][1]) {
        sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
        sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]);

        if (sortedRanges[i][2] !== undefined && (sortedRanges[i - 1][0] >= sortedRanges[i][0] || sortedRanges[i - 1][1] <= sortedRanges[i][1])) {
          if (sortedRanges[i - 1][2] !== null) {
            if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
              sortedRanges[i - 1][2] = null;
            } else if (sortedRanges[i - 1][2] !== undefined) {
              if (opts.mergeType === 2 && sortedRanges[i - 1][0] === sortedRanges[i][0]) {
                sortedRanges[i - 1][2] = sortedRanges[i][2];
              } else {
                sortedRanges[i - 1][2] += sortedRanges[i][2];
              }
            } else {
              sortedRanges[i - 1][2] = sortedRanges[i][2];
            }
          }
        }

        sortedRanges.splice(i, 1);
        i = sortedRanges.length;
      }
    }

    return sortedRanges;
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

  var Ranges = /*#__PURE__*/function () {
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

          if (existy(this.slices) && Array.isArray(this.last()) && from === this.last()[1]) {
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
        if (Array.isArray(givenRanges) && givenRanges.length) {
          if (!(Array.isArray(givenRanges[0]) && isNum(givenRanges[0][0]))) {
            throw new Error("ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ".concat(JSON.stringify(givenRanges[0], null, 4), " should be an array and its first element should be an integer, a string index."));
          } else {
            this.slices = Array.from(givenRanges);
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

  function existy$1(x) {
    return x != null;
  }

  function isStr$1(something) {
    return typeof something === "string";
  }

  function rangesApply(str, originalRangesArr, _progressFn) {
    var percentageDone = 0;
    var lastPercentageDone = 0;

    if (arguments.length === 0) {
      throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
    }

    if (!isStr$1(str)) {
      throw new TypeError("ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
    }

    if (originalRangesArr === null) {
      return str;
    }

    if (!Array.isArray(originalRangesArr)) {
      throw new TypeError("ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ".concat(_typeof(originalRangesArr), ", equal to: ").concat(JSON.stringify(originalRangesArr, null, 4)));
    }

    if (_progressFn && typeof _progressFn !== "function") {
      throw new TypeError("ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ".concat(_typeof(_progressFn), ", equal to: ").concat(JSON.stringify(_progressFn, null, 4)));
    }

    var rangesArr;

    if (Array.isArray(originalRangesArr) && (Number.isInteger(originalRangesArr[0]) && originalRangesArr[0] >= 0 || /^\d*$/.test(originalRangesArr[0])) && (Number.isInteger(originalRangesArr[1]) && originalRangesArr[1] >= 0 || /^\d*$/.test(originalRangesArr[1]))) {
      rangesArr = [Array.from(originalRangesArr)];
    } else {
      rangesArr = Array.from(originalRangesArr);
    }

    var len = rangesArr.length;
    var counter = 0;
    rangesArr.forEach(function (el, i) {
      if (_progressFn) {
        percentageDone = Math.floor(counter / len * 10);
        /* istanbul ignore else */

        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;

          _progressFn(percentageDone);
        }
      }

      if (!Array.isArray(el)) {
        throw new TypeError("ranges-apply: [THROW_ID_05] ranges array, second input arg., has ".concat(i, "th element not an array: ").concat(JSON.stringify(el, null, 4), ", which is ").concat(_typeof(el)));
      }

      if (!Number.isInteger(el[0]) || el[0] < 0) {
        if (/^\d*$/.test(el[0])) {
          rangesArr[i][0] = Number.parseInt(rangesArr[i][0], 10);
        } else {
          throw new TypeError("ranges-apply: [THROW_ID_06] ranges array, second input arg. has ".concat(i, "th element, array [").concat(el[0], ",").concat(el[1], "]. That array has first element not an integer, but ").concat(_typeof(el[0]), ", equal to: ").concat(JSON.stringify(el[0], null, 4), ". Computer doesn't like this."));
        }
      }

      if (!Number.isInteger(el[1])) {
        if (/^\d*$/.test(el[1])) {
          rangesArr[i][1] = Number.parseInt(rangesArr[i][1], 10);
        } else {
          throw new TypeError("ranges-apply: [THROW_ID_07] ranges array, second input arg. has ".concat(i, "th element, array [").concat(el[0], ",").concat(el[1], "]. That array has second element not an integer, but ").concat(_typeof(el[1]), ", equal to: ").concat(JSON.stringify(el[1], null, 4), ". Computer doesn't like this."));
        }
      }

      counter += 1;
    });
    var workingRanges = mergeRanges(rangesArr, {
      progressFn: function progressFn(perc) {
        if (_progressFn) {
          percentageDone = 10 + Math.floor(perc / 10);
          /* istanbul ignore else */

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;

            _progressFn(percentageDone);
          }
        }
      }
    });
    var len2 = workingRanges.length;

    if (len2 > 0) {
      var tails = str.slice(workingRanges[len2 - 1][1]);
      str = workingRanges.reduce(function (acc, val, i, arr) {
        if (_progressFn) {
          percentageDone = 20 + Math.floor(i / len2 * 80);
          /* istanbul ignore else */

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;

            _progressFn(percentageDone);
          }
        }

        var beginning = i === 0 ? 0 : arr[i - 1][1];
        var ending = arr[i][0];
        return acc + str.slice(beginning, ending) + (existy$1(arr[i][2]) ? arr[i][2] : "");
      }, "");
      str += tails;
    }

    return str;
  }

  var BACKSLASH = "\\";

  function fixRowNums(str, originalOpts) {
    if (typeof str !== "string" || !str.length) {
      return str;
    }

    function isDigit(something) {
      return /[0-9]/.test(something);
    }

    function isAZ(something) {
      return /[A-Za-z]/.test(something);
    }

    function isObj(something) {
      return something && _typeof(something) === "object" && !Array.isArray(something);
    }

    var defaults = {
      padStart: 3,
      overrideRowNum: null,
      returnRangesOnly: false,
      triggerKeywords: ["console.log"],
      extractedLogContentsWereGiven: false
    };
    var opts = Object.assign(defaults, originalOpts);

    if (!opts.padStart || typeof opts.padStart !== "number" || typeof opts.padStart === "number" && opts.padStart < 0) {
      opts.padStart = 0;
    }

    var finalIndexesToDelete = new Ranges();
    var i;
    var len = str.length;
    var quotes = null;
    var consoleStartsAt = null;
    var bracketOpensAt = null;
    var currentRow = 1;
    var wasLetterDetected = false;
    var digitStartsAt = null;

    if (opts.padStart && len > 45000) {
      opts.padStart = 4;
    }

    for (i = 0; i < len; i++) {
      // count lines:
      if (opts.overrideRowNum === null && (str[i] === "\n" || str[i] === "\r" && str[i + 1] !== "\n")) {
        currentRow += 1;
      } // catch closing quotes console.log( ' -----> ' <------)


      if (!opts.extractedLogContentsWereGiven && quotes !== null && quotes.start < i && quotes.type === str[i]) {
        quotes = null;
        consoleStartsAt = null;
        bracketOpensAt = null;
        digitStartsAt = null;
        wasLetterDetected = false;
      } // catch opening quotes console.log( -----> ' <------ ')


      if (quotes === null && (opts.extractedLogContentsWereGiven || consoleStartsAt && consoleStartsAt < i && bracketOpensAt && bracketOpensAt < i) && str[i].trim()) {
        if (str[i] === '"' || str[i] === "'" || str[i] === "`") {
          quotes = {};
          quotes.start = i;
          quotes.type = str[i];
          wasLetterDetected = false;
        } else if (opts.extractedLogContentsWereGiven && digitStartsAt === null) {
          if (isDigit(str[i])) {
            digitStartsAt = i;
          } else {
            break;
          }
        } else if (str[i].trim() && str[i] !== "/" && !opts.extractedLogContentsWereGiven) {
          // wipe
          consoleStartsAt = null;
          bracketOpensAt = null;
          digitStartsAt = null;
        }
      } // catch the first digit within console.log:


      if (quotes && Number.isInteger(quotes.start) && quotes.start < i && !wasLetterDetected && digitStartsAt === null && isDigit(str[i])) {
        digitStartsAt = i;
      } // catch the ending of the digits within console.log:


      if (Number.isInteger(digitStartsAt) && (!isDigit(str[i]) || !str[i + 1]) && (i > digitStartsAt || !str[i + 1])) {
        // replace the digits:
        if (!opts.padStart) {
          if (opts.overrideRowNum != null) ;
        } // PS. finalIndexesToDelete is a Ranges class so we can push
        // two/three arguments and it will understand it's (range) array...


        finalIndexesToDelete.push(digitStartsAt, !isDigit(str[i]) ? i : i + 1, opts.padStart ? String(opts.overrideRowNum != null ? opts.overrideRowNum : currentRow).padStart(opts.padStart, "0") : "".concat(opts.overrideRowNum != null ? opts.overrideRowNum : currentRow)); // then, reset:

        digitStartsAt = null; // set wasLetterDetected as a decoy to prevent further digit lumps from being edited:

        wasLetterDetected = true;
      } // catch first letter within console.log:


      if (quotes && Number.isInteger(quotes.start) && quotes.start < i && !wasLetterDetected && isAZ(str[i]) && !(str[i] === "n" && str[i - 1] === BACKSLASH)) {
        // Skip one of more of either patterns:
        // \u001b[${33}m
        // ${`
        // `\u001b[33m       \u001b[39m`
        // \u001B[4m        \u001B[0m
        // \u001B[4m   \u001B[0m
        // check for pattern \u001B[ + optional ${ + any amount of digits + optional } + m

        /* istanbul ignore if */
        if (
        /* istanbul ignore next */
        str[i - 1] === BACKSLASH && str[i] === "u" && str[i + 1] === "0" && str[i + 2] === "0" && str[i + 3] === "1" && (str[i + 4] === "b" || str[i + 5] === "B") && str[i + 5] === "[") {
          // at this moment, we have stuck here:
          //
          // console.log(`\u001b[${33}m${`291 zzz`}\u001b[${39}m`)
          //                    ^
          //           here, at this bracket
          // now, the ANSI colour digit code might be wrapped with ${} and also,
          // it can be of an indeterminate width: normally there is either one or
          // two digits.
          // We need to find where digits start.
          // There are two possibilities: either here, or after string literal ${}
          // wrapper:
          // base assumption, we're here:
          // console.log(`\u001b[33m 123 zzz \u001b[${39}m`)
          //                     ^
          //                   here
          var startMarchingForwFrom = void 0;

          if (isDigit(str[i + 6])) {
            startMarchingForwFrom = i + 6;
          } else if (str[i + 6] === "$" && str[i + 7] === "{" && isDigit(str[i + 8])) {
            startMarchingForwFrom = i + 8;
          } // find out where does this (possibly a sequence) of number(s) end:


          var numbersSequenceEndsAt = void 0;

          if (startMarchingForwFrom) {
            for (var y = startMarchingForwFrom; y < len; y++) {
              if (!isDigit(str[y])) {
                numbersSequenceEndsAt = y;
                break;
              }
            }
          } // answer: at "numbersSequenceEndsAt".
          // We're at the next character where digits end. That is:
          // console.log(`\u001b[33m 123 zzz \u001b[${39}m`)
          //                       ^
          //                     here, OR
          // console.log(`\u001b[${33}m 123 zzz \u001b[${39}m`)
          //                         ^
          //                       here


          var ansiSequencesLetterMAt = void 0;

          if (str[numbersSequenceEndsAt] === "m") {
            // if number follows "m", this is it:
            ansiSequencesLetterMAt = numbersSequenceEndsAt;
          } else if (str[numbersSequenceEndsAt] === "}" && str[numbersSequenceEndsAt + 1] === "m") {
            ansiSequencesLetterMAt = numbersSequenceEndsAt + 1;
          }
          /* istanbul ignore else */


          if (!ansiSequencesLetterMAt) {
            // if ANSI closing "m" hasn't been detected yet, bail:
            wasLetterDetected = true;
            continue;
          }
          /* istanbul ignore else */


          if (str[ansiSequencesLetterMAt + 1] === "$" && str[ansiSequencesLetterMAt + 2] === "{" && str[ansiSequencesLetterMAt + 3] === "`") {
            i = ansiSequencesLetterMAt + 3;
            continue;
          }
        }

        wasLetterDetected = true;
      } // catch the opening bracket of console.log ---->(<----- )


      if (!bracketOpensAt && str[i].trim() && consoleStartsAt && consoleStartsAt <= i) {
        if (str[i] === "(") {
          bracketOpensAt = i;
        } else {
          // wipe
          consoleStartsAt = null;
          digitStartsAt = null;
        }
      } // catch the trigger keywords


      if (isObj(opts) && opts.triggerKeywords && Array.isArray(opts.triggerKeywords)) {
        // check does any of the trigger keywords match
        var caughtKeyword = void 0;

        for (var _y = 0, len2 = opts.triggerKeywords.length; _y < len2; _y++) {
          /* istanbul ignore else */
          if (str.startsWith(opts.triggerKeywords[_y], i)) {
            caughtKeyword = opts.triggerKeywords[_y];
            break;
          }
        } // if any of trigger keywords starts here

        /* istanbul ignore else */


        if (caughtKeyword) {
          consoleStartsAt = i + caughtKeyword.length; // offset the index so we don't traverse twice what was traversed already:

          i = i + caughtKeyword.length - 1;
          continue;
        }
      }
    } // wipe


    quotes = null;
    consoleStartsAt = null;
    bracketOpensAt = null;
    currentRow = 1;
    wasLetterDetected = undefined;
    digitStartsAt = null;
    currentRow = 1;

    if (opts.returnRangesOnly) {
      return finalIndexesToDelete.current();
    }

    if (finalIndexesToDelete.current()) {
      return rangesApply(str, finalIndexesToDelete.current());
    }

    return str;
  }

  return fixRowNums;

})));

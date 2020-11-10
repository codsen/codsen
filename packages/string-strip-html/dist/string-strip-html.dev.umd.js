/**
 * string-strip-html
 * Strips HTML tags from strings. No parser, accepts mixed sources.
 * Version: 6.3.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-strip-html/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.stringStripHtml = factory());
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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
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

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * ranges-sort
   * Sort string index ranges
   * Version: 3.13.4
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://codsen.com/os/ranges-sort/
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

    if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.filter(function (range) {
      return range;
    }).every(function (rangeArr, indx) {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") has not two but ").concat(culpritsLen, " elements!"));
    }

    if (!arrOfRanges.filter(function (range) {
      return range;
    }).every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") does not consist of only natural numbers!"));
    }

    var maxPossibleIterations = Math.pow(arrOfRanges.filter(function (range) {
      return range;
    }).length, 2);
    var counter = 0;
    return Array.from(arrOfRanges).filter(function (range) {
      return range;
    }).sort(function (range1, range2) {
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
      return null;
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

    var filtered = arrOfRanges.filter(function (range) {
      return range;
    }).map(function (subarr) {
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

    return sortedRanges.length ? sortedRanges : null;
  }

  function existy(x) {
    return x != null;
  }

  function isStr(something) {
    return typeof something === "string";
  }

  function rangesApply(str, originalRangesArr, _progressFn) {
    var percentageDone = 0;
    var lastPercentageDone = 0;

    if (arguments.length === 0) {
      throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
    }

    if (!isStr(str)) {
      throw new TypeError("ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
    }

    if (originalRangesArr && !Array.isArray(originalRangesArr)) {
      throw new TypeError("ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ".concat(_typeof(originalRangesArr), ", equal to: ").concat(JSON.stringify(originalRangesArr, null, 4)));
    }

    if (_progressFn && typeof _progressFn !== "function") {
      throw new TypeError("ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ".concat(_typeof(_progressFn), ", equal to: ").concat(JSON.stringify(_progressFn, null, 4)));
    }

    if (!originalRangesArr || !originalRangesArr.filter(function (range) {
      return range;
    }).length) {
      return str;
    }

    var rangesArr;

    if (Array.isArray(originalRangesArr) && (Number.isInteger(originalRangesArr[0]) && originalRangesArr[0] >= 0 || /^\d*$/.test(originalRangesArr[0])) && (Number.isInteger(originalRangesArr[1]) && originalRangesArr[1] >= 0 || /^\d*$/.test(originalRangesArr[1]))) {
      rangesArr = [Array.from(originalRangesArr)];
    } else {
      rangesArr = Array.from(originalRangesArr);
    }

    var len = rangesArr.length;
    var counter = 0;
    rangesArr.filter(function (range) {
      return range;
    }).forEach(function (el, i) {
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

    if (!workingRanges) {
      return str;
    }

    var len2 = workingRanges.length;
    /* istanbul ignore else */

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
        return acc + str.slice(beginning, ending) + (existy(arr[i][2]) ? arr[i][2] : "");
      }, "");
      str += tails;
    }

    return str;
  }

  /**
   * string-collapse-leading-whitespace
   * Collapse the leading and trailing whitespace of a string
   * Version: 3.0.3
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://codsen.com/os/string-collapse-leading-whitespace/
   */
  var rawNbsp = "\xA0";

  function collapseLeadingWhitespace(str) {
    var originallineBreakLimit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    function reverse(s) {
      return Array.from(s).reverse().join("");
    }

    function prep(whitespaceChunk, limit, trailing) {
      var firstBreakChar = trailing ? "\n" : "\r";
      var secondBreakChar = trailing ? "\r" : "\n";

      if (!whitespaceChunk) {
        return whitespaceChunk;
      }

      var crlfCount = 0;
      var res = "";

      for (var i = 0, len = whitespaceChunk.length; i < len; i++) {
        if (whitespaceChunk[i] === firstBreakChar || whitespaceChunk[i] === secondBreakChar && whitespaceChunk[i - 1] !== firstBreakChar) {
          crlfCount++;
        }

        if ("\r\n".includes(whitespaceChunk[i]) || whitespaceChunk[i] === rawNbsp) {
          if (whitespaceChunk[i] === rawNbsp) {
            res += whitespaceChunk[i];
          } else if (whitespaceChunk[i] === firstBreakChar) {
            if (crlfCount <= limit) {
              res += whitespaceChunk[i];

              if (whitespaceChunk[i + 1] === secondBreakChar) {
                res += whitespaceChunk[i + 1];
                i++;
              }
            }
          } else if (whitespaceChunk[i] === secondBreakChar && (!whitespaceChunk[i - 1] || whitespaceChunk[i - 1] !== firstBreakChar) && crlfCount <= limit) {
            res += whitespaceChunk[i];
          }
        } else {
          if (!whitespaceChunk[i + 1] && !crlfCount) {
            res += " ";
          }
        }
      }

      return res;
    }

    if (typeof str === "string" && str.length) {
      var lineBreakLimit = 1;

      if (typeof +originallineBreakLimit === "number" && Number.isInteger(+originallineBreakLimit) && +originallineBreakLimit >= 0) {
        lineBreakLimit = +originallineBreakLimit;
      }

      var frontPart = "";
      var endPart = "";

      if (!str.trim()) {
        frontPart = str;
      } else if (!str[0].trim()) {
        for (var i = 0, len = str.length; i < len; i++) {
          if (str[i].trim()) {
            frontPart = str.slice(0, i);
            break;
          }
        }
      }

      if (str.trim() && (str.slice(-1).trim() === "" || str.slice(-1) === rawNbsp)) {
        for (var _i = str.length; _i--;) {
          if (str[_i].trim()) {
            endPart = str.slice(_i + 1);
            break;
          }
        }
      }

      return "".concat(prep(frontPart, lineBreakLimit, false)).concat(str.trim()).concat(reverse(prep(reverse(endPart), lineBreakLimit, true)));
    }

    return str;
  }

  function existy$1(x) {
    return x != null;
  }

  function isNum(something) {
    return Number.isInteger(something) && something >= 0;
  }

  function isStr$1(something) {
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
        if (isStr$1(opts.mergeType) && opts.mergeType.trim() === "1") {
          opts.mergeType = 1;
        } else if (isStr$1(opts.mergeType) && opts.mergeType.trim() === "2") {
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

        if (!existy$1(originalFrom) && !existy$1(originalTo)) {
          return;
        }

        if (existy$1(originalFrom) && !existy$1(originalTo)) {
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
        } else if (!existy$1(originalFrom) && existy$1(originalTo)) {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, \"to\" is set (".concat(JSON.stringify(originalTo, null, 0), ") but first-one, \"from\" is not (").concat(JSON.stringify(originalFrom, null, 0), ")"));
        }

        var from = /^\d*$/.test(originalFrom) ? parseInt(originalFrom, 10) : originalFrom;
        var to = /^\d*$/.test(originalTo) ? parseInt(originalTo, 10) : originalTo;

        if (isNum(addVal)) {
          addVal = String(addVal);
        }

        if (isNum(from) && isNum(to)) {
          if (existy$1(addVal) && !isStr$1(addVal) && !isNum(addVal)) {
            throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ".concat(_typeof(addVal), ", equal to:\n").concat(JSON.stringify(addVal, null, 4)));
          }

          if (existy$1(this.ranges) && Array.isArray(this.last()) && from === this.last()[1]) {
            this.last()[1] = to;
            if (this.last()[2] === null || addVal === null) ;

            if (this.last()[2] !== null && existy$1(addVal)) {
              var calculatedVal = existy$1(this.last()[2]) && this.last()[2].length > 0 && (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1) ? this.last()[2] + addVal : addVal;

              if (this.opts.limitToBeAddedWhitespace) {
                calculatedVal = collapseLeadingWhitespace(calculatedVal, this.opts.limitLinebreaksCount);
              }

              if (!(isStr$1(calculatedVal) && !calculatedVal.length)) {
                this.last()[2] = calculatedVal;
              }
            }
          } else {
            if (!this.ranges) {
              this.ranges = [];
            }

            var whatToPush = addVal !== undefined && !(isStr$1(addVal) && !addVal.length) ? [from, to, this.opts.limitToBeAddedWhitespace ? collapseLeadingWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to];
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
          this.ranges = mergeRanges(this.ranges, {
            mergeType: this.opts.mergeType
          });

          if (this.ranges && this.opts.limitToBeAddedWhitespace) {
            return this.ranges.map(function (val) {
              if (existy$1(val[2])) {
                return [val[0], val[1], collapseLeadingWhitespace(val[2], _this2.opts.limitLinebreaksCount)];
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
    return !!value && _typeof(value) == 'object';
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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  		path: basedir,
  		exports: {},
  		require: function (path, base) {
  			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
  		}
  	}, fn(module, module.exports), module.exports;
  }

  function getAugmentedNamespace(n) {
  	if (n.__esModule) return n;
  	var a = Object.defineProperty({}, '__esModule', {value: true});
  	Object.keys(n).forEach(function (k) {
  		var d = Object.getOwnPropertyDescriptor(n, k);
  		Object.defineProperty(a, k, d.get ? d : {
  			enumerable: true,
  			get: function () {
  				return n[k];
  			}
  		});
  	});
  	return a;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as references for various `Number` constants. */

  var INFINITY = 1 / 0;
  /** `Object#toString` result references. */

  var symbolTag = '[object Symbol]';
  /** Used to match leading and trailing whitespace. */

  var reTrim = /^\s+|\s+$/g;
  /** Used to compose unicode character classes. */

  var rsAstralRange = "\\ud800-\\udfff",
      rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23",
      rsComboSymbolsRange = "\\u20d0-\\u20f0",
      rsVarRange = "\\ufe0e\\ufe0f";
  /** Used to compose unicode capture groups. */

  var rsAstral = '[' + rsAstralRange + ']',
      rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
      rsFitz = "\\ud83c[\\udffb-\\udfff]",
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}",
      rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]",
      rsZWJ = "\\u200d";
  /** Used to compose unicode regexes. */

  var reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */

  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */

  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');
  /** Detect free variable `global` from Node.js. */

  var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `self`. */

  var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();
  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */

  function asciiToArray(string) {
    return string.split('');
  }
  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return baseFindIndex(array, baseIsNaN, fromIndex);
    }

    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */


  function baseIsNaN(value) {
    return value !== value;
  }
  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */


  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

    return index;
  }
  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */


  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

    return index;
  }
  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */


  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }
  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function stringToArray(string) {
    return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
  }
  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }
  /** Used for built-in method references. */


  var objectProto$1 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString$1 = objectProto$1.toString;
  /** Built-in value references. */

  var _Symbol = root.Symbol;
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;
  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */

  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }

    end = end > length ? length : end;

    if (end < 0) {
      end += length;
    }

    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);

    while (++index < length) {
      result[index] = array[index + start];
    }

    return result;
  }
  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */


  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }

    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }
  /**
   * Casts `array` to a slice if it's needed.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {number} start The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the cast slice.
   */


  function castSlice(array, start, end) {
    var length = array.length;
    end = end === undefined ? length : end;
    return !start && end >= length ? array : baseSlice(array, start, end);
  }
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


  function isObjectLike$1(value) {
    return !!value && _typeof(value) == 'object';
  }
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */


  function isSymbol(value) {
    return _typeof(value) == 'symbol' || isObjectLike$1(value) && objectToString$1.call(value) == symbolTag;
  }
  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */


  function toString(value) {
    return value == null ? '' : baseToString(value);
  }
  /**
   * Removes leading and trailing whitespace or specified characters from `string`.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to trim.
   * @param {string} [chars=whitespace] The characters to trim.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {string} Returns the trimmed string.
   * @example
   *
   * _.trim('  abc  ');
   * // => 'abc'
   *
   * _.trim('-_-abc-_-', '_-');
   * // => 'abc'
   *
   * _.map(['  foo  ', '  bar  '], _.trim);
   * // => ['foo', 'bar']
   */


  function trim(string, chars, guard) {
    string = toString(string);

    if (string && (guard || chars === undefined)) {
      return string.replace(reTrim, '');
    }

    if (!string || !(chars = baseToString(chars))) {
      return string;
    }

    var strSymbols = stringToArray(string),
        chrSymbols = stringToArray(chars),
        start = charsStartIndex(strSymbols, chrSymbols),
        end = charsEndIndex(strSymbols, chrSymbols) + 1;
    return castSlice(strSymbols, start, end).join('');
  }

  var lodash_trim = trim;

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as the size to enable large array optimizations. */

  var LARGE_ARRAY_SIZE = 200;
  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  /** Used as references for various `Number` constants. */

  var MAX_SAFE_INTEGER = 9007199254740991;
  /** `Object#toString` result references. */

  var funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]';
  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */

  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  /** Used to detect host constructors (Safari). */

  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  /** Detect free variable `global` from Node.js. */

  var freeGlobal$1 = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `self`. */

  var freeSelf$1 = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();
  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */

  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);

      case 1:
        return func.call(thisArg, args[0]);

      case 2:
        return func.call(thisArg, args[0], args[1]);

      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }

    return func.apply(thisArg, args);
  }
  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */


  function arrayIncludes(array, value) {
    var length = array ? array.length : 0;
    return !!length && baseIndexOf$1(array, value, 0) > -1;
  }
  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */


  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }

    return false;
  }
  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */


  function arrayMap(array, iteratee) {
    var index = -1,
        length = array ? array.length : 0,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }

    return result;
  }
  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseFindIndex$1(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseIndexOf$1(array, value, fromIndex) {
    if (value !== value) {
      return baseFindIndex$1(array, baseIsNaN$1, fromIndex);
    }

    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */


  function baseIsNaN$1(value) {
    return value !== value;
  }
  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */


  function baseUnary(func) {
    return function (value) {
      return func(value);
    };
  }
  /**
   * Checks if a cache value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function cacheHas(cache, key) {
    return cache.has(key);
  }
  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */


  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }
  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */


  function isHostObject$1(value) {
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
  /** Used for built-in method references. */


  var arrayProto = Array.prototype,
      funcProto$1 = Function.prototype,
      objectProto$2 = Object.prototype;
  /** Used to detect overreaching core-js shims. */

  var coreJsData = root$1['__core-js_shared__'];
  /** Used to detect methods masquerading as native. */

  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();
  /** Used to resolve the decompiled source of functions. */


  var funcToString$1 = funcProto$1.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString$2 = objectProto$2.toString;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  /** Built-in value references. */

  var splice = arrayProto.splice;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeMax = Math.max;
  /* Built-in method references that are verified to be native. */

  var Map = getNative(root$1, 'Map'),
      nativeCreate = getNative(Object, 'create');
  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */


  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }
  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }
  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function hashGet(key) {
    var data = this.__data__;

    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }

    return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
  }
  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty$1.call(data, key);
  }
  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */


  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
  } // Add methods to `Hash`.


  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function ListCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */


  function listCacheClear() {
    this.__data__ = [];
  }
  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }

    var lastIndex = data.length - 1;

    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }

    return true;
  }
  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  }
  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */


  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }

    return this;
  } // Add methods to `ListCache`.


  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function MapCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */


  function mapCacheClear() {
    this.__data__ = {
      'hash': new Hash(),
      'map': new (Map || ListCache)(),
      'string': new Hash()
    };
  }
  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function mapCacheDelete(key) {
    return getMapData(this, key)['delete'](key);
  }
  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */


  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  } // Add methods to `MapCache`.


  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */

  function SetCache(values) {
    var index = -1,
        length = values ? values.length : 0;
    this.__data__ = new MapCache();

    while (++index < length) {
      this.add(values[index]);
    }
  }
  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */


  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);

    return this;
  }
  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */


  function setCacheHas(value) {
    return this.__data__.has(value);
  } // Add methods to `SetCache`.


  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */

  function assocIndexOf(array, key) {
    var length = array.length;

    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }

    return -1;
  }
  /**
   * The base implementation of methods like `_.difference` without support
   * for excluding multiple arrays or iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Array} values The values to exclude.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of filtered values.
   */


  function baseDifference(array, values, iteratee, comparator) {
    var index = -1,
        includes = arrayIncludes,
        isCommon = true,
        length = array.length,
        result = [],
        valuesLength = values.length;

    if (!length) {
      return result;
    }

    if (iteratee) {
      values = arrayMap(values, baseUnary(iteratee));
    }

    if (comparator) {
      includes = arrayIncludesWith;
      isCommon = false;
    } else if (values.length >= LARGE_ARRAY_SIZE) {
      includes = cacheHas;
      isCommon = false;
      values = new SetCache(values);
    }

    outer: while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value) : value;
      value = comparator || value !== 0 ? value : 0;

      if (isCommon && computed === computed) {
        var valuesIndex = valuesLength;

        while (valuesIndex--) {
          if (values[valuesIndex] === computed) {
            continue outer;
          }
        }

        result.push(value);
      } else if (!includes(values, computed, comparator)) {
        result.push(value);
      }
    }

    return result;
  }
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */


  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }

    var pattern = isFunction(value) || isHostObject$1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */


  function baseRest(func, start) {
    start = nativeMax(start === undefined ? func.length - 1 : start, 0);
    return function () {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }

      index = -1;
      var otherArgs = Array(start + 1);

      while (++index < start) {
        otherArgs[index] = args[index];
      }

      otherArgs[start] = array;
      return apply(func, this, otherArgs);
    };
  }
  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */


  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }
  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */


  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }
  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */


  function isKeyable(value) {
    var type = _typeof(value);

    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
  }
  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */


  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */


  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }
  /**
   * Creates an array excluding all given values using
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * **Note:** Unlike `_.pull`, this method returns a new array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {...*} [values] The values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   * @see _.difference, _.xor
   * @example
   *
   * _.without([2, 1, 2, 3], 1, 2);
   * // => [3]
   */


  var without = baseRest(function (array, values) {
    return isArrayLikeObject(array) ? baseDifference(array, values) : [];
  });
  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */

  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */


  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */


  function isArrayLikeObject(value) {
    return isObjectLike$2(value) && isArrayLike(value);
  }
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */


  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString$2.call(value) : '';
    return tag == funcTag || tag == genTag;
  }
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */


  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */


  function isObject(value) {
    var type = _typeof(value);

    return !!value && (type == 'object' || type == 'function');
  }
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


  function isObjectLike$2(value) {
    return !!value && _typeof(value) == 'object';
  }

  var lodash_without = without;

  /*! https://mths.be/punycode v1.4.1 by @mathias */

  /** Highest positive signed 32-bit float value */
  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

  /** Bootstring parameters */

  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80

  var delimiter = '-'; // '\x2D'

  /** Regular expressions */

  var regexPunycode = /^xn--/;
  var regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars

  var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

  /** Error messages */

  var errors = {
    'overflow': 'Overflow: input needs wider integers to process',
    'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
    'invalid-input': 'Invalid input'
  };
  /** Convenience shortcuts */

  var baseMinusTMin = base - tMin;
  var floor = Math.floor;
  var stringFromCharCode = String.fromCharCode;
  /*--------------------------------------------------------------------------*/

  /**
   * A generic error utility function.
   * @private
   * @param {String} type The error type.
   * @returns {Error} Throws a `RangeError` with the applicable error message.
   */

  function error(type) {
    throw new RangeError(errors[type]);
  }
  /**
   * A generic `Array#map` utility function.
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function that gets called for every array
   * item.
   * @returns {Array} A new array of values returned by the callback function.
   */


  function map(array, fn) {
    var length = array.length;
    var result = [];

    while (length--) {
      result[length] = fn(array[length]);
    }

    return result;
  }
  /**
   * A simple `Array#map`-like wrapper to work with domain name strings or email
   * addresses.
   * @private
   * @param {String} domain The domain name or email address.
   * @param {Function} callback The function that gets called for every
   * character.
   * @returns {Array} A new string of characters returned by the callback
   * function.
   */


  function mapDomain(string, fn) {
    var parts = string.split('@');
    var result = '';

    if (parts.length > 1) {
      // In email addresses, only the domain name should be punycoded. Leave
      // the local part (i.e. everything up to `@`) intact.
      result = parts[0] + '@';
      string = parts[1];
    } // Avoid `split(regex)` for IE8 compatibility. See #17.


    string = string.replace(regexSeparators, '\x2E');
    var labels = string.split('.');
    var encoded = map(labels, fn).join('.');
    return result + encoded;
  }
  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   * @see `punycode.ucs2.encode`
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode.ucs2
   * @name decode
   * @param {String} string The Unicode input string (UCS-2).
   * @returns {Array} The new array of code points.
   */


  function ucs2decode(string) {
    var output = [],
        counter = 0,
        length = string.length,
        value,
        extra;

    while (counter < length) {
      value = string.charCodeAt(counter++);

      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // high surrogate, and there is a next character
        extra = string.charCodeAt(counter++);

        if ((extra & 0xFC00) == 0xDC00) {
          // low surrogate
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // unmatched surrogate; only append this code unit, in case the next
          // code unit is the high surrogate of a surrogate pair
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }

    return output;
  }
  /**
   * Creates a string based on an array of numeric code points.
   * @see `punycode.ucs2.decode`
   * @memberOf punycode.ucs2
   * @name encode
   * @param {Array} codePoints The array of numeric code points.
   * @returns {String} The new Unicode string (UCS-2).
   */


  function ucs2encode(array) {
    return map(array, function (value) {
      var output = '';

      if (value > 0xFFFF) {
        value -= 0x10000;
        output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
        value = 0xDC00 | value & 0x3FF;
      }

      output += stringFromCharCode(value);
      return output;
    }).join('');
  }
  /**
   * Converts a basic code point into a digit/integer.
   * @see `digitToBasic()`
   * @private
   * @param {Number} codePoint The basic numeric code point value.
   * @returns {Number} The numeric value of a basic code point (for use in
   * representing integers) in the range `0` to `base - 1`, or `base` if
   * the code point does not represent a value.
   */


  function basicToDigit(codePoint) {
    if (codePoint - 48 < 10) {
      return codePoint - 22;
    }

    if (codePoint - 65 < 26) {
      return codePoint - 65;
    }

    if (codePoint - 97 < 26) {
      return codePoint - 97;
    }

    return base;
  }
  /**
   * Converts a digit/integer into a basic code point.
   * @see `basicToDigit()`
   * @private
   * @param {Number} digit The numeric value of a basic code point.
   * @returns {Number} The basic code point whose value (when used for
   * representing integers) is `digit`, which needs to be in the range
   * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
   * used; else, the lowercase form is used. The behavior is undefined
   * if `flag` is non-zero and `digit` has no uppercase form.
   */


  function digitToBasic(digit, flag) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  }
  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   * @private
   */


  function adapt(delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor(delta / damp) : delta >> 1;
    delta += floor(delta / numPoints);

    for (;
    /* no initialization */
    delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor(delta / baseMinusTMin);
    }

    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  }
  /**
   * Converts a Punycode string of ASCII-only symbols to a string of Unicode
   * symbols.
   * @memberOf punycode
   * @param {String} input The Punycode string of ASCII-only symbols.
   * @returns {String} The resulting string of Unicode symbols.
   */


  function decode(input) {
    // Don't use UCS-2
    var output = [],
        inputLength = input.length,
        out,
        i = 0,
        n = initialN,
        bias = initialBias,
        basic,
        j,
        index,
        oldi,
        w,
        k,
        digit,
        t,

    /** Cached calculation results */
    baseMinusT; // Handle the basic code points: let `basic` be the number of input code
    // points before the last delimiter, or `0` if there is none, then copy
    // the first basic code points to the output.

    basic = input.lastIndexOf(delimiter);

    if (basic < 0) {
      basic = 0;
    }

    for (j = 0; j < basic; ++j) {
      // if it's not a basic code point
      if (input.charCodeAt(j) >= 0x80) {
        error('not-basic');
      }

      output.push(input.charCodeAt(j));
    } // Main decoding loop: start just after the last delimiter if any basic code
    // points were copied; start at the beginning otherwise.


    for (index = basic > 0 ? basic + 1 : 0; index < inputLength;)
    /* no final expression */
    {
      // `index` is the index of the next character to be consumed.
      // Decode a generalized variable-length integer into `delta`,
      // which gets added to `i`. The overflow checking is easier
      // if we increase `i` as we go, then subtract off its starting
      // value at the end to obtain `delta`.
      for (oldi = i, w = 1, k = base;;
      /* no condition */
      k += base) {
        if (index >= inputLength) {
          error('invalid-input');
        }

        digit = basicToDigit(input.charCodeAt(index++));

        if (digit >= base || digit > floor((maxInt - i) / w)) {
          error('overflow');
        }

        i += digit * w;
        t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

        if (digit < t) {
          break;
        }

        baseMinusT = base - t;

        if (w > floor(maxInt / baseMinusT)) {
          error('overflow');
        }

        w *= baseMinusT;
      }

      out = output.length + 1;
      bias = adapt(i - oldi, out, oldi == 0); // `i` was supposed to wrap around from `out` to `0`,
      // incrementing `n` each time, so we'll fix that now:

      if (floor(i / out) > maxInt - n) {
        error('overflow');
      }

      n += floor(i / out);
      i %= out; // Insert `n` at position `i` of the output

      output.splice(i++, 0, n);
    }

    return ucs2encode(output);
  }
  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   * @memberOf punycode
   * @param {String} input The string of Unicode symbols.
   * @returns {String} The resulting Punycode string of ASCII-only symbols.
   */

  function encode(input) {
    var n,
        delta,
        handledCPCount,
        basicLength,
        bias,
        j,
        m,
        q,
        k,
        t,
        currentValue,
        output = [],

    /** `inputLength` will hold the number of code points in `input`. */
    inputLength,

    /** Cached calculation results */
    handledCPCountPlusOne,
        baseMinusT,
        qMinusT; // Convert the input in UCS-2 to Unicode

    input = ucs2decode(input); // Cache the length

    inputLength = input.length; // Initialize the state

    n = initialN;
    delta = 0;
    bias = initialBias; // Handle the basic code points

    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j];

      if (currentValue < 0x80) {
        output.push(stringFromCharCode(currentValue));
      }
    }

    handledCPCount = basicLength = output.length; // `handledCPCount` is the number of code points that have been handled;
    // `basicLength` is the number of basic code points.
    // Finish the basic string - if it is not empty - with a delimiter

    if (basicLength) {
      output.push(delimiter);
    } // Main encoding loop:


    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next
      // larger one:
      for (m = maxInt, j = 0; j < inputLength; ++j) {
        currentValue = input[j];

        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      } // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
      // but guard against overflow


      handledCPCountPlusOne = handledCPCount + 1;

      if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
        error('overflow');
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (j = 0; j < inputLength; ++j) {
        currentValue = input[j];

        if (currentValue < n && ++delta > maxInt) {
          error('overflow');
        }

        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer
          for (q = delta, k = base;;
          /* no condition */
          k += base) {
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

            if (q < t) {
              break;
            }

            qMinusT = q - t;
            baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
            q = floor(qMinusT / baseMinusT);
          }

          output.push(stringFromCharCode(digitToBasic(q, 0)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }

      ++delta;
      ++n;
    }

    return output.join('');
  }
  /**
   * Converts a Punycode string representing a domain name or an email address
   * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
   * it doesn't matter if you call it on a string that has already been
   * converted to Unicode.
   * @memberOf punycode
   * @param {String} input The Punycoded domain name or email address to
   * convert to Unicode.
   * @returns {String} The Unicode representation of the given Punycode
   * string.
   */

  function toUnicode(input) {
    return mapDomain(input, function (string) {
      return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
    });
  }
  /**
   * Converts a Unicode string representing a domain name or an email address to
   * Punycode. Only the non-ASCII parts of the domain name will be converted,
   * i.e. it doesn't matter if you call it with a domain that's already in
   * ASCII.
   * @memberOf punycode
   * @param {String} input The domain name or email address to convert, as a
   * Unicode string.
   * @returns {String} The Punycode representation of the given domain name or
   * email address.
   */

  function toASCII(input) {
    return mapDomain(input, function (string) {
      return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
    });
  }
  var version = '1.4.1';
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */

  var ucs2 = {
    decode: ucs2decode,
    encode: ucs2encode
  };
  var punycode = {
    version: version,
    ucs2: ucs2,
    toASCII: toASCII,
    toUnicode: toUnicode,
    encode: encode,
    decode: decode
  };

  var punycode$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    decode: decode,
    encode: encode,
    toUnicode: toUnicode,
    toASCII: toASCII,
    version: version,
    ucs2: ucs2,
    'default': punycode
  });

  var revEntities = {
  	"9": "Tab;",
  	"10": "NewLine;",
  	"33": "excl;",
  	"34": "quot;",
  	"35": "num;",
  	"36": "dollar;",
  	"37": "percnt;",
  	"38": "amp;",
  	"39": "apos;",
  	"40": "lpar;",
  	"41": "rpar;",
  	"42": "midast;",
  	"43": "plus;",
  	"44": "comma;",
  	"46": "period;",
  	"47": "sol;",
  	"58": "colon;",
  	"59": "semi;",
  	"60": "lt;",
  	"61": "equals;",
  	"62": "gt;",
  	"63": "quest;",
  	"64": "commat;",
  	"91": "lsqb;",
  	"92": "bsol;",
  	"93": "rsqb;",
  	"94": "Hat;",
  	"95": "UnderBar;",
  	"96": "grave;",
  	"123": "lcub;",
  	"124": "VerticalLine;",
  	"125": "rcub;",
  	"160": "NonBreakingSpace;",
  	"161": "iexcl;",
  	"162": "cent;",
  	"163": "pound;",
  	"164": "curren;",
  	"165": "yen;",
  	"166": "brvbar;",
  	"167": "sect;",
  	"168": "uml;",
  	"169": "copy;",
  	"170": "ordf;",
  	"171": "laquo;",
  	"172": "not;",
  	"173": "shy;",
  	"174": "reg;",
  	"175": "strns;",
  	"176": "deg;",
  	"177": "pm;",
  	"178": "sup2;",
  	"179": "sup3;",
  	"180": "DiacriticalAcute;",
  	"181": "micro;",
  	"182": "para;",
  	"183": "middot;",
  	"184": "Cedilla;",
  	"185": "sup1;",
  	"186": "ordm;",
  	"187": "raquo;",
  	"188": "frac14;",
  	"189": "half;",
  	"190": "frac34;",
  	"191": "iquest;",
  	"192": "Agrave;",
  	"193": "Aacute;",
  	"194": "Acirc;",
  	"195": "Atilde;",
  	"196": "Auml;",
  	"197": "Aring;",
  	"198": "AElig;",
  	"199": "Ccedil;",
  	"200": "Egrave;",
  	"201": "Eacute;",
  	"202": "Ecirc;",
  	"203": "Euml;",
  	"204": "Igrave;",
  	"205": "Iacute;",
  	"206": "Icirc;",
  	"207": "Iuml;",
  	"208": "ETH;",
  	"209": "Ntilde;",
  	"210": "Ograve;",
  	"211": "Oacute;",
  	"212": "Ocirc;",
  	"213": "Otilde;",
  	"214": "Ouml;",
  	"215": "times;",
  	"216": "Oslash;",
  	"217": "Ugrave;",
  	"218": "Uacute;",
  	"219": "Ucirc;",
  	"220": "Uuml;",
  	"221": "Yacute;",
  	"222": "THORN;",
  	"223": "szlig;",
  	"224": "agrave;",
  	"225": "aacute;",
  	"226": "acirc;",
  	"227": "atilde;",
  	"228": "auml;",
  	"229": "aring;",
  	"230": "aelig;",
  	"231": "ccedil;",
  	"232": "egrave;",
  	"233": "eacute;",
  	"234": "ecirc;",
  	"235": "euml;",
  	"236": "igrave;",
  	"237": "iacute;",
  	"238": "icirc;",
  	"239": "iuml;",
  	"240": "eth;",
  	"241": "ntilde;",
  	"242": "ograve;",
  	"243": "oacute;",
  	"244": "ocirc;",
  	"245": "otilde;",
  	"246": "ouml;",
  	"247": "divide;",
  	"248": "oslash;",
  	"249": "ugrave;",
  	"250": "uacute;",
  	"251": "ucirc;",
  	"252": "uuml;",
  	"253": "yacute;",
  	"254": "thorn;",
  	"255": "yuml;",
  	"256": "Amacr;",
  	"257": "amacr;",
  	"258": "Abreve;",
  	"259": "abreve;",
  	"260": "Aogon;",
  	"261": "aogon;",
  	"262": "Cacute;",
  	"263": "cacute;",
  	"264": "Ccirc;",
  	"265": "ccirc;",
  	"266": "Cdot;",
  	"267": "cdot;",
  	"268": "Ccaron;",
  	"269": "ccaron;",
  	"270": "Dcaron;",
  	"271": "dcaron;",
  	"272": "Dstrok;",
  	"273": "dstrok;",
  	"274": "Emacr;",
  	"275": "emacr;",
  	"278": "Edot;",
  	"279": "edot;",
  	"280": "Eogon;",
  	"281": "eogon;",
  	"282": "Ecaron;",
  	"283": "ecaron;",
  	"284": "Gcirc;",
  	"285": "gcirc;",
  	"286": "Gbreve;",
  	"287": "gbreve;",
  	"288": "Gdot;",
  	"289": "gdot;",
  	"290": "Gcedil;",
  	"292": "Hcirc;",
  	"293": "hcirc;",
  	"294": "Hstrok;",
  	"295": "hstrok;",
  	"296": "Itilde;",
  	"297": "itilde;",
  	"298": "Imacr;",
  	"299": "imacr;",
  	"302": "Iogon;",
  	"303": "iogon;",
  	"304": "Idot;",
  	"305": "inodot;",
  	"306": "IJlig;",
  	"307": "ijlig;",
  	"308": "Jcirc;",
  	"309": "jcirc;",
  	"310": "Kcedil;",
  	"311": "kcedil;",
  	"312": "kgreen;",
  	"313": "Lacute;",
  	"314": "lacute;",
  	"315": "Lcedil;",
  	"316": "lcedil;",
  	"317": "Lcaron;",
  	"318": "lcaron;",
  	"319": "Lmidot;",
  	"320": "lmidot;",
  	"321": "Lstrok;",
  	"322": "lstrok;",
  	"323": "Nacute;",
  	"324": "nacute;",
  	"325": "Ncedil;",
  	"326": "ncedil;",
  	"327": "Ncaron;",
  	"328": "ncaron;",
  	"329": "napos;",
  	"330": "ENG;",
  	"331": "eng;",
  	"332": "Omacr;",
  	"333": "omacr;",
  	"336": "Odblac;",
  	"337": "odblac;",
  	"338": "OElig;",
  	"339": "oelig;",
  	"340": "Racute;",
  	"341": "racute;",
  	"342": "Rcedil;",
  	"343": "rcedil;",
  	"344": "Rcaron;",
  	"345": "rcaron;",
  	"346": "Sacute;",
  	"347": "sacute;",
  	"348": "Scirc;",
  	"349": "scirc;",
  	"350": "Scedil;",
  	"351": "scedil;",
  	"352": "Scaron;",
  	"353": "scaron;",
  	"354": "Tcedil;",
  	"355": "tcedil;",
  	"356": "Tcaron;",
  	"357": "tcaron;",
  	"358": "Tstrok;",
  	"359": "tstrok;",
  	"360": "Utilde;",
  	"361": "utilde;",
  	"362": "Umacr;",
  	"363": "umacr;",
  	"364": "Ubreve;",
  	"365": "ubreve;",
  	"366": "Uring;",
  	"367": "uring;",
  	"368": "Udblac;",
  	"369": "udblac;",
  	"370": "Uogon;",
  	"371": "uogon;",
  	"372": "Wcirc;",
  	"373": "wcirc;",
  	"374": "Ycirc;",
  	"375": "ycirc;",
  	"376": "Yuml;",
  	"377": "Zacute;",
  	"378": "zacute;",
  	"379": "Zdot;",
  	"380": "zdot;",
  	"381": "Zcaron;",
  	"382": "zcaron;",
  	"402": "fnof;",
  	"437": "imped;",
  	"501": "gacute;",
  	"567": "jmath;",
  	"710": "circ;",
  	"711": "Hacek;",
  	"728": "breve;",
  	"729": "dot;",
  	"730": "ring;",
  	"731": "ogon;",
  	"732": "tilde;",
  	"733": "DiacriticalDoubleAcute;",
  	"785": "DownBreve;",
  	"913": "Alpha;",
  	"914": "Beta;",
  	"915": "Gamma;",
  	"916": "Delta;",
  	"917": "Epsilon;",
  	"918": "Zeta;",
  	"919": "Eta;",
  	"920": "Theta;",
  	"921": "Iota;",
  	"922": "Kappa;",
  	"923": "Lambda;",
  	"924": "Mu;",
  	"925": "Nu;",
  	"926": "Xi;",
  	"927": "Omicron;",
  	"928": "Pi;",
  	"929": "Rho;",
  	"931": "Sigma;",
  	"932": "Tau;",
  	"933": "Upsilon;",
  	"934": "Phi;",
  	"935": "Chi;",
  	"936": "Psi;",
  	"937": "Omega;",
  	"945": "alpha;",
  	"946": "beta;",
  	"947": "gamma;",
  	"948": "delta;",
  	"949": "epsilon;",
  	"950": "zeta;",
  	"951": "eta;",
  	"952": "theta;",
  	"953": "iota;",
  	"954": "kappa;",
  	"955": "lambda;",
  	"956": "mu;",
  	"957": "nu;",
  	"958": "xi;",
  	"959": "omicron;",
  	"960": "pi;",
  	"961": "rho;",
  	"962": "varsigma;",
  	"963": "sigma;",
  	"964": "tau;",
  	"965": "upsilon;",
  	"966": "phi;",
  	"967": "chi;",
  	"968": "psi;",
  	"969": "omega;",
  	"977": "vartheta;",
  	"978": "upsih;",
  	"981": "varphi;",
  	"982": "varpi;",
  	"988": "Gammad;",
  	"989": "gammad;",
  	"1008": "varkappa;",
  	"1009": "varrho;",
  	"1013": "varepsilon;",
  	"1014": "bepsi;",
  	"1025": "IOcy;",
  	"1026": "DJcy;",
  	"1027": "GJcy;",
  	"1028": "Jukcy;",
  	"1029": "DScy;",
  	"1030": "Iukcy;",
  	"1031": "YIcy;",
  	"1032": "Jsercy;",
  	"1033": "LJcy;",
  	"1034": "NJcy;",
  	"1035": "TSHcy;",
  	"1036": "KJcy;",
  	"1038": "Ubrcy;",
  	"1039": "DZcy;",
  	"1040": "Acy;",
  	"1041": "Bcy;",
  	"1042": "Vcy;",
  	"1043": "Gcy;",
  	"1044": "Dcy;",
  	"1045": "IEcy;",
  	"1046": "ZHcy;",
  	"1047": "Zcy;",
  	"1048": "Icy;",
  	"1049": "Jcy;",
  	"1050": "Kcy;",
  	"1051": "Lcy;",
  	"1052": "Mcy;",
  	"1053": "Ncy;",
  	"1054": "Ocy;",
  	"1055": "Pcy;",
  	"1056": "Rcy;",
  	"1057": "Scy;",
  	"1058": "Tcy;",
  	"1059": "Ucy;",
  	"1060": "Fcy;",
  	"1061": "KHcy;",
  	"1062": "TScy;",
  	"1063": "CHcy;",
  	"1064": "SHcy;",
  	"1065": "SHCHcy;",
  	"1066": "HARDcy;",
  	"1067": "Ycy;",
  	"1068": "SOFTcy;",
  	"1069": "Ecy;",
  	"1070": "YUcy;",
  	"1071": "YAcy;",
  	"1072": "acy;",
  	"1073": "bcy;",
  	"1074": "vcy;",
  	"1075": "gcy;",
  	"1076": "dcy;",
  	"1077": "iecy;",
  	"1078": "zhcy;",
  	"1079": "zcy;",
  	"1080": "icy;",
  	"1081": "jcy;",
  	"1082": "kcy;",
  	"1083": "lcy;",
  	"1084": "mcy;",
  	"1085": "ncy;",
  	"1086": "ocy;",
  	"1087": "pcy;",
  	"1088": "rcy;",
  	"1089": "scy;",
  	"1090": "tcy;",
  	"1091": "ucy;",
  	"1092": "fcy;",
  	"1093": "khcy;",
  	"1094": "tscy;",
  	"1095": "chcy;",
  	"1096": "shcy;",
  	"1097": "shchcy;",
  	"1098": "hardcy;",
  	"1099": "ycy;",
  	"1100": "softcy;",
  	"1101": "ecy;",
  	"1102": "yucy;",
  	"1103": "yacy;",
  	"1105": "iocy;",
  	"1106": "djcy;",
  	"1107": "gjcy;",
  	"1108": "jukcy;",
  	"1109": "dscy;",
  	"1110": "iukcy;",
  	"1111": "yicy;",
  	"1112": "jsercy;",
  	"1113": "ljcy;",
  	"1114": "njcy;",
  	"1115": "tshcy;",
  	"1116": "kjcy;",
  	"1118": "ubrcy;",
  	"1119": "dzcy;",
  	"8194": "ensp;",
  	"8195": "emsp;",
  	"8196": "emsp13;",
  	"8197": "emsp14;",
  	"8199": "numsp;",
  	"8200": "puncsp;",
  	"8201": "ThinSpace;",
  	"8202": "VeryThinSpace;",
  	"8203": "ZeroWidthSpace;",
  	"8204": "zwnj;",
  	"8205": "zwj;",
  	"8206": "lrm;",
  	"8207": "rlm;",
  	"8208": "hyphen;",
  	"8211": "ndash;",
  	"8212": "mdash;",
  	"8213": "horbar;",
  	"8214": "Vert;",
  	"8216": "OpenCurlyQuote;",
  	"8217": "rsquor;",
  	"8218": "sbquo;",
  	"8220": "OpenCurlyDoubleQuote;",
  	"8221": "rdquor;",
  	"8222": "ldquor;",
  	"8224": "dagger;",
  	"8225": "ddagger;",
  	"8226": "bullet;",
  	"8229": "nldr;",
  	"8230": "mldr;",
  	"8240": "permil;",
  	"8241": "pertenk;",
  	"8242": "prime;",
  	"8243": "Prime;",
  	"8244": "tprime;",
  	"8245": "bprime;",
  	"8249": "lsaquo;",
  	"8250": "rsaquo;",
  	"8254": "OverBar;",
  	"8257": "caret;",
  	"8259": "hybull;",
  	"8260": "frasl;",
  	"8271": "bsemi;",
  	"8279": "qprime;",
  	"8287": "MediumSpace;",
  	"8288": "NoBreak;",
  	"8289": "ApplyFunction;",
  	"8290": "it;",
  	"8291": "InvisibleComma;",
  	"8364": "euro;",
  	"8411": "TripleDot;",
  	"8412": "DotDot;",
  	"8450": "Copf;",
  	"8453": "incare;",
  	"8458": "gscr;",
  	"8459": "Hscr;",
  	"8460": "Poincareplane;",
  	"8461": "quaternions;",
  	"8462": "planckh;",
  	"8463": "plankv;",
  	"8464": "Iscr;",
  	"8465": "imagpart;",
  	"8466": "Lscr;",
  	"8467": "ell;",
  	"8469": "Nopf;",
  	"8470": "numero;",
  	"8471": "copysr;",
  	"8472": "wp;",
  	"8473": "primes;",
  	"8474": "rationals;",
  	"8475": "Rscr;",
  	"8476": "Rfr;",
  	"8477": "Ropf;",
  	"8478": "rx;",
  	"8482": "trade;",
  	"8484": "Zopf;",
  	"8487": "mho;",
  	"8488": "Zfr;",
  	"8489": "iiota;",
  	"8492": "Bscr;",
  	"8493": "Cfr;",
  	"8495": "escr;",
  	"8496": "expectation;",
  	"8497": "Fscr;",
  	"8499": "phmmat;",
  	"8500": "oscr;",
  	"8501": "aleph;",
  	"8502": "beth;",
  	"8503": "gimel;",
  	"8504": "daleth;",
  	"8517": "DD;",
  	"8518": "DifferentialD;",
  	"8519": "exponentiale;",
  	"8520": "ImaginaryI;",
  	"8531": "frac13;",
  	"8532": "frac23;",
  	"8533": "frac15;",
  	"8534": "frac25;",
  	"8535": "frac35;",
  	"8536": "frac45;",
  	"8537": "frac16;",
  	"8538": "frac56;",
  	"8539": "frac18;",
  	"8540": "frac38;",
  	"8541": "frac58;",
  	"8542": "frac78;",
  	"8592": "slarr;",
  	"8593": "uparrow;",
  	"8594": "srarr;",
  	"8595": "ShortDownArrow;",
  	"8596": "leftrightarrow;",
  	"8597": "varr;",
  	"8598": "UpperLeftArrow;",
  	"8599": "UpperRightArrow;",
  	"8600": "searrow;",
  	"8601": "swarrow;",
  	"8602": "nleftarrow;",
  	"8603": "nrightarrow;",
  	"8605": "rightsquigarrow;",
  	"8606": "twoheadleftarrow;",
  	"8607": "Uarr;",
  	"8608": "twoheadrightarrow;",
  	"8609": "Darr;",
  	"8610": "leftarrowtail;",
  	"8611": "rightarrowtail;",
  	"8612": "mapstoleft;",
  	"8613": "UpTeeArrow;",
  	"8614": "RightTeeArrow;",
  	"8615": "mapstodown;",
  	"8617": "larrhk;",
  	"8618": "rarrhk;",
  	"8619": "looparrowleft;",
  	"8620": "rarrlp;",
  	"8621": "leftrightsquigarrow;",
  	"8622": "nleftrightarrow;",
  	"8624": "lsh;",
  	"8625": "rsh;",
  	"8626": "ldsh;",
  	"8627": "rdsh;",
  	"8629": "crarr;",
  	"8630": "curvearrowleft;",
  	"8631": "curvearrowright;",
  	"8634": "olarr;",
  	"8635": "orarr;",
  	"8636": "lharu;",
  	"8637": "lhard;",
  	"8638": "upharpoonright;",
  	"8639": "upharpoonleft;",
  	"8640": "RightVector;",
  	"8641": "rightharpoondown;",
  	"8642": "RightDownVector;",
  	"8643": "LeftDownVector;",
  	"8644": "rlarr;",
  	"8645": "UpArrowDownArrow;",
  	"8646": "lrarr;",
  	"8647": "llarr;",
  	"8648": "uuarr;",
  	"8649": "rrarr;",
  	"8650": "downdownarrows;",
  	"8651": "ReverseEquilibrium;",
  	"8652": "rlhar;",
  	"8653": "nLeftarrow;",
  	"8654": "nLeftrightarrow;",
  	"8655": "nRightarrow;",
  	"8656": "Leftarrow;",
  	"8657": "Uparrow;",
  	"8658": "Rightarrow;",
  	"8659": "Downarrow;",
  	"8660": "Leftrightarrow;",
  	"8661": "vArr;",
  	"8662": "nwArr;",
  	"8663": "neArr;",
  	"8664": "seArr;",
  	"8665": "swArr;",
  	"8666": "Lleftarrow;",
  	"8667": "Rrightarrow;",
  	"8669": "zigrarr;",
  	"8676": "LeftArrowBar;",
  	"8677": "RightArrowBar;",
  	"8693": "duarr;",
  	"8701": "loarr;",
  	"8702": "roarr;",
  	"8703": "hoarr;",
  	"8704": "forall;",
  	"8705": "complement;",
  	"8706": "PartialD;",
  	"8707": "Exists;",
  	"8708": "NotExists;",
  	"8709": "varnothing;",
  	"8711": "nabla;",
  	"8712": "isinv;",
  	"8713": "notinva;",
  	"8715": "SuchThat;",
  	"8716": "NotReverseElement;",
  	"8719": "Product;",
  	"8720": "Coproduct;",
  	"8721": "sum;",
  	"8722": "minus;",
  	"8723": "mp;",
  	"8724": "plusdo;",
  	"8726": "ssetmn;",
  	"8727": "lowast;",
  	"8728": "SmallCircle;",
  	"8730": "Sqrt;",
  	"8733": "vprop;",
  	"8734": "infin;",
  	"8735": "angrt;",
  	"8736": "angle;",
  	"8737": "measuredangle;",
  	"8738": "angsph;",
  	"8739": "VerticalBar;",
  	"8740": "nsmid;",
  	"8741": "spar;",
  	"8742": "nspar;",
  	"8743": "wedge;",
  	"8744": "vee;",
  	"8745": "cap;",
  	"8746": "cup;",
  	"8747": "Integral;",
  	"8748": "Int;",
  	"8749": "tint;",
  	"8750": "oint;",
  	"8751": "DoubleContourIntegral;",
  	"8752": "Cconint;",
  	"8753": "cwint;",
  	"8754": "cwconint;",
  	"8755": "CounterClockwiseContourIntegral;",
  	"8756": "therefore;",
  	"8757": "because;",
  	"8758": "ratio;",
  	"8759": "Proportion;",
  	"8760": "minusd;",
  	"8762": "mDDot;",
  	"8763": "homtht;",
  	"8764": "Tilde;",
  	"8765": "bsim;",
  	"8766": "mstpos;",
  	"8767": "acd;",
  	"8768": "wreath;",
  	"8769": "nsim;",
  	"8770": "esim;",
  	"8771": "TildeEqual;",
  	"8772": "nsimeq;",
  	"8773": "TildeFullEqual;",
  	"8774": "simne;",
  	"8775": "NotTildeFullEqual;",
  	"8776": "TildeTilde;",
  	"8777": "NotTildeTilde;",
  	"8778": "approxeq;",
  	"8779": "apid;",
  	"8780": "bcong;",
  	"8781": "CupCap;",
  	"8782": "HumpDownHump;",
  	"8783": "HumpEqual;",
  	"8784": "esdot;",
  	"8785": "eDot;",
  	"8786": "fallingdotseq;",
  	"8787": "risingdotseq;",
  	"8788": "coloneq;",
  	"8789": "eqcolon;",
  	"8790": "eqcirc;",
  	"8791": "cire;",
  	"8793": "wedgeq;",
  	"8794": "veeeq;",
  	"8796": "trie;",
  	"8799": "questeq;",
  	"8800": "NotEqual;",
  	"8801": "equiv;",
  	"8802": "NotCongruent;",
  	"8804": "leq;",
  	"8805": "GreaterEqual;",
  	"8806": "LessFullEqual;",
  	"8807": "GreaterFullEqual;",
  	"8808": "lneqq;",
  	"8809": "gneqq;",
  	"8810": "NestedLessLess;",
  	"8811": "NestedGreaterGreater;",
  	"8812": "twixt;",
  	"8813": "NotCupCap;",
  	"8814": "NotLess;",
  	"8815": "NotGreater;",
  	"8816": "NotLessEqual;",
  	"8817": "NotGreaterEqual;",
  	"8818": "lsim;",
  	"8819": "gtrsim;",
  	"8820": "NotLessTilde;",
  	"8821": "NotGreaterTilde;",
  	"8822": "lg;",
  	"8823": "gtrless;",
  	"8824": "ntlg;",
  	"8825": "ntgl;",
  	"8826": "Precedes;",
  	"8827": "Succeeds;",
  	"8828": "PrecedesSlantEqual;",
  	"8829": "SucceedsSlantEqual;",
  	"8830": "prsim;",
  	"8831": "succsim;",
  	"8832": "nprec;",
  	"8833": "nsucc;",
  	"8834": "subset;",
  	"8835": "supset;",
  	"8836": "nsub;",
  	"8837": "nsup;",
  	"8838": "SubsetEqual;",
  	"8839": "supseteq;",
  	"8840": "nsubseteq;",
  	"8841": "nsupseteq;",
  	"8842": "subsetneq;",
  	"8843": "supsetneq;",
  	"8845": "cupdot;",
  	"8846": "uplus;",
  	"8847": "SquareSubset;",
  	"8848": "SquareSuperset;",
  	"8849": "SquareSubsetEqual;",
  	"8850": "SquareSupersetEqual;",
  	"8851": "SquareIntersection;",
  	"8852": "SquareUnion;",
  	"8853": "oplus;",
  	"8854": "ominus;",
  	"8855": "otimes;",
  	"8856": "osol;",
  	"8857": "odot;",
  	"8858": "ocir;",
  	"8859": "oast;",
  	"8861": "odash;",
  	"8862": "plusb;",
  	"8863": "minusb;",
  	"8864": "timesb;",
  	"8865": "sdotb;",
  	"8866": "vdash;",
  	"8867": "LeftTee;",
  	"8868": "top;",
  	"8869": "UpTee;",
  	"8871": "models;",
  	"8872": "vDash;",
  	"8873": "Vdash;",
  	"8874": "Vvdash;",
  	"8875": "VDash;",
  	"8876": "nvdash;",
  	"8877": "nvDash;",
  	"8878": "nVdash;",
  	"8879": "nVDash;",
  	"8880": "prurel;",
  	"8882": "vltri;",
  	"8883": "vrtri;",
  	"8884": "trianglelefteq;",
  	"8885": "trianglerighteq;",
  	"8886": "origof;",
  	"8887": "imof;",
  	"8888": "mumap;",
  	"8889": "hercon;",
  	"8890": "intercal;",
  	"8891": "veebar;",
  	"8893": "barvee;",
  	"8894": "angrtvb;",
  	"8895": "lrtri;",
  	"8896": "xwedge;",
  	"8897": "xvee;",
  	"8898": "xcap;",
  	"8899": "xcup;",
  	"8900": "diamond;",
  	"8901": "sdot;",
  	"8902": "Star;",
  	"8903": "divonx;",
  	"8904": "bowtie;",
  	"8905": "ltimes;",
  	"8906": "rtimes;",
  	"8907": "lthree;",
  	"8908": "rthree;",
  	"8909": "bsime;",
  	"8910": "cuvee;",
  	"8911": "cuwed;",
  	"8912": "Subset;",
  	"8913": "Supset;",
  	"8914": "Cap;",
  	"8915": "Cup;",
  	"8916": "pitchfork;",
  	"8917": "epar;",
  	"8918": "ltdot;",
  	"8919": "gtrdot;",
  	"8920": "Ll;",
  	"8921": "ggg;",
  	"8922": "LessEqualGreater;",
  	"8923": "gtreqless;",
  	"8926": "curlyeqprec;",
  	"8927": "curlyeqsucc;",
  	"8928": "nprcue;",
  	"8929": "nsccue;",
  	"8930": "nsqsube;",
  	"8931": "nsqsupe;",
  	"8934": "lnsim;",
  	"8935": "gnsim;",
  	"8936": "prnsim;",
  	"8937": "succnsim;",
  	"8938": "ntriangleleft;",
  	"8939": "ntriangleright;",
  	"8940": "ntrianglelefteq;",
  	"8941": "ntrianglerighteq;",
  	"8942": "vellip;",
  	"8943": "ctdot;",
  	"8944": "utdot;",
  	"8945": "dtdot;",
  	"8946": "disin;",
  	"8947": "isinsv;",
  	"8948": "isins;",
  	"8949": "isindot;",
  	"8950": "notinvc;",
  	"8951": "notinvb;",
  	"8953": "isinE;",
  	"8954": "nisd;",
  	"8955": "xnis;",
  	"8956": "nis;",
  	"8957": "notnivc;",
  	"8958": "notnivb;",
  	"8965": "barwedge;",
  	"8966": "doublebarwedge;",
  	"8968": "LeftCeiling;",
  	"8969": "RightCeiling;",
  	"8970": "lfloor;",
  	"8971": "RightFloor;",
  	"8972": "drcrop;",
  	"8973": "dlcrop;",
  	"8974": "urcrop;",
  	"8975": "ulcrop;",
  	"8976": "bnot;",
  	"8978": "profline;",
  	"8979": "profsurf;",
  	"8981": "telrec;",
  	"8982": "target;",
  	"8988": "ulcorner;",
  	"8989": "urcorner;",
  	"8990": "llcorner;",
  	"8991": "lrcorner;",
  	"8994": "sfrown;",
  	"8995": "ssmile;",
  	"9005": "cylcty;",
  	"9006": "profalar;",
  	"9014": "topbot;",
  	"9021": "ovbar;",
  	"9023": "solbar;",
  	"9084": "angzarr;",
  	"9136": "lmoustache;",
  	"9137": "rmoustache;",
  	"9140": "tbrk;",
  	"9141": "UnderBracket;",
  	"9142": "bbrktbrk;",
  	"9180": "OverParenthesis;",
  	"9181": "UnderParenthesis;",
  	"9182": "OverBrace;",
  	"9183": "UnderBrace;",
  	"9186": "trpezium;",
  	"9191": "elinters;",
  	"9251": "blank;",
  	"9416": "oS;",
  	"9472": "HorizontalLine;",
  	"9474": "boxv;",
  	"9484": "boxdr;",
  	"9488": "boxdl;",
  	"9492": "boxur;",
  	"9496": "boxul;",
  	"9500": "boxvr;",
  	"9508": "boxvl;",
  	"9516": "boxhd;",
  	"9524": "boxhu;",
  	"9532": "boxvh;",
  	"9552": "boxH;",
  	"9553": "boxV;",
  	"9554": "boxdR;",
  	"9555": "boxDr;",
  	"9556": "boxDR;",
  	"9557": "boxdL;",
  	"9558": "boxDl;",
  	"9559": "boxDL;",
  	"9560": "boxuR;",
  	"9561": "boxUr;",
  	"9562": "boxUR;",
  	"9563": "boxuL;",
  	"9564": "boxUl;",
  	"9565": "boxUL;",
  	"9566": "boxvR;",
  	"9567": "boxVr;",
  	"9568": "boxVR;",
  	"9569": "boxvL;",
  	"9570": "boxVl;",
  	"9571": "boxVL;",
  	"9572": "boxHd;",
  	"9573": "boxhD;",
  	"9574": "boxHD;",
  	"9575": "boxHu;",
  	"9576": "boxhU;",
  	"9577": "boxHU;",
  	"9578": "boxvH;",
  	"9579": "boxVh;",
  	"9580": "boxVH;",
  	"9600": "uhblk;",
  	"9604": "lhblk;",
  	"9608": "block;",
  	"9617": "blk14;",
  	"9618": "blk12;",
  	"9619": "blk34;",
  	"9633": "square;",
  	"9642": "squf;",
  	"9643": "EmptyVerySmallSquare;",
  	"9645": "rect;",
  	"9646": "marker;",
  	"9649": "fltns;",
  	"9651": "xutri;",
  	"9652": "utrif;",
  	"9653": "utri;",
  	"9656": "rtrif;",
  	"9657": "triangleright;",
  	"9661": "xdtri;",
  	"9662": "dtrif;",
  	"9663": "triangledown;",
  	"9666": "ltrif;",
  	"9667": "triangleleft;",
  	"9674": "lozenge;",
  	"9675": "cir;",
  	"9708": "tridot;",
  	"9711": "xcirc;",
  	"9720": "ultri;",
  	"9721": "urtri;",
  	"9722": "lltri;",
  	"9723": "EmptySmallSquare;",
  	"9724": "FilledSmallSquare;",
  	"9733": "starf;",
  	"9734": "star;",
  	"9742": "phone;",
  	"9792": "female;",
  	"9794": "male;",
  	"9824": "spadesuit;",
  	"9827": "clubsuit;",
  	"9829": "heartsuit;",
  	"9830": "diams;",
  	"9834": "sung;",
  	"9837": "flat;",
  	"9838": "natural;",
  	"9839": "sharp;",
  	"10003": "checkmark;",
  	"10007": "cross;",
  	"10016": "maltese;",
  	"10038": "sext;",
  	"10072": "VerticalSeparator;",
  	"10098": "lbbrk;",
  	"10099": "rbbrk;",
  	"10184": "bsolhsub;",
  	"10185": "suphsol;",
  	"10214": "lobrk;",
  	"10215": "robrk;",
  	"10216": "LeftAngleBracket;",
  	"10217": "RightAngleBracket;",
  	"10218": "Lang;",
  	"10219": "Rang;",
  	"10220": "loang;",
  	"10221": "roang;",
  	"10229": "xlarr;",
  	"10230": "xrarr;",
  	"10231": "xharr;",
  	"10232": "xlArr;",
  	"10233": "xrArr;",
  	"10234": "xhArr;",
  	"10236": "xmap;",
  	"10239": "dzigrarr;",
  	"10498": "nvlArr;",
  	"10499": "nvrArr;",
  	"10500": "nvHarr;",
  	"10501": "Map;",
  	"10508": "lbarr;",
  	"10509": "rbarr;",
  	"10510": "lBarr;",
  	"10511": "rBarr;",
  	"10512": "RBarr;",
  	"10513": "DDotrahd;",
  	"10514": "UpArrowBar;",
  	"10515": "DownArrowBar;",
  	"10518": "Rarrtl;",
  	"10521": "latail;",
  	"10522": "ratail;",
  	"10523": "lAtail;",
  	"10524": "rAtail;",
  	"10525": "larrfs;",
  	"10526": "rarrfs;",
  	"10527": "larrbfs;",
  	"10528": "rarrbfs;",
  	"10531": "nwarhk;",
  	"10532": "nearhk;",
  	"10533": "searhk;",
  	"10534": "swarhk;",
  	"10535": "nwnear;",
  	"10536": "toea;",
  	"10537": "tosa;",
  	"10538": "swnwar;",
  	"10547": "rarrc;",
  	"10549": "cudarrr;",
  	"10550": "ldca;",
  	"10551": "rdca;",
  	"10552": "cudarrl;",
  	"10553": "larrpl;",
  	"10556": "curarrm;",
  	"10557": "cularrp;",
  	"10565": "rarrpl;",
  	"10568": "harrcir;",
  	"10569": "Uarrocir;",
  	"10570": "lurdshar;",
  	"10571": "ldrushar;",
  	"10574": "LeftRightVector;",
  	"10575": "RightUpDownVector;",
  	"10576": "DownLeftRightVector;",
  	"10577": "LeftUpDownVector;",
  	"10578": "LeftVectorBar;",
  	"10579": "RightVectorBar;",
  	"10580": "RightUpVectorBar;",
  	"10581": "RightDownVectorBar;",
  	"10582": "DownLeftVectorBar;",
  	"10583": "DownRightVectorBar;",
  	"10584": "LeftUpVectorBar;",
  	"10585": "LeftDownVectorBar;",
  	"10586": "LeftTeeVector;",
  	"10587": "RightTeeVector;",
  	"10588": "RightUpTeeVector;",
  	"10589": "RightDownTeeVector;",
  	"10590": "DownLeftTeeVector;",
  	"10591": "DownRightTeeVector;",
  	"10592": "LeftUpTeeVector;",
  	"10593": "LeftDownTeeVector;",
  	"10594": "lHar;",
  	"10595": "uHar;",
  	"10596": "rHar;",
  	"10597": "dHar;",
  	"10598": "luruhar;",
  	"10599": "ldrdhar;",
  	"10600": "ruluhar;",
  	"10601": "rdldhar;",
  	"10602": "lharul;",
  	"10603": "llhard;",
  	"10604": "rharul;",
  	"10605": "lrhard;",
  	"10606": "UpEquilibrium;",
  	"10607": "ReverseUpEquilibrium;",
  	"10608": "RoundImplies;",
  	"10609": "erarr;",
  	"10610": "simrarr;",
  	"10611": "larrsim;",
  	"10612": "rarrsim;",
  	"10613": "rarrap;",
  	"10614": "ltlarr;",
  	"10616": "gtrarr;",
  	"10617": "subrarr;",
  	"10619": "suplarr;",
  	"10620": "lfisht;",
  	"10621": "rfisht;",
  	"10622": "ufisht;",
  	"10623": "dfisht;",
  	"10629": "lopar;",
  	"10630": "ropar;",
  	"10635": "lbrke;",
  	"10636": "rbrke;",
  	"10637": "lbrkslu;",
  	"10638": "rbrksld;",
  	"10639": "lbrksld;",
  	"10640": "rbrkslu;",
  	"10641": "langd;",
  	"10642": "rangd;",
  	"10643": "lparlt;",
  	"10644": "rpargt;",
  	"10645": "gtlPar;",
  	"10646": "ltrPar;",
  	"10650": "vzigzag;",
  	"10652": "vangrt;",
  	"10653": "angrtvbd;",
  	"10660": "ange;",
  	"10661": "range;",
  	"10662": "dwangle;",
  	"10663": "uwangle;",
  	"10664": "angmsdaa;",
  	"10665": "angmsdab;",
  	"10666": "angmsdac;",
  	"10667": "angmsdad;",
  	"10668": "angmsdae;",
  	"10669": "angmsdaf;",
  	"10670": "angmsdag;",
  	"10671": "angmsdah;",
  	"10672": "bemptyv;",
  	"10673": "demptyv;",
  	"10674": "cemptyv;",
  	"10675": "raemptyv;",
  	"10676": "laemptyv;",
  	"10677": "ohbar;",
  	"10678": "omid;",
  	"10679": "opar;",
  	"10681": "operp;",
  	"10683": "olcross;",
  	"10684": "odsold;",
  	"10686": "olcir;",
  	"10687": "ofcir;",
  	"10688": "olt;",
  	"10689": "ogt;",
  	"10690": "cirscir;",
  	"10691": "cirE;",
  	"10692": "solb;",
  	"10693": "bsolb;",
  	"10697": "boxbox;",
  	"10701": "trisb;",
  	"10702": "rtriltri;",
  	"10703": "LeftTriangleBar;",
  	"10704": "RightTriangleBar;",
  	"10716": "iinfin;",
  	"10717": "infintie;",
  	"10718": "nvinfin;",
  	"10723": "eparsl;",
  	"10724": "smeparsl;",
  	"10725": "eqvparsl;",
  	"10731": "lozf;",
  	"10740": "RuleDelayed;",
  	"10742": "dsol;",
  	"10752": "xodot;",
  	"10753": "xoplus;",
  	"10754": "xotime;",
  	"10756": "xuplus;",
  	"10758": "xsqcup;",
  	"10764": "qint;",
  	"10765": "fpartint;",
  	"10768": "cirfnint;",
  	"10769": "awint;",
  	"10770": "rppolint;",
  	"10771": "scpolint;",
  	"10772": "npolint;",
  	"10773": "pointint;",
  	"10774": "quatint;",
  	"10775": "intlarhk;",
  	"10786": "pluscir;",
  	"10787": "plusacir;",
  	"10788": "simplus;",
  	"10789": "plusdu;",
  	"10790": "plussim;",
  	"10791": "plustwo;",
  	"10793": "mcomma;",
  	"10794": "minusdu;",
  	"10797": "loplus;",
  	"10798": "roplus;",
  	"10799": "Cross;",
  	"10800": "timesd;",
  	"10801": "timesbar;",
  	"10803": "smashp;",
  	"10804": "lotimes;",
  	"10805": "rotimes;",
  	"10806": "otimesas;",
  	"10807": "Otimes;",
  	"10808": "odiv;",
  	"10809": "triplus;",
  	"10810": "triminus;",
  	"10811": "tritime;",
  	"10812": "iprod;",
  	"10815": "amalg;",
  	"10816": "capdot;",
  	"10818": "ncup;",
  	"10819": "ncap;",
  	"10820": "capand;",
  	"10821": "cupor;",
  	"10822": "cupcap;",
  	"10823": "capcup;",
  	"10824": "cupbrcap;",
  	"10825": "capbrcup;",
  	"10826": "cupcup;",
  	"10827": "capcap;",
  	"10828": "ccups;",
  	"10829": "ccaps;",
  	"10832": "ccupssm;",
  	"10835": "And;",
  	"10836": "Or;",
  	"10837": "andand;",
  	"10838": "oror;",
  	"10839": "orslope;",
  	"10840": "andslope;",
  	"10842": "andv;",
  	"10843": "orv;",
  	"10844": "andd;",
  	"10845": "ord;",
  	"10847": "wedbar;",
  	"10854": "sdote;",
  	"10858": "simdot;",
  	"10861": "congdot;",
  	"10862": "easter;",
  	"10863": "apacir;",
  	"10864": "apE;",
  	"10865": "eplus;",
  	"10866": "pluse;",
  	"10867": "Esim;",
  	"10868": "Colone;",
  	"10869": "Equal;",
  	"10871": "eDDot;",
  	"10872": "equivDD;",
  	"10873": "ltcir;",
  	"10874": "gtcir;",
  	"10875": "ltquest;",
  	"10876": "gtquest;",
  	"10877": "LessSlantEqual;",
  	"10878": "GreaterSlantEqual;",
  	"10879": "lesdot;",
  	"10880": "gesdot;",
  	"10881": "lesdoto;",
  	"10882": "gesdoto;",
  	"10883": "lesdotor;",
  	"10884": "gesdotol;",
  	"10885": "lessapprox;",
  	"10886": "gtrapprox;",
  	"10887": "lneq;",
  	"10888": "gneq;",
  	"10889": "lnapprox;",
  	"10890": "gnapprox;",
  	"10891": "lesseqqgtr;",
  	"10892": "gtreqqless;",
  	"10893": "lsime;",
  	"10894": "gsime;",
  	"10895": "lsimg;",
  	"10896": "gsiml;",
  	"10897": "lgE;",
  	"10898": "glE;",
  	"10899": "lesges;",
  	"10900": "gesles;",
  	"10901": "eqslantless;",
  	"10902": "eqslantgtr;",
  	"10903": "elsdot;",
  	"10904": "egsdot;",
  	"10905": "el;",
  	"10906": "eg;",
  	"10909": "siml;",
  	"10910": "simg;",
  	"10911": "simlE;",
  	"10912": "simgE;",
  	"10913": "LessLess;",
  	"10914": "GreaterGreater;",
  	"10916": "glj;",
  	"10917": "gla;",
  	"10918": "ltcc;",
  	"10919": "gtcc;",
  	"10920": "lescc;",
  	"10921": "gescc;",
  	"10922": "smt;",
  	"10923": "lat;",
  	"10924": "smte;",
  	"10925": "late;",
  	"10926": "bumpE;",
  	"10927": "preceq;",
  	"10928": "succeq;",
  	"10931": "prE;",
  	"10932": "scE;",
  	"10933": "prnE;",
  	"10934": "succneqq;",
  	"10935": "precapprox;",
  	"10936": "succapprox;",
  	"10937": "prnap;",
  	"10938": "succnapprox;",
  	"10939": "Pr;",
  	"10940": "Sc;",
  	"10941": "subdot;",
  	"10942": "supdot;",
  	"10943": "subplus;",
  	"10944": "supplus;",
  	"10945": "submult;",
  	"10946": "supmult;",
  	"10947": "subedot;",
  	"10948": "supedot;",
  	"10949": "subseteqq;",
  	"10950": "supseteqq;",
  	"10951": "subsim;",
  	"10952": "supsim;",
  	"10955": "subsetneqq;",
  	"10956": "supsetneqq;",
  	"10959": "csub;",
  	"10960": "csup;",
  	"10961": "csube;",
  	"10962": "csupe;",
  	"10963": "subsup;",
  	"10964": "supsub;",
  	"10965": "subsub;",
  	"10966": "supsup;",
  	"10967": "suphsub;",
  	"10968": "supdsub;",
  	"10969": "forkv;",
  	"10970": "topfork;",
  	"10971": "mlcp;",
  	"10980": "DoubleLeftTee;",
  	"10982": "Vdashl;",
  	"10983": "Barv;",
  	"10984": "vBar;",
  	"10985": "vBarv;",
  	"10987": "Vbar;",
  	"10988": "Not;",
  	"10989": "bNot;",
  	"10990": "rnmid;",
  	"10991": "cirmid;",
  	"10992": "midcir;",
  	"10993": "topcir;",
  	"10994": "nhpar;",
  	"10995": "parsim;",
  	"11005": "parsl;",
  	"64256": "fflig;",
  	"64257": "filig;",
  	"64258": "fllig;",
  	"64259": "ffilig;",
  	"64260": "ffllig;"
  };

  var punycode$2 = /*@__PURE__*/getAugmentedNamespace(punycode$1);

  var encode_1 = encode$1;

  function encode$1(str, opts) {
    if (typeof str !== 'string') {
      throw new TypeError('Expected a String');
    }

    if (!opts) opts = {};
    var numeric = true;
    if (opts.named) numeric = false;
    if (opts.numeric !== undefined) numeric = opts.numeric;
    var special = opts.special || {
      '"': true,
      "'": true,
      '<': true,
      '>': true,
      '&': true
    };
    var codePoints = punycode$2.ucs2.decode(str);
    var chars = [];

    for (var i = 0; i < codePoints.length; i++) {
      var cc = codePoints[i];
      var c = punycode$2.ucs2.encode([cc]);
      var e = revEntities[cc];

      if (e && (cc >= 127 || special[c]) && !numeric) {
        chars.push('&' + (/;$/.test(e) ? e : e + ';'));
      } else if (cc < 32 || cc >= 127 || special[c]) {
        chars.push('&#' + cc + ';');
      } else {
        chars.push(c);
      }
    }

    return chars.join('');
  }

  var Aacute = "Á";
  var aacute = "á";
  var Acirc = "Â";
  var acirc = "â";
  var acute = "´";
  var AElig = "Æ";
  var aelig = "æ";
  var Agrave = "À";
  var agrave = "à";
  var AMP = "&";
  var amp = "&";
  var Aring = "Å";
  var aring = "å";
  var Atilde = "Ã";
  var atilde = "ã";
  var Auml = "Ä";
  var auml = "ä";
  var brvbar = "¦";
  var Ccedil = "Ç";
  var ccedil = "ç";
  var cedil = "¸";
  var cent = "¢";
  var COPY = "©";
  var copy = "©";
  var curren = "¤";
  var deg = "°";
  var divide = "÷";
  var Eacute = "É";
  var eacute = "é";
  var Ecirc = "Ê";
  var ecirc = "ê";
  var Egrave = "È";
  var egrave = "è";
  var ETH = "Ð";
  var eth = "ð";
  var Euml = "Ë";
  var euml = "ë";
  var frac12 = "½";
  var frac14 = "¼";
  var frac34 = "¾";
  var GT = ">";
  var gt = ">";
  var Iacute = "Í";
  var iacute = "í";
  var Icirc = "Î";
  var icirc = "î";
  var iexcl = "¡";
  var Igrave = "Ì";
  var igrave = "ì";
  var iquest = "¿";
  var Iuml = "Ï";
  var iuml = "ï";
  var laquo = "«";
  var LT = "<";
  var lt = "<";
  var macr = "¯";
  var micro = "µ";
  var middot = "·";
  var nbsp = " ";
  var not = "¬";
  var Ntilde = "Ñ";
  var ntilde = "ñ";
  var Oacute = "Ó";
  var oacute = "ó";
  var Ocirc = "Ô";
  var ocirc = "ô";
  var Ograve = "Ò";
  var ograve = "ò";
  var ordf = "ª";
  var ordm = "º";
  var Oslash = "Ø";
  var oslash = "ø";
  var Otilde = "Õ";
  var otilde = "õ";
  var Ouml = "Ö";
  var ouml = "ö";
  var para = "¶";
  var plusmn = "±";
  var pound = "£";
  var QUOT = "\"";
  var quot = "\"";
  var raquo = "»";
  var REG = "®";
  var reg = "®";
  var sect = "§";
  var shy = "­";
  var sup1 = "¹";
  var sup2 = "²";
  var sup3 = "³";
  var szlig = "ß";
  var THORN = "Þ";
  var thorn = "þ";
  var times = "×";
  var Uacute = "Ú";
  var uacute = "ú";
  var Ucirc = "Û";
  var ucirc = "û";
  var Ugrave = "Ù";
  var ugrave = "ù";
  var uml = "¨";
  var Uuml = "Ü";
  var uuml = "ü";
  var Yacute = "Ý";
  var yacute = "ý";
  var yen = "¥";
  var yuml = "ÿ";
  var entities = {
  	"Aacute;": "Á",
  	Aacute: Aacute,
  	"aacute;": "á",
  	aacute: aacute,
  	"Abreve;": "Ă",
  	"abreve;": "ă",
  	"ac;": "∾",
  	"acd;": "∿",
  	"acE;": "∾̳",
  	"Acirc;": "Â",
  	Acirc: Acirc,
  	"acirc;": "â",
  	acirc: acirc,
  	"acute;": "´",
  	acute: acute,
  	"Acy;": "А",
  	"acy;": "а",
  	"AElig;": "Æ",
  	AElig: AElig,
  	"aelig;": "æ",
  	aelig: aelig,
  	"af;": "⁡",
  	"Afr;": "𝔄",
  	"afr;": "𝔞",
  	"Agrave;": "À",
  	Agrave: Agrave,
  	"agrave;": "à",
  	agrave: agrave,
  	"alefsym;": "ℵ",
  	"aleph;": "ℵ",
  	"Alpha;": "Α",
  	"alpha;": "α",
  	"Amacr;": "Ā",
  	"amacr;": "ā",
  	"amalg;": "⨿",
  	"AMP;": "&",
  	AMP: AMP,
  	"amp;": "&",
  	amp: amp,
  	"And;": "⩓",
  	"and;": "∧",
  	"andand;": "⩕",
  	"andd;": "⩜",
  	"andslope;": "⩘",
  	"andv;": "⩚",
  	"ang;": "∠",
  	"ange;": "⦤",
  	"angle;": "∠",
  	"angmsd;": "∡",
  	"angmsdaa;": "⦨",
  	"angmsdab;": "⦩",
  	"angmsdac;": "⦪",
  	"angmsdad;": "⦫",
  	"angmsdae;": "⦬",
  	"angmsdaf;": "⦭",
  	"angmsdag;": "⦮",
  	"angmsdah;": "⦯",
  	"angrt;": "∟",
  	"angrtvb;": "⊾",
  	"angrtvbd;": "⦝",
  	"angsph;": "∢",
  	"angst;": "Å",
  	"angzarr;": "⍼",
  	"Aogon;": "Ą",
  	"aogon;": "ą",
  	"Aopf;": "𝔸",
  	"aopf;": "𝕒",
  	"ap;": "≈",
  	"apacir;": "⩯",
  	"apE;": "⩰",
  	"ape;": "≊",
  	"apid;": "≋",
  	"apos;": "'",
  	"ApplyFunction;": "⁡",
  	"approx;": "≈",
  	"approxeq;": "≊",
  	"Aring;": "Å",
  	Aring: Aring,
  	"aring;": "å",
  	aring: aring,
  	"Ascr;": "𝒜",
  	"ascr;": "𝒶",
  	"Assign;": "≔",
  	"ast;": "*",
  	"asymp;": "≈",
  	"asympeq;": "≍",
  	"Atilde;": "Ã",
  	Atilde: Atilde,
  	"atilde;": "ã",
  	atilde: atilde,
  	"Auml;": "Ä",
  	Auml: Auml,
  	"auml;": "ä",
  	auml: auml,
  	"awconint;": "∳",
  	"awint;": "⨑",
  	"backcong;": "≌",
  	"backepsilon;": "϶",
  	"backprime;": "‵",
  	"backsim;": "∽",
  	"backsimeq;": "⋍",
  	"Backslash;": "∖",
  	"Barv;": "⫧",
  	"barvee;": "⊽",
  	"Barwed;": "⌆",
  	"barwed;": "⌅",
  	"barwedge;": "⌅",
  	"bbrk;": "⎵",
  	"bbrktbrk;": "⎶",
  	"bcong;": "≌",
  	"Bcy;": "Б",
  	"bcy;": "б",
  	"bdquo;": "„",
  	"becaus;": "∵",
  	"Because;": "∵",
  	"because;": "∵",
  	"bemptyv;": "⦰",
  	"bepsi;": "϶",
  	"bernou;": "ℬ",
  	"Bernoullis;": "ℬ",
  	"Beta;": "Β",
  	"beta;": "β",
  	"beth;": "ℶ",
  	"between;": "≬",
  	"Bfr;": "𝔅",
  	"bfr;": "𝔟",
  	"bigcap;": "⋂",
  	"bigcirc;": "◯",
  	"bigcup;": "⋃",
  	"bigodot;": "⨀",
  	"bigoplus;": "⨁",
  	"bigotimes;": "⨂",
  	"bigsqcup;": "⨆",
  	"bigstar;": "★",
  	"bigtriangledown;": "▽",
  	"bigtriangleup;": "△",
  	"biguplus;": "⨄",
  	"bigvee;": "⋁",
  	"bigwedge;": "⋀",
  	"bkarow;": "⤍",
  	"blacklozenge;": "⧫",
  	"blacksquare;": "▪",
  	"blacktriangle;": "▴",
  	"blacktriangledown;": "▾",
  	"blacktriangleleft;": "◂",
  	"blacktriangleright;": "▸",
  	"blank;": "␣",
  	"blk12;": "▒",
  	"blk14;": "░",
  	"blk34;": "▓",
  	"block;": "█",
  	"bne;": "=⃥",
  	"bnequiv;": "≡⃥",
  	"bNot;": "⫭",
  	"bnot;": "⌐",
  	"Bopf;": "𝔹",
  	"bopf;": "𝕓",
  	"bot;": "⊥",
  	"bottom;": "⊥",
  	"bowtie;": "⋈",
  	"boxbox;": "⧉",
  	"boxDL;": "╗",
  	"boxDl;": "╖",
  	"boxdL;": "╕",
  	"boxdl;": "┐",
  	"boxDR;": "╔",
  	"boxDr;": "╓",
  	"boxdR;": "╒",
  	"boxdr;": "┌",
  	"boxH;": "═",
  	"boxh;": "─",
  	"boxHD;": "╦",
  	"boxHd;": "╤",
  	"boxhD;": "╥",
  	"boxhd;": "┬",
  	"boxHU;": "╩",
  	"boxHu;": "╧",
  	"boxhU;": "╨",
  	"boxhu;": "┴",
  	"boxminus;": "⊟",
  	"boxplus;": "⊞",
  	"boxtimes;": "⊠",
  	"boxUL;": "╝",
  	"boxUl;": "╜",
  	"boxuL;": "╛",
  	"boxul;": "┘",
  	"boxUR;": "╚",
  	"boxUr;": "╙",
  	"boxuR;": "╘",
  	"boxur;": "└",
  	"boxV;": "║",
  	"boxv;": "│",
  	"boxVH;": "╬",
  	"boxVh;": "╫",
  	"boxvH;": "╪",
  	"boxvh;": "┼",
  	"boxVL;": "╣",
  	"boxVl;": "╢",
  	"boxvL;": "╡",
  	"boxvl;": "┤",
  	"boxVR;": "╠",
  	"boxVr;": "╟",
  	"boxvR;": "╞",
  	"boxvr;": "├",
  	"bprime;": "‵",
  	"Breve;": "˘",
  	"breve;": "˘",
  	"brvbar;": "¦",
  	brvbar: brvbar,
  	"Bscr;": "ℬ",
  	"bscr;": "𝒷",
  	"bsemi;": "⁏",
  	"bsim;": "∽",
  	"bsime;": "⋍",
  	"bsol;": "\\",
  	"bsolb;": "⧅",
  	"bsolhsub;": "⟈",
  	"bull;": "•",
  	"bullet;": "•",
  	"bump;": "≎",
  	"bumpE;": "⪮",
  	"bumpe;": "≏",
  	"Bumpeq;": "≎",
  	"bumpeq;": "≏",
  	"Cacute;": "Ć",
  	"cacute;": "ć",
  	"Cap;": "⋒",
  	"cap;": "∩",
  	"capand;": "⩄",
  	"capbrcup;": "⩉",
  	"capcap;": "⩋",
  	"capcup;": "⩇",
  	"capdot;": "⩀",
  	"CapitalDifferentialD;": "ⅅ",
  	"caps;": "∩︀",
  	"caret;": "⁁",
  	"caron;": "ˇ",
  	"Cayleys;": "ℭ",
  	"ccaps;": "⩍",
  	"Ccaron;": "Č",
  	"ccaron;": "č",
  	"Ccedil;": "Ç",
  	Ccedil: Ccedil,
  	"ccedil;": "ç",
  	ccedil: ccedil,
  	"Ccirc;": "Ĉ",
  	"ccirc;": "ĉ",
  	"Cconint;": "∰",
  	"ccups;": "⩌",
  	"ccupssm;": "⩐",
  	"Cdot;": "Ċ",
  	"cdot;": "ċ",
  	"cedil;": "¸",
  	cedil: cedil,
  	"Cedilla;": "¸",
  	"cemptyv;": "⦲",
  	"cent;": "¢",
  	cent: cent,
  	"CenterDot;": "·",
  	"centerdot;": "·",
  	"Cfr;": "ℭ",
  	"cfr;": "𝔠",
  	"CHcy;": "Ч",
  	"chcy;": "ч",
  	"check;": "✓",
  	"checkmark;": "✓",
  	"Chi;": "Χ",
  	"chi;": "χ",
  	"cir;": "○",
  	"circ;": "ˆ",
  	"circeq;": "≗",
  	"circlearrowleft;": "↺",
  	"circlearrowright;": "↻",
  	"circledast;": "⊛",
  	"circledcirc;": "⊚",
  	"circleddash;": "⊝",
  	"CircleDot;": "⊙",
  	"circledR;": "®",
  	"circledS;": "Ⓢ",
  	"CircleMinus;": "⊖",
  	"CirclePlus;": "⊕",
  	"CircleTimes;": "⊗",
  	"cirE;": "⧃",
  	"cire;": "≗",
  	"cirfnint;": "⨐",
  	"cirmid;": "⫯",
  	"cirscir;": "⧂",
  	"ClockwiseContourIntegral;": "∲",
  	"CloseCurlyDoubleQuote;": "”",
  	"CloseCurlyQuote;": "’",
  	"clubs;": "♣",
  	"clubsuit;": "♣",
  	"Colon;": "∷",
  	"colon;": ":",
  	"Colone;": "⩴",
  	"colone;": "≔",
  	"coloneq;": "≔",
  	"comma;": ",",
  	"commat;": "@",
  	"comp;": "∁",
  	"compfn;": "∘",
  	"complement;": "∁",
  	"complexes;": "ℂ",
  	"cong;": "≅",
  	"congdot;": "⩭",
  	"Congruent;": "≡",
  	"Conint;": "∯",
  	"conint;": "∮",
  	"ContourIntegral;": "∮",
  	"Copf;": "ℂ",
  	"copf;": "𝕔",
  	"coprod;": "∐",
  	"Coproduct;": "∐",
  	"COPY;": "©",
  	COPY: COPY,
  	"copy;": "©",
  	copy: copy,
  	"copysr;": "℗",
  	"CounterClockwiseContourIntegral;": "∳",
  	"crarr;": "↵",
  	"Cross;": "⨯",
  	"cross;": "✗",
  	"Cscr;": "𝒞",
  	"cscr;": "𝒸",
  	"csub;": "⫏",
  	"csube;": "⫑",
  	"csup;": "⫐",
  	"csupe;": "⫒",
  	"ctdot;": "⋯",
  	"cudarrl;": "⤸",
  	"cudarrr;": "⤵",
  	"cuepr;": "⋞",
  	"cuesc;": "⋟",
  	"cularr;": "↶",
  	"cularrp;": "⤽",
  	"Cup;": "⋓",
  	"cup;": "∪",
  	"cupbrcap;": "⩈",
  	"CupCap;": "≍",
  	"cupcap;": "⩆",
  	"cupcup;": "⩊",
  	"cupdot;": "⊍",
  	"cupor;": "⩅",
  	"cups;": "∪︀",
  	"curarr;": "↷",
  	"curarrm;": "⤼",
  	"curlyeqprec;": "⋞",
  	"curlyeqsucc;": "⋟",
  	"curlyvee;": "⋎",
  	"curlywedge;": "⋏",
  	"curren;": "¤",
  	curren: curren,
  	"curvearrowleft;": "↶",
  	"curvearrowright;": "↷",
  	"cuvee;": "⋎",
  	"cuwed;": "⋏",
  	"cwconint;": "∲",
  	"cwint;": "∱",
  	"cylcty;": "⌭",
  	"Dagger;": "‡",
  	"dagger;": "†",
  	"daleth;": "ℸ",
  	"Darr;": "↡",
  	"dArr;": "⇓",
  	"darr;": "↓",
  	"dash;": "‐",
  	"Dashv;": "⫤",
  	"dashv;": "⊣",
  	"dbkarow;": "⤏",
  	"dblac;": "˝",
  	"Dcaron;": "Ď",
  	"dcaron;": "ď",
  	"Dcy;": "Д",
  	"dcy;": "д",
  	"DD;": "ⅅ",
  	"dd;": "ⅆ",
  	"ddagger;": "‡",
  	"ddarr;": "⇊",
  	"DDotrahd;": "⤑",
  	"ddotseq;": "⩷",
  	"deg;": "°",
  	deg: deg,
  	"Del;": "∇",
  	"Delta;": "Δ",
  	"delta;": "δ",
  	"demptyv;": "⦱",
  	"dfisht;": "⥿",
  	"Dfr;": "𝔇",
  	"dfr;": "𝔡",
  	"dHar;": "⥥",
  	"dharl;": "⇃",
  	"dharr;": "⇂",
  	"DiacriticalAcute;": "´",
  	"DiacriticalDot;": "˙",
  	"DiacriticalDoubleAcute;": "˝",
  	"DiacriticalGrave;": "`",
  	"DiacriticalTilde;": "˜",
  	"diam;": "⋄",
  	"Diamond;": "⋄",
  	"diamond;": "⋄",
  	"diamondsuit;": "♦",
  	"diams;": "♦",
  	"die;": "¨",
  	"DifferentialD;": "ⅆ",
  	"digamma;": "ϝ",
  	"disin;": "⋲",
  	"div;": "÷",
  	"divide;": "÷",
  	divide: divide,
  	"divideontimes;": "⋇",
  	"divonx;": "⋇",
  	"DJcy;": "Ђ",
  	"djcy;": "ђ",
  	"dlcorn;": "⌞",
  	"dlcrop;": "⌍",
  	"dollar;": "$",
  	"Dopf;": "𝔻",
  	"dopf;": "𝕕",
  	"Dot;": "¨",
  	"dot;": "˙",
  	"DotDot;": "⃜",
  	"doteq;": "≐",
  	"doteqdot;": "≑",
  	"DotEqual;": "≐",
  	"dotminus;": "∸",
  	"dotplus;": "∔",
  	"dotsquare;": "⊡",
  	"doublebarwedge;": "⌆",
  	"DoubleContourIntegral;": "∯",
  	"DoubleDot;": "¨",
  	"DoubleDownArrow;": "⇓",
  	"DoubleLeftArrow;": "⇐",
  	"DoubleLeftRightArrow;": "⇔",
  	"DoubleLeftTee;": "⫤",
  	"DoubleLongLeftArrow;": "⟸",
  	"DoubleLongLeftRightArrow;": "⟺",
  	"DoubleLongRightArrow;": "⟹",
  	"DoubleRightArrow;": "⇒",
  	"DoubleRightTee;": "⊨",
  	"DoubleUpArrow;": "⇑",
  	"DoubleUpDownArrow;": "⇕",
  	"DoubleVerticalBar;": "∥",
  	"DownArrow;": "↓",
  	"Downarrow;": "⇓",
  	"downarrow;": "↓",
  	"DownArrowBar;": "⤓",
  	"DownArrowUpArrow;": "⇵",
  	"DownBreve;": "̑",
  	"downdownarrows;": "⇊",
  	"downharpoonleft;": "⇃",
  	"downharpoonright;": "⇂",
  	"DownLeftRightVector;": "⥐",
  	"DownLeftTeeVector;": "⥞",
  	"DownLeftVector;": "↽",
  	"DownLeftVectorBar;": "⥖",
  	"DownRightTeeVector;": "⥟",
  	"DownRightVector;": "⇁",
  	"DownRightVectorBar;": "⥗",
  	"DownTee;": "⊤",
  	"DownTeeArrow;": "↧",
  	"drbkarow;": "⤐",
  	"drcorn;": "⌟",
  	"drcrop;": "⌌",
  	"Dscr;": "𝒟",
  	"dscr;": "𝒹",
  	"DScy;": "Ѕ",
  	"dscy;": "ѕ",
  	"dsol;": "⧶",
  	"Dstrok;": "Đ",
  	"dstrok;": "đ",
  	"dtdot;": "⋱",
  	"dtri;": "▿",
  	"dtrif;": "▾",
  	"duarr;": "⇵",
  	"duhar;": "⥯",
  	"dwangle;": "⦦",
  	"DZcy;": "Џ",
  	"dzcy;": "џ",
  	"dzigrarr;": "⟿",
  	"Eacute;": "É",
  	Eacute: Eacute,
  	"eacute;": "é",
  	eacute: eacute,
  	"easter;": "⩮",
  	"Ecaron;": "Ě",
  	"ecaron;": "ě",
  	"ecir;": "≖",
  	"Ecirc;": "Ê",
  	Ecirc: Ecirc,
  	"ecirc;": "ê",
  	ecirc: ecirc,
  	"ecolon;": "≕",
  	"Ecy;": "Э",
  	"ecy;": "э",
  	"eDDot;": "⩷",
  	"Edot;": "Ė",
  	"eDot;": "≑",
  	"edot;": "ė",
  	"ee;": "ⅇ",
  	"efDot;": "≒",
  	"Efr;": "𝔈",
  	"efr;": "𝔢",
  	"eg;": "⪚",
  	"Egrave;": "È",
  	Egrave: Egrave,
  	"egrave;": "è",
  	egrave: egrave,
  	"egs;": "⪖",
  	"egsdot;": "⪘",
  	"el;": "⪙",
  	"Element;": "∈",
  	"elinters;": "⏧",
  	"ell;": "ℓ",
  	"els;": "⪕",
  	"elsdot;": "⪗",
  	"Emacr;": "Ē",
  	"emacr;": "ē",
  	"empty;": "∅",
  	"emptyset;": "∅",
  	"EmptySmallSquare;": "◻",
  	"emptyv;": "∅",
  	"EmptyVerySmallSquare;": "▫",
  	"emsp;": " ",
  	"emsp13;": " ",
  	"emsp14;": " ",
  	"ENG;": "Ŋ",
  	"eng;": "ŋ",
  	"ensp;": " ",
  	"Eogon;": "Ę",
  	"eogon;": "ę",
  	"Eopf;": "𝔼",
  	"eopf;": "𝕖",
  	"epar;": "⋕",
  	"eparsl;": "⧣",
  	"eplus;": "⩱",
  	"epsi;": "ε",
  	"Epsilon;": "Ε",
  	"epsilon;": "ε",
  	"epsiv;": "ϵ",
  	"eqcirc;": "≖",
  	"eqcolon;": "≕",
  	"eqsim;": "≂",
  	"eqslantgtr;": "⪖",
  	"eqslantless;": "⪕",
  	"Equal;": "⩵",
  	"equals;": "=",
  	"EqualTilde;": "≂",
  	"equest;": "≟",
  	"Equilibrium;": "⇌",
  	"equiv;": "≡",
  	"equivDD;": "⩸",
  	"eqvparsl;": "⧥",
  	"erarr;": "⥱",
  	"erDot;": "≓",
  	"Escr;": "ℰ",
  	"escr;": "ℯ",
  	"esdot;": "≐",
  	"Esim;": "⩳",
  	"esim;": "≂",
  	"Eta;": "Η",
  	"eta;": "η",
  	"ETH;": "Ð",
  	ETH: ETH,
  	"eth;": "ð",
  	eth: eth,
  	"Euml;": "Ë",
  	Euml: Euml,
  	"euml;": "ë",
  	euml: euml,
  	"euro;": "€",
  	"excl;": "!",
  	"exist;": "∃",
  	"Exists;": "∃",
  	"expectation;": "ℰ",
  	"ExponentialE;": "ⅇ",
  	"exponentiale;": "ⅇ",
  	"fallingdotseq;": "≒",
  	"Fcy;": "Ф",
  	"fcy;": "ф",
  	"female;": "♀",
  	"ffilig;": "ﬃ",
  	"fflig;": "ﬀ",
  	"ffllig;": "ﬄ",
  	"Ffr;": "𝔉",
  	"ffr;": "𝔣",
  	"filig;": "ﬁ",
  	"FilledSmallSquare;": "◼",
  	"FilledVerySmallSquare;": "▪",
  	"fjlig;": "fj",
  	"flat;": "♭",
  	"fllig;": "ﬂ",
  	"fltns;": "▱",
  	"fnof;": "ƒ",
  	"Fopf;": "𝔽",
  	"fopf;": "𝕗",
  	"ForAll;": "∀",
  	"forall;": "∀",
  	"fork;": "⋔",
  	"forkv;": "⫙",
  	"Fouriertrf;": "ℱ",
  	"fpartint;": "⨍",
  	"frac12;": "½",
  	frac12: frac12,
  	"frac13;": "⅓",
  	"frac14;": "¼",
  	frac14: frac14,
  	"frac15;": "⅕",
  	"frac16;": "⅙",
  	"frac18;": "⅛",
  	"frac23;": "⅔",
  	"frac25;": "⅖",
  	"frac34;": "¾",
  	frac34: frac34,
  	"frac35;": "⅗",
  	"frac38;": "⅜",
  	"frac45;": "⅘",
  	"frac56;": "⅚",
  	"frac58;": "⅝",
  	"frac78;": "⅞",
  	"frasl;": "⁄",
  	"frown;": "⌢",
  	"Fscr;": "ℱ",
  	"fscr;": "𝒻",
  	"gacute;": "ǵ",
  	"Gamma;": "Γ",
  	"gamma;": "γ",
  	"Gammad;": "Ϝ",
  	"gammad;": "ϝ",
  	"gap;": "⪆",
  	"Gbreve;": "Ğ",
  	"gbreve;": "ğ",
  	"Gcedil;": "Ģ",
  	"Gcirc;": "Ĝ",
  	"gcirc;": "ĝ",
  	"Gcy;": "Г",
  	"gcy;": "г",
  	"Gdot;": "Ġ",
  	"gdot;": "ġ",
  	"gE;": "≧",
  	"ge;": "≥",
  	"gEl;": "⪌",
  	"gel;": "⋛",
  	"geq;": "≥",
  	"geqq;": "≧",
  	"geqslant;": "⩾",
  	"ges;": "⩾",
  	"gescc;": "⪩",
  	"gesdot;": "⪀",
  	"gesdoto;": "⪂",
  	"gesdotol;": "⪄",
  	"gesl;": "⋛︀",
  	"gesles;": "⪔",
  	"Gfr;": "𝔊",
  	"gfr;": "𝔤",
  	"Gg;": "⋙",
  	"gg;": "≫",
  	"ggg;": "⋙",
  	"gimel;": "ℷ",
  	"GJcy;": "Ѓ",
  	"gjcy;": "ѓ",
  	"gl;": "≷",
  	"gla;": "⪥",
  	"glE;": "⪒",
  	"glj;": "⪤",
  	"gnap;": "⪊",
  	"gnapprox;": "⪊",
  	"gnE;": "≩",
  	"gne;": "⪈",
  	"gneq;": "⪈",
  	"gneqq;": "≩",
  	"gnsim;": "⋧",
  	"Gopf;": "𝔾",
  	"gopf;": "𝕘",
  	"grave;": "`",
  	"GreaterEqual;": "≥",
  	"GreaterEqualLess;": "⋛",
  	"GreaterFullEqual;": "≧",
  	"GreaterGreater;": "⪢",
  	"GreaterLess;": "≷",
  	"GreaterSlantEqual;": "⩾",
  	"GreaterTilde;": "≳",
  	"Gscr;": "𝒢",
  	"gscr;": "ℊ",
  	"gsim;": "≳",
  	"gsime;": "⪎",
  	"gsiml;": "⪐",
  	"GT;": ">",
  	GT: GT,
  	"Gt;": "≫",
  	"gt;": ">",
  	gt: gt,
  	"gtcc;": "⪧",
  	"gtcir;": "⩺",
  	"gtdot;": "⋗",
  	"gtlPar;": "⦕",
  	"gtquest;": "⩼",
  	"gtrapprox;": "⪆",
  	"gtrarr;": "⥸",
  	"gtrdot;": "⋗",
  	"gtreqless;": "⋛",
  	"gtreqqless;": "⪌",
  	"gtrless;": "≷",
  	"gtrsim;": "≳",
  	"gvertneqq;": "≩︀",
  	"gvnE;": "≩︀",
  	"Hacek;": "ˇ",
  	"hairsp;": " ",
  	"half;": "½",
  	"hamilt;": "ℋ",
  	"HARDcy;": "Ъ",
  	"hardcy;": "ъ",
  	"hArr;": "⇔",
  	"harr;": "↔",
  	"harrcir;": "⥈",
  	"harrw;": "↭",
  	"Hat;": "^",
  	"hbar;": "ℏ",
  	"Hcirc;": "Ĥ",
  	"hcirc;": "ĥ",
  	"hearts;": "♥",
  	"heartsuit;": "♥",
  	"hellip;": "…",
  	"hercon;": "⊹",
  	"Hfr;": "ℌ",
  	"hfr;": "𝔥",
  	"HilbertSpace;": "ℋ",
  	"hksearow;": "⤥",
  	"hkswarow;": "⤦",
  	"hoarr;": "⇿",
  	"homtht;": "∻",
  	"hookleftarrow;": "↩",
  	"hookrightarrow;": "↪",
  	"Hopf;": "ℍ",
  	"hopf;": "𝕙",
  	"horbar;": "―",
  	"HorizontalLine;": "─",
  	"Hscr;": "ℋ",
  	"hscr;": "𝒽",
  	"hslash;": "ℏ",
  	"Hstrok;": "Ħ",
  	"hstrok;": "ħ",
  	"HumpDownHump;": "≎",
  	"HumpEqual;": "≏",
  	"hybull;": "⁃",
  	"hyphen;": "‐",
  	"Iacute;": "Í",
  	Iacute: Iacute,
  	"iacute;": "í",
  	iacute: iacute,
  	"ic;": "⁣",
  	"Icirc;": "Î",
  	Icirc: Icirc,
  	"icirc;": "î",
  	icirc: icirc,
  	"Icy;": "И",
  	"icy;": "и",
  	"Idot;": "İ",
  	"IEcy;": "Е",
  	"iecy;": "е",
  	"iexcl;": "¡",
  	iexcl: iexcl,
  	"iff;": "⇔",
  	"Ifr;": "ℑ",
  	"ifr;": "𝔦",
  	"Igrave;": "Ì",
  	Igrave: Igrave,
  	"igrave;": "ì",
  	igrave: igrave,
  	"ii;": "ⅈ",
  	"iiiint;": "⨌",
  	"iiint;": "∭",
  	"iinfin;": "⧜",
  	"iiota;": "℩",
  	"IJlig;": "Ĳ",
  	"ijlig;": "ĳ",
  	"Im;": "ℑ",
  	"Imacr;": "Ī",
  	"imacr;": "ī",
  	"image;": "ℑ",
  	"ImaginaryI;": "ⅈ",
  	"imagline;": "ℐ",
  	"imagpart;": "ℑ",
  	"imath;": "ı",
  	"imof;": "⊷",
  	"imped;": "Ƶ",
  	"Implies;": "⇒",
  	"in;": "∈",
  	"incare;": "℅",
  	"infin;": "∞",
  	"infintie;": "⧝",
  	"inodot;": "ı",
  	"Int;": "∬",
  	"int;": "∫",
  	"intcal;": "⊺",
  	"integers;": "ℤ",
  	"Integral;": "∫",
  	"intercal;": "⊺",
  	"Intersection;": "⋂",
  	"intlarhk;": "⨗",
  	"intprod;": "⨼",
  	"InvisibleComma;": "⁣",
  	"InvisibleTimes;": "⁢",
  	"IOcy;": "Ё",
  	"iocy;": "ё",
  	"Iogon;": "Į",
  	"iogon;": "į",
  	"Iopf;": "𝕀",
  	"iopf;": "𝕚",
  	"Iota;": "Ι",
  	"iota;": "ι",
  	"iprod;": "⨼",
  	"iquest;": "¿",
  	iquest: iquest,
  	"Iscr;": "ℐ",
  	"iscr;": "𝒾",
  	"isin;": "∈",
  	"isindot;": "⋵",
  	"isinE;": "⋹",
  	"isins;": "⋴",
  	"isinsv;": "⋳",
  	"isinv;": "∈",
  	"it;": "⁢",
  	"Itilde;": "Ĩ",
  	"itilde;": "ĩ",
  	"Iukcy;": "І",
  	"iukcy;": "і",
  	"Iuml;": "Ï",
  	Iuml: Iuml,
  	"iuml;": "ï",
  	iuml: iuml,
  	"Jcirc;": "Ĵ",
  	"jcirc;": "ĵ",
  	"Jcy;": "Й",
  	"jcy;": "й",
  	"Jfr;": "𝔍",
  	"jfr;": "𝔧",
  	"jmath;": "ȷ",
  	"Jopf;": "𝕁",
  	"jopf;": "𝕛",
  	"Jscr;": "𝒥",
  	"jscr;": "𝒿",
  	"Jsercy;": "Ј",
  	"jsercy;": "ј",
  	"Jukcy;": "Є",
  	"jukcy;": "є",
  	"Kappa;": "Κ",
  	"kappa;": "κ",
  	"kappav;": "ϰ",
  	"Kcedil;": "Ķ",
  	"kcedil;": "ķ",
  	"Kcy;": "К",
  	"kcy;": "к",
  	"Kfr;": "𝔎",
  	"kfr;": "𝔨",
  	"kgreen;": "ĸ",
  	"KHcy;": "Х",
  	"khcy;": "х",
  	"KJcy;": "Ќ",
  	"kjcy;": "ќ",
  	"Kopf;": "𝕂",
  	"kopf;": "𝕜",
  	"Kscr;": "𝒦",
  	"kscr;": "𝓀",
  	"lAarr;": "⇚",
  	"Lacute;": "Ĺ",
  	"lacute;": "ĺ",
  	"laemptyv;": "⦴",
  	"lagran;": "ℒ",
  	"Lambda;": "Λ",
  	"lambda;": "λ",
  	"Lang;": "⟪",
  	"lang;": "⟨",
  	"langd;": "⦑",
  	"langle;": "⟨",
  	"lap;": "⪅",
  	"Laplacetrf;": "ℒ",
  	"laquo;": "«",
  	laquo: laquo,
  	"Larr;": "↞",
  	"lArr;": "⇐",
  	"larr;": "←",
  	"larrb;": "⇤",
  	"larrbfs;": "⤟",
  	"larrfs;": "⤝",
  	"larrhk;": "↩",
  	"larrlp;": "↫",
  	"larrpl;": "⤹",
  	"larrsim;": "⥳",
  	"larrtl;": "↢",
  	"lat;": "⪫",
  	"lAtail;": "⤛",
  	"latail;": "⤙",
  	"late;": "⪭",
  	"lates;": "⪭︀",
  	"lBarr;": "⤎",
  	"lbarr;": "⤌",
  	"lbbrk;": "❲",
  	"lbrace;": "{",
  	"lbrack;": "[",
  	"lbrke;": "⦋",
  	"lbrksld;": "⦏",
  	"lbrkslu;": "⦍",
  	"Lcaron;": "Ľ",
  	"lcaron;": "ľ",
  	"Lcedil;": "Ļ",
  	"lcedil;": "ļ",
  	"lceil;": "⌈",
  	"lcub;": "{",
  	"Lcy;": "Л",
  	"lcy;": "л",
  	"ldca;": "⤶",
  	"ldquo;": "“",
  	"ldquor;": "„",
  	"ldrdhar;": "⥧",
  	"ldrushar;": "⥋",
  	"ldsh;": "↲",
  	"lE;": "≦",
  	"le;": "≤",
  	"LeftAngleBracket;": "⟨",
  	"LeftArrow;": "←",
  	"Leftarrow;": "⇐",
  	"leftarrow;": "←",
  	"LeftArrowBar;": "⇤",
  	"LeftArrowRightArrow;": "⇆",
  	"leftarrowtail;": "↢",
  	"LeftCeiling;": "⌈",
  	"LeftDoubleBracket;": "⟦",
  	"LeftDownTeeVector;": "⥡",
  	"LeftDownVector;": "⇃",
  	"LeftDownVectorBar;": "⥙",
  	"LeftFloor;": "⌊",
  	"leftharpoondown;": "↽",
  	"leftharpoonup;": "↼",
  	"leftleftarrows;": "⇇",
  	"LeftRightArrow;": "↔",
  	"Leftrightarrow;": "⇔",
  	"leftrightarrow;": "↔",
  	"leftrightarrows;": "⇆",
  	"leftrightharpoons;": "⇋",
  	"leftrightsquigarrow;": "↭",
  	"LeftRightVector;": "⥎",
  	"LeftTee;": "⊣",
  	"LeftTeeArrow;": "↤",
  	"LeftTeeVector;": "⥚",
  	"leftthreetimes;": "⋋",
  	"LeftTriangle;": "⊲",
  	"LeftTriangleBar;": "⧏",
  	"LeftTriangleEqual;": "⊴",
  	"LeftUpDownVector;": "⥑",
  	"LeftUpTeeVector;": "⥠",
  	"LeftUpVector;": "↿",
  	"LeftUpVectorBar;": "⥘",
  	"LeftVector;": "↼",
  	"LeftVectorBar;": "⥒",
  	"lEg;": "⪋",
  	"leg;": "⋚",
  	"leq;": "≤",
  	"leqq;": "≦",
  	"leqslant;": "⩽",
  	"les;": "⩽",
  	"lescc;": "⪨",
  	"lesdot;": "⩿",
  	"lesdoto;": "⪁",
  	"lesdotor;": "⪃",
  	"lesg;": "⋚︀",
  	"lesges;": "⪓",
  	"lessapprox;": "⪅",
  	"lessdot;": "⋖",
  	"lesseqgtr;": "⋚",
  	"lesseqqgtr;": "⪋",
  	"LessEqualGreater;": "⋚",
  	"LessFullEqual;": "≦",
  	"LessGreater;": "≶",
  	"lessgtr;": "≶",
  	"LessLess;": "⪡",
  	"lesssim;": "≲",
  	"LessSlantEqual;": "⩽",
  	"LessTilde;": "≲",
  	"lfisht;": "⥼",
  	"lfloor;": "⌊",
  	"Lfr;": "𝔏",
  	"lfr;": "𝔩",
  	"lg;": "≶",
  	"lgE;": "⪑",
  	"lHar;": "⥢",
  	"lhard;": "↽",
  	"lharu;": "↼",
  	"lharul;": "⥪",
  	"lhblk;": "▄",
  	"LJcy;": "Љ",
  	"ljcy;": "љ",
  	"Ll;": "⋘",
  	"ll;": "≪",
  	"llarr;": "⇇",
  	"llcorner;": "⌞",
  	"Lleftarrow;": "⇚",
  	"llhard;": "⥫",
  	"lltri;": "◺",
  	"Lmidot;": "Ŀ",
  	"lmidot;": "ŀ",
  	"lmoust;": "⎰",
  	"lmoustache;": "⎰",
  	"lnap;": "⪉",
  	"lnapprox;": "⪉",
  	"lnE;": "≨",
  	"lne;": "⪇",
  	"lneq;": "⪇",
  	"lneqq;": "≨",
  	"lnsim;": "⋦",
  	"loang;": "⟬",
  	"loarr;": "⇽",
  	"lobrk;": "⟦",
  	"LongLeftArrow;": "⟵",
  	"Longleftarrow;": "⟸",
  	"longleftarrow;": "⟵",
  	"LongLeftRightArrow;": "⟷",
  	"Longleftrightarrow;": "⟺",
  	"longleftrightarrow;": "⟷",
  	"longmapsto;": "⟼",
  	"LongRightArrow;": "⟶",
  	"Longrightarrow;": "⟹",
  	"longrightarrow;": "⟶",
  	"looparrowleft;": "↫",
  	"looparrowright;": "↬",
  	"lopar;": "⦅",
  	"Lopf;": "𝕃",
  	"lopf;": "𝕝",
  	"loplus;": "⨭",
  	"lotimes;": "⨴",
  	"lowast;": "∗",
  	"lowbar;": "_",
  	"LowerLeftArrow;": "↙",
  	"LowerRightArrow;": "↘",
  	"loz;": "◊",
  	"lozenge;": "◊",
  	"lozf;": "⧫",
  	"lpar;": "(",
  	"lparlt;": "⦓",
  	"lrarr;": "⇆",
  	"lrcorner;": "⌟",
  	"lrhar;": "⇋",
  	"lrhard;": "⥭",
  	"lrm;": "‎",
  	"lrtri;": "⊿",
  	"lsaquo;": "‹",
  	"Lscr;": "ℒ",
  	"lscr;": "𝓁",
  	"Lsh;": "↰",
  	"lsh;": "↰",
  	"lsim;": "≲",
  	"lsime;": "⪍",
  	"lsimg;": "⪏",
  	"lsqb;": "[",
  	"lsquo;": "‘",
  	"lsquor;": "‚",
  	"Lstrok;": "Ł",
  	"lstrok;": "ł",
  	"LT;": "<",
  	LT: LT,
  	"Lt;": "≪",
  	"lt;": "<",
  	lt: lt,
  	"ltcc;": "⪦",
  	"ltcir;": "⩹",
  	"ltdot;": "⋖",
  	"lthree;": "⋋",
  	"ltimes;": "⋉",
  	"ltlarr;": "⥶",
  	"ltquest;": "⩻",
  	"ltri;": "◃",
  	"ltrie;": "⊴",
  	"ltrif;": "◂",
  	"ltrPar;": "⦖",
  	"lurdshar;": "⥊",
  	"luruhar;": "⥦",
  	"lvertneqq;": "≨︀",
  	"lvnE;": "≨︀",
  	"macr;": "¯",
  	macr: macr,
  	"male;": "♂",
  	"malt;": "✠",
  	"maltese;": "✠",
  	"Map;": "⤅",
  	"map;": "↦",
  	"mapsto;": "↦",
  	"mapstodown;": "↧",
  	"mapstoleft;": "↤",
  	"mapstoup;": "↥",
  	"marker;": "▮",
  	"mcomma;": "⨩",
  	"Mcy;": "М",
  	"mcy;": "м",
  	"mdash;": "—",
  	"mDDot;": "∺",
  	"measuredangle;": "∡",
  	"MediumSpace;": " ",
  	"Mellintrf;": "ℳ",
  	"Mfr;": "𝔐",
  	"mfr;": "𝔪",
  	"mho;": "℧",
  	"micro;": "µ",
  	micro: micro,
  	"mid;": "∣",
  	"midast;": "*",
  	"midcir;": "⫰",
  	"middot;": "·",
  	middot: middot,
  	"minus;": "−",
  	"minusb;": "⊟",
  	"minusd;": "∸",
  	"minusdu;": "⨪",
  	"MinusPlus;": "∓",
  	"mlcp;": "⫛",
  	"mldr;": "…",
  	"mnplus;": "∓",
  	"models;": "⊧",
  	"Mopf;": "𝕄",
  	"mopf;": "𝕞",
  	"mp;": "∓",
  	"Mscr;": "ℳ",
  	"mscr;": "𝓂",
  	"mstpos;": "∾",
  	"Mu;": "Μ",
  	"mu;": "μ",
  	"multimap;": "⊸",
  	"mumap;": "⊸",
  	"nabla;": "∇",
  	"Nacute;": "Ń",
  	"nacute;": "ń",
  	"nang;": "∠⃒",
  	"nap;": "≉",
  	"napE;": "⩰̸",
  	"napid;": "≋̸",
  	"napos;": "ŉ",
  	"napprox;": "≉",
  	"natur;": "♮",
  	"natural;": "♮",
  	"naturals;": "ℕ",
  	"nbsp;": " ",
  	nbsp: nbsp,
  	"nbump;": "≎̸",
  	"nbumpe;": "≏̸",
  	"ncap;": "⩃",
  	"Ncaron;": "Ň",
  	"ncaron;": "ň",
  	"Ncedil;": "Ņ",
  	"ncedil;": "ņ",
  	"ncong;": "≇",
  	"ncongdot;": "⩭̸",
  	"ncup;": "⩂",
  	"Ncy;": "Н",
  	"ncy;": "н",
  	"ndash;": "–",
  	"ne;": "≠",
  	"nearhk;": "⤤",
  	"neArr;": "⇗",
  	"nearr;": "↗",
  	"nearrow;": "↗",
  	"nedot;": "≐̸",
  	"NegativeMediumSpace;": "​",
  	"NegativeThickSpace;": "​",
  	"NegativeThinSpace;": "​",
  	"NegativeVeryThinSpace;": "​",
  	"nequiv;": "≢",
  	"nesear;": "⤨",
  	"nesim;": "≂̸",
  	"NestedGreaterGreater;": "≫",
  	"NestedLessLess;": "≪",
  	"NewLine;": "\n",
  	"nexist;": "∄",
  	"nexists;": "∄",
  	"Nfr;": "𝔑",
  	"nfr;": "𝔫",
  	"ngE;": "≧̸",
  	"nge;": "≱",
  	"ngeq;": "≱",
  	"ngeqq;": "≧̸",
  	"ngeqslant;": "⩾̸",
  	"nges;": "⩾̸",
  	"nGg;": "⋙̸",
  	"ngsim;": "≵",
  	"nGt;": "≫⃒",
  	"ngt;": "≯",
  	"ngtr;": "≯",
  	"nGtv;": "≫̸",
  	"nhArr;": "⇎",
  	"nharr;": "↮",
  	"nhpar;": "⫲",
  	"ni;": "∋",
  	"nis;": "⋼",
  	"nisd;": "⋺",
  	"niv;": "∋",
  	"NJcy;": "Њ",
  	"njcy;": "њ",
  	"nlArr;": "⇍",
  	"nlarr;": "↚",
  	"nldr;": "‥",
  	"nlE;": "≦̸",
  	"nle;": "≰",
  	"nLeftarrow;": "⇍",
  	"nleftarrow;": "↚",
  	"nLeftrightarrow;": "⇎",
  	"nleftrightarrow;": "↮",
  	"nleq;": "≰",
  	"nleqq;": "≦̸",
  	"nleqslant;": "⩽̸",
  	"nles;": "⩽̸",
  	"nless;": "≮",
  	"nLl;": "⋘̸",
  	"nlsim;": "≴",
  	"nLt;": "≪⃒",
  	"nlt;": "≮",
  	"nltri;": "⋪",
  	"nltrie;": "⋬",
  	"nLtv;": "≪̸",
  	"nmid;": "∤",
  	"NoBreak;": "⁠",
  	"NonBreakingSpace;": " ",
  	"Nopf;": "ℕ",
  	"nopf;": "𝕟",
  	"Not;": "⫬",
  	"not;": "¬",
  	not: not,
  	"NotCongruent;": "≢",
  	"NotCupCap;": "≭",
  	"NotDoubleVerticalBar;": "∦",
  	"NotElement;": "∉",
  	"NotEqual;": "≠",
  	"NotEqualTilde;": "≂̸",
  	"NotExists;": "∄",
  	"NotGreater;": "≯",
  	"NotGreaterEqual;": "≱",
  	"NotGreaterFullEqual;": "≧̸",
  	"NotGreaterGreater;": "≫̸",
  	"NotGreaterLess;": "≹",
  	"NotGreaterSlantEqual;": "⩾̸",
  	"NotGreaterTilde;": "≵",
  	"NotHumpDownHump;": "≎̸",
  	"NotHumpEqual;": "≏̸",
  	"notin;": "∉",
  	"notindot;": "⋵̸",
  	"notinE;": "⋹̸",
  	"notinva;": "∉",
  	"notinvb;": "⋷",
  	"notinvc;": "⋶",
  	"NotLeftTriangle;": "⋪",
  	"NotLeftTriangleBar;": "⧏̸",
  	"NotLeftTriangleEqual;": "⋬",
  	"NotLess;": "≮",
  	"NotLessEqual;": "≰",
  	"NotLessGreater;": "≸",
  	"NotLessLess;": "≪̸",
  	"NotLessSlantEqual;": "⩽̸",
  	"NotLessTilde;": "≴",
  	"NotNestedGreaterGreater;": "⪢̸",
  	"NotNestedLessLess;": "⪡̸",
  	"notni;": "∌",
  	"notniva;": "∌",
  	"notnivb;": "⋾",
  	"notnivc;": "⋽",
  	"NotPrecedes;": "⊀",
  	"NotPrecedesEqual;": "⪯̸",
  	"NotPrecedesSlantEqual;": "⋠",
  	"NotReverseElement;": "∌",
  	"NotRightTriangle;": "⋫",
  	"NotRightTriangleBar;": "⧐̸",
  	"NotRightTriangleEqual;": "⋭",
  	"NotSquareSubset;": "⊏̸",
  	"NotSquareSubsetEqual;": "⋢",
  	"NotSquareSuperset;": "⊐̸",
  	"NotSquareSupersetEqual;": "⋣",
  	"NotSubset;": "⊂⃒",
  	"NotSubsetEqual;": "⊈",
  	"NotSucceeds;": "⊁",
  	"NotSucceedsEqual;": "⪰̸",
  	"NotSucceedsSlantEqual;": "⋡",
  	"NotSucceedsTilde;": "≿̸",
  	"NotSuperset;": "⊃⃒",
  	"NotSupersetEqual;": "⊉",
  	"NotTilde;": "≁",
  	"NotTildeEqual;": "≄",
  	"NotTildeFullEqual;": "≇",
  	"NotTildeTilde;": "≉",
  	"NotVerticalBar;": "∤",
  	"npar;": "∦",
  	"nparallel;": "∦",
  	"nparsl;": "⫽⃥",
  	"npart;": "∂̸",
  	"npolint;": "⨔",
  	"npr;": "⊀",
  	"nprcue;": "⋠",
  	"npre;": "⪯̸",
  	"nprec;": "⊀",
  	"npreceq;": "⪯̸",
  	"nrArr;": "⇏",
  	"nrarr;": "↛",
  	"nrarrc;": "⤳̸",
  	"nrarrw;": "↝̸",
  	"nRightarrow;": "⇏",
  	"nrightarrow;": "↛",
  	"nrtri;": "⋫",
  	"nrtrie;": "⋭",
  	"nsc;": "⊁",
  	"nsccue;": "⋡",
  	"nsce;": "⪰̸",
  	"Nscr;": "𝒩",
  	"nscr;": "𝓃",
  	"nshortmid;": "∤",
  	"nshortparallel;": "∦",
  	"nsim;": "≁",
  	"nsime;": "≄",
  	"nsimeq;": "≄",
  	"nsmid;": "∤",
  	"nspar;": "∦",
  	"nsqsube;": "⋢",
  	"nsqsupe;": "⋣",
  	"nsub;": "⊄",
  	"nsubE;": "⫅̸",
  	"nsube;": "⊈",
  	"nsubset;": "⊂⃒",
  	"nsubseteq;": "⊈",
  	"nsubseteqq;": "⫅̸",
  	"nsucc;": "⊁",
  	"nsucceq;": "⪰̸",
  	"nsup;": "⊅",
  	"nsupE;": "⫆̸",
  	"nsupe;": "⊉",
  	"nsupset;": "⊃⃒",
  	"nsupseteq;": "⊉",
  	"nsupseteqq;": "⫆̸",
  	"ntgl;": "≹",
  	"Ntilde;": "Ñ",
  	Ntilde: Ntilde,
  	"ntilde;": "ñ",
  	ntilde: ntilde,
  	"ntlg;": "≸",
  	"ntriangleleft;": "⋪",
  	"ntrianglelefteq;": "⋬",
  	"ntriangleright;": "⋫",
  	"ntrianglerighteq;": "⋭",
  	"Nu;": "Ν",
  	"nu;": "ν",
  	"num;": "#",
  	"numero;": "№",
  	"numsp;": " ",
  	"nvap;": "≍⃒",
  	"nVDash;": "⊯",
  	"nVdash;": "⊮",
  	"nvDash;": "⊭",
  	"nvdash;": "⊬",
  	"nvge;": "≥⃒",
  	"nvgt;": ">⃒",
  	"nvHarr;": "⤄",
  	"nvinfin;": "⧞",
  	"nvlArr;": "⤂",
  	"nvle;": "≤⃒",
  	"nvlt;": "<⃒",
  	"nvltrie;": "⊴⃒",
  	"nvrArr;": "⤃",
  	"nvrtrie;": "⊵⃒",
  	"nvsim;": "∼⃒",
  	"nwarhk;": "⤣",
  	"nwArr;": "⇖",
  	"nwarr;": "↖",
  	"nwarrow;": "↖",
  	"nwnear;": "⤧",
  	"Oacute;": "Ó",
  	Oacute: Oacute,
  	"oacute;": "ó",
  	oacute: oacute,
  	"oast;": "⊛",
  	"ocir;": "⊚",
  	"Ocirc;": "Ô",
  	Ocirc: Ocirc,
  	"ocirc;": "ô",
  	ocirc: ocirc,
  	"Ocy;": "О",
  	"ocy;": "о",
  	"odash;": "⊝",
  	"Odblac;": "Ő",
  	"odblac;": "ő",
  	"odiv;": "⨸",
  	"odot;": "⊙",
  	"odsold;": "⦼",
  	"OElig;": "Œ",
  	"oelig;": "œ",
  	"ofcir;": "⦿",
  	"Ofr;": "𝔒",
  	"ofr;": "𝔬",
  	"ogon;": "˛",
  	"Ograve;": "Ò",
  	Ograve: Ograve,
  	"ograve;": "ò",
  	ograve: ograve,
  	"ogt;": "⧁",
  	"ohbar;": "⦵",
  	"ohm;": "Ω",
  	"oint;": "∮",
  	"olarr;": "↺",
  	"olcir;": "⦾",
  	"olcross;": "⦻",
  	"oline;": "‾",
  	"olt;": "⧀",
  	"Omacr;": "Ō",
  	"omacr;": "ō",
  	"Omega;": "Ω",
  	"omega;": "ω",
  	"Omicron;": "Ο",
  	"omicron;": "ο",
  	"omid;": "⦶",
  	"ominus;": "⊖",
  	"Oopf;": "𝕆",
  	"oopf;": "𝕠",
  	"opar;": "⦷",
  	"OpenCurlyDoubleQuote;": "“",
  	"OpenCurlyQuote;": "‘",
  	"operp;": "⦹",
  	"oplus;": "⊕",
  	"Or;": "⩔",
  	"or;": "∨",
  	"orarr;": "↻",
  	"ord;": "⩝",
  	"order;": "ℴ",
  	"orderof;": "ℴ",
  	"ordf;": "ª",
  	ordf: ordf,
  	"ordm;": "º",
  	ordm: ordm,
  	"origof;": "⊶",
  	"oror;": "⩖",
  	"orslope;": "⩗",
  	"orv;": "⩛",
  	"oS;": "Ⓢ",
  	"Oscr;": "𝒪",
  	"oscr;": "ℴ",
  	"Oslash;": "Ø",
  	Oslash: Oslash,
  	"oslash;": "ø",
  	oslash: oslash,
  	"osol;": "⊘",
  	"Otilde;": "Õ",
  	Otilde: Otilde,
  	"otilde;": "õ",
  	otilde: otilde,
  	"Otimes;": "⨷",
  	"otimes;": "⊗",
  	"otimesas;": "⨶",
  	"Ouml;": "Ö",
  	Ouml: Ouml,
  	"ouml;": "ö",
  	ouml: ouml,
  	"ovbar;": "⌽",
  	"OverBar;": "‾",
  	"OverBrace;": "⏞",
  	"OverBracket;": "⎴",
  	"OverParenthesis;": "⏜",
  	"par;": "∥",
  	"para;": "¶",
  	para: para,
  	"parallel;": "∥",
  	"parsim;": "⫳",
  	"parsl;": "⫽",
  	"part;": "∂",
  	"PartialD;": "∂",
  	"Pcy;": "П",
  	"pcy;": "п",
  	"percnt;": "%",
  	"period;": ".",
  	"permil;": "‰",
  	"perp;": "⊥",
  	"pertenk;": "‱",
  	"Pfr;": "𝔓",
  	"pfr;": "𝔭",
  	"Phi;": "Φ",
  	"phi;": "φ",
  	"phiv;": "ϕ",
  	"phmmat;": "ℳ",
  	"phone;": "☎",
  	"Pi;": "Π",
  	"pi;": "π",
  	"pitchfork;": "⋔",
  	"piv;": "ϖ",
  	"planck;": "ℏ",
  	"planckh;": "ℎ",
  	"plankv;": "ℏ",
  	"plus;": "+",
  	"plusacir;": "⨣",
  	"plusb;": "⊞",
  	"pluscir;": "⨢",
  	"plusdo;": "∔",
  	"plusdu;": "⨥",
  	"pluse;": "⩲",
  	"PlusMinus;": "±",
  	"plusmn;": "±",
  	plusmn: plusmn,
  	"plussim;": "⨦",
  	"plustwo;": "⨧",
  	"pm;": "±",
  	"Poincareplane;": "ℌ",
  	"pointint;": "⨕",
  	"Popf;": "ℙ",
  	"popf;": "𝕡",
  	"pound;": "£",
  	pound: pound,
  	"Pr;": "⪻",
  	"pr;": "≺",
  	"prap;": "⪷",
  	"prcue;": "≼",
  	"prE;": "⪳",
  	"pre;": "⪯",
  	"prec;": "≺",
  	"precapprox;": "⪷",
  	"preccurlyeq;": "≼",
  	"Precedes;": "≺",
  	"PrecedesEqual;": "⪯",
  	"PrecedesSlantEqual;": "≼",
  	"PrecedesTilde;": "≾",
  	"preceq;": "⪯",
  	"precnapprox;": "⪹",
  	"precneqq;": "⪵",
  	"precnsim;": "⋨",
  	"precsim;": "≾",
  	"Prime;": "″",
  	"prime;": "′",
  	"primes;": "ℙ",
  	"prnap;": "⪹",
  	"prnE;": "⪵",
  	"prnsim;": "⋨",
  	"prod;": "∏",
  	"Product;": "∏",
  	"profalar;": "⌮",
  	"profline;": "⌒",
  	"profsurf;": "⌓",
  	"prop;": "∝",
  	"Proportion;": "∷",
  	"Proportional;": "∝",
  	"propto;": "∝",
  	"prsim;": "≾",
  	"prurel;": "⊰",
  	"Pscr;": "𝒫",
  	"pscr;": "𝓅",
  	"Psi;": "Ψ",
  	"psi;": "ψ",
  	"puncsp;": " ",
  	"Qfr;": "𝔔",
  	"qfr;": "𝔮",
  	"qint;": "⨌",
  	"Qopf;": "ℚ",
  	"qopf;": "𝕢",
  	"qprime;": "⁗",
  	"Qscr;": "𝒬",
  	"qscr;": "𝓆",
  	"quaternions;": "ℍ",
  	"quatint;": "⨖",
  	"quest;": "?",
  	"questeq;": "≟",
  	"QUOT;": "\"",
  	QUOT: QUOT,
  	"quot;": "\"",
  	quot: quot,
  	"rAarr;": "⇛",
  	"race;": "∽̱",
  	"Racute;": "Ŕ",
  	"racute;": "ŕ",
  	"radic;": "√",
  	"raemptyv;": "⦳",
  	"Rang;": "⟫",
  	"rang;": "⟩",
  	"rangd;": "⦒",
  	"range;": "⦥",
  	"rangle;": "⟩",
  	"raquo;": "»",
  	raquo: raquo,
  	"Rarr;": "↠",
  	"rArr;": "⇒",
  	"rarr;": "→",
  	"rarrap;": "⥵",
  	"rarrb;": "⇥",
  	"rarrbfs;": "⤠",
  	"rarrc;": "⤳",
  	"rarrfs;": "⤞",
  	"rarrhk;": "↪",
  	"rarrlp;": "↬",
  	"rarrpl;": "⥅",
  	"rarrsim;": "⥴",
  	"Rarrtl;": "⤖",
  	"rarrtl;": "↣",
  	"rarrw;": "↝",
  	"rAtail;": "⤜",
  	"ratail;": "⤚",
  	"ratio;": "∶",
  	"rationals;": "ℚ",
  	"RBarr;": "⤐",
  	"rBarr;": "⤏",
  	"rbarr;": "⤍",
  	"rbbrk;": "❳",
  	"rbrace;": "}",
  	"rbrack;": "]",
  	"rbrke;": "⦌",
  	"rbrksld;": "⦎",
  	"rbrkslu;": "⦐",
  	"Rcaron;": "Ř",
  	"rcaron;": "ř",
  	"Rcedil;": "Ŗ",
  	"rcedil;": "ŗ",
  	"rceil;": "⌉",
  	"rcub;": "}",
  	"Rcy;": "Р",
  	"rcy;": "р",
  	"rdca;": "⤷",
  	"rdldhar;": "⥩",
  	"rdquo;": "”",
  	"rdquor;": "”",
  	"rdsh;": "↳",
  	"Re;": "ℜ",
  	"real;": "ℜ",
  	"realine;": "ℛ",
  	"realpart;": "ℜ",
  	"reals;": "ℝ",
  	"rect;": "▭",
  	"REG;": "®",
  	REG: REG,
  	"reg;": "®",
  	reg: reg,
  	"ReverseElement;": "∋",
  	"ReverseEquilibrium;": "⇋",
  	"ReverseUpEquilibrium;": "⥯",
  	"rfisht;": "⥽",
  	"rfloor;": "⌋",
  	"Rfr;": "ℜ",
  	"rfr;": "𝔯",
  	"rHar;": "⥤",
  	"rhard;": "⇁",
  	"rharu;": "⇀",
  	"rharul;": "⥬",
  	"Rho;": "Ρ",
  	"rho;": "ρ",
  	"rhov;": "ϱ",
  	"RightAngleBracket;": "⟩",
  	"RightArrow;": "→",
  	"Rightarrow;": "⇒",
  	"rightarrow;": "→",
  	"RightArrowBar;": "⇥",
  	"RightArrowLeftArrow;": "⇄",
  	"rightarrowtail;": "↣",
  	"RightCeiling;": "⌉",
  	"RightDoubleBracket;": "⟧",
  	"RightDownTeeVector;": "⥝",
  	"RightDownVector;": "⇂",
  	"RightDownVectorBar;": "⥕",
  	"RightFloor;": "⌋",
  	"rightharpoondown;": "⇁",
  	"rightharpoonup;": "⇀",
  	"rightleftarrows;": "⇄",
  	"rightleftharpoons;": "⇌",
  	"rightrightarrows;": "⇉",
  	"rightsquigarrow;": "↝",
  	"RightTee;": "⊢",
  	"RightTeeArrow;": "↦",
  	"RightTeeVector;": "⥛",
  	"rightthreetimes;": "⋌",
  	"RightTriangle;": "⊳",
  	"RightTriangleBar;": "⧐",
  	"RightTriangleEqual;": "⊵",
  	"RightUpDownVector;": "⥏",
  	"RightUpTeeVector;": "⥜",
  	"RightUpVector;": "↾",
  	"RightUpVectorBar;": "⥔",
  	"RightVector;": "⇀",
  	"RightVectorBar;": "⥓",
  	"ring;": "˚",
  	"risingdotseq;": "≓",
  	"rlarr;": "⇄",
  	"rlhar;": "⇌",
  	"rlm;": "‏",
  	"rmoust;": "⎱",
  	"rmoustache;": "⎱",
  	"rnmid;": "⫮",
  	"roang;": "⟭",
  	"roarr;": "⇾",
  	"robrk;": "⟧",
  	"ropar;": "⦆",
  	"Ropf;": "ℝ",
  	"ropf;": "𝕣",
  	"roplus;": "⨮",
  	"rotimes;": "⨵",
  	"RoundImplies;": "⥰",
  	"rpar;": ")",
  	"rpargt;": "⦔",
  	"rppolint;": "⨒",
  	"rrarr;": "⇉",
  	"Rrightarrow;": "⇛",
  	"rsaquo;": "›",
  	"Rscr;": "ℛ",
  	"rscr;": "𝓇",
  	"Rsh;": "↱",
  	"rsh;": "↱",
  	"rsqb;": "]",
  	"rsquo;": "’",
  	"rsquor;": "’",
  	"rthree;": "⋌",
  	"rtimes;": "⋊",
  	"rtri;": "▹",
  	"rtrie;": "⊵",
  	"rtrif;": "▸",
  	"rtriltri;": "⧎",
  	"RuleDelayed;": "⧴",
  	"ruluhar;": "⥨",
  	"rx;": "℞",
  	"Sacute;": "Ś",
  	"sacute;": "ś",
  	"sbquo;": "‚",
  	"Sc;": "⪼",
  	"sc;": "≻",
  	"scap;": "⪸",
  	"Scaron;": "Š",
  	"scaron;": "š",
  	"sccue;": "≽",
  	"scE;": "⪴",
  	"sce;": "⪰",
  	"Scedil;": "Ş",
  	"scedil;": "ş",
  	"Scirc;": "Ŝ",
  	"scirc;": "ŝ",
  	"scnap;": "⪺",
  	"scnE;": "⪶",
  	"scnsim;": "⋩",
  	"scpolint;": "⨓",
  	"scsim;": "≿",
  	"Scy;": "С",
  	"scy;": "с",
  	"sdot;": "⋅",
  	"sdotb;": "⊡",
  	"sdote;": "⩦",
  	"searhk;": "⤥",
  	"seArr;": "⇘",
  	"searr;": "↘",
  	"searrow;": "↘",
  	"sect;": "§",
  	sect: sect,
  	"semi;": ";",
  	"seswar;": "⤩",
  	"setminus;": "∖",
  	"setmn;": "∖",
  	"sext;": "✶",
  	"Sfr;": "𝔖",
  	"sfr;": "𝔰",
  	"sfrown;": "⌢",
  	"sharp;": "♯",
  	"SHCHcy;": "Щ",
  	"shchcy;": "щ",
  	"SHcy;": "Ш",
  	"shcy;": "ш",
  	"ShortDownArrow;": "↓",
  	"ShortLeftArrow;": "←",
  	"shortmid;": "∣",
  	"shortparallel;": "∥",
  	"ShortRightArrow;": "→",
  	"ShortUpArrow;": "↑",
  	"shy;": "­",
  	shy: shy,
  	"Sigma;": "Σ",
  	"sigma;": "σ",
  	"sigmaf;": "ς",
  	"sigmav;": "ς",
  	"sim;": "∼",
  	"simdot;": "⩪",
  	"sime;": "≃",
  	"simeq;": "≃",
  	"simg;": "⪞",
  	"simgE;": "⪠",
  	"siml;": "⪝",
  	"simlE;": "⪟",
  	"simne;": "≆",
  	"simplus;": "⨤",
  	"simrarr;": "⥲",
  	"slarr;": "←",
  	"SmallCircle;": "∘",
  	"smallsetminus;": "∖",
  	"smashp;": "⨳",
  	"smeparsl;": "⧤",
  	"smid;": "∣",
  	"smile;": "⌣",
  	"smt;": "⪪",
  	"smte;": "⪬",
  	"smtes;": "⪬︀",
  	"SOFTcy;": "Ь",
  	"softcy;": "ь",
  	"sol;": "/",
  	"solb;": "⧄",
  	"solbar;": "⌿",
  	"Sopf;": "𝕊",
  	"sopf;": "𝕤",
  	"spades;": "♠",
  	"spadesuit;": "♠",
  	"spar;": "∥",
  	"sqcap;": "⊓",
  	"sqcaps;": "⊓︀",
  	"sqcup;": "⊔",
  	"sqcups;": "⊔︀",
  	"Sqrt;": "√",
  	"sqsub;": "⊏",
  	"sqsube;": "⊑",
  	"sqsubset;": "⊏",
  	"sqsubseteq;": "⊑",
  	"sqsup;": "⊐",
  	"sqsupe;": "⊒",
  	"sqsupset;": "⊐",
  	"sqsupseteq;": "⊒",
  	"squ;": "□",
  	"Square;": "□",
  	"square;": "□",
  	"SquareIntersection;": "⊓",
  	"SquareSubset;": "⊏",
  	"SquareSubsetEqual;": "⊑",
  	"SquareSuperset;": "⊐",
  	"SquareSupersetEqual;": "⊒",
  	"SquareUnion;": "⊔",
  	"squarf;": "▪",
  	"squf;": "▪",
  	"srarr;": "→",
  	"Sscr;": "𝒮",
  	"sscr;": "𝓈",
  	"ssetmn;": "∖",
  	"ssmile;": "⌣",
  	"sstarf;": "⋆",
  	"Star;": "⋆",
  	"star;": "☆",
  	"starf;": "★",
  	"straightepsilon;": "ϵ",
  	"straightphi;": "ϕ",
  	"strns;": "¯",
  	"Sub;": "⋐",
  	"sub;": "⊂",
  	"subdot;": "⪽",
  	"subE;": "⫅",
  	"sube;": "⊆",
  	"subedot;": "⫃",
  	"submult;": "⫁",
  	"subnE;": "⫋",
  	"subne;": "⊊",
  	"subplus;": "⪿",
  	"subrarr;": "⥹",
  	"Subset;": "⋐",
  	"subset;": "⊂",
  	"subseteq;": "⊆",
  	"subseteqq;": "⫅",
  	"SubsetEqual;": "⊆",
  	"subsetneq;": "⊊",
  	"subsetneqq;": "⫋",
  	"subsim;": "⫇",
  	"subsub;": "⫕",
  	"subsup;": "⫓",
  	"succ;": "≻",
  	"succapprox;": "⪸",
  	"succcurlyeq;": "≽",
  	"Succeeds;": "≻",
  	"SucceedsEqual;": "⪰",
  	"SucceedsSlantEqual;": "≽",
  	"SucceedsTilde;": "≿",
  	"succeq;": "⪰",
  	"succnapprox;": "⪺",
  	"succneqq;": "⪶",
  	"succnsim;": "⋩",
  	"succsim;": "≿",
  	"SuchThat;": "∋",
  	"Sum;": "∑",
  	"sum;": "∑",
  	"sung;": "♪",
  	"Sup;": "⋑",
  	"sup;": "⊃",
  	"sup1;": "¹",
  	sup1: sup1,
  	"sup2;": "²",
  	sup2: sup2,
  	"sup3;": "³",
  	sup3: sup3,
  	"supdot;": "⪾",
  	"supdsub;": "⫘",
  	"supE;": "⫆",
  	"supe;": "⊇",
  	"supedot;": "⫄",
  	"Superset;": "⊃",
  	"SupersetEqual;": "⊇",
  	"suphsol;": "⟉",
  	"suphsub;": "⫗",
  	"suplarr;": "⥻",
  	"supmult;": "⫂",
  	"supnE;": "⫌",
  	"supne;": "⊋",
  	"supplus;": "⫀",
  	"Supset;": "⋑",
  	"supset;": "⊃",
  	"supseteq;": "⊇",
  	"supseteqq;": "⫆",
  	"supsetneq;": "⊋",
  	"supsetneqq;": "⫌",
  	"supsim;": "⫈",
  	"supsub;": "⫔",
  	"supsup;": "⫖",
  	"swarhk;": "⤦",
  	"swArr;": "⇙",
  	"swarr;": "↙",
  	"swarrow;": "↙",
  	"swnwar;": "⤪",
  	"szlig;": "ß",
  	szlig: szlig,
  	"Tab;": "\t",
  	"target;": "⌖",
  	"Tau;": "Τ",
  	"tau;": "τ",
  	"tbrk;": "⎴",
  	"Tcaron;": "Ť",
  	"tcaron;": "ť",
  	"Tcedil;": "Ţ",
  	"tcedil;": "ţ",
  	"Tcy;": "Т",
  	"tcy;": "т",
  	"tdot;": "⃛",
  	"telrec;": "⌕",
  	"Tfr;": "𝔗",
  	"tfr;": "𝔱",
  	"there4;": "∴",
  	"Therefore;": "∴",
  	"therefore;": "∴",
  	"Theta;": "Θ",
  	"theta;": "θ",
  	"thetasym;": "ϑ",
  	"thetav;": "ϑ",
  	"thickapprox;": "≈",
  	"thicksim;": "∼",
  	"ThickSpace;": "  ",
  	"thinsp;": " ",
  	"ThinSpace;": " ",
  	"thkap;": "≈",
  	"thksim;": "∼",
  	"THORN;": "Þ",
  	THORN: THORN,
  	"thorn;": "þ",
  	thorn: thorn,
  	"Tilde;": "∼",
  	"tilde;": "˜",
  	"TildeEqual;": "≃",
  	"TildeFullEqual;": "≅",
  	"TildeTilde;": "≈",
  	"times;": "×",
  	times: times,
  	"timesb;": "⊠",
  	"timesbar;": "⨱",
  	"timesd;": "⨰",
  	"tint;": "∭",
  	"toea;": "⤨",
  	"top;": "⊤",
  	"topbot;": "⌶",
  	"topcir;": "⫱",
  	"Topf;": "𝕋",
  	"topf;": "𝕥",
  	"topfork;": "⫚",
  	"tosa;": "⤩",
  	"tprime;": "‴",
  	"TRADE;": "™",
  	"trade;": "™",
  	"triangle;": "▵",
  	"triangledown;": "▿",
  	"triangleleft;": "◃",
  	"trianglelefteq;": "⊴",
  	"triangleq;": "≜",
  	"triangleright;": "▹",
  	"trianglerighteq;": "⊵",
  	"tridot;": "◬",
  	"trie;": "≜",
  	"triminus;": "⨺",
  	"TripleDot;": "⃛",
  	"triplus;": "⨹",
  	"trisb;": "⧍",
  	"tritime;": "⨻",
  	"trpezium;": "⏢",
  	"Tscr;": "𝒯",
  	"tscr;": "𝓉",
  	"TScy;": "Ц",
  	"tscy;": "ц",
  	"TSHcy;": "Ћ",
  	"tshcy;": "ћ",
  	"Tstrok;": "Ŧ",
  	"tstrok;": "ŧ",
  	"twixt;": "≬",
  	"twoheadleftarrow;": "↞",
  	"twoheadrightarrow;": "↠",
  	"Uacute;": "Ú",
  	Uacute: Uacute,
  	"uacute;": "ú",
  	uacute: uacute,
  	"Uarr;": "↟",
  	"uArr;": "⇑",
  	"uarr;": "↑",
  	"Uarrocir;": "⥉",
  	"Ubrcy;": "Ў",
  	"ubrcy;": "ў",
  	"Ubreve;": "Ŭ",
  	"ubreve;": "ŭ",
  	"Ucirc;": "Û",
  	Ucirc: Ucirc,
  	"ucirc;": "û",
  	ucirc: ucirc,
  	"Ucy;": "У",
  	"ucy;": "у",
  	"udarr;": "⇅",
  	"Udblac;": "Ű",
  	"udblac;": "ű",
  	"udhar;": "⥮",
  	"ufisht;": "⥾",
  	"Ufr;": "𝔘",
  	"ufr;": "𝔲",
  	"Ugrave;": "Ù",
  	Ugrave: Ugrave,
  	"ugrave;": "ù",
  	ugrave: ugrave,
  	"uHar;": "⥣",
  	"uharl;": "↿",
  	"uharr;": "↾",
  	"uhblk;": "▀",
  	"ulcorn;": "⌜",
  	"ulcorner;": "⌜",
  	"ulcrop;": "⌏",
  	"ultri;": "◸",
  	"Umacr;": "Ū",
  	"umacr;": "ū",
  	"uml;": "¨",
  	uml: uml,
  	"UnderBar;": "_",
  	"UnderBrace;": "⏟",
  	"UnderBracket;": "⎵",
  	"UnderParenthesis;": "⏝",
  	"Union;": "⋃",
  	"UnionPlus;": "⊎",
  	"Uogon;": "Ų",
  	"uogon;": "ų",
  	"Uopf;": "𝕌",
  	"uopf;": "𝕦",
  	"UpArrow;": "↑",
  	"Uparrow;": "⇑",
  	"uparrow;": "↑",
  	"UpArrowBar;": "⤒",
  	"UpArrowDownArrow;": "⇅",
  	"UpDownArrow;": "↕",
  	"Updownarrow;": "⇕",
  	"updownarrow;": "↕",
  	"UpEquilibrium;": "⥮",
  	"upharpoonleft;": "↿",
  	"upharpoonright;": "↾",
  	"uplus;": "⊎",
  	"UpperLeftArrow;": "↖",
  	"UpperRightArrow;": "↗",
  	"Upsi;": "ϒ",
  	"upsi;": "υ",
  	"upsih;": "ϒ",
  	"Upsilon;": "Υ",
  	"upsilon;": "υ",
  	"UpTee;": "⊥",
  	"UpTeeArrow;": "↥",
  	"upuparrows;": "⇈",
  	"urcorn;": "⌝",
  	"urcorner;": "⌝",
  	"urcrop;": "⌎",
  	"Uring;": "Ů",
  	"uring;": "ů",
  	"urtri;": "◹",
  	"Uscr;": "𝒰",
  	"uscr;": "𝓊",
  	"utdot;": "⋰",
  	"Utilde;": "Ũ",
  	"utilde;": "ũ",
  	"utri;": "▵",
  	"utrif;": "▴",
  	"uuarr;": "⇈",
  	"Uuml;": "Ü",
  	Uuml: Uuml,
  	"uuml;": "ü",
  	uuml: uuml,
  	"uwangle;": "⦧",
  	"vangrt;": "⦜",
  	"varepsilon;": "ϵ",
  	"varkappa;": "ϰ",
  	"varnothing;": "∅",
  	"varphi;": "ϕ",
  	"varpi;": "ϖ",
  	"varpropto;": "∝",
  	"vArr;": "⇕",
  	"varr;": "↕",
  	"varrho;": "ϱ",
  	"varsigma;": "ς",
  	"varsubsetneq;": "⊊︀",
  	"varsubsetneqq;": "⫋︀",
  	"varsupsetneq;": "⊋︀",
  	"varsupsetneqq;": "⫌︀",
  	"vartheta;": "ϑ",
  	"vartriangleleft;": "⊲",
  	"vartriangleright;": "⊳",
  	"Vbar;": "⫫",
  	"vBar;": "⫨",
  	"vBarv;": "⫩",
  	"Vcy;": "В",
  	"vcy;": "в",
  	"VDash;": "⊫",
  	"Vdash;": "⊩",
  	"vDash;": "⊨",
  	"vdash;": "⊢",
  	"Vdashl;": "⫦",
  	"Vee;": "⋁",
  	"vee;": "∨",
  	"veebar;": "⊻",
  	"veeeq;": "≚",
  	"vellip;": "⋮",
  	"Verbar;": "‖",
  	"verbar;": "|",
  	"Vert;": "‖",
  	"vert;": "|",
  	"VerticalBar;": "∣",
  	"VerticalLine;": "|",
  	"VerticalSeparator;": "❘",
  	"VerticalTilde;": "≀",
  	"VeryThinSpace;": " ",
  	"Vfr;": "𝔙",
  	"vfr;": "𝔳",
  	"vltri;": "⊲",
  	"vnsub;": "⊂⃒",
  	"vnsup;": "⊃⃒",
  	"Vopf;": "𝕍",
  	"vopf;": "𝕧",
  	"vprop;": "∝",
  	"vrtri;": "⊳",
  	"Vscr;": "𝒱",
  	"vscr;": "𝓋",
  	"vsubnE;": "⫋︀",
  	"vsubne;": "⊊︀",
  	"vsupnE;": "⫌︀",
  	"vsupne;": "⊋︀",
  	"Vvdash;": "⊪",
  	"vzigzag;": "⦚",
  	"Wcirc;": "Ŵ",
  	"wcirc;": "ŵ",
  	"wedbar;": "⩟",
  	"Wedge;": "⋀",
  	"wedge;": "∧",
  	"wedgeq;": "≙",
  	"weierp;": "℘",
  	"Wfr;": "𝔚",
  	"wfr;": "𝔴",
  	"Wopf;": "𝕎",
  	"wopf;": "𝕨",
  	"wp;": "℘",
  	"wr;": "≀",
  	"wreath;": "≀",
  	"Wscr;": "𝒲",
  	"wscr;": "𝓌",
  	"xcap;": "⋂",
  	"xcirc;": "◯",
  	"xcup;": "⋃",
  	"xdtri;": "▽",
  	"Xfr;": "𝔛",
  	"xfr;": "𝔵",
  	"xhArr;": "⟺",
  	"xharr;": "⟷",
  	"Xi;": "Ξ",
  	"xi;": "ξ",
  	"xlArr;": "⟸",
  	"xlarr;": "⟵",
  	"xmap;": "⟼",
  	"xnis;": "⋻",
  	"xodot;": "⨀",
  	"Xopf;": "𝕏",
  	"xopf;": "𝕩",
  	"xoplus;": "⨁",
  	"xotime;": "⨂",
  	"xrArr;": "⟹",
  	"xrarr;": "⟶",
  	"Xscr;": "𝒳",
  	"xscr;": "𝓍",
  	"xsqcup;": "⨆",
  	"xuplus;": "⨄",
  	"xutri;": "△",
  	"xvee;": "⋁",
  	"xwedge;": "⋀",
  	"Yacute;": "Ý",
  	Yacute: Yacute,
  	"yacute;": "ý",
  	yacute: yacute,
  	"YAcy;": "Я",
  	"yacy;": "я",
  	"Ycirc;": "Ŷ",
  	"ycirc;": "ŷ",
  	"Ycy;": "Ы",
  	"ycy;": "ы",
  	"yen;": "¥",
  	yen: yen,
  	"Yfr;": "𝔜",
  	"yfr;": "𝔶",
  	"YIcy;": "Ї",
  	"yicy;": "ї",
  	"Yopf;": "𝕐",
  	"yopf;": "𝕪",
  	"Yscr;": "𝒴",
  	"yscr;": "𝓎",
  	"YUcy;": "Ю",
  	"yucy;": "ю",
  	"Yuml;": "Ÿ",
  	"yuml;": "ÿ",
  	yuml: yuml,
  	"Zacute;": "Ź",
  	"zacute;": "ź",
  	"Zcaron;": "Ž",
  	"zcaron;": "ž",
  	"Zcy;": "З",
  	"zcy;": "з",
  	"Zdot;": "Ż",
  	"zdot;": "ż",
  	"zeetrf;": "ℨ",
  	"ZeroWidthSpace;": "​",
  	"Zeta;": "Ζ",
  	"zeta;": "ζ",
  	"Zfr;": "ℨ",
  	"zfr;": "𝔷",
  	"ZHcy;": "Ж",
  	"zhcy;": "ж",
  	"zigrarr;": "⇝",
  	"Zopf;": "ℤ",
  	"zopf;": "𝕫",
  	"Zscr;": "𝒵",
  	"zscr;": "𝓏",
  	"zwj;": "‍",
  	"zwnj;": "‌"
  };

  var decode_1 = decode$1;

  function decode$1(str) {
    if (typeof str !== 'string') {
      throw new TypeError('Expected a String');
    }

    return str.replace(/&(#?[^;\W]+;?)/g, function (_, match) {
      var m;

      if (m = /^#(\d+);?$/.exec(match)) {
        return punycode$2.ucs2.encode([parseInt(m[1], 10)]);
      } else if (m = /^#[Xx]([A-Fa-f0-9]+);?/.exec(match)) {
        return punycode$2.ucs2.encode([parseInt(m[1], 16)]);
      } else {
        // named entity
        var hasSemi = /;$/.test(match);
        var withoutSemi = hasSemi ? match.replace(/;$/, '') : match;
        var target = entities[withoutSemi] || hasSemi && entities[match];

        if (typeof target === 'number') {
          return punycode$2.ucs2.encode([target]);
        } else if (typeof target === 'string') {
          return target;
        } else {
          return '&' + match;
        }
      }
    });
  }

  var encode$2 = encode_1;
  var decode$2 = decode_1;
  var ent = {
    encode: encode$2,
    decode: decode$2
  };

  var lodash_clonedeep = createCommonjsModule(function (module, exports) {
    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;
    /** Used to stand-in for `undefined` hash values. */

    var HASH_UNDEFINED = '__lodash_hash_undefined__';
    /** Used as references for various `Number` constants. */

    var MAX_SAFE_INTEGER = 9007199254740991;
    /** `Object#toString` result references. */

    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        promiseTag = '[object Promise]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        weakMapTag = '[object WeakMap]';
    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';
    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */

    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    /** Used to match `RegExp` flags from their coerced string values. */

    var reFlags = /\w*$/;
    /** Used to detect host constructors (Safari). */

    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    /** Used to detect unsigned integer values. */

    var reIsUint = /^(?:0|[1-9]\d*)$/;
    /** Used to identify `toStringTag` values supported by `_.clone`. */

    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    /** Detect free variable `global` from Node.js. */

    var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    /** Detect free variable `self`. */

    var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
    /** Used as a reference to the global object. */

    var root = freeGlobal || freeSelf || Function('return this')();
    /** Detect free variable `exports`. */

    var freeExports =  exports && !exports.nodeType && exports;
    /** Detect free variable `module`. */

    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
    /** Detect the popular CommonJS extension `module.exports`. */

    var moduleExports = freeModule && freeModule.exports === freeExports;
    /**
     * Adds the key-value `pair` to `map`.
     *
     * @private
     * @param {Object} map The map to modify.
     * @param {Array} pair The key-value pair to add.
     * @returns {Object} Returns `map`.
     */

    function addMapEntry(map, pair) {
      // Don't return `map.set` because it's not chainable in IE 11.
      map.set(pair[0], pair[1]);
      return map;
    }
    /**
     * Adds `value` to `set`.
     *
     * @private
     * @param {Object} set The set to modify.
     * @param {*} value The value to add.
     * @returns {Object} Returns `set`.
     */


    function addSetEntry(set, value) {
      // Don't return `set.add` because it's not chainable in IE 11.
      set.add(value);
      return set;
    }
    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */


    function arrayEach(array, iteratee) {
      var index = -1,
          length = array ? array.length : 0;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }

      return array;
    }
    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */


    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }

      return array;
    }
    /**
     * A specialized version of `_.reduce` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initAccum] Specify using the first element of `array` as
     *  the initial value.
     * @returns {*} Returns the accumulated value.
     */


    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1,
          length = array ? array.length : 0;

      if (initAccum && length) {
        accumulator = array[++index];
      }

      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }

      return accumulator;
    }
    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */


    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }

      return result;
    }
    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */


    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }
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
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */


    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);
      map.forEach(function (value, key) {
        result[++index] = [key, value];
      });
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
    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */


    function setToArray(set) {
      var index = -1,
          result = Array(set.size);
      set.forEach(function (value) {
        result[++index] = value;
      });
      return result;
    }
    /** Used for built-in method references. */


    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;
    /** Used to detect overreaching core-js shims. */

    var coreJsData = root['__core-js_shared__'];
    /** Used to detect methods masquerading as native. */

    var maskSrcKey = function () {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? 'Symbol(src)_1.' + uid : '';
    }();
    /** Used to resolve the decompiled source of functions. */


    var funcToString = funcProto.toString;
    /** Used to check objects for own properties. */

    var hasOwnProperty = objectProto.hasOwnProperty;
    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */

    var objectToString = objectProto.toString;
    /** Used to detect if a method is native. */

    var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
    /** Built-in value references. */

    var Buffer = moduleExports ? root.Buffer : undefined,
        _Symbol = root.Symbol,
        Uint8Array = root.Uint8Array,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice;
    /* Built-in method references for those with the same name as other `lodash` methods. */

    var nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeKeys = overArg(Object.keys, Object);
    /* Built-in method references that are verified to be native. */

    var DataView = getNative(root, 'DataView'),
        Map = getNative(root, 'Map'),
        Promise = getNative(root, 'Promise'),
        Set = getNative(root, 'Set'),
        WeakMap = getNative(root, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');
    /** Used to detect maps, sets, and weakmaps. */

    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);
    /** Used to convert symbols to primitives and strings. */

    var symbolProto = _Symbol ? _Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */

    function Hash(entries) {
      var index = -1,
          length = entries ? entries.length : 0;
      this.clear();

      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */


    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */


    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */


    function hashGet(key) {
      var data = this.__data__;

      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }

      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }
    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */


    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
    }
    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */


    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
      return this;
    } // Add methods to `Hash`.


    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */

    function ListCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;
      this.clear();

      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */


    function listCacheClear() {
      this.__data__ = [];
    }
    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */


    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }

      var lastIndex = data.length - 1;

      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }

      return true;
    }
    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */


    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);
      return index < 0 ? undefined : data[index][1];
    }
    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */


    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */


    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }

      return this;
    } // Add methods to `ListCache`.


    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */

    function MapCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;
      this.clear();

      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */


    function mapCacheClear() {
      this.__data__ = {
        'hash': new Hash(),
        'map': new (Map || ListCache)(),
        'string': new Hash()
      };
    }
    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */


    function mapCacheDelete(key) {
      return getMapData(this, key)['delete'](key);
    }
    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */


    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */


    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */


    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    } // Add methods to `MapCache`.


    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */

    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }
    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */


    function stackClear() {
      this.__data__ = new ListCache();
    }
    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */


    function stackDelete(key) {
      return this.__data__['delete'](key);
    }
    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */


    function stackGet(key) {
      return this.__data__.get(key);
    }
    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */


    function stackHas(key) {
      return this.__data__.has(key);
    }
    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */


    function stackSet(key, value) {
      var cache = this.__data__;

      if (cache instanceof ListCache) {
        var pairs = cache.__data__;

        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          return this;
        }

        cache = this.__data__ = new MapCache(pairs);
      }

      cache.set(key, value);
      return this;
    } // Add methods to `Stack`.


    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */

    function arrayLikeKeys(value, inherited) {
      // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
      // Safari 9 makes `arguments.length` enumerable in strict mode.
      var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length,
          skipIndexes = !!length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
          result.push(key);
        }
      }

      return result;
    }
    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */


    function assignValue(object, key, value) {
      var objValue = object[key];

      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
        object[key] = value;
      }
    }
    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */


    function assocIndexOf(array, key) {
      var length = array.length;

      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }

      return -1;
    }
    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */


    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }
    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {boolean} [isFull] Specify a clone including symbols.
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */


    function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
      var result;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }

      if (result !== undefined) {
        return result;
      }

      if (!isObject(value)) {
        return value;
      }

      var isArr = isArray(value);

      if (isArr) {
        result = initCloneArray(value);

        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }

        if (tag == objectTag || tag == argsTag || isFunc && !object) {
          if (isHostObject(value)) {
            return object ? value : {};
          }

          result = initCloneObject(isFunc ? {} : value);

          if (!isDeep) {
            return copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }

          result = initCloneByTag(value, tag, baseClone, isDeep);
        }
      } // Check for circular references and return its corresponding clone.


      stack || (stack = new Stack());
      var stacked = stack.get(value);

      if (stacked) {
        return stacked;
      }

      stack.set(value, result);

      if (!isArr) {
        var props = isFull ? getAllKeys(value) : keys(value);
      }

      arrayEach(props || value, function (subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        } // Recursively populate clone (susceptible to call stack limits).


        assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
      });
      return result;
    }
    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */


    function baseCreate(proto) {
      return isObject(proto) ? objectCreate(proto) : {};
    }
    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */


    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    /**
     * The base implementation of `getTag`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */


    function baseGetTag(value) {
      return objectToString.call(value);
    }
    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */


    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }

      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */


    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }

      var result = [];

      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }

      return result;
    }
    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */


    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }

      var result = new buffer.constructor(buffer.length);
      buffer.copy(result);
      return result;
    }
    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */


    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }
    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */


    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }
    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned map.
     */


    function cloneMap(map, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
      return arrayReduce(array, addMapEntry, new map.constructor());
    }
    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */


    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }
    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned set.
     */


    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
      return arrayReduce(array, addSetEntry, new set.constructor());
    }
    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */


    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }
    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */


    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */


    function copyArray(source, array) {
      var index = -1,
          length = source.length;
      array || (array = Array(length));

      while (++index < length) {
        array[index] = source[index];
      }

      return array;
    }
    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */


    function copyObject(source, props, object, customizer) {
      object || (object = {});
      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
        assignValue(object, key, newValue === undefined ? source[key] : newValue);
      }

      return object;
    }
    /**
     * Copies own symbol properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */


    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }
    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */


    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }
    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */


    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
    }
    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */


    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }
    /**
     * Creates an array of the own enumerable symbol properties of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */


    var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */

    var getTag = baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11,
    // for data views in Edge < 14, and promises in Node.js.

    if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function getTag(value) {
        var result = objectToString.call(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : undefined;

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;

            case mapCtorString:
              return mapTag;

            case promiseCtorString:
              return promiseTag;

            case setCtorString:
              return setTag;

            case weakMapCtorString:
              return weakMapTag;
          }
        }

        return result;
      };
    }
    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */


    function initCloneArray(array) {
      var length = array.length,
          result = array.constructor(length); // Add properties assigned by `RegExp#exec`.

      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }

      return result;
    }
    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */


    function initCloneObject(object) {
      return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */


    function initCloneByTag(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;

      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object, isDeep, cloneFunc);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object, isDeep, cloneFunc);

        case symbolTag:
          return cloneSymbol(object);
      }
    }
    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */


    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
    }
    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */


    function isKeyable(value) {
      var type = _typeof(value);

      return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
    }
    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */


    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */


    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
      return value === proto;
    }
    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to process.
     * @returns {string} Returns the source code.
     */


    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}

        try {
          return func + '';
        } catch (e) {}
      }

      return '';
    }
    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */


    function cloneDeep(value) {
      return baseClone(value, true, true);
    }
    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */


    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */


    function isArguments(value) {
      // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
      return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
    }
    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */


    var isArray = Array.isArray;
    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */

    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */


    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */


    var isBuffer = nativeIsBuffer || stubFalse;
    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */

    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8-9 which returns 'object' for typed array and other constructors.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }
    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */


    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */


    function isObject(value) {
      var type = _typeof(value);

      return !!value && (type == 'object' || type == 'function');
    }
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
      return !!value && _typeof(value) == 'object';
    }
    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */


    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */


    function stubArray() {
      return [];
    }
    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */


    function stubFalse() {
      return false;
    }

    module.exports = cloneDeep;
  });

  function rightMain(str, idx, stopAtNewlines) {
    if (typeof str !== "string" || !str.length) {
      return null;
    }

    if (!idx || typeof idx !== "number") {
      idx = 0;
    }

    if (!str[idx + 1]) {
      return null;
    }

    if (str[idx + 1] && (!stopAtNewlines && str[idx + 1].trim() || stopAtNewlines && (str[idx + 1].trim() || "\n\r".includes(str[idx + 1])))) {
      return idx + 1;
    }

    if (str[idx + 2] && (!stopAtNewlines && str[idx + 2].trim() || stopAtNewlines && (str[idx + 2].trim() || "\n\r".includes(str[idx + 2])))) {
      return idx + 2;
    }

    for (var i = idx + 1, len = str.length; i < len; i++) {
      if (str[i] && (!stopAtNewlines && str[i].trim() || stopAtNewlines && (str[i].trim() || "\n\r".includes(str[i])))) {
        return i;
      }
    }

    return null;
  }

  function right(str, idx) {
    return rightMain(str, idx, false);
  }

  function characterSuitableForNames(char) {
    return /[-_A-Za-z0-9]/.test(char);
  }

  function prepHopefullyAnArray(something, name) {
    if (!something) {
      return [];
    }

    if (Array.isArray(something)) {
      return something.filter(function (val) {
        return typeof val === "string" && val.trim();
      });
    }

    if (typeof something === "string") {
      return something.trim() ? [something] : [];
    }

    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_03] ".concat(name, " must be array containing zero or more strings or something falsey. Currently it's equal to: ").concat(something, ", that a type of ").concat(_typeof(something), "."));
  }

  function stripHtml(str, originalOpts) {
    // const
    // ===========================================================================
    var start = Date.now();
    var definitelyTagNames = new Set(["!doctype", "abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"]);
    var singleLetterTags = new Set(["a", "b", "i", "p", "q", "s", "u"]);
    var punctuation = new Set([".", ",", "?", ";", ")", "\u2026", '"', "\xBB"]); // \u00BB is &raquo; - guillemet - right angled quote
    // \u2026 is &hellip; - ellipsis

    var stripTogetherWithTheirContentsDefaults = new Set(["script", "style", "xml"]); // we'll gather opening tags from ranged-pairs here:

    var rangedOpeningTags = []; // we'll put tag locations here

    var allTagLocations = [];
    var filteredTagLocations = []; // variables
    // ===========================================================================
    // records the info about the suspected tag:

    var tag;

    function resetTag() {
      tag = {
        attributes: []
      };
    }

    resetTag(); // records the beginning of the current whitespace chunk:

    var chunkOfWhitespaceStartsAt = null; // records the beginning of the current chunk of spaces (strictly spaces-only):

    var chunkOfSpacesStartsAt = null; // temporary variable to assemble the attribute pieces:

    var attrObj = {}; // marker to store captured href, used in opts.dumpLinkHrefsNearby.enabled

    var hrefDump = {}; // 2 keys: "tagName" - where href was spotted, "hrefValue" - URL
    // used to insert extra things when pushing into ranges array

    var stringToInsertAfter = ""; // state flag

    var hrefInsertionActive; // marker to keep a note where does the whitespace chunk that follows closing bracket end.
    // It's necessary for opts.trimOnlySpaces when there's closing bracket, whitespace, non-space
    // whitespace character ("\n", "\t" etc), whitspace, end-of-file. Trim will kick in and will
    // try to trim up until the EOF, be we'll have to pull the end of trim back, back to the first
    // character of aforementioned non-space whitespace character sequence.
    // This variable will tell exactly where it is located.

    var spacesChunkWhichFollowsTheClosingBracketEndsAt = null; // functions
    // ===========================================================================

    function existy(x) {
      return x != null;
    }

    function isStr(something) {
      return typeof something === "string";
    }

    function treatRangedTags(i, opts, rangesToDelete) {
      if (Array.isArray(opts.stripTogetherWithTheirContents) && (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*"))) {
        // it depends, is it opening or closing range tag:
        // We could try to distinguish opening from closing tags by presence of
        // slash, but that would be a liability for dirty code cases where clash
        // is missing. Better, instead, just see if an entry for that tag name
        // already exists in the rangesToDelete[].
        if (Array.isArray(rangedOpeningTags) && rangedOpeningTags.some(function (obj) {
          return obj.name === tag.name && obj.lastClosingBracketAt < i;
        })) {
          var _loop = function _loop(y) {
            if (rangedOpeningTags[y].name === tag.name) {
              // we'll remove from opening tag's opening bracket to closing tag's
              // closing bracket because whitespace will be taken care of separately,
              // when tags themselves will be removed.
              // Basically, for each range tag there will be 3 removals:
              // opening tag, closing tag and all from opening to closing tag.
              // We keep removing opening and closing tags along whole range
              // because of few reasons: 1. cases of broken/dirty code, 2. keeping
              // the algorithm simpler, 3. opts that control whitespace removal
              // around tags.
              // 1. add range without caring about surrounding whitespace around
              // the range
              // also, tend filteredTagLocations in the output - tags which are to be
              // deleted with contents should be reported as one large range in
              // filteredTagLocations - from opening to closing - not two ranges

              /* istanbul ignore else */
              if (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*")) {
                filteredTagLocations = filteredTagLocations.filter(function (_ref) {
                  var _ref2 = _slicedToArray(_ref, 2),
                      from = _ref2[0],
                      upto = _ref2[1];

                  return (from < rangedOpeningTags[y].lastOpeningBracketAt || from >= i + 1) && (upto <= rangedOpeningTags[y].lastOpeningBracketAt || upto > i + 1);
                });
              }

              var endingIdx = i + 1;

              if (tag.lastClosingBracketAt) {
                endingIdx = tag.lastClosingBracketAt + 1;
              } // correction for missing closing bracket cases
              // if (str[i] !== "<" && str[i - 1] !== ">") {
              //   endingIdx++;
              // }


              filteredTagLocations.push([rangedOpeningTags[y].lastOpeningBracketAt, endingIdx]);

              if (punctuation.has(str[i])) {
                opts.cb({
                  tag: tag,
                  deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                  deleteTo: i + 1,
                  insert: null,
                  rangesArr: rangesToDelete,
                  proposedReturn: [rangedOpeningTags[y].lastOpeningBracketAt, i, null]
                }); // null will remove any spaces added so far. Opening and closing range tags might
                // have received spaces as separate entities, but those might not be necessary for range:
                // "text <script>deleteme</script>."
              } else {
                opts.cb({
                  tag: tag,
                  deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                  deleteTo: i,
                  insert: "",
                  rangesArr: rangesToDelete,
                  proposedReturn: [rangedOpeningTags[y].lastOpeningBracketAt, i, ""]
                });
              } // 2. delete the reference to this range from rangedOpeningTags[]
              // because there might be more ranged tags of the same name or
              // different, overlapping or encompassing ranged tags with same
              // or different name.


              rangedOpeningTags.splice(y, 1); // 3. stop the loop

              return "break";
            }
          };

          // if (tag.slashPresent) {
          // closing tag.
          // filter and remove the found tag
          for (var y = rangedOpeningTags.length; y--;) {
            var _ret = _loop(y);

            if (_ret === "break") break;
          }
        } else {
          // opening tag.
          rangedOpeningTags.push(tag);
        }
      }
    }

    function calculateWhitespaceToInsert(str2, // whole string
    currCharIdx, // current index
    fromIdx, // leftmost whitespace edge around tag
    toIdx, // rightmost whitespace edge around tag
    lastOpeningBracketAt, // tag actually starts here (<)
    lastClosingBracketAt // tag actually ends here (>)
    ) {
      var strToEvaluateForLineBreaks = "";

      if (fromIdx < lastOpeningBracketAt) {
        strToEvaluateForLineBreaks += str2.slice(fromIdx, lastOpeningBracketAt);
      }

      if (toIdx > lastClosingBracketAt + 1) {
        // limit whitespace that follows the tag, stop at linebreak. That's to make
        // the algorithm composable - we include linebreaks in front but not after.
        var temp = str2.slice(lastClosingBracketAt + 1, toIdx);

        if (temp.includes("\n") && str2[toIdx] === "<") {
          strToEvaluateForLineBreaks += " ";
        } else {
          strToEvaluateForLineBreaks += temp;
        }
      }

      if (!punctuation.has(str2[currCharIdx]) && str2[currCharIdx] !== "!") {
        var foundLineBreaks = strToEvaluateForLineBreaks.match(/\n/g);

        if (Array.isArray(foundLineBreaks) && foundLineBreaks.length) {
          if (foundLineBreaks.length === 1) {
            return "\n";
          }

          if (foundLineBreaks.length === 2) {
            return "\n\n";
          } // return three line breaks maximum


          return "\n\n\n";
        } // default spacer - a single space


        return " ";
      } // default case: space


      return "";
    }

    function calculateHrefToBeInserted(opts) {
      if (opts.dumpLinkHrefsNearby.enabled && Object.keys(hrefDump).length && hrefDump.tagName === tag.name && tag.lastOpeningBracketAt && (hrefDump.openingTagEnds && tag.lastOpeningBracketAt > hrefDump.openingTagEnds || !hrefDump.openingTagEnds)) {
        hrefInsertionActive = true;
      }

      if (hrefInsertionActive) {
        var lineBreaks = opts.dumpLinkHrefsNearby.putOnNewLine ? "\n\n" : "";
        stringToInsertAfter = "".concat(lineBreaks).concat(hrefDump.hrefValue).concat(lineBreaks);
      }
    } // validation
    // ===========================================================================


    if (typeof str !== "string") {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: ".concat(_typeof(str).toLowerCase(), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }

    if (originalOpts && !lodash_isplainobject(originalOpts)) {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: ".concat(_typeof(originalOpts).toLowerCase(), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
    } // eslint-disable-next-line consistent-return


    function resetHrefMarkers() {
      // reset the hrefDump
      if (hrefInsertionActive) {
        hrefDump = {};
        hrefInsertionActive = false;
      }
    } // prep opts
    // ===========================================================================


    var defaults = {
      ignoreTags: [],
      onlyStripTags: [],
      stripTogetherWithTheirContents: _toConsumableArray(stripTogetherWithTheirContentsDefaults),
      skipHtmlDecoding: false,
      trimOnlySpaces: false,
      dumpLinkHrefsNearby: {
        enabled: false,
        putOnNewLine: false,
        wrapHeads: "",
        wrapTails: ""
      },
      cb: null
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    if (Object.prototype.hasOwnProperty.call(opts, "returnRangesOnly")) {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_03] opts.returnRangesOnly has been removed from the API since v.5 release.");
    } // filter non-string or whitespace entries from the following arrays or turn
    // them into arrays:


    opts.ignoreTags = prepHopefullyAnArray(opts.ignoreTags, "opts.ignoreTags");
    opts.onlyStripTags = prepHopefullyAnArray(opts.onlyStripTags, "opts.onlyStripTags"); // let's define the onlyStripTagsMode. Since opts.onlyStripTags can cancel
    // out the entries in opts.onlyStripTags, it can be empty but this mode has
    // to be switched on:

    var onlyStripTagsMode = !!opts.onlyStripTags.length; // if both opts.onlyStripTags and opts.ignoreTags are set, latter is respected,
    // we simply exclude ignored tags from the opts.onlyStripTags.

    if (opts.onlyStripTags.length && opts.ignoreTags.length) {
      opts.onlyStripTags = lodash_without.apply(void 0, [opts.onlyStripTags].concat(_toConsumableArray(opts.ignoreTags)));
    }

    if (!lodash_isplainobject(opts.dumpLinkHrefsNearby)) {
      opts.dumpLinkHrefsNearby = _objectSpread2({}, defaults.dumpLinkHrefsNearby);
    } // Object.assign doesn't deep merge, so we take care of opts.dumpLinkHrefsNearby:


    opts.dumpLinkHrefsNearby = defaults.dumpLinkHrefsNearby;

    if (lodash_isplainobject(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "dumpLinkHrefsNearby") && existy(originalOpts.dumpLinkHrefsNearby)) {
      /* istanbul ignore else */
      if (lodash_isplainobject(originalOpts.dumpLinkHrefsNearby)) {
        opts.dumpLinkHrefsNearby = _objectSpread2(_objectSpread2({}, defaults.dumpLinkHrefsNearby), originalOpts.dumpLinkHrefsNearby);
      } else if (originalOpts.dumpLinkHrefsNearby) {
        // checking to omit value as number zero
        throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_04] Optional Options Object's key dumpLinkHrefsNearby was set to ".concat(_typeof(originalOpts.dumpLinkHrefsNearby), ", equal to ").concat(JSON.stringify(originalOpts.dumpLinkHrefsNearby, null, 4), ". The only allowed value is a plain object. See the API reference."));
      }
    }

    if (!opts.stripTogetherWithTheirContents) {
      opts.stripTogetherWithTheirContents = [];
    } else if (typeof opts.stripTogetherWithTheirContents === "string" && opts.stripTogetherWithTheirContents.length > 0) {
      opts.stripTogetherWithTheirContents = [opts.stripTogetherWithTheirContents];
    }

    var somethingCaught = {};

    if (opts.stripTogetherWithTheirContents && Array.isArray(opts.stripTogetherWithTheirContents) && opts.stripTogetherWithTheirContents.length && !opts.stripTogetherWithTheirContents.every(function (el, i) {
      if (!(typeof el === "string")) {
        somethingCaught.el = el;
        somethingCaught.i = i;
        return false;
      }

      return true;
    })) {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_05] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index ".concat(somethingCaught.i, " has a value ").concat(somethingCaught.el, " which is not string but ").concat(_typeof(somethingCaught.el).toLowerCase(), "."));
    } // prep the opts.cb


    if (!opts.cb) {
      opts.cb = function (_ref3) {
        var rangesArr = _ref3.rangesArr,
            proposedReturn = _ref3.proposedReturn;
        rangesArr.push.apply(rangesArr, _toConsumableArray(proposedReturn));
      };
    } // if the links have to be on a new line, we need to increase the allowance for line breaks
    // in Ranges class, it's the ranges-push API setting opts.limitLinebreaksCount
    // see https://www.npmjs.com/package/ranges-push#optional-options-object


    var rangesToDelete = new Ranges({
      limitToBeAddedWhitespace: true,
      limitLinebreaksCount: 2
    }); // TODO - that's crummy
    // use ranges-ent-decode

    if (!opts.skipHtmlDecoding) {
      while (str !== ent.decode(str)) {
        // eslint-disable-next-line no-param-reassign
        str = ent.decode(str);
      }
    } // step 1.
    // ===========================================================================


    var _loop2 = function _loop2(_i, len) {
      // catch the first ending of the spaces chunk that follows the closing bracket.
      // -------------------------------------------------------------------------
      // There can be no space after bracket, in that case, the result will be that character that
      // follows the closing bracket.
      // There can be bunch of spaces that end with EOF. In that case it's fine, this variable will
      // be null.
      if (Object.keys(tag).length > 1 && tag.lastClosingBracketAt && tag.lastClosingBracketAt < _i && str[_i] !== " " && spacesChunkWhichFollowsTheClosingBracketEndsAt === null) {
        spacesChunkWhichFollowsTheClosingBracketEndsAt = _i;
      } // catch the closing bracket of dirty tags with missing opening brackets
      // -------------------------------------------------------------------------


      if (str[_i] === ">") {
        // tend cases where opening bracket of a tag is missing:
        if ((!tag || Object.keys(tag).length < 2) && _i > 1) {
          // traverse backwards either until start of string or ">" is found
          for (var y = _i; y--;) {
            if (str[y - 1] === undefined || str[y] === ">") {
              var _ret3 = function () {
                var startingPoint = str[y - 1] === undefined ? y : y + 1;
                var culprit = str.slice(startingPoint, _i + 1); // Check if the culprit starts with a tag that's more likely a tag
                // name (like "body" or "article"). Single-letter tag names are excluded
                // because they can be plausible, ie. in math texts and so on.
                // Nobody uses puts comparison signs between words like: "article > ",
                // but single letter names can be plausible: "a > b" in math.

                if (str !== "<".concat(lodash_trim(culprit.trim(), "/>"), ">") && // recursion prevention
                _toConsumableArray(definitelyTagNames).some(function (val) {
                  return lodash_trim(culprit.trim().split(/\s+/).filter(function (val2) {
                    return val2.trim();
                  }).filter(function (val3, i3) {
                    return i3 === 0;
                  }), "/>").toLowerCase() === val;
                }) && stripHtml("<".concat(culprit.trim(), ">"), opts).result === "") {
                  /* istanbul ignore else */
                  if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                    allTagLocations.push([startingPoint, _i + 1]);
                  }
                  /* istanbul ignore else */


                  if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                    filteredTagLocations.push([startingPoint, _i + 1]);
                  }

                  var whiteSpaceCompensation = calculateWhitespaceToInsert(str, _i, startingPoint, _i + 1, startingPoint, _i + 1);
                  var deleteUpTo = _i + 1;

                  if (str[deleteUpTo] && !str[deleteUpTo].trim()) {
                    for (var z = deleteUpTo; z < len; z++) {
                      if (str[z].trim()) {
                        deleteUpTo = z;
                        break;
                      }
                    }
                  }

                  opts.cb({
                    tag: tag,
                    deleteFrom: startingPoint,
                    deleteTo: deleteUpTo,
                    insert: whiteSpaceCompensation,
                    rangesArr: rangesToDelete,
                    proposedReturn: [startingPoint, deleteUpTo, whiteSpaceCompensation]
                  });
                }

                return "break";
              }();

              if (_ret3 === "break") break;
            }
          }
        }
      } // catch slash
      // -------------------------------------------------------------------------


      if (str[_i] === "/" && !(tag.quotes && tag.quotes.value) && Number.isInteger(tag.lastOpeningBracketAt) && !Number.isInteger(tag.lastClosingBracketAt)) {
        tag.slashPresent = _i;
      } // catch double or single quotes
      // -------------------------------------------------------------------------


      if (str[_i] === '"' || str[_i] === "'") {
        if (tag.nameStarts && tag.quotes && tag.quotes.value && tag.quotes.value === str[_i]) {
          // 1. finish assembling the "attrObj{}"
          attrObj.valueEnds = _i;
          attrObj.value = str.slice(attrObj.valueStarts, _i);
          tag.attributes.push(attrObj); // reset:

          attrObj = {}; // 2. finally, delete the quotes marker, we don't need it any more

          tag.quotes = undefined; // 3. if opts.dumpLinkHrefsNearby.enabled is on, catch href

          var hrefVal;

          if (opts.dumpLinkHrefsNearby.enabled && // eslint-disable-next-line
          tag.attributes.some(function (obj) {
            if (obj.name && obj.name.toLowerCase() === "href") {
              hrefVal = "".concat(opts.dumpLinkHrefsNearby.wrapHeads || "").concat(obj.value).concat(opts.dumpLinkHrefsNearby.wrapTails || "");
              i = _i;
              return true;
            }
          })) {
            hrefDump = {
              tagName: tag.name,
              hrefValue: hrefVal
            };
          }
        } else if (!tag.quotes && tag.nameStarts) {
          // 1. if it's opening marker, record the type and location of quotes
          tag.quotes = {};
          tag.quotes.value = str[_i];
          tag.quotes.start = _i; // 2. start assembling the attribute object which we'll dump into tag.attributes[] array:

          if (attrObj.nameStarts && attrObj.nameEnds && attrObj.nameEnds < _i && attrObj.nameStarts < _i && !attrObj.valueStarts) {
            attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
          }
        }
      } // catch the ending of the tag name:
      // -------------------------------------------------------------------------


      if (tag.nameStarts !== undefined && tag.nameEnds === undefined && (!str[_i].trim() || !characterSuitableForNames(str[_i]))) {
        // 1. mark the name ending
        tag.nameEnds = _i; // 2. extract the full name string

        tag.name = str.slice(tag.nameStarts, tag.nameEnds + (
        /* istanbul ignore next */
        str[_i] !== ">" && str[_i] !== "/" && str[_i + 1] === undefined ? 1 : 0));

        if ( // if we caught "----" from "<----" or "---->", bail:
        str[tag.nameStarts - 1] !== "!" && // protection against <!--
        !tag.name.replace(/-/g, "").length || // if tag name starts with a number character
        /^\d+$/.test(tag.name[0])) {
          tag = {};
          i = _i;
          return "continue";
        }

        if (str[_i] === "<") {
          // process it because we need to tackle this new tag
          calculateHrefToBeInserted(opts); // calculateWhitespaceToInsert() API:
          // str, // whole string
          // currCharIdx, // current index
          // fromIdx, // leftmost whitespace edge around tag
          // toIdx, // rightmost whitespace edge around tag
          // lastOpeningBracketAt, // tag actually starts here (<)
          // lastClosingBracketAt // tag actually ends here (>)

          var whiteSpaceCompensation = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, _i, tag.lastOpeningBracketAt, _i); // only on pair tags, exclude the opening counterpart and closing
          // counterpart if whole pair is to be deleted

          if (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*")) {
            /* istanbul ignore next */
            filteredTagLocations = filteredTagLocations.filter(function (_ref4) {
              var _ref5 = _slicedToArray(_ref4, 2),
                  from = _ref5[0],
                  upto = _ref5[1];

              return !(from === tag.leftOuterWhitespace && upto === _i);
            });
          } // console.log(
          //   `1011 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
          //     tag.leftOuterWhitespace
          //   }, ${i}] to filteredTagLocations`
          // );
          // filteredTagLocations.push([tag.leftOuterWhitespace, i]);


          opts.cb({
            tag: tag,
            deleteFrom: tag.leftOuterWhitespace,
            deleteTo: _i,
            insert: "".concat(whiteSpaceCompensation).concat(stringToInsertAfter).concat(whiteSpaceCompensation),
            rangesArr: rangesToDelete,
            proposedReturn: [tag.leftOuterWhitespace, _i, "".concat(whiteSpaceCompensation).concat(stringToInsertAfter).concat(whiteSpaceCompensation)]
          });
          resetHrefMarkers(); // also,

          treatRangedTags(_i, opts, rangesToDelete);
        }
      } // catch beginning of an attribute value
      // -------------------------------------------------------------------------


      if (tag.quotes && tag.quotes.start && tag.quotes.start < _i && !tag.quotes.end && attrObj.nameEnds && attrObj.equalsAt && !attrObj.valueStarts) {
        attrObj.valueStarts = _i;
      } // catch rare cases when attributes name has some space after it, before equals
      // -------------------------------------------------------------------------


      if (!tag.quotes && attrObj.nameEnds && str[_i] === "=" && !attrObj.valueStarts && !attrObj.equalsAt) {
        attrObj.equalsAt = _i;
      } // catch the ending of the whole attribute
      // -------------------------------------------------------------------------
      // for example, <a b c> this "c" ends "b" because it's not "equals" sign.
      // We even anticipate for cases where whitespace anywhere between attribute parts:
      // < article class = " something " / >


      if (!tag.quotes && attrObj.nameStarts && attrObj.nameEnds && !attrObj.valueStarts && str[_i].trim() && str[_i] !== "=") {
        // if (!tag.attributes) {
        //   tag.attributes = [];
        // }
        tag.attributes.push(attrObj);
        attrObj = {};
      } // catch the ending of an attribute's name
      // -------------------------------------------------------------------------


      if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {
        if (!str[_i].trim()) {
          attrObj.nameEnds = _i;
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        } else if (str[_i] === "=") {
          /* istanbul ignore else */
          if (!attrObj.equalsAt) {
            attrObj.nameEnds = _i;
            attrObj.equalsAt = _i;
            attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
          }
        } else if (str[_i] === "/" || str[_i] === ">") {
          attrObj.nameEnds = _i;
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds); // if (!tag.attributes) {
          //   tag.attributes = [];
          // }

          tag.attributes.push(attrObj);
          attrObj = {};
        } else if (str[_i] === "<") {
          // TODO - address both cases of onlyPlausible
          attrObj.nameEnds = _i;
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds); // if (!tag.attributes) {
          //   tag.attributes = [];
          // }

          tag.attributes.push(attrObj);
          attrObj = {};
        }
      } // catch the beginning of an attribute's name
      // -------------------------------------------------------------------------


      if (!tag.quotes && tag.nameEnds < _i && !str[_i - 1].trim() && str[_i].trim() && !"<>/!".includes(str[_i]) && !attrObj.nameStarts && !tag.lastClosingBracketAt) {
        attrObj.nameStarts = _i;
      } // catch "< /" - turn off "onlyPlausible"
      // -------------------------------------------------------------------------


      if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < _i && str[_i] === "/" && tag.onlyPlausible) {
        tag.onlyPlausible = false;
      } // catch character that follows an opening bracket:
      // -------------------------------------------------------------------------


      if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < _i && str[_i] !== "/" // there can be closing slashes in various places, legit and not
      ) {
          // 1. identify, is it definite or just plausible tag
          if (tag.onlyPlausible === undefined) {
            if ((!str[_i].trim() || str[_i] === "<") && !tag.slashPresent) {
              tag.onlyPlausible = true;
            } else {
              tag.onlyPlausible = false;
            }
          } // 2. catch the beginning of the tag name. Consider custom HTML tag names
          // and also known (X)HTML tags:


          if (str[_i].trim() && tag.nameStarts === undefined && str[_i] !== "<" && str[_i] !== "/" && str[_i] !== ">" && str[_i] !== "!") {
            tag.nameStarts = _i;
            tag.nameContainsLetters = false;
          }
        } // Catch letters in the tag name. Necessary to filter out false positives like "<------"


      if (tag.nameStarts && !tag.quotes && str[_i].toLowerCase() !== str[_i].toUpperCase()) {
        tag.nameContainsLetters = true;
      } // catch closing bracket
      // -------------------------------------------------------------------------


      if (str[_i] === ">") {
        if (tag.lastOpeningBracketAt !== undefined) {
          // 1. mark the index
          tag.lastClosingBracketAt = _i; // 2. reset the spacesChunkWhichFollowsTheClosingBracketEndsAt

          spacesChunkWhichFollowsTheClosingBracketEndsAt = null; // 3. push attrObj into tag.attributes[]

          if (Object.keys(attrObj).length) {
            // if (!tag.attributes) {
            //   tag.attributes = [];
            // }
            tag.attributes.push(attrObj);
            attrObj = {};
          } // 4. if opts.dumpLinkHrefsNearby.enabled is on and we just recorded an href,


          if (opts.dumpLinkHrefsNearby.enabled && hrefDump.tagName && !hrefDump.openingTagEnds) {
            // finish assembling the hrefDump{}
            hrefDump.openingTagEnds = _i; // or tag.lastClosingBracketAt, same
          }
        }
      } // catch the ending of the tag
      // -------------------------------------------------------------------------
      // the tag is "released" into "rangesApply":


      if (tag.lastOpeningBracketAt !== undefined) {
        if (tag.lastClosingBracketAt === undefined) {
          if (tag.lastOpeningBracketAt < _i && str[_i] !== "<" && ( // to prevent cases like "text <<<<<< text"
          str[_i + 1] === undefined || str[_i + 1] === "<") && tag.nameContainsLetters) {
            // find out the tag name earlier than dedicated tag name ending catching section:
            // if (str[i + 1] === undefined) {
            tag.name = str.slice(tag.nameStarts, tag.nameEnds ? tag.nameEnds : _i + 1).toLowerCase(); // submit tag to allTagLocations

            /* istanbul ignore else */

            if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
              allTagLocations.push([tag.lastOpeningBracketAt, _i + 1]);
            }

            if ( // if it's an ignored tag
            opts.ignoreTags.includes(tag.name) || // or just plausible and unrecognised
            tag.onlyPlausible && !definitelyTagNames.has(tag.name)) {
              tag = {};
              attrObj = {};
              i = _i;
              return "continue";
            } // if the tag is only plausible (there's space after opening bracket) and it's not among
            // recognised tags, leave it as it is:


            if ((definitelyTagNames.has(tag.name) || singleLetterTags.has(tag.name)) && (tag.onlyPlausible === false || tag.onlyPlausible === true && tag.attributes.length) || str[_i + 1] === undefined) {
              calculateHrefToBeInserted(opts);

              var _whiteSpaceCompensation = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, _i + 1, tag.lastOpeningBracketAt, tag.lastClosingBracketAt);

              opts.cb({
                tag: tag,
                deleteFrom: tag.leftOuterWhitespace,
                deleteTo: _i + 1,
                insert: "".concat(_whiteSpaceCompensation).concat(stringToInsertAfter).concat(_whiteSpaceCompensation),
                rangesArr: rangesToDelete,
                proposedReturn: [tag.leftOuterWhitespace, _i + 1, "".concat(_whiteSpaceCompensation).concat(stringToInsertAfter).concat(_whiteSpaceCompensation)]
              });
              resetHrefMarkers(); // also,

              treatRangedTags(_i, opts, rangesToDelete);
            }
            /* istanbul ignore else */


            if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt && filteredTagLocations[filteredTagLocations.length - 1][1] !== _i + 1) {
              // filter out opening/closing tag pair because whole chunk
              // from opening's opening to closing's closing will be pushed
              if (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*")) {
                // get the last opening counterpart of the pair
                // iterate rangedOpeningTags from the, pick the first
                // ranged opening tag whose name is same like current, closing's
                var lastRangedOpeningTag;

                for (var z = rangedOpeningTags.length; z--;) {
                  /* istanbul ignore else */
                  if (rangedOpeningTags[z].name === tag.name) {
                    lastRangedOpeningTag = rangedOpeningTags[z];
                  }
                }
                /* istanbul ignore else */


                if (lastRangedOpeningTag) {
                  filteredTagLocations = filteredTagLocations.filter(function (_ref6) {
                    var _ref7 = _slicedToArray(_ref6, 1),
                        from = _ref7[0];

                    return from !== lastRangedOpeningTag.lastOpeningBracketAt;
                  });
                  filteredTagLocations.push([lastRangedOpeningTag.lastOpeningBracketAt, _i + 1]);
                } else {
                  /* istanbul ignore next */
                  filteredTagLocations.push([tag.lastOpeningBracketAt, _i + 1]);
                }
              } else {
                // if it's not ranged tag, just push it as it is to filteredTagLocations
                filteredTagLocations.push([tag.lastOpeningBracketAt, _i + 1]);
              }
            }
          }
        } else if (_i > tag.lastClosingBracketAt && str[_i].trim() || str[_i + 1] === undefined) {
          // case 2. closing bracket HAS BEEN met
          // we'll look for a non-whitespace character and delete up to it
          // BUT, we'll wipe the tag object only if that non-whitespace character
          // is not a ">". This way we'll catch and delete sequences of closing brackets.
          // part 1.
          var endingRangeIndex = tag.lastClosingBracketAt === _i ? _i + 1 : _i;

          if (opts.trimOnlySpaces && endingRangeIndex === len - 1 && spacesChunkWhichFollowsTheClosingBracketEndsAt !== null && spacesChunkWhichFollowsTheClosingBracketEndsAt < _i) {
            endingRangeIndex = spacesChunkWhichFollowsTheClosingBracketEndsAt;
          } // if it's a dodgy suspicious tag where space follows opening bracket, there's an extra requirement
          // for this tag to be considered a tag - there has to be at least one attribute with equals if
          // the tag name is not recognised.
          // submit tag to allTagLocations

          /* istanbul ignore else */


          if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
            allTagLocations.push([tag.lastOpeningBracketAt, tag.lastClosingBracketAt + 1]);
          }

          if (!onlyStripTagsMode && opts.ignoreTags.includes(tag.name) || onlyStripTagsMode && !opts.onlyStripTags.includes(tag.name)) {
            // ping the callback with nulls:
            opts.cb({
              tag: tag,
              deleteFrom: null,
              deleteTo: null,
              insert: null,
              rangesArr: rangesToDelete,
              proposedReturn: []
            }); // don't submit the tag onto "filteredTagLocations"
            // then reset:

            tag = {};
            attrObj = {}; // continue;
          } else if (!tag.onlyPlausible || // tag name is recognised and there are no attributes:
          tag.attributes.length === 0 && tag.name && (definitelyTagNames.has(tag.name.toLowerCase()) || singleLetterTags.has(tag.name.toLowerCase())) || // OR there is at least one equals that follow the attribute's name:
          tag.attributes && tag.attributes.some(function (attrObj2) {
            return attrObj2.equalsAt;
          })) {
            // submit tag to filteredTagLocations

            /* istanbul ignore else */
            if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
              filteredTagLocations.push([tag.lastOpeningBracketAt, tag.lastClosingBracketAt + 1]);
            } // if this was an ignored tag name, algorithm would have bailed earlier,
            // in stage "catch the ending of the tag name".


            var _whiteSpaceCompensation2 = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, endingRangeIndex, tag.lastOpeningBracketAt, tag.lastClosingBracketAt); // calculate optional opts.dumpLinkHrefsNearby.enabled HREF to insert


            stringToInsertAfter = "";
            hrefInsertionActive = false;
            calculateHrefToBeInserted(opts);
            var insert;

            if (isStr(stringToInsertAfter) && stringToInsertAfter.length) {
              insert = "".concat(_whiteSpaceCompensation2).concat(stringToInsertAfter).concat(
              /* istanbul ignore next */
              _whiteSpaceCompensation2 === "\n\n" ? "\n" : _whiteSpaceCompensation2);
            } else {
              insert = _whiteSpaceCompensation2;
            }

            if (tag.leftOuterWhitespace === 0 || !right(str, endingRangeIndex - 1)) {
              insert = "";
            } // pass the range onto the callback function, be it default or user's


            opts.cb({
              tag: tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: endingRangeIndex,
              insert: insert,
              rangesArr: rangesToDelete,
              proposedReturn: [tag.leftOuterWhitespace, endingRangeIndex, insert]
            });
            resetHrefMarkers(); // also,

            treatRangedTags(_i, opts, rangesToDelete);
          } else {
            tag = {};
          } // part 2.


          if (str[_i] !== ">") {
            tag = {};
          }
        }
      } // catch an opening bracket
      // -------------------------------------------------------------------------


      if (str[_i] === "<" && str[_i - 1] !== "<" && !"'\"".includes(str[_i + 1]) && (!"'\"".includes(str[_i + 2]) || /\w/.test(str[_i + 1]))) {
        // cater sequences of opening brackets "<<<<div>>>"
        if (str[right(str, _i)] === ">") {
          i = _i;
          // cater cases like: "<><><>"
          return "continue";
        } else {
          // 1. Before (re)setting flags, check, do we have a case of a tag with a
          // missing closing bracket, and this is a new tag following it.
          if (tag.nameEnds && tag.nameEnds < _i && !tag.lastClosingBracketAt) {
            if (tag.onlyPlausible === true && tag.attributes && tag.attributes.length || tag.onlyPlausible === false) {
              // tag.onlyPlausible can be undefined too
              var _whiteSpaceCompensation3 = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, _i, tag.lastOpeningBracketAt, _i);

              opts.cb({
                tag: tag,
                deleteFrom: tag.leftOuterWhitespace,
                deleteTo: _i,
                insert: _whiteSpaceCompensation3,
                rangesArr: rangesToDelete,
                proposedReturn: [tag.leftOuterWhitespace, _i, _whiteSpaceCompensation3]
              }); // also,

              treatRangedTags(_i, opts, rangesToDelete); // then, for continuity, mark everything up accordingly if it's a new bracket:

              tag = {};
              attrObj = {};
            }
          } // 2. if new tag starts, reset:


          if (tag.lastOpeningBracketAt !== undefined && tag.onlyPlausible && tag.name && !tag.quotes) {
            // reset:
            tag.lastOpeningBracketAt = undefined;
            tag.name = undefined;
            tag.onlyPlausible = false;
          }

          if ((tag.lastOpeningBracketAt === undefined || !tag.onlyPlausible) && !tag.quotes) {
            tag.lastOpeningBracketAt = _i;
            tag.slashPresent = false;
            tag.attributes = []; // since 2.1.0 we started to care about not trimming outer whitespace which is not spaces.
            // For example, " \t <a> \n ". Tag's whitespace boundaries should not extend to string
            // edges but until "\t" on the left and "\n" on the right IF opts.trimOnlySpaces is on.

            if (chunkOfWhitespaceStartsAt === null) {
              tag.leftOuterWhitespace = _i;
            } else if (opts.trimOnlySpaces && chunkOfWhitespaceStartsAt === 0) {
              // if whitespace extends to the beginning of a string, there's a risk it might include
              // not only spaces. To fix that, switch to space-only range marker:

              /* istanbul ignore next */
              tag.leftOuterWhitespace = chunkOfSpacesStartsAt || _i;
            } else {
              tag.leftOuterWhitespace = chunkOfWhitespaceStartsAt;
            } // tag.leftOuterWhitespace =
            //   chunkOfWhitespaceStartsAt === null ? i : chunkOfWhitespaceStartsAt;
            // tend the HTML comments: <!-- --> or CDATA: <![CDATA[ ... ]]>
            // if opening comment tag is detected, traverse forward aggressively
            // until EOL or "-->" is reached and offset outer index "i".


            if ("".concat(str[_i + 1]).concat(str[_i + 2]).concat(str[_i + 3]) === "!--" || "".concat(str[_i + 1]).concat(str[_i + 2]).concat(str[_i + 3]).concat(str[_i + 4]).concat(str[_i + 5]).concat(str[_i + 6]).concat(str[_i + 7]).concat(str[_i + 8]) === "![CDATA[") {
              // make a note which one it is:
              var cdata = true;

              if (str[_i + 2] === "-") {
                cdata = false;
              }

              var closingFoundAt;

              for (var _y = _i; _y < len; _y++) {
                if (!closingFoundAt && cdata && "".concat(str[_y - 2]).concat(str[_y - 1]).concat(str[_y]) === "]]>" || !cdata && "".concat(str[_y - 2]).concat(str[_y - 1]).concat(str[_y]) === "-->") {
                  closingFoundAt = _y;
                }

                if (closingFoundAt && (closingFoundAt < _y && str[_y].trim() || str[_y + 1] === undefined)) {
                  var rangeEnd = _y;

                  if (str[_y + 1] === undefined && !str[_y].trim() || str[_y] === ">") {
                    rangeEnd += 1;
                  } // submit the tag

                  /* istanbul ignore else */


                  if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                    allTagLocations.push([tag.lastOpeningBracketAt, closingFoundAt + 1]);
                  }
                  /* istanbul ignore else */


                  if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                    filteredTagLocations.push([tag.lastOpeningBracketAt, closingFoundAt + 1]);
                  }

                  var _whiteSpaceCompensation4 = calculateWhitespaceToInsert(str, _y, tag.leftOuterWhitespace, rangeEnd, tag.lastOpeningBracketAt, closingFoundAt);

                  opts.cb({
                    tag: tag,
                    deleteFrom: tag.leftOuterWhitespace,
                    deleteTo: rangeEnd,
                    insert: _whiteSpaceCompensation4,
                    rangesArr: rangesToDelete,
                    proposedReturn: [tag.leftOuterWhitespace, rangeEnd, _whiteSpaceCompensation4]
                  }); // offset:

                  _i = _y - 1;

                  if (str[_y] === ">") {
                    _i = _y;
                  } // resets:


                  tag = {};
                  attrObj = {}; // finally,

                  break;
                }
              }
            }
          }
        }
      } // catch whitespace
      // -------------------------------------------------------------------------


      if (str[_i].trim() === "") {
        // 1. catch chunk boundaries:
        if (chunkOfWhitespaceStartsAt === null) {
          chunkOfWhitespaceStartsAt = _i;

          if (tag.lastOpeningBracketAt !== undefined && tag.lastOpeningBracketAt < _i && tag.nameStarts && tag.nameStarts < tag.lastOpeningBracketAt && _i === tag.lastOpeningBracketAt + 1 && // insurance against tail part of ranged tag being deleted:
          !rangedOpeningTags.some( // eslint-disable-next-line no-loop-func
          function (rangedTagObj) {
            return rangedTagObj.name === tag.name;
          })) {
            tag.onlyPlausible = true;
            tag.name = undefined;
            tag.nameStarts = undefined;
          }
        }
      } else if (chunkOfWhitespaceStartsAt !== null) {
        // 1. piggyback the catching of the attributes with equal and no value
        if (!tag.quotes && attrObj.equalsAt > chunkOfWhitespaceStartsAt - 1 && attrObj.nameEnds && attrObj.equalsAt > attrObj.nameEnds && str[_i] !== '"' && str[_i] !== "'") {
          /* istanbul ignore else */
          if (lodash_isplainobject(attrObj)) {
            tag.attributes.push(attrObj);
          } // reset:


          attrObj = {};
          tag.equalsSpottedAt = undefined;
        } // 2. reset whitespace marker


        chunkOfWhitespaceStartsAt = null;
      } // catch spaces-only chunks (needed for outer trim option opts.trimOnlySpaces)
      // -------------------------------------------------------------------------


      if (str[_i] === " ") {
        // 1. catch spaces boundaries:
        if (chunkOfSpacesStartsAt === null) {
          chunkOfSpacesStartsAt = _i;
        }
      } else if (chunkOfSpacesStartsAt !== null) {
        // 2. reset the marker
        chunkOfSpacesStartsAt = null;
      } // log all
      // -------------------------------------------------------------------------
      // console.log(
      //   `${`\u001b[${33}m${`chunkOfSpacesStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
      //     chunkOfSpacesStartsAt,
      //     null,
      //     4
      //   )}`
      // );
      // console.log(
      //   `${`\u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
      //     chunkOfWhitespaceStartsAt,
      //     null,
      //     4
      //   )}`
      // );


      i = _i;
    };

    for (var i = 0, len = str.length; i < len; i++) {
      var _ret2 = _loop2(i, len);

      if (_ret2 === "continue") continue;
    } // trim but in ranges
    // first tackle the beginning on the string


    if (str && ( // if only spaces were meant to be trimmed,
    opts.trimOnlySpaces && // and first character is a space
    str[0] === " " || // if normal trim is requested
    !opts.trimOnlySpaces && // and the first character is whitespace character
    !str[0].trim())) {
      for (var _i2 = 0, _len = str.length; _i2 < _len; _i2++) {
        if (opts.trimOnlySpaces && str[_i2] !== " " || !opts.trimOnlySpaces && str[_i2].trim()) {
          rangesToDelete.push([0, _i2]);
          break;
        } else if (!str[_i2 + 1]) {
          // if end has been reached and whole string has been trimmable
          rangesToDelete.push([0, _i2 + 1]);
        }
      }
    }

    if (str && ( // if only spaces were meant to be trimmed,
    opts.trimOnlySpaces && // and last character is a space
    str[str.length - 1] === " " || // if normal trim is requested
    !opts.trimOnlySpaces && // and the last character is whitespace character
    !str[str.length - 1].trim())) {
      for (var _i3 = str.length; _i3--;) {
        if (opts.trimOnlySpaces && str[_i3] !== " " || !opts.trimOnlySpaces && str[_i3].trim()) {
          rangesToDelete.push([_i3 + 1, str.length]);
          break;
        } // don't tackle end-to-end because it would have been already caught on the
        // start-to-end direction loop above.

      }
    } // last correction, imagine we've got text-whitespace-tag.
    // That last part "tag" was removed but "whitespace" in between is left.
    // We need to trim() that too if applicable.
    // By now we'll be able to tell, is starting/ending range array touching
    // the start (index 0) or end (str.length - 1) character indexes, and if so,
    // their inner sides will need to be trimmed accordingly, considering the
    // "opts.trimOnlySpaces" of course.


    if ((!originalOpts || !originalOpts.cb) && rangesToDelete.current()) {
      // check front - the first range of gathered ranges, does it touch start (0)
      if (rangesToDelete.current()[0] && !rangesToDelete.current()[0][0]) {
        var startingIdx = rangesToDelete.current()[0][1]; // check the character at str[startingIdx]
        // call to current() merges and sorts, mutating but cleaning array.

        rangesToDelete.current(); // hard edit:

        rangesToDelete.ranges[0] = [rangesToDelete.ranges[0][0], rangesToDelete.ranges[0][1]];
      } // check end - the last range of gathered ranges, does it touch the end (str.length)
      // PS. remember ending is not inclusive, so ranges covering the whole ending
      // would go up to str.length, not up to str.length - 1!


      if (rangesToDelete.current()[rangesToDelete.current().length - 1] && rangesToDelete.current()[rangesToDelete.current().length - 1][1] === str.length) {
        var _startingIdx = rangesToDelete.current()[rangesToDelete.current().length - 1][0]; // check character at str[startingIdx - 1]
        // remove third element from the last range "what to add" - because
        // ranges will crop aggressively, covering all whitespace, but they
        // then restore missing spaces (in which case it's not missing).
        // We already have tight crop, we just need to remove that "what to add"
        // third element.
        // call to current() merges and sorts, mutating but cleaning array.

        rangesToDelete.current(); // hard edit:

        var startingIdx2 = rangesToDelete.ranges[rangesToDelete.ranges.length - 1][0];

        if (str[startingIdx2 - 1] && (opts.trimOnlySpaces && str[startingIdx2 - 1] === " " || !opts.trimOnlySpaces && !str[startingIdx2 - 1].trim())) {
          startingIdx2 -= 1;
        }

        var backupWhatToAdd = rangesToDelete.ranges[rangesToDelete.ranges.length - 1][2];
        rangesToDelete.ranges[rangesToDelete.ranges.length - 1] = [startingIdx2, rangesToDelete.ranges[rangesToDelete.ranges.length - 1][1]]; // for cases of opts.dumpLinkHrefsNearby

        if (backupWhatToAdd && backupWhatToAdd.trim()) {
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1].push(backupWhatToAdd.trimEnd());
        }
      }
    }

    var res = {
      log: {
        timeTakenInMilliseconds: Date.now() - start
      },
      result: rangesApply(str, rangesToDelete.current()),
      ranges: rangesToDelete.current(),
      allTagLocations: allTagLocations,
      filteredTagLocations: filteredTagLocations
    };
    return res;
  }

  return stripHtml;

})));

/**
 * csv-sort
 * Sorts double-entry bookkeeping CSV coming from internet banking
 * Version: 3.0.72
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/csv-sort/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.csvSort = factory());
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
   * ranges-sort
   * Sort string index ranges
   * Version: 3.13.2
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
   * Version: 3.0.1
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

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var isNumeric = createCommonjsModule(function (module, exports) {
    (function (root) {

      function isNumeric(v, opts) {
        if (!(opts instanceof Object)) {
          opts = {
            trim: true
          };
        }

        if (typeof v === 'number' && !isNaN(v)) return true;
        v = (v || '').toString();

        if ('trim' in opts && !opts.trim) {
          return !/\s/.test(v);
        }

        v = v.trim();
        if (!v) return false;
        return !isNaN(v);
      }

      {
        if ( module.exports) {
          exports = module.exports = isNumeric;
        }

        exports.isNumeric = isNumeric;
      }
    })();
  });

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

  function remSep(str, originalOpts) {
    var allOK = true;
    var knownSeparatorsArray = [".", ",", "'", " "];
    var firstSeparator;

    if (typeof str !== "string") {
      throw new TypeError("string-remove-thousand-separators/remSep(): [THROW_ID_01] Input must be string! Currently it's: ".concat(_typeof(str), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }

    if (originalOpts !== undefined && originalOpts !== null && !lodash_isplainobject(originalOpts)) {
      throw new TypeError("string-remove-thousand-separators/remSep(): [THROW_ID_02] Options object must be a plain object! Currently it's: ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
    }

    var defaults = {
      removeThousandSeparatorsFromNumbers: true,
      padSingleDecimalPlaceNumbers: true,
      forceUKStyle: false
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    var res = lodash_trim(str.trim(), '"');

    if (res === "") {
      return res;
    }

    var rangesToDelete = new Ranges();

    for (var i = 0, len = res.length; i < len; i++) {
      if (opts.removeThousandSeparatorsFromNumbers && res[i].trim() === "") {
        rangesToDelete.add(i, i + 1);
      }

      if (opts.removeThousandSeparatorsFromNumbers && res[i] === "'") {
        rangesToDelete.add(i, i + 1);

        if (res[i + 1] === "'") {
          allOK = false;
          break;
        }
      }

      if (knownSeparatorsArray.includes(res[i])) {
        if (res[i + 1] !== undefined && isNumeric(res[i + 1])) {
          if (res[i + 2] !== undefined) {
            if (isNumeric(res[i + 2])) {
              if (res[i + 3] !== undefined) {
                if (isNumeric(res[i + 3])) {
                  if (res[i + 4] !== undefined && isNumeric(res[i + 4])) {
                    allOK = false;
                    break;
                  } else {
                    if (opts.removeThousandSeparatorsFromNumbers) {
                      rangesToDelete.add(i, i + 1);
                    }

                    if (!firstSeparator) {
                      firstSeparator = res[i];
                    } else if (res[i] !== firstSeparator) {
                      allOK = false;
                      break;
                    }
                  }
                } else {
                  allOK = false;
                  break;
                }
              } else if (opts.removeThousandSeparatorsFromNumbers && opts.forceUKStyle && res[i] === ",") {
                rangesToDelete.add(i, i + 1, ".");
              }
            } else {
              allOK = false;
              break;
            }
          } else {
            if (opts.forceUKStyle && res[i] === ",") {
              rangesToDelete.add(i, i + 1, ".");
            }

            if (opts.padSingleDecimalPlaceNumbers) {
              rangesToDelete.add(i + 2, i + 2, "0");
            }
          }
        }
      } else if (!isNumeric(res[i])) {
        allOK = false;
        break;
      }
    }

    if (allOK && rangesToDelete.current()) {
      return rangesApply(res, rangesToDelete.current());
    }

    return res;
  }

  function splitEasy(str, originalOpts) {
    var colStarts = 0;
    var lineBreakStarts = 0;
    var rowArray = [];
    var resArray = [];
    var ignoreCommasThatFollow = false;
    var thisRowContainsOnlyEmptySpace = true;

    if (originalOpts && _typeof(originalOpts) !== "object") {
      throw new Error("csv-split-easy/split(): [THROW_ID_02] Options object must be a plain object! Currently it's of a type ".concat(_typeof(originalOpts), " equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
    }

    var defaults = {
      removeThousandSeparatorsFromNumbers: true,
      padSingleDecimalPlaceNumbers: true,
      forceUKStyle: false
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    if (typeof str !== "string") {
      throw new TypeError("csv-split-easy/split(): [THROW_ID_04] input must be string! Currently it's: ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
    } else {
      if (str === "") {
        return [[""]];
      }

      str = str.trim();
    }

    for (var i = 0, len = str.length; i < len; i++) {
      if (thisRowContainsOnlyEmptySpace && str[i] !== '"' && str[i] !== "," && str[i].trim() !== "") {
        thisRowContainsOnlyEmptySpace = false;
      }

      if (str[i] === '"') {
        if (ignoreCommasThatFollow && str[i + 1] === '"') {
          i += 1;
        } else if (ignoreCommasThatFollow) {
          ignoreCommasThatFollow = false;
          var newElem = str.slice(colStarts, i);

          if (newElem.trim() !== "") {
            thisRowContainsOnlyEmptySpace = false;
          }

          var processedElem = /""/.test(newElem) ? newElem.replace(/""/g, '"') : remSep(newElem, {
            removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
            padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
            forceUKStyle: opts.forceUKStyle
          });
          rowArray.push(processedElem);
        } else {
          ignoreCommasThatFollow = true;
          colStarts = i + 1;
        }
      } else if (!ignoreCommasThatFollow && str[i] === ",") {
        if (str[i - 1] !== '"' && !ignoreCommasThatFollow) {
          var _newElem = str.slice(colStarts, i);

          if (_newElem.trim() !== "") {
            thisRowContainsOnlyEmptySpace = false;
          }

          rowArray.push(remSep(_newElem, {
            removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
            padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
            forceUKStyle: opts.forceUKStyle
          }));
        }

        colStarts = i + 1;

        if (lineBreakStarts) {
          lineBreakStarts = 0;
        }
      } else if (str[i] === "\n" || str[i] === "\r") {
        if (!lineBreakStarts) {
          lineBreakStarts = i;

          if (!ignoreCommasThatFollow && str[i - 1] !== '"') {
            var _newElem2 = str.slice(colStarts, i);

            if (_newElem2.trim() !== "") {
              thisRowContainsOnlyEmptySpace = false;
            }

            rowArray.push(remSep(_newElem2, {
              removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
              forceUKStyle: opts.forceUKStyle
            }));
          }

          if (!thisRowContainsOnlyEmptySpace) {
            resArray.push(rowArray);
          } else {
            rowArray.length = 0;
          }

          thisRowContainsOnlyEmptySpace = true;
          rowArray = [];
        }

        colStarts = i + 1;
      } else if (lineBreakStarts) {
        lineBreakStarts = 0;
        colStarts = i;
      }

      if (i + 1 === len) {
        if (str[i] !== '"') {
          var _newElem3 = str.slice(colStarts, i + 1);

          if (_newElem3.trim()) {
            thisRowContainsOnlyEmptySpace = false;
          }

          rowArray.push(remSep(_newElem3, {
            removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
            padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
            forceUKStyle: opts.forceUKStyle
          }));
        }

        if (!thisRowContainsOnlyEmptySpace) {
          resArray.push(rowArray);
        } else {
          rowArray = [];
        }

        thisRowContainsOnlyEmptySpace = true;
      }
    }

    if (resArray.length === 0) {
      return [[""]];
    }

    return resArray;
  }

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

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
   * @param {Array} array The array to search.
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
   * @param {Array} array The array to search.
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
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
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
  /** Used for built-in method references. */


  var arrayProto = Array.prototype;
  /** Built-in value references. */

  var splice = arrayProto.splice;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeMax = Math.max;
  /**
   * The base implementation of `_.pullAllBy` without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to remove.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns `array`.
   */

  function basePullAll(array, values, iteratee, comparator) {
    var indexOf = comparator ? baseIndexOfWith : baseIndexOf$1,
        index = -1,
        length = values.length,
        seen = array;

    if (array === values) {
      values = copyArray(values);
    }

    if (iteratee) {
      seen = arrayMap(array, baseUnary(iteratee));
    }

    while (++index < length) {
      var fromIndex = 0,
          value = values[index],
          computed = iteratee ? iteratee(value) : value;

      while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
        if (seen !== array) {
          splice.call(seen, fromIndex, 1);
        }

        splice.call(array, fromIndex, 1);
      }
    }

    return array;
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
   * Removes all given values from `array` using
   * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
   * to remove elements from an array by predicate.
   *
   * @static
   * @memberOf _
   * @since 2.0.0
   * @category Array
   * @param {Array} array The array to modify.
   * @param {...*} [values] The values to remove.
   * @returns {Array} Returns `array`.
   * @example
   *
   * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
   *
   * _.pull(array, 'a', 'c');
   * console.log(array);
   * // => ['b', 'b']
   */


  var pull = baseRest(pullAll);
  /**
   * This method is like `_.pull` except that it accepts an array of values to remove.
   *
   * **Note:** Unlike `_.difference`, this method mutates `array`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {Array} array The array to modify.
   * @param {Array} values The values to remove.
   * @returns {Array} Returns `array`.
   * @example
   *
   * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
   *
   * _.pullAll(array, ['a', 'c']);
   * console.log(array);
   * // => ['b', 'b']
   */

  function pullAll(array, values) {
    return array && array.length && values && values.length ? basePullAll(array, values) : array;
  }

  var lodash_pull = pull;

  /*!
   * currency.js - v2.0.3
   * http://scurker.github.io/currency.js
   *
   * Copyright (c) 2020 Jason Wilson
   * Released under MIT license
   */
  var defaults = {
    symbol: '$',
    separator: ',',
    decimal: '.',
    errorOnInvalid: false,
    precision: 2,
    pattern: '!#',
    negativePattern: '-!#',
    format: format,
    fromCents: false
  };

  var round = function round(v) {
    return Math.round(v);
  };

  var pow = function pow(p) {
    return Math.pow(10, p);
  };

  var rounding = function rounding(value, increment) {
    return round(value / increment) * increment;
  };

  var groupRegex = /(\d)(?=(\d{3})+\b)/g;
  var vedicRegex = /(\d)(?=(\d\d)+\d\b)/g;
  /**
   * Create a new instance of currency.js
   * @param {number|string|currency} value
   * @param {object} [opts]
   */

  function currency(value, opts) {
    var that = this;

    if (!(that instanceof currency)) {
      return new currency(value, opts);
    }

    var settings = Object.assign({}, defaults, opts),
        precision = pow(settings.precision),
        v = parse(value, settings);
    that.intValue = v;
    that.value = v / precision; // Set default incremental value

    settings.increment = settings.increment || 1 / precision; // Support vedic numbering systems
    // see: https://en.wikipedia.org/wiki/Indian_numbering_system

    if (settings.useVedic) {
      settings.groups = vedicRegex;
    } else {
      settings.groups = groupRegex;
    } // Intended for internal usage only - subject to change


    this.s = settings;
    this.p = precision;
  }

  function parse(value, opts) {
    var useRounding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var v = 0,
        decimal = opts.decimal,
        errorOnInvalid = opts.errorOnInvalid,
        decimals = opts.precision,
        fromCents = opts.fromCents,
        precision = pow(decimals),
        isNumber = typeof value === 'number',
        isCurrency = value instanceof currency;

    if (isCurrency && fromCents) {
      return value.intValue;
    }

    if (isNumber || isCurrency) {
      v = isCurrency ? value.value : value;
    } else if (typeof value === 'string') {
      var regex = new RegExp('[^-\\d' + decimal + ']', 'g'),
          decimalString = new RegExp('\\' + decimal, 'g');
      v = value.replace(/\((.*)\)/, '-$1') // allow negative e.g. (1.99)
      .replace(regex, '') // replace any non numeric values
      .replace(decimalString, '.'); // convert any decimal values

      v = v || 0;
    } else {
      if (errorOnInvalid) {
        throw Error('Invalid Input');
      }

      v = 0;
    }

    if (!fromCents) {
      v *= precision; // scale number to integer value

      v = v.toFixed(4); // Handle additional decimal for proper rounding.
    }

    return useRounding ? round(v) : v;
  }
  /**
   * Formats a currency object
   * @param currency
   * @param {object} [opts]
   */


  function format(currency, settings) {
    var pattern = settings.pattern,
        negativePattern = settings.negativePattern,
        symbol = settings.symbol,
        separator = settings.separator,
        decimal = settings.decimal,
        groups = settings.groups,
        split = ('' + currency).replace(/^-/, '').split('.'),
        dollars = split[0],
        cents = split[1];
    return (currency.value >= 0 ? pattern : negativePattern).replace('!', symbol).replace('#', dollars.replace(groups, '$1' + separator) + (cents ? decimal + cents : ''));
  }

  currency.prototype = {
    /**
     * Adds values together.
     * @param {number} number
     * @returns {currency}
     */
    add: function add(number) {
      var intValue = this.intValue,
          _settings = this.s,
          _precision = this.p;
      return currency((intValue += parse(number, _settings)) / (_settings.fromCents ? 1 : _precision), _settings);
    },

    /**
     * Subtracts value.
     * @param {number} number
     * @returns {currency}
     */
    subtract: function subtract(number) {
      var intValue = this.intValue,
          _settings = this.s,
          _precision = this.p;
      return currency((intValue -= parse(number, _settings)) / (_settings.fromCents ? 1 : _precision), _settings);
    },

    /**
     * Multiplies values.
     * @param {number} number
     * @returns {currency}
     */
    multiply: function multiply(number) {
      var intValue = this.intValue,
          _settings = this.s;
      return currency((intValue *= number) / (_settings.fromCents ? 1 : pow(_settings.precision)), _settings);
    },

    /**
     * Divides value.
     * @param {number} number
     * @returns {currency}
     */
    divide: function divide(number) {
      var intValue = this.intValue,
          _settings = this.s;
      return currency(intValue /= parse(number, _settings, false), _settings);
    },

    /**
     * Takes the currency amount and distributes the values evenly. Any extra pennies
     * left over from the distribution will be stacked onto the first set of entries.
     * @param {number} count
     * @returns {array}
     */
    distribute: function distribute(count) {
      var intValue = this.intValue,
          _precision = this.p,
          _settings = this.s,
          distribution = [],
          split = Math[intValue >= 0 ? 'floor' : 'ceil'](intValue / count),
          pennies = Math.abs(intValue - split * count),
          precision = _settings.fromCents ? 1 : _precision;

      for (; count !== 0; count--) {
        var item = currency(split / precision, _settings); // Add any left over pennies

        pennies-- > 0 && (item = item[intValue >= 0 ? 'add' : 'subtract'](1 / precision));
        distribution.push(item);
      }

      return distribution;
    },

    /**
     * Returns the dollar value.
     * @returns {number}
     */
    dollars: function dollars() {
      return ~~this.value;
    },

    /**
     * Returns the cent value.
     * @returns {number}
     */
    cents: function cents() {
      var intValue = this.intValue,
          _precision = this.p;
      return ~~(intValue % _precision);
    },

    /**
     * Formats the value as a string according to the formatting settings.
     * @param {boolean} useSymbol - format with currency symbol
     * @returns {string}
     */
    format: function format(options) {
      var _settings = this.s;

      if (typeof options === 'function') {
        return options(this, _settings);
      }

      return _settings.format(this, Object.assign({}, _settings, options));
    },

    /**
     * Formats the value as a string according to the formatting settings.
     * @returns {string}
     */
    toString: function toString() {
      var intValue = this.intValue,
          _precision = this.p,
          _settings = this.s;
      return rounding(intValue / _precision, _settings.increment).toFixed(_settings.precision);
    },

    /**
     * Value for JSON serialization.
     * @returns {float}
     */
    toJSON: function toJSON() {
      return this.value;
    }
  };

  var currencySigns = ["د.إ", "؋", "L", "֏", "ƒ", "Kz", "$", "ƒ", "₼", "KM", "৳", "лв", ".د.ب", "FBu", "$b", "R$", "฿", "Nu.", "P", "p.", "BZ$", "FC", "CHF", "¥", "₡", "₱", "Kč", "Fdj", "kr", "RD$", "دج", "kr", "Nfk", "Br", "Ξ", "€", "₾", "₵", "GH₵", "D", "FG", "Q", "L", "kn", "G", "Ft", "Rp", "₪", "₹", "ع.د", "﷼", "kr", "J$", "JD", "¥", "KSh", "лв", "៛", "CF", "₩", "₩", "KD", "лв", "₭", "₨", "M", "Ł", "Lt", "Ls", "LD", "MAD", "lei", "Ar", "ден", "K", "₮", "MOP$", "UM", "₨", "Rf", "MK", "RM", "MT", "₦", "C$", "kr", "₨", "﷼", "B/.", "S/.", "K", "₱", "₨", "zł", "Gs", "﷼", "￥", "lei", "Дин.", "₽", "R₣", "﷼", "₨", "ج.س.", "kr", "£", "Le", "S", "Db", "E", "฿", "SM", "T", "د.ت", "T$", "₤", "₺", "TT$", "NT$", "TSh", "₴", "USh", "$U", "лв", "Bs", "₫", "VT", "WS$", "FCFA", "Ƀ", "CFA", "₣", "﷼", "R", "Z$"];

  function findType(something) {
    /* istanbul ignore next */
    if (typeof something !== "string") {
      throw new Error("csv-sort/util/findType(): input must be string! Currently it's: ".concat(_typeof(something)));
    }

    if (isNumeric(something)) {
      return "numeric";
    }
    /* istanbul ignore next */


    if (currencySigns.some(function (singleSign) {
      return (// We remove all known currency symbols one by one from this input string.
        // If at least one passes as numeric after the currency symbol-removing, it's numeric.
        isNumeric(something.replace(singleSign, "").replace(/[,.]/g, ""))
      );
    })) {
      return "numeric";
    }

    if (!something.trim()) {
      return "empty";
    }

    return "text";
  }

  function csvSort(input) {
    var content;
    var msgContent = null;
    var msgType = null; // step 1.
    // ===========================
    // depends what was passed in,

    if (typeof input === "string") {
      if (input.length === 0) {
        return [[""]];
      }

      content = splitEasy(input);
    } else if (Array.isArray(input)) {
      var culpritVal;
      var culpritIndex;
      /* istanbul ignore else */

      if (!input.every(function (val, index) {
        /* istanbul ignore else */
        if (!Array.isArray(val)) {
          culpritVal = val;
          culpritIndex = index;
        }

        return Array.isArray(val);
      })) {
        throw new TypeError("csv-sort/csvSort(): [THROW_ID_01] the input is array as expected, but not all of its children are arrays! For example, the element at index ".concat(culpritIndex, " is not array but: ").concat(_typeof(culpritVal), ", equal to:\n").concat(JSON.stringify(culpritVal, null, 4)));
      }
    } else {
      throw new TypeError("csv-sort/csvSort(): [THROW_ID_02] The input is of a wrong type! We accept either string of array of arrays. We got instead: ".concat(_typeof(input), ", equal to:\n").concat(JSON.stringify(input, null, 4)));
    } // step 2.
    // ===========================
    // - iterate from the bottom
    // - calculate schema as you go to save calculation rounds
    // - first row can have different amount of columns
    // - think about 2D trim feature


    var schema = null;
    var stateHeaderRowPresent = false;
    var stateDataColumnRowLengthIsConsistent = true;
    var stateColumnsContainingSameValueEverywhere = []; // used for 2D trimming:

    var indexAtWhichEmptyCellsStart = null;

    for (var i = content.length - 1; i >= 0; i--) {
      if (!schema) {
        // prevention against last blank row:

        /* istanbul ignore next */
        if (content[i].length !== 1 || content[i][0] !== "") {
          schema = [];

          for (var y = 0, len = content[i].length; y < len; y++) {
            schema.push(findType(content[i][y].trim()));

            if (indexAtWhichEmptyCellsStart === null && findType(content[i][y].trim()) === "empty") {
              indexAtWhichEmptyCellsStart = y;
            }

            if (indexAtWhichEmptyCellsStart !== null && findType(content[i][y].trim()) !== "empty") {
              indexAtWhichEmptyCellsStart = null;
            }
          }
        }
      } else {
        if (i === 0) {
          // Check is this header row.
          // Header rows should consist of only text content.
          // Let's iterate through all elements and find out.
          stateHeaderRowPresent = content[i].every(function (el) {
            return findType(el) === "text" || findType(el) === "empty";
          }); // if schema was calculated (this means there's header row and at least one content row),
          // find out if the column length in the header differs from schema's
          // if (stateHeaderRowPresent && (schema.length !== content[i].length)) {
          // }
        }
        /* istanbul ignore else */


        if (!stateHeaderRowPresent && schema.length !== content[i].length) {
          stateDataColumnRowLengthIsConsistent = false;
        }

        var perRowIndexAtWhichEmptyCellsStart = null;

        for (var _y = 0, _len = content[i].length; _y < _len; _y++) {
          // trim

          /* istanbul ignore else */
          if (perRowIndexAtWhichEmptyCellsStart === null && findType(content[i][_y].trim()) === "empty") {
            perRowIndexAtWhichEmptyCellsStart = _y;
          }
          /* istanbul ignore else */


          if (perRowIndexAtWhichEmptyCellsStart !== null && findType(content[i][_y].trim()) !== "empty") {
            perRowIndexAtWhichEmptyCellsStart = null;
          } // checking schema

          /* istanbul ignore else */


          if (findType(content[i][_y].trim()) !== schema[_y] && !stateHeaderRowPresent) {
            var toAdd = findType(content[i][_y].trim());
            /* istanbul ignore else */

            if (Array.isArray(schema[_y])) {
              if (!schema[_y].includes(toAdd)) {
                schema[_y].push(findType(content[i][_y].trim()));
              }
            } else if (schema[_y] !== toAdd) {
              var temp = schema[_y];
              schema[_y] = [];

              schema[_y].push(temp);

              schema[_y].push(toAdd);
            }
          }
        } // when row has finished, get the perRowIndexAtWhichEmptyCellsStart
        // that's to cover cases where last row got schema calculated, but it
        // had more empty columns than the following rows:
        //
        // [8, 9, 0, 1,  ,  ]
        // [4, 5, 6, 7,  ,  ] <<< perRowIndexAtWhichEmptyCellsStart would be 3 (indexes start at zero)
        // [1, 2, 3,  ,  ,  ] <<< indexAtWhichEmptyCellsStart would be here 2 (indexes start at zero)
        //
        // as a result, indexAtWhichEmptyCellsStart above would be assigned to 3, not 2
        //
        // That's still an achievement, we "trimmed" CSV by two places.
        // I'm saying "trimmed", but we're not really trimming yet, we're only
        // setting inner variable which we will later use to limit the traversal,
        // so algorithm skips those empty columns.
        //

        /* istanbul ignore next */


        if (indexAtWhichEmptyCellsStart !== null && perRowIndexAtWhichEmptyCellsStart !== null && perRowIndexAtWhichEmptyCellsStart > indexAtWhichEmptyCellsStart && (!stateHeaderRowPresent || stateHeaderRowPresent && i !== 0)) {
          indexAtWhichEmptyCellsStart = perRowIndexAtWhichEmptyCellsStart;
        }
      }
    }
    /* istanbul ignore else */


    if (!indexAtWhichEmptyCellsStart) {
      indexAtWhichEmptyCellsStart = schema.length;
    } // find out at which index non-empty columns start. This is effectively left-side trimming.


    var nonEmptyColsStartAt = 0;

    for (var _i = 0, _len2 = schema.length; _i < _len2; _i++) {
      if (schema[_i] === "empty") {
        nonEmptyColsStartAt = _i;
      } else {
        break;
      }
    } // if there are empty column in front, trim (via slice) both content and schema

    /* istanbul ignore else */


    if (nonEmptyColsStartAt !== 0) {
      content = content.map(function (arr) {
        return arr.slice(nonEmptyColsStartAt + 1, indexAtWhichEmptyCellsStart);
      });
      schema = schema.slice(nonEmptyColsStartAt + 1, indexAtWhichEmptyCellsStart);
    } // step 3.
    // ===========================
    // CHALLENGE: without any assumptions, identify "current balance" and "debit",
    // "credit" columns by analysing their values.
    //
    // - double entry accounting rows will have the "current balance" which will
    //   be strictly numeric, and will be present across all rows. These are the
    //   two first signs of a "current balance" column.
    // - "current balance" should also match up with at least one field under it,
    //   if subracted/added the value from one field in its row
    // swoop in traversing the schema array to get "numeric" columns:
    // ----------------


    var numericSchemaColumns = [];
    var balanceColumnIndex;
    schema.forEach(function (colType, i) {
      if (colType === "numeric") {
        numericSchemaColumns.push(i);
      }
    });
    var traverseUpToThisIndexAtTheTop = stateHeaderRowPresent ? 1 : 0;

    if (numericSchemaColumns.length === 1) {
      // Bob's your uncle, the only numeric column is your Balance column
      balanceColumnIndex = numericSchemaColumns[0];
    } else if (numericSchemaColumns.length === 0) {
      throw new Error('csv-sort/csvSort(): [THROW_ID_03] Your CSV file does not contain numeric-only columns and computer was not able to detect the "Balance" column!');
    } else {
      // So (numericSchemaColumns > 0) and we'll have to do some work.
      // Fine.
      //
      // Clone numericSchemaColumns array, remove columns that have the same value
      // among consecutive rows.
      // For example, accounting CSV's will have "Account number" repeated.
      // Balance is never the same on two rows, otherwise what's the point of
      // accounting if nothing happened?
      // Traverse the CSV vertically on each column from numericSchemaColumns and
      // find out `balanceColumnIndex`:
      // ----------------
      var potentialBalanceColumnIndexesList = Array.from(numericSchemaColumns); // iterate through `potentialBalanceColumnIndexesList`

      var deleteFromPotentialBalanceColumnIndexesList = [];

      for (var _i2 = 0, _len3 = potentialBalanceColumnIndexesList.length; _i2 < _len3; _i2++) {
        // if any two rows are in sequence currently and they are equal, this column is out
        var suspectedBalanceColumnsIndexNumber = potentialBalanceColumnIndexesList[_i2]; // we traverse column suspected to be "Balance" with index `index` vertically,
        // from the top to bottom. Depending if there's heading row, we start at 0 or 1,
        // which is set by `traverseUpToThisIndexAtTheTop`.
        // We will look for two rows having the same value. If it's found that column is
        // not "Balance":
        // EASY ATTEMPT TO RULE-OUT NOT-BALANCE COLUMNS

        var previousValue = void 0; // to check if two consecutive are the same

        var lookForTwoEqualAndConsecutive = true;
        var firstValue = void 0; // to check if all are the same

        var lookForAllTheSame = true;

        for (var rowNum = traverseUpToThisIndexAtTheTop, len2 = content.length; rowNum < len2; rowNum++) {
          // 1. check for two consecutive equal values

          /* istanbul ignore else */
          if (lookForTwoEqualAndConsecutive) {
            // deliberate == to catch undefined and null
            if (previousValue == null) {
              previousValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
            } else if (previousValue === content[rowNum][suspectedBalanceColumnsIndexNumber]) {
              // potentialBalanceColumnIndexesList.splice(suspectedBalanceColumnsIndexNumber, 1)
              // don't mutate the `potentialBalanceColumnIndexesList`, do it later.
              // Let's compile TO-DELETE list instead:
              deleteFromPotentialBalanceColumnIndexesList.push(suspectedBalanceColumnsIndexNumber);
              lookForTwoEqualAndConsecutive = false;
            } else {
              previousValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
            }
          } // 2. also, tell if ALL values are the same:

          /* istanbul ignore else */


          if (lookForAllTheSame) {
            // deliberate == to catch undefined and null
            if (firstValue == null) {
              firstValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
            } else if (content[rowNum][suspectedBalanceColumnsIndexNumber] !== firstValue) {
              lookForAllTheSame = false;
            }
          }

          if (!lookForTwoEqualAndConsecutive) {
            break;
          }
        }
        /* istanbul ignore else */


        if (lookForAllTheSame) {
          stateColumnsContainingSameValueEverywhere.push(suspectedBalanceColumnsIndexNumber);
        }
      } // now mutate the `potentialBalanceColumnIndexesList` using
      // `deleteFromPotentialBalanceColumnIndexesList`:


      potentialBalanceColumnIndexesList = lodash_pull.apply(void 0, [potentialBalanceColumnIndexesList].concat(deleteFromPotentialBalanceColumnIndexesList));
      /* istanbul ignore else */

      if (potentialBalanceColumnIndexesList.length === 1) {
        balanceColumnIndex = potentialBalanceColumnIndexesList[0];
      } else if (potentialBalanceColumnIndexesList.length === 0) {
        throw new Error('csv-sort/csvSort(): [THROW_ID_04] The computer can\'t find the "Balance" column! It saw some numeric-only columns, but they all seem to have certain rows with the same values as rows right below/above them!');
      } else ; // at this point 99% of normal-size, real-life bank account CSV's should have
      // "Balance" column identified because there will be both "Credit" and "Debit"
      // transaction rows which will be not exclusively numeric, but ["empty", "numeric"] type.
      // Even Lloyds Business banking CSV's that output account numbers
      // will have "Balance" column identified this stage.

    }

    if (!balanceColumnIndex) {
      throw new Error("csv-sort/csvSort(): [THROW_ID_05] Sadly computer couldn't find its way in this CSV and had to stop working on it.");
    } // step 4.
    // ===========================
    // query the schema and find out potential Credit/Debit columns
    // take schema, filter all indexes that are equal to or are arrays and have
    // "numeric" among their values, then remove the index of "Balance" column:


    var potentialCreditDebitColumns = lodash_pull.apply(void 0, [Array.from(schema.reduce(function (result, el, index) {
      if (typeof el === "string" && el === "numeric" || Array.isArray(el) && el.includes("numeric")) {
        result.push(index);
      }

      return result;
    }, [])), balanceColumnIndex].concat(stateColumnsContainingSameValueEverywhere)); // step 5.
    // ===========================

    var resContent = []; // Now that we know the `balanceColumnIndex`, traverse the CSV rows again,
    // assembling a new array
    // step 5.1. Put the last row into the new array.
    // ---------------------------------------------------------------------------
    // Worst case scenario, if it doesn't match with anything, we'll throw in the end.
    // For now, let's assume CSV is correct, only rows are mixed.

    resContent.push(content[content.length - 1].slice(0, indexAtWhichEmptyCellsStart));
    var usedUpRows = [];
    var bottom = stateHeaderRowPresent ? 1 : 0;

    for (var _y2 = content.length - 2; _y2 >= bottom; _y2--) {
      // for each row above the last-one (which is already in place), we'll traverse
      // all the rows above to find the match.
      // go through all the rows and pick the right row which matches to the above:
      for (var suspectedRowsIndex = content.length - 2; suspectedRowsIndex >= bottom; suspectedRowsIndex--) {
        if (!usedUpRows.includes(suspectedRowsIndex)) {
          // go through each of the suspected Credit/Debit columns:
          var thisRowIsDone = false;

          for (var suspectedColIndex = 0, _len4 = potentialCreditDebitColumns.length; suspectedColIndex < _len4; suspectedColIndex++) {
            var diffVal = null;

            if (content[suspectedRowsIndex][potentialCreditDebitColumns[suspectedColIndex]] !== "") {
              diffVal = currency(content[suspectedRowsIndex][potentialCreditDebitColumns[suspectedColIndex]]);
            }

            var totalVal = null;
            /* istanbul ignore else */

            if (content[suspectedRowsIndex][balanceColumnIndex] !== "") {
              totalVal = currency(content[suspectedRowsIndex][balanceColumnIndex]);
            }

            var topmostResContentBalance = null;
            /* istanbul ignore else */

            if (resContent[0][balanceColumnIndex] !== "") {
              topmostResContentBalance = currency(resContent[0][balanceColumnIndex]).format();
            }

            var currentRowsDiffVal = null;
            /* istanbul ignore else */

            if (resContent[resContent.length - 1][potentialCreditDebitColumns[suspectedColIndex]] !== "") {
              currentRowsDiffVal = currency(resContent[resContent.length - 1][potentialCreditDebitColumns[suspectedColIndex]]).format();
            }

            var lastResContentRowsBalance = null;
            /* istanbul ignore else */

            if (resContent[resContent.length - 1][balanceColumnIndex] !== "") {
              lastResContentRowsBalance = currency(resContent[resContent.length - 1][balanceColumnIndex]);
            }
            /* istanbul ignore else */


            if (diffVal && totalVal.add(diffVal).format() === topmostResContentBalance) {
              // ADD THIS ROW ABOVE EVERYTHING
              // add this row above the current HEAD in resContent lines array (index `0`)
              resContent.unshift(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
              usedUpRows.push(suspectedRowsIndex);
              thisRowIsDone = true;
              break;
            } else if (diffVal && totalVal.subtract(diffVal).format() === topmostResContentBalance) {
              // ADD THIS ROW ABOVE EVERYTHING
              resContent.unshift(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
              usedUpRows.push(suspectedRowsIndex);
              thisRowIsDone = true;
              break;
            } else if (currentRowsDiffVal && lastResContentRowsBalance.add(currentRowsDiffVal).format() === totalVal.format()) {
              // ADD THIS ROW BELOW EVERYTHING
              resContent.push(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
              usedUpRows.push(suspectedRowsIndex);
              thisRowIsDone = true;
              break;
            } else if (currentRowsDiffVal && lastResContentRowsBalance.subtract(currentRowsDiffVal).format() === totalVal.format()) {
              // ADD THIS ROW BELOW EVERYTHING
              resContent.push(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
              usedUpRows.push(suspectedRowsIndex);
              thisRowIsDone = true;
              break;
            }
          }
          /* istanbul ignore else */


          if (thisRowIsDone) {
            thisRowIsDone = false;
            break;
          }
        }
      }
    } // restore title row if present

    /* istanbul ignore else */


    if (stateHeaderRowPresent) {
      // trim header row of trailing empty columns if they protrude outside of the (consistent row length) schema
      if (stateDataColumnRowLengthIsConsistent && content[0].length > schema.length) {
        content[0].length = schema.length;
      } // push header row on top of the results array:


      resContent.unshift(content[0].slice(0, indexAtWhichEmptyCellsStart));
    }
    /* istanbul ignore else */


    if (content.length - (stateHeaderRowPresent ? 2 : 1) !== usedUpRows.length) {
      msgContent = "Not all rows were recognised!";
      msgType = "alert";
    }

    return {
      res: resContent,
      msgContent: msgContent,
      msgType: msgType
    };
  }

  return csvSort;

})));

/**
 * csv-split-easy
 * Splits the CSV string into array of arrays, each representing a row of columns
 * Version: 5.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/csv-split-easy/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.csvSplitEasy = {}));
}(this, (function (exports) { 'use strict';

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

var version = "5.0.0";

var defaults = {
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null
};

function rSort(arrOfRanges, originalOptions) {
  // quick ending
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return arrOfRanges;
  } // fill any settings with defaults if missing:


  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions); // arrOfRanges validation


  var culpritsIndex;
  var culpritsLen; // validate does every range consist of exactly two indexes:

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
    throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, " + culpritsIndex + "th range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 4) + ") has not two but " + culpritsLen + " elements!");
  } // validate are range indexes natural numbers:


  if (!arrOfRanges.filter(function (range) {
    return range;
  }).every(function (rangeArr, indx) {
    if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
      culpritsIndex = indx;
      return false;
    }

    return true;
  })) {
    throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, " + culpritsIndex + "th range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 4) + ") does not consist of only natural numbers!");
  } // let's assume worst case scenario is N x N.


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

var defaults$1 = {
  mergeType: 1,
  progressFn: null,
  joinRangesThatTouchEdges: true
}; // merges the overlapping ranges
// case #1. exact extension:
// [ [1, 5], [5, 10] ] => [ [1, 10] ]
// case #2. overlap:
// [ [1, 4], [3, 5] ] => [ [1, 5] ]

function rMerge(arrOfRanges, originalOpts) {
  //
  // internal functions:
  // ---------------------------------------------------------------------------
  function isObj(something) {
    return something && typeof something === "object" && !Array.isArray(something);
  } // quick ending:
  // ---------------------------------------------------------------------------


  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return null;
  }

  var opts;

  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = _objectSpread2(_objectSpread2({}, defaults$1), originalOpts); // 1. validate opts.progressFn

      if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
        opts.progressFn = null;
      } else if (opts.progressFn && typeof opts.progressFn !== "function") {
        throw new Error("ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: \"" + typeof opts.progressFn + "\", equal to " + JSON.stringify(opts.progressFn, null, 4));
      } // 2. validate opts.mergeType


      if (opts.mergeType && +opts.mergeType !== 1 && +opts.mergeType !== 2) {
        throw new Error("ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"" + typeof opts.mergeType + "\", equal to " + JSON.stringify(opts.mergeType, null, 4));
      } // 3. validate opts.joinRangesThatTouchEdges


      if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
        throw new Error("ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: \"" + typeof opts.joinRangesThatTouchEdges + "\", equal to " + JSON.stringify(opts.joinRangesThatTouchEdges, null, 4));
      }
    } else {
      throw new Error("emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n" + JSON.stringify(originalOpts, null, 4) + " (type " + typeof originalOpts + ")");
    }
  } else {
    opts = _objectSpread2({}, defaults$1);
  } // progress-wise, sort takes first 20%
  // two-level-deep array clone:


  var filtered = arrOfRanges // filter out null
  .filter(function (range) {
    return range;
  }).map(function (subarr) {
    return [].concat(subarr);
  }).filter( // filter out futile ranges with identical starting and ending points with
  // nothing to add (no 3rd argument)
  function (rangeArr) {
    return rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1];
  });
  var sortedRanges;
  var lastPercentageDone;
  var percentageDone;

  if (opts.progressFn) {
    // progress already gets reported in [0,100] range, so we just need to
    // divide by 5 in order to "compress" that into 20% range.
    sortedRanges = rSort(filtered, {
      progressFn: function progressFn(percentage) {
        percentageDone = Math.floor(percentage / 5); // ensure each percent is passed only once:

        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      }
    });
  } else {
    sortedRanges = rSort(filtered);
  }

  if (!sortedRanges) {
    return null;
  }

  var len = sortedRanges.length - 1; // reset 80% of progress is this loop:
  // loop from the end:

  for (var i = len; i > 0; i--) {
    if (opts.progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;

      if (percentageDone !== lastPercentageDone && percentageDone > lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone); // console.log(
        //   `153 REPORTING ${`\u001b[${33}m${`doneSoFar`}\u001b[${39}m`} = ${doneSoFar}`
        // );
      }
    } // if current range is before the preceding-one


    if (sortedRanges[i][0] <= sortedRanges[i - 1][0] || !opts.joinRangesThatTouchEdges && sortedRanges[i][0] < sortedRanges[i - 1][1] || opts.joinRangesThatTouchEdges && sortedRanges[i][0] <= sortedRanges[i - 1][1]) {
      sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
      sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]); // tend the third argument, "what to insert"

      if (sortedRanges[i][2] !== undefined && (sortedRanges[i - 1][0] >= sortedRanges[i][0] || sortedRanges[i - 1][1] <= sortedRanges[i][1])) {
        // if the value of the range before exists:
        if (sortedRanges[i - 1][2] !== null) {
          if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
            sortedRanges[i - 1][2] = null;
          } else if (sortedRanges[i - 1][2] != null) {
            // if there's a clash of "insert" values:
            if (+opts.mergeType === 2 && sortedRanges[i - 1][0] === sortedRanges[i][0]) {
              // take the value from the range that's on the right:
              sortedRanges[i - 1][2] = sortedRanges[i][2];
            } else {
              sortedRanges[i - 1][2] += sortedRanges[i][2];
            }
          } else {
            sortedRanges[i - 1][2] = sortedRanges[i][2];
          }
        }
      } // get rid of the second element:


      sortedRanges.splice(i, 1); // reset the traversal, start from the end again

      i = sortedRanges.length;
    }
  }

  return sortedRanges.length ? sortedRanges : null;
}

/**
 * ranges-apply
 * Take an array of string index ranges, delete/replace the string according to them
 * Version: 5.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-apply/
 */

function rApply(str, originalRangesArr, _progressFn) {
  var percentageDone = 0;
  var lastPercentageDone = 0;

  if (arguments.length === 0) {
    throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
  }

  if (typeof str !== "string") {
    throw new TypeError("ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: " + typeof str + ", equal to: " + JSON.stringify(str, null, 4));
  }

  if (originalRangesArr && !Array.isArray(originalRangesArr)) {
    throw new TypeError("ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: " + typeof originalRangesArr + ", equal to: " + JSON.stringify(originalRangesArr, null, 4));
  }

  if (_progressFn && typeof _progressFn !== "function") {
    throw new TypeError("ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: " + typeof _progressFn + ", equal to: " + JSON.stringify(_progressFn, null, 4));
  }

  if (!originalRangesArr || !originalRangesArr.filter(function (range) {
    return range;
  }).length) {
    // quick ending - no ranges passed
    return str;
  }

  var rangesArr;

  if (Array.isArray(originalRangesArr) && Number.isInteger(originalRangesArr[0]) && Number.isInteger(originalRangesArr[1])) {
    // if single array was passed, wrap it into an array
    rangesArr = [Array.from(originalRangesArr)];
  } else {
    rangesArr = Array.from(originalRangesArr);
  } // allocate first 10% of progress to this stage


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
      throw new TypeError("ranges-apply: [THROW_ID_05] ranges array, second input arg., has " + i + "th element not an array: " + JSON.stringify(el, null, 4) + ", which is " + typeof el);
    }

    if (!Number.isInteger(el[0])) {
      if (!Number.isInteger(+el[0]) || +el[0] < 0) {
        throw new TypeError("ranges-apply: [THROW_ID_06] ranges array, second input arg. has " + i + "th element, array " + JSON.stringify(el, null, 0) + ". Its first element is not an integer, string index, but " + typeof el[0] + ", equal to: " + JSON.stringify(el[0], null, 4) + ".");
      } else {
        rangesArr[i][0] = +rangesArr[i][0];
      }
    }

    if (!Number.isInteger(el[1])) {
      if (!Number.isInteger(+el[1]) || +el[1] < 0) {
        throw new TypeError("ranges-apply: [THROW_ID_07] ranges array, second input arg. has " + i + "th element, array " + JSON.stringify(el, null, 0) + ". Its second element is not an integer, string index, but " + typeof el[1] + ", equal to: " + JSON.stringify(el[1], null, 4) + ".");
      } else {
        rangesArr[i][1] = +rangesArr[i][1];
      }
    }

    counter += 1;
  }); // allocate another 10% of the progress indicator length to the rangesMerge step:

  var workingRanges = rMerge(rangesArr, {
    progressFn: function progressFn(perc) {
      if (_progressFn) {
        // since "perc" is already from zero to hundred, we just divide by 10 and
        // get the range from zero to ten:
        percentageDone = 10 + Math.floor(perc / 10);
        /* istanbul ignore else */

        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;

          _progressFn(percentageDone);
        }
      }
    }
  }); // allocate the rest 80% to the actual string assembly:

  var len2 = workingRanges.length;
  /* istanbul ignore else */

  if (len2 > 0) {
    var tails = str.slice(workingRanges[len2 - 1][1]); // eslint-disable-next-line no-param-reassign

    str = workingRanges.reduce(function (acc, _val, i, arr) {
      if (_progressFn) {
        // since "perc" is already from zero to hundred, we just divide by 10 and
        // get the range from zero to ten:
        percentageDone = 20 + Math.floor(i / len2 * 80);
        /* istanbul ignore else */

        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;

          _progressFn(percentageDone);
        }
      }

      var beginning = i === 0 ? 0 : arr[i - 1][1];
      var ending = arr[i][0];
      return acc + str.slice(beginning, ending) + (arr[i][2] || "");
    }, ""); // eslint-disable-next-line no-param-reassign

    str += tails;
  }

  return str;
}

/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 5.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-leading-whitespace/
 */

function collWhitespace(str, originallineBreakLimit) {
  if (originallineBreakLimit === void 0) {
    originallineBreakLimit = 1;
  }

  var rawNbsp = "\xA0"; // helpers

  function reverse(s) {
    return Array.from(s).reverse().join("");
  } // replaces the leading/trailing whitespace chunks with final strings


  function prep(whitespaceChunk, limit, trailing) {
    // when processing the leading whitespace, it's \n\r --- CR - LF
    // when processing the trailing whitespace, we're processing inverted order,
    // so it's \n\r --- LF - CR
    // for this reason, we set first and second linebreak according to direction,
    // the "trailing" boolean:
    var firstBreakChar = trailing ? "\n" : "\r";
    var secondBreakChar = trailing ? "\r" : "\n";

    if (!whitespaceChunk) {
      return whitespaceChunk;
    } // let whitespace char count since last CR or LF


    var crlfCount = 0;
    var res = ""; // let beginning = true;

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
    // without a fuss, set the max allowed line breaks as a leading/trailing whitespace:
    var lineBreakLimit = 1;

    if (typeof +originallineBreakLimit === "number" && Number.isInteger(+originallineBreakLimit) && +originallineBreakLimit >= 0) {
      lineBreakLimit = +originallineBreakLimit;
    } // plan: extract what would String.prototype() would remove, front and back parts


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
    } // if whole string is whitespace, endPart is empty string


    if (str.trim() && (str.slice(-1).trim() === "" || str.slice(-1) === rawNbsp)) {
      for (var _i = str.length; _i--;) {
        // console.log(
        //   `${`\u001b[${36}m${`----------------------------------------------\niterating through: ${JSON.stringify(
        //     str[i],
        //     null,
        //     4
        //   )}`}\u001b[${39}m`}`
        // );
        if (str[_i].trim()) {
          endPart = str.slice(_i + 1);
          break;
        }
      }
    } // -------------------------------------------------------------------------


    return "" + prep(frontPart, lineBreakLimit, false) + str.trim() + reverse(prep(reverse(endPart), lineBreakLimit, true));
  }

  return str;
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

var defaults$2 = {
  limitToBeAddedWhitespace: false,
  limitLinebreaksCount: 1,
  mergeType: 1
}; // -----------------------------------------------------------------------------

var Ranges = /*#__PURE__*/function () {
  //
  // O P T I O N S
  // =============
  function Ranges(originalOpts) {
    var opts = _objectSpread2(_objectSpread2({}, defaults$2), originalOpts);

    if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
      if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
        opts.mergeType = 1;
      } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
        opts.mergeType = 2;
      } else {
        throw new Error("ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"" + typeof opts.mergeType + "\", equal to " + JSON.stringify(opts.mergeType, null, 4));
      }
    } // so it's correct, let's get it in:


    this.opts = opts;
    this.ranges = [];
  }

  var _proto = Ranges.prototype;

  _proto.add = function add(originalFrom, originalTo, addVal) {
    var _this = this;

    if (originalFrom == null && originalTo == null) {
      // absent ranges are marked as null - instead of array of arrays we can receive a null
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
                // recursively feed this subarray, hopefully it's an array
                _this.add.apply(_this, thing);
              } // just skip other cases

            });
            return;
          }

          if (originalFrom.length && isNum(+originalFrom[0]) && isNum(+originalFrom[1])) {
            // recursively pass in those values
            this.add.apply(this, originalFrom);
          }
        } // else,


        return;
      }

      throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, \"from\" is set (" + JSON.stringify(originalFrom, null, 0) + ") but second-one, \"to\" is not (" + JSON.stringify(originalTo, null, 0) + ")");
    } else if (!existy(originalFrom) && existy(originalTo)) {
      throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, \"to\" is set (" + JSON.stringify(originalTo, null, 0) + ") but first-one, \"from\" is not (" + JSON.stringify(originalFrom, null, 0) + ")");
    }

    var from = +originalFrom;
    var to = +originalTo;

    if (isNum(addVal)) {
      // eslint-disable-next-line no-param-reassign
      addVal = String(addVal);
    } // validation


    if (isNum(from) && isNum(to)) {
      // This means two indexes were given as arguments. Business as usual.
      if (existy(addVal) && !isStr(addVal) && !isNum(addVal)) {
        throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but " + typeof addVal + ", equal to:\n" + JSON.stringify(addVal, null, 4));
      } // Does the incoming "from" value match the existing last element's "to" value?


      if (existy(this.ranges) && Array.isArray(this.last()) && from === this.last()[1]) {
        // The incoming range is an exact extension of the last range, like
        // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
        this.last()[1] = to; // console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)

        if (this.last()[2] === null || addVal === null) ;

        if (this.last()[2] !== null && existy(addVal)) {
          var calculatedVal = this.last()[2] && this.last()[2].length > 0 && (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1) ? this.last()[2] + addVal : addVal;

          if (this.opts.limitToBeAddedWhitespace) {
            calculatedVal = collWhitespace(calculatedVal, this.opts.limitLinebreaksCount);
          }

          if (!(isStr(calculatedVal) && !calculatedVal.length)) {
            // don't let the zero-length strings past
            this.last()[2] = calculatedVal;
          }
        }
      } else {
        if (!this.ranges) {
          this.ranges = [];
        }

        var whatToPush = addVal !== undefined && !(isStr(addVal) && !addVal.length) ? [from, to, addVal && this.opts.limitToBeAddedWhitespace ? collWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to];
        this.ranges.push(whatToPush);
      }
    } else {
      // Error somewhere!
      // Let's find out where.
      // is it first arg?
      if (!(isNum(from) && from >= 0)) {
        throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_09] \"from\" value, the first input argument, must be a natural number or zero! Currently it's of a type \"" + typeof from + "\" equal to: " + JSON.stringify(from, null, 4));
      } else {
        // then it's second...
        throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_10] \"to\" value, the second input argument, must be a natural number or zero! Currently it's of a type \"" + typeof to + "\" equal to: " + JSON.stringify(to, null, 4));
      }
    }
  };

  _proto.push = function push(originalFrom, originalTo, addVal) {
    this.add(originalFrom, originalTo, addVal);
  } // C U R R E N T () - kindof a getter
  // ==================================
  ;

  _proto.current = function current() {
    var _this2 = this;

    if (Array.isArray(this.ranges) && this.ranges.length) {
      // beware, merging can return null
      this.ranges = rMerge(this.ranges, {
        mergeType: this.opts.mergeType
      });

      if (this.ranges && this.opts.limitToBeAddedWhitespace) {
        return this.ranges.map(function (val) {
          if (existy(val[2])) {
            return [val[0], val[1], collWhitespace(val[2], _this2.opts.limitLinebreaksCount)];
          }

          return val;
        });
      }

      return this.ranges;
    }

    return null;
  } // W I P E ()
  // ==========
  ;

  _proto.wipe = function wipe() {
    this.ranges = [];
  } // R E P L A C E ()
  // ==========
  ;

  _proto.replace = function replace(givenRanges) {
    if (Array.isArray(givenRanges) && givenRanges.length) {
      // Now, ranges can be array of arrays, correct format but also single
      // range, an array of two natural numbers might be given.
      // Let's put safety latch against such cases
      if (!(Array.isArray(givenRanges[0]) && isNum(givenRanges[0][0]))) {
        throw new Error("ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, " + JSON.stringify(givenRanges[0], null, 4) + " should be an array and its first element should be an integer, a string index.");
      } else {
        this.ranges = Array.from(givenRanges);
      }
    } else {
      this.ranges = [];
    }
  } // L A S T ()
  // ==========
  ;

  _proto.last = function last() {
    if (Array.isArray(this.ranges) && this.ranges.length) {
      return this.ranges[this.ranges.length - 1];
    }

    return null;
  };

  return Ranges;
}();

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
/** Detect free variable `self`. */

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
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


var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var objectToString = objectProto.toString;
/** Built-in value references. */

var Symbol = root.Symbol;
/** Used to convert symbols to primitives and strings. */

var symbolProto = Symbol ? Symbol.prototype : undefined,
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


function isObjectLike(value) {
  return !!value && typeof value == 'object';
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
  return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
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
  // vars
  var allOK = true; // used to bail somewhere down the line. It's a killswitch.

  var knownSeparatorsArray = [".", ",", "'", " "];
  var firstSeparator; // validation

  if (typeof str !== "string") {
    throw new TypeError("string-remove-thousand-separators/remSep(): [THROW_ID_01] Input must be string! Currently it's: " + typeof str + ", equal to:\n" + JSON.stringify(str, null, 4));
  }

  if (originalOpts && typeof originalOpts !== "object") {
    throw new TypeError("string-remove-thousand-separators/remSep(): [THROW_ID_02] Options object must be a plain object! Currently it's: " + typeof originalOpts + ", equal to:\n" + JSON.stringify(originalOpts, null, 4));
  } // prep opts


  var defaults = {
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false
  };

  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts); // trim whitespace and wrapping double quotes:


  var res = lodash_trim(str.trim(), '"'); // end sooner if it's an empty string:

  if (res === "") {
    return res;
  } // we'll manage the TO-DELETE string slice ranges using this:


  var rangesToDelete = new Ranges(); // traverse the string indexes

  for (var i = 0, len = res.length; i < len; i++) {
    // -------------------------------------------------------------------------
    // catch empty space for Russian-style thousand separators (spaces):
    if (opts.removeThousandSeparatorsFromNumbers && res[i].trim() === "") {
      rangesToDelete.add(i, i + 1);
    } // -------------------------------------------------------------------------
    // catch single quotes for Swiss-style thousand separators:
    // (safe to delete instantly because they're not commas or dots)


    if (opts.removeThousandSeparatorsFromNumbers && res[i] === "'") {
      rangesToDelete.add(i, i + 1); // but if single quote follows this, that's dodgy and let's bail

      if (res[i + 1] === "'") {
        // bail!
        allOK = false;
        break; // That's very weird case by the way. We're talking about CSV contents here after all...
      }
    } // -------------------------------------------------------------------------
    // catch thousand separators


    if (knownSeparatorsArray.includes(res[i])) {
      // check three characters to the right
      if (res[i + 1] !== undefined && /^\d*$/.test(res[i + 1])) {
        if (res[i + 2] !== undefined) {
          if (/^\d*$/.test(res[i + 2])) {
            //
            // thousands separator followed by two digits...
            if (res[i + 3] !== undefined) {
              if (/^\d*$/.test(res[i + 3])) {
                if (res[i + 4] !== undefined && /^\d*$/.test(res[i + 4])) {
                  // four digits after thousands separator
                  // bail!
                  allOK = false;
                  break;
                } else {
                  //
                  // thousands separator followed by three digits...
                  // =============
                  // 1. submit for deletion
                  if (opts.removeThousandSeparatorsFromNumbers) {
                    rangesToDelete.add(i, i + 1);
                  } // 2. enforce the thousands separator consistency:


                  if (!firstSeparator) {
                    // It's the first encountered thousand separator. Make a record of it.
                    firstSeparator = res[i];
                  } else if (res[i] !== firstSeparator) {
                    // Check against the previous separator. These have to be consistent,
                    // of we'll bail.
                    allOK = false;
                    break;
                  } //
                  //

                }
              } else {
                // bail!
                allOK = false;
                break;
              }
            } else if (opts.removeThousandSeparatorsFromNumbers && opts.forceUKStyle && res[i] === ",") {
              //
              // Stuff like "100,01" (Russian notation) or "100.01" (UK notation).
              // A Separator followed by two digits and string ends.
              //
              // If Russian notation:
              rangesToDelete.add(i, i + 1, ".");
            }
          } else {
            // stuff like "1,0a" - bail
            allOK = false;
            break;
          }
        } else {
          // second digit IS UNDEFINED
          //
          // Stuff like "10.1" (UK notation) or "10,1" (Russian notation).
          // Thousands separator followed by only one digit and then string ends.
          // =============
          // Convert Russian notation if requested:
          if (opts.forceUKStyle && res[i] === ",") {
            rangesToDelete.add(i, i + 1, ".");
          } // Pad it with zero if requested:


          if (opts.padSingleDecimalPlaceNumbers) {
            rangesToDelete.add(i + 2, i + 2, "0");
          }
        }
      } // when we have one decimal place, like "100.2", we pad it to two places, like "100.20"
      // -------------------------------------------------------------------------

    } else if (!/^\d*$/.test(res[i])) {
      // catch unrecognised characters,
      // then turn off the killswitch and break the loop
      allOK = false;
      break;
    }
  }

  if (allOK && rangesToDelete.current()) {
    return rApply(res, rangesToDelete.current());
  }

  return res;
}

var version$1 = version;
var defaults$3 = {
  removeThousandSeparatorsFromNumbers: true,
  padSingleDecimalPlaceNumbers: true,
  forceUKStyle: false
};

function splitEasy(str, originalOpts) {
  // traverse the string and push each column into array
  // when line break is detected, push what's gathered into main array
  var colStarts = 0;
  var lineBreakStarts = 0;
  var rowArray = [];
  var resArray = [];
  var ignoreCommasThatFollow = false;
  var thisRowContainsOnlyEmptySpace = true; // we need at least one non-empty element to
  // flip it to `false` on each line

  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error("csv-split-easy/split(): [THROW_ID_02] Options object must be a plain object! Currently it's of a type " + typeof originalOpts + " equal to:\n" + JSON.stringify(originalOpts, null, 4));
  } // prep opts


  var opts = _objectSpread2(_objectSpread2({}, defaults$3), originalOpts);

  if (typeof str !== "string") {
    throw new TypeError("csv-split-easy/split(): [THROW_ID_04] input must be string! Currently it's: " + typeof str + ", equal to: " + JSON.stringify(str, null, 4));
  } else {
    if (str === "") {
      return [[""]];
    }

    str = str.trim();
  }

  for (var i = 0, len = str.length; i < len; i++) {
    if (thisRowContainsOnlyEmptySpace && str[i] !== '"' && str[i] !== "," && str[i].trim() !== "") {
      thisRowContainsOnlyEmptySpace = false;
    } //
    // detect a double quote
    // ======================


    if (str[i] === '"') {
      // if this is a double quote escape character
      if (ignoreCommasThatFollow && str[i + 1] === '"') {
        // skip it and the next
        i += 1;
      } else if (ignoreCommasThatFollow) {
        // 1. turn off the flag:
        ignoreCommasThatFollow = false; // 2. dump the value that ends here:

        var newElem = str.slice(colStarts, i); // if the element contains only empty space,

        if (newElem.trim() !== "") {
          thisRowContainsOnlyEmptySpace = false;
        } // if the element contains the double quote escape character,
        // chances are it doesn't need to have seperators removed


        var processedElem = /""/.test(newElem) ? newElem.replace(/""/g, '"') : remSep(newElem, {
          removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
          padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
          forceUKStyle: opts.forceUKStyle
        });
        rowArray.push(processedElem); // push it anyway, if it's empty or not.
        // later if whole row comprises of empty columns (thisRowContainsOnlyEmptySpace still
        // equals `true`), we won't push that `rowArray` into `resArray`.
      } else {
        ignoreCommasThatFollow = true;
        colStarts = i + 1;
      }
    } //
    // detect a comma
    // ======================
    else if (!ignoreCommasThatFollow && str[i] === ",") {
        if (str[i - 1] !== '"' && !ignoreCommasThatFollow) {
          // dump the previous value into array if the character before it, the double
          // quote, hasn't dumped the value already:
          var _newElem = str.slice(colStarts, i); // if the element contains only empty space,


          if (_newElem.trim() !== "") {
            thisRowContainsOnlyEmptySpace = false;
          }

          rowArray.push(remSep(_newElem, // same, push anyway. We'll check `resArray` in the end
          {
            removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
            padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
            forceUKStyle: opts.forceUKStyle
          })); // for emptiness via `thisRowContainsOnlyEmptySpace`
        } // in all cases, set the new start marker


        colStarts = i + 1; // also, reset the lineBreakStarts in one was active

        if (lineBreakStarts) {
          lineBreakStarts = 0;
        }
      } //
      // detect a line break
      // ======================
      else if (str[i] === "\n" || str[i] === "\r") {
          // question: is it the first line break of its cluster, or not?
          if (!lineBreakStarts) {
            // 1. mark where line break starts:
            lineBreakStarts = i; // 2. dump the value into rowArray only if closing double quote hasn't dumped already:

            if (!ignoreCommasThatFollow && str[i - 1] !== '"') {
              var _newElem2 = str.slice(colStarts, i); // if the element contains only empty space,


              if (_newElem2.trim() !== "") {
                thisRowContainsOnlyEmptySpace = false;
              }

              rowArray.push(remSep(_newElem2, {
                removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
                padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
                forceUKStyle: opts.forceUKStyle
              }));
            } // 3. dump the whole row's array into result array:


            if (!thisRowContainsOnlyEmptySpace) {
              resArray.push(rowArray);
            } else {
              // wipe rowArray
              rowArray.length = 0;
            } // 4. reset thisRowContainsOnlyEmptySpace


            thisRowContainsOnlyEmptySpace = true; // 5. wipe the rowArray:

            rowArray = [];
          }

          colStarts = i + 1;
        } // if ((str[i] !== '\n') && (str[i] !== '\r'))
        //
        // but then, take care if line break state is actice
        //
        else if (lineBreakStarts) {
            // 1. first, turn off the line break state flag:
            lineBreakStarts = 0; // 2. second, new column's value starts here, so mark that:

            colStarts = i;
          } //
    // detect the end of the file/string
    // ======================


    if (i + 1 === len) {
      // dump the value into rowArray, but only if the current character is
      // not a double quote, because it will have dumped already:
      if (str[i] !== '"') {
        var _newElem3 = str.slice(colStarts, i + 1); // if the element contains only empty space,


        if (_newElem3.trim()) {
          thisRowContainsOnlyEmptySpace = false;
        }

        rowArray.push(remSep(_newElem3, {
          removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
          padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
          forceUKStyle: opts.forceUKStyle
        }));
      } // in any case, dump the whole row's array into result array.
      // for posterity, the whole row (`rowArray`) dumping (into `resArray`) is
      // done at two places: here and the first encountered line break character
      // that follows non-line break character.


      if (!thisRowContainsOnlyEmptySpace) {
        resArray.push(rowArray);
      } else {
        // wipe rowArray
        rowArray = [];
      } // reset thisRowContainsOnlyEmptySpace


      thisRowContainsOnlyEmptySpace = true;
    } //
    // ======================
    // ======================

  }

  if (resArray.length === 0) {
    return [[""]]; // because in some cases only [] reaches here
  }

  return resArray;
}

exports.defaults = defaults$3;
exports.splitEasy = splitEasy;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));

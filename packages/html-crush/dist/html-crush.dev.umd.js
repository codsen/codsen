/**
 * html-crush
 * Minifies HTML/CSS: valid or broken, pure or mixed with other languages
 * Version: 4.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/html-crush/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.htmlCrush = {}));
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
 * Version: 5.0.5
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

  var len2 = Array.isArray(workingRanges) ? workingRanges.length : 0;
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
 * Version: 5.0.5
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

/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.13.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/arrayiffy-if-string/
 */

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
function arrayiffy(something) {
  if (typeof something === "string") {
    if (something.length) {
      return [something];
    }

    return [];
  }

  return something;
}

/* eslint no-plusplus:0 */

function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

function isStr$1(something) {
  return typeof something === "string";
}

var defaults$3 = {
  cb: undefined,
  i: false,
  trimBeforeMatching: false,
  trimCharsBeforeMatching: [],
  maxMismatches: 0,
  firstMustMatch: false,
  lastMustMatch: false,
  hungry: false
};

var defaultGetNextIdx = function defaultGetNextIdx(index) {
  return index + 1;
}; // eslint-disable-next-line consistent-return


function march(str, position, whatToMatchVal, originalOpts, special, getNextIdx) {
  if (special === void 0) {
    special = false;
  }

  if (getNextIdx === void 0) {
    getNextIdx = defaultGetNextIdx;
  }

  var whatToMatchValVal = typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal; // early ending case if matching EOL being at 0-th index:

  if (+position < 0 && special && whatToMatchValVal === "EOL") {
    return whatToMatchValVal;
  }

  var opts = _objectSpread2(_objectSpread2({}, defaults$3), originalOpts);

  if (position >= str.length && !special) {
    return false;
  } // The "charsToCheckCount" varies, it decreases with skipped characters,
  // as long as "maxMismatches" allows. It's not the count of how many
  // characters de-facto have been matched from the source.


  var charsToCheckCount = special ? 1 : whatToMatchVal.length; // this is the counter of real characters matched. It is not reduced
  // from the holes in matched. For example, if source is "abc" and
  // maxMismatches=1 and we have "ac", result of the match will be true,
  // the following var will be equal to 2, meaning we matched two
  // characters:

  var charsMatchedTotal = 0; // used to catch frontal false positives, where too-eager matching
  // depletes the mismatches allowance before precisely matching the exact
  // string that follows, yielding too early false-positive start

  var patienceReducedBeforeFirstMatch = false;
  var lastWasMismatched = false; // value is "false" or index of where it was activated
  // if no character was ever matched, even through if opts.maxMismatches
  // would otherwise allow to skip characters, this will act as a last
  // insurance - at least one character must have been matched to yield a
  // positive result!

  var atLeastSomethingWasMatched = false;
  var patience = opts.maxMismatches;
  var i = position; // internal-use flag, not the same as "atLeastSomethingWasMatched":

  var somethingFound = false; // these two drive opts.firstMustMatch and opts.lastMustMatch:

  var firstCharacterMatched = false;
  var lastCharacterMatched = false; // bail early if there's whitespace in front, imagine:
  // abc important}
  //   ^
  //  start, match ["!important"], matchRightIncl()
  //
  // in case above, "c" consumed 1 patience, let's say 1 is left,
  // we stumble upon "i" where "!" is missing. "c" is false start.

  function whitespaceInFrontOfFirstChar() {
    return (// it's a first letter match
      charsMatchedTotal === 1 && // and character in front exists
      // str[i - 1] &&
      // and it's whitespace
      // !str[i - 1].trim() &&
      // some patience has been consumed already
      patience < opts.maxMismatches - 1
    );
  }

  while (str[i]) {
    var nextIdx = getNextIdx(i);

    if (opts.trimBeforeMatching && str[i].trim() === "") {
      if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
        return true;
      }

      i = getNextIdx(i);
      continue;
    }

    if (opts && !opts.i && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.includes(str[i]) || opts && opts.i && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.map(function (val) {
      return val.toLowerCase();
    }).includes(str[i].toLowerCase())) {
      if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
        // return true because we reached the zero'th index, exactly what we're looking for
        return true;
      }

      i = getNextIdx(i);
      continue;
    }

    var charToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount] : whatToMatchVal[charsToCheckCount - 1]; // let's match

    if (!opts.i && str[i] === charToCompareAgainst || opts.i && str[i].toLowerCase() === charToCompareAgainst.toLowerCase()) {
      if (!somethingFound) {
        somethingFound = true;
      }

      if (!atLeastSomethingWasMatched) {
        atLeastSomethingWasMatched = true;
      } // if this was the first character from the "to-match" list, flip the flag


      if (charsToCheckCount === whatToMatchVal.length) {
        firstCharacterMatched = true; // now, if the first character was matched and yet, patience was
        // reduced already, this means there's a false beginning in front

        if (patience !== opts.maxMismatches) {
          return false;
        }
      } else if (charsToCheckCount === 1) {
        lastCharacterMatched = true;
      }

      charsToCheckCount -= 1;
      charsMatchedTotal++; // bail early if there's whitespace in front, imagine:
      // abc important}
      //   ^
      //  start, match ["!important"], matchRightIncl()
      //
      // in case above, "c" consumed 1 patience, let's say 1 is left,
      // we stumble upon "i" where "!" is missing. "c" is false start.

      if (whitespaceInFrontOfFirstChar()) {
        return false;
      }

      if (!charsToCheckCount) {
        return (// either it was not a perfect match
          charsMatchedTotal !== whatToMatchVal.length || // or it was, and in that case, no patience was reduced
          // (if a perfect match was found, yet some "patience" was reduced,
          // that means we have false positive characters)
          patience === opts.maxMismatches || // mind you, it can be a case of rogue characters in-between
          // the what was matched, imagine:
          // source: "abxcd", matching ["bc"], maxMismatches=1
          // in above case, charsMatchedTotal === 2 and whatToMatchVal ("bc") === 2
          // - we want to exclude cases of frontal false positives, like:
          // source: "xy abc", match "abc", maxMismatches=2, start at 0
          //          ^
          //       match form here to the right
          !patienceReducedBeforeFirstMatch ? i : false
        );
      }
    } else {
      if (!patienceReducedBeforeFirstMatch && !charsMatchedTotal) {
        patienceReducedBeforeFirstMatch = true;
      }

      if (opts.maxMismatches && patience && i) {
        patience -= 1; // the bigger the maxMismatches, the further away we must check for
        // alternative matches

        for (var y = 0; y <= patience; y++) {
          // maybe str[i] will match against next charToCompareAgainst?
          var nextCharToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount + 1 + y] : whatToMatchVal[charsToCheckCount - 2 - y];
          var nextCharInSource = str[getNextIdx(i)];

          if (nextCharToCompareAgainst && (!opts.i && str[i] === nextCharToCompareAgainst || opts.i && str[i].toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && ( // ensure we're not skipping the first enforced character:
          !opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
            charsMatchedTotal++; // bail early if there's whitespace in front, imagine:
            // abc important}
            //   ^
            //  start, match ["!important"], matchRightIncl()
            //
            // in case above, "c" consumed 1 patience, let's say 1 is left,
            // we stumble upon "i" where "!" is missing. "c" is false start.

            if (whitespaceInFrontOfFirstChar()) {
              return false;
            }

            charsToCheckCount -= 2;
            somethingFound = true;
            break;
          } else if (nextCharInSource && nextCharToCompareAgainst && (!opts.i && nextCharInSource === nextCharToCompareAgainst || opts.i && nextCharInSource.toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && ( // ensure we're not skipping the first enforced character:
          !opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
            if (!charsMatchedTotal && !opts.hungry) {
              return false;
            }

            charsToCheckCount -= 1;
            somethingFound = true;
            break;
          } else if (nextCharToCompareAgainst === undefined && patience >= 0 && somethingFound && (!opts.firstMustMatch || firstCharacterMatched) && (!opts.lastMustMatch || lastCharacterMatched)) {
            // If "nextCharToCompareAgainst" is undefined, this
            // means there are no more characters left to match,
            // this is the last character to be matched.
            // This means, if patience >= 0, this is it,
            // the match is still positive.
            return i;
          } // ███████████████████████████████████████

        }

        if (!somethingFound) {
          // if the character was rogue, we mark it:
          lastWasMismatched = i; // patience--;
          // console.log(
          //   `350 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`patience`}\u001b[${39}m`} = ${patience}`
          // );
        }
      } else if (i === 0 && charsToCheckCount === 1 && !opts.lastMustMatch && atLeastSomethingWasMatched) {
        return 0;
      } else {
        return false;
      }
    } // turn off "lastWasMismatched" if it's on and it hasn't been activated
    // on this current index:


    if (lastWasMismatched !== false && lastWasMismatched !== i) {
      lastWasMismatched = false;
    } // if all was matched, happy days


    if (charsToCheckCount < 1) {
      return i;
    } // iterate onto the next index, otherwise while would loop infinitely


    i = getNextIdx(i);
  }

  if (charsToCheckCount > 0) {
    if (special && whatToMatchValVal === "EOL") {
      return true;
    }

    if (opts && opts.maxMismatches >= charsToCheckCount && atLeastSomethingWasMatched) {
      return lastWasMismatched || 0;
    }

    return false;
  }
} //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// Real deal


function main(mode, str, position, originalWhatToMatch, originalOpts) {
  // insurance
  if (isObj(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!" + (Array.isArray(originalOpts.trimBeforeMatching) ? " Did you mean to use opts.trimCharsBeforeMatching?" : ""));
  }

  var opts = _objectSpread2(_objectSpread2({}, defaults$3), originalOpts);

  if (typeof opts.trimCharsBeforeMatching === "string") {
    // arrayiffy if needed:
    opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  } // stringify all:


  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(function (el) {
    return isStr$1(el) ? el : String(el);
  });

  if (!isStr$1(str)) {
    return false;
  }

  if (!str.length) {
    return false;
  }

  if (!Number.isInteger(position) || position < 0) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: " + typeof position + ", equal to:\n" + JSON.stringify(position, null, 4));
  }

  var whatToMatch;
  var special;

  if (isStr$1(originalWhatToMatch)) {
    whatToMatch = [originalWhatToMatch];
  } else if (Array.isArray(originalWhatToMatch)) {
    whatToMatch = originalWhatToMatch;
  } else if (!originalWhatToMatch) {
    whatToMatch = originalWhatToMatch;
  } else if (typeof originalWhatToMatch === "function") {
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
  } else {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's " + typeof originalWhatToMatch + ", equal to:\n" + JSON.stringify(originalWhatToMatch, null, 4));
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"" + typeof originalOpts + "\", and equal to:\n" + JSON.stringify(originalOpts, null, 4));
  }

  var culpritsIndex = 0;
  var culpritsVal = "";

  if (opts && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.some(function (el, i) {
    if (el.length > 1) {
      culpritsIndex = i;
      culpritsVal = el;
      return true;
    }

    return false;
  })) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index " + culpritsIndex + " is longer than 1 character, " + culpritsVal.length + " (equals to " + culpritsVal + "). Please split it into separate characters and put into array as separate elements.");
  } // action
  // CASE 1. If it's driven by callback-only, the 3rd input argument, what to look
  // for - is falsey - empty string within array (or not), OR given null


  if (!whatToMatch || !Array.isArray(whatToMatch) || // 0
  Array.isArray(whatToMatch) && !whatToMatch.length || // []
  Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr$1(whatToMatch[0]) && !whatToMatch[0].trim() // [""]
  ) {
      if (typeof opts.cb === "function") {
        var firstCharOutsideIndex; // matchLeft() or matchRightIncl() methods start at index "position"

        var startingPosition = position;

        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }

        if (mode[5] === "L") {
          for (var y = startingPosition; y--;) {
            // assemble the value of the current character
            var currentChar = str[y]; // do the actual evaluation, is the current character non-whitespace/non-skiped

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim()) && (!opts.trimCharsBeforeMatching || !opts.trimCharsBeforeMatching.length || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (var _y = startingPosition; _y < str.length; _y++) {
            // assemble the value of the current character
            var _currentChar = str[_y]; // do the actual evaluation, is the current character non-whitespace/non-skiped

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && _currentChar.trim()) && (!opts.trimCharsBeforeMatching || !opts.trimCharsBeforeMatching.length || !opts.trimCharsBeforeMatching.includes(_currentChar))) {
              firstCharOutsideIndex = _y;
              break;
            }
          }
        }

        if (firstCharOutsideIndex === undefined) {
          return false;
        }

        var wholeCharacterOutside = str[firstCharOutsideIndex];
        var indexOfTheCharacterAfter = firstCharOutsideIndex + 1;
        var theRemainderOfTheString = "";

        if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
          theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
        }

        if (mode[5] === "L") {
          return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
        } // ELSE matchRight & matchRightIncl


        if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
          theRemainderOfTheString = str.slice(firstCharOutsideIndex);
        }

        return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
      }

      var extraNote = "";

      if (!originalOpts) {
        extraNote = " More so, the whole options object, the fourth input argument, is missing!";
      }

      throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_08] the third argument, \"whatToMatch\", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key \"cb\" is not set!" + extraNote);
    } // Case 2. Normal operation where callback may or may not be present, but it is
  // only accompanying the matching of what was given in 3rd input argument.
  // Then if 3rd arg's contents were matched, callback is checked and its Boolean
  // result is merged using logical "AND" - meaning both have to be true to yield
  // final result "true".


  for (var i = 0, len = whatToMatch.length; i < len; i++) {
    special = typeof whatToMatch[i] === "function"; // since input can be function, we need to grab the value explicitly:

    var whatToMatchVal = whatToMatch[i];
    var fullCharacterInFront = void 0;
    var indexOfTheCharacterInFront = void 0;
    var restOfStringInFront = "";
    var _startingPosition = position;

    if (mode === "matchRight") {
      _startingPosition += 1;
    } else if (mode === "matchLeft") {
      _startingPosition -= 1;
    }

    var found = march(str, _startingPosition, whatToMatchVal, opts, special, function (i2) {
      return mode[5] === "L" ? i2 - 1 : i2 + 1;
    }); // if march() returned positive result and it was "special" case,
    // Bob's your uncle, here's the result:

    if (found && special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
      return whatToMatchVal() && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true) ? whatToMatchVal() : false;
    } // now, the "found" is the index of the first character of what was found.
    // we need to calculate the character to the left/right of it:


    if (Number.isInteger(found)) {
      indexOfTheCharacterInFront = mode.startsWith("matchLeft") ? found - 1 : found + 1; //

      if (mode[5] === "L") {
        restOfStringInFront = str.slice(0, found);
      } else {
        restOfStringInFront = str.slice(indexOfTheCharacterInFront);
      }
    }

    if (indexOfTheCharacterInFront < 0) {
      indexOfTheCharacterInFront = undefined;
    }

    if (str[indexOfTheCharacterInFront]) {
      fullCharacterInFront = str[indexOfTheCharacterInFront];
    }

    if (Number.isInteger(found) && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true)) {
      return whatToMatchVal;
    }
  }

  return false;
} // External API functions

function matchLeft(str, position, whatToMatch, opts) {
  return main("matchLeft", str, position, whatToMatch, opts);
}

function matchRightIncl(str, position, whatToMatch, opts) {
  return main("matchRightIncl", str, position, whatToMatch, opts);
}

function matchRight(str, position, whatToMatch, opts) {
  return main("matchRight", str, position, whatToMatch, opts);
}

var defaults$4 = {
  str: "",
  from: 0,
  to: 0,
  ifLeftSideIncludesThisThenCropTightly: "",
  ifLeftSideIncludesThisCropItToo: "",
  ifRightSideIncludesThisThenCropTightly: "",
  ifRightSideIncludesThisCropItToo: "",
  extendToOneSide: false,
  wipeAllWhitespaceOnLeft: false,
  wipeAllWhitespaceOnRight: false,
  addSingleSpaceToPreventAccidentalConcatenation: false
};

function expander(originalOpts) {
  var letterOrDigit = /^[0-9a-zA-Z]+$/; // Internal functions
  // ---------------------------------------------------------------------------

  function isWhitespace(char) {
    if (!char || typeof char !== "string") {
      return false;
    }

    return !char.trim();
  }

  function isStr(something) {
    return typeof something === "string";
  } // Sanitise the inputs
  // ---------------------------------------------------------------------------


  if (!originalOpts || typeof originalOpts !== "object" || Array.isArray(originalOpts)) {
    var supplementalString;

    if (originalOpts === undefined) {
      supplementalString = "but it is missing completely.";
    } else if (originalOpts === null) {
      supplementalString = "but it was given as null.";
    } else {
      supplementalString = "but it was given as " + typeof originalOpts + ", equal to:\n" + JSON.stringify(originalOpts, null, 4) + ".";
    }

    throw new Error("string-range-expander: [THROW_ID_01] Input must be a plain object " + supplementalString);
  } else if (typeof originalOpts === "object" && originalOpts !== null && !Array.isArray(originalOpts) && !Object.keys(originalOpts).length) {
    throw new Error("string-range-expander: [THROW_ID_02] Input must be a plain object but it was given as a plain object without any keys.");
  }

  if (typeof originalOpts.from !== "number") {
    throw new Error("string-range-expander: [THROW_ID_03] The input's \"from\" value opts.from, is not a number! Currently it's given as " + typeof originalOpts.from + ", equal to " + JSON.stringify(originalOpts.from, null, 0));
  }

  if (typeof originalOpts.to !== "number") {
    throw new Error("string-range-expander: [THROW_ID_04] The input's \"to\" value opts.to, is not a number! Currently it's given as " + typeof originalOpts.to + ", equal to " + JSON.stringify(originalOpts.to, null, 0));
  }

  if (originalOpts && originalOpts.str && !originalOpts.str[originalOpts.from] && originalOpts.from !== originalOpts.to) {
    throw new Error("string-range-expander: [THROW_ID_05] The given input string opts.str (\"" + originalOpts.str + "\") must contain the character at index \"from\" (\"" + originalOpts.from + "\")");
  }

  if (originalOpts && originalOpts.str && !originalOpts.str[originalOpts.to - 1]) {
    throw new Error("string-range-expander: [THROW_ID_06] The given input string, opts.str (\"" + originalOpts.str + "\") must contain the character at index before \"to\" (\"" + (originalOpts.to - 1) + "\")");
  }

  if (originalOpts.from > originalOpts.to) {
    throw new Error("string-range-expander: [THROW_ID_07] The given \"from\" index, \"" + originalOpts.from + "\" is greater than \"to\" index, \"" + originalOpts.to + "\". That's wrong!");
  }

  if (isStr(originalOpts.extendToOneSide) && originalOpts.extendToOneSide !== "left" && originalOpts.extendToOneSide !== "right" || !isStr(originalOpts.extendToOneSide) && originalOpts.extendToOneSide !== undefined && originalOpts.extendToOneSide !== false) {
    throw new Error("string-range-expander: [THROW_ID_08] The opts.extendToOneSide value is not recogniseable! It's set to: \"" + originalOpts.extendToOneSide + "\" (" + typeof originalOpts.extendToOneSide + "). It has to be either Boolean \"false\" or strings \"left\" or \"right\"");
  } // Prepare the opts
  // ---------------------------------------------------------------------------


  var opts = _objectSpread2(_objectSpread2({}, defaults$4), originalOpts);

  if (Array.isArray(opts.ifLeftSideIncludesThisThenCropTightly)) {
    var culpritsIndex;
    var culpritsValue;

    if (opts.ifLeftSideIncludesThisThenCropTightly.every(function (val, i) {
      if (!isStr(val)) {
        culpritsIndex = i;
        culpritsValue = val;
        return false;
      }

      return true;
    })) {
      opts.ifLeftSideIncludesThisThenCropTightly = opts.ifLeftSideIncludesThisThenCropTightly.join("");
    } else {
      throw new Error("string-range-expander: [THROW_ID_09] The opts.ifLeftSideIncludesThisThenCropTightly was set to an array:\n" + JSON.stringify(opts.ifLeftSideIncludesThisThenCropTightly, null, 4) + ". Now, that array contains not only string elements. For example, an element at index " + culpritsIndex + " is of a type " + typeof culpritsValue + " (equal to " + JSON.stringify(culpritsValue, null, 0) + ").");
    }
  } // Action
  // ---------------------------------------------------------------------------


  var str = opts.str; // convenience

  var from = opts.from;
  var to = opts.to; // 1. expand the given range outwards and leave a single space or
  // {single-of-whatever-there-was} (like line break, tab etc) on each side

  if (opts.extendToOneSide !== "right" && (isWhitespace(str[from - 1]) && (isWhitespace(str[from - 2]) || opts.ifLeftSideIncludesThisCropItToo.includes(str[from - 2])) || str[from - 1] && opts.ifLeftSideIncludesThisCropItToo.includes(str[from - 1]) || opts.wipeAllWhitespaceOnLeft && isWhitespace(str[from - 1]))) {
    // loop backwards
    for (var i = from; i--;) {
      if (!opts.ifLeftSideIncludesThisCropItToo.includes(str[i])) {
        if (str[i].trim()) {
          if (opts.wipeAllWhitespaceOnLeft || opts.ifLeftSideIncludesThisCropItToo.includes(str[i + 1])) {
            from = i + 1;
          } else {
            from = i + 2;
          }

          break;
        } else if (i === 0) {
          if (opts.wipeAllWhitespaceOnLeft) {
            from = 0;
          } else {
            from = 1;
          }

          break;
        }
      }
    }
  } // 2. expand forward


  if (opts.extendToOneSide !== "left" && (isWhitespace(str[to]) && (opts.wipeAllWhitespaceOnRight || isWhitespace(str[to + 1])) || opts.ifRightSideIncludesThisCropItToo.includes(str[to]))) {
    // loop forward
    for (var _i = to, len = str.length; _i < len; _i++) {
      if (!opts.ifRightSideIncludesThisCropItToo.includes(str[_i]) && (str[_i] && str[_i].trim() || str[_i] === undefined)) {
        if (opts.wipeAllWhitespaceOnRight || opts.ifRightSideIncludesThisCropItToo.includes(str[_i - 1])) {
          to = _i;
        } else {
          to = _i - 1;
        }

        break;
      }
    }
  } // 3. tight crop adjustments


  if (opts.extendToOneSide !== "right" && isStr(opts.ifLeftSideIncludesThisThenCropTightly) && opts.ifLeftSideIncludesThisThenCropTightly && (str[from - 2] && opts.ifLeftSideIncludesThisThenCropTightly.includes(str[from - 2]) || str[from - 1] && opts.ifLeftSideIncludesThisThenCropTightly.includes(str[from - 1])) || opts.extendToOneSide !== "left" && isStr(opts.ifRightSideIncludesThisThenCropTightly) && opts.ifRightSideIncludesThisThenCropTightly && (str[to + 1] && opts.ifRightSideIncludesThisThenCropTightly.includes(str[to + 1]) || str[to] && opts.ifRightSideIncludesThisThenCropTightly.includes(str[to]))) {
    if (opts.extendToOneSide !== "right" && isWhitespace(str[from - 1]) && !opts.wipeAllWhitespaceOnLeft) {
      from -= 1;
    }

    if (opts.extendToOneSide !== "left" && isWhitespace(str[to]) && !opts.wipeAllWhitespaceOnRight) {
      to += 1;
    }
  }

  if (opts.addSingleSpaceToPreventAccidentalConcatenation && str[from - 1] && str[from - 1].trim() && str[to] && str[to].trim() && (!opts.ifLeftSideIncludesThisThenCropTightly && !opts.ifRightSideIncludesThisThenCropTightly || !((!opts.ifLeftSideIncludesThisThenCropTightly || opts.ifLeftSideIncludesThisThenCropTightly.includes(str[from - 1])) && (!opts.ifRightSideIncludesThisThenCropTightly || str[to] && opts.ifRightSideIncludesThisThenCropTightly.includes(str[to])))) && (letterOrDigit.test(str[from - 1]) || letterOrDigit.test(str[to]))) {
    return [from, to, " "];
  }

  return [from, to];
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
/** Used for built-in method references. */


var funcProto = Function.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString = funcProto.toString;
/** Used to infer the `Object` constructor. */

funcToString.call(Object);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
createCommonjsModule(function (module, exports) {
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

  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `self`. */

  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();
  /** Detect free variable `exports`. */

  var freeExports = exports && !exports.nodeType && exports;
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
      Symbol = root.Symbol,
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

  var symbolProto = Symbol ? Symbol.prototype : undefined,
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
    var type = typeof value;
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
    var type = typeof value;
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
    return !!value && typeof value == 'object';
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

var RAWNBSP = "\xA0"; // separates the value from flags

function rightMain(_ref) {
  var str = _ref.str,
      _ref$idx = _ref.idx,
      idx = _ref$idx === void 0 ? 0 : _ref$idx,
      _ref$stopAtNewlines = _ref.stopAtNewlines,
      stopAtNewlines = _ref$stopAtNewlines === void 0 ? false : _ref$stopAtNewlines,
      _ref$stopAtRawNbsp = _ref.stopAtRawNbsp,
      stopAtRawNbsp = _ref$stopAtRawNbsp === void 0 ? false : _ref$stopAtRawNbsp;

  if (typeof str !== "string" || !str.length) {
    return null;
  }

  if (!idx || typeof idx !== "number") {
    idx = 0;
  }

  if (!str[idx + 1]) {
    return null;
  }

  if ( // next character exists
  str[idx + 1] && ( // and...
  // it's solid
  str[idx + 1].trim() || // or it's a whitespace character, but...
  // stop at newlines is on
  stopAtNewlines && // and it's a newline
  "\n\r".includes(str[idx + 1]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[idx + 1] === RAWNBSP)) {
    // best case scenario - next character is non-whitespace:
    return idx + 1;
  }

  if ( // second next character exists
  str[idx + 2] && ( // and...
  // it's solid
  str[idx + 2].trim() || // it's a whitespace character and...
  // stop at newlines is on
  stopAtNewlines && // and it's a newline
  "\n\r".includes(str[idx + 2]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[idx + 2] === RAWNBSP)) {
    // second best case scenario - second next character is non-whitespace:
    return idx + 2;
  } // worst case scenario - traverse forwards


  for (var i = idx + 1, len = str.length; i < len; i++) {
    if ( // it's solid
    str[i].trim() || // it's a whitespace character and...
    // stop at newlines is on
    stopAtNewlines && // and it's a newline
    "\n\r".includes(str[i]) || // stop at raw nbsp is on
    stopAtRawNbsp && // and it's a raw nbsp
    str[i] === RAWNBSP) {
      return i;
    }
  }

  return null;
}

function right(str, idx) {
  if (idx === void 0) {
    idx = 0;
  }

  return rightMain({
    str: str,
    idx: idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}
//
//       lllllll                        ffffffffffffffff           tttt                    ((((((       ))))))
//       l:::::l                       f::::::::::::::::f       ttt:::t                  ((::::::(     )::::::))
//       l:::::l                      f::::::::::::::::::f      t:::::t                ((:::::::(       ):::::::))
//       l:::::l                      f::::::fffffff:::::f      t:::::t               (:::::::((         )):::::::)
//       l::::l     eeeeeeeeeeee     f:::::f       ffffffttttttt:::::ttttttt         (::::::(             )::::::)
//       l::::l   ee::::::::::::ee   f:::::f             t:::::::::::::::::t         (:::::(               ):::::)
//       l::::l  e::::::eeeee:::::eef:::::::ffffff       t:::::::::::::::::t         (:::::(               ):::::)
//       l::::l e::::::e     e:::::ef::::::::::::f       tttttt:::::::tttttt         (:::::(               ):::::)
//       l::::l e:::::::eeeee::::::ef::::::::::::f             t:::::t               (:::::(               ):::::)
//       l::::l e:::::::::::::::::e f:::::::ffffff             t:::::t               (:::::(               ):::::)
//       l::::l e::::::eeeeeeeeeee   f:::::f                   t:::::t               (:::::(               ):::::)
//       l::::l e:::::::e            f:::::f                   t:::::t    tttttt     (::::::(             )::::::)
//       l::::::le::::::::e          f:::::::f                  t::::::tttt:::::t     (:::::::((         )):::::::)
//       l::::::l e::::::::eeeeeeee  f:::::::f                  tt::::::::::::::t      ((:::::::(       ):::::::))
//       l::::::l  ee:::::::::::::e  f:::::::f                    tt:::::::::::tt        ((::::::(     )::::::)
//       llllllll    eeeeeeeeeeeeee  fffffffff                      ttttttttttt            ((((((       ))))))
//
//
// Finds the index of the first non-whitespace character on the left


function leftMain(_ref2) {
  var str = _ref2.str,
      idx = _ref2.idx,
      stopAtNewlines = _ref2.stopAtNewlines,
      stopAtRawNbsp = _ref2.stopAtRawNbsp;

  if (typeof str !== "string" || !str.length) {
    return null;
  }

  if (!idx || typeof idx !== "number") {
    idx = 0;
  }

  if (idx < 1) {
    return null;
  }

  if ( // ~- means minus one, in bitwise
  str[~-idx] && ( // either it's not a whitespace
  str[~-idx].trim() || // or it is whitespace, but...
  // stop at newlines is on
  stopAtNewlines && // and it's a newline
  "\n\r".includes(str[~-idx]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[~-idx] === RAWNBSP)) {
    // best case scenario - next character is non-whitespace:
    return ~-idx;
  } // if we reached this point, this means character on the left is whitespace -
  // fine - check the next character on the left, str[idx - 2]


  if ( // second character exists
  str[idx - 2] && ( // either it's not whitespace so Bob's your uncle here's non-whitespace character
  str[idx - 2].trim() || // it is whitespace, but...
  // stop at newlines is on
  stopAtNewlines && // it's some sort of a newline
  "\n\r".includes(str[idx - 2]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[idx - 2] === RAWNBSP)) {
    // second best case scenario - second next character is non-whitespace:
    return idx - 2;
  } // worst case scenario - traverse backwards


  for (var i = idx; i--;) {
    if (str[i] && ( // it's non-whitespace character
    str[i].trim() || // or it is whitespace character, but...
    // stop at newlines is on
    stopAtNewlines && // it's some sort of a newline
    "\n\r".includes(str[i]) || // stop at raw nbsp is on
    stopAtRawNbsp && // and it's a raw nbsp
    str[i] === RAWNBSP)) {
      return i;
    }
  }

  return null;
}

function left(str, idx) {
  if (idx === void 0) {
    idx = 0;
  }

  return leftMain({
    str: str,
    idx: idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}

var version = "4.0.5";

var version$1 = version;
var finalIndexesToDelete = new Ranges({
  limitToBeAddedWhitespace: true
});
var defaults$5 = {
  lineLengthLimit: 500,
  removeIndentations: true,
  removeLineBreaks: false,
  removeHTMLComments: false,
  removeCSSComments: true,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  breakToTheLeftOf: ["</td", "<html", "</html", "<head", "</head", "<meta", "<link", "<table", "<script", "</script", "<!DOCTYPE", "<style", "</style", "<title", "<body", "@media", "</body", "<!--[if", "<!--<![endif", "<![endif]"],
  mindTheInlineTags: ["a", "abbr", "acronym", "audio", "b", "bdi", "bdo", "big", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "mark", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "tt", "var", "video", "wbr"]
};
var applicableOpts = {
  removeHTMLComments: false,
  removeCSSComments: false
};

function isStr$2(something) {
  return typeof something === "string";
}

function isLetter(something) {
  return typeof something === "string" && something.toUpperCase() !== something.toLowerCase();
}
/**
 * Minifies HTML/CSS: valid or broken, pure or mixed with other languages
 */


function crush(str, originalOpts) {
  var start = Date.now(); // insurance:

  if (!isStr$2(str)) {
    if (str === undefined) {
      throw new Error("html-crush: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("html-crush: [THROW_ID_02] the first input argument must be string! It was given as \"" + typeof str + "\", equal to:\n" + JSON.stringify(str, null, 4));
    }
  }

  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error("html-crush: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type " + typeof originalOpts + ", equal to " + JSON.stringify(originalOpts, null, 4));
  }

  if (originalOpts && Array.isArray(originalOpts.breakToTheLeftOf) && originalOpts.breakToTheLeftOf.length) {
    for (var z = 0, _len = originalOpts.breakToTheLeftOf.length; z < _len; z++) {
      if (!isStr$2(originalOpts.breakToTheLeftOf[z])) {
        throw new TypeError("html-crush: [THROW_ID_05] the opts.breakToTheLeftOf array contains non-string elements! For example, element at index " + z + " is of a type \"" + typeof originalOpts.breakToTheLeftOf[z] + "\" and is equal to:\n" + JSON.stringify(originalOpts.breakToTheLeftOf[z], null, 4));
      }
    }
  }

  var opts = _objectSpread2(_objectSpread2({}, defaults$5), originalOpts); // normalize the opts.removeHTMLComments


  if (typeof opts.removeHTMLComments === "boolean") {
    opts.removeHTMLComments = opts.removeHTMLComments ? 1 : 0;
  }

  var breakToTheLeftOfFirstLetters = "";

  if (Array.isArray(opts.breakToTheLeftOf) && opts.breakToTheLeftOf.length) {
    breakToTheLeftOfFirstLetters = [].concat(new Set(opts.breakToTheLeftOf.map(function (val) {
      return val[0];
    }))).join("");
  } // console.log(
  //   `0187 ${`\u001b[${33}m${`breakToTheLeftOfFirstLetters`}\u001b[${39}m`} = ${JSON.stringify(
  //     breakToTheLeftOfFirstLetters,
  //     null,
  //     4
  //   )}`
  // );
  //
  // console.log("\n");
  // console.log(
  //   `0196 ${`\u001b[${33}m${`██ ██ ██`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );

  var lastLinebreak = null;
  var whitespaceStartedAt = null;
  var nonWhitespaceCharMet = false;
  var countCharactersPerLine = 0; // new characters-per-line counter

  var cpl = 0;
  var withinStyleTag = false;
  var withinHTMLConditional = false; // <!--[if lte mso 11]> etc

  var withinInlineStyle = null;
  var styleCommentStartedAt = null;
  var htmlCommentStartedAt = null;
  var scriptStartedAt = null; // main do nothing switch, used to skip chunks of code and perform no action

  var doNothing; // we use staging "from" and "to" to preemptively mark the chunks
  // of whitespace that will be either: a) replaced with a space; or
  // b) replaced with linebreak. If opts.removeLineBreaks is on,
  // if we need to break where the particular whitespace chunk is
  // located, we replace it with line break. Otherwise, if
  // the next chunk of characters that follows it fits on one line,
  // we replace it with a single space.

  var stageFrom = null;
  var stageTo = null;
  var stageAdd = null;
  var tagName = null;
  var tagNameStartsAt = null;
  var leftTagName = null;
  var CHARS_BREAK_ON_THE_RIGHT_OF_THEM = ">};";
  var CHARS_BREAK_ON_THE_LEFT_OF_THEM = "<";
  var CHARS_DONT_BREAK_ON_THE_LEFT_OF_THEM = "!";
  var DELETE_TIGHTLY_IF_ON_LEFT_IS = ">";
  var DELETE_TIGHTLY_IF_ON_RIGHT_IS = "<";
  var set = "{},:;<>~+";
  var DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS = set;
  var DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS = set; // the first non-whitespace character turns this flag off:

  var beginningOfAFile = true; // it will be used to trim start of the file.

  var len = str.length;
  var midLen = Math.floor(len / 2);
  var leavePercForLastStage = 0.01; // in range of [0, 1]
  // ceil - total range which is allocated to the main processing

  var ceil;

  if (opts.reportProgressFunc) {
    ceil = Math.floor(opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom);
  } // one more round to collapse the whitespace to:
  // 1. Tackle indentations
  // 2. Remove excessive whitespace between strings on each line (not touching indentations)
  // progress-wise, 98% will be allocated to loop, rest 2% - to range applies and
  // final return clauses


  var currentPercentageDone;
  var lastPercentage = 0;

  if (len) {
    for (var i = 0; i < len; i++) {
      //
      //
      //
      //
      //                    TOP
      //
      //
      //
      //
      // Logging:
      // ███████████████████████████████████████ // Report the progress. We'll allocate 98% of the progress bar to this stage

      if (opts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          if (i === midLen) {
            opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
          }
        } else if (len >= 2000) {
          // defaults:
          // opts.reportProgressFuncFrom = 0
          // opts.reportProgressFuncTo = 100
          currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * (ceil || 1));

          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      } // count characters-per-line


      cpl++; // turn off doNothing if marker passed
      // ███████████████████████████████████████

      if (doNothing && typeof doNothing === "number" && i >= doNothing) {
        doNothing = undefined;
      } // catch ending of </script...
      // ███████████████████████████████████████


      if (scriptStartedAt !== null && str.startsWith("</script", i) && !isLetter(str[i + 8])) { // 1. if there is a line break, chunk of whitespace and </script>,
        // delete that chunk of whitespace, leave line break.
        // If there's non-whitespace character, chunk of whitespace and </script>,
        // delete that chunk of whitespace.
        // Basically, traverse backwards from "<" of "</script>", stop either
        // at first line break or non-whitespace character.

        if ((opts.removeIndentations || opts.removeLineBreaks) && i > 0 && str[~-i] && !str[~-i].trim()) {
          // march backwards

          for (var y = i; y--;) {

            if (str[y] === "\n" || str[y] === "\r" || str[y].trim()) {
              if (y + 1 < i) {
                finalIndexesToDelete.push(y + 1, i);
              }
              break;
            }
          }
        } // 2.


        scriptStartedAt = null;
        doNothing = false;
        i += 8;
        continue;
      } // catch start of <script...
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && str.startsWith("<script", i) && !isLetter(str[i + 7])) {
        scriptStartedAt = i;
        doNothing = true;
        var whatToInsert = "";

        if ((opts.removeLineBreaks || opts.removeIndentations) && whitespaceStartedAt !== null) {
          if (whitespaceStartedAt > 0) {
            whatToInsert = "\n";
          }

          finalIndexesToDelete.push(whitespaceStartedAt, i, whatToInsert);
        }

        whitespaceStartedAt = null;
        lastLinebreak = null;
      } //
      //
      //
      //
      //
      //
      //
      //
      //             MIDDLE
      //
      //
      //
      //
      //
      //
      //
      //
      // catch ending of the tag's name
      // ███████████████████████████████████████


      if (tagNameStartsAt !== null && tagName === null && !/\w/.test(str[i]) // not a letter
      ) {
          tagName = str.slice(tagNameStartsAt, i); // check for inner tag whitespace

          var idxOnTheRight = right(str, ~-i);

          if (typeof idxOnTheRight === "number" && str[idxOnTheRight] === ">" && !str[i].trim() && right(str, i)) {
            finalIndexesToDelete.push(i, right(str, i));
          } else if (idxOnTheRight && str[idxOnTheRight] === "/" && str[right(str, idxOnTheRight)] === ">") {
            // if there's a space in front of "/>"
            if (!str[i].trim() && right(str, i)) {
              finalIndexesToDelete.push(i, right(str, i));
            } // if there's space between slash and bracket


            if (str[idxOnTheRight + 1] !== ">" && right(str, idxOnTheRight + 1)) {
              finalIndexesToDelete.push(idxOnTheRight + 1, right(str, idxOnTheRight + 1));
            }
          }
        } // catch a tag's opening bracket
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && !withinInlineStyle && str[~-i] === "<" && tagNameStartsAt === null) {
        if (/\w/.test(str[i])) {
          tagNameStartsAt = i;
        } else if (str[right(str, ~-i)] === "/" && /\w/.test(str[right(str, right(str, ~-i))] || "")) {
          tagNameStartsAt = right(str, right(str, ~-i));
        }
      } // catch an end of CSS comments
      // ███████████████████████████████████████


      if (!doNothing && (withinStyleTag || withinInlineStyle) && styleCommentStartedAt !== null && str[i] === "*" && str[i + 1] === "/") { // stage:

        var _expander = expander({
          str: str,
          from: styleCommentStartedAt,
          to: i + 2,
          ifLeftSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS ,
          ifRightSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS 
        });

        stageFrom = _expander[0];
        stageTo = _expander[1]; // reset marker:

        styleCommentStartedAt = null;

        if (stageFrom != null) {
          finalIndexesToDelete.push(stageFrom, stageTo);
        } else {
          countCharactersPerLine += 1;
          i += 1;
        } // console.log(`0796 CONTINUE`);
        // continue;


        doNothing = i + 2;
      } // catch a start of CSS comments
      // ███████████████████████████████████████


      if (!doNothing && (withinStyleTag || withinInlineStyle) && styleCommentStartedAt === null && str[i] === "/" && str[i + 1] === "*") { // independently of options settings, mark the options setting
        // "removeCSSComments" as applicable:

        if (!applicableOpts.removeCSSComments) {
          applicableOpts.removeCSSComments = true;
        }

        if (opts.removeCSSComments) {
          styleCommentStartedAt = i;
        }
      } // catch an ending of mso conditional tags
      // ███████████████████████████████████████


      if (withinHTMLConditional && str.startsWith("![endif", i + 1)) {
        withinHTMLConditional = false;
      } // catch an end of HTML comment
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && !withinInlineStyle && htmlCommentStartedAt !== null) {
        var distanceFromHereToCommentEnding = void 0;

        if (str.startsWith("-->", i)) {
          distanceFromHereToCommentEnding = 3;
        } else if (str[i] === ">" && str[i - 1] === "]") {
          distanceFromHereToCommentEnding = 1;
        }

        if (distanceFromHereToCommentEnding) {
          // stage:
          var _expander2 = expander({
            str: str,
            from: htmlCommentStartedAt,
            to: i + distanceFromHereToCommentEnding
          });

          stageFrom = _expander2[0];
          stageTo = _expander2[1]; // reset marker:

          htmlCommentStartedAt = null;

          if (stageFrom != null) {
            // it depends is there any character allowance left from the
            // line length limit or not

            if (opts.lineLengthLimit && cpl - (stageTo - stageFrom) >= opts.lineLengthLimit) {
              finalIndexesToDelete.push(stageFrom, stageTo, "\n"); // Currently we're not on the bracket ">" of the comment
              // closing "-->", we're at the start of it, that first
              // dash. This means, we'll still traverse to the end
              // of this comment tag, before the actual "reset" should
              // happen.
              // Luckily we know how many characters are there left
              // to traverse until the comment's ending is reached -
              // "distanceFromHereToCommentEnding".

              cpl = -distanceFromHereToCommentEnding; // here we've reset cpl to some negative value, like -3
            } else {
              // we have some character length allowance left so
              // let's just delete the comment and reduce the cpl
              // by that length
              finalIndexesToDelete.push(stageFrom, stageTo);
              cpl -= stageTo - stageFrom;
            } // finalIndexesToDelete.push(i + 1, i + 1, "\n");
            // console.log(`1485 PUSH [${i + 1}, ${i + 1}, "\\n"]`);
            // countCharactersPerLine = 0;

          } else {
            countCharactersPerLine += distanceFromHereToCommentEnding - 1;
            i += distanceFromHereToCommentEnding - 1;
          } // console.log(`0796 CONTINUE`);
          // continue;


          doNothing = i + distanceFromHereToCommentEnding;
        }
      } // catch a start of HTML comment
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && !withinInlineStyle && str.startsWith("<!--", i) && htmlCommentStartedAt === null) { // detect outlook conditionals

        if (str.startsWith("[if", i + 4)) {

          if (!withinHTMLConditional) {
            withinHTMLConditional = true;
          } // skip the second counterpart, "<!-->" of "<!--[if !mso]><!-->"
          // the plan is to not set the "htmlCommentStartedAt" at all if deletion
          // is not needed


          if (opts.removeHTMLComments === 2) {
            htmlCommentStartedAt = i;
          }
        } else if ( // setting is either 1 or 2 (delete text comments only or any comments):
        opts.removeHTMLComments && ( // prevent the "not" type tails' "<!--" of "<!--<![endif]-->" from
        // accidentally triggering the clauses
        !withinHTMLConditional || opts.removeHTMLComments === 2)) {
          htmlCommentStartedAt = i;
        } // independently of options settings, mark the options setting
        // "removeHTMLComments" as applicable:


        if (!applicableOpts.removeHTMLComments) {
          applicableOpts.removeHTMLComments = true;
        } // opts.removeHTMLComments: 0|1|2

      } // catch style tag
      // ███████████████████████████████████████


      if (!doNothing && withinStyleTag && styleCommentStartedAt === null && str.startsWith("</style", i) && !isLetter(str[i + 7])) {
        withinStyleTag = false;
      } else if (!doNothing && !withinStyleTag && styleCommentStartedAt === null && str.startsWith("<style", i) && !isLetter(str[i + 6])) {
        withinStyleTag = true; // if opts.breakToTheLeftOf have "<style" among them, break to the
        // right of this tag as well

        if ((opts.removeLineBreaks || opts.removeIndentations) && opts.breakToTheLeftOf.includes("<style") && str.startsWith(" type=\"text/css\">", i + 6) && str[i + 24]) {
          finalIndexesToDelete.push(i + 23, i + 23, "\n");
        }
      } // catch start of inline styles
      // ███████████████████████████████████████


      if (!doNothing && !withinInlineStyle && "\"'".includes(str[i]) && str.endsWith("style=", i)) {
        withinInlineStyle = i;
      } // catch whitespace
      // ███████████████████████████████████████


      if (!doNothing && !str[i].trim()) {
        // if whitespace
        if (whitespaceStartedAt === null) {
          whitespaceStartedAt = i;
        }
      } else if (!doNothing && !((withinStyleTag || withinInlineStyle) && styleCommentStartedAt !== null)) {
        // catch the ending of a whitespace chunk
        // console.log(`0912`);
        if (whitespaceStartedAt !== null) {

          if (opts.removeLineBreaks) {
            countCharactersPerLine += 1;
          }

          if (beginningOfAFile) {
            beginningOfAFile = false;

            if (opts.removeIndentations || opts.removeLineBreaks) {
              finalIndexesToDelete.push(0, i);
            }
          } else { // so it's not beginning of a file
            // this is the most important area of the program - catching normal
            // whitespace chunks
            // ===================================================================
            // ██ CASE 1. Remove indentations only.

            if (opts.removeIndentations && !opts.removeLineBreaks) {

              if (!nonWhitespaceCharMet && lastLinebreak !== null && i > lastLinebreak) {
                finalIndexesToDelete.push(lastLinebreak + 1, i);
              } else if (whitespaceStartedAt + 1 < i) {
                // we'll try to recycle some spaces, either at the
                // beginning (preferable) or ending (at least) of the
                // whitespace chunk, instead of wiping whole whitespace
                // chunk and adding single space again.
                // first, crop tight around the conditional comments
                if ( // imagine <!--[if mso]>
                str.endsWith("]>", whitespaceStartedAt) || // imagine <!--[if !mso]><!-->...<
                //                            ^
                //                            |
                //                          our "whitespaceStartedAt"
                str.endsWith("-->", whitespaceStartedAt) || // imagine closing counterparts, .../>...<![endif]-->
                str.startsWith("<![", i) || // imagine other type of closing counterpart, .../>...<!--<![
                str.startsWith("<!--<![", i)) {
                  // push the whole whitespace chunk
                  finalIndexesToDelete.push(whitespaceStartedAt, i);
                } else if (str[whitespaceStartedAt] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
                } else if (str[~-i] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt, ~-i);
                } else {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, " ");
                }
              }
            } // ===================================================================
            // ██ CASE 2. Remove linebreaks (includes indentation removal by definition).


            if (opts.removeLineBreaks || withinInlineStyle) { //
              // ██ CASE 2-1 - special break points from opts.breakToTheLeftOf

              if (breakToTheLeftOfFirstLetters.includes(str[i]) && matchRightIncl(str, i, opts.breakToTheLeftOf)) { // maybe there was just single line break?

                if (!(str[~-i] === "\n" && whitespaceStartedAt === ~-i)) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, "\n");
                }

                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                whitespaceStartedAt = null;
                countCharactersPerLine = 1;
                continue;
              } // ██ CASE 2-2 - rest of whitespace chunk removal clauses
              var whatToAdd = " "; // skip for inline tags and also inline comparisons vs. numbers
              // for example "something < 2" or "zzz > 1"

              if ( // (
              str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
                cb: function cb(nextChar) {
                  return !nextChar || !/\w/.test(nextChar);
                }
              }) // ) ||
              // ("<>".includes(str[i]) &&
              //   ("0123456789".includes(str[right(str, i)]) ||
              //     "0123456789".includes(str[left(str, i)])))
              ) ; else if (str[~-whitespaceStartedAt] && DELETE_TIGHTLY_IF_ON_LEFT_IS.includes(str[~-whitespaceStartedAt]) && DELETE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i]) || (withinStyleTag || withinInlineStyle) && styleCommentStartedAt === null && (DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS.includes(str[~-whitespaceStartedAt]) || DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i])) || str.startsWith("!important", i) && !withinHTMLConditional || withinInlineStyle && (str[~-whitespaceStartedAt] === "'" || str[~-whitespaceStartedAt] === '"') || str[~-whitespaceStartedAt] === "}" && str.startsWith("</style", i) || str[i] === ">" && ("'\"".includes(str[left(str, i)]) || str[right(str, i)] === "<") || str[i] === "/" && str[right(str, i)] === ">") {
                whatToAdd = "";

                if (str[i] === "/" && str[i + 1] === ">" && right(str, i) && right(str, i) > i + 1) {
                  // delete whitespace between / and >
                  finalIndexesToDelete.push(i + 1, right(str, i));
                  countCharactersPerLine -= right(str, i) - i + 1;
                }
              }

              if (whatToAdd && whatToAdd.length) {
                countCharactersPerLine += 1;
              } // TWO CASES:


              if (!opts.lineLengthLimit) { // 2-1: Line-length limiting is off (easy)
                // We skip the stage part, the whitespace chunks to straight to
                // finalIndexesToDelete ranges array.
                // but ensure that we're not replacing a single space with a single space

                if (!(i === whitespaceStartedAt + 1 && // str[whitespaceStartedAt] === " " &&
                whatToAdd === " ")) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                }
              } else { // 2-2: Line-length limiting is on (not that easy)
                // maybe we are already beyond the limit?

                if (countCharactersPerLine >= opts.lineLengthLimit || !str[i + 1] || str[i] === ">" || str[i] === "/" && str[i + 1] === ">") {

                  if (countCharactersPerLine > opts.lineLengthLimit || countCharactersPerLine === opts.lineLengthLimit && str[i + 1] && str[i + 1].trim() && !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i + 1])) {
                    whatToAdd = "\n";
                    countCharactersPerLine = 1;
                  } // replace the whitespace only in two cases:
                  // 1) if line length limit would otherwise be exceeded
                  // 2) if this replacement reduces the file length. For example,
                  // don't replace the linebreak with a space. But do delete
                  // linebreak like it happens between tags.


                  if (countCharactersPerLine > opts.lineLengthLimit || !(whatToAdd === " " && i === whitespaceStartedAt + 1)) {
                    finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                    lastLinebreak = null;
                  }

                  stageFrom = null;
                  stageTo = null;
                  stageAdd = null;
                } else if (stageFrom === null || whitespaceStartedAt < stageFrom) {
                  // only submit the range if it's bigger
                  stageFrom = whitespaceStartedAt;
                  stageTo = i;
                  stageAdd = whatToAdd;
                }
              }
            } // ===================================================================

          } // finally, toggle the marker:


          whitespaceStartedAt = null; // toggle nonWhitespaceCharMet

          if (!nonWhitespaceCharMet) {
            nonWhitespaceCharMet = true;
          } // continue;

        } else {
          // 1. case when first character in string is not whitespace:
          if (beginningOfAFile) {
            beginningOfAFile = false;
          } // 2. tend count if linebreak removal is on:


          if (opts.removeLineBreaks) {
            // there was no whitespace gap and linebreak removal is on, so just
            // increment the count
            countCharactersPerLine += 1;
          }
        } // ===================================================================
        // ██ EXTRAS:
        // toggle nonWhitespaceCharMet


        if (!nonWhitespaceCharMet) {
          nonWhitespaceCharMet = true;
        }
      } // catch the characters, suitable for a break


      if (!doNothing && !beginningOfAFile && i !== 0 && opts.removeLineBreaks && (opts.lineLengthLimit || breakToTheLeftOfFirstLetters) && !str.startsWith("</a", i)) {
        if (breakToTheLeftOfFirstLetters && matchRightIncl(str, i, opts.breakToTheLeftOf) && str.slice(0, i).trim() && (!str.startsWith("<![endif]", i) || !matchLeft(str, i, "<!--"))) {
          finalIndexesToDelete.push(i, i, "\n");
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
          countCharactersPerLine = 1;
          continue;
        } else if (opts.lineLengthLimit && countCharactersPerLine <= opts.lineLengthLimit) {
          if (!str[i + 1] || CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !CHARS_DONT_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) || CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) || !str[i].trim()) { // 1. release stage contents - now they'll be definitely deleted
            // =============================================================

            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              var _whatToAdd = stageAdd; // if we are not on breaking point, last "stageAdd" needs to be
              // amended into linebreak because otherwise we'll exceed the
              // character limit

              if (str[i].trim() && str[i + 1] && str[i + 1].trim() && countCharactersPerLine + (stageAdd ? stageAdd.length : 0) > opts.lineLengthLimit) {
                _whatToAdd = "\n";
              } // if line is beyond the line length limit or whitespace is not
              // a single space, staged to be replaced with single space,
              // tackle this whitespace


              if (countCharactersPerLine + (_whatToAdd ? _whatToAdd.length : 0) > opts.lineLengthLimit || !(_whatToAdd === " " && stageTo === stageFrom + 1 && str[stageFrom] === " ")) { // push this range only if it's not between curlies, } and {

                if (!(str[~-stageFrom] === "}" && str[stageTo] === "{")) {
                  finalIndexesToDelete.push(stageFrom, stageTo, _whatToAdd);
                  lastLinebreak = null;
                } // else {
                //   console.log(
                //     `1419 didn't push because whitespace is between curlies`
                //   );
                // }

              } else {
                countCharactersPerLine -= lastLinebreak || 0;
              }
            } // 2. put this current place into stage
            // =============================================================

            if (str[i].trim() && (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) || str[~-i] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[~-i])) && isStr$2(leftTagName) && (!tagName || !opts.mindTheInlineTags.includes(tagName)) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
              cb: function cb(nextChar) {
                return !nextChar || !/\w/.test(nextChar);
              }
            })) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
              trimCharsBeforeMatching: "/",
              cb: function cb(nextChar) {
                return !nextChar || !/\w/.test(nextChar);
              }
            }))) {
              stageFrom = i;
              stageTo = i;
              stageAdd = null;
            } else if (styleCommentStartedAt === null && stageFrom !== null && (withinInlineStyle || !opts.mindTheInlineTags || !Array.isArray(opts.mindTheInlineTags) || Array.isArray(opts.mindTheInlineTags.length) && !opts.mindTheInlineTags.length || !isStr$2(tagName) || Array.isArray(opts.mindTheInlineTags) && opts.mindTheInlineTags.length && isStr$2(tagName) && !opts.mindTheInlineTags.includes(tagName)) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
              trimCharsBeforeMatching: "/",
              cb: function cb(nextChar) {
                return !nextChar || !/\w/.test(nextChar);
              }
            }))) {
              stageFrom = null;
              stageTo = null;
              stageAdd = null; // if (str[i] === "\n" || str[i] === "\r") {
              //   countCharactersPerLine -= lastLinebreak;
              //   console.log(
              //     `1449 SET countCharactersPerLine = ${countCharactersPerLine}`
              //   );
              // }
            }
          }
        } else if (opts.lineLengthLimit) {
          // countCharactersPerLine > opts.lineLengthLimit // LIMIT HAS BEEN EXCEEDED!
          // WE NEED TO BREAK RIGHT HERE

          if (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
            trimCharsBeforeMatching: "/",
            cb: function cb(nextChar) {
              return !nextChar || !/\w/.test(nextChar);
            }
          }))) {
            // ██ 1.
            // // if really exceeded, not on limit, commit stage which will shorten
            // the string and maybe we'll be within the limit range again

            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) { // case in test 02.11.09
              // We might have passed some tabs for example, which should be
              // deleted what might put line length back within limit. Or not.
              //

              var whatToAddLength = stageAdd && stageAdd.length ? stageAdd.length : 0; // Currently, countCharactersPerLine > opts.lineLengthLimit
              // But, will it still be true if we compensate for what's in stage?

              if (countCharactersPerLine - (stageTo - stageFrom - whatToAddLength) - 1 > opts.lineLengthLimit) ; else {
                // So,
                // countCharactersPerLine -
                // (stageTo - stageFrom - whatToAddLength) - 1 <=
                // opts.lineLengthLimit
                // don't break at stage, just apply its contents and we're good
                finalIndexesToDelete.push(stageFrom, stageTo, stageAdd); // We're not done yet. We are currently located on a potential
                // break point,
                // countCharactersPerLine -
                // (stageTo - stageFrom - whatToAddLength) - 1 ===
                // opts.lineLengthLimit ?

                if (countCharactersPerLine - (stageTo - stageFrom - whatToAddLength) - 1 === opts.lineLengthLimit) {
                  finalIndexesToDelete.push(i, i, "\n");
                  countCharactersPerLine = 0;
                } // reset


                stageFrom = null;
                stageTo = null;
                stageAdd = null;
              }
            } else { //

              finalIndexesToDelete.push(i, i, "\n");
              countCharactersPerLine = 0;
            }
          } else if (str[i + 1] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && isStr$2(tagName) && Array.isArray(opts.mindTheInlineTags) && opts.mindTheInlineTags.length && !opts.mindTheInlineTags.includes(tagName)) {
            // ██ 2.
            //

            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) ; else { //

              finalIndexesToDelete.push(i + 1, i + 1, "\n");
              countCharactersPerLine = 0;
            }
          } else if (!str[i].trim()) ; else if (!str[i + 1]) {
            // ██ 4.
            // // if we reached the end of string, check what's in stage

            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              finalIndexesToDelete.push(stageFrom, stageTo, "\n");
            }
          }
        }
      } // catch any character beyond the line length limit:


      if (!doNothing && !beginningOfAFile && opts.removeLineBreaks && opts.lineLengthLimit && countCharactersPerLine >= opts.lineLengthLimit && stageFrom !== null && stageTo !== null && !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !"/".includes(str[i])) { // two possible cases:
        // 1. we hit the line length limit and we can break afterwards
        // 2. we can't break afterwards, and there might be stage present

        if (!(countCharactersPerLine === opts.lineLengthLimit && str[i + 1] && !str[i + 1].trim())) {
          //
          var _whatToAdd2 = "\n";

          if (str[i + 1] && !str[i + 1].trim() && countCharactersPerLine === opts.lineLengthLimit) {
            _whatToAdd2 = stageAdd;
          } // final correction - we might need to extend stageFrom to include
          // all whitespace on the left if whatToAdd is a line break


          if (_whatToAdd2 === "\n" && !str[~-stageFrom].trim() && left(str, stageFrom)) {
            stageFrom = left(str, stageFrom) + 1;
          }
          finalIndexesToDelete.push(stageFrom, stageTo, _whatToAdd2);
          countCharactersPerLine = i - stageTo;

          if (str[i].length) {
            countCharactersPerLine += 1;
          }

          stageFrom = null;
          stageTo = null;
          stageAdd = null;
        }
      } // catch line breaks
      // ███████████████████████████████████████


      if (!doNothing && str[i] === "\n" || str[i] === "\r" && (!str[i + 1] || str[i + 1] && str[i + 1] !== "\n")) {
        // =======================================================================
        // mark this
        lastLinebreak = i; // =======================================================================
        // reset nonWhitespaceCharMet

        if (nonWhitespaceCharMet) {
          nonWhitespaceCharMet = false;
        } // =======================================================================
        // delete trailing whitespace on each line OR empty lines


        if (!opts.removeLineBreaks && whitespaceStartedAt !== null && whitespaceStartedAt < i && str[i + 1] && str[i + 1] !== "\r" && str[i + 1] !== "\n") {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
        }
      } // catch the EOF
      // ███████████████████████████████████████


      if (!str[i + 1]) {
        if (withinStyleTag && styleCommentStartedAt !== null) {
          finalIndexesToDelete.push.apply(finalIndexesToDelete, expander({
            str: str,
            from: styleCommentStartedAt,
            to: i,
            ifLeftSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS ,
            ifRightSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS 
          }));
        } else if (whitespaceStartedAt && str[i] !== "\n" && str[i] !== "\r") {
          // catch trailing whitespace at the end of the string which is not legit
          // trailing linebreak
          finalIndexesToDelete.push(whitespaceStartedAt, i + 1);
        } else if (whitespaceStartedAt && (str[i] === "\r" && str[i + 1] === "\n" || str[i] === "\n" && str[i - 1] !== "\r")) {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
        }
      } //
      //
      //
      //
      //
      //
      //
      //
      //
      //              BOTTOM
      //
      //
      //
      //
      //
      //
      //
      //
      // catch end of inline styles
      // ███████████████████████████████████████


      if (!doNothing && withinInlineStyle && withinInlineStyle < i && str[withinInlineStyle] === str[i]) {
        withinInlineStyle = null;
      } // catch <pre...>
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && str.startsWith("<pre", i) && !isLetter(str[i + 4])) {
        var locationOfClosingPre = str.indexOf("</pre", i + 5);

        if (locationOfClosingPre > 0) {
          doNothing = locationOfClosingPre;
        }
      } // catch <code...>
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && str.startsWith("<code", i) && !isLetter(str[i + 5])) {
        var locationOfClosingCode = str.indexOf("</code", i + 5);

        if (locationOfClosingCode > 0) {
          doNothing = locationOfClosingCode;
        }
      } // catch start of <![CDATA[
      // ███████████████████████████████████████


      if (!doNothing && str.startsWith("<![CDATA[", i)) {
        var locationOfClosingCData = str.indexOf("]]>", i + 9);

        if (locationOfClosingCData > 0) {
          doNothing = locationOfClosingCData;
        }
      } // catch tag's closing bracket
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && !withinInlineStyle && tagNameStartsAt !== null && str[i] === ">") {
        // if another tag starts on the right, hand over the name:
        if (str[right(str, i)] === "<") {
          leftTagName = tagName;
        }

        tagNameStartsAt = null;
        tagName = null;
      } // catch tag's opening bracket
      // ███████████████████████████████████████


      if (str[i] === "<" && leftTagName !== null) {
        // reset it after use
        leftTagName = null;
      } // logging after each loop's iteration:
      //
      //
      // end of the loop
    }

    if (finalIndexesToDelete.current()) {
      var ranges = finalIndexesToDelete.current();
      finalIndexesToDelete.wipe();
      var startingPercentageDone = opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage;
      var res = rApply(str, ranges, function (applyPercDone) {
        // allocate remaining "leavePercForLastStage" percentage of the total
        // progress reporting to this stage:
        if (opts.reportProgressFunc && len >= 2000) {
          currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) * (applyPercDone / 100));

          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      });
      var resLen = res.length;
      return {
        log: {
          timeTakenInMilliseconds: Date.now() - start,
          originalLength: len,
          cleanedLength: resLen,
          bytesSaved: Math.max(len - resLen, 0),
          percentageReducedOfOriginal: len ? Math.round(Math.max(len - resLen, 0) * 100 / len) : 0
        },
        ranges: ranges,
        applicableOpts: applicableOpts,
        result: res
      };
    }
  } // ELSE - return the original input string
  return {
    log: {
      timeTakenInMilliseconds: Date.now() - start,
      originalLength: len,
      cleanedLength: len,
      bytesSaved: 0,
      percentageReducedOfOriginal: 0
    },
    applicableOpts: applicableOpts,
    ranges: null,
    result: str
  };
}

exports.crush = crush;
exports.defaults = defaults$5;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));

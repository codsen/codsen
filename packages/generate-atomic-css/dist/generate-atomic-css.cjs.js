/**
 * generate-atomic-css
 * Generate Atomic CSS
 * Version: 1.4.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/generate-atomic-css/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version = "1.4.5";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

function isStr(something) {
  return typeof something === "string";
}

var headsAndTails = {
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS"
};
var units = ["px", "em", "%", "rem", "cm", "mm", "in", "pt", "pc", "ex", "ch", "vw", "vmin", "vmax"];
var CONFIGHEAD = headsAndTails.CONFIGHEAD,
    CONFIGTAIL = headsAndTails.CONFIGTAIL,
    CONTENTHEAD = headsAndTails.CONTENTHEAD,
    CONTENTTAIL = headsAndTails.CONTENTTAIL;
var padLeftIfTheresOnTheLeft = [":"];

function extractConfig(str) {
  var extractedConfig = str;
  var rawContentAbove = "";
  var rawContentBelow = "";

  if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {

    if (str.indexOf(CONFIGTAIL) !== -1 && str.indexOf(CONTENTHEAD) !== -1 && str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)) {
      throw new Error("generate-atomic-css: [THROW_ID_02] Config heads are after config tails!");
    }

    var sliceFrom = str.indexOf(CONFIGHEAD) + CONFIGHEAD.length;
    var sliceTo = str.indexOf(CONFIGTAIL); // if there are opening CSS comments, include them:

    if (str[stringLeftRight.right(str, sliceFrom)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom))] === "/") {
      sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom)) + 1;
    } // if there are closing CSS comments include them too:


    if (str[stringLeftRight.left(str, sliceTo)] === "*" && str[stringLeftRight.left(str, stringLeftRight.left(str, sliceTo))] === "/") {
      sliceTo = stringLeftRight.left(str, stringLeftRight.left(str, sliceTo));
    }

    extractedConfig = str.slice(sliceFrom, sliceTo).trim();

    if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
      return [extractedConfig, rawContentAbove, rawContentBelow];
    }
  } else if (str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && str.includes(CONTENTHEAD)) {

    if (str.indexOf(CONFIGHEAD) > str.indexOf(CONTENTHEAD)) {
      throw new Error("generate-atomic-css: [THROW_ID_03] Config heads are after content heads!");
    }

    extractedConfig = str.slice(str.indexOf(CONFIGHEAD) + CONFIGHEAD.length, str.indexOf(CONTENTHEAD));
  } else if (!str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && (str.includes(CONTENTHEAD) || str.includes(CONTENTTAIL))) {
    // strange case where instead of config heads/tails we have content heads/tails
    extractedConfig = str; // remove content head

    if (extractedConfig.includes(CONTENTHEAD)) { // if content heads are present, cut off right after the closing comment
      // if such follows, or right after heads if not

      if (stringLeftRight.left(str, extractedConfig.indexOf(CONTENTHEAD))) {

        var _sliceTo2 = extractedConfig.indexOf(CONTENTHEAD); // if there are opening or closing comments, don't include those


        if (stringLeftRight.leftSeq(str, _sliceTo2, "/", "*")) {
          _sliceTo2 = stringLeftRight.leftSeq(str, _sliceTo2, "/", "*").leftmostChar;
        }

        rawContentAbove = _sliceTo2 === 0 ? "" : str.slice(0, _sliceTo2);
      }

      var _sliceFrom = extractedConfig.indexOf(CONTENTHEAD) + CONTENTHEAD.length;

      if (stringLeftRight.rightSeq(extractedConfig, _sliceFrom - 1, "*", "/")) {
        _sliceFrom = stringLeftRight.rightSeq(extractedConfig, _sliceFrom - 1, "*", "/").rightmostChar + 1;
      }

      var _sliceTo = null;

      if (str.includes(CONTENTTAIL)) {
        _sliceTo = str.indexOf(CONTENTTAIL); // don't include comment on the left

        if (str[stringLeftRight.left(str, _sliceTo)] === "*" && str[stringLeftRight.left(str, stringLeftRight.left(str, _sliceTo))] === "/") {
          _sliceTo = stringLeftRight.left(str, stringLeftRight.left(str, _sliceTo));
        } // is there content afterwards?


        var contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

        if (str[stringLeftRight.right(str, contentAfterStartsAt - 1)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, contentAfterStartsAt - 1))] === "/") {
          contentAfterStartsAt = stringLeftRight.right(str, stringLeftRight.right(str, contentAfterStartsAt - 1)) + 1; // if there are non-whitespace characters, that's rawContentBelow
        }

        if (stringLeftRight.right(str, contentAfterStartsAt)) {
          rawContentBelow = str.slice(contentAfterStartsAt);
        }
      }

      if (_sliceTo) {
        extractedConfig = extractedConfig.slice(_sliceFrom, _sliceTo).trim();
      } else {
        extractedConfig = extractedConfig.slice(_sliceFrom).trim();
      }
    } // remove content tail
    else if (extractedConfig.includes(CONTENTTAIL)) {
        var contentInFront = [];
        var stopFilteringAndPassAllLines = false;
        extractedConfig = extractedConfig.split("\n").filter(function (rowStr) {
          if (!rowStr.includes("$$$") && !stopFilteringAndPassAllLines) {
            if (!stopFilteringAndPassAllLines) {
              contentInFront.push(rowStr);
            }

            return false;
          } // ... so the row contains $$$


          if (!stopFilteringAndPassAllLines) {
            stopFilteringAndPassAllLines = true;
            return true;
          }

          return true;
        }).join("\n");

        var _sliceTo3 = extractedConfig.indexOf(CONTENTTAIL);

        if (stringLeftRight.leftSeq(extractedConfig, _sliceTo3, "/", "*")) {
          _sliceTo3 = stringLeftRight.leftSeq(extractedConfig, _sliceTo3, "/", "*").leftmostChar;
        }

        extractedConfig = extractedConfig.slice(0, _sliceTo3).trim();

        if (contentInFront.length) {
          rawContentAbove = contentInFront.join("\n") + "\n";
        } // retrieve the content after content tails


        var _contentAfterStartsAt;

        if (stringLeftRight.right(str, str.indexOf(CONTENTTAIL) + CONTENTTAIL.length)) {
          _contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

          if (str[stringLeftRight.right(str, _contentAfterStartsAt)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, _contentAfterStartsAt))] === "/") {
            _contentAfterStartsAt = stringLeftRight.right(str, stringLeftRight.right(str, _contentAfterStartsAt)) + 1;

            if (stringLeftRight.right(str, _contentAfterStartsAt)) {
              rawContentBelow = str.slice(_contentAfterStartsAt);
            }
          }
        }
      }
  } else {
    var contentHeadsRegex = new RegExp("(\\/\\s*\\*\\s*)*" + CONTENTHEAD + "(\\s*\\*\\s*\\/)*");
    var contentTailsRegex = new RegExp("(\\/\\s*\\*\\s*)*" + CONTENTTAIL + "(\\s*\\*\\s*\\/)*");
    var stopFiltering = false;
    var gatheredLinesAboveTopmostConfigLine = [];
    var gatheredLinesBelowLastConfigLine = []; // remove all lines above the first line which contains $$$

    var configLines = str.split("\n").filter(function (rowStr) {
      if (stopFiltering) {
        return true;
      }

      if (!rowStr.includes("$$$") && !rowStr.includes("{") && !rowStr.includes(":")) {
        gatheredLinesAboveTopmostConfigLine.push(rowStr);
        return false;
      } // but if it does contain $$$...


      stopFiltering = true;
      return true;
    }); // now we need to separate any rows in the end that don't contain $$$

    for (var i = configLines.length; i--;) {
      if (!configLines[i].includes("$$$") && !configLines[i].includes("}") && !configLines[i].includes(":")) {
        gatheredLinesBelowLastConfigLine.unshift(configLines.pop());
      } else {
        break;
      }
    }

    extractedConfig = configLines.join("\n").replace(contentHeadsRegex, "").replace(contentTailsRegex, "");

    if (gatheredLinesAboveTopmostConfigLine.length) {
      rawContentAbove = gatheredLinesAboveTopmostConfigLine.join("\n") + "\n";
    }

    if (gatheredLinesBelowLastConfigLine.length) {
      rawContentBelow = "\n" + gatheredLinesBelowLastConfigLine.join("\n");
    }
  }
  return [extractedConfig, rawContentAbove, rawContentBelow];
}

function trimBlankLinesFromLinesArray(lineArr, trim) {
  if (trim === void 0) {
    trim = true;
  }

  // killswitch is activated, do nothing
  if (!trim) {
    return lineArr;
  }

  var copyArr = Array.from(lineArr);

  if (copyArr.length && isStr(copyArr[0]) && !copyArr[0].trim().length) {
    do {
      copyArr.shift();
    } while (isStr(copyArr[0]) && !copyArr[0].trim().length);
  }

  if (copyArr.length && isStr(copyArr[copyArr.length - 1]) && !copyArr[copyArr.length - 1].trim().length) {
    do {
      copyArr.pop();
    } while (copyArr && copyArr[copyArr.length - 1] && !copyArr[copyArr.length - 1].trim().length);
  }

  return copyArr;
} // takes string for example, .mt$$$ { margin-top: $$$px; }|3
// and extracts the parts after the pipe
// also, we use it for simpler format sources that come from wizard on the
// webapp, format .mt|0|500 - same business, extract digits between pipes


function extractFromToSource(str, fromDefault, toDefault) {
  if (fromDefault === void 0) {
    fromDefault = 0;
  }

  if (toDefault === void 0) {
    toDefault = 500;
  }

  var from = fromDefault;
  var to = toDefault;
  var source = str;
  var tempArr;

  if (str.lastIndexOf("}") > 0 && str.slice(str.lastIndexOf("}") + 1).includes("|")) {
    tempArr = str.slice(str.lastIndexOf("}") + 1).split("|").filter(function (val) {
      return val.trim().length;
    }).map(function (val) {
      return val.trim();
    }).filter(function (val) {
      return String(val).split("").every(function (char) {
        return /\d/g.test(char);
      });
    });
  } else if (str.includes("|")) {
    tempArr = str.split("|").filter(function (val) {
      return val.trim().length;
    }).map(function (val) {
      return val.trim();
    }).filter(function (val) {
      return String(val).split("").every(function (char) {
        return /\d/g.test(char);
      });
    });
  }

  if (Array.isArray(tempArr)) {
    if (tempArr.length === 1) {
      to = Number.parseInt(tempArr[0], 10);
    } else if (tempArr.length > 1) {
      from = Number.parseInt(tempArr[0], 10);
      to = Number.parseInt(tempArr[1], 10);
    }
  } // extract the source string - it's everything from zero to first pipe
  // that follows the last closing curly brace

  if (str.lastIndexOf("}") > 0 && str.slice(str.lastIndexOf("}") + 1).includes("|")) {
    source = str.slice(0, str.indexOf("|", str.lastIndexOf("}") + 1)).trimEnd();

    if (source.trim().startsWith("|")) {

      while (source.trim().startsWith("|")) {
        source = source.trim().slice(1);
      }
    }
  } else {
    var lastPipeWasAt = null;
    var firstNonPipeNonWhitespaceCharMet = false;
    var startFrom = 0;
    var endTo = str.length; // null is fresh state, true is met, false is pattern of only digits was broken

    var onlyDigitsAndWhitespaceBeenMet = null;

    for (var i = 0, len = str.length; i < len; i++) { // first "cell" between pipes which contains only digits terminates the
      // loop; its opening pipe is "endTo", we slice up to it

      if ("0123456789".includes(str[i])) {
        // if it's digit...
        if (onlyDigitsAndWhitespaceBeenMet === null && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = true;
        }
      } // if not digit...
      else if (str[i] !== "|" && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = false;
        } // catch the last character


      if (!str[i + 1] && onlyDigitsAndWhitespaceBeenMet && lastPipeWasAt) {
        endTo = lastPipeWasAt;
      } // catch pipe


      if (str[i] === "|") {

        if (onlyDigitsAndWhitespaceBeenMet && lastPipeWasAt) {
          endTo = lastPipeWasAt;
          break;
        }

        lastPipeWasAt = i; // reset:

        onlyDigitsAndWhitespaceBeenMet = null;
      } else if (!firstNonPipeNonWhitespaceCharMet && str[i].trim().length) {
        firstNonPipeNonWhitespaceCharMet = true;

        if (lastPipeWasAt !== null) {
          startFrom = lastPipeWasAt + 1;
        }
      }
    }
    source = str.slice(startFrom, endTo).trimEnd();
  }

  return [from, to, source];
}

function prepLine(str, progressFn, subsetFrom, subsetTo, generatedCount, pad) {
  //
  //
  //
  //                PART I. Extract from, to and source values
  //
  //
  //
  var currentPercentageDone;
  var lastPercentage = 0; // we need to extract the "from" and to "values"
  // the separator is vertical pipe, which is a legit CSS selector

  var _extractFromToSource = extractFromToSource(str, 0, 500),
      from = _extractFromToSource[0],
      to = _extractFromToSource[1],
      source = _extractFromToSource[2]; //
  //
  //
  //           PART II. extract dollar-dollar-dollar positions and types
  //
  //
  //

  var subsetRange = subsetTo - subsetFrom;
  var res = ""; // traverse

  var _loop = function _loop(i) {
    var debtPaddingLen = 0; // if (pad) {

    var startPoint = 0;

    var _loop2 = function _loop2(y, len) {
      source[y].charCodeAt(0); // catch third dollar of three dollars in a row
      // -----------------------------------------------------------------------

      if (source[y] === "$" && source[y - 1] === "$" && source[y - 2] === "$") { // submit all the content up until now

        var restOfStr = source.slice(y + 1);
        var unitFound;

        if (i === 0 && // eslint-disable-next-line consistent-return, array-callback-return
        units.some(function (unit) {
          if (restOfStr.startsWith(unit)) {
            unitFound = unit;
            return true;
          }
        }) && (source[stringLeftRight.right(source, y + unitFound.length)] === "{" || !source[y + unitFound.length + 1].trim().length)) {
          res += "" + source.slice(startPoint, y - 2) + (pad ? String(i).padStart(String(to).length - String(i).length + unitFound.length + 1) : i);
          startPoint = y + 1 + (unitFound ? unitFound.length : 0);
        } else {
          // extract units if any follow the $$$
          var unitThatFollow; // eslint-disable-next-line consistent-return, array-callback-return

          units.some(function (unit) {
            if (source.startsWith(unit, y + 1)) {
              unitThatFollow = unit;
              return true;
            }
          });

          if (!source[y - 3].trim().length || // eslint-disable-next-line
          padLeftIfTheresOnTheLeft.some(function (val) {
            return source.slice(startPoint, y - 2).trim().endsWith(val);
          })) {
            // if left-side padding can be possible: // if the chunk we're adding starts with unit, we need to remove it
            // if it's zero'th row

            var temp = 0;

            if (i === 0) {
              // eslint-disable-next-line no-loop-func
              units.some(function (unit) {
                if (("" + source.slice(startPoint, y - 2)).startsWith(unit)) {
                  temp = unit.length;
                }

                return true;
              });
            }

            res += "" + source.slice(startPoint + temp, y - 2) + (pad ? String(i).padStart(String(to).length + (i === 0 && unitThatFollow ? unitThatFollow.length : 0)) : i);
          } else if (!source[y + 1].trim().length || source[stringLeftRight.right(source, y)] === "{") { // if right-side padding can be possible:

            res += "" + source.slice(startPoint, y - 2) + (pad ? String(i).padEnd(String(to).length + (i === 0 && unitThatFollow ? unitThatFollow.length : 0)) : i);
          } else {
            res += "" + source.slice(startPoint, y - 2) + i; // also, make a note of padding which we'll need to do later,
            // in front of the next opening curlie.
            // for example, range is 0-10, so 2 digit padding, and we have
            // .pt0px[lang|=en]
            // this zero above needs to be padded at the next available location
            // that is before opening curlie.
            //

            if (pad) {
              debtPaddingLen = String(to).length - String(i).length;
            }
          }

          startPoint = y + 1;
        }
      } // catch opening curlie
      // -----------------------------------------------------------------------


      if (source[y] === "{" && pad) {

        if (debtPaddingLen) {
          res += "" + source.slice(startPoint, y) + " ".repeat(debtPaddingLen);
          startPoint = y;
          debtPaddingLen = 0;
        }
      } // catch the last character of a line


      if (!source[y + 1]) {

        var _unitFound;

        var _restOfStr = source.slice(startPoint);

        if (i === 0 && // eslint-disable-next-line
        units.some(function (unit) {
          if (_restOfStr.startsWith(unit)) {
            _unitFound = unit;
            return true;
          }
        })) {
          res += "" + source.slice(startPoint + _unitFound.length);
        } else {
          res += "" + source.slice(startPoint);
        } // add line break


        res += "" + (i !== to ? "\n" : "");
      }
    };

    for (var y = 0, len = source.length; y < len; y++) {
      _loop2(y);
    } // eslint-disable-next-line no-param-reassign


    generatedCount.count += 1;

    if (typeof progressFn === "function") {
      currentPercentageDone = Math.floor(subsetFrom + i / (to - from) * subsetRange);

      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        progressFn(currentPercentageDone);
      }
    }
  };

  for (var i = from; i <= to; i++) {
    _loop(i);
  }

  return res;
}

function bump(str, thingToBump) {
  if (/\.\w/g.test(str)) {
    // eslint-disable-next-line no-param-reassign
    thingToBump.count += 1;
  }

  return str;
}

function prepConfig(str, progressFn, progressFrom, progressTo, trim, generatedCount, pad) {
  if (trim === void 0) {
    trim = true;
  }

  // all rows will report the progress from progressFrom to progressTo.
  // For example, defaults 0 to 100.
  // If there are for example 5 rows, each row will iterate through
  // (100-0)/5 = 20 percent range. This means, progress bar will be jumpy:
  // it will pass rows without $$$ quick but ones with $$$ slow and granular.
  return trimBlankLinesFromLinesArray(str.split(/\r?\n/).map(function (rowStr, i, arr) {
    return rowStr.includes("$$$") ? prepLine(rowStr, progressFn, progressFrom + (progressTo - progressFrom) / arr.length * i, progressFrom + (progressTo - progressFrom) / arr.length * (i + 1), generatedCount, pad) : bump(rowStr, generatedCount);
  }), trim).join("\n");
}

var version$1 = version;
var defaults = {
  includeConfig: true,
  includeHeadsAndTails: true,
  pad: true,
  configOverride: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};

function genAtomic(str, originalOpts) {
  function trimIfNeeded(str2, opts) {
    if (opts === void 0) {
      opts = {};
    }

    // if config and heads/tails are turned off, don't trim
    if (!opts.includeConfig && !opts.includeHeadsAndTails) {
      return str2;
    }
    return str2.trim();
  }

  if (typeof str !== "string") {
    throw new Error("generate-atomic-css: [THROW_ID_01] First input argument must be a string! It was given as \"" + JSON.stringify(str, null, 4) + "\" (type " + typeof str + ")");
  }

  var CONFIGHEAD = headsAndTails.CONFIGHEAD,
      CONFIGTAIL = headsAndTails.CONFIGTAIL,
      CONTENTHEAD = headsAndTails.CONTENTHEAD,
      CONTENTTAIL = headsAndTails.CONTENTTAIL;
  var generatedCount = {
    count: 0
  };

  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);

  if (opts.includeConfig && !opts.includeHeadsAndTails) {
    // opts.includeConfig is a superset feature of opts.includeHeadsAndTails
    opts.includeHeadsAndTails = true;
  } // quick end if there are no $$$ in the input


  if (!opts.configOverride && !str.includes("$$$") && !str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && !str.includes(CONTENTHEAD) && !str.includes(CONTENTTAIL) || opts && opts.configOverride && typeof opts.configOverride === "string" && !opts.configOverride.includes("$$$") && !opts.configOverride.includes(CONFIGHEAD) && !opts.configOverride.includes(CONFIGTAIL) && !opts.configOverride.includes(CONTENTHEAD) && !opts.configOverride.includes(CONTENTTAIL)) {
    return {
      log: {
        count: 0
      },
      result: str
    };
  } // either insert the generated CSS in between placeholders or just return the
  // generated CSS


  var frontPart = "";
  var endPart = ""; // find out what to generate
  // eslint-disable-next-line prefer-const

  var _extractConfig = extractConfig(opts.configOverride ? opts.configOverride : str),
      extractedConfig = _extractConfig[0],
      rawContentAbove = _extractConfig[1],
      rawContentBelow = _extractConfig[2];

  if (typeof extractedConfig !== "string" || !extractedConfig.trim()) {
    return {
      log: {
        count: 0
      },
      result: ""
    };
  }

  if (opts.includeConfig || opts.includeHeadsAndTails) {
    // wrap with content heads:
    frontPart = CONTENTHEAD + " */\n";

    if (!opts.includeConfig) {
      frontPart = "/* " + frontPart;
    } // and with content tails:


    endPart = "\n/* " + CONTENTTAIL + " */";
  } // tackle config

  if (opts.includeConfig) {
    frontPart = "/* " + CONFIGHEAD + "\n" + extractedConfig.trim() + "\n" + CONFIGTAIL + "\n" + frontPart;
  } // maybe there was some content above?

  if (str.includes(CONFIGHEAD)) {

    if (stringLeftRight.left(str, str.indexOf(CONFIGHEAD)) != null) { // in normal cases, content should be between opening CSS comment +
      // CONFIGHEAD and CONFIGTAIL + closing CSS comment, we just have to mind
      // the whitespace

      var sliceUpTo = str.indexOf(CONFIGHEAD);

      if (str[stringLeftRight.left(str, sliceUpTo)] === "*" && str[stringLeftRight.left(str, stringLeftRight.left(str, sliceUpTo))] === "/") {
        sliceUpTo = stringLeftRight.left(str, stringLeftRight.left(str, sliceUpTo));
      }
      var putInFront = "/* ";

      if (str[stringLeftRight.right(str, sliceUpTo - 1)] === "/" && str[stringLeftRight.right(str, stringLeftRight.right(str, sliceUpTo - 1))] === "*" || frontPart.trim().startsWith("/*")) {
        putInFront = "";
      } //       console.log(`187 ASSEMBLING frontPart:\n
      // \n1. str.slice(0, sliceUpTo)="${str.slice(0, sliceUpTo)}"
      // \n2. putInFront="${putInFront}"
      // \n3. frontPart="${frontPart}"
      // `);


      frontPart = "" + str.slice(0, sliceUpTo) + putInFront + frontPart;
    }
  }

  if (str.includes(CONFIGTAIL) && stringLeftRight.right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)) { // extract content that follows CONFIGTAIL:

    var sliceFrom = str.indexOf(CONFIGTAIL) + CONFIGTAIL.length; // include closing comment:

    if (str[stringLeftRight.right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length))] === "/") {
      sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)) + 1;
    } // in clean code case, opening head of content follows so let's check for it


    if (str.slice(stringLeftRight.right(str, sliceFrom - 1)).startsWith(CONTENTHEAD)) {
      var contentHeadsStartAt = stringLeftRight.right(str, sliceFrom);
      sliceFrom = contentHeadsStartAt || 0 + CONTENTHEAD.length;

      if (str[stringLeftRight.right(str, sliceFrom - 1)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom - 1))] === "/") {
        sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom - 1)) + 1;
      } // if CONTENTTAIL exists, jump over all the content


      if (str.includes(CONTENTTAIL)) {
        sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length; // tackle any closing comment that follows:

        if (str[stringLeftRight.right(str, sliceFrom)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom))] === "/") {
          sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom)) + 1;
        }
      }
    } // now, check, does this ending chunk already include the content heads,
    // GENERATE-ATOMIC-CSS-CONTENT-STARTS,
    // because if so, there will be duplication and we need to remove them

    var slicedFrom = str.slice(sliceFrom);

    if (slicedFrom.length && slicedFrom.includes(CONTENTTAIL)) {
      sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

      if (str[stringLeftRight.right(str, sliceFrom)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom))] === "/") {
        sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom)) + 1;
      }
    } //     console.log(`292 ASSEMBLE endPart:
    // \n1. endPart = "${endPart}"
    // \n2. bool str[sliceFrom] && right(str, sliceFrom - 1) = ${str[sliceFrom] &&
    //       right(str, sliceFrom - 1)}
    // \n3. str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(slicedFrom) : "" = "${
    //       str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(slicedFrom) : ""
    //     }"
    // \n4. sliceFrom = ${sliceFrom}
    // \n5. str.slice(${slicedFrom}) = ${`\u001b[${31}m${str.slice(
    //       slicedFrom
    //     )}\u001b[${39}m`}
    // `);


    endPart = "" + endPart + (str[sliceFrom] && stringLeftRight.right(str, sliceFrom - 1) ? str.slice(sliceFrom) : "");
  }

  if (typeof rawContentAbove === "string") {
    frontPart = "" + rawContentAbove + frontPart;
  }

  if (typeof rawContentBelow === "string") { // precaution if rawContentBelow ends but not starts with CSS comment

    if (rawContentBelow.trim().endsWith("/*") && !rawContentBelow.trim().startsWith("*/")) { // but leave leading whitespace intact

      var frontPart2 = "";

      if (typeof rawContentBelow === "string" && rawContentBelow[0] && !rawContentBelow[0].trim()) {
        frontPart2 = rawContentBelow.slice(0, stringLeftRight.right(rawContentBelow, 0) || 0);
      }

      rawContentBelow = frontPart2 + "/* " + rawContentBelow.trim();
    }

    endPart = "" + endPart + rawContentBelow;
  }
  var finalRes = trimIfNeeded("" + frontPart + prepConfig(extractedConfig, opts.reportProgressFunc, opts.reportProgressFuncFrom, opts.reportProgressFuncTo, true, // opts.includeConfig || opts.includeHeadsAndTails
  generatedCount, opts.pad) + endPart, opts) + "\n";
  return {
    log: {
      count: generatedCount.count
    },
    result: finalRes
  };
}

exports.defaults = defaults;
exports.extractFromToSource = extractFromToSource;
exports.genAtomic = genAtomic;
exports.headsAndTails = headsAndTails;
exports.version = version$1;

/**
 * string-process-comma-separated
 * Extracts chunks from possibly comma or whatever-separated string
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-process-comma-separated
 */

'use strict';

function _typeof(obj) {
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

function processCommaSeparated(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error("string-process-comma-separated: [THROW_ID_01] input must be string! It was given as ".concat(_typeof(str), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
  } else if (!str.length || !originalOpts.cb && !originalOpts.errCb) {
    return;
  }
  var defaults = {
    from: 0,
    to: str.length,
    leadingWhitespaceOK: false,
    trailingWhitespaceOK: false,
    oneSpaceAfterCommaOK: false,
    separator: ",",
    cb: null,
    errCb: null
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (!Number.isInteger(originalOpts.from)) {
    opts.from = 0;
  }
  if (!Number.isInteger(originalOpts.to)) {
    opts.to = str.length;
  }
  var chunkStartsAt = null;
  var whitespaceStartsAt = null;
  var firstNonwhitespaceNonseparatorCharFound = false;
  var separatorsArr = [];
  for (var i = opts.from; i < opts.to; i++) {
    if (chunkStartsAt === null && str[i].trim().length && (!opts.separator || str[i] !== opts.separator)) {
      if (!firstNonwhitespaceNonseparatorCharFound) {
        firstNonwhitespaceNonseparatorCharFound = true;
      }
      if (separatorsArr.length) {
        if (separatorsArr.length > 1) {
          separatorsArr.forEach(function (separatorsIdx, orderNumber) {
            if (orderNumber) {
              opts.errCb([[separatorsIdx, separatorsIdx + 1]], "Remove separator.");
            }
          });
        }
        separatorsArr = [];
      }
      chunkStartsAt = i;
    }
    if (Number.isInteger(chunkStartsAt) && (i > chunkStartsAt && (!str[i].trim().length || opts.separator && str[i] === opts.separator) || i + 1 === opts.to)) {
      var chunk = str.slice(chunkStartsAt, i + 1 === opts.to && str[i] !== opts.separator ? i + 1 : i);
      if (typeof opts.cb === "function") {
        opts.cb(chunkStartsAt, i + 1 === opts.to && str[i] !== opts.separator ? i + 1 : i);
      }
      chunkStartsAt = null;
    }
    if (!str[i].trim().length && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
    }
    if (whitespaceStartsAt !== null && (str[i].trim().length || i + 1 === opts.to)) {
      if (!opts.leadingWhitespaceOK && whitespaceStartsAt === opts.from) {
        if (typeof opts.errCb === "function") {
          opts.errCb([[whitespaceStartsAt, i + 1 === opts.to ? i + 1 : i]], "Remove whitespace.");
        }
      } else if (!opts.trailingWhitespaceOK && i + 1 === opts.to && str[i] !== opts.separator) {
        if (typeof opts.errCb === "function") {
          opts.errCb([[whitespaceStartsAt, i + 1]], "Remove whitespace.");
        }
      } else if (!opts.oneSpaceAfterCommaOK || !(str[i].trim().length && i > opts.from + 1 && str[i - 1] === " " && str[i - 2] === ",")) {
        var startingIdx = whitespaceStartsAt;
        var endingIdx = i + 1 === opts.to && str[i] !== opts.separator ? i + 1 : i;
        var whatToAdd = "";
        if (opts.oneSpaceAfterCommaOK) {
          if (str[whitespaceStartsAt] === " " && str[whitespaceStartsAt - 1] === opts.separator) {
            startingIdx++;
          } else if (str[whitespaceStartsAt] !== " ") {
            whatToAdd = " ";
          }
        }
        if (whatToAdd.length) {
          opts.errCb([[startingIdx, endingIdx, whatToAdd]], "Remove whitespace.");
        } else {
          opts.errCb([[startingIdx, endingIdx]], "Remove whitespace.");
        }
      }
      whitespaceStartsAt = null;
    }
    if (str[i] === opts.separator) {
      if (!firstNonwhitespaceNonseparatorCharFound) {
        opts.errCb([[i, i + 1]], "Remove separator.");
      } else {
        separatorsArr.push(i);
      }
    }
    if (i + 1 === opts.to) {
      separatorsArr.forEach(function (separatorsIdx) {
        opts.errCb([[separatorsIdx, separatorsIdx + 1]], "Remove separator.");
      });
    }
  }
}

module.exports = processCommaSeparated;

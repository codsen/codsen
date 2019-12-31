/**
 * string-process-comma-separated
 * Extracts chunks from possibly comma or whatever-separated string
 * Version: 1.1.0
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
    offset: 0,
    leadingWhitespaceOK: false,
    trailingWhitespaceOK: false,
    oneSpaceAfterCommaOK: false,
    innerWhitespaceAllowed: false,
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
  if (!Number.isInteger(originalOpts.offset)) {
    opts.offset = 0;
  }
  var chunkStartsAt = null;
  var whitespaceStartsAt = null;
  var firstNonwhitespaceNonseparatorCharFound = false;
  var separatorsArr = [];
  var lastNonWhitespaceCharAt = null;
  for (var i = opts.from; i < opts.to; i++) {
    if (str[i].trim().length && str[i] !== opts.separator) {
      lastNonWhitespaceCharAt = i;
    }
    if (chunkStartsAt === null && str[i].trim().length && (!opts.separator || str[i] !== opts.separator)) {
      if (!firstNonwhitespaceNonseparatorCharFound) {
        firstNonwhitespaceNonseparatorCharFound = true;
      }
      if (separatorsArr.length) {
        if (separatorsArr.length > 1) {
          separatorsArr.forEach(function (separatorsIdx, orderNumber) {
            if (orderNumber) {
              opts.errCb([[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]], "Remove separator.");
            }
          });
        }
        separatorsArr = [];
      }
      chunkStartsAt = i;
    }
    if (Number.isInteger(chunkStartsAt) && (i > chunkStartsAt && opts.separator && str[i] === opts.separator || i + 1 === opts.to)) {
      var chunk = str.slice(chunkStartsAt, i + 1 === opts.to && str[i] !== opts.separator && str[i].trim().length ? i + 1 : i);
      if (typeof opts.cb === "function") {
        opts.cb(chunkStartsAt + opts.offset, (i + 1 === opts.to && str[i] !== opts.separator && str[i].trim().length ? i + 1 : lastNonWhitespaceCharAt + 1) + opts.offset);
      }
      chunkStartsAt = null;
    }
    if (!str[i].trim().length && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
    }
    if (whitespaceStartsAt !== null && (str[i].trim().length || i + 1 === opts.to)) {
      if (whitespaceStartsAt === opts.from) {
        if (!opts.leadingWhitespaceOK && typeof opts.errCb === "function") {
          opts.errCb([[whitespaceStartsAt + opts.offset, (i + 1 === opts.to ? i + 1 : i) + opts.offset]], "Remove whitespace.");
        }
      } else if (!str[i].trim().length && i + 1 === opts.to) {
        if (!opts.trailingWhitespaceOK && typeof opts.errCb === "function") {
          opts.errCb([[whitespaceStartsAt + opts.offset, i + 1 + opts.offset]], "Remove whitespace.");
        }
      } else if ((!opts.oneSpaceAfterCommaOK || !(str[i].trim().length && i > opts.from + 1 && str[i - 1] === " " && str[i - 2] === ",")) && (!opts.innerWhitespaceAllowed || !(firstNonwhitespaceNonseparatorCharFound && str[whitespaceStartsAt - 1] && str[i].trim().length && str[i] !== opts.separator && str[whitespaceStartsAt - 1] !== opts.separator))) {
        var startingIdx = whitespaceStartsAt;
        var endingIdx = i;
        if (i + 1 === opts.to && str[i] !== opts.separator && !str[i].trim().length) {
          endingIdx++;
        }
        var whatToAdd = "";
        if (opts.oneSpaceAfterCommaOK) {
          if (str[whitespaceStartsAt] === " " && str[whitespaceStartsAt - 1] === opts.separator) {
            startingIdx++;
          } else if (str[whitespaceStartsAt] !== " ") {
            whatToAdd = " ";
          }
        }
        var fixable = true;
        var message = "Remove whitespace.";
        if (!opts.innerWhitespaceAllowed && firstNonwhitespaceNonseparatorCharFound && str[whitespaceStartsAt - 1] && str[i].trim().length && str[i] !== opts.separator && str[whitespaceStartsAt - 1] !== opts.separator) {
          fixable = false;
          message = "Bad whitespace.";
        }
        if (whatToAdd.length) {
          opts.errCb([[startingIdx + opts.offset, endingIdx + opts.offset, whatToAdd]], message, fixable);
        } else {
          opts.errCb([[startingIdx + opts.offset, endingIdx + opts.offset]], message, fixable);
        }
      }
      whitespaceStartsAt = null;
    }
    if (str[i] === opts.separator) {
      if (!firstNonwhitespaceNonseparatorCharFound) {
        opts.errCb([[i + opts.offset, i + 1 + opts.offset]], "Remove separator.");
      } else {
        separatorsArr.push(i);
      }
    }
    if (i + 1 === opts.to) {
      separatorsArr.forEach(function (separatorsIdx) {
        opts.errCb([[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]], "Remove separator.");
      });
    }
  }
}

module.exports = processCommaSeparated;

/**
 * string-process-comma-separated
 * Extracts chunks from possibly comma or whatever-separated string
 * Version: 1.3.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-process-comma-separated/
 */

'use strict';

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
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
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
  var fixable = true;
  for (var i = opts.from; i < opts.to; i++) {
    if (str[i].trim() && str[i] !== opts.separator) {
      lastNonWhitespaceCharAt = i;
    }
    if (chunkStartsAt === null && str[i].trim() && (!opts.separator || str[i] !== opts.separator)) {
      if (!firstNonwhitespaceNonseparatorCharFound) {
        firstNonwhitespaceNonseparatorCharFound = true;
      }
      if (separatorsArr.length) {
        if (separatorsArr.length > 1) {
          separatorsArr.forEach(function (separatorsIdx, orderNumber) {
            if (orderNumber) {
              opts.errCb([[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]], "Remove separator.", fixable);
            }
          });
        }
        separatorsArr = [];
      }
      chunkStartsAt = i;
    }
    if (Number.isInteger(chunkStartsAt) && (i > chunkStartsAt && opts.separator && str[i] === opts.separator || i + 1 === opts.to)) {
      var chunk = str.slice(chunkStartsAt, i + 1 === opts.to && str[i] !== opts.separator && str[i].trim() ? i + 1 : i);
      if (typeof opts.cb === "function") {
        opts.cb(chunkStartsAt + opts.offset, (i + 1 === opts.to && str[i] !== opts.separator && str[i].trim() ? i + 1 : lastNonWhitespaceCharAt + 1) + opts.offset);
      }
      chunkStartsAt = null;
    }
    if (!str[i].trim() && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
    }
    if (whitespaceStartsAt !== null && (str[i].trim() || i + 1 === opts.to)) {
      if (whitespaceStartsAt === opts.from) {
        if (!opts.leadingWhitespaceOK && typeof opts.errCb === "function") {
          opts.errCb([[whitespaceStartsAt + opts.offset, (i + 1 === opts.to ? i + 1 : i) + opts.offset]], "Remove whitespace.", fixable);
        }
      } else if (!str[i].trim() && i + 1 === opts.to) {
        if (!opts.trailingWhitespaceOK && typeof opts.errCb === "function") {
          opts.errCb([[whitespaceStartsAt + opts.offset, i + 1 + opts.offset]], "Remove whitespace.", fixable);
        }
      } else if ((!opts.oneSpaceAfterCommaOK || !(str[i].trim() && i > opts.from + 1 && str[i - 1] === " " && str[i - 2] === ",")) && (!opts.innerWhitespaceAllowed || !(firstNonwhitespaceNonseparatorCharFound && str[whitespaceStartsAt - 1] && str[i].trim() && str[i] !== opts.separator && str[whitespaceStartsAt - 1] !== opts.separator))) {
        var startingIdx = whitespaceStartsAt;
        var endingIdx = i;
        if (i + 1 === opts.to && str[i] !== opts.separator && !str[i].trim()) {
          endingIdx += 1;
        }
        var whatToAdd = "";
        if (opts.oneSpaceAfterCommaOK) {
          if (str[whitespaceStartsAt] === " " && str[whitespaceStartsAt - 1] === opts.separator) {
            startingIdx += 1;
          } else if (str[whitespaceStartsAt] !== " ") {
            whatToAdd = " ";
          }
        }
        var message = "Remove whitespace.";
        if (!opts.innerWhitespaceAllowed && firstNonwhitespaceNonseparatorCharFound && str[whitespaceStartsAt - 1] && str[i].trim() && str[i] !== opts.separator && str[whitespaceStartsAt - 1] !== opts.separator) {
          fixable = false;
          message = "Bad whitespace.";
        }
        if (whatToAdd.length) {
          opts.errCb([[startingIdx + opts.offset, endingIdx + opts.offset, whatToAdd]], message, fixable);
        } else {
          opts.errCb([[startingIdx + opts.offset, endingIdx + opts.offset]], message, fixable);
        }
        fixable = true;
      }
      whitespaceStartsAt = null;
    }
    if (str[i] === opts.separator) {
      if (!firstNonwhitespaceNonseparatorCharFound) {
        opts.errCb([[i + opts.offset, i + 1 + opts.offset]], "Remove separator.", fixable);
      } else {
        separatorsArr.push(i);
      }
    }
    if (i + 1 === opts.to) {
      separatorsArr.forEach(function (separatorsIdx) {
        opts.errCb([[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]], "Remove separator.", fixable);
      });
    }
  }
}

module.exports = processCommaSeparated;

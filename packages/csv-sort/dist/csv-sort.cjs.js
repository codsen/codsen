/**
 * csv-sort
 * Sorts double-entry bookkeeping CSV coming from internet banking
 * Version: 5.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/csv-sort/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pull = require('lodash.pull');
var csvSplitEasy = require('csv-split-easy');
var currency = require('currency.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var pull__default = /*#__PURE__*/_interopDefaultLegacy(pull);
var currency__default = /*#__PURE__*/_interopDefaultLegacy(currency);

function isNumeric(str) {
  if (!str.trim()) {
    return false;
  }
  return Number(str) === Number(str);
}
var currencySigns = ["د.إ", "؋", "L", "֏", "ƒ", "Kz", "$", "ƒ", "₼", "KM", "৳", "лв", ".د.ب", "FBu", "$b", "R$", "฿", "Nu.", "P", "p.", "BZ$", "FC", "CHF", "¥", "₡", "₱", "Kč", "Fdj", "kr", "RD$", "دج", "kr", "Nfk", "Br", "Ξ", "€", "₾", "₵", "GH₵", "D", "FG", "Q", "L", "kn", "G", "Ft", "Rp", "₪", "₹", "ع.د", "﷼", "kr", "J$", "JD", "¥", "KSh", "лв", "៛", "CF", "₩", "₩", "KD", "лв", "₭", "₨", "M", "Ł", "Lt", "Ls", "LD", "MAD", "lei", "Ar", "ден", "K", "₮", "MOP$", "UM", "₨", "Rf", "MK", "RM", "MT", "₦", "C$", "kr", "₨", "﷼", "B/.", "S/.", "K", "₱", "₨", "zł", "Gs", "﷼", "￥", "lei", "Дин.", "₽", "R₣", "﷼", "₨", "ج.س.", "kr", "£", "Le", "S", "Db", "E", "฿", "SM", "T", "د.ت", "T$", "₤", "₺", "TT$", "NT$", "TSh", "₴", "USh", "$U", "лв", "Bs", "₫", "VT", "WS$", "FCFA", "Ƀ", "CFA", "₣", "﷼", "R", "Z$"];
function findType(something) {
  /* istanbul ignore next */
  if (typeof something !== "string") {
    throw new Error("csv-sort/util/findType(): input must be string! Currently it's: " + typeof something);
  }
  if (isNumeric(something)) {
    return "numeric";
  }
  /* istanbul ignore next */
  if (currencySigns.some(function (singleSign) {
    return (
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

function sort(input) {
  var msgContent = null;
  var msgType = null;
  if (typeof input !== "string") {
    throw new TypeError("csv-sort/csvSort(): [THROW_ID_01] The input is of a wrong type! We accept either string of array of arrays. We got instead: " + typeof input + ", equal to:\n" + JSON.stringify(input, null, 4));
  } else if (!input.trim()) {
    return {
      res: [[""]],
      msgContent: msgContent,
      msgType: msgType
    };
  }
  var content = csvSplitEasy.splitEasy(input);
  var schema = [];
  var stateHeaderRowPresent = false;
  var stateDataColumnRowLengthIsConsistent = true;
  var stateColumnsContainingSameValueEverywhere = [];
  var indexAtWhichEmptyCellsStart = null;
  for (var i = content.length - 1; i >= 0; i--) {
    if (!schema.length) {
      /* istanbul ignore next */
      if (content[i].length !== 1 || content[i][0] !== "") {
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
        stateHeaderRowPresent = content[i].every(function (el) {
          return findType(el) === "text" || findType(el) === "empty";
        });
      }
      /* istanbul ignore else */
      if (!stateHeaderRowPresent && schema.length !== content[i].length) {
        stateDataColumnRowLengthIsConsistent = false;
      }
      var perRowIndexAtWhichEmptyCellsStart = null;
      for (var _y = 0, _len = content[i].length; _y < _len; _y++) {
        /* istanbul ignore else */
        if (perRowIndexAtWhichEmptyCellsStart === null && findType(content[i][_y].trim()) === "empty") {
          perRowIndexAtWhichEmptyCellsStart = _y;
        }
        /* istanbul ignore else */
        if (perRowIndexAtWhichEmptyCellsStart !== null && findType(content[i][_y].trim()) !== "empty") {
          perRowIndexAtWhichEmptyCellsStart = null;
        }
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
      }
      /* istanbul ignore next */
      if (indexAtWhichEmptyCellsStart !== null && perRowIndexAtWhichEmptyCellsStart !== null && perRowIndexAtWhichEmptyCellsStart > indexAtWhichEmptyCellsStart && (!stateHeaderRowPresent || stateHeaderRowPresent && i !== 0)) {
        indexAtWhichEmptyCellsStart = perRowIndexAtWhichEmptyCellsStart;
      }
    }
  }
  /* istanbul ignore else */
  if (!indexAtWhichEmptyCellsStart) {
    indexAtWhichEmptyCellsStart = schema.length;
  }
  var nonEmptyColsStartAt = 0;
  for (var _i = 0, _len2 = schema.length; _i < _len2; _i++) {
    if (schema[_i] === "empty") {
      nonEmptyColsStartAt = _i;
    } else {
      break;
    }
  }
  /* istanbul ignore else */
  if (nonEmptyColsStartAt !== 0) {
    content = content.map(function (arr) {
      return arr.slice(nonEmptyColsStartAt + 1, indexAtWhichEmptyCellsStart);
    });
    schema = schema.slice(nonEmptyColsStartAt + 1, indexAtWhichEmptyCellsStart);
  }
  var numericSchemaColumns = [];
  var balanceColumnIndex;
  schema.forEach(function (colType, i) {
    if (colType === "numeric") {
      numericSchemaColumns.push(i);
    }
  });
  var traverseUpToThisIndexAtTheTop = stateHeaderRowPresent ? 1 : 0;
  if (numericSchemaColumns.length === 1) {
    balanceColumnIndex = numericSchemaColumns[0];
  } else if (numericSchemaColumns.length === 0) {
    throw new Error('csv-sort/csvSort(): [THROW_ID_03] Your CSV file does not contain numeric-only columns and computer was not able to detect the "Balance" column!');
  } else {
    var potentialBalanceColumnIndexesList = Array.from(numericSchemaColumns);
    var deleteFromPotentialBalanceColumnIndexesList = [];
    for (var _i2 = 0, _len3 = potentialBalanceColumnIndexesList.length; _i2 < _len3; _i2++) {
      var suspectedBalanceColumnsIndexNumber = potentialBalanceColumnIndexesList[_i2];
      var previousValue = void 0;
      var lookForTwoEqualAndConsecutive = true;
      var firstValue = void 0;
      var lookForAllTheSame = true;
      for (var rowNum = traverseUpToThisIndexAtTheTop, len2 = content.length; rowNum < len2; rowNum++) {
        /* istanbul ignore else */
        if (lookForTwoEqualAndConsecutive) {
          if (previousValue == null) {
            previousValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
          } else if (previousValue === content[rowNum][suspectedBalanceColumnsIndexNumber]) {
            deleteFromPotentialBalanceColumnIndexesList.push(suspectedBalanceColumnsIndexNumber);
            lookForTwoEqualAndConsecutive = false;
          } else {
            previousValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
          }
        }
        /* istanbul ignore else */
        if (lookForAllTheSame) {
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
    }
    potentialBalanceColumnIndexesList = pull__default['default'].apply(void 0, [potentialBalanceColumnIndexesList].concat(deleteFromPotentialBalanceColumnIndexesList));
    /* istanbul ignore else */
    if (potentialBalanceColumnIndexesList.length === 1) {
      balanceColumnIndex = potentialBalanceColumnIndexesList[0];
    } else if (potentialBalanceColumnIndexesList.length === 0) {
      throw new Error('csv-sort/csvSort(): [THROW_ID_04] The computer can\'t find the "Balance" column! It saw some numeric-only columns, but they all seem to have certain rows with the same values as rows right below/above them!');
    } else ;
  }
  if (!balanceColumnIndex) {
    throw new Error("csv-sort/csvSort(): [THROW_ID_05] Sadly computer couldn't find its way in this CSV and had to stop working on it.");
  }
  var potentialCreditDebitColumns = pull__default['default'].apply(void 0, [Array.from(schema.reduce(function (result, el, index) {
    if (typeof el === "string" && el === "numeric" || Array.isArray(el) && el.includes("numeric")) {
      result.push(index);
    }
    return result;
  }, [])), balanceColumnIndex].concat(stateColumnsContainingSameValueEverywhere));
  var resContent = [];
  resContent.push(content[content.length - 1].slice(0, indexAtWhichEmptyCellsStart));
  var usedUpRows = [];
  var bottom = stateHeaderRowPresent ? 1 : 0;
  for (var _y2 = content.length - 2; _y2 >= bottom; _y2--) {
    for (var suspectedRowsIndex = content.length - 2; suspectedRowsIndex >= bottom; suspectedRowsIndex--) {
      if (!usedUpRows.includes(suspectedRowsIndex)) {
        var thisRowIsDone = false;
        for (var suspectedColIndex = 0, _len4 = potentialCreditDebitColumns.length; suspectedColIndex < _len4; suspectedColIndex++) {
          var diffVal = null;
          if (content[suspectedRowsIndex][potentialCreditDebitColumns[suspectedColIndex]] !== "") {
            diffVal = currency__default['default'](content[suspectedRowsIndex][potentialCreditDebitColumns[suspectedColIndex]]);
          }
          var totalVal = null;
          /* istanbul ignore else */
          if (content[suspectedRowsIndex][balanceColumnIndex] !== "") {
            totalVal = currency__default['default'](content[suspectedRowsIndex][balanceColumnIndex]);
          }
          var topmostResContentBalance = null;
          /* istanbul ignore else */
          if (resContent[0][balanceColumnIndex] !== "") {
            topmostResContentBalance = currency__default['default'](resContent[0][balanceColumnIndex]).format();
          }
          var currentRowsDiffVal = null;
          /* istanbul ignore else */
          if (resContent[resContent.length - 1][potentialCreditDebitColumns[suspectedColIndex]] !== "") {
            currentRowsDiffVal = currency__default['default'](resContent[resContent.length - 1][potentialCreditDebitColumns[suspectedColIndex]]).format();
          }
          var lastResContentRowsBalance = null;
          /* istanbul ignore else */
          if (resContent[resContent.length - 1][balanceColumnIndex] !== "") {
            lastResContentRowsBalance = currency__default['default'](resContent[resContent.length - 1][balanceColumnIndex]);
          }
          /* istanbul ignore else */
          if (diffVal && totalVal.add(diffVal).format() === topmostResContentBalance) {
            resContent.unshift(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
            usedUpRows.push(suspectedRowsIndex);
            thisRowIsDone = true;
            break;
          } else if (diffVal && totalVal.subtract(diffVal).format() === topmostResContentBalance) {
            resContent.unshift(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
            usedUpRows.push(suspectedRowsIndex);
            thisRowIsDone = true;
            break;
          } else if (currentRowsDiffVal && lastResContentRowsBalance.add(currentRowsDiffVal).format() === totalVal.format()) {
            resContent.push(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
            usedUpRows.push(suspectedRowsIndex);
            thisRowIsDone = true;
            break;
          } else if (currentRowsDiffVal && lastResContentRowsBalance.subtract(currentRowsDiffVal).format() === totalVal.format()) {
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
  }
  /* istanbul ignore else */
  if (stateHeaderRowPresent) {
    if (stateDataColumnRowLengthIsConsistent && content[0].length > schema.length) {
      content[0].length = schema.length;
    }
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

exports.sort = sort;

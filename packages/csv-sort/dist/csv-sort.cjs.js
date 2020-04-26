/**
 * csv-sort
 * Sorts double-entry bookkeeping CSV coming from internet banking
 * Version: 3.0.56
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var split = _interopDefault(require('csv-split-easy'));
var pull = _interopDefault(require('lodash.pull'));
var currency = _interopDefault(require('currency.js'));
var isNumeric = _interopDefault(require('is-numeric'));

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

function existy(x) {
  return x != null;
}
var currencySigns = ["د.إ", "؋", "L", "֏", "ƒ", "Kz", "$", "ƒ", "₼", "KM", "৳", "лв", ".د.ب", "FBu", "$b", "R$", "฿", "Nu.", "P", "p.", "BZ$", "FC", "CHF", "¥", "₡", "₱", "Kč", "Fdj", "kr", "RD$", "دج", "kr", "Nfk", "Br", "Ξ", "€", "₾", "₵", "GH₵", "D", "FG", "Q", "L", "kn", "G", "Ft", "Rp", "₪", "₹", "ع.د", "﷼", "kr", "J$", "JD", "¥", "KSh", "лв", "៛", "CF", "₩", "₩", "KD", "лв", "₭", "₨", "M", "Ł", "Lt", "Ls", "LD", "MAD", "lei", "Ar", "ден", "K", "₮", "MOP$", "UM", "₨", "Rf", "MK", "RM", "MT", "₦", "C$", "kr", "₨", "﷼", "B/.", "S/.", "K", "₱", "₨", "zł", "Gs", "﷼", "￥", "lei", "Дин.", "₽", "R₣", "﷼", "₨", "ج.س.", "kr", "£", "Le", "S", "Db", "E", "฿", "SM", "T", "د.ت", "T$", "₤", "₺", "TT$", "NT$", "TSh", "₴", "USh", "$U", "лв", "Bs", "₫", "VT", "WS$", "FCFA", "Ƀ", "CFA", "₣", "﷼", "R", "Z$"];
function findtype(something) {
  if (typeof something !== "string") {
    throw new Error("csv-sort/util/findtype(): input must be string! Currently it's: ".concat(_typeof(something)));
  }
  if (isNumeric(something)) {
    return "numeric";
  }
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
function csvSort(input) {
  var content;
  var msgContent = null;
  var msgType = null;
  if (typeof input === "string") {
    if (input.length === 0) {
      return [[""]];
    }
    content = split(input);
  } else if (Array.isArray(input)) {
    var culpritVal;
    var culpritIndex;
    if (!input.every(function (val, index) {
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
  }
  var schema = null;
  var stateHeaderRowPresent = false;
  var stateDataColumnRowLengthIsConsistent = true;
  var stateColumnsContainingSameValueEverywhere = [];
  var indexAtWhichEmptyCellsStart = null;
  for (var i = content.length - 1; i >= 0; i--) {
    if (!schema) {
      if (content[i].length !== 1 || content[i][0] !== "") {
        schema = [];
        for (var y = 0, len = content[i].length; y < len; y++) {
          schema.push(findtype(content[i][y].trim()));
          if (indexAtWhichEmptyCellsStart === null && findtype(content[i][y].trim()) === "empty") {
            indexAtWhichEmptyCellsStart = y;
          }
          if (indexAtWhichEmptyCellsStart !== null && findtype(content[i][y].trim()) !== "empty") {
            indexAtWhichEmptyCellsStart = null;
          }
        }
      }
    } else {
      if (i === 0) {
        stateHeaderRowPresent = content[i].every(function (el) {
          return findtype(el) === "text" || findtype(el) === "empty";
        });
      }
      if (!stateHeaderRowPresent && schema.length !== content[i].length) {
        stateDataColumnRowLengthIsConsistent = false;
      }
      var perRowIndexAtWhichEmptyCellsStart = null;
      for (var _y = 0, _len = content[i].length; _y < _len; _y++) {
        if (perRowIndexAtWhichEmptyCellsStart === null && findtype(content[i][_y].trim()) === "empty") {
          perRowIndexAtWhichEmptyCellsStart = _y;
        }
        if (perRowIndexAtWhichEmptyCellsStart !== null && findtype(content[i][_y].trim()) !== "empty") {
          perRowIndexAtWhichEmptyCellsStart = null;
        }
        if (findtype(content[i][_y].trim()) !== schema[_y] && !stateHeaderRowPresent) {
          var toAdd = findtype(content[i][_y].trim());
          if (Array.isArray(schema[_y])) {
            if (!schema[_y].includes(toAdd)) {
              schema[_y].push(findtype(content[i][_y].trim()));
            }
          } else if (schema[_y] !== toAdd) {
            var temp = schema[_y];
            schema[_y] = [];
            schema[_y].push(temp);
            schema[_y].push(toAdd);
          }
        }
      }
      if (indexAtWhichEmptyCellsStart !== null && perRowIndexAtWhichEmptyCellsStart !== null && perRowIndexAtWhichEmptyCellsStart > indexAtWhichEmptyCellsStart && (!stateHeaderRowPresent || stateHeaderRowPresent && i !== 0)) {
        indexAtWhichEmptyCellsStart = perRowIndexAtWhichEmptyCellsStart;
      }
    }
  }
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
        if (lookForTwoEqualAndConsecutive) {
          if (!existy(previousValue)) {
            previousValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
          } else if (previousValue === content[rowNum][suspectedBalanceColumnsIndexNumber]) {
            deleteFromPotentialBalanceColumnIndexesList.push(suspectedBalanceColumnsIndexNumber);
            lookForTwoEqualAndConsecutive = false;
          } else {
            previousValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
          }
        }
        if (lookForAllTheSame) {
          if (!existy(firstValue)) {
            firstValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
          } else if (content[rowNum][suspectedBalanceColumnsIndexNumber] !== firstValue) {
            lookForAllTheSame = false;
          }
        }
        if (!lookForTwoEqualAndConsecutive) {
          break;
        }
      }
      if (lookForAllTheSame) {
        stateColumnsContainingSameValueEverywhere.push(suspectedBalanceColumnsIndexNumber);
      }
    }
    potentialBalanceColumnIndexesList = pull.apply(void 0, [potentialBalanceColumnIndexesList].concat(deleteFromPotentialBalanceColumnIndexesList));
    if (potentialBalanceColumnIndexesList.length === 1) {
      balanceColumnIndex = potentialBalanceColumnIndexesList[0];
    } else if (potentialBalanceColumnIndexesList.length === 0) {
      throw new Error('csv-sort/csvSort(): [THROW_ID_04] The computer can\'t find the "Balance" column! It saw some numeric-only columns, but they all seem to have certain rows with the same values as rows right below/above them!');
    }
  }
  if (!balanceColumnIndex) {
    throw new Error("csv-sort/csvSort(): [THROW_ID_05] Sadly computer couldn't find its way in this CSV and had to stop working on it.");
  }
  var potentialCreditDebitColumns = pull.apply(void 0, [Array.from(schema.reduce(function (result, el, index) {
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
            diffVal = currency(content[suspectedRowsIndex][potentialCreditDebitColumns[suspectedColIndex]]);
          }
          var totalVal = null;
          if (content[suspectedRowsIndex][balanceColumnIndex] !== "") {
            totalVal = currency(content[suspectedRowsIndex][balanceColumnIndex]);
          }
          var topmostResContentBalance = null;
          if (resContent[0][balanceColumnIndex] !== "") {
            topmostResContentBalance = currency(resContent[0][balanceColumnIndex]).format();
          }
          var currentRowsDiffVal = null;
          if (resContent[resContent.length - 1][potentialCreditDebitColumns[suspectedColIndex]] !== "") {
            currentRowsDiffVal = currency(resContent[resContent.length - 1][potentialCreditDebitColumns[suspectedColIndex]]).format();
          }
          var lastResContentRowsBalance = null;
          if (resContent[resContent.length - 1][balanceColumnIndex] !== "") {
            lastResContentRowsBalance = currency(resContent[resContent.length - 1][balanceColumnIndex]);
          }
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
        if (thisRowIsDone) {
          thisRowIsDone = false;
          break;
        }
      }
    }
  }
  if (stateHeaderRowPresent) {
    if (stateDataColumnRowLengthIsConsistent && content[0].length > schema.length) {
      content[0].length = schema.length;
    }
    resContent.unshift(content[0].slice(0, indexAtWhichEmptyCellsStart));
  }
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

module.exports = csvSort;

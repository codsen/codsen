/**
 * csv-sort
 * Sorts double-entry bookkeeping CSV coming from internet banking
 * Version: 5.0.2
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
  // if (typeof str === "number") {
  //   return true;
  // }
  // if (!String(str).trim()) {
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

/**
 * Sorts double-entry bookkeeping CSV coming from internet banking
 */

function sort(input) {
  var msgContent = null;
  var msgType = null; // step 1.
  // ===========================
  // depends what was passed in,

  if (typeof input !== "string") {
    throw new TypeError("csv-sort/csvSort(): [THROW_ID_01] The input is of a wrong type! We accept either string of array of arrays. We got instead: " + typeof input + ", equal to:\n" + JSON.stringify(input, null, 4));
  } else if (!input.trim()) {
    return {
      res: [[""]],
      msgContent: msgContent,
      msgType: msgType
    };
  }

  var content = csvSplitEasy.splitEasy(input); // step 2.
  // ===========================
  // - iterate from the bottom
  // - calculate schema as you go to save calculation rounds
  // - first row can have different amount of columns
  // - think about 2D trim feature

  var schema = [];
  var stateHeaderRowPresent = false;
  var stateDataColumnRowLengthIsConsistent = true;
  var stateColumnsContainingSameValueEverywhere = []; // used for 2D trimming:

  var indexAtWhichEmptyCellsStart = null;

  for (var i = content.length - 1; i >= 0; i--) {

    if (!schema.length) {
      // prevention against last blank row:

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


    potentialBalanceColumnIndexesList = pull__default['default'].apply(void 0, [potentialBalanceColumnIndexesList].concat(deleteFromPotentialBalanceColumnIndexesList));
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


  var potentialCreditDebitColumns = pull__default['default'].apply(void 0, [Array.from(schema.reduce(function (result, el, index) {
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

          if (diffVal && totalVal.add(diffVal).format() === topmostResContentBalance) { // ADD THIS ROW ABOVE EVERYTHING
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

exports.sort = sort;

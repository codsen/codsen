/**
 * csv-sort
 * Sorts double-entry bookkeeping CSV coming from internet banking
 * Version: 3.0.60
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort
 */

import split from 'csv-split-easy';
import pull from 'lodash.pull';
import currency from 'currency.js';
import isNumeric from 'is-numeric';

function existy(x) {
  return x != null;
}
const currencySigns = [
  "د.إ",
  "؋",
  "L",
  "֏",
  "ƒ",
  "Kz",
  "$",
  "ƒ",
  "₼",
  "KM",
  "৳",
  "лв",
  ".د.ب",
  "FBu",
  "$b",
  "R$",
  "฿",
  "Nu.",
  "P",
  "p.",
  "BZ$",
  "FC",
  "CHF",
  "¥",
  "₡",
  "₱",
  "Kč",
  "Fdj",
  "kr",
  "RD$",
  "دج",
  "kr",
  "Nfk",
  "Br",
  "Ξ",
  "€",
  "₾",
  "₵",
  "GH₵",
  "D",
  "FG",
  "Q",
  "L",
  "kn",
  "G",
  "Ft",
  "Rp",
  "₪",
  "₹",
  "ع.د",
  "﷼",
  "kr",
  "J$",
  "JD",
  "¥",
  "KSh",
  "лв",
  "៛",
  "CF",
  "₩",
  "₩",
  "KD",
  "лв",
  "₭",
  "₨",
  "M",
  "Ł",
  "Lt",
  "Ls",
  "LD",
  "MAD",
  "lei",
  "Ar",
  "ден",
  "K",
  "₮",
  "MOP$",
  "UM",
  "₨",
  "Rf",
  "MK",
  "RM",
  "MT",
  "₦",
  "C$",
  "kr",
  "₨",
  "﷼",
  "B/.",
  "S/.",
  "K",
  "₱",
  "₨",
  "zł",
  "Gs",
  "﷼",
  "￥",
  "lei",
  "Дин.",
  "₽",
  "R₣",
  "﷼",
  "₨",
  "ج.س.",
  "kr",
  "£",
  "Le",
  "S",
  "Db",
  "E",
  "฿",
  "SM",
  "T",
  "د.ت",
  "T$",
  "₤",
  "₺",
  "TT$",
  "NT$",
  "TSh",
  "₴",
  "USh",
  "$U",
  "лв",
  "Bs",
  "₫",
  "VT",
  "WS$",
  "FCFA",
  "Ƀ",
  "CFA",
  "₣",
  "﷼",
  "R",
  "Z$",
];
function findtype(something) {
  if (typeof something !== "string") {
    throw new Error(
      `csv-sort/util/findtype(): input must be string! Currently it's: ${typeof something}`
    );
  }
  if (isNumeric(something)) {
    return "numeric";
  }
  if (
    currencySigns.some((singleSign) =>
      isNumeric(something.replace(singleSign, "").replace(/[,.]/g, ""))
    )
  ) {
    return "numeric";
  }
  if (!something.trim()) {
    return "empty";
  }
  return "text";
}
function csvSort(input) {
  let content;
  let msgContent = null;
  let msgType = null;
  if (typeof input === "string") {
    if (input.length === 0) {
      return [[""]];
    }
    content = split(input);
  } else if (Array.isArray(input)) {
    let culpritVal;
    let culpritIndex;
    if (
      !input.every((val, index) => {
        if (!Array.isArray(val)) {
          culpritVal = val;
          culpritIndex = index;
        }
        return Array.isArray(val);
      })
    ) {
      throw new TypeError(
        `csv-sort/csvSort(): [THROW_ID_01] the input is array as expected, but not all of its children are arrays! For example, the element at index ${culpritIndex} is not array but: ${typeof culpritVal}, equal to:\n${JSON.stringify(
          culpritVal,
          null,
          4
        )}`
      );
    }
  } else {
    throw new TypeError(
      `csv-sort/csvSort(): [THROW_ID_02] The input is of a wrong type! We accept either string of array of arrays. We got instead: ${typeof input}, equal to:\n${JSON.stringify(
        input,
        null,
        4
      )}`
    );
  }
  let schema = null;
  let stateHeaderRowPresent = false;
  let stateDataColumnRowLengthIsConsistent = true;
  const stateColumnsContainingSameValueEverywhere = [];
  let indexAtWhichEmptyCellsStart = null;
  for (let i = content.length - 1; i >= 0; i--) {
    if (!schema) {
      if (content[i].length !== 1 || content[i][0] !== "") {
        schema = [];
        for (let y = 0, len = content[i].length; y < len; y++) {
          schema.push(findtype(content[i][y].trim()));
          if (
            indexAtWhichEmptyCellsStart === null &&
            findtype(content[i][y].trim()) === "empty"
          ) {
            indexAtWhichEmptyCellsStart = y;
          }
          if (
            indexAtWhichEmptyCellsStart !== null &&
            findtype(content[i][y].trim()) !== "empty"
          ) {
            indexAtWhichEmptyCellsStart = null;
          }
        }
      }
    } else {
      if (i === 0) {
        stateHeaderRowPresent = content[i].every(
          (el) => findtype(el) === "text" || findtype(el) === "empty"
        );
      }
      if (!stateHeaderRowPresent && schema.length !== content[i].length) {
        stateDataColumnRowLengthIsConsistent = false;
      }
      let perRowIndexAtWhichEmptyCellsStart = null;
      for (let y = 0, len = content[i].length; y < len; y++) {
        if (
          perRowIndexAtWhichEmptyCellsStart === null &&
          findtype(content[i][y].trim()) === "empty"
        ) {
          perRowIndexAtWhichEmptyCellsStart = y;
        }
        if (
          perRowIndexAtWhichEmptyCellsStart !== null &&
          findtype(content[i][y].trim()) !== "empty"
        ) {
          perRowIndexAtWhichEmptyCellsStart = null;
        }
        if (
          findtype(content[i][y].trim()) !== schema[y] &&
          !stateHeaderRowPresent
        ) {
          const toAdd = findtype(content[i][y].trim());
          if (Array.isArray(schema[y])) {
            if (!schema[y].includes(toAdd)) {
              schema[y].push(findtype(content[i][y].trim()));
            }
          } else if (schema[y] !== toAdd) {
            const temp = schema[y];
            schema[y] = [];
            schema[y].push(temp);
            schema[y].push(toAdd);
          }
        }
      }
      if (
        indexAtWhichEmptyCellsStart !== null &&
        perRowIndexAtWhichEmptyCellsStart !== null &&
        perRowIndexAtWhichEmptyCellsStart > indexAtWhichEmptyCellsStart &&
        (!stateHeaderRowPresent || (stateHeaderRowPresent && i !== 0))
      ) {
        indexAtWhichEmptyCellsStart = perRowIndexAtWhichEmptyCellsStart;
      }
    }
  }
  if (!indexAtWhichEmptyCellsStart) {
    indexAtWhichEmptyCellsStart = schema.length;
  }
  let nonEmptyColsStartAt = 0;
  for (let i = 0, len = schema.length; i < len; i++) {
    if (schema[i] === "empty") {
      nonEmptyColsStartAt = i;
    } else {
      break;
    }
  }
  if (nonEmptyColsStartAt !== 0) {
    content = content.map((arr) =>
      arr.slice(nonEmptyColsStartAt + 1, indexAtWhichEmptyCellsStart)
    );
    schema = schema.slice(nonEmptyColsStartAt + 1, indexAtWhichEmptyCellsStart);
  }
  const numericSchemaColumns = [];
  let balanceColumnIndex;
  schema.forEach((colType, i) => {
    if (colType === "numeric") {
      numericSchemaColumns.push(i);
    }
  });
  const traverseUpToThisIndexAtTheTop = stateHeaderRowPresent ? 1 : 0;
  if (numericSchemaColumns.length === 1) {
    balanceColumnIndex = numericSchemaColumns[0];
  } else if (numericSchemaColumns.length === 0) {
    throw new Error(
      'csv-sort/csvSort(): [THROW_ID_03] Your CSV file does not contain numeric-only columns and computer was not able to detect the "Balance" column!'
    );
  } else {
    let potentialBalanceColumnIndexesList = Array.from(numericSchemaColumns);
    const deleteFromPotentialBalanceColumnIndexesList = [];
    for (
      let i = 0, len = potentialBalanceColumnIndexesList.length;
      i < len;
      i++
    ) {
      const suspectedBalanceColumnsIndexNumber =
        potentialBalanceColumnIndexesList[i];
      let previousValue;
      let lookForTwoEqualAndConsecutive = true;
      let firstValue;
      let lookForAllTheSame = true;
      for (
        let rowNum = traverseUpToThisIndexAtTheTop, len2 = content.length;
        rowNum < len2;
        rowNum++
      ) {
        if (lookForTwoEqualAndConsecutive) {
          if (!existy(previousValue)) {
            previousValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
          } else if (
            previousValue ===
            content[rowNum][suspectedBalanceColumnsIndexNumber]
          ) {
            deleteFromPotentialBalanceColumnIndexesList.push(
              suspectedBalanceColumnsIndexNumber
            );
            lookForTwoEqualAndConsecutive = false;
          } else {
            previousValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
          }
        }
        if (lookForAllTheSame) {
          if (!existy(firstValue)) {
            firstValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
          } else if (
            content[rowNum][suspectedBalanceColumnsIndexNumber] !== firstValue
          ) {
            lookForAllTheSame = false;
          }
        }
        if (!lookForTwoEqualAndConsecutive) {
          break;
        }
      }
      if (lookForAllTheSame) {
        stateColumnsContainingSameValueEverywhere.push(
          suspectedBalanceColumnsIndexNumber
        );
      }
    }
    potentialBalanceColumnIndexesList = pull(
      potentialBalanceColumnIndexesList,
      ...deleteFromPotentialBalanceColumnIndexesList
    );
    if (potentialBalanceColumnIndexesList.length === 1) {
      balanceColumnIndex = potentialBalanceColumnIndexesList[0];
    } else if (potentialBalanceColumnIndexesList.length === 0) {
      throw new Error(
        'csv-sort/csvSort(): [THROW_ID_04] The computer can\'t find the "Balance" column! It saw some numeric-only columns, but they all seem to have certain rows with the same values as rows right below/above them!'
      );
    }
  }
  if (!balanceColumnIndex) {
    throw new Error(
      "csv-sort/csvSort(): [THROW_ID_05] Sadly computer couldn't find its way in this CSV and had to stop working on it."
    );
  }
  const potentialCreditDebitColumns = pull(
    Array.from(
      schema.reduce((result, el, index) => {
        if (
          (typeof el === "string" && el === "numeric") ||
          (Array.isArray(el) && el.includes("numeric"))
        ) {
          result.push(index);
        }
        return result;
      }, [])
    ),
    balanceColumnIndex,
    ...stateColumnsContainingSameValueEverywhere
  );
  const resContent = [];
  resContent.push(
    content[content.length - 1].slice(0, indexAtWhichEmptyCellsStart)
  );
  const usedUpRows = [];
  const bottom = stateHeaderRowPresent ? 1 : 0;
  for (let y = content.length - 2; y >= bottom; y--) {
    for (
      let suspectedRowsIndex = content.length - 2;
      suspectedRowsIndex >= bottom;
      suspectedRowsIndex--
    ) {
      if (!usedUpRows.includes(suspectedRowsIndex)) {
        let thisRowIsDone = false;
        for (
          let suspectedColIndex = 0, len = potentialCreditDebitColumns.length;
          suspectedColIndex < len;
          suspectedColIndex++
        ) {
          let diffVal = null;
          if (
            content[suspectedRowsIndex][
              potentialCreditDebitColumns[suspectedColIndex]
            ] !== ""
          ) {
            diffVal = currency(
              content[suspectedRowsIndex][
                potentialCreditDebitColumns[suspectedColIndex]
              ]
            );
          }
          let totalVal = null;
          if (content[suspectedRowsIndex][balanceColumnIndex] !== "") {
            totalVal = currency(
              content[suspectedRowsIndex][balanceColumnIndex]
            );
          }
          let topmostResContentBalance = null;
          if (resContent[0][balanceColumnIndex] !== "") {
            topmostResContentBalance = currency(
              resContent[0][balanceColumnIndex]
            ).format();
          }
          let currentRowsDiffVal = null;
          if (
            resContent[resContent.length - 1][
              potentialCreditDebitColumns[suspectedColIndex]
            ] !== ""
          ) {
            currentRowsDiffVal = currency(
              resContent[resContent.length - 1][
                potentialCreditDebitColumns[suspectedColIndex]
              ]
            ).format();
          }
          let lastResContentRowsBalance = null;
          if (resContent[resContent.length - 1][balanceColumnIndex] !== "") {
            lastResContentRowsBalance = currency(
              resContent[resContent.length - 1][balanceColumnIndex]
            );
          }
          if (
            diffVal &&
            totalVal.add(diffVal).format() === topmostResContentBalance
          ) {
            resContent.unshift(
              content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart)
            );
            usedUpRows.push(suspectedRowsIndex);
            thisRowIsDone = true;
            break;
          } else if (
            diffVal &&
            totalVal.subtract(diffVal).format() === topmostResContentBalance
          ) {
            resContent.unshift(
              content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart)
            );
            usedUpRows.push(suspectedRowsIndex);
            thisRowIsDone = true;
            break;
          } else if (
            currentRowsDiffVal &&
            lastResContentRowsBalance.add(currentRowsDiffVal).format() ===
              totalVal.format()
          ) {
            resContent.push(
              content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart)
            );
            usedUpRows.push(suspectedRowsIndex);
            thisRowIsDone = true;
            break;
          } else if (
            currentRowsDiffVal &&
            lastResContentRowsBalance.subtract(currentRowsDiffVal).format() ===
              totalVal.format()
          ) {
            resContent.push(
              content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart)
            );
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
    if (
      stateDataColumnRowLengthIsConsistent &&
      content[0].length > schema.length
    ) {
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
    msgContent,
    msgType,
  };
}

export default csvSort;

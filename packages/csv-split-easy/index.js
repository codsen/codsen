'use strict'

function split (str) {
  // traverse the string and push each column into array
  // when line break is detected, push what's gathered into main array
  var colStarts = 0
  var lineBreakStarts
  var rowArray = []
  var resArray = []
  var ignoreColonsThatFollow = false

  if (typeof str !== 'string') {
    throw new TypeError('csv-split-easy: split(): [THROW_ID_01] input must be string! Currently it\'s: ' + typeof (str) + ', equal to: ' + JSON.stringify(str, null, 4))
  } else {
    if (str === '') {
      return [['']]
    } else {
      str = str.trim()
    }
  }
  for (let i = 0, len = str.length; i < len; i++) {
    //
    // detect a double quote
    // ======================
    if (str[i] === '"') {
      if (ignoreColonsThatFollow) {
        // 1. turn off the flag:
        ignoreColonsThatFollow = false
        // 2. dump the value that ends here:
        rowArray.push(str.slice(colStarts, i))
      } else {
        ignoreColonsThatFollow = true
        colStarts = i + 1
      }
    } else
    //
    // detect a colon
    // ======================
    if (!ignoreColonsThatFollow && (str[i] === ',')) {
      if ((str[i - 1] !== '"') && !ignoreColonsThatFollow) {
        // dump the previous value into array if the character before it, the double
        // quote, hasn't dumped the value already:
        rowArray.push(str.slice(colStarts, i))
      }
      // in all cases, set the new start marker
      colStarts = i + 1
    } else
    //
    // detect a line break
    // ======================
    if ((str[i] === '\n') || (str[i] === '\r')) {
      // question: is it the first line break of its cluster, or not?
      if (!lineBreakStarts) {
        // 1. mark where line break starts:
        lineBreakStarts = i
        // 2. dump the value into rowArray only if closing double quote hasn't dumped already:
        if (!ignoreColonsThatFollow && (str[i - 1] !== '"')) {
          rowArray.push(str.slice(colStarts, i))
        }
        // 3. dump the whole row's array into result array:
        resArray.push(rowArray)
        // 4. wipe the rowArray:
        rowArray = []
      }
    } else {
      // if ((str[i] !== '\n') && (str[i] !== '\r'))
      //
      // but then, take care if line break state is actice
      //
      if (lineBreakStarts) {
        // 1. first, turn off the line break state flag:
        lineBreakStarts = 0
        // 2. second, new column's value starts here, so mark that:
        colStarts = i
      }
    }
    //
    // detect the end of the file/string
    // ======================
    if ((i + 1) === len) {
      // dump the value into rowArray, but only if the current character is
      // not a double quote, because it will have dumped already:
      if (str[i] !== '"') {
        rowArray.push(str.slice(colStarts, i + 1))
      }
      // in any case, dump the whole row's array into result array.
      // for posterity, the whole row (`rowArray`) dumping (into `resArray`) is
      // done at two places: here and the first encountered line break character
      // that follows non-line break character.
      resArray.push(rowArray)
    }
    //
    // ======================
    // ======================
  }
  return resArray
}

module.exports = split

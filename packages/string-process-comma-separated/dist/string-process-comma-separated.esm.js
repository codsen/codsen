/**
 * string-process-comma-separated
 * Extracts chunks from possibly comma or whatever-separated string
 * Version: 2.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-process-comma-separated/
 */

var version = "2.0.1";

const version$1 = version;

function processCommaSep(str, originalOpts) { // insurance:

  if (typeof str !== "string") {
    throw new Error(`string-process-comma-separated: [THROW_ID_01] input must be string! It was given as ${typeof str}, equal to:\n${JSON.stringify(str, null, 4)}`);
  } else if (!str.length || !originalOpts || !originalOpts.cb && !originalOpts.errCb) {
    // if input str is empty or there are no callbacks, exit early
    return;
  } // opts preparation:


  const defaults = {
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
  const opts = { ...defaults,
    ...originalOpts
  }; // patch from/to values, they might have been given as nulls etc.

  if (!Number.isInteger(originalOpts.from)) {
    opts.from = 0;
  }

  if (!Number.isInteger(originalOpts.to)) {
    opts.to = str.length;
  }

  if (!Number.isInteger(originalOpts.offset)) {
    opts.offset = 0;
  } // action:

  let chunkStartsAt = null;
  let whitespaceStartsAt = null;
  let firstNonwhitespaceNonseparatorCharFound = false;
  let separatorsArr = []; // needed to catch trailing separators

  let lastNonWhitespaceCharAt = null;
  let fixable = true;

  for (let i = opts.from; i < opts.to; i++) { // catch the last nonwhitespace char

    if (str[i].trim() && str[i] !== opts.separator) {
      lastNonWhitespaceCharAt = i;
    } // catch the beginning of a chunk


    if (chunkStartsAt === null && str[i].trim() && (!opts.separator || str[i] !== opts.separator)) {
      if (!firstNonwhitespaceNonseparatorCharFound) {
        firstNonwhitespaceNonseparatorCharFound = true;
      } // if there was only one separator up to now, wipe it


      if (separatorsArr.length) {
        if (separatorsArr.length > 1) {
          // eslint-disable-next-line no-loop-func
          separatorsArr.forEach((separatorsIdx, orderNumber) => {
            if (orderNumber) {
              opts.errCb([[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]], "Remove separator.", fixable);
            }
          });
        }

        separatorsArr = [];
      }

      chunkStartsAt = i;
    } // catch the ending of a chunk


    if (Number.isInteger(chunkStartsAt) && (i > chunkStartsAt && opts.separator && str[i] === opts.separator || i + 1 === opts.to)) {
      str.slice(chunkStartsAt, i + 1 === opts.to && str[i] !== opts.separator && str[i].trim() ? i + 1 : i); // ping the cb

      if (typeof opts.cb === "function") {
        opts.cb(chunkStartsAt + opts.offset, (i + 1 === opts.to && str[i] !== opts.separator && str[i].trim() ? i + 1 : lastNonWhitespaceCharAt + 1) + opts.offset);
      } // reset


      chunkStartsAt = null;
    } // catch the beginning of a whitespace


    if (!str[i].trim() && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
    } // catch the ending of a whitespace


    if (whitespaceStartsAt !== null && (str[i].trim() || i + 1 === opts.to)) {

      if (whitespaceStartsAt === opts.from) {

        if (!opts.leadingWhitespaceOK && typeof opts.errCb === "function") {
          opts.errCb([[whitespaceStartsAt + opts.offset, (i + 1 === opts.to ? i + 1 : i) + opts.offset]], "Remove whitespace.", fixable);
        } // else - fine

      } else if (!str[i].trim() && i + 1 === opts.to) {
        // if it's trailing whitespace, we're on the last character
        // (right before opts.to)

        if (!opts.trailingWhitespaceOK && typeof opts.errCb === "function") {
          opts.errCb([[whitespaceStartsAt + opts.offset, i + 1 + opts.offset]], "Remove whitespace.", fixable);
        } // else - fine

      } else if ((!opts.oneSpaceAfterCommaOK || !(str[i].trim() && i > opts.from + 1 && str[i - 1] === " " && str[i - 2] === ",")) && (!opts.innerWhitespaceAllowed || !(firstNonwhitespaceNonseparatorCharFound && str[whitespaceStartsAt - 1] && str[i].trim() && str[i] !== opts.separator && str[whitespaceStartsAt - 1] !== opts.separator))) { // exclude single space after a comma, with condition that something
        // non-whitespacey follows
        // maybe opts.oneSpaceAfterCommaOK is on?

        let startingIdx = whitespaceStartsAt;
        let endingIdx = i;

        if (i + 1 === opts.to && str[i] !== opts.separator && !str[i].trim()) {
          endingIdx += 1;
        } // i + 1 === opts.to && str[i] !== opts.separator && str[i].trim()
        //   ? i + 1
        //   : i;
        let whatToAdd = "";

        if (opts.oneSpaceAfterCommaOK) {

          if (str[whitespaceStartsAt] === " " && str[whitespaceStartsAt - 1] === opts.separator) {
            // if first whitespace chunk's character is a space, leave it
            startingIdx += 1;
          } else if (str[whitespaceStartsAt] !== " ") {
            // if first whitespace chunk's character is not a space,
            // replace whole chunk with a space
            whatToAdd = " ";
          }
        }

        let message = "Remove whitespace."; // What if there's a space in the middle of a value, for example, URL?
        // <input accept="abc,def ghi,jkl">
        //                       ^
        //                     here.
        // We identify it by checking, is there a separator in front.

        if (!opts.innerWhitespaceAllowed && firstNonwhitespaceNonseparatorCharFound && str[whitespaceStartsAt - 1] && str[i].trim() && str[i] !== opts.separator && str[whitespaceStartsAt - 1] !== opts.separator) {
          fixable = false;
          message = "Bad whitespace.";
        }

        if (whatToAdd.length) {
          opts.errCb([[startingIdx + opts.offset, endingIdx + opts.offset, whatToAdd]], message, fixable);
        } else {
          opts.errCb([[startingIdx + opts.offset, endingIdx + opts.offset]], message, fixable);
        } // reset fixable


        fixable = true;
      } // reset


      whitespaceStartsAt = null;
    } // catch the separator


    if (str[i] === opts.separator) {

      if (!firstNonwhitespaceNonseparatorCharFound) {
        opts.errCb([[i + opts.offset, i + 1 + opts.offset]], "Remove separator.", fixable);
      } else {
        separatorsArr.push(i);
      }
    } //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                            BOTTOM RULES
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    // catch the end of the string


    if (i + 1 === opts.to) {
      // eslint-disable-next-line no-loop-func
      separatorsArr.forEach(separatorsIdx => {
        opts.errCb([[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]], "Remove separator.", fixable);
      });
    } // logging
  }
}

export { processCommaSep, version$1 as version };

/**
 * html-crush
 * Minifies HTML/CSS: valid or broken, pure or mixed with other languages
 * Version: 4.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/html-crush/
 */

import { rApply } from 'ranges-apply';
import { Ranges } from 'ranges-push';
import { matchRightIncl, matchRight, matchLeft } from 'string-match-left-right';
import { expander } from 'string-range-expander';
import { right, left } from 'string-left-right';

var version = "4.0.3";

const version$1 = version;
const finalIndexesToDelete = new Ranges({
  limitToBeAddedWhitespace: true
});
const defaults = {
  lineLengthLimit: 500,
  removeIndentations: true,
  removeLineBreaks: false,
  removeHTMLComments: false,
  removeCSSComments: true,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  breakToTheLeftOf: ["</td", "<html", "</html", "<head", "</head", "<meta", "<link", "<table", "<script", "</script", "<!DOCTYPE", "<style", "</style", "<title", "<body", "@media", "</body", "<!--[if", "<!--<![endif", "<![endif]"],
  mindTheInlineTags: ["a", "abbr", "acronym", "audio", "b", "bdi", "bdo", "big", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "mark", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "tt", "var", "video", "wbr"]
};
const applicableOpts = {
  removeHTMLComments: false,
  removeCSSComments: false
};

function isStr(something) {
  return typeof something === "string";
}

function isLetter(something) {
  return typeof something === "string" && something.toUpperCase() !== something.toLowerCase();
}
/**
 * Minifies HTML/CSS: valid or broken, pure or mixed with other languages
 */


function crush(str, originalOpts) {
  const start = Date.now(); // insurance:

  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error("html-crush: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error(`html-crush: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(str, null, 4)}`);
    }
  }

  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(`html-crush: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(originalOpts, null, 4)}`);
  }

  if (originalOpts && Array.isArray(originalOpts.breakToTheLeftOf) && originalOpts.breakToTheLeftOf.length) {
    for (let z = 0, len = originalOpts.breakToTheLeftOf.length; z < len; z++) {
      if (!isStr(originalOpts.breakToTheLeftOf[z])) {
        throw new TypeError(`html-crush: [THROW_ID_05] the opts.breakToTheLeftOf array contains non-string elements! For example, element at index ${z} is of a type "${typeof originalOpts.breakToTheLeftOf[z]}" and is equal to:\n${JSON.stringify(originalOpts.breakToTheLeftOf[z], null, 4)}`);
      }
    }
  }

  const opts = { ...defaults,
    ...originalOpts
  }; // normalize the opts.removeHTMLComments

  if (typeof opts.removeHTMLComments === "boolean") {
    opts.removeHTMLComments = opts.removeHTMLComments ? 1 : 0;
  }

  let breakToTheLeftOfFirstLetters = "";

  if (Array.isArray(opts.breakToTheLeftOf) && opts.breakToTheLeftOf.length) {
    breakToTheLeftOfFirstLetters = [...new Set(opts.breakToTheLeftOf.map(val => val[0]))].join("");
  } // console.log(
  //   `0187 ${`\u001b[${33}m${`breakToTheLeftOfFirstLetters`}\u001b[${39}m`} = ${JSON.stringify(
  //     breakToTheLeftOfFirstLetters,
  //     null,
  //     4
  //   )}`
  // );
  //
  // console.log("\n");
  // console.log(
  //   `0196 ${`\u001b[${33}m${`██ ██ ██`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );

  let lastLinebreak = null;
  let whitespaceStartedAt = null;
  let nonWhitespaceCharMet = false;
  let countCharactersPerLine = 0; // new characters-per-line counter

  let cpl = 0;
  let withinStyleTag = false;
  let withinHTMLConditional = false; // <!--[if lte mso 11]> etc

  let withinInlineStyle = null;
  let styleCommentStartedAt = null;
  let htmlCommentStartedAt = null;
  let scriptStartedAt = null; // main do nothing switch, used to skip chunks of code and perform no action

  let doNothing; // we use staging "from" and "to" to preemptively mark the chunks
  // of whitespace that will be either: a) replaced with a space; or
  // b) replaced with linebreak. If opts.removeLineBreaks is on,
  // if we need to break where the particular whitespace chunk is
  // located, we replace it with line break. Otherwise, if
  // the next chunk of characters that follows it fits on one line,
  // we replace it with a single space.

  let stageFrom = null;
  let stageTo = null;
  let stageAdd = null;
  let tagName = null;
  let tagNameStartsAt = null;
  let leftTagName = null;
  const CHARS_BREAK_ON_THE_RIGHT_OF_THEM = `>};`;
  const CHARS_BREAK_ON_THE_LEFT_OF_THEM = `<`;
  const CHARS_DONT_BREAK_ON_THE_LEFT_OF_THEM = `!`;
  const DELETE_TIGHTLY_IF_ON_LEFT_IS = `>`;
  const DELETE_TIGHTLY_IF_ON_RIGHT_IS = `<`;
  const set = `{},:;<>~+`;
  const DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS = set;
  const DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS = set; // the first non-whitespace character turns this flag off:

  let beginningOfAFile = true; // it will be used to trim start of the file.

  const len = str.length;
  const midLen = Math.floor(len / 2);
  const leavePercForLastStage = 0.01; // in range of [0, 1]
  // ceil - total range which is allocated to the main processing

  let ceil;

  if (opts.reportProgressFunc) {
    ceil = Math.floor(opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom);
  } // one more round to collapse the whitespace to:
  // 1. Tackle indentations
  // 2. Remove excessive whitespace between strings on each line (not touching indentations)
  // progress-wise, 98% will be allocated to loop, rest 2% - to range applies and
  // final return clauses


  let currentPercentageDone;
  let lastPercentage = 0;

  if (len) {
    for (let i = 0; i < len; i++) {
      //
      //
      //
      //
      //                    TOP
      //
      //
      //
      //
      // Logging:
      // ███████████████████████████████████████ // Report the progress. We'll allocate 98% of the progress bar to this stage

      if (opts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          if (i === midLen) {
            opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
          }
        } else if (len >= 2000) {
          // defaults:
          // opts.reportProgressFuncFrom = 0
          // opts.reportProgressFuncTo = 100
          currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * (ceil || 1));

          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      } // count characters-per-line


      cpl++; // turn off doNothing if marker passed
      // ███████████████████████████████████████

      if (doNothing && typeof doNothing === "number" && i >= doNothing) {
        doNothing = undefined;
      } // catch ending of </script...
      // ███████████████████████████████████████


      if (scriptStartedAt !== null && str.startsWith("</script", i) && !isLetter(str[i + 8])) { // 1. if there is a line break, chunk of whitespace and </script>,
        // delete that chunk of whitespace, leave line break.
        // If there's non-whitespace character, chunk of whitespace and </script>,
        // delete that chunk of whitespace.
        // Basically, traverse backwards from "<" of "</script>", stop either
        // at first line break or non-whitespace character.

        if ((opts.removeIndentations || opts.removeLineBreaks) && i > 0 && str[~-i] && !str[~-i].trim()) {
          // march backwards

          for (let y = i; y--;) {

            if (str[y] === "\n" || str[y] === "\r" || str[y].trim()) {
              if (y + 1 < i) {
                finalIndexesToDelete.push(y + 1, i);
              }
              break;
            }
          }
        } // 2.


        scriptStartedAt = null;
        doNothing = false;
        i += 8;
        continue;
      } // catch start of <script...
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && str.startsWith("<script", i) && !isLetter(str[i + 7])) {
        scriptStartedAt = i;
        doNothing = true;
        let whatToInsert = "";

        if ((opts.removeLineBreaks || opts.removeIndentations) && whitespaceStartedAt !== null) {
          if (whitespaceStartedAt > 0) {
            whatToInsert = "\n";
          }

          finalIndexesToDelete.push(whitespaceStartedAt, i, whatToInsert);
        }

        whitespaceStartedAt = null;
        lastLinebreak = null;
      } //
      //
      //
      //
      //
      //
      //
      //
      //             MIDDLE
      //
      //
      //
      //
      //
      //
      //
      //
      // catch ending of the tag's name
      // ███████████████████████████████████████


      if (tagNameStartsAt !== null && tagName === null && !/\w/.test(str[i]) // not a letter
      ) {
          tagName = str.slice(tagNameStartsAt, i); // check for inner tag whitespace

          const idxOnTheRight = right(str, ~-i);

          if (typeof idxOnTheRight === "number" && str[idxOnTheRight] === ">" && !str[i].trim() && right(str, i)) {
            finalIndexesToDelete.push(i, right(str, i));
          } else if (idxOnTheRight && str[idxOnTheRight] === "/" && str[right(str, idxOnTheRight)] === ">") {
            // if there's a space in front of "/>"
            if (!str[i].trim() && right(str, i)) {
              finalIndexesToDelete.push(i, right(str, i));
            } // if there's space between slash and bracket


            if (str[idxOnTheRight + 1] !== ">" && right(str, idxOnTheRight + 1)) {
              finalIndexesToDelete.push(idxOnTheRight + 1, right(str, idxOnTheRight + 1));
            }
          }
        } // catch a tag's opening bracket
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && !withinInlineStyle && str[~-i] === "<" && tagNameStartsAt === null) {
        if (/\w/.test(str[i])) {
          tagNameStartsAt = i;
        } else if (str[right(str, ~-i)] === "/" && /\w/.test(str[right(str, right(str, ~-i))] || "")) {
          tagNameStartsAt = right(str, right(str, ~-i));
        }
      } // catch an end of CSS comments
      // ███████████████████████████████████████


      if (!doNothing && (withinStyleTag || withinInlineStyle) && styleCommentStartedAt !== null && str[i] === "*" && str[i + 1] === "/") { // stage:

        [stageFrom, stageTo] = expander({
          str,
          from: styleCommentStartedAt,
          to: i + 2,
          ifLeftSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS ,
          ifRightSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS 
        }); // reset marker:

        styleCommentStartedAt = null;

        if (stageFrom != null) {
          finalIndexesToDelete.push(stageFrom, stageTo);
        } else {
          countCharactersPerLine += 1;
          i += 1;
        } // console.log(`0796 CONTINUE`);
        // continue;


        doNothing = i + 2;
      } // catch a start of CSS comments
      // ███████████████████████████████████████


      if (!doNothing && (withinStyleTag || withinInlineStyle) && styleCommentStartedAt === null && str[i] === "/" && str[i + 1] === "*") { // independently of options settings, mark the options setting
        // "removeCSSComments" as applicable:

        if (!applicableOpts.removeCSSComments) {
          applicableOpts.removeCSSComments = true;
        }

        if (opts.removeCSSComments) {
          styleCommentStartedAt = i;
        }
      } // catch an ending of mso conditional tags
      // ███████████████████████████████████████


      if (withinHTMLConditional && str.startsWith("![endif", i + 1)) {
        withinHTMLConditional = false;
      } // catch an end of HTML comment
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && !withinInlineStyle && htmlCommentStartedAt !== null) {
        let distanceFromHereToCommentEnding;

        if (str.startsWith("-->", i)) {
          distanceFromHereToCommentEnding = 3;
        } else if (str[i] === ">" && str[i - 1] === "]") {
          distanceFromHereToCommentEnding = 1;
        }

        if (distanceFromHereToCommentEnding) {
          // stage:
          [stageFrom, stageTo] = expander({
            str,
            from: htmlCommentStartedAt,
            to: i + distanceFromHereToCommentEnding
          }); // reset marker:

          htmlCommentStartedAt = null;

          if (stageFrom != null) {
            // it depends is there any character allowance left from the
            // line length limit or not

            if (opts.lineLengthLimit && cpl - (stageTo - stageFrom) >= opts.lineLengthLimit) {
              finalIndexesToDelete.push(stageFrom, stageTo, "\n"); // Currently we're not on the bracket ">" of the comment
              // closing "-->", we're at the start of it, that first
              // dash. This means, we'll still traverse to the end
              // of this comment tag, before the actual "reset" should
              // happen.
              // Luckily we know how many characters are there left
              // to traverse until the comment's ending is reached -
              // "distanceFromHereToCommentEnding".

              cpl = -distanceFromHereToCommentEnding; // here we've reset cpl to some negative value, like -3
            } else {
              // we have some character length allowance left so
              // let's just delete the comment and reduce the cpl
              // by that length
              finalIndexesToDelete.push(stageFrom, stageTo);
              cpl -= stageTo - stageFrom;
            } // finalIndexesToDelete.push(i + 1, i + 1, "\n");
            // console.log(`1485 PUSH [${i + 1}, ${i + 1}, "\\n"]`);
            // countCharactersPerLine = 0;

          } else {
            countCharactersPerLine += distanceFromHereToCommentEnding - 1;
            i += distanceFromHereToCommentEnding - 1;
          } // console.log(`0796 CONTINUE`);
          // continue;


          doNothing = i + distanceFromHereToCommentEnding;
        }
      } // catch a start of HTML comment
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && !withinInlineStyle && str.startsWith("<!--", i) && htmlCommentStartedAt === null) { // detect outlook conditionals

        if (str.startsWith("[if", i + 4)) {

          if (!withinHTMLConditional) {
            withinHTMLConditional = true;
          } // skip the second counterpart, "<!-->" of "<!--[if !mso]><!-->"
          // the plan is to not set the "htmlCommentStartedAt" at all if deletion
          // is not needed


          if (opts.removeHTMLComments === 2) {
            htmlCommentStartedAt = i;
          }
        } else if ( // setting is either 1 or 2 (delete text comments only or any comments):
        opts.removeHTMLComments && ( // prevent the "not" type tails' "<!--" of "<!--<![endif]-->" from
        // accidentally triggering the clauses
        !withinHTMLConditional || opts.removeHTMLComments === 2)) {
          htmlCommentStartedAt = i;
        } // independently of options settings, mark the options setting
        // "removeHTMLComments" as applicable:


        if (!applicableOpts.removeHTMLComments) {
          applicableOpts.removeHTMLComments = true;
        } // opts.removeHTMLComments: 0|1|2

      } // catch style tag
      // ███████████████████████████████████████


      if (!doNothing && withinStyleTag && styleCommentStartedAt === null && str.startsWith("</style", i) && !isLetter(str[i + 7])) {
        withinStyleTag = false;
      } else if (!doNothing && !withinStyleTag && styleCommentStartedAt === null && str.startsWith("<style", i) && !isLetter(str[i + 6])) {
        withinStyleTag = true; // if opts.breakToTheLeftOf have "<style" among them, break to the
        // right of this tag as well

        if ((opts.removeLineBreaks || opts.removeIndentations) && opts.breakToTheLeftOf.includes("<style") && str.startsWith(` type="text/css">`, i + 6) && str[i + 24]) {
          finalIndexesToDelete.push(i + 23, i + 23, "\n");
        }
      } // catch start of inline styles
      // ███████████████████████████████████████


      if (!doNothing && !withinInlineStyle && `"'`.includes(str[i]) && str.endsWith("style=", i)) {
        withinInlineStyle = i;
      } // catch whitespace
      // ███████████████████████████████████████


      if (!doNothing && !str[i].trim()) {
        // if whitespace
        if (whitespaceStartedAt === null) {
          whitespaceStartedAt = i;
        }
      } else if (!doNothing && !((withinStyleTag || withinInlineStyle) && styleCommentStartedAt !== null)) {
        // catch the ending of a whitespace chunk
        // console.log(`0912`);
        if (whitespaceStartedAt !== null) {

          if (opts.removeLineBreaks) {
            countCharactersPerLine += 1;
          }

          if (beginningOfAFile) {
            beginningOfAFile = false;

            if (opts.removeIndentations || opts.removeLineBreaks) {
              finalIndexesToDelete.push(0, i);
            }
          } else { // so it's not beginning of a file
            // this is the most important area of the program - catching normal
            // whitespace chunks
            // ===================================================================
            // ██ CASE 1. Remove indentations only.

            if (opts.removeIndentations && !opts.removeLineBreaks) {

              if (!nonWhitespaceCharMet && lastLinebreak !== null && i > lastLinebreak) {
                finalIndexesToDelete.push(lastLinebreak + 1, i);
              } else if (whitespaceStartedAt + 1 < i) {
                // we'll try to recycle some spaces, either at the
                // beginning (preferable) or ending (at least) of the
                // whitespace chunk, instead of wiping whole whitespace
                // chunk and adding single space again.
                // first, crop tight around the conditional comments
                if ( // imagine <!--[if mso]>
                str.endsWith("]>", whitespaceStartedAt) || // imagine <!--[if !mso]><!-->...<
                //                            ^
                //                            |
                //                          our "whitespaceStartedAt"
                str.endsWith("-->", whitespaceStartedAt) || // imagine closing counterparts, .../>...<![endif]-->
                str.startsWith("<![", i) || // imagine other type of closing counterpart, .../>...<!--<![
                str.startsWith("<!--<![", i)) {
                  // push the whole whitespace chunk
                  finalIndexesToDelete.push(whitespaceStartedAt, i);
                } else if (str[whitespaceStartedAt] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
                } else if (str[~-i] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt, ~-i);
                } else {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, " ");
                }
              }
            } // ===================================================================
            // ██ CASE 2. Remove linebreaks (includes indentation removal by definition).


            if (opts.removeLineBreaks || withinInlineStyle) { //
              // ██ CASE 2-1 - special break points from opts.breakToTheLeftOf

              if (breakToTheLeftOfFirstLetters.includes(str[i]) && matchRightIncl(str, i, opts.breakToTheLeftOf)) { // maybe there was just single line break?

                if (!(str[~-i] === "\n" && whitespaceStartedAt === ~-i)) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, "\n");
                }

                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                whitespaceStartedAt = null;
                countCharactersPerLine = 1;
                continue;
              } // ██ CASE 2-2 - rest of whitespace chunk removal clauses
              let whatToAdd = " "; // skip for inline tags and also inline comparisons vs. numbers
              // for example "something < 2" or "zzz > 1"

              if ( // (
              str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
                cb: nextChar => !nextChar || !/\w/.test(nextChar)
              }) // ) ||
              // ("<>".includes(str[i]) &&
              //   ("0123456789".includes(str[right(str, i)]) ||
              //     "0123456789".includes(str[left(str, i)])))
              ) ; else if (str[~-whitespaceStartedAt] && DELETE_TIGHTLY_IF_ON_LEFT_IS.includes(str[~-whitespaceStartedAt]) && DELETE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i]) || (withinStyleTag || withinInlineStyle) && styleCommentStartedAt === null && (DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS.includes(str[~-whitespaceStartedAt]) || DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i])) || str.startsWith("!important", i) && !withinHTMLConditional || withinInlineStyle && (str[~-whitespaceStartedAt] === "'" || str[~-whitespaceStartedAt] === '"') || str[~-whitespaceStartedAt] === "}" && str.startsWith("</style", i) || str[i] === ">" && (`'"`.includes(str[left(str, i)]) || str[right(str, i)] === "<") || str[i] === "/" && str[right(str, i)] === ">") {
                whatToAdd = "";

                if (str[i] === "/" && str[i + 1] === ">" && right(str, i) && right(str, i) > i + 1) {
                  // delete whitespace between / and >
                  finalIndexesToDelete.push(i + 1, right(str, i));
                  countCharactersPerLine -= right(str, i) - i + 1;
                }
              }

              if (whatToAdd && whatToAdd.length) {
                countCharactersPerLine += 1;
              } // TWO CASES:


              if (!opts.lineLengthLimit) { // 2-1: Line-length limiting is off (easy)
                // We skip the stage part, the whitespace chunks to straight to
                // finalIndexesToDelete ranges array.
                // but ensure that we're not replacing a single space with a single space

                if (!(i === whitespaceStartedAt + 1 && // str[whitespaceStartedAt] === " " &&
                whatToAdd === " ")) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                }
              } else { // 2-2: Line-length limiting is on (not that easy)
                // maybe we are already beyond the limit?

                if (countCharactersPerLine >= opts.lineLengthLimit || !str[i + 1] || str[i] === ">" || str[i] === "/" && str[i + 1] === ">") {

                  if (countCharactersPerLine > opts.lineLengthLimit || countCharactersPerLine === opts.lineLengthLimit && str[i + 1] && str[i + 1].trim() && !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i + 1])) {
                    whatToAdd = "\n";
                    countCharactersPerLine = 1;
                  } // replace the whitespace only in two cases:
                  // 1) if line length limit would otherwise be exceeded
                  // 2) if this replacement reduces the file length. For example,
                  // don't replace the linebreak with a space. But do delete
                  // linebreak like it happens between tags.


                  if (countCharactersPerLine > opts.lineLengthLimit || !(whatToAdd === " " && i === whitespaceStartedAt + 1)) {
                    finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                    lastLinebreak = null;
                  }

                  stageFrom = null;
                  stageTo = null;
                  stageAdd = null;
                } else if (stageFrom === null || whitespaceStartedAt < stageFrom) {
                  // only submit the range if it's bigger
                  stageFrom = whitespaceStartedAt;
                  stageTo = i;
                  stageAdd = whatToAdd;
                }
              }
            } // ===================================================================

          } // finally, toggle the marker:


          whitespaceStartedAt = null; // toggle nonWhitespaceCharMet

          if (!nonWhitespaceCharMet) {
            nonWhitespaceCharMet = true;
          } // continue;

        } else {
          // 1. case when first character in string is not whitespace:
          if (beginningOfAFile) {
            beginningOfAFile = false;
          } // 2. tend count if linebreak removal is on:


          if (opts.removeLineBreaks) {
            // there was no whitespace gap and linebreak removal is on, so just
            // increment the count
            countCharactersPerLine += 1;
          }
        } // ===================================================================
        // ██ EXTRAS:
        // toggle nonWhitespaceCharMet


        if (!nonWhitespaceCharMet) {
          nonWhitespaceCharMet = true;
        }
      } // catch the characters, suitable for a break


      if (!doNothing && !beginningOfAFile && i !== 0 && opts.removeLineBreaks && (opts.lineLengthLimit || breakToTheLeftOfFirstLetters) && !str.startsWith("</a", i)) {
        if (breakToTheLeftOfFirstLetters && matchRightIncl(str, i, opts.breakToTheLeftOf) && str.slice(0, i).trim() && (!str.startsWith("<![endif]", i) || !matchLeft(str, i, "<!--"))) {
          finalIndexesToDelete.push(i, i, "\n");
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
          countCharactersPerLine = 1;
          continue;
        } else if (opts.lineLengthLimit && countCharactersPerLine <= opts.lineLengthLimit) {
          if (!str[i + 1] || CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !CHARS_DONT_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) || CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) || !str[i].trim()) { // 1. release stage contents - now they'll be definitely deleted
            // =============================================================

            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              let whatToAdd = stageAdd; // if we are not on breaking point, last "stageAdd" needs to be
              // amended into linebreak because otherwise we'll exceed the
              // character limit

              if (str[i].trim() && str[i + 1] && str[i + 1].trim() && countCharactersPerLine + (stageAdd ? stageAdd.length : 0) > opts.lineLengthLimit) {
                whatToAdd = "\n";
              } // if line is beyond the line length limit or whitespace is not
              // a single space, staged to be replaced with single space,
              // tackle this whitespace


              if (countCharactersPerLine + (whatToAdd ? whatToAdd.length : 0) > opts.lineLengthLimit || !(whatToAdd === " " && stageTo === stageFrom + 1)) {
                // push this range only if it's not between curlies, } and {
                if (!(str[~-stageFrom] === "}" && str[stageTo] === "{")) {
                  finalIndexesToDelete.push(stageFrom, stageTo, whatToAdd);
                  lastLinebreak = null;
                }
              } else {
                countCharactersPerLine -= lastLinebreak || 0;
              }
            } // 2. put this current place into stage
            // =============================================================

            if (str[i].trim() && (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) || str[~-i] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[~-i])) && isStr(leftTagName) && (!tagName || !opts.mindTheInlineTags.includes(tagName)) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
              cb: nextChar => !nextChar || !/\w/.test(nextChar)
            })) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
              trimCharsBeforeMatching: "/",
              cb: nextChar => !nextChar || !/\w/.test(nextChar)
            }))) {
              stageFrom = i;
              stageTo = i;
              stageAdd = null;
            } else if (styleCommentStartedAt === null && stageFrom !== null && (withinInlineStyle || !opts.mindTheInlineTags || !Array.isArray(opts.mindTheInlineTags) || Array.isArray(opts.mindTheInlineTags.length) && !opts.mindTheInlineTags.length || !isStr(tagName) || Array.isArray(opts.mindTheInlineTags) && opts.mindTheInlineTags.length && isStr(tagName) && !opts.mindTheInlineTags.includes(tagName)) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
              trimCharsBeforeMatching: "/",
              cb: nextChar => !nextChar || !/\w/.test(nextChar)
            }))) {
              stageFrom = null;
              stageTo = null;
              stageAdd = null; // if (str[i] === "\n" || str[i] === "\r") {
              //   countCharactersPerLine -= lastLinebreak;
              //   console.log(
              //     `1449 SET countCharactersPerLine = ${countCharactersPerLine}`
              //   );
              // }
            }
          }
        } else if (opts.lineLengthLimit) {
          // countCharactersPerLine > opts.lineLengthLimit // LIMIT HAS BEEN EXCEEDED!
          // WE NEED TO BREAK RIGHT HERE

          if (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
            trimCharsBeforeMatching: "/",
            cb: nextChar => !nextChar || !/\w/.test(nextChar)
          }))) {
            // ██ 1.
            // // if really exceeded, not on limit, commit stage which will shorten
            // the string and maybe we'll be within the limit range again

            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) { // case in test 02.11.09
              // We might have passed some tabs for example, which should be
              // deleted what might put line length back within limit. Or not.
              //

              const whatToAddLength = stageAdd && stageAdd.length ? stageAdd.length : 0; // Currently, countCharactersPerLine > opts.lineLengthLimit
              // But, will it still be true if we compensate for what's in stage?

              if (countCharactersPerLine - (stageTo - stageFrom - whatToAddLength) - 1 > opts.lineLengthLimit) ; else {
                // So,
                // countCharactersPerLine -
                // (stageTo - stageFrom - whatToAddLength) - 1 <=
                // opts.lineLengthLimit
                // don't break at stage, just apply its contents and we're good
                finalIndexesToDelete.push(stageFrom, stageTo, stageAdd); // We're not done yet. We are currently located on a potential
                // break point,
                // countCharactersPerLine -
                // (stageTo - stageFrom - whatToAddLength) - 1 ===
                // opts.lineLengthLimit ?

                if (countCharactersPerLine - (stageTo - stageFrom - whatToAddLength) - 1 === opts.lineLengthLimit) {
                  finalIndexesToDelete.push(i, i, "\n");
                  countCharactersPerLine = 0;
                } // reset


                stageFrom = null;
                stageTo = null;
                stageAdd = null;
              }
            } else { //

              finalIndexesToDelete.push(i, i, "\n");
              countCharactersPerLine = 0;
            }
          } else if (str[i + 1] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && isStr(tagName) && Array.isArray(opts.mindTheInlineTags) && opts.mindTheInlineTags.length && !opts.mindTheInlineTags.includes(tagName)) {
            // ██ 2.
            //

            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) ; else { //

              finalIndexesToDelete.push(i + 1, i + 1, "\n");
              countCharactersPerLine = 0;
            }
          } else if (!str[i].trim()) ; else if (!str[i + 1]) {
            // ██ 4.
            // // if we reached the end of string, check what's in stage

            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              finalIndexesToDelete.push(stageFrom, stageTo, "\n");
            }
          }
        }
      } // catch any character beyond the line length limit:


      if (!doNothing && !beginningOfAFile && opts.removeLineBreaks && opts.lineLengthLimit && countCharactersPerLine >= opts.lineLengthLimit && stageFrom !== null && stageTo !== null && !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !"/".includes(str[i])) { // two possible cases:
        // 1. we hit the line length limit and we can break afterwards
        // 2. we can't break afterwards, and there might be stage present

        if (!(countCharactersPerLine === opts.lineLengthLimit && str[i + 1] && !str[i + 1].trim())) {
          //
          let whatToAdd = "\n";

          if (str[i + 1] && !str[i + 1].trim() && countCharactersPerLine === opts.lineLengthLimit) {
            whatToAdd = stageAdd;
          } // final correction - we might need to extend stageFrom to include
          // all whitespace on the left if whatToAdd is a line break


          if (whatToAdd === "\n" && !str[~-stageFrom].trim() && left(str, stageFrom)) {
            stageFrom = left(str, stageFrom) + 1;
          }
          finalIndexesToDelete.push(stageFrom, stageTo, whatToAdd);
          countCharactersPerLine = i - stageTo;

          if (str[i].length) {
            countCharactersPerLine += 1;
          }

          stageFrom = null;
          stageTo = null;
          stageAdd = null;
        }
      } // catch line breaks
      // ███████████████████████████████████████


      if (!doNothing && str[i] === "\n" || str[i] === "\r" && (!str[i + 1] || str[i + 1] && str[i + 1] !== "\n")) {
        // =======================================================================
        // mark this
        lastLinebreak = i; // =======================================================================
        // reset nonWhitespaceCharMet

        if (nonWhitespaceCharMet) {
          nonWhitespaceCharMet = false;
        } // =======================================================================
        // delete trailing whitespace on each line OR empty lines


        if (!opts.removeLineBreaks && whitespaceStartedAt !== null && whitespaceStartedAt < i && str[i + 1] && str[i + 1] !== "\r" && str[i + 1] !== "\n") {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
        }
      } // catch the EOF
      // ███████████████████████████████████████


      if (!str[i + 1]) {
        if (withinStyleTag && styleCommentStartedAt !== null) {
          finalIndexesToDelete.push(...expander({
            str,
            from: styleCommentStartedAt,
            to: i,
            ifLeftSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS ,
            ifRightSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS 
          }));
        } else if (whitespaceStartedAt && str[i] !== "\n" && str[i] !== "\r") {
          // catch trailing whitespace at the end of the string which is not legit
          // trailing linebreak
          finalIndexesToDelete.push(whitespaceStartedAt, i + 1);
        } else if (whitespaceStartedAt && (str[i] === "\r" && str[i + 1] === "\n" || str[i] === "\n" && str[i - 1] !== "\r")) {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
        }
      } //
      //
      //
      //
      //
      //
      //
      //
      //
      //              BOTTOM
      //
      //
      //
      //
      //
      //
      //
      //
      // catch end of inline styles
      // ███████████████████████████████████████


      if (!doNothing && withinInlineStyle && withinInlineStyle < i && str[withinInlineStyle] === str[i]) {
        withinInlineStyle = null;
      } // catch <pre...>
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && str.startsWith("<pre", i) && !isLetter(str[i + 4])) {
        const locationOfClosingPre = str.indexOf("</pre", i + 5);

        if (locationOfClosingPre > 0) {
          doNothing = locationOfClosingPre;
        }
      } // catch <code...>
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && str.startsWith("<code", i) && !isLetter(str[i + 5])) {
        const locationOfClosingCode = str.indexOf("</code", i + 5);

        if (locationOfClosingCode > 0) {
          doNothing = locationOfClosingCode;
        }
      } // catch start of <![CDATA[
      // ███████████████████████████████████████


      if (!doNothing && str.startsWith("<![CDATA[", i)) {
        const locationOfClosingCData = str.indexOf("]]>", i + 9);

        if (locationOfClosingCData > 0) {
          doNothing = locationOfClosingCData;
        }
      } // catch tag's closing bracket
      // ███████████████████████████████████████


      if (!doNothing && !withinStyleTag && !withinInlineStyle && tagNameStartsAt !== null && str[i] === ">") {
        // if another tag starts on the right, hand over the name:
        if (str[right(str, i)] === "<") {
          leftTagName = tagName;
        }

        tagNameStartsAt = null;
        tagName = null;
      } // catch tag's opening bracket
      // ███████████████████████████████████████


      if (str[i] === "<" && leftTagName !== null) {
        // reset it after use
        leftTagName = null;
      } // logging after each loop's iteration:
      //
      //
      // end of the loop
    }

    if (finalIndexesToDelete.current()) {
      const ranges = finalIndexesToDelete.current();
      finalIndexesToDelete.wipe();
      const startingPercentageDone = opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage;
      const res = rApply(str, ranges, applyPercDone => {
        // allocate remaining "leavePercForLastStage" percentage of the total
        // progress reporting to this stage:
        if (opts.reportProgressFunc && len >= 2000) {
          currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) * (applyPercDone / 100));

          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      });
      const resLen = res.length;
      return {
        log: {
          timeTakenInMilliseconds: Date.now() - start,
          originalLength: len,
          cleanedLength: resLen,
          bytesSaved: Math.max(len - resLen, 0),
          percentageReducedOfOriginal: len ? Math.round(Math.max(len - resLen, 0) * 100 / len) : 0
        },
        ranges,
        applicableOpts,
        result: res
      };
    }
  } // ELSE - return the original input string
  return {
    log: {
      timeTakenInMilliseconds: Date.now() - start,
      originalLength: len,
      cleanedLength: len,
      bytesSaved: 0,
      percentageReducedOfOriginal: 0
    },
    applicableOpts,
    ranges: null,
    result: str
  };
}

export { crush, defaults, version$1 as version };

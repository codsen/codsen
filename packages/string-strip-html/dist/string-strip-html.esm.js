import replaceSlicesArr from 'string-replace-slices-array';
import Slices from 'string-slices-array-push';
import isObj from 'lodash.isplainobject';
import checkTypes from 'check-types-mini';
import trimChars from 'lodash.trim';
import { matchRight } from 'string-match-left-right';

function stripHtml(str, originalOpts) {
  function existy(x) {
    return x != null;
  }
  const isArr = Array.isArray;
  function isStr(something) {
    return typeof something === "string";
  }
  function isNum(something) {
    return typeof something === "number";
  }
  function tagName(char) {
    return char === ">" || char.trim() === "";
  }

  // vars
  const definitelyTagNames = [
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "math",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "param",
    "picture",
    "pre",
    "progress",
    "rb",
    "rp",
    "rt",
    "rtc",
    "ruby",
    "samp",
    "script",
    "section",
    "select",
    "slot",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "svg",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "ul",
    "var",
    "video",
    "wbr"
  ];
  const singleLetterTags = ["a", "b", "i", "p", "q", "s", "u"];
  const suspiciousList = ["="];
  const punctuation = [".", ",", "!", "?", ";", ")", "\u2026", '"']; // \u2026 is &hellip - ellipsis
  const stripTogetherWithTheirContentsDefaults = ["script", "style", "xml"];

  // validation
  if (typeof str !== "string") {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: ${typeof str}, equal to:\n${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (
    originalOpts !== undefined &&
    originalOpts !== null &&
    !isObj(originalOpts)
  ) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: ${typeof originalOpts}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  // prep opts
  const defaults = {
    ignoreTags: [],
    stripTogetherWithTheirContents: stripTogetherWithTheirContentsDefaults
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (!opts.stripTogetherWithTheirContents) {
    opts.stripTogetherWithTheirContents = [];
  } else if (
    typeof opts.stripTogetherWithTheirContents === "string" &&
    opts.stripTogetherWithTheirContents.length > 0
  ) {
    opts.stripTogetherWithTheirContents = [opts.stripTogetherWithTheirContents];
  }
  checkTypes(opts, defaults, {
    msg: "string-strip-html/stripHtml(): [THROW_ID_03*]",
    schema: {
      stripTogetherWithTheirContents: ["array"]
    }
  });

  const somethingCaught = {};
  if (
    opts.stripTogetherWithTheirContents &&
    isArr(opts.stripTogetherWithTheirContents) &&
    opts.stripTogetherWithTheirContents.length > 0 &&
    !opts.stripTogetherWithTheirContents.every((el, i) => {
      if (!isStr(el)) {
        somethingCaught.el = el;
        somethingCaught.i = i;
        return false;
      }
      return true;
    })
  ) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_04] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index ${
        somethingCaught.i
      } has a value ${
        somethingCaught.el
      } which is not string but ${typeof somethingCaught.el}.`
    );
  }

  // ---------------------------------------------------------------------------
  // step 0.
  // End sooner if it's an empty or empty-ish string:

  if (str === "" || str.trim() === "") {
    return str;
  }

  // ---------------------------------------------------------------------------
  // step 1.
  //
  // Thinking about the JS perf.
  //
  // We are not going to check each character, slicing and comparing against
  // opts.stripTogetherWithTheirContents contents.
  //
  // We are going to extract first letters' lower and upper index charAt() ranges
  // from opts.stripTogetherWithTheirContents
  //
  // it's so that we would be able to traverse the input character-by-character,
  // then quickly query current character's charAt() index, and compare, is it
  // within the range of whole tag first letter indexes.
  //
  // We do this to save calculation rounds slicing whole string and comparing.
  // For example, "whole" tags to be removed are "style" and "script".
  // Letter 'S'.charCodeAt(0) is 115.
  // This means, we can quickly test upon input traversal, is current character's
  // index equal to 115. If so, perform test slicing is next substring "cript" or "tyle"
  // (next letters after "script" and "style").
  //
  // This is opposed to gung-ho slicing and checking each single character of the
  // input, is it equal in whole to each of the elements in
  // opts.stripTogetherWithTheirContents

  let stripTogetherWithTheirContentsRange;

  // Hardcoding the single index of defaults', "style", "script" and "xml",
  // the common first character, "s".
  if (
    opts.stripTogetherWithTheirContents &&
    isArr(opts.stripTogetherWithTheirContents) &&
    opts.stripTogetherWithTheirContents.length > 0
  ) {
    if (
      opts.stripTogetherWithTheirContents.join("") ===
      stripTogetherWithTheirContentsDefaults.join("")
    ) {
      stripTogetherWithTheirContentsRange = [115, 120]; //
      // style/script tags: letter "s".charCodeAt(0)=115
      // xml tag: "x".charCodeAt(0)=120
    } else {
      stripTogetherWithTheirContentsRange = opts.stripTogetherWithTheirContents
        .map(value => value.charAt(0)) // get first letters
        .reduce(
          (res, val) => {
            if (val.charCodeAt(0) > res[1]) {
              return [res[0], val.charCodeAt(0)]; // find the char index of the max char index out of all
            }
            if (val.charCodeAt(0) < res[0]) {
              return [val.charCodeAt(0), res[1]]; // find the char index of the min char index out of all
            }
            return res;
          },
          [
            opts.stripTogetherWithTheirContents[0].charCodeAt(0), // base is the 1st char of 1st el.
            opts.stripTogetherWithTheirContents[0].charCodeAt(0)
          ]
        );
      if (
        stripTogetherWithTheirContentsRange[0] ===
        stripTogetherWithTheirContentsRange[1]
      ) {
        stripTogetherWithTheirContentsRange =
          stripTogetherWithTheirContentsRange[0];
      }
    }
  }

  // At this moment, stripTogetherWithTheirContentsRange is found and it's an
  // array or a natural number.

  // We'll use it to perform checks in step 2.

  // ---------------------------------------------------------------------------
  // step 2.

  // we'll manage the TO-DELETE string slice ranges using this class:
  const rangesToDelete = new Slices({ limitToBeAddedWhitespace: true });
  // it comes from string-slices-array-push, see its API on GitHub or npm

  let state = "normal";
  // state can be of a one of three kinds: 1) 'normal'; 2) 'sensitive'; 3) 'delete'

  // When normal is active, we don't think we currently traversing potentially
  // to-be-deleted characters.

  // When sensitive is active, there is probability that we might need to deleted
  // everything from last opening bracket to next closing bracket. Sensitive stage
  // is never reduced to "normal". "Sensitive" stage becomes "Delete" stage if
  // certain "freak out" rules are satisfied.

  // When delete flag is active, we definitely want to delete everything form last
  // opening bracket to the next closing bracket. "Delete" state is reset after
  // deletion is performed and it then becomes "normal".

  let deleteFromIndex = null;

  let tagMightHaveStarted = false;
  let matchedRangeTag = {};
  let i;
  let len;

  let commentOn = false; // if true, delete everything from last deleteFromIndex
  // and while traversing, ignore the rest until "-->" is found (or EOF).

  // traverse the string indexes
  for (i = 0, len = str.length; i < len; i++) {

    // -----------------------------------------------------
    // catch the opening bracket, "<"
    if (!commentOn && str[i] === "<") {
      // * * *
      // * * *
      // * * *
      // * * *
      // the main flipping of a state
      if (str[i + 1] === "!" && str[i + 2] === "-" && str[i + 3] === "-") {
        deleteFromIndex = i;
        commentOn = true;
        i += 3;
        continue;
      } else if (
        (opts.ignoreTags.length === 0 ||
          !matchRight(str, i, opts.ignoreTags, {
            cb: tagName,
            trimCharsBeforeMatching: [" ", "\n", "\t", "\r", "/", "<"],
            i: true
          })) &&
        (matchedRangeTag.name ||
          (!matchedRangeTag.name && !tagMightHaveStarted))
      ) {
        if (existy(str[i + 1]) && str[i + 1].trim() === "") {
          state = "sensitive";
        } else {
          state = "delete";
        }
        deleteFromIndex = i;
      }

      if (!commentOn) {
        // * * *
        // * * *
        // * * *
        // * * *
        const tagMatchedOnTheRight = matchRight(
          str,
          i,
          opts.stripTogetherWithTheirContents,
          {
            cb: tagName,
            trimCharsBeforeMatching: [" ", "\n", "\t", "\r", "/", "<"],
            i: true
          }
        );
        if (opts.stripTogetherWithTheirContents && tagMatchedOnTheRight) {
          if (!matchedRangeTag.name) {
            matchedRangeTag.name = tagMatchedOnTheRight;
            matchedRangeTag.i = i;
          } else {
            deleteFromIndex = matchedRangeTag.i;
            state = "delete";
            matchedRangeTag = {};
          }
        }

        // * * *
        // * * *
        // * * *
        // * * *
        // we need to track tag's outermost boundaries separately from the
        // "state" because there might be consecutive brackets.
        if (!tagMightHaveStarted) {
          tagMightHaveStarted = true;
        }
      } // END of if (!commentOn)
      //
    }

    // -----------------------------------------------------
    // catch the closing bracket, ">"
    else if (str[i] === ">") {
      if (commentOn && str[i - 1] === "-" && str[i - 2] === "-") {
        commentOn = false;
        let deleteToIndex = i + 1;

        // Mind the whitespace.
        // Left side:
        for (let y = deleteFromIndex; y--; ) {
          if (str[y].trim() !== "") {
            deleteFromIndex = y + 1;
            break;
          }
        }
        // Right side:
        for (let y = i + 1; y < len; y++) {
          if (str[y].trim() !== "") {
            deleteToIndex = y;
            break;
          }
        }

        rangesToDelete.add(
          deleteFromIndex,
          deleteToIndex,
          str.slice(deleteFromIndex, deleteToIndex).includes("\n") ? "\n" : " "
        );
      }

      // reset the tagMightHaveStarted

      // we need to take care not to reset the tagMightHaveStarted when the
      // matchedRangeTag.name is set, meaning we are traversing in between
      // tags which should be deleted together with their content between the
      // tags.

      if (
        !matchedRangeTag.name &&
        tagMightHaveStarted &&
        !matchRight(str, i, ">", {
          trimCharsBeforeMatching: [" ", "\n", "\t", "\r", "/"]
        })
      ) {
        tagMightHaveStarted = false;
      }

      // PS. to see the slice visually, use string.slice() method:
      // to see content with brackets: str.slice(deleteFromIndex, i + 1)
      // to see it without brackets: str.slice(deleteFromIndex + 1, i)
      if (
        state === "delete" &&
        isNum(deleteFromIndex) &&
        deleteFromIndex < i &&
        !matchRight(str, i, ">", {
          trimCharsBeforeMatching: [" ", "\n", "\t", "\r", "/"]
        })
      ) {
        let deleteUpToIndex = i + 1;
        let insertThisInPlace = "";

        // Let's traverse the string to the left of deleteFromIndex and extend
        // to cover any whitespace.

        if (deleteFromIndex > 0) {
          for (let z = deleteFromIndex; z--; ) {
            if (str[z].trim() !== "") {
              // if it's not a whitespace
              deleteFromIndex = z + 1; // ...extend the to-be-deleted range
              break;
            } else if (z === 0) {
              // or beginning of the file reached...
              deleteFromIndex = 0; // ...extend the to-be-deleted range
              break;
            }
          }
        }

        // Let's traverse the string to the right of the current index and extend
        // to cover any whitespace.
        if (str[i + 1] !== undefined) {
          for (let z = i + 1; z < len; z++) {
            if (
              str[z].trim() !== "" || // if it's not a whitespace
              z === len - 1 // or end of file reached...
            ) {
              deleteUpToIndex = z; // ...extend the to-be-deleted range
              break;
            }
          }
        }

        // At this moment, we have the range [deleteFromIndex, deleteUpToIndex]

        // The only question left is, do we need to compensate for deleted
        // whitespace? There are quite few considerations to make before answering...

        if (
          deleteFromIndex !== 0 && // if deletion happens up to the beginning,
          // there's no need to add any whitespace to compensate.

          deleteUpToIndex !== len && // if deletion reached up to the end of
          // the string, also, there's no need to add any whitespace to compensate.

          !punctuation.includes(str[deleteUpToIndex]) // make sure the character that follows
          // the to-be-deleted range is not punctuation mark. We don't want
          // to add any spaces/linebreaks in front of punctuation marks.
        ) {
          insertThisInPlace = " ";
          const temp = str.slice(deleteFromIndex, deleteUpToIndex);
          if (temp.includes("\n") || temp.includes("\r")) {
            insertThisInPlace = "\n";
          }
        }

        if (
          str[deleteUpToIndex] !== undefined &&
          punctuation.includes(str[deleteUpToIndex])
        ) {
          insertThisInPlace = null;
        }
        rangesToDelete.add(deleteFromIndex, deleteUpToIndex, insertThisInPlace);
        // reset everything:
        state = "normal";
        deleteFromIndex = null;
        tagMightHaveStarted = false;
      } else if (state === "sensitive") {
        if (
          deleteFromIndex + 1 < i &&
          definitelyTagNames.concat(singleLetterTags).includes(
            trimChars(
              str
                .slice(deleteFromIndex + 1, i)
                .trim()
                .toLowerCase(),
              " /"
            )
          )
        ) {
          if (
            existy(str[deleteFromIndex - 1]) &&
            str[deleteFromIndex - 1].trim() !== "" &&
            existy(str[i + 1]) &&
            str[i + 1].trim() !== "" &&
            !punctuation.includes(str[i + 1])
          ) {
            rangesToDelete.add(deleteFromIndex, i + 1, " ");
          } else {
            rangesToDelete.add(deleteFromIndex, i + 1);
            deleteFromIndex = null;
          }
          state = "normal";
          deleteFromIndex = null;
          tagMightHaveStarted = false;
        }
      }
    }

    // -----------------------------------------------------
    // catch characters that are red flags what means now, more than likely, it's
    // an HTML now. Normal text does not contain "suspicious characters" (such
    // as equals sign).
    if (suspiciousList.includes(str[i]) && state === "sensitive") {
      state = "delete";
    }
  }
  if (rangesToDelete.current()) {
    return replaceSlicesArr(str, rangesToDelete.current()).trim();
  }
  return str;
}

export default stripHtml;

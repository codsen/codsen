'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var replaceSlicesArr = _interopDefault(require('string-replace-slices-array'));
var Slices = _interopDefault(require('string-slices-array-push'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var checkTypes = _interopDefault(require('check-types-mini'));
var ent = _interopDefault(require('ent'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function stripHtml(str, originalOpts) {
  // constants
  // ===========================================================================
  var isArr = Array.isArray;
  var definitelyTagNames = ["!doctype", "abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"];
  var singleLetterTags = ["a", "b", "i", "p", "q", "s", "u"];
  var punctuation = [".", ",", "!", "?", ";", ")", "\u2026", '"']; // \u2026 is &hellip; - ellipsis
  var stripTogetherWithTheirContentsDefaults = ["script", "style", "xml"];

  var rangesToDelete = new Slices({ limitToBeAddedWhitespace: true });

  // variables
  // ===========================================================================

  // records the info about the suspected tag:
  var tag = {};

  // records the beginning of the current whitespace chunk:
  var chunkOfWhitespaceStartsAt = null;

  // we'll gather opening tags from ranged-pairs here:
  var rangedOpeningTags = [];

  // functions
  // ===========================================================================

  function treatRangedTags(i) {
    if (opts.stripTogetherWithTheirContents.includes(tag.name)) {
      // it depends, is it opening or closing range tag:
      if (tag.slashPresent) {
        // closing tag.
        // filter and remove the found tag
        for (var y = rangedOpeningTags.length; y--;) {
          if (rangedOpeningTags[y].name === tag.name) {
            // we'll remove from opening tag's opening bracket to closing tag's
            // closing bracket because whitespace will be taken care of separately,
            // when tags themselves will be removed.
            // Basically, for each range tag there will be 3 removals:
            // opening tag, closing tag and all from opening to closing tag.
            // We keep removing opening and closing tags along whole range
            // because of few reasons: 1. cases of broken/dirty code, 2. keeping
            // the algorithm simpler, 3. opts that control whitespace removal
            // around tags.

            // 1. add range without caring about surrounding whitespace around
            // the range
            if (punctuation.includes(str[i])) {
              rangesToDelete.push(rangedOpeningTags[y].lastOpeningBracketAt, i, null // null will remove any spaces added so far. Opening and closing range tags might
              // have received spaces as separate entities, but those might not be necessary for range:
              // "text <script>deleteme</script>."
              );
            } else {
              rangesToDelete.push(rangedOpeningTags[y].lastOpeningBracketAt, i);
            }
            // 2. delete the reference to this range from rangedOpeningTags[]
            // because there might be more ranged tags of the same name or
            // different, overlapping or encompassing ranged tags with same
            // or different name.
            rangedOpeningTags.splice(y, 1);
            // 3. stop the loop
            break;
          }
        }
      } else {
        // opening tag.
        rangedOpeningTags.push(tag);
      }
    }
  }

  function calculateWhitespaceToInsert(str, currCharIdx, fromIdx, toIdx) {
    if (!punctuation.includes(str[currCharIdx - 1])) {
      return str.slice(fromIdx, toIdx).includes("\n") ? "\n" : " ";
    }
    return "";
  }

  // validation
  // ===========================================================================
  if (typeof str !== "string") {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: " + (typeof str === "undefined" ? "undefined" : _typeof(str)) + ", equal to:\n" + JSON.stringify(str, null, 4));
  }
  if (originalOpts !== undefined && originalOpts !== null && !isObj(originalOpts)) {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: " + (typeof originalOpts === "undefined" ? "undefined" : _typeof(originalOpts)) + ", equal to:\n" + JSON.stringify(originalOpts, null, 4));
  }

  // prep opts
  // ===========================================================================
  var defaults = {
    ignoreTags: [],
    stripOnlyTags: [],
    stripTogetherWithTheirContents: stripTogetherWithTheirContentsDefaults,
    keepHtmlCommentContents: false,
    deleteWhitespaceAroundTags: true,
    skipHtmlDecoding: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (!opts.stripTogetherWithTheirContents) {
    opts.stripTogetherWithTheirContents = [];
  } else if (typeof opts.stripTogetherWithTheirContents === "string" && opts.stripTogetherWithTheirContents.length > 0) {
    opts.stripTogetherWithTheirContents = [opts.stripTogetherWithTheirContents];
  }
  checkTypes(opts, defaults, {
    msg: "string-strip-html/stripHtml(): [THROW_ID_03*]",
    schema: {
      stripTogetherWithTheirContents: ["array", "null", "undefined"]
    }
  });
  if (!isArr(opts.stripTogetherWithTheirContents)) {
    // means either null or undefined
    opts.stripTogetherWithTheirContents = [];
  }

  var somethingCaught = {};
  if (opts.stripTogetherWithTheirContents && isArr(opts.stripTogetherWithTheirContents) && opts.stripTogetherWithTheirContents.length > 0 && !opts.stripTogetherWithTheirContents.every(function (el, i) {
    if (!(typeof el === "string")) {
      somethingCaught.el = el;
      somethingCaught.i = i;
      return false;
    }
    return true;
  })) {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_04] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index " + somethingCaught.i + " has a value " + somethingCaught.el + " which is not string but " + _typeof(somethingCaught.el) + ".");
  }

  // step 0.
  // ===========================================================================
  // End sooner if it's an empty or empty-ish string:

  if (str === "" || str.trim() === "") {
    return str;
  }

  if (!opts.skipHtmlDecoding) {
    while (str !== ent.decode(str)) {
      str = ent.decode(str);
    }
  }

  // step 1.
  // ===========================================================================

  for (var i = 0, len = str.length; i < len; i++) {

    // catch closing bracket
    // -------------------------------------------------------------------------
    if (str[i] === ">") {
      if (tag.lastOpeningBracketAt !== undefined) {
        tag.lastClosingBracketAt = i;
      }
    }

    // catch the ending of the tag
    // -------------------------------------------------------------------------
    // the tag is "released" into "replaceSlicesArr":

    if (tag.lastOpeningBracketAt !== undefined) {
      if (tag.lastClosingBracketAt === undefined) {
        if (tag.lastOpeningBracketAt < i && str[i] !== "<" && ( // to prevent cases like "text <<<<<< text"
        str[i + 1] === undefined || str[i + 1] === "<") && tag.onlyPlausible) {
          // find out the tag name earlier than dedicated tag name ending catching section:
          if (str[i + 1] === undefined) {
            var tagName = str.slice(tag.nameStarts, i + 1);
            // if the tag is only plausible (there's space after opening bracket) and it's not among
            // recognised tags, leave it as it is:
            if (!definitelyTagNames.concat(singleLetterTags).includes(tagName)) {
              continue;
            }
          } // else {
          //   // case 1. closing bracket hasn't been encountered yet but EOL is reached
          //   // for example "<script" or "<script  "
          //   console.log(
          //     `384 \u001b[${33}m${`SUBMIT RANGE #1: [${
          //       tag.leftOuterWhitespace
          //     }, ${i + 1}, "${calculateWhitespaceToInsert(
          //       str,
          //       i,
          //       tag.leftOuterWhitespace,
          //       i + 1
          //     )}"]`}\u001b[${39}m`
          //   );
          //   rangesToDelete.push(
          //     tag.leftOuterWhitespace,
          //     i + 1,
          //     calculateWhitespaceToInsert(
          //       str,
          //       i,
          //       tag.leftOuterWhitespace,
          //       i + 1
          //     )
          //   );
          //   // also,
          //   treatRangedTags(i);
          // }
        }
      } else if (i > tag.lastClosingBracketAt && str[i].trim().length !== 0 || str[i + 1] === undefined) {
        // tag.lastClosingBracketAt !== undefined

        // case 2. closing bracket HAS BEEN met
        // we'll look for a non-whitespace character and delete up to it
        // BUT, we'll wipe the tag object only if that non-whitespace character
        // is not a ">". This way we'll catch and delete sequences of closing brackets.

        // part 1.

        var endingRangeIndex = tag.lastClosingBracketAt === i ? i + 1 : i;

        rangesToDelete.push(tag.leftOuterWhitespace, endingRangeIndex, calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, endingRangeIndex));
        // also,
        treatRangedTags(i);

        // part 2.
        if (str[i] !== ">") {
          tag = {};
        }
      }
    }

    // catch opening bracket
    // -------------------------------------------------------------------------
    if (str[i] === "<") {
      if (str[i + 1] === ">") {
        // cater cases like: "<><><>"
        continue;
      } else if (tag.lastOpeningBracketAt === undefined && !tag.quotes) {
        tag.lastOpeningBracketAt = i;
        tag.slashPresent = false;
        tag.leftOuterWhitespace = chunkOfWhitespaceStartsAt === null ? i : chunkOfWhitespaceStartsAt;
      }
    }

    // catch slash
    // -------------------------------------------------------------------------
    if (str[i] === "/" && !(tag.quotes && tag.quotes.value) && tag.lastOpeningBracketAt !== undefined && tag.lastClosingBracketAt === undefined) {
      tag.slashPresent = true;
    }

    // catch double or single quotes
    // -------------------------------------------------------------------------
    if (str[i] === '"' || str[i] === "'") {
      if (tag.quotes && tag.quotes.value && tag.quotes.value === str[i]) {
        tag.quotes = undefined;
      } else if (!tag.quotes) {
        tag.quotes = {};
        tag.quotes.value = str[i];
        tag.quotes.start = i;
      }
    }

    // catch whitespace
    // -------------------------------------------------------------------------
    if (str[i].trim() === "") {
      // 1. catch chunk boundaries:
      if (chunkOfWhitespaceStartsAt === null) {
        chunkOfWhitespaceStartsAt = i;
      }
    } else if (chunkOfWhitespaceStartsAt !== null) {
      chunkOfWhitespaceStartsAt = null;
    }

    // catch ending of the tag name:
    // -------------------------------------------------------------------------
    if (tag.nameStarts !== undefined && tag.nameEnds === undefined && (str[i].trim().length === 0 || str[i] === "/" || str[i] === "<" || str[i] === ">" || str[i].trim().length !== 0 && str[i + 1] === undefined)) {
      // 1. mark the name ending
      tag.nameEnds = i;
      // 2. extract the full name string
      tag.name = str.slice(tag.nameStarts, tag.nameEnds + (str[i + 1] === undefined ? 1 : 0));
      // 3. if the input string ends here and it's not a dodgy tag, submit it for deletion:
      if (!tag.onlyPlausible && str[i + 1] === undefined) {
        rangesToDelete.push(tag.leftOuterWhitespace, i + 1, calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, i + 1));
        // also,
        treatRangedTags(i);
      }
    }

    // catch character that follows opening bracket:
    // -------------------------------------------------------------------------
    if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < i && str[i] !== "/" // there can be closing slashes in various places, legit and not
    ) {
        // 1. identify, is it definite or just plausible tag
        if (tag.onlyPlausible === undefined) {
          if (str[i].trim().length === 0 || str[i] === "<") {
            tag.onlyPlausible = true;
          } else {
            tag.onlyPlausible = false;
          }
        }
        // 2. catch the beginning of the tag name. Consider custom HTML tag names
        // and also known (X)HTML tags:
        if (str[i].trim().length !== 0 && tag.nameStarts === undefined && str[i] !== "<" && str[i] !== "/" && str[i] !== ">") {
          tag.nameStarts = i;
        }
      }

    // log all
    // -------------------------------------------------------------------------
    // console.log(
    //   `\u001b[${32}m${` - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}\u001b[${39}m`
    // );

    // console.log(
    //   `${`\u001b[${35}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m`} = ${chunkOfWhitespaceStartsAt}`
    // );
  }

  if (rangesToDelete.current()) {
    return replaceSlicesArr(str, rangesToDelete.current()).trim();
  }
  return str.trim();
}

module.exports = stripHtml;

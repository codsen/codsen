/**
 * string-strip-html
 * Strips HTML tags from strings. No parser, accepts mixed sources.
 * Version: 8.2.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-strip-html/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var isObj = require('lodash.isplainobject');
var trim = require('lodash.trim');
var without = require('lodash.without');
var htmlEntities = require('html-entities');
var rangesApply = require('ranges-apply');
var rangesPush = require('ranges-push');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var trim__default = /*#__PURE__*/_interopDefaultLegacy(trim);
var without__default = /*#__PURE__*/_interopDefaultLegacy(without);

/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

/* istanbul ignore next */
function characterSuitableForNames(char) {
  return /[-_A-Za-z0-9]/.test(char);
}
/* istanbul ignore next */


function prepHopefullyAnArray(something, name) {
  if (!something) {
    return [];
  }

  if (Array.isArray(something)) {
    return something.filter(function (val) {
      return typeof val === "string" && val.trim();
    });
  }

  if (typeof something === "string") {
    return something.trim() ? [something] : [];
  }

  throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_03] " + name + " must be array containing zero or more strings or something falsey. Currently it's equal to: " + something + ", that a type of " + typeof something + ".");
}
/* istanbul ignore next */


function xBeforeYOnTheRight(str, startingIdx, x, y) {
  for (var i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      return true;
    }

    if (str.startsWith(y, i)) {
      return false;
    }
  }

  return false;
} //
// precaution against JSP comparison
// kl <c:when test="${!empty ab.cd && ab.cd > 0.00}"> mn
//                                          ^
//                                        we're here, it's false ending
//

/* istanbul ignore next */


function notWithinAttrQuotes(tag, str, i) {
  return !tag || !tag.quotes || !xBeforeYOnTheRight(str, i + 1, tag.quotes.value, ">");
}

var version = "8.2.0";

var version$1 = version;
var defaults = {
  ignoreTags: [],
  onlyStripTags: [],
  stripTogetherWithTheirContents: ["script", "style", "xml"],
  skipHtmlDecoding: false,
  trimOnlySpaces: false,
  dumpLinkHrefsNearby: {
    enabled: false,
    putOnNewLine: false,
    wrapHeads: "",
    wrapTails: ""
  },
  cb: null
};
/**
 * Strips HTML tags from strings. No parser, accepts mixed sources.
 */

function stripHtml(str, originalOpts) {
  // const
  // ===========================================================================
  var start = Date.now();
  var definitelyTagNames = new Set(["!doctype", "abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"]);
  var singleLetterTags = new Set(["a", "b", "i", "p", "q", "s", "u"]);
  var punctuation = new Set([".", ",", "?", ";", ")", "\u2026", '"', "\xBB"]); // \u00BB is &raquo; - guillemet - right angled quote
  // \u2026 is &hellip; - ellipsis
  // we'll gather opening tags from ranged-pairs here:

  var rangedOpeningTags = []; // we'll put tag locations here

  var allTagLocations = [];
  var filteredTagLocations = []; // variables
  // ===========================================================================
  // records the info about the suspected tag:

  var tag = {};

  function resetTag() {
    tag = {
      attributes: []
    };
  }

  resetTag(); // records the beginning of the current whitespace chunk:

  var chunkOfWhitespaceStartsAt = null; // records the beginning of the current chunk of spaces (strictly spaces-only):

  var chunkOfSpacesStartsAt = null; // temporary variable to assemble the attribute pieces:

  var attrObj = {}; // marker to store captured href, used in opts.dumpLinkHrefsNearby.enabled

  var hrefDump = {
    tagName: "",
    hrefValue: "",
    openingTagEnds: undefined
  }; // used to insert extra things when pushing into ranges array

  var stringToInsertAfter = ""; // state flag

  var hrefInsertionActive = false; // marker to keep a note where does the whitespace chunk that follows closing bracket end.
  // It's necessary for opts.trimOnlySpaces when there's closing bracket, whitespace, non-space
  // whitespace character ("\n", "\t" etc), whitspace, end-of-file. Trim will kick in and will
  // try to trim up until the EOF, be we'll have to pull the end of trim back, back to the first
  // character of aforementioned non-space whitespace character sequence.
  // This variable will tell exactly where it is located.

  var spacesChunkWhichFollowsTheClosingBracketEndsAt = null; // functions
  // ===========================================================================

  function existy(x) {
    return x != null;
  }

  function isStr(something) {
    return typeof something === "string";
  }

  function treatRangedTags(i, opts, rangesToDelete) {

    if (Array.isArray(opts.stripTogetherWithTheirContents) && (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*"))) {
      // it depends, is it opening or closing range tag:
      // We could try to distinguish opening from closing tags by presence of
      // slash, but that would be a liability for dirty code cases where clash
      // is missing. Better, instead, just see if an entry for that tag name
      // already exists in the rangesToDelete[].

      if (Array.isArray(rangedOpeningTags) && rangedOpeningTags.some(function (obj) {
        return obj.name === tag.name && obj.lastClosingBracketAt < i;
      })) {
        // if (tag.slashPresent) { // closing tag.
        // filter and remove the found tag

        var _loop = function _loop(y) {
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
            // the range // also, tend filteredTagLocations in the output - tags which are to be
            // deleted with contents should be reported as one large range in
            // filteredTagLocations - from opening to closing - not two ranges
            /* istanbul ignore else */

            if (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*")) {
              filteredTagLocations = filteredTagLocations.filter(function (_ref) {
                var from = _ref[0],
                    upto = _ref[1];
                return (from < rangedOpeningTags[y].lastOpeningBracketAt || from >= i + 1) && (upto <= rangedOpeningTags[y].lastOpeningBracketAt || upto > i + 1);
              });
            }

            var endingIdx = i + 1;

            if (tag.lastClosingBracketAt) {
              endingIdx = tag.lastClosingBracketAt + 1;
            }
            filteredTagLocations.push([rangedOpeningTags[y].lastOpeningBracketAt, endingIdx]);
            /* istanbul ignore else */

            if (punctuation.has(str[i]) && opts.cb) {
              opts.cb({
                tag: tag,
                deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                deleteTo: i + 1,
                insert: null,
                rangesArr: rangesToDelete,
                proposedReturn: [rangedOpeningTags[y].lastOpeningBracketAt, i, null]
              }); // null will remove any spaces added so far. Opening and closing range tags might
              // have received spaces as separate entities, but those might not be necessary for range:
              // "text <script>deleteme</script>."
            } else if (opts.cb) {
              opts.cb({
                tag: tag,
                deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                deleteTo: i,
                insert: "",
                rangesArr: rangesToDelete,
                proposedReturn: [rangedOpeningTags[y].lastOpeningBracketAt, i, ""]
              });
            } // 2. delete the reference to this range from rangedOpeningTags[]
            // because there might be more ranged tags of the same name or
            // different, overlapping or encompassing ranged tags with same
            // or different name.


            rangedOpeningTags.splice(y, 1); // 3. stop the loop

            return "break";
          }
        };

        for (var y = rangedOpeningTags.length; y--;) {
          var _ret = _loop(y);

          if (_ret === "break") break;
        }
      } else {
        // opening tag.
        rangedOpeningTags.push(tag);
      }
    }
  }

  function calculateWhitespaceToInsert(str2, // whole string
  currCharIdx, // current index
  fromIdx, // leftmost whitespace edge around tag
  toIdx, // rightmost whitespace edge around tag
  lastOpeningBracketAt, // tag actually starts here (<)
  lastClosingBracketAt // tag actually ends here (>)
  ) {
    var strToEvaluateForLineBreaks = "";

    if (Number.isInteger(fromIdx) && fromIdx < lastOpeningBracketAt) {
      strToEvaluateForLineBreaks += str2.slice(fromIdx, lastOpeningBracketAt);
    }

    if (Number.isInteger(toIdx) && toIdx > lastClosingBracketAt + 1) {
      // limit whitespace that follows the tag, stop at linebreak. That's to make
      // the algorithm composable - we include linebreaks in front but not after.
      var temp = str2.slice(lastClosingBracketAt + 1, toIdx);

      if (temp.includes("\n") && isOpeningAt(toIdx, str2)) {
        strToEvaluateForLineBreaks += " ";
      } else {
        strToEvaluateForLineBreaks += temp;
      }
    }

    if (!punctuation.has(str2[currCharIdx]) && str2[currCharIdx] !== "!") {
      var foundLineBreaks = strToEvaluateForLineBreaks.match(/\n/g);

      if (Array.isArray(foundLineBreaks) && foundLineBreaks.length) {
        if (foundLineBreaks.length === 1) {
          return "\n";
        }

        if (foundLineBreaks.length === 2) {
          return "\n\n";
        } // return three line breaks maximum


        return "\n\n\n";
      } // default spacer - a single space


      return " ";
    } // default case: space


    return "";
  }

  function calculateHrefToBeInserted(opts) {
    if (opts.dumpLinkHrefsNearby.enabled && hrefDump.tagName && hrefDump.tagName === tag.name && tag.lastOpeningBracketAt && (hrefDump.openingTagEnds && tag.lastOpeningBracketAt > hrefDump.openingTagEnds || !hrefDump.openingTagEnds)) {
      hrefInsertionActive = true;
    }

    if (hrefInsertionActive) {
      var lineBreaks = opts.dumpLinkHrefsNearby.putOnNewLine ? "\n\n" : "";
      stringToInsertAfter = "" + lineBreaks + hrefDump.hrefValue + lineBreaks;
    }
  }

  function isOpeningAt(i, customStr) {
    if (customStr) {
      return customStr[i] === "<" && customStr[i + 1] !== "%";
    }

    return str[i] === "<" && str[i + 1] !== "%";
  }

  function isClosingAt(i) {
    return str[i] === ">" && str[i - 1] !== "%";
  } // validation
  // ===========================================================================


  if (typeof str !== "string") {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: " + (typeof str).toLowerCase() + ", equal to:\n" + JSON.stringify(str, null, 4));
  }

  if (originalOpts && !isObj__default['default'](originalOpts)) {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: " + (typeof originalOpts).toLowerCase() + ", equal to:\n" + JSON.stringify(originalOpts, null, 4));
  } // eslint-disable-next-line consistent-return


  function resetHrefMarkers() {
    // reset the hrefDump
    if (hrefInsertionActive) {
      hrefDump = {
        tagName: "",
        hrefValue: "",
        openingTagEnds: undefined
      };
      hrefInsertionActive = false;
    }
  } // prep opts
  // ===========================================================================


  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);

  if (Object.prototype.hasOwnProperty.call(opts, "returnRangesOnly")) {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_03] opts.returnRangesOnly has been removed from the API since v.5 release.");
  } // filter non-string or whitespace entries from the following arrays or turn
  // them into arrays:


  opts.ignoreTags = prepHopefullyAnArray(opts.ignoreTags, "opts.ignoreTags");
  opts.onlyStripTags = prepHopefullyAnArray(opts.onlyStripTags, "opts.onlyStripTags"); // let's define the onlyStripTagsMode. Since opts.onlyStripTags can cancel
  // out the entries in opts.onlyStripTags, it can be empty but this mode has
  // to be switched on:

  var onlyStripTagsMode = !!opts.onlyStripTags.length; // if both opts.onlyStripTags and opts.ignoreTags are set, latter is respected,
  // we simply exclude ignored tags from the opts.onlyStripTags.

  if (opts.onlyStripTags.length && opts.ignoreTags.length) {
    opts.onlyStripTags = without__default['default'].apply(void 0, [opts.onlyStripTags].concat(opts.ignoreTags));
  }

  if (!isObj__default['default'](opts.dumpLinkHrefsNearby)) {
    opts.dumpLinkHrefsNearby = _objectSpread__default['default']({}, defaults.dumpLinkHrefsNearby);
  } // Object.assign doesn't deep merge, so we take care of opts.dumpLinkHrefsNearby:


  opts.dumpLinkHrefsNearby = defaults.dumpLinkHrefsNearby;

  if (originalOpts && Object.prototype.hasOwnProperty.call(originalOpts, "dumpLinkHrefsNearby") && existy(originalOpts.dumpLinkHrefsNearby)) {
    /* istanbul ignore else */
    if (isObj__default['default'](originalOpts.dumpLinkHrefsNearby)) {
      opts.dumpLinkHrefsNearby = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults.dumpLinkHrefsNearby), originalOpts.dumpLinkHrefsNearby);
    } else if (originalOpts.dumpLinkHrefsNearby) {
      // checking to omit value as number zero
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_04] Optional Options Object's key dumpLinkHrefsNearby was set to " + typeof originalOpts.dumpLinkHrefsNearby + ", equal to " + JSON.stringify(originalOpts.dumpLinkHrefsNearby, null, 4) + ". The only allowed value is a plain object. See the API reference.");
    }
  }

  if (!opts.stripTogetherWithTheirContents) {
    opts.stripTogetherWithTheirContents = [];
  } else if (typeof opts.stripTogetherWithTheirContents === "string" && opts.stripTogetherWithTheirContents.length) {
    opts.stripTogetherWithTheirContents = [opts.stripTogetherWithTheirContents];
  }

  var somethingCaught = {};

  if (opts.stripTogetherWithTheirContents && Array.isArray(opts.stripTogetherWithTheirContents) && opts.stripTogetherWithTheirContents.length && !opts.stripTogetherWithTheirContents.every(function (el, i) {
    if (!(typeof el === "string")) {
      somethingCaught.el = el;
      somethingCaught.i = i;
      return false;
    }

    return true;
  })) {
    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_05] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index " + somethingCaught.i + " has a value " + somethingCaught.el + " which is not string but " + (typeof somethingCaught.el).toLowerCase() + ".");
  } // prep the opts.cb

  if (!opts.cb) {
    opts.cb = function (_ref2) {
      var rangesArr = _ref2.rangesArr,
          proposedReturn = _ref2.proposedReturn;

      if (proposedReturn) {
        rangesArr.push.apply(rangesArr, proposedReturn);
      }
    };
  } // if the links have to be on a new line, we need to increase the allowance for line breaks
  // in Ranges class, it's the ranges-push API setting opts.limitLinebreaksCount
  // see https://www.npmjs.com/package/ranges-push#optional-options-object

  var rangesToDelete = new rangesPush.Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2
  }); // TODO: it's chummy - ranges will be unreliable if initial str has changed
  // use ranges-ent-decode

  if (!opts.skipHtmlDecoding) {
    while (str !== htmlEntities.decode(str, {
      scope: "strict"
    })) {
      // eslint-disable-next-line no-param-reassign
      str = htmlEntities.decode(str, {
        scope: "strict"
      });
    }
  } // step 1.
  // ===========================================================================


  var _loop2 = function _loop2(_i, len) { // catch the first ending of the spaces chunk that follows the closing bracket.
    // -------------------------------------------------------------------------
    // There can be no space after bracket, in that case, the result will be that character that
    // follows the closing bracket.
    // There can be bunch of spaces that end with EOF. In that case it's fine, this variable will
    // be null.

    if (Object.keys(tag).length > 1 && tag.lastClosingBracketAt && tag.lastClosingBracketAt < _i && str[_i] !== " " && spacesChunkWhichFollowsTheClosingBracketEndsAt === null) {
      spacesChunkWhichFollowsTheClosingBracketEndsAt = _i;
    } // catch the closing bracket of dirty tags with missing opening brackets
    // -------------------------------------------------------------------------


    if (isClosingAt(_i)) { // tend cases where opening bracket of a tag is missing:

      if ((!tag || Object.keys(tag).length < 2) && _i > 1) { // traverse backwards either until start of string or ">" is found

        for (var y = _i; y--;) {

          if (str[y - 1] === undefined || isClosingAt(y)) {
            var _ret3 = function () {
              var startingPoint = str[y - 1] === undefined ? y : y + 1;
              var culprit = str.slice(startingPoint, _i + 1); // Check if the culprit starts with a tag that's more likely a tag
              // name (like "body" or "article"). Single-letter tag names are excluded
              // because they can be plausible, ie. in math texts and so on.
              // Nobody uses puts comparison signs between words like: "article > ",
              // but single letter names can be plausible: "a > b" in math.

              if (str !== "<" + trim__default['default'](culprit.trim(), "/>") + ">" && // recursion prevention
              [].concat(definitelyTagNames).some(function (val) {
                return trim__default['default'](culprit.trim().split(/\s+/).filter(function (val2) {
                  return val2.trim();
                }).filter(function (_val3, i3) {
                  return i3 === 0;
                }), "/>").toLowerCase() === val;
              }) && stripHtml("<" + culprit.trim() + ">", opts).result === "") {
                /* istanbul ignore else */
                if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                  allTagLocations.push([startingPoint, _i + 1]);
                }
                /* istanbul ignore else */


                if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                  filteredTagLocations.push([startingPoint, _i + 1]);
                }

                var whiteSpaceCompensation = calculateWhitespaceToInsert(str, _i, startingPoint, _i + 1, startingPoint, _i + 1);
                var deleteUpTo = _i + 1;

                if (str[deleteUpTo] && !str[deleteUpTo].trim()) {
                  for (var z = deleteUpTo; z < len; z++) {
                    if (str[z].trim()) {
                      deleteUpTo = z;
                      break;
                    }
                  }
                }
                opts.cb({
                  tag: tag,
                  deleteFrom: startingPoint,
                  deleteTo: deleteUpTo,
                  insert: whiteSpaceCompensation,
                  rangesArr: rangesToDelete,
                  proposedReturn: [startingPoint, deleteUpTo, whiteSpaceCompensation]
                });
              }

              return "break";
            }();

            if (_ret3 === "break") break;
          }
        }
      }
    } // catch slash
    // -------------------------------------------------------------------------


    if (str[_i] === "/" && !(tag.quotes && tag.quotes.value) && Number.isInteger(tag.lastOpeningBracketAt) && !Number.isInteger(tag.lastClosingBracketAt)) {
      tag.slashPresent = _i;
    } // catch double or single quotes
    // -------------------------------------------------------------------------


    if (str[_i] === '"' || str[_i] === "'") {
      if (tag.nameStarts && tag.quotes && tag.quotes.value && tag.quotes.value === str[_i]) {
        // 1. finish assembling the "attrObj{}"
        attrObj.valueEnds = _i;
        attrObj.value = str.slice(attrObj.valueStarts, _i);
        tag.attributes.push(attrObj); // reset:

        attrObj = {}; // 2. finally, delete the quotes marker, we don't need it any more

        tag.quotes = undefined; // 3. if opts.dumpLinkHrefsNearby.enabled is on, catch href

        var hrefVal;

        if (opts.dumpLinkHrefsNearby.enabled && // eslint-disable-next-line
        tag.attributes.some(function (obj) {
          if (obj.name && obj.name.toLowerCase() === "href") {
            hrefVal = "" + (opts.dumpLinkHrefsNearby.wrapHeads || "") + obj.value + (opts.dumpLinkHrefsNearby.wrapTails || "");
            i = _i;
            return true;
          }
        })) {
          hrefDump = {
            tagName: tag.name,
            hrefValue: hrefVal,
            openingTagEnds: undefined
          };
        }
      } else if (!tag.quotes && tag.nameStarts) {
        // 1. if it's opening marker, record the type and location of quotes
        tag.quotes = {};
        tag.quotes.value = str[_i];
        tag.quotes.start = _i; // 2. start assembling the attribute object which we'll dump into tag.attributes[] array:

        if (attrObj.nameStarts && attrObj.nameEnds && attrObj.nameEnds < _i && attrObj.nameStarts < _i && !attrObj.valueStarts) {
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      }
    } // catch the ending of the tag name:
    // -------------------------------------------------------------------------


    if (tag.nameStarts !== undefined && tag.nameEnds === undefined && (!str[_i].trim() || !characterSuitableForNames(str[_i]))) {
      // 1. mark the name ending
      tag.nameEnds = _i; // 2. extract the full name string

      tag.name = str.slice(tag.nameStarts, tag.nameEnds + (
      /* istanbul ignore next */
      !isClosingAt(_i) && str[_i] !== "/" && str[_i + 1] === undefined ? 1 : 0));

      if ( // if we caught "----" from "<----" or "---->", bail:
      str[tag.nameStarts - 1] !== "!" && // protection against <!--
      !tag.name.replace(/-/g, "").length || // if tag name starts with a number character
      /^\d+$/.test(tag.name[0])) {
        tag = {};
        i = _i;
        return "continue";
      }

      if (isOpeningAt(_i)) {
        // process it because we need to tackle this new tag
        calculateHrefToBeInserted(opts); // calculateWhitespaceToInsert() API:
        // str, // whole string
        // currCharIdx, // current index
        // fromIdx, // leftmost whitespace edge around tag
        // toIdx, // rightmost whitespace edge around tag
        // lastOpeningBracketAt, // tag actually starts here (<)
        // lastClosingBracketAt // tag actually ends here (>)

        var whiteSpaceCompensation = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, _i, tag.lastOpeningBracketAt, _i); // only on pair tags, exclude the opening counterpart and closing
        // counterpart if whole pair is to be deleted

        if (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*")) {
          /* istanbul ignore next */

          filteredTagLocations = filteredTagLocations.filter(function (_ref3) {
            var from = _ref3[0],
                upto = _ref3[1];
            return !(from === tag.leftOuterWhitespace && upto === _i);
          });
        } // console.log(
        //   `1011 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
        //     tag.leftOuterWhitespace
        //   }, ${i}] to filteredTagLocations`
        // );
        // filteredTagLocations.push([tag.leftOuterWhitespace, i]);


        opts.cb({
          tag: tag,
          deleteFrom: tag.leftOuterWhitespace,
          deleteTo: _i,
          insert: "" + whiteSpaceCompensation + stringToInsertAfter + whiteSpaceCompensation,
          rangesArr: rangesToDelete,
          proposedReturn: [tag.leftOuterWhitespace, _i, "" + whiteSpaceCompensation + stringToInsertAfter + whiteSpaceCompensation]
        });
        resetHrefMarkers(); // also,

        treatRangedTags(_i, opts, rangesToDelete);
      }
    } // catch beginning of an attribute value
    // -------------------------------------------------------------------------


    if (tag.quotes && tag.quotes.start && tag.quotes.start < _i && !tag.quotes.end && attrObj.nameEnds && attrObj.equalsAt && !attrObj.valueStarts) {
      attrObj.valueStarts = _i;
    } // catch rare cases when attributes name has some space after it, before equals
    // -------------------------------------------------------------------------


    if (!tag.quotes && attrObj.nameEnds && str[_i] === "=" && !attrObj.valueStarts && !attrObj.equalsAt) {
      attrObj.equalsAt = _i;
    } // catch the ending of the whole attribute
    // -------------------------------------------------------------------------
    // for example, <a b c> this "c" ends "b" because it's not "equals" sign.
    // We even anticipate for cases where whitespace anywhere between attribute parts:
    // < article class = " something " / >


    if (!tag.quotes && attrObj.nameStarts && attrObj.nameEnds && !attrObj.valueStarts && str[_i].trim() && str[_i] !== "=") {
      // if (!tag.attributes) {
      //   tag.attributes = [];
      // }
      tag.attributes.push(attrObj);
      attrObj = {};
    } // catch the ending of an attribute's name
    // -------------------------------------------------------------------------


    if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {

      if (!str[_i].trim()) {
        attrObj.nameEnds = _i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
      } else if (str[_i] === "=") {
        /* istanbul ignore else */

        if (!attrObj.equalsAt) {
          attrObj.nameEnds = _i;
          attrObj.equalsAt = _i;
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      } else if (str[_i] === "/" || isClosingAt(_i)) {
        attrObj.nameEnds = _i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds); // if (!tag.attributes) {
        //   tag.attributes = [];
        // }

        tag.attributes.push(attrObj);
        attrObj = {};
      } else if (isOpeningAt(_i)) { // TODO - address both cases of onlyPlausible

        attrObj.nameEnds = _i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds); // if (!tag.attributes) {
        //   tag.attributes = [];
        // }

        tag.attributes.push(attrObj);
        attrObj = {};
      }
    } // catch the beginning of an attribute's name
    // -------------------------------------------------------------------------


    if (!tag.quotes && tag.nameEnds < _i && !str[_i - 1].trim() && str[_i].trim() && !"<>/!".includes(str[_i]) && !attrObj.nameStarts && !tag.lastClosingBracketAt) {
      attrObj.nameStarts = _i;
    } // catch "< /" - turn off "onlyPlausible"
    // -------------------------------------------------------------------------


    if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < _i && str[_i] === "/" && tag.onlyPlausible) {
      tag.onlyPlausible = false;
    } // catch character that follows an opening bracket:
    // -------------------------------------------------------------------------


    if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < _i && str[_i] !== "/" // there can be closing slashes in various places, legit and not
    ) {
        // 1. identify, is it definite or just plausible tag
        if (tag.onlyPlausible === undefined) {
          if ((!str[_i].trim() || isOpeningAt(_i)) && !tag.slashPresent) {
            tag.onlyPlausible = true;
          } else {
            tag.onlyPlausible = false;
          }
        } // 2. catch the beginning of the tag name. Consider custom HTML tag names
        // and also known (X)HTML tags:


        if (str[_i].trim() && tag.nameStarts === undefined && !isOpeningAt(_i) && str[_i] !== "/" && !isClosingAt(_i) && str[_i] !== "!") {
          tag.nameStarts = _i;
          tag.nameContainsLetters = false;
        }
      } // Catch letters in the tag name. Necessary to filter out false positives like "<------"


    if (tag.nameStarts && !tag.quotes && str[_i].toLowerCase() !== str[_i].toUpperCase()) {
      tag.nameContainsLetters = true;
    } // catch closing bracket
    // -------------------------------------------------------------------------


    if ( // it's closing bracket
    isClosingAt(_i) && //
    // precaution against JSP comparison
    // kl <c:when test="${!empty ab.cd && ab.cd > 0.00}"> mn
    //                                          ^
    //                                        we're here, it's false ending
    //
    notWithinAttrQuotes(tag, str, _i)) {
      var itIsClosing = true;

      if (itIsClosing && tag.lastOpeningBracketAt !== undefined) {
        // 1. mark the index
        tag.lastClosingBracketAt = _i; // 2. reset the spacesChunkWhichFollowsTheClosingBracketEndsAt

        spacesChunkWhichFollowsTheClosingBracketEndsAt = null; // 3. push attrObj into tag.attributes[]

        if (Object.keys(attrObj).length) { // if (!tag.attributes) {
          //   tag.attributes = [];
          // }

          tag.attributes.push(attrObj);
          attrObj = {};
        } // 4. if opts.dumpLinkHrefsNearby.enabled is on and we just recorded an href,


        if (opts.dumpLinkHrefsNearby.enabled && hrefDump.tagName && !hrefDump.openingTagEnds) {
          // finish assembling the hrefDump{}
          hrefDump.openingTagEnds = _i; // or tag.lastClosingBracketAt, same
        }
      }
    } // catch the ending of the tag
    // -------------------------------------------------------------------------
    // the tag is "released" into "rApply":


    if (tag.lastOpeningBracketAt !== undefined) {

      if (tag.lastClosingBracketAt === undefined) {

        if (tag.lastOpeningBracketAt < _i && !isOpeningAt(_i) && ( // to prevent cases like "text <<<<<< text"
        str[_i + 1] === undefined || isOpeningAt(_i + 1)) && tag.nameContainsLetters) { // find out the tag name earlier than dedicated tag name ending catching section:
          // if (str[i + 1] === undefined) {

          tag.name = str.slice(tag.nameStarts, tag.nameEnds ? tag.nameEnds : _i + 1).toLowerCase(); // submit tag to allTagLocations

          /* istanbul ignore else */

          if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
            allTagLocations.push([tag.lastOpeningBracketAt, _i + 1]);
          }

          if ( // if it's an ignored tag
          opts.ignoreTags.includes(tag.name) || // or just plausible and unrecognised
          tag.onlyPlausible && !definitelyTagNames.has(tag.name)) {
            tag = {};
            attrObj = {};
            i = _i;
            return "continue";
          } // if the tag is only plausible (there's space after opening bracket) and it's not among
          // recognised tags, leave it as it is:

          if ((definitelyTagNames.has(tag.name) || singleLetterTags.has(tag.name)) && (tag.onlyPlausible === false || tag.onlyPlausible === true && tag.attributes.length) || str[_i + 1] === undefined) {
            calculateHrefToBeInserted(opts);

            var _whiteSpaceCompensation = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, _i + 1, tag.lastOpeningBracketAt, tag.lastClosingBracketAt);
            opts.cb({
              tag: tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: _i + 1,
              insert: "" + _whiteSpaceCompensation + stringToInsertAfter + _whiteSpaceCompensation,
              rangesArr: rangesToDelete,
              proposedReturn: [tag.leftOuterWhitespace, _i + 1, "" + _whiteSpaceCompensation + stringToInsertAfter + _whiteSpaceCompensation]
            });
            resetHrefMarkers(); // also,

            treatRangedTags(_i, opts, rangesToDelete);
          }
          /* istanbul ignore else */

          if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt && filteredTagLocations[filteredTagLocations.length - 1][1] !== _i + 1) { // filter out opening/closing tag pair because whole chunk
            // from opening's opening to closing's closing will be pushed

            if (opts.stripTogetherWithTheirContents.includes(tag.name) || opts.stripTogetherWithTheirContents.includes("*")) { // get the last opening counterpart of the pair
              // iterate rangedOpeningTags from the, pick the first
              // ranged opening tag whose name is same like current, closing's

              var lastRangedOpeningTag;

              for (var z = rangedOpeningTags.length; z--;) {
                /* istanbul ignore else */
                if (rangedOpeningTags[z].name === tag.name) {
                  lastRangedOpeningTag = rangedOpeningTags[z];
                }
              }
              /* istanbul ignore else */


              if (lastRangedOpeningTag) {
                filteredTagLocations = filteredTagLocations.filter(function (_ref4) {
                  var from = _ref4[0];
                  return from !== lastRangedOpeningTag.lastOpeningBracketAt;
                });
                filteredTagLocations.push([lastRangedOpeningTag.lastOpeningBracketAt, _i + 1]);
              } else {
                /* istanbul ignore next */
                filteredTagLocations.push([tag.lastOpeningBracketAt, _i + 1]);
              }
            } else {
              // if it's not ranged tag, just push it as it is to filteredTagLocations
              filteredTagLocations.push([tag.lastOpeningBracketAt, _i + 1]);
            }
          }
        }
      } else if (_i > tag.lastClosingBracketAt && str[_i].trim() || str[_i + 1] === undefined) { // case 2. closing bracket HAS BEEN met
        // we'll look for a non-whitespace character and delete up to it
        // BUT, we'll wipe the tag object only if that non-whitespace character
        // is not a ">". This way we'll catch and delete sequences of closing brackets.
        // part 1.

        var endingRangeIndex = tag.lastClosingBracketAt === _i ? _i + 1 : _i;

        if (opts.trimOnlySpaces && endingRangeIndex === len - 1 && spacesChunkWhichFollowsTheClosingBracketEndsAt !== null && spacesChunkWhichFollowsTheClosingBracketEndsAt < _i) {
          endingRangeIndex = spacesChunkWhichFollowsTheClosingBracketEndsAt;
        } // if it's a dodgy suspicious tag where space follows opening bracket, there's an extra requirement
        // for this tag to be considered a tag - there has to be at least one attribute with equals if
        // the tag name is not recognised. // submit tag to allTagLocations

        /* istanbul ignore else */

        if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
          allTagLocations.push([tag.lastOpeningBracketAt, tag.lastClosingBracketAt + 1]);
        }

        if (!onlyStripTagsMode && opts.ignoreTags.includes(tag.name) || onlyStripTagsMode && !opts.onlyStripTags.includes(tag.name)) {
          // ping the callback with nulls:
          opts.cb({
            tag: tag,
            deleteFrom: null,
            deleteTo: null,
            insert: null,
            rangesArr: rangesToDelete,
            proposedReturn: null
          }); // don't submit the tag onto "filteredTagLocations"
          // then reset:
          tag = {};
          attrObj = {}; // continue;
        } else if (!tag.onlyPlausible || // tag name is recognised and there are no attributes:
        tag.attributes.length === 0 && tag.name && (definitelyTagNames.has(tag.name.toLowerCase()) || singleLetterTags.has(tag.name.toLowerCase())) || // OR there is at least one equals that follow the attribute's name:
        tag.attributes && tag.attributes.some(function (attrObj2) {
          return attrObj2.equalsAt;
        })) {
          // submit tag to filteredTagLocations

          /* istanbul ignore else */
          if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
            filteredTagLocations.push([tag.lastOpeningBracketAt, tag.lastClosingBracketAt + 1]);
          } // if this was an ignored tag name, algorithm would have bailed earlier,
          // in stage "catch the ending of the tag name".


          var _whiteSpaceCompensation2 = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, endingRangeIndex, tag.lastOpeningBracketAt, tag.lastClosingBracketAt); // calculate optional opts.dumpLinkHrefsNearby.enabled HREF to insert

          stringToInsertAfter = "";
          hrefInsertionActive = false;
          calculateHrefToBeInserted(opts);
          var insert;

          if (isStr(stringToInsertAfter) && stringToInsertAfter.length) {
            insert = "" + _whiteSpaceCompensation2 + stringToInsertAfter + (
            /* istanbul ignore next */
            _whiteSpaceCompensation2 === "\n\n" ? "\n" : _whiteSpaceCompensation2);
          } else {
            insert = _whiteSpaceCompensation2;
          }

          if (tag.leftOuterWhitespace === 0 || !stringLeftRight.right(str, endingRangeIndex - 1)) {
            insert = "";
          } // pass the range onto the callback function, be it default or user's
          opts.cb({
            tag: tag,
            deleteFrom: tag.leftOuterWhitespace,
            deleteTo: endingRangeIndex,
            insert: insert,
            rangesArr: rangesToDelete,
            proposedReturn: [tag.leftOuterWhitespace, endingRangeIndex, insert]
          });
          resetHrefMarkers(); // also,

          treatRangedTags(_i, opts, rangesToDelete);
        } else {
          tag = {};
        } // part 2.


        if (!isClosingAt(_i)) {
          tag = {};
        }
      }
    } // catch an opening bracket
    // -------------------------------------------------------------------------


    if (isOpeningAt(_i) && !isOpeningAt(_i - 1) && !"'\"".includes(str[_i + 1]) && (!"'\"".includes(str[_i + 2]) || /\w/.test(str[_i + 1])) && //
    // precaution JSP,
    // against <c:
    !(str[_i + 1] === "c" && str[_i + 2] === ":") && // against <fmt:
    !(str[_i + 1] === "f" && str[_i + 2] === "m" && str[_i + 3] === "t" && str[_i + 4] === ":") && // against <sql:
    !(str[_i + 1] === "s" && str[_i + 2] === "q" && str[_i + 3] === "l" && str[_i + 4] === ":") && // against <x:
    !(str[_i + 1] === "x" && str[_i + 2] === ":") && // against <fn:
    !(str[_i + 1] === "f" && str[_i + 2] === "n" && str[_i + 3] === ":") && //
    // kl <c:when test="${!empty ab.cd && ab.cd < 0.00}"> mn
    //                                          ^
    //                                  we're here, it's false alarm
    notWithinAttrQuotes(tag, str, _i)) { // cater sequences of opening brackets "<<<<div>>>"

      if (isClosingAt(stringLeftRight.right(str, _i))) {
        // cater cases like: "<><><>"
        i = _i;
        return "continue";
      } else { // 1. Before (re)setting flags, check, do we have a case of a tag with a
        // missing closing bracket, and this is a new tag following it.

        if (tag.nameEnds && tag.nameEnds < _i && !tag.lastClosingBracketAt) {

          if (tag.onlyPlausible === true && tag.attributes && tag.attributes.length || tag.onlyPlausible === false) { // tag.onlyPlausible can be undefined too

            var _whiteSpaceCompensation3 = calculateWhitespaceToInsert(str, _i, tag.leftOuterWhitespace, _i, tag.lastOpeningBracketAt, _i);
            opts.cb({
              tag: tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: _i,
              insert: _whiteSpaceCompensation3,
              rangesArr: rangesToDelete,
              proposedReturn: [tag.leftOuterWhitespace, _i, _whiteSpaceCompensation3]
            }); // also,

            treatRangedTags(_i, opts, rangesToDelete); // then, for continuity, mark everything up accordingly if it's a new bracket:

            tag = {};
            attrObj = {};
          }
        } // 2. if new tag starts, reset:


        if (tag.lastOpeningBracketAt !== undefined && tag.onlyPlausible && tag.name && !tag.quotes) {
          // reset:
          tag.lastOpeningBracketAt = undefined;
          tag.name = undefined;
          tag.onlyPlausible = false;
        }

        if ((tag.lastOpeningBracketAt === undefined || !tag.onlyPlausible) && !tag.quotes) {
          tag.lastOpeningBracketAt = _i;
          tag.slashPresent = false;
          tag.attributes = []; // since 2.1.0 we started to care about not trimming outer whitespace which is not spaces.
          // For example, " \t <a> \n ". Tag's whitespace boundaries should not extend to string
          // edges but until "\t" on the left and "\n" on the right IF opts.trimOnlySpaces is on.

          if (chunkOfWhitespaceStartsAt === null) {
            tag.leftOuterWhitespace = _i;
          } else if (opts.trimOnlySpaces && chunkOfWhitespaceStartsAt === 0) {
            // if whitespace extends to the beginning of a string, there's a risk it might include
            // not only spaces. To fix that, switch to space-only range marker:

            /* istanbul ignore next */
            tag.leftOuterWhitespace = chunkOfSpacesStartsAt || _i;
          } else {
            tag.leftOuterWhitespace = chunkOfWhitespaceStartsAt;
          } // tag.leftOuterWhitespace =
          //   chunkOfWhitespaceStartsAt === null ? i : chunkOfWhitespaceStartsAt; // tend the HTML comments: <!-- --> or CDATA: <![CDATA[ ... ]]>
          // if opening comment tag is detected, traverse forward aggressively
          // until EOL or "-->" is reached and offset outer index "i".

          if ("" + str[_i + 1] + str[_i + 2] + str[_i + 3] === "!--" || "" + str[_i + 1] + str[_i + 2] + str[_i + 3] + str[_i + 4] + str[_i + 5] + str[_i + 6] + str[_i + 7] + str[_i + 8] === "![CDATA[") { // make a note which one it is:

            var cdata = true;

            if (str[_i + 2] === "-") {
              cdata = false;
            }
            var closingFoundAt;

            for (var _y = _i; _y < len; _y++) {

              if (!closingFoundAt && cdata && "" + str[_y - 2] + str[_y - 1] + str[_y] === "]]>" || !cdata && "" + str[_y - 2] + str[_y - 1] + str[_y] === "-->") {
                closingFoundAt = _y;
              }

              if (closingFoundAt && (closingFoundAt < _y && str[_y].trim() || str[_y + 1] === undefined)) {
                var rangeEnd = _y;

                if (str[_y + 1] === undefined && !str[_y].trim() || str[_y] === ">") {
                  rangeEnd += 1;
                } // submit the tag

                /* istanbul ignore else */


                if (!allTagLocations.length || allTagLocations[allTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                  allTagLocations.push([tag.lastOpeningBracketAt, closingFoundAt + 1]);
                }
                /* istanbul ignore else */


                if (!filteredTagLocations.length || filteredTagLocations[filteredTagLocations.length - 1][0] !== tag.lastOpeningBracketAt) {
                  filteredTagLocations.push([tag.lastOpeningBracketAt, closingFoundAt + 1]);
                }

                var _whiteSpaceCompensation4 = calculateWhitespaceToInsert(str, _y, tag.leftOuterWhitespace, rangeEnd, tag.lastOpeningBracketAt, closingFoundAt);
                opts.cb({
                  tag: tag,
                  deleteFrom: tag.leftOuterWhitespace,
                  deleteTo: rangeEnd,
                  insert: _whiteSpaceCompensation4,
                  rangesArr: rangesToDelete,
                  proposedReturn: [tag.leftOuterWhitespace, rangeEnd, _whiteSpaceCompensation4]
                }); // offset:

                _i = _y - 1;

                if (str[_y] === ">") {
                  _i = _y;
                } // resets:


                tag = {};
                attrObj = {}; // finally,

                break;
              }
            }
          }
        }
      }
    } // catch whitespace
    // -------------------------------------------------------------------------


    if (!str[_i].trim()) {
      // 1. catch chunk boundaries:
      if (chunkOfWhitespaceStartsAt === null) {
        chunkOfWhitespaceStartsAt = _i;

        if (tag.lastOpeningBracketAt !== undefined && tag.lastOpeningBracketAt < _i && tag.nameStarts && tag.nameStarts < tag.lastOpeningBracketAt && _i === tag.lastOpeningBracketAt + 1 && // insurance against tail part of ranged tag being deleted:
        !rangedOpeningTags.some( // eslint-disable-next-line no-loop-func
        function (rangedTagObj) {
          return rangedTagObj.name === tag.name;
        })) {
          tag.onlyPlausible = true;
          tag.name = undefined;
          tag.nameStarts = undefined;
        }
      }
    } else if (chunkOfWhitespaceStartsAt !== null) { // 1. piggyback the catching of the attributes with equal and no value

      if (!tag.quotes && attrObj.equalsAt > chunkOfWhitespaceStartsAt - 1 && attrObj.nameEnds && attrObj.equalsAt > attrObj.nameEnds && str[_i] !== '"' && str[_i] !== "'") {
        /* istanbul ignore else */
        if (isObj__default['default'](attrObj)) {
          tag.attributes.push(attrObj);
        } // reset:


        attrObj = {};
        tag.equalsSpottedAt = undefined;
      } // 2. reset whitespace marker


      chunkOfWhitespaceStartsAt = null;
    } // catch spaces-only chunks (needed for outer trim option opts.trimOnlySpaces)
    // -------------------------------------------------------------------------


    if (str[_i] === " ") {
      // 1. catch spaces boundaries:
      if (chunkOfSpacesStartsAt === null) {
        chunkOfSpacesStartsAt = _i;
      }
    } else if (chunkOfSpacesStartsAt !== null) {
      // 2. reset the marker
      chunkOfSpacesStartsAt = null;
    } // log all
    // ------------------------------------------------------------------------- // console.log(
    //   `${`\u001b[${33}m${`chunkOfSpacesStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
    //     chunkOfSpacesStartsAt,
    //     null,
    //     4
    //   )}`
    // ); // console.log(
    //   `${`\u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
    //     chunkOfWhitespaceStartsAt,
    //     null,
    //     4
    //   )}`
    // );
    i = _i;
  };

  for (var i = 0, len = str.length; i < len; i++) {
    var _ret2 = _loop2(i, len);

    if (_ret2 === "continue") continue;
  } // trim but in ranges
  // first tackle the beginning on the string

  if (str && ( // if only spaces were meant to be trimmed,
  opts.trimOnlySpaces && // and first character is a space
  str[0] === " " || // if normal trim is requested
  !opts.trimOnlySpaces && // and the first character is whitespace character
  !str[0].trim())) {

    for (var _i2 = 0, _len = str.length; _i2 < _len; _i2++) {
      if (opts.trimOnlySpaces && str[_i2] !== " " || !opts.trimOnlySpaces && str[_i2].trim()) {
        rangesToDelete.push([0, _i2]);
        break;
      } else if (!str[_i2 + 1]) {
        // if end has been reached and whole string has been trimmable
        rangesToDelete.push([0, _i2 + 1]);
      }
    }
  }

  if (str && ( // if only spaces were meant to be trimmed,
  opts.trimOnlySpaces && // and last character is a space
  str[str.length - 1] === " " || // if normal trim is requested
  !opts.trimOnlySpaces && // and the last character is whitespace character
  !str[str.length - 1].trim())) {
    for (var _i3 = str.length; _i3--;) {
      if (opts.trimOnlySpaces && str[_i3] !== " " || !opts.trimOnlySpaces && str[_i3].trim()) {
        rangesToDelete.push([_i3 + 1, str.length]);
        break;
      } // don't tackle end-to-end because it would have been already caught on the
      // start-to-end direction loop above.

    }
  } // last correction, imagine we've got text-whitespace-tag.
  // That last part "tag" was removed but "whitespace" in between is on the left.
  // We need to trim() that too if applicable.
  // By now we'll be able to tell, is starting/ending range array touching
  // the start (index 0) or end (str.length - 1) character indexes, and if so,
  // their inner sides will need to be trimmed accordingly, considering the
  // "opts.trimOnlySpaces" of course.


  var curr = rangesToDelete.current();

  if ((!originalOpts || !originalOpts.cb) && curr) {
    // check front - the first range of gathered ranges, does it touch start (0)
    if (curr[0] && !curr[0][0]) {
      curr[0][1]; // check the character at str[startingIdx] // manually edit Ranges class:

      rangesToDelete.ranges[0] = [rangesToDelete.ranges[0][0], rangesToDelete.ranges[0][1]];
    } // check end - the last range of gathered ranges, does it touch the end (str.length)
    // PS. remember ending is not inclusive, so ranges covering the whole ending
    // would go up to str.length, not up to str.length - 1!


    if (curr[curr.length - 1] && curr[curr.length - 1][1] === str.length) {
      curr[curr.length - 1][0]; // check character at str[startingIdx - 1] // remove third element from the last range "what to add" - because
      // ranges will crop aggressively, covering all whitespace, but they
      // then restore missing spaces (in which case it's not missing).
      // We already have tight crop, we just need to remove that "what to add"
      // third element.
      // hard edit:

      /* istanbul ignore else */

      if (rangesToDelete.ranges) {
        var startingIdx2 = rangesToDelete.ranges[rangesToDelete.ranges.length - 1][0];

        if (str[startingIdx2 - 1] && (opts.trimOnlySpaces && str[startingIdx2 - 1] === " " || !opts.trimOnlySpaces && !str[startingIdx2 - 1].trim())) {
          startingIdx2 -= 1;
        }

        var backupWhatToAdd = rangesToDelete.ranges[rangesToDelete.ranges.length - 1][2];
        rangesToDelete.ranges[rangesToDelete.ranges.length - 1] = [startingIdx2, rangesToDelete.ranges[rangesToDelete.ranges.length - 1][1]]; // for cases of opts.dumpLinkHrefsNearby

        if (backupWhatToAdd && backupWhatToAdd.trim()) {
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1].push(backupWhatToAdd.trimEnd());
        }
      }
    }
  }

  var res = {
    log: {
      timeTakenInMilliseconds: Date.now() - start
    },
    result: rangesApply.rApply(str, rangesToDelete.current()),
    ranges: rangesToDelete.current(),
    allTagLocations: allTagLocations,
    filteredTagLocations: filteredTagLocations
  };
  return res;
}

exports.defaults = defaults;
exports.stripHtml = stripHtml;
exports.version = version$1;

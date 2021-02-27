/**
 * html-table-patcher
 * Visual helper to place templating code around table tags into correct places
 * Version: 4.0.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/html-table-patcher/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var codsenParser = require('codsen-parser');
var rangesPush = require('ranges-push');
var rangesApply = require('ranges-apply');
var astMonkeyTraverseWithLookahead = require('ast-monkey-traverse-with-lookahead');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version$1 = "4.0.6";

var version = version$1;
var htmlCommentRegex = /<!--([\s\S]*?)-->/g;
var ranges = new rangesPush.Ranges();

function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

var defaults = {
  cssStylesContent: "",
  alwaysCenter: false
};
/**
 * Visual helper to place templating code around table tags into correct places
 */

function patcher(str, generalOpts) {
  // insurance
  // ---------------------------------------------------------------------------
  // if inputs are wrong, just return what was given
  if (typeof str !== "string" || str.length === 0) {
    return {
      result: str
    };
  } // setup
  // ---------------------------------------------------------------------------
  // clone the defaults, don't mutate the input argument object


  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), generalOpts);

  if (opts.cssStylesContent && ( // if not a string was passed
  typeof opts.cssStylesContent !== "string" || // or it was empty of full of whitespace
  !opts.cssStylesContent.trim())) {
    opts.cssStylesContent = "";
  } // the bizness
  // ---------------------------------------------------------------------------
  // traversal is done from a callback, same like Array.prototype.forEach()
  // you don't assign anything, as in "const x = traverse(..." -
  // instead, you do the deed inside the callback function
  //
  // ensure that we don't traverse inside comment tokens
  // practically we achieve that by comparing does current path start with
  // and of the known comment token paths:

  var knownCommentTokenPaths = [];
  astMonkeyTraverseWithLookahead.traverse(codsenParser.cparser(str), function (token, _val, innerObj) {
    /* istanbul ignore else */
    if (isObj(token) && token.type === "comment" && !knownCommentTokenPaths.some(function (oneOfRecordedPaths) {
      return innerObj.path.startsWith(oneOfRecordedPaths);
    })) {
      knownCommentTokenPaths.push(innerObj.path);
    } else if ( // tags are always stuck in an array, "root" level is array too
    // ast-monkey reports array elements as "key" and "value" is undefined.
    // if this was object, "key" would be key of key/value pair, "value"
    // would be value of the key/value pair.
    //
    // The tag itself is a plain object:
    isObj(token) && // filter by type and tag name
    token.type === "tag" && token.tagName === "table" && !knownCommentTokenPaths.some(function (oneOfKnownCommentPaths) {
      return innerObj.path.startsWith(oneOfKnownCommentPaths);
    }) && // ensure it's not closing, otherwise closing tags will be caught too:
    !token.closing && // we wrap either raw text or esp template tag nodes only:
    token.children.some(function (childNodeObj) {
      return ["text", "esp"].includes(childNodeObj.type);
    })) {
      // so this table does have some text nodes straight inside TABLE tag // find out how many TD's are there on TR's that have TD's (if any exist)
      // then, that value, if greater then 1 will be the colspan value -
      // we'll wrap this text node's contents with one TR and one TD - but
      // set TD colspan to this value:

      var colspanVal = 1; // if td we decide the colspan contains some attributes, we'll note
      // down the range of where first attrib starts and last attrib ends
      // then slice that range and insert of every td, along the colspan

      var centered = false;
      var firstTrFound = {};

      if ( // some TR's exist inside this TABLE tag
      token.children.some(function (childNodeObj) {
        return childNodeObj.type === "tag" && childNodeObj.tagName === "tr" && !childNodeObj.closing && (firstTrFound = childNodeObj);
      })) { // console.log(
        //   `108 ${`\u001b[${33}m${`firstTrFound`}\u001b[${39}m`} = ${JSON.stringify(
        //     firstTrFound,
        //     null,
        //     4
        //   )}`
        // );
        // colspanVal is equal to the count of TD's inside children[] array
        // the only condition - we count consecutive TD's, any ESP or text
        // token breaks the counting

        var count = 0; // console.log(
        //   `132 FILTER ${`\u001b[${33}m${`firstTrFound.children`}\u001b[${39}m`} = ${JSON.stringify(
        //     firstTrFound.children,
        //     null,
        //     4
        //   )}`
        // );

        for (var i = 0, len = firstTrFound.children.length; i < len; i++) {
          var obj = firstTrFound.children[i]; // console.log(
          //   `141 ---------------- ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
          //     obj,
          //     null,
          //     4
          //   )}`
          // );
          // count consecutive TD's

          if (obj.type === "tag" && obj.tagName === "td") {
            if (!obj.closing) {
              // detect center-alignment
              centered = obj.attribs.some(function (attrib) {
                return attrib.attribName === "align" && attrib.attribValueRaw === "center" || attrib.attribName === "style" && /text-align:\s*center/i.test(attrib.attribValueRaw);
              });
              count++;

              if (count > colspanVal) {
                colspanVal = count;
              }
            } // else - ignore closing tags

          } else if (obj.type !== "text" || obj.value.replace(htmlCommentRegex, "").trim()) {
            // reset
            count = 0;
          } // console.log(
          //   `174 ${`\u001b[${33}m${`count`}\u001b[${39}m`} = ${JSON.stringify(
          //     count,
          //     null,
          //     4
          //   )}`
          // );

        }
      } //
      //
      //
      //                         T Y P E      I.
      //
      //
      //
      // ----------------------------------------------------------------------------- // now filter all "text" type children nodes from this TABLE tag
      // this key below is the table tag we filtered in the beginning

      token.children // filter out text nodes:
      .filter(function (childNodeObj) {
        return ["text", "esp"].includes(childNodeObj.type);
      }) // wrap each with TR+TD with colspan:
      .forEach(function (obj) {

        if (obj.value.replace(htmlCommentRegex, "").trim()) {
          // There will always be whitespace in nicely formatted tags,
          // so ignore text tokens which have values that trim to zero length.
          //
          // Since trimmed value of zero length is already falsey, we don't
          // need to do
          // "if (obj.value.trim().length)" or
          // "if (obj.value.trim() === "")" or
          // "if (obj.value.trim().length === 0)"
          //
          ranges.push(obj.start, obj.end, "\n<tr>\n  <td" + (colspanVal > 1 ? " colspan=\"" + colspanVal + "\"" : "") + (opts.alwaysCenter || centered ? " align=\"center\"" : "") + (opts.cssStylesContent ? " style=\"" + opts.cssStylesContent + "\"" : "") + ">\n    " + obj.value.trim() + "\n  </td>\n</tr>\n");
        }
      }); //
      //
      //
      //                         T Y P E      II.
      //
      //
      //
      // -----------------------------------------------------------------------------
      token.children // filter out text nodes:
      .filter(function (obj) {
        return obj.type === "tag" && obj.tagName === "tr" && !obj.closing;
      }).forEach(function (trTag) {
        // console.log(
        //   `224 ██ ${`\u001b[${33}m${`trTag`}\u001b[${39}m`} = ${JSON.stringify(
        //     trTag,
        //     null,
        //     4
        //   )}`
        // );
        // we use for loop because we need to look back, what token was
        // before, plus filter
        var doNothing = false;

        for (var _i = 0, _len = trTag.children.length; _i < _len; _i++) {
          var childNodeObj = trTag.children[_i]; // deactivate

          if (doNothing && childNodeObj.type === "comment" && childNodeObj.closing) {
            doNothing = false;
            continue;
          } // if a child node is opening comment node, activate doNothing
          // until closing counterpart is found


          if (!doNothing && childNodeObj.type === "comment" && !childNodeObj.closing) {
            doNothing = true;
          }

          if (!doNothing && ["text", "esp"].includes(childNodeObj.type) && childNodeObj.value.trim()) {

            if (childNodeObj.value.trim()) {
              // There will always be whitespace in nicely formatted tags,
              // so ignore text tokens which have values that trim to zero length.

              if (!_i) {
                ranges.push(childNodeObj.start, childNodeObj.end, "\n  <td" + (colspanVal > 1 ? " colspan=\"" + colspanVal + "\"" : "") + (opts.alwaysCenter || centered ? " align=\"center\"" : "") + (opts.cssStylesContent ? " style=\"" + opts.cssStylesContent + "\"" : "") + ">\n    " + childNodeObj.value.trim() + "\n  </td>\n</tr>\n<tr>\n");
              } else if (_i && _len > 1 && _i === _len - 1) {
                ranges.push(childNodeObj.start, childNodeObj.end, "\n</tr>\n<tr>\n  <td" + (colspanVal > 1 ? " colspan=\"" + colspanVal + "\"" : "") + (opts.alwaysCenter || centered ? " align=\"center\"" : "") + (opts.cssStylesContent ? " style=\"" + opts.cssStylesContent + "\"" : "") + ">\n    " + childNodeObj.value.trim() + "\n  </td>\n");
              } else {
                ranges.push(childNodeObj.start, childNodeObj.end, "\n</tr>\n<tr>\n  <td" + (colspanVal > 1 ? " colspan=\"" + colspanVal + "\"" : "") + (opts.alwaysCenter || centered ? " align=\"center\"" : "") + (opts.cssStylesContent ? " style=\"" + opts.cssStylesContent + "\"" : "") + ">\n    " + childNodeObj.value.trim() + "\n  </td>\n</tr>\n<tr>\n");
              }
            }
          }
        }
      });
    }
  });

  if (ranges.current()) {
    var result = rangesApply.rApply(str, ranges.current());
    ranges.wipe();
    return {
      result: result
    };
  }

  return {
    result: str
  };
}

exports.defaults = defaults;
exports.patcher = patcher;
exports.version = version;

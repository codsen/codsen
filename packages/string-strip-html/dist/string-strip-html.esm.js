import replaceSlicesArr from 'string-replace-slices-array';
import Slices from 'string-slices-array-push';
import isObj from 'lodash.isplainobject';
import checkTypes from 'check-types-mini';
import trimChars from 'lodash.trim';
import { matchRight } from 'string-match-left-right';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function stripHtml(str, originalOpts) {
  function existy(x) {
    return x != null;
  }
  // vars
  var definitelyTagNames = ['abbr', 'address', 'area', 'article', 'aside', 'audio', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'math', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'param', 'picture', 'pre', 'progress', 'rb', 'rp', 'rt', 'rtc', 'ruby', 'samp', 'script', 'section', 'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'ul', 'var', 'video', 'wbr'];
  var singleLetterTags = ['a', 'b', 'i', 'p', 'q', 's', 'u'];
  var suspiciousList = ['='];
  var punctuation = ['.', ',', '!', '?', ';', '\u2026']; // \u2026 is &hellip - ellipsis

  // validation
  if (typeof str !== 'string') {
    throw new TypeError('string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it\'s: ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)) + ', equal to:\n' + JSON.stringify(str, null, 4));
  }
  if (originalOpts !== undefined && originalOpts !== null && !isObj(originalOpts)) {
    throw new TypeError('string-strip-html/stripHtml(): [THROW_ID_02] Options object must be a plain object! Currently it\'s: ' + (typeof originalOpts === 'undefined' ? 'undefined' : _typeof(originalOpts)) + ', equal to:\n' + JSON.stringify(originalOpts, null, 4));
  }

  // prep opts
  var defaults = {
    ignoreTags: [],
    stripTogetherWithTheirContents: ['script', 'style']
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, { msg: 'string-strip-html/stripHtml(): [THROW_ID_03*]' });

  // end sooner if it's an empty or empty-ish string:
  if (str === '' || str.trim() === '') {
    return str;
  }

  // we'll manage the TO-DELETE string slice ranges using this class:
  var rangesToDelete = new Slices();

  var state = 'normal';
  // state can be of a one of three kinds: 1) 'normal'; 2) 'sensitive'; 3) 'delete'

  // When normal is active, we don't think we currently traversing potentially
  // to-be-deleted characters.

  // When sensitive is active, there is probability that we might need to deleted
  // everything from last opening bracket to next closing bracket. Sensitive stage
  // is never reduced to "normal". "Sensitive" stage becomes "Delete" stage if
  // certain "freak out" rules are satisfied.

  // When delete flag is active, we definitely want to delete everything form last
  // opening bracket to the next closing bracket. "Delete" state is reset after
  // deletion is performed and becomes "normal".

  var deleteFromIndex = null;
  var tagMightHaveStarted = false;

  // traverse the string indexes
  for (var i = 0, len = str.length; i < len; i++) {
    // console.log(`---------${str[i].trim().length > 0 ? str[i] : 'space'}`)

    // -----------------------------------------------------
    // catch the opening bracket, "<"
    if (str[i] === '<') {
      // the main flipping of a state
      if ((opts.ignoreTags.length === 0 || !matchRight(str, i, opts.ignoreTags, { trimCharsBeforeMatching: ' \n\t\r/<', i: true })) && !tagMightHaveStarted) {
        if (existy(str[i + 1]) && str[i + 1].trim() === '') {
          state = 'sensitive';
        } else {
          state = 'delete';
        }
        deleteFromIndex = i;
      }

      // we need to track tag outermost boundaries separately
      // from "state" because there might be consecutive brackets.
      if (!tagMightHaveStarted) {
        tagMightHaveStarted = true;
      }
    }

    // -----------------------------------------------------
    // catch the closing bracket, ">"
    if (str[i] === '>') {
      // reset the tagMightHaveStarted
      tagMightHaveStarted = false;

      // with brackets: str.slice(deleteFromIndex, i + 1)
      // without brackets: str.slice(deleteFromIndex + 1, i)
      if (state === 'delete' && deleteFromIndex < i) {
        if (existy(str[deleteFromIndex - 1]) && str[deleteFromIndex - 1].trim() !== '' && existy(str[i + 1]) && str[i + 1].trim() !== '' && !punctuation.includes(str[i + 1]) && !matchRight(str, i, '>', { trimCharsBeforeMatching: ' \n\t\r/' })) {
          // console.log('1')
          rangesToDelete.add(deleteFromIndex, i + 1, ' ');
        } else {
          // console.log('2')
          rangesToDelete.add(deleteFromIndex, i + 1);
        }
      } else if (state === 'sensitive') {
        if (deleteFromIndex + 1 < i && definitelyTagNames.concat(singleLetterTags).includes(trimChars(str.slice(deleteFromIndex + 1, i).trim().toLowerCase(), ' /'))) {
          // console.log(`* adding range: ${str.slice(deleteFromIndex, i + 1)}`)
          // console.log(`! str[deleteFromIndex] =
          // ${JSON.stringify(str[deleteFromIndex], null, 4)}`)
          // console.log(`! str[i + 1] = ${JSON.stringify(str[i + 1], null, 4)}`)
          if (existy(str[deleteFromIndex - 1]) && str[deleteFromIndex - 1].trim() !== '' && existy(str[i + 1]) && str[i + 1].trim() !== '' && !punctuation.includes(str[i + 1])) {
            // console.log('3')
            rangesToDelete.add(deleteFromIndex, i + 1, ' ');
          } else {
            // console.log('4')
            rangesToDelete.add(deleteFromIndex, i + 1);
          }
          state = 'normal';
        }
      }
    }

    // -----------------------------------------------------
    // catch characters that are red flags and mean it's
    // more than likely HTML now
    if (suspiciousList.includes(str[i]) && state === 'sensitive') {
      state = 'delete';
    }

    // console.log(`* ended with state: ${state}`)
  }

  if (rangesToDelete.current()) {
    return replaceSlicesArr(str, rangesToDelete.current());
  }
  return str;
}

export default stripHtml;

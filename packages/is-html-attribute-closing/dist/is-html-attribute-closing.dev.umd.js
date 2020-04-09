/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-attribute-closing
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.isHtmlAttributeClosing = factory());
}(this, (function () { 'use strict';

  /**
   * html-all-known-attributes
   * All HTML attributes known to the Humanity
   * Version: 1.3.2
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/all-named-html-entities
   */
  const allHtmlAttribs = new Set(["abbr", "accept", "accept-charset", "accesskey", "action", "align", "alink", "allow", "alt", "archive", "async", "autocapitalize", "autocomplete", "autofocus", "autoplay", "axis", "background", "background-attachment", "background-color", "background-image", "background-position", "background-position-x", "background-position-y", "background-repeat", "bgcolor", "border", "border-bottom", "border-bottom-color", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-style", "border-top", "border-top-color", "border-top-style", "border-top-width", "border-width", "buffered", "capture", "cellpadding", "cellspacing", "challenge", "char", "charoff", "charset", "checked", "cite", "class", "classid", "clear", "clip", "code", "codebase", "codetype", "color", "cols", "colspan", "column-span", "compact", "content", "contenteditable", "contextmenu", "controls", "coords", "crossorigin", "csp", "cursor", "data", "data-*", "datetime", "declare", "decoding", "default", "defer", "dir", "direction", "dirname", "disabled", "display", "download", "draggable", "dropzone", "enctype", "enterkeyhint", "face", "filter", "float", "font", "font-color", "font-emphasize", "font-emphasize-position", "font-emphasize-style", "font-family", "font-size", "font-style", "font-variant", "font-weight", "for", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "frame", "frameborder", "frontuid", "headers", "height", "hidden", "high", "horiz-align", "href", "hreflang", "hspace", "http-equiv", "icon", "id", "importance", "inputmode", "integrity", "intrinsicsize", "ismap", "itemprop", "keytype", "kind", "label", "lang", "language", "layout-flow", "layout-grid", "layout-grid-char", "layout-grid-line", "layout-grid-mode", "layout-grid-type", "left", "letter-spacing", "line-break", "line-height", "link", "list", "list-image-1", "list-image-2", "list-image-3", "list-style", "list-style-image", "list-style-position", "list-style-type", "loading", "longdesc", "loop", "low", "manifest", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marginheight", "marginwidth", "max", "maxlength", "media", "method", "min", "minlength", "mso-ansi-font-size", "mso-ansi-font-style", "mso-ansi-font-weight", "mso-ansi-language", "mso-ascii-font-family", "mso-background", "mso-background-source", "mso-baseline-position", "mso-bidi-flag", "mso-bidi-font-family", "mso-bidi-font-size", "mso-bidi-font-style", "mso-bidi-font-weight", "mso-bidi-language", "mso-bookmark", "mso-border-alt", "mso-border-between", "mso-border-between-color", "mso-border-between-style", "mso-border-between-width", "mso-border-bottom-alt", "mso-border-bottom-color-alt", "mso-border-bottom-source", "mso-border-bottom-style-alt", "mso-border-bottom-width-alt", "mso-border-color-alt", "mso-border-effect", "mso-border-left-alt", "mso-border-left-color-alt", "mso-border-left-source", "mso-border-left-style-alt", "mso-border-left-width-alt", "mso-border-right-alt", "mso-border-right-color-alt", "mso-border-right-source", "mso-border-right-style-alt", "mso-border-right-width-alt", "mso-border-shadow", "mso-border-source", "mso-border-style-alt", "mso-border-top-alt", "mso-border-top-color-alt", "mso-border-top-source", "mso-border-top-style-alt", "mso-border-top-width-alt", "mso-border-width-alt", "mso-break-type", "mso-build", "mso-build-after-action", "mso-build-after-color", "mso-build-auto-secs", "mso-build-avi", "mso-build-dual-id", "mso-build-order", "mso-build-sound-name", "mso-bullet-image", "mso-cell-special", "mso-cellspacing", "mso-char-indent", "mso-char-indent-count", "mso-char-indent-size", "mso-char-type", "mso-char-wrap", "mso-color-alt", "mso-color-index", "mso-color-source", "mso-column-break-before", "mso-column-separator", "mso-columns", "mso-comment-author", "mso-comment-continuation", "mso-comment-id", "mso-comment-reference", "mso-data-placement", "mso-default-height", "mso-default-width", "mso-diagonal-down", "mso-diagonal-down-color", "mso-diagonal-down-source", "mso-diagonal-down-style", "mso-diagonal-down-width", "mso-diagonal-up", "mso-diagonal-up-color", "mso-diagonal-up-source", "mso-diagonal-up-style", "mso-diagonal-up-width", "mso-displayed-decimal-separator", "mso-displayed-thousand-separator", "mso-element", "mso-element-anchor-horizontal", "mso-element-anchor-lock", "mso-element-anchor-vertical", "mso-element-frame-height", "mso-element-frame-hspace", "mso-element-frame-vspace", "mso-element-frame-width", "mso-element-left", "mso-element-linespan", "mso-element-top", "mso-element-wrap", "mso-endnote-continuation-notice", "mso-endnote-continuation-notice-id", "mso-endnote-continuation-notice-src", "mso-endnote-continuation-separator", "mso-endnote-continuation-separator-id", "mso-endnote-continuation-separator-src", "mso-endnote-display", "mso-endnote-id", "mso-endnote-numbering", "mso-endnote-numbering-restart", "mso-endnote-numbering-start", "mso-endnote-numbering-style", "mso-endnote-position", "mso-endnote-separator", "mso-endnote-separator-id", "mso-endnote-separator-src", "mso-even-footer", "mso-even-footer-id", "mso-even-footer-src", "mso-even-header", "mso-even-header-id", "mso-even-header-src", "mso-facing-pages", "mso-fareast-font-family", "mso-fareast-hint", "mso-fareast-language", "mso-field-change", "mso-field-change-author", "mso-field-change-time", "mso-field-change-value", "mso-field-code", "mso-field-lock", "mso-fills-color", "mso-first-footer", "mso-first-footer-id", "mso-first-footer-src", "mso-first-header", "mso-first-header-id", "mso-first-header-src", "mso-font-alt", "mso-font-charset", "mso-font-format", "mso-font-info", "mso-font-info-charset", "mso-font-info-type", "mso-font-kerning", "mso-font-pitch", "mso-font-signature", "mso-font-signature-csb-one", "mso-font-signature-csb-two", "mso-font-signature-usb-four", "mso-font-signature-usb-one", "mso-font-signature-usb-three", "mso-font-signature-usb-two", "mso-font-src", "mso-font-width", "mso-footer", "mso-footer-data", "mso-footer-id", "mso-footer-margin", "mso-footer-src", "mso-footnote-continuation-notice", "mso-footnote-continuation-notice-id", "mso-footnote-continuation-notice-src", "mso-footnote-continuation-separator", "mso-footnote-continuation-separator-id", "mso-footnote-continuation-separator-src", "mso-footnote-id", "mso-footnote-numbering", "mso-footnote-numbering-restart", "mso-footnote-numbering-start", "mso-footnote-numbering-style", "mso-footnote-position", "mso-footnote-separator", "mso-footnote-separator-id", "mso-footnote-separator-src", "mso-foreground", "mso-forms-protection", "mso-generic-font-family", "mso-grid-bottom", "mso-grid-bottom-count", "mso-grid-left", "mso-grid-left-count", "mso-grid-right", "mso-grid-right-count", "mso-grid-top", "mso-grid-top-count", "mso-gutter-direction", "mso-gutter-margin", "mso-gutter-position", "mso-hansi-font-family", "mso-header", "mso-header-data", "mso-header-id", "mso-header-margin", "mso-header-src", "mso-height-alt", "mso-height-rule", "mso-height-source", "mso-hide", "mso-highlight", "mso-horizontal-page-align", "mso-hyphenate", "mso-ignore", "mso-kinsoku-overflow", "mso-layout-grid-align", "mso-layout-grid-char-alt", "mso-layout-grid-origin", "mso-level-inherit", "mso-level-legacy", "mso-level-legacy-indent", "mso-level-legacy-space", "mso-level-legal-format", "mso-level-number-format", "mso-level-number-position", "mso-level-numbering", "mso-level-reset-level", "mso-level-start-at", "mso-level-style-link", "mso-level-suffix", "mso-level-tab-stop", "mso-level-text", "mso-line-break-override", "mso-line-grid", "mso-line-height-alt", "mso-line-height-rule", "mso-line-numbers-count-by", "mso-line-numbers-distance", "mso-line-numbers-restart", "mso-line-numbers-start", "mso-line-spacing", "mso-linked-frame", "mso-list", "mso-list-change", "mso-list-change-author", "mso-list-change-time", "mso-list-change-values", "mso-list-id", "mso-list-ins", "mso-list-ins-author", "mso-list-ins-time", "mso-list-name", "mso-list-template-ids", "mso-list-type", "mso-margin-bottom-alt", "mso-margin-left-alt", "mso-margin-top-alt", "mso-mirror-margins", "mso-negative-indent-tab", "mso-number-format", "mso-outline-level", "mso-outline-parent", "mso-outline-parent-col", "mso-outline-parent-row", "mso-outline-parent-visibility", "mso-outline-style", "mso-padding-alt", "mso-padding-between", "mso-padding-bottom-alt", "mso-padding-left-alt", "mso-padding-right-alt", "mso-padding-top-alt", "mso-page-border-aligned", "mso-page-border-art", "mso-page-border-bottom-art", "mso-page-border-display", "mso-page-border-left-art", "mso-page-border-offset-from", "mso-page-border-right-art", "mso-page-border-surround-footer", "mso-page-border-surround-header", "mso-page-border-top-art", "mso-page-border-z-order", "mso-page-numbers", "mso-page-numbers-chapter-separator", "mso-page-numbers-chapter-style", "mso-page-numbers-start", "mso-page-numbers-style", "mso-page-orientation", "mso-page-scale", "mso-pagination", "mso-panose-arm-style", "mso-panose-contrast", "mso-panose-family-type", "mso-panose-letterform", "mso-panose-midline", "mso-panose-proportion", "mso-panose-serif-style", "mso-panose-stroke-variation", "mso-panose-weight", "mso-panose-x-height", "mso-paper-source", "mso-paper-source-first-page", "mso-paper-source-other-pages", "mso-pattern", "mso-pattern-color", "mso-pattern-style", "mso-print-area", "mso-print-color", "mso-print-gridlines", "mso-print-headings", "mso-print-resolution", "mso-print-sheet-order", "mso-print-title-column", "mso-print-title-row", "mso-prop-change", "mso-prop-change-author", "mso-prop-change-time", "mso-protection", "mso-rotate", "mso-row-margin-left", "mso-row-margin-right", "mso-ruby-merge", "mso-ruby-visibility", "mso-scheme-fill-color", "mso-scheme-shadow-color", "mso-shading", "mso-shadow-color", "mso-space-above", "mso-space-below", "mso-spacerun", "mso-special-character", "mso-special-format", "mso-style-id", "mso-style-name", "mso-style-next", "mso-style-parent", "mso-style-type", "mso-style-update", "mso-subdocument", "mso-symbol-font-family", "mso-tab-count", "mso-table-anchor-horizontal", "mso-table-anchor-vertical", "mso-table-bspace", "mso-table-del-author", "mso-table-del-time", "mso-table-deleted", "mso-table-dir", "mso-table-ins-author", "mso-table-ins-time", "mso-table-inserted", "mso-table-layout-alt", "mso-table-left", "mso-table-lspace", "mso-table-overlap", "mso-table-prop-author", "mso-table-prop-change", "mso-table-prop-time", "mso-table-rspace", "mso-table-top", "mso-table-tspace", "mso-table-wrap", "mso-text-animation", "mso-text-combine-brackets", "mso-text-combine-id", "mso-text-control", "mso-text-fit-id", "mso-text-indent-alt", "mso-text-orientation", "mso-text-raise", "mso-title-page", "mso-tny-compress", "mso-unsynced", "mso-vertical-align-alt", "mso-vertical-align-special", "mso-vertical-page-align", "mso-width-alt", "mso-width-source", "mso-word-wrap", "mso-xlrowspan", "mso-zero-height", "multiple", "muted", "name", "nav-banner-image", "navbutton_background_color", "navbutton_home_hovered", "navbutton_home_normal", "navbutton_home_pushed", "navbutton_horiz_hovered", "navbutton_horiz_normal", "navbutton_horiz_pushed", "navbutton_next_hovered", "navbutton_next_normal", "navbutton_next_pushed", "navbutton_prev_hovered", "navbutton_prev_normal", "navbutton_prev_pushed", "navbutton_up_hovered", "navbutton_up_normal", "navbutton_up_pushed", "navbutton_vert_hovered", "navbutton_vert_normal", "navbutton_vert_pushed", "nohref", "noresize", "noshade", "novalidate", "nowrap", "object", "onblur", "onchange", "onclick", "ondblclick", "onfocus", "onkeydown", "onkeypress", "onkeyup", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onreset", "onselect", "onsubmit", "onunload", "open", "optimum", "overflow", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "panose-1", "pattern", "ping", "placeholder", "position", "poster", "preload", "profile", "prompt", "punctuation-trim", "punctuation-wrap", "radiogroup", "readonly", "referrerpolicy", "rel", "required", "rev", "reversed", "right", "row-span", "rows", "rowspan", "ruby-align", "ruby-overhang", "ruby-position", "rules", "sandbox", "scheme", "scope", "scoped", "scrolling", "selected", "separator-image", "shape", "size", "sizes", "slot", "span", "spellcheck", "src", "srcdoc", "srclang", "srcset", "standby", "start", "step", "style", "summary", "tab-interval", "tab-stops", "tabindex", "table-border-color-dark", "table-border-color-light", "table-layout", "target", "text", "text-align", "text-autospace", "text-combine", "text-decoration", "text-effect", "text-fit", "text-indent", "text-justify", "text-justify-trim", "text-kashida", "text-line-through", "text-shadow", "text-transform", "text-underline", "text-underline-color", "text-underline-style", "title", "top", "top-bar-button", "translate", "type", "unicode-bidi", "urlId", "usemap", "valign", "value", "valuetype", "version", "vert-align", "vertical-align", "visibility", "vlink", "vnd.ms-excel.numberformat", "vspace", "white-space", "width", "word-break", "word-spacing", "wrap", "xmlns", "z-index"]);

  /**
   * is-char-suitable-for-html-attr-name
   * Is given character suitable to be in an HTML attribute's name?
   * Version: 1.0.0
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-char-suitable-for-html-attr-name
   */
  function charSuitableForHTMLAttrName(char) {
    return typeof char === "string" && (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 || char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char === ":" || char === "-");
  }

  /**
   * arrayiffy-if-string
   * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
   * Version: 3.11.28
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/arrayiffy-if-string
   */
  function arrayiffyString(something) {
    if (typeof something === "string") {
      if (something.length > 0) {
        return [something];
      }

      return [];
    }

    return something;
  }

  /**
   * string-match-left-right
   * Do substrings match what's on the left or right of a given index?
   * Version: 4.0.2
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right
   */

  function isObj(something) {
    return something && typeof something === "object" && !Array.isArray(something);
  }

  function isStr(something) {
    return typeof something === "string";
  }

  function march(str, fromIndexInclusive, whatToMatchVal, opts, special, getNextIdx) {
    const whatToMatchValVal = typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal;

    if (fromIndexInclusive < 0 && special && whatToMatchValVal === "EOL") {
      return whatToMatchValVal;
    }

    if (fromIndexInclusive >= str.length && !special) {
      return false;
    }

    let charsToCheckCount = special ? 1 : whatToMatchVal.length;
    let lastWasMismatched = false;
    let atLeastSomethingWasMatched = false;
    let patience = opts.maxMismatches;
    let i = fromIndexInclusive;
    let somethingFound = false;
    let firstCharacterMatched = false;
    let lastCharacterMatched = false;

    while (str[i]) {
      const nextIdx = getNextIdx(i);

      if (opts.trimBeforeMatching && str[i].trim() === "") {
        if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
          return true;
        }

        i = getNextIdx(i);
        continue;
      }

      if (!opts.i && opts.trimCharsBeforeMatching.includes(str[i]) || opts.i && opts.trimCharsBeforeMatching.map(val => val.toLowerCase()).includes(str[i].toLowerCase())) {
        if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
          return true;
        }

        i = getNextIdx(i);
        continue;
      }

      const charToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount] : whatToMatchVal[charsToCheckCount - 1];

      if (!opts.i && str[i] === charToCompareAgainst || opts.i && str[i].toLowerCase() === charToCompareAgainst.toLowerCase()) {
        if (!somethingFound) {
          somethingFound = true;
        }

        if (!atLeastSomethingWasMatched) {
          atLeastSomethingWasMatched = true;
        }

        if (charsToCheckCount === whatToMatchVal.length) {
          firstCharacterMatched = true;
        } else if (charsToCheckCount === 1) {
          lastCharacterMatched = true;
        }

        charsToCheckCount -= 1;

        if (charsToCheckCount < 1) {
          return i;
        }
      } else {
        if (opts.maxMismatches && patience && i) {
          patience--;

          for (let y = 0; y <= patience; y++) {
            const nextCharToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount + 1 + y] : whatToMatchVal[charsToCheckCount - 2 - y];
            const nextCharInSource = str[getNextIdx(i)];

            if (nextCharToCompareAgainst && (!opts.i && str[i] === nextCharToCompareAgainst || opts.i && str[i].toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && (!opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
              charsToCheckCount -= 2;
              somethingFound = true;
              break;
            } else if (nextCharInSource && nextCharToCompareAgainst && (!opts.i && nextCharInSource === nextCharToCompareAgainst || opts.i && nextCharInSource.toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && (!opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
              charsToCheckCount -= 1;
              somethingFound = true;
              break;
            } else if (nextCharToCompareAgainst === undefined && patience >= 0 && somethingFound && (!opts.firstMustMatch || firstCharacterMatched) && (!opts.lastMustMatch || lastCharacterMatched)) {
              return i;
            }
          }

          if (!somethingFound) {
            lastWasMismatched = i;
          }
        } else if (i === 0 && charsToCheckCount === 1 && !opts.lastMustMatch && atLeastSomethingWasMatched) {
          return 0;
        } else {
          return false;
        }
      }

      if (lastWasMismatched !== false && lastWasMismatched !== i) {
        lastWasMismatched = false;
      }

      if (charsToCheckCount < 1) {
        return i;
      }

      i = getNextIdx(i);
    }

    if (charsToCheckCount > 0) {
      if (special && whatToMatchValVal === "EOL") {
        return true;
      } else if (opts.maxMismatches >= charsToCheckCount && atLeastSomethingWasMatched) {
        return lastWasMismatched || 0;
      }

      return false;
    }
  }

  function main(mode, str, position, originalWhatToMatch, originalOpts) {
    const defaults = {
      i: false,
      trimBeforeMatching: false,
      trimCharsBeforeMatching: [],
      maxMismatches: 0,
      firstMustMatch: false,
      lastMustMatch: false
    };

    if (isObj(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${Array.isArray(originalOpts.trimBeforeMatching) ? ` Did you mean to use opts.trimCharsBeforeMatching?` : ""}`);
    }

    const opts = Object.assign({}, defaults, originalOpts);
    opts.trimCharsBeforeMatching = arrayiffyString(opts.trimCharsBeforeMatching);
    opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(el => isStr(el) ? el : String(el));

    if (!isStr(str)) {
      return false;
    } else if (!str.length) {
      return false;
    }

    if (!Number.isInteger(position) || position < 0) {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof position}, equal to:\n${JSON.stringify(position, null, 4)}`);
    }

    let whatToMatch;
    let special;

    if (isStr(originalWhatToMatch)) {
      whatToMatch = [originalWhatToMatch];
    } else if (Array.isArray(originalWhatToMatch)) {
      whatToMatch = originalWhatToMatch;
    } else if (!originalWhatToMatch) {
      whatToMatch = originalWhatToMatch;
    } else if (typeof originalWhatToMatch === "function") {
      whatToMatch = [];
      whatToMatch.push(originalWhatToMatch);
    } else {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(originalWhatToMatch, null, 4)}`);
    }

    if (originalOpts && !isObj(originalOpts)) {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof originalOpts}", and equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
    }

    let culpritsIndex;
    let culpritsVal;

    if (opts.trimCharsBeforeMatching.some((el, i) => {
      if (el.length > 1) {
        culpritsIndex = i;
        culpritsVal = el;
        return true;
      }

      return false;
    })) {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${culpritsIndex} is longer than 1 character, ${culpritsVal.length} (equals to ${culpritsVal}). Please split it into separate characters and put into array as separate elements.`);
    }

    if (!whatToMatch || !Array.isArray(whatToMatch) || Array.isArray(whatToMatch) && !whatToMatch.length || Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr(whatToMatch[0]) && !whatToMatch[0].trim().length) {
      if (typeof opts.cb === "function") {
        let firstCharOutsideIndex;
        let startingPosition = position;

        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }

        if (mode[5] === "L") {
          for (let y = startingPosition; y--;) {
            const currentChar = str[y];

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim().length) && (!opts.trimCharsBeforeMatching.length || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (let y = startingPosition; y < str.length; y++) {
            const currentChar = str[y];

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar.trim().length) && (!opts.trimCharsBeforeMatching.length || !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        }

        if (firstCharOutsideIndex === undefined) {
          return false;
        }

        const wholeCharacterOutside = str[firstCharOutsideIndex];
        const indexOfTheCharacterAfter = firstCharOutsideIndex + 1;
        let theRemainderOfTheString = "";

        if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
          theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
        }

        if (mode[5] === "L") {
          return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
        }

        if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
          theRemainderOfTheString = str.slice(firstCharOutsideIndex);
        }

        return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
      }

      let extraNote = "";

      if (!originalOpts) {
        extraNote = " More so, the whole options object, the fourth input argument, is missing!";
      }

      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${extraNote}`);
    }

    for (let i = 0, len = whatToMatch.length; i < len; i++) {
      special = typeof whatToMatch[i] === "function";
      const whatToMatchVal = whatToMatch[i];
      let fullCharacterInFront;
      let indexOfTheCharacterInFront;
      let restOfStringInFront = "";
      let startingPosition = position;

      if (mode === "matchRight") {
        startingPosition++;
      } else if (mode === "matchLeft") {
        startingPosition--;
      }

      const found = march(str, startingPosition, whatToMatchVal, opts, special, i => mode[5] === "L" ? i - 1 : i + 1);

      if (found && special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
        return whatToMatchVal() && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true) ? whatToMatchVal() : false;
      }

      if (Number.isInteger(found)) {
        indexOfTheCharacterInFront = mode.startsWith("matchLeft") ? found - 1 : found + 1;

        if (mode[5] === "L") {
          restOfStringInFront = str.slice(0, found);
        } else {
          restOfStringInFront = str.slice(indexOfTheCharacterInFront);
        }
      }

      if (indexOfTheCharacterInFront < 0) {
        indexOfTheCharacterInFront = undefined;
      }

      if (str[indexOfTheCharacterInFront]) {
        fullCharacterInFront = str[indexOfTheCharacterInFront];
      }

      if (Number.isInteger(found) && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true)) {
        return whatToMatchVal;
      }
    }

    return false;
  }

  function matchRight(str, position, whatToMatch, opts) {
    return main("matchRight", str, position, whatToMatch, opts);
  }

  function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
    if (typeof str !== "string" || !str.trim().length || !Number.isInteger(idxOfAttrOpening) || !Number.isInteger(isThisClosingIdx) || !str[idxOfAttrOpening] || !str[isThisClosingIdx] || idxOfAttrOpening >= isThisClosingIdx) {
      return false;
    }

    var openingQuote = "'\"".includes(str[idxOfAttrOpening]) ? str[idxOfAttrOpening] : null;
    var oppositeToOpeningQuote = null;

    if (openingQuote) {
      oppositeToOpeningQuote = openingQuote === "\"" ? "'" : "\"";
    }

    var chunkStartsAt;
    var quotesCount = new Map().set("'", 0).set("\"", 0); // when suspected attribute name chunks end, we wipe them, but here
    // we store the last extracted chunk - then later, for example, when we
    // traverse further and meet opening quote (even with equal missing),
    // we can evaluate that chunk, was it a known attribute name (idea being,
    // known attribute name followed by quote is probably legit attribute starting)

    var lastCapturedChunk; // this boolean flag signifies, was the last chunk captured after passing
    // "isThisClosingIdx":
    // idea being, if you pass suspected quotes, then encounter new-ones and
    // in-between does not resemble an attribute name, it's falsey result:
    // <img alt="so-called "artists"!' class='yo'/>
    //          ^                  ^
    //        start             suspected
    //
    // that exclamation mark above doesn't resemble an attribute name,
    // so single quote that follows it is not a starting of its value

    var lastChunkWasCapturedAfterSuspectedClosing = false; // let's traverse from opening to the end of the string, then in happy
    // path scenarios, let's exit way earlier, upon closing quote

    for (var i = idxOfAttrOpening, len = str.length; i < len; i++) {
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //                                THE TOP
      //                                ███████
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      // Logging:
      // -------------------------------------------------------------------------
      // catch quotes
      if ("'\"".includes(str[i])) {
        quotesCount.set(str[i], quotesCount.get(str[i]) + 1);
      } //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //                               MIDDLE
      //                               ██████
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      // before and after the suspected index, all the way while traversing the
      // string from known, starting quotes (or in their absence, starting of
      // the attribute's value, the second input argument "idxOfAttrOpening")
      // all the way until the end, we catch the first character past the
      // questioned attribute closing.
      // imagine
      // <img alt="so-called "artists"!' class='yo'/>
      //          ^                  ^
      //        opening          suspected closing


      if (str[i].trim().length && !chunkStartsAt) {
        // <img alt="so-called "artists"!' class='yo'/>
        //                              ^
        //                         we land here, on excl. mark
        if (charSuitableForHTMLAttrName(str[i])) {
          chunkStartsAt = i;
        }
      } else if (chunkStartsAt && !charSuitableForHTMLAttrName(str[i])) {
        // ending of an attr name chunk
        lastCapturedChunk = str.slice(chunkStartsAt, i);
        lastChunkWasCapturedAfterSuspectedClosing = chunkStartsAt >= isThisClosingIdx;
        chunkStartsAt = null;
      } // catching new attributes that follow after suspected quote.
      // Imagine
      // <a class "c" id 'e' href "www">
      //                 ^            ^
      //        known start at 16     suspected ending at 29


      if ( // if we're currently on some quote:
      "'\"".includes(str[i]) && ( // and if either quote count is an even number (the "!" checking is it zero)
      !(quotesCount.get("\"") % 2) || !(quotesCount.get("'") % 2)) && // and sum of quotes is odd, for example,
      // <a class "c" id 'e' href "www">
      //                          ^
      //                   reusing example above, let's say we're here
      //
      // in this situation, both single quotes around "e" add up to 2, then
      // current opening quote of "www" adds up to 3.
      //
      // In human language, this means, we check, was there a complete
      // set of quotes recorded by now, plus is current chunk a known
      // attribute name - this allows us to catch an attribute with equal missing
      (quotesCount.get("\"") + quotesCount.get("'")) % 2 && // last chunk is not falsey (thus a string)
      lastCapturedChunk && // and finally, perf resource-taxing evaluation, is it recognised:
      allHtmlAttribs.has(lastCapturedChunk)) {
        return i > isThisClosingIdx;
      } // when index "isThisClosingIdx" has been passed...


      if (i > isThisClosingIdx) {
        // if suspected closing quote's index is reached
        if (openingQuote && str[idxOfAttrOpening] === str[i]) {
          return false;
        } // if we have passed the suspected closing quote
        // and we meet another quote of the same kind,
        // it's false result. Imagine code:
        // <img alt='so-called "artists"!" class='yo'/>
        //                     ^       ^
        //               questioned    |
        //                 index     we're here
        //                           so it's false


        if ( // if attribute starts with a quote
        openingQuote && // and we're suspecting a mismatching pair:
        str[isThisClosingIdx] === oppositeToOpeningQuote && // we're questioning, maybe current
        // suspected closing quote is of the
        // opposite kind (single-double, double-single)
        str[i] === oppositeToOpeningQuote) {
          return false;
        } // if the tag closing was met, that's fine, imagine:
        // <div class='c">.</div>
        //              ^
        //        we went past this suspected closing quote
        //        and reached the tag ending...
        else if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
            return true;
          } // if the true attribute ending was met passing
        // past the suspected one, this means that
        // suspected one was a false guess. Correct ending
        // is at this index "i"


        if (str[i] === "=" && matchRight(str, i, ["'", "\""], {
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["="]
        })) {
          return true;
        }
      } else {
        // this clause is meant to catch the suspected quotes
        // which don't belong to the tag, it's where quotes
        // in question are way beyond the actual attribute's ending.
        // For example, consider
        // <div class="c' id="x'>.</div>
        //            ^        ^
        //            |        |
        //         known      suspected
        //         opening    closing
        //
        // That equal-quote after "id" would trigger the alarm,
        // that is the clause below..
        // BUT mind the false positive:
        // <img src="xyz" alt="="/>
        //                    ^ ^
        //                    | |
        //      known opening/  \suspected closing
        //
        // by the way we use right() to jump over whitespace
        // for example, this will also catch:
        // <img src="xyz" alt="=   "/>
        //
        var firstNonWhitespaceCharOnTheLeft = void 0;

        if (str[i - 1] && str[i - 1].trim().length && str[i - 1] !== "=") {
          // happy path
          firstNonWhitespaceCharOnTheLeft = i - 1;
        } else {
          for (var y = i; y--;) {
            if (str[y].trim().length && str[y] !== "=") {
              firstNonWhitespaceCharOnTheLeft = y;
              break;
            }
          }
        }

        if (str[i] === "=" && matchRight(str, i, ["'", "\""], {
          // ensure it's not tag ending on the right
          // before freaking out:
          cb: function cb(_char) {
            return !"/>".includes(_char);
          },
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["="]
        }) && // ensure it's a character suitable for attribute
        // name on the left of equal (if it's a real
        // attribute name its name characters must pass
        // the charSuitableForHTMLAttrName()...)
        charSuitableForHTMLAttrName(str[firstNonWhitespaceCharOnTheLeft])) {
          return false;
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
      //                               BOTTOM
      //                               ██████
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      // catch quotes again - these clauses are specifically at the bottom
      // because they're depdendent on "lastCapturedChunk" which is calculated
      // after quote catching at the top


      if ("'\"".includes(str[i]) && // if these quotes are after "isThisClosingIdx", a suspected closing
      i > isThisClosingIdx) {
        // if these quotes are after "isThisClosingIdx", if there
        // was no chunk recorded after it until now,
        // ("lastChunkWasCapturedAfterSuspectedClosing" flag)
        // or there was but it's not recognised, that's falsey result
        if ( // if there was no chunk recorded after it until now
        !lastChunkWasCapturedAfterSuspectedClosing || !lastCapturedChunk || // or there was but lastCapturedChunk is not recognised
        !allHtmlAttribs.has(lastCapturedChunk)) {
          return false;
        } // ELSE - it does match, so it seems legit


        return true;
      } // logging
      // -----------------------------------------------------------------------------

    } // if this point was reached and loop didn't exit...
    // default is false


    return false;
  }

  return isAttrClosing;

})));

/**
 * emlint
 * Pluggable email template code linter
 * Version: 2.9.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
 */

import tokenizer from 'codsen-tokenizer';
import defineLazyProp from 'define-lazy-prop';
import clone from 'lodash.clonedeep';
import matcher from 'matcher';
import processCommaSeparated from 'string-process-comma-separated';
import { right, left, leftStopAtNewLines } from 'string-left-right';
import isObj from 'lodash.isplainobject';
import isRegExp from 'lodash.isregexp';
import { allHtmlAttribs } from 'html-all-known-attributes';
import leven from 'leven';
import db from 'mime-db';
import isUrl from 'is-url-superb';
import isLangCode from 'is-language-code';
import isMediaD from 'is-media-descriptor';
import { notEmailFriendly } from 'html-entities-not-email-friendly';
import he from 'he';
import lineColumn from 'line-column';
import stringFixBrokenNamedEntities from 'string-fix-broken-named-entities';

var allBadCharacterRules = [
	"bad-character-acknowledge",
	"bad-character-activate-arabic-form-shaping",
	"bad-character-activate-symmetric-swapping",
	"bad-character-application-program-command",
	"bad-character-backspace",
	"bad-character-bell",
	"bad-character-break-permitted-here",
	"bad-character-cancel",
	"bad-character-cancel-character",
	"bad-character-character-tabulation-set",
	"bad-character-character-tabulation-with-justification",
	"bad-character-control-0080",
	"bad-character-control-0081",
	"bad-character-control-0084",
	"bad-character-control-0099",
	"bad-character-control-sequence-introducer",
	"bad-character-data-link-escape",
	"bad-character-delete",
	"bad-character-device-control-four",
	"bad-character-device-control-one",
	"bad-character-device-control-string",
	"bad-character-device-control-three",
	"bad-character-device-control-two",
	"bad-character-em-quad",
	"bad-character-em-space",
	"bad-character-en-quad",
	"bad-character-en-space",
	"bad-character-end-of-medium",
	"bad-character-end-of-protected-area",
	"bad-character-end-of-selected-area",
	"bad-character-end-of-text",
	"bad-character-end-of-transmission",
	"bad-character-end-of-transmission-block",
	"bad-character-enquiry",
	"bad-character-escape",
	"bad-character-figure-space",
	"bad-character-first-strong-isolate",
	"bad-character-form-feed",
	"bad-character-four-per-em-space",
	"bad-character-function-application",
	"bad-character-hair-space",
	"bad-character-ideographic-space",
	"bad-character-information-separator-four",
	"bad-character-information-separator-one",
	"bad-character-information-separator-three",
	"bad-character-information-separator-two",
	"bad-character-inhibit-arabic-form-shaping",
	"bad-character-inhibit-symmetric-swapping",
	"bad-character-interlinear-annotation-anchor",
	"bad-character-interlinear-annotation-separator",
	"bad-character-interlinear-annotation-terminator",
	"bad-character-invisible-plus",
	"bad-character-invisible-separator",
	"bad-character-invisible-times",
	"bad-character-left-to-right-embedding",
	"bad-character-left-to-right-isolate",
	"bad-character-left-to-right-mark",
	"bad-character-left-to-right-override",
	"bad-character-line-separator",
	"bad-character-line-tabulation",
	"bad-character-line-tabulation-set",
	"bad-character-medium-mathematical-space",
	"bad-character-message-waiting",
	"bad-character-narrow-no-break-space",
	"bad-character-national-digit-shapes",
	"bad-character-negative-acknowledge",
	"bad-character-next-line",
	"bad-character-no-break-here",
	"bad-character-nominal-digit-shapes",
	"bad-character-non-breaking-space",
	"bad-character-null",
	"bad-character-ogham-space-mark",
	"bad-character-operating-system-command",
	"bad-character-paragraph-separator",
	"bad-character-partial-line-backward",
	"bad-character-partial-line-forward",
	"bad-character-pop-directional-formatting",
	"bad-character-pop-directional-isolate",
	"bad-character-private-message",
	"bad-character-private-use-1",
	"bad-character-private-use-2",
	"bad-character-punctuation-space",
	"bad-character-replacement-character",
	"bad-character-reverse-line-feed",
	"bad-character-right-to-left-embedding",
	"bad-character-right-to-left-isolate",
	"bad-character-right-to-left-mark",
	"bad-character-right-to-left-override",
	"bad-character-set-transmit-state",
	"bad-character-shift-in",
	"bad-character-shift-out",
	"bad-character-single-character-introducer",
	"bad-character-single-shift-three",
	"bad-character-single-shift-two",
	"bad-character-six-per-em-space",
	"bad-character-soft-hyphen",
	"bad-character-start-of-heading",
	"bad-character-start-of-protected-area",
	"bad-character-start-of-selected-area",
	"bad-character-start-of-string",
	"bad-character-start-of-text",
	"bad-character-string-terminator",
	"bad-character-substitute",
	"bad-character-synchronous-idle",
	"bad-character-tabulation",
	"bad-character-thin-space",
	"bad-character-three-per-em-space",
	"bad-character-word-joiner",
	"bad-character-zero-width-joiner",
	"bad-character-zero-width-no-break-space",
	"bad-character-zero-width-non-joiner",
	"bad-character-zero-width-space"
];

var allTagRules = [
	"tag-bold",
	"tag-closing-backslash",
	"tag-is-present",
	"tag-name-case",
	"tag-space-after-opening-bracket",
	"tag-space-before-closing-slash",
	"tag-space-between-slash-and-bracket",
	"tag-void-slash"
];

var allAttribRules = [
	"attribute-duplicate",
	"attribute-malformed"
];

var allBadNamedHTMLEntityRules = [
	"bad-malformed-numeric-character-entity",
	"bad-named-html-entity-malformed-nbsp",
	"bad-named-html-entity-multiple-encoding",
	"bad-named-html-entity-not-email-friendly",
	"bad-named-html-entity-unrecognised"
];

function checkForWhitespace(str, idxOffset) {
  let charStart = 0;
  let charEnd = str.length;
  let trimmedVal;
  let gatheredRanges = [];
  const errorArr = [];
  if (!str.length || !str[0].trim().length) {
    charStart = right(str);
    if (!str.length || charStart === null) {
      charEnd = null;
      errorArr.push({
        idxFrom: idxOffset,
        idxTo: idxOffset + str.length,
        message: `Missing value.`,
        fix: null
      });
    } else {
      gatheredRanges.push([idxOffset, idxOffset + charStart]);
    }
  }
  if (charEnd && !str[str.length - 1].trim().length) {
    charEnd = left(str, str.length - 1) + 1;
    gatheredRanges.push([idxOffset + charEnd, idxOffset + str.length]);
  }
  if (!gatheredRanges.length) {
    trimmedVal = str;
  } else {
    errorArr.push({
      idxFrom: gatheredRanges[0][0],
      idxTo: gatheredRanges[gatheredRanges.length - 1][1],
      message: `Remove whitespace.`,
      fix: { ranges: gatheredRanges }
    });
    gatheredRanges = [];
    trimmedVal = str.trim();
  }
  return { charStart, charEnd, errorArr, trimmedVal };
}

const knownUnits = [
  "cm",
  "mm",
  "in",
  "px",
  "pt",
  "pc",
  "em",
  "ex",
  "ch",
  "rem",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "%"
];
const knownCharsets = [
  "adobe-standard-encoding",
  "adobe-symbol-encoding",
  "amiga-1251",
  "ansi_x3.110-1983",
  "asmo_449",
  "big5",
  "big5-hkscs",
  "bocu-1",
  "brf",
  "bs_4730",
  "bs_viewdata",
  "cesu-8",
  "cp50220",
  "cp51932",
  "csa_z243.4-1985-1",
  "csa_z243.4-1985-2",
  "csa_z243.4-1985-gr",
  "csn_369103",
  "dec-mcs",
  "din_66003",
  "dk-us",
  "ds_2089",
  "ebcdic-at-de",
  "ebcdic-at-de-a",
  "ebcdic-ca-fr",
  "ebcdic-dk-no",
  "ebcdic-dk-no-a",
  "ebcdic-es",
  "ebcdic-es-a",
  "ebcdic-es-s",
  "ebcdic-fi-se",
  "ebcdic-fi-se-a",
  "ebcdic-fr",
  "ebcdic-it",
  "ebcdic-pt",
  "ebcdic-uk",
  "ebcdic-us",
  "ecma-cyrillic",
  "es",
  "es2",
  "euc-kr",
  "extended_unix_code_fixed_width_for_japanese",
  "extended_unix_code_packed_format_for_japanese",
  "gb18030",
  "gb2312",
  "gb_1988-80",
  "gb_2312-80",
  "gbk",
  "gost_19768-74",
  "greek-ccitt",
  "greek7",
  "greek7-old",
  "hp-desktop",
  "hp-legal",
  "hp-math8",
  "hp-pi-font",
  "hp-roman8",
  "hz-gb-2312",
  "ibm-symbols",
  "ibm-thai",
  "ibm00858",
  "ibm00924",
  "ibm01140",
  "ibm01141",
  "ibm01142",
  "ibm01143",
  "ibm01144",
  "ibm01145",
  "ibm01146",
  "ibm01147",
  "ibm01148",
  "ibm01149",
  "ibm037",
  "ibm038",
  "ibm1026",
  "ibm1047",
  "ibm273",
  "ibm274",
  "ibm275",
  "ibm277",
  "ibm278",
  "ibm280",
  "ibm281",
  "ibm284",
  "ibm285",
  "ibm290",
  "ibm297",
  "ibm420",
  "ibm423",
  "ibm424",
  "ibm437",
  "ibm500",
  "ibm775",
  "ibm850",
  "ibm851",
  "ibm852",
  "ibm855",
  "ibm857",
  "ibm860",
  "ibm861",
  "ibm862",
  "ibm863",
  "ibm864",
  "ibm865",
  "ibm866",
  "ibm868",
  "ibm869",
  "ibm870",
  "ibm871",
  "ibm880",
  "ibm891",
  "ibm903",
  "ibm904",
  "ibm905",
  "ibm918",
  "iec_p27-1",
  "inis",
  "inis-8",
  "inis-cyrillic",
  "invariant",
  "iso-10646-j-1",
  "iso-10646-ucs-2",
  "iso-10646-ucs-4",
  "iso-10646-ucs-basic",
  "iso-10646-unicode-latin1",
  "iso-10646-utf-1",
  "iso-11548-1",
  "iso-2022-cn",
  "iso-2022-cn-ext",
  "iso-2022-jp",
  "iso-2022-jp-2",
  "iso-2022-kr",
  "iso-8859-1-windows-3.0-latin-1",
  "iso-8859-1-windows-3.1-latin-1",
  "iso-8859-10",
  "iso-8859-13",
  "iso-8859-14",
  "iso-8859-15",
  "iso-8859-16",
  "iso-8859-2-windows-latin-2",
  "iso-8859-9-windows-latin-5",
  "iso-ir-90",
  "iso-unicode-ibm-1261",
  "iso-unicode-ibm-1264",
  "iso-unicode-ibm-1265",
  "iso-unicode-ibm-1268",
  "iso-unicode-ibm-1276",
  "iso_10367-box",
  "iso_2033-1983",
  "iso_5427",
  "iso_5427:1981",
  "iso_5428:1980",
  "iso_646.basic:1983",
  "iso_646.irv:1983",
  "iso_6937-2-25",
  "iso_6937-2-add",
  "iso_8859-1:1987",
  "iso_8859-2:1987",
  "iso_8859-3:1988",
  "iso_8859-4:1988",
  "iso_8859-5:1988",
  "iso_8859-6-e",
  "iso_8859-6-i",
  "iso_8859-6:1987",
  "iso_8859-7:1987",
  "iso_8859-8-e",
  "iso_8859-8-i",
  "iso_8859-8:1988",
  "iso_8859-9:1989",
  "iso_8859-supp",
  "it",
  "jis_c6220-1969-jp",
  "jis_c6220-1969-ro",
  "jis_c6226-1978",
  "jis_c6226-1983",
  "jis_c6229-1984-a",
  "jis_c6229-1984-b",
  "jis_c6229-1984-b-add",
  "jis_c6229-1984-hand",
  "jis_c6229-1984-hand-add",
  "jis_c6229-1984-kana",
  "jis_encoding",
  "jis_x0201",
  "jis_x0212-1990",
  "jus_i.b1.002",
  "jus_i.b1.003-mac",
  "jus_i.b1.003-serb",
  "koi7-switched",
  "koi8-r",
  "koi8-u",
  "ks_c_5601-1987",
  "ksc5636",
  "kz-1048",
  "latin-greek",
  "latin-greek-1",
  "latin-lap",
  "macintosh",
  "microsoft-publishing",
  "mnem",
  "mnemonic",
  "msz_7795.3",
  "nats-dano",
  "nats-dano-add",
  "nats-sefi",
  "nats-sefi-add",
  "nc_nc00-10:81",
  "nf_z_62-010",
  "nf_z_62-010_(1973)",
  "ns_4551-1",
  "ns_4551-2",
  "osd_ebcdic_df03_irv",
  "osd_ebcdic_df04_1",
  "osd_ebcdic_df04_15",
  "pc8-danish-norwegian",
  "pc8-turkish",
  "pt",
  "pt2",
  "ptcp154",
  "scsu",
  "sen_850200_b",
  "sen_850200_c",
  "shift_jis",
  "t.101-g2",
  "t.61-7bit",
  "t.61-8bit",
  "tis-620",
  "tscii",
  "unicode-1-1",
  "unicode-1-1-utf-7",
  "unknown-8bit",
  "us-ascii",
  "us-dk",
  "utf-16",
  "utf-16be",
  "utf-16le",
  "utf-32",
  "utf-32be",
  "utf-32le",
  "utf-7",
  "utf-8",
  "ventura-international",
  "ventura-math",
  "ventura-us",
  "videotex-suppl",
  "viqr",
  "viscii",
  "windows-1250",
  "windows-1251",
  "windows-1252",
  "windows-1253",
  "windows-1254",
  "windows-1255",
  "windows-1256",
  "windows-1257",
  "windows-1258",
  "windows-31j",
  "windows-874"
];
const basicColorNames = {
  aqua: "#00ffff",
  black: "#000000",
  blue: "#0000ff",
  fuchsia: "#ff00ff",
  gray: "#808080",
  green: "#008000",
  lime: "#00ff00",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  purple: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  teal: "#008080",
  white: "#ffffff",
  yellow: "#ffff00"
};
const extendedColorNames = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgrey: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  grey: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgrey: "#d3d3d3",
  lightgreen: "#90ee90",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
const sixDigitHexColorRegex = /^#([a-f0-9]{6})$/i;
const classNameRegex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;

function validateValue({ str, opts, charStart, charEnd, idxOffset, errorArr }) {
  if (
    !"0123456789".includes(str[charStart]) &&
    !"0123456789".includes(str[charEnd - 1])
  ) {
    let message = `Digits missing.`;
    if (opts.customGenericValueError) {
      message = opts.customGenericValueError;
    } else if (
      Array.isArray(opts.theOnlyGoodUnits) &&
      !opts.theOnlyGoodUnits.length &&
      opts.type === "integer"
    ) {
      message = `Should be integer, no units.`;
    }
    errorArr.push({
      idxFrom: idxOffset + charStart,
      idxTo: idxOffset + charEnd,
      message,
      fix: null
    });
  } else if (
    "0123456789".includes(str[charStart]) &&
    "0123456789".includes(str[charEnd - 1]) &&
    !opts.noUnitsIsFine
  ) {
    errorArr.push({
      idxFrom: idxOffset + charStart,
      idxTo: idxOffset + charEnd,
      message: opts.customGenericValueError || `Units missing.`,
      fix: null
    });
  } else {
    for (let i = charStart; i < charEnd; i++) {
      if (
        !"0123456789".includes(str[i]) &&
        (str[i] !== "." || opts.type !== "rational") &&
        (str[i] !== "-" || !(opts.negativeOK && i === 0))
      ) {
        const endPart = str.slice(i, charEnd);
        if (
          isObj(opts) &&
          ((Array.isArray(opts.theOnlyGoodUnits) &&
            !opts.theOnlyGoodUnits.includes(endPart)) ||
            (Array.isArray(opts.badUnits) && opts.badUnits.includes(endPart)))
        ) {
          if (endPart === "px") {
            errorArr.push({
              idxFrom: idxOffset + i,
              idxTo: idxOffset + charEnd,
              message: `Remove px.`,
              fix: {
                ranges: [[idxOffset + i, idxOffset + charEnd]]
              }
            });
          } else {
            let message = `Bad unit.`;
            if (str.includes("--")) {
              message = `Repeated minus.`;
            } else if (
              Array.isArray(opts.theOnlyGoodUnits) &&
              opts.theOnlyGoodUnits.length &&
              opts.theOnlyGoodUnits.includes(endPart.trim())
            ) {
              message = "Rogue whitespace.";
            } else if (opts.customGenericValueError) {
              message = opts.customGenericValueError;
            } else if (
              Array.isArray(opts.theOnlyGoodUnits) &&
              !opts.theOnlyGoodUnits.length &&
              opts.type === "integer"
            ) {
              message = `Should be integer, no units.`;
            }
            errorArr.push({
              idxFrom: idxOffset + i,
              idxTo: idxOffset + charEnd,
              message,
              fix: null
            });
          }
        } else if (!knownUnits.includes(endPart)) {
          let message = "Unrecognised unit.";
          if (/\d/.test(endPart)) {
            message = "Messy value.";
          } else if (knownUnits.includes(endPart.trim())) {
            message = "Rogue whitespace.";
          }
          errorArr.push({
            idxFrom: idxOffset + i,
            idxTo: idxOffset + charEnd,
            message,
            fix: null
          });
        }
        break;
      }
    }
  }
}
function validateDigitAndUnit(str, idxOffset, originalOpts) {
  const defaultOpts = {
    type: "integer",
    whitelistValues: [],
    theOnlyGoodUnits: null,
    negativeOK: false,
    badUnits: [],
    enforceCount: null,
    noUnitsIsFine: true,
    canBeCommaSeparated: false,
    customGenericValueError: null
  };
  const opts = Object.assign({}, defaultOpts, originalOpts);
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);
  if (Number.isInteger(charStart)) {
    if (opts.canBeCommaSeparated) {
      const extractedValues = [];
      processCommaSeparated(str, {
        offset: idxOffset,
        oneSpaceAfterCommaOK: false,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        cb: (idxFrom, idxTo) => {
          const extractedValue = str.slice(
            idxFrom - idxOffset,
            idxTo - idxOffset
          );
          if (
            !Array.isArray(opts.whitelistValues) ||
            !opts.whitelistValues.includes(extractedValue)
          ) {
            validateValue({
              str,
              opts,
              charStart: idxFrom - idxOffset,
              charEnd: idxTo - idxOffset,
              idxOffset,
              errorArr
            });
          }
          extractedValues.push(extractedValue);
        },
        errCb: (ranges, message) => {
          errorArr.push({
            idxFrom: ranges[0][0],
            idxTo: ranges[ranges.length - 1][1],
            message,
            fix: {
              ranges
            }
          });
        }
      });
      if (
        Number.isInteger(opts.enforceCount) &&
        extractedValues.length !== opts.enforceCount
      ) {
        errorArr.push({
          idxFrom: charStart + idxOffset,
          idxTo: charEnd + idxOffset,
          message: `There should be ${opts.enforceCount} values.`,
          fix: null
        });
      } else if (
        typeof opts.enforceCount === "string" &&
        ["even", "odd", "uneven", "noneven"].includes(
          opts.enforceCount.toLowerCase()
        )
      ) {
        if (
          opts.enforceCount.toLowerCase() === "even" &&
          extractedValues.length % 2 !== 0
        ) {
          errorArr.push({
            idxFrom: charStart + idxOffset,
            idxTo: charEnd + idxOffset,
            message: `Should be an even number of values but found ${extractedValues.length}.`,
            fix: null
          });
        } else if (
          opts.enforceCount.toLowerCase() !== "even" &&
          extractedValues.length % 2 === 0
        ) {
          errorArr.push({
            idxFrom: charStart + idxOffset,
            idxTo: charEnd + idxOffset,
            message: `Should be an odd number of values but found ${extractedValues.length}.`,
            fix: null
          });
        }
      }
    } else {
      if (
        !Array.isArray(opts.whitelistValues) ||
        !opts.whitelistValues.includes(str.slice(charStart, charEnd))
      ) {
        validateValue({
          str,
          opts,
          charStart,
          charEnd,
          idxOffset,
          errorArr
        });
      }
    }
  }
  return errorArr;
}

function includesWithRegex(arr, whatToMatch) {
  if (!Array.isArray(arr) || !arr.length) {
    return false;
  }
  return arr.some(
    val =>
      (isRegExp(val) && whatToMatch.match(val)) ||
      (typeof val === "string" && whatToMatch === val)
  );
}

function validateValue$1(str, idxOffset, opts, charStart, charEnd, errorArr) {
  const extractedValue = str.slice(charStart, charEnd);
  if (
    !(
      includesWithRegex(opts.quickPermittedValues, extractedValue) ||
      includesWithRegex(opts.permittedValues, extractedValue)
    )
  ) {
    let fix = null;
    let message = `Unrecognised value: "${str.slice(charStart, charEnd)}".`;
    if (
      includesWithRegex(
        opts.quickPermittedValues,
        extractedValue.toLowerCase()
      ) ||
      includesWithRegex(opts.permittedValues, extractedValue.toLowerCase())
    ) {
      message = `Should be lowercase.`;
      fix = {
        ranges: [
          [
            charStart + idxOffset,
            charEnd + idxOffset,
            extractedValue.toLowerCase()
          ]
        ]
      };
    } else if (
      Array.isArray(opts.quickPermittedValues) &&
      opts.quickPermittedValues.length &&
      opts.quickPermittedValues.length < 6 &&
      opts.quickPermittedValues.every(val => typeof val === "string") &&
      (!Array.isArray(opts.permittedValues) || !opts.permittedValues.length) &&
      opts.quickPermittedValues.join("|").length < 40
    ) {
      message = `Should be "${opts.quickPermittedValues.join("|")}".`;
    } else if (
      Array.isArray(opts.permittedValues) &&
      opts.permittedValues.length &&
      opts.permittedValues.length < 6 &&
      opts.permittedValues.every(val => typeof val === "string") &&
      (!Array.isArray(opts.quickPermittedValues) ||
        !opts.quickPermittedValues.length) &&
      opts.permittedValues.join("|").length < 40
    ) {
      message = `Should be "${opts.permittedValues.join("|")}".`;
    }
    errorArr.push({
      idxFrom: charStart + idxOffset,
      idxTo: charEnd + idxOffset,
      message,
      fix
    });
  }
}
function validateString(str, idxOffset, opts) {
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);
  if (Number.isInteger(charStart)) {
    if (opts.canBeCommaSeparated) {
      processCommaSeparated(str, {
        offset: idxOffset,
        oneSpaceAfterCommaOK: false,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        cb: (idxFrom, idxTo) => {
          const extractedValue = str.slice(
            idxFrom - idxOffset,
            idxTo - idxOffset
          );
          validateValue$1(
            str,
            idxOffset,
            opts,
            idxFrom - idxOffset,
            idxTo - idxOffset,
            errorArr
          );
        },
        errCb: (ranges, message) => {
          errorArr.push({
            idxFrom: ranges[0][0],
            idxTo: ranges[ranges.length - 1][1],
            message,
            fix: {
              ranges
            }
          });
        }
      });
    } else {
      const extractedValue = str.slice(charStart, charEnd);
      validateValue$1(str, idxOffset, opts, charStart, charEnd, errorArr);
    }
  }
  return errorArr;
}

const wholeExtensionRegex = /^\.\w+$/g;
const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/g;
function isLetter(str) {
  return (
    typeof str === "string" &&
    str.length === 1 &&
    str.toUpperCase() !== str.toLowerCase()
  );
}
function isEnabled(maybeARulesValue) {
  if (Number.isInteger(maybeARulesValue) && maybeARulesValue > 0) {
    return maybeARulesValue;
  } else if (
    Array.isArray(maybeARulesValue) &&
    maybeARulesValue.length &&
    Number.isInteger(maybeARulesValue[0]) &&
    maybeARulesValue[0] > 0
  ) {
    return maybeARulesValue[0];
  }
  return 0;
}

function badCharacterNull(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 0) {
        context.report({
          ruleId: "bad-character-null",
          message: "Bad character - NULL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfHeading(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 1) {
        context.report({
          ruleId: "bad-character-start-of-heading",
          message: "Bad character - START OF HEADING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfText(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 2) {
        context.report({
          ruleId: "bad-character-start-of-text",
          message: "Bad character - START OF TEXT.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfText(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 3) {
        context.report({
          ruleId: "bad-character-end-of-text",
          message: "Bad character - END OF TEXT.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, "\n"]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfTransmission(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 4) {
        context.report({
          ruleId: "bad-character-end-of-transmission",
          message: "Bad character - END OF TRANSMISSION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEnquiry(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 5) {
        context.report({
          ruleId: "bad-character-enquiry",
          message: "Bad character - ENQUIRY.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterAcknowledge(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 6) {
        context.report({
          ruleId: "bad-character-acknowledge",
          message: "Bad character - ACKNOWLEDGE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterBell(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 7) {
        context.report({
          ruleId: "bad-character-bell",
          message: "Bad character - BELL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterBackspace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8) {
        context.report({
          ruleId: "bad-character-backspace",
          message: "Bad character - BACKSPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterTabulation(context, ...originalOpts) {
  let mode = "never";
  if (
    Array.isArray(originalOpts) &&
    originalOpts[0] &&
    typeof originalOpts[0] === "string" &&
    originalOpts[0].toLowerCase() === "indentationisfine"
  ) {
    mode = "indentationIsFine";
  }
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 9) {
        if (mode === "never") {
          context.report({
            ruleId: "bad-character-tabulation",
            message: "Bad character - TABULATION.",
            idxFrom: i,
            idxTo: i + 1,
            fix: {
              ranges: [[i, i + 1, " "]]
            }
          });
        } else if (mode === "indentationIsFine") {
          const charTopOnBreaksIdx = leftStopAtNewLines(context.str, i);
          if (
            charTopOnBreaksIdx !== null &&
            context.str[charTopOnBreaksIdx].trim().length
          ) {
            context.report({
              ruleId: "bad-character-tabulation",
              message: "Bad character - TABULATION.",
              idxFrom: i,
              idxTo: i + 1,
              fix: {
                ranges: [[i, i + 1, " "]]
              }
            });
          }
        }
      }
    }
  };
}

function badCharacterLineTabulation(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 11) {
        context.report({
          ruleId: "bad-character-line-tabulation",
          message: "Bad character - LINE TABULATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterFormFeed(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 12) {
        context.report({
          ruleId: "bad-character-form-feed",
          message: "Bad character - FORM FEED.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterShiftOut(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 14) {
        context.report({
          ruleId: "bad-character-shift-out",
          message: "Bad character - SHIFT OUT.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterShiftIn(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 15) {
        context.report({
          ruleId: "bad-character-shift-in",
          message: "Bad character - SHIFT IN.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDataLinkEscape(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 16) {
        context.report({
          ruleId: "bad-character-data-link-escape",
          message: "Bad character - DATA LINK ESCAPE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlOne(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 17) {
        context.report({
          ruleId: "bad-character-device-control-one",
          message: "Bad character - DEVICE CONTROL ONE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 18) {
        context.report({
          ruleId: "bad-character-device-control-two",
          message: "Bad character - DEVICE CONTROL TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlThree(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 19) {
        context.report({
          ruleId: "bad-character-device-control-three",
          message: "Bad character - DEVICE CONTROL THREE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlFour(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 20) {
        context.report({
          ruleId: "bad-character-device-control-four",
          message: "Bad character - DEVICE CONTROL FOUR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNegativeAcknowledge(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 21) {
        context.report({
          ruleId: "bad-character-negative-acknowledge",
          message: "Bad character - NEGATIVE ACKNOWLEDGE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSynchronousIdle(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 22) {
        context.report({
          ruleId: "bad-character-synchronous-idle",
          message: "Bad character - SYNCHRONOUS IDLE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfTransmissionBlock(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 23) {
        context.report({
          ruleId: "bad-character-end-of-transmission-block",
          message: "Bad character - END OF TRANSMISSION BLOCK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCancel(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 24) {
        context.report({
          ruleId: "bad-character-cancel",
          message: "Bad character - CANCEL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfMedium(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 25) {
        context.report({
          ruleId: "bad-character-end-of-medium",
          message: "Bad character - END OF MEDIUM.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSubstitute(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 26) {
        context.report({
          ruleId: "bad-character-substitute",
          message: "Bad character - SUBSTITUTE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEscape(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 27) {
        context.report({
          ruleId: "bad-character-escape",
          message: "Bad character - ESCAPE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorFour(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 28) {
        context.report({
          ruleId: "bad-character-information-separator-four",
          message: "Bad character - INFORMATION SEPARATOR FOUR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorThree(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 29) {
        context.report({
          ruleId: "bad-character-information-separator-three",
          message: "Bad character - INFORMATION SEPARATOR THREE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 30) {
        context.report({
          ruleId: "bad-character-information-separator-two",
          message: "Bad character - INFORMATION SEPARATOR TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInformationSeparatorTwo$1(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 31) {
        context.report({
          ruleId: "bad-character-information-separator-one",
          message: "Bad character - INFORMATION SEPARATOR ONE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDelete(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 127) {
        context.report({
          ruleId: "bad-character-delete",
          message: "Bad character - DELETE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0080(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 128) {
        context.report({
          ruleId: "bad-character-control-0080",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0081(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 129) {
        context.report({
          ruleId: "bad-character-control-0081",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterBreakPermittedHere(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 130) {
        context.report({
          ruleId: "bad-character-break-permitted-here",
          message: "Bad character - BREAK PERMITTED HERE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNoBreakHere(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 131) {
        context.report({
          ruleId: "bad-character-no-break-here",
          message: "Bad character - NO BREAK HERE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0084(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 132) {
        context.report({
          ruleId: "bad-character-control-0084",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNextLine(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 133) {
        context.report({
          ruleId: "bad-character-next-line",
          message: "Bad character - NEXT LINE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfSelectedArea(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 134) {
        context.report({
          ruleId: "bad-character-start-of-selected-area",
          message: "Bad character - START OF SELECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfSelectedArea(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 135) {
        context.report({
          ruleId: "bad-character-end-of-selected-area",
          message: "Bad character - END OF SELECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCharacterTabulationSet(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 136) {
        context.report({
          ruleId: "bad-character-character-tabulation-set",
          message: "Bad character - CHARACTER TABULATION SET.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCharacterTabulationWithJustification(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 137) {
        context.report({
          ruleId: "bad-character-character-tabulation-with-justification",
          message: "Bad character - CHARACTER TABULATION WITH JUSTIFICATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLineTabulationSet(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 138) {
        context.report({
          ruleId: "bad-character-line-tabulation-set",
          message: "Bad character - LINE TABULATION SET.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPartialLineForward(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 139) {
        context.report({
          ruleId: "bad-character-partial-line-forward",
          message: "Bad character - PARTIAL LINE FORWARD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPartialLineBackward(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 140) {
        context.report({
          ruleId: "bad-character-partial-line-backward",
          message: "Bad character - PARTIAL LINE BACKWARD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterReverseLineFeed(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 141) {
        context.report({
          ruleId: "bad-character-reverse-line-feed",
          message: "Bad character - REVERSE LINE FEED.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSingleShiftTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 142) {
        context.report({
          ruleId: "bad-character-single-shift-two",
          message: "Bad character - SINGLE SHIFT TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSingleShiftTwo$1(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 143) {
        context.report({
          ruleId: "bad-character-single-shift-three",
          message: "Bad character - SINGLE SHIFT THREE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterDeviceControlString(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 144) {
        context.report({
          ruleId: "bad-character-device-control-string",
          message: "Bad character - DEVICE CONTROL STRING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPrivateUseOne(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 145) {
        context.report({
          ruleId: "bad-character-private-use-1",
          message: "Bad character - PRIVATE USE ONE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPrivateUseTwo(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 146) {
        context.report({
          ruleId: "bad-character-private-use-2",
          message: "Bad character - PRIVATE USE TWO.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSetTransmitState(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 147) {
        context.report({
          ruleId: "bad-character-set-transmit-state",
          message: "Bad character - SET TRANSMIT STATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterCancelCharacter(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 148) {
        context.report({
          ruleId: "bad-character-cancel-character",
          message: "Bad character - CANCEL CHARACTER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterMessageWaiting(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 149) {
        context.report({
          ruleId: "bad-character-message-waiting",
          message: "Bad character - MESSAGE WAITING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfProtectedArea(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 150) {
        context.report({
          ruleId: "bad-character-start-of-protected-area",
          message: "Bad character - START OF PROTECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterEndOfProtectedArea(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 151) {
        context.report({
          ruleId: "bad-character-end-of-protected-area",
          message: "Bad character - END OF PROTECTED AREA.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStartOfString(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 152) {
        context.report({
          ruleId: "bad-character-start-of-string",
          message: "Bad character - START OF STRING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControl0099(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 153) {
        context.report({
          ruleId: "bad-character-control-0099",
          message: "Bad character - CONTROL.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSingleCharacterIntroducer(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 154) {
        context.report({
          ruleId: "bad-character-single-character-introducer",
          message: "Bad character - SINGLE CHARACTER INTRODUCER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterControlSequenceIntroducer(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 155) {
        context.report({
          ruleId: "bad-character-control-sequence-introducer",
          message: "Bad character - CONTROL SEQUENCE INTRODUCER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterStringTerminator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 156) {
        context.report({
          ruleId: "bad-character-string-terminator",
          message: "Bad character - STRING TERMINATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterOperatingSystemCommand(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 157) {
        context.report({
          ruleId: "bad-character-operating-system-command",
          message: "Bad character - OPERATING SYSTEM COMMAND.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPrivateMessage(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 158) {
        context.report({
          ruleId: "bad-character-private-message",
          message: "Bad character - PRIVATE MESSAGE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterApplicationProgramCommand(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 159) {
        context.report({
          ruleId: "bad-character-application-program-command",
          message: "Bad character - APPLICATION PROGRAM COMMAND.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterSoftHyphen(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 173) {
        context.report({
          ruleId: "bad-character-soft-hyphen",
          message: "Bad character - SOFT HYPHEN.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNonBreakingSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 160) {
        context.report({
          ruleId: "bad-character-non-breaking-space",
          message: "Bad character - NON-BREAKING SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterOghamSpaceMark(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 5760) {
        context.report({
          ruleId: "bad-character-ogham-space-mark",
          message: "Bad character - OGHAM SPACE MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEnQuad(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8192) {
        context.report({
          ruleId: "bad-character-en-quad",
          message: "Bad character - EN QUAD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEmQuad(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8193) {
        context.report({
          ruleId: "bad-character-em-quad",
          message: "Bad character - EM QUAD.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEnSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8194) {
        context.report({
          ruleId: "bad-character-en-space",
          message: "Bad character - EN SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterEmSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8195) {
        context.report({
          ruleId: "bad-character-em-space",
          message: "Bad character - EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterThreePerEmSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8196) {
        context.report({
          ruleId: "bad-character-three-per-em-space",
          message: "Bad character - THREE-PER-EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterFourPerEmSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8197) {
        context.report({
          ruleId: "bad-character-four-per-em-space",
          message: "Bad character - FOUR-PER-EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterSixPerEmSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8198) {
        context.report({
          ruleId: "bad-character-six-per-em-space",
          message: "Bad character - SIX-PER-EM SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterFigureSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8199) {
        context.report({
          ruleId: "bad-character-figure-space",
          message: "Bad character - FIGURE SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterPunctuationSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8200) {
        context.report({
          ruleId: "bad-character-punctuation-space",
          message: "Bad character - PUNCTUATION SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterThinSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8201) {
        context.report({
          ruleId: "bad-character-thin-space",
          message: "Bad character - THIN SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterHairSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8202) {
        context.report({
          ruleId: "bad-character-hair-space",
          message: "Bad character - HAIR SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8203) {
        context.report({
          ruleId: "bad-character-zero-width-space",
          message: "Bad character - ZERO WIDTH SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthNonJoiner(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8204) {
        context.report({
          ruleId: "bad-character-zero-width-non-joiner",
          message: "Bad character - ZERO WIDTH NON-JOINER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthJoiner(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8205) {
        context.report({
          ruleId: "bad-character-zero-width-joiner",
          message: "Bad character - ZERO WIDTH JOINER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightMark(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8206) {
        context.report({
          ruleId: "bad-character-left-to-right-mark",
          message: "Bad character - LEFT-TO-RIGHT MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftMark(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8207) {
        context.report({
          ruleId: "bad-character-right-to-left-mark",
          message: "Bad character - RIGHT-TO-LEFT MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightEmbedding(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8234) {
        context.report({
          ruleId: "bad-character-left-to-right-embedding",
          message: "Bad character - LEFT-TO-RIGHT EMBEDDING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftEmbedding(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8235) {
        context.report({
          ruleId: "bad-character-right-to-left-embedding",
          message: "Bad character - RIGHT-TO-LEFT EMBEDDING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPopDirectionalFormatting(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8236) {
        context.report({
          ruleId: "bad-character-pop-directional-formatting",
          message: "Bad character - POP DIRECTIONAL FORMATTING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightOverride(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8237) {
        context.report({
          ruleId: "bad-character-left-to-right-override",
          message: "Bad character - LEFT-TO-RIGHT OVERRIDE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftOverride(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8238) {
        context.report({
          ruleId: "bad-character-right-to-left-override",
          message: "Bad character - RIGHT-TO-LEFT OVERRIDE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterWordJoiner(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8288) {
        context.report({
          ruleId: "bad-character-word-joiner",
          message: "Bad character - WORD JOINER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterFunctionApplication(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8289) {
        context.report({
          ruleId: "bad-character-function-application",
          message: "Bad character - FUNCTION APPLICATION.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInvisibleTimes(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8290) {
        context.report({
          ruleId: "bad-character-invisible-times",
          message: "Bad character - INVISIBLE TIMES.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInvisibleSeparator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8291) {
        context.report({
          ruleId: "bad-character-invisible-separator",
          message: "Bad character - INVISIBLE SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInvisiblePlus(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8292) {
        context.report({
          ruleId: "bad-character-invisible-plus",
          message: "Bad character - INVISIBLE PLUS.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLeftToRightIsolate(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8294) {
        context.report({
          ruleId: "bad-character-left-to-right-isolate",
          message: "Bad character - LEFT-TO-RIGHT ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterRightToLeftIsolate(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8295) {
        context.report({
          ruleId: "bad-character-right-to-left-isolate",
          message: "Bad character - RIGHT-TO-LEFT ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterFirstStrongIsolate(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8296) {
        context.report({
          ruleId: "bad-character-first-strong-isolate",
          message: "Bad character - FIRST STRONG ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterPopDirectionalIsolate(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8297) {
        context.report({
          ruleId: "bad-character-pop-directional-isolate",
          message: "Bad character - FIRST STRONG ISOLATE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInhibitSymmetricSwapping(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8298) {
        context.report({
          ruleId: "bad-character-inhibit-symmetric-swapping",
          message: "Bad character - INHIBIT SYMMETRIC SWAPPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterActivateSymmetricSwapping(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8299) {
        context.report({
          ruleId: "bad-character-activate-symmetric-swapping",
          message: "Bad character - INHIBIT SYMMETRIC SWAPPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInhibitArabicFormShaping(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8300) {
        context.report({
          ruleId: "bad-character-inhibit-arabic-form-shaping",
          message: "Bad character - INHIBIT ARABIC FORM SHAPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterActivateArabicFormShaping(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8301) {
        context.report({
          ruleId: "bad-character-activate-arabic-form-shaping",
          message: "Bad character - ACTIVATE ARABIC FORM SHAPING.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNationalDigitShapes(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8302) {
        context.report({
          ruleId: "bad-character-national-digit-shapes",
          message: "Bad character - NATIONAL DIGIT SHAPES.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNominalDigitShapes(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8303) {
        context.report({
          ruleId: "bad-character-nominal-digit-shapes",
          message: "Bad character - NOMINAL DIGIT SHAPES.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterZeroWidthNoBreakSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 65279) {
        context.report({
          ruleId: "bad-character-zero-width-no-break-space",
          message: "Bad character - ZERO WIDTH NO-BREAK SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInterlinearAnnotationAnchor(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 65529) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-anchor",
          message: "Bad character - INTERLINEAR ANNOTATION ANCHOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInterlinearAnnotationSeparator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 65530) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-separator",
          message: "Bad character - INTERLINEAR ANNOTATION SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterInterlinearAnnotationTerminator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 65531) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-terminator",
          message: "Bad character - INTERLINEAR ANNOTATION TERMINATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterLineSeparator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8232) {
        context.report({
          ruleId: "bad-character-line-separator",
          message: "Bad character - LINE SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterParagraphSeparator(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8233) {
        context.report({
          ruleId: "bad-character-paragraph-separator",
          message: "Bad character - PARAGRAPH SEPARATOR.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function badCharacterNarrowNoBreakSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8239) {
        context.report({
          ruleId: "bad-character-narrow-no-break-space",
          message: "Bad character - NARROW NO-BREAK SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterMediumMathematicalSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 8287) {
        context.report({
          ruleId: "bad-character-medium-mathematical-space",
          message: "Bad character - MEDIUM MATHEMATICAL SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterIdeographicSpace(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 12288) {
        context.report({
          ruleId: "bad-character-ideographic-space",
          message: "Bad character - IDEOGRAPHIC SPACE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]]
          }
        });
      }
    }
  };
}

function badCharacterReplacementCharacter(context) {
  return {
    character: function({ chr, i }) {
      if (chr.charCodeAt(0) === 65533) {
        context.report({
          ruleId: "bad-character-replacement-character",
          message: "Bad character - REPLACEMENT CHARACTER.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]]
          }
        });
      }
    }
  };
}

function tagSpaceAfterOpeningBracket(context) {
  return {
    html: function(node) {
      const ranges = [];
      if (
        typeof context.str[node.start + 1] === "string" &&
        !context.str[node.start + 1].trim().length
      ) {
        ranges.push([node.start + 1, right(context.str, node.start + 1)]);
      }
      if (!context.str[node.tagNameStartAt - 1].trim().length) {
        const charToTheLeftOfTagNameIdx = left(
          context.str,
          node.tagNameStartAt
        );
        if (charToTheLeftOfTagNameIdx !== node.start) {
          ranges.push([charToTheLeftOfTagNameIdx + 1, node.tagNameStartAt]);
        }
      }
      if (ranges.length) {
        context.report({
          ruleId: "tag-space-after-opening-bracket",
          message: "Bad whitespace.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1],
          fix: { ranges }
        });
      }
    }
  };
}

function tagSpaceBeforeClosingSlash(context, ...opts) {
  return {
    html: function(node) {
      const gapValue = context.str.slice(node.start + 1, node.tagNameStartAt);
      let mode = "never";
      if (Array.isArray(opts) && ["always", "never"].includes(opts[0])) {
        mode = opts[0];
      }
      const closingBracketPos = node.end - 1;
      const slashPos = left(context.str, closingBracketPos);
      const leftOfSlashPos = left(context.str, slashPos);
      if (
        mode === "never" &&
        node.void &&
        context.str[slashPos] === "/" &&
        leftOfSlashPos < slashPos - 1
      ) {
        context.report({
          ruleId: "tag-space-before-closing-slash",
          message: "Bad whitespace.",
          idxFrom: leftOfSlashPos + 1,
          idxTo: slashPos,
          fix: { ranges: [[leftOfSlashPos + 1, slashPos]] }
        });
      } else if (
        mode === "always" &&
        node.void &&
        context.str[slashPos] === "/" &&
        leftOfSlashPos === slashPos - 1
      ) {
        context.report({
          ruleId: "tag-space-before-closing-slash",
          message: "Missing space.",
          idxFrom: slashPos,
          idxTo: slashPos,
          fix: { ranges: [[slashPos, slashPos, " "]] }
        });
      }
    }
  };
}

function tagSpaceBetweenSlashAndBracket(context) {
  return {
    html: function(node) {
      if (
        Number.isInteger(node.end) &&
        context.str[node.end - 1] === ">" &&
        context.str[left(context.str, node.end - 1)] === "/" &&
        left(context.str, node.end - 1) < node.end - 2
      ) {
        const idxFrom = left(context.str, node.end - 1) + 1;
        context.report({
          ruleId: "tag-space-between-slash-and-bracket",
          message: "Bad whitespace.",
          idxFrom,
          idxTo: node.end - 1,
          fix: { ranges: [[idxFrom, node.end - 1]] }
        });
      }
    }
  };
}

const BACKSLASH = "\u005C";
function tagClosingBackslash(context) {
  return {
    html: function(node) {
      const ranges = [];
      if (
        Number.isInteger(node.start) &&
        Number.isInteger(node.tagNameStartAt) &&
        context.str.slice(node.start, node.tagNameStartAt).includes(BACKSLASH)
      ) {
        for (let i = node.start; i < node.tagNameStartAt; i++) {
          if (context.str[i] === BACKSLASH) {
            ranges.push([i, i + 1]);
          }
        }
      }
      if (
        Number.isInteger(node.end) &&
        context.str[node.end - 1] === ">" &&
        context.str[left(context.str, node.end - 1)] === BACKSLASH
      ) {
        let message = node.void
          ? "Replace backslash with slash."
          : "Delete this.";
        const backSlashPos = left(context.str, node.end - 1);
        let idxFrom = left(context.str, backSlashPos) + 1;
        let whatToInsert = node.void ? "/" : "";
        if (
          context.processedRulesConfig["tag-space-before-closing-slash"] &&
          ((Number.isInteger(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
            context.processedRulesConfig["tag-space-before-closing-slash"] >
              0) ||
            (Array.isArray(
              context.processedRulesConfig["tag-space-before-closing-slash"]
            ) &&
              context.processedRulesConfig[
                "tag-space-before-closing-slash"
              ][0] > 0 &&
              context.processedRulesConfig[
                "tag-space-before-closing-slash"
              ][1] === "never"))
        ) {
          idxFrom = left(context.str, backSlashPos) + 1;
        }
        if (
          Array.isArray(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
          context.processedRulesConfig["tag-space-before-closing-slash"][0] >
            0 &&
          context.processedRulesConfig["tag-space-before-closing-slash"][1] ===
            "always"
        ) {
          idxFrom = left(context.str, backSlashPos) + 1;
          whatToInsert = ` ${whatToInsert}`;
          if (node.void && context.str[idxFrom + 1] === " ") {
            idxFrom++;
            whatToInsert = whatToInsert.trim();
          } else if (!node.void) {
            whatToInsert = whatToInsert.trim();
          }
        }
        if (
          node.void &&
          Array.isArray(context.processedRulesConfig["tag-void-slash"]) &&
          context.processedRulesConfig["tag-void-slash"][0] > 0 &&
          context.processedRulesConfig["tag-void-slash"][1] === "never"
        ) {
          whatToInsert = "";
          idxFrom = left(context.str, backSlashPos) + 1;
          message = "Delete this.";
        }
        context.report({
          ruleId: "tag-closing-backslash",
          message,
          idxFrom,
          idxTo: node.end - 1,
          fix: { ranges: [[idxFrom, node.end - 1, whatToInsert]] }
        });
      }
      if (ranges.length) {
        context.report({
          ruleId: "tag-closing-backslash",
          message: "Wrong slash - backslash.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1],
          fix: { ranges }
        });
      }
    }
  };
}

const BACKSLASH$1 = "\u005C";
function tagVoidSlash(context, ...opts) {
  return {
    html: function(node) {
      let mode = "always";
      if (Array.isArray(opts) && ["always", "never"].includes(opts[0])) {
        mode = opts[0];
      }
      const closingBracketPos = node.end - 1;
      const slashPos = left(context.str, closingBracketPos);
      const leftOfSlashPos = left(context.str, slashPos);
      if (mode === "never" && node.void && context.str[slashPos] === "/") {
        context.report({
          ruleId: "tag-void-slash",
          message: "Remove the slash.",
          idxFrom: leftOfSlashPos + 1,
          idxTo: closingBracketPos,
          fix: { ranges: [[leftOfSlashPos + 1, closingBracketPos]] }
        });
      } else if (
        mode === "always" &&
        node.void &&
        context.str[slashPos] !== "/" &&
        (!context.processedRulesConfig["tag-closing-backslash"] ||
          !(
            context.str[slashPos] === BACKSLASH$1 &&
            ((Number.isInteger(
              context.processedRulesConfig["tag-closing-backslash"]
            ) &&
              context.processedRulesConfig["tag-closing-backslash"] > 0) ||
              (Array.isArray(
                context.processedRulesConfig["tag-closing-backslash"]
              ) &&
                context.processedRulesConfig["tag-closing-backslash"][0] > 0 &&
                context.processedRulesConfig["tag-closing-backslash"][1] ===
                  "always"))
          ))
      ) {
        if (
          Array.isArray(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
          context.processedRulesConfig["tag-space-before-closing-slash"][1] ===
            "always"
        ) {
          if (context.str[slashPos + 1] === " ") {
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: slashPos + 2,
              idxTo: closingBracketPos,
              fix: { ranges: [[slashPos + 2, closingBracketPos, "/"]] }
            });
          } else {
            context.report({
              ruleId: "tag-void-slash",
              message: "Missing slash.",
              idxFrom: slashPos + 1,
              idxTo: closingBracketPos,
              fix: { ranges: [[slashPos + 1, closingBracketPos, " /"]] }
            });
          }
        } else if (
          context.processedRulesConfig["tag-space-before-closing-slash"] ===
            undefined ||
          (Array.isArray(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
            context.processedRulesConfig[
              "tag-space-before-closing-slash"
            ][1] === "never") ||
          (Number.isInteger(
            context.processedRulesConfig["tag-space-before-closing-slash"]
          ) &&
            context.processedRulesConfig["tag-space-before-closing-slash"] > 0)
        ) {
          context.report({
            ruleId: "tag-void-slash",
            message: "Missing slash.",
            idxFrom: slashPos + 1,
            idxTo: closingBracketPos,
            fix: { ranges: [[slashPos + 1, closingBracketPos, "/"]] }
          });
        }
      }
    }
  };
}

function tagNameCase(context) {
  const knownUpperCaseTags = ["DOCTYPE", "CDATA"];
  return {
    html: function(node) {
      if (node.tagName && node.recognised === true) {
        if (knownUpperCaseTags.includes(node.tagName.toUpperCase())) {
          if (
            context.str.slice(node.tagNameStartAt, node.tagNameEndAt) !==
            node.tagName.toUpperCase()
          ) {
            const ranges = [
              [
                node.tagNameStartAt,
                node.tagNameEndAt,
                node.tagName.toUpperCase()
              ]
            ];
            context.report({
              ruleId: "tag-name-case",
              message: "Bad tag name case.",
              idxFrom: node.tagNameStartAt,
              idxTo: node.tagNameEndAt,
              fix: { ranges }
            });
          }
        } else if (
          context.str.slice(node.tagNameStartAt, node.tagNameEndAt) !==
          node.tagName
        ) {
          const ranges = [
            [node.tagNameStartAt, node.tagNameEndAt, node.tagName]
          ];
          context.report({
            ruleId: "tag-name-case",
            message: "Bad tag name case.",
            idxFrom: node.tagNameStartAt,
            idxTo: node.tagNameEndAt,
            fix: { ranges }
          });
        }
      }
    }
  };
}

function tagIsPresent(context, ...opts) {
  return {
    html: function(node) {
      if (Array.isArray(opts) && opts.length) {
        const temp = matcher([node.tagName], opts);
        if (matcher([node.tagName], opts).length) {
          context.report({
            ruleId: "tag-is-present",
            message: `${node.tagName} is not allowed.`,
            idxFrom: node.start,
            idxTo: node.end,
            fix: { ranges: [[node.start, node.end]] }
          });
        }
      }
    }
  };
}

function tagBold(context, ...opts) {
  return {
    html: function(node) {
      let suggested = "strong";
      if (
        Array.isArray(opts) &&
        typeof opts[0] === "string" &&
        opts[0].toLowerCase() === "b"
      ) {
        suggested = "b";
      }
      if (node.tagName === "bold") {
        context.report({
          ruleId: "tag-bold",
          message: `Tag "bold" does not exist in HTML.`,
          idxFrom: node.start,
          idxTo: node.end,
          fix: { ranges: [[node.tagNameStartAt, node.tagNameEndAt, suggested]] }
        });
      }
    }
  };
}

function attributeDuplicate(context, ...opts) {
  return {
    html: function(node) {
      if (Array.isArray(node.attribs) && node.attribs.length > 1) {
        const attrsGatheredSoFar = [];
        for (let i = 0, len = node.attribs.length; i < len; i++) {
          if (!attrsGatheredSoFar.includes(node.attribs[i].attribName)) {
            attrsGatheredSoFar.push(node.attribs[i].attribName);
          } else {
            context.report({
              ruleId: "attribute-duplicate",
              message: `Duplicate attribute "${node.attribs[i].attribName}".`,
              idxFrom: node.attribs[i].attribStart,
              idxTo: node.attribs[i].attribEnd,
              fix: null
            });
          }
        }
      }
    }
  };
}

function attributeMalformed(context, ...opts) {
  const blacklist = ["doctype"];
  return {
    attribute: function(node) {
      if (
        !node.attribNameRecognised &&
        !node.attribName.startsWith("xmlns:") &&
        !blacklist.includes(node.parent.tagName)
      ) {
        let somethingMatched = false;
        for (let i = 0, len = allHtmlAttribs.length; i < len; i++) {
          if (leven(allHtmlAttribs[i], node.attribName) === 1) {
            context.report({
              ruleId: "attribute-malformed",
              message: `Probably meant "${allHtmlAttribs[i]}".`,
              idxFrom: node.attribNameStartAt,
              idxTo: node.attribNameEndAt,
              fix: {
                ranges: [
                  [
                    node.attribNameStartAt,
                    node.attribNameEndAt,
                    allHtmlAttribs[i]
                  ]
                ]
              }
            });
            somethingMatched = true;
            break;
          }
        }
        if (!somethingMatched) {
          context.report({
            ruleId: "attribute-malformed",
            message: `Unrecognised attribute "${node.attribName}".`,
            idxFrom: node.attribNameStartAt,
            idxTo: node.attribNameEndAt,
            fix: null
          });
        }
      }
      if (
        node.attribValueStartAt !== null &&
        context.str[node.attribNameEndAt] !== "="
      ) {
        context.report({
          ruleId: "attribute-malformed",
          message: `Equal is missing.`,
          idxFrom: node.attribStart,
          idxTo: node.attribEnd,
          fix: { ranges: [[node.attribNameEndAt, node.attribNameEndAt, "="]] }
        });
      }
    }
  };
}

function attributeValidateAbbr(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "abbr") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-abbr",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-abbr"
            })
          );
        });
      }
    }
  };
}

function attributeValidateAcceptCharset(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "accept-charset") {
        if (!["form"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-accept-charset",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            canBeCommaSeparated: true,
            noSpaceAfterComma: true,
            quickPermittedValues: ["UNKNOWN"],
            permittedValues: knownCharsets
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-accept-charset"
            })
          );
        });
      }
    }
  };
}

function attributeValidateAccept(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "accept") {
        if (!["form", "input"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-accept",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            quickPermittedValues: [
              "audio/*",
              "video/*",
              "image/*",
              "text/html",
              "image/png",
              "image/gif",
              "video/mpeg",
              "text/css",
              "audio/basic",
              wholeExtensionRegex
            ],
            permittedValues: Object.keys(db),
            canBeCommaSeparated: true,
            noSpaceAfterComma: true
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-accept"
            })
          );
        });
      }
    }
  };
}

function attributeValidateAccesskey(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "accesskey") {
        if (
          ![
            "a",
            "area",
            "button",
            "input",
            "label",
            "legend",
            "textarea"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-accesskey",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr, trimmedVal } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        if (Number.isInteger(charStart)) {
          if (
            trimmedVal.length > 1 &&
            !(trimmedVal.startsWith("&") && trimmedVal.endsWith(";"))
          ) {
            errorArr.push({
              idxFrom: node.attribValueStartAt + charStart,
              idxTo: node.attribValueStartAt + charEnd,
              message: `Should be a single character (escaped or not).`,
              fix: null
            });
          }
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-accesskey"
            })
          );
        });
      }
    }
  };
}

function attributeValidateAction(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "action") {
        if (!["form"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-action",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        if (
          !isUrl(
            context.str.slice(
              node.attribValueStartAt + charStart,
              node.attribValueStartAt + charEnd
            )
          )
        ) {
          errorArr.push({
            idxFrom: node.attribValueStartAt + charStart,
            idxTo: node.attribValueStartAt + charEnd,
            message: `Should be an URI.`,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-action"
            })
          );
        });
      }
    }
  };
}

function attributeValidateAlign(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "align") {
        if (
          ![
            "applet",
            "caption",
            "iframe",
            "img",
            "input",
            "object",
            "legend",
            "table",
            "hr",
            "div",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
            "col",
            "colgroup",
            "tbody",
            "td",
            "tfoot",
            "th",
            "thead",
            "tr"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-align",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        let errorArr = [];
        if (["legend", "caption"].includes(node.parent.tagName.toLowerCase())) {
          errorArr = validateString(
            node.attribValue,
            node.attribValueStartAt,
            {
              permittedValues: ["top", "bottom", "left", "right"],
              canBeCommaSeparated: false
            }
          );
        } else if (
          ["applet", "iframe", "img", "input", "object"].includes(
            node.parent.tagName.toLowerCase()
          )
        ) {
          errorArr = validateString(
            node.attribValue,
            node.attribValueStartAt,
            {
              permittedValues: ["top", "middle", "bottom", "left", "right"],
              canBeCommaSeparated: false
            }
          );
        } else if (
          ["table", "hr"].includes(node.parent.tagName.toLowerCase())
        ) {
          errorArr = validateString(
            node.attribValue,
            node.attribValueStartAt,
            {
              permittedValues: ["left", "center", "right"],
              canBeCommaSeparated: false
            }
          );
        } else if (
          ["div", "h1", "h2", "h3", "h4", "h5", "h6", "p"].includes(
            node.parent.tagName.toLowerCase()
          )
        ) {
          errorArr = validateString(
            node.attribValue,
            node.attribValueStartAt,
            {
              permittedValues: ["left", "center", "right", "justify"],
              canBeCommaSeparated: false
            }
          );
        } else if (
          [
            "col",
            "colgroup",
            "tbody",
            "td",
            "tfoot",
            "th",
            "thead",
            "tr"
          ].includes(node.parent.tagName.toLowerCase())
        ) {
          errorArr = validateString(
            node.attribValue,
            node.attribValueStartAt,
            {
              permittedValues: ["left", "center", "right", "justify", "char"],
              canBeCommaSeparated: false
            }
          );
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-align"
            })
          );
        });
      }
    }
  };
}

function validateColor(str, idxOffset, opts) {
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);
  if (Number.isInteger(charStart)) {
    const attrVal = errorArr.length ? str.slice(charStart, charEnd) : str;
    if (
      attrVal.length > 1 &&
      isLetter(attrVal[0]) &&
      isLetter(attrVal[1]) &&
      Object.keys(extendedColorNames).includes(attrVal.toLowerCase())
    ) {
      if (!opts.namedCssLevel1OK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Named colors (CSS Level 1) not allowed.`,
          fix: {
            ranges: [
              [
                idxOffset + charStart,
                idxOffset + charEnd,
                extendedColorNames[attrVal.toLowerCase()]
              ]
            ]
          }
        });
      } else if (
        !opts.namedCssLevel2PlusOK &&
        (!opts.namedCssLevel1OK ||
          !Object.keys(basicColorNames).includes(attrVal.toLowerCase()))
      ) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Named colors (CSS Level 2+) not allowed.`,
          fix: {
            ranges: [
              [
                idxOffset + charStart,
                idxOffset + charEnd,
                extendedColorNames[attrVal.toLowerCase()]
              ]
            ]
          }
        });
      }
    } else if (attrVal.startsWith("#")) {
      if (attrVal.length !== 7) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Hex color code should be 6 digits-long.`,
          fix: null
        });
      } else if (!sixDigitHexColorRegex.test(attrVal)) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Unrecognised hex code.`,
          fix: null
        });
      } else if (!opts.hexSixOK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Hex colors not allowed.`,
          fix: null
        });
      }
    } else if (attrVal.startsWith("rgb(")) {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `rgb() is not allowed.`,
        fix: null
      });
    } else {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `Unrecognised color value.`,
        fix: null
      });
    }
  }
  return errorArr;
}

function attributeValidateAlink(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "alink") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-alink",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateColor(
          node.attribValue,
          node.attribValueStartAt,
          {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-alink"
            })
          );
        });
      }
    }
  };
}

function attributeValidateAlt(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "alt") {
        if (!["applet", "area", "img", "input"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-alt",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-alt"
            })
          );
        });
      }
    }
  };
}

function attributeValidateArchive(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "archive") {
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-archive",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        let trimmedAttrVal = node.attribValue;
        if (errorArr.length) {
          trimmedAttrVal = node.attribValue.slice(charStart, charEnd);
        }
        if (node.parent.tagName === "applet") {
          processCommaSeparated(node.attribValue, {
            offset: node.attribValueStartAt,
            oneSpaceAfterCommaOK: false,
            leadingWhitespaceOK: true,
            trailingWhitespaceOK: true,
            cb: (idxFrom, idxTo) => {
              if (!isUrl(context.str.slice(idxFrom, idxTo))) {
                errorArr.push({
                  idxFrom: idxFrom,
                  idxTo: idxTo,
                  message: `Should be an URI.`,
                  fix: null
                });
              }
            },
            errCb: (ranges, message, fixable) => {
              errorArr.push({
                idxFrom: ranges[0][0],
                idxTo: ranges[ranges.length - 1][1],
                message,
                fix: fixable
                  ? {
                      ranges
                    }
                  : null
              });
            }
          });
        } else if (node.parent.tagName === "object") {
          trimmedAttrVal.split(" ").forEach(uriStr => {
            if (!isUrl(uriStr)) {
              errorArr.push({
                idxFrom: node.attribValueStartAt,
                idxTo: node.attribValueEndAt,
                message: `Should be space-separated list of URI's.`,
                fix: null
              });
            }
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-archive"
            })
          );
        });
      }
    }
  };
}

function attributeValidateAxis(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "axis") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-axis",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-axis"
            })
          );
        });
      }
    }
  };
}

function attributeValidateBackground(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "background") {
        if (!["body", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-background",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr, trimmedVal } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        if (!isUrl(trimmedVal)) {
          if (
            !Array.from(trimmedVal).some(char => !char.trim().length) &&
            /\w\.\w/.test(trimmedVal) &&
            /[^\\/]+$/.test(trimmedVal)
          ) {
            if (!(Array.isArray(opts) && opts.includes("localOK"))) {
              errorArr.push({
                idxFrom: node.attribValueStartAt + charStart,
                idxTo: node.attribValueStartAt + charEnd,
                message: `Should be an external URI.`,
                fix: null
              });
            }
          } else {
            errorArr.push({
              idxFrom: node.attribValueStartAt + charStart,
              idxTo: node.attribValueStartAt + charEnd,
              message: `Should be an URI.`,
              fix: null
            });
          }
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-background"
            })
          );
        });
      }
    }
  };
}

function attributeValidateBgcolor(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "bgcolor") {
        if (
          !["table", "tr", "td", "th", "body"].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-bgcolor",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateColor(
          node.attribValue,
          node.attribValueStartAt,
          {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-bgcolor"
            })
          );
        });
      }
    }
  };
}

function attributeValidateBorder(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "border") {
        if (!["table", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-border",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            type: "integer",
            negativeOK: false,
            theOnlyGoodUnits: []
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-border"
            })
          );
        });
      }
    }
  };
}

function attributeValidateCellpadding(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "cellpadding") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-cellpadding",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            type: "integer",
            negativeOK: false,
            theOnlyGoodUnits: ["%"],
            badUnits: ["px"],
            customGenericValueError:
              "Should be integer, either no units or percentage."
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-cellpadding"
            })
          );
        });
      }
    }
  };
}

function attributeValidateCellspacing(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "cellspacing") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-cellspacing",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            type: "integer",
            negativeOK: false,
            theOnlyGoodUnits: ["%"],
            badUnits: ["px"],
            customGenericValueError:
              "Should be integer, either no units or percentage."
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-cellspacing"
            })
          );
        });
      }
    }
  };
}

function attributeValidateChar(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "char") {
        if (
          ![
            "col",
            "colgroup",
            "tbody",
            "td",
            "tfoot",
            "th",
            "thead",
            "tr"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-char",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr, trimmedVal } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        if (Number.isInteger(charStart)) {
          if (
            trimmedVal.length > 1 &&
            !(trimmedVal.startsWith("&") && trimmedVal.endsWith(";"))
          ) {
            errorArr.push({
              idxFrom: node.attribValueStartAt + charStart,
              idxTo: node.attribValueStartAt + charEnd,
              message: `Should be a single character.`,
              fix: null
            });
          }
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-char"
            })
          );
        });
      }
    }
  };
}

function attributeValidateCharoff(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "charoff") {
        if (
          ![
            "col",
            "colgroup",
            "tbody",
            "td",
            "tfoot",
            "th",
            "thead",
            "tr"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-charoff",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            type: "integer",
            negativeOK: true,
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units."
          }
        );
        if (
          !node.parent.attribs.some(
            attribObj => attribObj.attribName === "char"
          )
        ) {
          errorArr.push({
            idxFrom: node.parent.start,
            idxTo: node.parent.end,
            message: `Attribute "char" missing.`,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-charoff"
            })
          );
        });
      }
    }
  };
}

function attributeValidateCharset(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "charset") {
        if (!["a", "link", "script"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-charset",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            canBeCommaSeparated: false,
            noSpaceAfterComma: false,
            quickPermittedValues: [],
            permittedValues: knownCharsets
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-charset"
            })
          );
        });
      }
    }
  };
}

function validateVoid(node, context, errorArr, originalOpts) {
  const defaults = {
    xhtml: false,
    enforceSiblingAttributes: null
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (opts.xhtml) {
    let quotesType = `"`;
    if (
      node.attribOpeningQuoteAt !== null &&
      context.str[node.attribOpeningQuoteAt] === `'`
    ) {
      quotesType = `'`;
    } else if (
      node.attribClosingQuoteAt !== null &&
      context.str[node.attribClosingQuoteAt] === `'`
    ) {
      quotesType = `'`;
    }
    if (
      node.attribValue !== node.attribName ||
      context.str.slice(node.attribNameEndAt, node.attribEnd) !==
        `=${quotesType}${node.attribName}${quotesType}`
    ) {
      errorArr.push({
        idxFrom: node.attribNameStartAt,
        idxTo: node.attribNameEndAt,
        message: `It's XHTML, add value, ="${node.attribName}".`,
        fix: {
          ranges: [
            [
              node.attribNameEndAt,
              node.attribEnd,
              `=${quotesType}${node.attribName}${quotesType}`
            ]
          ]
        }
      });
    }
  } else if (node.attribValue !== null) {
    errorArr.push({
      idxFrom: node.attribNameEndAt,
      idxTo: node.attribEnd,
      message: `Should have no value.`,
      fix: {
        ranges: [[node.attribNameEndAt, node.attribEnd]]
      }
    });
  }
  if (
    isObj(opts.enforceSiblingAttributes) &&
    Object.keys(opts.enforceSiblingAttributes).length
  ) {
    Object.keys(opts.enforceSiblingAttributes).forEach(siblingAttr => {
      if (
        Array.isArray(node.parent.attribs) &&
        !node.parent.attribs.some(
          attribObj => attribObj.attribName === siblingAttr
        )
      ) {
        errorArr.push({
          idxFrom: node.parent.start,
          idxTo: node.parent.end,
          message: `Should have attribute "${siblingAttr}".`,
          fix: null
        });
      } else if (
        opts.enforceSiblingAttributes[siblingAttr] &&
        Array.isArray(opts.enforceSiblingAttributes[siblingAttr]) &&
        Array.isArray(node.parent.attribs) &&
        !node.parent.attribs.some(
          attribObj =>
            attribObj.attribName === siblingAttr &&
            opts.enforceSiblingAttributes[siblingAttr].includes(
              attribObj.attribValue
            )
        )
      ) {
        let idxFrom;
        let idxTo;
        for (let i = 0, len = node.parent.attribs.length; i < len; i++) {
          if (node.parent.attribs[i].attribName === siblingAttr) {
            idxFrom = node.parent.attribs[i].attribValueStartAt;
            idxTo = node.parent.attribs[i].attribValueEndAt;
            break;
          }
        }
        errorArr.push({
          idxFrom,
          idxTo,
          message: `Only tags with ${opts.enforceSiblingAttributes[siblingAttr]
            .map(val => `"${val}"`)
            .join(" or ")} attributes can be ${node.attribName}.`,
          fix: null
        });
      }
    });
  }
  return errorArr;
}

function attributeValidateChecked(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "checked") {
        if (node.parent.tagName !== "input") {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: {
                type: ["checkbox", "radio"]
              }
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-checked"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateCite(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "cite") {
        if (!["blockquote", "q", "del", "ins"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-cite",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        if (
          !isUrl(
            context.str.slice(
              node.attribValueStartAt + charStart,
              node.attribValueStartAt + charEnd
            )
          )
        ) {
          errorArr.push({
            idxFrom: node.attribValueStartAt + charStart,
            idxTo: node.attribValueStartAt + charEnd,
            message: `Should be an URI.`,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-cite"
            })
          );
        });
      }
    }
  };
}

function checkClassOrIdValue(str, from, to, errorArr, originalOpts) {
  const defaults = {
    typeName: "class"
  };
  const opts = Object.assign({}, defaults, originalOpts);
  let nameStartsAt = null;
  let nameEndsAt = null;
  const listOfUniqueNames = [];
  for (let i = from; i < to; i++) {
    if (nameStartsAt === null && str[i].trim().length) {
      nameStartsAt = i;
      if (nameEndsAt !== null && str.slice(nameEndsAt, i) !== " ") {
        let ranges;
        if (str[nameEndsAt] === " ") {
          ranges = [[nameEndsAt + 1, i]];
        } else if (str[i - 1] === " ") {
          ranges = [[nameEndsAt, i - 1]];
        } else {
          ranges = [[nameEndsAt, i, " "]];
        }
        errorArr.push({
          idxFrom: nameEndsAt,
          idxTo: i,
          message: `Should be a single space.`,
          fix: {
            ranges
          }
        });
        nameEndsAt = null;
      }
    }
    if (nameStartsAt !== null && (!str[i].trim().length || i + 1 === to)) {
      nameEndsAt = i + 1 === to ? i + 1 : i;
      const extractedName = str.slice(nameStartsAt, i + 1 === to ? i + 1 : i);
      if (!classNameRegex.test(extractedName)) {
        errorArr.push({
          idxFrom: nameStartsAt,
          idxTo: i + 1 === to ? i + 1 : i,
          message: `Wrong ${opts.typeName} name.`,
          fix: null
        });
      }
      if (!listOfUniqueNames.includes(extractedName)) {
        listOfUniqueNames.push(extractedName);
      } else {
        let deleteFrom = nameStartsAt;
        let deleteTo = i + 1 === to ? i + 1 : i;
        const nonWhitespaceCharOnTheRight = right(str, deleteTo);
        if (
          deleteTo >= to ||
          !nonWhitespaceCharOnTheRight ||
          nonWhitespaceCharOnTheRight > to
        ) {
          deleteFrom = left(str, nameStartsAt) + 1;
        } else {
          deleteTo = nonWhitespaceCharOnTheRight;
        }
        errorArr.push({
          idxFrom: nameStartsAt,
          idxTo: i + 1 === to ? i + 1 : i,
          message: `Duplicate ${opts.typeName} "${extractedName}".`,
          fix: {
            ranges: [[deleteFrom, deleteTo]]
          }
        });
      }
      nameStartsAt = null;
    }
  }
}

function attributeValidateClass(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "class") {
        if (
          [
            "base",
            "basefont",
            "head",
            "html",
            "meta",
            "param",
            "script",
            "style",
            "title"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-class",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValue,
            node.attribValueStartAt
          );
          checkClassOrIdValue(
            context.str,
            node.attribValueStartAt + charStart,
            node.attribValueStartAt + charEnd,
            errorArr,
            {
              typeName: node.attribName
            }
          );
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-class"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateClassid(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "classid") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-classid",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        if (
          !isUrl(
            context.str.slice(
              node.attribValueStartAt + charStart,
              node.attribValueStartAt + charEnd
            )
          )
        ) {
          errorArr.push({
            idxFrom: node.attribValueStartAt + charStart,
            idxTo: node.attribValueStartAt + charEnd,
            message: `Should be an URI.`,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-classid"
            })
          );
        });
      }
    }
  };
}

function attributeValidateClassid$1(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "clear") {
        if (node.parent.tagName !== "br") {
          context.report({
            ruleId: "attribute-validate-clear",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        if (
          !["left", "all", "right", "none"].includes(
            context.str.slice(
              node.attribValueStartAt + charStart,
              node.attribValueStartAt + charEnd
            )
          )
        ) {
          errorArr.push({
            idxFrom: node.attribValueStartAt + charStart,
            idxTo: node.attribValueStartAt + charEnd,
            message: `Should be: left|all|right|none.`,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-clear"
            })
          );
        });
      }
    }
  };
}

function attributeValidateCode(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "code") {
        if (node.parent.tagName !== "applet") {
          context.report({
            ruleId: "attribute-validate-code",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-code"
            })
          );
        });
      }
    }
  };
}

function attributeValidateCodebase(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "codebase") {
        if (!["applet", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-codebase",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        if (
          !isUrl(
            context.str.slice(
              node.attribValueStartAt + charStart,
              node.attribValueStartAt + charEnd
            )
          )
        ) {
          errorArr.push({
            idxFrom: node.attribValueStartAt + charStart,
            idxTo: node.attribValueStartAt + charEnd,
            message: `Should be an URI.`,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-codebase"
            })
          );
        });
      }
    }
  };
}

function attributeValidateCodetype(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "codetype") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-codetype",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            quickPermittedValues: [
              "application/javascript",
              "application/json",
              "application/x-www-form-urlencoded",
              "application/xml",
              "application/zip",
              "application/pdf",
              "application/sql",
              "application/graphql",
              "application/ld+json",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "application/vnd.ms-powerpoint",
              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              "application/vnd.oasis.opendocument.text",
              "application/zstd",
              "audio/mpeg",
              "audio/ogg",
              "multipart/form-data",
              "text/css",
              "text/html",
              "text/xml",
              "text/csv",
              "text/plain",
              "image/png",
              "image/jpeg",
              "image/gif",
              "application/vnd.api+json"
            ],
            permittedValues: Object.keys(db),
            canBeCommaSeparated: false,
            noSpaceAfterComma: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-codetype"
            })
          );
        });
      }
    }
  };
}

function attributeValidateColor(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "color") {
        if (!["basefont", "font"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-color",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateColor(
          node.attribValue,
          node.attribValueStartAt,
          {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-color"
            })
          );
        });
      }
    }
  };
}

function attributeValidateCols(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "cols") {
        if (!["frameset", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-cols",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        let errorArr = [];
        if (node.parent.tagName === "frameset") {
          errorArr = validateDigitAndUnit(
            node.attribValue,
            node.attribValueStartAt,
            {
              whitelistValues: ["*"],
              theOnlyGoodUnits: ["%"],
              badUnits: ["px"],
              noUnitsIsFine: true,
              canBeCommaSeparated: true,
              type: "rational",
              customGenericValueError: "Should be: pixels|%|*."
            }
          );
        } else if (node.parent.tagName === "textarea") {
          errorArr = validateDigitAndUnit(
            node.attribValue,
            node.attribValueStartAt,
            {
              type: "integer",
              theOnlyGoodUnits: [],
              customGenericValueError: "Should be integer, no units."
            }
          );
        }
        if (Array.isArray(errorArr) && errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-cols"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateColspan(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "colspan") {
        if (!["th", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-colspan",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            type: "integer",
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units."
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-colspan"
            })
          );
        });
      }
    }
  };
}

function attributeValidateCompact(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "compact") {
        if (!["dir", "dl", "menu", "ol", "ul"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-compact"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateContent(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "content") {
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-content",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-content"
            })
          );
        });
      }
    }
  };
}

function attributeValidateCoords(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "coords") {
        if (!["area", "a"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-coords",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          if (
            !Array.isArray(node.parent.attribs) ||
            !node.parent.attribs.length ||
            !node.parent.attribs.some(attrObj => attrObj.attribName === "shape")
          ) {
            context.report({
              ruleId: "attribute-validate-coords",
              idxFrom: node.parent.start,
              idxTo: node.parent.end,
              message: `Missing "shape" attribute.`,
              fix: null
            });
          } else {
            const shapeAttr = node.parent.attribs.filter(
              attrObj => attrObj.attribName === "shape"
            )[0];
            let enforceCount = null;
            if (shapeAttr.attribValue === "rect") {
              enforceCount = 4;
            } else if (shapeAttr.attribValue === "circle") {
              enforceCount = 3;
            } else if (shapeAttr.attribValue === "poly") {
              enforceCount = "even";
            }
            const errorArr = validateDigitAndUnit(
              node.attribValue,
              node.attribValueStartAt,
              {
                whitelistValues: null,
                theOnlyGoodUnits: [],
                badUnits: null,
                noUnitsIsFine: true,
                canBeCommaSeparated: true,
                enforceCount,
                type: "integer",
                customGenericValueError: "Should be integer, no units."
              }
            );
            if (Array.isArray(errorArr) && errorArr.length) {
              errorArr.forEach(errorObj => {
                context.report(
                  Object.assign({}, errorObj, {
                    ruleId: "attribute-validate-coords"
                  })
                );
              });
            }
          }
        }
      }
    }
  };
}

function attributeValidateData(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "data") {
        if (node.parent.tagName !== "object") {
          context.report({
            ruleId: "attribute-validate-data",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        if (
          !isUrl(
            context.str.slice(
              node.attribValueStartAt + charStart,
              node.attribValueStartAt + charEnd
            )
          )
        ) {
          errorArr.push({
            idxFrom: node.attribValueStartAt + charStart,
            idxTo: node.attribValueStartAt + charEnd,
            message: `Should be an URI.`,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-data"
            })
          );
        });
      }
    }
  };
}

function attributeValidateDatetime(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "datetime") {
        if (!["del", "ins"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-datetime",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            quickPermittedValues: [isoDateRegex],
            permittedValues: null,
            canBeCommaSeparated: false,
            noSpaceAfterComma: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-datetime"
            })
          );
        });
      }
    }
  };
}

function attributeValidateDeclare(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "declare") {
        if (node.parent.tagName !== "object") {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-declare"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateDefer(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "defer") {
        if (node.parent.tagName !== "script") {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-defer"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateDir(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "dir") {
        if (
          [
            "applet",
            "base",
            "basefont",
            "br",
            "frame",
            "frameset",
            "iframe",
            "param",
            "script"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-dir",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            permittedValues: ["ltr", "rtl"],
            canBeCommaSeparated: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-dir"
            })
          );
        });
      }
    }
  };
}

function attributeValidateDisabled(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "disabled") {
        if (
          ![
            "button",
            "input",
            "optgroup",
            "option",
            "select",
            "textarea"
          ].includes(node.parent.tagName)
        ) {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-disabled"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateEnctype(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "enctype") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-enctype",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            quickPermittedValues: [
              "application/x-www-form-urlencoded",
              "multipart/form-data",
              "text/plain"
            ],
            permittedValues: Object.keys(db),
            canBeCommaSeparated: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-enctype"
            })
          );
        });
      }
    }
  };
}

function attributeValidateFace(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "face") {
        if (node.parent.tagName !== "font") {
          context.report({
            ruleId: "attribute-validate-face",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-face"
            })
          );
        });
      }
    }
  };
}

function attributeValidateFor(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "for") {
        if (node.parent.tagName !== "label") {
          context.report({
            ruleId: "attribute-validate-for",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValue,
            node.attribValueStartAt
          );
          const extractedValue = node.attribValue.slice(charStart, charEnd);
          let message = `Wrong id name.`;
          let fix = null;
          let idxFrom = charStart + node.attribValueStartAt;
          let idxTo = charEnd + node.attribValueStartAt;
          if (
            Number.isInteger(charStart) &&
            !classNameRegex.test(extractedValue)
          ) {
            if (Array.from(extractedValue).some(val => !val.trim().length)) {
              message = `Should be one value, no spaces.`;
            } else if (extractedValue.includes("#")) {
              message = `Remove hash.`;
              const firstHashAt = node.attribValue.indexOf("#");
              fix = {
                ranges: [
                  [
                    node.attribValueStartAt + firstHashAt,
                    node.attribValueStartAt + firstHashAt + 1
                  ]
                ]
              };
              idxFrom = node.attribValueStartAt + firstHashAt;
              idxTo = node.attribValueStartAt + firstHashAt + 1;
            }
            errorArr.push({
              ruleId: "attribute-validate-for",
              idxFrom,
              idxTo,
              message,
              fix
            });
          }
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-for"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateFrame(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "frame") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-frame",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            permittedValues: [
              "void",
              "above",
              "below",
              "hsides",
              "lhs",
              "rhs",
              "vsides",
              "box",
              "border"
            ],
            canBeCommaSeparated: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-frame"
            })
          );
        });
      }
    }
  };
}

function attributeValidateFrameborder(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "frameborder") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-frameborder",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            permittedValues: ["0", "1"],
            canBeCommaSeparated: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-frameborder"
            })
          );
        });
      }
    }
  };
}

function attributeValidateHeaders(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "headers") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-headers",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValue,
            node.attribValueStartAt
          );
          checkClassOrIdValue(
            context.str,
            node.attribValueStartAt + charStart,
            node.attribValueStartAt + charEnd,
            errorArr,
            {
              typeName: "id"
            }
          );
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-headers"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateHeight(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "height") {
        if (
          !["iframe", "td", "th", "img", "object", "applet"].includes(
            node.parent.tagName
          )
        ) {
          context.report({
            ruleId: "attribute-validate-height",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            badUnits: ["px"],
            theOnlyGoodUnits: ["%"],
            noUnitsIsFine: true,
            customGenericValueError: `Should be "pixels|%".`
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-height"
            })
          );
        });
      }
    }
  };
}

function attributeValidateHref(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "href") {
        if (!["a", "area", "link", "base"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-href",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        if (
          !isUrl(
            context.str.slice(
              node.attribValueStartAt + charStart,
              node.attribValueStartAt + charEnd
            )
          )
        ) {
          errorArr.push({
            idxFrom: node.attribValueStartAt + charStart,
            idxTo: node.attribValueStartAt + charEnd,
            message: `Should be an URI.`,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-href"
            })
          );
        });
      }
    }
  };
}

function attributeValidateHreflang(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "hreflang") {
        if (!["a", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-hreflang",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        const { message } = isLangCode(
          node.attribValue.slice(charStart, charEnd)
        );
        if (message) {
          errorArr.push({
            idxFrom: node.attribValueStartAt + charStart,
            idxTo: node.attribValueStartAt + charEnd,
            message,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-hreflang"
            })
          );
        });
      }
    }
  };
}

function attributeValidateHspace(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "hspace") {
        if (!["applet", "img", "object"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-hspace",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            theOnlyGoodUnits: [],
            noUnitsIsFine: true
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-hspace"
            })
          );
        });
      }
    }
  };
}

function attributeValidateHttpequiv(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "http-equiv") {
        if (node.parent.tagName !== "meta") {
          context.report({
            ruleId: "attribute-validate-http-equiv",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            permittedValues: ["content-type", "default-style", "refresh"],
            canBeCommaSeparated: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-http-equiv"
            })
          );
        });
      }
    }
  };
}

function attributeValidateId(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "id") {
        if (
          ["base", "head", "html", "meta", "script", "style", "title"].includes(
            node.parent.tagName
          )
        ) {
          context.report({
            ruleId: "attribute-validate-id",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const { charStart, charEnd, errorArr } = checkForWhitespace(
            node.attribValue,
            node.attribValueStartAt
          );
          checkClassOrIdValue(
            context.str,
            node.attribValueStartAt + charStart,
            node.attribValueStartAt + charEnd,
            errorArr,
            {
              typeName: node.attribName
            }
          );
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-id"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateIsmap(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "ismap") {
        if (!["img", "input"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-ismap"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateLabel(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "label") {
        if (!["option", "optgroup"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-label",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-label"
            })
          );
        });
      }
    }
  };
}

function attributeValidateLang(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "lang") {
        if (
          ["base", "head", "html", "meta", "script", "style", "title"].includes(
            node.parent.tagName
          )
        ) {
          context.report({
            ruleId: "attribute-validate-lang",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        const { message } = isLangCode(
          node.attribValue.slice(charStart, charEnd)
        );
        if (message) {
          errorArr.push({
            idxFrom: node.attribValueStartAt + charStart,
            idxTo: node.attribValueStartAt + charEnd,
            message,
            fix: null
          });
        }
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-lang"
            })
          );
        });
      }
    }
  };
}

function attributeValidateLanguage(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "language") {
        if (node.parent.tagName !== "script") {
          context.report({
            ruleId: "attribute-validate-language",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-language"
            })
          );
        });
      }
    }
  };
}

function attributeValidateLink(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "link") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-link",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateColor(
          node.attribValue,
          node.attribValueStartAt,
          {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-link"
            })
          );
        });
      }
    }
  };
}

function attributeValidateLongdesc(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "longdesc") {
        if (!["img", "frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-longdesc",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-longdesc"
            })
          );
        });
      }
    }
  };
}

function attributeValidateMarginheight(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "marginheight") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-marginheight",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            theOnlyGoodUnits: [],
            noUnitsIsFine: true
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-marginheight"
            })
          );
        });
      }
    }
  };
}

function attributeValidateMarginwidth(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "marginwidth") {
        if (!["frame", "iframe"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-marginwidth",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            theOnlyGoodUnits: [],
            noUnitsIsFine: true
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-marginwidth"
            })
          );
        });
      }
    }
  };
}

function attributeValidateMaxlength(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "maxlength") {
        if (node.parent.tagName !== "input") {
          context.report({
            ruleId: "attribute-validate-maxlength",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            type: "integer",
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units."
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-maxlength"
            })
          );
        });
      }
    }
  };
}

function attributeValidateMedia(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "media") {
        if (!["style", "link"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-media",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { charStart, charEnd, errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr
          .concat(
            isMediaD(node.attribValue.slice(charStart, charEnd), {
              offset: node.attribValueStartAt
            })
          )
          .forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-media"
              })
            );
          });
      }
    }
  };
}

function attributeValidateMethod(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "method") {
        if (node.parent.tagName !== "form") {
          context.report({
            ruleId: "attribute-validate-method",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            permittedValues: ["get", "post"],
            canBeCommaSeparated: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-method"
            })
          );
        });
      }
    }
  };
}

function attributeValidateMultiple(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "multiple") {
        if (node.parent.tagName !== "select") {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-multiple"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateName(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "name") {
        if (
          ![
            "button",
            "textarea",
            "applet",
            "select",
            "form",
            "frame",
            "iframe",
            "img",
            "a",
            "input",
            "object",
            "map",
            "param",
            "meta"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-name",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-name"
            })
          );
        });
      }
    }
  };
}

function attributeValidateNohref(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "nohref") {
        if (node.parent.tagName !== "area") {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-nohref"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateNoresize(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "noresize") {
        if (node.parent.tagName !== "frame") {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-noresize"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateNoshade(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "noshade") {
        if (node.parent.tagName !== "hr") {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-noshade"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateNowrap(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = {
        xhtml: false
      };
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }
      const errorArr = [];
      if (node.attribName === "nowrap") {
        if (!["td", "th"].includes(node.parent.tagName)) {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-nowrap"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateObject(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "object") {
        if (node.parent.tagName !== "applet") {
          context.report({
            ruleId: "attribute-validate-object",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const { errorArr } = checkForWhitespace(
          node.attribValue,
          node.attribValueStartAt
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-object"
            })
          );
        });
      }
    }
  };
}

function validateScript(str, idxOffset, opts) {
  const { errorArr } = checkForWhitespace(str, idxOffset);
  return errorArr;
}

function attributeValidateOnblur(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = Object.assign({}, originalOpts);
      if (node.attribName === "onblur") {
        if (
          ![
            "a",
            "area",
            "button",
            "input",
            "label",
            "select",
            "textarea"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-onblur",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const errorArr = validateScript(
            node.attribValue,
            node.attribValueStartAt
          );
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onblur"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateOnchange(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = Object.assign({}, originalOpts);
      if (node.attribName === "onchange") {
        if (!["input", "select", "textarea"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-onchange",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const errorArr = validateScript(
            node.attribValue,
            node.attribValueStartAt
          );
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onchange"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateOnclick(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = Object.assign({}, originalOpts);
      if (node.attribName === "onclick") {
        if (
          [
            "applet",
            "base",
            "basefont",
            "bdo",
            "br",
            "font",
            "frame",
            "frameset",
            "head",
            "html",
            "iframe",
            "isindex",
            "meta",
            "param",
            "script",
            "style",
            "title"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-onclick",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const errorArr = validateScript(
            node.attribValue,
            node.attribValueStartAt
          );
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onclick"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateOndblclick(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = Object.assign({}, originalOpts);
      if (node.attribName === "ondblclick") {
        if (
          [
            "applet",
            "base",
            "basefont",
            "bdo",
            "br",
            "font",
            "frame",
            "frameset",
            "head",
            "html",
            "iframe",
            "isindex",
            "meta",
            "param",
            "script",
            "style",
            "title"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-ondblclick",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const errorArr = validateScript(
            node.attribValue,
            node.attribValueStartAt
          );
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-ondblclick"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateOnfocus(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = Object.assign({}, originalOpts);
      if (node.attribName === "onfocus") {
        if (
          ![
            "a",
            "area",
            "button",
            "input",
            "label",
            "select",
            "textarea"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-onfocus",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const errorArr = validateScript(
            node.attribValue,
            node.attribValueStartAt
          );
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onfocus"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateOnkeydown(context, ...originalOpts) {
  return {
    attribute: function(node) {
      const opts = Object.assign({}, originalOpts);
      if (node.attribName === "onkeydown") {
        if (
          [
            "applet",
            "base",
            "basefont",
            "bdo",
            "br",
            "font",
            "frame",
            "frameset",
            "head",
            "html",
            "iframe",
            "isindex",
            "meta",
            "param",
            "script",
            "style",
            "title"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-onkeydown",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          const errorArr = validateScript(
            node.attribValue,
            node.attribValueStartAt
          );
          errorArr.forEach(errorObj => {
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-onkeydown"
              })
            );
          });
        }
      }
    }
  };
}

function attributeValidateRowspan(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "rowspan") {
        if (!["th", "td"].includes(node.parent.tagName)) {
          context.report({
            ruleId: "attribute-validate-rowspan",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            type: "integer",
            theOnlyGoodUnits: [],
            customGenericValueError: "Should be integer, no units."
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-rowspan"
            })
          );
        });
      }
    }
  };
}

function attributeValidateRules(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "rules") {
        if (node.parent.tagName !== "table") {
          context.report({
            ruleId: "attribute-validate-rules",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateString(
          node.attribValue,
          node.attribValueStartAt,
          {
            permittedValues: ["none", "groups", "rows", "cols", "all"],
            canBeCommaSeparated: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-rules"
            })
          );
        });
      }
    }
  };
}

function attributeValidateText(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "text") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-text",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateColor(
          node.attribValue,
          node.attribValueStartAt,
          {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-text"
            })
          );
        });
      }
    }
  };
}

function attributeValidateVlink(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "vlink") {
        if (node.parent.tagName !== "body") {
          context.report({
            ruleId: "attribute-validate-vlink",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateColor(
          node.attribValue,
          node.attribValueStartAt,
          {
            namedCssLevel1OK: true,
            namedCssLevel2PlusOK: true,
            hexThreeOK: false,
            hexFourOK: false,
            hexSixOK: true,
            hexEightOK: false
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-vlink"
            })
          );
        });
      }
    }
  };
}

function attributeValidateWidth(context, ...opts) {
  return {
    attribute: function(node) {
      if (node.attribName === "width") {
        if (
          ![
            "hr",
            "iframe",
            "img",
            "object",
            "table",
            "td",
            "th",
            "applet",
            "col",
            "colgroup",
            "pre"
          ].includes(node.parent.tagName)
        ) {
          context.report({
            ruleId: "attribute-validate-width",
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        }
        const errorArr = validateDigitAndUnit(
          node.attribValue,
          node.attribValueStartAt,
          {
            badUnits: ["px"],
            noUnitsIsFine: true
          }
        );
        errorArr.forEach(errorObj => {
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-width"
            })
          );
        });
      }
    }
  };
}

function htmlEntitiesNotEmailFriendly(context) {
  return {
    entity: function({ idxFrom, idxTo }) {
      if (
        Object.keys(notEmailFriendly).includes(
          context.str.slice(idxFrom + 1, idxTo - 1)
        )
      ) {
        context.report({
          ruleId: "bad-named-html-entity-not-email-friendly",
          message: "Email-unfriendly named HTML entity.",
          idxFrom: idxFrom,
          idxTo: idxTo,
          fix: {
            ranges: [
              [
                idxFrom,
                idxTo,
                `&${
                  notEmailFriendly[context.str.slice(idxFrom + 1, idxTo - 1)]
                };`
              ]
            ]
          }
        });
      }
    }
  };
}

function characterEncode(context, ...opts) {
  return {
    character: function({ type, chr, i }) {
      let mode = "named";
      if (Array.isArray(opts) && ["named", "numeric"].includes(opts[0])) {
        mode = opts[0];
      }
      if (
        type === "text" &&
        typeof chr === "string" &&
        (chr.charCodeAt(0) > 127 || `<>"&`.includes(chr)) &&
        (chr.charCodeAt(0) !== 160 ||
          !Object.keys(context.processedRulesConfig).includes(
            "bad-character-non-breaking-space"
          ) ||
          !isEnabled(
            context.processedRulesConfig["bad-character-non-breaking-space"]
          ))
      ) {
        let encodedChr = he.encode(chr, {
          useNamedReferences: mode === "named"
        });
        if (
          Object.keys(notEmailFriendly).includes(
            encodedChr.slice(1, encodedChr.length - 1)
          )
        ) {
          encodedChr = `&${
            notEmailFriendly[encodedChr.slice(1, encodedChr.length - 1)]
          };`;
        }
        let charName = "";
        if (chr.charCodeAt(0) === 160) {
          charName = " no-break space";
        } else if (chr.charCodeAt(0) === 38) {
          charName = " ampersand";
        } else if (chr.charCodeAt(0) === 60) {
          charName = " less than";
        } else if (chr.charCodeAt(0) === 62) {
          charName = " greater than";
        } else if (chr.charCodeAt(0) === 34) {
          charName = " double quotes";
        } else if (chr.charCodeAt(0) === 163) {
          charName = " pound sign";
        }
        context.report({
          ruleId: "character-encode",
          message: `Unencoded${charName} character.`,
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, encodedChr]]
          }
        });
      }
    }
  };
}

function characterUnspacedPunctuation(context, ...originalOpts) {
  const charCodeMapping = {
    "63": "questionMark",
    "33": "exclamationMark",
    "59": "semicolon",
    "187": "rightDoubleAngleQuotMark",
    "171": "leftDoubleAngleQuotMark"
  };
  return {
    text: function(node) {
      const defaults = {
        questionMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always"
        },
        exclamationMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always"
        },
        semicolon: {
          whitespaceLeft: "never",
          whitespaceRight: "always"
        },
        rightDoubleAngleQuotMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always"
        },
        leftDoubleAngleQuotMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always"
        }
      };
      let opts = Object.assign({}, defaults);
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        typeof originalOpts[0] === "object" &&
        originalOpts[0] !== null
      ) {
        opts = Object.assign({}, defaults, originalOpts[0]);
      }
      for (let i = node.start; i < node.end; i++) {
        const charCode = context.str[i].charCodeAt(0);
        if (charCodeMapping[String(charCode)]) {
          const charName = charCodeMapping[String(charCode)];
          if (
            opts[charName].whitespaceLeft === "never" &&
            i &&
            !context.str[i - 1].trim().length
          ) {
            context.report({
              ruleId: "character-unspaced-punctuation",
              severity: 1,
              idxFrom: left(context.str, i) + 1,
              idxTo: i,
              message: "Remove the whitespace.",
              fix: {
                ranges: [[left(context.str, i) + 1, i]]
              }
            });
          }
          if (
            opts[charName].whitespaceRight === "never" &&
            i < node.end - 1 &&
            !context.str[i + 1].trim().length
          ) {
            context.report({
              ruleId: "character-unspaced-punctuation",
              severity: 1,
              idxFrom: i + 1,
              idxTo: right(context.str, i),
              message: "Remove the whitespace.",
              fix: {
                ranges: [[i + 1, right(context.str, i)]]
              }
            });
          }
          if (
            opts[charName].whitespaceLeft === "always" &&
            i &&
            context.str[i - 1].trim().length
          ) {
            context.report({
              ruleId: "character-unspaced-punctuation",
              severity: 1,
              idxFrom: i,
              idxTo: i + 1,
              message: "Add a space.",
              fix: {
                ranges: [[i, i, " "]]
              }
            });
          }
          if (
            opts[charName].whitespaceRight === "always" &&
            i < node.end - 1 &&
            context.str[i + 1].trim().length
          ) {
            context.report({
              ruleId: "character-unspaced-punctuation",
              severity: 1,
              idxFrom: i,
              idxTo: i + 1,
              message: "Add a space.",
              fix: {
                ranges: [[i + 1, i + 1, " "]]
              }
            });
          }
        }
      }
    }
  };
}

const builtInRules = {};
defineLazyProp(builtInRules, "bad-character-null", () => badCharacterNull);
defineLazyProp(
  builtInRules,
  "bad-character-start-of-heading",
  () => badCharacterStartOfHeading
);
defineLazyProp(
  builtInRules,
  "bad-character-start-of-text",
  () => badCharacterStartOfText
);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-text",
  () => badCharacterEndOfText
);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-transmission",
  () => badCharacterEndOfTransmission
);
defineLazyProp(
  builtInRules,
  "bad-character-enquiry",
  () => badCharacterEnquiry
);
defineLazyProp(
  builtInRules,
  "bad-character-acknowledge",
  () => badCharacterAcknowledge
);
defineLazyProp(builtInRules, "bad-character-bell", () => badCharacterBell);
defineLazyProp(
  builtInRules,
  "bad-character-backspace",
  () => badCharacterBackspace
);
defineLazyProp(
  builtInRules,
  "bad-character-tabulation",
  () => badCharacterTabulation
);
defineLazyProp(
  builtInRules,
  "bad-character-line-tabulation",
  () => badCharacterLineTabulation
);
defineLazyProp(
  builtInRules,
  "bad-character-form-feed",
  () => badCharacterFormFeed
);
defineLazyProp(
  builtInRules,
  "bad-character-shift-out",
  () => badCharacterShiftOut
);
defineLazyProp(
  builtInRules,
  "bad-character-shift-in",
  () => badCharacterShiftIn
);
defineLazyProp(
  builtInRules,
  "bad-character-data-link-escape",
  () => badCharacterDataLinkEscape
);
defineLazyProp(
  builtInRules,
  "bad-character-device-control-one",
  () => badCharacterDeviceControlOne
);
defineLazyProp(
  builtInRules,
  "bad-character-device-control-two",
  () => badCharacterDeviceControlTwo
);
defineLazyProp(
  builtInRules,
  "bad-character-device-control-three",
  () => badCharacterDeviceControlThree
);
defineLazyProp(
  builtInRules,
  "bad-character-device-control-four",
  () => badCharacterDeviceControlFour
);
defineLazyProp(
  builtInRules,
  "bad-character-negative-acknowledge",
  () => badCharacterNegativeAcknowledge
);
defineLazyProp(
  builtInRules,
  "bad-character-synchronous-idle",
  () => badCharacterSynchronousIdle
);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-transmission-block",
  () => badCharacterEndOfTransmissionBlock
);
defineLazyProp(builtInRules, "bad-character-cancel", () => badCharacterCancel);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-medium",
  () => badCharacterEndOfMedium
);
defineLazyProp(
  builtInRules,
  "bad-character-substitute",
  () => badCharacterSubstitute
);
defineLazyProp(builtInRules, "bad-character-escape", () => badCharacterEscape);
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-four",
  () => badCharacterInformationSeparatorFour
);
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-three",
  () => badCharacterInformationSeparatorThree
);
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-two",
  () => badCharacterInformationSeparatorTwo
);
defineLazyProp(
  builtInRules,
  "bad-character-information-separator-one",
  () => badCharacterInformationSeparatorTwo$1
);
defineLazyProp(builtInRules, "bad-character-delete", () => badCharacterDelete);
defineLazyProp(
  builtInRules,
  "bad-character-control-0080",
  () => badCharacterControl0080
);
defineLazyProp(
  builtInRules,
  "bad-character-control-0081",
  () => badCharacterControl0081
);
defineLazyProp(
  builtInRules,
  "bad-character-break-permitted-here",
  () => badCharacterBreakPermittedHere
);
defineLazyProp(
  builtInRules,
  "bad-character-no-break-here",
  () => badCharacterNoBreakHere
);
defineLazyProp(
  builtInRules,
  "bad-character-control-0084",
  () => badCharacterControl0084
);
defineLazyProp(
  builtInRules,
  "bad-character-next-line",
  () => badCharacterNextLine
);
defineLazyProp(
  builtInRules,
  "bad-character-start-of-selected-area",
  () => badCharacterStartOfSelectedArea
);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-selected-area",
  () => badCharacterEndOfSelectedArea
);
defineLazyProp(
  builtInRules,
  "bad-character-character-tabulation-set",
  () => badCharacterCharacterTabulationSet
);
defineLazyProp(
  builtInRules,
  "bad-character-character-tabulation-with-justification",
  () => badCharacterCharacterTabulationWithJustification
);
defineLazyProp(
  builtInRules,
  "bad-character-line-tabulation-set",
  () => badCharacterLineTabulationSet
);
defineLazyProp(
  builtInRules,
  "bad-character-partial-line-forward",
  () => badCharacterPartialLineForward
);
defineLazyProp(
  builtInRules,
  "bad-character-partial-line-backward",
  () => badCharacterPartialLineBackward
);
defineLazyProp(
  builtInRules,
  "bad-character-reverse-line-feed",
  () => badCharacterReverseLineFeed
);
defineLazyProp(
  builtInRules,
  "bad-character-single-shift-two",
  () => badCharacterSingleShiftTwo
);
defineLazyProp(
  builtInRules,
  "bad-character-single-shift-three",
  () => badCharacterSingleShiftTwo$1
);
defineLazyProp(
  builtInRules,
  "bad-character-device-control-string",
  () => badCharacterDeviceControlString
);
defineLazyProp(
  builtInRules,
  "bad-character-private-use-1",
  () => badCharacterPrivateUseOne
);
defineLazyProp(
  builtInRules,
  "bad-character-private-use-2",
  () => badCharacterPrivateUseTwo
);
defineLazyProp(
  builtInRules,
  "bad-character-set-transmit-state",
  () => badCharacterSetTransmitState
);
defineLazyProp(
  builtInRules,
  "bad-character-cancel-character",
  () => badCharacterCancelCharacter
);
defineLazyProp(
  builtInRules,
  "bad-character-message-waiting",
  () => badCharacterMessageWaiting
);
defineLazyProp(
  builtInRules,
  "bad-character-start-of-protected-area",
  () => badCharacterStartOfProtectedArea
);
defineLazyProp(
  builtInRules,
  "bad-character-end-of-protected-area",
  () => badCharacterEndOfProtectedArea
);
defineLazyProp(
  builtInRules,
  "bad-character-start-of-string",
  () => badCharacterStartOfString
);
defineLazyProp(
  builtInRules,
  "bad-character-control-0099",
  () => badCharacterControl0099
);
defineLazyProp(
  builtInRules,
  "bad-character-single-character-introducer",
  () => badCharacterSingleCharacterIntroducer
);
defineLazyProp(
  builtInRules,
  "bad-character-control-sequence-introducer",
  () => badCharacterControlSequenceIntroducer
);
defineLazyProp(
  builtInRules,
  "bad-character-string-terminator",
  () => badCharacterStringTerminator
);
defineLazyProp(
  builtInRules,
  "bad-character-operating-system-command",
  () => badCharacterOperatingSystemCommand
);
defineLazyProp(
  builtInRules,
  "bad-character-private-message",
  () => badCharacterPrivateMessage
);
defineLazyProp(
  builtInRules,
  "bad-character-application-program-command",
  () => badCharacterApplicationProgramCommand
);
defineLazyProp(
  builtInRules,
  "bad-character-soft-hyphen",
  () => badCharacterSoftHyphen
);
defineLazyProp(
  builtInRules,
  "bad-character-non-breaking-space",
  () => badCharacterNonBreakingSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-ogham-space-mark",
  () => badCharacterOghamSpaceMark
);
defineLazyProp(builtInRules, "bad-character-en-quad", () => badCharacterEnQuad);
defineLazyProp(builtInRules, "bad-character-em-quad", () => badCharacterEmQuad);
defineLazyProp(
  builtInRules,
  "bad-character-en-space",
  () => badCharacterEnSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-em-space",
  () => badCharacterEmSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-three-per-em-space",
  () => badCharacterThreePerEmSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-four-per-em-space",
  () => badCharacterFourPerEmSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-six-per-em-space",
  () => badCharacterSixPerEmSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-figure-space",
  () => badCharacterFigureSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-punctuation-space",
  () => badCharacterPunctuationSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-thin-space",
  () => badCharacterThinSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-hair-space",
  () => badCharacterHairSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-space",
  () => badCharacterZeroWidthSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-non-joiner",
  () => badCharacterZeroWidthNonJoiner
);
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-joiner",
  () => badCharacterZeroWidthJoiner
);
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-mark",
  () => badCharacterLeftToRightMark
);
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-mark",
  () => badCharacterRightToLeftMark
);
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-embedding",
  () => badCharacterLeftToRightEmbedding
);
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-embedding",
  () => badCharacterRightToLeftEmbedding
);
defineLazyProp(
  builtInRules,
  "bad-character-pop-directional-formatting",
  () => badCharacterPopDirectionalFormatting
);
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-override",
  () => badCharacterLeftToRightOverride
);
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-override",
  () => badCharacterRightToLeftOverride
);
defineLazyProp(
  builtInRules,
  "bad-character-word-joiner",
  () => badCharacterWordJoiner
);
defineLazyProp(
  builtInRules,
  "bad-character-function-application",
  () => badCharacterFunctionApplication
);
defineLazyProp(
  builtInRules,
  "bad-character-invisible-times",
  () => badCharacterInvisibleTimes
);
defineLazyProp(
  builtInRules,
  "bad-character-invisible-separator",
  () => badCharacterInvisibleSeparator
);
defineLazyProp(
  builtInRules,
  "bad-character-invisible-plus",
  () => badCharacterInvisiblePlus
);
defineLazyProp(
  builtInRules,
  "bad-character-left-to-right-isolate",
  () => badCharacterLeftToRightIsolate
);
defineLazyProp(
  builtInRules,
  "bad-character-right-to-left-isolate",
  () => badCharacterRightToLeftIsolate
);
defineLazyProp(
  builtInRules,
  "bad-character-first-strong-isolate",
  () => badCharacterFirstStrongIsolate
);
defineLazyProp(
  builtInRules,
  "bad-character-pop-directional-isolate",
  () => badCharacterPopDirectionalIsolate
);
defineLazyProp(
  builtInRules,
  "bad-character-inhibit-symmetric-swapping",
  () => badCharacterInhibitSymmetricSwapping
);
defineLazyProp(
  builtInRules,
  "bad-character-activate-symmetric-swapping",
  () => badCharacterActivateSymmetricSwapping
);
defineLazyProp(
  builtInRules,
  "bad-character-inhibit-arabic-form-shaping",
  () => badCharacterInhibitArabicFormShaping
);
defineLazyProp(
  builtInRules,
  "bad-character-activate-arabic-form-shaping",
  () => badCharacterActivateArabicFormShaping
);
defineLazyProp(
  builtInRules,
  "bad-character-national-digit-shapes",
  () => badCharacterNationalDigitShapes
);
defineLazyProp(
  builtInRules,
  "bad-character-nominal-digit-shapes",
  () => badCharacterNominalDigitShapes
);
defineLazyProp(
  builtInRules,
  "bad-character-zero-width-no-break-space",
  () => badCharacterZeroWidthNoBreakSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-interlinear-annotation-anchor",
  () => badCharacterInterlinearAnnotationAnchor
);
defineLazyProp(
  builtInRules,
  "bad-character-interlinear-annotation-separator",
  () => badCharacterInterlinearAnnotationSeparator
);
defineLazyProp(
  builtInRules,
  "bad-character-interlinear-annotation-terminator",
  () => badCharacterInterlinearAnnotationTerminator
);
defineLazyProp(
  builtInRules,
  "bad-character-line-separator",
  () => badCharacterLineSeparator
);
defineLazyProp(
  builtInRules,
  "bad-character-paragraph-separator",
  () => badCharacterParagraphSeparator
);
defineLazyProp(
  builtInRules,
  "bad-character-narrow-no-break-space",
  () => badCharacterNarrowNoBreakSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-medium-mathematical-space",
  () => badCharacterMediumMathematicalSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-ideographic-space",
  () => badCharacterIdeographicSpace
);
defineLazyProp(
  builtInRules,
  "bad-character-replacement-character",
  () => badCharacterReplacementCharacter
);
defineLazyProp(
  builtInRules,
  "tag-space-after-opening-bracket",
  () => tagSpaceAfterOpeningBracket
);
defineLazyProp(
  builtInRules,
  "tag-space-before-closing-slash",
  () => tagSpaceBeforeClosingSlash
);
defineLazyProp(
  builtInRules,
  "tag-space-between-slash-and-bracket",
  () => tagSpaceBetweenSlashAndBracket
);
defineLazyProp(
  builtInRules,
  "tag-closing-backslash",
  () => tagClosingBackslash
);
defineLazyProp(builtInRules, "tag-void-slash", () => tagVoidSlash);
defineLazyProp(builtInRules, "tag-name-case", () => tagNameCase);
defineLazyProp(builtInRules, "tag-is-present", () => tagIsPresent);
defineLazyProp(builtInRules, "tag-bold", () => tagBold);
defineLazyProp(builtInRules, "attribute-duplicate", () => attributeDuplicate);
defineLazyProp(builtInRules, "attribute-malformed", () => attributeMalformed);
defineLazyProp(
  builtInRules,
  "attribute-validate-abbr",
  () => attributeValidateAbbr
);
defineLazyProp(
  builtInRules,
  "attribute-validate-accept-charset",
  () => attributeValidateAcceptCharset
);
defineLazyProp(
  builtInRules,
  "attribute-validate-accept",
  () => attributeValidateAccept
);
defineLazyProp(
  builtInRules,
  "attribute-validate-accesskey",
  () => attributeValidateAccesskey
);
defineLazyProp(
  builtInRules,
  "attribute-validate-action",
  () => attributeValidateAction
);
defineLazyProp(
  builtInRules,
  "attribute-validate-align",
  () => attributeValidateAlign
);
defineLazyProp(
  builtInRules,
  "attribute-validate-alink",
  () => attributeValidateAlink
);
defineLazyProp(
  builtInRules,
  "attribute-validate-alt",
  () => attributeValidateAlt
);
defineLazyProp(
  builtInRules,
  "attribute-validate-archive",
  () => attributeValidateArchive
);
defineLazyProp(
  builtInRules,
  "attribute-validate-axis",
  () => attributeValidateAxis
);
defineLazyProp(
  builtInRules,
  "attribute-validate-background",
  () => attributeValidateBackground
);
defineLazyProp(
  builtInRules,
  "attribute-validate-bgcolor",
  () => attributeValidateBgcolor
);
defineLazyProp(
  builtInRules,
  "attribute-validate-border",
  () => attributeValidateBorder
);
defineLazyProp(
  builtInRules,
  "attribute-validate-cellpadding",
  () => attributeValidateCellpadding
);
defineLazyProp(
  builtInRules,
  "attribute-validate-cellspacing",
  () => attributeValidateCellspacing
);
defineLazyProp(
  builtInRules,
  "attribute-validate-char",
  () => attributeValidateChar
);
defineLazyProp(
  builtInRules,
  "attribute-validate-charoff",
  () => attributeValidateCharoff
);
defineLazyProp(
  builtInRules,
  "attribute-validate-charset",
  () => attributeValidateCharset
);
defineLazyProp(
  builtInRules,
  "attribute-validate-checked",
  () => attributeValidateChecked
);
defineLazyProp(
  builtInRules,
  "attribute-validate-cite",
  () => attributeValidateCite
);
defineLazyProp(
  builtInRules,
  "attribute-validate-class",
  () => attributeValidateClass
);
defineLazyProp(
  builtInRules,
  "attribute-validate-classid",
  () => attributeValidateClassid
);
defineLazyProp(
  builtInRules,
  "attribute-validate-clear",
  () => attributeValidateClassid$1
);
defineLazyProp(
  builtInRules,
  "attribute-validate-code",
  () => attributeValidateCode
);
defineLazyProp(
  builtInRules,
  "attribute-validate-codebase",
  () => attributeValidateCodebase
);
defineLazyProp(
  builtInRules,
  "attribute-validate-codetype",
  () => attributeValidateCodetype
);
defineLazyProp(
  builtInRules,
  "attribute-validate-color",
  () => attributeValidateColor
);
defineLazyProp(
  builtInRules,
  "attribute-validate-cols",
  () => attributeValidateCols
);
defineLazyProp(
  builtInRules,
  "attribute-validate-colspan",
  () => attributeValidateColspan
);
defineLazyProp(
  builtInRules,
  "attribute-validate-compact",
  () => attributeValidateCompact
);
defineLazyProp(
  builtInRules,
  "attribute-validate-content",
  () => attributeValidateContent
);
defineLazyProp(
  builtInRules,
  "attribute-validate-coords",
  () => attributeValidateCoords
);
defineLazyProp(
  builtInRules,
  "attribute-validate-data",
  () => attributeValidateData
);
defineLazyProp(
  builtInRules,
  "attribute-validate-datetime",
  () => attributeValidateDatetime
);
defineLazyProp(
  builtInRules,
  "attribute-validate-declare",
  () => attributeValidateDeclare
);
defineLazyProp(
  builtInRules,
  "attribute-validate-defer",
  () => attributeValidateDefer
);
defineLazyProp(
  builtInRules,
  "attribute-validate-dir",
  () => attributeValidateDir
);
defineLazyProp(
  builtInRules,
  "attribute-validate-disabled",
  () => attributeValidateDisabled
);
defineLazyProp(
  builtInRules,
  "attribute-validate-enctype",
  () => attributeValidateEnctype
);
defineLazyProp(
  builtInRules,
  "attribute-validate-face",
  () => attributeValidateFace
);
defineLazyProp(
  builtInRules,
  "attribute-validate-for",
  () => attributeValidateFor
);
defineLazyProp(
  builtInRules,
  "attribute-validate-frame",
  () => attributeValidateFrame
);
defineLazyProp(
  builtInRules,
  "attribute-validate-frameborder",
  () => attributeValidateFrameborder
);
defineLazyProp(
  builtInRules,
  "attribute-validate-headers",
  () => attributeValidateHeaders
);
defineLazyProp(
  builtInRules,
  "attribute-validate-height",
  () => attributeValidateHeight
);
defineLazyProp(
  builtInRules,
  "attribute-validate-href",
  () => attributeValidateHref
);
defineLazyProp(
  builtInRules,
  "attribute-validate-hreflang",
  () => attributeValidateHreflang
);
defineLazyProp(
  builtInRules,
  "attribute-validate-hspace",
  () => attributeValidateHspace
);
defineLazyProp(
  builtInRules,
  "attribute-validate-http-equiv",
  () => attributeValidateHttpequiv
);
defineLazyProp(
  builtInRules,
  "attribute-validate-id",
  () => attributeValidateId
);
defineLazyProp(
  builtInRules,
  "attribute-validate-ismap",
  () => attributeValidateIsmap
);
defineLazyProp(
  builtInRules,
  "attribute-validate-label",
  () => attributeValidateLabel
);
defineLazyProp(
  builtInRules,
  "attribute-validate-lang",
  () => attributeValidateLang
);
defineLazyProp(
  builtInRules,
  "attribute-validate-language",
  () => attributeValidateLanguage
);
defineLazyProp(
  builtInRules,
  "attribute-validate-link",
  () => attributeValidateLink
);
defineLazyProp(
  builtInRules,
  "attribute-validate-longdesc",
  () => attributeValidateLongdesc
);
defineLazyProp(
  builtInRules,
  "attribute-validate-marginheight",
  () => attributeValidateMarginheight
);
defineLazyProp(
  builtInRules,
  "attribute-validate-marginwidth",
  () => attributeValidateMarginwidth
);
defineLazyProp(
  builtInRules,
  "attribute-validate-maxlength",
  () => attributeValidateMaxlength
);
defineLazyProp(
  builtInRules,
  "attribute-validate-media",
  () => attributeValidateMedia
);
defineLazyProp(
  builtInRules,
  "attribute-validate-method",
  () => attributeValidateMethod
);
defineLazyProp(
  builtInRules,
  "attribute-validate-multiple",
  () => attributeValidateMultiple
);
defineLazyProp(
  builtInRules,
  "attribute-validate-name",
  () => attributeValidateName
);
defineLazyProp(
  builtInRules,
  "attribute-validate-nohref",
  () => attributeValidateNohref
);
defineLazyProp(
  builtInRules,
  "attribute-validate-noresize",
  () => attributeValidateNoresize
);
defineLazyProp(
  builtInRules,
  "attribute-validate-noshade",
  () => attributeValidateNoshade
);
defineLazyProp(
  builtInRules,
  "attribute-validate-nowrap",
  () => attributeValidateNowrap
);
defineLazyProp(
  builtInRules,
  "attribute-validate-object",
  () => attributeValidateObject
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onblur",
  () => attributeValidateOnblur
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onchange",
  () => attributeValidateOnchange
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onclick",
  () => attributeValidateOnclick
);
defineLazyProp(
  builtInRules,
  "attribute-validate-ondblclick",
  () => attributeValidateOndblclick
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onfocus",
  () => attributeValidateOnfocus
);
defineLazyProp(
  builtInRules,
  "attribute-validate-onkeydown",
  () => attributeValidateOnkeydown
);
defineLazyProp(
  builtInRules,
  "attribute-validate-rowspan",
  () => attributeValidateRowspan
);
defineLazyProp(
  builtInRules,
  "attribute-validate-rules",
  () => attributeValidateRules
);
defineLazyProp(
  builtInRules,
  "attribute-validate-text",
  () => attributeValidateText
);
defineLazyProp(
  builtInRules,
  "attribute-validate-vlink",
  () => attributeValidateVlink
);
defineLazyProp(
  builtInRules,
  "attribute-validate-width",
  () => attributeValidateWidth
);
defineLazyProp(
  builtInRules,
  "bad-named-html-entity-not-email-friendly",
  () => htmlEntitiesNotEmailFriendly
);
defineLazyProp(builtInRules, "character-encode", () => characterEncode);
defineLazyProp(
  builtInRules,
  "character-unspaced-punctuation",
  () => characterUnspacedPunctuation
);
function get(something) {
  return builtInRules[something];
}
function normaliseRequestedRules(opts) {
  const res = {};
  if (Object.keys(opts).includes("all") && isEnabled(opts.all)) {
    Object.keys(builtInRules).forEach(ruleName => {
      res[ruleName] = opts.all;
    });
  } else {
    let temp;
    if (
      Object.keys(opts).some(ruleName => {
        if (
          ["bad-character", "bad-character*", "bad-character-*"].includes(
            ruleName
          )
        ) {
          temp = ruleName;
          return true;
        }
      })
    ) {
      allBadCharacterRules.forEach(ruleName => {
        res[ruleName] = opts[temp];
      });
    }
    if (
      Object.keys(opts).some(ruleName => {
        if (["tag", "tag*", "tag-*"].includes(ruleName)) {
          temp = ruleName;
          return true;
        }
      })
    ) {
      allTagRules.forEach(ruleName => {
        res[ruleName] = opts[temp];
      });
    }
    if (
      Object.keys(opts).some(ruleName => {
        if (["attribute", "attribute*", "attribute-*"].includes(ruleName)) {
          temp = ruleName;
          return true;
        }
      })
    ) {
      allAttribRules.forEach(ruleName => {
        res[ruleName] = opts[temp];
      });
    }
    if (Object.keys(opts).includes("bad-html-entity")) {
      allBadNamedHTMLEntityRules.forEach(ruleName => {
        res[ruleName] = opts["bad-html-entity"];
      });
    }
    Object.keys(opts).forEach(ruleName => {
      if (
        ![
          "all",
          "tag",
          "tag*",
          "tag-*",
          "attribute",
          "attribute*",
          "attribute-*",
          "bad-character",
          "bad-character",
          "bad-character*",
          "bad-character-*",
          "bad-html-entity"
        ].includes(ruleName)
      ) {
        if (Object.keys(builtInRules).includes(ruleName)) {
          res[ruleName] = clone(opts[ruleName]);
        } else if (ruleName.includes("*")) {
          Object.keys(builtInRules).forEach(builtInRule => {
            if (matcher.isMatch(builtInRule, ruleName)) {
              res[builtInRule] = clone(opts[ruleName]);
            }
          });
        }
      }
    });
  }
  return res;
}

var domain;
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);
function EventEmitter() {
  EventEmitter.init.call(this);
}
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.usingDomains = false;
EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;
EventEmitter.defaultMaxListeners = 10;
EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    if (domain.active && !(this instanceof domain.Domain)) ;
  }
  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || undefined;
};
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};
function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}
function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}
EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var doError = (type === 'error');
  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;
  domain = this.domain;
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er;
    } else {
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }
  handler = events[type];
  if (!handler)
    return false;
  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);
      events = target._events;
    }
    existing = events[type];
  }
  if (!existing) {
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }
  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}
EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      events = this._events;
      if (!events)
        return this;
      list = events[type];
      if (!list)
        return this;
      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;
        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }
        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }
      return this;
    };
EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;
      events = this._events;
      if (!events)
        return this;
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }
      return this;
    };
EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;
  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }
  return ret;
};
EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;
  if (events) {
    var evlistener = events[type];
    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}
function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

EventEmitter.defaultMaxListeners = 0;
class Linter extends EventEmitter {
  verify(str, config) {
    this.messages = [];
    this.str = str;
    this.config = config;
    if (config) {
      if (typeof config !== "object") {
        throw new Error(
          `emlint/verify(): [THROW_ID_01] second input argument, config is not a plain object but ${typeof config}. It's equal to:\n${JSON.stringify(
            config,
            null,
            4
          )}`
        );
      } else if (!Object.keys(config).length) {
        return this.messages;
      } else if (!config.rules || typeof config.rules !== "object") {
        throw new Error(
          `emlint/verify(): [THROW_ID_02] config contains no rules! It was given as:\n${JSON.stringify(
            config,
            null,
            4
          )}`
        );
      }
    } else {
      return this.messages;
    }
    const processedRulesConfig = normaliseRequestedRules(config.rules);
    this.processedRulesConfig = processedRulesConfig;
    Object.keys(processedRulesConfig)
      .filter(ruleName => get(ruleName))
      .filter(ruleName => {
        if (typeof processedRulesConfig[ruleName] === "number") {
          return processedRulesConfig[ruleName] > 0;
        } else if (Array.isArray(processedRulesConfig[ruleName])) {
          return processedRulesConfig[ruleName][0] > 0;
        }
      })
      .forEach(rule => {
        let rulesFunction;
        if (
          Array.isArray(processedRulesConfig[rule]) &&
          processedRulesConfig[rule].length > 1
        ) {
          rulesFunction = get(rule)(
            this,
            ...processedRulesConfig[rule].slice(1)
          );
        } else {
          rulesFunction = get(rule)(this);
        }
        Object.keys(rulesFunction).forEach(consumedNode => {
          this.on(consumedNode, (...args) => {
            rulesFunction[consumedNode](...args);
          });
        });
      });
    tokenizer(
      str,
      obj => {
        this.emit(obj.type, obj);
        if (
          obj.type === "html" &&
          Array.isArray(obj.attribs) &&
          obj.attribs.length
        ) {
          obj.attribs.forEach(attribObj => {
            this.emit(
              "attribute",
              Object.assign({}, attribObj, {
                parent: Object.assign({}, obj)
              })
            );
          });
        }
      },
      obj => {
        this.emit("character", obj);
      }
    );
    if (
      Object.keys(config.rules).some(
        ruleName =>
          (ruleName === "all" ||
          ruleName === "bad-html-entity" ||
            ruleName.startsWith("bad-html-entity") ||
            ruleName.startsWith("bad-named-html-entity") ||
            matcher.isMatch(
              ["bad-malformed-numeric-character-entity"],
              ruleName
            )) &&
          (isEnabled(config.rules[ruleName]) ||
            isEnabled(processedRulesConfig[ruleName]))
      )
    ) {
      stringFixBrokenNamedEntities(str, {
        cb: obj => {
          let matchedRulesName;
          let severity;
          if (Object.keys(config.rules).includes("bad-html-entity")) {
            if (obj.ruleName === "bad-named-html-entity-unrecognised") {
              severity = 1;
            } else if (Array.isArray(config.rules["bad-html-entity"])) {
              severity = config.rules["bad-html-entity"][0];
            } else if (Number.isInteger(config.rules["bad-html-entity"])) {
              severity = config.rules["bad-html-entity"];
            }
          } else if (
            Object.keys(config.rules).some(rulesName => {
              if (matcher.isMatch(obj.ruleName, rulesName)) {
                matchedRulesName = rulesName;
                return true;
              }
            })
          ) {
            if (
              obj.ruleName === "bad-named-html-entity-unrecognised" &&
              config.rules["bad-named-html-entity-unrecognised"] === undefined
            ) {
              severity = 1;
            } else if (Array.isArray(config.rules[matchedRulesName])) {
              severity = config.rules[matchedRulesName][0];
            } else if (Number.isInteger(config.rules[matchedRulesName])) {
              severity = config.rules[matchedRulesName];
            }
          }
          if (Number.isInteger(severity)) {
            let message;
            if (obj.ruleName === "bad-named-html-entity-malformed-nbsp") {
              message = "Malformed NBSP entity.";
            } else if (obj.ruleName === "bad-named-html-entity-unrecognised") {
              message = "Unrecognised named entity.";
            } else if (
              obj.ruleName === "bad-named-html-entity-multiple-encoding"
            ) {
              message = "HTML entity encoding over and over.";
            } else if (
              obj.ruleName === "bad-malformed-numeric-character-entity"
            ) {
              message = "Malformed numeric entity.";
            } else {
              message = `Malformed ${
                obj.entityName ? obj.entityName : "named"
              } entity.`;
            }
            let ranges = [
              [
                obj.rangeFrom,
                obj.rangeTo,
                obj.rangeValEncoded ? obj.rangeValEncoded : ""
              ]
            ];
            if (obj.ruleName === "bad-named-html-entity-unrecognised") {
              ranges = [];
            }
            this.report({
              severity,
              ruleId: obj.ruleName,
              message,
              idxFrom: obj.rangeFrom,
              idxTo: obj.rangeTo,
              fix: {
                ranges
              }
            });
          }
        },
        entityCatcherCb: (from, to) => {
          this.emit("entity", { idxFrom: from, idxTo: to });
        }
      });
    }
    ["html", "css", "text", "esp", "character"].forEach(eventName => {
      this.removeAllListeners(eventName);
    });
    return this.messages;
  }
  report(obj) {
    const { line, col } = lineColumn(this.str, obj.idxFrom);
    let severity = obj.severity;
    if (
      !Number.isInteger(obj.severity) &&
      typeof this.processedRulesConfig[obj.ruleId] === "number"
    ) {
      severity = this.processedRulesConfig[obj.ruleId];
    } else if (!Number.isInteger(obj.severity)) {
      severity = this.processedRulesConfig[obj.ruleId][0];
    }
    this.messages.push(Object.assign({}, { line, column: col, severity }, obj));
  }
}

var version = "2.9.0";

export { Linter, version };

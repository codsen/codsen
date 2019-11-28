/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 2.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var stringMatchLeftRight = require('string-match-left-right');
var stringLeftRight = require('string-left-right');
var isTagOpening = _interopDefault(require('is-html-tag-opening'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var allHTMLTagsKnownToHumanity = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"];
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "string" && something.charCodeAt(0) >= 48 && something.charCodeAt(0) <= 57 || Number.isInteger(something);
}
function isLatinLetter(_char4) {
  return isStr(_char4) && _char4.length === 1 && (_char4.charCodeAt(0) > 64 && _char4.charCodeAt(0) < 91 || _char4.charCodeAt(0) > 96 && _char4.charCodeAt(0) < 123);
}
function flipEspTag(str) {
  var res = "";
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i] === "{") {
      res = "}".concat(res);
    } else if (str[i] === "(") {
      res = ")".concat(res);
    } else {
      res = "".concat(str[i]).concat(res);
    }
  }
  return res;
}

var defaults = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
var espChars = "{}%-$_()*|";
function tokenizer(str, tagCb, charCb, originalOpts) {
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof(str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }
  }
  if (tagCb && typeof tagCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_03] the second input argument, callback function, should be a function but it was given as type ".concat(_typeof(tagCb), ", equal to ").concat(JSON.stringify(tagCb, null, 4)));
  }
  if (charCb && typeof charCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_04] the second input argument, callback function, should be a function but it was given as type ".concat(_typeof(charCb), ", equal to ").concat(JSON.stringify(charCb, null, 4)));
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("codsen-tokenizer: [THROW_ID_05] the third input argument, options object, should be a plain object but it was given as type ".concat(_typeof(originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var opts = Object.assign({}, defaults, originalOpts);
  if (opts.reportProgressFunc && typeof opts.reportProgressFunc !== "function") {
    throw new TypeError("codsen-tokenizer: [THROW_ID_06] opts.reportProgressFunc should be a function but it was given as :\n".concat(JSON.stringify(opts.reportProgressFunc, null, 4), " (").concat(_typeof(opts.reportProgressFunc), ")"));
  }
  var currentPercentageDone;
  var lastPercentage = 0;
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var doNothing;
  var styleStarts = false;
  var token = {};
  var tokenDefault = {
    type: null,
    start: null,
    end: null,
    tail: null,
    kind: null
  };
  function tokenReset() {
    token = Object.assign({}, tokenDefault);
  }
  tokenReset();
  var layers = [];
  function matchLayerLast(str, i) {
    if (!layers.length) {
      return false;
    } else if (layers[layers.length - 1].type === "simple") {
      return str[i] === layers[layers.length - 1].value;
    } else if (layers[layers.length - 1].type === "esp") {
      if (!espChars.includes(str[i])) {
        return false;
      }
      var wholeEspTagLump = "";
      var _len = str.length;
      for (var y = i; y < _len; y++) {
        if (espChars.includes(str[y])) {
          wholeEspTagLump = wholeEspTagLump + str[y];
        } else {
          break;
        }
      }
      console.log("216 wholeEspTagLump = ".concat(wholeEspTagLump));
      return layers[layers.length - 1].value.split("").every(function (_char) {
        return wholeEspTagLump.includes(_char);
      });
    }
  }
  function pingCharCb(incomingToken) {
    if (charCb) {
      charCb(incomingToken);
    }
  }
  function pingTagCb(incomingToken) {
    if (tagCb) {
      console.log("236 PING tagCb() with ".concat(JSON.stringify(incomingToken, null, 4)));
      tagCb(clone(incomingToken));
      tokenReset();
    }
  }
  function dumpCurrentToken(token, i) {
    console.log("246 ".concat("\x1B[".concat(35, "m", "dumpCurrentToken()", "\x1B[", 39, "m"), "; incoming token=", JSON.stringify(token, null, 0), "; i = ", "\x1B[".concat(33, "m", i, "\x1B[", 39, "m")));
    if (token.type !== "text" && token.start !== null && token.start < i && str[i - 1] && !str[i - 1].trim().length) {
      console.log("261 this token indeed had trailing whitespace");
      token.end = stringLeftRight.left(str, i) + 1;
      console.log("265 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
      pingTagCb(token);
      token.start = stringLeftRight.left(str, i) + 1;
      token.type = "text";
      console.log("273 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
    }
    if (token.start !== null) {
      token.end = i;
      console.log("283 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end, "; then PING tagCb()"));
      pingTagCb(token);
    }
  }
  function initHtmlToken() {
    token = Object.assign({
      tagNameStartAt: null,
      tagNameEndAt: null,
      tagName: null,
      recognised: null,
      closing: false,
      "void": false,
      pureHTML: true,
      esp: []
    }, token);
  }
  for (var i = 0; i < len; i++) {
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(i, " ] = ").concat(str[i] && str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m \x1B[", 36, "m", "===============================", "\x1B[", 39, "m\n"));
    if (opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
        }
      } else if (len >= 2000) {
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom));
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
          console.log("364 DONE ".concat(currentPercentageDone, "%"));
        }
      }
    }
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
      console.log("374 TURN OFF doNothing");
    }
    if (token.end && token.end === i) {
      console.log("379 call dumpCurrentToken()");
      if (token.kind === "style") {
        styleStarts = true;
      }
      dumpCurrentToken(token, i);
    }
    if (!doNothing && ["html"].includes(token.type) && ["\"", "'"].includes(str[i])) {
      if (matchLayerLast(str, i)) {
        layers.pop();
        console.log("407 ".concat("\x1B[".concat(32, "m", "POP", "\x1B[", 39, "m"), " layers"));
        console.log("409 now ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
      } else if (!layers.length || layers[layers.length - 1].type !== "esp") {
        layers.push({
          type: "simple",
          value: str[i]
        });
        console.log("428 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
          type: "simple",
          value: str[i]
        }, null, 4)));
        console.log("438 now ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
      }
    }
    if (!doNothing) {
      if (!layers.length && str[i] === "<" && (isTagOpening(str, i) || str.startsWith("!--", i + 1) || stringMatchLeftRight.matchRight(str, i, ["doctype", "xml", "cdata"], {
        i: true,
        trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
      })) && (token.type !== "esp" || token.tail.includes(str[i]))) {
        console.log("466 html tag opening");
        if (token.type && Number.isInteger(token.start)) {
          console.log("469 call dumpCurrentToken()");
          dumpCurrentToken(token, i);
        } else {
          console.log("472 didn't call dumpCurrentToken()");
        }
        token.start = i;
        token.type = "html";
        console.log("479 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
        initHtmlToken();
        if (stringMatchLeftRight.matchRight(str, i, "!--")) {
          token.kind = "comment";
          console.log("490 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "doctype", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "doctype";
          console.log("502 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "cdata", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "cdata";
          console.log("514 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "xml", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "xml";
          console.log("526 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "style", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-", "/", "\\"]
        })) {
          token.kind = "style";
          console.log("538 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        }
      } else if (!(token.type === "html" && token.kind === "comment") && espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) && !(str[i] === "-" && str[i + 1] === "-")) {
        console.log("550 ESP tag detected");
        var wholeEspTagLump = "";
        for (var y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        console.log("565 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " wholeEspTagLump = ", wholeEspTagLump));
        console.log("568 FIY, ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
        if (!["html", "esp"].includes(token.type)) {
          console.log("576");
          dumpCurrentToken(token, i);
          token.start = i;
          token.type = "esp";
          console.log("582 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
          doNothing = i + wholeEspTagLump.length;
          console.log("588 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
          token.tail = flipEspTag(wholeEspTagLump);
          console.log("592 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tail", "\x1B[", 39, "m"), " = ", token.tail));
          token.head = wholeEspTagLump;
        } else if (token.type === "html") {
          console.log("598");
          if (matchLayerLast(str, i)) {
            layers.pop();
            console.log("602 ".concat("\x1B[".concat(32, "m", "POP", "\x1B[", 39, "m"), " layers"));
          } else {
            console.log("604 ESP tag within HTML tag");
            layers.push({
              type: "esp",
              value: flipEspTag(wholeEspTagLump)
            });
            console.log("610 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
              type: "esp",
              value: flipEspTag(wholeEspTagLump)
            }, null, 4)));
            console.log("620 ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
          }
        } else {
          console.log("628");
        }
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          console.log("632");
          if (!str[i].trim().length) {
            token.start = i;
            token.type = "text";
            token.end = stringLeftRight.right(str, i) || str.length;
            console.log("639 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ").concat(token.end, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
            pingTagCb(token);
            if (stringLeftRight.right(str, i)) {
              token.start = stringLeftRight.right(str, i);
              token.type = "css";
              console.log("653 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
              doNothing = stringLeftRight.right(str, i);
              console.log("662 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
            }
          } else {
            token.start = i;
            token.type = "css";
            console.log("670 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
          }
        } else {
          token.start = i;
          console.log("679 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start));
          token.type = "text";
          console.log("685 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ", token.type));
        }
      }
    }
    if (!doNothing) {
      if (token.type === "html" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        console.log("701 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
      } else if (token.type === "esp" && token.end === null && isStr(token.tail) && token.tail.includes(str[i])) {
        console.log("711 POSSIBLE ESP TAILS");
        var wholeEspTagClosing = "";
        for (var _y = i; _y < len; _y++) {
          if (espChars.includes(str[_y])) {
            wholeEspTagClosing = wholeEspTagClosing + str[_y];
          } else {
            break;
          }
        }
        console.log("722 wholeEspTagClosing = ".concat(wholeEspTagClosing));
        if (wholeEspTagClosing.length > token.head.length) {
          console.log("732 wholeEspTagClosing.length = ".concat("\x1B[".concat(33, "m", wholeEspTagClosing.length, "\x1B[", 39, "m"), " > token.head.length = ", "\x1B[".concat(33, "m", token.head.length, "\x1B[", 39, "m")));
          var headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            console.log("760 - chunk ends with the same heads");
            token.end = i + wholeEspTagClosing.length - token.head.length;
            console.log("782 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
            doNothing = token.end;
            console.log("788 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            console.log("793 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
            doNothing = token.end;
            console.log("799 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
          } else if (!token.tail.includes(headsFirstChar) && wholeEspTagClosing.includes(headsFirstChar) || wholeEspTagClosing.endsWith(token.head) || wholeEspTagClosing.startsWith(token.tail)) {
            (function () {
              console.log("807");
              var firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
              var secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar));
              console.log("".concat("\x1B[".concat(33, "m", "firstPartOfWholeEspTagClosing", "\x1B[", 39, "m"), " = ", JSON.stringify(firstPartOfWholeEspTagClosing, null, 4)));
              console.log("".concat("\x1B[".concat(33, "m", "secondPartOfWholeEspTagClosing", "\x1B[", 39, "m"), " = ", JSON.stringify(secondPartOfWholeEspTagClosing, null, 4)));
              if (firstPartOfWholeEspTagClosing.length && secondPartOfWholeEspTagClosing.length && token.tail.split("").every(function (_char2) {
                return firstPartOfWholeEspTagClosing.includes(_char2);
              })) {
                console.log("842 definitely tails + new heads");
                token.end = i + firstPartOfWholeEspTagClosing.length;
                console.log("845 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
                doNothing = token.end;
                console.log("851 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
              }
            })();
          } else {
            console.log("CASE #2.");
            token.end = i + wholeEspTagClosing.length;
            console.log("866 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
            doNothing = token.end;
            console.log("872 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
          }
          console.log("875");
        } else {
          token.end = i + wholeEspTagClosing.length;
          console.log("880 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
          doNothing = token.end;
          console.log("886 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
        }
      }
    }
    if (token.type === "html" && isNum(token.tagNameStartAt) && !isNum(token.tagNameEndAt)) {
      if (!isLatinLetter(str[i]) && !isNum(str[i])) {
        token.tagNameEndAt = i;
        console.log("905 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tagNameEndAt", "\x1B[", 39, "m"), " = ", token.tagNameEndAt));
        token.tagName = str.slice(token.tagNameStartAt, i);
        console.log("912 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tagName", "\x1B[", 39, "m"), " = ", token.tagName));
        if (voidTags.includes(token.tagName)) {
          token["void"] = true;
          console.log("923 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.void", "\x1B[", 39, "m"), " = ", token["void"]));
        }
        token.recognised = allHTMLTagsKnownToHumanity.includes(token.tagName.toLowerCase()) || ["doctype", "cdata", "xml"].includes(token.tagName.toLowerCase());
        console.log("933 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.recognised", "\x1B[", 39, "m"), " = ", token.recognised));
      }
    }
    if (token.type === "html" && !isNum(token.tagNameStartAt) && isNum(token.start) && token.start < i) {
      if (str[i] === "/") {
        token.closing = true;
        console.log("955 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.closing", "\x1B[", 39, "m"), " = ", token.closing));
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartAt = i;
        console.log("962 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tagNameStartAt", "\x1B[", 39, "m"), " = ", token.tagNameStartAt));
        if (!token.closing) {
          token.closing = false;
          console.log("971 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.closing", "\x1B[", 39, "m"), " = ", token.closing));
        }
      }
    }
    if (charCb) {
      console.log("1004 ".concat("\x1B[".concat(32, "m", "PING", "\x1B[", 39, "m"), " ", JSON.stringify({
        type: token.type,
        chr: str[i],
        i: i
      }, null, 4)));
      pingCharCb({
        type: token.type,
        chr: str[i],
        i: i
      });
    }
    if (!str[i + 1] && token.start !== null) {
      token.end = i + 1;
      pingTagCb(token);
    }
    console.log("".concat("\x1B[".concat(90, "m", "==========================================\ntoken: ".concat(JSON.stringify(token, null, 0)).concat(layers.length ? "\nlayers: ".concat(JSON.stringify(layers, null, 0)) : ""), "\x1B[", 39, "m"), doNothing ? "\n".concat("\x1B[".concat(31, "m", "DO NOTHING UNTIL ".concat(doNothing), "\x1B[", 39, "m")) : ""));
  }
}

module.exports = tokenizer;

/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 2.0.0
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

var allHTMLTagsKnownToHumanity = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"];
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
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
    console.log("246 ".concat("\x1B[".concat(35, "m", "dumpCurrentToken()", "\x1B[", 39, "m"), "; incoming token=", JSON.stringify(token, null, 0)));
    if (token.type !== "text" && token.start !== null && str[i - 1] && !str[i - 1].trim().length) {
      console.log("260 this token indeed had trailing whitespace");
      token.end = stringLeftRight.left(str, i) + 1;
      console.log("264 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
      pingTagCb(token);
      token.start = stringLeftRight.left(str, i) + 1;
      token.type = "text";
      console.log("272 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
    }
    if (token.start !== null) {
      token.end = i;
      console.log("282 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end, "; then PING tagCb()"));
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
          console.log("363 DONE ".concat(currentPercentageDone, "%"));
        }
      }
    }
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
      console.log("373 TURN OFF doNothing");
    }
    if (token.end && token.end === i) {
      console.log("378 call dumpCurrentToken()");
      if (token.kind === "style") {
        styleStarts = true;
      }
      dumpCurrentToken(token, i);
    }
    if (!doNothing && ["html"].includes(token.type) && ["\"", "'"].includes(str[i])) {
      if (matchLayerLast(str, i)) {
        layers.pop();
        console.log("406 ".concat("\x1B[".concat(32, "m", "POP", "\x1B[", 39, "m"), " layers"));
        console.log("408 now ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
      } else if (!layers.length || layers[layers.length - 1].type !== "esp") {
        layers.push({
          type: "simple",
          value: str[i]
        });
        console.log("427 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
          type: "simple",
          value: str[i]
        }, null, 4)));
        console.log("437 now ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
      }
    }
    if (!doNothing) {
      console.log("454 FIY, layers.length = ".concat(layers.length));
      if (!layers.length && str[i] === "<" && (isTagOpening(str, i) || stringMatchLeftRight.matchRight(str, i, ["!--", "!doctype", "?xml"], {
        i: true
      })) && (token.type !== "esp" || token.tail.includes(str[i]))) {
        console.log("462 html tag opening");
        if (token.type) {
          dumpCurrentToken(token, i);
        }
        token.start = i;
        token.type = "html";
        console.log("472 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
        initHtmlToken();
        if (stringMatchLeftRight.matchRight(str, i, "!--")) {
          token.kind = "comment";
          console.log("483 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "!doctype", {
          i: true
        })) {
          token.kind = "doctype";
          console.log("490 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "?xml", {
          i: true
        })) {
          token.kind = "xml";
          console.log("497 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "style", {
          i: true,
          trimCharsBeforeMatching: "/"
        })) {
          token.kind = "style";
          console.log("506 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        }
      } else if (!(token.type === "html" && token.kind === "comment") && espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) && !(str[i] === "-" && str[i + 1] === "-")) {
        console.log("518 ESP tag detected");
        var wholeEspTagLump = "";
        for (var y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        console.log("533 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " wholeEspTagLump = ", wholeEspTagLump));
        console.log("536 FIY, ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
        if (!["html", "esp"].includes(token.type)) {
          console.log("544");
          dumpCurrentToken(token, i);
          token.start = i;
          token.type = "esp";
          console.log("550 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
          doNothing = i + wholeEspTagLump.length;
          console.log("556 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
          token.tail = flipEspTag(wholeEspTagLump);
          console.log("560 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tail", "\x1B[", 39, "m"), " = ", token.tail));
        } else if (token.type === "html") {
          console.log("565");
          if (matchLayerLast(str, i)) {
            layers.pop();
            console.log("569 ".concat("\x1B[".concat(32, "m", "POP", "\x1B[", 39, "m"), " layers"));
          } else {
            console.log("571 ESP tag within HTML tag");
            layers.push({
              type: "esp",
              value: flipEspTag(wholeEspTagLump)
            });
            console.log("577 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
              type: "esp",
              value: flipEspTag(wholeEspTagLump)
            }, null, 4)));
            console.log("587 ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
          }
        } else {
          console.log("595");
        }
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          console.log("599");
          if (!str[i].trim().length) {
            token.start = i;
            token.type = "text";
            token.end = stringLeftRight.right(str, i) || str.length;
            console.log("606 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ").concat(token.end, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
            pingTagCb(token);
            if (stringLeftRight.right(str, i)) {
              token.start = stringLeftRight.right(str, i);
              token.type = "css";
              console.log("620 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
              doNothing = stringLeftRight.right(str, i);
              console.log("629 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
            }
          } else {
            token.start = i;
            token.type = "css";
            console.log("637 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
          }
        } else {
          token.start = i;
          console.log("646 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start));
          token.type = "text";
          console.log("652 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ", token.type));
        }
      }
    }
    if (!doNothing) {
      if (token.type === "html" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        console.log("668 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
      } else if (token.type === "esp" && token.end === null && isStr(token.tail) && token.tail.includes(str[i])) {
        console.log("678 POSSIBLE ESP TAILS");
        var wholeEspTagClosing = "";
        for (var _y = i; _y < len; _y++) {
          if (espChars.includes(str[_y])) {
            wholeEspTagClosing = wholeEspTagClosing + str[_y];
          } else {
            break;
          }
        }
        console.log("688 wholeEspTagClosing = ".concat(wholeEspTagClosing));
        token.end = i + wholeEspTagClosing.length;
        console.log("692 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
        doNothing = i + wholeEspTagClosing.length;
        console.log("698 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
      }
    }
    if (token.type === "html" && isNum(token.tagNameStartAt) && !isNum(token.tagNameEndAt)) {
      if (!isLatinLetter(str[i])) {
        token.tagNameEndAt = i;
        console.log("715 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tagNameEndAt", "\x1B[", 39, "m"), " = ", token.tagNameEndAt));
        token.tagName = str.slice(token.tagNameStartAt, i);
        console.log("722 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tagName", "\x1B[", 39, "m"), " = ", token.tagName));
        if (voidTags.includes(token.tagName)) {
          token["void"] = true;
          console.log("733 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.void", "\x1B[", 39, "m"), " = ", token["void"]));
        }
        token.recognised = allHTMLTagsKnownToHumanity.includes(token.tagName.toLowerCase());
        console.log("743 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.recognised", "\x1B[", 39, "m"), " = ", token.recognised));
      }
    }
    if (token.type === "html" && !isNum(token.tagNameStartAt) && isNum(token.start) && token.start < i) {
      if (str[i] === "/") {
        token.closing = true;
        console.log("765 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.closing", "\x1B[", 39, "m"), " = ", token.closing));
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartAt = i;
        console.log("772 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tagNameStartAt", "\x1B[", 39, "m"), " = ", token.tagNameStartAt));
        if (!token.closing) {
          token.closing = false;
          console.log("781 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.closing", "\x1B[", 39, "m"), " = ", token.closing));
        }
      }
    }
    if (charCb) {
      console.log("814 ".concat("\x1B[".concat(32, "m", "PING", "\x1B[", 39, "m"), " ", JSON.stringify({
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

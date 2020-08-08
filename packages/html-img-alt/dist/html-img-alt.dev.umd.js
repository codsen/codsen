/**
 * html-img-alt
 * Adds missing ALT attributes to IMG tags and cleans within IMG tags. No HTML parsing used.
 * Version: 1.4.56
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/html-img-alt
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.htmlImgAlt = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  	  path: basedir,
  	  exports: {},
  	  require: function (path, base) {
        return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
      }
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var he = createCommonjsModule(function (module, exports) {

    (function (root) {
      // Detect free variables `exports`.
      var freeExports =  exports; // Detect free variable `module`.

      var freeModule =  module && module.exports == freeExports && module; // Detect free variable `global`, from Node.js or Browserified code,
      // and use it as `root`.

      var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal;

      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
      }
      /*--------------------------------------------------------------------------*/
      // All astral symbols.


      var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g; // All ASCII symbols (not just printable ASCII) except those listed in the
      // first column of the overrides table.
      // https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides

      var regexAsciiWhitelist = /[\x01-\x7F]/g; // All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
      // code points listed in the first column of the overrides table on
      // https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides.

      var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
      var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
      var encodeMap = {
        '\xAD': 'shy',
        "\u200C": 'zwnj',
        "\u200D": 'zwj',
        "\u200E": 'lrm',
        "\u2063": 'ic',
        "\u2062": 'it',
        "\u2061": 'af',
        "\u200F": 'rlm',
        "\u200B": 'ZeroWidthSpace',
        "\u2060": 'NoBreak',
        "\u0311": 'DownBreve',
        "\u20DB": 'tdot',
        "\u20DC": 'DotDot',
        '\t': 'Tab',
        '\n': 'NewLine',
        "\u2008": 'puncsp',
        "\u205F": 'MediumSpace',
        "\u2009": 'thinsp',
        "\u200A": 'hairsp',
        "\u2004": 'emsp13',
        "\u2002": 'ensp',
        "\u2005": 'emsp14',
        "\u2003": 'emsp',
        "\u2007": 'numsp',
        '\xA0': 'nbsp',
        "\u205F\u200A": 'ThickSpace',
        "\u203E": 'oline',
        '_': 'lowbar',
        "\u2010": 'dash',
        "\u2013": 'ndash',
        "\u2014": 'mdash',
        "\u2015": 'horbar',
        ',': 'comma',
        ';': 'semi',
        "\u204F": 'bsemi',
        ':': 'colon',
        "\u2A74": 'Colone',
        '!': 'excl',
        '\xA1': 'iexcl',
        '?': 'quest',
        '\xBF': 'iquest',
        '.': 'period',
        "\u2025": 'nldr',
        "\u2026": 'mldr',
        '\xB7': 'middot',
        '\'': 'apos',
        "\u2018": 'lsquo',
        "\u2019": 'rsquo',
        "\u201A": 'sbquo',
        "\u2039": 'lsaquo',
        "\u203A": 'rsaquo',
        '"': 'quot',
        "\u201C": 'ldquo',
        "\u201D": 'rdquo',
        "\u201E": 'bdquo',
        '\xAB': 'laquo',
        '\xBB': 'raquo',
        '(': 'lpar',
        ')': 'rpar',
        '[': 'lsqb',
        ']': 'rsqb',
        '{': 'lcub',
        '}': 'rcub',
        "\u2308": 'lceil',
        "\u2309": 'rceil',
        "\u230A": 'lfloor',
        "\u230B": 'rfloor',
        "\u2985": 'lopar',
        "\u2986": 'ropar',
        "\u298B": 'lbrke',
        "\u298C": 'rbrke',
        "\u298D": 'lbrkslu',
        "\u298E": 'rbrksld',
        "\u298F": 'lbrksld',
        "\u2990": 'rbrkslu',
        "\u2991": 'langd',
        "\u2992": 'rangd',
        "\u2993": 'lparlt',
        "\u2994": 'rpargt',
        "\u2995": 'gtlPar',
        "\u2996": 'ltrPar',
        "\u27E6": 'lobrk',
        "\u27E7": 'robrk',
        "\u27E8": 'lang',
        "\u27E9": 'rang',
        "\u27EA": 'Lang',
        "\u27EB": 'Rang',
        "\u27EC": 'loang',
        "\u27ED": 'roang',
        "\u2772": 'lbbrk',
        "\u2773": 'rbbrk',
        "\u2016": 'Vert',
        '\xA7': 'sect',
        '\xB6': 'para',
        '@': 'commat',
        '*': 'ast',
        '/': 'sol',
        'undefined': null,
        '&': 'amp',
        '#': 'num',
        '%': 'percnt',
        "\u2030": 'permil',
        "\u2031": 'pertenk',
        "\u2020": 'dagger',
        "\u2021": 'Dagger',
        "\u2022": 'bull',
        "\u2043": 'hybull',
        "\u2032": 'prime',
        "\u2033": 'Prime',
        "\u2034": 'tprime',
        "\u2057": 'qprime',
        "\u2035": 'bprime',
        "\u2041": 'caret',
        '`': 'grave',
        '\xB4': 'acute',
        "\u02DC": 'tilde',
        '^': 'Hat',
        '\xAF': 'macr',
        "\u02D8": 'breve',
        "\u02D9": 'dot',
        '\xA8': 'die',
        "\u02DA": 'ring',
        "\u02DD": 'dblac',
        '\xB8': 'cedil',
        "\u02DB": 'ogon',
        "\u02C6": 'circ',
        "\u02C7": 'caron',
        '\xB0': 'deg',
        '\xA9': 'copy',
        '\xAE': 'reg',
        "\u2117": 'copysr',
        "\u2118": 'wp',
        "\u211E": 'rx',
        "\u2127": 'mho',
        "\u2129": 'iiota',
        "\u2190": 'larr',
        "\u219A": 'nlarr',
        "\u2192": 'rarr',
        "\u219B": 'nrarr',
        "\u2191": 'uarr',
        "\u2193": 'darr',
        "\u2194": 'harr',
        "\u21AE": 'nharr',
        "\u2195": 'varr',
        "\u2196": 'nwarr',
        "\u2197": 'nearr',
        "\u2198": 'searr',
        "\u2199": 'swarr',
        "\u219D": 'rarrw',
        "\u219D\u0338": 'nrarrw',
        "\u219E": 'Larr',
        "\u219F": 'Uarr',
        "\u21A0": 'Rarr',
        "\u21A1": 'Darr',
        "\u21A2": 'larrtl',
        "\u21A3": 'rarrtl',
        "\u21A4": 'mapstoleft',
        "\u21A5": 'mapstoup',
        "\u21A6": 'map',
        "\u21A7": 'mapstodown',
        "\u21A9": 'larrhk',
        "\u21AA": 'rarrhk',
        "\u21AB": 'larrlp',
        "\u21AC": 'rarrlp',
        "\u21AD": 'harrw',
        "\u21B0": 'lsh',
        "\u21B1": 'rsh',
        "\u21B2": 'ldsh',
        "\u21B3": 'rdsh',
        "\u21B5": 'crarr',
        "\u21B6": 'cularr',
        "\u21B7": 'curarr',
        "\u21BA": 'olarr',
        "\u21BB": 'orarr',
        "\u21BC": 'lharu',
        "\u21BD": 'lhard',
        "\u21BE": 'uharr',
        "\u21BF": 'uharl',
        "\u21C0": 'rharu',
        "\u21C1": 'rhard',
        "\u21C2": 'dharr',
        "\u21C3": 'dharl',
        "\u21C4": 'rlarr',
        "\u21C5": 'udarr',
        "\u21C6": 'lrarr',
        "\u21C7": 'llarr',
        "\u21C8": 'uuarr',
        "\u21C9": 'rrarr',
        "\u21CA": 'ddarr',
        "\u21CB": 'lrhar',
        "\u21CC": 'rlhar',
        "\u21D0": 'lArr',
        "\u21CD": 'nlArr',
        "\u21D1": 'uArr',
        "\u21D2": 'rArr',
        "\u21CF": 'nrArr',
        "\u21D3": 'dArr',
        "\u21D4": 'iff',
        "\u21CE": 'nhArr',
        "\u21D5": 'vArr',
        "\u21D6": 'nwArr',
        "\u21D7": 'neArr',
        "\u21D8": 'seArr',
        "\u21D9": 'swArr',
        "\u21DA": 'lAarr',
        "\u21DB": 'rAarr',
        "\u21DD": 'zigrarr',
        "\u21E4": 'larrb',
        "\u21E5": 'rarrb',
        "\u21F5": 'duarr',
        "\u21FD": 'loarr',
        "\u21FE": 'roarr',
        "\u21FF": 'hoarr',
        "\u2200": 'forall',
        "\u2201": 'comp',
        "\u2202": 'part',
        "\u2202\u0338": 'npart',
        "\u2203": 'exist',
        "\u2204": 'nexist',
        "\u2205": 'empty',
        "\u2207": 'Del',
        "\u2208": 'in',
        "\u2209": 'notin',
        "\u220B": 'ni',
        "\u220C": 'notni',
        "\u03F6": 'bepsi',
        "\u220F": 'prod',
        "\u2210": 'coprod',
        "\u2211": 'sum',
        '+': 'plus',
        '\xB1': 'pm',
        '\xF7': 'div',
        '\xD7': 'times',
        '<': 'lt',
        "\u226E": 'nlt',
        "<\u20D2": 'nvlt',
        '=': 'equals',
        "\u2260": 'ne',
        "=\u20E5": 'bne',
        "\u2A75": 'Equal',
        '>': 'gt',
        "\u226F": 'ngt',
        ">\u20D2": 'nvgt',
        '\xAC': 'not',
        '|': 'vert',
        '\xA6': 'brvbar',
        "\u2212": 'minus',
        "\u2213": 'mp',
        "\u2214": 'plusdo',
        "\u2044": 'frasl',
        "\u2216": 'setmn',
        "\u2217": 'lowast',
        "\u2218": 'compfn',
        "\u221A": 'Sqrt',
        "\u221D": 'prop',
        "\u221E": 'infin',
        "\u221F": 'angrt',
        "\u2220": 'ang',
        "\u2220\u20D2": 'nang',
        "\u2221": 'angmsd',
        "\u2222": 'angsph',
        "\u2223": 'mid',
        "\u2224": 'nmid',
        "\u2225": 'par',
        "\u2226": 'npar',
        "\u2227": 'and',
        "\u2228": 'or',
        "\u2229": 'cap',
        "\u2229\uFE00": 'caps',
        "\u222A": 'cup',
        "\u222A\uFE00": 'cups',
        "\u222B": 'int',
        "\u222C": 'Int',
        "\u222D": 'tint',
        "\u2A0C": 'qint',
        "\u222E": 'oint',
        "\u222F": 'Conint',
        "\u2230": 'Cconint',
        "\u2231": 'cwint',
        "\u2232": 'cwconint',
        "\u2233": 'awconint',
        "\u2234": 'there4',
        "\u2235": 'becaus',
        "\u2236": 'ratio',
        "\u2237": 'Colon',
        "\u2238": 'minusd',
        "\u223A": 'mDDot',
        "\u223B": 'homtht',
        "\u223C": 'sim',
        "\u2241": 'nsim',
        "\u223C\u20D2": 'nvsim',
        "\u223D": 'bsim',
        "\u223D\u0331": 'race',
        "\u223E": 'ac',
        "\u223E\u0333": 'acE',
        "\u223F": 'acd',
        "\u2240": 'wr',
        "\u2242": 'esim',
        "\u2242\u0338": 'nesim',
        "\u2243": 'sime',
        "\u2244": 'nsime',
        "\u2245": 'cong',
        "\u2247": 'ncong',
        "\u2246": 'simne',
        "\u2248": 'ap',
        "\u2249": 'nap',
        "\u224A": 'ape',
        "\u224B": 'apid',
        "\u224B\u0338": 'napid',
        "\u224C": 'bcong',
        "\u224D": 'CupCap',
        "\u226D": 'NotCupCap',
        "\u224D\u20D2": 'nvap',
        "\u224E": 'bump',
        "\u224E\u0338": 'nbump',
        "\u224F": 'bumpe',
        "\u224F\u0338": 'nbumpe',
        "\u2250": 'doteq',
        "\u2250\u0338": 'nedot',
        "\u2251": 'eDot',
        "\u2252": 'efDot',
        "\u2253": 'erDot',
        "\u2254": 'colone',
        "\u2255": 'ecolon',
        "\u2256": 'ecir',
        "\u2257": 'cire',
        "\u2259": 'wedgeq',
        "\u225A": 'veeeq',
        "\u225C": 'trie',
        "\u225F": 'equest',
        "\u2261": 'equiv',
        "\u2262": 'nequiv',
        "\u2261\u20E5": 'bnequiv',
        "\u2264": 'le',
        "\u2270": 'nle',
        "\u2264\u20D2": 'nvle',
        "\u2265": 'ge',
        "\u2271": 'nge',
        "\u2265\u20D2": 'nvge',
        "\u2266": 'lE',
        "\u2266\u0338": 'nlE',
        "\u2267": 'gE',
        "\u2267\u0338": 'ngE',
        "\u2268\uFE00": 'lvnE',
        "\u2268": 'lnE',
        "\u2269": 'gnE',
        "\u2269\uFE00": 'gvnE',
        "\u226A": 'll',
        "\u226A\u0338": 'nLtv',
        "\u226A\u20D2": 'nLt',
        "\u226B": 'gg',
        "\u226B\u0338": 'nGtv',
        "\u226B\u20D2": 'nGt',
        "\u226C": 'twixt',
        "\u2272": 'lsim',
        "\u2274": 'nlsim',
        "\u2273": 'gsim',
        "\u2275": 'ngsim',
        "\u2276": 'lg',
        "\u2278": 'ntlg',
        "\u2277": 'gl',
        "\u2279": 'ntgl',
        "\u227A": 'pr',
        "\u2280": 'npr',
        "\u227B": 'sc',
        "\u2281": 'nsc',
        "\u227C": 'prcue',
        "\u22E0": 'nprcue',
        "\u227D": 'sccue',
        "\u22E1": 'nsccue',
        "\u227E": 'prsim',
        "\u227F": 'scsim',
        "\u227F\u0338": 'NotSucceedsTilde',
        "\u2282": 'sub',
        "\u2284": 'nsub',
        "\u2282\u20D2": 'vnsub',
        "\u2283": 'sup',
        "\u2285": 'nsup',
        "\u2283\u20D2": 'vnsup',
        "\u2286": 'sube',
        "\u2288": 'nsube',
        "\u2287": 'supe',
        "\u2289": 'nsupe',
        "\u228A\uFE00": 'vsubne',
        "\u228A": 'subne',
        "\u228B\uFE00": 'vsupne',
        "\u228B": 'supne',
        "\u228D": 'cupdot',
        "\u228E": 'uplus',
        "\u228F": 'sqsub',
        "\u228F\u0338": 'NotSquareSubset',
        "\u2290": 'sqsup',
        "\u2290\u0338": 'NotSquareSuperset',
        "\u2291": 'sqsube',
        "\u22E2": 'nsqsube',
        "\u2292": 'sqsupe',
        "\u22E3": 'nsqsupe',
        "\u2293": 'sqcap',
        "\u2293\uFE00": 'sqcaps',
        "\u2294": 'sqcup',
        "\u2294\uFE00": 'sqcups',
        "\u2295": 'oplus',
        "\u2296": 'ominus',
        "\u2297": 'otimes',
        "\u2298": 'osol',
        "\u2299": 'odot',
        "\u229A": 'ocir',
        "\u229B": 'oast',
        "\u229D": 'odash',
        "\u229E": 'plusb',
        "\u229F": 'minusb',
        "\u22A0": 'timesb',
        "\u22A1": 'sdotb',
        "\u22A2": 'vdash',
        "\u22AC": 'nvdash',
        "\u22A3": 'dashv',
        "\u22A4": 'top',
        "\u22A5": 'bot',
        "\u22A7": 'models',
        "\u22A8": 'vDash',
        "\u22AD": 'nvDash',
        "\u22A9": 'Vdash',
        "\u22AE": 'nVdash',
        "\u22AA": 'Vvdash',
        "\u22AB": 'VDash',
        "\u22AF": 'nVDash',
        "\u22B0": 'prurel',
        "\u22B2": 'vltri',
        "\u22EA": 'nltri',
        "\u22B3": 'vrtri',
        "\u22EB": 'nrtri',
        "\u22B4": 'ltrie',
        "\u22EC": 'nltrie',
        "\u22B4\u20D2": 'nvltrie',
        "\u22B5": 'rtrie',
        "\u22ED": 'nrtrie',
        "\u22B5\u20D2": 'nvrtrie',
        "\u22B6": 'origof',
        "\u22B7": 'imof',
        "\u22B8": 'mumap',
        "\u22B9": 'hercon',
        "\u22BA": 'intcal',
        "\u22BB": 'veebar',
        "\u22BD": 'barvee',
        "\u22BE": 'angrtvb',
        "\u22BF": 'lrtri',
        "\u22C0": 'Wedge',
        "\u22C1": 'Vee',
        "\u22C2": 'xcap',
        "\u22C3": 'xcup',
        "\u22C4": 'diam',
        "\u22C5": 'sdot',
        "\u22C6": 'Star',
        "\u22C7": 'divonx',
        "\u22C8": 'bowtie',
        "\u22C9": 'ltimes',
        "\u22CA": 'rtimes',
        "\u22CB": 'lthree',
        "\u22CC": 'rthree',
        "\u22CD": 'bsime',
        "\u22CE": 'cuvee',
        "\u22CF": 'cuwed',
        "\u22D0": 'Sub',
        "\u22D1": 'Sup',
        "\u22D2": 'Cap',
        "\u22D3": 'Cup',
        "\u22D4": 'fork',
        "\u22D5": 'epar',
        "\u22D6": 'ltdot',
        "\u22D7": 'gtdot',
        "\u22D8": 'Ll',
        "\u22D8\u0338": 'nLl',
        "\u22D9": 'Gg',
        "\u22D9\u0338": 'nGg',
        "\u22DA\uFE00": 'lesg',
        "\u22DA": 'leg',
        "\u22DB": 'gel',
        "\u22DB\uFE00": 'gesl',
        "\u22DE": 'cuepr',
        "\u22DF": 'cuesc',
        "\u22E6": 'lnsim',
        "\u22E7": 'gnsim',
        "\u22E8": 'prnsim',
        "\u22E9": 'scnsim',
        "\u22EE": 'vellip',
        "\u22EF": 'ctdot',
        "\u22F0": 'utdot',
        "\u22F1": 'dtdot',
        "\u22F2": 'disin',
        "\u22F3": 'isinsv',
        "\u22F4": 'isins',
        "\u22F5": 'isindot',
        "\u22F5\u0338": 'notindot',
        "\u22F6": 'notinvc',
        "\u22F7": 'notinvb',
        "\u22F9": 'isinE',
        "\u22F9\u0338": 'notinE',
        "\u22FA": 'nisd',
        "\u22FB": 'xnis',
        "\u22FC": 'nis',
        "\u22FD": 'notnivc',
        "\u22FE": 'notnivb',
        "\u2305": 'barwed',
        "\u2306": 'Barwed',
        "\u230C": 'drcrop',
        "\u230D": 'dlcrop',
        "\u230E": 'urcrop',
        "\u230F": 'ulcrop',
        "\u2310": 'bnot',
        "\u2312": 'profline',
        "\u2313": 'profsurf',
        "\u2315": 'telrec',
        "\u2316": 'target',
        "\u231C": 'ulcorn',
        "\u231D": 'urcorn',
        "\u231E": 'dlcorn',
        "\u231F": 'drcorn',
        "\u2322": 'frown',
        "\u2323": 'smile',
        "\u232D": 'cylcty',
        "\u232E": 'profalar',
        "\u2336": 'topbot',
        "\u233D": 'ovbar',
        "\u233F": 'solbar',
        "\u237C": 'angzarr',
        "\u23B0": 'lmoust',
        "\u23B1": 'rmoust',
        "\u23B4": 'tbrk',
        "\u23B5": 'bbrk',
        "\u23B6": 'bbrktbrk',
        "\u23DC": 'OverParenthesis',
        "\u23DD": 'UnderParenthesis',
        "\u23DE": 'OverBrace',
        "\u23DF": 'UnderBrace',
        "\u23E2": 'trpezium',
        "\u23E7": 'elinters',
        "\u2423": 'blank',
        "\u2500": 'boxh',
        "\u2502": 'boxv',
        "\u250C": 'boxdr',
        "\u2510": 'boxdl',
        "\u2514": 'boxur',
        "\u2518": 'boxul',
        "\u251C": 'boxvr',
        "\u2524": 'boxvl',
        "\u252C": 'boxhd',
        "\u2534": 'boxhu',
        "\u253C": 'boxvh',
        "\u2550": 'boxH',
        "\u2551": 'boxV',
        "\u2552": 'boxdR',
        "\u2553": 'boxDr',
        "\u2554": 'boxDR',
        "\u2555": 'boxdL',
        "\u2556": 'boxDl',
        "\u2557": 'boxDL',
        "\u2558": 'boxuR',
        "\u2559": 'boxUr',
        "\u255A": 'boxUR',
        "\u255B": 'boxuL',
        "\u255C": 'boxUl',
        "\u255D": 'boxUL',
        "\u255E": 'boxvR',
        "\u255F": 'boxVr',
        "\u2560": 'boxVR',
        "\u2561": 'boxvL',
        "\u2562": 'boxVl',
        "\u2563": 'boxVL',
        "\u2564": 'boxHd',
        "\u2565": 'boxhD',
        "\u2566": 'boxHD',
        "\u2567": 'boxHu',
        "\u2568": 'boxhU',
        "\u2569": 'boxHU',
        "\u256A": 'boxvH',
        "\u256B": 'boxVh',
        "\u256C": 'boxVH',
        "\u2580": 'uhblk',
        "\u2584": 'lhblk',
        "\u2588": 'block',
        "\u2591": 'blk14',
        "\u2592": 'blk12',
        "\u2593": 'blk34',
        "\u25A1": 'squ',
        "\u25AA": 'squf',
        "\u25AB": 'EmptyVerySmallSquare',
        "\u25AD": 'rect',
        "\u25AE": 'marker',
        "\u25B1": 'fltns',
        "\u25B3": 'xutri',
        "\u25B4": 'utrif',
        "\u25B5": 'utri',
        "\u25B8": 'rtrif',
        "\u25B9": 'rtri',
        "\u25BD": 'xdtri',
        "\u25BE": 'dtrif',
        "\u25BF": 'dtri',
        "\u25C2": 'ltrif',
        "\u25C3": 'ltri',
        "\u25CA": 'loz',
        "\u25CB": 'cir',
        "\u25EC": 'tridot',
        "\u25EF": 'xcirc',
        "\u25F8": 'ultri',
        "\u25F9": 'urtri',
        "\u25FA": 'lltri',
        "\u25FB": 'EmptySmallSquare',
        "\u25FC": 'FilledSmallSquare',
        "\u2605": 'starf',
        "\u2606": 'star',
        "\u260E": 'phone',
        "\u2640": 'female',
        "\u2642": 'male',
        "\u2660": 'spades',
        "\u2663": 'clubs',
        "\u2665": 'hearts',
        "\u2666": 'diams',
        "\u266A": 'sung',
        "\u2713": 'check',
        "\u2717": 'cross',
        "\u2720": 'malt',
        "\u2736": 'sext',
        "\u2758": 'VerticalSeparator',
        "\u27C8": 'bsolhsub',
        "\u27C9": 'suphsol',
        "\u27F5": 'xlarr',
        "\u27F6": 'xrarr',
        "\u27F7": 'xharr',
        "\u27F8": 'xlArr',
        "\u27F9": 'xrArr',
        "\u27FA": 'xhArr',
        "\u27FC": 'xmap',
        "\u27FF": 'dzigrarr',
        "\u2902": 'nvlArr',
        "\u2903": 'nvrArr',
        "\u2904": 'nvHarr',
        "\u2905": 'Map',
        "\u290C": 'lbarr',
        "\u290D": 'rbarr',
        "\u290E": 'lBarr',
        "\u290F": 'rBarr',
        "\u2910": 'RBarr',
        "\u2911": 'DDotrahd',
        "\u2912": 'UpArrowBar',
        "\u2913": 'DownArrowBar',
        "\u2916": 'Rarrtl',
        "\u2919": 'latail',
        "\u291A": 'ratail',
        "\u291B": 'lAtail',
        "\u291C": 'rAtail',
        "\u291D": 'larrfs',
        "\u291E": 'rarrfs',
        "\u291F": 'larrbfs',
        "\u2920": 'rarrbfs',
        "\u2923": 'nwarhk',
        "\u2924": 'nearhk',
        "\u2925": 'searhk',
        "\u2926": 'swarhk',
        "\u2927": 'nwnear',
        "\u2928": 'toea',
        "\u2929": 'tosa',
        "\u292A": 'swnwar',
        "\u2933": 'rarrc',
        "\u2933\u0338": 'nrarrc',
        "\u2935": 'cudarrr',
        "\u2936": 'ldca',
        "\u2937": 'rdca',
        "\u2938": 'cudarrl',
        "\u2939": 'larrpl',
        "\u293C": 'curarrm',
        "\u293D": 'cularrp',
        "\u2945": 'rarrpl',
        "\u2948": 'harrcir',
        "\u2949": 'Uarrocir',
        "\u294A": 'lurdshar',
        "\u294B": 'ldrushar',
        "\u294E": 'LeftRightVector',
        "\u294F": 'RightUpDownVector',
        "\u2950": 'DownLeftRightVector',
        "\u2951": 'LeftUpDownVector',
        "\u2952": 'LeftVectorBar',
        "\u2953": 'RightVectorBar',
        "\u2954": 'RightUpVectorBar',
        "\u2955": 'RightDownVectorBar',
        "\u2956": 'DownLeftVectorBar',
        "\u2957": 'DownRightVectorBar',
        "\u2958": 'LeftUpVectorBar',
        "\u2959": 'LeftDownVectorBar',
        "\u295A": 'LeftTeeVector',
        "\u295B": 'RightTeeVector',
        "\u295C": 'RightUpTeeVector',
        "\u295D": 'RightDownTeeVector',
        "\u295E": 'DownLeftTeeVector',
        "\u295F": 'DownRightTeeVector',
        "\u2960": 'LeftUpTeeVector',
        "\u2961": 'LeftDownTeeVector',
        "\u2962": 'lHar',
        "\u2963": 'uHar',
        "\u2964": 'rHar',
        "\u2965": 'dHar',
        "\u2966": 'luruhar',
        "\u2967": 'ldrdhar',
        "\u2968": 'ruluhar',
        "\u2969": 'rdldhar',
        "\u296A": 'lharul',
        "\u296B": 'llhard',
        "\u296C": 'rharul',
        "\u296D": 'lrhard',
        "\u296E": 'udhar',
        "\u296F": 'duhar',
        "\u2970": 'RoundImplies',
        "\u2971": 'erarr',
        "\u2972": 'simrarr',
        "\u2973": 'larrsim',
        "\u2974": 'rarrsim',
        "\u2975": 'rarrap',
        "\u2976": 'ltlarr',
        "\u2978": 'gtrarr',
        "\u2979": 'subrarr',
        "\u297B": 'suplarr',
        "\u297C": 'lfisht',
        "\u297D": 'rfisht',
        "\u297E": 'ufisht',
        "\u297F": 'dfisht',
        "\u299A": 'vzigzag',
        "\u299C": 'vangrt',
        "\u299D": 'angrtvbd',
        "\u29A4": 'ange',
        "\u29A5": 'range',
        "\u29A6": 'dwangle',
        "\u29A7": 'uwangle',
        "\u29A8": 'angmsdaa',
        "\u29A9": 'angmsdab',
        "\u29AA": 'angmsdac',
        "\u29AB": 'angmsdad',
        "\u29AC": 'angmsdae',
        "\u29AD": 'angmsdaf',
        "\u29AE": 'angmsdag',
        "\u29AF": 'angmsdah',
        "\u29B0": 'bemptyv',
        "\u29B1": 'demptyv',
        "\u29B2": 'cemptyv',
        "\u29B3": 'raemptyv',
        "\u29B4": 'laemptyv',
        "\u29B5": 'ohbar',
        "\u29B6": 'omid',
        "\u29B7": 'opar',
        "\u29B9": 'operp',
        "\u29BB": 'olcross',
        "\u29BC": 'odsold',
        "\u29BE": 'olcir',
        "\u29BF": 'ofcir',
        "\u29C0": 'olt',
        "\u29C1": 'ogt',
        "\u29C2": 'cirscir',
        "\u29C3": 'cirE',
        "\u29C4": 'solb',
        "\u29C5": 'bsolb',
        "\u29C9": 'boxbox',
        "\u29CD": 'trisb',
        "\u29CE": 'rtriltri',
        "\u29CF": 'LeftTriangleBar',
        "\u29CF\u0338": 'NotLeftTriangleBar',
        "\u29D0": 'RightTriangleBar',
        "\u29D0\u0338": 'NotRightTriangleBar',
        "\u29DC": 'iinfin',
        "\u29DD": 'infintie',
        "\u29DE": 'nvinfin',
        "\u29E3": 'eparsl',
        "\u29E4": 'smeparsl',
        "\u29E5": 'eqvparsl',
        "\u29EB": 'lozf',
        "\u29F4": 'RuleDelayed',
        "\u29F6": 'dsol',
        "\u2A00": 'xodot',
        "\u2A01": 'xoplus',
        "\u2A02": 'xotime',
        "\u2A04": 'xuplus',
        "\u2A06": 'xsqcup',
        "\u2A0D": 'fpartint',
        "\u2A10": 'cirfnint',
        "\u2A11": 'awint',
        "\u2A12": 'rppolint',
        "\u2A13": 'scpolint',
        "\u2A14": 'npolint',
        "\u2A15": 'pointint',
        "\u2A16": 'quatint',
        "\u2A17": 'intlarhk',
        "\u2A22": 'pluscir',
        "\u2A23": 'plusacir',
        "\u2A24": 'simplus',
        "\u2A25": 'plusdu',
        "\u2A26": 'plussim',
        "\u2A27": 'plustwo',
        "\u2A29": 'mcomma',
        "\u2A2A": 'minusdu',
        "\u2A2D": 'loplus',
        "\u2A2E": 'roplus',
        "\u2A2F": 'Cross',
        "\u2A30": 'timesd',
        "\u2A31": 'timesbar',
        "\u2A33": 'smashp',
        "\u2A34": 'lotimes',
        "\u2A35": 'rotimes',
        "\u2A36": 'otimesas',
        "\u2A37": 'Otimes',
        "\u2A38": 'odiv',
        "\u2A39": 'triplus',
        "\u2A3A": 'triminus',
        "\u2A3B": 'tritime',
        "\u2A3C": 'iprod',
        "\u2A3F": 'amalg',
        "\u2A40": 'capdot',
        "\u2A42": 'ncup',
        "\u2A43": 'ncap',
        "\u2A44": 'capand',
        "\u2A45": 'cupor',
        "\u2A46": 'cupcap',
        "\u2A47": 'capcup',
        "\u2A48": 'cupbrcap',
        "\u2A49": 'capbrcup',
        "\u2A4A": 'cupcup',
        "\u2A4B": 'capcap',
        "\u2A4C": 'ccups',
        "\u2A4D": 'ccaps',
        "\u2A50": 'ccupssm',
        "\u2A53": 'And',
        "\u2A54": 'Or',
        "\u2A55": 'andand',
        "\u2A56": 'oror',
        "\u2A57": 'orslope',
        "\u2A58": 'andslope',
        "\u2A5A": 'andv',
        "\u2A5B": 'orv',
        "\u2A5C": 'andd',
        "\u2A5D": 'ord',
        "\u2A5F": 'wedbar',
        "\u2A66": 'sdote',
        "\u2A6A": 'simdot',
        "\u2A6D": 'congdot',
        "\u2A6D\u0338": 'ncongdot',
        "\u2A6E": 'easter',
        "\u2A6F": 'apacir',
        "\u2A70": 'apE',
        "\u2A70\u0338": 'napE',
        "\u2A71": 'eplus',
        "\u2A72": 'pluse',
        "\u2A73": 'Esim',
        "\u2A77": 'eDDot',
        "\u2A78": 'equivDD',
        "\u2A79": 'ltcir',
        "\u2A7A": 'gtcir',
        "\u2A7B": 'ltquest',
        "\u2A7C": 'gtquest',
        "\u2A7D": 'les',
        "\u2A7D\u0338": 'nles',
        "\u2A7E": 'ges',
        "\u2A7E\u0338": 'nges',
        "\u2A7F": 'lesdot',
        "\u2A80": 'gesdot',
        "\u2A81": 'lesdoto',
        "\u2A82": 'gesdoto',
        "\u2A83": 'lesdotor',
        "\u2A84": 'gesdotol',
        "\u2A85": 'lap',
        "\u2A86": 'gap',
        "\u2A87": 'lne',
        "\u2A88": 'gne',
        "\u2A89": 'lnap',
        "\u2A8A": 'gnap',
        "\u2A8B": 'lEg',
        "\u2A8C": 'gEl',
        "\u2A8D": 'lsime',
        "\u2A8E": 'gsime',
        "\u2A8F": 'lsimg',
        "\u2A90": 'gsiml',
        "\u2A91": 'lgE',
        "\u2A92": 'glE',
        "\u2A93": 'lesges',
        "\u2A94": 'gesles',
        "\u2A95": 'els',
        "\u2A96": 'egs',
        "\u2A97": 'elsdot',
        "\u2A98": 'egsdot',
        "\u2A99": 'el',
        "\u2A9A": 'eg',
        "\u2A9D": 'siml',
        "\u2A9E": 'simg',
        "\u2A9F": 'simlE',
        "\u2AA0": 'simgE',
        "\u2AA1": 'LessLess',
        "\u2AA1\u0338": 'NotNestedLessLess',
        "\u2AA2": 'GreaterGreater',
        "\u2AA2\u0338": 'NotNestedGreaterGreater',
        "\u2AA4": 'glj',
        "\u2AA5": 'gla',
        "\u2AA6": 'ltcc',
        "\u2AA7": 'gtcc',
        "\u2AA8": 'lescc',
        "\u2AA9": 'gescc',
        "\u2AAA": 'smt',
        "\u2AAB": 'lat',
        "\u2AAC": 'smte',
        "\u2AAC\uFE00": 'smtes',
        "\u2AAD": 'late',
        "\u2AAD\uFE00": 'lates',
        "\u2AAE": 'bumpE',
        "\u2AAF": 'pre',
        "\u2AAF\u0338": 'npre',
        "\u2AB0": 'sce',
        "\u2AB0\u0338": 'nsce',
        "\u2AB3": 'prE',
        "\u2AB4": 'scE',
        "\u2AB5": 'prnE',
        "\u2AB6": 'scnE',
        "\u2AB7": 'prap',
        "\u2AB8": 'scap',
        "\u2AB9": 'prnap',
        "\u2ABA": 'scnap',
        "\u2ABB": 'Pr',
        "\u2ABC": 'Sc',
        "\u2ABD": 'subdot',
        "\u2ABE": 'supdot',
        "\u2ABF": 'subplus',
        "\u2AC0": 'supplus',
        "\u2AC1": 'submult',
        "\u2AC2": 'supmult',
        "\u2AC3": 'subedot',
        "\u2AC4": 'supedot',
        "\u2AC5": 'subE',
        "\u2AC5\u0338": 'nsubE',
        "\u2AC6": 'supE',
        "\u2AC6\u0338": 'nsupE',
        "\u2AC7": 'subsim',
        "\u2AC8": 'supsim',
        "\u2ACB\uFE00": 'vsubnE',
        "\u2ACB": 'subnE',
        "\u2ACC\uFE00": 'vsupnE',
        "\u2ACC": 'supnE',
        "\u2ACF": 'csub',
        "\u2AD0": 'csup',
        "\u2AD1": 'csube',
        "\u2AD2": 'csupe',
        "\u2AD3": 'subsup',
        "\u2AD4": 'supsub',
        "\u2AD5": 'subsub',
        "\u2AD6": 'supsup',
        "\u2AD7": 'suphsub',
        "\u2AD8": 'supdsub',
        "\u2AD9": 'forkv',
        "\u2ADA": 'topfork',
        "\u2ADB": 'mlcp',
        "\u2AE4": 'Dashv',
        "\u2AE6": 'Vdashl',
        "\u2AE7": 'Barv',
        "\u2AE8": 'vBar',
        "\u2AE9": 'vBarv',
        "\u2AEB": 'Vbar',
        "\u2AEC": 'Not',
        "\u2AED": 'bNot',
        "\u2AEE": 'rnmid',
        "\u2AEF": 'cirmid',
        "\u2AF0": 'midcir',
        "\u2AF1": 'topcir',
        "\u2AF2": 'nhpar',
        "\u2AF3": 'parsim',
        "\u2AFD": 'parsl',
        "\u2AFD\u20E5": 'nparsl',
        "\u266D": 'flat',
        "\u266E": 'natur',
        "\u266F": 'sharp',
        '\xA4': 'curren',
        '\xA2': 'cent',
        '$': 'dollar',
        '\xA3': 'pound',
        '\xA5': 'yen',
        "\u20AC": 'euro',
        '\xB9': 'sup1',
        '\xBD': 'half',
        "\u2153": 'frac13',
        '\xBC': 'frac14',
        "\u2155": 'frac15',
        "\u2159": 'frac16',
        "\u215B": 'frac18',
        '\xB2': 'sup2',
        "\u2154": 'frac23',
        "\u2156": 'frac25',
        '\xB3': 'sup3',
        '\xBE': 'frac34',
        "\u2157": 'frac35',
        "\u215C": 'frac38',
        "\u2158": 'frac45',
        "\u215A": 'frac56',
        "\u215D": 'frac58',
        "\u215E": 'frac78',
        "\uD835\uDCB6": 'ascr',
        "\uD835\uDD52": 'aopf',
        "\uD835\uDD1E": 'afr',
        "\uD835\uDD38": 'Aopf',
        "\uD835\uDD04": 'Afr',
        "\uD835\uDC9C": 'Ascr',
        '\xAA': 'ordf',
        '\xE1': 'aacute',
        '\xC1': 'Aacute',
        '\xE0': 'agrave',
        '\xC0': 'Agrave',
        "\u0103": 'abreve',
        "\u0102": 'Abreve',
        '\xE2': 'acirc',
        '\xC2': 'Acirc',
        '\xE5': 'aring',
        '\xC5': 'angst',
        '\xE4': 'auml',
        '\xC4': 'Auml',
        '\xE3': 'atilde',
        '\xC3': 'Atilde',
        "\u0105": 'aogon',
        "\u0104": 'Aogon',
        "\u0101": 'amacr',
        "\u0100": 'Amacr',
        '\xE6': 'aelig',
        '\xC6': 'AElig',
        "\uD835\uDCB7": 'bscr',
        "\uD835\uDD53": 'bopf',
        "\uD835\uDD1F": 'bfr',
        "\uD835\uDD39": 'Bopf',
        "\u212C": 'Bscr',
        "\uD835\uDD05": 'Bfr',
        "\uD835\uDD20": 'cfr',
        "\uD835\uDCB8": 'cscr',
        "\uD835\uDD54": 'copf',
        "\u212D": 'Cfr',
        "\uD835\uDC9E": 'Cscr',
        "\u2102": 'Copf',
        "\u0107": 'cacute',
        "\u0106": 'Cacute',
        "\u0109": 'ccirc',
        "\u0108": 'Ccirc',
        "\u010D": 'ccaron',
        "\u010C": 'Ccaron',
        "\u010B": 'cdot',
        "\u010A": 'Cdot',
        '\xE7': 'ccedil',
        '\xC7': 'Ccedil',
        "\u2105": 'incare',
        "\uD835\uDD21": 'dfr',
        "\u2146": 'dd',
        "\uD835\uDD55": 'dopf',
        "\uD835\uDCB9": 'dscr',
        "\uD835\uDC9F": 'Dscr',
        "\uD835\uDD07": 'Dfr',
        "\u2145": 'DD',
        "\uD835\uDD3B": 'Dopf',
        "\u010F": 'dcaron',
        "\u010E": 'Dcaron',
        "\u0111": 'dstrok',
        "\u0110": 'Dstrok',
        '\xF0': 'eth',
        '\xD0': 'ETH',
        "\u2147": 'ee',
        "\u212F": 'escr',
        "\uD835\uDD22": 'efr',
        "\uD835\uDD56": 'eopf',
        "\u2130": 'Escr',
        "\uD835\uDD08": 'Efr',
        "\uD835\uDD3C": 'Eopf',
        '\xE9': 'eacute',
        '\xC9': 'Eacute',
        '\xE8': 'egrave',
        '\xC8': 'Egrave',
        '\xEA': 'ecirc',
        '\xCA': 'Ecirc',
        "\u011B": 'ecaron',
        "\u011A": 'Ecaron',
        '\xEB': 'euml',
        '\xCB': 'Euml',
        "\u0117": 'edot',
        "\u0116": 'Edot',
        "\u0119": 'eogon',
        "\u0118": 'Eogon',
        "\u0113": 'emacr',
        "\u0112": 'Emacr',
        "\uD835\uDD23": 'ffr',
        "\uD835\uDD57": 'fopf',
        "\uD835\uDCBB": 'fscr',
        "\uD835\uDD09": 'Ffr',
        "\uD835\uDD3D": 'Fopf',
        "\u2131": 'Fscr',
        "\uFB00": 'fflig',
        "\uFB03": 'ffilig',
        "\uFB04": 'ffllig',
        "\uFB01": 'filig',
        'fj': 'fjlig',
        "\uFB02": 'fllig',
        "\u0192": 'fnof',
        "\u210A": 'gscr',
        "\uD835\uDD58": 'gopf',
        "\uD835\uDD24": 'gfr',
        "\uD835\uDCA2": 'Gscr',
        "\uD835\uDD3E": 'Gopf',
        "\uD835\uDD0A": 'Gfr',
        "\u01F5": 'gacute',
        "\u011F": 'gbreve',
        "\u011E": 'Gbreve',
        "\u011D": 'gcirc',
        "\u011C": 'Gcirc',
        "\u0121": 'gdot',
        "\u0120": 'Gdot',
        "\u0122": 'Gcedil',
        "\uD835\uDD25": 'hfr',
        "\u210E": 'planckh',
        "\uD835\uDCBD": 'hscr',
        "\uD835\uDD59": 'hopf',
        "\u210B": 'Hscr',
        "\u210C": 'Hfr',
        "\u210D": 'Hopf',
        "\u0125": 'hcirc',
        "\u0124": 'Hcirc',
        "\u210F": 'hbar',
        "\u0127": 'hstrok',
        "\u0126": 'Hstrok',
        "\uD835\uDD5A": 'iopf',
        "\uD835\uDD26": 'ifr',
        "\uD835\uDCBE": 'iscr',
        "\u2148": 'ii',
        "\uD835\uDD40": 'Iopf',
        "\u2110": 'Iscr',
        "\u2111": 'Im',
        '\xED': 'iacute',
        '\xCD': 'Iacute',
        '\xEC': 'igrave',
        '\xCC': 'Igrave',
        '\xEE': 'icirc',
        '\xCE': 'Icirc',
        '\xEF': 'iuml',
        '\xCF': 'Iuml',
        "\u0129": 'itilde',
        "\u0128": 'Itilde',
        "\u0130": 'Idot',
        "\u012F": 'iogon',
        "\u012E": 'Iogon',
        "\u012B": 'imacr',
        "\u012A": 'Imacr',
        "\u0133": 'ijlig',
        "\u0132": 'IJlig',
        "\u0131": 'imath',
        "\uD835\uDCBF": 'jscr',
        "\uD835\uDD5B": 'jopf',
        "\uD835\uDD27": 'jfr',
        "\uD835\uDCA5": 'Jscr',
        "\uD835\uDD0D": 'Jfr',
        "\uD835\uDD41": 'Jopf',
        "\u0135": 'jcirc',
        "\u0134": 'Jcirc',
        "\u0237": 'jmath',
        "\uD835\uDD5C": 'kopf',
        "\uD835\uDCC0": 'kscr',
        "\uD835\uDD28": 'kfr',
        "\uD835\uDCA6": 'Kscr',
        "\uD835\uDD42": 'Kopf',
        "\uD835\uDD0E": 'Kfr',
        "\u0137": 'kcedil',
        "\u0136": 'Kcedil',
        "\uD835\uDD29": 'lfr',
        "\uD835\uDCC1": 'lscr',
        "\u2113": 'ell',
        "\uD835\uDD5D": 'lopf',
        "\u2112": 'Lscr',
        "\uD835\uDD0F": 'Lfr',
        "\uD835\uDD43": 'Lopf',
        "\u013A": 'lacute',
        "\u0139": 'Lacute',
        "\u013E": 'lcaron',
        "\u013D": 'Lcaron',
        "\u013C": 'lcedil',
        "\u013B": 'Lcedil',
        "\u0142": 'lstrok',
        "\u0141": 'Lstrok',
        "\u0140": 'lmidot',
        "\u013F": 'Lmidot',
        "\uD835\uDD2A": 'mfr',
        "\uD835\uDD5E": 'mopf',
        "\uD835\uDCC2": 'mscr',
        "\uD835\uDD10": 'Mfr',
        "\uD835\uDD44": 'Mopf',
        "\u2133": 'Mscr',
        "\uD835\uDD2B": 'nfr',
        "\uD835\uDD5F": 'nopf',
        "\uD835\uDCC3": 'nscr',
        "\u2115": 'Nopf',
        "\uD835\uDCA9": 'Nscr',
        "\uD835\uDD11": 'Nfr',
        "\u0144": 'nacute',
        "\u0143": 'Nacute',
        "\u0148": 'ncaron',
        "\u0147": 'Ncaron',
        '\xF1': 'ntilde',
        '\xD1': 'Ntilde',
        "\u0146": 'ncedil',
        "\u0145": 'Ncedil',
        "\u2116": 'numero',
        "\u014B": 'eng',
        "\u014A": 'ENG',
        "\uD835\uDD60": 'oopf',
        "\uD835\uDD2C": 'ofr',
        "\u2134": 'oscr',
        "\uD835\uDCAA": 'Oscr',
        "\uD835\uDD12": 'Ofr',
        "\uD835\uDD46": 'Oopf',
        '\xBA': 'ordm',
        '\xF3': 'oacute',
        '\xD3': 'Oacute',
        '\xF2': 'ograve',
        '\xD2': 'Ograve',
        '\xF4': 'ocirc',
        '\xD4': 'Ocirc',
        '\xF6': 'ouml',
        '\xD6': 'Ouml',
        "\u0151": 'odblac',
        "\u0150": 'Odblac',
        '\xF5': 'otilde',
        '\xD5': 'Otilde',
        '\xF8': 'oslash',
        '\xD8': 'Oslash',
        "\u014D": 'omacr',
        "\u014C": 'Omacr',
        "\u0153": 'oelig',
        "\u0152": 'OElig',
        "\uD835\uDD2D": 'pfr',
        "\uD835\uDCC5": 'pscr',
        "\uD835\uDD61": 'popf',
        "\u2119": 'Popf',
        "\uD835\uDD13": 'Pfr',
        "\uD835\uDCAB": 'Pscr',
        "\uD835\uDD62": 'qopf',
        "\uD835\uDD2E": 'qfr',
        "\uD835\uDCC6": 'qscr',
        "\uD835\uDCAC": 'Qscr',
        "\uD835\uDD14": 'Qfr',
        "\u211A": 'Qopf',
        "\u0138": 'kgreen',
        "\uD835\uDD2F": 'rfr',
        "\uD835\uDD63": 'ropf',
        "\uD835\uDCC7": 'rscr',
        "\u211B": 'Rscr',
        "\u211C": 'Re',
        "\u211D": 'Ropf',
        "\u0155": 'racute',
        "\u0154": 'Racute',
        "\u0159": 'rcaron',
        "\u0158": 'Rcaron',
        "\u0157": 'rcedil',
        "\u0156": 'Rcedil',
        "\uD835\uDD64": 'sopf',
        "\uD835\uDCC8": 'sscr',
        "\uD835\uDD30": 'sfr',
        "\uD835\uDD4A": 'Sopf',
        "\uD835\uDD16": 'Sfr',
        "\uD835\uDCAE": 'Sscr',
        "\u24C8": 'oS',
        "\u015B": 'sacute',
        "\u015A": 'Sacute',
        "\u015D": 'scirc',
        "\u015C": 'Scirc',
        "\u0161": 'scaron',
        "\u0160": 'Scaron',
        "\u015F": 'scedil',
        "\u015E": 'Scedil',
        '\xDF': 'szlig',
        "\uD835\uDD31": 'tfr',
        "\uD835\uDCC9": 'tscr',
        "\uD835\uDD65": 'topf',
        "\uD835\uDCAF": 'Tscr',
        "\uD835\uDD17": 'Tfr',
        "\uD835\uDD4B": 'Topf',
        "\u0165": 'tcaron',
        "\u0164": 'Tcaron',
        "\u0163": 'tcedil',
        "\u0162": 'Tcedil',
        "\u2122": 'trade',
        "\u0167": 'tstrok',
        "\u0166": 'Tstrok',
        "\uD835\uDCCA": 'uscr',
        "\uD835\uDD66": 'uopf',
        "\uD835\uDD32": 'ufr',
        "\uD835\uDD4C": 'Uopf',
        "\uD835\uDD18": 'Ufr',
        "\uD835\uDCB0": 'Uscr',
        '\xFA': 'uacute',
        '\xDA': 'Uacute',
        '\xF9': 'ugrave',
        '\xD9': 'Ugrave',
        "\u016D": 'ubreve',
        "\u016C": 'Ubreve',
        '\xFB': 'ucirc',
        '\xDB': 'Ucirc',
        "\u016F": 'uring',
        "\u016E": 'Uring',
        '\xFC': 'uuml',
        '\xDC': 'Uuml',
        "\u0171": 'udblac',
        "\u0170": 'Udblac',
        "\u0169": 'utilde',
        "\u0168": 'Utilde',
        "\u0173": 'uogon',
        "\u0172": 'Uogon',
        "\u016B": 'umacr',
        "\u016A": 'Umacr',
        "\uD835\uDD33": 'vfr',
        "\uD835\uDD67": 'vopf',
        "\uD835\uDCCB": 'vscr',
        "\uD835\uDD19": 'Vfr',
        "\uD835\uDD4D": 'Vopf',
        "\uD835\uDCB1": 'Vscr',
        "\uD835\uDD68": 'wopf',
        "\uD835\uDCCC": 'wscr',
        "\uD835\uDD34": 'wfr',
        "\uD835\uDCB2": 'Wscr',
        "\uD835\uDD4E": 'Wopf',
        "\uD835\uDD1A": 'Wfr',
        "\u0175": 'wcirc',
        "\u0174": 'Wcirc',
        "\uD835\uDD35": 'xfr',
        "\uD835\uDCCD": 'xscr',
        "\uD835\uDD69": 'xopf',
        "\uD835\uDD4F": 'Xopf',
        "\uD835\uDD1B": 'Xfr',
        "\uD835\uDCB3": 'Xscr',
        "\uD835\uDD36": 'yfr',
        "\uD835\uDCCE": 'yscr',
        "\uD835\uDD6A": 'yopf',
        "\uD835\uDCB4": 'Yscr',
        "\uD835\uDD1C": 'Yfr',
        "\uD835\uDD50": 'Yopf',
        '\xFD': 'yacute',
        '\xDD': 'Yacute',
        "\u0177": 'ycirc',
        "\u0176": 'Ycirc',
        '\xFF': 'yuml',
        "\u0178": 'Yuml',
        "\uD835\uDCCF": 'zscr',
        "\uD835\uDD37": 'zfr',
        "\uD835\uDD6B": 'zopf',
        "\u2128": 'Zfr',
        "\u2124": 'Zopf',
        "\uD835\uDCB5": 'Zscr',
        "\u017A": 'zacute',
        "\u0179": 'Zacute',
        "\u017E": 'zcaron',
        "\u017D": 'Zcaron',
        "\u017C": 'zdot',
        "\u017B": 'Zdot',
        "\u01B5": 'imped',
        '\xFE': 'thorn',
        '\xDE': 'THORN',
        "\u0149": 'napos',
        "\u03B1": 'alpha',
        "\u0391": 'Alpha',
        "\u03B2": 'beta',
        "\u0392": 'Beta',
        "\u03B3": 'gamma',
        "\u0393": 'Gamma',
        "\u03B4": 'delta',
        "\u0394": 'Delta',
        "\u03B5": 'epsi',
        "\u03F5": 'epsiv',
        "\u0395": 'Epsilon',
        "\u03DD": 'gammad',
        "\u03DC": 'Gammad',
        "\u03B6": 'zeta',
        "\u0396": 'Zeta',
        "\u03B7": 'eta',
        "\u0397": 'Eta',
        "\u03B8": 'theta',
        "\u03D1": 'thetav',
        "\u0398": 'Theta',
        "\u03B9": 'iota',
        "\u0399": 'Iota',
        "\u03BA": 'kappa',
        "\u03F0": 'kappav',
        "\u039A": 'Kappa',
        "\u03BB": 'lambda',
        "\u039B": 'Lambda',
        "\u03BC": 'mu',
        '\xB5': 'micro',
        "\u039C": 'Mu',
        "\u03BD": 'nu',
        "\u039D": 'Nu',
        "\u03BE": 'xi',
        "\u039E": 'Xi',
        "\u03BF": 'omicron',
        "\u039F": 'Omicron',
        "\u03C0": 'pi',
        "\u03D6": 'piv',
        "\u03A0": 'Pi',
        "\u03C1": 'rho',
        "\u03F1": 'rhov',
        "\u03A1": 'Rho',
        "\u03C3": 'sigma',
        "\u03A3": 'Sigma',
        "\u03C2": 'sigmaf',
        "\u03C4": 'tau',
        "\u03A4": 'Tau',
        "\u03C5": 'upsi',
        "\u03A5": 'Upsilon',
        "\u03D2": 'Upsi',
        "\u03C6": 'phi',
        "\u03D5": 'phiv',
        "\u03A6": 'Phi',
        "\u03C7": 'chi',
        "\u03A7": 'Chi',
        "\u03C8": 'psi',
        "\u03A8": 'Psi',
        "\u03C9": 'omega',
        "\u03A9": 'ohm',
        "\u0430": 'acy',
        "\u0410": 'Acy',
        "\u0431": 'bcy',
        "\u0411": 'Bcy',
        "\u0432": 'vcy',
        "\u0412": 'Vcy',
        "\u0433": 'gcy',
        "\u0413": 'Gcy',
        "\u0453": 'gjcy',
        "\u0403": 'GJcy',
        "\u0434": 'dcy',
        "\u0414": 'Dcy',
        "\u0452": 'djcy',
        "\u0402": 'DJcy',
        "\u0435": 'iecy',
        "\u0415": 'IEcy',
        "\u0451": 'iocy',
        "\u0401": 'IOcy',
        "\u0454": 'jukcy',
        "\u0404": 'Jukcy',
        "\u0436": 'zhcy',
        "\u0416": 'ZHcy',
        "\u0437": 'zcy',
        "\u0417": 'Zcy',
        "\u0455": 'dscy',
        "\u0405": 'DScy',
        "\u0438": 'icy',
        "\u0418": 'Icy',
        "\u0456": 'iukcy',
        "\u0406": 'Iukcy',
        "\u0457": 'yicy',
        "\u0407": 'YIcy',
        "\u0439": 'jcy',
        "\u0419": 'Jcy',
        "\u0458": 'jsercy',
        "\u0408": 'Jsercy',
        "\u043A": 'kcy',
        "\u041A": 'Kcy',
        "\u045C": 'kjcy',
        "\u040C": 'KJcy',
        "\u043B": 'lcy',
        "\u041B": 'Lcy',
        "\u0459": 'ljcy',
        "\u0409": 'LJcy',
        "\u043C": 'mcy',
        "\u041C": 'Mcy',
        "\u043D": 'ncy',
        "\u041D": 'Ncy',
        "\u045A": 'njcy',
        "\u040A": 'NJcy',
        "\u043E": 'ocy',
        "\u041E": 'Ocy',
        "\u043F": 'pcy',
        "\u041F": 'Pcy',
        "\u0440": 'rcy',
        "\u0420": 'Rcy',
        "\u0441": 'scy',
        "\u0421": 'Scy',
        "\u0442": 'tcy',
        "\u0422": 'Tcy',
        "\u045B": 'tshcy',
        "\u040B": 'TSHcy',
        "\u0443": 'ucy',
        "\u0423": 'Ucy',
        "\u045E": 'ubrcy',
        "\u040E": 'Ubrcy',
        "\u0444": 'fcy',
        "\u0424": 'Fcy',
        "\u0445": 'khcy',
        "\u0425": 'KHcy',
        "\u0446": 'tscy',
        "\u0426": 'TScy',
        "\u0447": 'chcy',
        "\u0427": 'CHcy',
        "\u045F": 'dzcy',
        "\u040F": 'DZcy',
        "\u0448": 'shcy',
        "\u0428": 'SHcy',
        "\u0449": 'shchcy',
        "\u0429": 'SHCHcy',
        "\u044A": 'hardcy',
        "\u042A": 'HARDcy',
        "\u044B": 'ycy',
        "\u042B": 'Ycy',
        "\u044C": 'softcy',
        "\u042C": 'SOFTcy',
        "\u044D": 'ecy',
        "\u042D": 'Ecy',
        "\u044E": 'yucy',
        "\u042E": 'YUcy',
        "\u044F": 'yacy',
        "\u042F": 'YAcy',
        "\u2135": 'aleph',
        "\u2136": 'beth',
        "\u2137": 'gimel',
        "\u2138": 'daleth'
      };
      var regexEscape = /["&'<>`]/g;
      var escapeMap = {
        '"': '&quot;',
        '&': '&amp;',
        '\'': '&#x27;',
        '<': '&lt;',
        // See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
        // following is not strictly necessary unless it’s part of a tag or an
        // unquoted attribute value. We’re only escaping it to support those
        // situations, and for XML support.
        '>': '&gt;',
        // In Internet Explorer ≤ 8, the backtick character can be used
        // to break out of (un)quoted attribute values or HTML comments.
        // See http://html5sec.org/#102, http://html5sec.org/#108, and
        // http://html5sec.org/#133.
        '`': '&#x60;'
      };
      var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
      var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      var regexDecode = /&(CounterClockwiseContourIntegral|DoubleLongLeftRightArrow|ClockwiseContourIntegral|NotNestedGreaterGreater|NotSquareSupersetEqual|DiacriticalDoubleAcute|NotRightTriangleEqual|NotSucceedsSlantEqual|NotPrecedesSlantEqual|CloseCurlyDoubleQuote|NegativeVeryThinSpace|DoubleContourIntegral|FilledVerySmallSquare|CapitalDifferentialD|OpenCurlyDoubleQuote|EmptyVerySmallSquare|NestedGreaterGreater|DoubleLongRightArrow|NotLeftTriangleEqual|NotGreaterSlantEqual|ReverseUpEquilibrium|DoubleLeftRightArrow|NotSquareSubsetEqual|NotDoubleVerticalBar|RightArrowLeftArrow|NotGreaterFullEqual|NotRightTriangleBar|SquareSupersetEqual|DownLeftRightVector|DoubleLongLeftArrow|leftrightsquigarrow|LeftArrowRightArrow|NegativeMediumSpace|blacktriangleright|RightDownVectorBar|PrecedesSlantEqual|RightDoubleBracket|SucceedsSlantEqual|NotLeftTriangleBar|RightTriangleEqual|SquareIntersection|RightDownTeeVector|ReverseEquilibrium|NegativeThickSpace|longleftrightarrow|Longleftrightarrow|LongLeftRightArrow|DownRightTeeVector|DownRightVectorBar|GreaterSlantEqual|SquareSubsetEqual|LeftDownVectorBar|LeftDoubleBracket|VerticalSeparator|rightleftharpoons|NotGreaterGreater|NotSquareSuperset|blacktriangleleft|blacktriangledown|NegativeThinSpace|LeftDownTeeVector|NotLessSlantEqual|leftrightharpoons|DoubleUpDownArrow|DoubleVerticalBar|LeftTriangleEqual|FilledSmallSquare|twoheadrightarrow|NotNestedLessLess|DownLeftTeeVector|DownLeftVectorBar|RightAngleBracket|NotTildeFullEqual|NotReverseElement|RightUpDownVector|DiacriticalTilde|NotSucceedsTilde|circlearrowright|NotPrecedesEqual|rightharpoondown|DoubleRightArrow|NotSucceedsEqual|NonBreakingSpace|NotRightTriangle|LessEqualGreater|RightUpTeeVector|LeftAngleBracket|GreaterFullEqual|DownArrowUpArrow|RightUpVectorBar|twoheadleftarrow|GreaterEqualLess|downharpoonright|RightTriangleBar|ntrianglerighteq|NotSupersetEqual|LeftUpDownVector|DiacriticalAcute|rightrightarrows|vartriangleright|UpArrowDownArrow|DiacriticalGrave|UnderParenthesis|EmptySmallSquare|LeftUpVectorBar|leftrightarrows|DownRightVector|downharpoonleft|trianglerighteq|ShortRightArrow|OverParenthesis|DoubleLeftArrow|DoubleDownArrow|NotSquareSubset|bigtriangledown|ntrianglelefteq|UpperRightArrow|curvearrowright|vartriangleleft|NotLeftTriangle|nleftrightarrow|LowerRightArrow|NotHumpDownHump|NotGreaterTilde|rightthreetimes|LeftUpTeeVector|NotGreaterEqual|straightepsilon|LeftTriangleBar|rightsquigarrow|ContourIntegral|rightleftarrows|CloseCurlyQuote|RightDownVector|LeftRightVector|nLeftrightarrow|leftharpoondown|circlearrowleft|SquareSuperset|OpenCurlyQuote|hookrightarrow|HorizontalLine|DiacriticalDot|NotLessGreater|ntriangleright|DoubleRightTee|InvisibleComma|InvisibleTimes|LowerLeftArrow|DownLeftVector|NotSubsetEqual|curvearrowleft|trianglelefteq|NotVerticalBar|TildeFullEqual|downdownarrows|NotGreaterLess|RightTeeVector|ZeroWidthSpace|looparrowright|LongRightArrow|doublebarwedge|ShortLeftArrow|ShortDownArrow|RightVectorBar|GreaterGreater|ReverseElement|rightharpoonup|LessSlantEqual|leftthreetimes|upharpoonright|rightarrowtail|LeftDownVector|Longrightarrow|NestedLessLess|UpperLeftArrow|nshortparallel|leftleftarrows|leftrightarrow|Leftrightarrow|LeftRightArrow|longrightarrow|upharpoonleft|RightArrowBar|ApplyFunction|LeftTeeVector|leftarrowtail|NotEqualTilde|varsubsetneqq|varsupsetneqq|RightTeeArrow|SucceedsEqual|SucceedsTilde|LeftVectorBar|SupersetEqual|hookleftarrow|DifferentialD|VerticalTilde|VeryThinSpace|blacktriangle|bigtriangleup|LessFullEqual|divideontimes|leftharpoonup|UpEquilibrium|ntriangleleft|RightTriangle|measuredangle|shortparallel|longleftarrow|Longleftarrow|LongLeftArrow|DoubleLeftTee|Poincareplane|PrecedesEqual|triangleright|DoubleUpArrow|RightUpVector|fallingdotseq|looparrowleft|PrecedesTilde|NotTildeEqual|NotTildeTilde|smallsetminus|Proportional|triangleleft|triangledown|UnderBracket|NotHumpEqual|exponentiale|ExponentialE|NotLessTilde|HilbertSpace|RightCeiling|blacklozenge|varsupsetneq|HumpDownHump|GreaterEqual|VerticalLine|LeftTeeArrow|NotLessEqual|DownTeeArrow|LeftTriangle|varsubsetneq|Intersection|NotCongruent|DownArrowBar|LeftUpVector|LeftArrowBar|risingdotseq|GreaterTilde|RoundImplies|SquareSubset|ShortUpArrow|NotSuperset|quaternions|precnapprox|backepsilon|preccurlyeq|OverBracket|blacksquare|MediumSpace|VerticalBar|circledcirc|circleddash|CircleMinus|CircleTimes|LessGreater|curlyeqprec|curlyeqsucc|diamondsuit|UpDownArrow|Updownarrow|RuleDelayed|Rrightarrow|updownarrow|RightVector|nRightarrow|nrightarrow|eqslantless|LeftCeiling|Equilibrium|SmallCircle|expectation|NotSucceeds|thickapprox|GreaterLess|SquareUnion|NotPrecedes|NotLessLess|straightphi|succnapprox|succcurlyeq|SubsetEqual|sqsupseteq|Proportion|Laplacetrf|ImaginaryI|supsetneqq|NotGreater|gtreqqless|NotElement|ThickSpace|TildeEqual|TildeTilde|Fouriertrf|rmoustache|EqualTilde|eqslantgtr|UnderBrace|LeftVector|UpArrowBar|nLeftarrow|nsubseteqq|subsetneqq|nsupseteqq|nleftarrow|succapprox|lessapprox|UpTeeArrow|upuparrows|curlywedge|lesseqqgtr|varepsilon|varnothing|RightFloor|complement|CirclePlus|sqsubseteq|Lleftarrow|circledast|RightArrow|Rightarrow|rightarrow|lmoustache|Bernoullis|precapprox|mapstoleft|mapstodown|longmapsto|dotsquare|downarrow|DoubleDot|nsubseteq|supsetneq|leftarrow|nsupseteq|subsetneq|ThinSpace|ngeqslant|subseteqq|HumpEqual|NotSubset|triangleq|NotCupCap|lesseqgtr|heartsuit|TripleDot|Leftarrow|Coproduct|Congruent|varpropto|complexes|gvertneqq|LeftArrow|LessTilde|supseteqq|MinusPlus|CircleDot|nleqslant|NotExists|gtreqless|nparallel|UnionPlus|LeftFloor|checkmark|CenterDot|centerdot|Mellintrf|gtrapprox|bigotimes|OverBrace|spadesuit|therefore|pitchfork|rationals|PlusMinus|Backslash|Therefore|DownBreve|backsimeq|backprime|DownArrow|nshortmid|Downarrow|lvertneqq|eqvparsl|imagline|imagpart|infintie|integers|Integral|intercal|LessLess|Uarrocir|intlarhk|sqsupset|angmsdaf|sqsubset|llcorner|vartheta|cupbrcap|lnapprox|Superset|SuchThat|succnsim|succneqq|angmsdag|biguplus|curlyvee|trpezium|Succeeds|NotTilde|bigwedge|angmsdah|angrtvbd|triminus|cwconint|fpartint|lrcorner|smeparsl|subseteq|urcorner|lurdshar|laemptyv|DDotrahd|approxeq|ldrushar|awconint|mapstoup|backcong|shortmid|triangle|geqslant|gesdotol|timesbar|circledR|circledS|setminus|multimap|naturals|scpolint|ncongdot|RightTee|boxminus|gnapprox|boxtimes|andslope|thicksim|angmsdaa|varsigma|cirfnint|rtriltri|angmsdab|rppolint|angmsdac|barwedge|drbkarow|clubsuit|thetasym|bsolhsub|capbrcup|dzigrarr|doteqdot|DotEqual|dotminus|UnderBar|NotEqual|realpart|otimesas|ulcorner|hksearow|hkswarow|parallel|PartialD|elinters|emptyset|plusacir|bbrktbrk|angmsdad|pointint|bigoplus|angmsdae|Precedes|bigsqcup|varkappa|notindot|supseteq|precneqq|precnsim|profalar|profline|profsurf|leqslant|lesdotor|raemptyv|subplus|notnivb|notnivc|subrarr|zigrarr|vzigzag|submult|subedot|Element|between|cirscir|larrbfs|larrsim|lotimes|lbrksld|lbrkslu|lozenge|ldrdhar|dbkarow|bigcirc|epsilon|simrarr|simplus|ltquest|Epsilon|luruhar|gtquest|maltese|npolint|eqcolon|npreceq|bigodot|ddagger|gtrless|bnequiv|harrcir|ddotseq|equivDD|backsim|demptyv|nsqsube|nsqsupe|Upsilon|nsubset|upsilon|minusdu|nsucceq|swarrow|nsupset|coloneq|searrow|boxplus|napprox|natural|asympeq|alefsym|congdot|nearrow|bigstar|diamond|supplus|tritime|LeftTee|nvinfin|triplus|NewLine|nvltrie|nvrtrie|nwarrow|nexists|Diamond|ruluhar|Implies|supmult|angzarr|suplarr|suphsub|questeq|because|digamma|Because|olcross|bemptyv|omicron|Omicron|rotimes|NoBreak|intprod|angrtvb|orderof|uwangle|suphsol|lesdoto|orslope|DownTee|realine|cudarrl|rdldhar|OverBar|supedot|lessdot|supdsub|topfork|succsim|rbrkslu|rbrksld|pertenk|cudarrr|isindot|planckh|lessgtr|pluscir|gesdoto|plussim|plustwo|lesssim|cularrp|rarrsim|Cayleys|notinva|notinvb|notinvc|UpArrow|Uparrow|uparrow|NotLess|dwangle|precsim|Product|curarrm|Cconint|dotplus|rarrbfs|ccupssm|Cedilla|cemptyv|notniva|quatint|frac35|frac38|frac45|frac56|frac58|frac78|tridot|xoplus|gacute|gammad|Gammad|lfisht|lfloor|bigcup|sqsupe|gbreve|Gbreve|lharul|sqsube|sqcups|Gcedil|apacir|llhard|lmidot|Lmidot|lmoust|andand|sqcaps|approx|Abreve|spades|circeq|tprime|divide|topcir|Assign|topbot|gesdot|divonx|xuplus|timesd|gesles|atilde|solbar|SOFTcy|loplus|timesb|lowast|lowbar|dlcorn|dlcrop|softcy|dollar|lparlt|thksim|lrhard|Atilde|lsaquo|smashp|bigvee|thinsp|wreath|bkarow|lsquor|lstrok|Lstrok|lthree|ltimes|ltlarr|DotDot|simdot|ltrPar|weierp|xsqcup|angmsd|sigmav|sigmaf|zeetrf|Zcaron|zcaron|mapsto|vsupne|thetav|cirmid|marker|mcomma|Zacute|vsubnE|there4|gtlPar|vsubne|bottom|gtrarr|SHCHcy|shchcy|midast|midcir|middot|minusb|minusd|gtrdot|bowtie|sfrown|mnplus|models|colone|seswar|Colone|mstpos|searhk|gtrsim|nacute|Nacute|boxbox|telrec|hairsp|Tcedil|nbumpe|scnsim|ncaron|Ncaron|ncedil|Ncedil|hamilt|Scedil|nearhk|hardcy|HARDcy|tcedil|Tcaron|commat|nequiv|nesear|tcaron|target|hearts|nexist|varrho|scedil|Scaron|scaron|hellip|Sacute|sacute|hercon|swnwar|compfn|rtimes|rthree|rsquor|rsaquo|zacute|wedgeq|homtht|barvee|barwed|Barwed|rpargt|horbar|conint|swarhk|roplus|nltrie|hslash|hstrok|Hstrok|rmoust|Conint|bprime|hybull|hyphen|iacute|Iacute|supsup|supsub|supsim|varphi|coprod|brvbar|agrave|Supset|supset|igrave|Igrave|notinE|Agrave|iiiint|iinfin|copysr|wedbar|Verbar|vangrt|becaus|incare|verbar|inodot|bullet|drcorn|intcal|drcrop|cularr|vellip|Utilde|bumpeq|cupcap|dstrok|Dstrok|CupCap|cupcup|cupdot|eacute|Eacute|supdot|iquest|easter|ecaron|Ecaron|ecolon|isinsv|utilde|itilde|Itilde|curarr|succeq|Bumpeq|cacute|ulcrop|nparsl|Cacute|nprcue|egrave|Egrave|nrarrc|nrarrw|subsup|subsub|nrtrie|jsercy|nsccue|Jsercy|kappav|kcedil|Kcedil|subsim|ulcorn|nsimeq|egsdot|veebar|kgreen|capand|elsdot|Subset|subset|curren|aacute|lacute|Lacute|emptyv|ntilde|Ntilde|lagran|lambda|Lambda|capcap|Ugrave|langle|subdot|emsp13|numero|emsp14|nvdash|nvDash|nVdash|nVDash|ugrave|ufisht|nvHarr|larrfs|nvlArr|larrhk|larrlp|larrpl|nvrArr|Udblac|nwarhk|larrtl|nwnear|oacute|Oacute|latail|lAtail|sstarf|lbrace|odblac|Odblac|lbrack|udblac|odsold|eparsl|lcaron|Lcaron|ograve|Ograve|lcedil|Lcedil|Aacute|ssmile|ssetmn|squarf|ldquor|capcup|ominus|cylcty|rharul|eqcirc|dagger|rfloor|rfisht|Dagger|daleth|equals|origof|capdot|equest|dcaron|Dcaron|rdquor|oslash|Oslash|otilde|Otilde|otimes|Otimes|urcrop|Ubreve|ubreve|Yacute|Uacute|uacute|Rcedil|rcedil|urcorn|parsim|Rcaron|Vdashl|rcaron|Tstrok|percnt|period|permil|Exists|yacute|rbrack|rbrace|phmmat|ccaron|Ccaron|planck|ccedil|plankv|tstrok|female|plusdo|plusdu|ffilig|plusmn|ffllig|Ccedil|rAtail|dfisht|bernou|ratail|Rarrtl|rarrtl|angsph|rarrpl|rarrlp|rarrhk|xwedge|xotime|forall|ForAll|Vvdash|vsupnE|preceq|bigcap|frac12|frac13|frac14|primes|rarrfs|prnsim|frac15|Square|frac16|square|lesdot|frac18|frac23|propto|prurel|rarrap|rangle|puncsp|frac25|Racute|qprime|racute|lesges|frac34|abreve|AElig|eqsim|utdot|setmn|urtri|Equal|Uring|seArr|uring|searr|dashv|Dashv|mumap|nabla|iogon|Iogon|sdote|sdotb|scsim|napid|napos|equiv|natur|Acirc|dblac|erarr|nbump|iprod|erDot|ucirc|awint|esdot|angrt|ncong|isinE|scnap|Scirc|scirc|ndash|isins|Ubrcy|nearr|neArr|isinv|nedot|ubrcy|acute|Ycirc|iukcy|Iukcy|xutri|nesim|caret|jcirc|Jcirc|caron|twixt|ddarr|sccue|exist|jmath|sbquo|ngeqq|angst|ccaps|lceil|ngsim|UpTee|delta|Delta|rtrif|nharr|nhArr|nhpar|rtrie|jukcy|Jukcy|kappa|rsquo|Kappa|nlarr|nlArr|TSHcy|rrarr|aogon|Aogon|fflig|xrarr|tshcy|ccirc|nleqq|filig|upsih|nless|dharl|nlsim|fjlig|ropar|nltri|dharr|robrk|roarr|fllig|fltns|roang|rnmid|subnE|subne|lAarr|trisb|Ccirc|acirc|ccups|blank|VDash|forkv|Vdash|langd|cedil|blk12|blk14|laquo|strns|diams|notin|vDash|larrb|blk34|block|disin|uplus|vdash|vBarv|aelig|starf|Wedge|check|xrArr|lates|lbarr|lBarr|notni|lbbrk|bcong|frasl|lbrke|frown|vrtri|vprop|vnsup|gamma|Gamma|wedge|xodot|bdquo|srarr|doteq|ldquo|boxdl|boxdL|gcirc|Gcirc|boxDl|boxDL|boxdr|boxdR|boxDr|TRADE|trade|rlhar|boxDR|vnsub|npart|vltri|rlarr|boxhd|boxhD|nprec|gescc|nrarr|nrArr|boxHd|boxHD|boxhu|boxhU|nrtri|boxHu|clubs|boxHU|times|colon|Colon|gimel|xlArr|Tilde|nsime|tilde|nsmid|nspar|THORN|thorn|xlarr|nsube|nsubE|thkap|xhArr|comma|nsucc|boxul|boxuL|nsupe|nsupE|gneqq|gnsim|boxUl|boxUL|grave|boxur|boxuR|boxUr|boxUR|lescc|angle|bepsi|boxvh|varpi|boxvH|numsp|Theta|gsime|gsiml|theta|boxVh|boxVH|boxvl|gtcir|gtdot|boxvL|boxVl|boxVL|crarr|cross|Cross|nvsim|boxvr|nwarr|nwArr|sqsup|dtdot|Uogon|lhard|lharu|dtrif|ocirc|Ocirc|lhblk|duarr|odash|sqsub|Hacek|sqcup|llarr|duhar|oelig|OElig|ofcir|boxvR|uogon|lltri|boxVr|csube|uuarr|ohbar|csupe|ctdot|olarr|olcir|harrw|oline|sqcap|omacr|Omacr|omega|Omega|boxVR|aleph|lneqq|lnsim|loang|loarr|rharu|lobrk|hcirc|operp|oplus|rhard|Hcirc|orarr|Union|order|ecirc|Ecirc|cuepr|szlig|cuesc|breve|reals|eDDot|Breve|hoarr|lopar|utrif|rdquo|Umacr|umacr|efDot|swArr|ultri|alpha|rceil|ovbar|swarr|Wcirc|wcirc|smtes|smile|bsemi|lrarr|aring|parsl|lrhar|bsime|uhblk|lrtri|cupor|Aring|uharr|uharl|slarr|rbrke|bsolb|lsime|rbbrk|RBarr|lsimg|phone|rBarr|rbarr|icirc|lsquo|Icirc|emacr|Emacr|ratio|simne|plusb|simlE|simgE|simeq|pluse|ltcir|ltdot|empty|xharr|xdtri|iexcl|Alpha|ltrie|rarrw|pound|ltrif|xcirc|bumpe|prcue|bumpE|asymp|amacr|cuvee|Sigma|sigma|iiint|udhar|iiota|ijlig|IJlig|supnE|imacr|Imacr|prime|Prime|image|prnap|eogon|Eogon|rarrc|mdash|mDDot|cuwed|imath|supne|imped|Amacr|udarr|prsim|micro|rarrb|cwint|raquo|infin|eplus|range|rangd|Ucirc|radic|minus|amalg|veeeq|rAarr|epsiv|ycirc|quest|sharp|quot|zwnj|Qscr|race|qscr|Qopf|qopf|qint|rang|Rang|Zscr|zscr|Zopf|zopf|rarr|rArr|Rarr|Pscr|pscr|prop|prod|prnE|prec|ZHcy|zhcy|prap|Zeta|zeta|Popf|popf|Zdot|plus|zdot|Yuml|yuml|phiv|YUcy|yucy|Yscr|yscr|perp|Yopf|yopf|part|para|YIcy|Ouml|rcub|yicy|YAcy|rdca|ouml|osol|Oscr|rdsh|yacy|real|oscr|xvee|andd|rect|andv|Xscr|oror|ordm|ordf|xscr|ange|aopf|Aopf|rHar|Xopf|opar|Oopf|xopf|xnis|rhov|oopf|omid|xmap|oint|apid|apos|ogon|ascr|Ascr|odot|odiv|xcup|xcap|ocir|oast|nvlt|nvle|nvgt|nvge|nvap|Wscr|wscr|auml|ntlg|ntgl|nsup|nsub|nsim|Nscr|nscr|nsce|Wopf|ring|npre|wopf|npar|Auml|Barv|bbrk|Nopf|nopf|nmid|nLtv|beta|ropf|Ropf|Beta|beth|nles|rpar|nleq|bnot|bNot|nldr|NJcy|rscr|Rscr|Vscr|vscr|rsqb|njcy|bopf|nisd|Bopf|rtri|Vopf|nGtv|ngtr|vopf|boxh|boxH|boxv|nges|ngeq|boxV|bscr|scap|Bscr|bsim|Vert|vert|bsol|bull|bump|caps|cdot|ncup|scnE|ncap|nbsp|napE|Cdot|cent|sdot|Vbar|nang|vBar|chcy|Mscr|mscr|sect|semi|CHcy|Mopf|mopf|sext|circ|cire|mldr|mlcp|cirE|comp|shcy|SHcy|vArr|varr|cong|copf|Copf|copy|COPY|malt|male|macr|lvnE|cscr|ltri|sime|ltcc|simg|Cscr|siml|csub|Uuml|lsqb|lsim|uuml|csup|Lscr|lscr|utri|smid|lpar|cups|smte|lozf|darr|Lopf|Uscr|solb|lopf|sopf|Sopf|lneq|uscr|spar|dArr|lnap|Darr|dash|Sqrt|LJcy|ljcy|lHar|dHar|Upsi|upsi|diam|lesg|djcy|DJcy|leqq|dopf|Dopf|dscr|Dscr|dscy|ldsh|ldca|squf|DScy|sscr|Sscr|dsol|lcub|late|star|Star|Uopf|Larr|lArr|larr|uopf|dtri|dzcy|sube|subE|Lang|lang|Kscr|kscr|Kopf|kopf|KJcy|kjcy|KHcy|khcy|DZcy|ecir|edot|eDot|Jscr|jscr|succ|Jopf|jopf|Edot|uHar|emsp|ensp|Iuml|iuml|eopf|isin|Iscr|iscr|Eopf|epar|sung|epsi|escr|sup1|sup2|sup3|Iota|iota|supe|supE|Iopf|iopf|IOcy|iocy|Escr|esim|Esim|imof|Uarr|QUOT|uArr|uarr|euml|IEcy|iecy|Idot|Euml|euro|excl|Hscr|hscr|Hopf|hopf|TScy|tscy|Tscr|hbar|tscr|flat|tbrk|fnof|hArr|harr|half|fopf|Fopf|tdot|gvnE|fork|trie|gtcc|fscr|Fscr|gdot|gsim|Gscr|gscr|Gopf|gopf|gneq|Gdot|tosa|gnap|Topf|topf|geqq|toea|GJcy|gjcy|tint|gesl|mid|Sfr|ggg|top|ges|gla|glE|glj|geq|gne|gEl|gel|gnE|Gcy|gcy|gap|Tfr|tfr|Tcy|tcy|Hat|Tau|Ffr|tau|Tab|hfr|Hfr|ffr|Fcy|fcy|icy|Icy|iff|ETH|eth|ifr|Ifr|Eta|eta|int|Int|Sup|sup|ucy|Ucy|Sum|sum|jcy|ENG|ufr|Ufr|eng|Jcy|jfr|els|ell|egs|Efr|efr|Jfr|uml|kcy|Kcy|Ecy|ecy|kfr|Kfr|lap|Sub|sub|lat|lcy|Lcy|leg|Dot|dot|lEg|leq|les|squ|div|die|lfr|Lfr|lgE|Dfr|dfr|Del|deg|Dcy|dcy|lne|lnE|sol|loz|smt|Cup|lrm|cup|lsh|Lsh|sim|shy|map|Map|mcy|Mcy|mfr|Mfr|mho|gfr|Gfr|sfr|cir|Chi|chi|nap|Cfr|vcy|Vcy|cfr|Scy|scy|ncy|Ncy|vee|Vee|Cap|cap|nfr|scE|sce|Nfr|nge|ngE|nGg|vfr|Vfr|ngt|bot|nGt|nis|niv|Rsh|rsh|nle|nlE|bne|Bfr|bfr|nLl|nlt|nLt|Bcy|bcy|not|Not|rlm|wfr|Wfr|npr|nsc|num|ocy|ast|Ocy|ofr|xfr|Xfr|Ofr|ogt|ohm|apE|olt|Rho|ape|rho|Rfr|rfr|ord|REG|ang|reg|orv|And|and|AMP|Rcy|amp|Afr|ycy|Ycy|yen|yfr|Yfr|rcy|par|pcy|Pcy|pfr|Pfr|phi|Phi|afr|Acy|acy|zcy|Zcy|piv|acE|acd|zfr|Zfr|pre|prE|psi|Psi|qfr|Qfr|zwj|Or|ge|Gg|gt|gg|el|oS|lt|Lt|LT|Re|lg|gl|eg|ne|Im|it|le|DD|wp|wr|nu|Nu|dd|lE|Sc|sc|pi|Pi|ee|af|ll|Ll|rx|gE|xi|pm|Xi|ic|pr|Pr|in|ni|mp|mu|ac|Mu|or|ap|Gt|GT|ii);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)(?!;)([=a-zA-Z0-9]?)|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+)/g;
      var decodeMap = {
        'aacute': '\xE1',
        'Aacute': '\xC1',
        'abreve': "\u0103",
        'Abreve': "\u0102",
        'ac': "\u223E",
        'acd': "\u223F",
        'acE': "\u223E\u0333",
        'acirc': '\xE2',
        'Acirc': '\xC2',
        'acute': '\xB4',
        'acy': "\u0430",
        'Acy': "\u0410",
        'aelig': '\xE6',
        'AElig': '\xC6',
        'af': "\u2061",
        'afr': "\uD835\uDD1E",
        'Afr': "\uD835\uDD04",
        'agrave': '\xE0',
        'Agrave': '\xC0',
        'alefsym': "\u2135",
        'aleph': "\u2135",
        'alpha': "\u03B1",
        'Alpha': "\u0391",
        'amacr': "\u0101",
        'Amacr': "\u0100",
        'amalg': "\u2A3F",
        'amp': '&',
        'AMP': '&',
        'and': "\u2227",
        'And': "\u2A53",
        'andand': "\u2A55",
        'andd': "\u2A5C",
        'andslope': "\u2A58",
        'andv': "\u2A5A",
        'ang': "\u2220",
        'ange': "\u29A4",
        'angle': "\u2220",
        'angmsd': "\u2221",
        'angmsdaa': "\u29A8",
        'angmsdab': "\u29A9",
        'angmsdac': "\u29AA",
        'angmsdad': "\u29AB",
        'angmsdae': "\u29AC",
        'angmsdaf': "\u29AD",
        'angmsdag': "\u29AE",
        'angmsdah': "\u29AF",
        'angrt': "\u221F",
        'angrtvb': "\u22BE",
        'angrtvbd': "\u299D",
        'angsph': "\u2222",
        'angst': '\xC5',
        'angzarr': "\u237C",
        'aogon': "\u0105",
        'Aogon': "\u0104",
        'aopf': "\uD835\uDD52",
        'Aopf': "\uD835\uDD38",
        'ap': "\u2248",
        'apacir': "\u2A6F",
        'ape': "\u224A",
        'apE': "\u2A70",
        'apid': "\u224B",
        'apos': '\'',
        'ApplyFunction': "\u2061",
        'approx': "\u2248",
        'approxeq': "\u224A",
        'aring': '\xE5',
        'Aring': '\xC5',
        'ascr': "\uD835\uDCB6",
        'Ascr': "\uD835\uDC9C",
        'Assign': "\u2254",
        'ast': '*',
        'asymp': "\u2248",
        'asympeq': "\u224D",
        'atilde': '\xE3',
        'Atilde': '\xC3',
        'auml': '\xE4',
        'Auml': '\xC4',
        'awconint': "\u2233",
        'awint': "\u2A11",
        'backcong': "\u224C",
        'backepsilon': "\u03F6",
        'backprime': "\u2035",
        'backsim': "\u223D",
        'backsimeq': "\u22CD",
        'Backslash': "\u2216",
        'Barv': "\u2AE7",
        'barvee': "\u22BD",
        'barwed': "\u2305",
        'Barwed': "\u2306",
        'barwedge': "\u2305",
        'bbrk': "\u23B5",
        'bbrktbrk': "\u23B6",
        'bcong': "\u224C",
        'bcy': "\u0431",
        'Bcy': "\u0411",
        'bdquo': "\u201E",
        'becaus': "\u2235",
        'because': "\u2235",
        'Because': "\u2235",
        'bemptyv': "\u29B0",
        'bepsi': "\u03F6",
        'bernou': "\u212C",
        'Bernoullis': "\u212C",
        'beta': "\u03B2",
        'Beta': "\u0392",
        'beth': "\u2136",
        'between': "\u226C",
        'bfr': "\uD835\uDD1F",
        'Bfr': "\uD835\uDD05",
        'bigcap': "\u22C2",
        'bigcirc': "\u25EF",
        'bigcup': "\u22C3",
        'bigodot': "\u2A00",
        'bigoplus': "\u2A01",
        'bigotimes': "\u2A02",
        'bigsqcup': "\u2A06",
        'bigstar': "\u2605",
        'bigtriangledown': "\u25BD",
        'bigtriangleup': "\u25B3",
        'biguplus': "\u2A04",
        'bigvee': "\u22C1",
        'bigwedge': "\u22C0",
        'bkarow': "\u290D",
        'blacklozenge': "\u29EB",
        'blacksquare': "\u25AA",
        'blacktriangle': "\u25B4",
        'blacktriangledown': "\u25BE",
        'blacktriangleleft': "\u25C2",
        'blacktriangleright': "\u25B8",
        'blank': "\u2423",
        'blk12': "\u2592",
        'blk14': "\u2591",
        'blk34': "\u2593",
        'block': "\u2588",
        'bne': "=\u20E5",
        'bnequiv': "\u2261\u20E5",
        'bnot': "\u2310",
        'bNot': "\u2AED",
        'bopf': "\uD835\uDD53",
        'Bopf': "\uD835\uDD39",
        'bot': "\u22A5",
        'bottom': "\u22A5",
        'bowtie': "\u22C8",
        'boxbox': "\u29C9",
        'boxdl': "\u2510",
        'boxdL': "\u2555",
        'boxDl': "\u2556",
        'boxDL': "\u2557",
        'boxdr': "\u250C",
        'boxdR': "\u2552",
        'boxDr': "\u2553",
        'boxDR': "\u2554",
        'boxh': "\u2500",
        'boxH': "\u2550",
        'boxhd': "\u252C",
        'boxhD': "\u2565",
        'boxHd': "\u2564",
        'boxHD': "\u2566",
        'boxhu': "\u2534",
        'boxhU': "\u2568",
        'boxHu': "\u2567",
        'boxHU': "\u2569",
        'boxminus': "\u229F",
        'boxplus': "\u229E",
        'boxtimes': "\u22A0",
        'boxul': "\u2518",
        'boxuL': "\u255B",
        'boxUl': "\u255C",
        'boxUL': "\u255D",
        'boxur': "\u2514",
        'boxuR': "\u2558",
        'boxUr': "\u2559",
        'boxUR': "\u255A",
        'boxv': "\u2502",
        'boxV': "\u2551",
        'boxvh': "\u253C",
        'boxvH': "\u256A",
        'boxVh': "\u256B",
        'boxVH': "\u256C",
        'boxvl': "\u2524",
        'boxvL': "\u2561",
        'boxVl': "\u2562",
        'boxVL': "\u2563",
        'boxvr': "\u251C",
        'boxvR': "\u255E",
        'boxVr': "\u255F",
        'boxVR': "\u2560",
        'bprime': "\u2035",
        'breve': "\u02D8",
        'Breve': "\u02D8",
        'brvbar': '\xA6',
        'bscr': "\uD835\uDCB7",
        'Bscr': "\u212C",
        'bsemi': "\u204F",
        'bsim': "\u223D",
        'bsime': "\u22CD",
        'bsol': '\\',
        'bsolb': "\u29C5",
        'bsolhsub': "\u27C8",
        'bull': "\u2022",
        'bullet': "\u2022",
        'bump': "\u224E",
        'bumpe': "\u224F",
        'bumpE': "\u2AAE",
        'bumpeq': "\u224F",
        'Bumpeq': "\u224E",
        'cacute': "\u0107",
        'Cacute': "\u0106",
        'cap': "\u2229",
        'Cap': "\u22D2",
        'capand': "\u2A44",
        'capbrcup': "\u2A49",
        'capcap': "\u2A4B",
        'capcup': "\u2A47",
        'capdot': "\u2A40",
        'CapitalDifferentialD': "\u2145",
        'caps': "\u2229\uFE00",
        'caret': "\u2041",
        'caron': "\u02C7",
        'Cayleys': "\u212D",
        'ccaps': "\u2A4D",
        'ccaron': "\u010D",
        'Ccaron': "\u010C",
        'ccedil': '\xE7',
        'Ccedil': '\xC7',
        'ccirc': "\u0109",
        'Ccirc': "\u0108",
        'Cconint': "\u2230",
        'ccups': "\u2A4C",
        'ccupssm': "\u2A50",
        'cdot': "\u010B",
        'Cdot': "\u010A",
        'cedil': '\xB8',
        'Cedilla': '\xB8',
        'cemptyv': "\u29B2",
        'cent': '\xA2',
        'centerdot': '\xB7',
        'CenterDot': '\xB7',
        'cfr': "\uD835\uDD20",
        'Cfr': "\u212D",
        'chcy': "\u0447",
        'CHcy': "\u0427",
        'check': "\u2713",
        'checkmark': "\u2713",
        'chi': "\u03C7",
        'Chi': "\u03A7",
        'cir': "\u25CB",
        'circ': "\u02C6",
        'circeq': "\u2257",
        'circlearrowleft': "\u21BA",
        'circlearrowright': "\u21BB",
        'circledast': "\u229B",
        'circledcirc': "\u229A",
        'circleddash': "\u229D",
        'CircleDot': "\u2299",
        'circledR': '\xAE',
        'circledS': "\u24C8",
        'CircleMinus': "\u2296",
        'CirclePlus': "\u2295",
        'CircleTimes': "\u2297",
        'cire': "\u2257",
        'cirE': "\u29C3",
        'cirfnint': "\u2A10",
        'cirmid': "\u2AEF",
        'cirscir': "\u29C2",
        'ClockwiseContourIntegral': "\u2232",
        'CloseCurlyDoubleQuote': "\u201D",
        'CloseCurlyQuote': "\u2019",
        'clubs': "\u2663",
        'clubsuit': "\u2663",
        'colon': ':',
        'Colon': "\u2237",
        'colone': "\u2254",
        'Colone': "\u2A74",
        'coloneq': "\u2254",
        'comma': ',',
        'commat': '@',
        'comp': "\u2201",
        'compfn': "\u2218",
        'complement': "\u2201",
        'complexes': "\u2102",
        'cong': "\u2245",
        'congdot': "\u2A6D",
        'Congruent': "\u2261",
        'conint': "\u222E",
        'Conint': "\u222F",
        'ContourIntegral': "\u222E",
        'copf': "\uD835\uDD54",
        'Copf': "\u2102",
        'coprod': "\u2210",
        'Coproduct': "\u2210",
        'copy': '\xA9',
        'COPY': '\xA9',
        'copysr': "\u2117",
        'CounterClockwiseContourIntegral': "\u2233",
        'crarr': "\u21B5",
        'cross': "\u2717",
        'Cross': "\u2A2F",
        'cscr': "\uD835\uDCB8",
        'Cscr': "\uD835\uDC9E",
        'csub': "\u2ACF",
        'csube': "\u2AD1",
        'csup': "\u2AD0",
        'csupe': "\u2AD2",
        'ctdot': "\u22EF",
        'cudarrl': "\u2938",
        'cudarrr': "\u2935",
        'cuepr': "\u22DE",
        'cuesc': "\u22DF",
        'cularr': "\u21B6",
        'cularrp': "\u293D",
        'cup': "\u222A",
        'Cup': "\u22D3",
        'cupbrcap': "\u2A48",
        'cupcap': "\u2A46",
        'CupCap': "\u224D",
        'cupcup': "\u2A4A",
        'cupdot': "\u228D",
        'cupor': "\u2A45",
        'cups': "\u222A\uFE00",
        'curarr': "\u21B7",
        'curarrm': "\u293C",
        'curlyeqprec': "\u22DE",
        'curlyeqsucc': "\u22DF",
        'curlyvee': "\u22CE",
        'curlywedge': "\u22CF",
        'curren': '\xA4',
        'curvearrowleft': "\u21B6",
        'curvearrowright': "\u21B7",
        'cuvee': "\u22CE",
        'cuwed': "\u22CF",
        'cwconint': "\u2232",
        'cwint': "\u2231",
        'cylcty': "\u232D",
        'dagger': "\u2020",
        'Dagger': "\u2021",
        'daleth': "\u2138",
        'darr': "\u2193",
        'dArr': "\u21D3",
        'Darr': "\u21A1",
        'dash': "\u2010",
        'dashv': "\u22A3",
        'Dashv': "\u2AE4",
        'dbkarow': "\u290F",
        'dblac': "\u02DD",
        'dcaron': "\u010F",
        'Dcaron': "\u010E",
        'dcy': "\u0434",
        'Dcy': "\u0414",
        'dd': "\u2146",
        'DD': "\u2145",
        'ddagger': "\u2021",
        'ddarr': "\u21CA",
        'DDotrahd': "\u2911",
        'ddotseq': "\u2A77",
        'deg': '\xB0',
        'Del': "\u2207",
        'delta': "\u03B4",
        'Delta': "\u0394",
        'demptyv': "\u29B1",
        'dfisht': "\u297F",
        'dfr': "\uD835\uDD21",
        'Dfr': "\uD835\uDD07",
        'dHar': "\u2965",
        'dharl': "\u21C3",
        'dharr': "\u21C2",
        'DiacriticalAcute': '\xB4',
        'DiacriticalDot': "\u02D9",
        'DiacriticalDoubleAcute': "\u02DD",
        'DiacriticalGrave': '`',
        'DiacriticalTilde': "\u02DC",
        'diam': "\u22C4",
        'diamond': "\u22C4",
        'Diamond': "\u22C4",
        'diamondsuit': "\u2666",
        'diams': "\u2666",
        'die': '\xA8',
        'DifferentialD': "\u2146",
        'digamma': "\u03DD",
        'disin': "\u22F2",
        'div': '\xF7',
        'divide': '\xF7',
        'divideontimes': "\u22C7",
        'divonx': "\u22C7",
        'djcy': "\u0452",
        'DJcy': "\u0402",
        'dlcorn': "\u231E",
        'dlcrop': "\u230D",
        'dollar': '$',
        'dopf': "\uD835\uDD55",
        'Dopf': "\uD835\uDD3B",
        'dot': "\u02D9",
        'Dot': '\xA8',
        'DotDot': "\u20DC",
        'doteq': "\u2250",
        'doteqdot': "\u2251",
        'DotEqual': "\u2250",
        'dotminus': "\u2238",
        'dotplus': "\u2214",
        'dotsquare': "\u22A1",
        'doublebarwedge': "\u2306",
        'DoubleContourIntegral': "\u222F",
        'DoubleDot': '\xA8',
        'DoubleDownArrow': "\u21D3",
        'DoubleLeftArrow': "\u21D0",
        'DoubleLeftRightArrow': "\u21D4",
        'DoubleLeftTee': "\u2AE4",
        'DoubleLongLeftArrow': "\u27F8",
        'DoubleLongLeftRightArrow': "\u27FA",
        'DoubleLongRightArrow': "\u27F9",
        'DoubleRightArrow': "\u21D2",
        'DoubleRightTee': "\u22A8",
        'DoubleUpArrow': "\u21D1",
        'DoubleUpDownArrow': "\u21D5",
        'DoubleVerticalBar': "\u2225",
        'downarrow': "\u2193",
        'Downarrow': "\u21D3",
        'DownArrow': "\u2193",
        'DownArrowBar': "\u2913",
        'DownArrowUpArrow': "\u21F5",
        'DownBreve': "\u0311",
        'downdownarrows': "\u21CA",
        'downharpoonleft': "\u21C3",
        'downharpoonright': "\u21C2",
        'DownLeftRightVector': "\u2950",
        'DownLeftTeeVector': "\u295E",
        'DownLeftVector': "\u21BD",
        'DownLeftVectorBar': "\u2956",
        'DownRightTeeVector': "\u295F",
        'DownRightVector': "\u21C1",
        'DownRightVectorBar': "\u2957",
        'DownTee': "\u22A4",
        'DownTeeArrow': "\u21A7",
        'drbkarow': "\u2910",
        'drcorn': "\u231F",
        'drcrop': "\u230C",
        'dscr': "\uD835\uDCB9",
        'Dscr': "\uD835\uDC9F",
        'dscy': "\u0455",
        'DScy': "\u0405",
        'dsol': "\u29F6",
        'dstrok': "\u0111",
        'Dstrok': "\u0110",
        'dtdot': "\u22F1",
        'dtri': "\u25BF",
        'dtrif': "\u25BE",
        'duarr': "\u21F5",
        'duhar': "\u296F",
        'dwangle': "\u29A6",
        'dzcy': "\u045F",
        'DZcy': "\u040F",
        'dzigrarr': "\u27FF",
        'eacute': '\xE9',
        'Eacute': '\xC9',
        'easter': "\u2A6E",
        'ecaron': "\u011B",
        'Ecaron': "\u011A",
        'ecir': "\u2256",
        'ecirc': '\xEA',
        'Ecirc': '\xCA',
        'ecolon': "\u2255",
        'ecy': "\u044D",
        'Ecy': "\u042D",
        'eDDot': "\u2A77",
        'edot': "\u0117",
        'eDot': "\u2251",
        'Edot': "\u0116",
        'ee': "\u2147",
        'efDot': "\u2252",
        'efr': "\uD835\uDD22",
        'Efr': "\uD835\uDD08",
        'eg': "\u2A9A",
        'egrave': '\xE8',
        'Egrave': '\xC8',
        'egs': "\u2A96",
        'egsdot': "\u2A98",
        'el': "\u2A99",
        'Element': "\u2208",
        'elinters': "\u23E7",
        'ell': "\u2113",
        'els': "\u2A95",
        'elsdot': "\u2A97",
        'emacr': "\u0113",
        'Emacr': "\u0112",
        'empty': "\u2205",
        'emptyset': "\u2205",
        'EmptySmallSquare': "\u25FB",
        'emptyv': "\u2205",
        'EmptyVerySmallSquare': "\u25AB",
        'emsp': "\u2003",
        'emsp13': "\u2004",
        'emsp14': "\u2005",
        'eng': "\u014B",
        'ENG': "\u014A",
        'ensp': "\u2002",
        'eogon': "\u0119",
        'Eogon': "\u0118",
        'eopf': "\uD835\uDD56",
        'Eopf': "\uD835\uDD3C",
        'epar': "\u22D5",
        'eparsl': "\u29E3",
        'eplus': "\u2A71",
        'epsi': "\u03B5",
        'epsilon': "\u03B5",
        'Epsilon': "\u0395",
        'epsiv': "\u03F5",
        'eqcirc': "\u2256",
        'eqcolon': "\u2255",
        'eqsim': "\u2242",
        'eqslantgtr': "\u2A96",
        'eqslantless': "\u2A95",
        'Equal': "\u2A75",
        'equals': '=',
        'EqualTilde': "\u2242",
        'equest': "\u225F",
        'Equilibrium': "\u21CC",
        'equiv': "\u2261",
        'equivDD': "\u2A78",
        'eqvparsl': "\u29E5",
        'erarr': "\u2971",
        'erDot': "\u2253",
        'escr': "\u212F",
        'Escr': "\u2130",
        'esdot': "\u2250",
        'esim': "\u2242",
        'Esim': "\u2A73",
        'eta': "\u03B7",
        'Eta': "\u0397",
        'eth': '\xF0',
        'ETH': '\xD0',
        'euml': '\xEB',
        'Euml': '\xCB',
        'euro': "\u20AC",
        'excl': '!',
        'exist': "\u2203",
        'Exists': "\u2203",
        'expectation': "\u2130",
        'exponentiale': "\u2147",
        'ExponentialE': "\u2147",
        'fallingdotseq': "\u2252",
        'fcy': "\u0444",
        'Fcy': "\u0424",
        'female': "\u2640",
        'ffilig': "\uFB03",
        'fflig': "\uFB00",
        'ffllig': "\uFB04",
        'ffr': "\uD835\uDD23",
        'Ffr': "\uD835\uDD09",
        'filig': "\uFB01",
        'FilledSmallSquare': "\u25FC",
        'FilledVerySmallSquare': "\u25AA",
        'fjlig': 'fj',
        'flat': "\u266D",
        'fllig': "\uFB02",
        'fltns': "\u25B1",
        'fnof': "\u0192",
        'fopf': "\uD835\uDD57",
        'Fopf': "\uD835\uDD3D",
        'forall': "\u2200",
        'ForAll': "\u2200",
        'fork': "\u22D4",
        'forkv': "\u2AD9",
        'Fouriertrf': "\u2131",
        'fpartint': "\u2A0D",
        'frac12': '\xBD',
        'frac13': "\u2153",
        'frac14': '\xBC',
        'frac15': "\u2155",
        'frac16': "\u2159",
        'frac18': "\u215B",
        'frac23': "\u2154",
        'frac25': "\u2156",
        'frac34': '\xBE',
        'frac35': "\u2157",
        'frac38': "\u215C",
        'frac45': "\u2158",
        'frac56': "\u215A",
        'frac58': "\u215D",
        'frac78': "\u215E",
        'frasl': "\u2044",
        'frown': "\u2322",
        'fscr': "\uD835\uDCBB",
        'Fscr': "\u2131",
        'gacute': "\u01F5",
        'gamma': "\u03B3",
        'Gamma': "\u0393",
        'gammad': "\u03DD",
        'Gammad': "\u03DC",
        'gap': "\u2A86",
        'gbreve': "\u011F",
        'Gbreve': "\u011E",
        'Gcedil': "\u0122",
        'gcirc': "\u011D",
        'Gcirc': "\u011C",
        'gcy': "\u0433",
        'Gcy': "\u0413",
        'gdot': "\u0121",
        'Gdot': "\u0120",
        'ge': "\u2265",
        'gE': "\u2267",
        'gel': "\u22DB",
        'gEl': "\u2A8C",
        'geq': "\u2265",
        'geqq': "\u2267",
        'geqslant': "\u2A7E",
        'ges': "\u2A7E",
        'gescc': "\u2AA9",
        'gesdot': "\u2A80",
        'gesdoto': "\u2A82",
        'gesdotol': "\u2A84",
        'gesl': "\u22DB\uFE00",
        'gesles': "\u2A94",
        'gfr': "\uD835\uDD24",
        'Gfr': "\uD835\uDD0A",
        'gg': "\u226B",
        'Gg': "\u22D9",
        'ggg': "\u22D9",
        'gimel': "\u2137",
        'gjcy': "\u0453",
        'GJcy': "\u0403",
        'gl': "\u2277",
        'gla': "\u2AA5",
        'glE': "\u2A92",
        'glj': "\u2AA4",
        'gnap': "\u2A8A",
        'gnapprox': "\u2A8A",
        'gne': "\u2A88",
        'gnE': "\u2269",
        'gneq': "\u2A88",
        'gneqq': "\u2269",
        'gnsim': "\u22E7",
        'gopf': "\uD835\uDD58",
        'Gopf': "\uD835\uDD3E",
        'grave': '`',
        'GreaterEqual': "\u2265",
        'GreaterEqualLess': "\u22DB",
        'GreaterFullEqual': "\u2267",
        'GreaterGreater': "\u2AA2",
        'GreaterLess': "\u2277",
        'GreaterSlantEqual': "\u2A7E",
        'GreaterTilde': "\u2273",
        'gscr': "\u210A",
        'Gscr': "\uD835\uDCA2",
        'gsim': "\u2273",
        'gsime': "\u2A8E",
        'gsiml': "\u2A90",
        'gt': '>',
        'Gt': "\u226B",
        'GT': '>',
        'gtcc': "\u2AA7",
        'gtcir': "\u2A7A",
        'gtdot': "\u22D7",
        'gtlPar': "\u2995",
        'gtquest': "\u2A7C",
        'gtrapprox': "\u2A86",
        'gtrarr': "\u2978",
        'gtrdot': "\u22D7",
        'gtreqless': "\u22DB",
        'gtreqqless': "\u2A8C",
        'gtrless': "\u2277",
        'gtrsim': "\u2273",
        'gvertneqq': "\u2269\uFE00",
        'gvnE': "\u2269\uFE00",
        'Hacek': "\u02C7",
        'hairsp': "\u200A",
        'half': '\xBD',
        'hamilt': "\u210B",
        'hardcy': "\u044A",
        'HARDcy': "\u042A",
        'harr': "\u2194",
        'hArr': "\u21D4",
        'harrcir': "\u2948",
        'harrw': "\u21AD",
        'Hat': '^',
        'hbar': "\u210F",
        'hcirc': "\u0125",
        'Hcirc': "\u0124",
        'hearts': "\u2665",
        'heartsuit': "\u2665",
        'hellip': "\u2026",
        'hercon': "\u22B9",
        'hfr': "\uD835\uDD25",
        'Hfr': "\u210C",
        'HilbertSpace': "\u210B",
        'hksearow': "\u2925",
        'hkswarow': "\u2926",
        'hoarr': "\u21FF",
        'homtht': "\u223B",
        'hookleftarrow': "\u21A9",
        'hookrightarrow': "\u21AA",
        'hopf': "\uD835\uDD59",
        'Hopf': "\u210D",
        'horbar': "\u2015",
        'HorizontalLine': "\u2500",
        'hscr': "\uD835\uDCBD",
        'Hscr': "\u210B",
        'hslash': "\u210F",
        'hstrok': "\u0127",
        'Hstrok': "\u0126",
        'HumpDownHump': "\u224E",
        'HumpEqual': "\u224F",
        'hybull': "\u2043",
        'hyphen': "\u2010",
        'iacute': '\xED',
        'Iacute': '\xCD',
        'ic': "\u2063",
        'icirc': '\xEE',
        'Icirc': '\xCE',
        'icy': "\u0438",
        'Icy': "\u0418",
        'Idot': "\u0130",
        'iecy': "\u0435",
        'IEcy': "\u0415",
        'iexcl': '\xA1',
        'iff': "\u21D4",
        'ifr': "\uD835\uDD26",
        'Ifr': "\u2111",
        'igrave': '\xEC',
        'Igrave': '\xCC',
        'ii': "\u2148",
        'iiiint': "\u2A0C",
        'iiint': "\u222D",
        'iinfin': "\u29DC",
        'iiota': "\u2129",
        'ijlig': "\u0133",
        'IJlig': "\u0132",
        'Im': "\u2111",
        'imacr': "\u012B",
        'Imacr': "\u012A",
        'image': "\u2111",
        'ImaginaryI': "\u2148",
        'imagline': "\u2110",
        'imagpart': "\u2111",
        'imath': "\u0131",
        'imof': "\u22B7",
        'imped': "\u01B5",
        'Implies': "\u21D2",
        'in': "\u2208",
        'incare': "\u2105",
        'infin': "\u221E",
        'infintie': "\u29DD",
        'inodot': "\u0131",
        'int': "\u222B",
        'Int': "\u222C",
        'intcal': "\u22BA",
        'integers': "\u2124",
        'Integral': "\u222B",
        'intercal': "\u22BA",
        'Intersection': "\u22C2",
        'intlarhk': "\u2A17",
        'intprod': "\u2A3C",
        'InvisibleComma': "\u2063",
        'InvisibleTimes': "\u2062",
        'iocy': "\u0451",
        'IOcy': "\u0401",
        'iogon': "\u012F",
        'Iogon': "\u012E",
        'iopf': "\uD835\uDD5A",
        'Iopf': "\uD835\uDD40",
        'iota': "\u03B9",
        'Iota': "\u0399",
        'iprod': "\u2A3C",
        'iquest': '\xBF',
        'iscr': "\uD835\uDCBE",
        'Iscr': "\u2110",
        'isin': "\u2208",
        'isindot': "\u22F5",
        'isinE': "\u22F9",
        'isins': "\u22F4",
        'isinsv': "\u22F3",
        'isinv': "\u2208",
        'it': "\u2062",
        'itilde': "\u0129",
        'Itilde': "\u0128",
        'iukcy': "\u0456",
        'Iukcy': "\u0406",
        'iuml': '\xEF',
        'Iuml': '\xCF',
        'jcirc': "\u0135",
        'Jcirc': "\u0134",
        'jcy': "\u0439",
        'Jcy': "\u0419",
        'jfr': "\uD835\uDD27",
        'Jfr': "\uD835\uDD0D",
        'jmath': "\u0237",
        'jopf': "\uD835\uDD5B",
        'Jopf': "\uD835\uDD41",
        'jscr': "\uD835\uDCBF",
        'Jscr': "\uD835\uDCA5",
        'jsercy': "\u0458",
        'Jsercy': "\u0408",
        'jukcy': "\u0454",
        'Jukcy': "\u0404",
        'kappa': "\u03BA",
        'Kappa': "\u039A",
        'kappav': "\u03F0",
        'kcedil': "\u0137",
        'Kcedil': "\u0136",
        'kcy': "\u043A",
        'Kcy': "\u041A",
        'kfr': "\uD835\uDD28",
        'Kfr': "\uD835\uDD0E",
        'kgreen': "\u0138",
        'khcy': "\u0445",
        'KHcy': "\u0425",
        'kjcy': "\u045C",
        'KJcy': "\u040C",
        'kopf': "\uD835\uDD5C",
        'Kopf': "\uD835\uDD42",
        'kscr': "\uD835\uDCC0",
        'Kscr': "\uD835\uDCA6",
        'lAarr': "\u21DA",
        'lacute': "\u013A",
        'Lacute': "\u0139",
        'laemptyv': "\u29B4",
        'lagran': "\u2112",
        'lambda': "\u03BB",
        'Lambda': "\u039B",
        'lang': "\u27E8",
        'Lang': "\u27EA",
        'langd': "\u2991",
        'langle': "\u27E8",
        'lap': "\u2A85",
        'Laplacetrf': "\u2112",
        'laquo': '\xAB',
        'larr': "\u2190",
        'lArr': "\u21D0",
        'Larr': "\u219E",
        'larrb': "\u21E4",
        'larrbfs': "\u291F",
        'larrfs': "\u291D",
        'larrhk': "\u21A9",
        'larrlp': "\u21AB",
        'larrpl': "\u2939",
        'larrsim': "\u2973",
        'larrtl': "\u21A2",
        'lat': "\u2AAB",
        'latail': "\u2919",
        'lAtail': "\u291B",
        'late': "\u2AAD",
        'lates': "\u2AAD\uFE00",
        'lbarr': "\u290C",
        'lBarr': "\u290E",
        'lbbrk': "\u2772",
        'lbrace': '{',
        'lbrack': '[',
        'lbrke': "\u298B",
        'lbrksld': "\u298F",
        'lbrkslu': "\u298D",
        'lcaron': "\u013E",
        'Lcaron': "\u013D",
        'lcedil': "\u013C",
        'Lcedil': "\u013B",
        'lceil': "\u2308",
        'lcub': '{',
        'lcy': "\u043B",
        'Lcy': "\u041B",
        'ldca': "\u2936",
        'ldquo': "\u201C",
        'ldquor': "\u201E",
        'ldrdhar': "\u2967",
        'ldrushar': "\u294B",
        'ldsh': "\u21B2",
        'le': "\u2264",
        'lE': "\u2266",
        'LeftAngleBracket': "\u27E8",
        'leftarrow': "\u2190",
        'Leftarrow': "\u21D0",
        'LeftArrow': "\u2190",
        'LeftArrowBar': "\u21E4",
        'LeftArrowRightArrow': "\u21C6",
        'leftarrowtail': "\u21A2",
        'LeftCeiling': "\u2308",
        'LeftDoubleBracket': "\u27E6",
        'LeftDownTeeVector': "\u2961",
        'LeftDownVector': "\u21C3",
        'LeftDownVectorBar': "\u2959",
        'LeftFloor': "\u230A",
        'leftharpoondown': "\u21BD",
        'leftharpoonup': "\u21BC",
        'leftleftarrows': "\u21C7",
        'leftrightarrow': "\u2194",
        'Leftrightarrow': "\u21D4",
        'LeftRightArrow': "\u2194",
        'leftrightarrows': "\u21C6",
        'leftrightharpoons': "\u21CB",
        'leftrightsquigarrow': "\u21AD",
        'LeftRightVector': "\u294E",
        'LeftTee': "\u22A3",
        'LeftTeeArrow': "\u21A4",
        'LeftTeeVector': "\u295A",
        'leftthreetimes': "\u22CB",
        'LeftTriangle': "\u22B2",
        'LeftTriangleBar': "\u29CF",
        'LeftTriangleEqual': "\u22B4",
        'LeftUpDownVector': "\u2951",
        'LeftUpTeeVector': "\u2960",
        'LeftUpVector': "\u21BF",
        'LeftUpVectorBar': "\u2958",
        'LeftVector': "\u21BC",
        'LeftVectorBar': "\u2952",
        'leg': "\u22DA",
        'lEg': "\u2A8B",
        'leq': "\u2264",
        'leqq': "\u2266",
        'leqslant': "\u2A7D",
        'les': "\u2A7D",
        'lescc': "\u2AA8",
        'lesdot': "\u2A7F",
        'lesdoto': "\u2A81",
        'lesdotor': "\u2A83",
        'lesg': "\u22DA\uFE00",
        'lesges': "\u2A93",
        'lessapprox': "\u2A85",
        'lessdot': "\u22D6",
        'lesseqgtr': "\u22DA",
        'lesseqqgtr': "\u2A8B",
        'LessEqualGreater': "\u22DA",
        'LessFullEqual': "\u2266",
        'LessGreater': "\u2276",
        'lessgtr': "\u2276",
        'LessLess': "\u2AA1",
        'lesssim': "\u2272",
        'LessSlantEqual': "\u2A7D",
        'LessTilde': "\u2272",
        'lfisht': "\u297C",
        'lfloor': "\u230A",
        'lfr': "\uD835\uDD29",
        'Lfr': "\uD835\uDD0F",
        'lg': "\u2276",
        'lgE': "\u2A91",
        'lHar': "\u2962",
        'lhard': "\u21BD",
        'lharu': "\u21BC",
        'lharul': "\u296A",
        'lhblk': "\u2584",
        'ljcy': "\u0459",
        'LJcy': "\u0409",
        'll': "\u226A",
        'Ll': "\u22D8",
        'llarr': "\u21C7",
        'llcorner': "\u231E",
        'Lleftarrow': "\u21DA",
        'llhard': "\u296B",
        'lltri': "\u25FA",
        'lmidot': "\u0140",
        'Lmidot': "\u013F",
        'lmoust': "\u23B0",
        'lmoustache': "\u23B0",
        'lnap': "\u2A89",
        'lnapprox': "\u2A89",
        'lne': "\u2A87",
        'lnE': "\u2268",
        'lneq': "\u2A87",
        'lneqq': "\u2268",
        'lnsim': "\u22E6",
        'loang': "\u27EC",
        'loarr': "\u21FD",
        'lobrk': "\u27E6",
        'longleftarrow': "\u27F5",
        'Longleftarrow': "\u27F8",
        'LongLeftArrow': "\u27F5",
        'longleftrightarrow': "\u27F7",
        'Longleftrightarrow': "\u27FA",
        'LongLeftRightArrow': "\u27F7",
        'longmapsto': "\u27FC",
        'longrightarrow': "\u27F6",
        'Longrightarrow': "\u27F9",
        'LongRightArrow': "\u27F6",
        'looparrowleft': "\u21AB",
        'looparrowright': "\u21AC",
        'lopar': "\u2985",
        'lopf': "\uD835\uDD5D",
        'Lopf': "\uD835\uDD43",
        'loplus': "\u2A2D",
        'lotimes': "\u2A34",
        'lowast': "\u2217",
        'lowbar': '_',
        'LowerLeftArrow': "\u2199",
        'LowerRightArrow': "\u2198",
        'loz': "\u25CA",
        'lozenge': "\u25CA",
        'lozf': "\u29EB",
        'lpar': '(',
        'lparlt': "\u2993",
        'lrarr': "\u21C6",
        'lrcorner': "\u231F",
        'lrhar': "\u21CB",
        'lrhard': "\u296D",
        'lrm': "\u200E",
        'lrtri': "\u22BF",
        'lsaquo': "\u2039",
        'lscr': "\uD835\uDCC1",
        'Lscr': "\u2112",
        'lsh': "\u21B0",
        'Lsh': "\u21B0",
        'lsim': "\u2272",
        'lsime': "\u2A8D",
        'lsimg': "\u2A8F",
        'lsqb': '[',
        'lsquo': "\u2018",
        'lsquor': "\u201A",
        'lstrok': "\u0142",
        'Lstrok': "\u0141",
        'lt': '<',
        'Lt': "\u226A",
        'LT': '<',
        'ltcc': "\u2AA6",
        'ltcir': "\u2A79",
        'ltdot': "\u22D6",
        'lthree': "\u22CB",
        'ltimes': "\u22C9",
        'ltlarr': "\u2976",
        'ltquest': "\u2A7B",
        'ltri': "\u25C3",
        'ltrie': "\u22B4",
        'ltrif': "\u25C2",
        'ltrPar': "\u2996",
        'lurdshar': "\u294A",
        'luruhar': "\u2966",
        'lvertneqq': "\u2268\uFE00",
        'lvnE': "\u2268\uFE00",
        'macr': '\xAF',
        'male': "\u2642",
        'malt': "\u2720",
        'maltese': "\u2720",
        'map': "\u21A6",
        'Map': "\u2905",
        'mapsto': "\u21A6",
        'mapstodown': "\u21A7",
        'mapstoleft': "\u21A4",
        'mapstoup': "\u21A5",
        'marker': "\u25AE",
        'mcomma': "\u2A29",
        'mcy': "\u043C",
        'Mcy': "\u041C",
        'mdash': "\u2014",
        'mDDot': "\u223A",
        'measuredangle': "\u2221",
        'MediumSpace': "\u205F",
        'Mellintrf': "\u2133",
        'mfr': "\uD835\uDD2A",
        'Mfr': "\uD835\uDD10",
        'mho': "\u2127",
        'micro': '\xB5',
        'mid': "\u2223",
        'midast': '*',
        'midcir': "\u2AF0",
        'middot': '\xB7',
        'minus': "\u2212",
        'minusb': "\u229F",
        'minusd': "\u2238",
        'minusdu': "\u2A2A",
        'MinusPlus': "\u2213",
        'mlcp': "\u2ADB",
        'mldr': "\u2026",
        'mnplus': "\u2213",
        'models': "\u22A7",
        'mopf': "\uD835\uDD5E",
        'Mopf': "\uD835\uDD44",
        'mp': "\u2213",
        'mscr': "\uD835\uDCC2",
        'Mscr': "\u2133",
        'mstpos': "\u223E",
        'mu': "\u03BC",
        'Mu': "\u039C",
        'multimap': "\u22B8",
        'mumap': "\u22B8",
        'nabla': "\u2207",
        'nacute': "\u0144",
        'Nacute': "\u0143",
        'nang': "\u2220\u20D2",
        'nap': "\u2249",
        'napE': "\u2A70\u0338",
        'napid': "\u224B\u0338",
        'napos': "\u0149",
        'napprox': "\u2249",
        'natur': "\u266E",
        'natural': "\u266E",
        'naturals': "\u2115",
        'nbsp': '\xA0',
        'nbump': "\u224E\u0338",
        'nbumpe': "\u224F\u0338",
        'ncap': "\u2A43",
        'ncaron': "\u0148",
        'Ncaron': "\u0147",
        'ncedil': "\u0146",
        'Ncedil': "\u0145",
        'ncong': "\u2247",
        'ncongdot': "\u2A6D\u0338",
        'ncup': "\u2A42",
        'ncy': "\u043D",
        'Ncy': "\u041D",
        'ndash': "\u2013",
        'ne': "\u2260",
        'nearhk': "\u2924",
        'nearr': "\u2197",
        'neArr': "\u21D7",
        'nearrow': "\u2197",
        'nedot': "\u2250\u0338",
        'NegativeMediumSpace': "\u200B",
        'NegativeThickSpace': "\u200B",
        'NegativeThinSpace': "\u200B",
        'NegativeVeryThinSpace': "\u200B",
        'nequiv': "\u2262",
        'nesear': "\u2928",
        'nesim': "\u2242\u0338",
        'NestedGreaterGreater': "\u226B",
        'NestedLessLess': "\u226A",
        'NewLine': '\n',
        'nexist': "\u2204",
        'nexists': "\u2204",
        'nfr': "\uD835\uDD2B",
        'Nfr': "\uD835\uDD11",
        'nge': "\u2271",
        'ngE': "\u2267\u0338",
        'ngeq': "\u2271",
        'ngeqq': "\u2267\u0338",
        'ngeqslant': "\u2A7E\u0338",
        'nges': "\u2A7E\u0338",
        'nGg': "\u22D9\u0338",
        'ngsim': "\u2275",
        'ngt': "\u226F",
        'nGt': "\u226B\u20D2",
        'ngtr': "\u226F",
        'nGtv': "\u226B\u0338",
        'nharr': "\u21AE",
        'nhArr': "\u21CE",
        'nhpar': "\u2AF2",
        'ni': "\u220B",
        'nis': "\u22FC",
        'nisd': "\u22FA",
        'niv': "\u220B",
        'njcy': "\u045A",
        'NJcy': "\u040A",
        'nlarr': "\u219A",
        'nlArr': "\u21CD",
        'nldr': "\u2025",
        'nle': "\u2270",
        'nlE': "\u2266\u0338",
        'nleftarrow': "\u219A",
        'nLeftarrow': "\u21CD",
        'nleftrightarrow': "\u21AE",
        'nLeftrightarrow': "\u21CE",
        'nleq': "\u2270",
        'nleqq': "\u2266\u0338",
        'nleqslant': "\u2A7D\u0338",
        'nles': "\u2A7D\u0338",
        'nless': "\u226E",
        'nLl': "\u22D8\u0338",
        'nlsim': "\u2274",
        'nlt': "\u226E",
        'nLt': "\u226A\u20D2",
        'nltri': "\u22EA",
        'nltrie': "\u22EC",
        'nLtv': "\u226A\u0338",
        'nmid': "\u2224",
        'NoBreak': "\u2060",
        'NonBreakingSpace': '\xA0',
        'nopf': "\uD835\uDD5F",
        'Nopf': "\u2115",
        'not': '\xAC',
        'Not': "\u2AEC",
        'NotCongruent': "\u2262",
        'NotCupCap': "\u226D",
        'NotDoubleVerticalBar': "\u2226",
        'NotElement': "\u2209",
        'NotEqual': "\u2260",
        'NotEqualTilde': "\u2242\u0338",
        'NotExists': "\u2204",
        'NotGreater': "\u226F",
        'NotGreaterEqual': "\u2271",
        'NotGreaterFullEqual': "\u2267\u0338",
        'NotGreaterGreater': "\u226B\u0338",
        'NotGreaterLess': "\u2279",
        'NotGreaterSlantEqual': "\u2A7E\u0338",
        'NotGreaterTilde': "\u2275",
        'NotHumpDownHump': "\u224E\u0338",
        'NotHumpEqual': "\u224F\u0338",
        'notin': "\u2209",
        'notindot': "\u22F5\u0338",
        'notinE': "\u22F9\u0338",
        'notinva': "\u2209",
        'notinvb': "\u22F7",
        'notinvc': "\u22F6",
        'NotLeftTriangle': "\u22EA",
        'NotLeftTriangleBar': "\u29CF\u0338",
        'NotLeftTriangleEqual': "\u22EC",
        'NotLess': "\u226E",
        'NotLessEqual': "\u2270",
        'NotLessGreater': "\u2278",
        'NotLessLess': "\u226A\u0338",
        'NotLessSlantEqual': "\u2A7D\u0338",
        'NotLessTilde': "\u2274",
        'NotNestedGreaterGreater': "\u2AA2\u0338",
        'NotNestedLessLess': "\u2AA1\u0338",
        'notni': "\u220C",
        'notniva': "\u220C",
        'notnivb': "\u22FE",
        'notnivc': "\u22FD",
        'NotPrecedes': "\u2280",
        'NotPrecedesEqual': "\u2AAF\u0338",
        'NotPrecedesSlantEqual': "\u22E0",
        'NotReverseElement': "\u220C",
        'NotRightTriangle': "\u22EB",
        'NotRightTriangleBar': "\u29D0\u0338",
        'NotRightTriangleEqual': "\u22ED",
        'NotSquareSubset': "\u228F\u0338",
        'NotSquareSubsetEqual': "\u22E2",
        'NotSquareSuperset': "\u2290\u0338",
        'NotSquareSupersetEqual': "\u22E3",
        'NotSubset': "\u2282\u20D2",
        'NotSubsetEqual': "\u2288",
        'NotSucceeds': "\u2281",
        'NotSucceedsEqual': "\u2AB0\u0338",
        'NotSucceedsSlantEqual': "\u22E1",
        'NotSucceedsTilde': "\u227F\u0338",
        'NotSuperset': "\u2283\u20D2",
        'NotSupersetEqual': "\u2289",
        'NotTilde': "\u2241",
        'NotTildeEqual': "\u2244",
        'NotTildeFullEqual': "\u2247",
        'NotTildeTilde': "\u2249",
        'NotVerticalBar': "\u2224",
        'npar': "\u2226",
        'nparallel': "\u2226",
        'nparsl': "\u2AFD\u20E5",
        'npart': "\u2202\u0338",
        'npolint': "\u2A14",
        'npr': "\u2280",
        'nprcue': "\u22E0",
        'npre': "\u2AAF\u0338",
        'nprec': "\u2280",
        'npreceq': "\u2AAF\u0338",
        'nrarr': "\u219B",
        'nrArr': "\u21CF",
        'nrarrc': "\u2933\u0338",
        'nrarrw': "\u219D\u0338",
        'nrightarrow': "\u219B",
        'nRightarrow': "\u21CF",
        'nrtri': "\u22EB",
        'nrtrie': "\u22ED",
        'nsc': "\u2281",
        'nsccue': "\u22E1",
        'nsce': "\u2AB0\u0338",
        'nscr': "\uD835\uDCC3",
        'Nscr': "\uD835\uDCA9",
        'nshortmid': "\u2224",
        'nshortparallel': "\u2226",
        'nsim': "\u2241",
        'nsime': "\u2244",
        'nsimeq': "\u2244",
        'nsmid': "\u2224",
        'nspar': "\u2226",
        'nsqsube': "\u22E2",
        'nsqsupe': "\u22E3",
        'nsub': "\u2284",
        'nsube': "\u2288",
        'nsubE': "\u2AC5\u0338",
        'nsubset': "\u2282\u20D2",
        'nsubseteq': "\u2288",
        'nsubseteqq': "\u2AC5\u0338",
        'nsucc': "\u2281",
        'nsucceq': "\u2AB0\u0338",
        'nsup': "\u2285",
        'nsupe': "\u2289",
        'nsupE': "\u2AC6\u0338",
        'nsupset': "\u2283\u20D2",
        'nsupseteq': "\u2289",
        'nsupseteqq': "\u2AC6\u0338",
        'ntgl': "\u2279",
        'ntilde': '\xF1',
        'Ntilde': '\xD1',
        'ntlg': "\u2278",
        'ntriangleleft': "\u22EA",
        'ntrianglelefteq': "\u22EC",
        'ntriangleright': "\u22EB",
        'ntrianglerighteq': "\u22ED",
        'nu': "\u03BD",
        'Nu': "\u039D",
        'num': '#',
        'numero': "\u2116",
        'numsp': "\u2007",
        'nvap': "\u224D\u20D2",
        'nvdash': "\u22AC",
        'nvDash': "\u22AD",
        'nVdash': "\u22AE",
        'nVDash': "\u22AF",
        'nvge': "\u2265\u20D2",
        'nvgt': ">\u20D2",
        'nvHarr': "\u2904",
        'nvinfin': "\u29DE",
        'nvlArr': "\u2902",
        'nvle': "\u2264\u20D2",
        'nvlt': "<\u20D2",
        'nvltrie': "\u22B4\u20D2",
        'nvrArr': "\u2903",
        'nvrtrie': "\u22B5\u20D2",
        'nvsim': "\u223C\u20D2",
        'nwarhk': "\u2923",
        'nwarr': "\u2196",
        'nwArr': "\u21D6",
        'nwarrow': "\u2196",
        'nwnear': "\u2927",
        'oacute': '\xF3',
        'Oacute': '\xD3',
        'oast': "\u229B",
        'ocir': "\u229A",
        'ocirc': '\xF4',
        'Ocirc': '\xD4',
        'ocy': "\u043E",
        'Ocy': "\u041E",
        'odash': "\u229D",
        'odblac': "\u0151",
        'Odblac': "\u0150",
        'odiv': "\u2A38",
        'odot': "\u2299",
        'odsold': "\u29BC",
        'oelig': "\u0153",
        'OElig': "\u0152",
        'ofcir': "\u29BF",
        'ofr': "\uD835\uDD2C",
        'Ofr': "\uD835\uDD12",
        'ogon': "\u02DB",
        'ograve': '\xF2',
        'Ograve': '\xD2',
        'ogt': "\u29C1",
        'ohbar': "\u29B5",
        'ohm': "\u03A9",
        'oint': "\u222E",
        'olarr': "\u21BA",
        'olcir': "\u29BE",
        'olcross': "\u29BB",
        'oline': "\u203E",
        'olt': "\u29C0",
        'omacr': "\u014D",
        'Omacr': "\u014C",
        'omega': "\u03C9",
        'Omega': "\u03A9",
        'omicron': "\u03BF",
        'Omicron': "\u039F",
        'omid': "\u29B6",
        'ominus': "\u2296",
        'oopf': "\uD835\uDD60",
        'Oopf': "\uD835\uDD46",
        'opar': "\u29B7",
        'OpenCurlyDoubleQuote': "\u201C",
        'OpenCurlyQuote': "\u2018",
        'operp': "\u29B9",
        'oplus': "\u2295",
        'or': "\u2228",
        'Or': "\u2A54",
        'orarr': "\u21BB",
        'ord': "\u2A5D",
        'order': "\u2134",
        'orderof': "\u2134",
        'ordf': '\xAA',
        'ordm': '\xBA',
        'origof': "\u22B6",
        'oror': "\u2A56",
        'orslope': "\u2A57",
        'orv': "\u2A5B",
        'oS': "\u24C8",
        'oscr': "\u2134",
        'Oscr': "\uD835\uDCAA",
        'oslash': '\xF8',
        'Oslash': '\xD8',
        'osol': "\u2298",
        'otilde': '\xF5',
        'Otilde': '\xD5',
        'otimes': "\u2297",
        'Otimes': "\u2A37",
        'otimesas': "\u2A36",
        'ouml': '\xF6',
        'Ouml': '\xD6',
        'ovbar': "\u233D",
        'OverBar': "\u203E",
        'OverBrace': "\u23DE",
        'OverBracket': "\u23B4",
        'OverParenthesis': "\u23DC",
        'par': "\u2225",
        'para': '\xB6',
        'parallel': "\u2225",
        'parsim': "\u2AF3",
        'parsl': "\u2AFD",
        'part': "\u2202",
        'PartialD': "\u2202",
        'pcy': "\u043F",
        'Pcy': "\u041F",
        'percnt': '%',
        'period': '.',
        'permil': "\u2030",
        'perp': "\u22A5",
        'pertenk': "\u2031",
        'pfr': "\uD835\uDD2D",
        'Pfr': "\uD835\uDD13",
        'phi': "\u03C6",
        'Phi': "\u03A6",
        'phiv': "\u03D5",
        'phmmat': "\u2133",
        'phone': "\u260E",
        'pi': "\u03C0",
        'Pi': "\u03A0",
        'pitchfork': "\u22D4",
        'piv': "\u03D6",
        'planck': "\u210F",
        'planckh': "\u210E",
        'plankv': "\u210F",
        'plus': '+',
        'plusacir': "\u2A23",
        'plusb': "\u229E",
        'pluscir': "\u2A22",
        'plusdo': "\u2214",
        'plusdu': "\u2A25",
        'pluse': "\u2A72",
        'PlusMinus': '\xB1',
        'plusmn': '\xB1',
        'plussim': "\u2A26",
        'plustwo': "\u2A27",
        'pm': '\xB1',
        'Poincareplane': "\u210C",
        'pointint': "\u2A15",
        'popf': "\uD835\uDD61",
        'Popf': "\u2119",
        'pound': '\xA3',
        'pr': "\u227A",
        'Pr': "\u2ABB",
        'prap': "\u2AB7",
        'prcue': "\u227C",
        'pre': "\u2AAF",
        'prE': "\u2AB3",
        'prec': "\u227A",
        'precapprox': "\u2AB7",
        'preccurlyeq': "\u227C",
        'Precedes': "\u227A",
        'PrecedesEqual': "\u2AAF",
        'PrecedesSlantEqual': "\u227C",
        'PrecedesTilde': "\u227E",
        'preceq': "\u2AAF",
        'precnapprox': "\u2AB9",
        'precneqq': "\u2AB5",
        'precnsim': "\u22E8",
        'precsim': "\u227E",
        'prime': "\u2032",
        'Prime': "\u2033",
        'primes': "\u2119",
        'prnap': "\u2AB9",
        'prnE': "\u2AB5",
        'prnsim': "\u22E8",
        'prod': "\u220F",
        'Product': "\u220F",
        'profalar': "\u232E",
        'profline': "\u2312",
        'profsurf': "\u2313",
        'prop': "\u221D",
        'Proportion': "\u2237",
        'Proportional': "\u221D",
        'propto': "\u221D",
        'prsim': "\u227E",
        'prurel': "\u22B0",
        'pscr': "\uD835\uDCC5",
        'Pscr': "\uD835\uDCAB",
        'psi': "\u03C8",
        'Psi': "\u03A8",
        'puncsp': "\u2008",
        'qfr': "\uD835\uDD2E",
        'Qfr': "\uD835\uDD14",
        'qint': "\u2A0C",
        'qopf': "\uD835\uDD62",
        'Qopf': "\u211A",
        'qprime': "\u2057",
        'qscr': "\uD835\uDCC6",
        'Qscr': "\uD835\uDCAC",
        'quaternions': "\u210D",
        'quatint': "\u2A16",
        'quest': '?',
        'questeq': "\u225F",
        'quot': '"',
        'QUOT': '"',
        'rAarr': "\u21DB",
        'race': "\u223D\u0331",
        'racute': "\u0155",
        'Racute': "\u0154",
        'radic': "\u221A",
        'raemptyv': "\u29B3",
        'rang': "\u27E9",
        'Rang': "\u27EB",
        'rangd': "\u2992",
        'range': "\u29A5",
        'rangle': "\u27E9",
        'raquo': '\xBB',
        'rarr': "\u2192",
        'rArr': "\u21D2",
        'Rarr': "\u21A0",
        'rarrap': "\u2975",
        'rarrb': "\u21E5",
        'rarrbfs': "\u2920",
        'rarrc': "\u2933",
        'rarrfs': "\u291E",
        'rarrhk': "\u21AA",
        'rarrlp': "\u21AC",
        'rarrpl': "\u2945",
        'rarrsim': "\u2974",
        'rarrtl': "\u21A3",
        'Rarrtl': "\u2916",
        'rarrw': "\u219D",
        'ratail': "\u291A",
        'rAtail': "\u291C",
        'ratio': "\u2236",
        'rationals': "\u211A",
        'rbarr': "\u290D",
        'rBarr': "\u290F",
        'RBarr': "\u2910",
        'rbbrk': "\u2773",
        'rbrace': '}',
        'rbrack': ']',
        'rbrke': "\u298C",
        'rbrksld': "\u298E",
        'rbrkslu': "\u2990",
        'rcaron': "\u0159",
        'Rcaron': "\u0158",
        'rcedil': "\u0157",
        'Rcedil': "\u0156",
        'rceil': "\u2309",
        'rcub': '}',
        'rcy': "\u0440",
        'Rcy': "\u0420",
        'rdca': "\u2937",
        'rdldhar': "\u2969",
        'rdquo': "\u201D",
        'rdquor': "\u201D",
        'rdsh': "\u21B3",
        'Re': "\u211C",
        'real': "\u211C",
        'realine': "\u211B",
        'realpart': "\u211C",
        'reals': "\u211D",
        'rect': "\u25AD",
        'reg': '\xAE',
        'REG': '\xAE',
        'ReverseElement': "\u220B",
        'ReverseEquilibrium': "\u21CB",
        'ReverseUpEquilibrium': "\u296F",
        'rfisht': "\u297D",
        'rfloor': "\u230B",
        'rfr': "\uD835\uDD2F",
        'Rfr': "\u211C",
        'rHar': "\u2964",
        'rhard': "\u21C1",
        'rharu': "\u21C0",
        'rharul': "\u296C",
        'rho': "\u03C1",
        'Rho': "\u03A1",
        'rhov': "\u03F1",
        'RightAngleBracket': "\u27E9",
        'rightarrow': "\u2192",
        'Rightarrow': "\u21D2",
        'RightArrow': "\u2192",
        'RightArrowBar': "\u21E5",
        'RightArrowLeftArrow': "\u21C4",
        'rightarrowtail': "\u21A3",
        'RightCeiling': "\u2309",
        'RightDoubleBracket': "\u27E7",
        'RightDownTeeVector': "\u295D",
        'RightDownVector': "\u21C2",
        'RightDownVectorBar': "\u2955",
        'RightFloor': "\u230B",
        'rightharpoondown': "\u21C1",
        'rightharpoonup': "\u21C0",
        'rightleftarrows': "\u21C4",
        'rightleftharpoons': "\u21CC",
        'rightrightarrows': "\u21C9",
        'rightsquigarrow': "\u219D",
        'RightTee': "\u22A2",
        'RightTeeArrow': "\u21A6",
        'RightTeeVector': "\u295B",
        'rightthreetimes': "\u22CC",
        'RightTriangle': "\u22B3",
        'RightTriangleBar': "\u29D0",
        'RightTriangleEqual': "\u22B5",
        'RightUpDownVector': "\u294F",
        'RightUpTeeVector': "\u295C",
        'RightUpVector': "\u21BE",
        'RightUpVectorBar': "\u2954",
        'RightVector': "\u21C0",
        'RightVectorBar': "\u2953",
        'ring': "\u02DA",
        'risingdotseq': "\u2253",
        'rlarr': "\u21C4",
        'rlhar': "\u21CC",
        'rlm': "\u200F",
        'rmoust': "\u23B1",
        'rmoustache': "\u23B1",
        'rnmid': "\u2AEE",
        'roang': "\u27ED",
        'roarr': "\u21FE",
        'robrk': "\u27E7",
        'ropar': "\u2986",
        'ropf': "\uD835\uDD63",
        'Ropf': "\u211D",
        'roplus': "\u2A2E",
        'rotimes': "\u2A35",
        'RoundImplies': "\u2970",
        'rpar': ')',
        'rpargt': "\u2994",
        'rppolint': "\u2A12",
        'rrarr': "\u21C9",
        'Rrightarrow': "\u21DB",
        'rsaquo': "\u203A",
        'rscr': "\uD835\uDCC7",
        'Rscr': "\u211B",
        'rsh': "\u21B1",
        'Rsh': "\u21B1",
        'rsqb': ']',
        'rsquo': "\u2019",
        'rsquor': "\u2019",
        'rthree': "\u22CC",
        'rtimes': "\u22CA",
        'rtri': "\u25B9",
        'rtrie': "\u22B5",
        'rtrif': "\u25B8",
        'rtriltri': "\u29CE",
        'RuleDelayed': "\u29F4",
        'ruluhar': "\u2968",
        'rx': "\u211E",
        'sacute': "\u015B",
        'Sacute': "\u015A",
        'sbquo': "\u201A",
        'sc': "\u227B",
        'Sc': "\u2ABC",
        'scap': "\u2AB8",
        'scaron': "\u0161",
        'Scaron': "\u0160",
        'sccue': "\u227D",
        'sce': "\u2AB0",
        'scE': "\u2AB4",
        'scedil': "\u015F",
        'Scedil': "\u015E",
        'scirc': "\u015D",
        'Scirc': "\u015C",
        'scnap': "\u2ABA",
        'scnE': "\u2AB6",
        'scnsim': "\u22E9",
        'scpolint': "\u2A13",
        'scsim': "\u227F",
        'scy': "\u0441",
        'Scy': "\u0421",
        'sdot': "\u22C5",
        'sdotb': "\u22A1",
        'sdote': "\u2A66",
        'searhk': "\u2925",
        'searr': "\u2198",
        'seArr': "\u21D8",
        'searrow': "\u2198",
        'sect': '\xA7',
        'semi': ';',
        'seswar': "\u2929",
        'setminus': "\u2216",
        'setmn': "\u2216",
        'sext': "\u2736",
        'sfr': "\uD835\uDD30",
        'Sfr': "\uD835\uDD16",
        'sfrown': "\u2322",
        'sharp': "\u266F",
        'shchcy': "\u0449",
        'SHCHcy': "\u0429",
        'shcy': "\u0448",
        'SHcy': "\u0428",
        'ShortDownArrow': "\u2193",
        'ShortLeftArrow': "\u2190",
        'shortmid': "\u2223",
        'shortparallel': "\u2225",
        'ShortRightArrow': "\u2192",
        'ShortUpArrow': "\u2191",
        'shy': '\xAD',
        'sigma': "\u03C3",
        'Sigma': "\u03A3",
        'sigmaf': "\u03C2",
        'sigmav': "\u03C2",
        'sim': "\u223C",
        'simdot': "\u2A6A",
        'sime': "\u2243",
        'simeq': "\u2243",
        'simg': "\u2A9E",
        'simgE': "\u2AA0",
        'siml': "\u2A9D",
        'simlE': "\u2A9F",
        'simne': "\u2246",
        'simplus': "\u2A24",
        'simrarr': "\u2972",
        'slarr': "\u2190",
        'SmallCircle': "\u2218",
        'smallsetminus': "\u2216",
        'smashp': "\u2A33",
        'smeparsl': "\u29E4",
        'smid': "\u2223",
        'smile': "\u2323",
        'smt': "\u2AAA",
        'smte': "\u2AAC",
        'smtes': "\u2AAC\uFE00",
        'softcy': "\u044C",
        'SOFTcy': "\u042C",
        'sol': '/',
        'solb': "\u29C4",
        'solbar': "\u233F",
        'sopf': "\uD835\uDD64",
        'Sopf': "\uD835\uDD4A",
        'spades': "\u2660",
        'spadesuit': "\u2660",
        'spar': "\u2225",
        'sqcap': "\u2293",
        'sqcaps': "\u2293\uFE00",
        'sqcup': "\u2294",
        'sqcups': "\u2294\uFE00",
        'Sqrt': "\u221A",
        'sqsub': "\u228F",
        'sqsube': "\u2291",
        'sqsubset': "\u228F",
        'sqsubseteq': "\u2291",
        'sqsup': "\u2290",
        'sqsupe': "\u2292",
        'sqsupset': "\u2290",
        'sqsupseteq': "\u2292",
        'squ': "\u25A1",
        'square': "\u25A1",
        'Square': "\u25A1",
        'SquareIntersection': "\u2293",
        'SquareSubset': "\u228F",
        'SquareSubsetEqual': "\u2291",
        'SquareSuperset': "\u2290",
        'SquareSupersetEqual': "\u2292",
        'SquareUnion': "\u2294",
        'squarf': "\u25AA",
        'squf': "\u25AA",
        'srarr': "\u2192",
        'sscr': "\uD835\uDCC8",
        'Sscr': "\uD835\uDCAE",
        'ssetmn': "\u2216",
        'ssmile': "\u2323",
        'sstarf': "\u22C6",
        'star': "\u2606",
        'Star': "\u22C6",
        'starf': "\u2605",
        'straightepsilon': "\u03F5",
        'straightphi': "\u03D5",
        'strns': '\xAF',
        'sub': "\u2282",
        'Sub': "\u22D0",
        'subdot': "\u2ABD",
        'sube': "\u2286",
        'subE': "\u2AC5",
        'subedot': "\u2AC3",
        'submult': "\u2AC1",
        'subne': "\u228A",
        'subnE': "\u2ACB",
        'subplus': "\u2ABF",
        'subrarr': "\u2979",
        'subset': "\u2282",
        'Subset': "\u22D0",
        'subseteq': "\u2286",
        'subseteqq': "\u2AC5",
        'SubsetEqual': "\u2286",
        'subsetneq': "\u228A",
        'subsetneqq': "\u2ACB",
        'subsim': "\u2AC7",
        'subsub': "\u2AD5",
        'subsup': "\u2AD3",
        'succ': "\u227B",
        'succapprox': "\u2AB8",
        'succcurlyeq': "\u227D",
        'Succeeds': "\u227B",
        'SucceedsEqual': "\u2AB0",
        'SucceedsSlantEqual': "\u227D",
        'SucceedsTilde': "\u227F",
        'succeq': "\u2AB0",
        'succnapprox': "\u2ABA",
        'succneqq': "\u2AB6",
        'succnsim': "\u22E9",
        'succsim': "\u227F",
        'SuchThat': "\u220B",
        'sum': "\u2211",
        'Sum': "\u2211",
        'sung': "\u266A",
        'sup': "\u2283",
        'Sup': "\u22D1",
        'sup1': '\xB9',
        'sup2': '\xB2',
        'sup3': '\xB3',
        'supdot': "\u2ABE",
        'supdsub': "\u2AD8",
        'supe': "\u2287",
        'supE': "\u2AC6",
        'supedot': "\u2AC4",
        'Superset': "\u2283",
        'SupersetEqual': "\u2287",
        'suphsol': "\u27C9",
        'suphsub': "\u2AD7",
        'suplarr': "\u297B",
        'supmult': "\u2AC2",
        'supne': "\u228B",
        'supnE': "\u2ACC",
        'supplus': "\u2AC0",
        'supset': "\u2283",
        'Supset': "\u22D1",
        'supseteq': "\u2287",
        'supseteqq': "\u2AC6",
        'supsetneq': "\u228B",
        'supsetneqq': "\u2ACC",
        'supsim': "\u2AC8",
        'supsub': "\u2AD4",
        'supsup': "\u2AD6",
        'swarhk': "\u2926",
        'swarr': "\u2199",
        'swArr': "\u21D9",
        'swarrow': "\u2199",
        'swnwar': "\u292A",
        'szlig': '\xDF',
        'Tab': '\t',
        'target': "\u2316",
        'tau': "\u03C4",
        'Tau': "\u03A4",
        'tbrk': "\u23B4",
        'tcaron': "\u0165",
        'Tcaron': "\u0164",
        'tcedil': "\u0163",
        'Tcedil': "\u0162",
        'tcy': "\u0442",
        'Tcy': "\u0422",
        'tdot': "\u20DB",
        'telrec': "\u2315",
        'tfr': "\uD835\uDD31",
        'Tfr': "\uD835\uDD17",
        'there4': "\u2234",
        'therefore': "\u2234",
        'Therefore': "\u2234",
        'theta': "\u03B8",
        'Theta': "\u0398",
        'thetasym': "\u03D1",
        'thetav': "\u03D1",
        'thickapprox': "\u2248",
        'thicksim': "\u223C",
        'ThickSpace': "\u205F\u200A",
        'thinsp': "\u2009",
        'ThinSpace': "\u2009",
        'thkap': "\u2248",
        'thksim': "\u223C",
        'thorn': '\xFE',
        'THORN': '\xDE',
        'tilde': "\u02DC",
        'Tilde': "\u223C",
        'TildeEqual': "\u2243",
        'TildeFullEqual': "\u2245",
        'TildeTilde': "\u2248",
        'times': '\xD7',
        'timesb': "\u22A0",
        'timesbar': "\u2A31",
        'timesd': "\u2A30",
        'tint': "\u222D",
        'toea': "\u2928",
        'top': "\u22A4",
        'topbot': "\u2336",
        'topcir': "\u2AF1",
        'topf': "\uD835\uDD65",
        'Topf': "\uD835\uDD4B",
        'topfork': "\u2ADA",
        'tosa': "\u2929",
        'tprime': "\u2034",
        'trade': "\u2122",
        'TRADE': "\u2122",
        'triangle': "\u25B5",
        'triangledown': "\u25BF",
        'triangleleft': "\u25C3",
        'trianglelefteq': "\u22B4",
        'triangleq': "\u225C",
        'triangleright': "\u25B9",
        'trianglerighteq': "\u22B5",
        'tridot': "\u25EC",
        'trie': "\u225C",
        'triminus': "\u2A3A",
        'TripleDot': "\u20DB",
        'triplus': "\u2A39",
        'trisb': "\u29CD",
        'tritime': "\u2A3B",
        'trpezium': "\u23E2",
        'tscr': "\uD835\uDCC9",
        'Tscr': "\uD835\uDCAF",
        'tscy': "\u0446",
        'TScy': "\u0426",
        'tshcy': "\u045B",
        'TSHcy': "\u040B",
        'tstrok': "\u0167",
        'Tstrok': "\u0166",
        'twixt': "\u226C",
        'twoheadleftarrow': "\u219E",
        'twoheadrightarrow': "\u21A0",
        'uacute': '\xFA',
        'Uacute': '\xDA',
        'uarr': "\u2191",
        'uArr': "\u21D1",
        'Uarr': "\u219F",
        'Uarrocir': "\u2949",
        'ubrcy': "\u045E",
        'Ubrcy': "\u040E",
        'ubreve': "\u016D",
        'Ubreve': "\u016C",
        'ucirc': '\xFB',
        'Ucirc': '\xDB',
        'ucy': "\u0443",
        'Ucy': "\u0423",
        'udarr': "\u21C5",
        'udblac': "\u0171",
        'Udblac': "\u0170",
        'udhar': "\u296E",
        'ufisht': "\u297E",
        'ufr': "\uD835\uDD32",
        'Ufr': "\uD835\uDD18",
        'ugrave': '\xF9',
        'Ugrave': '\xD9',
        'uHar': "\u2963",
        'uharl': "\u21BF",
        'uharr': "\u21BE",
        'uhblk': "\u2580",
        'ulcorn': "\u231C",
        'ulcorner': "\u231C",
        'ulcrop': "\u230F",
        'ultri': "\u25F8",
        'umacr': "\u016B",
        'Umacr': "\u016A",
        'uml': '\xA8',
        'UnderBar': '_',
        'UnderBrace': "\u23DF",
        'UnderBracket': "\u23B5",
        'UnderParenthesis': "\u23DD",
        'Union': "\u22C3",
        'UnionPlus': "\u228E",
        'uogon': "\u0173",
        'Uogon': "\u0172",
        'uopf': "\uD835\uDD66",
        'Uopf': "\uD835\uDD4C",
        'uparrow': "\u2191",
        'Uparrow': "\u21D1",
        'UpArrow': "\u2191",
        'UpArrowBar': "\u2912",
        'UpArrowDownArrow': "\u21C5",
        'updownarrow': "\u2195",
        'Updownarrow': "\u21D5",
        'UpDownArrow': "\u2195",
        'UpEquilibrium': "\u296E",
        'upharpoonleft': "\u21BF",
        'upharpoonright': "\u21BE",
        'uplus': "\u228E",
        'UpperLeftArrow': "\u2196",
        'UpperRightArrow': "\u2197",
        'upsi': "\u03C5",
        'Upsi': "\u03D2",
        'upsih': "\u03D2",
        'upsilon': "\u03C5",
        'Upsilon': "\u03A5",
        'UpTee': "\u22A5",
        'UpTeeArrow': "\u21A5",
        'upuparrows': "\u21C8",
        'urcorn': "\u231D",
        'urcorner': "\u231D",
        'urcrop': "\u230E",
        'uring': "\u016F",
        'Uring': "\u016E",
        'urtri': "\u25F9",
        'uscr': "\uD835\uDCCA",
        'Uscr': "\uD835\uDCB0",
        'utdot': "\u22F0",
        'utilde': "\u0169",
        'Utilde': "\u0168",
        'utri': "\u25B5",
        'utrif': "\u25B4",
        'uuarr': "\u21C8",
        'uuml': '\xFC',
        'Uuml': '\xDC',
        'uwangle': "\u29A7",
        'vangrt': "\u299C",
        'varepsilon': "\u03F5",
        'varkappa': "\u03F0",
        'varnothing': "\u2205",
        'varphi': "\u03D5",
        'varpi': "\u03D6",
        'varpropto': "\u221D",
        'varr': "\u2195",
        'vArr': "\u21D5",
        'varrho': "\u03F1",
        'varsigma': "\u03C2",
        'varsubsetneq': "\u228A\uFE00",
        'varsubsetneqq': "\u2ACB\uFE00",
        'varsupsetneq': "\u228B\uFE00",
        'varsupsetneqq': "\u2ACC\uFE00",
        'vartheta': "\u03D1",
        'vartriangleleft': "\u22B2",
        'vartriangleright': "\u22B3",
        'vBar': "\u2AE8",
        'Vbar': "\u2AEB",
        'vBarv': "\u2AE9",
        'vcy': "\u0432",
        'Vcy': "\u0412",
        'vdash': "\u22A2",
        'vDash': "\u22A8",
        'Vdash': "\u22A9",
        'VDash': "\u22AB",
        'Vdashl': "\u2AE6",
        'vee': "\u2228",
        'Vee': "\u22C1",
        'veebar': "\u22BB",
        'veeeq': "\u225A",
        'vellip': "\u22EE",
        'verbar': '|',
        'Verbar': "\u2016",
        'vert': '|',
        'Vert': "\u2016",
        'VerticalBar': "\u2223",
        'VerticalLine': '|',
        'VerticalSeparator': "\u2758",
        'VerticalTilde': "\u2240",
        'VeryThinSpace': "\u200A",
        'vfr': "\uD835\uDD33",
        'Vfr': "\uD835\uDD19",
        'vltri': "\u22B2",
        'vnsub': "\u2282\u20D2",
        'vnsup': "\u2283\u20D2",
        'vopf': "\uD835\uDD67",
        'Vopf': "\uD835\uDD4D",
        'vprop': "\u221D",
        'vrtri': "\u22B3",
        'vscr': "\uD835\uDCCB",
        'Vscr': "\uD835\uDCB1",
        'vsubne': "\u228A\uFE00",
        'vsubnE': "\u2ACB\uFE00",
        'vsupne': "\u228B\uFE00",
        'vsupnE': "\u2ACC\uFE00",
        'Vvdash': "\u22AA",
        'vzigzag': "\u299A",
        'wcirc': "\u0175",
        'Wcirc': "\u0174",
        'wedbar': "\u2A5F",
        'wedge': "\u2227",
        'Wedge': "\u22C0",
        'wedgeq': "\u2259",
        'weierp': "\u2118",
        'wfr': "\uD835\uDD34",
        'Wfr': "\uD835\uDD1A",
        'wopf': "\uD835\uDD68",
        'Wopf': "\uD835\uDD4E",
        'wp': "\u2118",
        'wr': "\u2240",
        'wreath': "\u2240",
        'wscr': "\uD835\uDCCC",
        'Wscr': "\uD835\uDCB2",
        'xcap': "\u22C2",
        'xcirc': "\u25EF",
        'xcup': "\u22C3",
        'xdtri': "\u25BD",
        'xfr': "\uD835\uDD35",
        'Xfr': "\uD835\uDD1B",
        'xharr': "\u27F7",
        'xhArr': "\u27FA",
        'xi': "\u03BE",
        'Xi': "\u039E",
        'xlarr': "\u27F5",
        'xlArr': "\u27F8",
        'xmap': "\u27FC",
        'xnis': "\u22FB",
        'xodot': "\u2A00",
        'xopf': "\uD835\uDD69",
        'Xopf': "\uD835\uDD4F",
        'xoplus': "\u2A01",
        'xotime': "\u2A02",
        'xrarr': "\u27F6",
        'xrArr': "\u27F9",
        'xscr': "\uD835\uDCCD",
        'Xscr': "\uD835\uDCB3",
        'xsqcup': "\u2A06",
        'xuplus': "\u2A04",
        'xutri': "\u25B3",
        'xvee': "\u22C1",
        'xwedge': "\u22C0",
        'yacute': '\xFD',
        'Yacute': '\xDD',
        'yacy': "\u044F",
        'YAcy': "\u042F",
        'ycirc': "\u0177",
        'Ycirc': "\u0176",
        'ycy': "\u044B",
        'Ycy': "\u042B",
        'yen': '\xA5',
        'yfr': "\uD835\uDD36",
        'Yfr': "\uD835\uDD1C",
        'yicy': "\u0457",
        'YIcy': "\u0407",
        'yopf': "\uD835\uDD6A",
        'Yopf': "\uD835\uDD50",
        'yscr': "\uD835\uDCCE",
        'Yscr': "\uD835\uDCB4",
        'yucy': "\u044E",
        'YUcy': "\u042E",
        'yuml': '\xFF',
        'Yuml': "\u0178",
        'zacute': "\u017A",
        'Zacute': "\u0179",
        'zcaron': "\u017E",
        'Zcaron': "\u017D",
        'zcy': "\u0437",
        'Zcy': "\u0417",
        'zdot': "\u017C",
        'Zdot': "\u017B",
        'zeetrf': "\u2128",
        'ZeroWidthSpace': "\u200B",
        'zeta': "\u03B6",
        'Zeta': "\u0396",
        'zfr': "\uD835\uDD37",
        'Zfr': "\u2128",
        'zhcy': "\u0436",
        'ZHcy': "\u0416",
        'zigrarr': "\u21DD",
        'zopf': "\uD835\uDD6B",
        'Zopf': "\u2124",
        'zscr': "\uD835\uDCCF",
        'Zscr': "\uD835\uDCB5",
        'zwj': "\u200D",
        'zwnj': "\u200C"
      };
      var decodeMapLegacy = {
        'aacute': '\xE1',
        'Aacute': '\xC1',
        'acirc': '\xE2',
        'Acirc': '\xC2',
        'acute': '\xB4',
        'aelig': '\xE6',
        'AElig': '\xC6',
        'agrave': '\xE0',
        'Agrave': '\xC0',
        'amp': '&',
        'AMP': '&',
        'aring': '\xE5',
        'Aring': '\xC5',
        'atilde': '\xE3',
        'Atilde': '\xC3',
        'auml': '\xE4',
        'Auml': '\xC4',
        'brvbar': '\xA6',
        'ccedil': '\xE7',
        'Ccedil': '\xC7',
        'cedil': '\xB8',
        'cent': '\xA2',
        'copy': '\xA9',
        'COPY': '\xA9',
        'curren': '\xA4',
        'deg': '\xB0',
        'divide': '\xF7',
        'eacute': '\xE9',
        'Eacute': '\xC9',
        'ecirc': '\xEA',
        'Ecirc': '\xCA',
        'egrave': '\xE8',
        'Egrave': '\xC8',
        'eth': '\xF0',
        'ETH': '\xD0',
        'euml': '\xEB',
        'Euml': '\xCB',
        'frac12': '\xBD',
        'frac14': '\xBC',
        'frac34': '\xBE',
        'gt': '>',
        'GT': '>',
        'iacute': '\xED',
        'Iacute': '\xCD',
        'icirc': '\xEE',
        'Icirc': '\xCE',
        'iexcl': '\xA1',
        'igrave': '\xEC',
        'Igrave': '\xCC',
        'iquest': '\xBF',
        'iuml': '\xEF',
        'Iuml': '\xCF',
        'laquo': '\xAB',
        'lt': '<',
        'LT': '<',
        'macr': '\xAF',
        'micro': '\xB5',
        'middot': '\xB7',
        'nbsp': '\xA0',
        'not': '\xAC',
        'ntilde': '\xF1',
        'Ntilde': '\xD1',
        'oacute': '\xF3',
        'Oacute': '\xD3',
        'ocirc': '\xF4',
        'Ocirc': '\xD4',
        'ograve': '\xF2',
        'Ograve': '\xD2',
        'ordf': '\xAA',
        'ordm': '\xBA',
        'oslash': '\xF8',
        'Oslash': '\xD8',
        'otilde': '\xF5',
        'Otilde': '\xD5',
        'ouml': '\xF6',
        'Ouml': '\xD6',
        'para': '\xB6',
        'plusmn': '\xB1',
        'pound': '\xA3',
        'quot': '"',
        'QUOT': '"',
        'raquo': '\xBB',
        'reg': '\xAE',
        'REG': '\xAE',
        'sect': '\xA7',
        'shy': '\xAD',
        'sup1': '\xB9',
        'sup2': '\xB2',
        'sup3': '\xB3',
        'szlig': '\xDF',
        'thorn': '\xFE',
        'THORN': '\xDE',
        'times': '\xD7',
        'uacute': '\xFA',
        'Uacute': '\xDA',
        'ucirc': '\xFB',
        'Ucirc': '\xDB',
        'ugrave': '\xF9',
        'Ugrave': '\xD9',
        'uml': '\xA8',
        'uuml': '\xFC',
        'Uuml': '\xDC',
        'yacute': '\xFD',
        'Yacute': '\xDD',
        'yen': '\xA5',
        'yuml': '\xFF'
      };
      var decodeMapNumeric = {
        '0': "\uFFFD",
        '128': "\u20AC",
        '130': "\u201A",
        '131': "\u0192",
        '132': "\u201E",
        '133': "\u2026",
        '134': "\u2020",
        '135': "\u2021",
        '136': "\u02C6",
        '137': "\u2030",
        '138': "\u0160",
        '139': "\u2039",
        '140': "\u0152",
        '142': "\u017D",
        '145': "\u2018",
        '146': "\u2019",
        '147': "\u201C",
        '148': "\u201D",
        '149': "\u2022",
        '150': "\u2013",
        '151': "\u2014",
        '152': "\u02DC",
        '153': "\u2122",
        '154': "\u0161",
        '155': "\u203A",
        '156': "\u0153",
        '158': "\u017E",
        '159': "\u0178"
      };
      var invalidReferenceCodePoints = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 64976, 64977, 64978, 64979, 64980, 64981, 64982, 64983, 64984, 64985, 64986, 64987, 64988, 64989, 64990, 64991, 64992, 64993, 64994, 64995, 64996, 64997, 64998, 64999, 65000, 65001, 65002, 65003, 65004, 65005, 65006, 65007, 65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];
      /*--------------------------------------------------------------------------*/

      var stringFromCharCode = String.fromCharCode;
      var object = {};
      var hasOwnProperty = object.hasOwnProperty;

      var has = function has(object, propertyName) {
        return hasOwnProperty.call(object, propertyName);
      };

      var contains = function contains(array, value) {
        var index = -1;
        var length = array.length;

        while (++index < length) {
          if (array[index] == value) {
            return true;
          }
        }

        return false;
      };

      var merge = function merge(options, defaults) {
        if (!options) {
          return defaults;
        }

        var result = {};
        var key;

        for (key in defaults) {
          // A `hasOwnProperty` check is not needed here, since only recognized
          // option names are used anyway. Any others are ignored.
          result[key] = has(options, key) ? options[key] : defaults[key];
        }

        return result;
      }; // Modified version of `ucs2encode`; see https://mths.be/punycode.


      var codePointToSymbol = function codePointToSymbol(codePoint, strict) {
        var output = '';

        if (codePoint >= 0xD800 && codePoint <= 0xDFFF || codePoint > 0x10FFFF) {
          // See issue #4:
          // “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
          // greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
          // REPLACEMENT CHARACTER.”
          if (strict) {
            parseError('character reference outside the permissible Unicode range');
          }

          return "\uFFFD";
        }

        if (has(decodeMapNumeric, codePoint)) {
          if (strict) {
            parseError('disallowed character reference');
          }

          return decodeMapNumeric[codePoint];
        }

        if (strict && contains(invalidReferenceCodePoints, codePoint)) {
          parseError('disallowed character reference');
        }

        if (codePoint > 0xFFFF) {
          codePoint -= 0x10000;
          output += stringFromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
          codePoint = 0xDC00 | codePoint & 0x3FF;
        }

        output += stringFromCharCode(codePoint);
        return output;
      };

      var hexEscape = function hexEscape(codePoint) {
        return '&#x' + codePoint.toString(16).toUpperCase() + ';';
      };

      var decEscape = function decEscape(codePoint) {
        return '&#' + codePoint + ';';
      };

      var parseError = function parseError(message) {
        throw Error('Parse error: ' + message);
      };
      /*--------------------------------------------------------------------------*/


      var encode = function encode(string, options) {
        options = merge(options, encode.options);
        var strict = options.strict;

        if (strict && regexInvalidRawCodePoint.test(string)) {
          parseError('forbidden code point');
        }

        var encodeEverything = options.encodeEverything;
        var useNamedReferences = options.useNamedReferences;
        var allowUnsafeSymbols = options.allowUnsafeSymbols;
        var escapeCodePoint = options.decimal ? decEscape : hexEscape;

        var escapeBmpSymbol = function escapeBmpSymbol(symbol) {
          return escapeCodePoint(symbol.charCodeAt(0));
        };

        if (encodeEverything) {
          // Encode ASCII symbols.
          string = string.replace(regexAsciiWhitelist, function (symbol) {
            // Use named references if requested & possible.
            if (useNamedReferences && has(encodeMap, symbol)) {
              return '&' + encodeMap[symbol] + ';';
            }

            return escapeBmpSymbol(symbol);
          }); // Shorten a few escapes that represent two symbols, of which at least one
          // is within the ASCII range.

          if (useNamedReferences) {
            string = string.replace(/&gt;\u20D2/g, '&nvgt;').replace(/&lt;\u20D2/g, '&nvlt;').replace(/&#x66;&#x6A;/g, '&fjlig;');
          } // Encode non-ASCII symbols.


          if (useNamedReferences) {
            // Encode non-ASCII symbols that can be replaced with a named reference.
            string = string.replace(regexEncodeNonAscii, function (string) {
              // Note: there is no need to check `has(encodeMap, string)` here.
              return '&' + encodeMap[string] + ';';
            });
          } // Note: any remaining non-ASCII symbols are handled outside of the `if`.

        } else if (useNamedReferences) {
          // Apply named character references.
          // Encode `<>"'&` using named character references.
          if (!allowUnsafeSymbols) {
            string = string.replace(regexEscape, function (string) {
              return '&' + encodeMap[string] + ';'; // no need to check `has()` here
            });
          } // Shorten escapes that represent two symbols, of which at least one is
          // `<>"'&`.


          string = string.replace(/&gt;\u20D2/g, '&nvgt;').replace(/&lt;\u20D2/g, '&nvlt;'); // Encode non-ASCII symbols that can be replaced with a named reference.

          string = string.replace(regexEncodeNonAscii, function (string) {
            // Note: there is no need to check `has(encodeMap, string)` here.
            return '&' + encodeMap[string] + ';';
          });
        } else if (!allowUnsafeSymbols) {
          // Encode `<>"'&` using hexadecimal escapes, now that they’re not handled
          // using named character references.
          string = string.replace(regexEscape, escapeBmpSymbol);
        }

        return string // Encode astral symbols.
        .replace(regexAstralSymbols, function ($0) {
          // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          var high = $0.charCodeAt(0);
          var low = $0.charCodeAt(1);
          var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
          return escapeCodePoint(codePoint);
        }) // Encode any remaining BMP symbols that are not printable ASCII symbols
        // using a hexadecimal escape.
        .replace(regexBmpWhitelist, escapeBmpSymbol);
      }; // Expose default options (so they can be overridden globally).


      encode.options = {
        'allowUnsafeSymbols': false,
        'encodeEverything': false,
        'strict': false,
        'useNamedReferences': false,
        'decimal': false
      };

      var decode = function decode(html, options) {
        options = merge(options, decode.options);
        var strict = options.strict;

        if (strict && regexInvalidEntity.test(html)) {
          parseError('malformed character reference');
        }

        return html.replace(regexDecode, function ($0, $1, $2, $3, $4, $5, $6, $7, $8) {
          var codePoint;
          var semicolon;
          var decDigits;
          var hexDigits;
          var reference;
          var next;

          if ($1) {
            reference = $1; // Note: there is no need to check `has(decodeMap, reference)`.

            return decodeMap[reference];
          }

          if ($2) {
            // Decode named character references without trailing `;`, e.g. `&amp`.
            // This is only a parse error if it gets converted to `&`, or if it is
            // followed by `=` in an attribute context.
            reference = $2;
            next = $3;

            if (next && options.isAttributeValue) {
              if (strict && next == '=') {
                parseError('`&` did not start a character reference');
              }

              return $0;
            } else {
              if (strict) {
                parseError('named character reference was not terminated by a semicolon');
              } // Note: there is no need to check `has(decodeMapLegacy, reference)`.


              return decodeMapLegacy[reference] + (next || '');
            }
          }

          if ($4) {
            // Decode decimal escapes, e.g. `&#119558;`.
            decDigits = $4;
            semicolon = $5;

            if (strict && !semicolon) {
              parseError('character reference was not terminated by a semicolon');
            }

            codePoint = parseInt(decDigits, 10);
            return codePointToSymbol(codePoint, strict);
          }

          if ($6) {
            // Decode hexadecimal escapes, e.g. `&#x1D306;`.
            hexDigits = $6;
            semicolon = $7;

            if (strict && !semicolon) {
              parseError('character reference was not terminated by a semicolon');
            }

            codePoint = parseInt(hexDigits, 16);
            return codePointToSymbol(codePoint, strict);
          } // If we’re still here, `if ($7)` is implied; it’s an ambiguous
          // ampersand for sure. https://mths.be/notes/ambiguous-ampersands


          if (strict) {
            parseError('named character reference was not terminated by a semicolon');
          }

          return $0;
        });
      }; // Expose default options (so they can be overridden globally).


      decode.options = {
        'isAttributeValue': false,
        'strict': false
      };

      var escape = function escape(string) {
        return string.replace(regexEscape, function ($0) {
          // Note: there is no need to check `has(escapeMap, $0)` here.
          return escapeMap[$0];
        });
      };
      /*--------------------------------------------------------------------------*/


      var he = {
        'version': '1.2.0',
        'encode': encode,
        'decode': decode,
        'escape': escape,
        'unescape': decode
      }; // Some AMD build optimizers, like r.js, check for specific condition patterns
      // like the following:

      if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
          // in Node.js, io.js, or RingoJS v0.8.0+
          freeModule.exports = he;
        } else {
          // in Narwhal or RingoJS v0.7.0-
          for (var key in he) {
            has(he, key) && (freeExports[key] = he[key]);
          }
        }
      } else {
        // in Rhino or a web browser
        root.he = he;
      }
    })(commonjsGlobal);
  });

  function existy(x) {
    return x != null;
  }

  function unfancy(str) {
    var CHARS = {
      "\xB4": "'",
      ʻ: "'",
      ʼ: "'",
      ʽ: "'",
      ˈ: "'",
      ʹ: "'",
      "\u0312": "'",
      "\u0313": "'",
      "\u0314": "'",
      "\u0315": "'",
      ʺ: '"',
      "\u201C": '"',
      "\u201D": '"',
      "\u2012": "-",
      "\u2013": "-",
      "\u2014": "-",
      "\u2018": "'",
      "\u2019": "'",
      "\u2026": "...",
      "\u2212": "-",
      "\uFE49": "-",
      "\xA0": " "
    };

    if (!existy(str)) {
      throw new Error("string-unfancy/unfancy(): [THROW_ID_01] The input is missing!");
    }

    if (typeof str !== "string") {
      throw new Error("string-unfancy/unfancy(): [THROW_ID_02] The input is not a string! It's: ".concat(_typeof(str)));
    }

    var res = str;

    while (he.decode(res) !== res) {
      res = he.decode(res);
    }

    for (var i = 0, len = res.length; i < len; i++) {
      if (Object.prototype.hasOwnProperty.call(CHARS, res[i])) {
        res = res.slice(0, i) + CHARS[res[i]] + res.slice(i + 1);
      }
    }

    return res;
  }

  /**
   * ranges-sort
   * Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
   * Version: 3.12.1
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
   */
  function rangesSort(arrOfRanges, originalOptions) {
    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return arrOfRanges;
    }

    var defaults = {
      strictlyTwoElementsInRangeArrays: false,
      progressFn: null
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions);

    var culpritsIndex;
    var culpritsLen;

    if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every(function (rangeArr, indx) {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") has not two but ").concat(culpritsLen, " elements!"));
    }

    if (!arrOfRanges.every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") does not consist of only natural numbers!"));
    }

    var maxPossibleIterations = arrOfRanges.length * arrOfRanges.length;
    var counter = 0;
    return Array.from(arrOfRanges).sort(function (range1, range2) {
      if (opts.progressFn) {
        counter += 1;
        opts.progressFn(Math.floor(counter * 100 / maxPossibleIterations));
      }

      if (range1[0] === range2[0]) {
        if (range1[1] < range2[1]) {
          return -1;
        }

        if (range1[1] > range2[1]) {
          return 1;
        }

        return 0;
      }

      if (range1[0] < range2[0]) {
        return -1;
      }

      return 1;
    });
  }

  function mergeRanges(arrOfRanges, originalOpts) {
    function isStr(something) {
      return typeof something === "string";
    }

    function isObj(something) {
      return something && _typeof(something) === "object" && !Array.isArray(something);
    }

    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return arrOfRanges;
    }

    var defaults = {
      mergeType: 1,
      progressFn: null,
      joinRangesThatTouchEdges: true
    };
    var opts;

    if (originalOpts) {
      if (isObj(originalOpts)) {
        opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

        if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
          opts.progressFn = null;
        } else if (opts.progressFn && typeof opts.progressFn !== "function") {
          throw new Error("ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: \"".concat(_typeof(opts.progressFn), "\", equal to ").concat(JSON.stringify(opts.progressFn, null, 4)));
        }

        if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
          if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
            opts.mergeType = 1;
          } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
            opts.mergeType = 2;
          } else {
            throw new Error("ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.mergeType), "\", equal to ").concat(JSON.stringify(opts.mergeType, null, 4)));
          }
        }

        if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
          throw new Error("ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.joinRangesThatTouchEdges), "\", equal to ").concat(JSON.stringify(opts.joinRangesThatTouchEdges, null, 4)));
        }
      } else {
        throw new Error("emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
      }
    } else {
      opts = _objectSpread2({}, defaults);
    }

    var filtered = arrOfRanges.map(function (subarr) {
      return _toConsumableArray(subarr);
    }).filter(function (rangeArr) {
      return rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1];
    });
    var sortedRanges;
    var lastPercentageDone;
    var percentageDone;

    if (opts.progressFn) {
      sortedRanges = rangesSort(filtered, {
        progressFn: function progressFn(percentage) {
          percentageDone = Math.floor(percentage / 5);

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;
            opts.progressFn(percentageDone);
          }
        }
      });
    } else {
      sortedRanges = rangesSort(filtered);
    }

    var len = sortedRanges.length - 1;

    for (var i = len; i > 0; i--) {
      if (opts.progressFn) {
        percentageDone = Math.floor((1 - i / len) * 78) + 21;

        if (percentageDone !== lastPercentageDone && percentageDone > lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      }

      if (sortedRanges[i][0] <= sortedRanges[i - 1][0] || !opts.joinRangesThatTouchEdges && sortedRanges[i][0] < sortedRanges[i - 1][1] || opts.joinRangesThatTouchEdges && sortedRanges[i][0] <= sortedRanges[i - 1][1]) {
        sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
        sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]);

        if (sortedRanges[i][2] !== undefined && (sortedRanges[i - 1][0] >= sortedRanges[i][0] || sortedRanges[i - 1][1] <= sortedRanges[i][1])) {
          if (sortedRanges[i - 1][2] !== null) {
            if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
              sortedRanges[i - 1][2] = null;
            } else if (sortedRanges[i - 1][2] !== undefined) {
              if (opts.mergeType === 2 && sortedRanges[i - 1][0] === sortedRanges[i][0]) {
                sortedRanges[i - 1][2] = sortedRanges[i][2];
              } else {
                sortedRanges[i - 1][2] += sortedRanges[i][2];
              }
            } else {
              sortedRanges[i - 1][2] = sortedRanges[i][2];
            }
          }
        }

        sortedRanges.splice(i, 1);
        i = sortedRanges.length;
      }
    }

    return sortedRanges;
  }

  function existy$1(x) {
    return x != null;
  }

  function isStr(something) {
    return typeof something === "string";
  }

  function rangesApply(str, originalRangesArr, _progressFn) {
    var percentageDone = 0;
    var lastPercentageDone = 0;

    if (arguments.length === 0) {
      throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
    }

    if (!isStr(str)) {
      throw new TypeError("ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
    }

    if (originalRangesArr === null) {
      return str;
    }

    if (!Array.isArray(originalRangesArr)) {
      throw new TypeError("ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ".concat(_typeof(originalRangesArr), ", equal to: ").concat(JSON.stringify(originalRangesArr, null, 4)));
    }

    if (_progressFn && typeof _progressFn !== "function") {
      throw new TypeError("ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ".concat(_typeof(_progressFn), ", equal to: ").concat(JSON.stringify(_progressFn, null, 4)));
    }

    var rangesArr;

    if (Array.isArray(originalRangesArr) && (Number.isInteger(originalRangesArr[0]) && originalRangesArr[0] >= 0 || /^\d*$/.test(originalRangesArr[0])) && (Number.isInteger(originalRangesArr[1]) && originalRangesArr[1] >= 0 || /^\d*$/.test(originalRangesArr[1]))) {
      rangesArr = [Array.from(originalRangesArr)];
    } else {
      rangesArr = Array.from(originalRangesArr);
    }

    var len = rangesArr.length;
    var counter = 0;
    rangesArr.forEach(function (el, i) {
      if (_progressFn) {
        percentageDone = Math.floor(counter / len * 10);
        /* istanbul ignore else */

        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;

          _progressFn(percentageDone);
        }
      }

      if (!Array.isArray(el)) {
        throw new TypeError("ranges-apply: [THROW_ID_05] ranges array, second input arg., has ".concat(i, "th element not an array: ").concat(JSON.stringify(el, null, 4), ", which is ").concat(_typeof(el)));
      }

      if (!Number.isInteger(el[0]) || el[0] < 0) {
        if (/^\d*$/.test(el[0])) {
          rangesArr[i][0] = Number.parseInt(rangesArr[i][0], 10);
        } else {
          throw new TypeError("ranges-apply: [THROW_ID_06] ranges array, second input arg. has ".concat(i, "th element, array [").concat(el[0], ",").concat(el[1], "]. That array has first element not an integer, but ").concat(_typeof(el[0]), ", equal to: ").concat(JSON.stringify(el[0], null, 4), ". Computer doesn't like this."));
        }
      }

      if (!Number.isInteger(el[1])) {
        if (/^\d*$/.test(el[1])) {
          rangesArr[i][1] = Number.parseInt(rangesArr[i][1], 10);
        } else {
          throw new TypeError("ranges-apply: [THROW_ID_07] ranges array, second input arg. has ".concat(i, "th element, array [").concat(el[0], ",").concat(el[1], "]. That array has second element not an integer, but ").concat(_typeof(el[1]), ", equal to: ").concat(JSON.stringify(el[1], null, 4), ". Computer doesn't like this."));
        }
      }

      counter += 1;
    });
    var workingRanges = mergeRanges(rangesArr, {
      progressFn: function progressFn(perc) {
        if (_progressFn) {
          percentageDone = 10 + Math.floor(perc / 10);
          /* istanbul ignore else */

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;

            _progressFn(percentageDone);
          }
        }
      }
    });
    var len2 = workingRanges.length;

    if (len2 > 0) {
      var tails = str.slice(workingRanges[len2 - 1][1]);
      str = workingRanges.reduce(function (acc, val, i, arr) {
        if (_progressFn) {
          percentageDone = 20 + Math.floor(i / len2 * 80);
          /* istanbul ignore else */

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;

            _progressFn(percentageDone);
          }
        }

        var beginning = i === 0 ? 0 : arr[i - 1][1];
        var ending = arr[i][0];
        return acc + str.slice(beginning, ending) + (existy$1(arr[i][2]) ? arr[i][2] : "");
      }, "");
      str += tails;
    }

    return str;
  }

  /**
   * string-collapse-leading-whitespace
   * Collapse the leading and trailing whitespace of a string
   * Version: 2.0.21
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
   */
  var rawNbsp = "\xA0";

  function push(arr) {
    var leftSide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var charToPush = arguments.length > 2 ? arguments[2] : undefined;

    if (!charToPush.trim() && (!arr.length || charToPush === "\n" || charToPush === rawNbsp || (leftSide ? arr[arr.length - 1] : arr[0]) !== " ") && (!arr.length || (leftSide ? arr[arr.length - 1] : arr[0]) !== "\n" || charToPush === "\n" || charToPush === rawNbsp)) {
      if (leftSide) {
        if ((charToPush === "\n" || charToPush === rawNbsp) && arr.length && arr[arr.length - 1] === " ") {
          while (arr.length && arr[arr.length - 1] === " ") {
            arr.pop();
          }
        }

        arr.push(charToPush === rawNbsp || charToPush === "\n" ? charToPush : " ");
      } else {
        if ((charToPush === "\n" || charToPush === rawNbsp) && arr.length && arr[0] === " ") {
          while (arr.length && arr[0] === " ") {
            arr.shift();
          }
        }

        arr.unshift(charToPush === rawNbsp || charToPush === "\n" ? charToPush : " ");
      }
    }
  }

  function collapseLeadingWhitespace(str, originalLimitLinebreaksCount) {
    if (typeof str === "string" && str.length) {
      var windowsEol = false;

      if (str.includes("\r\n")) {
        windowsEol = true;
      }

      var limitLinebreaksCount;

      if (!originalLimitLinebreaksCount || typeof originalLimitLinebreaksCount !== "number") {
        limitLinebreaksCount = 1;
      } else {
        limitLinebreaksCount = originalLimitLinebreaksCount;
      }

      var limit;

      if (str.trim() === "") {
        var resArr = [];
        limit = limitLinebreaksCount;
        Array.from(str).forEach(function (char) {
          if (char !== "\n" || limit) {
            if (char === "\n") {
              limit -= 1;
            }

            push(resArr, true, char);
          }
        });

        while (resArr.length > 1 && resArr[resArr.length - 1] === " ") {
          resArr.pop();
        }

        return resArr.join("");
      }

      var startCharacter = [];
      limit = limitLinebreaksCount;

      if (str[0].trim() === "") {
        for (var i = 0, len = str.length; i < len; i++) {
          if (str[i].trim()) {
            break;
          } else if (str[i] !== "\n" || limit) {
            if (str[i] === "\n") {
              limit -= 1;
            }

            push(startCharacter, true, str[i]);
          }
        }
      }

      var endCharacter = [];
      limit = limitLinebreaksCount;

      if (str.slice(-1).trim() === "") {
        for (var _i = str.length; _i--;) {
          if (str[_i].trim()) {
            break;
          } else if (str[_i] !== "\n" || limit) {
            if (str[_i] === "\n") {
              limit -= 1;
            }

            push(endCharacter, false, str[_i]);
          }
        }
      }

      if (!windowsEol) {
        return startCharacter.join("") + str.trim() + endCharacter.join("");
      }

      return "".concat(startCharacter.join("")).concat(str.trim()).concat(endCharacter.join("")).replace(/\n/g, "\r\n");
    }

    return str;
  }

  function existy$2(x) {
    return x != null;
  }

  function isNum(something) {
    return Number.isInteger(something) && something >= 0;
  }

  function isStr$1(something) {
    return typeof something === "string";
  }

  function prepNumStr(str) {
    return /^\d*$/.test(str) ? parseInt(str, 10) : str;
  }

  var Ranges = /*#__PURE__*/function () {
    function Ranges(originalOpts) {
      _classCallCheck(this, Ranges);

      var defaults = {
        limitToBeAddedWhitespace: false,
        limitLinebreaksCount: 1,
        mergeType: 1
      };

      var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

      if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
        if (isStr$1(opts.mergeType) && opts.mergeType.trim() === "1") {
          opts.mergeType = 1;
        } else if (isStr$1(opts.mergeType) && opts.mergeType.trim() === "2") {
          opts.mergeType = 2;
        } else {
          throw new Error("ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.mergeType), "\", equal to ").concat(JSON.stringify(opts.mergeType, null, 4)));
        }
      }

      this.opts = opts;
    }

    _createClass(Ranges, [{
      key: "add",
      value: function add(originalFrom, originalTo, addVal) {
        var _this = this;

        for (var _len = arguments.length, etc = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
          etc[_key - 3] = arguments[_key];
        }

        if (etc.length > 0) {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ".concat(JSON.stringify(etc, null, 4)));
        }

        if (!existy$2(originalFrom) && !existy$2(originalTo)) {
          return;
        }

        if (existy$2(originalFrom) && !existy$2(originalTo)) {
          if (Array.isArray(originalFrom)) {
            if (originalFrom.length) {
              if (originalFrom.some(function (el) {
                return Array.isArray(el);
              })) {
                originalFrom.forEach(function (thing) {
                  if (Array.isArray(thing)) {
                    _this.add.apply(_this, _toConsumableArray(thing));
                  }
                });
                return;
              }

              if (originalFrom.length > 1 && isNum(prepNumStr(originalFrom[0])) && isNum(prepNumStr(originalFrom[1]))) {
                this.add.apply(this, _toConsumableArray(originalFrom));
              }
            }

            return;
          }

          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, \"from\" is set (".concat(JSON.stringify(originalFrom, null, 0), ") but second-one, \"to\" is not (").concat(JSON.stringify(originalTo, null, 0), ")"));
        } else if (!existy$2(originalFrom) && existy$2(originalTo)) {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, \"to\" is set (".concat(JSON.stringify(originalTo, null, 0), ") but first-one, \"from\" is not (").concat(JSON.stringify(originalFrom, null, 0), ")"));
        }

        var from = /^\d*$/.test(originalFrom) ? parseInt(originalFrom, 10) : originalFrom;
        var to = /^\d*$/.test(originalTo) ? parseInt(originalTo, 10) : originalTo;

        if (isNum(addVal)) {
          addVal = String(addVal);
        }

        if (isNum(from) && isNum(to)) {
          if (existy$2(addVal) && !isStr$1(addVal) && !isNum(addVal)) {
            throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ".concat(_typeof(addVal), ", equal to:\n").concat(JSON.stringify(addVal, null, 4)));
          }

          if (existy$2(this.slices) && Array.isArray(this.last()) && from === this.last()[1]) {
            this.last()[1] = to;
            if (this.last()[2] === null || addVal === null) ;

            if (this.last()[2] !== null && existy$2(addVal)) {
              var calculatedVal = existy$2(this.last()[2]) && this.last()[2].length > 0 && (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1) ? this.last()[2] + addVal : addVal;

              if (this.opts.limitToBeAddedWhitespace) {
                calculatedVal = collapseLeadingWhitespace(calculatedVal, this.opts.limitLinebreaksCount);
              }

              if (!(isStr$1(calculatedVal) && !calculatedVal.length)) {
                this.last()[2] = calculatedVal;
              }
            }
          } else {
            if (!this.slices) {
              this.slices = [];
            }

            var whatToPush = addVal !== undefined && !(isStr$1(addVal) && !addVal.length) ? [from, to, this.opts.limitToBeAddedWhitespace ? collapseLeadingWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to];
            this.slices.push(whatToPush);
          }
        } else {
          if (!(isNum(from) && from >= 0)) {
            throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_09] \"from\" value, the first input argument, must be a natural number or zero! Currently it's of a type \"".concat(_typeof(from), "\" equal to: ").concat(JSON.stringify(from, null, 4)));
          } else {
            throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_10] \"to\" value, the second input argument, must be a natural number or zero! Currently it's of a type \"".concat(_typeof(to), "\" equal to: ").concat(JSON.stringify(to, null, 4)));
          }
        }
      }
    }, {
      key: "push",
      value: function push(originalFrom, originalTo, addVal) {
        for (var _len2 = arguments.length, etc = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
          etc[_key2 - 3] = arguments[_key2];
        }

        this.add.apply(this, [originalFrom, originalTo, addVal].concat(etc));
      }
    }, {
      key: "current",
      value: function current() {
        var _this2 = this;

        if (this.slices != null) {
          this.slices = mergeRanges(this.slices, {
            mergeType: this.opts.mergeType
          });

          if (this.opts.limitToBeAddedWhitespace) {
            return this.slices.map(function (val) {
              if (existy$2(val[2])) {
                return [val[0], val[1], collapseLeadingWhitespace(val[2], _this2.opts.limitLinebreaksCount)];
              }

              return val;
            });
          }

          return this.slices;
        }

        return null;
      }
    }, {
      key: "wipe",
      value: function wipe() {
        this.slices = undefined;
      }
    }, {
      key: "replace",
      value: function replace(givenRanges) {
        if (Array.isArray(givenRanges) && givenRanges.length) {
          if (!(Array.isArray(givenRanges[0]) && isNum(givenRanges[0][0]))) {
            throw new Error("ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ".concat(JSON.stringify(givenRanges[0], null, 4), " should be an array and its first element should be an integer, a string index."));
          } else {
            this.slices = Array.from(givenRanges);
          }
        } else {
          this.slices = undefined;
        }
      }
    }, {
      key: "last",
      value: function last() {
        if (this.slices !== undefined && Array.isArray(this.slices)) {
          return this.slices[this.slices.length - 1];
        }

        return null;
      }
    }]);

    return Ranges;
  }();

  var typeDetect = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
       module.exports = factory() ;
    })(commonjsGlobal, function () {
      /* !
       * type-detect
       * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
       * MIT Licensed
       */

      var promiseExists = typeof Promise === 'function';
      /* eslint-disable no-undef */

      var globalObject = (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' ? self : commonjsGlobal; // eslint-disable-line id-blacklist

      var symbolExists = typeof Symbol !== 'undefined';
      var mapExists = typeof Map !== 'undefined';
      var setExists = typeof Set !== 'undefined';
      var weakMapExists = typeof WeakMap !== 'undefined';
      var weakSetExists = typeof WeakSet !== 'undefined';
      var dataViewExists = typeof DataView !== 'undefined';
      var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
      var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
      var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
      var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
      var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
      var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
      var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
      var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
      var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
      var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());
      var toStringLeftSliceLength = 8;
      var toStringRightSliceLength = -1;
      /**
       * ### typeOf (obj)
       *
       * Uses `Object.prototype.toString` to determine the type of an object,
       * normalising behaviour across engine versions & well optimised.
       *
       * @param {Mixed} object
       * @return {String} object type
       * @api public
       */

      function typeDetect(obj) {
        /* ! Speed optimisation
         * Pre:
         *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)
         *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)
         *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)
         *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)
         *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)
         * Post:
         *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)
         *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)
         *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)
         *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)
         *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)
         */
        var typeofObj = _typeof(obj);

        if (typeofObj !== 'object') {
          return typeofObj;
        }
        /* ! Speed optimisation
         * Pre:
         *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)
         * Post:
         *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)
         */


        if (obj === null) {
          return 'null';
        }
        /* ! Spec Conformance
         * Test: `Object.prototype.toString.call(window)``
         *  - Node === "[object global]"
         *  - Chrome === "[object global]"
         *  - Firefox === "[object Window]"
         *  - PhantomJS === "[object Window]"
         *  - Safari === "[object Window]"
         *  - IE 11 === "[object Window]"
         *  - IE Edge === "[object Window]"
         * Test: `Object.prototype.toString.call(this)``
         *  - Chrome Worker === "[object global]"
         *  - Firefox Worker === "[object DedicatedWorkerGlobalScope]"
         *  - Safari Worker === "[object DedicatedWorkerGlobalScope]"
         *  - IE 11 Worker === "[object WorkerGlobalScope]"
         *  - IE Edge Worker === "[object WorkerGlobalScope]"
         */


        if (obj === globalObject) {
          return 'global';
        }
        /* ! Speed optimisation
         * Pre:
         *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)
         * Post:
         *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)
         */


        if (Array.isArray(obj) && (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))) {
          return 'Array';
        } // Not caching existence of `window` and related properties due to potential
        // for `window` to be unset before tests in quasi-browser environments.


        if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window !== null) {
          /* ! Spec Conformance
           * (https://html.spec.whatwg.org/multipage/browsers.html#location)
           * WhatWG HTML$7.7.3 - The `Location` interface
           * Test: `Object.prototype.toString.call(window.location)``
           *  - IE <=11 === "[object Object]"
           *  - IE Edge <=13 === "[object Object]"
           */
          if (_typeof(window.location) === 'object' && obj === window.location) {
            return 'Location';
          }
          /* ! Spec Conformance
           * (https://html.spec.whatwg.org/#document)
           * WhatWG HTML$3.1.1 - The `Document` object
           * Note: Most browsers currently adher to the W3C DOM Level 2 spec
           *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
           *       which suggests that browsers should use HTMLTableCellElement for
           *       both TD and TH elements. WhatWG separates these.
           *       WhatWG HTML states:
           *         > For historical reasons, Window objects must also have a
           *         > writable, configurable, non-enumerable property named
           *         > HTMLDocument whose value is the Document interface object.
           * Test: `Object.prototype.toString.call(document)``
           *  - Chrome === "[object HTMLDocument]"
           *  - Firefox === "[object HTMLDocument]"
           *  - Safari === "[object HTMLDocument]"
           *  - IE <=10 === "[object Document]"
           *  - IE 11 === "[object HTMLDocument]"
           *  - IE Edge <=13 === "[object HTMLDocument]"
           */


          if (_typeof(window.document) === 'object' && obj === window.document) {
            return 'Document';
          }

          if (_typeof(window.navigator) === 'object') {
            /* ! Spec Conformance
             * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)
             * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray
             * Test: `Object.prototype.toString.call(navigator.mimeTypes)``
             *  - IE <=10 === "[object MSMimeTypesCollection]"
             */
            if (_typeof(window.navigator.mimeTypes) === 'object' && obj === window.navigator.mimeTypes) {
              return 'MimeTypeArray';
            }
            /* ! Spec Conformance
             * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
             * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray
             * Test: `Object.prototype.toString.call(navigator.plugins)``
             *  - IE <=10 === "[object MSPluginsCollection]"
             */


            if (_typeof(window.navigator.plugins) === 'object' && obj === window.navigator.plugins) {
              return 'PluginArray';
            }
          }

          if ((typeof window.HTMLElement === 'function' || _typeof(window.HTMLElement) === 'object') && obj instanceof window.HTMLElement) {
            /* ! Spec Conformance
            * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
            * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`
            * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``
            *  - IE <=10 === "[object HTMLBlockElement]"
            */
            if (obj.tagName === 'BLOCKQUOTE') {
              return 'HTMLQuoteElement';
            }
            /* ! Spec Conformance
             * (https://html.spec.whatwg.org/#htmltabledatacellelement)
             * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`
             * Note: Most browsers currently adher to the W3C DOM Level 2 spec
             *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
             *       which suggests that browsers should use HTMLTableCellElement for
             *       both TD and TH elements. WhatWG separates these.
             * Test: Object.prototype.toString.call(document.createElement('td'))
             *  - Chrome === "[object HTMLTableCellElement]"
             *  - Firefox === "[object HTMLTableCellElement]"
             *  - Safari === "[object HTMLTableCellElement]"
             */


            if (obj.tagName === 'TD') {
              return 'HTMLTableDataCellElement';
            }
            /* ! Spec Conformance
             * (https://html.spec.whatwg.org/#htmltableheadercellelement)
             * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`
             * Note: Most browsers currently adher to the W3C DOM Level 2 spec
             *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
             *       which suggests that browsers should use HTMLTableCellElement for
             *       both TD and TH elements. WhatWG separates these.
             * Test: Object.prototype.toString.call(document.createElement('th'))
             *  - Chrome === "[object HTMLTableCellElement]"
             *  - Firefox === "[object HTMLTableCellElement]"
             *  - Safari === "[object HTMLTableCellElement]"
             */


            if (obj.tagName === 'TH') {
              return 'HTMLTableHeaderCellElement';
            }
          }
        }
        /* ! Speed optimisation
        * Pre:
        *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)
        *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)
        *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)
        *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)
        *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)
        *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)
        *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)
        *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)
        *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)
        * Post:
        *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)
        *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)
        *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)
        *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)
        *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)
        *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)
        *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)
        *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)
        *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)
        */


        var stringTag = symbolToStringTagExists && obj[Symbol.toStringTag];

        if (typeof stringTag === 'string') {
          return stringTag;
        }

        var objPrototype = Object.getPrototypeOf(obj);
        /* ! Speed optimisation
        * Pre:
        *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)
        *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)
        * Post:
        *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)
        *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)
        */

        if (objPrototype === RegExp.prototype) {
          return 'RegExp';
        }
        /* ! Speed optimisation
        * Pre:
        *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)
        * Post:
        *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)
        */


        if (objPrototype === Date.prototype) {
          return 'Date';
        }
        /* ! Spec Conformance
         * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)
         * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be "Promise":
         * Test: `Object.prototype.toString.call(Promise.resolve())``
         *  - Chrome <=47 === "[object Object]"
         *  - Edge <=20 === "[object Object]"
         *  - Firefox 29-Latest === "[object Promise]"
         *  - Safari 7.1-Latest === "[object Promise]"
         */


        if (promiseExists && objPrototype === Promise.prototype) {
          return 'Promise';
        }
        /* ! Speed optimisation
        * Pre:
        *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)
        * Post:
        *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)
        */


        if (setExists && objPrototype === Set.prototype) {
          return 'Set';
        }
        /* ! Speed optimisation
        * Pre:
        *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)
        * Post:
        *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)
        */


        if (mapExists && objPrototype === Map.prototype) {
          return 'Map';
        }
        /* ! Speed optimisation
        * Pre:
        *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)
        * Post:
        *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)
        */


        if (weakSetExists && objPrototype === WeakSet.prototype) {
          return 'WeakSet';
        }
        /* ! Speed optimisation
        * Pre:
        *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)
        * Post:
        *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)
        */


        if (weakMapExists && objPrototype === WeakMap.prototype) {
          return 'WeakMap';
        }
        /* ! Spec Conformance
         * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)
         * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be "DataView":
         * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``
         *  - Edge <=13 === "[object Object]"
         */


        if (dataViewExists && objPrototype === DataView.prototype) {
          return 'DataView';
        }
        /* ! Spec Conformance
         * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)
         * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be "Map Iterator":
         * Test: `Object.prototype.toString.call(new Map().entries())``
         *  - Edge <=13 === "[object Object]"
         */


        if (mapExists && objPrototype === mapIteratorPrototype) {
          return 'Map Iterator';
        }
        /* ! Spec Conformance
         * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)
         * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be "Set Iterator":
         * Test: `Object.prototype.toString.call(new Set().entries())``
         *  - Edge <=13 === "[object Object]"
         */


        if (setExists && objPrototype === setIteratorPrototype) {
          return 'Set Iterator';
        }
        /* ! Spec Conformance
         * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)
         * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be "Array Iterator":
         * Test: `Object.prototype.toString.call([][Symbol.iterator]())``
         *  - Edge <=13 === "[object Object]"
         */


        if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
          return 'Array Iterator';
        }
        /* ! Spec Conformance
         * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)
         * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be "String Iterator":
         * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``
         *  - Edge <=13 === "[object Object]"
         */


        if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
          return 'String Iterator';
        }
        /* ! Speed optimisation
        * Pre:
        *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)
        * Post:
        *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)
        */


        if (objPrototype === null) {
          return 'Object';
        }

        return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
      }

      return typeDetect;
    });
  });

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array ? array.length : 0,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }

    return result;
  }
  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return baseFindIndex(array, baseIsNaN, fromIndex);
    }

    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }

    return -1;
  }
  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */


  function baseIsNaN(value) {
    return value !== value;
  }
  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */


  function baseUnary(func) {
    return function (value) {
      return func(value);
    };
  }
  /** Used for built-in method references. */


  var arrayProto = Array.prototype;
  /** Built-in value references. */

  var splice = arrayProto.splice;
  /**
   * The base implementation of `_.pullAllBy` without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to remove.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns `array`.
   */

  function basePullAll(array, values, iteratee, comparator) {
    var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
        index = -1,
        length = values.length,
        seen = array;

    if (array === values) {
      values = copyArray(values);
    }

    if (iteratee) {
      seen = arrayMap(array, baseUnary(iteratee));
    }

    while (++index < length) {
      var fromIndex = 0,
          value = values[index],
          computed = iteratee ? iteratee(value) : value;

      while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
        if (seen !== array) {
          splice.call(seen, fromIndex, 1);
        }

        splice.call(array, fromIndex, 1);
      }
    }

    return array;
  }
  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */


  function copyArray(source, array) {
    var index = -1,
        length = source.length;
    array || (array = Array(length));

    while (++index < length) {
      array[index] = source[index];
    }

    return array;
  }
  /**
   * This method is like `_.pull` except that it accepts an array of values to remove.
   *
   * **Note:** Unlike `_.difference`, this method mutates `array`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {Array} array The array to modify.
   * @param {Array} values The values to remove.
   * @returns {Array} Returns `array`.
   * @example
   *
   * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
   *
   * _.pullAll(array, ['a', 'c']);
   * console.log(array);
   * // => ['b', 'b']
   */


  function pullAll(array, values) {
    return array && array.length && values && values.length ? basePullAll(array, values) : array;
  }

  var lodash_pullall = pullAll;

  var lodash_clonedeep = createCommonjsModule(function (module, exports) {
    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;
    /** Used to stand-in for `undefined` hash values. */

    var HASH_UNDEFINED = '__lodash_hash_undefined__';
    /** Used as references for various `Number` constants. */

    var MAX_SAFE_INTEGER = 9007199254740991;
    /** `Object#toString` result references. */

    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        promiseTag = '[object Promise]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        weakMapTag = '[object WeakMap]';
    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';
    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */

    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    /** Used to match `RegExp` flags from their coerced string values. */

    var reFlags = /\w*$/;
    /** Used to detect host constructors (Safari). */

    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    /** Used to detect unsigned integer values. */

    var reIsUint = /^(?:0|[1-9]\d*)$/;
    /** Used to identify `toStringTag` values supported by `_.clone`. */

    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    /** Detect free variable `global` from Node.js. */

    var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    /** Detect free variable `self`. */

    var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
    /** Used as a reference to the global object. */

    var root = freeGlobal || freeSelf || Function('return this')();
    /** Detect free variable `exports`. */

    var freeExports =  exports && !exports.nodeType && exports;
    /** Detect free variable `module`. */

    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
    /** Detect the popular CommonJS extension `module.exports`. */

    var moduleExports = freeModule && freeModule.exports === freeExports;
    /**
     * Adds the key-value `pair` to `map`.
     *
     * @private
     * @param {Object} map The map to modify.
     * @param {Array} pair The key-value pair to add.
     * @returns {Object} Returns `map`.
     */

    function addMapEntry(map, pair) {
      // Don't return `map.set` because it's not chainable in IE 11.
      map.set(pair[0], pair[1]);
      return map;
    }
    /**
     * Adds `value` to `set`.
     *
     * @private
     * @param {Object} set The set to modify.
     * @param {*} value The value to add.
     * @returns {Object} Returns `set`.
     */


    function addSetEntry(set, value) {
      // Don't return `set.add` because it's not chainable in IE 11.
      set.add(value);
      return set;
    }
    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */


    function arrayEach(array, iteratee) {
      var index = -1,
          length = array ? array.length : 0;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }

      return array;
    }
    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */


    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }

      return array;
    }
    /**
     * A specialized version of `_.reduce` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initAccum] Specify using the first element of `array` as
     *  the initial value.
     * @returns {*} Returns the accumulated value.
     */


    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1,
          length = array ? array.length : 0;

      if (initAccum && length) {
        accumulator = array[++index];
      }

      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }

      return accumulator;
    }
    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */


    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }

      return result;
    }
    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */


    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }
    /**
     * Checks if `value` is a host object in IE < 9.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
     */


    function isHostObject(value) {
      // Many host objects are `Object` objects that can coerce to strings
      // despite having improperly defined `toString` methods.
      var result = false;

      if (value != null && typeof value.toString != 'function') {
        try {
          result = !!(value + '');
        } catch (e) {}
      }

      return result;
    }
    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */


    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);
      map.forEach(function (value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */


    function overArg(func, transform) {
      return function (arg) {
        return func(transform(arg));
      };
    }
    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */


    function setToArray(set) {
      var index = -1,
          result = Array(set.size);
      set.forEach(function (value) {
        result[++index] = value;
      });
      return result;
    }
    /** Used for built-in method references. */


    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;
    /** Used to detect overreaching core-js shims. */

    var coreJsData = root['__core-js_shared__'];
    /** Used to detect methods masquerading as native. */

    var maskSrcKey = function () {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? 'Symbol(src)_1.' + uid : '';
    }();
    /** Used to resolve the decompiled source of functions. */


    var funcToString = funcProto.toString;
    /** Used to check objects for own properties. */

    var hasOwnProperty = objectProto.hasOwnProperty;
    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */

    var objectToString = objectProto.toString;
    /** Used to detect if a method is native. */

    var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
    /** Built-in value references. */

    var Buffer = moduleExports ? root.Buffer : undefined,
        _Symbol = root.Symbol,
        Uint8Array = root.Uint8Array,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice;
    /* Built-in method references for those with the same name as other `lodash` methods. */

    var nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeKeys = overArg(Object.keys, Object);
    /* Built-in method references that are verified to be native. */

    var DataView = getNative(root, 'DataView'),
        Map = getNative(root, 'Map'),
        Promise = getNative(root, 'Promise'),
        Set = getNative(root, 'Set'),
        WeakMap = getNative(root, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');
    /** Used to detect maps, sets, and weakmaps. */

    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);
    /** Used to convert symbols to primitives and strings. */

    var symbolProto = _Symbol ? _Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */

    function Hash(entries) {
      var index = -1,
          length = entries ? entries.length : 0;
      this.clear();

      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */


    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }
    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */


    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }
    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */


    function hashGet(key) {
      var data = this.__data__;

      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }

      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }
    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */


    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
    }
    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */


    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
      return this;
    } // Add methods to `Hash`.


    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */

    function ListCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;
      this.clear();

      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */


    function listCacheClear() {
      this.__data__ = [];
    }
    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */


    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }

      var lastIndex = data.length - 1;

      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }

      return true;
    }
    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */


    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);
      return index < 0 ? undefined : data[index][1];
    }
    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */


    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */


    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }

      return this;
    } // Add methods to `ListCache`.


    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */

    function MapCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;
      this.clear();

      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */


    function mapCacheClear() {
      this.__data__ = {
        'hash': new Hash(),
        'map': new (Map || ListCache)(),
        'string': new Hash()
      };
    }
    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */


    function mapCacheDelete(key) {
      return getMapData(this, key)['delete'](key);
    }
    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */


    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */


    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */


    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    } // Add methods to `MapCache`.


    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */

    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }
    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */


    function stackClear() {
      this.__data__ = new ListCache();
    }
    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */


    function stackDelete(key) {
      return this.__data__['delete'](key);
    }
    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */


    function stackGet(key) {
      return this.__data__.get(key);
    }
    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */


    function stackHas(key) {
      return this.__data__.has(key);
    }
    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */


    function stackSet(key, value) {
      var cache = this.__data__;

      if (cache instanceof ListCache) {
        var pairs = cache.__data__;

        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          return this;
        }

        cache = this.__data__ = new MapCache(pairs);
      }

      cache.set(key, value);
      return this;
    } // Add methods to `Stack`.


    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */

    function arrayLikeKeys(value, inherited) {
      // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
      // Safari 9 makes `arguments.length` enumerable in strict mode.
      var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length,
          skipIndexes = !!length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
          result.push(key);
        }
      }

      return result;
    }
    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */


    function assignValue(object, key, value) {
      var objValue = object[key];

      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
        object[key] = value;
      }
    }
    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */


    function assocIndexOf(array, key) {
      var length = array.length;

      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }

      return -1;
    }
    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */


    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }
    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {boolean} [isFull] Specify a clone including symbols.
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */


    function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
      var result;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }

      if (result !== undefined) {
        return result;
      }

      if (!isObject(value)) {
        return value;
      }

      var isArr = isArray(value);

      if (isArr) {
        result = initCloneArray(value);

        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }

        if (tag == objectTag || tag == argsTag || isFunc && !object) {
          if (isHostObject(value)) {
            return object ? value : {};
          }

          result = initCloneObject(isFunc ? {} : value);

          if (!isDeep) {
            return copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }

          result = initCloneByTag(value, tag, baseClone, isDeep);
        }
      } // Check for circular references and return its corresponding clone.


      stack || (stack = new Stack());
      var stacked = stack.get(value);

      if (stacked) {
        return stacked;
      }

      stack.set(value, result);

      if (!isArr) {
        var props = isFull ? getAllKeys(value) : keys(value);
      }

      arrayEach(props || value, function (subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        } // Recursively populate clone (susceptible to call stack limits).


        assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
      });
      return result;
    }
    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */


    function baseCreate(proto) {
      return isObject(proto) ? objectCreate(proto) : {};
    }
    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */


    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    /**
     * The base implementation of `getTag`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */


    function baseGetTag(value) {
      return objectToString.call(value);
    }
    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */


    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }

      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */


    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }

      var result = [];

      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }

      return result;
    }
    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */


    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }

      var result = new buffer.constructor(buffer.length);
      buffer.copy(result);
      return result;
    }
    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */


    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }
    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */


    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }
    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned map.
     */


    function cloneMap(map, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
      return arrayReduce(array, addMapEntry, new map.constructor());
    }
    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */


    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }
    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned set.
     */


    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
      return arrayReduce(array, addSetEntry, new set.constructor());
    }
    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */


    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }
    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */


    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */


    function copyArray(source, array) {
      var index = -1,
          length = source.length;
      array || (array = Array(length));

      while (++index < length) {
        array[index] = source[index];
      }

      return array;
    }
    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */


    function copyObject(source, props, object, customizer) {
      object || (object = {});
      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
        assignValue(object, key, newValue === undefined ? source[key] : newValue);
      }

      return object;
    }
    /**
     * Copies own symbol properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */


    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }
    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */


    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }
    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */


    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
    }
    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */


    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }
    /**
     * Creates an array of the own enumerable symbol properties of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */


    var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */

    var getTag = baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11,
    // for data views in Edge < 14, and promises in Node.js.

    if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function getTag(value) {
        var result = objectToString.call(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : undefined;

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;

            case mapCtorString:
              return mapTag;

            case promiseCtorString:
              return promiseTag;

            case setCtorString:
              return setTag;

            case weakMapCtorString:
              return weakMapTag;
          }
        }

        return result;
      };
    }
    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */


    function initCloneArray(array) {
      var length = array.length,
          result = array.constructor(length); // Add properties assigned by `RegExp#exec`.

      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }

      return result;
    }
    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */


    function initCloneObject(object) {
      return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */


    function initCloneByTag(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;

      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object, isDeep, cloneFunc);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object, isDeep, cloneFunc);

        case symbolTag:
          return cloneSymbol(object);
      }
    }
    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */


    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
    }
    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */


    function isKeyable(value) {
      var type = _typeof(value);

      return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
    }
    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */


    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */


    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
      return value === proto;
    }
    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to process.
     * @returns {string} Returns the source code.
     */


    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}

        try {
          return func + '';
        } catch (e) {}
      }

      return '';
    }
    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */


    function cloneDeep(value) {
      return baseClone(value, true, true);
    }
    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */


    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */


    function isArguments(value) {
      // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
      return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
    }
    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */


    var isArray = Array.isArray;
    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */

    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */


    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */


    var isBuffer = nativeIsBuffer || stubFalse;
    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */

    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8-9 which returns 'object' for typed array and other constructors.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }
    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */


    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */


    function isObject(value) {
      var type = _typeof(value);

      return !!value && (type == 'object' || type == 'function');
    }
    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */


    function isObjectLike(value) {
      return !!value && _typeof(value) == 'object';
    }
    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */


    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */


    function stubArray() {
      return [];
    }
    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */


    function stubFalse() {
      return false;
    }

    module.exports = cloneDeep;
  });

  function trimFirstDot(str) {
    if (typeof str === "string" && str.length && str[0] === ".") {
      return str.slice(1);
    }

    return str;
  }

  function isObj(something) {
    return something && _typeof(something) === "object" && !Array.isArray(something);
  }

  function astMonkeyTraverse(tree1, cb1) {
    var stop2 = {
      now: false
    };

    function traverseInner(treeOriginal, callback, originalInnerObj, stop) {
      var tree = lodash_clonedeep(treeOriginal);
      var i;
      var len;
      var res;

      var innerObj = _objectSpread2({
        depth: -1,
        path: ""
      }, originalInnerObj);

      innerObj.depth += 1;

      if (Array.isArray(tree)) {
        for (i = 0, len = tree.length; i < len; i++) {
          if (stop.now) {
            break;
          }

          var path = "".concat(innerObj.path, ".").concat(i);

          if (tree[i] !== undefined) {
            innerObj.parent = lodash_clonedeep(tree);
            innerObj.parentType = "array";
            res = traverseInner(callback(tree[i], undefined, _objectSpread2(_objectSpread2({}, innerObj), {}, {
              path: trimFirstDot(path)
            }), stop), callback, _objectSpread2(_objectSpread2({}, innerObj), {}, {
              path: trimFirstDot(path)
            }), stop);

            if (Number.isNaN(res) && i < tree.length) {
              tree.splice(i, 1);
              i -= 1;
            } else {
              tree[i] = res;
            }
          } else {
            tree.splice(i, 1);
          }
        }
      } else if (isObj(tree)) {
        for (var key in tree) {
          if (stop.now && key != null) {
            break;
          }

          var _path = "".concat(innerObj.path, ".").concat(key);

          if (innerObj.depth === 0 && key != null) {
            innerObj.topmostKey = key;
          }

          innerObj.parent = lodash_clonedeep(tree);
          innerObj.parentType = "object";
          res = traverseInner(callback(key, tree[key], _objectSpread2(_objectSpread2({}, innerObj), {}, {
            path: trimFirstDot(_path)
          }), stop), callback, _objectSpread2(_objectSpread2({}, innerObj), {}, {
            path: trimFirstDot(_path)
          }), stop);

          if (Number.isNaN(res)) {
            delete tree[key];
          } else {
            tree[key] = res;
          }
        }
      }

      return tree;
    }

    return traverseInner(tree1, cb1, {}, stop2);
  }

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  /** Used as references for various `Number` constants. */

  var MAX_SAFE_INTEGER = 9007199254740991;
  /** `Object#toString` result references. */

  var funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]';
  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */

  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  /** Used to detect host constructors (Safari). */

  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  /** Detect free variable `global` from Node.js. */

  var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `self`. */

  var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();
  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */

  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);

      case 1:
        return func.call(thisArg, args[0]);

      case 2:
        return func.call(thisArg, args[0], args[1]);

      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }

    return func.apply(thisArg, args);
  }
  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */


  function arrayIncludes(array, value) {
    var length = array ? array.length : 0;
    return !!length && baseIndexOf$1(array, value, 0) > -1;
  }
  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */


  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }

    return false;
  }
  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */


  function arrayMap$1(array, iteratee) {
    var index = -1,
        length = array ? array.length : 0,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }

    return result;
  }
  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseFindIndex$1(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseIndexOf$1(array, value, fromIndex) {
    if (value !== value) {
      return baseFindIndex$1(array, baseIsNaN$1, fromIndex);
    }

    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */


  function baseIsNaN$1(value) {
    return value !== value;
  }
  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */


  function baseUnary$1(func) {
    return function (value) {
      return func(value);
    };
  }
  /**
   * Checks if a cache value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function cacheHas(cache, key) {
    return cache.has(key);
  }
  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */


  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }
  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */


  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;

    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }

    return result;
  }
  /** Used for built-in method references. */


  var arrayProto$1 = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;
  /** Used to detect overreaching core-js shims. */

  var coreJsData = root['__core-js_shared__'];
  /** Used to detect methods masquerading as native. */

  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();
  /** Used to resolve the decompiled source of functions. */


  var funcToString = funcProto.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString = objectProto.toString;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  /** Built-in value references. */

  var splice$1 = arrayProto$1.splice;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeMax = Math.max,
      nativeMin = Math.min;
  /* Built-in method references that are verified to be native. */

  var Map$1 = getNative(root, 'Map'),
      nativeCreate = getNative(Object, 'create');
  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */


  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }
  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }
  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function hashGet(key) {
    var data = this.__data__;

    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }

    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }
  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
  }
  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */


  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
  } // Add methods to `Hash`.


  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function ListCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */


  function listCacheClear() {
    this.__data__ = [];
  }
  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }

    var lastIndex = data.length - 1;

    if (index == lastIndex) {
      data.pop();
    } else {
      splice$1.call(data, index, 1);
    }

    return true;
  }
  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  }
  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */


  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }

    return this;
  } // Add methods to `ListCache`.


  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function MapCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */


  function mapCacheClear() {
    this.__data__ = {
      'hash': new Hash(),
      'map': new (Map$1 || ListCache)(),
      'string': new Hash()
    };
  }
  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function mapCacheDelete(key) {
    return getMapData(this, key)['delete'](key);
  }
  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */


  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  } // Add methods to `MapCache`.


  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */

  function SetCache(values) {
    var index = -1,
        length = values ? values.length : 0;
    this.__data__ = new MapCache();

    while (++index < length) {
      this.add(values[index]);
    }
  }
  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */


  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);

    return this;
  }
  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */


  function setCacheHas(value) {
    return this.__data__.has(value);
  } // Add methods to `SetCache`.


  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */

  function assocIndexOf(array, key) {
    var length = array.length;

    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }

    return -1;
  }
  /**
   * The base implementation of methods like `_.intersection`, without support
   * for iteratee shorthands, that accepts an array of arrays to inspect.
   *
   * @private
   * @param {Array} arrays The arrays to inspect.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of shared values.
   */


  function baseIntersection(arrays, iteratee, comparator) {
    var includes = comparator ? arrayIncludesWith : arrayIncludes,
        length = arrays[0].length,
        othLength = arrays.length,
        othIndex = othLength,
        caches = Array(othLength),
        maxLength = Infinity,
        result = [];

    while (othIndex--) {
      var array = arrays[othIndex];

      if (othIndex && iteratee) {
        array = arrayMap$1(array, baseUnary$1(iteratee));
      }

      maxLength = nativeMin(array.length, maxLength);
      caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined;
    }

    array = arrays[0];
    var index = -1,
        seen = caches[0];

    outer: while (++index < length && result.length < maxLength) {
      var value = array[index],
          computed = iteratee ? iteratee(value) : value;
      value = comparator || value !== 0 ? value : 0;

      if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
        othIndex = othLength;

        while (--othIndex) {
          var cache = caches[othIndex];

          if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
            continue outer;
          }
        }

        if (seen) {
          seen.push(computed);
        }

        result.push(value);
      }
    }

    return result;
  }
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */


  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }

    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */


  function baseRest(func, start) {
    start = nativeMax(start === undefined ? func.length - 1 : start, 0);
    return function () {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }

      index = -1;
      var otherArgs = Array(start + 1);

      while (++index < start) {
        otherArgs[index] = args[index];
      }

      otherArgs[start] = array;
      return apply(func, this, otherArgs);
    };
  }
  /**
   * Casts `value` to an empty array if it's not an array like object.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Array|Object} Returns the cast array-like object.
   */


  function castArrayLikeObject(value) {
    return isArrayLikeObject(value) ? value : [];
  }
  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */


  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }
  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */


  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }
  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */


  function isKeyable(value) {
    var type = _typeof(value);

    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
  }
  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */


  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */


  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }
  /**
   * Creates an array of unique values that are included in all given arrays
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons. The order of result values is determined by the
   * order they occur in the first array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @returns {Array} Returns the new array of intersecting values.
   * @example
   *
   * _.intersection([2, 1], [2, 3]);
   * // => [2]
   */


  var intersection = baseRest(function (arrays) {
    var mapped = arrayMap$1(arrays, castArrayLikeObject);
    return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
  });
  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */

  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */


  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */


  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */


  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
  }
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */


  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */


  function isObject(value) {
    var type = _typeof(value);

    return !!value && (type == 'object' || type == 'function');
  }
  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */


  function isObjectLike(value) {
    return !!value && _typeof(value) == 'object';
  }

  var lodash_intersection = intersection;

  /**
   * arrayiffy-if-string
   * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
   * Version: 3.11.33
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

  var objectPath = createCommonjsModule(function (module) {
    (function (root, factory) {
      /*istanbul ignore next:cant test*/

      {
        module.exports = factory();
      }
    })(commonjsGlobal, function () {

      var toStr = Object.prototype.toString;

      function hasOwnProperty(obj, prop) {
        if (obj == null) {
          return false;
        } //to handle objects with null prototypes (too edge case?)


        return Object.prototype.hasOwnProperty.call(obj, prop);
      }

      function isEmpty(value) {
        if (!value) {
          return true;
        }

        if (isArray(value) && value.length === 0) {
          return true;
        } else if (typeof value !== 'string') {
          for (var i in value) {
            if (hasOwnProperty(value, i)) {
              return false;
            }
          }

          return true;
        }

        return false;
      }

      function toString(type) {
        return toStr.call(type);
      }

      function isObject(obj) {
        return _typeof(obj) === 'object' && toString(obj) === "[object Object]";
      }

      var isArray = Array.isArray || function (obj) {
        /*istanbul ignore next:cant test*/
        return toStr.call(obj) === '[object Array]';
      };

      function isBoolean(obj) {
        return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
      }

      function getKey(key) {
        var intKey = parseInt(key);

        if (intKey.toString() === key) {
          return intKey;
        }

        return key;
      }

      function factory(options) {
        options = options || {};

        var objectPath = function objectPath(obj) {
          return Object.keys(objectPath).reduce(function (proxy, prop) {
            if (prop === 'create') {
              return proxy;
            }
            /*istanbul ignore else*/


            if (typeof objectPath[prop] === 'function') {
              proxy[prop] = objectPath[prop].bind(objectPath, obj);
            }

            return proxy;
          }, {});
        };

        function hasShallowProperty(obj, prop) {
          return options.includeInheritedProps || typeof prop === 'number' && Array.isArray(obj) || hasOwnProperty(obj, prop);
        }

        function getShallowProperty(obj, prop) {
          if (hasShallowProperty(obj, prop)) {
            return obj[prop];
          }
        }

        function set(obj, path, value, doNotReplace) {
          if (typeof path === 'number') {
            path = [path];
          }

          if (!path || path.length === 0) {
            return obj;
          }

          if (typeof path === 'string') {
            return set(obj, path.split('.').map(getKey), value, doNotReplace);
          }

          var currentPath = path[0];
          var currentValue = getShallowProperty(obj, currentPath);

          if (path.length === 1) {
            if (currentValue === void 0 || !doNotReplace) {
              obj[currentPath] = value;
            }

            return currentValue;
          }

          if (currentValue === void 0) {
            //check if we assume an array
            if (typeof path[1] === 'number') {
              obj[currentPath] = [];
            } else {
              obj[currentPath] = {};
            }
          }

          return set(obj[currentPath], path.slice(1), value, doNotReplace);
        }

        objectPath.has = function (obj, path) {
          if (typeof path === 'number') {
            path = [path];
          } else if (typeof path === 'string') {
            path = path.split('.');
          }

          if (!path || path.length === 0) {
            return !!obj;
          }

          for (var i = 0; i < path.length; i++) {
            var j = getKey(path[i]);

            if (typeof j === 'number' && isArray(obj) && j < obj.length || (options.includeInheritedProps ? j in Object(obj) : hasOwnProperty(obj, j))) {
              obj = obj[j];
            } else {
              return false;
            }
          }

          return true;
        };

        objectPath.ensureExists = function (obj, path, value) {
          return set(obj, path, value, true);
        };

        objectPath.set = function (obj, path, value, doNotReplace) {
          return set(obj, path, value, doNotReplace);
        };

        objectPath.insert = function (obj, path, value, at) {
          var arr = objectPath.get(obj, path);
          at = ~~at;

          if (!isArray(arr)) {
            arr = [];
            objectPath.set(obj, path, arr);
          }

          arr.splice(at, 0, value);
        };

        objectPath.empty = function (obj, path) {
          if (isEmpty(path)) {
            return void 0;
          }

          if (obj == null) {
            return void 0;
          }

          var value, i;

          if (!(value = objectPath.get(obj, path))) {
            return void 0;
          }

          if (typeof value === 'string') {
            return objectPath.set(obj, path, '');
          } else if (isBoolean(value)) {
            return objectPath.set(obj, path, false);
          } else if (typeof value === 'number') {
            return objectPath.set(obj, path, 0);
          } else if (isArray(value)) {
            value.length = 0;
          } else if (isObject(value)) {
            for (i in value) {
              if (hasShallowProperty(value, i)) {
                delete value[i];
              }
            }
          } else {
            return objectPath.set(obj, path, null);
          }
        };

        objectPath.push = function (obj, path
        /*, values */
        ) {
          var arr = objectPath.get(obj, path);

          if (!isArray(arr)) {
            arr = [];
            objectPath.set(obj, path, arr);
          }

          arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
        };

        objectPath.coalesce = function (obj, paths, defaultValue) {
          var value;

          for (var i = 0, len = paths.length; i < len; i++) {
            if ((value = objectPath.get(obj, paths[i])) !== void 0) {
              return value;
            }
          }

          return defaultValue;
        };

        objectPath.get = function (obj, path, defaultValue) {
          if (typeof path === 'number') {
            path = [path];
          }

          if (!path || path.length === 0) {
            return obj;
          }

          if (obj == null) {
            return defaultValue;
          }

          if (typeof path === 'string') {
            return objectPath.get(obj, path.split('.'), defaultValue);
          }

          var currentPath = getKey(path[0]);
          var nextObj = getShallowProperty(obj, currentPath);

          if (nextObj === void 0) {
            return defaultValue;
          }

          if (path.length === 1) {
            return nextObj;
          }

          return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
        };

        objectPath.del = function del(obj, path) {
          if (typeof path === 'number') {
            path = [path];
          }

          if (obj == null) {
            return obj;
          }

          if (isEmpty(path)) {
            return obj;
          }

          if (typeof path === 'string') {
            return objectPath.del(obj, path.split('.'));
          }

          var currentPath = getKey(path[0]);

          if (!hasShallowProperty(obj, currentPath)) {
            return obj;
          }

          if (path.length === 1) {
            if (isArray(obj)) {
              obj.splice(currentPath, 1);
            } else {
              delete obj[currentPath];
            }
          } else {
            return objectPath.del(obj[currentPath], path.slice(1));
          }

          return obj;
        };

        return objectPath;
      }

      var mod = factory();
      mod.create = factory;
      mod.withInheritedProps = factory({
        includeInheritedProps: true
      });
      return mod;
    });
  });

  var escapeStringRegexp = function escapeStringRegexp(string) {
    if (typeof string !== 'string') {
      throw new TypeError('Expected a string');
    } // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.


    return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
  };

  var regexpCache = new Map();

  function makeRegexp(pattern, options) {
    options = _objectSpread2({
      caseSensitive: false
    }, options);
    var cacheKey = pattern + JSON.stringify(options);

    if (regexpCache.has(cacheKey)) {
      return regexpCache.get(cacheKey);
    }

    var negated = pattern[0] === '!';

    if (negated) {
      pattern = pattern.slice(1);
    }

    pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '[\\s\\S]*');
    var regexp = new RegExp("^".concat(pattern, "$"), options.caseSensitive ? '' : 'i');
    regexp.negated = negated;
    regexpCache.set(cacheKey, regexp);
    return regexp;
  }

  var matcher = function matcher(inputs, patterns, options) {
    if (!(Array.isArray(inputs) && Array.isArray(patterns))) {
      throw new TypeError("Expected two arrays, got ".concat(_typeof(inputs), " ").concat(_typeof(patterns)));
    }

    if (patterns.length === 0) {
      return inputs;
    }

    var isFirstPatternNegated = patterns[0][0] === '!';
    patterns = patterns.map(function (pattern) {
      return makeRegexp(pattern, options);
    });
    var result = [];

    var _iterator = _createForOfIteratorHelper(inputs),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var input = _step.value;
        // If first pattern is negated we include everything to match user expectation.
        var matches = isFirstPatternNegated;

        var _iterator2 = _createForOfIteratorHelper(patterns),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var pattern = _step2.value;

            if (pattern.test(input)) {
              matches = !pattern.negated;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (matches) {
          result.push(input);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return result;
  };

  var isMatch = function isMatch(input, pattern, options) {
    var inputArray = Array.isArray(input) ? input : [input];
    var patternArray = Array.isArray(pattern) ? pattern : [pattern];
    return inputArray.some(function (input) {
      return patternArray.every(function (pattern) {
        var regexp = makeRegexp(pattern, options);
        var matches = regexp.test(input);
        return regexp.negated ? !matches : matches;
      });
    });
  };
  matcher.isMatch = isMatch;

  function checkTypesMini(obj, ref, originalOptions) {
    var shouldWeCheckTheOpts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var hasKey = Object.prototype.hasOwnProperty;

    function existy(something) {
      return something != null;
    }

    function isObj(something) {
      return typeDetect(something) === "Object";
    }

    function pullAllWithGlob(originalInput, toBeRemoved) {
      toBeRemoved = arrayiffyString(toBeRemoved);
      return Array.from(originalInput).filter(function (originalVal) {
        return !toBeRemoved.some(function (remVal) {
          return matcher.isMatch(originalVal, remVal, {
            caseSensitive: true
          });
        });
      });
    }

    var NAMESFORANYTYPE = ["any", "anything", "every", "everything", "all", "whatever", "whatevs"];
    var isArr = Array.isArray;

    if (!existy(obj)) {
      throw new Error("check-types-mini: [THROW_ID_01] First argument is missing!");
    }

    var defaults = {
      ignoreKeys: [],
      ignorePaths: [],
      acceptArrays: false,
      acceptArraysIgnore: [],
      enforceStrictKeyset: true,
      schema: {},
      msg: "check-types-mini",
      optsVarName: "opts"
    };
    var opts;

    if (existy(originalOptions) && isObj(originalOptions)) {
      opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions);
    } else {
      opts = _objectSpread2({}, defaults);
    }

    if (!existy(opts.ignoreKeys) || !opts.ignoreKeys) {
      opts.ignoreKeys = [];
    } else {
      opts.ignoreKeys = arrayiffyString(opts.ignoreKeys);
    }

    if (!existy(opts.ignorePaths) || !opts.ignorePaths) {
      opts.ignorePaths = [];
    } else {
      opts.ignorePaths = arrayiffyString(opts.ignorePaths);
    }

    if (!existy(opts.acceptArraysIgnore) || !opts.acceptArraysIgnore) {
      opts.acceptArraysIgnore = [];
    } else {
      opts.acceptArraysIgnore = arrayiffyString(opts.acceptArraysIgnore);
    }

    opts.msg = typeof opts.msg === "string" ? opts.msg.trim() : opts.msg;

    if (opts.msg[opts.msg.length - 1] === ":") {
      opts.msg = opts.msg.slice(0, opts.msg.length - 1).trim();
    }

    if (opts.schema) {
      Object.keys(opts.schema).forEach(function (oneKey) {
        if (isObj(opts.schema[oneKey])) {
          var tempObj = {};
          astMonkeyTraverse(opts.schema[oneKey], function (key, val, innerObj) {
            var current = val !== undefined ? val : key;

            if (!isArr(current) && !isObj(current)) {
              tempObj["".concat(oneKey, ".").concat(innerObj.path)] = current;
            }

            return current;
          });
          delete opts.schema[oneKey];
          opts.schema = Object.assign(opts.schema, tempObj);
        }
      });
      Object.keys(opts.schema).forEach(function (oneKey) {
        if (!isArr(opts.schema[oneKey])) {
          opts.schema[oneKey] = [opts.schema[oneKey]];
        }

        opts.schema[oneKey] = opts.schema[oneKey].map(String).map(function (el) {
          return el.toLowerCase();
        }).map(function (el) {
          return el.trim();
        });
      });
    }

    if (!existy(ref)) {
      ref = {};
    }

    if (shouldWeCheckTheOpts) {
      checkTypesMini(opts, defaults, {
        enforceStrictKeyset: false
      }, false);
    }

    if (opts.enforceStrictKeyset) {
      if (existy(opts.schema) && Object.keys(opts.schema).length > 0) {
        if (pullAllWithGlob(lodash_pullall(Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema))), opts.ignoreKeys).length !== 0) {
          var keys = lodash_pullall(Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema)));
          throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".enforceStrictKeyset is on and the following key").concat(keys.length > 1 ? "s" : "", " ").concat(keys.length > 1 ? "are" : "is", " not covered by schema and/or reference objects: ").concat(keys.join(", ")));
        }
      } else if (existy(ref) && Object.keys(ref).length > 0) {
        if (pullAllWithGlob(lodash_pullall(Object.keys(obj), Object.keys(ref)), opts.ignoreKeys).length !== 0) {
          var _keys = lodash_pullall(Object.keys(obj), Object.keys(ref));

          throw new TypeError("".concat(opts.msg, ": The input object has key").concat(_keys.length > 1 ? "s" : "", " which ").concat(_keys.length > 1 ? "are" : "is", " not covered by the reference object: ").concat(_keys.join(", ")));
        } else if (pullAllWithGlob(lodash_pullall(Object.keys(ref), Object.keys(obj)), opts.ignoreKeys).length !== 0) {
          var _keys2 = lodash_pullall(Object.keys(ref), Object.keys(obj));

          throw new TypeError("".concat(opts.msg, ": The reference object has key").concat(_keys2.length > 1 ? "s" : "", " which ").concat(_keys2.length > 1 ? "are" : "is", " not present in the input object: ").concat(_keys2.join(", ")));
        }
      } else {
        throw new TypeError("".concat(opts.msg, ": Both ").concat(opts.optsVarName, ".schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!"));
      }
    }

    var ignoredPathsArr = [];
    astMonkeyTraverse(obj, function (key, val, innerObj) {
      var current = val;
      var objKey = key;

      if (innerObj.parentType === "array") {
        objKey = undefined;
        current = key;
      }

      if (isArr(ignoredPathsArr) && ignoredPathsArr.length && ignoredPathsArr.some(function (path) {
        return innerObj.path.startsWith(path);
      })) {
        return current;
      }

      if (objKey && opts.ignoreKeys.some(function (oneOfKeysToIgnore) {
        return matcher.isMatch(objKey, oneOfKeysToIgnore);
      })) {
        return current;
      }

      if (opts.ignorePaths.some(function (oneOfPathsToIgnore) {
        return matcher.isMatch(innerObj.path, oneOfPathsToIgnore);
      })) {
        return current;
      }

      var isNotAnArrayChild = !(!isObj(current) && !isArr(current) && isArr(innerObj.parent));
      var optsSchemaHasThisPathDefined = false;

      if (isObj(opts.schema) && hasKey.call(opts.schema, objectPath.get(innerObj.path))) {
        optsSchemaHasThisPathDefined = true;
      }

      var refHasThisPathDefined = false;

      if (isObj(ref) && objectPath.has(ref, objectPath.get(innerObj.path))) {
        refHasThisPathDefined = true;
      }

      if (opts.enforceStrictKeyset && isNotAnArrayChild && !optsSchemaHasThisPathDefined && !refHasThisPathDefined) {
        throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " is neither covered by reference object (second input argument), nor ").concat(opts.optsVarName, ".schema! To stop this error, turn off ").concat(opts.optsVarName, ".enforceStrictKeyset or provide some type reference (2nd argument or ").concat(opts.optsVarName, ".schema).\n\nDebug info:\n\nobj = ").concat(JSON.stringify(obj, null, 4), "\n\nref = ").concat(JSON.stringify(ref, null, 4), "\n\ninnerObj = ").concat(JSON.stringify(innerObj, null, 4), "\n\nopts = ").concat(JSON.stringify(opts, null, 4), "\n\ncurrent = ").concat(JSON.stringify(current, null, 4), "\n\n"));
      } else if (optsSchemaHasThisPathDefined) {
        var currentKeysSchema = arrayiffyString(opts.schema[innerObj.path]).map(String).map(function (el) {
          return el.toLowerCase();
        });
        objectPath.set(opts.schema, innerObj.path, currentKeysSchema);

        if (!lodash_intersection(currentKeysSchema, NAMESFORANYTYPE).length) {
          if (current !== true && current !== false && !currentKeysSchema.includes(typeDetect(current).toLowerCase()) || (current === true || current === false) && !currentKeysSchema.includes(String(current)) && !currentKeysSchema.includes("boolean")) {
            if (isArr(current) && opts.acceptArrays) {
              for (var i = 0, len = current.length; i < len; i++) {
                if (!currentKeysSchema.includes(typeDetect(current[i]).toLowerCase())) {
                  throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, ".").concat(i, ", the ").concat(i, "th element (equal to ").concat(JSON.stringify(current[i], null, 0), ") is of a type ").concat(typeDetect(current[i]).toLowerCase(), ", but only the following are allowed by the ").concat(opts.optsVarName, ".schema: ").concat(currentKeysSchema.join(", ")));
                }
              }
            } else {
              throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " was customised to ").concat(typeDetect(current) !== "string" ? '"' : "").concat(JSON.stringify(current, null, 0)).concat(typeDetect(current) !== "string" ? '"' : "", " (type: ").concat(typeDetect(current).toLowerCase(), ") which is not among the allowed types in schema (which is equal to ").concat(JSON.stringify(currentKeysSchema, null, 0), ")"));
            }
          }
        } else {
          ignoredPathsArr.push(innerObj.path);
        }
      } else if (refHasThisPathDefined) {
        var compareTo = objectPath.get(ref, innerObj.path);

        if (opts.acceptArrays && isArr(current) && !opts.acceptArraysIgnore.includes(key)) {
          var allMatch = current.every(function (el) {
            return typeDetect(el).toLowerCase() === typeDetect(ref[key]).toLowerCase();
          });

          if (!allMatch) {
            throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " was customised to be array, but not all of its elements are ").concat(typeDetect(ref[key]).toLowerCase(), "-type"));
          }
        } else if (typeDetect(current) !== typeDetect(compareTo)) {
          throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " was customised to ").concat(typeDetect(current).toLowerCase() === "string" ? "" : '"').concat(JSON.stringify(current, null, 0)).concat(typeDetect(current).toLowerCase() === "string" ? "" : '"', " which is not ").concat(typeDetect(compareTo).toLowerCase(), " but ").concat(typeDetect(current).toLowerCase()));
        }
      }

      return current;
    });
  }

  function externalApi(obj, ref, originalOptions) {
    return checkTypesMini(obj, ref, originalOptions);
  }

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** `Object#toString` result references. */
  var objectTag = '[object Object]';
  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */

  function isHostObject$1(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;

    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }

    return result;
  }
  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */


  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }
  /** Used for built-in method references. */


  var funcProto$1 = Function.prototype,
      objectProto$1 = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString$1 = funcProto$1.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  /** Used to infer the `Object` constructor. */

  var objectCtorString = funcToString$1.call(Object);
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString$1 = objectProto$1.toString;
  /** Built-in value references. */

  var getPrototype = overArg(Object.getPrototypeOf, Object);
  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */

  function isObjectLike$1(value) {
    return !!value && _typeof(value) == 'object';
  }
  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */


  function isPlainObject(value) {
    if (!isObjectLike$1(value) || objectToString$1.call(value) != objectTag || isHostObject$1(value)) {
      return false;
    }

    var proto = getPrototype(value);

    if (proto === null) {
      return true;
    }

    var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$1.call(Ctor) == objectCtorString;
  }

  var lodash_isplainobject = isPlainObject;

  function alts(str, originalOpts) {
    function existy(x) {
      return x != null;
    } // validate
    // ================


    if (typeof str !== "string") {
      throw new TypeError("html-img-alt/alts(): [THROW_ID_01] Input must be string! Currently its type is: ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
    }

    if (existy(originalOpts) && !lodash_isplainobject(originalOpts)) {
      throw new TypeError("html-img-alt/alts(): [THROW_ID_02] Options object must be a plain object! Currently its type is: ".concat(_typeof(originalOpts), ", equal to: ").concat(JSON.stringify(originalOpts, null, 4)));
    } // vars
    // ================


    var finalSpaceNeeded;
    var withinImageTag = false;
    var withinQuotes = false;
    var imageTagStartedAt = 0;
    var whitespaceStarted = 0;
    var slashStartedAt = 0;
    var altContentsStart = 0;
    var withinAlt = false; // marker to catch the beginning of the ALT attribute's value

    var thereShouldBeEqualCharacterHere = 0;
    var thereShouldBeTheFirstDoubleQuoteHere = 0;
    var thereShouldBeTheSecondDoubleQuoteHere = 0;
    var addSpaceInTheFutureBeforeSlashOrBracket = false;
    var altBegins = null;
    var rangesArr = new Ranges(); // plausibleWithinQuotesRanges - some ranges should be included only if they are
    // not within double quotes. However, there can be cases when double quotes are
    // not closed - there's single double quote and after some whitespace there's
    // closing bracket. In this case, the condition "within double quotes" is false
    // regarding characters that follow that first unclosed double quote.
    // This is the temporary array which houses such "plausible" ranges.

    var plausibleWithinQuotesRanges = new Ranges(); // opts
    // ================

    var defaults = {
      unfancyTheAltContents: true
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    externalApi(opts, defaults, {
      msg: "html-img-alt/alts(): [THROW_ID_03]"
    }); // traverse the string
    // ================

    for (var i = 0, len = str.length; i < len; i++) {
      var charcode = str[i].charCodeAt(0); // catch the beginning of the IMG tag:
      // ================

      if ("".concat(str[i]).concat(str[i + 1]).concat(str[i + 2]).concat(str[i + 3]) === "<img") {
        if (!withinImageTag) {
          withinImageTag = true;
          imageTagStartedAt = i;
        } else {
          throw new TypeError("html-img-alt/alts(): [THROW_ID_02] Something is wrong with the code - there's an image tag within an image tag. First image tag was: ".concat(str.slice(imageTagStartedAt - 20, imageTagStartedAt + 20), ", then before it was closed, we've got this: ").concat(str.slice(i - 20, i + 20)));
        } // console.log('!!! 096 SETTING finalSpaceNeeded = true')
        // finalSpaceNeeded = true

      } // catch closing slash
      // ================


      if (withinImageTag && str[i] === "/") {
        slashStartedAt = i;
      } // catch the ALT attributes within IMG tags:
      // ================


      if (withinImageTag && !withinQuotes) {
        if ("".concat(str[i]).concat(str[i + 1]).concat(str[i + 2]) === "alt") {
          altBegins = i;
        } else if ("".concat(str[i - 3]).concat(str[i - 2]).concat(str[i - 1]) === "alt") {
          withinAlt = true; // this flag is necessary only until we catch the first
          // double quote of the alt attribute
        }
      } // turn off the withinAlt flag
      // this flag lets through whitespace, "=" and double quotes.
      // This paves the way for the future, when within double quote detection
      // we'll see this withinAlt flag, we'll know it's alt attribute contents starting.
      // ================


      if (withinAlt && str[i].trim() !== "" && str[i] !== "=" && str[i] !== '"') {
        withinAlt = false;
      } // catch missing equal after ALT attr:
      // ================


      if (altBegins && i === altBegins + 3) {
        // altContentsStart = i
        thereShouldBeEqualCharacterHere = i;
      } // catch equal character after alt:
      // ================


      if (str[i] === "=") {
        if (altBegins) {
          // turn off the equal character search flag
          thereShouldBeEqualCharacterHere = 0;
          thereShouldBeTheFirstDoubleQuoteHere = i + 1;
        } // equal sign wipes and plausible ranges. Plausibles are possible when
        // first double quote is inclosed, and closing bracket follows.
        // If there's equal character, this means another attribute is mingling,
        // which negates the case.


        if (plausibleWithinQuotesRanges.current() && plausibleWithinQuotesRanges.current().length) {
          plausibleWithinQuotesRanges.wipe();
        } // if double quote follows this equal sign, and we are "withinQuotes",
        // turn off withinQuotes.
        // This is a precaution against broken code, like unit test 06.01:
        // `zzz<img alt="  class="" />zzz`
        //


        if (withinQuotes && str[i + 1] === '"') {
          withinQuotes = false;
          altContentsStart = 0;
        }
      } // whitespace ends - this section must be above "catch the closing IMG tag" section.
      // it's dependent upon (still) existing `slashStartedAt` which latter section deletes
      // ================


      if (whitespaceStarted && str[i].trim() !== "") {
        // put up excessive whitespace for deletion
        if (whitespaceStarted < i - 1 + (str[i] === ">" || str[i] === "'" || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere ? 1 : 0)) {
          if (!withinQuotes) {
            rangesArr.add(whitespaceStarted, i - 1 + (str[i] === ">" || str[i] === "'" || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere ? 1 : 0));
          } else {
            plausibleWithinQuotesRanges.add(whitespaceStarted, i - 1 + (str[i] === ">" || str[i] === "'" || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere ? 1 : 0));
          }

          if (str[i] === ">" || str[i] === "/") {
            // missingTrailingSpace = ' '
            addSpaceInTheFutureBeforeSlashOrBracket = true;
          }

          if (thereShouldBeEqualCharacterHere && str[i] !== "=" && i >= thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere && str[i] !== '"' && i >= thereShouldBeTheFirstDoubleQuoteHere) {
            var missingTrailingSpace = "";
            var location = thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere;
            var thingToAdd = "";

            if (thereShouldBeEqualCharacterHere) {
              thingToAdd += "=";
            }

            if (!withinQuotes) {
              rangesArr.add(location, location, "".concat(thingToAdd, "\"\"").concat(missingTrailingSpace));
            } // else {
            // it might be that first double quote in alt=" is unclosed, and closing bracket follows.
            // that's why we add such range into a separate "plausibles" ranges list,
            // which would get merged into regular rangesArr in case second double quote is
            // never found.
            // plausibleWithinQuotesRanges.add(
            //   location, location, thingToAdd + '""' + missingTrailingSpace
            // )
            // }


            thereShouldBeEqualCharacterHere = 0;
            thereShouldBeTheFirstDoubleQuoteHere = 0;
          }
        }

        whitespaceStarted = 0;
      } // catch the state of being inside double quotes:
      // ================


      if (str[i] === '"') {
        withinQuotes = !withinQuotes;

        if (i === thereShouldBeTheFirstDoubleQuoteHere) {
          thereShouldBeTheSecondDoubleQuoteHere = i + 1;
        }
      } // calculate the logic regarding missing double quotes recognition
      // ================


      if (str[i] === '"') {
        if (thereShouldBeTheFirstDoubleQuoteHere && i >= thereShouldBeTheFirstDoubleQuoteHere) {
          thereShouldBeTheSecondDoubleQuoteHere = thereShouldBeTheFirstDoubleQuoteHere;
          thereShouldBeTheFirstDoubleQuoteHere = 0; // set the marker altContentsStart

          if (withinAlt) {
            altContentsStart = i + 1;
            withinAlt = false;
          } // also, if the character after first double quote is closing slash (XHTML)
          // or closing bracket (HTML), add a missing space in front of it:


          if (str[i + 1].trim() === "/" || str[i + 1].trim() === ">") {
            addSpaceInTheFutureBeforeSlashOrBracket = true;
            finalSpaceNeeded = false;
          }
        } else if (thereShouldBeTheSecondDoubleQuoteHere && i >= thereShouldBeTheSecondDoubleQuoteHere) {
          // If double quotes are closed properly, wipe the plausibles
          // that practically means we don't delete the whitespace within double quotes.
          // however, rogue unclosed double quote might throw us off track, hence
          // this contraption with plausible ranges.
          // We catch plausible ranges and keep until double quote is closed.
          // If it is never closed, all those ranges are merged into rangesArr for deletion.
          plausibleWithinQuotesRanges.wipe();
          thereShouldBeTheSecondDoubleQuoteHere = 0; // if the following character is closing slash (XHTML) or closing bracket (HTML),
          // add space in front of it

          if (str[i + 1] === ">" || str[i + 1] === "/") {
            addSpaceInTheFutureBeforeSlashOrBracket = true;
            finalSpaceNeeded = false;
          } // reset altContentsStart


          if (altContentsStart && opts.unfancyTheAltContents) {
            var altContents = str.slice(altContentsStart, i);

            if (unfancy(altContents).trim() !== altContents) {
              rangesArr.add(altContentsStart, i, unfancy(altContents).trim());
            }
          }

          altContentsStart = 0;
        }
      } // catch single quotes
      // ================


      if (withinImageTag && !withinQuotes && str[i] === "'") {
        rangesArr.add(i, i + 1);

        if (str[i + 1] === "/" || str[i + 1] === ">") {
          addSpaceInTheFutureBeforeSlashOrBracket = true;
        }
      } // catch the closing IMG tag and perform all the tasks
      // ================


      if (withinImageTag && str[i] === ">") {
        imageTagStartedAt = 0;
        withinQuotes = false; // add ALT attr if missing:

        if (altBegins === null) {
          if (slashStartedAt) {
            // XHTML.
            rangesArr.add(slashStartedAt, slashStartedAt, ' alt="" ');
          } else {
            // HTML.
            rangesArr.add(i, i, ' alt="" ');
          }

          finalSpaceNeeded = false;
          addSpaceInTheFutureBeforeSlashOrBracket = false;
        }

        if (!slashStartedAt && thereShouldBeEqualCharacterHere === i) {
          // if ALT has no equal and is right before closing bracket
          // HTML
          rangesArr.add(i, i, '="" ');
          finalSpaceNeeded = false;
        } else if (slashStartedAt && thereShouldBeEqualCharacterHere === i - 1) {
          // if ALT has no equal and is right before closing bracket
          // XHTML
          rangesArr.add(i - 1, i - 1, '="" ');
          finalSpaceNeeded = false;
        }

        if (!slashStartedAt && thereShouldBeTheFirstDoubleQuoteHere && thereShouldBeTheFirstDoubleQuoteHere <= i) {
          // HTML
          rangesArr.add(i, i, '"" ');
          addSpaceInTheFutureBeforeSlashOrBracket = false;
        } else if (slashStartedAt && thereShouldBeTheFirstDoubleQuoteHere && thereShouldBeTheFirstDoubleQuoteHere <= i) {
          // XHTML
          rangesArr.add(i - 1, i - 1, '"" ');
          addSpaceInTheFutureBeforeSlashOrBracket = false;
        } else if (!slashStartedAt && thereShouldBeTheSecondDoubleQuoteHere && thereShouldBeTheSecondDoubleQuoteHere <= i) {
          // HTML
          rangesArr.add(i, i, '"');
          addSpaceInTheFutureBeforeSlashOrBracket = true; // so if the second double quote is missing, merge in the plausible ranges, if any
          // and now the actual merging of plausible ranges:

          if (plausibleWithinQuotesRanges.current()) {
            plausibleWithinQuotesRanges.current().forEach(function (key) {
              rangesArr.add(key[0], key[1], key[2]);
            });
          } // after merging in, clean up the ranges


          rangesArr.current(); // .current will mutate the ranges in the memory, cleaning, merging,
          // normalising them.

          plausibleWithinQuotesRanges.wipe();
        } else if (slashStartedAt && thereShouldBeTheSecondDoubleQuoteHere && thereShouldBeTheSecondDoubleQuoteHere <= i) {
          // XHTML
          rangesArr.add(thereShouldBeTheSecondDoubleQuoteHere + 1, thereShouldBeTheSecondDoubleQuoteHere + 1, '"'); // so if the second double quote is missing, merge in the plausible ranges, if any

          if (plausibleWithinQuotesRanges.current()) {
            plausibleWithinQuotesRanges.current().forEach(function (key) {
              rangesArr.add(key[0], key[1], key[2]);
            });
          }

          plausibleWithinQuotesRanges.wipe(); // after merging in, clean up the ranges

          rangesArr.current(); // .current will mutate the ranges in the memory, cleaning, merging,
          // normalising them.
        }

        if (finalSpaceNeeded || addSpaceInTheFutureBeforeSlashOrBracket) {
          if (slashStartedAt) {
            rangesArr.add(slashStartedAt, slashStartedAt, " ");
          } else {
            rangesArr.add(i, i, " ");
          }
        }

        withinImageTag = false;
        altBegins = null;
        thereShouldBeTheFirstDoubleQuoteHere = 0;
        thereShouldBeTheSecondDoubleQuoteHere = 0;
        finalSpaceNeeded = false;
      } // any non-empty space character ends the closing slash flag.
      // we don't want anything deleted after slash if it's not closing-slash but content
      // REVIEW slashStartedAt, probably needs more rules to make the case more precise


      if (slashStartedAt && str[i] !== "/" && str[i].trim() !== "") {
        slashStartedAt = 0; // altContentsStart = 0

        thereShouldBeEqualCharacterHere = 0;
        thereShouldBeTheFirstDoubleQuoteHere = 0;
        thereShouldBeTheSecondDoubleQuoteHere = 0;
      } // whitespace starts
      // ================


      if (withinImageTag && str[i].trim() === "" && !whitespaceStarted) {
        whitespaceStarted = i;
      } // ================================================================
      // ================================================================

    } // crunch all the slices from rangesArr:
    // ================


    if (existy(rangesArr.current()) && rangesArr.current().length > 0) {
      return rangesApply(str, rangesArr.current());
    }

    return str;
  }

  return alts;

})));

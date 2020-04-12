/**
 * chlu
 * CH-ange-L-og U-pdate - Automatically fix errors in your changelog file
 * Version: 3.7.60
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/chlu
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.chlu = factory());
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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  /*! https://mths.be/punycode v1.4.1 by @mathias */

  /** Highest positive signed 32-bit float value */
  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

  /** Bootstring parameters */

  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80

  var delimiter = '-'; // '\x2D'
  var regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars

  var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

  /** Error messages */

  var errors = {
    'overflow': 'Overflow: input needs wider integers to process',
    'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
    'invalid-input': 'Invalid input'
  };
  /** Convenience shortcuts */

  var baseMinusTMin = base - tMin;
  var floor = Math.floor;
  var stringFromCharCode = String.fromCharCode;
  /*--------------------------------------------------------------------------*/

  /**
   * A generic error utility function.
   * @private
   * @param {String} type The error type.
   * @returns {Error} Throws a `RangeError` with the applicable error message.
   */

  function error(type) {
    throw new RangeError(errors[type]);
  }
  /**
   * A generic `Array#map` utility function.
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function that gets called for every array
   * item.
   * @returns {Array} A new array of values returned by the callback function.
   */


  function map(array, fn) {
    var length = array.length;
    var result = [];

    while (length--) {
      result[length] = fn(array[length]);
    }

    return result;
  }
  /**
   * A simple `Array#map`-like wrapper to work with domain name strings or email
   * addresses.
   * @private
   * @param {String} domain The domain name or email address.
   * @param {Function} callback The function that gets called for every
   * character.
   * @returns {Array} A new string of characters returned by the callback
   * function.
   */


  function mapDomain(string, fn) {
    var parts = string.split('@');
    var result = '';

    if (parts.length > 1) {
      // In email addresses, only the domain name should be punycoded. Leave
      // the local part (i.e. everything up to `@`) intact.
      result = parts[0] + '@';
      string = parts[1];
    } // Avoid `split(regex)` for IE8 compatibility. See #17.


    string = string.replace(regexSeparators, '\x2E');
    var labels = string.split('.');
    var encoded = map(labels, fn).join('.');
    return result + encoded;
  }
  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   * @see `punycode.ucs2.encode`
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode.ucs2
   * @name decode
   * @param {String} string The Unicode input string (UCS-2).
   * @returns {Array} The new array of code points.
   */


  function ucs2decode(string) {
    var output = [],
        counter = 0,
        length = string.length,
        value,
        extra;

    while (counter < length) {
      value = string.charCodeAt(counter++);

      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // high surrogate, and there is a next character
        extra = string.charCodeAt(counter++);

        if ((extra & 0xFC00) == 0xDC00) {
          // low surrogate
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // unmatched surrogate; only append this code unit, in case the next
          // code unit is the high surrogate of a surrogate pair
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }

    return output;
  }
  /**
   * Converts a digit/integer into a basic code point.
   * @see `basicToDigit()`
   * @private
   * @param {Number} digit The numeric value of a basic code point.
   * @returns {Number} The basic code point whose value (when used for
   * representing integers) is `digit`, which needs to be in the range
   * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
   * used; else, the lowercase form is used. The behavior is undefined
   * if `flag` is non-zero and `digit` has no uppercase form.
   */


  function digitToBasic(digit, flag) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  }
  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   * @private
   */


  function adapt(delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor(delta / damp) : delta >> 1;
    delta += floor(delta / numPoints);

    for (;
    /* no initialization */
    delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor(delta / baseMinusTMin);
    }

    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  }
  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   * @memberOf punycode
   * @param {String} input The string of Unicode symbols.
   * @returns {String} The resulting Punycode string of ASCII-only symbols.
   */

  function encode(input) {
    var n,
        delta,
        handledCPCount,
        basicLength,
        bias,
        j,
        m,
        q,
        k,
        t,
        currentValue,
        output = [],

    /** `inputLength` will hold the number of code points in `input`. */
    inputLength,

    /** Cached calculation results */
    handledCPCountPlusOne,
        baseMinusT,
        qMinusT; // Convert the input in UCS-2 to Unicode

    input = ucs2decode(input); // Cache the length

    inputLength = input.length; // Initialize the state

    n = initialN;
    delta = 0;
    bias = initialBias; // Handle the basic code points

    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j];

      if (currentValue < 0x80) {
        output.push(stringFromCharCode(currentValue));
      }
    }

    handledCPCount = basicLength = output.length; // `handledCPCount` is the number of code points that have been handled;
    // `basicLength` is the number of basic code points.
    // Finish the basic string - if it is not empty - with a delimiter

    if (basicLength) {
      output.push(delimiter);
    } // Main encoding loop:


    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next
      // larger one:
      for (m = maxInt, j = 0; j < inputLength; ++j) {
        currentValue = input[j];

        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      } // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
      // but guard against overflow


      handledCPCountPlusOne = handledCPCount + 1;

      if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
        error('overflow');
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (j = 0; j < inputLength; ++j) {
        currentValue = input[j];

        if (currentValue < n && ++delta > maxInt) {
          error('overflow');
        }

        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer
          for (q = delta, k = base;;
          /* no condition */
          k += base) {
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

            if (q < t) {
              break;
            }

            qMinusT = q - t;
            baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
            q = floor(qMinusT / baseMinusT);
          }

          output.push(stringFromCharCode(digitToBasic(q, 0)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }

      ++delta;
      ++n;
    }

    return output.join('');
  }
  /**
   * Converts a Unicode string representing a domain name or an email address to
   * Punycode. Only the non-ASCII parts of the domain name will be converted,
   * i.e. it doesn't matter if you call it with a domain that's already in
   * ASCII.
   * @memberOf punycode
   * @param {String} input The domain name or email address to convert, as a
   * Unicode string.
   * @returns {String} The Punycode representation of the given domain name or
   * email address.
   */

  function toASCII(input) {
    return mapDomain(input, function (string) {
      return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
    });
  }

  // Copyright Joyent, Inc. and other Node contributors.
  function isNull(arg) {
    return arg === null;
  }
  function isNullOrUndefined(arg) {
    return arg == null;
  }
  function isString(arg) {
    return typeof arg === 'string';
  }
  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  // If obj.hasOwnProperty has been overridden, then calling
  // obj.hasOwnProperty(prop) will break.
  // See: https://github.com/joyent/node/issues/1707
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
  };

  function stringifyPrimitive(v) {
    switch (typeof v) {
      case 'string':
        return v;

      case 'boolean':
        return v ? 'true' : 'false';

      case 'number':
        return isFinite(v) ? v : '';

      default:
        return '';
    }
  }

  function stringify(obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';

    if (obj === null) {
      obj = undefined;
    }

    if (typeof obj === 'object') {
      return map$1(objectKeys(obj), function (k) {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;

        if (isArray(obj[k])) {
          return map$1(obj[k], function (v) {
            return ks + encodeURIComponent(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
        }
      }).join(sep);
    }

    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
  }

  function map$1(xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];

    for (var i = 0; i < xs.length; i++) {
      res.push(f(xs[i], i));
    }

    return res;
  }

  var objectKeys = Object.keys || function (obj) {
    var res = [];

    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
    }

    return res;
  };

  function parse(qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};

    if (typeof qs !== 'string' || qs.length === 0) {
      return obj;
    }

    var regexp = /\+/g;
    qs = qs.split(sep);
    var maxKeys = 1000;

    if (options && typeof options.maxKeys === 'number') {
      maxKeys = options.maxKeys;
    }

    var len = qs.length; // maxKeys <= 0 means that we should not limit keys count

    if (maxKeys > 0 && len > maxKeys) {
      len = maxKeys;
    }

    for (var i = 0; i < len; ++i) {
      var x = qs[i].replace(regexp, '%20'),
          idx = x.indexOf(eq),
          kstr,
          vstr,
          k,
          v;

      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }

      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);

      if (!hasOwnProperty(obj, k)) {
        obj[k] = v;
      } else if (isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    }

    return obj;
  }

  // Copyright Joyent, Inc. and other Node contributors.
  var url = {
    parse: urlParse,
    resolve: urlResolve,
    resolveObject: urlResolveObject,
    format: urlFormat,
    Url: Url
  };
  function Url() {
    this.protocol = null;
    this.slashes = null;
    this.auth = null;
    this.host = null;
    this.port = null;
    this.hostname = null;
    this.hash = null;
    this.search = null;
    this.query = null;
    this.pathname = null;
    this.path = null;
    this.href = null;
  } // Reference: RFC 3986, RFC 1808, RFC 2396
  // define these here so at least they only have to be
  // compiled once on the first module load.

  var protocolPattern = /^([a-z0-9.+-]+:)/i,
      portPattern = /:[0-9]*$/,
      // Special case for a simple path URL
  simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
      // RFC 2396: characters reserved for delimiting URLs.
  // We actually just auto-escape these.
  delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
      // RFC 2396: characters not allowed for various reasons.
  unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
      // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
  autoEscape = ['\''].concat(unwise),
      // Characters that are never ever allowed in a hostname.
  // Note that any invalid chars are also handled, but these
  // are the ones that are *expected* to be seen, so we fast-path
  // them.
  nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
      hostEndingChars = ['/', '?', '#'],
      hostnameMaxLen = 255,
      hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
      hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
      // protocols that can allow "unsafe" and "unwise" chars.
  unsafeProtocol = {
    'javascript': true,
    'javascript:': true
  },
      // protocols that never have a hostname.
  hostlessProtocol = {
    'javascript': true,
    'javascript:': true
  },
      // protocols that always contain a // bit.
  slashedProtocol = {
    'http': true,
    'https': true,
    'ftp': true,
    'gopher': true,
    'file': true,
    'http:': true,
    'https:': true,
    'ftp:': true,
    'gopher:': true,
    'file:': true
  };

  function urlParse(url, parseQueryString, slashesDenoteHost) {
    if (url && isObject(url) && url instanceof Url) return url;
    var u = new Url();
    u.parse(url, parseQueryString, slashesDenoteHost);
    return u;
  }

  Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
    return parse$1(this, url, parseQueryString, slashesDenoteHost);
  };

  function parse$1(self, url, parseQueryString, slashesDenoteHost) {
    if (!isString(url)) {
      throw new TypeError('Parameter \'url\' must be a string, not ' + typeof url);
    } // Copy chrome, IE, opera backslash-handling behavior.
    // Back slashes before the query string get converted to forward slashes
    // See: https://code.google.com/p/chromium/issues/detail?id=25916


    var queryIndex = url.indexOf('?'),
        splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
        uSplit = url.split(splitter),
        slashRegex = /\\/g;
    uSplit[0] = uSplit[0].replace(slashRegex, '/');
    url = uSplit.join(splitter);
    var rest = url; // trim before proceeding.
    // This is to support parse stuff like "  http://foo.com  \n"

    rest = rest.trim();

    if (!slashesDenoteHost && url.split('#').length === 1) {
      // Try fast path regexp
      var simplePath = simplePathPattern.exec(rest);

      if (simplePath) {
        self.path = rest;
        self.href = rest;
        self.pathname = simplePath[1];

        if (simplePath[2]) {
          self.search = simplePath[2];

          if (parseQueryString) {
            self.query = parse(self.search.substr(1));
          } else {
            self.query = self.search.substr(1);
          }
        } else if (parseQueryString) {
          self.search = '';
          self.query = {};
        }

        return self;
      }
    }

    var proto = protocolPattern.exec(rest);

    if (proto) {
      proto = proto[0];
      var lowerProto = proto.toLowerCase();
      self.protocol = lowerProto;
      rest = rest.substr(proto.length);
    } // figure out if it's got a host
    // user@server is *always* interpreted as a hostname, and url
    // resolution will treat //foo/bar as host=foo,path=bar because that's
    // how the browser resolves relative URLs.


    if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      var slashes = rest.substr(0, 2) === '//';

      if (slashes && !(proto && hostlessProtocol[proto])) {
        rest = rest.substr(2);
        self.slashes = true;
      }
    }

    var i, hec, l, p;

    if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
      // there's a hostname.
      // the first instance of /, ?, ;, or # ends the host.
      //
      // If there is an @ in the hostname, then non-host chars *are* allowed
      // to the left of the last @ sign, unless some host-ending character
      // comes *before* the @-sign.
      // URLs are obnoxious.
      //
      // ex:
      // http://a@b@c/ => user:a@b host:c
      // http://a@b?@c => user:a host:c path:/?@c
      // v0.12 TODO(isaacs): This is not quite how Chrome does things.
      // Review our test case against browsers more comprehensively.
      // find the first instance of any hostEndingChars
      var hostEnd = -1;

      for (i = 0; i < hostEndingChars.length; i++) {
        hec = rest.indexOf(hostEndingChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
      } // at this point, either we have an explicit point where the
      // auth portion cannot go past, or the last @ char is the decider.


      var auth, atSign;

      if (hostEnd === -1) {
        // atSign can be anywhere.
        atSign = rest.lastIndexOf('@');
      } else {
        // atSign must be in auth portion.
        // http://a@b/c@d => host:b auth:a path:/c@d
        atSign = rest.lastIndexOf('@', hostEnd);
      } // Now we have a portion which is definitely the auth.
      // Pull that off.


      if (atSign !== -1) {
        auth = rest.slice(0, atSign);
        rest = rest.slice(atSign + 1);
        self.auth = decodeURIComponent(auth);
      } // the host is the remaining to the left of the first non-host char


      hostEnd = -1;

      for (i = 0; i < nonHostChars.length; i++) {
        hec = rest.indexOf(nonHostChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
      } // if we still have not hit it, then the entire thing is a host.


      if (hostEnd === -1) hostEnd = rest.length;
      self.host = rest.slice(0, hostEnd);
      rest = rest.slice(hostEnd); // pull out port.

      parseHost(self); // we've indicated that there is a hostname,
      // so even if it's empty, it has to be present.

      self.hostname = self.hostname || ''; // if hostname begins with [ and ends with ]
      // assume that it's an IPv6 address.

      var ipv6Hostname = self.hostname[0] === '[' && self.hostname[self.hostname.length - 1] === ']'; // validate a little.

      if (!ipv6Hostname) {
        var hostparts = self.hostname.split(/\./);

        for (i = 0, l = hostparts.length; i < l; i++) {
          var part = hostparts[i];
          if (!part) continue;

          if (!part.match(hostnamePartPattern)) {
            var newpart = '';

            for (var j = 0, k = part.length; j < k; j++) {
              if (part.charCodeAt(j) > 127) {
                // we replace non-ASCII char with a temporary placeholder
                // we need this to make sure size of hostname is not
                // broken by replacing non-ASCII by nothing
                newpart += 'x';
              } else {
                newpart += part[j];
              }
            } // we test again with ASCII char only


            if (!newpart.match(hostnamePartPattern)) {
              var validParts = hostparts.slice(0, i);
              var notHost = hostparts.slice(i + 1);
              var bit = part.match(hostnamePartStart);

              if (bit) {
                validParts.push(bit[1]);
                notHost.unshift(bit[2]);
              }

              if (notHost.length) {
                rest = '/' + notHost.join('.') + rest;
              }

              self.hostname = validParts.join('.');
              break;
            }
          }
        }
      }

      if (self.hostname.length > hostnameMaxLen) {
        self.hostname = '';
      } else {
        // hostnames are always lower case.
        self.hostname = self.hostname.toLowerCase();
      }

      if (!ipv6Hostname) {
        // IDNA Support: Returns a punycoded representation of "domain".
        // It only converts parts of the domain name that
        // have non-ASCII characters, i.e. it doesn't matter if
        // you call it with a domain that already is ASCII-only.
        self.hostname = toASCII(self.hostname);
      }

      p = self.port ? ':' + self.port : '';
      var h = self.hostname || '';
      self.host = h + p;
      self.href += self.host; // strip [ and ] from the hostname
      // the host field still retains them, though

      if (ipv6Hostname) {
        self.hostname = self.hostname.substr(1, self.hostname.length - 2);

        if (rest[0] !== '/') {
          rest = '/' + rest;
        }
      }
    } // now rest is set to the post-host stuff.
    // chop off any delim chars.


    if (!unsafeProtocol[lowerProto]) {
      // First, make 100% sure that any "autoEscape" chars get
      // escaped, even if encodeURIComponent doesn't think they
      // need to be.
      for (i = 0, l = autoEscape.length; i < l; i++) {
        var ae = autoEscape[i];
        if (rest.indexOf(ae) === -1) continue;
        var esc = encodeURIComponent(ae);

        if (esc === ae) {
          esc = escape(ae);
        }

        rest = rest.split(ae).join(esc);
      }
    } // chop off from the tail first.


    var hash = rest.indexOf('#');

    if (hash !== -1) {
      // got a fragment string.
      self.hash = rest.substr(hash);
      rest = rest.slice(0, hash);
    }

    var qm = rest.indexOf('?');

    if (qm !== -1) {
      self.search = rest.substr(qm);
      self.query = rest.substr(qm + 1);

      if (parseQueryString) {
        self.query = parse(self.query);
      }

      rest = rest.slice(0, qm);
    } else if (parseQueryString) {
      // no query string, but parseQueryString still requested
      self.search = '';
      self.query = {};
    }

    if (rest) self.pathname = rest;

    if (slashedProtocol[lowerProto] && self.hostname && !self.pathname) {
      self.pathname = '/';
    } //to support http.request


    if (self.pathname || self.search) {
      p = self.pathname || '';
      var s = self.search || '';
      self.path = p + s;
    } // finally, reconstruct the href based on what has been validated.


    self.href = format(self);
    return self;
  } // format a parsed object into a url string


  function urlFormat(obj) {
    // ensure it's an object, and not a string url.
    // If it's an obj, this is a no-op.
    // this way, you can call url_format() on strings
    // to clean up potentially wonky urls.
    if (isString(obj)) obj = parse$1({}, obj);
    return format(obj);
  }

  function format(self) {
    var auth = self.auth || '';

    if (auth) {
      auth = encodeURIComponent(auth);
      auth = auth.replace(/%3A/i, ':');
      auth += '@';
    }

    var protocol = self.protocol || '',
        pathname = self.pathname || '',
        hash = self.hash || '',
        host = false,
        query = '';

    if (self.host) {
      host = auth + self.host;
    } else if (self.hostname) {
      host = auth + (self.hostname.indexOf(':') === -1 ? self.hostname : '[' + this.hostname + ']');

      if (self.port) {
        host += ':' + self.port;
      }
    }

    if (self.query && isObject(self.query) && Object.keys(self.query).length) {
      query = stringify(self.query);
    }

    var search = self.search || query && '?' + query || '';
    if (protocol && protocol.substr(-1) !== ':') protocol += ':'; // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
    // unless they had them to begin with.

    if (self.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
      host = '//' + (host || '');
      if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
    } else if (!host) {
      host = '';
    }

    if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
    if (search && search.charAt(0) !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, function (match) {
      return encodeURIComponent(match);
    });
    search = search.replace('#', '%23');
    return protocol + host + pathname + search + hash;
  }

  Url.prototype.format = function () {
    return format(this);
  };

  function urlResolve(source, relative) {
    return urlParse(source, false, true).resolve(relative);
  }

  Url.prototype.resolve = function (relative) {
    return this.resolveObject(urlParse(relative, false, true)).format();
  };

  function urlResolveObject(source, relative) {
    if (!source) return relative;
    return urlParse(source, false, true).resolveObject(relative);
  }

  Url.prototype.resolveObject = function (relative) {
    if (isString(relative)) {
      var rel = new Url();
      rel.parse(relative, false, true);
      relative = rel;
    }

    var result = new Url();
    var tkeys = Object.keys(this);

    for (var tk = 0; tk < tkeys.length; tk++) {
      var tkey = tkeys[tk];
      result[tkey] = this[tkey];
    } // hash is always overridden, no matter what.
    // even href="" will remove it.


    result.hash = relative.hash; // if the relative url is empty, then there's nothing left to do here.

    if (relative.href === '') {
      result.href = result.format();
      return result;
    } // hrefs like //foo/bar always cut to the protocol.


    if (relative.slashes && !relative.protocol) {
      // take everything except the protocol from relative
      var rkeys = Object.keys(relative);

      for (var rk = 0; rk < rkeys.length; rk++) {
        var rkey = rkeys[rk];
        if (rkey !== 'protocol') result[rkey] = relative[rkey];
      } //urlParse appends trailing / to urls like http://www.example.com


      if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
        result.path = result.pathname = '/';
      }

      result.href = result.format();
      return result;
    }

    var relPath;

    if (relative.protocol && relative.protocol !== result.protocol) {
      // if it's a known url protocol, then changing
      // the protocol does weird things
      // first, if it's not file:, then we MUST have a host,
      // and if there was a path
      // to begin with, then we MUST have a path.
      // if it is file:, then the host is dropped,
      // because that's known to be hostless.
      // anything else is assumed to be absolute.
      if (!slashedProtocol[relative.protocol]) {
        var keys = Object.keys(relative);

        for (var v = 0; v < keys.length; v++) {
          var k = keys[v];
          result[k] = relative[k];
        }

        result.href = result.format();
        return result;
      }

      result.protocol = relative.protocol;

      if (!relative.host && !hostlessProtocol[relative.protocol]) {
        relPath = (relative.pathname || '').split('/');

        while (relPath.length && !(relative.host = relPath.shift()));

        if (!relative.host) relative.host = '';
        if (!relative.hostname) relative.hostname = '';
        if (relPath[0] !== '') relPath.unshift('');
        if (relPath.length < 2) relPath.unshift('');
        result.pathname = relPath.join('/');
      } else {
        result.pathname = relative.pathname;
      }

      result.search = relative.search;
      result.query = relative.query;
      result.host = relative.host || '';
      result.auth = relative.auth;
      result.hostname = relative.hostname || relative.host;
      result.port = relative.port; // to support http.request

      if (result.pathname || result.search) {
        var p = result.pathname || '';
        var s = result.search || '';
        result.path = p + s;
      }

      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    }

    var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
        isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
        mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
        removeAllDots = mustEndAbs,
        srcPath = result.pathname && result.pathname.split('/') || [],
        psychotic = result.protocol && !slashedProtocol[result.protocol];
    relPath = relative.pathname && relative.pathname.split('/') || []; // if the url is a non-slashed url, then relative
    // links like ../.. should be able
    // to crawl up to the hostname, as well.  This is strange.
    // result.protocol has already been set by now.
    // Later on, put the first path part into the host field.

    if (psychotic) {
      result.hostname = '';
      result.port = null;

      if (result.host) {
        if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
      }

      result.host = '';

      if (relative.protocol) {
        relative.hostname = null;
        relative.port = null;

        if (relative.host) {
          if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
        }

        relative.host = null;
      }

      mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
    }

    var authInHost;

    if (isRelAbs) {
      // it's absolute.
      result.host = relative.host || relative.host === '' ? relative.host : result.host;
      result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
      result.search = relative.search;
      result.query = relative.query;
      srcPath = relPath; // fall through to the dot-handling below.
    } else if (relPath.length) {
      // it's relative
      // throw away the existing file, and take the new path instead.
      if (!srcPath) srcPath = [];
      srcPath.pop();
      srcPath = srcPath.concat(relPath);
      result.search = relative.search;
      result.query = relative.query;
    } else if (!isNullOrUndefined(relative.search)) {
      // just pull out the search.
      // like href='?foo'.
      // Put this after the other two cases because it simplifies the booleans
      if (psychotic) {
        result.hostname = result.host = srcPath.shift(); //occationaly the auth can get stuck only in host
        //this especially happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')

        authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;

        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }

      result.search = relative.search;
      result.query = relative.query; //to support http.request

      if (!isNull(result.pathname) || !isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
      }

      result.href = result.format();
      return result;
    }

    if (!srcPath.length) {
      // no path at all.  easy.
      // we've already handled the other stuff above.
      result.pathname = null; //to support http.request

      if (result.search) {
        result.path = '/' + result.search;
      } else {
        result.path = null;
      }

      result.href = result.format();
      return result;
    } // if a url ENDs in . or .., then it must get a trailing slash.
    // however, if it ends in anything else non-slashy,
    // then it must NOT get a trailing slash.


    var last = srcPath.slice(-1)[0];
    var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === ''; // strip single dots, resolve double dots to parent dir
    // if the path tries to go above the root, `up` ends up > 0

    var up = 0;

    for (var i = srcPath.length; i >= 0; i--) {
      last = srcPath[i];

      if (last === '.') {
        srcPath.splice(i, 1);
      } else if (last === '..') {
        srcPath.splice(i, 1);
        up++;
      } else if (up) {
        srcPath.splice(i, 1);
        up--;
      }
    } // if the path is allowed to go above the root, restore leading ..s


    if (!mustEndAbs && !removeAllDots) {
      for (; up--; up) {
        srcPath.unshift('..');
      }
    }

    if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
      srcPath.unshift('');
    }

    if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
      srcPath.push('');
    }

    var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/'; // put the host back

    if (psychotic) {
      result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : ''; //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')

      authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;

      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }

    mustEndAbs = mustEndAbs || result.host && srcPath.length;

    if (mustEndAbs && !isAbsolute) {
      srcPath.unshift('');
    }

    if (!srcPath.length) {
      result.pathname = null;
      result.path = null;
    } else {
      result.pathname = srcPath.join('/');
    } //to support request.http


    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }

    result.auth = relative.auth || result.auth;
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  };

  Url.prototype.parseHost = function () {
    return parseHost(this);
  };

  function parseHost(self) {
    var host = self.host;
    var port = portPattern.exec(host);

    if (port) {
      port = port[0];

      if (port !== ':') {
        self.port = port.substr(1);
      }

      host = host.substr(0, host.length - port.length);
    }

    if (host) self.hostname = host;
  }

  var url$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    parse: urlParse,
    resolve: urlResolve,
    resolveObject: urlResolveObject,
    format: urlFormat,
    'default': url,
    Url: Url
  });

  var gitHostInfo = createCommonjsModule(function (module) {

    var gitHosts = module.exports = {
      github: {
        // First two are insecure and generally shouldn't be used any more, but
        // they are still supported.
        'protocols': ['git', 'http', 'git+ssh', 'git+https', 'ssh', 'https'],
        'domain': 'github.com',
        'treepath': 'tree',
        'filetemplate': 'https://{auth@}raw.githubusercontent.com/{user}/{project}/{committish}/{path}',
        'bugstemplate': 'https://{domain}/{user}/{project}/issues',
        'gittemplate': 'git://{auth@}{domain}/{user}/{project}.git{#committish}',
        'tarballtemplate': 'https://codeload.{domain}/{user}/{project}/tar.gz/{committish}'
      },
      bitbucket: {
        'protocols': ['git+ssh', 'git+https', 'ssh', 'https'],
        'domain': 'bitbucket.org',
        'treepath': 'src',
        'tarballtemplate': 'https://{domain}/{user}/{project}/get/{committish}.tar.gz'
      },
      gitlab: {
        'protocols': ['git+ssh', 'git+https', 'ssh', 'https'],
        'domain': 'gitlab.com',
        'treepath': 'tree',
        'bugstemplate': 'https://{domain}/{user}/{project}/issues',
        'httpstemplate': 'git+https://{auth@}{domain}/{user}/{projectPath}.git{#committish}',
        'tarballtemplate': 'https://{domain}/{user}/{project}/repository/archive.tar.gz?ref={committish}',
        'pathmatch': /^[/]([^/]+)[/]((?!.*(\/-\/|\/repository\/archive\.tar\.gz\?=.*|\/repository\/[^/]+\/archive.tar.gz$)).*?)(?:[.]git|[/])?$/
      },
      gist: {
        'protocols': ['git', 'git+ssh', 'git+https', 'ssh', 'https'],
        'domain': 'gist.github.com',
        'pathmatch': /^[/](?:([^/]+)[/])?([a-z0-9]{32,})(?:[.]git)?$/,
        'filetemplate': 'https://gist.githubusercontent.com/{user}/{project}/raw{/committish}/{path}',
        'bugstemplate': 'https://{domain}/{project}',
        'gittemplate': 'git://{domain}/{project}.git{#committish}',
        'sshtemplate': 'git@{domain}:/{project}.git{#committish}',
        'sshurltemplate': 'git+ssh://git@{domain}/{project}.git{#committish}',
        'browsetemplate': 'https://{domain}/{project}{/committish}',
        'browsefiletemplate': 'https://{domain}/{project}{/committish}{#path}',
        'docstemplate': 'https://{domain}/{project}{/committish}',
        'httpstemplate': 'git+https://{domain}/{project}.git{#committish}',
        'shortcuttemplate': '{type}:{project}{#committish}',
        'pathtemplate': '{project}{#committish}',
        'tarballtemplate': 'https://codeload.github.com/gist/{project}/tar.gz/{committish}',
        'hashformat': function (fragment) {
          return 'file-' + formatHashFragment(fragment);
        }
      }
    };
    var gitHostDefaults = {
      'sshtemplate': 'git@{domain}:{user}/{project}.git{#committish}',
      'sshurltemplate': 'git+ssh://git@{domain}/{user}/{project}.git{#committish}',
      'browsetemplate': 'https://{domain}/{user}/{project}{/tree/committish}',
      'browsefiletemplate': 'https://{domain}/{user}/{project}/{treepath}/{committish}/{path}{#fragment}',
      'docstemplate': 'https://{domain}/{user}/{project}{/tree/committish}#readme',
      'httpstemplate': 'git+https://{auth@}{domain}/{user}/{project}.git{#committish}',
      'filetemplate': 'https://{domain}/{user}/{project}/raw/{committish}/{path}',
      'shortcuttemplate': '{type}:{user}/{project}{#committish}',
      'pathtemplate': '{user}/{project}{#committish}',
      'pathmatch': /^[/]([^/]+)[/]([^/]+?)(?:[.]git|[/])?$/,
      'hashformat': formatHashFragment
    };
    Object.keys(gitHosts).forEach(function (name) {
      Object.keys(gitHostDefaults).forEach(function (key) {
        if (gitHosts[name][key]) return;
        gitHosts[name][key] = gitHostDefaults[key];
      });
      gitHosts[name].protocols_re = RegExp('^(' + gitHosts[name].protocols.map(function (protocol) {
        return protocol.replace(/([\\+*{}()[\]$^|])/g, '\\$1');
      }).join('|') + '):$');
    });

    function formatHashFragment(fragment) {
      return fragment.toLowerCase().replace(/^\W+|\/|\W+$/g, '').replace(/\W+/g, '-');
    }
  });
  var gitHostInfo_1 = gitHostInfo.github;
  var gitHostInfo_2 = gitHostInfo.bitbucket;
  var gitHostInfo_3 = gitHostInfo.gitlab;
  var gitHostInfo_4 = gitHostInfo.gist;

  /* eslint-disable node/no-deprecated-api */
  // copy-pasta util._extend from node's source, to avoid pulling
  // the whole util module into peoples' webpack bundles.

  /* istanbul ignore next */


  var extend = Object.assign || function _extend(target, source) {
    // Don't do anything if source isn't an object
    if (source === null || typeof source !== 'object') return target;
    var keys = Object.keys(source);
    var i = keys.length;

    while (i--) {
      target[keys[i]] = source[keys[i]];
    }

    return target;
  };

  var gitHost = GitHost;

  function GitHost(type, user, auth, project, committish, defaultRepresentation, opts) {
    var gitHostInfo$1 = this;
    gitHostInfo$1.type = type;
    Object.keys(gitHostInfo[type]).forEach(function (key) {
      gitHostInfo$1[key] = gitHostInfo[type][key];
    });
    gitHostInfo$1.user = user;
    gitHostInfo$1.auth = auth;
    gitHostInfo$1.project = project;
    gitHostInfo$1.committish = committish;
    gitHostInfo$1.default = defaultRepresentation;
    gitHostInfo$1.opts = opts || {};
  }

  GitHost.prototype.hash = function () {
    return this.committish ? '#' + this.committish : '';
  };

  GitHost.prototype._fill = function (template, opts) {
    if (!template) return;
    var vars = extend({}, opts);
    vars.path = vars.path ? vars.path.replace(/^[/]+/g, '') : '';
    opts = extend(extend({}, this.opts), opts);
    var self = this;
    Object.keys(this).forEach(function (key) {
      if (self[key] != null && vars[key] == null) vars[key] = self[key];
    });
    var rawAuth = vars.auth;
    var rawcommittish = vars.committish;
    var rawFragment = vars.fragment;
    var rawPath = vars.path;
    var rawProject = vars.project;
    Object.keys(vars).forEach(function (key) {
      var value = vars[key];

      if ((key === 'path' || key === 'project') && typeof value === 'string') {
        vars[key] = value.split('/').map(function (pathComponent) {
          return encodeURIComponent(pathComponent);
        }).join('/');
      } else {
        vars[key] = encodeURIComponent(value);
      }
    });
    vars['auth@'] = rawAuth ? rawAuth + '@' : '';
    vars['#fragment'] = rawFragment ? '#' + this.hashformat(rawFragment) : '';
    vars.fragment = vars.fragment ? vars.fragment : '';
    vars['#path'] = rawPath ? '#' + this.hashformat(rawPath) : '';
    vars['/path'] = vars.path ? '/' + vars.path : '';
    vars.projectPath = rawProject.split('/').map(encodeURIComponent).join('/');

    if (opts.noCommittish) {
      vars['#committish'] = '';
      vars['/tree/committish'] = '';
      vars['/committish'] = '';
      vars.committish = '';
    } else {
      vars['#committish'] = rawcommittish ? '#' + rawcommittish : '';
      vars['/tree/committish'] = vars.committish ? '/' + vars.treepath + '/' + vars.committish : '';
      vars['/committish'] = vars.committish ? '/' + vars.committish : '';
      vars.committish = vars.committish || 'master';
    }

    var res = template;
    Object.keys(vars).forEach(function (key) {
      res = res.replace(new RegExp('[{]' + key + '[}]', 'g'), vars[key]);
    });

    if (opts.noGitPlus) {
      return res.replace(/^git[+]/, '');
    } else {
      return res;
    }
  };

  GitHost.prototype.ssh = function (opts) {
    return this._fill(this.sshtemplate, opts);
  };

  GitHost.prototype.sshurl = function (opts) {
    return this._fill(this.sshurltemplate, opts);
  };

  GitHost.prototype.browse = function (P, F, opts) {
    if (typeof P === 'string') {
      if (typeof F !== 'string') {
        opts = F;
        F = null;
      }

      return this._fill(this.browsefiletemplate, extend({
        fragment: F,
        path: P
      }, opts));
    } else {
      return this._fill(this.browsetemplate, P);
    }
  };

  GitHost.prototype.docs = function (opts) {
    return this._fill(this.docstemplate, opts);
  };

  GitHost.prototype.bugs = function (opts) {
    return this._fill(this.bugstemplate, opts);
  };

  GitHost.prototype.https = function (opts) {
    return this._fill(this.httpstemplate, opts);
  };

  GitHost.prototype.git = function (opts) {
    return this._fill(this.gittemplate, opts);
  };

  GitHost.prototype.shortcut = function (opts) {
    return this._fill(this.shortcuttemplate, opts);
  };

  GitHost.prototype.path = function (opts) {
    return this._fill(this.pathtemplate, opts);
  };

  GitHost.prototype.tarball = function (opts_) {
    var opts = extend({}, opts_, {
      noCommittish: false
    });
    return this._fill(this.tarballtemplate, opts);
  };

  GitHost.prototype.file = function (P, opts) {
    return this._fill(this.filetemplate, extend({
      path: P
    }, opts));
  };

  GitHost.prototype.getDefaultRepresentation = function () {
    return this.default;
  };

  GitHost.prototype.toString = function (opts) {
    if (this.default && typeof this[this.default] === 'function') return this[this.default](opts);
    return this.sshurl(opts);
  };

  var require$$0 = getCjsExportFromNamespace(url$1);

  var hostedGitInfo = createCommonjsModule(function (module) {

    var GitHost = module.exports = gitHost;
    var protocolToRepresentationMap = {
      'git+ssh:': 'sshurl',
      'git+https:': 'https',
      'ssh:': 'sshurl',
      'git:': 'git'
    };

    function protocolToRepresentation(protocol) {
      return protocolToRepresentationMap[protocol] || protocol.slice(0, -1);
    }

    var authProtocols = {
      'git:': true,
      'https:': true,
      'git+https:': true,
      'http:': true,
      'git+http:': true
    };
    var cache = {};

    module.exports.fromUrl = function (giturl, opts) {
      if (typeof giturl !== 'string') return;
      var key = giturl + JSON.stringify(opts || {});

      if (!(key in cache)) {
        cache[key] = fromUrl(giturl, opts);
      }

      return cache[key];
    };

    function fromUrl(giturl, opts) {
      if (giturl == null || giturl === '') return;
      var url = fixupUnqualifiedGist(isGitHubShorthand(giturl) ? 'github:' + giturl : giturl);
      var parsed = parseGitUrl(url);
      var shortcutMatch = url.match(new RegExp('^([^:]+):(?:(?:[^@:]+(?:[^@]+)?@)?([^/]*))[/](.+?)(?:[.]git)?($|#)'));
      var matches = Object.keys(gitHostInfo).map(function (gitHostName) {
        try {
          var gitHostInfo$1 = gitHostInfo[gitHostName];
          var auth = null;

          if (parsed.auth && authProtocols[parsed.protocol]) {
            auth = decodeURIComponent(parsed.auth);
          }

          var committish = parsed.hash ? decodeURIComponent(parsed.hash.substr(1)) : null;
          var user = null;
          var project = null;
          var defaultRepresentation = null;

          if (shortcutMatch && shortcutMatch[1] === gitHostName) {
            user = shortcutMatch[2] && decodeURIComponent(shortcutMatch[2]);
            project = decodeURIComponent(shortcutMatch[3]);
            defaultRepresentation = 'shortcut';
          } else {
            if (parsed.host && parsed.host !== gitHostInfo$1.domain && parsed.host.replace(/^www[.]/, '') !== gitHostInfo$1.domain) return;
            if (!gitHostInfo$1.protocols_re.test(parsed.protocol)) return;
            if (!parsed.path) return;
            var pathmatch = gitHostInfo$1.pathmatch;
            var matched = parsed.path.match(pathmatch);
            if (!matched) return;
            /* istanbul ignore else */

            if (matched[1] !== null && matched[1] !== undefined) {
              user = decodeURIComponent(matched[1].replace(/^:/, ''));
            }

            project = decodeURIComponent(matched[2]);
            defaultRepresentation = protocolToRepresentation(parsed.protocol);
          }

          return new GitHost(gitHostName, user, auth, project, committish, defaultRepresentation, opts);
        } catch (ex) {
          /* istanbul ignore else */
          if (ex instanceof URIError) ; else throw ex;
        }
      }).filter(function (gitHostInfo) {
        return gitHostInfo;
      });
      if (matches.length !== 1) return;
      return matches[0];
    }

    function isGitHubShorthand(arg) {
      // Note: This does not fully test the git ref format.
      // See https://www.kernel.org/pub/software/scm/git/docs/git-check-ref-format.html
      //
      // The only way to do this properly would be to shell out to
      // git-check-ref-format, and as this is a fast sync function,
      // we don't want to do that.  Just let git fail if it turns
      // out that the commit-ish is invalid.
      // GH usernames cannot start with . or -
      return /^[^:@%/\s.-][^:@%/\s]*[/][^:@\s/%]+(?:#.*)?$/.test(arg);
    }

    function fixupUnqualifiedGist(giturl) {
      // necessary for round-tripping gists
      var parsed = require$$0.parse(giturl);

      if (parsed.protocol === 'gist:' && parsed.host && !parsed.path) {
        return parsed.protocol + '/' + parsed.host;
      } else {
        return giturl;
      }
    }

    function parseGitUrl(giturl) {
      var matched = giturl.match(/^([^@]+)@([^:/]+):[/]?((?:[^/]+[/])?[^/]+?)(?:[.]git)?(#.*)?$/);
      if (!matched) return require$$0.parse(giturl);
      return {
        protocol: 'git+ssh:',
        slashes: true,
        auth: matched[1],
        host: matched[2],
        port: null,
        hostname: matched[2],
        hash: matched[4],
        search: null,
        query: null,
        pathname: '/' + matched[3],
        path: '/' + matched[3],
        href: 'git+ssh://' + matched[1] + '@' + matched[2] + '/' + matched[3] + (matched[4] || '')
      };
    }
  });
  var hostedGitInfo_1 = hostedGitInfo.fromUrl;

  const {
    parse: parse$2
  } = require$$0;
  const URL_PATTERNS = new RegExp(/^\/?:?([/\w-.]+)\/([\w-.]+)\/?$/);
  const GITHUB_API = new RegExp(/^\/repos\/([\w-.]+)\/([\w-.]+)\/(?:tarball|zipball)(?:\/.+)?$/);
  const GITHUB_CODELOAD = new RegExp(/^\/([\w-.]+)\/([\w-.]+)\/(?:legacy\.(?:zip|tar\.gz))(?:\/.+)?$/);

  var src = url => {
    const modifiedURL = url // Prepend `https` to the URL so that `url.parse` will see the value of `url` as an actual `url`, and therefore, correctly parse it.
    .replace(/^git@/, `https://git@`) // Remove `.git` from any URL before applying regular expressions to the string. Removing `.git` through a non capture group is kind of difficult.
    .replace(/\.git$/, ``);
    const parsedURL = parse$2(modifiedURL);

    const format = matches => {
      return {
        browse: createBrowseURL(parsedURL, matches),
        domain: parsedURL.host,
        project: matches[2] || null,
        type: getType(parsedURL),
        user: matches[1] || null
      };
    };

    if (parsedURL.host) {
      if (parsedURL.host.includes(`api.github.com`)) {
        const matches = GITHUB_API.exec(parsedURL.pathname) || [];
        return format(matches);
      }

      if (parsedURL.host.includes(`codeload.github.com`)) {
        const matches = GITHUB_CODELOAD.exec(parsedURL.pathname) || [];
        return format(matches);
      }
    }

    return format(URL_PATTERNS.exec(parsedURL.pathname) || []);
  };

  function getType(parsedURL) {
    if (typeof parsedURL.host !== `string`) {
      return null;
    }

    if (parsedURL.host.indexOf(`github`) !== -1) {
      return 'github';
    }

    if (parsedURL.host.indexOf(`gitlab`) !== -1) {
      return 'gitlab';
    }

    return null;
  }

  function createBrowseURL(parsedURL, matches) {
    const protocol = parsedURL.protocol === `http:` ? `http:` : `https:`;
    const browseURL = `${protocol}//${parsedURL.host}/${matches[1]}/${matches[2]}`;
    return () => {
      return browseURL;
    };
  }

  var src$1 = packageData => {
    if (!packageData || !packageData.repository || typeof packageData.repository !== 'string' && !packageData.repository.url) {
      throw new Error(`No valid "repository" data found in package metadata. Please see https://docs.npmjs.com/files/package.json#repository for proper syntax.`);
    }

    const repositoryURL = typeof packageData.repository === 'string' ? packageData.repository : packageData.repository.url;
    return hostedGitInfo.fromUrl(repositoryURL) || src(repositoryURL);
  };

  var semverCompare = function cmp(a, b) {
    var pa = a.split('.');
    var pb = b.split('.');

    for (var i = 0; i < 3; i++) {
      var na = Number(pa[i]);
      var nb = Number(pb[i]);
      if (na > nb) return 1;
      if (nb > na) return -1;
      if (!isNaN(na) && isNaN(nb)) return 1;
      if (isNaN(na) && !isNaN(nb)) return -1;
    }

    return 0;
  };

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

    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    /** Detect free variable `self`. */

    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
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
        Symbol = root.Symbol,
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

    var symbolProto = Symbol ? Symbol.prototype : undefined,
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
      getTag = function (value) {
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
      var type = typeof value;
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
      var type = typeof value;
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
      return !!value && typeof value == 'object';
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

  /**
   * ast-monkey-traverse
   * Utility library to traverse parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)
   * Version: 1.12.7
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse
   */

  function trimFirstDot(str) {
    if (typeof str === "string" && str.length && str[0] === ".") {
      return str.slice(1);
    }

    return str;
  }

  function isObj(something) {
    return something && typeof something === "object" && !Array.isArray(something);
  }

  function astMonkeyTraverse(tree1, cb1) {
    const stop = {
      now: false
    };

    function traverseInner(treeOriginal, callback, innerObj, stop) {
      const tree = lodash_clonedeep(treeOriginal);
      let i;
      let len;
      let res;
      innerObj = Object.assign({
        depth: -1,
        path: ""
      }, innerObj);
      innerObj.depth += 1;

      if (Array.isArray(tree)) {
        for (i = 0, len = tree.length; i < len; i++) {
          if (stop.now) {
            break;
          }

          const path = `${innerObj.path}.${i}`;

          if (tree[i] !== undefined) {
            innerObj.parent = lodash_clonedeep(tree);
            innerObj.parentType = "array";
            res = traverseInner(callback(tree[i], undefined, Object.assign({}, innerObj, {
              path: trimFirstDot(path)
            }), stop), callback, Object.assign({}, innerObj, {
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
        for (const key in tree) {
          if (stop.now && key != null) {
            break;
          }

          const path = `${innerObj.path}.${key}`;

          if (innerObj.depth === 0 && key != null) {
            innerObj.topmostKey = key;
          }

          innerObj.parent = lodash_clonedeep(tree);
          innerObj.parentType = "object";
          res = traverseInner(callback(key, tree[key], Object.assign({}, innerObj, {
            path: trimFirstDot(path)
          }), stop), callback, Object.assign({}, innerObj, {
            path: trimFirstDot(path)
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

    return traverseInner(tree1, cb1, {}, stop);
  }

  /**
   * ast-contains-only-empty-space
   * Returns Boolean depending if passed AST contain only empty space
   * Version: 1.9.2
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-contains-only-empty-space
   */

  function containsOnlyEmptySpace(input) {
    if (typeof input === "string") {
      return !input.trim().length;
    } else if (!["object", "string"].includes(typeof input) || !input) {
      return false;
    }

    let found = true;
    input = astMonkeyTraverse(input, (key, val, innerObj, stop) => {
      const current = val !== undefined ? val : key;

      if (typeof current === "string" && current.trim().length) {
        found = false;
        stop.now = true;
      }

      return current;
    });
    return found;
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


  var funcProto = Function.prototype,
      objectProto = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$1 = objectProto.hasOwnProperty;
  /** Used to infer the `Object` constructor. */

  var objectCtorString = funcToString.call(Object);
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString = objectProto.toString;
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

  function isObjectLike(value) {
    return !!value && typeof value == 'object';
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
    if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
      return false;
    }

    var proto = getPrototype(value);

    if (proto === null) {
      return true;
    }

    var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }

  var lodash_isplainobject = isPlainObject;

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';
  /** Used for built-in method references. */

  var objectProto$1 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString$1 = objectProto$1.toString;
  /**
   * The base implementation of methods like `_.max` and `_.min` which accepts a
   * `comparator` to determine the extremum value.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The iteratee invoked per iteration.
   * @param {Function} comparator The comparator used to compare values.
   * @returns {*} Returns the extremum value.
   */

  function baseExtremum(array, iteratee, comparator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index],
          current = iteratee(value);

      if (current != null && (computed === undefined ? current === current && !isSymbol(current) : comparator(current, computed))) {
        var computed = current,
            result = value;
      }
    }

    return result;
  }
  /**
   * The base implementation of `_.lt` which doesn't coerce arguments to numbers.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is less than `other`,
   *  else `false`.
   */


  function baseLt(value, other) {
    return value < other;
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


  function isObjectLike$1(value) {
    return !!value && typeof value == 'object';
  }
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified,
   *  else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */


  function isSymbol(value) {
    return typeof value == 'symbol' || isObjectLike$1(value) && objectToString$1.call(value) == symbolTag;
  }
  /**
   * This method returns the first argument given to it.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'user': 'fred' };
   *
   * _.identity(object) === object;
   * // => true
   */


  function identity(value) {
    return value;
  }
  /**
   * Computes the minimum value of `array`. If `array` is empty or falsey,
   * `undefined` is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the minimum value.
   * @example
   *
   * _.min([4, 2, 8, 6]);
   * // => 2
   *
   * _.min([]);
   * // => undefined
   */


  function min(array) {
    return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
  }

  var lodash_min = min;

  /**
   * Check if the given `year` is a leap year
   *
   * @api public
   * @param {Date|Number} year
   * @return {Boolean}
   */
  var isLeapYear = function (year) {
    year = year instanceof Date ? year.getFullYear() : year;
    return !(new Date(year, 1, 29).getMonth() - 1);
  };

  var dehumanizeDate = createCommonjsModule(function (module, exports) {

    var MONTH_NAMES = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    var DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    var DAYS_IN_MONTH = [31, null, // 29 in leap years, otherwise 28
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    exports = module.exports = function parse(str, options) {
      if (typeof options !== 'object') {
        options = {
          usa: options
        };
      }

      options = options || {};
      options.usa = options.usa !== undefined ? options.usa : false;
      options.now = options.now !== undefined ? options.now : new Date();
      options.cutoff = options.cutoff !== undefined ? options.cutoff : 80;
      str = str.trim().toLowerCase();
      return parseNearbyDays(str, options.now) || parseLastThisNext(str, options.now) || parseAgoFrom(str, options.now) || parseNumberDate(str, options.usa) || parseNumberDateShortYear(str, options.usa, options.cutoff) || parseNumberDateNoYear(str, options.usa, options.now) || parseWordyDate(str, options.now, options.cutoff) || parseIso8601Date(str);
    };

    exports.default = module.exports;
    var NUMBER = /^[0-9]+$/;
    var NUMBER_WITH_ORDINAL = /^([0-9]+)(st|nd|rd|th)?$/;
    var NUMBER_DATE = /^(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{4})$/;
    var NUMBER_DATE_USA = /^(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{4})$/;
    var NUMBER_DATE_SHORT_YEAR = /^(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{2})$/;
    var NUMBER_DATE_SHORT_YEAR_USA = /^(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+([0-9]{2})$/;
    var NUMBER_DATE_NO_YEAR = /^(3[0-1]|[1-2][0-9]|0?[1-9])[,\|\\\/\-\. ]+(1[0-2]|0?[1-9])$/;
    var NUMBER_DATE_NO_YEAR_USA = /^(1[0-2]|0?[1-9])[,\|\\\/\-\. ]+(3[0-1]|[1-2][0-9]|0?[1-9])$/;
    var ISO_8601_DATE = /^([0-9]{4})[-/\\]?(1[0-2]|0?[1-9])[-/\\]?(3[0-1]|[1-2][0-9]|0?[1-9])$/;

    function addDays(now, numberOfDays) {
      var result = new Date(now * 1 + numberOfDays * 60 * 60 * 24 * 1000);
      return date(result.getFullYear(), result.getMonth(), result.getDate());
    }

    exports.parseNearbyDays = parseNearbyDays;

    function parseNearbyDays(string, now) {
      if (string == 'today') {
        return date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (string == 'yesterday') {
        return addDays(now, -1);
      } else if (string == 'tomorrow') {
        return addDays(now, +1);
      } else {
        return null;
      }
    }

    exports.parseLastThisNext = parseLastThisNext;

    function parseLastThisNext(string, now) {
      var tokens = string.split(/[,\s]+/);

      if (['last', 'this', 'next'].indexOf(tokens[0]) >= 0 && tokens.length === 2) {
        var dayAbbreviations = DAY_NAMES.map(function (name) {
          return name.substr(0, tokens[1].length);
        });
        var dayIndex = dayAbbreviations.indexOf(tokens[1]);

        if (dayIndex !== -1 && dayAbbreviations.indexOf(tokens[1], dayIndex + 1) === -1) {
          var dayDiff = dayIndex - now.getDay();
          if (dayDiff < 0) dayDiff += 7;
          if (tokens[0] === 'last') return addDays(now, dayDiff - 7);
          if (tokens[0] === 'this') return addDays(now, dayDiff);
          if (tokens[0] === 'next') return addDays(now, dayDiff + 7);
        }

        return null;
      } else {
        return null;
      }
    }

    exports.parseAgoFrom = parseAgoFrom;

    function parseAgoFrom(string, now) {
      var tokens = string.split(/[,\s]+/);

      if (['day', 'days', 'week', 'weeks'].indexOf(tokens[1]) >= 0 && tokens[0].match(NUMBER) && ['ago', 'from'].indexOf(tokens[2]) >= 0) {
        if (tokens[2] === 'ago') {
          if (['day', 'days'].indexOf(tokens[1]) >= 0) return addDays(now, tokens[0] * -1);
          if (['week', 'weeks'].indexOf(tokens[1]) >= 0) return addDays(now, tokens[0] * 7 * -1);
        }

        if (tokens[2] === 'from') {
          if (['day', 'days'].indexOf(tokens[1]) >= 0) return addDays(now, tokens[0]);
          if (['week', 'weeks'].indexOf(tokens[1]) >= 0) return addDays(now, tokens[0] * 7);
        }

        return null;
      } else {
        return null;
      }
    }

    exports.parseNumberDate = parseNumberDate;

    function parseNumberDate(str, usa) {
      var match = usa ? NUMBER_DATE_USA.exec(str) : NUMBER_DATE.exec(str);

      if (match) {
        return usa ? date(+match[3], match[1] - 1, +match[2]) : date(+match[3], match[2] - 1, +match[1]);
      } else {
        return null;
      }
    }

    exports.parseNumberDateShortYear = parseNumberDateShortYear;

    function parseNumberDateShortYear(str, usa, cutoff) {
      var match = usa ? NUMBER_DATE_SHORT_YEAR_USA.exec(str) : NUMBER_DATE_SHORT_YEAR.exec(str);

      if (match) {
        var year = +match[3];
        if (year > cutoff) year += 1900;else year += 2000;
        return usa ? date(year, match[1] - 1, +match[2]) : date(year, match[2] - 1, +match[1]);
      } else {
        return null;
      }
    }

    exports.parseNumberDateNoYear = parseNumberDateNoYear;

    function parseNumberDateNoYear(str, usa, today) {
      var match = usa ? NUMBER_DATE_NO_YEAR_USA.exec(str) : NUMBER_DATE_NO_YEAR.exec(str);

      if (match) {
        var year = today.getFullYear();
        return usa ? date(year, match[1] - 1, +match[2]) : date(year, match[2] - 1, +match[1]);
      } else {
        return null;
      }
    }

    exports.parseWordyDate = parseWordyDate;

    function parseWordyDate(string, today, cutoff) {
      var tokens = string.split(/[,\s]+/);

      if (tokens.length >= 2) {
        var match;

        if (match = tokens[0].match(NUMBER_WITH_ORDINAL)) {
          return parseWordyDateParts(match[1], tokens[1], tokens[2], today, cutoff);
        } else if (match = tokens[1].match(NUMBER_WITH_ORDINAL)) {
          return parseWordyDateParts(match[1], tokens[0], tokens[2], today, cutoff);
        } else {
          return null;
        }
      }
    }

    function parseWordyDateParts(rawDay, rawMonth, rawYear, today, cutoff) {
      var day = +rawDay;
      var month = monthFromName(rawMonth);
      var year;
      if (rawYear) year = rawYear.match(NUMBER) ? rawYear * 1 : null;else year = today.getFullYear();
      if (year < 100 && year >= cutoff) year += 1900;
      if (year < 100) year += 2000;
      if (!(day && month !== null && year)) return null;
      return date(year, month, day);
    }

    function parseIso8601Date(string) {
      var match;

      if (match = ISO_8601_DATE.exec(string)) {
        return date(+match[1], match[2] - 1, +match[3]);
      } else {
        return null;
      }
    }

    exports.monthFromName = monthFromName;

    function monthFromName(month) {
      var monthAbbreviations = MONTH_NAMES.map(function (name) {
        return name.substr(0, month.length);
      });
      var monthIndex = monthAbbreviations.indexOf(month);

      if (monthIndex !== -1 && monthAbbreviations.indexOf(month, monthIndex + 1) === -1) {
        return monthIndex;
      }

      return null;
    }

    exports.date = date;

    function date(year, month, day) {
      month++;
      if (month > 12 || month < 1) return null;
      if (day < 1) return null;

      if (month === 2) {
        if (day > (isLeapYear(year) ? 29 : 28)) return null;
      } else if (day > DAYS_IN_MONTH[month - 1]) {
        return null;
      }

      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      return year + '-' + month + '-' + day;
    }
  });
  var dehumanizeDate_1 = dehumanizeDate.parseNearbyDays;
  var dehumanizeDate_2 = dehumanizeDate.parseLastThisNext;
  var dehumanizeDate_3 = dehumanizeDate.parseAgoFrom;
  var dehumanizeDate_4 = dehumanizeDate.parseNumberDate;
  var dehumanizeDate_5 = dehumanizeDate.parseNumberDateShortYear;
  var dehumanizeDate_6 = dehumanizeDate.parseNumberDateNoYear;
  var dehumanizeDate_7 = dehumanizeDate.parseWordyDate;
  var dehumanizeDate_8 = dehumanizeDate.monthFromName;
  var dehumanizeDate_9 = dehumanizeDate.date;

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as references for various `Number` constants. */

  var INFINITY = 1 / 0;
  /** `Object#toString` result references. */

  var symbolTag$1 = '[object Symbol]';
  /** Used to match leading and trailing whitespace. */

  var reTrim = /^\s+|\s+$/g;
  /** Used to compose unicode character classes. */

  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
      rsComboSymbolsRange = '\\u20d0-\\u20f0',
      rsVarRange = '\\ufe0e\\ufe0f';
  /** Used to compose unicode capture groups. */

  var rsAstral = '[' + rsAstralRange + ']',
      rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsZWJ = '\\u200d';
  /** Used to compose unicode regexes. */

  var reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */

  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */

  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');
  /** Detect free variable `global` from Node.js. */

  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `self`. */

  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();
  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */

  function asciiToArray(string) {
    return string.split('');
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
   * @param {Array} array The array to inspect.
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
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */


  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

    return index;
  }
  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */


  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

    return index;
  }
  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */


  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }
  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function stringToArray(string) {
    return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
  }
  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }
  /** Used for built-in method references. */


  var objectProto$2 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString$2 = objectProto$2.toString;
  /** Built-in value references. */

  var Symbol$1 = root.Symbol;
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;
  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */

  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }

    end = end > length ? length : end;

    if (end < 0) {
      end += length;
    }

    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);

    while (++index < length) {
      result[index] = array[index + start];
    }

    return result;
  }
  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */


  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }

    if (isSymbol$1(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }
  /**
   * Casts `array` to a slice if it's needed.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {number} start The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the cast slice.
   */


  function castSlice(array, start, end) {
    var length = array.length;
    end = end === undefined ? length : end;
    return !start && end >= length ? array : baseSlice(array, start, end);
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


  function isObjectLike$2(value) {
    return !!value && typeof value == 'object';
  }
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */


  function isSymbol$1(value) {
    return typeof value == 'symbol' || isObjectLike$2(value) && objectToString$2.call(value) == symbolTag$1;
  }
  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */


  function toString(value) {
    return value == null ? '' : baseToString(value);
  }
  /**
   * Removes leading and trailing whitespace or specified characters from `string`.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to trim.
   * @param {string} [chars=whitespace] The characters to trim.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {string} Returns the trimmed string.
   * @example
   *
   * _.trim('  abc  ');
   * // => 'abc'
   *
   * _.trim('-_-abc-_-', '_-');
   * // => 'abc'
   *
   * _.map(['  foo  ', '  bar  '], _.trim);
   * // => ['foo', 'bar']
   */


  function trim(string, chars, guard) {
    string = toString(string);

    if (string && (guard || chars === undefined)) {
      return string.replace(reTrim, '');
    }

    if (!string || !(chars = baseToString(chars))) {
      return string;
    }

    var strSymbols = stringToArray(string),
        chrSymbols = stringToArray(chars),
        start = charsStartIndex(strSymbols, chrSymbols),
        end = charsEndIndex(strSymbols, chrSymbols) + 1;
    return castSlice(strSymbols, start, end).join('');
  }

  var lodash_trim = trim;

  /**
   * easy-replace
   * Replace strings with optional lookarounds, but without regexes
   * Version: 3.7.55
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/easy-replace
   */
  function astralAwareSearch(whereToLook, whatToLookFor, opts) {
    function existy(something) {
      return something != null;
    }

    if (typeof whereToLook !== "string" || whereToLook.length === 0 || typeof whatToLookFor !== "string" || whatToLookFor.length === 0) {
      return [];
    }

    const foundIndexArray = [];
    const arrWhereToLook = Array.from(whereToLook);
    const arrWhatToLookFor = Array.from(whatToLookFor);
    let found;

    for (let i = 0; i < arrWhereToLook.length; i++) {
      if (opts.i) {
        if (arrWhereToLook[i].toLowerCase() === arrWhatToLookFor[0].toLowerCase()) {
          found = true;

          for (let i2 = 0; i2 < arrWhatToLookFor.length; i2++) {
            if (!existy(arrWhereToLook[i + i2]) || !existy(arrWhatToLookFor[i2]) || arrWhereToLook[i + i2].toLowerCase() !== arrWhatToLookFor[i2].toLowerCase()) {
              found = false;
              break;
            }
          }

          if (found) {
            foundIndexArray.push(i);
          }
        }
      } else if (arrWhereToLook[i] === arrWhatToLookFor[0]) {
        found = true;

        for (let i2 = 0; i2 < arrWhatToLookFor.length; i2++) {
          if (arrWhereToLook[i + i2] !== arrWhatToLookFor[i2]) {
            found = false;
            break;
          }
        }

        if (found) {
          foundIndexArray.push(i);
        }
      }
    }

    return foundIndexArray;
  }

  function stringise(incoming) {
    function existy(something) {
      return something != null;
    }

    if (!existy(incoming) || typeof incoming === "boolean") {
      return [""];
    } else if (Array.isArray(incoming)) {
      return incoming.filter(el => existy(el) && typeof el !== "boolean").map(el => String(el)).filter(el => el.length > 0);
    }

    return [String(incoming)];
  }

  function iterateLeft(elem, arrSource, foundBeginningIndex, i) {
    let matched = true;
    const charsArray = Array.from(elem);

    for (let i2 = 0, len = charsArray.length; i2 < len; i2++) {
      if (i) {
        if (charsArray[i2].toLowerCase() !== arrSource[foundBeginningIndex - Array.from(elem).length + i2].toLowerCase()) {
          matched = false;
          break;
        }
      } else if (charsArray[i2] !== arrSource[foundBeginningIndex - Array.from(elem).length + i2]) {
        matched = false;
        break;
      }
    }

    return matched;
  }

  function iterateRight(elem, arrSource, foundEndingIndex, i) {
    let matched = true;
    const charsArray = Array.from(elem);

    for (let i2 = 0, len = charsArray.length; i2 < len; i2++) {
      if (i) {
        if (charsArray[i2].toLowerCase() !== arrSource[foundEndingIndex + i2].toLowerCase()) {
          matched = false;
          break;
        }
      } else if (charsArray[i2] !== arrSource[foundEndingIndex + i2]) {
        matched = false;
        break;
      }
    }

    return matched;
  }

  function er(originalSource, options, originalReplacement) {
    const defaults = {
      i: {
        leftOutsideNot: false,
        leftOutside: false,
        leftMaybe: false,
        searchFor: false,
        rightMaybe: false,
        rightOutside: false,
        rightOutsideNot: false
      }
    };
    const opts = Object.assign({}, defaults, options);
    const source = stringise(originalSource);
    opts.leftOutsideNot = stringise(opts.leftOutsideNot);
    opts.leftOutside = stringise(opts.leftOutside);
    opts.leftMaybe = stringise(opts.leftMaybe);
    opts.searchFor = String(opts.searchFor);
    opts.rightMaybe = stringise(opts.rightMaybe);
    opts.rightOutside = stringise(opts.rightOutside);
    opts.rightOutsideNot = stringise(opts.rightOutsideNot);
    const replacement = stringise(originalReplacement);
    const arrSource = Array.from(source[0]);
    let foundBeginningIndex;
    let foundEndingIndex;
    let matched;
    let found;
    const replacementRecipe = [];
    let result = "";
    const allResults = astralAwareSearch(source[0], opts.searchFor, {
      i: opts.i.searchFor
    });

    for (let resIndex = 0, resLen = allResults.length; resIndex < resLen; resIndex++) {
      const oneOfFoundIndexes = allResults[resIndex];
      foundBeginningIndex = oneOfFoundIndexes;
      foundEndingIndex = oneOfFoundIndexes + Array.from(opts.searchFor).length;

      if (opts.leftMaybe.length > 0) {
        for (let i = 0, len = opts.leftMaybe.length; i < len; i++) {
          matched = true;
          const splitLeftMaybe = Array.from(opts.leftMaybe[i]);

          for (let i2 = 0, len2 = splitLeftMaybe.length; i2 < len2; i2++) {
            if (opts.i.leftMaybe) {
              if (splitLeftMaybe[i2].toLowerCase() !== arrSource[oneOfFoundIndexes - splitLeftMaybe.length + i2].toLowerCase()) {
                matched = false;
                break;
              }
            } else if (splitLeftMaybe[i2] !== arrSource[oneOfFoundIndexes - splitLeftMaybe.length + i2]) {
              matched = false;
              break;
            }
          }

          if (matched && oneOfFoundIndexes - splitLeftMaybe.length < foundBeginningIndex) {
            foundBeginningIndex = oneOfFoundIndexes - splitLeftMaybe.length;
          }
        }
      }

      if (opts.rightMaybe.length > 0) {
        for (let i = 0, len = opts.rightMaybe.length; i < len; i++) {
          matched = true;
          const splitRightMaybe = Array.from(opts.rightMaybe[i]);

          for (let i2 = 0, len2 = splitRightMaybe.length; i2 < len2; i2++) {
            if (opts.i.rightMaybe) {
              if (splitRightMaybe[i2].toLowerCase() !== arrSource[oneOfFoundIndexes + Array.from(opts.searchFor).length + i2].toLowerCase()) {
                matched = false;
                break;
              }
            } else if (splitRightMaybe[i2] !== arrSource[oneOfFoundIndexes + Array.from(opts.searchFor).length + i2]) {
              matched = false;
              break;
            }
          }

          if (matched && foundEndingIndex < oneOfFoundIndexes + Array.from(opts.searchFor).length + splitRightMaybe.length) {
            foundEndingIndex = oneOfFoundIndexes + Array.from(opts.searchFor).length + splitRightMaybe.length;
          }
        }
      }

      if (opts.leftOutside[0] !== "") {
        found = false;

        for (let i = 0, len = opts.leftOutside.length; i < len; i++) {
          matched = iterateLeft(opts.leftOutside[i], arrSource, foundBeginningIndex, opts.i.leftOutside);

          if (matched) {
            found = true;
          }
        }

        if (!found) {
          continue;
        }
      }

      if (opts.rightOutside[0] !== "") {
        found = false;

        for (let i = 0, len = opts.rightOutside.length; i < len; i++) {
          matched = iterateRight(opts.rightOutside[i], arrSource, foundEndingIndex, opts.i.rightOutside);

          if (matched) {
            found = true;
          }
        }

        if (!found) {
          continue;
        }
      }

      if (opts.leftOutsideNot[0] !== "") {
        for (let i = 0, len = opts.leftOutsideNot.length; i < len; i++) {
          matched = iterateLeft(opts.leftOutsideNot[i], arrSource, foundBeginningIndex, opts.i.leftOutsideNot);

          if (matched) {
            foundBeginningIndex = -1;
            foundEndingIndex = -1;
            break;
          }
        }

        if (foundBeginningIndex === -1) {
          continue;
        }
      }

      if (opts.rightOutsideNot[0] !== "") {
        for (let i = 0, len = opts.rightOutsideNot.length; i < len; i++) {
          matched = iterateRight(opts.rightOutsideNot[i], arrSource, foundEndingIndex, opts.i.rightOutsideNot);

          if (matched) {
            foundBeginningIndex = -1;
            foundEndingIndex = -1;
            break;
          }
        }

        if (foundBeginningIndex === -1) {
          continue;
        }
      }

      replacementRecipe.push([foundBeginningIndex, foundEndingIndex]);
    }

    if (replacementRecipe.length > 0) {
      replacementRecipe.forEach((elem, i) => {
        if (replacementRecipe[i + 1] !== undefined && replacementRecipe[i][1] > replacementRecipe[i + 1][0]) {
          replacementRecipe[i + 1][0] = replacementRecipe[i][1];
        }
      });
      replacementRecipe.forEach((elem, i) => {
        if (elem[0] === elem[1]) {
          replacementRecipe.splice(i, 1);
        }
      });
    } else {
      return source.join("");
    }

    if (replacementRecipe.length > 0 && replacementRecipe[0][0] !== 0) {
      result += arrSource.slice(0, replacementRecipe[0][0]).join("");
    }

    replacementRecipe.forEach((elem, i) => {
      result += replacement.join("");

      if (replacementRecipe[i + 1] !== undefined) {
        result += arrSource.slice(replacementRecipe[i][1], replacementRecipe[i + 1][0]).join("");
      } else {
        result += arrSource.slice(replacementRecipe[i][1]).join("");
      }
    });
    return result;
  }

  var emojiRegex = function () {
    // https://mths.be/emoji
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83E\uDDD1(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFE])|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83E\uDDD1(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC3B\u200D\u2744|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDF])\u200D[\u2640\u2642])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  };

  var emojiRegex$1 = emojiRegex(); // REGEXES
  // -----------------------------------------------------------------------------

  var versionWithBracketsRegex = /\[v?\d+\.\d+(\.\d+)*\]/g;
  var versionWithoutBracketsRegex = /v?\d+\.\d+(\.\d+)*/g;
  var versionWithoutBracketsRegexNoVersion = /\d+\.\d+(\.\d+)*/g; // FUNCTIONS
  // -----------------------------------------------------------------------------

  function existy(x) {
    return x != null;
  }

  function truthy(x) {
    return x !== false && existy(x);
  }

  function isStr(something) {
    return typeof something === "string";
  }

  function aContainsB(a, b) {
    if (!truthy(a) || !truthy(b)) {
      return false;
    }

    return a.indexOf(b) >= 0;
  }

  var isArr = Array.isArray;

  function isFooterLink(str) {
    if (str === undefined) {
      return false;
    } else if (!isStr(str)) {
      throw new TypeError("chlu/util.js/isFooterLink(): [THROW_ID_02] The input must be string");
    }

    return str.length > 0 && existy(str.match(versionWithBracketsRegex)) && aContainsB(str, "]:");
  } // Is current string (line as input one-by-one) a title?
  // For example, "## [1.2.0] - 2017-04-24" is.
  // For example, "[1.1.0]: https://github.com/codsen/wrong-lib/compare/v1.0.1...v1.1.0" is not


  function isTitle(str) {
    if (str === undefined) {
      return false;
    } else if (!isStr(str)) {
      throw new TypeError("chlu/util.js/isTitle(): [THROW_ID_01] The input must be string - it was given as ".concat(JSON.stringify(str, null, 4), " (").concat(_typeof(str), ")"));
    }

    var stringInFrontOfVersion;

    if (existy(str.match(versionWithoutBracketsRegex))) {
      stringInFrontOfVersion = str.split(str.match(versionWithoutBracketsRegex)[0]);

      if (stringInFrontOfVersion === null) {
        stringInFrontOfVersion = "";
      } else {
        stringInFrontOfVersion = stringInFrontOfVersion[0];
      }
    }

    return str.length > 0 && existy(str.match(versionWithoutBracketsRegex)) && !str.includes("http") && !str.includes("]:") && lodash_trim(stringInFrontOfVersion, "[# \t") === "" && str.includes("#");
  }

  function getTitlesAndFooterLinks(linesArr) {
    var titles = [];
    var footerLinks = [];
    var i;
    var len;
    var temp;

    for (i = 0, len = linesArr.length; i < len; i++) {
      if (isTitle(linesArr[i])) {
        var firstEncounteredVersion = linesArr[i].match(versionWithoutBracketsRegexNoVersion)[0];
        titles.push({
          version: firstEncounteredVersion,
          rowNum: i,
          linked: existy(linesArr[i].match(versionWithBracketsRegex)),
          content: linesArr[i],
          beforeVersion: linesArr[i].split(firstEncounteredVersion)[0],
          afterVersion: linesArr[i].split(firstEncounteredVersion)[1]
        });
      } else if (isFooterLink(linesArr[i])) {
        temp = linesArr[i].match(versionWithBracketsRegex)[0];
        footerLinks.push({
          version: temp.substring(1, temp.length - 1),
          rowNum: i,
          content: linesArr[i]
        });
      }
    }

    return {
      titles: titles,
      footerLinks: footerLinks
    };
  }

  function getPreviousVersion(currVers, originalVersionsArr) {
    // removes leading "v" and "v."
    function prep() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      if (str.startsWith("v")) {
        if (str[1] === ".") {
          return str.slice(2);
        }

        return str.slice(1);
      }

      return str;
    }

    if (arguments.length < 2) {
      throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_03] There must be two arguments, string and an array.");
    }

    if (!isStr(currVers)) {
      throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_04] The first argument must be string. Currently it's ".concat(_typeof(currVers)));
    } else {
      currVers = prep(currVers);
    }

    if (!isArr(originalVersionsArr)) {
      throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_05] The second argument must be an array. Currently it's ".concat(_typeof(originalVersionsArr), " equal to:\nJSON.stringify(originalVersionsArr, null, 4)"));
    }

    var versionsArr = lodash_clonedeep(originalVersionsArr).map(function (val) {
      return prep(val);
    }).sort(semverCompare); // first, check if it's the first version from the versions array.
    // in that case, there's no previous version, so we return null:

    if (currVers === versionsArr[0]) {
      return null;
    } // next, iterate versions array and try to get the previous version:


    for (var i = 0, len = versionsArr.length; i < len; i++) {
      if (versionsArr[i] === currVers && existy(versionsArr[i - 1])) {
        return versionsArr[i - 1];
      }
    } // if nothing was found yet, throw:


    throw new Error("chlu/util.js/getPreviousVersion(): [THROW_ID_06] The given version (".concat(currVers, ") is not in the versions array (").concat(JSON.stringify(versionsArr, null, 4), ")"));
  }

  function setRow(rowsArray, index, content) {
    var res = lodash_clonedeep(rowsArray);

    for (var i = 0, len = res.length; i < len; i++) {
      if (i === index) {
        res[i] = content;
      }
    }

    return res;
  }

  function getRow(rowsArray, index) {
    if (!existy(index) || !Number.isInteger(index)) {
      throw new TypeError("chlu/util.js/getRow(): [THROW_ID_07]: first input arg must be a natural number. Currently it's given as: ".concat(_typeof(index), " and equal: ").concat(JSON.stringify(index, null, 4)));
    }

    if (!existy(rowsArray) || !isArr(rowsArray)) {
      throw new TypeError("chlu/util.js/getRow(): [THROW_ID_08]: second input arg must be an rowsArrayay. Currently it's given as: ".concat(_typeof(rowsArray), " and equal: ").concat(JSON.stringify(rowsArray, null, 4)));
    }

    for (var i = 0, len = rowsArray.length; i < len; i++) {
      if (i === index) {
        return rowsArray[i];
      }
    }

    return null;
  } // gets and sets various pieces in strings of the format:
  // "[1.1.0]: https://github.com/userName/libName/compare/v1.0.1...v1.1.0"
  // or
  // "[1.1.0]: https://bitbucket.org/userName/libName/branches/compare/v1.1.0%0Dv1.0.1


  function getSetFooterLink(str) {
    var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // console.log(`\n\u001b[${35}m${`==== getSetFooterLink() ====`}\u001b[${39}m`);
    // console.log(
    //   `\nUTIL 221 ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
    //     str,
    //     null,
    //     4
    //   )}`
    // );
    var mode;

    if (_typeof(o) === "object" && o !== null && typeof o.mode === "string") {
      mode = o.mode;
    } else {
      mode = "get";
    } // console.log(`\u001b[${32}m${`MODE = ${mode}`}\u001b[${39}m`);


    if (typeof str !== "string" || !str.includes("/")) {
      return null;
    }

    var split = str.split("/");
    var res = {}; // console.log(
    //   `\nUTIL 242 ${`\u001b[${33}m${`split`}\u001b[${39}m`} = ${JSON.stringify(
    //     split,
    //     null,
    //     4
    //   )}`
    // );

    if (!o) {
      o = {};
      o.type = "github";
    } else if (!o.type) {
      o.type = "github";
    } // console.log(
    //   `\nUTIL 259 ${`\u001b[${33}m${`o.type`}\u001b[${39}m`} = ${JSON.stringify(
    //     o.type,
    //     null,
    //     4
    //   )}`
    // );


    var currentlyWeHaveLinkOfAType = str.includes("github") ? "github" : "bitbucket";

    for (var i = 0, len = split.length; i < len; i++) {
      if (split[i] === "github.com" || split[i] === "bitbucket.org") {
        res.user = existy(o.user) ? o.user : split[i + 1];
        res.project = existy(o.project) ? o.project : split[i + 2];
      } else if (split[i] === "compare") {
        // github notation:
        if (split[i + 1].includes("...")) {
          var splitVersions = lodash_trim(split[i + 1], "#diff").split("...");
          res.versBefore = existy(o.versBefore) ? o.versBefore : lodash_trim(currentlyWeHaveLinkOfAType === "github" ? splitVersions[0] : splitVersions[1], "v");
          res.versAfter = existy(o.versAfter) ? o.versAfter : lodash_trim(currentlyWeHaveLinkOfAType === "github" ? splitVersions[1] : splitVersions[0], "v");
        } else if (split[i + 1].includes("%0D")) {
          // bitbucket notation:
          var _splitVersions = lodash_trim(split[i + 1], "#diff").split("%0D");

          res.versBefore = existy(o.versBefore) ? o.versBefore : lodash_trim(currentlyWeHaveLinkOfAType === "github" ? _splitVersions[0] : _splitVersions[1], "v");
          res.versAfter = existy(o.versAfter) ? o.versAfter : lodash_trim(currentlyWeHaveLinkOfAType === "github" ? _splitVersions[1] : _splitVersions[0], "v");
        } else {
          // insurance against broken compare links:
          return null;
        }
      } else if (i === 0) {
        res.version = existy(o.version) ? o.version : split[i].match(versionWithoutBracketsRegex)[0];
      }
    } // console.log(
    //   `UTIL 319 END ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
    //     res,
    //     null,
    //     4
    //   )}`
    // );


    if (mode === "get") {
      res.type = currentlyWeHaveLinkOfAType;
      return res;
    }

    if (o.type === "github") {
      return "[".concat(res.version, "]: https://github.com/").concat(res.user, "/").concat(res.project, "/compare/v").concat(res.versBefore, "...v").concat(res.versAfter);
    } else if (o.type === "bitbucket") {
      return "[".concat(res.version, "]: https://bitbucket.org/").concat(res.user, "/").concat(res.project, "/branches/compare/v").concat(res.versAfter, "%0Dv").concat(res.versBefore, "#diff");
    }
  }

  function versionSort(a, b) {
    return semverCompare(a.version, b.version);
  }

  function filterDate(someString) {
    var res = someString.trim();
    res = er(res, {
      leftOutsideNot: "",
      leftOutside: "",
      leftMaybe: "[",
      searchFor: "YANKED",
      rightMaybe: "]",
      rightOutside: "",
      rightOutsideNot: "",
      i: {
        searchFor: true
      }
    });
    res = res.replace(".", " ");
    res = res.replace(",", " ");
    res = res.replace(";", " ");
    res = res.replace(emojiRegex$1, "");
    res = res.replace(/[ ]+/g, " ");
    res = lodash_trim(res, "[](),.-/\\ \u2013\u2014\t\xA0");
    return res;
  } // FIN

  var isArr$1 = Array.isArray;
  // -----------------------------------------------------------------------------

  function existy$1(x) {
    return x != null;
  } // ACTION
  // -----------------------------------------------------------------------------
  // gitTags will come either as null or a plain object, for example:
  // {
  //     "latest": "v1.9.1",
  //     "all": [
  //         "v1.0.1",
  //         "v1.1.0",
  //         ...
  //         "v1.9.0",
  //         "v1.9.1"
  //     ]
  // }


  function chlu(changelogContents, gitTags, packageJsonContents) {
    if (arguments.length === 0 || !existy$1(changelogContents)) {
      return;
    } // process the gitTags input.
    // result will be in the following format:
    // processedGitTags = {
    //     "latest": [
    //         "2017-04-18",
    //         "1.3.5"
    //     ],
    //     "all": {
    //         "1.0.0": "2017-04-01",
    //         "1.0.1": "2017-04-02",
    //         ...
    //         "1.3.4": "2017-04-17",
    //         "1.3.5": "2017-04-18"
    //     },
    //     "versionsOnly": [
    //         "1.0.0",
    //         "1.0.1",
    //         ...
    //         "1.3.4",
    //         "1.3.5"
    //     ]
    // }


    var processedGitTags;

    if (_typeof(gitTags) === "object" && gitTags !== null && !Array.isArray(gitTags) && existy$1(gitTags.latest)) {
      processedGitTags = {};
      processedGitTags.latest = gitTags.latest.split("|").map(function (val) {
        if (val[0] === "v") {
          return val.slice(1);
        }

        return val;
      });
      processedGitTags.all = {};
      processedGitTags.versionsOnly = [];

      if (isArr$1(gitTags.all)) {
        gitTags.all.sort().forEach(function (key) {
          processedGitTags.all[key.slice(12)] = key.slice(0, 10);
          processedGitTags.versionsOnly.push(key.slice(12));
        });
      }
    }

    var changelogMd = changelogContents;
    var packageJson; // package.json might come in falsey in case it's unavailable

    if (packageJsonContents) {
      var parsedContents;

      if (typeof packageJsonContents === "string") {
        try {
          parsedContents = JSON.parse(packageJsonContents);
        } catch (e) {
          throw new Error("chlu/main.js: [THROW_ID_04] Package JSON could not be parsed, JSON.parse gave error:\n".concat(e, "\n\nBy the way, we're talking about contents:\n").concat(JSON.stringify(packageJsonContents, null, 0), "\ntheir type is: \"").concat(_typeof(packageJsonContents), "\"").concat(typeof packageJsonContents === "string" ? " and its length is: ".concat(packageJsonContents.length) : ""));
        }
      } else if (lodash_isplainobject(packageJsonContents)) {
        parsedContents = packageJsonContents;
      }

      try {
        packageJson = src$1(parsedContents);
      } catch (e) {
        throw new Error("chlu/main.js: [THROW_ID_05] There was an error in get-pkg-repo:\n".concat(e, "\n\nBy the way, we're talking about contents:\n").concat(JSON.stringify(parsedContents, null, 4)));
      } // throw only if the package.json was parsed and type is not recognised


      if (packageJson && packageJson.type && packageJson.type !== "github" && packageJson.type !== "bitbucket") {
        throw new Error("chlu/main.js: [THROW_ID_01] Package JSON shows the library is neither GitHub nor BitBucket-based - ".concat(packageJson.type));
      }
    }

    var temp;
    var titles = [];
    var footerLinks = [];
    var newLinesArr = []; // ACTION
    // -----------------------------------------------------------------------------
    // =======
    // stage 1: iterate through all lines and:
    // - record all titles, like:
    //   "## [1.2.0] - 2017-04-24"
    // - record all url links at the bottom, like:
    //   "[1.1.0]: https://github.com/codsen/wrong-lib/compare/v1.0.1...v1.1.0"

    var linesArr = changelogMd.split(/\r?\n/);
    var titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr);
    titles = titlesAndFooterLinks.titles;
    footerLinks = titlesAndFooterLinks.footerLinks; // =======
    // stage 2: remove any invalid footer links

    for (var i = 0, len = footerLinks.length; i < len; i++) {
      if (!existy$1(getSetFooterLink(footerLinks[i].content, {
        mode: "get"
      }))) {
        linesArr.splice(footerLinks[i].rowNum, 1);
      }
    } // recalculate:


    titlesAndFooterLinks = getTitlesAndFooterLinks(linesArr);
    titles = titlesAndFooterLinks.titles;
    footerLinks = titlesAndFooterLinks.footerLinks;
    var assumedPackageJsonType;
    var assumedPackageUser;
    var assumedPackageProject;

    if (!packageJson) {
      // if the package.json was not given, infer the type of diff links from the
      // first footer link's URL:
      if (footerLinks[0] && footerLinks[0].content && footerLinks[0].content.includes("bitbucket.org")) {
        assumedPackageJsonType = "bitbucket";
      } else if (footerLinks[0] && footerLinks[0].content && footerLinks[0].content.includes("github.com")) {
        assumedPackageJsonType = "github";
      } else {
        throw new Error("chlu/main.js: [THROW_ID_02] Both package.json and Git data were missing and we had to rely on the first footer link to detect the type of repository: Github or Bitbucket. But we couldn't extract the first link from your changelog's footer!");
      }

      if (assumedPackageJsonType) {
        footerLinks[0].content.split("/").forEach(function (chunkOfLine, i, arr) {
          // if the chunk contains "bitbucket.org", next chunk is user, further next
          // chunk is project. Grab those.
          if (chunkOfLine.includes("bitbucket.org") || chunkOfLine.includes("github.com")) {
            if (arr.length > i + 2) {
              assumedPackageUser = arr[i + 1];
              assumedPackageProject = arr[i + 2];
            } else {
              throw new Error("chlu/main.js: [THROW_ID_03] We could not extract user and package from the footer link: \"".concat(footerLinks[0].content, "\""));
            }
          }
        });
      }
    } // =======
    // stage 3: get the ordered array of all title versions


    var sortedTitlesArray = titles.map(function (el) {
      return el.version;
    }).sort(semverCompare); // =======
    // stage 4: find unused footer links

    var unusedFooterLinks = footerLinks.filter(function (link) {
      return !titles.map(function (title) {
        return title.version;
      }).includes(link.version);
    });

    while (unusedFooterLinks.length > 0) {
      linesArr.splice(unusedFooterLinks[0].rowNum, 1);
      footerLinks = getTitlesAndFooterLinks(linesArr).footerLinks;
      unusedFooterLinks = footerLinks.filter(function (link) {
        return !titles.map(function (title) {
          return title.version;
        }).includes(link.version);
      });
    } // =======
    // stage 5: create footer links for all titles except the smallest version-one


    var missingFooterLinks = [];

    var _loop = function _loop(_i, _len) {
      if (_len > 1 && titles[_i].version !== sortedTitlesArray[0]) {
        var linkFound = footerLinks.some(function (el) {
          return titles[_i].version === el.version;
        });

        if (!linkFound) {
          missingFooterLinks.push(titles[_i]);
        }
      }
    };

    for (var _i = 0, _len = titles.length; _i < _len; _i++) {
      _loop(_i, _len);
    } // =======
    // stage 6: find out what is the order of footer links


    var ascendingFooterLinkCount = 0;
    var descendingFooterLinkCount = 0;

    if (footerLinks.length > 1) {
      for (var _i2 = 0, _len2 = footerLinks.length; _i2 < _len2 - 1; _i2++) {
        if (semverCompare(footerLinks[_i2].version, footerLinks[_i2 + 1].version) === 1) {
          descendingFooterLinkCount++;
        } else {
          ascendingFooterLinkCount++;
        }
      }
    }

    var ascending = true;

    if (ascendingFooterLinkCount <= descendingFooterLinkCount) {
      ascending = false;
    } // =======
    // stage 7: calculate what goes where


    var whereToPlaceIt; // calculate the Where

    if (footerLinks.length === 0) {
      // count from the end of the file.
      // if last non-empty line has "]:" in it, place right after it.
      // otherwise, insert an empty line. This means there's content only and no links yet.
      for (var _i3 = linesArr.length - 1, start = 0; _i3 >= start; _i3--) {
        if (existy$1(linesArr[_i3]) && !containsOnlyEmptySpace(linesArr[_i3])) {
          whereToPlaceIt = _i3 + 2;
          break;
        }
      }
    } else {
      whereToPlaceIt = footerLinks[0].rowNum;
    } // =======
    // stage 8: assemble the new chunk - array of new lines


    temp = [];

    if (packageJson && packageJson.type && packageJson.type === "github" || assumedPackageJsonType === "github") {
      missingFooterLinks.forEach(function (key) {
        temp.push("[".concat(key.version, "]: https://github.com/").concat(assumedPackageUser || packageJson.user, "/").concat(assumedPackageProject || packageJson.project, "/compare/v").concat(getPreviousVersion(key.version, sortedTitlesArray), "...v").concat(key.version));
      });
    } else if (packageJson && packageJson.type && packageJson.type === "bitbucket" || assumedPackageJsonType === "bitbucket") {
      missingFooterLinks.forEach(function (key) {
        temp.push("[".concat(key.version, "]: https://bitbucket.org/").concat(assumedPackageUser || packageJson.user, "/").concat(assumedPackageProject || packageJson.project, "/branches/compare/v").concat(key.version, "%0Dv").concat(getPreviousVersion(key.version, sortedTitlesArray), "#diff"));
      });
    }

    if (ascending) {
      temp = temp.reverse();
    } // =======
    // stage 9: insert new rows into linesArr
    // newLinesArr = insert(linesArr, temp, whereToPlaceIt);
    // newLinesArr = linesArr.splice(whereToPlaceIt, 0, temp);


    newLinesArr = linesArr.slice(0, whereToPlaceIt).concat(temp.concat(linesArr.slice(whereToPlaceIt))); // =======
    // stage 10: prepare for checking are footerLinks correct.
    // calculate title and footerLinks again, this time, including our additions

    temp = getTitlesAndFooterLinks(newLinesArr);
    titles = temp.titles;
    footerLinks = temp.footerLinks;

    for (var _i4 = 0, _len3 = footerLinks.length; _i4 < _len3; _i4++) {
      var extracted = getSetFooterLink(footerLinks[_i4].content, {
        mode: "get"
      });
      var finalUser = assumedPackageUser || packageJson.user;
      var finalProject = assumedPackageProject || packageJson.project;
      var finalVersBefore = getPreviousVersion(extracted.version, sortedTitlesArray);

      if (processedGitTags) {
        // if we have the Git info, pick "from" git version from Git data:
        //
        // 1. check if current "to" diff Git version, "extracted.version", does not
        // exist yet among git tags
        if (!processedGitTags.versionsOnly.includes(extracted.version)) {
          // Current version is not among existing Git tags. Just pick the last.
          finalVersBefore = processedGitTags.versionsOnly[processedGitTags.versionsOnly.length - 1];
        } else {
          finalVersBefore = getPreviousVersion(extracted.version, processedGitTags.versionsOnly);
        }
      } else {
        // if the Git data is not available, use existing parsed Changelog data.
        // Let's calculate the "from" version in the link, the "1.3.5" in:
        // [1.4.0]: https://github.com/codsen/wrong-lib/compare/v1.3.5...v1.4.0
        // 1. It can come from existing value in the changelog, from this very row:
        var extractedVersBefore = extracted.versBefore; // 2. It can come from the previous title from the entries mentioned in the
        // changelog. Each heading mentions a version and we extract them all from there.

        var titlesVersBefore = getPreviousVersion(extracted.version, sortedTitlesArray); // The order of preference is:
        // 1. Git data - pick previous version from known Git tags
        // 2. Existing Changelog markdown file - current row might be custom-tweaked
        // 3. Data from the titles.
        // Since #1 is not available (see other part of outer IF clause above),
        // it's the choice between #2 and #3.
        // We would fall back to #3 only on emergency cases - when it's messed up.
        // TODO: add more checks, like is it digit.digit.digit notation in extracted
        // version from changelog ("extractedVersBefore")?

        if (semverCompare(extractedVersBefore, titlesVersBefore) < 1) {
          // mess up cases, #3
          finalVersBefore = titlesVersBefore;
        } else {
          // all OK, default case #2
          finalVersBefore = extractedVersBefore;
        }
      }

      var finalVersAfter = extracted.version;
      var finalVersion = extracted.version;


      footerLinks[_i4].content = getSetFooterLink(footerLinks[_i4].content, {
        user: finalUser,
        project: finalProject,
        versBefore: finalVersBefore,
        versAfter: finalVersAfter,
        version: finalVersion,
        type: assumedPackageJsonType || packageJson.type,
        mode: "set"
      }); // write over:

      newLinesArr = setRow(newLinesArr, footerLinks[_i4].rowNum, footerLinks[_i4].content);
    } // ========
    // stage 11: sort all footer links, depending on a current preference


    temp = lodash_clonedeep(footerLinks).sort(versionSort);

    if (!ascending) {
      temp = temp.reverse();
    }

    footerLinks.forEach(function (footerLink, index) {
      newLinesArr = setRow(newLinesArr, footerLink.rowNum, temp[index].content);
    }); // ========
    // stage 12: delete empty rows between footer links:

    var firstRowWithFooterLink = lodash_min(footerLinks.map(function (link) {
      return link.rowNum;
    }));

    for (var _i5 = firstRowWithFooterLink + 1, _len4 = newLinesArr.length; _i5 < _len4; _i5++) {
      if (newLinesArr[_i5] === "" || typeof newLinesArr[_i5] === "string" && newLinesArr[_i5].trim() === "") {
        newLinesArr.splice(_i5, 1);
        _i5--;
      }
    } // ========
    // stage 13: add trailing empty line if it's missing:


    if (newLinesArr[newLinesArr.length - 1] !== "") {
      newLinesArr.push("");
    } // ========
    // stage 14: add any missing line break before footer links


    titlesAndFooterLinks = getTitlesAndFooterLinks(newLinesArr);
    titles = titlesAndFooterLinks.titles;
    footerLinks = titlesAndFooterLinks.footerLinks;

    if (existy$1(footerLinks) && footerLinks.length > 0 && !containsOnlyEmptySpace(getRow(newLinesArr, footerLinks[0].rowNum - 1))) {
      newLinesArr.splice(footerLinks[0].rowNum, 0, "");
    } // ========

    {
      titles.forEach(function (title) {
        var fixedDate = dehumanizeDate(filterDate(title.afterVersion));

        if (fixedDate !== null) {
          newLinesArr = setRow(newLinesArr, title.rowNum, "## ".concat(title.version !== sortedTitlesArray[0] ? "[" : "").concat(title.version).concat(title.version !== sortedTitlesArray[0] ? "]" : "", " - ").concat(fixedDate));
        } else {
          // if date is unrecogniseable leave it alone, fix the rest of the title
          newLinesArr = setRow(newLinesArr, title.rowNum, "## ".concat(title.version !== sortedTitlesArray[0] ? "[" : "").concat(title.version).concat(title.version !== sortedTitlesArray[0] ? "]" : "", " - ").concat(filterDate(title.afterVersion)));
        }
      });
    }

    return newLinesArr.join("\n");
  }

  return chlu;

})));

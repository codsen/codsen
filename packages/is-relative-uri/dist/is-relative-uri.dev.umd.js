/**
 * is-relative-uri
 * Is given string a relative URI?
 * Version: 3.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-relative-uri/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.isRelativeUri = {}));
}(this, (function (exports) { 'use strict';

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

var version$1 = "3.0.9";

var version = version$1; // Reference used:
// https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#URI_references

var BACKSLASH = "\\"; // retrieved 2020-Jan-11
// https://www.iana.org/assignments/uri-schemes/uri-schemes.xhtml

var knownSchemes = ["aaa", "aaas", "about", "acap", "acct", "acd", "acr", "adiumxtra", "adt", "afp", "afs", "aim", "amss", "android", "appdata", "apt", "ark", "attachment", "aw", "barion", "beshare", "bitcoin", "bitcoincash", "blob", "bolo", "browserext", "calculator", "callto", "cap", "cast", "casts", "chrome", "chrome-extension", "cid", "coap", "coap+tcp", "coap+ws", "coaps", "coaps+tcp", "coaps+ws", "com-eventbrite-attendee", "content", "conti", "crid", "cvs", "dab", "dav", "diaspora", "dict", "did", "dis", "dlna-playcontainer", "dlna-playsingle", "dns", "dntp", "dpp", "drm", "drop", "dtn", "dvb", "ed2k", "elsi", "example", "facetime", "fax", "feed", "feedready", "filesystem", "finger", "first-run-pen-experience", "fish", "fm", "fuchsia-pkg", "geo", "gg", "git", "gizmoproject", "go", "gopher", "graph", "gtalk", "h323", "ham", "hcap", "hcp", "hxxp", "hxxps", "hydrazone", "iax", "icap", "icon", "im", "imap", "info", "iotdisco", "ipn", "ipp", "ipps", "irc6", "ircs", "iris", "iris.beep", "iris.lwz", "iris.xpc", "iris.xpcs", "isostore", "itms", "jabber", "jar", "jms", "keyparc", "lastfm", "ldap", "ldaps", "leaptofrogans", "lorawan", "lvlt", "magnet", "mailserver", "maps", "market", "message", "microsoft.windows.camera", "microsoft.windows.camera.multipicker", "microsoft.windows.camera.picker", "mid", "mms", "modem", "mongodb", "moz", "ms-access", "ms-browser-extension", "ms-calculator", "ms-drive-to", "ms-enrollment", "ms-excel", "ms-eyecontrolspeech", "ms-gamebarservices", "ms-gamingoverlay", "ms-getoffice", "ms-help", "ms-infopath", "ms-inputapp", "ms-lockscreencomponent-config", "ms-media-stream-id", "ms-mixedrealitycapture", "ms-mobileplans", "ms-officeapp", "ms-people", "ms-project", "ms-powerpoint", "ms-publisher", "ms-restoretabcompanion", "ms-screenclip", "ms-screensketch", "ms-search", "ms-search-repair", "ms-secondary-screen-controller", "ms-secondary-screen-setup", "ms-settings", "ms-settings-airplanemode", "ms-settings-bluetooth", "ms-settings-camera", "ms-settings-cellular", "ms-settings-cloudstorage", "ms-settings-connectabledevices", "ms-settings-displays-topology", "ms-settings-emailandaccounts", "ms-settings-language", "ms-settings-location", "ms-settings-lock", "ms-settings-nfctransactions", "ms-settings-notifications", "ms-settings-power", "ms-settings-privacy", "ms-settings-proximity", "ms-settings-screenrotation", "ms-settings-wifi", "ms-settings-workplace", "ms-spd", "ms-sttoverlay", "ms-transit-to", "ms-useractivityset", "ms-virtualtouchpad", "ms-visio", "ms-walk-to", "ms-whiteboard", "ms-whiteboard-cmd", "ms-word", "msnim", "msrp", "msrps", "mss", "mtqp", "mumble", "mupdate", "mvn", "news", "nfs", "ni", "nih", "nntp", "notes", "ocf", "oid", "onenote", "onenote-cmd", "opaquelocktoken", "openpgp4fpr", "pack", "palm", "paparazzi", "payment", "payto", "pkcs11", "platform", "pop", "pres", "prospero", "proxy", "pwid", "psyc", "pttp", "qb", "query", "quic-transport", "redis", "rediss", "reload", "res", "resource", "rmi", "rsync", "rtmfp", "rtmp", "rtsp", "rtsps", "rtspu", "secondlife", "service", "session", "sftp", "sgn", "shttp", "sieve", "simpleledger", "sip", "sips", "skype", "smb", "sms", "smtp", "snews", "snmp", "soap.beep", "soap.beeps", "soldat", "spiffe", "spotify", "ssh", "steam", "stun", "stuns", "submit", "svn", "tag", "teamspeak", "tel", "teliaeid", "telnet", "tftp", "things", "thismessage", "tip", "tn3270", "tool", "turn", "turns", "tv", "udp", "unreal", "urn", "ut2004", "v-event", "vemmi", "ventrilo", "videotex", "vnc", "view-source", "wais", "webcal", "wpid", "ws", "wss", "wtai", "wyciwyg", "xcon", "xcon-userid", "xfire", "xmlrpc.beep", "xmlrpc.beeps", "xmpp", "xri", "ymsgr", "z39.50", "z39.50r", "z39.50s"];

function isRel(str, originalOpts) {
  // insurance first
  // ---------------------------------------------------------------------------
  if (typeof str !== "string") {
    throw new Error("is-relative-uri: [THROW_ID_01] input string must be string, it was given as \"" + str + "\" (type " + typeof str + ")");
  }

  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error("is-relative-uri: [THROW_ID_02] opts be plain object, it was given as " + originalOpts + " (type " + typeof originalOpts + ")");
  }

  var defaults = {
    flagUpUrisWithSchemes: true,
    offset: 0
  };

  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

  if (opts.offset && !Number.isInteger(opts.offset)) {
    throw new Error("is-relative-uri: [THROW_ID_02] opts.offset must be an integer, it was given as " + opts.offset + " (type " + typeof opts.offset + ")");
  }

  if (!opts.offset) {
    // to cater false/null
    opts.offset = 0;
  } // ---------------------------------------------------------------------------

  if (str.split("").some(function (char) {
    return !char.trim();
  })) {
    return {
      res: false,
      message: "Remove whitespace."
    };
  }

  if (str.match(/\/\s*\/\s*\//g)) {
    return {
      res: false,
      message: "Three consecutive slashes found."
    };
  }

  if (str.match(/.\/\s*\//g)) {
    return {
      res: false,
      message: "Character followed by two slashes."
    };
  }

  if (str.includes("...")) {
    return {
      res: false,
      message: "Three consecutive dots."
    };
  } // RFC 3986 bad characters


  if (str.includes("%") && !str.match(/%[0-9a-f]/gi)) {
    // percentages should be escaped in URI's, so the next
    // character after percentage should be 0-9 or a-f
    return {
      res: false,
      message: "Unescaped \"%\" character."
    };
  }

  if (str.includes("<")) {
    return {
      res: false,
      message: "Unescaped \"<\" character."
    };
  }

  if (str.includes(">")) {
    return {
      res: false,
      message: "Unescaped \">\" character."
    };
  }

  if (str.includes("[")) {
    return {
      res: false,
      message: "Unescaped \"[\" character."
    };
  }

  if (str.includes("]")) {
    return {
      res: false,
      message: "Unescaped \"]\" character."
    };
  }

  if (str.includes("{")) {
    return {
      res: false,
      message: "Unescaped \"{\" character."
    };
  }

  if (str.includes("}")) {
    return {
      res: false,
      message: "Unescaped \"}\" character."
    };
  }

  if (str.includes("|")) {
    return {
      res: false,
      message: "Unescaped \"|\" character."
    };
  }

  if (str.includes(BACKSLASH)) {
    return {
      res: false,
      message: "Unescaped backslash (" + BACKSLASH + ") character."
    };
  }

  if (str.includes("^")) {
    return {
      res: false,
      message: "Unescaped caret (^) character."
    };
  }

  if (str.endsWith(".") && !str.startsWith(".")) {
    return {
      res: false,
      message: "Ends with dot, is file extension missing?"
    };
  }

  if (str.includes("??")) {
    return {
      res: false,
      message: "Two consecutive question marks."
    };
  }

  if (str.includes("##")) {
    return {
      res: false,
      message: "Two consecutive hashes."
    };
  }

  if (str.endsWith("#")) {
    return {
      res: false,
      message: "Ends with a hash."
    };
  } // slice the rest of the string after the first hash


  if (str.includes("#") && str.slice(str.indexOf("#") + 1).includes("/")) {
    return {
      res: false,
      message: "Slash follows hash."
    };
  }

  if (str.match(/\.\.[^/]/g)) {
    return {
      res: false,
      message: "Two dots should be followed by a slash."
    };
  } // opts.flagUpUrisWithSchemes
  // ---------------------------------------------------------------------------


  if (opts.flagUpUrisWithSchemes && (str.startsWith("http:") || str.startsWith("https:") || str.startsWith("ftp:") || str.startsWith("mailto:") || str.startsWith("file:") || str.startsWith("data:") || str.startsWith("irc:") || knownSchemes.some(function (scheme) {
    return str.startsWith(scheme + ":");
  }))) {
    return {
      res: false,
      message: null
    };
  } // ---------------------------------------------------------------------------
  return {
    res: true,
    message: null
  };
}

exports.isRel = isRel;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));

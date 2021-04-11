/**
 * @name is-relative-uri
 * @fileoverview Is given string a relative URI?
 * @version 3.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/is-relative-uri/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "3.0.14";

var version = version$1;
var BACKSLASH = "\\";
var knownSchemes = ["aaa", "aaas", "about", "acap", "acct", "acd", "acr", "adiumxtra", "adt", "afp", "afs", "aim", "amss", "android", "appdata", "apt", "ark", "attachment", "aw", "barion", "beshare", "bitcoin", "bitcoincash", "blob", "bolo", "browserext", "calculator", "callto", "cap", "cast", "casts", "chrome", "chrome-extension", "cid", "coap", "coap+tcp", "coap+ws", "coaps", "coaps+tcp", "coaps+ws", "com-eventbrite-attendee", "content", "conti", "crid", "cvs", "dab", "dav", "diaspora", "dict", "did", "dis", "dlna-playcontainer", "dlna-playsingle", "dns", "dntp", "dpp", "drm", "drop", "dtn", "dvb", "ed2k", "elsi", "example", "facetime", "fax", "feed", "feedready", "filesystem", "finger", "first-run-pen-experience", "fish", "fm", "fuchsia-pkg", "geo", "gg", "git", "gizmoproject", "go", "gopher", "graph", "gtalk", "h323", "ham", "hcap", "hcp", "hxxp", "hxxps", "hydrazone", "iax", "icap", "icon", "im", "imap", "info", "iotdisco", "ipn", "ipp", "ipps", "irc6", "ircs", "iris", "iris.beep", "iris.lwz", "iris.xpc", "iris.xpcs", "isostore", "itms", "jabber", "jar", "jms", "keyparc", "lastfm", "ldap", "ldaps", "leaptofrogans", "lorawan", "lvlt", "magnet", "mailserver", "maps", "market", "message", "microsoft.windows.camera", "microsoft.windows.camera.multipicker", "microsoft.windows.camera.picker", "mid", "mms", "modem", "mongodb", "moz", "ms-access", "ms-browser-extension", "ms-calculator", "ms-drive-to", "ms-enrollment", "ms-excel", "ms-eyecontrolspeech", "ms-gamebarservices", "ms-gamingoverlay", "ms-getoffice", "ms-help", "ms-infopath", "ms-inputapp", "ms-lockscreencomponent-config", "ms-media-stream-id", "ms-mixedrealitycapture", "ms-mobileplans", "ms-officeapp", "ms-people", "ms-project", "ms-powerpoint", "ms-publisher", "ms-restoretabcompanion", "ms-screenclip", "ms-screensketch", "ms-search", "ms-search-repair", "ms-secondary-screen-controller", "ms-secondary-screen-setup", "ms-settings", "ms-settings-airplanemode", "ms-settings-bluetooth", "ms-settings-camera", "ms-settings-cellular", "ms-settings-cloudstorage", "ms-settings-connectabledevices", "ms-settings-displays-topology", "ms-settings-emailandaccounts", "ms-settings-language", "ms-settings-location", "ms-settings-lock", "ms-settings-nfctransactions", "ms-settings-notifications", "ms-settings-power", "ms-settings-privacy", "ms-settings-proximity", "ms-settings-screenrotation", "ms-settings-wifi", "ms-settings-workplace", "ms-spd", "ms-sttoverlay", "ms-transit-to", "ms-useractivityset", "ms-virtualtouchpad", "ms-visio", "ms-walk-to", "ms-whiteboard", "ms-whiteboard-cmd", "ms-word", "msnim", "msrp", "msrps", "mss", "mtqp", "mumble", "mupdate", "mvn", "news", "nfs", "ni", "nih", "nntp", "notes", "ocf", "oid", "onenote", "onenote-cmd", "opaquelocktoken", "openpgp4fpr", "pack", "palm", "paparazzi", "payment", "payto", "pkcs11", "platform", "pop", "pres", "prospero", "proxy", "pwid", "psyc", "pttp", "qb", "query", "quic-transport", "redis", "rediss", "reload", "res", "resource", "rmi", "rsync", "rtmfp", "rtmp", "rtsp", "rtsps", "rtspu", "secondlife", "service", "session", "sftp", "sgn", "shttp", "sieve", "simpleledger", "sip", "sips", "skype", "smb", "sms", "smtp", "snews", "snmp", "soap.beep", "soap.beeps", "soldat", "spiffe", "spotify", "ssh", "steam", "stun", "stuns", "submit", "svn", "tag", "teamspeak", "tel", "teliaeid", "telnet", "tftp", "things", "thismessage", "tip", "tn3270", "tool", "turn", "turns", "tv", "udp", "unreal", "urn", "ut2004", "v-event", "vemmi", "ventrilo", "videotex", "vnc", "view-source", "wais", "webcal", "wpid", "ws", "wss", "wtai", "wyciwyg", "xcon", "xcon-userid", "xfire", "xmlrpc.beep", "xmlrpc.beeps", "xmpp", "xri", "ymsgr", "z39.50", "z39.50r", "z39.50s"];
function isRel(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error("is-relative-uri: [THROW_ID_01] input string must be string, it was given as \"".concat(str, "\" (type ").concat(_typeof__default['default'](str), ")"));
  }
  if (originalOpts && _typeof__default['default'](originalOpts) !== "object") {
    throw new Error("is-relative-uri: [THROW_ID_02] opts be plain object, it was given as ".concat(originalOpts, " (type ").concat(_typeof__default['default'](originalOpts), ")"));
  }
  var defaults = {
    flagUpUrisWithSchemes: true,
    offset: 0
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (opts.offset && !Number.isInteger(opts.offset)) {
    throw new Error("is-relative-uri: [THROW_ID_02] opts.offset must be an integer, it was given as ".concat(opts.offset, " (type ").concat(_typeof__default['default'](opts.offset), ")"));
  }
  if (!opts.offset) {
    opts.offset = 0;
  }
  if (str.split("").some(function (_char) {
    return !_char.trim();
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
  }
  if (str.includes("%") && !str.match(/%[0-9a-f]/gi)) {
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
      message: "Unescaped backslash (".concat(BACKSLASH, ") character.")
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
  }
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
  }
  if (opts.flagUpUrisWithSchemes && (str.startsWith("http:") || str.startsWith("https:") || str.startsWith("ftp:") || str.startsWith("mailto:") || str.startsWith("file:") || str.startsWith("data:") || str.startsWith("irc:") || knownSchemes.some(function (scheme) {
    return str.startsWith("".concat(scheme, ":"));
  }))) {
    return {
      res: false,
      message: null
    };
  }
  return {
    res: true,
    message: null
  };
}

exports.isRel = isRel;
exports.version = version;

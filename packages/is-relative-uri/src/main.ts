import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

// Reference used:
// https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#URI_references

const BACKSLASH = "\u005C";

// retrieved 2020-Jan-11
// https://www.iana.org/assignments/uri-schemes/uri-schemes.xhtml
const knownSchemes = [
  "aaa",
  "aaas",
  "about",
  "acap",
  "acct",
  "acd",
  "acr",
  "adiumxtra",
  "adt",
  "afp",
  "afs",
  "aim",
  "amss",
  "android",
  "appdata",
  "apt",
  "ark",
  "attachment",
  "aw",
  "barion",
  "beshare",
  "bitcoin",
  "bitcoincash",
  "blob",
  "bolo",
  "browserext",
  "calculator",
  "callto",
  "cap",
  "cast",
  "casts",
  "chrome",
  "chrome-extension",
  "cid",
  "coap",
  "coap+tcp",
  "coap+ws",
  "coaps",
  "coaps+tcp",
  "coaps+ws",
  "com-eventbrite-attendee",
  "content",
  "conti",
  "crid",
  "cvs",
  "dab",
  "dav",
  "diaspora",
  "dict",
  "did",
  "dis",
  "dlna-playcontainer",
  "dlna-playsingle",
  "dns",
  "dntp",
  "dpp",
  "drm",
  "drop",
  "dtn",
  "dvb",
  "ed2k",
  "elsi",
  "example",
  "facetime",
  "fax",
  "feed",
  "feedready",
  "filesystem",
  "finger",
  "first-run-pen-experience",
  "fish",
  "fm",
  "fuchsia-pkg",
  "geo",
  "gg",
  "git",
  "gizmoproject",
  "go",
  "gopher",
  "graph",
  "gtalk",
  "h323",
  "ham",
  "hcap",
  "hcp",
  "hxxp",
  "hxxps",
  "hydrazone",
  "iax",
  "icap",
  "icon",
  "im",
  "imap",
  "info",
  "iotdisco",
  "ipn",
  "ipp",
  "ipps",
  "irc6",
  "ircs",
  "iris",
  "iris.beep",
  "iris.lwz",
  "iris.xpc",
  "iris.xpcs",
  "isostore",
  "itms",
  "jabber",
  "jar",
  "jms",
  "keyparc",
  "lastfm",
  "ldap",
  "ldaps",
  "leaptofrogans",
  "lorawan",
  "lvlt",
  "magnet",
  "mailserver",
  "maps",
  "market",
  "message",
  "microsoft.windows.camera",
  "microsoft.windows.camera.multipicker",
  "microsoft.windows.camera.picker",
  "mid",
  "mms",
  "modem",
  "mongodb",
  "moz",
  "ms-access",
  "ms-browser-extension",
  "ms-calculator",
  "ms-drive-to",
  "ms-enrollment",
  "ms-excel",
  "ms-eyecontrolspeech",
  "ms-gamebarservices",
  "ms-gamingoverlay",
  "ms-getoffice",
  "ms-help",
  "ms-infopath",
  "ms-inputapp",
  "ms-lockscreencomponent-config",
  "ms-media-stream-id",
  "ms-mixedrealitycapture",
  "ms-mobileplans",
  "ms-officeapp",
  "ms-people",
  "ms-project",
  "ms-powerpoint",
  "ms-publisher",
  "ms-restoretabcompanion",
  "ms-screenclip",
  "ms-screensketch",
  "ms-search",
  "ms-search-repair",
  "ms-secondary-screen-controller",
  "ms-secondary-screen-setup",
  "ms-settings",
  "ms-settings-airplanemode",
  "ms-settings-bluetooth",
  "ms-settings-camera",
  "ms-settings-cellular",
  "ms-settings-cloudstorage",
  "ms-settings-connectabledevices",
  "ms-settings-displays-topology",
  "ms-settings-emailandaccounts",
  "ms-settings-language",
  "ms-settings-location",
  "ms-settings-lock",
  "ms-settings-nfctransactions",
  "ms-settings-notifications",
  "ms-settings-power",
  "ms-settings-privacy",
  "ms-settings-proximity",
  "ms-settings-screenrotation",
  "ms-settings-wifi",
  "ms-settings-workplace",
  "ms-spd",
  "ms-sttoverlay",
  "ms-transit-to",
  "ms-useractivityset",
  "ms-virtualtouchpad",
  "ms-visio",
  "ms-walk-to",
  "ms-whiteboard",
  "ms-whiteboard-cmd",
  "ms-word",
  "msnim",
  "msrp",
  "msrps",
  "mss",
  "mtqp",
  "mumble",
  "mupdate",
  "mvn",
  "news",
  "nfs",
  "ni",
  "nih",
  "nntp",
  "notes",
  "ocf",
  "oid",
  "onenote",
  "onenote-cmd",
  "opaquelocktoken",
  "openpgp4fpr",
  "pack",
  "palm",
  "paparazzi",
  "payment",
  "payto",
  "pkcs11",
  "platform",
  "pop",
  "pres",
  "prospero",
  "proxy",
  "pwid",
  "psyc",
  "pttp",
  "qb",
  "query",
  "quic-transport",
  "redis",
  "rediss",
  "reload",
  "res",
  "resource",
  "rmi",
  "rsync",
  "rtmfp",
  "rtmp",
  "rtsp",
  "rtsps",
  "rtspu",
  "secondlife",
  "service",
  "session",
  "sftp",
  "sgn",
  "shttp",
  "sieve",
  "simpleledger",
  "sip",
  "sips",
  "skype",
  "smb",
  "sms",
  "smtp",
  "snews",
  "snmp",
  "soap.beep",
  "soap.beeps",
  "soldat",
  "spiffe",
  "spotify",
  "ssh",
  "steam",
  "stun",
  "stuns",
  "submit",
  "svn",
  "tag",
  "teamspeak",
  "tel",
  "teliaeid",
  "telnet",
  "tftp",
  "things",
  "thismessage",
  "tip",
  "tn3270",
  "tool",
  "turn",
  "turns",
  "tv",
  "udp",
  "unreal",
  "urn",
  "ut2004",
  "v-event",
  "vemmi",
  "ventrilo",
  "videotex",
  "vnc",
  "view-source",
  "wais",
  "webcal",
  "wpid",
  "ws",
  "wss",
  "wtai",
  "wyciwyg",
  "xcon",
  "xcon-userid",
  "xfire",
  "xmlrpc.beep",
  "xmlrpc.beeps",
  "xmpp",
  "xri",
  "ymsgr",
  "z39.50",
  "z39.50r",
  "z39.50s",
];

interface Opts {
  flagUpUrisWithSchemes: boolean;
  offset: number;
}
const defaults: Opts = {
  flagUpUrisWithSchemes: true,
  offset: 0,
};

interface Res {
  res: boolean;
  message: string | null;
}

function isRel(str: string, originalOpts?: Partial<Opts>): Res {
  // insurance first
  // ---------------------------------------------------------------------------
  if (typeof str !== "string") {
    throw new Error(
      `is-relative-uri: [THROW_ID_01] input string must be string, it was given as "${str}" (type ${typeof str})`
    );
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(
      `is-relative-uri: [THROW_ID_02] opts be plain object, it was given as ${originalOpts} (type ${typeof originalOpts})`
    );
  }
  let opts: Opts = { ...defaults, ...originalOpts };
  if (opts.offset && !Number.isInteger(opts.offset)) {
    throw new Error(
      `is-relative-uri: [THROW_ID_02] opts.offset must be an integer, it was given as ${
        opts.offset
      } (type ${typeof opts.offset})`
    );
  }
  if (!opts.offset) {
    // to cater false/null
    opts.offset = 0;
  }
  DEV &&
    console.log(
      `365 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} opts = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );

  // ---------------------------------------------------------------------------

  if (str.split("").some((char) => !char.trim())) {
    return { res: false, message: `Remove whitespace.` };
  }
  if (str.match(/\/\s*\/\s*\//g)) {
    return { res: false, message: `Three consecutive slashes found.` };
  }
  if (str.match(/.\/\s*\//g)) {
    return {
      res: false,
      message: `Character followed by two slashes.`,
    };
  }
  if (str.includes("...")) {
    return {
      res: false,
      message: `Three consecutive dots.`,
    };
  }

  // RFC 3986 bad characters
  if (str.includes("%") && !str.match(/%[0-9a-f]/gi)) {
    // percentages should be escaped in URI's, so the next
    // character after percentage should be 0-9 or a-f
    return {
      res: false,
      message: `Unescaped "%" character.`,
    };
  }
  if (str.includes("<")) {
    return {
      res: false,
      message: `Unescaped "<" character.`,
    };
  }
  if (str.includes(">")) {
    return {
      res: false,
      message: `Unescaped ">" character.`,
    };
  }
  if (str.includes("[")) {
    return {
      res: false,
      message: `Unescaped "[" character.`,
    };
  }
  if (str.includes("]")) {
    return {
      res: false,
      message: `Unescaped "]" character.`,
    };
  }
  if (str.includes("{")) {
    return {
      res: false,
      message: `Unescaped "{" character.`,
    };
  }
  if (str.includes("}")) {
    return {
      res: false,
      message: `Unescaped "}" character.`,
    };
  }
  if (str.includes("|")) {
    return {
      res: false,
      message: `Unescaped "|" character.`,
    };
  }
  if (str.includes(BACKSLASH)) {
    return {
      res: false,
      message: `Unescaped backslash (${BACKSLASH}) character.`,
    };
  }
  if (str.includes("^")) {
    return {
      res: false,
      message: `Unescaped caret (^) character.`,
    };
  }
  if (str.endsWith(".") && !str.startsWith(".")) {
    return {
      res: false,
      message: `Ends with dot, is file extension missing?`,
    };
  }
  if (str.includes("??")) {
    return {
      res: false,
      message: `Two consecutive question marks.`,
    };
  }
  if (str.includes("##")) {
    return {
      res: false,
      message: `Two consecutive hashes.`,
    };
  }
  if (str.endsWith("#")) {
    return {
      res: false,
      message: `Ends with a hash.`,
    };
  }
  // slice the rest of the string after the first hash
  if (str.includes("#") && str.slice(str.indexOf("#") + 1).includes("/")) {
    return {
      res: false,
      message: `Slash follows hash.`,
    };
  }
  if (str.match(/\.\.[^/]/g)) {
    return {
      res: false,
      message: `Two dots should be followed by a slash.`,
    };
  }

  // opts.flagUpUrisWithSchemes
  // ---------------------------------------------------------------------------
  if (
    opts.flagUpUrisWithSchemes &&
    (str.startsWith(`http:`) ||
      str.startsWith(`https:`) ||
      str.startsWith(`ftp:`) ||
      str.startsWith(`mailto:`) ||
      str.startsWith(`file:`) ||
      str.startsWith(`data:`) ||
      str.startsWith(`irc:`) ||
      knownSchemes.some((scheme) => str.startsWith(`${scheme}:`)))
  ) {
    return {
      res: false,
      message: null,
    };
  }

  // ---------------------------------------------------------------------------
  DEV && console.log(`514 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`}`);
  return {
    res: true,
    message: null,
  };
}

export { isRel, defaults, version };

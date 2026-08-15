const IIFE_BROWSER_POLICY = Object.freeze({
  family: "Chromium",
  minimumMajor: 58,
  esbuildTarget: "chrome58",
  snapshotRevision: "454475",
  snapshotVersion: "58.0.3029.0",
  snapshotArchiveSha256:
    "c43892cbcf8d9d5402c3168aa6d14877f13597a6ed966b74f7837ac4031cadf4",
  snapshotArchiveUrl:
    "https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/454475/chrome-linux.zip",
});

const UNSUPPORTED_IIFE_APIS = Object.freeze([
  Object.freeze({
    name: "AbortController",
    pattern: /new\s+AbortController\s*\(/u,
  }),
  Object.freeze({
    name: "AbortSignal newer statics",
    pattern: /AbortSignal\.(?:abort|any|timeout)\(/u,
  }),
  Object.freeze({ name: "AggregateError", pattern: /\bAggregateError\s*\(/u }),
  Object.freeze({ name: "Array.prototype.at", pattern: /\.at\(/u }),
  Object.freeze({ name: "Array.prototype.findLast", pattern: /\.findLast\(/u }),
  Object.freeze({
    name: "Array.prototype.findLastIndex",
    pattern: /\.findLastIndex\(/u,
  }),
  Object.freeze({ name: "Array.prototype.flat", pattern: /\.flat\(/u }),
  Object.freeze({ name: "Array.prototype.flatMap", pattern: /\.flatMap\(/u }),
  Object.freeze({
    name: "Array.prototype.toReversed",
    pattern: /\.toReversed\(/u,
  }),
  Object.freeze({ name: "Array.prototype.toSorted", pattern: /\.toSorted\(/u }),
  Object.freeze({
    name: "Array.prototype.toSpliced",
    pattern: /\.toSpliced\(/u,
  }),
  Object.freeze({ name: "Array.prototype.with", pattern: /\.with\(/u }),
  Object.freeze({ name: "Array.fromAsync", pattern: /Array\.fromAsync\(/u }),
  Object.freeze({ name: "Atomics", pattern: /\bAtomics\./u }),
  Object.freeze({ name: "BigInt", pattern: /\bBigInt\s*\(/u }),
  Object.freeze({
    name: "BigInt literal",
    pattern: /\b(?:0[xob][\da-f]+|\d+)n\b/iu,
  }),
  Object.freeze({
    name: "BigInt typed arrays",
    pattern: /\b(?:BigInt64Array|BigUint64Array)\b/u,
  }),
  Object.freeze({
    name: "FinalizationRegistry",
    pattern: /FinalizationRegistry\(/u,
  }),
  Object.freeze({
    name: "Object.fromEntries",
    pattern: /Object\.fromEntries\(/u,
  }),
  Object.freeze({ name: "Map.groupBy", pattern: /Map\.groupBy\(/u }),
  Object.freeze({ name: "Object.groupBy", pattern: /Object\.groupBy\(/u }),
  Object.freeze({
    name: "Object.hasOwn",
    pattern: /Object(?:\.hasOwn|\[\s*(?:"hasOwn"|'hasOwn')\s*\])\s*\(/u,
  }),
  Object.freeze({
    name: "Promise.allSettled",
    pattern: /Promise\.allSettled\(/u,
  }),
  Object.freeze({ name: "Promise.any", pattern: /Promise\.any\(/u }),
  Object.freeze({
    name: "Promise.prototype.finally",
    pattern: /\.finally\(/u,
  }),
  Object.freeze({
    name: "Promise.withResolvers",
    pattern: /Promise\.withResolvers\(/u,
  }),
  Object.freeze({ name: "RegExp.escape", pattern: /RegExp\.escape\(/u }),
  Object.freeze({
    name: "SharedArrayBuffer construction",
    pattern: /\bSharedArrayBuffer\s*\(/u,
  }),
  Object.freeze({
    name: "String.prototype.matchAll",
    pattern: /\.matchAll\(/u,
  }),
  Object.freeze({
    name: "String.prototype.replaceAll",
    pattern: /\.replaceAll\(/u,
  }),
  Object.freeze({
    name: "String well-formed methods",
    pattern: /\.(?:isWellFormed|toWellFormed)\(/u,
  }),
  Object.freeze({ name: "String.prototype.trimEnd", pattern: /\.trimEnd\(/u }),
  Object.freeze({
    name: "String.prototype.trimStart",
    pattern: /\.trimStart\(/u,
  }),
  Object.freeze({ name: "WeakRef", pattern: /WeakRef\(/u }),
  Object.freeze({
    name: "Symbol.asyncIterator",
    pattern: /Symbol\.asyncIterator/u,
  }),
  Object.freeze({
    name: "newer Intl constructors",
    pattern:
      /new\s+Intl\.(?:DisplayNames|ListFormat|Locale|PluralRules|RelativeTimeFormat)\s*\(/u,
  }),
  Object.freeze({
    name: "Intl.supportedValuesOf",
    pattern: /Intl\.supportedValuesOf\(/u,
  }),
  Object.freeze({
    name: "Intl range formatting",
    pattern: /\.(?:formatRange|formatRangeToParts)\(/u,
  }),
  Object.freeze({ name: "queueMicrotask", pattern: /queueMicrotask\(/u }),
  Object.freeze({ name: "structuredClone", pattern: /structuredClone\(/u }),
  Object.freeze({ name: "globalThis", pattern: /\bglobalThis\b/u }),
]);

// Esbuild lowers language syntax but passes regular-expression literals through
// unchanged, so a literal newer than the floor is not a missing API call: it is
// a parse error which disables the whole bundle at load. These are the classes
// which postdate Chromium 58 and which esbuild will not rewrite.
//
// These four have substrings distinctive enough to match directly. Flags do
// not, so scanRegexpFlags() below reads them off the literals themselves.
const UNSUPPORTED_IIFE_REGEXP_SYNTAX = Object.freeze([
  Object.freeze({
    name: "regular expression lookbehind (Chromium 62)",
    pattern: /\(\?<[=!]/u,
  }),
  Object.freeze({
    name: "regular expression named capture group (Chromium 64)",
    pattern: /\(\?<[A-Za-z_$][\w$]*>/u,
  }),
  Object.freeze({
    name: "regular expression named backreference (Chromium 64)",
    pattern: /\\k<[A-Za-z_$][\w$]*>/u,
  }),
  Object.freeze({
    name: "regular expression Unicode property escape (Chromium 64)",
    pattern: /\\[pP]\{[A-Za-z]/u,
  }),
]);

const UNSUPPORTED_IIFE_REGEXP_FLAGS = Object.freeze([
  Object.freeze({
    flag: "s",
    name: "regular expression dotAll flag (Chromium 62)",
  }),
  Object.freeze({
    flag: "d",
    name: "regular expression match indices flag (Chromium 90)",
  }),
  Object.freeze({
    flag: "v",
    name: "regular expression unicodeSets flag (Chromium 112)",
  }),
]);

// A `/` opens a regular expression only where a value cannot already have
// ended, so the keyword or punctuation before it decides. `)` and `]` are
// deliberately read as division: `if (x) /re/.test(y)` is legal but rare, and
// mistaking a division for a literal would fail a build over nothing.
const KEYWORDS_BEFORE_REGEXP = new Set([
  "await",
  "case",
  "delete",
  "do",
  "else",
  "in",
  "instanceof",
  "new",
  "of",
  "return",
  "typeof",
  "void",
  "yield",
]);
const OPERATOR_BEFORE_REGEXP = /[([{,;:=!?&|+\-*%~^<>]/u;
const WORD_CHARACTER = /[\w$]/u;

const REGEXP_CONSTRUCTOR_FLAGS =
  /\bRegExp\s*\([^)]*,\s*(["'`])([dgimsuvy]*)\1\s*\)/gu;

// Walks the bundle once, skipping comments, strings and template literals, and
// collects the flags of every regular-expression literal it finds. Flags have
// no distinctive substring to match, and the text inside a string very often
// looks like one - a minified `["</td","<html"]` reads as a literal with an
// `s` flag - so the scan has to know code from data. Nested template
// interpolations are tracked with an explicit stack.
function scanRegexpFlags(source) {
  const flagSets = [];
  const templateBraceDepths = [];
  let index = 0;
  let lastSignificant = "";
  let lastWord = "";

  function canStartRegexp() {
    if (!lastSignificant) {
      return true;
    }
    if (OPERATOR_BEFORE_REGEXP.test(lastSignificant)) {
      return true;
    }
    if (WORD_CHARACTER.test(lastSignificant)) {
      return KEYWORDS_BEFORE_REGEXP.has(lastWord);
    }
    return !")]\"'`".includes(lastSignificant);
  }

  function skipString(quote) {
    let cursor = index + 1;
    while (cursor < source.length) {
      if (source[cursor] === "\\") {
        cursor += 2;
        continue;
      }
      if (source[cursor] === quote) {
        return cursor + 1;
      }
      cursor += 1;
    }
    return source.length;
  }

  // returns the index after the literal, or null when this `/` is a division
  function readRegexpLiteral() {
    let cursor = index + 1;
    let inCharacterClass = false;
    while (cursor < source.length) {
      const character = source[cursor];
      if (character === "\\") {
        cursor += 2;
        continue;
      }
      if (character === "\n") {
        return null;
      }
      if (inCharacterClass) {
        if (character === "]") {
          inCharacterClass = false;
        }
      } else if (character === "[") {
        inCharacterClass = true;
      } else if (character === "/") {
        let end = cursor + 1;
        while (end < source.length && /[a-z]/u.test(source[end])) {
          end += 1;
        }
        flagSets.push(source.slice(cursor + 1, end));
        return end;
      }
      cursor += 1;
    }
    return null;
  }

  while (index < source.length) {
    const character = source[index];

    if (character === "`") {
      // enter the template literal and scan it for `${` interpolations
      let cursor = index + 1;
      let closed = false;
      while (cursor < source.length) {
        if (source[cursor] === "\\") {
          cursor += 2;
          continue;
        }
        if (source[cursor] === "`") {
          closed = true;
          cursor += 1;
          break;
        }
        if (source[cursor] === "$" && source[cursor + 1] === "{") {
          templateBraceDepths.push(0);
          cursor += 2;
          break;
        }
        cursor += 1;
      }
      index = cursor;
      lastSignificant = closed ? "`" : "";
      lastWord = "";
      continue;
    }

    if (character === "}" && templateBraceDepths.length) {
      if (templateBraceDepths[templateBraceDepths.length - 1] === 0) {
        // back into the template text this interpolation interrupted
        templateBraceDepths.pop();
        let cursor = index + 1;
        while (cursor < source.length) {
          if (source[cursor] === "\\") {
            cursor += 2;
            continue;
          }
          if (source[cursor] === "`") {
            cursor += 1;
            break;
          }
          if (source[cursor] === "$" && source[cursor + 1] === "{") {
            templateBraceDepths.push(0);
            cursor += 2;
            break;
          }
          cursor += 1;
        }
        index = cursor;
        lastSignificant = "`";
        lastWord = "";
        continue;
      }
      templateBraceDepths[templateBraceDepths.length - 1] -= 1;
    } else if (character === "{" && templateBraceDepths.length) {
      templateBraceDepths[templateBraceDepths.length - 1] += 1;
    }

    if (character === '"' || character === "'") {
      index = skipString(character);
      lastSignificant = character;
      lastWord = "";
      continue;
    }

    if (character === "/" && source[index + 1] === "/") {
      const newline = source.indexOf("\n", index);
      index = newline === -1 ? source.length : newline;
      continue;
    }

    if (character === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      index = end === -1 ? source.length : end + 2;
      continue;
    }

    if (character === "/" && canStartRegexp()) {
      const after = readRegexpLiteral();
      if (after !== null) {
        index = after;
        lastSignificant = "/";
        lastWord = "";
        continue;
      }
    }

    if (WORD_CHARACTER.test(character)) {
      let end = index;
      while (end < source.length && WORD_CHARACTER.test(source[end])) {
        end += 1;
      }
      lastWord = source.slice(index, end);
      lastSignificant = source[end - 1];
      index = end;
      continue;
    }

    if (character.trim()) {
      lastSignificant = character;
      lastWord = "";
    }
    index += 1;
  }

  REGEXP_CONSTRUCTOR_FLAGS.lastIndex = 0;
  for (
    let match = REGEXP_CONSTRUCTOR_FLAGS.exec(source);
    match !== null;
    match = REGEXP_CONSTRUCTOR_FLAGS.exec(source)
  ) {
    flagSets.push(match[2]);
  }

  return flagSets;
}

function findUnsupportedIifeRegexpSyntax(source) {
  if (typeof source !== "string") {
    throw new TypeError("The IIFE source must be a string");
  }
  const found = UNSUPPORTED_IIFE_REGEXP_SYNTAX.filter(({ pattern }) =>
    pattern.test(source),
  ).map(({ name }) => name);

  const flagSets = scanRegexpFlags(source);
  for (const { flag, name } of UNSUPPORTED_IIFE_REGEXP_FLAGS) {
    if (flagSets.some((flags) => flags.includes(flag))) {
      found.push(name);
    }
  }
  return found;
}

function withoutGuardedGlobalThis(source) {
  return source
    .replace(
      /typeof\s+globalThis\s*(?:<\s*["']u["']|!==?\s*["']undefined["'])\s*\?\s*globalThis/gu,
      "",
    )
    .replace(
      /if\s*\(\s*typeof\s+globalThis\s*={2,3}\s*["']object["']\s*\)\s*return\s+globalThis/gu,
      "",
    );
}

function iifeGlobalName(packageDirectoryName) {
  if (
    typeof packageDirectoryName !== "string" ||
    !/^[A-Za-z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*$/u.test(packageDirectoryName)
  ) {
    throw new TypeError(
      `Invalid IIFE package directory name: ${String(packageDirectoryName)}`,
    );
  }
  const words = packageDirectoryName.split("-");
  return (
    `${words[0][0].toLowerCase()}${words[0].slice(1)}` +
    words
      .slice(1)
      .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
      .join("")
  );
}

function findUnsupportedIifeApis(source) {
  if (typeof source !== "string") {
    throw new TypeError("The IIFE source must be a string");
  }
  const sourceWithoutGuardedGlobalThis = withoutGuardedGlobalThis(source);
  return UNSUPPORTED_IIFE_APIS.filter(({ name, pattern }) =>
    pattern.test(
      name === "globalThis" ? sourceWithoutGuardedGlobalThis : source,
    ),
  ).map(({ name }) => name);
}

function languageCodeSmoke(api, equal) {
  equal(api.isLangCode("qaa-Qaaa-QM-x-southern"), {
    res: true,
    message: null,
  });
}

function stringConvertIndexesSmoke(api, equal) {
  const input = "a🧑‍🤝‍🧑b";
  equal(api.nativeToUnicode(input, [1, 2, 8, 9]), [1, 1, 1, 2]);
  equal(api.unicodeToNative(input, 2), 9);
}

function astDeepContainsSmoke(api, equal) {
  const gathered = [];
  const errors = [];
  api.deepContains(
    [{ a: 1 }, { b: 2 }, { c: 3 }],
    [{ c: 3 }, { a: 1 }, { b: 2 }],
    (left, right, path) => gathered.push([left, right, path]),
    (error) => errors.push(error),
  );
  equal(gathered, [
    [3, 3, "c"],
    [1, 1, "a"],
    [2, 2, "b"],
  ]);
  equal(errors, []);
}

function codsenUtilsSmoke(api, equal) {
  const value = Object.create(null);
  value.hasOwnProperty = "shadowed";
  value.own = true;
  equal(api.hasOwnProp(value, "own"), true);
  equal(api.hasOwnProp(value, "missing"), false);
  equal(api.deepClone({ nested: { x: 1 } }), { nested: { x: 1 } });
  equal(api.formatDiagnosticValue(Symbol("x")), 'Symbol("x")');
  equal(
    api.codsenCLI("", {
      argv: [],
      flags: { a: { type: "boolean" }, b: { default: "x" } },
      booleanDefault: undefined,
      autoHelp: false,
      autoVersion: false,
    }).flags,
    { b: "x" },
  );
}

function detergentSmoke(api, equal) {
  equal(api.det("clean this text £").res, "clean this text&nbsp;&pound;");
}

function testMixerSmoke(api, equal) {
  equal(api.mixer({}, { enabled: true, cached: false }), [
    { enabled: false, cached: false },
    { enabled: true, cached: false },
    { enabled: false, cached: true },
    { enabled: true, cached: true },
  ]);
}

function arrayGroupSmoke(api, equal) {
  equal(api.groupStr(["a1-1", "a2-2", "b3-3", "c4-4"]), {
    "a*-*": 2,
    "b3-3": 1,
    "c4-4": 1,
  });
}

function emailCombSmoke(api, equal) {
  const source =
    '<head><style>.unused{x:y}.used{x:z}</style></head><body class="  used  ">z</body>';
  equal(
    api.comb(source).result,
    '<head><style>.used{x:z}</style></head><body class="used">z</body>',
  );
}

function generateAtomicCssSmoke(api, equal) {
  equal(api.extractFromToSource("mt|10"), [0, 10, "mt"]);
  equal(api.extractFromToSource(".m$$$[lang|=en] { margin: $$$px; } | 2 | 4"), [
    2,
    4,
    ".m$$$[lang|=en] { margin: $$$px; }",
  ]);
}

function stringStripHtmlSmoke(api, equal) {
  equal(api.stripHtml("a <b> x </b>    ").result, "a x");
  equal(
    api.stripHtml('<a href="https://example.com/docs">Read the docs</a>', {
      dumpLinkHrefsNearby: { enabled: true },
    }).result,
    "Read the docs https://example.com/docs",
  );
}

const IIFE_API_SMOKES = Object.freeze({
  "array-group-str-omit-num-char": arrayGroupSmoke,
  "ast-deep-contains": astDeepContainsSmoke,
  "codsen-utils": codsenUtilsSmoke,
  detergent: detergentSmoke,
  "email-comb": emailCombSmoke,
  "generate-atomic-css": generateAtomicCssSmoke,
  "is-language-code": languageCodeSmoke,
  "string-convert-indexes": stringConvertIndexesSmoke,
  "string-strip-html": stringStripHtmlSmoke,
  "test-mixer": testMixerSmoke,
});

export {
  findUnsupportedIifeApis,
  findUnsupportedIifeRegexpSyntax,
  IIFE_API_SMOKES,
  IIFE_BROWSER_POLICY,
  iifeGlobalName,
};

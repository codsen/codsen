// The floor is one exact Chromium build, and the gate loads the IIFEs in that
// build's content shell rather than in `chrome`. Both binaries are produced by
// the same snapshot, so they carry the same Blink and the same V8, which is all
// an IIFE can observe; the difference is the desktop shell around them. `chrome`
// links GTK2 and re-exports its own bundled HarfBuzz (285 `hb_*` symbols), so
// the moment it builds the GTK theme, the host's modern pango binds most of its
// `hb_*` calls to that 2017 HarfBuzz while the handful of entry points added
// later (`hb_ot_var_get_axis_infos` first among them) still resolve to the
// host's, which then reads a face the old code allocated and segfaults before
// the first page loads. The content shell links no GTK at all and calls pango
// only to enumerate font families, so it never opens that seam.
const IIFE_BROWSER_POLICY = Object.freeze({
  family: "Chromium",
  minimumMajor: 58,
  esbuildTarget: "chrome58",
  snapshotRevision: "454475",
  snapshotVersion: "58.0.3029.0",
  snapshotArchiveSha256:
    "cd4ca41be0d2614f8d7ae0b98be130e45cccaa3ec06069ae06d10b7a499015db",
  snapshotArchiveUrl:
    "https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/454475/content-shell.zip",
  snapshotExecutablePath: "content-shell/content_shell",
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

// Regular-expression syntax newer than the floor is audited by
// ops/helpers/browserRegexpSyntax.js. That audit parses the bundle with
// TypeScript, and this file is a declared input of every package build, so the
// two are kept apart to keep a compiler off the build path.

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

function astCompareSmoke(api, equal) {
  const progress = [];
  let completion;

  equal(typeof api.compare, "function");
  equal(typeof api.version, "string");
  equal(Object.isFrozen(api.defaults), true);
  equal(api.compare(["a", "b", "c"], ["a", "c"]), true);
  equal(
    api.compare(["alpha", "beta"], ["*", "a*"], {
      arrayOrder: "any",
      matchStrictly: true,
      useWildcards: true,
    }),
    true,
  );
  equal(
    api.compare(
      { alpha: "x", beta: "y" },
      { "a*": "x", "al*": "x" },
      { matchStrictly: true, useWildcards: true },
    ),
    false,
  );
  equal(
    api.compare({ alpha: { value: 1 } }, { "a*": { value: 2 } }, {
      useWildcards: true,
    }),
    false,
  );
  equal(
    api.compare(["real"], [" "], { hungryForWhitespace: true }),
    false,
  );
  equal(
    api.compare(["a", "b"], ["b", "a"], {
      arrayOrder: "any",
      reportCompletionFunc: function (stats) {
        completion = stats;
      },
      reportProgressFunc: function (percentageDone) {
        progress.push(percentageDone);
      },
      reportProgressFuncFrom: 20,
      reportProgressFuncTo: 40,
    }),
    true,
  );
  equal(progress, [20, 40]);
  equal(
    [
      completion.candidateComparisons,
      completion.comparisons,
      completion.matchingEdges,
      typeof completion.timeTakenInMilliseconds,
    ],
    [4, 5, 2, "number"],
  );
}

function astContainsOnlyEmptySpaceSmoke(api, equal) {
  const symbolDecoratedRecord = { content: "visible" };
  symbolDecoratedRecord[Symbol.toStringTag] = "Record";
  const progress = [];
  let completion;

  equal(typeof api.empty, "function");
  equal(typeof api.version, "string");
  equal(Object.isFrozen(api.defaults), true);
  equal(api.empty({ nodes: [" \n", { value: "\t" }] }), true);
  equal(api.empty({ nodes: [" ", { value: "visible" }] }), false);
  equal(api.empty(symbolDecoratedRecord), false);
  equal(
    api.empty(
      { nodes: [" \n", { value: "\t" }] },
      {
        reportCompletionFunc: (stats) => {
          completion = stats;
        },
        reportProgressFunc: (percentageDone) => {
          progress.push(percentageDone);
        },
        reportProgressFuncFrom: 20,
        reportProgressFuncTo: 40,
      },
    ),
    true,
  );
  equal(progress, [20, 40]);
  equal(
    [
      completion.arrayElementsVisited,
      completion.maxDepth,
      completion.objectPropertiesVisited,
      completion.uniqueContainersVisited,
      Object.isFrozen(completion),
    ],
    [2, 3, 2, 3, true],
  );
}

function astIsEmptySmoke(api, equal) {
  const progress = [];
  let completion;
  const cycle = {};
  cycle.self = cycle;
  const iteratorPoisoned = [""];
  Object.defineProperty(iteratorPoisoned, Symbol.iterator, {
    get: function () {
      throw new Error("iterator accessed");
    },
  });
  const shared = { value: "" };

  equal(typeof api.isEmpty, "function");
  equal(typeof api.version, "string");
  equal(Object.isFrozen(api.defaults), true);
  equal(api.isEmpty({ nodes: ["", { value: "" }] }), true);
  equal(api.isEmpty({ nodes: ["", { value: "visible" }] }), false);
  equal(api.isEmpty(" "), false);
  equal(api.isEmpty(["visible", 0]), null);
  equal(api.isEmpty([0, "visible"]), null);
  equal(api.isEmpty(cycle), null);
  equal(api.isEmpty(iteratorPoisoned), true);
  equal(
    api.isEmpty([shared, shared], {
      reportCompletionFunc: (stats) => {
        completion = stats;
      },
      reportProgressFunc: (percentageDone) => {
        progress.push(percentageDone);
      },
      reportProgressFuncFrom: 20,
      reportProgressFuncTo: 40,
    }),
    true,
  );
  equal(progress, [20, 40]);
  equal(
    [
      completion.aliasesSkipped,
      completion.arrayElementsVisited,
      completion.maxDepth,
      completion.objectPropertiesVisited,
      completion.uniqueContainersVisited,
      typeof completion.timeTakenInMilliseconds,
      Object.isFrozen(completion),
    ],
    [1, 2, 2, 1, 2, "number", true],
  );
}

function astMonkeySmoke(api, equal) {
  equal(
    [
      typeof api.arrayFirstOnly,
      typeof api.del,
      typeof api.drop,
      typeof api.find,
      typeof api.get,
      typeof api.set,
      typeof api.version,
    ],
    [
      "function",
      "function",
      "function",
      "function",
      "function",
      "function",
      "string",
    ],
  );
  equal(api.find({ a: 1 }, { key: "a" }), [
    { index: 1, key: "a", val: 1, path: [1] },
  ]);
  var message = "";
  try {
    api.find({ a: 1 }, { key: 1 });
  } catch (error) {
    message = error.message;
  }
  equal(message.indexOf("ast-monkey/find(): [THROW_ID_03]") === 0, true);
}

function astMonkeyUtilSmoke(api, equal) {
  equal(
    [
      typeof api.parent,
      typeof api.pathNext,
      typeof api.pathPrev,
      typeof api.pathUp,
      typeof api.version,
    ],
    ["function", "function", "function", "function", "string"],
  );
  equal(api.parent("a.0.c"), "0");
  equal(api.pathNext("9.children.3"), "9.children.4");
  equal(api.pathPrev("9.children.33"), "9.children.32");
  equal(api.pathUp("9.children.3"), "9");
  equal(api.pathPrev("9007199254740991"), "9007199254740990");
  equal(
    api.pathNext("root.children.99999999999999999999"),
    "root.children.100000000000000000000",
  );
  equal(api.pathNext("article."), "article.");
  equal(api.pathUp(".a"), "0");
  equal(api.pathNext(["a.b", "children", "0"]), ["a.b", "children", "1"]);
  equal(api.pathUp(["", "children", "0"]), [""]);
}

function checkTypesMiniSmoke(api, equal) {
  var progress = [];
  var completion;
  equal(
    [
      typeof api.CheckTypesMiniError,
      typeof api.checkTypesMini,
      typeof api.version,
      Object.isFrozen(api.defaults),
    ],
    ["function", "function", "string", true],
  );
  api.checkTypesMini({ config: { enabled: true } }, null, {
    reportCompletionFunc: function (stats) {
      completion = stats;
    },
    reportProgressFunc: function (percentageDone) {
      progress.push(percentageDone);
    },
    reportProgressFuncFrom: 20,
    reportProgressFuncTo: 40,
    schema: { config: { enabled: "boolean" } },
  });
  equal(progress, [20, 40]);
  equal(
    [
      completion.arrayElementsVisited,
      completion.maxDepth,
      completion.objectPropertiesVisited,
      completion.schemaEntries,
      completion.valuesIgnored,
      completion.valuesValidated,
      typeof completion.timeTakenInMilliseconds,
    ],
    [0, 2, 2, 2, 0, 2, "number"],
  );
  api.checkTypesMini({ "literal.dot": 1 }, null, {
    schema: { "literal\\.dot": "number" },
  });
  var error;
  try {
    api.checkTypesMini({ enabled: "yes" }, { enabled: false });
  } catch (caught) {
    error = caught;
  }
  equal(error instanceof api.CheckTypesMiniError, true);
  equal(
    [
      error.actualType,
      error.context,
      error.expectedTypes,
      error.path,
      error.validatorCode,
      error.toJSON().validatorCode,
    ],
    [
      "string",
      "check-types-mini",
      ["boolean"],
      ["enabled"],
      "THROW_ID_21",
      "THROW_ID_21",
    ],
  );
}

function codsenUtilsSmoke(api, equal) {
  const value = Object.create(null);
  value.hasOwnProperty = "shadowed";
  value.own = true;
  equal(api.hasOwnProp(value, "own"), true);
  equal(api.hasOwnProp(value, "missing"), false);
  equal(api.deepClone({ nested: { x: 1 } }), { nested: { x: 1 } });
  const protoSource = {};
  Object.defineProperty(protoSource, "__proto__", {
    configurable: true,
    enumerable: true,
    value: { polluted: "local" },
    writable: true,
  });
  const protoClone = api.deepClone(protoSource);
  const protoCloneValue = Object.getOwnPropertyDescriptor(
    protoClone,
    "__proto__",
  ).value;
  equal(
    [
      Object.getOwnPropertyDescriptor(protoClone, "__proto__") !== undefined,
      Object.getPrototypeOf(protoClone) === Object.prototype,
      protoCloneValue.polluted,
      Object.prototype.polluted,
    ],
    [true, true, "local", undefined],
  );
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
  const rows = api.mixer(
    {},
    { enabled: true, cached: false, nested: { value: 1 } },
  );
  equal(rows, [
    { enabled: false, cached: false, nested: { value: 1 } },
    { enabled: true, cached: false, nested: { value: 1 } },
    { enabled: false, cached: true, nested: { value: 1 } },
    { enabled: true, cached: true, nested: { value: 1 } },
  ]);
  rows[0].nested.value = 2;
  equal(rows[1].nested.value, 1);
  equal(Array.from(api.mixerLazy({ enabled: true }, { enabled: false })), [
    { enabled: true },
  ]);
  const protoDefaults = { enabled: false };
  Object.defineProperty(protoDefaults, "__proto__", {
    configurable: true,
    enumerable: true,
    value: false,
    writable: true,
  });
  const protoRows = api.mixer({}, protoDefaults);
  const lazyProtoRows = Array.from(api.mixerLazy({}, protoDefaults));
  equal(
    [protoRows, lazyProtoRows].map((resultRows) =>
      resultRows.map((row) => [
        row.enabled,
        Object.getOwnPropertyDescriptor(row, "__proto__").value,
        Object.getOwnPropertyDescriptor(row, "__proto__") !== undefined,
        Object.getPrototypeOf(row) === Object.prototype,
      ]),
    ),
    [
      [
        [false, false, true, true],
        [true, false, true, true],
        [false, true, true, true],
        [true, true, true, true],
      ],
      [
        [false, false, true, true],
        [true, false, true, true],
        [false, true, true, true],
        [true, true, true, true],
      ],
    ],
  );
}

function objectBooleanCombinationsSmoke(api, equal) {
  const input = { enabled: false };
  Object.defineProperty(input, "__proto__", {
    configurable: true,
    enumerable: true,
    value: false,
    writable: true,
  });
  const rows = api.combinations(input);
  equal(
    rows.map((row) => [
      row.enabled,
      Object.getOwnPropertyDescriptor(row, "__proto__").value,
      Object.getOwnPropertyDescriptor(row, "__proto__") !== undefined,
      Object.getPrototypeOf(row) === Object.prototype,
    ]),
    [
      [false, false, true, true],
      [true, false, true, true],
      [false, true, true, true],
      [true, true, true, true],
    ],
  );
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

function htmlCrushSmoke(api, equal) {
  const body = new Array(1002).join("a");
  const source = `<p>${body}<!--x--></p>`;
  const progress = [];
  const result = api.crush(source, {
    removeHTMLComments: true,
    reportProgressFunc: (percentage) => progress.push(percentage),
    reportProgressFuncFrom: 20,
    reportProgressFuncTo: 40,
  });

  equal(typeof api.crush, "function");
  equal(result.result, `<p>${body}</p>`);
  equal(result.ranges, [[1004, 1012]]);
  equal(result.applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(
    [
      result.log.originalLengthInCodeUnits,
      result.log.cleanedLengthInCodeUnits,
      result.log.codeUnitsSaved,
      result.log.originalLengthInUtf8Bytes,
      result.log.cleanedLengthInUtf8Bytes,
      result.log.utf8BytesSaved,
    ],
    [1016, 1008, 8, 1016, 1008, 8],
  );
  equal(progress, [30, 40]);
  equal(
    [result, result.log, result.applicableOpts].map(
      (value) => Object.getPrototypeOf(value) === Object.prototype,
    ),
    [true, true, true],
  );
}

function htmlImgAltSmoke(api, equal) {
  equal(typeof api.alts, "function");
  equal(typeof api.version, "string");
  equal(
    api.alts('zzz<img src="spacer.gif" >zzz'),
    'zzz<img src="spacer.gif" alt="" >zzz',
  );
  var message = "";
  try {
    api.alts("text", { rogue: true });
  } catch (error) {
    message = error.message;
  }
  equal(message.indexOf("html-img-alt/alts(): [THROW_ID_03]") === 0, true);
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

function stringExtractClassNamesSmoke(api, equal) {
  equal(api.readCssSelectorToken(".\\31 23:hover", 0), {
    value: ".123",
    raw: ".\\31 23",
    range: [0, 7],
  });
  equal(api.readCssSelectorToken(".a\\", 0), {
    value: ".a\uFFFD",
    raw: ".a\\",
    range: [0, 3],
  });
}

function stringRemoveWidowsSmoke(api, equal) {
  var progress = [];
  var result = api.removeWidows("&nbsp; aaa bbb ccc ddd", {
    minWordCount: 0,
    minCharCount: 0,
    reportProgressFunc: (percentageDone) => {
      progress.push(percentageDone);
    },
    reportProgressFuncFrom: 20,
    reportProgressFuncTo: 40,
    tagRanges: [[0, 6]],
  });

  equal(typeof api.removeWidows, "function");
  equal(typeof api.version, "string");
  equal(
    [
      Object.isFrozen(api.defaults),
      Object.isFrozen(api.defaults.ignore),
      Object.isFrozen(api.defaults.tagRanges),
    ],
    [true, true, true],
  );
  var defaultsSnapshot = JSON.stringify(api.defaults);
  try {
    api.defaults.minWordCount = 0;
  } catch (_error) {}
  try {
    api.defaults.ignore.push("jinja");
  } catch (_error) {}
  equal(JSON.stringify(api.defaults), defaultsSnapshot);
  equal(api.removeWidows("aaa bbb ccc").res, "aaa bbb ccc");
  equal(result.res, "&nbsp; aaa bbb ccc&nbsp;ddd");
  equal(result.ranges, [[18, 19, "&nbsp;"]]);
  equal(result.whatWasDone, {
    removeWidows: true,
    convertEntities: false,
  });
  equal(result.applicableOpts, {
    removeWidows: true,
    convertEntities: true,
  });
  equal([progress[0], progress[progress.length - 1]], [20, 40]);
  equal(
    progress.every(
      (value, index) =>
        Number.isFinite(value) &&
        Math.floor(value) === value &&
        value >= 20 &&
        value <= 40 &&
        (index === 0 || value > progress[index - 1]),
    ),
    true,
  );
  equal(typeof result.log.timeTakenInMilliseconds, "number");
  equal(
    [result, result.log, result.whatWasDone, result.applicableOpts].map(
      (value) => Object.getPrototypeOf(value) === Object.prototype,
    ),
    [true, true, true, true],
  );
  equal(
    api.removeWidows("aaa bbb ccc ddd", {
      minWordCount: 0,
      minCharCount: 0,
      targetLanguage: "css",
    }).res,
    "aaa bbb ccc\\0000A0ddd",
  );
}

function arrayIncludesWithGlobSmoke(api, equal) {
  const progress = [];
  let completion;

  equal(typeof api.includesWithGlob, "function");
  equal(typeof api.version, "string");
  equal(Object.isFrozen(api.defaults), true);
  equal(api.includesWithGlob([null, "index.js"], "*.js"), true);
  equal(
    api.includesWithGlob(
      ["index.js", "theme.css", "index.test.js"],
      ["*.js", "*.css", "!*.test.js"],
      { arrayVsArrayAllMustBeFound: "all" },
    ),
    true,
  );
  equal(api.includesWithGlob(["index.test.js"], ["*.js", "!*.test.js"]), false);
  equal(api.includesWithGlob("", [""]), true);
  equal(
    api.includesWithGlob(["miss", "hit"], ["hit", "hit"], {
      reportCompletionFunc: function (stats) {
        completion = stats;
      },
      reportProgressFunc: function (percentageDone) {
        progress.push(percentageDone);
      },
    }),
    true,
  );
  equal(progress, [0, 50, 100]);
  equal(completion.patternComparisons, 2);
  equal(completion.sourceItemsVisited, 2);
  equal(typeof completion.timeTakenInMilliseconds, "number");
}

const IIFE_API_SMOKES = Object.freeze({
  "array-group-str-omit-num-char": arrayGroupSmoke,
  "array-includes-with-glob": arrayIncludesWithGlobSmoke,
  "ast-compare": astCompareSmoke,
  "ast-contains-only-empty-space": astContainsOnlyEmptySpaceSmoke,
  "ast-deep-contains": astDeepContainsSmoke,
  "ast-is-empty": astIsEmptySmoke,
  "ast-monkey": astMonkeySmoke,
  "ast-monkey-util": astMonkeyUtilSmoke,
  "check-types-mini": checkTypesMiniSmoke,
  "codsen-utils": codsenUtilsSmoke,
  detergent: detergentSmoke,
  "email-comb": emailCombSmoke,
  "generate-atomic-css": generateAtomicCssSmoke,
  "html-crush": htmlCrushSmoke,
  "html-img-alt": htmlImgAltSmoke,
  "is-language-code": languageCodeSmoke,
  "object-boolean-combinations": objectBooleanCombinationsSmoke,
  "string-convert-indexes": stringConvertIndexesSmoke,
  "string-extract-class-names": stringExtractClassNamesSmoke,
  "string-remove-widows": stringRemoveWidowsSmoke,
  "string-strip-html": stringStripHtmlSmoke,
  "test-mixer": testMixerSmoke,
});

export {
  findUnsupportedIifeApis,
  IIFE_API_SMOKES,
  IIFE_BROWSER_POLICY,
  iifeGlobalName,
};

interface UnknownValueObj {
  [key: string]: number;
}

interface DependencyStats {
  dependencies: UnknownValueObj;
  devDependencies: UnknownValueObj;
  top10ExternalDeps: UnknownValueObj[];
  top10OwnDeps: UnknownValueObj[];
  allExternalDeps: string[];
  allOwnDeps: string[];
}

export const dependencyStats: DependencyStats = {
  "allExternalDeps": [
    "@inquirer/prompts",
    "@ljharb/through",
    "@types/hast",
    "@types/lodash-es",
    "@types/semver-compare",
    "ansi-diff-stream",
    "ansi-regex",
    "currency.js",
    "fp-ts",
    "fs-extra",
    "globby",
    "grapheme-splitter",
    "he",
    "html-entities",
    "is-d",
    "is-online",
    "leven",
    "lodash-es",
    "log-update",
    "matcher",
    "object-path",
    "p-filter",
    "p-map",
    "p-one",
    "p-progress",
    "p-reduce",
    "pacote",
    "rehype",
    "rehype-parse",
    "runes",
    "semver-compare",
    "sort-keys",
    "sort-package-json",
    "type-detect",
    "unified",
    "unist-util-visit",
    "update-notifier",
    "write-file-atomic"
  ],
  "allOwnDeps": [
    "all-named-html-entities",
    "array-pull-all-with-glob",
    "arrayiffy-if-string",
    "ast-compare",
    "ast-contains-only-empty-space",
    "ast-get-values-by-key",
    "ast-is-empty",
    "ast-monkey",
    "ast-monkey-traverse",
    "ast-monkey-traverse-with-lookahead",
    "check-types-mini",
    "codsen-parser",
    "codsen-utils",
    "csv-sort",
    "csv-split-easy",
    "edit-package-json",
    "email-all-chars-within-ascii",
    "generate-atomic-css",
    "html-all-known-attributes",
    "html-crush",
    "html-entities-not-email-friendly",
    "is-char-suitable-for-html-attr-name",
    "js-row-num",
    "json-comb-core",
    "lerna-clean-changelogs",
    "object-all-values-equal-to",
    "object-boolean-combinations",
    "object-fill-missing-keys",
    "object-flatten-all-arrays",
    "object-merge-advanced",
    "object-no-new-keys",
    "object-set-all-values-to",
    "ranges-apply",
    "ranges-crop",
    "ranges-invert",
    "ranges-is-index-within",
    "ranges-merge",
    "ranges-process-outside",
    "ranges-push",
    "ranges-sort",
    "regex-empty-conditional-comments",
    "regex-is-jinja-nunjucks",
    "regex-is-jsp",
    "regex-jinja-specific",
    "str-indexes-of-plus",
    "string-apostrophes",
    "string-character-is-astral-surrogate",
    "string-collapse-leading-whitespace",
    "string-collapse-white-space",
    "string-dashes",
    "string-extract-class-names",
    "string-find-heads-tails",
    "string-fix-broken-named-entities",
    "string-left-right",
    "string-match-left-right",
    "string-process-comma-separated",
    "string-range-expander",
    "string-remove-duplicate-heads-tails",
    "string-remove-thousand-separators",
    "string-remove-widows",
    "string-strip-html",
    "string-trim-spaces-only",
    "string-uglify",
    "string-unfancy",
    "test-mixer",
    "util-array-object-or-both",
    "util-nonempty"
  ],
  "dependencies": {
    "@inquirer/prompts": 2,
    "@ljharb/through": 1,
    "@types/hast": 2,
    "@types/lodash-es": 9,
    "@types/semver-compare": 1,
    "all-named-html-entities": 2,
    "ansi-diff-stream": 1,
    "ansi-regex": 1,
    "array-pull-all-with-glob": 1,
    "arrayiffy-if-string": 7,
    "ast-compare": 3,
    "ast-contains-only-empty-space": 2,
    "ast-get-values-by-key": 1,
    "ast-is-empty": 1,
    "ast-monkey": 1,
    "ast-monkey-traverse": 7,
    "ast-monkey-traverse-with-lookahead": 1,
    "check-types-mini": 3,
    "codsen-parser": 1,
    "codsen-utils": 57,
    "csv-sort": 1,
    "csv-split-easy": 1,
    "currency.js": 1,
    "edit-package-json": 1,
    "email-all-chars-within-ascii": 1,
    "fp-ts": 1,
    "fs-extra": 3,
    "generate-atomic-css": 1,
    "globby": 8,
    "grapheme-splitter": 1,
    "he": 3,
    "html-all-known-attributes": 1,
    "html-crush": 1,
    "html-entities": 1,
    "html-entities-not-email-friendly": 1,
    "is-char-suitable-for-html-attr-name": 1,
    "is-d": 4,
    "is-online": 1,
    "js-row-num": 1,
    "json-comb-core": 1,
    "lerna-clean-changelogs": 1,
    "leven": 2,
    "lodash-es": 9,
    "log-update": 1,
    "matcher": 9,
    "object-all-values-equal-to": 1,
    "object-boolean-combinations": 1,
    "object-fill-missing-keys": 1,
    "object-flatten-all-arrays": 1,
    "object-merge-advanced": 2,
    "object-no-new-keys": 1,
    "object-path": 3,
    "object-set-all-values-to": 1,
    "p-filter": 2,
    "p-map": 3,
    "p-one": 1,
    "p-progress": 1,
    "p-reduce": 7,
    "pacote": 1,
    "ranges-apply": 16,
    "ranges-crop": 2,
    "ranges-invert": 2,
    "ranges-is-index-within": 2,
    "ranges-merge": 5,
    "ranges-process-outside": 1,
    "ranges-push": 13,
    "ranges-sort": 2,
    "regex-empty-conditional-comments": 1,
    "regex-is-jinja-nunjucks": 1,
    "regex-is-jsp": 1,
    "regex-jinja-specific": 1,
    "rehype": 1,
    "rehype-parse": 1,
    "runes": 1,
    "semver-compare": 1,
    "sort-keys": 1,
    "sort-package-json": 1,
    "str-indexes-of-plus": 1,
    "string-apostrophes": 2,
    "string-character-is-astral-surrogate": 1,
    "string-collapse-leading-whitespace": 1,
    "string-collapse-white-space": 1,
    "string-dashes": 2,
    "string-extract-class-names": 1,
    "string-find-heads-tails": 1,
    "string-fix-broken-named-entities": 1,
    "string-left-right": 16,
    "string-match-left-right": 8,
    "string-process-comma-separated": 1,
    "string-range-expander": 3,
    "string-remove-duplicate-heads-tails": 1,
    "string-remove-thousand-separators": 1,
    "string-remove-widows": 2,
    "string-strip-html": 2,
    "string-trim-spaces-only": 3,
    "string-uglify": 1,
    "string-unfancy": 2,
    "test-mixer": 1,
    "type-detect": 2,
    "unified": 2,
    "unist-util-visit": 2,
    "update-notifier": 9,
    "util-array-object-or-both": 2,
    "util-nonempty": 1,
    "write-file-atomic": 4
  },
  "devDependencies": {
    "@types/he": 2,
    "@types/runes": 1,
    "ast-monkey-traverse": 2,
    "color-shorthand-hex-to-six-digit": 1,
    "deep-equal": 2,
    "fs-extra": 1,
    "globby": 1,
    "p-map": 3,
    "ranges-apply": 5,
    "ranges-invert": 1,
    "ranges-merge": 1,
    "string-find-heads-tails": 1,
    "string-strip-html": 1,
    "test-mixer": 4,
    "title": 1
  },
  "top10ExternalDeps": [
    {
      "matcher": 9
    },
    {
      "update-notifier": 9
    },
    {
      "@types/lodash-es": 9
    },
    {
      "lodash-es": 9
    },
    {
      "globby": 8
    },
    {
      "object-path": 3
    },
    {
      "type-detect": 2
    },
    {
      "@inquirer/prompts": 2
    },
    {
      "currency.js": 1
    },
    {
      "ansi-regex": 1
    }
  ],
  "top10OwnDeps": [
    {
      "codsen-utils": 57
    },
    {
      "ranges-apply": 16
    },
    {
      "ast-monkey-traverse": 7
    },
    {
      "ast-compare": 3
    },
    {
      "check-types-mini": 3
    },
    {
      "ast-contains-only-empty-space": 2
    },
    {
      "util-array-object-or-both": 2
    },
    {
      "ranges-is-index-within": 2
    },
    {
      "csv-split-easy": 1
    },
    {
      "csv-sort": 1
    }
  ]
};

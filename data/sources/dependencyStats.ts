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
    "@types/hast",
    "@types/mdast",
    "ansi-diff-stream",
    "ansi-regex",
    "currency.js",
    "hast-util-raw",
    "he",
    "html-entities",
    "leven",
    "lodash-es",
    "object-path",
    "p-map",
    "p-one",
    "p-progress",
    "p-reduce",
    "package-json",
    "picomatch",
    "semver-compare",
    "semver-regex",
    "sort-keys",
    "sort-package-json",
    "type-detect",
    "unicode-segmenter",
    "unified",
    "unist-builder",
    "unist-util-visit",
    "update-notifier"
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
    "codsen-glob",
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
    "object-delete-key",
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
    "util-array-object-or-both",
    "util-nonempty"
  ],
  "dependencies": {
    "@inquirer/prompts": 2,
    "@types/hast": 2,
    "@types/mdast": 1,
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
    "check-types-mini": 2,
    "codsen-glob": 8,
    "codsen-parser": 1,
    "codsen-utils": 82,
    "csv-sort": 1,
    "csv-split-easy": 1,
    "currency.js": 1,
    "edit-package-json": 1,
    "email-all-chars-within-ascii": 1,
    "generate-atomic-css": 1,
    "hast-util-raw": 1,
    "he": 3,
    "html-all-known-attributes": 1,
    "html-crush": 1,
    "html-entities": 2,
    "html-entities-not-email-friendly": 1,
    "is-char-suitable-for-html-attr-name": 1,
    "js-row-num": 1,
    "json-comb-core": 1,
    "lerna-clean-changelogs": 1,
    "leven": 2,
    "lodash-es": 9,
    "object-all-values-equal-to": 1,
    "object-boolean-combinations": 1,
    "object-delete-key": 1,
    "object-fill-missing-keys": 1,
    "object-flatten-all-arrays": 1,
    "object-merge-advanced": 2,
    "object-no-new-keys": 1,
    "object-path": 3,
    "object-set-all-values-to": 1,
    "p-map": 1,
    "p-one": 1,
    "p-progress": 1,
    "p-reduce": 3,
    "package-json": 1,
    "picomatch": 1,
    "ranges-apply": 16,
    "ranges-crop": 2,
    "ranges-invert": 2,
    "ranges-is-index-within": 2,
    "ranges-merge": 5,
    "ranges-process-outside": 1,
    "ranges-push": 12,
    "ranges-sort": 2,
    "regex-empty-conditional-comments": 1,
    "regex-is-jinja-nunjucks": 1,
    "regex-is-jsp": 1,
    "regex-jinja-specific": 1,
    "semver-compare": 1,
    "semver-regex": 1,
    "sort-keys": 1,
    "sort-package-json": 1,
    "str-indexes-of-plus": 1,
    "string-apostrophes": 2,
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
    "string-trim-spaces-only": 2,
    "string-uglify": 1,
    "string-unfancy": 2,
    "type-detect": 2,
    "unicode-segmenter": 1,
    "unified": 3,
    "unist-builder": 1,
    "unist-util-visit": 3,
    "update-notifier": 9,
    "util-array-object-or-both": 2,
    "util-nonempty": 1
  },
  "devDependencies": {
    "@types/he": 2,
    "@types/lodash-es": 9,
    "@types/picomatch": 1,
    "@types/semver-compare": 1,
    "ast-monkey-traverse": 2,
    "ast-monkey-util": 1,
    "codsen-glob": 1,
    "color-shorthand-hex-to-six-digit": 1,
    "deep-equal": 2,
    "is-html-attribute-closing": 1,
    "is-html-tag-opening": 1,
    "mdast-util-to-hast": 1,
    "p-map": 5,
    "ranges-apply": 3,
    "ranges-invert": 1,
    "rehype": 1,
    "rehype-parse": 1,
    "string-find-heads-tails": 1,
    "string-find-malformed": 1,
    "string-strip-html": 1,
    "test-mixer": 5,
    "title": 1
  },
  "top10ExternalDeps": [
    {
      "lodash-es": 9
    },
    {
      "update-notifier": 9
    },
    {
      "he": 3
    },
    {
      "object-path": 3
    },
    {
      "p-reduce": 3
    },
    {
      "unified": 3
    },
    {
      "unist-util-visit": 3
    },
    {
      "@inquirer/prompts": 2
    },
    {
      "@types/hast": 2
    },
    {
      "html-entities": 2
    }
  ],
  "top10OwnDeps": [
    {
      "codsen-utils": 82
    },
    {
      "ranges-apply": 16
    },
    {
      "string-left-right": 16
    },
    {
      "ranges-push": 12
    },
    {
      "codsen-glob": 8
    },
    {
      "string-match-left-right": 8
    },
    {
      "arrayiffy-if-string": 7
    },
    {
      "ast-monkey-traverse": 7
    },
    {
      "ranges-merge": 5
    },
    {
      "ast-compare": 3
    }
  ]
};

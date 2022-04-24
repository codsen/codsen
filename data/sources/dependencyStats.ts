interface UnknownValueObj {
  [key: string]: number;
}

interface DependencyStats {
  dependencies: UnknownValueObj;
  devDependencies: UnknownValueObj;
  top10ExternalDeps: UnknownValueObj[];
  top10OwnDeps: UnknownValueObj[];
}

export const dependencyStats: DependencyStats = {
    "dependencies": {
        "@babel/runtime": 1,
        "@sindresorhus/is": 1,
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
        "ast-monkey-traverse": 10,
        "ast-monkey-traverse-with-lookahead": 1,
        "ast-monkey-util": 3,
        "chalk": 5,
        "check-types-mini": 4,
        "codsen-parser": 2,
        "codsen-tokenizer": 2,
        "csv-sort": 1,
        "csv-split-easy": 1,
        "currency.js": 1,
        "define-lazy-prop": 1,
        "detect-templating-language": 1,
        "edit-package-json": 1,
        "email-all-chars-within-ascii": 1,
        "email-comb": 1,
        "execa": 1,
        "fs-extra": 7,
        "generate-atomic-css": 1,
        "globby": 10,
        "grapheme-splitter": 1,
        "he": 4,
        "hex-color-regex": 1,
        "html-all-known-attributes": 3,
        "html-crush": 1,
        "html-entities": 1,
        "html-entities-not-email-friendly": 2,
        "inquirer": 2,
        "is-char-suitable-for-html-attr-name": 2,
        "is-d": 5,
        "is-html-attribute-closing": 1,
        "is-html-tag-opening": 1,
        "is-language-code": 1,
        "is-media-descriptor": 1,
        "is-online": 1,
        "is-relative-uri": 1,
        "is-url-superb": 1,
        "isstream": 1,
        "js-row-num": 1,
        "json-comb-core": 1,
        "lerna-clean-changelogs": 1,
        "leven": 3,
        "line-column-mini": 1,
        "lodash.clonedeep": 19,
        "lodash.deburr": 1,
        "lodash.includes": 3,
        "lodash.intersection": 3,
        "lodash.isdate": 1,
        "lodash.isequal": 1,
        "lodash.isfinite": 1,
        "lodash.isplainobject": 24,
        "lodash.isregexp": 2,
        "lodash.merge": 1,
        "lodash.pull": 2,
        "lodash.pullall": 4,
        "lodash.trim": 2,
        "lodash.uniq": 5,
        "lodash.without": 1,
        "log-symbols": 1,
        "log-update": 1,
        "matcher": 9,
        "meow": 11,
        "mime-db": 1,
        "minimist": 1,
        "object-all-values-equal-to": 1,
        "object-boolean-combinations": 1,
        "object-fill-missing-keys": 1,
        "object-flatten-all-arrays": 1,
        "object-merge-advanced": 3,
        "object-no-new-keys": 1,
        "object-path": 6,
        "object-set-all-values-to": 1,
        "p-filter": 2,
        "p-map": 3,
        "p-one": 1,
        "p-progress": 1,
        "p-reduce": 8,
        "package-json-editor": 1,
        "pacote": 1,
        "plugin-error": 1,
        "ranges-apply": 16,
        "ranges-crop": 2,
        "ranges-invert": 2,
        "ranges-is-index-within": 2,
        "ranges-merge": 7,
        "ranges-process-outside": 1,
        "ranges-push": 13,
        "ranges-sort": 1,
        "regex-empty-conditional-comments": 1,
        "regex-is-jinja-nunjucks": 1,
        "regex-is-jsp": 1,
        "regex-jinja-specific": 1,
        "rgba-regex": 1,
        "runes": 1,
        "semver-compare": 1,
        "sort-keys": 1,
        "sort-package-json": 1,
        "sorted-object": 1,
        "split2": 1,
        "str-indexes-of-plus": 1,
        "string-apostrophes": 1,
        "string-character-is-astral-surrogate": 1,
        "string-collapse-leading-whitespace": 1,
        "string-collapse-white-space": 2,
        "string-extract-class-names": 1,
        "string-find-heads-tails": 1,
        "string-find-malformed": 2,
        "string-fix-broken-named-entities": 2,
        "string-left-right": 17,
        "string-match-left-right": 10,
        "string-process-comma-separated": 2,
        "string-range-expander": 3,
        "string-remove-duplicate-heads-tails": 1,
        "string-remove-thousand-separators": 1,
        "string-remove-widows": 1,
        "string-splice": 1,
        "string-strip-html": 1,
        "string-trim-spaces-only": 3,
        "string-uglify": 1,
        "string-unfancy": 1,
        "test-mixer": 1,
        "through2": 1,
        "tiny-invariant": 1,
        "tiny-typed-emitter": 1,
        "type-detect": 3,
        "update-notifier": 12,
        "url-regex": 1,
        "util-array-object-or-both": 2,
        "util-nonempty": 1,
        "write-file-atomic": 4
    },
    "devDependencies": {
        "@types/he": 3,
        "@types/hex-color-regex": 1,
        "@types/isstream": 1,
        "@types/lodash.clonedeep": 19,
        "@types/lodash.deburr": 1,
        "@types/lodash.includes": 3,
        "@types/lodash.intersection": 3,
        "@types/lodash.isdate": 1,
        "@types/lodash.isequal": 1,
        "@types/lodash.isfinite": 1,
        "@types/lodash.isplainobject": 25,
        "@types/lodash.isregexp": 2,
        "@types/lodash.merge": 1,
        "@types/lodash.pull": 2,
        "@types/lodash.pullall": 4,
        "@types/lodash.trim": 2,
        "@types/lodash.uniq": 6,
        "@types/lodash.without": 1,
        "@types/mime-db": 1,
        "@types/object-path": 1,
        "@types/runes": 1,
        "@types/semver-compare": 1,
        "@types/split2": 1,
        "@types/through2": 1,
        "@types/type-detect": 1,
        "array-shuffle": 1,
        "ast-compare": 1,
        "ast-deep-contains": 1,
        "ast-monkey-traverse": 2,
        "color-shorthand-hex-to-six-digit": 1,
        "deep-equal": 1,
        "fs-extra": 3,
        "globby": 1,
        "lodash.clonedeep": 6,
        "lodash.isequal": 3,
        "map-stream": 1,
        "p-map": 3,
        "ranges-apply": 6,
        "ranges-invert": 1,
        "ranges-merge": 1,
        "string-find-heads-tails": 1,
        "string-strip-html": 1,
        "test-mixer": 4,
        "title": 1,
        "type-fest": 2,
        "vinyl-string": 1
    },
    "top10ExternalDeps": [
        {
            "lodash.isplainobject": 24
        },
        {
            "lodash.clonedeep": 19
        },
        {
            "update-notifier": 12
        },
        {
            "meow": 11
        },
        {
            "globby": 10
        },
        {
            "matcher": 9
        },
        {
            "p-reduce": 8
        },
        {
            "fs-extra": 7
        },
        {
            "object-path": 6
        },
        {
            "lodash.uniq": 5
        }
    ],
    "top10OwnDeps": [
        {
            "string-left-right": 17
        },
        {
            "ranges-apply": 16
        },
        {
            "ranges-push": 13
        },
        {
            "ast-monkey-traverse": 10
        },
        {
            "string-match-left-right": 10
        },
        {
            "arrayiffy-if-string": 7
        },
        {
            "ranges-merge": 7
        },
        {
            "check-types-mini": 4
        },
        {
            "object-merge-advanced": 3
        },
        {
            "ast-compare": 3
        }
    ]
};

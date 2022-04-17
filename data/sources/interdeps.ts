export const interdeps = [
    {
        "name": "all-named-html-entities",
        "size": 192676,
        "imports": []
    },
    {
        "name": "array-group-str-omit-num-char",
        "size": 1456,
        "imports": [
            "ranges-apply"
        ]
    },
    {
        "name": "array-of-arrays-into-ast",
        "size": 846,
        "imports": [
            "check-types-mini",
            "object-merge-advanced"
        ]
    },
    {
        "name": "array-pull-all-with-glob",
        "size": 577,
        "imports": []
    },
    {
        "name": "arrayiffy-if-string",
        "size": 354,
        "imports": []
    },
    {
        "name": "ast-compare",
        "size": 3437,
        "imports": [
            "ast-contains-only-empty-space"
        ]
    },
    {
        "name": "ast-contains-only-empty-space",
        "size": 556,
        "imports": [
            "ast-monkey-traverse"
        ]
    },
    {
        "name": "ast-deep-contains",
        "size": 2087,
        "imports": [
            "ast-monkey-traverse"
        ]
    },
    {
        "name": "ast-delete-object",
        "size": 1229,
        "imports": [
            "ast-compare",
            "ast-monkey-traverse"
        ]
    },
    {
        "name": "ast-get-object",
        "size": 1027,
        "imports": [
            "ast-compare"
        ]
    },
    {
        "name": "ast-get-values-by-key",
        "size": 682,
        "imports": [
            "ast-monkey-traverse"
        ]
    },
    {
        "name": "ast-is-empty",
        "size": 705,
        "imports": []
    },
    {
        "name": "ast-loose-compare",
        "size": 1278,
        "imports": [
            "ast-contains-only-empty-space"
        ]
    },
    {
        "name": "ast-monkey",
        "size": 5089,
        "imports": [
            "ast-compare",
            "ast-monkey-traverse",
            "check-types-mini",
            "util-array-object-or-both"
        ]
    },
    {
        "name": "ast-monkey-traverse",
        "size": 1057,
        "imports": [
            "ast-monkey-util"
        ]
    },
    {
        "name": "ast-monkey-traverse-with-lookahead",
        "size": 1180,
        "imports": []
    },
    {
        "name": "ast-monkey-util",
        "size": 1087,
        "imports": []
    },
    {
        "name": "charcode-is-valid-xml-name-character",
        "size": 1086,
        "imports": [
            "ranges-is-index-within"
        ]
    },
    {
        "name": "check-types-mini",
        "size": 5554,
        "imports": [
            "arrayiffy-if-string",
            "ast-monkey-traverse"
        ]
    },
    {
        "name": "codsen-parser",
        "size": 7105,
        "imports": [
            "ast-monkey-util",
            "codsen-tokenizer",
            "string-find-malformed",
            "string-left-right"
        ]
    },
    {
        "name": "codsen-tokenizer",
        "size": 40202,
        "imports": [
            "html-all-known-attributes",
            "is-char-suitable-for-html-attr-name",
            "is-html-attribute-closing",
            "is-html-tag-opening",
            "string-left-right",
            "string-match-left-right"
        ]
    },
    {
        "name": "csv-sort",
        "size": 4889,
        "imports": [
            "csv-split-easy"
        ]
    },
    {
        "name": "csv-sort-cli",
        "size": 8955,
        "imports": [
            "csv-sort"
        ]
    },
    {
        "name": "csv-split-easy",
        "size": 2265,
        "imports": [
            "string-remove-thousand-separators"
        ]
    },
    {
        "name": "detect-templating-language",
        "size": 765,
        "imports": [
            "regex-is-jinja-nunjucks",
            "regex-is-jsp",
            "regex-jinja-specific"
        ]
    },
    {
        "name": "detergent",
        "size": 25153,
        "imports": [
            "all-named-html-entities",
            "html-entities-not-email-friendly",
            "ranges-apply",
            "ranges-invert",
            "ranges-process-outside",
            "ranges-push",
            "string-apostrophes",
            "string-collapse-white-space",
            "string-fix-broken-named-entities",
            "string-left-right",
            "string-range-expander",
            "string-remove-widows",
            "string-strip-html",
            "string-trim-spaces-only"
        ]
    },
    {
        "name": "edit-package-json",
        "size": 10243,
        "imports": [
            "ranges-apply",
            "string-left-right"
        ]
    },
    {
        "name": "email-all-chars-within-ascii",
        "size": 1269,
        "imports": [
            "check-types-mini"
        ]
    },
    {
        "name": "email-all-chars-within-ascii-cli",
        "size": 8576,
        "imports": [
            "email-all-chars-within-ascii",
            "string-left-right"
        ]
    },
    {
        "name": "email-comb",
        "size": 20411,
        "imports": [
            "array-pull-all-with-glob",
            "html-crush",
            "ranges-apply",
            "ranges-push",
            "regex-empty-conditional-comments",
            "string-extract-class-names",
            "string-left-right",
            "string-match-left-right",
            "string-range-expander",
            "string-uglify"
        ]
    },
    {
        "name": "emlint",
        "size": 175325,
        "imports": [
            "ast-monkey-traverse",
            "ast-monkey-util",
            "codsen-parser",
            "html-all-known-attributes",
            "html-entities-not-email-friendly",
            "is-language-code",
            "is-media-descriptor",
            "is-relative-uri",
            "line-column-mini",
            "ranges-merge",
            "string-find-malformed",
            "string-fix-broken-named-entities",
            "string-left-right",
            "string-match-left-right",
            "string-process-comma-separated"
        ]
    },
    {
        "name": "generate-atomic-css",
        "size": 8118,
        "imports": [
            "string-left-right"
        ]
    },
    {
        "name": "generate-atomic-css-cli",
        "size": 4594,
        "imports": [
            "generate-atomic-css"
        ]
    },
    {
        "name": "gulp-email-remove-unused-css",
        "size": 861,
        "imports": [
            "email-comb"
        ]
    },
    {
        "name": "html-all-known-attributes",
        "size": 13004,
        "imports": []
    },
    {
        "name": "html-crush",
        "size": 11028,
        "imports": [
            "ranges-apply",
            "ranges-push",
            "string-left-right",
            "string-match-left-right",
            "string-range-expander",
            "test-mixer"
        ]
    },
    {
        "name": "html-entities-not-email-friendly",
        "size": 65839,
        "imports": []
    },
    {
        "name": "html-img-alt",
        "size": 3105,
        "imports": [
            "check-types-mini",
            "ranges-apply",
            "ranges-push",
            "string-unfancy"
        ]
    },
    {
        "name": "html-table-patcher",
        "size": 2841,
        "imports": [
            "ast-monkey-traverse-with-lookahead",
            "codsen-parser",
            "ranges-apply",
            "ranges-push"
        ]
    },
    {
        "name": "is-char-suitable-for-html-attr-name",
        "size": 517,
        "imports": []
    },
    {
        "name": "is-html-attribute-closing",
        "size": 5151,
        "imports": [
            "html-all-known-attributes",
            "is-char-suitable-for-html-attr-name",
            "string-left-right",
            "string-match-left-right"
        ]
    },
    {
        "name": "is-html-tag-opening",
        "size": 3968,
        "imports": [
            "string-left-right",
            "string-match-left-right"
        ]
    },
    {
        "name": "is-language-code",
        "size": 57139,
        "imports": []
    },
    {
        "name": "is-media-descriptor",
        "size": 6041,
        "imports": [
            "string-process-comma-separated"
        ]
    },
    {
        "name": "is-relative-uri",
        "size": 5862,
        "imports": []
    },
    {
        "name": "js-row-num",
        "size": 2634,
        "imports": [
            "ranges-apply",
            "ranges-push"
        ]
    },
    {
        "name": "js-row-num-cli",
        "size": 5355,
        "imports": [
            "arrayiffy-if-string",
            "js-row-num"
        ]
    },
    {
        "name": "json-comb",
        "size": 6745,
        "imports": [
            "json-comb-core"
        ]
    },
    {
        "name": "json-comb-core",
        "size": 7281,
        "imports": [
            "object-fill-missing-keys",
            "object-flatten-all-arrays",
            "object-merge-advanced",
            "object-no-new-keys",
            "object-set-all-values-to"
        ]
    },
    {
        "name": "json-sort-cli",
        "size": 13083,
        "imports": [
            "ast-monkey-traverse"
        ]
    },
    {
        "name": "json-variables",
        "size": 10044,
        "imports": [
            "arrayiffy-if-string",
            "ast-get-values-by-key",
            "ast-monkey-traverse",
            "ranges-apply",
            "ranges-push",
            "string-find-heads-tails",
            "string-match-left-right",
            "string-remove-duplicate-heads-tails"
        ]
    },
    {
        "name": "lerna-clean-changelogs",
        "size": 1605,
        "imports": []
    },
    {
        "name": "lerna-clean-changelogs-cli",
        "size": 7333,
        "imports": [
            "lerna-clean-changelogs"
        ]
    },
    {
        "name": "line-column-mini",
        "size": 875,
        "imports": []
    },
    {
        "name": "object-all-values-equal-to",
        "size": 1309,
        "imports": []
    },
    {
        "name": "object-boolean-combinations",
        "size": 1160,
        "imports": []
    },
    {
        "name": "object-delete-key",
        "size": 1400,
        "imports": [
            "ast-is-empty",
            "ast-monkey",
            "util-array-object-or-both"
        ]
    },
    {
        "name": "object-fill-missing-keys",
        "size": 2769,
        "imports": [
            "arrayiffy-if-string",
            "object-all-values-equal-to",
            "object-merge-advanced"
        ]
    },
    {
        "name": "object-flatten-all-arrays",
        "size": 973,
        "imports": []
    },
    {
        "name": "object-flatten-referencing",
        "size": 4824,
        "imports": [
            "str-indexes-of-plus"
        ]
    },
    {
        "name": "object-merge-advanced",
        "size": 7184,
        "imports": [
            "util-nonempty"
        ]
    },
    {
        "name": "object-no-new-keys",
        "size": 1541,
        "imports": []
    },
    {
        "name": "object-set-all-values-to",
        "size": 671,
        "imports": []
    },
    {
        "name": "ranges-apply",
        "size": 2451,
        "imports": [
            "ranges-merge"
        ]
    },
    {
        "name": "ranges-crop",
        "size": 1898,
        "imports": [
            "ranges-merge"
        ]
    },
    {
        "name": "ranges-ent-decode",
        "size": 2086,
        "imports": [
            "ranges-merge"
        ]
    },
    {
        "name": "ranges-invert",
        "size": 2497,
        "imports": [
            "ranges-crop",
            "ranges-merge"
        ]
    },
    {
        "name": "ranges-is-index-within",
        "size": 811,
        "imports": []
    },
    {
        "name": "ranges-merge",
        "size": 2312,
        "imports": [
            "ranges-push",
            "ranges-sort"
        ]
    },
    {
        "name": "ranges-process-outside",
        "size": 1426,
        "imports": [
            "ranges-crop",
            "ranges-invert"
        ]
    },
    {
        "name": "ranges-push",
        "size": 6912,
        "imports": [
            "string-collapse-leading-whitespace",
            "string-trim-spaces-only"
        ]
    },
    {
        "name": "ranges-regex",
        "size": 1333,
        "imports": [
            "ranges-merge"
        ]
    },
    {
        "name": "ranges-sort",
        "size": 1337,
        "imports": []
    },
    {
        "name": "regex-empty-conditional-comments",
        "size": 406,
        "imports": []
    },
    {
        "name": "regex-is-jinja-nunjucks",
        "size": 348,
        "imports": []
    },
    {
        "name": "regex-is-jsp",
        "size": 346,
        "imports": []
    },
    {
        "name": "regex-jinja-specific",
        "size": 428,
        "imports": []
    },
    {
        "name": "str-indexes-of-plus",
        "size": 1086,
        "imports": []
    },
    {
        "name": "string-apostrophes",
        "size": 6110,
        "imports": [
            "ranges-apply"
        ]
    },
    {
        "name": "string-character-is-astral-surrogate",
        "size": 850,
        "imports": []
    },
    {
        "name": "string-collapse-leading-whitespace",
        "size": 1154,
        "imports": []
    },
    {
        "name": "string-collapse-white-space",
        "size": 3559,
        "imports": [
            "ranges-apply",
            "ranges-push",
            "string-left-right"
        ]
    },
    {
        "name": "string-convert-indexes",
        "size": 2485,
        "imports": [
            "ast-monkey-traverse"
        ]
    },
    {
        "name": "string-extract-class-names",
        "size": 1399,
        "imports": [
            "string-left-right"
        ]
    },
    {
        "name": "string-find-heads-tails",
        "size": 7376,
        "imports": [
            "arrayiffy-if-string",
            "string-match-left-right"
        ]
    },
    {
        "name": "string-find-malformed",
        "size": 2748,
        "imports": [
            "string-left-right"
        ]
    },
    {
        "name": "string-fix-broken-named-entities",
        "size": 11396,
        "imports": [
            "all-named-html-entities",
            "string-left-right"
        ]
    },
    {
        "name": "string-left-right",
        "size": 5948,
        "imports": []
    },
    {
        "name": "string-match-left-right",
        "size": 5808,
        "imports": [
            "arrayiffy-if-string",
            "string-character-is-astral-surrogate"
        ]
    },
    {
        "name": "string-process-comma-separated",
        "size": 2540,
        "imports": []
    },
    {
        "name": "string-range-expander",
        "size": 5164,
        "imports": []
    },
    {
        "name": "string-remove-duplicate-heads-tails",
        "size": 3039,
        "imports": [
            "arrayiffy-if-string",
            "ranges-apply",
            "ranges-push",
            "string-match-left-right",
            "string-trim-spaces-only"
        ]
    },
    {
        "name": "string-remove-thousand-separators",
        "size": 1894,
        "imports": [
            "ranges-apply",
            "ranges-push"
        ]
    },
    {
        "name": "string-remove-widows",
        "size": 7338,
        "imports": [
            "ranges-apply",
            "ranges-push",
            "string-left-right",
            "string-match-left-right"
        ]
    },
    {
        "name": "string-split-by-whitespace",
        "size": 1158,
        "imports": [
            "ranges-is-index-within"
        ]
    },
    {
        "name": "string-strip-html",
        "size": 16707,
        "imports": [
            "ranges-apply",
            "ranges-push",
            "string-left-right"
        ]
    },
    {
        "name": "string-trim-spaces-only",
        "size": 1119,
        "imports": []
    },
    {
        "name": "string-uglify",
        "size": 2488,
        "imports": []
    },
    {
        "name": "string-unfancy",
        "size": 1034,
        "imports": []
    },
    {
        "name": "stristri",
        "size": 2673,
        "imports": [
            "codsen-tokenizer",
            "detect-templating-language",
            "ranges-apply",
            "ranges-merge",
            "string-collapse-white-space"
        ]
    },
    {
        "name": "test-mixer",
        "size": 1126,
        "imports": [
            "object-boolean-combinations"
        ]
    },
    {
        "name": "update-versions",
        "size": 15114,
        "imports": [
            "edit-package-json"
        ]
    },
    {
        "name": "util-array-object-or-both",
        "size": 997,
        "imports": []
    },
    {
        "name": "util-nonempty",
        "size": 455,
        "imports": []
    }
];

const all = [
  "all-named-html-entities",
  "array-group-str-omit-num-char",
  "array-includes-with-glob",
  "array-of-arrays-into-ast",
  "array-of-arrays-sort-by-col",
  "array-pull-all-with-glob",
  "arrayiffy-if-string",
  "ast-compare",
  "ast-contains-only-empty-space",
  "ast-deep-contains",
  "ast-delete-object",
  "ast-get-object",
  "ast-get-values-by-key",
  "ast-is-empty",
  "ast-loose-compare",
  "ast-monkey",
  "ast-monkey-traverse",
  "ast-monkey-traverse-with-lookahead",
  "ast-monkey-util",
  "bitbucket-slug",
  "bitsausage",
  "charcode-is-valid-xml-name-character",
  "check-types-mini",
  "chlu",
  "chlu-cli",
  "codsen",
  "codsen-parser",
  "codsen-tokenizer",
  "codsen-utils",
  "color-shorthand-hex-to-six-digit",
  "csv-sort",
  "csv-split-easy",
  "detect-is-it-html-or-xhtml",
  "detect-templating-language",
  "detergent",
  "easy-replace",
  "edit-package-json",
  "email-all-chars-within-ascii",
  "email-comb",
  "email-homey",
  "email-remove-unused-css",
  "emlint",
  "eslint-on-airbnb-base-badge",
  "eslint-plugin-row-num-tbc",
  "eslint-plugin-test-num-tbc",
  "extract-search-index",
  "fol",
  "generate-atomic-css",
  "generate-atomic-css-cli",
  "gulp-email-remove-unused-css",
  "helga",
  "html-all-known-attributes",
  "html-crush",
  "html-entities-not-email-friendly",
  "html-img-alt",
  "html-table-patcher",
  "is-char-suitable-for-html-attr-name",
  "is-html-attribute-closing",
  "is-html-tag-opening",
  "is-language-code",
  "is-media-descriptor",
  "is-relative-uri",
  "js-row-num",
  "js-row-num-cli",
  "json-comb",
  "json-comb-core",
  "json-sort-cli",
  "json-variables",
  "lect",
  "lerna-clean-changelogs",
  "lerna-clean-changelogs-cli",
  "lerna-link-dep",
  "line-column-mini",
  "object-all-values-equal-to",
  "object-boolean-combinations",
  "object-delete-key",
  "object-fill-missing-keys",
  "object-flatten-all-arrays",
  "object-flatten-referencing",
  "object-merge-advanced",
  "object-no-new-keys",
  "object-set-all-values-to",
  "perf-ref",
  "posthtml-ast-compare",
  "posthtml-ast-contains-only-empty-space",
  "posthtml-ast-delete-key",
  "posthtml-ast-delete-object",
  "posthtml-ast-get-object",
  "posthtml-ast-get-values-by-key",
  "posthtml-ast-is-empty",
  "posthtml-ast-loose-compare",
  "posthtml-color-shorthand-hex-to-six-digit",
  "posthtml-email-remove-unused-css",
  "ranges-apply",
  "ranges-crop",
  "ranges-ent-decode",
  "ranges-invert",
  "ranges-is-index-within",
  "ranges-iterate",
  "ranges-merge",
  "ranges-offset",
  "ranges-process-outside",
  "ranges-push",
  "ranges-regex",
  "ranges-sort",
  "regex-empty-conditional-comments",
  "regex-is-jinja-nunjucks",
  "regex-is-jsp",
  "regex-jinja-specific",
  "rehype-responsive-tables",
  "remark-conventional-commit-changelog-timeline",
  "remark-conventional-commit-changelog-timeline",
  "remark-typography",
  "seo-editor",
  "str-indexes-of-plus",
  "string-apostrophes",
  "string-bionic-split",
  "string-character-is-astral-surrogate",
  "string-collapse-leading-whitespace",
  "string-collapse-white-space",
  "string-convert-indexes",
  "string-dashes",
  "string-extract-class-names",
  "string-extract-sass-vars",
  "string-find-heads-tails",
  "string-find-malformed",
  "string-fix-broken-named-entities",
  "string-left-right",
  "string-match-left-right",
  "string-overlap-one-on-another",
  "string-process-comma-separated",
  "string-range-expander",
  "string-remove-duplicate-heads-tails",
  "string-remove-thousand-separators",
  "string-remove-widows",
  "string-replace-slices-array",
  "string-slices-array-push",
  "string-split-by-whitespace",
  "string-strip-html",
  "string-trim-spaces-only",
  "string-truncator",
  "string-uglify",
  "string-unfancy",
  "stristri",
  "tap-parse-string-to-object",
  "test-mixer",
  "tsd-extract",
  "tsd-extract-noesm",
  "util-array-object-or-both",
  "util-nonempty"
] as const;
const current = [
  "all-named-html-entities",
  "array-group-str-omit-num-char",
  "array-includes-with-glob",
  "array-of-arrays-into-ast",
  "array-of-arrays-sort-by-col",
  "array-pull-all-with-glob",
  "arrayiffy-if-string",
  "ast-compare",
  "ast-contains-only-empty-space",
  "ast-deep-contains",
  "ast-delete-object",
  "ast-get-object",
  "ast-get-values-by-key",
  "ast-is-empty",
  "ast-loose-compare",
  "ast-monkey",
  "ast-monkey-traverse",
  "ast-monkey-traverse-with-lookahead",
  "ast-monkey-util",
  "bitbucket-slug",
  "charcode-is-valid-xml-name-character",
  "check-types-mini",
  "codsen",
  "codsen-parser",
  "codsen-tokenizer",
  "codsen-utils",
  "color-shorthand-hex-to-six-digit",
  "csv-sort",
  "csv-split-easy",
  "detect-is-it-html-or-xhtml",
  "detect-templating-language",
  "detergent",
  "easy-replace",
  "edit-package-json",
  "email-all-chars-within-ascii",
  "email-comb",
  "email-homey",
  "emlint",
  "eslint-plugin-row-num-tbc",
  "eslint-plugin-test-num-tbc",
  "extract-search-index",
  "generate-atomic-css",
  "generate-atomic-css-cli",
  "gulp-email-remove-unused-css",
  "helga",
  "html-all-known-attributes",
  "html-crush",
  "html-entities-not-email-friendly",
  "html-img-alt",
  "html-table-patcher",
  "is-char-suitable-for-html-attr-name",
  "is-html-attribute-closing",
  "is-html-tag-opening",
  "is-language-code",
  "is-media-descriptor",
  "is-relative-uri",
  "js-row-num",
  "js-row-num-cli",
  "json-comb",
  "json-comb-core",
  "json-sort-cli",
  "json-variables",
  "lect",
  "lerna-clean-changelogs",
  "lerna-clean-changelogs-cli",
  "lerna-link-dep",
  "line-column-mini",
  "object-all-values-equal-to",
  "object-boolean-combinations",
  "object-delete-key",
  "object-fill-missing-keys",
  "object-flatten-all-arrays",
  "object-flatten-referencing",
  "object-merge-advanced",
  "object-no-new-keys",
  "object-set-all-values-to",
  "perf-ref",
  "ranges-apply",
  "ranges-crop",
  "ranges-ent-decode",
  "ranges-invert",
  "ranges-is-index-within",
  "ranges-iterate",
  "ranges-merge",
  "ranges-offset",
  "ranges-process-outside",
  "ranges-push",
  "ranges-regex",
  "ranges-sort",
  "regex-empty-conditional-comments",
  "regex-is-jinja-nunjucks",
  "regex-is-jsp",
  "regex-jinja-specific",
  "rehype-responsive-tables",
  "remark-conventional-commit-changelog-timeline",
  "remark-conventional-commit-changelog-timeline",
  "remark-typography",
  "seo-editor",
  "str-indexes-of-plus",
  "string-apostrophes",
  "string-bionic-split",
  "string-character-is-astral-surrogate",
  "string-collapse-leading-whitespace",
  "string-collapse-white-space",
  "string-convert-indexes",
  "string-dashes",
  "string-extract-class-names",
  "string-extract-sass-vars",
  "string-find-heads-tails",
  "string-find-malformed",
  "string-fix-broken-named-entities",
  "string-left-right",
  "string-match-left-right",
  "string-overlap-one-on-another",
  "string-process-comma-separated",
  "string-range-expander",
  "string-remove-duplicate-heads-tails",
  "string-remove-thousand-separators",
  "string-remove-widows",
  "string-split-by-whitespace",
  "string-strip-html",
  "string-trim-spaces-only",
  "string-truncator",
  "string-uglify",
  "string-unfancy",
  "stristri",
  "tap-parse-string-to-object",
  "test-mixer",
  "tsd-extract",
  "tsd-extract-noesm",
  "util-array-object-or-both",
  "util-nonempty"
] as const;
const cli = [
  "codsen",
  "email-homey",
  "generate-atomic-css-cli",
  "js-row-num-cli",
  "json-comb",
  "json-sort-cli",
  "lerna-clean-changelogs-cli",
  "lerna-link-dep"
] as const;
const deprecated = [
  "bitsausage",
  "chlu",
  "chlu-cli",
  "email-remove-unused-css",
  "eslint-on-airbnb-base-badge",
  "fol",
  "posthtml-ast-compare",
  "posthtml-ast-contains-only-empty-space",
  "posthtml-ast-delete-key",
  "posthtml-ast-delete-object",
  "posthtml-ast-get-object",
  "posthtml-ast-get-values-by-key",
  "posthtml-ast-is-empty",
  "posthtml-ast-loose-compare",
  "posthtml-color-shorthand-hex-to-six-digit",
  "posthtml-email-remove-unused-css",
  "string-replace-slices-array",
  "string-slices-array-push"
] as const;
const programs = [
  "all-named-html-entities",
  "array-group-str-omit-num-char",
  "array-includes-with-glob",
  "array-of-arrays-into-ast",
  "array-of-arrays-sort-by-col",
  "array-pull-all-with-glob",
  "arrayiffy-if-string",
  "ast-compare",
  "ast-contains-only-empty-space",
  "ast-deep-contains",
  "ast-delete-object",
  "ast-get-object",
  "ast-get-values-by-key",
  "ast-is-empty",
  "ast-loose-compare",
  "ast-monkey",
  "ast-monkey-traverse",
  "ast-monkey-traverse-with-lookahead",
  "ast-monkey-util",
  "bitbucket-slug",
  "charcode-is-valid-xml-name-character",
  "check-types-mini",
  "codsen-parser",
  "codsen-tokenizer",
  "codsen-utils",
  "color-shorthand-hex-to-six-digit",
  "csv-sort",
  "csv-split-easy",
  "detect-is-it-html-or-xhtml",
  "detect-templating-language",
  "detergent",
  "easy-replace",
  "edit-package-json",
  "email-all-chars-within-ascii",
  "email-comb",
  "eslint-plugin-row-num-tbc",
  "eslint-plugin-test-num-tbc",
  "extract-search-index",
  "generate-atomic-css",
  "helga",
  "html-all-known-attributes",
  "html-crush",
  "html-entities-not-email-friendly",
  "html-img-alt",
  "html-table-patcher",
  "is-char-suitable-for-html-attr-name",
  "is-html-attribute-closing",
  "is-html-tag-opening",
  "is-language-code",
  "is-media-descriptor",
  "is-relative-uri",
  "js-row-num",
  "json-comb-core",
  "json-variables",
  "lerna-clean-changelogs",
  "line-column-mini",
  "object-all-values-equal-to",
  "object-boolean-combinations",
  "object-delete-key",
  "object-fill-missing-keys",
  "object-flatten-all-arrays",
  "object-flatten-referencing",
  "object-merge-advanced",
  "object-no-new-keys",
  "object-set-all-values-to",
  "ranges-apply",
  "ranges-crop",
  "ranges-ent-decode",
  "ranges-invert",
  "ranges-is-index-within",
  "ranges-iterate",
  "ranges-merge",
  "ranges-offset",
  "ranges-process-outside",
  "ranges-push",
  "ranges-regex",
  "ranges-sort",
  "regex-empty-conditional-comments",
  "regex-is-jinja-nunjucks",
  "regex-is-jsp",
  "regex-jinja-specific",
  "rehype-responsive-tables",
  "remark-conventional-commit-changelog-timeline",
  "remark-typography",
  "seo-editor",
  "str-indexes-of-plus",
  "string-apostrophes",
  "string-bionic-split",
  "string-character-is-astral-surrogate",
  "string-collapse-leading-whitespace",
  "string-collapse-white-space",
  "string-convert-indexes",
  "string-dashes",
  "string-extract-class-names",
  "string-extract-sass-vars",
  "string-find-heads-tails",
  "string-find-malformed",
  "string-fix-broken-named-entities",
  "string-left-right",
  "string-match-left-right",
  "string-overlap-one-on-another",
  "string-process-comma-separated",
  "string-range-expander",
  "string-remove-duplicate-heads-tails",
  "string-remove-thousand-separators",
  "string-remove-widows",
  "string-split-by-whitespace",
  "string-strip-html",
  "string-trim-spaces-only",
  "string-truncator",
  "string-uglify",
  "string-unfancy",
  "stristri",
  "tap-parse-string-to-object",
  "test-mixer",
  "tsd-extract",
  "util-array-object-or-both",
  "util-nonempty"
] as const;
const special = [
  "gulp-email-remove-unused-css"
] as const;
const script = [
  "all-named-html-entities",
  "array-group-str-omit-num-char",
  "array-includes-with-glob",
  "array-of-arrays-into-ast",
  "array-of-arrays-sort-by-col",
  "array-pull-all-with-glob",
  "arrayiffy-if-string",
  "ast-compare",
  "ast-contains-only-empty-space",
  "ast-deep-contains",
  "ast-delete-object",
  "ast-get-object",
  "ast-get-values-by-key",
  "ast-is-empty",
  "ast-loose-compare",
  "ast-monkey",
  "ast-monkey-traverse",
  "ast-monkey-traverse-with-lookahead",
  "ast-monkey-util",
  "bitbucket-slug",
  "charcode-is-valid-xml-name-character",
  "check-types-mini",
  "codsen-parser",
  "codsen-tokenizer",
  "codsen-utils",
  "color-shorthand-hex-to-six-digit",
  "csv-sort",
  "csv-split-easy",
  "detect-is-it-html-or-xhtml",
  "detect-templating-language",
  "detergent",
  "easy-replace",
  "edit-package-json",
  "email-all-chars-within-ascii",
  "email-comb",
  "extract-search-index",
  "generate-atomic-css",
  "helga",
  "html-all-known-attributes",
  "html-crush",
  "html-entities-not-email-friendly",
  "html-img-alt",
  "html-table-patcher",
  "is-char-suitable-for-html-attr-name",
  "is-html-attribute-closing",
  "is-html-tag-opening",
  "is-language-code",
  "is-media-descriptor",
  "is-relative-uri",
  "js-row-num",
  "json-comb-core",
  "json-variables",
  "lerna-clean-changelogs",
  "line-column-mini",
  "object-all-values-equal-to",
  "object-boolean-combinations",
  "object-delete-key",
  "object-fill-missing-keys",
  "object-flatten-all-arrays",
  "object-flatten-referencing",
  "object-merge-advanced",
  "object-no-new-keys",
  "object-set-all-values-to",
  "ranges-apply",
  "ranges-crop",
  "ranges-ent-decode",
  "ranges-invert",
  "ranges-is-index-within",
  "ranges-iterate",
  "ranges-merge",
  "ranges-offset",
  "ranges-process-outside",
  "ranges-push",
  "ranges-regex",
  "ranges-sort",
  "regex-empty-conditional-comments",
  "regex-is-jinja-nunjucks",
  "regex-is-jsp",
  "regex-jinja-specific",
  "seo-editor",
  "str-indexes-of-plus",
  "string-apostrophes",
  "string-bionic-split",
  "string-character-is-astral-surrogate",
  "string-collapse-leading-whitespace",
  "string-collapse-white-space",
  "string-convert-indexes",
  "string-dashes",
  "string-extract-class-names",
  "string-extract-sass-vars",
  "string-find-heads-tails",
  "string-find-malformed",
  "string-fix-broken-named-entities",
  "string-left-right",
  "string-match-left-right",
  "string-overlap-one-on-another",
  "string-process-comma-separated",
  "string-range-expander",
  "string-remove-duplicate-heads-tails",
  "string-remove-thousand-separators",
  "string-remove-widows",
  "string-split-by-whitespace",
  "string-strip-html",
  "string-trim-spaces-only",
  "string-truncator",
  "string-uglify",
  "string-unfancy",
  "stristri",
  "test-mixer",
  "tsd-extract",
  "util-array-object-or-both",
  "util-nonempty"
] as const;
const packagesOutsideMonorepo = [
  "emlint",
  "lect",
  "perf-ref",
  "remark-conventional-commit-changelog-timeline",
  "tsd-extract-noesm"
] as const;
const splitListFlagshipLibs = [
  "detergent",
  "email-comb",
  "html-crush",
  "string-strip-html"
] as const;
const splitListRangeLibs = [
  "ranges-apply",
  "ranges-crop",
  "ranges-ent-decode",
  "ranges-invert",
  "ranges-is-index-within",
  "ranges-iterate",
  "ranges-merge",
  "ranges-offset",
  "ranges-process-outside",
  "ranges-push",
  "ranges-regex",
  "ranges-sort",
  "string-range-expander"
] as const;
const splitListHtmlLibs = [
  "all-named-html-entities",
  "charcode-is-valid-xml-name-character",
  "color-shorthand-hex-to-six-digit",
  "detect-is-it-html-or-xhtml",
  "detect-templating-language",
  "generate-atomic-css",
  "gulp-email-remove-unused-css",
  "html-all-known-attributes",
  "html-entities-not-email-friendly",
  "html-img-alt",
  "html-table-patcher",
  "is-char-suitable-for-html-attr-name",
  "is-html-attribute-closing",
  "is-html-tag-opening",
  "is-language-code",
  "is-media-descriptor",
  "is-relative-uri",
  "stristri"
] as const;
const splitListStringLibs = [
  "arrayiffy-if-string",
  "bitbucket-slug",
  "easy-replace",
  "edit-package-json",
  "email-all-chars-within-ascii",
  "js-row-num",
  "line-column-mini",
  "str-indexes-of-plus",
  "string-apostrophes",
  "string-bionic-split",
  "string-character-is-astral-surrogate",
  "string-collapse-leading-whitespace",
  "string-collapse-white-space",
  "string-convert-indexes",
  "string-dashes",
  "string-extract-class-names",
  "string-extract-sass-vars",
  "string-find-heads-tails",
  "string-find-malformed",
  "string-fix-broken-named-entities",
  "string-left-right",
  "string-match-left-right",
  "string-overlap-one-on-another",
  "string-process-comma-separated",
  "string-remove-duplicate-heads-tails",
  "string-remove-thousand-separators",
  "string-remove-widows",
  "string-split-by-whitespace",
  "string-trim-spaces-only",
  "string-truncator",
  "string-uglify",
  "string-unfancy"
] as const;
const splitListObjectOrArrLibs = [
  "array-group-str-omit-num-char",
  "array-includes-with-glob",
  "array-of-arrays-into-ast",
  "array-of-arrays-sort-by-col",
  "array-pull-all-with-glob",
  "json-comb-core",
  "json-variables",
  "object-all-values-equal-to",
  "object-boolean-combinations",
  "object-delete-key",
  "object-fill-missing-keys",
  "object-flatten-all-arrays",
  "object-flatten-referencing",
  "object-merge-advanced",
  "object-no-new-keys",
  "object-set-all-values-to",
  "test-mixer"
] as const;
const splitListLernaLibs = [
  "lerna-clean-changelogs",
  "lerna-clean-changelogs-cli",
  "lerna-link-dep"
] as const;
const splitListCliApps = [
  "generate-atomic-css-cli",
  "js-row-num-cli",
  "json-comb",
  "json-sort-cli"
] as const;
const splitListASTApps = [
  "ast-compare",
  "ast-contains-only-empty-space",
  "ast-deep-contains",
  "ast-delete-object",
  "ast-get-object",
  "ast-get-values-by-key",
  "ast-is-empty",
  "ast-loose-compare",
  "ast-monkey",
  "ast-monkey-traverse",
  "ast-monkey-traverse-with-lookahead",
  "ast-monkey-util"
] as const;
const splitListMiscLibs = [
  "check-types-mini",
  "codsen-parser",
  "codsen-tokenizer",
  "codsen-utils",
  "csv-sort",
  "csv-split-easy",
  "email-homey",
  "eslint-plugin-row-num",
  "eslint-plugin-test-num",
  "extract-search-index",
  "regex-empty-conditional-comments",
  "regex-is-jinja-nunjucks",
  "regex-is-jsp",
  "regex-jinja-specific",
  "rehype-responsive-tables",
  "remark-conventional-commit-changelog-timeline",
  "remark-typography",
  "seo-editor",
  "tap-parse-string-to-object",
  "tsd-extract",
  "util-array-object-or-both",
  "util-nonempty"
] as const;

export type Package = typeof all[number];

export const packages = {
    all,
    current,
    cli,
    deprecated,
    programs,
    special,
    script,
    packagesOutsideMonorepo,
    totalPackageCount: 150,
    currentPackagesCount: 132,
    cliCount: 8,
    programsCount: 118,
    specialCount: 1,
    scriptCount: 112,
    packagesOutsideMonorepoCount: 5,
    splitListFlagshipLibs,
    splitListRangeLibs,
    splitListHtmlLibs,
    splitListStringLibs,
    splitListObjectOrArrLibs,
    splitListLernaLibs,
    splitListCliApps,
    splitListASTApps,
    splitListMiscLibs,
};

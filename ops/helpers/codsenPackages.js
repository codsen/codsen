// Codsen packages that are not workspaces in this checkout: published from
// elsewhere, or deprecated. Their manifests are unavailable here, so their own
// graphs cannot be audited -- they are not third-party, but they are not
// verifiable either. `dependencyStatuses` and `generate-info` both classify
// dependency names against this one list so the READMEs and the website's
// package page cannot drift apart.

const packagesOutsideMonorepoObj = {
  "perf-ref": {
    description: "A mock program to normalise perf scores against it",
  },
  "tsd-extract-noesm": {
    description: "Extract any definition from TS definitions file",
  },
  lect: {
    description: "Maintenance CLI for internal consumption",
  },
  emlint: {
    description: "Pluggable email template code linter",
  },
  "array-of-arrays-into-ast": {
    description:
      "Turns an array of arrays of data into a nested tree of plain objects",
  },
  "array-of-arrays-sort-by-col": {
    description:
      "Sort array of arrays by column, rippling the sorting outwards from that column",
  },
  "bitbucket-slug": {
    description:
      "Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond",
  },
  "codsen-parser": {
    description: "Parser aiming at broken or mixed code, especially HTML & CSS",
  },
  "codsen-tokenizer": {
    description:
      "HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages",
  },
  "detect-templating-language": {
    description: "Detects various templating languages present in string",
  },
  "easy-replace": {
    description:
      "Replace strings with optional lookarounds, but without regexes",
  },
  "email-homey": {
    description:
      "Generate homepage in the BrowserSync root with links/screenshots to all your email templates",
  },
  "gulp-email-remove-unused-css": {
    description:
      "Gulp plugin to remove unused CSS classes/id's from styles in HTML HEAD and inline within BODY",
  },
  helga: {
    description: "Your next best friend when editing complex nested code",
  },
  "lerna-link-dep": {
    description:
      "Like lerna add but does just the symlinking, works on CLI bins too",
  },
  "line-column-mini": {
    description: "Convert string index to line-column position",
  },
  "ranges-offset": {
    description: "Increment or decrement each index in every range",
  },
  "regex-is-jinja-nunjucks": {
    description: "Regular expression for detecting Jinja or Nunjucks code",
  },
  "regex-is-jsp": {
    description:
      "Regular expression for detecting JSP (Java Server Pages) code",
  },
  "regex-jinja-specific": {
    description: "Regular expression for detecting Python-specific Jinja code",
  },
  "seo-editor": {
    description: "Copywriting keyword to-do list automation",
  },
  "string-bionic-split": {
    description:
      "Calculate a word string split position index for later highlighting",
  },
  "string-overlap-one-on-another": {
    description: "Lay one string on top of another, with an optional offset",
  },
  "string-truncator": {
    description: "Over-engineered string truncation for web UI's",
  },
  stristri: {
    description:
      "Extracts or deletes HTML, CSS, text and/or templating tags from string",
  },
  "tap-parse-string-to-object": {
    description:
      "Parses raw Tap: string-to-object or stream-to-a-promise-of-an-object",
  },
};

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
  "string-slices-array-push",
];

const packagesOutsideMonorepo = Object.keys(packagesOutsideMonorepoObj);

// Every Codsen name resolvable outside this checkout.
const codsenPackagesOutsideWorkspace = new Set([
  ...packagesOutsideMonorepo,
  ...deprecated,
]);

export {
  codsenPackagesOutsideWorkspace,
  deprecated,
  packagesOutsideMonorepo,
  packagesOutsideMonorepoObj,
};

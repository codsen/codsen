import recordedNpmStatus from "../package-npm-status.json" with {
  type: "json",
};
import { deprecatedPackageNames } from "./npmPackageStatus.js";

// Codsen packages outside this checkout. Location makes no maintenance promise.
// Their manifests are unavailable here, so their own
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
  "eslint-plugin-row-num": {
    description: "ESLint plugin to update row numbers on each console.log",
  },
  "eslint-plugin-test-num": {
    description: "ESLint plugin to update unit test numbers automatically",
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

// Retirement is package-wide policy, not merely the latest version's npm flag.
// The eight posthtml names below whose latest versions lack that flag still
// announce deprecation and replacements in their published npm READMEs.
// eslint-on-airbnb-base-badge is locally retired and unavailable from npm.
const retired = [
  "array-group-str-omit-num-char",
  "ast-delete-object",
  "ast-get-object",
  "ast-loose-compare",
  "ast-monkey-traverse",
  "ast-monkey-traverse-with-lookahead",
  "bitsausage",
  "chlu",
  "chlu-cli",
  "detect-is-it-html-or-xhtml",
  "email-remove-unused-css",
  "eslint-on-airbnb-base-badge",
  "fol",
  "html-img-alt",
  "html-table-patcher",
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
  "ranges-ent-decode",
  "ranges-iterate",
  "ranges-regex",
  "string-convert-indexes",
  "string-extract-sass-vars",
  "string-replace-slices-array",
  "string-slices-array-push",
  "string-split-by-whitespace",
];

const packagesOutsideMonorepo = Object.keys(packagesOutsideMonorepoObj).sort();

// npm maintainer membership and a local checkout do not alone make a package
// a public Codsen product. Keep the audited exceptions explicit.
const catalogueExclusions = {
  "@codsen/data": "Auxiliary generated metadata package",
  "codsen-test-1": "npm README and SVG publishing experiment",
  "eslint-plugin-row-num-tbc":
    "Unpublished frozen checkout alias for eslint-plugin-row-num",
  "eslint-plugin-test-num-tbc":
    "Unpublished frozen checkout alias for eslint-plugin-test-num",
  "postcss-nested-import":
    "Co-maintained third-party project outside the Codsen-authored catalogue",
};

function createCodsenPackageLists(
  workspaceNames,
  npmStatus = recordedNpmStatus,
) {
  if (!Array.isArray(workspaceNames)) {
    throw new TypeError("Codsen workspace names must be an array");
  }
  const seen = new Set();
  for (const name of workspaceNames) {
    if (
      typeof name !== "string" ||
      name.length > 214 ||
      !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name)
    ) {
      throw new TypeError(
        `Invalid Codsen workspace package name: ${String(name)}`,
      );
    }
    if (seen.has(name)) {
      throw new TypeError(`Duplicate Codsen workspace package name: ${name}`);
    }
    if (packagesOutsideMonorepo.includes(name)) {
      throw new TypeError(
        `Codsen package is both a workspace and external: ${name}`,
      );
    }
    seen.add(name);
  }
  // Repository membership and retirement are independent: a retired package
  // can remain checked out while consumers migrate to its replacement.
  const inMonorepo = workspaceNames
    .filter((name) => !Object.hasOwn(catalogueExclusions, name))
    .sort();
  const all = [
    ...new Set([...inMonorepo, ...packagesOutsideMonorepo, ...retired]),
  ].sort();
  const outsideMonorepo = all.filter((name) => !inMonorepo.includes(name));
  const current = all.filter((name) => !retired.includes(name));
  return {
    all,
    inMonorepo,
    outsideMonorepo,
    retired: [...retired],
    deprecated: deprecatedPackageNames(npmStatus).filter((name) =>
      all.includes(name),
    ),
    // Compatibility aliases. New consumers should choose an explicit set.
    current,
    historical: [...all],
    packagesOutsideMonorepo: outsideMonorepo.filter(
      (name) => !retired.includes(name),
    ),
  };
}

// Known Codsen identities outside this checkout, including unavailable names.
const codsenPackagesOutsideWorkspace = new Set([
  ...packagesOutsideMonorepo,
  ...retired,
]);

export {
  catalogueExclusions,
  codsenPackagesOutsideWorkspace,
  createCodsenPackageLists,
  packagesOutsideMonorepo,
  packagesOutsideMonorepoObj,
  retired,
};

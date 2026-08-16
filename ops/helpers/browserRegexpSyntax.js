import ts from "typescript";

// Esbuild lowers language syntax but passes regular-expression literals through
// unchanged, so a literal newer than the floor is not a missing API call: it is
// a parse error which disables the whole bundle at load. These are the classes
// which postdate Chromium 58 and which esbuild will not rewrite.
//
// This audit lives beside browserCompatibility.js rather than inside it because
// it parses with TypeScript, and that helper is a declared input of every
// package build. The build must not load a compiler it never uses.

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

// A bundle this audit cannot read is reported rather than passed over. Silently
// scanning nothing is the failure this gate exists to prevent.
const UNPARSEABLE_BUNDLE =
  "regular expressions unscannable, the bundle did not parse";

// The static text of an argument, or undefined when it is computed. A pattern
// or flag string assembled at run time cannot be audited, and guessing at one
// would fail a build over nothing.
function staticText(node) {
  if (node === undefined) {
    return undefined;
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function isRegexpConstructor(expression) {
  const callee = ts.isPropertyAccessExpression(expression)
    ? expression.name
    : expression;
  return ts.isIdentifier(callee) && callee.text === "RegExp";
}

// Every place a regular expression enters the bundle: a literal, whose pattern
// and flags reach the browser exactly as written, and a `RegExp()` call built
// from a static string. Both are located by parsing rather than by matching the
// bundle text, for two reasons. Text inside a string very often looks like a
// literal - a minified `["</td","<html"]` reads as one ending in an `s` flag -
// so a scan of the raw source fails builds over data. And a hand-written
// code/data scanner which resolves one `/` wrongly walks on inside the literal
// it failed to recognise, where a quote sends it hunting for a close that never
// comes, so it silently finds nothing in the rest of the file. A parser decides
// the same ambiguity from expression context and cannot desynchronise.
function collectRegexpSites(source) {
  const sourceFile = ts.createSourceFile(
    "bundle.js",
    source,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.JS,
  );
  const sites = [];

  function visit(node) {
    if (ts.isRegularExpressionLiteral(node)) {
      // the literal text is `/pattern/flags`, and a flag is always a letter, so
      // the last `/` closes the pattern however the pattern itself is written
      const close = node.text.lastIndexOf("/");
      sites.push({
        flags: node.text.slice(close + 1),
        pattern: node.text.slice(1, close),
      });
    } else if (
      (ts.isNewExpression(node) || ts.isCallExpression(node)) &&
      isRegexpConstructor(node.expression)
    ) {
      const [patternArgument, flagsArgument] = node.arguments ?? [];
      sites.push({
        flags: staticText(flagsArgument) ?? "",
        pattern: staticText(patternArgument) ?? "",
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  return { parsed: sourceFile.parseDiagnostics.length === 0, sites };
}

function findUnsupportedIifeRegexpSyntax(source) {
  if (typeof source !== "string") {
    throw new TypeError("The IIFE source must be a string");
  }
  const { parsed, sites } = collectRegexpSites(source);
  const found = parsed ? [] : [UNPARSEABLE_BUNDLE];

  for (const { name, pattern } of UNSUPPORTED_IIFE_REGEXP_SYNTAX) {
    if (sites.some((site) => pattern.test(site.pattern))) {
      found.push(name);
    }
  }
  for (const { flag, name } of UNSUPPORTED_IIFE_REGEXP_FLAGS) {
    if (sites.some((site) => site.flags.includes(flag))) {
      found.push(name);
    }
  }
  return found;
}

export { findUnsupportedIifeRegexpSyntax };

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

// The text of a string written out at this node, or undefined when it is not a
// string literal. A pattern or flag assembled at run time cannot be audited,
// and guessing at one would fail a build over nothing.
function literalText(node) {
  if (node === undefined) {
    return undefined;
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function isAssignmentOperator(kind) {
  return (
    kind >= ts.SyntaxKind.FirstAssignment &&
    kind <= ts.SyntaxKind.LastAssignment
  );
}

// A pattern held in a variable reaches the browser exactly as a written-out one
// does, so `var P = "(?<=x)y"; new RegExp(P)` breaks the floor just the same and
// has to be audited too. Only a name the bundle binds once, to a string
// literal, and never rebinds or writes to is resolved: a name bound twice, or
// destructured, or assigned anywhere, is one this audit cannot follow, and
// following it by guessing would fail builds over nothing.
//
// The declarations are collected by walking down to them rather than by reading
// `node.parent`, because this file is parsed without parent pointers - setting
// them on every node of a 300 KB minified bundle costs more than this audit is
// worth.
function staticConstants(sourceFile) {
  const declared = new Map();
  const unresolvable = new Set();

  function noteRebound(name) {
    if (name !== undefined && ts.isIdentifier(name)) {
      unresolvable.add(name.text);
    }
  }

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      const texts = declared.get(node.name.text) ?? [];
      texts.push(literalText(node.initializer));
      declared.set(node.name.text, texts);
    } else if (
      ts.isParameter(node) ||
      ts.isBindingElement(node) ||
      ts.isFunctionDeclaration(node) ||
      ts.isFunctionExpression(node) ||
      ts.isClassDeclaration(node) ||
      ts.isClassExpression(node) ||
      ts.isImportSpecifier(node) ||
      ts.isImportClause(node) ||
      ts.isNamespaceImport(node)
    ) {
      noteRebound(node.name);
    } else if (ts.isCatchClause(node)) {
      noteRebound(node.variableDeclaration?.name);
    } else if (
      ts.isBinaryExpression(node) &&
      isAssignmentOperator(node.operatorToken.kind)
    ) {
      noteRebound(node.left);
    } else if (
      ts.isPostfixUnaryExpression(node) ||
      ts.isPrefixUnaryExpression(node)
    ) {
      noteRebound(node.operand);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  const constants = new Map();
  for (const [name, texts] of declared) {
    if (
      !unresolvable.has(name) &&
      texts.length === 1 &&
      texts[0] !== undefined
    ) {
      constants.set(name, texts[0]);
    }
  }
  return constants;
}

// The static text of a `RegExp()` argument: written out here, or held by a name
// this bundle binds exactly once to a string.
function argumentText(node, constants) {
  const literal = literalText(node);
  if (literal !== undefined) {
    return literal;
  }
  if (node !== undefined && ts.isIdentifier(node)) {
    return constants.get(node.text);
  }
  return undefined;
}

// `new RegExp()`, `RegExp()`, `new (RegExp)()` and `window["RegExp"]()` all
// construct the same object, so the parentheses and the access form are
// unwrapped before the callee is named.
function isRegexpConstructor(expression) {
  let callee = expression;
  while (ts.isParenthesizedExpression(callee)) {
    callee = callee.expression;
  }
  if (ts.isElementAccessExpression(callee)) {
    return literalText(callee.argumentExpression) === "RegExp";
  }
  if (ts.isPropertyAccessExpression(callee)) {
    callee = callee.name;
  }
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
  const constants = staticConstants(sourceFile);
  const sites = [];

  function visit(node) {
    if (ts.isRegularExpressionLiteral(node)) {
      // The literal text is `/pattern/flags`, and a flag is always a letter, so
      // the last `/` closes the pattern however the pattern itself is written.
      // An unterminated literal has no closing `/` at all, so there is no
      // pattern to read: splitting its text at index 0 would take the whole
      // body for the flag string and invent flag findings on top of the parse
      // error which is already reported.
      const close = node.text.lastIndexOf("/");
      if (close > 0) {
        sites.push({
          flags: node.text.slice(close + 1),
          pattern: node.text.slice(1, close),
        });
      }
    } else if (
      (ts.isNewExpression(node) || ts.isCallExpression(node)) &&
      isRegexpConstructor(node.expression)
    ) {
      const [patternArgument, flagsArgument] = node.arguments ?? [];
      sites.push({
        flags: argumentText(flagsArgument, constants) ?? "",
        pattern: argumentText(patternArgument, constants) ?? "",
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

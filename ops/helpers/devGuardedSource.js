import ts from "typescript";

// The reading shared by the audits of `DEV &&` guarded code: how a source file
// is parsed, how a position in it is reported, and what counts as being inside
// a DEV guard. Both devConsoleLogLineLabels.js and devOnlyImpureLocals.js ask
// the same question of the same shape, and answering it in one place is what
// keeps them from drifting apart - a guard form recognised by one but not the
// other would mean the label gate and the cost gate disagree about which code
// ships.
//
// browserRegexpSyntax.js deliberately does not use this module. It parses a
// built bundle rather than a source file, without parent pointers and under a
// fixed script kind, and it has no positions to report; sharing a parse helper
// with it would mean parameterising every one of those choices for no gain.

function scriptKind(filePath) {
  if (filePath.endsWith(".tsx")) {
    return ts.ScriptKind.TSX;
  }
  if (filePath.endsWith(".jsx")) {
    return ts.ScriptKind.JSX;
  }
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) {
    return ts.ScriptKind.JS;
  }
  return ts.ScriptKind.TS;
}

// Parent pointers are set: every consumer walks upwards from an identifier to
// decide whether a guard encloses it.
function parseSourceFile(sourceText, filePath) {
  return ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(filePath),
  );
}

function unwrapExpression(node) {
  let current = node;
  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isNonNullExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isTypeAssertionExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function conditionImpliesDev(node) {
  const expression = unwrapExpression(node);
  if (ts.isIdentifier(expression)) {
    return expression.text === "DEV";
  }
  return (
    ts.isBinaryExpression(expression) &&
    expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
    (conditionImpliesDev(expression.left) ||
      conditionImpliesDev(expression.right))
  );
}

function isInside(node, ancestor) {
  return node.pos >= ancestor.pos && node.end <= ancestor.end;
}

// The two forms the build strips: the right side of `DEV && …`, and the then
// branch of `if (DEV) { … }`.
function isDevGuarded(node) {
  let current = node;
  while (current.parent) {
    const parent = current.parent;
    if (
      ts.isBinaryExpression(parent) &&
      parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
      isInside(node, parent.right) &&
      conditionImpliesDev(parent.left)
    ) {
      return true;
    }
    if (
      ts.isIfStatement(parent) &&
      isInside(node, parent.thenStatement) &&
      conditionImpliesDev(parent.expression)
    ) {
      return true;
    }
    current = parent;
  }
  return false;
}

function locationAt(sourceFile, position) {
  const { character, line } =
    sourceFile.getLineAndCharacterOfPosition(position);
  return { column: character + 1, line: line + 1 };
}

function parseError(sourceFile, diagnostic) {
  const location = locationAt(sourceFile, diagnostic.start ?? 0);
  return {
    ...location,
    kind: "parse-error",
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
  };
}

export {
  isDevGuarded,
  isInside,
  locationAt,
  parseError,
  parseSourceFile,
  scriptKind,
  unwrapExpression,
};

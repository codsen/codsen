import ts from "typescript";

// A `DEV && console.log(...)` guard is removed at build time, but only the
// logging is removed - not the work which produced the values it printed.
// Esbuild cannot prove a call free of side effects, so a local initialised from
// a call and read only inside a DEV guard survives minification, and every
// consumer of the published bundle pays for it. This audit finds that shape.

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

function initializerCalls(node) {
  let found = false;
  const visit = (current) => {
    if (found) {
      return;
    }
    // a call inside a nested function body is not run by the initialiser
    if (
      ts.isFunctionExpression(current) ||
      ts.isArrowFunction(current) ||
      ts.isFunctionDeclaration(current)
    ) {
      return;
    }
    if (ts.isCallExpression(current) || ts.isNewExpression(current)) {
      found = true;
      return;
    }
    ts.forEachChild(current, visit);
  };
  visit(node);
  return found;
}

// an identifier which reads the value, rather than naming a declaration,
// a property, a label, or a type
function isValueRead(node) {
  const parent = node.parent;
  if (!parent) {
    return false;
  }
  if (ts.isVariableDeclaration(parent) && parent.name === node) {
    return false;
  }
  if (ts.isPropertyAccessExpression(parent) && parent.name === node) {
    return false;
  }
  if (
    (ts.isPropertyAssignment(parent) ||
      ts.isPropertySignature(parent) ||
      ts.isMethodDeclaration(parent) ||
      ts.isPropertyDeclaration(parent) ||
      ts.isEnumMember(parent) ||
      ts.isParameter(parent) ||
      ts.isBindingElement(parent)) &&
    parent.name === node
  ) {
    return false;
  }
  if (
    ts.isImportSpecifier(parent) ||
    ts.isTypeReferenceNode(parent) ||
    ts.isQualifiedName(parent)
  ) {
    return false;
  }
  // `export { value }` reads the local binding and lets the value escape the
  // module, so it counts as a use outside any DEV guard
  return true;
}

// `export const value = …` is public API and must exist however it is read
function isExported(declaration) {
  const statement = declaration.parent?.parent;
  return (
    statement !== undefined &&
    ts.isVariableStatement(statement) &&
    (statement.modifiers ?? []).some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    )
  );
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

function auditDevOnlyImpureLocals(sourceText, filePath = "source.ts") {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(filePath),
  );
  const problems = sourceFile.parseDiagnostics.map((diagnostic) =>
    parseError(sourceFile, diagnostic),
  );
  let checkedCount = 0;

  const candidates = [];
  const readsByName = new Map();

  function collect(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      // a declaration already inside a DEV guard is removed with the guard
      !isDevGuarded(node) &&
      !isExported(node) &&
      initializerCalls(node.initializer)
    ) {
      checkedCount += 1;
      candidates.push(node);
    }
    if (ts.isIdentifier(node) && isValueRead(node)) {
      const reads = readsByName.get(node.text) ?? [];
      reads.push(node);
      readsByName.set(node.text, reads);
    }
    ts.forEachChild(node, collect);
  }
  collect(sourceFile);

  for (const declaration of candidates) {
    const name = declaration.name.text;
    // Every same-named read in the file counts, not only the ones this
    // declaration binds. Shadowing therefore hides a finding rather than
    // inventing one, which is the safe direction for a policy gate.
    const reads = readsByName.get(name) ?? [];
    if (!reads.length || !reads.every((read) => isDevGuarded(read))) {
      continue;
    }
    problems.push({
      ...locationAt(sourceFile, declaration.getStart(sourceFile)),
      kind: "dev-only-impure-local",
      message: `"${name}" is initialised from a call and read only inside DEV logging, so the call survives minification into the published bundle; compute it inside the log instead`,
      name,
      reads: reads.length,
    });
  }

  return { checkedCount, problems };
}

export { auditDevOnlyImpureLocals };

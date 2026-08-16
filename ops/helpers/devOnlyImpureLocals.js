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

function isFunctionScope(node) {
  return (
    ts.isSourceFile(node) ||
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node)
  );
}

function isBlockScope(node) {
  return (
    isFunctionScope(node) ||
    ts.isBlock(node) ||
    ts.isModuleBlock(node) ||
    ts.isCaseBlock(node) ||
    ts.isCatchClause(node) ||
    ts.isForStatement(node) ||
    ts.isForInStatement(node) ||
    ts.isForOfStatement(node) ||
    ts.isClassDeclaration(node) ||
    ts.isClassExpression(node)
  );
}

// The region of the file in which this declaration's name means this binding:
// the enclosing block for `let` and `const`, the enclosing function for `var`.
// A read of the same name outside it is a different variable.
function bindingScope(declaration) {
  const blockScoped =
    ts.isVariableDeclarationList(declaration.parent) &&
    (declaration.parent.flags & ts.NodeFlags.BlockScoped) !== 0;
  const bindsHere = blockScoped ? isBlockScope : isFunctionScope;
  let current = declaration.parent;
  while (current.parent && !bindsHere(current)) {
    current = current.parent;
  }
  return current;
}

// every identifier a declaration binds, including through a destructuring
// pattern: `let { length: n }` binds `n`, and `let [a, , b]` binds `a` and `b`
function boundNames(name) {
  if (ts.isIdentifier(name)) {
    return [name.text];
  }
  return name.elements.flatMap((element) =>
    ts.isBindingElement(element) ? boundNames(element.name) : [],
  );
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
  // the key side of `let { length: n } = …` names a property of the value
  if (ts.isBindingElement(parent) && parent.propertyName === node) {
    return false;
  }
  // `continue candidate;` names a label, and a label may share a variable's name
  if (
    ts.isLabeledStatement(parent) ||
    ts.isBreakStatement(parent) ||
    ts.isContinueStatement(parent)
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
    const names = boundNames(declaration.name);
    const scope = bindingScope(declaration);
    // Only reads inside the scope this declaration binds count; a same-named
    // read in another function is a different variable. Within that scope every
    // same-named read still counts, not only the ones this declaration binds,
    // so genuine shadowing hides a finding rather than inventing one, which is
    // the safe direction for a policy gate. A destructuring pattern needs its
    // whole call kept as soon as any one of its bindings is read outside a
    // guard, so the reads of all its names are pooled.
    const reads = names.flatMap((name) =>
      (readsByName.get(name) ?? []).filter((read) => isInside(read, scope)),
    );
    if (!reads.length || !reads.every((read) => isDevGuarded(read))) {
      continue;
    }
    const name = names.join(", ");
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

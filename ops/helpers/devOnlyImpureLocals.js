import ts from "typescript";

import {
  isDevGuarded,
  locationAt,
  parseError,
  parseSourceFile,
  unwrapExpression,
} from "./devGuardedSource.js";

// A `DEV && console.log(...)` guard is removed at build time, but only the
// logging is removed - not the work which produced the values it printed.
// Esbuild cannot prove a call free of side effects, so a local initialised from
// a call and read only inside a DEV guard survives minification, and every
// consumer of the published bundle pays for it. This audit finds that shape.

const COMPILER_OPTIONS = Object.freeze({
  allowJs: true,
  // the question is which declaration a name binds to, which the binder answers
  // on its own; loading the standard library would only slow every file down
  noLib: true,
  noResolve: true,
  target: ts.ScriptTarget.Latest,
});

// A program over this one file, so that reads can be resolved to the
// declaration they actually bind to. Nothing outside the file is needed: a
// local is declared and read in the same file by definition, and an unresolved
// global simply has no symbol, which is the right answer for one.
function checkedSourceFile(sourceText, filePath) {
  const sourceFile = parseSourceFile(sourceText, filePath);
  const host = {
    fileExists: (name) => name === filePath,
    getCanonicalFileName: (name) => name,
    getCurrentDirectory: () => "",
    getDefaultLibFileName: () => "lib.d.ts",
    getNewLine: () => "\n",
    getSourceFile: (name) => (name === filePath ? sourceFile : undefined),
    readFile: (name) => (name === filePath ? sourceText : undefined),
    useCaseSensitiveFileNames: () => true,
    writeFile: () => {},
  };
  const program = ts.createProgram([filePath], COMPILER_OPTIONS, host);
  return { checker: program.getTypeChecker(), sourceFile };
}

// The declaration an identifier binds to. Two shorthand forms name a local but
// resolve to something else when asked directly, and in both the local really
// is read - so taking the direct answer would report a call as dead when the
// value it produced is returned to the caller:
//   `export { value }`   resolves to the export alias, not the local
//   `return { value }`   resolves to the object's property, not the local
function symbolFor(checker, node) {
  const parent = node.parent;
  if (parent && ts.isExportSpecifier(parent)) {
    return checker.getExportSpecifierLocalTargetSymbol(parent);
  }
  if (
    parent &&
    ts.isShorthandPropertyAssignment(parent) &&
    parent.name === node
  ) {
    return checker.getShorthandAssignmentValueSymbol(parent);
  }
  return checker.getSymbolAtLocation(node);
}

// every identifier a declaration binds, including through a destructuring
// pattern: `let { length: n }` binds `n`, and `let [a, , b]` binds `a` and `b`
function boundIdentifiers(name) {
  if (ts.isIdentifier(name)) {
    return [name];
  }
  return name.elements.flatMap((element) =>
    ts.isBindingElement(element) ? boundIdentifiers(element.name) : [],
  );
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

// A discarded native-style iteration is another way for diagnostic work to
// survive the production build without ever being assigned to a local:
//
//   makeString().split("").forEach((char) => {
//     DEV && console.log(char);
//   });
//
// Esbuild removes the log but conservatively retains every call in the chain
// and the now-empty callback. Keep this deliberately narrow to `forEach`: its
// return value is specified to be discarded, so a freestanding call exists for
// callback effects, whereas an arbitrary callback-taking method may perform
// independent work when it registers or schedules that callback.
function forEachCallback(node) {
  if (!ts.isCallExpression(node)) {
    return undefined;
  }
  const callee = node.expression;
  if (
    !ts.isPropertyAccessExpression(callee) ||
    callee.name.text !== "forEach"
  ) {
    return undefined;
  }
  const callback = node.arguments[0];
  return callback &&
    (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback))
    ? callback
    : undefined;
}

function isAssignment(node) {
  return (
    ts.isBinaryExpression(node) &&
    node.operatorToken.kind >= ts.SyntaxKind.FirstAssignment &&
    node.operatorToken.kind <= ts.SyntaxKind.LastAssignment
  );
}

// Calls are the important case, but the callback may also mutate state without
// one. Property reads are included because a getter can have effects which the
// syntax alone cannot prove safe to discard. Pure arithmetic and a bare return
// do not count: `forEach` ignores the callback's return value.
function isPotentialRuntimeEffect(node) {
  return (
    ts.isCallExpression(node) ||
    ts.isNewExpression(node) ||
    ts.isTaggedTemplateExpression(node) ||
    ts.isAwaitExpression(node) ||
    ts.isYieldExpression(node) ||
    ts.isDeleteExpression(node) ||
    ts.isThrowStatement(node) ||
    ts.isPropertyAccessExpression(node) ||
    ts.isElementAccessExpression(node) ||
    ts.isSpreadElement(node) ||
    ts.isSpreadAssignment(node) ||
    isAssignment(node) ||
    ((ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) &&
      (node.operator === ts.SyntaxKind.PlusPlusToken ||
        node.operator === ts.SyntaxKind.MinusMinusToken))
  );
}

function callbackEffects(callback) {
  let guarded = 0;
  let unguarded = 0;
  const root = callback.body;

  const visit = (node) => {
    // Declaring a nested function does not execute its body during this
    // iteration. In particular, a guarded log inside that deferred body must
    // not make an otherwise empty callback look like a debug traversal.
    if (node !== root && ts.isFunctionLike(node)) {
      return;
    }
    if (isPotentialRuntimeEffect(node)) {
      if (isDevGuarded(node)) {
        guarded += 1;
      } else {
        unguarded += 1;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(root);
  return { guarded, unguarded };
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
  // The target of a plain assignment overwrites the value rather than reading
  // it, so `n = 2` is not a use of what the initialiser produced and must not
  // excuse the call which produced it. A compound assignment such as `n += 1`
  // and an update such as `n++` both read the old value first, so they count.
  if (
    ts.isBinaryExpression(parent) &&
    parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
    parent.left === node
  ) {
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

function auditDevOnlyImpureLocals(sourceText, filePath = "source.ts") {
  const { checker, sourceFile } = checkedSourceFile(sourceText, filePath);
  const problems = sourceFile.parseDiagnostics.map((diagnostic) =>
    parseError(sourceFile, diagnostic),
  );
  let checkedCount = 0;

  const candidates = [];
  const expressionCandidates = [];
  const readsBySymbol = new Map();

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
    if (ts.isExpressionStatement(node)) {
      const expression = unwrapExpression(node.expression);
      const callback = forEachCallback(expression);
      if (callback && !isDevGuarded(expression)) {
        expressionCandidates.push({ callback, statement: node });
      }
    }
    if (ts.isIdentifier(node) && isValueRead(node)) {
      // an identifier which resolves to nothing is a global this file never
      // declares, so it reads none of the locals under audit
      const symbol = symbolFor(checker, node);
      if (symbol) {
        const reads = readsBySymbol.get(symbol) ?? [];
        reads.push(node);
        readsBySymbol.set(symbol, reads);
      }
    }
    ts.forEachChild(node, collect);
  }
  collect(sourceFile);

  for (const declaration of candidates) {
    const identifiers = boundIdentifiers(declaration.name);
    // Reads are matched to the declaration they bind to, which is what the
    // binder already knows: a same-named variable in another function, or one
    // shadowing this in a nested scope, is a different symbol and says nothing
    // about this declaration. A destructuring pattern needs its whole call kept
    // as soon as any one of its bindings is read outside a guard, so the reads
    // of all its symbols are pooled.
    const reads = identifiers.flatMap((identifier) => {
      const symbol = symbolFor(checker, identifier);
      return symbol ? (readsBySymbol.get(symbol) ?? []) : [];
    });
    if (!reads.length || !reads.every((read) => isDevGuarded(read))) {
      continue;
    }
    const name = identifiers.map((identifier) => identifier.text).join(", ");
    problems.push({
      ...locationAt(sourceFile, declaration.getStart(sourceFile)),
      kind: "dev-only-impure-local",
      message: `"${name}" is initialised from a call and read only inside DEV logging, so the call survives minification into the published bundle; compute it inside the log instead`,
      name,
      reads: reads.length,
    });
  }

  for (const { callback, statement } of expressionCandidates) {
    const effects = callbackEffects(callback);
    if (!effects.guarded || effects.unguarded) {
      continue;
    }
    problems.push({
      ...locationAt(sourceFile, statement.getStart(sourceFile)),
      kind: "dev-only-impure-expression",
      message:
        'a freestanding "forEach" call chain has only DEV-guarded callback effects, so the chain survives minification with an empty callback; guard the complete expression instead',
      method: "forEach",
    });
  }

  return { checkedCount, problems };
}

export { auditDevOnlyImpureLocals };

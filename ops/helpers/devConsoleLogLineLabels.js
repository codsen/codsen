import ts from "typescript";

const RAW_NAVIGATION_LABEL = /(?:^|[\n*])(?:(?:\\[nr])|[^\S\n])*(\d+)(?=$|\D)/u;

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

function isConsoleLogCall(node) {
  if (!ts.isCallExpression(node)) {
    return false;
  }
  const expression = unwrapExpression(node.expression);
  return (
    ts.isPropertyAccessExpression(expression) &&
    ts.isIdentifier(expression.expression) &&
    expression.expression.text === "console" &&
    expression.name.text === "log"
  );
}

function stringLiteralParts(node) {
  const expression = unwrapExpression(node);
  if (
    ts.isStringLiteral(expression) ||
    ts.isNoSubstitutionTemplateLiteral(expression)
  ) {
    return [expression];
  }
  if (ts.isTemplateExpression(expression)) {
    return [
      expression.head,
      ...expression.templateSpans.flatMap(({ expression: value, literal }) => [
        ...stringLiteralParts(value),
        literal,
      ]),
    ];
  }
  if (
    ts.isBinaryExpression(expression) &&
    expression.operatorToken.kind === ts.SyntaxKind.PlusToken
  ) {
    return [
      ...stringLiteralParts(expression.left),
      ...stringLiteralParts(expression.right),
    ];
  }
  return [];
}

function rawLiteral(node, sourceFile) {
  const text = node.getText(sourceFile);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return { offset: 1, text: text.slice(1, -1) };
  }
  if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node)) {
    return { offset: 1, text: text.slice(1, -2) };
  }
  return { offset: 1, text: text.slice(1, -1) };
}

function navigationLabel(node, sourceFile) {
  for (const part of stringLiteralParts(node)) {
    const raw = rawLiteral(part, sourceFile);
    const match = raw.text.match(RAW_NAVIGATION_LABEL);
    if (match) {
      const digitOffset = match.index + match[0].lastIndexOf(match[1]);
      return {
        label: match[1],
        position: part.getStart(sourceFile) + raw.offset + digitOffset,
      };
    }
  }
  return null;
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

function auditDevConsoleLogLineLabels(sourceText, filePath = "source.ts") {
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

  function visit(node) {
    if (isConsoleLogCall(node) && isDevGuarded(node)) {
      checkedCount += 1;
      const callLocation = locationAt(sourceFile, node.getStart(sourceFile));
      const navigation = node.arguments.length
        ? navigationLabel(node.arguments[0], sourceFile)
        : null;
      if (!navigation) {
        problems.push({
          ...callLocation,
          kind: "missing-label",
          message:
            "DEV-guarded console.log first argument must start with a numeric line label",
        });
      } else {
        const labelLocation = locationAt(sourceFile, navigation.position);
        const actual = Number.parseInt(navigation.label, 10);
        if (actual !== labelLocation.line) {
          problems.push({
            ...labelLocation,
            actual,
            expected: labelLocation.line,
            kind: "wrong-label",
            message: `DEV-guarded console.log line label ${navigation.label} must be ${labelLocation.line}`,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { checkedCount, problems };
}

export { auditDevConsoleLogLineLabels };

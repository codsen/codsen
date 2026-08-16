import ts from "typescript";

import {
  isDevGuarded,
  locationAt,
  parseError,
  parseSourceFile,
  unwrapExpression,
} from "./devGuardedSource.js";

const RAW_NAVIGATION_LABEL = /(?:^|[\n*])(?:(?:\\[nr])|[^\S\n])*(\d+)(?=$|\D)/u;

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

function auditDevConsoleLogLineLabels(sourceText, filePath = "source.ts") {
  const sourceFile = parseSourceFile(sourceText, filePath);
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

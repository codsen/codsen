import ts from "typescript";

function isNamedCall(node, name) {
  return (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === name
  );
}

function assertionBindings(sourceFile) {
  const equal = new Set(["equal"]);
  for (const statement of sourceFile.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== "uvu/assert" ||
      !statement.importClause?.namedBindings ||
      !ts.isNamedImports(statement.importClause.namedBindings)
    ) {
      continue;
    }
    for (const specifier of statement.importClause.namedBindings.elements) {
      const imported = specifier.propertyName?.text ?? specifier.name.text;
      if (imported === "equal") {
        equal.add(specifier.name.text);
      }
    }
  }
  return { equal };
}

function isBoundCall(node, bindings) {
  if (!ts.isCallExpression(node)) {
    return false;
  }
  if (ts.isIdentifier(node.expression)) {
    return bindings.has(node.expression.text);
  }
  return (
    ts.isPropertyAccessExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    bindings.has(node.expression.expression.text)
  );
}

function location(sourceFile, node) {
  const point = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(sourceFile),
  );
  return { column: point.character + 1, line: point.line + 1 };
}

function staticPrefix(text, separator) {
  const match = text.match(
    separator === "title"
      ? /^(\d{2,3})(?=$| - )/u
      : /^(\d{2,3})\.(\d{2,})(?=$| - )/u,
  );
  if (!match) {
    return null;
  }
  return separator === "title"
    ? { number: Number(match[1]), rendered: match[1] }
    : {
        assertionNumber: Number(match[2]),
        assertionRendered: match[2],
        testNumber: Number(match[1]),
        testRendered: match[1],
      };
}

function dynamicPrefix(node, separator) {
  if (!ts.isTemplateExpression(node) || node.head.text !== "") {
    return null;
  }
  const [firstSpan] = node.templateSpans;
  if (!firstSpan || !ts.isIdentifier(firstSpan.expression)) {
    return null;
  }
  const match = firstSpan.literal.text.match(
    separator === "title" ? /^ - /u : /^\.(\d{2,})(?=$| - )/u,
  );
  if (!match) {
    return null;
  }
  return separator === "title"
    ? { identifier: firstSpan.expression.text }
    : {
        assertionNumber: Number(match[1]),
        assertionRendered: match[1],
        identifier: firstSpan.expression.text,
      };
}

function renderedStart(node) {
  if (ts.isStringLiteralLike(node)) {
    return node.text;
  }
  if (ts.isTemplateExpression(node)) {
    return node.head.text;
  }
  return null;
}

function directVariableDeclaration(block, name, before) {
  for (const statement of block.statements ?? []) {
    if (statement.getStart() >= before || !ts.isVariableStatement(statement)) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) {
        return declaration;
      }
    }
  }
  return null;
}

function dynamicTitleRange(testCall, identifier) {
  let scope = testCall.parent;
  let declaration = null;
  while (scope) {
    if (ts.isBlock(scope) || ts.isSourceFile(scope)) {
      declaration = directVariableDeclaration(
        scope,
        identifier,
        testCall.getStart(),
      );
      if (declaration) {
        break;
      }
    }
    scope = scope.parent;
  }
  const padCall = declaration?.initializer;
  if (
    !padCall ||
    !ts.isCallExpression(padCall) ||
    !ts.isPropertyAccessExpression(padCall.expression) ||
    padCall.expression.name.text !== "padStart" ||
    padCall.arguments.length !== 2 ||
    !ts.isNumericLiteral(padCall.arguments[0]) ||
    ![2, 3].includes(Number(padCall.arguments[0].text)) ||
    !ts.isStringLiteralLike(padCall.arguments[1]) ||
    padCall.arguments[1].text !== "0"
  ) {
    return null;
  }
  const stringCall = padCall.expression.expression;
  if (
    !ts.isCallExpression(stringCall) ||
    !ts.isIdentifier(stringCall.expression) ||
    stringCall.expression.text !== "String" ||
    stringCall.arguments.length !== 1
  ) {
    return null;
  }
  const addition = stringCall.arguments[0];
  if (
    !ts.isBinaryExpression(addition) ||
    addition.operatorToken.kind !== ts.SyntaxKind.PlusToken ||
    !ts.isIdentifier(addition.left) ||
    !ts.isNumericLiteral(addition.right)
  ) {
    return null;
  }
  const offset = Number(addition.right.text);

  let callback = declaration.parent;
  while (callback && !ts.isArrowFunction(callback)) {
    callback = callback.parent;
  }
  if (
    !callback?.parameters.some(
      ({ name }) => ts.isIdentifier(name) && name.text === addition.left.text,
    ) ||
    !ts.isCallExpression(callback.parent) ||
    !ts.isPropertyAccessExpression(callback.parent.expression) ||
    callback.parent.expression.name.text !== "forEach" ||
    !ts.isArrayLiteralExpression(callback.parent.expression.expression)
  ) {
    return null;
  }
  const count = callback.parent.expression.expression.elements.length;
  return {
    numbers: Array.from({ length: count }, (_, index) => offset + index),
    offsetNode: addition.right,
    width: Number(padCall.arguments[0].text),
    widthNode: padCall.arguments[0],
  };
}

function titleInfo(testCall) {
  const title = testCall.arguments[0];
  if (!title) {
    return null;
  }
  const start = renderedStart(title);
  if (start !== null) {
    const prefix = staticPrefix(start, "title");
    if (prefix) {
      return {
        ...prefix,
        node: title,
        numbers: [prefix.number],
        width: prefix.rendered.length,
      };
    }
  }
  const dynamic = dynamicPrefix(title, "title");
  if (!dynamic) {
    return null;
  }
  const range = dynamicTitleRange(testCall, dynamic.identifier);
  return range
    ? { ...dynamic, ...range, node: title }
    : { ...dynamic, node: title, unsupported: true };
}

function labelInfo(node) {
  const start = renderedStart(node);
  if (start !== null) {
    const prefix = staticPrefix(start, "assertion");
    if (prefix) {
      return prefix;
    }
  }
  return dynamicPrefix(node, "assertion");
}

function sourceFileFrom(source, filename) {
  return ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    filename.endsWith(".ts") ? ts.ScriptKind.TS : ts.ScriptKind.JS,
  );
}

function collectTests(sourceFile) {
  const tests = [];
  function collect(node) {
    if (isNamedCall(node, "test")) {
      tests.push({ call: node, info: titleInfo(node) });
    }
    ts.forEachChild(node, collect);
  }
  collect(sourceFile);
  return tests;
}

function auditUnitTestNumbering(
  source,
  filename = "<source>",
  { requiredWidth: configuredWidth } = {},
) {
  const sourceFile = sourceFileFrom(source, filename);
  const problems = sourceFile.parseDiagnostics.map((diagnostic) => {
    const node = {
      getStart: () => diagnostic.start ?? 0,
    };
    return {
      ...location(sourceFile, node),
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
    };
  });
  const problem = (node, message) => {
    problems.push({ ...location(sourceFile, node), message });
  };
  const bindings = assertionBindings(sourceFile);

  const tests = collectTests(sourceFile);

  const sequence = [];
  for (const item of tests) {
    if (!item.info) {
      problem(
        item.call.arguments[0] ?? item.call,
        'test title must start with a two- or three-digit number and use " - " before a description',
      );
      continue;
    }
    if (item.info.unsupported) {
      problem(
        item.info.node,
        "dynamic test title does not use the supported padded forEach index pattern",
      );
      continue;
    }
    sequence.push(
      ...item.info.numbers.map((number) => ({
        info: item.info,
        node: item.info.node,
        number,
      })),
    );
  }

  const requiredWidth =
    configuredWidth ?? (sequence.some(({ number }) => number >= 100) ? 3 : 2);
  sequence.forEach((entry, index) => {
    const expected = index + 1;
    if (entry.number !== expected) {
      problem(
        entry.node,
        `test number ${entry.number} must be ${String(expected).padStart(requiredWidth, "0")} in source order`,
      );
    }
    if (entry.info.width !== requiredWidth) {
      problem(
        entry.node,
        `test number must use ${requiredWidth}-digit padding in this file`,
      );
    }
  });

  let equalCount = 0;
  for (const item of tests) {
    const callback = item.call.arguments[1];
    if (!callback || !item.info || item.info.unsupported) {
      continue;
    }
    let previousAssertionNumber = 0;
    function auditCallback(node) {
      if (node !== item.call && isNamedCall(node, "test")) {
        return;
      }
      const isEqual = isBoundCall(node, bindings.equal);
      if (isEqual) {
        equalCount += 1;
        const label = node.arguments[2];
        if (!label) {
          problem(node, "equal() must have a numbered third argument");
          return;
        }
        const info = labelInfo(label);
        if (!info) {
          problem(
            label,
            "equal() label must start with the containing test and assertion numbers",
          );
          return;
        }
        if (info.assertionNumber <= previousAssertionNumber) {
          problem(
            label,
            `equal() assertion number ${info.assertionRendered} must be greater than ${String(previousAssertionNumber).padStart(2, "0")}`,
          );
        }
        previousAssertionNumber = info.assertionNumber;
        if (item.info.identifier) {
          if (info.identifier !== item.info.identifier) {
            problem(
              label,
              `equal() label must start with \${${item.info.identifier}}`,
            );
          }
        } else if (
          info.testNumber !== item.info.number ||
          info.testRendered !== item.info.rendered
        ) {
          problem(
            label,
            `equal() label must start with test number ${item.info.rendered}`,
          );
        }
      }
      ts.forEachChild(node, auditCallback);
    }
    auditCallback(callback);
  }

  return {
    equalCount,
    problems,
    testCount: sequence.length,
    usesThreeDigitTitles: sequence.some(({ info }) => info.width === 3),
  };
}

function applyEdits(source, edits) {
  const ordered = edits
    .filter(({ end, start, text }) => source.slice(start, end) !== text)
    .sort((left, right) => right.start - left.start || right.end - left.end);
  let previousStart = source.length;
  let output = source;
  for (const edit of ordered) {
    if (edit.end > previousStart) {
      throw new Error("Overlapping unit-test numbering edits");
    }
    output = `${output.slice(0, edit.start)}${edit.text}${output.slice(edit.end)}`;
    previousStart = edit.start;
  }
  return output;
}

function literalContentStart(sourceFile, node) {
  return node.getStart(sourceFile) + 1;
}

function fixStaticTitle(edits, sourceFile, node, renderedNumber) {
  const start = renderedStart(node);
  if (start === null) {
    return false;
  }
  const contentStart = literalContentStart(sourceFile, node);
  const prefix = start.match(/^\d+(?=$| - )/u);
  if (prefix) {
    edits.push({
      end: contentStart + prefix[0].length,
      start: contentStart,
      text: renderedNumber,
    });
  } else {
    const hasDescription = start.length > 0 || ts.isTemplateExpression(node);
    edits.push({
      end: contentStart,
      start: contentStart,
      text: `${renderedNumber}${hasDescription ? " - " : ""}`,
    });
  }
  return true;
}

function fixStaticLabel(edits, sourceFile, node, renderedLabel) {
  const start = renderedStart(node);
  if (start === null) {
    return false;
  }
  const contentStart = literalContentStart(sourceFile, node);
  const prefix = start.match(/^\d+\.\d+(?=$| - )/u);
  if (prefix) {
    edits.push({
      end: contentStart + prefix[0].length,
      start: contentStart,
      text: renderedLabel,
    });
    return true;
  }
  const partialPrefix = start.match(/^\d+\./u);
  const hasDescription =
    start.length > (partialPrefix?.[0].length ?? 0) ||
    ts.isTemplateExpression(node);
  edits.push({
    end: contentStart + (partialPrefix?.[0].length ?? 0),
    start: contentStart,
    text: `${renderedLabel}${hasDescription ? " - " : ""}`,
  });
  return true;
}

function escapeTemplateText(value) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("`", "\\`")
    .replaceAll("${", "\\${");
}

function fixDynamicLabel(
  edits,
  sourceFile,
  node,
  identifier,
  renderedAssertionNumber,
) {
  const dynamic = dynamicPrefix(node, "assertion");
  if (dynamic) {
    const [firstSpan] = node.templateSpans;
    const literalStart = firstSpan.literal.getStart(sourceFile);
    edits.push({
      end: firstSpan.expression.end,
      start: firstSpan.expression.getStart(sourceFile),
      text: identifier,
    });
    edits.push({
      end: literalStart + 2 + dynamic.assertionRendered.length,
      start: literalStart + 2,
      text: renderedAssertionNumber,
    });
    return true;
  }

  const renderedLabel = `\${${identifier}}.${renderedAssertionNumber}`;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    const existingPrefix = node.text.match(/^\d+\.\d+(?=$| - )/u);
    const description = existingPrefix
      ? node.text.slice(existingPrefix[0].length)
      : node.text
        ? ` - ${node.text}`
        : "";
    edits.push({
      end: node.end,
      start: node.getStart(sourceFile),
      text: `\`${renderedLabel}${escapeTemplateText(description)}\``,
    });
    return true;
  }
  if (ts.isTemplateExpression(node)) {
    const contentStart = literalContentStart(sourceFile, node);
    const start = node.head.text;
    const prefix = start.match(/^\d+\.\d+(?=$| - )/u);
    const partialPrefix = prefix ? null : start.match(/^\d+\./u);
    const consumed = prefix?.[0].length ?? partialPrefix?.[0].length ?? 0;
    const hasDescription = start.length > consumed || !prefix;
    edits.push({
      end: contentStart + consumed,
      start: contentStart,
      text: `${renderedLabel}${hasDescription ? " - " : ""}`,
    });
    return true;
  }
  return false;
}

function fixUnitTestNumbering(
  source,
  filename = "<source>",
  { requiredWidth: configuredWidth } = {},
) {
  const sourceFile = sourceFileFrom(source, filename);
  if (sourceFile.parseDiagnostics.length) {
    const audit = auditUnitTestNumbering(source, filename, {
      requiredWidth: configuredWidth,
    });
    return {
      ...audit,
      changed: false,
      requiredWidth: configuredWidth ?? 2,
      source,
    };
  }

  const bindings = assertionBindings(sourceFile);
  const tests = collectTests(sourceFile);
  const planned = [];
  let testCount = 0;
  for (const item of tests) {
    const title = item.call.arguments[0];
    if (item.info?.unsupported) {
      continue;
    }
    if (item.info?.identifier) {
      planned.push({ ...item, firstNumber: testCount + 1, kind: "dynamic" });
      testCount += item.info.numbers.length;
    } else if (title && renderedStart(title) !== null) {
      planned.push({ ...item, firstNumber: testCount + 1, kind: "static" });
      testCount += 1;
    }
  }

  const requiredWidth =
    configuredWidth ??
    (testCount >= 100 || tests.some(({ info }) => info?.width === 3) ? 3 : 2);
  const edits = [];
  for (const item of planned) {
    const renderedTestNumber = String(item.firstNumber).padStart(
      requiredWidth,
      "0",
    );
    if (item.kind === "dynamic") {
      edits.push({
        end: item.info.offsetNode.end,
        start: item.info.offsetNode.getStart(sourceFile),
        text: String(item.firstNumber),
      });
      edits.push({
        end: item.info.widthNode.end,
        start: item.info.widthNode.getStart(sourceFile),
        text: String(requiredWidth),
      });
    } else {
      fixStaticTitle(
        edits,
        sourceFile,
        item.call.arguments[0],
        renderedTestNumber,
      );
    }

    const callback = item.call.arguments[1];
    if (!callback) {
      continue;
    }
    let previousAssertionNumber = 0;
    function fixCallback(node) {
      if (node !== item.call && isNamedCall(node, "test")) {
        return;
      }
      if (isBoundCall(node, bindings.equal)) {
        const label = node.arguments[2];
        const existing = label ? labelInfo(label) : null;
        const assertionNumber =
          existing?.assertionNumber > previousAssertionNumber
            ? existing.assertionNumber
            : previousAssertionNumber + 1;
        const renderedAssertionNumber =
          existing?.assertionNumber === assertionNumber
            ? existing.assertionRendered
            : String(assertionNumber).padStart(2, "0");
        previousAssertionNumber = assertionNumber;
        if (label) {
          if (item.kind === "dynamic") {
            fixDynamicLabel(
              edits,
              sourceFile,
              label,
              item.info.identifier,
              renderedAssertionNumber,
            );
          } else {
            fixStaticLabel(
              edits,
              sourceFile,
              label,
              `${renderedTestNumber}.${renderedAssertionNumber}`,
            );
          }
        } else if (node.arguments.length >= 2) {
          const renderedLabel =
            item.kind === "dynamic"
              ? `\`\${${item.info.identifier}}.${renderedAssertionNumber}\``
              : `"${renderedTestNumber}.${renderedAssertionNumber}"`;
          edits.push({
            end: node.arguments[1].end,
            start: node.arguments[1].end,
            text: `, ${renderedLabel}`,
          });
        }
      }
      ts.forEachChild(node, fixCallback);
    }
    fixCallback(callback);
  }

  const fixedSource = applyEdits(source, edits);
  const audit = auditUnitTestNumbering(fixedSource, filename, {
    requiredWidth,
  });
  return {
    ...audit,
    changed: fixedSource !== source,
    requiredWidth,
    source: fixedSource,
  };
}

export { auditUnitTestNumbering, fixUnitTestNumbering };

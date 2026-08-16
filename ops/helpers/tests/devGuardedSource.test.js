import ts from "typescript";
import { test } from "uvu";
import { equal } from "uvu/assert";

import {
  isDevGuarded,
  isInside,
  locationAt,
  parseError,
  parseSourceFile,
  scriptKind,
} from "../devGuardedSource.js";

// the identifiers named `hit`, paired with whether a DEV guard encloses each
function guardedReads(sourceText) {
  const sourceFile = parseSourceFile(sourceText, "source.ts");
  const answers = [];
  (function walk(node) {
    if (ts.isIdentifier(node) && node.text === "hit") {
      answers.push(isDevGuarded(node));
    }
    ts.forEachChild(node, walk);
  })(sourceFile);
  return answers;
}

test("01 - reads the script kind from the file extension", () => {
  equal(scriptKind("a.tsx"), ts.ScriptKind.TSX, "01.01");
  equal(scriptKind("a.jsx"), ts.ScriptKind.JSX, "01.02");
  equal(scriptKind("a.js"), ts.ScriptKind.JS, "01.03");
  equal(scriptKind("a.mjs"), ts.ScriptKind.JS, "01.04");
  equal(scriptKind("a.ts"), ts.ScriptKind.TS, "01.05");
  // an unknown extension is read as TypeScript, which parses the widest
  equal(scriptKind("a"), ts.ScriptKind.TS, "01.06");
});

test("02 - parses with parent pointers set", () => {
  const sourceFile = parseSourceFile("let a = 1;", "source.ts");
  // every consumer walks upwards from an identifier, so a missing parent would
  // silently make every guard look absent
  equal(sourceFile.statements[0].parent === sourceFile, true, "02.01");
  equal(sourceFile.parseDiagnostics.length, 0, "02.02");
});

test("03 - recognises both forms the build strips", () => {
  equal(guardedReads("DEV && console.log(hit);"), [true], "03.01");
  equal(guardedReads("if (DEV) { console.log(hit); }"), [true], "03.02");
  // the guard has to be on the left: `hit && DEV` does not remove `hit`
  equal(guardedReads("hit && DEV;"), [false], "03.03");
  equal(guardedReads("console.log(hit);"), [false], "03.04");
  equal(guardedReads("if (other) { console.log(hit); }"), [false], "03.05");
  // the else branch survives the build even when the condition is DEV
  equal(
    guardedReads("if (DEV) { let a = 1; } else { console.log(hit); }"),
    [false],
    "03.06",
  );
});

test("04 - reads DEV through a conjunction and through wrappers", () => {
  equal(guardedReads("DEV && other && console.log(hit);"), [true], "04.01");
  equal(guardedReads("other && DEV && console.log(hit);"), [true], "04.02");
  equal(guardedReads("(DEV) && console.log(hit);"), [true], "04.03");
  equal(
    guardedReads("if ((DEV as boolean)) { console.log(hit); }"),
    [true],
    "04.04",
  );
  equal(guardedReads("DEV! && console.log(hit);"), [true], "04.05");
  // a name which merely contains DEV is a different variable
  equal(guardedReads("DEVELOPMENT && console.log(hit);"), [false], "04.06");
});

test("05 - reports a position as one-based line and column", () => {
  const sourceFile = parseSourceFile("let a = 1;\nlet b = 2;", "source.ts");
  equal(locationAt(sourceFile, 0), { column: 1, line: 1 }, "05.01");
  equal(locationAt(sourceFile, 11), { column: 1, line: 2 }, "05.02");
  equal(locationAt(sourceFile, 15), { column: 5, line: 2 }, "05.03");
});

test("06 - turns a parse diagnostic into a located problem", () => {
  const sourceFile = parseSourceFile("function ( { let", "source.ts");
  const [diagnostic] = sourceFile.parseDiagnostics;
  const problem = parseError(sourceFile, diagnostic);

  equal(problem.kind, "parse-error", "06.01");
  equal(problem.line, 1, "06.02");
  equal(
    typeof problem.message === "string" && problem.message.length > 0,
    true,
    "06.03",
  );
});

test("07 - answers containment from node positions", () => {
  const sourceFile = parseSourceFile("if (DEV) { let a = 1; }", "source.ts");
  const statement = sourceFile.statements[0];

  equal(isInside(statement.expression, statement), true, "07.01");
  equal(isInside(statement, statement.expression), false, "07.02");
  equal(isInside(statement, sourceFile), true, "07.03");
});

test.run();

import { test } from "uvu";
import { equal } from "uvu/assert";

import { auditDevOnlyImpureLocals } from "../devOnlyImpureLocals.js";

// the reported fields which matter; the message itself is prose
function found(source) {
  return auditDevOnlyImpureLocals(source).problems.map(
    ({ column, kind, line, name, reads }) => ({
      column,
      kind,
      line,
      name,
      reads,
    }),
  );
}

test("01 - flags a call-initialised local read only inside a DEV log", () => {
  const source = [
    "function scanner(str: string): boolean {",
    "  let hit = xBeforeYOnTheRight(str, 0);",
    `  DEV && console.log(\`003 \${hit}\`);`,
    "  return true;",
    "}",
  ].join("\n");

  equal(
    found(source),
    [
      {
        column: 7,
        kind: "dev-only-impure-local",
        line: 2,
        name: "hit",
        reads: 1,
      },
    ],
    "01.01",
  );
});

test("02 - accepts a local the surrounding code also reads", () => {
  const source = [
    "function scanner(str: string): boolean {",
    "  let hit = xBeforeYOnTheRight(str, 0);",
    `  DEV && console.log(\`003 \${hit}\`);`,
    "  return hit;",
    "}",
  ].join("\n");

  equal(
    auditDevOnlyImpureLocals(source),
    { checkedCount: 1, problems: [] },
    "02.01",
  );
});

test("03 - ignores a local whose initialiser calls nothing", () => {
  const source = [
    "function scanner(tag: Obj): boolean {",
    "  let plain = !tag.quotes;",
    `  DEV && console.log(\`003 \${plain}\`);`,
    "  return true;",
    "}",
  ].join("\n");

  equal(
    auditDevOnlyImpureLocals(source),
    { checkedCount: 0, problems: [] },
    "03.01",
  );
});

test("04 - ignores a declaration the DEV guard already removes", () => {
  const source = [
    "if (DEV) {",
    "  let hit = xBeforeYOnTheRight(str, 0);",
    `  console.log(\`003 \${hit}\`);`,
    "}",
  ].join("\n");

  equal(
    auditDevOnlyImpureLocals(source),
    { checkedCount: 0, problems: [] },
    "04.01",
  );
});

test("05 - ignores an exported constant, which is public API", () => {
  const source = [
    'export const notEmailFriendly = new Set(["AMP"]);',
    `DEV && console.log(\`002 \${notEmailFriendly.size}\`);`,
  ].join("\n");

  equal(
    auditDevOnlyImpureLocals(source),
    { checkedCount: 0, problems: [] },
    "05.01",
  );
});

test("06 - ignores a call the initialiser only defers into a function", () => {
  const source = [
    "function outer(): void {",
    "  let render = () => expensive();",
    `  DEV && console.log(\`003 \${render()}\`);`,
    "}",
  ].join("\n");

  equal(
    auditDevOnlyImpureLocals(source),
    { checkedCount: 0, problems: [] },
    "06.01",
  );
});

test("07 - flags a local read only inside a DEV if statement", () => {
  const source = [
    "function scanner(str: string): boolean {",
    "  let hit = xBeforeYOnTheRight(str, 0);",
    "  if (DEV) {",
    `    console.log(\`004 \${hit}\`);`,
    "  }",
    "  return true;",
    "}",
  ].join("\n");

  equal(
    found(source),
    [
      {
        column: 7,
        kind: "dev-only-impure-local",
        line: 2,
        name: "hit",
        reads: 1,
      },
    ],
    "07.01",
  );
});

test("08 - does not count a same-named property as a read", () => {
  const source = [
    "function scanner(str: string, out: Obj): boolean {",
    "  let charcode = str.charCodeAt(0);",
    `  DEV && console.log(\`003 \${charcode}\`);`,
    "  out.charcode = 1;",
    "  return true;",
    "}",
  ].join("\n");

  equal(
    found(source),
    [
      {
        column: 7,
        kind: "dev-only-impure-local",
        line: 2,
        name: "charcode",
        reads: 1,
      },
    ],
    "08.01",
  );
});

test("09 - counts an export specifier as a read outside the guard", () => {
  const source = [
    "const charcodes = collect();",
    `DEV && console.log(\`002 \${charcodes}\`);`,
    "export { charcodes };",
  ].join("\n");

  equal(
    auditDevOnlyImpureLocals(source),
    { checkedCount: 1, problems: [] },
    "09.01",
  );
});

test("10 - counts only reads in the scope the declaration binds", () => {
  const source = [
    "function first(str: string): boolean {",
    "  let hit = xBeforeYOnTheRight(str, 0);",
    `  DEV && console.log(\`003 \${hit}\`);`,
    "  return true;",
    "}",
    "function second(str: string): boolean {",
    "  let hit = xBeforeYOnTheRight(str, 1);",
    "  return hit;",
    "}",
  ].join("\n");

  // `hit` in the second function is a different variable, and reading it there
  // says nothing about the first one; names like `chunk` and `charcode` recur
  // across the scanning functions this gate exists for
  equal(
    found(source),
    [
      {
        column: 7,
        kind: "dev-only-impure-local",
        line: 2,
        name: "hit",
        reads: 1,
      },
    ],
    "10.01",
  );
});

test("11 - sees through shadowing to the declaration a read binds to", () => {
  const shadowed = [
    "function first(str: string): boolean {",
    "  let hit = xBeforeYOnTheRight(str, 0);",
    `  DEV && console.log(\`003 \${hit}\`);`,
    "  function inner(): boolean {",
    "    let hit = 1;",
    "    return hit > 0;",
    "  }",
    "  return inner();",
    "}",
  ].join("\n");
  // the same file with the shadowing declaration removed, so the inner read
  // does bind to the outer variable and the call is genuinely used
  const notShadowed = [
    "function first(str: string): boolean {",
    "  let hit = xBeforeYOnTheRight(str, 0);",
    `  DEV && console.log(\`003 \${hit}\`);`,
    "  function inner(): boolean {",
    "    return hit;",
    "  }",
    "  return inner();",
    "}",
  ].join("\n");

  // the inner `hit` is a different variable, so reading it says nothing about
  // the outer one, whose value still reaches only the DEV log
  equal(
    found(shadowed).map(({ line, name }) => ({ line, name })),
    [{ line: 2, name: "hit" }],
    "11.01",
  );
  equal(found(notShadowed), [], "11.02");
});

test("12 - reproduces and clears the shipped notWithinAttrQuotes defect", () => {
  const shipped = [
    "function notWithinAttrQuotes(tag: Obj, str: string, i: number): boolean {",
    '  let R2 = !xBeforeYOnTheRight(str, i + 1, tag.quotes.value, ">");',
    `  DEV && console.log(\`003 \${R2}\`);`,
    '  return !xBeforeYOnTheRight(str, i + 1, tag.quotes.value, ">");',
    "}",
  ].join("\n");
  const fixed = [
    "function notWithinAttrQuotes(tag: Obj, str: string, i: number): boolean {",
    "  let R1 = !tag?.quotes;",
    '  let R2 = !R1 && !xBeforeYOnTheRight(str, i + 1, tag.quotes.value, ">");',
    `  DEV && console.log(\`004 \${R1} \${R2}\`);`,
    "  return R1 || R2;",
    "}",
  ].join("\n");

  equal(
    found(shipped),
    [
      {
        column: 7,
        kind: "dev-only-impure-local",
        line: 2,
        name: "R2",
        reads: 1,
      },
    ],
    "12.01",
  );
  equal(found(fixed), [], "12.02");
});

test("13 - flags a destructured binding read only inside a DEV log", () => {
  const source = [
    "function scanner(str: string): boolean {",
    "  let { length: n } = str.split(',');",
    `  DEV && console.log(\`003 \${n}\`);`,
    "  return true;",
    "}",
  ].join("\n");

  equal(
    found(source),
    [
      {
        column: 7,
        kind: "dev-only-impure-local",
        line: 2,
        name: "n",
        reads: 1,
      },
    ],
    "13.01",
  );
});

test("14 - accepts a destructuring whose other binding is read outside", () => {
  const source = [
    "function scanner(str: string): string {",
    "  let [a, b] = str.split(',');",
    `  DEV && console.log(\`003 \${a}\`);`,
    "  return b;",
    "}",
  ].join("\n");

  // one call feeds every binding of the pattern, so it has to survive for `b`
  equal(
    auditDevOnlyImpureLocals(source),
    { checkedCount: 1, problems: [] },
    "14.01",
  );
});

test("15 - does not count a label or a destructuring key as a read", () => {
  const source = [
    "function scanner(str: string): boolean {",
    "  let hit = xBeforeYOnTheRight(str, 0);",
    `  DEV && console.log(\`003 \${hit}\`);`,
    "  hit: for (let i = 0; i < 2; i++) {",
    "    continue hit;",
    "  }",
    "  return true;",
    "}",
  ].join("\n");
  const key = [
    "function scanner(str: string): boolean {",
    "  let length = str.split(',');",
    `  DEV && console.log(\`003 \${length}\`);`,
    "  let { length: n } = str;",
    "  return n > 0;",
    "}",
  ].join("\n");

  equal(
    found(source).map(({ name }) => name),
    ["hit"],
    "15.01",
  );
  equal(
    found(key).map(({ name }) => name),
    ["length"],
    "15.02",
  );
});

test("16 - does not count overwriting a local as reading it", () => {
  // `hit = false` discards what the initialiser produced rather than using it,
  // so once the DEV log is stripped the call still ships for nothing - which is
  // exactly what this gate exists to catch. A later read of the overwritten
  // name is a real read, so it is the write standing alone which is the finding
  const overwritten = [
    "function scanner(str: string): boolean {",
    "  let hit = xBeforeYOnTheRight(str, 0);",
    `  DEV && console.log(\`003 \${hit}\`);`,
    "  hit = false;",
    "  return true;",
    "}",
  ].join("\n");
  // a compound assignment and an update both read the old value first, so the
  // initialiser's result is genuinely used
  const compound = [
    "function scanner(str: string): number {",
    "  let hit = countMatches(str, 0);",
    `  DEV && console.log(\`003 \${hit}\`);`,
    "  hit += 1;",
    "  return hit;",
    "}",
  ].join("\n");
  const updated = [
    "function scanner(str: string): number {",
    "  let hit = countMatches(str, 0);",
    `  DEV && console.log(\`003 \${hit}\`);`,
    "  hit++;",
    "  return hit;",
    "}",
  ].join("\n");

  equal(
    found(overwritten).map(({ name }) => name),
    ["hit"],
    "16.01",
  );
  equal(found(compound), [], "16.02");
  equal(found(updated), [], "16.03");
});

test("17 - binds a var to its static block or namespace, not to the file", () => {
  // a `var` in either binds to that container, so an unrelated same-named read
  // outside it is a different variable and must not excuse this one
  const staticBlock = [
    "class C {",
    "  static {",
    "    var hit = xBeforeYOnTheRight('a', 0);",
    `    DEV && console.log(\`003 \${hit}\`);`,
    "  }",
    "}",
    "function other(): boolean {",
    "  return hit;",
    "}",
  ].join("\n");
  const namespaced = [
    "namespace N {",
    "  var hit = xBeforeYOnTheRight('a', 0);",
    `  DEV && console.log(\`003 \${hit}\`);`,
    "}",
    "function other(): boolean {",
    "  return hit;",
    "}",
  ].join("\n");
  // a `var` still reaches the whole function it sits in, so a read there counts
  const hoisted = [
    "function scanner(str: string): boolean {",
    "  if (str) {",
    "    var hit = xBeforeYOnTheRight(str, 0);",
    `    DEV && console.log(\`003 \${hit}\`);`,
    "  }",
    "  return hit;",
    "}",
  ].join("\n");

  equal(
    found(staticBlock).map(({ name }) => name),
    ["hit"],
    "17.01",
  );
  equal(
    found(namespaced).map(({ name }) => name),
    ["hit"],
    "17.02",
  );
  equal(found(hoisted), [], "17.03");
});

test("18 - counts a shorthand property as a read of the local", () => {
  // `return { result }` names the local, but asking the binder about that
  // identifier gives the object's property instead; taking that answer would
  // report the call as dead while its value is returned to the caller. This is
  // the shape shipped in packages/html-table-patcher/src/main.ts.
  const returned = [
    "function patcher(str: string): { result: string } {",
    "  const result = rApply(str, 0);",
    `  DEV && console.log(\`003 \${result}\`);`,
    "  return { result };",
    "}",
  ].join("\n");
  // a shorthand whose local is read nowhere else is still a finding when the
  // object itself never escapes the DEV guard
  const guarded = [
    "function patcher(str: string): boolean {",
    "  const result = rApply(str, 0);",
    `  DEV && console.log(\`003 \${JSON.stringify({ result })}\`);`,
    "  return true;",
    "}",
  ].join("\n");

  equal(found(returned), [], "18.01");
  equal(
    found(guarded).map(({ name }) => name),
    ["result"],
    "18.02",
  );
});

test("19 - flags a freestanding call chain with DEV-only callback work", () => {
  const source = [
    "function render(str: string, ranges: Ranges): string {",
    '  rApply(str, ranges.current()).split("").forEach((char) => {',
    "    DEV && console.log(char);",
    "  });",
    "  return rApply(str, ranges.current());",
    "}",
  ].join("\n");
  const result = auditDevOnlyImpureLocals(source);

  equal(result.checkedCount, 0, "19.01");
  equal(
    result.problems.map(({ column, kind, line, method }) => ({
      column,
      kind,
      line,
      method,
    })),
    [
      {
        column: 3,
        kind: "dev-only-impure-expression",
        line: 2,
        method: "forEach",
      },
    ],
    "19.02",
  );
});

test("20 - accepts call chains removed wholly by a DEV guard", () => {
  const logicalGuard = [
    "function render(result: string): void {",
    '  DEV && result.split("").forEach((char) => {',
    "    console.log(char);",
    "  });",
    "}",
  ].join("\n");
  const ifGuard = [
    "function render(result: string): void {",
    "  if (DEV) {",
    '    result.split("").forEach((char) => {',
    "      console.log(char);",
    "    });",
    "  }",
    "}",
  ].join("\n");

  equal(found(logicalGuard), [], "20.01");
  equal(found(ifGuard), [], "20.02");
});

test("21 - accepts a callback with production effects", () => {
  const source = [
    "function collect(chars: string[], output: string[]): void {",
    "  chars.forEach((char) => {",
    "    output.push(char);",
    "    DEV && console.log(char);",
    "  });",
    "}",
  ].join("\n");

  equal(found(source), [], "21.01");
});

test("22 - recognises both supported DEV guard forms in callbacks", () => {
  const source = [
    "function render(chars: string[]): void {",
    "  chars.forEach((char) => DEV && console.log(char));",
    "  chars.forEach(function (char) {",
    "    if (DEV) {",
    "      console.log(char);",
    "    }",
    "  });",
    "}",
  ].join("\n");

  equal(
    auditDevOnlyImpureLocals(source).problems.map(({ kind, line }) => ({
      kind,
      line,
    })),
    [
      { kind: "dev-only-impure-expression", line: 2 },
      { kind: "dev-only-impure-expression", line: 3 },
    ],
    "22.01",
  );
});

test("23 - ignores callbacks with no DEV work or only deferred DEV work", () => {
  const empty = [
    "function render(chars: string[]): void {",
    "  chars.forEach(() => {});",
    "}",
  ].join("\n");
  const deferred = [
    "function render(chars: string[]): void {",
    "  chars.forEach(() => {",
    "    function debug(): void {",
    "      DEV && console.log('debug');",
    "    }",
    "  });",
    "}",
  ].join("\n");

  equal(found(empty), [], "23.01");
  equal(found(deferred), [], "23.02");
});

test.run();

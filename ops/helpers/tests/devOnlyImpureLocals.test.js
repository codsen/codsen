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

test("11 - lets shadowing inside the same scope hide a finding", () => {
  const source = [
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

  // a read inside the declaration's own scope still counts however it binds, so
  // shadowing suppresses a report rather than inventing one, which is the safe
  // direction for a gate that fails a hosted build
  equal(
    auditDevOnlyImpureLocals(source),
    { checkedCount: 1, problems: [] },
    "11.01",
  );
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

test.run();

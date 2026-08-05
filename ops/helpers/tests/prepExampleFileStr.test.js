// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { prepExampleFileStr } from "../prepExampleFileStr.js";

// throws

test(`01 - no "import"`, () => {
  throws(() => {
    prepExampleFileStr(`zzz`);
  });
});

// B.A.U.

test(`02 - title, import`, () => {
  let source = `// Quick Take

import { strict as assert } from "assert";\n\n`;
  let str = `import { strict as assert } from "assert";`;
  equal(prepExampleFileStr(source), { str, title: `Quick Take` });
});

test(`03 - title, import`, () => {
  let source = `\n\n// Quick Take



import { strict as assert } from "assert";\n\n`;
  let str = `import { strict as assert } from "assert";`;
  equal(prepExampleFileStr(source), { str, title: `Quick Take` });
});

test(`03 - biome configs, title, import`, () => {
  let source = `\n\n// biome-ignore-all lint/correctness/noUnusedImports: example file
// Quick Take

import { strict as assert } from "assert";\n\n`;
  let str = `import { strict as assert } from "assert";`;
  equal(prepExampleFileStr(source), { str, title: `Quick Take` });
});

test(`04 - title, biome configs, import`, () => {
  let source = `// Quick Take

// biome-ignore lint/correctness/noUnusedImports: example file

// biome-ignore lint/correctness/noUnusedVariables: example file

import { strict as assert } from "assert";\n\n`;
  let str = `import { strict as assert } from "assert";`;
  equal(prepExampleFileStr(source), { str, title: `Quick Take` });
});

test(`05 - single-line local import`, () => {
  let source = `// \`allNamedEntities\`

import { strict as assert } from "assert";

import { allNamedEntities } from "../dist/all-named-html-entities.esm.js";

// total named entities count:
assert.equal(Object.keys(allNamedEntities).length, 2125);`;

  let str = `import { strict as assert } from "assert";

import { allNamedEntities } from "all-named-html-entities";

// total named entities count:
assert.equal(Object.keys(allNamedEntities).length, 2125);`;

  equal(prepExampleFileStr(source), {
    str,
    title: "`allNamedEntities`",
  });
});

test(`06 - multi-line local import`, () => {
  let source = `// \`allNamedEntities\`

import { strict as assert } from "assert";

import {
  a,
  b,
  c,
  d,
} from "../dist/all-named-html-entities.esm.js";

// total named entities count:
assert.equal(Object.keys(allNamedEntities).length, 2125);`;

  let str = `import { strict as assert } from "assert";

import {
  a,
  b,
  c,
  d,
} from "all-named-html-entities";

// total named entities count:
assert.equal(Object.keys(allNamedEntities).length, 2125);`;

  equal(prepExampleFileStr(source), {
    str,
    title: "`allNamedEntities`",
  });
});

test(`07 - import, title, no biome configs`, () => {
  let source = `import { strict as assert } from "assert";\n\n// Quick Take\n\nconst z = 1;`;
  let str = `import { strict as assert } from "assert";\n\nconst z = 1;`;
  equal(prepExampleFileStr(source), { str, title: "Quick Take" });
});

test.run();

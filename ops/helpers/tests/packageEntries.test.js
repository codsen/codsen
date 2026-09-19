import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { rollup } from "rollup";
import ts from "typescript";
import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import { declarationEntries } from "../declarationEntries.js";
import { libraryEntries, rootExport } from "../packageEntries.js";

const root = {
  types: "./types/index.d.ts",
  script: "./dist/fixture.umd.js",
  default: "./dist/fixture.esm.js",
};

function manifest() {
  return {
    name: "fixture",
    exports: {
      ".": root,
      "./traverse": {
        types: "./types/traverse.d.ts",
        default: "./dist/traverse.esm.js",
      },
    },
  };
}

test("01 - flat and nested roots retain the same script capability", () => {
  equal(rootExport({ exports: root }), root, "01.01");
  equal(rootExport(manifest()), root, "01.02");
  equal(
    libraryEntries(manifest()).map(({ source }) => source),
    ["src/main.ts", "src/traverse.ts"],
    "01.03",
  );
  equal(
    libraryEntries({ name: "fixture", exports: root })[0].default,
    root.default,
    "01.04",
  );
});

test("02 - subpaths reject ambiguous sources and escaped output paths", () => {
  throws(
    () => libraryEntries({ name: "fixture", exports: { "./traverse": root } }),
    /root entry/u,
    "02.01",
  );
  throws(
    () =>
      libraryEntries({
        name: "fixture",
        exports: { ".": root, "../outside": root },
      }),
    /unsupported library subpath/u,
    "02.02",
  );
  throws(
    () =>
      libraryEntries({
        name: "fixture",
        exports: { default: "./dist/../outside.js" },
      }),
    /file in dist/u,
    "02.03",
  );
  throws(
    () =>
      libraryEntries({
        name: "fixture",
        exports: { ".": root, "./traverse": root },
      }),
    /duplicate library output/u,
    "02.04",
  );
});

test("03 - generated declaration facades retain canonical unique symbol identity", async () => {
  const directory = mkdtempSync(path.join(tmpdir(), "declaration-entries-"));
  try {
    mkdirSync(path.join(directory, "src"));
    writeFileSync(
      path.join(directory, "package.json"),
      JSON.stringify({ ...manifest(), type: "module" }),
    );
    writeFileSync(
      path.join(directory, "src/traverse.ts"),
      'export const DELETE: unique symbol = Symbol.for("fixture.delete");\nexport type Callback = () => typeof DELETE;\nexport function traverse(callback: Callback) { return callback(); }\n',
    );
    writeFileSync(
      path.join(directory, "src/main.ts"),
      'export { DELETE, traverse } from "./traverse.js";\nexport type { Callback } from "./traverse.js";\nexport const helper = true;\n',
    );
    for (const config of declarationEntries(manifest())) {
      const bundle = await rollup({
        ...config,
        input: path.join(directory, config.input),
      });
      try {
        await bundle.write({
          ...config.output[0],
          file: path.join(directory, config.output[0].file),
        });
      } finally {
        await bundle.close();
      }
    }
    const rootTypes = readFileSync(
      path.join(directory, "types/index.d.ts"),
      "utf8",
    );
    const slimTypes = readFileSync(
      path.join(directory, "types/traverse.d.ts"),
      "utf8",
    );
    equal(rootTypes.includes("unique symbol"), true, "03.01");
    equal(rootTypes.includes('from "./'), false, "03.02");
    equal(slimTypes.includes("unique symbol"), false, "03.03");
    match(slimTypes, /from "\.\/index\.js"/u, "03.04");

    const consumer = path.join(directory, "consumer.ts");
    writeFileSync(
      consumer,
      'import { DELETE as ROOT, type Callback as RootCallback } from "fixture";\nimport { DELETE as SUB, type Callback as SubCallback } from "fixture/traverse";\nconst root: typeof ROOT = SUB;\nconst sub: typeof SUB = ROOT;\nconst rootCallback: RootCallback = () => SUB;\nconst subCallback: SubCallback = () => ROOT;\nvoid [root, sub, rootCallback, subCallback];\n',
    );
    const program = ts.createProgram([consumer], {
      strict: true,
      skipLibCheck: false,
      noEmit: true,
      types: [],
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      target: ts.ScriptTarget.ES2022,
    });
    equal(
      ts
        .getPreEmitDiagnostics(program)
        .map((diagnostic) =>
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
        ),
      [],
      "03.05",
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test.run();

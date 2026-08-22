import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { test } from "uvu";
import { equal, match } from "uvu/assert";

import {
  groupCompatibleConfigs,
  readTypeScriptConfig,
  typecheckWorkspaces,
} from "../workspaceTypecheck.js";

function write(root, relative, contents) {
  const filename = path.join(root, relative);
  mkdirSync(path.dirname(filename), { recursive: true });
  writeFileSync(filename, contents);
  return filename;
}

test("01 - groups compatible configs and reports their combined diagnostics", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "codsen-typecheck-"));
  try {
    const options = JSON.stringify({
      compilerOptions: {
        module: "esnext",
        noEmit: true,
        strict: true,
        target: "es2020",
      },
      include: ["src/**/*.ts"],
    });
    const firstConfig = write(fixture, "first/tsconfig.json", options);
    const secondConfig = write(fixture, "second/tsconfig.json", options);
    write(fixture, "first/src/main.ts", "export const first: string = 'ok';\n");
    write(fixture, "second/src/main.ts", "export const second: string = 1;\n");

    const configs = [firstConfig, secondConfig].map(readTypeScriptConfig);
    equal(groupCompatibleConfigs(configs).length, 1, "01.01");

    const result = typecheckWorkspaces([firstConfig, secondConfig]);
    equal(result.configCount, 2, "01.02");
    equal(result.groupCount, 1, "01.03");
    equal(result.diagnostics.length, 1, "01.04");
    match(
      result.diagnostics[0].messageText,
      /not assignable to type 'string'/,
      "01.05",
    );
  } finally {
    rmSync(fixture, { force: true, recursive: true });
  }
});

test("02 - keeps incompatible module profiles in separate programs", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "codsen-typecheck-"));
  try {
    const firstConfig = write(
      fixture,
      "first/tsconfig.json",
      JSON.stringify({ compilerOptions: { module: "esnext" } }),
    );
    const secondConfig = write(
      fixture,
      "second/tsconfig.json",
      JSON.stringify({ compilerOptions: { module: "nodenext" } }),
    );
    write(fixture, "first/index.ts", "export {};\n");
    write(fixture, "second/index.ts", "export {};\n");
    equal(
      groupCompatibleConfigs(
        [firstConfig, secondConfig].map(readTypeScriptConfig),
      ).length,
      2,
      "02.01",
    );
  } finally {
    rmSync(fixture, { force: true, recursive: true });
  }
});

test.run();

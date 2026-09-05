import { test } from "uvu";
import { equal } from "uvu/assert";
import { normalisePackageJson } from "../../lect/plugins/pack.js";
import { PACKAGE_KINDS } from "../packageKinds.js";

test("01 - extras add new commands and append existing commands for both kinds", () => {
  for (const packageKind of [
    PACKAGE_KINDS.CLI,
    PACKAGE_KINDS.TYPESCRIPT_LIBRARY,
  ]) {
    const preset = { build: "node build.js", perf: "echo skip" };
    const state = {
      packageKind,
      pack: { name: "example", version: "1.0.0", scripts: { ...preset } },
    };
    const result = normalisePackageJson({
      state,
      lectrc: {
        scripts: { cli: preset, rollup: preset },
        scripts_extras: {
          example: { build: "node verify.js", generate: "node generate.js" },
        },
      },
      rootPackageJSON: {},
      coveragePolicy: { profiles: { default: {} } },
    });
    equal(
      result.scripts,
      {
        build: "node build.js && node verify.js",
        generate: "node generate.js",
        perf: "echo skip",
      },
      "01.01",
    );
    equal(state.pack.scripts, preset, "01.02");
    equal(preset.build, "node build.js", "01.03");
  }
});

test.run();

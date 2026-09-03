import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function fail(message) {
  throw new Error(message);
}

function readJson(filename) {
  return JSON.parse(readFileSync(filename, "utf8"));
}

function writeJson(filename, value) {
  writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`);
}

function assertIncludes(haystack, needle, message) {
  if (!haystack.includes(needle)) {
    fail(message);
  }
}

const FUNCTIONAL_CLI_SMOKES = Object.freeze({
  codsen({ run }) {
    const result = run([]);
    assertIncludes(
      result.stdout,
      "C O D S E N",
      "codsen did not start normally",
    );
  },

  "csv-sort-cli"({ cwd, run }) {
    const original = `Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`;
    writeFileSync(path.join(cwd, "input records.csv"), original);
    run(["input records.csv"]);
    const output = readFileSync(path.join(cwd, "input records-1.csv"), "utf8");
    if (output.indexOf("Bought table") > output.indexOf("Bought carpet")) {
      fail("csv-sort-cli did not sort the fixture");
    }
  },

  "email-all-chars-within-ascii-cli"({ cwd, run }) {
    writeFileSync(path.join(cwd, "healthy email.html"), "<p>ASCII only</p>\n");
    const result = run(["healthy email.html"]);
    assertIncludes(
      result.stdout,
      "ALL OK",
      "ASCII checker rejected ASCII input",
    );
  },

  "generate-atomic-css-cli"({ cwd, run }) {
    const fixture = `/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pt$$$ { padding-top: $$$px !important; } | 0 | 2 |
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
old
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
`;
    const filename = path.join(cwd, "index fixture.html");
    writeFileSync(filename, fixture);
    run(["index fixture.html"]);
    assertIncludes(
      readFileSync(filename, "utf8"),
      ".pt2 { padding-top: 2px !important; }",
      "generate-atomic-css-cli did not generate the fixture classes",
    );
  },

  "js-row-num-cli"({ cwd, run }) {
    const filename = path.join(cwd, "sample rows.js");
    writeFileSync(
      filename,
      "console.log('999 first');\nconsole.log('999 second');\n",
    );
    run(["sample rows.js"]);
    const output = readFileSync(filename, "utf8");
    assertIncludes(output, "001 first", "js-row-num-cli missed row one");
    assertIncludes(output, "002 second", "js-row-num-cli missed row two");
  },

  "json-comb"({ cwd, run }) {
    writeJson(path.join(cwd, "first input.json"), { a: "one" });
    writeJson(path.join(cwd, "second input.json"), { b: "two" });
    run(["--normalise", "first input.json", "second input.json"]);
    for (const filename of ["first input.json", "second input.json"]) {
      const keys = Object.keys(readJson(path.join(cwd, filename))).sort();
      if (JSON.stringify(keys) !== JSON.stringify(["a", "b"])) {
        fail(`json-comb did not normalise ${filename}`);
      }
    }
  },

  "json-sort-cli"({ cwd, run }) {
    const filename = path.join(cwd, "sort me.json");
    writeFileSync(filename, '{"z":1,"a":2}\n');
    run(["sort me.json"]);
    const output = readFileSync(filename, "utf8");
    if (output.indexOf('"a"') > output.indexOf('"z"')) {
      fail("json-sort-cli did not sort the fixture keys");
    }

    const piped = run([], { input: '{"z":1,"a":2}\n' });
    if (piped.stdout !== '{\n  "a": 2,\n  "z": 1\n}\n') {
      fail("json-sort-cli did not print canonical piped JSON to stdout");
    }
    if (piped.stderr) {
      fail("json-sort-cli mixed diagnostics into piped JSON output");
    }
  },

  "lerna-clean-changelogs-cli"({ cwd, run }) {
    const filename = path.join(cwd, "changelog.md");
    const fixture = `# Change Log

## 2.0.1 (2020-01-02)

**Note:** Version bump only for package fixture

## 2.0.0 (2020-01-01)

### Features

- useful change
`;
    writeFileSync(filename, fixture);
    run(["changelog.md"]);
    const output = readFileSync(filename, "utf8");
    if (output === fixture || output.includes("Version bump only")) {
      fail("lerna-clean-changelogs-cli did not clean the fixture");
    }
  },

  "update-versions"({ cwd, run }) {
    const filename = path.join(cwd, "package.json");
    const dependencyDirectory = path.join(
      cwd,
      "local packages",
      "fixture dependency",
    );
    mkdirSync(dependencyDirectory, { recursive: true });
    writeJson(path.join(dependencyDirectory, "package.json"), {
      name: "fixture-dependency",
      version: "2.0.0",
      private: true,
    });
    writeJson(filename, {
      name: "update-versions-node18-smoke",
      version: "1.0.0",
      private: true,
      dependencies: { "fixture-dependency": "^1.0.0" },
    });
    run([]);
    if (readJson(filename).dependencies["fixture-dependency"] !== "^2.0.0") {
      fail("update-versions did not update the local dependency fixture");
    }
  },
});

function cliNames(clis) {
  if (
    !Array.isArray(clis) ||
    clis.some(
      (cli) =>
        !cli ||
        typeof cli !== "object" ||
        typeof cli.name !== "string" ||
        !cli.name,
    )
  ) {
    fail("CLI smoke inventory must contain named CLI records");
  }
  return clis.map(({ name }) => name).sort();
}

function assertFunctionalCliSmokeCoverage(clis) {
  const missing = cliNames(clis).filter(
    (name) => !Object.hasOwn(FUNCTIONAL_CLI_SMOKES, name),
  );
  if (missing.length > 0) {
    fail(
      `No meaningful packed-artifact smoke test is registered for ${missing.join(", ")}`,
    );
  }
}

function assertFunctionalCliSmokeInventory(clis) {
  assertFunctionalCliSmokeCoverage(clis);
  const registered = Object.keys(FUNCTIONAL_CLI_SMOKES).sort();
  const discovered = cliNames(clis);
  if (JSON.stringify(registered) !== JSON.stringify(discovered)) {
    fail(
      "Meaningful smoke-test registrations do not match the discovered CLIs",
    );
  }
}

function runFunctionalCliSmoke({ consumerDirectory, cli, runBinary } = {}) {
  if (typeof consumerDirectory !== "string" || !consumerDirectory) {
    fail("Functional CLI smoke requires a consumer directory");
  }
  assertFunctionalCliSmokeCoverage([cli]);
  if (
    !cli.bins ||
    typeof cli.bins !== "object" ||
    Array.isArray(cli.bins) ||
    Object.keys(cli.bins).length === 0
  ) {
    fail(`${cli.name} functional smoke requires installed bin metadata`);
  }
  if (typeof runBinary !== "function") {
    fail(`${cli.name} functional smoke requires a binary runner`);
  }
  const cwd = path.join(
    consumerDirectory,
    "cli smokes",
    cli.name.replaceAll("/", "-"),
    "functional fixture",
  );
  mkdirSync(cwd, { recursive: true });
  const alias = Object.keys(cli.bins)[0];
  FUNCTIONAL_CLI_SMOKES[cli.name]({
    cwd,
    run(args, { input } = {}) {
      return runBinary({ alias, args, cwd, input });
    },
  });
}

export {
  assertFunctionalCliSmokeCoverage,
  assertFunctionalCliSmokeInventory,
  FUNCTIONAL_CLI_SMOKES,
  runFunctionalCliSmoke,
};

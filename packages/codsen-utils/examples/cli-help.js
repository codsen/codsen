// Assemble CLI help text

import { strict as assert } from "node:assert";

import { codsenCLI } from "../dist/codsen-utils.esm.js";

const result = codsenCLI(
  `
    Usage
      $ demo <file>
  `,
  {
    argv: [],
    autoHelp: false,
    autoVersion: false,
    description: "Process a file",
    helpIndent: 4,
    pkg: { name: "demo-cli", version: "1.0.0", bin: "cli.js" },
    version: "2.0.0",
  },
);

assert.equal(result.help.includes("    Process a file"), true);
assert.equal(result.help.includes("    Usage"), true);
assert.equal(result.pkg.name, "demo-cli");

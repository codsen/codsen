import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  locatePairedNpmCli,
  npmVersion,
} from "../../scripts/verify-root-toolchain.js";

test("01 - finds an explicit npm CLI before inferred paired layouts", () => {
  const checked = [];
  const npmCli = locatePairedNpmCli("C:\\runtime\\node.exe", {
    exists: (candidate) => {
      checked.push(candidate);
      return candidate === "D:\\global npm\\npm\\bin\\npm-cli.js";
    },
    explicitNpmCli: "D:\\global npm\\npm\\bin\\npm-cli.js",
    platform: "win32",
  });

  equal(npmCli, "D:\\global npm\\npm\\bin\\npm-cli.js", "01.01");
  equal(checked, [npmCli], "01.02");
});

test("02 - invokes the paired npm JavaScript CLI through the selected Node", () => {
  let spawnCall;
  const version = npmVersion({
    locateNpm: (nodeExecutable) => {
      equal(nodeExecutable, "/runtime with spaces/bin/node", "02.01");
      return "/runtime with spaces/npm/bin/npm-cli.js";
    },
    nodeExecutable: "/runtime with spaces/bin/node",
    spawn: (command, args, options) => {
      spawnCall = { args, command, options };
      return { status: 0, stderr: "", stdout: "11.16.0\n" };
    },
  });

  equal(version, "11.16.0", "02.02");
  equal(spawnCall.command, "/runtime with spaces/bin/node", "02.03");
  equal(
    spawnCall.args,
    ["/runtime with spaces/npm/bin/npm-cli.js", "--version"],
    "02.04",
  );
  equal(spawnCall.options.shell, false, "02.05");
});

test("03 - reports missing npm and process failures with checked paths", () => {
  throws(
    () =>
      locatePairedNpmCli("/runtime/bin/node", {
        exists: () => false,
        explicitNpmCli: "/controlled npm/npm-cli.js",
        platform: "linux",
      }),
    /checked \/controlled npm\/npm-cli\.js, \/runtime\/lib\/node_modules\/npm\/bin\/npm-cli\.js/,
    "03.01",
  );
  throws(
    () =>
      npmVersion({
        locateNpm: () => "/runtime/npm-cli.js",
        nodeExecutable: "/runtime/node",
        spawn: () => ({
          error: undefined,
          status: 1,
          stderr: "npm failed",
          stdout: "",
        }),
      }),
    /paired with \/runtime\/node.*using \/runtime\/npm-cli\.js: npm failed/,
    "03.02",
  );
  throws(
    () =>
      npmVersion({
        locateNpm: () => "/runtime/npm-cli.js",
        nodeExecutable: "/runtime/node",
        spawn: () => ({ status: 0, stderr: "", stdout: "" }),
      }),
    /npm returned no version/,
    "03.03",
  );
});

test("04 - static npm spec mode remains independent of the running npm", () => {
  const script = fileURLToPath(
    new URL("../../scripts/verify-root-toolchain.js", import.meta.url),
  );
  const result = spawnSync(process.execPath, [script, "--npm-spec"], {
    encoding: "utf8",
  });

  equal(result.status, 0, "04.01");
  equal(result.stdout.trim(), "npm@11.16.0", "04.02");
  equal(result.stderr, "", "04.03");
});

test.run();

import path from "node:path";

import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  installedPackageBinInvocation,
  pairedNpmCliCandidates,
} from "../nodeProcessInvocation.js";

test("01 - orders paired npm layouts by platform and honors an explicit path", () => {
  equal(
    pairedNpmCliCandidates("/runtime/bin/node", "linux"),
    [
      "/runtime/lib/node_modules/npm/bin/npm-cli.js",
      "/runtime/bin/node_modules/npm/bin/npm-cli.js",
    ],
    "01.01",
  );
  equal(
    pairedNpmCliCandidates("C:\\runtime\\node.exe", "win32"),
    [
      "C:\\runtime\\node_modules\\npm\\bin\\npm-cli.js",
      "C:\\lib\\node_modules\\npm\\bin\\npm-cli.js",
    ],
    "01.02",
  );
  equal(
    pairedNpmCliCandidates(
      "C:\\runtime\\node.exe",
      "win32",
      "D:\\global npm\\npm\\bin\\npm-cli.js",
    ),
    [
      "D:\\global npm\\npm\\bin\\npm-cli.js",
      "C:\\runtime\\node_modules\\npm\\bin\\npm-cli.js",
      "C:\\lib\\node_modules\\npm\\bin\\npm-cli.js",
    ],
    "01.03",
  );
});

test("02 - constructs platform-specific installed bin invocations", () => {
  equal(
    installedPackageBinInvocation({
      alias: "example-tool",
      args: ["--input", "fixture with spaces.csv"],
      consumerDirectory: "/tmp/consumer with spaces",
      platform: "linux",
    }),
    {
      args: ["--input", "fixture with spaces.csv"],
      command: path.posix.resolve(
        "/tmp/consumer with spaces",
        "node_modules/.bin/example-tool",
      ),
      filename: path.posix.resolve(
        "/tmp/consumer with spaces",
        "node_modules/.bin/example-tool",
      ),
      shell: false,
    },
    "02.01",
  );
  equal(
    installedPackageBinInvocation({
      alias: "example-tool",
      args: ["--input", "fixture with spaces.csv"],
      consumerDirectory: "C:\\temp\\consumer with spaces",
      platform: "win32",
    }),
    {
      args: [],
      command:
        '"C:\\temp\\consumer with spaces\\node_modules\\.bin\\example-tool.cmd" --input "fixture with spaces.csv"',
      filename:
        "C:\\temp\\consumer with spaces\\node_modules\\.bin\\example-tool.cmd",
      shell: true,
    },
    "02.02",
  );
});

test("03 - rejects unsafe paths, aliases, and argument collections", () => {
  throws(
    () => pairedNpmCliCandidates("", "linux"),
    /nodeExecutable must be a non-empty path/,
    "03.01",
  );
  throws(
    () => pairedNpmCliCandidates("/runtime/node", "linux", ""),
    /explicitNpmCli must be a non-empty path/,
    "03.02",
  );
  throws(
    () =>
      installedPackageBinInvocation({
        alias: "../example",
        args: [],
        consumerDirectory: "/tmp/consumer",
      }),
    /Unsafe installed package bin alias/,
    "03.03",
  );
  throws(
    () =>
      installedPackageBinInvocation({
        alias: "example",
        args: ["--help", 1],
        consumerDirectory: "/tmp/consumer",
      }),
    /args must be an array of strings/,
    "03.04",
  );
  throws(
    () =>
      installedPackageBinInvocation({
        alias: "example",
        args: [],
        consumerDirectory: "bad\0path",
      }),
    /consumerDirectory must be a non-empty path/,
    "03.05",
  );
  throws(
    () =>
      installedPackageBinInvocation({
        alias: "example",
        args: ["fixture & whoami.csv"],
        consumerDirectory: "C:\\consumer with spaces",
        platform: "win32",
      }),
    /unsafe Windows cmd metacharacters/,
    "03.06",
  );
  throws(
    () =>
      installedPackageBinInvocation({
        alias: "example",
        args: ["--help"],
        consumerDirectory: "C:\\consumer %TEMP%",
        platform: "win32",
      }),
    /unsafe Windows cmd expansion characters/,
    "03.07",
  );
});

test.run();

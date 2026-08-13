import { test } from "uvu";
import { equal, match } from "uvu/assert";

import { rootToolchainPolicy } from "../rootToolchain.js";

function policy(overrides = {}) {
  return rootToolchainPolicy({
    actualNodeVersion: "24.19.0",
    actualNpmVersion: "11.16.0",
    lockRoot: {
      engines: { node: ">=24.19.0", npm: ">=11.16.0" },
    },
    manifest: {
      engines: { node: ">=24.19.0", npm: ">=11.16.0" },
      packageManager: "npm@11.16.0",
    },
    nodeVersionSource: "24.19.0\n",
    ...overrides,
  });
}

test("01 - accepts one exact, aligned root toolchain policy", () => {
  const result = policy();

  equal(result.errors, [], "01.01");
  equal(result.nodeVersion, "24.19.0", "01.02");
  equal(result.npmVersion, "11.16.0", "01.03");
  equal(result.npmSpec, "npm@11.16.0", "01.04");
});

test("02 - rejects floating or malformed tool selections", () => {
  const result = policy({
    manifest: {
      engines: { node: ">=24", npm: ">=11" },
      packageManager: "pnpm@11.16.0",
    },
    nodeVersionSource: "24",
  });
  const message = result.errors.join("\n");

  match(message, /\.node-version must be an exact x\.y\.z version/, "02.01");
  match(message, /packageManager must select npm/, "02.02");
});

test("03 - reports manifest and lockfile declaration drift", () => {
  const result = policy({
    lockRoot: {
      engines: { node: ">=24.19.0", npm: ">=11.16.0" },
    },
    manifest: {
      engines: { node: ">=24", npm: ">=11.10.0" },
      packageManager: "npm@11.16.0",
    },
  });
  const message = result.errors.join("\n");

  match(message, /engines\.node must mirror \.node-version/, "03.01");
  match(message, /engines\.npm must mirror packageManager/, "03.02");
  match(message, /package-lock root engines\.node/, "03.03");
  match(message, /package-lock root engines\.npm/, "03.04");
});

test("04 - rejects same-major runtime patch drift", () => {
  const result = policy({
    actualNodeVersion: "24.19.1",
    actualNpmVersion: "11.16.1",
  });
  const message = result.errors.join("\n");

  match(message, /running Node 24\.19\.1.*pinned 24\.19\.0/, "04.01");
  match(message, /running npm 11\.16\.1.*pinned 11\.16\.0/, "04.02");
});

test("05 - static policy checks do not require a running toolchain", () => {
  const result = policy({
    actualNodeVersion: undefined,
    actualNpmVersion: undefined,
  });

  equal(result.errors, [], "05.01");
  equal(result.npmSpec, "npm@11.16.0", "05.02");
});

test.run();

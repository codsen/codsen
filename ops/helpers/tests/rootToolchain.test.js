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

test("04 - accepts a running toolchain which satisfies both engines ranges", () => {
  // .node-version and packageManager record the releases last exercised here;
  // neither requires the machine to reproduce that release exactly
  equal(policy({ actualNodeVersion: "24.19.1" }).errors, [], "04.01");
  equal(policy({ actualNodeVersion: "26.7.0" }).errors, [], "04.02");
  equal(policy({ actualNpmVersion: "11.16.1" }).errors, [], "04.03");
  equal(policy({ actualNpmVersion: "11.17.0" }).errors, [], "04.04");
  equal(policy({ actualNpmVersion: "12.0.0" }).errors, [], "04.05");
});

test("05 - rejects a running toolchain below either engines range", () => {
  const olderPatch = policy({ actualNpmVersion: "11.15.9" }).errors.join("\n");
  match(olderPatch, /running npm 11\.15\.9.*engines\.npm >=11\.16\.0/, "05.01");

  const olderMinor = policy({ actualNpmVersion: "11.9.0" }).errors.join("\n");
  match(olderMinor, /running npm 11\.9\.0.*engines\.npm >=11\.16\.0/, "05.02");

  const olderMajor = policy({ actualNpmVersion: "10.99.99" }).errors.join("\n");
  match(
    olderMajor,
    /running npm 10\.99\.99.*engines\.npm >=11\.16\.0/,
    "05.03",
  );

  const olderNode = policy({ actualNodeVersion: "24.18.9" }).errors.join("\n");
  match(
    olderNode,
    /running Node 24\.18\.9.*engines\.node >=24\.19\.0/,
    "05.04",
  );

  const olderNodeMajor = policy({ actualNodeVersion: "22.20.0" }).errors.join(
    "\n",
  );
  match(
    olderNodeMajor,
    /running Node 22\.20\.0.*engines\.node >=24\.19\.0/,
    "05.05",
  );
});

test("06 - still requires an exact pin in the recorded declarations", () => {
  // relaxing the running check must not let a floating pin through
  const result = policy({
    manifest: {
      engines: { node: ">=24.19.0", npm: ">=11.16.0" },
      packageManager: "npm@11",
    },
    nodeVersionSource: "24.19\n",
  });
  const message = result.errors.join("\n");

  match(message, /\.node-version must be an exact x\.y\.z version/, "06.01");
  match(
    message,
    /packageManager npm version must be an exact x\.y\.z version/,
    "06.02",
  );
});

test("07 - static policy checks do not require a running toolchain", () => {
  const result = policy({
    actualNodeVersion: undefined,
    actualNpmVersion: undefined,
  });

  equal(result.errors, [], "07.01");
  equal(result.npmSpec, "npm@11.16.0", "07.02");
});

test.run();

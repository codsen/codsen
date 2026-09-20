import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import {
  deprecatedPackageNames,
  refreshNpmPackageStatus,
  validateNpmPackageStatus,
} from "../npmPackageStatus.js";

const checkedAt = "2026-09-20T12:00:00.000Z";

function document(name, deprecated, olderDeprecated = undefined) {
  return {
    name,
    "dist-tags": { latest: "2.0.0" },
    versions: {
      "1.0.0": { version: "1.0.0", deprecated: olderDeprecated },
      "2.0.0": { version: "2.0.0", deprecated },
    },
  };
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status });
}

async function captureError(operation) {
  try {
    await operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected operation to reject");
}

test("01 - derives deprecation only from the latest dist-tag", async () => {
  const names = ["retired", "older-only", "undeprecated", "clear"];
  const documents = {
    retired: document("retired", "Use another package"),
    "older-only": document("older-only", undefined, "Old release has a bug"),
    undeprecated: document("undeprecated", "", "Old release has a bug"),
    clear: document("clear"),
  };
  const snapshot = await refreshNpmPackageStatus(names, {
    checkedAt,
    fetchImpl: async (url) => json(documents[url.split("/").at(-1)]),
  });
  equal(deprecatedPackageNames(snapshot, names), ["retired"], "01.01");
  equal(
    snapshot.packages.retired,
    {
      status: "available",
      version: "2.0.0",
      deprecated: "Use another package",
    },
    "01.02",
  );
  equal(snapshot.packages["older-only"].deprecated, null, "01.03");
  equal(snapshot.packages.undeprecated.deprecated, null, "01.04");
  equal(snapshot.checkedAt, checkedAt, "01.05");
  equal(Object.keys(snapshot.packages), [...names].sort(), "01.06");
});

test("02 - preserves unavailable observations separately from clear releases", async () => {
  const snapshot = await refreshNpmPackageStatus(
    ["gone", "alias", "untagged"],
    {
      checkedAt,
      async fetchImpl(url) {
        const name = url.split("/").at(-1);
        if (name === "gone") {
          return json({ error: "Not found" }, 404);
        }
        if (name === "alias") {
          return json({ name, time: { unpublished: { versions: ["1.0.0"] } } });
        }
        return json({ name, versions: { "1.0.0": { version: "1.0.0" } } });
      },
    },
  );
  equal(
    snapshot.packages,
    {
      alias: { status: "unavailable", reason: "unpublished" },
      gone: { status: "unavailable", reason: "not-found" },
      untagged: { status: "unavailable", reason: "no-latest" },
    },
    "02.01",
  );
  equal(deprecatedPackageNames(snapshot), [], "02.02");
});

test("03 - rejects HTTP, network, JSON, and malformed registry failures", async () => {
  const cases = [
    async () => json({}, 503),
    async () => json({}, 403),
    async () => {
      throw new Error("offline");
    },
    async () => new Response("invalid json"),
    async () => json(document("wrong-name")),
    async () => json({ name: "alpha" }),
    async () => json({ ...document("alpha"), "dist-tags": "latest" }),
    async () =>
      json({ ...document("alpha"), "dist-tags": { latest: "3.0.0" } }),
    async () => json(document("alpha", false)),
  ];
  for (const fetchImpl of cases) {
    const error = await captureError(() =>
      refreshNpmPackageStatus(["alpha"], { checkedAt, fetchImpl }),
    );
    match(error.message, /Could not refresh npm status for alpha/);
    equal(error.cause instanceof Error, true, "03.01");
  }
});

test("04 - validates exact inventory and snapshot shape without changing observations", async () => {
  const snapshot = await refreshNpmPackageStatus(["alpha"], {
    checkedAt,
    fetchImpl: async () => json(document("alpha")),
  });
  const before = JSON.stringify(snapshot);
  equal(validateNpmPackageStatus(snapshot), snapshot, "04.01");
  equal(validateNpmPackageStatus(snapshot, ["alpha"]), snapshot, "04.02");
  throws(
    () => validateNpmPackageStatus(snapshot, ["beta"]),
    /missing: beta; unexpected: alpha/,
  );
  for (const changed of [
    { ...snapshot, schemaVersion: 2 },
    { ...snapshot, checkedAt: "2026-02-30T12:00:00.000Z" },
    { ...snapshot, registry: "https://other.example" },
    {
      ...snapshot,
      packages: { alpha: { status: "available", version: "2.0.0" } },
    },
    {
      ...snapshot,
      packages: { alpha: { status: "unavailable", reason: "offline" } },
    },
    {
      ...snapshot,
      packages: { alpha: { ...snapshot.packages.alpha, extra: true } },
    },
  ]) {
    throws(
      () => validateNpmPackageStatus(changed),
      /Invalid npm package status/,
    );
  }
  equal(JSON.stringify(snapshot), before, "04.03");
});

test("05 - encodes scopes and bounds concurrent requests while preserving sort order", async () => {
  let active = 0;
  let highest = 0;
  const calls = [];
  const names = ["zeta", "@example/alpha", "beta", "delta", "gamma"];
  const snapshot = await refreshNpmPackageStatus(names, {
    checkedAt,
    concurrency: 2,
    async fetchImpl(url) {
      active += 1;
      highest = Math.max(highest, active);
      calls.push(url);
      await new Promise((resolve) => setImmediate(resolve));
      active -= 1;
      return json(document(decodeURIComponent(url.split("/").at(-1))));
    },
  });
  equal(highest, 2, "05.01");
  equal(calls[0], "https://registry.npmjs.org/%40example%2Falpha", "05.02");
  equal(Object.keys(snapshot.packages), [...names].sort(), "05.03");
  equal(names[0], "zeta", "05.04");
});

test("06 - rejects invalid inputs before making requests", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return json(document("alpha"));
  };
  for (const names of [["alpha", "alpha"], ["../escape"], null]) {
    await captureError(() =>
      refreshNpmPackageStatus(names, { checkedAt, fetchImpl }),
    );
  }
  for (const options of [
    { concurrency: 0 },
    { concurrency: 33 },
    { timeoutMs: 0 },
    { checkedAt: "yesterday" },
  ]) {
    await captureError(() =>
      refreshNpmPackageStatus(["alpha"], { checkedAt, fetchImpl, ...options }),
    );
  }
  equal(calls, 0, "06.01");
});

test("07 - stops scheduling after a failure and rejects the whole refresh", async () => {
  const calls = [];
  const error = await captureError(() =>
    refreshNpmPackageStatus(["alpha", "beta", "gamma"], {
      checkedAt,
      concurrency: 1,
      async fetchImpl(url) {
        calls.push(url);
        return json({}, 429);
      },
    }),
  );
  equal(calls, ["https://registry.npmjs.org/alpha"], "07.01");
  equal(error.cause.message, "npm registry returned HTTP 429", "07.02");
});

test.run();

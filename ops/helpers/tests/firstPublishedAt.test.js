import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import {
  firstPublishedAtFromMetadata,
  projectFirstPublishedAt,
  refreshFirstPublishedAt,
} from "../firstPublishedAt.js";

const first = "2020-01-02T03:04:05.123Z";
const later = "2026-08-28T05:37:24.999Z";
const firstEpoch = Date.parse(first);
const laterEpoch = Date.parse(later);

function response(name, time, status = 200) {
  return {
    status,
    ok: status === 200,
    json: async () => ({ name, time }),
  };
}

test("01 - uses version publication time instead of creation or modification", () => {
  equal(
    firstPublishedAtFromMetadata("example", {
      name: "example",
      time: {
        created: "2019-01-01T00:00:00.000Z",
        modified: "2026-09-05T00:00:00.000Z",
        "1.0.0": first,
        "2.0.0": later,
      },
    }),
    firstEpoch,
    "01.01",
  );
});

test("02 - handles unordered versions, prereleases and removed versions", () => {
  equal(
    firstPublishedAtFromMetadata("example", {
      name: "example",
      versions: { "1.0.0": {} },
      time: {
        "1.0.0": later,
        "9.0.0-beta.1+build.2": first,
        unpublished: { time: "2026-09-04T00:00:00.000Z" },
      },
    }),
    firstEpoch,
    "02.01",
  );
});

test("03 - keeps a package without version-publication evidence unknown", () => {
  equal(
    firstPublishedAtFromMetadata("example", {
      name: "example",
      time: { created: first, modified: later, unpublished: { time: later } },
    }),
    null,
    "03.01",
  );
});

test("04 - rejects malformed metadata instead of guessing a timestamp", () => {
  for (const metadata of [
    null,
    { name: "another", time: { "1.0.0": first } },
    { name: "example" },
    { name: "example", time: [] },
    { name: "example", time: { "1.0.0": "invalid" } },
    { name: "example", time: { "1.0.0": firstEpoch } },
    { name: "example", versions: { "1.0.0": {} }, time: { created: first } },
  ]) {
    throws(() => firstPublishedAtFromMetadata("example", metadata), /npm/);
  }
});

test("05 - offline projection follows the entire inventory and preserves ties", () => {
  const previous = {
    local: firstEpoch,
    external: firstEpoch,
    removed: laterEpoch,
  };
  const names = ["local", "unpublished", "external", "deprecated"];
  equal(
    projectFirstPublishedAt(names, previous),
    {
      deprecated: null,
      external: firstEpoch,
      local: firstEpoch,
      unpublished: null,
    },
    "05.01",
  );
  equal(names, ["local", "unpublished", "external", "deprecated"], "05.02");
  equal(previous.removed, laterEpoch, "05.03");
});

test("06 - rejects corrupt saved dates including seconds represented as strings", () => {
  for (const timestamp of [
    undefined,
    "1590000000",
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    9e15,
  ]) {
    throws(
      () => projectFirstPublishedAt(["example"], { example: timestamp }),
      /Invalid saved first-publication timestamp for example/,
    );
  }
});

test("07 - refresh requests every supplied name including scoped and external packages", async () => {
  const requests = [];
  const previous = { local: null, removed: firstEpoch };
  const result = await refreshFirstPublishedAt(
    ["local", "external", "@codsen/example"],
    previous,
    {
      fetchMetadata: async (url, options) => {
        requests.push([url, options.headers.Accept]);
        const name = decodeURIComponent(new URL(url).pathname.slice(1));
        return response(name, { "1.0.0": first });
      },
    },
  );
  equal(
    requests,
    [
      ["https://registry.npmjs.org/%40codsen%2Fexample", "application/json"],
      ["https://registry.npmjs.org/external", "application/json"],
      ["https://registry.npmjs.org/local", "application/json"],
    ],
    "07.01",
  );
  equal(
    result,
    { "@codsen/example": firstEpoch, external: firstEpoch, local: firstEpoch },
    "07.02",
  );
  equal(previous, { local: null, removed: firstEpoch }, "07.03");
});

test("08 - a 404 leaves new packages unknown and retains historical evidence", async () => {
  equal(
    await refreshFirstPublishedAt(
      ["new", "removed-from-npm"],
      { "removed-from-npm": firstEpoch },
      {
        fetchMetadata: async () => response(null, null, 404),
      },
    ),
    { new: null, "removed-from-npm": firstEpoch },
    "08.01",
  );
});

test("09 - refresh retains earlier observations and accepts newly discovered earlier dates", async () => {
  equal(
    await refreshFirstPublishedAt(
      ["retained", "earlier", "unpublished"],
      {
        retained: firstEpoch,
        earlier: laterEpoch,
        unpublished: firstEpoch,
      },
      {
        fetchMetadata: async (url) => {
          const name = new URL(url).pathname.slice(1);
          return response(
            name,
            name === "unpublished"
              ? { created: later }
              : { "1.0.0": name === "earlier" ? first : later },
          );
        },
      },
    ),
    { earlier: firstEpoch, retained: firstEpoch, unpublished: firstEpoch },
    "09.01",
  );
});

test("10 - HTTP, network and malformed-response failures abort refresh without mutating the snapshot", async () => {
  const previous = { example: firstEpoch };
  for (const fetchMetadata of [
    async () => response(null, null, 403),
    async () => response(null, null, 429),
    async () => response(null, null, 500),
    async () => {
      throw new Error("network timeout");
    },
    async () => response("example", { "1.0.0": "invalid" }),
    async () => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("invalid JSON");
      },
    }),
  ]) {
    let error;
    try {
      await refreshFirstPublishedAt(["example"], previous, { fetchMetadata });
    } catch (caught) {
      error = caught;
    }
    match(
      error?.message,
      /Could not refresh first-publication date for example/,
    );
  }
  equal(previous, { example: firstEpoch }, "10.01");
});

test("11 - refresh bounds concurrent requests and retains deterministic key order", async () => {
  const names = Array.from(
    { length: 19 },
    (_, index) => `package-${index}`,
  ).reverse();
  let active = 0;
  let peak = 0;
  const result = await refreshFirstPublishedAt(
    names,
    {},
    {
      fetchMetadata: async (url) => {
        active++;
        peak = Math.max(peak, active);
        await new Promise((resolve) => setTimeout(resolve, 1));
        active--;
        return response(new URL(url).pathname.slice(1), { "1.0.0": first });
      },
    },
  );
  equal(peak, 8, "11.01");
  equal(Object.keys(result), [...names].sort(), "11.02");
  equal(
    Object.values(result),
    names.map(() => firstEpoch),
    "11.03",
  );
});

test.run();

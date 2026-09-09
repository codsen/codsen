import { test } from "uvu";
import { equal, match, ok, throws } from "uvu/assert";

import { createNpmDownloadsClient } from "../npmDownloadsClient.js";

const start = "2026-09-01";
const end = "2026-09-02";
const now = () => Date.parse("2026-09-09T12:00:00Z");

function payload(name = "alpha") {
  return {
    package: name,
    start,
    end,
    downloads: [
      { day: start, downloads: 4 },
      { day: end, downloads: 0 },
    ],
  };
}

function json(value, status = 200, headers = {}) {
  return new Response(JSON.stringify(value), { status, headers });
}

async function captureError(operation) {
  try {
    await operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected operation to reject");
}

test("01 - obtains the npm availability watermark independently of local yesterday", async () => {
  const calls = [];
  const client = createNpmDownloadsClient({
    now,
    async fetchImpl(url) {
      calls.push(url);
      return json({ start: "2026-09-06", end: "2026-09-06", downloads: 123 });
    },
  });
  equal(await client.latestDay(), "2026-09-06", "01.01");
  equal(calls, ["https://api.npmjs.org/downloads/point/last-day"], "01.02");
});

test("02 - rejects malformed, inconsistent, and future watermarks", async () => {
  for (const value of [
    null,
    [],
    { start: "2026-09-06", end: "2026-09-07", downloads: 1 },
    { start: "2026-02-30", end: "2026-02-30", downloads: 1 },
    { start: "2026-9-06", end: "2026-9-06", downloads: 1 },
    { start: "2026-09-09", end: "2026-09-09", downloads: 1 },
    { start: "2026-09-10", end: "2026-09-10", downloads: 1 },
    { start: "2026-09-06", end: "2026-09-06", downloads: -1 },
    { start: "2026-09-06", end: "2026-09-06", downloads: 1.5 },
    { start: "2026-09-06", end: "2026-09-06", downloads: "1" },
    {
      start: "2026-09-06",
      end: "2026-09-06",
      downloads: Number.MAX_SAFE_INTEGER + 1,
    },
  ]) {
    const client = createNpmDownloadsClient({
      now,
      fetchImpl: async () => json(value),
    });
    ok(await captureError(() => client.latestDay()), "02.01");
  }
});

test("03 - returns validated daily observations for one package", async () => {
  const calls = [];
  const client = createNpmDownloadsClient({
    async fetchImpl(url, options) {
      calls.push({ url, accept: options.headers.Accept });
      return json(payload());
    },
  });
  equal(
    await client.range(["alpha"], start, end),
    { alpha: payload().downloads },
    "03.01",
  );
  equal(
    calls,
    [
      {
        url: "https://api.npmjs.org/downloads/range/2026-09-01:2026-09-02/alpha",
        accept: "application/json",
      },
    ],
    "03.02",
  );
});

test("04 - encodes scoped names as one URL path component", async () => {
  const calls = [];
  const client = createNpmDownloadsClient({
    async fetchImpl(url) {
      calls.push(url);
      return json(payload("@codsen/data"));
    },
  });
  equal(
    await client.range(["@codsen/data"], start, end),
    { "@codsen/data": payload().downloads },
    "04.01",
  );
  equal(
    calls,
    [
      "https://api.npmjs.org/downloads/range/2026-09-01:2026-09-02/%40codsen%2Fdata",
    ],
    "04.02",
  );
});

test("05 - requests unscoped packages in one validated bulk response", async () => {
  const calls = [];
  const client = createNpmDownloadsClient({
    async fetchImpl(url) {
      calls.push(url);
      return json({ alpha: payload(), beta: payload("beta") });
    },
  });
  equal(
    await client.range(["alpha", "beta"], start, end),
    { alpha: payload().downloads, beta: payload().downloads },
    "05.01",
  );
  equal(
    calls,
    ["https://api.npmjs.org/downloads/range/2026-09-01:2026-09-02/alpha,beta"],
    "05.02",
  );
});

test("06 - partial and error bulk entries fail without accepting missing observations", async () => {
  for (const value of [
    { alpha: payload() },
    { alpha: payload(), beta: { error: "temporary failure" } },
    { alpha: payload(), beta: payload("other-package") },
    { alpha: null },
    null,
    [],
    { error: "temporary failure" },
  ]) {
    const calls = [];
    const client = createNpmDownloadsClient({
      async fetchImpl(url) {
        calls.push(url);
        return json(value);
      },
    });
    ok(
      await captureError(() => client.range(["alpha", "beta"], start, end)),
      "06.01",
    );
    equal(calls.length, 1, "06.02");
  }
});

test("07 - confirms a bulk null with an individual HTTP 404", async () => {
  const calls = [];
  const client = createNpmDownloadsClient({
    async fetchImpl(url) {
      calls.push(url);
      return calls.length === 1
        ? json({ alpha: payload(), beta: null })
        : json({ error: "package not found" }, 404);
    },
  });
  equal(
    await client.range(["alpha", "beta"], start, end),
    { alpha: payload().downloads, beta: null },
    "07.01",
  );
  equal(
    calls,
    [
      "https://api.npmjs.org/downloads/range/2026-09-01:2026-09-02/alpha,beta",
      "https://api.npmjs.org/downloads/range/2026-09-01:2026-09-02/beta",
    ],
    "07.02",
  );
});

test("08 - recovers available observations hidden by a bulk null", async () => {
  let calls = 0;
  const client = createNpmDownloadsClient({
    async fetchImpl() {
      calls += 1;
      return calls === 1
        ? json({ alpha: payload(), beta: null })
        : json(payload("beta"));
    },
  });
  equal(
    await client.range(["alpha", "beta"], start, end),
    { alpha: payload().downloads, beta: payload().downloads },
    "08.01",
  );
  equal(calls, 2, "08.02");
});

test("09 - treats only an individual HTTP 404 as unavailable", async () => {
  const client = createNpmDownloadsClient({
    fetchImpl: async () => json({ error: "not found" }, 404),
  });
  equal(await client.range(["alpha"], start, end), { alpha: null }, "09.01");
  match(
    (await captureError(() => client.latestDay())).message,
    /HTTP 404/,
    "09.02",
  );
  match(
    (await captureError(() => client.range(["alpha", "beta"], start, end)))
      .message,
    /HTTP 404/,
    "09.03",
  );
  const nullClient = createNpmDownloadsClient({
    fetchImpl: async () => json(null),
  });
  ok(
    await captureError(() => nullClient.range(["alpha"], start, end)),
    "09.04",
  );
});

test("10 - rejects truncated ranges and malformed JSON without retrying", async () => {
  for (const response of [
    json({ ...payload(), downloads: [payload().downloads[0]] }),
    json({ ...payload(), end: start }),
    json({
      ...payload(),
      downloads: [{ day: start, downloads: -1 }, payload().downloads[1]],
    }),
    new Response('{"downloads":'),
  ]) {
    let calls = 0;
    const client = createNpmDownloadsClient({
      async fetchImpl() {
        calls += 1;
        return response;
      },
    });
    ok(await captureError(() => client.range(["alpha"], start, end)), "10.01");
    equal(calls, 1, "10.02");
  }
});

test("11 - does not retry nontransient HTTP errors", async () => {
  for (const status of [301, 400, 401, 403, 422]) {
    let calls = 0;
    const client = createNpmDownloadsClient({
      async fetchImpl() {
        calls += 1;
        return json({}, status);
      },
    });
    match(
      (await captureError(() => client.range(["alpha"], start, end))).message,
      new RegExp(`HTTP ${status}`),
      "11.01",
    );
    equal(calls, 1, "11.02");
  }
});

test("12 - retries network failures and interrupted response bodies", async () => {
  let calls = 0;
  const waits = [];
  const notices = [];
  const client = createNpmDownloadsClient({
    async fetchImpl() {
      calls += 1;
      if (calls === 1) {
        throw new TypeError("fetch failed");
      }
      if (calls === 2) {
        return {
          status: 200,
          async json() {
            throw new TypeError("terminated");
          },
        };
      }
      return json(payload());
    },
    async sleepImpl(ms) {
      waits.push(ms);
    },
    onRetry({ attempt, delayMs, error }) {
      notices.push({ attempt, delayMs, reason: error.message });
    },
  });
  equal(
    await client.range(["alpha"], start, end),
    { alpha: payload().downloads },
    "12.01",
  );
  equal(calls, 3, "12.02");
  equal(waits, [1_000, 2_000], "12.03");
  equal(
    notices,
    [
      { attempt: 2, delayMs: 1_000, reason: "fetch failed" },
      { attempt: 3, delayMs: 2_000, reason: "terminated" },
    ],
    "12.04",
  );
});

test("13 - respects Retry-After seconds and HTTP dates", async () => {
  let calls = 0;
  const waits = [];
  const client = createNpmDownloadsClient({
    now,
    async fetchImpl() {
      calls += 1;
      if (calls === 1) {
        return json({}, 429, { "Retry-After": "2" });
      }
      if (calls === 2) {
        return json({}, 503, {
          "Retry-After": "Wed, 09 Sep 2026 12:00:04 GMT",
        });
      }
      return json(payload());
    },
    async sleepImpl(ms) {
      waits.push(ms);
    },
  });
  equal(
    await client.range(["alpha"], start, end),
    { alpha: payload().downloads },
    "13.01",
  );
  equal(waits, [2_000, 4_000], "13.02");
});

test("14 - fails visibly instead of shortening an excessive Retry-After", async () => {
  for (const header of ["61", "Wed, 09 Sep 2026 12:01:01 GMT"]) {
    let calls = 0;
    const waits = [];
    const client = createNpmDownloadsClient({
      now,
      async fetchImpl() {
        calls += 1;
        return json({}, 429, { "Retry-After": header });
      },
      async sleepImpl(ms) {
        waits.push(ms);
      },
    });
    match(
      (await captureError(() => client.range(["alpha"], start, end))).message,
      /exceeding the 60-second retry limit/,
      "14.01",
    );
    equal(calls, 1, "14.02");
    equal(waits, [], "14.03");
  }
});

test("15 - bounds both fetch and response body time with aborts and finite retries", async () => {
  for (const hangInBody of [false, true]) {
    const signals = [];
    const waits = [];
    const client = createNpmDownloadsClient({
      timeoutMs: 2,
      retries: 1,
      async fetchImpl(_url, { signal }) {
        signals.push(signal);
        if (hangInBody) {
          return { status: 200, json: () => new Promise(() => {}) };
        }
        return new Promise(() => {});
      },
      async sleepImpl(ms) {
        waits.push(ms);
      },
    });
    match(
      (await captureError(() => client.range(["alpha"], start, end))).message,
      /timed out after 2ms/,
      "15.01",
    );
    equal(signals.length, 2, "15.02");
    ok(
      signals.every((signal) => signal.aborted),
      "15.03",
    );
    equal(waits, [1_000], "15.04");
  }
});

test("16 - exhausts default retries after four attempts", async () => {
  let calls = 0;
  const waits = [];
  const client = createNpmDownloadsClient({
    async fetchImpl() {
      calls += 1;
      return json({}, 500);
    },
    async sleepImpl(ms) {
      waits.push(ms);
    },
  });
  match(
    (await captureError(() => client.range(["alpha"], start, end))).message,
    /HTTP 500/,
    "16.01",
  );
  equal(calls, 4, "16.02");
  equal(waits, [1_000, 2_000, 4_000], "16.03");
});

test("17 - rejects invalid client capabilities and retry bounds", () => {
  for (const options of [
    { fetchImpl: null },
    { sleepImpl: false },
    { now: 123 },
    { onRetry: "log" },
    { retries: -1 },
    { retries: 1.5 },
    { retries: 11 },
    { timeoutMs: 0 },
    { timeoutMs: Infinity },
    { timeoutMs: 2_147_483_648 },
  ]) {
    throws(() => createNpmDownloadsClient(options), undefined, "17.01");
  }
});

test("18 - rejects invalid range requests before contacting npm", async () => {
  let calls = 0;
  const client = createNpmDownloadsClient({
    async fetchImpl() {
      calls += 1;
      return json(payload());
    },
  });
  for (const args of [
    [[], start, end],
    [["alpha", "alpha"], start, end],
    [["alpha", "@codsen/data"], start, end],
    [["@codsen/data", "@codsen/other"], start, end],
    [["alpha/beta"], start, end],
    [["alpha,beta"], start, end],
    [[""], start, end],
    [[null], start, end],
    [Array.from({ length: 129 }, (_, i) => `package-${i}`), start, end],
    [["alpha"], "2026-02-30", end],
    [["alpha"], start, "2026-09-2"],
    [["alpha"], end, start],
  ]) {
    ok(await captureError(() => client.range(...args)), "18.01");
  }
  equal(calls, 0, "18.02");
});

test.run();

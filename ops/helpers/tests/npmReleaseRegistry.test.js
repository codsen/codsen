import { test } from "uvu";
import { equal, match, ok } from "uvu/assert";

import {
  PUBLISH_VERIFICATION_WAITS,
  publishAndVerifyLayer,
  publishPackage,
  publishReleaseLayers,
  releaseTagDecisions,
  verifyPublishedPackages,
} from "../npmReleaseRegistry.js";

function item(name = "example") {
  return {
    name,
    tarball: { integrity: "sha512-YQ==" },
    version: "1.0.0",
  };
}

async function captureError(operation) {
  try {
    await operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected operation to reject");
}

test("01 - requires every registry capability before reading or publishing", async () => {
  let reads = 0;
  const error = await captureError(() =>
    publishPackage(item(), "/fixture.tgz", {
      delay() {},
      log() {},
      readState() {
        reads += 1;
        return { exists: false };
      },
    }),
  );

  match(error.message, /capability publish is required/, "01.01");
  equal(reads, 0, "01.02");
});

test("02 - an absent version submits once without waiting for visibility", async () => {
  const calls = { logs: [], publish: 0, read: 0 };
  const outcome = await publishPackage(item(), "/fixture.tgz", {
    log(message) {
      calls.logs.push(message);
    },
    async publish(received, tarballPath) {
      equal(received.name, "example", "02.01");
      equal(tarballPath, "/fixture.tgz", "02.02");
      calls.publish += 1;
    },
    async readState() {
      calls.read += 1;
      return { exists: false };
    },
  });

  equal(outcome, "published", "02.03");
  equal(
    calls,
    {
      logs: [
        "Publishing example@1.0.0...",
        "Submitted example@1.0.0 to npm for availability scanning.",
      ],
      publish: 1,
      read: 1,
    },
    "02.04",
  );
});

test("03 - a matching existing version skips every publishing capability", async () => {
  const calls = { publish: 0, read: 0 };
  const outcome = await publishPackage(item(), "/fixture.tgz", {
    log() {},
    async publish() {
      calls.publish += 1;
    },
    async readState() {
      calls.read += 1;
      return {
        exists: true,
        integrity: "sha512-YQ==",
        version: "1.0.0",
      };
    },
  });

  equal(outcome, "skipped", "03.01");
  equal(calls, { publish: 0, read: 1 }, "03.02");
});

test("04 - an integrity mismatch fails before publish or verify", async () => {
  const calls = { publish: 0, read: 0 };
  const error = await captureError(() =>
    publishPackage(item(), "/fixture.tgz", {
      log() {},
      async publish() {
        calls.publish += 1;
      },
      async readState() {
        calls.read += 1;
        return {
          exists: true,
          integrity: "sha512-ZA==",
          version: "1.0.0",
        };
      },
    }),
  );

  match(error.message, /different tarball integrity/, "04.01");
  equal(calls, { publish: 0, read: 1 }, "04.02");
});

test("05 - a publish failure never runs verification", async () => {
  const calls = { publish: 0, read: 0 };
  const error = await captureError(() =>
    publishPackage(item(), "/fixture.tgz", {
      log() {},
      async publish() {
        calls.publish += 1;
        throw new Error("injected publish failure");
      },
      async readState() {
        calls.read += 1;
        return { exists: false };
      },
    }),
  );

  match(error.message, /injected publish failure/, "05.01");
  equal(calls, { publish: 1, read: 1 }, "05.02");
});

test("06 - layer verification drops visible packages between polls", async () => {
  const calls = { delays: [], logs: [], reads: [] };
  await verifyPublishedPackages([item("alpha"), item("beta")], {
    async delay(milliseconds) {
      calls.delays.push(milliseconds);
    },
    log(message) {
      calls.logs.push(message);
    },
    async readStates(items) {
      calls.reads.push(items.map(({ name }) => name));
      return items.map(({ name }) =>
        name === "alpha" || calls.reads.length > 1
          ? {
              exists: true,
              integrity: "sha512-YQ==",
              version: "1.0.0",
            }
          : { exists: false },
      );
    },
    waits: [0, 5, 10, 20],
  });

  equal(calls.reads, [["alpha", "beta"], ["beta"]], "06.01");
  equal(calls.delays, [5], "06.02");
  equal(
    calls.logs,
    ["Waiting for npm to finish scanning 1 package after 0ms: beta@1.0.0."],
    "06.03",
  );
});

test("07 - exhausted publish verification uses the exact production schedule", async () => {
  const calls = { delays: [], logs: [], reads: 0 };
  const error = await captureError(() =>
    verifyPublishedPackages([item()], {
      async delay(milliseconds) {
        calls.delays.push(milliseconds);
      },
      log(message) {
        calls.logs.push(message);
      },
      async readStates() {
        calls.reads += 1;
        return [{ exists: false }];
      },
    }),
  );

  match(error.message, /was not visible.*1200000ms/, "07.01");
  equal(calls.reads, PUBLISH_VERIFICATION_WAITS.length, "07.02");
  equal(calls.delays, PUBLISH_VERIFICATION_WAITS.slice(1), "07.03");
  equal(
    PUBLISH_VERIFICATION_WAITS.reduce((total, wait) => total + wait, 0),
    1_200_000,
    "07.04",
  );
});

test("08 - a layer submits every package before collective verification", async () => {
  const calls = [];
  const outcomes = await publishAndVerifyLayer([item("alpha"), item("beta")], {
    log(message) {
      calls.push(`log:${message}`);
    },
    async publishItems(items) {
      calls.push(`submit:${items.map(({ name }) => name).join(",")}`);
      return ["published", "skipped"];
    },
    async verifyItems(items) {
      calls.push(`verify:${items.map(({ name }) => name).join(",")}`);
    },
  });

  equal(outcomes, ["published", "skipped"], "08.01");
  equal(
    calls,
    [
      "submit:alpha,beta",
      "verify:alpha",
      "log:Published and verified alpha@1.0.0.",
    ],
    "08.02",
  );
});

test("09 - tag decisions are deterministic and reject conflicting remotes", () => {
  const head = "a".repeat(40);
  const desired = [
    { local: { exists: false }, tag: "alpha@1.0.0" },
    { local: { exists: true }, tag: "beta@1.0.0" },
    { local: { exists: false }, tag: "gamma@1.0.0" },
  ];
  const remote = new Map([["gamma@1.0.0", { target: head }]]);

  equal(
    releaseTagDecisions(desired, remote, true, head),
    {
      alreadyRemote: ["gamma@1.0.0"],
      create: ["alpha@1.0.0"],
      push: ["alpha@1.0.0", "beta@1.0.0"],
    },
    "09.01",
  );
  let error;
  try {
    releaseTagDecisions(
      desired,
      new Map([["gamma@1.0.0", { target: "b".repeat(40) }]]),
      true,
      head,
    );
  } catch (caught) {
    error = caught;
  }
  ok(error, "09.02");
  match(error.message, /targets/, "09.03");
});

test("10 - post-publish integrity mismatch stops layer verification", async () => {
  const calls = { delay: 0, logs: 0, reads: 0 };
  const error = await captureError(() =>
    verifyPublishedPackages([item()], {
      async delay() {
        calls.delay += 1;
      },
      log() {
        calls.logs += 1;
      },
      async readStates() {
        calls.reads += 1;
        return [
          {
            exists: true,
            integrity: "sha512-ZA==",
            version: "1.0.0",
          },
        ];
      },
    }),
  );

  match(error.message, /different tarball integrity/, "10.01");
  equal(calls, { delay: 0, logs: 0, reads: 1 }, "10.02");
});

test("11 - a failed publish layer prevents every later layer", async () => {
  const started = [];
  const error = await captureError(() =>
    publishReleaseLayers([["alpha"], ["beta"], ["gamma"]], {
      log() {},
      async publishLayer(layer) {
        started.push(...layer);
        if (layer.includes("beta")) {
          throw new Error("injected layer failure");
        }
        return ["published"];
      },
    }),
  );

  match(error.message, /injected layer failure/, "11.01");
  equal(started, ["alpha", "beta"], "11.02");
});

test("12 - reports deterministic per-layer publish timing", async () => {
  const messages = [];
  const times = [1_000, 1_250, 2_000, 2_900];
  const counts = await publishReleaseLayers([["alpha"], ["beta", "gamma"]], {
    log(message) {
      messages.push(message);
    },
    now() {
      return times.shift();
    },
    async publishLayer(layer) {
      return layer.map(() => "published");
    },
  });

  equal(counts, { published: 3, skipped: 0 }, "12.01");
  match(messages[1], /layer 1\/2 in 250ms \(1 package\)/, "12.02");
  match(messages[3], /layer 2\/2 in 900ms \(2 packages\)/, "12.03");
});

test.run();

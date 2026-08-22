import { test } from "uvu";
import { equal, match, ok } from "uvu/assert";

import {
  publishPackage,
  publishReleaseLayers,
  releaseTagDecisions,
  verifyPublishedPackage,
} from "../npmReleaseRegistry.js";

function item() {
  return {
    name: "example",
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

test("02 - an absent version publishes once and verifies immediately", async () => {
  const calls = { delay: [], logs: [], publish: 0, read: 0 };
  const outcome = await publishPackage(item(), "/fixture.tgz", {
    async delay(milliseconds) {
      calls.delay.push(milliseconds);
    },
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
      return calls.read === 1
        ? { exists: false }
        : {
            exists: true,
            integrity: "sha512-YQ==",
            version: "1.0.0",
          };
    },
  });

  equal(outcome, "published", "02.03");
  equal(
    calls,
    {
      delay: [],
      logs: [
        "Publishing example@1.0.0...",
        "Published and verified example@1.0.0.",
      ],
      publish: 1,
      read: 2,
    },
    "02.04",
  );
});

test("03 - a matching existing version skips every publishing capability", async () => {
  const calls = { delay: 0, publish: 0, read: 0 };
  const outcome = await publishPackage(item(), "/fixture.tgz", {
    async delay() {
      calls.delay += 1;
    },
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
  equal(calls, { delay: 0, publish: 0, read: 1 }, "03.02");
});

test("04 - an integrity mismatch fails before publish or verify", async () => {
  const calls = { delay: 0, publish: 0, read: 0 };
  const error = await captureError(() =>
    publishPackage(item(), "/fixture.tgz", {
      async delay() {
        calls.delay += 1;
      },
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
  equal(calls, { delay: 0, publish: 0, read: 1 }, "04.02");
});

test("05 - a publish failure never runs verification", async () => {
  const calls = { delay: 0, publish: 0, read: 0 };
  const error = await captureError(() =>
    publishPackage(item(), "/fixture.tgz", {
      async delay() {
        calls.delay += 1;
      },
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
  equal(calls, { delay: 0, publish: 1, read: 1 }, "05.02");
});

test("06 - verification follows the exact injected retry schedule", async () => {
  const delays = [];
  let reads = 0;
  await verifyPublishedPackage(item(), {
    async delay(milliseconds) {
      delays.push(milliseconds);
    },
    async readState() {
      reads += 1;
      return reads < 3
        ? { exists: false }
        : {
            exists: true,
            integrity: "sha512-YQ==",
            version: "1.0.0",
          };
    },
    waits: [0, 5, 10, 20],
  });

  equal(reads, 3, "06.01");
  equal(delays, [5, 10], "06.02");
});

test("07 - exhausted publish verification uses the exact production schedule", async () => {
  const delays = [];
  let reads = 0;
  const error = await captureError(() =>
    publishPackage(item(), "/fixture.tgz", {
      async delay(milliseconds) {
        delays.push(milliseconds);
      },
      log() {},
      async publish() {},
      async readState() {
        reads += 1;
        return { exists: false };
      },
    }),
  );

  match(error.message, /was not visible/, "07.01");
  equal(reads, 8, "07.02");
  equal(delays, [1_000, 2_000, 4_000, 8_000, 8_000, 8_000], "07.03");
});

test("08 - tag decisions are deterministic and reject conflicting remotes", () => {
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
    "08.01",
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
  ok(error, "08.02");
  match(error.message, /targets/, "08.03");
});

test("09 - post-publish integrity mismatch stops after the verification read", async () => {
  const calls = { delay: 0, publish: 0, read: 0 };
  const error = await captureError(() =>
    publishPackage(item(), "/fixture.tgz", {
      async delay() {
        calls.delay += 1;
      },
      log() {},
      async publish() {
        calls.publish += 1;
      },
      async readState() {
        calls.read += 1;
        return calls.read === 1
          ? { exists: false }
          : {
              exists: true,
              integrity: "sha512-ZA==",
              version: "1.0.0",
            };
      },
    }),
  );

  match(error.message, /different tarball integrity/, "09.01");
  equal(calls, { delay: 0, publish: 1, read: 2 }, "09.02");
});

test("10 - a failed publish layer prevents every later layer", async () => {
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

  match(error.message, /injected layer failure/, "10.01");
  equal(started, ["alpha", "beta"], "10.02");
});

test("11 - reports deterministic per-layer publish timing", async () => {
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

  equal(counts, { published: 3, skipped: 0 }, "11.01");
  match(messages[1], /layer 1\/2 in 250ms \(1 package\)/, "11.02");
  match(messages[3], /layer 2\/2 in 900ms \(2 packages\)/, "11.03");
});

test.run();

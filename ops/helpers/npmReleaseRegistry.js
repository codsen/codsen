function fail(message) {
  throw new Error(message);
}

function assertRegistryIntegrity(item, state) {
  if (state.version !== item.version) {
    fail(
      `npm returned ${state.version}, expected ${item.name}@${item.version}`,
    );
  }
  if (state.integrity !== item.tarball.integrity) {
    fail(
      `${item.name}@${item.version} exists on npm with different tarball integrity (${state.integrity} != ${item.tarball.integrity})`,
    );
  }
}

function requiredCapabilities(capabilities) {
  if (!capabilities || typeof capabilities !== "object") {
    fail("Registry capabilities are required");
  }
  for (const name of ["log", "publish", "readState"]) {
    if (typeof capabilities[name] !== "function") {
      fail(`Registry capability ${name} is required`);
    }
  }
  return capabilities;
}

async function publishPackage(item, tarballPath, capabilities) {
  const { log, publish, readState } = requiredCapabilities(capabilities);
  const state = await readState(item);
  if (state.exists) {
    assertRegistryIntegrity(item, state);
    log(
      `Already published with matching integrity: ${item.name}@${item.version}.`,
    );
    return "skipped";
  }
  log(`Publishing ${item.name}@${item.version}...`);
  await publish(item, tarballPath);
  log(
    `Submitted ${item.name}@${item.version} to npm for availability scanning.`,
  );
  return "published";
}

async function publishAndVerifyLayer(
  items,
  { log, publishItems, verifyItems },
) {
  if (
    !Array.isArray(items) ||
    typeof log !== "function" ||
    typeof publishItems !== "function" ||
    typeof verifyItems !== "function"
  ) {
    fail(
      "Layer publishing requires packages, log, publishItems, and verifyItems",
    );
  }
  const outcomes = await publishItems(items);
  if (!Array.isArray(outcomes) || outcomes.length !== items.length) {
    fail("Layer publishing returned an invalid outcome list");
  }
  const published = [];
  for (const [index, outcome] of outcomes.entries()) {
    if (outcome !== "published" && outcome !== "skipped") {
      fail(`Unsupported release publish outcome: ${outcome}`);
    }
    if (outcome === "published") {
      published.push(items[index]);
    }
  }
  await verifyItems(published);
  for (const item of published) {
    log(`Published and verified ${item.name}@${item.version}.`);
  }
  return outcomes;
}

async function publishReleaseLayers(
  layers,
  { log, now = Date.now, publishLayer },
) {
  if (
    !Array.isArray(layers) ||
    typeof log !== "function" ||
    typeof now !== "function" ||
    typeof publishLayer !== "function"
  ) {
    fail("Release-layer publishing requires layers, log, and publishLayer");
  }
  const counts = { published: 0, skipped: 0 };
  for (const [index, layer] of layers.entries()) {
    const startedAt = now();
    log(`Publishing layer ${index + 1}/${layers.length}: ${layer.join(", ")}`);
    let outcomes;
    try {
      outcomes = await publishLayer(layer, index);
    } catch (error) {
      log(
        `Publish layer ${index + 1}/${layers.length} failed after ${now() - startedAt}ms.`,
      );
      throw error;
    }
    for (const outcome of outcomes) {
      if (outcome !== "published" && outcome !== "skipped") {
        fail(`Unsupported release publish outcome: ${outcome}`);
      }
      counts[outcome] += 1;
    }
    log(
      `Completed publish layer ${index + 1}/${layers.length} in ${now() - startedAt}ms (${outcomes.length} package${outcomes.length === 1 ? "" : "s"}).`,
    );
  }
  return counts;
}

// npm scans newly submitted packages before making their metadata readable.
// Poll quickly for short scans, then once per minute for a 20-minute window.
const PUBLISH_VERIFICATION_WAITS = [
  0,
  5_000,
  10_000,
  15_000,
  30_000,
  ...Array(19).fill(60_000),
];

function packageList(items) {
  return items.map((item) => `${item.name}@${item.version}`).join(", ");
}

async function verifyPublishedPackages(items, capabilities) {
  if (!Array.isArray(items)) {
    fail("Registry verification requires a package array");
  }
  if (items.length === 0) {
    return;
  }
  const {
    delay,
    log,
    readStates,
    waits = PUBLISH_VERIFICATION_WAITS,
  } = capabilities ?? {};
  if (
    typeof delay !== "function" ||
    typeof log !== "function" ||
    typeof readStates !== "function"
  ) {
    fail(
      "Registry verification requires delay, log, and readStates capabilities",
    );
  }
  if (
    !Array.isArray(waits) ||
    waits.length === 0 ||
    waits.some((wait) => !Number.isInteger(wait) || wait < 0)
  ) {
    fail("Registry verification waits must be non-negative integers");
  }
  let elapsed = 0;
  let pending = [...items];
  for (const [waitIndex, wait] of waits.entries()) {
    if (wait > 0) {
      await delay(wait);
      elapsed += wait;
    }
    const states = await readStates(pending);
    if (!Array.isArray(states) || states.length !== pending.length) {
      fail("Registry verification returned an invalid state list");
    }
    const nextPending = [];
    for (const [index, item] of pending.entries()) {
      const state = states[index];
      if (state?.exists) {
        assertRegistryIntegrity(item, state);
      } else {
        nextPending.push(item);
      }
    }
    pending = nextPending;
    if (pending.length === 0) {
      return;
    }
    if (waitIndex < waits.length - 1) {
      log(
        `Waiting for npm to finish scanning ${pending.length} package${pending.length === 1 ? "" : "s"} after ${elapsed}ms: ${packageList(pending)}.`,
      );
    }
  }
  fail(
    `${packageList(pending)} ${pending.length === 1 ? "was" : "were"} not visible on npm ${elapsed}ms after publishing`,
  );
}

function releaseTagDecisions(desired, remoteState, shouldPush, headSha) {
  if (!Array.isArray(desired) || !(remoteState instanceof Map)) {
    fail("Tag decisions require desired tags and remote state");
  }
  const alreadyRemote = [];
  const create = [];
  const push = [];
  for (const item of desired) {
    const published = remoteState.get(item.tag);
    if (published) {
      if (!published.target) {
        fail(`Existing remote tag ${item.tag} is not annotated`);
      }
      if (published.target !== headSha) {
        fail(
          `Existing remote tag ${item.tag} targets ${published.target}, expected ${headSha}`,
        );
      }
      alreadyRemote.push(item.tag);
      continue;
    }
    if (!item.local?.exists) {
      create.push(item.tag);
    }
    if (shouldPush) {
      push.push(item.tag);
    }
  }
  return { alreadyRemote, create, push };
}

export {
  assertRegistryIntegrity,
  PUBLISH_VERIFICATION_WAITS,
  publishAndVerifyLayer,
  publishPackage,
  publishReleaseLayers,
  releaseTagDecisions,
  verifyPublishedPackages,
};

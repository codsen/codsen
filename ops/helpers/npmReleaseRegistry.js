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
  for (const name of ["delay", "log", "publish", "readState"]) {
    if (typeof capabilities[name] !== "function") {
      fail(`Registry capability ${name} is required`);
    }
  }
  return capabilities;
}

async function publishPackage(item, tarballPath, capabilities) {
  const { delay, log, publish, readState } = requiredCapabilities(capabilities);
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
  await verifyPublishedPackage(item, {
    delay,
    readState,
    waits: PUBLISH_VERIFICATION_WAITS,
  });
  log(`Published and verified ${item.name}@${item.version}.`);
  return "published";
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

const PUBLISH_VERIFICATION_WAITS = [
  0, 1_000, 2_000, 4_000, 8_000, 8_000, 8_000,
];

async function verifyPublishedPackage(item, { delay, readState, waits }) {
  if (typeof delay !== "function" || typeof readState !== "function") {
    fail("Registry verification requires delay and readState capabilities");
  }
  if (
    !Array.isArray(waits) ||
    waits.length === 0 ||
    waits.some((wait) => !Number.isInteger(wait) || wait < 0)
  ) {
    fail("Registry verification waits must be non-negative integers");
  }
  for (const wait of waits) {
    if (wait > 0) {
      await delay(wait);
    }
    const state = await readState(item);
    if (state.exists) {
      assertRegistryIntegrity(item, state);
      return;
    }
  }
  fail(`${item.name}@${item.version} was not visible on npm after publishing`);
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
  publishPackage,
  publishReleaseLayers,
  releaseTagDecisions,
  verifyPublishedPackage,
};

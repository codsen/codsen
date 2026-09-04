import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { test } from "uvu";
import { equal, match } from "uvu/assert";

import {
  compareSemver,
  fetchLatestVersion,
  formatCliUpdateNotification,
  isCheckDue,
  isCi,
  isDisabled,
  isNotificationDue,
  isPackageManagerInvocation,
  notifyOfCliUpdate,
  parseSemver,
  readLegacyConfig,
  readState,
  resolveCacheRoot,
  resolvePaths,
  runUpdateCheck,
} from "../../lect/common/cliUpdateNotifier.js";

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const NOW = 1_800_000_000_000;
const PACKAGE_NAME = "example-cli";

function createTemporaryRoot() {
  return mkdtempSync(path.join(tmpdir(), "cli-update-notifier-"));
}

function removeTemporaryRoot(root) {
  rmSync(root, { force: true, recursive: true });
}

function makeStderr(isTTY = true) {
  return {
    isTTY,
    messages: [],
    write(message) {
      this.messages.push(message);
      return true;
    },
  };
}

function makeRuntime(root, overrides = {}) {
  return {
    argv: [],
    cacheRoot: root,
    env: {},
    legacyConfigFile: null,
    now: () => NOW,
    stderr: makeStderr(),
    ...overrides,
  };
}

function makeState(overrides = {}) {
  return {
    schemaVersion: 1,
    createdAt: NOW,
    lastAttempt: 0,
    lastSuccess: 0,
    latestVersion: null,
    lastNotification: null,
    pendingNotification: null,
    ...overrides,
  };
}

function writeState(paths, state) {
  mkdirSync(path.dirname(paths.cacheFile), { recursive: true });
  writeFileSync(paths.cacheFile, `${JSON.stringify(state, null, 2)}\n`);
}

function textResponse(body, { contentLength, ok: responseOk = true } = {}) {
  return {
    ok: responseOk,
    headers: {
      get(name) {
        return name === "content-length" ? contentLength : undefined;
      },
    },
    async text() {
      return body;
    },
  };
}

test("01 - parses valid SemVer and rejects invalid forms", () => {
  equal(
    parseSemver("12.34.56-alpha.1+linux.x64"),
    {
      core: ["12", "34", "56"],
      prerelease: ["alpha", "1"],
    },
    "01.01",
  );
  equal(
    [
      null,
      "1",
      "1.2",
      "v1.2.3",
      "01.2.3",
      "1.02.3",
      "1.2.03",
      "1.2.3-01",
      "1.2.3-",
      "1.2.3+",
      "1.2.3 alpha",
    ].map(parseSemver),
    Array(11).fill(null),
    "01.02",
  );
});

test("02 - compares core, build, invalid, and huge SemVer values", () => {
  equal(
    [
      compareSemver("1.2.3", "1.2.4"),
      compareSemver("1.2.3", "1.3.0"),
      compareSemver("1.2.3", "2.0.0"),
      compareSemver("2.0.0", "1.999.999"),
      compareSemver("1.2.3+one", "1.2.3+two"),
      compareSemver("1.2", "1.2.0"),
    ],
    [-1, -1, -1, 1, 0, null],
    "02.01",
  );
  equal(
    compareSemver(
      "999999999999999999999999999999.0.0",
      "1000000000000000000000000000000.0.0",
    ),
    -1,
    "02.02",
  );
});

test("03 - follows SemVer prerelease precedence", () => {
  const versions = [
    "1.0.0-alpha",
    "1.0.0-alpha.1",
    "1.0.0-alpha.beta",
    "1.0.0-beta",
    "1.0.0-beta.2",
    "1.0.0-beta.11",
    "1.0.0-rc.1",
    "1.0.0",
  ];
  equal(
    versions
      .slice(0, -1)
      .map((version, index) => compareSemver(version, versions[index + 1])),
    Array(versions.length - 1).fill(-1),
    "03.01",
  );
  equal(compareSemver("1.0.0-2", "1.0.0-10"), -1, "03.02");
  equal(compareSemver("1.0.0-10", "1.0.0-alpha"), -1, "03.03");
  equal(compareSemver("1.0.0-alpha.2", "1.0.0-alpha.10"), -1, "03.04");
});

test("04 - detects CI and package-manager invocations", () => {
  equal(
    [
      isCi({}),
      isCi({ CI: "0" }),
      isCi({ CI: "false" }),
      isCi({ CI: "" }),
      isCi({ CONTINUOUS_INTEGRATION: "1" }),
      isCi({ CI_JOB_ID: "123" }),
    ],
    [false, false, false, true, true, true],
    "04.01",
  );
  equal(
    [
      isPackageManagerInvocation({}),
      isPackageManagerInvocation({ npm_package_json: "/tmp/package.json" }),
      isPackageManagerInvocation({ npm_config_user_agent: "npm/11 node/v26" }),
      isPackageManagerInvocation({ npm_config_user_agent: "yarn/4" }),
      isPackageManagerInvocation({ npm_config_user_agent: "pnpm/10" }),
      isPackageManagerInvocation({ npm_config_user_agent: "bun/1" }),
      isPackageManagerInvocation({ npm_config_user_agent: "other/1" }),
    ],
    [false, true, true, true, true, true, false],
    "04.02",
  );
});

test("05 - applies every early opt-out without throwing", () => {
  const active = {
    argv: [],
    enabled: true,
    env: {},
    packageName: PACKAGE_NAME,
    packageVersion: "1.0.0",
    stderr: { isTTY: true },
  };
  equal(isDisabled(active), false, "05.01");
  equal(
    [
      { ...active, enabled: false },
      { ...active, packageName: "Invalid Name" },
      { ...active, packageVersion: "1.0" },
      { ...active, stderr: { isTTY: false } },
      { ...active, env: { NO_UPDATE_NOTIFIER: "0" } },
      { ...active, env: { NODE_ENV: "test" } },
      { ...active, argv: ["--no-update-notifier"] },
      { ...active, env: { CI: "1" } },
      { ...active, env: { npm_config_user_agent: "pnpm/10" } },
    ].map(isDisabled),
    Array(9).fill(true),
    "05.02",
  );
  equal(
    isDisabled({ ...active, packageName: "@codsen/example-cli" }),
    false,
    "05.03",
  );
});

test("06 - resolves native cache roots and safe fallbacks", () => {
  equal(
    resolveCacheRoot({ XDG_CACHE_HOME: "/xdg/cache" }, "/home/user", "linux"),
    "/xdg/cache",
    "06.01",
  );
  equal(
    resolveCacheRoot({ XDG_CACHE_HOME: "relative" }, "/home/user", "linux"),
    path.join("/home/user", ".cache"),
    "06.02",
  );
  equal(
    resolveCacheRoot({}, "/Users/user", "darwin"),
    path.join("/Users/user", "Library", "Caches"),
    "06.03",
  );
  equal(
    resolveCacheRoot({ LOCALAPPDATA: "/windows/local" }, "/home/user", "win32"),
    "/windows/local",
    "06.04",
  );
  equal(
    resolveCacheRoot({}, "/home/user", "win32"),
    path.join("/home/user", "AppData", "Local"),
    "06.05",
  );
  equal(resolveCacheRoot({}, "relative", "linux"), null, "06.06");
});

test("07 - resolves package cache and legacy config paths", () => {
  const paths = resolvePaths("@codsen/example-cli", {
    cacheRoot: "/cache-root",
    env: { XDG_CONFIG_HOME: "/config-root" },
    home: "/home/user",
    platform: "linux",
  });
  equal(
    paths.cacheFile,
    path.join(
      "/cache-root",
      "codsen",
      "update-notifier",
      `${Buffer.from("@codsen/example-cli").toString("base64url")}.json`,
    ),
    "07.01",
  );
  equal(paths.lockFile, `${paths.cacheFile}.lock`, "07.02");
  equal(
    paths.legacyConfigFile,
    path.join(
      "/config-root",
      "configstore",
      "update-notifier-@codsen/example-cli.json",
    ),
    "07.03",
  );
  equal(
    resolvePaths(PACKAGE_NAME, {
      cacheRoot: "relative",
      env: {},
      home: "relative",
      platform: "linux",
    }),
    null,
    "07.04",
  );
});

test("08 - normalizes readable state and rejects malformed state", () => {
  const root = createTemporaryRoot();
  const filename = path.join(root, "state.json");
  try {
    writeFileSync(filename, "{");
    equal(readState(filename, NOW), null, "08.01");

    writeFileSync(
      filename,
      JSON.stringify({
        schemaVersion: 999,
        createdAt: -1,
        lastAttempt: "recent",
        lastSuccess: NOW - HOUR,
        latestVersion: "not-semver",
        lastNotification: { current: "1.0", latest: "2.0.0", at: NOW },
      }),
    );
    equal(
      readState(filename, NOW),
      {
        schemaVersion: 1,
        createdAt: NOW,
        lastAttempt: 0,
        lastSuccess: NOW - HOUR,
        latestVersion: null,
        lastNotification: null,
        pendingNotification: null,
      },
      "08.02",
    );
  } finally {
    removeTemporaryRoot(root);
  }
});

test("09 - reads legacy metadata and preserves a legacy opt-out", () => {
  const root = createTemporaryRoot();
  const legacyConfigFile = path.join(root, "legacy.json");
  const runtime = makeRuntime(root, { legacyConfigFile });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  let spawnCount = 0;
  runtime.spawnWorker = () => {
    spawnCount += 1;
    return true;
  };
  try {
    writeFileSync(
      legacyConfigFile,
      JSON.stringify({
        lastUpdateCheck: NOW - DAY,
        optOut: "yes",
        update: { latest: "2.0.0" },
      }),
    );
    equal(
      readLegacyConfig(legacyConfigFile),
      {
        optOut: true,
        lastUpdateCheck: NOW - DAY,
        latestVersion: "2.0.0",
      },
      "09.01",
    );
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      false,
      "09.02",
    );
    equal(existsSync(paths.cacheFile), false, "09.03");
    equal(spawnCount, 0, "09.04");

    writeFileSync(legacyConfigFile, "{");
    equal(readLegacyConfig(legacyConfigFile), {}, "09.05");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("10 - seeds the new cache from a legacy successful check", () => {
  const root = createTemporaryRoot();
  const legacyConfigFile = path.join(root, "legacy.json");
  let exitListener;
  const runtime = makeRuntime(root, {
    legacyConfigFile,
    onExit(listener) {
      exitListener = listener;
    },
  });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  try {
    writeFileSync(
      legacyConfigFile,
      JSON.stringify({
        lastUpdateCheck: NOW - HOUR,
        optOut: false,
        update: { latest: "2.0.0" },
      }),
    );
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      true,
      "10.01",
    );
    const state = readState(paths.cacheFile, NOW);
    equal(state.createdAt, NOW - HOUR, "10.02");
    equal(state.latestVersion, "2.0.0", "10.03");
    equal(typeof exitListener, "function", "10.04");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("11 - waits one day on first use before scheduling", () => {
  const root = createTemporaryRoot();
  let clock = NOW;
  const spawnedAttempts = [];
  const runtime = makeRuntime(root, {
    now: () => clock,
    spawnWorker(packageName, attemptToken) {
      spawnedAttempts.push([packageName, attemptToken]);
      return true;
    },
  });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  try {
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      false,
      "11.01",
    );
    equal(readState(paths.cacheFile, clock).createdAt, NOW, "11.02");
    equal(spawnedAttempts, [], "11.03");

    clock = NOW + DAY - 1;
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      false,
      "11.04",
    );
    clock = NOW + DAY;
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      true,
      "11.05",
    );
    equal(spawnedAttempts, [[PACKAGE_NAME, clock]], "11.06");
    equal(readState(paths.cacheFile, clock).lastAttempt, clock, "11.07");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("12 - calculates check and notification eligibility", () => {
  equal(isCheckDue(makeState({ createdAt: NOW - DAY }), NOW), true, "12.01");
  equal(
    isCheckDue(makeState({ createdAt: NOW - DAY + 1 }), NOW),
    false,
    "12.02",
  );
  equal(
    isCheckDue(
      makeState({
        createdAt: NOW - 2 * DAY,
        lastAttempt: NOW - HOUR + 1,
      }),
      NOW,
    ),
    false,
    "12.03",
  );
  equal(
    isCheckDue(
      makeState({ createdAt: NOW - 2 * DAY, lastAttempt: NOW - HOUR }),
      NOW,
    ),
    true,
    "12.04",
  );
  equal(
    isCheckDue(makeState({ lastSuccess: NOW - DAY + 1 }), NOW),
    false,
    "12.05",
  );
  equal(
    isNotificationDue(makeState({ latestVersion: "2.0.0" }), "1.0.0"),
    true,
    "12.06",
  );
  equal(
    isNotificationDue(
      makeState({
        latestVersion: "2.0.0",
        lastNotification: { current: "1.0.0", latest: "2.0.0", at: NOW },
      }),
      "1.0.0",
    ),
    false,
    "12.07",
  );
});

test("13 - serializes competing scheduler calls through state", () => {
  const root = createTemporaryRoot();
  let spawnCount = 0;
  const runtime = makeRuntime(root, {
    spawnWorker() {
      spawnCount += 1;
      return true;
    },
  });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  try {
    writeState(paths, makeState({ createdAt: NOW - DAY }));
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      true,
      "13.01",
    );
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      false,
      "13.02",
    );
    equal(spawnCount, 1, "13.03");
    equal(readState(paths.cacheFile, NOW).lastAttempt, NOW, "13.04");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("14 - refuses a live state lock and reclaims a stale one", () => {
  const root = createTemporaryRoot();
  let spawnCount = 0;
  const runtime = makeRuntime(root, {
    lockStaleAfter: 100,
    spawnWorker() {
      spawnCount += 1;
      return true;
    },
  });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  try {
    writeState(paths, makeState({ createdAt: NOW - DAY }));
    writeFileSync(paths.lockFile, "active\n");
    utimesSync(paths.lockFile, NOW / 1000, NOW / 1000);
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      false,
      "14.01",
    );
    equal(spawnCount, 0, "14.02");
    equal(existsSync(paths.lockFile), true, "14.03");

    utimesSync(paths.lockFile, (NOW - 1000) / 1000, (NOW - 1000) / 1000);
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      true,
      "14.04",
    );
    equal(spawnCount, 1, "14.05");
    equal(existsSync(paths.lockFile), false, "14.06");
    equal(readState(paths.cacheFile, NOW).lastAttempt, NOW, "14.07");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("15 - detaches the worker and survives spawn failure", () => {
  const root = createTemporaryRoot();
  const calls = [];
  const childEvents = [];
  let unrefCount = 0;
  const runtime = makeRuntime(root, {
    spawnImpl(...args) {
      calls.push(args);
      return {
        once(event, listener) {
          childEvents.push([event, typeof listener]);
        },
        unref() {
          unrefCount += 1;
        },
      };
    },
  });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  try {
    writeState(paths, makeState({ createdAt: NOW - DAY }));
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      true,
      "15.01",
    );
    equal(calls.length, 1, "15.02");
    equal(calls[0][0], process.execPath, "15.03");
    match(calls[0][1][0], /cliUpdateNotifier\.js$/, "15.04");
    equal(
      calls[0][1].slice(1),
      ["--codsen-update-check-worker", PACKAGE_NAME, String(NOW)],
      "15.05",
    );
    equal(
      calls[0][2],
      { detached: true, stdio: "ignore", windowsHide: true },
      "15.06",
    );
    equal(childEvents, [["error", "function"]], "15.07");
    equal(unrefCount, 1, "15.08");

    writeState(paths, makeState({ createdAt: NOW - DAY }));
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        {
          ...runtime,
          spawnImpl: () => {
            throw new Error("spawn failed");
          },
        },
      ),
      false,
      "15.09",
    );
    equal(readState(paths.cacheFile, NOW).lastAttempt, NOW, "15.10");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("16 - displays a cached notice only after a successful exit", () => {
  const root = createTemporaryRoot();
  const stderr = makeStderr();
  const listeners = [];
  const runtime = makeRuntime(root, {
    onExit(listener) {
      listeners.push(listener);
    },
    stderr,
  });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  try {
    writeState(paths, makeState({ lastSuccess: NOW, latestVersion: "2.0.0" }));
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      true,
      "16.01",
    );
    listeners[0](1);
    equal(stderr.messages, [], "16.02");
    equal(readState(paths.cacheFile, NOW).lastNotification, null, "16.03");

    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      true,
      "16.04",
    );
    listeners[1](0);
    equal(stderr.messages.length, 1, "16.05");
    equal(
      stderr.messages[0],
      formatCliUpdateNotification({
        currentVersion: "1.0.0",
        latestVersion: "2.0.0",
        packageName: PACKAGE_NAME,
      }),
      "16.06",
    );
    equal(
      readState(paths.cacheFile, NOW).lastNotification,
      { current: "1.0.0", latest: "2.0.0", at: NOW },
      "16.07",
    );
  } finally {
    removeTemporaryRoot(root);
  }
});

test("17 - retains a cached notice when stderr is not interactive", () => {
  const root = createTemporaryRoot();
  const stderr = makeStderr(false);
  const listeners = [];
  const runtime = makeRuntime(root, {
    onExit(listener) {
      listeners.push(listener);
    },
    stderr,
  });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  try {
    writeState(paths, makeState({ lastSuccess: NOW, latestVersion: "2.0.0" }));
    const before = readFileSync(paths.cacheFile, "utf8");
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      false,
      "17.01",
    );
    equal(listeners, [], "17.02");
    equal(readFileSync(paths.cacheFile, "utf8"), before, "17.03");

    stderr.isTTY = true;
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        runtime,
      ),
      true,
      "17.04",
    );
    stderr.isTTY = false;
    listeners[0](0);
    equal(stderr.messages, [], "17.05");
    equal(readFileSync(paths.cacheFile, "utf8"), before, "17.06");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("18 - fetches and validates registry metadata", async () => {
  let requestedUrl;
  let requestedOptions;
  const latest = await fetchLatestVersion("@codsen/example-cli", {
    fetchImpl(url, options) {
      requestedUrl = url;
      requestedOptions = options;
      return textResponse(JSON.stringify({ version: "2.0.0+build.1" }));
    },
    fetchTimeout: 100,
  });
  equal(latest, "2.0.0+build.1", "18.01");
  equal(
    requestedUrl,
    "https://registry.npmjs.org/%40codsen%2Fexample-cli/latest",
    "18.02",
  );
  equal(requestedOptions.headers, { accept: "application/json" }, "18.03");
  equal(requestedOptions.redirect, "follow", "18.04");
  equal(requestedOptions.signal.aborted, false, "18.05");
});

test("19 - rejects HTTP, malformed, invalid, and declared-oversize responses", async () => {
  let oversizeTextReads = 0;
  const results = await Promise.all([
    fetchLatestVersion(PACKAGE_NAME, {
      fetchImpl: async () => textResponse("not found", { ok: false }),
      fetchTimeout: 100,
    }),
    fetchLatestVersion(PACKAGE_NAME, {
      fetchImpl: async () => textResponse("{"),
      fetchTimeout: 100,
    }),
    fetchLatestVersion(PACKAGE_NAME, {
      fetchImpl: async () => textResponse(JSON.stringify({ version: "2.0" })),
      fetchTimeout: 100,
    }),
    fetchLatestVersion(PACKAGE_NAME, {
      fetchImpl: async () => ({
        ...textResponse("", { contentLength: String(64 * 1024 + 1) }),
        async text() {
          oversizeTextReads += 1;
          return "";
        },
      }),
      fetchTimeout: 100,
    }),
  ]);
  equal(results, [null, null, null, null], "19.01");
  equal(oversizeTextReads, 0, "19.02");
});

test("20 - cancels streamed oversize responses and times out stalled fetches", async () => {
  const chunks = [new Uint8Array(40_000), new Uint8Array(30_000)];
  let cancelled = 0;
  let released = 0;
  const streamed = await fetchLatestVersion(PACKAGE_NAME, {
    fetchImpl: async () => ({
      body: {
        getReader() {
          return {
            async cancel() {
              cancelled += 1;
            },
            async read() {
              return chunks.length
                ? { done: false, value: chunks.shift() }
                : { done: true, value: undefined };
            },
            releaseLock() {
              released += 1;
            },
          };
        },
      },
      headers: { get: () => undefined },
      ok: true,
    }),
    fetchTimeout: 100,
  });
  equal(streamed, null, "20.01");
  equal(cancelled, 1, "20.02");
  equal(released, 1, "20.03");

  let aborted = false;
  const timedOut = await fetchLatestVersion(PACKAGE_NAME, {
    fetchImpl(_url, { signal }) {
      return new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => {
          aborted = true;
          reject(new Error("aborted"));
        });
      });
    },
    fetchTimeout: 5,
  });
  equal(timedOut, null, "20.04");
  equal(aborted, true, "20.05");
});

test("21 - worker success merges state and failure preserves it", async () => {
  const root = createTemporaryRoot();
  const runtime = makeRuntime(root, {
    expectedAttempt: NOW - HOUR,
    fetchImpl: async () => textResponse(JSON.stringify({ version: "3.0.0" })),
    fetchTimeout: 100,
  });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  try {
    writeState(
      paths,
      makeState({
        createdAt: NOW - DAY,
        lastAttempt: NOW - HOUR,
        lastNotification: { current: "1.0.0", latest: "2.0.0", at: NOW - DAY },
        latestVersion: "2.0.0",
      }),
    );
    equal(await runUpdateCheck(PACKAGE_NAME, runtime), true, "21.01");
    equal(
      readState(paths.cacheFile, NOW),
      makeState({
        createdAt: NOW - DAY,
        lastAttempt: NOW - HOUR,
        lastSuccess: NOW,
        lastNotification: { current: "1.0.0", latest: "2.0.0", at: NOW - DAY },
        latestVersion: "3.0.0",
      }),
      "21.02",
    );

    const beforeFailure = readFileSync(paths.cacheFile, "utf8");
    equal(
      await runUpdateCheck(PACKAGE_NAME, {
        ...runtime,
        fetchImpl: async () => {
          throw new Error("offline");
        },
        now: () => NOW + HOUR,
      }),
      false,
      "21.03",
    );
    equal(readFileSync(paths.cacheFile, "utf8"), beforeFailure, "21.04");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("22 - worker rejects active state locks and recovers stale locks", async () => {
  const root = createTemporaryRoot();
  const runtime = makeRuntime(root, {
    fetchImpl: async () => textResponse(JSON.stringify({ version: "2.0.0" })),
    fetchTimeout: 100,
    lockStaleAfter: 100,
  });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  try {
    writeState(paths, makeState({ createdAt: NOW - DAY }));
    writeFileSync(paths.lockFile, "active\n");
    utimesSync(paths.lockFile, NOW / 1000, NOW / 1000);
    equal(await runUpdateCheck(PACKAGE_NAME, runtime), false, "22.01");
    equal(readState(paths.cacheFile, NOW).latestVersion, null, "22.02");
    equal(existsSync(paths.lockFile), true, "22.03");

    utimesSync(paths.lockFile, (NOW - 1000) / 1000, (NOW - 1000) / 1000);
    equal(await runUpdateCheck(PACKAGE_NAME, runtime), true, "22.04");
    equal(readState(paths.cacheFile, NOW).latestVersion, "2.0.0", "22.05");
    equal(readState(paths.cacheFile, NOW).lastSuccess, NOW, "22.06");
    equal(existsSync(paths.lockFile), false, "22.07");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("23 - stale workers cannot overwrite a newer scheduled attempt", async () => {
  const root = createTemporaryRoot();
  const runtime = makeRuntime(root, {
    expectedAttempt: NOW - HOUR,
    fetchImpl: async () => textResponse(JSON.stringify({ version: "9.0.0" })),
    fetchTimeout: 100,
    now: () => NOW + HOUR,
  });
  const paths = resolvePaths(PACKAGE_NAME, runtime);
  try {
    writeState(
      paths,
      makeState({
        createdAt: NOW - DAY,
        lastAttempt: NOW,
        latestVersion: "2.0.0",
      }),
    );
    const before = readFileSync(paths.cacheFile, "utf8");
    equal(await runUpdateCheck(PACKAGE_NAME, runtime), false, "23.01");
    equal(readFileSync(paths.cacheFile, "utf8"), before, "23.02");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("24 - notification reservations prevent duplicates and release on skipped exits", () => {
  const root = createTemporaryRoot();
  const paths = resolvePaths(PACKAGE_NAME, makeRuntime(root));
  try {
    const concurrentStderr = makeStderr();
    const concurrentListeners = [];
    const concurrentRuntime = makeRuntime(root, {
      onExit(listener) {
        concurrentListeners.push(listener);
      },
      stderr: concurrentStderr,
    });
    writeState(paths, makeState({ lastSuccess: NOW, latestVersion: "2.0.0" }));
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        concurrentRuntime,
      ),
      true,
      "24.01",
    );
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        concurrentRuntime,
      ),
      false,
      "24.02",
    );
    equal(concurrentListeners.length, 1, "24.03");
    equal(
      {
        current: readState(paths.cacheFile, NOW).pendingNotification.current,
        latest: readState(paths.cacheFile, NOW).pendingNotification.latest,
      },
      { current: "1.0.0", latest: "2.0.0" },
      "24.04",
    );
    concurrentListeners[0](0);
    equal(concurrentStderr.messages.length, 1, "24.05");
    equal(readState(paths.cacheFile, NOW).pendingNotification, null, "24.06");

    const failedStderr = makeStderr();
    const failedListeners = [];
    const failedRuntime = makeRuntime(root, {
      onExit(listener) {
        failedListeners.push(listener);
      },
      stderr: failedStderr,
    });
    writeState(paths, makeState({ lastSuccess: NOW, latestVersion: "2.0.0" }));
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        failedRuntime,
      ),
      true,
      "24.07",
    );
    failedListeners[0](1);
    equal(failedStderr.messages, [], "24.08");
    equal(readState(paths.cacheFile, NOW).pendingNotification, null, "24.09");
    equal(readState(paths.cacheFile, NOW).lastNotification, null, "24.10");

    const nonTtyStderr = makeStderr();
    const nonTtyListeners = [];
    const nonTtyRuntime = makeRuntime(root, {
      onExit(listener) {
        nonTtyListeners.push(listener);
      },
      stderr: nonTtyStderr,
    });
    writeState(paths, makeState({ lastSuccess: NOW, latestVersion: "2.0.0" }));
    equal(
      notifyOfCliUpdate(
        { pkg: { name: PACKAGE_NAME, version: "1.0.0" } },
        nonTtyRuntime,
      ),
      true,
      "24.11",
    );
    nonTtyStderr.isTTY = false;
    nonTtyListeners[0](0);
    equal(nonTtyStderr.messages, [], "24.12");
    equal(readState(paths.cacheFile, NOW).pendingNotification, null, "24.13");
    equal(readState(paths.cacheFile, NOW).lastNotification, null, "24.14");
  } finally {
    removeTemporaryRoot(root);
  }
});

test("25 - formats the complete notification text", () => {
  equal(
    formatCliUpdateNotification({
      currentVersion: "1.2.3-beta.4+preview",
      latestVersion: "2.0.0+build.7",
      packageName: "@codsen/example-cli",
    }),
    "\nUpdate available for @codsen/example-cli: 1.2.3-beta.4+preview → 2.0.0+build.7\nhttps://www.npmjs.com/package/%40codsen%2Fexample-cli\n\n",
    "25.01",
  );
});

test.run();

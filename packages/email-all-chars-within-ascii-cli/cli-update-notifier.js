// This is the canonical source. `lect` copies it verbatim into every CLI.

import { spawn } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CHECK_INTERVAL = 24 * 60 * 60 * 1000;
const FAILURE_BACKOFF = 60 * 60 * 1000;
const FETCH_TIMEOUT = 10 * 1000;
const LOCK_STALE_AFTER = FETCH_TIMEOUT + 20 * 1000;
const MAX_JSON_BYTES = 64 * 1024;
const MODULE_FILENAME = fileURLToPath(import.meta.url);
const NOTIFICATION_LEASE = 60 * 60 * 1000;
const STATE_SCHEMA_VERSION = 1;
const WORKER_FLAG = "--codsen-update-check-worker";

const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const PACKAGE_NAME_PART = /^[a-z0-9][a-z0-9._~-]*$/;

function parseSemver(version) {
  if (typeof version !== "string") {
    return null;
  }
  const match = SEMVER_PATTERN.exec(version);
  if (!match) {
    return null;
  }
  const prerelease = match[4] ? match[4].split(".") : [];
  if (
    prerelease.some(
      (identifier) => /^\d+$/.test(identifier) && /^0\d+/.test(identifier),
    )
  ) {
    return null;
  }
  return {
    core: [match[1], match[2], match[3]],
    prerelease,
  };
}

function compareNumericStrings(left, right) {
  if (left.length !== right.length) {
    return left.length < right.length ? -1 : 1;
  }
  if (left === right) {
    return 0;
  }
  return left < right ? -1 : 1;
}

function compareSemver(leftVersion, rightVersion) {
  const left = parseSemver(leftVersion);
  const right = parseSemver(rightVersion);
  if (!left || !right) {
    return null;
  }
  for (let index = 0; index < left.core.length; index += 1) {
    const comparison = compareNumericStrings(
      left.core[index],
      right.core[index],
    );
    if (comparison) {
      return comparison;
    }
  }
  if (!left.prerelease.length || !right.prerelease.length) {
    if (left.prerelease.length === right.prerelease.length) {
      return 0;
    }
    return left.prerelease.length ? -1 : 1;
  }
  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const leftIdentifier = left.prerelease[index];
    const rightIdentifier = right.prerelease[index];
    if (leftIdentifier === undefined || rightIdentifier === undefined) {
      return leftIdentifier === undefined ? -1 : 1;
    }
    if (leftIdentifier === rightIdentifier) {
      continue;
    }
    const leftIsNumeric = /^\d+$/.test(leftIdentifier);
    const rightIsNumeric = /^\d+$/.test(rightIdentifier);
    if (leftIsNumeric && rightIsNumeric) {
      return compareNumericStrings(leftIdentifier, rightIdentifier);
    }
    if (leftIsNumeric !== rightIsNumeric) {
      return leftIsNumeric ? -1 : 1;
    }
    return leftIdentifier < rightIdentifier ? -1 : 1;
  }
  return 0;
}

function isValidPackageName(packageName) {
  if (
    typeof packageName !== "string" ||
    !packageName ||
    packageName.length > 214
  ) {
    return false;
  }
  if (!packageName.startsWith("@")) {
    return PACKAGE_NAME_PART.test(packageName);
  }
  const parts = packageName.slice(1).split("/");
  return (
    parts.length === 2 && parts.every((part) => PACKAGE_NAME_PART.test(part))
  );
}

function validTimestamp(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function initialState(now, legacy = {}) {
  const legacyCheck = validTimestamp(legacy.lastUpdateCheck);
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    createdAt: legacyCheck || now,
    lastAttempt: 0,
    lastSuccess: 0,
    latestVersion: parseSemver(legacy.latestVersion)
      ? legacy.latestVersion
      : null,
    lastNotification: null,
    pendingNotification: null,
  };
}

function normalizeState(value, now) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const latestVersion = parseSemver(value.latestVersion)
    ? value.latestVersion
    : null;
  const notification = value.lastNotification;
  const lastNotification =
    notification &&
    typeof notification === "object" &&
    parseSemver(notification.current) &&
    parseSemver(notification.latest)
      ? {
          current: notification.current,
          latest: notification.latest,
          at: validTimestamp(notification.at),
        }
      : null;
  const pending = value.pendingNotification;
  const pendingNotification =
    pending &&
    typeof pending === "object" &&
    parseSemver(pending.current) &&
    parseSemver(pending.latest) &&
    typeof pending.token === "string" &&
    pending.token.length <= 256
      ? {
          current: pending.current,
          latest: pending.latest,
          token: pending.token,
          at: validTimestamp(pending.at),
        }
      : null;
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    createdAt: validTimestamp(value.createdAt) || now,
    lastAttempt: validTimestamp(value.lastAttempt),
    lastSuccess: validTimestamp(value.lastSuccess),
    latestVersion,
    lastNotification,
    pendingNotification,
  };
}

function readSmallJson(filename) {
  if (!filename) {
    return null;
  }
  try {
    const stats = statSync(filename);
    if (!stats.isFile() || stats.size > MAX_JSON_BYTES) {
      return null;
    }
    return JSON.parse(readFileSync(filename, "utf8"));
  } catch {
    return null;
  }
}

function readState(filename, now) {
  return normalizeState(readSmallJson(filename), now);
}

function writeState(filename, state) {
  let temporaryFilename;
  try {
    mkdirSync(path.dirname(filename), { mode: 0o700, recursive: true });
    temporaryFilename = `${filename}.${process.pid}.${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}.tmp`;
    writeFileSync(temporaryFilename, `${JSON.stringify(state, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
      mode: 0o600,
    });
    renameSync(temporaryFilename, filename);
    return true;
  } catch {
    if (temporaryFilename) {
      try {
        unlinkSync(temporaryFilename);
      } catch {}
    }
    return false;
  }
}

function acquireLock(lockFile, now, staleAfter = LOCK_STALE_AFTER) {
  try {
    mkdirSync(path.dirname(lockFile), { mode: 0o700, recursive: true });
  } catch {
    return false;
  }
  const token = `${process.pid}:${Date.now()}:${Math.random()}`;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      writeFileSync(lockFile, token, {
        encoding: "utf8",
        flag: "wx",
        mode: 0o600,
      });
      return token;
    } catch (error) {
      if (error?.code !== "EEXIST") {
        return false;
      }
      try {
        const observedToken = readFileSync(lockFile, "utf8");
        const observedStats = statSync(lockFile);
        const age = now - observedStats.mtimeMs;
        if (!Number.isFinite(age) || age <= staleAfter) {
          return false;
        }
        const currentStats = statSync(lockFile);
        if (
          readFileSync(lockFile, "utf8") !== observedToken ||
          currentStats.dev !== observedStats.dev ||
          currentStats.ino !== observedStats.ino ||
          currentStats.mtimeMs !== observedStats.mtimeMs
        ) {
          return false;
        }
        if (readFileSync(lockFile, "utf8") !== observedToken) {
          return false;
        }
        unlinkSync(lockFile);
      } catch {
        return false;
      }
    }
  }
  return false;
}

function releaseLock(lockFile, token) {
  try {
    if (readFileSync(lockFile, "utf8") === token) {
      unlinkSync(lockFile);
    }
  } catch {}
}

function updateStateWithLock(
  paths,
  now,
  update,
  staleAfter = LOCK_STALE_AFTER,
) {
  const lockToken = acquireLock(paths.lockFile, now, staleAfter);
  if (!lockToken) {
    return null;
  }
  try {
    const existingState = readState(paths.cacheFile, now);
    const nextState = update(existingState || initialState(now), {
      exists: Boolean(existingState),
    });
    return nextState && writeState(paths.cacheFile, nextState)
      ? nextState
      : null;
  } finally {
    releaseLock(paths.lockFile, lockToken);
  }
}

function resolveCacheRoot(env, home, platform) {
  if (
    typeof env.XDG_CACHE_HOME === "string" &&
    path.isAbsolute(env.XDG_CACHE_HOME)
  ) {
    return env.XDG_CACHE_HOME;
  }
  if (platform === "win32") {
    if (
      typeof env.LOCALAPPDATA === "string" &&
      path.isAbsolute(env.LOCALAPPDATA)
    ) {
      return env.LOCALAPPDATA;
    }
    return home && path.isAbsolute(home)
      ? path.join(home, "AppData", "Local")
      : null;
  }
  if (!home || !path.isAbsolute(home)) {
    return null;
  }
  return platform === "darwin"
    ? path.join(home, "Library", "Caches")
    : path.join(home, ".cache");
}

function resolvePaths(packageName, runtime = {}) {
  const env = runtime.env ?? process.env;
  const home = runtime.home ?? homedir();
  const platform = runtime.platform ?? process.platform;
  const cacheRoot = runtime.cacheRoot ?? resolveCacheRoot(env, home, platform);
  if (!cacheRoot || !path.isAbsolute(cacheRoot)) {
    return null;
  }
  const encodedName = Buffer.from(packageName).toString("base64url");
  const directory = path.join(cacheRoot, "codsen", "update-notifier");
  const cacheFile =
    runtime.cacheFile ?? path.join(directory, `${encodedName}.json`);
  const lockFile = runtime.lockFile ?? `${cacheFile}.lock`;
  const configRoot =
    env.XDG_CONFIG_HOME || (home && path.join(home, ".config"));
  const legacyConfigFile =
    "legacyConfigFile" in runtime
      ? runtime.legacyConfigFile
      : configRoot &&
        path.join(
          configRoot,
          "configstore",
          `update-notifier-${packageName}.json`,
        );
  return { cacheFile, legacyConfigFile, lockFile };
}

function readLegacyConfig(filename) {
  const value = readSmallJson(filename);
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return {
    optOut: Boolean(value.optOut),
    lastUpdateCheck: validTimestamp(value.lastUpdateCheck),
    latestVersion: value.update?.latest,
  };
}

function isCi(env) {
  return (
    env.CI !== "0" &&
    env.CI !== "false" &&
    ("CI" in env ||
      "CONTINUOUS_INTEGRATION" in env ||
      Object.keys(env).some((key) => key.startsWith("CI_")))
  );
}

function isPackageManagerInvocation(env) {
  const userAgent = env.npm_config_user_agent;
  return (
    (typeof env.npm_package_json === "string" &&
      env.npm_package_json.endsWith("package.json")) ||
    (typeof userAgent === "string" &&
      ["npm", "yarn", "pnpm", "bun"].some((name) => userAgent.startsWith(name)))
  );
}

function isDisabled({
  argv,
  enabled,
  env,
  packageName,
  packageVersion,
  stderr,
}) {
  return (
    enabled === false ||
    !isValidPackageName(packageName) ||
    !parseSemver(packageVersion) ||
    stderr?.isTTY !== true ||
    "NO_UPDATE_NOTIFIER" in env ||
    env.NODE_ENV === "test" ||
    argv.includes("--no-update-notifier") ||
    isCi(env) ||
    isPackageManagerInvocation(env)
  );
}

function isCheckDue(state, now, options = {}) {
  const checkInterval = options.checkInterval ?? CHECK_INTERVAL;
  const failureBackoff = options.failureBackoff ?? FAILURE_BACKOFF;
  const successOrCreation = state.lastSuccess || state.createdAt;
  return (
    now - successOrCreation >= checkInterval &&
    (!state.lastAttempt || now - state.lastAttempt >= failureBackoff)
  );
}

function isNotificationDue(state, currentVersion) {
  const latestVersion = state.latestVersion;
  if (compareSemver(latestVersion, currentVersion) !== 1) {
    return false;
  }
  return !(
    state.lastNotification?.current === currentVersion &&
    state.lastNotification?.latest === latestVersion
  );
}

function formatCliUpdateNotification({
  currentVersion,
  latestVersion,
  packageName,
}) {
  return `\nUpdate available for ${packageName}: ${currentVersion} → ${latestVersion}\nhttps://www.npmjs.com/package/${encodeURIComponent(packageName)}\n\n`;
}

function hasActiveNotificationReservation(
  state,
  currentVersion,
  latestVersion,
  now,
  lease,
) {
  const pending = state.pendingNotification;
  return (
    pending?.current === currentVersion &&
    pending.latest === latestVersion &&
    now - pending.at < lease
  );
}

function registerNotification({
  currentVersion,
  now,
  onExit,
  packageName,
  paths,
  reservationToken,
  staleAfter,
  stderr,
}) {
  const finish = (code) => {
    const notificationTime = now();
    updateStateWithLock(
      paths,
      notificationTime,
      (state) => {
        if (state.pendingNotification?.token !== reservationToken) {
          return null;
        }
        if (code !== 0 || stderr?.isTTY !== true) {
          return { ...state, pendingNotification: null };
        }
        const notificationLatest = state.latestVersion;
        if (compareSemver(notificationLatest, currentVersion) !== 1) {
          return { ...state, pendingNotification: null };
        }
        try {
          stderr.write(
            formatCliUpdateNotification({
              currentVersion,
              latestVersion: notificationLatest,
              packageName,
            }),
          );
        } catch {
          return { ...state, pendingNotification: null };
        }
        return {
          ...state,
          lastNotification: {
            current: currentVersion,
            latest: notificationLatest,
            at: notificationTime,
          },
          pendingNotification: null,
        };
      },
      staleAfter,
    );
  };
  try {
    onExit(finish);
    return true;
  } catch {
    finish(1);
    return false;
  }
}

function spawnWorker(packageName, attemptToken, spawnImpl = spawn) {
  try {
    const child = spawnImpl(
      process.execPath,
      [MODULE_FILENAME, WORKER_FLAG, packageName, String(attemptToken)],
      {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      },
    );
    child.once?.("error", () => {});
    child.unref?.();
    return true;
  } catch {
    return false;
  }
}

function notifyOfCliUpdate({ enabled = true, pkg } = {}, runtime = {}) {
  try {
    const argv = runtime.argv ?? process.argv.slice(2);
    const env = runtime.env ?? process.env;
    const stderr = runtime.stderr ?? process.stderr;
    const packageName = pkg?.name;
    const packageVersion = pkg?.version;
    if (
      isDisabled({
        argv,
        enabled,
        env,
        packageName,
        packageVersion,
        stderr,
      })
    ) {
      return false;
    }
    const paths = resolvePaths(packageName, runtime);
    if (!paths) {
      return false;
    }
    const legacy = readLegacyConfig(paths.legacyConfigFile);
    if (legacy.optOut) {
      return false;
    }
    const now = runtime.now ?? Date.now;
    const currentTime = now();
    const staleAfter = runtime.lockStaleAfter ?? LOCK_STALE_AFTER;
    let state = readState(paths.cacheFile, currentTime);
    if (!state) {
      state = updateStateWithLock(
        paths,
        currentTime,
        (current, { exists }) =>
          exists ? current : initialState(currentTime, legacy),
        staleAfter,
      );
      if (!state) {
        return false;
      }
    }
    if (isNotificationDue(state, packageVersion)) {
      const reservationToken = `${process.pid}:${currentTime}:${Math.random()}`;
      const claimedState = updateStateWithLock(
        paths,
        currentTime,
        (current) => {
          const currentLatest = current.latestVersion;
          return isNotificationDue(current, packageVersion) &&
            !hasActiveNotificationReservation(
              current,
              packageVersion,
              currentLatest,
              currentTime,
              runtime.notificationLease ?? NOTIFICATION_LEASE,
            )
            ? {
                ...current,
                pendingNotification: {
                  current: packageVersion,
                  latest: currentLatest,
                  token: reservationToken,
                  at: currentTime,
                },
              }
            : null;
        },
        staleAfter,
      );
      if (!claimedState) {
        return false;
      }
      return registerNotification({
        currentVersion: packageVersion,
        now,
        onExit:
          runtime.onExit ?? ((listener) => process.once("exit", listener)),
        packageName,
        paths,
        reservationToken,
        staleAfter,
        stderr,
      });
    }
    if (
      !isCheckDue(state, currentTime, {
        checkInterval: runtime.checkInterval,
        failureBackoff: runtime.failureBackoff,
      })
    ) {
      return false;
    }
    const scheduledState = updateStateWithLock(
      paths,
      currentTime,
      (current) =>
        isCheckDue(current, currentTime, {
          checkInterval: runtime.checkInterval,
          failureBackoff: runtime.failureBackoff,
        })
          ? { ...current, lastAttempt: currentTime }
          : null,
      staleAfter,
    );
    if (!scheduledState) {
      return false;
    }
    const startWorker = runtime.spawnWorker ?? spawnWorker;
    return Boolean(startWorker(packageName, currentTime, runtime.spawnImpl));
  } catch {
    return false;
  }
}

async function readLimitedBody(response) {
  const contentLength = Number(response.headers?.get?.("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BYTES) {
    return null;
  }
  if (!response.body?.getReader) {
    const text = await response.text();
    return Buffer.byteLength(text) <= MAX_JSON_BYTES ? text : null;
  }
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = Buffer.from(value);
      total += chunk.length;
      if (total > MAX_JSON_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(chunk);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, total).toString("utf8");
}

async function fetchLatestVersion(packageName, runtime = {}) {
  const fetchImpl = runtime.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    return null;
  }
  const timeoutMs = runtime.fetchTimeout ?? FETCH_TIMEOUT;
  const controller = new AbortController();
  let timeout;
  const request = Promise.resolve()
    .then(async () => {
      const response = await fetchImpl(
        `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`,
        {
          headers: { accept: "application/json" },
          redirect: "follow",
          signal: controller.signal,
        },
      );
      if (!response?.ok) {
        return null;
      }
      const body = await readLimitedBody(response);
      if (body === null) {
        return null;
      }
      const version = JSON.parse(body).version;
      return parseSemver(version) ? version : null;
    })
    .catch(() => null);
  const timedOut = new Promise((resolve) => {
    timeout = setTimeout(() => {
      controller.abort();
      resolve(null);
    }, timeoutMs);
  });
  try {
    return await Promise.race([request, timedOut]);
  } finally {
    clearTimeout(timeout);
  }
}

async function runUpdateCheck(packageName, runtime = {}) {
  try {
    if (!isValidPackageName(packageName)) {
      return false;
    }
    const paths = resolvePaths(packageName, runtime);
    if (!paths) {
      return false;
    }
    const latestVersion = await fetchLatestVersion(packageName, runtime);
    if (!latestVersion) {
      return false;
    }
    const now = runtime.now ?? Date.now;
    const currentTime = now();
    return Boolean(
      updateStateWithLock(
        paths,
        currentTime,
        (state) =>
          runtime.expectedAttempt !== undefined &&
          state.lastAttempt !== runtime.expectedAttempt
            ? null
            : {
                ...state,
                lastSuccess: currentTime,
                latestVersion,
              },
        runtime.lockStaleAfter,
      ),
    );
  } catch {
    return false;
  }
}

function isWorkerInvocation(argv = process.argv) {
  return (
    argv[1] &&
    path.resolve(argv[1]) === path.resolve(MODULE_FILENAME) &&
    argv[2] === WORKER_FLAG
  );
}

if (isWorkerInvocation()) {
  const attemptToken = Number(process.argv[4]);
  await runUpdateCheck(process.argv[3], {
    expectedAttempt: Number.isSafeInteger(attemptToken)
      ? attemptToken
      : undefined,
  });
}

export {
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
};

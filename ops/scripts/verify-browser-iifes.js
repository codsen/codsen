import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import {
  findUnsupportedIifeApis,
  findUnsupportedIifeRegexpSyntax,
  IIFE_API_SMOKES,
  IIFE_BROWSER_POLICY,
  iifeGlobalName,
} from "../helpers/browserCompatibility.js";
import { readWorkspaceRecords } from "../helpers/workspaceInventoryFile.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

function usage() {
  return [
    "Usage: node ops/scripts/verify-browser-iifes.js [--browser <path>]",
    "       node ops/scripts/verify-browser-iifes.js --print-chromium-revision",
    "       node ops/scripts/verify-browser-iifes.js --print-chromium-version",
    "       node ops/scripts/verify-browser-iifes.js --print-chromium-archive-url",
    "       node ops/scripts/verify-browser-iifes.js --print-chromium-archive-sha256",
  ].join("\n");
}

function parseArguments(argv) {
  if (!argv.length) {
    return { mode: "verify", browserPath: undefined };
  }
  if (argv.length === 2 && argv[0] === "--browser" && argv[1]) {
    return { mode: "verify", browserPath: path.resolve(argv[1]) };
  }
  const printModes = new Map([
    ["--print-chromium-revision", IIFE_BROWSER_POLICY.snapshotRevision],
    ["--print-chromium-version", IIFE_BROWSER_POLICY.snapshotVersion],
    ["--print-chromium-archive-url", IIFE_BROWSER_POLICY.snapshotArchiveUrl],
    [
      "--print-chromium-archive-sha256",
      IIFE_BROWSER_POLICY.snapshotArchiveSha256,
    ],
  ]);
  if (argv.length === 1 && printModes.has(argv[0])) {
    return { mode: "print", value: printModes.get(argv[0]) };
  }
  throw new TypeError(usage());
}

function discoverIifePackages() {
  const packages = [];
  for (const { directory, manifest } of readWorkspaceRecords(repositoryRoot)) {
    const scriptExport = manifest.exports?.script;
    if (!scriptExport) {
      continue;
    }
    const directoryName = path.basename(directory);
    if (manifest.name !== directoryName) {
      throw new Error(
        `${directory}: browser IIFE package name must match its directory, got ${String(manifest.name)}`,
      );
    }
    const expectedExport = `./dist/${directoryName}.umd.js`;
    if (scriptExport !== expectedExport) {
      throw new Error(
        `${directory}: exports.script must be ${expectedExport}, got ${String(scriptExport)}`,
      );
    }
    packages.push({
      directory: directoryName,
      globalName: iifeGlobalName(directoryName),
      bundlePath: path.join(repositoryRoot, directory, scriptExport),
    });
  }
  packages.sort((left, right) => left.directory.localeCompare(right.directory));
  if (!packages.length) {
    throw new Error("No package exports a browser IIFE");
  }
  const duplicateGlobals = packages.filter(
    (item, index) =>
      packages.findIndex((other) => other.globalName === item.globalName) !==
      index,
  );
  if (duplicateGlobals.length) {
    throw new Error(
      `Duplicate IIFE globals: ${duplicateGlobals.map(({ globalName }) => globalName).join(", ")}`,
    );
  }
  return packages;
}

function loadBundles(packages) {
  return packages.map((item) => {
    let source;
    try {
      source = readFileSync(item.bundlePath, "utf8");
    } catch (error) {
      if (error?.code === "ENOENT") {
        throw new Error(
          `${item.directory}: missing ${path.relative(repositoryRoot, item.bundlePath)}; run the package build first`,
        );
      }
      throw error;
    }
    return { ...item, source };
  });
}

function verifyStaticApis(bundles) {
  const errors = [];
  for (const bundle of bundles) {
    const unsupported = findUnsupportedIifeApis(bundle.source);
    if (unsupported.length) {
      errors.push(`${bundle.directory}: ${unsupported.join(", ")}`);
    }

    // Syntax, not an API: esbuild does not rewrite regular-expression literals,
    // so one of these anywhere in the bundled closure is a parse error which
    // stops the whole bundle loading rather than one call failing.
    const unsupportedRegexpSyntax = findUnsupportedIifeRegexpSyntax(
      bundle.source,
    );
    if (unsupportedRegexpSyntax.length) {
      errors.push(`${bundle.directory}: ${unsupportedRegexpSyntax.join(", ")}`);
    }

    const segmenterReferences =
      bundle.source.match(/\bIntl\.Segmenter\b/gu)?.length ?? 0;
    if (
      segmenterReferences &&
      (bundle.directory !== "string-convert-indexes" ||
        segmenterReferences !== 2 ||
        !/typeof\s+Intl\.Segmenter\s*={2,3}\s*["']function["']\s*\?\s*new\s+Intl\.Segmenter\s*\(/u.test(
          bundle.source,
        ))
    ) {
      errors.push(
        `${bundle.directory}: Intl.Segmenter must use the audited feature-detected fallback`,
      );
    }

    const sharedArrayBufferReferences =
      bundle.source.match(/\bSharedArrayBuffer\b/gu)?.length ?? 0;
    if (
      sharedArrayBufferReferences &&
      (sharedArrayBufferReferences !== 2 ||
        !/typeof\s+SharedArrayBuffer\s*(?:<\s*["']u["']|!==?\s*["']undefined["'])\s*&&[^;]{0,120}\binstanceof\s+SharedArrayBuffer/u.test(
          bundle.source,
        ))
    ) {
      errors.push(
        `${bundle.directory}: SharedArrayBuffer must remain behind the audited typeof guard`,
      );
    }
  }
  if (errors.length) {
    throw new Error(
      `IIFEs contain APIs or syntax newer than ${IIFE_BROWSER_POLICY.esbuildTarget}:\n- ${errors.join("\n- ")}`,
    );
  }
}

function createEmulatedBrowserRealm() {
  const context = vm.createContext({
    console: Object.freeze({
      error() {},
      log() {},
      warn() {},
    }),
  });
  vm.runInContext(
    `
this.window = this;
this.self = this;
delete Array.prototype.at;
delete Array.prototype.findLast;
delete Array.prototype.findLastIndex;
delete Array.prototype.flat;
delete Array.prototype.flatMap;
delete Array.prototype.toReversed;
delete Array.prototype.toSorted;
delete Array.prototype.toSpliced;
delete Array.prototype.with;
delete Array.fromAsync;
delete Map.groupBy;
delete Object.hasOwn;
delete Object.fromEntries;
delete Object.groupBy;
delete Promise.prototype.finally;
delete Promise.allSettled;
delete Promise.any;
delete Promise.withResolvers;
delete RegExp.escape;
delete String.prototype.isWellFormed;
delete String.prototype.matchAll;
delete String.prototype.replaceAll;
delete String.prototype.toWellFormed;
delete String.prototype.trimEnd;
delete String.prototype.trimStart;
delete Symbol.prototype.description;
delete this.AbortController;
delete this.AbortSignal;
delete this.AggregateError;
delete this.Atomics;
delete this.BigInt;
delete this.BigInt64Array;
delete this.BigUint64Array;
delete this.FinalizationRegistry;
delete this.queueMicrotask;
delete this.SharedArrayBuffer;
delete this.structuredClone;
delete this.WeakRef;
if (this.Intl) {
  delete this.Intl.DisplayNames;
  delete this.Intl.ListFormat;
  delete this.Intl.Locale;
  delete this.Intl.PluralRules;
  delete this.Intl.RelativeTimeFormat;
  delete this.Intl.Segmenter;
  delete this.Intl.supportedValuesOf;
  delete this.Intl.NumberFormat.prototype.formatToParts;
  delete this.Intl.NumberFormat.prototype.formatRange;
  delete this.Intl.NumberFormat.prototype.formatRangeToParts;
  delete this.Intl.DateTimeFormat.prototype.formatRange;
  delete this.Intl.DateTimeFormat.prototype.formatRangeToParts;
}
delete this.globalThis;
`,
    context,
  );
  return context;
}

function verifyInEmulatedBrowser(bundles) {
  const packageNames = new Set(bundles.map(({ directory }) => directory));
  const missingSmokePackages = Object.keys(IIFE_API_SMOKES).filter(
    (packageName) => !packageNames.has(packageName),
  );
  if (missingSmokePackages.length) {
    throw new Error(
      `Browser smokes refer to missing IIFE packages: ${missingSmokePackages.join(", ")}`,
    );
  }

  let smokeCount = 0;
  let assertionCount = 0;
  for (const bundle of bundles) {
    const context = createEmulatedBrowserRealm();
    try {
      vm.runInContext(bundle.source, context, {
        filename: path.relative(repositoryRoot, bundle.bundlePath),
        timeout: 5_000,
      });
    } catch (error) {
      throw new Error(`${bundle.directory}: IIFE load failed`, {
        cause: error,
      });
    }
    const realmGlobal = vm.runInContext("this", context);
    if (
      Object.getOwnPropertyDescriptor(realmGlobal, bundle.globalName) ===
        undefined ||
      typeof realmGlobal[bundle.globalName] !== "object"
    ) {
      throw new Error(
        `${bundle.directory}: missing window.${bundle.globalName} after IIFE load`,
      );
    }
    const smoke = IIFE_API_SMOKES[bundle.directory];
    if (smoke) {
      try {
        assertionCount += vm.runInContext(
          `
(function () {
  var assertionCount = 0;
  function equal(actual, expected) {
    assertionCount += 1;
    var actualJson = JSON.stringify(actual);
    var expectedJson = JSON.stringify(expected);
    if (actualJson !== expectedJson) {
      throw new Error("Expected " + expectedJson + ", got " + actualJson);
    }
  }
  (${smoke.toString()})(this[${JSON.stringify(bundle.globalName)}], equal);
  return assertionCount;
})()
`,
          context,
          {
            filename: `${bundle.directory}-browser-smoke.js`,
            timeout: 5_000,
          },
        );
      } catch (error) {
        throw new Error(`${bundle.directory}: API smoke failed`, {
          cause: error,
        });
      }
      smokeCount += 1;
    }
  }
  return { assertionCount, smokeCount };
}

function scriptSafe(source) {
  return source.replace(/<\/script/giu, "<\\/script");
}

function renderCasePage(bundle, token) {
  const smoke = IIFE_API_SMOKES[bundle.directory];
  const smokeSource = smoke
    ? `(${scriptSafe(smoke.toString())})(api, equal);`
    : "";
  return `<!doctype html>
<meta charset="utf-8">
<script>
var loadErrors = [];
window.onerror = function (message, source, line, column, error) {
  loadErrors.push(error && error.stack ? String(error.stack) : String(message));
  return true;
};
</script>
<script src="/bundle/${bundle.directory}?token=${token}"></script>
<script>
(function () {
  var assertionCount = 0;
  function equal(actual, expected) {
    assertionCount += 1;
    var actualJson = JSON.stringify(actual);
    var expectedJson = JSON.stringify(expected);
    if (actualJson !== expectedJson) {
      throw new Error("Expected " + expectedJson + ", got " + actualJson);
    }
  }
  var result = {
    type: "codsen-iife-result",
    token: ${JSON.stringify(token)},
    packageName: ${JSON.stringify(bundle.directory)},
    ok: false,
    assertionCount: 0,
    error: null
  };
  try {
    if (loadErrors.length) {
      throw new Error(loadErrors.join("\\n"));
    }
    var globalName = ${JSON.stringify(bundle.globalName)};
    if (!Object.prototype.hasOwnProperty.call(window, globalName)) {
      throw new Error("Missing window." + globalName);
    }
    var api = window[globalName];
    if (!api || typeof api !== "object") {
      throw new Error("window." + globalName + " is not an API object");
    }
    ${smokeSource}
    result.ok = true;
    result.assertionCount = assertionCount;
  } catch (error) {
    result.error = error && error.stack ? String(error.stack) : String(error);
  }
  parent.postMessage(result, location.protocol + "//" + location.host);
})();
</script>`;
}

function renderRootPage(bundles, token) {
  return `<!doctype html>
<meta charset="utf-8">
<title>Codsen IIFE browser compatibility</title>
<script>
(function () {
  var packageNames = ${JSON.stringify(bundles.map(({ directory }) => directory))};
  var token = ${JSON.stringify(token)};
  var index = 0;
  var frame;
  function loadNext() {
    if (frame && frame.parentNode) {
      frame.parentNode.removeChild(frame);
    }
    if (index >= packageNames.length) {
      return;
    }
    frame = document.createElement("iframe");
    frame.hidden = true;
    frame.src = "/case/" + encodeURIComponent(packageNames[index]) +
      "?token=" + encodeURIComponent(token);
    document.body.appendChild(frame);
  }
  window.addEventListener("message", function (event) {
    var result = event.data || {};
    if (event.origin !== location.protocol + "//" + location.host ||
        result.type !== "codsen-iife-result" || result.token !== token ||
        result.packageName !== packageNames[index]) {
      return;
    }
    var request = new XMLHttpRequest();
    request.open("POST", "/result?token=" + encodeURIComponent(token), true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        index += 1;
        loadNext();
      }
    };
    request.send(JSON.stringify(result));
  });
  window.addEventListener("DOMContentLoaded", loadNext);
})();
</script>`;
}

function startBrowserHarness(bundles, token) {
  const bundleByName = new Map(
    bundles.map((bundle) => [bundle.directory, bundle]),
  );
  const results = new Map();
  let resolveResults;
  let rejectResults;
  const resultsPromise = new Promise((resolve, reject) => {
    resolveResults = resolve;
    rejectResults = reject;
  });
  const timeout = setTimeout(() => {
    rejectResults(
      new Error(
        `Timed out after ${results.size}/${bundles.length} Chromium IIFE results`,
      ),
    );
  }, 60_000);

  const server = createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    if (url.searchParams.get("token") !== token) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    if (request.method === "GET" && url.pathname === "/") {
      const body = renderRootPage(bundles, token);
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(body);
      return;
    }
    const route = /^\/(bundle|case)\/([^/]+)$/u.exec(url.pathname);
    if (request.method === "GET" && route) {
      const packageName = decodeURIComponent(route[2]);
      const bundle = bundleByName.get(packageName);
      if (!bundle) {
        response.writeHead(404).end("Unknown package");
        return;
      }
      if (route[1] === "bundle") {
        response.writeHead(200, {
          "Content-Type": "application/javascript; charset=utf-8",
        });
        response.end(bundle.source);
      } else {
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
        });
        response.end(renderCasePage(bundle, token));
      }
      return;
    }
    if (request.method === "POST" && url.pathname === "/result") {
      let body = "";
      request.setEncoding("utf8");
      request.on("data", (chunk) => {
        body += chunk;
        if (body.length > 65_536) {
          request.destroy(new Error("Browser result is too large"));
        }
      });
      request.on("end", () => {
        try {
          const result = JSON.parse(body);
          if (
            result.token !== token ||
            !bundleByName.has(result.packageName) ||
            results.has(result.packageName)
          ) {
            throw new Error("Invalid or duplicate browser result");
          }
          results.set(result.packageName, result);
          response.writeHead(204).end();
          if (results.size === bundles.length) {
            clearTimeout(timeout);
            resolveResults([...results.values()]);
          }
        } catch (error) {
          response.writeHead(400).end(String(error));
          rejectResults(error);
        }
      });
      return;
    }
    response.writeHead(404).end("Not found");
  });

  return new Promise((resolve, reject) => {
    server.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ port: address.port, resultsPromise, server, timeout });
    });
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function waitForExit(child, milliseconds) {
  if (child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let timeout;
    const onExit = () => {
      clearTimeout(timeout);
      resolve();
    };
    child.once("exit", onExit);
    timeout = setTimeout(() => {
      child.off("exit", onExit);
      resolve();
    }, milliseconds);
  });
}

function signalBrowserGroup(browser, signal) {
  if (!browser.pid) {
    return;
  }
  try {
    process.kill(-browser.pid, signal);
  } catch (error) {
    if (error?.code !== "ESRCH") {
      throw error;
    }
  }
}

function browserGroupExists(browser) {
  if (!browser.pid) {
    return false;
  }
  try {
    process.kill(-browser.pid, 0);
    return true;
  } catch (error) {
    if (error?.code === "ESRCH") {
      return false;
    }
    throw error;
  }
}

function waitForBrowserGroupExit(browser, milliseconds) {
  const deadline = Date.now() + milliseconds;
  return new Promise((resolve) => {
    const poll = () => {
      if (!browserGroupExists(browser)) {
        resolve(true);
      } else if (Date.now() >= deadline) {
        resolve(false);
      } else {
        setTimeout(poll, 50);
      }
    };
    poll();
  });
}

async function verifyInPinnedBrowser(bundles, browserPath) {
  const versionResult = spawnSync(browserPath, ["--version"], {
    encoding: "utf8",
  });
  const reportedVersion = (versionResult.stdout || "").trim();
  const versionDiagnostics = (versionResult.stderr || "").trim();
  const expectedVersion = `${IIFE_BROWSER_POLICY.family} ${IIFE_BROWSER_POLICY.snapshotVersion}`;
  if (versionResult.status !== 0 || reportedVersion !== expectedVersion) {
    throw new Error(
      `Expected ${expectedVersion}, got ${
        reportedVersion || "no version on stdout"
      }${versionDiagnostics ? `\nChromium stderr:\n${versionDiagnostics}` : ""}`,
    );
  }

  const token = randomBytes(24).toString("hex");
  const profileDirectory = mkdtempSync(
    path.join(tmpdir(), "codsen-browser-iifes-"),
  );
  const harness = await startBrowserHarness(bundles, token);
  const browser = spawn(
    browserPath,
    [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-extensions",
      "--disable-sync",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profileDirectory}`,
      `http://127.0.0.1:${harness.port}/?token=${token}`,
    ],
    { detached: true, stdio: ["ignore", "ignore", "pipe"] },
  );
  let browserOutput = "";
  browser.stderr.on("data", (chunk) => {
    browserOutput = `${browserOutput}${chunk}`.slice(-20_000);
  });
  const earlyExit = new Promise((_resolve, reject) => {
    browser.once("error", reject);
    browser.once("exit", (code, signal) => {
      reject(
        new Error(
          `Chromium exited before verification completed (${String(code ?? signal)})\n${browserOutput}`,
        ),
      );
    });
  });

  let verificationResult;
  let verificationError;
  try {
    let results;
    try {
      results = await Promise.race([harness.resultsPromise, earlyExit]);
    } catch (error) {
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}${
          browserOutput ? `\nChromium stderr:\n${browserOutput}` : ""
        }`,
        { cause: error },
      );
    }
    const failures = results.filter(({ ok }) => !ok);
    if (failures.length) {
      throw new Error(
        `Chromium IIFE failures:\n- ${failures
          .map(({ packageName, error }) => `${packageName}: ${error}`)
          .join("\n- ")}`,
      );
    }
    verificationResult = {
      assertionCount: results.reduce(
        (total, result) => total + result.assertionCount,
        0,
      ),
      reportedVersion,
    };
  } catch (error) {
    verificationError = error;
  }

  clearTimeout(harness.timeout);
  let cleanupError;
  try {
    signalBrowserGroup(browser, "SIGTERM");
    const [, browserGroupExited] = await Promise.all([
      waitForExit(browser, 3_000),
      waitForBrowserGroupExit(browser, 3_000),
    ]);
    if (!browserGroupExited) {
      signalBrowserGroup(browser, "SIGKILL");
      if (!(await waitForBrowserGroupExit(browser, 3_000))) {
        cleanupError = new Error(
          "Chromium process group did not exit after SIGKILL",
        );
      }
    }
  } catch (error) {
    cleanupError = error;
  }
  try {
    await closeServer(harness.server);
  } catch (error) {
    cleanupError ||= error;
  }
  try {
    rmSync(profileDirectory, { recursive: true, force: true });
  } catch (error) {
    cleanupError ||= error;
  }

  if (verificationError) {
    if (cleanupError) {
      throw new Error(
        `${verificationError instanceof Error ? verificationError.message : String(verificationError)}\nBrowser cleanup also failed: ${
          cleanupError instanceof Error ? cleanupError.message : cleanupError
        }`,
        { cause: verificationError },
      );
    }
    throw verificationError;
  }
  if (cleanupError) {
    throw cleanupError;
  }
  return verificationResult;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.mode === "print") {
    process.stdout.write(`${options.value}\n`);
    return;
  }

  const packages = discoverIifePackages();
  const bundles = loadBundles(packages);
  verifyStaticApis(bundles);
  const emulated = verifyInEmulatedBrowser(bundles);
  console.log(
    `Browser API emulation passed: ${bundles.length} IIFEs, ${emulated.smokeCount} API smokes, ${emulated.assertionCount} assertions.`,
  );

  if (options.browserPath) {
    const browser = await verifyInPinnedBrowser(bundles, options.browserPath);
    console.log(
      `${browser.reportedVersion} passed: ${bundles.length} IIFEs and ${browser.assertionCount} API assertions.`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

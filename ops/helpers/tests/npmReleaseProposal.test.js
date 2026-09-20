import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match, ok, throws } from "uvu/assert";

import {
  COMMITTED_PLAN_PATH,
  DEPENDENCY_FIELDS,
  PLAN_KIND,
  releasePackages,
} from "../npmReleasePlan.js";
import {
  applyReleaseProposal,
  createReleaseProposal,
} from "../npmReleaseProposal.js";

const cliFile = fileURLToPath(
  new URL("../../scripts/npm-release-proposal.js", import.meta.url),
);

function run(command, arguments_, cwd) {
  const result = spawnSync(command, arguments_, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_CONFIG_NOSYSTEM: "1",
      GIT_CONFIG_GLOBAL: path.join(cwd, "ignored/global-config"),
    },
  });
  if (result.error || result.status !== 0) {
    throw new Error(result.error?.message ?? result.stderr);
  }
  return result.stdout.trim();
}

function git(root, ...arguments_) {
  return run("git", ["-c", "core.hooksPath=/dev/null", ...arguments_], root);
}

function write(root, filename, contents) {
  const absolute = path.join(root, filename);
  mkdirSync(path.dirname(absolute), { recursive: true });
  writeFileSync(absolute, contents);
}

function writeJson(root, filename, contents) {
  write(root, filename, `${JSON.stringify(contents, null, 2)}\n`);
}

function withFixture(callback) {
  const temporaryRoot = mkdtempSync(path.join(tmpdir(), "release-proposal-"));
  const repositoryRoot = path.join(temporaryRoot, "fixture repository");
  mkdirSync(repositoryRoot);
  try {
    writeJson(repositoryRoot, "package.json", {
      private: true,
      type: "module",
    });
    write(repositoryRoot, ".gitignore", "ignored\n");
    write(repositoryRoot, "README.md", "base repository readme\n");
    write(repositoryRoot, "ops/trusted.js", "export const trusted = true;\n");
    writeJson(repositoryRoot, "ops/package-npm-status.json", {
      schemaVersion: 1,
      registry: "https://registry.npmjs.org",
      checkedAt: "2026-09-19T12:00:00.000Z",
      packages: {
        example: { status: "available", version: "1.0.0", deprecated: null },
      },
    });
    writeJson(repositoryRoot, "packages/example/package.json", {
      name: "example",
      version: "1.0.0",
    });
    write(
      repositoryRoot,
      "packages/example/README.md",
      "base package readme\n",
    );
    write(repositoryRoot, "packages/example/obsolete.txt", "obsolete\n");
    write(repositoryRoot, "packages/example/cli.js", "#!/usr/bin/env node\n");
    chmodSync(path.join(repositoryRoot, "packages/example/cli.js"), 0o755);
    writeJson(repositoryRoot, "data/package.json", {
      name: "@codsen/data",
      version: "1.0.0",
    });
    write(
      repositoryRoot,
      "data/sources/generated.ts",
      "export const version = 1;\n",
    );
    git(repositoryRoot, "init", "--quiet");
    git(repositoryRoot, "config", "user.name", "Release fixture");
    git(repositoryRoot, "config", "user.email", "fixture@example.invalid");
    git(repositoryRoot, "add", "--all");
    git(repositoryRoot, "commit", "--quiet", "--message", "fixture base");
    const baseSha = git(repositoryRoot, "rev-parse", "HEAD");
    const fixture = { temporaryRoot, repositoryRoot, baseSha };
    prepare(fixture);
    const proposal = createReleaseProposal(fixture);
    git(repositoryRoot, "reset", "--hard", "--quiet", baseSha);
    git(repositoryRoot, "clean", "-fd", "--quiet");
    callback({ ...fixture, proposal });
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

function prepare({ repositoryRoot, baseSha }) {
  const manifests = [
    ["data", { name: "@codsen/data", version: "1.0.1" }],
    ["packages/example", { name: "example", version: "1.0.1" }],
  ];
  for (const [directory, manifest] of manifests) {
    writeJson(repositoryRoot, `${directory}/package.json`, manifest);
  }
  const selected = manifests.map(([directory, manifest]) => ({
    baseVersion: "1.0.0",
    directory,
    manifest,
    name: manifest.name,
    version: manifest.version,
  }));
  const { layers, packages } = releasePackages(selected);
  writeJson(repositoryRoot, COMMITTED_PLAN_PATH, {
    baseRef: baseSha,
    baseSha,
    createdAt: "2026-09-07T12:00:00.000Z",
    dependencyFields: DEPENDENCY_FIELDS,
    kind: PLAN_KIND,
    layers,
    packages,
    plannedAtSha: baseSha,
    preparedTreeSha256: "a".repeat(64),
    schemaVersion: 1,
    selectedCount: packages.length,
    workspaceCount: 2,
  });
  write(repositoryRoot, "packages/example/README.md", "staged readme\n");
  git(repositoryRoot, "add", "--", "packages/example/README.md");
  write(
    repositoryRoot,
    "packages/example/README.md",
    "final unstaged readme\n",
  );
  writeJson(repositoryRoot, "packages/example/.all-contributorsrc", {
    contributors: [],
  });
  write(
    repositoryRoot,
    "packages/example/cli.js",
    "#!/usr/bin/env node\nthrow new Error('never execute');\n",
  );
  write(
    repositoryRoot,
    "data/sources/generated.ts",
    "export const version = 2;\n",
  );
  rmSync(path.join(repositoryRoot, "packages/example/obsolete.txt"));
}

function addedRecord(filename, contents = "untrusted data\n", mode = "100644") {
  return {
    path: filename,
    content: Buffer.from(contents).toString("base64"),
    mode,
  };
}

function adding(proposal, record) {
  const result = structuredClone(proposal);
  result.changes.push(record);
  result.changes.sort((left, right) =>
    left.path < right.path ? -1 : left.path > right.path ? 1 : 0,
  );
  return result;
}

function changingPlan(proposal, update) {
  const result = structuredClone(proposal);
  const record = result.changes.find(
    (change) => change.path === COMMITTED_PLAN_PATH,
  );
  const plan = JSON.parse(Buffer.from(record.content, "base64"));
  update(plan);
  record.content = Buffer.from(JSON.stringify(plan)).toString("base64");
  return result;
}

test("01 - the real CLI transfers staged, unstaged, added, deleted, and executable files as data", () => {
  withFixture(({ repositoryRoot, temporaryRoot, baseSha, proposal }) => {
    prepare({ repositoryRoot, baseSha });
    const artifact = path.join(temporaryRoot, "handoff.json");
    match(
      run(
        process.execPath,
        [cliFile, "create", "--base", baseSha, "--output", artifact],
        repositoryRoot,
      ),
      /Exported \d+ validated release changes/,
      "01.01",
    );
    equal(JSON.parse(readFileSync(artifact, "utf8")), proposal, "01.02");
    git(repositoryRoot, "reset", "--hard", "--quiet", baseSha);
    git(repositoryRoot, "clean", "-fd", "--quiet");
    match(
      run(
        process.execPath,
        [cliFile, "apply", "--base", baseSha, "--input", artifact],
        repositoryRoot,
      ),
      /Applied and staged \d+ validated release changes/,
      "01.03",
    );
    equal(
      readFileSync(
        path.join(repositoryRoot, "packages/example/README.md"),
        "utf8",
      ),
      "final unstaged readme\n",
      "01.04",
    );
    equal(git(repositoryRoot, "diff", "--name-only"), "", "01.05");
    equal(
      git(repositoryRoot, "diff", "--cached", "--name-only").split("\n"),
      proposal.changes.map((change) => change.path),
      "01.06",
    );
    equal(
      lstatSync(path.join(repositoryRoot, "packages/example/cli.js")).mode &
        0o777,
      0o755,
      "01.07",
    );
    ok(
      !existsSync(path.join(repositoryRoot, "packages/example/obsolete.txt")),
      "01.08",
    );
    ok(!existsSync(path.join(repositoryRoot, "node_modules")), "01.09");
  });
});

test("02 - both commands bind HEAD and the payload to a full trusted base SHA", () => {
  withFixture((fixture) => {
    throws(
      () => createReleaseProposal({ ...fixture, baseSha: "main" }),
      /full lowercase Git commit SHA/,
      "02.01",
    );
    throws(
      () => applyReleaseProposal({ ...fixture, baseSha: "b".repeat(40) }),
      /HEAD must equal/,
      "02.02",
    );
    const proposal = { ...fixture.proposal, baseSha: "c".repeat(40) };
    throws(
      () => applyReleaseProposal({ ...fixture, proposal }),
      /changeset base does not equal/,
      "02.03",
    );
  });
});

test("03 - privileged tooling, traversal, hidden configuration, and unknown workspaces are rejected", () => {
  withFixture((fixture) => {
    const paths = [
      "../README.md",
      "/README.md",
      "packages/example/../../ops/trusted.js",
      "packages/example//new.js",
      "packages/example/./new.js",
      "packages/example/bad\nname.js",
      "packages/example/back\\slash.js",
      "C:/outside.js",
      "ops/trusted.js",
      "package.json",
      ".github/workflows/ci.yml",
      "packages/example/.git/config",
      "packages/example/.gitattributes",
      "packages/example/.npmrc",
      "packages/example/node_modules/hook/index.js",
      "packages/new-workspace/package.json",
    ];
    for (const [index, filename] of paths.entries()) {
      const proposal = adding(fixture.proposal, addedRecord(filename));
      throws(
        () => applyReleaseProposal({ ...fixture, proposal }),
        /(?:unsafe|safe repository-relative|unexpected generated)/,
        `03.${String(index + 1).padStart(2, "0")}`,
      );
    }
    equal(git(fixture.repositoryRoot, "status", "--porcelain"), "", "03.17");
  });
});

test("04 - duplicate, overlapping, unsorted, and malformed file records are rejected", () => {
  withFixture((fixture) => {
    const duplicate = adding(fixture.proposal, fixture.proposal.changes[0]);
    throws(
      () => applyReleaseProposal({ ...fixture, proposal: duplicate }),
      /unique paths in sorted order/,
      "04.01",
    );
    const overlapping = adding(
      adding(fixture.proposal, addedRecord("packages/example/new")),
      addedRecord("packages/example/new/child.js"),
    );
    throws(
      () => applyReleaseProposal({ ...fixture, proposal: overlapping }),
      /overlapping change paths/,
      "04.02",
    );
    const unsorted = structuredClone(fixture.proposal);
    unsorted.changes.reverse();
    throws(
      () => applyReleaseProposal({ ...fixture, proposal: unsorted }),
      /unique paths in sorted order/,
      "04.03",
    );
    const malformed = adding(fixture.proposal, {
      path: "packages/example/new.js",
      mode: "100644",
      content: "not base64!",
    });
    throws(
      () => applyReleaseProposal({ ...fixture, proposal: malformed }),
      /canonical base64/,
      "04.04",
    );
    const extra = { ...fixture.proposal, run: "malicious command" };
    throws(
      () => applyReleaseProposal({ ...fixture, proposal: extra }),
      /must contain exactly/,
      "04.05",
    );
  });
});

test("05 - symbolic link and executable mode injections are rejected", () => {
  withFixture((fixture) => {
    for (const [index, mode] of ["120000", "160000", "100755"].entries()) {
      const proposal = adding(
        fixture.proposal,
        addedRecord("packages/example/new.js", "target", mode),
      );
      throws(
        () => applyReleaseProposal({ ...fixture, proposal }),
        /mode changes and new executable files/,
        `05.${String(index + 1).padStart(2, "0")}`,
      );
    }
    const modeChange = structuredClone(fixture.proposal);
    modeChange.changes.find(
      (change) => change.path === "packages/example/cli.js",
    ).mode = "100644";
    throws(
      () => applyReleaseProposal({ ...fixture, proposal: modeChange }),
      /mode changes and new executable files/,
      "05.04",
    );
    symlinkSync(
      fixture.temporaryRoot,
      path.join(fixture.repositoryRoot, "packages/example/ignored"),
    );
    const throughLink = adding(
      fixture.proposal,
      addedRecord("packages/example/ignored/escaped.js"),
    );
    throws(
      () => applyReleaseProposal({ ...fixture, proposal: throughLink }),
      /regular files beneath regular directories/,
      "05.05",
    );
    ok(!existsSync(path.join(fixture.temporaryRoot, "escaped.js")), "05.06");
    equal(git(fixture.repositoryRoot, "status", "--porcelain"), "", "05.07");
  });
});

test("06 - a late invalid record leaves every earlier path and the index untouched", () => {
  withFixture((fixture) => {
    const proposal = adding(
      fixture.proposal,
      addedRecord("packages/zzz-unknown/final.js"),
    );
    throws(
      () => applyReleaseProposal({ ...fixture, proposal }),
      /unexpected generated path/,
      "06.01",
    );
    equal(
      readFileSync(
        path.join(fixture.repositoryRoot, "packages/example/README.md"),
        "utf8",
      ),
      "base package readme\n",
      "06.02",
    );
    ok(
      !existsSync(path.join(fixture.repositoryRoot, COMMITTED_PLAN_PATH)),
      "06.03",
    );
    equal(git(fixture.repositoryRoot, "status", "--porcelain"), "", "06.04");
  });
});

test("07 - release plans must select the exact proposed versions and trusted workspace identities", () => {
  withFixture((fixture) => {
    const updates = [
      (plan) => {
        plan.baseSha = "a".repeat(40);
      },
      (plan) => {
        plan.plannedAtSha = "b".repeat(40);
      },
      (plan) => {
        plan.workspaceCount = 3;
      },
      (plan) => {
        plan.packages[1].directory = "packages/unknown";
      },
      (plan) => {
        plan.packages[1].version = "1.0.2";
      },
      (plan) => {
        plan.selectedCount = 0;
      },
      (plan) => {
        plan.preparedTreeSha256 = "invalid";
      },
    ];
    for (const [index, update] of updates.entries()) {
      const proposal = changingPlan(fixture.proposal, update);
      throws(
        () => applyReleaseProposal({ ...fixture, proposal }),
        /release plan/,
        `07.${String(index + 1).padStart(2, "0")}`,
      );
    }
    const missing = structuredClone(fixture.proposal);
    missing.changes = missing.changes.filter(
      (change) => change.path !== COMMITTED_PLAN_PATH,
    );
    throws(
      () => applyReleaseProposal({ ...fixture, proposal: missing }),
      /must create or update the release plan/,
      "07.08",
    );
    const identity = structuredClone(fixture.proposal);
    identity.changes.find(
      (change) => change.path === "packages/example/package.json",
    ).content = Buffer.from(
      JSON.stringify({ name: "impostor", version: "1.0.1" }),
    ).toString("base64");
    throws(
      () => applyReleaseProposal({ ...fixture, proposal: identity }),
      /workspace identity changed/,
      "07.09",
    );
    equal(git(fixture.repositoryRoot, "status", "--porcelain"), "", "07.10");
  });
});

test("08 - applying a changeset requires a pristine checkout", () => {
  withFixture((fixture) => {
    write(fixture.repositoryRoot, "README.md", "local edits\n");
    throws(() => applyReleaseProposal(fixture), /pristine checkout/, "08.01");
    git(fixture.repositoryRoot, "add", "README.md");
    throws(() => applyReleaseProposal(fixture), /pristine checkout/, "08.02");
    git(fixture.repositoryRoot, "reset", "--hard", "--quiet", fixture.baseSha);
    write(fixture.repositoryRoot, "untracked.txt", "local file\n");
    throws(() => applyReleaseProposal(fixture), /pristine checkout/, "08.03");
  });
});

test("09 - generation rejects symlinks and unexpected changed paths", () => {
  withFixture((fixture) => {
    prepare(fixture);
    symlinkSync(
      "README.md",
      path.join(fixture.repositoryRoot, "packages/example/link"),
    );
    throws(
      () => createReleaseProposal(fixture),
      /regular files beneath regular directories/,
      "09.01",
    );
    rmSync(path.join(fixture.repositoryRoot, "packages/example/link"));
    write(fixture.repositoryRoot, "ops/trusted.js", "untrusted replacement\n");
    throws(
      () => createReleaseProposal(fixture),
      /unexpected generated path/,
      "09.02",
    );
  });
});

test("10 - generated website charts survive the release proposal handoff", () => {
  withFixture((fixture) => {
    const filenames = [
      "dependency-molecule.html",
      "dependency-molecule.svg",
      "dependency-topology-narrow.svg",
      "dependency-topology.svg",
      "download-concentration-history.svg",
      "download-concentration.svg",
      "download-ranking.svg",
      "index.html",
      "interdependencies.svg",
      "summary.json",
    ];
    prepare(fixture);
    for (const filename of filenames) {
      write(
        fixture.repositoryRoot,
        `statistics/charts/${filename}`,
        `generated ${filename}\n`,
      );
    }
    const proposal = createReleaseProposal(fixture);
    equal(
      proposal.changes
        .filter((change) => change.path.startsWith("statistics/"))
        .map((change) => change.path),
      filenames.map((filename) => `statistics/charts/${filename}`),
      "10.01",
    );
    git(fixture.repositoryRoot, "reset", "--hard", "--quiet", fixture.baseSha);
    git(fixture.repositoryRoot, "clean", "-fd", "--quiet");
    applyReleaseProposal({ ...fixture, proposal });
    equal(
      filenames.map((filename) =>
        readFileSync(
          path.join(fixture.repositoryRoot, "statistics/charts", filename),
          "utf8",
        ),
      ),
      filenames.map((filename) => `generated ${filename}\n`),
      "10.02",
    );
    equal(git(fixture.repositoryRoot, "diff", "--name-only"), "", "10.03");
    equal(
      git(fixture.repositoryRoot, "diff", "--cached", "--name-only").split(
        "\n",
      ),
      proposal.changes.map((change) => change.path),
      "10.04",
    );
  });
});

test("11 - chart permission does not admit arbitrary statistics or executable charts", () => {
  withFixture((fixture) => {
    const paths = [
      "statistics/charts/README.md",
      "statistics/charts/unexpected.svg",
      "statistics/charts/client.js",
      "statistics/charts/nested/index.html",
      "statistics/charts/summary.json/child",
      "statistics/charts/.git/config",
      "statistics/npm-downloads/manifest.json",
      "statistics/index.html",
    ];
    for (const [index, filename] of paths.entries()) {
      const proposal = adding(fixture.proposal, addedRecord(filename));
      throws(
        () => applyReleaseProposal({ ...fixture, proposal }),
        /unexpected generated path/,
        `11.${String(index + 1).padStart(2, "0")}`,
      );
    }
    throws(
      () =>
        applyReleaseProposal({
          ...fixture,
          proposal: adding(
            fixture.proposal,
            addedRecord("statistics/charts/index.html", "payload", "100755"),
          ),
        }),
      /mode changes and new executable files/,
      "11.09",
    );
    equal(git(fixture.repositoryRoot, "status", "--porcelain"), "", "11.10");
  });
});

test("12 - refreshed npm status survives proposal creation and the staged handoff", () => {
  withFixture((fixture) => {
    const filename = "ops/package-npm-status.json";
    const snapshot = {
      schemaVersion: 1,
      registry: "https://registry.npmjs.org",
      checkedAt: "2026-09-20T12:00:00.000Z",
      packages: {
        example: {
          status: "available",
          version: "1.0.0",
          deprecated: "Retired",
        },
      },
    };
    prepare(fixture);
    writeJson(fixture.repositoryRoot, filename, snapshot);
    const proposal = createReleaseProposal(fixture);
    equal(
      proposal.changes
        .filter((change) => change.path.startsWith("ops/"))
        .map((change) => change.path),
      [filename],
      "12.01",
    );
    git(fixture.repositoryRoot, "reset", "--hard", "--quiet", fixture.baseSha);
    git(fixture.repositoryRoot, "clean", "-fd", "--quiet");
    applyReleaseProposal({ ...fixture, proposal });
    equal(
      JSON.parse(
        readFileSync(path.join(fixture.repositoryRoot, filename), "utf8"),
      ),
      snapshot,
      "12.02",
    );
    equal(git(fixture.repositoryRoot, "diff", "--name-only"), "", "12.03");
    equal(
      git(fixture.repositoryRoot, "diff", "--cached", "--name-only").split(
        "\n",
      ),
      proposal.changes.map((change) => change.path),
      "12.04",
    );
  });
});

test("13 - npm status permission excludes neighbouring files, executables and deletion", () => {
  withFixture((fixture) => {
    const filename = "ops/package-npm-status.json";
    for (const candidate of [
      "ops/package-npm-status.js",
      "ops/package-npm-status.json/child",
      "ops/package-kinds.json",
      "ops/helpers/npmPackageStatus.js",
    ]) {
      throws(
        () =>
          applyReleaseProposal({
            ...fixture,
            proposal: adding(fixture.proposal, addedRecord(candidate)),
          }),
        /unexpected generated path/,
      );
    }
    throws(
      () =>
        applyReleaseProposal({
          ...fixture,
          proposal: adding(
            fixture.proposal,
            addedRecord(filename, "{}", "100755"),
          ),
        }),
      /mode changes and new executable files/,
      "13.01",
    );
    throws(
      () =>
        applyReleaseProposal({
          ...fixture,
          proposal: adding(fixture.proposal, {
            path: filename,
            content: null,
            mode: null,
          }),
        }),
      /npm package status snapshot cannot be deleted/,
      "13.02",
    );
    equal(git(fixture.repositoryRoot, "status", "--porcelain"), "", "13.03");
    prepare(fixture);
    rmSync(path.join(fixture.repositoryRoot, filename));
    throws(
      () => createReleaseProposal(fixture),
      /npm package status snapshot cannot be deleted/,
      "13.04",
    );
  });
});

test.run();

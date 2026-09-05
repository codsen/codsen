import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectUpdates,
  makeDiffPredicate,
  Package,
  PackageGraph,
} from "@lerna-lite/core";
import { test } from "uvu";
import { equal } from "uvu/assert";

const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));
const policy = JSON.parse(
  readFileSync(path.join(repositoryRoot, "lerna.json"), "utf8"),
);

function git(root, ...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), "readme-release-policy-"));
  const manifests = [
    { name: "example", version: "1.0.0" },
    { name: "consumer", version: "1.0.0", dependencies: { example: "^1.0.0" } },
    { name: "unrelated", version: "1.0.0" },
  ];
  const packages = manifests.map((manifest) => {
    const location = path.join(root, "packages", manifest.name);
    mkdirSync(location, { recursive: true });
    writeFileSync(
      path.join(location, "package.json"),
      JSON.stringify(manifest),
    );
    writeFileSync(path.join(location, "README.md"), "Original copy\n");
    return new Package(manifest, location, root);
  });
  for (const file of [
    "README.md",
    "packages/example/AGENTS.md",
    "packages/example/CHANGELOG.md",
    "packages/example/docs/AGENTS.md",
    "packages/example/docs/CHANGELOG.md",
    "packages/example/docs/usage.md",
    "packages/example/src/main.js",
    "packages/example/perf/check.js",
    "packages/example/node_modules/fixture/index.js",
    "packages/example/.npmignore",
  ]) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), "Original\n");
  }
  git(root, "init", "--quiet");
  git(root, "config", "user.name", "Release policy test");
  git(root, "config", "user.email", "release-policy@example.com");
  git(root, "config", "commit.gpgsign", "false");
  git(root, "config", "core.hooksPath", "/dev/null");
  git(root, "add", "--force", ".");
  git(root, "commit", "--quiet", "--message", "chore: initial fixture");
  for (const pkg of packages) {
    git(root, "tag", `${pkg.name}@1.0.0`);
  }
  return { root, packages, graph: new PackageGraph(packages) };
}

test("01 - Lerna selects package READMEs while preserving explicit exclusions", () => {
  const { root, graph } = fixture();
  try {
    const hasDiff = makeDiffPredicate(
      "HEAD",
      { cwd: root },
      policy.ignoreChanges,
    );
    const cases = [
      ["packages/example/README.md", true],
      ["packages/example/AGENTS.md", false],
      ["packages/example/CHANGELOG.md", false],
      ["packages/example/docs/AGENTS.md", false],
      ["packages/example/docs/CHANGELOG.md", false],
      ["packages/example/docs/usage.md", true],
      ["packages/example/src/main.js", true],
      ["packages/example/perf/check.js", false],
      ["packages/example/node_modules/fixture/index.js", false],
      ["packages/example/.npmignore", false],
      ["README.md", false],
    ];
    for (let i = 0; i < cases.length; i++) {
      const [relative, expected] = cases[i];
      const filename = path.join(root, relative);
      const original = readFileSync(filename, "utf8");
      writeFileSync(filename, `${original}Changed\n`);
      equal(
        hasDiff(graph.get("example")),
        expected,
        `01.${String(i + 1).padStart(2, "0")}`,
      );
      writeFileSync(filename, original);
    }
    equal(hasDiff(graph.get("example")), false, "01.12");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("02 - a README change selects the package and its local dependents", () => {
  const { root, graph, packages } = fixture();
  try {
    writeFileSync(
      path.join(root, "packages/example/README.md"),
      "Updated marketing copy\n",
    );
    const updates = collectUpdates(
      packages,
      graph,
      { cwd: root },
      {
        ...policy.command.version,
        ignoreChanges: policy.ignoreChanges,
        isIndependent: true,
        since: "HEAD",
      },
    );
    equal(
      updates.map(({ name }) => name).sort(),
      ["consumer", "example"],
      "02.01",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("03 - README-only docs commits recommend a patch with the installed preset", () => {
  const { root } = fixture();
  try {
    writeFileSync(
      path.join(root, "packages/example/README.md"),
      "Updated marketing copy\n",
    );
    git(root, "add", "packages/example/README.md");
    git(
      root,
      "commit",
      "--quiet",
      "--message",
      "docs(example): advertise dependency status",
    );
    // Run the real calculator in the fixture's Git history without changing
    // this test process's working directory or invoking version mutations.
    const source = `
      import { Package } from ${JSON.stringify(import.meta.resolve("@lerna-lite/core"))};
      import { recommendVersion } from ${JSON.stringify(import.meta.resolve("@lerna-lite/version"))};
      const pkg = Package.lazy("./packages/example");
      const version = await recommendVersion(pkg, "independent", {
        rootPath: ${JSON.stringify(repositoryRoot)}
      }, "default");
      console.log(version);
    `;
    const version = execFileSync(
      process.execPath,
      ["--input-type=module", "--eval", source],
      {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    ).trim();
    equal(version, "1.0.1", "03.01");
    equal(git(root, "status", "--porcelain"), "", "03.02");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test.run();

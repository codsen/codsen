import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, ok } from "uvu/assert";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const workflow = readFileSync(
  path.join(repositoryRoot, ".github/workflows/prepare_release.yml"),
  "utf8",
);

function jobSection(name) {
  const start = workflow.indexOf(`\n  ${name}:\n`);
  if (start === -1) {
    return "";
  }
  const next = workflow.slice(start + 1).search(/\n {2}[\w-]+:\n/u);
  return next === -1
    ? workflow.slice(start)
    : workflow.slice(start, start + next + 1);
}

function steps(job) {
  return job.split(/\n {6}- name: /u).slice(1);
}

function permissions(job) {
  return job
    .match(/\n {4}permissions:\n((?: {6}[^\n]+\n)+)/u)?.[1]
    .trim()
    .split(/\n\s*/u);
}

const prepare = jobSection("prepare");
const propose = jobSection("propose");

test("01 - generation has read access and writes are isolated to proposing", () => {
  ok(workflow.includes("\npermissions:\n  contents: read\n"), "01.01");
  equal(
    permissions(prepare),
    ["contents: read", "pull-requests: read"],
    "01.02",
  );
  equal(
    permissions(propose),
    ["actions: write", "contents: write", "pull-requests: write"],
    "01.03",
  );
  ok(prepare.includes("if: github.ref == 'refs/heads/main'"), "01.04");
  ok(propose.includes("needs: prepare"), "01.05");
  ok(!prepare.includes("git push"), "01.06");
});

test("02 - both jobs start from the exact base without checkout credentials", () => {
  for (const [index, job] of [prepare, propose].entries()) {
    const checkouts = steps(job).filter((step) =>
      step.includes("uses: actions/checkout@"),
    );

    ok(checkouts.length === 1, `02.${String(index * 3 + 1).padStart(2, "0")}`);
    ok(
      checkouts[0].includes(`ref: \${{ github.sha }}`),
      `02.${String(index * 3 + 2).padStart(2, "0")}`,
    );
    ok(
      checkouts[0].includes("persist-credentials: false"),
      `02.${String(index * 3 + 3).padStart(2, "0")}`,
    );
  }
});

test("03 - the privileged job runs only trusted Node tooling without dependencies", () => {
  equal(
    [...propose.matchAll(/uses: ([^\n ]+)/gu)].map(
      (match) => match[1].split("@")[0],
    ),
    ["actions/checkout", "actions/setup-node", "actions/download-artifact"],
    "03.01",
  );
  const setup = steps(propose).find((step) =>
    step.includes("uses: actions/setup-node@"),
  );
  ok(setup.includes("node-version-file: .node-version"), "03.02");
  ok(setup.includes("package-manager-cache: false"), "03.03");
  ok(
    !/\b(?:npm|npx|yarn|pnpm|bun) (?:ci|install|run|exec|build)\b/u.test(
      propose,
    ),
    "03.04",
  );
  equal(
    [...propose.matchAll(/^\s*node ([^\n\\]+)/gmu)].map((match) =>
      match[1].trim(),
    ),
    [
      "ops/scripts/npm-release-proposal.js apply",
      "ops/scripts/npm-release.js summary",
    ],
    "03.05",
  );
});

test("04 - the proposal download binds to the producing upload ID and fails closed", () => {
  const output = prepare.match(
    /proposal_artifact_id: \$\{\{ steps\.([\w_]+)\.outputs\.artifact-id \}\}/u,
  );
  ok(output, "04.01");
  const upload = steps(prepare).find((step) =>
    step.includes(`id: ${output[1]}\n`),
  );
  ok(upload.includes("uses: actions/upload-artifact@"), "04.02");
  const download = steps(propose).find((step) =>
    step.includes("uses: actions/download-artifact@"),
  );
  ok(
    download.includes(
      `artifact-ids: \${{ needs.prepare.outputs.proposal_artifact_id || 'missing-artifact-id' }}`,
    ),
    "04.03",
  );
  ok(!/^\s+(?:name|pattern):/mu.test(download), "04.04");
  ok(
    download.includes(`path: \${{ runner.temp }}/npm-release-proposal`),
    "04.05",
  );
});

test("05 - hooks are disabled before validated changes reach summaries or commits", () => {
  const hooks = propose.indexOf("git config core.hooksPath /dev/null");
  const apply = propose.indexOf(
    "node ops/scripts/npm-release-proposal.js apply",
  );
  const summary = propose.indexOf("node ops/scripts/npm-release.js summary");
  const commit = propose.indexOf("git commit --no-verify");

  ok(hooks > -1 && apply > hooks, "05.01");
  ok(summary > apply && commit > summary, "05.02");
  const validation = steps(propose).find((step) =>
    step.includes("node ops/scripts/npm-release-proposal.js apply"),
  );
  ok(validation.includes('--base "$RELEASE_BASE"'), "05.03");
  ok(validation.includes('--input "$RELEASE_PROPOSAL_FILE"'), "05.04");
  ok(!propose.includes("continue-on-error:"), "05.05");
});

test("06 - expected revisions and branch names come from trusted workflow context", () => {
  const bases = [...workflow.matchAll(/RELEASE_BASE: ([^\n]+)/gu)];
  const branches = [...workflow.matchAll(/RELEASE_BRANCH: ([^\n]+)/gu)];

  ok(bases.length >= 3, "06.01");
  equal(
    bases.map((match) => match[1]),
    bases.map(() => `\${{ github.sha }}`),
    "06.02",
  );
  ok(branches.length >= 4, "06.03");
  equal(
    branches.map((match) => match[1]),
    branches.map(
      () => `release/npm-\${{ github.run_id }}-\${{ github.run_attempt }}`,
    ),
    "06.04",
  );
  // The artifact ID is the only value allowed across the generation job output.
  equal(
    [...propose.matchAll(/needs\.prepare\.outputs\.([\w_]+)/gu)].map(
      (match) => match[1],
    ),
    ["proposal_artifact_id"],
    "06.05",
  );
});

test("07 - same-repository duplicate guards and main freshness precede the push", () => {
  for (const [index, job] of [prepare, propose].entries()) {
    const duplicate = steps(job).find((step) => step.includes("gh pr list"));

    ok(
      duplicate.includes("--json headRefName,isCrossRepository,url"),
      `07.${String(index * 2 + 1).padStart(2, "0")}`,
    );
    ok(
      duplicate.includes(
        '.isCrossRepository == false) | select(.headRefName | startswith("release/npm-"))',
      ),
      `07.${String(index * 2 + 2).padStart(2, "0")}`,
    );
  }
  const duplicate = propose.indexOf("gh pr list");
  const refresh = propose.indexOf("git fetch origin main");
  const push = propose.indexOf("git push --set-upstream origin");
  ok(refresh > duplicate && push > refresh, "07.05");
  ok(
    propose.includes('if [ "$current_main" != "$RELEASE_BASE" ]; then'),
    "07.06",
  );
});

test("08 - the created proposal still receives explicit CI dispatch", () => {
  const push = propose.indexOf("git push --set-upstream origin");
  const open = propose.indexOf("gh pr create");
  const dispatch = propose.indexOf(
    'gh workflow run verify.yml --ref "$RELEASE_BRANCH"',
  );

  ok(open > push && dispatch > open, "08.01");
  ok(propose.includes('--branch "$RELEASE_BRANCH"'), "08.02");
  ok(propose.includes("--event workflow_dispatch"), "08.03");
  ok(propose.includes("if dispatch_landed; then"), "08.04");
});

test.run();

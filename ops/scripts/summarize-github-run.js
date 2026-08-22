#!/usr/bin/env node

import { appendFileSync } from "node:fs";

import { renderGithubRunSummary } from "../helpers/githubRunTiming.js";

function fail(message) {
  throw new Error(message);
}

const mode = process.argv[2];
if (!new Set(["ci", "release"]).has(mode) || process.argv.length !== 3) {
  fail("Usage: node ops/scripts/summarize-github-run.js <ci|release>");
}

const environment = process.env;
for (const name of [
  "GITHUB_API_URL",
  "GITHUB_REPOSITORY",
  "GITHUB_RUN_ID",
  "GITHUB_TOKEN",
]) {
  if (!environment[name]) {
    fail(`${name} is required`);
  }
}

const response = await fetch(
  `${environment.GITHUB_API_URL}/repos/${environment.GITHUB_REPOSITORY}/actions/runs/${environment.GITHUB_RUN_ID}/jobs?per_page=100`,
  {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${environment.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  },
);
if (!response.ok) {
  fail(`GitHub jobs API returned ${response.status} ${response.statusText}`);
}
const payload = await response.json();
const runResponse = await fetch(
  `${environment.GITHUB_API_URL}/repos/${environment.GITHUB_REPOSITORY}/actions/runs/${environment.GITHUB_RUN_ID}`,
  {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${environment.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  },
);
if (!runResponse.ok) {
  fail(
    `GitHub run API returned ${runResponse.status} ${runResponse.statusText}`,
  );
}
const run = await runResponse.json();
const { markdown } = renderGithubRunSummary(payload.jobs, {
  createdAt: run.created_at,
  excludedName:
    mode === "release" ? "Release timing summary" : "CI timing summary",
  mode,
});
process.stdout.write(markdown);
if (environment.GITHUB_STEP_SUMMARY) {
  appendFileSync(environment.GITHUB_STEP_SUMMARY, markdown);
}

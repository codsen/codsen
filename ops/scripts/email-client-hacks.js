#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  auditEmailClientHackTests,
  EMAIL_CLIENT_HACK_EXPECTATIONS,
  EMAIL_CLIENT_HACK_FIXTURE,
  EMAIL_CLIENT_HACK_TARGETS,
  EMAIL_CLIENT_HACK_TESTS,
  emailClientHackFixture,
  validateEmailClientHackExpectations,
  validateEmailClientHacks,
} from "../helpers/emailClientHacks.js";
import { writeGeneratedFile } from "../helpers/generatedFiles.js";

const [command = "check", ...extra] = process.argv.slice(2);
if (extra.length || !["check", "project"].includes(command))
  throw new Error(
    "Usage: node ops/scripts/email-client-hacks.js [check|project]",
  );

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const directory = path.join(root, "ops/email-client-hacks");
const provenance = JSON.parse(
  readFileSync(path.join(directory, "provenance.json"), "utf8"),
);
const cases = JSON.parse(
  readFileSync(path.join(directory, "cases.json"), "utf8"),
);
const report = validateEmailClientHacks(provenance, cases);
const contents = emailClientHackFixture(cases);
const postIds = new Set(Object.keys(cases));
for (const target of EMAIL_CLIENT_HACK_TARGETS) {
  const packageDirectory = path.join(root, "packages", target.package);
  const filename = path.join(packageDirectory, EMAIL_CLIENT_HACK_FIXTURE);
  if (command === "project")
    await mkdir(path.dirname(filename), { recursive: true });
  await writeGeneratedFile({
    filename,
    contents,
    mode: command === "project" ? "write" : "check",
    fixCommand: "npm run email-client-hacks:project",
  });
}
// Finish all projections before auditing tests, so initial fixture generation
// remains useful while package-owned assertions are being written.
for (const target of EMAIL_CLIENT_HACK_TARGETS) {
  validateEmailClientHackExpectations(
    cases,
    JSON.parse(
      readFileSync(
        path.join(
          root,
          "packages",
          target.package,
          EMAIL_CLIENT_HACK_EXPECTATIONS,
        ),
        "utf8",
      ),
    ),
    target.package,
  );
  auditEmailClientHackTests(
    readFileSync(
      path.join(root, "packages", target.package, EMAIL_CLIENT_HACK_TESTS),
      "utf8",
    ),
    target,
    postIds,
  );
}
console.log(
  `Email-client hacks: ${report.posts} pinned posts, ${report.variants} adaptations, ${EMAIL_CLIENT_HACK_TARGETS.length} package suites. Run package units to establish pass/fail; these checks do not establish email-client rendering compatibility.`,
);

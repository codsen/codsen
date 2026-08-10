import { readFileSync } from "node:fs";

// `tests` sits alongside `test` because both are established in this repo's
// history; the rest is the Conventional Commits set that @lerna-lite/version
// recognises when it derives version bumps and changelog entries.
const allowedTypes = [
  "build",
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "perf",
  "refactor",
  "revert",
  "style",
  "test",
  "tests",
];

const subjectMaxLength = 100;

const conventionalCommit = new RegExp(
  `^(${allowedTypes.join("|")})(\\([^()\\s][^()]*\\))?!?: (.+)$`,
);

// git writes these itself, or rewrites them away during an autosquash rebase
const exemptSubject = /^(Merge |Revert "|Reapply |fixup! |squash! |amend! )/;

function readSubject(messagePath) {
  const raw = readFileSync(messagePath, "utf8");
  // `git commit --verbose` appends the staged diff below a scissors line
  const [message] = raw.split(/^# -+ >8 -+.*$/m);
  const subject = message
    .split(/\r?\n/)
    .filter((line) => !line.startsWith("#"))
    .find((line) => line.trim().length);
  return subject ? subject.trim() : "";
}

function collectProblems(subject) {
  const problems = [];
  const match = conventionalCommit.exec(subject);
  if (!match) {
    problems.push(
      "it does not follow `type(optional scope): subject` — allowed types are " +
        allowedTypes.join(", "),
    );
    return problems;
  }
  const description = match[3];
  if (description.endsWith(".")) {
    problems.push("the subject ends with a full stop");
  }
  if (subject.length > subjectMaxLength) {
    problems.push(
      "the subject is " +
        subject.length +
        " characters long, over the " +
        subjectMaxLength +
        " character limit",
    );
  }
  return problems;
}

function reportProblems(subject, problems) {
  console.error(
    "Commit message rejected:\n\n  " +
      subject +
      "\n\n- " +
      problems.join("\n- ") +
      "\n\nExamples:\n" +
      "  fix: stop the parser choking on unclosed tags\n" +
      "  feat(cli): add a --quiet flag\n" +
      "  refactor!: drop the callback API\n",
  );
}

function verifyCommitMessage(messagePath) {
  if (!messagePath) {
    console.error("verify-commit-msg.js expects a commit message file path.");
    process.exitCode = 1;
    return;
  }
  const subject = readSubject(messagePath);
  if (!subject || exemptSubject.test(subject)) {
    return;
  }
  const problems = collectProblems(subject);
  if (problems.length) {
    reportProblems(subject, problems);
    process.exitCode = 1;
  }
}

verifyCommitMessage(process.argv[2]);

import { readFileSync } from "node:fs";
import { test } from "uvu";
import { equal, throws } from "uvu/assert";
import {
  auditEmailClientHackTests,
  EMAIL_CLIENT_HACK_COMMIT,
  EMAIL_CLIENT_HACK_REPOSITORY,
  emailClientHackFixture,
  validateEmailClientHackExpectations,
  validateEmailClientHacks,
} from "../emailClientHacks.js";

function catalogue() {
  const posts = Array.from({ length: 80 }, (_, index) => ({
    id: `2020-01-01-client-${index}`,
    path: `hacks/_posts/2020-01-01-client-${index}.md`,
    sha256: "a".repeat(64),
    client: "Example mail",
    status: "Working",
    variants: [`selector-${index}`],
  }));
  return {
    provenance: {
      schemaVersion: 1,
      repository: EMAIL_CLIENT_HACK_REPOSITORY,
      commit: EMAIL_CLIENT_HACK_COMMIT,
      posts,
    },
    cases: Object.fromEntries(
      posts.map(({ id, variants }) => [
        id,
        [
          {
            id: variants[0],
            input:
              '<style>.probe{color:red}</style><p class="probe">Example</p>',
            note: "Original input instantiates the targeting technique.",
          },
        ],
      ]),
    ),
  };
}

const target = { package: "html-crush", entrypoint: "crush" };
const ids = new Set(["2020-01-01-example"]);
const source = `
import { crush } from "../dist/html-crush.esm.js";
test("01 - 2020-01-01-example preserves syntax", () => {
  for (const { id, input } of cases["2020-01-01-example"]) {
    equal(crush(input).result, expected[id], "01.01");
  }
});
test.run();
`;

test("01 - validates the frozen inventory and its case mappings", () => {
  const { provenance, cases } = catalogue();
  equal(
    validateEmailClientHacks(provenance, cases),
    { posts: 80, variants: 80 },
    "01.01",
  );
});

test("02 - rejects a changed source identity or incomplete post inventory", () => {
  const { provenance, cases } = catalogue();
  for (const field of ["schemaVersion", "repository", "commit"])
    throws(
      () =>
        validateEmailClientHacks({ ...provenance, [field]: "changed" }, cases),
      /fixed upstream snapshot/,
    );
  throws(
    () =>
      validateEmailClientHacks(
        { ...provenance, posts: provenance.posts.slice(1) },
        cases,
      ),
    /80 pinned/,
  );
});

test("03 - rejects duplicate posts and unsafe or mismatched source paths", () => {
  const { provenance, cases } = catalogue();
  const original = provenance.posts[1];
  provenance.posts[1] = provenance.posts[0];
  throws(
    () => validateEmailClientHacks(provenance, cases),
    /Duplicate email-client hack post/,
  );
  provenance.posts[1] = { ...original, path: "hacks/_posts/../outside.md" };
  throws(
    () => validateEmailClientHacks(provenance, cases),
    /Invalid email-client hack post identity/,
  );
  provenance.posts[1] = { ...original, id: "different" };
  throws(
    () => validateEmailClientHacks(provenance, cases),
    /Invalid email-client hack post identity/,
  );
});

test("04 - requires source hashes and client metadata", () => {
  const { provenance, cases } = catalogue();
  const original = provenance.posts[0];
  provenance.posts[0] = { ...original, sha256: "missing" };
  throws(
    () => validateEmailClientHacks(provenance, cases),
    /Invalid upstream post SHA-256/,
  );
  for (const field of ["client", "status"]) {
    provenance.posts[0] = { ...original, [field]: "" };
    throws(
      () => validateEmailClientHacks(provenance, cases),
      /Missing upstream/,
    );
  }
});

test("05 - rejects missing and orphaned fixture entries", () => {
  const { provenance, cases } = catalogue();
  const id = provenance.posts[0].id;
  const original = cases[id];
  delete cases[id];
  throws(
    () => validateEmailClientHacks(provenance, cases),
    /Missing email-client hack cases/,
  );
  cases[id] = original;
  cases.orphan = original;
  throws(
    () => validateEmailClientHacks(provenance, cases),
    /case inventory differs/,
  );
});

test("06 - rejects duplicate or unpinned variants and missing adaptation notes", () => {
  const { provenance, cases } = catalogue();
  const id = provenance.posts[0].id;
  const original = cases[id][0];
  cases[id].push(original);
  throws(
    () => validateEmailClientHacks(provenance, cases),
    /duplicate email-client hack variant/,
  );
  cases[id] = [{ ...original, id: "unmapped" }];
  throws(
    () => validateEmailClientHacks(provenance, cases),
    /Pinned variant mapping differs/,
  );
  for (const field of ["input", "note"]) {
    cases[id] = [{ ...original, [field]: "" }];
    throws(
      () => validateEmailClientHacks(provenance, cases),
      /Missing input or adaptation note/,
    );
  }
});

test("07 - preserves uppercase source filenames and extensionless posts", () => {
  const { provenance, cases } = catalogue();
  const original = provenance.posts[0];
  for (const filename of [
    "2023-10-22-Seznam.md",
    "2023-12-19-apple-mail-ios-17",
  ]) {
    const id = filename.replace(/\.md$/u, "").toLowerCase();
    provenance.posts[0] = { ...original, id, path: `hacks/_posts/${filename}` };
    cases[id] = cases[original.id];
    delete cases[original.id];
    equal(validateEmailClientHacks(provenance, cases).posts, 80, "07.01");
    cases[original.id] = cases[id];
    delete cases[id];
  }
});

test("08 - projection retains exact code units without creating expectations", () => {
  const cases = {
    example: [
      {
        id: "selector",
        input: "\\\\&\r\n\u0000\ud800",
        note: "Preserve escapes.",
      },
    ],
  };
  const fixture = emailClientHackFixture(cases);
  equal(JSON.parse(fixture), cases, "08.01");
  equal(fixture.endsWith("\n"), true, "08.02");
});

test("09 - links static tests to local fixtures and the package's imported API", () => {
  equal(auditEmailClientHackTests(source, target, ids), 1, "09.01");
  equal(
    auditEmailClientHackTests(
      source
        .replace("{ crush }", "{ crush as run }")
        .replace("crush(input)", "run(input)"),
      target,
      ids,
    ),
    1,
    "09.02",
  );
  equal(
    auditEmailClientHackTests(
      source.replace(
        'equal(crush(input).result, expected[id], "01.01");',
        'const { options, result } = expected[id]; equal(crush(input, options).result, result, "01.01");',
      ),
      target,
      ids,
    ),
    1,
    "09.03",
  );
});

test("10 - rejects wrong-package imports, missing fixture references, and no assertions", () => {
  for (const changed of [
    source.replace(
      "../dist/html-crush.esm.js",
      "../dist/another-package.esm.js",
    ),
    source.replace("equal(", "report("),
    source.replace("crush(input)", "unrelated(input)"),
  ])
    throws(
      () => auditEmailClientHackTests(changed, target, ids),
      /must assert the imported package API/,
    );
});

test("11 - rejects missing, unknown, and duplicate tests", () => {
  throws(
    () => auditEmailClientHackTests("", target, ids),
    /Missing email-client hack tests/,
  );
  throws(
    () =>
      auditEmailClientHackTests(
        source.replace("01 - 2020-01-01-example", "01 - unknown"),
        target,
        ids,
      ),
    /Unknown or duplicate hack test/,
  );
  throws(
    () =>
      auditEmailClientHackTests(
        source + source.slice(source.indexOf("test(")),
        target,
        ids,
      ),
    /Unknown or duplicate hack test/,
  );
});

test("12 - rejects malformed JavaScript and dynamic test titles", () => {
  throws(
    () => auditEmailClientHackTests("test(", target, ids),
    /Cannot parse hack tests/,
  );
  throws(
    () =>
      auditEmailClientHackTests(
        source.replace('"01 - 2020-01-01-example preserves syntax"', "title"),
        target,
        ids,
      ),
    /must have static titles/,
  );
});

test("13 - rejects filtered inputs, conditional skips, and missing expectations", () => {
  for (const changed of [
    source.replace('cases["2020-01-01-example"]', "unrelated"),
    source.replace(
      'cases["2020-01-01-example"]',
      'cases["2020-01-01-example"].slice(1)',
    ),
    source.replace("equal(crush", "if (id) continue; equal(crush"),
    source.replace("equal(crush", "if (id) return; equal(crush"),
  ])
    throws(
      () => auditEmailClientHackTests(changed, target, ids),
      /must iterate every local fixture/,
    );
  throws(
    () =>
      auditEmailClientHackTests(
        source.replace("expected[id]", '"hardcoded"'),
        target,
        ids,
      ),
    /must assert the imported package API/,
  );
});

test("14 - requires exactly one package-owned expectation for every variant", () => {
  const { cases } = catalogue();
  const expected = Object.fromEntries(
    Object.values(cases)
      .flat()
      .map(({ id }) => [id, "Example"]),
  );
  equal(
    validateEmailClientHackExpectations(cases, expected, target.package),
    80,
    "14.01",
  );
  const first = Object.keys(expected)[0];
  delete expected[first];
  throws(
    () => validateEmailClientHackExpectations(cases, expected, target.package),
    /expectations differ/,
  );
  expected.orphan = "Example";
  throws(
    () => validateEmailClientHackExpectations(cases, expected, target.package),
    /expectations differ/,
  );
});

test("15 - the fixed catalogue gate runs locally and during hosted preparation", () => {
  const manifest = JSON.parse(
    readFileSync(new URL("../../../package.json", import.meta.url), "utf8"),
  );
  const action = readFileSync(
    new URL(
      "../../../.github/actions/verify-repository/action.yml",
      import.meta.url,
    ),
    "utf8",
  );
  const command = "npm run email-client-hacks:check";
  const step = action
    .split("\n    - name:")
    .find((section) => section.includes(command));

  equal(manifest.scripts.test.startsWith("npm run verify &&"), true, "15.01");
  equal(
    manifest.scripts.verify.split(" && ").filter((entry) => entry === command)
      .length,
    1,
    "15.02",
  );
  equal(
    manifest.scripts["email-client-hacks:check"],
    "node ./ops/scripts/email-client-hacks.js check",
    "15.03",
  );
  equal(action.split(command).length - 1, 1, "15.04");
  equal(
    step?.match(/\n {6}if: ([^\n]+)/u)?.[1],
    "inputs.phase != 'validate'",
    "15.05",
  );
  equal(step?.includes("continue-on-error"), false, "15.06");
});

test("16 - permits conditional supplements while requiring an unconditional baseline", () => {
  const baseline = 'equal(crush(input).result, expected[id], "01.01");';
  equal(
    auditEmailClientHackTests(
      source.replace(
        baseline,
        `${baseline} if (id.endsWith("special")) { equal(crush(input).result, expected[id], "01.02"); }`,
      ),
      target,
      ids,
    ),
    1,
    "16.01",
  );
  for (const conditional of [
    `if (id.endsWith("special")) { ${baseline} }`,
    `switch (id) { case "special": ${baseline} }`,
    'id === "special" ? equal(crush(input).result, expected[id], "01.01") : undefined;',
  ])
    throws(
      () =>
        auditEmailClientHackTests(
          source.replace(baseline, conditional),
          target,
          ids,
        ),
      /must assert the imported package API/,
    );
  throws(
    () =>
      auditEmailClientHackTests(
        source.replace("for (const", "if (false) for (const"),
        target,
        ids,
      ),
    /must iterate every local fixture/,
  );
});

test.run();

import { gzipSync } from "node:zlib";
import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  auditStandardsCatalogue,
  extractStandardsSections,
  sha256,
  standardsFixture,
  standardsTestCases,
  validateStandardsSources,
  validateStandardsTargets,
  verifySourceSnapshot,
} from "../standards.js";

function catalogue() {
  return {
    sources: [{ id: "html", anchors: ["start-tags"] }],
    requirements: [
      {
        id: "html-tags",
        state: "pilot",
        summary: "Preserve start-tag syntax",
        source: "html",
        anchors: ["start-tags"],
      },
    ],
    targets: [
      {
        package: "html-crush",
        entrypoint: "crush",
        tests: "test/standards-pilot.js",
        profiles: [{ id: "default", options: {} }],
      },
    ],
    cases: [
      {
        id: "void-br",
        requirement: "html-tags",
        input: "<br>",
        context: "HTML fragment",
        origin: "Original input derived from the standard",
        notes: "A fragment, not a complete document",
        classification: "standard-syntax",
      },
    ],
    coverage: [
      {
        target: "html-crush",
        caseId: "void-br",
        profile: "default",
        status: "covered",
      },
    ],
    tests: new Map([
      [
        "html-crush",
        standardsTestCases(
          'import { crush } from "../dist/html-crush.esm.js"; test("01 - void-br preserves the tag", () => { equal(crush(cases["void-br"]).result, "<br>", "01.01"); });',
          "standards-pilot.js",
        ),
      ],
    ]),
  };
}

function snapshot() {
  const html = Buffer.from(
    '<h2 id="start-tags">Start tags</h2><p>Definition</p>',
  );
  const archive = gzipSync(html);
  const license = Buffer.from("Upstream licence notice\n");
  return {
    html,
    archive,
    license,
    source: {
      id: "html",
      url: "https://example.test/spec.html",
      retrieved: "2026-09-20",
      archiveSha256: sha256(archive),
      sha256: sha256(html),
      license: { sha256: sha256(license) },
    },
  };
}

function sourceRecord(id = "html") {
  const { source } = snapshot();
  return {
    ...source,
    id,
    snapshot: `upstream/${id}.html.gz`,
    anchors: ["start-tags"],
    license: {
      ...source.license,
      url: "https://example.test/license",
      path: "upstream/license.txt",
    },
  };
}

function targetRecord() {
  return {
    ...catalogue().targets[0],
    fixture: "test/fixtures/standards/pilot.json",
    knownFailures: "test/fixtures/standards/known-failures.json",
  };
}

test("01 - verifies immutable source, archive, and licence identities", () => {
  const { html, archive, license, source } = snapshot();

  equal(
    verifySourceSnapshot(source, archive, license),
    html.toString("utf8"),
    "01.01",
  );
  equal(
    sha256("abc"),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    "01.02",
  );
});

test("02 - distinguishes archive, source, and licence hash corruption", () => {
  const { archive, license, source } = snapshot();

  throws(
    () => verifySourceSnapshot(source, Buffer.from("changed"), license),
    /Changed archive: html/,
  );
  throws(
    () => verifySourceSnapshot({ ...source, sha256: "bad" }, archive, license),
    /Changed source: html/,
  );
  throws(
    () => verifySourceSnapshot(source, archive, Buffer.from("changed")),
    /Changed licence: html/,
  );
});

test("03 - a matching archive digest does not excuse invalid gzip bytes", () => {
  const { license, source } = snapshot();
  const archive = Buffer.from("not a gzip stream");

  throws(() =>
    verifySourceSnapshot(
      { ...source, archiveSha256: sha256(archive) },
      archive,
      license,
    ),
  );
});

test("04 - a pinned snapshot requires its upstream URL and retrieval date", () => {
  const { archive, license, source } = snapshot();

  throws(
    () =>
      verifySourceSnapshot(
        { ...source, url: "file:///local" },
        archive,
        license,
      ),
    /Missing source URL: html/,
  );
  throws(
    () =>
      verifySourceSnapshot(
        { ...source, retrieved: "yesterday" },
        archive,
        license,
      ),
    /Missing source date: html/,
  );
});

test("05 - fixture projection preserves exact input data and a stable trailing newline", () => {
  const cases = [
    { id: "case-b", input: "<p>  🚀\r\n</p>", ignoredMetadata: true },
    { id: "case-a", input: '<img src="a>b">' },
  ];
  const expected =
    '{\n  "case-b": "<p>  🚀\\r\\n</p>",\n  "case-a": "<img src=\\"a>b\\">"\n}\n';

  equal(standardsFixture(cases), expected, "05.01");
  equal(cases[0].input, "<p>  🚀\r\n</p>", "05.02");
});

test("06 - heading extraction includes subsections and stops at the next peer heading", () => {
  const html =
    '<h2 id="tags">Tags &amp; values</h2><p>Definition <em>text</em>.</p><pre>&lt;br&gt;\n  &amp;</pre><h3 id="nested">Nested</h3><emu-grammar>Start : &lt; Name &gt;</emu-grammar><h2 id="next">Excluded</h2><pre>not included</pre>';

  equal(
    extractStandardsSections(html, ["tags"]),
    [
      {
        anchor: "tags",
        text: "Tags & values Definition text. <br> & Nested Start : < Name >",
        truncated: false,
        examples: [
          { text: "<br>\n  &", truncated: false },
          { text: "Start : < Name >", truncated: false },
        ],
        omittedExamples: 0,
      },
    ],
    "06.01",
  );
  equal(
    extractStandardsSections(html, ["nested"])[0].text,
    "Nested Start : < Name >",
    "06.02",
  );
});

test("07 - nonheading anchors retain only their own content", () => {
  const html =
    '<section id="definition"><p>A <dfn id="term">tag</dfn>.</p><pre>&lt;p&gt;</pre></section><p>Outside</p>';

  equal(extractStandardsSections(html, ["term"])[0].text, "tag", "07.01");
  equal(
    extractStandardsSections(html, ["definition"])[0].examples,
    [{ text: "<p>", truncated: false }],
    "07.02",
  );
});

test("08 - extraction reports text truncation and omitted examples", () => {
  const html = `<h2 id="long">Long</h2><p>${"x".repeat(4100)}</p><pre>${"y".repeat(2001)}</pre><pre>two</pre><pre>three</pre><pre>four</pre><pre>five</pre>`;
  const [section] = extractStandardsSections(html, ["long"]);

  equal(section.text.length, 4000, "08.01");
  equal(section.truncated, true, "08.02");
  equal(
    section.examples[0],
    { text: "y".repeat(2000), truncated: true },
    "08.03",
  );
  equal(section.examples.length, 4, "08.04");
  equal(section.omittedExamples, 1, "08.05");
});

test("09 - extraction rejects a stale or missing source anchor", () => {
  throws(
    () =>
      extractStandardsSections('<h2 id="present">Present</h2>', ["missing"]),
    /Missing source anchor: missing/,
  );
});

test("10 - test discovery ignores fake tests in comments and string data", () => {
  const source = `
    // test("00 - fake", () => equal(cases["fake"], ""));
    const quoted = 'test("00 - fake", () => equal(cases["fake"], ""));';
    test("01 - void-br preserved", () => {
      // equal(cases["comment"], "");
      const literal = 'equal(cases["string"], "")';
      equal(crush(cases["void-br"]).result, "<br>", "01.01");
    });
    test.run();
  `;

  equal(
    standardsTestCases(source, "pilot.js").map(
      ({ title, ids, assertions }) => ({ title, ids: [...ids], assertions }),
    ),
    [{ title: "01 - void-br preserved", ids: ["void-br"], assertions: 1 }],
    "10.01",
  );
});

test("11 - references and assertions outside a test cannot establish its coverage", () => {
  const source =
    'equal(cases["void-br"], "<br>"); test("01 - void-br preserved", () => {});';
  const [discovered] = standardsTestCases(source, "pilot.js");

  equal([...discovered.ids], [], "11.01");
  equal(discovered.assertions, 0, "11.02");
  throws(
    () => standardsTestCases('test("unfinished", () => {', "broken.js"),
    /Cannot parse standards tests: broken.js/,
  );
});

test("12 - a complete catalogue reports exact matrix and requirement counts", () => {
  equal(
    auditStandardsCatalogue(catalogue()),
    {
      cases: 1,
      targets: 1,
      pilotRequirements: 1,
      backlogRequirements: 0,
      covered: 1,
      "known-failure": 0,
      deferred: 0,
      "not-applicable": 0,
    },
    "12.01",
  );
});

test("13 - every target case and option profile needs a disposition", () => {
  const missing = catalogue();
  missing.coverage = [];
  throws(
    () => auditStandardsCatalogue(missing),
    /Missing coverage disposition: html-crush\/void-br\/default/,
  );

  const additionalProfile = catalogue();
  additionalProfile.targets[0].profiles.push({ id: "compact" });
  throws(
    () => auditStandardsCatalogue(additionalProfile),
    /This pilot requires exactly the empty default option profile/,
  );
});

test("14 - a target case and profile cannot have duplicate dispositions", () => {
  const data = catalogue();
  data.coverage.push({ ...data.coverage[0] });

  throws(
    () => auditStandardsCatalogue(data),
    /Duplicate coverage: html-crush\/void-br\/default/,
  );
});

test("15 - pilot requirements must reference a harvested source and anchor", () => {
  const unknownSource = catalogue();
  unknownSource.requirements[0].source = "missing";
  throws(
    () => auditStandardsCatalogue(unknownSource),
    /Unknown requirement source: html-tags/,
  );

  const unknownAnchor = catalogue();
  unknownAnchor.requirements[0].anchors = ["missing"];
  throws(
    () => auditStandardsCatalogue(unknownAnchor),
    /Unharvested anchor: html-tags#missing/,
  );

  const noAnchors = catalogue();
  noAnchors.requirements[0].anchors = [];
  throws(
    () => auditStandardsCatalogue(noAnchors),
    /Missing requirement anchors: html-tags/,
  );
});

test("16 - every case maps to a pilot requirement and retains provenance", () => {
  const unknownRequirement = catalogue();
  unknownRequirement.cases.push({
    ...unknownRequirement.cases[0],
    id: "unmapped-case",
    requirement: "unknown",
  });
  throws(
    () => auditStandardsCatalogue(unknownRequirement),
    /Unmapped case: unmapped-case/,
  );
  for (const [key, value, error] of [
    ["input", "", /Missing case input: void-br/],
    ["origin", "", /Missing case provenance\/context: void-br/],
    ["classification", "unknown", /Invalid case classification: void-br/],
  ]) {
    const data = catalogue();
    data.cases[0][key] = value;
    throws(() => auditStandardsCatalogue(data), error);
  }
});

test("17 - coverage cannot reference unknown targets cases profiles or statuses", () => {
  for (const [key, error] of [
    ["target", /Unknown coverage target\/case/],
    ["caseId", /Unknown coverage target\/case/],
    ["profile", /Unknown option profile/],
    ["status", /Invalid coverage status/],
  ]) {
    const data = catalogue();
    data.coverage[0][key] = "unknown";
    throws(() => auditStandardsCatalogue(data), error);
  }
});

test("18 - backlog requirements remain visible without claiming tested coverage", () => {
  const data = catalogue();
  data.requirements.push({
    id: "html-tree",
    state: "backlog",
    summary: "Tree construction",
    reason: "Needs a separate parser audit",
  });

  equal(auditStandardsCatalogue(data).backlogRequirements, 1, "18.01");
  equal(auditStandardsCatalogue(data).covered, 1, "18.02");
  data.cases[0].requirement = "html-tree";
  data.requirements.shift();
  throws(() => auditStandardsCatalogue(data), /Unmapped case: void-br/);
});

test("19 - backlog items require reasons and pilot items require cases", () => {
  const backlog = catalogue();
  backlog.requirements.push({
    id: "html-tree",
    state: "backlog",
    summary: "Tree construction",
  });
  throws(
    () => auditStandardsCatalogue(backlog),
    /Backlog requirement needs a reason: html-tree/,
  );

  const noCase = catalogue();
  noCase.cases = [];
  throws(
    () => auditStandardsCatalogue(noCase),
    /Pilot requirement has no case: html-tags/,
  );
});

test("20 - covered cases need both a fixture reference and an assertion", () => {
  for (const body of [
    'crush(cases["void-br"]);',
    'equal(crush("<br>").result, "<br>", "01.01");',
    '// equal(crush(cases["void-br"]).result, "<br>", "01.01");\n',
  ]) {
    const data = catalogue();
    data.tests.set(
      "html-crush",
      standardsTestCases(
        `import { crush } from "../dist/html-crush.esm.js"; test("01 - void-br preserved", () => { ${body} });`,
        "pilot.js",
      ),
    );
    throws(
      () => auditStandardsCatalogue(data),
      /Expected one numbered test using fixture and equal\(\)/,
    );
  }
});

test("21 - duplicate tests cannot double count one covered mapping", () => {
  const data = catalogue();
  data.tests.get("html-crush").push(...data.tests.get("html-crush"));

  throws(
    () => auditStandardsCatalogue(data),
    /Expected one numbered test using fixture and equal\(\)/,
  );
});

test("22 - covered tests require a numbered title instead of an arbitrary prefix", () => {
  const data = catalogue();
  data.tests.get("html-crush")[0].title = "un-numbered - void-br preserved";

  throws(() => auditStandardsCatalogue(data), /Expected one numbered test/);
});

test("23 - explicit noncovered dispositions require a reason", () => {
  for (const status of ["deferred", "not-applicable"]) {
    const data = catalogue();
    data.coverage[0].status = status;
    data.tests.clear();
    throws(() => auditStandardsCatalogue(data), /Missing disposition reason/);
    data.coverage[0].reason =
      "Explicitly outside this target's transformation contract";
    equal(auditStandardsCatalogue(data)[status], 1, "23.01");
    equal(auditStandardsCatalogue(data).covered, 0, "23.02");
  }
});

test("24 - a known failure needs exactly one local expected result", () => {
  const data = catalogue();
  data.coverage[0].status = "known-failure";
  data.coverage[0].reason = "Current implementation loses the tag boundary";
  data.tests.clear();
  throws(
    () => auditStandardsCatalogue(data),
    /Missing local known-failure expectation/,
  );
  data.failures = new Map([
    [
      "html-crush",
      [{ caseId: "void-br", profile: "default", expectedResult: "<br>" }],
    ],
  ]);

  equal(auditStandardsCatalogue(data)["known-failure"], 1, "24.01");
  data.failures
    .get("html-crush")
    .push({ ...data.failures.get("html-crush")[0] });
  throws(
    () => auditStandardsCatalogue(data),
    /Missing local known-failure expectation/,
  );
});

test("25 - resolved or orphaned known failures cannot remain silently listed", () => {
  const data = catalogue();
  data.failures = new Map([
    [
      "html-crush",
      [{ caseId: "void-br", profile: "default", expectedResult: "<br>" }],
    ],
  ]);

  throws(
    () => auditStandardsCatalogue(data),
    /Orphan known failure: html-crush\/void-br/,
  );
});

test("26 - identifiers and option profile IDs must be unique", () => {
  for (const [key, error] of [
    ["sources", /Duplicate source: html/],
    ["requirements", /Duplicate requirement: html-tags/],
    ["targets", /Duplicate target: html-crush/],
    ["cases", /Duplicate case: void-br/],
  ]) {
    const data = catalogue();
    data[key].push({ ...data[key][0] });
    throws(() => auditStandardsCatalogue(data), error);
  }
  const data = catalogue();
  data.targets[0].profiles.push({ id: "default" });
  throws(
    () => auditStandardsCatalogue(data),
    /Duplicate profile for html-crush: default/,
  );
});

test("27 - tests cannot silently refer to fixtures absent from the corpus", () => {
  const data = catalogue();
  data.tests.get("html-crush")[0].ids.add("unknown");

  throws(
    () => auditStandardsCatalogue(data),
    /Test references unknown case: html-crush\/unknown/,
  );
});

test("28 - the pilot rejects options that its coverage cannot associate with tests", () => {
  const data = catalogue();
  data.targets[0].profiles[0].options = { removeLineBreaks: true };

  throws(
    () => auditStandardsCatalogue(data),
    /This pilot requires exactly the empty default option profile/,
  );
});

test("29 - a fixture-only assertion cannot claim library API coverage", () => {
  const data = catalogue();
  data.tests.set(
    "html-crush",
    standardsTestCases(
      'import { crush } from "../dist/html-crush.esm.js"; test("01 - void-br preserved", () => { equal(cases["void-br"], "<br>", "01.01"); });',
      "pilot.js",
    ),
  );

  throws(
    () => auditStandardsCatalogue(data),
    /imported package API and default options/,
  );
});

test("30 - a nondefault API call cannot satisfy the default profile", () => {
  for (const options of [
    "{removeLineBreaks: true}",
    "{...options}",
    "options",
    "null",
  ]) {
    const data = catalogue();
    data.tests.set(
      "html-crush",
      standardsTestCases(
        `import { crush } from "../dist/html-crush.esm.js"; test("01 - void-br preserved", () => { equal(crush(cases["void-br"], ${options}).result, "<br>", "01.01"); });`,
        "pilot.js",
      ),
    );
    throws(
      () => auditStandardsCatalogue(data),
      /imported package API and default options/,
    );
  }
});

test("31 - an explicit empty options object is a default API invocation", () => {
  const data = catalogue();
  data.tests.set(
    "html-crush",
    standardsTestCases(
      'import { crush } from "../dist/html-crush.esm.js"; test("01 - void-br preserved", () => { equal(crush(cases["void-br"], {}).result, "<br>", "01.01"); });',
      "pilot.js",
    ),
  );

  equal(auditStandardsCatalogue(data).covered, 1, "31.01");
});

test("32 - the called entrypoint must come from that package's built ESM artifact", () => {
  for (const imported of [
    'import { crush } from "../dist/email-comb.esm.js";',
    'import { comb as crush } from "../dist/html-crush.esm.js";',
    'import { crush } from "html-crush";',
    "const crush = (input) => ({result: input});",
  ]) {
    const data = catalogue();
    data.tests.set(
      "html-crush",
      standardsTestCases(
        `${imported} test("01 - void-br preserved", () => { equal(crush(cases["void-br"]).result, "<br>", "01.01"); });`,
        "pilot.js",
      ),
    );
    throws(
      () => auditStandardsCatalogue(data),
      /imported package API and default options/,
    );
  }
});

test("33 - an expected fixture reference cannot mask passing another input to the API", () => {
  const data = catalogue();
  data.tests.set(
    "html-crush",
    standardsTestCases(
      'import { crush } from "../dist/html-crush.esm.js"; test("01 - void-br preserved", () => { equal(crush("<br>").result, cases["void-br"], "01.01"); });',
      "pilot.js",
    ),
  );

  throws(
    () => auditStandardsCatalogue(data),
    /imported package API and default options/,
  );
});

test("34 - source preflight allows identical shared licences without mutating records", () => {
  const sources = [sourceRecord("html-syntax"), sourceRecord("html-parsing")];
  const before = JSON.stringify(sources);

  equal(validateStandardsSources(sources), undefined, "34.01");
  equal(JSON.stringify(sources), before, "34.02");
});

test("35 - source preflight rejects duplicate source IDs", () => {
  throws(
    () => validateStandardsSources([sourceRecord(), sourceRecord()]),
    /Duplicate source: html/,
  );
  const source = sourceRecord();
  source.id = "html\n";
  throws(() => validateStandardsSources([source]), /Invalid source identifier/);
});

test("36 - source and licence URLs must be valid absolute HTTPS URLs", () => {
  for (const value of [
    "http://example.test/spec",
    "https://",
    "/spec",
    undefined,
  ]) {
    const source = sourceRecord();
    source.url = value;
    throws(
      () => validateStandardsSources([source]),
      /Invalid source URL: html/,
    );
    const licensed = sourceRecord();
    licensed.license.url = value;
    throws(
      () => validateStandardsSources([licensed]),
      /Invalid licence URL: html/,
    );
  }
});

test("37 - snapshots and licences stay within upstream with their expected file types", () => {
  for (const value of [
    "../html.html.gz",
    "/upstream/html.html.gz",
    "upstream/../html.html.gz",
    "upstream/./html.html.gz",
    "upstream\\html.html.gz",
    "upstream//html.html.gz",
    "outside/html.html.gz",
    "upstream/html.txt",
    "upstream/html\0.html.gz",
  ]) {
    const source = sourceRecord();
    source.snapshot = value;
    throws(
      () => validateStandardsSources([source]),
      /Invalid snapshot path: html/,
    );
  }
  for (const value of [
    "../license.txt",
    "upstream/license.html",
    "upstream/../license.txt",
  ]) {
    const source = sourceRecord();
    source.license.path = value;
    throws(
      () => validateStandardsSources([source]),
      /Invalid licence path: html/,
    );
  }
});

test("38 - distinct sources cannot overwrite the same archive destination", () => {
  const sources = [sourceRecord("one"), sourceRecord("two")];
  sources[1].snapshot = sources[0].snapshot;

  throws(
    () => validateStandardsSources(sources),
    /Conflicting source destination: upstream\/one.html.gz/,
  );
});

test("39 - a shared licence destination must agree on both URL and content hash", () => {
  for (const [field, value] of [
    ["url", "https://example.test/another-license"],
    ["sha256", "a".repeat(64)],
  ]) {
    const sources = [sourceRecord("one"), sourceRecord("two")];
    sources[1].license[field] = value;
    throws(
      () => validateStandardsSources(sources),
      /Conflicting source destination: upstream\/license.txt/,
    );
  }
});

test("40 - licence and snapshot destinations cannot collide", () => {
  const source = sourceRecord();
  source.license.path = source.snapshot;
  throws(
    () => validateStandardsSources([source]),
    /Conflicting source destination: upstream\/html.html.gz/,
  );

  const sources = [sourceRecord("one"), sourceRecord("two")];
  sources[1].snapshot = sources[0].license.path;
  throws(
    () => validateStandardsSources(sources),
    /Conflicting source destination: upstream\/license.txt/,
  );
});

test("41 - every source digest uses a complete lowercase SHA-256 hex value", () => {
  for (const value of [
    "a".repeat(63),
    "g".repeat(64),
    "A".repeat(64),
    `${"a".repeat(64)}\n`,
    undefined,
  ]) {
    for (const field of ["sha256", "archiveSha256", "license"]) {
      const source = sourceRecord();
      if (field === "license") source.license.sha256 = value;
      else source[field] = value;
      throws(
        () => validateStandardsSources([source]),
        /Invalid (source|archive|licence) SHA-256: html/,
      );
    }
  }
});

test("42 - retrieval dates must represent an actual calendar day", () => {
  for (const value of [
    "2026-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-9-20",
    "today",
    undefined,
  ]) {
    const source = sourceRecord();
    source.retrieved = value;
    throws(
      () => validateStandardsSources([source]),
      /Invalid source retrieval date: html/,
    );
  }
  const source = sourceRecord();
  source.retrieved = "2024-02-29";
  equal(validateStandardsSources([source]), undefined, "42.01");
});

test("43 - selected anchors must be unique nonempty IDs without whitespace", () => {
  for (const anchors of [
    [],
    [""],
    ["start tags"],
    ["start-tags", "start-tags"],
    [1],
    undefined,
  ]) {
    const source = sourceRecord();
    source.anchors = anchors;
    throws(
      () => validateStandardsSources([source]),
      /Invalid source anchors: html/,
    );
  }
});

test("44 - target preflight preserves valid package-local destinations", () => {
  const targets = [targetRecord()];
  const before = JSON.stringify(targets);

  equal(validateStandardsTargets(targets), undefined, "44.01");
  equal(JSON.stringify(targets), before, "44.02");
});

test("45 - fixture projection cannot overwrite known-failure expectations through aliases", () => {
  const target = targetRecord();
  target.knownFailures = "test/fixtures/standards/./pilot.json";

  throws(
    () => validateStandardsTargets([target]),
    /Conflicting target destinations: html-crush/,
  );
});

test("46 - fixture projection cannot overwrite its package test file", () => {
  const target = targetRecord();
  target.fixture = target.tests;

  throws(
    () => validateStandardsTargets([target]),
    /Conflicting target destinations: html-crush/,
  );
});

test("47 - target destination paths cannot escape their package or contain control characters", () => {
  for (const relative of [
    "../test/fixtures/pilot.json",
    "test/../fixtures/pilot.json",
    "/test/fixtures/pilot.json",
    "test\\fixtures\\pilot.json",
    "test/fixtures/pilot\0.json",
  ]) {
    for (const field of ["fixture", "tests", "knownFailures"]) {
      const target = targetRecord();
      target[field] = relative;
      throws(
        () => validateStandardsTargets([target]),
        /Invalid target .* path: html-crush/,
      );
    }
  }
});

test("48 - generated inputs and known failures must be JSON in the fixture directory", () => {
  for (const field of ["fixture", "knownFailures"]) {
    for (const relative of [
      "test/pilot.json",
      "src/pilot.json",
      "test/fixtures/pilot.js",
    ]) {
      const target = targetRecord();
      target[field] = relative;
      throws(
        () => validateStandardsTargets([target]),
        /must be JSON under test\/fixtures: html-crush/,
      );
    }
  }
});

test("49 - coverage tests must point to a JavaScript test file", () => {
  for (const relative of ["src/standards.js", "test/standards.json"]) {
    const target = targetRecord();
    target.tests = relative;
    throws(
      () => validateStandardsTargets([target]),
      /Target tests must be JavaScript under test: html-crush/,
    );
  }
});

test("50 - duplicate package targets fail preflight before projection", () => {
  throws(
    () => validateStandardsTargets([targetRecord(), targetRecord()]),
    /Duplicate target: html-crush/,
  );
});

test.run();

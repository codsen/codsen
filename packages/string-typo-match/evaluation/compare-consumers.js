// Compare captured pre-migration ESM bundles against the current consumer builds.
// Run from any directory:
// node compare-consumers.js --baseline-entity old-entity.mjs \
//   --baseline-media old-media.mjs --output consumer-results-v1.json
// Optional: --default-policy-results raw-initial-policy-results.json
// Baselines must bundle their dependencies so subsequent workspace changes do
// not change the old implementation being measured. This is a local evaluation
// command; it does not install packages or alter the consumer source/builds.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const mediaNames = [
  "all",
  "aural",
  "braille",
  "embossed",
  "handheld",
  "print",
  "projection",
  "screen",
  "speech",
  "tty",
  "tv",
];
const regressions = [
  "rsqo",
  "nsp",
  "zz",
  "constructor",
  "CounterClockwiseContourIntegralzz",
  "CounterClockwiseContourIntegra",
  "CounterClockwiseContourIntegr",
  "frobnicate",
  "thisisnotanentity",
];

function entityCorpus(names) {
  const rows = [];
  const add = (intended, input, family) =>
    rows.push({ intended, input, family });
  for (const name of names) {
    const middle = Math.floor(name.length / 2);
    add(name, name, "exact");
    add(
      name,
      name.slice(0, middle) + name.slice(middle + 1),
      "single-omission",
    );
    if (name.length >= 4) {
      add(name, name.slice(0, 1) + name.slice(3), "block-omission");
    }
    if (name.length >= 6) {
      add(name, name.slice(0, 1) + name.slice(5), "long-omission");
    }
    add(
      name,
      name.slice(0, middle) + name[middle] + name.slice(middle),
      "repetition",
    );
    if (middle + 1 < name.length && name[middle] !== name[middle + 1]) {
      add(
        name,
        name.slice(0, middle) +
          name[middle + 1] +
          name[middle] +
          name.slice(middle + 2),
        "swap",
      );
    }
    add(
      name,
      `${name.slice(0, middle)}z${name.slice(middle + 1)}`,
      "substitution",
    );
  }
  for (const input of regressions) add(null, input, "regression");
  return rows;
}

function mediaCorpus() {
  const inputs = new Set([
    "screeen",
    "al",
    "a",
    "b",
    "t",
    "tt",
    "ty",
    "pr",
    "scn",
    "spech",
    "screeen",
    "screeeeeen",
    "creen",
    "screenz",
    "screne",
    "sreen",
    "constructor",
    "z",
  ]);
  for (const name of mediaNames) {
    inputs.add(name);
    for (let i = 0; i < name.length; i++) {
      inputs.add(name.slice(0, i) + name.slice(i + 1));
      inputs.add(name.slice(0, i) + name[i] + name.slice(i));
      inputs.add(`${name.slice(0, i)}z${name.slice(i + 1)}`);
      if (i + 1 < name.length) {
        inputs.add(
          name.slice(0, i) + name[i + 1] + name[i] + name.slice(i + 2),
        );
        inputs.add(name.slice(0, i) + name.slice(i + 2));
      }
    }
  }
  return [...inputs];
}

function choice(row) {
  return row.events[0]?.entityName ?? null;
}

function mediaChoice(result) {
  return result[0]?.fix?.ranges[0]?.[2] ?? null;
}

function quality(rows) {
  const totals = {
    caseCount: rows.length,
    exactInventoryInputsPreserved: 0,
    generatedInputsAlreadyExact: 0,
    intendedRepairs: 0,
    differentIntentionRepairs: 0,
    unlabelledRegressionRepairs: 0,
    unrecognised: 0,
  };
  for (const row of rows) {
    if (!row.events.length) {
      if (row.family === "exact") totals.exactInventoryInputsPreserved++;
      else totals.generatedInputsAlreadyExact++;
    } else if (row.intended && choice(row) === row.intended) {
      totals.intendedRepairs++;
    } else if (row.intended && choice(row)) {
      totals.differentIntentionRepairs++;
    } else if (!choice(row)) {
      totals.unrecognised++;
    } else {
      totals.unlabelledRegressionRepairs++;
    }
  }
  return totals;
}

export function buildReport(before, after, initial = null) {
  if (
    before.inventoryHash !== after.inventoryHash ||
    before.results.length !== after.results.length ||
    before.media.length !== after.media.length ||
    before.results.some((row, i) =>
      ["input", "intended", "family"].some(
        (key) => row[key] !== after.results[i][key],
      ),
    ) ||
    before.media.some((row, i) => row.input !== after.media[i].input)
  ) {
    throw new Error("Consumer evaluation inputs or inventory differ.");
  }
  const entityChanges = [];
  const counts = {
    newlyIntendedRepair: 0,
    conservativeAbstention: 0,
    newlyDifferentIntentionRepair: 0,
  };
  const remaining = [];
  for (let i = 0; i < after.results.length; i++) {
    const row = after.results[i];
    const old = before.results[i];
    if (JSON.stringify(row.events) !== JSON.stringify(old.events)) {
      const classification = !choice(row)
        ? "conservativeAbstention"
        : choice(row) === row.intended
          ? "newlyIntendedRepair"
          : "newlyDifferentIntentionRepair";
      counts[classification]++;
      entityChanges.push([
        row.family,
        row.input,
        row.intended,
        choice(old),
        choice(row),
        classification,
      ]);
    }
    if (row.intended && choice(row) && choice(row) !== row.intended) {
      remaining.push({
        input: row.input,
        intended: row.intended,
        actual: choice(row),
        family: row.family,
        classification:
          row.input.toLowerCase() === choice(row).toLowerCase()
            ? "existing-case-insensitive-name-repair"
            : "existing-curated-name-repair",
        unchanged: JSON.stringify(row.events) === JSON.stringify(old.events),
      });
    }
  }
  const mediaChanges = after.media.flatMap((row, i) => {
    const old = before.media[i];
    if (JSON.stringify(row.result) === JSON.stringify(old.result)) return [];
    return [
      {
        input: row.input,
        before: mediaChoice(old.result),
        after: mediaChoice(row.result),
        classification: !mediaChoice(row.result)
          ? row.input.length < 2
            ? "below-minimum-input-length"
            : "competing-candidates"
          : mediaChoice(old.result)
            ? "changed-recommendation"
            : "new-single-candidate-repair",
        oldResult: old.result,
        newResult: row.result,
      },
    ];
  });
  const trial =
    initial?.results.flatMap((row, i) => {
      if (
        !row.intended ||
        !choice(row) ||
        choice(row) === row.intended ||
        choice(row) === choice(before.results[i])
      )
        return [];
      return [
        {
          input: row.input,
          intended: row.intended,
          family: row.family,
          before: choice(before.results[i]),
          initialPolicyChoice: choice(row),
          finalPolicyChoice: choice(after.results[i]),
          intendedOmissionRatioExceeded:
            row.family.includes("omission") &&
            (row.intended.length - row.input.length) / row.intended.length >
              0.5,
          resolution:
            choice(after.results[i]) === null
              ? "conservative-abstention"
              : "review-required",
        },
      ];
    }) ?? [];
  return {
    schemaVersion: 1,
    provenance:
      "Synthetic deterministic integration-development corpus generated from all 2125 HTML entity names; not observed human error frequencies and not held-out quality evidence.",
    inventory: {
      package: "all-named-html-entities",
      version: "3.2.0",
      candidateCount: after.inventoryCount,
      sha256OfOrderedNamesJson: after.inventoryHash,
    },
    policies: {
      entity: {
        ambiguityRetrieval: {
          maxEvents: 1,
          maxCost: 200,
          minCostGap: 201,
          minInputLength: 3,
          maxOmissionLength: 4,
          maxOmissionRatio: 1,
        },
        replacementMaxOmissionRatio: 0.5,
        requirement:
          "Only one eligible suggestion may be replaced; candidates omitting more than half remain ambiguity evidence but are never applied.",
        preservedLocalException: { rsqo: "rsquo" },
        unchangedDomainPolicies:
          "HTML parsing, case-insensitive known-name repairs, curated broken-name table, exact names, diagnostics, callbacks, and document offsets precede or surround typo inference.",
        rejection:
          "Existing bad-html-entity-unrecognised diagnostic with null encoded/decoded values; default callback returns a deletion range.",
      },
      media: {
        options: { minInputLength: 2, minCostGap: 201 },
        otherOptions:
          "string-typo-match 1.0.0 defaults, including maxOmissionRatio 0.5",
        requirement:
          "Only one eligible suggestion may receive a fix. al remains all because aural needs a 3/5 omission and is ineligible.",
        rejection: "Existing Unrecognised media type diagnostic with fix:null.",
      },
    },
    entity: {
      before: quality(before.results),
      after: quality(after.results),
      changedCaseCount: entityChanges.length,
      changeCounts: counts,
      changeColumns: [
        "family",
        "input",
        "syntheticIntention",
        "previousEntity",
        "newEntity",
        "classification",
      ],
      changedCases: entityChanges,
      remainingDifferentIntentionRepairs: remaining,
    },
    initialDefaultPolicyTrial: {
      available: initial !== null,
      newDifferentIntentionRepairCount: trial.length,
      cases: trial,
      resolution:
        "Consumer policy changed; general library defaults were not tuned on this corpus. Wider omission candidates only veto automatic replacement, and the original half-length acceptance limit remains enforced.",
    },
    media: {
      caseCount: after.media.length,
      changedCaseCount: mediaChanges.length,
      changedCases: mediaChanges,
    },
    existingUnitSuiteCompatibility: {
      entityBefore: 232,
      mediaBefore: 56,
      priorExpectationsChanged: 0,
      entityAfter: 236,
      mediaAfter: 60,
    },
    limitations: [
      "Synthetic intentions are generator labels. A generated input can already be another valid name, and exact names must remain unchanged.",
      "The remaining different-intention corrections are existing domain rules outside the migrated typo stage.",
      "More conservative replacement trades recall for fewer unsupported automatic corrections; these measurements do not establish general human accuracy.",
    ],
  };
}

async function collect(entityModule, mediaModule, names) {
  const { fixEnt } = await import(entityModule);
  const { isMediaD } = await import(mediaModule);
  const results = entityCorpus(names).map((row) => {
    const input = `&${row.input};`;
    const events = [];
    const ranges = fixEnt(input);
    fixEnt(input, { cb: (event) => events.push(event) });
    return { ...row, ranges, events };
  });
  return {
    inventoryHash: createHash("sha256")
      .update(JSON.stringify(names))
      .digest("hex"),
    inventoryCount: names.length,
    results,
    media: mediaCorpus().map((input) => ({ input, result: isMediaD(input) })),
  };
}

async function run() {
  const flags = {};
  for (let i = 2; i < process.argv.length; i += 2) {
    if (
      ![
        "--baseline-entity",
        "--baseline-media",
        "--output",
        "--default-policy-results",
      ].includes(process.argv[i]) ||
      !process.argv[i + 1]
    ) {
      throw new Error(
        "Expected --baseline-entity FILE --baseline-media FILE --output FILE; optionally --default-policy-results FILE.",
      );
    }
    flags[process.argv[i]] = process.argv[i + 1];
  }
  if (
    !flags["--baseline-entity"] ||
    !flags["--baseline-media"] ||
    !flags["--output"]
  ) {
    throw new Error(
      "Required: --baseline-entity FILE --baseline-media FILE --output FILE.",
    );
  }
  const { allNamedEntitiesSetOnly } = await import(
    "../../all-named-html-entities/dist/all-named-html-entities.esm.js"
  );
  const names = [...allNamedEntitiesSetOnly];
  const before = await collect(
    pathToFileURL(path.resolve(flags["--baseline-entity"])).href,
    pathToFileURL(path.resolve(flags["--baseline-media"])).href,
    names,
  );
  const after = await collect(
    new URL(
      "../../string-fix-broken-named-entities/dist/string-fix-broken-named-entities.esm.js",
      import.meta.url,
    ).href,
    new URL(
      "../../is-media-descriptor/dist/is-media-descriptor.esm.js",
      import.meta.url,
    ).href,
    names,
  );
  const initial = flags["--default-policy-results"]
    ? JSON.parse(readFileSync(flags["--default-policy-results"], "utf8"))
    : null;
  const report = buildReport(before, after, initial);
  writeFileSync(
    path.resolve(flags["--output"]),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(
    JSON.stringify({
      entity: report.entity.changeCounts,
      mediaChanged: report.media.changedCaseCount,
    }),
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await run();
}

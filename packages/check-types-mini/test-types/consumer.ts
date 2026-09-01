import {
  CheckTypesMiniError,
  checkTypesMini,
  defaults,
  type CompletionStats,
  type Schema,
} from "check-types-mini";

interface BuildOptions {
  enabled: boolean;
  metadata: {
    owner: string;
  };
  transform: (value: string) => string;
}

const input: BuildOptions = {
  enabled: true,
  metadata: { owner: "team" },
  transform: (value) => value.trim(),
};
const reference: BuildOptions = {
  enabled: false,
  metadata: { owner: "" },
  transform: (value) => value,
};
const schema: Schema = {
  enabled: "boolean",
  metadata: {
    owner: "string",
  },
  transform: "function",
};
const readonlyPatterns = ["metadata.*"] as const;

checkTypesMini(input, reference);
checkTypesMini(input, null, {
  ignorePaths: readonlyPatterns,
  schema,
});
checkTypesMini({ "literal.dot": 1 }, null, {
  schema: { "literal\\.dot": "number" },
});

const completion: CompletionStats = {
  arrayElementsVisited: 0,
  maxDepth: 2,
  objectPropertiesVisited: 4,
  schemaEntries: 4,
  timeTakenInMilliseconds: 0,
  valuesIgnored: 0,
  valuesValidated: 4,
};
const error = new CheckTypesMiniError("THROW_ID_21", "wrong type", {
  actualType: "string",
  context: "consumer",
  expectedTypes: ["boolean"],
  path: ["enabled"],
});
const code: string = error.validatorCode;
const path: readonly string[] = error.path;
const from = defaults.reportProgressFuncFrom;

void completion;
void code;
void path;
void from;

// @ts-expect-error -- the checked root must be an object.
checkTypesMini("input", null, { enforceStrictKeyset: false });

// @ts-expect-error -- root arrays are not part of the public contract.
checkTypesMini([], null, { enforceStrictKeyset: false });

// @ts-expect-error -- callable roots are not plain objects.
checkTypesMini(() => true, null, { enforceStrictKeyset: false });

// @ts-expect-error -- built-in object instances are not plain roots.
checkTypesMini(new Date(), null, { enforceStrictKeyset: false });

// @ts-expect-error -- reference arrays are not part of the public contract.
checkTypesMini({}, [], { enforceStrictKeyset: false });

// @ts-expect-error -- the reference argument is positionally required.
checkTypesMini({});

// @ts-expect-error -- ignore patterns must contain only strings.
checkTypesMini({}, null, { enforceStrictKeyset: false, ignoreKeys: [1] });

// @ts-expect-error -- schema descriptors cannot be numbers.
checkTypesMini({ value: 1 }, null, { schema: { value: 1 } });

checkTypesMini({ value: () => true }, null, {
  // @ts-expect-error -- schema descriptors cannot be functions.
  schema: { value: () => true },
});

checkTypesMini({}, null, {
  enforceStrictKeyset: false,
  // @ts-expect-error -- progress must be reported through a callback.
  reportProgressFunc: "progress",
});

// @ts-expect-error -- unknown controls are rejected.
checkTypesMini({}, null, { enforceStrictKeyset: false, unknown: true });

import {
  type cbObj,
  fixEnt,
  type Opts,
  type Ranges,
} from "string-fix-broken-named-entities";

export const defaults: Ranges = fixEnt("&nsp;");
export const decoded: Ranges = fixEnt("&nsp;", { decode: true });
export const raw: cbObj[] = fixEnt("&nsp;", { cb: null });
export const explicitUndefined: cbObj[] = fixEnt("&nsp;", { cb: undefined });
export const rule: string = raw[0].ruleName;
// @ts-expect-error Diagnostic objects do not expose array methods.
raw[0].map((value: unknown) => value);
export const mapped = fixEnt("&nsp;", {
  cb: (finding) => ({ rule: finding.ruleName }),
});
export const mappedRule: string = mapped[0].rule;
// @ts-expect-error Mapped objects are not range tuples.
export const invalidRanges: Ranges = mapped;
export const tuples: [number, number][] = fixEnt("&nsp;", {
  cb: ({ rangeFrom, rangeTo }): [number, number] => [rangeFrom, rangeTo],
});
export const voidValues: Array<void> = fixEnt("&nsp;", { cb: () => {} });
export const options: Opts<{ rule: string }> = {
  decode: false,
  cb: (finding) => ({ rule: finding.ruleName }),
  entityCatcherCb: null,
  textAmpersandCatcherCb: null,
  progressFn: null,
};
export const dynamic = fixEnt("&nsp;", options);
// @ts-expect-error A runtime-selected callback can return diagnostics or objects.
export const unsafeDynamic: Ranges = dynamic;

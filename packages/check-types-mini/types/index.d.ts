declare const version: string;
type Obj = object;
type SchemaTypeName = string | null | undefined;
type SchemaDescriptor = SchemaTypeName | readonly SchemaTypeName[];
interface Schema {
  readonly [key: string]: Schema | SchemaDescriptor;
}
interface CompletionStats {
  arrayElementsVisited: number;
  maxDepth: number;
  objectPropertiesVisited: number;
  schemaEntries: number;
  timeTakenInMilliseconds: number;
  valuesIgnored: number;
  valuesValidated: number;
}
interface Opts {
  acceptArrays: boolean;
  acceptArraysIgnore: string | readonly string[];
  enforceStrictKeyset: boolean;
  ignoreKeys: string | readonly string[];
  ignorePaths: string | readonly string[];
  msg: string;
  optsVarName: string;
  reportCompletionFunc: null | ((stats: Readonly<CompletionStats>) => void);
  reportProgressFunc: null | ((percentageDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  schema: Schema;
}
declare const defaults: Readonly<Opts>;
type CheckTypesMiniThrowId =
  | "THROW_ID_01"
  | "THROW_ID_02"
  | "THROW_ID_03"
  | "THROW_ID_04"
  | "THROW_ID_05"
  | "THROW_ID_06"
  | "THROW_ID_07"
  | "THROW_ID_08"
  | "THROW_ID_09"
  | "THROW_ID_10"
  | "THROW_ID_11"
  | "THROW_ID_12"
  | "THROW_ID_13"
  | "THROW_ID_14"
  | "THROW_ID_15"
  | "THROW_ID_16"
  | "THROW_ID_17"
  | "THROW_ID_18"
  | "THROW_ID_19"
  | "THROW_ID_20"
  | "THROW_ID_21"
  | "THROW_ID_22";
interface CheckTypesMiniErrorDetails {
  actualType?: string | null;
  context?: string;
  expectedTypes?: readonly string[] | null;
  path?: readonly string[];
}
interface CheckTypesMiniErrorJson {
  actualType: string | null;
  context: string;
  expectedTypes: readonly string[] | null;
  message: string;
  name: "CheckTypesMiniError";
  path: readonly string[];
  reason: string;
  validatorCode: CheckTypesMiniThrowId;
}
declare class CheckTypesMiniError extends TypeError {
  readonly actualType: string | null;
  readonly context: string;
  readonly expectedTypes: readonly string[] | null;
  readonly name = "CheckTypesMiniError";
  readonly path: readonly string[];
  readonly reason: string;
  readonly validatorCode: CheckTypesMiniThrowId;
  constructor(
    validatorCode: CheckTypesMiniThrowId,
    reason: string,
    details?: CheckTypesMiniErrorDetails,
  );
  toJSON(): CheckTypesMiniErrorJson;
}
type PlainObjectInput<T extends object> = T extends
  | readonly unknown[]
  | ((...args: never[]) => unknown)
  | Date
  | RegExp
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Promise<unknown>
  ? never
  : T;
declare function checkTypesMini<
  TObj extends object,
  TRef extends object | null,
>(
  obj: PlainObjectInput<TObj>,
  ref: TRef extends object ? PlainObjectInput<TRef> : TRef,
  opts?: Partial<Opts> | null,
): void;

export { CheckTypesMiniError, checkTypesMini, defaults, version };
export type {
  CheckTypesMiniErrorDetails,
  CheckTypesMiniErrorJson,
  CheckTypesMiniThrowId,
  CompletionStats,
  Obj,
  Opts,
  Schema,
  SchemaDescriptor,
  SchemaTypeName,
};

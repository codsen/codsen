declare type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;
declare type JsonObject = {
  [Key in string]?: JsonValue;
};
declare type JsonArray = JsonValue[];
declare const version: string;
declare const allNamedEntities: JsonObject;
declare const brokenNamedEntities: JsonObject;
declare const entStartsWith: JsonObject;
declare const entEndsWith: JsonObject;
declare const entStartsWithCaseInsensitive: JsonObject;
declare const entEndsWithCaseInsensitive: JsonObject;
declare const uncertain: JsonObject;
declare const allNamedEntitiesSetOnly: Set<string>;
declare const allNamedEntitiesSetOnlyCaseInsensitive: Set<string>;
declare function decode(ent: string): string | null;
declare const minLength = 2;
declare const maxLength = 31;

export {
  allNamedEntities,
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  brokenNamedEntities,
  decode,
  entEndsWith,
  entEndsWithCaseInsensitive,
  entStartsWith,
  entStartsWithCaseInsensitive,
  maxLength,
  minLength,
  uncertain,
  version,
};

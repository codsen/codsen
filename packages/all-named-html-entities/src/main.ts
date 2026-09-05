import { version as v } from "../package.json";
import allNamedEntitiesJson from "./allNamedEntities.json";
import brokenNamedEntitiesJson from "./brokenNamedEntities.json";
import entEndsWithJson from "./endsWith.json";
import entEndsWithCaseInsensitiveJson from "./endsWithCaseInsensitive.json";
import {
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  maxLength,
  minLength,
} from "./generated";
import entStartsWithJson from "./startsWith.json";
import entStartsWithCaseInsensitiveJson from "./startsWithCaseInsensitive.json";
import uncertainJson from "./uncertain.json";

type EntityLookup = Record<string, string>;
type EntityAffixLookup = Record<string, Record<string, string[]>>;
type UncertainEntityLookup = Record<
  string,
  {
    addAmpIfSemiPresent: boolean | string;
    addSemiIfAmpPresent: boolean | string;
  }
>;
const version: string = v;
const allNamedEntities: EntityLookup = allNamedEntitiesJson;
const brokenNamedEntities: EntityLookup = brokenNamedEntitiesJson;
const entStartsWith: EntityAffixLookup = entStartsWithJson;
const entEndsWith: EntityAffixLookup = entEndsWithJson;
const entStartsWithCaseInsensitive: EntityAffixLookup =
  entStartsWithCaseInsensitiveJson;
const entEndsWithCaseInsensitive: EntityAffixLookup =
  entEndsWithCaseInsensitiveJson;

const uncertain: UncertainEntityLookup = uncertainJson;

function decode(ent: string): string | null {
  if (typeof ent !== "string" || !ent.startsWith("&") || !ent.endsWith(";")) {
    throw new Error(
      `all-named-html-entities/decode(): [THROW_ID_01] Input must be an HTML entity with leading ampersand and trailing semicolon, but "${ent}" was given`,
    );
  }
  let val = ent.slice(1, ent.length - 1);
  let decoded = allNamedEntities[val];
  return typeof decoded === "string" ? decoded : null;
}

// -----------------------------------------------------------------------------

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

type EntityLookup = Record<string, string>;
type EntityAffixLookup = Record<string, Record<string, string[]>>;
type UncertainEntityLookup = Record<
  string,
  {
    addAmpIfSemiPresent: boolean | string;
    addSemiIfAmpPresent: boolean | string;
  }
>;
declare const version: string;
declare const allNamedEntities: EntityLookup;
declare const brokenNamedEntities: EntityLookup;
declare const entStartsWith: EntityAffixLookup;
declare const entEndsWith: EntityAffixLookup;
declare const entStartsWithCaseInsensitive: EntityAffixLookup;
declare const entEndsWithCaseInsensitive: EntityAffixLookup;
declare const uncertain: UncertainEntityLookup;
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

#!/usr/bin/env node

// this script bakes a JSON file in src/rules/all-bad-character.json
// from all files list present in src/rules/bad-character/
// -----------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const nonFileBasedTagRules = require("../src/util/nonFileBasedTagRules.json");

// bake the "bad-character" rules list JSON:

const allBadCharacterRules = fs
  .readdirSync(path.resolve("src/rules/bad-character/"))
  .filter((val) => val.startsWith("bad-character"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-bad-character.json"),
  JSON.stringify(allBadCharacterRules.sort(), null, 2)
);

// bake the "tag" rules list JSON:

const allTagRules = fs
  .readdirSync(path.resolve("src/rules/tag/"))
  .filter((val) => val.startsWith("tag-"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-tag.json"),
  JSON.stringify(nonFileBasedTagRules.concat(allTagRules).sort(), null, 2)
);

// bake the "media" rules list JSON:

const allMediaRules = fs
  .readdirSync(path.resolve("src/rules/media/"))
  .filter((val) => val.startsWith("media-"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-media.json"),
  JSON.stringify(allMediaRules.sort(), null, 2)
);

// bake the "attribute" rules list JSON:

const allAttribRules = fs
  .readdirSync(path.resolve("src/rules/attribute/"))
  .filter((val) => val.startsWith("attribute-"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-attribute.json"),
  JSON.stringify(allAttribRules.sort(), null, 2)
);

// bake the "attribute-validate-" rules list JSON:

const allAttribValidateRules = fs
  .readdirSync(path.resolve("src/rules/attribute-validate/"))
  .filter((val) => val.startsWith("attribute-validate-"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-attribute-validate.json"),
  JSON.stringify(allAttribValidateRules.sort(), null, 2)
);

// bake the "character-" rules list JSON:

const allCharacter = fs
  .readdirSync(path.resolve("src/rules/character/"))
  .filter((val) => val.startsWith("character-"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-character.json"),
  JSON.stringify(allCharacter.sort(), null, 2)
);

// bake the "css-" rules list JSON:

const allCSS = fs
  .readdirSync(path.resolve("src/rules/css/"))
  .filter((val) => val.startsWith("css-"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-css.json"),
  JSON.stringify(allCSS.sort(), null, 2)
);

// bake the "all-bad-named-html-entity" rules list JSON:
// since rules come from standalone npm package, "string-fix-broken-named-entities",
// rules source is embedded into linter.js and we'll have to use unit test
// files to extract the list automatically:

const allBadNamedHTMLEntityRules = fs
  .readdirSync(path.resolve("test/rules/bad-html-entity/"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-bad-named-html-entity.json"),
  JSON.stringify(allBadNamedHTMLEntityRules.sort(), null, 2)
);

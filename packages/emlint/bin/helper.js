#!/usr/bin/env node

// this script bakes a JSON file in src/rules/all-bad-character.json
// from all files list present in src/rules/bad-character/
// -----------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const nonFileBasedTagRules = require("../src/util/nonFileBasedTagRules.json");
const { allRules } = require("string-fix-broken-named-entities");

// the rule "bad-html-entity-encoded-numeric" doesn't exist
const preppedBrokenEntityRules = allRules.filter(
  (v) => v !== "bad-html-entity-encoded-numeric"
);

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

// bake the "format-" rules list JSON:

const allFormat = fs
  .readdirSync(path.resolve("src/rules/format/"))
  .filter((val) => val.startsWith("format-"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-format.json"),
  JSON.stringify(allFormat.sort(), null, 2)
);

// bake the "comment-" rules list JSON:

const allComment = fs
  .readdirSync(path.resolve("src/rules/comment/"))
  .filter((val) => val.startsWith("comment-"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-comment.json"),
  JSON.stringify(allComment.sort(), null, 2)
);

// bake the "email-" rules list JSON:

const allEmail = fs
  .readdirSync(path.resolve("src/rules/email/"))
  .filter((val) => val.startsWith("email-"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-email.json"),
  JSON.stringify(allEmail.sort(), null, 2)
);

// bake the "all-bad-named-html-entity" rules list JSON:
// since rules come from standalone npm package, "string-fix-broken-named-entities",
// rules source is embedded into linter.js and we'll have to use unit test
// files to extract the list automatically:

const allBadNamedHTMLEntityRules = fs
  .readdirSync(path.resolve("test/rules/bad-html-entity/"))
  .map((val) => path.parse(val).name);

fs.writeFileSync(
  path.resolve("src/rules/all-bad-html-entity.json"),
  JSON.stringify(allBadNamedHTMLEntityRules.sort(), null, 2)
);

// bake the list of all rules

fs.writeFileSync(
  path.resolve("src/rules/all-with-ent.json"),
  JSON.stringify(
    [
      // dedupe just in case
      ...new Set([
        ...allBadCharacterRules,
        ...allTagRules,
        ...allMediaRules,
        ...allAttribRules,
        ...allAttribValidateRules,
        ...allCharacter,
        ...allCSS,
        ...allFormat,
        ...allComment,
        ...allEmail,
        ...allBadNamedHTMLEntityRules,
        ...preppedBrokenEntityRules, // <---- there are around four thousand of them
      ]),
    ].sort(),
    null,
    2
  )
);

fs.writeFileSync(
  path.resolve("src/rules/all.json"),
  JSON.stringify(
    [
      // dedupe just in case
      ...new Set([
        ...allBadCharacterRules,
        ...allTagRules,
        ...allMediaRules,
        ...allAttribRules,
        ...allAttribValidateRules,
        ...allCharacter,
        ...allCSS,
        ...allFormat,
        ...allComment,
        ...allEmail,
        ...allBadNamedHTMLEntityRules,
        // omitted "preppedBrokenEntityRules", so the list is around 300
      ]),
    ].sort(),
    null,
    2
  )
);

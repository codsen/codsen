/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";
import {
  // rawReplacementMark,
  rawNDash,
  // rawMDash,
  rawNbsp,
  // hairspace,
  // ellipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote,
} from "codsen-utils";

// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - missing space after ndash added (space + ndash) - missing space after ndash added`, () => {
  mixer({
    convertEntities: true,
    convertDashes: true,
    removeWidows: true,
    addMissingSpaces: false, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am &ndash;11am", opt).res,
      "10am&nbsp;&ndash;11am",
      "01.01"
    );
  });
});

test(`02 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - missing space after ndash added (space + ndash) - missing space after ndash added`, () => {
  mixer({
    convertEntities: true,
    convertDashes: true,
    removeWidows: false,
    addMissingSpaces: true, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am &ndash;11am", opt).res,
      "10am &ndash; 11am",
      "02.01"
    );
  });
});

test(`03 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - missing space after ndash added (space + ndash) - missing space after ndash added`, () => {
  mixer({
    convertEntities: true,
    convertDashes: true,
    removeWidows: false,
    addMissingSpaces: false, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am &ndash;11am", opt).res,
      "10am &ndash;11am",
      "03.01"
    );
  });
});

test(`04 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within simple URL's - url only`, () => {
  [
    "http://detergent.io",
    "http://detergent.io?something=zzz%26else=ccc",
    "tel://123",
  ].forEach((src) => {
    mixer().forEach((opt, n) => {
      equal(det(ok, not, n, src, opt).res, src, `${src} - ${"66.02"}`);
    });
  });
});

test(`05 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls - url + space + text`, () => {
  mixer({
    removeWidows: false,
    removeLineBreaks: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io is cool", opt).res,
      "http://detergent.io is cool",
      "05.01"
    );
  });
});

test(`06 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls - adds space before capital letter (line break)`, () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io.\nThis is cool", opt).res,
      "http://detergent.io.\nThis is cool",
      "06.01"
    );
  });
});

test(`07 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls - adds space before capital letter (line break)`, () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io. \nThis is cool", opt).res,
      "http://detergent.io.\nThis is cool",
      "07.01"
    );
  });
});

test(`08 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls - no :// but www instead`, () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Aaaaa.Aaaa www.detergent.io bbbbb.Bbbbb", opt).res,
      "Aaaaa. Aaaa www.detergent.io bbbbb. Bbbbb",
      "08.01"
    );
  });
});

test(`09 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls - url + space + text`, () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io is cool", opt).res,
      "http://detergent.io is cool",
      "09.01"
    );
  });
});

test(`10 - missing space after ndash added (nbsp + ndash) - space after ndash not added where not needed`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `10am&ndash;11am`, opt).res,
      `10am${rawNDash}11am`,
      "10.01"
    );
  });
});

test(`11 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls - address + full stop + line break`, () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io.\nThis is cool", opt).res,
      "http://detergent.io.\nThis is cool",
      "11.01"
    );
  });
});

test(`12 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls - address + full stop + space + line break`, () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io. \nThis is cool", opt).res,
      "http://detergent.io.\nThis is cool",
      "12.01"
    );
  });
});

test(`13 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls - no :// but www instead`, () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Aaaaa.Aaaa www.detergent.io bbbbb.Bbbbb", opt).res,
      "Aaaaa.Aaaa www.detergent.io bbbbb.Bbbbb",
      "13.01"
    );
  });
});

test(`14 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - sentence #1`, () => {
  mixer({
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      "This is http://detergent.io. This is cool.",
      "14.01"
    );
  });
});

test(`15 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - sentence #2`, () => {
  mixer({
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "15.01"
    );
  });
});

test(`16 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - sentence #3`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      "This is http://detergent.io. This is&nbsp;cool.",
      "16.01"
    );
  });
});

test(`17 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - sentence #4`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "17.01"
    );
  });
});

test(`18 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - vs widow removal`, () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      `This is http://detergent.io. This is${rawNbsp}cool.`,
      "18.01"
    );
  });
});

test(`19 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - trailing full stop #1`, () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "19.01"
    );
  });
});

test(`20 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - trailing full stop #2`, () => {
  mixer({
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      "This is http://detergent.io.This is cool.",
      "20.01"
    );
  });
});

test(`21 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - trailing full stop #3`, () => {
  mixer({
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "21.01"
    );
  });
});

test(`22 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - trailing full stop #4`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      "This is http://detergent.io.This is&nbsp;cool.",
      "22.01"
    );
  });
});

test(`23 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - trailing full stop #5`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "23.01"
    );
  });
});

test(`24 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - vs widow removal`, () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      `This is http://detergent.io.This is${rawNbsp}cool.`,
      "24.01"
    );
  });
});

test(`25 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - adds space after semicolon, but not in URLs - trailing full stop #6`, () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "25.01"
    );
  });
});

test(`26 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls, considering emoji and line breaks - emoji #1`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Aaaa🦄.bbbbb http://detergent.whatever.a.bd.re.qwe.gf.asdew.v.df.g.er.re ZZZ.🦄YYY",
        opt
      ).res,
      "Aaaa🦄.bbbbb http://detergent.whatever.a.bd.re.qwe.gf.asdew.v.df.g.er.re ZZZ.🦄YYY",
      "26.01"
    );
  });
});

test(`27 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls, considering emoji and line breaks - emoji #2`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Aaaa.Bbbbb http://detergent.whatever.a.bd.re.qwe.\ngf.Asdew.V.Df,g;er.Re ZZZ.🦄YYY sfhksdf fgkjhk jhfgkh.",
        opt
      ).res,
      "Aaaa. Bbbbb http://detergent.whatever.a.bd.re.qwe.\ngf. Asdew. V. Df, g; er. Re ZZZ.🦄YYY sfhksdf fgkjhk jhfgkh.",
      "27.01"
    );
  });
});

test(`28 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls, considering emoji and line breaks - emoji #3`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Aaaa🦄.bbbbb http://detergent.whatever.a.bd.re.qwe.gf.asdew.v.df.g.er.re ZZZ.🦄YYY",
        opt
      ).res,
      "Aaaa🦄.bbbbb http://detergent.whatever.a.bd.re.qwe.gf.asdew.v.df.g.er.re ZZZ.🦄YYY",
      "28.01"
    );
  });
});

test(`29 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - doesn't add spaces within urls, considering emoji and line breaks - emoji #4`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Aaaa.Bbbbb http://detergent.whatever.a.bd.re.qwe.\ngf.Asdew.V.Df,g;er.Re ZZZ.🦄YYY sfhksdf fgkjhk jhfgkh.",
        opt
      ).res,
      "Aaaa.Bbbbb http://detergent.whatever.a.bd.re.qwe.\ngf.Asdew.V.Df,g;er.Re ZZZ.🦄YYY sfhksdf fgkjhk jhfgkh.",
      "29.01"
    );
  });
});

test(`30 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - being on the safe side - not adding spaces around detected URLs - add missing spaces`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io;is cool.", opt).res,
      "http://detergent.io;is cool.",
      "30.01"
    );
  });
});

test(`31 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - being on the safe side - not adding spaces around detected URLs - semicol`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "aaa;bbb", opt).res, "aaa; bbb", "31.01");
  });
});

test(`32 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - being on the safe side - not adding spaces around detected URLs - comma + URL`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io,is cool.", opt).res,
      "http://detergent.io,is cool.",
      "32.01"
    );
  });
});

test(`33 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - being on the safe side - not adding spaces around detected URLs - comma + text`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "aaa,bbb", opt).res, "aaa, bbb", "33.01");
  });
});

test(`34 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - being on the safe side - not adding spaces around detected URLs - added space because first letter is uppercase`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io.Cool!", opt).res,
      "http://detergent.io. Cool!",
      "34.01"
    );
  });
});

test(`35 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - being on the safe side - not adding spaces around detected URLs - all caps will prevent space added`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io.IS COOL.", opt).res,
      "http://detergent.io.IS COOL.",
      "35.01"
    );
  });
});

test(`36 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - being on the safe side - not adding spaces around detected URLs - small caps will prevent space added`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io.is cool.", opt).res,
      "http://detergent.io.is cool.",
      "36.01"
    );
  });
});

test(`37 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - being on the safe side - not adding spaces around detected URLs - letter after full stop has to be uppercase`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "aaa.bbb", opt).res, "aaa.bbb", "37.01");
  });
});

test(`38 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - being on the safe side - not adding spaces around detected URLs - letter after full stop has to be uppercase`, () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "Aaa.Bbb", opt).res, "Aaa. Bbb", "38.01");
  });
});

test(`39 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - non-Latin character after URL #1`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.Это хорошо.", opt).res,
      "This is http://detergent.io. Это хорошо.",
      "39.01"
    );
  });
});

test(`40 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - non-Latin character after URL #2`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io,Это хорошо.", opt).res,
      "This is http://detergent.io,Это хорошо.",
      "40.01"
    );
  });
});

test(`41 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - non-Latin character after URL #3`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io;Это хорошо.", opt).res,
      "This is http://detergent.io;Это хорошо.",
      "41.01"
    );
  });
});

test(`42 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - non-Latin character after URL - not adding the missing spaces #1`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.Это хорошо.", opt).res,
      "This is http://detergent.io.Это хорошо.",
      "42.01"
    );
  });
});

test(`43 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - non-Latin character after URL - not adding the missing spaces #2`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io,Это хорошо.", opt).res,
      "This is http://detergent.io,Это хорошо.",
      "43.01"
    );
  });
});

test(`44 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - non-Latin character after URL - not adding the missing spaces #3`, () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io;Это хорошо.", opt).res,
      "This is http://detergent.io;Это хорошо.",
      "44.01"
    );
  });
});

test(`45 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - leaves file names intact`, () => {
  mixer().forEach((opt, n) => {
    [
      "image.jpg",
      "image.JPG",
      "image.jpeg",
      "image.JPEG",
      "image.png",
      "image.PNG",
      "image.gif",
      "image.GIF",
      "image.svg",
      "image.SVG",
      "image.json",
      "image.JSON",
      "image.html",
      "image.HTML",
      "image.htm",
      "image.HTM",
    ].forEach((src) => {
      equal(det(ok, not, n, src, opt).res, src, "66.02");
    });
  });
});

test(`46 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - long sentences with file names with extensions #1`, () => {
  equal(
    det(ok, not, 0, "Some text .gitignore").res,
    "Some text .gitignore",
    "46.01"
  );
});

test(`47 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - long sentences with file names with extensions #2`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "When you will download header.PNG, file fix.jpg and the dotfiles named .gitignore, check them.",
        opt
      ).res,
      "When you will download header.PNG, file fix.jpg and the dotfiles named .gitignore, check them.",
      "47.01"
    );
  });
});

test(`48 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - false positive - Dutch "p.st"`, () => {
  mixer().forEach((opt, n) => {
    equal(det(ok, not, n, "10eur p.st", opt).res, "10eur p.st", "48.01");
  });
});

test(`49 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - missing spaces addition can be turned off - full stop, addMissingSpaces=on`, () => {
  mixer({
    addMissingSpaces: true,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text.More text.", opt).res,
      "Text. More text.",
      "49.01"
    );
  });
});

test(`50 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - missing spaces addition can be turned off - full stop, addMissingSpaces=off`, () => {
  mixer({
    addMissingSpaces: false,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text.More text.", opt).res,
      "Text.More text.",
      "50.01"
    );
  });
});

test(`51 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - missing spaces addition can be turned off - full stop, addMissingSpaces=on, dontEncodeNonLatin=on`, () => {
  mixer({
    addMissingSpaces: true,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text,more text.", opt).res,
      "Text, more text.",
      "51.01"
    );
    equal(
      det(ok, not, n, "Text,more text,", opt).res,
      "Text, more text,",
      "51.02"
    );
  });
});

test(`52 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - missing spaces addition can be turned off - full stop, addMissingSpaces=off, dontEncodeNonLatin=on`, () => {
  mixer({
    addMissingSpaces: false,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text,more text.", opt).res,
      "Text,more text.",
      "52.01"
    );
    equal(
      det(ok, not, n, "Text,more text,", opt).res,
      "Text,more text,",
      "52.02"
    );
  });
});

test(`53 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - missing spaces addition can be turned off - full stop, addMissingSpaces=on, dontEncodeNonLatin=on`, () => {
  mixer({
    addMissingSpaces: true,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text;more text.", opt).res,
      "Text; more text.",
      "53.01"
    );
    equal(
      det(ok, not, n, "text;more text.", opt).res,
      "text; more text.",
      "53.02"
    );
    equal(
      det(ok, not, n, "Text;more text", opt).res,
      "Text; more text",
      "53.03"
    );
    equal(
      det(ok, not, n, "text;more text", opt).res,
      "text; more text",
      "53.04"
    );
  });
});

test(`54 - ${`\u001b[${33}m${`opts.addMissingSpaces`}\u001b[${39}m`} - missing spaces addition can be turned off - semicol, addMissingSpaces=off`, () => {
  mixer({
    addMissingSpaces: false,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text;more text.", opt).res,
      "Text;more text.",
      "54.01"
    );
    equal(
      det(ok, not, n, "text;more text.", opt).res,
      "text;more text.",
      "54.02"
    );
    equal(
      det(ok, not, n, "Text;more text", opt).res,
      "Text;more text",
      "54.03"
    );
    equal(
      det(ok, not, n, "text;more text", opt).res,
      "text;more text",
      "54.04"
    );
  });
});

test(`55 - missing space after ndash added (nbsp + ndash) - missing space after ndash added`, () => {
  mixer({
    convertDashes: true,
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: true, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am", opt).res,
      "10am&nbsp;&ndash;&nbsp;11am",
      "55.01"
    );
  });
});

test(`56 - missing space after ndash added (nbsp + ndash) - missing space after ndash added`, () => {
  mixer({
    convertDashes: true,
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: false, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am", opt).res,
      "10am&nbsp;&ndash;11am",
      "56.01"
    );
  });
});

test(`57 - missing space after ndash added (nbsp + ndash) - missing space after ndash added`, () => {
  mixer({
    convertDashes: true,
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: false, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am and more text", opt).res,
      "10am&nbsp;&ndash;11am and more&nbsp;text",
      "57.01"
    );
  });
});

test(`58 - missing space after ndash added (nbsp + ndash) - space after ndash not added where not needed`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&ndash;11am", opt).res,
      "10am&ndash;11am",
      "58.01"
    );
  });
});

test(`59 - missing space after ndash added (nbsp + ndash) - missing space after ndash added`, () => {
  mixer({
    convertDashes: true,
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am", opt).res,
      `10am${rawNbsp}${rawNDash}${rawNbsp}11am`,
      "59.01"
    );
  });
});

test(`60 - missing space after ndash added (nbsp + ndash) - missing space after ndash added`, () => {
  mixer({
    convertDashes: true,
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am", opt).res,
      `10am${rawNbsp}${rawNDash}${rawNbsp}11am`,
      "60.01"
    );
  });
  mixer({
    convertDashes: true,
    removeWidows: false,
    convertEntities: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am", opt).res,
      `10am ${rawNDash} 11am`,
      "60.02"
    );
  });
});

// 02. whitespace control
// -----------------------------------------------------------------------------

test(`61 - deletes space around n-dash between numbers`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `1880 ${rawNDash} 1912`, opt).res,
      `1880${rawNDash}1912`,
      "61.01"
    );
  });
});

test(`62 - deletes space around n-dash between numbers`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `1880 &ndash; 1912`, opt).res,
      `1880${rawNDash}1912`,
      "62.01"
    );
  });
});

test(`63 - deletes space around n-dash between numbers`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `1880 ${rawNDash} 1912`, opt).res,
      "1880&ndash;1912",
      "63.01"
    );
  });
});

test(`64 - deletes space around n-dash between numbers`, () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "1880 &ndash; 1912", opt).res,
      "1880&ndash;1912",
      "64.01"
    );
  });
});

test(`65 - space in front of n-dash, missing space after it`, () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `1880 ${rawNDash}1912`, opt).res,
      `1880${rawNDash}1912`,
      "65.01"
    );
  });
});

test(`66 - jinja/nunjucks code chunk with double quotes`, () => {
  let str1 = '{{ "%.2f"|format(total.value) }}';
  mixer().forEach((opt, n) => {
    equal(det(ok, not, n, str1, opt).res, str1, "66.01");
  });

  let str2 = '{% if z == "text" %}{{ text }}{% endif %}';
  mixer().forEach((opt, n) => {
    equal(det(ok, not, n, str2, opt).res, str2, "66.02");
  });

  let str3 = '{%- if z == "text" -%}{{ text }}{%- endif -%}';
  mixer().forEach((opt, n) => {
    equal(det(ok, not, n, str3, opt).res, str3, "66.03");
  });
});

test(`67`, () => {
  equal(
    det1(`Abc;${rawNbsp}de fghij klmnop.`, {
      convertEntities: true,
      removeWidows: true,
    }).res,
    `Abc;&nbsp;de fghij&nbsp;klmnop.`,
    "67.01"
  );
});

test(`68`, () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Abc;${rawNbsp}de fghij klmnop.`, opt).res,
      `Abc;&nbsp;de fghij&nbsp;klmnop.`,
      "68.01"
    );
  });
});

test(`69`, () => {
  mixer({
    convertEntities: false,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Abc;${rawNbsp}fghij klm nop.`, opt).res,
      `Abc;${rawNbsp}fghij klm${rawNbsp}nop.`,
      "69.01"
    );
  });
});

test(`70`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Abc;${rawNbsp}de fg.`, opt).res,
      `Abc; de fg.`,
      "70.01"
    );
  });
});

test(`71 - sanity check #02`, () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Semicolon;&is cool.", opt).res,
      "Semicolon;&is cool.",
      "71.01"
    );
  });
});

test.run();

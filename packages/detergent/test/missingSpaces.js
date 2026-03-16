// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
/* eslint no-template-curly-in-string: 0 */

import {
  // rawMDash,
  rawNbsp,
  // rawReplacementMark,
  rawNDash,
  // hairspace,
  // ellipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote,
} from "codsen-utils";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// -----------------------------------------------------------------------------

test("001 - opts.addMissingSpaces - missing space after ndash added (space + ndash) - missing space after ndash added", () => {
  mixer({
    convertEntities: true,
    convertDashes: true,
    removeWidows: true,
    addMissingSpaces: false, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am &ndash;11am", opt).res,
      "10am&nbsp;&ndash;11am",
      "001.01",
    );
  });
});

test("002 - opts.addMissingSpaces - missing space after ndash added (space + ndash) - missing space after ndash added", () => {
  mixer({
    convertEntities: true,
    convertDashes: true,
    removeWidows: false,
    addMissingSpaces: true, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am &ndash;11am", opt).res,
      "10am &ndash; 11am",
      "002.01",
    );
  });
});

test("003 - opts.addMissingSpaces - missing space after ndash added (space + ndash) - missing space after ndash added", () => {
  mixer({
    convertEntities: true,
    convertDashes: true,
    removeWidows: false,
    addMissingSpaces: false, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am &ndash;11am", opt).res,
      "10am &ndash;11am",
      "003.01",
    );
  });
});

test("004 - opts.addMissingSpaces - doesn't add spaces within simple URL's - url only", () => {
  [
    "http://detergent.io",
    "http://detergent.io?something=zzz%26else=ccc",
    "tel://123",
  ].forEach((src) => {
    mixer().forEach((opt, n) => {
      equal(
        det(ok, not, n, src, opt).res,
        src,
        `004.01 - ${`${src} - ${"66.02"}`}`,
      );
    });
  });
});

test("005 - opts.addMissingSpaces - doesn't add spaces within urls - url + space + text", () => {
  mixer({
    removeWidows: false,
    removeLineBreaks: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io is cool", opt).res,
      "http://detergent.io is cool",
      "005.01",
    );
  });
});

test("006 - opts.addMissingSpaces - doesn't add spaces within urls - adds space before capital letter (line break)", () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io.\nThis is cool", opt).res,
      "http://detergent.io.\nThis is cool",
      "006.01",
    );
  });
});

test("007 - opts.addMissingSpaces - doesn't add spaces within urls - adds space before capital letter (line break)", () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io. \nThis is cool", opt).res,
      "http://detergent.io.\nThis is cool",
      "007.01",
    );
  });
});

test("008 - opts.addMissingSpaces - doesn't add spaces within urls - no :// but www instead", () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Aaaaa.Aaaa www.detergent.io bbbbb.Bbbbb", opt).res,
      "Aaaaa. Aaaa www.detergent.io bbbbb. Bbbbb",
      "008.01",
    );
  });
});

test("009 - opts.addMissingSpaces - doesn't add spaces within urls - url + space + text", () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io is cool", opt).res,
      "http://detergent.io is cool",
      "009.01",
    );
  });
});

test("010 - missing space after ndash added (nbsp + ndash) - space after ndash not added where not needed", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&ndash;11am", opt).res,
      `10am${rawNDash}11am`,
      "010.01",
    );
  });
});

test("011 - opts.addMissingSpaces - doesn't add spaces within urls - address + full stop + line break", () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io.\nThis is cool", opt).res,
      "http://detergent.io.\nThis is cool",
      "011.01",
    );
  });
});

test("012 - opts.addMissingSpaces - doesn't add spaces within urls - address + full stop + space + line break", () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io. \nThis is cool", opt).res,
      "http://detergent.io.\nThis is cool",
      "012.01",
    );
  });
});

test("013 - opts.addMissingSpaces - doesn't add spaces within urls - no :// but www instead", () => {
  mixer({
    removeWidows: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Aaaaa.Aaaa www.detergent.io bbbbb.Bbbbb", opt).res,
      "Aaaaa.Aaaa www.detergent.io bbbbb.Bbbbb",
      "013.01",
    );
  });
});

test("014 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - sentence #1", () => {
  mixer({
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      "This is http://detergent.io. This is cool.",
      "014.01",
    );
  });
});

test("015 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - sentence #2", () => {
  mixer({
    removeWidows: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "015.01",
    );
  });
});

test("016 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - sentence #3", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      "This is http://detergent.io. This is&nbsp;cool.",
      "016.01",
    );
  });
});

test("017 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - sentence #4", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "017.01",
    );
  });
});

test("018 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - vs widow removal", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      `This is http://detergent.io. This is${rawNbsp}cool.`,
      "018.01",
    );
  });
});

test("019 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - trailing full stop #1", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "019.01",
    );
  });
});

test("020 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - trailing full stop #2", () => {
  mixer({
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      "This is http://detergent.io.This is cool.",
      "020.01",
    );
  });
});

test("021 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - trailing full stop #3", () => {
  mixer({
    removeWidows: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "021.01",
    );
  });
});

test("022 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - trailing full stop #4", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      "This is http://detergent.io.This is&nbsp;cool.",
      "022.01",
    );
  });
});

test("023 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - trailing full stop #5", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "023.01",
    );
  });
});

test("024 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - vs widow removal", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.This is cool.", opt).res,
      `This is http://detergent.io.This is${rawNbsp}cool.`,
      "024.01",
    );
  });
});

test("025 - opts.addMissingSpaces - adds space after semicolon, but not in URLs - trailing full stop #6", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.", opt).res,
      "This is http://detergent.io.",
      "025.01",
    );
  });
});

test("026 - opts.addMissingSpaces - doesn't add spaces within urls, considering emoji and line breaks - emoji #1", () => {
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
        opt,
      ).res,
      "Aaaa🦄.bbbbb http://detergent.whatever.a.bd.re.qwe.gf.asdew.v.df.g.er.re ZZZ.🦄YYY",
      "026.01",
    );
  });
});

test("027 - opts.addMissingSpaces - doesn't add spaces within urls, considering emoji and line breaks - emoji #2", () => {
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
        opt,
      ).res,
      "Aaaa. Bbbbb http://detergent.whatever.a.bd.re.qwe.\ngf. Asdew. V. Df, g; er. Re ZZZ.🦄YYY sfhksdf fgkjhk jhfgkh.",
      "027.01",
    );
  });
});

test("028 - opts.addMissingSpaces - doesn't add spaces within urls, considering emoji and line breaks - emoji #3", () => {
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
        opt,
      ).res,
      "Aaaa🦄.bbbbb http://detergent.whatever.a.bd.re.qwe.gf.asdew.v.df.g.er.re ZZZ.🦄YYY",
      "028.01",
    );
  });
});

test("029 - opts.addMissingSpaces - doesn't add spaces within urls, considering emoji and line breaks - emoji #4", () => {
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
        opt,
      ).res,
      "Aaaa.Bbbbb http://detergent.whatever.a.bd.re.qwe.\ngf.Asdew.V.Df,g;er.Re ZZZ.🦄YYY sfhksdf fgkjhk jhfgkh.",
      "029.01",
    );
  });
});

test("030 - opts.addMissingSpaces - being on the safe side - not adding spaces around detected URLs - add missing spaces", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io;is cool.", opt).res,
      "http://detergent.io;is cool.",
      "030.01",
    );
  });
});

test("031 - opts.addMissingSpaces - being on the safe side - not adding spaces around detected URLs - semicol", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "aaa;bbb", opt).res, "aaa; bbb", "031.01");
  });
});

test("032 - opts.addMissingSpaces - being on the safe side - not adding spaces around detected URLs - comma + URL", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io,is cool.", opt).res,
      "http://detergent.io,is cool.",
      "032.01",
    );
  });
});

test("033 - opts.addMissingSpaces - being on the safe side - not adding spaces around detected URLs - comma + text", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "aaa,bbb", opt).res, "aaa, bbb", "033.01");
  });
});

test("034 - opts.addMissingSpaces - being on the safe side - not adding spaces around detected URLs - added space because first letter is uppercase", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io.Cool!", opt).res,
      "http://detergent.io. Cool!",
      "034.01",
    );
  });
});

test("035 - opts.addMissingSpaces - being on the safe side - not adding spaces around detected URLs - all caps will prevent space added", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io.IS COOL.", opt).res,
      "http://detergent.io.IS COOL.",
      "035.01",
    );
  });
});

test("036 - opts.addMissingSpaces - being on the safe side - not adding spaces around detected URLs - small caps will prevent space added", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "http://detergent.io.is cool.", opt).res,
      "http://detergent.io.is cool.",
      "036.01",
    );
  });
});

test("037 - opts.addMissingSpaces - being on the safe side - not adding spaces around detected URLs - letter after full stop has to be uppercase", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "aaa.bbb", opt).res, "aaa.bbb", "037.01");
  });
});

test("038 - opts.addMissingSpaces - being on the safe side - not adding spaces around detected URLs - letter after full stop has to be uppercase", () => {
  mixer({
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(det(ok, not, n, "Aaa.Bbb", opt).res, "Aaa. Bbb", "038.01");
  });
});

test("039 - opts.addMissingSpaces - non-Latin character after URL #1", () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.Это хорошо.", opt).res,
      "This is http://detergent.io. Это хорошо.",
      "039.01",
    );
  });
});

test("040 - opts.addMissingSpaces - non-Latin character after URL #2", () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io,Это хорошо.", opt).res,
      "This is http://detergent.io,Это хорошо.",
      "040.01",
    );
  });
});

test("041 - opts.addMissingSpaces - non-Latin character after URL #3", () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io;Это хорошо.", opt).res,
      "This is http://detergent.io;Это хорошо.",
      "041.01",
    );
  });
});

test("042 - opts.addMissingSpaces - non-Latin character after URL - not adding the missing spaces #1", () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io.Это хорошо.", opt).res,
      "This is http://detergent.io.Это хорошо.",
      "042.01",
    );
  });
});

test("043 - opts.addMissingSpaces - non-Latin character after URL - not adding the missing spaces #2", () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io,Это хорошо.", opt).res,
      "This is http://detergent.io,Это хорошо.",
      "043.01",
    );
  });
});

test("044 - opts.addMissingSpaces - non-Latin character after URL - not adding the missing spaces #3", () => {
  mixer({
    removeWidows: false,
    convertEntities: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "This is http://detergent.io;Это хорошо.", opt).res,
      "This is http://detergent.io;Это хорошо.",
      "044.01",
    );
  });
});

test("045 - opts.addMissingSpaces - leaves file names intact", () => {
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
      equal(det(ok, not, n, src, opt).res, src, "045.01");
    });
  });
});

test("046 - opts.addMissingSpaces - long sentences with file names with extensions #1", () => {
  equal(
    det(ok, not, 0, "Some text .gitignore").res,
    "Some text .gitignore",
    "046.01",
  );
});

test("047 - opts.addMissingSpaces - long sentences with file names with extensions #2", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "When you will download header.PNG, file fix.jpg and the dotfiles named .gitignore, check them.",
        opt,
      ).res,
      "When you will download header.PNG, file fix.jpg and the dotfiles named .gitignore, check them.",
      "047.01",
    );
  });
});

test('048 - opts.addMissingSpaces - false positive - Dutch "p.st"', () => {
  mixer().forEach((opt, n) => {
    equal(det(ok, not, n, "10eur p.st", opt).res, "10eur p.st", "048.01");
  });
});

test("049 - opts.addMissingSpaces - missing spaces addition can be turned off - full stop, addMissingSpaces=on", () => {
  mixer({
    addMissingSpaces: true,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text.More text.", opt).res,
      "Text. More text.",
      "049.01",
    );
  });
});

test("050 - opts.addMissingSpaces - missing spaces addition can be turned off - full stop, addMissingSpaces=off", () => {
  mixer({
    addMissingSpaces: false,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text.More text.", opt).res,
      "Text.More text.",
      "050.01",
    );
  });
});

test("051 - opts.addMissingSpaces - missing spaces addition can be turned off - full stop, addMissingSpaces=on, dontEncodeNonLatin=on", () => {
  mixer({
    addMissingSpaces: true,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text,more text.", opt).res,
      "Text, more text.",
      "051.01",
    );
    equal(
      det(ok, not, n, "Text,more text,", opt).res,
      "Text, more text,",
      "051.02",
    );
  });
});

test("052 - opts.addMissingSpaces - missing spaces addition can be turned off - full stop, addMissingSpaces=off, dontEncodeNonLatin=on", () => {
  mixer({
    addMissingSpaces: false,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text,more text.", opt).res,
      "Text,more text.",
      "052.01",
    );
    equal(
      det(ok, not, n, "Text,more text,", opt).res,
      "Text,more text,",
      "052.02",
    );
  });
});

test("053 - opts.addMissingSpaces - missing spaces addition can be turned off - full stop, addMissingSpaces=on, dontEncodeNonLatin=on", () => {
  mixer({
    addMissingSpaces: true,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text;more text.", opt).res,
      "Text; more text.",
      "053.01",
    );
    equal(
      det(ok, not, n, "text;more text.", opt).res,
      "text; more text.",
      "053.02",
    );
    equal(
      det(ok, not, n, "Text;more text", opt).res,
      "Text; more text",
      "053.03",
    );
    equal(
      det(ok, not, n, "text;more text", opt).res,
      "text; more text",
      "053.04",
    );
  });
});

test("054 - opts.addMissingSpaces - missing spaces addition can be turned off - semicol, addMissingSpaces=off", () => {
  mixer({
    addMissingSpaces: false,
    dontEncodeNonLatin: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Text;more text.", opt).res,
      "Text;more text.",
      "054.01",
    );
    equal(
      det(ok, not, n, "text;more text.", opt).res,
      "text;more text.",
      "054.02",
    );
    equal(
      det(ok, not, n, "Text;more text", opt).res,
      "Text;more text",
      "054.03",
    );
    equal(
      det(ok, not, n, "text;more text", opt).res,
      "text;more text",
      "054.04",
    );
  });
});

test("055 - missing space after ndash added (nbsp + ndash) - missing space after ndash added", () => {
  mixer({
    convertDashes: true,
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: true, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am", opt).res,
      "10am&nbsp;&ndash;&nbsp;11am",
      "055.01",
    );
  });
});

test("056 - missing space after ndash added (nbsp + ndash) - missing space after ndash added", () => {
  mixer({
    convertDashes: true,
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: false, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am", opt).res,
      "10am&nbsp;&ndash;11am",
      "056.01",
    );
  });
});

test("057 - missing space after ndash added (nbsp + ndash) - missing space after ndash added", () => {
  mixer({
    convertDashes: true,
    removeWidows: true,
    convertEntities: true,
    addMissingSpaces: false, // <-------
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am and more text", opt).res,
      "10am&nbsp;&ndash;11am and more&nbsp;text",
      "057.01",
    );
  });
});

test("058 - missing space after ndash added (nbsp + ndash) - space after ndash not added where not needed", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&ndash;11am", opt).res,
      "10am&ndash;11am",
      "058.01",
    );
  });
});

test("059 - missing space after ndash added (nbsp + ndash) - missing space after ndash added", () => {
  mixer({
    convertDashes: true,
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am", opt).res,
      `10am${rawNbsp}${rawNDash}${rawNbsp}11am`,
      "059.01",
    );
  });
});

test("060 - missing space after ndash added (nbsp + ndash) - missing space after ndash added", () => {
  mixer({
    convertDashes: true,
    removeWidows: true,
    convertEntities: false,
    addMissingSpaces: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "10am&nbsp;&ndash;11am", opt).res,
      `10am${rawNbsp}${rawNDash}${rawNbsp}11am`,
      "060.01",
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
      "060.02",
    );
  });
});

// 02. whitespace control
// -----------------------------------------------------------------------------

test("061 - deletes space around n-dash between numbers", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `1880 ${rawNDash} 1912`, opt).res,
      `1880${rawNDash}1912`,
      "061.01",
    );
  });
});

test("062 - deletes space around n-dash between numbers", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "1880 &ndash; 1912", opt).res,
      `1880${rawNDash}1912`,
      "062.01",
    );
  });
});

test("063 - deletes space around n-dash between numbers", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `1880 ${rawNDash} 1912`, opt).res,
      "1880&ndash;1912",
      "063.01",
    );
  });
});

test("064 - deletes space around n-dash between numbers", () => {
  mixer({
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "1880 &ndash; 1912", opt).res,
      "1880&ndash;1912",
      "064.01",
    );
  });
});

test("065 - space in front of n-dash, missing space after it", () => {
  mixer({
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `1880 ${rawNDash}1912`, opt).res,
      `1880${rawNDash}1912`,
      "065.01",
    );
  });
});

test("066 - jinja/nunjucks code chunk with double quotes", () => {
  let str1 = '{{ "%.2f"|format(total.value) }}';
  mixer().forEach((opt, n) => {
    equal(det(ok, not, n, str1, opt).res, str1, "066.01");
  });

  let str2 = '{% if z == "text" %}{{ text }}{% endif %}';
  mixer().forEach((opt, n) => {
    equal(det(ok, not, n, str2, opt).res, str2, "066.02");
  });

  let str3 = '{%- if z == "text" -%}{{ text }}{%- endif -%}';
  mixer().forEach((opt, n) => {
    equal(det(ok, not, n, str3, opt).res, str3, "066.03");
  });
});

test("067", () => {
  equal(
    det1(`Abc;${rawNbsp}de fghij klmnop.`, {
      convertEntities: true,
      removeWidows: true,
    }).res,
    "Abc;&nbsp;de fghij&nbsp;klmnop.",
    "067.01",
  );
});

test("068", () => {
  mixer({
    convertEntities: true,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Abc;${rawNbsp}de fghij klmnop.`, opt).res,
      "Abc;&nbsp;de fghij&nbsp;klmnop.",
      "068.01",
    );
  });
});

test("069", () => {
  mixer({
    convertEntities: false,
    removeWidows: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Abc;${rawNbsp}fghij klm nop.`, opt).res,
      `Abc;${rawNbsp}fghij klm${rawNbsp}nop.`,
      "069.01",
    );
  });
});

test("070", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Abc;${rawNbsp}de fg.`, opt).res,
      "Abc; de fg.",
      "070.01",
    );
  });
});

test("071 - sanity check #02", () => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Semicolon;&is cool.", opt).res,
      "Semicolon;&is cool.",
      "071.01",
    );
  });
});

test.run();

import test from "ava";
import fix from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01.01 - empty string", t => {
  t.notThrows(() => {
    fix("");
  });
  const error1 = t.throws(() => {
    fix();
  });
  t.regex(error1.message, /THROW_ID_01/);

  const error2 = t.throws(() => {
    fix(true);
  });
  t.regex(error2.message, /THROW_ID_01/);

  const error3 = t.throws(() => {
    fix(0);
  });
  t.regex(error3.message, /THROW_ID_01/);

  const error4 = t.throws(() => {
    fix(1);
  });
  t.regex(error4.message, /THROW_ID_01/);

  const error5 = t.throws(() => {
    fix(null);
  });
  t.regex(error5.message, /THROW_ID_01/);
});

// -----------------------------------------------------------------------------
// 02. special attention to nbsp - people will type it by hand often, making mistakes
// -----------------------------------------------------------------------------

test.only(`02.01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - correct spelling, missing ampersand`, t => {
  t.deepEqual(
    fix("zzznbsp;zzznbsp;"),
    [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]],
    "02.01.01 - letter + nbsp"
  );
  t.deepEqual(
    fix("zz nbsp;zz nbsp;"),
    [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]],
    "02.01.02 - space + nbsp"
  );
  t.deepEqual(
    fix("zz\nnbsp;zz\nnbsp;"),
    [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]],
    "02.01.03 - line break + nbsp"
  );
  t.deepEqual(fix("nbsp;"), [[0, 5, "&nbsp;"]], "02.01.04");
  t.deepEqual(
    fix("nbsp;zzznbsp;"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]],
    "02.01.04"
  );
});
test(`02.02 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - correct spelling, missing semicol`, t => {
  //
});
test(`02.03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - correct spelling, missing both ampersand and semicol`, t => {
  //
});
test(`02.04 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - incorrect spelling, repeated characters, complete set`, t => {
  //
});
test(`02.05 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - incorrect spelling, repeated characters, incomplete set`, t => {
  // missing ampersand
  t.deepEqual(fix("aaannbsp;aaaa"), [[3, 9, "&nbsp;"]], "02.05.01");
});

test("99.12 - part 1", t => {
  t.deepEqual(
    fix("a\nnsp;a\nnsp;"),
    [[2, 6, "&nbsp;"], [8, 12, "&nbsp;"]],
    "99.12.02"
  );
  t.deepEqual(
    fix("a\nnbp;a\nnbp;"),
    [[2, 6, "&nbsp;"], [8, 12, "&nbsp;"]],
    "99.12.03"
  );
  t.deepEqual(
    fix("a\nnbs;"),
    [[2, 6, "&nbsp;"], [8, 12, "&nbsp;"]],
    "99.12.04"
  );
  t.deepEqual(
    fix("text&nbstext&nbstext"),
    [[4, 8, "&nbsp;"], [12, 16, "&nbsp;"]],
    "99.12.05"
  );
  t.deepEqual(
    fix("textnsp;textnsp;"),
    [[4, 8, "&nbsp;"], [12, 16, "&nbsp;"]],
    "99.12.06"
  );
  t.deepEqual(
    fix("text&nsp;text&nsp;"),
    [[4, 9, "&nbsp;"], [13, 18, "&nbsp;"]],
    "99.12.07"
  );

  t.deepEqual(
    fix("&nsptext&nsptext"),
    [[0, 4, "&nbsp;"], [8, 12, "&nbsp;"]],
    "99.12.08"
  );
  t.deepEqual(
    fix("&bsptext&bsptext"),
    [[0, 4, "&nbsp;"], [8, 12, "&nbsp;"]],
    "99.12.09"
  );
  t.deepEqual(
    fix("&nsp;text&nsp;text"),
    [[0, 5, "&nbsp;"], [9, 14, "&nbsp;"]],
    "99.12.10"
  );
  t.deepEqual(
    fix("&bsp;text&bsp;text"),
    [[0, 5, "&nbsp;"], [9, 14, "&nbsp;"]],
    "99.12.11"
  );
  t.deepEqual(
    fix("&nbptext&nbptext"),
    [[0, 4, "&nbsp;"], [8, 12, "&nbsp;"]],
    "99.12.12"
  );
  t.deepEqual(
    fix("&nbp;text&nbp;text"),
    [[0, 5, "&nbsp;"], [9, 14, "&nbsp;"]],
    "99.12.13"
  );
  t.deepEqual(
    fix("text&nbs;text&nbs;"),
    [[4, 9, "&nbsp;"], [31, 18, "&nbsp;"]],
    "99.12.14"
  );
});

test("99.13 - part 2", t => {
  // now, dangerous stuff: missing ampersand and one letter (semicol present)
  // 1. letter on one side, EOL on other:
  t.deepEqual(fix("zzzzbsp;"), [[4, 8, "&nbsp;"]], "99.13.01");
  t.deepEqual(fix("zzzznsp;"), [[4, 8, "&nbsp;"]], "99.13.02");
  t.deepEqual(fix("zzzznbp;"), [[4, 8, "&nbsp;"]], "99.13.03");
  t.deepEqual(fix("zzzznbs;"), [[4, 8, "&nbsp;"]], "99.13.04");
  t.deepEqual(fix("bsp;zzzz"), [[0, 4, "&nbsp;"]], "99.13.05");
  t.deepEqual(fix("nsp;zzzz"), [[0, 4, "&nbsp;"]], "99.13.06");
  t.deepEqual(fix("nbp;zzzz"), [[0, 4, "&nbsp;"]], "99.13.07");
  t.deepEqual(fix("nbs;zzzz"), [[0, 4, "&nbsp;"]], "99.13.08");

  // 2. EOL on both sides:
  t.deepEqual(fix("bsp;"), [[0, 4, "&nbsp;"]], "99.13.09");
  t.deepEqual(fix("nsp;"), [[0, 4, "&nbsp;"]], "99.13.10");
  t.deepEqual(fix("nbp;"), [[0, 4, "&nbsp;"]], "99.13.11");
  t.deepEqual(fix("nbs;"), [[0, 4, "&nbsp;"]], "99.13.12");

  // 3. space on either side:
  t.deepEqual(fix("aaaa bsp;"), [[5, 9, "&nbsp;"]], "99.13.13");
  t.deepEqual(fix("aaaa nsp;"), [[5, 9, "&nbsp;"]], "99.13.14");
  t.deepEqual(fix("aaaa nbp;"), [[5, 9, "&nbsp;"]], "99.13.15");
  t.deepEqual(fix("aaaa nbs;"), [[5, 9, "&nbsp;"]], "99.13.16");
  t.deepEqual(fix("bsp; aaaa"), [[0, 4, "&nbsp;"]], "99.13.17");
  t.deepEqual(fix("nsp; aaaa"), [[0, 4, "&nbsp;"]], "99.13.18");
  t.deepEqual(fix("nbp; aaaa"), [[0, 4, "&nbsp;"]], "99.13.19");
  t.deepEqual(fix("nbs; aaaa"), [[0, 4, "&nbsp;"]], "99.13.20");
  t.deepEqual(fix("aaaa bsp; aaaa"), [[5, 9, "&nbsp;"]], "99.13.21");
  t.deepEqual(fix("aaaa nsp; aaaa"), [[5, 9, "&nbsp;"]], "99.13.22");
  t.deepEqual(fix("aaaa nbp; aaaa"), [[5, 9, "&nbsp;"]], "99.13.23");
  t.deepEqual(fix("aaaa nbs; aaaa"), [[5, 9, "&nbsp;"]], "99.13.24");
});

test("99.14 - part 3", t => {
  t.deepEqual(
    fix("text &nbsp text nbsp text"),
    [[5, 10, "&nbsp;"], [16, 20, "&nbsp;"]],
    "99.14.01"
  );
  t.deepEqual(
    fix("text &ang text&ang text"),
    [[5, 9, "&ang;"], [14, 18, "&ang;"]],
    "99.14.02"
  );
  t.deepEqual(
    fix("text&angtext&angtext"),
    [[4, 8, "&ang;"], [12, 16, "&ang;"]],
    "99.14.03"
  );
  t.deepEqual(
    fix("text&angsttext&angsttext"),
    [[4, 10, "&angst;"], [14, 20, "&angst;"]],
    "99.14.04"
  );
  t.deepEqual(
    fix("text&pitext&pitext"),
    [[4, 7, "&pi;"], [11, 14, "&pi;"]],
    "99.14.05"
  );
  t.deepEqual(
    fix("text&Pitext&Pitext"),
    [[4, 7, "&Pi;"], [11, 14, "&Pi;"]],
    "99.14.06"
  );
  t.deepEqual(
    fix("text&sigmatext&sigmatext"),
    [[4, 10, "&sigma;"], [14, 20, "&sigma;"]],
    "99.14.07"
  );
  t.deepEqual(
    fix("text&subtext&subtext"),
    [[4, 8, "&sub;"], [12, 16, "&sub;"]],
    "99.14.08"
  );
  t.deepEqual(
    fix("text&suptext&suptext"),
    [[4, 8, "&sub;"], [12, 16, "&sub;"]],
    "99.14.09"
  );
  t.deepEqual(
    fix("text&pivtext&pivtext"),
    [[4, 8, "&sub;"], [12, 16, "&sub;"]],
    "99.14.10"
  );
  t.deepEqual(
    fix("text&thetatext&thetatext"),
    [[4, 10, "&theta;"], [14, 20, "&theta;"]],
    "99.14.11"
  );
  t.deepEqual(fix("thinsp"), [[0, 6, "\u2009"]], "99.14.12");
  t.deepEqual(
    fix("a thinsp b\nthinsp\nc"),
    [[2, 8, ""], [(11, 17, "")]],
    "99.14.13"
  );
  t.deepEqual(fix("&thinsp"), [[0, 7, ""]], "99.14.14");
  t.deepEqual(fix("thinsp;"), [[0, 7, ""]], "99.14.15");
  t.deepEqual(fix("&thinsp&thinsp"), [[0, 14, ""]], "99.14.16");
  t.deepEqual(fix("thinsp;thinsp;"), [[0, 14, ""]], "99.14.17");
});

test("99.15 - part 4", t => {
  // At least one of each of the set [n, b, s, p] is present.
  // any repetitions whatsoever like &&&&&nnnbbbssssp;;;
  t.deepEqual(fix("aaa&nnnbbssssppp;bbb"), [[3, 17, "&nbsp;"]], "99.15.01");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;bbb"), [[3, 20, "&nbsp;"]], "99.15.02");
  t.deepEqual(fix("aaa&nnnbbssssppp bbb"), [[3, 16, "&nbsp;"]], "99.15.03");
  t.deepEqual(fix("aaa&nnnbbssssp bbb"), [[3, 14, "&nbsp;"]], "99.15.04");
  t.deepEqual(fix("aaa&nnnbbssssp,bbb"), [[3, 14, "&nbsp;"]], "99.15.05");
  t.deepEqual(fix("aaa&nnnbbssssp.bbb"), [[3, 14, "&nbsp;"]], "99.15.06");
  t.deepEqual(fix("aaa&nnnbbssssp?bbb"), [[3, 14, "&nbsp;"]], "99.15.07");
  t.deepEqual(fix("aaa&nnnbbssssp-bbb"), [[3, 14, "&nbsp;"]], "99.15.08");
  t.deepEqual(fix("aaa&nnnbbssssp;bbb"), [[3, 14, "&nbsp;"]], "99.15.09");
  t.deepEqual(fix("aaa&nnnbbssssp\nbbb"), [[3, 14, "&nbsp;"]], "99.15.10");
});

test("99.16 - part 5", t => {
  // One letter missing, but amp and semicol are present.
  t.deepEqual(
    fix("text&bsp;text&bsp;text"),
    [[4, 9, "&nbsp;"], [13, 18, "&nbsp;"]],
    "99.16.01"
  );
  t.deepEqual(
    fix("text&nsp;text&nsp;text"),
    [[4, 9, "&nbsp;"], [13, 18, "&nbsp;"]],
    "99.16.02"
  );
  t.deepEqual(
    fix("text&npb;text&npb;text"),
    [[4, 9, "&nbsp;"], [13, 18, "&nbsp;"]],
    "99.16.03"
  );
  t.deepEqual(
    fix("text&nbp;text&nbp;text"),
    [[4, 9, "&nbsp;"], [13, 18, "&nbsp;"]],
    "99.16.04"
  );
  t.deepEqual(
    fix("text&nbs;text&nbs;text"),
    [[4, 9, "&nbsp;"], [13, 18, "&nbsp;"]],
    "99.16.05"
  );
});

test("99.17 - part 6", t => {
  // Fix missing semicolon when ampersand is present
  t.deepEqual(
    fix("&nBsPzzz&nBsPzzz"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]],
    "99.17.01"
  );
  t.deepEqual(
    fix("&NbSpzzz&NbSpzzz"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]],
    "99.17.02"
  );
  t.deepEqual(fix("text;Nbsptext"), [[5, 9, "&nbsp;"]], "99.17.03");
  t.deepEqual(fix("text Nbsptext"), [[5, 9, "text &nbsp;text"]], "99.17.04");
  t.deepEqual(
    fix("textNbsp;texttextNbsp;text"),
    [[4, 9, "&nbsp;"], [17, 22, "&nbsp;"]],
    "99.17.05"
  );
  t.deepEqual(
    fix("&&NbSpzzz&&NbSpzzz"),
    [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]],
    "99.17.06"
  );
  t.deepEqual(
    fix("&NbSspzzz&NbSspzzz"),
    [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]],
    "99.17.07"
  );
  t.deepEqual(
    fix("&NbSsPzzz&NbSsPzzz"),
    [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]],
    "99.17.08"
  );
  t.deepEqual(
    fix("&NbSsP zzz&NbSsP zzz"),
    [[0, 6, "&nbsp;"], [10, 16, "&nbsp;"]],
    "99.17.09"
  );
  t.deepEqual(
    fix("&NbSsP zzz &NbSsP zzz"),
    [[0, 6, "&nbsp;"], [11, 17, "&nbsp;"]],
    "99.17.10"
  );
});

test(`99.18 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - recursively encoded entities`, t => {
  t.deepEqual(fix("a&amp;nbsp;b"), [[2, 6]], "99.18.01 - twice-encoded");
  // t.deepEqual(fix("a&amp;amp;nbsp;b"), [[2, 10]], "99.18.02 - triple-encoded");
});

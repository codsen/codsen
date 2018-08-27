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

test(`02.01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - correct spelling, missing ampersand`, t => {
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
  t.deepEqual(fix("&nbspz"), [[0, 5, "&nbsp;"]], "02.02.00 - warmup");
  t.deepEqual(
    fix("&nbspzzz&nbspzzz&nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.01 - surrounded by letters"
  );
  t.deepEqual(
    fix("&nbsp...&nbsp...&nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.02 - surrounded by dots"
  );
  t.deepEqual(
    fix("&nbsp\n\n\n&nbsp\n\n\n&nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.03 - surrounded by line breaks"
  );
  t.deepEqual(
    fix("&nbsp   &nbsp   &nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.04 - surrounded by spaces"
  );
  t.deepEqual(
    fix("&nbsp,&nbsp,&nbsp"),
    [[0, 5, "&nbsp;"], [6, 11, "&nbsp;"], [12, 17, "&nbsp;"]],
    "02.02.05 - surrounded by colons"
  );
  t.deepEqual(
    fix("&nbsp123&nbsp123&nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.06 - surrounded by digits"
  );
  t.deepEqual(
    fix("&nbsp\t\t\t&nbsp\t\t\t&nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.07 - surrounded by tabs"
  );
});

test(`02.03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - correct spelling, missing both ampersand and semicol`, t => {
  t.deepEqual(fix("nbspz"), [[0, 4, "&nbsp;"]], "02.03.00 - warmup");
  t.deepEqual(
    fix("nbspzzznbspzzznbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.01 - surrounded by letters"
  );
  t.deepEqual(
    fix("nbsp...nbsp...nbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.02 - surrounded by dots"
  );
  t.deepEqual(
    fix("nbsp\n\n\nnbsp\n\n\nnbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.03 - surrounded by line breaks"
  );
  t.deepEqual(
    fix("nbsp   nbsp   nbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.04 - surrounded by spaces"
  );
  t.deepEqual(
    fix("nbsp,nbsp,nbsp"),
    [[0, 4, "&nbsp;"], [5, 9, "&nbsp;"], [10, 14, "&nbsp;"]],
    "02.03.05 - surrounded by colons"
  );
  t.deepEqual(
    fix("nbsp123nbsp123nbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.06 - surrounded by digits"
  );
  t.deepEqual(
    fix("nbsp\t\t\tnbsp\t\t\tnbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.07 - surrounded by tabs"
  );
});

test(`02.04 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - incorrect spelling (repeated characters), complete set`, t => {
  t.deepEqual(
    fix("&&nbsp;x&&nbsp;y&&nbsp;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.01 - duplicate ampersand"
  );
  t.deepEqual(
    fix("&nnbsp;x&nnbsp;y&nnbsp;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.02 - duplicate n"
  );
  t.deepEqual(
    fix("&nbbsp;x&nbbsp;y&nbbsp;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.03 - duplicate b"
  );
  t.deepEqual(
    fix("&nbssp;x&nbssp;y&nbssp;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.04 - duplicate s"
  );
  t.deepEqual(
    fix("&nbspp;x&nbspp;y&nbspp;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.05 - duplicate p"
  );
  t.deepEqual(
    fix("&nbsp;;x&nbsp;;y&nbsp;;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.06 - duplicate semicolon"
  );
});

test(`02.05 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - incorrect spelling (repeated characters), incomplete set`, t => {
  // repeated ampersand + ...
  t.deepEqual(
    fix("&&bsp;x&&bsp;y&&bsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.01 - repeated ampersand + n missing"
  );
  t.deepEqual(
    fix("&&nsp;x&&nsp;y&&nsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.02 - repeated ampersand + b missing"
  );
  t.deepEqual(
    fix("&&nbp;x&&nbp;y&&nbp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.03 - repeated ampersand + s missing"
  );
  t.deepEqual(
    fix("&&nbs;x&&nbs;y&&nbs;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.04 - repeated ampersand + p missing"
  );
  t.deepEqual(
    fix("&&nbspx&&nbspy&&nbsp"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.05 - repeated ampersand + semicol missing"
  );

  // repeated n + ...
  t.deepEqual(
    fix("nnbsp;xnnbsp;ynnbsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.06 - repeated n + ampersand missing"
  );
  t.deepEqual(
    fix("&nnsp;x&nnsp;y&nnsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.07 - repeated n + b missing"
  );
  t.deepEqual(
    fix("&nnbp;x&nnbp;y&nnbp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.08 - repeated n + s missing"
  );
  t.deepEqual(
    fix("&nnbs;x&nnbs;y&nnbs;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.09 - repeated n + p missing"
  );
  t.deepEqual(
    fix("&nnbspx&nnbspy&nnbsp"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.10 - repeated n + semicol missing"
  );

  // repeated b + ...
  t.deepEqual(
    fix("nbbsp;xnbbsp;ynbbsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.11 - repeated b + ampersand missing"
  );
  t.deepEqual(
    fix("&bbsp;x&bbsp;y&bbsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.12 - repeated b + n missing"
  );
  t.deepEqual(
    fix("&nbbp;x&nbbp;y&nbbp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.13 - repeated b + s missing"
  );
  t.deepEqual(
    fix("&nbbs;x&nbbs;y&nbbs;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.14 - repeated b + p missing"
  );
  t.deepEqual(
    fix("&nbbspx&nbbspy&nbbsp"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.15 - repeated b + semicol missing"
  );

  // repeated s + ...
  t.deepEqual(
    fix("nbssp;xnbssp;ynbssp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.16 - repeated s + ampersand missing"
  );
  t.deepEqual(
    fix("&bssp;x&bssp;y&bssp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.17 - repeated s + n missing"
  );
  t.deepEqual(
    fix("&nssp;x&nssp;y&nssp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.18 - repeated s + b missing"
  );
  t.deepEqual(
    fix("&nbss;x&nbss;y&nbss;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.19 - repeated s + p missing"
  );
  t.deepEqual(
    fix("&nbsspx&nbsspy&nbssp"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.20 - repeated s + semicol missing"
  );

  // repeated p + ...
  t.deepEqual(
    fix("nbspp;xnbspp;ynbspp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.21 - repeated p + ampersand missing"
  );
  t.deepEqual(
    fix("&bspp;x&bspp;y&bspp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.22 - repeated p + n missing"
  );
  t.deepEqual(
    fix("&nspp;x&nspp;y&nspp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.23 - repeated p + b missing"
  );
  t.deepEqual(
    fix("&nbpp;x&nbpp;y&nbpp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.24 - repeated p + s missing"
  );
  t.deepEqual(
    fix("&nbsppx&nbsppy&nbspp"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.25 - repeated p + semicol missing"
  );

  // repeated semicol + ...
  t.deepEqual(
    fix("nbsp;;xnbsp;;ynbsp;;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.26 - repeated semicol + ampersand missing"
  );
  t.deepEqual(
    fix("&bsp;;x&bsp;;y&bsp;;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.27 - repeated semicol + n missing"
  );
  t.deepEqual(
    fix("&nsp;;x&nsp;;y&nsp;;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.28 - repeated semicol + b missing"
  );
  t.deepEqual(
    fix("&nbp;;x&nbp;;y&nbp;;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.29 - repeated semicol + s missing"
  );
  t.deepEqual(
    fix("&nbs;;x&nbs;;y&nbs;;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.04.30 - repeated semicol + p missing"
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

const t = require("tap");
const { det, mixer } = require("../t-util/util");

t.test(`01.01 - repetitions - semicols`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaa &nnnbbbspp;;;; aaa", opt).res,
      "aaa &nbsp; aaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.02 - repetitions - no semicols`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaa nnnbbbsssp aaaa", opt).res,
      "aaa &nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.03 - repetitions - mashed`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaaa&nnnnbbbssssppp;aaa", opt).res,
      "aaaa&nbsp;aaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.04 - repetitions - amp missing, repetitions`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaannnbbbsssp;aaaa", opt).res,
      "aaa&nbsp;aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.05 - repetitions - amp and semicol missing`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaa&nnnbbbssspaaaa", opt).res,
      "aaa&nbsp;aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.06 - repetitions - sandwiched, n repeated`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaa&nnbsp;aaaa", opt).res,
      "aaa&nbsp;aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.07 - repetitions - sandwiched, amp missing`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaannbsp;aaaa", opt).res,
      "aaa&nbsp;aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.08 - repetitions - sandwiched, amp missing`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaa&nnbspaaaa", opt).res,
      "aaa&nbsp;aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.09 - repetitions - n repeated, spaced`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaa &nnbsp; aaaa", opt).res,
      "aaa &nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.10 - repetitions - n repeated, spaced, amp missing`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaa nnbsp; aaaa", opt).res,
      "aaa &nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.11 - repetitions - n repeated, spaced, semicol missing`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "aaa &nnbsp aaaa", opt).res,
      "aaa &nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.12 - repetitions - longer sentence, convertEntities=on`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa &nnnbbbspp;;;; aaa\naaa nnnbbbsssp aaaa\naaaa&nnnnbbbssssppp;aaa\naaannnbbbsssp;aaaa\naaa&nnnbbbssspaaaa\naaa&nnbsp;aaaa\naaannbsp;aaaa\naaa&nnbspaaaa\naaa &nnbsp; aaaa\naaa nnbsp; aaaa\naaa &nnbsp aaaa",
        opt
      ).res,
      "aaa &nbsp; aaa<br/>\naaa &nbsp; aaaa<br/>\naaaa&nbsp;aaa<br/>\naaa&nbsp;aaaa<br/>\naaa&nbsp;aaaa<br/>\naaa&nbsp;aaaa<br/>\naaa&nbsp;aaaa<br/>\naaa&nbsp;aaaa<br/>\naaa &nbsp; aaaa<br/>\naaa &nbsp; aaaa<br/>\naaa &nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.13 - repetitions - longer sentence, useXHTML=off`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa &nnnbbbspp;;;; aaa\naaa nnnbbbsssp aaaa\naaaa&nnnnbbbssssppp;aaa\naaannnbbbsssp;aaaa\naaa&nnnbbbssspaaaa\naaa&nnbsp;aaaa\naaannbsp;aaaa\naaa&nnbspaaaa\naaa &nnbsp; aaaa\naaa nnbsp; aaaa\naaa &nnbsp aaaa",
        opt
      ).res,
      "aaa &nbsp; aaa<br>\naaa &nbsp; aaaa<br>\naaaa&nbsp;aaa<br>\naaa&nbsp;aaaa<br>\naaa&nbsp;aaaa<br>\naaa&nbsp;aaaa<br>\naaa&nbsp;aaaa<br>\naaa&nbsp;aaaa<br>\naaa &nbsp; aaaa<br>\naaa &nbsp; aaaa<br>\naaa &nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.14 - repetitions - longer sentence, repeated semicols`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    removeLineBreaks: 1,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa &nnnbbbspp;;;; aaa\naaa nnnbbbsssp aaaa\naaaa&nnnnbbbssssppp;aaa\naaannnbbbsssp;aaaa\naaa&nnnbbbssspaaaa\naaa&nnbsp;aaaa\naaannbsp;aaaa\naaa&nnbspaaaa\naaa &nnbsp; aaaa\naaa nnbsp; aaaa\naaa &nnbsp aaaa",
        opt
      ).res,
      "aaa &nbsp; aaa aaa &nbsp; aaaa aaaa&nbsp;aaa aaa&nbsp;aaaa aaa&nbsp;aaaa aaa&nbsp;aaaa aaa&nbsp;aaaa aaa&nbsp;aaaa aaa &nbsp; aaaa aaa &nbsp; aaaa aaa &nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.15 - nbSp with no semicol #1, convertEntities=on`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "a nbbSp a", opt).res,
      "a &nbsp; a",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.16 - nbSp with no semicol #2, convertEntities=off`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "a nbbSppp; a", opt).res,
      "a &nbsp; a",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

// NBSP missing letters AMPERSAND OBLIGATORY, SEMICOL - NOT:

t.test(`01.17 - NBSP missing letters - &nbsp missing p`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa&nbs;aaaa\naaa&nbsaaaa\naaa &nbs; aaaa\naaa &nbs aaaa\naaa &nbs\naaa &nbs",
        opt
      ).res,
      "aaa&nbsp;aaaa\naaa&nbsp;aaaa\naaa &nbsp; aaaa\naaa &nbsp; aaaa\naaa &nbsp;\naaa &nbsp;",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.18 - NBSP missing letters - &nbsp missing s`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa&nbp;aaaa\naaa&nbpaaaa\naaa &nbp; aaaa\naaa &nbp aaaa\naaa &nbp\naaa &nbp",
        opt
      ).res,
      "aaa&nbsp;aaaa\naaa&nbsp;aaaa\naaa &nbsp; aaaa\naaa &nbsp; aaaa\naaa &nbsp;\naaa &nbsp;",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.19 - NBSP missing letters - &nbsp missing b`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa&nsp;aaaa\naaa&nspaaaa\naaa &nsp; aaaa\naaa &nsp aaaa\naaa &nsp\naaa &nsp",
        opt
      ).res,
      "aaa&nbsp;aaaa\naaa&nbsp;aaaa\naaa &nbsp; aaaa\naaa &nbsp; aaaa\naaa &nbsp;\naaa &nbsp;",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.20 - NBSP missing letters - &nbsp missing n`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa&bsp;aaaa\naaa&bspaaaa\naaa &bsp; aaaa\naaa &bsp aaaa\naaa &bsp\naaa &bsp",
        opt
      ).res,
      "aaa&nbsp;aaaa\naaa&nbsp;aaaa\naaa &nbsp; aaaa\naaa &nbsp; aaaa\naaa &nbsp;\naaa &nbsp;",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

// NBSP missing letters SEMICOL OBLIGATORY, AMPERSAND - NOT:

t.test(`01.21 - broken nbsp - nbsp; (no ampersand)`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa&nbs;aaaa\naaanbs;aaaa\naaa &nbs; aaaa\naaa nbs; aaaa\nnbs; aaaa\nnbs; aaaa",
        opt
      ).res,
      "aaa&nbsp;aaaa\naaa&nbsp;aaaa\naaa &nbsp; aaaa\naaa &nbsp; aaaa\n&nbsp; aaaa\n&nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.22 - broken nbsp - nbsp; (no ampersand)`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa&nbp;aaaa\naaanbp;aaaa\naaa &nbp; aaaa\naaa nbp; aaaa\nnbp; aaaa\nnbp; aaaa",
        opt
      ).res,
      "aaa&nbsp;aaaa\naaa&nbsp;aaaa\naaa &nbsp; aaaa\naaa &nbsp; aaaa\n&nbsp; aaaa\n&nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.23 - broken nbsp - nbsp; (no ampersand)`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa&nsp;aaaa\naaansp;aaaa\naaa &nsp; aaaa\naaa nsp; aaaa\nnsp; aaaa\nnsp; aaaa",
        opt
      ).res,
      "aaa&nbsp;aaaa\naaa&nbsp;aaaa\naaa &nbsp; aaaa\naaa &nbsp; aaaa\n&nbsp; aaaa\n&nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

t.test(`01.24 - broken nbsp - nbsp; (no ampersand)`, t => {
  mixer({
    fixBrokenEntities: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "aaa&bsp;aaaa\naaabsp;aaaa\naaa &bsp; aaaa\naaa bsp; aaaa\nbsp; aaaa\nbsp; aaaa",
        opt
      ).res,
      "aaa&nbsp;aaaa\naaa&nbsp;aaaa\naaa &nbsp; aaaa\naaa &nbsp; aaaa\n&nbsp; aaaa\n&nbsp; aaaa",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

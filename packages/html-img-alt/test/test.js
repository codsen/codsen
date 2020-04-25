import tap from "tap";
import alt from "../dist/html-img-alt.esm";

// GROUP ZEROZERO.
// -----------------------------------------------------------------------------
// no alt attr is missing, only whitespace control

tap.test("00.01 - nothing is missing", (t) => {
  t.same(
    alt('zzz<img        alt="123" >zzz'),
    'zzz<img alt="123" >zzz',
    "00.01 - one HTML tag, only excessive whitespace"
  );
  t.end();
});

tap.test("00.02 - nothing is missing", (t) => {
  t.same(
    alt('<img   alt="123"    >'),
    '<img alt="123" >',
    "00.02 - whitespace on both sides, one tag"
  );
  t.end();
});

tap.test("00.03 - nothing is missing", (t) => {
  t.same(
    alt('xxx<img        alt="123" >yyy<img   alt="123"    >zzz'),
    'xxx<img alt="123" >yyy<img alt="123" >zzz',
    "00.03 - multiple HTML tags, only excessive whitespace"
  );
  t.end();
});

tap.test("00.04 - nothing is missing", (t) => {
  t.same(
    alt('zzz<img        alt="123" />zzz'),
    'zzz<img alt="123" />zzz',
    "00.04 - one XHTML tag, only excessive whitespace"
  );
  t.end();
});

tap.test("00.05 - nothing is missing", (t) => {
  t.same(
    alt('xxx<img        alt="123" />yyy<img   alt="123"    />zzz'),
    'xxx<img alt="123" />yyy<img alt="123" />zzz',
    "00.05 - multiple XHTML tags, only excessive whitespace"
  );
  t.end();
});

tap.test("00.06 - nothing is missing", (t) => {
  t.same(
    alt("aaaa        bbbbb"),
    "aaaa        bbbbb",
    "00.06 - excessive whitespace, no tags at all"
  );
  t.end();
});

tap.test("00.07 - nothing is missing", (t) => {
  t.same(
    alt("aaaa alt bbbbb"),
    "aaaa alt bbbbb",
    "00.07 - suspicious alt within copy but not IMG tag"
  );
  t.end();
});

tap.test("00.08 - nothing is missing", (t) => {
  t.same(
    alt("aaaa alt= bbbbb"),
    "aaaa alt= bbbbb",
    "00.08 - suspicious alt= within copy but not IMG tag"
  );
  t.end();
});

tap.test("00.09 - nothing is missing", (t) => {
  t.same(
    alt("aaaa alt = bbbbb"),
    "aaaa alt = bbbbb",
    "00.09 - suspicious alt= within copy but not IMG tag"
  );
  t.end();
});

tap.test("00.10 - nothing is missing", (t) => {
  t.same(
    alt('<img alt="1   23" >'),
    '<img alt="1   23" >',
    "00.10 - does nothing"
  );
  t.end();
});

tap.test("00.11 - nothing is missing", (t) => {
  t.same(
    alt('<img    class="zzz"   alt="123"    >'),
    '<img class="zzz" alt="123" >',
    "00.11 - whitespace on both sides, one tag"
  );
  t.end();
});

tap.test("00.12 - nothing is missing", (t) => {
  t.same(
    alt('zzz<img        alt="123"    /  >yyy'),
    'zzz<img alt="123" />yyy',
    "00.12"
  );
  t.end();
});

tap.test("00.13 - nothing is missing", (t) => {
  t.same(
    alt('z/zz<img        alt="/123/"    /  >y/yy'),
    'z/zz<img alt="/123/" />y/yy',
    "00.13"
  );
  t.end();
});

tap.test("00.14 - nothing is missing", (t) => {
  t.same(
    alt('zzz<img     alt    =     ""    /     >zzz'),
    'zzz<img alt="" />zzz',
    "00.14"
  );
  t.end();
});

tap.test("00.15 - nothing is missing", (t) => {
  t.same(
    alt('zzz<img        alt="123"   class="test" >zzz'),
    'zzz<img alt="123" class="test" >zzz',
    "00.15"
  );
  t.end();
});

// GROUP ONE.
// -----------------------------------------------------------------------------
// alt attr is missing

tap.test("01.01 - missing alt", (t) => {
  t.same(alt("zzz<img>zzz"), 'zzz<img alt="" >zzz', "01.01 - html - tight");
  t.end();
});

tap.test("01.02 - missing alt", (t) => {
  t.same(
    alt("zzz<img >zzz"),
    'zzz<img alt="" >zzz',
    "01.02 - html - trailing space"
  );
  t.end();
});

tap.test("01.03 - missing alt", (t) => {
  t.same(
    alt("zzz<img      >zzz"),
    'zzz<img alt="" >zzz',
    "01.03 - html - excessive trailing space"
  );
  t.end();
});

tap.test("01.04 - missing alt", (t) => {
  t.same(alt("zzz<img/>zzz"), 'zzz<img alt="" />zzz', "01.04 - xhtml - tight");
  t.end();
});

tap.test("01.05 - missing alt", (t) => {
  t.same(
    alt("zzz<img />zzz"),
    'zzz<img alt="" />zzz',
    "01.05 - xhtml - one space before slash"
  );
  t.end();
});

tap.test("01.06 - missing alt", (t) => {
  t.same(
    alt("zzz<img           />zzz"),
    'zzz<img alt="" />zzz',
    "01.06 - xhtml - many spaces before slash"
  );
  t.end();
});

tap.test("01.07 - missing alt", (t) => {
  t.same(
    alt("zzz<img           /    >zzz"),
    'zzz<img alt="" />zzz',
    "01.07 - xhtml - many spaces on both sides"
  );
  t.end();
});

// GROUP TWO.
// -----------------------------------------------------------------------------
// adds ALT

tap.test("02.01 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt('z<img         a="zz"        >z'),
    'z<img a="zz" alt="" >z',
    "02.01 - html simples"
  );
  t.end();
});

tap.test("02.02 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt('z<img         a="zz"        />z'),
    'z<img a="zz" alt="" />z',
    "02.02 - xhtml simples"
  );
  t.end();
});

tap.test("02.03 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt('z<img         a="zz"        /     >z'),
    'z<img a="zz" alt="" />z',
    "02.03 - xhtml simples"
  );
  t.end();
});

tap.test("02.04 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt('z<img         a="zz"/     >z'),
    'z<img a="zz" alt="" />z',
    "02.04 - xhtml simples"
  );
  t.end();
});

tap.test("02.05 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt(
      'zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       >zzz'
    ),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" >zzz',
    "02.05 - html advanced"
  );
  t.end();
});

tap.test("02.06 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt(
      'zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       />zzz'
    ),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" />zzz',
    "02.06 - xhtml advanced"
  );
  t.end();
});

// GROUP THREE.
// -----------------------------------------------------------------------------
// missing ALT, other attributes present

tap.test(
  "03.01 - alt attribute is missing, there are other attributes too - HTML - #1",
  (t) => {
    // HTML
    t.same(
      alt('zzz<img class="">zzz'),
      'zzz<img class="" alt="" >zzz',
      "03.01"
    );
    t.end();
  }
);

tap.test(
  "03.02 - alt attribute is missing, there are other attributes too - HTML - #2",
  (t) => {
    t.same(
      alt('zzz<img    class="">zzz'),
      'zzz<img class="" alt="" >zzz',
      "03.02"
    );
    t.end();
  }
);

tap.test(
  "03.03 - alt attribute is missing, there are other attributes too - HTML - #3",
  (t) => {
    t.same(
      alt('zzz<img class=""    >zzz<img class=""    >zzz<img class=""    >zzz'),
      'zzz<img class="" alt="" >zzz<img class="" alt="" >zzz<img class="" alt="" >zzz',
      "03.03"
    );
    t.end();
  }
);

tap.test(
  "03.04 - alt attribute is missing, there are other attributes too - XHTML - #1",
  (t) => {
    // XHTML
    t.same(
      alt('zzz<img class=""/>zzz'),
      'zzz<img class="" alt="" />zzz',
      "03.04"
    );
    t.end();
  }
);

tap.test(
  "03.05 - alt attribute is missing, there are other attributes too - XHTML - #1",
  (t) => {
    t.same(
      alt('zzz<img    class=""/>zzz'),
      'zzz<img class="" alt="" />zzz',
      "03.05"
    );
    t.end();
  }
);

tap.test(
  "03.06 - alt attribute is missing, there are other attributes too - XHTML - #2",
  (t) => {
    t.same(
      alt('zzz<img class=""    />zzz'),
      'zzz<img class="" alt="" />zzz',
      "03.06"
    );
    t.end();
  }
);

tap.test(
  "03.07 - alt attribute is missing, there are other attributes too - XHTML - #3",
  (t) => {
    t.same(
      alt('zzz<img    class=""   />zzz'),
      'zzz<img class="" alt="" />zzz',
      "03.07"
    );
    t.end();
  }
);

tap.test(
  "03.08 - alt attribute is missing, there are other attributes too - XHTML - #4",
  (t) => {
    t.same(
      alt(
        'zzz<img class=""       />zzz<img class=""       />zzz<img class=""       />zzz'
      ),
      'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
      "03.08"
    );
    t.end();
  }
);

tap.test(
  "03.09 - alt attribute is missing, there are other attributes too - XHTML - #5",
  (t) => {
    t.same(
      alt('zzz<img class=""/   >zzz'),
      'zzz<img class="" alt="" />zzz',
      "03.09"
    );
    t.end();
  }
);

tap.test(
  "03.10 - alt attribute is missing, there are other attributes too - XHTML - #6",
  (t) => {
    t.same(
      alt('zzz<img    class=""/   >zzz'),
      'zzz<img class="" alt="" />zzz',
      "03.10"
    );
    t.end();
  }
);

tap.test(
  "03.11 - alt attribute is missing, there are other attributes too - XHTML - #7",
  (t) => {
    t.same(
      alt(
        'zzz<img class=""    /   >zzz<img class=""    /   >zzz<img class=""    /   >zzz'
      ),
      'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
      "03.11"
    );
    t.end();
  }
);

// GROUP FOUR.
// -----------------------------------------------------------------------------
// alt attr is present, but without equal and double quotes.

tap.test("04.01 - alt without equal", (t) => {
  t.same(alt("zzz<img alt>zzz"), 'zzz<img alt="" >zzz', "04.01 - html - tight");
  t.end();
});

tap.test("04.02 - alt without equal", (t) => {
  t.same(
    alt("zzz<img    alt>zzz"),
    'zzz<img alt="" >zzz',
    "04.02 - html - excessive white space"
  );
  t.end();
});

tap.test("04.03 - alt without equal", (t) => {
  t.same(
    alt("zzz<img alt >zzz"),
    'zzz<img alt="" >zzz',
    "04.03 - html - one trailing space"
  );
  t.end();
});

tap.test("04.04 - alt without equal", (t) => {
  t.same(
    alt("zzz<img      alt      >zzz"),
    'zzz<img alt="" >zzz',
    "04.04 - html - excessive white space on both sides"
  );
  t.end();
});

tap.test("04.05 - alt without equal", (t) => {
  t.same(
    alt("zzz<img alt/>zzz"),
    'zzz<img alt="" />zzz',
    "04.05 - xhtml - tight"
  );
  t.end();
});

tap.test("04.06 - alt without equal", (t) => {
  t.same(
    alt("zzz<img alt />zzz"),
    'zzz<img alt="" />zzz',
    "04.06 - xhtml - single space on both sides"
  );
  t.end();
});

tap.test("04.07 - alt without equal", (t) => {
  t.same(
    alt("zzz<img      alt   />zzz"),
    'zzz<img alt="" />zzz',
    "04.07 - xhtml - excessive white space on both sides"
  );
  t.end();
});

tap.test("04.08 - alt without equal", (t) => {
  t.same(
    alt("zzz<img      alt   /   >zzz"),
    'zzz<img alt="" />zzz',
    "04.08 - xhtml - excessive white space everywhere"
  );
  t.end();
});

// GROUP FIVE.
// -----------------------------------------------------------------------------
// alt attr is present, but with only equal character

tap.test("05.01 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=>zzz"),
    'zzz<img alt="" >zzz',
    "05.01 - html, no space after"
  );
  t.end();
});

tap.test("05.02 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=>zzz<img alt=>zzz"),
    'zzz<img alt="" >zzz<img alt="" >zzz',
    "05.02 - html, two imag tags, no space after each"
  );
  t.end();
});

tap.test("05.03 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt= >zzz"),
    'zzz<img alt="" >zzz',
    "05.03 - html, space after"
  );
  t.end();
});

tap.test("05.04 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img    alt=>zzz"),
    'zzz<img alt="" >zzz',
    "05.04 - html, excessive space in front"
  );
  t.end();
});

tap.test("05.05 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=    >zzz"),
    'zzz<img alt="" >zzz',
    "05.05 - html, excessive space after"
  );
  t.end();
});

tap.test("05.06 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=/>zzz"),
    'zzz<img alt="" />zzz',
    "05.06 - xhtml, no space after"
  );
  t.end();
});

tap.test("05.07 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=/   >zzz"),
    'zzz<img alt="" />zzz',
    "05.07 - xhtml, no space after"
  );
  t.end();
});

tap.test("05.08 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt= />zzz"),
    'zzz<img alt="" />zzz',
    "05.08 - xhtml, space after"
  );
  t.end();
});

tap.test("05.09 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img    alt=/>zzz"),
    'zzz<img alt="" />zzz',
    "05.09 - xhtml, excessive space before"
  );
  t.end();
});

tap.test("05.10 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=    />zzz"),
    'zzz<img alt="" />zzz',
    "05.10 - xhtml, excessive space after"
  );
  t.end();
});

tap.test("05.11 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img     alt=    />zzz"),
    'zzz<img alt="" />zzz',
    "05.11 - xhtml, excessive space on both sides of alt="
  );
  t.end();
});

tap.test("05.12 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img     alt   =    />zzz"),
    'zzz<img alt="" />zzz',
    "05.12 - xhtml, excessive space on both sides of equal, no quotes"
  );
  t.end();
});

tap.test("05.13 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt    =>zzz"),
    'zzz<img alt="" >zzz',
    "05.13 - html, no space after"
  );
  t.end();
});

tap.test("05.14 - alt with just equal", (t) => {
  t.same(
    alt('zzz<img alt    =   "">zzz'),
    'zzz<img alt="" >zzz',
    "05.14 - html, no space after"
  );
  t.end();
});

// GROUP SIX.
// -----------------------------------------------------------------------------
// alt attr is present, but with only one quote (double or single), one tag

tap.test("06.01 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt=">zzz'), 'zzz<img alt="" >zzz', "06.01");
  t.end();
});

tap.test("06.02 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt =">zzz'), 'zzz<img alt="" >zzz', "06.02");
  t.end();
});

tap.test("06.03 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt= ">zzz'), 'zzz<img alt="" >zzz', "06.03");
  t.end();
});

tap.test("06.04 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt=" >zzz'), 'zzz<img alt="" >zzz', "06.04");
  t.end();
});

tap.test("06.05 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt   =">zzz'), 'zzz<img alt="" >zzz', "06.05");
  t.end();
});

tap.test("06.06 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt=   ">zzz'), 'zzz<img alt="" >zzz', "06.06");
  t.end();
});

tap.test("06.07 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt="   >zzz'), 'zzz<img alt="" >zzz', "06.07");
  t.end();
});

tap.test("06.08 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt   =   ">zzz'), 'zzz<img alt="" >zzz', "06.08");
  t.end();
});

tap.test("06.09 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt=   "   >zzz'), 'zzz<img alt="" >zzz', "06.09");
  t.end();
});

tap.test("06.10 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt   ="   >zzz'), 'zzz<img alt="" >zzz', "06.10");
  t.end();
});

tap.test("06.11 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt   =   "   >zzz'), 'zzz<img alt="" >zzz', "06.11");
  t.end();
});

tap.test("06.12 - alt with only one double quote, one HTML tag", (t) => {
  t.same(
    alt('<img alt="legit quote: \'" >'),
    '<img alt="legit quote: \'" >',
    "06.12"
  );
  t.end();
});

// GROUP SEVEN.
// -----------------------------------------------------------------------------
// alt attr is present, but with only one quote (double or single), 3 tags

tap.test("07.01 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=">zzz<img alt=">zzz<img alt=">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.01"
  );
  t.end();
});

tap.test("07.02 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt =">zzz<img alt =">zzz<img alt =">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.02"
  );
  t.end();
});

tap.test("07.03 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt= ">zzz<img alt= ">zzz<img alt= ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.03"
  );
  t.end();
});

tap.test("07.04 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=" >zzz<img alt=" >zzz<img alt=" >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.04"
  );
  t.end();
});

tap.test("07.05 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt   =">zzz<img alt   =">zzz<img alt   =">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.05"
  );
  t.end();
});

tap.test("07.06 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=   ">zzz<img alt=   ">zzz<img alt=   ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.06"
  );
  t.end();
});

tap.test("07.07 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt="   >zzz<img alt="   >zzz<img alt="   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.07"
  );
  t.end();
});

tap.test("07.08 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt   =   ">zzz<img alt   =   ">zzz<img alt   =   ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.08"
  );
  t.end();
});

tap.test("07.09 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=   "   >zzz<img alt=   "   >zzz<img alt=   "   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.09"
  );
  t.end();
});

tap.test("07.10 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt   ="   >zzz<img alt   ="   >zzz<img alt   ="   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.10"
  );
  t.end();
});

tap.test("07.11 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt(
      'zzz<img alt   =   "   >zzz<img alt   =   "   >zzz<img alt   =   "   >zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "07.11"
  );
  t.end();
});

tap.test("07.12 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt(
      '<img alt="legit quote: \'" ><img alt="legit quote: \'" ><img alt="legit quote: \'" >'
    ),
    '<img alt="legit quote: \'" ><img alt="legit quote: \'" ><img alt="legit quote: \'" >',
    "07.12"
  );
  t.end();
});

// GROUP EIGHT.
// -----------------------------------------------------------------------------
// alt with only one double quote, one XHTML tag

tap.test("08.01 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt="/>zzz'), 'zzz<img alt="" />zzz', "08.01");
  t.end();
});

tap.test("08.02 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt ="/>zzz'), 'zzz<img alt="" />zzz', "08.02");
  t.end();
});

tap.test("08.03 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt= "/>zzz'), 'zzz<img alt="" />zzz', "08.03");
  t.end();
});

tap.test("08.04 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt=" />zzz'), 'zzz<img alt="" />zzz', "08.04");
  t.end();
});

tap.test("08.05 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt   ="/>zzz'), 'zzz<img alt="" />zzz', "08.05");
  t.end();
});

tap.test("08.06 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt\n="/>zzz'), 'zzz<img alt="" />zzz', "08.06");
  t.end();
});

tap.test("08.07 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt="   />zzz'), 'zzz<img alt="" />zzz', "08.07");
  t.end();
});

tap.test("08.08 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt   ="   />zzz'), 'zzz<img alt="" />zzz', "08.08");
  t.end();
});

tap.test("08.09 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(
    alt('<img alt="legit quote: \'" />'),
    '<img alt="legit quote: \'" />',
    "08.09"
  );
  t.end();
});

// GROUP NINE.
// -----------------------------------------------------------------------------
// alt with only one double quote, three XHTML tags

tap.test("09.01 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt="/>zzz<img alt="   />zzz<img alt="/    >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.01"
  );
  t.end();
});

tap.test("09.02 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt ="/>zzz<img alt ="   />zzz<img alt ="/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.02"
  );
  t.end();
});

tap.test("09.03 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt= "/>zzz<img alt= "   />zzz<img alt= "/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.03"
  );
  t.end();
});

tap.test("09.04 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt=" />zzz<img alt="    />zzz<img alt=" /   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.04"
  );
  t.end();
});

tap.test("09.05 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt   ="/>zzz<img alt   ="    />zzz<img alt   ="/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.05"
  );
  t.end();
});

tap.test("09.06 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt="   />zzz<img alt="     />zzz<img alt="   /   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.06"
  );
  t.end();
});

tap.test("09.07 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt(
      'zzz<img alt   ="   />zzz<img alt   ="     />zzz<img alt   ="   /    >zzz'
    ),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "09.07"
  );
  t.end();
});

tap.test("09.08 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(alt('<img alt="z"/   >'), '<img alt="z" />', "09.08");
  t.end();
});

tap.test("09.09 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt(
      '<img alt="legit quote: \'"/><img alt="legit quote: \'"   /><img alt="legit quote: \'"/   >'
    ),
    '<img alt="legit quote: \'" /><img alt="legit quote: \'" /><img alt="legit quote: \'" />',
    "09.09"
  );
  t.end();
});

// GROUP TEN.
// -----------------------------------------------------------------------------
// alt with only one single quote

tap.test("10.01 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt='>zzz"),
    'zzz<img alt="" >zzz',
    "10.01 - html, one single quote"
  );
  t.end();
});

tap.test("10.02 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt=  '  >zzz"),
    'zzz<img alt="" >zzz',
    "10.02 - html, one single quote"
  );
  t.end();
});

tap.test("10.03 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt   =  '  >zzz"),
    'zzz<img alt="" >zzz',
    "10.03 - html, one single quote"
  );
  t.end();
});

tap.test("10.04 - alt with only one single quote", (t) => {
  t.same(
    alt("zz'z<img alt='>zzz<img alt=\"legit quote: '\" >zz"),
    'zz\'z<img alt="" >zzz<img alt="legit quote: \'" >zz',
    "10.04 - html, one single quote"
  );
  t.end();
});

tap.test("10.05 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt=  ''  >zzz"),
    'zzz<img alt="" >zzz',
    "10.05 - html, two single quotes"
  );
  t.end();
});

tap.test("10.06 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt=  ''>zzz"),
    'zzz<img alt="" >zzz',
    "10.06 - html, two single quotes"
  );
  t.end();
});

tap.test("10.07 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt    ='>zzz"),
    'zzz<img alt="" >zzz',
    "10.07 - html, one single quote"
  );
  t.end();
});

// GROUP ELEVEN.
// -----------------------------------------------------------------------------
// alt with two double quotes, excessive whitespace, HTML

tap.test(
  "11.01 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt=""    >zzz'),
      'zzz<img alt="" >zzz',
      "11.01 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.02 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =""    >zzz'),
      'zzz<img alt="" >zzz',
      "11.02 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.03 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""    >zzz'),
      'zzz<img alt="" >zzz',
      "11.03 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.04 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "">zzz'),
      'zzz<img alt="" >zzz',
      "11.04 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.05 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt="   "    >zzz'),
      'zzz<img alt="" >zzz',
      "11.05 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.06 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    ="   "    >zzz'),
      'zzz<img alt="" >zzz',
      "11.06 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.07 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "    >zzz'),
      'zzz<img alt="" >zzz',
      "11.07 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.08 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   ">zzz'),
      'zzz<img alt="" >zzz',
      "11.08 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.09 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   ">zzz'),
      'zzz<img alt="" >zzz',
      "11.09 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.10 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt=""    >zzz<img     alt=""    >zzz<img     alt=""    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "11.10 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.11 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =""    >zzz<img     alt    =""    >zzz<img     alt    =""    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "11.11 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.12 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =    ""    >zzz<img     alt    =    ""    >zzz<img     alt    =    ""    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "11.12 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.13 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =    "">zzz<img     alt    =    "">zzz<img     alt    =    "">zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "11.13 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.14 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt="   "    >zzz<img     alt="   "    >zzz<img     alt="   "    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "11.14 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.15 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    ="   "    >zzz<img     alt    ="   "    >zzz<img     alt    ="   "    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "11.15 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.16 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =    "   "    >zzz<img     alt    =    "   "    >zzz<img     alt    =    "   "    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "11.16 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.17 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "11.17 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "11.18 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "11.18 - html, excessive white space"
    );
    t.end();
  }
);

// GROUP TWELVE.
// -----------------------------------------------------------------------------
// alt with two double quotes, no space after slash, one XHTML tag

tap.test(
  "12.01 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt=""    />zzz'),
      'zzz<img alt="" />zzz',
      "12.01 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "12.02 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =""    />zzz'),
      'zzz<img alt="" />zzz',
      "12.02 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "12.03 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""    />zzz'),
      'zzz<img alt="" />zzz',
      "12.03 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "12.04 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""/>zzz'),
      'zzz<img alt="" />zzz',
      "12.04 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "12.05 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt="   "    />zzz'),
      'zzz<img alt="" />zzz',
      "12.05 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "12.06 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    ="   "    />zzz'),
      'zzz<img alt="" />zzz',
      "12.06 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "12.07 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "    />zzz'),
      'zzz<img alt="" />zzz',
      "12.07 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "12.08 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/>zzz'),
      'zzz<img alt="" />zzz',
      "12.08 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "12.09 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/>zzz'),
      'zzz<img alt="" />zzz',
      "12.09 - html, excessive white space"
    );
    t.end();
  }
);

// GROUP THIRTEEN.
// -----------------------------------------------------------------------------
// alt with two double quotes, no space after slash, one XHTML tag

tap.test(
  "13.01 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt=""    / >zzz'),
      'zzz<img alt="" />zzz',
      "13.01"
    );
    t.end();
  }
);

tap.test(
  "13.02 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =""    / >zzz'),
      'zzz<img alt="" />zzz',
      "13.02"
    );
    t.end();
  }
);

tap.test(
  "13.03 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""    / >zzz'),
      'zzz<img alt="" />zzz',
      "13.03"
    );
    t.end();
  }
);

tap.test(
  "13.04 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""/ >zzz'),
      'zzz<img alt="" />zzz',
      "13.04"
    );
    t.end();
  }
);

tap.test(
  "13.05 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt="   "    / >zzz'),
      'zzz<img alt="" />zzz',
      "13.05"
    );
    t.end();
  }
);

tap.test(
  "13.06 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    ="   "    / >zzz'),
      'zzz<img alt="" />zzz',
      "13.06"
    );
    t.end();
  }
);

tap.test(
  "13.07 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "    / >zzz'),
      'zzz<img alt="" />zzz',
      "13.07"
    );
    t.end();
  }
);

tap.test(
  "13.08 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/ >zzz'),
      'zzz<img alt="" />zzz',
      "13.08"
    );
    t.end();
  }
);

tap.test(
  "13.09 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/ >zzz'),
      'zzz<img alt="" />zzz',
      "13.09"
    );
    t.end();
  }
);

// GROUP FOURTEEN.
// -----------------------------------------------------------------------------
// alt with two double quotes, many spaces between slash & bracket, XHTML
// same but with many spaces between slash and closing bracket:

tap.test(
  "14.01 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt=""    /    >zzz'),
      'zzz<img alt="" />zzz',
      "14.01"
    );
    t.end();
  }
);

tap.test(
  "14.02 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =""    /    >zzz'),
      'zzz<img alt="" />zzz',
      "14.02"
    );
    t.end();
  }
);

tap.test(
  "14.03 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""    /    >zzz'),
      'zzz<img alt="" />zzz',
      "14.03"
    );
    t.end();
  }
);

tap.test(
  "14.04 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""/    >zzz'),
      'zzz<img alt="" />zzz',
      "14.04"
    );
    t.end();
  }
);

tap.test(
  "14.05 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt="   "    /    >zzz'),
      'zzz<img alt="" />zzz',
      "14.05"
    );
    t.end();
  }
);

tap.test(
  "14.06 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    ="   "    /    >zzz'),
      'zzz<img alt="" />zzz',
      "14.06"
    );
    t.end();
  }
);

tap.test(
  "14.07 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "    /    >zzz'),
      'zzz<img alt="" />zzz',
      "14.07"
    );
    t.end();
  }
);

tap.test(
  "14.08 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/    >zzz'),
      'zzz<img alt="" />zzz',
      "14.08"
    );
    t.end();
  }
);

tap.test(
  "14.09 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/    >zzz'),
      'zzz<img alt="" />zzz',
      "14.09"
    );
    t.end();
  }
);

// GROUP FIFTEEN.
// -----------------------------------------------------------------------------
// alt with two single quotes, HTML

tap.test("15.01 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt=''    >zzz"), 'zzz<img alt="" >zzz', "15.01");
  t.end();
});

tap.test("15.02 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt    =''    >zzz"), 'zzz<img alt="" >zzz', "15.02");
  t.end();
});

tap.test("15.03 - alt with two single quotes, HTML", (t) => {
  t.same(
    alt("zzz<img     alt    =    ''    >zzz"),
    'zzz<img alt="" >zzz',
    "15.03"
  );
  t.end();
});

tap.test("15.04 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt    =    ''>zzz"), 'zzz<img alt="" >zzz', "15.04");
  t.end();
});

tap.test("15.05 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt='   '    >zzz"), 'zzz<img alt="" >zzz', "15.05");
  t.end();
});

tap.test("15.06 - alt with two single quotes, HTML", (t) => {
  t.same(
    alt("zzz<img     alt    ='   '    >zzz"),
    'zzz<img alt="" >zzz',
    "15.06"
  );
  t.end();
});

tap.test("15.07 - alt with two single quotes, HTML", (t) => {
  t.same(
    alt("zzz<img     alt    =    '   '    >zzz"),
    'zzz<img alt="" >zzz',
    "15.07"
  );
  t.end();
});

tap.test("15.08 - alt with two single quotes, HTML", (t) => {
  t.same(
    alt("zzz<img     alt    =    '   '>zzz"),
    'zzz<img alt="" >zzz',
    "15.08"
  );
  t.end();
});

// GROUP SIXTEEN.
// -----------------------------------------------------------------------------
// weird code cases, all broken (X)HTML

tap.test(
  "16.01 - testing escape latch for missing second double quote cases",
  (t) => {
    // it kicks in when encounters equals sign after the first double quote
    // until we add function to recognise the attributes within IMG tags,
    // escape latch will kick in and prevent all action when second double quote is missing
    t.same(
      alt('zzz<img alt="  class="" />zzz'),
      'zzz<img alt="  class="" />zzz',
      "16.01"
    );
    t.end();
  }
);

tap.test("16.02 - testing seriously messed up code", (t) => {
  // it kicks in when encounters equals sign after the first double quote
  // until we add function to recognise the attributes within IMG tags,
  // escape latch will kick in and prevent all action when second double quote is missing
  t.same(
    alt("zzz<img >>>>>>>>>>zzz"),
    'zzz<img alt="" >>>>>>>>>>zzz',
    "16.02.01"
  );
  t.same(alt("zzz<<img >>zzz"), 'zzz<<img alt="" >>zzz', "16.02.02");
  t.same(
    alt("zzz<><><<>><<<>>>><img >>zzz"),
    'zzz<><><<>><<<>>>><img alt="" >>zzz',
    "16.02.03"
  );
  t.end();
});

tap.test("16.03 - other attributes don't have equal and value", (t) => {
  t.same(
    alt('<img something alt="" >'),
    '<img something alt="" >',
    "16.03.01 - img tag only, with alt"
  );
  t.same(
    alt("<img something>"),
    '<img something alt="" >',
    "16.03.02 - img tag only, no alt"
  );
  t.same(
    alt("<img something >"),
    '<img something alt="" >',
    "16.03.03 - img tag only, no alt"
  );
  // XHTML counterparts:
  t.same(
    alt('<img something alt="" />'),
    '<img something alt="" />',
    "16.03.04 - img tag only, with alt"
  );
  t.same(
    alt("<img something/>"),
    '<img something alt="" />',
    "16.03.05 - img tag only, no alt, tight"
  );
  t.same(
    alt("<img something />"),
    '<img something alt="" />',
    "16.03.06 - img tag only, no alt"
  );
  t.same(
    alt('<img something alt="" /     >'),
    '<img something alt="" />',
    "16.03.07 - img tag only, with alt, excessive white space"
  );
  t.same(
    alt("<img something/     >"),
    '<img something alt="" />',
    "16.03.08 - img tag only, no alt, excessive white space"
  );
  t.same(
    alt("<img something /     >"),
    '<img something alt="" />',
    "16.03.09 - img tag only, no alt, excessive white space"
  );
  t.end();
});

tap.test(
  "16.04 - specific place in the algorithm, protection against rogue slashes",
  (t) => {
    t.same(
      alt('<img alt="/ class="" />'),
      '<img alt="/ class="" />',
      "16.04 - should do nothing."
    );
    t.end();
  }
);

// GROUP SEVENTEEN.
// -----------------------------------------------------------------------------
// throws

tap.test("17.01 - throws if encounters img tag within img tag", (t) => {
  t.throws(() => {
    alt('zzz<img alt="  <img />zzz');
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("17.02 - throws if input is not string", (t) => {
  t.throws(() => {
    alt(null);
  }, /THROW_ID_01/g);
  t.throws(() => {
    alt();
  }, /THROW_ID_01/g);
  t.throws(() => {
    alt(undefined);
  }, /THROW_ID_01/g);
  t.throws(() => {
    alt(111);
  }, /THROW_ID_01/g);
  t.throws(() => {
    alt(true);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("17.03 - throws if opts is not a plain object", (t) => {
  t.throws(() => {
    alt("zzz", ["aaa"]);
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    alt("zzz", null); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  });
  t.doesNotThrow(() => {
    alt("zzz", undefined); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  });
  t.throws(() => {
    alt("zzz", 1);
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    alt("zzz", {});
  });
  t.throws(() => {
    alt("zzz", { zzz: "yyy" }); // rogue keys - throws. WTF?
  }, /THROW_ID_03/g);
  t.end();
});

// GROUP EIGHTEEM.
// -----------------------------------------------------------------------------
// opts.unfancyTheAltContents

tap.test("18.01 - cleans alt tag contents - fancy quote", (t) => {
  t.same(
    alt('<img alt    ="   someone’s " >'),
    '<img alt="someone\'s" >',
    "18.01.01 - default"
  );
  t.same(
    alt('<img alt    ="   someone’s " >', { unfancyTheAltContents: true }),
    '<img alt="someone\'s" >',
    "18.01.02 - hardcoded default, unfancyTheAltContents on"
  );
  t.same(
    alt('<img alt    ="   someone’s " >', { unfancyTheAltContents: false }),
    '<img alt="   someone’s " >',
    "18.01.03 - unfancyTheAltContents off - no character substitution, no trim"
  );
  t.end();
});

tap.test("18.02 - cleans alt tag contents - m-dash + trim", (t) => {
  t.same(
    alt('<img alt    =" The new offer \u2014 50% discount " >'),
    '<img alt="The new offer - 50% discount" >',
    "18.02.01 - default"
  );
  t.same(
    alt('<img alt    =" The new offer \u2014 50% discount " >'),
    '<img alt="The new offer - 50% discount" >',
    "18.02.02 - hardcoded default, unfancyTheAltContents on"
  );
  t.same(
    alt('<img alt    =" The new offer \u2014 50% discount " >', {
      unfancyTheAltContents: false,
    }),
    '<img alt=" The new offer \u2014 50% discount " >',
    "18.02.03 - unfancyTheAltContents off - no character substitution, no trimming done"
  );
  t.end();
});

tap.test("18.03 - un-fancies multiple alt tags", (t) => {
  t.same(
    alt(
      'abc <img alt    ="   someone’s " > def\n <img alt    =" The new offer \u2014 50% discount " > ghi <img      >\n\n\njkl'
    ),
    'abc <img alt="someone\'s" > def\n <img alt="The new offer - 50% discount" > ghi <img alt="" >\n\n\njkl',
    "18.03.01 - default"
  );
  t.end();
});

tap.test("18.04 - adds an ALT within a nunjucks-sprinkled HTML", (t) => {
  t.same(
    alt(
      '<img {% if m.n_o %}class="x-y"{% else %}id="a db-c d" style="display: block;"{% endif %}></td>'
    ),
    '<img {% if m.n_o %}class="x-y"{% else %}id="a db-c d" style="display: block;"{% endif %} alt="" ></td>',
    "18.04.01 - minime of 18.04.02"
  );
  t.same(
    alt(
      '<td class="anything-here" background="{%- include "partials/zzz.nunjucks" -%}" bgcolor="{{ color }}" height="{{ something_here }}" valign="top" style="background-image: url({%- include "partials/partials-location.nunjucks" -%}); background-position: top center; background-repeat: no-repeat; font-size: 0; line-height: 0;" align="center"><img {% if something.is_right %}class="right-class"{% else %}id="alternative dont-know-why-i-put-id here" style="display: block;"{% endif %}></td>'
    ),
    '<td class="anything-here" background="{%- include "partials/zzz.nunjucks" -%}" bgcolor="{{ color }}" height="{{ something_here }}" valign="top" style="background-image: url({%- include "partials/partials-location.nunjucks" -%}); background-position: top center; background-repeat: no-repeat; font-size: 0; line-height: 0;" align="center"><img {% if something.is_right %}class="right-class"{% else %}id="alternative dont-know-why-i-put-id here" style="display: block;"{% endif %} alt="" ></td>',
    "18.04.02"
  );
  t.end();
});

tap.test(
  '18.05 - Nunjucks code following straight after character g of "img"',
  (t) => {
    t.same(
      alt(
        '<img{% if not state_colour_col %} class="test"{% endif %} style="display: block;">'
      ),
      '<img{% if not state_colour_col %} class="test"{% endif %} style="display: block;" alt="" >',
      "18.05"
    );
    t.end();
  }
);

tap.test("18.06 - Nunjucks code tight before ALT", (t) => {
  t.same(
    alt('<img {% if variables %}class="variables" {% endif %}alt=>'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "18.06.01 - alt with equal with no quotes"
  );
  t.same(
    alt('<img {% if variables %}class="variables" {% endif %}alt=">'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "18.06.02 - alt with equal and single quote, second is missing"
  );
  t.same(
    alt('<img {% if variables %}class="variables" {% endif %}alt>'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "18.06.03 - alt with both equal and quotes missing"
  );
  t.end();
});

import tap from "tap";
import alt from "../dist/html-img-alt.esm";

// GROUP ZEROZERO.
// -----------------------------------------------------------------------------
// no alt attr is missing, only whitespace control

tap.test("01 - nothing is missing", (t) => {
  t.same(
    alt('zzz<img        alt="123" >zzz'),
    'zzz<img alt="123" >zzz',
    "01 - one HTML tag, only excessive whitespace"
  );
  t.end();
});

tap.test("02 - nothing is missing", (t) => {
  t.same(
    alt('<img   alt="123"    >'),
    '<img alt="123" >',
    "02 - whitespace on both sides, one tag"
  );
  t.end();
});

tap.test("03 - nothing is missing", (t) => {
  t.same(
    alt('xxx<img        alt="123" >yyy<img   alt="123"    >zzz'),
    'xxx<img alt="123" >yyy<img alt="123" >zzz',
    "03 - multiple HTML tags, only excessive whitespace"
  );
  t.end();
});

tap.test("04 - nothing is missing", (t) => {
  t.same(
    alt('zzz<img        alt="123" />zzz'),
    'zzz<img alt="123" />zzz',
    "04 - one XHTML tag, only excessive whitespace"
  );
  t.end();
});

tap.test("05 - nothing is missing", (t) => {
  t.same(
    alt('xxx<img        alt="123" />yyy<img   alt="123"    />zzz'),
    'xxx<img alt="123" />yyy<img alt="123" />zzz',
    "05 - multiple XHTML tags, only excessive whitespace"
  );
  t.end();
});

tap.test("06 - nothing is missing", (t) => {
  t.same(
    alt("aaaa        bbbbb"),
    "aaaa        bbbbb",
    "06 - excessive whitespace, no tags at all"
  );
  t.end();
});

tap.test("07 - nothing is missing", (t) => {
  t.same(
    alt("aaaa alt bbbbb"),
    "aaaa alt bbbbb",
    "07 - suspicious alt within copy but not IMG tag"
  );
  t.end();
});

tap.test("08 - nothing is missing", (t) => {
  t.same(
    alt("aaaa alt= bbbbb"),
    "aaaa alt= bbbbb",
    "08 - suspicious alt= within copy but not IMG tag"
  );
  t.end();
});

tap.test("09 - nothing is missing", (t) => {
  t.same(
    alt("aaaa alt = bbbbb"),
    "aaaa alt = bbbbb",
    "09 - suspicious alt= within copy but not IMG tag"
  );
  t.end();
});

tap.test("10 - nothing is missing", (t) => {
  t.same(
    alt('<img alt="1   23" >'),
    '<img alt="1   23" >',
    "10 - does nothing"
  );
  t.end();
});

tap.test("11 - nothing is missing", (t) => {
  t.same(
    alt('<img    class="zzz"   alt="123"    >'),
    '<img class="zzz" alt="123" >',
    "11 - whitespace on both sides, one tag"
  );
  t.end();
});

tap.test("12 - nothing is missing", (t) => {
  t.same(
    alt('zzz<img        alt="123"    /  >yyy'),
    'zzz<img alt="123" />yyy',
    "12"
  );
  t.end();
});

tap.test("13 - nothing is missing", (t) => {
  t.same(
    alt('z/zz<img        alt="/123/"    /  >y/yy'),
    'z/zz<img alt="/123/" />y/yy',
    "13"
  );
  t.end();
});

tap.test("14 - nothing is missing", (t) => {
  t.same(
    alt('zzz<img     alt    =     ""    /     >zzz'),
    'zzz<img alt="" />zzz',
    "14"
  );
  t.end();
});

tap.test("15 - nothing is missing", (t) => {
  t.same(
    alt('zzz<img        alt="123"   class="test" >zzz'),
    'zzz<img alt="123" class="test" >zzz',
    "15"
  );
  t.end();
});

// GROUP ONE.
// -----------------------------------------------------------------------------
// alt attr is missing

tap.test("16 - missing alt", (t) => {
  t.same(alt("zzz<img>zzz"), 'zzz<img alt="" >zzz', "16 - html - tight");
  t.end();
});

tap.test("17 - missing alt", (t) => {
  t.same(
    alt("zzz<img >zzz"),
    'zzz<img alt="" >zzz',
    "17 - html - trailing space"
  );
  t.end();
});

tap.test("18 - missing alt", (t) => {
  t.same(
    alt("zzz<img      >zzz"),
    'zzz<img alt="" >zzz',
    "18 - html - excessive trailing space"
  );
  t.end();
});

tap.test("19 - missing alt", (t) => {
  t.same(alt("zzz<img/>zzz"), 'zzz<img alt="" />zzz', "19 - xhtml - tight");
  t.end();
});

tap.test("20 - missing alt", (t) => {
  t.same(
    alt("zzz<img />zzz"),
    'zzz<img alt="" />zzz',
    "20 - xhtml - one space before slash"
  );
  t.end();
});

tap.test("21 - missing alt", (t) => {
  t.same(
    alt("zzz<img           />zzz"),
    'zzz<img alt="" />zzz',
    "21 - xhtml - many spaces before slash"
  );
  t.end();
});

tap.test("22 - missing alt", (t) => {
  t.same(
    alt("zzz<img           /    >zzz"),
    'zzz<img alt="" />zzz',
    "22 - xhtml - many spaces on both sides"
  );
  t.end();
});

// GROUP TWO.
// -----------------------------------------------------------------------------
// adds ALT

tap.test("23 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt('z<img         a="zz"        >z'),
    'z<img a="zz" alt="" >z',
    "23 - html simples"
  );
  t.end();
});

tap.test("24 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt('z<img         a="zz"        />z'),
    'z<img a="zz" alt="" />z',
    "24 - xhtml simples"
  );
  t.end();
});

tap.test("25 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt('z<img         a="zz"        /     >z'),
    'z<img a="zz" alt="" />z',
    "25 - xhtml simples"
  );
  t.end();
});

tap.test("26 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt('z<img         a="zz"/     >z'),
    'z<img a="zz" alt="" />z',
    "26 - xhtml simples"
  );
  t.end();
});

tap.test("27 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt(
      'zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       >zzz'
    ),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" >zzz',
    "27 - html advanced"
  );
  t.end();
});

tap.test("28 - normalising all attributes on IMG, adding ALT", (t) => {
  t.same(
    alt(
      'zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       />zzz'
    ),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" />zzz',
    "28 - xhtml advanced"
  );
  t.end();
});

// GROUP THREE.
// -----------------------------------------------------------------------------
// missing ALT, other attributes present

tap.test(
  "29 - alt attribute is missing, there are other attributes too - HTML - #1",
  (t) => {
    // HTML
    t.same(alt('zzz<img class="">zzz'), 'zzz<img class="" alt="" >zzz', "29");
    t.end();
  }
);

tap.test(
  "30 - alt attribute is missing, there are other attributes too - HTML - #2",
  (t) => {
    t.same(
      alt('zzz<img    class="">zzz'),
      'zzz<img class="" alt="" >zzz',
      "30"
    );
    t.end();
  }
);

tap.test(
  "31 - alt attribute is missing, there are other attributes too - HTML - #3",
  (t) => {
    t.same(
      alt('zzz<img class=""    >zzz<img class=""    >zzz<img class=""    >zzz'),
      'zzz<img class="" alt="" >zzz<img class="" alt="" >zzz<img class="" alt="" >zzz',
      "31"
    );
    t.end();
  }
);

tap.test(
  "32 - alt attribute is missing, there are other attributes too - XHTML - #1",
  (t) => {
    // XHTML
    t.same(alt('zzz<img class=""/>zzz'), 'zzz<img class="" alt="" />zzz', "32");
    t.end();
  }
);

tap.test(
  "33 - alt attribute is missing, there are other attributes too - XHTML - #1",
  (t) => {
    t.same(
      alt('zzz<img    class=""/>zzz'),
      'zzz<img class="" alt="" />zzz',
      "33"
    );
    t.end();
  }
);

tap.test(
  "34 - alt attribute is missing, there are other attributes too - XHTML - #2",
  (t) => {
    t.same(
      alt('zzz<img class=""    />zzz'),
      'zzz<img class="" alt="" />zzz',
      "34"
    );
    t.end();
  }
);

tap.test(
  "35 - alt attribute is missing, there are other attributes too - XHTML - #3",
  (t) => {
    t.same(
      alt('zzz<img    class=""   />zzz'),
      'zzz<img class="" alt="" />zzz',
      "35"
    );
    t.end();
  }
);

tap.test(
  "36 - alt attribute is missing, there are other attributes too - XHTML - #4",
  (t) => {
    t.same(
      alt(
        'zzz<img class=""       />zzz<img class=""       />zzz<img class=""       />zzz'
      ),
      'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
      "36"
    );
    t.end();
  }
);

tap.test(
  "37 - alt attribute is missing, there are other attributes too - XHTML - #5",
  (t) => {
    t.same(
      alt('zzz<img class=""/   >zzz'),
      'zzz<img class="" alt="" />zzz',
      "37"
    );
    t.end();
  }
);

tap.test(
  "38 - alt attribute is missing, there are other attributes too - XHTML - #6",
  (t) => {
    t.same(
      alt('zzz<img    class=""/   >zzz'),
      'zzz<img class="" alt="" />zzz',
      "38"
    );
    t.end();
  }
);

tap.test(
  "39 - alt attribute is missing, there are other attributes too - XHTML - #7",
  (t) => {
    t.same(
      alt(
        'zzz<img class=""    /   >zzz<img class=""    /   >zzz<img class=""    /   >zzz'
      ),
      'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
      "39"
    );
    t.end();
  }
);

// GROUP FOUR.
// -----------------------------------------------------------------------------
// alt attr is present, but without equal and double quotes.

tap.test("40 - alt without equal", (t) => {
  t.same(alt("zzz<img alt>zzz"), 'zzz<img alt="" >zzz', "40 - html - tight");
  t.end();
});

tap.test("41 - alt without equal", (t) => {
  t.same(
    alt("zzz<img    alt>zzz"),
    'zzz<img alt="" >zzz',
    "41 - html - excessive white space"
  );
  t.end();
});

tap.test("42 - alt without equal", (t) => {
  t.same(
    alt("zzz<img alt >zzz"),
    'zzz<img alt="" >zzz',
    "42 - html - one trailing space"
  );
  t.end();
});

tap.test("43 - alt without equal", (t) => {
  t.same(
    alt("zzz<img      alt      >zzz"),
    'zzz<img alt="" >zzz',
    "43 - html - excessive white space on both sides"
  );
  t.end();
});

tap.test("44 - alt without equal", (t) => {
  t.same(alt("zzz<img alt/>zzz"), 'zzz<img alt="" />zzz', "44 - xhtml - tight");
  t.end();
});

tap.test("45 - alt without equal", (t) => {
  t.same(
    alt("zzz<img alt />zzz"),
    'zzz<img alt="" />zzz',
    "45 - xhtml - single space on both sides"
  );
  t.end();
});

tap.test("46 - alt without equal", (t) => {
  t.same(
    alt("zzz<img      alt   />zzz"),
    'zzz<img alt="" />zzz',
    "46 - xhtml - excessive white space on both sides"
  );
  t.end();
});

tap.test("47 - alt without equal", (t) => {
  t.same(
    alt("zzz<img      alt   /   >zzz"),
    'zzz<img alt="" />zzz',
    "47 - xhtml - excessive white space everywhere"
  );
  t.end();
});

// GROUP FIVE.
// -----------------------------------------------------------------------------
// alt attr is present, but with only equal character

tap.test("48 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=>zzz"),
    'zzz<img alt="" >zzz',
    "48 - html, no space after"
  );
  t.end();
});

tap.test("49 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=>zzz<img alt=>zzz"),
    'zzz<img alt="" >zzz<img alt="" >zzz',
    "49 - html, two imag tags, no space after each"
  );
  t.end();
});

tap.test("50 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt= >zzz"),
    'zzz<img alt="" >zzz',
    "50 - html, space after"
  );
  t.end();
});

tap.test("51 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img    alt=>zzz"),
    'zzz<img alt="" >zzz',
    "51 - html, excessive space in front"
  );
  t.end();
});

tap.test("52 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=    >zzz"),
    'zzz<img alt="" >zzz',
    "52 - html, excessive space after"
  );
  t.end();
});

tap.test("53 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=/>zzz"),
    'zzz<img alt="" />zzz',
    "53 - xhtml, no space after"
  );
  t.end();
});

tap.test("54 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=/   >zzz"),
    'zzz<img alt="" />zzz',
    "54 - xhtml, no space after"
  );
  t.end();
});

tap.test("55 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt= />zzz"),
    'zzz<img alt="" />zzz',
    "55 - xhtml, space after"
  );
  t.end();
});

tap.test("56 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img    alt=/>zzz"),
    'zzz<img alt="" />zzz',
    "56 - xhtml, excessive space before"
  );
  t.end();
});

tap.test("57 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt=    />zzz"),
    'zzz<img alt="" />zzz',
    "57 - xhtml, excessive space after"
  );
  t.end();
});

tap.test("58 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img     alt=    />zzz"),
    'zzz<img alt="" />zzz',
    "58 - xhtml, excessive space on both sides of alt="
  );
  t.end();
});

tap.test("59 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img     alt   =    />zzz"),
    'zzz<img alt="" />zzz',
    "59 - xhtml, excessive space on both sides of equal, no quotes"
  );
  t.end();
});

tap.test("60 - alt with just equal", (t) => {
  t.same(
    alt("zzz<img alt    =>zzz"),
    'zzz<img alt="" >zzz',
    "60 - html, no space after"
  );
  t.end();
});

tap.test("61 - alt with just equal", (t) => {
  t.same(
    alt('zzz<img alt    =   "">zzz'),
    'zzz<img alt="" >zzz',
    "61 - html, no space after"
  );
  t.end();
});

// GROUP SIX.
// -----------------------------------------------------------------------------
// alt attr is present, but with only one quote (double or single), one tag

tap.test("62 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt=">zzz'), 'zzz<img alt="" >zzz', "62");
  t.end();
});

tap.test("63 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt =">zzz'), 'zzz<img alt="" >zzz', "63");
  t.end();
});

tap.test("64 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt= ">zzz'), 'zzz<img alt="" >zzz', "64");
  t.end();
});

tap.test("65 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt=" >zzz'), 'zzz<img alt="" >zzz', "65");
  t.end();
});

tap.test("66 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt   =">zzz'), 'zzz<img alt="" >zzz', "66");
  t.end();
});

tap.test("67 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt=   ">zzz'), 'zzz<img alt="" >zzz', "67");
  t.end();
});

tap.test("68 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt="   >zzz'), 'zzz<img alt="" >zzz', "68");
  t.end();
});

tap.test("69 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt   =   ">zzz'), 'zzz<img alt="" >zzz', "69");
  t.end();
});

tap.test("70 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt=   "   >zzz'), 'zzz<img alt="" >zzz', "70");
  t.end();
});

tap.test("71 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt   ="   >zzz'), 'zzz<img alt="" >zzz', "71");
  t.end();
});

tap.test("72 - alt with only one double quote, one HTML tag", (t) => {
  t.same(alt('zzz<img alt   =   "   >zzz'), 'zzz<img alt="" >zzz', "72");
  t.end();
});

tap.test("73 - alt with only one double quote, one HTML tag", (t) => {
  t.same(
    alt('<img alt="legit quote: \'" >'),
    '<img alt="legit quote: \'" >',
    "73"
  );
  t.end();
});

// GROUP SEVEN.
// -----------------------------------------------------------------------------
// alt attr is present, but with only one quote (double or single), 3 tags

tap.test("74 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=">zzz<img alt=">zzz<img alt=">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "74"
  );
  t.end();
});

tap.test("75 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt =">zzz<img alt =">zzz<img alt =">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "75"
  );
  t.end();
});

tap.test("76 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt= ">zzz<img alt= ">zzz<img alt= ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "76"
  );
  t.end();
});

tap.test("77 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=" >zzz<img alt=" >zzz<img alt=" >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "77"
  );
  t.end();
});

tap.test("78 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt   =">zzz<img alt   =">zzz<img alt   =">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "78"
  );
  t.end();
});

tap.test("79 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=   ">zzz<img alt=   ">zzz<img alt=   ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "79"
  );
  t.end();
});

tap.test("80 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt="   >zzz<img alt="   >zzz<img alt="   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "80"
  );
  t.end();
});

tap.test("81 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt   =   ">zzz<img alt   =   ">zzz<img alt   =   ">zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "81"
  );
  t.end();
});

tap.test("82 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt=   "   >zzz<img alt=   "   >zzz<img alt=   "   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "82"
  );
  t.end();
});

tap.test("83 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt('zzz<img alt   ="   >zzz<img alt   ="   >zzz<img alt   ="   >zzz'),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "83"
  );
  t.end();
});

tap.test("84 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt(
      'zzz<img alt   =   "   >zzz<img alt   =   "   >zzz<img alt   =   "   >zzz'
    ),
    'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    "84"
  );
  t.end();
});

tap.test("85 - alt with only one double quote, three HTML tags", (t) => {
  t.same(
    alt(
      '<img alt="legit quote: \'" ><img alt="legit quote: \'" ><img alt="legit quote: \'" >'
    ),
    '<img alt="legit quote: \'" ><img alt="legit quote: \'" ><img alt="legit quote: \'" >',
    "85"
  );
  t.end();
});

// GROUP EIGHT.
// -----------------------------------------------------------------------------
// alt with only one double quote, one XHTML tag

tap.test("86 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt="/>zzz'), 'zzz<img alt="" />zzz', "86");
  t.end();
});

tap.test("87 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt ="/>zzz'), 'zzz<img alt="" />zzz', "87");
  t.end();
});

tap.test("88 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt= "/>zzz'), 'zzz<img alt="" />zzz', "88");
  t.end();
});

tap.test("89 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt=" />zzz'), 'zzz<img alt="" />zzz', "89");
  t.end();
});

tap.test("90 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt   ="/>zzz'), 'zzz<img alt="" />zzz', "90");
  t.end();
});

tap.test("91 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt\n="/>zzz'), 'zzz<img alt="" />zzz', "91");
  t.end();
});

tap.test("92 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt="   />zzz'), 'zzz<img alt="" />zzz', "92");
  t.end();
});

tap.test("93 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(alt('zzz<img alt   ="   />zzz'), 'zzz<img alt="" />zzz', "93");
  t.end();
});

tap.test("94 - alt with only one double quote, one XHTML tag", (t) => {
  t.same(
    alt('<img alt="legit quote: \'" />'),
    '<img alt="legit quote: \'" />',
    "94"
  );
  t.end();
});

// GROUP NINE.
// -----------------------------------------------------------------------------
// alt with only one double quote, three XHTML tags

tap.test("95 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt="/>zzz<img alt="   />zzz<img alt="/    >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "95"
  );
  t.end();
});

tap.test("96 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt ="/>zzz<img alt ="   />zzz<img alt ="/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "96"
  );
  t.end();
});

tap.test("97 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt= "/>zzz<img alt= "   />zzz<img alt= "/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "97"
  );
  t.end();
});

tap.test("98 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt=" />zzz<img alt="    />zzz<img alt=" /   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "98"
  );
  t.end();
});

tap.test("99 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt   ="/>zzz<img alt   ="    />zzz<img alt   ="/   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "99"
  );
  t.end();
});

tap.test("100 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt('zzz<img alt="   />zzz<img alt="     />zzz<img alt="   /   >zzz'),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "100"
  );
  t.end();
});

tap.test("101 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt(
      'zzz<img alt   ="   />zzz<img alt   ="     />zzz<img alt   ="   /    >zzz'
    ),
    'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
    "101"
  );
  t.end();
});

tap.test("102 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(alt('<img alt="z"/   >'), '<img alt="z" />', "102");
  t.end();
});

tap.test("103 - alt with only one double quote, three XHTML tags", (t) => {
  t.same(
    alt(
      '<img alt="legit quote: \'"/><img alt="legit quote: \'"   /><img alt="legit quote: \'"/   >'
    ),
    '<img alt="legit quote: \'" /><img alt="legit quote: \'" /><img alt="legit quote: \'" />',
    "103"
  );
  t.end();
});

// GROUP TEN.
// -----------------------------------------------------------------------------
// alt with only one single quote

tap.test("104 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt='>zzz"),
    'zzz<img alt="" >zzz',
    "104 - html, one single quote"
  );
  t.end();
});

tap.test("105 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt=  '  >zzz"),
    'zzz<img alt="" >zzz',
    "105 - html, one single quote"
  );
  t.end();
});

tap.test("106 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt   =  '  >zzz"),
    'zzz<img alt="" >zzz',
    "106 - html, one single quote"
  );
  t.end();
});

tap.test("107 - alt with only one single quote", (t) => {
  t.same(
    alt("zz'z<img alt='>zzz<img alt=\"legit quote: '\" >zz"),
    'zz\'z<img alt="" >zzz<img alt="legit quote: \'" >zz',
    "107 - html, one single quote"
  );
  t.end();
});

tap.test("108 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt=  ''  >zzz"),
    'zzz<img alt="" >zzz',
    "108 - html, two single quotes"
  );
  t.end();
});

tap.test("109 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt=  ''>zzz"),
    'zzz<img alt="" >zzz',
    "109 - html, two single quotes"
  );
  t.end();
});

tap.test("110 - alt with only one single quote", (t) => {
  t.same(
    alt("zzz<img alt    ='>zzz"),
    'zzz<img alt="" >zzz',
    "110 - html, one single quote"
  );
  t.end();
});

// GROUP ELEVEN.
// -----------------------------------------------------------------------------
// alt with two double quotes, excessive whitespace, HTML

tap.test(
  "111 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt=""    >zzz'),
      'zzz<img alt="" >zzz',
      "111 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "112 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =""    >zzz'),
      'zzz<img alt="" >zzz',
      "112 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "113 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""    >zzz'),
      'zzz<img alt="" >zzz',
      "113 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "114 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "">zzz'),
      'zzz<img alt="" >zzz',
      "114 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "115 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt="   "    >zzz'),
      'zzz<img alt="" >zzz',
      "115 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "116 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    ="   "    >zzz'),
      'zzz<img alt="" >zzz',
      "116 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "117 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "    >zzz'),
      'zzz<img alt="" >zzz',
      "117 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "118 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   ">zzz'),
      'zzz<img alt="" >zzz',
      "118 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "119 - alt with two double quotes, excessive whitespace, HTML, 1 img tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   ">zzz'),
      'zzz<img alt="" >zzz',
      "119 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "120 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt=""    >zzz<img     alt=""    >zzz<img     alt=""    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "120 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "121 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =""    >zzz<img     alt    =""    >zzz<img     alt    =""    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "121 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "122 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =    ""    >zzz<img     alt    =    ""    >zzz<img     alt    =    ""    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "122 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "123 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =    "">zzz<img     alt    =    "">zzz<img     alt    =    "">zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "123 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "124 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt="   "    >zzz<img     alt="   "    >zzz<img     alt="   "    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "124 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "125 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    ="   "    >zzz<img     alt    ="   "    >zzz<img     alt    ="   "    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "125 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "126 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =    "   "    >zzz<img     alt    =    "   "    >zzz<img     alt    =    "   "    >zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "126 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "127 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "127 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "128 - alt with two double quotes, excessive whitespace, HTML, 3 img tags",
  (t) => {
    t.same(
      alt(
        'zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz'
      ),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      "128 - html, excessive white space"
    );
    t.end();
  }
);

// GROUP TWELVE.
// -----------------------------------------------------------------------------
// alt with two double quotes, no space after slash, one XHTML tag

tap.test(
  "129 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt=""    />zzz'),
      'zzz<img alt="" />zzz',
      "129 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "130 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =""    />zzz'),
      'zzz<img alt="" />zzz',
      "130 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "131 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""    />zzz'),
      'zzz<img alt="" />zzz',
      "131 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "132 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""/>zzz'),
      'zzz<img alt="" />zzz',
      "132 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "133 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt="   "    />zzz'),
      'zzz<img alt="" />zzz',
      "133 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "134 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    ="   "    />zzz'),
      'zzz<img alt="" />zzz',
      "134 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "135 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "    />zzz'),
      'zzz<img alt="" />zzz',
      "135 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "136 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/>zzz'),
      'zzz<img alt="" />zzz',
      "136 - html, excessive white space"
    );
    t.end();
  }
);

tap.test(
  "137 - alt with two double quotes, no space after slash, one XHTML tag",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/>zzz'),
      'zzz<img alt="" />zzz',
      "137 - html, excessive white space"
    );
    t.end();
  }
);

// GROUP THIRTEEN.
// -----------------------------------------------------------------------------
// alt with two double quotes, no space after slash, one XHTML tag

tap.test(
  "138 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(alt('zzz<img     alt=""    / >zzz'), 'zzz<img alt="" />zzz', "138");
    t.end();
  }
);

tap.test(
  "139 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =""    / >zzz'),
      'zzz<img alt="" />zzz',
      "139"
    );
    t.end();
  }
);

tap.test(
  "140 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""    / >zzz'),
      'zzz<img alt="" />zzz',
      "140"
    );
    t.end();
  }
);

tap.test(
  "141 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""/ >zzz'),
      'zzz<img alt="" />zzz',
      "141"
    );
    t.end();
  }
);

tap.test(
  "142 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt="   "    / >zzz'),
      'zzz<img alt="" />zzz',
      "142"
    );
    t.end();
  }
);

tap.test(
  "143 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    ="   "    / >zzz'),
      'zzz<img alt="" />zzz',
      "143"
    );
    t.end();
  }
);

tap.test(
  "144 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "    / >zzz'),
      'zzz<img alt="" />zzz',
      "144"
    );
    t.end();
  }
);

tap.test(
  "145 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/ >zzz'),
      'zzz<img alt="" />zzz',
      "145"
    );
    t.end();
  }
);

tap.test(
  "146 - alt with two double quotes, one space between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/ >zzz'),
      'zzz<img alt="" />zzz',
      "146"
    );
    t.end();
  }
);

// GROUP FOURTEEN.
// -----------------------------------------------------------------------------
// alt with two double quotes, many spaces between slash & bracket, XHTML
// same but with many spaces between slash and closing bracket:

tap.test(
  "147 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt=""    /    >zzz'),
      'zzz<img alt="" />zzz',
      "147"
    );
    t.end();
  }
);

tap.test(
  "148 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =""    /    >zzz'),
      'zzz<img alt="" />zzz',
      "148"
    );
    t.end();
  }
);

tap.test(
  "149 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""    /    >zzz'),
      'zzz<img alt="" />zzz',
      "149"
    );
    t.end();
  }
);

tap.test(
  "150 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    ""/    >zzz'),
      'zzz<img alt="" />zzz',
      "150"
    );
    t.end();
  }
);

tap.test(
  "151 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt="   "    /    >zzz'),
      'zzz<img alt="" />zzz',
      "151"
    );
    t.end();
  }
);

tap.test(
  "152 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    ="   "    /    >zzz'),
      'zzz<img alt="" />zzz',
      "152"
    );
    t.end();
  }
);

tap.test(
  "153 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "    /    >zzz'),
      'zzz<img alt="" />zzz',
      "153"
    );
    t.end();
  }
);

tap.test(
  "154 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/    >zzz'),
      'zzz<img alt="" />zzz',
      "154"
    );
    t.end();
  }
);

tap.test(
  "155 - alt with two double quotes, many spaces between slash & bracket, XHTML",
  (t) => {
    t.same(
      alt('zzz<img     alt    =    "   "/    >zzz'),
      'zzz<img alt="" />zzz',
      "155"
    );
    t.end();
  }
);

// GROUP FIFTEEN.
// -----------------------------------------------------------------------------
// alt with two single quotes, HTML

tap.test("156 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt=''    >zzz"), 'zzz<img alt="" >zzz', "156");
  t.end();
});

tap.test("157 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt    =''    >zzz"), 'zzz<img alt="" >zzz', "157");
  t.end();
});

tap.test("158 - alt with two single quotes, HTML", (t) => {
  t.same(
    alt("zzz<img     alt    =    ''    >zzz"),
    'zzz<img alt="" >zzz',
    "158"
  );
  t.end();
});

tap.test("159 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt    =    ''>zzz"), 'zzz<img alt="" >zzz', "159");
  t.end();
});

tap.test("160 - alt with two single quotes, HTML", (t) => {
  t.same(alt("zzz<img     alt='   '    >zzz"), 'zzz<img alt="" >zzz', "160");
  t.end();
});

tap.test("161 - alt with two single quotes, HTML", (t) => {
  t.same(
    alt("zzz<img     alt    ='   '    >zzz"),
    'zzz<img alt="" >zzz',
    "161"
  );
  t.end();
});

tap.test("162 - alt with two single quotes, HTML", (t) => {
  t.same(
    alt("zzz<img     alt    =    '   '    >zzz"),
    'zzz<img alt="" >zzz',
    "162"
  );
  t.end();
});

tap.test("163 - alt with two single quotes, HTML", (t) => {
  t.same(
    alt("zzz<img     alt    =    '   '>zzz"),
    'zzz<img alt="" >zzz',
    "163"
  );
  t.end();
});

// GROUP SIXTEEN.
// -----------------------------------------------------------------------------
// weird code cases, all broken (X)HTML

tap.test(
  "164 - testing escape latch for missing second double quote cases",
  (t) => {
    // it kicks in when encounters equals sign after the first double quote
    // until we add function to recognise the attributes within IMG tags,
    // escape latch will kick in and prevent all action when second double quote is missing
    t.same(
      alt('zzz<img alt="  class="" />zzz'),
      'zzz<img alt="  class="" />zzz',
      "164"
    );
    t.end();
  }
);

tap.test("165 - testing seriously messed up code", (t) => {
  // it kicks in when encounters equals sign after the first double quote
  // until we add function to recognise the attributes within IMG tags,
  // escape latch will kick in and prevent all action when second double quote is missing
  t.same(
    alt("zzz<img >>>>>>>>>>zzz"),
    'zzz<img alt="" >>>>>>>>>>zzz',
    "165.01"
  );
  t.same(alt("zzz<<img >>zzz"), 'zzz<<img alt="" >>zzz', "165.02");
  t.same(
    alt("zzz<><><<>><<<>>>><img >>zzz"),
    'zzz<><><<>><<<>>>><img alt="" >>zzz',
    "165.03"
  );
  t.end();
});

tap.test("166 - other attributes don't have equal and value", (t) => {
  t.same(
    alt('<img something alt="" >'),
    '<img something alt="" >',
    "166.01 - img tag only, with alt"
  );
  t.same(
    alt("<img something>"),
    '<img something alt="" >',
    "166.02 - img tag only, no alt"
  );
  t.same(
    alt("<img something >"),
    '<img something alt="" >',
    "166.03 - img tag only, no alt"
  );
  // XHTML counterparts:
  t.same(
    alt('<img something alt="" />'),
    '<img something alt="" />',
    "166.04 - img tag only, with alt"
  );
  t.same(
    alt("<img something/>"),
    '<img something alt="" />',
    "166.05 - img tag only, no alt, tight"
  );
  t.same(
    alt("<img something />"),
    '<img something alt="" />',
    "166.06 - img tag only, no alt"
  );
  t.same(
    alt('<img something alt="" /     >'),
    '<img something alt="" />',
    "166.07 - img tag only, with alt, excessive white space"
  );
  t.same(
    alt("<img something/     >"),
    '<img something alt="" />',
    "166.08 - img tag only, no alt, excessive white space"
  );
  t.same(
    alt("<img something /     >"),
    '<img something alt="" />',
    "166.09 - img tag only, no alt, excessive white space"
  );
  t.end();
});

tap.test(
  "167 - specific place in the algorithm, protection against rogue slashes",
  (t) => {
    t.same(
      alt('<img alt="/ class="" />'),
      '<img alt="/ class="" />',
      "167 - should do nothing."
    );
    t.end();
  }
);

// GROUP SEVENTEEN.
// -----------------------------------------------------------------------------
// throws

tap.test("168 - throws if encounters img tag within img tag", (t) => {
  t.throws(() => {
    alt('zzz<img alt="  <img />zzz');
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("169 - throws if input is not string", (t) => {
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

tap.test("170 - throws if opts is not a plain object", (t) => {
  t.throws(() => {
    alt("zzz", ["aaa"]);
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    alt("zzz", null); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  }, "170.02");
  t.doesNotThrow(() => {
    alt("zzz", undefined); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  }, "170.03");
  t.throws(() => {
    alt("zzz", 1);
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    alt("zzz", {});
  }, "170.05");
  t.throws(() => {
    alt("zzz", { zzz: "yyy" }); // rogue keys - throws. WTF?
  }, /THROW_ID_03/g);
  t.end();
});

// GROUP EIGHTEEM.
// -----------------------------------------------------------------------------
// opts.unfancyTheAltContents

tap.test("171 - cleans alt tag contents - fancy quote", (t) => {
  t.same(
    alt('<img alt    ="   someone’s " >'),
    '<img alt="someone\'s" >',
    "171.01 - default"
  );
  t.same(
    alt('<img alt    ="   someone’s " >', { unfancyTheAltContents: true }),
    '<img alt="someone\'s" >',
    "171.02 - hardcoded default, unfancyTheAltContents on"
  );
  t.same(
    alt('<img alt    ="   someone’s " >', { unfancyTheAltContents: false }),
    '<img alt="   someone’s " >',
    "171.03 - unfancyTheAltContents off - no character substitution, no trim"
  );
  t.end();
});

tap.test("172 - cleans alt tag contents - m-dash + trim", (t) => {
  t.same(
    alt('<img alt    =" The new offer \u2014 50% discount " >'),
    '<img alt="The new offer - 50% discount" >',
    "172.01 - default"
  );
  t.same(
    alt('<img alt    =" The new offer \u2014 50% discount " >'),
    '<img alt="The new offer - 50% discount" >',
    "172.02 - hardcoded default, unfancyTheAltContents on"
  );
  t.same(
    alt('<img alt    =" The new offer \u2014 50% discount " >', {
      unfancyTheAltContents: false,
    }),
    '<img alt=" The new offer \u2014 50% discount " >',
    "172.03 - unfancyTheAltContents off - no character substitution, no trimming done"
  );
  t.end();
});

tap.test("173 - un-fancies multiple alt tags", (t) => {
  t.same(
    alt(
      'abc <img alt    ="   someone’s " > def\n <img alt    =" The new offer \u2014 50% discount " > ghi <img      >\n\n\njkl'
    ),
    'abc <img alt="someone\'s" > def\n <img alt="The new offer - 50% discount" > ghi <img alt="" >\n\n\njkl',
    "173 - default"
  );
  t.end();
});

tap.test("174 - adds an ALT within a nunjucks-sprinkled HTML", (t) => {
  t.same(
    alt(
      '<img {% if m.n_o %}class="x-y"{% else %}id="a db-c d" style="display: block;"{% endif %}></td>'
    ),
    '<img {% if m.n_o %}class="x-y"{% else %}id="a db-c d" style="display: block;"{% endif %} alt="" ></td>',
    "174.01 - minime of 18.04.02"
  );
  t.same(
    alt(
      '<td class="anything-here" background="{%- include "partials/zzz.nunjucks" -%}" bgcolor="{{ color }}" height="{{ something_here }}" valign="top" style="background-image: url({%- include "partials/partials-location.nunjucks" -%}); background-position: top center; background-repeat: no-repeat; font-size: 0; line-height: 0;" align="center"><img {% if something.is_right %}class="right-class"{% else %}id="alternative dont-know-why-i-put-id here" style="display: block;"{% endif %}></td>'
    ),
    '<td class="anything-here" background="{%- include "partials/zzz.nunjucks" -%}" bgcolor="{{ color }}" height="{{ something_here }}" valign="top" style="background-image: url({%- include "partials/partials-location.nunjucks" -%}); background-position: top center; background-repeat: no-repeat; font-size: 0; line-height: 0;" align="center"><img {% if something.is_right %}class="right-class"{% else %}id="alternative dont-know-why-i-put-id here" style="display: block;"{% endif %} alt="" ></td>',
    "174.02"
  );
  t.end();
});

tap.test(
  '175 - Nunjucks code following straight after character g of "img"',
  (t) => {
    t.same(
      alt(
        '<img{% if not state_colour_col %} class="test"{% endif %} style="display: block;">'
      ),
      '<img{% if not state_colour_col %} class="test"{% endif %} style="display: block;" alt="" >',
      "175"
    );
    t.end();
  }
);

tap.test("176 - Nunjucks code tight before ALT", (t) => {
  t.same(
    alt('<img {% if variables %}class="variables" {% endif %}alt=>'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "176.01 - alt with equal with no quotes"
  );
  t.same(
    alt('<img {% if variables %}class="variables" {% endif %}alt=">'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "176.02 - alt with equal and single quote, second is missing"
  );
  t.same(
    alt('<img {% if variables %}class="variables" {% endif %}alt>'),
    '<img {% if variables %}class="variables" {% endif %}alt="" >',
    "176.03 - alt with both equal and quotes missing"
  );
  t.end();
});

'use strict'

import alt from './index'
import test from 'ava'

// GROUP ZEROZERO.
// -----------------------------------------------------------------------------
// no alt attr is missing, only whitespace control

test('00.01 - nothing is missing', (t) => {
  t.deepEqual(
    alt('zzz<img        alt="123" >zzz'), 'zzz<img alt="123" >zzz',
    '00.01.01 - one HTML tag, only excessive whitespace'
  )
  t.deepEqual(
    alt('<img   alt="123"    >'), '<img alt="123" >',
    '00.01.02 - whitespace on both sides, one tag'
  )
  t.deepEqual(
    alt('xxx<img        alt="123" >yyy<img   alt="123"    >zzz'), 'xxx<img alt="123" >yyy<img alt="123" >zzz',
    '00.01.03 - multiple HTML tags, only excessive whitespace'
  )
  t.deepEqual(
    alt('zzz<img        alt="123" />zzz'), 'zzz<img alt="123" />zzz',
    '00.01.04 - one XHTML tag, only excessive whitespace'
  )
  t.deepEqual(
    alt('xxx<img        alt="123" />yyy<img   alt="123"    />zzz'), 'xxx<img alt="123" />yyy<img alt="123" />zzz',
    '00.01.05 - multiple XHTML tags, only excessive whitespace'
  )
  t.deepEqual(
    alt('aaaa        bbbbb'), 'aaaa        bbbbb',
    '00.01.06 - excessive whitespace, no tags at all'
  )
  t.deepEqual(
    alt('aaaa alt bbbbb'), 'aaaa alt bbbbb',
    '00.01.07 - suspicious alt within copy but not IMG tag'
  )
  t.deepEqual(
    alt('aaaa alt= bbbbb'), 'aaaa alt= bbbbb',
    '00.01.08 - suspicious alt= within copy but not IMG tag'
  )
  t.deepEqual(
    alt('aaaa alt = bbbbb'), 'aaaa alt = bbbbb',
    '00.01.09 - suspicious alt= within copy but not IMG tag'
  )
  t.deepEqual(
    alt('<img alt="1   23" >'), '<img alt="1   23" >',
    '00.01.10 - does nothing'
  )
  t.deepEqual(
    alt('<img    class="zzz"   alt="123"    >'), '<img class="zzz" alt="123" >',
    '00.01.11 - whitespace on both sides, one tag'
  )
})

test('00.02 - whitespace between XHTML closing slash and closing bracket', (t) => {
  t.deepEqual(
    alt('zzz<img        alt="123"    /  >zzz'), 'zzz<img alt="123" />zzz',
    '00.02.01 - one HTML tag, only excessive whitespace'
  )
  t.deepEqual(
    alt('z/zz<img        alt="/123/"    /  >z/zz'), 'z/zz<img alt="/123/" />z/zz',
    '00.02.02 - false slashes'
  )
})

test('00.03 - alt with two quotes, XHTML', (t) => {
  t.deepEqual(
    alt('zzz<img     alt=""    />zzz'), 'zzz<img alt="" />zzz',
    '00.03.01 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =""    />zzz'), 'zzz<img alt="" />zzz',
    '00.03.02 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    ""    />zzz'), 'zzz<img alt="" />zzz',
    '00.03.03 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    ""/>zzz'), 'zzz<img alt="" />zzz',
    '00.03.04 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    ""/    >zzz'), 'zzz<img alt="" />zzz',
    '00.03.05 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt=""    /    >zzz'), 'zzz<img alt="" />zzz',
    '00.03.06 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =     ""    /     >zzz'), 'zzz<img alt="" />zzz',
    '00.03.07 - html, excessive white space'
  )
})

test('00.04 - alt is between other attributes, testing whitespace control', (t) => {
  t.deepEqual(
    alt('zzz<img        alt="123"   class="test" >zzz'), 'zzz<img alt="123" class="test" >zzz',
    '00.04'
  )
})

// GROUP ONE.
// -----------------------------------------------------------------------------
// alt attr is missing

test('01.01 - missing alt', (t) => {
  t.deepEqual(
    alt('zzz<img>zzz'), 'zzz<img alt="" >zzz',
    '01.01.01 - html - tight'
  )
  t.deepEqual(
    alt('zzz<img >zzz'), 'zzz<img alt="" >zzz',
    '01.01.02 - html - trailing space'
  )
  t.deepEqual(
    alt('zzz<img      >zzz'), 'zzz<img alt="" >zzz',
    '01.01.03 - html - excessive trailing space'
  )
  t.deepEqual(
    alt('zzz<img/>zzz'), 'zzz<img alt="" />zzz',
    '01.01.04 - xhtml - tight'
  )
  t.deepEqual(
    alt('zzz<img />zzz'), 'zzz<img alt="" />zzz',
    '01.01.05 - xhtml - one space before slash'
  )
  t.deepEqual(
    alt('zzz<img           />zzz'), 'zzz<img alt="" />zzz',
    '01.01.06 - xhtml - many spaces before slash'
  )
  t.deepEqual(
    alt('zzz<img           /    >zzz'), 'zzz<img alt="" />zzz',
    '01.01.07 - xhtml - many spaces on both sides'
  )
})

test('01.02 - normalising all attributes on IMG, adding ALT', (t) => {
  t.deepEqual(
    alt('z<img         a="zz"        >z'),
    'z<img a="zz" alt="" >z',
    '01.02.01 - html simples'
  )
  t.deepEqual(
    alt('z<img         a="zz"        />z'),
    'z<img a="zz" alt="" />z',
    '01.02.02 - xhtml simples'
  )
  t.deepEqual(
    alt('z<img         a="zz"        /     >z'),
    'z<img a="zz" alt="" />z',
    '01.02.03 - xhtml simples'
  )
  t.deepEqual(
    alt('z<img         a="zz"/     >z'),
    'z<img a="zz" alt="" />z',
    '01.02.04 - xhtml simples'
  )
  t.deepEqual(
    alt('zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       >zzz'),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" >zzz',
    '01.02.05 - html advanced'
  )
  t.deepEqual(
    alt('zzz<img      whatever="sjldldljg; slhljdfg"       also="sdfkdh:232423 ; kgkd: 1223678638"       />zzz'),
    'zzz<img whatever="sjldldljg; slhljdfg" also="sdfkdh:232423 ; kgkd: 1223678638" alt="" />zzz',
    '01.02.06 - xhtml advanced'
  )
})

test('01.03 - alt attribute is missing, there are other attributes too', (t) => {
  // HTML
  t.deepEqual(
    alt('zzz<img class="">zzz'), 'zzz<img class="" alt="" >zzz',
    '01.03.01'
  )
  t.deepEqual(
    alt('zzz<img    class="">zzz'), 'zzz<img class="" alt="" >zzz',
    '01.03.02'
  )
  t.deepEqual(
    alt('zzz<img class=""    >zzz<img class=""    >zzz<img class=""    >zzz'), 'zzz<img class="" alt="" >zzz<img class="" alt="" >zzz<img class="" alt="" >zzz',
    '01.03.03'
  )
  // XHTML
  t.deepEqual(
    alt('zzz<img class=""/>zzz'), 'zzz<img class="" alt="" />zzz',
    '01.03.04'
  )
  t.deepEqual(
    alt('zzz<img    class=""/>zzz'), 'zzz<img class="" alt="" />zzz',
    '01.03.05'
  )
  t.deepEqual(
    alt('zzz<img class=""    />zzz'), 'zzz<img class="" alt="" />zzz',
    '01.03.06'
  )
  t.deepEqual(
    alt('zzz<img    class=""   />zzz'), 'zzz<img class="" alt="" />zzz',
    '01.03.07'
  )
  t.deepEqual(
    alt('zzz<img class=""       />zzz<img class=""       />zzz<img class=""       />zzz'), 'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
    '01.03.08'
  )
  t.deepEqual(
    alt('zzz<img class=""/   >zzz'), 'zzz<img class="" alt="" />zzz',
    '01.03.09'
  )
  t.deepEqual(
    alt('zzz<img    class=""/   >zzz'), 'zzz<img class="" alt="" />zzz',
    '01.03.10'
  )
  t.deepEqual(
    alt('zzz<img class=""    /   >zzz<img class=""    /   >zzz<img class=""    /   >zzz'), 'zzz<img class="" alt="" />zzz<img class="" alt="" />zzz<img class="" alt="" />zzz',
    '01.03.11'
  )
})

// GROUP TWO.
// -----------------------------------------------------------------------------
// alt attr is present, but without equal and double quotes.

test('02.01 - alt without equal', (t) => {
  t.deepEqual(
    alt('zzz<img alt>zzz'), 'zzz<img alt="" >zzz',
    '02.01.01 - html - tight'
  )
  t.deepEqual(
    alt('zzz<img    alt>zzz'), 'zzz<img alt="" >zzz',
    '02.01.02 - html - excessive white space'
  )
  t.deepEqual(
    alt('zzz<img alt >zzz'), 'zzz<img alt="" >zzz',
    '02.01.03 - html - one trailing space'
  )
  t.deepEqual(
    alt('zzz<img      alt      >zzz'), 'zzz<img alt="" >zzz',
    '02.01.04 - html - excessive white space on both sides'
  )
  t.deepEqual(
    alt('zzz<img alt/>zzz'), 'zzz<img alt="" />zzz',
    '02.01.05 - xhtml - tight'
  )
  t.deepEqual(
    alt('zzz<img alt />zzz'), 'zzz<img alt="" />zzz',
    '02.01.06 - xhtml - single space on both sides'
  )
  t.deepEqual(
    alt('zzz<img      alt   />zzz'), 'zzz<img alt="" />zzz',
    '02.01.07 - xhtml - excessive white space on both sides'
  )
  t.deepEqual(
    alt('zzz<img      alt   /   >zzz'), 'zzz<img alt="" />zzz',
    '02.01.08 - xhtml - excessive white space everywhere'
  )
})

// GROUP THREE.
// -----------------------------------------------------------------------------
// alt attr is present, but with only equal character

test('03.01 - alt with just equal', (t) => {
  t.deepEqual(
    alt('zzz<img alt=>zzz'), 'zzz<img alt="" >zzz',
    '03.01.01 - html, no space after'
  )
  t.deepEqual(
    alt('zzz<img alt=>zzz<img alt=>zzz'), 'zzz<img alt="" >zzz<img alt="" >zzz',
    '03.01.02 - html, two imag tags, no space after each'
  )
  t.deepEqual(
    alt('zzz<img alt= >zzz'), 'zzz<img alt="" >zzz',
    '03.01.03 - html, space after'
  )
  t.deepEqual(
    alt('zzz<img    alt=>zzz'), 'zzz<img alt="" >zzz',
    '03.01.04 - html, excessive space in front'
  )
  t.deepEqual(
    alt('zzz<img alt=    >zzz'), 'zzz<img alt="" >zzz',
    '03.01.05 - html, excessive space after'
  )
  t.deepEqual(
    alt('zzz<img alt=/>zzz'), 'zzz<img alt="" />zzz',
    '03.01.06 - xhtml, no space after'
  )
  t.deepEqual(
    alt('zzz<img alt=/   >zzz'), 'zzz<img alt="" />zzz',
    '03.01.07 - xhtml, no space after'
  )
  t.deepEqual(
    alt('zzz<img alt= />zzz'), 'zzz<img alt="" />zzz',
    '03.01.08 - xhtml, space after'
  )
  t.deepEqual(
    alt('zzz<img    alt=/>zzz'), 'zzz<img alt="" />zzz',
    '03.01.09 - xhtml, excessive space before'
  )
  t.deepEqual(
    alt('zzz<img alt=    />zzz'), 'zzz<img alt="" />zzz',
    '03.01.10 - xhtml, excessive space after'
  )
  t.deepEqual(
    alt('zzz<img     alt=    />zzz'), 'zzz<img alt="" />zzz',
    '03.01.11 - xhtml, excessive space on both sides of alt='
  )
  t.deepEqual(
    alt('zzz<img     alt   =    />zzz'), 'zzz<img alt="" />zzz',
    '03.01.12 - xhtml, excessive space on both sides of equal, no quotes'
  )
  t.deepEqual(
    alt('zzz<img alt    =>zzz'), 'zzz<img alt="" >zzz',
    '03.01.13 - html, no space after'
  )
  t.deepEqual(
    alt('zzz<img alt    =   "">zzz'), 'zzz<img alt="" >zzz',
    '03.01.14 - html, no space after'
  )
})

// GROUP FOUR.
// -----------------------------------------------------------------------------
// alt attr is present, but with only one quote (double or single)

test('04.01 - alt with only one double quote, one HTML tag', (t) => {
  // one tag:
  // ---------------------------------------------------------------------------
  t.deepEqual(
    alt('zzz<img alt=">zzz'), 'zzz<img alt="" >zzz',
    '04.01.01'
  )
  t.deepEqual(
    alt('zzz<img alt =">zzz'), 'zzz<img alt="" >zzz',
    '04.01.02'
  )
  t.deepEqual(
    alt('zzz<img alt= ">zzz'), 'zzz<img alt="" >zzz',
    '04.01.03'
  )
  t.deepEqual(
    alt('zzz<img alt=" >zzz'), 'zzz<img alt="" >zzz',
    '04.01.04'
  )
  t.deepEqual(
    alt('zzz<img alt   =">zzz'), 'zzz<img alt="" >zzz',
    '04.01.05'
  )
  t.deepEqual(
    alt('zzz<img alt=   ">zzz'), 'zzz<img alt="" >zzz',
    '04.01.06'
  )
  t.deepEqual(
    alt('zzz<img alt="   >zzz'), 'zzz<img alt="" >zzz',
    '04.01.07'
  )
  t.deepEqual(
    alt('zzz<img alt   =   ">zzz'), 'zzz<img alt="" >zzz',
    '04.01.08'
  )
  t.deepEqual(
    alt('zzz<img alt=   "   >zzz'), 'zzz<img alt="" >zzz',
    '04.01.09'
  )
  t.deepEqual(
    alt('zzz<img alt   ="   >zzz'), 'zzz<img alt="" >zzz',
    '04.01.10'
  )
  t.deepEqual(
    alt('zzz<img alt   =   "   >zzz'), 'zzz<img alt="" >zzz',
    '04.01.11'
  )
  t.deepEqual(
    alt('<img alt="legit quote: \'" >'), '<img alt="legit quote: \'" >',
    '04.01.12'
  )
})

test('04.02 - alt with only one double quote, three HTML tags', (t) => {
  t.deepEqual(
    alt(
      'zzz<img alt=">zzz<img alt=">zzz<img alt=">zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.01'
  )
  t.deepEqual(
    alt(
      'zzz<img alt =">zzz<img alt =">zzz<img alt =">zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.02'
  )
  t.deepEqual(
    alt(
      'zzz<img alt= ">zzz<img alt= ">zzz<img alt= ">zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.03'
  )
  t.deepEqual(
    alt(
      'zzz<img alt=" >zzz<img alt=" >zzz<img alt=" >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.04'
  )
  t.deepEqual(
    alt(
      'zzz<img alt   =">zzz<img alt   =">zzz<img alt   =">zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.05'
  )
  t.deepEqual(
    alt(
      'zzz<img alt=   ">zzz<img alt=   ">zzz<img alt=   ">zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.06'
  )
  t.deepEqual(
    alt(
      'zzz<img alt="   >zzz<img alt="   >zzz<img alt="   >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.07'
  )
  t.deepEqual(
    alt(
      'zzz<img alt   =   ">zzz<img alt   =   ">zzz<img alt   =   ">zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.08'
  )
  t.deepEqual(
    alt(
      'zzz<img alt=   "   >zzz<img alt=   "   >zzz<img alt=   "   >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.09'
  )
  t.deepEqual(
    alt(
      'zzz<img alt   ="   >zzz<img alt   ="   >zzz<img alt   ="   >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.10'
  )
  t.deepEqual(
    alt(
      'zzz<img alt   =   "   >zzz<img alt   =   "   >zzz<img alt   =   "   >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
      '04.02.11'
  )
  t.deepEqual(
    alt(
      '<img alt="legit quote: \'" ><img alt="legit quote: \'" ><img alt="legit quote: \'" >'),
      '<img alt="legit quote: \'" ><img alt="legit quote: \'" ><img alt="legit quote: \'" >',
      '04.02.12'
  )
})

test('04.03 - alt with only one double quote, one XHTML tag', (t) => {
  t.deepEqual(
    alt('zzz<img alt="/>zzz'), 'zzz<img alt="" />zzz',
    '04.03.01'
  )
  t.deepEqual(
    alt('zzz<img alt ="/>zzz'), 'zzz<img alt="" />zzz',
    '04.03.02'
  )
  t.deepEqual(
    alt('zzz<img alt= "/>zzz'), 'zzz<img alt="" />zzz',
    '04.03.03'
  )
  t.deepEqual(
    alt('zzz<img alt=" />zzz'), 'zzz<img alt="" />zzz',
    '04.03.04'
  )
  t.deepEqual(
    alt('zzz<img alt   ="/>zzz'), 'zzz<img alt="" />zzz',
    '04.03.05'
  )
  t.deepEqual(
    alt('zzz<img alt=   "/>zzz'), 'zzz<img alt="" />zzz',
    '04.03.06'
  )
  t.deepEqual(
    alt('zzz<img alt="   />zzz'), 'zzz<img alt="" />zzz',
    '04.03.07'
  )
  t.deepEqual(
    alt('zzz<img alt   =   "/>zzz'), 'zzz<img alt="" />zzz',
    '04.03.08'
  )
  t.deepEqual(
    alt('zzz<img alt=   "   />zzz'), 'zzz<img alt="" />zzz',
    '04.03.09'
  )
  t.deepEqual(
    alt('zzz<img alt   ="   />zzz'), 'zzz<img alt="" />zzz',
    '04.03.10'
  )
  t.deepEqual(
    alt('zzz<img alt   =   "   />zzz'), 'zzz<img alt="" />zzz',
    '04.03.11'
  )
  t.deepEqual(
    alt('<img alt="legit quote: \'" />'), '<img alt="legit quote: \'" />',
    '04.03.12'
  )
})

test('04.04 - alt with only one double quote, three XHTML tags', (t) => {
  t.deepEqual(
    alt(
      'zzz<img alt="/>zzz<img alt="   />zzz<img alt="/    >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.13'
  )
  t.deepEqual(
    alt(
      'zzz<img alt ="/>zzz<img alt ="   />zzz<img alt ="/   >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.14'
  )
  t.deepEqual(
    alt(
      'zzz<img alt= "/>zzz<img alt= "   />zzz<img alt= "/   >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.15'
  )
  t.deepEqual(
    alt(
      'zzz<img alt=" />zzz<img alt="    />zzz<img alt=" /   >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.16'
  )
  t.deepEqual(
    alt(
      'zzz<img alt   ="/>zzz<img alt   ="    />zzz<img alt   ="/   >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.17'
  )
  t.deepEqual(
    alt(
      'zzz<img alt=   "/>zzz<img alt=   "   />zzz<img alt=   "/   >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.18'
  )
  t.deepEqual(
    alt(
      'zzz<img alt="   />zzz<img alt="     />zzz<img alt="   /   >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.19'
  )
  t.deepEqual(
    alt(
      'zzz<img alt   =   "/>zzz<img alt   =   "    />zzz<img alt   =   "/   >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.20'
  )
  t.deepEqual(
    alt(
      'zzz<img alt=   "   />zzz<img alt=   "     />zzz<img alt=   "   /    >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.21'
  )
  t.deepEqual(
    alt(
      'zzz<img alt   ="   />zzz<img alt   ="     />zzz<img alt   ="   /    >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.22'
  )
  t.deepEqual(
    alt(
      'zzz<img alt   =   "   />zzz<img alt   =   "      />zzz<img alt   =   "   /   >zzz'),
      'zzz<img alt="" />zzz<img alt="" />zzz<img alt="" />zzz',
      '04.04.23'
  )
  t.deepEqual(
    alt(
      '<img alt="z"/   >'),
      '<img alt="z" />',
      '04.04.24'
  )
  t.deepEqual(
    alt(
      '<img alt="legit quote: \'"/><img alt="legit quote: \'"   /><img alt="legit quote: \'"/   >'),
      '<img alt="legit quote: \'" /><img alt="legit quote: \'" /><img alt="legit quote: \'" />',
      '04.04.25'
  )
})

test('04.05 - alt with only one single quote', (t) => {
  t.deepEqual(
    alt('zzz<img alt=\'>zzz'), 'zzz<img alt="" >zzz',
    '04.05.01 - html, one single quote'
  )
  t.deepEqual(
    alt('zzz<img alt=  \'  >zzz'), 'zzz<img alt="" >zzz',
    '04.05.02 - html, one single quote'
  )
  t.deepEqual(
    alt('zzz<img alt   =  \'  >zzz'), 'zzz<img alt="" >zzz',
    '04.05.03 - html, one single quote'
  )
  t.deepEqual(
    alt('zz\'z<img alt=\'>zzz<img alt="legit quote: \'" >zz'), 'zz\'z<img alt="" >zzz<img alt="legit quote: \'" >zz',
    '04.05.04 - html, one single quote'
  )
  t.deepEqual(
    alt('zzz<img alt=  \'\'  >zzz'), 'zzz<img alt="" >zzz',
    '04.05.05 - html, two single quotes'
  )
  t.deepEqual(
    alt('zzz<img alt=  \'\'>zzz'), 'zzz<img alt="" >zzz',
    '04.05.06 - html, two single quotes'
  )
  t.deepEqual(
    alt('zzz<img alt    =\'>zzz'), 'zzz<img alt="" >zzz',
    '04.05.07 - html, one single quote'
  )
})

// GROUP FIVE.
// -----------------------------------------------------------------------------
// alt, two quotes (double or single)

test('05.01 - alt with two double quotes, excessive whitespace, HTML', (t) => {
  // one IMG tag:
  // ---------------------------------------------------------------------------
  t.deepEqual(
    alt('zzz<img     alt=""    >zzz'), 'zzz<img alt="" >zzz',
    '05.01.01 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =""    >zzz'), 'zzz<img alt="" >zzz',
    '05.01.02 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    ""    >zzz'), 'zzz<img alt="" >zzz',
    '05.01.03 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "">zzz'), 'zzz<img alt="" >zzz',
    '05.01.04 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt="   "    >zzz'), 'zzz<img alt="" >zzz',
    '05.01.05 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    ="   "    >zzz'), 'zzz<img alt="" >zzz',
    '05.01.06 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   "    >zzz'), 'zzz<img alt="" >zzz',
    '05.01.07 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   ">zzz'), 'zzz<img alt="" >zzz',
    '05.01.08 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   ">zzz'), 'zzz<img alt="" >zzz',
    '05.01.09 - html, excessive white space'
  )
  // three IMG tags:
  // ---------------------------------------------------------------------------
  t.deepEqual(
    alt(
      'zzz<img     alt=""    >zzz<img     alt=""    >zzz<img     alt=""    >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    '05.01.10 - html, excessive white space'
  )
  t.deepEqual(
    alt(
      'zzz<img     alt    =""    >zzz<img     alt    =""    >zzz<img     alt    =""    >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    '05.01.11 - html, excessive white space'
  )
  t.deepEqual(
    alt(
      'zzz<img     alt    =    ""    >zzz<img     alt    =    ""    >zzz<img     alt    =    ""    >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    '05.01.12 - html, excessive white space'
  )
  t.deepEqual(
    alt(
      'zzz<img     alt    =    "">zzz<img     alt    =    "">zzz<img     alt    =    "">zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    '05.01.13 - html, excessive white space'
  )
  t.deepEqual(
    alt(
      'zzz<img     alt="   "    >zzz<img     alt="   "    >zzz<img     alt="   "    >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    '05.01.14 - html, excessive white space'
  )
  t.deepEqual(
    alt(
      'zzz<img     alt    ="   "    >zzz<img     alt    ="   "    >zzz<img     alt    ="   "    >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    '05.01.15 - html, excessive white space'
  )
  t.deepEqual(
    alt(
      'zzz<img     alt    =    "   "    >zzz<img     alt    =    "   "    >zzz<img     alt    =    "   "    >zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    '05.01.16 - html, excessive white space'
  )
  t.deepEqual(
    alt(
      'zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    '05.01.17 - html, excessive white space'
  )
  t.deepEqual(
    alt(
      'zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz<img     alt    =    "   ">zzz'),
      'zzz<img alt="" >zzz<img alt="" >zzz<img alt="" >zzz',
    '05.01.18 - html, excessive white space'
  )
})

test('05.02 - alt with two double quotes, no space after slash, one XHTML tag', (t) => {
  t.deepEqual(
    alt('zzz<img     alt=""    />zzz'), 'zzz<img alt="" />zzz',
    '05.02.01 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =""    />zzz'), 'zzz<img alt="" />zzz',
    '05.02.02 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    ""    />zzz'), 'zzz<img alt="" />zzz',
    '05.02.03 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    ""/>zzz'), 'zzz<img alt="" />zzz',
    '05.02.04 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt="   "    />zzz'), 'zzz<img alt="" />zzz',
    '05.02.05 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    ="   "    />zzz'), 'zzz<img alt="" />zzz',
    '05.02.06 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   "    />zzz'), 'zzz<img alt="" />zzz',
    '05.02.07 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/>zzz'), 'zzz<img alt="" />zzz',
    '05.02.08 - html, excessive white space'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/>zzz'), 'zzz<img alt="" />zzz',
    '05.02.09 - html, excessive white space'
  )
})

test('05.03 - alt with two double quotes, one space between slash & bracket, XHTML', (t) => {
  t.deepEqual(
    alt('zzz<img     alt=""    / >zzz'), 'zzz<img alt="" />zzz',
    '05.03.01'
  )
  t.deepEqual(
    alt('zzz<img     alt    =""    / >zzz'), 'zzz<img alt="" />zzz',
    '05.03.02'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    ""    / >zzz'), 'zzz<img alt="" />zzz',
    '05.03.03'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    ""/ >zzz'), 'zzz<img alt="" />zzz',
    '05.03.04'
  )
  t.deepEqual(
    alt('zzz<img     alt="   "    / >zzz'), 'zzz<img alt="" />zzz',
    '05.03.05'
  )
  t.deepEqual(
    alt('zzz<img     alt    ="   "    / >zzz'), 'zzz<img alt="" />zzz',
    '05.03.06'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   "    / >zzz'), 'zzz<img alt="" />zzz',
    '05.03.07'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/ >zzz'), 'zzz<img alt="" />zzz',
    '05.03.08'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/ >zzz'), 'zzz<img alt="" />zzz',
    '05.03.09'
  )
})

test('05.04 - alt with two double quotes, many spaces between slash & bracket, XHTML', (t) => {
  // ---------------------------------------------------------------------------
  // same but with many spaces between slash and closing bracket:
  t.deepEqual(
    alt('zzz<img     alt=""    /    >zzz'), 'zzz<img alt="" />zzz',
    '05.04.01'
  )
  t.deepEqual(
    alt('zzz<img     alt    =""    /    >zzz'), 'zzz<img alt="" />zzz',
    '05.04.02'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    ""    /    >zzz'), 'zzz<img alt="" />zzz',
    '05.04.03'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    ""/    >zzz'), 'zzz<img alt="" />zzz',
    '05.04.04'
  )
  t.deepEqual(
    alt('zzz<img     alt="   "    /    >zzz'), 'zzz<img alt="" />zzz',
    '05.04.05'
  )
  t.deepEqual(
    alt('zzz<img     alt    ="   "    /    >zzz'), 'zzz<img alt="" />zzz',
    '05.04.06'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   "    /    >zzz'), 'zzz<img alt="" />zzz',
    '05.04.07'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/    >zzz'), 'zzz<img alt="" />zzz',
    '05.04.08'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    "   "/    >zzz'), 'zzz<img alt="" />zzz',
    '05.04.09'
  )
})

test('05.05 - alt with two single quotes, HTML', (t) => {
  t.deepEqual(
    alt('zzz<img     alt=\'\'    >zzz'), 'zzz<img alt="" >zzz',
    '05.05.01'
  )
  t.deepEqual(
    alt('zzz<img     alt    =\'\'    >zzz'), 'zzz<img alt="" >zzz',
    '05.05.02'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    \'\'    >zzz'), 'zzz<img alt="" >zzz',
    '05.05.03'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    \'\'>zzz'), 'zzz<img alt="" >zzz',
    '05.05.04'
  )
  t.deepEqual(
    alt('zzz<img     alt=\'   \'    >zzz'), 'zzz<img alt="" >zzz',
    '05.05.05'
  )
  t.deepEqual(
    alt('zzz<img     alt    =\'   \'    >zzz'), 'zzz<img alt="" >zzz',
    '05.05.06'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    \'   \'    >zzz'), 'zzz<img alt="" >zzz',
    '05.05.07'
  )
  t.deepEqual(
    alt('zzz<img     alt    =    \'   \'>zzz'), 'zzz<img alt="" >zzz',
    '05.05.08'
  )
})

// GROUP SIX.
// -----------------------------------------------------------------------------
// weird code cases, all broken (X)HTML

test('06.01 - testing escape latch for missing second double quote cases', (t) => {
  // it kicks in when encounters equals sign after the first double quote
  // until we add function to recognise the attributes within IMG tags,
  // escape latch will kick in and prevent all action when second double quote is missing
  t.deepEqual(
    alt('zzz<img alt="  class="" />zzz'), 'zzz<img alt="  class="" />zzz',
    '06.01'
  )
})

test('06.02 - testing seriously messed up code', (t) => {
  // it kicks in when encounters equals sign after the first double quote
  // until we add function to recognise the attributes within IMG tags,
  // escape latch will kick in and prevent all action when second double quote is missing
  t.deepEqual(
    alt('zzz<img >>>>>>>>>>zzz'), 'zzz<img alt="" >>>>>>>>>>zzz',
    '06.02.01'
  )
  t.deepEqual(
    alt('zzz<<img >>zzz'), 'zzz<<img alt="" >>zzz',
    '06.02.02'
  )
  t.deepEqual(
    alt('zzz<><><<>><<<>>>><img >>zzz'), 'zzz<><><<>><<<>>>><img alt="" >>zzz',
    '06.02.03'
  )
})

test('06.03 - other attributes don\'t have equal and value', (t) => {
  t.deepEqual(
    alt('<img something alt="" >'), '<img something alt="" >',
    '06.03.01 - img tag only, with alt'
  )
  t.deepEqual(
    alt('<img something>'), '<img something alt="" >',
    '06.03.02 - img tag only, no alt'
  )
  t.deepEqual(
    alt('<img something >'), '<img something alt="" >',
    '06.03.03 - img tag only, no alt'
  )
  // XHTML counterparts:
  t.deepEqual(
    alt('<img something alt="" />'), '<img something alt="" />',
    '06.03.04 - img tag only, with alt'
  )
  t.deepEqual(
    alt('<img something/>'), '<img something alt="" />',
    '06.03.05 - img tag only, no alt, tight'
  )
  t.deepEqual(
    alt('<img something />'), '<img something alt="" />',
    '06.03.06 - img tag only, no alt'
  )
  t.deepEqual(
    alt('<img something alt="" /     >'), '<img something alt="" />',
    '06.03.07 - img tag only, with alt, excessive white space'
  )
  t.deepEqual(
    alt('<img something/     >'), '<img something alt="" />',
    '06.03.08 - img tag only, no alt, excessive white space'
  )
  t.deepEqual(
    alt('<img something /     >'), '<img something alt="" />',
    '06.03.09 - img tag only, no alt, excessive white space'
  )
})

test('06.04 - specific place in the algorithm, protection against rogue slashes', (t) => {
  t.deepEqual(
    alt('<img alt="/ class="" />'), '<img alt="/ class="" />',
    '06.04 - should do nothing.'
  )
})

// GROUP SEVEN.
// -----------------------------------------------------------------------------
// throws

test('07.01 - throws if encounters img tag within img tag', (t) => {
  t.throws(function () {
    alt('zzz<img alt="  <img />zzz')
  })
})

test('07.02 - throws if input is not string', (t) => {
  t.throws(function () {
    alt(null)
  })
  t.throws(function () {
    alt()
  })
  t.throws(function () {
    alt(undefined)
  })
  t.throws(function () {
    alt(111)
  })
  t.throws(function () {
    alt(true)
  })
})

test('07.03 - throws if opts is not a plain object', (t) => {
  t.throws(function () {
    alt('zzz', ['aaa'])
  })
  t.notThrows(function () {
    alt('zzz', null) // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  })
  t.notThrows(function () {
    alt('zzz', undefined) // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  })
  t.throws(function () {
    alt('zzz', 1)
  })
  t.notThrows(function () {
    alt('zzz', {})
  })
  t.throws(function () {
    alt('zzz', {zzz: 'yyy'}) // rogue keys - throws. WTF?
  })
})

// GROUP EIGHT.
// -----------------------------------------------------------------------------
// opts.unfancyTheAltContents

test('08.01 - cleans alt tag contents - fancy quote', (t) => {
  t.deepEqual(
    alt('<img alt    ="   someone’s " >'), '<img alt="someone\'s" >',
    '08.01.01 - default'
  )
  t.deepEqual(
    alt('<img alt    ="   someone’s " >', {unfancyTheAltContents: true}), '<img alt="someone\'s" >',
    '08.01.02 - hardcoded default, unfancyTheAltContents on'
  )
  t.deepEqual(
    alt('<img alt    ="   someone’s " >', {unfancyTheAltContents: false}), '<img alt="   someone’s " >',
    '08.01.03 - unfancyTheAltContents off - no character substitution, no trim'
  )
})

test('08.02 - cleans alt tag contents - m-dash + trim', (t) => {
  t.deepEqual(
    alt('<img alt    =" The new offer \u2014 50% discount " >'), '<img alt="The new offer - 50% discount" >',
    '08.02.01 - default'
  )
  t.deepEqual(
    alt('<img alt    =" The new offer \u2014 50% discount " >'), '<img alt="The new offer - 50% discount" >',
    '08.02.02 - hardcoded default, unfancyTheAltContents on'
  )
  t.deepEqual(
    alt('<img alt    =" The new offer \u2014 50% discount " >', {unfancyTheAltContents: false}), '<img alt=" The new offer \u2014 50% discount " >',
    '08.02.03 - unfancyTheAltContents off - no character substitution, no trimming done'
  )
})

test('08.03 - un-fancies multiple alt tags', (t) => {
  t.deepEqual(
    alt('abc <img alt    ="   someone’s " > def\n <img alt    =" The new offer \u2014 50% discount " > ghi <img      >\n\n\njkl'), 'abc <img alt="someone\'s" > def\n <img alt="The new offer - 50% discount" > ghi <img alt="" >\n\n\njkl',
    '08.03.01 - default'
  )
})

test('08.04 - adds an ALT within a nunjucks-sprinkled HTML', (t) => {
  t.deepEqual(
    alt(
      '<img {% if m.n_o %}class="x-y"{% else %}id="a db-c d" style="display: block;"{% endif %}></td>'
    ),
    '<img {% if m.n_o %}class="x-y"{% else %}id="a db-c d" style="display: block;"{% endif %} alt="" ></td>',
    '08.04.01 - minime of 08.04.02'
  )
  t.deepEqual(
    alt(
      '<td class="anything-here" background="{%- include "partials/zzz.nunjucks" -%}" bgcolor="{{ color }}" height="{{ something_here }}" valign="top" style="background-image: url({%- include "partials/partials-location.nunjucks" -%}); background-position: top center; background-repeat: no-repeat; font-size: 0; line-height: 0;" align="center"><img {% if something.is_right %}class="right-class"{% else %}id="alternative dont-know-why-i-put-id here" style="display: block;"{% endif %}></td>'
    ),
    '<td class="anything-here" background="{%- include "partials/zzz.nunjucks" -%}" bgcolor="{{ color }}" height="{{ something_here }}" valign="top" style="background-image: url({%- include "partials/partials-location.nunjucks" -%}); background-position: top center; background-repeat: no-repeat; font-size: 0; line-height: 0;" align="center"><img {% if something.is_right %}class="right-class"{% else %}id="alternative dont-know-why-i-put-id here" style="display: block;"{% endif %} alt="" ></td>',
    '08.04.02'
  )
})

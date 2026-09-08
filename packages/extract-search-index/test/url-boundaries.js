import { test } from "uvu";
import { equal } from "uvu/assert";

import { extract } from "../dist/extract-search-index.esm.js";

test("01 - long top-level domains are removed completely", () => {
  equal(
    extract("Read https://example.technology manual"),
    "read manual",
    "01.01",
  );
});

test("02 - localhost hosts support ports and paths", () => {
  equal(
    extract("Read https://localhost:8080/help manual"),
    "read manual",
    "02.01",
  );
});

test("03 - bracketed IPv6 hosts are kept inside the URL span", () => {
  equal(
    extract("Read https://[2001:db8::1]/help manual"),
    "read manual",
    "03.01",
  );
  equal(extract("Read http://[::1]:8080/help manual"), "read manual", "03.02");
});

test("04 - internationalized hosts and paths do not become keywords", () => {
  equal(extract("Read https://例子.中国/文档 manual"), "read manual", "04.01");
  equal(
    extract("Read https://münchen.example/straße manual"),
    "read manual",
    "04.02",
  );
});

test("05 - bracketed query keys do not leave their values behind", () => {
  equal(
    extract("Read https://example.com/?tags[]=red manual"),
    "read manual",
    "05.01",
  );
  equal(
    extract("Read https://example.com/?tags[filter]=red&sort=ascending manual"),
    "read manual",
    "05.02",
  );
});

test("06 - Unicode query values and fragments are removed completely", () => {
  equal(
    extract("alpha https://example.com?query=中文 beta"),
    "alpha beta",
    "06.01",
  );
  equal(
    extract("alpha https://example.com/路径?query=δοκιμή#章节 beta"),
    "alpha beta",
    "06.02",
  );
});

test("07 - IPv4, user information and ports belong to the URL", () => {
  equal(
    extract("Read http://127.0.0.1:3000/help manual"),
    "read manual",
    "07.01",
  );
  equal(
    extract("Read https://reader:password@example.com:8443/help manual"),
    "read manual",
    "07.02",
  );
  equal(
    extract("Read https://reader%40mail:pass%3Aword@example.com/help manual"),
    "read manual",
    "07.03",
  );
});

test("08 - HTTP scheme and host case do not affect removal", () => {
  equal(
    extract(
      "Read HTTP://LOCALHOST:8080/help HTTPS://EXAMPLE.TECHNOLOGY manual",
    ),
    "read manual",
    "08.01",
  );
});

test("09 - valid path punctuation remains part of the removed span", () => {
  equal(
    extract(
      "Read https://example.com/a;b/@user,cash+$~_name?value=yes#part manual",
    ),
    "read manual",
    "09.01",
  );
});

test("10 - percent-encoded punctuation does not create prose boundaries", () => {
  equal(
    extract(
      "Read https://example.com/path%28topic%29?query=%5Bred%5D%20blue manual",
    ),
    "read manual",
    "10.01",
  );
  equal(
    extract("[Read](https://example.com/path%29topic)manual"),
    "read manual",
    "10.02",
  );
});

test("11 - prose immediately after a Markdown link survives", () => {
  equal(extract("[Read](https://example.com)manual"), "read manual", "11.01");
  equal(
    extract("prefix[Read](https://localhost:8080/help)suffix"),
    "prefix read suffix",
    "11.02",
  );
});

test("12 - balanced destination parentheses do not consume closing prose", () => {
  equal(
    extract("[Read](https://example.com/path_(topic))manual"),
    "read manual",
    "12.01",
  );
  equal(
    extract("[Read](https://example.com/path_(outer_(inner)))manual"),
    "read manual",
    "12.02",
  );
});

test("13 - escaped destination parentheses are not Markdown delimiters", () => {
  equal(
    extract(String.raw`[Read](https://example.com/path_\(topic\))manual`),
    "read manual",
    "13.01",
  );
  equal(
    extract(String.raw`[Read](https://example.com/path\)topic)manual`),
    "read manual",
    "13.02",
  );
});

test("14 - angle-delimited Markdown destinations preserve neighboring prose", () => {
  equal(
    extract("[Read](<https://example.com/path_(topic)>)manual"),
    "read manual",
    "14.01",
  );
});

test("15 - balanced parentheses inside a bare URL do not leak path words", () => {
  equal(
    extract("Read https://example.com/path_(topic) manual"),
    "read manual",
    "15.01",
  );
});

test("16 - surrounding sentence punctuation leaves prose searchable", () => {
  equal(
    extract(
      "Read (https://example.com/help), then follow https://localhost/help.",
    ),
    "read then follow",
    "16.01",
  );
  equal(
    extract(
      "Read https://example.com/help! More https://example.com/next; done.",
    ),
    "read more done",
    "16.02",
  );
});

test("17 - repeated links preserve first-occurrence keyword order", () => {
  equal(
    extract(
      "Alpha https://例子.中国/文档 Beta [ALPHA](https://example.technology)Gamma",
    ),
    "alpha beta gamma",
    "17.01",
  );
});

test("18 - bare hosts and email addresses retain their existing tokens", () => {
  equal(
    extract("Read example.technology www.example.com manual"),
    "read example technology www com manual",
    "18.01",
  );
  equal(
    extract("Read user@example.com manual"),
    "read user@example com manual",
    "18.02",
  );
});

test("19 - other schemes retain their existing token treatment", () => {
  equal(
    extract("Read ftp://example.com/archive manual"),
    "read ftp example com archive manual",
    "19.01",
  );
  equal(
    extract("Read mailto:user@example.com manual"),
    "read mailto user@example com manual",
    "19.02",
  );
  equal(
    extract("Read data:text/plain,private manual"),
    "read data text plain private manual",
    "19.03",
  );
});

test("20 - literal quotes and backticks delimit surrounding prose", () => {
  equal(
    extract('Read "https://example.com/help"manual'),
    "read manual",
    "20.01",
  );
  equal(
    extract("Read 'https://example.com/help'manual"),
    "read manual",
    "20.02",
  );
  equal(
    extract("Read `https://example.com/help`manual"),
    "read manual",
    "20.03",
  );
  equal(
    extract("Read “https://example.com/help”manual"),
    "read manual",
    "20.04",
  );
});

test("21 - encoded quotes and backticks remain URL data", () => {
  equal(
    extract("Read https://example.com/a%22private%27hidden%60tail manual"),
    "read manual",
    "21.01",
  );
});

test("22 - outer square brackets preserve adjacent prose", () => {
  equal(
    extract("Read [https://example.com/help]manual"),
    "read manual",
    "22.01",
  );
  equal(
    extract("Read [https://[::1]:8080/?tags[]=red]manual"),
    "read manual",
    "22.02",
  );
});

test("23 - square brackets in ordinary URL paths remain data", () => {
  equal(
    extract("Read https://example.com/a[topic]private manual"),
    "read manual",
    "23.01",
  );
  equal(
    extract("Read https://example.com/a]private manual"),
    "read manual",
    "23.02",
  );
});

test("24 - unmatched closing parentheses preserve following prose", () => {
  equal(
    extract("Read https://example.com/help)manual"),
    "read manual",
    "24.01",
  );
  equal(
    extract("Read https://example.com/a(topic manual"),
    "read manual",
    "24.02",
  );
});

test("25 - ASCII and Unicode whitespace delimit URL spans", () => {
  equal(
    extract("Read\thttps://localhost/help\nmanual"),
    "read manual",
    "25.01",
  );
  equal(
    extract("Read\u00A0https://example.technology/help\u2003manual"),
    "read manual",
    "25.02",
  );
});

test("26 - complete URLs need neither a dotted host nor a path", () => {
  equal(extract("https://localhost"), "", "26.01");
  equal(extract("http://intranet"), "", "26.02");
  equal(extract("https://example.com"), "", "26.03");
});

test("27 - missing authorities remain prose", () => {
  equal(extract("Read https:// manual"), "read https manual", "27.01");
  equal(
    extract("Read https://:443/path manual"),
    "read https path manual",
    "27.02",
  );
});

test("28 - malformed authorities and ports are not partially removed", () => {
  equal(
    extract("Read https://example.com:bad/path manual"),
    "read https example com bad path manual",
    "28.01",
  );
  equal(
    extract("Read https://example.com:99999/path manual"),
    "read https example com path manual",
    "28.02",
  );
  equal(
    extract("Read https://exa%mple.com/path manual"),
    "read https exa%mple com path manual",
    "28.03",
  );
});

test("29 - malformed IPv6 remains prose", () => {
  equal(
    extract("Read https://[bad]/path manual"),
    "read https bad path manual",
    "29.01",
  );
  equal(
    extract("Read https://[2001:db8::1/path manual"),
    "read https db path manual",
    "29.02",
  );
});

test("30 - apostrophes inside unquoted URLs remain data", () => {
  equal(
    extract("Read https://example.com/rock'n'roll manual"),
    "read manual",
    "30.01",
  );
  equal(
    extract("Read https://example.com/?query=don't#reader's manual"),
    "read manual",
    "30.02",
  );
  equal(
    extract("[Read](https://example.com/rock'n'roll)manual"),
    "read manual",
    "30.03",
  );
});

test("31 - backslash parity determines whether a Markdown parenthesis closes", () => {
  equal(
    extract(String.raw`[Read](https://example.com/path\\)manual`),
    "read manual",
    "31.01",
  );
  equal(
    extract(String.raw`[Read](https://example.com/path\\\)private)manual`),
    "read manual",
    "31.02",
  );
});

test("32 - sentence punctuation after a bare authority does not invalidate its URL", () => {
  equal(extract("Read https://localhost:8080, manual"), "read manual", "32.01");
  equal(extract("Read https://localhost:8080! manual"), "read manual", "32.02");
  equal(extract("Read https://[::1]:8080. manual"), "read manual", "32.03");
  equal(extract("Read https://[::1], manual"), "read manual", "32.04");
  equal(
    extract("Read https://example.com:443; manual"),
    "read manual",
    "32.05",
  );
  equal(
    extract("Read https://example.com:invalid, manual"),
    "read https example com invalid manual",
    "32.06",
  );
  equal(
    extract("Read https://[::1]:99999! manual"),
    "read https manual",
    "32.07",
  );
});

test.run();

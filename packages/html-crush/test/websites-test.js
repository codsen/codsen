import tap from "tap";
import fetch from "node-fetch";
import pMap from "p-map";
import { m } from "./util/util";

// 08. Fetch sources of some real websites and see, a) are any non-whitespace
// characters deleted; b) that there are no throws; c) is minified source less
// than or equal to orginal
// -----------------------------------------------------------------------------

const websitesToTest = [
  [
    "https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/",
    "html-crush on GitLab",
  ],
  ["https://detergent.io", "Detergent.io website"],
  [
    "https://en.wikipedia.org/wiki/Doughnut",
    "the Wikipedia page about doughnuts",
  ],
  ["http://www.muji.eu/", "Muji EU online store"],
  ["https://www.mozilla.org/en-GB/", "Mozilla UK homepage"],
  ["https://sjhgldgldgjdlfgldgldflkgjd.com", "Non-existent URL"],
];

tap.test(
  `01-0${
    websitesToTest.length
  } - ${`\u001b[${90}m${`real websites`}\u001b[${39}m`}`,
  async (t) => {
    await pMap(websitesToTest, (websiteArr, rowNum) =>
      fetch(websiteArr[0])
        .then((res) => res.text())
        .then((sourceStr) => {
          t.ok(
            typeof sourceStr === "string" && sourceStr.length > 0,
            `08.0${
              rowNum + 1
            }.01 - fetched non-empty, valid HTML source from "${websiteArr[0]}"`
          );
          // test #1 - indentations removed
          // we allow website fetch to fail, but not errors during minification
          let minifiedResult1;
          try {
            minifiedResult1 = m(t, sourceStr, {
              removeIndentations: true,
              removeLineBreaks: false,
            });
          } catch (error) {
            t.fail(
              `During minification of URL "${websiteArr[0]}", minification threw an error:\n${error}`
            );
          }

          t.ok(
            minifiedResult1.result.length <= sourceStr.length,
            `08.0${rowNum + 1}.02 - minified size is the same or less (${
              minifiedResult1.log.percentageReducedOfOriginal
            }% size savings)`
          );
          console.log(
            `062 - 0${rowNum + 1}.03 - ${
              websiteArr[1]
            } - only indentations removed: ${
              minifiedResult1.log.percentageReducedOfOriginal
            }% size savings`
          );

          // test #2 - linebreaks removed along with indentations
          // we allow website fetch to fail, but not errors during minification
          let minifiedResult2;
          try {
            minifiedResult2 = m(t, sourceStr, {
              removeLineBreaks: true,
              lineLengthLimit: 0,
            });
          } catch (error) {
            t.fail(
              `During minification of URL "${websiteArr[0]}", minification threw an error:\n${error}`
            );
          }

          t.ok(
            minifiedResult2.result.length <= sourceStr.length,
            `08.0${rowNum + 1}.04 - minified size is the same or less (${
              minifiedResult2.log.percentageReducedOfOriginal
            }% size savings)`
          );
          console.log(
            `090 - 0${rowNum + 1}.05 - ${websiteArr[1]} - linebreaks removed: ${
              minifiedResult2.log.percentageReducedOfOriginal
            }% size savings`
          );
        })
        .catch((err) => {
          console.log(
            `097 - 0${rowNum + 1}.xx - ${
              websiteArr[1]
            } - ${`\u001b[${31}m${`could not fetch the web page! Moving on...`}\u001b[${39}m`}`
          );
          t.pass(err.message);
        })
    );
    t.end();
  }
);

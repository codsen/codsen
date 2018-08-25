function doInterpretErroneousNBSP_old(str) {
  const nbspRanges = new Ranges({
    limitToBeAddedWhitespace: true
  }); // the main container to gather the ranges. Slices is a JS class.

  // PART 1.
  console.log(
    `\u001b[${36}m${`UTIL / doInterpretErroneousNBSP(): `}\u001b[${39}m`
  );
  nbspRanges.push(rangesRegex(/&+n+b+s+p+;+/gim, "&nbsp"));
  str = er(
    str,
    {
      leftOutsideNot: "n",
      leftMaybe: "&",
      searchFor: "nbsp",
      rightOutsideNot: ";",
      i: {
        searchFor: true
      }
    },
    "&nbsp;"
  );
  // console.log(`2619 str = >>>${str}<<<`);
  str = er(
    str,
    {
      leftOutsideNot: ["&", "n"],
      searchFor: "nbsp",
      rightMaybe: ";",
      rightOutsideNot: "p",
      i: {
        searchFor: true
      }
    },
    "&nbsp;"
  );
  // console.log(`2633 str = >>>${str}<<<`);
  // \nnsp;
  str = er(
    str,
    {
      leftOutside: "\n",
      searchFor: "nsp;"
    },
    "&nbsp;"
  );
  // console.log(`2643 str = >>>${str}<<<`);
  // \nnbp;
  str = er(
    str,
    {
      leftOutside: "\n",
      searchFor: "nbp;"
    },
    "&nbsp;"
  );
  // console.log(`2653 str = >>>${str}<<<`);
  // \nnbs;
  str = er(
    str,
    {
      leftOutside: "\n",
      searchFor: "nbs;"
    },
    "&nbsp;"
  );
  // console.log(`2663 str = >>>${str}<<<`);
  // thinsp;
  str = er(
    str,
    {
      leftMaybe: "&",
      searchFor: "thinsp",
      rightMaybe: ";"
    },
    "\u2009"
  );
  // console.log(`2674 str = >>>${str}<<<`);
  // &nbs
  str = er(
    str,
    {
      leftOutside: "&",
      searchFor: "nbs",
      rightOutsideNot: "p"
    },
    "nbsp"
  );
  // console.log(`2685 str = >>>${str}<<<`);
  // (&)nsp;
  str = er(
    str,
    {
      leftOutsideNot: "e",
      leftMaybe: "&",
      searchFor: "nsp;"
    },
    "&nbsp;"
  );
  // console.log(`2696 str = >>>${str}<<<`);
  // &nsp
  str = er(
    str,
    {
      leftOutside: "&",
      searchFor: "nsp",
      rightMaybe: ";"
    },
    "nbsp;"
  );
  // console.log(`2707 str = >>>${str}<<<`);
  // bsp
  str = er(
    str,
    {
      leftOutside: "&",
      searchFor: "bsp",
      rightMaybe: ";"
    },
    "nbsp;"
  );
  // console.log(`2718 str = >>>${str}<<<`);
  // nbp and similar
  str = er(
    str,
    {
      leftMaybe: "&",
      searchFor: "nbp",
      rightMaybe: ";"
    },
    "&nbsp;"
  );
  // console.log(`2729 str = >>>${str}<<<`);
  // now dangerous stuff: missing ampersand and one letter (semicol present)
  // ?nbs;
  str = er(
    str,
    {
      leftMaybe: "&",
      searchFor: "nbs;"
    },
    "&nbsp;"
  );
  // console.log(`2740 str = >>>${str}<<<`);
  // ?bsp;
  str = er(
    str,
    {
      leftOutsideNot: ["n", "&"],
      searchFor: "bsp;"
    },
    "&nbsp;"
  );
  // console.log(`2750 str = >>>${str}<<<`);
  // ===
  // fix missing ampersand and semicolon if wrapped by spaces
  str = er(
    str,
    {
      leftOutside: " ",
      searchFor: "nbsp",
      rightOutside: " "
    },
    " &nbsp; "
  );
  // console.log(`2762 str = >>>${str}<<<`);
  // &ang (not &angst) - without semicol
  str = er(
    str,
    {
      searchFor: "&ang",
      rightOutsideNot: ["s", ";"]
    },
    "&ang;"
  );
  // console.log(`2772 str = >>>${str}<<<`);
  // &angst - without semicol
  str = er(
    str,
    {
      searchFor: "&angst",
      rightOutsideNot: ";"
    },
    "&angst;"
  );
  // console.log(`2782 str = >>>${str}<<<`);
  // &pi (not &piv) - without semicol
  str = er(
    str,
    {
      searchFor: "&pi",
      rightOutsideNot: ["v", ";"]
    },
    "&pi;"
  );
  // console.log(`2792 str = >>>${str}<<<`);
  // &Pi - without semicol
  str = er(
    str,
    {
      searchFor: "&Pi",
      rightOutsideNot: ";"
    },
    "&Pi;"
  );
  // console.log(`2802 str = >>>${str}<<<`);
  // &sigma (not &sigmaf) - without semicol
  str = er(
    str,
    {
      searchFor: "&sigma",
      rightOutsideNot: ["f", ";"]
    },
    "&sigma;"
  );
  // console.log(`2812 str = >>>${str}<<<`);
  // &sub (not &sube) - without semicol
  str = er(
    str,
    {
      searchFor: "&sub",
      rightOutsideNot: ["e", ";"]
    },
    "&sub;"
  );
  // console.log(`2822 str = >>>${str}<<<`);
  // &sup (not &supf, &supe, &sup1, &sup2 or &sup3) - without semicol
  str = er(
    str,
    {
      searchFor: "&sup",
      rightOutsideNot: ["f", "e", "1", "2", "3", ";"]
    },
    "&sup;"
  );
  // console.log(`2832 str = >>>${str}<<<`);
  // &piv - without semicol
  str = er(
    str,
    {
      searchFor: "&piv",
      rightOutsideNot: ";"
    },
    "&piv;"
  );
  // console.log(`2842 str = >>>${str}<<<`);
  // &theta (not &thetasym) - without semicol
  str = er(
    str,
    {
      searchFor: "&theta",
      rightOutsideNot: ["sym", ";"]
    },
    "&theta;"
  );
  // console.log(`2852 str = >>>${str}<<<`);

  //
  // PART 2. At least one of each of the set [n, b, s, p] is present.
  // any repetitions whatsoever like &&&&&nnnbbbssssp;;;
  str = str
    .replace(/&+n+b+s+p/gim, "&nbsp")
    .replace(/n+b+s+p+;+/gim, "nbsp;")
    .replace(/n+b+s+p+ /gim, "nbsp; ")
    .replace(/n+b+s+p,/gim, "nbsp;,")
    .replace(/n+b+s+p\./gim, "nbsp;.")

    // PART 3. One letter missing, but amp and semicol are present.
    .replace(/&bsp;/gim, "&nbsp;")
    .replace(/&nsp;/gim, "&nbsp;")
    .replace(/&nbp;/gim, "&nbsp;")
    .replace(/&npb;/gim, "&nbsp;")
    .replace(/&nbs;/gim, "&nbsp;");

  // console.log(`2871 str = >>>${str}<<<`);
  //
  // ===
  // fix missing semicolon when ampersand is present:
  str = er(
    str,
    {
      leftOutside: "&",
      searchFor: "nbsp",
      rightOutsideNot: ";",
      i: {
        searchFor: true
      }
    },
    "nbsp;"
  );
  // console.log(`2887 str = >>>${str}<<<`);
  // ===
  // fix space-nbsp with no semicol
  str = er(
    str,
    {
      leftOutside: [" ", ".", ",", ";", "\xa0", "?", "!"],
      searchFor: "nbsp",
      rightOutsideNot: ";",
      i: {
        searchFor: true
      }
    },
    "&nbsp;"
  );
  // console.log(`2902 str = >>>${str}<<<`);
  // ===
  // fix missing ampersand when semicolon is present:
  str = er(
    str,
    {
      leftOutsideNot: "&",
      searchFor: "nbsp",
      rightOutside: ";",
      i: {
        searchFor: true
      }
    },
    "&nbsp"
  );
  console.log(
    `2918 UTIL / doInterpretErroneousNBSP(): RETURN str = >>>${escape(str)}<<<`
  );
  //
  return str;
}

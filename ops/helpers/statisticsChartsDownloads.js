import { addDays, NPM_HISTORY_START } from "./npmDownloads.js";
import { coverageStart } from "./npmDownloadsFile.js";
import {
  escapeXml,
  number,
  packageUrl,
  svgDocument,
} from "./statisticsChartsSvg.js";

const DAY_MS = 86_400_000;
const INK = "#203a43";
const MUTED = "#526a73";
const TEAL = "#007c78";
const AMBER = "#b86619";
const GRID = "#dce5e6";

function compareNames(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function safeSum(left, right) {
  const result = left + right;
  if (!Number.isSafeInteger(result)) {
    throw new Error("statistics charts: unsafe download aggregate");
  }
  return result;
}

function percent(value) {
  return `${value.toFixed(1)}%`;
}

function label(x, y, value, size = 14, fill = INK, extra = "") {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${escapeXml(value)}</text>`;
}

function line(x1, y1, x2, y2, stroke = GRID, extra = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" ${extra}/>`;
}

function titleBlock(title, subtitle) {
  return [
    label(40, 35, "CODSEN / NPM DOWNLOADS", 12, TEAL, 'letter-spacing="1.5"'),
    label(40, 78, title, 30, INK, 'font-weight="700"'),
    label(40, 108, subtitle, 14, MUTED),
  ].join("\n");
}

function warningText(window) {
  if (!window.packageCount) return "No eligible packages are available.";
  if (!window.complete) {
    return `Incomplete observations for ${window.missingPackages.length} packages; concentration is unavailable.`;
  }
  if (window.totalDownloads === 0) {
    return "No downloads were recorded in this window; concentration is undefined.";
  }
  return null;
}

function footer(window, y) {
  const messages = [
    "npm downloads count package fetches, including dependency and automated installs; they are not unique users.",
    window.provisional
      ? `Provisional: ${window.anomalyDays.length} suspected shared-zero days are retained as archived, without estimation.`
      : "Source: the verified local npm archive. Recorded zeros are retained; missing observations are never filled.",
  ];
  return messages
    .map((message, index) => label(40, y + index * 22, message, 12, MUTED))
    .join("\n");
}

function periodSummary(contexts, anomalies, start, end) {
  const values = [];
  const missingPackages = [];
  let observedDownloads = 0;
  for (const context of contexts) {
    let downloads = 0;
    let observedDays = 0;
    for (const row of context.rows) {
      if (row.day < start) continue;
      if (row.day > end) break;
      downloads = safeSum(downloads, row.downloads);
      observedDays++;
    }
    const expectedStart =
      context.knownZeroBeforeDay !== null && context.knownZeroBeforeDay > start
        ? context.knownZeroBeforeDay
        : start;
    const expectedDays =
      expectedStart > end
        ? 0
        : (Date.parse(end) - Date.parse(expectedStart)) / DAY_MS + 1;
    if (observedDays !== expectedDays) missingPackages.push(context.name);
    observedDownloads = safeSum(observedDownloads, downloads);
    values.push({ name: context.name, downloads });
  }
  const anomalyDays = anomalies
    .filter((entry) => entry.day >= start && entry.day <= end)
    .map((entry) => entry.day);
  const complete = !missingPackages.length;
  const totalDownloads = complete ? observedDownloads : null;
  let cumulativeDownloads = 0;
  let packagesFor80Percent = null;
  const ranked =
    complete && totalDownloads > 0
      ? values
          .sort(
            (left, right) =>
              right.downloads - left.downloads ||
              compareNames(left.name, right.name),
          )
          .map((entry, index) => {
            cumulativeDownloads = safeSum(cumulativeDownloads, entry.downloads);
            if (
              packagesFor80Percent === null &&
              BigInt(cumulativeDownloads) * 5n >= BigInt(totalDownloads) * 4n
            ) {
              packagesFor80Percent = index + 1;
            }
            return {
              ...entry,
              rank: index + 1,
              share: (entry.downloads / totalDownloads) * 100,
              cumulativeDownloads,
              cumulativeShare: (cumulativeDownloads / totalDownloads) * 100,
            };
          })
      : [];
  const top20PercentCount = Math.ceil(contexts.length / 5);
  return {
    start,
    end,
    days: (Date.parse(end) - Date.parse(start)) / DAY_MS + 1,
    packageCount: contexts.length,
    complete,
    missingPackages,
    observedDownloads,
    totalDownloads,
    provisional: anomalyDays.length > 0,
    anomalyDays,
    packagesFor80Percent,
    packageShareFor80Percent:
      packagesFor80Percent === null
        ? null
        : (packagesFor80Percent / contexts.length) * 100,
    achieved80PercentShare:
      packagesFor80Percent === null
        ? null
        : ranked[packagesFor80Percent - 1].cumulativeShare,
    top20PercentCount,
    top20PercentPackageShare: contexts.length
      ? (top20PercentCount / contexts.length) * 100
      : null,
    top20PercentDownloadShare:
      ranked[top20PercentCount - 1]?.cumulativeShare ?? null,
    ranked,
  };
}

function concentrationSvg(window) {
  const title = "How concentrated are downloads?";
  const subtitle = `${window.start} to ${window.end} · ${window.days} days · ${window.packageCount} current libraries and CLIs`;
  const body = [titleBlock(title, subtitle)];
  const warning = warningText(window);
  if (warning) {
    body.push(label(40, 190, warning, 18), footer(window, 256));
  } else {
    const cards = [
      [
        `${window.packagesFor80Percent} of ${window.packageCount} packages`,
        `Deliver ${percent(window.achieved80PercentShare)} of downloads`,
        `${percent(window.packageShareFor80Percent)} of the cohort; minimum to reach 80%`,
      ],
      [
        percent(window.top20PercentDownloadShare),
        `Download share of the top ${window.top20PercentCount} packages`,
        `Top fifth, rounded up: ${percent(window.top20PercentPackageShare)} of packages`,
      ],
      [
        number(window.totalDownloads),
        "Total recorded downloads",
        window.provisional
          ? "Provisional: archive flags suspected zeros"
          : "Complete daily coverage",
      ],
    ];
    cards.forEach(([value, caption, note], index) => {
      const x = 40 + index * 300;
      body.push(
        `<rect x="${x}" y="135" width="280" height="111" rx="12" fill="#edf4f5"/>`,
        label(
          x + 16,
          171,
          value,
          25,
          index === 1 ? AMBER : TEAL,
          'font-weight="700"',
        ),
        label(x + 16, 198, caption, 12),
        label(x + 16, 223, note, 11, MUTED),
      );
    });
    const x = (value) => 86 + (value / 100) * 794;
    const y = (value) => 552 - (value / 100) * 246;
    body.push(label(86, 283, "Cumulative share of downloads", 12, MUTED));
    for (const tick of [0, 20, 40, 60, 80, 100]) {
      body.push(
        line(86, y(tick), 880, y(tick)),
        label(74, y(tick) + 4, `${tick}%`, 11, MUTED, 'text-anchor="end"'),
        label(x(tick), 575, `${tick}%`, 11, MUTED, 'text-anchor="middle"'),
      );
    }
    const points = [
      `${x(0)},${y(0)}`,
      ...window.ranked.map(
        (entry) =>
          `${x((entry.rank / window.packageCount) * 100)},${y(entry.cumulativeShare)}`,
      ),
    ];
    body.push(
      `<polygon points="${points.join(" ")} ${x(100)},${y(0)}" fill="${TEAL}" opacity="0.08"/>`,
      line(x(0), y(0), x(100), y(100), "#a8b9c2", 'stroke-dasharray="5 5"'),
      line(86, y(80), 880, y(80), AMBER, 'stroke-dasharray="5 5"'),
      `<polyline points="${points.join(" ")}" fill="none" stroke="${TEAL}" stroke-width="3" stroke-linejoin="round"/>`,
      `<circle cx="${x(window.packageShareFor80Percent)}" cy="${y(window.achieved80PercentShare)}" r="5" fill="${AMBER}" stroke="white" stroke-width="2"><title>${window.packagesFor80Percent} packages reach ${percent(window.achieved80PercentShare)}</title></circle>`,
      label(888, y(80) + 4, "80%", 11, AMBER),
      label(
        483,
        604,
        "Share of packages, ranked from most to least downloaded",
        12,
        MUTED,
        'text-anchor="middle"',
      ),
      line(88, 628, 113, 628, TEAL, 'stroke-width="3"'),
      label(121, 632, "Observed cumulative downloads", 12, MUTED),
      line(391, 628, 416, 628, "#a8b9c2", 'stroke-dasharray="5 5"'),
      label(424, 632, "Equal downloads per package", 12, MUTED),
      footer(window, 674),
    );
  }
  return svgDocument({
    id: "download-concentration",
    title,
    description: `${subtitle}. ${warning ?? `${window.packagesFor80Percent} packages (${percent(window.packageShareFor80Percent)}) account for ${percent(window.achieved80PercentShare)} of downloads. The top ${window.top20PercentCount} packages account for ${percent(window.top20PercentDownloadShare)}.`}`,
    width: 960,
    height: warning ? 310 : 730,
    body: body.join("\n"),
  });
}

function rankedSvg(window) {
  const title = "Where the downloads go";
  const shown = window.ranked.slice(0, 15);
  const remainder = window.ranked.slice(shown.length);
  const rows = [
    ...shown,
    ...(remainder.length
      ? [
          {
            name: `All other ${remainder.length} packages`,
            downloads: remainder.reduce(
              (sum, entry) => safeSum(sum, entry.downloads),
              0,
            ),
            other: true,
          },
        ]
      : []),
  ];
  const warning = warningText(window);
  const body = [
    titleBlock(
      title,
      `${window.start} to ${window.end} · ${window.packageCount} current libraries and CLIs`,
    ),
  ];
  const height = warning ? 310 : Math.max(380, 240 + rows.length * 31);
  if (warning) {
    body.push(label(40, 190, warning, 18));
  } else {
    body.push(
      label(40, 150, "RANK / PACKAGE", 11, MUTED, 'letter-spacing="1"'),
      label(428, 150, "DOWNLOADS", 11, MUTED, 'letter-spacing="1"'),
      label(
        917,
        150,
        "COUNT / SHARE",
        11,
        MUTED,
        'text-anchor="end" letter-spacing="1"',
      ),
    );
    const maximum = Math.max(...rows.map((entry) => entry.downloads));
    rows.forEach((entry, index) => {
      const y = 177 + index * 31;
      const share = (entry.downloads / window.totalDownloads) * 100;
      const content = [
        `<title>${escapeXml(entry.name)}: ${number(entry.downloads)} downloads (${percent(share)})</title>`,
        line(40, y + 18, 920, y + 18, "#ecf0f2"),
        label(
          40,
          y + 5,
          entry.other ? "—" : String(entry.rank).padStart(2, "0"),
          11,
          MUTED,
        ),
        label(76, y + 5, entry.name, 12, entry.other ? MUTED : INK),
        `<rect x="428" y="${y - 10}" width="${(entry.downloads / maximum) * 290}" height="19" rx="3" fill="${entry.other ? "#b5c6ce" : TEAL}"/>`,
        label(
          917,
          y + 5,
          `${number(entry.downloads)} / ${percent(share)}`,
          12,
          MUTED,
          'text-anchor="end"',
        ),
      ].join("\n");
      body.push(
        entry.other
          ? `<g>${content}</g>`
          : `<a href="${escapeXml(packageUrl(entry.name))}" target="_top">${content}</a>`,
      );
    });
  }
  body.push(footer(window, height - 49));
  return svgDocument({
    id: "download-ranking",
    title,
    description: `${warning ?? `The top ${shown.length} packages by recorded downloads, plus the remaining packages combined.`} ${window.start} to ${window.end}.`,
    width: 960,
    height,
    body: body.join("\n"),
  });
}

function historySvg(history, packageCount) {
  const title = "Has concentration changed?";
  const body = [
    titleBlock(
      title,
      `Complete calendar years · fixed cohort of today's ${packageCount} current libraries and CLIs`,
    ),
  ];
  const x = (index) =>
    86 + (history.length > 1 ? (index / (history.length - 1)) * 794 : 397);
  const y = (value) => 423 - (value / 100) * 243;
  for (const tick of [0, 20, 40, 60, 80, 100]) {
    body.push(
      line(86, y(tick), 880, y(tick)),
      label(74, y(tick) + 4, `${tick}%`, 11, MUTED, 'text-anchor="end"'),
    );
  }
  const metrics = [
    {
      key: "top20PercentDownloadShare",
      color: TEAL,
      caption: "Download share of the top fifth",
    },
    {
      key: "packageShareFor80Percent",
      color: AMBER,
      caption: "Package share needed to reach 80%",
    },
  ];
  metrics.forEach(({ key, color, caption }, metricIndex) => {
    body.push(
      line(
        86 + metricIndex * 368,
        145,
        111 + metricIndex * 368,
        145,
        color,
        'stroke-width="3"',
      ),
      label(120 + metricIndex * 368, 149, caption, 12, MUTED),
    );
    let previous = null;
    history.forEach((window, index) => {
      if (window[key] === null) {
        previous = null;
        return;
      }
      const point = { x: x(index), y: y(window[key]) };
      if (previous)
        body.push(
          line(
            previous.x,
            previous.y,
            point.x,
            point.y,
            color,
            'stroke-width="2.5"',
          ),
        );
      body.push(
        `<circle cx="${point.x}" cy="${point.y}" r="4" fill="${window.provisional ? "white" : color}" stroke="${color}" stroke-width="2"><title>${window.year}: ${escapeXml(caption)} ${percent(window[key])}${window.provisional ? "; provisional because the archive flags suspected zeros" : ""}</title></circle>`,
      );
      previous = point;
    });
  });
  history.forEach((window, index) => {
    body.push(
      label(x(index), 449, window.year, 11, MUTED, 'text-anchor="middle"'),
    );
    if (window.packagesFor80Percent === null)
      body.push(label(x(index), 469, "n/a", 10, AMBER, 'text-anchor="middle"'));
  });
  body.push(
    label(483, 483, "Calendar year", 12, MUTED, 'text-anchor="middle"'),
  );
  if (!history.some((window) => window.packagesFor80Percent !== null)) {
    body.push(
      label(
        483,
        297,
        "No complete calendar-year concentration is available.",
        16,
        MUTED,
        'text-anchor="middle"',
      ),
    );
  }
  body.push(
    label(
      40,
      504,
      "Today's cohort is held fixed; packages not yet published in an earlier year contribute known zeros.",
      12,
      MUTED,
    ),
    label(
      40,
      526,
      "The cohort is not a reconstruction of the portfolio in each year. A whole-package fifth is rounded up.",
      12,
      MUTED,
    ),
    label(
      40,
      548,
      "Gaps mean incomplete or zero totals. Hollow markers retain archive-flagged suspected shared-zero days.",
      12,
      MUTED,
    ),
  );
  return svgDocument({
    id: "download-concentration-history",
    title,
    description: `Download concentration for today's fixed cohort of ${packageCount} packages, using complete calendar years. Known prepublication periods contribute zero; missing observations create gaps.`,
    width: 960,
    height: 580,
    body: body.join("\n"),
  });
}

function buildDownloadCharts({ manifest, series }) {
  const excludedPackages = [];
  const contexts = [];
  for (const [name, entry] of Object.entries(manifest.packages).sort(
    ([left], [right]) => compareNames(left, right),
  )) {
    const reason =
      name === "@codsen/data"
        ? "generated-data"
        : entry.status !== "current"
          ? entry.status
          : !entry.includedInPortfolio
            ? "outside-portfolio"
            : entry.availability !== "available"
              ? entry.availability
              : null;
    if (reason) {
      excludedPackages.push({ name, reason });
      continue;
    }
    const start = coverageStart(entry, series[name]);
    contexts.push({
      name,
      rows: series[name],
      knownZeroBeforeDay:
        entry.firstPublishedDay === null
          ? null
          : entry.firstPublishedDay < start
            ? entry.firstPublishedDay
            : start,
    });
  }
  const names = new Set(contexts.map(({ name }) => name));
  const anomalies = manifest.anomalies.filter((entry) =>
    entry.packages.some((name) => names.has(name)),
  );
  const recent = periodSummary(
    contexts,
    anomalies,
    addDays(manifest.through, -364),
    manifest.through,
  );
  const history = [];
  const earliestYear = Math.min(
    ...contexts.map((context) =>
      Number(
        (
          context.knownZeroBeforeDay ??
          context.rows[0]?.day ??
          manifest.through
        ).slice(0, 4),
      ),
    ),
  );
  const firstYear = Math.max(
    Number(NPM_HISTORY_START.slice(0, 4)) + 1,
    earliestYear,
  );
  const lastYear =
    Number(manifest.through.slice(0, 4)) -
    (manifest.through.endsWith("-12-31") ? 0 : 1);
  for (let year = firstYear; year <= lastYear; year++) {
    const window = periodSummary(
      contexts,
      anomalies,
      `${year}-01-01`,
      `${year}-12-31`,
    );
    delete window.ranked;
    history.push({ year, ...window });
  }
  return {
    files: {
      "download-concentration.svg": concentrationSvg(recent),
      "download-ranking.svg": rankedSvg(recent),
      "download-concentration-history.svg": historySvg(
        history,
        contexts.length,
      ),
    },
    summary: {
      revision: manifest.revision,
      through: manifest.through,
      cohort:
        "Current, available libraries and CLIs included in the archive portfolio; excludes generated data and retired packages.",
      historyCohort:
        "The current cohort is fixed across calendar years. Known prepublication days count as zero. This does not reconstruct each year's portfolio.",
      metric:
        "Rank download totals descending, breaking ties by package name. Find the minimum whole-package count reaching at least 80%; the top fifth uses ceil(packageCount / 5). Missing observations make ratios unavailable; archive-flagged suspected zeros remain provisional.",
      excludedPackages,
      recent,
      history,
    },
  };
}

export { buildDownloadCharts };

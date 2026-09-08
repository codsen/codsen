interface Section {
  index: number;
  level: number;
  affected: boolean;
  retained: boolean;
  document: boolean;
}

export function findRemovedLines(
  lines: string[],
  extras: boolean,
  literalLines?: ReadonlySet<number>,
): Set<number> | undefined {
  let removed: Set<number> | undefined;
  for (let i = 0; i < lines.length; i += 1) {
    if (literalLines?.has(i)) continue;
    if (
      lines[i].startsWith("**Note:** Version bump only") ||
      (extras && lines[i].toLowerCase().includes("wip"))
    ) {
      if (!removed) removed = new Set();
      removed.add(i);
    }
  }
  // Ordinary changelogs need no section bookkeeping when nothing is removed.
  if (!removed) return;

  const sections: Section[] = [];
  let releaseSectionIndex = -1;
  const finishSection = (): void => {
    const section = sections.pop() as Section;
    if (releaseSectionIndex === sections.length) releaseSectionIndex = -1;
    const keep = section.retained || !section.affected || section.document;
    if (keep) removed.delete(section.index);
    else removed.add(section.index);

    if (sections.length) {
      const parent = sections[sections.length - 1];
      parent.affected ||= section.affected;
      // An untouched empty child heading must retain its original parent too.
      parent.retained ||= keep;
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const heading =
      !literalLines?.has(i) && /^ {0,3}(#{1,6})(?:[ \t]+|$)/.exec(lines[i]);
    if (heading) {
      // Generated logs can mix H1 and H2 release headings without nesting them.
      const level = heading[1].length;
      const release =
        level <= 2 &&
        /^\[?\d+\.\d+\.\d+(?:[-+][^\s\]]+)?(?:[\s\](]|$)/.test(
          lines[i].slice(heading[0].length),
        );
      if (release) {
        while (releaseSectionIndex !== -1) finishSection();
      }
      while (sections.length && sections[sections.length - 1].level >= level) {
        finishSection();
      }
      if (release) releaseSectionIndex = sections.length;
      sections.push({
        index: i,
        level,
        affected: removed.has(i),
        retained: false,
        document: i === 0 && level === 1 && !release,
      });
    } else if (sections.length) {
      const section = sections[sections.length - 1];
      if (removed.has(i)) section.affected = true;
      else if (lines[i].trim()) section.retained = true;
    }
  }
  while (sections.length) finishSection();
  return removed;
}

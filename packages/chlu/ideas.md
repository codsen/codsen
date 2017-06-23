# ideas

- [x] Fill missing diff links
- [ ] Detect and correct missing brackets
- [x] Detect order of links and insert new ones in correct order
- [x] Detect wrong repos in the URL's
- [x] Check all repo URL's are they in order
- [ ] Add an official Changelog header if its missing
- [ ] BIG Read git files, gather versions, wipe all titles and fill them matching versions and dates straight from GIT repo info
- [ ] If one entry has duplicate sections (like two "Added" sections), merge them.
- [ ] Detect non-international dates and convert to correct format
- [ ] Add diff links AND puts links on the 2nd title and onwards if all looks nice and clean
- [ ] Should support `"Unreleased"` sections
- [ ] Support yanked, like: `## 0.0.5 - 2014-12-13 - [YANKED]`
- [ ] Remove unused, non-existent links
- [ ] Fix heading tags of a wrong order. For example, if somebody uses version titles with H3 instead of H2
- [ ] Add missing title "All notable changes.." as per keepachangelog.com

---

# testing

- [ ] check if supports x.x versions. Even mixed with normal semver.
- [x] check if inserts above or below the footer links, correctly matching existing order
- [x] test if two missing links can be added:
  - last two
  - random two
- [ ] support both uppercase and lowercase file names
- [ ] check does it work on Linux where case-sensitive file systems might be used and `chlu` algorithm might be looking for the files in a wrong case

---

FIY
https://github.com/guigrpa/storyboard/blob/master/CHANGELOG.md
https://github.com/guigrpa/giu/blob/master/CHANGELOG.md

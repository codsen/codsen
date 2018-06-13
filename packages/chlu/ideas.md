# ideas

- [ ] Add missing title "All notable changes.." as per keepachangelog.com
- [ ] MAJOR: Read git files, gather versions, wipe all titles and fill them matching versions and dates straight from GIT repo info
- [ ] If one entry has duplicate sections (like two "Added" sections), merge them.
- [ ] Should support `"Unreleased"` sections
- [ ] Fix heading tags of a wrong order. For example, if somebody uses version titles with H3 instead of H2
- [ ] BUG? - Text in titles after the date is being removed.

# testing

- [ ] check if supports x.x versions. Even mixed with normal semver.
- [ ] support both uppercase and lowercase file names. Check does it work on Linux where case-sensitive file systems might be used and `chlu` algorithm might be looking for the files in a wrong case

# done

- [x] Fill missing diff links
- [x] Detect and correct missing brackets
- [x] Detect order of links and insert new ones in correct order
- [x] Detect wrong repos in the URL's
- [x] Check all repo URL's are they in order
- [x] Detect non-international dates and convert to correct format
- [x] Support yanked, like: `## 0.0.5 - 2014-12-13 - [YANKED]`
- [x] Remove unused, non-existent footer links
- [x] Remove _any_ unused markdown links from the footer
- [x] Add diff links AND puts links on the 2nd title and onwards if all looks nice and clean
- [x] Correct existing footer links. For example, when `1.2.0` footer link is diffing between `1.0.0` and `1.1.0`.
- [x] Support emoji in titles
- [x] check if inserts above or below the footer links, correctly matching existing order
- [x] test if two missing links can be added:
  - last two
  - random two

---

FIY
https://github.com/guigrpa/storyboard/blob/master/CHANGELOG.md
https://github.com/guigrpa/giu/blob/master/CHANGELOG.md

# ideas

* Fill missing diff links
* Detect and correct missing brackets
* Detect order of links and insert new ones in correct order
* Detect wrong repos in the URL's
* Check all repo URL's are they in order
* Add an official Changelog header if its missing
* Read git files and fill/fix dates
* Read git files and fill all missing minor/major versions, just create entries with placeholder "Minor/major changes"
* If one entry has duplicate sections (like two "Added" sections), merge them.
* Detect non-international dates and convert to correct format

---

# testing

* check if supports x.x versions. Even mixed with normal semver.
* check if inserts above or below the footer links, correctly matching existing order.
* test if two missing links can be added:
  - last two
  - random two
* support \[unreleased]
* support both uppercase and lowercase file names

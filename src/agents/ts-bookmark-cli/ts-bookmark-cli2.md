Create a TypeScript CLI application using Bun.js and Citty to manage browser bookmarks. This application will include features for removing duplicates, organizing bookmarks, and optionally caching offline copies with full-text indexing and searching. 

It should use github.com/unjs/citty for arg parsing, and allow for automatically removing duplicates (based on title or url), sorting, and organize them by topics, tags, or urls.

It should also have the option of using readability-cli to cache offline copies and perform full-text indexing and searching.

It should allow for importing and exporting from a variety of sources and content types, including - but not limited to:

- Google Chrome HTML bookmarks file
- Mozilla Firefox json backup file
- Github Stars
- Storing and syncing with an github repository
- Importing and exporting to markdown files
- using unstorage as a backing store
- using a duckdb database as a backing store
- using sqlite as a backing store
- using postgresql as a backing store
- using FUSE to create a virtual file system that can be browsed and searched.


It should also allow for full-text indexing, embedding, and searching.

It should allow for importing and exporting to a json file with the following example structure:

```json
{
  "version": 2,
  "reference": "https://github.com/1nfiniteloop/json-bookmarks",
  "bookmarks": [
    {
      "title": "Example url",
      "url": "https://example.com",
      "tags": ["example-tag", "example-2"],
      "path": "/${BOOKMARKS_BAR}/Example Folder/ Example subfolder"
    },    {
      "title": "Second Example url",
      "url": "https://example.com",
      "tags": ["example-tag-2", "second-example-2"],
      "path": "/${BOOKMARKS_BAR}/Second Example Folder/ Example subfolder"
    },
   ...
]}
```

It should use github.com/nitrojs/nitro (https://nitro.build/) as an interface to browsing all of those bookmarks.

It should use wxt.dev (https://github.com/wxt-dev/wxt) to create a web extension interface and a browser sidebar (and full tab UI with searching, deleting, tagging, drag-and-drop organizing, etc).
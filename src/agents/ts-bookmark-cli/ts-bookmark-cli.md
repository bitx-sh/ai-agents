You are tasked with creating a TypeScript CLI application using Bun.js and Citty to manage browser bookmarks. Follow these instructions carefully to implement the project:

1. Project Setup:
Create a new directory for your project named <project_name>{{PROJECT_NAME}}</project_name>. Initialize a new Bun.js project in this directory by running `bun init` and following the prompts.

2. Install Dependencies:
Install the required dependencies by running the following command:
```
bun add citty @types/node readability-cli unstorage @unjs/nitro wxt
```

3. Project Structure:
Create the following directory structure for your project:
```
{{PROJECT_NAME}}/
├── src/
│   ├── commands/
│   │   ├── import.ts
│   │   ├── export.ts
│   │   ├── organize.ts
│   │   ├── search.ts
│   │   └── cache.ts
│   ├── utils/
│   │   ├── bookmarkManager.ts
│   │   ├── storage.ts
│   │   └── fullTextSearch.ts
│   ├── types/
│   │   └── bookmark.ts
│   ├── interfaces/
│   │   ├── nitro.ts
│   │   └── wxt.ts
│   └── index.ts
├── tests/
├── package.json
└── tsconfig.json
```

4. Implement Core Functionality:
In the `src/utils/bookmarkManager.ts` file, implement the core functionality for managing bookmarks. Include the following features:

<features>
{{FEATURES}}
</features>

Ensure that all functions are properly typed and use async/await for asynchronous operations.

5. Create CLI Commands:
Implement the CLI commands in the `src/commands/` directory using Citty. Create separate command files for import, export, organize, search, and cache operations. Each command should utilize the core functionality from the bookmarkManager.

6. Implement Storage Options:
In the `src/utils/storage.ts` file, implement different storage options using unstorage. Include support for:
- Local file system
- GitHub repository
- DuckDB
- SQLite
- PostgreSQL

Ensure that the storage implementation is flexible and can be easily switched between different backends.

7. Full-text Indexing and Searching:
Implement full-text indexing and searching functionality in the `src/utils/fullTextSearch.ts` file. Use a suitable library like MiniSearch or FlexSearch for this purpose. Integrate this functionality with the bookmark management system.

8. Nitro.js Interface:
Create a Nitro.js interface for browsing bookmarks in the `src/interfaces/nitro.ts` file. Implement routes and handlers for displaying and interacting with bookmarks. Ensure that this interface can access and manipulate bookmarks using the core functionality you've implemented.

9. WXT Browser Extension:
Develop a browser extension using WXT in the `src/interfaces/wxt.ts` file. Implement the following features:
- Sidebar for quick access to bookmarks
- Full tab UI for advanced management
- Search functionality
- Tagging and organizing bookmarks
- Drag-and-drop interface

Ensure that the browser extension can communicate with the core bookmark management system.

10. Testing:
Write unit tests for core functionality and CLI commands in the `tests/` directory. Use a testing framework compatible with Bun.js, such as Jest or Mocha. Ensure good test coverage for all major features and edge cases.

11. Documentation:
Create a README.md file in the project root directory. Include the following sections:
- Project description
- Installation instructions
- Usage guide for CLI commands
- Instructions for setting up the Nitro.js interface
- Guide for installing and using the browser extension

12. Final Steps:
- Ensure all code is properly typed and follows TypeScript best practices.
- Implement error handling and input validation throughout the application.
- Optimize performance, especially for large numbers of bookmarks.
- Consider implementing a plugin system for easy extension of functionality.

Throughout the implementation, keep the following in mind:
- Use github.com/unjs/citty for argument parsing in CLI commands.
- Implement automatic duplicate removal based on title or URL.
- Allow for sorting and organizing bookmarks by topics, tags, or URLs.
- Use readability-cli to cache offline copies of bookmarks when requested.
- Support importing and exporting from various sources, including:
  - Google Chrome HTML bookmarks file
  - Mozilla Firefox JSON backup file
  - GitHub Stars
  - Markdown files
- Implement full-text indexing, embedding, and searching capabilities.
- Support importing and exporting to a JSON file with the specified structure.
- Use github.com/nitrojs/nitro (https://nitro.build/) for the web interface.
- Use wxt.dev (https://github.com/wxt-dev/wxt) for creating the browser extension.

Remember to use async/await for asynchronous operations and handle errors appropriately. Test your application thoroughly with various bookmark sources and ensure it works correctly with different storage backends.

After implementing each major feature or component, use the following format to document your progress:

<progress>
Implemented: [Feature or component name]
Status: [Complete/Partial/In Progress]
Notes: [Any important details or considerations]
</progress>

This will help track the development process and ensure all required features are implemented.
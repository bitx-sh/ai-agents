You are tasked with creating a TypeScript CLI application using Bun.js and Citty to manage browser bookmarks. This application will include various features for organizing and managing bookmarks, as well as optional advanced functionality. Follow these instructions to implement the project:

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
In the `src/utils/bookmarkManager.ts` file, implement the core functionality for managing bookmarks, including:

<features>
{{FEATURES}}
</features>

5. Create CLI Commands:
Implement the CLI commands in the `src/commands/` directory using Citty. Create separate command files for import, export, organize, search, and cache operations.

6. Implement Storage Options:
In the `src/utils/storage.ts` file, implement different storage options using unstorage. Include support for:
- Local file system
- GitHub repository
- DuckDB
- SQLite
- PostgreSQL

7. Full-text Indexing and Searching:
Implement full-text indexing and searching functionality in the `src/utils/fullTextSearch.ts` file. Use a suitable library like MiniSearch or FlexSearch for this purpose.

8. Nitro.js Interface:
Create a Nitro.js interface for browsing bookmarks in the `src/interfaces/nitro.ts` file. Implement routes and handlers for displaying and interacting with bookmarks.

9. WXT Browser Extension:
Develop a browser extension using WXT in the `src/interfaces/wxt.ts` file. Implement the following features:
- Sidebar for quick access to bookmarks
- Full tab UI for advanced management
- Search functionality
- Tagging and organizing bookmarks
- Drag-and-drop interface

10. Testing:
Write unit tests for core functionality and CLI commands in the `tests/` directory. Use a testing framework compatible with Bun.js, such as Jest or Mocha.

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

Remember to use async/await for asynchronous operations and handle errors appropriately. Test your application thoroughly with various bookmark sources and ensure it works correctly with different storage backends. Once you have completed the project, you can publish it as an open-source tool for managing bookmarks effectively (including renovate rules and github actions).


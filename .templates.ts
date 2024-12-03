// generator.templates.js
export const codeTemplates = {

  // Full Stack Application Template
  fullStackApp: {
    structure: {
      prompt: `Generate a full-stack application with the following structure:
        /frontend
          /src
            /components
            /pages
            /features
            /api
            /utils
            /hooks
            /styles
        /backend
          /src
            /controllers
            /services
            /models
            /middleware
            /utils
            /config
        /shared
          /types
          /constants
          /utils
        
        Include:
        1. API route handling
        2. Database integration
        3. Authentication system
        4. Error handling
        5. Logging
        6. Testing setup
        7. Documentation
        
        Base implementation on analyzed repositories but modernize where appropriate.`,

    exampleApiRoute: `import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createItemSchema } from '../schemas/item';

const router = Router();

router.get('/items', authenticate, async (req, res) => {
  try {
    const items = await ItemService.findAll({
      userId: req.user.id,
      ...req.query
    });
    res.json(items);
  } catch (error) {
    logger.error('Failed to fetch items:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      requestId: req.id 
    });
  }
});

router.post('/items', 
  authenticate, 
  validate(createItemSchema),
  async (req, res) => {
    try {
      const item = await ItemService.create({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(item);
    } catch (error) {
      logger.error('Failed to create item:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        requestId: req.id 
      });
    }
});`,

    exampleService: `import { DatabaseError } from '../errors';
import { Item, ItemCreateInput } from '../types';
import { db } from '../config/database';

export class ItemService {
  static async findAll(params: {
    userId: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<Item[]> {
    const { userId, page = 1, limit = 10, sort = 'createdAt:desc' } = params;
    
    try {
      const [sortField, sortOrder] = sort.split(':');
      
      const items = await db.item.findMany({
        where: { userId },
        orderBy: { [sortField]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });
      
      return items;
    } catch (error) {
      throw new DatabaseError('Failed to fetch items', { cause: error });
    }
  }

  static async create(input: ItemCreateInput): Promise<Item> {
    try {
      const item = await db.item.create({
        data: input,
      });
      
      return item;
    } catch (error) {
      throw new DatabaseError('Failed to create item', { cause: error });
    }
  }
}`
  },

  // CLI Tool Template
  cliTool: {
    structure: {
      prompt: `Generate a modern CLI tool with the following structure:
        /src
          /commands        # Individual command implementations
          /utils          # Shared utilities
          /config         # Configuration management
          /templates      # Templates for generation
        /test            # Test files
        /docs            # Documentation
        
        Include:
        1. Command parsing
        2. Interactive prompts
        3. Error handling
        4. Logging system
        5. Configuration management
        6. Testing setup
        
        Base implementation on analyzed repositories but modernize where appropriate.`,

    exampleCommand: `import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import { logger } from '../utils/logger';
import { Config } from '../config';

export const initCommand = new Command('init')
  .description('Initialize a new project')
  .option('-t, --template <type>', 'project template to use')
  .option('-n, --name <name>', 'project name')
  .action(async (options) => {
    try {
      // Get project details through interactive prompt if not provided
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is your project name?',
          when: !options.name,
          validate: (input) => input.length > 0,
        },
        {
          type: 'list',
          name: 'template',
          message: 'Which template would you like to use?',
          when: !options.template,
          choices: Config.getTemplates(),
        },
      ]);

      const spinner = createSpinner('Initializing project...').start();

      // Combine CLI options and prompt answers
      const projectConfig = {
        name: options.name || answers.name,
        template: options.template || answers.template,
      };

      // Initialize project
      await initializeProject(projectConfig);

      spinner.success({ text: chalk.green('Project initialized successfully!') });
      
      // Show next steps
      console.log(
        chalk.blue('\nNext steps:'),
      );
    } catch (error) {
      logger.error('Failed to initialize project:', error);
      process.exit(1);
    }`
  });

async function initializeProject(config) {
  // Implementation of project initialization
  // This would include:
  // 1. Creating directory structure
  // 2. Copying template files
  // 3. Customizing configuration
  // 4. Installing dependencies
}'
  },

  // NPM Package Template
  npmPackage: {
    structure: {
      prompt: `Generate an NPM package with the following structure:
        /src
          /core           # Core functionality
          /utils          # Utility functions
          /types          # TypeScript types
        /test            # Test files
        /examples        # Usage examples
        /docs            # Documentation
        
        Include:
        1. TypeScript configuration
        2. Build system
        3. Testing setup
        4. Documentation generation
        5. Release workflow
        6. Example implementations
        
        Base implementation on analyzed repositories but modernize where appropriate.`,

    examplePackage: `{
  "name": "package-name",
  "version": "1.0.0",
  "description": "Package description",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "docs": "typedoc",
    "prepublishOnly": "npm run build",
    "release": "npm run test && npm run build && changeset publish"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@changesets/cli": "^2.26.2",
    "@types/node": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^5.62.0",
    "@typescript-eslint/parser": "^5.62.0",
    "eslint": "^8.45.0",
    "tsup": "^7.1.0",
    "typedoc": "^0.24.8",
    "typescript": "^5.1.6",
    "vitest": "^0.33.0"
  },
  "publishConfig": {
    "access": "public"
  }
}`,

    exampleConfig: `// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
});`
  }
};

// Add to generator.config.js
export const generatorConfig = defineConfig({
  systemPrompt: `You are an expert code generator specialized in creating modern JavaScript/TypeScript applications. Your tasks include:

  1. Analyzing requirements and existing patterns
  2. Generating complete, production-ready code
  3. Following best practices and modern standards
  4. Providing comprehensive documentation
  5. Implementing testing and quality assurance

  For each generation task:
  1. Review the requirements carefully
  2. Select appropriate templates and patterns
  3. Customize implementation based on analyzed repositories
  4. Ensure code quality and maintainability
  5. Generate complete documentation
  6. Include testing setup
  
  Maintain focus on:
  - Modern development practices
  - Type safety
  - Testing coverage
  - Documentation quality
  - Performance optimization
  - Security best practices`,

  templates: codeTemplates,
  
  // Generation strategies for different project types
  strategies: {
    componentLibrary: {
      analyzers: ['typescript', 'react', 'styling', 'testing'],
      qualityChecks: ['types', 'tests', 'docs', 'stories'],
      outputFormats: ['typescript', 'javascript']
    },
    fullStackApp: {
      analyzers: ['frontend', 'backend', 'database', 'api'],
      qualityChecks: ['security', 'performance', 'tests', 'docs'],
      outputFormats: ['typescript', 'javascript']
    },
    cliTool: {
      analyzers: ['commands', 'interaction', 'filesystem'],
      qualityChecks: ['usability', 'tests', 'docs'],
      outputFormats: ['typescript', 'javascript']
    },
    npmPackage: {
      analyzers: ['api', 'compatibility', 'dependencies'],
      qualityChecks: ['types', 'tests', 'docs', 'bundle-size'],
      outputFormats: ['typescript', 'javascript']
    }
  }
});

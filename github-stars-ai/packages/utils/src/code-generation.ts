/**
 * @file Code Generation Utilities
 * @module @github-stars-ai/utils/code-generation
 */

import { z } from "zod";
import { CodePattern, RepoAnalysis } from "./code-analysis";

/**
 * Code generation template schema
 */
export const TemplateSchema = z.object({
  name: z.string(),
  description: z.string(),
  structure: z.record(z.string()),
  files: z.array(z.object({
    path: z.string(),
    content: z.string(),
    description: z.string(),
  })),
  dependencies: z.record(z.string()),
  scripts: z.record(z.string()),
  configuration: z.record(z.unknown()),
});

export type Template = z.infer<typeof TemplateSchema>;

/**
 * Generation request schema
 */
export const GenerationRequestSchema = z.object({
  type: z.enum(['component', 'utility', 'application', 'library']),
  language: z.string(),
  framework: z.string().optional(),
  description: z.string(),
  features: z.array(z.string()),
  patterns: z.array(z.string()),
  requirements: z.record(z.string()),
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;

/**
 * Generated code schema
 */
export const GeneratedCodeSchema = z.object({
  name: z.string(),
  description: z.string(),
  files: z.array(z.object({
    path: z.string(),
    content: z.string(),
    language: z.string(),
  })),
  setup: z.object({
    dependencies: z.record(z.string()),
    devDependencies: z.record(z.string()),
    scripts: z.record(z.string()),
    configuration: z.record(z.unknown()),
  }),
  documentation: z.object({
    setup: z.string(),
    usage: z.string(),
    examples: z.array(z.string()),
    notes: z.array(z.string()),
  }),
});

export type GeneratedCode = z.infer<typeof GeneratedCodeSchema>;

/**
 * Base templates for different project types
 */
export const baseTemplates: Record<string, Partial<Template>> = {
  typescript: {
    structure: {
      src: 'Source code directory',
      test: 'Test files directory',
      docs: 'Documentation directory',
    },
    files: [
      {
        path: 'package.json',
        content: JSON.stringify({
          type: 'module',
          scripts: {
            build: 'bun build ./src/index.ts --outdir ./dist',
            test: 'bun test',
            lint: 'biome check .',
          },
        }, null, 2),
        description: 'Package configuration',
      },
      {
        path: 'tsconfig.json',
        content: JSON.stringify({
          compilerOptions: {
            target: 'ESNext',
            module: 'ESNext',
            moduleResolution: 'bundler',
            types: ['bun-types'],
          },
        }, null, 2),
        description: 'TypeScript configuration',
      },
    ],
    dependencies: {
      typescript: 'latest',
      'bun-types': 'latest',
    },
  },
  // Add more base templates as needed
};

/**
 * Merge patterns into a template
 */
export function mergePatternWithTemplate(
  template: Template,
  patterns: CodePattern[],
  analysis: RepoAnalysis
): Template {
  // Implement template merging logic
  return {
    ...template,
    files: [
      ...template.files,
      ...patterns.map(pattern => ({
        path: `src/${pattern.name}`,
        content: pattern.implementation,
        description: pattern.description,
      })),
    ],
    dependencies: {
      ...template.dependencies,
      ...analysis.dependencies,
    },
  };
}

/**
 * Generate package.json content
 */
export function generatePackageJson(
  name: string,
  description: string,
  setup: GeneratedCode['setup']
): string {
  return JSON.stringify({
    name,
    description,
    type: 'module',
    version: '0.1.0',
    scripts: setup.scripts,
    dependencies: setup.dependencies,
    devDependencies: setup.devDependencies,
    ...setup.configuration,
  }, null, 2);
}

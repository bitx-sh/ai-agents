/**
 * @file Configuration System
 * @module @github-stars-ai/config
 */

import { createDefineConfig } from 'c12';
import { destr } from 'destr';
import { createContext } from 'unctx';
import { z } from 'zod';
import { defineConfig as defineBaseConfig } from '@langchain/core/config';
import type { ConfigContext } from './types';

/**
 * Configuration context
 */
export const configContext = createContext<ConfigContext>('config');

/**
 * Base configuration schema
 */
export const BaseConfigSchema = z.object({
  /**
   * Environment name
   */
  env: z.enum(['development', 'production', 'test']).default('development'),

  /**
   * Debug mode
   */
  debug: z.boolean().default(false),

  /**
   * API Keys and authentication
   */
  auth: z.object({
    anthropicApiKey: z.string(),
    githubToken: z.string(),
  }),

  /**
   * Vector store configuration
   */
  vectorStore: z.object({
    type: z.enum(['typesense', 'memory']).default('memory'),
    typesense: z
      .object({
        apiKey: z.string(),
        nodes: z.array(
          z.object({
            host: z.string(),
            port: z.number(),
            protocol: z.string(),
          })
        ),
        connectionTimeoutSeconds: z.number().default(10),
      })
      .optional(),
  }),

  /**
   * Agent configurations
   */
  agents: z.object({
    manager: z.object({
      model: z.string().default('claude-3-sonnet-20240229'),
      temperature: z.number().min(0).max(1).default(0.7),
      maxTokens: z.number().positive().default(4096),
      systemPrompt: z.string(),
    }),
    retriever: z.object({
      model: z.string().default('claude-3-sonnet-20240229'),
      temperature: z.number().min(0).max(1).default(0.7),
      maxTokens: z.number().positive().default(4096),
      systemPrompt: z.string(),
      maxConcurrency: z.number().positive().default(5),
      maxPages: z.number().positive().default(10),
      perPage: z.number().positive().default(100),
    }),
    analyzer: z.object({
      model: z.string().default('claude-3-sonnet-20240229'),
      temperature: z.number().min(0).max(1).default(0.7),
      maxTokens: z.number().positive().default(4096),
      systemPrompt: z.string(),
    }),
    generator: z.object({
      model: z.string().default('claude-3-sonnet-20240229'),
      temperature: z.number().min(0).max(1).default(0.7),
      maxTokens: z.number().positive().default(4096),
      systemPrompt: z.string(),
    }),
  }),

  /**
   * Workflow configuration
   */
  workflow: z.object({
    maxRetries: z.number().positive().default(3),
    timeout: z.number().positive().default(300000), // 5 minutes
    checkpointInterval: z.number().positive().default(60000), // 1 minute
  }),
});

export type BaseConfig = z.infer<typeof BaseConfigSchema>;

/**
 * Configuration options
 */
export interface ConfigOptions {
  /**
   * Configuration name/scope
   */
  name?: string;

  /**
   * Configuration file path
   */
  configFile?: string;

  /**
   * Default values
   */
  defaults?: Partial<BaseConfig>;

  /**
   * Whether to validate against schema
   */
  validate?: boolean;

  /**
   * Environment variables prefix
   */
  envPrefix?: string;
}

/**
 * Load configuration
 */
export async function loadConfig(
  options: ConfigOptions = {}
): Promise<BaseConfig> {
  const {
    name = 'default',
    configFile = 'config/config',
    defaults = {},
    validate = true,
    envPrefix = 'GITHUB_STARS_AI_',
  } = options;

  const configurator = createConfigurator({
    name,
    defaults: {
      ...defaults,
      env: process.env.NODE_ENV || 'development',
      debug: destr(process.env.DEBUG),
      auth: {
        anthropicApiKey: process.env[`${envPrefix}ANTHROPIC_API_KEY`],
        githubToken: process.env[`${envPrefix}GITHUB_TOKEN`],
      },
    },
    configFile,
  });

  const { config } = await configurator.load();

  if (validate) {
    return BaseConfigSchema.parse(config);
  }

  return config as BaseConfig;
}

/**
 * Define configuration with type safety
 */
export function defineConfig<T extends BaseConfig>(
  config: T | (() => T | Promise<T>)
): T | (() => T | Promise<T>) {
  return defineBaseConfig(config);
}

/**
 * @file Configuration system for GitHub Stars AI
 * @module @github-stars-ai/config
 */

import { createConfigurator } from "c12";
import { destr } from "destr";
import { z } from "zod";

/**
 * Base configuration schema shared across all agents
 */
export const BaseConfigSchema = z.object({
  /**
   * Agent name/identifier
   */
  name: z.string(),

  /**
   * Claude model identifier
   */
  model: z.string().default("claude-3-5-sonnet-20241022"),

  /**
   * Model temperature (0-1)
   */
  temperature: z.number().min(0).max(1).default(0.7),

  /**
   * Maximum tokens for model response
   */
  maxTokens: z.number().positive().default(4096),

  /**
   * System prompt for the agent
   */
  systemPrompt: z.string(),

  /**
   * Optional metadata
   */
  meta: z.record(z.unknown()).optional(),
});

/**
 * Base configuration type derived from schema
 */
export type BaseConfig = z.infer<typeof BaseConfigSchema>;

/**
 * Configuration options for loading agent configs
 */
export interface ConfigOptions {
  /**
   * Name of the agent to load config for
   */
  name: string;

  /**
   * Optional config file path override
   */
  configFile?: string;

  /**
   * Default values to merge
   */
  defaults?: Partial<BaseConfig>;

  /**
   * Whether to validate against schema
   */
  validate?: boolean;
}

/**
 * Load and validate agent configuration
 */
export async function loadAgentConfig<T extends BaseConfig = BaseConfig>({
  name,
  configFile,
  defaults = {},
  validate = true,
}: ConfigOptions): Promise<T> {
  const configurator = createConfigurator({
    name,
    defaults: {
      ...defaults,
      name,
    },
    configFile,
  });

  const { config } = await configurator.load();
  const parsed = destr(config);

  if (validate) {
    return BaseConfigSchema.parse(parsed) as T;
  }

  return parsed as T;
}

/**
 * Create a typed configuration loader for a specific agent type
 */
export function createConfigLoader<T extends BaseConfig>(schema: z.ZodType<T>) {
  return async (options: Omit<ConfigOptions, "validate">) => {
    const config = await loadAgentConfig({
      ...options,
      validate: false,
    });

    return schema.parse(config);
  };
}

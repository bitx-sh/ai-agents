/**
 * @file Configuration Types
 * @module @github-stars-ai/config/types
 */

import type { BaseConfig } from './index';

/**
 * Configuration context type
 */
export interface ConfigContext {
  /**
   * Current configuration
   */
  config: BaseConfig;

  /**
   * Load configuration
   */
  load: (options?: {
    name?: string;
    configFile?: string;
    validate?: boolean;
  }) => Promise<BaseConfig>;

  /**
   * Get configuration value
   */
  get: <T = unknown>(key: string, defaultValue?: T) => T;

  /**
   * Set configuration value
   */
  set: <T = unknown>(key: string, value: T) => void;
}

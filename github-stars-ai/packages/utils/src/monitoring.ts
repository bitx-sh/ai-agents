/**
 * @file Performance Monitoring
 */

import { consola } from "consola";
import { performance } from "node:perf_hooks";

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = [];

  static start(operation: string, metadata?: Record<string, unknown>) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.metrics.push({
        operation,
        duration,
        timestamp: Date.now(),
        metadata,
      });

      if (process.env.DEBUG) {
        consola.debug(
          `Operation "${operation}" completed in ${duration.toFixed(2)}ms`,
          metadata
        );
      }
    };
  }

  static async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const end = this.start(operation, metadata);
    try {
      const result = await fn();
      end();
      return result;
    } catch (error) {
      end();
      throw error;
    }
  }

  static getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  static clear(): void {
    this.metrics = [];
  }
}

/**
 * @file Error Handling
 */

export class BaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      metadata: this.metadata,
    };
  }
}

export class ConfigurationError extends BaseError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "CONFIGURATION_ERROR", metadata);
  }
}

export class GitHubError extends BaseError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "GITHUB_ERROR", metadata);
  }
}

export class VectorStoreError extends BaseError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "VECTOR_STORE_ERROR", metadata);
  }
}

export class WorkflowError extends BaseError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "WORKFLOW_ERROR", metadata);
  }
}

export class GenerationError extends BaseError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, "GENERATION_ERROR", metadata);
  }
}

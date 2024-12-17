# Project Context and Requirements Summary

SYSTEM ROLE: You are a senior TypeScript developer specializing in AI/LLM systems, specifically working with LangGraph.js, Anthropic's Claude, and GitHub integrations. You have deep knowledge of modern TypeScript practices, Bun.js, and hierarchical AI agent architectures.

USER GOAL: Create a hierarchical AI agent system that analyzes GitHub stars and generates new code based on learned patterns.

PROJECT OVERVIEW:
A TypeScript-based system using Bun.js that implements a team of hierarchical AI agents using LangGraph.js to retrieve, analyze, and generate code based on a user's GitHub stars. The system uses Claude-3-sonnet-20240229 for all agents and includes vector store integration for pattern analysis.

CORE COMPONENTS IMPLEMENTED:
1. Base Project Structure:
   - Workspace-based monorepo using Bun
   - Packages: config, agents, utils, workflow
   - Modern TypeScript/ESNext configuration
   - Biome.js for linting
   - C12/ConfBox for configuration

2. Agent System:
   - Manager Agent: Coordinates workflow and planning
   - Retriever Agent: Handles GitHub API interactions
   - Analyzer Agent: Processes and categorizes content
   - Generator Agent: Creates new code from patterns

3. Core Infrastructure:
   - Vector store implementation (Typesense/in-memory)
   - GitHub API integration
   - Configuration system
   - CLI interface with rich features

4. Build System:
   - Bun-based build pipeline
   - Docker support
   - GitHub Actions CI/CD
   - Binary packaging

COMPONENTS IN PROGRESS/REMAINING:
1. Testing Infrastructure:
   - Complete test coverage for agents
   - Integration test scenarios
   - Performance testing

2. Documentation:
   - API documentation completion
   - Advanced usage examples
   - Deployment guides

3. Features:
   - Enhanced pattern recognition
   - Advanced code generation templates
   - Workflow visualization
   - Progress tracking

TECHNICAL SPECIFICATIONS:
- Language: TypeScript (Latest)
- Runtime: Bun.js
- LLM: Claude-3-sonnet-20240229
- Vector Store: Typesense/In-memory
- Key Dependencies:
  - @langchain/anthropic
  - @langchain/community
  - @langchain/langgraph
  - typesense
  - citty
  - consola

ARCHITECTURE:
```typescript
interface SystemArchitecture {
  config: {
    type: 'c12-based-configuration';
    features: ['environment-handling', 'validation', 'schema-support'];
  };
  agents: {
    manager: {
      role: 'workflow-coordinator';
      responsibilities: ['task-planning', 'delegation', 'oversight'];
    };
    retriever: {
      role: 'data-collector';
      responsibilities: ['github-interaction', 'initial-processing'];
    };
    analyzer: {
      role: 'pattern-recognizer';
      responsibilities: ['code-analysis', 'categorization', 'insight-generation'];
    };
    generator: {
      role: 'code-creator';
      responsibilities: ['pattern-implementation', 'documentation', 'testing'];
    };
  };
  workflow: {
    type: 'hierarchical-state-machine';
    features: ['state-management', 'error-handling', 'checkpointing'];
  };
}
```

CURRENT CHALLENGES:
1. Optimizing vector store performance for large codebases
2. Improving pattern recognition accuracy
3. Enhancing code generation quality
4. Managing agent communication efficiency

NEXT STEPS:
1. Complete testing infrastructure
2. Enhance error handling and recovery
3. Implement advanced pattern recognition
4. Add workflow visualization
5. Complete documentation

EXAMPLE USAGE:
```typescript
import { createWorkflow } from '@github-stars-ai/workflow';
import { loadConfig } from '@github-stars-ai/config';

async function analyzeStars() {
  const config = await loadConfig();
  const workflow = createWorkflow(config);

  const result = await workflow.execute({
    username: 'example-user',
    request: 'Analyze TypeScript utility libraries and generate a new date manipulation library',
  });

  console.log(result);
}
```

SPECIAL INSTRUCTIONS:
1. Maintain strict typing throughout the system
2. Use only Bun.js APIs (avoid Node.js-specific features)
3. Follow modern ESNext practices
4. Ensure all configurations are shareable and flat-file based
5. Implement comprehensive error handling
6. Focus on production-ready code quality

DEVELOPMENT GUIDELINES:
1. Use workspace-relative imports
2. Implement thorough error handling
3. Add detailed JSDoc comments
4. Include unit tests for all features
5. Maintain consistent code style (Biome)
6. Follow functional programming principles where appropriate

This project aims to create a sophisticated AI-powered code analysis and generation system that learns from GitHub stars to create new, high-quality code implementations. The system should be both powerful and user-friendly, suitable for both CLI and programmatic usage.

END OF SUMMARY

When continuing this project, please acknowledge this summary and specify which component you'll be working on. Maintain consistency with the established patterns and architecture while implementing new features or enhancing existing ones.

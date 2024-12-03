/**
 * @file Generator Agent Implementation
 * @module @github-stars-ai/agents/generator
 */

import { HumanMessage } from "@langchain/core/messages";
import { BaseAgent, BaseAgentConfig, StateAnnotation } from "./base";
import { 
  GenerationRequest,
  GeneratedCode,
  Template,
  baseTemplates,
  mergePatternWithTemplate,
  generatePackageJson,
} from "#utils/code-generation";
import { CodePattern, RepoAnalysis } from "#utils/code-analysis";

export interface GeneratorConfig extends BaseAgentConfig {
  templates?: Record<string, Template>;
}

/**
 * Generator Agent responsible for creating new code
 */
export class GeneratorAgent extends BaseAgent {
  private templates: Record<string, Template>;

  constructor(config: GeneratorConfig) {
    super({
      ...config,
      name: 'generator',
      systemPrompt: `You are an expert code generator responsible for:
1. Creating new code based on analyzed patterns
2. Implementing modern best practices
3. Ensuring code quality and maintainability
4. Providing comprehensive documentation
5. Generating complete project structures

Generate code that reflects the best aspects of analyzed repositories while maintaining innovation.`,
    });

    this.templates = {
      ...baseTemplates,
      ...config.templates,
    };
  }

  async execute(state: typeof StateAnnotation.State) {
    try {
      const { 
        patterns,
        analysis,
        request,
      } = state.metadata as {
        patterns: CodePattern[];
        analysis: Record<string, RepoAnalysis>;
        request: GenerationRequest;
      };

      // Select appropriate template
      const template = this.selectTemplate(request);

      // Generate code structure
      const structureResponse = await this.chat([
        new HumanMessage(`
          Create a project structure based on this request and patterns:
          Request: ${JSON.stringify(request, null, 2)}
          Patterns: ${JSON.stringify(patterns, null, 2)}
          Template: ${JSON.stringify(template, null, 2)}

          Generate a complete project structure including:
          1. Directory layout
          2. File organization
          3. Component relationships
          4. Configuration files

          Return a structured project template.
        `),
      ]);

      const projectStructure = JSON.parse(structureResponse.content[0].text);

      // Generate implementation
      const implementationResponse = await this.chat([
        new HumanMessage(`
          Generate implementation code based on:
          Structure: ${JSON.stringify(projectStructure, null, 2)}
          Patterns: ${JSON.stringify(patterns, null, 2)}
          Analysis: ${JSON.stringify(analysis, null, 2)}
          Requirements: ${JSON.stringify(request.requirements, null, 2)}

          For each file:
          1. Generate complete, working code
          2. Include documentation
          3. Follow best practices
          4. Implement error handling
          5. Add tests where appropriate

          Return a complete generated code object.
        `),
      ]);

      const generatedCode: GeneratedCode = JSON.parse(
        implementationResponse.content[0].text
      );

      // Generate documentation
      const documentationResponse = await this.chat([
        new HumanMessage(`
          Create comprehensive documentation for:
          ${JSON.stringify(generatedCode, null, 2)}

          Include:
          1. Setup instructions
          2. Usage examples
          3. API documentation
          4. Best practices
          5. Common patterns
          6. Testing approach

          Return enhanced documentation object.
        `),
      ]);

      const documentation = JSON.parse(documentationResponse.content[0].text);

      // Combine everything into final output
      const finalCode: GeneratedCode = {
        ...generatedCode,
        documentation: {
          ...generatedCode.documentation,
          ...documentation,
        },
      };

      return {
        ...state,
        status: 'generation_complete',
        metadata: {
          ...state.metadata,
          generatedCode: finalCode,
        },
        messages: [
          ...state.messages,
          structureResponse,
          implementationResponse,
          documentationResponse,
        ],
      };
    } catch (error) {
      return this.handleError(error as Error, state);
    }
  }

  /**
   * Select appropriate template based on request
   */
  private selectTemplate(request: GenerationRequest): Template {
    let template = this.templates[request.language.toLowerCase()];
    
    if (!template) {
      template = this.templates.typescript; // Default to TypeScript
    }

    if (request.framework && this.templates[request.framework.toLowerCase()]) {
      template = {
        ...template,
        ...this.templates[request.framework.toLowerCase()],
      };
    }

    return template;
  }

  /**
   * Generate file content based on template and patterns
   */
  private async generateFileContent(
    path: string,
    template: string,
    patterns: CodePattern[],
    request: GenerationRequest
  ): Promise<string> {
    const response = await this.chat([
      new HumanMessage(`
        Generate code for ${path} based on:
        Template: ${template}
        Patterns: ${JSON.stringify(patterns, null, 2)}
        Requirements: ${JSON.stringify(request, null, 2)}

        Create complete, working code that:
        1. Follows the template structure
        2. Implements required functionality
        3. Uses identified patterns
        4. Includes documentation
        5. Handles errors appropriately

        Return only the code content.
      `),
    ]);

    return response.content[0].text;
  }
}

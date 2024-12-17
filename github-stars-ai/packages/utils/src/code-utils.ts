/**
 * @file Code Generation Utilities
 */

import { parse, print } from "@babel/core";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { format } from "prettier";

export interface CodeTransformOptions {
  parser?: "typescript" | "babel";
  prettier?: boolean;
}

export async function transformCode(
  code: string,
  options: CodeTransformOptions = {}
): Promise<string> {
  const { parser = "typescript", prettier = true } = options;

  // Parse code
  const ast = parse(code, {
    parser: parser === "typescript" ? require("@babel/parser").parse : undefined,
    plugins: ["typescript"],
    sourceType: "module",
  });

  if (!ast) throw new Error("Failed to parse code");

  // Generate code
  const output = generate(ast, {
    retainLines: true,
    compact: false,
  });

  // Format with prettier if requested
  if (prettier) {
    return format(output.code, {
      parser: "typescript",
      semi: true,
      singleQuote: true,
      trailingComma: "es5",
    });
  }

  return output.code;
}

export function extractImports(code: string): string[] {
  const ast = parse(code, {
    sourceType: "module",
  });

  if (!ast) return [];

  const imports: string[] = [];

  // Visit all import declarations
  traverse(ast, {
    ImportDeclaration(path) {
      imports.push(path.node.source.value);
    },
  });

  return imports;
}

export function generateTypeDefinitions(
  code: string
): Promise<string> {
  // Implementation for generating type definitions
  // This would typically use the TypeScript compiler API
  // For now, we'll return a placeholder
  return Promise.resolve("// Type definitions");
}

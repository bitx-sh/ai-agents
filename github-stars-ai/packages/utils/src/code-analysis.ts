/**
 * @file Code Analysis Utilities
 * @module @github-stars-ai/utils/code-analysis
 */

import { Document } from "@langchain/core/documents";
import { z } from "zod";

/**
 * Code pattern schema
 */
export const CodePatternSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  language: z.string(),
  implementation: z.string(),
  usage: z.string(),
  context: z.string(),
  benefits: z.array(z.string()),
  considerations: z.array(z.string()),
  sourceRepo: z.string(),
  sourcePath: z.string(),
});

export type CodePattern = z.infer<typeof CodePatternSchema>;

/**
 * Repository analysis schema
 */
export const RepoAnalysisSchema = z.object({
  patterns: z.array(CodePatternSchema),
  architecture: z.object({
    type: z.string(),
    components: z.array(z.string()),
    relationships: z.array(z.object({
      from: z.string(),
      to: z.string(),
      type: z.string(),
    })),
  }),
  dependencies: z.record(z.string()),
  bestPractices: z.array(z.string()),
  codeExamples: z.array(z.object({
    title: z.string(),
    description: z.string(),
    code: z.string(),
    language: z.string(),
    path: z.string(),
  })),
});

export type RepoAnalysis = z.infer<typeof RepoAnalysisSchema>;

/**
 * Extract code patterns from documents
 */
export function extractCodePatterns(docs: Document[]): CodePattern[] {
  const patterns: CodePattern[] = [];
  
  for (const doc of docs) {
    if (doc.metadata.fileType === 'code') {
      const pattern = {
        name: doc.metadata.fileName,
        description: '',
        category: doc.metadata.category || 'unknown',
        language: doc.metadata.language || 'unknown',
        implementation: doc.pageContent,
        usage: '',
        context: '',
        benefits: [],
        considerations: [],
        sourceRepo: doc.metadata.repoName,
        sourcePath: doc.metadata.path,
      };
      
      patterns.push(pattern);
    }
  }
  
  return patterns;
}

/**
 * Group documents by repository
 */
export function groupDocumentsByRepo(docs: Document[]): Record<string, Document[]> {
  return docs.reduce((groups, doc) => {
    const repoName = doc.metadata.repoName;
    if (!groups[repoName]) {
      groups[repoName] = [];
    }
    groups[repoName].push(doc);
    return groups;
  }, {} as Record<string, Document[]>);
}

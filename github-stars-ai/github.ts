/**
 * @file GitHub API Client
 * @module @github-stars-ai/utils/github
 */

import { Octokit } from '@octokit/rest';
//import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
//import { Document } from '@langchain/core/documents';
import { z } from 'zod';

/**
 * Repository metadata schema
 */
export const RepoMetadataSchema = z.object({
  id: z.number(),
  name: z.string(),
  fullName: z.string(),
  description: z.string().nullable(),
  url: z.string().url(),
  stars: z.number(),
  topics: z.array(z.string()),
  language: z.string().nullable(),
  languages: z.record(z.number()),
  readme: z.string().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
  license: z.string().nullable(),
  size: z.number(),
  defaultBranch: z.string(),
});

export type RepoMetadata = z.infer<typeof RepoMetadataSchema>;

/**
 * GitHub API client configuration
 */
export interface GitHubClientConfig {
  token: string;
  maxConcurrency?: number;
  maxPages?: number;
  perPage?: number;
}

/**
 * Enhanced GitHub API client
 */
export class GitHubClient {
  private octokit: Octokit;
  private config: GitHubClientConfig;

  constructor(config: GitHubClientConfig) {
    this.config = {
      maxConcurrency: 5,
      maxPages: 10,
      perPage: 100,
      ...config,
    };
    this.octokit = new Octokit({ auth: config.token });
  }

  /**
   * Get starred repositories for a user
   */
  async getStarredRepos(username: string): Promise<RepoMetadata[]> {
    const { maxPages, perPage } = this.config;
    let repos: RepoMetadata[] = [];
    let page = 1;

    while (page <= maxPages) {
      try {
        const response = await this.octokit.activity.listReposStarredByUser({
          username,
          per_page: perPage,
          page,
        });

        if (response.data.length === 0) break;

        const repoData = await Promise.all(
          response.data.map(async (repo) => {
            const [readme, languages] = await Promise.all([
              this.getReadme(repo.full_name),
              this.getLanguages(repo.full_name),
            ]);

            return RepoMetadataSchema.parse({
              id: repo.id,
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              url: repo.html_url,
              stars: repo.stargazers_count,
              topics: repo.topics || [],
              language: repo.language,
              languages,
              readme,
              updatedAt: repo.updated_at,
              createdAt: repo.created_at,
              license: repo.license?.spdx_id || null,
              size: repo.size,
              defaultBranch: repo.default_branch,
            });
          })
        );

        repos = repos.concat(repoData);
        page++;
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        break;
      }
    }

    return repos;
  }

  /**
   * Load repository content using LangChain's GithubRepoLoader
   */
  // async loadRepoContent(repoUrl: string): Promise<Document[]> {
  //   const loader = new GithubRepoLoader(repoUrl, {
  //     branch: "main",
  //     recursive: false,
  //     unknown: "warn",
  //     maxConcurrency: this.config.maxConcurrency,
  //   });

  //   return await loader.load();
  // }

  private async getReadme(repoFullName: string): Promise<string | null> {
    try {
      const [owner, repo] = repoFullName.split('/');
      const { data } = await this.octokit.repos.getReadme({
        owner,
        repo,
      });
      return Buffer.from(data.content, 'base64').toString('utf8');
    } catch (error) {
      return null;
    }
  }

  private async getLanguages(repoFullName: string): Promise<Record<string, number>> {
    try {
      const [owner, repo] = repoFullName.split('/');
      const { data } = await this.octokit.repos.listLanguages({
        owner,
        repo,
      });
      return data;
    } catch (error) {
      return {};
    }
  }
}

/**
 * @file GitHub Client Mock
 */

import { RepoMetadata } from "#utils/github";

export class MockGitHubClient {
  private mockRepos: RepoMetadata[] = [
    {
      id: 1,
      name: "test-repo-1",
      fullName: "test-user/test-repo-1",
      description: "Test repository 1",
      url: "https://github.com/test-user/test-repo-1",
      stars: 100,
      topics: ["typescript", "testing"],
      language: "TypeScript",
      languages: { TypeScript: 1000 },
      readme: "# Test Repo 1\nThis is a test repository.",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      license: "MIT",
      size: 1000,
      defaultBranch: "main",
    },
    // Add more mock repositories
  ];

  async getStarredRepos(username: string): Promise<RepoMetadata[]> {
    return this.mockRepos;
  }

  async loadRepoContent(repoUrl: string) {
    return [{
      pageContent: "Test content",
      metadata: {
        source: repoUrl,
      },
    }];
  }

  setMockRepos(repos: RepoMetadata[]) {
    this.mockRepos = repos;
  }
}

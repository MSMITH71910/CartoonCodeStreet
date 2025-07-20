import { Project } from "../data/projects";

interface ScreenshotResponse {
  url: string;
  status: "success" | "error";
  message?: string;
}

interface GithubRepoInfo {
  name: string;
  description: string;
  owner: string;
  defaultBranch: string;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  lastUpdated: string;
  language: string;
  homepage: string;
}

export class ScreenshotService {
  private static readonly GITHUB_API_BASE = "https://api.github.com";
  private static readonly SCREENSHOT_API = "https://screenshot-api.example.com"; // Replace with actual screenshot service
  private static screenshotCache: Map<string, string> = new Map();

  /**
   * Extract repository owner and name from GitHub URL
   */
  static parseGithubUrl(githubUrl: string): { owner: string; repo: string } | null {
    if (!githubUrl) {
      return null;
    }
    
    try {
      // Remove trailing slash if present
      const url = githubUrl.endsWith("/") ? githubUrl.slice(0, -1) : githubUrl;
      
      // Extract the path from the URL
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      // Split the path and extract owner and repo
      const parts = path.split("/").filter(Boolean);
      
      if (parts.length >= 2) {
        return {
          owner: parts[0],
          repo: parts[1],
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error parsing GitHub URL:", error);
      return null;
    }
  }

  /**
   * Get repository information from GitHub API
   */
  static async getRepositoryInfo(owner: string, repo: string): Promise<GithubRepoInfo | null> {
    try {
      const response = await fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        name: data.name,
        description: data.description,
        owner: data.owner.login,
        defaultBranch: data.default_branch,
        stargazersCount: data.stargazers_count,
        forksCount: data.forks_count,
        openIssuesCount: data.open_issues_count,
        lastUpdated: data.updated_at,
        language: data.language,
        homepage: data.homepage,
      };
    } catch (error) {
      console.error(`Error fetching repository info for ${owner}/${repo}:`, error);
      return null;
    }
  }

  /**
   * Generate a screenshot of a GitHub repository
   */
  static async generateScreenshot(githubUrl: string): Promise<string | null> {
    // Check if screenshot is already in cache
    if (this.screenshotCache.has(githubUrl)) {
      return this.screenshotCache.get(githubUrl) || null;
    }
    
    // Parse GitHub URL to get owner and repo
    const repoInfo = this.parseGithubUrl(githubUrl);
    
    if (!repoInfo) {
      console.error("Invalid GitHub URL:", githubUrl);
      return null;
    }
    
    try {
      // GitHub repository screenshot placeholder
      const placeholderUrl = `https://opengraph.githubassets.com/1/${repoInfo.owner}/${repoInfo.repo}`;
      
      // Cache the screenshot URL
      this.screenshotCache.set(githubUrl, placeholderUrl);
      
      return placeholderUrl;
    } catch (error) {
      console.error(`Error generating screenshot for ${githubUrl}:`, error);
      return null;
    }
  }

  /**
   * Generate a screenshot of a live website
   */
  static async generateLiveScreenshot(url: string): Promise<string | null> {
    if (!url) return null;

    // Check cache first
    if (this.screenshotCache.has(url)) {
      return this.screenshotCache.get(url) || null;
    }

    try {
      // For now, using a free screenshot service
      const placeholderUrl = `https://image.thum.io/get/width/1200/crop/800/noanimate/${encodeURIComponent(url)}`;
      
      this.screenshotCache.set(url, placeholderUrl);
      return placeholderUrl;
    } catch (error) {
      console.error(`Error generating screenshot for ${url}:`, error);
      return null;
    }
  }

  /**
   * Get screenshot for a project (prioritizes URL over GitHub URL)
   */
  static async getProjectScreenshot(project: Project): Promise<string | null> {
    // Try to get live URL first
    if (project.url) {
      return this.generateLiveScreenshot(project.url);
    }

    // Fall back to GitHub screenshot if no URL available
    if (project.githubUrl) {
      return this.generateScreenshot(project.githubUrl);
    }

    return null;
  }

  /**
   * Get screenshots for multiple projects
   */
  static async getProjectScreenshots(projects: Project[]): Promise<Map<string, string>> {
    const screenshotMap = new Map<string, string>();
    
    const screenshotPromises = projects.map(async (project) => {
      const screenshot = await this.getProjectScreenshot(project);
      if (screenshot) {
        screenshotMap.set(project.id, screenshot);
      }
    });
    
    await Promise.all(screenshotPromises);
    
    return screenshotMap;
  }

  /**
   * Clear the screenshot cache
   */
  static clearCache(): void {
    this.screenshotCache.clear();
  }
}

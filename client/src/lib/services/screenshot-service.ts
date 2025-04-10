import { Project } from "../data/projects";

// Define the interfaces for the screenshot data
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

// Service for generating and retrieving screenshots of GitHub repositories
export class ScreenshotService {
  // Base URL for GitHub API
  private static readonly GITHUB_API_BASE = "https://api.github.com";
  
  // Service to generate screenshot of repository
  private static readonly SCREENSHOT_API = "https://screenshot-api.replit-example.com"; // Will be replaced with actual service
  
  // Local cache for screenshots to avoid redundant fetches
  private static screenshotCache: Map<string, string> = new Map();
  
  /**
   * Extract repository owner and name from GitHub URL
   * @param githubUrl GitHub repository URL
   * @returns Object containing owner and repo name, or null if invalid URL
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
   * @param owner Repository owner
   * @param repo Repository name
   * @returns Promise resolving to repository information
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
   * @param githubUrl GitHub repository URL
   * @returns Promise resolving to screenshot URL
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
      // For now, we'll use a placeholder image generation service
      // In a real implementation, this would call a screenshot API
      
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
   * Get screenshot for a project
   * @param project Project object containing GitHub URL
   * @returns Promise resolving to screenshot URL
   */
  static async getProjectScreenshot(project: Project): Promise<string | null> {
    if (!project.githubUrl) {
      return null;
    }
    
    return this.generateScreenshot(project.githubUrl);
  }
  
  /**
   * Get screenshots for multiple projects
   * @param projects Array of project objects
   * @returns Promise resolving to map of project IDs to screenshot URLs
   */
  static async getProjectScreenshots(projects: Project[]): Promise<Map<string, string>> {
    const screenshotMap = new Map<string, string>();
    
    // Process projects in parallel using Promise.all
    const screenshotPromises = projects.map(async (project) => {
      if (project.githubUrl) {
        const screenshot = await this.generateScreenshot(project.githubUrl);
        if (screenshot) {
          screenshotMap.set(project.id, screenshot);
        }
      }
    });
    
    // Wait for all screenshots to be generated
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
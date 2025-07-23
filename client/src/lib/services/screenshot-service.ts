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
   * Generate a placeholder image with project info
   */
  static generatePlaceholderImage(url: string, title: string): string {
    // Create a data URL for a simple placeholder image
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
      gradient.addColorStop(0, '#1E40AF');
      gradient.addColorStop(0.5, '#3B82F6');
      gradient.addColorStop(1, '#60A5FA');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 800);
      
      // Add some decorative elements
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(200, 150, 100, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(1000, 650, 150, 0, Math.PI * 2);
      ctx.fill();
      
      // Main container background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      if (ctx.roundRect) {
        ctx.roundRect(100, 200, 1000, 400, 20);
      } else {
        ctx.fillRect(100, 200, 1000, 400);
      }
      ctx.fill();
      
      // Title text
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, 600, 320);
      
      // "Live Site Preview" text
      ctx.fillStyle = '#6B7280';
      ctx.font = '28px system-ui, -apple-system, sans-serif';
      ctx.fillText('🌐 Live Site Preview', 600, 380);
      
      // URL text
      ctx.fillStyle = '#3B82F6';
      ctx.font = '24px system-ui, -apple-system, sans-serif';
      const displayUrl = url.length > 50 ? url.substring(0, 47) + '...' : url;
      ctx.fillText(displayUrl, 600, 430);
      
      // Click instruction
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '20px system-ui, -apple-system, sans-serif';
      ctx.fillText('Click to visit the live site', 600, 500);
      
      // Browser-like frame
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 2;
      if (ctx.roundRect) {
        ctx.roundRect(100, 200, 1000, 400, 20);
      } else {
        ctx.strokeRect(100, 200, 1000, 400);
      }
      ctx.stroke();
      
      // Browser dots
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(130, 230, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(155, 230, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(180, 230, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return canvas.toDataURL('image/png');
  }

  /**
   * Test if a screenshot service URL works
   */
  static async testScreenshotService(screenshotUrl: string): Promise<boolean> {
    try {
      const response = await fetch(screenshotUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Generate a screenshot of a live website
   */
  static async generateLiveScreenshot(url: string, title: string = 'Project'): Promise<string | null> {
    if (!url) return null;

    // Check cache first
    if (this.screenshotCache.has(url)) {
      return this.screenshotCache.get(url) || null;
    }

    try {
      console.log(`Generating screenshot for: ${url}`);
      
      // For now, generate a placeholder image with project info
      // This ensures screenshots always work while we can implement real screenshot services later
      const placeholderImage = this.generatePlaceholderImage(url, title);
      
      console.log(`Generated placeholder image for: ${title}`);
      
      this.screenshotCache.set(url, placeholderImage);
      return placeholderImage;
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
      return this.generateLiveScreenshot(project.url, project.title);
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

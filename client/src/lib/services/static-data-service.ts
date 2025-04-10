import { Project } from "../data/projects";

/**
 * Service to load project data from static JSON files
 * This is used for Netlify deployment where the backend server isn't available
 */
export class StaticDataService {
  /**
   * Load projects from static JSON file
   * @returns Promise resolving to array of projects
   */
  static async loadProjects(): Promise<Project[]> {
    try {
      // Attempt to fetch the static projects data file
      const response = await fetch('/data/projects.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load projects: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cast the positions back to tuples since JSON doesn't preserve them
      return data.map((project: any) => ({
        ...project,
        position: project.position as [number, number, number],
      }));
    } catch (error) {
      console.error('Error loading static project data:', error);
      
      // Return empty array in case of error
      return [];
    }
  }
  
  /**
   * Save projects to local storage (used for demo purposes)
   * @param projects Array of projects to save
   */
  static saveProjectsToLocalStorage(projects: Project[]): void {
    try {
      localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects to local storage:', error);
    }
  }
  
  /**
   * Load projects from local storage (used for demo purposes)
   * @returns Array of projects or null if none found
   */
  static loadProjectsFromLocalStorage(): Project[] | null {
    try {
      const data = localStorage.getItem('portfolio_projects');
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      
      // Cast the positions back to tuples
      return parsed.map((project: any) => ({
        ...project,
        position: project.position as [number, number, number],
      }));
    } catch (error) {
      console.error('Error loading projects from local storage:', error);
      return null;
    }
  }
}
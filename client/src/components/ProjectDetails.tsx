import { useEffect, useState } from "react";
import { Project } from "../lib/data/projects";
import { cn } from "../lib/utils";
import { ScreenshotService } from "../lib/services/screenshot-service";
import { useIsMobile } from "../hooks/use-is-mobile";

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetails = ({ project, onClose }: ProjectDetailsProps) => {
  const isMobile = useIsMobile();
  
  // State for storing the screenshot URL
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
 // Fetch screenshot when component mounts
useEffect(() => {
  const fetchScreenshot = async () => {
    setIsLoading(true);
    setError(null);
    
    console.log(`Fetching screenshot for project: ${project.title}`);
    console.log(`Project URL: ${project.url}`);
    console.log(`Project GitHub URL: ${project.githubUrl}`);
    
    try {
      // Try to get screenshot for the project (will prioritize URL over GitHub URL)
      const screenshot = await ScreenshotService.getProjectScreenshot(project);
      console.log(`Screenshot result for ${project.title}:`, screenshot);
      
      if (screenshot) {
        setScreenshotUrl(screenshot);
      } else {
        setError("No screenshot available");
      }
    } catch (err) {
      console.error("Error fetching screenshot:", err);
      setError("Failed to load project screenshot");
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchScreenshot();
}, [project]);

  // Add escape key listener to close the project details
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className={`bg-white dark:bg-gray-800 rounded-lg ${isMobile ? 'p-4 m-2' : 'p-6 m-4'} ${isMobile ? 'max-w-sm w-full' : 'max-w-4xl w-full'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}>
            {project.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Project Screenshot */}
          {(project.url || project.githubUrl) && (
  <div className="relative overflow-hidden rounded-lg shadow-md mb-6">
    {isLoading ? (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 h-64 w-full animate-pulse">
        <svg className="w-10 h-10 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
        </svg>
      </div>
    ) : error ? (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 h-64 w-full">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>{error}</p>
        </div>
      </div>
    ) : screenshotUrl ? (
      <a 
        href={project.url || project.githubUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block transition-transform duration-300 hover:scale-105"
      >
        <img 
          src={screenshotUrl} 
          alt={`${project.title} screenshot`} 
          className="w-full h-auto object-cover"
          loading="lazy"
          onError={(e) => {
            console.error(`Failed to load screenshot image: ${screenshotUrl}`);
            setError("Screenshot failed to load");
            setScreenshotUrl(null);
          }}
          onLoad={() => {
            console.log(`Screenshot loaded successfully: ${screenshotUrl}`);
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 text-center">
          Click to view {project.url ? "Live Site" : "on GitHub"}
        </div>
      </a>
    ) : null}
  </div>
)}
        
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <span 
                key={index} 
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
            
            {project.features && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Features</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {project.features.map((feature, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {project.challenges && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Challenges</h3>
                <p className="text-gray-700 dark:text-gray-300">{project.challenges}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Prominent buttons section with GitHub and Live Site buttons */}
        <div className={`mt-6 flex ${isMobile ? 'flex-col' : 'flex-wrap'} gap-4 justify-center`}>
          {/* Always show Live Site button */}
          <a
            href={project.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center rounded-md font-medium shadow-lg transition-all duration-200 ease-in-out",
              isMobile ? "px-4 py-2 text-base" : "px-6 py-3 text-lg",
              project.url 
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl transform hover:-translate-y-1" 
                : "bg-gray-400 text-white cursor-not-allowed opacity-70"
            )}
            onClick={e => !project.url && e.preventDefault()}
          >
            <span className="mr-2">🌐</span>
            View Live Site
            <svg xmlns="http://www.w3.org/2000/svg" className={`ml-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          
          {/* Always show GitHub button */}
          <a
            href={project.githubUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center rounded-md font-medium shadow-lg transition-all duration-200 ease-in-out",
              isMobile ? "px-4 py-2 text-base" : "px-6 py-3 text-lg",
              project.githubUrl 
                ? "bg-gray-800 hover:bg-gray-900 text-white hover:shadow-xl transform hover:-translate-y-1" 
                : "bg-gray-400 text-white cursor-not-allowed opacity-70"
            )}
            onClick={e => !project.githubUrl && e.preventDefault()}
          >
            <span className="mr-2">💻</span>
            View on GitHub
            <svg xmlns="http://www.w3.org/2000/svg" className={`ml-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className={cn(
              "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
              "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
            )}
          >
            Back to Street
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

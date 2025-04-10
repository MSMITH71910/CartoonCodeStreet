export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  features?: string[];
  challenges?: string;
  url?: string;
  githubUrl?: string;
  color?: string; // House color for identification
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Trip-App",
    description: "A full-featured travel planning application with itinerary management, destination guides, and budget tracking.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
    features: [
      "User authentication and profiles",
      "Destination search and filtering",
      "Itinerary planning and management",
      "Budget tracking and expense management",
      "Travel recommendations and tips"
    ],
    challenges: "Creating an intuitive user interface while handling complex trip planning scenarios and integration with multiple travel APIs.",
    url: "https://example.com/tripapp",
    githubUrl: "https://github.com/myusername/trip-app",
    color: "#E53935" // Red
  },
  {
    id: "2",
    title: "Link-Plant",
    description: "A modern link organization tool that allows users to create visually appealing link collections for sharing multiple resources.",
    technologies: ["JavaScript", "Node.js", "MongoDB", "Express"],
    features: [
      "Custom link organization",
      "Shareable profile pages",
      "Analytics and click tracking",
      "Customizable themes",
      "Mobile-friendly design"
    ],
    challenges: "Designing a fast, responsive application that handles thousands of links while maintaining a simple user experience.",
    githubUrl: "https://github.com/myusername/link-plant",
    color: "#1E88E5" // Blue
  },
  {
    id: "3",
    title: "My_Link_Shortener_Web-app",
    description: "A URL shortening service that creates compact, trackable links from long URLs with comprehensive analytics.",
    technologies: ["React", "Firebase", "Express", "Node.js"],
    features: [
      "URL shortening",
      "QR code generation",
      "Click analytics and tracking",
      "Custom short links",
      "Link expiration options"
    ],
    url: "https://example.com/linkshortener",
    githubUrl: "https://github.com/myusername/link-shortener",
    color: "#43A047" // Green
  },
  {
    id: "4",
    title: "Simplefolio",
    description: "A clean, responsive portfolio template for developers and designers to showcase their work and skills.",
    technologies: ["React", "Sass", "Bootstrap", "JavaScript"],
    features: [
      "Responsive design",
      "Project showcases",
      "Skills section",
      "Contact form",
      "Easy customization"
    ],
    challenges: "Creating a portfolio template that's both visually appealing and simple enough for developers to customize for their own needs.",
    githubUrl: "https://github.com/myusername/simplefolio",
    color: "#8E24AA" // Purple
  },
  {
    id: "5",
    title: "Movies-App",
    description: "A movie discovery application that helps users find, explore, and track films across multiple streaming platforms.",
    technologies: ["Vue.js", "Express", "PostgreSQL", "Movie Database API"],
    features: [
      "Movie search and discovery",
      "Watchlist management",
      "Ratings and reviews",
      "Streaming service availability",
      "Personalized recommendations"
    ],
    url: "https://example.com/moviesapp",
    githubUrl: "https://github.com/myusername/movies-app",
    color: "#FB8C00" // Orange
  }
];

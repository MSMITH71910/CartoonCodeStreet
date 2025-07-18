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
    title: "crwn-clothing",
    description: "An e-commerce web application for clothing, featuring a modern design and robust functionality.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
    features: [
      "User authentication and profiles",
      "Destination search and filtering",
      "Itinerary planning and management",
      "Budget tracking and expense management",
      "Travel recommendations and tips"
    ],
    challenges: "Creating an intuitive user interface that allows users to easily maneuver through the online shopping experience. Ensuring smooth integration between the front-end and back-end systems was also challenging due to the complexity of managing inventory and payment gateways in a large online store.",
    url: "https://crwn-clothing-msmith71910.netlify.app/",
    githubUrl: "https://github.com/MSMITH71910/crwn-clothing",
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
    url: "https://smithmportfolio.netlify.app/#about",
    githubUrl: "https://github.com/MSMITH71910/simplefolio",
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

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
    title: "Clips Angular Gamer Site",
    description: "A gaming video sharing platform built with Angular, allowing gamers to upload, share, and discover gaming clips and highlights.",
    technologies: ["Angular", "TypeScript", "Firebase", "RxJS", "Angular Material"],
    features: [
      "Video upload and streaming",
      "User authentication and profiles",
      "Gaming clip categorization",
      "Social features and comments",
      "Responsive design for all devices"
    ],
    challenges: "Implementing efficient video streaming and handling large file uploads while maintaining smooth user experience across different devices and network conditions.",
    url: "https://clipsangulargamersite.netlify.app/",
    githubUrl: "https://github.com/MSMITH71910/Clips_Angular_Gamer_site",
    color: "#1E88E5" // Blue
  },
  {
    id: "3",
    title: "Itch.IO - MS71910.io",
    description: "I craft immersive, interactive experiences that blend technical skill with playful creativity. My Game Portfolio showcases a range of Projects- from nostalgic arcade-style games to experimental prototypes—each built to solve unique design challenges and deliver joy to players.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Unity", "Godot Engine","Game Development"],
    features: [
      "Professional portfolio showcase",
      "Playable game demos",
      "Technical Diversity",
      "Responsive design",
      "Creative game projects"
    ],
    challenges: "Creating a professional online presence that effectively communicates skills and services while maintaining fast loading times and excellent user experience.",
    url: "https://ms71910.itch.io/",
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
    title: "Joke Teller App",
    description: "An interactive web application that delivers jokes using text-to-speech technology, providing entertainment with voice narration.",
    technologies: ["JavaScript", "HTML5", "CSS3", "Web Speech API", "Joke API"],
    features: [
      "Random joke generation",
      "Text-to-speech functionality",
      "Interactive user interface",
      "Responsive design",
      "Voice controls and settings"
    ],
    challenges: "Integrating the Web Speech API effectively while ensuring cross-browser compatibility and creating an engaging user experience with smooth voice narration.",
    url: "https://msmith71910.github.io/joke-teller/",
    githubUrl: "https://github.com/MSMITH71910/joke-teller",
    color: "#FB8C00" // Orange
  }
];

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  features?: string[];
  challenges?: string;
  url?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with product management, shopping cart, and secure checkout flow.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
    features: [
      "User authentication and profiles",
      "Product catalog with search and filtering",
      "Shopping cart and wishlist functionality",
      "Secure payment processing with Stripe",
      "Order history and tracking"
    ],
    challenges: "Implementing a secure and intuitive checkout process while handling payment gateway integration was challenging but rewarding.",
    url: "https://example.com/ecommerce"
  },
  {
    id: "2",
    title: "Weather Dashboard",
    description: "An interactive weather dashboard that provides real-time weather data and forecasts for any location.",
    technologies: ["JavaScript", "OpenWeather API", "Chart.js", "Geolocation API"],
    features: [
      "Current weather conditions",
      "5-day forecast",
      "Interactive weather maps",
      "Location search and favorites",
      "Weather alerts and notifications"
    ],
    challenges: "Optimizing the performance of the application while fetching and displaying large amounts of weather data in real-time."
  },
  {
    id: "3",
    title: "Task Management App",
    description: "A collaborative task management application designed to help teams organize, track, and complete projects efficiently.",
    technologies: ["React", "Firebase", "Material UI", "React DnD"],
    features: [
      "Kanban board interface",
      "Real-time updates and collaboration",
      "Task assignment and deadline tracking",
      "File attachments and comments",
      "Progress reporting and analytics"
    ],
    url: "https://example.com/taskmanager"
  },
  {
    id: "4",
    title: "Fitness Tracker",
    description: "A comprehensive fitness tracking application that helps users monitor their workouts, nutrition, and progress toward health goals.",
    technologies: ["React Native", "GraphQL", "MongoDB", "D3.js"],
    features: [
      "Workout planning and tracking",
      "Nutrition and calorie counting",
      "Progress visualization with charts",
      "Goal setting and achievements",
      "Integration with wearable devices"
    ],
    challenges: "Creating a seamless cross-platform experience while handling complex health data visualization and integration with external devices."
  },
  {
    id: "5",
    title: "Social Media Dashboard",
    description: "A unified dashboard for managing and analyzing multiple social media accounts from a single interface.",
    technologies: ["Vue.js", "Express", "PostgreSQL", "Social Media APIs"],
    features: [
      "Multi-platform post scheduling",
      "Analytics and performance metrics",
      "Audience insights and engagement tracking",
      "Content calendar and planning tools",
      "Automated reporting"
    ],
    url: "https://example.com/socialdashboard"
  },
  {
    id: "6",
    title: "Virtual Event Platform",
    description: "A virtual event platform for hosting conferences, webinars, and workshops with interactive features for attendees.",
    technologies: ["React", "WebRTC", "Socket.io", "Node.js"],
    features: [
      "Live streaming and recording",
      "Virtual networking and breakout rooms",
      "Interactive Q&A and polling",
      "Exhibitor booths and sponsor showcases",
      "Attendee engagement tracking"
    ],
    challenges: "Building a robust real-time communication system that could handle hundreds of concurrent users while maintaining video and audio quality."
  }
];

# How to Edit Your Portfolio Project Information

All the project information displayed on the signs and in the popup windows is stored in a single file. To update this information with your own projects, follow these instructions.

## Step 1: Open the projects data file

The file is located at: `client/src/lib/data/projects.ts`

## Step 2: Edit the project information

For each project, you can modify the following fields:

- `title`: The name displayed on the house sign
- `description`: A brief overview of the project
- `technologies`: List of technologies used in the project
- `features`: Bullet points of key features (optional)
- `challenges`: Description of challenges faced (optional)
- `url`: Link to the live site (optional)
- `githubUrl`: Link to the GitHub repository (optional)
- `color`: House color in hex format

## Example Project Template

Here's a template you can use for each project:

```typescript
{
  id: "1", // Keep this unique for each project
  title: "YOUR PROJECT NAME", // This appears on the house sign
  description: "A detailed description of your project - what it does, its purpose, etc.",
  technologies: ["Technology 1", "Technology 2", "Technology 3"],
  features: [
    "Key feature 1",
    "Key feature 2",
    "Key feature 3",
    "Key feature 4",
    "Key feature 5"
  ],
  challenges: "Describe the main challenges you faced when building this project and how you overcame them.",
  url: "https://your-live-project-url.com", // Live site URL
  githubUrl: "https://github.com/yourusername/your-repo", // GitHub repository URL
  color: "#E53935" // Color code for the house (red, blue, green, purple, orange)
}
```

## Available Colors

- Red: `#E53935`
- Blue: `#1E88E5`
- Green: `#43A047`
- Purple: `#8E24AA`
- Orange: `#FB8C00`
- Cyan: `#00ACC1`
- Deep Purple: `#5E35B1`
- Teal: `#00897B`
- Deep Orange: `#F4511E`

## Important Notes

1. Keep the `id` values sequential and unique
2. The `title` field is what appears on the house sign
3. For long titles, the text will automatically resize to fit the sign
4. The `url` and `githubUrl` fields determine whether the "Live Site" and "GitHub" buttons are active
5. After editing the file, save it and refresh the page to see your changes

## Example: Updating the "Trip-App" Project

Replace:

```typescript
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
}
```

With your actual project information:

```typescript
{
  id: "1",
  title: "Travel Buddy", // Your actual project name
  description: "An all-in-one travel companion that helps users plan trips, discover local attractions, and manage their travel budget seamlessly.",
  technologies: ["React", "Firebase", "Google Maps API", "Material UI"],
  features: [
    "Personalized travel itineraries",
    "Real-time weather forecasts",
    "Interactive maps with points of interest",
    "Expense tracking in multiple currencies",
    "Offline access to travel documents"
  ],
  challenges: "Integrating multiple third-party APIs while maintaining a smooth user experience and ensuring the application works reliably without internet connection.",
  url: "https://travel-buddy-app.com",
  githubUrl: "https://github.com/yourusername/travel-buddy",
  color: "#E53935" // Red
}
```
# Project Editing Guide

This guide explains how to edit your project information in the 3D Portfolio Street application.

## Project Data Structure

All project data is stored in the `client/src/lib/data/projects.ts` file. Each project is represented as an object in an array with the following structure:

```typescript
{
  id: "1",                                                // Unique identifier
  title: "Project Name",                                  // Project name (appears on house sign)
  description: "This is a detailed project description.", // Longer description
  technologies: ["React", "Node.js", "MongoDB"],          // Technologies used (displayed as tags)
  url: "https://example.com/project",                     // Live site URL (optional)
  githubUrl: "https://github.com/username/project-name",  // GitHub repository URL (optional)
  houseColor: "#4CAF50",                                  // Color of the house (CSS color)
  features: [                                             // Key features (bullet points, optional)
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  challenges: "These were the challenges faced...",       // Challenges section (optional)
  position: [10, 0, -20] as [number, number, number],     // Position in the 3D world
}
```

## How to Edit Projects

1. Open the file: `client/src/lib/data/projects.ts` in your code editor
2. Locate the `projects` array
3. Edit existing projects or add new ones by following the structure above

### Example of Adding a New Project

```typescript
export const projects: Project[] = [
  // Existing projects...
  
  // New project
  {
    id: "6",
    title: "New Portfolio Project",
    description: "This is my latest project, a portfolio website built with React and Three.js.",
    technologies: ["React", "Three.js", "TypeScript", "Tailwind CSS"],
    url: "https://my-portfolio-project.com",
    githubUrl: "https://github.com/username/portfolio-project",
    houseColor: "#9C27B0",
    features: [
      "Interactive 3D environment",
      "Custom animations",
      "Responsive design",
      "Dark mode support"
    ],
    challenges: "Creating a performant 3D experience that works well across different devices was challenging but rewarding.",
    position: [20, 0, 15] as [number, number, number],
  }
]
```

## Important Fields

- **title**: This appears on the house sign, keep it concise
- **position**: The [x, y, z] coordinates in the 3D world
  - The y-value (middle number) should typically remain at 0 (ground level)
  - Make sure houses don't overlap by giving them different x and z coordinates
- **houseColor**: Can be any valid CSS color (hex, rgb, hsl, etc.)
- **githubUrl**: Used for the automatic screenshot feature (see GITHUB_SCREENSHOT_FEATURE.md)

## Positioning Tips

- The street runs along the z-axis (north-south direction)
- Houses are typically placed on either side of the street (positive and negative x values)
- Maintain some distance between houses (usually at least 15-20 units apart)
- Example positions for houses along a street:
  - Left side: `[-10, 0, -40]`, `[-10, 0, -20]`, `[-10, 0, 0]`, `[-10, 0, 20]`
  - Right side: `[10, 0, -30]`, `[10, 0, -10]`, `[10, 0, 10]`, `[10, 0, 30]`

## House Colors

You can use any of these common CSS colors for your houses:

- Red: `"#F44336"`
- Pink: `"#E91E63"`
- Purple: `"#9C27B0"`
- Deep Purple: `"#673AB7"`
- Indigo: `"#3F51B5"`
- Blue: `"#2196F3"`
- Light Blue: `"#03A9F4"`
- Cyan: `"#00BCD4"`
- Teal: `"#009688"`
- Green: `"#4CAF50"`
- Light Green: `"#8BC34A"`
- Lime: `"#CDDC39"`
- Yellow: `"#FFEB3B"`
- Amber: `"#FFC107"`
- Orange: `"#FF9800"`
- Deep Orange: `"#FF5722"`
- Brown: `"#795548"`
- Grey: `"#9E9E9E"`

## After Editing

After making changes to the project data:

1. Save the file
2. Refresh your browser to see the changes
3. If running in development mode, the changes should be automatically applied

## Tips for Best Results

- Keep project titles concise for better display on house signs
- Use high-quality images and consistent aspect ratios for screenshots
- Make sure all URLs are correct and working
- Add detailed descriptions and feature lists to make your projects stand out
- Use contrasting house colors to make the street visually appealing
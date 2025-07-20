# 3D Interactive Portfolio Street

An immersive 3D portfolio website that transforms professional storytelling into an interactive cartoon street environment. Explore different projects represented as houses, each containing detailed information about the project, screenshots, and links to live sites and GitHub repositories.

## Features

- **Interactive 3D Environment**: Navigate through a charming cartoon street using keyboard controls
- **Project Houses**: Each house represents a different project in your portfolio
- **Project Details**: Click on houses to view detailed project information, technologies, features, and challenges
- **GitHub Screenshots**: Automatic generation of project repository screenshots
- **Responsive Design**: Works across different devices and screen sizes
- **Mini-games**: Interactive elements throughout the street for engagement
- **Easy Customization**: Simple editing of project data with no coding required

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/3d-portfolio-street.git
   cd 3d-portfolio-street
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5000`

## Customizing Your Portfolio

### Editing Project Information

1. Open the file: `client/src/lib/data/projects.ts`
2. Update the project array with your own projects
3. See the `PROJECT_EDITING_GUIDE.md` file for more detailed instructions

### Adding Your Own Projects

Each project can include:
- Title (displayed on the house sign)
- Description
- Technologies used
- Key features
- Challenges faced
- URL to the live site
- GitHub repository URL
- House color

### GitHub Repository Screenshots

The application automatically generates screenshots of your GitHub repositories to display in project details. See `GITHUB_SCREENSHOT_FEATURE.md` for more information.

## Controls

- **W / Up Arrow**: Move forward
- **S / Down Arrow**: Move backward
- **A / Left Arrow**: Turn left
- **D / Right Arrow**: Turn right
- **E / Space**: Interact with objects
- **+/=**: Zoom in
- **-**: Zoom out
- **Mouse Drag**: Look around

## Deployment

1. Build the production version:
   ```
   npm run build
   ```

2. The built files will be in the `dist` directory, which you can deploy to any static web hosting service.

## Technologies Used

- **Three.js**: For 3D rendering and environment
- **React**: For UI components and state management
- **TypeScript**: For type-safe code
- **Vite**: For fast development and building
- **Tailwind CSS**: For styling

## Project Structure

- `client/`: Frontend code
  - `src/`: Source files
    - `components/`: React components
    - `lib/`: Utility functions, constants, and data
      - `data/`: Project data
      - `services/`: Service functions (GitHub screenshot generation, etc.)
    - `pages/`: Page components
- `server/`: Backend code
- `public/`: Static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with love and creativity
- Inspired by the intersection of web development and interactive storytelling
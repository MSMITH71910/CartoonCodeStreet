# Converting to Static Mode for Netlify Deployment

This guide explains how to modify the 3D Portfolio Street application to work in static mode for deployment on Netlify.

## Overview

The application currently uses a Node.js backend server for rendering and API endpoints. For Netlify deployment, we need to convert it to a fully static site that runs entirely in the browser.

## Steps to Convert

### 1. Data Loading Modification

Change how the project data is loaded by modifying the file: `client/src/lib/data/projects.ts`

Replace:
```typescript
// Dynamic loading from API
export async function getProjects(): Promise<Project[]> {
  // API call or other server-dependent code
}
```

With:
```typescript
import { StaticDataService } from "../services/static-data-service";

// Static loading from JSON
export async function getProjects(): Promise<Project[]> {
  // Try to get from local storage first
  const cachedProjects = StaticDataService.loadProjectsFromLocalStorage();
  if (cachedProjects) {
    return cachedProjects;
  }
  
  // Load from static JSON file
  const projects = await StaticDataService.loadProjects();
  
  // Cache in local storage for future use
  if (projects.length > 0) {
    StaticDataService.saveProjectsToLocalStorage(projects);
  }
  
  return projects;
}
```

### 2. Vite Configuration Update

Replace your `vite.config.ts` file with the content from `vite.config.netlify.reference.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl()
  ],
  resolve: {
    alias: {
      '@': join(__dirname, 'client/src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 443,
    }
  },
  build: {
    outDir: 'dist/client', // Output client-only files for Netlify
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: join(__dirname, 'client/index.html')
      }
    }
  }
});
```

### 3. Remove Server Dependencies

Check your application for any server-dependent features:

1. API calls: Replace with static data
2. User authentication: Remove or implement a JAMstack approach
3. Database access: Use static JSON data instead

### 4. Static Screenshot Handling

Modify the `ScreenshotService` in `client/src/lib/services/screenshot-service.ts` to use GitHub's public OpenGraph images:

```typescript
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
    // Use GitHub's OpenGraph image directly - no API needed
    const placeholderUrl = `https://opengraph.githubassets.com/1/${repoInfo.owner}/${repoInfo.repo}`;
    
    // Cache the screenshot URL
    this.screenshotCache.set(githubUrl, placeholderUrl);
    
    return placeholderUrl;
  } catch (error) {
    console.error(`Error generating screenshot for ${githubUrl}:`, error);
    return null;
  }
}
```

### 5. Entry Point Adjustment

Create a static-specific entry point by copying `client/index.html` to the root and updating the paths if needed.

### 6. Testing Static Build

Before deploying, test the static build locally:

```bash
# Build the static site
npm run build

# Serve the static files locally with a simple HTTP server
npx serve dist/client
```

Verify that all features work correctly without the backend server.

## Deploying to Netlify

Follow the instructions in `NETLIFY_DEPLOYMENT_GUIDE.md` to deploy your static site to Netlify.

## Troubleshooting

### Missing Assets

If assets like 3D models or textures don't load:

1. Ensure they're in the `client/public` directory
2. Use relative paths starting with `/`
3. Verify they're being included in the build

### API Fallbacks

For critical features that rely on APIs, implement fallbacks:

```typescript
async function getData() {
  try {
    // Try to use the API if available
    const response = await fetch('/api/data');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('API unavailable');
  } catch (error) {
    console.log('Falling back to static data');
    // Fall back to static data
    return staticData;
  }
}
```

### Local Storage Limitations

Be aware that local storage has size limitations. For large datasets:

1. Consider using IndexedDB for larger storage
2. Split data into smaller chunks
3. Implement a caching strategy that prioritizes frequently accessed data
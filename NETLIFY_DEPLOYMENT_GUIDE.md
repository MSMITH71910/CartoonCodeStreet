# Deploying Your 3D Portfolio Street to Netlify

This guide will help you deploy your 3D Portfolio Street application to Netlify, a popular platform for hosting frontend applications.

## Prerequisites

1. A GitHub account where you'll push your code
2. A Netlify account (you can sign up for free at [netlify.com](https://www.netlify.com/))

## Step 1: Prepare Your Project for Production

Before deploying, you need to prepare your app for a static deployment:

1. Make sure all your project files are saved
2. Verify that your application runs correctly locally
3. The `netlify.toml` file is already created in your project

## Step 2: Important Modifications for Static Deployment

For this specific 3D Portfolio Street project, you'll need to make some changes after downloading it from Replit:

1. Modify `vite.config.ts` to enable static build:
   - Add the following to your Vite config:
   ```typescript
   build: {
     outDir: 'dist/client',
   }
   ```

2. Create a static client-only version of your app:
   - Modify the `client/src/App.tsx` to not depend on the backend server
   - Ensure all data is loaded from static JSON files instead of API calls

3. The `netlify.toml` file is already set up with:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist/client"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
   
   This tells Netlify:
   - How to build your project
   - Where the built client files are located (`dist/client` directory)
   - To handle client-side routing by redirecting all requests to `index.html`

## Step 3: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Initialize Git in your local project (if not already done):
   ```bash
   git init
   ```
3. Add your files to Git:
   ```bash
   git add .
   ```
4. Commit your changes:
   ```bash
   git commit -m "Initial commit for 3D Portfolio Street"
   ```
5. Add your GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   ```
6. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```
   (Use `master` instead of `main` if your default branch is named `master`)

## Step 4: Deploy to Netlify

### Option 1: Deploy via Netlify UI (Recommended for First Deployment)

1. Log in to your Netlify account
2. Click the "New site from Git" button
3. Select GitHub as your Git provider
4. Authorize Netlify to access your GitHub repositories
5. Select your 3D Portfolio Street repository
6. Verify the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Login to your Netlify account:
   ```bash
   netlify login
   ```
3. Initialize a new Netlify site:
   ```bash
   netlify init
   ```
4. Follow the prompts to connect to your GitHub repository
5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

## Step 5: Configure Domain (Optional)

1. In your Netlify dashboard, go to "Site settings" > "Domain management"
2. You can use the default Netlify subdomain (e.g., `your-site-name.netlify.app`) or set up a custom domain

## Step 6: Set Up Environment Variables (If Needed)

If your application uses environment variables:

1. Go to "Site settings" > "Build & deploy" > "Environment"
2. Add any environment variables your application needs

## Continuous Deployment

Netlify automatically deploys your site when you push changes to your GitHub repository. When you make updates:

1. Make your changes locally
2. Test that everything works
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Netlify will automatically start a new build and deployment

## Troubleshooting Common Issues

### Issue: Build Fails

If your build fails, check:
1. The Netlify build logs for specific errors
2. That all dependencies are listed in your `package.json`
3. That your build command works locally

### Issue: Pages Not Found (404 errors)

If you get 404 errors for routes other than the home page:
1. Verify that the `netlify.toml` file includes the redirect rule
2. Make sure your client-side routing is working correctly

### Issue: Assets Not Loading

If assets like images or 3D models don't load:
1. Make sure all assets use relative paths
2. Verify that assets are included in the build process
3. Check for any CORS (Cross-Origin Resource Sharing) issues

## Performance Optimization Tips for Netlify

1. Optimize large 3D models and textures
2. Enable HTTP/2 in your Netlify settings
3. Set up proper cache headers for static assets
4. Use Netlify's asset optimization features

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)
- [Netlify Forums](https://answers.netlify.com/)
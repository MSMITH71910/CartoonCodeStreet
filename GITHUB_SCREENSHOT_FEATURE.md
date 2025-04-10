# GitHub Repository Screenshot Feature

This feature automatically generates and displays screenshots of your GitHub repositories in the project details popup.

## How It Works

1. When you click on a house, the project details popup will display.
2. If you've provided a GitHub URL for the project, the system will automatically fetch and display a screenshot of your repository.
3. The screenshot is clickable and will take visitors directly to your GitHub repository.

## Requirements

For this feature to work correctly:

1. You must provide a valid GitHub repository URL in the `githubUrl` field of your project data.
2. The URL must be in the format: `https://github.com/username/repository-name`
3. The repository must be public so that it can be accessed for screenshot generation.

## Example GitHub URLs

- `https://github.com/yourusername/project-name`
- `https://github.com/organization-name/project-name`

## How to Add/Edit GitHub URLs

1. Open the file: `client/src/lib/data/projects.ts`
2. For each project, add or update the `githubUrl` field with your actual GitHub repository URL:

```typescript
{
  id: "1",
  title: "Project Name",
  // ... other fields ...
  githubUrl: "https://github.com/yourusername/your-repository-name",
}
```

## Troubleshooting

If your GitHub screenshot doesn't appear:

1. Make sure your GitHub repository URL is correct and the repository exists
2. Verify that your repository is public (private repositories won't work)
3. Check that the URL doesn't have any typos
4. After updating the URL, refresh the page or restart the application

## Notes

- Screenshots are cached to improve performance, so changes to your GitHub repository may not be immediately reflected in the screenshot
- The system uses GitHub's OpenGraph image API which creates beautiful preview images of your repositories
- The screenshots include repository details like language statistics, stars, and description
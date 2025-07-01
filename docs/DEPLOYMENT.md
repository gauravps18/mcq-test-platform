# MCQ Test Platform - Deployment Guide

## Overview

The MCQ Test Platform supports multiple deployment strategies:

1. **Development**: Local server (Express.js) + React development server
2. **GitHub Pages**: Static deployment with pre-built API endpoints
3. **Production**: Custom server deployment

## GitHub Pages Deployment

### How it Works

The GitHub Actions workflow automatically:

1. **Builds the React app** using `npm run build:prod`
2. **Creates static API endpoints** by converting the Express server routes to static JSON files
3. **Copies test data** to the build directory in an accessible format
4. **Deploys to GitHub Pages** as a fully static site

### Static API Structure

When deployed to GitHub Pages, the following API endpoints are available as static files:

- `/api/db.json` - Main database with test metadata
- `/api/tests.json` - All active tests with metadata (optimized endpoint)
- `/api/tests-{id}.json` - Individual test by ID (optimized endpoint)
- `/api/test-files.json` - List of available test files
- `/api/testfiles/{folder}/{filename}` - Direct access to test files

### Environment Detection

The application automatically detects the deployment environment:

- **Development**: `NODE_ENV === 'development'` - Uses Express server at `http://localhost:3001`
- **Static Deployment**: `REACT_APP_ENV === 'production'` or no API base URL - Uses static API endpoints
- **Custom Production**: Uses `REACT_APP_API_BASE_URL` if provided

### Configuration

To deploy to GitHub Pages:

1. **Set the homepage** in `package.json`:

   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```

2. **Push to main/master branch** - GitHub Actions will automatically build and deploy

3. **Environment Variables** (optional):
   - `REACT_APP_ENV=production` - Forces static deployment mode
   - `REACT_APP_BASENAME` - Custom base path for deployment

### Performance Benefits

The static deployment includes several optimizations:

- **Pre-built API responses** - No need to load and parse individual files at runtime
- **Optimized test loading** - Individual test endpoints for faster loading
- **Static file serving** - Maximum performance with CDN support
- **Caching friendly** - All resources can be cached effectively

### Limitations

GitHub Pages static deployment has some limitations:

- **No server-side processing** - All data must be pre-built
- **No dynamic API endpoints** - Cannot handle POST requests or dynamic queries
- **File size limits** - Large test databases may hit GitHub's limits

### Troubleshooting

If the deployment fails:

1. **Check the Actions tab** in your GitHub repository
2. **Verify test data validity** using `npm run validate`
3. **Check file paths** - Ensure all test files exist and are properly referenced
4. **Review build logs** for any errors during the static API generation

### Local Testing

To test the static deployment locally:

```bash
# Build the static version
npm run build:prod

# Serve the build directory
npx serve -s build

# Or use any static file server
python -m http.server 8000 -d build
```

### Manual Deployment

If you need to deploy manually:

```bash
# Build and deploy to gh-pages branch
npm run deploy
```

This uses the `gh-pages` package to deploy the build directory.

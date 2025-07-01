const fs = require('fs');
const path = require('path');

/**
 * Build static API endpoints for GitHub Pages deployment
 * This script converts the Express server endpoints to static JSON files
 */

console.log('🚀 Building static API endpoints...');

// Ensure build/api directory exists
const apiDir = path.join(__dirname, '..', 'build', 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

try {
  // Read the main database
  const dbPath = path.join(__dirname, '..', 'data', 'db.json');
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Copy main database
  fs.writeFileSync(path.join(apiDir, 'db.json'), JSON.stringify(dbData, null, 2));
  console.log('✅ Created /api/db.json');

  // Build optimized tests endpoint with metadata
  const tests = [];
  for (const testRef of dbData.tests) {
    if (!testRef.isActive) continue;

    try {
      const testFilePath = path.join(__dirname, '..', 'data', testRef.file);
      const testData = JSON.parse(fs.readFileSync(testFilePath, 'utf8'));

      // Add metadata to test
      const testWithMetadata = {
        ...testData,
        description: testRef.description,
        category: testRef.category,
        difficulty: testRef.difficulty,
        estimatedDuration: testRef.estimatedDuration,
        isActive: testRef.isActive,
      };

      tests.push(testWithMetadata);

      // Create individual test endpoint
      fs.writeFileSync(
        path.join(apiDir, `tests-${testRef.id}.json`),
        JSON.stringify(testWithMetadata, null, 2)
      );
      console.log(`✅ Created /api/tests-${testRef.id}.json`);
    } catch (error) {
      console.warn(`⚠️  Failed to load test ${testRef.id}:`, error.message);
    }
  }

  // Write all tests endpoint
  fs.writeFileSync(path.join(apiDir, 'tests.json'), JSON.stringify(tests, null, 2));
  console.log('✅ Created /api/tests.json');

  // Copy test files directory structure
  const testFilesDir = path.join(apiDir, 'testfiles');
  const sourceTestsDir = path.join(__dirname, '..', 'data', 'tests');

  if (fs.existsSync(sourceTestsDir)) {
    // Recursive copy function
    function copyDirectory(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const items = fs.readdirSync(src);
      for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);

        if (fs.statSync(srcPath).isDirectory()) {
          copyDirectory(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    copyDirectory(sourceTestsDir, testFilesDir);
    console.log('✅ Copied test files to /api/testfiles/');
  }

  // Create test files index
  function scanDirectory(dir, relativePath = '') {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;

      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...scanDirectory(fullPath, itemRelativePath));
      } else if (item.endsWith('.json')) {
        files.push({
          filename: item,
          name: item.replace('.json', ''),
          path: `tests/${itemRelativePath}`,
          folder: relativePath || 'root',
        });
      }
    }
    return files;
  }

  const testFiles = scanDirectory(sourceTestsDir);
  fs.writeFileSync(path.join(apiDir, 'test-files.json'), JSON.stringify(testFiles, null, 2));
  console.log('✅ Created /api/test-files.json');

  // Create deployment info
  const deploymentInfo = {
    buildTime: new Date().toISOString(),
    environment: 'static',
    totalTests: tests.length,
    totalTestFiles: testFiles.length,
    endpoints: [
      '/api/db.json',
      '/api/tests.json',
      '/api/test-files.json',
      ...tests.map((test) => `/api/tests-${test.id}.json`),
      ...testFiles.map((file) => `/api/testfiles/${file.path.replace('tests/', '')}`),
    ],
  };

  fs.writeFileSync(
    path.join(apiDir, 'deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log('✅ Created /api/deployment-info.json');

  console.log('');
  console.log('🎉 Static API build completed successfully!');
  console.log(`📊 Created ${tests.length} test endpoints`);
  console.log(`📁 Copied ${testFiles.length} test files`);
  console.log(`🔗 Total API endpoints: ${deploymentInfo.endpoints.length}`);
} catch (error) {
  console.error('❌ Failed to build static API:', error);
  process.exit(1);
}

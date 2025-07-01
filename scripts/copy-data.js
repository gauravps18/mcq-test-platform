const fs = require('fs');
const path = require('path');

// Create data directory in public folder
const publicDataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// Copy db.json to public/data
const dbSource = path.join(__dirname, '..', 'data', 'db.json');
const dbDest = path.join(publicDataDir, 'db.json');
fs.copyFileSync(dbSource, dbDest);

// Create tests directory in public/data
const publicTestsDir = path.join(publicDataDir, 'tests');
if (!fs.existsSync(publicTestsDir)) {
  fs.mkdirSync(publicTestsDir, { recursive: true });
}

// Copy all test files
const testsSourceDir = path.join(__dirname, '..', 'data', 'tests');
const copyTestFiles = (sourceDir, destDir) => {
  const items = fs.readdirSync(sourceDir);

  items.forEach((item) => {
    const sourcePath = path.join(sourceDir, item);
    const destPath = path.join(destDir, item);

    if (fs.statSync(sourcePath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyTestFiles(sourcePath, destPath);
    } else if (item.endsWith('.json')) {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
};

copyTestFiles(testsSourceDir, publicTestsDir);

console.log('Data files copied to public directory for GitHub Pages deployment');

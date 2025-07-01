const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Custom middleware to serve the main database at /db
app.get('/db', (req, res) => {
  const dbPath = path.join(__dirname, 'data/db.json');
  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    res.json(dbData);
  } catch (error) {
    console.error('Error reading database:', error);
    res.status(500).json({ error: 'Failed to read database' });
  }
});

// Custom middleware to serve test files directly (supports nested folders)
app.get('/testfiles/:folder/:filename', (req, res) => {
  const folder = req.params.folder;
  const filename = req.params.filename;
  const testFilePath = path.join(__dirname, 'data/tests', folder, filename);

  // Check if the test file exists
  if (fs.existsSync(testFilePath)) {
    try {
      const testData = JSON.parse(fs.readFileSync(testFilePath, 'utf8'));
      res.json(testData);
    } catch (error) {
      console.error(`Error reading test file ${folder}/${filename}:`, error);
      res.status(500).json({ error: 'Failed to read test file' });
    }
  } else {
    res.status(404).json({ error: 'Test file not found' });
  }
});

// Fallback for files directly in tests folder (backward compatibility)
app.get('/testfiles/:filename', (req, res) => {
  const filename = req.params.filename;
  const testFilePath = path.join(__dirname, 'data/tests', filename);

  // Check if the test file exists
  if (fs.existsSync(testFilePath)) {
    try {
      const testData = JSON.parse(fs.readFileSync(testFilePath, 'utf8'));
      res.json(testData);
    } catch (error) {
      console.error(`Error reading test file ${filename}:`, error);
      res.status(500).json({ error: 'Failed to read test file' });
    }
  } else {
    res.status(404).json({ error: 'Test file not found' });
  }
});

// Legacy routes for backward compatibility
app.get('/tests', async (req, res) => {
  try {
    const dbPath = path.join(__dirname, 'data/db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const tests = [];
    for (const testRef of dbData.tests) {
      if (!testRef.isActive) continue;

      try {
        const testFilePath = path.join(__dirname, 'data', testRef.file);
        const testData = JSON.parse(fs.readFileSync(testFilePath, 'utf8'));
        tests.push(testData);
      } catch (error) {
        console.warn(`Failed to load test ${testRef.id}:`, error);
      }
    }

    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

app.get('/tests/:id', async (req, res) => {
  try {
    const testId = req.params.id;
    const dbPath = path.join(__dirname, 'data/db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const testRef = dbData.tests.find((test) => test.id === testId);
    if (!testRef) {
      return res.status(404).json({ error: 'Test not found' });
    }

    if (!testRef.isActive) {
      return res.status(404).json({ error: 'Test not active' });
    }

    const testFilePath = path.join(__dirname, 'data', testRef.file);
    const testData = JSON.parse(fs.readFileSync(testFilePath, 'utf8'));
    res.json(testData);
  } catch (error) {
    console.error(`Error fetching test ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch test' });
  }
});

// API endpoint to get available test files (supports nested folders)
app.get('/api/test-files', (req, res) => {
  try {
    const testsDir = path.join(__dirname, 'data/tests');

    // Recursive function to scan directories
    function scanDirectory(dir, relativePath = '') {
      const files = [];
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;

        if (fs.statSync(fullPath).isDirectory()) {
          // Recursively scan subdirectories
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

    const files = scanDirectory(testsDir);
    res.json(files);
  } catch (error) {
    console.error('Error listing test files:', error);
    res.status(500).json({ error: 'Failed to list test files' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MCQ Test Platform Server is running on port ${PORT}`);
  console.log(`Main database: http://localhost:${PORT}/db`);
  console.log(`Test files: http://localhost:${PORT}/tests/<filename>`);
  console.log(`Legacy API: http://localhost:${PORT}/tests`);
});

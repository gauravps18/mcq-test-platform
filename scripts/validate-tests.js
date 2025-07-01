#!/usr/bin/env node

/**
 * Test Validation Script
 * Validates test files against the expected schema
 */

const fs = require('fs');
const path = require('path');

// Validate a test file structure
function validateTestFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const test = JSON.parse(content);

    const errors = [];

    // Required fields
    if (!test.id) errors.push('Missing required field: id');
    if (!test.title) errors.push('Missing required field: title');
    if (!test.sections || !Array.isArray(test.sections))
      errors.push('Missing or invalid sections array');
    if (typeof test.passingPercentage !== 'number')
      errors.push('Missing or invalid passingPercentage');
    if (typeof test.correctMarks !== 'number') errors.push('Missing or invalid correctMarks');
    if (typeof test.incorrectMarks !== 'number') errors.push('Missing or invalid incorrectMarks');

    // Validate sections
    if (test.sections) {
      test.sections.forEach((section, sectionIndex) => {
        if (!section.id) errors.push(`Section ${sectionIndex}: Missing id`);
        if (!section.title) errors.push(`Section ${sectionIndex}: Missing title`);
        if (!section.questions || !Array.isArray(section.questions)) {
          errors.push(`Section ${sectionIndex}: Missing or invalid questions array`);
        } else {
          section.questions.forEach((question, questionIndex) => {
            if (!question.id)
              errors.push(`Section ${sectionIndex}, Question ${questionIndex}: Missing id`);
            if (!question.text)
              errors.push(`Section ${sectionIndex}, Question ${questionIndex}: Missing text`);
            if (!question.options || !Array.isArray(question.options)) {
              errors.push(
                `Section ${sectionIndex}, Question ${questionIndex}: Missing or invalid options array`
              );
            } else {
              const optionIds = question.options.map((opt) => opt.id);
              if (!question.correctOptionId || !optionIds.includes(question.correctOptionId)) {
                errors.push(
                  `Section ${sectionIndex}, Question ${questionIndex}: Invalid correctOptionId`
                );
              }
            }
          });
        }
      });
    }

    return { valid: errors.length === 0, errors };
  } catch (error) {
    return { valid: false, errors: [`JSON parsing error: ${error.message}`] };
  }
}

// Validate database file
function validateDatabase(dbPath) {
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(content);

    const errors = [];

    if (!db.tests || !Array.isArray(db.tests)) {
      errors.push('Database missing tests array');
      return { valid: false, errors };
    }

    db.tests.forEach((test, index) => {
      if (!test.id) errors.push(`Test ${index}: Missing id`);
      if (!test.title) errors.push(`Test ${index}: Missing title`);
      if (!test.file) errors.push(`Test ${index}: Missing file path`);
      if (typeof test.isActive !== 'boolean')
        errors.push(`Test ${index}: Missing or invalid isActive`);

      // Check if file exists
      if (test.file) {
        const testFilePath = path.join(path.dirname(dbPath), test.file);
        if (!fs.existsSync(testFilePath)) {
          errors.push(`Test ${index}: Referenced file does not exist: ${test.file}`);
        }
      }
    });

    return { valid: errors.length === 0, errors };
  } catch (error) {
    return { valid: false, errors: [`JSON parsing error: ${error.message}`] };
  }
}

// Main validation function
function validate() {
  console.log('🔍 MCQ Test Platform - Test Validation');
  console.log('=====================================\n');

  // Use process.cwd() to get the project root directory
  const projectRoot = process.cwd();
  const dataDir = path.join(projectRoot, 'data');
  const dbPath = path.join(dataDir, 'db.json');
  const testsDir = path.join(dataDir, 'tests');

  let totalErrors = 0;

  // Validate database
  console.log('📊 Validating database...');
  const dbValidation = validateDatabase(dbPath);
  if (dbValidation.valid) {
    console.log('✅ Database is valid\n');
  } else {
    console.log('❌ Database validation failed:');
    dbValidation.errors.forEach((error) => console.log(`   - ${error}`));
    console.log();
    totalErrors += dbValidation.errors.length;
  }

  // Validate test files
  console.log('📝 Validating test files...');

  // Recursive function to find all test files
  function findTestFiles(dir, relativePath = '') {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;

      if (fs.statSync(fullPath).isDirectory()) {
        // Recursively scan subdirectories
        files.push(...findTestFiles(fullPath, itemRelativePath));
      } else if (item.endsWith('.json')) {
        files.push({
          filename: item,
          fullPath: fullPath,
          relativePath: itemRelativePath,
        });
      }
    }

    return files;
  }

  const testFiles = findTestFiles(testsDir);

  testFiles.forEach((fileInfo) => {
    const validation = validateTestFile(fileInfo.fullPath);

    if (validation.valid) {
      console.log(`✅ ${fileInfo.relativePath} is valid`);
    } else {
      console.log(`❌ ${fileInfo.relativePath} validation failed:`);
      validation.errors.forEach((error) => console.log(`   - ${error}`));
      totalErrors += validation.errors.length;
    }
  });

  console.log(`\n📈 Validation Summary:`);
  console.log(`   Total files checked: ${testFiles.length + 1}`);
  console.log(`   Total errors: ${totalErrors}`);

  if (totalErrors === 0) {
    console.log('🎉 All validations passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Please fix the errors above before proceeding.');
    process.exit(1);
  }
}

// Run validation if called directly
if (require.main === module) {
  validate();
}

module.exports = { validateTestFile, validateDatabase };

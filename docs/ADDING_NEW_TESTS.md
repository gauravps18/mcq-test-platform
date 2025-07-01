# Adding New Test Papers to MCQ Test Platform

This guide explains how to add new test papers to the MCQ Test Platform using the modular structure.

## Overview

The MCQ Test Platform uses a modular architecture where:

- `data/db.json` contains metadata about all tests
- `data/tests/` directory contains test files organized in subfolders
- Each subfolder (test1, test2, etc.) can contain multiple related test files
- Each test file is a standalone JSON file with questions and answers

## Folder Organization

You can organize tests in multiple ways:

1. **By Test Series**: `test1/`, `test2/`, `test3/` - for different test series
2. **By Subject**: `mathematics/`, `english/`, `science/` - for subject-wise tests
3. **By Level**: `beginner/`, `intermediate/`, `advanced/` - for difficulty levels
4. **By Category**: `entrance-exam/`, `aptitude/`, `competitive/` - for test categories

## Step-by-Step Guide

### 1. Create the Test File

Create a new JSON file in the appropriate subfolder within `data/tests/` directory:

```bash
# Option 1: Add to existing test series (test1, test2, etc.)
cd data/tests/test1
cp c-cat-section-A.json new-section-C.json

# Option 2: Create a new test series
mkdir -p data/tests/test2
cd data/tests/test2
cp ../test1/c-cat-section-A.json physics-test.json

# Option 3: Create a subject-based folder
mkdir -p data/tests/mathematics
cd data/tests/mathematics
cp ../test1/c-cat-section-A.json algebra-test.json

# Option 4: Create a custom category
mkdir -p data/tests/entrance-exams
cd data/tests/entrance-exams
cp ../test1/c-cat-section-A.json jee-main-mock.json
```

### 2. Update the Test File Content

Edit your new test file (`your-new-test.json`) with the following structure:

```json
{
  "id": "your-test-id",
  "title": "Your Test Title",
  "passingPercentage": 50,
  "correctMarks": 3,
  "incorrectMarks": 1,
  "sections": [
    {
      "id": "section-1",
      "title": "Section 1 Name",
      "questions": [
        {
          "id": 1,
          "text": "Your question text here",
          "options": [
            { "id": "a", "text": "Option A" },
            { "id": "b", "text": "Option B" },
            { "id": "c", "text": "Option C" },
            { "id": "d", "text": "Option D" }
          ],
          "correctOptionId": "a",
          "type": "multiple_choice"
        }
      ]
    }
  ]
}
```

### 3. Update the Database Index

Add your test reference to `data/db.json`. Examples for different folder structures:

```json
{
  "tests": [
    {
      "id": "test1-section-c",
      "title": "Test Series 1 - Section C",
      "description": "Additional section for Test Series 1",
      "file": "tests/test1/new-section-C.json",
      "category": "entrance-exam",
      "difficulty": "intermediate",
      "estimatedDuration": 120,
      "isActive": true
    },
    {
      "id": "test2-physics",
      "title": "Test Series 2 - Physics",
      "description": "Physics concepts and problems",
      "file": "tests/test2/physics-test.json",
      "category": "science",
      "difficulty": "advanced",
      "estimatedDuration": 90,
      "isActive": true
    },
    {
      "id": "math-algebra",
      "title": "Mathematics - Algebra",
      "description": "Algebraic equations and functions",
      "file": "tests/mathematics/algebra-test.json",
      "category": "mathematics",
      "difficulty": "intermediate",
      "estimatedDuration": 60,
      "isActive": true
    },
    {
      "id": "jee-main-mock",
      "title": "JEE Main Mock Test",
      "description": "Full-length JEE Main practice test",
      "file": "tests/entrance-exams/jee-main-mock.json",
      "category": "entrance-exam",
      "difficulty": "advanced",
      "estimatedDuration": 180,
      "isActive": true
    }
  ]
}
```

### 4. Test Your New Test Paper

1. Restart the server:

   ```bash
   npm run server
   ```

2. Test the API endpoints:

   ```bash
   # Check if your test appears in the list
   curl http://localhost:3001/db

   # Test specific test files from different folders
   curl http://localhost:3001/testfiles/test1/new-section-C.json
   curl http://localhost:3001/testfiles/test2/physics-test.json
   curl http://localhost:3001/testfiles/mathematics/algebra-test.json
   curl http://localhost:3001/testfiles/entrance-exams/jee-main-mock.json

   # Test the legacy API
   curl http://localhost:3001/tests/test1-section-c
   curl http://localhost:3001/tests/test2-physics
   ```

3. Start the frontend and verify your test appears:
   ```bash
   npm start
   ```

## Question Types Supported

The platform supports various question types:

- `multiple_choice` - Standard multiple choice
- `vocabulary_synonym` - Vocabulary synonyms
- `vocabulary_antonym` - Vocabulary antonyms
- `idiom` - Idiom meanings
- `fill_in_the_blanks` - Fill in the blanks
- `word_problem` - Math word problems
- `mathematical` - Direct mathematical questions
- `probability` - Probability questions
- `series_completion` - Number/letter series
- `blood_relations` - Family relationship questions
- `coding_decoding` - Code and decode questions
- `geometry_mensuration` - Geometry and measurement
- `odd_one_out` - Find the odd one out
- `analogy` - Analogy questions
- `seating_arrangement` - Arrangement problems

## Field Definitions

### Test-level Fields

- `id`: Unique identifier for the test
- `title`: Display name of the test
- `passingPercentage`: Minimum percentage to pass (e.g., 50)
- `correctMarks`: Points awarded for correct answers (e.g., 3)
- `incorrectMarks`: Points deducted for wrong answers (e.g., 1)

### Database Reference Fields

- `description`: Detailed description of the test
- `category`: Category like "entrance-exam", "aptitude", etc.
- `difficulty`: "beginner", "intermediate", or "advanced"
- `estimatedDuration`: Time in minutes
- `isActive`: Boolean to enable/disable the test

### Question Fields

- `id`: Unique question ID within the test
- `text`: The question text (supports LaTeX with $ delimiters)
- `options`: Array of answer options
- `correctOptionId`: ID of the correct option
- `type`: Question type for categorization

## LaTeX Support

Questions support LaTeX formatting for mathematical expressions:

```json
{
  "text": "Find the value of $x^2 + 2x + 1$ when $x = 3$",
  "options": [
    { "id": "a", "text": "$16$" },
    { "id": "b", "text": "$25$" },
    { "id": "c", "text": "$9$" },
    { "id": "d", "text": "$4$" }
  ]
}
```

## Best Practices

1. **Unique IDs**: Ensure all test IDs and question IDs are unique across all folders
2. **File Naming**: Use descriptive, kebab-case filenames
3. **Folder Organization**: Choose a consistent folder structure:
   - Use `test1`, `test2`, etc. for sequential test series
   - Use subject names for subject-wise organization
   - Use descriptive names for specific purposes (e.g., `mock-tests`, `practice-sets`)
4. **Validation**: Test your JSON files for syntax errors using `npm run validate`
5. **Categories**: Use consistent category names across tests
6. **Question Numbering**: Start question IDs from 1 for each test file
7. **Section Organization**: Group related questions into logical sections
8. **File Size**: Keep test files manageable (recommend 50-100 questions per file)

## Organizing Multiple Test Series

### Naming Conventions

- **Sequential**: `test1`, `test2`, `test3` for numbered series
- **Descriptive**: `jee-preparation`, `neet-mock`, `cat-practice`
- **Subject-based**: `mathematics`, `physics`, `chemistry`
- **Level-based**: `beginner`, `intermediate`, `advanced`

### Database Categories

Use consistent categories in db.json:

- `entrance-exam` - for competitive entrance tests
- `aptitude` - for general aptitude tests
- `subject-specific` - for individual subjects
- `mock-test` - for full-length practice tests
- `practice-set` - for topic-wise practice

## File Structure Examples

### Example 1: Test Series Organization

```
data/
├── db.json                     # Main database index
├── tests/
│   ├── test1/                  # First test series
│   │   ├── c-cat-section-A.json
│   │   ├── c-cat-section-B.json
│   │   └── section-C.json
│   ├── test2/                  # Second test series
│   │   ├── math-section.json
│   │   ├── physics-section.json
│   │   └── chemistry-section.json
│   └── test3/                  # Third test series
│       ├── english-test.json
│       └── reasoning-test.json
└── db.schema.json
```

### Example 2: Subject-wise Organization

```
data/
├── db.json
├── tests/
│   ├── mathematics/
│   │   ├── algebra.json
│   │   ├── geometry.json
│   │   └── calculus.json
│   ├── physics/
│   │   ├── mechanics.json
│   │   ├── thermodynamics.json
│   │   └── optics.json
│   ├── chemistry/
│   │   ├── organic.json
│   │   ├── inorganic.json
│   │   └── physical.json
│   └── english/
│       ├── grammar.json
│       ├── vocabulary.json
│       └── comprehension.json
└── db.schema.json
```

### Example 3: Mixed Organization

```
data/
├── db.json
├── tests/
│   ├── test1/                  # Original C-CAT tests
│   │   ├── c-cat-section-A.json
│   │   └── c-cat-section-B.json
│   ├── jee-preparation/        # JEE specific tests
│   │   ├── jee-main-physics.json
│   │   ├── jee-main-chemistry.json
│   │   └── jee-advanced-math.json
│   ├── aptitude-tests/         # General aptitude
│   │   ├── logical-reasoning.json
│   │   ├── quantitative-apt.json
│   │   └── verbal-ability.json
│   └── mock-tests/             # Full-length mocks
│       ├── mock-test-1.json
│       ├── mock-test-2.json
│       └── final-mock.json
└── db.schema.json
```

## Troubleshooting

### Common Issues

1. **Test not appearing**: Check that `isActive: true` in db.json
2. **Invalid JSON**: Validate your JSON syntax
3. **File not found**: Ensure the file path in db.json matches the actual file
4. **Server errors**: Check server console for detailed error messages

### Validation

Use the provided JSON schema to validate your test files:

```bash
# Install ajv-cli for validation
npm install -g ajv-cli

# Validate your test file
ajv validate -s data/db.schema.json -d data/tests/your-new-test.json
```

## API Endpoints Reference

- `GET /db` - Get main database with test references
- `GET /testfiles/:folder/:filename` - Get specific test file from folder
- `GET /testfiles/:filename` - Get test file from root (backward compatibility)
- `GET /tests` - Get all active tests (legacy)
- `GET /tests/:id` - Get test by ID (legacy)
- `GET /api/test-files` - List all available test files with folder information

## Live Example

The platform currently demonstrates multiple test folders:

### Current Structure:

```
data/tests/
├── test1/                      # Original C-CAT tests
│   ├── c-cat-section-A.json   # English, Quantitative, Reasoning
│   └── c-cat-section-B.json   # Computer Science topics
└── test2/                      # Mathematics test series
    └── sample-math-test.json   # Algebra and Geometry
```

### API Access Examples:

```bash
# List all tests
curl http://localhost:3001/db

# Access test1 files
curl http://localhost:3001/testfiles/test1/c-cat-section-A.json
curl http://localhost:3001/testfiles/test1/c-cat-section-B.json

# Access test2 files
curl http://localhost:3001/testfiles/test2/sample-math-test.json

# Legacy API access
curl http://localhost:3001/tests/c-cat-section-A
curl http://localhost:3001/tests/sample-math-test
```

## Support

For additional help or feature requests, refer to the main project documentation or create an issue in the project repository.

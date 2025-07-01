# Database Schema Documentation

This document describes the schema for the MCQ Test Platform database (`db.json`).

## Overview

The database follows a hierarchical structure:

- **Database** → Contains an array of **Tests**
- **Test** → Contains metadata and an array of **Sections**
- **Section** → Contains a title and an array of **Questions**
- **Question** → Contains text, options, and answer information

## Schema Files

- `data/db.schema.json` - JSON Schema for validation
- `src/schemas/database.schema.ts` - TypeScript schema definitions for runtime validation

## Data Structure

### Database Root

```json
{
  "tests": [Test...]
}
```

### Test Object

```json
{
  "id": "unique-test-identifier",
  "title": "Human-readable test title",
  "passingPercentage": 50,
  "correctMarks": 3,
  "incorrectMarks": 1,
  "sections": [Section...]
}
```

**Properties:**

- `id` (string, required): Unique identifier using alphanumeric, hyphens, and underscores
- `title` (string, required): Display name (1-200 characters)
- `passingPercentage` (number, required): Minimum percentage to pass (0-100)
- `correctMarks` (number, required): Points awarded for correct answers (≥0)
- `incorrectMarks` (number, required): Points deducted for incorrect answers (≥0)
- `sections` (array, required): At least one section

### Section Object

```json
{
  "id": "section-identifier",
  "title": "Section Title",
  "questions": [Question...]
}
```

**Properties:**

- `id` (string, required): Unique identifier within the test
- `title` (string, required): Display name (1-100 characters)
- `questions` (array, required): At least one question

### Question Object

```json
{
  "id": 1,
  "text": "What is the output of the following code?",
  "codeSnippet": "#include <stdio.h>\nint main() {\n    printf(\"Hello\");\n    return 0;\n}",
  "options": [Option...],
  "correctOptionId": "a",
  "type": "code_output"
}
```

**Properties:**

- `id` (integer, required): Unique identifier within the section (≥1)
- `text` (string, required): Question text (1-2000 characters)
- `codeSnippet` (string, optional): Code to display in a code block
- `options` (array, required): 2-10 answer options
- `correctOptionId` (string, required): ID of the correct option
- `type` (string, optional): Question category (see Question Types below)

### Option Object

```json
{
  "id": "a",
  "text": "Hello"
}
```

**Properties:**

- `id` (string, required): Unique identifier within the question
- `text` (string, required): Option text (1-500 characters)

## Question Types

The `type` field categorizes questions for organizational purposes:

### Language & Literature

- `vocabulary_synonym` - Synonym questions
- `vocabulary_antonym` - Antonym questions
- `idiom` - Idioms and phrases
- `fill_in_the_blanks` - Fill in the blanks
- `grammar` - Grammar rules
- `comprehension` - Reading comprehension

### Mathematics

- `arithmetic` - Basic arithmetic
- `algebra` - Algebraic problems
- `geometry` - Geometric problems
- `data_interpretation` - Charts and graphs

### Programming

- `code_output` - Predict code output
- `syntax_rules` - Language syntax
- `debugging` - Find and fix errors
- `algorithm` - Algorithmic thinking
- `data_structures` - Data structure concepts

### General Knowledge

- `logical_reasoning` - Logic puzzles
- `general_knowledge` - General facts
- `current_affairs` - Recent events
- `science` - Scientific concepts
- `history` - Historical facts
- `geography` - Geographic knowledge
- `other` - Miscellaneous

## Text Formatting

### Inline Code

Use backticks for inline code in question text and options:

```json
{
  "text": "Which of the following is a valid `JavaScript` variable declaration?",
  "options": [
    { "id": "a", "text": "`let x = 5;`" },
    { "id": "b", "text": "`var y = 10;`" }
  ]
}
```

### Code Blocks

Use the `codeSnippet` field for multi-line code:

```json
{
  "text": "What is the output of this C program?",
  "codeSnippet": "#include <stdio.h>\\nint main() {\\n    int x = 10;\\n    printf(\\\"%d\\\", x++);\\n    return 0;\\n}"
}
```

## Validation

### Using JSON Schema

```bash
# Install a JSON schema validator
npm install -g ajv-cli

# Validate the database
ajv validate -s data/db.schema.json -d data/db.json
```

### Using TypeScript

```typescript
import Ajv from 'ajv';
import { DatabaseSchema } from './schemas/database.schema';

const ajv = new Ajv();
const validate = ajv.compile(DatabaseSchema);

function validateDatabase(data: unknown): boolean {
  const valid = validate(data);
  if (!valid) {
    console.error('Validation errors:', validate.errors);
    return false;
  }
  return true;
}
```

## Example Complete Test

```json
{
  "tests": [
    {
      "id": "sample-test",
      "title": "Sample Programming Test",
      "passingPercentage": 60,
      "correctMarks": 2,
      "incorrectMarks": 0.5,
      "sections": [
        {
          "id": "javascript-basics",
          "title": "JavaScript Basics",
          "questions": [
            {
              "id": 1,
              "text": "What will this code output?",
              "codeSnippet": "console.log(typeof null);",
              "options": [
                { "id": "a", "text": "null" },
                { "id": "b", "text": "object" },
                { "id": "c", "text": "undefined" },
                { "id": "d", "text": "boolean" }
              ],
              "correctOptionId": "b",
              "type": "code_output"
            },
            {
              "id": 2,
              "text": "Which is a valid way to declare a variable in `JavaScript`?",
              "options": [
                { "id": "a", "text": "`let x = 5;`" },
                { "id": "b", "text": "`int x = 5;`" },
                { "id": "c", "text": "`var x: number = 5;`" },
                { "id": "d", "text": "`x := 5;`" }
              ],
              "correctOptionId": "a",
              "type": "syntax_rules"
            }
          ]
        }
      ]
    }
  ]
}
```

## Best Practices

1. **Unique IDs**: Ensure all IDs are unique within their scope
2. **Consistent Naming**: Use kebab-case for test and section IDs
3. **Reasonable Lengths**: Keep text concise but clear
4. **Proper Escaping**: Escape quotes and newlines in JSON strings
5. **Logical Grouping**: Group related questions in sections
6. **Clear Options**: Make options distinct and unambiguous
7. **Appropriate Types**: Use correct question types for categorization
8. **Code Formatting**: Use proper indentation in code snippets

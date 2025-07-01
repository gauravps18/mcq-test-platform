/**
 * JSON Schema definitions for the MCQ Test Platform Database
 * This file provides runtime validation schemas using Ajv or similar JSON schema validators
 */

export const OptionSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '^[a-zA-Z0-9-_]+$',
    },
    text: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
    },
  },
  required: ['id', 'text'],
  additionalProperties: false,
} as const;

export const QuestionSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      minimum: 1,
    },
    text: {
      type: 'string',
      minLength: 1,
      maxLength: 2000,
    },
    codeSnippet: {
      type: 'string',
    },
    options: {
      type: 'array',
      items: OptionSchema,
      minItems: 2,
      maxItems: 10,
    },
    correctOptionId: {
      type: 'string',
      pattern: '^[a-zA-Z0-9-_]+$',
    },
    type: {
      type: 'string',
      enum: [
        'vocabulary_synonym',
        'vocabulary_antonym',
        'idiom',
        'fill_in_the_blanks',
        'grammar',
        'comprehension',
        'arithmetic',
        'algebra',
        'geometry',
        'data_interpretation',
        'logical_reasoning',
        'code_output',
        'syntax_rules',
        'debugging',
        'algorithm',
        'data_structures',
        'general_knowledge',
        'current_affairs',
        'science',
        'history',
        'geography',
        'other',
      ],
    },
  },
  required: ['id', 'text', 'options', 'correctOptionId'],
  additionalProperties: false,
} as const;

export const SectionSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '^[a-zA-Z0-9-_]+$',
    },
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    questions: {
      type: 'array',
      items: QuestionSchema,
      minItems: 1,
    },
  },
  required: ['id', 'title', 'questions'],
  additionalProperties: false,
} as const;

export const TestSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '^[a-zA-Z0-9-_]+$',
    },
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 200,
    },
    passingPercentage: {
      type: 'number',
      minimum: 0,
      maximum: 100,
    },
    correctMarks: {
      type: 'number',
      minimum: 0,
    },
    incorrectMarks: {
      type: 'number',
      minimum: 0,
    },
    sections: {
      type: 'array',
      items: SectionSchema,
      minItems: 1,
    },
  },
  required: ['id', 'title', 'passingPercentage', 'correctMarks', 'incorrectMarks', 'sections'],
  additionalProperties: false,
} as const;

export const DatabaseSchema = {
  type: 'object',
  properties: {
    tests: {
      type: 'array',
      items: TestSchema,
    },
  },
  required: ['tests'],
  additionalProperties: false,
} as const;

/**
 * Question types enum for reference
 */
export enum QuestionType {
  VOCABULARY_SYNONYM = 'vocabulary_synonym',
  VOCABULARY_ANTONYM = 'vocabulary_antonym',
  IDIOM = 'idiom',
  FILL_IN_THE_BLANKS = 'fill_in_the_blanks',
  GRAMMAR = 'grammar',
  COMPREHENSION = 'comprehension',
  ARITHMETIC = 'arithmetic',
  ALGEBRA = 'algebra',
  GEOMETRY = 'geometry',
  DATA_INTERPRETATION = 'data_interpretation',
  LOGICAL_REASONING = 'logical_reasoning',
  CODE_OUTPUT = 'code_output',
  SYNTAX_RULES = 'syntax_rules',
  DEBUGGING = 'debugging',
  ALGORITHM = 'algorithm',
  DATA_STRUCTURES = 'data_structures',
  GENERAL_KNOWLEDGE = 'general_knowledge',
  CURRENT_AFFAIRS = 'current_affairs',
  SCIENCE = 'science',
  HISTORY = 'history',
  GEOGRAPHY = 'geography',
  OTHER = 'other',
}

/**
 * Example usage with Ajv validator:
 *
 * import Ajv from 'ajv';
 * import { DatabaseSchema } from './schemas/database.schema';
 *
 * const ajv = new Ajv();
 * const validate = ajv.compile(DatabaseSchema);
 *
 * function validateDatabase(data: unknown): boolean {
 *   const valid = validate(data);
 *   if (!valid) {
 *     console.error('Validation errors:', validate.errors);
 *     return false;
 *   }
 *   return true;
 * }
 */

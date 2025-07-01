export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  codeSnippet?: string; // Optional code snippet for programming questions
  options: Option[];
  correctOptionId: string;
  type?: QuestionType; // Optional question type for categorization
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface Test {
  id: string;
  title: string;
  sections: Section[];
  passingPercentage: number;
  correctMarks: number;
  incorrectMarks: number;
}

export interface UserAnswer {
  questionId: number;
  selectedOptionId: string | null;
}

export interface SectionResult {
  sectionId: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  score: number;
}

export interface TestResult {
  testId: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  passed: boolean;
  sectionResults: SectionResult[];
}

export interface QuestionResult {
  questionId: number;
  question: Question;
  userSelectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  wasAnswered: boolean;
  marksAwarded: number;
}

export interface DetailedSectionResult extends SectionResult {
  questionResults: QuestionResult[];
}

export interface DetailedTestResult extends TestResult {
  detailedSectionResults: DetailedSectionResult[];
}

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

// New types for modular database structure
export interface TestReference {
  id: string;
  title: string;
  description: string;
  file: string; // Path to the test file relative to data directory
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // Duration in minutes
  isActive: boolean;
}

export interface DatabaseMetadata {
  version: string;
  lastUpdated: string;
  totalTests: number;
  categories: string[];
  difficulties: string[];
}

export interface Database {
  tests: TestReference[];
  metadata: DatabaseMetadata;
}

// Extended Test interface with additional metadata
export interface TestWithMetadata extends Test {
  description?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number;
  isActive?: boolean;
}

// New interfaces for hierarchical test structure
export interface TestSection {
  id: string;
  title: string;
  description: string;
  file: string;
  estimatedDuration: number;
}

export interface TestGroup {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sections: TestSection[];
  isActive: boolean;
}

// Import Question type from test.ts
import type { Question } from './test';

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

import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  Test,
  UserAnswer,
  TestResult,
  SectionResult,
  DetailedTestResult,
  DetailedSectionResult,
  QuestionResult,
} from '../types';
import { fetchTestById } from '../services/api';

interface TestContextProps {
  currentTest: Test | null;
  loading: boolean;
  error: string | null;
  currentSectionIndex: number;
  userAnswers: Record<string, UserAnswer[]>;
  setCurrentSectionIndex: (index: number) => void;
  loadTest: (testId: string) => Promise<void>;
  saveAnswer: (sectionId: string, questionId: number, selectedOptionId: string | null) => void;
  calculateResults: () => TestResult | null;
  calculateDetailedResults: () => DetailedTestResult | null;
}

const TestContext = createContext<TestContextProps | undefined>(undefined);

interface TestProviderProps {
  children: ReactNode;
}

export const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer[]>>({});

  const loadTest = async (testId: string) => {
    setLoading(true);
    setError(null);
    try {
      const test = await fetchTestById(testId);
      if (test) {
        setCurrentTest(test);
        // Initialize userAnswers for each section
        const initialAnswers: Record<string, UserAnswer[]> = {};
        test.sections.forEach((section) => {
          initialAnswers[section.id] = section.questions.map((q) => ({
            questionId: q.id,
            selectedOptionId: null,
          }));
        });
        setUserAnswers(initialAnswers);
      } else {
        setError('Test not found');
      }
    } catch (err) {
      setError('Failed to load test');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveAnswer = (sectionId: string, questionId: number, selectedOptionId: string | null) => {
    setUserAnswers((prev) => {
      const sectionAnswers = [...(prev[sectionId] || [])];
      const answerIndex = sectionAnswers.findIndex((answer) => answer.questionId === questionId);

      if (answerIndex !== -1) {
        sectionAnswers[answerIndex] = { ...sectionAnswers[answerIndex], selectedOptionId };
      } else {
        sectionAnswers.push({ questionId, selectedOptionId });
      }

      return {
        ...prev,
        [sectionId]: sectionAnswers,
      };
    });
  };

  const calculateSectionResult = (sectionId: string): SectionResult | null => {
    if (!currentTest) return null;

    const section = currentTest.sections.find((s) => s.id === sectionId);
    if (!section) return null;

    const sectionAnswers = userAnswers[sectionId] || [];

    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;

    section.questions.forEach((question) => {
      const userAnswer = sectionAnswers.find((a) => a.questionId === question.id);
      if (!userAnswer || userAnswer.selectedOptionId === null) {
        unanswered++;
      } else if (userAnswer.selectedOptionId === question.correctOptionId) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }
    });

    const score =
      correctAnswers * currentTest.correctMarks - incorrectAnswers * currentTest.incorrectMarks;

    return {
      sectionId,
      totalQuestions: section.questions.length,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      score,
    };
  };

  const calculateDetailedSectionResult = (sectionId: string): DetailedSectionResult | null => {
    if (!currentTest) return null;

    const section = currentTest.sections.find((s) => s.id === sectionId);
    if (!section) return null;

    const sectionAnswers = userAnswers[sectionId] || [];

    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;
    const questionResults: QuestionResult[] = [];

    section.questions.forEach((question) => {
      const userAnswer = sectionAnswers.find((a) => a.questionId === question.id);
      const userSelectedOptionId = userAnswer?.selectedOptionId || null;
      const wasAnswered = userSelectedOptionId !== null;
      const isCorrect = wasAnswered && userSelectedOptionId === question.correctOptionId;

      let marksAwarded = 0;
      if (!wasAnswered) {
        unanswered++;
      } else if (isCorrect) {
        correctAnswers++;
        marksAwarded = currentTest.correctMarks;
      } else {
        incorrectAnswers++;
        marksAwarded = -currentTest.incorrectMarks;
      }

      questionResults.push({
        questionId: question.id,
        question,
        userSelectedOptionId,
        correctOptionId: question.correctOptionId,
        isCorrect,
        wasAnswered,
        marksAwarded,
      });
    });

    const score =
      correctAnswers * currentTest.correctMarks - incorrectAnswers * currentTest.incorrectMarks;

    return {
      sectionId,
      totalQuestions: section.questions.length,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      score,
      questionResults,
    };
  };

  const calculateResults = (): TestResult | null => {
    if (!currentTest) return null;

    const sectionResults: SectionResult[] = [];
    let totalMarks = 0;
    let obtainedMarks = 0;

    currentTest.sections.forEach((section) => {
      const sectionResult = calculateSectionResult(section.id);
      if (sectionResult) {
        sectionResults.push(sectionResult);
        totalMarks += sectionResult.totalQuestions * currentTest.correctMarks;
        obtainedMarks += sectionResult.score;
      }
    });

    const percentage = (obtainedMarks / totalMarks) * 100;
    const passed = percentage >= currentTest.passingPercentage;

    return {
      testId: currentTest.id,
      totalMarks,
      obtainedMarks,
      percentage,
      passed,
      sectionResults,
    };
  };

  const calculateDetailedResults = (): DetailedTestResult | null => {
    if (!currentTest) return null;

    const detailedSectionResults: DetailedSectionResult[] = [];
    const sectionResults: SectionResult[] = [];
    let totalMarks = 0;
    let obtainedMarks = 0;

    currentTest.sections.forEach((section) => {
      const detailedSectionResult = calculateDetailedSectionResult(section.id);
      if (detailedSectionResult) {
        detailedSectionResults.push(detailedSectionResult);

        // Create regular section result for compatibility
        const { questionResults, ...regularSectionResult } = detailedSectionResult;
        sectionResults.push(regularSectionResult);

        totalMarks += detailedSectionResult.totalQuestions * currentTest.correctMarks;
        obtainedMarks += detailedSectionResult.score;
      }
    });

    const percentage = (obtainedMarks / totalMarks) * 100;
    const passed = percentage >= currentTest.passingPercentage;

    return {
      testId: currentTest.id,
      totalMarks,
      obtainedMarks,
      percentage,
      passed,
      sectionResults,
      detailedSectionResults,
    };
  };

  return (
    <TestContext.Provider
      value={{
        currentTest,
        loading,
        error,
        currentSectionIndex,
        userAnswers,
        setCurrentSectionIndex,
        loadTest,
        saveAnswer,
        calculateResults,
        calculateDetailedResults,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

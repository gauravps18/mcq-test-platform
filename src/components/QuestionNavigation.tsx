import React from 'react';
import { UserAnswer } from '../types';

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswers: UserAnswer[];
  onNavigate: (index: number) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  currentQuestionIndex,
  totalQuestions,
  userAnswers,
  onNavigate,
}) => {
  return (
    <div className="question-navigation mb-4">
      <h5 className="mb-3">Question Navigation</h5>
      <div className="d-flex flex-wrap gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => i).map((index) => {
          const questionId = index + 1;
          const answer = userAnswers.find((a) => a.questionId === questionId);
          const isAnswered = answer && answer.selectedOptionId !== null;
          const isActive = currentQuestionIndex === index;

          return (
            <button
              key={index}
              className={`btn btn-sm ${
                isActive ? 'btn-primary' : isAnswered ? 'btn-success' : 'btn-outline-secondary'
              }`}
              onClick={() => onNavigate(index)}
            >
              {questionId}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigation;

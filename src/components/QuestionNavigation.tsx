import React from 'react';
import { UserAnswer } from '../types';

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswers: UserAnswer[];
  questionIds: number[];
  onNavigate: (index: number) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  currentQuestionIndex,
  totalQuestions,
  userAnswers,
  questionIds,
  onNavigate,
}) => {
  const answeredCount = userAnswers.filter((answer) => answer.selectedOptionId !== null).length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="question-navigation">
      <div className="nav-header">
        <h6 className="nav-title">Question Navigation</h6>
        <div className="nav-progress">
          <div className="progress-stats">
            <span className="answered-count">{answeredCount}</span>
            <span className="total-count">/{totalQuestions}</span>
          </div>
          <div className="progress-bar-small">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="nav-grid">
        {Array.from({ length: totalQuestions }, (_, i) => i).map((index) => {
          const questionId = questionIds[index];
          const answer = userAnswers.find((a) => a.questionId === questionId);
          const isAnswered = answer && answer.selectedOptionId !== null;
          const isActive = currentQuestionIndex === index;

          return (
            <button
              key={index}
              className={`nav-button ${
                isActive ? 'active' : isAnswered ? 'answered' : 'unanswered'
              }`}
              onClick={() => onNavigate(index)}
              title={`Question ${index + 1}${isAnswered ? ' (Answered)' : ' (Not answered)'}`}
            >
              <span className="question-number">{index + 1}</span>
              {isAnswered && <span className="answered-indicator">✓</span>}
            </button>
          );
        })}
      </div>

      <div className="nav-legend">
        <div className="legend-item">
          <div className="legend-color active"></div>
          <span>Current</span>
        </div>
        <div className="legend-item">
          <div className="legend-color answered"></div>
          <span>Answered</span>
        </div>
        <div className="legend-item">
          <div className="legend-color unanswered"></div>
          <span>Not answered</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;

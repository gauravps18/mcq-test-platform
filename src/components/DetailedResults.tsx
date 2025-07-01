import React, { useState } from 'react';
import { DetailedTestResult, QuestionResult } from '../types';

interface DetailedResultsProps {
  detailedResult: DetailedTestResult;
}

const formatTextWithBackticks = (text: string) => {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const content = part.slice(1, -1);
      return (
        <code
          key={index}
          className="px-2 py-1 rounded"
          style={{
            fontSize: '0.9em',
            fontFamily: 'monospace',
            backgroundColor: '#2d2d2d',
            color: '#f8f8f2',
            border: '1px solid #444',
          }}
        >
          {content}
        </code>
      );
    }
    return part;
  });
};

const QuestionResultCard: React.FC<{ questionResult: QuestionResult; questionNumber: number }> = ({
  questionResult,
  questionNumber,
}) => {
  const { question, userSelectedOptionId, correctOptionId, isCorrect, wasAnswered, marksAwarded } =
    questionResult;

  const getStatusColor = () => {
    if (!wasAnswered) return 'warning';
    return isCorrect ? 'success' : 'danger';
  };

  const getStatusText = () => {
    if (!wasAnswered) return 'Not Answered';
    return isCorrect ? 'Correct' : 'Incorrect';
  };

  const getUserSelectedOption = () => {
    return question.options.find((opt) => opt.id === userSelectedOptionId);
  };

  const getCorrectOption = () => {
    return question.options.find((opt) => opt.id === correctOptionId);
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Question {questionNumber}</h5>
        <div className="d-flex align-items-center gap-3">
          <span className={`badge bg-${getStatusColor()}`}>{getStatusText()}</span>
          <span className={`fw-bold ${marksAwarded >= 0 ? 'text-success' : 'text-danger'}`}>
            {marksAwarded >= 0 ? '+' : ''}
            {marksAwarded} marks
          </span>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <strong>Question:</strong>
          <div className="mt-2">{formatTextWithBackticks(question.text)}</div>
        </div>

        {question.codeSnippet && (
          <div className="mb-3">
            <strong>Code:</strong>
            <div className="mt-2">
              <pre
                className="p-3 border rounded"
                style={{
                  backgroundColor: '#0d1117',
                  color: '#f0f6fc',
                  border: '1px solid #30363d',
                }}
              >
                <code>{question.codeSnippet}</code>
              </pre>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <strong>Your Answer:</strong>
            <div
              className={`mt-2 p-2 rounded ${
                !wasAnswered
                  ? 'bg-warning bg-opacity-25'
                  : isCorrect
                  ? 'bg-success bg-opacity-25'
                  : 'bg-danger bg-opacity-25'
              }`}
            >
              {wasAnswered ? (
                <div>
                  <strong>{getUserSelectedOption()?.id.toUpperCase()}.</strong>{' '}
                  {formatTextWithBackticks(getUserSelectedOption()?.text || '')}
                </div>
              ) : (
                <em className="text-muted">No answer selected</em>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <strong>Correct Answer:</strong>
            <div className="mt-2 p-2 rounded bg-success bg-opacity-25">
              <div>
                <strong>{getCorrectOption()?.id.toUpperCase()}.</strong>{' '}
                {formatTextWithBackticks(getCorrectOption()?.text || '')}
              </div>
            </div>
          </div>
        </div>

        {!isCorrect && wasAnswered && (
          <div className="mt-3">
            <div className="alert alert-info">
              <strong>Explanation:</strong> The correct answer is{' '}
              <strong>{getCorrectOption()?.id.toUpperCase()}</strong>.{getCorrectOption()?.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailedResults: React.FC<DetailedResultsProps> = ({ detailedResult }) => {
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  if (!detailedResult.detailedSectionResults.length) {
    return <div className="alert alert-warning">No detailed results available.</div>;
  }

  const currentSection = detailedResult.detailedSectionResults[selectedSectionIndex];

  return (
    <div className="detailed-results">
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title mb-3">Question-wise Analysis</h3>

          {/* Section Tabs */}
          <ul className="nav nav-tabs card-header-tabs">
            {detailedResult.detailedSectionResults.map((section, index) => (
              <li className="nav-item" key={section.sectionId}>
                <button
                  className={`nav-link ${selectedSectionIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedSectionIndex(index)}
                >
                  Section {index + 1}
                  <small className="d-block">
                    {section.correctAnswers}/{section.totalQuestions} correct
                  </small>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body">
          {/* Section Summary */}
          <div className="row text-center mb-4">
            <div className="col">
              <h5>Total Questions</h5>
              <span className="badge bg-primary fs-6">{currentSection.totalQuestions}</span>
            </div>
            <div className="col">
              <h5>Correct</h5>
              <span className="badge bg-success fs-6">{currentSection.correctAnswers}</span>
            </div>
            <div className="col">
              <h5>Incorrect</h5>
              <span className="badge bg-danger fs-6">{currentSection.incorrectAnswers}</span>
            </div>
            <div className="col">
              <h5>Unanswered</h5>
              <span className="badge bg-warning fs-6">{currentSection.unanswered}</span>
            </div>
            <div className="col">
              <h5>Score</h5>
              <span className="badge bg-info fs-6">{currentSection.score} marks</span>
            </div>
          </div>

          {/* Question Results */}
          <div className="questions-results">
            {currentSection.questionResults.map((questionResult, index) => (
              <QuestionResultCard
                key={questionResult.questionId}
                questionResult={questionResult}
                questionNumber={index + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedResults;

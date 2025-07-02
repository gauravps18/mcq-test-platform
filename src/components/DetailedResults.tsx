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
    <div className="card mb-3 shadow-sm border-0">
      <div className="card-header d-flex justify-content-between align-items-center bg-dark py-2">
        <h6 className="mb-0 text-light">
          <i className="bi bi-question-circle me-2"></i>
          Question {questionNumber}
        </h6>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge bg-${getStatusColor()} px-2 py-1`}>
            <i
              className={`bi ${
                !wasAnswered ? 'bi-dash-circle' : isCorrect ? 'bi-check-circle' : 'bi-x-circle'
              } me-1`}
            ></i>
            {getStatusText()}
          </span>
          <span className={`fw-bold ${marksAwarded >= 0 ? 'text-success' : 'text-danger'}`}>
            {marksAwarded >= 0 ? '+' : ''}
            {marksAwarded} marks
          </span>
        </div>
      </div>
      <div className="card-body py-2">
        <div className="mb-3">
          <h6 className="text-primary mb-1 small">
            <i className="bi bi-chat-square-text me-1"></i>
            Question:
          </h6>
          <div className="p-2 bg-dark rounded border text-light">
            {formatTextWithBackticks(question.text)}
          </div>
        </div>

        {question.codeSnippet && (
          <div className="mb-3">
            <h6 className="text-primary mb-1 small">
              <i className="bi bi-code-slash me-1"></i>
              Code:
            </h6>
            <div className="code-snippet">
              <pre
                className="p-2 rounded border"
                style={{
                  backgroundColor: '#0d1117',
                  color: '#f0f6fc',
                  border: '1px solid #30363d',
                  fontSize: '0.85rem',
                  lineHeight: '1.3',
                }}
              >
                <code>{question.codeSnippet}</code>
              </pre>
            </div>
          </div>
        )}

        <div className="row g-2">
          <div className="col-md-6 mb-2">
            <h6 className="text-primary mb-1 small">
              <i className="bi bi-person-fill me-1"></i>
              Your Answer:
            </h6>
            <div
              className={`p-2 rounded border ${
                !wasAnswered
                  ? 'bg-warning bg-opacity-25 border-warning'
                  : isCorrect
                  ? 'bg-success bg-opacity-25 border-success'
                  : 'bg-danger bg-opacity-25 border-danger'
              }`}
            >
              {wasAnswered ? (
                <div className="text-light small">
                  <span className="badge bg-secondary me-1">
                    {getUserSelectedOption()?.id.toUpperCase()}
                  </span>
                  {formatTextWithBackticks(getUserSelectedOption()?.text || '')}
                </div>
              ) : (
                <div className="text-muted fst-italic small">
                  <i className="bi bi-dash-circle me-1"></i>
                  No answer selected
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-2">
            <h6 className="text-success mb-1 small">
              <i className="bi bi-check-circle-fill me-1"></i>
              Correct Answer:
            </h6>
            <div className="p-2 rounded border bg-success bg-opacity-25 border-success">
              <div className="text-light small">
                <span className="badge bg-success me-1">
                  {getCorrectOption()?.id.toUpperCase()}
                </span>
                {formatTextWithBackticks(getCorrectOption()?.text || '')}
              </div>
            </div>
          </div>
        </div>

        {!isCorrect && wasAnswered && (
          <div className="mt-2">
            <div className="alert alert-info py-2 px-3 border-0 bg-info bg-opacity-25 mb-0">
              <h6 className="alert-heading text-info mb-1 small">
                <i className="bi bi-lightbulb me-1"></i>
                Explanation:
              </h6>
              <p className="mb-0 text-light small">
                The correct answer is <strong>{getCorrectOption()?.id.toUpperCase()}</strong>:{' '}
                {getCorrectOption()?.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailedResults: React.FC<DetailedResultsProps> = ({ detailedResult }) => {
  if (!detailedResult.detailedSectionResults.length) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="alert alert-warning text-center bg-warning bg-opacity-25 border-warning">
            <i className="bi bi-exclamation-triangle fs-1 mb-3 text-warning"></i>
            <h4 className="text-light">No Analysis Available</h4>
            <p className="mb-0 text-light">
              Detailed question analysis is not available for this test.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = detailedResult.detailedSectionResults[0];

  return (
    <div className="detailed-results">
      {/* Section Summary */}
      <div className="card mb-3 shadow-sm border-0">
        <div className="card-header bg-dark py-2">
          <h5 className="card-title mb-0 text-light">
            <i className="bi bi-graph-up me-2"></i>
            Section Summary
          </h5>
        </div>
        <div className="card-body py-2">
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="d-flex align-items-center me-3 mb-2">
              <i className="bi bi-list-ul text-primary me-2"></i>
              <span className="text-light me-1">Total:</span>
              <span className="badge bg-primary">{currentSection.totalQuestions}</span>
            </div>
            <div className="d-flex align-items-center me-3 mb-2">
              <i className="bi bi-check-circle text-success me-2"></i>
              <span className="text-light me-1">Correct:</span>
              <span className="badge bg-success">{currentSection.correctAnswers}</span>
            </div>
            <div className="d-flex align-items-center me-3 mb-2">
              <i className="bi bi-x-circle text-danger me-2"></i>
              <span className="text-light me-1">Incorrect:</span>
              <span className="badge bg-danger">{currentSection.incorrectAnswers}</span>
            </div>
            <div className="d-flex align-items-center me-3 mb-2">
              <i className="bi bi-dash-circle text-warning me-2"></i>
              <span className="text-light me-1">Skipped:</span>
              <span className="badge bg-warning">{currentSection.unanswered}</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-trophy text-info me-2"></i>
              <span className="text-light me-1">Score:</span>
              <span className="badge bg-info">{currentSection.score} marks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Results */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark py-2">
          <h5 className="card-title mb-0 text-light">
            <i className="bi bi-question-circle me-2"></i>
            Question Analysis
          </h5>
        </div>
        <div className="card-body p-2">
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

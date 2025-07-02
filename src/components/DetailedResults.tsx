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
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header d-flex justify-content-between align-items-center bg-dark">
        <h5 className="mb-0 text-light">
          <i className="bi bi-question-circle me-2"></i>
          Question {questionNumber}
        </h5>
        <div className="d-flex align-items-center gap-3">
          <span className={`badge bg-${getStatusColor()} px-3 py-2`}>
            <i
              className={`bi ${
                !wasAnswered ? 'bi-dash-circle' : isCorrect ? 'bi-check-circle' : 'bi-x-circle'
              } me-1`}
            ></i>
            {getStatusText()}
          </span>
          <span className={`fw-bold fs-5 ${marksAwarded >= 0 ? 'text-success' : 'text-danger'}`}>
            {marksAwarded >= 0 ? '+' : ''}
            {marksAwarded} marks
          </span>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <h6 className="text-primary mb-2">
            <i className="bi bi-chat-square-text me-2"></i>
            Question:
          </h6>
          <div className="p-3 bg-dark rounded border text-light">
            {formatTextWithBackticks(question.text)}
          </div>
        </div>

        {question.codeSnippet && (
          <div className="mb-4">
            <h6 className="text-primary mb-2">
              <i className="bi bi-code-slash me-2"></i>
              Code:
            </h6>
            <div className="code-snippet">
              <pre
                className="p-3 rounded border"
                style={{
                  backgroundColor: '#0d1117',
                  color: '#f0f6fc',
                  border: '1px solid #30363d',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                }}
              >
                <code>{question.codeSnippet}</code>
              </pre>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-md-6 mb-3">
            <h6 className="text-primary mb-2">
              <i className="bi bi-person-fill me-2"></i>
              Your Answer:
            </h6>
            <div
              className={`p-3 rounded border ${
                !wasAnswered
                  ? 'bg-warning bg-opacity-25 border-warning'
                  : isCorrect
                  ? 'bg-success bg-opacity-25 border-success'
                  : 'bg-danger bg-opacity-25 border-danger'
              }`}
            >
              {wasAnswered ? (
                <div className="text-light">
                  <span className="badge bg-secondary me-2">
                    {getUserSelectedOption()?.id.toUpperCase()}
                  </span>
                  {formatTextWithBackticks(getUserSelectedOption()?.text || '')}
                </div>
              ) : (
                <div className="text-muted fst-italic">
                  <i className="bi bi-dash-circle me-2"></i>
                  No answer selected
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <h6 className="text-success mb-2">
              <i className="bi bi-check-circle-fill me-2"></i>
              Correct Answer:
            </h6>
            <div className="p-3 rounded border bg-success bg-opacity-25 border-success">
              <div className="text-light">
                <span className="badge bg-success me-2">
                  {getCorrectOption()?.id.toUpperCase()}
                </span>
                {formatTextWithBackticks(getCorrectOption()?.text || '')}
              </div>
            </div>
          </div>
        </div>

        {!isCorrect && wasAnswered && (
          <div className="mt-3">
            <div className="alert alert-info border-0 bg-info bg-opacity-25">
              <h6 className="alert-heading text-info">
                <i className="bi bi-lightbulb me-2"></i>
                Explanation:
              </h6>
              <p className="mb-0 text-light">
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
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

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

  const currentSection = detailedResult.detailedSectionResults[selectedSectionIndex];

  return (
    <div className="detailed-results">
      {/* Section Navigation */}
      {detailedResult.detailedSectionResults.length > 1 && (
        <div className="card mb-4 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title mb-3 text-light">
              <i className="bi bi-layers me-2"></i>
              Select Section
            </h5>
            <div className="d-flex flex-wrap gap-2">
              {detailedResult.detailedSectionResults.map((section, index) => (
                <button
                  key={section.sectionId}
                  className={`btn ${
                    selectedSectionIndex === index ? 'btn-primary' : 'btn-outline-primary'
                  }`}
                  onClick={() => setSelectedSectionIndex(index)}
                >
                  <div className="d-flex flex-column align-items-center">
                    <span>Section {index + 1}</span>
                    <small>
                      {section.correctAnswers}/{section.totalQuestions}
                    </small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Summary */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-dark">
          <h4 className="card-title mb-0 text-light">
            <i className="bi bi-graph-up me-2"></i>
            Section {selectedSectionIndex + 1} Summary
          </h4>
        </div>
        <div className="card-body">
          <div className="row text-center">
            <div className="col-6 col-md">
              <div className="border border-secondary rounded p-3 bg-dark">
                <i className="bi bi-list-ul text-primary fs-3"></i>
                <h5 className="mt-2 mb-1 text-light">Total</h5>
                <span className="badge bg-primary fs-6">{currentSection.totalQuestions}</span>
              </div>
            </div>
            <div className="col-6 col-md">
              <div className="border border-secondary rounded p-3 bg-dark">
                <i className="bi bi-check-circle text-success fs-3"></i>
                <h5 className="mt-2 mb-1 text-light">Correct</h5>
                <span className="badge bg-success fs-6">{currentSection.correctAnswers}</span>
              </div>
            </div>
            <div className="col-6 col-md">
              <div className="border border-secondary rounded p-3 bg-dark">
                <i className="bi bi-x-circle text-danger fs-3"></i>
                <h5 className="mt-2 mb-1 text-light">Incorrect</h5>
                <span className="badge bg-danger fs-6">{currentSection.incorrectAnswers}</span>
              </div>
            </div>
            <div className="col-6 col-md">
              <div className="border border-secondary rounded p-3 bg-dark">
                <i className="bi bi-dash-circle text-warning fs-3"></i>
                <h5 className="mt-2 mb-1 text-light">Skipped</h5>
                <span className="badge bg-warning fs-6">{currentSection.unanswered}</span>
              </div>
            </div>
            <div className="col-12 col-md">
              <div className="border border-secondary rounded p-3 bg-dark">
                <i className="bi bi-trophy text-info fs-3"></i>
                <h5 className="mt-2 mb-1 text-light">Score</h5>
                <span className="badge bg-info fs-6">{currentSection.score} marks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Results */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark">
          <h4 className="card-title mb-0 text-light">
            <i className="bi bi-question-circle me-2"></i>
            Question Analysis
          </h4>
        </div>
        <div className="card-body">
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

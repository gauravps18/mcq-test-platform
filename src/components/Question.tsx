import React from 'react';
import { Question as QuestionType } from '../types';

interface QuestionProps {
  question: QuestionType;
  selectedOptionId: string | null;
  onSelectOption: (questionId: number, optionId: string) => void;
}

const formatTextWithBackticks = (text: string) => {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      // Remove the backticks and apply special formatting
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

const Question: React.FC<QuestionProps> = ({ question, selectedOptionId, onSelectOption }) => {
  return (
    <div className="question-container">
      <div className="question-header">
        <div className="question-badge">
          <span className="question-icon">❓</span>
          <span>Question {question.id}</span>
        </div>
      </div>

      <div className="question-content">
        <div className="question-text">{formatTextWithBackticks(question.text)}</div>

        {question.codeSnippet && (
          <div className="code-snippet-container">
            <div className="code-header">
              <span className="code-icon">💻</span>
              <span>Code</span>
            </div>
            <pre className="code-snippet">
              <code>{question.codeSnippet}</code>
            </pre>
          </div>
        )}

        <div className="options-container">
          <div className="options-header">
            <span className="options-title">Choose your answer:</span>
          </div>

          <div className="options-list">
            {question.options.map((option, index) => (
              <div
                className={`option-item ${selectedOptionId === option.id ? 'selected' : ''}`}
                key={option.id}
                onClick={() => onSelectOption(question.id, option.id)}
              >
                <div className="option-radio">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`question-${question.id}-option-${option.id}`}
                    name={`question-${question.id}`}
                    checked={selectedOptionId === option.id}
                    onChange={() => onSelectOption(question.id, option.id)}
                  />
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                </div>
                <label
                  className="option-label"
                  htmlFor={`question-${question.id}-option-${option.id}`}
                >
                  {formatTextWithBackticks(option.text)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;

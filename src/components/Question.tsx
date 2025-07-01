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
    <div className="card mb-4">
      <div className="card-header">
        <h4 className="card-title">Question {question.id}</h4>
      </div>
      <div className="card-body">
        <p className="question-text mb-4">{formatTextWithBackticks(question.text)}</p>

        {question.codeSnippet && (
          <div className="code-snippet-container mb-4">
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
        )}

        <div className="options-container">
          {question.options.map((option) => (
            <div className="form-check mb-2" key={option.id}>
              <input
                className="form-check-input"
                type="radio"
                id={`question-${question.id}-option-${option.id}`}
                name={`question-${question.id}`}
                checked={selectedOptionId === option.id}
                onChange={() => onSelectOption(question.id, option.id)}
              />
              <label
                className="form-check-label"
                htmlFor={`question-${question.id}-option-${option.id}`}
              >
                {formatTextWithBackticks(option.text)}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Question;

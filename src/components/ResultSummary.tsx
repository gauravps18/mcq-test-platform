import React, { useState } from 'react';
import { TestResult, DetailedTestResult } from '../types';
import DetailedResults from './DetailedResults';

interface ResultSummaryProps {
  result: TestResult;
  detailedResult?: DetailedTestResult;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ result, detailedResult }) => {
  const [showDetailed, setShowDetailed] = useState(false);

  return (
    <div className="result-summary">
      <div className="card mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">Test Result</h3>
            {detailedResult && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowDetailed(!showDetailed)}
              >
                {showDetailed ? 'Hide' : 'Show'} Question Analysis
              </button>
            )}
          </div>
        </div>
        <div className="card-body">
          <div className="row text-center mb-4">
            <div className="col">
              <h4 className="mb-2">Total Marks</h4>
              <p className="display-6">{result.totalMarks}</p>
            </div>
            <div className="col">
              <h4 className="mb-2">Obtained Marks</h4>
              <p className="display-6">{result.obtainedMarks}</p>
            </div>
            <div className="col">
              <h4 className="mb-2">Percentage</h4>
              <p className="display-6">{result.percentage.toFixed(2)}%</p>
            </div>
            <div className="col">
              <h4 className="mb-2">Status</h4>
              <p className={`display-6 ${result.passed ? 'text-success' : 'text-danger'}`}>
                {result.passed ? 'PASS' : 'FAIL'}
              </p>
            </div>
          </div>

          <h4 className="mb-3">Section Wise Performance</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-dark">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Total Questions</th>
                  <th>Correct</th>
                  <th>Incorrect</th>
                  <th>Unanswered</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {result.sectionResults.map((sectionResult, index) => (
                  <tr key={sectionResult.sectionId}>
                    <td>Section {index + 1}</td>
                    <td>{sectionResult.totalQuestions}</td>
                    <td className="text-success">{sectionResult.correctAnswers}</td>
                    <td className="text-danger">{sectionResult.incorrectAnswers}</td>
                    <td>{sectionResult.unanswered}</td>
                    <td>{sectionResult.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Show detailed results if requested */}
      {showDetailed && detailedResult && <DetailedResults detailedResult={detailedResult} />}
    </div>
  );
};

export default ResultSummary;

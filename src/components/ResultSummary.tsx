import React from 'react';
import { TestResult } from '../types';

interface ResultSummaryProps {
  result: TestResult;
  testId?: string;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  // Calculate performance grade
  const getPerformanceGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'success', icon: 'bi-trophy-fill' };
    if (percentage >= 80) return { grade: 'A', color: 'success', icon: 'bi-star-fill' };
    if (percentage >= 70) return { grade: 'B+', color: 'info', icon: 'bi-star-half' };
    if (percentage >= 60) return { grade: 'B', color: 'warning', icon: 'bi-star' };
    if (percentage >= 50) return { grade: 'C', color: 'warning', icon: 'bi-dash-circle' };
    return { grade: 'F', color: 'danger', icon: 'bi-x-circle-fill' };
  };

  const performance = getPerformanceGrade(result.percentage);

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        {/* Main Result Card */}
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body text-center p-3">
            {/* Score Circle */}
            <div className="mb-3">
              <div
                className={`mx-auto rounded-circle d-flex align-items-center justify-content-center text-white`}
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: result.passed ? '#28a745' : '#dc3545',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                }}
              >
                {result.percentage.toFixed(0)}%
              </div>
            </div>

            {/* Status */}
            <h2 className={`mb-3 ${result.passed ? 'text-success' : 'text-danger'}`}>
              <i className={`${performance.icon} me-2`}></i>
              {result.passed ? 'Congratulations!' : 'Keep Trying!'}
            </h2>

            <p className="lead text-muted mb-4">
              You scored <strong className="text-light">{result.obtainedMarks}</strong> out of{' '}
              <strong className="text-light">{result.totalMarks}</strong> marks
            </p>

            {/* Grade Badge */}
            <div className="mb-1">
              <span className={`badge bg-${performance.color} fs-4 px-4 py-2`}>
                Grade: {performance.grade}
              </span>
            </div>
          </div>
        </div>

        {/* Section Performance */}
        <div className="card shadow border-0">
          <div className="card-header bg-dark">
            <h4 className="card-title mb-0 text-light">
              <i className="bi bi-bar-chart-line me-2"></i>
              Section Performance
            </h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover table-dark mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Section</th>
                    <th className="text-center">Questions</th>
                    <th className="text-center">
                      <span className="text-success">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        Correct
                      </span>
                    </th>
                    <th className="text-center">
                      <span className="text-danger">
                        <i className="bi bi-x-circle-fill me-1"></i>
                        Incorrect
                      </span>
                    </th>
                    <th className="text-center">
                      <span className="text-warning">
                        <i className="bi bi-dash-circle-fill me-1"></i>
                        Unanswered
                      </span>
                    </th>
                    <th className="text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {result.sectionResults.map((sectionResult, index) => (
                    <tr key={sectionResult.sectionId}>
                      <td>
                        <strong className="text-light">Section {index + 1}</strong>
                      </td>
                      <td className="text-center">{sectionResult.totalQuestions}</td>
                      <td className="text-center">
                        <span className="badge bg-success">{sectionResult.correctAnswers}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-danger">{sectionResult.incorrectAnswers}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-warning">{sectionResult.unanswered}</span>
                      </td>
                      <td className="text-center">
                        <strong className="text-light">{sectionResult.score}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;

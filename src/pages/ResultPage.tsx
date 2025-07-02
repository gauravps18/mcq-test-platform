import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import ResultSummary from '../components/ResultSummary';

const ResultPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { currentTest, loading, error, loadTest, calculateResults } = useTest();

  useEffect(() => {
    if (testId && (!currentTest || currentTest.id !== testId)) {
      loadTest(testId);
    }
  }, [testId, currentTest]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: '3rem', height: '3rem' }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Calculating your results...</p>
        </div>
      </div>
    );
  }

  if (error || !currentTest) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              className="alert alert-danger text-center bg-danger bg-opacity-25 border-danger"
              role="alert"
            >
              <h4 className="alert-heading text-light">Error</h4>
              <p className="text-light">{error || 'Test not found'}</p>
              <button className="btn btn-outline-light" onClick={() => navigate('/')}>
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const result = calculateResults();

  if (!result) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              className="alert alert-warning text-center bg-warning bg-opacity-25 border-warning"
              role="alert"
            >
              <h4 className="alert-heading text-light">Results Unavailable</h4>
              <p className="text-light">Failed to calculate test results</p>
              <button className="btn btn-outline-light" onClick={() => navigate('/')}>
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleRetakeTest = () => {
    navigate(`/test/${testId}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewDetails = () => {
    navigate(`/result/${testId}/details`);
  };

  return (
    <div className="container py-3">
      <div className="text-center mb-3">
        <h3 className="display-4 fw-bold mb-2 text-light">Test Completed!</h3>
        <p className="lead text-light">{currentTest.title}</p>
      </div>

      <ResultSummary result={result} />

      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
            <button className="btn btn-outline-primary btn-lg" onClick={handleViewDetails}>
              <i className="bi bi-list-ul me-2"></i>
              View Question Analysis
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleRetakeTest}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Retake Test
            </button>
            <button className="btn btn-outline-secondary btn-lg" onClick={handleGoHome}>
              <i className="bi bi-house me-2"></i>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;

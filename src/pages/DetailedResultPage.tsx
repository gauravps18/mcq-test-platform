import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import DetailedResults from '../components/DetailedResults';

const DetailedResultPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { currentTest, loading, error, loadTest, calculateDetailedResults } = useTest();

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
          <p className="mt-3 text-muted">Loading detailed results...</p>
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

  const detailedResult = calculateDetailedResults();

  if (!detailedResult) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              className="alert alert-warning text-center bg-warning bg-opacity-25 border-warning"
              role="alert"
            >
              <h4 className="alert-heading text-light">No Results Available</h4>
              <p className="text-light">Detailed results could not be calculated</p>
              <button
                className="btn btn-outline-light"
                onClick={() => navigate(`/result/${testId}`)}
              >
                Back to Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1 text-light">{currentTest.title}</h1>
              <p className="text-muted mb-0">Detailed Question Analysis</p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(`/result/${testId}`)}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Summary
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                <i className="bi bi-house me-2"></i>
                Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <DetailedResults detailedResult={detailedResult} />
    </div>
  );
};

export default DetailedResultPage;

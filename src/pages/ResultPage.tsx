import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import ResultSummary from '../components/ResultSummary';

const ResultPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { currentTest, loading, error, loadTest, calculateResults, calculateDetailedResults } =
    useTest();

  useEffect(() => {
    if (testId && (!currentTest || currentTest.id !== testId)) {
      loadTest(testId);
    }
  }, [testId, currentTest, loadTest]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !currentTest) {
    return (
      <div className="alert alert-danger" role="alert">
        {error || 'Test not found'}
      </div>
    );
  }

  const result = calculateResults();
  const detailedResult = calculateDetailedResults();

  if (!result) {
    return (
      <div className="alert alert-danger" role="alert">
        Failed to calculate results
      </div>
    );
  }

  const handleRetakeTest = () => {
    navigate(`/test/${testId}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="container py-5">
      <h1 className="display-5 text-center mb-5">{currentTest.title} - Results</h1>

      <ResultSummary result={result} detailedResult={detailedResult || undefined} />

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="btn btn-primary" onClick={handleRetakeTest}>
          Retake Test
        </button>
        <button className="btn btn-secondary" onClick={handleGoHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ResultPage;

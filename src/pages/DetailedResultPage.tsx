import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import DetailedResults from '../components/DetailedResults';
import SectionTabs from '../components/SectionTabs';

const DetailedResultPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { currentTest, loading, error, loadTest, calculateDetailedResults } = useTest();
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

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

  // Get sections from the detailed result
  const sections = detailedResult.detailedSectionResults.map((section, index) => ({
    id: section.sectionId,
    title: `Section ${index + 1}`,
    questions: section.questionResults.map((qr) => qr.question),
  }));

  const handleSectionChange = (index: number) => {
    setSelectedSectionIndex(index);
  };

  return (
    <div className="detailed-result-page vh-100 d-flex flex-column overflow-hidden">
      {/* Header */}
      <div className="bg-dark border-bottom border-secondary py-3">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1 text-light">{currentTest.title}</h1>
              <p className="text-light mb-0">Detailed Question Analysis</p>
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

      {/* Main Content with Left Panel */}
      <div className="flex-grow-1 d-flex overflow-hidden">
        {/* Left Panel - Section Tabs */}
        <div
          className="left-panel bg-dark border-end border-secondary"
          style={{ width: '280px', overflow: 'auto' }}
        >
          <SectionTabs
            sections={sections}
            currentSectionIndex={selectedSectionIndex}
            onSectionChange={handleSectionChange}
          />
        </div>

        {/* Main Content - Detailed Results */}
        <div className="flex-grow-1 p-4">
          <DetailedResults
            detailedResult={{
              ...detailedResult,
              detailedSectionResults: [detailedResult.detailedSectionResults[selectedSectionIndex]],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailedResultPage;

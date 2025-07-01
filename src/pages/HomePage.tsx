import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TestGroup } from '../types';
import { fetchTestGroups } from '../services/api';

const HomePage: React.FC = () => {
  const [testGroups, setTestGroups] = useState<TestGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestGroup, setSelectedTestGroup] = useState<TestGroup | null>(null);

  useEffect(() => {
    const loadTestGroups = async () => {
      try {
        const fetchedTestGroups = await fetchTestGroups();
        setTestGroups(fetchedTestGroups);
      } catch (err) {
        setError('Failed to load test groups');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTestGroups();
  }, []);

  if (loading) {
    return (
      <div className="homepage-container">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="loading-text">Loading amazing tests for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🚀</span>
            <span>Test Your Knowledge</span>
          </div>
          <h1 className="hero-title">MCQ Test Platform</h1>
          <p className="hero-subtitle">
            Challenge yourself with our comprehensive collection of multiple-choice questions. Track
            your progress and master new concepts.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{testGroups.length}</div>
              <div className="stat-label">Test Groups</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {testGroups.reduce((total, group) => total + group.sections.length, 0)}
              </div>
              <div className="stat-label">Total Sections</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Learning</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="content-header">
            <div className="breadcrumb-nav">
              {selectedTestGroup && (
                <>
                  <button className="breadcrumb-link" onClick={() => setSelectedTestGroup(null)}>
                    All Tests
                  </button>
                  <span className="breadcrumb-separator">›</span>
                  <span className="breadcrumb-current">{selectedTestGroup.title}</span>
                </>
              )}
              {!selectedTestGroup && <span className="breadcrumb-current">All Tests</span>}
            </div>
            <h2 className="content-title">
              {selectedTestGroup ? `${selectedTestGroup.title} Sections` : 'Choose Your Test'}
            </h2>
            <p className="content-subtitle">
              {selectedTestGroup
                ? 'Select a section to begin your assessment'
                : 'Browse through our collection of tests and find the perfect challenge for you'}
            </p>
          </div>

          {!selectedTestGroup ? (
            // Show test groups with card grid
            <>
              {testGroups.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📚</div>
                  <h3>No tests available</h3>
                  <p>Check back later for new tests and challenges!</p>
                </div>
              ) : (
                <div className="test-grid">
                  {testGroups.map((testGroup) => (
                    <div
                      key={testGroup.id}
                      className="test-card"
                      onClick={() => setSelectedTestGroup(testGroup)}
                    >
                      <div className="test-card-header">
                        <div className="test-category">
                          <span className={`category-badge ${testGroup.category.toLowerCase()}`}>
                            {testGroup.category}
                          </span>
                        </div>
                        <div className={`difficulty-badge ${testGroup.difficulty.toLowerCase()}`}>
                          {testGroup.difficulty}
                        </div>
                      </div>
                      <div className="test-card-body">
                        <h3 className="test-title">{testGroup.title}</h3>
                        <p className="test-description">{testGroup.description}</p>
                        <div className="test-meta">
                          <div className="meta-item">
                            <span className="meta-icon">📋</span>
                            <span>{testGroup.sections.length} Sections</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-icon">⏱️</span>
                            <span>
                              {testGroup.sections.reduce(
                                (total, section) => total + (section.estimatedDuration || 0),
                                0
                              )}{' '}
                              min total
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="test-card-footer">
                        <button className="start-test-btn">
                          <span>Explore Sections</span>
                          <span className="btn-arrow">→</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Show sections within selected test group
            <div className="sections-grid">
              {selectedTestGroup.sections.map((section, index) => (
                <Link key={section.id} to={`/test/${section.id}`} className="section-card">
                  <div className="section-number">{index + 1}</div>
                  <div className="section-content">
                    <h4 className="section-title">{section.title}</h4>
                    <p className="section-description">{section.description}</p>
                    <div className="section-duration">
                      <span className="duration-icon">⏰</span>
                      <span>{section.estimatedDuration} minutes</span>
                    </div>
                  </div>
                  <div className="section-action">
                    <button className="section-start-btn">Start Section</button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

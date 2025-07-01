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
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="display-4 text-center mb-5">MCQ Test Platform</h1>

      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="card-title h4 mb-0">
                {selectedTestGroup ? `${selectedTestGroup.title} - Sections` : 'Available Tests'}
              </h2>
              {selectedTestGroup && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setSelectedTestGroup(null)}
                >
                  ← Back to Tests
                </button>
              )}
            </div>
            <div className="card-body">
              {!selectedTestGroup ? (
                // Show test groups
                <>
                  {testGroups.length === 0 ? (
                    <p className="text-center">No tests available at the moment.</p>
                  ) : (
                    <div className="list-group">
                      {testGroups.map((testGroup) => (
                        <div
                          key={testGroup.id}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedTestGroup(testGroup)}
                        >
                          <div>
                            <h5 className="mb-1">{testGroup.title}</h5>
                            <p className="mb-1 text-muted">{testGroup.description}</p>
                            <small className="text-muted">
                              Sections: {testGroup.sections.length} | Difficulty:{' '}
                              <span className="text-capitalize">{testGroup.difficulty}</span> |
                              Category: {testGroup.category}
                            </small>
                          </div>
                          <div className="text-end">
                            <div className="badge bg-primary mb-2">
                              {testGroup.sections.length} Sections
                            </div>
                            <br />
                            <small className="text-muted">Click to view sections</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Show sections within selected test group
                <div className="list-group">
                  {selectedTestGroup.sections.map((section) => (
                    <Link
                      key={section.id}
                      to={`/test/${section.id}`}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h5 className="mb-1">{section.title}</h5>
                        <p className="mb-1 text-muted">{section.description}</p>
                        <small className="text-muted">
                          Duration: {section.estimatedDuration} minutes
                        </small>
                      </div>
                      <button className="btn btn-primary btn-sm">Start Section</button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

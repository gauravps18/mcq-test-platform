import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import Question from '../components/Question';
import QuestionNavigation from '../components/QuestionNavigation';
import SectionTabs from '../components/SectionTabs';
import ConfirmationModal from '../components/ConfirmationModal';

const TestPage: React.FC = () => {
  const { testId } = useParams<{
    testId: string;
  }>();
  const navigate = useNavigate();
  const {
    currentTest,
    loading,
    error,
    currentSectionIndex,
    userAnswers,
    setCurrentSectionIndex,
    loadTest,
    saveAnswer,
  } = useTest();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60 * 60); // 60 minutes in seconds
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState<boolean>(false);

  // Load the test
  useEffect(() => {
    if (testId) {
      loadTest(testId);
      setIsTestActive(true);
    }
  }, [testId]);

  // Add page refresh confirmation when test is active
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isTestActive) {
        const message = 'Are you sure you want to leave? Your test progress will be lost.';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTestActive]);

  // Timer functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!loading && currentTest && isTestActive) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTestActive(false);
            navigate(`/result/${testId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, currentTest, isTestActive, testId]);

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

  const currentSection = currentTest.sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];
  const sectionAnswers = userAnswers[currentSection.id] || [];
  const currentAnswer = sectionAnswers.find((a) => a.questionId === currentQuestion.id);
  const selectedOptionId = currentAnswer ? currentAnswer.selectedOptionId : null;
  const questionIds = currentSection.questions.map((q) => q.id);

  const handleSelectOption = (questionId: number, optionId: string) => {
    saveAnswer(currentSection.id, questionId, optionId);
  };

  const handleNavigateQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleNavigateSection = (index: number) => {
    setCurrentSectionIndex(index);
    setCurrentQuestionIndex(0);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      // Go to the last question of the previous section
      const prevSectionIndex = currentSectionIndex - 1;
      const prevSection = currentTest.sections[prevSectionIndex];
      setCurrentSectionIndex(prevSectionIndex);
      setCurrentQuestionIndex(prevSection.questions.length - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < currentTest.sections.length - 1) {
      // Go to the first question of the next section
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmitTest = () => {
    setShowSubmitConfirmation(true);
  };

  const handleConfirmSubmit = () => {
    setIsTestActive(false);
    setShowSubmitConfirmation(false);
    navigate(`/result/${testId}`);
  };

  const handleCancelSubmit = () => {
    setShowSubmitConfirmation(false);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="test-page-container">
      {/* Header Section */}
      <div className="test-header">
        <div className="container">
          <div className="test-header-content">
            <div className="test-info">
              <div className="test-badge">
                <span className="badge-icon">📝</span>
                <span>Active Test</span>
              </div>
              <h1 className="test-title">{currentTest.title}</h1>
              <div className="test-meta">
                <div className="meta-item">
                  <span className="meta-icon">📋</span>
                  <span>
                    Section {currentSectionIndex + 1} of {currentTest.sections.length}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">❓</span>
                  <span>
                    Question {currentQuestionIndex + 1} of {currentSection.questions.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="timer-container">
              <div className="timer-label">Time Remaining</div>
              <div className={`timer-display ${timeRemaining < 300 ? 'timer-warning' : ''}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="test-main-content">
        <div className="container">
          <div className="test-layout">
            {/* Left Sidebar - Section Navigation */}
            <div className="test-sidebar-left">
              <SectionTabs
                sections={currentTest.sections}
                currentSectionIndex={currentSectionIndex}
                onSectionChange={handleNavigateSection}
              />
            </div>

            {/* Main Question Area */}
            <div className="test-content">
              <Question
                question={currentQuestion}
                selectedOptionId={selectedOptionId}
                onSelectOption={handleSelectOption}
              />

              <div className="question-controls">
                <button
                  className="btn btn-secondary btn-nav"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0 && currentSectionIndex === 0}
                >
                  <span className="btn-icon">←</span>
                  Previous
                </button>

                <div className="progress-info">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(() => {
                          let totalQuestions = 0;
                          let completedQuestions = 0;

                          for (let i = 0; i < currentTest.sections.length; i++) {
                            totalQuestions += currentTest.sections[i].questions.length;
                            if (i < currentSectionIndex) {
                              completedQuestions += currentTest.sections[i].questions.length;
                            } else if (i === currentSectionIndex) {
                              completedQuestions += currentQuestionIndex + 1;
                            }
                          }

                          return (completedQuestions / totalQuestions) * 100;
                        })()}%`,
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {(() => {
                      let totalQuestions = 0;
                      let completedQuestions = 0;

                      for (let i = 0; i < currentTest.sections.length; i++) {
                        totalQuestions += currentTest.sections[i].questions.length;
                        if (i < currentSectionIndex) {
                          completedQuestions += currentTest.sections[i].questions.length;
                        } else if (i === currentSectionIndex) {
                          completedQuestions += currentQuestionIndex + 1;
                        }
                      }

                      return `${completedQuestions} of ${totalQuestions}`;
                    })()}
                  </span>
                </div>

                {currentQuestionIndex === currentSection.questions.length - 1 &&
                currentSectionIndex === currentTest.sections.length - 1 ? (
                  <button className="btn btn-success btn-nav" onClick={handleSubmitTest}>
                    <span className="btn-icon">✓</span>
                    Submit Test
                  </button>
                ) : (
                  <button className="btn btn-primary btn-nav" onClick={handleNextQuestion}>
                    Next
                    <span className="btn-icon">→</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Sidebar - Question Navigation */}
            <div className="test-sidebar-right">
              <div className="question-nav-card">
                <QuestionNavigation
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={currentSection.questions.length}
                  userAnswers={sectionAnswers}
                  questionIds={questionIds}
                  onNavigate={handleNavigateQuestion}
                />
              </div>

              <div className="sidebar-section">
                <div className="section-info-card">
                  <div className="section-header">
                    <h5 className="section-title">{currentSection.title}</h5>
                    <div className="section-progress">
                      {
                        sectionAnswers.filter(
                          (answer) =>
                            answer.selectedOptionId !== null &&
                            answer.selectedOptionId !== undefined
                        ).length
                      }{' '}
                      of {currentSection.questions.length} answered
                    </div>
                  </div>

                  <div className="sidebar-actions">
                    <button className="btn btn-success btn-submit" onClick={handleSubmitTest}>
                      <span className="btn-icon">✓</span>
                      Submit Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showSubmitConfirmation}
        title="Submit Test"
        message="Are you sure you want to submit the test? You will not be able to change your answers after submission."
        confirmText="Submit Test"
        cancelText="Continue Test"
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        variant="warning"
      />
    </div>
  );
};

export default TestPage;

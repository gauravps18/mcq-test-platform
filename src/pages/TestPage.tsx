import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import Question from '../components/Question';
import QuestionNavigation from '../components/QuestionNavigation';
import SectionTabs from '../components/SectionTabs';

const TestPage: React.FC = () => {
  const { testId, testGroupId, sectionId } = useParams<{
    testId?: string;
    testGroupId?: string;
    sectionId?: string;
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

  // Helper function to get the current test identifier for navigation
  const getCurrentTestId = () => {
    if (testGroupId && sectionId) {
      // Map to the same format used for loading the test
      const sectionLetter = sectionId.includes('section-A') ? 'A' : 'B';
      return `c-cat-section-${sectionLetter}`;
    }
    return testId;
  };

  // Load the test
  useEffect(() => {
    if (testGroupId && sectionId) {
      // New hierarchical structure - map to existing test ID
      const testNumber = testGroupId.replace('test', '');
      const sectionLetter = sectionId.includes('section-A') ? 'A' : 'B';
      const mappedTestId = `c-cat-section-${sectionLetter}`;
      loadTest(mappedTestId);
    } else if (testId) {
      // Original structure
      loadTest(testId);
    }
  }, [testId, testGroupId, sectionId]);

  // Timer functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!loading && currentTest) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate(`/result/${getCurrentTestId()}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, currentTest, testId, navigate]);

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
    navigate(`/result/${getCurrentTestId()}`);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h1>{currentTest.title}</h1>
        </div>
        <div className="col-auto">
          <div className="d-flex align-items-center">
            <span className="me-2">Time Remaining:</span>
            <div className="badge bg-primary fs-5">{formatTime(timeRemaining)}</div>
          </div>
        </div>
      </div>

      <SectionTabs
        sections={currentTest.sections}
        currentSectionIndex={currentSectionIndex}
        onSectionChange={handleNavigateSection}
      />

      <div className="row">
        <div className="col-md-8">
          <Question
            question={currentQuestion}
            selectedOptionId={selectedOptionId}
            onSelectOption={handleSelectOption}
          />

          <div className="d-flex justify-content-between mb-4">
            <button
              className="btn btn-secondary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 && currentSectionIndex === 0}
            >
              Previous
            </button>

            {currentQuestionIndex === currentSection.questions.length - 1 &&
            currentSectionIndex === currentTest.sections.length - 1 ? (
              <button className="btn btn-success" onClick={handleSubmitTest}>
                Submit Test
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNextQuestion}>
                Next
              </button>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">{currentSection.title}</h5>
            </div>
            <div className="card-body">
              <QuestionNavigation
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={currentSection.questions.length}
                userAnswers={sectionAnswers}
                onNavigate={handleNavigateQuestion}
              />

              <div className="d-grid gap-2">
                <button className="btn btn-success" onClick={handleSubmitTest}>
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;

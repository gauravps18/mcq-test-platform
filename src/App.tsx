import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TestProvider } from './context/TestContext';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import DetailedResultPage from './pages/DetailedResultPage';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router basename={process.env.REACT_APP_BASENAME || '/'}>
      <TestProvider>
        <div className="App">
          <div className="app-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/test/:testId" element={<TestPage />} />
              <Route path="/result/:testId" element={<ResultPage />} />
              <Route path="/result/:testId/details" element={<DetailedResultPage />} />
            </Routes>
          </div>
        </div>
      </TestProvider>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';

// Import Pages
import ExamsPage from './pages/ExamsPage';
import SubjectsPage from './pages/SubjectsPage';
import ChaptersPage from './pages/ChaptersPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Exam -> Subject -> Chapter -> Start Quiz workflow */}
          <Route path="/" element={<ExamsPage />} />
          <Route path="/subjects/:examId" element={<SubjectsPage />} />
          <Route path="/chapters/:subjectId" element={<ChaptersPage />} />
          
          {/* Quiz Gameplay and result pages */}
          <Route path="/quiz/:sessionId" element={<QuizPage />} />
          <Route path="/results/:sessionId" element={<ResultsPage />} />
          
          {/* Analytics Dashboard */}
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;

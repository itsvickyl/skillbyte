import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizApi = {
  // Fetch Exams
  getExams: async () => {
    const response = await api.get('/exams');
    return response.data;
  },

  // Fetch Subjects for Exam
  getSubjects: async (examId) => {
    const response = await api.get(`/subjects/${examId}`);
    return response.data;
  },

  // Fetch Chapters for Subject
  getChapters: async (subjectId) => {
    const response = await api.get(`/chapters/${subjectId}`);
    return response.data;
  },

  // Start a new Quiz Session
  startQuiz: async (username, chapterId) => {
    const response = await api.post('/quiz/start', {
      username,
      chapter_id: chapterId,
    });
    return response.data;
  },

  // Retrieve Question for Quiz Session
  getQuestion: async (sessionId, nextIndex = 0) => {
    const response = await api.get(`/quiz/question/${sessionId}`, {
      params: { next_index: nextIndex },
    });
    return response.data;
  },

  // Submit Answer to a Question
  submitAnswer: async (sessionId, questionId, selectedOptionIndex, shownAt, submittedAt) => {
    const response = await api.post('/quiz/answer', {
      session_id: sessionId,
      question_id: questionId,
      selected_option_index: selectedOptionIndex,
      shown_at: shownAt.toISOString(),
      submitted_at: submittedAt.toISOString(),
    });
    return response.data;
  },

  // Mark Quiz Session Completed
  finishQuiz: async (sessionId) => {
    const response = await api.post('/quiz/finish', {
      session_id: sessionId,
    });
    return response.data;
  },

  // Fetch Analytics Metrics for Dashboard
  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
};

export default quizApi;

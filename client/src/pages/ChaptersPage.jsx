import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../services/api';
import { Layers, ArrowLeft, Play, X, User, Sparkles } from 'lucide-react';

export default function ChaptersPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Username prompt states
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('quiz_username') || '');
  const [startLoading, setStartLoading] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const data = await quizApi.getChapters(subjectId);
        setChapters(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load syllabus chapters.');
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [subjectId]);

  const handleStartQuiz = async (e) => {
    e.preventDefault();
    if (!username.trim() || !selectedChapter) return;

    try {
      setStartLoading(true);
      // Persist in localStorage for ease-of-use next time
      localStorage.setItem('quiz_username', username.trim());
      
      const session = await quizApi.startQuiz(username.trim(), selectedChapter.id);
      
      // Navigate to the interactive WhatsApp Chat Quiz Page
      navigate(`/quiz/${session.session_id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to start quiz. Please try again.');
    } finally {
      setStartLoading(false);
      setSelectedChapter(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-slate-200 animate-pulse rounded-full"></div>
          <div className="h-6 w-32 bg-slate-200 animate-pulse rounded-md"></div>
        </div>
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="space-y-4 pt-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 flex justify-between items-center shadow-sm">
              <div className="space-y-2 flex-1">
                <div className="h-6 w-1/3 bg-slate-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-2/3 bg-slate-200 animate-pulse rounded-md"></div>
              </div>
              <div className="h-10 w-24 bg-slate-200 animate-pulse rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Back button and breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-whatsapp-teal transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Chapters syllabus</span>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Select a Chapter</h2>
        <p className="text-slate-500 mt-1.5 font-medium">Select a focused chapter to begin your evaluation immediately.</p>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No Chapters Defined</h3>
          <p className="text-slate-500 mt-1">There are no syllabus chapters created for this subject yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="group bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-whatsapp-teal/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-whatsapp-teal transition-colors">
                  {chapter.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                  {chapter.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedChapter(chapter)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-whatsapp-teal text-white font-bold rounded-xl hover:bg-teal-700 shadow-md shadow-teal-700/10 hover:shadow-lg transition-all self-start md:self-center"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Assessment</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Username Prompter Modal Overlay */}
      {selectedChapter && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 relative border border-slate-100 animate-bubble">
            {/* Close Button */}
            <button
              onClick={() => setSelectedChapter(null)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2 mt-2">
              <div className="w-12 h-12 bg-teal-50 text-whatsapp-teal rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Enter Your Name</h3>
              <p className="text-sm text-slate-500">Provide your name or nickname to register your results in our analytics dashboard.</p>
            </div>

            {/* Prompt Form */}
            <form onSubmit={handleStartQuiz} className="mt-6 space-y-4">
              <div className="relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Username / Nickname</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Carter, Guest_07"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-whatsapp-teal focus:ring-1 focus:ring-whatsapp-teal outline-none font-medium transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={startLoading || !username.trim()}
                  className="w-full py-3 bg-whatsapp-teal text-white font-bold rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-teal-700/10 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {startLoading ? (
                    <span>Initializing session...</span>
                  ) : (
                    <>
                      <span>Let's Start!</span>
                      <Play className="w-4 h-4 fill-current" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

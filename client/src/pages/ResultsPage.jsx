import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../services/api';
import { Trophy, Clock, Target, ArrowRight, RotateCcw, BarChart2, Loader2 } from 'lucide-react';

export default function ResultsPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // finishQuiz is idempotent in our DBService, returns the summary metrics
        const data = await quizApi.finishQuiz(sessionId);
        setResults(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch quiz results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Loader2 className="w-12 h-12 text-whatsapp-teal animate-spin mb-4" />
        <h3 className="text-xl font-bold text-slate-800">Calculating your score...</h3>
        <p className="text-slate-500 mt-1">Checking responses and compiling average speeds.</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto mt-12">
        <Trophy className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-800">Error Loading Results</h3>
        <p className="text-slate-500 mt-2">We couldn't retrieve the quiz session metrics. Please restart.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-5 py-2.5 bg-whatsapp-teal text-white font-bold rounded-xl hover:bg-teal-700 shadow-md transition-all"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const { score, total_questions, accuracy, avg_duration } = results;

  // Visual Helper: Get Rating Details based on Accuracy
  const getRating = (acc) => {
    if (acc >= 90) return { title: 'Outstanding!', desc: 'Exceptional mastery demonstrated.', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' };
    if (acc >= 75) return { title: 'Excellent!', desc: 'Solid conceptual understanding.', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-100' };
    if (acc >= 50) return { title: 'Good Effort!', desc: 'Well done, with room for improvement.', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' };
    return { title: 'Keep Practicing!', desc: 'Review syllabus chapters to build strength.', color: 'text-rose-500', bg: 'bg-rose-50 border-rose-100' };
  };

  const rating = getRating(accuracy);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-bubble">
      {/* Trophy Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-yellow-50 text-yellow-500 border border-yellow-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Trophy className="w-10 h-10 fill-current" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Assessment Finished!</h2>
          <p className="text-slate-500 font-medium">Your score has been registered in the database service.</p>
        </div>
      </div>

      {/* Performance Gauge Card */}
      <div className={`p-6 rounded-3xl border text-center space-y-1.5 ${rating.bg}`}>
        <span className={`text-2xl font-black uppercase tracking-tight ${rating.color}`}>
          {rating.title}
        </span>
        <p className="text-slate-600 text-sm font-medium">{rating.desc}</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm space-y-1">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Final Score</span>
          <span className="text-2xl font-black text-slate-800">
            {score} <span className="text-slate-400 font-normal">/ {total_questions}</span>
          </span>
        </div>

        {/* Accuracy Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm space-y-1">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Accuracy</span>
          <span className="text-2xl font-black text-slate-800">{accuracy}%</span>
        </div>

        {/* Speed Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 text-center shadow-sm space-y-1">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Avg Duration</span>
          <span className="text-2xl font-black text-slate-800">{avg_duration}s</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl shadow-sm hover:shadow transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Retake Another Quiz</span>
        </button>

        <button
          onClick={() => navigate('/analytics')}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-whatsapp-teal hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all"
        >
          <span>View Analytics</span>
          <BarChart2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

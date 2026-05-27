import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizApi } from '../services/api';
import { Award, ArrowRight, HelpCircle, Loader2 } from 'lucide-react';

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const data = await quizApi.getExams();
        setExams(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load exams. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="h-4 w-72 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="h-12 w-12 bg-slate-200 animate-pulse rounded-xl"></div>
              <div className="h-6 w-3/4 bg-slate-200 animate-pulse rounded-md"></div>
              <div className="h-4 w-5/6 bg-slate-200 animate-pulse rounded-md"></div>
              <div className="h-10 w-full bg-slate-200 animate-pulse rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <HelpCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-slate-800">Connection Error</h3>
        <p className="text-slate-500 mt-2 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-5 py-2.5 bg-whatsapp-teal text-white font-medium rounded-xl hover:bg-teal-700 shadow-md transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Select an Exam</h2>
        <p className="text-slate-500 mt-1.5 font-medium">Choose from our curated assessments to begin your interactive quiz session.</p>
      </div>

      {exams.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No Exams Available</h3>
          <p className="text-slate-500 mt-1">Check back later or populate the database using the seed script.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="group bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-whatsapp-teal/30 transition-all duration-300 flex flex-col justify-between scale-100 hover:scale-[1.01]"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-whatsapp-teal group-hover:bg-whatsapp-teal group-hover:text-white transition-colors duration-300">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-whatsapp-teal transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    {exam.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/subjects/${exam.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-whatsapp-teal hover:text-white shadow-sm group-hover:shadow-md transition-all duration-300"
                >
                  <span>Explore Subjects</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

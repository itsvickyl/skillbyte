import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizApi } from '../services/api';
import { Book, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';

export default function SubjectsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const data = await quizApi.getSubjects(examId);
        setSubjects(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load subjects. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [examId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-slate-200 animate-pulse rounded-full"></div>
          <div className="h-6 w-32 bg-slate-200 animate-pulse rounded-md"></div>
        </div>
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((n) => (
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
          onClick={() => navigate('/')}
          className="mt-6 px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button and breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-whatsapp-teal transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Subjects Overview</span>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Select a Subject</h2>
        <p className="text-slate-500 mt-1.5 font-medium">Choose a subject under this exam to inspect its syllabus chapters.</p>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Book className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No Subjects Added</h3>
          <p className="text-slate-500 mt-1">We couldn't find any subjects mapped to this exam yet.</p>
          <Link to="/" className="mt-4 inline-block text-whatsapp-teal font-semibold hover:underline">
            Go back to Exams
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="group bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-whatsapp-teal/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-whatsapp-teal group-hover:text-white transition-colors duration-300">
                  <Book className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-whatsapp-teal transition-colors">
                    {subject.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    {subject.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/chapters/${subject.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-whatsapp-teal hover:text-white transition-all duration-300"
                >
                  <span>Select Syllabus</span>
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

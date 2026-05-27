import React, { useEffect, useState } from 'react';
import { quizApi } from '../services/api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Users, HelpCircle, Activity, Hourglass, Percent, TrendingUp, BarChart3, Clock, Loader2 } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await quizApi.getAnalytics();
        setData(res);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch analytics statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Loader2 className="w-12 h-12 text-whatsapp-teal animate-spin mb-4" />
        <h3 className="text-xl font-bold text-slate-800">Compiling Analytics Data...</h3>
        <p className="text-slate-500 mt-1">Aggregating session historical responses and tracking trends.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto mt-12">
        <TrendingUp className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-800">Failed to Load Dashboard</h3>
        <p className="text-slate-500 mt-2">Could not establish connection to the analytics aggregators.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-5 py-2.5 bg-whatsapp-teal text-white font-bold rounded-xl hover:bg-teal-700 shadow-md transition-all"
        >
          Reload Page
        </button>
      </div>
    );
  }

  // Deserialise data
  const {
    dau,
    wau,
    questions_served,
    questions_answered,
    avg_response_time,
    completion_rate,
    dropoff_analysis,
    peak_hours,
    avg_questions_per_session,
    activity_trends
  } = data;

  const cardMetrics = [
    { label: 'Daily Active (DAU)', value: dau, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { label: 'Weekly Active (WAU)', value: wau, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'Questions Served', value: questions_served, icon: HelpCircle, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
    { label: 'Questions Answered', value: questions_answered, icon: Percent, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-100' },
    { label: 'Avg Answer Time', value: `${avg_response_time}s`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { label: 'Completion Rate', value: `${completion_rate}%`, icon: Hourglass, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
    { label: 'Avg Q/Session', value: avg_questions_per_session, icon: BarChart3, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' }
  ];

  return (
    <div className="space-y-8 animate-bubble">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Analytics</h2>
        <p className="text-slate-500 mt-1.5 font-medium">Real-time statistics monitoring active users, session drop-offs, and gameplay durations.</p>
      </div>

      {/* Numerical Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cardMetrics.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`p-4 rounded-2xl border bg-white flex flex-col justify-between shadow-sm hover:shadow transition-all ${card.bg}`}>
              <div className="flex justify-between items-start gap-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider leading-none">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 shrink-0 ${card.color}`} />
              </div>
              <span className="text-2xl font-black text-slate-800 mt-2 block leading-none">
                {card.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Active Traffic Trends (Line Chart) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-5 h-5 text-whatsapp-teal" />
            <h3 className="font-bold text-slate-800">Traffic Activity (Last 7 Days)</h3>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activity_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} stroke="#94a3b8" />
                <YAxis tickLine={false} stroke="#94a3b8" />
                <Tooltip />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="sessions" stroke="#128c7e" strokeWidth={3} name="Quiz Sessions" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="answers" stroke="#34b7f1" strokeWidth={3} name="Answers Submitted" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Peak Hours Analysis (Area Chart) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800">Peak Activity Distribution (24 hrs)</h3>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peak_hours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tickLine={false} stroke="#94a3b8" />
                <YAxis tickLine={false} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSessions)" name="Sessions Started" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Syllabus Chapter Drop-off Analysis (Bar Chart) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800">Syllabus Drop-off Analysis (Started vs. Completed)</h3>
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dropoff_analysis} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tickLine={false} stroke="#94a3b8" />
                <YAxis dataKey="chapter" type="category" width={140} tickLine={false} stroke="#94a3b8" />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="started" fill="#64748b" name="Quiz Sessions Started" radius={[0, 4, 4, 0]} />
                <Bar dataKey="completed" fill="#25d366" name="Quiz Sessions Finished" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

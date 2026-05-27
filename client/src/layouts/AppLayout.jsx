import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BarChart3, HelpCircle, GraduationCap, Menu, X } from 'lucide-react';

export default function AppLayout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Select Exam', icon: GraduationCap },
    { path: '/analytics', label: 'Analytics Dashboard', icon: BarChart3 },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/subjects') || location.pathname.startsWith('/chapters') || location.pathname.startsWith('/quiz');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Top Navigation */}
      <header className="md:hidden bg-whatsapp-teal text-white flex items-center justify-between px-4 py-3 shadow-md z-30">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-wide">
          <BookOpen className="w-5 h-5 text-whatsapp-green" />
          <span>SkillBytes</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 hover:bg-teal-700 rounded transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/60 z-20 transition-opacity" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-14 left-0 w-3/4 max-w-xs h-[calc(100vh-3.5rem)] bg-white shadow-2xl p-4 flex flex-col gap-2 animate-slide-in" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-whatsapp-teal text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm shrink-0">
        {/* Brand Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-whatsapp-teal" />
          <div>
            <h1 className="font-extrabold text-lg text-slate-800 leading-none tracking-tight">SkillBytes</h1>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Assessment Platform</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  active
                    ? 'bg-whatsapp-teal text-white shadow-lg shadow-teal-700/15 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-whatsapp-green' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">Hiring Quiz Application</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">FastAPI + React + MongoDB</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

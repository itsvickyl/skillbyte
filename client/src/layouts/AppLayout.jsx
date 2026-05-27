import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BarChart3, HelpCircle, GraduationCap, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AppLayout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

      {/* Sidebar for Desktop — Collapsible */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 shadow-sm shrink-0 transition-all duration-300 ease-out ${
          collapsed ? 'w-[68px]' : 'w-64'
        }`}
      >
        {/* Brand Logo */}
        <div className={`border-b border-slate-100 flex items-center gap-3 transition-all duration-300 ${
          collapsed ? 'px-3 py-5 justify-center' : 'p-6'
        }`}>
          <GraduationCap className={`text-whatsapp-teal shrink-0 transition-all duration-300 ${collapsed ? 'w-7 h-7' : 'w-8 h-8'}`} />
          <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <h1 className="font-extrabold text-lg text-slate-800 leading-none tracking-tight whitespace-nowrap">SkillBytes</h1>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">Assessment Platform</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className={`flex-1 py-6 flex flex-col gap-2 transition-all duration-300 ${collapsed ? 'px-2' : 'px-4'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                  collapsed ? 'px-0 justify-center' : 'px-4'
                } ${
                  active
                    ? 'bg-whatsapp-teal text-white shadow-lg shadow-teal-700/15'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-whatsapp-green' : 'text-slate-400'}`} />
                <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
                  collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-2 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-semibold">Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className={`border-t border-slate-100 text-center transition-all duration-300 overflow-hidden ${
          collapsed ? 'py-3 px-1' : 'p-4'
        }`}>
          <p className={`text-xs text-slate-400 font-medium transition-all duration-300 ${collapsed ? 'hidden' : 'block'}`}>Hiring Quiz Application</p>
          <p className={`text-slate-400 font-semibold mt-0.5 transition-all duration-300 ${collapsed ? 'text-[9px]' : 'text-[10px]'}`}>
            {collapsed ? 'SB' : 'FastAPI + React + MongoDB'}
          </p>
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

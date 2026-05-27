import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BarChart3, GraduationCap, Menu, X, ChevronLeft, ChevronRight, User, Pencil, Check, LogOut } from 'lucide-react';

export default function AppLayout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);

  // User profile state
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  // Sidebar shows expanded when not collapsed OR when hovered while collapsed
  const isExpanded = !collapsed || hovered;

  // Read username from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('quiz_username');
    if (stored) setUsername(stored);

    // Listen for storage changes (e.g. when ChaptersPage sets it)
    const handleStorage = () => {
      const updated = localStorage.getItem('quiz_username');
      if (updated) setUsername(updated);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Also re-check on route change (same-tab localStorage writes don't fire storage event)
  useEffect(() => {
    const stored = localStorage.getItem('quiz_username');
    if (stored && stored !== username) setUsername(stored);
  }, [location.pathname]);

  const handleSaveUsername = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      setUsername(trimmed);
      localStorage.setItem('quiz_username', trimmed);
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    setUsername('');
    setIsEditing(false);
    localStorage.removeItem('quiz_username');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Generate a consistent color from username
  const getAvatarColor = (name) => {
    if (!name) return 'bg-slate-200 text-slate-500';
    const colors = [
      'bg-emerald-100 text-emerald-700',
      'bg-indigo-100 text-indigo-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-teal-100 text-teal-700',
      'bg-violet-100 text-violet-700',
      'bg-cyan-100 text-cyan-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

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

  // Profile section component (reused in desktop sidebar & mobile drawer)
  const ProfileSection = ({ compact = false }) => {
    if (!username && !compact) return null;

    return (
      <div className={`border-b border-slate-100 transition-all duration-300 ${
        compact ? 'px-3 py-4' : 'px-4 py-4'
      }`}>
        <div className={`flex items-center ${compact ? 'justify-center' : 'gap-3'}`}>
          {/* Avatar */}
          <div
            className={`shrink-0 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
              getAvatarColor(username)
            } ${compact ? 'w-9 h-9 text-xs' : 'w-10 h-10 text-sm'}`}
            title={compact ? username || 'Guest' : undefined}
          >
            {username ? getInitials(username) : <User className="w-4 h-4" />}
          </div>

          {/* Name + edit */}
          <div className={`overflow-hidden transition-all duration-300 flex-1 min-w-0 ${
            compact ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                  autoFocus
                  className="flex-1 min-w-0 px-2.5 py-1.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg 
                    focus:border-whatsapp-teal focus:ring-1 focus:ring-whatsapp-teal outline-none transition-all"
                  placeholder="Your name"
                />
                <button
                  onClick={handleSaveUsername}
                  className="p-1.5 rounded-lg bg-whatsapp-teal text-white hover:bg-teal-700 transition-colors shrink-0"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                    {username || 'Guest User'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                    {username ? 'Quiz Participant' : 'Start a quiz to set name'}
                  </p>
                </div>
                {username && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => { setEditValue(username); setIsEditing(true); }}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
                      title="Edit name"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Mobile Top Navigation */}
      <header className="md:hidden bg-whatsapp-teal text-white flex items-center justify-between px-4 py-3 shadow-md z-30">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-wide">
          <BookOpen className="w-5 h-5 text-whatsapp-green" />
          <span>SkillBytes</span>
        </Link>
        <div className="flex items-center gap-3">
          {/* Mobile avatar */}
          {username && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${getAvatarColor(username)}`}>
              {getInitials(username)}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 hover:bg-teal-700 rounded transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/60 z-20 transition-opacity" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-14 left-0 w-3/4 max-w-xs h-[calc(100vh-3.5rem)] bg-white shadow-2xl flex flex-col animate-slide-in" onClick={(e) => e.stopPropagation()}>
            {/* Mobile profile */}
            {username && (
              <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(username)}`}>
                  {getInitials(username)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{username}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Quiz Participant</p>
                </div>
              </div>
            )}
            <div className="p-4 flex flex-col gap-2 flex-1">
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
            {/* Mobile logout */}
            {username && (
              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar for Desktop — Collapsible */}
      <aside
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 shrink-0 transition-all duration-300 ease-out ${
          isExpanded ? 'w-64 shadow-sm' : 'w-[68px] shadow-sm'
        } ${collapsed && hovered ? 'shadow-2xl z-40 absolute md:relative' : ''}`}
      >
        {/* Brand Logo */}
        <div className={`border-b border-slate-100 flex items-center gap-3 transition-all duration-300 ${
          isExpanded ? 'p-6' : 'px-3 py-5 justify-center'
        }`}>
          <GraduationCap className={`text-whatsapp-teal shrink-0 transition-all duration-300 ${isExpanded ? 'w-8 h-8' : 'w-7 h-7'}`} />
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
            <h1 className="font-extrabold text-lg text-slate-800 leading-none tracking-tight whitespace-nowrap">SkillBytes</h1>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap">Assessment Platform</span>
          </div>
        </div>

        {/* User Profile */}
        <ProfileSection compact={!isExpanded} />

        {/* Navigation Items */}
        <nav className={`flex-1 py-6 flex flex-col gap-2 transition-all duration-300 ${isExpanded ? 'px-4' : 'px-2'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={!isExpanded ? item.label : undefined}
                className={`flex items-center gap-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isExpanded ? 'px-4' : 'px-0 justify-center'
                } ${
                  active
                    ? 'bg-whatsapp-teal text-white shadow-lg shadow-teal-700/15'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-whatsapp-green' : 'text-slate-400'}`} />
                <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
                  isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
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
          isExpanded ? 'p-4' : 'py-3 px-1'
        }`}>
          <p className={`text-xs text-slate-400 font-medium transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}`}>Hiring Quiz Application</p>
          <p className={`text-slate-400 font-semibold mt-0.5 transition-all duration-300 ${isExpanded ? 'text-[10px]' : 'text-[9px]'}`}>
            {isExpanded ? 'FastAPI + React + MongoDB' : 'SB'}
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

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../services/api';
import { Phone, Video, MoreVertical, Send, Check, CheckCheck, AlertCircle, Clock, Loader2 } from 'lucide-react';

export default function QuizPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [shownAt, setShownAt] = useState(null);

  // Gameplay state
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Chat message bubbles state
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Per-question timer
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Ref to automatically scroll the chat to bottom
  const chatEndRef = useRef(null);

  // 1. Initial greeting from Quiz Bot
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setMessages([
      {
        id: 'greet',
        sender: 'bot',
        text: "👋 Hello! Welcome to your SkillBytes Assessment. I will be your interviewer today. I'm preparing your questions... Let's begin!",
        time: getFormattedTime(),
      },
    ]);
    
    // Load first question after typing effect
    triggerBotTyping(() => {
      loadQuestion(0);
    });
  }, [sessionId]);

  // Scroll to bottom whenever messages list updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Per-question timer
  useEffect(() => {
    if (shownAt && !isFinished) {
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - shownAt.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [shownAt, isFinished]);

  const getFormattedTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimer = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const triggerBotTyping = (callback) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1200);
  };

  const loadQuestion = async (index) => {
    try {
      const data = await quizApi.getQuestion(sessionId, index);
      if (!data || !data.question_id) {
        // No more questions
        setIsFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
        setMessages((prev) => [
          ...prev,
          {
            id: 'finish-msg',
            sender: 'bot',
            text: '🏁 All questions have been served! Click the button below to submit and view your detailed assessment results.',
            time: getFormattedTime(),
          },
        ]);
        return;
      }

      setQuestion(data);
      setCurrentIndex(data.current_index);
      setTotalQuestions(data.total_questions);
      setSelectedOption(null);
      
      // Log the exact moment the question is presented to the user
      setShownAt(new Date());

      setMessages((prev) => [
        ...prev,
        {
          id: `q-${data.current_index}-${data.question_id}`,
          sender: 'bot',
          questionNumber: data.current_index + 1,
          questionTotal: data.total_questions,
          questionText: data.text,
          time: getFormattedTime(),
          isQuestion: true
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'bot',
          text: '⚠️ An error occurred while retrieving the next question. Please try reloading.',
          time: getFormattedTime(),
        },
      ]);
    }
  };

  const handleSendAnswer = async () => {
    if (selectedOption === null || !question || submitting) return;

    try {
      setSubmitting(true);
      const submittedAt = new Date();
      if (timerRef.current) clearInterval(timerRef.current);

      // Immediately print user's selection bubble
      const optionLabel = String.fromCharCode(65 + selectedOption); // A, B, C, D
      const optionText = question.options[selectedOption];
      setMessages((prev) => [
        ...prev,
        {
          id: `ans-${currentIndex}-${question.question_id}`,
          sender: 'user',
          text: `${optionLabel}. ${optionText}`,
          time: getFormattedTime(),
        },
      ]);

      // Submit to backend
      const result = await quizApi.submitAnswer(
        sessionId,
        question.question_id,
        selectedOption,
        shownAt,
        submittedAt
      );

      // Load next question with typing delay
      triggerBotTyping(() => {
        loadQuestion(currentIndex + 1);
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishQuiz = async () => {
    try {
      setSubmitting(true);
      await quizApi.finishQuiz(sessionId);
      navigate(`/results/${sessionId}`);
    } catch (err) {
      console.error(err);
      navigate(`/results/${sessionId}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Progress percentage
  const progressPercent = totalQuestions > 0
    ? ((currentIndex + (isFinished ? 1 : 0)) / totalQuestions) * 100
    : 0;

  return (
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-6rem)] flex flex-col bg-[#efeae2] rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/60 shadow-xl relative">
      
      {/* ===== WhatsApp Header ===== */}
      <header className="bg-whatsapp-darkGreen text-white shrink-0 shadow-md">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-whatsapp-darkGreen font-extrabold text-sm">
                QB
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-whatsapp-green border-2 border-whatsapp-darkGreen rounded-full"></span>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm leading-tight truncate">SkillBytes Quiz Bot</h3>
              <span className="text-[10px] text-emerald-300 font-medium">
                {isTyping ? 'typing...' : isFinished ? 'assessment complete' : 'online'}
              </span>
            </div>
          </div>

          {/* Header right: Timer + Icons */}
          <div className="flex items-center gap-3">
            {/* Per-question timer */}
            {!isFinished && shownAt && (
              <div className="flex items-center gap-1.5 bg-whatsapp-teal/40 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-emerald-200" />
                <span className="text-xs font-mono font-bold text-emerald-100 tracking-wider">
                  {formatTimer(elapsed)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 text-emerald-200/70">
              <button className="hover:text-white transition-colors hidden sm:block">
                <Video className="w-[18px] h-[18px]" />
              </button>
              <button className="hover:text-white transition-colors hidden sm:block">
                <Phone className="w-[18px] h-[18px]" />
              </button>
              <button className="hover:text-white transition-colors">
                <MoreVertical className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalQuestions > 0 && (
          <div className="h-[3px] bg-whatsapp-teal/30 w-full">
            <div
              className="h-full bg-whatsapp-green transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </header>

      {/* ===== Chat Area ===== */}
      <div 
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-2.5 bg-whatsapp-chatBg bg-whatsapp-pattern bg-repeat"
        style={{ backgroundBlendMode: 'multiply', backgroundColor: '#efeae2' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            } animate-bubble`}
          >
            <div
              className={`relative max-w-[88%] sm:max-w-[72%] rounded-lg px-3 py-2 text-[13.5px] leading-[1.45] ${
                msg.sender === 'user'
                  ? 'bg-whatsapp-bubbleSelf text-whatsapp-textPrimary rounded-tr-none bubble-tail-right shadow-[0_1px_1px_rgba(0,0,0,0.06)]'
                  : 'bg-whatsapp-bubbleOther text-whatsapp-textPrimary rounded-tl-none bubble-tail-left shadow-[0_1px_1px_rgba(0,0,0,0.06)]'
              }`}
            >
              {/* Render question messages with styled components instead of markdown */}
              {msg.isQuestion ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center bg-whatsapp-teal text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                      Q{msg.questionNumber}/{msg.questionTotal}
                    </span>
                  </div>
                  <p className="font-medium text-[13.5px] leading-relaxed text-whatsapp-textPrimary">
                    {msg.questionText}
                  </p>
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </p>
              )}
              
              {/* Timestamp + read receipts */}
              <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5">
                <span className="text-[10.5px] text-whatsapp-textSecondary leading-none">{msg.time}</span>
                {msg.sender === 'user' && (
                  <CheckCheck className="w-[14px] h-[14px] text-whatsapp-blue" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-bubble">
            <div className="bg-whatsapp-bubbleOther rounded-lg rounded-tl-none px-4 py-3 shadow-[0_1px_1px_rgba(0,0,0,0.06)] flex items-center gap-1.5 bubble-tail-left relative">
              <span className="w-[7px] h-[7px] bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-[7px] h-[7px] bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-[7px] h-[7px] bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ===== Bottom Panel ===== */}
      <footer className="bg-whatsapp-panelBg border-t border-slate-200/60 shrink-0">
        {isFinished ? (
          /* ===== Finished State ===== */
          <div className="p-4 animate-fade-slide-up">
            <button
              onClick={handleFinishQuiz}
              disabled={submitting}
              className="w-full md:max-w-sm mx-auto py-3 bg-whatsapp-green text-white font-bold text-sm rounded-xl 
                hover:bg-emerald-600 active:scale-[0.98] 
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-150 shadow-md shadow-emerald-600/15 
                flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin-smooth" />
                  <span>Loading Results...</span>
                </>
              ) : (
                <span>Submit & View Results</span>
              )}
            </button>
          </div>

        ) : question && !isTyping ? (
          /* ===== Options + Send ===== */
          <div className="p-3 sm:p-4 space-y-3 animate-fade-slide-up">
            {/* Question indicator bar */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold text-whatsapp-textSecondary tracking-wide">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-[11px] font-semibold text-whatsapp-textSecondary">
                Select an answer below
              </span>
            </div>

            {/* Option buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 stagger-children">
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const optionLabel = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    disabled={submitting}
                    className={`group relative px-3.5 py-3 rounded-xl text-left border text-[13px] font-medium 
                      transition-all duration-200 ease-out flex items-center gap-3
                      active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                      ${isSelected
                        ? 'bg-whatsapp-darkGreen text-white border-whatsapp-darkGreen shadow-md shadow-emerald-900/15 animate-pulse-glow'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-whatsapp-teal/50 hover:bg-teal-50/30 hover:shadow-sm'
                      }`}
                  >
                    {/* Option letter badge */}
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors duration-200
                        ${isSelected
                          ? 'bg-whatsapp-green text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-whatsapp-teal'
                        }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : optionLabel}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Send button */}
            <div className="flex items-center justify-end">
              <button
                onClick={handleSendAnswer}
                disabled={selectedOption === null || submitting}
                className={`px-5 py-2.5 font-bold text-sm rounded-xl 
                  transition-all duration-200 ease-out
                  flex items-center justify-center gap-2
                  active:scale-[0.96]
                  ${selectedOption !== null && !submitting
                    ? 'bg-whatsapp-green text-white shadow-md shadow-emerald-600/15 hover:bg-emerald-600 hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin-smooth" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

        ) : (
          /* ===== Waiting for question ===== */
          <div className="flex items-center justify-center py-5 text-whatsapp-textSecondary text-sm font-medium gap-2">
            <Loader2 className="w-4 h-4 animate-spin-smooth" />
            <span>Quiz Bot is preparing your question...</span>
          </div>
        )}
      </footer>
    </div>
  );
}

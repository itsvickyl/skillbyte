import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../services/api';
import { Phone, Video, MoreVertical, Send, Check, AlertCircle } from 'lucide-react';

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

  // Ref to automatically scroll the chat to bottom
  const chatEndRef = useRef(null);

  // 1. Initial greeting from Quiz Bot
  useEffect(() => {
    setMessages([
      {
        id: 'greet',
        sender: 'bot',
        text: "👋 Hello! Welcome to your SkillBytes Assessment. I will be your interviewer today. I'm preparing your questions... Let's begin!",
        time: getFormattedTime(),
      },
    ]);
    
    // Load first question after 1.5 seconds typing effect
    triggerBotTyping(() => {
      loadQuestion(0);
    });
  }, [sessionId]);

  // Scroll to bottom whenever messages list updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getFormattedTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          text: `📝 **Question ${data.current_index + 1} of ${data.total_questions}**:\n\n${data.text}`,
          time: getFormattedTime(),
          isQuestion: true
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-msg',
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

      // Immediately print user's selection bubble
      const optionText = question.options[selectedOption];
      setMessages((prev) => [
        ...prev,
        {
          id: `ans-${currentIndex}-${question.question_id}`,
          sender: 'user',
          text: `Selected Option: "${optionText}"`,
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
      navigate(`/results/${sessionId}`); // Safe redirect as results parses DB
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-6rem)] flex flex-col bg-[#efeae2] rounded-3xl overflow-hidden border border-slate-300 shadow-xl relative">
      {/* WhatsApp Header Panel */}
      <header className="bg-whatsapp-darkGreen text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          {/* Green Avatar Indicator */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-whatsapp-darkGreen font-extrabold text-base">
              QB
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-whatsapp-green border-2 border-whatsapp-darkGreen rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base leading-tight">SkillBytes Quiz Bot</h3>
            <span className="text-[10px] md:text-xs text-emerald-300 font-semibold">online | assessing...</span>
          </div>
        </div>

        {/* Header Icons */}
        <div className="flex items-center gap-4 text-emerald-100">
          <button className="hover:text-white transition-colors hidden sm:block">
            <Video className="w-5 h-5" />
          </button>
          <button className="hover:text-white transition-colors hidden sm:block">
            <Phone className="w-5 h-5" />
          </button>
          <button className="hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* WhatsApp Chat Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-whatsapp-chatBg bg-whatsapp-pattern bg-repeat"
        style={{ backgroundBlendMode: 'multiply', backgroundColor: '#efeae2' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end animate-bubble' : 'justify-start animate-bubble'
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm relative ${
                msg.sender === 'user'
                  ? 'bg-whatsapp-bubbleSelf text-slate-800 rounded-tr-none'
                  : 'bg-whatsapp-bubbleOther text-slate-800 rounded-tl-none'
              }`}
            >
              {/* Question formatting parser */}
              <p className="whitespace-pre-wrap font-medium leading-relaxed">
                {msg.text}
              </p>
              <div className="text-[9px] text-slate-400 text-right mt-1.5 flex items-center justify-end gap-1 font-bold">
                <span>{msg.time}</span>
                {msg.sender === 'user' && <Check className="w-3 h-3 text-whatsapp-blue fill-current" />}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-bubble">
            <div className="bg-whatsapp-bubbleOther rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Bottom Panel Options Keyboard */}
      <footer className="bg-[#f0f2f5] border-t border-slate-200 p-4 shrink-0 flex flex-col gap-3">
        {isFinished ? (
          /* Finished State Button */
          <div className="text-center py-2 animate-bubble">
            <button
              onClick={handleFinishQuiz}
              disabled={submitting}
              className="w-full md:max-w-md mx-auto py-3 bg-whatsapp-green text-white font-extrabold text-base rounded-2xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2"
            >
              <span>Submit & View Results</span>
            </button>
          </div>
        ) : question && !isTyping ? (
          /* Option selection state */
          <div className="space-y-4 animate-bubble">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  disabled={submitting}
                  className={`px-4 py-3 rounded-2xl text-left border text-sm font-bold transition-all flex items-center justify-between scale-100 hover:scale-[1.01] ${
                    selectedOption === idx
                      ? 'bg-whatsapp-darkGreen text-white border-whatsapp-darkGreen shadow-md shadow-emerald-700/15'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-whatsapp-teal hover:bg-teal-50/20'
                  }`}
                >
                  <span className="flex-1 pr-2">{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedOption === idx
                        ? 'border-white bg-whatsapp-green'
                        : 'border-slate-300 bg-slate-50'
                    }`}
                  >
                    {selectedOption === idx && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Submit Action Bar */}
            <div className="flex items-center justify-end pt-1">
              <button
                onClick={handleSendAnswer}
                disabled={selectedOption === null || submitting}
                className="px-6 py-3 bg-whatsapp-teal text-white font-bold rounded-2xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md shadow-teal-700/10 transition-all flex items-center justify-center gap-2"
              >
                <span>Send Answer</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Waiting for question indicator */
          <div className="flex items-center justify-center py-6 text-slate-400 font-medium gap-2">
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <span>Quiz Bot is formulating a question...</span>
          </div>
        )}
      </footer>
    </div>
  );
}

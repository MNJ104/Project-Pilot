import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { ChatMessageDto } from '../types/ai-types';
import { X, Send, Bot, User, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
}) => {
  const [messages, setMessages] = useState<ChatMessageDto[]>([
    {
      role: 'assistant',
      content: `Hello! I am your AI Software Architecture Copilot for **${projectTitle || 'your project'}**. I have full contextual awareness of your requirements, database schema, architecture components, sprint backlog, and risk profile. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || sending) return;

    const newMessages: ChatMessageDto[] = [
      ...messages,
      { role: 'user', content: textToSend.trim() },
    ];
    setMessages(newMessages);
    setInput('');
    setSending(true);

    try {
      const response = await api.sendChatMessage(projectId, newMessages);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.reply },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to the AI microservice. Please verify the AI service is running.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const quickPrompts = [
    'Explain the system architecture and component topology',
    'What are the primary technical and security risks?',
    'Summarize the database schema and table relationships',
    'What is the agile sprint schedule and story point velocity?',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full z-10">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-950/80 rounded-xl border border-sky-800 text-sky-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">AI Architecture Copilot</h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
                Context: {projectTitle || 'Active Project'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-sky-400'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-2xl p-3.5 text-xs leading-relaxed max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-sky-400">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span>Copilot is analyzing project artifacts...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 space-y-2">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Suggested Architectural Inquiries:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={sending}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about architecture, database, APIs, sprints..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="p-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  ChevronLeft,
  MessageCircle,
  Trash2,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Halo! Saya asisten wisata virtual Surabaya. Saya siap membantu Anda menemukan tempat wisata menarik, kuliner khas, dan informasi lainnya tentang Surabaya. Ada yang bisa saya bantu?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim(), history }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan. Silakan coba lagi dalam beberapa saat.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Halo! Saya asisten wisata virtual Surabaya. Saya siap membantu Anda menemukan tempat wisata menarik, kuliner khas, dan informasi lainnya tentang Surabaya. Ada yang bisa saya bantu?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col bg-gray-50" style={{ height: '100dvh' }}>
      {/* ─── Header ─── */}
      <div className="flex-shrink-0 bg-blue-600 text-white shadow-lg z-10">
        <div className="h-1 bg-blue-500" />
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 flex items-center justify-center"
              aria-label="Kembali"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Asisten Wisata Surabaya</h1>
              <p className="text-blue-100 text-xs">AI-powered travel assistant</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            title="Hapus percakapan"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* ─── Messages Area ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 animate-slide-in ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0 w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`flex-1 max-w-[80%] ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block px-4 py-3 rounded-2xl shadow-sm text-sm text-left ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white border border-blue-100 text-gray-900 rounded-tl-sm'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="markdown-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <div className="mb-2 last:mb-0 text-gray-900">{children}</div>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-2 text-gray-900 space-y-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-2 text-gray-900 space-y-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => <li className="text-gray-900">{children}</li>,
                        strong: ({ children }) => (
                          <strong className="font-bold text-gray-900">{children}</strong>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-base font-bold mb-2 text-gray-900">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-sm font-bold mb-2 text-gray-900">{children}</h2>
                        ),
                        code: ({ children, className }) => {
                          const isInline = !className;
                          return isInline ? (
                            <code className="bg-blue-100 text-blue-800 px-1 py-0.5 text-xs font-mono rounded">
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-gray-100 text-gray-900 p-2 overflow-x-auto text-xs font-mono mb-2 rounded">
                              {children}
                            </code>
                          );
                        },
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                )}
              </div>
              <span className="text-xs text-gray-400 mt-1 px-1 block">
                {message.timestamp.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-blue-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-500">Sedang mengetik</span>
                <div className="flex gap-1 ml-1">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Quick Suggestions ─── */}
      {messages.length === 1 && (
        <div className="flex-shrink-0 px-4 pb-2">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Pertanyaan cepat
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              'Wisata kuliner khas Surabaya?',
              'Rekomendasi tempat bersejarah?',
              'Wisata keluarga di Surabaya?',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInput(suggestion);
                  inputRef.current?.focus();
                }}
                className="flex-shrink-0 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Input Area ─── */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya tentang wisata Surabaya..."
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 pr-10 bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:outline-none rounded-2xl resize-none disabled:opacity-50 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <MessageCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

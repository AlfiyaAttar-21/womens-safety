import { useState, useRef, useEffect } from 'react'

import {
  Bot,
  Send,
  UserRound,
  Trash2,
  Phone,
  AlertTriangle,
  MessageCircle,
  Sparkles,
  LockKeyhole
} from 'lucide-react'

import api from '../services/api'
import AppShell from '../components/AppShell'
import { PageTitle } from '../components/FormBits'

function AIChatbot() {
  const [message, setMessage] = useState('')

  const [messages, setMessages] = useState([
    {
      text: 'Hello! Welcome to SafeHer AI Assistant. 💚 I am here to help you with safety tips, emergency guidance and general support. How can I help you today?',
      sender: 'bot'
    }
  ])

  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages, isTyping])

  async function sendMessage(userText) {
    if (!userText.trim() || isTyping) {
      return
    }

    const previousMessages = messages

    setMessages((previous) => [
      ...previous,
      {
        text: userText,
        sender: 'user'
      }
    ])

    setMessage('')
    setIsTyping(true)

    try {
      const response = await api.post('/chatbot/message', {
        message: userText,
        history: previousMessages.map((item) => ({
          text: item.text,
          sender: item.sender
        }))
      })

      const botReply = response.data.reply

      setMessages((previous) => [
        ...previous,
        {
          text: botReply || 'Sorry, I could not generate a response.',
          sender: 'bot'
        }
      ])

    } catch (error) {
      console.error('Chatbot API Error:', error)

      let errorMessage =
        'Sorry, SafeHer AI is temporarily unavailable. Please try again later.'

      if (error.response?.status === 401) {
        errorMessage =
          'Your login session may have expired. Please login again.'
      } else if (error.response?.status === 403) {
        errorMessage =
          'You are not authorized to use this service.'
      } else if (error.response?.status === 429) {
        errorMessage =
          'Too many requests. Please wait a moment and try again.'
      } else if (!error.response) {
        errorMessage =
          'Cannot connect to the server. Please check whether the Backend is running.'
      } else if (error.response?.data?.reply) {
        errorMessage = error.response.data.reply
      }

      setMessages((previous) => [
        ...previous,
        {
          text: errorMessage,
          sender: 'bot'
        }
      ])

    } finally {
      setIsTyping(false)
    }
  }

  function handleSend(e) {
    e.preventDefault()
    sendMessage(message.trim())
  }

  function handleSuggestion(text) {
    sendMessage(text)
  }

  function clearChat() {
    const confirmClear = window.confirm(
      'Are you sure you want to clear this conversation?'
    )

    if (confirmClear && !isTyping) {
      setMessages([
        {
          text: 'Hello! Welcome to SafeHer AI Assistant. 💚 How can I help you today?',
          sender: 'bot'
        }
      ])
    }
  }

  const suggestions = [
    'Give me safety tips',
    'What should I do in an emergency?',
    'How can I travel safely?'
  ]

  return (
    <AppShell active="ai">

      <div className="min-h-screen bg-[#FAF8F2] px-4 py-6 text-[#2C2A1E] md:px-8 md:py-9">

        <div className="mx-auto max-w-6xl">

          {/* PAGE HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9CFB0] bg-[#F0EAD6] px-4 py-2 text-xs font-bold tracking-wider text-[#6B7A3A]">
                <Sparkles size={15} />
                YOUR PERSONAL SAFETY COMPANION
              </div>

              <PageTitle
                title="SafeHer AI Assistant"
                subtitle="Ask for safety tips, travel precautions or emergency guidance."
              />

            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C8D0A9] bg-[#E8ECD9] px-4 py-2.5 text-sm font-semibold text-[#6B7A3A]">
              <span className="h-2 w-2 rounded-full bg-[#8D9D4F]" />
              AI Assistant
            </div>

          </div>

          {/* CHAT CARD */}
          <section className="overflow-hidden rounded-3xl border border-[#D9CFB0] bg-white shadow-sm">

            {/* CHAT HEADER */}
            <div className="flex items-center justify-between border-b border-[#E9E2D0] bg-[#F7F4E9] px-5 py-5 md:px-7">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8D9D4F] text-white shadow-sm">
                  <Bot size={26} />
                </div>

                <div>
                  <h2 className="font-bold text-[#2C2A1E]">
                    SafeHer Assistant
                  </h2>

                  <p className="mt-1 flex items-center gap-2 text-xs text-[#85806E]">
                    <span className="h-2 w-2 rounded-full bg-[#8D9D4F]" />
                    Ready to help you
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={clearChat}
                disabled={isTyping}
                title="Clear conversation"
                className="flex items-center gap-2 rounded-xl border border-[#D9CFB0] bg-white px-3 py-2.5 text-sm font-semibold text-[#766D50] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                <Trash2 size={17} />
                <span className="hidden sm:inline">Clear chat</span>
              </button>

            </div>

            {/* CHAT BODY */}
            <div
              className="min-h-[350px] max-h-[540px] space-y-6 overflow-y-auto bg-[#FCFBF7] px-4 py-6 md:px-7"
              aria-live="polite"
            >

              {messages.map((item, index) => (

                <div
                  key={index}
                  className={`flex items-end gap-3 ${
                    item.sender === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  {item.sender === 'bot' && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8ECD9] text-[#6B7A3A]">
                      <Bot size={19} />
                    </div>
                  )}

                  <div className={`flex max-w-[85%] flex-col ${
                    item.sender === 'user'
                      ? 'items-end'
                      : 'items-start'
                  }`}>

                    <div
                      className={`rounded-2xl px-4 py-3.5 text-sm leading-7 shadow-sm ${
                        item.sender === 'user'
                          ? 'rounded-br-sm bg-[#8D9D4F] text-white'
                          : 'rounded-bl-sm border border-[#E5DEC9] bg-white text-[#494638]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {item.text}
                      </p>
                    </div>

                    <span className="mt-2 px-1 text-[11px] font-medium text-[#99927E]">
                      {item.sender === 'user' ? 'You' : 'SafeHer AI'}
                    </span>

                  </div>

                  {item.sender === 'user' && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0EAD6] text-[#6B7A3A]">
                      <UserRound size={19} />
                    </div>
                  )}

                </div>

              ))}

              {/* TYPING ANIMATION */}
              {isTyping && (

                <div className="flex items-end gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8ECD9] text-[#6B7A3A]">
                    <Bot size={19} />
                  </div>

                  <div>
                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-[#E5DEC9] bg-white px-5 py-4">

                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#8D9D4F]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#8D9D4F] [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#8D9D4F] [animation-delay:300ms]" />

                    </div>

                    <span className="mt-2 block text-[11px] text-[#99927E]">
                      SafeHer AI is typing...
                    </span>
                  </div>

                </div>

              )}

              <div ref={chatEndRef} />

            </div>

            {/* SUGGESTIONS */}
            {messages.length === 1 && (

              <div className="border-t border-[#E9E2D0] bg-white px-5 py-5 md:px-7">

                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#6B7A3A]">
                  <MessageCircle size={17} />
                  Try asking
                </div>

                <div className="flex flex-wrap gap-3">

                  {suggestions.map((item, index) => (

                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestion(item)}
                      disabled={isTyping}
                      className="rounded-xl border border-[#D9CFB0] bg-[#FAF8F2] px-4 py-3 text-left text-xs font-semibold text-[#6B7A3A] transition hover:border-[#8D9D4F] hover:bg-[#E8ECD9] disabled:opacity-50 sm:text-sm"
                    >
                      {item}
                    </button>

                  ))}

                </div>

              </div>

            )}

            {/* MESSAGE INPUT */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-3 border-t border-[#E9E2D0] bg-white p-4 md:p-6"
            >

              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#D9CFB0] bg-[#FAF8F2] px-4 py-3.5 transition focus-within:border-[#8D9D4F] focus-within:ring-2 focus-within:ring-[#8D9D4F]/20">

                <MessageCircle
                  size={19}
                  className="shrink-0 text-[#8D9D4F]"
                />

                <input
                  type="text"
                  aria-label="Your message"
                  placeholder="Type your safety-related question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isTyping}
                  maxLength={3000}
                  className="w-full min-w-0 bg-transparent text-sm text-[#2C2A1E] outline-none placeholder:text-[#A49F8D] disabled:opacity-60"
                />

              </div>

              <button
                type="submit"
                disabled={!message.trim() || isTyping}
                aria-label="Send message"
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#8D9D4F] px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#6B7A3A] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
              >
                <Send size={19} />
                <span className="hidden sm:inline">Send</span>
              </button>

            </form>

            {/* PRIVACY NOTE */}
            <div className="flex items-center justify-center gap-2 border-t border-[#E9E2D0] bg-[#F7F4E9] px-4 py-3 text-center text-xs text-[#85806E]">

              <LockKeyhole size={14} className="shrink-0 text-[#8D9D4F]" />

              Your safety matters. Avoid sharing passwords or OTPs.

            </div>

          </section>

          {/* EMERGENCY CARD */}
          <section className="mt-7 flex flex-col gap-5 rounded-3xl border border-[#E7C9BD] bg-[#FBF0E9] p-6 sm:flex-row sm:items-center">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E9D1C5] text-[#A84C3E]">
              <Phone size={26} />
            </div>

            <div className="flex-1">

              <h3 className="text-lg font-bold text-[#63372E]">
                In immediate danger?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#86685D]">
                Move somewhere safer if possible and contact emergency services.
              </p>

            </div>

            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#B85B4B] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#984536]"
            >
              <Phone size={18} />
              Call 112
            </a>

          </section>

          {/* WARNING */}
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#E7DDBD] bg-[#FBF7E9] p-5">

            <AlertTriangle
              size={21}
              className="mt-0.5 shrink-0 text-[#A58B43]"
            />

            <p className="text-xs leading-6 text-[#766D50]">
              AI answers can sometimes be incorrect. This assistant provides
              general guidance and is not a replacement for emergency services.
            </p>

          </div>

        </div>

      </div>

    </AppShell>
  )
}

export default AIChatbot
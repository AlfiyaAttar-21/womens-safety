import { useState, useRef, useEffect } from 'react'
import {
  Bot, Send, UserRound, Trash2, Phone, AlertTriangle,
  MessageCircle, ShieldCheck,
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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
      <PageTitle title="SafeHer AI" subtitle="Ask for safety tips, travel precautions or what to do in an emergency." />

      <section className="flex h-[65vh] min-h-[420px] flex-col overflow-hidden rounded-3xl bg-white shadow-soft" aria-label="Chat">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-cream"><Bot size={20} /></span>
            <div>
              <h2 className="font-display font-bold leading-tight">SafeHer Assistant</h2>
              <p className="flex items-center gap-1.5 text-xs text-ink-soft"><span className="h-2 w-2 rounded-full bg-safe" /> Online</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearChat}
            disabled={isTyping}
            title="Clear conversation"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink-soft hover:bg-ink/5 disabled:opacity-50"
          >
            <Trash2 size={16} /> <span className="hidden sm:inline">Clear chat</span>
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-cream/60 p-5" aria-live="polite">
          {messages.map((item, index) => (
            <div key={index} className={`flex items-end gap-2 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {item.sender === 'bot' && (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-cream"><Bot size={16} /></span>
              )}
              <div
                className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                  item.sender === 'user' ? 'rounded-br-md bg-ink text-cream' : 'rounded-bl-md bg-white ring-1 ring-ink/10'
                }`}
              >
                {item.text}
              </div>
              {item.sender === 'user' && (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lilac"><UserRound size={16} /></span>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-2" aria-label="SafeHer AI is typing">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-cream"><Bot size={16} /></span>
              <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-4 ring-1 ring-ink/10">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 border-t border-ink/10 px-5 py-3">
            {suggestions.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestion(item)}
                disabled={isTyping}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-lilac px-4 text-sm font-semibold hover:bg-blush disabled:opacity-60"
              >
                <MessageCircle size={15} /> {item}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2 border-t border-ink/10 p-3">
          <input
            type="text"
            aria-label="Your message"
            placeholder="Ask something about safety"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isTyping}
            maxLength={3000}
            className="h-12 min-w-0 flex-1 rounded-full bg-cream px-5 text-[15px] outline-none ring-1 ring-ink/15 focus:ring-2 focus:ring-ink"
          />
          <button
            type="submit"
            disabled={!message.trim() || isTyping}
            aria-label="Send message"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-cream disabled:opacity-50"
          >
            <Send size={17} /> <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </section>

      <p className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
        <ShieldCheck size={14} /> General guidance only. Not a substitute for emergency services.
      </p>

      <section className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl bg-sos p-5 text-white">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20"><Phone size={22} /></span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold">In immediate danger?</h3>
          <p className="text-sm text-white/90">Move somewhere safer if you can and call emergency services.</p>
        </div>
        <a href="tel:112" className="inline-flex min-h-[44px] items-center rounded-full bg-white px-6 font-semibold text-sos">Call 112</a>
      </section>

      <p className="mt-6 flex items-start gap-3 rounded-2xl bg-lilac/60 p-4 text-sm text-ink-soft">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-ink" />
        <span>
          AI answers can be wrong. Don’t share passwords, OTPs or other sensitive details in this chat.
        </span>
      </p>
    </AppShell>
  )
}

export default AIChatbot

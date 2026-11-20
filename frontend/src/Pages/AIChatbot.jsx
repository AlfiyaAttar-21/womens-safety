
import { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Send,
  UserRound,
  Trash2,
  Phone,
  AlertTriangle,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Clock
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

      <div className="ai-page">

        <div className="ai-top-heading">
          <div>
            <div className="ai-small-label">
              <Sparkles size={15} />
              YOUR PERSONAL SAFETY COMPANION
            </div>

            <PageTitle
              title="SafeHer AI Assistant"
              subtitle="Ask for safety tips, travel precautions or emergency guidance."
            />
          </div>

          <div className="ai-online-badge">
            <span></span>
            AI Assistant
          </div>
        </div>

        <section className="ai-chat-card" aria-label="AI Chat">

          <div className="ai-chat-topbar">

            <div className="ai-chat-profile">

              <div className="ai-bot-avatar">
                <Bot size={25} />
              </div>

              <div>
                <h2>SafeHer Assistant</h2>

                <p>
                  <span className="ai-live-dot"></span>
                  Ready to help you
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={clearChat}
              disabled={isTyping}
              className="ai-clear-button"
              title="Clear conversation"
            >
              <Trash2 size={17} />
              <span>Clear chat</span>
            </button>

          </div>

          <div className="ai-chat-body" aria-live="polite">

            {messages.map((item, index) => (

              <div
                key={index}
                className={`ai-message-row ${
                  item.sender === 'user'
                    ? 'ai-user-row'
                    : 'ai-bot-row'
                }`}
              >

                {item.sender === 'bot' && (
                  <div className="ai-message-avatar ai-bot-message-avatar">
                    <Bot size={18} />
                  </div>
                )}

                <div className="ai-message-wrapper">

                  <div
                    className={`ai-message-bubble ${
                      item.sender === 'user'
                        ? 'ai-user-bubble'
                        : 'ai-bot-bubble'
                    }`}
                  >
                    {item.text}
                  </div>

                  <span className="ai-message-time">
                    {item.sender === 'user' ? 'You' : 'SafeHer AI'}
                  </span>

                </div>

                {item.sender === 'user' && (
                  <div className="ai-message-avatar ai-user-message-avatar">
                    <UserRound size={18} />
                  </div>
                )}

              </div>

            ))}

            {isTyping && (

              <div className="ai-message-row ai-bot-row">

                <div className="ai-message-avatar ai-bot-message-avatar">
                  <Bot size={18} />
                </div>

                <div className="ai-message-wrapper">

                  <div className="ai-typing-bubble">

                    <span></span>
                    <span></span>
                    <span></span>

                  </div>

                  <span className="ai-message-time">
                    SafeHer AI is typing...
                  </span>

                </div>

              </div>

            )}

            <div ref={chatEndRef} />

          </div>

          {messages.length === 1 && (

            <div className="ai-suggestions-area">

              <div className="ai-suggestion-heading">
                <MessageCircle size={16} />
                <span>Try asking</span>
              </div>

              <div className="ai-suggestion-buttons">

                {suggestions.map((item, index) => (

                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestion(item)}
                    disabled={isTyping}
                    className="ai-suggestion-button"
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          )}

          <form
            onSubmit={handleSend}
            className="ai-message-form"
          >

            <input
              type="text"
              aria-label="Your message"
              placeholder="Type your safety-related question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isTyping}
              maxLength={3000}
            />

            <button
              type="submit"
              disabled={!message.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={19} />
              <span>Send</span>
            </button>

          </form>

          <div className="ai-privacy-note">
            <ShieldCheck size={15} />
            Your safety matters. Avoid sharing passwords or OTPs.
          </div>

        </section>

        <section className="ai-emergency-card">

          <div className="ai-emergency-icon">
            <Phone size={25} />
          </div>

          <div className="ai-emergency-content">

            <h3>In immediate danger?</h3>

            <p>
              Move somewhere safer if possible and contact emergency services.
            </p>

          </div>

          <a href="tel:112" className="ai-call-button">
            Call 112
          </a>

        </section>

        <div className="ai-warning-card">

          <AlertTriangle size={20} />

          <p>
            AI answers can sometimes be incorrect. This assistant provides
            general guidance and is not a replacement for emergency services.
          </p>

        </div>

      </div>

    </AppShell>
  )
}

export default AIChatbot

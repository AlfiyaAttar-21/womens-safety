import { useState, useRef, useEffect } from 'react'
import {
  ShieldCheck,
  Bot,
  Send,
  UserRound,
  Heart,
  Trash2,
  ArrowLeft,
  Sparkles,
  Phone,
  AlertTriangle,
  MessageCircle
} from 'lucide-react'
import api from '../services/api'
import '../App.css'

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
    <div className="ai-page">

      {/* Navbar */}
      <nav className="ai-navbar">

        <a href="/dashboard" className="ai-brand">
          <div className="ai-brand-icon">
            <ShieldCheck size={25} />
          </div>
          <span>SafeHer</span>
        </a>

        <div className="ai-nav-right">

          <a href="/dashboard" className="ai-dashboard-link">
            <ArrowLeft size={17} />
            Dashboard
          </a>

          <button
            className="ai-logout-btn"
            onClick={() => {
              sessionStorage.removeItem('safeherAccessToken')
              sessionStorage.removeItem('safeherRefreshToken')
              sessionStorage.removeItem('safeherUserId')
              sessionStorage.removeItem('safeherUserName')
              sessionStorage.removeItem('safeherPhoneNumber')
              window.location.href = '/login'
            }}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* Hero */}
      <section className="ai-hero">

        <div className="ai-hero-content">

          <div className="ai-small-label">
            <Sparkles size={15} />
            YOUR DIGITAL SAFETY COMPANION
          </div>

          <h1>AI Safety Assistant</h1>

          <p>
            A supportive space for safety guidance, travel precautions
            and helpful information whenever you need it.
          </p>

          <div className="ai-hero-note">
            <Heart size={18} />
            <span>You are not alone. Your safety matters.</span>
          </div>

        </div>

        <div className="ai-hero-art">
          <div className="ai-hero-circle">
            <Bot size={66} strokeWidth={1.4} />
            <span><Heart size={22} /></span>
          </div>
        </div>

      </section>

      {/* Main */}
      <main className="ai-main">

        <section className="ai-chat-card">

          {/* Chat Header */}
          <div className="ai-chat-header">

            <div className="ai-chat-profile">

              <div className="ai-bot-avatar">
                <Bot size={27} />
              </div>

              <div>
                <h2>SafeHer Assistant</h2>

                <div className="ai-online-status">
                  <span></span>
                  Gemini AI Support
                </div>
              </div>

            </div>

            <button
              type="button"
              className="ai-clear-btn"
              onClick={clearChat}
              title="Clear conversation"
              disabled={isTyping}
            >
              <Trash2 size={17} />
              <span>Clear Chat</span>
            </button>

          </div>

          {/* Chat Body */}
          <div className="ai-chat-body">

            <div className="ai-date-label">
              <span>Conversation</span>
            </div>

            {messages.map((item, index) => (

              <div
                key={index}
                className={`ai-message-row ${item.sender}`}
              >

                {item.sender === 'bot' && (
                  <div className="ai-message-avatar">
                    <Bot size={18} />
                  </div>
                )}

                <div className="ai-message-content">

                  <div className="ai-message-bubble">
                    {item.text}
                  </div>

                  <span className="ai-message-time">
                    {item.sender === 'bot'
                      ? 'SafeHer Assistant'
                      : 'You'}
                  </span>

                </div>

                {item.sender === 'user' && (
                  <div className="ai-user-avatar">
                    <UserRound size={18} />
                  </div>
                )}

              </div>

            ))}

            {isTyping && (
              <div className="ai-message-row bot">

                <div className="ai-message-avatar">
                  <Bot size={18} />
                </div>

                <div className="ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>
            )}

            <div ref={chatEndRef} />

          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="ai-suggestions">

              <p>Try asking about:</p>

              <div className="ai-suggestion-list">

                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestion(item)}
                    disabled={isTyping}
                  >
                    <MessageCircle size={15} />
                    {item}
                  </button>
                ))}

              </div>

            </div>
          )}

          {/* Input */}
          <form className="ai-input-form" onSubmit={handleSend}>

            <input
              type="text"
              placeholder="Ask something about safety..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isTyping}
              maxLength={3000}
            />

            <button
              type="submit"
              disabled={!message.trim() || isTyping}
            >
              <Send size={18} />
              Send
            </button>

          </form>

          <div className="ai-chat-footer">
            <ShieldCheck size={15} />
            <span>General guidance only · Not a substitute for emergency services</span>
          </div>

        </section>

        {/* Emergency Card */}
        <section className="ai-emergency-card">

          <div className="ai-emergency-icon">
            <Phone size={23} />
          </div>

          <div className="ai-emergency-content">
            <h3>Emergency Assistance</h3>
            <p>
              If you are in immediate danger, move to a safer place
              if possible and call emergency services.
            </p>
          </div>

          <a href="tel:112" className="ai-emergency-call">
            Call 112
          </a>

        </section>

        {/* Safety Notice */}
        <div className="ai-safety-notice">
          <AlertTriangle size={19} />
          <p>
            <strong>Safety Reminder:</strong> SafeHer AI provides
            general safety and legal information. AI responses may
            not always be accurate. Do not share passwords, OTPs
            or sensitive personal information in this chat.
            In an emergency, call 112 directly.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="ai-footer">

        <div className="ai-footer-brand">
          <ShieldCheck size={21} />
          <span>SafeHer</span>
        </div>

        <p>Stay Safe. Stay Strong. Stay Confident.</p>
        <span>© 2026 SafeHer. All rights reserved.</span>

      </footer>

    </div>
  )
}

export default AIChatbot
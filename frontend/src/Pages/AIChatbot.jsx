
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
  MessageCircle,
  Clock,
  ShieldAlert
} from 'lucide-react'
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

  function getBotResponse(userMessage) {
    const text = userMessage.toLowerCase()

    if (
      text.includes('emergency') ||
      text.includes('danger') ||
      text.includes('unsafe') ||
      text.includes('help me')
    ) {
      return 'If you are in immediate danger, try to move to a safe and crowded place if possible. Call 112 for emergency assistance in India. You can also contact someone you trust. Your safety comes first.'
    }

    if (
      text.includes('stalking') ||
      text.includes('follow') ||
      text.includes('following')
    ) {
      return 'If someone is following you, avoid going somewhere isolated. Move towards a crowded and well-lit place, contact a trusted person and call 112 if you feel threatened.'
    }

    if (
      text.includes('travel') ||
      text.includes('journey') ||
      text.includes('travelling')
    ) {
      return 'Before travelling, share your route and expected arrival time with a trusted contact. Prefer familiar, well-lit routes and keep your phone charged.'
    }

    if (
      text.includes('harassment') ||
      text.includes('abuse')
    ) {
      return 'I am sorry you are facing this situation. You deserve to feel safe and respected. If possible, move away from the situation, preserve relevant evidence and reach out to someone you trust or local support services.'
    }

    if (
      text.includes('safety tips') ||
      text.includes('safe')
    ) {
      return 'Here are some safety tips: 1. Share your travel plans with trusted contacts. 2. Keep your phone charged. 3. Prefer well-lit public places. 4. Trust your instincts. 5. Call 112 in an emergency.'
    }

    if (
      text.includes('hello') ||
      text.includes('hi') ||
      text.includes('hey')
    ) {
      return 'Hello! 💚 Welcome to SafeHer. You can ask me about personal safety, travel precautions, emergency guidance and general safety tips.'
    }

    return 'Thank you for sharing with me. Your safety and well-being matter. I can provide general safety tips and guidance. If you are in immediate danger, call 112 in India or contact someone you trust.'
  }

  function handleSend(e) {
    e.preventDefault()

    if (!message.trim()) {
      return
    }

    const userText = message.trim()

    const newMessage = {
      text: userText,
      sender: 'user'
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      newMessage
    ])

    setMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const botReply = {
        text: getBotResponse(userText),
        sender: 'bot'
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        botReply
      ])

      setIsTyping(false)
    }, 700)
  }

  function handleSuggestion(text) {
    const userMessage = {
      text,
      sender: 'user'
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage
    ])

    setIsTyping(true)

    setTimeout(() => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          text: getBotResponse(text),
          sender: 'bot'
        }
      ])

      setIsTyping(false)
    }, 700)
  }

  function clearChat() {
    const confirmClear = window.confirm(
      'Are you sure you want to clear this conversation?'
    )

    if (confirmClear) {
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
                  Demo Support
                </div>
              </div>

            </div>

            <button
              type="button"
              className="ai-clear-btn"
              onClick={clearChat}
              title="Clear conversation"
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
                    {item.sender === 'bot' ? 'SafeHer Assistant' : 'You'}
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
            <strong>Safety Reminder:</strong> This is a demonstration chatbot
            that provides predefined responses. Do not share passwords,
            OTPs or sensitive personal information in this chat.
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

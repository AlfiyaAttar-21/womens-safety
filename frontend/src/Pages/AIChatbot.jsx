import { useState } from 'react'
import '../App.css'

function AIChatbot() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      text: 'Hello! 💜 Welcome to SafeHer AI Assistant. How can I help you today?',
      sender: 'bot'
    }
  ])

  function handleSend(e) {
    e.preventDefault()

    if (!message.trim()) {
      alert('Please enter your message')
      return
    }

    const newMessage = {
      text: message,
      sender: 'user'
    }

    setMessages([...messages, newMessage])
    setMessage('')

    setTimeout(() => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          text: 'Thank you for sharing. If you are in immediate danger, contact local emergency services at 112 or reach out to someone you trust.',
          sender: 'bot'
        }
      ])
    }, 500)
  }

  return (
    <div className="chatbot-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span>♡</span> SafeHer
        </div>

        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
        </div>

        <button
          className="login-btn"
          onClick={() => window.location.href = '/'}
        >
          Logout
        </button>
      </nav>

      {/* Header */}
      <section className="chatbot-header">
        <h1>AI Safety Assistant 🤖</h1>
        <p>Your personal safety companion is always here to help.</p>
      </section>

      {/* Chat Section */}
      <section className="chatbot-content">

        <div className="chatbot-box">

          <div className="chatbot-title">
            <span>🤖</span>
            <div>
              <h2>SafeHer Assistant</h2>
              <p>Online Support</p>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`chat-message ${item.sender}`}
              >
                {item.text}
              </div>
            ))}
          </div>

          <form className="chat-input-form" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button type="submit">
              Send
            </button>
          </form>

        </div>

      </section>

      {/* Footer */}
      <footer>
        <h2>♡ SafeHer</h2>
        <p>Stay Safe. Stay Strong. Stay Confident.</p>
        <p>© 2026 SafeHer. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default AIChatbot
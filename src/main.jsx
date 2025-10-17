import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="min-h-screen bg-gray-100">
      <div className="relative max-w-5xl mx-auto h-full">
        <App />
      </div>
    </div>
  </StrictMode>,
)

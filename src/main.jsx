import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './frontend/animation/tailwind.css'
import App from './frontend/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

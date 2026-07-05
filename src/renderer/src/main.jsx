import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import PopupApp from './PopupApp'

const isPopup = window.location.hash === '#popup'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPopup ? <PopupApp /> : <App />}
  </StrictMode>
)
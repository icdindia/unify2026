import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../shared/tokens.css'
import '../../shared/typography.css'
import './app/base.css'
import { App } from './app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

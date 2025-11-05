import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Configure axios to use backend API
// Prefer VITE_API_URL if provided (normalize it); otherwise fall back to the provided production backend URL.
// The code below will remove any trailing `/` or a trailing `/api` so endpoints like `/api/events` work correctly.
const rawApiUrl = import.meta.env.VITE_API_URL
if (rawApiUrl) {
  axios.defaults.baseURL = rawApiUrl.replace(/\/$/, '').replace(/\/api$/, '')
} else {
  // No hardcoded fallback. Require VITE_API_URL to be set in the environment.
  // Leaving axios.defaults.baseURL undefined will make requests relative to the current origin.
  console.error(
    'VITE_API_URL is not set. Please set VITE_API_URL in your frontend environment (e.g. .env or hosting platform). Axios baseURL not configured.',
  )
}

// Add token to all requests if it exists
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

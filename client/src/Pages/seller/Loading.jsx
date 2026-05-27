import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Loading() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const [status, setStatus] = useState('loading')

  useEffect(() => { 
    const params = new URLSearchParams(search)
    const next = params.get('next')
    const sessionId = params.get('session_id')

    if (sessionId) {
      // Poll server for Stripe session payment confirmation
      let attempts = 0
      const iv = setInterval(async () => {
        attempts += 1
        try {
          const res = await fetch(`/api/order/stripe/success?session_id=${sessionId}`)
          const data = await res.json()
          if (data.success && data.paid) {
            clearInterval(iv)
            setStatus('paid')
            navigate(`/${next || 'my-orders'}`)
          } else if (attempts >= 15) {
            clearInterval(iv)
            // fallback: still navigate to next after polling timeout
            navigate(`/${next || 'my-orders'}`)
          }
        } catch (err) {
          console.log('poll error', err)
        }
      }, 2000)

      return () => clearInterval(iv)
    }

    if (next) {
      // short delay to show loader briefly then redirect
      const t = setTimeout(() => navigate(`/${next}`), 700)
      return () => clearTimeout(t)
    }
  }, [search, navigate])

  const spinnerStyle = {
    height: 96,
    width: 96,
    borderRadius: '50%',
    border: '6px solid #e5e7eb', // gray-300
    borderTop: '6px solid #06b6d4', // primary fallback
    animation: 'spin 1s linear infinite'
  }

  return (
    <div style={{height: '100vh'}} className='flex items-center justify-center'>
      <div style={spinnerStyle} aria-hidden='true' />
      <span className='sr-only'>Loading...</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default Loading
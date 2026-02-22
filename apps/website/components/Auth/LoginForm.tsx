'use client'

import React, {Suspense, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {FormInput} from "@/components/FormInput"
import styles from './Auth.module.scss'

const LoginFormInner = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/payload-api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        setError(data.errors?.[0]?.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {message && <div className={styles.successMessage}>{message}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      <FormInput label="Username" htmlFor="username">
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
      </FormInput>
      <FormInput label="Password" htmlFor="password">
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
      </FormInput>
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      <div className={styles.links}>
        <p>
          Don't have an account? <a href="/register">Register with invite code</a>
        </p>
      </div>
    </form>
  )
}

export const LoginForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormInner />
    </Suspense>
  )
}

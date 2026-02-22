'use client'

import React, {Suspense, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {FormInput} from "@/components/FormInput"
import styles from './Auth.module.scss'

const RegisterFormInner = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteCode = searchParams.get('invite')


  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/payload-api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          name,
          inviteCode,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/login?message=Registration successful. Please log in.')
      } else {
        setError(data.errors?.[0]?.message || 'Registration failed')
      }
    } catch (err) {
      setError('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  if (!inviteCode) {
    return (
      <div className={styles.error}>
        <p>A valid invite code is required to register.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
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
      <FormInput label="Full Name (Optional)" htmlFor="name">
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
      </FormInput>
      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      <div className={styles.links}>
        <p>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </form>
  )
}

export const RegisterForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterFormInner />
    </Suspense>
  )
}

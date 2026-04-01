import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { registerApi } from '../api/client'
import { useAuth } from '../context/AuthContext'

export function Register() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (user) return <Navigate to="/profile" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      await registerApi({ email, name, password })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err instanceof Error ? err.message : '가입 실패')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="page narrow">
      <h1>회원가입</h1>
      <p className="muted">POST /cats — 가입 후 로그인에서 JWT를 받습니다.</p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          이메일
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          이름
          <input
            type="text"
            autoComplete="nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />
        </label>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn primary" disabled={pending}>
          {pending ? '처리 중…' : '가입하기'}
        </button>
      </form>
      <p className="form-footer">
        이미 계정이 있나요? <Link to="/login">로그인</Link>
      </p>
    </section>
  )
}

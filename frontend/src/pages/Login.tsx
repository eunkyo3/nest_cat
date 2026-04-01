import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const registered = Boolean(
    (location.state as { registered?: boolean } | null)?.registered,
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (user) return <Navigate to="/profile" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      await login(email, password)
      navigate('/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 실패')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="page narrow">
      <h1>로그인</h1>
      <p className="muted">POST /cats/login — 응답의 token으로 이후 요청을 인증합니다.</p>
      {registered && (
        <p className="ok-msg">회원가입이 완료되었습니다. 로그인해 주세요.</p>
      )}
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
          비밀번호
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn primary" disabled={pending}>
          {pending ? '처리 중…' : '로그인'}
        </button>
      </form>
      <p className="form-footer">
        계정이 없으신가요? <Link to="/register">회원가입</Link>
      </p>
    </section>
  )
}

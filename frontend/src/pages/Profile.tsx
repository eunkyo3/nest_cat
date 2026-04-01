import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { uploadCatImages } from '../api/client'
import { useAuth } from '../context/AuthContext'

export function Profile() {
  const { user, loading, refreshUser } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (loading) return <p className="muted">세션 확인 중…</p>
  if (!user) return <Navigate to="/login" replace />

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setOk(null)
    const input = (e.target as HTMLFormElement).elements.namedItem(
      'images',
    ) as HTMLInputElement
    const files = input.files ? Array.from(input.files) : []
    if (files.length === 0) {
      setError('이미지를 선택해 주세요.')
      return
    }
    setPending(true)
    try {
      await uploadCatImages(files.slice(0, 10))
      await refreshUser()
      setOk('프로필 이미지가 갱신되었습니다.')
      input.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="page">
      <h1>내 프로필</h1>
      <p className="muted">GET /cats (JWT) · POST /cats/upload (multipart, 필드명 image)</p>
      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <img src={user.imgUrl} alt="" className="profile-avatar" />
          </div>
          <dl className="profile-dl">
            <dt>이름</dt>
            <dd>{user.name}</dd>
            <dt>이메일</dt>
            <dd>{user.email}</dd>
            <dt>id</dt>
            <dd className="mono small">{user.id}</dd>
          </dl>
        </div>
        <div>
          <h2 className="h2-inline">이미지 업로드</h2>
          <form className="form" onSubmit={onUpload}>
            <label>
              파일 (최대 10개, 필드명 image)
              <input name="images" type="file" accept="image/*" multiple />
            </label>
            {error && <p className="error-msg">{error}</p>}
            {ok && <p className="ok-msg">{ok}</p>}
            <button type="submit" className="btn primary" disabled={pending}>
              {pending ? '업로드 중…' : '업로드'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

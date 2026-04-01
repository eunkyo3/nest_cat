import { useEffect, useState } from 'react'
import { getAllCats } from '../api/client'
import type { CatReadOnly } from '../types'

export function Cats() {
  const [cats, setCats] = useState<CatReadOnly[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getAllCats()
        if (!cancelled) setCats(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '불러오기 실패')
      } finally {
        if (!cancelled) setPending(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (pending) return <p className="muted">불러오는 중…</p>
  if (error) return <p className="error-msg">{error}</p>

  return (
    <section className="page">
      <h1>모든 고양이</h1>
      <p className="muted">GET /cats/all — 인증 없이 조회됩니다.</p>
      <ul className="cat-grid">
        {cats.map((c) => (
          <li key={c.id} className="cat-card">
            <div className="cat-card-img-wrap">
              <img src={c.imgUrl} alt="" className="cat-card-img" />
            </div>
            <div className="cat-card-body">
              <strong>{c.name}</strong>
              <span className="mono small">{c.email}</span>
              <span className="mono small id-copy">id: {c.id}</span>
            </div>
          </li>
        ))}
      </ul>
      {cats.length === 0 && <p className="muted">등록된 고양이가 없습니다.</p>}
    </section>
  )
}

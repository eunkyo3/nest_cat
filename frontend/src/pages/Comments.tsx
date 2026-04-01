import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createComment,
  getAllCats,
  getAllComments,
  likeComment,
} from '../api/client'
import type { CatReadOnly, CommentDoc } from '../types'
import { useAuth } from '../context/AuthContext'

function authorId(c: CommentDoc): string {
  if (typeof c.author === 'string') return c.author
  return c.author._id
}

export function Comments() {
  const { user } = useAuth()
  const [comments, setComments] = useState<CommentDoc[]>([])
  const [cats, setCats] = useState<CatReadOnly[]>([])
  const [error, setError] = useState<string | null>(null)
  const [listLoading, setListLoading] = useState(true)
  const [targetId, setTargetId] = useState('')
  const [contents, setContents] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [formOk, setFormOk] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [likingId, setLikingId] = useState<string | null>(null)

  const catNameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const c of cats) m.set(c.id, c.name)
    return m
  }, [cats])

  async function load() {
    setError(null)
    setListLoading(true)
    try {
      const [cList, catList] = await Promise.all([
        getAllComments(),
        getAllCats(),
      ])
      setComments(cList)
      setCats(catList)
      if (!targetId && catList.length > 0) setTargetId(catList[0].id)
    } catch (e) {
      setError(e instanceof Error ? e.message : '목록을 불러오지 못했습니다.')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setFormOk(null)
    if (!user) {
      setFormError('댓글을 남기려면 로그인해 주세요.')
      return
    }
    if (!targetId || !contents.trim()) {
      setFormError('대상 고양이와 내용을 입력해 주세요.')
      return
    }
    setSubmitting(true)
    try {
      const created = await createComment(targetId, {
        author: user.id,
        contents: contents.trim(),
      })
      setComments((prev) => [created, ...prev])
      setContents('')
      setFormOk('댓글이 등록되었습니다.')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '등록 실패')
    } finally {
      setSubmitting(false)
    }
  }

  async function onLike(id: string) {
    setLikingId(id)
    setFormError(null)
    try {
      const updated = await likeComment(id)
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...updated } : c)),
      )
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '좋아요 실패')
    } finally {
      setLikingId(null)
    }
  }

  return (
    <section className="page">
      <h1>댓글</h1>
      <p className="muted">
        GET /comments · POST /comments/:id (대상 고양이 id) · PATCH /comments/:id
        (댓글 id로 좋아요)
      </p>

      <div className="comment-compose card-block">
        <h2 className="h2-inline">댓글 남기기</h2>
        {!user && (
          <p className="muted">로그인하면 작성자(author)로 내 고양이 id가 전송됩니다.</p>
        )}
        <form className="form form-row" onSubmit={onSubmit}>
          <label>
            받는 고양이 (info)
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              disabled={cats.length === 0}
            >
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </label>
          <label className="flex-grow">
            내용
            <input
              type="text"
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              placeholder="댓글 내용"
            />
          </label>
          <button type="submit" className="btn primary align-end" disabled={submitting}>
            {submitting ? '등록 중…' : '등록'}
          </button>
        </form>
        {formError && <p className="error-msg">{formError}</p>}
        {formOk && <p className="ok-msg">{formOk}</p>}
      </div>

      {listLoading && <p className="muted">불러오는 중…</p>}
      {error && <p className="error-msg">{error}</p>}

      {!listLoading && !error && (
        <ul className="comment-list">
          {comments.map((c) => {
            const aName = catNameById.get(authorId(c)) ?? authorId(c)
            const infoName = catNameById.get(String(c.info)) ?? String(c.info)
            const likes =
              typeof c.likeCount === 'number'
                ? c.likeCount
                : Number(c.likeCount) || 0
            return (
              <li key={c._id} className="comment-item card-block">
                <p className="comment-body">{c.contents}</p>
                <div className="comment-meta">
                  <span>
                    작성 <strong>{aName}</strong>
                  </span>
                  <span className="muted">→ 대상 {infoName}</span>
                  <span className="mono small">{c._id}</span>
                </div>
                <div className="comment-actions">
                  <button
                    type="button"
                    className="btn secondary btn-sm"
                    onClick={() => onLike(c._id)}
                    disabled={likingId === c._id}
                  >
                    {likingId === c._id ? '…' : `♥ ${likes}`}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {!listLoading && comments.length === 0 && !error && (
        <p className="muted">아직 댓글이 없습니다.</p>
      )}
    </section>
  )
}

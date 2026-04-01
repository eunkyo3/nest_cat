import type {
  ApiErrorBody,
  CatReadOnly,
  CommentDoc,
  LoginResponse,
} from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function getApiBase(): string {
  return API_BASE.replace(/\/$/, '')
}

function getMessage(body: ApiErrorBody): string {
  const m = body.message
  if (Array.isArray(m)) return m.join(', ')
  if (typeof m === 'string') return m
  if (body.error) return body.error
  return '요청에 실패했습니다.'
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!text) {
    if (!res.ok) throw new Error(res.statusText || 'Network error')
    return {} as T
  }
  return JSON.parse(text) as T
}

export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  const token = localStorage.getItem('token')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    ...init,
    headers,
  })

  const data = await parseJson<ApiErrorBody & T>(res)
  if (!res.ok) {
    throw new Error(getMessage(data))
  }
  return data as T
}

export function loginApi(body: { email: string; password: string }) {
  return request<LoginResponse>('/cats/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function registerApi(body: {
  email: string
  name: string
  password: string
}) {
  return request<CatReadOnly>('/cats', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function getCurrentCat() {
  return request<CatReadOnly>('/cats')
}

export function getAllCats() {
  return request<CatReadOnly[]>('/cats/all')
}

export function uploadCatImages(files: File[]) {
  const fd = new FormData()
  for (const f of files) fd.append('image', f)
  return request<CatReadOnly>('/cats/upload', {
    method: 'POST',
    body: fd,
  })
}

export function getAllComments() {
  return request<CommentDoc[]>('/comments')
}

export function createComment(targetCatId: string, body: { author: string; contents: string }) {
  return request<CommentDoc>(`/comments/${encodeURIComponent(targetCatId)}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function likeComment(commentId: string) {
  return request<CommentDoc>(`/comments/${encodeURIComponent(commentId)}`, {
    method: 'PATCH',
  })
}

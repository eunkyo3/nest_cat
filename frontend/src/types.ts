export interface CatReadOnly {
  id: string
  email: string
  name: string
  imgUrl: string
  comments?: unknown[]
}

export interface LoginResponse {
  token: string
}

export interface CommentDoc {
  _id: string
  author: string | { _id: string }
  contents: string
  likeCount: number | string
  info: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiErrorBody {
  success?: boolean
  message?: string | string[]
  error?: string
}

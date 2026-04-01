import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Layout() {
  const { user, logout, loading } = useAuth()

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden>
            🐱
          </span>
          Cats
        </Link>
        <nav className="nav" aria-label="주 메뉴">
          <NavLink to="/" end>
            홈
          </NavLink>
          <NavLink to="/cats">고양이</NavLink>
          <NavLink to="/comments">댓글</NavLink>
          {!loading && user ? (
            <>
              <NavLink to="/profile">내 프로필</NavLink>
              <button type="button" className="btn-text" onClick={logout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">로그인</NavLink>
              <NavLink to="/register" className="nav-cta">
                회원가입
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>
          NestJS Cats API · Swagger는{' '}
          <a href={`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api`} target="_blank" rel="noreferrer">
            /api
          </a>
        </p>
      </footer>
    </div>
  )
}

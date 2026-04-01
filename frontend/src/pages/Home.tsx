import { Link } from 'react-router-dom'

export function Home() {
  return (
    <section className="page home">
      <div className="hero-block">
        <p className="eyebrow">Cats example API</p>
        <h1>고양이 프로필과 댓글을 한곳에서</h1>
        <p className="lede">
          회원가입 후 로그인하면 내 프로필을 보고 이미지를 올릴 수 있고, 모든
          고양이 카드에 댓글을 남길 수 있습니다.
        </p>
        <div className="hero-actions">
          <Link to="/cats" className="btn primary">
            고양이 보기
          </Link>
          <Link to="/comments" className="btn secondary">
            댓글 보기
          </Link>
        </div>
      </div>
    </section>
  )
}

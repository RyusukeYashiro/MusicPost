import Link from "next/link";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="container">
      <div className="content">
        <h1>ようこそmusicPostへ!</h1>
        <p>アカウントにログインか、新規登録</p>
        <div className="button-container">
          <Link href="/Login">
            <button className="button login-button">ログイン</button>
          </Link>
          <Link href="/signUp">
            <button className="button signup-button">新規登録</button>
          </Link>
        </div>
        <footer>
          <a href="#" className="forgot-password">
            パスワードを忘れましたか？
          </a>
          <div>!パスワードはハッシュ化して保存!</div>
        </footer>
      </div>
    </div>
  );
};

export default Home;

import Link from "next/link";
import "../styles/Home.css";

const Home = () => {
    return (
        <div className="container">
            <div className="content">
                <h1>ようこそmusicPostへ!</h1>
                <div className="button-container">
                    <Link href="/login">
                        <button className="button login-button">ログイン</button>
                    </Link>
                    <Link href="/signUp">
                        <button className="button signup-button">新規登録</button>
                    </Link>
                </div>
                <footer>
                    <div>!パスワードはハッシュ化して保存!</div>
                </footer>
            </div>
        </div>
    );
};

export default Home;

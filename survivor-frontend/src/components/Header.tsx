import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";

const Header = () => {
  const router = useRouter();

  return (
    <nav className={styles.header}>
      <Link href="/">Oxfam Survivor's Community</Link>
      <div className={styles.links}>
        <Link
          href="/forum"
          className={router.pathname === "/forum" ? styles.active : ""}
        >
          Forum
        </Link>
        <Link
          href="/chat"
          className={router.pathname === "/chat" ? styles.active : ""}
        >
          Chat
        </Link>
      </div>
    </nav>
  );
};

export default Header;

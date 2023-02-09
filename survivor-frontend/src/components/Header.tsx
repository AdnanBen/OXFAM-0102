import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";

const Header = () => {
  const router = useRouter();

  return (
    <nav className={styles.header}>
      <Link href="/">Oxfam Survivor's Community</Link>
      <div className={styles.links}>
        {["Forum", "Chat", "Resources"].map((pagename) => {
          const pathname = `/${pagename.toLowerCase()}`;
          return (
            <Link
              href={pathname}
              className={router.pathname === pathname ? styles.active : ""}
            >
              {pagename}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Header;

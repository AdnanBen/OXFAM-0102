import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";

const Header = () => {
  const router = useRouter();

  return (
    <nav className={styles.header}>
      <Link href="/">Oxfam Survivors Community</Link>
      <div className={styles.links}>
        {["Forum", "Chat", "Resources", "Report"].map((pagename) => {
          const pathname = `/${pagename.toLowerCase()}`;
          return (
            <Link
              href={pathname}
              className={
                router.pathname.startsWith(pathname) ? styles.active : ""
              }
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

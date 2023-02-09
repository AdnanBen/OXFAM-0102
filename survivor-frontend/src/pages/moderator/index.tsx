import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const ModeratorsHome: NextPage = () => {
  return (
    <>
      <Head>
        <title>Oxfam Survivor's Community | Moderators</title>
      </Head>

      <main>
        <ul>
          <li>
            <Link href="/moderator/article-submission-form">
              Create new resource
            </Link>
          </li>
          <li>
            <Link href="/moderator/chat">Chat with survivors</Link>
          </li>
        </ul>
      </main>
    </>
  );
};

export default ModeratorsHome;

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [content, setContent] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/dashboard");
      const json = await res.json();

      if (json.content) {
        setContent(json.content);
      }
    };
    fetchData();
  }, [session]);

  if (typeof window !== "undefined" && status === "loading") return null;

  if (status === "unauthenticated") {
    return (
      <main>
        <div>
          <h1>You aren&apos;t signed in, please sign in first</h1>
        </div>
      </main>
    );
  }
  return (
    <main>
      <div>
        <h1> Protected Page</h1>
        <p>{content}</p>
      </div>
    </main>
  );
}
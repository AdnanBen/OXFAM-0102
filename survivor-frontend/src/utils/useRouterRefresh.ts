import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

// From https://github.com/vercel/next.js/discussions/12646#discussioncomment-2058235
export default function useRouterRefresh(props): [() => void, boolean] {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsRefreshing(false);
  }, [props]);

  const refresh = useCallback(() => {
    router.replace(router.asPath);
    setIsRefreshing(true);
  }, [router]);

  return [refresh, isRefreshing];
}

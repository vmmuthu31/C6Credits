import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const useRequireAuth = (redirectUrl = "/") => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  useLayoutEffect(() => {
    if (token === null) {
      router.push(redirectUrl);
    }
  }, [token, router, redirectUrl]);
  return { token, user };
};

export default useRequireAuth;

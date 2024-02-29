import { Fragment, FC, useEffect } from "react";

import { useRouter } from "@/navigation";
import { LayoutStore, UserStore } from "@/store";

interface IProps {
  children: React.ReactNode;
}

export const NeedAuthorization: FC<IProps> = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn } = UserStore();
  const loadUser = UserStore((state) => state.loadUser);
  const setIsLoading = LayoutStore((state) => state.setIsLoading);

  useEffect(() => {
    setIsLoading(true);
    loadUser();
    setIsLoading(false);

    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
  }, [loadUser, isLoggedIn]);

  return <Fragment>{children}</Fragment>;
};

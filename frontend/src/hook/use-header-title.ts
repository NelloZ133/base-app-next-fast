import { LayoutStore } from "@/store/";
import { useEffect } from "react";

function useHeaderTitle(header: string) {
  const setHeaderTitle = LayoutStore.getState().setHeaderTitle;

  useEffect(() => {
    setHeaderTitle(header);
  }, []);
}

export default useHeaderTitle;

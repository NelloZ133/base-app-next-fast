import { StateCreator } from "zustand";
import { ILayoutState } from "../interface/layout.interface";

export const LayoutSlice: StateCreator<ILayoutState> = (set) => ({
  isLoading: false,
  isFetched: false,
  headerTitle: "",
  backable: false,
  backTarget: undefined,

  setIsLoading(isLoading) {
    set({ isLoading });
  },
  setIsFetched(isFetched) {
    set({ isFetched });
  },
  setHeaderTitle(headerTitle) {
    set({ headerTitle });
  },
  setBackable(backable) {
    set({ backable });
  },
  setBackTarget(backTarget) {
    set({ backTarget });
  },
});

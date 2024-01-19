import { StateCreator } from "zustand";
import { IModeState } from "../interface/mode.interface";

export const ModeSlice: StateCreator<IModeState> = (set, get) => ({
  toggleMode: "light",
  queryParamsUrl: "",
  queryParamsValue: {},

  setToggleMode(toggleMode) {
    set({ toggleMode });
  },
  setQueryParamsUrl(queryParamsUrl) {
    set({ queryParamsUrl });
  },
  setQueryParamsValue(queryParamsValue) {
    set({ queryParamsValue });
  },
});

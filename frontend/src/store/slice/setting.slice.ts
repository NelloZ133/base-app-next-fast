import { StateCreator } from "zustand";
import { ISettingState } from "../interface/setting.interface";
import { fetchLine, fetchPosition, fetchSection } from "@/actions";

export const SettingSlice: StateCreator<ISettingState> = (set, get) => ({
  lines: [],
  positions: [],
  sections: [],

  setLines(lines) {
    set({ lines });
  },
  setPositions(positions) {
    set({ positions });
  },
  setSections(sections) {
    set({ sections });
  },

  fetchSettings: async () => {
    await Promise.all([fetchLine(), fetchPosition(), fetchSection()]);
  },
});

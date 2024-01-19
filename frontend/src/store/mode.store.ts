import { create } from "zustand";
import { IModeState } from "./interface/mode.interface";
import { ModeSlice } from "./slice/mode.slice";

export const ModeStore = create<IModeState>((...args) => ({
  ...ModeSlice(...args),
}));

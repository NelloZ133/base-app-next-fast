import { create } from "zustand";
import { ISettingState } from "./interface/setting.interface";
import { SettingSlice } from "./slice/setting.slice";

export const SettingStore = create<ISettingState>((...args) => ({
  ...SettingSlice(...args),
}));

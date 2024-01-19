import { create } from "zustand";
import { IUserState } from "./interface/user.interface";
import { UserSlice } from "./slice/user.slice";

export const UserStore = create<IUserState>((...args) => ({
  ...UserSlice(...args),
}));

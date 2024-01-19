import { StateCreator } from "zustand";
import { IUserState } from "../interface/user.interface";
import { onlyCapitalizeFirstLetter } from "@/functions";
import { User } from "@/types";
import { USER_STORAGE_KEY } from "@/constants";

export const UserSlice: StateCreator<IUserState> = (set, get) => ({
  user: null,
  avatarImage: undefined,

  username() {
    const user = get().user;
    return user ? `${user.firstname} ${user.lastname[0]}.` : "Guest";
  },

  shortname() {
    const user = get().user;
    return user ? `${onlyCapitalizeFirstLetter(user.firstname)} ${onlyCapitalizeFirstLetter(user.lastname)}` : "Guest";
  },

  isAdmin() {
    return get().user?.is_active || false;
  },

  isLoggedIn() {
    return get().user != null;
  },

  setUser(user: User) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    set({ user });
  },

  loadUser() {
    const userStr = localStorage.getItem(USER_STORAGE_KEY) ?? null;
    const user = userStr ? JSON.parse(userStr) : null;
    set({ user });
  },

  clearUser() {
    localStorage.removeItem(USER_STORAGE_KEY);
    set({ user: null });
  },
});

import { User } from "@/types";

export interface IUserState {
  user: User | null;
  avatarImage?: string;

  username: () => string;
  shortname: () => string;
  isAdmin: () => boolean;
  isLoggedIn: () => boolean;

  setUser: (user: User) => void;
  loadUser: () => void;
  clearUser: () => void;
}

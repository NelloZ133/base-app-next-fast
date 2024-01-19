import { ValueType } from "./common.type";

export interface ILoginResponse extends User {
  access_token: string;
}

export type User = {
  user_uuid: string;
  user_id: string;
  firstname: string;
  lastname: string;
  email: string | null;
  supervisor_email: string | null;
  manager_email: string | null;
  position_id: number;
  section_code: number;
  concern_line: number[];
  main_line: number;
  shift: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_admin: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export interface IForgotPasswordForm {
  user_id: string;
}

export interface IChangePasswordForm {
  current_pass: string;
  new_pass: string;
}

export interface IUserUpdateForm {
  user_id: string;
  user_uuid: string;
  firstname: string;
  lastname: string;
  email?: string | null;
  supervisor_email?: string | null;
  manager_email?: string | null;
  position_id: ValueType;
  section_code: ValueType;
  concern_line: ValueType[];
  main_line?: ValueType;
  shift: string;
}

export type UserUpdate = {
  user_uuid: string;
  user_id: string;
  user_pass: string;
  firstname: string;
  lastname: string;
  email?: string | null;
  supervisor_email?: string | null;
  manager_email?: string | null;
  app_line_id?: string;
  position_id: number;
  section_code: number;
  concern_line: number[];
  main_line?: number | null;
  shift: string;
  is_active: boolean;
  is_admin: boolean;
};

export type ChangePassword = {
  user_uuid: string;
  current_password: string;
  new_password: string;
};
